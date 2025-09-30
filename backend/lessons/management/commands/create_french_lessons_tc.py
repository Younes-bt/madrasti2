from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create French lessons for TC (Tronc Commun)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing TC French lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - French Literature (Text Typology, Realist Stories)
        lessons_s1 = [
            {'order': 1, 'title': 'Text Typology', 'title_arabic': 'التصنيف النصي', 'title_french': 'Typologie textuelle'},
            {'order': 2, 'title': 'Text Type Sheets', 'title_arabic': 'بطائق أنواع النصوص', 'title_french': 'Fiches types de textes'},
            {'order': 3, 'title': 'Narrative Structure of a Story', 'title_arabic': 'المخطط السردي للحكاية', 'title_french': 'Le schéma narratif d\'un récit'},
            {'order': 4, 'title': 'Time Treatment in a Narrative', 'title_arabic': 'معالجة الزمن في السرد', 'title_french': 'Le traitement du temps dans un récit'},
            {'order': 5, 'title': 'The Literary Short Story', 'title_arabic': 'القصة القصيرة الأدبية', 'title_french': 'La nouvelle littéraire'},
            {'order': 6, 'title': 'The Realist Short Story', 'title_arabic': 'القصة القصيرة الواقعية', 'title_french': 'La nouvelle réaliste'},
            {'order': 7, 'title': 'Biography of Guy de Maupassant', 'title_arabic': 'سيرة غي دو موباسان', 'title_french': 'Biographie de Guy de Maupassant'},
            {'order': 8, 'title': 'La Ficelle: Presentation', 'title_arabic': 'الخيط: تقديم', 'title_french': 'La Ficelle : Présentation'},
            {'order': 9, 'title': 'La Ficelle: Main Characters and Events', 'title_arabic': 'الخيط: الشخصيات والأحداث الرئيسية', 'title_french': 'La Ficelle : Personnages et événements principaux'},
            {'order': 10, 'title': 'La Ficelle: Narrative Structure', 'title_arabic': 'الخيط: البنية السردية', 'title_french': 'La Ficelle : Schéma narratif'},
            {'order': 11, 'title': 'La Ficelle: Themes', 'title_arabic': 'الخيط: المواضيع', 'title_french': 'La Ficelle : Thèmes'},
            {'order': 12, 'title': 'Aux champs: Presentation', 'title_arabic': 'في الحقول: تقديم', 'title_french': 'Aux champs : Présentation'},
            {'order': 13, 'title': 'Aux champs: Analysis', 'title_arabic': 'في الحقول: تحليل', 'title_french': 'Aux champs : Analyse'},
            {'order': 14, 'title': 'Aux champs: Characters', 'title_arabic': 'في الحقول: الشخصيات', 'title_french': 'Aux champs : Personnages'},
            {'order': 15, 'title': 'Aux champs: Narrative Structure', 'title_arabic': 'في الحقول: البنية السردية', 'title_french': 'Aux champs : Structure narrative'},
            {'order': 16, 'title': 'Aux champs: Peasant Jargon', 'title_arabic': 'في الحقول: لهجة الفلاحين', 'title_french': 'Aux champs : Jargon des paysans'},
            {'order': 17, 'title': 'Aux champs: Actantial Schemes of Acting Forces', 'title_arabic': 'في الحقول: المخططات العاملية للقوى الفاعلة', 'title_french': 'Aux champs : Schémas actantiels des forces agissantes'},
            {'order': 18, 'title': 'Aux champs: Time Management in the Narrative', 'title_arabic': 'في الحقول: إدارة الزمن في السرد', 'title_french': 'Aux champs : Gestion du temps dans le récit'},
        ]

        # Second Cycle - Fantastic Stories and Theater
        lessons_s2 = [
            {'order': 1, 'title': 'The Fantastic Short Story', 'title_arabic': 'القصة القصيرة الخيالية', 'title_french': 'La nouvelle fantastique'},
            {'order': 2, 'title': 'Biography of Théophile Gautier', 'title_arabic': 'سيرة تيوفيل غوتييه', 'title_french': 'Biographie de Théophile Gautier'},
            {'order': 3, 'title': 'Le chevalier double: Reading Sheet', 'title_arabic': 'الفارس المزدوج: بطاقة قراءة', 'title_french': 'Le chevalier double : Fiche de lecture'},
            {'order': 4, 'title': 'Le chevalier double: Analysis', 'title_arabic': 'الفارس المزدوج: تحليل', 'title_french': 'Le chevalier double : Analyse'},
            {'order': 5, 'title': 'Le chevalier double: Narrative and Actantial Schemes', 'title_arabic': 'الفارس المزدوج: المخططات السردية والعاملية', 'title_french': 'Le chevalier double : Schéma narratif et schéma actanciel'},
            {'order': 6, 'title': 'Theater', 'title_arabic': 'المسرح', 'title_french': 'Le théâtre'},
            {'order': 7, 'title': 'Biography of Molière', 'title_arabic': 'سيرة موليير', 'title_french': 'Biographie de Molière'},
            {'order': 8, 'title': 'Le Bourgeois gentilhomme: Reading Sheet', 'title_arabic': 'البرجوازي النبيل: بطاقة قراءة', 'title_french': 'Le Bourgeois gentilhomme : Fiche de lecture'},
            {'order': 9, 'title': 'Le Bourgeois gentilhomme: Analysis', 'title_arabic': 'البرجوازي النبيل: تحليل', 'title_french': 'Le Bourgeois gentilhomme : Analyse'},
            {'order': 10, 'title': 'Le Bourgeois gentilhomme: Characters', 'title_arabic': 'البرجوازي النبيل: الشخصيات', 'title_french': 'Le Bourgeois gentilhomme : Personnages'},
        ]

        try:
            subject = Subject.objects.get(code='FREN101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code FREN101 not found. Please ensure it exists.')
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
            self.stdout.write('Deleting existing TC French lessons...')
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
            self.stdout.write(self.style.WARNING('Removed existing French lessons for TC tracks.'))

        self.stdout.write('Creating TC French lessons...')
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
                    'description': f"French - {lesson_data['title_french']}",
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
                    'description': f"French - {lesson_data['title_french']}",
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
                f'Successfully created {created_count_s1} new first cycle and {created_count_s2} new second cycle French lessons for TC.'
            )
        )