from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Science lessons for 2AC Normal track (Deuxième Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 2AC Science lessons for Normal track before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 6 lessons (Geology and Earth Sciences)
        lessons_s1 = [
            {'order': 1, 'title': 'Plate Tectonics Theory', 'title_arabic': 'نظرية تكتونية الصفائح', 'title_french': 'Théorie de la tectonique des plaques'},
            {'order': 2, 'title': 'Earthquakes and Plate Tectonics', 'title_arabic': 'الزلازل وتكتونية الصفائح', 'title_french': 'Séismes et tectonique des plaques'},
            {'order': 3, 'title': 'Volcanoes and Plate Tectonics', 'title_arabic': 'البراكين وتكتونية الصفائح', 'title_french': 'Volcans et tectonique des plaques'},
            {'order': 4, 'title': 'Tectonic Deformations and Plate Tectonics', 'title_arabic': 'التشوهات التكتونية وتكتونية الصفائح', 'title_french': 'Déformations tectoniques et tectonique des plaques'},
            {'order': 5, 'title': 'Formation of Igneous Rocks', 'title_arabic': 'تكون الصخور الصهارية', 'title_french': 'Formation des roches magmatiques'},
            {'order': 6, 'title': 'Formation of Mountain Ranges', 'title_arabic': 'تكون السلاسل الجبلية', 'title_french': 'Formation des chaînes de montagnes'},
        ]

        # Second Cycle - 4 lessons (Biology and Reproduction)
        lessons_s2 = [
            {'order': 1, 'title': 'Reproduction in Animals', 'title_arabic': 'التوالد عند الحيوانات', 'title_french': 'Reproduction chez les animaux'},
            {'order': 2, 'title': 'Reproduction in Plants', 'title_arabic': 'التوالد عند النباتات', 'title_french': 'Reproduction chez les plantes'},
            {'order': 3, 'title': 'Human Reproduction', 'title_arabic': 'التوالد عند الانسان', 'title_french': 'Reproduction humaine'},
            {'order': 4, 'title': 'Human Heredity', 'title_arabic': 'الوراثة عند الانسان', 'title_french': 'Hérédité humaine'},
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
            grade = Grade.objects.get(code='2AC')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "2AC" not found. Please create it first.')
            )
            return

        try:
            track_nrml = Track.objects.get(code='2AC-NRML')
            self.stdout.write(f'Found NRML track: {track_nrml.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "2AC-NRML" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 2AC Science lessons for Normal track...')
            existing_lessons = Lesson.objects.filter(
                subject=subject,
                grade=grade,
                tracks__code='2AC-NRML'
            )
            for lesson in existing_lessons:
                if lesson.tracks.count() == 1:  # Only delete if this is the only track
                    lesson.delete()
                else:
                    lesson.tracks.remove(track_nrml)  # Just remove from this track
            self.stdout.write(self.style.WARNING('Removed existing lessons for Normal track.'))

        self.stdout.write('Creating 2AC Science lessons for Normal track...')
        created_count_s1 = 0
        for lesson_data in lessons_s1:
            lesson, created = Lesson.objects.get_or_create(
                subject=subject,
                grade=grade,
                cycle='first',
                order=lesson_data['order'],
                defaults={
                    'title': lesson_data['title'],
                    'title_arabic': lesson_data['title_arabic'],
                    'title_french': lesson_data['title_french'],
                    'description': f"Science - {lesson_data['title_arabic']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
            # Add Normal track to the lesson
            lesson.tracks.add(track_nrml)

        created_count_s2 = 0
        for lesson_data in lessons_s2:
            lesson, created = Lesson.objects.get_or_create(
                subject=subject,
                grade=grade,
                cycle='second',
                order=lesson_data['order'],
                defaults={
                    'title': lesson_data['title'],
                    'title_arabic': lesson_data['title_arabic'],
                    'title_french': lesson_data['title_french'],
                    'description': f"Science - {lesson_data['title_arabic']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
            # Add Normal track to the lesson
            lesson.tracks.add(track_nrml)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Science lessons for 2AC Normal track.'
            )
        )