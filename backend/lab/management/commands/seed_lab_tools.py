from django.core.management.base import BaseCommand
from lab.models import LabToolCategory, LabTool


class Command(BaseCommand):
    help = 'Seeds the database with initial lab tools'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding lab tool categories...')
        
        # Create categories
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
        
        self.stdout.write(self.style.SUCCESS('Categories created successfully'))
        
        # Create Phase 1 tools
        self.stdout.write('Seeding Phase 1 lab tools...')
        
        tools = [
            {
                'tool_id': 'scientific-calculator',
                'name_ar': 'آلة حاسبة علمية',
                'name_fr': 'Calculatrice Scientifique',
                'name_en': 'Scientific Calculator',
                'description_ar': 'آلة حاسبة علمية متقدمة',
                'description_fr': 'Calculatrice scientifique avancée',
                'description_en': 'Advanced scientific calculator',
                'category': math_category,
                'icon': 'Calculator',
                'grade_levels': ['1AC', '2AC', '3AC', 'TC', '1BAC', '2BAC'],
                'is_new': True
            },
            {
                'tool_id': 'unit-converter',
                'name_ar': 'محول الوحدات',
                'name_fr': "Convertisseur d'Unités",
                'name_en': 'Unit Converter',
                'description_ar': 'تحويل بين وحدات القياس المختلفة',
                'description_fr': 'Convertir entre unités de mesure',
                'description_en': 'Convert between different units',
                'category': math_category,
                'icon': 'ArrowLeftRight',
                'grade_levels': ['1AC', '2AC', '3AC', 'TC', '1BAC', '2BAC'],
                'is_new': True
            },
            {
                'tool_id': 'function-grapher',
                'name_ar': 'رسم الدوال',
                'name_fr': 'Grapheur de Fonctions',
                'name_en': 'Function Grapher',
                'description_ar': 'رسم وتحليل الدوال الرياضية',
                'description_fr': 'Tracer et analyser les fonctions',
                'description_en': 'Plot and analyze functions',
                'category': math_category,
                'icon': 'LineChart',
                'grade_levels': ['3AC', 'TC', '1BAC', '2BAC'],
                'is_new': True
            },
            {
                'tool_id': 'equation-solver',
                'name_ar': 'حل المعادلات',
                'name_fr': "Résolveur d'Équations",
                'name_en': 'Equation Solver',
                'description_ar': 'حل المعادلات مع خطوات مفصلة',
                'description_fr': 'Résoudre les équations détaillées',
                'description_en': 'Solve equations with steps',
                'category': math_category,
                'icon': 'Equals',
                'grade_levels': ['1AC', '2AC', '3AC', 'TC', '1BAC', '2BAC'],
                'is_new': True
            },
            {
                'tool_id': 'periodic-table',
                'name_ar': 'الجدول الدوري التفاعلي',
                'name_fr': 'Tableau Périodique Interactif',
                'name_en': 'Interactive Periodic Table',
                'description_ar': 'استكشف العناصر الكيميائية',
                'description_fr': 'Explorez les éléments chimiques',
                'description_en': 'Explore chemical elements',
                'category': chemistry_category,
                'icon': 'Grid3x3',
                'grade_levels': ['3AC', '1BAC', '2BAC'],
                'is_new': True
            }
        ]
        
        for tool_data in tools:
            LabTool.objects.get_or_create(
                tool_id=tool_data['tool_id'],
                defaults=tool_data
            )
        
        self.stdout.write(self.style.SUCCESS('Successfully seeded 5 Phase 1 lab tools'))
