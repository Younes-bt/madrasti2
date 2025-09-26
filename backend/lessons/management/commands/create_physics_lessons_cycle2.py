from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create 18 physics lessons (lessons 18-35) for Second Year Baccalaureate - Second Cycle'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing second cycle physics lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # Physics lessons data for second cycle (lessons 18-35)
        physics_lessons_cycle2 = [
            {
                'order': 18,
                'title': 'Electromagnetic waves – Transmission of information',
                'title_arabic': 'الموجات الكهرومغناطيسية – نقل المعلومات',
                'title_french': 'Ondes électromagnétiques – Transmission d\'informations',
                'description': 'Study of electromagnetic waves and their role in information transmission.',
                'objectives': 'Understand electromagnetic wave properties and their applications in communication.',
                'prerequisites': 'Knowledge of wave properties and electromagnetic theory.'
            },
            {
                'order': 19,
                'title': 'Amplitude modulation',
                'title_arabic': 'تضمين الوسع',
                'title_french': 'Modulation d\'amplitude',
                'description': 'Study of amplitude modulation techniques in signal transmission.',
                'objectives': 'Understand amplitude modulation principles and applications.',
                'prerequisites': 'Knowledge of electromagnetic waves and signal processing basics.'
            },
            {
                'order': 20,
                'title': 'Newton\'s laws',
                'title_arabic': 'قوانين نيوتن',
                'title_french': 'Lois de Newton',
                'description': 'Study of Newton\'s three fundamental laws of motion.',
                'objectives': 'Understand and apply Newton\'s laws to analyze mechanical systems.',
                'prerequisites': 'Basic understanding of force, mass, and acceleration concepts.'
            },
            {
                'order': 21,
                'title': 'Applications of Newton\'s laws',
                'title_arabic': 'تطبيقات قوانين نيوتن',
                'title_french': 'Applications des lois de Newton',
                'description': 'Practical applications of Newton\'s laws in various mechanical scenarios.',
                'objectives': 'Apply Newton\'s laws to solve complex mechanical problems.',
                'prerequisites': 'Thorough understanding of Newton\'s three laws of motion.'
            },
            {
                'order': 22,
                'title': 'Vertical fall of a solid body',
                'title_arabic': 'السقوط الرأسي لجسم صلب',
                'title_french': 'Chute verticale d\'un corps solide',
                'description': 'Study of free fall motion and gravitational effects on solid bodies.',
                'objectives': 'Analyze vertical motion under the influence of gravity.',
                'prerequisites': 'Knowledge of kinematics and Newton\'s laws.'
            },
            {
                'order': 23,
                'title': 'Planar motion (Motion in a plane)',
                'title_arabic': 'الحركات المستوية',
                'title_french': 'Mouvements plans',
                'description': 'Study of motion in two-dimensional space and projectile motion.',
                'objectives': 'Understand and analyze two-dimensional motion scenarios.',
                'prerequisites': 'Knowledge of vector analysis and kinematics.'
            },
            {
                'order': 24,
                'title': 'Motion of a charged particle in a uniform magnetic field',
                'title_arabic': 'حركة دقيقة مشحونة في مجال مغناطيسي منتظم',
                'title_french': 'Mouvement d\'une particule chargée dans un champ magnétique uniforme',
                'description': 'Study of charged particle motion in magnetic fields.',
                'objectives': 'Understand the behavior of charged particles in magnetic fields.',
                'prerequisites': 'Knowledge of electromagnetic fields and particle physics basics.'
            },
            {
                'order': 25,
                'title': 'Motion of a charged particle in a uniform electrostatic field',
                'title_arabic': 'حركة دقيقة مشحونة في مجال كهرساكن منتظم',
                'title_french': 'Mouvement d\'une particule chargée dans un champ électrostatique uniforme',
                'description': 'Study of charged particle motion in electrostatic fields.',
                'objectives': 'Understand the behavior of charged particles in electric fields.',
                'prerequisites': 'Knowledge of electrostatics and particle dynamics.'
            },
            {
                'order': 26,
                'title': 'Satellites and planets',
                'title_arabic': 'الأقمار الصناعية والكواكب',
                'title_french': 'Satellites et planètes',
                'description': 'Study of orbital mechanics, satellite motion, and planetary systems.',
                'objectives': 'Understand orbital mechanics and gravitational interactions.',
                'prerequisites': 'Knowledge of gravity, circular motion, and Newton\'s laws.'
            },
            {
                'order': 27,
                'title': 'Rotational motion of a solid body around a fixed axis',
                'title_arabic': 'حركة دوران جسم صلب حول محور ثابت',
                'title_french': 'Mouvement de rotation d\'un corps solide autour d\'un axe fixe',
                'description': 'Study of rotational dynamics and angular motion of rigid bodies.',
                'objectives': 'Understand rotational motion, torque, and angular momentum.',
                'prerequisites': 'Knowledge of linear motion and moment of inertia concepts.'
            },
            {
                'order': 28,
                'title': 'Oscillating mechanical systems',
                'title_arabic': 'المجموعات الميكانيكية المتذبذبة',
                'title_french': 'Systèmes mécaniques oscillants',
                'description': 'Study of mechanical oscillations and harmonic motion.',
                'objectives': 'Understand oscillatory motion and harmonic analysis.',
                'prerequisites': 'Knowledge of periodic motion and differential equations.'
            },
            {
                'order': 29,
                'title': 'Energy aspects of mechanical oscillations',
                'title_arabic': 'المظاهر الطاقية للتذبذبات الميكانيكية',
                'title_french': 'Aspects énergétiques des oscillations mécaniques',
                'description': 'Study of energy conservation and transfer in oscillating systems.',
                'objectives': 'Understand energy transformations in oscillatory motion.',
                'prerequisites': 'Knowledge of mechanical oscillations and energy conservation.'
            },
            {
                'order': 30,
                'title': 'The atom and Newtonian mechanics',
                'title_arabic': 'الذرة وميكانيك نيوتن',
                'title_french': 'L\'atome et la mécanique de Newton',
                'description': 'Study of atomic structure and the limitations of classical mechanics.',
                'objectives': 'Understand the transition from classical to quantum mechanics.',
                'prerequisites': 'Knowledge of atomic structure and classical mechanics.'
            },
            {
                'order': 31,
                'title': 'Spontaneous evolution of a chemical system',
                'title_arabic': 'التطور التلقائي لمجموعة كيميائية',
                'title_french': 'Évolution spontanée d\'un système chimique',
                'description': 'Study of spontaneous chemical reactions and thermodynamic principles.',
                'objectives': 'Understand spontaneous processes and chemical equilibrium.',
                'prerequisites': 'Knowledge of chemical thermodynamics and reaction kinetics.'
            },
            {
                'order': 32,
                'title': 'Spontaneous transformations in galvanic cells and energy production',
                'title_arabic': 'التحولات التلقائية في الأعمدة وتحصيل الطاقة',
                'title_french': 'Transformations spontanées dans les piles et récupération de l\'énergie',
                'description': 'Study of electrochemical cells and energy generation.',
                'objectives': 'Understand galvanic cells and electrochemical energy production.',
                'prerequisites': 'Knowledge of electrochemistry and redox reactions.'
            },
            {
                'order': 33,
                'title': 'Forced transformations – Electrolysis',
                'title_arabic': 'التحولات القسرية – التحليل الكهربائي',
                'title_french': 'Transformations forcées – L\'électrolyse',
                'description': 'Study of electrolysis and forced electrochemical reactions.',
                'objectives': 'Understand electrolytic processes and their applications.',
                'prerequisites': 'Knowledge of electrochemical cells and ionic solutions.'
            },
            {
                'order': 34,
                'title': 'Esterification and hydrolysis reactions',
                'title_arabic': 'تفاعلات الأسترة والحلمأة',
                'title_french': 'Réactions d\'estérification et d\'hydrolyse',
                'description': 'Study of esterification and hydrolysis reactions in organic chemistry.',
                'objectives': 'Understand ester formation and breakdown mechanisms.',
                'prerequisites': 'Knowledge of organic chemistry and functional groups.'
            },
            {
                'order': 35,
                'title': 'Controlling the evolution of chemical systems',
                'title_arabic': 'التحكم في تطور المجموعات الكيميائية',
                'title_french': 'Contrôle de l\'évolution des systèmes chimiques',
                'description': 'Study of methods to control and optimize chemical reactions.',
                'objectives': 'Understand how to manipulate reaction conditions and outcomes.',
                'prerequisites': 'Knowledge of chemical kinetics, equilibrium, and thermodynamics.'
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
            self.stdout.write('Deleting existing second cycle physics lessons...')
            deleted_count = Lesson.objects.filter(
                subject=physics_subject,
                grade=second_year_bac_grade,
                cycle='second'
            ).delete()[0]
            self.stdout.write(
                self.style.WARNING(f'Deleted {deleted_count} existing second cycle physics lessons')
            )

        self.stdout.write('Creating second cycle physics lessons...')

        created_count = 0
        for lesson_data in physics_lessons_cycle2:
            lesson, created = Lesson.objects.get_or_create(
                subject=physics_subject,
                grade=second_year_bac_grade,
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
                f'Successfully created {created_count} new second cycle physics lessons. '
                f'Total second cycle physics lessons for {second_year_bac_grade.name}: {Lesson.objects.filter(subject=physics_subject, grade=second_year_bac_grade, cycle="second").count()}'
            )
        )