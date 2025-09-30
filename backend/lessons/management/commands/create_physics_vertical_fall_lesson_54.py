from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Vertical fall of a solid body - Lesson ID: 54'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=54)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Free Fall Fundamentals',
                    'title_arabic': 'أساسيات السقوط الحر',
                    'description': 'Understanding the basic concepts of an object in vertical free fall.',
                    'description_arabic': 'فهم المفاهيم الأساسية لجسم في حالة سقوط حر رأسي.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'In a vacuum, which of the following objects would hit the ground first if dropped from the same height?',
                            'question_text_arabic': 'في الفراغ، أي من الأجسام التالية سيصل إلى الأرض أولاً إذا تم إسقاطه من نفس الارتفاع؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'A feather', 'choice_text_arabic': 'ريشة', 'is_correct': False},
                                {'choice_text': 'A bowling ball', 'choice_text_arabic': 'كرة بولينج', 'is_correct': False},
                                {'choice_text': 'They would hit at the same time', 'choice_text_arabic': 'سيصلان في نفس الوقت', 'is_correct': True},
                                {'choice_text': 'It depends on their shape', 'choice_text_arabic': 'يعتمد على شكلهما', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The only force acting on an object in ideal free fall is gravity.',
                            'question_text_arabic': 'القوة الوحيدة المؤثرة على جسم في حالة سقوط حر مثالي هي الجاذبية.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the approximate value of the acceleration due to gravity (g) near the Earth\'s surface?',
                            'question_text_arabic': 'ما هي القيمة التقريبية لتسارع الجاذبية (g) بالقرب من سطح الأرض؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '9.8 m/s²', 'choice_text_arabic': '9.8 م/ث²', 'is_correct': True},
                                {'choice_text': '9.8 m/s', 'choice_text_arabic': '9.8 م/ث', 'is_correct': False},
                                {'choice_text': '10 N', 'choice_text_arabic': '10 نيوتن', 'is_correct': False},
                                {'choice_text': '5.2 m/s²', 'choice_text_arabic': '5.2 م/ث²', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Kinematic Equations for Free Fall',
                    'title_arabic': 'المعادلات الحركية للسقوط الحر',
                    'description': 'Applying kinematic equations to objects in vertical motion.',
                    'description_arabic': 'تطبيق المعادلات الحركية على الأجسام في حركة رأسية.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'An object is dropped from rest. What is its velocity after falling for 3 seconds? (Use g = 9.8 m/s²)',
                            'question_text_arabic': 'تم إسقاط جسم من السكون. ما هي سرعته بعد السقوط لمدة 3 ثوانٍ؟ (استخدم g = 9.8 م/ث²)',
                            'question_type': 'open_short',
                            'correct_answer': '29.4 m/s'
                        },
                        {
                            'question_text': 'The equation for the distance (d) an object falls from rest is d = ½gt².',
                            'question_text_arabic': 'معادلة المسافة (d) التي يقطعها جسم ساقط من السكون هي d = ½gt².',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A ball is thrown upwards with an initial velocity of 19.6 m/s. How long does it take to reach its highest point? (Use g = 9.8 m/s²)',
                            'question_text_arabic': 'قُذفت كرة لأعلى بسرعة ابتدائية 19.6 م/ث. كم من الوقت تستغرق لتصل إلى أعلى نقطة؟ (استخدم g = 9.8 م/ث²)',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '2 s', 'choice_text_arabic': '2 ثانية', 'is_correct': True},
                                {'choice_text': '1 s', 'choice_text_arabic': '1 ثانية', 'is_correct': False},
                                {'choice_text': '4 s', 'choice_text_arabic': '4 ثوانٍ', 'is_correct': False},
                                {'choice_text': '9.8 s', 'choice_text_arabic': '9.8 ثانية', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Vertical Fall with Air Resistance',
                    'title_arabic': 'السقوط الرأسي مع مقاومة الهواء',
                    'description': 'Understanding the effect of air resistance on falling objects.',
                    'description_arabic': 'فهم تأثير مقاومة الهواء على الأجسام الساقطة.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is terminal velocity?',
                            'question_text_arabic': 'ما هي السرعة الحدية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The constant speed that a freely falling object eventually reaches when resistance of the medium equals the force of gravity.', 'choice_text_arabic': 'السرعة الثابتة التي يصل إليها جسم ساقط سقوطًا حرًا في النهاية عندما تتساوى مقاومة الوسط مع قوة الجاذبية.', 'is_correct': True},
                                {'choice_text': 'The initial velocity of a falling object.', 'choice_text_arabic': 'السرعة الابتدائية لجسم ساقط.', 'is_correct': False},
                                {'choice_text': 'The maximum possible speed in a vacuum.', 'choice_text_arabic': 'أقصى سرعة ممكنة في الفراغ.', 'is_correct': False},
                                {'choice_text': 'The speed at which an object breaks apart.', 'choice_text_arabic': 'السرعة التي يتفتت عندها الجسم.', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'When an object reaches terminal velocity, its acceleration is zero.',
                            'question_text_arabic': 'عندما يصل جسم إلى السرعة الحدية، يكون تسارعه صفرًا.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The force of air resistance on an object depends on its speed and cross-sectional area.',
                            'question_text_arabic': 'تعتمد قوة مقاومة الهواء على جسم ما على سرعته ومساحة مقطعه العرضي.',
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
                    f'Successfully created for Lesson 54 (Vertical fall of a solid body):\n' 
                    f'Exercises: {total_exercises}\n' 
                    f'Questions: {total_questions}\n' 
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 54 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
