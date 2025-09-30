from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Math lessons for TC French International tracks (Tronc Commun BIOF)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing TC Math lessons for BIOF tracks before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 7 lessons
        lessons_s1 = [
            {'order': 1, 'title': 'Arithmetic in ℕ', 'title_arabic': 'الحساب في ℕ', 'title_french': 'Arithmétique dans ℕ'},
            {'order': 2, 'title': 'Number Sets ℕ, ℤ, ℚ, 𝔻 and ℝ', 'title_arabic': 'مجموعات الأعداد ℕ، ℤ، ℚ، 𝔻 و ℝ', 'title_french': 'Les ensembles de nombres ℕ, ℤ, ℚ, 𝔻 et ℝ'},
            {'order': 3, 'title': 'Order in ℝ', 'title_arabic': 'الترتيب في ℝ', 'title_french': 'L\'ordre dans ℝ'},
            {'order': 4, 'title': 'Polynomials', 'title_arabic': 'كثيرات الحدود', 'title_french': 'Les polynômes'},
            {'order': 5, 'title': 'Equations, Inequalities and Systems', 'title_arabic': 'المعادلات والمتراجحات والأنظمة', 'title_french': 'Équations, inéquations et systèmes'},
            {'order': 6, 'title': 'Vector Calculus in the Plane', 'title_arabic': 'الحساب الشعاعي في المستوى', 'title_french': 'Calcul vectoriel dans le plan'},
            {'order': 7, 'title': 'Projection in the Plane', 'title_arabic': 'الإسقاط في المستوى', 'title_french': 'La projection dans le plan'},
        ]

        # Second Cycle - 7 lessons
        lessons_s2 = [
            {'order': 1, 'title': 'The Line in the Plane', 'title_arabic': 'المستقيم في المستوى', 'title_french': 'La droite dans le plan'},
            {'order': 2, 'title': 'Trigonometry 1 (Trigonometric Calculation Rules)', 'title_arabic': 'علم المثلثات 1 (قواعد الحساب المثلثي)', 'title_french': 'Trigonométrie 1 (Règles du calcul trigonométrique)'},
            {'order': 3, 'title': 'Plane Transformations', 'title_arabic': 'تحويلات المستوى', 'title_french': 'Transformations du plan'},
            {'order': 4, 'title': 'Scalar Product', 'title_arabic': 'الجداء السلمي', 'title_french': 'Le produit scalaire'},
            {'order': 5, 'title': 'General Functions', 'title_arabic': 'عموميات حول الدوال', 'title_french': 'Généralités sur les fonctions'},
            {'order': 6, 'title': 'Trigonometry 2 (Trigonometric Equations and Inequalities)', 'title_arabic': 'علم المثلثات 2 (المعادلات والمتراجحات المثلثية)', 'title_french': 'Trigonométrie 2 (Équations et inéquations trigonométriques)'},
            {'order': 7, 'title': 'Spatial Geometry and Statistics', 'title_arabic': 'الهندسة الفضائية والإحصاء', 'title_french': 'Géométrie dans l\'espace et Statistiques'},
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
            grade = Grade.objects.get(code='TC')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "TC" not found. Please create it first.')
            )
            return

        # Get French International tracks
        track_codes = ['TCS-BIOF', 'TCT-BIOF']
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
            self.stdout.write('Deleting existing TC Math lessons for BIOF tracks...')
            for track in tracks:
                existing_lessons = Lesson.objects.filter(
                    subject=subject,
                    grade=grade,
                    tracks__code=track.code
                )
                for lesson in existing_lessons:
                    if lesson.tracks.count() == 1:  # Only delete if this is the only track
                        lesson.delete()
                    else:
                        lesson.tracks.remove(track)  # Just remove from this track
            self.stdout.write(self.style.WARNING('Removed existing lessons for BIOF tracks.'))

        self.stdout.write('Creating TC Math lessons for BIOF tracks...')
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
                    'description': f"Math - {lesson_data['title_french']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
            # Add BIOF tracks to the lesson
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
                    'description': f"Math - {lesson_data['title_french']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
            # Add BIOF tracks to the lesson
            lesson.tracks.add(*tracks)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Math lessons for TC BIOF tracks.'
            )
        )