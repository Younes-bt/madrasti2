from django.contrib import admin
from .models import DailyTask, UserTaskProgress


@admin.register(DailyTask)
class DailyTaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'assigned_to', 'assigned_by', 'status', 'priority', 'due_date', 'rating', 'created_at']
    list_filter = ['status', 'priority', 'created_at', 'due_date']
    search_fields = ['title', 'title_arabic', 'title_french', 'description', 'assigned_to__email', 'assigned_to__first_name', 'assigned_to__last_name']
    readonly_fields = ['created_at', 'updated_at', 'started_at', 'completed_at', 'reviewed_at']
    date_hierarchy = 'created_at'

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'title_arabic', 'title_french', 'description', 'description_arabic', 'description_french')
        }),
        ('Assignment', {
            'fields': ('assigned_to', 'assigned_by', 'status', 'priority', 'due_date')
        }),
        ('Timing', {
            'fields': ('started_at', 'completed_at', 'reviewed_at')
        }),
        ('Rating & Feedback', {
            'fields': ('rating', 'rating_feedback', 'rated_by')
        }),
        ('Notes', {
            'fields': ('user_notes', 'admin_notes')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(UserTaskProgress)
class UserTaskProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_tasks', 'completed_tasks', 'completion_rate', 'average_rating', 'current_streak', 'last_updated']
    list_filter = ['last_updated', 'created_at']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['last_updated', 'created_at']

    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Task Counts', {
            'fields': ('total_tasks', 'completed_tasks', 'pending_tasks', 'overdue_tasks', 'completion_rate')
        }),
        ('Ratings', {
            'fields': ('average_rating', 'total_rated_tasks', 'five_star_count', 'four_star_count', 'three_star_count', 'two_star_count', 'one_star_count')
        }),
        ('Time Metrics', {
            'fields': ('average_completion_time', 'on_time_completion_rate')
        }),
        ('Streaks', {
            'fields': ('current_streak', 'longest_streak', 'last_task_date')
        }),
        ('Metadata', {
            'fields': ('last_updated', 'created_at'),
            'classes': ('collapse',)
        }),
    )

    actions = ['recalculate_progress']

    def recalculate_progress(self, request, queryset):
        """Admin action to recalculate progress for selected users"""
        for progress in queryset:
            progress.update_progress()
        self.message_user(request, f"Progress recalculated for {queryset.count()} users.")
    recalculate_progress.short_description = "Recalculate progress for selected users"
