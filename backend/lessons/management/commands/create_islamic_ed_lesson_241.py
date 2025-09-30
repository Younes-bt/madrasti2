
from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Islamic Education - Faith and the Unseen - Lesson ID: 241'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=241)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Pillars of Faith (Iman)',
                    'title_arabic': 'أركان الإيمان',
                    'description': 'Understanding the fundamental pillars of Islamic faith.',
                    'description_arabic': 'فهم أركان الإيمان الأساسية في الإسلام.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'How many pillars of Iman (faith) are there in Islam?',
                            'question_text_arabic': 'كم عدد أركان الإيمان في الإسلام؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Six', 'choice_text_arabic': 'ستة', 'is_correct': True},
                                {'choice_text': 'Five', 'choice_text_arabic': 'خمسة', 'is_correct': False},
                                {'choice_text': 'Seven', 'choice_text_arabic': 'سبعة', 'is_correct': False},
                                {'choice_text': 'Four', 'choice_text_arabic': 'أربعة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Belief in the Unseen (Al-Ghaib) is a core component of Iman.',
                            'question_text_arabic': 'الإيمان بالغيب هو مكون أساسي من الإيمان.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'The Unseen (Al-Ghaib)',
                    'title_arabic': 'الغيب',
                    'description': 'Understanding the concept of the Unseen in Islam.',
                    'description_arabic': 'فهم مفهوم الغيب في الإسلام.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Which of the following is an example of the Unseen (Al-Ghaib) that Muslims believe in?',
                            'question_text_arabic': 'أي مما يلي هو مثال على الغيب الذي يؤمن به المسلمون؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Angels', 'choice_text_arabic': 'الملائكة', 'is_correct': True},
                                {'choice_text': 'The weather tomorrow', 'choice_text_arabic': 'طقس الغد', 'is_correct': False},
                                {'choice_text': 'The contents of a locked box', 'choice_text_arabic': 'محتويات صندوق مغلق', 'is_correct': False},
                                {'choice_text': 'The history of the world', 'choice_text_arabic': 'تاريخ العالم', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Knowledge of the Unseen belongs exclusively to Allah (God).',
                            'question_text_arabic': 'علم الغيب يخص الله وحده.',
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
                    f'Successfully created for Lesson 241: {total_exercises} exercises, {total_questions} questions, {total_choices} choices.'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 241 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
