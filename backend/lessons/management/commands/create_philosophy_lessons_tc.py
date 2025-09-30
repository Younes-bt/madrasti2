from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Philosophy lessons for TC (Tronc Commun)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing TC Philosophy lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 8 lessons (Introduction to Philosophy)
        lessons_s1 = [
            {'order': 1, 'title': 'General Introduction to Philosophy Module', 'title_arabic': 'تقديم عام لمجزوءة الفلسفة', 'title_french': 'Introduction générale au module de philosophie'},
            {'order': 2, 'title': 'The Origins of Philosophy', 'title_arabic': 'نشأة الفلسفة', 'title_french': 'Naissance de la philosophie'},
            {'order': 3, 'title': 'Milestones in the Development of Philosophy', 'title_arabic': 'محطات في تطور الفلسفة', 'title_french': 'Étapes du développement de la philosophie'},
            {'order': 4, 'title': 'Islamic Philosophy', 'title_arabic': 'الفلسفة الإسلامية', 'title_french': 'Philosophie islamique'},
            {'order': 5, 'title': 'Contemporary Western Philosophy', 'title_arabic': 'الفلسفة الغربية المعاصرة', 'title_french': 'Philosophie occidentale contemporaine'},
            {'order': 6, 'title': 'Why Philosophize?', 'title_arabic': 'لماذا التفلسف ؟', 'title_french': 'Pourquoi philosopher ?'},
            {'order': 7, 'title': 'Logic of Philosophy', 'title_arabic': 'منطق الفلسفة', 'title_french': 'Logique de la philosophie'},
            {'order': 8, 'title': 'Philosophy and Values', 'title_arabic': 'الفلسفة والقيم', 'title_french': 'Philosophie et valeurs'},
        ]

        # Second Cycle - 7 lessons (Nature and Culture Module)
        lessons_s2 = [
            {'order': 1, 'title': 'General Introduction to Nature and Culture Module', 'title_arabic': 'تقديم عام لمجزوءة الطبيعة والثقافة', 'title_french': 'Introduction générale au module nature et culture'},
            {'order': 2, 'title': 'Man as a Cultural Being', 'title_arabic': 'الإنسان كائن ثقافي', 'title_french': 'L\'homme être culturel'},
            {'order': 3, 'title': 'Man as a Linguistic Being', 'title_arabic': 'الإنسان كائن لغوي', 'title_french': 'L\'homme être linguistique'},
            {'order': 4, 'title': 'Institution as an Aspect of Culture', 'title_arabic': 'المؤسسة كمظهر من مظاهر الثقافة', 'title_french': 'L\'institution comme aspect de la culture'},
            {'order': 5, 'title': 'Distinction Between Nature and Culture', 'title_arabic': 'التمييز بين الطبيعة والثقافة', 'title_french': 'Distinction entre nature et culture'},
            {'order': 6, 'title': 'Nature and Human Activity', 'title_arabic': 'الطبيعة والنشاط الإنساني', 'title_french': 'Nature et activité humaine'},
            {'order': 7, 'title': 'From Domination of Nature to Harmony with It', 'title_arabic': 'من السيطرة على الطبيعة إلى الانسجام معها', 'title_french': 'De la domination de la nature à l\'harmonie avec elle'},
        ]

        try:
            subject = Subject.objects.get(code='PHIL101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code PHIL101 not found. Please ensure it exists.')
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
            self.stdout.write('Deleting existing TC Philosophy lessons...')
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
            self.stdout.write(self.style.WARNING('Removed existing Philosophy lessons for TC tracks.'))

        self.stdout.write('Creating TC Philosophy lessons...')
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
                    'description': f"Philosophy - {lesson_data['title_arabic']}",
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
                    'description': f"Philosophy - {lesson_data['title_arabic']}",
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
                f'Successfully created {created_count_s1} new first cycle and {created_count_s2} new second cycle Philosophy lessons for TC.'
            )
        )