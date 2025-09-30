from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create Mathematics lessons for CM1 (Cours Moyen 1)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CM1 Mathematics lessons before creating new ones',
        )

    def handle(self, *args, **options):
        lessons_s1 = [
            {'order': 1, 'title_arabic': 'الأعداد من 0 إلى 9999', 'title': 'Numbers from 0 to 9999'},
            {'order': 2, 'title_arabic': 'إنشاءات هندسية', 'title': 'Geometric Constructions'},
            {'order': 3, 'title_arabic': 'الأعداد من 0 إلى 99999', 'title': 'Numbers from 0 to 99999'},
            {'order': 4, 'title_arabic': 'معلمة الخانة والعقدة', 'title': 'Node and Grid Coordinates'},
            {'order': 5, 'title_arabic': 'جمع الأعداد الصحيحة الطبيعية', 'title': 'Addition of Natural Numbers'},
            {'order': 6, 'title_arabic': 'الزمان – اليومية', 'title': 'Time - The Calendar'},
            {'order': 7, 'title_arabic': 'طرح الأعداد الصحيحة الطبيعية', 'title': 'Subtraction of Natural Numbers'},
            {'order': 8, 'title_arabic': 'التعامد والتوازي', 'title': 'Perpendicularity and Parallelism'},
            {'order': 9, 'title_arabic': 'الزمان – الساعة', 'title': 'Time - The Clock'},
            {'order': 10, 'title_arabic': 'الأعداد من 0 إلى 999999', 'title': 'Numbers from 0 to 999999'},
            {'order': 11, 'title_arabic': 'ضرب الأعداد الصحيحة الطبيعية', 'title': 'Multiplication of Natural Numbers'},
            {'order': 12, 'title_arabic': 'قياس الأطوال', 'title': 'Measuring Lengths'},
            {'order': 13, 'title_arabic': 'القسمة', 'title': 'Division'},
            {'order': 14, 'title_arabic': 'الموشور والهرم', 'title': 'The Prism and the Pyramid'},
            {'order': 15, 'title_arabic': 'المضلعات', 'title': 'Polygons'},
        ]

        lessons_s2 = [
            {'order': 1, 'title_arabic': 'المضلعات الرباعية', 'title': 'Quadrilaterals'},
            {'order': 2, 'title_arabic': 'الكسور العشرية', 'title': 'Decimal Fractions'},
            {'order': 3, 'title_arabic': 'قياس الكتل', 'title': 'Measuring Masses'},
            {'order': 4, 'title_arabic': 'الأعداد العشرية', 'title': 'Decimal Numbers'},
            {'order': 5, 'title_arabic': 'المثلثات', 'title': 'Triangles'},
            {'order': 6, 'title_arabic': 'التماثل المحوري', 'title': 'Axial Symmetry'},
            {'order': 7, 'title_arabic': 'جمع الأعداد العشرية', 'title': 'Addition of Decimal Numbers'},
            {'order': 8, 'title_arabic': 'ترصيف السطوح وإزاحة الأشكال', 'title': 'Tessellation and Translation of Shapes'},
            {'order': 9, 'title_arabic': 'طرح الأعداد العشرية', 'title': 'Subtraction of Decimal Numbers'},
            {'order': 10, 'title_arabic': 'قياس المساحات', 'title': 'Measuring Areas'},
            {'order': 11, 'title_arabic': 'ضرب عدد صحيح في عدد عشري', 'title': 'Multiplying an Integer by a Decimal'},
            {'order': 12, 'title_arabic': 'التناسبية', 'title': 'Proportionality'},
            {'order': 13, 'title_arabic': 'قياس السعات', 'title': 'Measuring Capacities'},
            {'order': 14, 'title_arabic': 'تكبير وتصغير الأشكال', 'title': 'Enlarging and Reducing Shapes'},
            {'order': 15, 'title_arabic': 'قراءة التصاميم', 'title': 'Reading Designs'},
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
            grade = Grade.objects.get(code='CM1')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "CM1" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing CM1 lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating CM1 lessons for this subject...')
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term lessons for CM1.'
            )
        )
