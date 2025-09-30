from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Physics lessons for TC French International tracks (Tronc Commun)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing TC Physics lessons for French International tracks before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 11 lessons (Mechanics and Chemistry)
        lessons_s1 = [
            {'order': 1, 'title': 'Universal Gravitation', 'title_arabic': 'الجاذبية الكونية', 'title_french': 'La gravitation universelle'},
            {'order': 2, 'title': 'Examples of Mechanical Actions', 'title_arabic': 'أمثلة على الأفعال الميكانيكية', 'title_french': 'Exemples d\'actions mécaniques'},
            {'order': 3, 'title': 'Motion', 'title_arabic': 'الحركة', 'title_french': 'Le mouvement'},
            {'order': 4, 'title': 'Principle of Inertia', 'title_arabic': 'مبدأ القصور الذاتي', 'title_french': 'Le principe d\'inertie'},
            {'order': 5, 'title': 'Equilibrium of a Body Under 2 Forces (Spring Tension - Archimedes\' Thrust)', 'title_arabic': 'توازن جسم تحت تأثير قوتين (شد النابض - دفع أرخميدس)', 'title_french': 'Équilibre d\'un corps sous l\'action de 2 forces (Tension d\'un ressort – Poussée d\'Archimède)'},
            {'order': 6, 'title': 'Equilibrium of a Body Under 3 Forces', 'title_arabic': 'توازن جسم تحت تأثير 3 قوى', 'title_french': 'Équilibre d\'un corps sous l\'action de 3 forces'},
            {'order': 7, 'title': 'Equilibrium of a Solid in Rotation Around a Fixed Axis', 'title_arabic': 'توازن جسم صلب في دوران حول محور ثابت', 'title_french': 'Équilibre d\'un solide en rotation autour d\'un axe fixe'},
            {'order': 8, 'title': 'Chemical Species', 'title_arabic': 'الأنواع الكيميائية', 'title_french': 'Les espèces chimiques'},
            {'order': 9, 'title': 'Extraction, Separation and Identification of Chemical Species', 'title_arabic': 'استخراج وفصل وتحديد الأنواع الكيميائية', 'title_french': 'Extraction, séparation et identification des espèces chimiques'},
            {'order': 10, 'title': 'Synthesis of Chemical Species', 'title_arabic': 'تركيب الأنواع الكيميائية', 'title_french': 'Synthèse des espèces chimiques'},
            {'order': 11, 'title': 'The Atomic Model', 'title_arabic': 'نموذج الذرة', 'title_french': 'Le modèle de l\'atome'},
        ]

        # Second Cycle - 11 lessons (Chemistry and Electricity)
        lessons_s2 = [
            {'order': 1, 'title': 'Geometry of Some Molecules', 'title_arabic': 'هندسة بعض الجزيئات', 'title_french': 'La géométrie de quelques molécules'},
            {'order': 2, 'title': 'Periodic Classification of Chemical Elements', 'title_arabic': 'التصنيف الدوري للعناصر الكيميائية', 'title_french': 'Classification périodique des éléments chimiques'},
            {'order': 3, 'title': 'Direct Current', 'title_arabic': 'التيار الكهربائي المستمر', 'title_french': 'Le courant électrique continu'},
            {'order': 4, 'title': 'Electric Voltage', 'title_arabic': 'التوتر الكهربائي', 'title_french': 'La tension électrique'},
            {'order': 5, 'title': 'Association of Ohmic Conductors', 'title_arabic': 'تجميع الموصلات الأومية', 'title_french': 'Association des conducteurs ohmiques'},
            {'order': 6, 'title': 'Characteristics of Some Passive Dipoles', 'title_arabic': 'خصائص بعض الثنائيات القطب السلبية', 'title_french': 'Caractéristiques de quelque dipôles passifs'},
            {'order': 7, 'title': 'Characteristics of an Active Dipole', 'title_arabic': 'خصائص ثنائي القطب النشط', 'title_french': 'Caractéristiques d\'un dipôle actif'},
            {'order': 8, 'title': 'The Transistor', 'title_arabic': 'الترانزستور', 'title_french': 'Le transistor'},
            {'order': 9, 'title': 'The Operational Amplifier', 'title_arabic': 'المضخم العملياتي', 'title_french': 'L\'amplificateur opérationnel'},
            {'order': 10, 'title': 'The Mole, Unit of Quantity of Matter', 'title_arabic': 'المول، وحدة كمية المادة', 'title_french': 'La mole, unité de quantité de matière'},
            {'order': 11, 'title': 'Molar Concentration', 'title_arabic': 'التركيز المولي', 'title_french': 'La concentration molaire'},
        ]

        try:
            subject = Subject.objects.get(code='PHYS101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code PHYS101 not found. Please ensure it exists.')
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

        # Get French International tracks
        track_codes = ['TCS-BIOF', 'TCT-BIOF']
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
            self.stdout.write('Deleting existing TC Physics lessons for French International tracks...')
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
            self.stdout.write(self.style.WARNING('Removed existing lessons for French International tracks.'))

        self.stdout.write('Creating TC Physics lessons for French International tracks...')
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
                    'description': f"Physics - {lesson_data['title_arabic']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
            # Add French International tracks to the lesson
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
                    'description': f"Physics - {lesson_data['title_arabic']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
            # Add French International tracks to the lesson
            lesson.tracks.add(*tracks)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Physics lessons for TC French International tracks.'
            )
        )