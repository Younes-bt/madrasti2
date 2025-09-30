from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Science lessons for 2AC French track (Deuxième Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 2AC Science lessons for French track before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 6 lessons (Geology and Earth Sciences)
        lessons_s1 = [
            {'order': 1, 'title': 'Plate Tectonics', 'title_arabic': 'تكتونية الصفائح', 'title_french': 'La tectonique des plaques'},
            {'order': 2, 'title': 'Earthquakes', 'title_arabic': 'الزلازل', 'title_french': 'Les séismes'},
            {'order': 3, 'title': 'Volcanoes', 'title_arabic': 'البراكين', 'title_french': 'Les volcans'},
            {'order': 4, 'title': 'Formation of Mountain Ranges', 'title_arabic': 'تكون السلاسل الجبلية', 'title_french': 'La formation des chaînes de montagnes'},
            {'order': 5, 'title': 'Tectonic Deformations', 'title_arabic': 'التشوهات التكتونية', 'title_french': 'Les déformations tectoniques'},
            {'order': 6, 'title': 'Formation of Magmatic Rocks', 'title_arabic': 'تكون الصخور الصهارية', 'title_french': 'La formation des roches magmatiques'},
        ]

        # Second Cycle - 4 lessons (Biology and Reproduction)
        lessons_s2 = [
            {'order': 1, 'title': 'Reproduction in Animals', 'title_arabic': 'التوالد عند الحيوانات', 'title_french': 'La reproduction chez les animaux'},
            {'order': 2, 'title': 'Reproduction in Plants', 'title_arabic': 'التوالد عند النباتات', 'title_french': 'La reproduction chez les plantes'},
            {'order': 3, 'title': 'Human Reproduction', 'title_arabic': 'التوالد عند الإنسان', 'title_french': 'La reproduction humaine'},
            {'order': 4, 'title': 'Human Heredity', 'title_arabic': 'الوراثة عند الإنسان', 'title_french': 'L\'hérédité humaine'},
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
            track_frn = Track.objects.get(code='2AC-FRN')
            self.stdout.write(f'Found FRN track: {track_frn.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "2AC-FRN" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 2AC Science lessons for French track...')
            existing_lessons = Lesson.objects.filter(
                subject=subject,
                grade=grade,
                tracks__code='2AC-FRN'
            )
            for lesson in existing_lessons:
                if lesson.tracks.count() == 1:  # Only delete if this is the only track
                    lesson.delete()
                else:
                    lesson.tracks.remove(track_frn)  # Just remove from this track
            self.stdout.write(self.style.WARNING('Removed existing lessons for French track.'))

        self.stdout.write('Creating/updating 2AC Science lessons for French track...')
        created_count_s1 = 0
        updated_count_s1 = 0
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
                    'description': f"Science - {lesson_data['title_french']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
            else:
                # Update existing lesson with French titles if needed
                lesson.title_french = lesson_data['title_french']
                lesson.save()
                updated_count_s1 += 1
            # Add French track to the lesson
            lesson.tracks.add(track_frn)

        created_count_s2 = 0
        updated_count_s2 = 0
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
                    'description': f"Science - {lesson_data['title_french']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
            else:
                # Update existing lesson with French titles if needed
                lesson.title_french = lesson_data['title_french']
                lesson.save()
                updated_count_s2 += 1
            # Add French track to the lesson
            lesson.tracks.add(track_frn)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Science lessons. '
                f'Updated {updated_count_s1} first term and {updated_count_s2} second term existing lessons for 2AC French track.'
            )
        )