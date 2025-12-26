from django.contrib import admin

from .models import ActivityLog


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = (
        'created_at',
        'action',
        'actor',
        'actor_role',
        'target_app',
        'target_model',
        'target_repr',
    )
    list_filter = ('action', 'actor_role', 'target_app', 'target_model')
    search_fields = ('description', 'target_repr', 'actor__full_name', 'actor__email')
    ordering = ('-created_at',)

# Register your models here.
