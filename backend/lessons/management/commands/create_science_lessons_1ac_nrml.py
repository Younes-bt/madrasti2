from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Science/Biology lessons for 1AC NRML track (Première Année Collège - Normal Track)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 1AC Science NRML lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 6 lessons (Biology/Living Things)
        lessons_s1 = [
            {'order': 1, 'title': 'Observation and Exploration of a Natural Environment', 'title_arabic': 'ملاحظة واستكشاف وسط طبيعي', 'title_french': 'Observation et exploration d\'un milieu naturel'},
            {'order': 2, 'title': 'Respiration in Living Beings', 'title_arabic': 'التنفس عند الكائنات الحية', 'title_french': 'La respiration chez les êtres vivants'},
            {'order': 3, 'title': 'Nutrition in Humans and Animals', 'title_arabic': 'التغذية عند الإنسان والحيوان', 'title_french': 'La nutrition chez l\'homme et l\'animal'},
            {'order': 4, 'title': 'Nutritional Needs of Green Plants', 'title_arabic': 'الحاجيات الغذائية للنباتات الخضراء', 'title_french': 'Les besoins nutritionnels des plantes vertes'},
            {'order': 5, 'title': 'Food Relationships and Energy Flow in a Natural Environment', 'title_arabic': 'العلاقات الغذائية وتدفق الطاقة في وسط طبيعي', 'title_french': 'Relations alimentaires et flux d\'énergie dans un milieu naturel'},
            {'order': 6, 'title': 'Classification of Living Beings and Natural Balances', 'title_arabic': 'تصنيف الكائنات الحية والتوازنات الطبيعية', 'title_french': 'Classification des êtres vivants et équilibres naturels'},
        ]

        # Second Cycle - 5 lessons (Geology/Earth Sciences)
        lessons_s2 = [
            {'order': 1, 'title': 'Topographic Map', 'title_arabic': 'الخريطة الطبوغرافية', 'title_french': 'La carte topographique'},
            {'order': 2, 'title': 'Preparation for Geological Field Trip, Its Implementation and Exploitation', 'title_arabic': 'التحضير للخرجة الجيولوجية, إنجازها واستثمارها', 'title_french': 'Préparation de la sortie géologique, sa réalisation et son exploitation'},
            {'order': 3, 'title': 'Stages of Sedimentary Rock Formation', 'title_arabic': 'مراحل تشكل الصخور الرسوبية', 'title_french': 'Étapes de formation des roches sédimentaires'},
            {'order': 4, 'title': 'Fossilization and Fossils', 'title_arabic': 'الاستحاثة والمستحاثات', 'title_french': 'La fossilisation et les fossiles'},
            {'order': 5, 'title': 'Water Resources', 'title_arabic': 'الموارد المائية', 'title_french': 'Les ressources hydriques'},
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
            self.stdout.write('Deleting existing 1AC Science NRML lessons for this subject and track...')
            # Delete lessons that are associated with both this subject, grade AND this specific track
            lessons_to_delete = Lesson.objects.filter(subject=subject, grade=grade, tracks=track)
            deleted_count = lessons_to_delete.count()
            lessons_to_delete.delete()
            self.stdout.write(self.style.WARNING(f'Deleted {deleted_count} existing lessons for this subject, grade, and track.'))

        self.stdout.write('Creating 1AC Science NRML lessons for this subject...')
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
                    'description': f"Science - {lesson_data['title_arabic']}",
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Science NRML lessons for 1AC.'
            )
        )