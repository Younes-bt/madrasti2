from django.core.management.base import BaseCommand
from lab.models import LabToolCategory, LabTool

class Command(BaseCommand):
    help = 'Seeds the database with the Logic & Set Theory tool'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding Logic & Set Theory tool...')

        # Get Math category
        math_category, _ = LabToolCategory.objects.get_or_create(
            name='math',
            defaults={
                'name_ar': 'الرياضيات',
                'name_fr': 'Mathématiques',
                'name_en': 'Mathematics',
                'icon': 'Calculator',
                'color': '#3b82f6',
                'order': 1,
                'is_active': True
            }
        )

        tool_data = {
            'tool_id': 'logic-set-theory',
            'name_ar': 'المنطق والمجموعات',
            'name_fr': 'Logique et Théorie des Ensembles',
            'name_en': 'Logic & Set Theory',
            'description_ar': 'أدوات لتوليد جداول الحقيقة، العمليات على المجموعات، ومخططات فن.',
            'description_fr': 'Outils pour générer des tables de vérité, opérations sur les ensembles et diagrammes de Venn.',
            'description_en': 'Tools for generating truth tables, set operations, and Venn diagrams.',
            'category': math_category,
            'icon': 'Binary', 
            'grade_levels': ['TC', '1BAC', '2BAC'],
            'is_new': True,
            'features': {
                'calculators': [
                    'Truth Table Generator',
                    'Set Operations (Union, Intersection, Diff)',
                    'Logical Equivalence Checker'
                ],
                'visualizers': [
                    'Venn Diagram Creator'
                ]
            }
        }

        LabTool.objects.update_or_create(
            tool_id=tool_data['tool_id'],
            defaults=tool_data
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded Logic & Set Theory tool'))
