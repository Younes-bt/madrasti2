from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create History, Geography and Civic Education lessons for CE6 (Cours Élémentaire 6)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CE6 HGEC lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - First half of each section
        lessons_s1 = [
            # دروس التاريخ (History) - 5 lessons (first half)
            {'order': 1, 'title_arabic': 'أمثل العصور التاريخية في قطار التاريخ', 'title': 'Representing Historical Eras on the Train of History', 'category': 'History'},
            {'order': 2, 'title_arabic': 'الإنسان البدائي: حياته، مسكنه، أدواته', 'title': 'Primitive Man: His Life, Dwelling, and Tools', 'category': 'History'},
            {'order': 3, 'title_arabic': 'اكتشاف النار وتدجين الحيوانات', 'title': 'Discovery of Fire and Animal Domestication', 'category': 'History'},
            {'order': 4, 'title_arabic': 'وصول الرومان ومقاومة الممالك الأمازيغية – الآثار الرومانية بالمغرب', 'title': 'Roman Arrival and Amazigh Kingdoms Resistance - Roman Ruins in Morocco', 'category': 'History'},
            {'order': 5, 'title_arabic': 'الفتح الإسلامي', 'title': 'Islamic Conquest', 'category': 'History'},

            # دروس الجغرافيا (Geography) - 6 lessons (first half)
            {'order': 6, 'title_arabic': 'ما هي الجغرافية؟ بماذا تهتم؟ وما فائدتها بالنسبة لنا؟', 'title': 'What is Geography? What Does It Focus On? What\'s Its Benefit for Us?', 'category': 'Geography'},
            {'order': 7, 'title_arabic': 'جهتنا: أين تقع بالنسبة للمغرب؟ خصوصياتها ومواردها', 'title': 'Our Region: Where Is It Located in Morocco? Its Characteristics and Resources', 'category': 'Geography'},
            {'order': 8, 'title_arabic': 'أتعرف تضاريس المغرب انطلاقا من الخريطة الطبغرافية وأتعلم رسم مقطع طبغرافي', 'title': 'Understanding Morocco\'s Terrain from Topographic Maps and Learning to Draw Topographic Sections', 'category': 'Geography'},
            {'order': 9, 'title_arabic': 'أتعرف موقع المغرب في إفريقيا والعالم', 'title': 'Understanding Morocco\'s Position in Africa and the World', 'category': 'Geography'},
            {'order': 10, 'title_arabic': 'أتعرف مناخ المغرب وأرسم مبيان للحرارة والتساقطات', 'title': 'Understanding Morocco\'s Climate and Drawing Temperature and Precipitation Charts', 'category': 'Geography'},
            {'order': 11, 'title_arabic': 'أتعرف توزيع السكان بالمغرب وأدرس الكثافة السكانية', 'title': 'Understanding Population Distribution in Morocco and Studying Population Density', 'category': 'Geography'},

            # دروس التربیة على المواطنة (Civic Education) - 3 lessons (first half)
            {'order': 12, 'title_arabic': 'ما ھي اتفاقیة حقوق الطفل؟', 'title': 'What is the Convention on the Rights of the Child?', 'category': 'Civic Education'},
            {'order': 13, 'title_arabic': 'ما معنى المصلحة الفضلى؟', 'title': 'What Does Best Interest Mean?', 'category': 'Civic Education'},
            {'order': 14, 'title_arabic': 'ما معنى عدم التمییز ؟', 'title': 'What Does Non-Discrimination Mean?', 'category': 'Civic Education'},
        ]

        # Second Cycle - Second half of each section
        lessons_s2 = [
            # دروس التاريخ (History) - 5 lessons (second half)
            {'order': 1, 'title_arabic': 'أدرس آثارا تاريخية: صومعتا حسان والكتبية', 'title': 'Studying Historical Monuments: Hassan and Kutubiyya Minarets', 'category': 'History'},
            {'order': 2, 'title_arabic': 'دراسة مدينة إسلامية: فاس في عهد الأدارسة نموذجا', 'title': 'Studying an Islamic City: Fez During the Idrisid Era as an Example', 'category': 'History'},
            {'order': 3, 'title_arabic': 'المرابطون: الطرق التجارية', 'title': 'The Almoravids: Trade Routes', 'category': 'History'},
            {'order': 4, 'title_arabic': 'السعديون: النشأة والتوسع', 'title': 'The Saadians: Origin and Expansion', 'category': 'History'},
            {'order': 5, 'title_arabic': 'الدولة العلوية', 'title': 'The Alaouite State', 'category': 'History'},

            # دروس الجغرافيا (Geography) - 6 lessons (second half)
            {'order': 6, 'title_arabic': 'الزراعة واستعمال المعادن، وتطوير الأدوات وبناء القرى', 'title': 'Agriculture and Metal Use, Tool Development and Village Building', 'category': 'Geography'},
            {'order': 7, 'title_arabic': 'توظيف المهارات المكتسبة: نفكر سويا في حل لمشكل متعلق بالبيئة وننظم أنشطة تحسيسية بصدده', 'title': 'Using Acquired Skills: Thinking Together About Environmental Problem Solutions and Organizing Awareness Activities', 'category': 'Geography'},
            {'order': 8, 'title_arabic': 'أدرس مشهدا ريفيا وأقوم بتمثيله وأتعرف على مشهد على صورة جوية', 'title': 'Studying a Rural Scene, Representing It, and Understanding Aerial View Landscapes', 'category': 'Geography'},
            {'order': 9, 'title_arabic': 'أدرس نشاطا اقتصاديا: السياحة في المغرب', 'title': 'Studying an Economic Activity: Tourism in Morocco', 'category': 'Geography'},
            {'order': 10, 'title_arabic': 'أدرس مجالا ملوثا محليا / وطنيا وفي جهة أخرى من القارة الإفريقية وأقارن بينهما', 'title': 'Studying Polluted Areas Locally/Nationally and in Another African Region and Comparing Them', 'category': 'Geography'},
            {'order': 11, 'title_arabic': 'أدرس ظاهرة / مشكلة جهوية: اختيار ظاهرة تعاني منها جهتي', 'title': 'Studying a Regional Phenomenon/Problem: Choosing a Phenomenon Affecting My Region', 'category': 'Geography'},

            # دروس التربیة على المواطنة (Civic Education) - 3 lessons (second half)
            {'order': 12, 'title_arabic': 'حقي في اسم وجنسیة', 'title': 'My Right to a Name and Nationality', 'category': 'Civic Education'},
            {'order': 13, 'title_arabic': 'كیف أحمي نفسي بنفسي ؟ كیف أحمي غیري ؟', 'title': 'How Do I Protect Myself? How Do I Protect Others?', 'category': 'Civic Education'},
            {'order': 14, 'title_arabic': 'حقي في التربیة', 'title': 'My Right to Education', 'category': 'Civic Education'},
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
            grade = Grade.objects.get(code='CE6')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "CE6" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing CE6 HGEC lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating CE6 HGEC lessons for this subject...')
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
                    'description': f"{lesson_data['category']} - {lesson_data['title']}",
                    'difficulty_level': 'easy',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term HGEC lessons for CE6.'
            )
        )