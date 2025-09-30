from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create French lessons for CE2 (Cours Élémentaire 2)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CE2 French lessons before creating new ones',
        )

    def handle(self, *args, **options):
        lessons_s1 = [
            # Période 1
            {'order': 1, 'title_french': 'a - A'},
            {'order': 2, 'title_french': 'o - O'},
            {'order': 3, 'title_french': 'i - I'},
            {'order': 4, 'title_french': 'm - M'},
            {'order': 5, 'title_french': 'e - E'},
            {'order': 6, 'title_french': 'n - N'},
            {'order': 7, 'title_french': 'r - R'},
            {'order': 8, 'title_french': 'l - L'},
            {'order': 9, 'title_french': 'u - U'},
            {'order': 10, 'title_french': 'é - er - es - ez - et'},
            {'order': 11, 'title_french': 'b - B'},
            {'order': 12, 'title_french': 'p - P'},
            # Période 2
            {'order': 13, 'title_french': 'd - D'},
            {'order': 14, 'title_french': 't - T'},
            {'order': 15, 'title_french': 'v - V'},
            {'order': 16, 'title_french': 'é - è'},
            {'order': 17, 'title_french': 's - ss'},
            {'order': 18, 'title_french': 'f - F'},
            {'order': 19, 'title_french': 'c - k'},
            {'order': 20, 'title_french': 'au - eau'},
            {'order': 21, 'title_french': 'ch - CH'},
            {'order': 22, 'title_french': 'on - om'},
            {'order': 23, 'title_french': 'ou - OU'},
            {'order': 24, 'title_french': 'oua - OUA'},
        ]

        lessons_s2 = [
            # Période 3
            {'order': 1, 'title_french': 'ce - ci - ç'},
            {'order': 2, 'title_french': 'ette - esse - elle'},
            {'order': 3, 'title_french': 'g - G'},
            {'order': 4, 'title_french': 'en - em - an'},
            {'order': 5, 'title_french': 'q - k'},
            {'order': 6, 'title_french': 'br - cr - dr - tr'},
            {'order': 7, 'title_french': 'ph - f'},
            {'order': 8, 'title_french': 'j - J'},
            {'order': 9, 'title_french': 'ai - ei'},
            {'order': 10, 'title_french': 'in - im - un - um'},
            {'order': 11, 'title_french': 'ge - gi'},
            {'order': 12, 'title_french': 'bl - cl - fl - pl'},
            # Période 4
            {'order': 13, 'title_french': 'gn - GN'},
            {'order': 14, 'title_french': 'ier - ieu - ien'},
            {'order': 15, 'title_french': 'ion - tion'},
            {'order': 16, 'title_french': 'ill - illon'},
            {'order': 17, 'title_french': 'x - z'},
            {'order': 18, 'title_french': 'ail - aille'},
            {'order': 19, 'title_french': 'y - w'},
            {'order': 20, 'title_french': 'auil - euill - ouill'},
            # Récitations
            {'order': 21, 'title_french': 'La comptine des voyelles'},
            {'order': 22, 'title_french': 'A l\'école de la forêt-on récite l\'alphabet'},
            {'order': 23, 'title_french': 'Sur la mousse'},
            {'order': 24, 'title_french': 'Les crayons de couleurs'},
            {'order': 25, 'title_french': 'Bonjour-bonsoir'},
            {'order': 26, 'title_french': 'Un- deux- trois'},
            {'order': 27, 'title_french': '...A petits pas'},
        ]

        try:
            subject = Subject.objects.get(code='FREN101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code FREN101 not found. Please ensure it exists.')
            )
            return

        try:
            grade = Grade.objects.get(code='CE2')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "CE2" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing CE2 lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating CE2 lessons for this subject...')
        created_count_s1 = 0
        for lesson_data in lessons_s1:
            lesson, created = Lesson.objects.get_or_create(
                subject=subject,
                grade=grade,
                cycle='first',
                order=lesson_data['order'],
                defaults={
                    'title': lesson_data['title_french'],
                    'title_arabic': lesson_data.get('title_arabic', ''),
                    'title_french': lesson_data['title_french'],
                    'difficulty_level': 'easy',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1

        created_count_s2 = 0
        for lesson_data in lessons_s2:
            lesson, created = Lesson.objects.get_or_create(
                subject=subject,
                grade=grade,
                cycle='second',
                order=lesson_data['order'],
                defaults={
                    'title': lesson_data['title_french'],
                    'title_arabic': lesson_data.get('title_arabic', ''),
                    'title_french': lesson_data['title_french'],
                    'difficulty_level': 'easy',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term lessons for CE2.'
            )
        )
