# projects/models.py

from django.db import models
from django.conf import settings
from django.utils import timezone
from cloudinary.models import CloudinaryField


class Project(models.Model):
    """Multi-task projects for team collaboration"""

    class Status(models.TextChoices):
        PLANNING = 'PLANNING', 'التخطيط - Planification'
        IN_PROGRESS = 'IN_PROGRESS', 'قيد التنفيذ - En cours'
        ON_HOLD = 'ON_HOLD', 'متوقف - En pause'
        COMPLETED = 'COMPLETED', 'مكتمل - Terminé'
        CANCELLED = 'CANCELLED', 'ملغي - Annulé'

    # Core fields
    title = models.CharField(max_length=200)
    title_arabic = models.CharField(max_length=200, blank=True)
    title_french = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    description_arabic = models.TextField(blank=True)
    description_french = models.TextField(blank=True)

    # Project management
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_projects'
    )
    team_members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='projects',
        blank=True,
        help_text="All team members involved in this project"
    )

    # Status and timing
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PLANNING)
    start_date = models.DateField()
    due_date = models.DateField()
    completed_at = models.DateTimeField(null=True, blank=True)

    # Progress tracking (calculated fields)
    total_tasks = models.PositiveIntegerField(default=0)
    completed_tasks = models.PositiveIntegerField(default=0)
    progress_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.00,
        help_text="Calculated from completed tasks / total tasks"
    )

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'projects_project'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'due_date']),
            models.Index(fields=['created_by', 'created_at']),
        ]
        verbose_name = "Project"
        verbose_name_plural = "Projects"

    def __str__(self):
        return self.title

    @property
    def is_overdue(self):
        """Check if project is overdue"""
        from datetime import date
        return date.today() > self.due_date and self.status not in [self.Status.COMPLETED, self.Status.CANCELLED]

    def update_progress(self):
        """Recalculate project progress based on tasks"""
        tasks = self.project_tasks.all()
        self.total_tasks = tasks.count()
        self.completed_tasks = tasks.filter(status=ProjectTask.Status.COMPLETED).count()

        if self.total_tasks > 0:
            self.progress_percentage = (self.completed_tasks / self.total_tasks) * 100
        else:
            self.progress_percentage = 0

        # Auto-update project status
        if self.progress_percentage == 100 and self.status == self.Status.IN_PROGRESS:
            self.status = self.Status.COMPLETED
            self.completed_at = timezone.now()
        elif self.progress_percentage > 0 and self.status == self.Status.PLANNING:
            self.status = self.Status.IN_PROGRESS

        self.save()


class ProjectTask(models.Model):
    """Individual tasks within a project"""

    class Status(models.TextChoices):
        TODO = 'TODO', 'قائمة المهام - À faire'
        IN_PROGRESS = 'IN_PROGRESS', 'قيد التنفيذ - En cours'
        IN_REVIEW = 'IN_REVIEW', 'قيد المراجعة - En révision'
        COMPLETED = 'COMPLETED', 'مكتمل - Terminé'

    class Priority(models.TextChoices):
        LOW = 'LOW', 'منخفضة - Basse'
        MEDIUM = 'MEDIUM', 'متوسطة - Moyenne'
        HIGH = 'HIGH', 'عالية - Haute'
        CRITICAL = 'CRITICAL', 'حرجة - Critique'

    # Relationships
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='project_tasks'
    )

    # Core fields
    title = models.CharField(max_length=200)
    title_arabic = models.CharField(max_length=200, blank=True)
    title_french = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    description_arabic = models.TextField(blank=True)
    description_french = models.TextField(blank=True)

    # Assignment
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_project_tasks'
    )
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_project_tasks'
    )

    # Status and priority
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.TODO)
    priority = models.CharField(max_length=20, choices=Priority.choices, default=Priority.MEDIUM)

    # Timing
    due_date = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    # Dependencies
    depends_on = models.ManyToManyField(
        'self',
        blank=True,
        symmetrical=False,
        related_name='blocking_tasks',
        help_text="Tasks that must be completed before this one"
    )

    # Order within project
    order = models.PositiveIntegerField(default=0, help_text="Display order within project")

    # Notes
    notes = models.TextField(blank=True)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'projects_projecttask'
        ordering = ['project', 'order', 'created_at']
        indexes = [
            models.Index(fields=['project', 'status']),
            models.Index(fields=['assigned_to', 'status']),
        ]
        verbose_name = "Project Task"
        verbose_name_plural = "Project Tasks"

    def __str__(self):
        return f"{self.project.title} - {self.title}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update project progress when task status changes
        self.project.update_progress()

    @property
    def is_blocked(self):
        """Check if task is blocked by incomplete dependencies"""
        return self.depends_on.exclude(status=self.Status.COMPLETED).exists()

    @property
    def is_overdue(self):
        """Check if task is overdue"""
        if not self.due_date:
            return False
        return timezone.now() > self.due_date and self.status != self.Status.COMPLETED


class ProjectComment(models.Model):
    """Comments and activity on projects and tasks"""

    class CommentType(models.TextChoices):
        COMMENT = 'COMMENT', 'تعليق - Commentaire'
        UPDATE = 'UPDATE', 'تحديث - Mise à jour'
        ATTACHMENT = 'ATTACHMENT', 'مرفق - Pièce jointe'

    # Can comment on either project or task
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='comments'
    )
    task = models.ForeignKey(
        ProjectTask,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='comments'
    )

    # Comment data
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='project_comments'
    )
    content = models.TextField()
    comment_type = models.CharField(max_length=20, choices=CommentType.choices, default=CommentType.COMMENT)

    # Attachments
    attachment = CloudinaryField('file', null=True, blank=True, folder='project_attachments/')
    attachment_name = models.CharField(max_length=255, blank=True)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'projects_projectcomment'
        ordering = ['-created_at']
        verbose_name = "Project Comment"
        verbose_name_plural = "Project Comments"

    def __str__(self):
        target = self.task.title if self.task else self.project.title
        return f"{self.author.get_full_name() if self.author else 'Unknown'} on {target}"
