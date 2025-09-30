
from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Physics - Magnetic field - Lesson ID: 141'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=141)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Introduction to Magnetic Fields',
                    'title_arabic': 'مقدمة في المجالات المغناطيسية',
                    'description': 'Understanding the basic concepts of magnetic fields.',
                    'description_arabic': 'فهم المفاهيم الأساسية للمجالات المغناطيسية.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What produces a magnetic field?',
                            'question_text_arabic': 'ما الذي ينتج مجالًا مغناطيسيًا؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Moving electric charges', 'choice_text_arabic': 'الشحنات الكهربائية المتحركة', 'is_correct': True},
                                {'choice_text': 'Stationary electric charges', 'choice_text_arabic': 'الشحنات الكهربائية الساكنة', 'is_correct': False},
                                {'choice_text': 'Only permanent magnets', 'choice_text_arabic': 'المغناطيسات الدائمة فقط', 'is_correct': False},
                                {'choice_text': 'Electric fields', 'choice_text_arabic': 'المجالات الكهربائية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Magnetic field lines always form closed loops.',
                            'question_text_arabic': 'خطوط المجال المغناطيسي تشكل دائمًا حلقات مغلقة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Magnetic Force on a Current-Carrying Wire',
                    'title_arabic': 'القوة المغناطيسية على سلك يحمل تيارًا',
                    'description': 'Understanding the force experienced by a current-carrying wire in a magnetic field.',
                    'description_arabic': 'فهم القوة التي يتعرض لها سلك يحمل تيارًا في مجال مغناطيسي.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'The direction of the magnetic force on a current-carrying wire is given by the:',
                            'question_text_arabic': 'يتم تحديد اتجاه القوة المغناطيسية على سلك يحمل تيارًا بواسطة:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Right-hand rule', 'choice_text_arabic': 'قاعدة اليد اليمنى', 'is_correct': True},
                                {'choice_text': 'Left-hand rule', 'choice_text_arabic': 'قاعدة اليد اليسرى', 'is_correct': False},
                                {'choice_text': 'Newton\'s third law', 'choice_text_arabic': 'قانون نيوتن الثالث', 'is_correct': False},
                                {'choice_text': 'Ohm\'s law', 'choice_text_arabic': 'قانون أوم', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The magnetic force on a current-carrying wire is maximum when the wire is parallel to the magnetic field.',
                            'question_text_arabic': 'تكون القوة المغناطيسية على سلك يحمل تيارًا قصوى عندما يكون السلك موازيًا للمجال المغناطيسي.',
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
                    f'Successfully created for Lesson 141: {total_exercises} exercises, {total_questions} questions, {total_choices} choices.'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 141 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
