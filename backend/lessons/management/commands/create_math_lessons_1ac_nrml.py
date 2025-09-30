from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Math lessons for 1AC NRML track (Première Année Collège - Normal Track)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 1AC Math NRML lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 15 lessons (Numbers and Basic Geometry)
        lessons_s1 = [
            {'order': 1, 'title': 'Operations on Natural and Decimal Integers', 'title_arabic': 'العمليات على الأعداد الصحيحة الطبيعية والعشرية', 'title_french': 'Opérations sur les nombres entiers naturels et décimaux'},
            {'order': 2, 'title': 'Fractional Numbers', 'title_arabic': 'الأعداد الكسرية', 'title_french': 'Les nombres fractionnaires'},
            {'order': 3, 'title': 'Operations on Fractional Numbers', 'title_arabic': 'العمليات على الأعداد الكسرية', 'title_french': 'Opérations sur les nombres fractionnaires'},
            {'order': 4, 'title': 'Fractional Notation and Comparison of Fractional Numbers', 'title_arabic': 'الكتابات الكسرية ومقارنة الأعداد الكسرية', 'title_french': 'Écritures fractionnaires et comparaison des nombres fractionnaires'},
            {'order': 5, 'title': 'Relative Decimal Numbers', 'title_arabic': 'الأعداد العشرية النسبية', 'title_french': 'Les nombres décimaux relatifs'},
            {'order': 6, 'title': 'Introduction and Comparison of Relative Decimal Numbers', 'title_arabic': 'تقديم ومقارنة الأعداد العشرية النسبية', 'title_french': 'Introduction et comparaison des nombres décimaux relatifs'},
            {'order': 7, 'title': 'Addition and Subtraction of Relative Decimal Numbers', 'title_arabic': 'جمع وطرح الأعداد العشرية النسبية', 'title_french': 'Addition et soustraction des nombres décimaux relatifs'},
            {'order': 8, 'title': 'Multiplication and Division of Relative Decimal Numbers', 'title_arabic': 'ضرب وقسمة الأعداد العشرية النسبية', 'title_french': 'Multiplication et division des nombres décimaux relatifs'},
            {'order': 9, 'title': 'Powers', 'title_arabic': 'القوى', 'title_french': 'Les puissances'},
            {'order': 10, 'title': 'Line and Its Parts', 'title_arabic': 'المستقيم وأجزاؤه', 'title_french': 'La droite et ses parties'},
            {'order': 11, 'title': 'Areas and Perimeters', 'title_arabic': 'المساحات والمحيطات', 'title_french': 'Aires et périmètres'},
            {'order': 12, 'title': 'Angles', 'title_arabic': 'الزوايا', 'title_french': 'Les angles'},
            {'order': 13, 'title': 'Segment Bisector and Triangle Inequality', 'title_arabic': 'واسط قطعة والمتفاوتة المثلثية', 'title_french': 'Médiatrice d\'un segment et inégalité triangulaire'},
            {'order': 14, 'title': 'Triangle', 'title_arabic': 'المثلث', 'title_french': 'Le triangle'},
            {'order': 15, 'title': 'Bisectors and Altitudes in a Triangle', 'title_arabic': 'المنصفات والإرتفاعات في مثلث', 'title_french': 'Bissectrices et hauteurs dans un triangle'},
        ]

        # Second Cycle - 11 lessons (Advanced Topics and Geometry)
        lessons_s2 = [
            {'order': 1, 'title': 'Expansion and Factorization', 'title_arabic': 'النشر والتعميل', 'title_french': 'Développement et factorisation'},
            {'order': 2, 'title': 'Equations', 'title_arabic': 'المعادلات', 'title_french': 'Les équations'},
            {'order': 3, 'title': 'Central Symmetry', 'title_arabic': 'التماثل المركزي', 'title_french': 'La symétrie centrale'},
            {'order': 4, 'title': 'Angles Formed by Two Parallel Lines and a Transversal', 'title_arabic': 'الزوايا المكونة من متوازيين وقاطع لهما', 'title_french': 'Angles formés par deux droites parallèles et une sécante'},
            {'order': 5, 'title': 'Parallelogram', 'title_arabic': 'متوازي الأضلاع', 'title_french': 'Le parallélogramme'},
            {'order': 6, 'title': 'Special Quadrilaterals', 'title_arabic': 'الرباعيات الخاصة', 'title_french': 'Les quadrilatères particuliers'},
            {'order': 7, 'title': 'Circle', 'title_arabic': 'الدائرة', 'title_french': 'Le cercle'},
            {'order': 8, 'title': 'Right Prism and Right Cylinder', 'title_arabic': 'الموشور القائم والأسطوانة القائمة', 'title_french': 'Prisme droit et cylindre droit'},
            {'order': 9, 'title': 'Graduated Line and Coordinate System in the Plane', 'title_arabic': 'المستقيم المدرج والمعلم في المستوى', 'title_french': 'Droite graduée et repère dans le plan'},
            {'order': 10, 'title': 'Proportionality', 'title_arabic': 'التناسبية', 'title_french': 'La proportionnalité'},
            {'order': 11, 'title': 'Statistics', 'title_arabic': 'الإحصاء', 'title_french': 'Les statistiques'},
        ]

        try:
            subject = Subject.objects.get(code='MATH101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code MATH101 not found. Please ensure it exists.')
            )
            return

        try:
            grade = Grade.objects.get(code='1AC')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "1AC" not found. Please create it first.')
            )
            return

        try:
            track = Track.objects.get(code='1AC-NRML')
            self.stdout.write(f'Found track: {track.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "1AC-NRML" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 1AC Math NRML lessons for this subject and track...')
            # Delete lessons that are associated with both this subject, grade AND this specific track
            lessons_to_delete = Lesson.objects.filter(subject=subject, grade=grade, tracks=track)
            deleted_count = lessons_to_delete.count()
            lessons_to_delete.delete()
            self.stdout.write(self.style.WARNING(f'Deleted {deleted_count} existing lessons for this subject, grade, and track.'))

        self.stdout.write('Creating 1AC Math NRML lessons for this subject...')
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
                    'description': f"Math - {lesson_data['title_arabic']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
            # Add track to the lesson (works for both created and existing lessons)
            lesson.tracks.add(track)

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
                    'description': f"Math - {lesson_data['title_arabic']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
            # Add track to the lesson (works for both created and existing lessons)
            lesson.tracks.add(track)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Math NRML lessons for 1AC.'
            )
        )