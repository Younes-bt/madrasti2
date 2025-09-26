from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create 17 physics lessons (lessons 15-31) for First Year Baccalaureate - Second Cycle'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing second cycle physics lessons for First Year Baccalaureate before creating new ones',
        )

    def handle(self, *args, **options):
        # Physics lessons data for First Year Baccalaureate - second cycle (lessons 15-31)
        physics_1st_bac_cycle2 = [
            {
                'order': 15,
                'title': 'Mechanical work and energy',
                'title_arabic': 'الشغل الميكانيكي والطاقة',
                'title_french': 'Travail mécanique et énergie',
                'description': 'Advanced study of mechanical work and energy applications.',
                'objectives': 'Apply mechanical work and energy principles to complex problems.',
                'prerequisites': 'Understanding of basic mechanical work and energy concepts.'
            },
            {
                'order': 16,
                'title': 'Quantities related to the amount of substance',
                'title_arabic': 'المقادير المرتبطة بكمية المادة',
                'title_french': 'Grandeurs liées à la quantité de matière',
                'description': 'Advanced study of chemical quantities and stoichiometry.',
                'objectives': 'Master advanced calculations involving chemical quantities.',
                'prerequisites': 'Knowledge of basic mole concept and chemical quantities.'
            },
            {
                'order': 17,
                'title': 'Electrostatic potential energy',
                'title_arabic': 'طاقة الوضع الكهرساكنة',
                'title_french': 'Énergie potentielle électrostatique',
                'description': 'Study of electrostatic potential energy and electric fields.',
                'objectives': 'Understand electrostatic energy and field relationships.',
                'prerequisites': 'Knowledge of electric charge and force concepts.'
            },
            {
                'order': 18,
                'title': 'Magnetic field',
                'title_arabic': 'المجال المغناطيسي',
                'title_french': 'Champ magnétique',
                'description': 'Introduction to magnetic fields and their properties.',
                'objectives': 'Understand magnetic field concepts and field lines.',
                'prerequisites': 'Basic understanding of magnetism and field concepts.'
            },
            {
                'order': 19,
                'title': 'Magnetism',
                'title_arabic': 'المغناطيسية',
                'title_french': 'Magnétisme',
                'description': 'Comprehensive study of magnetism and magnetic materials.',
                'objectives': 'Master magnetic properties and magnetic material behavior.',
                'prerequisites': 'Understanding of magnetic fields and basic magnetism.'
            },
            {
                'order': 20,
                'title': 'Functional groups in organic chemistry',
                'title_arabic': 'المجموعات المميزة في الكيمياء العضوية',
                'title_french': 'Groupes caractéristiques en chimie organique',
                'description': 'Study of functional groups and their properties in organic chemistry.',
                'objectives': 'Identify and understand properties of organic functional groups.',
                'prerequisites': 'Basic knowledge of organic chemistry and molecular structure.'
            },
            {
                'order': 21,
                'title': 'Energy transfer in an electric circuit',
                'title_arabic': 'انتقال الطاقة في دارة كهربائية',
                'title_french': 'Transfert d\'énergie dans un circuit électrique',
                'description': 'Study of energy transfer and power in electrical circuits.',
                'objectives': 'Understand energy and power relationships in electrical circuits.',
                'prerequisites': 'Knowledge of electrical circuits and Ohm\'s law.'
            },
            {
                'order': 22,
                'title': 'General behavior of an electric circuit',
                'title_arabic': 'التصرف العام لدارة كهربائية',
                'title_french': 'Comportement global d\'un circuit électrique',
                'description': 'Study of overall electrical circuit behavior and analysis.',
                'objectives': 'Analyze complex electrical circuit behavior and characteristics.',
                'prerequisites': 'Understanding of basic electrical circuits and components.'
            },
            {
                'order': 23,
                'title': 'Magnetic field created by an electric current',
                'title_arabic': 'المجال المغناطيسي المحدث لتيار كهربائي',
                'title_french': 'Champ magnétique créé par un courant électrique',
                'description': 'Study of magnetic fields produced by electric currents.',
                'objectives': 'Understand the relationship between electric current and magnetic fields.',
                'prerequisites': 'Knowledge of electric current and magnetic field concepts.'
            },
            {
                'order': 24,
                'title': 'Electromagnetic force – Laplace\'s law',
                'title_arabic': 'القوى الكهرمغناطيسية قانون لابلاص',
                'title_french': 'Force électromagnétique – Loi de Laplace',
                'description': 'Study of electromagnetic forces and Laplace\'s law.',
                'objectives': 'Understand electromagnetic force calculations using Laplace\'s law.',
                'prerequisites': 'Knowledge of magnetic fields and electric current.'
            },
            {
                'order': 25,
                'title': 'Visibility of an object',
                'title_arabic': 'قابلية رؤية شيء',
                'title_french': 'Visibilité d\'un objet',
                'description': 'Study of light and visibility conditions for objects.',
                'objectives': 'Understand the conditions required for object visibility.',
                'prerequisites': 'Basic understanding of light and optics.'
            },
            {
                'order': 26,
                'title': 'Images obtained by a plane mirror',
                'title_arabic': 'الصور المحصل عليها بواسطة مرآة مستوية',
                'title_french': 'Images obtenues par un miroir plan',
                'description': 'Study of image formation by plane mirrors.',
                'objectives': 'Understand image formation principles with plane mirrors.',
                'prerequisites': 'Knowledge of light reflection and basic optics.'
            },
            {
                'order': 27,
                'title': 'Images obtained by a thin converging lens',
                'title_arabic': 'الصور المحصل عليها بواسطة عدسة رقيقة مجمعة',
                'title_french': 'Images obtenues par une lentille mince convergente',
                'description': 'Study of image formation by thin converging lenses.',
                'objectives': 'Master lens image formation and lens equation applications.',
                'prerequisites': 'Understanding of light refraction and lens properties.'
            },
            {
                'order': 28,
                'title': 'Some optical instruments',
                'title_arabic': 'بعض الأجهزة البصرية',
                'title_french': 'Quelques instruments d\'optique',
                'description': 'Study of various optical instruments and their applications.',
                'objectives': 'Understand the principles and applications of optical instruments.',
                'prerequisites': 'Knowledge of mirrors, lenses, and image formation.'
            },
            {
                'order': 29,
                'title': 'Expansion of organic chemistry',
                'title_arabic': 'توسع الكيمياء العضوية',
                'title_french': 'Extension de la chimie organique',
                'description': 'Advanced topics in organic chemistry and its applications.',
                'objectives': 'Explore advanced organic chemistry concepts and applications.',
                'prerequisites': 'Understanding of basic organic chemistry and functional groups.'
            },
            {
                'order': 30,
                'title': 'Organic molecules and carbon skeletons',
                'title_arabic': 'الجزيئات العضوية والهياكل الكربونية',
                'title_french': 'Molécules organiques et squelettes carbonés',
                'description': 'Study of organic molecular structures and carbon frameworks.',
                'objectives': 'Understand organic molecular structure and carbon skeleton variations.',
                'prerequisites': 'Knowledge of organic chemistry and molecular structure.'
            },
            {
                'order': 31,
                'title': 'Modification of the carbon skeleton',
                'title_arabic': 'تغيير الهيكل الكربوني',
                'title_french': 'Modification du squelette carboné',
                'description': 'Study of carbon skeleton modifications in organic reactions.',
                'objectives': 'Understand how carbon skeletons can be modified in organic reactions.',
                'prerequisites': 'Knowledge of organic molecules and reaction mechanisms.'
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
            self.stdout.write('Deleting existing second cycle physics lessons for First Year Baccalaureate...')
            deleted_count = Lesson.objects.filter(
                subject=physics_subject,
                grade=first_year_bac_grade,
                cycle='second'
            ).delete()[0]
            self.stdout.write(
                self.style.WARNING(f'Deleted {deleted_count} existing second cycle physics lessons')
            )

        self.stdout.write('Creating second cycle physics lessons for First Year Baccalaureate...')

        created_count = 0
        for lesson_data in physics_1st_bac_cycle2:
            lesson, created = Lesson.objects.get_or_create(
                subject=physics_subject,
                grade=first_year_bac_grade,
                cycle='second',  # Second Cycle as specified
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
                f'Successfully created {created_count} new second cycle physics lessons for First Year Baccalaureate. '
                f'Total second cycle physics lessons for {first_year_bac_grade.name}: {Lesson.objects.filter(subject=physics_subject, grade=first_year_bac_grade, cycle="second").count()}'
            )
        )