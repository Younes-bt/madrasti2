from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for RL Dipole / RL Circuit - Lesson ID: 41'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=41)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Components of an RL Circuit',
                    'title_arabic': 'مكونات دارة RL',
                    'description': 'Understanding the roles of resistors and inductors.',
                    'description_arabic': 'فهم أدوار المقاومات والوشيعات.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What does an inductor store energy in?',
                            'question_text_arabic': 'فيمَ تخزن الوشيعة الطاقة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'A magnetic field', 'choice_text_arabic': 'مجال مغناطيسي', 'is_correct': True},
                                {'choice_text': 'An electric field', 'choice_text_arabic': 'مجال كهربائي', 'is_correct': False},
                                {'choice_text': 'Its resistance', 'choice_text_arabic': 'مقاومتها', 'is_correct': False},
                                {'choice_text': 'Its core', 'choice_text_arabic': 'نواتها', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The unit of inductance is the Henry (H).',
                            'question_text_arabic': 'وحدة التحريض هي الهنري (H).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the main property of an ideal inductor?',
                            'question_text_arabic': 'ما هي الخاصية الرئيسية للوشيعة المثالية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'It opposes changes in current', 'choice_text_arabic': 'تتعارض مع تغيرات التيار', 'is_correct': True},
                                {'choice_text': 'It opposes changes in voltage', 'choice_text_arabic': 'تتعارض مع تغيرات الجهد', 'is_correct': False},
                                {'choice_text': 'It has very high resistance', 'choice_text_arabic': 'لديها مقاومة عالية جدا', 'is_correct': False},
                                {'choice_text': 'It stores electric charge', 'choice_text_arabic': 'تخزن الشحنة الكهربائية', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Establishing Current in an RL Circuit',
                    'title_arabic': 'إقامة التيار في دارة RL',
                    'description': 'Analyzing the transient phase when current is established.',
                    'description_arabic': 'تحليل المرحلة الانتقالية عند إقامة التيار.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the time constant (τ) of an RL circuit?',
                            'question_text_arabic': 'ما هي ثابتة الزمن (τ) لدارة RL؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'τ = L / R', 'choice_text_arabic': 'τ = L / R', 'is_correct': True},
                                {'choice_text': 'τ = R / L', 'choice_text_arabic': 'τ = R / L', 'is_correct': False},
                                {'choice_text': 'τ = R * L', 'choice_text_arabic': 'τ = R * L', 'is_correct': False},
                                {'choice_text': 'τ = R + L', 'choice_text_arabic': 'τ = R + L', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'At the moment a switch is closed in an RL circuit (t=0), the inductor acts like an open circuit.',
                            'question_text_arabic': 'في لحظة إغلاق القاطع في دارة RL (t=0)، تتصرف الوشيعة كدارة مفتوحة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'After one time constant (τ), the current has reached approximately what percentage of its final steady-state value?',
                            'question_text_arabic': 'بعد مرور ثابتة زمن واحدة (τ)، يصل التيار إلى ما يقرب من أي نسبة مئوية من قيمته النهائية المستقرة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '63%', 'choice_text_arabic': '63%', 'is_correct': True},
                                {'choice_text': '37%', 'choice_text_arabic': '37%', 'is_correct': False},
                                {'choice_text': '100%', 'choice_text_arabic': '100%', 'is_correct': False},
                                {'choice_text': '50%', 'choice_text_arabic': '50%', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'An RL circuit has R = 50 Ω and L = 10 mH. Calculate the time constant.',
                            'question_text_arabic': 'دارة RL بها R = 50 Ω و L = 10 mH. احسب ثابتة الزمن.',
                            'question_type': 'open_short',
                            'correct_answer': '0.2 ms'
                        }
                    ]
                },
                {
                    'title': 'Current Decay in an RL Circuit',
                    'title_arabic': 'انقطاع التيار في دارة RL',
                    'description': 'Analyzing the process when the source is removed.',
                    'description_arabic': 'تحليل العملية عند إزالة المصدر.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'When the current source is removed, the inductor tries to maintain the current flow.',
                            'question_text_arabic': 'عند إزالة مصدر التيار، تحاول الوشيعة الحفاظ على تدفق التيار.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the equation for the current i(t) in a decaying RL circuit?',
                            'question_text_arabic': 'ما هي معادلة التيار i(t) في دارة RL أثناء انقطاع التيار؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'i(t) = I₀ * e^(-t/τ)', 'choice_text_arabic': 'i(t) = I₀ * e^(-t/τ)', 'is_correct': True},
                                {'choice_text': 'i(t) = I₀ * (1 - e^(-t/τ))', 'choice_text_arabic': 'i(t) = I₀ * (1 - e^(-t/τ))', 'is_correct': False},
                                {'choice_text': 'i(t) = I₀ * e^(t/τ)', 'choice_text_arabic': 'i(t) = I₀ * e^(t/τ)', 'is_correct': False},
                                {'choice_text': 'i(t) = I₀ * t / τ', 'choice_text_arabic': 'i(t) = I₀ * t / τ', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'After one time constant (τ) of decay, what percentage of the initial current remains?',
                            'question_text_arabic': 'بعد مرور ثابتة زمن واحدة (τ) من انقطاع التيار، ما النسبة المئوية المتبقية من التيار الأولي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '37%', 'choice_text_arabic': '37%', 'is_correct': True},
                                {'choice_text': '63%', 'choice_text_arabic': '63%', 'is_correct': False},
                                {'choice_text': '0%', 'choice_text_arabic': '0%', 'is_correct': False},
                                {'choice_text': '50%', 'choice_text_arabic': '50%', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Energy in an RL Circuit',
                    'title_arabic': 'الطاقة في دارة RL',
                    'description': 'Understanding energy storage and dissipation in RL circuits.',
                    'description_arabic': 'فهم تخزين وتبديد الطاقة في دوائر RL.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is the formula for the energy (E) stored in an inductor with inductance L and current I?',
                            'question_text_arabic': 'ما هي صيغة الطاقة (E) المخزنة في وشيعة تحريضها L وتيارها I؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'E = ½ * L * I²', 'choice_text_arabic': 'E = ½ * L * I²', 'is_correct': True},
                                {'choice_text': 'E = ½ * L² * I', 'choice_text_arabic': 'E = ½ * L² * I', 'is_correct': False},
                                {'choice_text': 'E = L * I', 'choice_text_arabic': 'E = L * I', 'is_correct': False},
                                {'choice_text': 'E = L * I²', 'choice_text_arabic': 'E = L * I²', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What happens to the energy stored in an inductor when the circuit is suddenly opened?',
                            'question_text_arabic': 'ماذا يحدث للطاقة المخزنة في وشيعة عند فتح الدارة فجأة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'It is dissipated, often as a spark across the switch', 'choice_text_arabic': 'تتبدد، غالبًا على شكل شرارة عبر القاطع', 'is_correct': True},
                                {'choice_text': 'It returns to the power source', 'choice_text_arabic': 'تعود إلى مصدر الطاقة', 'is_correct': False},
                                {'choice_text': 'It is stored indefinitely', 'choice_text_arabic': 'تُخزن إلى أجل غير مسمى', 'is_correct': False},
                                {'choice_text': 'It is converted to potential energy', 'choice_text_arabic': 'تتحول إلى طاقة كامنة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'An inductor of 5 H has a steady current of 2 A flowing through it. Calculate the energy stored.',
                            'question_text_arabic': 'وشيعة تحريضها 5 H يمر بها تيار مستمر شدته 2 A. احسب الطاقة المخزنة.',
                            'question_type': 'open_short',
                            'correct_answer': '10 J'
                        }
                    ]
                },
                {
                    'title': 'Advanced RL Circuit Analysis',
                    'title_arabic': 'تحليل متقدم لدارة RL',
                    'description': 'Solving more complex problems related to RL circuits.',
                    'description_arabic': 'حل مسائل أكثر تعقيدًا تتعلق بدوائر RL.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'In an RL circuit connected to a DC source, what is the voltage across the inductor after a long time (t → ∞)?',
                            'question_text_arabic': 'في دارة RL متصلة بمصدر تيار مستمر، ما هو الجهد عبر الوشيعة بعد وقت طويل جدًا (t → ∞)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '0 V', 'choice_text_arabic': '0 فولت', 'is_correct': True},
                                {'choice_text': 'Equal to the source voltage', 'choice_text_arabic': 'يساوي جهد المصدر', 'is_correct': False},
                                {'choice_text': 'Infinite', 'choice_text_arabic': 'لانهائي', 'is_correct': False},
                                {'choice_text': 'Half the source voltage', 'choice_text_arabic': 'نصف جهد المصدر', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'An RL circuit with L = 200 mH and R = 10 Ω is connected to a 5V source. What is the initial rate of change of current (di/dt) at t=0?',
                            'question_text_arabic': 'دارة RL بها L = 200 mH و R = 10 Ω متصلة بمصدر 5V. ما هو المعدل الأولي لتغير التيار (di/dt) عند t=0؟',
                            'question_type': 'open_short',
                            'correct_answer': '25 A/s'
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
                    f'Successfully created for Lesson 41 (RL Dipole / RL Circuit):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 41 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
