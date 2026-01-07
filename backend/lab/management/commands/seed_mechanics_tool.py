from django.core.management.base import BaseCommand
from lab.models import LabToolCategory, LabTool

class Command(BaseCommand):
    help = 'Seeds the database with the Mechanics Toolkit'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding Mechanics Toolkit...')

        # Get Physics category
        physics_category, _ = LabToolCategory.objects.get_or_create(
            name='physics',
            defaults={
                'name_ar': 'الفيزياء',
                'name_fr': 'Physique',
                'name_en': 'Physics',
                'icon': 'Atom', 
                'color': '#3b82f6', # Blue
                'order': 2,
                'is_active': True
            }
        )

        tool_data = {
            'tool_id': 'mechanics-toolkit',
            'name_ar': 'ميكانيك نيوتن',
            'name_fr': 'Mécanique de Newton',
            'name_en': 'Newtonian Mechanics',
            'description_ar': 'دراسة الحركة (السينماتيك)، القوى (الديناميك)، والطاقة الميكانيكية.',
            'description_fr': 'Étude du mouvement (cinématique), des forces (dynamique) et de l\'énergie.',
            'description_en': 'Study of motion (kinematics), forces (dynamics), and energy conservation.',
            'category': physics_category,
            'icon': 'Rocket',
            'grade_levels': ['3AC', '1BAC', '2BAC'],
            'is_new': True,
            'features': {
                'simulators': [
                    'Projectile Motion (2D)',
                    'Free Fall Visualizer',
                    'Forces & Equilibrium',
                    'Energy Conservation Track'
                ],
                'calculators': [
                    'Average Speed & Velocity',
                    'Newton\'s Second Law (F=ma)',
                    'Work & Power',
                    'Kinetic & Potential Energy'
                ]
            }
        }

        LabTool.objects.update_or_create(
            tool_id=tool_data['tool_id'],
            defaults=tool_data
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded Mechanics Toolkit'))
