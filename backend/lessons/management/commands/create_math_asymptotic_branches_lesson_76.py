from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Asymptotic branches of a curve - Lesson ID: 76'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=76)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Horizontal and Vertical Asymptotes',
                    'title_arabic': 'المحاذيات الأفقية والرأسية',
                    'description': 'Identifying horizontal and vertical asymptotes from the function\'s equation.',
                    'description_arabic': 'تحديد المحاذيات الأفقية والرأسية من معادلة الدالة.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'A horizontal asymptote describes the behavior of a function as x approaches ±∞.',
                            'question_text_arabic': 'يصف المحاذي الأفقي سلوك الدالة عندما تقترب x من ±∞.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A vertical asymptote is a vertical line that the graph of a function approaches but never touches.',
                            'question_text_arabic': 'المحاذي الرأسي هو خط رأسي يقترب منه التمثيل البياني للدالة ولكنه لا يلمسه أبدًا.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the vertical asymptote of the function f(x) = 1 / (x - 2)?',
                            'question_text_arabic': 'ما هو المحاذي الرأسي للدالة f(x) = 1 / (x - 2)؟',
                            'question_type': 'open_short',
                            'correct_answer': 'x = 2'
                        }
                    ]
                },
                {
                    'title': 'Oblique (Slant) Asymptotes',
                    'title_arabic': 'المحاذيات المائلة',
                    'description': 'Identifying oblique asymptotes of rational functions.',
                    'description_arabic': 'تحديد المحاذيات المائلة للدوال الكسرية.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'An oblique asymptote exists for a rational function if the degree of the numerator is exactly one greater than the degree of the denominator.',
                            'question_text_arabic': 'يوجد محاذٍ مائل لدالة كسرية إذا كانت درجة البسط أكبر بواحد بالضبط من درجة المقام.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'To find the equation of an oblique asymptote, you perform polynomial long division.',
                            'question_text_arabic': 'لإيجاد معادلة المحاذي المائل، تقوم بإجراء القسمة الطويلة لكثيرات الحدود.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the oblique asymptote of the function f(x) = (x² + 1) / (x - 1)?',
                            'question_text_arabic': 'ما هو المحاذي المائل للدالة f(x) = (x² + 1) / (x - 1)؟',
                            'question_type': 'open_short',
                            'correct_answer': 'y = x + 1'
                        }
                    ]
                },
                {
                    'title': 'Parabolic Branches',
                    'title_arabic': 'الفروع الشلجمية',
                    'description': 'Identifying parabolic branches and their direction.',
                    'description_arabic': 'تحديد الفروع الشلجمية واتجاهها.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'A function has a parabolic branch in the direction of the y-axis if the limit of f(x)/x as x approaches ∞ is ∞.',
                            'question_text_arabic': 'يكون للدالة فرع شلجمي في اتجاه محور y إذا كانت نهاية f(x)/x عندما تقترب x من ∞ هي ∞.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A function has a parabolic branch in the direction of the x-axis if the limit of f(x) as x approaches ∞ is ∞, but the limit of f(x)/x is 0.',
                            'question_text_arabic': 'يكون للدالة فرع شلجمي في اتجاه محور x إذا كانت نهاية f(x) عندما تقترب x من ∞ هي ∞، ولكن نهاية f(x)/x هي 0.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The function f(x) = x³ has a parabolic branch in the direction of the y-axis.',
                            'question_text_arabic': 'الدالة f(x) = x³ لها فرع شلجمي في اتجاه محور y.',
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
                    f'Successfully created for Lesson 76 (Asymptotic branches of a curve):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 76 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
