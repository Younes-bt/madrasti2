# schools/models.py

from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.contrib.contenttypes.fields import GenericRelation
from cloudinary.models import CloudinaryField

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
    fix_phone = models.CharField(max_length=20, blank=True)
    whatsapp_num = models.CharField(max_length=20, blank=True)
    email = models.EmailField(unique=True)
    website = models.URLField(blank=True)
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    school_code = models.CharField(max_length=50, blank=True)
    pattent = models.CharField(max_length=50, blank=True)
    rc_code = models.CharField(max_length=50, blank=True)
    logo = CloudinaryField('image', folder='school/', blank=True, null=True)
    
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

    @property
    def logo_url(self):
        """Return the absolute URL for the stored logo."""
        if self.logo:
            return self.logo.url
        return None

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
    code = models.CharField(max_length=20, unique=True, null=True, blank=True, help_text="e.g., 'G1', 'G7', '1BAC'")
    name = models.CharField(max_length=100, help_text="e.g., '1ère Année Primaire'")
    name_arabic = models.CharField(max_length=100, blank=True)
    name_french = models.CharField(max_length=100, blank=True)
    passing_grade = models.DecimalField(max_digits=4, decimal_places=2, default=10.00)

    def __str__(self):
        return f"{self.educational_level.name} - {self.name}"

    class Meta:
        unique_together = ['educational_level', 'grade_number']
        ordering = ['educational_level__order', 'grade_number']

class Track(models.Model):
    """Academic tracks/paths (مسالك) within a Grade, e.g., 'Sciences Mathématiques A', 'Sciences Physiques B'."""
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE, related_name='tracks')
    name = models.CharField(max_length=150, help_text="e.g., 'Sciences Mathématiques A'")
    name_arabic = models.CharField(max_length=150, blank=True, help_text="e.g., 'علوم رياضية أ'")
    name_french = models.CharField(max_length=150, blank=True, help_text="e.g., 'Sciences Mathématiques A'")
    code = models.CharField(max_length=20, help_text="e.g., 'SMA', 'SPB'")
    description = models.TextField(blank=True, help_text="Description of the track")
    description_arabic = models.TextField(blank=True)
    description_french = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=1, help_text="Display order within the grade")

    def __str__(self):
        return f"{self.grade.name} - {self.name}"

    class Meta:
        unique_together = ['grade', 'code']
        ordering = ['grade__educational_level__order', 'grade__grade_number', 'order', 'name']

# Refinement 2: Renamed from 'Class' to 'SchoolClass'
class SchoolClass(models.Model):
    """A specific group of students within a Grade/Track for an academic year, e.g., '2ème Bac Sciences Mathématiques A - Groupe 1'."""
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE, related_name='classes')
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name='classes', null=True, blank=True, help_text="Optional track/path for specialized programs")
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.PROTECT, related_name='classes')
    section = models.CharField(max_length=10, help_text="e.g., 'A', 'B', 'Groupe 1'")
    name = models.CharField(max_length=200, editable=False) # Will be auto-generated

    # Teacher-Class relationship
    teachers = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        limit_choices_to={'role': 'TEACHER'},
        related_name='teaching_classes',
        blank=True,
        help_text="Teachers assigned to this class"
    )

    def save(self, *args, **kwargs):
        if not self.name:
            if self.track and self.track.code:
                self.name = f"{self.track.code} - {self.section}"
            elif self.grade and self.grade.code:
                self.name = f"{self.grade.code} - {self.section}"
            elif self.grade:
                self.name = f"{self.grade.name} - {self.section}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.academic_year.year})"

    class Meta:
        unique_together = ['grade', 'track', 'section', 'academic_year']
        ordering = ['grade__educational_level__order', 'grade__grade_number', 'track__order', 'section']
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

class Equipment(models.Model):
    """Represents an equipment item assigned to a room."""
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='equipment_items')
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    quantity = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['room__name', 'name']
        unique_together = ('room', 'name')

    def __str__(self):
        return f"{self.name} ({self.room.name})"

    def get_images(self):
        """Get all images associated with this equipment item."""
        from django.contrib.contenttypes.models import ContentType
        from media.models import MediaRelation
        content_type = ContentType.objects.get_for_model(self)
        return MediaRelation.objects.filter(
            content_type=content_type,
            object_id=self.id,
            relation_type__in=['EQUIPMENT_GALLERY', 'EQUIPMENT_FEATURED']
        ).order_by('order', 'created_at')

    def get_featured_image(self):
        """Return the featured image for the equipment if present."""
        featured_relations = self.get_images().filter(is_featured=True)
        if featured_relations.exists():
            return featured_relations.first().media_file
        return None

    def get_gallery_images(self):
        """Return gallery images that are not marked as featured."""
        return self.get_images().filter(relation_type='EQUIPMENT_GALLERY', is_featured=False)

    def get_image_count(self):
        """Return number of media relations associated with this equipment."""
        return self.get_images().count()

    @property
    def image_count(self):
        return self.get_image_count()

class Vehicle(models.Model):
    """Represents a school-owned vehicle such as a car, bus, or van."""

    class VehicleType(models.TextChoices):
        BUS = 'BUS', 'Bus'
        MINIBUS = 'MINIBUS', 'Minibus'
        VAN = 'VAN', 'Van'
        CAR = 'CAR', 'Car'
        OTHER = 'OTHER', 'Other'

    school = models.ForeignKey(
        School,
        on_delete=models.CASCADE,
        related_name='vehicles',
        null=True,
        blank=True,
        help_text="Owning school, optional for single-school deployments"
    )
    name = models.CharField(
        max_length=120,
        help_text="Friendly name or route identifier for the vehicle",
        blank=True
    )
    vehicle_type = models.CharField(
        max_length=20,
        choices=VehicleType.choices,
        default=VehicleType.BUS
    )
    model = models.CharField(max_length=120, help_text="Manufacturer and model, e.g., Mercedes Sprinter")
    plate_number = models.CharField(max_length=25, unique=True)
    driver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_vehicles',
        limit_choices_to={'profile__position': 'DRIVER'}
    )
    capacity = models.PositiveIntegerField(null=True, blank=True, help_text="Maximum number of passengers")
    color = models.CharField(max_length=50, blank=True)
    manufacture_year = models.PositiveIntegerField(null=True, blank=True)
    last_oil_change_date = models.DateField(null=True, blank=True)
    last_service_date = models.DateField(null=True, blank=True)
    insurance_expiry_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['vehicle_type', 'model', 'plate_number']

    def __str__(self):
        display_name = self.name or self.model
        return f"{display_name} ({self.plate_number})"

    def get_images(self):
        """Return all media relations associated with this vehicle."""
        from django.contrib.contenttypes.models import ContentType
        from media.models import MediaRelation
        content_type = ContentType.objects.get_for_model(self)
        return MediaRelation.objects.filter(
            content_type=content_type,
            object_id=self.id,
            relation_type__in=['VEHICLE_GALLERY', 'VEHICLE_FEATURED']
        ).order_by('order', 'created_at')

    def get_featured_image(self):
        """Return the featured image relation if available."""
        featured_relations = self.get_images().filter(is_featured=True)
        if featured_relations.exists():
            return featured_relations.first().media_file
        return None

    def get_gallery_images(self):
        """Return non-featured gallery images."""
        return self.get_images().filter(relation_type='VEHICLE_GALLERY', is_featured=False)

    def get_image_count(self):
        return self.get_images().count()

    @property
    def image_count(self):
        return self.get_image_count()

class VehicleMaintenanceRecord(models.Model):
    """Keeps track of maintenance and repair history for a vehicle."""
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='maintenance_records')
    service_date = models.DateField()
    service_type = models.CharField(max_length=120, help_text="Type of service or repair performed")
    description = models.TextField(blank=True)
    service_location = models.CharField(max_length=255, blank=True, help_text="Where the service was carried out")
    mileage = models.PositiveIntegerField(null=True, blank=True, help_text="Vehicle mileage at the time of service")
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    attachments = GenericRelation(
        'media.MediaRelation',
        related_query_name='maintenance_record'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-service_date', '-created_at']

    def __str__(self):
        return f"{self.vehicle} - {self.service_type} on {self.service_date}"

    def get_attachments(self):
        """Return maintenance attachments ordered by display preference."""
        attachments = getattr(self, '_prefetched_attachments', None)
        if attachments is not None:
            return attachments
        return (
            self.attachments.filter(relation_type='VEHICLE_MAINTENANCE_ATTACHMENT')
            .select_related('media_file')
            .order_by('order', 'created_at')
        )

    def get_attachments_count(self):
        """Return the number of maintenance attachments."""
        attachments = getattr(self, '_prefetched_attachments', None)
        if attachments is not None:
            return len(attachments)
        return self.attachments.filter(relation_type='VEHICLE_MAINTENANCE_ATTACHMENT').count()

    @property
    def attachments_count(self):
        return self.get_attachments_count()

class GasoilRecord(models.Model):
    """Tracks vehicle fuel (gasoil) refills."""
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='gasoil_records')
    refuel_date = models.DateField()
    liters = models.DecimalField(max_digits=8, decimal_places=2, help_text="Number of liters filled")
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Total amount paid for the refill")
    fuel_station = models.CharField(max_length=255, blank=True, help_text="Where the vehicle was refueled")
    receipt_number = models.CharField(max_length=120, blank=True, help_text="Optional receipt or reference number")
    notes = models.TextField(blank=True)
    attachments = GenericRelation(
        'media.MediaRelation',
        related_query_name='gasoil_record'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-refuel_date', '-created_at']

    def __str__(self):
        return f"{self.vehicle} - {self.refuel_date} ({self.liters} L)"

    def get_attachments(self):
        """Return gasoil attachments ordered by display preference."""
        attachments = getattr(self, '_prefetched_attachments', None)
        if attachments is not None:
            return attachments
        return (
            self.attachments.filter(relation_type='VEHICLE_GASOIL_ATTACHMENT')
            .select_related('media_file')
            .order_by('order', 'created_at')
        )

    def get_attachments_count(self):
        """Return the number of gasoil attachments."""
        attachments = getattr(self, '_prefetched_attachments', None)
        if attachments is not None:
            return len(attachments)
        return self.attachments.filter(relation_type='VEHICLE_GASOIL_ATTACHMENT').count()

    @property
    def attachments_count(self):
        return self.get_attachments_count()

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
