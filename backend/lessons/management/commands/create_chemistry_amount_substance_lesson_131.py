from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Physical quantities related to the amount of substance - Lesson ID: 131'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=131)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'The Mole Concept',
                    'title_arabic': 'مفهوم المول',
                    'description': 'Understanding the mole as a fundamental unit for counting particles',
                    'description_arabic': 'فهم المول كوحدة أساسية لعد الجسيمات',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is a mole?',
                            'question_text_arabic': 'ما هو المول؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The amount of substance containing 6.022 × 10²³ particles', 'choice_text_arabic': 'كمية المادة التي تحتوي على 6.022 × 10²³ جسيماً', 'is_correct': True},
                                {'choice_text': 'A unit of mass equal to 1 gram', 'choice_text_arabic': 'وحدة كتلة تساوي 1 جرام', 'is_correct': False},
                                {'choice_text': 'A unit of volume equal to 1 liter', 'choice_text_arabic': 'وحدة حجم تساوي 1 لتر', 'is_correct': False},
                                {'choice_text': 'The number of atoms in 1 kg of carbon', 'choice_text_arabic': 'عدد الذرات في 1 كيلوجرام من الكربون', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is Avogadro\'s number?',
                            'question_text_arabic': 'ما هو عدد أفوجادرو؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '6.022 × 10²³', 'choice_text_arabic': '6.022 × 10²³', 'is_correct': True},
                                {'choice_text': '6.022 × 10²²', 'choice_text_arabic': '6.022 × 10²²', 'is_correct': False},
                                {'choice_text': '6.022 × 10²⁴', 'choice_text_arabic': '6.022 × 10²⁴', 'is_correct': False},
                                {'choice_text': '1.602 × 10⁻¹⁹', 'choice_text_arabic': '1.602 × 10⁻¹⁹', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How many oxygen atoms are in 1 mole of O₂?',
                            'question_text_arabic': 'كم ذرة أكسجين في 1 مول من O₂؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '2 × 6.022 × 10²³', 'choice_text_arabic': '2 × 6.022 × 10²³', 'is_correct': True},
                                {'choice_text': '6.022 × 10²³', 'choice_text_arabic': '6.022 × 10²³', 'is_correct': False},
                                {'choice_text': '32 × 6.022 × 10²³', 'choice_text_arabic': '32 × 6.022 × 10²³', 'is_correct': False},
                                {'choice_text': '16 × 6.022 × 10²³', 'choice_text_arabic': '16 × 6.022 × 10²³', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the molar mass of carbon-12?',
                            'question_text_arabic': 'ما الكتلة المولية للكربون-12؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '12 g/mol', 'choice_text_arabic': '12 جم/مول', 'is_correct': True},
                                {'choice_text': '6 g/mol', 'choice_text_arabic': '6 جم/مول', 'is_correct': False},
                                {'choice_text': '24 g/mol', 'choice_text_arabic': '24 جم/مول', 'is_correct': False},
                                {'choice_text': '1 g/mol', 'choice_text_arabic': '1 جم/مول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'One mole of any gas at STP occupies 22.4 L.',
                            'question_text_arabic': 'مول واحد من أي غاز في الظروف المعيارية يشغل 22.4 لتر.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Molar Mass and Molecular Mass',
                    'title_arabic': 'الكتلة المولية والكتلة الجزيئية',
                    'description': 'Calculating molar masses and understanding the relationship with molecular mass',
                    'description_arabic': 'حساب الكتل المولية وفهم العلاقة مع الكتلة الجزيئية',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is molar mass?',
                            'question_text_arabic': 'ما هي الكتلة المولية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The mass of one mole of a substance in grams', 'choice_text_arabic': 'كتلة مول واحد من المادة بالجرامات', 'is_correct': True},
                                {'choice_text': 'The mass of one molecule in grams', 'choice_text_arabic': 'كتلة جزيء واحد بالجرامات', 'is_correct': False},
                                {'choice_text': 'The total mass of all atoms in a molecule', 'choice_text_arabic': 'الكتلة الكلية لجميع الذرات في الجزيء', 'is_correct': False},
                                {'choice_text': 'The mass of one atom in atomic mass units', 'choice_text_arabic': 'كتلة ذرة واحدة بوحدات الكتلة الذرية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Calculate the molar mass of H₂SO₄ (H=1, S=32, O=16 g/mol)',
                            'question_text_arabic': 'احسب الكتلة المولية لـ H₂SO₄ (H=1, S=32, O=16 جم/مول)',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '98 g/mol', 'choice_text_arabic': '98 جم/مول', 'is_correct': True},
                                {'choice_text': '49 g/mol', 'choice_text_arabic': '49 جم/مول', 'is_correct': False},
                                {'choice_text': '82 g/mol', 'choice_text_arabic': '82 جم/مول', 'is_correct': False},
                                {'choice_text': '114 g/mol', 'choice_text_arabic': '114 جم/مول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How many moles are in 180 g of glucose (C₆H₁₂O₆, molar mass = 180 g/mol)?',
                            'question_text_arabic': 'كم مولاً في 180 جرام من الجلوكوز (C₆H₁₂O₆، الكتلة المولية = 180 جم/مول)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '1 mol', 'choice_text_arabic': '1 مول', 'is_correct': True},
                                {'choice_text': '0.5 mol', 'choice_text_arabic': '0.5 مول', 'is_correct': False},
                                {'choice_text': '2 mol', 'choice_text_arabic': '2 مول', 'is_correct': False},
                                {'choice_text': '180 mol', 'choice_text_arabic': '180 مول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the relationship between atomic mass (in amu) and molar mass (in g/mol)?',
                            'question_text_arabic': 'ما العلاقة بين الكتلة الذرية (بوحدة amu) والكتلة المولية (بجم/مول)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'They are numerically equal', 'choice_text_arabic': 'متساويان عددياً', 'is_correct': True},
                                {'choice_text': 'Molar mass is 1000 times larger', 'choice_text_arabic': 'الكتلة المولية أكبر بـ 1000 مرة', 'is_correct': False},
                                {'choice_text': 'Atomic mass is 12 times larger', 'choice_text_arabic': 'الكتلة الذرية أكبر بـ 12 مرة', 'is_correct': False},
                                {'choice_text': 'There is no relationship', 'choice_text_arabic': 'لا توجد علاقة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Calculate the mass of 0.25 mol of calcium carbonate (CaCO₃, molar mass = 100 g/mol)',
                            'question_text_arabic': 'احسب كتلة 0.25 مول من كربونات الكالسيوم (CaCO₃، الكتلة المولية = 100 جم/مول)',
                            'question_type': 'open_short',
                            'correct_answer': '25 g'
                        }
                    ]
                },
                {
                    'title': 'Gas Laws and Molar Volume',
                    'title_arabic': 'قوانين الغازات والحجم المولي',
                    'description': 'Understanding the relationship between amount of gas and volume',
                    'description_arabic': 'فهم العلاقة بين كمية الغاز والحجم',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the molar volume of a gas at STP?',
                            'question_text_arabic': 'ما الحجم المولي للغاز في الظروف المعيارية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '22.4 L/mol', 'choice_text_arabic': '22.4 لتر/مول', 'is_correct': True},
                                {'choice_text': '24.5 L/mol', 'choice_text_arabic': '24.5 لتر/مول', 'is_correct': False},
                                {'choice_text': '11.2 L/mol', 'choice_text_arabic': '11.2 لتر/مول', 'is_correct': False},
                                {'choice_text': '44.8 L/mol', 'choice_text_arabic': '44.8 لتر/مول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are the standard conditions (STP)?',
                            'question_text_arabic': 'ما هي الظروف المعيارية (STP)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '0°C and 1 atm pressure', 'choice_text_arabic': '0°س وضغط 1 جو', 'is_correct': True},
                                {'choice_text': '25°C and 1 atm pressure', 'choice_text_arabic': '25°س وضغط 1 جو', 'is_correct': False},
                                {'choice_text': '0°C and 2 atm pressure', 'choice_text_arabic': '0°س وضغط 2 جو', 'is_correct': False},
                                {'choice_text': '100°C and 1 atm pressure', 'choice_text_arabic': '100°س وضغط 1 جو', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How many liters does 2 mol of any gas occupy at STP?',
                            'question_text_arabic': 'كم لتراً يشغل 2 مول من أي غاز في الظروف المعيارية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '44.8 L', 'choice_text_arabic': '44.8 لتر', 'is_correct': True},
                                {'choice_text': '22.4 L', 'choice_text_arabic': '22.4 لتر', 'is_correct': False},
                                {'choice_text': '11.2 L', 'choice_text_arabic': '11.2 لتر', 'is_correct': False},
                                {'choice_text': '67.2 L', 'choice_text_arabic': '67.2 لتر', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which law states that equal volumes of gases at same temperature and pressure contain equal numbers of molecules?',
                            'question_text_arabic': 'أي قانون ينص على أن أحجاماً متساوية من الغازات عند نفس درجة الحرارة والضغط تحتوي على أعداد متساوية من الجزيئات؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Avogadro\'s Law', 'choice_text_arabic': 'قانون أفوجادرو', 'is_correct': True},
                                {'choice_text': 'Boyle\'s Law', 'choice_text_arabic': 'قانون بويل', 'is_correct': False},
                                {'choice_text': 'Charles\'s Law', 'choice_text_arabic': 'قانون تشارلز', 'is_correct': False},
                                {'choice_text': 'Gay-Lussac\'s Law', 'choice_text_arabic': 'قانون جاي-لوساك', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Calculate the number of moles in 11.2 L of CO₂ at STP',
                            'question_text_arabic': 'احسب عدد المولات في 11.2 لتر من CO₂ في الظروف المعيارية',
                            'question_type': 'open_short',
                            'correct_answer': '0.5 mol'
                        }
                    ]
                },
                {
                    'title': 'Empirical and Molecular Formulas',
                    'title_arabic': 'الصيغ الجزيئية والتجريبية',
                    'description': 'Determining empirical and molecular formulas from experimental data',
                    'description_arabic': 'تحديد الصيغ الجزيئية والتجريبية من البيانات التجريبية',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is an empirical formula?',
                            'question_text_arabic': 'ما هي الصيغة التجريبية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The simplest whole number ratio of atoms in a compound', 'choice_text_arabic': 'أبسط نسبة عددية صحيحة للذرات في المركب', 'is_correct': True},
                                {'choice_text': 'The actual number of atoms in a molecule', 'choice_text_arabic': 'العدد الفعلي للذرات في الجزيء', 'is_correct': False},
                                {'choice_text': 'The formula showing the structure of the molecule', 'choice_text_arabic': 'الصيغة التي تظهر تركيب الجزيء', 'is_correct': False},
                                {'choice_text': 'The formula based on percentage composition', 'choice_text_arabic': 'الصيغة المبنية على التركيب النسبي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A compound contains 40% carbon, 6.7% hydrogen, and 53.3% oxygen by mass. What is its empirical formula? (C=12, H=1, O=16)',
                            'question_text_arabic': 'مركب يحتوي على 40% كربون، 6.7% هيدروجين، و53.3% أكسجين بالكتلة. ما صيغته التجريبية؟ (C=12, H=1, O=16)',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'CH₂O', 'choice_text_arabic': 'CH₂O', 'is_correct': True},
                                {'choice_text': 'C₂H₄O₂', 'choice_text_arabic': 'C₂H₄O₂', 'is_correct': False},
                                {'choice_text': 'CHO', 'choice_text_arabic': 'CHO', 'is_correct': False},
                                {'choice_text': 'C₆H₁₂O₆', 'choice_text_arabic': 'C₆H₁₂O₆', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How do you determine molecular formula from empirical formula?',
                            'question_text_arabic': 'كيف تحدد الصيغة الجزيئية من الصيغة التجريبية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Multiply empirical formula by (molecular mass / empirical formula mass)', 'choice_text_arabic': 'اضرب الصيغة التجريبية في (الكتلة الجزيئية / كتلة الصيغة التجريبية)', 'is_correct': True},
                                {'choice_text': 'Add the molecular mass to the empirical formula', 'choice_text_arabic': 'أضف الكتلة الجزيئية إلى الصيغة التجريبية', 'is_correct': False},
                                {'choice_text': 'Divide molecular mass by empirical formula mass', 'choice_text_arabic': 'اقسم الكتلة الجزيئية على كتلة الصيغة التجريبية', 'is_correct': False},
                                {'choice_text': 'They are always the same', 'choice_text_arabic': 'هما دائماً نفس الشيء', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which compounds have the same empirical formula as their molecular formula?',
                            'question_text_arabic': 'أي مركبات لها نفس الصيغة التجريبية والجزيئية؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'H₂O', 'choice_text_arabic': 'H₂O', 'is_correct': True},
                                {'choice_text': 'NH₃', 'choice_text_arabic': 'NH₃', 'is_correct': True},
                                {'choice_text': 'CO₂', 'choice_text_arabic': 'CO₂', 'is_correct': True},
                                {'choice_text': 'C₂H₆', 'choice_text_arabic': 'C₂H₆', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A compound has empirical formula CH₂O and molecular mass 180 g/mol. What is its molecular formula? (CH₂O = 30 g/mol)',
                            'question_text_arabic': 'مركب له صيغة تجريبية CH₂O وكتلة جزيئية 180 جم/مول. ما صيغته الجزيئية؟ (CH₂O = 30 جم/مول)',
                            'question_type': 'open_short',
                            'correct_answer': 'C₆H₁₂O₆'
                        }
                    ]
                },
                {
                    'title': 'Stoichiometric Calculations',
                    'title_arabic': 'الحسابات الستكيومترية',
                    'description': 'Using molar quantities in chemical calculations and reactions',
                    'description_arabic': 'استخدام الكميات المولية في الحسابات والتفاعلات الكيميائية',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is stoichiometry?',
                            'question_text_arabic': 'ما هي الستكيومتريا؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The quantitative relationship between reactants and products in chemical reactions', 'choice_text_arabic': 'العلاقة الكمية بين المتفاعلات والنواتج في التفاعلات الكيميائية', 'is_correct': True},
                                {'choice_text': 'The study of atomic structure', 'choice_text_arabic': 'دراسة التركيب الذري', 'is_correct': False},
                                {'choice_text': 'The arrangement of electrons in atoms', 'choice_text_arabic': 'ترتيب الإلكترونات في الذرات', 'is_correct': False},
                                {'choice_text': 'The speed of chemical reactions', 'choice_text_arabic': 'سرعة التفاعلات الكيميائية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In the reaction 2H₂ + O₂ → 2H₂O, how many moles of water are produced from 3 moles of H₂?',
                            'question_text_arabic': 'في التفاعل 2H₂ + O₂ → 2H₂O، كم مولاً من الماء ينتج من 3 مولات من H₂؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '3 mol', 'choice_text_arabic': '3 مول', 'is_correct': True},
                                {'choice_text': '1.5 mol', 'choice_text_arabic': '1.5 مول', 'is_correct': False},
                                {'choice_text': '6 mol', 'choice_text_arabic': '6 مول', 'is_correct': False},
                                {'choice_text': '2 mol', 'choice_text_arabic': '2 مول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What information do you need for stoichiometric calculations?',
                            'question_text_arabic': 'ما المعلومات التي تحتاجها للحسابات الستكيومترية؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Balanced chemical equation', 'choice_text_arabic': 'معادلة كيميائية موزونة', 'is_correct': True},
                                {'choice_text': 'Molar masses of compounds', 'choice_text_arabic': 'الكتل المولية للمركبات', 'is_correct': True},
                                {'choice_text': 'Amount of starting material', 'choice_text_arabic': 'كمية المادة الأولية', 'is_correct': True},
                                {'choice_text': 'Temperature of reaction', 'choice_text_arabic': 'درجة حرارة التفاعل', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is a limiting reactant?',
                            'question_text_arabic': 'ما هو المتفاعل المحدد؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The reactant that is completely consumed first', 'choice_text_arabic': 'المتفاعل الذي يُستهلك بالكامل أولاً', 'is_correct': True},
                                {'choice_text': 'The reactant present in largest amount', 'choice_text_arabic': 'المتفاعل الموجود بأكبر كمية', 'is_correct': False},
                                {'choice_text': 'The reactant with highest molecular mass', 'choice_text_arabic': 'المتفاعل ذو أعلى كتلة جزيئية', 'is_correct': False},
                                {'choice_text': 'The reactant that reacts slowest', 'choice_text_arabic': 'المتفاعل الأبطأ في التفاعل', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Calculate the mass of CO₂ produced from burning 16 g of CH₄: CH₄ + 2O₂ → CO₂ + 2H₂O (CH₄ = 16 g/mol, CO₂ = 44 g/mol)',
                            'question_text_arabic': 'احسب كتلة CO₂ المنتجة من حرق 16 جم من CH₄: CH₄ + 2O₂ → CO₂ + 2H₂O (CH₄ = 16 جم/مول، CO₂ = 44 جم/مول)',
                            'question_type': 'open_short',
                            'correct_answer': '44 g'
                        }
                    ]
                }
            ]

            total_exercises = 0
            total_questions = 0
            total_choices = 0

            for ex_data in exercises_data:
                # Create exercise
                exercise = Exercise.objects.create(
                    lesson=lesson,
                    created_by_id=1,  # Assuming admin user with ID 1
                    title=ex_data['title'],
                    title_arabic=ex_data['title_arabic'],
                    description=ex_data['description'],
                    instructions=ex_data.get('description_arabic', ''),
                    difficulty_level=ex_data['difficulty'],
                    is_active=True
                )
                total_exercises += 1

                # Create questions for this exercise
                for q_data in ex_data['questions']:
                    question = Question.objects.create(
                        exercise=exercise,
                        question_text=q_data['question_text'],
                        question_text_arabic=q_data['question_text_arabic'],
                        question_type=q_data['question_type'],
                        points=10 if ex_data['difficulty'] == 'beginner' else 15 if ex_data['difficulty'] == 'intermediate' else 20
                    )
                    total_questions += 1

                    # Create choices for QCM questions
                    if q_data['question_type'] in ['qcm_single', 'qcm_multiple'] and 'choices' in q_data:
                        for choice_data in q_data['choices']:
                            QuestionChoice.objects.create(
                                question=question,
                                choice_text=choice_data['choice_text'],
                                choice_text_arabic=choice_data['choice_text_arabic'],
                                is_correct=choice_data['is_correct']
                            )
                            total_choices += 1

                    # Create choices for true/false questions
                    elif q_data['question_type'] == 'true_false':
                        correct_answer = q_data.get('correct_answer', 'True')
                        QuestionChoice.objects.create(
                            question=question,
                            choice_text='True',
                            choice_text_arabic='صواب',
                            is_correct=correct_answer == 'True'
                        )
                        QuestionChoice.objects.create(
                            question=question,
                            choice_text='False',
                            choice_text_arabic='خطأ',
                            is_correct=correct_answer == 'False'
                        )
                        total_choices += 2

                # Create rewards for exercise completion
                ExerciseReward.objects.create(
                    exercise=exercise,
                    completion_points=30 if ex_data['difficulty'] == 'beginner' else 50 if ex_data['difficulty'] == 'intermediate' else 70,
                    completion_coins=1,
                    perfect_score_bonus=20 if ex_data['difficulty'] == 'beginner' else 30 if ex_data['difficulty'] == 'intermediate' else 50
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created for Lesson 131 (Physical quantities related to the amount of substance):\\n'
                    f'Exercises: {total_exercises}\\n'
                    f'Questions: {total_questions}\\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 131 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )