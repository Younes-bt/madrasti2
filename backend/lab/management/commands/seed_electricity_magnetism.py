from django.core.management.base import BaseCommand
from lab.models import LabToolCategory, LabTool


class Command(BaseCommand):
    help = 'Seeds the database with Electricity & Magnetism physics tools'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding Electricity & Magnetism tools...')

        # Get Physics category
        physics_category, _ = LabToolCategory.objects.get_or_create(
            name='physics',
            defaults={
                'name_ar': 'الفيزياء',
                'name_fr': 'Physique',
                'name_en': 'Physics',
                'icon': 'Atom',
                'color': '#8b5cf6',  # Purple
                'order': 3,
                'is_active': True
            }
        )

        tools = [
            # ==================== BASIC CIRCUITS ====================
            # Circuit Builder
            {
                'tool_id': 'circuit-builder',
                'name_ar': 'بناء الدارات الكهربائية',
                'name_fr': 'Constructeur de circuits',
                'name_en': 'Circuit Builder',
                'description_ar': 'بناء دارات كهربائية بسيطة باستخدام البطارية، المقاومة، المصباح، والمفتاح',
                'description_fr': 'Construire des circuits avec batterie, résistance, lampe et interrupteur',
                'description_en': 'Build simple circuits with battery, resistor, lamp, and switch',
                'category': physics_category,
                'icon': 'Cpu',
                'grade_levels': ['1AC'],
                'is_new': True
            },
            # Ohm's Law Calculator
            {
                'tool_id': 'ohms-law',
                'name_ar': 'قانون أوم',
                'name_fr': 'Loi d\'Ohm',
                'name_en': 'Ohm\'s Law Calculator',
                'description_ar': 'حساب العلاقة بين التوتر والتيار والمقاومة (V = R × I)',
                'description_fr': 'Calculer la relation entre tension, courant et résistance (V = R × I)',
                'description_en': 'Calculate relationship between voltage, current, and resistance (V = R × I)',
                'category': physics_category,
                'icon': 'Zap',
                'grade_levels': ['3AC'],
                'is_new': True
            },
            # Series vs Parallel Circuits
            {
                'tool_id': 'series-parallel-circuits',
                'name_ar': 'الدارات المتوالية والمتوازية',
                'name_fr': 'Circuits série et parallèle',
                'name_en': 'Series vs Parallel Circuits',
                'description_ar': 'مقارنة ودراسة الدارات المتوالية والمتوازية',
                'description_fr': 'Comparer et étudier les circuits en série et en parallèle',
                'description_en': 'Compare and study series and parallel circuits',
                'category': physics_category,
                'icon': 'GitBranch',
                'grade_levels': ['1AC', '3AC'],
                'is_new': True
            },
            # Voltage Addition
            {
                'tool_id': 'voltage-addition',
                'name_ar': 'إضافية التوترات',
                'name_fr': 'Addition des tensions',
                'name_en': 'Voltage Addition',
                'description_ar': 'دراسة إضافية التوترات في الدارات الكهربائية',
                'description_fr': 'Étudier l\'addition des tensions dans les circuits',
                'description_en': 'Study voltage addition in electrical circuits',
                'category': physics_category,
                'icon': 'Plus',
                'grade_levels': ['1AC'],
                'is_new': True
            },
            # Nodal Law
            {
                'tool_id': 'nodal-law',
                'name_ar': 'قانون العقد',
                'name_fr': 'Loi des noeuds',
                'name_en': 'Nodal Law (Kirchhoff\'s Current Law)',
                'description_ar': 'تطبيق قانون العقد (كيرشوف) في الدارات الكهربائية',
                'description_fr': 'Appliquer la loi des noeuds (Kirchhoff) dans les circuits',
                'description_en': 'Apply Kirchhoff\'s current law at circuit nodes',
                'category': physics_category,
                'icon': 'Network',
                'grade_levels': ['1AC'],
                'is_new': True
            },
            # Electrical Power
            {
                'tool_id': 'electrical-power',
                'name_ar': 'القدرة الكهربائية',
                'name_fr': 'Puissance électrique',
                'name_en': 'Electrical Power',
                'description_ar': 'حساب القدرة الكهربائية (P = U × I)',
                'description_fr': 'Calculer la puissance électrique (P = U × I)',
                'description_en': 'Calculate electrical power (P = U × I)',
                'category': physics_category,
                'icon': 'Lightbulb',
                'grade_levels': ['3AC'],
                'is_new': True
            },
            # Electrical Energy
            {
                'tool_id': 'electrical-energy',
                'name_ar': 'الطاقة الكهربائية',
                'name_fr': 'Énergie électrique',
                'name_en': 'Electrical Energy',
                'description_ar': 'حساب الطاقة الكهربائية (E = P × t)',
                'description_fr': 'Calculer l\'énergie électrique (E = P × t)',
                'description_en': 'Calculate electrical energy (E = P × t)',
                'category': physics_category,
                'icon': 'Battery',
                'grade_levels': ['3AC'],
                'is_new': True
            },

            # ==================== ADVANCED CIRCUITS ====================
            # RC Circuit
            {
                'tool_id': 'rc-circuit',
                'name_ar': 'ثنائي القطب RC',
                'name_fr': 'Circuit RC',
                'name_en': 'RC Circuit (Charge/Discharge)',
                'description_ar': 'محاكاة شحن وتفريغ مكثف في دارة RC',
                'description_fr': 'Simuler la charge et décharge d\'un condensateur dans un circuit RC',
                'description_en': 'Simulate capacitor charge and discharge in RC circuit',
                'category': physics_category,
                'icon': 'Timer',
                'grade_levels': ['2BAC'],
                'is_new': True
            },
            # RL Circuit
            {
                'tool_id': 'rl-circuit',
                'name_ar': 'ثنائي القطب RL',
                'name_fr': 'Circuit RL',
                'name_en': 'RL Circuit',
                'description_ar': 'دراسة دارة RL مع ملف حثي',
                'description_fr': 'Étudier un circuit RL avec inductance',
                'description_en': 'Study RL circuit with inductor',
                'category': physics_category,
                'icon': 'Codesandbox',
                'grade_levels': ['2BAC'],
                'is_new': True
            },
            # RLC Circuit
            {
                'tool_id': 'rlc-circuit',
                'name_ar': 'التذبذبات في دارة RLC',
                'name_fr': 'Circuit RLC (oscillations)',
                'name_en': 'RLC Circuit (Free & Forced Oscillations)',
                'description_ar': 'دراسة التذبذبات الحرة والقسرية في دارة RLC',
                'description_fr': 'Étudier les oscillations libres et forcées dans un circuit RLC',
                'description_en': 'Study free and forced oscillations in RLC circuit',
                'category': physics_category,
                'icon': 'Activity',
                'grade_levels': ['2BAC'],
                'is_new': True
            },
            # AC Circuit Analyzer
            {
                'tool_id': 'ac-circuit-analyzer',
                'name_ar': 'محلل دارات التيار المتناوب',
                'name_fr': 'Analyseur de circuits AC',
                'name_en': 'AC Circuit Analyzer',
                'description_ar': 'تحليل دارات التيار المتناوب: الممانعة وفرق الطور',
                'description_fr': 'Analyser les circuits AC: impédance et déphasage',
                'description_en': 'Analyze AC circuits: impedance and phase difference',
                'category': physics_category,
                'icon': 'WavesLadder',
                'grade_levels': ['2BAC'],
                'is_new': True
            },

            # ==================== ELECTROMAGNETISM ====================
            # Magnetic Field Visualizer
            {
                'tool_id': 'magnetic-field',
                'name_ar': 'الحقل المغناطيسي',
                'name_fr': 'Champ magnétique',
                'name_en': 'Magnetic Field Visualizer',
                'description_ar': 'تصور خطوط الحقل المغناطيسي للمغناطيس وموصل',
                'description_fr': 'Visualiser les lignes de champ magnétique d\'un aimant et conducteur',
                'description_en': 'Visualize magnetic field lines of magnets and conductors',
                'category': physics_category,
                'icon': 'Magnet',
                'grade_levels': ['1BAC'],
                'is_new': True
            },
            # Lorentz Force
            {
                'tool_id': 'lorentz-force',
                'name_ar': 'قوة لورنتز',
                'name_fr': 'Force de Lorentz',
                'name_en': 'Lorentz Force Calculator',
                'description_ar': 'حساب قوة لورنتز على شحنة متحركة في حقل مغناطيسي',
                'description_fr': 'Calculer la force de Lorentz sur une charge en mouvement',
                'description_en': 'Calculate Lorentz force on moving charge in magnetic field',
                'category': physics_category,
                'icon': 'Compass',
                'grade_levels': ['1BAC'],
                'is_new': True
            },
            # Electromagnetic Induction
            {
                'tool_id': 'electromagnetic-induction',
                'name_ar': 'الحث الكهرومغناطيسي',
                'name_fr': 'Induction électromagnétique',
                'name_en': 'Electromagnetic Induction',
                'description_ar': 'دراسة قانون فاراداي والحث الكهرومغناطيسي',
                'description_fr': 'Étudier la loi de Faraday et l\'induction électromagnétique',
                'description_en': 'Study Faraday\'s law and electromagnetic induction',
                'category': physics_category,
                'icon': 'Workflow',
                'grade_levels': ['2BAC'],
                'is_new': True
            },

            # ==================== ELECTROSTATICS (SM only) ====================
            # Electric Field Calculator
            {
                'tool_id': 'electric-field',
                'name_ar': 'الحقل الكهرساكن',
                'name_fr': 'Champ électrique',
                'name_en': 'Electric Field Calculator',
                'description_ar': 'حساب الحقل الكهرساكن لشحنة نقطية',
                'description_fr': 'Calculer le champ électrique d\'une charge ponctuelle',
                'description_en': 'Calculate electric field of point charges',
                'category': physics_category,
                'icon': 'Sparkles',
                'grade_levels': ['1BAC', '2BAC'],
                'is_new': True
            },
            # Coulomb's Law
            {
                'tool_id': 'coulombs-law',
                'name_ar': 'قانون كولوم',
                'name_fr': 'Loi de Coulomb',
                'name_en': 'Coulomb\'s Law',
                'description_ar': 'حساب القوة الكهرساكنة بين شحنتين',
                'description_fr': 'Calculer la force électrostatique entre deux charges',
                'description_en': 'Calculate electrostatic force between two charges',
                'category': physics_category,
                'icon': 'Zap',
                'grade_levels': ['1BAC', '2BAC'],
                'is_new': True
            },
            # Electric Potential Energy
            {
                'tool_id': 'electric-potential-energy',
                'name_ar': 'طاقة الوضع الكهرساكنة',
                'name_fr': 'Énergie potentielle électrique',
                'name_en': 'Electric Potential Energy',
                'description_ar': 'حساب طاقة الوضع الكهرساكنة لشحنة في حقل كهربائي',
                'description_fr': 'Calculer l\'énergie potentielle électrique d\'une charge',
                'description_en': 'Calculate electric potential energy of charges',
                'category': physics_category,
                'icon': 'Bolt',
                'grade_levels': ['1BAC', '2BAC'],
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
                f'Successfully processed {len(tools)} Electricity & Magnetism tools '
                f'({created_count} created, {updated_count} updated)'
            )
        )
