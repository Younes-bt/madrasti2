from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Science lessons for TC French International tracks (Tronc Commun)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing TC Science lessons for French International tracks before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 5 lessons (Ecology)
        lessons_s1 = [
            {'order': 1, 'title': 'Adaptive Techniques for Ecological Field Study', 'title_arabic': 'التقنيات التكيفية لدراسة البيئة في الميدان', 'title_french': 'Les techniques adaptatives à l\'étude écologique sur le terrain'},
            {'order': 2, 'title': 'Edaphic Factors and Their Relations with Living Beings', 'title_arabic': 'العوامل التربوية وعلاقتها بالكائنات الحية', 'title_french': 'Les facteurs édaphiques et leurs relations avec les êtres vivants'},
            {'order': 3, 'title': 'Climatic Factors and Their Relations with Living Beings', 'title_arabic': 'العوامل المناخية وعلاقتها بالكائنات الحية', 'title_french': 'Les facteurs climatiques et leurs relations avec les êtres vivants'},
            {'order': 4, 'title': 'Flow of Matter and Energy in the Ecosystem', 'title_arabic': 'تدفق المادة والطاقة في النظام البيئي', 'title_french': 'Flux de la matière et de l\'énergie dans l\'écosystème'},
            {'order': 5, 'title': 'Natural Balances', 'title_arabic': 'التوازنات الطبيعية', 'title_french': 'Les équilibres naturels'},
        ]

        # Second Cycle - 5 lessons (Plant Biology and Reproduction)
        lessons_s2 = [
            {'order': 1, 'title': 'Sexual Reproduction in Flowering Plants', 'title_arabic': 'التكاثر الجنسي عند النباتات الزهرية', 'title_french': 'La reproduction sexuée chez les plantes à fleurs'},
            {'order': 2, 'title': 'Sexual Reproduction in Non-Flowering Plants', 'title_arabic': 'التكاثر الجنسي عند النباتات اللازهرية', 'title_french': 'La reproduction sexuée chez les plantes sans fleurs'},
            {'order': 3, 'title': 'Plant Development Cycles', 'title_arabic': 'دورات تطور النباتات', 'title_french': 'Les cycles de développement des plantes'},
            {'order': 4, 'title': 'Asexual Reproduction in Plants', 'title_arabic': 'التكاثر اللاجنسي عند النباتات', 'title_french': 'La reproduction asexuée chez les plantes'},
            {'order': 5, 'title': 'Genetic Modification of Plants', 'title_arabic': 'التعديل الوراثي للنباتات', 'title_french': 'La modification génétique des plantes'},
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
            grade = Grade.objects.get(code='TC')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "TC" not found. Please create it first.')
            )
            return

        # Get French International tracks
        track_codes = ['TCS-BIOF', 'TCT-BIOF']
        tracks = []

        for track_code in track_codes:
            try:
                track = Track.objects.get(code=track_code)
                tracks.append(track)
                self.stdout.write(f'Found track: {track.name}')
            except Track.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'Track with code "{track_code}" not found. Please create it first.')
                )
                return

        if options['delete_existing']:
            self.stdout.write('Deleting existing TC Science lessons for French International tracks...')
            for track in tracks:
                existing_lessons = Lesson.objects.filter(
                    subject=subject,
                    grade=grade,
                    tracks__code=track.code
                )
                for lesson in existing_lessons:
                    if lesson.tracks.count() == 1:  # Only delete if this is the only track
                        lesson.delete()
                    else:
                        lesson.tracks.remove(track)  # Just remove from this track
            self.stdout.write(self.style.WARNING('Removed existing lessons for French International tracks.'))

        self.stdout.write('Creating TC Science lessons for French International tracks...')
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
            # Add French International tracks to the lesson
            lesson.tracks.add(*tracks)

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
            # Add French International tracks to the lesson
            lesson.tracks.add(*tracks)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Science lessons for TC French International tracks.'
            )
        )