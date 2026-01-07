from django.core.management.base import BaseCommand
from lab.models import LabToolCategory, LabTool


class Command(BaseCommand):
    help = 'Seeds the database with Physics Mechanics tools'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding Physics Mechanics tools...')

        # Get or create Physics category
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
            # ==================== KINEMATICS ====================
            {
                'tool_id': 'average-speed-calculator',
                'name_ar': 'حاسبة السرعة المتوسطة',
                'name_fr': 'Calculateur de vitesse moyenne',
                'name_en': 'Average Speed Calculator',
                'description_ar': 'حساب السرعة المتوسطة والسرعة من المسافة والزمن',
                'description_fr': 'Calculer la vitesse moyenne et la vélocité à partir de la distance et du temps',
                'description_en': 'Calculate average speed and velocity from distance and time',
                'category': physics_category,
                'icon': 'Gauge',
                'grade_levels': ['3AC'],
                'is_new': True
            },
            {
                'tool_id': 'uniform-motion-simulator',
                'name_ar': 'محاكي الحركة المنتظمة',
                'name_fr': 'Simulateur de mouvement uniforme',
                'name_en': 'Uniform Motion Simulator',
                'description_ar': 'محاكاة الحركة بسرعة ثابتة مع رسوم بيانية',
                'description_fr': 'Simuler un mouvement à vitesse constante avec graphiques',
                'description_en': 'Simulate constant velocity motion with graphs',
                'category': physics_category,
                'icon': 'MoveRight',
                'grade_levels': ['3AC'],
                'is_new': True
            },
            {
                'tool_id': 'accelerated-motion',
                'name_ar': 'الحركة المتسارعة',
                'name_fr': 'Mouvement accéléré',
                'name_en': 'Accelerated Motion',
                'description_ar': 'محاكاة الحركة بتسارع ثابت مع معادلات الحركة',
                'description_fr': 'Simuler un mouvement avec accélération constante',
                'description_en': 'Simulate uniformly accelerated motion with equations',
                'category': physics_category,
                'icon': 'TrendingUp',
                'grade_levels': ['1BAC', '2BAC'],
                'is_new': True
            },
            {
                'tool_id': 'free-fall-simulator',
                'name_ar': 'محاكي السقوط الحر',
                'name_fr': 'Simulateur de chute libre',
                'name_en': 'Free Fall Simulator',
                'description_ar': 'محاكاة السقوط الحر مع g = 9.8 m/s²',
                'description_fr': 'Simuler la chute libre avec g = 9.8 m/s²',
                'description_en': 'Simulate free fall with g = 9.8 m/s²',
                'category': physics_category,
                'icon': 'ArrowDown',
                'grade_levels': ['1BAC', '2BAC'],
                'is_new': True
            },
            {
                'tool_id': 'projectile-motion',
                'name_ar': 'الحركة المستوية',
                'name_fr': 'Mouvement du projectile',
                'name_en': 'Projectile Motion (2D)',
                'description_ar': 'محاكاة الحركة ثنائية الأبعاد (القذائف)',
                'description_fr': 'Simuler un mouvement de projectile en 2D',
                'description_en': 'Simulate 2D projectile motion with trajectory',
                'category': physics_category,
                'icon': 'TrendingUp',
                'grade_levels': ['2BAC'],
                'is_new': True
            },
            {
                'tool_id': 'circular-motion',
                'name_ar': 'الحركة الدائرية',
                'name_fr': 'Mouvement circulaire',
                'name_en': 'Circular Motion',
                'description_ar': 'محاكاة الحركة الدائرية المنتظمة',
                'description_fr': 'Simuler un mouvement circulaire uniforme',
                'description_en': 'Simulate uniform circular motion',
                'category': physics_category,
                'icon': 'CircleDot',
                'grade_levels': ['2BAC'],
                'is_new': True
            },
            {
                'tool_id': 'rotation-simulator',
                'name_ar': 'محاكي دوران الجسم الصلب',
                'name_fr': 'Simulateur de rotation',
                'name_en': 'Rotation Simulator',
                'description_ar': 'محاكاة الدوران مع السرعة الزاوية والعزم',
                'description_fr': 'Simuler la rotation avec vitesse angulaire et couple',
                'description_en': 'Simulate rotation with angular velocity and torque',
                'category': physics_category,
                'icon': 'RotateCw',
                'grade_levels': ['1BAC', '2BAC'],
                'is_new': True
            },

            # ==================== DYNAMICS ====================
            {
                'tool_id': 'force-vector-visualizer',
                'name_ar': 'مصور متجهات القوى',
                'name_fr': 'Visualiseur de vecteurs de force',
                'name_en': 'Force Vector Visualizer',
                'description_ar': 'تصور وتحليل متجهات القوى',
                'description_fr': 'Visualiser et analyser les vecteurs de force',
                'description_en': 'Visualize and analyze force vectors',
                'category': physics_category,
                'icon': 'Move',
                'grade_levels': ['3AC'],
                'is_new': True
            },
            {
                'tool_id': 'newtons-laws-simulator',
                'name_ar': 'محاكي قوانين نيوتن',
                'name_fr': 'Simulateur des lois de Newton',
                'name_en': "Newton's Laws Simulator",
                'description_ar': 'محاكاة تفاعلية لقوانين نيوتن الثلاثة',
                'description_fr': 'Simulation interactive des trois lois de Newton',
                'description_en': "Interactive simulation of Newton's three laws",
                'category': physics_category,
                'icon': 'Rocket',
                'grade_levels': ['2BAC'],
                'is_new': True
            },
            {
                'tool_id': 'weight-mass-calculator',
                'name_ar': 'حاسبة الوزن والكتلة',
                'name_fr': 'Calculateur poids/masse',
                'name_en': 'Weight vs Mass Calculator',
                'description_ar': 'حساب الوزن (P = mg) والفرق بين الكتلة والوزن',
                'description_fr': 'Calculer le poids (P = mg) et différencier masse/poids',
                'description_en': 'Calculate weight (P = mg) and distinguish mass vs weight',
                'category': physics_category,
                'icon': 'Scale',
                'grade_levels': ['3AC'],
                'is_new': True
            },
            {
                'tool_id': 'equilibrium-forces',
                'name_ar': 'توازن القوى',
                'name_fr': 'Équilibre des forces',
                'name_en': 'Equilibrium of Forces',
                'description_ar': 'توازن قوتين أو ثلاث قوى',
                'description_fr': 'Équilibre de 2 ou 3 forces',
                'description_en': 'Equilibrium of 2 or 3 forces',
                'category': physics_category,
                'icon': 'Equal',
                'grade_levels': ['3AC'],
                'is_new': True
            },
            {
                'tool_id': 'friction-calculator',
                'name_ar': 'حاسبة قوة الاحتكاك',
                'name_fr': 'Calculateur de force de frottement',
                'name_en': 'Friction Force Calculator',
                'description_ar': 'حساب قوة الاحتكاك الساكن والحركي',
                'description_fr': 'Calculer les forces de frottement statique et cinétique',
                'description_en': 'Calculate static and kinetic friction forces',
                'category': physics_category,
                'icon': 'Grip',
                'grade_levels': ['1BAC', '2BAC'],
                'is_new': True
            },
            {
                'tool_id': 'satellite-motion',
                'name_ar': 'حركة الأقمار الصناعية والكواكب',
                'name_fr': 'Mouvement des satellites et planètes',
                'name_en': 'Satellite & Planetary Motion',
                'description_ar': 'محاكاة حركة الأقمار الصناعية والكواكب',
                'description_fr': 'Simuler le mouvement des satellites et planètes',
                'description_en': 'Simulate satellite and planetary motion',
                'category': physics_category,
                'icon': 'Orbit',
                'grade_levels': ['2BAC'],
                'is_new': True
            },

            # ==================== ENERGY & WORK ====================
            {
                'tool_id': 'work-calculator',
                'name_ar': 'حاسبة الشغل',
                'name_fr': 'Calculateur de travail',
                'name_en': 'Work Calculator',
                'description_ar': 'حساب الشغل (W = F × d × cos θ)',
                'description_fr': 'Calculer le travail (W = F × d × cos θ)',
                'description_en': 'Calculate work (W = F × d × cos θ)',
                'category': physics_category,
                'icon': 'Hammer',
                'grade_levels': ['1BAC'],
                'is_new': True
            },
            {
                'tool_id': 'kinetic-energy',
                'name_ar': 'الطاقة الحركية',
                'name_fr': 'Énergie cinétique',
                'name_en': 'Kinetic Energy',
                'description_ar': 'حساب الطاقة الحركية (Ec = ½mv²)',
                'description_fr': 'Calculer l\'énergie cinétique (Ec = ½mv²)',
                'description_en': 'Calculate kinetic energy (KE = ½mv²)',
                'category': physics_category,
                'icon': 'Zap',
                'grade_levels': ['1BAC'],
                'is_new': True
            },
            {
                'tool_id': 'potential-energy',
                'name_ar': 'الطاقة الكامنة',
                'name_fr': 'Énergie potentielle',
                'name_en': 'Potential Energy',
                'description_ar': 'طاقة الوضع (جاذبية، مرونة، كهربائية)',
                'description_fr': 'Énergie potentielle (gravitationnelle, élastique, électrique)',
                'description_en': 'Potential energy (gravitational, elastic, electric)',
                'category': physics_category,
                'icon': 'Mountain',
                'grade_levels': ['1BAC', '2BAC'],
                'is_new': True
            },
            {
                'tool_id': 'energy-conservation',
                'name_ar': 'حفظ الطاقة الميكانيكية',
                'name_fr': 'Conservation de l\'énergie mécanique',
                'name_en': 'Mechanical Energy Conservation',
                'description_ar': 'محاكاة مبدأ حفظ الطاقة الميكانيكية',
                'description_fr': 'Simuler le principe de conservation de l\'énergie',
                'description_en': 'Simulate mechanical energy conservation principle',
                'category': physics_category,
                'icon': 'Infinity',
                'grade_levels': ['1BAC', '2BAC'],
                'is_new': True
            },
            {
                'tool_id': 'power-calculator',
                'name_ar': 'حاسبة القدرة',
                'name_fr': 'Calculateur de puissance',
                'name_en': 'Power Calculator',
                'description_ar': 'حساب القدرة (P = W/t)',
                'description_fr': 'Calculer la puissance (P = W/t)',
                'description_en': 'Calculate power (P = W/t)',
                'category': physics_category,
                'icon': 'Lightbulb',
                'grade_levels': ['1BAC'],
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
                f'Successfully processed {len(tools)} Physics Mechanics tools '
                f'({created_count} created, {updated_count} updated)'
            )
        )
