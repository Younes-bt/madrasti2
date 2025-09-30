from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Radioactive decay - Lesson ID: 38'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=38)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Fundamentals of Radioactive Decay',
                    'title_arabic': 'أساسيات التفكك الإشعاعي',
                    'description': 'Understanding the basic concepts of radioactivity and decay.',
                    'description_arabic': 'فهم المفاهيم الأساسية للنشاط الإشعاعي والتفكك.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is the unit of radioactivity?',
                            'question_text_arabic': 'ما هي وحدة النشاط الإشعاعي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Becquerel (Bq)', 'choice_text_arabic': 'البكريل (Bq)', 'is_correct': True},
                                {'choice_text': 'Joule (J)', 'choice_text_arabic': 'الجول (J)', 'is_correct': False},
                                {'choice_text': 'Watt (W)', 'choice_text_arabic': 'الواط (W)', 'is_correct': False},
                                {'choice_text': 'Newton (N)', 'choice_text_arabic': 'النيوتن (N)', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Radioactive decay is a spontaneous and random process.',
                            'question_text_arabic': 'التفكك الإشعاعي هو عملية تلقائية وعشوائية.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What does the term "half-life" refer to?',
                            'question_text_arabic': 'إلى ماذا يشير مصطلح "عمر النصف"؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Time for half of the radioactive nuclei to decay', 'choice_text_arabic': 'الزمن اللازم لتفكك نصف النوى المشعة', 'is_correct': True},
                                {'choice_text': 'Half the lifetime of a radioactive atom', 'choice_text_arabic': 'نصف عمر ذرة مشعة', 'is_correct': False},
                                {'choice_text': 'Time for the activity to double', 'choice_text_arabic': 'الزمن اللازم لمضاعفة النشاط', 'is_correct': False},
                                {'choice_text': 'Time for all nuclei to decay', 'choice_text_arabic': 'الزمن اللازم لتفكك كل النوى', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'The Law of Radioactive Decay',
                    'title_arabic': 'قانون التناقص الإشعاعي',
                    'description': 'Understanding the mathematical description of radioactive decay.',
                    'description_arabic': 'فهم الوصف الرياضي للتفكك الإشعاعي.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the mathematical formula for the law of radioactive decay?',
                            'question_text_arabic': 'ما هي الصيغة الرياضية لقانون التناقص الإشعاعي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'N(t) = N₀e^(-λt)', 'choice_text_arabic': 'N(t) = N₀e^(-λt)', 'is_correct': True},
                                {'choice_text': 'N(t) = N₀e^(λt)', 'choice_text_arabic': 'N(t) = N₀e^(λt)', 'is_correct': False},
                                {'choice_text': 'N(t) = N₀(1 - e^(-λt))', 'choice_text_arabic': 'N(t) = N₀(1 - e^(-λt))', 'is_correct': False},
                                {'choice_text': 'N(t) = N₀λt', 'choice_text_arabic': 'N(t) = N₀λt', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The activity of a radioactive sample is directly proportional to the number of radioactive nuclei present.',
                            'question_text_arabic': 'نشاط عينة مشعة يتناسب طردياً مع عدد النوى المشعة الموجودة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'How is the decay constant (λ) related to the half-life (T½)?',
                            'question_text_arabic': 'كيف ترتبط ثابتة التفكك (λ) بعمر النصف (T½)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'T½ = ln(2)/λ', 'choice_text_arabic': 'T½ = ln(2)/λ', 'is_correct': True},
                                {'choice_text': 'T½ = λ/ln(2)', 'choice_text_arabic': 'T½ = λ/ln(2)', 'is_correct': False},
                                {'choice_text': 'T½ = λ × ln(2)', 'choice_text_arabic': 'T½ = λ × ln(2)', 'is_correct': False},
                                {'choice_text': 'T½ = 1/λ', 'choice_text_arabic': 'T½ = 1/λ', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A sample contains 10¹² radioactive nuclei with a decay constant λ = 10⁻⁹ s⁻¹. What is the initial activity of the sample in Bq?',
                            'question_text_arabic': 'عينة تحتوي على 10¹² نواة مشعة بثابتة تفكك λ = 10⁻⁹ s⁻¹. ما هو النشاط الابتدائي للعينة بالبكريل؟',
                            'question_type': 'open_short',
                            'correct_answer': '1000 Bq'
                        }
                    ]
                },
                {
                    'title': 'Half-Life Calculations',
                    'title_arabic': 'حسابات عمر النصف',
                    'description': 'Solving problems involving half-life.',
                    'description_arabic': 'حل المسائل المتعلقة بعمر النصف.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'The half-life of Iodine-131 is 8 days. If a sample initially contains 40g, how much will remain after 24 days?',
                            'question_text_arabic': 'عمر النصف لليود-131 هو 8 أيام. إذا كانت عينة تحتوي في البداية على 40 جرامًا، فكم سيتبقى منها بعد 24 يومًا؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '5g', 'choice_text_arabic': '5 جرام', 'is_correct': True},
                                {'choice_text': '10g', 'choice_text_arabic': '10 جرام', 'is_correct': False},
                                {'choice_text': '20g', 'choice_text_arabic': '20 جرام', 'is_correct': False},
                                {'choice_text': '2.5g', 'choice_text_arabic': '2.5 جرام', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'If 87.5% of a radioactive sample decays, how many half-lives have passed?',
                            'question_text_arabic': 'إذا تفكك 87.5% من عينة مشعة، فكم عدد أعمار النصف التي مرت؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '3', 'choice_text_arabic': '3', 'is_correct': True},
                                {'choice_text': '2', 'choice_text_arabic': '2', 'is_correct': False},
                                {'choice_text': '4', 'choice_text_arabic': '4', 'is_correct': False},
                                {'choice_text': '7', 'choice_text_arabic': '7', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The activity of a sample drops from 600 Bq to 75 Bq in 90 minutes. What is the half-life of the substance?',
                            'question_text_arabic': 'ينخفض نشاط عينة من 600 بيكريل إلى 75 بيكريل في 90 دقيقة. ما هو عمر النصف للمادة؟',
                            'question_type': 'open_short',
                            'correct_answer': '30 minutes'
                        }
                    ]
                },
                {
                    'title': 'Radioactive Dating',
                    'title_arabic': 'التأريخ الإشعاعي',
                    'description': 'Applying the principles of radioactive decay for dating.',
                    'description_arabic': 'تطبيق مبادئ التفكك الإشعاعي للتأريخ.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'Carbon-14 dating is used to determine the age of:',
                            'question_text_arabic': 'يستخدم التأريخ بالكربون-14 لتحديد عمر:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Organic remains', 'choice_text_arabic': 'البقايا العضوية', 'is_correct': True},
                                {'choice_text': 'Rocks', 'choice_text_arabic': 'الصخور', 'is_correct': False},
                                {'choice_text': 'Metals', 'choice_text_arabic': 'المعادن', 'is_correct': False},
                                {'choice_text': 'Stars', 'choice_text_arabic': 'النجوم', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The half-life of Carbon-14 is approximately 5730 years.',
                            'question_text_arabic': 'يبلغ عمر النصف للكربون-14 حوالي 5730 سنة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A fossilized bone is found to have a Carbon-14 concentration that is 1/4 of that in living organisms. What is the approximate age of the fossil?',
                            'question_text_arabic': 'وجد أن تركيز الكربون-14 في عظمة متحجرة هو 1/4 تركيزه في الكائنات الحية. ما هو العمر التقريبي للحفرية؟',
                            'question_type': 'open_short',
                            'correct_answer': '11460 years'
                        }
                    ]
                },
                {
                    'title': 'Decay Series',
                    'title_arabic': 'سلاسل التفكك',
                    'description': 'Understanding sequences of radioactive decays.',
                    'description_arabic': 'فهم تسلسل التفككات الإشعاعية.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'A decay series ends when a stable isotope is formed.',
                            'question_text_arabic': 'تنتهي سلسلة التفكك عندما يتكون نظير مستقر.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'In the decay of Uranium-238 to Lead-206, a series of alpha and beta decays occur. How many alpha decays are there in this series?',
                            'question_text_arabic': 'في تفكك اليورانيوم-238 إلى الرصاص-206، تحدث سلسلة من تفككات ألفا وبيتا. كم عدد تفككات ألفا في هذه السلسلة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '8', 'choice_text_arabic': '8', 'is_correct': True},
                                {'choice_text': '6', 'choice_text_arabic': '6', 'is_correct': False},
                                {'choice_text': '10', 'choice_text_arabic': '10', 'is_correct': False},
                                {'choice_text': '14', 'choice_text_arabic': '14', 'is_correct': False}
                            ]
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
                        points=10 if ex_data['difficulty'] == 'beginner' else 15 if ex_data['difficulty'] == 'intermediate' else 20
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
                    completion_points=30 if ex_data['difficulty'] == 'beginner' else 50 if ex_data['difficulty'] == 'intermediate' else 70,
                    completion_coins=1,
                    perfect_score_bonus=20 if ex_data['difficulty'] == 'beginner' else 30 if ex_data['difficulty'] == 'intermediate' else 50
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created for Lesson 38 (Radioactive decay):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 38 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
