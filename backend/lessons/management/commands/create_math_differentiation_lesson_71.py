from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Differentiation - Lesson ID: 71'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=71)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Chain Rule',
                    'title_arabic': 'قاعدة السلسلة',
                    'description': 'Understanding and applying the chain rule for composite functions.',
                    'description_arabic': 'فهم وتطبيق قاعدة السلسلة للدوال المركبة.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'If h(x) = f(g(x)), then h\'\' (x) = f\'\' (g(x)) * g\'\' (x). This is the chain rule.',
                            'question_text_arabic': 'إذا كانت h(x) = f(g(x))، فإن h\'\' (x) = f\'\' (g(x)) * g\'\' (x). هذه هي قاعدة السلسلة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Find the derivative of f(x) = (2x + 1)³.',
                            'question_text_arabic': 'أوجد مشتقة f(x) = (2x + 1)³.',
                            'question_type': 'open_short',
                            'correct_answer': '6(2x + 1)²'
                        },
                        {
                            'question_text': 'Find the derivative of f(x) = sin(x²).',
                            'question_text_arabic': 'أوجد مشتقة f(x) = sin(x²).',
                            'question_type': 'open_short',
                            'correct_answer': '2x cos(x²)'
                        }
                    ]
                },
                {
                    'title': 'Product and Quotient Rules',
                    'title_arabic': 'قاعدتا الضرب والقسمة',
                    'description': 'Applying the product and quotient rules for differentiation.',
                    'description_arabic': 'تطبيق قاعدتي الضرب والقسمة للاشتقاق.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'The derivative of the product of two functions f(x)g(x) is f\'\' (x)g(x) + f(x)g\'\' (x).',
                            'question_text_arabic': 'مشتقة حاصل ضرب دالتين f(x)g(x) هي f\'\' (x)g(x) + f(x)g\'\' (x).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Find the derivative of f(x) = x²cos(x).',
                            'question_text_arabic': 'أوجد مشتقة f(x) = x²cos(x).',
                            'question_type': 'open_short',
                            'correct_answer': '2x cos(x) - x²sin(x)'
                        },
                        {
                            'question_text': 'The derivative of the quotient of two functions f(x)/g(x) is (f\'\' (x)g(x) - f(x)g\'\' (x)) / [g(x)]².',
                            'question_text_arabic': 'مشتقة خارج قسمة دالتين f(x)/g(x) هي (f\'\' (x)g(x) - f(x)g\'\' (x)) / [g(x)]².',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Implicit Differentiation',
                    'title_arabic': 'الاشتقاق الضمني',
                    'description': 'Finding derivatives of implicitly defined functions.',
                    'description_arabic': 'إيجاد مشتقات الدوال المعرفة ضمنيًا.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'Implicit differentiation is used when it is difficult or impossible to solve an equation for y in terms of x.',
                            'question_text_arabic': 'يُستخدم الاشتقاق الضمني عندما يكون من الصعب أو المستحيل حل معادلة لـ y بدلالة x.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Find dy/dx for the equation x² + y² = 25.',
                            'question_text_arabic': 'أوجد dy/dx للمعادلة x² + y² = 25.',
                            'question_type': 'open_short',
                            'correct_answer': '-x/y'
                        },
                        {
                            'question_text': 'Find the slope of the tangent line to the circle x² + y² = 25 at the point (3, 4).',
                            'question_text_arabic': 'أوجد ميل المماس للدائرة x² + y² = 25 عند النقطة (3, 4).',
                            'question_type': 'open_short',
                            'correct_answer': '-3/4'
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
                    f'Successfully created for Lesson 71 (Differentiation):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 71 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
