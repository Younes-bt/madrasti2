from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward
from django.db import transaction

class Command(BaseCommand):
    help = 'Create exercises for Lesson 133: Tracking the evolution of a chemical transformation'

    @transaction.atomic
    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=133)
            self.stdout.write(f"Creating exercises for lesson: {lesson.title}")

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Reaction Rate and Progress Variables',
                    'title_ar': 'معدل التفاعل ومتغيرات التقدم',
                    'description': 'Understanding how to measure and calculate the rate of chemical reactions using different variables.',
                    'description_ar': 'فهم كيفية قياس وحساب معدل التفاعلات الكيميائية باستخدام متغيرات مختلفة.',
                    'difficulty': 'beginner',
                    'points': 10,
                    'questions': [
                        {
                            'text': 'What is the reaction rate defined as?',
                            'text_ar': 'كيف يُعرَّف معدل التفاعل؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'The change in concentration per unit time', 'text_ar': 'التغير في التركيز لكل وحدة زمن', 'is_correct': True},
                                {'text': 'The total amount of product formed', 'text_ar': 'الكمية الإجمالية للناتج المتشكل', 'is_correct': False},
                                {'text': 'The initial concentration of reactants', 'text_ar': 'التركيز الأولي للمتفاعلات', 'is_correct': False},
                                {'text': 'The equilibrium constant of the reaction', 'text_ar': 'ثابت الاتزان للتفاعل', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'The extent of reaction (ξ) is useful because it:',
                            'text_ar': 'مدى التفاعل (ξ) مفيد لأنه:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Provides a single variable to describe reaction progress', 'text_ar': 'يوفر متغيراً واحداً لوصف تقدم التفاعل', 'is_correct': True},
                                {'text': 'Always equals the concentration of products', 'text_ar': 'يساوي دائماً تركيز النواتج', 'is_correct': False},
                                {'text': 'Is independent of stoichiometry', 'text_ar': 'مستقل عن المعادلة الكيميائية', 'is_correct': False},
                                {'text': 'Only applies to gas phase reactions', 'text_ar': 'ينطبق فقط على تفاعلات الطور الغازي', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'Which method can be used to follow reaction progress?',
                            'text_ar': 'أي طريقة يمكن استخدامها لمتابعة تقدم التفاعل؟',
                            'type': 'qcm_multiple',
                            'points': 3,
                            'choices': [
                                {'text': 'Spectrophotometry', 'text_ar': 'القياس الطيفي الضوئي', 'is_correct': True},
                                {'text': 'Conductivity measurements', 'text_ar': 'قياسات الموصلية', 'is_correct': True},
                                {'text': 'pH monitoring', 'text_ar': 'مراقبة الأس الهيدروجيني', 'is_correct': True},
                                {'text': 'Visual observation only', 'text_ar': 'الملاحظة البصرية فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'For the reaction A + 2B → 3C, if 0.1 mol of A reacts, the extent of reaction is:',
                            'text_ar': 'للتفاعل A + 2B → 3C، إذا تفاعل 0.1 مول من A، فإن مدى التفاعل هو:',
                            'type': 'qcm_single',
                            'points': 3,
                            'choices': [
                                {'text': '0.1 mol', 'text_ar': '0.1 مول', 'is_correct': True},
                                {'text': '0.2 mol', 'text_ar': '0.2 مول', 'is_correct': False},
                                {'text': '0.3 mol', 'text_ar': '0.3 مول', 'is_correct': False},
                                {'text': '0.05 mol', 'text_ar': '0.05 مول', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Rate Laws and Order of Reaction',
                    'title_ar': 'قوانين المعدل ومرتبة التفاعل',
                    'description': 'Determining rate laws, reaction orders, and rate constants from experimental data.',
                    'description_ar': 'تحديد قوانين المعدل ومرتبات التفاعل وثوابت المعدل من البيانات التجريبية.',
                    'difficulty': 'intermediate',
                    'points': 15,
                    'questions': [
                        {
                            'text': 'The rate law for a reaction A + B → C is rate = k[A]²[B]. What is the overall order?',
                            'text_ar': 'قانون المعدل للتفاعل A + B → C هو rate = k[A]²[B]. ما هي المرتبة الإجمالية؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '3', 'text_ar': '3', 'is_correct': True},
                                {'text': '2', 'text_ar': '2', 'is_correct': False},
                                {'text': '1', 'text_ar': '1', 'is_correct': False},
                                {'text': '4', 'text_ar': '4', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'A zero-order reaction has:',
                            'text_ar': 'التفاعل من المرتبة الصفرية له:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'A constant reaction rate', 'text_ar': 'معدل تفاعل ثابت', 'is_correct': True},
                                {'text': 'No rate constant', 'text_ar': 'لا يوجد ثابت معدل', 'is_correct': False},
                                {'text': 'Rate proportional to concentration', 'text_ar': 'معدل متناسب مع التركيز', 'is_correct': False},
                                {'text': 'Infinite rate', 'text_ar': 'معدل لا نهائي', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'The half-life of a first-order reaction:',
                            'text_ar': 'نصف عمر التفاعل من المرتبة الأولى:',
                            'type': 'true_false',
                            'points': 2,
                            'choices': [
                                {'text': 'Is independent of initial concentration', 'text_ar': 'مستقل عن التركيز الأولي', 'is_correct': True},
                                {'text': 'Depends on initial concentration', 'text_ar': 'يعتمد على التركيز الأولي', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'Which factors affect the rate constant k?',
                            'text_ar': 'أي عوامل تؤثر على ثابت المعدل k؟',
                            'type': 'qcm_multiple',
                            'points': 3,
                            'choices': [
                                {'text': 'Temperature', 'text_ar': 'درجة الحرارة', 'is_correct': True},
                                {'text': 'Presence of catalyst', 'text_ar': 'وجود عامل مساعد', 'is_correct': True},
                                {'text': 'Initial concentration', 'text_ar': 'التركيز الأولي', 'is_correct': False},
                                {'text': 'Pressure (for solutions)', 'text_ar': 'الضغط (للمحاليل)', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'Explain how to determine reaction order from experimental data.',
                            'text_ar': 'اشرح كيفية تحديد مرتبة التفاعل من البيانات التجريبية.',
                            'type': 'open_short',
                            'points': 4,
                            'choices': []
                        }
                    ]
                },
                {
                    'title': 'Integrated Rate Laws',
                    'title_ar': 'قوانين المعدل المتكاملة',
                    'description': 'Using integrated rate laws to analyze concentration changes over time.',
                    'description_ar': 'استخدام قوانين المعدل المتكاملة لتحليل تغيرات التركيز مع الزمن.',
                    'difficulty': 'intermediate',
                    'points': 15,
                    'questions': [
                        {
                            'text': 'For a first-order reaction, the integrated rate law is:',
                            'text_ar': 'للتفاعل من المرتبة الأولى، قانون المعدل المتكامل هو:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'ln[A] = ln[A]₀ - kt', 'text_ar': 'ln[A] = ln[A]₀ - kt', 'is_correct': True},
                                {'text': '[A] = [A]₀ - kt', 'text_ar': '[A] = [A]₀ - kt', 'is_correct': False},
                                {'text': '1/[A] = 1/[A]₀ + kt', 'text_ar': '1/[A] = 1/[A]₀ + kt', 'is_correct': False},
                                {'text': '[A]² = [A]₀² - kt', 'text_ar': '[A]² = [A]₀² - kt', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'A plot of ln[A] vs time gives a straight line for:',
                            'text_ar': 'رسم ln[A] مقابل الزمن يعطي خطاً مستقيماً لـ:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'First-order reactions', 'text_ar': 'التفاعلات من المرتبة الأولى', 'is_correct': True},
                                {'text': 'Zero-order reactions', 'text_ar': 'التفاعلات من المرتبة الصفرية', 'is_correct': False},
                                {'text': 'Second-order reactions', 'text_ar': 'التفاعلات من المرتبة الثانية', 'is_correct': False},
                                {'text': 'All reactions', 'text_ar': 'جميع التفاعلات', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'The half-life equation for a second-order reaction is:',
                            'text_ar': 'معادلة نصف العمر للتفاعل من المرتبة الثانية هي:',
                            'type': 'qcm_single',
                            'points': 3,
                            'choices': [
                                {'text': 't₁/₂ = 1/(k[A]₀)', 'text_ar': 't₁/₂ = 1/(k[A]₀)', 'is_correct': True},
                                {'text': 't₁/₂ = ln2/k', 'text_ar': 't₁/₂ = ln2/k', 'is_correct': False},
                                {'text': 't₁/₂ = [A]₀/(2k)', 'text_ar': 't₁/₂ = [A]₀/(2k)', 'is_correct': False},
                                {'text': 't₁/₂ = k[A]₀', 'text_ar': 't₁/₂ = k[A]₀', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'Which graph would be linear for a zero-order reaction?',
                            'text_ar': 'أي رسم بياني سيكون خطياً للتفاعل من المرتبة الصفرية؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '[A] vs time', 'text_ar': '[A] مقابل الزمن', 'is_correct': True},
                                {'text': 'ln[A] vs time', 'text_ar': 'ln[A] مقابل الزمن', 'is_correct': False},
                                {'text': '1/[A] vs time', 'text_ar': '1/[A] مقابل الزمن', 'is_correct': False},
                                {'text': '[A]² vs time', 'text_ar': '[A]² مقابل الزمن', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'Calculate the time needed for 75% completion of a first-order reaction with k = 0.1 s⁻¹.',
                            'text_ar': 'احسب الزمن المطلوب لإكمال 75% من تفاعل من المرتبة الأولى مع k = 0.1 s⁻¹.',
                            'type': 'open_short',
                            'points': 4,
                            'choices': []
                        }
                    ]
                },
                {
                    'title': 'Temperature Effects and Arrhenius Equation',
                    'title_ar': 'تأثيرات درجة الحرارة ومعادلة أرهينيوس',
                    'description': 'Understanding how temperature affects reaction rates using the Arrhenius equation.',
                    'description_ar': 'فهم كيف تؤثر درجة الحرارة على معدلات التفاعل باستخدام معادلة أرهينيوس.',
                    'difficulty': 'advanced',
                    'points': 20,
                    'questions': [
                        {
                            'text': 'The Arrhenius equation relates rate constant to:',
                            'text_ar': 'معادلة أرهينيوس تربط ثابت المعدل بـ:',
                            'type': 'qcm_multiple',
                            'points': 3,
                            'choices': [
                                {'text': 'Temperature', 'text_ar': 'درجة الحرارة', 'is_correct': True},
                                {'text': 'Activation energy', 'text_ar': 'طاقة التنشيط', 'is_correct': True},
                                {'text': 'Frequency factor', 'text_ar': 'عامل التردد', 'is_correct': True},
                                {'text': 'Concentration', 'text_ar': 'التركيز', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'Higher activation energy means:',
                            'text_ar': 'طاقة التنشيط الأعلى تعني:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Slower reaction rate', 'text_ar': 'معدل تفاعل أبطأ', 'is_correct': True},
                                {'text': 'Faster reaction rate', 'text_ar': 'معدل تفاعل أسرع', 'is_correct': False},
                                {'text': 'No effect on rate', 'text_ar': 'لا تأثير على المعدل', 'is_correct': False},
                                {'text': 'Variable effect', 'text_ar': 'تأثير متغير', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'A plot of ln k vs 1/T gives:',
                            'text_ar': 'رسم ln k مقابل 1/T يعطي:',
                            'type': 'qcm_single',
                            'points': 3,
                            'choices': [
                                {'text': 'A straight line with slope = -Ea/R', 'text_ar': 'خطاً مستقيماً بميل = -Ea/R', 'is_correct': True},
                                {'text': 'A curve', 'text_ar': 'منحنى', 'is_correct': False},
                                {'text': 'A straight line with slope = +Ea/R', 'text_ar': 'خطاً مستقيماً بميل = +Ea/R', 'is_correct': False},
                                {'text': 'A horizontal line', 'text_ar': 'خطاً أفقياً', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'Catalysts affect reaction rates by:',
                            'text_ar': 'العوامل المساعدة تؤثر على معدلات التفاعل من خلال:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Lowering activation energy', 'text_ar': 'خفض طاقة التنشيط', 'is_correct': True},
                                {'text': 'Increasing temperature', 'text_ar': 'زيادة درجة الحرارة', 'is_correct': False},
                                {'text': 'Changing equilibrium position', 'text_ar': 'تغيير موضع الاتزان', 'is_correct': False},
                                {'text': 'Increasing concentration', 'text_ar': 'زيادة التركيز', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'Generally, reaction rates double for every:',
                            'text_ar': 'عموماً، معدلات التفاعل تتضاعف لكل:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '10°C temperature increase', 'text_ar': 'زيادة 10°C في درجة الحرارة', 'is_correct': True},
                                {'text': '1°C temperature increase', 'text_ar': 'زيادة 1°C في درجة الحرارة', 'is_correct': False},
                                {'text': '50°C temperature increase', 'text_ar': 'زيادة 50°C في درجة الحرارة', 'is_correct': False},
                                {'text': '100°C temperature increase', 'text_ar': 'زيادة 100°C في درجة الحرارة', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'Calculate the activation energy if k doubles when temperature increases from 300K to 310K.',
                            'text_ar': 'احسب طاقة التنشيط إذا تضاعف k عندما ترتفع درجة الحرارة من 300K إلى 310K.',
                            'type': 'open_short',
                            'points': 6,
                            'choices': []
                        }
                    ]
                },
                {
                    'title': 'Reaction Mechanisms and Elementary Steps',
                    'title_ar': 'آليات التفاعل والخطوات الأولية',
                    'description': 'Understanding reaction mechanisms, elementary steps, and rate-determining steps.',
                    'description_ar': 'فهم آليات التفاعل والخطوات الأولية والخطوات المحددة للمعدل.',
                    'difficulty': 'advanced',
                    'points': 20,
                    'questions': [
                        {
                            'text': 'An elementary step is:',
                            'text_ar': 'الخطوة الأولية هي:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'A single molecular event in a reaction mechanism', 'text_ar': 'حدث جزيئي واحد في آلية التفاعل', 'is_correct': True},
                                {'text': 'The fastest step in a mechanism', 'text_ar': 'أسرع خطوة في الآلية', 'is_correct': False},
                                {'text': 'The overall reaction', 'text_ar': 'التفاعل الإجمالي', 'is_correct': False},
                                {'text': 'A reversible reaction', 'text_ar': 'تفاعل قابل للانعكاس', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'The rate-determining step is:',
                            'text_ar': 'الخطوة المحددة للمعدل هي:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'The slowest step in the mechanism', 'text_ar': 'أبطأ خطوة في الآلية', 'is_correct': True},
                                {'text': 'The first step', 'text_ar': 'الخطوة الأولى', 'is_correct': False},
                                {'text': 'The last step', 'text_ar': 'الخطوة الأخيرة', 'is_correct': False},
                                {'text': 'Any reversible step', 'text_ar': 'أي خطوة قابلة للانعكاس', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'Intermediates in a reaction mechanism:',
                            'text_ar': 'الوسائط في آلية التفاعل:',
                            'type': 'qcm_multiple',
                            'points': 3,
                            'choices': [
                                {'text': 'Are formed and consumed during the reaction', 'text_ar': 'تتشكل وتستهلك أثناء التفاعل', 'is_correct': True},
                                {'text': 'Do not appear in the overall equation', 'text_ar': 'لا تظهر في المعادلة الإجمالية', 'is_correct': True},
                                {'text': 'Are usually unstable', 'text_ar': 'عادة ما تكون غير مستقرة', 'is_correct': True},
                                {'text': 'Are the final products', 'text_ar': 'هي النواتج النهائية', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'For an elementary step A + B → C, the rate law is rate = k[A][B].',
                            'text_ar': 'للخطوة الأولية A + B → C، قانون المعدل هو rate = k[A][B].',
                            'type': 'true_false',
                            'points': 2,
                            'choices': [
                                {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                                {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'The molecularity of an elementary step 2A + B → products is:',
                            'text_ar': 'الجزيئية للخطوة الأولية 2A + B → products هي:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '3', 'text_ar': '3', 'is_correct': True},
                                {'text': '2', 'text_ar': '2', 'is_correct': False},
                                {'text': '1', 'text_ar': '1', 'is_correct': False},
                                {'text': '4', 'text_ar': '4', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'Explain the difference between reaction order and molecularity.',
                            'text_ar': 'اشرح الفرق بين مرتبة التفاعل والجزيئية.',
                            'type': 'open_short',
                            'points': 7,
                            'choices': []
                        }
                    ]
                }
            ]

            for i, exercise_data in enumerate(exercises_data, 1):
                exercise = Exercise.objects.create(
                    lesson=lesson,
                    created_by_id=1,
                    title=exercise_data['title'],
                    title_arabic=exercise_data['title_ar'],
                    description=exercise_data['description'],
                    instructions=exercise_data['description_ar']
                )

                # Create reward configuration
                ExerciseReward.objects.create(
                    exercise=exercise,
                    completion_points=exercise_data['points'],
                    difficulty_multiplier=1.5 if exercise_data['difficulty'] == 'advanced' else 1.2 if exercise_data['difficulty'] == 'intermediate' else 1.0
                )

                for j, question_data in enumerate(exercise_data['questions'], 1):
                    question = Question.objects.create(
                        exercise=exercise,
                        question_text=question_data['text'],
                        question_text_arabic=question_data['text_ar'],
                        question_type=question_data['type'],
                        points=question_data['points']
                    )

                    for k, choice_data in enumerate(question_data['choices'], 1):
                        QuestionChoice.objects.create(
                            question=question,
                            choice_text=choice_data['text'],
                            choice_text_arabic=choice_data['text_ar'],
                            is_correct=choice_data['is_correct']
                        )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created {len(exercises_data)} exercises for lesson {lesson.id}: {lesson.title}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 133 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )