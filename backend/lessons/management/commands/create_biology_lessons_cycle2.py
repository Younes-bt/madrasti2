from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create 15 biology lessons (lessons 10-24) for Second Year Baccalaureate - Second Cycle'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing second cycle biology lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # Biology lessons data for second cycle (lessons 10-24)
        biology_lessons_cycle2 = [
            {
                'order': 10,
                'title': 'Quantitative study of variation - Biometrics',
                'title_arabic': 'الدراسة الكمية للتغير – القياس الإحيائي',
                'title_french': 'Étude quantitative de la variation - La biométrie',
                'description': 'Study of statistical methods in biology and biometric analysis.',
                'objectives': 'Understand statistical analysis of biological variations.',
                'prerequisites': 'Knowledge of statistics and biological data analysis.'
            },
            {
                'order': 11,
                'title': 'Population genetics',
                'title_arabic': 'علم وراثة الساكنة',
                'title_french': 'Génétique des populations',
                'description': 'Study of genetic variation and evolution in populations.',
                'objectives': 'Understand population genetics principles and Hardy-Weinberg equilibrium.',
                'prerequisites': 'Knowledge of genetics and statistical analysis.'
            },
            {
                'order': 12,
                'title': 'Immunology',
                'title_arabic': 'علم المناعة',
                'title_french': 'L\'immunologie',
                'description': 'Introduction to the immune system and immunological responses.',
                'objectives': 'Understand immune system structure and function.',
                'prerequisites': 'Knowledge of cellular biology and molecular biology.'
            },
            {
                'order': 13,
                'title': 'Distinguishing self from non-self',
                'title_arabic': 'تعرف الجسم على ما هو ذاتي وما هو غير ذاتي',
                'title_french': 'La distinction entre le soi et le non-soi',
                'description': 'Study of immune recognition mechanisms.',
                'objectives': 'Understand how the immune system recognizes foreign substances.',
                'prerequisites': 'Basic knowledge of immunology and cellular recognition.'
            },
            {
                'order': 14,
                'title': 'The body\'s defense mechanisms',
                'title_arabic': 'وسائل دفاع الجسم عما هو ذاتي',
                'title_french': 'Les moyens de défense de l\'organisme',
                'description': 'Study of innate and adaptive immune responses.',
                'objectives': 'Understand the body\'s defense strategies against pathogens.',
                'prerequisites': 'Knowledge of immune system components and self/non-self recognition.'
            },
            {
                'order': 15,
                'title': 'Disorders of the immune system',
                'title_arabic': 'اضطرابات الجهاز المناعي',
                'title_french': 'Les dysfonctionnements du système immunitaire',
                'description': 'Study of autoimmune diseases and immunodeficiencies.',
                'objectives': 'Understand immune system disorders and their consequences.',
                'prerequisites': 'Knowledge of normal immune function and defense mechanisms.'
            },
            {
                'order': 16,
                'title': 'Aiding the immune system',
                'title_arabic': 'مساعدات الجهاز المناعي',
                'title_french': 'Les moyens d\'aide au système immunitaire',
                'description': 'Study of vaccines, immunotherapy, and immune system support.',
                'objectives': 'Understand methods to enhance and support immune function.',
                'prerequisites': 'Knowledge of immune system function and disorders.'
            },
            {
                'order': 17,
                'title': 'Recent mountain chains and their relationship with plate tectonics',
                'title_arabic': 'السلاسل الجبلية الحديثة وعلاقتها بتكتونية الصفائح',
                'title_french': 'Les chaînes de montagnes récentes et leur relation avec la tectonique des plaques',
                'description': 'Study of mountain formation and plate tectonic processes.',
                'objectives': 'Understand the geological processes of mountain formation.',
                'prerequisites': 'Basic knowledge of geology and Earth sciences.'
            },
            {
                'order': 18,
                'title': 'Metamorphism and its relationship with plate dynamics',
                'title_arabic': 'التحول وعلاقته بدينامية الصفائح',
                'title_french': 'Le métamorphisme et sa relation avec la dynamique des plaques',
                'description': 'Study of metamorphic processes and their geological context.',
                'objectives': 'Understand metamorphism in relation to plate tectonics.',
                'prerequisites': 'Knowledge of rock types and plate tectonic theory.'
            },
            {
                'order': 19,
                'title': 'Granitization and its relationship with metamorphism',
                'title_arabic': 'الكرانيتية وعلاقتها بظاهرة التحول',
                'title_french': 'La granitoïdisation et sa relation avec le métamorphisme',
                'description': 'Study of granite formation and metamorphic processes.',
                'objectives': 'Understand granite genesis and its relation to metamorphism.',
                'prerequisites': 'Knowledge of metamorphic processes and igneous rock formation.'
            },
            {
                'order': 20,
                'title': 'Use of organic and inorganic materials (Physical Sciences Track)',
                'title_arabic': 'استعمال المواد العضوية وغير العضوية (علوم فيزيائية)',
                'title_french': 'Utilisation des matières organiques et inorganiques (Sciences Physiques)',
                'description': 'Study of material usage and environmental impact (Physical Sciences Track).',
                'objectives': 'Understand the use and impact of various materials.',
                'prerequisites': 'Knowledge of chemistry and environmental science.'
            },
            {
                'order': 21,
                'title': 'Household waste from the use of organic materials (Physical Sciences Track)',
                'title_arabic': 'النفايات المنزلية الناتجة عن استعمال المواد العضوية (علوم فيزيائية)',
                'title_french': 'Les déchets ménagers résultant de l\'utilisation des matières organiques (Sciences Physiques)',
                'description': 'Study of household waste and its environmental impact.',
                'objectives': 'Understand waste generation and management strategies.',
                'prerequisites': 'Knowledge of organic materials and environmental impact.'
            },
            {
                'order': 22,
                'title': 'Pollutants from energy consumption and the use of organic and inorganic materials (Physical Sciences Track)',
                'title_arabic': 'الملوثات الناتجة عن استهلاك المواد الطاقية واستعمال المواد العضوية وغير العضوية (علوم فيزيائية)',
                'title_french': 'Polluants issus de la consommation d\'énergie et de l\'utilisation des matières organiques et inorganiques (Sciences Physiques)',
                'description': 'Study of pollution from energy and material consumption.',
                'objectives': 'Understand pollution sources and environmental consequences.',
                'prerequisites': 'Knowledge of energy systems and material science.'
            },
            {
                'order': 23,
                'title': 'Radioactive materials and nuclear energy (Physical Sciences Track)',
                'title_arabic': 'المواد المشعة والطاقة النووية (علوم فيزيائية)',
                'title_french': 'Matières radioactives et énergie nucléaire (Sciences Physiques)',
                'description': 'Study of radioactive materials and nuclear energy applications.',
                'objectives': 'Understand radioactivity and nuclear energy principles.',
                'prerequisites': 'Knowledge of atomic structure and energy concepts.'
            },
            {
                'order': 24,
                'title': 'Monitoring the quality and health of natural environments (Physical Sciences Track)',
                'title_arabic': 'قياس جودة وصحة الأوساط الطبيعية (علوم فيزيائية)',
                'title_french': 'Contrôle de la qualité et de la salubrité des milieux naturels (Sciences Physiques)',
                'description': 'Study of environmental monitoring and assessment methods.',
                'objectives': 'Understand environmental quality assessment and monitoring techniques.',
                'prerequisites': 'Knowledge of environmental science and analytical methods.'
            }
        ]

        try:
            # Get Biology subject
            biology_subject = Subject.objects.get(code='BIOL101')
            self.stdout.write(f'Found Biology subject: {biology_subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Biology subject not found. Please ensure BIOL101 exists.')
            )
            return

        try:
            # Get Second Year Baccalaureate grade (Grade ID 12)
            second_year_bac_grade = Grade.objects.get(id=12)
            self.stdout.write(f'Found grade: {second_year_bac_grade.name}')

        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Second Year Baccalaureate grade (ID: 12) not found. Please create the grade first.')
            )
            return
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error finding grade: {e}')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing second cycle biology lessons...')
            deleted_count = Lesson.objects.filter(
                subject=biology_subject,
                grade=second_year_bac_grade,
                cycle='second'
            ).delete()[0]
            self.stdout.write(
                self.style.WARNING(f'Deleted {deleted_count} existing second cycle biology lessons')
            )

        self.stdout.write('Creating second cycle biology lessons...')

        created_count = 0
        for lesson_data in biology_lessons_cycle2:
            lesson, created = Lesson.objects.get_or_create(
                subject=biology_subject,
                grade=second_year_bac_grade,
                cycle='second',  # Second Cycle as specified
                order=lesson_data['order'],
                defaults={
                    'title': lesson_data['title'],
                    'title_arabic': lesson_data['title_arabic'],
                    'title_french': lesson_data['title_french'],
                    'description': lesson_data['description'],
                    'objectives': lesson_data['objectives'],
                    'prerequisites': lesson_data['prerequisites'],
                    'difficulty_level': 'medium',  # Medium difficulty as specified
                    'is_active': True,
                }
            )

            if created:
                created_count += 1
                self.stdout.write(f'Created: Lesson {lesson.order} - {lesson.title}')
            else:
                self.stdout.write(f'Already exists: Lesson {lesson.order} - {lesson.title}')

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count} new second cycle biology lessons. '
                f'Total second cycle biology lessons for {second_year_bac_grade.name}: {Lesson.objects.filter(subject=biology_subject, grade=second_year_bac_grade, cycle="second").count()}'
            )
        )