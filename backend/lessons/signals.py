# lessons/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Lesson, LessonAvailability


@receiver(post_save, sender=Lesson)
def create_lesson_availability_for_all_classes(sender, instance, created, **kwargs):
    """
    Auto-create LessonAvailability records for all classes matching the lesson's grade and tracks
    when a new lesson is created.
    """
    if created:
        from schools.models import SchoolClass

        # Get all classes that match this lesson's grade
        matching_classes = SchoolClass.objects.filter(
            grade=instance.grade
        )

        # If lesson has specific tracks, filter by those tracks
        if instance.tracks.exists():
            matching_classes = matching_classes.filter(
                track__in=instance.tracks.all()
            )

        # Create LessonAvailability for each matching class
        availability_records = []
        for school_class in matching_classes:
            availability_records.append(
                LessonAvailability(
                    lesson=instance,
                    school_class=school_class,
                    is_published=False  # Default to unpublished
                )
            )

        # Bulk create for better performance
        if availability_records:
            LessonAvailability.objects.bulk_create(
                availability_records,
                ignore_conflicts=True  # Ignore if already exists
            )
