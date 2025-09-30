from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create Arabic lessons for CM1 (Cours Moyen 1)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CM1 Arabic lessons before creating new ones',
        )

    def handle(self, *args, **options):
        lessons_data = [
            {'order': 1, 'title_arabic': 'أنواع الكلمة', 'title': 'Types of Words'},
            {'order': 2, 'title_arabic': 'المفرد والمثنى والجمع', 'title': 'Singular, Dual, and Plural'},
            {'order': 3, 'title_arabic': 'الجملة الفعلية والإسمية', 'title': 'Verbal and Nominal Sentences'},
            {'order': 4, 'title_arabic': 'الفعل وأبوابه', 'title': 'The Verb and Its Forms'},
            {'order': 5, 'title_arabic': 'نصب الفعل المضارع', 'title': 'Subjunctive Mood of the Present Tense Verb'},
            {'order': 6, 'title_arabic': 'الأسماء الخمسة', 'title': 'The Five Nouns'},
            {'order': 7, 'title_arabic': 'جر الإسم', 'title': 'Genitive Case of the Noun'},
            {'order': 8, 'title_arabic': 'اللام الشمسية واللام القمرية', 'title': 'Solar and Lunar Lam'},
            {'order': 9, 'title_arabic': 'الهمزة وسط الكلمة', 'title': 'Hamza in the Middle of a Word'},
            {'order': 10, 'title_arabic': 'التاء المربوطة والتاء المفتوحة', 'title': 'Closed and Open Taa'},
            {'order': 11, 'title_arabic': 'أسلوب الإستفهام', 'title': 'Interrogative Style'},
            {'order': 12, 'title_arabic': 'الأفعال الخمسة', 'title': 'The Five Verbs'},
            {'order': 13, 'title_arabic': 'الضمير', 'title': 'The Pronoun'},
            {'order': 14, 'title_arabic': 'ضمائر الخطاب', 'title': 'Second-Person Pronouns'},
            {'order': 15, 'title_arabic': 'ضمائر الغائب', 'title': 'Third-Person Pronouns'},
            {'order': 16, 'title_arabic': 'أسماء الإشارة', 'title': 'Demonstrative Nouns'},
            {'order': 17, 'title_arabic': 'الإسم الموصول', 'title': 'The Relative Pronoun'},
            {'order': 18, 'title_arabic': 'الأسماء الموصولة', 'title': 'Relative Nouns'},
            {'order': 19, 'title_arabic': 'كان وأخواتها', 'title': 'Kana and Its Sisters'},
            {'order': 20, 'title_arabic': 'إن وأخواتها', 'title': 'Inna and Its Sisters'},
            {'order': 21, 'title_arabic': 'الفاعل', 'title': 'The Subject (Doer)'},
            {'order': 22, 'title_arabic': 'نائب الفاعل', 'title': 'The Deputy Subject'},
            {'order': 23, 'title_arabic': 'الحال', 'title': 'The Condition (Adverb of Manner)'},
            {'order': 24, 'title_arabic': 'النعت (الصفة)', 'title': "The Adjective (Na't)"},
            {'order': 25, 'title_arabic': 'العدد', 'title': 'The Number'},
            {'order': 26, 'title_arabic': 'تذكير العدد وتأنيثه', 'title': 'Masculine and Feminine of Numbers'},
            {'order': 27, 'title_arabic': 'النكرة والمعرفة', 'title': 'Indefinite and Definite'},
            {'order': 28, 'title_arabic': 'التوكيد', 'title': 'Emphasis'},
        ]

        lessons_s1 = lessons_data[:14]
        lessons_s2 = lessons_data[14:]

        try:
            subject = Subject.objects.get(code='ARA101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code ARA101 not found. Please ensure it exists.')
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
        for i, lesson_data in enumerate(lessons_s2):
            lesson, created = Lesson.objects.get_or_create(
                subject=subject,
                grade=grade,
                cycle='second',
                order=i + 1,
                defaults={
                    'title': lesson_data['title'],
                    'title_arabic': lesson_data['title_arabic'],
                    'title_french': f"Leçon {i + 1}",
                    'difficulty_level': 'easy',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term lessons for CM1.'
            )
        )
