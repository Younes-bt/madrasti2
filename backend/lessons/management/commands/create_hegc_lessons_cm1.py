from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade
import math

class Command(BaseCommand):
    help = 'Create History, Geography, and Civic Education lessons for CM1 (Cours Moyen 1)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CM1 HGEC lessons before creating new ones',
        )

    def handle(self, *args, **options):
        sections = {
            'دروس التاريخ': [
                {'title_arabic': 'تاريخ مدرستي', 'title': 'History of My School'},
                {'title_arabic': 'كيف نحسب الزمن', 'title': 'How We Calculate Time'},
                {'title_arabic': 'السوق بين الأمس واليوم', 'title': 'The Market Between Yesterday and Today'},
                {'title_arabic': 'ألاحظ معالم الحي الذي أسكنه', 'title': 'I Observe the Landmarks of the Neighborhood I Live In'},
                {'title_arabic': 'أبحث عن معلم قريتي', 'title': 'I am Looking for a Teacher from My Village'},
                {'title_arabic': 'كيف نسمي ما قمنا به خلال هذه السنة ؟ خطوات المؤرخ', 'title': 'How Do We Name What We Did This Year? The Historian\'s Steps'},
            ],
            'دروس الجغرافيا': [
                {'title_arabic': 'التعريف الأولي بالجغرافيا وبفائدتها اليومية', 'title': 'Primary Definition of Geography and Its Daily Benefit'},
                {'title_arabic': 'الجغرافي الصغير – كيف يشتغل الجغرافي؟', 'title': 'The Little Geographer - How Does a Geographer Work?'},
                {'title_arabic': 'في الطريق إلى المدرسة – أكتشف محيطي وأرسمه وأضع مفتاحا لرسمي', 'title': 'On the Way to School - I Discover My Surroundings, Draw It, and Create a Key for My Drawing'},
                {'title_arabic': 'أحسب مقياسا انطلاقا من الفصل الدراسي', 'title': 'I Calculate a Scale Based on the Classroom'},
                {'title_arabic': 'أتعلم حساب كثافة انطلاقا من الفصل الدراسي', 'title': 'I Learn to Calculate Density Based on the Classroom'},
                {'title_arabic': 'أتعرف مكونات محيط مدرستي', 'title': 'I Recognize the Components of My School\'s Surroundings'},
                {'title_arabic': 'أتعرف المرافق الكبرى لمدرستي', 'title': 'I Recognize the Main Facilities of My School'},
                {'title_arabic': 'أمثل مرافق مدرستي في شكل رسم باستعمال رموز لها', 'title': 'I Represent My School\'s Facilities in a Drawing Using Symbols'},
                {'title_arabic': 'أرصد ألوان السماء وأتابع نشرة جوية', 'title': 'I Observe the Colors of the Sky and Follow the Weather Forecast'},
                {'title_arabic': 'أبحث في خريطة عن موقع مدينتي – قريتي', 'title': 'I Search on a Map for the Location of My City - My Village'},
            ],
            'دروس التربية على المواطنة': [
                {'title_arabic': 'أعي مخاطر التدخين على الصحة', 'title': 'I am Aware of the Dangers of Smoking on Health'},
                {'title_arabic': 'أقدر الآخر كما هو', 'title': 'I Appreciate Others as They Are'},
                {'title_arabic': 'أحافظ على سلامتي على الطريق', 'title': 'I Maintain My Safety on the Road'},
                {'title_arabic': 'أعي ذاتي كإنسان', 'title': 'I am Aware of Myself as a Human Being'},
                {'title_arabic': 'أحافظ على ذاتي', 'title': 'I Take Care of Myself'},
                {'title_arabic': 'القاعدة والقانون', 'title': 'The Rule and the Law'},
                {'title_arabic': 'كيف أصغي بشكل نشيط وأتواصل', 'title': 'How I Listen Actively and Communicate'},
                {'title_arabic': 'الرغبات والحاجيات والحقوق', 'title': 'Desires, Needs, and Rights'},
                {'title_arabic': 'أهمية العمل الجماعي – كيف أشتغل في مجموعات', 'title': 'The Importance of Teamwork - How I Work in Groups'},
                {'title_arabic': 'كيف أبحث وأنظم المعطيات', 'title': 'How I Search for and Organize Data'},
            ]
        }

        try:
            subject = Subject.objects.get(code='HGEC101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code HGEC101 not found. Please ensure it exists.')
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
        total_created_s1 = 0
        total_created_s2 = 0

        lesson_order_counter = 1

        for section_title, lessons in sections.items():
            num_lessons = len(lessons)
            s1_count = math.ceil(num_lessons / 2.0)
            s1_lessons = lessons[:s1_count]
            s2_lessons = lessons[s1_count:]

            for lesson_data in s1_lessons:
                lesson, created = Lesson.objects.get_or_create(
                    subject=subject,
                    grade=grade,
                    cycle='first',
                    order=lesson_order_counter,
                    defaults={
                        'title': f"{section_title} - {lesson_data['title']}",
                        'title_arabic': f"{section_title} - {lesson_data['title_arabic']}",
                        'title_french': f"{section_title} - {lesson_data['title']}",
                        'difficulty_level': 'easy',
                        'is_active': True,
                    }
                )
                if created:
                    total_created_s1 += 1
                lesson_order_counter += 1

            for lesson_data in s2_lessons:
                lesson, created = Lesson.objects.get_or_create(
                    subject=subject,
                    grade=grade,
                    cycle='second',
                    order=lesson_order_counter,
                    defaults={
                        'title': f"{section_title} - {lesson_data['title']}",
                        'title_arabic': f"{section_title} - {lesson_data['title_arabic']}",
                        'title_french': f"{section_title} - {lesson_data['title']}",
                        'difficulty_level': 'easy',
                        'is_active': True,
                    }
                )
                if created:
                    total_created_s2 += 1
                lesson_order_counter += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {total_created_s1} new first term and {total_created_s2} new second term lessons for CM1 HGEC.'
            )
        )
