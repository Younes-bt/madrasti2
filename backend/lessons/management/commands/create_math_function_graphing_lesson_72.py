from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Study of functions and their graphical representation - Lesson ID: 72'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=72)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Domain and Range',
                    'title_arabic': 'مجال التعريف والمدى',
                    'description': 'Determining the domain and range of functions.',
                    'description_arabic': 'تحديد مجال تعريف ومدى الدوال.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'The domain of a function is the set of all possible input values (x-values).',
                            'question_text_arabic': 'مجال تعريف الدالة هو مجموعة كل قيم الإدخال الممكنة (قيم x).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the domain of the function f(x) = 1 / (x - 3)?',
                            'question_text_arabic': 'ما هو مجال تعريف الدالة f(x) = 1 / (x - 3)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'All real numbers except 3', 'choice_text_arabic': 'كل الأعداد الحقيقية ما عدا 3', 'is_correct': True},
                                {'choice_text': 'All real numbers', 'choice_text_arabic': 'كل الأعداد الحقيقية', 'is_correct': False},
                                {'choice_text': 'x > 3', 'choice_text_arabic': 'x > 3', 'is_correct': False},
                                {'choice_text': 'x < 3', 'choice_text_arabic': 'x < 3', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the range of the function f(x) = x²?',
                            'question_text_arabic': 'ما هو مدى الدالة f(x) = x²؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '[0, ∞)', 'choice_text_arabic': '[0, ∞)', 'is_correct': True},
                                {'choice_text': '(-∞, ∞)', 'choice_text_arabic': '(-∞, ∞)', 'is_correct': False},
                                {'choice_text': '(-∞, 0]', 'choice_text_arabic': '(-∞, 0]', 'is_correct': False},
                                {'choice_text': '(0, ∞)', 'choice_text_arabic': '(0, ∞)', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Intercepts and Asymptotes',
                    'title_arabic': 'التقاطعات والمحاذيات',
                    'description': 'Finding intercepts and asymptotes of functions.',
                    'description_arabic': 'إيجاد التقاطعات والمحاذيات للدوال.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'The y-intercept of a function is found by setting x = 0.',
                            'question_text_arabic': 'يتم إيجاد نقطة التقاطع مع محور y للدالة بوضع x = 0.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A vertical asymptote occurs where the function approaches infinity, often where the denominator of a rational function is zero.',
                            'question_text_arabic': 'يحدث المحاذي الرأسي حيث تقترب الدالة من اللانهاية، وغالبًا ما يكون ذلك حيث يكون مقام دالة كسرية صفرًا.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the horizontal asymptote of the function f(x) = (2x + 1) / (x - 3)?',
                            'question_text_arabic': 'ما هو المحاذي الأفقي للدالة f(x) = (2x + 1) / (x - 3)؟',
                            'question_type': 'open_short',
                            'correct_answer': 'y = 2'
                        }
                    ]
                },
                {
                    'title': 'Symmetry and Periodicity',
                    'title_arabic': 'التناظر والدورية',
                    'description': 'Identifying even, odd, and periodic functions.',
                    'description_arabic': 'تحديد الدوال الزوجية والفردية والدورية.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'An even function is symmetric with respect to the y-axis.',
                            'question_text_arabic': 'الدالة الزوجية متناظرة بالنسبة لمحور y.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'An odd function satisfies the condition f(-x) = -f(x).',
                            'question_text_arabic': 'تحقق الدالة الفردية الشرط f(-x) = -f(x).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The function f(x) = sin(x) is a periodic function with a period of 2π.',
                            'question_text_arabic': 'الدالة f(x) = sin(x) هي دالة دورية دورها 2π.',
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
                    f'Successfully created for Lesson 72 (Study of functions and their graphical representation):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 72 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
