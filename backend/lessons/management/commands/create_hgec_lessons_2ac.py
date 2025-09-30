from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create History, Geography and Civic Education lessons for 2AC (Deuxième Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 2AC HGEC lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - First half of each section (19 lessons: 6 History + 6 Geography + 7 Civic Education)
        lessons_s1 = [
            # History Lessons - First Cycle (6 lessons)
            {'order': 1, 'title': 'Study of the Idrisid State through Historical Documents', 'title_arabic': 'دراسة الدولة الادريسية من خلال وثائق تاريخية', 'title_french': 'Étude de l\'État idrisside à travers des documents historiques', 'category': 'History'},
            {'order': 2, 'title': 'Flourishing of the Moroccan State: Almoravids and Almohads', 'title_arabic': 'ازدهار الدولة المغربية : المرابطون والموحدون', 'title_french': 'Épanouissement de l\'État marocain: Almoravides et Almohades', 'category': 'History'},
            {'order': 3, 'title': 'Decline of Jihad and Beginning of the Reconquista', 'title_arabic': 'تراجع الجهاد وبداية حرب الاسترداد', 'title_french': 'Déclin du jihad et début de la Reconquista', 'category': 'History'},
            {'order': 4, 'title': 'Iberian Invasion and Moroccan Reaction', 'title_arabic': 'الغزو الأيبيري ورد فعل المغاربة', 'title_french': 'Invasion ibérique et réaction marocaine', 'category': 'History'},
            {'order': 5, 'title': 'Alaouite State and Reunification of the Country', 'title_arabic': 'الدولة العلوية وإعادة توحيد البلاد (التأسيس)', 'title_french': 'État alaouite et réunification du pays', 'category': 'History'},
            {'order': 6, 'title': 'Morocco Between Openness and Closure', 'title_arabic': 'المغرب بين الانفتاح والانغلاق', 'title_french': 'Le Maroc entre ouverture et fermeture', 'category': 'History'},

            # Geography Lessons - First Cycle (6 lessons)
            {'order': 7, 'title': 'Morocco: Strategic Location', 'title_arabic': 'المغرب : موقع استراتيجي', 'title_french': 'Le Maroc: position stratégique', 'category': 'Geography'},
            {'order': 8, 'title': 'Morocco: Diverse Topography and Surface Resources', 'title_arabic': 'المغرب : تضاريس وموارد سطحية متنوعة', 'title_french': 'Le Maroc: topographie et ressources de surface diversifiées', 'category': 'Geography'},
            {'order': 9, 'title': 'Morocco: Different Underground Resources', 'title_arabic': 'المغرب : موارد باطنية مختلفة', 'title_french': 'Le Maroc: différentes ressources souterraines', 'category': 'Geography'},
            {'order': 10, 'title': 'Training on Drawing Morocco\'s Topography Map', 'title_arabic': 'التدرب على رسم خريطة تضاريس المغرب وتوطين الموارد الطبيعية', 'title_french': 'Entraînement au dessin de la carte topographique du Maroc', 'category': 'Geography'},
            {'order': 11, 'title': 'Morocco: Climate with Diverse Characteristics', 'title_arabic': 'المغرب : مناخ متنوع الخصائص', 'title_french': 'Le Maroc: climat aux caractéristiques diversifiées', 'category': 'Geography'},
            {'order': 12, 'title': 'Training on Drawing and Reading Climate Charts', 'title_arabic': 'التدرب على رسم وقراءة المبيانات المناخية', 'title_french': 'Entraînement au dessin et à la lecture des graphiques climatiques', 'category': 'Geography'},

            # Civic Education Lessons - First Cycle (7 lessons)
            {'order': 13, 'title': 'Components of the Moroccan State', 'title_arabic': 'مقومات الدولة المغربية', 'title_french': 'Composants de l\'État marocain', 'category': 'Civic Education'},
            {'order': 14, 'title': 'Moroccan Constitution: Supreme Law of the Nation', 'title_arabic': 'الدستور المغربي القانون الأسمى للأمة', 'title_french': 'Constitution marocaine: loi suprême de la nation', 'category': 'Civic Education'},
            {'order': 15, 'title': 'The King', 'title_arabic': 'الملك', 'title_french': 'Le Roi', 'category': 'Civic Education'},
            {'order': 16, 'title': 'Parliament', 'title_arabic': 'البرلمان', 'title_french': 'Le Parlement', 'category': 'Civic Education'},
            {'order': 17, 'title': 'Government: Following Stages of Law Issuance', 'title_arabic': 'الحكومة (تتابع مراحل إصدار القانون)', 'title_french': 'Gouvernement: suivi des étapes d\'élaboration des lois', 'category': 'Civic Education'},
            {'order': 18, 'title': 'Judiciary: Juvenile Justice', 'title_arabic': 'القضاء (قضاء الأحداث)', 'title_french': 'Justice: justice des mineurs', 'category': 'Civic Education'},
            {'order': 19, 'title': 'Civil and Political Rights', 'title_arabic': 'الحقوق المدنية والسياسية', 'title_french': 'Droits civils et politiques', 'category': 'Civic Education'},
        ]

        # Second Cycle - Second half of each section (21 lessons: 6 History + 8 Geography + 7 Civic Education)
        lessons_s2 = [
            # History Lessons - Second Cycle (6 lessons)
            {'order': 1, 'title': 'Ottoman Empire at Its Maximum Extent', 'title_arabic': 'الإمبراطورية العثمانية في أقصى امتدادها', 'title_french': 'Empire ottoman à son extension maximale', 'category': 'History'},
            {'order': 2, 'title': 'European Renaissance: Beginning of Europe\'s Revival', 'title_arabic': 'النهضة الأوربية : بداية انبعاث أوربا', 'title_french': 'Renaissance européenne: début du renouveau européen', 'category': 'History'},
            {'order': 3, 'title': 'Geographical Discoveries', 'title_arabic': 'الاكتشافات الجغرافية', 'title_french': 'Découvertes géographiques', 'category': 'History'},
            {'order': 4, 'title': 'Agricultural and Industrial Revolution in Europe', 'title_arabic': 'الثورة الفلاحية والثورة الصناعية في أوربا', 'title_french': 'Révolution agricole et industrielle en Europe', 'category': 'History'},
            {'order': 5, 'title': 'French Revolution Born of Enlightenment Thought', 'title_arabic': 'الثورة الفرنسية وليدة فكر الأنوار', 'title_french': 'Révolution française née de la pensée des Lumières', 'category': 'History'},
            {'order': 6, 'title': 'Birth of the United States of America', 'title_arabic': 'نشأة الولايات المتحدة الأمريكية', 'title_french': 'Naissance des États-Unis d\'Amérique', 'category': 'History'},

            # Geography Lessons - Second Cycle (8 lessons)
            {'order': 7, 'title': 'Morocco\'s Population: Demographic Study', 'title_arabic': 'سكان المغرب : دراسة ديمغرافية', 'title_french': 'Population du Maroc: étude démographique', 'category': 'Geography'},
            {'order': 8, 'title': 'Morocco File and Human Development Index', 'title_arabic': 'ملف المغرب ومؤشر التنمية البشرية', 'title_french': 'Dossier Maroc et indice de développement humain', 'category': 'Geography'},
            {'order': 9, 'title': 'Organization of Agricultural and Fishing Sectors in Morocco', 'title_arabic': 'تنظيم المجال الفلاحي والصيد البحري بالمغرب', 'title_french': 'Organisation du secteur agricole et de la pêche au Maroc', 'category': 'Geography'},
            {'order': 10, 'title': 'Organization of Industrial Sector in Morocco', 'title_arabic': 'تنظيم المجال الصناعي بالمغرب تنمية ضرورية من أجل تحديث الاقتصاد', 'title_french': 'Organisation du secteur industriel au Maroc', 'category': 'Geography'},
            {'order': 11, 'title': 'Trade as Mirror of Moroccan Economy', 'title_arabic': 'التجارة مرآة للاقتصاد المغربي', 'title_french': 'Le commerce miroir de l\'économie marocaine', 'category': 'Geography'},
            {'order': 12, 'title': 'Tourism in Morocco and Development Requirements', 'title_arabic': 'السياحة بالمغرب ومستلزمات التطور', 'title_french': 'Tourisme au Maroc et exigences de développement', 'category': 'Geography'},
            {'order': 13, 'title': 'Issues Hindering Sustainable Development in Morocco', 'title_arabic': 'قضايا تعيق التنمية المستدامة بالمغرب', 'title_french': 'Questions entravant le développement durable au Maroc', 'category': 'Geography'},
            {'order': 14, 'title': 'File on Migration Phenomenon', 'title_arabic': 'ملف حول ظاهرة الهجرة', 'title_french': 'Dossier sur le phénomène migratoire', 'category': 'Geography'},

            # Civic Education Lessons - Second Cycle (7 lessons)
            {'order': 15, 'title': 'Public Freedoms in Morocco', 'title_arabic': 'الحريات العامة بالمغرب', 'title_french': 'Libertés publiques au Maroc', 'category': 'Civic Education'},
            {'order': 16, 'title': 'Political Parties and Their Role in Framing Citizens', 'title_arabic': 'الأحزاب السياسية ودورها في تأطير المواطنين', 'title_french': 'Partis politiques et leur rôle dans l\'encadrement des citoyens', 'category': 'Civic Education'},
            {'order': 17, 'title': 'Trade Unions and Professional Organizations', 'title_arabic': 'النقابات والمنظمات المهنية', 'title_french': 'Syndicats et organisations professionnelles', 'category': 'Civic Education'},
            {'order': 18, 'title': 'Press', 'title_arabic': 'الصحافة', 'title_french': 'La presse', 'category': 'Civic Education'},
            {'order': 19, 'title': 'Economic, Social and Cultural Rights', 'title_arabic': 'الحقوق الاقتصادية والاجتماعية والثقافية', 'title_french': 'Droits économiques, sociaux et culturels', 'category': 'Civic Education'},
            {'order': 20, 'title': 'Local Democracy and Its Implementing Institutions', 'title_arabic': 'الديمقراطية المحلية ومؤسسات تفعيلها', 'title_french': 'Démocratie locale et ses institutions de mise en œuvre', 'category': 'Civic Education'},
            {'order': 21, 'title': 'Associations as Expression of Citizenship Practice', 'title_arabic': 'الجمعيات كتعبير عن ممارسة المواطنة', 'title_french': 'Associations comme expression de la pratique citoyenne', 'category': 'Civic Education'},
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
            self.stdout.write('Deleting existing 2AC HGEC lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating 2AC HGEC lessons for this subject...')
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term HGEC lessons for 2AC.'
            )
        )