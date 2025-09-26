from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create 9 biology lessons (lessons 1-9) for Second Year Baccalaureate - First Cycle'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing first cycle biology lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # Biology lessons data for first cycle (lessons 1-9)
        biology_lessons_cycle1 = [
            {
                'order': 1,
                'title': 'Consumption of organic matter and energy flow',
                'title_arabic': 'استهلاك المادة العضوية وتدفق الطاقة',
                'title_french': 'Consommation de la matière organique et flux d\'énergie',
                'description': 'Study of organic matter consumption and energy flow in biological systems.',
                'objectives': 'Understand energy transfer and organic matter utilization in living organisms.',
                'prerequisites': 'Basic knowledge of cellular biology and energy concepts.'
            },
            {
                'order': 2,
                'title': 'Release of potential energy from organic matter',
                'title_arabic': 'تحرير الطاقة الكامنة على مستوى المادة العضوية',
                'title_french': 'Libération de l\'énergie emmagasinée dans la matière organique',
                'description': 'Study of cellular respiration and energy release mechanisms.',
                'objectives': 'Understand how cells extract and utilize energy from organic molecules.',
                'prerequisites': 'Knowledge of organic molecules and cellular structure.'
            },
            {
                'order': 3,
                'title': 'The role of the striated skeletal muscle in energy conversion',
                'title_arabic': 'دور العضلة الهيكلية المخططة في تحويل الطاقة',
                'title_french': 'Rôle du muscle strié squelettique dans la conversion de l\'énergie',
                'description': 'Study of muscle contraction and energy conversion mechanisms.',
                'objectives': 'Understand muscle physiology and energy transformation in movement.',
                'prerequisites': 'Knowledge of muscle anatomy and cellular energy processes.'
            },
            {
                'order': 4,
                'title': 'The concept of genetic information',
                'title_arabic': 'مفهوم الخبر الوراثي',
                'title_french': 'Le concept de l\'information génétique',
                'description': 'Introduction to genetic information and DNA structure.',
                'objectives': 'Understand the molecular basis of genetic information storage.',
                'prerequisites': 'Basic knowledge of cell biology and molecular structure.'
            },
            {
                'order': 5,
                'title': 'The expression of genetic information',
                'title_arabic': 'تعبير الخبر الوراثي',
                'title_french': 'L\'expression de l\'information génétique',
                'description': 'Study of gene expression, transcription, and translation.',
                'objectives': 'Understand how genetic information is expressed into proteins.',
                'prerequisites': 'Knowledge of DNA structure and protein synthesis basics.'
            },
            {
                'order': 6,
                'title': 'Genetic engineering: principles and techniques',
                'title_arabic': 'الهندسة الوراثية : مبادئها وتقنياتها',
                'title_french': 'Le génie génétique : principes et techniques',
                'description': 'Introduction to genetic engineering methods and applications.',
                'objectives': 'Understand genetic engineering techniques and their applications.',
                'prerequisites': 'Knowledge of DNA structure and gene expression.'
            },
            {
                'order': 7,
                'title': 'Transmission of genetic information through sexual reproduction',
                'title_arabic': 'نقل الخبر الوراثي عبر التوالد الجنسي',
                'title_french': 'Transmission de l\'information génétique par la reproduction sexuée',
                'description': 'Study of genetic transmission through sexual reproduction.',
                'objectives': 'Understand meiosis and genetic inheritance patterns.',
                'prerequisites': 'Knowledge of genetic information and cell division.'
            },
            {
                'order': 8,
                'title': 'Statistical laws of the transmission of hereditary traits in diploids',
                'title_arabic': 'القوانين الإحصائية لانتقال الصفات الوراثية عند ثنائيات الصيغة الصبغية',
                'title_french': 'Les lois statistiques de la transmission des caractères héréditaires chez les diploïdes',
                'description': 'Study of Mendelian genetics and inheritance patterns.',
                'objectives': 'Master Mendel\'s laws and genetic probability calculations.',
                'prerequisites': 'Understanding of genetic transmission and basic statistics.'
            },
            {
                'order': 9,
                'title': 'Human genetics',
                'title_arabic': 'علم الوراثة البشرية',
                'title_french': 'La génétique humaine',
                'description': 'Study of human genetic inheritance and genetic disorders.',
                'objectives': 'Understand human genetic patterns and hereditary diseases.',
                'prerequisites': 'Knowledge of genetics principles and inheritance laws.'
            }
        ]

        try:
            # Get Biology subject
            biology_subject = Subject.objects.get(code='BIOL101')
            self.stdout.write(f'Found Biology subject: {biology_subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Biology subject not found. Please ensure BIOL101 exists.')
            )
            return

        try:
            # Get Second Year Baccalaureate grade (Grade ID 12)
            second_year_bac_grade = Grade.objects.get(id=12)
            self.stdout.write(f'Found grade: {second_year_bac_grade.name}')

        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Second Year Baccalaureate grade (ID: 12) not found. Please create the grade first.')
            )
            return
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error finding grade: {e}')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing first cycle biology lessons...')
            deleted_count = Lesson.objects.filter(
                subject=biology_subject,
                grade=second_year_bac_grade,
                cycle='first'
            ).delete()[0]
            self.stdout.write(
                self.style.WARNING(f'Deleted {deleted_count} existing first cycle biology lessons')
            )

        self.stdout.write('Creating first cycle biology lessons...')

        created_count = 0
        for lesson_data in biology_lessons_cycle1:
            lesson, created = Lesson.objects.get_or_create(
                subject=biology_subject,
                grade=second_year_bac_grade,
                cycle='first',  # First Cycle as specified
                order=lesson_data['order'],
                defaults={
                    'title': lesson_data['title'],
                    'title_arabic': lesson_data['title_arabic'],
                    'title_french': lesson_data['title_french'],
                    'description': lesson_data['description'],
                    'objectives': lesson_data['objectives'],
                    'prerequisites': lesson_data['prerequisites'],
                    'difficulty_level': 'medium',  # Medium difficulty as specified
                    'is_active': True,
                }
            )

            if created:
                created_count += 1
                self.stdout.write(f'Created: Lesson {lesson.order} - {lesson.title}')
            else:
                self.stdout.write(f'Already exists: Lesson {lesson.order} - {lesson.title}')

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count} new first cycle biology lessons. '
                f'Total first cycle biology lessons for {second_year_bac_grade.name}: {Lesson.objects.filter(subject=biology_subject, grade=second_year_bac_grade, cycle="first").count()}'
            )
        )