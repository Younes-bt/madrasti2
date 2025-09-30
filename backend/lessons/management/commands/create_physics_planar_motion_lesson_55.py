from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Planar motion (Motion in a plane) - Lesson ID: 55'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=55)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Projectile Motion Basics',
                    'title_arabic': 'أساسيات حركة المقذوفات',
                    'description': 'Understanding the basic principles of projectile motion.',
                    'description_arabic': 'فهم المبادئ الأساسية لحركة المقذوفات.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'The path of a projectile in the absence of air resistance is a:',
                            'question_text_arabic': 'مسار المقذوف في غياب مقاومة الهواء هو:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Parabola', 'choice_text_arabic': 'قطع مكافئ', 'is_correct': True},
                                {'choice_text': 'Straight line', 'choice_text_arabic': 'خط مستقيم', 'is_correct': False},
                                {'choice_text': 'Circle', 'choice_text_arabic': 'دائرة', 'is_correct': False},
                                {'choice_text': 'Hyperbola', 'choice_text_arabic': 'قطع زائد', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The horizontal component of a projectile\'s velocity is constant throughout its flight (ignoring air resistance).',
                            'question_text_arabic': 'المركبة الأفقية لسرعة المقذوف ثابتة طوال رحلته (مع إهمال مقاومة الهواء).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The vertical component of a projectile\'s acceleration is always equal to -g.',
                            'question_text_arabic': 'المركبة الرأسية لتسارع المقذوف تساوي دائمًا -g.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Analyzing Projectile Motion',
                    'title_arabic': 'تحليل حركة المقذوفات',
                    'description': 'Calculating key parameters of projectile motion.',
                    'description_arabic': 'حساب المعلمات الرئيسية لحركة المقذوفات.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'A projectile is fired with an initial velocity of 50 m/s at an angle of 30° above the horizontal. What is the initial horizontal component of the velocity?',
                            'question_text_arabic': 'أُطلق مقذوف بسرعة ابتدائية 50 م/ث بزاوية 30 درجة فوق الأفقي. ما هي المركبة الأفقية الابتدائية للسرعة؟',
                            'question_type': 'open_short',
                            'correct_answer': '43.3 m/s'
                        },
                        {
                            'question_text': 'For the same projectile, what is the initial vertical component of the velocity?',
                            'question_text_arabic': 'لنفس المقذوف، ما هي المركبة الرأسية الابتدائية للسرعة؟',
                            'question_type': 'open_short',
                            'correct_answer': '25 m/s'
                        },
                        {
                            'question_text': 'At the highest point of its trajectory, the vertical velocity of a projectile is zero.',
                            'question_text_arabic': 'عند أعلى نقطة في مساره، تكون السرعة الرأسية للمقذوف صفرًا.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Range and Maximum Height',
                    'title_arabic': 'المدى والارتفاع الأقصى',
                    'description': 'Calculating the range and maximum height of a projectile.',
                    'description_arabic': 'حساب مدى وارتفاع أقصى لمقذوف.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'The maximum range of a projectile is achieved at a launch angle of 45 degrees (ignoring air resistance).',
                            'question_text_arabic': 'يتم تحقيق أقصى مدى لمقذوف عند زاوية إطلاق 45 درجة (مع إهمال مقاومة الهواء).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A projectile is fired from the ground with an initial vertical velocity of 49 m/s. What is the maximum height it reaches? (Use g = 9.8 m/s²)',
                            'question_text_arabic': 'أُطلق مقذوف من الأرض بسرعة رأسية ابتدائية 49 م/ث. ما هو أقصى ارتفاع يصل إليه؟ (استخدم g = 9.8 م/ث²)',
                            'question_type': 'open_short',
                            'correct_answer': '122.5 m'
                        },
                        {
                            'question_text': 'The time of flight for a projectile launched and landing at the same height depends only on the initial vertical component of its velocity.',
                            'question_text_arabic': 'يعتمد زمن التحليق لمقذوف أُطلق وهبط على نفس الارتفاع فقط على المركبة الرأسية الابتدائية لسرعته.',
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
                    f'Successfully created for Lesson 55 (Planar motion (Motion in a plane)):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 55 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
