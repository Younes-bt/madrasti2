from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Information Technology lessons for 2AC (Deuxième Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 2AC IT lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 8 lessons (Hardware Environment + Operating Systems & Networks)
        lessons_s1 = [
            # Hardware Environment Section
            {'order': 1, 'title': 'Hardware Configuration of a Computer', 'title_arabic': 'التكوين المادي للحاسوب', 'title_french': 'La configuration matérielle d\'un ordinateur'},
            {'order': 2, 'title': 'Computer Network', 'title_arabic': 'شبكة الحاسوب', 'title_french': 'Le réseau d\'ordinateurs'},
            {'order': 3, 'title': 'Hardware Configuration of a Local Network', 'title_arabic': 'التكوين المادي للشبكة المحلية', 'title_french': 'La configuration matérielle d\'un réseau local'},

            # Operating System and Local Network Section
            {'order': 4, 'title': 'Network Operating System', 'title_arabic': 'نظام التشغيل الشبكي', 'title_french': 'Le système d\'exploitation réseau'},
            {'order': 5, 'title': 'Workgroup in a Local Network', 'title_arabic': 'مجموعة العمل في الشبكة المحلية', 'title_french': 'Le groupe de travail dans un réseau local'},
            {'order': 6, 'title': 'Resource Sharing in a Local Network', 'title_arabic': 'مشاركة الموارد في الشبكة المحلية', 'title_french': 'Le partage des ressources dans un réseau local'},
            {'order': 7, 'title': 'Information Exchange', 'title_arabic': 'تبادل المعلومات', 'title_french': 'Échange d\'informations'},
            {'order': 8, 'title': 'Information Exchange Systems', 'title_arabic': 'أنظمة تبادل المعلومات', 'title_french': 'L\'échange d\'informations'},
        ]

        # Second Cycle - 8 lessons (Spreadsheets + Logo Programming)
        lessons_s2 = [
            # Spreadsheets Section
            {'order': 1, 'title': 'Spreadsheet Concept: Workbook, Sheet and Cell', 'title_arabic': 'مفهوم الجدول الإلكتروني: المصنف والورقة والخلية', 'title_french': 'La notion d\'un tableur: le classeur la feuille et la cellule'},
            {'order': 2, 'title': 'Data Entry in a Spreadsheet', 'title_arabic': 'إدخال البيانات في الجدول الإلكتروني', 'title_french': 'La saisie des données dans un tableur'},
            {'order': 3, 'title': 'Formula and Function Concepts', 'title_arabic': 'مفاهيم الصيغ والدوال', 'title_french': 'Notions de formule et de fonctions'},
            {'order': 4, 'title': 'Relative and Absolute Addresses', 'title_arabic': 'العناوين النسبية والمطلقة', 'title_french': 'L\'adresse relative et l\'adresse absolue'},
            {'order': 5, 'title': 'Table Formatting and Charts', 'title_arabic': 'تنسيق الجدول والرسوم البيانية', 'title_french': 'La mise en forme d\'un tableau et les graphiques'},

            # Logo Programming Section
            {'order': 6, 'title': 'Logo Programming Concepts', 'title_arabic': 'مفاهيم برمجة لوجو', 'title_french': 'Notions de la programmation LOGO'},
            {'order': 7, 'title': 'Colors, Text and Arithmetic Calculation in XLOGO', 'title_arabic': 'الألوان والنص والحساب الحسابي في XLOGO', 'title_french': 'Les couleurs le texte et le calcul arithmétique dans XLOGO'},
            {'order': 8, 'title': 'Loops and Procedures in XLOGO - Machine Language', 'title_arabic': 'التكرار والإجراءات في XLOGO - لغة الآلة', 'title_french': 'Les répétitions et les procédures dans XLOGO - Le langage machine'},
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
            grade = Grade.objects.get(code='2AC')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "2AC" not found. Please create it first.')
            )
            return

        # Get both tracks
        try:
            track_nrml = Track.objects.get(code='2AC-NRML')
            self.stdout.write(f'Found NRML track: {track_nrml.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "2AC-NRML" not found. Please create it first.')
            )
            return

        try:
            track_frn = Track.objects.get(code='2AC-FRN')
            self.stdout.write(f'Found FRN track: {track_frn.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "2AC-FRN" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 2AC IT lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating 2AC IT lessons for this subject...')
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term IT lessons for 2AC.'
            )
        )