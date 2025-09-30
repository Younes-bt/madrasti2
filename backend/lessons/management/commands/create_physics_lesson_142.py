
from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Physics - Magnetism - Lesson ID: 142'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=142)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Magnetic Materials',
                    'title_arabic': 'المواد المغناطيسية',
                    'description': 'Understanding different types of magnetic materials.',
                    'description_arabic': 'فهم الأنواع المختلفة للمواد المغناطيسية.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'Which of the following is a ferromagnetic material?',
                            'question_text_arabic': 'أي مما يلي مادة مغناطيسية حديدية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Iron', 'choice_text_arabic': 'الحديد', 'is_correct': True},
                                {'choice_text': 'Copper', 'choice_text_arabic': 'النحاس', 'is_correct': False},
                                {'choice_text': 'Aluminum', 'choice_text_arabic': 'الألومنيوم', 'is_correct': False},
                                {'choice_text': 'Wood', 'choice_text_arabic': 'الخشب', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Paramagnetic materials are weakly attracted to magnetic fields.',
                            'question_text_arabic': 'المواد البارامغناطيسية تنجذب بشكل ضعيف إلى المجالات المغناطيسية.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Electromagnetism',
                    'title_arabic': 'الكهرومغناطيسية',
                    'description': 'Understanding the relationship between electricity and magnetism.',
                    'description_arabic': 'فهم العلاقة بين الكهرباء والمغناطيسية.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is an electromagnet?',
                            'question_text_arabic': 'ما هو المغناطيس الكهربائي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'A temporary magnet created by an electric current', 'choice_text_arabic': 'مغناطيس مؤقت يتم إنشاؤه بواسطة تيار كهربائي', 'is_correct': True},
                                {'choice_text': 'A naturally occurring magnet', 'choice_text_arabic': 'مغناطيس طبيعي', 'is_correct': False},
                                {'choice_text': 'A device that generates electricity', 'choice_text_arabic': 'جهاز يولد الكهرباء', 'is_correct': False},
                                {'choice_text': 'A material that repels magnets', 'choice_text_arabic': 'مادة تطرد المغناطيس', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The strength of an electromagnet can be increased by increasing the current or the number of turns in the coil.',
                            'question_text_arabic': 'يمكن زيادة قوة المغناطيس الكهربائي بزيادة التيار أو عدد اللفات في الملف.',
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
                    f'Successfully created for Lesson 142: {total_exercises} exercises, {total_questions} questions, {total_choices} choices.'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 142 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
