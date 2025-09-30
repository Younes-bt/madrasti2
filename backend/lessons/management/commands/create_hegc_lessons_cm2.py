from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create History, Geography and Civic Education lessons for CM2 (Cours Moyen 2)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CM2 HGEC lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - First half of each section
        lessons_s1 = [
            # دروس التاريخ (History) - 6 lessons
            {'order': 1, 'title_arabic': 'حياتنا بين الأمس واليوم: السكن واللباس', 'title': 'Our Life Between Yesterday and Today: Housing and Clothing', 'category': 'History'},
            {'order': 2, 'title_arabic': 'حياتنا بين الأمس واليوم: المواصلات', 'title': 'Our Life Between Yesterday and Today: Transportation', 'category': 'History'},
            {'order': 3, 'title_arabic': 'حياتنا بين الأمس واليوم: التجارة', 'title': 'Our Life Between Yesterday and Today: Trade', 'category': 'History'},
            {'order': 4, 'title_arabic': 'حياتنا بين الأمس واليوم: التعليم', 'title': 'Our Life Between Yesterday and Today: Education', 'category': 'History'},
            {'order': 5, 'title_arabic': 'ما يشهد على الماضي في مدينتي: كيف أدرس مآثر مدينتي؟', 'title': 'What Witnesses the Past in My City: How Do I Study My City\'s Monuments?', 'category': 'History'},
            {'order': 6, 'title_arabic': 'ما يشهد على الماضي في قريتي: كيف أدرس مآثر قريتي؟', 'title': 'What Witnesses the Past in My Village: How Do I Study My Village\'s Monuments?', 'category': 'History'},

            # دروس الجغرافيا (Geography) - 6 lessons
            {'order': 7, 'title_arabic': 'مبادئ أولية في التعبير الخرائطي', 'title': 'Basic Principles in Cartographic Expression', 'category': 'Geography'},
            {'order': 8, 'title_arabic': 'استعمل مقاييس مختلفة: القسم، الحي…', 'title': 'Using Different Scales: The Classroom, the Neighborhood...', 'category': 'Geography'},
            {'order': 9, 'title_arabic': 'أتعرف معنى الطبوغرافيا، أميز بين السهل والهضبة والجبل', 'title': 'Understanding Topography: Distinguishing Between Plain, Plateau and Mountain', 'category': 'Geography'},
            {'order': 10, 'title_arabic': 'أتعلم قراءة خطوط التسوية', 'title': 'Learning to Read Contour Lines', 'category': 'Geography'},
            {'order': 11, 'title_arabic': 'بعض مكونات المناخ وقياس درجة الحرارة وكمية التساقطات', 'title': 'Some Climate Components and Measuring Temperature and Precipitation', 'category': 'Geography'},
            {'order': 12, 'title_arabic': 'كيف ألاحظ وأصف: أستأنس بعمل الجغرافي', 'title': 'How to Observe and Describe: Getting Familiar with Geographic Work', 'category': 'Geography'},

            # دروس التربیة على المواطنة (Civic Education) - 6 lessons
            {'order': 13, 'title_arabic': 'ما هو الحق؟', 'title': 'What is a Right?', 'category': 'Civic Education'},
            {'order': 14, 'title_arabic': 'ماهو الواجب/المسؤولية؟', 'title': 'What is Duty/Responsibility?', 'category': 'Civic Education'},
            {'order': 15, 'title_arabic': 'ما العلاقة بين حقي وحق الآخر؟', 'title': 'What is the Relationship Between My Right and Others\' Rights?', 'category': 'Civic Education'},
            {'order': 16, 'title_arabic': 'ما العلاقة بين الحق والواجب؟', 'title': 'What is the Relationship Between Right and Duty?', 'category': 'Civic Education'},
            {'order': 17, 'title_arabic': 'الحق في الاختلاف', 'title': 'The Right to Be Different', 'category': 'Civic Education'},
            {'order': 18, 'title_arabic': 'كيف أعد وأقدم ملفا؟ مثال: ترشيد استعمال الماء والكهرباء', 'title': 'How to Prepare and Present a File? Example: Rationalizing Water and Electricity Use', 'category': 'Civic Education'},
        ]

        # Second Cycle - Second half of each section
        lessons_s2 = [
            # دروس التاريخ (History) - 5 lessons
            {'order': 1, 'title_arabic': 'أمثل في جدول زمني أحداثا، شخصيات وأشياء من الحياة اليومية', 'title': 'Representing Events, Figures and Daily Life Objects in a Timeline', 'category': 'History'},
            {'order': 2, 'title_arabic': 'أكتشف ماضيا قريبا بواسطة الشهادة الشفوية', 'title': 'Discovering Recent Past Through Oral Testimony', 'category': 'History'},
            {'order': 3, 'title_arabic': 'أكتشف ماضيا بعيدا بواسطة الوثيقة المكتوبة', 'title': 'Discovering Distant Past Through Written Documents', 'category': 'History'},
            {'order': 4, 'title_arabic': 'أكتشف ماضيا بعيدا جدا: بواسطة الأركيولوجيا واللقي', 'title': 'Discovering Very Distant Past: Through Archaeology and Artifacts', 'category': 'History'},
            {'order': 5, 'title_arabic': 'تكوين ملف حول معلمة موجودة في البيئة المحلية للمتعلم', 'title': 'Creating a File About a Monument in the Student\'s Local Environment', 'category': 'History'},

            # دروس الجغرافيا (Geography) - 6 lessons
            {'order': 6, 'title_arabic': 'وصف مجال ريفي: أتعرف في محيطي نمط استغلال المجال الجغرافي', 'title': 'Describing Rural Area: Understanding Geographic Space Exploitation Patterns', 'category': 'Geography'},
            {'order': 7, 'title_arabic': 'وصف مجال ريفي : أتعرف أنماط توزيع السكان', 'title': 'Describing Rural Area: Understanding Population Distribution Patterns', 'category': 'Geography'},
            {'order': 8, 'title_arabic': 'أتدرب على وصف مجال ريفي: أدرس نماذج من أنشطة السكان', 'title': 'Practicing Rural Area Description: Studying Population Activity Models', 'category': 'Geography'},
            {'order': 9, 'title_arabic': 'أصف شكل الحي، مكوناته، وظائفه وأمثلة على تصميم', 'title': 'Describing Neighborhood Shape, Components, Functions and Design Examples', 'category': 'Geography'},
            {'order': 10, 'title_arabic': 'أتدرب على وصف مجال حضري: أتعرف نماذج من أنشطة السكان', 'title': 'Practicing Urban Area Description: Understanding Population Activity Models', 'category': 'Geography'},
            {'order': 11, 'title_arabic': 'أتدرب على دراسة مشكل في المجال الحضري/الريفي', 'title': 'Practicing the Study of Problems in Urban/Rural Areas', 'category': 'Geography'},

            # دروس التربیة على المواطنة (Civic Education) - 5 lessons
            {'order': 12, 'title_arabic': 'حقوقي وواجباتي في البيت واتجاه أسرتي', 'title': 'My Rights and Duties at Home and Towards My Family', 'category': 'Civic Education'},
            {'order': 13, 'title_arabic': 'كيف نمارس مواطنتنا في المدرسة؟', 'title': 'How Do We Practice Our Citizenship at School?', 'category': 'Civic Education'},
            {'order': 14, 'title_arabic': 'كيف ننجز جريدة المدرسة؟', 'title': 'How Do We Create a School Newspaper?', 'category': 'Civic Education'},
            {'order': 15, 'title_arabic': 'كيف تنتخب مجلس القسم؟', 'title': 'How to Elect a Class Council?', 'category': 'Civic Education'},
            {'order': 16, 'title_arabic': 'من مجلس القسم الى المجلس البلدي/القروي', 'title': 'From Class Council to Municipal/Rural Council', 'category': 'Civic Education'},
        ]

        try:
            subject = Subject.objects.get(code='HGEC101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code HGEC101 not found. Please ensure it exists.')
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
            self.stdout.write('Deleting existing CM2 HGEC lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating CM2 HGEC lessons for this subject...')
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
                    'description': f"{lesson_data['category']} - {lesson_data['title']}",
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
                    'title_french': lesson_data['title'],
                    'description': f"{lesson_data['category']} - {lesson_data['title']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term HGEC lessons for CM2.'
            )
        )