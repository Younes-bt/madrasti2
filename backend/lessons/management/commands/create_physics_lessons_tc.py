from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Physics lessons for TC (Tronc Commun)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing TC Physics lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # Split each section across both cycles

        # First Cycle - 15 lessons (first half of each section)
        lessons_s1 = [
            # Mechanics Section - First Cycle (9 lessons)
            {'order': 1, 'title': 'Mechanical Interactions', 'title_arabic': 'التأثيرات البينية الميكانيكية', 'title_french': 'Interactions mécaniques', 'section': 'الميكانيك'},
            {'order': 2, 'title': 'Universal Gravitation', 'title_arabic': 'التجاذب الكوني', 'title_french': 'Gravitation universelle', 'section': 'الميكانيك'},
            {'order': 3, 'title': 'Mechanical Effects', 'title_arabic': 'التأثيرات الميكانيكية', 'title_french': 'Effets mécaniques', 'section': 'الميكانيك'},
            {'order': 4, 'title': 'Motion', 'title_arabic': 'الحركة', 'title_french': 'Mouvement', 'section': 'الميكانيك'},
            {'order': 5, 'title': 'Principle of Inertia', 'title_arabic': 'مبدأ القصور', 'title_french': 'Principe d\'inertie', 'section': 'الميكانيك'},
            {'order': 6, 'title': 'Equilibrium of Body Subject to Two Forces', 'title_arabic': 'توازن جسم خاضع لقوتين', 'title_french': 'Équilibre d\'un corps soumis à deux forces', 'section': 'الميكانيك'},
            {'order': 7, 'title': 'Force Applied by a Spring', 'title_arabic': 'القوة المطبقة من طرف نابض', 'title_french': 'Force appliquée par un ressort', 'section': 'الميكانيك'},
            {'order': 8, 'title': 'Archimedes\' Principle', 'title_arabic': 'دافعة أرخميدس', 'title_french': 'Poussée d\'Archimède', 'section': 'الميكانيك'},
            {'order': 9, 'title': 'Equilibrium of Solid Body', 'title_arabic': 'توازن جسم صلب', 'title_french': 'Équilibre d\'un corps solide', 'section': 'الميكانيك'},

            # Chemistry Section - First Cycle (6 lessons)
            {'order': 10, 'title': 'Chemistry Around Us', 'title_arabic': 'الكيمياء من حولنا', 'title_french': 'Chimie autour de nous', 'section': 'الكيمياء'},
            {'order': 11, 'title': 'Chemical Species', 'title_arabic': 'الأنواع الكيميائية', 'title_french': 'Espèces chimiques', 'section': 'الكيمياء'},
            {'order': 12, 'title': 'Extraction, Separation and Detection of Chemical Species', 'title_arabic': 'استخراج وفصل الأنواع الكيميائية والكشف عنها', 'title_french': 'Extraction, séparation et détection des espèces chimiques', 'section': 'الكيمياء'},
            {'order': 13, 'title': 'Manufacturing Chemical Species', 'title_arabic': 'تصنيع الأنواع الكيميائية', 'title_french': 'Fabrication d\'espèces chimiques', 'section': 'الكيمياء'},
            {'order': 14, 'title': 'Atomic Model', 'title_arabic': 'نموذج الذرة', 'title_french': 'Modèle de l\'atome', 'section': 'الكيمياء'},
            {'order': 15, 'title': 'Geometry of Some Molecules', 'title_arabic': 'هندسة بعض الجزيئات', 'title_french': 'Géométrie de quelques molécules', 'section': 'الكيمياء'},
        ]

        # Second Cycle - 15 lessons (second half of each section)
        lessons_s2 = [
            # Mechanics Section - Second Cycle (3 lessons)
            {'order': 1, 'title': 'Equilibrium of Solid Body Subject to Three Non-Parallel Forces', 'title_arabic': 'توازن جسم صلب خاضع لثلاث قوى غير متوازية', 'title_french': 'Équilibre d\'un corps solide soumis à trois forces non parallèles', 'section': 'الميكانيك'},
            {'order': 2, 'title': 'Equilibrium of Body Rotatable Around Fixed Axis', 'title_arabic': 'توازن جسم قابل للدوران حول محور تابث', 'title_french': 'Équilibre d\'un corps mobile autour d\'un axe fixe', 'section': 'الميكانيك'},
            {'order': 3, 'title': 'Periodic Classification of Chemical Elements', 'title_arabic': 'الترتيب الدوري للعناصر الكيميائية', 'title_french': 'Classification périodique des éléments chimiques', 'section': 'الكيمياء'},

            # Electronics Section (8 lessons)
            {'order': 4, 'title': 'Direct Electric Current', 'title_arabic': 'التيار الكهربائي المستمر', 'title_french': 'Courant électrique continu', 'section': 'الإلكترونيك'},
            {'order': 5, 'title': 'Electric Voltage', 'title_arabic': 'التوتر الكهربائي', 'title_french': 'Tension électrique', 'section': 'الإلكترونيك'},
            {'order': 6, 'title': 'Assembly of Ohmic Conductors', 'title_arabic': 'تجميع الموصلات الأومية', 'title_french': 'Assemblage de conducteurs ohmiques', 'section': 'الإلكترونيك'},
            {'order': 7, 'title': 'Characteristics of Some Passive Dipoles', 'title_arabic': 'مميزات بعض ثنائيات القطب غير النشيطة', 'title_french': 'Caractéristiques de quelques dipôles passifs', 'section': 'الإلكترونيك'},
            {'order': 8, 'title': 'Characteristics of Active Dipole', 'title_arabic': 'مميزات ثنائي القطب النشيط', 'title_french': 'Caractéristiques du dipôle actif', 'section': 'الإلكترونيك'},
            {'order': 9, 'title': 'Electronic Circuits', 'title_arabic': 'تراكيب إلكترونية', 'title_french': 'Circuits électroniques', 'section': 'الإلكترونيك'},
            {'order': 10, 'title': 'Transistor', 'title_arabic': 'الترانزستور', 'title_french': 'Transistor', 'section': 'الإلكترونيك'},
            {'order': 11, 'title': 'Operational Amplifier', 'title_arabic': 'المضخم العملياتي', 'title_french': 'Amplificateur opérationnel', 'section': 'الإلكترونيك'},

            # Chemistry Section - Second Cycle (4 lessons)
            {'order': 12, 'title': 'Tools to Describe Chemical Group', 'title_arabic': 'أدوات لوصف مجموعة كيميائية', 'title_french': 'Outils pour décrire un groupe chimique', 'section': 'الكيمياء'},
            {'order': 13, 'title': 'Quantity of Matter - Mole', 'title_arabic': 'كمية المادة – المول', 'title_french': 'Quantité de matière - Mole', 'section': 'الكيمياء'},
            {'order': 14, 'title': 'Molar Concentration', 'title_arabic': 'التركيز المولي', 'title_french': 'Concentration molaire', 'section': 'الكيمياء'},
            {'order': 15, 'title': 'Chemical Transformation and Matter Balance', 'title_arabic': 'التحول الكيميائى وحصيلة المادة', 'title_french': 'Transformation chimique et bilan de matière', 'section': 'الكيمياء'},
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

        # Get specified tracks (excluding French International Options for Physics)
        track_codes = ['TCS', 'TCT', 'TCEO', 'TCIB']
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
            self.stdout.write('Deleting existing TC Physics lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating TC Physics lessons for this subject...')
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
                    'description': f"Physics - {lesson_data['section']} - {lesson_data['title_arabic']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
            # Add specified tracks to the lesson
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
                    'description': f"Physics - {lesson_data['section']} - {lesson_data['title_arabic']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
            # Add specified tracks to the lesson
            lesson.tracks.add(*tracks)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Physics lessons for TC.'
            )
        )