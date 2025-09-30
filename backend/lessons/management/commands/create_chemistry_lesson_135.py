
from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Chemistry - Acid-base reactions - Lesson ID: 135'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=135)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Definitions of Acids and Bases',
                    'title_arabic': 'تعريفات الأحماض والقواعد',
                    'description': 'Understanding the definitions of acids and bases.',
                    'description_arabic': 'فهم تعريفات الأحماض والقواعد.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'According to the Brønsted-Lowry definition, an acid is a:',
                            'question_text_arabic': 'وفقًا لتعريف برونستد-لوري، الحمض هو:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Proton donor', 'choice_text_arabic': 'مانح بروتون', 'is_correct': True},
                                {'choice_text': 'Proton acceptor', 'choice_text_arabic': 'مستقبل بروتون', 'is_correct': False},
                                {'choice_text': 'Electron donor', 'choice_text_arabic': 'مانح إلكترون', 'is_correct': False},
                                {'choice_text': 'Electron acceptor', 'choice_text_arabic': 'مستقبل إلكترون', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A substance that can act as both an acid and a base is called amphoteric.',
                            'question_text_arabic': 'المادة التي يمكن أن تعمل كحمض وقاعدة تسمى أمفوتيرية.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'pH and pOH',
                    'title_arabic': 'الأس الهيدروجيني والأس الهيدروكسيلي',
                    'description': 'Understanding pH and pOH calculations.',
                    'description_arabic': 'فهم حسابات الأس الهيدروجيني والأس الهيدروكسيلي.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the pH of a neutral solution at 25°C?',
                            'question_text_arabic': 'ما هو الأس الهيدروجيني لمحلول متعادل عند 25 درجة مئوية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '7', 'choice_text_arabic': '7', 'is_correct': True},
                                {'choice_text': '0', 'choice_text_arabic': '0', 'is_correct': False},
                                {'choice_text': '14', 'choice_text_arabic': '14', 'is_correct': False},
                                {'choice_text': '1', 'choice_text_arabic': '1', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'An acidic solution has a pH less than 7.',
                            'question_text_arabic': 'المحلول الحمضي له أس هيدروجيني أقل من 7.',
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
                    f'Successfully created for Lesson 135: {total_exercises} exercises, {total_questions} questions, {total_choices} choices.'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 135 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
