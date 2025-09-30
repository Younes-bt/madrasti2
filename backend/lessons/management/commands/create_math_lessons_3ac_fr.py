from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Math lessons for 3AC French track (Troisième Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 3AC Math lessons for French track before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 9 lessons (Algebra and Geometry Fundamentals)
        lessons_s1 = [
            {'order': 1, 'title': 'Square Roots', 'title_arabic': 'الجذور المربعة', 'title_french': 'Racines carrées'},
            {'order': 2, 'title': 'Development, Factorization and Remarkable Identities', 'title_arabic': 'النشر والتعميل والمتطابقات الهامة', 'title_french': 'Développement, factorisation et identités Remarquables'},
            {'order': 3, 'title': 'Powers', 'title_arabic': 'القوى', 'title_french': 'Les puissances'},
            {'order': 4, 'title': 'Thales Theorem', 'title_arabic': 'مبرهنة طاليس', 'title_french': 'Théorème de Thalès'},
            {'order': 5, 'title': 'Pythagorean Theorem', 'title_arabic': 'مبرهنة فيثاغورس', 'title_french': 'Théorème de Pythagore'},
            {'order': 6, 'title': 'Order and Operations', 'title_arabic': 'الترتيب والعمليات', 'title_french': 'Ordre et opérations'},
            {'order': 7, 'title': 'Right Triangles and Trigonometry', 'title_arabic': 'المثلثات القائمة وعلم المثلثات', 'title_french': 'Triangles rectangles et trigonométrie'},
            {'order': 8, 'title': 'Inscribed Angles and Central Angles', 'title_arabic': 'الزوايا المحيطية والزوايا المركزية', 'title_french': 'Angles inscrits et angles au centre'},
            {'order': 9, 'title': 'Isometric and Similar Triangles', 'title_arabic': 'المثلثات المتقايسة والمثلثات المتشابهة', 'title_french': 'Triangles isométriques et triangles semblables'},
        ]

        # Second Cycle - 8 lessons (Advanced Algebra and Coordinate Geometry)
        lessons_s2 = [
            {'order': 1, 'title': 'First Degree Equations and Inequalities with One Unknown', 'title_arabic': 'المعادلات والمتراجحات من الدرجة الأولى بمجهول واحد', 'title_french': 'Équations et inéquations du premier degré à une inconnue'},
            {'order': 2, 'title': 'Vectors and Translation', 'title_arabic': 'المتجهات والإزاحة', 'title_french': 'Vecteurs et translation'},
            {'order': 3, 'title': 'Coordinate System in the Plane', 'title_arabic': 'المعلم في المستوى', 'title_french': 'Repère dans le plan'},
            {'order': 4, 'title': 'Linear and Affine Functions', 'title_arabic': 'الدالة الخطية والدالة التآلفية', 'title_french': 'Fonction linéaire et fonction affine'},
            {'order': 5, 'title': 'Equation of a Line', 'title_arabic': 'معادلة مستقيم', 'title_french': 'Équation d\'une droite'},
            {'order': 6, 'title': 'Systems of 2 Equations with 2 Unknowns', 'title_arabic': 'نظمة معادلتين بمجهولين', 'title_french': 'Systèmes de 2 équations à 2 inconnues'},
            {'order': 7, 'title': 'Statistics', 'title_arabic': 'الإحصاء', 'title_french': 'Statistiques'},
            {'order': 8, 'title': 'Spatial Geometry', 'title_arabic': 'الهندسة الفضائية', 'title_french': 'Géométrie dans l\'espace'},
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
            track_frn = Track.objects.get(code='3AC-FRN')
            self.stdout.write(f'Found FRN track: {track_frn.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "3AC-FRN" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 3AC Math lessons for French track...')
            existing_lessons = Lesson.objects.filter(
                subject=subject,
                grade=grade,
                tracks__code='3AC-FRN'
            )
            for lesson in existing_lessons:
                if lesson.tracks.count() == 1:  # Only delete if this is the only track
                    lesson.delete()
                else:
                    lesson.tracks.remove(track_frn)  # Just remove from this track
            self.stdout.write(self.style.WARNING('Removed existing lessons for French track.'))

        self.stdout.write('Creating/updating 3AC Math lessons for French track...')
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
                f'Updated {updated_count_s1} first term and {updated_count_s2} second term existing lessons for 3AC French track.'
            )
        )