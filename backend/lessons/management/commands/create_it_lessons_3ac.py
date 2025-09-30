from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Information Technology lessons for 3AC (Troisième Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 3AC IT lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 12 lessons (Network Topology, Computer-Assisted Presentation, and Logo Programming)
        lessons_s1 = [
            # Network Topology Section
            {'order': 1, 'title': 'Network Topology', 'title_arabic': 'تصنيف الشبكات', 'title_french': 'Typologie réseau'},
            {'order': 2, 'title': 'Types of Networks', 'title_arabic': 'أنواع الشبكات', 'title_french': 'La typologie des réseaux'},

            # Computer-Assisted Presentation Section
            {'order': 3, 'title': 'Computer-Assisted Presentation', 'title_arabic': 'العرض بمساعدة الحاسوب', 'title_french': 'Présentation Assistée par Ordinateur'},
            {'order': 4, 'title': 'Computer-Assisted Presentation Basics', 'title_arabic': 'أساسيات العرض بمساعدة الحاسوب', 'title_french': 'La présentation assistée par ordinateur'},
            {'order': 5, 'title': 'Slide Animation and Transitions', 'title_arabic': 'تحريك الشرائح والانتقال بينها', 'title_french': 'L\'animation d\'une diapositive – la transition entre les diapositives'},
            {'order': 6, 'title': 'Inserting Images and Moving Images in Slides', 'title_arabic': 'إدراج الصور والصور المتحركة في الشرائح', 'title_french': 'L\'insertion des images dans une diapositive – l\'image en mouvement'},
            {'order': 7, 'title': 'Inserting Tables, Charts and Sound in Slides', 'title_arabic': 'إدراج الجداول والرسوم البيانية والصوت في الشرائح', 'title_french': 'L\'insertion de tableau – graphique – et du son dans une diapositive'},
            {'order': 8, 'title': 'Movies in Presentations and Hyperlink Insertion', 'title_arabic': 'الأفلام في العروض وإدراج الروابط التشعبية', 'title_french': 'Les films dans une présentation – insertion de liens hypertexte'},

            # Logo Programming Section
            {'order': 9, 'title': 'Programming Concepts', 'title_arabic': 'مفاهيم البرمجة', 'title_french': 'Notion de la programmation'},
            {'order': 10, 'title': 'XLOGO Procedures', 'title_arabic': 'إجراءات XLOGO', 'title_french': 'Les procédures de XLOGO'},
            {'order': 11, 'title': 'Variables in XLOGO', 'title_arabic': 'المتغيرات في XLOGO', 'title_french': 'Les variabes dans XLOGO'},
            {'order': 12, 'title': 'Production and Management of XLOGO Programs', 'title_arabic': 'إنتاج وإدارة برامج XLOGO', 'title_french': 'La production et la gestion d\'un programme XLOGO'},
        ]

        # Second Cycle - 5 lessons (Recursivity and Web Research)
        lessons_s2 = [
            # Logo Programming (continued)
            {'order': 1, 'title': 'Recursivity in XLOGO', 'title_arabic': 'التكرار في XLOGO', 'title_french': 'La récursivité dans XLOGO'},

            # Web Research Section
            {'order': 2, 'title': 'Websites and Browsers', 'title_arabic': 'المواقع الإلكترونية والمتصفحات', 'title_french': 'Site web et navigateurs'},
            {'order': 3, 'title': 'Search Engines', 'title_arabic': 'محركات البحث', 'title_french': 'Les moteurs de recherche'},
            {'order': 4, 'title': 'Search with Operators', 'title_arabic': 'البحث باستخدام المشغلات', 'title_french': 'La recherche avec les opérateurs'},
            {'order': 5, 'title': 'Downloading', 'title_arabic': 'التحميل', 'title_french': 'Le téléchargement'},
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
            grade = Grade.objects.get(code='3AC')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "3AC" not found. Please create it first.')
            )
            return

        # Get both tracks
        try:
            track_nrml = Track.objects.get(code='3AC-NRML')
            self.stdout.write(f'Found NRML track: {track_nrml.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "3AC-NRML" not found. Please create it first.')
            )
            return

        try:
            track_frn = Track.objects.get(code='3AC-FRN')
            self.stdout.write(f'Found FRN track: {track_frn.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "3AC-FRN" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 3AC IT lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating 3AC IT lessons for this subject...')
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term IT lessons for 3AC.'
            )
        )