# lessons/admin.py

from django.contrib import admin
from .models import Lesson, LessonResource, LessonTag, LessonTagging, SubjectCategory

class LessonResourceInline(admin.TabularInline):
    """Inline for managing lesson resources"""
    model = LessonResource
    extra = 1
    fields = ('title', 'resource_type', 'file', 'external_url', 'markdown_content', 'blocks_content', 'order', 'is_visible_to_students')
    readonly_fields = ('file_size', 'file_format', 'uploaded_at', 'uploaded_by')

class LessonTaggingInline(admin.TabularInline):
    """Inline for managing lesson tags"""
    model = LessonTagging
    extra = 1
    autocomplete_fields = ['tag']

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'grade', 'cycle', 'category', 'unit', 'order', 'difficulty_level', 'is_active', 'created_by')
    list_filter = ('subject', 'grade__educational_level', 'cycle', 'category', 'difficulty_level', 'is_active', 'created_at', 'tracks')
    search_fields = ('title', 'title_arabic', 'title_french', 'description', 'unit')
    autocomplete_fields = ['subject', 'grade', 'created_by', 'category']
    filter_horizontal = ('tracks',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('subject', 'grade', 'tracks', 'category', 'unit', 'title', 'title_arabic', 'title_french', 'description')
        }),
        ('Academic Organization', {
            'fields': ('cycle', 'order', 'difficulty_level', 'is_active')
        }),
        ('Content', {
            'fields': ('objectives', 'prerequisites'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',),
            'description': 'System-generated information'
        })
    )
    
    readonly_fields = ('created_at', 'updated_at')
    inlines = [LessonResourceInline, LessonTaggingInline]
    
    def save_model(self, request, obj, form, change):
        if not change:  # Only set created_by on creation
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('subject', 'grade', 'created_by').prefetch_related('tracks')

@admin.register(LessonResource)
class LessonResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'lesson', 'resource_type', 'is_visible_to_students', 'uploaded_by', 'uploaded_at')
    list_filter = ('resource_type', 'is_visible_to_students', 'uploaded_at', 'lesson__subject')
    search_fields = ('title', 'description', 'lesson__title')
    autocomplete_fields = ['lesson', 'uploaded_by']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('lesson', 'title', 'description', 'resource_type')
        }),
        ('File/Content', {
            'fields': ('file', 'external_url', 'markdown_content', 'blocks_content', 'file_size', 'file_format')
        }),
        ('Settings', {
            'fields': ('is_visible_to_students', 'is_downloadable', 'order')
        }),
        ('Metadata', {
            'fields': ('uploaded_by', 'uploaded_at'),
            'classes': ('collapse',)
        })
    )
    
    readonly_fields = ('file_size', 'file_format', 'uploaded_at')
    
    def save_model(self, request, obj, form, change):
        if not change:  # Only set uploaded_by on creation
            obj.uploaded_by = request.user
        super().save_model(request, obj, form, change)

@admin.register(LessonTag)
class LessonTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'name_arabic', 'color')
    search_fields = ('name', 'name_arabic')
    
    fieldsets = (
        ('Tag Information', {
            'fields': ('name', 'name_arabic', 'color')
        }),
    )

@admin.register(LessonTagging)
class LessonTaggingAdmin(admin.ModelAdmin):
    list_display = ('lesson', 'tag')
    list_filter = ('tag', 'lesson__subject', 'lesson__grade')
    autocomplete_fields = ['lesson', 'tag']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('lesson', 'tag')

@admin.register(SubjectCategory)
class SubjectCategoryAdmin(admin.ModelAdmin):
    list_display = ('subject', 'ar_name', 'fr_name', 'en_name')
    list_filter = ('subject',)
    search_fields = ('ar_name', 'fr_name', 'en_name')
    autocomplete_fields = ['subject']

# Customize admin site headers
admin.site.site_header = "Madrasti Administration"
admin.site.site_title = "Madrasti Admin Portal"
admin.site.index_title = "Welcome to Madrasti Administration"