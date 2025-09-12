# backend/users/models.py

from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver
from cloudinary.models import CloudinaryField
from datetime import date
import uuid

from .managers import CustomUserManager

class User(AbstractUser):
    """
    Custom User model for authentication only.
    Email is the unique identifier.
    """
    username = None  # We don't use a username, so set it to None
    email = models.EmailField(_('email address'), unique=True)

    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        TEACHER = 'TEACHER', 'Teacher'
        STUDENT = 'STUDENT', 'Student'
        PARENT = 'PARENT', 'Parent'
        STAFF = 'STAFF', 'Staff'
        DRIVER = 'DRIVER', 'Driver'

    role = models.CharField(max_length=50, choices=Role.choices, default=Role.STUDENT)
    
    # Parent-Student relationship (one parent can have multiple students)
    parent = models.ForeignKey(
        'self', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='children',
        limit_choices_to={'role': 'PARENT'},
        help_text='Parent user account (only applicable for students)'
    )
    
    # Account status and timestamps
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    groups = models.ManyToManyField(
        Group,
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name="user_set_custom",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name="user_permissions_custom",
        related_query_name="user",
    )

    def __str__(self):
        return self.email
    
    @property
    def full_name(self):
        """Return the user's full name from profile."""
        try:
            return self.profile.full_name
        except Profile.DoesNotExist:
            return f"{self.first_name} {self.last_name}".strip()
    
    class Meta:
        db_table = 'users_user'
        verbose_name = _('User')
        verbose_name_plural = _('Users')


class Profile(models.Model):
    """
    User profile model containing all personal information.
    One-to-One relationship with User model.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Multilingual name fields
    ar_first_name = models.CharField(max_length=150, blank=True, null=True, verbose_name=_('Arabic First Name'))
    ar_last_name = models.CharField(max_length=150, blank=True, null=True, verbose_name=_('Arabic Last Name'))
    
    # Personal information
    phone = models.CharField(max_length=15, blank=True, null=True, verbose_name=_('Phone Number'))
    date_of_birth = models.DateField(blank=True, null=True, verbose_name=_('Date of Birth'))
    address = models.TextField(blank=True, null=True, verbose_name=_('Address'))
    
    # Profile media
    profile_picture = CloudinaryField('image', blank=True, null=True)
    
    # Bio/About information
    bio = models.TextField(blank=True, null=True, verbose_name=_('Biography'), 
                          help_text=_("Brief description about the user"))
    
    # Emergency contact information
    emergency_contact_name = models.CharField(max_length=100, blank=True, null=True, 
                                            verbose_name=_('Emergency Contact Name'))
    emergency_contact_phone = models.CharField(max_length=15, blank=True, null=True,
                                             verbose_name=_('Emergency Contact Phone'))
    
    # Social media links (optional)
    linkedin_url = models.URLField(blank=True, null=True, verbose_name=_('LinkedIn URL'))
    twitter_url = models.URLField(blank=True, null=True, verbose_name=_('Twitter URL'))
    
    # Professional information (for staff/teachers)
    department = models.CharField(max_length=100, blank=True, null=True, verbose_name=_('Department'))
    position = models.CharField(max_length=100, blank=True, null=True, verbose_name=_('Position'))
    
    # Subject specialization for teachers
    school_subject = models.ForeignKey(
        'schools.Subject',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='teachers',
        verbose_name=_('School Subject'),
        help_text=_('The subject this teacher specializes in')
    )
    
    hire_date = models.DateField(blank=True, null=True, verbose_name=_('Hire Date'))
    salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name=_('Salary'))
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def full_name(self):
        """Return the user's full name."""
        return f"{self.user.first_name} {self.user.last_name}".strip()
    
    @property
    def ar_full_name(self):
        """Return the user's full name in Arabic."""
        if self.ar_first_name and self.ar_last_name:
            return f"{self.ar_first_name} {self.ar_last_name}".strip()
        return self.full_name  # Fallback to English name
    
    def get_full_name(self, language='en'):
        """Return the user's full name in the specified language."""
        if language == 'ar' and self.ar_first_name and self.ar_last_name:
            return self.ar_full_name
        return self.full_name
    
    @property
    def profile_picture_url(self):
        """Get the Cloudinary URL for the profile picture."""
        if self.profile_picture:
            return self.profile_picture.url
        return None
    
    @property
    def age(self):
        """Calculate age from date of birth."""
        if self.date_of_birth:
            from datetime import date
            today = date.today()
            return today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
        return None
    
    def __str__(self):
        return f"Profile of {self.user.email}"
    
    class Meta:
        db_table = 'users_profile'
        verbose_name = _('Profile')
        verbose_name_plural = _('Profiles')


class StudentEnrollment(models.Model):
    """Student enrollment in a specific class for an academic year"""
    student = models.ForeignKey(
        'User', 
        on_delete=models.CASCADE, 
        related_name='student_enrollments',
        limit_choices_to={'role': 'STUDENT'}
    )
    school_class = models.ForeignKey('schools.SchoolClass', on_delete=models.CASCADE, related_name='student_enrollments')
    academic_year = models.ForeignKey('schools.AcademicYear', on_delete=models.CASCADE, related_name='student_enrollments')
    
    # Enrollment details
    enrollment_date = models.DateField(default=date.today)
    is_active = models.BooleanField(default=True)
    
    # Student number/ID for the class
    student_number = models.CharField(max_length=20, blank=True, help_text="Student number in this class")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['student', 'school_class', 'academic_year']
        ordering = ['student__last_name', 'student__first_name']
        verbose_name = "Student Enrollment"
        verbose_name_plural = "Student Enrollments"
        db_table = 'users_studentenrollment'  # Keep consistent with users app
    
    def __str__(self):
        return f"{self.student.full_name} - {self.school_class.name} ({self.academic_year.year})"


class BulkImportJob(models.Model):
    """Track progress of bulk import operations"""
    
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PROCESSING = 'PROCESSING', 'Processing'
        COMPLETED = 'COMPLETED', 'Completed'
        FAILED = 'FAILED', 'Failed'
    
    # Job identification
    job_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bulk_import_jobs')
    
    # Progress tracking
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    progress = models.IntegerField(default=0, help_text="Progress percentage (0-100)")
    current_status = models.CharField(max_length=255, blank=True, help_text="Current operation status")
    
    # Import details
    total_records = models.IntegerField(default=0)
    processed_records = models.IntegerField(default=0)
    successful_records = models.IntegerField(default=0)
    failed_records = models.IntegerField(default=0)
    
    # Results and errors
    error_message = models.TextField(blank=True, null=True)
    results = models.JSONField(blank=True, null=True, help_text="Import results data")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'users_bulkimportjob'
        ordering = ['-created_at']
        verbose_name = "Bulk Import Job"
        verbose_name_plural = "Bulk Import Jobs"
    
    def __str__(self):
        return f"Bulk Import Job {self.job_id} - {self.status}"
    
    @property
    def is_completed(self):
        return self.status in [self.Status.COMPLETED, self.Status.FAILED]
    
    def update_progress(self, progress, status=None):
        """Update job progress and status"""
        self.progress = min(100, max(0, progress))
        if status:
            self.current_status = status
        self.save(update_fields=['progress', 'current_status'])
    
    def mark_completed(self, results=None):
        """Mark job as completed with results"""
        from django.utils import timezone
        self.status = self.Status.COMPLETED
        self.progress = 100
        self.completed_at = timezone.now()
        if results:
            self.results = results
        self.save()
    
    def mark_failed(self, error_message):
        """Mark job as failed with error message"""
        from django.utils import timezone
        self.status = self.Status.FAILED
        self.error_message = error_message
        self.completed_at = timezone.now()
        self.save()


# Django Signals
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Automatically create a Profile instance when a User is created.
    """
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Automatically save the Profile when the User is saved.
    """
    try:
        instance.profile.save()
    except Profile.DoesNotExist:
        Profile.objects.create(user=instance)