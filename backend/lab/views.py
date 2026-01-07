from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Count, Avg, Q
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import (
    LabToolCategory,
    LabTool,
    LabUsage,
    LabAssignment,
    LabAssignmentSubmission,
    LabActivity
)
from .serializers import (
    LabToolCategorySerializer,
    LabToolListSerializer,
    LabToolDetailSerializer,
    LabUsageSerializer,
    LabAssignmentSerializer,
    LabAssignmentSubmissionSerializer,
    LabActivitySerializer
)


class LabToolCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for lab tool categories"""
    queryset = LabToolCategory.objects.filter(is_active=True)
    serializer_class = LabToolCategorySerializer
    permission_classes = [IsAuthenticated]


class LabToolViewSet(viewsets.ModelViewSet):
    """ViewSet for lab tools"""
    permission_classes = [IsAuthenticated]
    lookup_field = 'tool_id'
    pagination_class = None  # Disable pagination to return all tools

    def get_queryset(self):
        queryset = LabTool.objects.filter(is_active=True).select_related('category')

        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__name=category)

        # Filter by grade level
        grade = self.request.query_params.get('grade')
        if grade:
            queryset = queryset.filter(grade_levels__contains=[grade])

        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name_en__icontains=search) |
                Q(name_ar__icontains=search) |
                Q(name_fr__icontains=search) |
                Q(description_en__icontains=search) |
                Q(description_ar__icontains=search)
            )

        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LabToolDetailSerializer
        return LabToolListSerializer

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get user's recently used tools"""
        recent_usage = LabUsage.objects.filter(
            user=request.user
        ).select_related('tool').order_by('-started_at')[:5]

        tool_ids = [usage.tool_id for usage in recent_usage]
        tools = LabTool.objects.filter(id__in=tool_ids, is_active=True)

        serializer = self.get_serializer(tools, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        """Toggle favorite status for a tool"""
        # This would require a Favorite model - simplified for now
        return Response({'status': 'favorited'})


class LabUsageViewSet(viewsets.ModelViewSet):
    """ViewSet for usage tracking"""
    serializer_class = LabUsageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = LabUsage.objects.select_related('tool', 'user')

        # Students see only their own usage
        if user.role == 'STUDENT':
            queryset = queryset.filter(user=user)
        # Teachers see their students' usage
        elif user.role == 'TEACHER':
            # Get students from teacher's classes
            from schools.models import SchoolClass
            teacher_classes = SchoolClass.objects.filter(
                Q(class_teacher=user) |
                Q(subject_teachers=user)
            )
            student_ids = []
            for cls in teacher_classes:
                student_ids.extend(cls.students.values_list('id', flat=True))
            queryset = queryset.filter(user_id__in=student_ids)
        # Admins see all

        return queryset.order_by('-started_at')

    @action(detail=False, methods=['post'])
    def start(self, request):
        """Start a new usage session"""
        tool_id = request.data.get('tool_id')
        device_type = request.data.get('device_type', 'desktop')

        try:
            tool = LabTool.objects.get(tool_id=tool_id)
        except LabTool.DoesNotExist:
            return Response(
                {'error': 'Tool not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        usage = LabUsage.objects.create(
            user=request.user,
            tool=tool,
            device_type=device_type
        )

        serializer = self.get_serializer(usage)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['put'])
    def end(self, request, pk=None):
        """End a usage session"""
        usage = self.get_object()

        if usage.user != request.user:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )

        usage.ended_at = timezone.now()
        usage.duration_seconds = request.data.get('duration_seconds')
        usage.interaction_data = request.data.get('interaction_data', {})
        usage.save()

        # Update tool statistics
        tool = usage.tool
        tool.total_uses += 1
        tool.save()

        serializer = self.get_serializer(usage)
        return Response(serializer.data)


class LabAssignmentViewSet(viewsets.ModelViewSet):
    """ViewSet for lab assignments"""
    serializer_class = LabAssignmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'TEACHER':
            return LabAssignment.objects.filter(
                teacher=user
            ).select_related('tool', 'school_class', 'subject')
        elif user.role == 'STUDENT':
            # Get assignments for student's class
            return LabAssignment.objects.filter(
                school_class__students=user,
                is_published=True
            ).select_related('tool', 'school_class', 'subject')
        else:  # Admin
            return LabAssignment.objects.all()

    @action(detail=True, methods=['get'])
    def submissions(self, request, pk=None):
        """Get submissions for an assignment"""
        assignment = self.get_object()
        submissions = LabAssignmentSubmission.objects.filter(
            assignment=assignment
        ).select_related('student')

        serializer = LabAssignmentSubmissionSerializer(submissions, many=True)
        return Response(serializer.data)


class LabAssignmentSubmissionViewSet(viewsets.ModelViewSet):
    """ViewSet for assignment submissions"""
    serializer_class = LabAssignmentSubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'STUDENT':
            return LabAssignmentSubmission.objects.filter(student=user)
        elif user.role == 'TEACHER':
            # Get submissions from teacher's assignments
            return LabAssignmentSubmission.objects.filter(
                assignment__teacher=user
            )
        else:  # Admin
            return LabAssignmentSubmission.objects.all()


class LabActivityViewSet(viewsets.ModelViewSet):
    """ViewSet for lab activities"""
    serializer_class = LabActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Get public activities and user's own activities
        return LabActivity.objects.filter(
            Q(is_public=True) | Q(created_by=user)
        ).select_related('tool', 'created_by')

    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplicate an activity"""
        activity = self.get_object()

        # Create a copy
        new_activity = LabActivity.objects.create(
            title=f"{activity.title} (Copy)",
            title_ar=f"{activity.title_ar} (نسخة)" if activity.title_ar else "",
            description=activity.description,
            created_by=request.user,
            tool=activity.tool,
            activity_config=activity.activity_config,
            grade_levels=activity.grade_levels,
            is_public=False
        )

        serializer = self.get_serializer(new_activity)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
