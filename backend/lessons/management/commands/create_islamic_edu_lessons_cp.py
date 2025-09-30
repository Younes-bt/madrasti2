from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade
import math

class Command(BaseCommand):
    help = 'Create Islamic Education lessons for CP (Cours Préparatoire)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CP Islamic Education lessons before creating new ones',
        )

    def handle(self, *args, **options):
        sections = {
            'القرآن الكريم': [
                {'title_arabic': 'سورة الفاتحة', 'title': 'Surah Al-Fatiha'},
                {'title_arabic': 'سورة التين', 'title': 'Surah At-Tin'},
                {'title_arabic': 'سورة قريش', 'title': 'Surah Quraysh'},
                {'title_arabic': 'سورة الإخلاص', 'title': 'Surah Al-Ikhlas'},
                {'title_arabic': 'سورة الفيل', 'title': 'Surah Al-Fil'},
                {'title_arabic': 'سورة الكافرون', 'title': 'Surah Al-Kafirun'},
                {'title_arabic': 'سورة الفلق', 'title': 'Surah Al-Falaq'},
                {'title_arabic': 'سورة الناس', 'title': 'Surah An-Nas'},
                {'title_arabic': 'سورة القدر', 'title': 'Surah Al-Qadr'},
                {'title_arabic': 'سورة الضحى', 'title': 'Surah Ad-Duha'},
            ],
            'مدخل العقيدة': [
                {'title_arabic': 'الله خلقني وسواني', 'title': 'Allah Created and Fashioned Me'},
                {'title_arabic': 'الله يحفظني ويرعاني', 'title': 'Allah Protects and Cares for Me'},
            ],
            'مدخل الاقتداء': [
                {'title_arabic': 'مولد الرسول صلى الله عليه وسلم', 'title': 'The Birth of the Prophet (PBUH)'},
                {'title_arabic': 'مولد الرسول صلى الله عليه وسلم (قصة الفيل)', 'title': 'The Birth of the Prophet (PBUH) (The Story of the Elephant)'},
                {'title_arabic': 'رضاعة الرسول صلى الله عليه وسلم وإكرام الله له', 'title': "The Nursing of the Prophet (PBUH) and Allah's Honor to Him"},
                {'title_arabic': 'يتم الرسول صلى الله عليه وسلم وكفالته', 'title': 'The Orphanhood of the Prophet (PBUH) and His Care'},
            ],
            'مدخل الاستجابة': [
                {'title_arabic': 'أستعد للوضوء', 'title': 'I Prepare for Ablution'},
                {'title_arabic': 'أتوضأ عمليا', 'title': 'I Perform Ablution Practically'},
                {'title_arabic': 'الصلاة عماد الدين', 'title': 'Prayer is the Pillar of Religion'},
            ],
            'مدخل القسط': [
                {'title_arabic': 'أوحد الله', 'title': 'I Believe in the Oneness of Allah'},
                {'title_arabic': 'أحب الله ورسوله', 'title': 'I Love Allah and His Messenger'},
                {'title_arabic': 'أطهر جسمي وثيابي', 'title': 'I Cleanse My Body and Clothes'},
                {'title_arabic': 'أطيع والدي', 'title': 'I Obey My Parents'},
            ],
            'مدخل الحكمة': [
                {'title_arabic': 'أنفع ولا أضر', 'title': 'I Benefit and Do Not Harm'},
                {'title_arabic': 'أعتني بنظافة مكاني', 'title': 'I Take Care of the Cleanliness of My Place'},
                {'title_arabic': 'أقتصد في استعمال الماء', 'title': 'I Conserve Water Usage'},
                {'title_arabic': 'أحمي الماء من التلوث', 'title': 'I Protect Water from Pollution'},
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
            grade = Grade.objects.get(code='CP')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "CP" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing CP lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating CP lessons for this subject...')
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
                f'Successfully created {total_created_s1} new first term and {total_created_s2} new second term lessons for CP Islamic Education.'
            )
        )
