from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade
import math

class Command(BaseCommand):
    help = 'Create Islamic Education lessons for CE2 (Cours Élémentaire 2)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CE2 Islamic Education lessons before creating new ones',
        )

    def handle(self, *args, **options):
        sections = {
            'التزكية : قرآن كريم': [
                {'title_arabic': 'سورة الشرح', 'title': 'Surah Ash-Sharh'},
                {'title_arabic': 'سورة العصر', 'title': 'Surah Al-Asr'},
                {'title_arabic': 'سورة النصر', 'title': 'Surah An-Nasr'},
                {'title_arabic': 'سورة الانفطار', 'title': 'Surah Al-Infitar'},
                {'title_arabic': 'سورة الشمس', 'title': 'Surah Ash-Shams'},
                {'title_arabic': 'سورة الأعلى', 'title': 'Surah Al-Ala'},
                {'title_arabic': 'سورة العاديات', 'title': 'Surah Al-Adiyat'},
                {'title_arabic': 'سورة الزلزلة', 'title': 'Surah Az-Zalzala'},
                {'title_arabic': 'سورة البروج', 'title': 'Surah Al-Buruj'},
                {'title_arabic': 'سورة الكوثر', 'title': 'Surah Al-Kawthar'},
                {'title_arabic': 'سورة الإنسان', 'title': 'Surah Al-Insan'},
            ],
            'التزكية : عقيدة': [
                {'title_arabic': 'الله العظيم الغني الرزاق', 'title': 'Allah is the Great, the Rich, the Provider'},
                {'title_arabic': 'الله خلقني وأحسن صورتي: الخالق المصور', 'title': 'Allah Created Me and Perfected My Form: The Creator, the Fashioner'},
                {'title_arabic': 'الله يعلم ما أسر وأعلن: العليم الخبير', 'title': 'Allah Knows What I Conceal and What I Reveal: The All-Knowing, the All-Aware'},
                {'title_arabic': 'الله رقيبي في السر والعلن', 'title': 'Allah is My Watcher in Secret and in Public'},
                {'title_arabic': 'الله يرحمني ويعفو عني: العفو الرحيم', 'title': 'Allah has Mercy on Me and Pardons Me: The Pardoner, the Merciful'},
                {'title_arabic': 'الله الجواد الكريم', 'title': 'Allah is the Generous, the Most Generous'},
            ],
            'الإقتداء': [
                {'title_arabic': 'الرسول صلى الله عليه وسلم طفلا', 'title': 'The Prophet (PBUH) as a Child'},
                {'title_arabic': 'كدح الرسول صلى الله عليه وسلم في سبيل الرزق', 'title': 'The Prophet\'s (PBUH) Toil for Sustenance'},
                {'title_arabic': 'الرسول صلى الله عليه وسلم الأمين', 'title': 'The Prophet (PBUH), the Trustworthy'},
                {'title_arabic': 'الرسول صلى الله عليه وسلم يؤلف بين قومه', 'title': 'The Prophet (PBUH) Unites His People'},
                {'title_arabic': 'أحب الرسول صلى الله عليه وسلم أتخلق بأخلاقه', 'title': 'I Love the Prophet (PBUH) and Emulate His Character'},
            ],
            'الإستجابة': [
                {'title_arabic': 'فرائض الوضوء', 'title': 'The Obligations of Ablution'},
                {'title_arabic': 'سنن الوضوء وبعض نواقضه', 'title': 'The Sunnahs and Nullifiers of Ablution'},
                {'title_arabic': 'ألفاظ الأذان والإقامة', 'title': 'The Words of Adhan and Iqama'},
                {'title_arabic': 'شروط الصلاة', 'title': 'The Conditions of Prayer'},
                {'title_arabic': 'فرائض الصلاة', 'title': 'The Obligations of Prayer'},
                {'title_arabic': 'أذكر الله، أدعو الله في صلاتي', 'title': 'I Remember Allah, I Supplicate to Allah in My Prayer'},
            ],
            'القسط': [
                {'title_arabic': 'أحفظ نفسي وأرعى حقوق غيري', 'title': 'I Protect Myself and Respect the Rights of Others'},
                {'title_arabic': 'أحافظ على سلامة جسمي', 'title': 'I Maintain the Safety of My Body'},
                {'title_arabic': 'أصدق في قولي', 'title': 'I am Truthful in My Speech'},
                {'title_arabic': 'أنصر المظلوم', 'title': 'I Support the Oppressed'},
                {'title_arabic': 'أسامح ولا أظلم', 'title': 'I Forgive and Do Not Oppress'},
                {'title_arabic': 'المؤمن كله خير', 'title': 'A Believer is Entirely Good'},
            ],
            'الحكمة': [
                {'title_arabic': 'أُميط الأذى عن الطريق', 'title': 'I Remove Harm from the Path'},
                {'title_arabic': 'أعتني بهندامي', 'title': 'I Take Care of My Appearance'},
                {'title_arabic': 'أحفظ لساني', 'title': 'I Guard My Tongue'},
                {'title_arabic': 'أثبت على الحق', 'title': 'I Stand Firm on the Truth'},
                {'title_arabic': 'أعفو عمن ظلمني', 'title': 'I Pardon Those Who Have Wronged Me'},
                {'title_arabic': 'أرأف وأرحم', 'title': 'I am Kind and Merciful'},
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
                f'Successfully created {total_created_s1} new first term and {total_created_s2} new second term lessons for CE2 Islamic Education.'
            )
        )
