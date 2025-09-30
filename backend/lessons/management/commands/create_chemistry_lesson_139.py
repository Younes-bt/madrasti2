
from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Chemistry - Quantities related to the amount of substance - Lesson ID: 139'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=139)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Moles and Molar Mass',
                    'title_arabic': 'المولات والكتلة المولية',
                    'description': 'Understanding the concepts of moles and molar mass.',
                    'description_arabic': 'فهم مفاهيم المولات والكتلة المولية.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is the SI unit for the amount of substance?',
                            'question_text_arabic': 'ما هي الوحدة الدولية لكمية المادة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Mole', 'choice_text_arabic': 'مول', 'is_correct': True},
                                {'choice_text': 'Gram', 'choice_text_arabic': 'جرام', 'is_correct': False},
                                {'choice_text': 'Liter', 'choice_text_arabic': 'لتر', 'is_correct': False},
                                {'choice_text': 'Kilogram', 'choice_text_arabic': 'كيلوجرام', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Molar mass is the mass of one mole of a substance.',
                            'question_text_arabic': 'الكتلة المولية هي كتلة مول واحد من المادة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Concentration',
                    'title_arabic': 'التركيز',
                    'description': 'Understanding different ways to express concentration.',
                    'description_arabic': 'فهم الطرق المختلفة للتعبير عن التركيز.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the definition of molarity?',
                            'question_text_arabic': 'ما هو تعريف المولارية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Moles of solute per liter of solution', 'choice_text_arabic': 'مولات المذاب لكل لتر من المحلول', 'is_correct': True},
                                {'choice_text': 'Grams of solute per liter of solution', 'choice_text_arabic': 'جرامات المذاب لكل لتر من المحلول', 'is_correct': False},
                                {'choice_text': 'Moles of solute per kilogram of solvent', 'choice_text_arabic': 'مولات المذاب لكل كيلوجرام من المذيب', 'is_correct': False},
                                {'choice_text': 'Grams of solute per 100 grams of solution', 'choice_text_arabic': 'جرامات المذاب لكل 100 جرام من المحلول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Mass percent is calculated as (mass of solute / mass of solution) x 100%.',
                            'question_text_arabic': 'يتم حساب النسبة المئوية للكتلة كـ (كتلة المذاب / كتلة المحلول) × 100%.',
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
                    f'Successfully created for Lesson 139: {total_exercises} exercises, {total_questions} questions, {total_choices} choices.'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 139 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
