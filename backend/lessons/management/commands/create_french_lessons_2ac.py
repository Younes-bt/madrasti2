from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create French lessons for 2AC (Deuxième Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 2AC French lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 9 lessons
        lessons_s1 = [
            {'order': 1, 'title': 'Expression of Intensity', 'title_arabic': 'التعبير عن الشدة', 'title_french': 'Expression de l\'intensité'},
            {'order': 2, 'title': 'Adjective Agreement', 'title_arabic': 'توافق الصفة', 'title_french': 'L\'accord de l\'adjectif'},
            {'order': 3, 'title': 'Reported Speech', 'title_arabic': 'الكلام المنقول', 'title_french': 'Le discours rapporté'},
            {'order': 4, 'title': 'Conjugation', 'title_arabic': 'التصريف', 'title_french': 'La conjugaison'},
            {'order': 5, 'title': 'Lexical Field', 'title_arabic': 'المجال المعجمي', 'title_french': 'Le champ lexical'},
            {'order': 6, 'title': 'Indirect Speech', 'title_arabic': 'الكلام غير المباشر', 'title_french': 'Le Discours indirect'},
            {'order': 7, 'title': 'Narrative Text', 'title_arabic': 'النص السردي', 'title_french': 'Le Texte Narratif'},
            {'order': 8, 'title': 'Color Adjectives', 'title_arabic': 'صفات الألوان', 'title_french': 'Les Adjectifs de couleurs'},
            {'order': 9, 'title': 'Word Classes', 'title_arabic': 'فئات الكلمات', 'title_french': 'Les classes de mots'},
        ]

        # Second Cycle - 6 lessons
        lessons_s2 = [
            {'order': 1, 'title': 'Different Types of Sentences', 'title_arabic': 'أنواع الجمل المختلفة', 'title_french': 'Les différentes Types de phrases'},
            {'order': 2, 'title': 'Word Families', 'title_arabic': 'عائلات الكلمات', 'title_french': 'Les familles de mots'},
            {'order': 3, 'title': 'Personal Pronouns', 'title_arabic': 'الضمائر الشخصية', 'title_french': 'Les pronoms personnels'},
            {'order': 4, 'title': 'Subordinate Clauses', 'title_arabic': 'الجمل التابعة', 'title_french': 'Les propositions subordonnées'},
            {'order': 5, 'title': 'Interrogative Sentence', 'title_arabic': 'الجملة الاستفهامية', 'title_french': 'Phrase interrogative'},
            {'order': 6, 'title': 'Active and Passive Voice', 'title_arabic': 'المبني للمعلوم والمبني للمجهول', 'title_french': 'Voix active et voix passive'},
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
            self.stdout.write('Deleting existing 2AC French lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating 2AC French lessons for this subject...')
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
                    'description': f"French - {lesson_data['title_french']}",
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term French lessons for 2AC.'
            )
        )