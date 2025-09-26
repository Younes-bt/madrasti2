# lessons/models.py

from django.db import models
from django.conf import settings
from cloudinary.models import CloudinaryField

class Lesson(models.Model):
    """Individual lessons/topics for each subject and grade level"""
    
    # Link to existing schools models
    subject = models.ForeignKey('schools.Subject', on_delete=models.CASCADE, related_name='lessons')
    grade = models.ForeignKey('schools.Grade', on_delete=models.CASCADE, related_name='lessons')
    tracks = models.ManyToManyField('schools.Track', related_name='lessons', blank=True)
    
    # Lesson details
    title = models.CharField(max_length=200)
    title_arabic = models.CharField(max_length=200, blank=True)
    title_french = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    
    # Moroccan Academic Cycles (الدورة الأولى و الدورة الثانية)
    CYCLE_CHOICES = [
        ('first', 'الدورة الأولى - Premier Cycle'),
        ('second', 'الدورة الثانية - Deuxième Cycle'),
    ]
    cycle = models.CharField(max_length=10, choices=CYCLE_CHOICES)
    
    # Organization within cycle
    order = models.PositiveIntegerField(help_text="Lesson sequence within the cycle")
    
    # Learning objectives
    objectives = models.TextField(blank=True, help_text="Learning objectives for this lesson")
    prerequisites = models.TextField(blank=True, help_text="What students need to know first")
    
    # Difficulty and status
    DIFFICULTY_CHOICES = [
        ('easy', 'سهل - Facile'),
        ('medium', 'متوسط - Moyen'), 
        ('hard', 'صعب - Difficile'),
    ]
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='medium')
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='created_lessons'
    )
    
    class Meta:
        unique_together = ['subject', 'grade', 'cycle', 'order']
        ordering = ['subject', 'grade', 'cycle', 'order']
        verbose_name = "Lesson"
        verbose_name_plural = "Lessons"
    
    def __str__(self):
        cycle_display = "الدورة الأولى" if self.cycle == 'first' else "الدورة الثانية"
        return f"{self.subject.name} - {self.grade.name} - {cycle_display} - {self.title}"

class LessonResource(models.Model):
    """Resources for each lesson using Cloudinary for file storage"""
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='resources')
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    RESOURCE_TYPES = [
        ('pdf', 'مستند PDF - Document PDF'),
        ('video', 'فيديو - Vidéo'),
        ('audio', 'صوت - Audio'),
        ('image', 'صورة - Image'),
        ('document', 'مستند - Document Word/Excel'),
        ('link', 'رابط خارجي - Lien externe'),
        ('exercise', 'تمرين - Exercice'),
        ('presentation', 'عرض تقديمي - Présentation'),
    ]
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES)
    
    # Cloudinary file field
    file = CloudinaryField(
        'file', 
        null=True, 
        blank=True,
        folder='lesson_resources',  # Organize files in Cloudinary
        resource_type='auto'  # Auto-detect file type (image, video, raw for docs)
    )
    
    # Alternative external URL
    external_url = models.URLField(blank=True, help_text="YouTube, external resources, etc.")
    
    # File metadata (auto-populated by Cloudinary)
    file_size = models.PositiveIntegerField(null=True, blank=True, help_text="File size in bytes")
    file_format = models.CharField(max_length=10, blank=True)  # pdf, mp4, jpg, etc.
    
    # Access permissions
    is_visible_to_students = models.BooleanField(default=True)
    is_downloadable = models.BooleanField(default=True)
    
    # Organization
    order = models.PositiveIntegerField(default=0)
    
    # Tracking
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='uploaded_resources'
    )
    
    class Meta:
        ordering = ['order', 'uploaded_at']
        verbose_name = "Lesson Resource"
        verbose_name_plural = "Lesson Resources"
    
    def __str__(self):
        return f"{self.lesson.title} - {self.title}"
    
    @property
    def file_url(self):
        """Get the Cloudinary URL for the file"""
        return self.file.url if self.file else self.external_url

# Optional: Lesson Tags for better organization
class LessonTag(models.Model):
    """Tags to categorize lessons (optional feature)"""
    name = models.CharField(max_length=50, unique=True)
    name_arabic = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=7, default='#007bff', help_text="Hex color code")
    
    def __str__(self):
        return self.name

class LessonTagging(models.Model):
    """Many-to-many relationship between lessons and tags"""
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    tag = models.ForeignKey(LessonTag, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ['lesson', 'tag']