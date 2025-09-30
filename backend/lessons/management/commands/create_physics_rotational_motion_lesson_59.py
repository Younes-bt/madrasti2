from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Rotational motion of a solid body around a fixed axis - Lesson ID: 59'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=59)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Angular Kinematics',
                    'title_arabic': 'الحركيات الزاوية',
                    'description': 'Understanding angular position, velocity, and acceleration.',
                    'description_arabic': 'فهم الموضع الزاوي والسرعة الزاوية والتسارع الزاوي.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'Angular displacement is measured in radians.',
                            'question_text_arabic': 'تُقاس الإزاحة الزاوية بالراديان.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the relationship between linear speed (v) and angular speed (ω) for a point at a distance r from the axis of rotation?',
                            'question_text_arabic': 'ما هي العلاقة بين السرعة الخطية (v) والسرعة الزاوية (ω) لنقطة على مسافة r من محور الدوران؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'v = rω', 'choice_text_arabic': 'v = rω', 'is_correct': True},
                                {'choice_text': 'ω = rv', 'choice_text_arabic': 'ω = rv', 'is_correct': False},
                                {'choice_text': 'v = r/ω', 'choice_text_arabic': 'v = r/ω', 'is_correct': False},
                                {'choice_text': 'r = vω', 'choice_text_arabic': 'r = vω', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A wheel rotates from rest to an angular speed of 10 rad/s in 5 seconds. What is its average angular acceleration?',
                            'question_text_arabic': 'تدور عجلة من السكون إلى سرعة زاوية 10 راد/ث في 5 ثوانٍ. ما هو متوسط تسارعها الزاوي؟',
                            'question_type': 'open_short',
                            'correct_answer': '2 rad/s²'
                        }
                    ]
                },
                {
                    'title': 'Torque and Moment of Inertia',
                    'title_arabic': 'عزم الدوران وعزم القصور الذاتي',
                    'description': 'Understanding the rotational equivalents of force and mass.',
                    'description_arabic': 'فهم المكافئات الدورانية للقوة والكتلة.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is torque?',
                            'question_text_arabic': 'ما هو عزم الدوران؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The rotational equivalent of force', 'choice_text_arabic': 'المكافئ الدوراني للقوة', 'is_correct': True},
                                {'choice_text': 'The rotational equivalent of mass', 'choice_text_arabic': 'المكافئ الدوراني للكتلة', 'is_correct': False},
                                {'choice_text': 'The rotational equivalent of momentum', 'choice_text_arabic': 'المكافئ الدوراني للزخم', 'is_correct': False},
                                {'choice_text': 'The rotational equivalent of energy', 'choice_text_arabic': 'المكافئ الدوراني للطاقة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The moment of inertia of an object depends on its mass and the distribution of that mass about the axis of rotation.',
                            'question_text_arabic': 'يعتمد عزم القصور الذاتي لجسم ما على كتلته وتوزيع تلك الكتلة حول محور الدوران.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is Newton\'s second law for rotation?',
                            'question_text_arabic': 'ما هو قانون نيوتن الثاني للدوران؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'τ = Iα', 'choice_text_arabic': 'τ = Iα', 'is_correct': True},
                                {'choice_text': 'F = ma', 'choice_text_arabic': 'F = ma', 'is_correct': False},
                                {'choice_text': 'τ = Iω', 'choice_text_arabic': 'τ = Iω', 'is_correct': False},
                                {'choice_text': 'L = Iω', 'choice_text_arabic': 'L = Iω', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Rotational Energy and Angular Momentum',
                    'title_arabic': 'الطاقة الدورانية والزخم الزاوي',
                    'description': 'Understanding energy and momentum in rotational motion.',
                    'description_arabic': 'فهم الطاقة والزخم في الحركة الدورانية.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is the formula for the rotational kinetic energy of an object with moment of inertia I and angular speed ω?',
                            'question_text_arabic': 'ما هي صيغة الطاقة الحركية الدورانية لجسم عزمه القصوري I وسرعته الزاوية ω؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'K = ½Iω²', 'choice_text_arabic': 'K = ½Iω²', 'is_correct': True},
                                {'choice_text': 'K = ½mv²', 'choice_text_arabic': 'K = ½mv²', 'is_correct': False},
                                {'choice_text': 'K = Iω', 'choice_text_arabic': 'K = Iω', 'is_correct': False},
                                {'choice_text': 'K = ½I²ω', 'choice_text_arabic': 'K = ½I²ω', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Angular momentum is conserved if there is no net external torque acting on the system.',
                            'question_text_arabic': 'يُحفظ الزخم الزاوي إذا لم يكن هناك عزم دوران خارجي صافٍ يؤثر على النظام.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A spinning ice skater pulls in her arms to spin faster. This is an example of the conservation of angular momentum.',
                            'question_text_arabic': 'تسحب متزلجة على الجليد ذراعيها لتدور بشكل أسرع. هذا مثال على حفظ الزخم الزاوي.',
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
                    f'Successfully created for Lesson 59 (Rotational motion of a solid body around a fixed axis):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 59 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
