from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Motion of a charged particle in a uniform electrostatic field - Lesson ID: 57'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=57)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Electric Force and Field',
                    'title_arabic': 'القوة والمجال الكهربائي',
                    'description': 'Understanding the force on a charged particle in an electric field.',
                    'description_arabic': 'فهم القوة المؤثرة على جسيم مشحون في مجال كهربائي.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'The electric force on a positive charge is in the same direction as the electric field.',
                            'question_text_arabic': 'تكون القوة الكهربائية المؤثرة على شحنة موجبة في نفس اتجاه المجال الكهربائي.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the formula for the electric force F on a charge q in an electric field E?',
                            'question_text_arabic': 'ما هي صيغة القوة الكهربائية F على شحنة q في مجال كهربائي E؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'F = qE', 'choice_text_arabic': 'F = qE', 'is_correct': True},
                                {'choice_text': 'F = E/q', 'choice_text_arabic': 'F = E/q', 'is_correct': False},
                                {'choice_text': 'F = q/E', 'choice_text_arabic': 'F = q/E', 'is_correct': False},
                                {'choice_text': 'F = qvB', 'choice_text_arabic': 'F = qvB', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A uniform electric field has the same strength and direction at all points.',
                            'question_text_arabic': 'المجال الكهربائي المنتظم له نفس الشدة والاتجاه في جميع النقاط.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Parabolic Motion in an Electric Field',
                    'title_arabic': 'الحركة المكافئة في مجال كهربائي',
                    'description': 'Analyzing the parabolic path of a charged particle.',
                    'description_arabic': 'تحليل المسار المكافئ لجسيم مشحون.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'When a charged particle enters a uniform electric field perpendicular to its velocity, its path is a parabola.',
                            'question_text_arabic': 'عندما يدخل جسيم مشحون مجالًا كهربائيًا منتظمًا بشكل عمودي على سرعته، يكون مساره قطعًا مكافئًا.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The acceleration of a charged particle in a uniform electric field is constant.',
                            'question_text_arabic': 'تسارع جسيم مشحون في مجال كهربائي منتظم ثابت.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'An electron is accelerated from rest through a potential difference of 100 V. What is its final kinetic energy?',
                            'question_text_arabic': 'يتم تسريع إلكترون من السكون عبر فرق جهد 100 فولت. ما هي طاقته الحركية النهائية؟',
                            'question_type': 'open_short',
                            'correct_answer': '1.6 x 10⁻¹⁷ J'
                        }
                    ]
                },
                {
                    'title': 'Applications',
                    'title_arabic': 'التطبيقات',
                    'description': 'Understanding applications like cathode ray tubes (CRTs) and inkjet printers.',
                    'description_arabic': 'فهم تطبيقات مثل أنابيب أشعة الكاثود والطابعات النافثة للحبر.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'In a cathode ray tube (CRT), electric fields are used to deflect the electron beam.',
                            'question_text_arabic': 'في أنبوب أشعة الكاثود (CRT)، تُستخدم المجالات الكهربائية لحرف حزمة الإلكترونات.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'An inkjet printer uses electrostatic charges to direct ink droplets onto paper.',
                            'question_text_arabic': 'تستخدم الطابعة النافثة للحبر شحنات كهروستاتيكية لتوجيه قطرات الحبر على الورق.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The work done by a uniform electric field on a charge q moving a distance d parallel to the field is W = qEd.',
                            'question_text_arabic': 'الشغل الذي يبذله مجال كهربائي منتظم على شحنة q تتحرك مسافة d موازية للمجال هو W = qEd.',
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
                    f'Successfully created for Lesson 57 (Motion of a charged particle in a uniform electrostatic field):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 57 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
