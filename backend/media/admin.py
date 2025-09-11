from django.contrib import admin
from django.utils.html import format_html
from .models import MediaFile, MediaRelation

@admin.register(MediaFile)
class MediaFileAdmin(admin.ModelAdmin):
    list_display = [
        'title', 
        'media_type', 
        'uploaded_by', 
        'file_size_display', 
        'is_active',
        'created_at',
        'preview'
    ]
    list_filter = [
        'media_type', 
        'is_active', 
        'uploaded_by', 
        'created_at'
    ]
    search_fields = [
        'title', 
        'description', 
        'tags', 
        'alt_text',
        'public_id'
    ]
    readonly_fields = [
        'id',
        'url', 
        'secure_url', 
        'public_id', 
        'file_size', 
        'width', 
        'height', 
        'duration', 
        'format',
        'created_at', 
        'updated_at',
        'preview'
    ]
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'media_type', 'alt_text')
        }),
        ('File Upload', {
            'fields': ('file',)
        }),
        ('Cloudinary Information', {
            'fields': ('url', 'secure_url', 'public_id'),
            'classes': ('collapse',)
        }),
        ('File Metadata', {
            'fields': ('file_size', 'width', 'height', 'duration', 'format'),
            'classes': ('collapse',)
        }),
        ('Organization', {
            'fields': ('tags', 'uploaded_by', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
        ('Preview', {
            'fields': ('preview',),
            'classes': ('collapse',)
        })
    )
    
    def file_size_display(self, obj):
        return obj.get_file_size_display()
    file_size_display.short_description = 'File Size'
    
    def preview(self, obj):
        if obj.media_type == 'IMAGE' and obj.secure_url:
            return format_html(
                '<img src="{}" style="max-width: 200px; max-height: 200px;" />',
                obj.secure_url
            )
        elif obj.secure_url:
            return format_html(
                '<a href="{}" target="_blank">View File</a>',
                obj.secure_url
            )
        return "No preview available"
    preview.short_description = 'Preview'

@admin.register(MediaRelation)
class MediaRelationAdmin(admin.ModelAdmin):
    list_display = [
        'media_file',
        'content_object', 
        'relation_type',
        'is_featured',
        'order',
        'created_at'
    ]
    list_filter = [
        'relation_type',
        'is_featured',
        'content_type',
        'created_at'
    ]
    search_fields = [
        'media_file__title',
        'caption'
    ]
    readonly_fields = [
        'created_at',
        'updated_at'
    ]
    fieldsets = (
        ('Relationship', {
            'fields': ('media_file', 'content_type', 'object_id', 'relation_type')
        }),
        ('Configuration', {
            'fields': ('order', 'is_featured', 'caption')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
