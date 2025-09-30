from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create History, Geography and Civic Education lessons for TC (Tronc Commun)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing TC HGEC lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 19 lessons (History and Geography)
        lessons_s1 = [
            # History Lessons - First Cycle (10 lessons)
            {'order': 1, 'title': 'Mediterranean World in 15th and 18th Centuries', 'title_arabic': 'العالم المتوسطي في القرنين 15م و18م', 'title_french': 'Le monde méditerranéen aux XVe et XVIIIe siècles', 'category': 'History'},
            {'order': 2, 'title': 'Intellectual, Scientific and Artistic Transformations: Humanist Movement', 'title_arabic': 'التحولات الفكرية والعلمية والفنية: الحركة الإنسية', 'title_french': 'Transformations intellectuelles, scientifiques et artistiques: mouvement humaniste', 'category': 'History'},
            {'order': 3, 'title': 'Political and Social Transformations in Europe in 15th and 16th Centuries', 'title_arabic': 'التحولات السياسية والاجتماعية في أوربا خلال القرنين 15 و16م', 'title_french': 'Transformations politiques et sociales en Europe aux XVe et XVIe siècles', 'category': 'History'},
            {'order': 4, 'title': 'Geographical Discoveries and Mercantilism Phenomenon', 'title_arabic': 'الاكتشافات الجغرافية وظاهرة الميركنتيلية', 'title_french': 'Découvertes géographiques et phénomène mercantile', 'category': 'History'},
            {'order': 5, 'title': 'Islamic Expansion (Ottoman Influence Extension and Beginning of European Intervention)', 'title_arabic': 'المد الإسلامي (امتداد النفوذ العثماني وبداية التدخل الأوربي)', 'title_french': 'Expansion islamique (extension influence ottomane et début intervention européenne)', 'category': 'History'},
            {'order': 6, 'title': 'Political and Social Developments in Islamic World', 'title_arabic': 'التطورات السياسية والإجتماعية في العالم الإسلامي', 'title_french': 'Développements politiques et sociaux dans le monde islamique', 'category': 'History'},
            {'order': 7, 'title': 'Economic Developments in Islamic World', 'title_arabic': 'التطورات الإقتصادية في العالم الإسلامي', 'title_french': 'Développements économiques dans le monde islamique', 'category': 'History'},
            {'order': 8, 'title': 'Religious Reform', 'title_arabic': 'الإصلاح الديني', 'title_french': 'Réforme religieuse', 'category': 'History'},
            {'order': 9, 'title': 'Islamic Expansion and Beginning of European Intervention', 'title_arabic': 'المد الإسلامي وبداية التدخل الأوروبي', 'title_french': 'Expansion islamique et début de l\'intervention européenne', 'category': 'History'},
            {'order': 10, 'title': 'Intellectual and Artistic Life in Islamic World', 'title_arabic': 'الحياة الفكرية والفنية في العالم الإسلامي', 'title_french': 'Vie intellectuelle et artistique dans le monde islamique', 'category': 'History'},

            # Geography Lessons - First Cycle (9 lessons)
            {'order': 11, 'title': 'Major Structural Groups and Relief Forms', 'title_arabic': 'المجموعات البنيوية الكبرى وأشكال التظاريس', 'title_french': 'Grands ensembles structuraux et formes du relief', 'category': 'Geography'},
            {'order': 12, 'title': 'Climate Zones and Vegetation Cover in the World (Map Comparison)', 'title_arabic': 'النطاقات المناخية والغطاء النباتي في العالم (مقابلة بين خريطتين)', 'title_french': 'Zones climatiques et couverture végétale mondiale (comparaison de cartes)', 'category': 'Geography'},
            {'order': 13, 'title': 'Population: Distribution', 'title_arabic': 'السكان: التوزيع', 'title_french': 'Population: distribution', 'category': 'Geography'},
            {'order': 14, 'title': 'Forms of Human Exploitation of Rural Areas', 'title_arabic': 'أشكال استغلال الإنسان للمجال في الأرياف', 'title_french': 'Formes d\'exploitation humaine de l\'espace rural', 'category': 'Geography'},
            {'order': 15, 'title': 'Forms of Human Exploitation of Urban Areas', 'title_arabic': 'أشكال استغلال الإنسان للمجال في المدن', 'title_french': 'Formes d\'exploitation humaine de l\'espace urbain', 'category': 'Geography'},
            {'order': 16, 'title': 'Techniques for Drawing Rural-Urban Area Maps', 'title_arabic': 'تقنيات رسم خرائط المجال الريفي – الحضري (تمثيل المعطيات النوعية والكمية)', 'title_french': 'Techniques de cartographie des espaces ruraux-urbains', 'category': 'Geography'},
            {'order': 17, 'title': 'Reading Topographic Maps (Creating Topographic Section)', 'title_arabic': 'قراءة خريطة طبوغرافية (إنجاز مقطع طبوغرافي)', 'title_french': 'Lecture de carte topographique (réalisation coupe topographique)', 'category': 'Geography'},
            {'order': 18, 'title': 'Soil', 'title_arabic': 'التربة', 'title_french': 'Sol', 'category': 'Geography'},
            {'order': 19, 'title': 'Population and Dynamics (Training on Drawing Charts)', 'title_arabic': 'السكان والدينامية (التدرب على رسم المبيانات)', 'title_french': 'Population et dynamiques (formation au dessin de graphiques)', 'category': 'Geography'},
        ]

        # Second Cycle - 19 lessons (History and Geography - Environmental Focus)
        lessons_s2 = [
            # History Lessons - Second Cycle (7 lessons)
            {'order': 1, 'title': 'Age of Enlightenment: English and French Thought', 'title_arabic': 'عصر الأنوار: الفكر الأنجليزي والفكر الفرنسي', 'title_french': 'Siècle des Lumières: pensée anglaise et française', 'category': 'History'},
            {'order': 2, 'title': 'Social and Political Revolutions: French Revolution', 'title_arabic': 'الثورات الإجتماعية والسياسية: الثورة الفرنسية', 'title_french': 'Révolutions sociales et politiques: Révolution française', 'category': 'History'},
            {'order': 3, 'title': 'Industrial Revolution Start: Technical Development and Social Structure Impact', 'title_arabic': 'انطلاقة الثورة الصناعية: التطور التقني والإنعكاسات على البنية الإجتماعية', 'title_french': 'Début révolution industrielle: développement technique et impact social', 'category': 'History'},
            {'order': 4, 'title': 'General Conditions in Islamic World During 17th and 18th Centuries', 'title_arabic': 'الأوضاع العامة في العالم الإسلامي خلال القرنين 17 و18م', 'title_french': 'Conditions générales dans le monde islamique aux XVIIe et XVIIIe siècles', 'category': 'History'},
            {'order': 5, 'title': 'Escalation of European Pressure on Islamic World', 'title_arabic': 'تصاعد الضغوط الأوربية على العالم الإسلامي', 'title_french': 'Escalade des pressions européennes sur le monde islamique', 'category': 'History'},
            {'order': 6, 'title': 'Beginning of Reform Attempts and Their Limits', 'title_arabic': 'بداية محاولات الإصلاح وحدودها', 'title_french': 'Début des tentatives de réforme et leurs limites', 'category': 'History'},
            {'order': 7, 'title': 'Social and Political Revolutions: English Revolution', 'title_arabic': 'الثورات الإجتماعية والسياسية: الثورة الإنجليزية', 'title_french': 'Révolutions sociales et politiques: Révolution anglaise', 'category': 'History'},

            # Geography Lessons - Second Cycle (12 lessons - Environmental Focus)
            {'order': 8, 'title': 'Ecosystem (Concept, Balance Foundations and Types)', 'title_arabic': 'المنظومة البيئية (مفهومها، أسس توازنها والتعريف بأنواعها)', 'title_french': 'Écosystème (concept, fondements d\'équilibre et types)', 'category': 'Geography'},
            {'order': 9, 'title': 'File on Natural Disaster (Earthquakes in Morocco)', 'title_arabic': 'ملف حول كارثة طبيعية (الزلازل في المغرب)', 'title_french': 'Dossier sur catastrophe naturelle (séismes au Maroc)', 'category': 'Geography'},
            {'order': 10, 'title': 'File on Environmental Disaster (Global Warming)', 'title_arabic': 'ملف حول كارثة بيئية (الاحتباس الحراري)', 'title_french': 'Dossier sur catastrophe environnementale (réchauffement climatique)', 'category': 'Geography'},
            {'order': 11, 'title': 'Legislative and Technical Measures and Procedures', 'title_arabic': 'الإجراءات والتدابير التشريعية والتقنية', 'title_french': 'Mesures et procédures législatives et techniques', 'category': 'Geography'},
            {'order': 12, 'title': 'Educational Measures and Procedures', 'title_arabic': 'الإجراءات والتدابير التربوية', 'title_french': 'Mesures et procédures éducatives', 'category': 'Geography'},
            {'order': 13, 'title': 'Measures and Procedures at Spatial Organization Level', 'title_arabic': 'الإجراءات والتدابير على مستوى تنظيم المجال', 'title_french': 'Mesures et procédures au niveau de l\'organisation spatiale', 'category': 'Geography'},
            {'order': 14, 'title': 'Role of Associations and NGOs in Environmental Protection', 'title_arabic': 'دور الجمعيات والمنظمات غير الحكومية في حماية البيئة', 'title_french': 'Rôle des associations et ONG dans la protection environnementale', 'category': 'Geography'},
            {'order': 15, 'title': 'Hot Ecosystem', 'title_arabic': 'المنظومة البيئية الحارة', 'title_french': 'Écosystème chaud', 'category': 'Geography'},
            {'order': 16, 'title': 'Temperate Ecosystem', 'title_arabic': 'المنظومة البيئية المعتدلة', 'title_french': 'Écosystème tempéré', 'category': 'Geography'},
            {'order': 17, 'title': 'Cold Ecosystem', 'title_arabic': 'المنظومة البيئية الباردة', 'title_french': 'Écosystème froid', 'category': 'Geography'},
            {'order': 18, 'title': 'Environmental Disasters (Definition and Types)', 'title_arabic': 'الكوارث البيئية (تعريفها وأنواعها)', 'title_french': 'Catastrophes environnementales (définition et types)', 'category': 'Geography'},
            {'order': 19, 'title': 'File on Role of Associations and NGOs', 'title_arabic': 'ملف حول دور الجمعيات والمنظمات غير الحكومية', 'title_french': 'Dossier sur le rôle des associations et ONG', 'category': 'Geography'},
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
            grade = Grade.objects.get(code='TC')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "TC" not found. Please create it first.')
            )
            return

        # Get all tracks
        track_codes = ['TCS', 'TCT', 'TCEO', 'TCIB', 'TCS-BIOF', 'TCT-BIOF']
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
            self.stdout.write('Deleting existing TC HGEC lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating TC HGEC lessons for this subject...')
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
            # Add all tracks to the lesson
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
                    'description': f"HGEC - {lesson_data['category']} - {lesson_data['title_arabic']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
            # Add all tracks to the lesson
            lesson.tracks.add(*tracks)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term HGEC lessons for TC.'
            )
        )