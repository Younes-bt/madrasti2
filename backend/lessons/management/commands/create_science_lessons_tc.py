from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Science lessons for TC (Tronc Commun)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing TC Science lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 6 lessons (Ecology)
        lessons_s1 = [
            {'order': 1, 'title': 'General Guidelines for Studying Ecology', 'title_arabic': 'بعض التوجيهات العامة حول دراسة علم البيئة', 'title_french': 'Quelques orientations générales sur l\'étude de l\'écologie'},
            {'order': 2, 'title': 'Field Study Techniques Used in Ecology', 'title_arabic': 'تقنيات الدراسة الميدانية المستعملة في علم البيئة', 'title_french': 'Techniques d\'étude de terrain utilisées en écologie'},
            {'order': 3, 'title': 'Soil Factors and Their Relationship to Distribution of Living Organisms', 'title_arabic': 'عوامل التربة وعلاقتها بتوزيع الكائنات الحية', 'title_french': 'Facteurs du sol et leur relation avec la distribution des êtres vivants'},
            {'order': 4, 'title': 'Climatic Factors and Their Relationship to Living Organisms', 'title_arabic': 'العوامل المناخية وعلاقتها بالكائنات الحية', 'title_french': 'Facteurs climatiques et leur relation avec les êtres vivants'},
            {'order': 5, 'title': 'Flow of Matter and Energy Within Ecosystem', 'title_arabic': 'تدفق المادة والطاقة داخل الحميلة البيئية', 'title_french': 'Flux de matière et d\'énergie dans l\'écosystème'},
            {'order': 6, 'title': 'Natural Equilibria', 'title_arabic': 'التوازنات الطبيعية', 'title_french': 'Équilibres naturels'},
        ]

        # Second Cycle - 7 lessons (Plant Biology and Reproduction)
        lessons_s2 = [
            {'order': 1, 'title': 'Sexual Reproduction in Flowering Plants', 'title_arabic': 'التوالد الجنسي عند النباتات الزهرية', 'title_french': 'Reproduction sexuée chez les plantes à fleurs'},
            {'order': 2, 'title': 'Sexual Reproduction in Gymnosperms', 'title_arabic': 'التوالد الجنسي عند عاريات البذور', 'title_french': 'Reproduction sexuée chez les gymnospermes'},
            {'order': 3, 'title': 'Sexual Reproduction in Non-Flowering Plants', 'title_arabic': 'التوالد الجنسي عند النباتات اللازهرية', 'title_french': 'Reproduction sexuée chez les plantes non-florales'},
            {'order': 4, 'title': 'Growth Cycles in Plants', 'title_arabic': 'دورات النمو عند النباتات', 'title_french': 'Cycles de croissance chez les plantes'},
            {'order': 5, 'title': 'Asexual Reproduction in Plants', 'title_arabic': 'التوالد اللاجنسي عند النباتات', 'title_french': 'Reproduction asexuée chez les plantes'},
            {'order': 6, 'title': 'Genetic Modification in Plants', 'title_arabic': 'التعديل الوراثي عند النباتات', 'title_french': 'Modification génétique chez les plantes'},
            {'order': 7, 'title': 'Plant Classification', 'title_arabic': 'تصنيف النباتات', 'title_french': 'Classification des plantes'},
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

        # Get specified tracks (excluding French International Options for Science)
        track_codes = ['TCS', 'TCT', 'TCEO', 'TCIB']
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
            self.stdout.write('Deleting existing TC Science lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating TC Science lessons for this subject...')
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
            # Add specified tracks to the lesson
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
            # Add specified tracks to the lesson
            lesson.tracks.add(*tracks)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Science lessons for TC.'
            )
        )