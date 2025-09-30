
from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Chemistry - Functional groups in organic chemistry - Lesson ID: 143'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=143)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Introduction to Functional Groups',
                    'title_arabic': 'مقدمة في المجموعات الوظيفية',
                    'description': 'Understanding the definition and importance of functional groups.',
                    'description_arabic': 'فهم تعريف وأهمية المجموعات الوظيفية.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is a functional group in organic chemistry?',
                            'question_text_arabic': 'ما هي المجموعة الوظيفية في الكيمياء العضوية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'A specific group of atoms within a molecule that is responsible for the characteristic chemical reactions of that molecule', 'choice_text_arabic': 'مجموعة محددة من الذرات داخل الجزيء تكون مسؤولة عن التفاعلات الكيميائية المميزة لذلك الجزيء', 'is_correct': True},
                                {'choice_text': 'Any group of atoms in a molecule', 'choice_text_arabic': 'أي مجموعة من الذرات في الجزيء', 'is_correct': False},
                                {'choice_text': 'A group of atoms that determines the physical state of a molecule', 'choice_text_arabic': 'مجموعة من الذرات تحدد الحالة الفيزيائية للجزيء', 'is_correct': False},
                                {'choice_text': 'A group of atoms that makes a molecule colored', 'choice_text_arabic': 'مجموعة من الذرات تجعل الجزيء ملونًا', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Functional groups determine the reactivity of organic molecules.',
                            'question_text_arabic': 'تحدد المجموعات الوظيفية تفاعلية الجزيئات العضوية.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Common Functional Groups',
                    'title_arabic': 'المجموعات الوظيفية الشائعة',
                    'description': 'Identifying and understanding common functional groups.',
                    'description_arabic': 'تحديد وفهم المجموعات الوظيفية الشائعة.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Which functional group contains a hydroxyl (-OH) group attached to an alkyl group?',
                            'question_text_arabic': 'أي مجموعة وظيفية تحتوي على مجموعة هيدروكسيل (-OH) مرتبطة بمجموعة ألكيل؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Alcohol', 'choice_text_arabic': 'كحول', 'is_correct': True},
                                {'choice_text': 'Aldehyde', 'choice_text_arabic': 'ألدهيد', 'is_correct': False},
                                {'choice_text': 'Ketone', 'choice_text_arabic': 'كيتون', 'is_correct': False},
                                {'choice_text': 'Carboxylic acid', 'choice_text_arabic': 'حمض كربوكسيلي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The carbonyl group (C=O) is found in aldehydes and ketones.',
                            'question_text_arabic': 'توجد مجموعة الكربونيل (C=O) في الألدهيدات والكيتونات.',
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
                    f'Successfully created for Lesson 143: {total_exercises} exercises, {total_questions} questions, {total_choices} choices.'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 143 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
