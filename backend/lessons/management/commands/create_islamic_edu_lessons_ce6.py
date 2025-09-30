from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create Islamic Education lessons for CE6 (Cours Élémentaire 6)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CE6 Islamic Education lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - دروس الدورة الاولى (Lessons 1-11)
        lessons_s1 = [
            {'order': 1, 'title_arabic': 'التزكية – القرآن الكريم', 'title': 'Tazkiyah - The Noble Quran', 'category': 'التزكية'},
            {'order': 2, 'title_arabic': 'التزكية – أؤمن بالغيب: الملائكة واليوم الآخر', 'title': 'Tazkiyah - I Believe in the Unseen: Angels and the Last Day', 'category': 'التزكية'},
            {'order': 3, 'title_arabic': 'التزكية – أعرف الله من خلال خلقه', 'title': 'Tazkiyah - I Know Allah Through His Creation', 'category': 'التزكية'},
            {'order': 4, 'title_arabic': 'الإقتداء – بعثة الرسول صلى الله عليه وسلم والدعوة السرية', 'title': 'Iqtida - The Prophet\'s Mission and Secret Call', 'category': 'الإقتداء'},
            {'order': 5, 'title_arabic': 'الإقتداء – الرسول صلى الله عليه وسلم مبلغا', 'title': 'Iqtida - The Prophet as a Messenger', 'category': 'الإقتداء'},
            {'order': 6, 'title_arabic': 'الإستجابة – أصلي صلاة التراويح جماعة', 'title': 'Istijaba - I Pray Tarawih in Congregation', 'category': 'الإستجابة'},
            {'order': 7, 'title_arabic': 'الإستجابة – الصيام: معناه، شروطه وفوائده', 'title': 'Istijaba - Fasting: Its Meaning, Conditions and Benefits', 'category': 'الإستجابة'},
            {'order': 8, 'title_arabic': 'القسط – الإيمان والإيواء: قصة آسية زوج فرعون', 'title': 'Qist - Faith and Shelter: The Story of Asiyah, Pharaoh\'s Wife', 'category': 'القسط'},
            {'order': 9, 'title_arabic': 'القسط – أبحث عن الحقيقة : قصة إبراهيم عليه السلام', 'title': 'Qist - I Search for Truth: The Story of Ibrahim (Peace be upon him)', 'category': 'القسط'},
            {'order': 10, 'title_arabic': 'الحكمة – الرضا والتفاؤل: قصة امرأة عمران عليه السلام', 'title': 'Hikmah - Contentment and Optimism: The Story of Imran\'s Wife', 'category': 'الحكمة'},
            {'order': 11, 'title_arabic': 'الحكمة – قصة إبراهيم عليه السلام: أنصح وأحاور بأدب', 'title': 'Hikmah - Ibrahim\'s Story: I Advise and Dialogue with Manners', 'category': 'الحكمة'},
        ]

        # Second Cycle - دروس الدورة الثانية (Lessons 12-26)
        lessons_s2 = [
            {'order': 1, 'title_arabic': 'التزكية – مراتب الدين: الإسلام', 'title': 'Tazkiyah - Levels of Religion: Islam', 'category': 'التزكية'},
            {'order': 2, 'title_arabic': 'التزكية – مراتب الدين: الإيمان', 'title': 'Tazkiyah - Levels of Religion: Iman (Faith)', 'category': 'التزكية'},
            {'order': 3, 'title_arabic': 'التزكية – مراتب الدين: الإحسان', 'title': 'Tazkiyah - Levels of Religion: Ihsan (Excellence)', 'category': 'التزكية'},
            {'order': 4, 'title_arabic': 'الإقتداء – قصة ابتلاء آل ياسر', 'title': 'Iqtida - The Story of the Trial of the Family of Yasir', 'category': 'الإقتداء'},
            {'order': 5, 'title_arabic': 'الإقتداء – حلم الرسول صلى الله عليه وسلم ورحمته', 'title': 'Iqtida - The Prophet\'s Patience and Mercy', 'category': 'الإقتداء'},
            {'order': 6, 'title_arabic': 'الإقتداء – أحب رسول الله وألتزم هدي النبي الخاتم', 'title': 'Iqtida - I Love the Messenger of Allah and Follow the Final Prophet\'s Guidance', 'category': 'الإقتداء'},
            {'order': 7, 'title_arabic': 'الإستجابة – سنن الصيام', 'title': 'Istijaba - Sunnah of Fasting', 'category': 'الإستجابة'},
            {'order': 8, 'title_arabic': 'الإستجابة – مفسدات الصيام ومبيحات الإفطار', 'title': 'Istijaba - Things that Break the Fast and Permitted Breaking of Fast', 'category': 'الإستجابة'},
            {'order': 9, 'title_arabic': 'الإستجابة – أذكر الله: أتلو كتاب الله', 'title': 'Istijaba - I Remember Allah: I Recite Allah\'s Book', 'category': 'الإستجابة'},
            {'order': 10, 'title_arabic': 'القسط – أرعى حق المسكين: قصة أصحاب الجنة', 'title': 'Qist - I Care for the Poor\'s Rights: The Story of the Garden Owners', 'category': 'القسط'},
            {'order': 11, 'title_arabic': 'القسط – أفي بحقوق غيري: "فأعط كل ذي حق حقه"', 'title': 'Qist - I Fulfill Others\' Rights: "Give everyone their due right"', 'category': 'القسط'},
            {'order': 12, 'title_arabic': 'القسط – أستقيم كما أمرت', 'title': 'Qist - I Stay Upright as I was Commanded', 'category': 'القسط'},
            {'order': 13, 'title_arabic': 'الحكمة – أعتبر: قصة أصحاب الجنة', 'title': 'Hikmah - I Take Lessons: The Story of the Garden Owners', 'category': 'الحكمة'},
            {'order': 14, 'title_arabic': 'الحكمة – أختار الصحبة الصالحة', 'title': 'Hikmah - I Choose Righteous Companionship', 'category': 'الحكمة'},
            {'order': 15, 'title_arabic': 'الحكمة – أقرأ القرآن وأرتقي', 'title': 'Hikmah - I Read the Quran and Rise', 'category': 'الحكمة'},
        ]

        try:
            subject = Subject.objects.get(code='ISLM101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code ISLM101 not found. Please ensure it exists.')
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
            self.stdout.write('Deleting existing CE6 Islamic Education lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating CE6 Islamic Education lessons for this subject...')
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Islamic Education lessons for CE6.'
            )
        )