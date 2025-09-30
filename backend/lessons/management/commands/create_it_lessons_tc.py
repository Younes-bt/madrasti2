from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create IT lessons for TC (Tronc Commun)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing TC IT lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 5 lessons (Computer Basics and Software)
        lessons_s1 = [
            {'order': 1, 'title': 'Basic Definitions and Vocabulary', 'title_arabic': 'التعريفات والمفردات الأساسية', 'title_french': 'Définitions et vocabulaires de base'},
            {'order': 2, 'title': 'Basic Structure of a Computer', 'title_arabic': 'البنية الأساسية للحاسوب', 'title_french': 'Structure de base d\'un ordinateur'},
            {'order': 3, 'title': 'Software and Application Domains of Computing', 'title_arabic': 'البرمجيات ومجالات تطبيق المعلوماتية', 'title_french': 'Logiciels et domaine d\'application de l\'informatique'},
            {'order': 4, 'title': 'Operating System', 'title_arabic': 'نظام التشغيل', 'title_french': 'Système d\'exploitation'},
            {'order': 5, 'title': 'Word Processing', 'title_arabic': 'معالج النصوص', 'title_french': 'Traitement de texte'},
        ]

        # Second Cycle - 5 lessons (Applications and Programming)
        lessons_s2 = [
            {'order': 1, 'title': 'Excel Spreadsheet', 'title_arabic': 'جدول البيانات Excel', 'title_french': 'Tableur Excel'},
            {'order': 2, 'title': 'Programming Languages', 'title_arabic': 'لغات البرمجة', 'title_french': 'Les langages de programmation'},
            {'order': 3, 'title': 'Basic Control Structures', 'title_arabic': 'هياكل التحكم الأساسية', 'title_french': 'Structures de contrôle de base'},
            {'order': 4, 'title': 'Algorithm Concept and Basic Instructions', 'title_arabic': 'مفهوم الخوارزمية والتعليمات الأساسية', 'title_french': 'Notion d\'algorithme et Instructions de base'},
            {'order': 5, 'title': 'ASCII Table (0-127)', 'title_arabic': 'جدول ASCII (0-127)', 'title_french': 'Table ASCII (0-127)'},
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
            grade = Grade.objects.get(code='TC')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "TC" not found. Please create it first.')
            )
            return

        # Get all specified tracks
        track_codes = ['TCS', 'TCT', 'TCEO', 'TCIB', 'TCLH', 'TCT-BIOF', 'TCS-BIOF']
        tracks = []

        for track_code in track_codes:
            try:
                track = Track.objects.get(code=track_code)
                tracks.append(track)
                self.stdout.write(f'Found track: {track.name}')
            except Track.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'Track with code "{track_code}" not found. Please create it first.')
                )
                return

        if options['delete_existing']:
            self.stdout.write('Deleting existing TC IT lessons...')
            for track in tracks:
                existing_lessons = Lesson.objects.filter(
                    subject=subject,
                    grade=grade,
                    tracks__code=track.code
                )
                for lesson in existing_lessons:
                    if lesson.tracks.count() == 1:
                        lesson.delete()
                    else:
                        lesson.tracks.remove(track)
            self.stdout.write(self.style.WARNING('Removed existing IT lessons for TC tracks.'))

        self.stdout.write('Creating TC IT lessons...')
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
                    'description': f"IT - {lesson_data['title_arabic']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
            # Add all specified tracks to the lesson
            lesson.tracks.add(*tracks)

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
                    'description': f"IT - {lesson_data['title_arabic']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
            # Add all specified tracks to the lesson
            lesson.tracks.add(*tracks)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first cycle and {created_count_s2} new second cycle IT lessons for TC.'
            )
        )