# lessons/management/commands/backfill_lesson_availability.py

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson, LessonAvailability
from schools.models import SchoolClass


class Command(BaseCommand):
    help = 'Backfill LessonAvailability records for all existing lessons and classes'

    def add_arguments(self, parser):
        parser.add_argument(
            '--publish-all',
            action='store_true',
            help='Set all created LessonAvailability records to published=True',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be created without actually creating records',
        )

    def handle(self, *args, **options):
        publish_all = options['publish_all']
        dry_run = options['dry_run']

        self.stdout.write(self.style.WARNING('\n=== Backfilling LessonAvailability Records ===\n'))

        if dry_run:
            self.stdout.write(self.style.NOTICE('DRY RUN MODE - No records will be created\n'))

        lessons = Lesson.objects.filter(is_active=True).prefetch_related('tracks')
        total_lessons = lessons.count()

        self.stdout.write(f'Found {total_lessons} active lessons\n')

        created_count = 0
        skipped_count = 0

        with transaction.atomic():
            for idx, lesson in enumerate(lessons, 1):
                self.stdout.write(f'\n[{idx}/{total_lessons}] Processing: {lesson.title}')
                self.stdout.write(f'  Grade: {lesson.grade.name}')

                # Get all classes matching this lesson's grade
                matching_classes = SchoolClass.objects.filter(
                    grade=lesson.grade
                )

                # Filter by tracks if lesson has specific tracks
                if lesson.tracks.exists():
                    track_names = ', '.join([t.name for t in lesson.tracks.all()])
                    self.stdout.write(f'  Tracks: {track_names}')
                    matching_classes = matching_classes.filter(
                        track__in=lesson.tracks.all()
                    )
                else:
                    self.stdout.write('  Tracks: All tracks')

                class_count = matching_classes.count()
                self.stdout.write(f'  Matching classes: {class_count}')

                # Create LessonAvailability records
                lesson_created = 0
                lesson_skipped = 0

                for school_class in matching_classes:
                    # Check if already exists
                    exists = LessonAvailability.objects.filter(
                        lesson=lesson,
                        school_class=school_class
                    ).exists()

                    if exists:
                        lesson_skipped += 1
                        continue

                    if not dry_run:
                        LessonAvailability.objects.create(
                            lesson=lesson,
                            school_class=school_class,
                            is_published=publish_all  # Set based on --publish-all flag
                        )
                    lesson_created += 1

                created_count += lesson_created
                skipped_count += lesson_skipped

                if lesson_created > 0:
                    status = 'Would create' if dry_run else 'Created'
                    self.stdout.write(self.style.SUCCESS(f'  {status}: {lesson_created} availability records'))
                if lesson_skipped > 0:
                    self.stdout.write(self.style.WARNING(f'  Skipped: {lesson_skipped} (already exist)'))

            if dry_run:
                self.stdout.write(self.style.NOTICE('\n=== DRY RUN COMPLETE - Rolling back transaction ==='))
                transaction.set_rollback(True)

        # Summary
        self.stdout.write(self.style.SUCCESS(f'\n=== Summary ==='))
        self.stdout.write(f'Total lessons processed: {total_lessons}')
        if dry_run:
            self.stdout.write(self.style.NOTICE(f'Would create: {created_count} availability records'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Created: {created_count} availability records'))
        self.stdout.write(self.style.WARNING(f'Skipped: {skipped_count} (already existed)'))

        if publish_all and not dry_run:
            self.stdout.write(self.style.SUCCESS('\nAll records set to published=True'))
        elif not dry_run:
            self.stdout.write(self.style.NOTICE('\nAll records set to published=False (default)'))
            self.stdout.write('Teachers can publish lessons individually via the admin panel or API')

        self.stdout.write(self.style.SUCCESS('\nDone!\n'))
