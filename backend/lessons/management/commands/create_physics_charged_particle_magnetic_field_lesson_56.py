from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Motion of a charged particle in a uniform magnetic field - Lesson ID: 56'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=56)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Lorentz Force',
                    'title_arabic': 'قوة لورنتز',
                    'description': 'Understanding the force on a charged particle in a magnetic field.',
                    'description_arabic': 'فهم القوة المؤثرة على جسيم مشحون في مجال مغناطيسي.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'The magnetic force on a charged particle is always perpendicular to both its velocity and the magnetic field.',
                            'question_text_arabic': 'تكون القوة المغناطيسية المؤثرة على جسيم مشحون دائمًا عمودية على كل من سرعته والمجال المغناطيسي.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the formula for the magnetic force (Lorentz force) on a charge q moving with velocity v in a magnetic field B?',
                            'question_text_arabic': 'ما هي صيغة القوة المغناطيسية (قوة لورنتز) على شحنة q تتحرك بسرعة v في مجال مغناطيسي B؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'F = q(v x B)', 'choice_text_arabic': 'F = q(v x B)', 'is_correct': True},
                                {'choice_text': 'F = q(E + v x B)', 'choice_text_arabic': 'F = q(E + v x B)', 'is_correct': False},
                                {'choice_text': 'F = qB', 'choice_text_arabic': 'F = qB', 'is_correct': False},
                                {'choice_text': 'F = qvB', 'choice_text_arabic': 'F = qvB', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A stationary charged particle experiences a magnetic force in a uniform magnetic field.',
                            'question_text_arabic': 'يتأثر جسيم مشحون ساكن بقوة مغناطيسية في مجال مغناطيسي منتظم.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        }
                    ]
                },
                {
                    'title': 'Circular Motion in a Magnetic Field',
                    'title_arabic': 'الحركة الدائرية في مجال مغناطيسي',
                    'description': 'Analyzing the circular path of a charged particle.',
                    'description_arabic': 'تحليل المسار الدائري لجسيم مشحون.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'When a charged particle enters a uniform magnetic field perpendicular to its velocity, its path is a circle.',
                            'question_text_arabic': 'عندما يدخل جسيم مشحون مجالًا مغناطيسيًا منتظمًا بشكل عمودي على سرعته، يكون مساره دائريًا.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The radius of the circular path of a charged particle in a uniform magnetic field is given by r = mv / (qB).',
                            'question_text_arabic': 'يُعطى نصف قطر المسار الدائري لجسيم مشحون في مجال مغناطيسي منتظم بالعلاقة r = mv / (qB).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'An electron (m=9.1x10⁻³¹ kg, q=1.6x10⁻¹⁹ C) moves at 2x10⁶ m/s in a 0.5 T magnetic field. What is the radius of its circular path?',
                            'question_text_arabic': 'يتحرك إلكترون (m=9.1x10⁻³¹ kg, q=1.6x10⁻¹⁹ C) بسرعة 2x10⁶ م/ث في مجال مغناطيسي 0.5 T. ما هو نصف قطر مساره الدائري؟',
                            'question_type': 'open_short',
                            'correct_answer': '2.275 x 10⁻⁵ m'
                        }
                    ]
                },
                {
                    'title': 'Applications',
                    'title_arabic': 'التطبيقات',
                    'description': 'Understanding applications like mass spectrometers and cyclotrons.',
                    'description_arabic': 'فهم تطبيقات مثل مطياف الكتلة والسيكلوترون.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'A mass spectrometer separates ions based on their mass-to-charge ratio.',
                            'question_text_arabic': 'يفصل مطياف الكتلة الأيونات بناءً على نسبة كتلتها إلى شحنتها.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'In a cyclotron, a magnetic field is used to keep charged particles in a circular path, while an electric field accelerates them.',
                            'question_text_arabic': 'في السيكلوترون، يُستخدم مجال مغناطيسي للحفاظ على الجسيمات المشحونة في مسار دائري، بينما يقوم مجال كهربائي بتسريعها.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The period of revolution of a charged particle in a uniform magnetic field depends on its velocity.',
                            'question_text_arabic': 'يعتمد دور دوران جسيم مشحون في مجال مغناطيسي منتظم على سرعته.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
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
                    f'Successfully created for Lesson 56 (Motion of a charged particle in a uniform magnetic field):\n' 
                    f'Exercises: {total_exercises}\n' 
                    f'Questions: {total_questions}\n' 
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 56 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
