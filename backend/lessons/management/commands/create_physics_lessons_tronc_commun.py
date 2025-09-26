from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create physics and chemistry lessons for Tronc Commun (Common Core)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing Tronc Commun physics and chemistry lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # Physics and chemistry lessons data for Tronc Commun
        lessons_s1 = [
            {
                'order': 1,
                'title': 'Mechanical Interactions',
                'title_arabic': 'التأثيرات البينية الميكانيكية',
                'title_french': 'Interactions mécaniques',
            },
            {
                'order': 2,
                'title': 'Universal Gravitation',
                'title_arabic': 'التجاذب الكوني',
                'title_french': 'Gravitation universelle',
            },
            {
                'order': 3,
                'title': 'Mechanical Actions',
                'title_arabic': 'التأثيرات الميكانيكية',
                'title_french': 'Actions mécaniques',
            },
            {
                'order': 4,
                'title': 'Motion',
                'title_arabic': 'الحركة',
                'title_french': 'Le mouvement',
            },
            {
                'order': 5,
                'title': 'Principle of Inertia',
                'title_arabic': 'مبدأ القصور',
                'title_french': 'Principe d\'inertia',
            },
            {
                'order': 6,
                'title': 'Equilibrium of a body subjected to two forces',
                'title_arabic': 'توازن جسم خاضع لقوتين',
                'title_french': 'Équilibre d\'un corps soumis à deux forces',
            },
            {
                'order': 7,
                'title': 'Force exerted by a spring',
                'title_arabic': 'القوة المطبقة من طرف نابض',
                'title_french': 'Force exercée par un ressort',
            },
            {
                'order': 8,
                'title': 'Archimedes\' Thrust',
                'title_arabic': 'دافعة أرخميدس',
                'title_french': 'Poussée d\'Archimède',
            },
            {
                'order': 9,
                'title': 'Equilibrium of a solid body',
                'title_arabic': 'توازن جسم صلب',
                'title_french': 'Équilibre d\'un corps solide',
            },
            {
                'order': 10,
                'title': 'Equilibrium of a solid body subjected to three non-parallel forces',
                'title_arabic': 'توازن جسم صلب خاضع لثلاث قوى غير متوازية',
                'title_french': 'Équilibre d\'un corps solide soumis à trois forces non parallèles',
            },
            {
                'order': 11,
                'title': 'Equilibrium of a rotating body around a fixed axis',
                'title_arabic': 'توازن جسم قابل للدوران حول محور ثابت',
                'title_french': 'Équilibre d\'un corps en rotation autour d\'un axe fixe',
            },
            {
                'order': 12,
                'title': 'Chemistry Around Us',
                'title_arabic': 'الكيمياء من حولنا',
                'title_french': 'La chimie autour de nous',
            },
            {
                'order': 13,
                'title': 'Chemical Species',
                'title_arabic': 'الأنواع الكيميائية',
                'title_french': 'Les espèces chimiques',
            },
            {
                'order': 14,
                'title': 'Extraction, Separation, and Identification of Chemical Species',
                'title_arabic': 'استخراج وفصل الأنواع الكيميائية والكشف عنها',
                'title_french': 'Extraction, séparation et identification des espèces chimiques',
            },
            {
                'order': 15,
                'title': 'Synthesis of Chemical Species',
                'title_arabic': 'تصنيع الأنواع الكيميائية',
                'title_french': 'Synthèse des espèces chimiques',
            },
            {
                'order': 16,
                'title': 'The Model of the Atom',
                'title_arabic': 'نموذج الذرة',
                'title_french': 'Le modèle de l\'atome',
            },
            {
                'order': 17,
                'title': 'Geometry of Some Molecules',
                'title_arabic': 'هندسة بعض الجزيئات',
                'title_french': 'Géométrie de quelques molécules',
            },
            {
                'order': 18,
                'title': 'Periodic Classification of Chemical Elements',
                'title_arabic': 'الترتيب الدوري للعناصر الكيميائية',
                'title_french': 'Classification périodique des éléments chimiques',
            }
        ]

        lessons_s2 = [
            {
                'order': 19,
                'title': 'Direct Electric Current',
                'title_arabic': 'التيار الكهربائي المستمر',
                'title_french': 'Le courant électrique continu',
            },
            {
                'order': 20,
                'title': 'Electric Voltage',
                'title_arabic': 'التوتر الكهربائي',
                'title_french': 'La tension électrique',
            },
            {
                'order': 21,
                'title': 'Combination of Ohmic Conductors (Resistors)',
                'title_arabic': 'تجميع الموصلات الأومية',
                'title_french': 'Association des conducteurs ohmiques',
            },
            {
                'order': 22,
                'title': 'Characteristics of Some Passive Dipoles',
                'title_arabic': 'مميزات بعض ثنائيات القطب غير النشيطة',
                'title_french': 'Caractéristique de quelques dipôles passifs',
            },
            {
                'order': 23,
                'title': 'Characteristics of an Active Dipole',
                'title_arabic': 'مميزات ثنائي القطب النشيط',
                'title_french': 'Caractéristique d\'un dipôle actif',
            },
            {
                'order': 24,
                'title': 'Electronic Circuits',
                'title_arabic': 'تراكيب إلكترونية',
                'title_french': 'Montages électroniques',
            },
            {
                'order': 25,
                'title': 'The Transistor',
                'title_arabic': 'الترانزستور',
                'title_french': 'Le transistor',
            },
            {
                'order': 26,
                'title': 'The Operational Amplifier',
                'title_arabic': 'المضخم العملياتي',
                'title_french': 'L\'amplificateur opérationnel',
            },
            {
                'order': 27,
                'title': 'Tools to Describe a Chemical System',
                'title_arabic': 'أدوات لوصف مجموعة كيميائية',
                'title_french': 'Outils pour décrire un système chimique',
            },
            {
                'order': 28,
                'title': 'Amount of Substance – The Mole',
                'title_arabic': 'كمية المادة – المول',
                'title_french': 'Quantité de matière – La mole',
            },
            {
                'order': 29,
                'title': 'Molar Concentration',
                'title_arabic': 'التركيز المولي',
                'title_french': 'La concentration molaire',
            },
            {
                'order': 30,
                'title': 'Chemical Transformation and Material Balance',
                'title_arabic': 'التحول الكيميائي وحصيلة المادة',
                'title_french': 'Transformation chimique et bilan de matière',
            }
        ]

        try:
            subject = Subject.objects.get(code='PHYS101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code PHYS101 not found. Please ensure it exists.')
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
