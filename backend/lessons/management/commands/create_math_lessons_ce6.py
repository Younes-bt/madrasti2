from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create Mathematics lessons for CE6 (Cours Élémentaire 6)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CE6 Mathematics lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - دروس الدورة الاولى (Lessons 1-18)
        lessons_s1 = [
            {'order': 1, 'title_arabic': 'الأعداد الصحيحة الطبيعية (الملايين والملايير)', 'title': 'Natural Whole Numbers (Millions and Billions)'},
            {'order': 2, 'title_arabic': 'مفاهيم أولية في الهندسة', 'title': 'Basic Concepts in Geometry'},
            {'order': 3, 'title_arabic': 'المحسبة', 'title': 'Calculator'},
            {'order': 4, 'title_arabic': 'الأعداد العشرية', 'title': 'Decimal Numbers'},
            {'order': 5, 'title_arabic': 'الزوايا', 'title': 'Angles'},
            {'order': 6, 'title_arabic': 'جمع وطرح الأعداد الصحيحة الطبيعية والعشرية', 'title': 'Addition and Subtraction of Natural and Decimal Numbers'},
            {'order': 7, 'title_arabic': 'التوازي والتعامد', 'title': 'Parallelism and Perpendicularity'},
            {'order': 8, 'title_arabic': 'ضرب الأعداد الصحيحة الطبيعية والعشرية', 'title': 'Multiplication of Natural and Decimal Numbers'},
            {'order': 9, 'title_arabic': 'التماثل المحوري', 'title': 'Axial Symmetry'},
            {'order': 10, 'title_arabic': 'المضاعفات و القواسم و قابلية القسمة على 2 5 3 9', 'title': 'Multiples, Divisors and Divisibility by 2, 5, 3, 9'},
            {'order': 11, 'title_arabic': 'وحدات قياس الأطوال', 'title': 'Length Measurement Units'},
            {'order': 12, 'title_arabic': 'القسمة الإقليدية', 'title': 'Euclidean Division'},
            {'order': 13, 'title_arabic': 'المضلعات الرباعية', 'title': 'Quadrilaterals'},
            {'order': 14, 'title_arabic': 'متوازيات الأضلاع', 'title': 'Parallelograms'},
            {'order': 15, 'title_arabic': 'الخارج العشري المضبوط والمقرب', 'title': 'Exact and Approximate Decimal Quotient'},
            {'order': 16, 'title_arabic': 'الدائرة والقرص', 'title': 'Circle and Disk'},
            {'order': 17, 'title_arabic': 'قياس الكتل', 'title': 'Mass Measurement'},
            {'order': 18, 'title_arabic': 'إنشاءات هندسية', 'title': 'Geometric Constructions'},
        ]

        # Second Cycle - دروس الدورة الثانية (Lessons 19-42)
        lessons_s2 = [
            {'order': 1, 'title_arabic': 'الأعداد الكسرية', 'title': 'Fractional Numbers'},
            {'order': 2, 'title_arabic': 'الأعداد الكسرية – التساوي', 'title': 'Fractional Numbers - Equality'},
            {'order': 3, 'title_arabic': 'الأعداد الكسرية – الاختزال وتوحيد المقامات', 'title': 'Fractional Numbers - Reduction and Common Denominators'},
            {'order': 4, 'title_arabic': 'الأعداد الكسرية – المقارنة والترتيب', 'title': 'Fractional Numbers - Comparison and Ordering'},
            {'order': 5, 'title_arabic': 'الأعداد الكسرية – الجمع والطرح', 'title': 'Fractional Numbers - Addition and Subtraction'},
            {'order': 6, 'title_arabic': 'الأعداد الكسرية – الضرب', 'title': 'Fractional Numbers - Multiplication'},
            {'order': 7, 'title_arabic': 'الأعداد الكسرية – القسمة', 'title': 'Fractional Numbers - Division'},
            {'order': 8, 'title_arabic': 'الأعداد الكسرية – القيم المقربة لعدد كسري غير عشري', 'title': 'Fractional Numbers - Approximate Values of Non-Decimal Fractions'},
            {'order': 9, 'title_arabic': 'المثلثات', 'title': 'Triangles'},
            {'order': 10, 'title_arabic': 'وحدات قياس المساحة', 'title': 'Area Measurement Units'},
            {'order': 11, 'title_arabic': 'حساب المحيطات ومساحات المضلعات', 'title': 'Calculating Perimeters and Areas of Polygons'},
            {'order': 12, 'title_arabic': 'حساب محيط الدائرة ومساحة القرص', 'title': 'Calculating Circle Circumference and Disk Area'},
            {'order': 13, 'title_arabic': 'المساحة الجانبية والكلية', 'title': 'Lateral and Total Surface Area'},
            {'order': 14, 'title_arabic': 'وحدات قياس الحجوم', 'title': 'Volume Measurement Units'},
            {'order': 15, 'title_arabic': 'وحدات قياس الحجوم – المتر المكعب وأجزاؤه', 'title': 'Volume Measurement Units - Cubic Meter and Its Parts'},
            {'order': 16, 'title_arabic': 'وحدات قياس الحجوم – وحدات الحجم ووحدات السعة', 'title': 'Volume Measurement Units - Volume Units and Capacity Units'},
            {'order': 17, 'title_arabic': 'الموشور القائم والأسطوانة القائمة – حساب الحجوم', 'title': 'Right Prism and Right Cylinder - Volume Calculation'},
            {'order': 18, 'title_arabic': 'التناسبية', 'title': 'Proportionality'},
            {'order': 19, 'title_arabic': 'التناسبية – معامل التناسب', 'title': 'Proportionality - Proportionality Coefficient'},
            {'order': 20, 'title_arabic': 'التناسبية – النسبة المئوية', 'title': 'Proportionality - Percentage'},
            {'order': 21, 'title_arabic': 'التناسبية – الرأسمال وسعر الفائدة', 'title': 'Proportionality - Capital and Interest Rate'},
            {'order': 22, 'title_arabic': 'التناسبية – السرعة المتوسطة', 'title': 'Proportionality - Average Speed'},
            {'order': 23, 'title_arabic': 'التناسبية – سلم التصاميم والخرائط', 'title': 'Proportionality - Scale of Designs and Maps'},
            {'order': 24, 'title_arabic': 'التناسبية – الكتلة الحجمية', 'title': 'Proportionality - Density'},
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
            grade = Grade.objects.get(code='CE6')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "CE6" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing CE6 Mathematics lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating CE6 Mathematics lessons for this subject...')
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Mathematics lessons for CE6.'
            )
        )