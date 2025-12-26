# lessons/views.py

from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Sum
from django.utils import timezone
from schools.models import Subject, Grade, SchoolClass
from .models import Lesson, LessonResource, LessonTag, LessonAvailability, SubjectCategory
from .serializers import (
    LessonSerializer,
    LessonMinimalSerializer,
    LessonCreateUpdateSerializer,
    LessonResourceSerializer,
    LessonTagSerializer,
    LessonAvailabilitySerializer,
    LessonAvailabilityDetailSerializer,
    BulkPublishSerializer,
    LessonWithAvailabilitySerializer,
    SubjectSerializer,
    GradeSerializer,
    SubjectCategorySerializer
)
from rest_framework.views import APIView
from users.models import Profile, StudentEnrollment
from rest_framework import serializers

class SubjectCategoryViewSet(viewsets.ModelViewSet):
    """API endpoint for managing subject categories"""
    queryset = SubjectCategory.objects.select_related('subject').all()
    serializer_class = SubjectCategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['subject']
    search_fields = ['ar_name', 'fr_name', 'en_name', 'subject__name']
    ordering_fields = ['subject', 'ar_name']

    def get_permissions(self):
        """Allow authenticated users to view, but only admins/teachers to modify?"""
        # Assuming similar permissions to LessonTag or stricter
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.IsAdminUser] # Restrict creation to admins for now
        return super().get_permissions()

class LessonPagination(PageNumberPagination):
    """Custom pagination class for lessons with configurable page size"""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 1000

class LessonViewSet(viewsets.ModelViewSet):
    """API endpoint for managing lessons with filtering and search"""
    queryset = Lesson.objects.select_related('subject', 'grade', 'created_by').prefetch_related('resources', 'tracks').annotate(exercise_count=Count('exercises'))
    serializer_class = LessonSerializer
    pagination_class = LessonPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['subject', 'grade', 'tracks', 'category', 'unit', 'cycle', 'difficulty_level', 'is_active']
    search_fields = ['title', 'title_arabic', 'title_french', 'description', 'unit']
    ordering_fields = ['created_at', 'updated_at', 'order', 'title', 'subject']
    ordering = ['cycle', 'order', 'subject']  # Changed: cycle and order first, then subject

    def get_queryset(self):
        """
        Filter lessons based on user role:
        - Students: Only see published lessons for their class
        - Teachers: See lessons for their assigned subject and grades
        - Admins: See all lessons
        """
        user = self.request.user
        queryset = super().get_queryset()

        if not user.is_authenticated:
            return queryset.none()

        # STUDENTS: Filter by class availability (published lessons only)
        if user.role == 'STUDENT':
            # Get student's active class via enrollment (current academic year)
            enrollment = (
                StudentEnrollment.objects
                .select_related('school_class', 'academic_year')
                .filter(student=user, is_active=True, academic_year__is_current=True)
                .first()
            )

            # Fallback: any active enrollment if current-year not found
            if not enrollment:
                enrollment = (
                    StudentEnrollment.objects
                    .select_related('school_class')
                    .filter(student=user, is_active=True)
                    .order_by('-created_at')
                    .first()
                )

            if not enrollment or not enrollment.school_class:
                return queryset.none()

            student_class = enrollment.school_class

            # Show all active lessons for the student's grade by default
            queryset = queryset.filter(
                grade=student_class.grade,
                is_active=True
            )

        # TEACHERS: Filter by assigned subject and grades
        elif user.role == 'TEACHER':
            profile = getattr(user, 'profile', None)
            if profile:
                teacher_subject = profile.school_subject
                teachable_grades = profile.teachable_grades.all()

                if teacher_subject and teachable_grades.exists():
                    queryset = queryset.filter(
                        subject=teacher_subject,
                        grade__in=teachable_grades
                    )
                else:
                    return queryset.none()

        # ADMINS and STAFF: See all lessons (no filtering needed)

        return queryset
    
    def get_permissions(self):
        """Allow authenticated users to view, but only teachers/admins to modify"""
        if self.action in ['list', 'retrieve', 'search', 'minimal', 'options']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.IsAuthenticated]
            # Additional check in perform_create/update methods
        return super().get_permissions()
    
    def get_serializer_class(self):
        request = getattr(self, 'request', None)
        if (
            request
            and getattr(request.user, 'is_authenticated', False)
            and getattr(request.user, 'role', None) == 'STUDENT'
            and self.action in ['list', 'retrieve']
        ):
            return LessonWithAvailabilitySerializer

        if self.action in ['create', 'update', 'partial_update']:
            return LessonCreateUpdateSerializer
        elif self.action == 'minimal':
            return LessonMinimalSerializer
        return LessonSerializer
    
    def perform_create(self, serializer):
        # Check if user is teacher or admin
        if self.request.user.role not in ['TEACHER', 'ADMIN']:
            raise PermissionDenied("Only teachers and admins can create lessons.")
        serializer.save(created_by=self.request.user)
    
    def perform_update(self, serializer):
        # Check if user is teacher/admin or the creator of the lesson
        lesson = self.get_object()
        if (self.request.user.role not in ['TEACHER', 'ADMIN'] and 
            lesson.created_by != self.request.user):
            raise PermissionDenied("You can only edit lessons you created.")
        serializer.save()
    
    def perform_destroy(self, instance):
        # Check if user is admin or the creator of the lesson
        if (self.request.user.role != 'ADMIN' and 
            instance.created_by != self.request.user):
            raise PermissionDenied("You can only delete lessons you created or be an admin.")
        instance.delete()
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Advanced search endpoint"""
        query = request.query_params.get('q', '')
        cycle = request.query_params.get('cycle', '')
        subject_id = request.query_params.get('subject', '')
        grade_id = request.query_params.get('grade', '')
        
        queryset = self.get_queryset()
        
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(title_arabic__icontains=query) |
                Q(title_french__icontains=query) |
                Q(description__icontains=query) |
                Q(unit__icontains=query)
            )
        
        if cycle:
            queryset = queryset.filter(cycle=cycle)
        
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
        
        if grade_id:
            queryset = queryset.filter(grade_id=grade_id)
        
        # Apply pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def minimal(self, request):
        """Get minimal lesson info for dropdowns"""
        queryset = self.get_queryset().filter(is_active=True)
        
        # Apply same filters as main queryset
        subject_id = request.query_params.get('subject')
        grade_id = request.query_params.get('grade')
        cycle = request.query_params.get('cycle')
        
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
        if grade_id:
            queryset = queryset.filter(grade_id=grade_id)
        if cycle:
            queryset = queryset.filter(cycle=cycle)
        
        serializer = LessonMinimalSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def options(self, request):
        """Get lesson options for form dropdowns"""
        subject_id = request.query_params.get('subject')
        grade_id = request.query_params.get('grade')
        
        queryset = self.get_queryset().filter(is_active=True)
        
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
        if grade_id:
            queryset = queryset.filter(grade_id=grade_id)
        
        serializer = LessonMinimalSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def toggle_status(self, request, pk=None):
        """Toggle lesson active status"""
        lesson = self.get_object()

        # Check permissions
        if (request.user.role not in ['TEACHER', 'ADMIN'] and
            lesson.created_by != request.user):
            return Response(
                {"error": "You don't have permission to modify this lesson."},
                status=status.HTTP_403_FORBIDDEN
            )

        lesson.is_active = not lesson.is_active
        lesson.save()

        return Response({
            'status': 'success',
            'is_active': lesson.is_active
        })

    @action(detail=True, methods=['get'])
    def availability(self, request, pk=None):
        """Get lesson availability for all classes"""
        lesson = self.get_object()

        # Check permissions - only teachers/admins can see availability
        if request.user.role not in ['TEACHER', 'ADMIN']:
            return Response(
                {"error": "Only teachers and admins can view lesson availability."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Use flat serializer with school_class ID to match frontend expectations
        availabilities = LessonAvailability.objects.filter(lesson=lesson).select_related('school_class')
        serializer = LessonAvailabilitySerializer(availabilities, many=True)

        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def bulk_publish(self, request, pk=None):
        """Bulk publish/unpublish lesson for multiple classes"""
        lesson = self.get_object()

        # Check permissions
        if request.user.role not in ['TEACHER', 'ADMIN']:
            return Response(
                {"error": "Only teachers and admins can publish lessons."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get class IDs and publish status from request
        class_ids = request.data.get('class_ids', [])
        is_published = request.data.get('is_published', True)

        if not class_ids:
            return Response(
                {"error": "class_ids is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate that all classes exist
        classes = SchoolClass.objects.filter(id__in=class_ids)
        if classes.count() != len(class_ids):
            return Response(
                {"error": "Some class IDs are invalid"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update or create availability records
        updated_count = 0
        created_count = 0

        for class_id in class_ids:
            availability, created = LessonAvailability.objects.get_or_create(
                lesson=lesson,
                school_class_id=class_id,
                defaults={
                    'is_published': is_published,
                    'published_by': request.user if is_published else None,
                    'published_at': timezone.now() if is_published else None
                }
            )

            if not created and availability.is_published != is_published:
                availability.is_published = is_published
                availability.published_by = request.user if is_published else None
                availability.published_at = timezone.now() if is_published else None
                availability.save()
                updated_count += 1
            elif created:
                created_count += 1

        return Response({
            'status': 'success',
            'message': f'Lesson {"published" if is_published else "unpublished"} for {len(class_ids)} classes',
            'created': created_count,
            'updated': updated_count,
            'total_affected': len(class_ids)
        })

    @action(detail=True, methods=['post'])
    def publish_for_class(self, request, pk=None):
        """Publish/unpublish lesson for a single class"""
        lesson = self.get_object()

        # Check permissions
        if request.user.role not in ['TEACHER', 'ADMIN']:
            return Response(
                {"error": "Only teachers and admins can publish lessons."},
                status=status.HTTP_403_FORBIDDEN
            )

        class_id = request.data.get('class_id')
        is_published = request.data.get('is_published', True)

        if not class_id:
            return Response(
                {"error": "class_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate class exists
        try:
            school_class = SchoolClass.objects.get(id=class_id)
        except SchoolClass.DoesNotExist:
            return Response(
                {"error": "Class not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Update or create availability
        availability, created = LessonAvailability.objects.get_or_create(
            lesson=lesson,
            school_class=school_class,
            defaults={
                'is_published': is_published,
                'published_by': request.user if is_published else None,
                'published_at': timezone.now() if is_published else None
            }
        )

        if not created:
            availability.is_published = is_published
            availability.published_by = request.user if is_published else None
            availability.published_at = timezone.now() if is_published else None
            availability.save()

        return Response({
            'status': 'success',
            'message': f'Lesson {"published" if is_published else "unpublished"} for {school_class.name}',
            'availability': LessonAvailabilitySerializer(availability).data
        })

    @action(detail=False, methods=['get'])
    def with_progress(self, request):
        """
        Get lessons with student progress included
        Combines lessons and progress data in single optimized query for students
        """
        # Only students can use this endpoint
        if request.user.role != 'STUDENT':
            return Response(
                {"error": "This endpoint is for students only"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get student's grade from enrollment
        enrollment = (
            StudentEnrollment.objects
            .select_related('school_class__grade')
            .filter(student=request.user, is_active=True, academic_year__is_current=True)
            .first()
        )

        # Fallback: any active enrollment
        if not enrollment:
            enrollment = (
                StudentEnrollment.objects
                .select_related('school_class__grade')
                .filter(student=request.user, is_active=True)
                .order_by('-created_at')
                .first()
            )

        if not enrollment or not enrollment.school_class:
            return Response({
                'summary': {
                    'total_lessons': 0,
                    'completed_lessons': 0,
                    'in_progress_lessons': 0,
                    'completion_percentage': 0,
                    'total_points': 0,
                    'study_time_hours': 0.0,
                    'next_lesson_id': None,
                },
                'lessons': []
            })

        grade = enrollment.school_class.grade

        # Query lessons (optimized with select_related/prefetch_related)
        lessons = Lesson.objects.filter(
            grade=grade,
            is_active=True
        ).select_related('subject', 'grade', 'category').prefetch_related('resources')

        # Apply filters from query params
        subject_id = request.query_params.get('subject')
        search = request.query_params.get('search')

        if subject_id:
            lessons = lessons.filter(subject_id=subject_id)
        if search:
            lessons = lessons.filter(
                Q(title__icontains=search) |
                Q(title_arabic__icontains=search) |
                Q(title_french__icontains=search) |
                Q(description__icontains=search)
            )

        # Get total count before pagination
        total_count = lessons.count()

        # Extract all unique subjects from ALL lessons (for filter dropdown)
        # This needs to be done before pagination to show all available subjects
        all_subjects_qs = lessons.values(
            'subject__id',
            'subject__name',
            'subject__name_arabic',
            'subject__name_french'
        )

        # Deduplicate by subject_id (distinct() doesn't work reliably across databases)
        subjects_dict = {}
        for subj in all_subjects_qs:
            subject_id = subj['subject__id']
            if subject_id and subject_id not in subjects_dict:
                subjects_dict[subject_id] = {
                    'id': subject_id,
                    'name': subj['subject__name'],
                    'name_arabic': subj['subject__name_arabic'],
                    'name_french': subj['subject__name_french'],
                }

        subjects_list = list(subjects_dict.values())

        # Pagination (20 lessons per page)
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 20))
        start = (page - 1) * page_size
        end = start + page_size

        lessons = lessons[start:end]

        # Get all progress data for student (O(1) lookup)
        from homework.models import LessonProgress
        lesson_ids = [lesson.id for lesson in lessons]
        progress_map = {
            p.lesson_id: p
            for p in LessonProgress.objects.filter(
                student=request.user,
                lesson_id__in=lesson_ids
            )
        }

        # Get lesson availability for student's class
        from .models import LessonAvailability
        student_class = enrollment.school_class
        availability_map = {
            avail.lesson_id: avail.is_published
            for avail in LessonAvailability.objects.filter(
                lesson_id__in=lesson_ids,
                school_class=student_class
            )
        }

        # Serialize all lessons at once (more efficient)
        serializer = LessonSerializer(lessons, many=True)
        lessons_data = serializer.data

        # Merge lesson + progress data
        results = []
        for lesson_data in lessons_data:
            progress = progress_map.get(lesson_data['id'])

            if progress:
                lesson_data['progress'] = {
                    'status': progress.status,
                    'completion_percentage': float(progress.completion_percentage),
                    'average_score': float(progress.average_score) if progress.average_score else None,
                    'total_points_earned': float(progress.total_points_earned),
                    'time_spent_minutes': progress.total_time_spent,
                }
            else:
                lesson_data['progress'] = {
                    'status': 'not_started',
                    'completion_percentage': 0,
                    'average_score': None,
                    'total_points_earned': 0,
                    'time_spent_minutes': 0,
                }

            # Check if lesson is published/available for student's class
            # If no LessonAvailability record exists, treat as locked
            # If record exists, check is_published flag
            is_published = availability_map.get(lesson_data['id'], False)
            lesson_data['is_locked'] = not is_published

            results.append(lesson_data)

        # Calculate summary statistics (based on ALL lessons, not just current page)
        from homework.models import StudentWallet
        try:
            wallet = StudentWallet.objects.get(student=request.user)
            total_points = wallet.total_points
        except StudentWallet.DoesNotExist:
            total_points = 0

        # Get all lesson IDs for summary calculation
        all_lesson_ids = Lesson.objects.filter(
            grade=grade,
            is_active=True
        ).values_list('id', flat=True)

        # Get progress for ALL lessons
        all_progress = LessonProgress.objects.filter(
            student=request.user,
            lesson_id__in=all_lesson_ids
        )

        total_lessons = len(all_lesson_ids)
        completed = all_progress.filter(status='completed').count()
        in_progress = all_progress.filter(status='in_progress').count()

        # Calculate study time (sum of time spent on ALL in-progress and completed lessons)
        total_minutes = all_progress.filter(
            status__in=['in_progress', 'completed']
        ).aggregate(
            total_time=Sum('total_time_spent')
        )['total_time'] or 0
        study_time_hours = round(total_minutes / 60, 1)

        # Find next recommended lesson
        next_lesson = None
        # First, check for in-progress lessons
        for r in results:
            if r['progress']['status'] == 'in_progress':
                next_lesson = r['id']
                break
        # If no in-progress, find first not-started unlocked lesson
        if not next_lesson:
            for r in results:
                if r['progress']['status'] == 'not_started' and not r['is_locked']:
                    next_lesson = r['id']
                    break

        # Calculate total pages
        import math
        total_pages = math.ceil(total_count / page_size) if page_size > 0 else 1

        # Prepare response
        return Response({
            'summary': {
                'total_lessons': total_lessons,
                'completed_lessons': completed,
                'in_progress_lessons': in_progress,
                'completion_percentage': (completed / total_lessons * 100) if total_lessons > 0 else 0,
                'total_points': total_points,
                'study_time_hours': study_time_hours,
                'next_lesson_id': next_lesson,
            },
            'lessons': results,
            'subjects': subjects_list,
            'pagination': {
                'total_count': total_count,
                'total_pages': total_pages,
                'current_page': page,
                'page_size': page_size,
                'has_next': page < total_pages,
                'has_previous': page > 1,
            }
        })

class LessonResourceViewSet(viewsets.ModelViewSet):
    """API endpoint for managing lesson resources"""
    serializer_class = LessonResourceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        lesson_id = self.kwargs.get('lesson_pk')
        if lesson_id:
            return LessonResource.objects.filter(lesson_id=lesson_id).select_related('uploaded_by')
        return LessonResource.objects.select_related('lesson', 'uploaded_by')
    
    def perform_create(self, serializer):
        # Check if user can add resources to this lesson
        lesson_id = self.kwargs.get('lesson_pk')
        if lesson_id:
            try:
                lesson = Lesson.objects.get(id=lesson_id)
                if (self.request.user.role not in ['TEACHER', 'ADMIN'] and 
                    lesson.created_by != self.request.user):
                    raise PermissionDenied("You can only add resources to lessons you created.")
                serializer.save(lesson=lesson, uploaded_by=self.request.user)
            except Lesson.DoesNotExist:
                from rest_framework import serializers
                raise serializers.ValidationError("Lesson not found.")
        else:
            serializer.save(uploaded_by=self.request.user)
    
    def perform_update(self, serializer):
        resource = self.get_object()
        if (self.request.user.role not in ['TEACHER', 'ADMIN'] and 
            resource.uploaded_by != self.request.user):
            raise PermissionDenied("You can only edit resources you uploaded.")
        serializer.save()
    
    def perform_destroy(self, instance):
        if (self.request.user.role not in ['TEACHER', 'ADMIN'] and 
            instance.uploaded_by != self.request.user):
            raise PermissionDenied("You can only delete resources you uploaded.")
        instance.delete()

class LessonTagViewSet(viewsets.ModelViewSet):
    """API endpoint for managing lesson tags"""
    queryset = LessonTag.objects.all()
    serializer_class = LessonTagSerializer
    
    def get_permissions(self):
        """Allow authenticated users to view, but only admins to modify"""
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()

# Helper views for curriculum navigation
from rest_framework.views import APIView

class SubjectGradesView(APIView):
    """Get available grades for a specific subject"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, subject_id):
        try:
            subject = Subject.objects.get(id=subject_id)
            grades = Grade.objects.filter(subject_configs__subject=subject).distinct()
            
            grades_data = []
            for grade in grades:
                grades_data.append({
                    'id': grade.id,
                    'name': grade.name,
                    'grade_number': grade.grade_number,
                    'educational_level': grade.educational_level.name
                })
            
            return Response({
                'subject': subject.name,
                'grades': grades_data
            })
        except Subject.DoesNotExist:
            return Response(
                {"error": "Subject not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

class GradeSubjectsView(APIView):
    """Get available subjects for a specific grade"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, grade_id):
        try:
            grade = Grade.objects.get(id=grade_id)
            subjects = Subject.objects.filter(grade_configs__grade=grade).distinct()
            
            subjects_data = []
            for subject in subjects:
                subjects_data.append({
                    'id': subject.id,
                    'name': subject.name,
                    'code': subject.code
                })
            
            return Response({
                'grade': grade.name,
                'subjects': subjects_data
            })
        except Grade.DoesNotExist:
            return Response(
                {"error": "Grade not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

class TeacherProfileSerializer(serializers.ModelSerializer):
    school_subject = SubjectSerializer()
    teachable_grades = GradeSerializer(many=True)

    class Meta:
        model = Profile
        fields = ['school_subject', 'teachable_grades']

class TeacherInfoView(APIView):
    """
    Provides the current teacher's subject and teachable grades.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        if user.role != 'TEACHER':
            return Response({"error": "User is not a teacher"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            profile = user.profile
            serializer = TeacherProfileSerializer(profile)
            return Response(serializer.data)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found for this teacher"}, status=status.HTTP_404_NOT_FOUND)
