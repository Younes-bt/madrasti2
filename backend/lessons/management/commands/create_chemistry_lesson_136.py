
from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Chemistry - Oxidation-reduction (Redox) reactions - Lesson ID: 136'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=136)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Basics of Redox Reactions',
                    'title_arabic': 'أساسيات تفاعلات الأكسدة والاختزال',
                    'description': 'Understanding the fundamental concepts of oxidation and reduction.',
                    'description_arabic': 'فهم المفاهيم الأساسية للأكسدة والاختزال.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What happens during oxidation?',
                            'question_text_arabic': 'ماذا يحدث أثناء الأكسدة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Loss of electrons', 'choice_text_arabic': 'فقدان الإلكترونات', 'is_correct': True},
                                {'choice_text': 'Gain of electrons', 'choice_text_arabic': 'اكتساب الإلكترونات', 'is_correct': False},
                                {'choice_text': 'Loss of protons', 'choice_text_arabic': 'فقدان البروتونات', 'is_correct': False},
                                {'choice_text': 'Gain of protons', 'choice_text_arabic': 'اكتساب البروتونات', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In a redox reaction, oxidation and reduction always occur together.',
                            'question_text_arabic': 'في تفاعل الأكسدة والاختزال، تحدث الأكسدة والاختزال دائمًا معًا.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Oxidizing and Reducing Agents',
                    'title_arabic': 'العوامل المؤكسدة والمختزلة',
                    'description': 'Identifying oxidizing and reducing agents in a redox reaction.',
                    'description_arabic': 'تحديد العوامل المؤكسدة والمختزلة في تفاعل الأكسدة والاختزال.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is a reducing agent?',
                            'question_text_arabic': 'ما هو العامل المختزل؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'A substance that donates electrons and gets oxidized', 'choice_text_arabic': 'مادة تمنح الإلكترونات وتتأكسد', 'is_correct': True},
                                {'choice_text': 'A substance that accepts electrons and gets reduced', 'choice_text_arabic': 'مادة تستقبل الإلكترونات وتختزل', 'is_correct': False},
                                {'choice_text': 'A substance that donates protons', 'choice_text_arabic': 'مادة تمنح البروتونات', 'is_correct': False},
                                {'choice_text': 'A substance that accepts protons', 'choice_text_arabic': 'مادة تستقبل البروتونات', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'An oxidizing agent is a substance that gets reduced in a redox reaction.',
                            'question_text_arabic': 'العامل المؤكسد هو مادة تختزل في تفاعل الأكسدة والاختزال.',
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
                    f'Successfully created for Lesson 136: {total_exercises} exercises, {total_questions} questions, {total_choices} choices.'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 136 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
