from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Math lessons for 1B (First Baccalaureate)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 1B Math lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 6 lessons (Logic, Functions, Sequences, Geometry)
        lessons_s1 = [
            {'order': 1, 'title': 'Mathematical Logic', 'title_arabic': 'المنطق الرياضي', 'title_french': 'Logique mathématique'},
            {'order': 2, 'title': 'General Properties of Functions', 'title_arabic': 'عموميات حول الدوال', 'title_french': 'Généralités sur les fonctions'},
            {'order': 3, 'title': 'Numerical Sequences', 'title_arabic': 'المتتاليات العددية', 'title_french': 'Les suites numériques'},
            {'order': 4, 'title': 'Barycenter in the Plane', 'title_arabic': 'النقطة الوسطى في المستوى', 'title_french': 'Le barycentre dans le plan'},
            {'order': 5, 'title': 'Scalar Product and Its Applications', 'title_arabic': 'الجداء السلمي وتطبيقاته', 'title_french': 'Le produit scalaire et ses applications'},
            {'order': 6, 'title': 'Trigonometric Calculation', 'title_arabic': 'الحساب المثلثي', 'title_french': 'Calcul trigonométrique'},
        ]

        # Second Cycle - 6 lessons (Rotation, Limits, Derivatives, Functions, 3D Geometry)
        lessons_s2 = [
            {'order': 1, 'title': 'Rotation in the Plane', 'title_arabic': 'الدوران في المستوى', 'title_french': 'La rotation dans le plan'},
            {'order': 2, 'title': 'Limits of a Function', 'title_arabic': 'نهايات دالة', 'title_french': 'Les limites d\'une fonction'},
            {'order': 3, 'title': 'Differentiation', 'title_arabic': 'الاشتقاق', 'title_french': 'La dérivation'},
            {'order': 4, 'title': 'Study of Numerical Functions', 'title_arabic': 'دراسة الدوال العددية', 'title_french': 'Étude des fonctions numériques'},
            {'order': 5, 'title': 'Space Vectors', 'title_arabic': 'متجهات الفضاء', 'title_french': 'Vecteurs de l\'espace'},
            {'order': 6, 'title': 'Analytical Geometry of Space', 'title_arabic': 'الهندسة التحليلية للفضاء', 'title_french': 'Géométrie analytique de l\'espace'},
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
            grade = Grade.objects.get(code='1B')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "1B" not found. Please create it first.')
            )
            return

        # Get all specified tracks
        track_codes = ['1BAC-SM', '1BAC-SE', '1BAC-ECO', '1BAC-LSH', '1BAC-AA', '1BAC-STM', '1BAC-STE', '1BAC-SM-BIOF', '1BAC-SE-BIOF', '1BAC-STE-BIOF', '1BAC-STM-BIOF']
        tracks = []

        for track_code in track_codes:
            try:
                track = Track.objects.get(code=track_code)
                tracks.append(track)
                self.stdout.write(f'Found track: {track.name}')
            except Track.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'Track with code "{track_code}" not found. Please create it first.')
                )
                return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 1B Math lessons...')
            for track in tracks:
                existing_lessons = Lesson.objects.filter(
                    subject=subject,
                    grade=grade,
                    tracks__code=track.code
                )
                for lesson in existing_lessons:
                    if lesson.tracks.count() == 1:
                        lesson.delete()
                    else:
                        lesson.tracks.remove(track)
            self.stdout.write(self.style.WARNING('Removed existing Math lessons for 1B tracks.'))

        self.stdout.write('Creating 1B Math lessons...')
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
            # Add all specified tracks to the lesson
            lesson.tracks.add(*tracks)

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
            # Add all specified tracks to the lesson
            lesson.tracks.add(*tracks)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first cycle and {created_count_s2} new second cycle Math lessons for 1B.'
            )
        )