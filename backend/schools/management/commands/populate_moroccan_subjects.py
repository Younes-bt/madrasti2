from django.core.management.base import BaseCommand
from schools.models import Subject


class Command(BaseCommand):
    help = 'Populate Moroccan education system subjects'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing subjects before creating new ones',
        )

    def handle(self, *args, **options):
        # Moroccan education system subjects with Arabic and French names
        moroccan_subjects = [
            # Core Academic Subjects
            {
                'name': 'Arabic Language & Literature',
                'name_arabic': 'اللغة العربية وآدابها',
                'name_french': 'Langue et Littérature Arabes',
                'code': 'ARAB101'
            },
            {
                'name': 'French Language & Literature',
                'name_arabic': 'اللغة الفرنسية وآدابها',
                'name_french': 'Langue et Littérature Françaises',
                'code': 'FREN101'
            },
            {
                'name': 'English Language',
                'name_arabic': 'اللغة الإنجليزية',
                'name_french': 'Langue Anglaise',
                'code': 'ENGL101'
            },
            {
                'name': 'Mathematics',
                'name_arabic': 'الرياضيات',
                'name_french': 'Mathématiques',
                'code': 'MATH101'
            },
            {
                'name': 'Physics',
                'name_arabic': 'الفيزياء',
                'name_french': 'Physique',
                'code': 'PHYS101'
            },
            {
                'name': 'Chemistry',
                'name_arabic': 'الكيمياء',
                'name_french': 'Chimie',
                'code': 'CHEM101'
            },
            {
                'name': 'Life & Earth Sciences',
                'name_arabic': 'علوم الحياة والأرض',
                'name_french': 'Sciences de la Vie et de la Terre',
                'code': 'BIOL101'
            },
            {
                'name': 'Philosophy',
                'name_arabic': 'الفلسفة',
                'name_french': 'Philosophie',
                'code': 'PHIL101'
            },
            
            # Social Sciences & Humanities
            {
                'name': 'History',
                'name_arabic': 'التاريخ',
                'name_french': 'Histoire',
                'code': 'HIST101'
            },
            {
                'name': 'Geography',
                'name_arabic': 'الجغرافيا',
                'name_french': 'Géographie',
                'code': 'GEOG101'
            },
            {
                'name': 'Civics/Citizenship Education',
                'name_arabic': 'التربية على المواطنة',
                'name_french': 'Éducation à la Citoyenneté',
                'code': 'CIVS101'
            },
            {
                'name': 'Islamic Education',
                'name_arabic': 'التربية الإسلامية',
                'name_french': 'Éducation Islamique',
                'code': 'ISLM101'
            },
            {
                'name': 'Economics',
                'name_arabic': 'الاقتصاد',
                'name_french': 'Économie',
                'code': 'ECON101'
            },
            {
                'name': 'Accounting',
                'name_arabic': 'المحاسبة',
                'name_french': 'Comptabilité',
                'code': 'ACCT101'
            },
            {
                'name': 'Management',
                'name_arabic': 'التسيير',
                'name_french': 'Gestion',
                'code': 'MGMT101'
            },
            
            # Arts & Physical Education
            {
                'name': 'Art Education',
                'name_arabic': 'التربية التشكيلية',
                'name_french': 'Éducation Artistique',
                'code': 'ARTS101'
            },
            {
                'name': 'Music',
                'name_arabic': 'التربية الموسيقية',
                'name_french': 'Éducation Musicale',
                'code': 'MUSC101'
            },
            {
                'name': 'Physical Education',
                'name_arabic': 'التربية البدنية',
                'name_french': 'Éducation Physique',
                'code': 'PHYS_ED101'
            },
            {
                'name': 'Applied Arts',
                'name_arabic': 'الفنون التطبيقية',
                'name_french': 'Arts Appliqués',
                'code': 'APPL_ARTS101'
            },
            
            # Technical & Vocational Subjects
            {
                'name': 'Technology',
                'name_arabic': 'التكنولوجيا',
                'name_french': 'Technologie',
                'code': 'TECH101'
            },
            {
                'name': 'Home Economics',
                'name_arabic': 'التدبير المنزلي',
                'name_french': 'Économie Domestique',
                'code': 'HOME_EC101'
            },
            {
                'name': 'Information Technology/Computer Science',
                'name_arabic': 'المعلوميات',
                'name_french': 'Informatique',
                'code': 'IT101'
            },
            {
                'name': 'Electrical Engineering',
                'name_arabic': 'الهندسة الكهربائية',
                'name_french': 'Génie Électrique',
                'code': 'ELEC_ENG101'
            },
            {
                'name': 'Mechanical Engineering',
                'name_arabic': 'الهندسة الميكانيكية',
                'name_french': 'Génie Mécanique',
                'code': 'MECH_ENG101'
            },
            {
                'name': 'Agriculture',
                'name_arabic': 'الفلاحة',
                'name_french': 'Agriculture',
                'code': 'AGRI101'
            },
            
            # Additional Languages (Private Schools)
            {
                'name': 'Spanish',
                'name_arabic': 'الإسបانية',
                'name_french': 'Espagnol',
                'code': 'SPAN101'
            },
            {
                'name': 'German',
                'name_arabic': 'الألمانية',
                'name_french': 'Allemand',
                'code': 'GERM101'
            },
            
            # Elementary Level Subjects
            {
                'name': 'Reading',
                'name_arabic': 'القراءة',
                'name_french': 'Lecture',
                'code': 'READ101'
            },
            {
                'name': 'Writing',
                'name_arabic': 'الكتابة',
                'name_french': 'Écriture',
                'code': 'WRIT101'
            },
            {
                'name': 'Basic Science',
                'name_arabic': 'العلوم الأساسية',
                'name_french': 'Sciences de Base',
                'code': 'BASIC_SCI101'
            }
        ]

        if options['delete_existing']:
            self.stdout.write('Deleting existing subjects...')
            deleted_count = Subject.objects.all().delete()[0]
            self.stdout.write(
                self.style.WARNING(f'Deleted {deleted_count} existing subjects')
            )

        self.stdout.write('Creating Moroccan education system subjects...')
        
        created_count = 0
        for subject_data in moroccan_subjects:
            subject, created = Subject.objects.get_or_create(
                code=subject_data['code'],
                defaults={
                    'name': subject_data['name'],
                    'name_arabic': subject_data['name_arabic'],
                    'name_french': subject_data['name_french'],
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(f'Created: {subject.name} ({subject.code})')
            else:
                self.stdout.write(f'Already exists: {subject.name} ({subject.code})')

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count} new subjects. '
                f'Total subjects in database: {Subject.objects.count()}'
            )
        )