from django.core.management.base import BaseCommand
from lab.models import LabToolCategory, LabTool


class Command(BaseCommand):
    help = 'Seeds the database with Oscillations & Waves physics tools'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding Oscillations & Waves tools...')

        # Get Physics category
        physics_category, _ = LabToolCategory.objects.get_or_create(
            name='physics',
            defaults={
                'name_ar': 'الفيزياء',
                'name_fr': 'Physique',
                'name_en': 'Physics',
                'icon': 'Atom',
                'color': '#8b5cf6',  # Purple
                'order': 3,
                'is_active': True
            }
        )

        tools = [
            # Simple Harmonic Motion Simulator
            {
                'tool_id': 'shm-simulator',
                'name_ar': 'محاكي الحركة التوافقية البسيطة',
                'name_fr': 'Simulateur de mouvement harmonique simple',
                'name_en': 'Simple Harmonic Motion (SHM) Simulator',
                'description_ar': 'محاكاة المجموعات المتذبذبة: نظام كتلة-نابض، البندول البسيط، والبندول الفيزيائي',
                'description_fr': 'Simulation des systèmes oscillants: système masse-ressort, pendule simple et pendule physique',
                'description_en': 'Simulate oscillating systems: mass-spring, simple pendulum, and physical pendulum',
                'category': physics_category,
                'icon': 'Activity',
                'grade_levels': ['2BAC'],
                'is_new': True
            },
            # Damped Oscillations
            {
                'tool_id': 'damped-oscillations',
                'name_ar': 'التذبذبات المخمدة',
                'name_fr': 'Oscillations amorties',
                'name_en': 'Damped Oscillations',
                'description_ar': 'دراسة التذبذبات المخمدة ومعامل التخميد وتأثيره على الحركة',
                'description_fr': 'Étude des oscillations amorties et du coefficient d\'amortissement',
                'description_en': 'Study damped oscillations and damping coefficient effects',
                'category': physics_category,
                'icon': 'TrendingDown',
                'grade_levels': ['2BAC'],
                'is_new': True
            },
            # Mechanical Wave Simulator
            {
                'tool_id': 'mechanical-waves',
                'name_ar': 'محاكي الموجات الميكانيكية',
                'name_fr': 'Simulateur d\'ondes mécaniques',
                'name_en': 'Mechanical Wave Simulator',
                'description_ar': 'محاكاة الموجات الميكانيكية: الموجات التقدمية والدورية، السرعة، التردد، وطول الموجة',
                'description_fr': 'Simulation des ondes mécaniques: ondes progressives, périodiques, vitesse, fréquence et longueur d\'onde',
                'description_en': 'Simulate mechanical waves: progressive and periodic waves, speed, frequency, and wavelength',
                'category': physics_category,
                'icon': 'Waves',
                'grade_levels': ['2BAC'],
                'is_new': True
            },
            # Sound Waves
            {
                'tool_id': 'sound-waves',
                'name_ar': 'الموجات الصوتية',
                'name_fr': 'Ondes sonores',
                'name_en': 'Sound Waves',
                'description_ar': 'استكشاف خصائص الموجات الصوتية، التردد، الشدة، والصدى',
                'description_fr': 'Explorer les propriétés des ondes sonores, fréquence, intensité et écho',
                'description_en': 'Explore sound wave properties, frequency, intensity, and echo',
                'category': physics_category,
                'icon': 'Radio',
                'grade_levels': ['2BAC'],
                'is_new': True
            },
        ]

        created_count = 0
        updated_count = 0

        for tool_data in tools:
            tool, created = LabTool.objects.update_or_create(
                tool_id=tool_data['tool_id'],
                defaults=tool_data
            )
            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully processed {len(tools)} Oscillations & Waves tools '
                f'({created_count} created, {updated_count} updated)'
            )
        )
