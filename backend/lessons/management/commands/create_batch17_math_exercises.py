from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice

User = get_user_model()

class Command(BaseCommand):
    help = 'Create exercises for Batch 17: Third Year Middle School Mathematics (Lesson IDs: 1753-1762)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises before creating new ones',
        )

    def handle(self, *args, **options):
        lesson_ids = range(1753, 1763)  # 1753-1762

        # Get admin user for created_by
        self.admin_user = User.objects.filter(is_superuser=True).first()
        if not self.admin_user:
            self.stdout.write(self.style.ERROR('No superuser found'))
            return

        with transaction.atomic():
            for lesson_id in lesson_ids:
                try:
                    lesson = Lesson.objects.get(id=lesson_id)
                    self.stdout.write(f'\nProcessing Lesson ID {lesson_id}: {lesson.title}')

                    if options['delete_existing']:
                        count = Exercise.objects.filter(lesson=lesson).count()
                        Exercise.objects.filter(lesson=lesson).delete()
                        self.stdout.write(self.style.WARNING(f'  Deleted {count} existing exercises'))

                    self.create_exercises_for_lesson(lesson)

                except Lesson.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f'  Lesson ID {lesson_id} not found'))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'  Error: {str(e)[:100]}'))

        self.stdout.write(self.style.SUCCESS('\nBatch 17 exercises created successfully'))

    def create_exercises_for_lesson(self, lesson):
        """Create exercises based on lesson ID"""
        exercises_map = {
            1753: self.create_expansion_factorization_exercises,
            1754: self.create_identities_exercises,
            1755: self.create_powers_exercises,
            1756: self.create_square_roots_exercises,
            1757: self.create_pythagoras_exercises,
            1758: self.create_order_operations_exercises,
            1759: self.create_thales_exercises,
            1760: self.create_right_triangle_exercises,
            1761: self.create_trigonometry_exercises,
            1762: self.create_circle_angles_exercises,
        }

        func = exercises_map.get(lesson.id)
        if func:
            func(lesson)

    def create_expansion_factorization_exercises(self, lesson):
        """ID 1753: Expansion and Factorization"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Expansion and Factorization - Basics',
            title_arabic='التوسيع والتحليل إلى عوامل - الأساسيات',
            description='Fundamental exercises on expanding and factorizing algebraic expressions',
            difficulty_level='beginner',
            estimated_duration=25,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'ما هو نتيجة توسيع العبارة: 2(x + 3)?',
                'text_en': 'What is the result of expanding: 2(x + 3)?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('2x + 6', True),
                    ('2x + 3', False),
                    ('x + 6', False),
                    ('2x + 5', False)
                ]
            },
            {
                'text_ar': 'حلل إلى عوامل: 6x + 9',
                'text_en': 'Factorize: 6x + 9',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('3(2x + 3)', True),
                    ('6(x + 9)', False),
                    ('3(2x + 9)', False),
                    ('2(3x + 9)', False)
                ]
            },
            {
                'text_ar': 'وسّع: (x + 2)(x + 3)',
                'text_en': 'Expand: (x + 2)(x + 3)',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('x² + 5x + 6', True),
                    ('x² + 6', False),
                    ('2x + 5', False),
                    ('x² + 5x', False)
                ]
            },
            {
                'text_ar': 'حلل إلى عوامل: x² - 9',
                'text_en': 'Factorize: x² - 9',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('(x + 3)(x - 3)', True),
                    ('(x - 9)(x + 1)', False),
                    ('x(x - 9)', False),
                    ('(x + 9)(x - 1)', False)
                ]
            },
            {
                'text_ar': 'ما هو العامل المشترك في: 4x² + 8x?',
                'text_en': 'What is the common factor in: 4x² + 8x?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('4x', True),
                    ('4', False),
                    ('x', False),
                    ('8', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_identities_exercises(self, lesson):
        """ID 1754: Important Identities"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Important Algebraic Identities',
            title_arabic='المتطابقات الجبرية الهامة',
            description='Exercises on key algebraic identities',
            difficulty_level='intermediate',
            estimated_duration=30,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'ما هي نتيجة توسيع: (a + b)²?',
                'text_en': 'What is the result of expanding: (a + b)²?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('a² + 2ab + b²', True),
                    ('a² + b²', False),
                    ('a² + ab + b²', False),
                    ('2a² + 2b²', False)
                ]
            },
            {
                'text_ar': 'وسّع: (a - b)²',
                'text_en': 'Expand: (a - b)²',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('a² - 2ab + b²', True),
                    ('a² - b²', False),
                    ('a² + 2ab - b²', False),
                    ('a² - ab + b²', False)
                ]
            },
            {
                'text_ar': 'ما هي نتيجة: (a + b)(a - b)?',
                'text_en': 'What is the result of: (a + b)(a - b)?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('a² - b²', True),
                    ('a² + b²', False),
                    ('a² - 2ab + b²', False),
                    ('2a² - 2b²', False)
                ]
            },
            {
                'text_ar': 'احسب: (x + 3)² باستخدام المتطابقة الهامة',
                'text_en': 'Calculate: (x + 3)² using the identity',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('x² + 6x + 9', True),
                    ('x² + 9', False),
                    ('x² + 3x + 9', False),
                    ('x² + 6x', False)
                ]
            },
            {
                'text_ar': 'حلل إلى عوامل: x² - 16 باستخدام الفرق بين مربعين',
                'text_en': 'Factorize: x² - 16 using difference of squares',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('(x + 4)(x - 4)', True),
                    ('(x + 16)(x - 1)', False),
                    ('(x + 8)(x - 2)', False),
                    ('x(x - 16)', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_powers_exercises(self, lesson):
        """ID 1755: Powers"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Powers and Exponents',
            title_arabic='القوى والأسس',
            description='Exercises on power rules and calculations',
            difficulty_level='intermediate',
            estimated_duration=25,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'احسب: 2³',
                'text_en': 'Calculate: 2³',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('8', True),
                    ('6', False),
                    ('9', False),
                    ('5', False)
                ]
            },
            {
                'text_ar': 'ما هي قيمة: 5⁰?',
                'text_en': 'What is the value of: 5⁰?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('1', True),
                    ('0', False),
                    ('5', False),
                    ('undefined / غير معرف', False)
                ]
            },
            {
                'text_ar': 'بسّط: x³ × x²',
                'text_en': 'Simplify: x³ × x²',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('x⁵', True),
                    ('x⁶', False),
                    ('x', False),
                    ('2x⁵', False)
                ]
            },
            {
                'text_ar': 'احسب: (2²)³',
                'text_en': 'Calculate: (2²)³',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('64', True),
                    ('32', False),
                    ('16', False),
                    ('128', False)
                ]
            },
            {
                'text_ar': 'بسّط: x⁶ ÷ x²',
                'text_en': 'Simplify: x⁶ ÷ x²',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('x⁴', True),
                    ('x³', False),
                    ('x⁸', False),
                    ('x²', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_square_roots_exercises(self, lesson):
        """ID 1756: Square Roots"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Square Roots',
            title_arabic='الجذور التربيعية',
            description='Exercises on square root calculations and properties',
            difficulty_level='intermediate',
            estimated_duration=25,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'احسب: √16',
                'text_en': 'Calculate: √16',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('4', True),
                    ('8', False),
                    ('2', False),
                    ('6', False)
                ]
            },
            {
                'text_ar': 'ما هي قيمة: √49?',
                'text_en': 'What is the value of: √49?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('7', True),
                    ('24.5', False),
                    ('14', False),
                    ('6', False)
                ]
            },
            {
                'text_ar': 'بسّط: √(4 × 9)',
                'text_en': 'Simplify: √(4 × 9)',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('6', True),
                    ('13', False),
                    ('36', False),
                    ('5', False)
                ]
            },
            {
                'text_ar': 'احسب: √100 + √25',
                'text_en': 'Calculate: √100 + √25',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('15', True),
                    ('125', False),
                    ('√125', False),
                    ('10', False)
                ]
            },
            {
                'text_ar': 'ما هو: (√5)²?',
                'text_en': 'What is: (√5)²?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('5', True),
                    ('25', False),
                    ('√5', False),
                    ('10', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_pythagoras_exercises(self, lesson):
        """ID 1757: Pythagorean Theorem"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Pythagorean Theorem',
            title_arabic='مبرهنة فيثاغورس',
            description='Exercises on the Pythagorean theorem',
            difficulty_level='intermediate',
            estimated_duration=30,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'في مثلث قائم الزاوية، إذا كانت a = 3 وb = 4، ما هي قيمة الوتر c?',
                'text_en': 'In a right triangle, if a = 3 and b = 4, what is the hypotenuse c?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('5', True),
                    ('7', False),
                    ('6', False),
                    ('8', False)
                ]
            },
            {
                'text_ar': 'ما هي صيغة مبرهنة فيثاغورس؟',
                'text_en': 'What is the formula for the Pythagorean theorem?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('a² + b² = c²', True),
                    ('a + b = c', False),
                    ('a² - b² = c²', False),
                    ('a × b = c', False)
                ]
            },
            {
                'text_ar': 'في مثلث قائم، إذا كان الوتر = 13 وأحد الضلعين = 5، ما قيمة الضلع الآخر؟',
                'text_en': 'In a right triangle, if hypotenuse = 13 and one side = 5, what is the other side?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('12', True),
                    ('8', False),
                    ('18', False),
                    ('10', False)
                ]
            },
            {
                'text_ar': 'مثلث أضلاعه 5، 12، 13. هل هو مثلث قائم؟',
                'text_en': 'A triangle has sides 5, 12, 13. Is it a right triangle?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('نعم / Yes', True),
                    ('لا / No', False),
                    ('لا يمكن التحديد / Cannot determine', False),
                    ('يحتاج معلومات إضافية / Needs more info', False)
                ]
            },
            {
                'text_ar': 'في مثلث قائم الزاوية متساوي الساقين، إذا كان طول كل ساق 1، ما طول الوتر؟',
                'text_en': 'In an isosceles right triangle, if each leg is 1, what is the hypotenuse?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('√2', True),
                    ('2', False),
                    ('1', False),
                    ('√3', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_order_operations_exercises(self, lesson):
        """ID 1758: Order and Operations"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Order and Operations',
            title_arabic='الترتيب والعمليات',
            description='Exercises on order of operations',
            difficulty_level='beginner',
            estimated_duration=20,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'احسب: 2 + 3 × 4',
                'text_en': 'Calculate: 2 + 3 × 4',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('14', True),
                    ('20', False),
                    ('24', False),
                    ('11', False)
                ]
            },
            {
                'text_ar': 'ما هو ترتيب العمليات الصحيح؟',
                'text_en': 'What is the correct order of operations?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الأقواس، الأسس، الضرب والقسمة، الجمع والطرح', True),
                    ('الجمع، الطرح، الضرب، القسمة', False),
                    ('من اليسار لليمين فقط', False),
                    ('الضرب، الجمع، القسمة، الطرح', False)
                ]
            },
            {
                'text_ar': 'احسب: (5 + 3) × 2',
                'text_en': 'Calculate: (5 + 3) × 2',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('16', True),
                    ('11', False),
                    ('13', False),
                    ('10', False)
                ]
            },
            {
                'text_ar': 'قارن: 5 × 2 + 3 مع 5 × (2 + 3)',
                'text_en': 'Compare: 5 × 2 + 3 with 5 × (2 + 3)',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('13 و 25', True),
                    ('كلاهما 25', False),
                    ('كلاهما 13', False),
                    ('25 و 13', False)
                ]
            },
            {
                'text_ar': 'احسب: 20 ÷ 4 + 3 × 2',
                'text_en': 'Calculate: 20 ÷ 4 + 3 × 2',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('11', True),
                    ('14', False),
                    ('8', False),
                    ('26', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_thales_exercises(self, lesson):
        """ID 1759: Thales Theorem"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Thales Theorem',
            title_arabic='مبرهنة طاليس',
            description='Exercises on Thales\' theorem',
            difficulty_level='intermediate',
            estimated_duration=30,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'ما هو شرط تطبيق مبرهنة طاليس؟',
                'text_en': 'What is the condition for applying Thales\' theorem?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('أن يكون الخطان متوازيان', True),
                    ('أن يكون المثلث قائم الزاوية', False),
                    ('أن تكون الأضلاع متساوية', False),
                    ('أن يكون المثلث متساوي الساقين', False)
                ]
            },
            {
                'text_ar': 'إذا كان BC // DE، AB = 6، AD = 2، AC = 9، ما قيمة AE؟',
                'text_en': 'If BC // DE, AB = 6, AD = 2, AC = 9, what is AE?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('3', True),
                    ('4', False),
                    ('5', False),
                    ('6', False)
                ]
            },
            {
                'text_ar': 'في مبرهنة طاليس، النسبة بين أضلاع المثلثين تكون:',
                'text_en': 'In Thales\' theorem, the ratio between sides of triangles is:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('متساوية / Equal', True),
                    ('مختلفة / Different', False),
                    ('عشوائية / Random', False),
                    ('لا علاقة بينها / No relation', False)
                ]
            },
            {
                'text_ar': 'إذا كانت DE // BC وكان AD/DB = AE/EC، فإن المثلثان ADE وABC:',
                'text_en': 'If DE // BC and AD/DB = AE/EC, then triangles ADE and ABC are:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('متشابهان / Similar', True),
                    ('متطابقان / Congruent', False),
                    ('قائما الزاوية / Right-angled', False),
                    ('متساويا الساقين / Isosceles', False)
                ]
            },
            {
                'text_ar': 'مبرهنة طاليس تُستخدم في:',
                'text_en': 'Thales\' theorem is used in:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('حساب الأطوال في الأشكال المتشابهة', True),
                    ('إثبات توازي مستقيمين', True),
                    ('حساب مساحات المثلثات', False),
                    ('إيجاد قياس الزوايا', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_right_triangle_exercises(self, lesson):
        """ID 1760: Right Triangle"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Right Triangle Properties',
            title_arabic='خصائص المثلث القائم',
            description='Exercises on right triangle properties',
            difficulty_level='intermediate',
            estimated_duration=25,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'ما هو مجموع زوايا المثلث القائم؟',
                'text_en': 'What is the sum of angles in a right triangle?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('180°', True),
                    ('90°', False),
                    ('270°', False),
                    ('360°', False)
                ]
            },
            {
                'text_ar': 'في مثلث قائم الزاوية، ما قياس الزاويتين الحادتين مجتمعتين؟',
                'text_en': 'In a right triangle, what is the sum of the two acute angles?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('90°', True),
                    ('180°', False),
                    ('45°', False),
                    ('60°', False)
                ]
            },
            {
                'text_ar': 'الضلع الأطول في المثلث القائم يسمى:',
                'text_en': 'The longest side in a right triangle is called:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الوتر / Hypotenuse', True),
                    ('الساق / Leg', False),
                    ('القاعدة / Base', False),
                    ('الارتفاع / Height', False)
                ]
            },
            {
                'text_ar': 'إذا كانت زاوية في مثلث قائم = 30°، ما قياس الزاوية الأخرى (غير القائمة)؟',
                'text_en': 'If one angle in a right triangle is 30°, what is the other acute angle?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('60°', True),
                    ('90°', False),
                    ('45°', False),
                    ('30°', False)
                ]
            },
            {
                'text_ar': 'الوتر في المثلث القائم يقع مقابل:',
                'text_en': 'The hypotenuse in a right triangle is opposite to:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الزاوية القائمة / Right angle', True),
                    ('الزاوية الحادة / Acute angle', False),
                    ('أي زاوية / Any angle', False),
                    ('القاعدة / Base', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_trigonometry_exercises(self, lesson):
        """ID 1761: Trigonometric Calculations"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Trigonometric Calculations',
            title_arabic='الحسابات المثلثية',
            description='Basic trigonometry exercises',
            difficulty_level='intermediate',
            estimated_duration=30,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'ما هي قيمة sin(90°)?',
                'text_en': 'What is the value of sin(90°)?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('1', True),
                    ('0', False),
                    ('0.5', False),
                    ('undefined / غير معرف', False)
                ]
            },
            {
                'text_ar': 'في مثلث قائم، sin(θ) يساوي:',
                'text_en': 'In a right triangle, sin(θ) equals:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الضلع المقابل / الوتر', True),
                    ('الضلع المجاور / الوتر', False),
                    ('الوتر / الضلع المقابل', False),
                    ('الضلع المقابل / الضلع المجاور', False)
                ]
            },
            {
                'text_ar': 'ما قيمة cos(0°)?',
                'text_en': 'What is the value of cos(0°)?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('1', True),
                    ('0', False),
                    ('0.5', False),
                    ('-1', False)
                ]
            },
            {
                'text_ar': 'tan(θ) يساوي:',
                'text_en': 'tan(θ) equals:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('sin(θ) / cos(θ)', True),
                    ('cos(θ) / sin(θ)', False),
                    ('sin(θ) × cos(θ)', False),
                    ('1 / sin(θ)', False)
                ]
            },
            {
                'text_ar': 'إذا كان sin(θ) = 0.5، ما قيمة θ (في النطاق 0° إلى 90°)?',
                'text_en': 'If sin(θ) = 0.5, what is θ (in range 0° to 90°)?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('30°', True),
                    ('45°', False),
                    ('60°', False),
                    ('90°', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_circle_angles_exercises(self, lesson):
        """ID 1762: Central and Inscribed Angles"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Central and Inscribed Angles in a Circle',
            title_arabic='الزوايا المركزية والمحيطية في الدائرة',
            description='Exercises on circle angles',
            difficulty_level='intermediate',
            estimated_duration=30,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'الزاوية المركزية في الدائرة هي:',
                'text_en': 'A central angle in a circle is:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('زاوية رأسها مركز الدائرة', True),
                    ('زاوية رأسها على المحيط', False),
                    ('زاوية قياسها 90°', False),
                    ('زاوية مماسية', False)
                ]
            },
            {
                'text_ar': 'إذا كانت الزاوية المركزية = 60°، ما قياس الزاوية المحيطية المقابلة لنفس القوس؟',
                'text_en': 'If the central angle = 60°, what is the inscribed angle subtending the same arc?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('30°', True),
                    ('60°', False),
                    ('120°', False),
                    ('90°', False)
                ]
            },
            {
                'text_ar': 'العلاقة بين الزاوية المركزية والزاوية المحيطية المقابلة لنفس القوس:',
                'text_en': 'The relationship between central and inscribed angles subtending the same arc:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الزاوية المركزية = ضعف الزاوية المحيطية', True),
                    ('متساويتان', False),
                    ('الزاوية المحيطية = ضعف الزاوية المركزية', False),
                    ('لا علاقة بينهما', False)
                ]
            },
            {
                'text_ar': 'زاوية محيطية محصورة بين قطر ونقطة على المحيط تساوي:',
                'text_en': 'An inscribed angle subtended by a diameter equals:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('90°', True),
                    ('180°', False),
                    ('45°', False),
                    ('60°', False)
                ]
            },
            {
                'text_ar': 'إذا كانت زاوية محيطية = 45°، ما قياس الزاوية المركزية المقابلة لنفس القوس؟',
                'text_en': 'If an inscribed angle = 45°, what is the central angle subtending the same arc?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('90°', True),
                    ('45°', False),
                    ('22.5°', False),
                    ('135°', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_questions(self, exercise, questions):
        """Helper method to create questions and choices"""
        for idx, q_data in enumerate(questions, 1):
            question = Question.objects.create(
                exercise=exercise,
                question_text=f"{q_data['text_en']} / {q_data['text_ar']}",
                question_text_arabic=q_data['text_ar'],
                question_type=q_data['type'],
                points=q_data['points'],
                order=idx
            )

            for choice_idx, (choice_text, is_correct) in enumerate(q_data['choices'], 1):
                QuestionChoice.objects.create(
                    question=question,
                    choice_text=choice_text,
                    is_correct=is_correct,
                    order=choice_idx
                )
