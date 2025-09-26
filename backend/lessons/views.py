# lessons/views.py

from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from schools.models import Subject, Grade
from .models import Lesson, LessonResource, LessonTag
from .serializers import (
    LessonSerializer, 
    LessonMinimalSerializer, 
    LessonCreateUpdateSerializer,
    LessonResourceSerializer,
    LessonTagSerializer,
    SubjectSerializer,
    GradeSerializer
)
from rest_framework.views import APIView
from users.models import Profile
from rest_framework import serializers

class LessonViewSet(viewsets.ModelViewSet):
    """API endpoint for managing lessons with filtering and search"""
    queryset = Lesson.objects.select_related('subject', 'grade', 'created_by').prefetch_related('resources', 'tracks').annotate(exercise_count=Count('exercises'))
    serializer_class = LessonSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['subject', 'grade', 'tracks', 'cycle', 'difficulty_level', 'is_active']
    search_fields = ['title', 'title_arabic', 'title_french', 'description']
    ordering_fields = ['created_at', 'updated_at', 'order', 'title']
    ordering = ['subject', 'grade', 'cycle', 'order']

    def get_queryset(self):
        """
        Filter lessons for teachers based on their assigned subject and grades.
        Admins and other roles can see all lessons.
        """
        user = self.request.user
        queryset = super().get_queryset()

        if user.is_authenticated and user.role == 'TEACHER':
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
                    # If a teacher has no assigned subject or grades, they see no lessons.
                    return queryset.none()
        
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
                Q(description__icontains=query)
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