from django.core.management.base import BaseCommand
from lab.models import LabToolCategory, LabTool

class Command(BaseCommand):
    help = 'Seeds the database with the Reaction Kinetics tool'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding Reaction Kinetics tool...')

        # Get Chemistry category
        chemistry_category, _ = LabToolCategory.objects.get_or_create(
            name='chemistry',
            defaults={
                'name_ar': 'الكيمياء',
                'name_fr': 'Chimie',
                'name_en': 'Chemistry',
                'icon': 'FlaskConical',
                'color': '#10b981',
                'order': 3,
                'is_active': True
            }
        )

        tool_data = {
            'tool_id': 'reaction-kinetics',
            'name_ar': 'الحركية الكيميائية والتناقص الإشعاعي',
            'name_fr': 'Cinétique Chimique et Décroissance Radioactive',
            'name_en': 'Reaction Kinetics & Decay',
            'description_ar': 'دراسة سرعة التفاعل، رتب التفاعل، والتناقص الإشعاعي (نصف العمر).',
            'description_fr': 'Étude de la vitesse de réaction, ordres de réaction et décroissance radioactive.',
            'description_en': 'Study reaction rates, reaction orders, and radioactive decay (half-life).',
            'category': chemistry_category,
            'icon': 'Timer',
            'grade_levels': ['2BAC'],
            'is_new': True,
            'features': {
                'calculators': [
                    'Reaction Rate Calculator',
                    'Half-life Calculator (Radioactive Decay)',
                    'Concentration Time Grapher'
                ]
            }
        }

        LabTool.objects.update_or_create(
            tool_id=tool_data['tool_id'],
            defaults=tool_data
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded Reaction Kinetics tool'))
