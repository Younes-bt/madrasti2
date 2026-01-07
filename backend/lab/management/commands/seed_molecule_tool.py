from django.core.management.base import BaseCommand
from lab.models import LabToolCategory, LabTool

class Command(BaseCommand):
    help = 'Seeds the database with the Molecule & Bonding tools'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding Molecule & Bonding tools...')

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
            'tool_id': 'molecule-bonding',
            'name_ar': 'أدوات الجزيئات والروابط',
            'name_fr': 'Outils Molécules et Liaisons',
            'name_en': 'Molecule & Bonding Tools',
            'description_ar': 'بناء الجزيئات، رسم تراكيب لويس، واستكشاف الكيمياء العضوية.',
            'description_fr': 'Construction de molécules, structures de Lewis et chimie organique.',
            'description_en': 'Build molecules, draw Lewis structures, and explore organic chemistry.',
            'category': chemistry_category,
            'icon': 'Atom',
            'grade_levels': ['1AC', 'TC', '1BAC', '2BAC'],
            'is_new': True,
            'features': {
                'tools': [
                    'Molecule Builder (2D)',
                    'Lewis Structure Drawer',
                    'Organic Molecule Builder',
                    'Functional Groups Identifier',
                    'Skeletal Formula Converter',
                    'Isomer Generator (Basic)'
                ]
            }
        }

        LabTool.objects.update_or_create(
            tool_id=tool_data['tool_id'],
            defaults=tool_data
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded Molecule & Bonding tools'))
