from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Oscillating mechanical systems - Lesson ID: 60'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=60)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Simple Harmonic Motion (SHM)',
                    'title_arabic': 'الحركة التوافقية البسيطة (SHM)',
                    'description': 'Understanding the basics of SHM.',
                    'description_arabic': 'فهم أساسيات الحركة التوافقية البسيطة.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'In SHM, the restoring force is directly proportional to the displacement from equilibrium and acts in the opposite direction.',
                            'question_text_arabic': 'في الحركة التوافقية البسيطة، تتناسب قوة الإرجاع طرديًا مع الإزاحة عن موضع التوازن وتعمل في الاتجاه المعاكس.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the period of an oscillation?',
                            'question_text_arabic': 'ما هو دور التذبذب؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The time for one complete oscillation', 'choice_text_arabic': 'الزمن اللازم لتذبذب كامل واحد', 'is_correct': True},
                                {'choice_text': 'The number of oscillations per second', 'choice_text_arabic': 'عدد التذبذبات في الثانية', 'is_correct': False},
                                {'choice_text': 'The maximum displacement', 'choice_text_arabic': 'الإزاحة القصوى', 'is_correct': False},
                                {'choice_text': 'The speed of the oscillation', 'choice_text_arabic': 'سرعة التذبذب', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The frequency of an oscillation is the reciprocal of its period.',
                            'question_text_arabic': 'تردد التذبذب هو مقلوب دوره.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Mass-Spring Systems',
                    'title_arabic': 'أنظمة الكتلة والنابض',
                    'description': 'Analyzing the oscillation of a mass attached to a spring.',
                    'description_arabic': 'تحليل تذبذب كتلة متصلة بنابض.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'The period of a mass-spring system is given by T = 2π√(m/k).',
                            'question_text_arabic': 'يُعطى دور نظام كتلة-نابض بالعلاقة T = 2π√(m/k).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'If the mass attached to a spring is quadrupled, the period of oscillation is doubled.',
                            'question_text_arabic': 'إذا تضاعفت الكتلة المتصلة بنابض أربع مرات، فإن دور التذبذب يتضاعف.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A 2 kg mass is attached to a spring with a spring constant of 50 N/m. What is the period of oscillation?',
                            'question_text_arabic': 'كتلة 2 كجم متصلة بنابض ثابت مرونته 50 نيوتن/م. ما هو دور التذبذب؟',
                            'question_type': 'open_short',
                            'correct_answer': '1.26 s'
                        }
                    ]
                },
                {
                    'title': 'Pendulums',
                    'title_arabic': 'النواسات',
                    'description': 'Analyzing the motion of simple and physical pendulums.',
                    'description_arabic': 'تحليل حركة النواسات البسيطة والفيزيائية.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'The period of a simple pendulum depends on its mass.',
                            'question_text_arabic': 'يعتمد دور النواس البسيط على كتلته.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        },
                        {
                            'question_text': 'What is the formula for the period of a simple pendulum of length L?',
                            'question_text_arabic': 'ما هي صيغة دور النواس البسيط طوله L؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'T = 2π√(L/g)', 'choice_text_arabic': 'T = 2π√(L/g)', 'is_correct': True},
                                {'choice_text': 'T = 2π√(g/L)', 'choice_text_arabic': 'T = 2π√(g/L)', 'is_correct': False},
                                {'choice_text': 'T = 2π√(m/k)', 'choice_text_arabic': 'T = 2π√(m/k)', 'is_correct': False},
                                {'choice_text': 'T = 1/f', 'choice_text_arabic': 'T = 1/f', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'To double the period of a simple pendulum, you must quadruple its length.',
                            'question_text_arabic': 'لمضاعفة دور النواس البسيط، يجب مضاعفة طوله أربع مرات.',
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
                    f'Successfully created for Lesson 60 (Oscillating mechanical systems):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 60 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
