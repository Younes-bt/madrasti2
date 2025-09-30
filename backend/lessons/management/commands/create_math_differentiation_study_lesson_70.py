from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Differentiation and Function Study - Lesson ID: 70'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=70)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'The Derivative as a Limit',
                    'title_arabic': 'المشتقة كنهاية',
                    'description': 'Understanding the definition of the derivative.',
                    'description_arabic': 'فهم تعريف المشتقة.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'The derivative of a function at a point represents the instantaneous rate of change of the function at that point.',
                            'question_text_arabic': 'تمثل مشتقة دالة عند نقطة ما معدل التغير اللحظي للدالة عند تلك النقطة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Geometrically, the derivative at a point gives the slope of the tangent line to the function\'s graph at that point.',
                            'question_text_arabic': 'هندسيًا، تعطي المشتقة عند نقطة ما ميل المماس لمنحنى الدالة عند تلك النقطة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A function must be continuous at a point to be differentiable at that point.',
                            'question_text_arabic': 'يجب أن تكون الدالة متصلة عند نقطة لتكون قابلة للاشتقاق عند تلك النقطة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Differentiation Rules',
                    'title_arabic': 'قواعد الاشتقاق',
                    'description': 'Applying basic rules of differentiation.',
                    'description_arabic': 'تطبيق القواعد الأساسية للاشتقاق.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the derivative of f(x) = xⁿ?',
                            'question_text_arabic': 'ما هي مشتقة f(x) = xⁿ؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'nxⁿ⁻¹', 'choice_text_arabic': 'nxⁿ⁻¹', 'is_correct': True},
                                {'choice_text': 'xⁿ⁺¹/(n+1)', 'choice_text_arabic': 'xⁿ⁺¹/(n+1)', 'is_correct': False},
                                {'choice_text': 'nxⁿ', 'choice_text_arabic': 'nxⁿ', 'is_correct': False},
                                {'choice_text': 'xⁿ', 'choice_text_arabic': 'xⁿ', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the derivative of f(x) = sin(x)?',
                            'question_text_arabic': 'ما هي مشتقة f(x) = sin(x)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'cos(x)', 'choice_text_arabic': 'cos(x)', 'is_correct': True},
                                {'choice_text': '-cos(x)', 'choice_text_arabic': '-cos(x)', 'is_correct': False},
                                {'choice_text': '-sin(x)', 'choice_text_arabic': '-sin(x)', 'is_correct': False},
                                {'choice_text': 'tan(x)', 'choice_text_arabic': 'tan(x)', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Find the derivative of f(x) = 3x² + 5x - 2.',
                            'question_text_arabic': 'أوجد مشتقة f(x) = 3x² + 5x - 2.',
                            'question_type': 'open_short',
                            'correct_answer': '6x + 5'
                        }
                    ]
                },
                {
                    'title': 'Function Study using Derivatives',
                    'title_arabic': 'دراسة الدوال باستخدام المشتقات',
                    'description': 'Using derivatives to analyze the behavior of functions.',
                    'description_arabic': 'استخدام المشتقات لتحليل سلوك الدوال.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'If f\'(x) > 0 on an interval, then f(x) is increasing on that interval.',
                            'question_text_arabic': 'إذا كانت f\' (x) > 0 على فترة ما، فإن f(x) متزايدة على تلك الفترة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A critical point of a function occurs where the derivative is zero or undefined.',
                            'question_text_arabic': 'تحدث النقطة الحرجة للدالة حيث تكون المشتقة صفرًا أو غير معرفة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'If f\'\' (x) > 0 on an interval, the function is concave up on that interval.',
                            'question_text_arabic': 'إذا كانت f\'\' (x) > 0 على فترة ما، فإن الدالة تكون مقعرة لأعلى على تلك الفترة.',
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
                    f'Successfully created for Lesson 70 (Differentiation and Function Study):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 70 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
