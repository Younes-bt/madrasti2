from django.db import models
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
import cloudinary.models
import uuid

class MediaFile(models.Model):
    """
    A versatile model to store different types of media files using Cloudinary.
    Can be used for images, PDFs, videos, audio files, and documents.
    """
    
    MEDIA_TYPES = [
        ('IMAGE', 'Image'),
        ('PDF', 'PDF Document'), 
        ('VIDEO', 'Video'),
        ('AUDIO', 'Audio'),
        ('DOCUMENT', 'Document'),
        ('OTHER', 'Other'),
    ]
    
    # Unique identifier
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Basic Information
    title = models.CharField(max_length=200, blank=True, help_text="Display name for the media file")
    description = models.TextField(blank=True, help_text="Description of the media content")
    media_type = models.CharField(max_length=20, choices=MEDIA_TYPES, help_text="Type of media file")
    
    # Cloudinary Integration
    file = cloudinary.models.CloudinaryField(
        'file', 
        null=True, 
        blank=True,
        resource_type="auto",  # Automatically detect resource type
        help_text="The actual file stored in Cloudinary"
    )
    public_id = models.CharField(max_length=255, blank=True, help_text="Cloudinary public ID")
    url = models.URLField(max_length=500, blank=True, help_text="Public URL of the file")
    secure_url = models.URLField(max_length=500, blank=True, help_text="Secure HTTPS URL of the file")
    
    # File Metadata
    file_size = models.PositiveIntegerField(null=True, blank=True, help_text="File size in bytes")
    width = models.PositiveIntegerField(null=True, blank=True, help_text="Width for images/videos")
    height = models.PositiveIntegerField(null=True, blank=True, help_text="Height for images/videos")
    duration = models.FloatField(null=True, blank=True, help_text="Duration in seconds for videos/audio")
    format = models.CharField(max_length=10, blank=True, help_text="File format (jpg, png, pdf, etc.)")
    
    # Organization & Tagging
    tags = models.CharField(
        max_length=500, 
        blank=True, 
        help_text="Comma-separated tags for organization"
    )
    alt_text = models.CharField(
        max_length=255, 
        blank=True, 
        help_text="Alt text for accessibility (especially for images)"
    )
    
    # Ownership & Timestamps
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='uploaded_media',
        help_text="User who uploaded this file"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Status
    is_active = models.BooleanField(default=True, help_text="Whether the file is active and available")
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Media File"
        verbose_name_plural = "Media Files"
        indexes = [
            models.Index(fields=['media_type']),
            models.Index(fields=['uploaded_by']),
            models.Index(fields=['created_at']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        if self.title:
            return self.title
        return f"{self.get_media_type_display()} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
    
    def get_file_size_display(self):
        """Return human-readable file size"""
        if not self.file_size:
            return "Unknown"
        
        size = self.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"
    
    def get_tags_list(self):
        """Return tags as a list"""
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',') if tag.strip()]
        return []


class MediaRelation(models.Model):
    """
    A through model to create relationships between MediaFiles and any other model.
    Uses Django's Generic Foreign Key to be flexible and reusable.
    """
    
    RELATION_TYPES = [
        ('ROOM_GALLERY', 'Room Gallery'),
        ('ROOM_FEATURED', 'Room Featured Image'),
        ('COURSE_MATERIAL', 'Course Material'),
        ('COURSE_THUMBNAIL', 'Course Thumbnail'),
        ('ARTICLE_IMAGE', 'Article Image'),
        ('ARTICLE_GALLERY', 'Article Gallery'),
        ('NEWS_BANNER', 'News Banner'),
        ('NEWS_GALLERY', 'News Gallery'),
        ('PROFILE_PICTURE', 'Profile Picture'),
        ('SCHOOL_LOGO', 'School Logo'),
        ('LESSON_MATERIAL', 'Lesson Material'),
        ('ASSIGNMENT_ATTACHMENT', 'Assignment Attachment'),
        ('OTHER', 'Other'),
    ]
    
    # Core Relationship
    media_file = models.ForeignKey(
        MediaFile, 
        on_delete=models.CASCADE, 
        related_name='relations',
        help_text="The media file in this relationship"
    )
    
    # Generic Foreign Key to link to any model
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # Relationship Configuration
    relation_type = models.CharField(
        max_length=50, 
        choices=RELATION_TYPES,
        help_text="The type of relationship between the media and the object"
    )
    order = models.PositiveIntegerField(
        default=0, 
        help_text="Order for displaying in galleries (0 = first)"
    )
    is_featured = models.BooleanField(
        default=False, 
        help_text="Whether this is the main/featured media for the object"
    )
    
    # Optional metadata for the relationship
    caption = models.CharField(
        max_length=500, 
        blank=True,
        help_text="Optional caption for this specific usage"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = "Media Relation"
        verbose_name_plural = "Media Relations"
        # Ensure no duplicate relations of the same type
        unique_together = ['content_type', 'object_id', 'media_file', 'relation_type']
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['relation_type']),
            models.Index(fields=['is_featured']),
        ]
    
    def __str__(self):
        return f"{self.media_file} -> {self.content_object} ({self.get_relation_type_display()})"
    
    def save(self, *args, **kwargs):
        # If this is marked as featured, unmark other featured items of the same type for the same object
        if self.is_featured:
            MediaRelation.objects.filter(
                content_type=self.content_type,
                object_id=self.object_id,
                relation_type=self.relation_type,
                is_featured=True
            ).exclude(pk=self.pk).update(is_featured=False)
        
        super().save(*args, **kwargs)
