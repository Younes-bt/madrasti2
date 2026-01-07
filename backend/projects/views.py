# projects/views.py

from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone

from .models import Project, ProjectTask, ProjectComment
from .serializers import (
    ProjectSerializer,
    ProjectMinimalSerializer,
    ProjectCreateUpdateSerializer,
    ProjectTaskSerializer,
    ProjectTaskMinimalSerializer,
    ProjectTaskCreateUpdateSerializer,
    ProjectCommentSerializer
)
from .permissions import IsAdminOrProjectMember, CanManageProjects


class ProjectViewSet(viewsets.ModelViewSet):
    """Project management"""
    queryset = Project.objects.select_related('created_by').prefetch_related('team_members', 'project_tasks')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'created_by']
    search_fields = ['title', 'title_arabic', 'title_french', 'description']
    ordering_fields = ['created_at', 'due_date', 'progress_percentage']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProjectCreateUpdateSerializer
        elif self.action == 'list':
            return ProjectMinimalSerializer
        return ProjectSerializer

    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            return [CanManageProjects()]
        return [IsAdminOrProjectMember()]

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()

        if user.role == 'ADMIN':
            return queryset

        # Non-admins see only projects they're part of
        return queryset.filter(team_members=user).distinct()

    def perform_create(self, serializer):
        project = serializer.save(created_by=self.request.user)
        # Add creator to team members
        project.team_members.add(self.request.user)

    @action(detail=False, methods=['get'])
    def my_projects(self, request):
        """Get current user's projects"""
        projects = self.get_queryset().filter(team_members=request.user)

        # Optional status filter
        status_filter = request.query_params.get('status')
        if status_filter:
            projects = projects.filter(status=status_filter)

        page = self.paginate_queryset(projects)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[CanManageProjects])
    def add_member(self, request, pk=None):
        """Add team member to project"""
        project = self.get_object()
        user_id = request.data.get('user_id')

        if not user_id:
            return Response(
                {'error': 'user_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from django.contrib.auth import get_user_model
        User = get_user_model()

        try:
            user = User.objects.get(id=user_id)
            project.team_members.add(user)
            return Response(ProjectSerializer(project).data)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'], permission_classes=[CanManageProjects])
    def remove_member(self, request, pk=None):
        """Remove team member from project"""
        project = self.get_object()
        user_id = request.data.get('user_id')

        if not user_id:
            return Response(
                {'error': 'user_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from django.contrib.auth import get_user_model
        User = get_user_model()

        try:
            user = User.objects.get(id=user_id)
            project.team_members.remove(user)
            return Response(ProjectSerializer(project).data)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['get'])
    def progress(self, request, pk=None):
        """Get detailed progress report"""
        project = self.get_object()

        tasks_by_status = {
            'todo': project.project_tasks.filter(status=ProjectTask.Status.TODO).count(),
            'in_progress': project.project_tasks.filter(status=ProjectTask.Status.IN_PROGRESS).count(),
            'in_review': project.project_tasks.filter(status=ProjectTask.Status.IN_REVIEW).count(),
            'completed': project.project_tasks.filter(status=ProjectTask.Status.COMPLETED).count(),
        }

        tasks_by_priority = {
            'low': project.project_tasks.filter(priority=ProjectTask.Priority.LOW).count(),
            'medium': project.project_tasks.filter(priority=ProjectTask.Priority.MEDIUM).count(),
            'high': project.project_tasks.filter(priority=ProjectTask.Priority.HIGH).count(),
            'critical': project.project_tasks.filter(priority=ProjectTask.Priority.CRITICAL).count(),
        }

        # Team member contributions
        team_contributions = []
        for member in project.team_members.all():
            member_tasks = project.project_tasks.filter(assigned_to=member)
            team_contributions.append({
                'user': {
                    'id': member.id,
                    'name': member.get_full_name(),
                    'email': member.email,
                },
                'total_tasks': member_tasks.count(),
                'completed_tasks': member_tasks.filter(status=ProjectTask.Status.COMPLETED).count(),
            })

        return Response({
            'project_id': project.id,
            'title': project.title,
            'progress_percentage': project.progress_percentage,
            'total_tasks': project.total_tasks,
            'completed_tasks': project.completed_tasks,
            'tasks_by_status': tasks_by_status,
            'tasks_by_priority': tasks_by_priority,
            'team_contributions': team_contributions,
        })


class ProjectTaskViewSet(viewsets.ModelViewSet):
    """Project task management (nested under projects)"""
    queryset = ProjectTask.objects.select_related('project', 'assigned_to', 'assigned_by').prefetch_related('depends_on')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'assigned_to']
    search_fields = ['title', 'title_arabic', 'title_french', 'description']
    ordering_fields = ['created_at', 'due_date', 'order', 'priority']
    ordering = ['order', 'created_at']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProjectTaskCreateUpdateSerializer
        elif self.action == 'list':
            return ProjectTaskMinimalSerializer
        return ProjectTaskSerializer

    def get_permissions(self):
        return [IsAdminOrProjectMember()]

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()

        # Filter by project if nested route
        project_pk = self.kwargs.get('project_pk')
        if project_pk:
            queryset = queryset.filter(project_id=project_pk)

        if user.role == 'ADMIN':
            return queryset

        # Non-admins see only tasks from their projects
        return queryset.filter(project__team_members=user).distinct()

    def perform_create(self, serializer):
        project_pk = self.kwargs.get('project_pk')
        if project_pk:
            serializer.save(
                project_id=project_pk,
                assigned_by=self.request.user
            )
        else:
            serializer.save(assigned_by=self.request.user)

    @action(detail=False, methods=['get'])
    def my_tasks(self, request):
        """Get current user's tasks across all projects"""
        tasks = ProjectTask.objects.filter(assigned_to=request.user).select_related('project')

        # Optional status filter
        status_filter = request.query_params.get('status')
        if status_filter:
            tasks = tasks.filter(status=status_filter)

        page = self.paginate_queryset(tasks)
        if page is not None:
            serializer = ProjectTaskSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = ProjectTaskSerializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None, project_pk=None):
        """Quick status update"""
        task = self.get_object()

        # Check permissions
        if request.user.role != 'ADMIN' and task.assigned_to != request.user:
            return Response(
                {'error': 'You can only update tasks assigned to you'},
                status=status.HTTP_403_FORBIDDEN
            )

        new_status = request.data.get('status')
        if not new_status:
            return Response(
                {'error': 'status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_status not in dict(ProjectTask.Status.choices):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update timestamps
        if new_status == ProjectTask.Status.IN_PROGRESS and not task.started_at:
            task.started_at = timezone.now()
        elif new_status == ProjectTask.Status.COMPLETED and not task.completed_at:
            task.completed_at = timezone.now()

        task.status = new_status
        task.save()

        serializer = self.get_serializer(task)
        return Response(serializer.data)


class ProjectCommentViewSet(viewsets.ModelViewSet):
    """Comments on projects and tasks"""
    queryset = ProjectComment.objects.select_related('author', 'project', 'task')
    serializer_class = ProjectCommentSerializer
    permission_classes = [IsAdminOrProjectMember]

    def get_queryset(self):
        queryset = super().get_queryset()
        project_pk = self.kwargs.get('project_pk')
        task_pk = self.kwargs.get('task_pk')

        if task_pk:
            queryset = queryset.filter(task_id=task_pk)
        elif project_pk:
            queryset = queryset.filter(project_id=project_pk)

        return queryset

    def perform_create(self, serializer):
        project_pk = self.kwargs.get('project_pk')
        task_pk = self.kwargs.get('task_pk')

        if task_pk:
            serializer.save(task_id=task_pk, author=self.request.user)
        elif project_pk:
            serializer.save(project_id=project_pk, author=self.request.user)
        else:
            serializer.save(author=self.request.user)
