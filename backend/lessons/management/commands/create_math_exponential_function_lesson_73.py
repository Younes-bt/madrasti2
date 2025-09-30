from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Exponential function with base a - Lesson ID: 73'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=73)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Definition and Properties',
                    'title_arabic': 'التعريف والخصائص',
                    'description': 'Understanding the exponential function f(x) = aˣ.',
                    'description_arabic': 'فهم الدالة الأسية f(x) = aˣ.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'For the function f(x) = aˣ, the base a must be a positive real number not equal to 1.',
                            'question_text_arabic': 'للدالة f(x) = aˣ، يجب أن يكون الأساس a عددًا حقيقيًا موجبًا لا يساوي 1.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The domain of the exponential function f(x) = aˣ is all real numbers.',
                            'question_text_arabic': 'مجال تعريف الدالة الأسية f(x) = aˣ هو كل الأعداد الحقيقية.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The range of the exponential function f(x) = aˣ is (0, ∞).',
                            'question_text_arabic': 'مدى الدالة الأسية f(x) = aˣ هو (0, ∞).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Graphs of Exponential Functions',
                    'title_arabic': 'التمثيلات البيانية للدوال الأسية',
                    'description': 'Analyzing the graphs of exponential functions.',
                    'description_arabic': 'تحليل التمثيلات البيانية للدوال الأسية.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'If a > 1, the function f(x) = aˣ is an increasing function.',
                            'question_text_arabic': 'إذا كان a > 1، فإن الدالة f(x) = aˣ هي دالة متزايدة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'If 0 < a < 1, the function f(x) = aˣ is a decreasing function.',
                            'question_text_arabic': 'إذا كان 0 < a < 1، فإن الدالة f(x) = aˣ هي دالة متناقصة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The graph of f(x) = aˣ always passes through the point (0, 1).',
                            'question_text_arabic': 'يمر التمثيل البياني للدالة f(x) = aˣ دائمًا بالنقطة (0, 1).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Solving Exponential Equations',
                    'title_arabic': 'حل المعادلات الأسية',
                    'description': 'Solving equations involving exponential functions.',
                    'description_arabic': 'حل المعادلات التي تتضمن دوال أسية.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'Solve for x: 2ˣ = 8.',
                            'question_text_arabic': 'حل لـ x: 2ˣ = 8.',
                            'question_type': 'open_short',
                            'correct_answer': '3'
                        },
                        {
                            'question_text': 'Solve for x: 3ˣ⁺¹ = 27.',
                            'question_text_arabic': 'حل لـ x: 3ˣ⁺¹ = 27.',
                            'question_type': 'open_short',
                            'correct_answer': '2'
                        },
                        {
                            'question_text': 'The natural exponential function is the exponential function with base e, where e ≈ 2.718.',
                            'question_text_arabic': 'الدالة الأسية الطبيعية هي الدالة الأسية ذات الأساس e، حيث e ≈ 2.718.',
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
                    f'Successfully created for Lesson 73 (Exponential function with base a):\n' 
                    f'Exercises: {total_exercises}\n' 
                    f'Questions: {total_questions}\n' 
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 73 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
