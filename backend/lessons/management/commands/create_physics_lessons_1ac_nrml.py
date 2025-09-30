from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Physics lessons for 1AC NRML track (Première Année Collège - Normal Track)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 1AC Physics NRML lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 12 lessons (Matter and Water)
        lessons_s1 = [
            {'order': 1, 'title': 'Water Around Us', 'title_arabic': 'الماء من حولنا', 'title_french': 'L\'eau autour de nous'},
            {'order': 2, 'title': 'Solids, Liquids and Gases', 'title_arabic': 'الأجسام الصلبة والسوائل والغازات', 'title_french': 'Les solides, liquides et gaz'},
            {'order': 3, 'title': 'Volume', 'title_arabic': 'الحجم', 'title_french': 'Le volume'},
            {'order': 4, 'title': 'Mass', 'title_arabic': 'الكتلة', 'title_french': 'La masse'},
            {'order': 5, 'title': 'Density', 'title_arabic': 'الكتلة الحجمية', 'title_french': 'La masse volumique'},
            {'order': 6, 'title': 'Pressure and Atmospheric Pressure', 'title_arabic': 'الضغط والضغط الجوي', 'title_french': 'La pression et la pression atmosphérique'},
            {'order': 7, 'title': 'Heat and Physical State Changes of Matter', 'title_arabic': 'الحرارة وتغيرات الحالة الفيزيائية للمادة', 'title_french': 'La chaleur et les changements d\'état physique de la matière'},
            {'order': 8, 'title': 'Mixtures', 'title_arabic': 'الخلائط', 'title_french': 'Les mélanges'},
            {'order': 9, 'title': 'Dissolution in Water', 'title_arabic': 'الذوبان في الماء', 'title_french': 'La dissolution dans l\'eau'},
            {'order': 10, 'title': 'Separation of Mixture Components', 'title_arabic': 'فصل مكونات خليط', 'title_french': 'Séparation des constituants d\'un mélange'},
            {'order': 11, 'title': 'Pure Substance and Its Characteristics', 'title_arabic': 'الجسم الخالص ومميزاته', 'title_french': 'Le corps pur et ses caractéristiques'},
            {'order': 12, 'title': 'Water Treatment', 'title_arabic': 'معالجة المياه', 'title_french': 'Le traitement des eaux'},
        ]

        # Second Cycle - 9 lessons (Electricity)
        lessons_s2 = [
            {'order': 1, 'title': 'Electricity Around Us', 'title_arabic': 'الكهرباء من حولنا', 'title_french': 'L\'électricité autour de nous'},
            {'order': 2, 'title': 'Simple Electric Circuit', 'title_arabic': 'الدارة الكهربائية البسيطة', 'title_french': 'Le circuit électrique simple'},
            {'order': 3, 'title': 'Conductors and Insulators', 'title_arabic': 'الموصلات والعوازل', 'title_french': 'Les conducteurs et les isolants'},
            {'order': 4, 'title': 'Lamp Installation', 'title_arabic': 'تركيب المصابيح', 'title_french': 'Installation des lampes'},
            {'order': 5, 'title': 'Direct Electric Current', 'title_arabic': 'التيار الكهربائي المستمر', 'title_french': 'Le courant électrique continu'},
            {'order': 6, 'title': 'Electrical Resistance', 'title_arabic': 'المقاومة الكهربائية', 'title_french': 'La résistance électrique'},
            {'order': 7, 'title': 'Node Law', 'title_arabic': 'قانون العقد', 'title_french': 'Loi des noeuds'},
            {'order': 8, 'title': 'Voltage Additivity', 'title_arabic': 'إضافية التوترات', 'title_french': 'Additivité des tensions'},
            {'order': 9, 'title': 'Protection from Electrical Current Dangers', 'title_arabic': 'الوقاية من أخطار التيار الكهربائي', 'title_french': 'Protection contre les dangers du courant électrique'},
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
            grade = Grade.objects.get(code='1AC')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "1AC" not found. Please create it first.')
            )
            return

        try:
            track = Track.objects.get(code='1AC-NRML')
            self.stdout.write(f'Found track: {track.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "1AC-NRML" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 1AC Physics NRML lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating 1AC Physics NRML lessons for this subject...')
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
            # Add track to the lesson (works for both created and existing lessons)
            lesson.tracks.add(track)

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
            # Add track to the lesson (works for both created and existing lessons)
            lesson.tracks.add(track)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Physics NRML lessons for 1AC.'
            )
        )