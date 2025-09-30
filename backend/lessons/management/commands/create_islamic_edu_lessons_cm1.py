from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade
import math

class Command(BaseCommand):
    help = 'Create Islamic Education lessons for CM1 (Cours Moyen 1)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CM1 Islamic Education lessons before creating new ones',
        )

    def handle(self, *args, **options):
        sections = {
            'التزكية : قرآن كريم': [
                {'title_arabic': 'سورة الإنسان', 'title': 'Surah Al-Insan'},
                {'title_arabic': 'سورة الانفطار', 'title': 'Surah Al-Infitar'},
                {'title_arabic': 'سورة الأعلى', 'title': 'Surah Al-Ala'},
                {'title_arabic': 'سورة الطارق', 'title': 'Surah At-Tariq'},
                {'title_arabic': 'سورة عبس', 'title': 'Surah Abasa'},
                {'title_arabic': 'سورة النبأ', 'title': 'Surah An-Naba'},
                {'title_arabic': 'سورة الليل', 'title': 'Surah Al-Lail'},
                {'title_arabic': 'سورة العلق', 'title': 'Surah Al-Alaq'},
                {'title_arabic': 'سورة المزمل', 'title': 'Surah Al-Muzzammil'},
                {'title_arabic': 'سورة البينة', 'title': 'Surah Al-Bayyinah'},
            ],
            'التزكية : عقيدة': [
                {'title_arabic': 'الله العليم الرقيب الرحيم الكريم', 'title': 'Allah is the All-Knowing, the Watchful, the Merciful, the Generous'},
                {'title_arabic': 'الله القادر المنعم', 'title': 'Allah is the All-Powerful, the Bestower of Blessings'},
                {'title_arabic': 'الله بديع السماوات و الأرض', 'title': 'Allah is the Originator of the Heavens and the Earth'},
                {'title_arabic': 'أومن بأنبياء الله ومعجزاتهم', 'title': 'I Believe in the Prophets of Allah and Their Miracles'},
                {'title_arabic': 'أومن بكتب الله', 'title': 'I Believe in the Books of Allah'},
                {'title_arabic': 'إن الدين عند الله الإسلام', 'title': 'Indeed, the Religion in the Sight of Allah is Islam'},
            ],
            'الإقتداء': [
                {'title_arabic': 'الرسول صلى الله عليه وسلم شابا', 'title': 'The Prophet (PBUH) as a Young Man'},
                {'title_arabic': 'رعاية الله وحفظه لرسوله صلى الله عليه وسلم', 'title': 'Allah\'s Care and Protection for His Messenger (PBUH)'},
                {'title_arabic': 'خلوة الرسول صلى الله عليه وسلم في غار حراء', 'title': 'The Prophet\'s (PBUH) Seclusion in the Cave of Hira'},
                {'title_arabic': 'بعثة الرسول صلى الله عليه وسلم', 'title': 'The Mission of the Prophet (PBUH)'},
                {'title_arabic': 'إسلام خديجة بنت خويلد رضي الله عنها', 'title': 'The Islam of Khadijah bint Khuwaylid (RA)'},
                {'title_arabic': 'أحب رسول الله صلى الله عليه وسلم وأصلي عليه', 'title': 'I Love the Messenger of Allah (PBUH) and Send Blessings Upon Him'},
            ],
            'الإستجابة': [
                {'title_arabic': 'أتوضأ وأصلي', 'title': 'I Perform Ablution and Pray'},
                {'title_arabic': 'أتيمم', 'title': 'I Perform Tayammum (Dry Ablution)'},
                {'title_arabic': 'سنن الصلاة', 'title': 'The Sunnahs of Prayer'},
                {'title_arabic': 'مبطلات الصلاة', 'title': 'The Nullifiers of Prayer'},
                {'title_arabic': 'صلاة الجماعة والجمعة', 'title': 'Congregational Prayer and Friday Prayer'},
                {'title_arabic': 'أذكر الله، أعظم الله في صلاتي (آداب الصلاة)', 'title': 'I Remember Allah, I Glorify Allah in My Prayer (Etiquette of Prayer)'},
            ],
            'القسط': [
                {'title_arabic': 'أحفظ نفسي ولا أؤذي غيري', 'title': 'I Protect Myself and Do Not Harm Others'},
                {'title_arabic': 'أحترم وأساعد الشخص في وضعية إعاقة', 'title': 'I Respect and Help a Person with a Disability'},
                {'title_arabic': 'أساعد الفقير والمحتاج', 'title': 'I Help the Poor and the Needy'},
                {'title_arabic': 'أقدر الآخر وأحترم رأيه', 'title': 'I Appreciate Others and Respect Their Opinions'},
                {'title_arabic': 'ألتزم بآداب المسجد', 'title': 'I Adhere to the Etiquette of the Mosque'},
                {'title_arabic': 'صلاتي تنظم حياتي', 'title': 'My Prayer Organizes My Life'},
            ],
            'الحكمة': [
                {'title_arabic': 'المؤمن القوي خير من المؤمن الضعيف', 'title': 'The Strong Believer is Better Than the Weak Believer'},
                {'title_arabic': 'أساوي بين الناس في المعاملة', 'title': 'I Treat People Equally'},
                {'title_arabic': 'أبتذل لوجه الله', 'title': 'I Humble Myself for the Sake of Allah'},
                {'title_arabic': 'أحسن التواصل مع الآخر', 'title': 'I Communicate Well with Others'},
                {'title_arabic': 'أعتني بالمسجد ومحيطه', 'title': 'I Take Care of the Mosque and Its Surroundings'},
                {'title_arabic': 'أحفظ الله يحفظك', 'title': 'Be Mindful of Allah, and He will Protect You'},
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
                f'Successfully created {total_created_s1} new first term and {total_created_s2} new second term lessons for CM1 Islamic Education.'
            )
        )
