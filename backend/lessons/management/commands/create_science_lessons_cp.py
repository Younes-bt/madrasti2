from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create Scientific Activity lessons for CP (Cours Préparatoire)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CP Scientific Activity lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # Scientific Activity lessons data for CP
        lessons_data = [
            {'order': 1, 'title_arabic': 'الزمان', 'title': 'Time'},
            {'order': 2, 'title_arabic': 'الماء', 'title': 'Water'},
            {'order': 3, 'title_arabic': 'الضوء و الظل', 'title': 'Light and Shadow'},
            {'order': 4, 'title_arabic': 'انواع الاجسام', 'title': 'Types of Objects'},
            {'order': 5, 'title_arabic': 'التغدية عند الانسان', 'title': 'Nutrition in Humans'},
            {'order': 6, 'title_arabic': 'التغدية عند الحيوانات', 'title': 'Nutrition in Animals'},
            {'order': 7, 'title_arabic': 'التنفس', 'title': 'Breathing'},
            {'order': 8, 'title_arabic': 'التوالد عند الحيوانات', 'title': 'Reproduction in Animals'},
            {'order': 9, 'title_arabic': 'الحواس', 'title': 'The Senses'},
            {'order': 10, 'title_arabic': 'الحركات', 'title': 'Movements'},
            {'order': 11, 'title_arabic': 'الطبيعة عبر الفصول', 'title': 'Nature through the Seasons'},
        ]

        lessons_s1 = lessons_data[:6]
        lessons_s2 = lessons_data[6:]

        try:
            subject = Subject.objects.get(code='SCAC101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code SCAC101 not found. Please ensure it exists.')
            )
            return

        try:
            grade = Grade.objects.get(code='CP')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "CP" not found. Please create it first.')
            )
            return
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error finding grade: {e}')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing CP lessons for this subject...')
            deleted_count_s1 = Lesson.objects.filter(
                subject=subject,
                grade=grade,
                cycle='first'
            ).delete()[0]
            deleted_count_s2 = Lesson.objects.filter(
                subject=subject,
                grade=grade,
                cycle='second'
            ).delete()[0]
            self.stdout.write(
                self.style.WARNING(f'Deleted {deleted_count_s1} first term and {deleted_count_s2} second term existing lessons.')
            )

        self.stdout.write('Creating CP lessons for this subject...')

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
        # Adjust order for second cycle
        for i, lesson_data in enumerate(lessons_s2):
            lesson, created = Lesson.objects.get_or_create(
                subject=subject,
                grade=grade,
                cycle='second',
                order=i + 1, # Start order from 1 for the second cycle
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term lessons for CP.'
            )
        )
