from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Math lessons for 3AC Normal track (Troisième Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 3AC Math lessons for Normal track before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 11 lessons (Algebra and Geometry Fundamentals)
        lessons_s1 = [
            {'order': 1, 'title': 'Expansion and Factorization', 'title_arabic': 'النشر والتعميل', 'title_french': 'Développement et factorisation'},
            {'order': 2, 'title': 'Important Identities', 'title_arabic': 'المتطابقات الهامة', 'title_french': 'Identités remarquables'},
            {'order': 3, 'title': 'Powers', 'title_arabic': 'القوى', 'title_french': 'Puissances'},
            {'order': 4, 'title': 'Square Roots', 'title_arabic': 'الجذور المربعة', 'title_french': 'Racines carrées'},
            {'order': 5, 'title': 'Pythagorean Theorem', 'title_arabic': 'مبرهنة فيتاغورس', 'title_french': 'Théorème de Pythagore'},
            {'order': 6, 'title': 'Order and Operations', 'title_arabic': 'الترتيب والعمليات', 'title_french': 'Ordre et opérations'},
            {'order': 7, 'title': 'Thales Theorem', 'title_arabic': 'مبرهنة طاليس', 'title_french': 'Théorème de Thalès'},
            {'order': 8, 'title': 'Right Triangle', 'title_arabic': 'المثلث القائم الزاوية', 'title_french': 'Triangle rectangle'},
            {'order': 9, 'title': 'Trigonometric Calculations', 'title_arabic': 'الحساب المثلي', 'title_french': 'Calcul trigonométrique'},
            {'order': 10, 'title': 'Central and Inscribed Angles in a Circle', 'title_arabic': 'الزوايا المركزية والزوايا المحيطية في دائرة', 'title_french': 'Angles au centre et angles inscrits dans un cercle'},
            {'order': 11, 'title': 'Congruent and Similar Triangles', 'title_arabic': 'المثلثات المتقايسة والمثلثات المتشابهة', 'title_french': 'Triangles isométriques et triangles semblables'},
        ]

        # Second Cycle - 10 lessons (Advanced Algebra and Coordinate Geometry)
        lessons_s2 = [
            {'order': 1, 'title': 'First Degree Equations and Inequalities with One Unknown', 'title_arabic': 'المعادلات والمتراجحات من الدرجة الأولى بمجهول واحد', 'title_french': 'Équations et inéquations du premier degré à une inconnue'},
            {'order': 2, 'title': 'Vectors and Translation', 'title_arabic': 'المتجهات والازاحة', 'title_french': 'Vecteurs et translation'},
            {'order': 3, 'title': 'Coordinate System in the Plane', 'title_arabic': 'المعلم في المستوى', 'title_french': 'Repère dans le plan'},
            {'order': 4, 'title': 'Coordinates of a Point and Vector Components', 'title_arabic': 'إحداثيتا نقطة و احداثيات متجهة', 'title_french': 'Coordonnées d\'un point et composantes d\'un vecteur'},
            {'order': 5, 'title': 'Linear and Affine Functions', 'title_arabic': 'الدالة الخطية والدالة التآلفية', 'title_french': 'Fonction linéaire et fonction affine'},
            {'order': 6, 'title': 'Equation of a Line', 'title_arabic': 'معادلة مستقيم', 'title_french': 'Équation d\'une droite'},
            {'order': 7, 'title': 'System of Two First Degree Equations with Two Unknowns', 'title_arabic': 'نظمة معادلتين من الدرجة الأولى بمجهولين', 'title_french': 'Système de deux équations du premier degré à deux inconnues'},
            {'order': 8, 'title': 'Systems', 'title_arabic': 'النظمات', 'title_french': 'Systèmes'},
            {'order': 9, 'title': 'Statistics', 'title_arabic': 'الاحصاء', 'title_french': 'Statistiques'},
            {'order': 10, 'title': 'Spatial Geometry', 'title_arabic': 'الهندسة الفضائية', 'title_french': 'Géométrie dans l\'espace'},
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
            grade = Grade.objects.get(code='3AC')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "3AC" not found. Please create it first.')
            )
            return

        try:
            track_nrml = Track.objects.get(code='3AC-NRML')
            self.stdout.write(f'Found NRML track: {track_nrml.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "3AC-NRML" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 3AC Math lessons for Normal track...')
            existing_lessons = Lesson.objects.filter(
                subject=subject,
                grade=grade,
                tracks__code='3AC-NRML'
            )
            for lesson in existing_lessons:
                if lesson.tracks.count() == 1:  # Only delete if this is the only track
                    lesson.delete()
                else:
                    lesson.tracks.remove(track_nrml)  # Just remove from this track
            self.stdout.write(self.style.WARNING('Removed existing lessons for Normal track.'))

        self.stdout.write('Creating 3AC Math lessons for Normal track...')
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Math lessons for 3AC Normal track.'
            )
        )