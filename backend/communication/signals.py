from django.db.models.signals import post_save
from django.dispatch import receiver
from django.apps import apps
from .models import Message, Announcement, Notification, Conversation
from users.models import User

@receiver(post_save, sender=Message)
def create_message_notification(sender, instance, created, **kwargs):
    if created:
        # Notify all other participants in the conversation
        conversation = instance.conversation
        sender_user = instance.sender
        
        # Get other participants
        recipients = conversation.participants.exclude(id=sender_user.id)
        
        for recipient in recipients:
            Notification.objects.create(
                recipient=recipient,
                title=f"New message from {sender_user.full_name}",
                message=instance.content[:100] + ('...' if len(instance.content) > 100 else ''),
                notification_type=Notification.Type.MESSAGE,
                related_object_id=conversation.id,
                related_object_type='conversation'
            )

@receiver(post_save, sender=Announcement)
def create_announcement_notification(sender, instance, created, **kwargs):
    if created and instance.is_published:
        # Determine recipients
        recipients = User.objects.none()
        
        if instance.target_role == 'ALL':
            recipients = User.objects.filter(is_active=True)
        else:
            # Map target_role to User.Role
            # Announcement.TargetRole: PARENTS, TEACHERS, STUDENTS
            # User.Role: PARENT, TEACHER, STUDENT
            role_map = {
                'PARENTS': 'PARENT',
                'TEACHERS': 'TEACHER',
                'STUDENTS': 'STUDENT'
            }
            user_role = role_map.get(instance.target_role)
            if user_role:
                recipients = User.objects.filter(role=user_role, is_active=True)
        
        # Filter by grade if specified (only for students)
        if instance.target_grade and instance.target_role == 'STUDENTS':
            # This requires checking StudentEnrollment
            StudentEnrollment = apps.get_model('users', 'StudentEnrollment')
            student_ids = StudentEnrollment.objects.filter(
                school_class__grade=instance.target_grade,
                is_active=True
            ).values_list('student_id', flat=True)
            recipients = recipients.filter(id__in=student_ids)

        # Exclude creator
        if instance.created_by:
            recipients = recipients.exclude(id=instance.created_by.id)
            
        # Create notifications in bulk? No, loop for now to be safe with signals
        # For large numbers, this should be a background task (Celery)
        # We'll limit to 500 for safety in this synchronous implementation
        for recipient in recipients[:500]:
            Notification.objects.create(
                recipient=recipient,
                title=f"New Announcement: {instance.title}",
                message=instance.content[:100] + ('...' if len(instance.content) > 100 else ''),
                notification_type=Notification.Type.ANNOUNCEMENT,
                related_object_id=instance.id,
                related_object_type='announcement'
            )

# We'll import Homework here. If it fails, we might need to move this.
try:
    from homework.models import Homework
    
    @receiver(post_save, sender=Homework)
    def create_homework_notification(sender, instance, created, **kwargs):
        if created and instance.is_published:
            # Notify students in the class
            StudentEnrollment = apps.get_model('users', 'StudentEnrollment')
            student_ids = StudentEnrollment.objects.filter(
                school_class=instance.school_class,
                is_active=True
            ).values_list('student_id', flat=True)
            
            recipients = User.objects.filter(id__in=student_ids)
            
            for recipient in recipients:
                Notification.objects.create(
                    recipient=recipient,
                    title=f"New Homework: {instance.title}",
                    message=f"Due date: {instance.due_date}",
                    notification_type=Notification.Type.HOMEWORK,
                    related_object_id=instance.id,
                    related_object_type='homework'
                )
except ImportError:
    pass # Homework app might not be ready or installed
