from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create 14 physics lessons (lessons 1-14) for First Year Baccalaureate - First Cycle'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing first cycle physics lessons for First Year Baccalaureate before creating new ones',
        )

    def handle(self, *args, **options):
        # Physics lessons data for First Year Baccalaureate - first cycle (lessons 1-14)
        physics_1st_bac_cycle1 = [
            {
                'order': 1,
                'title': 'Work and power of a force',
                'title_arabic': 'شغل وقدرة قوة',
                'title_french': 'Travail et puissance d\'une force',
                'description': 'Study of work done by forces and power concepts in mechanics.',
                'objectives': 'Understand work and power calculations in mechanical systems.',
                'prerequisites': 'Basic knowledge of forces and motion.'
            },
            {
                'order': 2,
                'title': 'Work and kinetic energy',
                'title_arabic': 'الشغل والطاقة الحركية',
                'title_french': 'Travail et énergie cinétique',
                'description': 'Study of the relationship between work and kinetic energy.',
                'objectives': 'Master the work-energy theorem and its applications.',
                'prerequisites': 'Understanding of work and motion concepts.'
            },
            {
                'order': 3,
                'title': 'Work and gravitational potential energy – Mechanical energy',
                'title_arabic': 'الشغل وطاقة الوضع الثقالية – الطاقة الميكانيكية',
                'title_french': 'Travail et énergie potentielle de pesanteur – Énergie mécanique',
                'description': 'Study of gravitational potential energy and mechanical energy conservation.',
                'objectives': 'Understand potential energy and mechanical energy conservation principles.',
                'prerequisites': 'Knowledge of work and kinetic energy.'
            },
            {
                'order': 4,
                'title': 'Work and internal energy',
                'title_arabic': 'الشغل والطاقة الداخلية',
                'title_french': 'Travail et énergie interne',
                'description': 'Study of work and its relationship with internal energy.',
                'objectives': 'Understand the connection between work and internal energy changes.',
                'prerequisites': 'Knowledge of mechanical energy and thermodynamics basics.'
            },
            {
                'order': 5,
                'title': 'Thermal energy and heat transfer',
                'title_arabic': 'الطاقة الحرارية والانتقال الحراري',
                'title_french': 'Énergie thermique et transfert thermique',
                'description': 'Study of thermal energy and heat transfer mechanisms.',
                'objectives': 'Understand thermal energy and heat transfer processes.',
                'prerequisites': 'Basic understanding of energy and temperature concepts.'
            },
            {
                'order': 6,
                'title': 'Mechanical work and energy',
                'title_arabic': 'الشغل الميكانيكي والطاقة',
                'title_french': 'Travail mécanique et énergie',
                'description': 'Comprehensive study of mechanical work and energy relationships.',
                'objectives': 'Master mechanical work and energy principles and applications.',
                'prerequisites': 'Understanding of force, motion, and energy concepts.'
            },
            {
                'order': 7,
                'title': 'Measurement in chemistry',
                'title_arabic': 'القياس في الكيمياء',
                'title_french': 'La mesure en chimie',
                'description': 'Introduction to measurement principles and units in chemistry.',
                'objectives': 'Understand chemical measurement principles and significant figures.',
                'prerequisites': 'Basic mathematics and scientific notation.'
            },
            {
                'order': 8,
                'title': 'Physical quantities related to the amount of substance',
                'title_arabic': 'المقادير الفيزيائية المرتبطة بكمية المادة',
                'title_french': 'Grandeurs physiques liées à la quantité de matière',
                'description': 'Study of mole concept and quantities related to amount of substance.',
                'objectives': 'Master mole calculations and chemical quantity relationships.',
                'prerequisites': 'Knowledge of atomic structure and chemical measurement.'
            },
            {
                'order': 9,
                'title': 'Concentration and electrolytic solutions',
                'title_arabic': 'التركيز والمحاليل الإلكتروليتية',
                'title_french': 'Concentration et solutions électrolytiques',
                'description': 'Study of solution concentration and electrolytic solutions.',
                'objectives': 'Understand concentration calculations and electrolytic solution properties.',
                'prerequisites': 'Knowledge of mole concept and solution chemistry basics.'
            },
            {
                'order': 10,
                'title': 'Tracking the evolution of a chemical transformation',
                'title_arabic': 'تتبع تطور تحول كيميائي',
                'title_french': 'Suivi de l\'évolution d\'une transformation chimique',
                'description': 'Study of chemical reaction progress and monitoring techniques.',
                'objectives': 'Understand how to track and analyze chemical reaction progress.',
                'prerequisites': 'Knowledge of chemical reactions and concentration concepts.'
            },
            {
                'order': 11,
                'title': 'Conductance and conductivity',
                'title_arabic': 'المواصلة والموصلية',
                'title_french': 'Conductance et conductivité',
                'description': 'Study of electrical conductance and conductivity in solutions.',
                'objectives': 'Understand electrical conduction in ionic solutions.',
                'prerequisites': 'Knowledge of electrolytic solutions and electricity basics.'
            },
            {
                'order': 12,
                'title': 'Acid-base reactions',
                'title_arabic': 'تفاعلات حمض – قاعدة',
                'title_french': 'Réactions acido-basiques',
                'description': 'Study of acid-base reactions and pH concepts.',
                'objectives': 'Master acid-base theory and pH calculations.',
                'prerequisites': 'Understanding of chemical reactions and concentration.'
            },
            {
                'order': 13,
                'title': 'Oxidation-reduction (Redox) reactions',
                'title_arabic': 'تفاعلات الأكسدة والاختزال',
                'title_french': 'Réactions d\'oxydo-réduction',
                'description': 'Study of redox reactions and electron transfer processes.',
                'objectives': 'Understand redox reactions and electrochemical principles.',
                'prerequisites': 'Knowledge of chemical reactions and electron structure.'
            },
            {
                'order': 14,
                'title': 'Direct titrations',
                'title_arabic': 'المعايرات المباشرة',
                'title_french': 'Titrages directs',
                'description': 'Study of direct titration methods and analytical techniques.',
                'objectives': 'Master titration techniques and analytical calculations.',
                'prerequisites': 'Understanding of acid-base and redox reactions.'
            }
        ]

        try:
            # Get Physics subject
            physics_subject = Subject.objects.get(code='PHYS101')
            self.stdout.write(f'Found Physics subject: {physics_subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Physics subject not found. Please ensure PHYS101 exists.')
            )
            return

        try:
            # Get First Year Baccalaureate grade (Grade ID 11)
            first_year_bac_grade = Grade.objects.get(id=11)
            self.stdout.write(f'Found grade: {first_year_bac_grade.name}')

        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('First Year Baccalaureate grade (ID: 11) not found. Please create the grade first.')
            )
            return
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error finding grade: {e}')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing first cycle physics lessons for First Year Baccalaureate...')
            deleted_count = Lesson.objects.filter(
                subject=physics_subject,
                grade=first_year_bac_grade,
                cycle='first'
            ).delete()[0]
            self.stdout.write(
                self.style.WARNING(f'Deleted {deleted_count} existing first cycle physics lessons')
            )

        self.stdout.write('Creating first cycle physics lessons for First Year Baccalaureate...')

        created_count = 0
        for lesson_data in physics_1st_bac_cycle1:
            lesson, created = Lesson.objects.get_or_create(
                subject=physics_subject,
                grade=first_year_bac_grade,
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
                f'Successfully created {created_count} new first cycle physics lessons for First Year Baccalaureate. '
                f'Total first cycle physics lessons for {first_year_bac_grade.name}: {Lesson.objects.filter(subject=physics_subject, grade=first_year_bac_grade, cycle="first").count()}'
            )
        )