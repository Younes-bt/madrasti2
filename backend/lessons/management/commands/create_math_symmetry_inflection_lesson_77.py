from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Axis of symmetry, center of symmetry, inflection point - Lesson ID: 77'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=77)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Symmetry in Functions',
                    'title_arabic': 'التناظر في الدوال',
                    'description': 'Identifying axes and centers of symmetry.',
                    'description_arabic': 'تحديد محاور ومراكز التناظر.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'A function f(x) has an axis of symmetry at x = c if f(c + h) = f(c - h) for all h.',
                            'question_text_arabic': 'يكون للدالة f(x) محور تناظر عند x = c إذا كان f(c + h) = f(c - h) لجميع قيم h.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The function f(x) = x² has an axis of symmetry at x = 0.',
                            'question_text_arabic': 'الدالة f(x) = x² لها محور تناظر عند x = 0.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A function f(x) has a center of symmetry at (a, b) if f(a + x) + f(a - x) = 2b.',
                            'question_text_arabic': 'يكون للدالة f(x) مركز تناظر عند (a, b) إذا كان f(a + x) + f(a - x) = 2b.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Inflection Points',
                    'title_arabic': 'نقاط الانعطاف',
                    'description': 'Finding and understanding inflection points.',
                    'description_arabic': 'إيجاد وفهم نقاط الانعطاف.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'An inflection point is a point on a curve at which the concavity changes.',
                            'question_text_arabic': 'نقطة الانعطاف هي نقطة على منحنى يتغير عندها التقعر.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'To find possible inflection points, you should find where the second derivative is zero or undefined.',
                            'question_text_arabic': 'لإيجاد نقاط الانعطاف الممكنة، يجب أن تجد أين تكون المشتقة الثانية صفرًا أو غير معرفة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Find the inflection point of the function f(x) = x³ - 6x² + 9x + 1.',
                            'question_text_arabic': 'أوجد نقطة الانعطاف للدالة f(x) = x³ - 6x² + 9x + 1.',
                            'question_type': 'open_short',
                            'correct_answer': '(2, 3)'
                        }
                    ]
                },
                {
                    'title': 'Graphical Analysis',
                    'title_arabic': 'التحليل البياني',
                    'description': 'Identifying symmetry and inflection points from a graph.',
                    'description_arabic': 'تحديد التناظر ونقاط الانعطاف من التمثيل البياني.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'If a function is symmetric with respect to the origin, it is an odd function.',
                            'question_text_arabic': 'إذا كانت الدالة متناظرة بالنسبة لنقطة الأصل، فهي دالة فردية.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A cubic function of the form f(x) = ax³ + bx² + cx + d always has exactly one inflection point.',
                            'question_text_arabic': 'الدالة التكعيبية من الشكل f(x) = ax³ + bx² + cx + d لها دائمًا نقطة انعطاف واحدة بالضبط.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The function f(x) = sin(x) has inflection points at integer multiples of π.',
                            'question_text_arabic': 'الدالة f(x) = sin(x) لها نقاط انعطاف عند مضاعفات صحيحة لـ π.',
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
                    f'Successfully created for Lesson 77 (Axis of symmetry, center of symmetry, inflection point):\n' 
                    f'Exercises: {total_exercises}\n' 
                    f'Questions: {total_questions}\n' 
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 77 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
