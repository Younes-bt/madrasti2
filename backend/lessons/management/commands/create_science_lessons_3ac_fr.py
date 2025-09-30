from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Science lessons for 3AC French track (Troisième Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 3AC Science lessons for French track before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 5 lessons (Human Body Systems)
        lessons_s1 = [
            {'order': 1, 'title': 'Food Digestion and Intestinal Absorption', 'title_arabic': 'هضم الطعام والامتصاص المعوي', 'title_french': 'La digestion des aliments et l\'absorption intestinale'},
            {'order': 2, 'title': 'Nutritional Education and Digestive System Hygiene', 'title_arabic': 'التربية الغذائية وصحة الجهاز الهضمي', 'title_french': 'Éducation nutritionnelle et hygiène de l\'appareil digestif'},
            {'order': 3, 'title': 'Human Respiration', 'title_arabic': 'التنفس عند الإنسان', 'title_french': 'La respiration chez l\'Homme'},
            {'order': 4, 'title': 'Blood and Blood Circulation in Humans', 'title_arabic': 'الدم والدورة الدموية عند الإنسان', 'title_french': 'Le sang et la circulation sanguine chez l\'Homme'},
            {'order': 5, 'title': 'Urinary Excretion in Humans', 'title_arabic': 'الإخراج البولي عند الإنسان', 'title_french': 'L\'excrétion urinaire chez l\'Homme'},
        ]

        # Second Cycle - 5 lessons (Nervous System and Immunity)
        lessons_s2 = [
            {'order': 1, 'title': 'Nervous System', 'title_arabic': 'الجهاز العصبي', 'title_french': 'Le système nerveux'},
            {'order': 2, 'title': 'Muscular System', 'title_arabic': 'الجهاز العضلي', 'title_french': 'Le système musculaire'},
            {'order': 3, 'title': 'Microbes', 'title_arabic': 'الميكروبات', 'title_french': 'Les microbes'},
            {'order': 4, 'title': 'Immune System', 'title_arabic': 'جهاز المناعة', 'title_french': 'Le système immunitaire'},
            {'order': 5, 'title': 'Immune System Dysfunction and Immunity Problems', 'title_arabic': 'خلل جهاز المناعة ومشاكل المناعة', 'title_french': 'Dysfonctionnement du système immunitaire et problèmes d\'immunité'},
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
            track_frn = Track.objects.get(code='3AC-FRN')
            self.stdout.write(f'Found FRN track: {track_frn.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "3AC-FRN" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 3AC Science lessons for French track...')
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

        self.stdout.write('Creating/updating 3AC Science lessons for French track...')
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
                    'description': f"Science - {lesson_data['title_french']}",
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
                    'description': f"Science - {lesson_data['title_french']}",
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Science lessons. '
                f'Updated {updated_count_s1} first term and {updated_count_s2} second term existing lessons for 3AC French track.'
            )
        )