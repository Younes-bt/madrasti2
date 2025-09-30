from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Math lessons for TC Literature tracks (Tronc Commun)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing TC Math lessons for Literature tracks before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 3 lessons
        lessons_s1 = [
            {'order': 1, 'title': 'Operations in R and their Properties', 'title_arabic': 'العمليات في R وخاصياتها', 'title_french': 'Opérations dans R et leurs propriétés'},
            {'order': 2, 'title': 'Order in R and its Properties', 'title_arabic': 'الترتيب في R وخاصياته', 'title_french': 'Ordre dans R et ses propriétés'},
            {'order': 3, 'title': 'Equations, Inequalities and Systems', 'title_arabic': 'المعادلات المتراجحات والنظمات', 'title_french': 'Équations, inéquations et systèmes'},
        ]

        # Second Cycle - 4 lessons
        lessons_s2 = [
            {'order': 1, 'title': 'Statistics', 'title_arabic': 'الإحصاء', 'title_french': 'Statistiques'},
            {'order': 2, 'title': 'Coordinate System in the Plane', 'title_arabic': 'المعلم في المستوى', 'title_french': 'Repère dans le plan'},
            {'order': 3, 'title': 'Straight Line in the Plane', 'title_arabic': 'المستقيم في المستوى', 'title_french': 'Droite dans le plan'},
            {'order': 4, 'title': 'Numerical Functions', 'title_arabic': 'الدوال العددية', 'title_french': 'Fonctions numériques'},
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

        # Get Literature tracks
        track_codes = ['TCLH', 'TCEO']
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
            self.stdout.write('Deleting existing TC Math lessons for Literature tracks...')
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
            self.stdout.write(self.style.WARNING('Removed existing lessons for Literature tracks.'))

        self.stdout.write('Creating TC Math lessons for Literature tracks...')
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
            # Add Literature tracks to the lesson
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
            # Add Literature tracks to the lesson
            lesson.tracks.add(*tracks)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Math lessons for TC Literature tracks.'
            )
        )