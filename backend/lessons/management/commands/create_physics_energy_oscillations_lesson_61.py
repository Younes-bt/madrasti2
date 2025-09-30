from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Energy aspects of mechanical oscillations - Lesson ID: 61'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=61)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Energy in Simple Harmonic Motion',
                    'title_arabic': 'الطاقة في الحركة التوافقية البسيطة',
                    'description': 'Understanding the conservation of energy in SHM.',
                    'description_arabic': 'فهم انحفاظ الطاقة في الحركة التوافقية البسيطة.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'In an ideal mass-spring system, the total mechanical energy is conserved.',
                            'question_text_arabic': 'في نظام كتلة-نابض مثالي، تكون الطاقة الميكانيكية الكلية محفوظة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'At the equilibrium position of a mass-spring system, the potential energy is maximum.',
                            'question_text_arabic': 'عند موضع توازن نظام كتلة-نابض، تكون طاقة الوضع قصوى.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        },
                        {
                            'question_text': 'At the maximum displacement (amplitude) of a mass-spring system, the kinetic energy is zero.',
                            'question_text_arabic': 'عند الإزاحة القصوى (السعة) لنظام كتلة-نابض، تكون الطاقة الحركية صفرًا.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Energy Transformations',
                    'title_arabic': 'تحولات الطاقة',
                    'description': 'Analyzing the transformation between kinetic and potential energy.',
                    'description_arabic': 'تحليل التحول بين الطاقة الحركية وطاقة الوضع.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'In a simple pendulum, the potential energy is maximum at the highest point of its swing.',
                            'question_text_arabic': 'في النواس البسيط، تكون طاقة الوضع قصوى عند أعلى نقطة في تأرجحه.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The total energy of a simple harmonic oscillator is proportional to the square of its amplitude.',
                            'question_text_arabic': 'تتناسب الطاقة الكلية للمذبذب التوافقي البسيط مع مربع سعته.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A mass-spring system has a total energy of 10 J. If its kinetic energy is 4 J at a certain point, what is its potential energy at that point?',
                            'question_text_arabic': 'نظام كتلة-نابض له طاقة كلية 10 جول. إذا كانت طاقته الحركية 4 جول عند نقطة معينة، فما هي طاقة وضعه عند تلك النقطة؟',
                            'question_type': 'open_short',
                            'correct_answer': '6 J'
                        }
                    ]
                },
                {
                    'title': 'Damped Oscillations',
                    'title_arabic': 'التذبذبات المخمدة',
                    'description': 'Understanding energy loss in real oscillating systems.',
                    'description_arabic': 'فهم فقدان الطاقة في أنظمة التذبذب الحقيقية.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'In a damped oscillation, the total mechanical energy decreases over time.',
                            'question_text_arabic': 'في التذبذب المخمد، تتناقص الطاقة الميكانيكية الكلية مع مرور الوقت.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The energy of a damped oscillator decreases exponentially with time.',
                            'question_text_arabic': 'تتناقص طاقة المذبذب المخمد بشكل أسي مع الزمن.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the quality factor (Q) of an oscillator a measure of?',
                            'question_text_arabic': 'ما هو عامل الجودة (Q) للمذبذب؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The rate of energy loss', 'choice_text_arabic': 'معدل فقدان الطاقة', 'is_correct': True},
                                {'choice_text': 'The frequency of oscillation', 'choice_text_arabic': 'تردد التذبذب', 'is_correct': False},
                                {'choice_text': 'The amplitude of oscillation', 'choice_text_arabic': 'سعة التذبذب', 'is_correct': False},
                                {'choice_text': 'The total energy', 'choice_text_arabic': 'الطاقة الكلية', 'is_correct': False}
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
                    f'Successfully created for Lesson 61 (Energy aspects of mechanical oscillations):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 61 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
