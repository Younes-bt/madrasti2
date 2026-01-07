from django.core.management.base import BaseCommand
from lab.models import LabToolCategory, LabTool

class Command(BaseCommand):
    help = 'Seeds the database with the Chemical Equations tool'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding Chemical Equations tool...')

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
            'tool_id': 'chemical-equations',
            'name_ar': 'المعادلات الكيميائية',
            'name_fr': 'Équations Chimiques',
            'name_en': 'Chemical Equations',
            'description_ar': 'موازنة المعادلات، حسابات كمية المادة، وتفاعل كيميائي.',
            'description_fr': 'Équilibrage d\'équations, stœchiométrie et réactif limitant.',
            'description_en': 'Balance equations, stoichiometry, and limiting reagent calculations.',
            'category': chemistry_category,
            'icon': 'Scale', 
            'grade_levels': ['3AC', 'TC', '1BAC', '2BAC'],
            'is_new': True,
            'features': {
                'calculators': [
                    'Chemical Equation Balancer',
                    'Stoichiometry Calculator (Mass, Moles, Volume)',
                    'Limiting Reagent Calculator',
                    'Theoretical Yield Calculator'
                ]
            }
        }

        LabTool.objects.update_or_create(
            tool_id=tool_data['tool_id'],
            defaults=tool_data
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded Chemical Equations tool'))
