from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Forced oscillations in a series RLC circuit - Lesson ID: 44'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=44)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Forced Oscillations Fundamentals',
                    'title_arabic': 'أساسيات التذبذبات القسرية',
                    'description': 'Understanding the concept of a driving force in an RLC circuit.',
                    'description_arabic': 'فهم مفهوم القوة الدافعة في دارة RLC.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is a forced oscillation?',
                            'question_text_arabic': 'ما هو التذبذب القسري؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'An oscillation maintained by an external periodic driving force', 'choice_text_arabic': 'تذبذب يُحافظ عليه بواسطة قوة دافعة دورية خارجية', 'is_correct': True},
                                {'choice_text': 'An oscillation that occurs naturally without any external force', 'choice_text_arabic': 'تذبذب يحدث بشكل طبيعي دون أي قوة خارجية', 'is_correct': False},
                                {'choice_text': 'An oscillation that decays to zero', 'choice_text_arabic': 'تذبذب يتلاشى إلى الصفر', 'is_correct': False},
                                {'choice_text': 'An oscillation with increasing amplitude', 'choice_text_arabic': 'تذبذب بوسع متزايد', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In a forced RLC circuit, the circuit is driven by an AC voltage source.',
                            'question_text_arabic': 'في دارة RLC قسرية، يتم تشغيل الدارة بواسطة مصدر جهد متردد.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'After the initial transient state, the circuit settles into a steady-state oscillation at the frequency of the driving source.',
                            'question_text_arabic': 'بعد الحالة العابرة الأولية، تستقر الدارة في تذبذب حالة مستقرة عند تردد المصدر الدافع.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Steady-State Response and Resonance',
                    'title_arabic': 'استجابة الحالة المستقرة والرنين',
                    'description': 'Analyzing the circuit\'s behavior at different driving frequencies.',
                    'description_arabic': 'تحليل سلوك الدارة عند ترددات دافعة مختلفة.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'At what frequency does the current amplitude in a series RLC circuit become maximum?',
                            'question_text_arabic': 'عند أي تردد يصبح وسع التيار في دارة RLC على التوالي أقصى ما يمكن؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'At the resonant frequency', 'choice_text_arabic': 'عند تردد الرنين', 'is_correct': True},
                                {'choice_text': 'At a very low frequency', 'choice_text_arabic': 'عند تردد منخفض جدا', 'is_correct': False},
                                {'choice_text': 'At a very high frequency', 'choice_text_arabic': 'عند تردد عال جدا', 'is_correct': False},
                                {'choice_text': 'It is always constant', 'choice_text_arabic': 'إنه ثابت دائما', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The phenomenon of the current amplitude peaking at a specific driving frequency is called resonance.',
                            'question_text_arabic': 'تسمى ظاهرة وصول وسع التيار إلى ذروته عند تردد دافع معين بالرنين.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the phase difference between the driving voltage and the current at resonance?',
                            'question_text_arabic': 'ما هو فرق الطور بين الجهد الدافع والتيار عند الرنين؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '0 degrees', 'choice_text_arabic': '0 درجة', 'is_correct': True},
                                {'choice_text': '90 degrees', 'choice_text_arabic': '90 درجة', 'is_correct': False},
                                {'choice_text': '-90 degrees', 'choice_text_arabic': '-90 درجة', 'is_correct': False},
                                {'choice_text': '180 degrees', 'choice_text_arabic': '180 درجة', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Power in Forced RLC Circuits',
                    'title_arabic': 'القدرة في دوائر RLC القسرية',
                    'description': 'Analyzing the power absorbed by the circuit.',
                    'description_arabic': 'تحليل القدرة الممتصة من طرف الدارة.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'Which component in a series RLC circuit dissipates energy?',
                            'question_text_arabic': 'أي مكون في دارة RLC على التوالي يبدد الطاقة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The resistor', 'choice_text_arabic': 'المقاوم', 'is_correct': True},
                                {'choice_text': 'The inductor', 'choice_text_arabic': 'الوشيعة', 'is_correct': False},
                                {'choice_text': 'The capacitor', 'choice_text_arabic': 'المكثف', 'is_correct': False},
                                {'choice_text': 'The source', 'choice_text_arabic': 'المصدر', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The average power delivered to the circuit is maximum at resonance.',
                            'question_text_arabic': 'تكون القدرة المتوسطة المزودة للدارة قصوى عند الرنين.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the formula for the average power P_avg dissipated in a series RLC circuit?',
                            'question_text_arabic': 'ما هي صيغة القدرة المتوسطة P_avg المبددة في دارة RLC على التوالي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'P_avg = I_rms * V_rms * cos(φ)', 'choice_text_arabic': 'P_avg = I_rms * V_rms * cos(φ)', 'is_correct': True},
                                {'choice_text': 'P_avg = I_rms * V_rms', 'choice_text_arabic': 'P_avg = I_rms * V_rms', 'is_correct': False},
                                {'choice_text': 'P_avg = I_rms * V_rms * sin(φ)', 'choice_text_arabic': 'P_avg = I_rms * V_rms * sin(φ)', 'is_correct': False},
                                {'choice_text': 'P_avg = I_max * V_max', 'choice_text_arabic': 'P_avg = I_max * V_max', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Quality Factor and Bandwidth',
                    'title_arabic': 'عامل الجودة وعرض النطاق',
                    'description': 'Relating the sharpness of resonance to the circuit parameters.',
                    'description_arabic': 'ربط حدة الرنين بمعلمات الدارة.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'A high Q factor implies a:',
                            'question_text_arabic': 'عامل جودة عالٍ (Q) يعني:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Sharp resonance peak and narrow bandwidth', 'choice_text_arabic': 'قمة رنين حادة وعرض نطاق ضيق', 'is_correct': True},
                                {'choice_text': 'Broad resonance peak and wide bandwidth', 'choice_text_arabic': 'قمة رنين عريضة وعرض نطاق واسع', 'is_correct': False},
                                {'choice_text': 'Low resonant frequency', 'choice_text_arabic': 'تردد رنين منخفض', 'is_correct': False},
                                {'choice_text': 'High power dissipation', 'choice_text_arabic': 'تبديد قدرة عالٍ', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The bandwidth of the resonance curve is the range of frequencies over which the power is greater than or equal to half its maximum value.',
                            'question_text_arabic': 'عرض نطاق منحنى الرنين هو مدى الترددات التي تكون فيها القدرة أكبر من أو تساوي نصف قيمتها القصوى.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'How is the quality factor Q related to the resonant angular frequency ω₀ and the bandwidth Δω?',
                            'question_text_arabic': 'كيف يرتبط عامل الجودة Q بالتردد الزاوي الرنيني ω₀ وعرض النطاق Δω؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Q = ω₀ / Δω', 'choice_text_arabic': 'Q = ω₀ / Δω', 'is_correct': True},
                                {'choice_text': 'Q = Δω / ω₀', 'choice_text_arabic': 'Q = Δω / ω₀', 'is_correct': False},
                                {'choice_text': 'Q = ω₀ * Δω', 'choice_text_arabic': 'Q = ω₀ * Δω', 'is_correct': False},
                                {'choice_text': 'Q = 1 / (ω₀ * Δω)', 'choice_text_arabic': 'Q = 1 / (ω₀ * Δω)', 'is_correct': False}
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
                    f'Successfully created for Lesson 44 (Forced oscillations in a series RLC circuit):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 44 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
