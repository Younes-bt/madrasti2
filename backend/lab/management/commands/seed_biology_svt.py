from django.core.management.base import BaseCommand
from lab.models import LabToolCategory, LabTool


class Command(BaseCommand):
    help = 'Seeds the database with Biology (SVT) tools'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding Biology (SVT) tools...')

        # Get or create Biology category
        biology_category, _ = LabToolCategory.objects.get_or_create(
            name='biology',
            defaults={
                'name_ar': 'علوم الحياة والأرض',
                'name_fr': 'Sciences de la Vie et de la Terre (SVT)',
                'name_en': 'Biology (Life & Earth Sciences)',
                'icon': 'Microscope',
                'color': '#10b981',  # Green
                'order': 4,
                'is_active': True
            }
        )

        tools = [
            # Human Body Explorer - Main Tool
            {
                'tool_id': 'human-body-explorer',
                'name_ar': 'مستكشف جسم الإنسان',
                'name_fr': 'Explorateur du corps humain',
                'name_en': 'Human Body Explorer',
                'description_ar': 'نماذج ثلاثية الأبعاد تفاعلية لأجهزة جسم الإنسان مع رسوم متحركة',
                'description_fr': 'Modèles 3D interactifs des systèmes du corps humain avec animations',
                'description_en': 'Interactive 3D models of human body systems with animations',
                'category': biology_category,
                'icon': 'User',
                'grade_levels': ['3AC'],
                'is_new': True
            },

            # Individual Body Systems (for direct access)
            {
                'tool_id': 'digestive-system',
                'name_ar': 'الجهاز الهضمي',
                'name_fr': 'Système digestif',
                'name_en': 'Digestive System',
                'description_ar': 'استكشاف الجهاز الهضمي مع رسوم متحركة لعملية الهضم',
                'description_fr': 'Explorer le système digestif avec animations du processus de digestion',
                'description_en': 'Explore digestive system with digestion process animations',
                'category': biology_category,
                'icon': 'Utensils',
                'grade_levels': ['3AC'],
                'is_new': True
            },
            {
                'tool_id': 'respiratory-system',
                'name_ar': 'الجهاز التنفسي',
                'name_fr': 'Système respiratoire',
                'name_en': 'Respiratory System',
                'description_ar': 'دراسة الجهاز التنفسي: الرئتان، القصبة الهوائية، عملية التنفس',
                'description_fr': 'Étudier le système respiratoire: poumons, trachée, processus de respiration',
                'description_en': 'Study respiratory system: lungs, trachea, breathing process',
                'category': biology_category,
                'icon': 'Wind',
                'grade_levels': ['3AC'],
                'is_new': True
            },
            {
                'tool_id': 'circulatory-system',
                'name_ar': 'الجهاز الدوري',
                'name_fr': 'Système circulatoire',
                'name_en': 'Circulatory System',
                'description_ar': 'استكشاف القلب والدورة الدموية وتدفق الدم',
                'description_fr': 'Explorer le cœur, la circulation sanguine et le flux sanguin',
                'description_en': 'Explore heart, blood circulation, and blood flow',
                'category': biology_category,
                'icon': 'Heart',
                'grade_levels': ['3AC'],
                'is_new': True
            },
            {
                'tool_id': 'urinary-system',
                'name_ar': 'الجهاز البولي',
                'name_fr': 'Système urinaire',
                'name_en': 'Urinary System',
                'description_ar': 'دراسة الكليتان والمثانة وعملية الإخراج',
                'description_fr': 'Étudier les reins, la vessie et le processus d\'excrétion',
                'description_en': 'Study kidneys, bladder, and excretion process',
                'category': biology_category,
                'icon': 'Droplet',
                'grade_levels': ['3AC'],
                'is_new': True
            },
            {
                'tool_id': 'nervous-system',
                'name_ar': 'الجهاز العصبي',
                'name_fr': 'Système nerveux',
                'name_en': 'Nervous System',
                'description_ar': 'استكشاف الدماغ، الحبل الشوكي، والأعصاب',
                'description_fr': 'Explorer le cerveau, la moelle épinière et les nerfs',
                'description_en': 'Explore brain, spinal cord, and nerves',
                'category': biology_category,
                'icon': 'Brain',
                'grade_levels': ['3AC'],
                'is_new': True
            },
            {
                'tool_id': 'muscular-system',
                'name_ar': 'الجهاز العضلي',
                'name_fr': 'Système musculaire',
                'name_en': 'Muscular System',
                'description_ar': 'دراسة العضلات وأنواعها ووظائفها',
                'description_fr': 'Étudier les muscles, leurs types et fonctions',
                'description_en': 'Study muscles, their types and functions',
                'category': biology_category,
                'icon': 'Dumbbell',
                'grade_levels': ['3AC'],
                'is_new': True
            },
            {
                'tool_id': 'immune-system',
                'name_ar': 'الجهاز المناعي',
                'name_fr': 'Système immunitaire',
                'name_en': 'Immune System',
                'description_ar': 'استكشاف الخلايا المناعية، الأعضاء، والاستجابات المناعية',
                'description_fr': 'Explorer les cellules immunitaires, organes et réponses immunitaires',
                'description_en': 'Explore immune cells, organs, and immune responses',
                'category': biology_category,
                'icon': 'Shield',
                'grade_levels': ['3AC'],
                'is_new': True
            },
        ]

        created_count = 0
        updated_count = 0

        for tool_data in tools:
            tool, created = LabTool.objects.update_or_create(
                tool_id=tool_data['tool_id'],
                defaults=tool_data
            )
            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully processed {len(tools)} Biology (SVT) tools '
                f'({created_count} created, {updated_count} updated)'
            )
        )
