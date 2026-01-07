from django.contrib import admin
from .models import (
    LabToolCategory,
    LabTool,
    LabUsage,
    LabAssignment,
    LabAssignmentSubmission,
    LabActivity,
    LabToolAnalytics
)


@admin.register(LabToolCategory)
class LabToolCategoryAdmin(admin.ModelAdmin):
    list_display = ['name_en', 'name', 'icon', 'color', 'order', 'is_active']
    list_filter = ['is_active', 'name']
    search_fields = ['name_en', 'name_ar', 'name_fr']
    ordering = ['order', 'name']


@admin.register(LabTool)
class LabToolAdmin(admin.ModelAdmin):
    list_display = ['name_en', 'tool_id', 'category', 'is_active', 'is_premium', 'is_new', 'total_uses']
    list_filter = ['category', 'is_active', 'is_premium', 'is_new']
    search_fields = ['name_en', 'name_ar', 'name_fr', 'tool_id']
    readonly_fields = ['total_uses', 'unique_users', 'average_duration', 'created_at', 'updated_at']
    filter_horizontal = []

    fieldsets = (
        ('Basic Information', {
            'fields': ('tool_id', 'category', 'icon')
        }),
        ('Names', {
            'fields': ('name_en', 'name_ar', 'name_fr')
        }),
        ('Descriptions', {
            'fields': ('description_en', 'description_ar', 'description_fr')
        }),
        ('Instructions', {
            'fields': ('instructions_en', 'instructions_ar', 'instructions_fr'),
            'classes': ('collapse',)
        }),
        ('Configuration', {
            'fields': ('grade_levels', 'features', 'thumbnail')
        }),
        ('Status & Availability', {
            'fields': ('is_active', 'is_premium', 'is_new', 'version')
        }),
        ('Statistics', {
            'fields': ('total_uses', 'unique_users', 'average_duration'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(LabUsage)
class LabUsageAdmin(admin.ModelAdmin):
    list_display = ['user', 'tool', 'started_at', 'duration_seconds', 'device_type']
    list_filter = ['tool', 'device_type', 'started_at']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'tool__name_en']
    readonly_fields = ['started_at']
    date_hierarchy = 'started_at'

    fieldsets = (
        ('Session Information', {
            'fields': ('user', 'tool', 'started_at', 'ended_at', 'duration_seconds', 'device_type')
        }),
        ('Context', {
            'fields': ('assignment', 'activity')
        }),
        ('Interaction Data', {
            'fields': ('interaction_data',),
            'classes': ('collapse',)
        }),
    )


@admin.register(LabAssignment)
class LabAssignmentAdmin(admin.ModelAdmin):
    list_display = ['title', 'teacher', 'school_class', 'tool', 'due_date', 'is_published', 'is_active']
    list_filter = ['is_published', 'is_active', 'tool', 'school_class', 'subject']
    search_fields = ['title', 'title_ar', 'teacher__email', 'school_class__name']
    readonly_fields = ['assigned_date', 'created_at', 'updated_at']
    date_hierarchy = 'due_date'

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'title_ar', 'description', 'instructions')
        }),
        ('Target', {
            'fields': ('teacher', 'school_class', 'subject', 'tool')
        }),
        ('Task Details', {
            'fields': ('task_details', 'estimated_duration')
        }),
        ('Timing', {
            'fields': ('assigned_date', 'due_date')
        }),
        ('Submission', {
            'fields': ('requires_submission', 'submission_format', 'total_points', 'auto_grade')
        }),
        ('Status', {
            'fields': ('is_active', 'is_published')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(LabAssignmentSubmission)
class LabAssignmentSubmissionAdmin(admin.ModelAdmin):
    list_display = ['student', 'assignment', 'status', 'score', 'submitted_at', 'graded_at']
    list_filter = ['status', 'assignment__tool', 'submitted_at']
    search_fields = ['student__email', 'student__first_name', 'student__last_name', 'assignment__title']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'submitted_at'

    fieldsets = (
        ('Assignment Information', {
            'fields': ('assignment', 'student', 'usage_session')
        }),
        ('Submission', {
            'fields': ('status', 'submitted_at', 'submission_text', 'submission_file', 'time_spent')
        }),
        ('Grading', {
            'fields': ('score', 'teacher_feedback', 'graded_by', 'graded_at')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(LabActivity)
class LabActivityAdmin(admin.ModelAdmin):
    list_display = ['title', 'tool', 'created_by', 'is_public', 'is_template', 'uses_count']
    list_filter = ['tool', 'is_public', 'is_template', 'created_at']
    search_fields = ['title', 'title_ar', 'description', 'created_by__email']
    readonly_fields = ['uses_count', 'created_at', 'updated_at']

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'title_ar', 'description', 'tool', 'created_by')
        }),
        ('Configuration', {
            'fields': ('activity_config', 'grade_levels')
        }),
        ('Sharing', {
            'fields': ('is_public', 'is_template', 'uses_count')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(LabToolAnalytics)
class LabToolAnalyticsAdmin(admin.ModelAdmin):
    list_display = ['tool', 'date', 'total_sessions', 'unique_users', 'average_duration_seconds']
    list_filter = ['tool', 'date']
    search_fields = ['tool__name_en', 'tool__name_ar']
    readonly_fields = ['created_at']
    date_hierarchy = 'date'

    fieldsets = (
        ('Basic Information', {
            'fields': ('tool', 'date')
        }),
        ('Usage Metrics', {
            'fields': ('total_sessions', 'unique_users', 'total_duration_seconds', 'average_duration_seconds')
        }),
        ('User Breakdown', {
            'fields': ('student_users', 'teacher_users', 'admin_users')
        }),
        ('Device Breakdown', {
            'fields': ('desktop_sessions', 'tablet_sessions', 'mobile_sessions')
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
