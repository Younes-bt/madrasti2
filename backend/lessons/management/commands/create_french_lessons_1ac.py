from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create French lessons for 1AC (Première Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 1AC French lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - First Semester (8 lessons)
        lessons_s1 = [
            {'order': 1, 'title': 'The Verb', 'title_arabic': 'الفعل', 'title_french': 'Le verbe'},
            {'order': 2, 'title': 'Past Perfect', 'title_arabic': 'الماضي المركب', 'title_french': 'Le passé composé'},
            {'order': 3, 'title': 'Narrative Tenses: Imperfect and Simple Past', 'title_arabic': 'أزمنة السرد: الماضي الناقص والماضي البسيط', 'title_french': 'Les temps du récit: l\'imparfait et le passé simple'},
            {'order': 4, 'title': 'Transitive and Intransitive Verbs', 'title_arabic': 'الأفعال المتعدية والأفعال اللازمة', 'title_french': 'Les verbes transitifs et les verbes intransitifs'},
            {'order': 5, 'title': 'Direct Object - Indirect Object', 'title_arabic': 'المفعول المباشر - المفعول غير المباشر', 'title_french': 'Le complément d\'objet direct (COD) – Le complément d\'objet indirect (COI)'},
            {'order': 6, 'title': 'Irregular Verbs', 'title_arabic': 'الأفعال الشاذة', 'title_french': 'Les verbes irréguliers'},
            {'order': 7, 'title': 'Circumstantial Complements', 'title_arabic': 'المتممات الظرفية', 'title_french': 'Les compléments circonstanciels'},
            {'order': 8, 'title': 'Past Tenses (Narrative Tenses)', 'title_arabic': 'أزمنة الماضي (أزمنة السرد)', 'title_french': 'Les temps du passé (temps du récit)'},
        ]

        # Second Cycle - Second Semester (8 lessons)
        lessons_s2 = [
            {'order': 1, 'title': 'Nominal Group: Gender and Number Categories', 'title_arabic': 'المجموعة الاسمية: فئات الجنس والعدد', 'title_french': 'Le groupe nominal : catégories du genre et du nombre'},
            {'order': 2, 'title': 'Determiners: Articles', 'title_arabic': 'المحددات: أدوات التعريف', 'title_french': 'Les déterminants : les articles'},
            {'order': 3, 'title': 'Possessive and Demonstrative Adjectives', 'title_arabic': 'الصفة الملكية والصفة الإشارية', 'title_french': 'L\'adjectif possessif et l\'adjectif démonstratif'},
            {'order': 4, 'title': 'Noun Expansion: Qualifying Adjective', 'title_arabic': 'توسيع الاسم: الصفة المؤهلة', 'title_french': 'L\'expansion du nom : l\'adjectif qualificatif'},
            {'order': 5, 'title': 'Noun Expansion: Noun Complement', 'title_arabic': 'توسيع الاسم: مكمل الاسم', 'title_french': 'L\'expansion du nom : le complément du nom'},
            {'order': 6, 'title': 'Noun Expansion: Relative Clause', 'title_arabic': 'توسيع الاسم: الجملة النسبية', 'title_french': 'L\'expansion du nom : la subordonnée relative'},
            {'order': 7, 'title': 'Homonyms and Antonyms', 'title_arabic': 'المتجانسات والمتضادات', 'title_french': 'Les homonymes et les antonymes'},
            {'order': 8, 'title': 'Plural of Compound Nouns', 'title_arabic': 'جمع الأسماء المركبة', 'title_french': 'Le pluriel des noms composés'},
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
            self.stdout.write('Deleting existing 1AC French lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating 1AC French lessons for this subject...')
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term French lessons for 1AC.'
            )
        )