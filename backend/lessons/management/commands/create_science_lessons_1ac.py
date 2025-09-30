from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Science/Biology lessons for 1AC (Première Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 1AC Science lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 5 lessons (Biology/Living Things)
        lessons_s1 = [
            {'order': 1, 'title': 'Exploration of Natural Environments', 'title_french': 'L\'exploration des milieux naturels'},
            {'order': 2, 'title': 'Respiration and Living Environments of Living Beings', 'title_french': 'La respiration et milieux de vie des êtres vivants'},
            {'order': 3, 'title': 'Nutrition in Living Beings', 'title_french': 'L\'alimentation chez les êtres vivants'},
            {'order': 4, 'title': 'Trophic Relationships and Natural Balances', 'title_french': 'Les relations trophiques et les équilibres naturels'},
            {'order': 5, 'title': 'Classification of Living Beings', 'title_french': 'Classification des êtres vivants'},
        ]

        # Second Cycle - 4 lessons (Geology/Earth Sciences)
        lessons_s2 = [
            {'order': 1, 'title': 'Geological Field Trip', 'title_french': 'La sortie géologique'},
            {'order': 2, 'title': 'Formation of Sedimentary Rocks', 'title_french': 'La formation des roches sédimentaires'},
            {'order': 3, 'title': 'Construction of a Geological Time Scale', 'title_french': 'Construction d\'une échelle des temps géologiques'},
            {'order': 4, 'title': 'Water Resources', 'title_french': 'Les ressources hydriques'},
        ]

        try:
            subject = Subject.objects.get(code='BIOL101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code BIOL101 not found. Please ensure it exists.')
            )
            return

        try:
            grade = Grade.objects.get(code='1AC')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "1AC" not found. Please create it first.')
            )
            return

        try:
            track = Track.objects.get(code='1AC-FRN')
            self.stdout.write(f'Found track: {track.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "1AC-FRN" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 1AC Science lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating 1AC Science lessons for this subject...')
        created_count_s1 = 0
        for lesson_data in lessons_s1:
            lesson, created = Lesson.objects.get_or_create(
                subject=subject,
                grade=grade,
                cycle='first',
                order=lesson_data['order'],
                defaults={
                    'title': lesson_data['title'],
                    'title_arabic': lesson_data['title'],
                    'title_french': lesson_data['title_french'],
                    'description': f"Science - {lesson_data['title_french']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
            # Add track to the lesson (works for both created and existing lessons)
            lesson.tracks.add(track)

        created_count_s2 = 0
        for lesson_data in lessons_s2:
            lesson, created = Lesson.objects.get_or_create(
                subject=subject,
                grade=grade,
                cycle='second',
                order=lesson_data['order'],
                defaults={
                    'title': lesson_data['title'],
                    'title_arabic': lesson_data['title'],
                    'title_french': lesson_data['title_french'],
                    'description': f"Science - {lesson_data['title_french']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
            # Add track to the lesson (works for both created and existing lessons)
            lesson.tracks.add(track)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Science lessons for 1AC.'
            )
        )