from django.db import models
from django.conf import settings
from django.utils import timezone


class LabToolCategory(models.Model):
    """Categories for organizing lab tools"""
    CATEGORY_CHOICES = [
        ('math', 'Mathematics'),
        ('physics', 'Physics'),
        ('chemistry', 'Chemistry'),
        ('biology', 'Biology'),
        ('economics', 'Economics'),
        ('languages', 'Languages'),
    ]

    name = models.CharField(max_length=50, choices=CATEGORY_CHOICES, unique=True)
    name_ar = models.CharField(max_length=100)
    name_fr = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100)
    icon = models.CharField(max_length=50, help_text="Lucide icon name")
    color = models.CharField(max_length=7, default='#3b82f6')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = "Lab Tool Category"
        verbose_name_plural = "Lab Tool Categories"

    def __str__(self):
        return self.name_en


class LabTool(models.Model):
    """Available lab tools in the system"""
    tool_id = models.CharField(
        max_length=100,
        unique=True,
        help_text="URL-safe identifier (e.g., 'function-grapher')"
    )

    # Names (multilingual)
    name_ar = models.CharField(max_length=200)
    name_fr = models.CharField(max_length=200)
    name_en = models.CharField(max_length=200)

    # Descriptions
    description_ar = models.TextField()
    description_fr = models.TextField()
    description_en = models.TextField()

    # Instructions (how to use)
    instructions_ar = models.TextField(blank=True)
    instructions_fr = models.TextField(blank=True)
    instructions_en = models.TextField(blank=True)

    # Organization
    category = models.ForeignKey(
        LabToolCategory,
        on_delete=models.CASCADE,
        related_name='tools'
    )
    icon = models.CharField(max_length=50, help_text="Lucide icon name")
    thumbnail = models.ImageField(
        upload_to='lab_tools/thumbnails/',
        null=True,
        blank=True
    )

    # Curriculum mapping
    grade_levels = models.JSONField(
        default=list,
        help_text="List of grade codes: ['1AC', '2AC', '3AC', 'TC', '1BAC', '2BAC']"
    )

    # Features
    features = models.JSONField(
        default=dict,
        help_text="Tool-specific features and capabilities"
    )

    # Availability
    is_active = models.BooleanField(default=True)
    is_premium = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False, help_text="Show 'NEW' badge")

    # Metadata
    version = models.CharField(max_length=20, default='1.0.0')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_lab_tools'
    )

    # Statistics (denormalized for performance)
    total_uses = models.PositiveIntegerField(default=0)
    unique_users = models.PositiveIntegerField(default=0)
    average_duration = models.PositiveIntegerField(
        default=0,
        help_text="Seconds"
    )

    class Meta:
        ordering = ['category__order', 'name_en']
        verbose_name = "Lab Tool"
        verbose_name_plural = "Lab Tools"

    def __str__(self):
        return f"{self.name_en} ({self.category.name})"


class LabUsage(models.Model):
    """Track individual usage sessions of lab tools"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lab_usage'
    )
    tool = models.ForeignKey(
        LabTool,
        on_delete=models.CASCADE,
        related_name='usage_logs'
    )

    # Session details
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    duration_seconds = models.PositiveIntegerField(null=True, blank=True)

    # Context (if accessed via assignment or activity)
    assignment = models.ForeignKey(
        'LabAssignment',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    activity = models.ForeignKey(
        'LabActivity',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    # Interaction data (tool-specific)
    interaction_data = models.JSONField(
        default=dict,
        help_text="Tool-specific usage data (e.g., functions plotted, calculations performed)"
    )

    # Device info
    device_type = models.CharField(
        max_length=20,
        choices=[
            ('desktop', 'Desktop'),
            ('tablet', 'Tablet'),
            ('mobile', 'Mobile')
        ],
        default='desktop'
    )

    class Meta:
        ordering = ['-started_at']
        indexes = [
            models.Index(fields=['user', 'tool', '-started_at']),
            models.Index(fields=['tool', '-started_at']),
        ]

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.tool.name_en} - {self.started_at}"


class LabAssignment(models.Model):
    """Teacher-assigned lab tool tasks for students"""
    title = models.CharField(max_length=200)
    title_ar = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    instructions = models.TextField()

    # Creator
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lab_assignments'
    )

    # Target
    school_class = models.ForeignKey(
        'schools.SchoolClass',
        on_delete=models.CASCADE,
        related_name='lab_assignments'
    )
    subject = models.ForeignKey(
        'schools.Subject',
        on_delete=models.CASCADE,
        related_name='lab_assignments'
    )

    # Tool & Task
    tool = models.ForeignKey(
        LabTool,
        on_delete=models.CASCADE,
        related_name='assignments'
    )
    task_details = models.JSONField(
        default=dict,
        help_text="Specific task instructions (e.g., 'Graph these functions')"
    )

    # Timing
    assigned_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()
    estimated_duration = models.PositiveIntegerField(help_text="Minutes")

    # Submission requirements
    requires_submission = models.BooleanField(default=True)
    submission_format = models.CharField(
        max_length=50,
        choices=[
            ('screenshot', 'Screenshot'),
            ('file', 'File Upload'),
            ('text', 'Text Response'),
            ('automatic', 'Automatic Tracking')
        ],
        default='screenshot'
    )

    # Grading
    total_points = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=10.00
    )
    auto_grade = models.BooleanField(default=False)

    # Status
    is_active = models.BooleanField(default=True)
    is_published = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.tool.name_en} - {self.school_class.name}"


class LabAssignmentSubmission(models.Model):
    """Student submissions for lab assignments"""
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('submitted', 'Submitted'),
        ('graded', 'Graded'),
    ]

    assignment = models.ForeignKey(
        LabAssignment,
        on_delete=models.CASCADE,
        related_name='submissions'
    )
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lab_assignment_submissions'
    )

    # Submission
    submitted_at = models.DateTimeField(null=True, blank=True)
    submission_text = models.TextField(blank=True)
    submission_file = models.FileField(
        upload_to='lab_assignments/',
        null=True,
        blank=True
    )

    # Tracking
    usage_session = models.ForeignKey(
        LabUsage,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    time_spent = models.PositiveIntegerField(default=0, help_text="Minutes")

    # Grading
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='not_started'
    )
    score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )
    teacher_feedback = models.TextField(blank=True)
    graded_at = models.DateTimeField(null=True, blank=True)
    graded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='graded_lab_submissions'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['assignment', 'student']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.get_full_name()} - {self.assignment.title}"


class LabActivity(models.Model):
    """Custom activities created by teachers using lab tools"""
    title = models.CharField(max_length=200)
    title_ar = models.CharField(max_length=200, blank=True)
    description = models.TextField()

    # Creator
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lab_activities'
    )

    # Tool
    tool = models.ForeignKey(
        LabTool,
        on_delete=models.CASCADE,
        related_name='activities'
    )

    # Activity configuration
    activity_config = models.JSONField(
        default=dict,
        help_text="Tool-specific activity configuration"
    )

    # Curriculum mapping
    grade_levels = models.JSONField(default=list)

    # Sharing
    is_public = models.BooleanField(default=False)
    is_template = models.BooleanField(default=False)

    # Metadata
    uses_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Lab Activity"
        verbose_name_plural = "Lab Activities"

    def __str__(self):
        return self.title


class LabToolAnalytics(models.Model):
    """Aggregated analytics for lab tools (daily snapshots)"""
    tool = models.ForeignKey(
        LabTool,
        on_delete=models.CASCADE,
        related_name='analytics'
    )
    date = models.DateField()

    # Usage metrics
    total_sessions = models.PositiveIntegerField(default=0)
    unique_users = models.PositiveIntegerField(default=0)
    total_duration_seconds = models.PositiveIntegerField(default=0)
    average_duration_seconds = models.PositiveIntegerField(default=0)

    # User breakdown
    student_users = models.PositiveIntegerField(default=0)
    teacher_users = models.PositiveIntegerField(default=0)
    admin_users = models.PositiveIntegerField(default=0)

    # Device breakdown
    desktop_sessions = models.PositiveIntegerField(default=0)
    tablet_sessions = models.PositiveIntegerField(default=0)
    mobile_sessions = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['tool', 'date']
        ordering = ['-date']
        verbose_name = "Lab Tool Analytics"
        verbose_name_plural = "Lab Tool Analytics"

    def __str__(self):
        return f"{self.tool.name_en} - {self.date}"
