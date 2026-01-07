# tasks/views.py

from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.utils import timezone

from .models import DailyTask, UserTaskProgress
from .serializers import (
    DailyTaskSerializer,
    DailyTaskMinimalSerializer,
    DailyTaskCreateUpdateSerializer,
    TaskRatingSerializer,
    TaskNotesSerializer,
    UserTaskProgressSerializer
)
from .permissions import IsAdminOrReadOwn, CanRateTask


class DailyTaskViewSet(viewsets.ModelViewSet):
    """Daily task management"""
    queryset = DailyTask.objects.select_related('assigned_to', 'assigned_by', 'rated_by')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'assigned_to', 'assigned_by']
    search_fields = ['title', 'title_arabic', 'title_french', 'description']
    ordering_fields = ['created_at', 'due_date', 'priority', 'status']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return DailyTaskCreateUpdateSerializer
        elif self.action == 'list':
            return DailyTaskMinimalSerializer
        return DailyTaskSerializer

    def get_permissions(self):
        if self.action in ['rate_task', 'bulk_assign']:
            return [CanRateTask()]
        return [IsAdminOrReadOwn()]

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()

        if user.role == 'ADMIN':
            return queryset

        # Non-admins see only their tasks
        return queryset.filter(assigned_to=user)

    def perform_create(self, serializer):
        serializer.save(assigned_by=self.request.user)

    @action(detail=False, methods=['get'])
    def my_tasks(self, request):
        """Get current user's tasks"""
        tasks = self.get_queryset().filter(assigned_to=request.user)

        # Optional status filter
        status_filter = request.query_params.get('status')
        if status_filter:
            tasks = tasks.filter(status=status_filter)

        page = self.paginate_queryset(tasks)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def start_task(self, request, pk=None):
        """User marks task as in progress"""
        task = self.get_object()

        if task.assigned_to != request.user and request.user.role != 'ADMIN':
            return Response(
                {'error': 'You can only start tasks assigned to you'},
                status=status.HTTP_403_FORBIDDEN
            )

        if task.status != DailyTask.Status.PENDING:
            return Response(
                {'error': 'Task must be in PENDING status to start'},
                status=status.HTTP_400_BAD_REQUEST
            )

        task.mark_in_progress()
        serializer = self.get_serializer(task)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_done(self, request, pk=None):
        """User marks task as done (awaiting review)"""
        task = self.get_object()

        if task.assigned_to != request.user and request.user.role != 'ADMIN':
            return Response(
                {'error': 'You can only complete tasks assigned to you'},
                status=status.HTTP_403_FORBIDDEN
            )

        if task.status not in [DailyTask.Status.PENDING, DailyTask.Status.IN_PROGRESS]:
            return Response(
                {'error': 'Task must be in PENDING or IN_PROGRESS status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get optional notes
        notes_serializer = TaskNotesSerializer(data=request.data)
        if notes_serializer.is_valid():
            user_notes = notes_serializer.validated_data.get('user_notes', '')
            if user_notes:
                task.user_notes = user_notes

        task.mark_done()
        serializer = self.get_serializer(task)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[CanRateTask])
    def rate_task(self, request, pk=None):
        """Admin rates completed task"""
        task = self.get_object()

        if task.status != DailyTask.Status.DONE:
            return Response(
                {'error': 'Can only rate tasks that are marked as done'},
                status=status.HTTP_400_BAD_REQUEST
            )

        rating_serializer = TaskRatingSerializer(data=request.data)
        if rating_serializer.is_valid():
            task.mark_complete(
                rating=rating_serializer.validated_data['rating'],
                feedback=rating_serializer.validated_data.get('rating_feedback', ''),
                rated_by=request.user
            )

            # Update user progress
            progress, _ = UserTaskProgress.objects.get_or_create(user=task.assigned_to)
            progress.update_progress()

            return Response(DailyTaskSerializer(task).data)

        return Response(rating_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get task statistics"""
        user = request.user

        if user.role == 'ADMIN':
            # Admin sees all stats
            queryset = DailyTask.objects.all()
        else:
            # Users see their own stats
            queryset = DailyTask.objects.filter(assigned_to=user)

        stats = {
            'total': queryset.count(),
            'pending': queryset.filter(status=DailyTask.Status.PENDING).count(),
            'in_progress': queryset.filter(status=DailyTask.Status.IN_PROGRESS).count(),
            'done': queryset.filter(status=DailyTask.Status.DONE).count(),
            'complete': queryset.filter(status=DailyTask.Status.COMPLETE).count(),
            'overdue': queryset.filter(
                due_date__lt=timezone.now(),
                status__in=[DailyTask.Status.PENDING, DailyTask.Status.IN_PROGRESS]
            ).count(),
        }

        return Response(stats)


class UserTaskProgressViewSet(viewsets.ReadOnlyModelViewSet):
    """User task performance metrics"""
    queryset = UserTaskProgress.objects.select_related('user')
    serializer_class = UserTaskProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['user']
    ordering_fields = ['average_rating', 'completion_rate', 'total_tasks']

    def get_queryset(self):
        user = self.request.user

        if user.role == 'ADMIN':
            return super().get_queryset()

        # Users see only their own progress
        return super().get_queryset().filter(user=user)

    @action(detail=False, methods=['get'])
    def my_progress(self, request):
        """Get current user's progress"""
        progress, created = UserTaskProgress.objects.get_or_create(user=request.user)
        if created or request.query_params.get('refresh'):
            progress.update_progress()
        serializer = self.get_serializer(progress)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def leaderboard(self, request):
        """Top performers leaderboard (requires admin role)"""
        if request.user.role != 'ADMIN':
            return Response(
                {'error': 'Admin access required'},
                status=status.HTTP_403_FORBIDDEN
            )

        top_performers = UserTaskProgress.objects.filter(
            total_rated_tasks__gte=5  # At least 5 rated tasks
        ).order_by('-average_rating', '-completion_rate')[:10]

        serializer = self.get_serializer(top_performers, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def refresh(self, request, pk=None):
        """Manually refresh progress for a user"""
        if request.user.role != 'ADMIN':
            progress = self.get_object()
            if progress.user != request.user:
                return Response(
                    {'error': 'You can only refresh your own progress'},
                    status=status.HTTP_403_FORBIDDEN
                )
        else:
            progress = self.get_object()

        progress.update_progress()
        serializer = self.get_serializer(progress)
        return Response(serializer.data)
