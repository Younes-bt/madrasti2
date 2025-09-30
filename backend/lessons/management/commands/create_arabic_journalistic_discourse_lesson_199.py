
from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Arabic - Communication: Journalistic Discourse - Lesson ID: 199'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=199)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Identifying Features of Journalistic Discourse',
                    'title_arabic': 'تحديد سمات الخطاب الصحفي',
                    'description': 'Understanding the basic features of journalistic writing.',
                    'description_arabic': 'فهم السمات الأساسية للكتابة الصحفية.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is the primary purpose of journalistic discourse?',
                            'question_text_arabic': 'ما هو الغرض الأساسي للخطاب الصحفي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'To inform the public objectively', 'choice_text_arabic': 'إعلام الجمهور بموضوعية', 'is_correct': True},
                                {'choice_text': 'To entertain the reader with stories', 'choice_text_arabic': 'ترفيه القارئ بالقصص', 'is_correct': False},
                                {'choice_text': 'To persuade the reader to a specific viewpoint', 'choice_text_arabic': 'إقناع القارئ بوجهة نظر معينة', 'is_correct': False},
                                {'choice_text': "To express the author's personal feelings", 'choice_text_arabic': 'التعبير عن مشاعر الكاتب الشخصية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Journalistic writing should always be subjective and opinionated.',
                            'question_text_arabic': 'يجب أن تكون الكتابة الصحفية دائمًا ذاتية ومليئة بالآراء.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        },
                        {
                            'question_text': 'What is a headline in a news article?',
                            'question_text_arabic': 'ما هو العنوان الرئيسي في المقال الإخباري؟',
                            'question_type': 'open_short',
                            'correct_answer': 'The title of the article, designed to grab attention.'
                        }
                    ]
                },
                {
                    'title': 'Structure of a News Article',
                    'title_arabic': 'بنية المقال الإخباري',
                    'description': 'Analyzing the structure of a typical news article.',
                    'description_arabic': 'تحليل بنية المقال الإخباري النموذجي.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the "inverted pyramid" structure in journalism?',
                            'question_text_arabic': 'ما هي بنية "الهرم المقلوب" في الصحافة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Presenting the most important information first', 'choice_text_arabic': 'تقديم المعلومات الأكثر أهمية أولاً', 'is_correct': True},
                                {'choice_text': 'Building up to a conclusion at the end', 'choice_text_arabic': 'البناء نحو استنتاج في النهاية', 'is_correct': False},
                                {'choice_text': 'Arranging information chronologically', 'choice_text_arabic': 'ترتيب المعلومات ترتيبًا زمنيًا', 'is_correct': False},
                                {'choice_text': 'Hiding the main point until the last paragraph', 'choice_text_arabic': 'إخفاء النقطة الرئيسية حتى الفقرة الأخيرة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The first paragraph of a news story, which summarizes the most important information, is called the lead (or lede).',
                            'question_text_arabic': 'الفقرة الأولى من القصة الإخبارية، التي تلخص أهم المعلومات، تسمى المقدمة (أو الليد).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What are the "5 Ws and H" that a good news lead should answer?',
                            'question_text_arabic': 'ما هي "الأسئلة الخمسة" (من، ماذا، متى، أين، لماذا) و "كيف" التي يجب أن تجيب عليها المقدمة الإخبارية الجيدة؟',
                            'question_type': 'open_short',
                            'correct_answer': 'Who, What, When, Where, Why, and How'
                        }
                    ]
                },
                {
                    'title': 'Advanced Journalistic Concepts',
                    'title_arabic': 'مفاهيم صحفية متقدمة',
                    'description': 'Exploring concepts like bias, sources, and different types of news.',
                    'description_arabic': 'استكشاف مفاهيم مثل التحيز والمصادر وأنواع الأخبار المختلفة.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is the difference between "hard news" and "soft news"?',
                            'question_text_arabic': 'ما الفرق بين "الأخبار الجادة" و "الأخبار الخفيفة"؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Hard news is timely and important, while soft news is more feature-oriented and less urgent.', 'choice_text_arabic': 'الأخبار الجادة آنية ومهمة، بينما الأخبار الخفيفة أكثر تركيزًا على الميزات وأقل إلحاحًا.', 'is_correct': True},
                                {'choice_text': 'Hard news is difficult to read, while soft news is easy.', 'choice_text_arabic': 'الأخبار الجادة صعبة القراءة، بينما الأخبار الخفيفة سهلة.', 'is_correct': False},
                                {'choice_text': 'Hard news is printed on thicker paper.', 'choice_text_arabic': 'تُطبع الأخبار الجادة على ورق أكثر سمكًا.', 'is_correct': False},
                                {'choice_text': 'There is no difference.', 'choice_text_arabic': 'لا يوجد فرق.', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Presenting information in a way that favors one side of an issue is called bias.',
                            'question_text_arabic': 'تقديم المعلومات بطريقة تفضل جانبًا واحدًا من قضية ما يسمى التحيز.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Why is it important for journalists to use multiple sources?',
                            'question_text_arabic': 'لماذا من المهم للصحفيين استخدام مصادر متعددة؟',
                            'question_type': 'open_short',
                            'correct_answer': 'To ensure accuracy, provide different perspectives, and verify information.'
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
                        points=10 if ex_data['difficulty'] == 'beginner' else (15 if ex_data['difficulty'] == 'intermediate' else 20)
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
                    completion_points=40,
                    completion_coins=2,
                    perfect_score_bonus=25
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created for Lesson 199 (Arabic - Communication: Journalistic Discourse):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 199 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
