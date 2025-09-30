from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Controlling the evolution of chemical systems - Lesson ID: 67'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=67)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Factors Affecting Reaction Rate',
                    'title_arabic': 'العوامل المؤثرة على سرعة التفاعل',
                    'description': 'Reviewing the factors that control the speed of chemical reactions.',
                    'description_arabic': 'مراجعة العوامل التي تتحكم في سرعة التفاعلات الكيميائية.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'Increasing the concentration of reactants generally increases the reaction rate.',
                            'question_text_arabic': 'زيادة تركيز المتفاعلات تزيد بشكل عام من سرعة التفاعل.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A catalyst increases the rate of a reaction by being consumed in the process.',
                            'question_text_arabic': 'يزيد العامل الحفاز من سرعة التفاعل عن طريق استهلاكه في العملية.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        },
                        {
                            'question_text': 'Increasing the temperature of a reaction usually slows it down.',
                            'question_text_arabic': 'عادة ما تؤدي زيادة درجة حرارة التفاعل إلى إبطائه.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        }
                    ]
                },
                {
                    'title': 'Controlling Equilibrium',
                    'title_arabic': 'التحكم في التوازن',
                    'description': 'Applying Le Chatelier\'s principle to control the outcome of reversible reactions.',
                    'description_arabic': 'تطبيق مبدأ لو شاتولييه للتحكم في نتيجة التفاعلات العكوسة.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'To increase the yield of an exothermic reaction, one should decrease the temperature.',
                            'question_text_arabic': 'لزيادة مردود تفاعل طارد للحرارة، يجب خفض درجة الحرارة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'For the reaction N₂(g) + 3H₂(g) ⇌ 2NH₃(g), increasing the pressure will shift the equilibrium to the right, favoring the formation of ammonia.',
                            'question_text_arabic': 'للتفاعل N₂(g) + 3H₂(g) ⇌ 2NH₃(g)، ستؤدي زيادة الضغط إلى إزاحة التوازن إلى اليمين، مما يفضل تكوين الأمونيا.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Removing a product from a reaction mixture at equilibrium will cause the reaction to shift to the left.',
                            'question_text_arabic': 'إزالة أحد النواتج من خليط تفاعل في حالة توازن سيؤدي إلى إزاحة التفاعل إلى اليسار.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        }
                    ]
                },
                {
                    'title': 'Industrial Applications',
                    'title_arabic': 'التطبيقات الصناعية',
                    'description': 'Understanding how reaction conditions are optimized in industrial processes.',
                    'description_arabic': 'فهم كيفية تحسين ظروف التفاعل في العمليات الصناعية.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'The Haber-Bosch process for ammonia synthesis is typically carried out at high pressures and moderate temperatures.',
                            'question_text_arabic': 'تتم عملية هابر-بوش لتصنيع الأمونيا عادة عند ضغوط عالية ودرجات حرارة معتدلة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'In industrial processes, a compromise is often made between reaction rate and equilibrium yield.',
                            'question_text_arabic': 'في العمليات الصناعية، غالبًا ما يتم التوصل إلى حل وسط بين سرعة التفاعل ومردود التوازن.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Why is a catalyst used in the Haber-Bosch process even though it doesn\'t change the equilibrium position?',
                            'question_text_arabic': 'لماذا يستخدم عامل حفاز في عملية هابر-بوش على الرغم من أنه لا يغير موضع التوازن؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'To increase the rate at which equilibrium is reached', 'choice_text_arabic': 'لزيادة السرعة التي يتم بها الوصول إلى التوازن', 'is_correct': True},
                                {'choice_text': 'To increase the yield of ammonia', 'choice_text_arabic': 'لزيادة مردود الأمونيا', 'is_correct': False},
                                {'choice_text': 'To decrease the pressure required', 'choice_text_arabic': 'لتقليل الضغط المطلوب', 'is_correct': False},
                                {'choice_text': 'To make the reaction exothermic', 'choice_text_arabic': 'لجعل التفاعل طاردًا للحرارة', 'is_correct': False}
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
                        points=10 if ex_data['difficulty'] == 'beginner' else (15 if ex_data['difficulty'] == 'intermediate' else 20)
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
                    completion_points=40,
                    completion_coins=2,
                    perfect_score_bonus=25
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created for Lesson 67 (Controlling the evolution of chemical systems):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 67 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
