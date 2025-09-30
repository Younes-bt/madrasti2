from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Physics/Chemistry lessons for 1B (First Baccalaureate)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 1B Physics/Chemistry lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 14 lessons
        lessons_s1 = [
            {'order': 1, 'title': 'Work, Power and Force', 'title_arabic': 'شغل وقدرة قوة', 'title_french': 'Travail, puissance et force'},
            {'order': 2, 'title': 'Work and Kinetic Energy', 'title_arabic': 'الشغل والطاقة الحركية', 'title_french': 'Travail et énergie cinétique'},
            {'order': 3, 'title': 'Work and Gravitational Potential Energy - Mechanical Energy', 'title_arabic': 'الشغل وطاقة الوضع الثقالية – الطاقة الميكانيكية', 'title_french': 'Travail et énergie potentielle gravitationnelle - Énergie mécanique'},
            {'order': 4, 'title': 'Work and Internal Energy', 'title_arabic': 'الشغل والطاقة الداخلية', 'title_french': 'Travail et énergie interne'},
            {'order': 5, 'title': 'Thermal Energy and Heat Transfer', 'title_arabic': 'الطاقة الحرارية والانتقال الحراري', 'title_french': 'Énergie thermique et transfert de chaleur'},
            {'order': 6, 'title': 'Mechanical Work and Energy', 'title_arabic': 'الشغل الميكانيكي والطاقة', 'title_french': 'Travail mécanique et énergie'},
            {'order': 7, 'title': 'Measurement in Chemistry', 'title_arabic': 'القياس في الكيمياء', 'title_french': 'Mesure en chimie'},
            {'order': 8, 'title': 'Physical Quantities Related to Amount of Matter', 'title_arabic': 'المقادير الفيزيائية المرتبطة بكمية المادة', 'title_french': 'Grandeurs physiques liées à la quantité de matière'},
            {'order': 9, 'title': 'Concentration and Electrolytic Solutions', 'title_arabic': 'التركيز والمحاليل الإلكتروليتية', 'title_french': 'Concentration et solutions électrolytiques'},
            {'order': 10, 'title': 'Monitoring Chemical Transformation Progress', 'title_arabic': 'تتبع تطور تحول كيميائي', 'title_french': 'Suivi de l\'évolution d\'une transformation chimique'},
            {'order': 11, 'title': 'Conductance and Conductivity', 'title_arabic': 'المواصلة والموصلية', 'title_french': 'Conductance et conductivité'},
            {'order': 12, 'title': 'Acid-Base Reactions', 'title_arabic': 'التفاعلات حمض – قاعدة', 'title_french': 'Réactions acide-base'},
            {'order': 13, 'title': 'Oxidation and Reduction Reactions', 'title_arabic': 'تفاعلات الأكسدة والاختزال', 'title_french': 'Réactions d\'oxydation et de réduction'},
            {'order': 14, 'title': 'Direct Titrations', 'title_arabic': 'المعايرات المباشرة', 'title_french': 'Titrages directs'},
        ]

        # Second Cycle - 17 lessons
        lessons_s2 = [
            {'order': 1, 'title': 'Mechanical Work and Energy', 'title_arabic': 'الشغل الميكانيكي والطاقة', 'title_french': 'Travail mécanique et énergie'},
            {'order': 2, 'title': 'Quantities Related to Amount of Matter', 'title_arabic': 'المقادير المرتبطة بكمية المادة', 'title_french': 'Grandeurs liées à la quantité de matière'},
            {'order': 3, 'title': 'Electrostatic Potential Energy', 'title_arabic': 'طاقة الوضع الكهرساكنة', 'title_french': 'Énergie potentielle électrostatique'},
            {'order': 4, 'title': 'Magnetic Field', 'title_arabic': 'المجال المغناطيسي', 'title_french': 'Champ magnétique'},
            {'order': 5, 'title': 'Magnetism', 'title_arabic': 'المغناطيسية', 'title_french': 'Magnétisme'},
            {'order': 6, 'title': 'Characteristic Groups in Organic Chemistry', 'title_arabic': 'المجموعات المميزة في الكيمياء العضوية', 'title_french': 'Groupes caractéristiques en chimie organique'},
            {'order': 7, 'title': 'Energy Transfer in Electric Circuit', 'title_arabic': 'انتقال الطاقة في دارة كهربائية', 'title_french': 'Transfert d\'énergie dans un circuit électrique'},
            {'order': 8, 'title': 'General Behavior of Electric Circuit', 'title_arabic': 'التصرف العام لدارة كهربائية', 'title_french': 'Comportement général d\'un circuit électrique'},
            {'order': 9, 'title': 'Magnetic Field of Electric Current', 'title_arabic': 'المجال المغناطيسي لتيار كهربائي', 'title_french': 'Champ magnétique d\'un courant électrique'},
            {'order': 10, 'title': 'Electromagnetic Forces - Laplace Law', 'title_arabic': 'القوى الكهرمغنطيسية قانون لابلاص', 'title_french': 'Forces électromagnétiques - Loi de Laplace'},
            {'order': 11, 'title': 'Visibility of an Object', 'title_arabic': 'قابلية رؤية شيء', 'title_french': 'Visibilité d\'un objet'},
            {'order': 12, 'title': 'Images Obtained by a Plane Mirror', 'title_arabic': 'الصور المحصل عليها بواسطة مرآة مستوية', 'title_french': 'Images obtenues par un miroir plan'},
            {'order': 13, 'title': 'Images Obtained by a Thin Converging Lens', 'title_arabic': 'الصور المحصل عليها بواسطة عدسة رقيقة مجمعة', 'title_french': 'Images obtenues par une lentille mince convergente'},
            {'order': 14, 'title': 'Some Optical Instruments', 'title_arabic': 'بعض الأجهزة البصرية', 'title_french': 'Quelques instruments optiques'},
            {'order': 15, 'title': 'Expansion of Organic Chemistry', 'title_arabic': 'توسع الكيمياء العضوية', 'title_french': 'Expansion de la chimie organique'},
            {'order': 16, 'title': 'Organic Molecules and Carbon Structures', 'title_arabic': 'الجزيئات العضوية والهياكل الكربونية', 'title_french': 'Molécules organiques et structures carbonées'},
            {'order': 17, 'title': 'Changing Carbon Structure', 'title_arabic': 'تغيير الهيكل الكربوني', 'title_french': 'Modification de la structure carbonée'},
        ]

        try:
            # Try to find Physics/Chemistry subject - adjust code as needed
            subject = None
            possible_codes = ['PC101', 'PHYS101', 'PC', 'PHYSICS']
            for code in possible_codes:
                try:
                    subject = Subject.objects.get(code=code)
                    break
                except Subject.DoesNotExist:
                    continue

            if not subject:
                self.stdout.write(
                    self.style.ERROR('Physics/Chemistry subject not found. Please ensure it exists with one of these codes: PC101, PHYS101, PC, PHYSICS')
                )
                return

            self.stdout.write(f'Found subject: {subject.name}')
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error finding subject: {e}')
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

        # Get all specified tracks
        track_codes = ['1BAC-SM', '1BAC-SE', '1BAC-ECO', '1BAC-LSH', '1BAC-AA', '1BAC-STM', '1BAC-STE', '1BAC-LA', '1BAC-SC']
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
            self.stdout.write('Deleting existing 1B Physics/Chemistry lessons...')
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
            self.stdout.write(self.style.WARNING('Removed existing Physics/Chemistry lessons for 1B tracks.'))

        self.stdout.write('Creating 1B Physics/Chemistry lessons...')
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
                    'description': f"Physics/Chemistry - {lesson_data['title_arabic']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
            # Add all specified tracks to the lesson
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
                    'description': f"Physics/Chemistry - {lesson_data['title_arabic']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
            # Add all specified tracks to the lesson
            lesson.tracks.add(*tracks)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first cycle and {created_count_s2} new second cycle Physics/Chemistry lessons for 1B.'
            )
        )