from django.core.management.base import BaseCommand
from lab.models import LabToolCategory, LabTool

class Command(BaseCommand):
    help = 'Seeds the database with the Geometry Toolkit'

    def handle(self, *args, **kwargs):
        # Ensure category exists
        math_category, _ = LabToolCategory.objects.get_or_create(name='math')
        
        tool, created = LabTool.objects.get_or_create(
            tool_id='geometry-toolkit',
            defaults={
                'name_ar': 'أدوات الهندسة',
                'name_fr': 'Boîte à outils de géométrie',
                'name_en': 'Geometry Toolkit',
                'description_ar': 'مجموعة أدوات شاملة لحسابات الهندسة المستوية والمتجهات والحساب المثلثي',
                'description_fr': 'Boîte à outils complète pour la géométrie plane, les vecteurs et la trigonométrie',
                'description_en': 'Comprehensive toolkit for plane geometry, vectors, and trigonometry',
                'category': math_category,
                'icon': 'Triangle',
                'grade_levels': ['1AC', '2AC', '3AC', 'TC', '1BAC', '2BAC'],
                'features': {
                    'calculators': [
                        'perimeter_area', 
                        'pythagorean', 
                        'trigonometry', 
                        'vectors', 
                        'coordinate_geometry'
                    ],
                    'visualizers': ['rotation', 'symmetry']
                },
                'is_active': True,
                'is_new': True,
                'version': '1.0.0'
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS('Successfully seeded Geometry Toolkit'))
        else:
            self.stdout.write(self.style.SUCCESS('Geometry Toolkit already exists'))
