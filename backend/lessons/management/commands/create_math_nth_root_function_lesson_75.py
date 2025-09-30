from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for The nth root function - Lesson ID: 75'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=75)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Definition and Properties of nth Roots',
                    'title_arabic': 'تعريف وخصائص الجذر النوني',
                    'description': 'Understanding the concept of the nth root.',
                    'description_arabic': 'فهم مفهوم الجذر النوني.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'The nth root of a number x is a number r which, when raised to the power n, equals x.',
                            'question_text_arabic': 'الجذر النوني لعدد x هو عدد r الذي، عند رفعه للقوة n، يساوي x.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the principal square root of 9?',
                            'question_text_arabic': 'ما هو الجذر التربيعي الرئيسي لـ 9؟',
                            'question_type': 'open_short',
                            'correct_answer': '3'
                        },
                        {
                            'question_text': 'What is the cube root of -27?',
                            'question_text_arabic': 'ما هو الجذر التكعيبي لـ -27؟',
                            'question_type': 'open_short',
                            'correct_answer': '-3'
                        }
                    ]
                },
                {
                    'title': 'Simplifying Radicals',
                    'title_arabic': 'تبسيط الجذور',
                    'description': 'Learning to simplify expressions involving nth roots.',
                    'description_arabic': 'تعلم تبسيط التعابير التي تتضمن الجذور النونية.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Simplify √72.',
                            'question_text_arabic': 'بسط √72.',
                            'question_type': 'open_short',
                            'correct_answer': '6√2'
                        },
                        {
                            'question_text': 'The expression ³√16 can be simplified to 2 * ³√2.',
                            'question_text_arabic': 'يمكن تبسيط التعبير ³√16 إلى 2 * ³√2.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'To rationalize the denominator of 1/√3, you multiply the numerator and denominator by √3.',
                            'question_text_arabic': 'لإنطاق مقام 1/√3، تضرب البسط والمقام في √3.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Solving Radical Equations',
                    'title_arabic': 'حل المعادلات الجذرية',
                    'description': 'Solving equations that contain radical expressions.',
                    'description_arabic': 'حل المعادلات التي تحتوي على تعابير جذرية.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'Solve for x: √(x + 2) = 3.',
                            'question_text_arabic': 'حل لـ x: √(x + 2) = 3.',
                            'question_type': 'open_short',
                            'correct_answer': '7'
                        },
                        {
                            'question_text': 'When solving radical equations, it is important to check for extraneous solutions.',
                            'question_text_arabic': 'عند حل المعادلات الجذرية، من المهم التحقق من الحلول الدخيلة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Solve for x: ³√(2x - 4) - 2 = 0.',
                            'question_text_arabic': 'حل لـ x: ³√(2x - 4) - 2 = 0.',
                            'question_type': 'open_short',
                            'correct_answer': '6'
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
                    f'Successfully created for Lesson 75 (The nth root function):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 75 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
