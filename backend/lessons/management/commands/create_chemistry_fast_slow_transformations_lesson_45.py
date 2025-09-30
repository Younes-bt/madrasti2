from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Fast and slow chemical transformations - Lesson ID: 45'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=45)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Identifying Fast and Slow Reactions',
                    'title_arabic': 'تحديد التفاعلات السريعة والبطيئة',
                    'description': 'Distinguishing between chemical reactions based on their speed.',
                    'description_arabic': 'التمييز بين التفاعلات الكيميائية بناءً على سرعتها.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'Which of the following is an example of a very fast reaction?',
                            'question_text_arabic': 'أي مما يلي مثال على تفاعل سريع جدًا؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Explosion of dynamite', 'choice_text_arabic': 'انفجار الديناميت', 'is_correct': True},
                                {'choice_text': 'Rusting of iron', 'choice_text_arabic': 'صدأ الحديد', 'is_correct': False},
                                {'choice_text': 'Fermentation of grapes', 'choice_text_arabic': 'تخمر العنب', 'is_correct': False},
                                {'choice_text': 'Formation of petroleum', 'choice_text_arabic': 'تكون البترول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The rusting of iron is considered a slow chemical transformation.',
                            'question_text_arabic': 'يعتبر صدأ الحديد تحولاً كيميائياً بطيئاً.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A reaction that is complete the moment the reactants are mixed is called:',
                            'question_text_arabic': 'يسمى التفاعل الذي يكتمل في لحظة خلط المتفاعلات:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'An instantaneous reaction', 'choice_text_arabic': 'تفاعل لحظي', 'is_correct': True},
                                {'choice_text': 'A slow reaction', 'choice_text_arabic': 'تفاعل بطيء', 'is_correct': False},
                                {'choice_text': 'A reversible reaction', 'choice_text_arabic': 'تفاعل عكسي', 'is_correct': False},
                                {'choice_text': 'An equilibrium reaction', 'choice_text_arabic': 'تفاعل متوازن', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Factors Affecting Reaction Rate',
                    'title_arabic': 'العوامل المؤثرة على سرعة التفاعل',
                    'description': 'Understanding the factors that can change the speed of a reaction.',
                    'description_arabic': 'فهم العوامل التي يمكن أن تغير سرعة التفاعل.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Increasing the temperature generally increases the rate of a chemical reaction.',
                            'question_text_arabic': 'زيادة درجة الحرارة تزيد بشكل عام من سرعة التفاعل الكيميائي.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Which of the following factors does NOT typically increase the rate of a reaction?',
                            'question_text_arabic': 'أي من العوامل التالية لا يزيد عادة من سرعة التفاعل؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Decreasing the concentration of reactants', 'choice_text_arabic': 'تقليل تركيز المتفاعلات', 'is_correct': True},
                                {'choice_text': 'Increasing the surface area of a solid reactant', 'choice_text_arabic': 'زيادة مساحة سطح متفاعل صلب', 'is_correct': False},
                                {'choice_text': 'Adding a catalyst', 'choice_text_arabic': 'إضافة عامل حفاز', 'is_correct': False},
                                {'choice_text': 'Increasing the temperature', 'choice_text_arabic': 'زيادة درجة الحرارة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the role of a catalyst in a chemical reaction?',
                            'question_text_arabic': 'ما هو دور العامل الحفاز في التفاعل الكيميائي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'It increases the reaction rate without being consumed', 'choice_text_arabic': 'يزيد من سرعة التفاعل دون أن يُستهلك', 'is_correct': True},
                                {'choice_text': 'It is a reactant that gets used up', 'choice_text_arabic': 'هو متفاعل يُستهلك', 'is_correct': False},
                                {'choice_text': 'It slows down the reaction', 'choice_text_arabic': 'يبطئ التفاعل', 'is_correct': False},
                                {'choice_text': 'It changes the products of the reaction', 'choice_text_arabic': 'يغير نواتج التفاعل', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Monitoring Chemical Transformations',
                    'title_arabic': 'تتبع التحولات الكيميائية',
                    'description': 'Methods used to follow the progress of a reaction over time.',
                    'description_arabic': 'الطرق المستخدمة لمتابعة تقدم التفاعل مع مرور الوقت.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Which of the following physical properties can be used to monitor the rate of a reaction that produces a gas?',
                            'question_text_arabic': 'أي من الخصائص الفيزيائية التالية يمكن استخدامها لمراقبة سرعة تفاعل ينتج غازًا؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Change in pressure or volume', 'choice_text_arabic': 'التغير في الضغط أو الحجم', 'is_correct': True},
                                {'choice_text': 'Change in mass', 'choice_text_arabic': 'التغير في الكتلة', 'is_correct': False},
                                {'choice_text': 'Change in color', 'choice_text_arabic': 'التغير في اللون', 'is_correct': False},
                                {'choice_text': 'Change in temperature', 'choice_text_arabic': 'التغير في درجة الحرارة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Titration can be used to monitor the concentration of a reactant or product over time.',
                            'question_text_arabic': 'يمكن استخدام المعايرة لمراقبة تركيز متفاعل أو ناتج مع مرور الوقت.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A colorimeter or spectrophotometer is used to monitor reactions that involve a change in color.',
                            'question_text_arabic': 'يستخدم مقياس الألوان أو مطياف الامتصاص لمراقبة التفاعلات التي تنطوي على تغير في اللون.',
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
                        points=10 if ex_data['difficulty'] == 'beginner' else 15
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
                    f'Successfully created for Lesson 45 (Fast and slow chemical transformations):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 45 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
