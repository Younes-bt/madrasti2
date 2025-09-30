from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create History, Geography and Civic Education lessons for 3AC (Troisième Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 3AC HGEC lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # Split each section across both cycles

        # First Cycle - 20 lessons (first half of each section)
        lessons_s1 = [
            # History Lessons - First Cycle (6 lessons)
            {'order': 1, 'title': 'Major Stages of Building the Modern Moroccan State', 'title_arabic': 'المراحل الكبرى لبناء الدولة المغربية الحديثة', 'title_french': 'Les grandes étapes de la construction de l\'État marocain moderne', 'category': 'History'},
            {'order': 2, 'title': 'Morocco: Struggle for Independence and Territorial Unity', 'title_arabic': 'المغرب (الكفاح من أجل الاستقلال وإتمام الوحدة الترابية)', 'title_french': 'Le Maroc: lutte pour l\'indépendance et unité territoriale', 'category': 'History'},
            {'order': 3, 'title': 'Phenomenon of Dictatorial Regimes (Nazi Case Study)', 'title_arabic': 'ظاهرة الأنظمة الديكتاتورية (دراسة حالة النازية)', 'title_french': 'Phénomène des régimes dictatoriaux (étude de cas nazi)', 'category': 'History'},
            {'order': 4, 'title': 'World War I: Causes and Consequences', 'title_arabic': 'الحرب العالمية الأولى (الأسباب والنتائج)', 'title_french': 'Première Guerre mondiale: causes et conséquences', 'category': 'History'},
            {'order': 5, 'title': 'Imperialism: Product of Capitalism', 'title_arabic': 'الامبريالية وليدة الرأسمالية', 'title_french': 'L\'impérialisme produit du capitalisme', 'category': 'History'},
            {'order': 6, 'title': 'Crisis of 1929: Causes, Manifestations, Consequences', 'title_arabic': 'أزمة 1929: الأسباب، المظاهر، النتائج', 'title_french': 'Crise de 1929: causes, manifestations, conséquences', 'category': 'History'},

            # Geography Lessons - First Cycle (7 lessons)
            {'order': 7, 'title': 'Arab Maghreb: Elements of Unity and Diversity', 'title_arabic': 'المغرب العربي (عناصر الوحدة والتنوع)', 'title_french': 'Le Maghreb arabe: éléments d\'unité et de diversité', 'category': 'Geography'},
            {'order': 8, 'title': 'Russia and Transformation Challenges', 'title_arabic': 'روسيا ورهانات التحول', 'title_french': 'La Russie et les défis de transformation', 'category': 'Geography'},
            {'order': 9, 'title': 'Arab Maghreb Union: Strategic Choice for Regional Bloc', 'title_arabic': 'اتحاد المغرب العربي: خيار استراتيجي للتكتل الإقليمي', 'title_french': 'Union du Maghreb arabe: choix stratégique de bloc régional', 'category': 'Geography'},
            {'order': 10, 'title': 'Arab Maghreb Between Integration and Challenges', 'title_arabic': 'المغرب العربي بين التكامل والتحديات', 'title_french': 'Le Maghreb arabe entre intégration et défis', 'category': 'Geography'},
            {'order': 11, 'title': 'Japan: Technological Power', 'title_arabic': 'اليابان قوة تكنولوجية', 'title_french': 'Le Japon: puissance technologique', 'category': 'Geography'},
            {'order': 12, 'title': 'Egypt: Arab Development Model', 'title_arabic': 'مصر نموذج تنموي عربي', 'title_french': 'L\'Égypte: modèle de développement arabe', 'category': 'Geography'},
            {'order': 13, 'title': 'Obstacles to Regional Blocs: EU vs Arab Maghreb Comparison', 'title_arabic': 'معيقات التكتلات الجهوية: مقارنة بين الاتحاد الأوربي والمغرب العربي', 'title_french': 'Obstacles aux blocs régionaux: comparaison UE-Maghreb', 'category': 'Geography'},

            # Civic Education Lessons - First Cycle (7 lessons)
            {'order': 14, 'title': 'File on Mohammed V Foundation for Solidarity', 'title_arabic': 'ملف حول مؤسسة محمد الخامس للتضامن', 'title_french': 'Dossier sur la Fondation Mohammed V pour la Solidarité', 'category': 'Civic Education'},
            {'order': 15, 'title': 'How to Preserve and Improve Public Service', 'title_arabic': 'كيف نحافظ على المرفق العمومي وننهض به', 'title_french': 'Comment préserver et améliorer le service public', 'category': 'Civic Education'},
            {'order': 16, 'title': 'State Responsibility in Finding Solutions to Social Problems', 'title_arabic': 'مسؤولية الدولة في إيجاد حلول للمشاكل الاجتماعية', 'title_french': 'Responsabilité de l\'État dans la résolution des problèmes sociaux', 'category': 'Civic Education'},
            {'order': 17, 'title': 'Proposing Media Programs to Promote Citizenship Values', 'title_arabic': 'اقتراح برامج إعلامية تتوخى النهوض بقيم المواطنة', 'title_french': 'Proposer des programmes médiatiques pour promouvoir la citoyenneté', 'category': 'Civic Education'},
            {'order': 18, 'title': 'Morocco and World Peace', 'title_arabic': 'المغرب والسلم العالمي', 'title_french': 'Le Maroc et la paix mondiale', 'category': 'Civic Education'},
            {'order': 19, 'title': 'Morocco and Interfaith Dialogue', 'title_arabic': 'المغرب وحوار الأديان', 'title_french': 'Le Maroc et le dialogue interreligieux', 'category': 'Civic Education'},
            {'order': 20, 'title': 'We and the World Share Planet Earth', 'title_arabic': 'نحن والعالم نتقاسم الكرة الأرضية', 'title_french': 'Nous et le monde partageons la planète Terre', 'category': 'Civic Education'},
        ]

        # Second Cycle - 20 lessons (second half of each section)
        lessons_s2 = [
            # History Lessons - Second Cycle (6 lessons)
            {'order': 1, 'title': 'World War II: Causes and Consequences', 'title_arabic': 'الحرب العالمية الثانية (الأسباب والنتائج)', 'title_french': 'Seconde Guerre mondiale: causes et conséquences', 'category': 'History'},
            {'order': 2, 'title': 'Colonial Pressure on Morocco', 'title_arabic': 'الضغط الاستعماري على المغرب', 'title_french': 'Pression coloniale sur le Maroc', 'category': 'History'},
            {'order': 3, 'title': 'Palestinian Question and Arab-Israeli Conflict', 'title_arabic': 'القضية الفلسطينية والصراع العربي الإسرائيلي', 'title_french': 'Question palestinienne et conflit arabo-israélien', 'category': 'History'},
            {'order': 4, 'title': 'Collapse of Ottoman Empire and Colonial Intervention in Arab East', 'title_arabic': 'انهيار الامبراطورية العثمانية والتدخل الاستعماري في المشرق العربي', 'title_french': 'Effondrement de l\'Empire ottoman et intervention coloniale', 'category': 'History'},
            {'order': 5, 'title': 'File on Moroccan Resistance', 'title_arabic': 'ملف حول المقاومة المغربية', 'title_french': 'Dossier sur la résistance marocaine', 'category': 'History'},
            {'order': 6, 'title': 'Prosperity of European Capitalism in 19th Century', 'title_arabic': 'ازدهار الرأسمالية الأوربية خلال القرن 19م', 'title_french': 'Prospérité du capitalisme européen au XIXe siècle', 'category': 'History'},

            # Geography Lessons - Second Cycle (6 lessons)
            {'order': 7, 'title': 'Nigeria Between Natural Wealth and Development Weakness', 'title_arabic': 'نيجيريا بين الغنى الطبيعي والضعف التنموي', 'title_french': 'Le Nigeria entre richesse naturelle et faiblesse développementale', 'category': 'Geography'},
            {'order': 8, 'title': 'United States: Global Power', 'title_arabic': 'الولايات المتحدة الأمريكية قوة عالمية', 'title_french': 'Les États-Unis: puissance mondiale', 'category': 'Geography'},
            {'order': 9, 'title': 'Training on Economic Phenomenon Analysis Using Geographic Approach', 'title_arabic': 'التدرب على معالجة ظاهرة اقتصادية باعتماد النهج الجغرافي', 'title_french': 'Formation à l\'analyse de phénomènes économiques par approche géographique', 'category': 'Geography'},
            {'order': 10, 'title': 'European Union Between Integration and Competition', 'title_arabic': 'الاتحاد الأوربي بين الاندماج والمنافسة', 'title_french': 'Union européenne entre intégration et concurrence', 'category': 'Geography'},
            {'order': 11, 'title': 'European Union: Potential and Economic Position in the World', 'title_arabic': 'الاتحاد الأوربي : إمكانياته ومكانته الاقتصادية في العالم', 'title_french': 'Union européenne: potentiel et position économique mondiale', 'category': 'Geography'},
            {'order': 12, 'title': 'Arab Maghreb: Elements of Unity and Diversity (Continued)', 'title_arabic': 'المغرب العربي: عناصر الوحدة والتنوع', 'title_french': 'Le Maghreb arabe: éléments d\'unité et de diversité (suite)', 'category': 'Geography'},

            # Civic Education Lessons - Second Cycle (8 lessons)
            {'order': 13, 'title': 'Preserving Natural Resources', 'title_arabic': 'الحفاظ على الموارد الطبيعية', 'title_french': 'Préservation des ressources naturelles', 'category': 'Civic Education'},
            {'order': 14, 'title': 'Preserving and Developing Heritage', 'title_arabic': 'الحفاظ على التراث وتطويره', 'title_french': 'Préservation et développement du patrimoine', 'category': 'Civic Education'},
            {'order': 15, 'title': 'Where to Turn in Case of Constitutional Rights Violation', 'title_arabic': 'إلى أين ألجأ في حالة خرق حق من حقوقي الدستورية أو حقوق غيري؟', 'title_french': 'Où s\'adresser en cas de violation des droits constitutionnels', 'category': 'Civic Education'},
            {'order': 16, 'title': 'Ethics in Public Life: Concept and Mechanisms for Fighting Corruption', 'title_arabic': 'تخليق الحياة العامة (المفهوم والاليات، اقتراح خطة لمحاربة الرشوة)', 'title_french': 'Éthique de la vie publique: concept et mécanismes anti-corruption', 'category': 'Civic Education'},
            {'order': 17, 'title': 'Creating File on Mohammed V Foundation for Solidarity', 'title_arabic': 'ننجز ملفا حول مؤسسة محمد الخامس للتضامن', 'title_french': 'Réalisation d\'un dossier sur la Fondation Mohammed V', 'category': 'Civic Education'},
            {'order': 18, 'title': 'How to Address a Social Problem', 'title_arabic': 'كيف نعالج مشكلا اجتماعيا', 'title_french': 'Comment traiter un problème social', 'category': 'Civic Education'},
            {'order': 19, 'title': 'Participation: Right and Duty - Electing Representatives', 'title_arabic': 'المشاركة حق وواجب: ننتخب ممثلينا في مجلس المؤسسة', 'title_french': 'Participation: droit et devoir - élire nos représentants', 'category': 'Civic Education'},
            {'order': 20, 'title': 'Proposing Media Programs to Promote Citizenship Values (Part 2)', 'title_arabic': 'اقتراح برامج إعلامية تتوخى النهوض بقيم المواطنة', 'title_french': 'Proposer des programmes médiatiques pour la citoyenneté (partie 2)', 'category': 'Civic Education'},
        ]

        try:
            subject = Subject.objects.get(code='HGEC101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code HGEC101 not found. Please ensure it exists.')
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
            self.stdout.write('Deleting existing 3AC HGEC lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating 3AC HGEC lessons for this subject...')
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
                    'description': f"HGEC - {lesson_data['category']} - {lesson_data['title_arabic']}",
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
                    'description': f"HGEC - {lesson_data['category']} - {lesson_data['title_arabic']}",
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term HGEC lessons for 3AC.'
            )
        )