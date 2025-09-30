from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Information Technology lessons for 1AC (Première Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 1AC IT lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 7 lessons (Computer System + Operating System fundamentals)
        lessons_s1 = [
            # Computer System Section
            {'order': 1, 'title': 'Computer Science', 'title_arabic': 'علم الحاسوب', 'title_french': 'Informatique'},
            {'order': 2, 'title': 'Computer System', 'title_arabic': 'نظام الحاسوب', 'title_french': 'Système informatique'},
            {'order': 3, 'title': 'Computer and Its Components', 'title_arabic': 'الحاسوب ومكوناته', 'title_french': 'L\'ordinateur et ses constituants'},
            {'order': 4, 'title': 'Main Computer Peripherals', 'title_arabic': 'الأجهزة الطرفية الرئيسية للحاسوب', 'title_french': 'Les principaux périphériques d\'un ordinateur'},
            {'order': 5, 'title': 'Connectivity', 'title_arabic': 'الاتصال', 'title_french': 'Connectivité'},
            {'order': 6, 'title': 'Software', 'title_arabic': 'البرمجيات', 'title_french': 'Logiciels'},

            # Operating System Section
            {'order': 7, 'title': 'Operating System Concepts', 'title_arabic': 'مفاهيم نظام التشغيل', 'title_french': 'Notions de système d\'exploitation'},
        ]

        # Second Cycle - 7 lessons (Operating System management + Utilities + Word Processing)
        lessons_s2 = [
            # Operating System Section (continued)
            {'order': 1, 'title': 'Window Management', 'title_arabic': 'إدارة النوافذ', 'title_french': 'Gestion des fenêtres'},
            {'order': 2, 'title': 'Workstation Organization (Desktop)', 'title_arabic': 'تنظيم مكان العمل (سطح المكتب)', 'title_french': 'Organisation du poste de travail (Bureau)'},

            # Utilities and Files Section
            {'order': 3, 'title': 'Creating a Drawing File - Creating a Sound File', 'title_arabic': 'إنشاء ملف رسم - إنشاء ملف صوتي', 'title_french': 'Création d\'un fichier de dessin – création d\'un fichier son'},

            # Word Processing Section
            {'order': 4, 'title': 'Word Processing Document Management', 'title_arabic': 'إدارة مستند معالجة النصوص', 'title_french': 'Gestion d\'un document de traitement de texte'},
            {'order': 5, 'title': 'Text Input - Linguistic Correction Tools', 'title_arabic': 'إدخال النص - أدوات التصحيح اللغوي', 'title_french': 'Saisie d\'un texte – Outils de correction linguistique'},
            {'order': 6, 'title': 'Formatting, Layout and Printing', 'title_arabic': 'التنسيق والتخطيط والطباعة', 'title_french': 'Mise en forme-mise en page et impression'},
            {'order': 7, 'title': 'Hyperlinks', 'title_arabic': 'الروابط التشعبية', 'title_french': 'Les liens hypertextes'},
        ]

        try:
            subject = Subject.objects.get(code='IT101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code IT101 not found. Please ensure it exists.')
            )
            return

        try:
            grade = Grade.objects.get(code='1AC')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "1AC" not found. Please create it first.')
            )
            return

        # Get both tracks
        try:
            track_nrml = Track.objects.get(code='1AC-NRML')
            self.stdout.write(f'Found NRML track: {track_nrml.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "1AC-NRML" not found. Please create it first.')
            )
            return

        try:
            track_frn = Track.objects.get(code='1AC-FRN')
            self.stdout.write(f'Found FRN track: {track_frn.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "1AC-FRN" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 1AC IT lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating 1AC IT lessons for this subject...')
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
                    'title_french': lesson_data['title_french'],
                    'description': f"IT - {lesson_data['title_french']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
            # Add both tracks to the lesson
            lesson.tracks.add(track_nrml, track_frn)

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
                    'title_french': lesson_data['title_french'],
                    'description': f"IT - {lesson_data['title_french']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
            # Add both tracks to the lesson
            lesson.tracks.add(track_nrml, track_frn)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term IT lessons for 1AC.'
            )
        )