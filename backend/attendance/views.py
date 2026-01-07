# attendance/views.py

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
from django.db.models import Q, Count, Avg
from datetime import date, datetime, timedelta
from django.contrib.auth import get_user_model

from .models import (
    SchoolTimetable, TimetableSession, AttendanceSession, AttendanceRecord,
    StudentAbsenceFlag, StudentParentRelation, AttendanceNotification
)
from users.models import StudentEnrollment
from .serializers import (
    # Timetable Serializers
    SchoolTimetableSerializer, SchoolTimetableCreateSerializer,
    TimetableSessionListSerializer, TimetableSessionDetailSerializer,
    TimetableSessionCreateSerializer,
    
    # Attendance Serializers
    AttendanceSessionListSerializer, AttendanceSessionDetailSerializer,
    AttendanceSessionCreateSerializer, StartAttendanceSerializer,
    CompleteAttendanceSerializer,
    
    # Record Serializers
    AttendanceRecordSerializer, AttendanceRecordUpdateSerializer,
    BulkAttendanceUpdateSerializer,
    
    # Flag and Relationship Serializers
    StudentAbsenceFlagSerializer, ClearAbsenceFlagSerializer,
    StudentParentRelationSerializer, StudentParentRelationCreateSerializer,
    
    # Notification and Statistics Serializers
    AttendanceNotificationSerializer, AttendanceStatisticsSerializer,
    ClassAttendanceReportSerializer, StudentAttendanceHistorySerializer,
    TodaySessionsSerializer
)

User = get_user_model()

# =====================================
# PERMISSION CLASSES
# =====================================

class IsTeacherOrAdmin(permissions.BasePermission):
    """Permission for teachers, admins, and management staff (Director, Assistant, Supervisor)"""
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Allow ADMIN and TEACHER
        if request.user.role in ['TEACHER', 'ADMIN']:
            return True
        
        # Allow management staff (DIRECTOR, ASSISTANT, GENERAL_SUPERVISOR)
        if request.user.role == 'STAFF' and hasattr(request.user, 'profile'):
            management_positions = ['DIRECTOR', 'ASSISTANT', 'GENERAL_SUPERVISOR']
            if request.user.profile.position in management_positions:
                return True
        
        return False

class IsStudentOwnerOrTeacherOrAdmin(permissions.BasePermission):
    """Permission for student owners, parents, teachers, admins, and management staff"""
    def has_permission(self, request, view):
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Allow ADMIN and TEACHER full access
        if request.user.role in ['TEACHER', 'ADMIN']:
            return True
        
        # Allow management staff
        if request.user.role == 'STAFF' and hasattr(request.user, 'profile'):
            management_positions = ['DIRECTOR', 'ASSISTANT', 'GENERAL_SUPERVISOR']
            if request.user.profile.position in management_positions:
                return True
        
        # Get student
        student = getattr(obj, 'student', None)
        if isinstance(obj, User) and obj.role == 'STUDENT':
            student = obj
        
        if not student:
            return False

        # Students can only view their own records
        if request.user.role == 'STUDENT':
            return student == request.user
            
        # Parents can view their children's records
        if request.user.role == 'PARENT':
            # Check direct link
            if student.parent == request.user:
                return True
            # Check relationship table
            return StudentParentRelation.objects.filter(
                student=student, parent=request.user, is_active=True
            ).exists()
        
        return False

class IsParentOrTeacherOrAdmin(permissions.BasePermission):
    """Permission for parents, teachers, admins, and management staff"""
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Allow PARENT, TEACHER, ADMIN
        if request.user.role in ['PARENT', 'TEACHER', 'ADMIN']:
            return True
        
        # Allow management staff
        if request.user.role == 'STAFF' and hasattr(request.user, 'profile'):
            management_positions = ['DIRECTOR', 'ASSISTANT', 'GENERAL_SUPERVISOR']
            if request.user.profile.position in management_positions:
                return True
        
        return False


# =====================================
# TIMETABLE VIEWSETS
# =====================================

class SchoolTimetableViewSet(viewsets.ModelViewSet):
    """ViewSet for school timetables"""
    queryset = SchoolTimetable.objects.all()
    permission_classes = [IsTeacherOrAdmin]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return SchoolTimetableCreateSerializer
        return SchoolTimetableSerializer
    
    def get_queryset(self):
        queryset = SchoolTimetable.objects.select_related(
            'school_class', 'academic_year', 'created_by'
        ).prefetch_related('sessions__subject', 'sessions__teacher')
        
        # Filter by class if provided
        class_id = self.request.query_params.get('class_id')
        if class_id:
            queryset = queryset.filter(school_class_id=class_id)
        
        # Filter by academic year if provided
        year_id = self.request.query_params.get('academic_year')
        if year_id:
            queryset = queryset.filter(academic_year_id=year_id)
        
        # Only active timetables by default
        if self.request.query_params.get('include_inactive') != 'true':
            queryset = queryset.filter(is_active=True)
        
        return queryset

class TimetableSessionViewSet(viewsets.ModelViewSet):
    """ViewSet for timetable sessions"""
    queryset = TimetableSession.objects.all()
    permission_classes = [IsTeacherOrAdmin]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TimetableSessionListSerializer
        elif self.action == 'create':
            return TimetableSessionCreateSerializer
        return TimetableSessionDetailSerializer
    
    def get_queryset(self):
        queryset = TimetableSession.objects.select_related(
            'timetable__school_class', 'subject', 'teacher', 'room'
        ).filter(is_active=True)
        
        # Filter by timetable
        timetable_id = self.request.query_params.get('timetable')
        if timetable_id:
            queryset = queryset.filter(timetable_id=timetable_id)
        
        # Filter by teacher (for teacher's schedule)
        if self.request.user.role == 'TEACHER':
            teacher_filter = self.request.query_params.get('my_sessions')
            if teacher_filter == 'true':
                queryset = queryset.filter(teacher=self.request.user)
        
        # Filter by day
        day = self.request.query_params.get('day')
        if day:
            queryset = queryset.filter(day_of_week=day)
        
        return queryset.order_by('day_of_week', 'session_order')

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_schedule(self, request):
        """Get the current student's weekly timetable sessions.
        Returns sessions for the student's active enrollment class and academic year.
        """
        user = request.user
        if getattr(user, 'role', None) != 'STUDENT':
            return Response({'error': 'Only students can access this endpoint'}, status=status.HTTP_403_FORBIDDEN)

        enrollment = (StudentEnrollment.objects
                       .select_related('school_class', 'academic_year')
                       .filter(student=user, is_active=True)
                       .first())

        if not enrollment:
            return Response({'sessions': [], 'message': 'No active enrollment found'}, status=status.HTTP_200_OK)

        sessions = (TimetableSession.objects
                    .select_related('timetable__school_class', 'subject', 'teacher', 'room')
                    .filter(
                        timetable__school_class=enrollment.school_class,
                        timetable__academic_year=enrollment.academic_year,
                        is_active=True
                    )
                    .order_by('day_of_week', 'session_order'))

        serializer = TimetableSessionListSerializer(sessions, many=True)
        return Response({
            'class': {
                'id': enrollment.school_class.id,
                'name': enrollment.school_class.name,
                'section': getattr(enrollment.school_class, 'section', None),
            },
            'academic_year': getattr(enrollment.academic_year, 'year', None),
            'sessions': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def today_sessions(self, request):
        """Get today's sessions for the current teacher"""
        if request.user.role != 'TEACHER':
            return Response({'error': 'Only teachers can access this endpoint'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        today = date.today()
        weekday = today.isoweekday()  # 1=Monday, 7=Sunday
        
        # Adjust for our model (1=Monday, 6=Saturday)
        if weekday == 7:  # Sunday
            return Response({'sessions': []})  # No school on Sunday
        
        sessions = TimetableSession.objects.filter(
            teacher=request.user,
            day_of_week=weekday,
            is_active=True
        ).select_related(
            'timetable__school_class', 'subject', 'room'
        ).order_by('session_order')
        
        serializer = TodaySessionsSerializer(sessions, many=True)
        return Response({'sessions': serializer.data})
    
    @action(detail=False, methods=['get'])
    def teacher_classes(self, request):
        """Get all classes assigned to the current teacher"""
        print(f"DEBUG: teacher_classes called by user: {request.user} (role: {getattr(request.user, 'role', 'No role')})")
        
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, 
                          status=status.HTTP_401_UNAUTHORIZED)
                          
        if request.user.role != 'TEACHER':
            return Response({'error': 'Only teachers can access this endpoint'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        # Get unique classes for this teacher through timetable sessions
        from schools.models import SchoolClass
        print(f"DEBUG: Looking for classes for teacher: {request.user.id}")
        
        classes = SchoolClass.objects.filter(
            timetables__sessions__teacher=request.user,
            timetables__sessions__is_active=True,
            timetables__is_active=True
        ).distinct().select_related(
            'grade__educational_level',
            'track'
        ).prefetch_related(
            'student_enrollments__student',
            'timetables__sessions__subject'
        )
        
        print(f"DEBUG: Found {classes.count()} classes for teacher")
        
        # Format the response
        classes_data = []
        for school_class in classes:
            # Get active students
            active_students = school_class.student_enrollments.filter(
                is_active=True
            ).select_related('student')
            
            # Get subjects taught by this teacher in this class
            teacher_subjects = TimetableSession.objects.filter(
                teacher=request.user,
                timetable__school_class=school_class,
                is_active=True
            ).values(
                'subject__id', 'subject__name', 'subject__name_arabic', 'subject__code'
            ).distinct()
            
            # Get weekly sessions count
            weekly_sessions = TimetableSession.objects.filter(
                teacher=request.user,
                timetable__school_class=school_class,
                is_active=True
            ).count()
            
            classes_data.append({
                'id': school_class.id,
                'name': school_class.name,
                'section': school_class.section,
                'grade': {
                    'id': school_class.grade.id,
                    'name': school_class.grade.name,
                    'grade_number': school_class.grade.grade_number,
                    'educational_level': {
                        'id': school_class.grade.educational_level.id,
                        'name': school_class.grade.educational_level.name,
                        'level': school_class.grade.educational_level.level
                    }
                },
                'track': {
                    'id': school_class.track.id,
                    'name': school_class.track.name,
                    'code': school_class.track.code
                } if school_class.track else None,
                'student_count': active_students.count(),
                'students': [
                    {
                        'id': enrollment.student.id,
                        'full_name': enrollment.student.full_name,
                        'first_name': enrollment.student.first_name,
                        'last_name': enrollment.student.last_name,
                        'student_number': enrollment.student_number,
                        'enrollment_date': enrollment.enrollment_date
                    }
                    for enrollment in active_students
                ],
                'subjects_taught': list(teacher_subjects),
                'weekly_sessions': weekly_sessions,
                'academic_year': {
                    'id': school_class.timetables.filter(is_active=True).first().academic_year.id,
                    'year': school_class.timetables.filter(is_active=True).first().academic_year.year
                } if school_class.timetables.filter(is_active=True).exists() else None
            })
        
        print(f"DEBUG: Returning {len(classes_data)} classes data")
        return Response({
            'classes': classes_data,
            'total_classes': len(classes_data)
        })

# =====================================
# ATTENDANCE SESSION VIEWSETS
# =====================================

class AttendanceSessionViewSet(viewsets.ModelViewSet):
    """ViewSet for attendance sessions"""
    queryset = AttendanceSession.objects.all()
    permission_classes = [IsTeacherOrAdmin]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return AttendanceSessionListSerializer
        elif self.action == 'create':
            return AttendanceSessionCreateSerializer
        return AttendanceSessionDetailSerializer
    
    def get_queryset(self):
        queryset = AttendanceSession.objects.select_related(
            'timetable_session__timetable__school_class',
            'timetable_session__subject',
            'teacher'
        ).prefetch_related('attendance_records__student')
        
        # Filter by teacher (teachers see only their sessions)
        if self.request.user.role == 'TEACHER':
            queryset = queryset.filter(teacher=self.request.user)
        
        # Filter by date
        date_filter = self.request.query_params.get('date')
        if date_filter:
            queryset = queryset.filter(date=date_filter)
        
        # Filter by class
        class_id = self.request.query_params.get('class_id')
        if class_id:
            queryset = queryset.filter(timetable_session__timetable__school_class_id=class_id)
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset.order_by('-date', '-created_at')
    
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Start taking attendance for a session"""
        session = self.get_object()
        
        if session.teacher != request.user and request.user.role != 'ADMIN':
            return Response({'error': 'Only the assigned teacher can start attendance'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        if session.status != 'not_started':
            return Response({'error': f'Session is already {session.status}'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Start the session
        session.start_session()
        
        serializer = self.get_serializer(session)
        return Response({
            'message': 'Attendance session started successfully',
            'session': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Complete attendance session"""
        session = self.get_object()
        serializer = CompleteAttendanceSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        if session.teacher != request.user and request.user.role != 'ADMIN':
            return Response({'error': 'Only the assigned teacher can complete attendance'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        if session.status != 'in_progress':
            return Response({'error': f'Session is {session.status}, cannot complete'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Update notes if provided
        if serializer.validated_data.get('notes'):
            session.notes = serializer.validated_data['notes']
            session.save()
        
        # Complete the session
        session.complete_session()
        
        # Send notifications to parents for absent students
        self._send_absence_notifications(session)
        
        serializer = self.get_serializer(session)
        return Response({
            'message': 'Attendance session completed successfully',
            'session': serializer.data
        })
    
    @action(detail=True, methods=['get'])
    def students(self, request, pk=None):
        """Get student list for attendance session"""
        session = self.get_object()
        
        if session.teacher != request.user and request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
        
        records = session.attendance_records.select_related('student').order_by(
            'student__last_name', 'student__first_name'
        )
        
        serializer = AttendanceRecordSerializer(records, many=True)
        return Response({'students': serializer.data})
    
    @action(detail=True, methods=['post'])
    def bulk_mark(self, request, pk=None):
        """Bulk update attendance records"""
        session = self.get_object()
        serializer = BulkAttendanceUpdateSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        if session.teacher != request.user and request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Allow editing completed sessions (teachers can correct mistakes)
        # if session.status not in ['in_progress', 'not_started']:
        #     return Response({'error': 'Cannot modify completed session'},
        #                   status=status.HTTP_400_BAD_REQUEST)
        
        # Start session if not started
        if session.status == 'not_started':
            session.start_session()
        
        records_data = serializer.validated_data['records']
        updated_records = []
        
        with transaction.atomic():
            for record_data in records_data:
                try:
                    record = AttendanceRecord.objects.get(
                        attendance_session=session,
                        student_id=record_data['student_id']
                    )
                    record.status = record_data['status']
                    record.marked_by = request.user
                    
                    # Handle arrival time for late students
                    if record_data['status'] == 'late' and 'arrival_time' in record_data:
                        record.arrival_time = record_data['arrival_time']
                    
                    # Handle notes
                    if 'notes' in record_data:
                        record.notes = record_data['notes']
                    
                    record.save()
                    updated_records.append(record)
                    
                except AttendanceRecord.DoesNotExist:
                    return Response({
                        'error': f'Student with ID {record_data["student_id"]} not found in this session'
                    }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = AttendanceRecordSerializer(updated_records, many=True)
        return Response({
            'message': f'Updated {len(updated_records)} attendance records',
            'records': serializer.data
        })
    
    def _send_absence_notifications(self, session):
        """Send notifications to admins, supervisors, students, and parents for absent students"""
        from communication.models import Notification
        
        absent_records = session.attendance_records.filter(status='absent')
        if not absent_records.exists():
            return

        subject_name = session.timetable_session.subject.name
        session_date = session.date
        
        # Get Admins and General Supervisors
        staff_recipients = User.objects.filter(
            Q(role='ADMIN') | Q(role='STAFF', profile__position='GENERAL_SUPERVISOR'),
            is_active=True
        ).distinct()
        
        for record in absent_records:
            student_name = record.student.full_name
            title = f"Absence Alert: {student_name}"
            message = f"the student {student_name} is absent in the session :{subject_name}"
            
            # 1. Notify Admins and General Supervisors
            for staff in staff_recipients:
                Notification.objects.create(
                    recipient=staff,
                    title=title,
                    message=message,
                    notification_type=Notification.Type.SYSTEM,
                    related_object_id=record.id,
                    related_object_type='attendance_record'
                )
            
            # 2. Notify the Student
            if record.student.is_active:
                Notification.objects.create(
                    recipient=record.student,
                    title="Absence Alert",
                    message=f"You were marked absent in the session :{subject_name} on {session_date}",
                    notification_type=Notification.Type.SYSTEM,
                    related_object_id=record.id,
                    related_object_type='attendance_record'
                )

            # 3. Notify Parents
            parent_relations = StudentParentRelation.objects.filter(
                student=record.student,
                is_active=True,
                notify_absence=True
            ).select_related('parent')
            
            # Keep track of parents already notified to avoid duplicates
            notified_parent_ids = set()

            for relation in parent_relations:
                # Create legacy AttendanceNotification (for specific reports/history)
                AttendanceNotification.objects.create(
                    recipient=relation.parent,
                    student=record.student,
                    notification_type='absence',
                    title=f"إخطار غياب - Absence Alert: {student_name}",
                    message=f"تم تسجيل غياب {student_name} في حصة {subject_name} بتاريخ {session_date}",
                    attendance_record=record
                )
                
                # Create communication.Notification for the bell icon
                Notification.objects.create(
                    recipient=relation.parent,
                    title=title,
                    message=message,
                    notification_type=Notification.Type.SYSTEM,
                    related_object_id=record.id,
                    related_object_type='attendance_record'
                )
                notified_parent_ids.add(relation.parent.id)

            # Fallback: Notify the parent linked directly to the student if not already notified
            if record.student.parent and record.student.parent.id not in notified_parent_ids:
                parent = record.student.parent
                
                # Create legacy AttendanceNotification (for specific reports/history)
                AttendanceNotification.objects.create(
                    recipient=parent,
                    student=record.student,
                    notification_type='absence',
                    title=f"إخطار غياب - Absence Alert: {student_name}",
                    message=f"تم تسجيل غياب {student_name} في حصة {subject_name} بتاريخ {session_date}",
                    attendance_record=record
                )
                
                # Create communication.Notification for the bell icon
                Notification.objects.create(
                    recipient=parent,
                    title=title,
                    message=message,
                    notification_type=Notification.Type.SYSTEM,
                    related_object_id=record.id,
                    related_object_type='attendance_record'
                )
    
# =====================================
# ATTENDANCE RECORD VIEWSET
# =====================================

class AttendanceRecordViewSet(viewsets.ModelViewSet):
    """ViewSet for attendance records"""
    queryset = AttendanceRecord.objects.all()
    permission_classes = [IsStudentOwnerOrTeacherOrAdmin]
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return AttendanceRecordUpdateSerializer
        return AttendanceRecordSerializer
    
    def get_queryset(self):
        queryset = AttendanceRecord.objects.select_related(
            'student', 'attendance_session__timetable_session__subject',
            'attendance_session__timetable_session__timetable__school_class',
            'marked_by'
        )
        
        # Students can only see their own records
        if self.request.user.role == 'STUDENT':
            queryset = queryset.filter(student=self.request.user)
        
        # Parents can see their children's records
        elif self.request.user.role == 'PARENT':
            child_ids = StudentParentRelation.objects.filter(
                parent=self.request.user, is_active=True
            ).values_list('student_id', flat=True)
            
            queryset = queryset.filter(
                Q(student_id__in=child_ids) | Q(student__parent=self.request.user)
            )
        
        # Filter by student
        student_id = self.request.query_params.get('student_id')
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(attendance_session__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(attendance_session__date__lte=end_date)
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        # Additional contextual filters
        class_id = self.request.query_params.get('class_id')
        if class_id:
            queryset = queryset.filter(
                attendance_session__timetable_session__timetable__school_class_id=class_id
            )

        grade_id = self.request.query_params.get('grade_id')
        if grade_id:
            queryset = queryset.filter(
                attendance_session__timetable_session__timetable__school_class__grade_id=grade_id
            )

        track_id = self.request.query_params.get('track_id')
        if track_id:
            queryset = queryset.filter(
                attendance_session__timetable_session__timetable__school_class__track_id=track_id
            )

        subject_id = self.request.query_params.get('subject_id')
        if subject_id:
            queryset = queryset.filter(
                attendance_session__timetable_session__subject_id=subject_id
            )

        teacher_id = self.request.query_params.get('teacher_id')
        if teacher_id:
            queryset = queryset.filter(attendance_session__teacher_id=teacher_id)

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(student__first_name__icontains=search)
                | Q(student__last_name__icontains=search)
                | Q(student__profile__ar_first_name__icontains=search)
                | Q(student__profile__ar_last_name__icontains=search)
                | Q(attendance_session__timetable_session__timetable__school_class__name__icontains=search)
            )
        
        return queryset.order_by('-attendance_session__date')

    @action(detail=False, methods=['get'], url_path='student-statistics/(?P<student_id>[^/.]+)')
    def student_statistics(self, request, student_id=None):
        """Get attendance statistics for a specific student"""
        from decimal import Decimal
        from datetime import datetime, timedelta

        # Get date range from query params
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        subject_id = request.query_params.get('subject_id')

        # Check permissions for parents
        if request.user.role == 'PARENT':
            is_parent = StudentParentRelation.objects.filter(
                student_id=student_id, parent=request.user, is_active=True
            ).exists() or User.objects.filter(id=student_id, parent=request.user).exists()
            
            if not is_parent:
                return Response({'error': 'Access denied to this student\'s data'}, 
                              status=status.HTTP_403_FORBIDDEN)
        elif request.user.role == 'STUDENT' and str(request.user.id) != str(student_id):
            return Response({'error': 'You can only view your own statistics'}, 
                          status=status.HTTP_403_FORBIDDEN)

        # Build queryset
        queryset = AttendanceRecord.objects.filter(student_id=student_id)

        if start_date:
            queryset = queryset.filter(attendance_session__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(attendance_session__date__lte=end_date)
        if subject_id:
            queryset = queryset.filter(attendance_session__timetable_session__subject_id=subject_id)

        # Get statistics
        from django.db.models import Count, Q

        stats = queryset.aggregate(
            total=Count('id'),
            present=Count('id', filter=Q(status='present')),
            absent=Count('id', filter=Q(status='absent')),
            late=Count('id', filter=Q(status='late')),
            excused=Count('id', filter=Q(status='excused'))
        )

        total = stats['total'] or 0
        present = stats['present'] or 0
        absent = stats['absent'] or 0
        late = stats['late'] or 0
        excused = stats['excused'] or 0

        # Calculate percentages
        presence_rate = round((present / total * 100), 2) if total > 0 else 0
        attendance_rate = round(((present + late) / total * 100), 2) if total > 0 else 0
        absence_rate = round((absent / total * 100), 2) if total > 0 else 0
        punctuality_rate = round((present / (present + late) * 100), 2) if (present + late) > 0 else 0

        # Get student info
        try:
            student = User.objects.get(id=student_id)
            student_name = student.full_name
        except User.DoesNotExist:
            student_name = "Unknown Student"

        # Find consecutive absences
        recent_records = queryset.order_by('-attendance_session__date')[:10]
        consecutive_absences = 0
        for record in recent_records:
            if record.status == 'absent':
                consecutive_absences += 1
            else:
                break

        # Get last absence date
        last_absence = queryset.filter(status='absent').order_by('-attendance_session__date').first()
        last_absence_date = last_absence.attendance_session.date if last_absence else None

        # Monthly breakdown (last 6 months)
        monthly_breakdown = []
        if total > 0:
            from dateutil.relativedelta import relativedelta
            from django.utils import timezone

            today = timezone.now().date()
            for i in range(5, -1, -1):
                month_start = (today - relativedelta(months=i)).replace(day=1)
                month_end = (month_start + relativedelta(months=1)) - timedelta(days=1)

                month_stats = queryset.filter(
                    attendance_session__date__gte=month_start,
                    attendance_session__date__lte=month_end
                ).aggregate(
                    total=Count('id'),
                    present=Count('id', filter=Q(status='present')),
                    absent=Count('id', filter=Q(status='absent')),
                    late=Count('id', filter=Q(status='late'))
                )

                month_total = month_stats['total'] or 0
                if month_total > 0:
                    monthly_breakdown.append({
                        'month': month_start.strftime('%Y-%m'),
                        'month_name': month_start.strftime('%B %Y'),
                        'total': month_total,
                        'present': month_stats['present'],
                        'absent': month_stats['absent'],
                        'late': month_stats['late'],
                        'attendance_rate': round(((month_stats['present'] + month_stats['late']) / month_total * 100), 2)
                    })

        # Subject breakdown
        subject_breakdown = []
        subject_stats = queryset.values(
            'attendance_session__timetable_session__subject__id',
            'attendance_session__timetable_session__subject__name'
        ).annotate(
            total=Count('id'),
            present=Count('id', filter=Q(status='present')),
            absent=Count('id', filter=Q(status='absent')),
            late=Count('id', filter=Q(status='late'))
        )

        for subject in subject_stats:
            subject_total = subject['total'] or 0
            if subject_total > 0:
                subject_breakdown.append({
                    'subject_id': subject['attendance_session__timetable_session__subject__id'],
                    'subject_name': subject['attendance_session__timetable_session__subject__name'],
                    'total': subject_total,
                    'present': subject['present'],
                    'absent': subject['absent'],
                    'late': subject['late'],
                    'attendance_rate': round(((subject['present'] + subject['late']) / subject_total * 100), 2)
                })

        # Recent attendance history
        recent_history = []
        for record in recent_records[:10]:
            recent_history.append({
                'date': record.attendance_session.date,
                'subject_name': record.attendance_session.timetable_session.subject.name if record.attendance_session.timetable_session else 'N/A',
                'status': record.status,
                'status_display': record.get_status_display(),
                'notes': record.notes or ''
            })

        return Response({
            'student_id': int(student_id),
            'student_name': student_name,
            'total_sessions': total,
            'present_count': present,
            'absent_count': absent,
            'late_count': late,
            'excused_count': excused,
            'presence_rate': float(presence_rate),
            'attendance_rate': float(attendance_rate),
            'absence_rate': float(absence_rate),
            'punctuality_rate': float(punctuality_rate),
            'consecutive_absences': consecutive_absences,
            'last_absence_date': last_absence_date,
            'monthly_breakdown': monthly_breakdown,
            'subject_breakdown': subject_breakdown,
            'recent_history': recent_history
        })

# =====================================
# ABSENCE FLAG VIEWSET
# =====================================

class StudentAbsenceFlagViewSet(viewsets.ModelViewSet):
    """ViewSet for student absence flags"""
    queryset = StudentAbsenceFlag.objects.all()
    permission_classes = [IsParentOrTeacherOrAdmin]
    serializer_class = StudentAbsenceFlagSerializer
    
    def get_queryset(self):
        queryset = StudentAbsenceFlag.objects.select_related(
            'student', 'attendance_record__attendance_session__timetable_session__subject',
            'attendance_record__attendance_session__timetable_session__timetable__school_class',
            'cleared_by'
        )
        
        # Parents can see their children's flags
        if self.request.user.role == 'PARENT':
            child_ids = StudentParentRelation.objects.filter(
                parent=self.request.user, is_active=True
            ).values_list('student_id', flat=True)
            
            queryset = queryset.filter(
                Q(student_id__in=child_ids) | Q(student__parent=self.request.user)
            )
        # Students can see their own flags
        elif self.request.user.role == 'STUDENT':
            queryset = queryset.filter(student=self.request.user)
        
        # Filter by student
        student_id = self.request.query_params.get('student_id')
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        
        # Filter by cleared status
        is_cleared = self.request.query_params.get('is_cleared')
        if is_cleared is not None:
            queryset = queryset.filter(is_cleared=is_cleared.lower() == 'true')
        
        return queryset.order_by('-created_at')
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get pending flags that need clearance"""
        flags = self.get_queryset().filter(is_cleared=False)
        serializer = self.get_serializer(flags, many=True)
        return Response({'pending_flags': serializer.data})
    
    @action(detail=True, methods=['post'])
    def clear(self, request, pk=None):
        """Clear an absence flag"""
        flag = self.get_object()
        serializer = ClearAbsenceFlagSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        if flag.is_cleared:
            return Response({'error': 'Flag is already cleared'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Clear the flag
        flag.clear_flag(
            cleared_by=request.user,
            reason=serializer.validated_data['clearance_reason'],
            notes=serializer.validated_data.get('clearance_notes', ''),
            document=serializer.validated_data.get('clearance_document')
        )
        
        # Send notification to parent
        self._send_flag_cleared_notification(flag)
        
        serializer = self.get_serializer(flag)
        return Response({
            'message': 'Absence flag cleared successfully',
            'flag': serializer.data
        })
    
    def _send_flag_cleared_notification(self, flag):
        """Send notification when flag is cleared"""
        parent_relations = StudentParentRelation.objects.filter(
            student=flag.student,
            is_active=True,
            notify_flags=True
        ).select_related('parent')
        
        for relation in parent_relations:
            AttendanceNotification.objects.create(
                recipient=relation.parent,
                student=flag.student,
                notification_type='flag_cleared',
                title=f"تم حل علامة الغياب - Flag Cleared: {flag.student.full_name}",
                message=f"تم حل علامة غياب {flag.student.full_name} للتاريخ {flag.attendance_record.attendance_session.date}",
                absence_flag=flag
            )

# =====================================
# STUDENT-PARENT RELATIONSHIP VIEWSET
# =====================================

class StudentParentRelationViewSet(viewsets.ModelViewSet):
    """ViewSet for student-parent relationships"""
    queryset = StudentParentRelation.objects.all()
    permission_classes = [IsParentOrTeacherOrAdmin]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return StudentParentRelationCreateSerializer
        return StudentParentRelationSerializer
    
    def get_queryset(self):
        queryset = StudentParentRelation.objects.select_related('student', 'parent')
        
        # Parents can only see their own relationships
        if self.request.user.role == 'PARENT':
            queryset = queryset.filter(parent=self.request.user)
        
        # Filter by student
        student_id = self.request.query_params.get('student_id')
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        
        # Filter by parent
        parent_id = self.request.query_params.get('parent_id')
        if parent_id:
            queryset = queryset.filter(parent_id=parent_id)
        
        return queryset.filter(is_active=True)

# StudentEnrollmentViewSet moved to users.views

# =====================================
# NOTIFICATION VIEWSET
# =====================================

class AttendanceNotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for attendance notifications"""
    queryset = AttendanceNotification.objects.all()
    serializer_class = AttendanceNotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = AttendanceNotification.objects.select_related(
            'recipient', 'student', 'attendance_record', 'absence_flag'
        )
        
        # Users can only see their own notifications
        if self.request.user.role == 'PARENT':
            queryset = queryset.filter(recipient=self.request.user)
        elif self.request.user.role == 'STUDENT':
            queryset = queryset.filter(student=self.request.user)
        elif self.request.user.role not in ['TEACHER', 'ADMIN']:
            queryset = queryset.none()
        
        # Filter by type
        notification_type = self.request.query_params.get('type')
        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)
        
        # Filter by read status
        is_read = self.request.query_params.get('is_read')
        if is_read is not None:
            if is_read.lower() == 'true':
                queryset = queryset.filter(read_at__isnull=False)
            else:
                queryset = queryset.filter(read_at__isnull=True)
        
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark notification as read"""
        notification = self.get_object()
        
        if notification.recipient != request.user:
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
        
        notification.mark_as_read()
        
        return Response({'message': 'Notification marked as read'})

# =====================================
# STATISTICS AND REPORTS VIEWSETS
# =====================================

class AttendanceReportsViewSet(viewsets.ViewSet):
    """ViewSet for attendance reports and statistics"""
    permission_classes = [IsParentOrTeacherOrAdmin]
    
    @action(detail=False, methods=['get'])
    def class_statistics(self, request):
        """Get attendance statistics for a class"""
        class_id = request.query_params.get('class_id')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not class_id:
            return Response({'error': 'class_id is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Build query
        query = Q(
            attendance_session__timetable_session__timetable__school_class_id=class_id
        )
        
        if start_date:
            query &= Q(attendance_session__date__gte=start_date)
        if end_date:
            query &= Q(attendance_session__date__lte=end_date)
        
        # Get statistics
        records = AttendanceRecord.objects.filter(query).select_related('student')
        
        # Group by student
        student_stats = {}
        for record in records:
            student_id = record.student.id
            if student_id not in student_stats:
                student_stats[student_id] = {
                    'student_id': student_id,
                    'student_name': record.student.full_name,
                    'total_sessions': 0,
                    'present_count': 0,
                    'absent_count': 0,
                    'late_count': 0,
                    'excused_count': 0
                }
            
            student_stats[student_id]['total_sessions'] += 1
            student_stats[student_id][f'{record.status}_count'] += 1
        
        # Calculate percentages
        for stats in student_stats.values():
            if stats['total_sessions'] > 0:
                stats['attendance_percentage'] = round(
                    (stats['present_count'] + stats['late_count']) / stats['total_sessions'] * 100, 2
                )
            else:
                stats['attendance_percentage'] = 0
        
        serializer = AttendanceStatisticsSerializer(list(student_stats.values()), many=True)
        return Response({'statistics': serializer.data})
    
    @action(detail=False, methods=['get'])
    def student_history(self, request):
        """Get attendance history for a student"""
        student_id = request.query_params.get('student_id')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not student_id:
            return Response({'error': 'student_id is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Check permissions for parents and students
        if request.user.role == 'PARENT':
            is_parent = StudentParentRelation.objects.filter(
                student_id=student_id, parent=request.user, is_active=True
            ).exists() or User.objects.filter(id=student_id, parent=request.user).exists()
            
            if not is_parent:
                return Response({'error': 'Access denied to this student\'s history'}, 
                              status=status.HTTP_403_FORBIDDEN)
        elif request.user.role == 'STUDENT' and str(request.user.id) != str(student_id):
            return Response({'error': 'You can only view your own history'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        # Build query
        query = Q(student_id=student_id)
        
        if start_date:
            query &= Q(attendance_session__date__gte=start_date)
        if end_date:
            query &= Q(attendance_session__date__lte=end_date)
        
        # Get records
        records = AttendanceRecord.objects.filter(query).select_related(
            'attendance_session__timetable_session__subject',
            'marked_by'
        ).order_by('-attendance_session__date')
        
        # Format data
        history_data = []
        for record in records:
            history_data.append({
                'date': record.attendance_session.date,
                'subject_name': record.attendance_session.timetable_session.subject.name,
                'status': record.status,
                'status_display': record.get_status_display(),
                'marked_at': record.marked_at,
                'teacher_name': record.marked_by.full_name,
                'notes': record.notes
            })
        
        serializer = StudentAttendanceHistorySerializer(history_data, many=True)
        return Response({'history': serializer.data})
    
    @action(detail=False, methods=['get'])
    def daily_report(self, request):
        """Get daily attendance report for a class"""
        class_id = request.query_params.get('class_id')
        date_param = request.query_params.get('date', date.today())
        
        if not class_id:
            return Response({'error': 'class_id is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Get sessions for the day
        sessions = AttendanceSession.objects.filter(
            timetable_session__timetable__school_class_id=class_id,
            date=date_param
        )
        
        report_data = []
        for session in sessions:
            total_students = session.total_students
            present_count = session.present_count
            absent_count = session.absent_count
            late_count = session.late_count
            
            attendance_percentage = 0
            if total_students > 0:
                attendance_percentage = round((present_count + late_count) / total_students * 100, 2)
            
            report_data.append({
                'date': session.date,
                'total_students': total_students,
                'present_count': present_count,
                'absent_count': absent_count,
                'late_count': late_count,
                'attendance_percentage': attendance_percentage
            })
        
        serializer = ClassAttendanceReportSerializer(report_data, many=True)
        return Response({'report': serializer.data})
