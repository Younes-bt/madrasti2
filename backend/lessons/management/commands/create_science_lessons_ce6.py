from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create Scientific Activities lessons for CE6 (Cours Élémentaire 6)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CE6 Scientific Activities lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - First half of lessons (1-4)
        lessons_s1 = [
            {'order': 1, 'title_arabic': 'التربة وسط حي', 'title': 'Soil as a Living Environment'},
            {'order': 2, 'title_arabic': 'الكهرباء', 'title': 'Electricity'},
            {'order': 3, 'title_arabic': 'الدارة الكهربائية', 'title': 'Electric Circuit'},
            {'order': 4, 'title_arabic': 'الضغط الغازي', 'title': 'Gas Pressure'},
        ]

        # Second Cycle - Second half of lessons (5-8)
        lessons_s2 = [
            {'order': 1, 'title_arabic': 'دوران الأرض حول الشمس وتعاقب الفصول', 'title': 'Earth\'s Rotation Around the Sun and Succession of Seasons'},
            {'order': 2, 'title_arabic': 'دوران الأرض', 'title': 'Earth\'s Rotation'},
            {'order': 3, 'title_arabic': 'عوامل حث التربة', 'title': 'Soil Formation Factors'},
            {'order': 4, 'title_arabic': 'مصادر الطاقة', 'title': 'Energy Sources'},
        ]

        try:
            subject = Subject.objects.get(code='SCAC101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code SCAC101 not found. Please ensure it exists.')
            )
            return

        try:
            grade = Grade.objects.get(code='CE6')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "CE6" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing CE6 Scientific Activities lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating CE6 Scientific Activities lessons for this subject...')
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
                    'title_french': lesson_data['title'],
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
                    'title': lesson_data['title'],
                    'title_arabic': lesson_data['title_arabic'],
                    'title_french': lesson_data['title'],
                    'difficulty_level': 'easy',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Scientific Activities lessons for CE6.'
            )
        )