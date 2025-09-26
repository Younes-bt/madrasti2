from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create biology lessons for Tronc Commun (Common Core)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing Tronc Commun biology lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # Biology lessons data for Tronc Commun
        lessons_s1 = [
            {
                'order': 1,
                'title': 'Some general guidelines on the study of ecology',
                'title_arabic': 'بعض التوجيهات العامة حول دراسة علم البيئة',
                'title_french': "Quelques orientations générales sur l'étude de l'écologie",
            },
            {
                'order': 2,
                'title': 'Field study techniques used in ecology',
                'title_arabic': 'تقنيات الدراسة الميدانية المستعملة في علم البيئة',
                'title_french': "Techniques d'étude sur le terrain utilisées en écologie",
            },
            {
                'order': 3,
                'title': 'Edaphic (soil) factors and their relationship with the distribution of living organisms',
                'title_arabic': 'عوامل التربة وعلاقتها بتوزيع الكائنات الحية',
                'title_french': "Les facteurs édaphiques et leur relation avec la répartition des êtres vivants",
            },
            {
                'order': 4,
                'title': 'Climatic factors and their relationship with living organisms',
                'title_arabic': 'العوامل المناخية وعلاقتها بالكائنات الحية',
                'title_french': "Les facteurs climatiques et leur relation avec les êtres vivants",
            },
            {
                'order': 5,
                'title': 'Flow of matter and energy within the ecosystem',
                'title_arabic': 'تدفق المادة والطاقة داخل الحميلة البيئية',
                'title_french': "Flux de la matière et de l'énergie au sein de l'écosystème",
            },
            {
                'order': 6,
                'title': 'Natural balances',
                'title_arabic': 'التوازنات الطبيعية',
                'title_french': "Les équilibres naturels",
            },
        ]

        lessons_s2 = [
            {
                'order': 7,
                'title': 'Sexual reproduction in flowering plants (Angiosperms)',
                'title_arabic': 'التوالد الجنسي عند النباتات الزهرية',
                'title_french': "La reproduction sexuée chez les plantes à fleurs (Angiospermes)",
            },
            {
                'order': 8,
                'title': 'Sexual reproduction in gymnosperms',
                'title_arabic': 'التوالد الجنسي عند عاريات البذور',
                'title_french': "La reproduction sexuée chez les Gymnospermes",
            },
            {
                'order': 9,
                'title': 'Sexual reproduction in non-flowering plants',
                'title_arabic': 'التوالد الجنسي عند النباتات اللازهرية',
                'title_french': "La reproduction sexuée chez les plantes sans fleurs",
            },
            {
                'order': 10,
                'title': 'Growth cycles in plants',
                'title_arabic': 'دورات النمو عند النباتات',
                'title_french': "Les cycles de développement chez les végétaux",
            },
            {
                'order': 11,
                'title': 'Asexual reproduction in plants',
                'title_arabic': 'التوالد اللاجنسي عند النباتات',
                'title_french': "La reproduction asexuée chez les végétaux",
            },
            {
                'order': 12,
                'title': 'Genetic improvement of plants',
                'title_arabic': 'التحسين الوراثي عند النباتات',
                'title_french': "L'amélioration de la production végétale",
            },
            {
                'order': 13,
                'title': 'Classification of plants',
                'title_arabic': 'تصنيف النباتات',
                'title_french': "La classification des végétaux",
            },
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
            common_core_grade = Grade.objects.get(name='Common Core')
            self.stdout.write(f'Found grade: {common_core_grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade "Common Core" not found. Please create it first.')
            )
            return
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error finding grade: {e}')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing Tronc Commun lessons for this subject...')
            deleted_count_s1 = Lesson.objects.filter(
                subject=subject,
                grade=common_core_grade,
                cycle='first'
            ).delete()[0]
            deleted_count_s2 = Lesson.objects.filter(
                subject=subject,
                grade=common_core_grade,
                cycle='second'
            ).delete()[0]
            self.stdout.write(
                self.style.WARNING(f'Deleted {deleted_count_s1} first term and {deleted_count_s2} second term existing lessons.')
            )

        self.stdout.write('Creating Tronc Commun lessons for this subject...')

        created_count_s1 = 0
        for lesson_data in lessons_s1:
            lesson, created = Lesson.objects.get_or_create(
                subject=subject,
                grade=common_core_grade,
                cycle='first',
                order=lesson_data['order'],
                defaults={
                    'title': lesson_data['title'],
                    'title_arabic': lesson_data['title_arabic'],
                    'title_french': lesson_data['title_french'],
                    'difficulty_level': 'easy',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
                self.stdout.write(f'Created: Term 1, Lesson {lesson.order} - {lesson.title}')
            else:
                self.stdout.write(f'Already exists: Term 1, Lesson {lesson.order} - {lesson.title}')

        created_count_s2 = 0
        for lesson_data in lessons_s2:
            lesson, created = Lesson.objects.get_or_create(
                subject=subject,
                grade=common_core_grade,
                cycle='second',
                order=lesson_data['order'],
                defaults={
                    'title': lesson_data['title'],
                    'title_arabic': lesson_data['title_arabic'],
                    'title_french': lesson_data['title_french'],
                    'difficulty_level': 'easy',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
                self.stdout.write(f'Created: Term 2, Lesson {lesson.order} - {lesson.title}')
            else:
                self.stdout.write(f'Already exists: Term 2, Lesson {lesson.order} - {lesson.title}')

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term lessons for Tronc Commun.'
            )
        )
