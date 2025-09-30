from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for History and Geography - Political and Social Transformations in Europe - Lesson ID: 255'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=255)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Political Transformations in 15th-16th Century Europe',
                    'title_arabic': 'التحولات السياسية في أوروبا في القرنين الخامس عشر والسادس عشر',
                    'description': 'Understanding the major political changes in Europe during the 15th and 16th centuries.',
                    'description_arabic': 'فهم التغيرات السياسية الكبرى في أوروبا خلال القرنين الخامس عشر والسادس عشر.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What was a major political development in Europe during the 15th and 16th centuries?',
                            'question_text_arabic': 'ما هو التطور السياسي الرئيسي في أوروبا خلال القرنين الخامس عشر والسادس عشر؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The rise of powerful nation-states and monarchies', 'choice_text_arabic': 'صعود الدول القومية والملكيات القوية', 'is_correct': True},
                                {'choice_text': 'The decline of all monarchies', 'choice_text_arabic': 'تدهور جميع الملكيات', 'is_correct': False},
                                {'choice_text': 'The unification of all of Europe under one empire', 'choice_text_arabic': 'توحيد كل أوروبا تحت إمبراطورية واحدة', 'is_correct': False},
                                {'choice_text': 'The end of international trade', 'choice_text_arabic': 'نهاية التجارة الدولية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The Hundred Years\' War between England and France concluded in the 15th century.',
                            'question_text_arabic': 'انتهت حرب المائة عام بين إنجلترا وفرنسا في القرن الخامس عشر.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Social Transformations',
                    'title_arabic': 'التحولات الاجتماعية',
                    'description': 'Understanding the social changes that occurred in Europe during this period.',
                    'description_arabic': 'فهم التغيرات الاجتماعية التي حدثت في أوروبا خلال هذه الفترة.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What was a significant social change during the 15th and 16th centuries?',
                            'question_text_arabic': 'ما هو التغيير الاجتماعي المهم خلال القرنين الخامس عشر والسادس عشر؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The growth of cities and a merchant class', 'choice_text_arabic': 'نمو المدن وظهور طبقة التجار', 'is_correct': True},
                                {'choice_text': 'A decline in the population of Europe', 'choice_text_arabic': 'انخفاض عدد سكان أوروبا', 'is_correct': False},
                                {'choice_text': 'The disappearance of social classes', 'choice_text_arabic': 'اختفاء الطبقات الاجتماعية', 'is_correct': False},
                                {'choice_text': 'The end of all farming', 'choice_text_arabic': 'نهاية كل أشكال الزراعة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The invention of the printing press had a major impact on the spread of ideas and literacy.',
                            'question_text_arabic': 'كان لاختراع المطبعة تأثير كبير على انتشار الأفكار ومحو الأمية.',
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
                    f'Successfully created for Lesson 255: {total_exercises} exercises, {total_questions} questions, {total_choices} choices.'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 255 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
