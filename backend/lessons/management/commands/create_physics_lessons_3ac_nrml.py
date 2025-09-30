from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Physics lessons for 3AC Normal track (Troisième Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 3AC Physics lessons for Normal track before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 10 lessons (Chemistry focus)
        lessons_s1 = [
            {'order': 1, 'title': 'Materials and Objects', 'title_arabic': 'المواد والأجسام', 'title_french': 'Matériaux et objets'},
            {'order': 2, 'title': 'Examples of Materials Used in Daily Life', 'title_arabic': 'أمثلة لبعض المواد المستعملة في حياتنا اليومية', 'title_french': 'Exemples de matériaux utilisés dans notre vie quotidienne'},
            {'order': 3, 'title': 'Materials and Electricity', 'title_arabic': 'المواد والكهرباء', 'title_french': 'Matériaux et électricité'},
            {'order': 4, 'title': 'Atoms and Ions', 'title_arabic': 'الذرات والأيونات', 'title_french': 'Atomes et ions'},
            {'order': 5, 'title': 'Oxidation of Metals in Air', 'title_arabic': 'أكسدة الفلزات في الهواء', 'title_french': 'Oxydation des métaux dans l\'air'},
            {'order': 6, 'title': 'Reactions of Organic Materials with Oxygen in Air', 'title_arabic': 'تفاعلات بعض المواد العضوية مع ثنائي أكسيجين الهواء', 'title_french': 'Réactions de matières organiques avec l\'oxygène de l\'air'},
            {'order': 7, 'title': 'Acidic and Basic Solutions', 'title_arabic': 'المحاليل الحمضية والمحاليل القاعدية', 'title_french': 'Solutions acides et basiques'},
            {'order': 8, 'title': 'Reactions of Materials with Acidic and Basic Solutions', 'title_arabic': 'تفاعلات بعض المواد مع المحاليل الحمضية والقاعدية', 'title_french': 'Réactions de matériaux avec solutions acides et basiques'},
            {'order': 9, 'title': 'Tests for Detecting Some Ions', 'title_arabic': 'روائز الكشف عن بعض الأيونات', 'title_french': 'Tests de détection de certains ions'},
            {'order': 10, 'title': 'Danger of Some Materials Used in Daily Life on Health and Environment', 'title_arabic': 'خطورة بعض المواد المستعملة في الحياة اليومية على الصحة والبيئة', 'title_french': 'Danger de certains matériaux sur la santé et l\'environnement'},
        ]

        # Second Cycle - 10 lessons (Physics and Mechanics focus)
        lessons_s2 = [
            {'order': 1, 'title': 'Motion and Rest', 'title_arabic': 'الحركة والسكون', 'title_french': 'Mouvement et repos'},
            {'order': 2, 'title': 'Speed', 'title_arabic': 'السرعة', 'title_french': 'Vitesse'},
            {'order': 3, 'title': 'Motion and Speed', 'title_arabic': 'الحركة والسرعة', 'title_french': 'Mouvement et vitesse'},
            {'order': 4, 'title': 'Mechanical Effects', 'title_arabic': 'التأثيرات الميكانيكية', 'title_french': 'Effets mécaniques'},
            {'order': 5, 'title': 'Concept of Force', 'title_arabic': 'مفهوم القوة', 'title_french': 'Concept de force'},
            {'order': 6, 'title': 'Equilibrium of a Body Subject to Two Forces', 'title_arabic': 'توازن جسم خاضع لقوتين', 'title_french': 'Équilibre d\'un corps soumis à deux forces'},
            {'order': 7, 'title': 'Weight and Mass', 'title_arabic': 'الوزن والكتلة', 'title_french': 'Poids et masse'},
            {'order': 8, 'title': 'Electrical Resistance - Ohm\'s Law', 'title_arabic': 'المقاومة الكهربائية قانون أوم', 'title_french': 'Résistance électrique - Loi d\'Ohm'},
            {'order': 9, 'title': 'Electrical Power', 'title_arabic': 'القدرة الكهربائية', 'title_french': 'Puissance électrique'},
            {'order': 10, 'title': 'Electrical Energy', 'title_arabic': 'الطاقة الكهربائية', 'title_french': 'Énergie électrique'},
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
            grade = Grade.objects.get(code='3AC')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "3AC" not found. Please create it first.')
            )
            return

        try:
            track_nrml = Track.objects.get(code='3AC-NRML')
            self.stdout.write(f'Found NRML track: {track_nrml.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "3AC-NRML" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 3AC Physics lessons for Normal track...')
            existing_lessons = Lesson.objects.filter(
                subject=subject,
                grade=grade,
                tracks__code='3AC-NRML'
            )
            for lesson in existing_lessons:
                if lesson.tracks.count() == 1:  # Only delete if this is the only track
                    lesson.delete()
                else:
                    lesson.tracks.remove(track_nrml)  # Just remove from this track
            self.stdout.write(self.style.WARNING('Removed existing lessons for Normal track.'))

        self.stdout.write('Creating 3AC Physics lessons for Normal track...')
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
            # Add Normal track to the lesson
            lesson.tracks.add(track_nrml)

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
            # Add Normal track to the lesson
            lesson.tracks.add(track_nrml)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Physics lessons for 3AC Normal track.'
            )
        )