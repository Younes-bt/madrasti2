
from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Physics - Electrostatic potential energy - Lesson ID: 140'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=140)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Concept of Electrostatic Potential Energy',
                    'title_arabic': 'مفهوم الطاقة الكامنة الكهروستاتيكية',
                    'description': 'Understanding the definition and factors affecting electrostatic potential energy.',
                    'description_arabic': 'فهم تعريف الطاقة الكامنة الكهروستاتيكية والعوامل المؤثرة فيها.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'Electrostatic potential energy is the energy a charge possesses due to its position in an electric field.',
                            'question_text_arabic': 'الطاقة الكامنة الكهروستاتيكية هي الطاقة التي يمتلكها الشحن بسبب موقعه في مجال كهربائي.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What happens to the electrostatic potential energy of two like charges as they are brought closer together?',
                            'question_text_arabic': 'ماذا يحدث للطاقة الكامنة الكهروستاتيكية لشحنتين متشابهتين عند تقريبهما من بعضهما البعض؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'It increases', 'choice_text_arabic': 'تزداد', 'is_correct': True},
                                {'choice_text': 'It decreases', 'choice_text_arabic': 'تنقص', 'is_correct': False},
                                {'choice_text': 'It remains the same', 'choice_text_arabic': 'تبقى كما هي', 'is_correct': False},
                                {'choice_text': 'It becomes zero', 'choice_text_arabic': 'تصبح صفرًا', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Calculations of Electrostatic Potential Energy',
                    'title_arabic': 'حسابات الطاقة الكامنة الكهروستاتيكية',
                    'description': 'Performing calculations involving electrostatic potential energy.',
                    'description_arabic': 'إجراء الحسابات المتعلقة بالطاقة الكامنة الكهروستاتيكية.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'The formula for electrostatic potential energy (U) between two point charges (q1, q2) separated by a distance (r) is:',
                            'question_text_arabic': 'صيغة الطاقة الكامنة الكهروستاتيكية (U) بين شحنتين نقطيتين (q1, q2) تفصل بينهما مسافة (r) هي:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'U = k * (q1 * q2) / r', 'choice_text_arabic': 'U = k * (q1 * q2) / r', 'is_correct': True},
                                {'choice_text': 'U = k * (q1 * q2) / r^2', 'choice_text_arabic': 'U = k * (q1 * q2) / r^2', 'is_correct': False},
                                {'choice_text': 'U = k * (q1 + q2) / r', 'choice_text_arabic': 'U = k * (q1 + q2) / r', 'is_correct': False},
                                {'choice_text': 'U = k * (q1 - q2) / r', 'choice_text_arabic': 'U = k * (q1 - q2) / r', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The unit of electrostatic potential energy is Joules (J).',
                            'question_text_arabic': 'وحدة الطاقة الكامنة الكهروستاتيكية هي الجول (J).',
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
                    f'Successfully created for Lesson 140: {total_exercises} exercises, {total_questions} questions, {total_choices} choices.'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 140 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
