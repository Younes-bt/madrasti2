from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Arabic lessons for TC Literature tracks (Tronc Commun)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing TC Arabic lessons for Literature tracks before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 15 lessons (Language, Texts, Expression, Literature)
        lessons_s1 = [
            # Language Lessons - First Cycle
            {'order': 1, 'title': 'Rhetoric of Entertainment', 'title_arabic': 'بلاغة الإمتاع', 'title_french': 'Rhétorique du divertissement'},
            {'order': 2, 'title': 'Rhetoric of Persuasion', 'title_arabic': 'بلاغة الإقناع', 'title_french': 'Rhétorique de la persuasion'},
            {'order': 3, 'title': 'Statement and Construction', 'title_arabic': 'الخبر والإنشاء', 'title_french': 'Énoncé et construction'},
            {'order': 4, 'title': 'Statement - Its Purposes and Departure from the Apparent Requirement', 'title_arabic': 'الخبر – أغراضه وخروجه عن مقتضى الظاهر', 'title_french': 'Énoncé - ses objectifs et sa déviation de l\'exigence apparente'},
            {'order': 5, 'title': 'Simile - Its Elements and Divisions', 'title_arabic': 'التشبيه – أركانه وأقسامه', 'title_french': 'Similitude - ses éléments et divisions'},
            {'order': 6, 'title': 'Reality and Metaphor', 'title_arabic': 'الحقيقة والمجاز', 'title_french': 'Réalité et métaphore'},
            {'order': 7, 'title': 'Metaphor - Its Definition and Elements', 'title_arabic': 'الإستعارة – تعريفها وأركانها', 'title_french': 'Métaphore - sa définition et ses éléments'},
            # Text Lessons - First Cycle
            {'order': 8, 'title': 'Storytelling (Narrative Text)', 'title_arabic': 'الحكي (النص السردي)', 'title_french': 'Narration (texte narratif)'},
            {'order': 9, 'title': 'Storytelling (Descriptive Text)', 'title_arabic': 'الحكي (النص الوصفي)', 'title_french': 'Narration (texte descriptif)'},
            {'order': 10, 'title': 'Storytelling (Dialogue Text)', 'title_arabic': 'الحكي (النص الحواري)', 'title_french': 'Narration (texte dialogique)'},
            {'order': 11, 'title': 'Argumentation (Informative Text)', 'title_arabic': 'الحجاج (النص الإخباري)', 'title_french': 'Argumentation (texte informatif)'},
            {'order': 12, 'title': 'Argumentation (Explanatory Text)', 'title_arabic': 'الحجاج (النص التفسيري)', 'title_french': 'Argumentation (texte explicatif)'},
            {'order': 13, 'title': 'Argumentation (Persuasive Text)', 'title_arabic': 'الحجاج (النص الإقناعي)', 'title_french': 'Argumentation (texte persuasif)'},
            # Expression - First Cycle
            {'order': 14, 'title': 'Skill of Producing Narrative Text', 'title_arabic': 'مهارة إنتاج نص حكائي', 'title_french': 'Compétence de production de texte narratif'},
            {'order': 15, 'title': 'Skill of Producing Argumentative Text', 'title_arabic': 'مهارة إنتاج نص حجاجي', 'title_french': 'Compétence de production de texte argumentatif'},
        ]

        # Second Cycle - 16 lessons (Language, Texts, Expression, Literature)
        lessons_s2 = [
            # Language Lessons - Second Cycle
            {'order': 1, 'title': 'Alliteration', 'title_arabic': 'الجناس', 'title_french': 'Allitération'},
            {'order': 2, 'title': 'Rhymed Prose', 'title_arabic': 'السجع', 'title_french': 'Prose rimée'},
            {'order': 3, 'title': 'Quotation', 'title_arabic': 'الاقتباس', 'title_french': 'Citation'},
            {'order': 4, 'title': 'Antithesis and Contrast', 'title_arabic': 'الطباق والمقابلة', 'title_french': 'Antithèse et contraste'},
            {'order': 5, 'title': 'Prosodic Writing', 'title_arabic': 'الكتابة العروضية', 'title_french': 'Écriture prosodique'},
            {'order': 6, 'title': 'Poetic Variations and Defects', 'title_arabic': 'الزحافات والعلل', 'title_french': 'Variations et défauts poétiques'},
            {'order': 7, 'title': 'The Long Meter (Taweel)', 'title_arabic': 'بحر الطويل', 'title_french': 'Mètre long (Taweel)'},
            {'order': 8, 'title': 'The Simple Meter (Baseet)', 'title_arabic': 'بحر البسيط', 'title_french': 'Mètre simple (Baseet)'},
            # Text Lessons - Second Cycle
            {'order': 9, 'title': 'Classical Poetry (Praise Poetry)', 'title_arabic': 'الشعر العمودي (شعر المدح)', 'title_french': 'Poésie classique (poésie de louange)'},
            {'order': 10, 'title': 'Classical Poetry (Descriptive Poetry)', 'title_arabic': 'الشعر العمودي (شعر الوصف)', 'title_french': 'Poésie classique (poésie descriptive)'},
            {'order': 11, 'title': 'Classical Poetry (Love Poetry)', 'title_arabic': 'الشعر العمودي ( شعر الغزل)', 'title_french': 'Poésie classique (poésie amoureuse)'},
            {'order': 12, 'title': 'Free Verse Poetry (City Poetry)', 'title_arabic': 'شعر التفعيلة (شعر المدينة)', 'title_french': 'Poésie en vers libre (poésie de la ville)'},
            {'order': 13, 'title': 'Free Verse Poetry (Poetry of Alienation)', 'title_arabic': 'شعر التفعيلة (شعر الاغتراب)', 'title_french': 'Poésie en vers libre (poésie de l\'aliénation)'},
            {'order': 14, 'title': 'Free Verse Poetry (Poetry of Struggle and Resistance)', 'title_arabic': 'شعر التفعيلة (شعر النضال والمقاومة)', 'title_french': 'Poésie en vers libre (poésie de lutte et de résistance)'},
            # Expression - Second Cycle
            {'order': 15, 'title': 'Skill of Converting Poetic Text', 'title_arabic': 'مهارة تحويل نص شعري', 'title_french': 'Compétence de conversion de texte poétique'},
            {'order': 16, 'title': 'Skill of Expanding Poetic Passage', 'title_arabic': 'مهارة توسيع مقطع شعري', 'title_french': 'Compétence d\'expansion de passage poétique'},
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
            grade = Grade.objects.get(code='TC')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "TC" not found. Please create it first.')
            )
            return

        # Get Literature tracks
        track_codes = ['TCLH', 'TCEO']
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
            self.stdout.write('Deleting existing TC Arabic lessons for Literature tracks...')
            for track in tracks:
                existing_lessons = Lesson.objects.filter(
                    subject=subject,
                    grade=grade,
                    tracks__code=track.code
                )
                for lesson in existing_lessons:
                    if lesson.tracks.count() == 1:  # Only delete if this is the only track
                        lesson.delete()
                    else:
                        lesson.tracks.remove(track)  # Just remove from this track
            self.stdout.write(self.style.WARNING('Removed existing lessons for Literature tracks.'))

        self.stdout.write('Creating TC Arabic lessons for Literature tracks...')
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
                    'description': f"Arabic - {lesson_data['title_arabic']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
            # Add Literature tracks to the lesson
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
                    'description': f"Arabic - {lesson_data['title_arabic']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
            # Add Literature tracks to the lesson
            lesson.tracks.add(*tracks)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Arabic lessons for TC Literature tracks.'
            )
        )