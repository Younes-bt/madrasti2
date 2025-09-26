from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create 14 mathematics lessons (lessons 19-32) for Second Year Baccalaureate - Second Cycle'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing second cycle mathematics lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # Mathematics lessons data for second cycle (lessons 19-32)
        math_lessons_cycle2 = [
            {
                'order': 19,
                'title': 'Logarithmic functions',
                'title_arabic': 'الدوال اللوغاريتمية',
                'title_french': 'Fonctions logarithmiques',
                'description': 'Study of logarithmic functions and their properties.',
                'objectives': 'Master logarithmic functions and their applications.',
                'prerequisites': 'Knowledge of exponential functions and inverse functions.'
            },
            {
                'order': 20,
                'title': 'Exponential functions',
                'title_arabic': 'الدوال الاسية',
                'title_french': 'Fonctions exponentielles',
                'description': 'Advanced study of exponential functions.',
                'objectives': 'Master exponential functions and their advanced applications.',
                'prerequisites': 'Understanding of natural exponential functions and limits.'
            },
            {
                'order': 21,
                'title': 'Integration and Antiderivatives',
                'title_arabic': 'التكامل والدوال الأصلية',
                'title_french': 'Calcul intégral et primitives',
                'description': 'Introduction to integration and antiderivatives.',
                'objectives': 'Understand the fundamental concepts of integration.',
                'prerequisites': 'Knowledge of differentiation and continuous functions.'
            },
            {
                'order': 22,
                'title': 'Integration',
                'title_arabic': 'التكامل',
                'title_french': 'Calcul intégral',
                'description': 'Comprehensive study of integration techniques.',
                'objectives': 'Master integration methods and their applications.',
                'prerequisites': 'Understanding of antiderivatives and integration basics.'
            },
            {
                'order': 23,
                'title': 'Antiderivatives (Primitives)',
                'title_arabic': 'الدوال الأصلية',
                'title_french': 'Fonctions primitives',
                'description': 'Detailed study of antiderivatives and primitive functions.',
                'objectives': 'Master the calculation of antiderivatives.',
                'prerequisites': 'Knowledge of differentiation rules and basic integration.'
            },
            {
                'order': 24,
                'title': 'Differential equations',
                'title_arabic': 'المعادلات التفاضلية',
                'title_french': 'Équations différentielles',
                'description': 'Introduction to differential equations and their solutions.',
                'objectives': 'Understand and solve basic differential equations.',
                'prerequisites': 'Knowledge of differentiation and integration.'
            },
            {
                'order': 25,
                'title': 'Probabilities',
                'title_arabic': 'الاحتمالات',
                'title_french': 'Probabilités',
                'description': 'Study of probability theory and its applications.',
                'objectives': 'Master probability concepts and calculations.',
                'prerequisites': 'Basic knowledge of sets and counting principles.'
            },
            {
                'order': 26,
                'title': 'Conic sections (Curves of the second degree)',
                'title_arabic': 'المخروطيات (المنحنيات من الدرجة الثانية)',
                'title_french': 'Les coniques (Courbes du second degré)',
                'description': 'Study of conic sections: circles, ellipses, parabolas, and hyperbolas.',
                'objectives': 'Understand the properties and equations of conic sections.',
                'prerequisites': 'Knowledge of coordinate geometry and quadratic equations.'
            },
            {
                'order': 27,
                'title': 'Real vector spaces',
                'title_arabic': 'الفضاءات المتجهية الحقيقية',
                'title_french': 'Espaces vectoriels réels',
                'description': 'Introduction to real vector spaces and their properties.',
                'objectives': 'Understand vector space concepts and linear independence.',
                'prerequisites': 'Knowledge of vectors and linear combinations.'
            },
            {
                'order': 28,
                'title': 'Spatial geometry (Geometry in space)',
                'title_arabic': 'الهندسة الفضائية',
                'title_french': 'Géométrie dans l\'espace',
                'description': 'Study of three-dimensional geometry and spatial relationships.',
                'objectives': 'Master spatial geometry concepts and problem-solving.',
                'prerequisites': 'Knowledge of plane geometry and coordinate systems.'
            },
            {
                'order': 29,
                'title': 'Vector product (Cross product)',
                'title_arabic': 'الجداء المتجهي',
                'title_french': 'Produit vectoriel',
                'description': 'Study of vector cross product and its applications.',
                'objectives': 'Master vector cross product calculations and geometric applications.',
                'prerequisites': 'Understanding of vectors and spatial geometry.'
            },
            {
                'order': 30,
                'title': 'The sphere',
                'title_arabic': 'الفلكة',
                'title_french': 'La sphère',
                'description': 'Study of spheres, their equations, and geometric properties.',
                'objectives': 'Understand sphere geometry and related calculations.',
                'prerequisites': 'Knowledge of spatial geometry and coordinate systems.'
            },
            {
                'order': 31,
                'title': 'Scalar product (Dot product) in space',
                'title_arabic': 'الجداء السلمي في الفضاء',
                'title_french': 'Produit scalaire dans l\'espace',
                'description': 'Study of scalar product in three-dimensional space.',
                'objectives': 'Master scalar product calculations in spatial geometry.',
                'prerequisites': 'Understanding of vectors and spatial coordinates.'
            },
            {
                'order': 32,
                'title': 'Counting (Combinatorics)',
                'title_arabic': 'التعداد',
                'title_french': 'Dénombrement',
                'description': 'Study of combinatorics and counting principles.',
                'objectives': 'Master combinatorial counting methods and applications.',
                'prerequisites': 'Basic understanding of sets and mathematical reasoning.'
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
            self.stdout.write('Deleting existing second cycle mathematics lessons...')
            deleted_count = Lesson.objects.filter(
                subject=math_subject,
                grade=second_year_bac_grade,
                cycle='second'
            ).delete()[0]
            self.stdout.write(
                self.style.WARNING(f'Deleted {deleted_count} existing second cycle mathematics lessons')
            )

        self.stdout.write('Creating second cycle mathematics lessons...')

        created_count = 0
        for lesson_data in math_lessons_cycle2:
            lesson, created = Lesson.objects.get_or_create(
                subject=math_subject,
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
                f'Successfully created {created_count} new second cycle mathematics lessons. '
                f'Total second cycle mathematics lessons for {second_year_bac_grade.name}: {Lesson.objects.filter(subject=math_subject, grade=second_year_bac_grade, cycle="second").count()}'
            )
        )