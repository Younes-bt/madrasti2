from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create Mathematics lessons for CE2 (Cours Élémentaire 2)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CE2 Mathematics lessons before creating new ones',
        )

    def handle(self, *args, **options):
        lessons_s1 = [
            {'order': 1, 'title_arabic': 'الأعداد من 0 إلى 999', 'title': 'Numbers from 0 to 999'},
            {'order': 2, 'title_arabic': 'المستقيم والقطعة', 'title': 'The Line and the Segment'},
            {'order': 3, 'title_arabic': 'الأعداد من 0 إلى 9999', 'title': 'Numbers from 0 to 9999'},
            {'order': 4, 'title_arabic': 'الجمع - المجموع', 'title': 'Addition - The Sum'},
            {'order': 5, 'title_arabic': 'نقل الأشكال', 'title': 'Transforming Shapes'},
            {'order': 6, 'title_arabic': 'الزاوية القائمة والتعامد', 'title': 'The Right Angle and Perpendicularity'},
            {'order': 7, 'title_arabic': 'النقود', 'title': 'Money'},
            {'order': 8, 'title_arabic': 'تقنية الجمع', 'title': 'Addition Technique'},
            {'order': 9, 'title_arabic': 'قراءة الساعة', 'title': 'Reading the Clock'},
            {'order': 10, 'title_arabic': 'قياس الأطوال', 'title': 'Measuring Lengths'},
            {'order': 11, 'title_arabic': 'قراءة اليومية', 'title': 'Reading the Calendar'},
            {'order': 12, 'title_arabic': 'مفهوم الطرح', 'title': 'The Concept of Subtraction'},
            {'order': 13, 'title_arabic': 'التماثل المحوري', 'title': 'Axial Symmetry'},
            {'order': 14, 'title_arabic': 'تقنية الطرح', 'title': 'Subtraction Technique'},
            {'order': 15, 'title_arabic': 'وضع وإنجاز عملية الطرح', 'title': 'Setting up and Performing Subtraction'},
        ]

        lessons_s2 = [
            {'order': 1, 'title_arabic': 'متوازي المستطيلات والمكعب', 'title': 'The Cuboid and the Cube'},
            {'order': 2, 'title_arabic': 'تقنية الطرح', 'title': 'Subtraction Technique'},
            {'order': 3, 'title_arabic': 'الجمع والطرح', 'title': 'Addition and Subtraction'},
            {'order': 4, 'title_arabic': 'متوازي المستطيلات والمكعب', 'title': 'The Cuboid and the Cube'},
            {'order': 5, 'title_arabic': 'الضرب', 'title': 'Multiplication'},
            {'order': 6, 'title_arabic': 'التماثل المحوري', 'title': 'Axial Symmetry'},
            {'order': 7, 'title_arabic': 'المربع والمستطيل', 'title': 'The Square and the Rectangle'},
            {'order': 8, 'title_arabic': 'مضاعفات عدد', 'title': 'Multiples of a Number'},
            {'order': 9, 'title_arabic': 'المثلثات', 'title': 'Triangles'},
            {'order': 10, 'title_arabic': 'جدول الضرب', 'title': 'Multiplication Table'},
            {'order': 11, 'title_arabic': 'قياس الكتل', 'title': 'Measuring Masses'},
            {'order': 12, 'title_arabic': 'تقنية الضرب', 'title': 'Multiplication Technique'},
            {'order': 13, 'title_arabic': 'الدائرة والقرص', 'title': 'The Circle and the Disk'},
            {'order': 14, 'title_arabic': 'الإزاحة', 'title': 'Translation'},
            {'order': 15, 'title_arabic': 'القسمة', 'title': 'Division'},
            {'order': 16, 'title_arabic': 'تكبير وتصغير الأشكال', 'title': 'Enlarging and Reducing Shapes'},
            {'order': 17, 'title_arabic': 'الترصيف', 'title': 'Tessellation'},
            {'order': 18, 'title_arabic': 'تقريب مفهوم المساحة', 'title': 'Approximating the Concept of Area'},
            {'order': 19, 'title_arabic': 'قياس السعات', 'title': 'Measuring Capacities'},
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
        for lesson_data in lessons_s2:
            lesson, created = Lesson.objects.get_or_create(
                subject=subject,
                grade=grade,
                cycle='second',
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
                created_count_s2 += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term lessons for CE2.'
            )
        )
