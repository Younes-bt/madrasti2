from django.core.management.base import BaseCommand
from lab.models import LabToolCategory, LabTool

class Command(BaseCommand):
    help = 'Seeds the database with the Statistics & Probability tool'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding Statistics & Probability tool...')

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
            'tool_id': 'statistics-lab',
            'name_ar': 'الإحصاء والاحتمالات',
            'name_fr': 'Statistiques et Probabilités',
            'name_en': 'Statistics & Probability',
            'description_ar': 'أدوات شاملة لحساب المتوسط، الوسيط، المنوال، الانحراف المعياري، والاحتمالات مع تمثيل بياني.',
            'description_fr': 'Outils complets pour calculer la moyenne, la médiane, le mode, l\'écart-type et les probabilités avec des graphiques.',
            'description_en': 'Comprehensive tools for calculating mean, median, mode, standard deviation, and probability with charting.',
            'category': math_category,
            'icon': 'BarChart',  # Using BarChart icon
            'grade_levels': ['1AC', '2AC', '3AC', 'TC', '1BAC', '2BAC'],
            'is_new': True,
            'features': {
                'calculators': [
                    'Mean, Median, Mode',
                    'Standard Deviation, Variance',
                    'Probability (Combinations, Permutations)',
                    'Binomial Distribution',
                    'Conditional Probability'
                ],
                'visualizers': [
                    'Frequency Tables',
                    'Histogram',
                    'Bar Chart',
                    'Pie Chart'
                ]
            }
        }

        LabTool.objects.update_or_create(
            tool_id=tool_data['tool_id'],
            defaults=tool_data
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded Statistics & Probability tool'))
