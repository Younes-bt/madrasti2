from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Inverse function - Lesson ID: 74'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=74)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Concept of Inverse Functions',
                    'title_arabic': 'مفهوم الدوال العكسية',
                    'description': 'Understanding what an inverse function is and its properties.',
                    'description_arabic': 'فهم ما هي الدالة العكسية وخصائصها.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'A function must be one-to-one to have an inverse function.',
                            'question_text_arabic': 'يجب أن تكون الدالة واحد لواحد ليكون لها دالة عكسية.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The graph of an inverse function is a reflection of the original function across the line y = x.',
                            'question_text_arabic': 'التمثيل البياني للدالة العكسية هو انعكاس للدالة الأصلية عبر المستقيم y = x.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'If f(x) = 2x, what is its inverse function f⁻¹(x)?',
                            'question_text_arabic': 'إذا كانت f(x) = 2x، فما هي دالتها العكسية f⁻¹(x)؟',
                            'question_type': 'open_short',
                            'correct_answer': 'x/2'
                        }
                    ]
                },
                {
                    'title': 'Finding Inverse Functions',
                    'title_arabic': 'إيجاد الدوال العكسية',
                    'description': 'Learning the algebraic method for finding the inverse of a function.',
                    'description_arabic': 'تعلم الطريقة الجبرية لإيجاد معكوس دالة.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'To find the inverse of a function, you swap x and y and then solve for y.',
                            'question_text_arabic': 'لإيجاد معكوس دالة، تقوم بتبديل x و y ثم تحل لـ y.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Find the inverse of the function f(x) = 3x - 6.',
                            'question_text_arabic': 'أوجد معكوس الدالة f(x) = 3x - 6.',
                            'question_type': 'open_short',
                            'correct_answer': '(x+6)/3'
                        },
                        {
                            'question_text': 'The domain of a function is the range of its inverse, and the range of the function is the domain of its inverse.',
                            'question_text_arabic': 'مجال تعريف الدالة هو مدى معكوسها، ومدى الدالة هو مجال تعريف معكوسها.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Inverse Trigonometric and Logarithmic Functions',
                    'title_arabic': 'الدوال المثلثية واللوغاريتمية العكسية',
                    'description': 'Understanding the inverse of common transcendental functions.',
                    'description_arabic': 'فهم معكوس الدوال المتسامية الشائعة.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'The inverse of the exponential function f(x) = aˣ is the logarithmic function f⁻¹(x) = logₐ(x).',
                            'question_text_arabic': 'معكوس الدالة الأسية f(x) = aˣ هو الدالة اللوغاريتمية f⁻¹(x) = logₐ(x).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The domain of the arcsin(x) function is [-1, 1].',
                            'question_text_arabic': 'مجال تعريف دالة arcsin(x) هو [-1, 1].',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the value of arcsin(1)?',
                            'question_text_arabic': 'ما هي قيمة arcsin(1)؟',
                            'question_type': 'open_short',
                            'correct_answer': 'π/2'
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
                    f'Successfully created for Lesson 74 (Inverse function):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 74 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
