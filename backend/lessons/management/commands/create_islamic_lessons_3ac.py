from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Islamic Education lessons for 3AC (Troisième Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 3AC Islamic Education lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # Split each section across both cycles

        # First Cycle - 11 lessons (first half of each section)
        lessons_s1 = [
            # مدخل التزكية (3 lessons)
            {'order': 1, 'title': 'Surat Al-Hashr', 'title_arabic': 'سورة الحشر', 'title_french': 'Sourate Al-Hashr', 'section': 'مدخل التزكية'},
            {'order': 2, 'title': 'Beautiful Names of Allah', 'title_arabic': 'أسماء الله الحسنى', 'title_french': 'Les beaux noms d\'Allah', 'section': 'مدخل التزكية'},
            {'order': 3, 'title': 'Importance of Religion in Individual and Community Life', 'title_arabic': 'أهمية التدين في حياة الفرد والمجتمع', 'title_french': 'L\'importance de la religion dans la vie individuelle et communautaire', 'section': 'مدخل التزكية'},

            # مدخل الاقتداء (2 lessons)
            {'order': 4, 'title': 'Protecting the Call and Building the State: Migration', 'title_arabic': 'حماية الدعوة وبناء الدولة الهجرة', 'title_french': 'Protection de l\'appel et construction de l\'État: l\'Hégire', 'section': 'مدخل الاقتداء'},
            {'order': 5, 'title': 'The Mosque: Nucleus of Islamic Society', 'title_arabic': 'المسجد نواة المجتمع الإسلامي', 'title_french': 'La mosquée: noyau de la société islamique', 'section': 'مدخل الاقتداء'},

            # مدخل الاستجابة (3 lessons)
            {'order': 6, 'title': 'Worship: Purpose of Creation and Sign of Faith', 'title_arabic': 'العبادة غاية الخلق العبادة صفة ايمان ودليل خضوع', 'title_french': 'L\'adoration: but de la création et signe de foi', 'section': 'مدخل الاستجابة'},
            {'order': 7, 'title': 'Zakat: Rules and Purposes - Definition, Rules, Recipients', 'title_arabic': 'الزكاة أحكامها ومقاصدها : التعريف – الأحكام – المستحقون', 'title_french': 'La Zakat: règles et objectifs - définition, règles, bénéficiaires', 'section': 'مدخل الاستجابة'},
            {'order': 8, 'title': 'Zakat: Rules and Purposes - Goals and Development Functions', 'title_arabic': 'الزكاة أحكامها ومقاصدها : الغايات والوظائف التنموية', 'title_french': 'La Zakat: règles et objectifs - buts et fonctions de développement', 'section': 'مدخل الاستجابة'},

            # مدخل القسط (2 lessons)
            {'order': 9, 'title': 'Right of Allah: Fear of Allah', 'title_arabic': 'حق الله : تقوى الله', 'title_french': 'Droit d\'Allah: crainte d\'Allah', 'section': 'مدخل القسط'},
            {'order': 10, 'title': 'Right of the Self: Importance of Planning and Organization in Life', 'title_arabic': 'حق النفس : أهمية التخطيط والتنظيم في الحياة', 'title_french': 'Droit de soi: importance de la planification et de l\'organisation dans la vie', 'section': 'مدخل القسط'},

            # مدخل الحكمة (1 lesson)
            {'order': 11, 'title': 'Renewable Migration: The Migrant Abandons What Allah Forbids', 'title_arabic': 'الهجرة المتجددة : المهاجر من هجر ما نهى الله عنه', 'title_french': 'Migration renouvelée: le migrant abandonne ce qu\'Allah interdit', 'section': 'مدخل الحكمة'},
        ]

        # Second Cycle - 10 lessons (second half of each section)
        lessons_s2 = [
            # مدخل التزكية (2 lessons)
            {'order': 1, 'title': 'Islam: Belief and Law', 'title_arabic': 'الإسلام عقيدة وشريعة', 'title_french': 'L\'Islam: croyance et loi', 'section': 'مدخل التزكية'},
            {'order': 2, 'title': 'Effect of Quran in Purifying the Soul', 'title_arabic': 'أثر القرآن في تزكية النفس', 'title_french': 'L\'effet du Coran dans la purification de l\'âme', 'section': 'مدخل التزكية'},

            # مدخل الاقتداء (2 lessons)
            {'order': 3, 'title': 'The Prophet Establishes Values of Peace and Coexistence', 'title_arabic': 'الرسول يرسي قيم السلم والتعايش', 'title_french': 'Le Prophète établit les valeurs de paix et de coexistence', 'section': 'مدخل الاقتداء'},
            {'order': 4, 'title': 'Sheltering and Supporting the Prophet: Ayyub Al-Ansari - Umm Sulaim', 'title_arabic': 'إيواء الرسول ونصرته : أيوب الأنصاري – أم سليم', 'title_french': 'Accueil et soutien au Prophète: Ayyub Al-Ansari - Umm Sulaim', 'section': 'مدخل الاقتداء'},

            # مدخل الاستجابة (1 lesson)
            {'order': 5, 'title': 'Spending in the Way of Allah: Forms and Purposes', 'title_arabic': 'الإنفاق في سبيل الله: صوره ومقاصده', 'title_french': 'Dépenser dans la voie d\'Allah: formes et objectifs', 'section': 'مدخل الاستجابة'},

            # مدخل القسط (2 lessons)
            {'order': 6, 'title': 'Right of Others: Leadership of Believers - Foundations and Goals', 'title_arabic': 'حق الغير إمارة المؤمنين الأسس والغايات', 'title_french': 'Droit d\'autrui: leadership des croyants - fondements et objectifs', 'section': 'مدخل القسط'},
            {'order': 7, 'title': 'Right of Environment: Caring for Environmental Beauty', 'title_arabic': 'حق البيئة: الاعتناء بجمال البيئة والمحيط', 'title_french': 'Droit de l\'environnement: prendre soin de la beauté environnementale', 'section': 'مدخل القسط'},

            # مدخل الحكمة (3 lessons)
            {'order': 8, 'title': 'Altruism and Sacrifice', 'title_arabic': 'الإيثار والتضحية', 'title_french': 'Altruisme et sacrifice', 'section': 'مدخل الحكمة'},
            {'order': 9, 'title': 'Mutual Understanding and Coexistence', 'title_arabic': 'التعارف والتعايش', 'title_french': 'Compréhension mutuelle et coexistence', 'section': 'مدخل الحكمة'},
            {'order': 10, 'title': 'From the Prophet\'s Advices: The Nine Advices', 'title_arabic': 'من وصايا الرسول صلى الله عليه وسلم: الوصايا التسع', 'title_french': 'Des conseils du Prophète: les neuf conseils', 'section': 'مدخل الحكمة'},
        ]

        try:
            subject = Subject.objects.get(code='ISLM101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code ISLM101 not found. Please ensure it exists.')
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
            self.stdout.write('Deleting existing 3AC Islamic Education lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating 3AC Islamic Education lessons for this subject...')
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
                    'description': f"Islamic Education - {lesson_data['section']} - {lesson_data['title_arabic']}",
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
                    'description': f"Islamic Education - {lesson_data['section']} - {lesson_data['title_arabic']}",
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Islamic Education lessons for 3AC.'
            )
        )