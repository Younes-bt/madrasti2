from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Applications of Newton\'s laws - Lesson ID: 53'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=53)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Weight and Normal Force',
                    'title_arabic': 'الوزن والقوة العمودية',
                    'description': 'Applying Newton\'s laws to objects at rest on surfaces.',
                    'description_arabic': 'تطبيق قوانين نيوتن على الأجسام الساكنة على الأسطح.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is the weight of an object?',
                            'question_text_arabic': 'ما هو وزن الجسم؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The gravitational force exerted on it by the Earth', 'choice_text_arabic': 'قوة الجاذبية التي تؤثر بها الأرض عليه', 'is_correct': True},
                                {'choice_text': 'The amount of matter in the object', 'choice_text_arabic': 'كمية المادة في الجسم', 'is_correct': False},
                                {'choice_text': 'Its inertia', 'choice_text_arabic': 'قصوره الذاتي', 'is_correct': False},
                                {'choice_text': 'The force it exerts on a scale', 'choice_text_arabic': 'القوة التي يؤثر بها على الميزان', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'For an object resting on a horizontal surface, the normal force is equal in magnitude and opposite in direction to the weight of the object.',
                            'question_text_arabic': 'لجسم يستقر على سطح أفقي، تكون القوة العمودية مساوية في المقدار ومعاكسة في الاتجاه لوزن الجسم.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Calculate the weight of a 10 kg object on Earth (g ≈ 9.8 m/s²).',
                            'question_text_arabic': 'احسب وزن جسم كتلته 10 كجم على الأرض (g ≈ 9.8 م/ث²).',
                            'question_type': 'open_short',
                            'correct_answer': '98 N'
                        }
                    ]
                },
                {
                    'title': 'Friction',
                    'title_arabic': 'الاحتكاك',
                    'description': 'Understanding static and kinetic friction.',
                    'description_arabic': 'فهم الاحتكاك السكوني والحركي.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Which type of friction acts on an object that is not moving?',
                            'question_text_arabic': 'أي نوع من الاحتكاك يؤثر على جسم لا يتحرك؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Static friction', 'choice_text_arabic': 'الاحتكاك السكوني', 'is_correct': True},
                                {'choice_text': 'Kinetic friction', 'choice_text_arabic': 'الاحتكاك الحركي', 'is_correct': False},
                                {'choice_text': 'Rolling friction', 'choice_text_arabic': 'احتكاك التدحرج', 'is_correct': False},
                                {'choice_text': 'Air resistance', 'choice_text_arabic': 'مقاومة الهواء', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The force of kinetic friction is generally less than the maximum force of static friction.',
                            'question_text_arabic': 'قوة الاحتكاك الحركي بشكل عام أقل من القوة القصوى للاحتكاك السكوني.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The force of friction is always directed opposite to the direction of motion or attempted motion.',
                            'question_text_arabic': 'تكون قوة الاحتكاك دائمًا موجهة في الاتجاه المعاكس لاتجاه الحركة أو محاولة الحركة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Objects on Inclined Planes',
                    'title_arabic': 'الأجسام على السطوح المائلة',
                    'description': 'Applying Newton\'s laws to objects on an incline.',
                    'description_arabic': 'تطبيق قوانين نيوتن على الأجسام على سطح مائل.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'For an object on an inclined plane, the component of weight acting parallel to the incline is given by:',
                            'question_text_arabic': 'لجسم على سطح مائل، تُعطى مركبة الوزن الموازية للميل بالعلاقة:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'mg sin(θ)', 'choice_text_arabic': 'mg sin(θ)', 'is_correct': True},
                                {'choice_text': 'mg cos(θ)', 'choice_text_arabic': 'mg cos(θ)', 'is_correct': False},
                                {'choice_text': 'mg tan(θ)', 'choice_text_arabic': 'mg tan(θ)', 'is_correct': False},
                                {'choice_text': 'mg', 'choice_text_arabic': 'mg', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'On a frictionless inclined plane, the acceleration of a sliding object depends on its mass.',
                            'question_text_arabic': 'على سطح مائل أملس، يعتمد تسارع جسم منزلق على كتلته.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        },
                        {
                            'question_text': 'A 5 kg block rests on a plane inclined at 30°. What is the magnitude of the normal force?',
                            'question_text_arabic': 'تستقر كتلة 5 كجم على سطح مائل بزاوية 30 درجة. ما هو مقدار القوة العمودية؟',
                            'question_type': 'open_short',
                            'correct_answer': '42.4 N'
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
                    f'Successfully created for Lesson 53 (Applications of Newton\'s laws):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 53 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
