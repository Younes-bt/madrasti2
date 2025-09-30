from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Science lessons for TC Literature tracks (Tronc Commun)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing TC Science lessons for Literature tracks before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 12 lessons (Water Resources and Management)
        lessons_s1 = [
            {'order': 1, 'title': 'Water Exploitation and Pollution', 'title_arabic': 'استغلال المياه وتلويثها', 'title_french': 'Exploitation et pollution de l\'eau'},
            {'order': 2, 'title': 'Excessive Water Exploitation', 'title_arabic': 'الإسراف في استغلال المياه', 'title_french': 'Gaspillage dans l\'exploitation de l\'eau'},
            {'order': 3, 'title': 'Water Pollution', 'title_arabic': 'تلوث المياه', 'title_french': 'Pollution de l\'eau'},
            {'order': 4, 'title': 'Formation of Water Reserves', 'title_arabic': 'تكوين المذخرات المائية', 'title_french': 'Formation des réserves d\'eau'},
            {'order': 5, 'title': 'Formation of Surface Water Reserves', 'title_arabic': 'تكوين المدخرات المائية السطحية', 'title_french': 'Formation des réserves d\'eau de surface'},
            {'order': 6, 'title': 'Formation of Groundwater Reserves', 'title_arabic': 'تكوين المدخرات المائية الجوفية', 'title_french': 'Formation des réserves d\'eau souterraine'},
            {'order': 7, 'title': 'Groundwater Exploration', 'title_arabic': 'التنقيب عن المياه الجوفية', 'title_french': 'Prospection des eaux souterraines'},
            {'order': 8, 'title': 'Drinking Water', 'title_arabic': 'الماء الشروب', 'title_french': 'Eau potable'},
            {'order': 9, 'title': 'Supplying Residential Communities with Drinking Water', 'title_arabic': 'تزويد المجمعات السكنية بالماء الشروب', 'title_french': 'Approvisionnement des communautés résidentielles en eau potable'},
            {'order': 10, 'title': 'Constants Determining Water Quality and Possible Uses', 'title_arabic': 'الثوابت المحددة لجودة المياه واستعمالاتها الممكنة', 'title_french': 'Constantes déterminant la qualité de l\'eau et ses utilisations possibles'},
            {'order': 11, 'title': 'Modern Water Treatment Technologies', 'title_arabic': 'التقنیات الحدیثة لمعالجة المیاه', 'title_french': 'Technologies modernes de traitement de l\'eau'},
            {'order': 12, 'title': 'Water Cycle', 'title_arabic': 'دورة الماء', 'title_french': 'Cycle de l\'eau'},
        ]

        # Second Cycle - 5 lessons (Environmental Disruption and Conservation)
        lessons_s2 = [
            {'order': 1, 'title': 'Some Aspects of Natural Balance Disruption', 'title_arabic': 'بعض مظاهر اختلال التوازنات الطبيعية', 'title_french': 'Quelques aspects de perturbation des équilibres naturels'},
            {'order': 2, 'title': 'Air Pollution, Ozone Layer Depletion and Global Warming', 'title_arabic': 'تلوث الهواء واتلاف طبقة الأوزون والانحباس الحراري', 'title_french': 'Pollution de l\'air, destruction de la couche d\'ozone et réchauffement climatique'},
            {'order': 3, 'title': 'Consequences of Excessive Chemical Use and Forest Destruction', 'title_arabic': 'عواقب استعمال المواد الكيميائية المفرط واتلاف الغابات', 'title_french': 'Conséquences de l\'usage excessif de produits chimiques et destruction des forêts'},
            {'order': 4, 'title': 'Animal Extinction: Causes and Consequences', 'title_arabic': 'انقراض الحيوانات أسبابه وعواقبه', 'title_french': 'Extinction des animaux: causes et conséquences'},
            {'order': 5, 'title': 'Conservation of Natural Balances', 'title_arabic': 'المحافظة على التوازنات الطبيعية', 'title_french': 'Conservation des équilibres naturels'},
        ]

        try:
            subject = Subject.objects.get(code='BIOL101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code BIOL101 not found. Please ensure it exists.')
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
            self.stdout.write('Deleting existing TC Science lessons for Literature tracks...')
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

        self.stdout.write('Creating TC Science lessons for Literature tracks...')
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
                    'description': f"Science - {lesson_data['title_arabic']}",
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
                    'description': f"Science - {lesson_data['title_arabic']}",
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Science lessons for TC Literature tracks.'
            )
        )