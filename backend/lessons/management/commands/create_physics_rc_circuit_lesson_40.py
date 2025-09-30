from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for RC Dipole / RC Circuit - Lesson ID: 40'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=40)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Components of an RC Circuit',
                    'title_arabic': 'مكونات دارة RC',
                    'description': 'Understanding the roles of resistors and capacitors.',
                    'description_arabic': 'فهم أدوار المقاومات والمكثفات.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What does a capacitor store?',
                            'question_text_arabic': 'ماذا يخزن المكثف؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Electric charge / energy', 'choice_text_arabic': 'شحنة / طاقة كهربائية', 'is_correct': True},
                                {'choice_text': 'Magnetic field', 'choice_text_arabic': 'مجال مغناطيسي', 'is_correct': False},
                                {'choice_text': 'Current', 'choice_text_arabic': 'تيار', 'is_correct': False},
                                {'choice_text': 'Voltage', 'choice_text_arabic': 'جهد', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The unit of capacitance is the Farad (F).',
                            'question_text_arabic': 'وحدة السعة هي الفاراد (F).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the primary function of the resistor in an RC circuit?',
                            'question_text_arabic': 'ما هي الوظيفة الأساسية للمقاوم في دارة RC؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'To limit the current flow', 'choice_text_arabic': 'للحد من تدفق التيار', 'is_correct': True},
                                {'choice_text': 'To store energy', 'choice_text_arabic': 'لتخزين الطاقة', 'is_correct': False},
                                {'choice_text': 'To generate voltage', 'choice_text_arabic': 'لتوليد الجهد', 'is_correct': False},
                                {'choice_text': 'To increase current', 'choice_text_arabic': 'لزيادة التيار', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Charging a Capacitor',
                    'title_arabic': 'شحن مكثف',
                    'description': 'Analyzing the process of charging a capacitor in an RC circuit.',
                    'description_arabic': 'تحليل عملية شحن مكثف في دارة RC.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the time constant (τ) of an RC circuit?',
                            'question_text_arabic': 'ما هي ثابتة الزمن (τ) لدارة RC؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'τ = R * C', 'choice_text_arabic': 'τ = R * C', 'is_correct': True},
                                {'choice_text': 'τ = R / C', 'choice_text_arabic': 'τ = R / C', 'is_correct': False},
                                {'choice_text': 'τ = C / R', 'choice_text_arabic': 'τ = C / R', 'is_correct': False},
                                {'choice_text': 'τ = R + C', 'choice_text_arabic': 'τ = R + C', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'At the very beginning of the charging process (t=0), the current in the circuit is maximum.',
                            'question_text_arabic': 'في بداية عملية الشحن (t=0)، يكون التيار في الدارة أقصى ما يمكن.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'After one time constant (τ), the capacitor is charged to approximately what percentage of the source voltage?',
                            'question_text_arabic': 'بعد مرور ثابتة زمن واحدة (τ)، يُشحن المكثف إلى ما يقرب من أي نسبة مئوية من جهد المصدر؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '63%', 'choice_text_arabic': '63%', 'is_correct': True},
                                {'choice_text': '37%', 'choice_text_arabic': '37%', 'is_correct': False},
                                {'choice_text': '100%', 'choice_text_arabic': '100%', 'is_correct': False},
                                {'choice_text': '50%', 'choice_text_arabic': '50%', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'An RC circuit has R = 10 kΩ and C = 100 µF. Calculate the time constant.',
                            'question_text_arabic': 'دارة RC بها R = 10 kΩ و C = 100 µF. احسب ثابتة الزمن.',
                            'question_type': 'open_short',
                            'correct_answer': '1 s'
                        }
                    ]
                },
                {
                    'title': 'Discharging a Capacitor',
                    'title_arabic': 'تفريغ مكثف',
                    'description': 'Analyzing the process of discharging a capacitor.',
                    'description_arabic': 'تحليل عملية تفريغ مكثف.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'During discharge, the voltage across the capacitor decreases exponentially.',
                            'question_text_arabic': 'أثناء التفريغ، ينخفض الجهد عبر المكثف بشكل أسي.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the equation for the voltage Vc(t) across a discharging capacitor?',
                            'question_text_arabic': 'ما هي معادلة الجهد Vc(t) عبر مكثف قيد التفريغ؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Vc(t) = V₀ * e^(-t/τ)', 'choice_text_arabic': 'Vc(t) = V₀ * e^(-t/τ)', 'is_correct': True},
                                {'choice_text': 'Vc(t) = V₀ * (1 - e^(-t/τ))', 'choice_text_arabic': 'Vc(t) = V₀ * (1 - e^(-t/τ))', 'is_correct': False},
                                {'choice_text': 'Vc(t) = V₀ * e^(t/τ)', 'choice_text_arabic': 'Vc(t) = V₀ * e^(t/τ)', 'is_correct': False},
                                {'choice_text': 'Vc(t) = V₀ * t / τ', 'choice_text_arabic': 'Vc(t) = V₀ * t / τ', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'After one time constant (τ) of discharging, what percentage of the initial voltage remains?',
                            'question_text_arabic': 'بعد مرور ثابتة زمن واحدة (τ) من التفريغ، ما النسبة المئوية المتبقية من الجهد الأولي؟',
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
                    'title': 'Energy in an RC Circuit',
                    'title_arabic': 'الطاقة في دارة RC',
                    'description': 'Understanding energy storage and dissipation in RC circuits.',
                    'description_arabic': 'فهم تخزين وتبديد الطاقة في دوائر RC.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is the formula for the energy (E) stored in a capacitor with capacitance C and voltage V?',
                            'question_text_arabic': 'ما هي صيغة الطاقة (E) المخزنة في مكثف سعته C وجهده V؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'E = ½ * C * V²', 'choice_text_arabic': 'E = ½ * C * V²', 'is_correct': True},
                                {'choice_text': 'E = ½ * C² * V', 'choice_text_arabic': 'E = ½ * C² * V', 'is_correct': False},
                                {'choice_text': 'E = C * V', 'choice_text_arabic': 'E = C * V', 'is_correct': False},
                                {'choice_text': 'E = C * V²', 'choice_text_arabic': 'E = C * V²', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'When a capacitor is charged through a resistor, the total energy dissipated as heat in the resistor is equal to the energy stored in the capacitor.',
                            'question_text_arabic': 'عند شحن مكثف عبر مقاوم، فإن الطاقة الإجمالية المبددة كحرارة في المقاوم تساوي الطاقة المخزنة في المكثف.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A 100 µF capacitor is charged to 20 V. Calculate the maximum energy stored.',
                            'question_text_arabic': 'مكثف سعته 100 µF مشحون بجهد 20 V. احسب الطاقة القصوى المخزنة.',
                            'question_type': 'open_short',
                            'correct_answer': '0.02 J'
                        }
                    ]
                },
                {
                    'title': 'Advanced RC Circuit Analysis',
                    'title_arabic': 'تحليل متقدم لدارة RC',
                    'description': 'Solving more complex problems related to RC circuits.',
                    'description_arabic': 'حل مسائل أكثر تعقيدًا تتعلق بدوائر RC.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'A capacitor is considered fully charged after approximately how many time constants?',
                            'question_text_arabic': 'يعتبر المكثف مشحونًا بالكامل بعد مرور كم ثابتة زمن تقريبًا؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '5τ', 'choice_text_arabic': '5τ', 'is_correct': True},
                                {'choice_text': '1τ', 'choice_text_arabic': '1τ', 'is_correct': False},
                                {'choice_text': '2τ', 'choice_text_arabic': '2τ', 'is_correct': False},
                                {'choice_text': '10τ', 'choice_text_arabic': '10τ', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A 10 µF capacitor is charged to 12V and then discharged through a 2 kΩ resistor. What is the initial discharge current?',
                            'question_text_arabic': 'مكثف 10 µF مشحون بجهد 12V ثم يتم تفريغه عبر مقاوم 2 kΩ. ما هو تيار التفريغ الأولي؟',
                            'question_type': 'open_short',
                            'correct_answer': '6 mA'
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
                    f'Successfully created for Lesson 40 (RC Dipole / RC Circuit):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 40 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
