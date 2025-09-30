from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Biology/Life Sciences lessons for 1B BIOF (First Baccalaureate International Option French)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 1B BIOF Biology lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 6 lessons
        lessons_s1 = [
            {'order': 101, 'title': 'External Geological Phenomena - BIOF', 'title_arabic': 'الظواهر الجيولوجية الخارجية - BIOF', 'title_french': 'Les phénomènes géologiques externes - BIOF'},
            {'order': 102, 'title': 'Creation of Paleogeographic Map of a Region - BIOF', 'title_arabic': 'إنجاز الخريطة الباليوجغرافية لمنطقة - BIOF', 'title_french': 'Réalisation de la carte paléogéographique d\'une région - BIOF'},
            {'order': 103, 'title': 'Stratigraphic Principles and Establishment of Stratigraphic Scale - BIOF', 'title_arabic': 'المبادئ الطبقية وإنشاء المقياس الطبقي - BIOF', 'title_french': 'Les principes stratigraphiques et l\'établissement de l\'échelle stratigraphique - BIOF'},
            {'order': 104, 'title': 'Geological Map and Reconstruction of Geological History of a Given Region - BIOF', 'title_arabic': 'الخريطة الجيولوجية وإعادة تكوين التاريخ الجيولوجي لمنطقة معينة - BIOF', 'title_french': 'La carte géologique et la reconstitution de l\'histoire géologique d\'une région donnée - BIOF'},
            {'order': 105, 'title': 'Sedimentation and Sedimentary Environments - BIOF', 'title_arabic': 'الترسيب والبيئات الرسوبية - BIOF', 'title_french': 'La sédimentation et les milieux sédimentaires - BIOF'},
            {'order': 106, 'title': 'Interest and Methods of Sediment Study - BIOF', 'title_arabic': 'اهتمام وطرق دراسة الرواسب - BIOF', 'title_french': 'Intérêt et méthodes d\'étude des sédiments - BIOF'},
        ]

        # Second Cycle - 6 lessons
        lessons_s2 = [
            {'order': 201, 'title': 'Production of Organic Matter and Energy Flow - BIOF', 'title_arabic': 'إنتاج المادة العضوية وتدفق الطاقة - BIOF', 'title_french': 'Production de la matière organique et flux d\'énergie - BIOF'},
            {'order': 202, 'title': 'Exchanges Between Plants and Soil - BIOF', 'title_arabic': 'التبادلات بين النباتات والتربة - BIOF', 'title_french': 'Les échanges entre les plantes et le sol - BIOF'},
            {'order': 203, 'title': 'Mechanisms of Water and Mineral Salt Absorption in Plants - BIOF', 'title_arabic': 'آليات امتصاص الماء والأملاح المعدنية في النباتات - BIOF', 'title_french': 'Mécanismes d\'absorption de l\'eau et des sels minéraux chez les plantes - BIOF'},
            {'order': 204, 'title': 'Chlorophyll Gas Exchanges and Organic Matter Production - BIOF', 'title_arabic': 'التبادلات الغازية الكلوروفيلية وإنتاج المادة العضوية - BIOF', 'title_french': 'Les échanges gazeux chlorophylliens et la production de la matière organique - BIOF'},
            {'order': 205, 'title': 'Light Energy Capture and Photosynthesis Reactions - BIOF', 'title_arabic': 'التقاط طاقة الضوء وتفاعلات التمثيل الضوئي - BIOF', 'title_french': 'La captation de l\'énergie lumineuse et les réactions de la photosynthèse - BIOF'},
            {'order': 206, 'title': 'Hormonal Communication (Blood Sugar Regulation) - BIOF', 'title_arabic': 'التواصل الهرموني (تنظيم السكر في الدم) - BIOF', 'title_french': 'La communication hormonale (Régulation de la glycémie) - BIOF'},
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
            grade = Grade.objects.get(code='1B')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "1B" not found. Please create it first.')
            )
            return

        # Get specified BIOF tracks (only the science tracks)
        track_codes = ['1BAC-SE-BIOF', '1BAC-STE-BIOF', '1BAC-STM-BIOF']
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
            self.stdout.write('Deleting existing 1B BIOF Biology lessons...')
            for track in tracks:
                existing_lessons = Lesson.objects.filter(
                    subject=subject,
                    grade=grade,
                    tracks__code=track.code
                )
                for lesson in existing_lessons:
                    if lesson.tracks.count() == 1:
                        lesson.delete()
                    else:
                        lesson.tracks.remove(track)
            self.stdout.write(self.style.WARNING('Removed existing BIOF Biology lessons for 1B tracks.'))

        self.stdout.write('Creating 1B BIOF Biology lessons...')
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
                    'description': f"Biology BIOF - {lesson_data['title_french']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
            # Add all specified BIOF tracks to the lesson
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
                    'description': f"Biology BIOF - {lesson_data['title_french']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
            # Add all specified BIOF tracks to the lesson
            lesson.tracks.add(*tracks)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first cycle and {created_count_s2} new second cycle Biology BIOF lessons for 1B.'
            )
        )