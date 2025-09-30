from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Concentration and electrolytic solutions - Lesson ID: 132'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=132)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Solution Concentration Concepts',
                    'title_arabic': 'مفاهيم تركيز المحاليل',
                    'description': 'Understanding different ways to express solution concentration',
                    'description_arabic': 'فهم الطرق المختلفة للتعبير عن تركيز المحاليل',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is a solution?',
                            'question_text_arabic': 'ما هو المحلول؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'A homogeneous mixture of two or more substances', 'choice_text_arabic': 'خليط متجانس من مادتين أو أكثر', 'is_correct': True},
                                {'choice_text': 'A pure substance with one component', 'choice_text_arabic': 'مادة نقية ذات مكون واحد', 'is_correct': False},
                                {'choice_text': 'A heterogeneous mixture', 'choice_text_arabic': 'خليط غير متجانس', 'is_correct': False},
                                {'choice_text': 'A chemical compound', 'choice_text_arabic': 'مركب كيميائي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are the two main components of a solution?',
                            'question_text_arabic': 'ما المكونان الرئيسيان للمحلول؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Solute and solvent', 'choice_text_arabic': 'المذاب والمذيب', 'is_correct': True},
                                {'choice_text': 'Acid and base', 'choice_text_arabic': 'حمض وقاعدة', 'is_correct': False},
                                {'choice_text': 'Cation and anion', 'choice_text_arabic': 'كاتيون وأنيون', 'is_correct': False},
                                {'choice_text': 'Reactant and product', 'choice_text_arabic': 'متفاعل وناتج', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which is the solvent in a salt water solution?',
                            'question_text_arabic': 'أيهما المذيب في محلول الماء المالح؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Water', 'choice_text_arabic': 'الماء', 'is_correct': True},
                                {'choice_text': 'Salt', 'choice_text_arabic': 'الملح', 'is_correct': False},
                                {'choice_text': 'Both equally', 'choice_text_arabic': 'كلاهما بالتساوي', 'is_correct': False},
                                {'choice_text': 'Neither', 'choice_text_arabic': 'لا شيء منهما', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What does concentration measure?',
                            'question_text_arabic': 'ماذا يقيس التركيز؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The amount of solute in a given amount of solution', 'choice_text_arabic': 'كمية المذاب في كمية معينة من المحلول', 'is_correct': True},
                                {'choice_text': 'The total volume of the solution', 'choice_text_arabic': 'الحجم الكلي للمحلول', 'is_correct': False},
                                {'choice_text': 'The temperature of the solution', 'choice_text_arabic': 'درجة حرارة المحلول', 'is_correct': False},
                                {'choice_text': 'The color intensity of the solution', 'choice_text_arabic': 'شدة لون المحلول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A concentrated solution contains a large amount of solute.',
                            'question_text_arabic': 'المحلول المركز يحتوي على كمية كبيرة من المذاب.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Molarity and Molar Concentration',
                    'title_arabic': 'المولارية والتركيز المولي',
                    'description': 'Calculating and using molarity in solution chemistry',
                    'description_arabic': 'حساب واستخدام المولارية في كيمياء المحاليل',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is molarity?',
                            'question_text_arabic': 'ما هي المولارية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Moles of solute per liter of solution', 'choice_text_arabic': 'مولات المذاب لكل لتر من المحلول', 'is_correct': True},
                                {'choice_text': 'Moles of solute per kilogram of solvent', 'choice_text_arabic': 'مولات المذاب لكل كيلوجرام من المذيب', 'is_correct': False},
                                {'choice_text': 'Grams of solute per liter of solution', 'choice_text_arabic': 'جرامات المذاب لكل لتر من المحلول', 'is_correct': False},
                                {'choice_text': 'Percentage of solute by mass', 'choice_text_arabic': 'نسبة المذاب بالكتلة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the symbol for molarity?',
                            'question_text_arabic': 'ما رمز المولارية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'M', 'choice_text_arabic': 'M', 'is_correct': True},
                                {'choice_text': 'm', 'choice_text_arabic': 'm', 'is_correct': False},
                                {'choice_text': 'C', 'choice_text_arabic': 'C', 'is_correct': False},
                                {'choice_text': 'mol', 'choice_text_arabic': 'mol', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Calculate the molarity of a solution containing 0.5 mol of NaCl in 2 L of solution',
                            'question_text_arabic': 'احسب مولارية محلول يحتوي على 0.5 مول من NaCl في 2 لتر من المحلول',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '0.25 M', 'choice_text_arabic': '0.25 مولاري', 'is_correct': True},
                                {'choice_text': '1.0 M', 'choice_text_arabic': '1.0 مولاري', 'is_correct': False},
                                {'choice_text': '2.5 M', 'choice_text_arabic': '2.5 مولاري', 'is_correct': False},
                                {'choice_text': '4.0 M', 'choice_text_arabic': '4.0 مولاري', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How many moles of solute are in 500 mL of 0.1 M solution?',
                            'question_text_arabic': 'كم مولاً من المذاب في 500 مليلتر من محلول 0.1 مولاري؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '0.05 mol', 'choice_text_arabic': '0.05 مول', 'is_correct': True},
                                {'choice_text': '0.1 mol', 'choice_text_arabic': '0.1 مول', 'is_correct': False},
                                {'choice_text': '0.5 mol', 'choice_text_arabic': '0.5 مول', 'is_correct': False},
                                {'choice_text': '50 mol', 'choice_text_arabic': '50 مول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What mass of glucose (C₆H₁₂O₆, MW = 180 g/mol) is needed to prepare 1 L of 0.1 M solution?',
                            'question_text_arabic': 'ما كتلة الجلوكوز (C₆H₁₂O₆، الوزن الجزيئي = 180 جم/مول) المطلوبة لتحضير 1 لتر من محلول 0.1 مولاري؟',
                            'question_type': 'open_short',
                            'correct_answer': '18 g'
                        }
                    ]
                },
                {
                    'title': 'Solution Preparation and Dilution',
                    'title_arabic': 'تحضير المحاليل والتخفيف',
                    'description': 'Preparing solutions of specific concentrations and dilution calculations',
                    'description_arabic': 'تحضير محاليل بتراكيز محددة وحسابات التخفيف',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the general procedure for preparing a solution?',
                            'question_text_arabic': 'ما الإجراء العام لتحضير محلول؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Dissolve solute in small amount of solvent, then dilute to final volume', 'choice_text_arabic': 'أذب المذاب في كمية صغيرة من المذيب، ثم خفف إلى الحجم النهائي', 'is_correct': True},
                                {'choice_text': 'Add solute directly to the final volume of solvent', 'choice_text_arabic': 'أضف المذاب مباشرة إلى الحجم النهائي من المذيب', 'is_correct': False},
                                {'choice_text': 'Mix solute and solvent in any order', 'choice_text_arabic': 'اخلط المذاب والمذيب بأي ترتيب', 'is_correct': False},
                                {'choice_text': 'Heat the solvent first, then add solute', 'choice_text_arabic': 'سخن المذيب أولاً، ثم أضف المذاب', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the dilution equation?',
                            'question_text_arabic': 'ما معادلة التخفيف؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'M₁V₁ = M₂V₂', 'choice_text_arabic': 'M₁V₁ = M₂V₂', 'is_correct': True},
                                {'choice_text': 'M₁ + V₁ = M₂ + V₂', 'choice_text_arabic': 'M₁ + V₁ = M₂ + V₂', 'is_correct': False},
                                {'choice_text': 'M₁/V₁ = M₂/V₂', 'choice_text_arabic': 'M₁/V₁ = M₂/V₂', 'is_correct': False},
                                {'choice_text': 'M₁ - M₂ = V₂ - V₁', 'choice_text_arabic': 'M₁ - M₂ = V₂ - V₁', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How much water should be added to 100 mL of 2 M solution to make it 0.5 M?',
                            'question_text_arabic': 'كم من الماء يجب إضافته إلى 100 مليلتر من محلول 2 مولاري لجعله 0.5 مولاري؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '300 mL', 'choice_text_arabic': '300 مليلتر', 'is_correct': True},
                                {'choice_text': '400 mL', 'choice_text_arabic': '400 مليلتر', 'is_correct': False},
                                {'choice_text': '200 mL', 'choice_text_arabic': '200 مليلتر', 'is_correct': False},
                                {'choice_text': '150 mL', 'choice_text_arabic': '150 مليلتر', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What equipment is most accurate for measuring solution volumes?',
                            'question_text_arabic': 'أي معدات هي الأكثر دقة لقياس أحجام المحاليل؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Volumetric flask', 'choice_text_arabic': 'دورق المعايرة', 'is_correct': True},
                                {'choice_text': 'Beaker', 'choice_text_arabic': 'كأس زجاجي', 'is_correct': False},
                                {'choice_text': 'Erlenmeyer flask', 'choice_text_arabic': 'دورق مخروطي', 'is_correct': False},
                                {'choice_text': 'Test tube', 'choice_text_arabic': 'أنبوب اختبار', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'When diluting acid solutions, always add acid to water, never water to acid.',
                            'question_text_arabic': 'عند تخفيف محاليل الأحماض، أضف دائماً الحمض إلى الماء، وليس الماء إلى الحمض.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Electrolytic Solutions and Conductivity',
                    'title_arabic': 'المحاليل الإلكتروليتية والتوصيل',
                    'description': 'Understanding electrolytes and their behavior in solution',
                    'description_arabic': 'فهم الإلكتروليتات وسلوكها في المحلول',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is an electrolyte?',
                            'question_text_arabic': 'ما هو الإلكتروليت؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'A substance that conducts electricity when dissolved in water', 'choice_text_arabic': 'مادة توصل الكهرباء عند ذوبانها في الماء', 'is_correct': True},
                                {'choice_text': 'A substance that does not dissolve in water', 'choice_text_arabic': 'مادة لا تذوب في الماء', 'is_correct': False},
                                {'choice_text': 'A substance that changes color in solution', 'choice_text_arabic': 'مادة تغير لونها في المحلول', 'is_correct': False},
                                {'choice_text': 'A substance that only dissolves in organic solvents', 'choice_text_arabic': 'مادة تذوب فقط في المذيبات العضوية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What makes a solution conductive?',
                            'question_text_arabic': 'ما الذي يجعل المحلول موصلاً؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The presence of mobile ions', 'choice_text_arabic': 'وجود أيونات متحركة', 'is_correct': True},
                                {'choice_text': 'High temperature', 'choice_text_arabic': 'درجة حرارة عالية', 'is_correct': False},
                                {'choice_text': 'High pressure', 'choice_text_arabic': 'ضغط عالي', 'is_correct': False},
                                {'choice_text': 'Presence of molecules only', 'choice_text_arabic': 'وجود جزيئات فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which are examples of strong electrolytes?',
                            'question_text_arabic': 'أي منها أمثلة على الإلكتروليتات القوية؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'NaCl (sodium chloride)', 'choice_text_arabic': 'NaCl (كلوريد الصوديوم)', 'is_correct': True},
                                {'choice_text': 'HCl (hydrochloric acid)', 'choice_text_arabic': 'HCl (حمض الهيدروكلوريك)', 'is_correct': True},
                                {'choice_text': 'KOH (potassium hydroxide)', 'choice_text_arabic': 'KOH (هيدروكسيد البوتاسيوم)', 'is_correct': True},
                                {'choice_text': 'Glucose (C₆H₁₂O₆)', 'choice_text_arabic': 'الجلوكوز (C₆H₁₂O₆)', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the difference between strong and weak electrolytes?',
                            'question_text_arabic': 'ما الفرق بين الإلكتروليتات القوية والضعيفة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Strong electrolytes ionize completely; weak electrolytes ionize partially', 'choice_text_arabic': 'الإلكتروليتات القوية تتأين بالكامل؛ الضعيفة تتأين جزئياً', 'is_correct': True},
                                {'choice_text': 'Strong electrolytes are acids; weak electrolytes are bases', 'choice_text_arabic': 'الإلكتروليتات القوية أحماض؛ الضعيفة قواعد', 'is_correct': False},
                                {'choice_text': 'Strong electrolytes are soluble; weak electrolytes are insoluble', 'choice_text_arabic': 'الإلكتروليتات القوية قابلة للذوبان؛ الضعيفة غير قابلة للذوبان', 'is_correct': False},
                                {'choice_text': 'Strong electrolytes have higher molecular mass', 'choice_text_arabic': 'الإلكتروليتات القوية لها كتلة جزيئية أعلى', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Calculate the number of ions produced when 1 mol of Al₂(SO₄)₃ completely dissociates',
                            'question_text_arabic': 'احسب عدد الأيونات المنتجة عند تفكك 1 مول من Al₂(SO₄)₃ بالكامل',
                            'question_type': 'open_short',
                            'correct_answer': '5 mol ions'
                        }
                    ]
                },
                {
                    'title': 'Colligative Properties',
                    'title_arabic': 'الخصائص الجماعية',
                    'description': 'Understanding how dissolved particles affect solution properties',
                    'description_arabic': 'فهم كيف تؤثر الجسيمات المذابة على خصائص المحلول',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What are colligative properties?',
                            'question_text_arabic': 'ما هي الخصائص الجماعية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Properties that depend on the number of dissolved particles, not their identity', 'choice_text_arabic': 'خصائص تعتمد على عدد الجسيمات المذابة، وليس هويتها', 'is_correct': True},
                                {'choice_text': 'Properties that depend on the type of solute only', 'choice_text_arabic': 'خصائص تعتمد على نوع المذاب فقط', 'is_correct': False},
                                {'choice_text': 'Properties that remain constant in all solutions', 'choice_text_arabic': 'خصائص تبقى ثابتة في جميع المحاليل', 'is_correct': False},
                                {'choice_text': 'Properties that only occur in ionic solutions', 'choice_text_arabic': 'خصائص تحدث فقط في المحاليل الأيونية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which are examples of colligative properties?',
                            'question_text_arabic': 'أي منها أمثلة على الخصائص الجماعية؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Boiling point elevation', 'choice_text_arabic': 'ارتفاع نقطة الغليان', 'is_correct': True},
                                {'choice_text': 'Freezing point depression', 'choice_text_arabic': 'انخفاض نقطة التجمد', 'is_correct': True},
                                {'choice_text': 'Osmotic pressure', 'choice_text_arabic': 'الضغط الأسموزي', 'is_correct': True},
                                {'choice_text': 'Electrical conductivity', 'choice_text_arabic': 'التوصيل الكهربائي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Why does salt lower the freezing point of water?',
                            'question_text_arabic': 'لماذا يخفض الملح نقطة تجمد الماء؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Dissolved ions interfere with ice crystal formation', 'choice_text_arabic': 'الأيونات المذابة تتداخل مع تكوين بلورات الثلج', 'is_correct': True},
                                {'choice_text': 'Salt generates heat when dissolved', 'choice_text_arabic': 'الملح ينتج حرارة عند الذوبان', 'is_correct': False},
                                {'choice_text': 'Salt changes the chemical composition of water', 'choice_text_arabic': 'الملح يغير التركيب الكيميائي للماء', 'is_correct': False},
                                {'choice_text': 'Salt increases the density of water', 'choice_text_arabic': 'الملح يزيد كثافة الماء', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which solution would have the lowest freezing point?',
                            'question_text_arabic': 'أي محلول سيكون له أدنى نقطة تجمد؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '1 M CaCl₂ (produces 3 ions per formula unit)', 'choice_text_arabic': '1 مولاري CaCl₂ (ينتج 3 أيونات لكل وحدة صيغة)', 'is_correct': True},
                                {'choice_text': '1 M NaCl (produces 2 ions per formula unit)', 'choice_text_arabic': '1 مولاري NaCl (ينتج 2 أيون لكل وحدة صيغة)', 'is_correct': False},
                                {'choice_text': '1 M glucose (molecular compound)', 'choice_text_arabic': '1 مولاري جلوكوز (مركب جزيئي)', 'is_correct': False},
                                {'choice_text': 'Pure water', 'choice_text_arabic': 'ماء نقي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Osmosis is the movement of solvent through a semipermeable membrane.',
                            'question_text_arabic': 'الأسموزية هي حركة المذيب عبر غشاء نصف نفاذ.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
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
                    f'Successfully created for Lesson 132 (Concentration and electrolytic solutions):\\n'
                    f'Exercises: {total_exercises}\\n'
                    f'Questions: {total_questions}\\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 132 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )