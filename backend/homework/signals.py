# homework/signals.py

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from decimal import Decimal
from django.db.models import Sum
from .models import ExerciseSubmission, LessonProgress, Question, Homework


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


def _recalculate_homework_points(homework_id: int):
    """
    Keep Homework.total_points in sync with its questions.
    """
    if not homework_id:
        return

    total = Question.objects.filter(homework_id=homework_id).aggregate(total=Sum('points'))['total'] or Decimal('0')
    Homework.objects.filter(id=homework_id).update(total_points=total)


@receiver(post_save, sender=Question)
def update_homework_points_on_question_save(sender, instance, **kwargs):
    _recalculate_homework_points(instance.homework_id)


@receiver(post_delete, sender=Question)
def update_homework_points_on_question_delete(sender, instance, **kwargs):
    _recalculate_homework_points(instance.homework_id)
