from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Limits and Continuity - Lesson ID: 68'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=68)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Introduction to Limits',
                    'title_arabic': 'مقدمة في النهايات',
                    'description': 'Understanding the concept of a limit of a function.',
                    'description_arabic': 'فهم مفهوم نهاية دالة.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'The limit of a function f(x) as x approaches a value c is the value that f(x) gets closer to as x gets closer to c.',
                            'question_text_arabic': 'نهاية دالة f(x) عندما تقترب x من قيمة c هي القيمة التي تقترب منها f(x) كلما اقتربت x من c.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'If the limit of f(x) as x approaches c exists, it must be equal to f(c).',
                            'question_text_arabic': 'إذا كانت نهاية f(x) عندما تقترب x من c موجودة، فيجب أن تكون مساوية لـ f(c).',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        },
                        {
                            'question_text': 'What is the limit of f(x) = 2x + 3 as x approaches 2?',
                            'question_text_arabic': 'ما هي نهاية f(x) = 2x + 3 عندما تقترب x من 2؟',
                            'question_type': 'open_short',
                            'correct_answer': '7'
                        }
                    ]
                },
                {
                    'title': 'Limit Laws and Techniques',
                    'title_arabic': 'قوانين وتقنيات النهايات',
                    'description': 'Applying limit laws to evaluate limits of functions.',
                    'description_arabic': 'تطبيق قوانين النهايات لحساب نهايات الدوال.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'The limit of a sum of two functions is the sum of their limits.',
                            'question_text_arabic': 'نهاية مجموع دالتين هي مجموع نهايتيهما.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the limit of (x² - 4) / (x - 2) as x approaches 2?',
                            'question_text_arabic': 'ما هي نهاية (x² - 4) / (x - 2) عندما تقترب x من 2؟',
                            'question_type': 'open_short',
                            'correct_answer': '4'
                        },
                        {
                            'question_text': 'The Squeeze Theorem is used to find the limit of a function by comparing it to two other functions whose limits are known.',
                            'question_text_arabic': 'تُستخدم مبرهنة الحصر لإيجاد نهاية دالة بمقارنتها بدالتين أخريين نهايتاهما معروفتان.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Continuity',
                    'title_arabic': 'الاتصال',
                    'description': 'Understanding the concept of continuity at a point and on an interval.',
                    'description_arabic': 'فهم مفهوم الاتصال عند نقطة وعلى فترة.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'A function is continuous at a point c if the limit of the function as x approaches c exists, f(c) is defined, and the limit equals f(c).',
                            'question_text_arabic': 'تكون الدالة متصلة عند نقطة c إذا كانت نهاية الدالة عندما تقترب x من c موجودة، و f(c) معرفة، والنهاية تساوي f(c).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'All polynomial functions are continuous everywhere.',
                            'question_text_arabic': 'جميع الدوال الحدودية متصلة في كل مكان.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The function f(x) = 1/x is continuous on the interval (0, ∞).',
                            'question_text_arabic': 'الدالة f(x) = 1/x متصلة على الفترة (0, ∞).',
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
                    f'Successfully created for Lesson 68 (Limits and Continuity):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 68 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
