from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create 16 physics lessons (lessons 2-17) for Second Year Baccalaureate'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing physics lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # Physics lessons data (lessons 2-17)
        physics_lessons = [
            {
                'order': 2,
                'title': 'Periodic progressive mechanical waves',
                'title_arabic': 'الموجات الميكانيكية المتوالية الدورية',
                'title_french': 'Ondes mécaniques progressives périodiques',
                'description': 'Study of periodic progressive mechanical waves and their properties.',
                'objectives': 'Understand the characteristics and properties of periodic progressive mechanical waves.',
                'prerequisites': 'Basic understanding of mechanical waves and periodic motion.'
            },
            {
                'order': 3,
                'title': 'Propagation of a light wave',
                'title_arabic': 'انتشار موجة ضوئية',
                'title_french': 'Propagation d\'une onde lumineuse',
                'description': 'Study of light wave propagation and its characteristics.',
                'objectives': 'Understand how light waves propagate through different media.',
                'prerequisites': 'Basic knowledge of wave properties and electromagnetic theory.'
            },
            {
                'order': 4,
                'title': 'Diffraction of light by a grating',
                'title_arabic': 'حيود الضوء بواسطة شبكة',
                'title_french': 'Diffraction de la lumière par un réseau',
                'description': 'Study of light diffraction through diffraction gratings.',
                'objectives': 'Understand the principles of light diffraction and interference patterns.',
                'prerequisites': 'Understanding of light waves and wave interference.'
            },
            {
                'order': 5,
                'title': 'Nuclear transformations',
                'title_arabic': 'التحولات النووية',
                'title_french': 'Transformations nucléaires',
                'description': 'Study of nuclear transformations and radioactive processes.',
                'objectives': 'Understand different types of nuclear transformations and their applications.',
                'prerequisites': 'Basic atomic structure and nuclear physics concepts.'
            },
            {
                'order': 6,
                'title': 'Radioactive decay',
                'title_arabic': 'التناقص الإشعاعي',
                'title_french': 'Décroissance radioactive',
                'description': 'Study of radioactive decay processes and decay laws.',
                'objectives': 'Understand radioactive decay mechanisms and calculate decay rates.',
                'prerequisites': 'Knowledge of nuclear transformations and exponential functions.'
            },
            {
                'order': 7,
                'title': 'The Nucleus – Mass and energy',
                'title_arabic': 'النوى – الكتلة والطاقة',
                'title_french': 'Le noyau – Masse et énergie',
                'description': 'Study of nuclear mass, binding energy, and mass-energy equivalence.',
                'objectives': 'Understand the relationship between nuclear mass and energy.',
                'prerequisites': 'Basic understanding of atomic structure and Einstein\'s mass-energy relation.'
            },
            {
                'order': 8,
                'title': 'RC Dipole / RC Circuit',
                'title_arabic': 'ثنائي القطب RC',
                'title_french': 'Dipôle RC',
                'description': 'Study of RC circuits and their electrical characteristics.',
                'objectives': 'Understand the behavior of resistor-capacitor circuits in DC and AC conditions.',
                'prerequisites': 'Basic knowledge of electrical circuits, resistance, and capacitance.'
            },
            {
                'order': 9,
                'title': 'RL Dipole / RL Circuit',
                'title_arabic': 'ثنائي القطب RL',
                'title_french': 'Dipôle RL',
                'description': 'Study of RL circuits and their electrical characteristics.',
                'objectives': 'Understand the behavior of resistor-inductor circuits in DC and AC conditions.',
                'prerequisites': 'Basic knowledge of electrical circuits, resistance, and inductance.'
            },
            {
                'order': 10,
                'title': 'Series RLC circuit',
                'title_arabic': 'الدارة الكهربائية RLC المتوالية',
                'title_french': 'Circuit RLC série',
                'description': 'Study of series RLC circuits and their resonance properties.',
                'objectives': 'Understand the behavior of series RLC circuits and resonance phenomena.',
                'prerequisites': 'Knowledge of RC and RL circuits, and AC circuit analysis.'
            },
            {
                'order': 11,
                'title': 'Free oscillations in a series RLC circuit',
                'title_arabic': 'التذبذبات الحرة في دارة RLC متوالية',
                'title_french': 'Oscillations libres dans un circuit RLC série',
                'description': 'Study of free oscillations in RLC circuits.',
                'objectives': 'Understand free oscillations, damping, and energy transfer in RLC circuits.',
                'prerequisites': 'Knowledge of series RLC circuits and differential equations.'
            },
            {
                'order': 12,
                'title': 'Forced oscillations in a series RLC circuit (Mathematical Sciences track)',
                'title_arabic': 'التذبذبات القسرية في دارة RLC متوالية (علوم رياضية)',
                'title_french': 'Oscillations forcées dans un circuit RLC série (Sciences Mathématiques)',
                'description': 'Study of forced oscillations in RLC circuits for Mathematical Sciences track.',
                'objectives': 'Understand forced oscillations, resonance, and impedance in RLC circuits.',
                'prerequisites': 'Knowledge of free oscillations in RLC circuits and complex analysis.'
            },
            {
                'order': 13,
                'title': 'Fast and slow chemical transformations',
                'title_arabic': 'التحولات السريعة والتحولات البطيئة',
                'title_french': 'Transformations rapides et transformations lentes',
                'description': 'Study of chemical reaction kinetics and factors affecting reaction rates.',
                'objectives': 'Understand the factors that determine the speed of chemical reactions.',
                'prerequisites': 'Basic chemistry knowledge and understanding of chemical reactions.'
            },
            {
                'order': 14,
                'title': 'Time tracking of a transformation – Reaction rate',
                'title_arabic': 'التتبع الزمني للتحول – سرعة التفاعل',
                'title_french': 'Suivi temporel d\'une transformation – Vitesse de réaction',
                'description': 'Study of reaction rate measurement and kinetic analysis.',
                'objectives': 'Learn to measure and calculate reaction rates and analyze kinetic data.',
                'prerequisites': 'Understanding of chemical transformations and basic calculus.'
            },
            {
                'order': 15,
                'title': 'Reversible chemical reactions (Chemical transformations that occur in both directions)',
                'title_arabic': 'التحولات الكيميائية التي تحدث في منحيين',
                'title_french': 'Transformations chimiques qui se produisent dans les deux sens',
                'description': 'Study of reversible chemical reactions and dynamic equilibrium.',
                'objectives': 'Understand reversible reactions and the concept of chemical equilibrium.',
                'prerequisites': 'Knowledge of chemical reactions and reaction kinetics.'
            },
            {
                'order': 16,
                'title': 'Equilibrium state of a chemical system',
                'title_arabic': 'حالة توازن مجموعة كيميائية',
                'title_french': 'État d\'équilibre d\'un système chimique',
                'description': 'Study of chemical equilibrium and Le Chatelier\'s principle.',
                'objectives': 'Understand chemical equilibrium, equilibrium constants, and factors affecting equilibrium.',
                'prerequisites': 'Understanding of reversible reactions and chemical kinetics.'
            },
            {
                'order': 17,
                'title': 'Chemical transformations associated with acid-base reactions',
                'title_arabic': 'التحولات الكيميائية المقرونة بالتفاعلات حمض قاعدة',
                'title_french': 'Transformations chimiques associées aux réactions acido-basiques',
                'description': 'Study of acid-base reactions and their equilibrium properties.',
                'objectives': 'Understand acid-base equilibrium and pH calculations.',
                'prerequisites': 'Knowledge of chemical equilibrium and basic acid-base concepts.'
            }
        ]

        try:
            # Get Physics subject
            physics_subject = Subject.objects.get(code='PHYS101')
            self.stdout.write(f'Found Physics subject: {physics_subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Physics subject not found. Please run populate_moroccan_subjects command first.')
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
            self.stdout.write('Deleting existing physics lessons...')
            deleted_count = Lesson.objects.filter(
                subject=physics_subject,
                grade=second_year_bac_grade
            ).delete()[0]
            self.stdout.write(
                self.style.WARNING(f'Deleted {deleted_count} existing physics lessons')
            )

        self.stdout.write('Creating physics lessons...')

        created_count = 0
        for lesson_data in physics_lessons:
            lesson, created = Lesson.objects.get_or_create(
                subject=physics_subject,
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
                f'Successfully created {created_count} new physics lessons. '
                f'Total physics lessons for {second_year_bac_grade.name}: {Lesson.objects.filter(subject=physics_subject, grade=second_year_bac_grade).count()}'
            )
        )