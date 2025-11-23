from django.db import models
from users.models import User
from schools.models import Grade

class Conversation(models.Model):
    class Type(models.TextChoices):
        DIRECT = 'DIRECT', 'Direct Message'
        GROUP = 'GROUP', 'Group Chat'

    participants = models.ManyToManyField(User, related_name='conversations')
    conversation_type = models.CharField(max_length=20, choices=Type.choices, default=Type.DIRECT)
    related_student = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='related_conversations', help_text="For parent-teacher chats about a specific student")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Conversation {self.id} ({self.get_conversation_type_display()})"

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    attachment = models.FileField(upload_to='communication/attachments/', blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Message from {self.sender} at {self.created_at}"

class Announcement(models.Model):
    class TargetRole(models.TextChoices):
        ALL = 'ALL', 'All Users'
        PARENTS = 'PARENTS', 'Parents'
        TEACHERS = 'TEACHERS', 'Teachers'
        STUDENTS = 'STUDENTS', 'Students'

    title = models.CharField(max_length=200)
    content = models.TextField()
    target_role = models.CharField(max_length=20, choices=TargetRole.choices, default=TargetRole.ALL)
    target_grade = models.ForeignKey(Grade, on_delete=models.SET_NULL, null=True, blank=True, help_text="Optional: Filter by grade")
    is_published = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Notification(models.Model):
    class Type(models.TextChoices):
        MESSAGE = 'MESSAGE', 'Message'
        ANNOUNCEMENT = 'ANNOUNCEMENT', 'Announcement'
        HOMEWORK = 'HOMEWORK', 'Homework'
        SYSTEM = 'SYSTEM', 'System'
        OTHER = 'OTHER', 'Other'

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=Type.choices, default=Type.SYSTEM)
    related_object_id = models.IntegerField(null=True, blank=True)
    related_object_type = models.CharField(max_length=50, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification for {self.recipient}: {self.title}"
