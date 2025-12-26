from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import ActivityLog
from .utils import log_activity


# Communication: Messages
try:
    from communication.models import Message

    @receiver(post_save, sender=Message)
    def log_message_sent(sender, instance, created, **kwargs):
        if not created:
            return
        log_activity(
            actor=instance.sender,
            action=ActivityLog.Action.MESSAGE_SENT,
            target=instance,
            description=f"Message sent in conversation {instance.conversation_id}",
            metadata={
                'message_id': instance.id,
                'conversation_id': instance.conversation_id,
                'snippet': instance.content[:120],
            },
        )
except Exception:
    # Communication app might be unavailable during initial migrations
    pass


# Finance: Payments
try:
    from finance.models import Payment

    @receiver(post_save, sender=Payment)
    def log_payment_recorded(sender, instance, created, **kwargs):
        if not created:
            return
        log_activity(
            actor=instance.recorded_by,
            action=ActivityLog.Action.PAYMENT_RECORDED,
            target=instance,
            description=f"Payment of {instance.amount} recorded for invoice {instance.invoice_id}",
            metadata={
                'payment_id': instance.id,
                'invoice_id': instance.invoice_id,
                'student_id': instance.invoice.student_id if instance.invoice_id else None,
                'method': instance.method,
            },
        )
except Exception:
    pass


# Homework: Creation/publish events
try:
    from homework.models import Homework

    @receiver(post_save, sender=Homework)
    def log_homework_created(sender, instance, created, **kwargs):
        if created:
            log_activity(
                actor=instance.teacher,
                action=ActivityLog.Action.HOMEWORK_CREATED,
                target=instance,
                description=f"Homework '{instance.title}' created for class {instance.school_class_id}",
                metadata={
                    'homework_id': instance.id,
                    'class_id': instance.school_class_id,
                    'grade_id': instance.grade_id,
                    'is_published': instance.is_published,
                },
            )
        elif instance.is_published and ('is_published' in (kwargs.get('update_fields') or [])):
            # Log publish event when flagged as published
            log_activity(
                actor=instance.teacher,
                action=ActivityLog.Action.HOMEWORK_PUBLISHED,
                target=instance,
                description=f"Homework '{instance.title}' published for class {instance.school_class_id}",
                metadata={
                    'homework_id': instance.id,
                    'class_id': instance.school_class_id,
                    'grade_id': instance.grade_id,
                    'is_published': True,
                },
            )
except Exception:
    pass
