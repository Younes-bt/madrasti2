from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Series RLC circuit - Lesson ID: 42'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=42)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Introduction to RLC Circuits',
                    'title_arabic': 'مقدمة في دوائر RLC',
                    'description': 'Understanding the components and basic concepts of RLC circuits.',
                    'description_arabic': 'فهم مكونات ومفاهيم دوائر RLC الأساسية.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What does "RLC" stand for?',
                            'question_text_arabic': 'ماذا تمثل "RLC"؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Resistor, Inductor, Capacitor', 'choice_text_arabic': 'مقاوم، وشيعة، مكثف', 'is_correct': True},
                                {'choice_text': 'Resistor, Light, Capacitor', 'choice_text_arabic': 'مقاوم، ضوء، مكثف', 'is_correct': False},
                                {'choice_text': 'Relay, Inductor, Circuit', 'choice_text_arabic': 'مرحل، وشيعة، دارة', 'is_correct': False},
                                {'choice_text': 'Resistor, Loop, Current', 'choice_text_arabic': 'مقاوم، حلقة، تيار', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The total opposition to current flow in an AC circuit is called impedance.',
                            'question_text_arabic': 'تسمى المعاوقة الكلية لتدفق التيار في دارة تيار متردد بالممانعة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the unit of impedance?',
                            'question_text_arabic': 'ما هي وحدة الممانعة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Ohm (Ω)', 'choice_text_arabic': 'الأوم (Ω)', 'is_correct': True},
                                {'choice_text': 'Henry (H)', 'choice_text_arabic': 'الهنري (H)', 'is_correct': False},
                                {'choice_text': 'Farad (F)', 'choice_text_arabic': 'الفاراد (F)', 'is_correct': False},
                                {'choice_text': 'Watt (W)', 'choice_text_arabic': 'الواط (W)', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Impedance and Phase Angle',
                    'title_arabic': 'الممانعة وزاوية الطور',
                    'description': 'Calculating the total impedance and phase angle of a series RLC circuit.',
                    'description_arabic': 'حساب الممانعة الكلية وزاوية الطور لدارة RLC على التوالي.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the formula for the total impedance (Z) of a series RLC circuit?',
                            'question_text_arabic': 'ما هي صيغة الممانعة الكلية (Z) لدارة RLC على التوالي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Z = √(R² + (XL - XC)²)', 'choice_text_arabic': 'Z = √(R² + (XL - XC)²)', 'is_correct': True},
                                {'choice_text': 'Z = R + XL + XC', 'choice_text_arabic': 'Z = R + XL + XC', 'is_correct': False},
                                {'choice_text': 'Z = R² + (XL - XC)²', 'choice_text_arabic': 'Z = R² + (XL - XC)²', 'is_correct': False},
                                {'choice_text': 'Z = √(R² + (XL + XC)²)', 'choice_text_arabic': 'Z = √(R² + (XL + XC)²)', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'If the inductive reactance (XL) is greater than the capacitive reactance (XC), the circuit is considered inductive.',
                            'question_text_arabic': 'إذا كانت المفاعلة الحثية (XL) أكبر من المفاعلة السعوية (XC)، تعتبر الدارة حثية.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A series RLC circuit has R=30 Ω, XL=50 Ω, and XC=10 Ω. Calculate the impedance Z.',
                            'question_text_arabic': 'دارة RLC على التوالي بها R=30 Ω, XL=50 Ω, و XC=10 Ω. احسب الممانعة Z.',
                            'question_type': 'open_short',
                            'correct_answer': '50 Ω'
                        }
                    ]
                },
                {
                    'title': 'Resonance in RLC Circuits',
                    'title_arabic': 'الرنين في دوائر RLC',
                    'description': 'Understanding the condition of resonance.',
                    'description_arabic': 'فهم شرط الرنين.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the condition for resonance in a series RLC circuit?',
                            'question_text_arabic': 'ما هو شرط الرنين في دارة RLC على التوالي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'XL = XC', 'choice_text_arabic': 'XL = XC', 'is_correct': True},
                                {'choice_text': 'R = XL', 'choice_text_arabic': 'R = XL', 'is_correct': False},
                                {'choice_text': 'R = XC', 'choice_text_arabic': 'R = XC', 'is_correct': False},
                                {'choice_text': 'Z = 0', 'choice_text_arabic': 'Z = 0', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'At resonance, the impedance of the circuit is at its minimum value, equal to the resistance R.',
                            'question_text_arabic': 'عند الرنين، تكون ممانعة الدارة في قيمتها الدنيا، وتساوي المقاومة R.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the formula for the resonant angular frequency (ω₀)?',
                            'question_text_arabic': 'ما هي صيغة التردد الزاوي الرنيني (ω₀)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'ω₀ = 1 / √(LC)', 'choice_text_arabic': 'ω₀ = 1 / √(LC)', 'is_correct': True},
                                {'choice_text': 'ω₀ = √(L/C)', 'choice_text_arabic': 'ω₀ = √(L/C)', 'is_correct': False},
                                {'choice_text': 'ω₀ = √(C/L)', 'choice_text_arabic': 'ω₀ = √(C/L)', 'is_correct': False},
                                {'choice_text': 'ω₀ = LC', 'choice_text_arabic': 'ω₀ = LC', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Calculate the resonant frequency (f₀) for a circuit with L = 25 mH and C = 10 µF.',
                            'question_text_arabic': 'احسب تردد الرنين (f₀) لدارة بها L = 25 mH و C = 10 µF.',
                            'question_type': 'open_short',
                            'correct_answer': '318 Hz'
                        }
                    ]
                },
                {
                    'title': 'Power and Quality Factor',
                    'title_arabic': 'القدرة وعامل الجودة',
                    'description': 'Understanding power dissipation and the quality factor of an RLC circuit.',
                    'description_arabic': 'فهم تبديد القدرة وعامل الجودة لدارة RLC.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is the power factor of a series RLC circuit at resonance?',
                            'question_text_arabic': 'ما هو عامل القدرة لدارة RLC على التوالي عند الرنين؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '1', 'choice_text_arabic': '1', 'is_correct': True},
                                {'choice_text': '0', 'choice_text_arabic': '0', 'is_correct': False},
                                {'choice_text': '-1', 'choice_text_arabic': '-1', 'is_correct': False},
                                {'choice_text': '0.5', 'choice_text_arabic': '0.5', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A high Quality Factor (Q) corresponds to a sharp, narrow resonance peak.',
                            'question_text_arabic': 'عامل جودة عالٍ (Q) يقابله قمة رنين حادة وضيقة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What does the Quality Factor (Q) of a series RLC circuit measure?',
                            'question_text_arabic': 'ماذا يقيس عامل الجودة (Q) لدارة RLC على التوالي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The sharpness of the resonance', 'choice_text_arabic': 'حدة الرنين', 'is_correct': True},
                                {'choice_text': 'The maximum current', 'choice_text_arabic': 'التيار الأقصى', 'is_correct': False},
                                {'choice_text': 'The total energy stored', 'choice_text_arabic': 'الطاقة الكلية المخزنة', 'is_correct': False},
                                {'choice_text': 'The power dissipated', 'choice_text_arabic': 'القدرة المبددة', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Advanced RLC Circuit Analysis',
                    'title_arabic': 'تحليل متقدم لدارة RLC',
                    'description': 'Solving more complex problems related to RLC circuits.',
                    'description_arabic': 'حل مسائل أكثر تعقيدًا تتعلق بدوائر RLC.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'The bandwidth of a resonance curve is the range of frequencies for which the power is at least half of the maximum power.',
                            'question_text_arabic': 'عرض النطاق لمنحنى الرنين هو مدى الترددات التي تكون فيها القدرة على الأقل نصف القدرة القصوى.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'How is the bandwidth (Δω) related to the resistance (R) and inductance (L)?',
                            'question_text_arabic': 'كيف يرتبط عرض النطاق (Δω) بالمقاومة (R) والتحريض (L)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Δω = R / L', 'choice_text_arabic': 'Δω = R / L', 'is_correct': True},
                                {'choice_text': 'Δω = L / R', 'choice_text_arabic': 'Δω = L / R', 'is_correct': False},
                                {'choice_text': 'Δω = R * L', 'choice_text_arabic': 'Δω = R * L', 'is_correct': False},
                                {'choice_text': 'Δω = 1 / (RL)', 'choice_text_arabic': 'Δω = 1 / (RL)', 'is_correct': False}
                            ]
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
                    f'Successfully created for Lesson 42 (Series RLC circuit):\n' 
                    f'Exercises: {total_exercises}\n' 
                    f'Questions: {total_questions}\n' 
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 42 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
