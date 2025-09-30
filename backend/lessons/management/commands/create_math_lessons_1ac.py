from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Math lessons for 1AC (Première Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 1AC Math lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - First 10 lessons
        lessons_s1 = [
            {'order': 1, 'title': 'Operations on Decimal Numbers', 'title_french': 'Les opérations sur les nombres décimaux'},
            {'order': 2, 'title': 'Numbers in Fractional Form', 'title_french': 'Nombres en écriture fractionnaire'},
            {'order': 3, 'title': 'Angles', 'title_french': 'Les angles'},
            {'order': 4, 'title': 'Triangle', 'title_french': 'Le triangle'},
            {'order': 5, 'title': 'Perpendicular Bisector and Triangle Inequality', 'title_french': 'Médiatrice d\'un segment et inégalité triangulaire'},
            {'order': 6, 'title': 'Notable Lines of a Triangle', 'title_french': 'Droites remarquables d\'un triangle'},
            {'order': 7, 'title': 'Relative Numbers', 'title_french': 'Les nombres relatifs'},
            {'order': 8, 'title': 'Powers', 'title_french': 'Les puissances'},
            {'order': 9, 'title': 'Development and Factorization', 'title_french': 'Développement et factorisation'},
            {'order': 10, 'title': 'Equations', 'title_french': 'Équations'},
        ]

        # Second Cycle - Remaining 9 lessons
        lessons_s2 = [
            {'order': 1, 'title': 'Central Symmetry', 'title_french': 'Symétrie centrale'},
            {'order': 2, 'title': 'Parallelogram', 'title_french': 'Le parallélogramme'},
            {'order': 3, 'title': 'Particular Quadrilaterals', 'title_french': 'Quadrilatères particuliers'},
            {'order': 4, 'title': 'Proportionality', 'title_french': 'La proportionnalité'},
            {'order': 5, 'title': 'Circle', 'title_french': 'Le cercle'},
            {'order': 6, 'title': 'Statistics', 'title_french': 'Statistiques'},
            {'order': 7, 'title': 'Prisms and Cylinders', 'title_french': 'Prismes et cylindres'},
            {'order': 8, 'title': 'Graduated Line and Positioning in the Plane', 'title_french': 'Droite graduée et repérage dans le plan'},
            {'order': 9, 'title': 'Areas and Perimeters', 'title_french': 'Aires et périmètres'},
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
            track = Track.objects.get(code='1AC-FRN')
            self.stdout.write(f'Found track: {track.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "1AC-FRN" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 1AC Math lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating 1AC Math lessons for this subject...')
        created_count_s1 = 0
        for lesson_data in lessons_s1:
            lesson, created = Lesson.objects.get_or_create(
                subject=subject,
                grade=grade,
                cycle='first',
                order=lesson_data['order'],
                defaults={
                    'title': lesson_data['title'],
                    'title_arabic': lesson_data['title'],
                    'title_french': lesson_data['title_french'],
                    'description': f"Math - {lesson_data['title_french']}",
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
                    'title_arabic': lesson_data['title'],
                    'title_french': lesson_data['title_french'],
                    'description': f"Math - {lesson_data['title_french']}",
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Math lessons for 1AC.'
            )
        )