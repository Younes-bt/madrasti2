from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Work and internal energy - Lesson ID: 127'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=127)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Internal Energy Concepts',
                    'title_arabic': 'مفاهيم الطاقة الداخلية',
                    'description': 'Understanding internal energy and its components in thermodynamic systems',
                    'description_arabic': 'فهم الطاقة الداخلية ومكوناتها في الأنظمة الحرارية الديناميكية',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is internal energy?',
                            'question_text_arabic': 'ما هي الطاقة الداخلية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The total energy contained within a system due to molecular motion and intermolecular forces', 'choice_text_arabic': 'الطاقة الكلية الموجودة داخل النظام بسبب الحركة الجزيئية والقوى بين الجزيئية', 'is_correct': True},
                                {'choice_text': 'Energy due to the system\'s position in a gravitational field', 'choice_text_arabic': 'الطاقة بسبب موضع النظام في المجال الجاذبي', 'is_correct': False},
                                {'choice_text': 'Energy stored in chemical bonds only', 'choice_text_arabic': 'الطاقة المخزونة في الروابط الكيميائية فقط', 'is_correct': False},
                                {'choice_text': 'Kinetic energy of the system as a whole', 'choice_text_arabic': 'الطاقة الحركية للنظام ككل', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What factors affect the internal energy of a gas?',
                            'question_text_arabic': 'ما العوامل التي تؤثر على الطاقة الداخلية للغاز؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Temperature', 'choice_text_arabic': 'درجة الحرارة', 'is_correct': True},
                                {'choice_text': 'Number of molecules', 'choice_text_arabic': 'عدد الجزيئات', 'is_correct': True},
                                {'choice_text': 'Type of gas molecules', 'choice_text_arabic': 'نوع جزيئات الغاز', 'is_correct': True},
                                {'choice_text': 'Container shape', 'choice_text_arabic': 'شكل الحاوية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'For an ideal gas, internal energy depends only on:',
                            'question_text_arabic': 'للغاز المثالي، الطاقة الداخلية تعتمد فقط على:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Temperature', 'choice_text_arabic': 'درجة الحرارة', 'is_correct': True},
                                {'choice_text': 'Pressure', 'choice_text_arabic': 'الضغط', 'is_correct': False},
                                {'choice_text': 'Volume', 'choice_text_arabic': 'الحجم', 'is_correct': False},
                                {'choice_text': 'Density', 'choice_text_arabic': 'الكثافة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the symbol commonly used for internal energy?',
                            'question_text_arabic': 'ما الرمز المستخدم عادة للطاقة الداخلية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'U', 'choice_text_arabic': 'U', 'is_correct': True},
                                {'choice_text': 'E', 'choice_text_arabic': 'E', 'is_correct': False},
                                {'choice_text': 'K', 'choice_text_arabic': 'K', 'is_correct': False},
                                {'choice_text': 'T', 'choice_text_arabic': 'T', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Internal energy can only be measured as absolute values.',
                            'question_text_arabic': 'الطاقة الداخلية يمكن قياسها فقط كقيم مطلقة.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        }
                    ]
                },
                {
                    'title': 'First Law of Thermodynamics',
                    'title_arabic': 'القانون الأول للديناميكا الحرارية',
                    'description': 'Understanding the relationship between work, heat, and internal energy',
                    'description_arabic': 'فهم العلاقة بين الشغل والحرارة والطاقة الداخلية',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What does the first law of thermodynamics state?',
                            'question_text_arabic': 'ماذا ينص القانون الأول للديناميكا الحرارية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'ΔU = Q - W (change in internal energy equals heat added minus work done by the system)', 'choice_text_arabic': 'ΔU = Q - W (التغير في الطاقة الداخلية يساوي الحرارة المضافة ناقص الشغل المبذول بواسطة النظام)', 'is_correct': True},
                                {'choice_text': 'Energy cannot be created or destroyed in any process', 'choice_text_arabic': 'الطاقة لا يمكن خلقها أو إفناؤها في أي عملية', 'is_correct': False},
                                {'choice_text': 'Heat always flows from hot to cold', 'choice_text_arabic': 'الحرارة تتدفق دائماً من الساخن إلى البارد', 'is_correct': False},
                                {'choice_text': 'Work is always equal to heat', 'choice_text_arabic': 'الشغل يساوي دائماً الحرارة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In the equation ΔU = Q - W, what does each term represent?',
                            'question_text_arabic': 'في المعادلة ΔU = Q - W، ماذا يمثل كل حد؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'ΔU: change in internal energy, Q: heat added to system, W: work done by system', 'choice_text_arabic': 'ΔU: التغير في الطاقة الداخلية، Q: الحرارة المضافة للنظام، W: الشغل المبذول بواسطة النظام', 'is_correct': True},
                                {'choice_text': 'ΔU: work done, Q: internal energy, W: heat', 'choice_text_arabic': 'ΔU: الشغل المبذول، Q: الطاقة الداخلية، W: الحرارة', 'is_correct': False},
                                {'choice_text': 'ΔU: temperature change, Q: pressure, W: volume', 'choice_text_arabic': 'ΔU: تغير درجة الحرارة، Q: الضغط، W: الحجم', 'is_correct': False},
                                {'choice_text': 'ΔU: heat capacity, Q: work, W: internal energy', 'choice_text_arabic': 'ΔU: السعة الحرارية، Q: الشغل، W: الطاقة الداخلية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'If 100 J of heat is added to a system and the system does 60 J of work, what is the change in internal energy?',
                            'question_text_arabic': 'إذا أُضيفت 100 جول من الحرارة لنظام وبذل النظام 60 جول من الشغل، ما التغير في الطاقة الداخلية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '+40 J', 'choice_text_arabic': '+40 جول', 'is_correct': True},
                                {'choice_text': '+160 J', 'choice_text_arabic': '+160 جول', 'is_correct': False},
                                {'choice_text': '-40 J', 'choice_text_arabic': '-40 جول', 'is_correct': False},
                                {'choice_text': '0 J', 'choice_text_arabic': '0 جول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'When is the change in internal energy zero?',
                            'question_text_arabic': 'متى يكون التغير في الطاقة الداخلية صفراً؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'When heat added equals work done by the system', 'choice_text_arabic': 'عندما تساوي الحرارة المضافة الشغل المبذول بواسطة النظام', 'is_correct': True},
                                {'choice_text': 'When no heat is exchanged', 'choice_text_arabic': 'عندما لا يتم تبادل حرارة', 'is_correct': False},
                                {'choice_text': 'When no work is done', 'choice_text_arabic': 'عندما لا يُبذل شغل', 'is_correct': False},
                                {'choice_text': 'When temperature is constant', 'choice_text_arabic': 'عندما تكون درجة الحرارة ثابتة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The first law of thermodynamics is a statement of conservation of energy.',
                            'question_text_arabic': 'القانون الأول للديناميكا الحرارية هو بيان لحفظ الطاقة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Heat and Work in Thermodynamic Processes',
                    'title_arabic': 'الحرارة والشغل في العمليات الديناميكية الحرارية',
                    'description': 'Analyzing different thermodynamic processes and energy transfer',
                    'description_arabic': 'تحليل العمليات الديناميكية الحرارية المختلفة ونقل الطاقة',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'In an isothermal process for an ideal gas, what happens to internal energy?',
                            'question_text_arabic': 'في العملية متساوية الحرارة للغاز المثالي، ماذا يحدث للطاقة الداخلية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'It remains constant (ΔU = 0)', 'choice_text_arabic': 'تبقى ثابتة (ΔU = 0)', 'is_correct': True},
                                {'choice_text': 'It increases', 'choice_text_arabic': 'تزداد', 'is_correct': False},
                                {'choice_text': 'It decreases', 'choice_text_arabic': 'تقل', 'is_correct': False},
                                {'choice_text': 'It becomes infinite', 'choice_text_arabic': 'تصبح لا نهائية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In an adiabatic process, what is true?',
                            'question_text_arabic': 'في العملية الأديباتية، ما الصحيح؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'No heat is exchanged (Q = 0), so ΔU = -W', 'choice_text_arabic': 'لا يتم تبادل حرارة (Q = 0)، لذا ΔU = -W', 'is_correct': True},
                                {'choice_text': 'No work is done (W = 0)', 'choice_text_arabic': 'لا يُبذل شغل (W = 0)', 'is_correct': False},
                                {'choice_text': 'Temperature remains constant', 'choice_text_arabic': 'درجة الحرارة تبقى ثابتة', 'is_correct': False},
                                {'choice_text': 'Pressure remains constant', 'choice_text_arabic': 'الضغط يبقى ثابت', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In an isochoric (constant volume) process, what is the work done?',
                            'question_text_arabic': 'في العملية متساوية الحجم (الحجم ثابت)، ما الشغل المبذول؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Zero (W = 0)', 'choice_text_arabic': 'صفر (W = 0)', 'is_correct': True},
                                {'choice_text': 'Maximum possible', 'choice_text_arabic': 'أقصى ما يمكن', 'is_correct': False},
                                {'choice_text': 'Equal to heat added', 'choice_text_arabic': 'يساوي الحرارة المضافة', 'is_correct': False},
                                {'choice_text': 'Negative only', 'choice_text_arabic': 'سالب فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which processes involve no change in internal energy for an ideal gas?',
                            'question_text_arabic': 'أي عمليات لا تتضمن تغيير في الطاقة الداخلية للغاز المثالي؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Isothermal expansion', 'choice_text_arabic': 'التمدد متساوي الحرارة', 'is_correct': True},
                                {'choice_text': 'Isothermal compression', 'choice_text_arabic': 'الانضغاط متساوي الحرارة', 'is_correct': True},
                                {'choice_text': 'Complete cycle (returns to initial state)', 'choice_text_arabic': 'دورة كاملة (العودة للحالة الأولية)', 'is_correct': True},
                                {'choice_text': 'Adiabatic expansion', 'choice_text_arabic': 'التمدد الأديباتي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A gas undergoes an isochoric heating where 200 J of heat is added. What is the change in internal energy?',
                            'question_text_arabic': 'غاز يخضع لتسخين متساوي الحجم حيث تُضاف 200 جول من الحرارة. ما التغير في الطاقة الداخلية؟',
                            'question_type': 'open_short',
                            'correct_answer': '200 J'
                        }
                    ]
                },
                {
                    'title': 'Specific Heat and Heat Capacity',
                    'title_arabic': 'الحرارة النوعية والسعة الحرارية',
                    'description': 'Understanding heat capacity and its relationship with internal energy changes',
                    'description_arabic': 'فهم السعة الحرارية وعلاقتها بتغيرات الطاقة الداخلية',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is heat capacity?',
                            'question_text_arabic': 'ما هي السعة الحرارية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The amount of heat required to raise the temperature of a substance by 1°C', 'choice_text_arabic': 'كمية الحرارة المطلوبة لرفع درجة حرارة مادة بمقدار 1°س', 'is_correct': True},
                                {'choice_text': 'The maximum temperature a substance can reach', 'choice_text_arabic': 'أقصى درجة حرارة يمكن للمادة الوصول إليها', 'is_correct': False},
                                {'choice_text': 'The rate of heat transfer', 'choice_text_arabic': 'معدل انتقال الحرارة', 'is_correct': False},
                                {'choice_text': 'The internal energy of a substance', 'choice_text_arabic': 'الطاقة الداخلية للمادة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'For an ideal gas, what is the relationship between Cp and Cv?',
                            'question_text_arabic': 'للغاز المثالي، ما العلاقة بين Cp و Cv؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Cp = Cv + R (where R is the gas constant)', 'choice_text_arabic': 'Cp = Cv + R (حيث R هو ثابت الغاز)', 'is_correct': True},
                                {'choice_text': 'Cp = Cv', 'choice_text_arabic': 'Cp = Cv', 'is_correct': False},
                                {'choice_text': 'Cp = Cv - R', 'choice_text_arabic': 'Cp = Cv - R', 'is_correct': False},
                                {'choice_text': 'Cp = 2Cv', 'choice_text_arabic': 'Cp = 2Cv', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Why is Cp greater than Cv for gases?',
                            'question_text_arabic': 'لماذا Cp أكبر من Cv للغازات؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'At constant pressure, extra heat is needed to do expansion work', 'choice_text_arabic': 'عند الضغط الثابت، حرارة إضافية مطلوبة لبذل شغل التمدد', 'is_correct': True},
                                {'choice_text': 'Pressure changes require more energy', 'choice_text_arabic': 'تغيرات الضغط تتطلب طاقة أكثر', 'is_correct': False},
                                {'choice_text': 'Volume is always larger at constant pressure', 'choice_text_arabic': 'الحجم دائماً أكبر عند الضغط الثابت', 'is_correct': False},
                                {'choice_text': 'It\'s a measurement error', 'choice_text_arabic': 'إنه خطأ في القياس', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'For a monatomic ideal gas, what is the relationship between internal energy and temperature?',
                            'question_text_arabic': 'للغاز المثالي أحادي الذرة، ما العلاقة بين الطاقة الداخلية ودرجة الحرارة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'U = (3/2)nRT', 'choice_text_arabic': 'U = (3/2)nRT', 'is_correct': True},
                                {'choice_text': 'U = nRT', 'choice_text_arabic': 'U = nRT', 'is_correct': False},
                                {'choice_text': 'U = (5/2)nRT', 'choice_text_arabic': 'U = (5/2)nRT', 'is_correct': False},
                                {'choice_text': 'U = (1/2)nRT', 'choice_text_arabic': 'U = (1/2)nRT', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Calculate the change in internal energy when 2 moles of monatomic ideal gas is heated from 300K to 400K (R = 8.314 J/mol·K)',
                            'question_text_arabic': 'احسب التغير في الطاقة الداخلية عندما يُسخن مولان من غاز مثالي أحادي الذرة من 300 كلفن إلى 400 كلفن (R = 8.314 ج/مول·ك)',
                            'question_type': 'open_short',
                            'correct_answer': '2494.2 J'
                        }
                    ]
                },
                {
                    'title': 'Applications and Energy Efficiency',
                    'title_arabic': 'التطبيقات وكفاءة الطاقة',
                    'description': 'Real-world applications of internal energy and thermodynamic efficiency',
                    'description_arabic': 'التطبيقات الواقعية للطاقة الداخلية والكفاءة الديناميكية الحرارية',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'In a heat engine, what happens to the internal energy over a complete cycle?',
                            'question_text_arabic': 'في المحرك الحراري، ماذا يحدث للطاقة الداخلية خلال دورة كاملة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'It returns to its initial value (ΔU = 0)', 'choice_text_arabic': 'تعود لقيمتها الأولية (ΔU = 0)', 'is_correct': True},
                                {'choice_text': 'It increases continuously', 'choice_text_arabic': 'تزداد باستمرار', 'is_correct': False},
                                {'choice_text': 'It decreases continuously', 'choice_text_arabic': 'تقل باستمرار', 'is_correct': False},
                                {'choice_text': 'It becomes zero', 'choice_text_arabic': 'تصبح صفراً', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Why can\'t we extract all thermal energy as useful work?',
                            'question_text_arabic': 'لماذا لا يمكننا استخراج كل الطاقة الحرارية كشغل مفيد؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Some energy must be rejected to maintain the thermodynamic cycle', 'choice_text_arabic': 'بعض الطاقة يجب رفضها للحفاظ على الدورة الديناميكية الحرارية', 'is_correct': True},
                                {'choice_text': 'Energy is always lost to friction', 'choice_text_arabic': 'الطاقة تُفقد دائماً للاحتكاك', 'is_correct': False},
                                {'choice_text': 'Thermal energy cannot do work', 'choice_text_arabic': 'الطاقة الحرارية لا يمكنها بذل شغل', 'is_correct': False},
                                {'choice_text': 'It violates conservation of energy', 'choice_text_arabic': 'ينتهك حفظ الطاقة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In which applications is understanding internal energy most important?',
                            'question_text_arabic': 'في أي تطبيقات يكون فهم الطاقة الداخلية أكثر أهمية؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Steam power plants', 'choice_text_arabic': 'محطات الطاقة البخارية', 'is_correct': True},
                                {'choice_text': 'Refrigeration systems', 'choice_text_arabic': 'أنظمة التبريد', 'is_correct': True},
                                {'choice_text': 'Internal combustion engines', 'choice_text_arabic': 'محركات الاحتراق الداخلي', 'is_correct': True},
                                {'choice_text': 'Simple mechanical levers', 'choice_text_arabic': 'الروافع الميكانيكية البسيطة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A refrigerator removes 1000 J of heat from the cold reservoir and rejects 1400 J to the hot reservoir. How much work was input?',
                            'question_text_arabic': 'ثلاجة تزيل 1000 جول من الحرارة من المستودع البارد وترفض 1400 جول للمستودع الساخن. كم الشغل المدخل؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '400 J', 'choice_text_arabic': '400 جول', 'is_correct': True},
                                {'choice_text': '1000 J', 'choice_text_arabic': '1000 جول', 'is_correct': False},
                                {'choice_text': '1400 J', 'choice_text_arabic': '1400 جول', 'is_correct': False},
                                {'choice_text': '2400 J', 'choice_text_arabic': '2400 جول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Perfect energy conversion (100% efficiency) is theoretically possible for any heat engine.',
                            'question_text_arabic': 'التحويل المثالي للطاقة (كفاءة 100%) ممكن نظرياً لأي محرك حراري.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
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
                    f'Successfully created for Lesson 127 (Work and internal energy):\\n'
                    f'Exercises: {total_exercises}\\n'
                    f'Questions: {total_questions}\\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 127 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )