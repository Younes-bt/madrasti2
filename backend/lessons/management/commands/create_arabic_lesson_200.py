
from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Arabic - Expression and Creation: Production of a Journalistic Article - Lesson ID: 200'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=200)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Planning a Journalistic Article',
                    'title_arabic': 'تخطيط المقال الصحفي',
                    'description': 'Steps to plan before writing an article.',
                    'description_arabic': 'خطوات التخطيط قبل كتابة المقال.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is the first step in producing a journalistic article?',
                            'question_text_arabic': 'ما هي الخطوة الأولى في إنتاج مقال صحفي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Choosing a relevant and interesting topic', 'choice_text_arabic': 'اختيار موضوع ملائم ومثير للاهتمام', 'is_correct': True},
                                {'choice_text': 'Writing the conclusion', 'choice_text_arabic': 'كتابة الخاتمة', 'is_correct': False},
                                {'choice_text': 'Editing the text', 'choice_text_arabic': 'تحرير النص', 'is_correct': False},
                                {'choice_text': 'Publishing the article', 'choice_text_arabic': 'نشر المقال', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Identifying the target audience is not important in journalism.',
                            'question_text_arabic': 'تحديد الجمهور المستهدف ليس مهمًا في الصحافة.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        }
                    ]
                },
                {
                    'title': 'Writing the Article',
                    'title_arabic': 'كتابة المقال',
                    'description': 'Focusing on the structure and components of the article.',
                    'description_arabic': 'التركيز على بنية ومكونات المقال.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What should the headline of a journalistic article be?',
                            'question_text_arabic': 'كيف يجب أن يكون عنوان المقال الصحفي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Concise, catchy, and informative', 'choice_text_arabic': 'موجز وجذاب وغني بالمعلومات', 'is_correct': True},
                                {'choice_text': 'Long and detailed', 'choice_text_arabic': 'طويل ومفصل', 'is_correct': False},
                                {'choice_text': 'Vague and mysterious', 'choice_text_arabic': 'غامض ومبهم', 'is_correct': False},
                                {'choice_text': 'Written in a foreign language', 'choice_text_arabic': 'مكتوب بلغة أجنبية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The body of the article should elaborate on the points mentioned in the lead.',
                            'question_text_arabic': 'يجب أن يفصل جسم المقال في النقاط المذكورة في المقدمة.',
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
                            choice_text_arabic='صواب',
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
                    f'Successfully created for Lesson 200: {total_exercises} exercises, {total_questions} questions, {total_choices} choices.'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 200 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
