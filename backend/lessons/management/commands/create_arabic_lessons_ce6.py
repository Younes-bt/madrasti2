from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create Arabic lessons for CE6 (Cours Élémentaire 6)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CE6 Arabic lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - First half of each section
        lessons_s1 = [
            # الإملاء (Spelling) - 3 lessons (first half)
            {'order': 1, 'title_arabic': 'الهمزة المتوسطة – الهمزة المتطرفة', 'title': 'Middle Hamza - Final Hamza', 'category': 'الإملاء'},
            {'order': 2, 'title_arabic': 'حذف الألف والواو – الألف اللينة مقصورة وممدودة', 'title': 'Omitting Alif and Waw - Soft Alif Shortened and Extended', 'category': 'الإملاء'},
            {'order': 3, 'title_arabic': 'همزتا الوصل والقطع وألف ابن', 'title': 'Hamzat al-Wasl and Hamzat al-Qat\' and Alif Ibn', 'category': 'الإملاء'},

            # الصرف والتحويل (Morphology) - 5 lessons (first half)
            {'order': 4, 'title_arabic': 'اسما الزمان والمكان – المصدر', 'title': 'Nouns of Time and Place - The Source', 'category': 'الصرف والتحويل'},
            {'order': 5, 'title_arabic': 'اسم التفضيل – العدد والمعدود', 'title': 'Superlative Noun - Number and Numbered', 'category': 'الصرف والتحويل'},
            {'order': 6, 'title_arabic': 'اسم الآلة – اسم الفاعل واسم المفعول', 'title': 'Instrument Noun - Agent Noun and Patient Noun', 'category': 'الصرف والتحويل'},
            {'order': 7, 'title_arabic': 'النسب', 'title': 'Attribution/Lineage', 'category': 'الصرف والتحويل'},
            {'order': 8, 'title_arabic': 'الفعل المزيد', 'title': 'Augmented Verb', 'category': 'الصرف والتحويل'},

            # التراكيب (Syntax) - 7 lessons (first half)
            {'order': 9, 'title_arabic': 'المستثنى بغير وسوى', 'title': 'Exception with Ghayr and Siwa', 'category': 'التراكيب'},
            {'order': 10, 'title_arabic': 'المستثنى بإلا', 'title': 'Exception with Illa', 'category': 'التراكيب'},
            {'order': 11, 'title_arabic': 'تمييز العدد', 'title': 'Number Specification', 'category': 'التراكيب'},
            {'order': 12, 'title_arabic': 'التمييز الملفوظ والتمييز الملحوظ', 'title': 'Expressed and Observed Specification', 'category': 'التراكيب'},
            {'order': 13, 'title_arabic': 'المنادى', 'title': 'Vocative', 'category': 'التراكيب'},
            {'order': 14, 'title_arabic': 'الحال والجملة الحالية', 'title': 'State and State Sentence', 'category': 'التراكيب'},
            {'order': 15, 'title_arabic': 'المفعول معه', 'title': 'Object of Accompaniment', 'category': 'التراكيب'},
        ]

        # Second Cycle - Second half of each section
        lessons_s2 = [
            # الإملاء (Spelling) - 2 lessons (second half)
            {'order': 1, 'title_arabic': 'التاء المربوطة والتاء المبسوطة', 'title': 'Closed Ta and Open Ta', 'category': 'الإملاء'},
            {'order': 2, 'title_arabic': 'التنوين في المقصور والمنقوص والممدود', 'title': 'Tanwin in Shortened, Defective and Extended', 'category': 'الإملاء'},

            # الصرف والتحويل (Morphology) - 4 lessons (second half)
            {'order': 3, 'title_arabic': 'المقصور والمنقوص والممدود', 'title': 'Shortened, Defective and Extended', 'category': 'الصرف والتحويل'},
            {'order': 4, 'title_arabic': 'الفعل المجرد', 'title': 'Simple Verb', 'category': 'الصرف والتحويل'},
            {'order': 5, 'title_arabic': 'الفعل المعتل الأجوف والناقص', 'title': 'Defective Verb - Hollow and Incomplete', 'category': 'الصرف والتحويل'},
            {'order': 6, 'title_arabic': 'الفعل الصحيح', 'title': 'Sound Verb', 'category': 'الصرف والتحويل'},

            # التراكيب (Syntax) - 7 lessons (second half)
            {'order': 7, 'title_arabic': 'التوكيد', 'title': 'Emphasis', 'category': 'التراكيب'},
            {'order': 8, 'title_arabic': 'البدل', 'title': 'Substitution', 'category': 'التراكيب'},
            {'order': 9, 'title_arabic': 'النعت الحقيقي والنعت السببي', 'title': 'Real Adjective and Causal Adjective', 'category': 'التراكيب'},
            {'order': 10, 'title_arabic': 'المفعول المطلق والمفعول لأجله', 'title': 'Absolute Object and Object of Reason', 'category': 'التراكيب'},
            {'order': 11, 'title_arabic': 'النواسخ الفعلية والحرفية', 'title': 'Verbal and Literal Nullifiers', 'category': 'التراكيب'},
            {'order': 12, 'title_arabic': 'المبني للمجهول والمبني للمعلوم', 'title': 'Passive and Active Voice', 'category': 'التراكيب'},
            {'order': 13, 'title_arabic': 'الفعل اللازم والفعل المتعدي', 'title': 'Intransitive and Transitive Verb', 'category': 'التراكيب'},
        ]

        try:
            subject = Subject.objects.get(code='ARA101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code ARA101 not found. Please ensure it exists.')
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
            self.stdout.write('Deleting existing CE6 Arabic lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating CE6 Arabic lessons for this subject...')
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Arabic lessons for CE6.'
            )
        )