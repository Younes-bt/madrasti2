from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade
import math

class Command(BaseCommand):
    help = 'Create Islamic Education lessons for CM2 (Cours Moyen 2)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CM2 Islamic Education lessons before creating new ones',
        )

    def handle(self, *args, **options):
        sections = {
            'القرآن الكريم': [
                {'title_arabic': 'سورة الجمعة', 'title': 'Surah Al-Jumu\'a'},
                {'title_arabic': 'سورة الطارق', 'title': 'Surah At-Tariq'},
                {'title_arabic': 'سورة القلم', 'title': 'Surah Al-Qalam'},
                {'title_arabic': 'سورة النازعات', 'title': 'Surah An-Nazi\'at'},
                {'title_arabic': 'سورة المطففين', 'title': 'Surah Al-Mutaffifin'},
                {'title_arabic': 'سورة القيامة', 'title': 'Surah Al-Qiyama'},
                {'title_arabic': 'سورة التكوير', 'title': 'Surah At-Takwir'},
                {'title_arabic': 'سورة الحاقة', 'title': 'Surah Al-Haaqqa'},
                {'title_arabic': 'سورة المعارج', 'title': 'Surah Al-Ma\'arij'},
                {'title_arabic': 'سورة المدثر', 'title': 'Surah Al-Muddaththir'},
                {'title_arabic': 'سورة نوح', 'title': 'Surah Nuh'},
            ],
            'مدخل العقيدة': [
                {'title_arabic': 'أؤمن بالله و كتبه ورسله', 'title': 'I Believe in Allah, His Books, and His Messengers'},
                {'title_arabic': 'أؤمن بمحبة الله', 'title': 'I Believe in the Love of Allah'},
                {'title_arabic': 'أؤمن بالبعث والجزاء', 'title': 'I Believe in the Resurrection and the Recompense'},
                {'title_arabic': 'ربي الكريم يدخلني جنته', 'title': 'My Generous Lord Will Admit Me to His Paradise'},
                {'title_arabic': 'ربي رحيم يعتني عناية', 'title': 'My Merciful Lord Takes Care of Me'},
                {'title_arabic': 'الله الرحمان الغفار التواب', 'title': 'Allah is the Most Gracious, the Forgiving, the Accepter of Repentance'},
            ],
            'مدخل الإقتداء': [
                {'title_arabic': 'بعثة الرسول صلى الله عليه وسلم', 'title': 'The Mission of the Prophet (PBUH)'},
                {'title_arabic': 'الرسول صلى الله عليه وسلم الصادق المصدوق', 'title': 'The Prophet (PBUH), the Truthful, the Believed'},
                {'title_arabic': 'مساندة خديجة للرسول صلى الله عليه وسلم', 'title': 'Khadijah\'s Support for the Prophet (PBUH)'},
                {'title_arabic': 'إسلام علي بن أبي طالب رضي الله عنه', 'title': 'The Islam of Ali ibn Abi Talib (RA)'},
                {'title_arabic': 'إيثار الرسول صلى الله عليه وسلم عشيرته', 'title': 'The Prophet\'s (PBUH) Preference for His Tribe'},
                {'title_arabic': 'أحب الرسول صلى الله عليه وسلم وأنصره', 'title': 'I Love the Prophet (PBUH) and Support Him'},
            ],
            'مدخل الإستجابة': [
                {'title_arabic': 'إخلاص في صلاتي', 'title': 'Sincerity in My Prayer'},
                {'title_arabic': 'اغتسل', 'title': 'I Perform Ghusl (Ritual Bath)'},
                {'title_arabic': 'صلاة الوتر والفجر', 'title': 'Witr and Fajr Prayers'},
                {'title_arabic': 'تحية المسجد', 'title': 'Greeting the Mosque'},
                {'title_arabic': 'صلاة العيدين', 'title': 'Eid Prayers'},
                {'title_arabic': 'أذكر الله – أناجي الله', 'title': 'I Remember Allah - I Converse with Allah'},
            ],
            'مدخل القسط': [
                {'title_arabic': 'المساواة لكم لآدم', 'title': 'Equality for You, for Adam'},
                {'title_arabic': 'لا أغش قصة سمرة التين', 'title': 'I Do Not Cheat: The Story of the Fig Tree'},
                {'title_arabic': 'أمد يد العون قصة موسى مع بنات شعيب', 'title': 'I Extend a Helping Hand: The Story of Moses with the Daughters of Shuaib'},
                {'title_arabic': 'أستغفر وأتوب قصة يونس', 'title': 'I Seek Forgiveness and Repent: The Story of Yunus'},
                {'title_arabic': 'أصبر وأواظب قصة نوح', 'title': 'I am Patient and Perseverant: The Story of Nuh'},
                {'title_arabic': 'سيد الاستغفار', 'title': 'The Master of Seeking Forgiveness'},
            ],
            'مدخل الحكمة': [
                {'title_arabic': 'حسن التواصل', 'title': 'Good Communication'},
                {'title_arabic': 'أهذب خلقي', 'title': 'I Refine My Character'},
                {'title_arabic': 'أيسر المرأة', 'title': 'The Ease of Women'},
                {'title_arabic': 'أعترف بالخطأ وأعتذر قصة يونس', 'title': 'I Admit My Mistake and Apologize: The Story of Yunus'},
                {'title_arabic': 'أتفاءل ولا أيأس قصة نوح', 'title': 'I am Optimistic and Do Not Despair: The Story of Nuh'},
                {'title_arabic': 'ديني نهاني عن التمادي في الخطأ', 'title': 'My Religion Forbids Me from Persisting in Error'},
            ]
        }

        try:
            subject = Subject.objects.get(code='ISLM101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code ISLM101 not found. Please ensure it exists.')
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
                f'Successfully created {total_created_s1} new first term and {total_created_s2} new second term lessons for CM2 Islamic Education.'
            )
        )
