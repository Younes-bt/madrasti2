from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create English lessons for TC (Tronc Commun)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing TC English lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 15 lessons (Introduction, Nouns, Pronouns, Basic Tenses)
        lessons_s1 = [
            # Introduction
            {'order': 1, 'title': 'Introduction to English', 'title_arabic': 'مقدمة في اللغة الإنجليزية', 'title_french': 'Introduction à l\'anglais'},
            {'order': 2, 'title': 'English Rules', 'title_arabic': 'قواعد اللغة الإنجليزية', 'title_french': 'Règles anglaises'},
            {'order': 3, 'title': 'English Alphabet', 'title_arabic': 'الأبجدية الإنجليزية', 'title_french': 'Alphabet anglais'},
            {'order': 4, 'title': 'Parts of Speech', 'title_arabic': 'أقسام الكلام', 'title_french': 'Parties du discours'},
            {'order': 5, 'title': 'Sentences', 'title_arabic': 'الجمل', 'title_french': 'Phrases'},
            # Nouns
            {'order': 6, 'title': 'Countable & Uncountable Nouns', 'title_arabic': 'الأسماء المعدودة وغير المعدودة', 'title_french': 'Noms dénombrables et indénombrables'},
            {'order': 7, 'title': 'Spelling Rules for Plurals', 'title_arabic': 'قواعد تهجئة الجمع', 'title_french': 'Règles d\'orthographe pour les pluriels'},
            {'order': 8, 'title': 'Definite & Indefinite Articles', 'title_arabic': 'أدوات التعريف والتنكير', 'title_french': 'Articles définis et indéfinis'},
            # Pronouns
            {'order': 9, 'title': 'Object Pronouns', 'title_arabic': 'ضمائر المفعول', 'title_french': 'Pronoms compléments'},
            {'order': 10, 'title': 'Reflexive Pronouns', 'title_arabic': 'الضمائر الانعكاسية', 'title_french': 'Pronoms réfléchis'},
            {'order': 11, 'title': 'Relative Pronouns', 'title_arabic': 'ضمائر الوصل', 'title_french': 'Pronoms relatifs'},
            # Basic Tenses
            {'order': 12, 'title': 'Present Simple', 'title_arabic': 'المضارع البسيط', 'title_french': 'Présent simple'},
            {'order': 13, 'title': 'Past Simple', 'title_arabic': 'الماضي البسيط', 'title_french': 'Passé simple'},
            {'order': 14, 'title': 'Future Simple', 'title_arabic': 'المستقبل البسيط', 'title_french': 'Futur simple'},
            {'order': 15, 'title': 'Present Continuous', 'title_arabic': 'المضارع المستمر', 'title_french': 'Présent continu'},
        ]

        # Second Cycle - 16 lessons (Advanced Tenses, Verbs, Varied Topics)
        lessons_s2 = [
            # Advanced Tenses
            {'order': 1, 'title': 'Past Continuous', 'title_arabic': 'الماضي المستمر', 'title_french': 'Passé continu'},
            {'order': 2, 'title': 'Future Continuous', 'title_arabic': 'المستقبل المستمر', 'title_french': 'Futur continu'},
            {'order': 3, 'title': 'Present Perfect', 'title_arabic': 'المضارع التام', 'title_french': 'Présent parfait'},
            {'order': 4, 'title': 'Past Perfect', 'title_arabic': 'الماضي التام', 'title_french': 'Passé parfait'},
            {'order': 5, 'title': 'Future Perfect', 'title_arabic': 'المستقبل التام', 'title_french': 'Futur parfait'},
            {'order': 6, 'title': 'Present Perfect Continuous', 'title_arabic': 'المضارع التام المستمر', 'title_french': 'Présent parfait continu'},
            {'order': 7, 'title': 'Active & Passive Voice', 'title_arabic': 'المبني للمعلوم والمجهول', 'title_french': 'Voix active et passive'},
            # Verbs
            {'order': 8, 'title': 'Verb to BE', 'title_arabic': 'فعل الكينونة', 'title_french': 'Verbe être'},
            {'order': 9, 'title': 'Verb to DO', 'title_arabic': 'فعل العمل', 'title_french': 'Verbe faire'},
            {'order': 10, 'title': 'Verb to HAVE', 'title_arabic': 'فعل الملكية', 'title_french': 'Verbe avoir'},
            {'order': 11, 'title': 'Transitive & Intransitive Verbs', 'title_arabic': 'الأفعال المتعدية واللازمة', 'title_french': 'Verbes transitifs et intransitifs'},
            # Varied Topics
            {'order': 12, 'title': 'Question Words (How)', 'title_arabic': 'أدوات الاستفهام (كيف)', 'title_french': 'Mots interrogatifs (Comment)'},
            {'order': 13, 'title': 'Some & Any', 'title_arabic': 'بعض وأي', 'title_french': 'Some & Any'},
            {'order': 14, 'title': 'Making Questions', 'title_arabic': 'تكوين الأسئلة', 'title_french': 'Formation des questions'},
            {'order': 15, 'title': 'Making Negatives', 'title_arabic': 'تكوين النفي', 'title_french': 'Formation du négatif'},
            {'order': 16, 'title': 'Since & For', 'title_arabic': 'منذ ولمدة', 'title_french': 'Depuis & Pour'},
        ]

        try:
            subject = Subject.objects.get(code='ENGL101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code ENGL101 not found. Please ensure it exists.')
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
            self.stdout.write('Deleting existing TC English lessons...')
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
            self.stdout.write(self.style.WARNING('Removed existing English lessons for TC tracks.'))

        self.stdout.write('Creating TC English lessons...')
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
                    'description': f"English - {lesson_data['title']}",
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
                    'description': f"English - {lesson_data['title']}",
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
                f'Successfully created {created_count_s1} new first cycle and {created_count_s2} new second cycle English lessons for TC.'
            )
        )