from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Continuity of a numerical function - Lesson ID: 69'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=69)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Definition and Properties of Continuity',
                    'title_arabic': 'تعريف وخصائص الاتصال',
                    'description': 'Understanding the formal definition and basic properties of continuity.',
                    'description_arabic': 'فهم التعريف الرسمي والخصائص الأساسية للاتصال.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'A function f is continuous at a point c if the limit of f(x) as x approaches c is equal to f(c).',
                            'question_text_arabic': 'تكون الدالة f متصلة عند نقطة c إذا كانت نهاية f(x) عندما تقترب x من c تساوي f(c).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'If two functions are continuous at a point, their sum is also continuous at that point.',
                            'question_text_arabic': 'إذا كانت دالتان متصلتين عند نقطة، فإن مجموعهما يكون متصلاً أيضًا عند تلك النقطة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The function f(x) = |x| is not continuous at x = 0.',
                            'question_text_arabic': 'الدالة f(x) = |x| غير متصلة عند x = 0.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        }
                    ]
                },
                {
                    'title': 'Types of Discontinuities',
                    'title_arabic': 'أنواع الانفصال',
                    'description': 'Identifying and classifying different types of discontinuities.',
                    'description_arabic': 'تحديد وتصنيف أنواع مختلفة من الانفصال.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'A removable discontinuity occurs when the limit of the function exists at a point, but it is not equal to the function\'s value.',
                            'question_text_arabic': 'يحدث الانفصال القابل للإزالة عندما تكون نهاية الدالة موجودة عند نقطة ما، ولكنها لا تساوي قيمة الدالة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A jump discontinuity is characterized by the left-hand and right-hand limits existing but not being equal.',
                            'question_text_arabic': 'يتميز الانفصال القفزي بوجود نهايتي اليسار واليمين ولكنهما غير متساويتين.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The function f(x) = 1/x has an infinite discontinuity at x = 0.',
                            'question_text_arabic': 'الدالة f(x) = 1/x لها انفصال لا نهائي عند x = 0.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Intermediate Value Theorem',
                    'title_arabic': 'مبرهنة القيمة الوسطية',
                    'description': 'Understanding and applying the Intermediate Value Theorem.',
                    'description_arabic': 'فهم وتطبيق مبرهنة القيمة الوسطية.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'The Intermediate Value Theorem guarantees that for a continuous function on a closed interval [a, b], the function must take on every value between f(a) and f(b).',
                            'question_text_arabic': 'تضمن مبرهنة القيمة الوسطية أنه لدالة متصلة على فترة مغلقة [a, b]، يجب أن تأخذ الدالة كل قيمة بين f(a) و f(b).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The Intermediate Value Theorem can be used to prove the existence of roots of an equation.',
                            'question_text_arabic': 'يمكن استخدام مبرهنة القيمة الوسطية لإثبات وجود جذور لمعادلة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'If f(x) = x² - 2, and we consider the interval [1, 2], does the Intermediate Value Theorem guarantee a root in this interval?',
                            'question_text_arabic': 'إذا كانت f(x) = x² - 2، ونظرنا إلى الفترة [1, 2]، فهل تضمن مبرهنة القيمة الوسطية وجود جذر في هذه الفترة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Yes, because f(1) is negative and f(2) is positive.', 'choice_text_arabic': 'نعم، لأن f(1) سالبة و f(2) موجبة.', 'is_correct': True},
                                {'choice_text': 'No, because the function is not continuous.', 'choice_text_arabic': 'لا، لأن الدالة ليست متصلة.', 'is_correct': False},
                                {'choice_text': 'No, because f(1) and f(2) are both positive.', 'choice_text_arabic': 'لا، لأن f(1) و f(2) كلاهما موجب.', 'is_correct': False},
                                {'choice_text': 'It cannot be determined.', 'choice_text_arabic': 'لا يمكن تحديده.', 'is_correct': False}
                            ]
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
                    f'Successfully created for Lesson 69 (Continuity of a numerical function):\n' 
                    f'Exercises: {total_exercises}\n' 
                    f'Questions: {total_questions}\n' 
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 69 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
