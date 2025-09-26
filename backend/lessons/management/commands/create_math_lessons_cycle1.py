from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create 18 mathematics lessons (lessons 1-18) for Second Year Baccalaureate - First Cycle'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing first cycle mathematics lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # Mathematics lessons data for first cycle (lessons 1-18)
        math_lessons_cycle1 = [
            {
                'order': 1,
                'title': 'Limits and Continuity',
                'title_arabic': 'النهايات والاتصال',
                'title_french': 'Limites et continuité',
                'description': 'Study of limits and continuity of functions.',
                'objectives': 'Understand the concepts of limits and continuity in mathematical analysis.',
                'prerequisites': 'Basic knowledge of functions and algebraic operations.'
            },
            {
                'order': 2,
                'title': 'Continuity of a numerical function',
                'title_arabic': 'اتصال دالة عددية',
                'title_french': 'Continuité d\'une fonction numérique',
                'description': 'Detailed study of continuity properties of numerical functions.',
                'objectives': 'Master the concept of continuity and its applications.',
                'prerequisites': 'Understanding of limits and basic function properties.'
            },
            {
                'order': 3,
                'title': 'Differentiation and Function Study',
                'title_arabic': 'الاشتقاق ودراسة الدوال',
                'title_french': 'Dérivation et étude de fonctions',
                'description': 'Introduction to differentiation and function analysis.',
                'objectives': 'Learn differentiation techniques and function study methods.',
                'prerequisites': 'Knowledge of limits and continuity.'
            },
            {
                'order': 4,
                'title': 'Differentiation',
                'title_arabic': 'الاشتقاق',
                'title_french': 'La dérivation',
                'description': 'Comprehensive study of differentiation rules and techniques.',
                'objectives': 'Master differentiation rules and their applications.',
                'prerequisites': 'Understanding of functions and limits.'
            },
            {
                'order': 5,
                'title': 'Study of functions and their graphical representation',
                'title_arabic': 'دراسة الدوال وتمثيلها البياني',
                'title_french': 'Étude de fonctions et leur représentation graphique',
                'description': 'Analysis of functions and their graphical representation.',
                'objectives': 'Understand function behavior and graphical interpretation.',
                'prerequisites': 'Knowledge of differentiation and function properties.'
            },
            {
                'order': 6,
                'title': 'Exponential function with base a',
                'title_arabic': 'الدالة الأسية للأساس a',
                'title_french': 'Fonction exponentielle de base a',
                'description': 'Study of exponential functions with arbitrary base.',
                'objectives': 'Understand properties and applications of exponential functions.',
                'prerequisites': 'Knowledge of functions and their properties.'
            },
            {
                'order': 7,
                'title': 'Inverse function',
                'title_arabic': 'الدالة العكسية',
                'title_french': 'Fonction réciproque',
                'description': 'Study of inverse functions and their properties.',
                'objectives': 'Understand the concept of inverse functions and their applications.',
                'prerequisites': 'Understanding of function composition and bijections.'
            },
            {
                'order': 8,
                'title': 'The nth root function',
                'title_arabic': 'دالة الجذر من الرتبة n',
                'title_french': 'Fonction racine n-ième',
                'description': 'Study of nth root functions and their properties.',
                'objectives': 'Master nth root functions and their applications.',
                'prerequisites': 'Knowledge of power functions and inverse functions.'
            },
            {
                'order': 9,
                'title': 'Asymptotic branches of a curve',
                'title_arabic': 'الفروع اللانهائية لمنحنى دالة',
                'title_french': 'Branches infinies d\'une courbe',
                'description': 'Study of asymptotic behavior and infinite branches of curves.',
                'objectives': 'Understand asymptotic analysis and curve behavior at infinity.',
                'prerequisites': 'Knowledge of limits and function study.'
            },
            {
                'order': 10,
                'title': 'Axis of symmetry, center of symmetry, inflection point',
                'title_arabic': 'محور التماثل، مركز التماثل، نقطة الانعطاف',
                'title_french': 'Axe de symétrie, centre de symétrie, point d\'inflexion',
                'description': 'Study of symmetry properties and inflection points of curves.',
                'objectives': 'Identify and analyze symmetry properties and curve characteristics.',
                'prerequisites': 'Knowledge of differentiation and curve analysis.'
            },
            {
                'order': 11,
                'title': 'Natural exponential functions',
                'title_arabic': 'الدوال الأسية النيبرية',
                'title_french': 'Fonctions exponentielles népériennes',
                'description': 'Study of natural exponential functions and their properties.',
                'objectives': 'Master natural exponential functions and their applications.',
                'prerequisites': 'Understanding of exponential functions and limits.'
            },
            {
                'order': 12,
                'title': 'Limit of a sequence',
                'title_arabic': 'نهاية متتالية',
                'title_french': 'Limite d\'une suite',
                'description': 'Study of sequence limits and convergence.',
                'objectives': 'Understand sequence convergence and limit calculations.',
                'prerequisites': 'Knowledge of sequences and limit concepts.'
            },
            {
                'order': 13,
                'title': 'Finite increments',
                'title_arabic': 'التزايدات المنتهية',
                'title_french': 'Accroissements finis',
                'description': 'Study of mean value theorem and finite increments.',
                'objectives': 'Understand the mean value theorem and its applications.',
                'prerequisites': 'Knowledge of differentiation and continuity.'
            },
            {
                'order': 14,
                'title': 'Numerical sequences',
                'title_arabic': 'المتتاليات العددية',
                'title_french': 'Suites numériques',
                'description': 'Comprehensive study of numerical sequences.',
                'objectives': 'Master sequence properties, convergence, and applications.',
                'prerequisites': 'Basic understanding of sequences and limits.'
            },
            {
                'order': 15,
                'title': 'Arithmetic in Z (Integers)',
                'title_arabic': 'الحسابيات في المجموعة Z',
                'title_french': 'Arithmétique dans l\'ensemble Z',
                'description': 'Study of arithmetic properties in the set of integers.',
                'objectives': 'Understand divisibility, prime numbers, and modular arithmetic.',
                'prerequisites': 'Basic knowledge of integers and division.'
            },
            {
                'order': 16,
                'title': 'Complex numbers',
                'title_arabic': 'الأعداد العقدية',
                'title_french': 'Nombres complexes',
                'description': 'Introduction to complex numbers and their operations.',
                'objectives': 'Master complex number arithmetic and geometric interpretation.',
                'prerequisites': 'Knowledge of real numbers and coordinate geometry.'
            },
            {
                'order': 17,
                'title': 'Algebraic structures',
                'title_arabic': 'البنيات الجبرية',
                'title_french': 'Structures algébriques',
                'description': 'Introduction to algebraic structures and their properties.',
                'objectives': 'Understand basic algebraic structures and their applications.',
                'prerequisites': 'Knowledge of sets and binary operations.'
            },
            {
                'order': 18,
                'title': 'Internal composition laws (Group, Ring, Field)',
                'title_arabic': 'قوانين التركيب الداخلي (الزمرة، الحلقة، الجسم)',
                'title_french': 'Lois de composition interne (Groupe, Anneau, Corps)',
                'description': 'Study of groups, rings, and fields as algebraic structures.',
                'objectives': 'Master fundamental algebraic structures and their properties.',
                'prerequisites': 'Understanding of algebraic structures and binary operations.'
            }
        ]

        try:
            # Get Mathematics subject
            math_subject = Subject.objects.get(code='MATH101')
            self.stdout.write(f'Found Mathematics subject: {math_subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Mathematics subject not found. Please ensure MATH101 exists.')
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
            self.stdout.write('Deleting existing first cycle mathematics lessons...')
            deleted_count = Lesson.objects.filter(
                subject=math_subject,
                grade=second_year_bac_grade,
                cycle='first'
            ).delete()[0]
            self.stdout.write(
                self.style.WARNING(f'Deleted {deleted_count} existing first cycle mathematics lessons')
            )

        self.stdout.write('Creating first cycle mathematics lessons...')

        created_count = 0
        for lesson_data in math_lessons_cycle1:
            lesson, created = Lesson.objects.get_or_create(
                subject=math_subject,
                grade=second_year_bac_grade,
                cycle='first',  # First Cycle as specified
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
                f'Successfully created {created_count} new first cycle mathematics lessons. '
                f'Total first cycle mathematics lessons for {second_year_bac_grade.name}: {Lesson.objects.filter(subject=math_subject, grade=second_year_bac_grade, cycle="first").count()}'
            )
        )