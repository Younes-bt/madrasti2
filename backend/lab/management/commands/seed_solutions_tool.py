from django.core.management.base import BaseCommand
from lab.models import LabToolCategory, LabTool

class Command(BaseCommand):
    help = 'Seeds the database with the Solutions & Concentrations tool'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding Solutions & Concentrations tool...')

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
            'tool_id': 'solutions-concentrations',
            'name_ar': 'المحاليل والتركيزات',
            'name_fr': 'Solutions et Concentrations',
            'name_en': 'Solutions & Concentrations',
            'description_ar': 'حسابات المولارية، التخفيف، pH، والموصلية.',
            'description_fr': 'Calculs de molarité, dilution, pH et conductivité.',
            'description_en': 'Molarity, dilution, pH, and conductivity calculations.',
            'category': chemistry_category,
            'icon': 'Beaker',
            'grade_levels': ['3AC', '1BAC', '2BAC'],
            'is_new': True,
            'features': {
                'calculators': [
                    'Molarity Calculator',
                    'Dilution Calculator (C₁V₁ = C₂V₂)',
                    'pH Calculator',
                    'Conductivity Calculator'
                ]
            }
        }

        LabTool.objects.update_or_create(
            tool_id=tool_data['tool_id'],
            defaults=tool_data
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded Solutions & Concentrations tool'))
