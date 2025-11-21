# homework/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import ExerciseSubmission, LessonProgress


@receiver(post_save, sender=ExerciseSubmission)
def update_lesson_progress_on_exercise_completion(sender, instance, created, **kwargs):
    """
    Auto-update LessonProgress when an exercise submission is completed.
    This tracks student progress through lessons.
    """
    # Only update progress when exercise is completed or graded
    if instance.status not in ['completed', 'auto_graded', 'reviewed']:
        return

    student = instance.student
    lesson = instance.exercise.lesson

    # Get or create LessonProgress record
    lesson_progress, progress_created = LessonProgress.objects.get_or_create(
        student=student,
        lesson=lesson,
        defaults={
            'status': 'not_started',
            'first_viewed_at': timezone.now()
        }
    )

    # Update the progress metrics
    lesson_progress.update_progress()
