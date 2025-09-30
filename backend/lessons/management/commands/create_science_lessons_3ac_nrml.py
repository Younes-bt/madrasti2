from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Science lessons for 3AC Normal track (Troisième Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 3AC Science lessons for Normal track before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 8 lessons (Human Body Systems)
        lessons_s1 = [
            {'order': 1, 'title': 'Digestion and Absorption', 'title_arabic': 'الهضم والامتصاص', 'title_french': 'Digestion et absorption'},
            {'order': 2, 'title': 'Urinary Excretion', 'title_arabic': 'الإبراز البولي', 'title_french': 'Excrétion urinaire'},
            {'order': 3, 'title': 'Nervous System', 'title_arabic': 'الجهاز العصبي', 'title_french': 'Système nerveux'},
            {'order': 4, 'title': 'Muscular System', 'title_arabic': 'الجهاز العضلي', 'title_french': 'Système musculaire'},
            {'order': 5, 'title': 'Blood Circulation', 'title_arabic': 'الدوران الدموي', 'title_french': 'Circulation sanguine'},
            {'order': 6, 'title': 'Respiration', 'title_arabic': 'التنفس', 'title_french': 'Respiration'},
            {'order': 7, 'title': 'Blood and Circulatory System', 'title_arabic': 'الدم والجهاز الدوراني', 'title_french': 'Sang et système circulatoire'},
            {'order': 8, 'title': 'Human Respiration', 'title_arabic': 'التنفس عند الإنسان', 'title_french': 'Respiration humaine'},
        ]

        # Second Cycle - 8 lessons (Health, Immunity and Microbiology)
        lessons_s2 = [
            {'order': 1, 'title': 'Nutritional Education', 'title_arabic': 'التربية الغذائية', 'title_french': 'Éducation nutritionnelle'},
            {'order': 2, 'title': 'Body Health', 'title_arabic': 'صحة الجسم', 'title_french': 'Santé du corps'},
            {'order': 3, 'title': 'Immunology', 'title_arabic': 'علم المناعة', 'title_french': 'Immunologie'},
            {'order': 4, 'title': 'Bacteria', 'title_arabic': 'الجراثيم', 'title_french': 'Bactéries'},
            {'order': 5, 'title': 'Methods to Support Immune Response', 'title_arabic': 'طرق تدعيم الاستجابة المناعتية', 'title_french': 'Méthodes de soutien de la réponse immunitaire'},
            {'order': 6, 'title': 'Immune System Disorders', 'title_arabic': 'اضطرابات الجهاز المناعتي', 'title_french': 'Troubles du système immunitaire'},
            {'order': 7, 'title': 'Blood Transfusion and Related Problems', 'title_arabic': 'التحاقن الدموي وبعض المشاكل التي يطرحها', 'title_french': 'Transfusion sanguine et problèmes associés'},
            {'order': 8, 'title': 'Microscopic Organisms (Bacteria)', 'title_arabic': 'المتعضيات المجهرية (الجراثيم)', 'title_french': 'Organismes microscopiques (bactéries)'},
        ]

        try:
            subject = Subject.objects.get(code='BIOL101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code BIOL101 not found. Please ensure it exists.')
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
            self.stdout.write('Deleting existing 3AC Science lessons for Normal track...')
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

        self.stdout.write('Creating 3AC Science lessons for Normal track...')
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
                    'description': f"Science - {lesson_data['title_arabic']}",
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
                    'description': f"Science - {lesson_data['title_arabic']}",
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Science lessons for 3AC Normal track.'
            )
        )