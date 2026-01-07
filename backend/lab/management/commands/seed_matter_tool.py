from django.core.management.base import BaseCommand
from lab.models import LabToolCategory, LabTool

class Command(BaseCommand):
    help = 'Seeds the database with the Matter & States tool'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding Matter & States tool...')

        # Get Chemistry category (or Physics, but usually Matter is intro Chem/Phys)
        # 1AC PC treats this as "La matière".
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
            'tool_id': 'matter-states',
            'name_ar': 'حالات المادة والخلائط',
            'name_fr': 'États de la Matière et Mélanges',
            'name_en': 'Matter States & Mixtures',
            'description_ar': 'محاكاة الحالات الثلاث للمادة (صلب، سائل، غاز) والتمييز بين الخلائط والأجسام الخالصة.',
            'description_fr': 'Simulateur des trois états (solide, liquide, gaz) et mélanges vs corps purs.',
            'description_en': 'Simulate the three states of matter and explore pure substances vs mixtures.',
            'category': chemistry_category,
            'icon': 'Snowflake',
            'grade_levels': ['1AC'],
            'is_new': True,
            'features': {
                'simulators': [
                    'States of Matter (Solid, Liquid, Gas)',
                    'Phase Changes and Temperature',
                    'Mixtures vs Pure Substances'
                ]
            }
        }

        LabTool.objects.update_or_create(
            tool_id=tool_data['tool_id'],
            defaults=tool_data
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded Matter & States tool'))
