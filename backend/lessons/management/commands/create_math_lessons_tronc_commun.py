from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create mathematics lessons for Tronc Commun (Common Core)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing Tronc Commun mathematics lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # Mathematics lessons data for Tronc Commun
        math_lessons_tronc_commun_s1 = [
            {
                'order': 1,
                'title': 'Natural Numbers and Principles of Arithmetic',
                'title_arabic': 'الأعداد الصحيحة الطبيعية ومبادئ في الحسابيات',
                'title_french': 'Nombres entiers naturels et principes d\'arithmétique',
                'description': 'An introduction to natural numbers and the fundamental principles of arithmetic.',
                'objectives': 'Understand the properties of natural numbers and basic arithmetic operations.',
                'prerequisites': 'None'
            },
            {
                'order': 2,
                'title': 'The sets N, Z, D, Q, R',
                'title_arabic': 'المجموعات N, Z, ID, Q, R',
                'title_french': 'Les ensembles N, Z, D, Q, R',
                'description': 'A study of the different sets of numbers: Natural, Integer, Decimal, Rational, and Real numbers.',
                'objectives': 'Distinguish between different number sets and understand their relationships.',
                'prerequisites': 'Basic understanding of numbers.'
            },
            {
                'order': 3,
                'title': 'Order in R',
                'title_arabic': 'الترتيب في المجموعة R',
                'title_french': "L'ordre dans R",
                'description': 'Understanding the concept of order, inequalities, and intervals in the set of real numbers.',
                'objectives': 'Master the concepts of order and inequalities in R.',
                'prerequisites': 'Knowledge of the set of real numbers.'
            },
            {
                'order': 4,
                'title': 'Polynomials',
                'title_arabic': 'الحدوديات',
                'title_french': 'Les polynômes',
                'description': 'An introduction to polynomials, including operations and factorization.',
                'objectives': 'Understand polynomial operations, factorization, and solving polynomial equations.',
                'prerequisites': 'Basic algebra.'
            },
            {
                'order': 5,
                'title': 'Equations, Inequalities, and Systems',
                'title_arabic': 'المعادلات والمتراجحات والنظمات',
                'title_french': 'Équations, inéquations et systèmes',
                'description': 'Solving linear and quadratic equations, inequalities, and systems of equations.',
                'objectives': 'Develop skills in solving various types of equations and inequalities.',
                'prerequisites': 'Knowledge of polynomials.'
            },
            {
                'order': 6,
                'title': 'Vector Calculus in the Plane',
                'title_arabic': 'الحساب المتجهي في المستوى',
                'title_french': 'Le calcul vectoriel dans le plan',
                'description': 'An introduction to vectors in the plane, including operations and applications.',
                'objectives': 'Understand vector operations and their geometric interpretations.',
                'prerequisites': 'Basic geometry.'
            },
            {
                'order': 7,
                'title': 'Projection in the Plane',
                'title_arabic': 'الإسقاط في المستوى',
                'title_french': 'La projection dans le plan',
                'description': 'Understanding the concept of projection of points and vectors in the plane.',
                'objectives': 'Master the concept of orthogonal projection and its properties.',
                'prerequisites': 'Knowledge of vector calculus.'
            },
            {
                'order': 8,
                'title': 'The Straight Line in the Plane',
                'title_arabic': 'المستقيم في المستوى',
                'title_french': 'La droite dans le plan',
                'description': 'Studying the different forms of equations of a straight line in the plane.',
                'objectives': 'Understand and use the equations of straight lines to solve geometric problems.',
                'prerequisites': 'Vector calculus and projection.'
            },
            {
                'order': 9,
                'title': 'Trigonometry',
                'title_arabic': 'الحساب المثلثي',
                'title_french': 'Le calcul trigonométrique',
                'description': 'An introduction to trigonometric functions, the unit circle, and basic identities.',
                'objectives': 'Understand trigonometric functions and their properties.',
                'prerequisites': 'Geometry and basic algebra.'
            },
            {
                'order': 10,
                'title': 'Trigonometric Formulas',
                'title_arabic': 'قواعد في الحساب المثلثي',
                'title_french': 'Formules de trigonométrie',
                'description': 'A study of the main trigonometric formulas and identities.',
                'objectives': 'Master and apply trigonometric formulas to solve problems.',
                'prerequisites': 'Introduction to trigonometry.'
            }
        ]

        math_lessons_tronc_commun_s2 = [
            {
                'order': 11,
                'title': 'Transformations in the Plane',
                'title_arabic': 'التحويلات في المستوى',
                'title_french': 'Les transformations dans le plan',
                'description': 'Studying geometric transformations such as translations, rotations, and reflections.',
                'objectives': 'Understand and apply geometric transformations in the plane.',
                'prerequisites': 'Vector calculus and geometry.'
            },
            {
                'order': 12,
                'title': 'The Scalar Product',
                'title_arabic': 'الجداء السلمي',
                'title_french': 'Le produit scalaire',
                'description': 'An introduction to the scalar (dot) product of vectors and its applications.',
                'objectives': 'Understand the scalar product and its applications in geometry and physics.',
                'prerequisites': 'Vector calculus.'
            },
            {
                'order': 13,
                'title': 'Numerical Functions',
                'title_arabic': 'الدوال العددية',
                'title_french': 'Les fonctions numériques',
                'description': 'A general study of numerical functions, including domain, range, and variations.',
                'objectives': 'Understand the properties of numerical functions and their graphical representations.',
                'prerequisites': 'Basic algebra and trigonometry.'
            },
            {
                'order': 14,
                'title': 'Trigonometric Equations and Inequalities',
                'title_arabic': 'المعادلات والمتراجحات المثلثية',
                'title_french': 'Équations et inéquations trigonométriques',
                'description': 'Solving equations and inequalities involving trigonometric functions.',
                'objectives': 'Develop skills in solving trigonometric equations and inequalities.',
                'prerequisites': 'Trigonometry and trigonometric formulas.'
            },
            {
                'order': 15,
                'title': 'Geometry in Space',
                'title_arabic': 'الهندسة الفضائية',
                'title_french': 'La géométrie dans l\'espace',
                'description': 'An introduction to three-dimensional geometry, including lines, planes, and vectors in space.',
                'objectives': 'Understand and solve problems in three-dimensional space.',
                'prerequisites': 'Plane geometry and vector calculus.'
            },
            {
                'order': 16,
                'title': 'Statistics',
                'title_arabic': 'الإحصاء',
                'title_french': 'Les statistiques',
                'description': 'An introduction to descriptive statistics, including measures of central tendency and dispersion.',
                'objectives': 'Understand and apply basic statistical concepts to analyze data.',
                'prerequisites': 'Basic mathematics.'
            }
        ]

        try:
            math_subject = Subject.objects.get(code='MATH101')
            self.stdout.write(f'Found Mathematics subject: {math_subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Mathematics subject not found. Please ensure MATH101 exists.')
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
            self.stdout.write('Deleting existing Tronc Commun mathematics lessons...')
            deleted_count_s1 = Lesson.objects.filter(
                subject=math_subject,
                grade=common_core_grade,
                cycle='first'
            ).delete()[0]
            deleted_count_s2 = Lesson.objects.filter(
                subject=math_subject,
                grade=common_core_grade,
                cycle='second'
            ).delete()[0]
            self.stdout.write(
                self.style.WARNING(f'Deleted {deleted_count_s1} first term and {deleted_count_s2} second term existing lessons.')
            )

        self.stdout.write('Creating Tronc Commun mathematics lessons...')

        created_count_s1 = 0
        for lesson_data in math_lessons_tronc_commun_s1:
            lesson, created = Lesson.objects.get_or_create(
                subject=math_subject,
                grade=common_core_grade,
                cycle='first',
                order=lesson_data['order'],
                defaults={
                    'title': lesson_data['title'],
                    'title_arabic': lesson_data['title_arabic'],
                    'title_french': lesson_data['title_french'],
                    'description': lesson_data['description'],
                    'objectives': lesson_data['objectives'],
                    'prerequisites': lesson_data['prerequisites'],
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
        for lesson_data in math_lessons_tronc_commun_s2:
            lesson, created = Lesson.objects.get_or_create(
                subject=math_subject,
                grade=common_core_grade,
                cycle='second',
                order=lesson_data['order'],
                defaults={
                    'title': lesson_data['title'],
                    'title_arabic': lesson_data['title_arabic'],
                    'title_french': lesson_data['title_french'],
                    'description': lesson_data['description'],
                    'objectives': lesson_data['objectives'],
                    'prerequisites': lesson_data['prerequisites'],
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term mathematics lessons for Tronc Commun.'
            )
        )
