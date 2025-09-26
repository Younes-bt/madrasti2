from django.core.management.base import BaseCommand
from schools.models import Track, Grade

class Command(BaseCommand):
    help = 'Create tracks for 2nd Year Baccalaureate'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 2nd Year Baccalaureate tracks before creating new ones',
        )

    def handle(self, *args, **options):
        # Tracks data for 2nd Year Baccalaureate
        tracks_data = [
            {
                'order': 1,
                'name': 'Mathematical Sciences Track A',
                'name_arabic': 'مسلك علوم رياضية أ',
                'name_french': 'Filière Sciences Mathématiques A',
                'code': '2BAC-SMA'
            },
            {
                'order': 2,
                'name': 'Mathematical Sciences Track B',
                'name_arabic': 'مسلك علوم رياضية ب',
                'name_french': 'Filière Sciences Mathématiques B',
                'code': '2BAC-SMB'
            },
            {
                'order': 3,
                'name': 'Physical Sciences Track',
                'name_arabic': 'مسلك علوم فيزيائية',
                'name_french': 'Filière Sciences Physiques',
                'code': '2BAC-SP'
            },
            {
                'order': 4,
                'name': 'Life and Earth Sciences Track',
                'name_arabic': 'مسلك علوم الحياة و الارض',
                'name_french': 'Filière Sciences de la Vie et de la Terre',
                'code': '2BAC-SVT'
            },
            {
                'order': 5,
                'name': 'Agricultural Sciences Track',
                'name_arabic': 'مسلك علوم زراعية',
                'name_french': 'Filière Sciences Agronomiques',
                'code': '2BAC-SA'
            },
            {
                'order': 6,
                'name': 'Electrical Science and Technologies Track',
                'name_arabic': 'مسلك العلوم والتكنولوجيات الكهربائية',
                'name_french': 'Filière Sciences et Technologies Électriques',
                'code': '2BAC-STE'
            },
            {
                'order': 7,
                'name': 'Mechanical Science and Technologies Track',
                'name_arabic': 'مسلك العلوم والتكنولوجيات الميكانيكية',
                'name_french': 'Filière Sciences et Technologies Mécaniques',
                'code': '2BAC-STM'
            },
            {
                'order': 8,
                'name': 'Applied Arts Track',
                'name_arabic': 'مسلك فنون تطبيقية',
                'name_french': 'Filière Arts Appliqués',
                'code': '2BAC-AA'
            },
            {
                'order': 9,
                'name': 'Economics Track',
                'name_arabic': 'مسلك العلوم الاقتصادية',
                'name_french': 'Filière Sciences Économiques',
                'code': '2BAC-ECO'
            },
            {
                'order': 10,
                'name': 'Accounting Management Sciences Track',
                'name_arabic': 'مسلك علوم التدبير المحاسباتي',
                'name_french': 'Filière Sciences de la Gestion Comptable',
                'code': '2BAC-SGC'
            },
            {
                'order': 11,
                'name': 'Arts Track',
                'name_arabic': 'مسلك الآداب',
                'name_french': 'Filière Lettres',
                'code': '2BAC-L'
            },
            {
                'order': 12,
                'name': 'Human Sciences Track',
                'name_arabic': 'مسلك العلوم الإنسانية',
                'name_french': 'Filière Sciences Humaines',
                'code': '2BAC-SH'
            },
            {
                'order': 13,
                'name': 'Arabic Language Track',
                'name_arabic': 'مسلك اللغة العربية',
                'name_french': 'Filière Langue Arabe',
                'code': '2BAC-LA'
            },
            {
                'order': 14,
                'name': 'Islamic Sciences Track',
                'name_arabic': 'مسلك علوم شرعية',
                'name_french': 'Filière Sciences de la Charia',
                'code': '2BAC-SC'
            },
            {
                'order': 15,
                'name': '2nd Year Baccalaureate Mathematical Sciences A (French International Option)',
                'name_arabic': 'مسلك علوم رياضية أ (خيار فرنسية)',
                'name_french': '2ème Bac Sciences Mathématiques A (BIOF)',
                'code': '2BAC-SMA-BIOF'
            },
            {
                'order': 16,
                'name': '2nd Year Baccalaureate Mathematical Sciences B (French International Option)',
                'name_arabic': 'مسلك علوم رياضية ب (خيار فرنسية)',
                'name_french': '2ème Bac Sciences Mathématiques B (BIOF)',
                'code': '2BAC-SMB-BIOF'
            },
            {
                'order': 17,
                'name': '2nd Year Baccalaureate Physical Sciences (French International Option)',
                'name_arabic': 'مسلك علوم فيزيائية (خيار فرنسية)',
                'name_french': '2ème Bac Sciences Physiques (BIOF)',
                'code': '2BAC-SP-BIOF'
            },
            {
                'order': 18,
                'name': '2nd Year Baccalaureate Life and Earth Sciences (SVT) (French International Option)',
                'name_arabic': 'مسلك علوم الحياة و الارض (خيار فرنسية)',
                'name_french': '2ème Bac Sciences de la Vie et de la Terre (SVT) (BIOF)',
                'code': '2BAC-SVT-BIOF'
            },
            {
                'order': 19,
                'name': '2nd Year Baccalaureate Agricultural Sciences (French International Option)',
                'name_arabic': 'مسلك علوم زراعية (خيار فرنسية)',
                'name_french': '2ème Bac Sciences Agronomiques (BIOF)',
                'code': '2BAC-SA-BIOF'
            },
            {
                'order': 20,
                'name': '2nd Year Baccalaureate Electrical Science and Technologies (French International Option)',
                'name_arabic': 'مسلك العلوم والتكنولوجيات الكهربائية (خيار فرنسية)',
                'name_french': '2ème Bac Sciences et Technologies Électriques (BIOF)',
                'code': '2BAC-STE-BIOF'
            },
            {
                'order': 21,
                'name': '2nd Year Baccalaureate Mechanical Science and Technologies (French International Option)',
                'name_arabic': 'مسلك العلوم والتكنولوجيات الميكانيكية (خيار فرنسية)',
                'name_french': '2ème Bac Sciences et Technologies Mécaniques (BIOF)',
                'code': '2BAC-STM-BIOF'
            }
        ]

        try:
            grade = Grade.objects.get(name='Second Year Baccalaureate')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade "Second Year Baccalaureate" not found. Please create it first.')
            )
            return
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error finding grade: {e}')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 2nd Year Baccalaureate tracks...')
            deleted_count, _ = Track.objects.filter(grade=grade).delete()
            self.stdout.write(
                self.style.WARNING(f'Deleted {deleted_count} existing tracks.')
            )

        self.stdout.write('Creating 2nd Year Baccalaureate tracks...')

        created_count = 0
        for track_data in tracks_data:
            track, created = Track.objects.get_or_create(
                grade=grade,
                code=track_data['code'],
                defaults={
                    'name': track_data['name'],
                    'name_arabic': track_data['name_arabic'],
                    'name_french': track_data['name_french'],
                    'order': track_data['order'],
                    'description': '',
                    'description_arabic': '',
                    'description_french': '',
                    'is_active': True,
                }
            )
            if created:
                created_count += 1
                self.stdout.write(f'Created: {track.name}')
            else:
                self.stdout.write(f'Already exists: {track.name}')

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count} new tracks for 2nd Year Baccalaureate.'
            )
        )
