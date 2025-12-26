from django.db import models
from users.models import User


class ActivityLog(models.Model):
    class Action(models.TextChoices):
        MESSAGE_SENT = 'MESSAGE_SENT', 'Message sent'
        HOMEWORK_CREATED = 'HOMEWORK_CREATED', 'Homework created'
        HOMEWORK_PUBLISHED = 'HOMEWORK_PUBLISHED', 'Homework published'
        PAYMENT_RECORDED = 'PAYMENT_RECORDED', 'Payment recorded'
        USER_CREATED = 'USER_CREATED', 'User created'
        USER_UPDATED = 'USER_UPDATED', 'User updated'
        SYSTEM = 'SYSTEM', 'System'
        OTHER = 'OTHER', 'Other'

    actor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='activity_logs'
    )
    actor_role = models.CharField(max_length=30, blank=True)
    action = models.CharField(max_length=50, choices=Action.choices)
    description = models.TextField(blank=True)

    target_app = models.CharField(max_length=50, blank=True)
    target_model = models.CharField(max_length=50, blank=True)
    target_id = models.CharField(max_length=64, blank=True, null=True)
    target_repr = models.CharField(max_length=255, blank=True)

    metadata = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['action']),
            models.Index(fields=['actor']),
        ]

    def save(self, *args, **kwargs):
        if self.actor and not self.actor_role:
            self.actor_role = self.actor.role
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.get_action_display()} - {self.target_repr or self.target_model or ''}"
