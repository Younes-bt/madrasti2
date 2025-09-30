from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Free oscillations in a series RLC circuit - Lesson ID: 43'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=43)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Ideal LC Oscillations',
                    'title_arabic': 'التذبذبات المثالية في دارة LC',
                    'description': 'Understanding free oscillations in an ideal circuit with no resistance.',
                    'description_arabic': 'فهم التذبذبات الحرة في دارة مثالية بدون مقاومة.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'In an ideal LC circuit, what happens to the total energy?',
                            'question_text_arabic': 'في دارة LC مثالية، ماذا يحدث للطاقة الكلية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'It is conserved and oscillates between L and C', 'choice_text_arabic': 'تنحفظ وتتأرجح بين L و C', 'is_correct': True},
                                {'choice_text': 'It dissipates as heat', 'choice_text_arabic': 'تتبدد على شكل حرارة', 'is_correct': False},
                                {'choice_text': 'It increases over time', 'choice_text_arabic': 'تزداد مع مرور الوقت', 'is_correct': False},
                                {'choice_text': 'It decays to zero', 'choice_text_arabic': 'تتلاشى إلى الصفر', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The natural angular frequency (ω₀) of an LC circuit is given by 1/√(LC).',
                            'question_text_arabic': 'يعطى التردد الزاوي الطبيعي (ω₀) لدارة LC بالعلاقة 1/√(LC).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the differential equation governing the charge q(t) in an ideal LC circuit?',
                            'question_text_arabic': 'ما هي المعادلة التفاضلية التي تحكم الشحنة q(t) في دارة LC مثالية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'd²q/dt² + (1/LC)q = 0', 'choice_text_arabic': 'd²q/dt² + (1/LC)q = 0', 'is_correct': True},
                                {'choice_text': 'd²q/dt² - (1/LC)q = 0', 'choice_text_arabic': 'd²q/dt² - (1/LC)q = 0', 'is_correct': False},
                                {'choice_text': 'dq/dt + (1/LC)q = 0', 'choice_text_arabic': 'dq/dt + (1/LC)q = 0', 'is_correct': False},
                                {'choice_text': 'L(dq/dt) + Cq = 0', 'choice_text_arabic': 'L(dq/dt) + Cq = 0', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Damped Oscillations in RLC Circuits',
                    'title_arabic': 'التذبذبات المخمدة في دوائر RLC',
                    'description': 'Understanding the effect of resistance on free oscillations.',
                    'description_arabic': 'فهم تأثير المقاومة على التذبذبات الحرة.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the role of the resistor in a free RLC circuit?',
                            'question_text_arabic': 'ما هو دور المقاوم في دارة RLC حرة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'It dissipates energy and causes damping', 'choice_text_arabic': 'يبدد الطاقة ويسبب الإخماد', 'is_correct': True},
                                {'choice_text': 'It stores magnetic energy', 'choice_text_arabic': 'يخزن الطاقة المغناطيسية', 'is_correct': False},
                                {'choice_text': 'It stores electric energy', 'choice_text_arabic': 'يخزن الطاقة الكهربائية', 'is_correct': False},
                                {'choice_text': 'It provides energy to the circuit', 'choice_text_arabic': 'يزود الدارة بالطاقة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In an underdamped RLC circuit, the amplitude of the oscillations increases over time.',
                            'question_text_arabic': 'في دارة RLC ذات إخماد ضعيف، يزداد وسع التذبذبات مع مرور الوقت.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        },
                        {
                            'question_text': 'Which damping regime returns to equilibrium in the fastest possible time without oscillating?',
                            'question_text_arabic': 'أي نظام إخماد يعود إلى حالة التوازن في أسرع وقت ممكن دون تذبذب؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Critical damping', 'choice_text_arabic': 'الإخماد الحرج', 'is_correct': True},
                                {'choice_text': 'Underdamping', 'choice_text_arabic': 'الإخماد الضعيف', 'is_correct': False},
                                {'choice_text': 'Overdamping', 'choice_text_arabic': 'الإخماد القوي', 'is_correct': False},
                                {'choice_text': 'No damping', 'choice_text_arabic': 'بدون إخماد', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Pseudo-Period and Frequency',
                    'title_arabic': 'شبه الدور والتردد',
                    'description': 'Understanding the period of damped oscillations.',
                    'description_arabic': 'فهم دور التذبذبات المخمدة.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'The pseudo-period of a damped oscillation is always equal to the natural period of the undamped oscillation.',
                            'question_text_arabic': 'شبه دور التذبذب المخمد يساوي دائمًا الدور الطبيعي للتذبذب غير المخمد.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        },
                        {
                            'question_text': 'How does the pseudo-frequency of an underdamped circuit compare to its natural frequency?',
                            'question_text_arabic': 'كيف يقارن شبه تردد دارة ذات إخماد ضعيف بترددها الطبيعي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'It is slightly lower', 'choice_text_arabic': 'أقل بقليل', 'is_correct': True},
                                {'choice_text': 'It is slightly higher', 'choice_text_arabic': 'أعلى بقليل', 'is_correct': False},
                                {'choice_text': 'It is exactly the same', 'choice_text_arabic': 'نفسه بالضبط', 'is_correct': False},
                                {'choice_text': 'It is zero', 'choice_text_arabic': 'يساوي صفر', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Energy in Damped Oscillations',
                    'title_arabic': 'الطاقة في التذبذبات المخمدة',
                    'description': 'Analyzing the energy dissipation in a free RLC circuit.',
                    'description_arabic': 'تحليل تبديد الطاقة في دارة RLC حرة.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'How does the total energy of a free RLC circuit change over time?',
                            'question_text_arabic': 'كيف تتغير الطاقة الكلية لدارة RLC حرة مع مرور الوقت؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'It decreases exponentially', 'choice_text_arabic': 'تتناقص بشكل أسي', 'is_correct': True},
                                {'choice_text': 'It remains constant', 'choice_text_arabic': 'تبقى ثابتة', 'is_correct': False},
                                {'choice_text': 'It decreases linearly', 'choice_text_arabic': 'تتناقص خطيًا', 'is_correct': False},
                                {'choice_text': 'It oscillates', 'choice_text_arabic': 'تتذبذب', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The rate of energy loss in an RLC circuit is given by P = i²R.',
                            'question_text_arabic': 'يعطى معدل فقدان الطاقة في دارة RLC بالعلاقة P = i²R.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the expression for the total energy E stored in an RLC circuit at any time t?',
                            'question_text_arabic': 'ما هو تعبير الطاقة الكلية E المخزنة في دارة RLC في أي لحظة t؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'E = ½(q²/C) + ½(Li²)', 'choice_text_arabic': 'E = ½(q²/C) + ½(Li²)', 'is_correct': True},
                                {'choice_text': 'E = ½(Cq²) + ½(i²/L)', 'choice_text_arabic': 'E = ½(Cq²) + ½(i²/L)', 'is_correct': False},
                                {'choice_text': 'E = ½(CV²) + ½(LI)', 'choice_text_arabic': 'E = ½(CV²) + ½(LI)', 'is_correct': False},
                                {'choice_text': 'E = i²R', 'choice_text_arabic': 'E = i²R', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Damping Regimes Analysis',
                    'title_arabic': 'تحليل أنظمة الإخماد',
                    'description': 'Distinguishing between underdamped, overdamped, and critically damped systems.',
                    'description_arabic': 'التمييز بين أنظمة الإخماد الضعيف والقوي والحرج.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is the condition for critical damping in a series RLC circuit?',
                            'question_text_arabic': 'ما هو شرط الإخماد الحرج في دارة RLC على التوالي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'R² = 4L/C', 'choice_text_arabic': 'R² = 4L/C', 'is_correct': True},
                                {'choice_text': 'R² < 4L/C', 'choice_text_arabic': 'R² < 4L/C', 'is_correct': False},
                                {'choice_text': 'R² > 4L/C', 'choice_text_arabic': 'R² > 4L/C', 'is_correct': False},
                                {'choice_text': 'R = L/C', 'choice_text_arabic': 'R = L/C', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In an overdamped circuit, the charge returns to zero without any oscillation.',
                            'question_text_arabic': 'في دارة ذات إخماد قوي، تعود الشحنة إلى الصفر دون أي تذبذب.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'An RLC circuit has L = 10 mH and C = 1 µF. For what range of R will the circuit be underdamped?',
                            'question_text_arabic': 'دارة RLC بها L = 10 mH و C = 1 µF. لأي مدى من R ستكون الدارة ذات إخماد ضعيف؟',
                            'question_type': 'open_short',
                            'correct_answer': 'R < 200 Ω'
                        }
                    ]
                }
            ]

            total_exercises = 0
            total_questions = 0
            total_choices = 0

            for ex_data in exercises_data:
                exercise = Exercise.objects.create(
                    lesson=lesson,
                    created_by_id=1,
                    title=ex_data['title'],
                    title_arabic=ex_data['title_arabic'],
                    description=ex_data['description'],
                    instructions=ex_data.get('description_arabic', ''),
                    difficulty_level=ex_data['difficulty'],
                    is_active=True
                )
                total_exercises += 1

                for q_data in ex_data['questions']:
                    question = Question.objects.create(
                        exercise=exercise,
                        question_text=q_data['question_text'],
                        question_text_arabic=q_data['question_text_arabic'],
                        question_type=q_data['question_type'],
                        points=10 if ex_data['difficulty'] == 'beginner' else 15 if ex_data['difficulty'] == 'intermediate' else 20
                    )
                    total_questions += 1

                    if q_data['question_type'] in ['qcm_single', 'qcm_multiple'] and 'choices' in q_data:
                        for choice_data in q_data['choices']:
                            QuestionChoice.objects.create(
                                question=question,
                                choice_text=choice_data['choice_text'],
                                choice_text_arabic=choice_data['choice_text_arabic'],
                                is_correct=choice_data['is_correct']
                            )
                            total_choices += 1
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

                ExerciseReward.objects.create(
                    exercise=exercise,
                    completion_points=30 if ex_data['difficulty'] == 'beginner' else 50 if ex_data['difficulty'] == 'intermediate' else 70,
                    completion_coins=1,
                    perfect_score_bonus=20 if ex_data['difficulty'] == 'beginner' else 30 if ex_data['difficulty'] == 'intermediate' else 50
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created for Lesson 43 (Free oscillations in a series RLC circuit):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 43 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
