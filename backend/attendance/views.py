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
    StudentAbsenceFlag, StudentParentRelation, StudentEnrollment,
    AttendanceNotification
)
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
    StudentEnrollmentSerializer, StudentEnrollmentCreateSerializer,
    
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
    """Permission for teachers and admins"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['TEACHER', 'ADMIN']

class IsStudentOwnerOrTeacherOrAdmin(permissions.BasePermission):
    """Permission for student owners, teachers, and admins"""
    def has_permission(self, request, view):
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        if request.user.role in ['TEACHER', 'ADMIN']:
            return True
        if request.user.role == 'STUDENT':
            return obj.student == request.user
        return False

class IsParentOrTeacherOrAdmin(permissions.BasePermission):
    """Permission for parents, teachers, and admins"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['PARENT', 'TEACHER', 'ADMIN']

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
        
        if session.status not in ['in_progress', 'not_started']:
            return Response({'error': 'Cannot modify completed session'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
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
        """Send notifications to parents for absent students"""
        absent_records = session.attendance_records.filter(status='absent')
        
        for record in absent_records:
            # Get parent relationships
            parent_relations = StudentParentRelation.objects.filter(
                student=record.student,
                is_active=True,
                notify_absence=True
            ).select_related('parent')
            
            for relation in parent_relations:
                # Create notification
                AttendanceNotification.objects.create(
                    recipient=relation.parent,
                    student=record.student,
                    notification_type='absence',
                    title=f"إخطار غياب - Absence Alert: {record.student.full_name}",
                    message=f"تم تسجيل غياب {record.student.full_name} في حصة {session.timetable_session.subject.name} بتاريخ {session.date}",
                    attendance_record=record
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
        
        return queryset.order_by('-attendance_session__date')

# =====================================
# ABSENCE FLAG VIEWSET
# =====================================

class StudentAbsenceFlagViewSet(viewsets.ModelViewSet):
    """ViewSet for student absence flags"""
    queryset = StudentAbsenceFlag.objects.all()
    permission_classes = [IsTeacherOrAdmin]
    serializer_class = StudentAbsenceFlagSerializer
    
    def get_queryset(self):
        queryset = StudentAbsenceFlag.objects.select_related(
            'student', 'attendance_record__attendance_session__timetable_session__subject',
            'attendance_record__attendance_session__timetable_session__timetable__school_class',
            'cleared_by'
        )
        
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

# =====================================
# STUDENT ENROLLMENT VIEWSET
# =====================================

class StudentEnrollmentViewSet(viewsets.ModelViewSet):
    """ViewSet for student enrollments"""
    queryset = StudentEnrollment.objects.all()
    permission_classes = [IsTeacherOrAdmin]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return StudentEnrollmentCreateSerializer
        return StudentEnrollmentSerializer
    
    def get_queryset(self):
        queryset = StudentEnrollment.objects.select_related(
            'student', 'school_class', 'academic_year'
        )
        
        # Filter by class
        class_id = self.request.query_params.get('class_id')
        if class_id:
            queryset = queryset.filter(school_class_id=class_id)
        
        # Filter by student
        student_id = self.request.query_params.get('student_id')
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        
        # Filter by academic year
        year_id = self.request.query_params.get('academic_year')
        if year_id:
            queryset = queryset.filter(academic_year_id=year_id)
        
        # Active enrollments by default
        if self.request.query_params.get('include_inactive') != 'true':
            queryset = queryset.filter(is_active=True)
        
        return queryset.order_by('student__last_name', 'student__first_name')

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
    permission_classes = [IsTeacherOrAdmin]
    
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
