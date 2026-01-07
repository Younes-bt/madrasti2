from django.core.management.base import BaseCommand
from lab.models import LabToolCategory, LabTool

class Command(BaseCommand):
    help = 'Seeds the database with the Acid-Base & Redox tool'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding Acid-Base & Redox tool...')

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
            'tool_id': 'acid-base-redox',
            'name_ar': 'الأحماض والقواعد والأكسدة والاختزال',
            'name_fr': 'Acides, Bases et Oxydo-réduction',
            'name_en': 'Acid-Base & Redox',
            'description_ar': 'محاكاة المعايرة، خلايا كهروكيميائية، وتفاعلات الأكسدة والاختزال.',
            'description_fr': 'Titrage acido-basique, piles électrochimiques et redox.',
            'description_en': 'Titration simulation, electrochemical cells, and redox reactions.',
            'category': chemistry_category,
            'icon': 'Zap',  # Or something related to battery/titration
            'grade_levels': ['3AC', '1BAC', '2BAC'],
            'is_new': True,
            'features': {
                'simulators': [
                    'Acid-Base Titration Simulator',
                    'Electrochemical Cell Builder'
                ],
                'visualizers': [
                    'pH Scale',
                    'Standard Electrode Potentials Table',
                    'Redox Half-Reactions'
                ]
            }
        }

        LabTool.objects.update_or_create(
            tool_id=tool_data['tool_id'],
            defaults=tool_data
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded Acid-Base & Redox tool'))
