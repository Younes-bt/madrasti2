from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Math lessons for 2AC French track (Deuxième Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 2AC Math lessons for French track before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 8 lessons (Rational Numbers and Basic Geometry)
        lessons_s1 = [
            {'order': 1, 'title': 'Introduction to Rational Numbers', 'title_arabic': 'مقدمة للأعداد الجذرية', 'title_french': 'Introduction aux nombres rationnels'},
            {'order': 2, 'title': 'Sum and Difference of Rational Numbers', 'title_arabic': 'مجموع وفرق الأعداد الجذرية', 'title_french': 'Somme et différence des nombres rationnels'},
            {'order': 3, 'title': 'Powers', 'title_arabic': 'القوى', 'title_french': 'Les puissances'},
            {'order': 4, 'title': 'Axial Symmetry', 'title_arabic': 'التماثل المحوري', 'title_french': 'Symétrie axiale'},
            {'order': 5, 'title': 'Product and Quotient of Rational Numbers', 'title_arabic': 'ضرب وقسمة الأعداد الجذرية', 'title_french': 'Produit et quotient des nombres rationnels'},
            {'order': 6, 'title': 'Four Operations on Rational Numbers', 'title_arabic': 'العمليات الأربع على الأعداد الجذرية', 'title_french': 'Les quatre opérations sur les nombres rationnels'},
            {'order': 7, 'title': 'Triangles and Parallel Lines', 'title_arabic': 'المثلثات والخطوط المتوازية', 'title_french': 'Triangles et droites parallèles'},
            {'order': 8, 'title': 'Notable Lines in a Triangle', 'title_arabic': 'الخطوط البارزة في المثلث', 'title_french': 'Droites remarquables dans un triangle'},
        ]

        # Second Cycle - 9 lessons (Algebra, Advanced Geometry, and Applications)
        lessons_s2 = [
            {'order': 1, 'title': 'Literal Calculation', 'title_arabic': 'الحساب الحرفي', 'title_french': 'Calcul littéral'},
            {'order': 2, 'title': 'Right Triangle and Circle', 'title_arabic': 'المثلث القائم والدائرة', 'title_french': 'Triangle rectangle et cercle'},
            {'order': 3, 'title': 'Equations', 'title_arabic': 'المعادلات', 'title_french': 'Équations'},
            {'order': 4, 'title': 'Pythagorean Theorem and Cosine of an Acute Angle', 'title_arabic': 'نظرية فيثاغورس وجيب التمام لزاوية حادة', 'title_french': 'Théorème de Pythagore et cosinus d\'un angle aigu'},
            {'order': 5, 'title': 'Order and Operations', 'title_arabic': 'الترتيب والعمليات', 'title_french': 'Ordre et opérations'},
            {'order': 6, 'title': 'Vectors and Translation', 'title_arabic': 'المتجهات والانتقال', 'title_french': 'Vecteurs et translation'},
            {'order': 7, 'title': 'Introduction to Real Numbers', 'title_arabic': 'مقدمة للأعداد الحقيقية', 'title_french': 'Introduction aux nombres réels'},
            {'order': 8, 'title': 'Proportionality and Linear Functions', 'title_arabic': 'التناسب والدوال الخطية', 'title_french': 'Proportionnalité et fonctions linéaires'},
            {'order': 9, 'title': 'Statistics', 'title_arabic': 'الإحصاء', 'title_french': 'Statistiques'},
            {'order': 10, 'title': 'Pyramid and Cone of Revolution', 'title_arabic': 'الهرم والمخروط الدوراني', 'title_french': 'Pyramide et cône de révolution'},
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
            grade = Grade.objects.get(code='2AC')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "2AC" not found. Please create it first.')
            )
            return

        try:
            track_frn = Track.objects.get(code='2AC-FRN')
            self.stdout.write(f'Found FRN track: {track_frn.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "2AC-FRN" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 2AC Math lessons for French track...')
            existing_lessons = Lesson.objects.filter(
                subject=subject,
                grade=grade,
                tracks__code='2AC-FRN'
            )
            for lesson in existing_lessons:
                if lesson.tracks.count() == 1:  # Only delete if this is the only track
                    lesson.delete()
                else:
                    lesson.tracks.remove(track_frn)  # Just remove from this track
            self.stdout.write(self.style.WARNING('Removed existing lessons for French track.'))

        self.stdout.write('Creating/updating 2AC Math lessons for French track...')
        created_count_s1 = 0
        updated_count_s1 = 0
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
                    'description': f"Math - {lesson_data['title_french']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
            else:
                # Update existing lesson with French titles if needed
                lesson.title_french = lesson_data['title_french']
                lesson.save()
                updated_count_s1 += 1
            # Add French track to the lesson
            lesson.tracks.add(track_frn)

        created_count_s2 = 0
        updated_count_s2 = 0
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
                    'description': f"Math - {lesson_data['title_french']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
            else:
                # Update existing lesson with French titles if needed
                lesson.title_french = lesson_data['title_french']
                lesson.save()
                updated_count_s2 += 1
            # Add French track to the lesson
            lesson.tracks.add(track_frn)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Math lessons. '
                f'Updated {updated_count_s1} first term and {updated_count_s2} second term existing lessons for 2AC French track.'
            )
        )