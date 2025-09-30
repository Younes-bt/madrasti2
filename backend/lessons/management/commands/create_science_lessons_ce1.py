from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create Scientific Activity lessons for CE1 (Cours Élémentaire 1)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CE1 Scientific Activity lessons before creating new ones',
        )

    def handle(self, *args, **options):
        lessons_data = [
            {'order': 1, 'title_arabic': 'الحواس', 'title': 'The Senses'},
            {'order': 2, 'title_arabic': 'الصوت', 'title': 'Sound'},
            {'order': 3, 'title_arabic': 'الهضم', 'title': 'Digestion'},
            {'order': 4, 'title_arabic': 'الحركة – مفاصل جسم الإنسان', 'title': 'Movement - Human Body Joints'},
            {'order': 5, 'title_arabic': 'النباتات', 'title': 'Plants'},
            {'order': 6, 'title_arabic': 'حالات المادة', 'title': 'States of Matter'},
            {'order': 7, 'title_arabic': 'الزمن', 'title': 'Time'},
            {'order': 8, 'title_arabic': 'الحركة – حركات التنقل عند الحيوانات', 'title': 'Movement - Animal Locomotion'},
        ]

        lessons_s1 = lessons_data[:4]
        lessons_s2 = lessons_data[4:]

        try:
            subject = Subject.objects.get(code='SCAC101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code SCAC101 not found. Please ensure it exists.')
            )
            return

        try:
            grade = Grade.objects.get(code='CE1')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "CE1" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing CE1 lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating CE1 lessons for this subject...')
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
                    'title_french': f"Leçon {lesson_data['order']}",
                    'difficulty_level': 'easy',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1

        created_count_s2 = 0
        for i, lesson_data in enumerate(lessons_s2):
            lesson, created = Lesson.objects.get_or_create(
                subject=subject,
                grade=grade,
                cycle='second',
                order=i + 1,
                defaults={
                    'title': lesson_data['title'],
                    'title_arabic': lesson_data['title_arabic'],
                    'title_french': f"Leçon {i + 1}",
                    'difficulty_level': 'easy',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term lessons for CE1.'
            )
        )
