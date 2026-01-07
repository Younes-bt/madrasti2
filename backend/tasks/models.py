# tasks/models.py

from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import timedelta
from django.db.models import Avg


class DailyTask(models.Model):
    """Simple daily tasks assigned to staff/teachers by admin"""

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'قيد الانتظار - En attente'
        IN_PROGRESS = 'IN_PROGRESS', 'قيد التنفيذ - En cours'
        DONE = 'DONE', 'تم الإنجاز - Terminé'
        COMPLETE = 'COMPLETE', 'مكتمل - Complété'

    class Priority(models.TextChoices):
        LOW = 'LOW', 'منخفضة - Basse'
        MEDIUM = 'MEDIUM', 'متوسطة - Moyenne'
        HIGH = 'HIGH', 'عالية - Haute'
        URGENT = 'URGENT', 'عاجلة - Urgente'

    # Core fields
    title = models.CharField(max_length=200)
    title_arabic = models.CharField(max_length=200, blank=True)
    title_french = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    description_arabic = models.TextField(blank=True)
    description_french = models.TextField(blank=True)

    # Assignment
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='assigned_tasks',
        limit_choices_to={'role__in': ['STAFF', 'TEACHER', 'ADMIN']}
    )
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_tasks'
    )

    # Status and priority
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    priority = models.CharField(max_length=20, choices=Priority.choices, default=Priority.MEDIUM)

    # Timing
    due_date = models.DateTimeField()
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    # Rating (after completion)
    rating = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Admin rating (1-5 stars)"
    )
    rating_feedback = models.TextField(blank=True)
    rated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='rated_tasks'
    )

    # Notes
    user_notes = models.TextField(blank=True, help_text="Notes from assignee")
    admin_notes = models.TextField(blank=True, help_text="Notes from admin")

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tasks_dailytask'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['assigned_to', 'status']),
            models.Index(fields=['assigned_by', 'created_at']),
            models.Index(fields=['status', 'due_date']),
        ]
        verbose_name = "Daily Task"
        verbose_name_plural = "Daily Tasks"

    def __str__(self):
        return f"{self.title} - {self.assigned_to.get_full_name() if self.assigned_to else 'Unassigned'}"

    @property
    def is_overdue(self):
        """Check if task is overdue"""
        return timezone.now() > self.due_date and self.status not in [self.Status.COMPLETE]

    def mark_in_progress(self):
        """User marks task as in progress"""
        if self.status == self.Status.PENDING:
            self.status = self.Status.IN_PROGRESS
            self.started_at = timezone.now()
            self.save()

    def mark_done(self):
        """User marks task as done (awaiting admin review)"""
        if self.status in [self.Status.PENDING, self.Status.IN_PROGRESS]:
            self.status = self.Status.DONE
            self.completed_at = timezone.now()
            self.save()

    def mark_complete(self, rating, feedback='', rated_by=None):
        """Admin marks task as complete with rating"""
        self.status = self.Status.COMPLETE
        self.rating = rating
        self.rating_feedback = feedback
        self.rated_by = rated_by
        self.reviewed_at = timezone.now()
        self.save()


class UserTaskProgress(models.Model):
    """Aggregate user performance metrics across all daily tasks"""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='task_progress'
    )

    # Task counts
    total_tasks = models.PositiveIntegerField(default=0)
    completed_tasks = models.PositiveIntegerField(default=0)
    pending_tasks = models.PositiveIntegerField(default=0)
    overdue_tasks = models.PositiveIntegerField(default=0)

    # Completion rate
    completion_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.00,
        help_text="Percentage of completed tasks"
    )

    # Rating statistics
    average_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Average star rating across all rated tasks"
    )
    total_rated_tasks = models.PositiveIntegerField(default=0)
    five_star_count = models.PositiveIntegerField(default=0)
    four_star_count = models.PositiveIntegerField(default=0)
    three_star_count = models.PositiveIntegerField(default=0)
    two_star_count = models.PositiveIntegerField(default=0)
    one_star_count = models.PositiveIntegerField(default=0)

    # Time metrics
    average_completion_time = models.DurationField(
        null=True,
        blank=True,
        help_text="Average time to complete tasks"
    )
    on_time_completion_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.00,
        help_text="Percentage of tasks completed before due date"
    )

    # Streaks
    current_streak = models.PositiveIntegerField(default=0, help_text="Consecutive days with completed tasks")
    longest_streak = models.PositiveIntegerField(default=0)
    last_task_date = models.DateField(null=True, blank=True)

    # Metadata
    last_updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tasks_usertaskprogress'
        verbose_name = "User Task Progress"
        verbose_name_plural = "User Task Progress"

    def __str__(self):
        return f"{self.user.get_full_name() if self.user else 'Unknown'} - Progress"

    def update_progress(self):
        """Recalculate all progress metrics"""
        user_tasks = DailyTask.objects.filter(assigned_to=self.user)

        # Task counts
        self.total_tasks = user_tasks.count()
        self.completed_tasks = user_tasks.filter(status=DailyTask.Status.COMPLETE).count()
        self.pending_tasks = user_tasks.filter(
            status__in=[DailyTask.Status.PENDING, DailyTask.Status.IN_PROGRESS]
        ).count()
        self.overdue_tasks = user_tasks.filter(
            due_date__lt=timezone.now(),
            status__in=[DailyTask.Status.PENDING, DailyTask.Status.IN_PROGRESS]
        ).count()

        # Completion rate
        if self.total_tasks > 0:
            self.completion_rate = (self.completed_tasks / self.total_tasks) * 100
        else:
            self.completion_rate = 0

        # Rating statistics
        rated_tasks = user_tasks.filter(rating__isnull=False)
        self.total_rated_tasks = rated_tasks.count()

        if self.total_rated_tasks > 0:
            avg_rating = rated_tasks.aggregate(Avg('rating'))['rating__avg']
            self.average_rating = round(avg_rating, 2) if avg_rating else None
            self.five_star_count = rated_tasks.filter(rating=5).count()
            self.four_star_count = rated_tasks.filter(rating=4).count()
            self.three_star_count = rated_tasks.filter(rating=3).count()
            self.two_star_count = rated_tasks.filter(rating=2).count()
            self.one_star_count = rated_tasks.filter(rating=1).count()
        else:
            self.average_rating = None
            self.five_star_count = 0
            self.four_star_count = 0
            self.three_star_count = 0
            self.two_star_count = 0
            self.one_star_count = 0

        # Time metrics
        completed = user_tasks.filter(
            status=DailyTask.Status.COMPLETE,
            started_at__isnull=False,
            completed_at__isnull=False
        )

        if completed.exists():
            completion_times = []
            on_time_count = 0

            for task in completed:
                time_taken = task.completed_at - task.started_at
                completion_times.append(time_taken)
                if task.completed_at <= task.due_date:
                    on_time_count += 1

            if completion_times:
                total_time = sum(completion_times, timedelta())
                self.average_completion_time = total_time / len(completion_times)

            if completed.count() > 0:
                self.on_time_completion_rate = (on_time_count / completed.count()) * 100
        else:
            self.average_completion_time = None
            self.on_time_completion_rate = 0

        # Calculate streak (simplified - consecutive days with at least one completed task)
        # This is a basic implementation; more sophisticated streak logic can be added
        completed_dates = completed.values_list('completed_at__date', flat=True).distinct().order_by('-completed_at__date')

        if completed_dates:
            current_streak = 0
            longest_streak = 0
            temp_streak = 1

            completed_dates_list = list(completed_dates)
            self.last_task_date = completed_dates_list[0]

            # Check current streak
            today = timezone.now().date()
            if completed_dates_list[0] == today or completed_dates_list[0] == today - timedelta(days=1):
                current_streak = 1
                for i in range(len(completed_dates_list) - 1):
                    if (completed_dates_list[i] - completed_dates_list[i + 1]).days == 1:
                        current_streak += 1
                    else:
                        break

            # Calculate longest streak
            for i in range(len(completed_dates_list) - 1):
                if (completed_dates_list[i] - completed_dates_list[i + 1]).days == 1:
                    temp_streak += 1
                    longest_streak = max(longest_streak, temp_streak)
                else:
                    temp_streak = 1

            longest_streak = max(longest_streak, temp_streak)

            self.current_streak = current_streak
            self.longest_streak = max(longest_streak, self.longest_streak)
        else:
            self.current_streak = 0
            self.last_task_date = None

        self.save()
