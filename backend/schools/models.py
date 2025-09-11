# schools/models.py

from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

# Refinement 1: Centralized Academic Year Management
class AcademicYear(models.Model):
    """Represents a single academic year, e.g., '2024-2025'."""
    year = models.CharField(max_length=9, unique=True, help_text="Format: YYYY-YYYY")
    start_date = models.DateField()
    end_date = models.DateField()
    is_current = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Ensures only one academic year can be marked as current
        if self.is_current:
            AcademicYear.objects.filter(is_current=True).update(is_current=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.year}{' (Current)' if self.is_current else ''}"

    class Meta:
        ordering = ['-year']

# The Singleton School Configuration Model
class School(models.Model):
    """A singleton model to hold the school's central configuration."""
    name = models.CharField(max_length=200)
    name_arabic = models.CharField(max_length=200, blank=True)
    name_french = models.CharField(max_length=200, blank=True)
    
    phone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    website = models.URLField(blank=True)
    logo = models.ImageField(upload_to='school/', blank=True, null=True)
    
    address = models.TextField()
    city = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=10, blank=True)
    
    # Refinement 1 (continued): Link to the new AcademicYear model
    current_academic_year = models.ForeignKey(
        AcademicYear,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='school_set'
    )
    
    director = models.ForeignKey(
        settings.AUTH_USER_MODEL, # Refinement 1: Use settings.AUTH_USER_MODEL
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='directed_school'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        # Enforce that only one School instance can be created
        if not self.pk and School.objects.exists():
            raise ValidationError('Only one school configuration is allowed. Please edit the existing one.')
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "School Configuration"
        verbose_name_plural = "School Configuration"

# Educational Structure Models
class EducationalLevel(models.Model):
    """E.g., Preschool, Primary, Lower Secondary, Upper Secondary."""
    LEVEL_CHOICES = [
        ('PRESCHOOL', 'Préscolaire'),
        ('PRIMARY', 'Primaire'), 
        ('LOWER_SECONDARY', 'Collège'),
        ('UPPER_SECONDARY', 'Lycée'),
    ]
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, unique=True)
    name = models.CharField(max_length=100)
    name_arabic = models.CharField(max_length=100, blank=True)
    name_french = models.CharField(max_length=100, blank=True)
    order = models.PositiveIntegerField(unique=True, help_text="Order of progression (e.g., 1 for Preschool, 2 for Primary)")

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['order']

class Grade(models.Model):
    """A specific grade level within an EducationalLevel, e.g., '1st Grade' in 'Primary'."""
    educational_level = models.ForeignKey(EducationalLevel, on_delete=models.CASCADE, related_name='grades')
    grade_number = models.PositiveIntegerField(help_text="Numeric value of the grade within the level (e.g., 1, 2, 3)")
    name = models.CharField(max_length=100, help_text="e.g., '1ère Année Primaire'")
    name_arabic = models.CharField(max_length=100, blank=True)
    name_french = models.CharField(max_length=100, blank=True)
    passing_grade = models.DecimalField(max_digits=4, decimal_places=2, default=10.00)
    
    def __str__(self):
        return f"{self.educational_level.name} - {self.name}"

    class Meta:
        unique_together = ['educational_level', 'grade_number']
        ordering = ['educational_level__order', 'grade_number']

# Refinement 2: Renamed from 'Class' to 'SchoolClass'
class SchoolClass(models.Model):
    """A specific group of students within a Grade for an academic year, e.g., '1st Grade A'."""
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE, related_name='classes')
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.PROTECT, related_name='classes')
    section = models.CharField(max_length=10, help_text="e.g., 'A', 'B', 'Science-1'")
    name = models.CharField(max_length=100, editable=False) # Will be auto-generated

    def save(self, *args, **kwargs):
        # Auto-generate the name based on grade and section
        self.name = f"{self.grade.name} - {self.section}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.name} ({self.academic_year.year})"
    
    class Meta:
        unique_together = ['grade', 'section', 'academic_year']
        ordering = ['grade__educational_level__order', 'grade__grade_number', 'section']
        verbose_name = "Class"
        verbose_name_plural = "Classes"

# Infrastructure and Academic Models
class Room(models.Model):
    """A physical room in the school."""
    ROOM_TYPES = [
        ('CLASSROOM', 'Classroom'), ('LAB', 'Laboratory'), ('LIBRARY', 'Library'),
        ('GYM', 'Gymnasium'), ('COMPUTER', 'Computer Lab'), ('ART', 'Art Room'),
        ('MUSIC', 'Music Room'), ('OTHER', 'Other'),
    ]
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True, help_text="e.g., 'B101'")
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES, default='CLASSROOM')
    capacity = models.PositiveIntegerField(default=30)
    
    def __str__(self):
        return self.name
    
    def get_images(self):
        """Get all images associated with this room"""
        from django.contrib.contenttypes.models import ContentType
        from media.models import MediaRelation
        ct = ContentType.objects.get_for_model(self)
        return MediaRelation.objects.filter(
            content_type=ct,
            object_id=self.id,
            relation_type__in=['ROOM_GALLERY', 'ROOM_FEATURED']
        ).order_by('order', 'created_at')
    
    def get_featured_image(self):
        """Get the featured image for this room"""
        featured_relations = self.get_images().filter(is_featured=True)
        if featured_relations.exists():
            return featured_relations.first().media_file
        return None
    
    def get_gallery_images(self):
        """Get gallery images (non-featured) for this room"""
        return self.get_images().filter(relation_type='ROOM_GALLERY', is_featured=False)

    def get_image_count(self):
        return self.get_images().count()
    
    @property
    def image_count(self):
        """Get count of images associated with this room"""
        return self.get_images().count()

class Subject(models.Model):
    """An academic subject taught at the school, e.g., Mathematics."""
    name = models.CharField(max_length=100)
    name_arabic = models.CharField(max_length=100, blank=True)
    name_french = models.CharField(max_length=100, blank=True)
    code = models.CharField(max_length=20, unique=True, help_text="e.g., 'MATH101'")
    
    def __str__(self):
        return self.name

class SubjectGrade(models.Model):
    """Links a Subject to a Grade, defining its specific curriculum details for that grade."""
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='grade_configs')
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE, related_name='subject_configs')
    
    is_mandatory = models.BooleanField(default=True)
    weekly_hours = models.PositiveIntegerField(default=2)
    coefficient = models.DecimalField(max_digits=3, decimal_places=1, default=1.0)
    
    def __str__(self):
        return f"{self.subject.name} - {self.grade.name}"
    
    class Meta:
        unique_together = ['subject', 'grade']