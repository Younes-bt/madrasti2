from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Math lessons for 2AC Normal track (Deuxième Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 2AC Math lessons for Normal track before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 10 lessons (Rational Numbers and Geometry)
        lessons_s1 = [
            {'order': 1, 'title': 'Rational Numbers', 'title_arabic': 'الأعداد الجذرية', 'title_french': 'Nombres rationnels'},
            {'order': 2, 'title': 'Operations on Rational Numbers', 'title_arabic': 'العملیات على الأعداد الجذرية', 'title_french': 'Opérations sur les nombres rationnels'},
            {'order': 3, 'title': 'Sum and Difference of Two Rational Numbers', 'title_arabic': 'مجموع وفرق عددين جذريين', 'title_french': 'Somme et différence de deux nombres rationnels'},
            {'order': 4, 'title': 'Product and Quotient of Two Rational Numbers', 'title_arabic': 'جذاء وخارج عددين جذريين', 'title_french': 'Produit et quotient de deux nombres rationnels'},
            {'order': 5, 'title': 'Four Operations on Rational Numbers', 'title_arabic': 'العمليات الأربع على الأعداد الجذرية', 'title_french': 'Quatre opérations sur les nombres rationnels'},
            {'order': 6, 'title': 'Powers of 10', 'title_arabic': 'قوى العدد 10', 'title_french': 'Puissances de 10'},
            {'order': 7, 'title': 'Powers of a Rational Number', 'title_arabic': 'قوى عدد جذري', 'title_french': 'Puissances d\'un nombre rationnel'},
            {'order': 8, 'title': 'Axial Symmetry', 'title_arabic': 'التماثل المحوري', 'title_french': 'Symétrie axiale'},
            {'order': 9, 'title': 'Lines Parallel to the Sides of a Triangle', 'title_arabic': 'المستقيمات الموازية لأضلاع مثلث', 'title_french': 'Droites parallèles aux côtés d\'un triangle'},
            {'order': 10, 'title': 'Important Lines in a Triangle', 'title_arabic': 'المستقيمات الھامة في مثلث', 'title_french': 'Droites importantes dans un triangle'},
        ]

        # Second Cycle - 12 lessons (Algebra, Functions, and Advanced Geometry)
        lessons_s2 = [
            {'order': 1, 'title': 'Literal Calculation (Simplification - Expansion - Factorization)', 'title_arabic': 'الحساب الحرفي (التبسيط – النشر – التعميل)', 'title_french': 'Calcul littéral (simplification - développement - factorisation)'},
            {'order': 2, 'title': 'Equations', 'title_arabic': 'المعادلات', 'title_french': 'Équations'},
            {'order': 3, 'title': 'Ordering Rational Numbers and Operations', 'title_arabic': 'ترتيب الأعداد الجذرية والعمليات', 'title_french': 'Ordre des nombres rationnels et opérations'},
            {'order': 4, 'title': 'Proportion', 'title_arabic': 'التناسب', 'title_french': 'Proportionnalité'},
            {'order': 5, 'title': 'Linear Functions', 'title_arabic': 'الدوال الخطية', 'title_french': 'Fonctions linéaires'},
            {'order': 6, 'title': 'Pythagorean Theorem', 'title_arabic': 'مبرهنة فيتاغورس', 'title_french': 'Théorème de Pythagore'},
            {'order': 7, 'title': 'Cosine of an Acute Angle', 'title_arabic': 'جيب تمام زاوية حادة', 'title_french': 'Cosinus d\'un angle aigu'},
            {'order': 8, 'title': 'Right Triangle and Circle', 'title_arabic': 'المثلث القائم الزاوية والدائرة', 'title_french': 'Triangle rectangle et cercle'},
            {'order': 9, 'title': 'Vectors and Translation', 'title_arabic': 'المتجهات والإزاحة', 'title_french': 'Vecteurs et translation'},
            {'order': 10, 'title': 'Pyramid, Cone and Right Prism', 'title_arabic': 'الهرم والمخروط الدوراني والموشور القائم', 'title_french': 'Pyramide, cône et prisme droit'},
            {'order': 11, 'title': 'Statistics', 'title_arabic': 'الإحصاء', 'title_french': 'Statistiques'},
            {'order': 12, 'title': 'Introduction to Real Numbers', 'title_arabic': 'تقديم الأعداد الحقيقية', 'title_french': 'Introduction aux nombres réels'},
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
            track_nrml = Track.objects.get(code='2AC-NRML')
            self.stdout.write(f'Found NRML track: {track_nrml.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "2AC-NRML" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 2AC Math lessons for Normal track...')
            existing_lessons = Lesson.objects.filter(
                subject=subject,
                grade=grade,
                tracks__code='2AC-NRML'
            )
            for lesson in existing_lessons:
                if lesson.tracks.count() == 1:  # Only delete if this is the only track
                    lesson.delete()
                else:
                    lesson.tracks.remove(track_nrml)  # Just remove from this track
            self.stdout.write(self.style.WARNING('Removed existing lessons for Normal track.'))

        self.stdout.write('Creating 2AC Math lessons for Normal track...')
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
            # Add Normal track to the lesson
            lesson.tracks.add(track_nrml)

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
            # Add Normal track to the lesson
            lesson.tracks.add(track_nrml)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Math lessons for 2AC Normal track.'
            )
        )