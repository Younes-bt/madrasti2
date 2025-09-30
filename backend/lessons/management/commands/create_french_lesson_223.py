
from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for French - La nouvelle fantastique : Le chevalier double - Lesson ID: 223'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=223)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Characters and Duality in "Le chevalier double"',
                    'title_arabic': 'الشخصيات والازدواجية في "الفارس المزدوج"',
                    'description': 'Understanding the main characters and the theme of duality.',
                    'description_arabic': 'فهم الشخصيات الرئيسية وموضوع الازدواجية.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'Who is the protagonist of the story?',
                            'question_text_arabic': 'من هو بطل القصة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Oluf', 'choice_text_arabic': 'أولوف', 'is_correct': True},
                                {'choice_text': 'Brenda', 'choice_text_arabic': 'بريندا', 'is_correct': False},
                                {'choice_text': 'The master of the black raven', 'choice_text_arabic': 'سيد الغراب الأسود', 'is_correct': False},
                                {'choice_text': 'The gypsy', 'choice_text_arabic': 'الغجري', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The story explores the theme of a dual personality, a good side and a bad side, within the same person.',
                            'question_text_arabic': 'تستكشف القصة موضوع الشخصية المزدوجة، جانب جيد وجانب سيء، داخل نفس الشخص.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'The Fantastic Element',
                    'title_arabic': 'العنصر الخيالي',
                    'description': 'Analyzing the supernatural and fantastic elements in the story.',
                    'description_arabic': 'تحليل العناصر الخارقة للطبيعة والخيالية في القصة.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the main fantastic element in the story?',
                            'question_text_arabic': 'ما هو العنصر الخيالي الرئيسي في القصة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The appearance of a double, or doppelgänger', 'choice_text_arabic': 'ظهور شبيه أو قرين', 'is_correct': True},
                                {'choice_text': 'A talking animal', 'choice_text_arabic': 'حيوان ناطق', 'is_correct': False},
                                {'choice_text': 'A magical object', 'choice_text_arabic': 'شيء سحري', 'is_correct': False},
                                {'choice_text': 'A journey to another world', 'choice_text_arabic': 'رحلة إلى عالم آخر', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The story blurs the line between reality and the supernatural.',
                            'question_text_arabic': 'تمحو القصة الخط الفاصل بين الواقع وما هو خارق للطبيعة.',
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
                    f'Successfully created for Lesson 223: {total_exercises} exercises, {total_questions} questions, {total_choices} choices.'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 223 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
