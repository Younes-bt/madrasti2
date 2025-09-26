from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create Arabic lessons for Tronc Commun (Common Core)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing Tronc Commun Arabic lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # Arabic lessons data for Tronc Commun
        lessons_s1 = [
            {
                'order': 1,
                'title': 'The rhetoric of enjoyment / The rhetoric of rhythm',
                'title_arabic': 'بلاغة الإمتاع / بلاغة الإيقاع',
                'title_french': 'La rhétorique du plaisir / La rhétorique du rythme',
            },
            {
                'order': 2,
                'title': 'Informative and performative utterances',
                'title_arabic': 'الخبر والإنشاء',
                'title_french': 'L\'énonciatif et le performatif',
            },
            {
                'order': 3,
                'title': 'The informative utterance - its purposes and deviation from the apparent meaning',
                'title_arabic': 'الخبر – أغراضه وخروجه عن مقتضى الظاهر',
                'title_french': 'L\'énoncé informatif - ses buts et sa déviation du sens apparent',
            },
            {
                'order': 4,
                'title': 'Simile - its components and types',
                'title_arabic': 'التشبيه – أركانه وأقسامه',
                'title_french': 'La comparaison - ses piliers et ses types',
            },
            {
                'order': 5,
                'title': 'Literal and figurative language',
                'title_arabic': 'الحقيقة والمجاز',
                'title_french': 'Le sens propre et le sens figuré',
            },
            {
                'order': 6,
                'title': 'Metaphor - its definition and components',
                'title_arabic': 'الاستعارة – تعريفها وأركانها',
                'title_french': 'La métaphore - sa définition et ses piliers',
            },
            {
                'order': 7,
                'title': 'Narration (The narrative text)',
                'title_arabic': 'الحكي (النص السردي)',
                'title_french': 'Le récit (Le texte narratif)',
            },
            {
                'order': 8,
                'title': 'Narration (The descriptive text)',
                'title_arabic': 'الحكي (النص الوصفي)',
                'title_french': 'Le récit (Le texte descriptif)',
            },
            {
                'order': 9,
                'title': 'Narration (The dialogic text)',
                'title_arabic': 'الحكي (النص الحواري)',
                'title_french': 'Le récit (Le texte dialogique)',
            },
            {
                'order': 10,
                'title': 'Argumentation (The informative text)',
                'title_arabic': 'الحجاج (النص الإخباري)',
                'title_french': 'L\'argumentation (Le texte informatif)',
            },
            {
                'order': 11,
                'title': 'Argumentation (The expository text)',
                'title_arabic': 'الحجاج (النص التفسيري)',
                'title_french': 'L\'argumentation (Le texte explicatif)',
            },
            {
                'order': 12,
                'title': 'Argumentation (The persuasive text)',
                'title_arabic': 'الحجاج (النص الإقناعي)',
                'title_french': 'L\'argumentation (Le texte persuasif)',
            },
            {
                'order': 13,
                'title': 'Skill of producing a narrative text',
                'title_arabic': 'مهارة إنتاج نص حكائي',
                'title_french': 'La compétence de produire un texte narratif',
            },
            {
                'order': 14,
                'title': 'Skill of producing an argumentative text',
                'title_arabic': 'مهارة إنتاج نص حجاجي',
                'title_french': 'La compétence de produire un texte argumentatif',
            },
        ]

        lessons_s2 = [
            {
                'order': 1,
                'title': 'Paronomasia (Pun)',
                'title_arabic': 'الجناس',
                'title_french': 'La paronomase',
            },
            {
                'order': 2,
                'title': 'Rhyming prose',
                'title_arabic': 'السجع',
                'title_french': 'La prose rimée (saj\')',
            },
            {
                'order': 3,
                'title': 'Quotation / Intertextuality',
                'title_arabic': 'الإقتباس',
                'title_french': 'L\'intertextualité (iqtibâs)',
            },
            {
                'order': 4,
                'title': 'Antithesis and contrast',
                'title_arabic': 'الطباق والمقابلة',
                'title_french': 'L\'antithèse et le contraste',
            },
            {
                'order': 5,
                'title': 'Prosodic writing',
                'title_arabic': 'الكتابة العروضية',
                'title_french': 'L\'écriture prosodique',
            },
            {
                'order': 6,
                'title': 'Metrical variations and deviations',
                'title_arabic': 'الزحافات والعلل',
                'title_french': 'Les variations et déviations métriques',
            },
            {
                'order': 7,
                'title': 'The "Tawil" meter',
                'title_arabic': 'بحر الطويل',
                'title_french': 'Le mètre "Tawîl"',
            },
            {
                'order': 8,
                'title': 'The "Basit" meter',
                'title_arabic': 'بحر البسيط',
                'title_french': 'Le mètre "Basît"',
            },
            {
                'order': 9,
                'title': 'Classical poetry (Praise poetry)',
                'title_arabic': 'الشعر العمودي (شعر المدح)',
                'title_french': 'La poésie classique (La poésie de l\'éloge)',
            },
            {
                'order': 10,
                'title': 'Classical poetry (Descriptive poetry)',
                'title_arabic': 'الشعر العمودي (شعر الوصف)',
                'title_french': 'La poésie classique (La poésie descriptive)',
            },
            {
                'order': 11,
                'title': 'Classical poetry (Love poetry)',
                'title_arabic': 'الشعر العمودي (شعر الغزل)',
                'title_french': 'La poésie classique (La poésie d\'amour)',
            },
            {
                'order': 12,
                'title': 'Free verse (Poetry of the city)',
                'title_arabic': 'شعر التفعيلة (شعر المدينة)',
                'title_french': 'La poésie en vers libres (La poésie de la ville)',
            },
            {
                'order': 13,
                'title': 'Free verse (Poetry of alienation/exile)',
                'title_arabic': 'شعر التفعيلة (شعر الاغتراب)',
                'title_french': 'La poésie en vers libres (La poésie de l\'exil)',
            },
            {
                'order': 14,
                'title': 'Free verse (Poetry of struggle and resistance)',
                'title_arabic': 'شعر التفعيلة (شعر النضال والمقاومة)',
                'title_french': 'La poésie en vers libres (La poésie du combat et de la résistance)',
            },
            {
                'order': 15,
                'title': 'Skill of transforming a poetic text',
                'title_arabic': 'مهارة تحويل نص شعري',
                'title_french': 'La compétence de transformer un texte poétique',
            },
            {
                'order': 16,
                'title': 'Skill of expanding a poetic passage',
                'title_arabic': 'مهارة توسيع مقطع شعري',
                'title_french': 'La compétence de développer un passage poétique',
            },
            {
                'order': 17,
                'title': 'The Latin Quarter (by Suhayl Idris)',
                'title_arabic': 'الحي اللاتيني (سهيل إدريس)',
                'title_french': 'Le Quartier Latin (Suhayl Idriss)',
            },
            {
                'order': 18,
                'title': 'The Cloak (by Azz al-Din al-Tazi)',
                'title_arabic': 'العباءة (عز الدين التازي)',
                'title_french': 'Le Manteau (Azz Eddine Tazi)',
            },
            {
                'order': 19,
                'title': 'Ain Al Faras (The Mare\'s Eye) (by Miloudi Chaghmoum)',
                'title_arabic': 'عين الفرس (الميلودي شغموم)',
                'title_french': 'Ain Al Faras (Miloudi Chaghmoum)',
            },
        ]

        try:
            subject = Subject.objects.get(code='ARAB101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code ARAB101 not found. Please ensure it exists.')
            )
            return

        try:
            common_core_grade = Grade.objects.get(name='Common Core')
            self.stdout.write(f'Found grade: {common_core_grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade "Common Core" not found. Please create it first.')
            )
            return
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error finding grade: {e}')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing Tronc Commun lessons for this subject...')
            deleted_count_s1 = Lesson.objects.filter(
                subject=subject,
                grade=common_core_grade,
                cycle='first'
            ).delete()[0]
            deleted_count_s2 = Lesson.objects.filter(
                subject=subject,
                grade=common_core_grade,
                cycle='second'
            ).delete()[0]
            self.stdout.write(
                self.style.WARNING(f'Deleted {deleted_count_s1} first term and {deleted_count_s2} second term existing lessons.')
            )

        self.stdout.write('Creating Tronc Commun lessons for this subject...')

        created_count_s1 = 0
        for lesson_data in lessons_s1:
            lesson, created = Lesson.objects.get_or_create(
                subject=subject,
                grade=common_core_grade,
                cycle='first',
                order=lesson_data['order'],
                defaults={
                    'title': lesson_data['title'],
                    'title_arabic': lesson_data['title_arabic'],
                    'title_french': lesson_data['title_french'],
                    'difficulty_level': 'easy',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
                self.stdout.write(f'Created: Term 1, Lesson {lesson.order} - {lesson.title}')
            else:
                self.stdout.write(f'Already exists: Term 1, Lesson {lesson.order} - {lesson.title}')

        created_count_s2 = 0
        for lesson_data in lessons_s2:
            lesson, created = Lesson.objects.get_or_create(
                subject=subject,
                grade=common_core_grade,
                cycle='second',
                order=lesson_data['order'],
                defaults={
                    'title': lesson_data['title'],
                    'title_arabic': lesson_data['title_arabic'],
                    'title_french': lesson_data['title_french'],
                    'difficulty_level': 'easy',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
                self.stdout.write(f'Created: Term 2, Lesson {lesson.order} - {lesson.title}')
            else:
                self.stdout.write(f'Already exists: Term 2, Lesson {lesson.order} - {lesson.title}')

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term lessons for Tronc Commun.'
            )
        )
