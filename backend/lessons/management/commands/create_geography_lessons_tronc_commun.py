from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create geography lessons for Tronc Commun (Common Core)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing Tronc Commun geography lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # Geography lessons data for Tronc Commun
        lessons_s1 = [
            {
                'order': 1,
                'title': 'Major structural units and landforms',
                'title_arabic': 'المجموعات البنيوية الكبرى وأشكال التضاريس',
                'title_french': 'Les grands ensembles structuraux et les formes de relief',
            },
            {
                'order': 2,
                'title': 'Climatic zones and vegetation cover in the world',
                'title_arabic': 'النطاقات المناخية والغطاء النباتي في العالم (مقابلة بين خريطتين)',
                'title_french': 'Les zones climatiques et la couverture végétale dans le monde (comparaison de deux cartes)',
            },
            {
                'order': 3,
                'title': 'Population: Distribution',
                'title_arabic': 'السكان: التوزيع',
                'title_french': 'La population : répartition',
            },
            {
                'order': 4,
                'title': 'Forms of human exploitation of space in rural areas',
                'title_arabic': 'أشكال استغلال الإنسان للمجال في الأرياف',
                'title_french': 'Les formes d\'exploitation de l\'espace par l\'homme à la campagne',
            },
            {
                'order': 5,
                'title': 'Forms of human exploitation of space in urban areas',
                'title_arabic': 'أشكال استغلال الإنسان للمجال في المدن',
                'title_french': 'Les formes d\'exploitation de l\'espace par l\'homme en ville',
            },
            {
                'order': 6,
                'title': 'Techniques for mapping rural-urban areas',
                'title_arabic': 'تقنيات رسم خرائط المجال الريفي – الحضري (تمثيل المعطيات النوعية والكمية)',
                'title_french': 'Techniques de cartographie de l\'espace rural – urbain (représentation des données qualitatives et quantitatives)',
            },
            {
                'order': 7,
                'title': 'Reading a topographic map',
                'title_arabic': 'قراءة خريطة طبوغرافية (إنجاز مقطع طبوغرافي)',
                'title_french': 'Lecture d\'une carte topographique (réalisation d\'un profil topographique)',
            },
            {
                'order': 8,
                'title': 'The soil',
                'title_arabic': 'التربة',
                'title_french': 'Le sol',
            },
            {
                'order': 9,
                'title': 'Population and dynamics',
                'title_arabic': 'السكان والدينامية (التدرب على رسم المبيانات)',
                'title_french': 'Population et dynamique (entraînement à la construction de graphiques)',
            },
        ]

        lessons_s2 = [
            {
                'order': 10,
                'title': 'The ecosystem (its concept, the basis of its balance, and definition of its types)',
                'title_arabic': 'المنظومة البيئية (مفهومها، أسس توازنها والتعريف بأنواعها)',
                'title_french': 'L\'écosystème (concept, bases de son équilibre et définition de ses types)',
            },
            {
                'order': 11,
                'title': 'File on a natural disaster (earthquakes in Morocco)',
                'title_arabic': 'ملف حول كارثة طبيعية (الزلازل في المغرب)',
                'title_french': 'Dossier sur une catastrophe naturelle (les séismes au Maroc)',
            },
            {
                'order': 12,
                'title': 'File on an environmental disaster (global warming)',
                'title_arabic': 'ملف حول كارثة بيئية (الاحتباس الحراري)',
                'title_french': 'Dossier sur une catastrophe environnementale (le réchauffement climatique)',
            },
            {
                'order': 13,
                'title': 'Legislative and technical procedures and measures',
                'title_arabic': 'الإجراءات والتدابير التشريعية والتقنية',
                'title_french': 'Mesures législatives et techniques',
            },
            {
                'order': 14,
                'title': 'Educational procedures and measures',
                'title_arabic': 'الإجراءات والتدابير التربوية',
                'title_french': 'Mesures éducatives',
            },
            {
                'order': 15,
                'title': 'Procedures and measures for spatial planning',
                'title_arabic': 'الإجراءات والتدابير على مستوى تنظيم المجال',
                'title_french': 'Mesures au niveau de l\'aménagement du territoire',
            },
            {
                'order': 16,
                'title': 'The role of associations and non-governmental organizations in environmental protection',
                'title_arabic': 'دور الجمعيات والمنظمات غير الحكومية في حماية البيئة',
                'title_french': 'Le rôle des associations et des ONG dans la protection de l\'environnement',
            },
            {
                'order': 17,
                'title': 'The hot ecosystem',
                'title_arabic': 'المنظومة البيئية الحارة',
                'title_french': 'L\'écosystème chaud',
            },
            {
                'order': 18,
                'title': 'The temperate ecosystem',
                'title_arabic': 'المنظومة البيئية المعتدلة',
                'title_french': 'L\'écosystème tempéré',
            },
            {
                'order': 19,
                'title': 'The cold ecosystem',
                'title_arabic': 'المنظومة البيئية الباردة',
                'title_french': 'L\'écosystème froid',
            },
            {
                'order': 20,
                'title': 'Environmental disasters (definition and types)',
                'title_arabic': 'الكوارث البيئية (تعريفها وأنواعها)',
                'title_french': 'Les catastrophes environnementales (définition et types)',
            },
            {
                'order': 21,
                'title': 'File on the role of associations and non-governmental organizations',
                'title_arabic': 'ملف حول دور الجمعيات والمنظمات غير الحكومية',
                'title_french': 'Dossier sur le rôle des associations et des organisations non gouvernementales',
            },
        ]

        try:
            subject = Subject.objects.get(code='GEOG101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code GEOG101 not found. Please ensure it exists.')
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
