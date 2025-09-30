from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create Mathematics lessons for CM2 (Cours Moyen 2)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CM2 Mathematics lessons before creating new ones',
        )

    def handle(self, *args, **options):
        lessons_s1 = [
            {'order': 1, 'title_arabic': 'الأعداد الصحيحة الطبيعية (الملايين والملايير)', 'title': 'Natural Whole Numbers (Millions and Billions)'},
            {'order': 2, 'title_arabic': 'الأعداد الصحيحة الطبيعية (الملايين والملايير) – تقديم وكتابة وتفكيك', 'title': 'Natural Whole Numbers (Millions and Billions) - Introduction, Writing and Decomposition'},
            {'order': 3, 'title_arabic': 'الأعداد الصحيحة الطبيعية (الملايين والملايير) – مقارنة وترتيب وتأطير', 'title': 'Natural Whole Numbers (Millions and Billions) - Comparison, Ordering and Framing'},
            {'order': 4, 'title_arabic': 'الزوايا', 'title': 'Angles'},
            {'order': 5, 'title_arabic': 'الأعداد الصحيحة الطبيعية', 'title': 'Natural Whole Numbers'},
            {'order': 6, 'title_arabic': 'الأعداد الصحيحة الطبيعية – مجموع وجداء وفرق', 'title': 'Natural Whole Numbers - Sum, Product and Difference'},
            {'order': 7, 'title_arabic': 'الأعداد الصحيحة الطبيعية – الخارج الصحيح والباقي', 'title': 'Natural Whole Numbers - Integer Quotient and Remainder'},
            {'order': 8, 'title_arabic': 'التوازي والتعامد', 'title': 'Parallelism and Perpendicularity'},
            {'order': 9, 'title_arabic': 'المسائل – تنظيم المعلومات', 'title': 'Problems - Organizing Information'},
            {'order': 10, 'title_arabic': 'قياس الزوايا', 'title': 'Measuring Angles'},
            {'order': 11, 'title_arabic': 'المضاعفات والقواسم', 'title': 'Multiples and Divisors'},
            {'order': 12, 'title_arabic': 'الزمان', 'title': 'Time'},
            {'order': 13, 'title_arabic': 'الزمان – المجموع والفرق', 'title': 'Time - Sum and Difference'},
            {'order': 14, 'title_arabic': 'الزمان – الجداء', 'title': 'Time - Product'},
            {'order': 15, 'title_arabic': 'المضلعات', 'title': 'Polygons'},
            {'order': 16, 'title_arabic': 'المضلعات – إنشاءات وتعريف', 'title': 'Polygons - Constructions and Definition'},
            {'order': 17, 'title_arabic': 'المضلعات – زوايا وإنشاءات', 'title': 'Polygons - Angles and Constructions'},
            {'order': 18, 'title_arabic': 'المضلعات – شبه المنحرف', 'title': 'Polygons - Trapezoid'},
            {'order': 19, 'title_arabic': 'الأعداد العشرية', 'title': 'Decimal Numbers'},
            {'order': 20, 'title_arabic': 'الأعداد العشرية – قراءة وكتابة ومقارنة وترتيب وتأطير', 'title': 'Decimal Numbers - Reading, Writing, Comparison, Ordering and Framing'},
            {'order': 21, 'title_arabic': 'الأعداد العشرية – المجموع والفرق', 'title': 'Decimal Numbers - Sum and Difference'},
            {'order': 22, 'title_arabic': 'الأعداد العشرية – الجداء', 'title': 'Decimal Numbers - Product'},
            {'order': 23, 'title_arabic': 'الأعداد العشرية – الخارج', 'title': 'Decimal Numbers - Quotient'},
            {'order': 24, 'title_arabic': 'قياس الأطوال', 'title': 'Measuring Lengths'},
            {'order': 25, 'title_arabic': 'المثلثات – إنشاءات وتصنيف', 'title': 'Triangles - Constructions and Classification'},
        ]

        lessons_s2 = [
            {'order': 1, 'title_arabic': 'الأعداد الكسرية', 'title': 'Fractional Numbers'},
            {'order': 2, 'title_arabic': 'الأعداد الكسرية – تقديم', 'title': 'Fractional Numbers - Introduction'},
            {'order': 3, 'title_arabic': 'الأعداد الكسرية – التساوي', 'title': 'Fractional Numbers - Equality'},
            {'order': 4, 'title_arabic': 'الأعداد الكسرية – توحيد المقامات والمقارنة', 'title': 'Fractional Numbers - Unifying Denominators and Comparison'},
            {'order': 5, 'title_arabic': 'الأعداد الكسرية – المجموع والفرق', 'title': 'Fractional Numbers - Sum and Difference'},
            {'order': 6, 'title_arabic': 'الأعداد الكسرية – الجداء', 'title': 'Fractional Numbers - Product'},
            {'order': 7, 'title_arabic': 'التناسبية', 'title': 'Proportionality'},
            {'order': 8, 'title_arabic': 'التناسبية – جداول وتمثيلات', 'title': 'Proportionality - Tables and Representations'},
            {'order': 9, 'title_arabic': 'التناسبية – النسبة المئوية', 'title': 'Proportionality - Percentage'},
            {'order': 10, 'title_arabic': 'التناسبية – السرعة المتوسطة', 'title': 'Proportionality - Average Speed'},
            {'order': 11, 'title_arabic': 'التناسبية – سلم التصاميم والخرائط', 'title': 'Proportionality - Scale of Designs and Maps'},
            {'order': 12, 'title_arabic': 'الدائرة والقرص', 'title': 'Circle and Disk'},
            {'order': 13, 'title_arabic': 'حساب المحيطات', 'title': 'Calculating Perimeters'},
            {'order': 14, 'title_arabic': 'وحدات قياس الكتل', 'title': 'Mass Measurement Units'},
            {'order': 15, 'title_arabic': 'التماثل المحوري', 'title': 'Axial Symmetry'},
            {'order': 16, 'title_arabic': 'وحدات قياس المساحات', 'title': 'Area Measurement Units'},
            {'order': 17, 'title_arabic': 'حساب مساحات المضلعات الإعتيادية', 'title': 'Calculating Areas of Regular Polygons'},
            {'order': 18, 'title_arabic': 'محيط الدائرة ومساحة القرص', 'title': 'Circle Circumference and Disk Area'},
            {'order': 19, 'title_arabic': 'وحدات قياس السعة', 'title': 'Capacity Measurement Units'},
            {'order': 20, 'title_arabic': 'حل المسائل', 'title': 'Problem Solving'},
            {'order': 21, 'title_arabic': 'تحويل الأشكال – الإزاحة والتكبير والتصغير', 'title': 'Shape Transformations - Translation, Enlargement and Reduction'},
            {'order': 22, 'title_arabic': 'المكعب ومتوازي المستطيلات – المساحة الجانبية والكلية', 'title': 'Cube and Cuboid - Lateral and Total Surface Area'},
            {'order': 23, 'title_arabic': 'الموشور القائم والأسطوانة القائمة – المساحة الجانبية والكلية', 'title': 'Right Prism and Right Cylinder - Lateral and Total Surface Area'},
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
                    'difficulty_level': 'medium',
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
                    'difficulty_level': 'medium',
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