
from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Chemistry - Direct titrations - Lesson ID: 137'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=137)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Basics of Titration',
                    'title_arabic': 'أساسيات المعايرة',
                    'description': 'Understanding the fundamental concepts of titration.',
                    'description_arabic': 'فهم المفاهيم الأساسية للمعايرة.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is the purpose of a titration?',
                            'question_text_arabic': 'ما هو الغرض من المعايرة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'To determine the concentration of a solution', 'choice_text_arabic': 'لتحديد تركيز محلول', 'is_correct': True},
                                {'choice_text': 'To measure the volume of a solution', 'choice_text_arabic': 'لقياس حجم محلول', 'is_correct': False},
                                {'choice_text': 'To identify the color of a solution', 'choice_text_arabic': 'لتحديد لون محلول', 'is_correct': False},
                                {'choice_text': 'To heat a solution', 'choice_text_arabic': 'لتسخين محلول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The point at which the indicator changes color in a titration is called the endpoint.',
                            'question_text_arabic': 'النقطة التي يتغير عندها لون المؤشر في المعايرة تسمى نقطة النهاية.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Titration Calculations',
                    'title_arabic': 'حسابات المعايرة',
                    'description': 'Performing calculations related to titration.',
                    'description_arabic': 'إجراء العمليات الحسابية المتعلقة بالمعايرة.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the formula used to calculate the concentration of an unknown solution in a titration?',
                            'question_text_arabic': 'ما هي الصيغة المستخدمة لحساب تركيز محلول غير معروف في المعايرة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'M1V1 = M2V2', 'choice_text_arabic': 'M1V1 = M2V2', 'is_correct': True},
                                {'choice_text': 'M1/V1 = M2/V2', 'choice_text_arabic': 'M1/V1 = M2/V2', 'is_correct': False},
                                {'choice_text': 'M1V2 = M2V1', 'choice_text_arabic': 'M1V2 = M2V1', 'is_correct': False},
                                {'choice_text': 'M1 + V1 = M2 + V2', 'choice_text_arabic': 'M1 + V1 = M2 + V2', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The solution of known concentration used in a titration is called the titrant.',
                            'question_text_arabic': 'المحلول ذو التركيز المعروف المستخدم في المعايرة يسمى المحلول المعياري.',
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
                        points=10
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
                            choice_text_arabic='صحيح',
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
                    completion_points=50,
                    completion_coins=3,
                    perfect_score_bonus=25
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created for Lesson 137: {total_exercises} exercises, {total_questions} questions, {total_choices} choices.'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 137 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
