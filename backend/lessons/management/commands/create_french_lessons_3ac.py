from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create French lessons for 3AC (Troisième Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 3AC French lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 18 lessons (Grammar and Written Expression)
        lessons_s1 = [
            # Grammar lessons
            {'order': 1, 'title': 'Characterizing a Noun', 'title_arabic': 'تمييز الاسم', 'title_french': 'Caractériser un nom'},
            {'order': 2, 'title': 'Simple Relative Pronouns: qui, que, où, dont', 'title_arabic': 'الضمائر النسبية البسيطة', 'title_french': 'Les pronoms relatifs simples qui; que; où; dont'},
            {'order': 3, 'title': 'Relative Clause as Adjective or Noun Complement', 'title_arabic': 'الجملة النسبية كصفة أو مكمل للاسم', 'title_french': 'La subordonnée relative à valeur d\'adjectif ou de complément de nom'},
            {'order': 4, 'title': 'Qualifying Adjective: Nature, Function and Agreement', 'title_arabic': 'الصفة المؤهلة: الطبيعة والوظيفة والتوافق', 'title_french': 'L\'adjectif qualificatif nature; fonction et accord'},
            {'order': 5, 'title': 'Past Participle Agreement with Auxiliary Avoir', 'title_arabic': 'توافق اسم المفعول مع الفعل المساعد', 'title_french': 'Accord du participe passé employé avec l\'auxiliaire avoir'},
            {'order': 6, 'title': 'Personal Pronouns: le, la, l\', les, lui, leur', 'title_arabic': 'الضمائر الشخصية', 'title_french': 'Les pronoms personnels le; la; l\'; les; lui; leur'},
            {'order': 7, 'title': 'Passive Voice', 'title_arabic': 'المبني للمجهول', 'title_french': 'La voix passive'},
            {'order': 8, 'title': 'Narrative Tenses: Imperfect and Simple Past', 'title_arabic': 'أزمنة السرد: الماضي الناقص والماضي البسيط', 'title_french': 'Les temps du récit l\'imparfait et le passé simple'},
            {'order': 9, 'title': 'Past Tenses (Narrative Tenses)', 'title_arabic': 'أزمنة الماضي (أزمنة السرد)', 'title_french': 'Les temps du passé (temps du récit)'},

            # Written Expression lessons
            {'order': 10, 'title': 'Writing about Natural Disasters', 'title_arabic': 'الكتابة عن الكوارث الطبيعية', 'title_french': 'Expression écrite sur comment décrire une catastrophe naturelle'},
            {'order': 11, 'title': 'Writing about Education in Morocco', 'title_arabic': 'الكتابة عن التعليم في المغرب', 'title_french': 'Expression écrite sur l\'éducation au Maroc'},
            {'order': 12, 'title': 'Writing about Enterprise as Human Cell', 'title_arabic': 'الكتابة عن المؤسسة كخلية بشرية', 'title_french': 'Expression écrite sur L\'entreprise en tant que celluce humaine (sociale)'},
            {'order': 13, 'title': 'Writing about Environment', 'title_arabic': 'الكتابة عن البيئة', 'title_french': 'Expression écrite sur l\'environnement'},
            {'order': 14, 'title': 'Writing about Immigration', 'title_arabic': 'الكتابة عن الهجرة', 'title_french': 'Expression écrite sur l\'immigration'},
            {'order': 15, 'title': 'Writing about Injustice', 'title_arabic': 'الكتابة عن الظلم', 'title_french': 'Expression écrite sur l\'injustice'},
            {'order': 16, 'title': 'Writing about Weekly Market in Morocco', 'title_arabic': 'الكتابة عن السوق الأسبوعي في المغرب', 'title_french': 'Expression écrite sur la description d\'un marché hebdomadaire au Maroc'},
            {'order': 17, 'title': 'Writing about Mother', 'title_arabic': 'الكتابة عن الأم', 'title_french': 'Expression écrite sur la maman'},
            {'order': 18, 'title': 'Writing about Pollution', 'title_arabic': 'الكتابة عن التلوث', 'title_french': 'Expression écrite sur la pollution'},
        ]

        # Second Cycle - 16 lessons (Grammar, Expression, and Literature)
        lessons_s2 = [
            # Grammar lessons
            {'order': 1, 'title': 'Direct and Indirect Speech (Declarative Sentence)', 'title_arabic': 'الكلام المباشر وغير المباشر (الجملة التقريرية)', 'title_french': 'Le discours direct et le discours indirect (Phrase déclarative)'},
            {'order': 2, 'title': 'Interrogative and Imperative Sentences in Reported Speech', 'title_arabic': 'الجملة الاستفهامية والأمرية في الكلام المنقول', 'title_french': 'La phrase interrogative et la phrase impérative au discours rapporté'},
            {'order': 3, 'title': 'Coordination', 'title_arabic': 'التنسيق', 'title_french': 'La coordination'},
            {'order': 4, 'title': 'Independent, Main and Subordinate Clauses', 'title_arabic': 'الجمل المستقلة والرئيسية والتابعة', 'title_french': 'Propositions indépendante; principale et subordonnée'},
            {'order': 5, 'title': 'Circumstantial Clause of Cause', 'title_arabic': 'الجملة الظرفية للسبب', 'title_french': 'La subordonnée circonstancielle de cause'},
            {'order': 6, 'title': 'Circumstantial Clause of Opposition or Concession', 'title_arabic': 'الجملة الظرفية للمعارضة أو التنازل', 'title_french': 'La subordonnée circonstancielle d\'opposition ou de concession'},
            {'order': 7, 'title': 'Circumstantial Clause of Purpose', 'title_arabic': 'الجملة الظرفية للغرض', 'title_french': 'La subordonnée circonstancielle de but'},
            {'order': 8, 'title': 'Circumstantial Clause of Consequence', 'title_arabic': 'الجملة الظرفية للنتيجة', 'title_french': 'La subordonnée circonstancielle de conséquence'},

            # More Written Expression
            {'order': 9, 'title': 'Writing about Tolerance', 'title_arabic': 'الكتابة عن التسامح', 'title_french': 'Expression écrite sur la tolérance'},
            {'order': 10, 'title': 'Writing about Religious Fanaticism', 'title_arabic': 'الكتابة عن التعصب الديني', 'title_french': 'Expression écrite sur le fanatisme religieux au Maroc (Musulman)'},
            {'order': 11, 'title': 'Writing about Morocco', 'title_arabic': 'الكتابة عن المغرب', 'title_french': 'Expression écrite sur le Maroc'},
            {'order': 12, 'title': 'Writing about Women\'s Role', 'title_arabic': 'الكتابة عن دور المرأة', 'title_french': 'Expression écrite sur le rôle de la femme'},
            {'order': 13, 'title': 'Writing about Child Labor', 'title_arabic': 'الكتابة عن عمالة الأطفال', 'title_french': 'Expression écrite sur le travail des enfants'},

            # Literature Study
            {'order': 14, 'title': 'Biography of Robert Louis Stevenson', 'title_arabic': 'سيرة روبرت لويس ستيفنسون', 'title_french': 'Biographie de Robert Louis Stevenson'},
            {'order': 15, 'title': 'Analysis of "Treasure Island"', 'title_arabic': 'تحليل "جزيرة الكنز"', 'title_french': 'Analyse de "L\'île au Trésor"'},
            {'order': 16, 'title': 'Character Study of "Treasure Island"', 'title_arabic': 'دراسة شخصيات "جزيرة الكنز"', 'title_french': 'Etude des personnages de "L\'Ile au Trésor"'},
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
            self.stdout.write('Deleting existing 3AC French lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating 3AC French lessons for this subject...')
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term French lessons for 3AC.'
            )
        )