from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Physics lessons for 1AC (Première Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 1AC Physics lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - First 8 lessons (Matter and Water)
        lessons_s1 = [
            {'order': 1, 'title': 'Water in Our Environment', 'title_french': 'L\'eau dans notre environnement'},
            {'order': 2, 'title': 'Physical States of Matter', 'title_french': 'Les états physiques de la matière'},
            {'order': 3, 'title': 'Mass and Volume - Density', 'title_french': 'La masse et le volume – La masse volumique'},
            {'order': 4, 'title': 'Pressure and Atmospheric Pressure', 'title_french': 'La pression et la pression atmosphérique'},
            {'order': 5, 'title': 'Particle Model of Matter', 'title_french': 'Le modèle particulaire de la matière'},
            {'order': 6, 'title': 'Heat and Physical State Changes of Matter', 'title_french': 'La chaleur et les changements d\'état physique de la matière'},
            {'order': 7, 'title': 'Mixtures - Dissolution - Separation - Pure Substances', 'title_french': 'Les mélanges – La dissolution dans l\'eau – La séparation des constituants d\'un mélange – Le corps pur et ses caractéristiques'},
            {'order': 8, 'title': 'Water Treatment', 'title_french': 'Le traitement des eaux'},
        ]

        # Second Cycle - Last 8 lessons (Electricity)
        lessons_s2 = [
            {'order': 1, 'title': 'Electricity Around Us', 'title_french': 'L\'électricité qui nous entoure'},
            {'order': 2, 'title': 'Simple Electric Circuit', 'title_french': 'Le circuit électrique simple'},
            {'order': 3, 'title': 'Conductors and Insulators', 'title_french': 'Les conducteurs et les isolants'},
            {'order': 4, 'title': 'Series and Parallel Circuits', 'title_french': 'Montage en série et montage en parallèle'},
            {'order': 5, 'title': 'Direct Electric Current', 'title_french': 'Le courant électrique continu'},
            {'order': 6, 'title': 'Node Law - Voltage Additivity Law', 'title_french': 'Loi des noeuds – Loi d\'additivité des tensions'},
            {'order': 7, 'title': 'Electrical Resistance', 'title_french': 'La résistance électrique'},
            {'order': 8, 'title': 'Prevention of Electrical Current Dangers', 'title_french': 'Prévention des dangers du courant électrique'},
        ]

        try:
            subject = Subject.objects.get(code='PHYS101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code PHYS101 not found. Please ensure it exists.')
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
            self.stdout.write('Deleting existing 1AC Physics lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating 1AC Physics lessons for this subject...')
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
                    'description': f"Physics - {lesson_data['title_french']}",
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
                    'description': f"Physics - {lesson_data['title_french']}",
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Physics lessons for 1AC.'
            )
        )