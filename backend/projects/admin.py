from django.contrib import admin
from .models import Project, ProjectTask, ProjectComment


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'progress_percentage', 'start_date', 'due_date', 'created_by', 'created_at']
    list_filter = ['status', 'start_date', 'due_date', 'created_at']
    search_fields = ['title', 'title_arabic', 'title_french', 'description']
    readonly_fields = ['total_tasks', 'completed_tasks', 'progress_percentage', 'completed_at', 'created_at', 'updated_at']
    filter_horizontal = ['team_members']
    date_hierarchy = 'created_at'

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'title_arabic', 'title_french', 'description', 'description_arabic', 'description_french')
        }),
        ('Project Management', {
            'fields': ('created_by', 'team_members', 'status', 'start_date', 'due_date', 'completed_at')
        }),
        ('Progress', {
            'fields': ('total_tasks', 'completed_tasks', 'progress_percentage'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ProjectTask)
class ProjectTaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'assigned_to', 'status', 'priority', 'due_date', 'order']
    list_filter = ['status', 'priority', 'project', 'created_at']
    search_fields = ['title', 'title_arabic', 'title_french', 'description', 'project__title']
    readonly_fields = ['created_at', 'updated_at', 'started_at', 'completed_at']
    filter_horizontal = ['depends_on']
    date_hierarchy = 'created_at'

    fieldsets = (
        ('Basic Information', {
            'fields': ('project', 'title', 'title_arabic', 'title_french', 'description', 'description_arabic', 'description_french')
        }),
        ('Assignment', {
            'fields': ('assigned_to', 'assigned_by', 'status', 'priority', 'due_date', 'order')
        }),
        ('Dependencies', {
            'fields': ('depends_on',)
        }),
        ('Timing', {
            'fields': ('started_at', 'completed_at')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ProjectComment)
class ProjectCommentAdmin(admin.ModelAdmin):
    list_display = ['author', 'get_target', 'comment_type', 'created_at']
    list_filter = ['comment_type', 'created_at']
    search_fields = ['content', 'author__email', 'author__first_name', 'author__last_name']
    readonly_fields = ['created_at', 'updated_at']

    def get_target(self, obj):
        return obj.task.title if obj.task else obj.project.title
    get_target.short_description = 'Target'

    fieldsets = (
        ('Target', {
            'fields': ('project', 'task')
        }),
        ('Comment', {
            'fields': ('author', 'content', 'comment_type')
        }),
        ('Attachment', {
            'fields': ('attachment', 'attachment_name')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
