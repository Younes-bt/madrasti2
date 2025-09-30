from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create Scientific Activity lessons for CM2 (Cours Moyen 2)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CM2 Scientific Activity lessons before creating new ones',
        )

    def handle(self, *args, **options):
        lessons_data = [
            {'order': 1, 'title_arabic': 'الذوبان والخلائط', 'title': 'Dissolving and Mixtures'},
            {'order': 2, 'title_arabic': 'التكاثر عند الحيوانات', 'title': 'Reproduction in Animals'},
            {'order': 3, 'title_arabic': 'الطبيعة', 'title': 'Nature'},
            {'order': 4, 'title_arabic': 'الضوء', 'title': 'Light'},
            {'order': 5, 'title_arabic': 'التوازن', 'title': 'Balance'},
            {'order': 6, 'title_arabic': 'الحركة', 'title': 'Movement'},
            {'order': 7, 'title_arabic': 'التغذية', 'title': 'Nutrition'},
            {'order': 8, 'title_arabic': 'تحليل وتركيب الضوء', 'title': 'Analysis and Synthesis of Light'},
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
            grade = Grade.objects.get(code='CM2')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "CM2" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing CM2 lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating CM2 lessons for this subject...')
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term lessons for CM2.'
            )
        )
