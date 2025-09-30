from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Lesson 92: Probabilities'

    def handle(self, *args, **options):
        lesson_id = 92

        try:
            lesson = Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'Lesson with ID {lesson_id} does not exist')
            )
            return

        # Clear existing exercises for this lesson
        Exercise.objects.filter(lesson_id=lesson_id).delete()

        exercises_data = [
            {
                'title': 'Introduction to Probability',
                'title_ar': 'مقدمة في الاحتمالات',
                'description': 'Understanding basic concepts and terminology of probability',
                'description_ar': 'فهم المفاهيم الأساسية ومصطلحات الاحتمالات',
                'difficulty': 'beginner',
                'points': 10,
                'questions': [
                    {
                        'text': 'What is probability?',
                        'text_ar': 'ما هو الاحتمال؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'A measure of the likelihood that an event will occur', 'text_ar': 'مقياس لاحتمالية حدوث حدث', 'is_correct': True},
                            {'text': 'The number of outcomes in an experiment', 'text_ar': 'عدد النتائج في تجربة', 'is_correct': False},
                            {'text': 'The average of all possible outcomes', 'text_ar': 'متوسط جميع النتائج الممكنة', 'is_correct': False},
                            {'text': 'The sum of all favorable outcomes', 'text_ar': 'مجموع جميع النتائج المرغوبة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the range of probability values?',
                        'text_ar': 'ما هو مدى قيم الاحتمال؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': '0 ≤ P ≤ 1', 'text_ar': '0 ≤ P ≤ 1', 'is_correct': True},
                            {'text': '0 < P < 1', 'text_ar': '0 < P < 1', 'is_correct': False},
                            {'text': '-1 ≤ P ≤ 1', 'text_ar': '-1 ≤ P ≤ 1', 'is_correct': False},
                            {'text': 'P ≥ 0', 'text_ar': 'P ≥ 0', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which terms are fundamental in probability theory?',
                        'text_ar': 'أي المصطلحات أساسية في نظرية الاحتمالات؟',
                        'type': 'qcm_multiple',
                        'points': 3,
                        'choices': [
                            {'text': 'Sample space', 'text_ar': 'فضاء العينة', 'is_correct': True},
                            {'text': 'Event', 'text_ar': 'الحدث', 'is_correct': True},
                            {'text': 'Outcome', 'text_ar': 'النتيجة', 'is_correct': True},
                            {'text': 'Variance', 'text_ar': 'التباين', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The probability of a certain event is 1.',
                        'text_ar': 'احتمال الحدث المؤكد يساوي 1.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Classical Probability',
                'title_ar': 'الاحتمال الكلاسيكي',
                'description': 'Calculating probabilities for equally likely outcomes',
                'description_ar': 'حساب الاحتمالات للنتائج متساوية الاحتمال',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What is the formula for classical probability?',
                        'text_ar': 'ما هي صيغة الاحتمال الكلاسيكي؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'P(E) = Number of favorable outcomes / Total number of outcomes', 'text_ar': 'P(E) = عدد النتائج المرغوبة / العدد الكلي للنتائج', 'is_correct': True},
                            {'text': 'P(E) = Total outcomes - Favorable outcomes', 'text_ar': 'P(E) = إجمالي النتائج - النتائج المرغوبة', 'is_correct': False},
                            {'text': 'P(E) = Favorable outcomes × Total outcomes', 'text_ar': 'P(E) = النتائج المرغوبة × إجمالي النتائج', 'is_correct': False},
                            {'text': 'P(E) = 1 - Unfavorable outcomes', 'text_ar': 'P(E) = 1 - النتائج غير المرغوبة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the probability of getting a head when flipping a fair coin?',
                        'text_ar': 'ما احتمال الحصول على صورة عند قذف عملة عادلة؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': '1/2', 'text_ar': '1/2', 'is_correct': True},
                            {'text': '1/3', 'text_ar': '1/3', 'is_correct': False},
                            {'text': '1/4', 'text_ar': '1/4', 'is_correct': False},
                            {'text': '1', 'text_ar': '1', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'When rolling a standard die, what are the probabilities of the following events?',
                        'text_ar': 'عند رمي نرد عادي، ما احتمالات الأحداث التالية؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'P(getting an even number) = 3/6 = 1/2', 'text_ar': 'P(الحصول على رقم زوجي) = 3/6 = 1/2', 'is_correct': True},
                            {'text': 'P(getting a number > 4) = 2/6 = 1/3', 'text_ar': 'P(الحصول على رقم > 4) = 2/6 = 1/3', 'is_correct': True},
                            {'text': 'P(getting a 7) = 0', 'text_ar': 'P(الحصول على 7) = 0', 'is_correct': True},
                            {'text': 'P(getting a number ≤ 6) = 1/2', 'text_ar': 'P(الحصول على رقم ≤ 6) = 1/2', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Calculate the probability of drawing a red card from a standard deck of 52 cards.',
                        'text_ar': 'احسب احتمال سحب ورقة حمراء من مجموعة عادية مكونة من 52 ورقة.',
                        'type': 'open_short',
                        'points': 5,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Conditional Probability',
                'title_ar': 'الاحتمال الشرطي',
                'description': 'Understanding probability when additional information is given',
                'description_ar': 'فهم الاحتمال عند إعطاء معلومات إضافية',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What is conditional probability?',
                        'text_ar': 'ما هو الاحتمال الشرطي؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'The probability of an event given that another event has occurred', 'text_ar': 'احتمال حدث بشرط حدوث حدث آخر', 'is_correct': True},
                            {'text': 'The probability of two events occurring together', 'text_ar': 'احتمال حدوث حدثين معاً', 'is_correct': False},
                            {'text': 'The probability that depends on conditions', 'text_ar': 'الاحتمال الذي يعتمد على شروط', 'is_correct': False},
                            {'text': 'The probability of an impossible event', 'text_ar': 'احتمال حدث مستحيل', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the formula for conditional probability P(A|B)?',
                        'text_ar': 'ما هي صيغة الاحتمال الشرطي P(A|B)؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'P(A|B) = P(A ∩ B) / P(B)', 'text_ar': 'P(A|B) = P(A ∩ B) / P(B)', 'is_correct': True},
                            {'text': 'P(A|B) = P(A) × P(B)', 'text_ar': 'P(A|B) = P(A) × P(B)', 'is_correct': False},
                            {'text': 'P(A|B) = P(A) + P(B)', 'text_ar': 'P(A|B) = P(A) + P(B)', 'is_correct': False},
                            {'text': 'P(A|B) = P(A) / P(B)', 'text_ar': 'P(A|B) = P(A) / P(B)', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'When are two events A and B independent?',
                        'text_ar': 'متى يكون الحدثان A و B مستقلين؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'When P(A|B) = P(A)', 'text_ar': 'عندما P(A|B) = P(A)', 'is_correct': True},
                            {'text': 'When P(B|A) = P(B)', 'text_ar': 'عندما P(B|A) = P(B)', 'is_correct': True},
                            {'text': 'When P(A ∩ B) = P(A) × P(B)', 'text_ar': 'عندما P(A ∩ B) = P(A) × P(B)', 'is_correct': True},
                            {'text': 'When P(A ∪ B) = P(A) + P(B)', 'text_ar': 'عندما P(A ∪ B) = P(A) + P(B)', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'If P(A) = 0.6, P(B) = 0.4, and P(A ∩ B) = 0.2, find P(A|B).',
                        'text_ar': 'إذا كان P(A) = 0.6، P(B) = 0.4، و P(A ∩ B) = 0.2، أوجد P(A|B).',
                        'type': 'open_short',
                        'points': 4,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Probability Distributions',
                'title_ar': 'التوزيعات الاحتمالية',
                'description': 'Introduction to discrete and continuous probability distributions',
                'description_ar': 'مقدمة في التوزيعات الاحتمالية المتقطعة والمستمرة',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'What is a probability distribution?',
                        'text_ar': 'ما هو التوزيع الاحتمالي؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'A function that assigns probabilities to all possible outcomes', 'text_ar': 'دالة تخصص احتمالات لجميع النتائج الممكنة', 'is_correct': True},
                            {'text': 'The average of all probabilities', 'text_ar': 'متوسط جميع الاحتمالات', 'is_correct': False},
                            {'text': 'The sum of all favorable outcomes', 'text_ar': 'مجموع جميع النتائج المرغوبة', 'is_correct': False},
                            {'text': 'A list of all possible events', 'text_ar': 'قائمة بجميع الأحداث الممكنة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What characterizes a discrete probability distribution?',
                        'text_ar': 'ما يميز التوزيع الاحتمالي المتقطع؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'The random variable takes on countable values', 'text_ar': 'المتغير العشوائي يأخذ قيماً قابلة للعد', 'is_correct': True},
                            {'text': 'The random variable is continuous', 'text_ar': 'المتغير العشوائي مستمر', 'is_correct': False},
                            {'text': 'All probabilities are equal', 'text_ar': 'جميع الاحتمالات متساوية', 'is_correct': False},
                            {'text': 'The distribution is always uniform', 'text_ar': 'التوزيع دائماً منتظم', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which are properties of probability distributions?',
                        'text_ar': 'أي من خصائص التوزيعات الاحتمالية؟',
                        'type': 'qcm_multiple',
                        'points': 6,
                        'choices': [
                            {'text': 'All probabilities are non-negative', 'text_ar': 'جميع الاحتمالات غير سالبة', 'is_correct': True},
                            {'text': 'The sum of all probabilities equals 1', 'text_ar': 'مجموع جميع الاحتمالات يساوي 1', 'is_correct': True},
                            {'text': 'Each probability is between 0 and 1', 'text_ar': 'كل احتمال بين 0 و 1', 'is_correct': True},
                            {'text': 'All probabilities must be equal', 'text_ar': 'جميع الاحتمالات يجب أن تكون متساوية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The binomial distribution models the number of successes in a fixed number of independent trials.',
                        'text_ar': 'التوزيع ذي الحدين ينمذج عدد النجاحات في عدد ثابت من المحاولات المستقلة.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Explain the difference between discrete and continuous probability distributions.',
                        'text_ar': 'اشرح الفرق بين التوزيعات الاحتمالية المتقطعة والمستمرة.',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Expected Value and Variance',
                'title_ar': 'القيمة المتوقعة والتباين',
                'description': 'Understanding measures of central tendency and spread in probability',
                'description_ar': 'فهم مقاييس النزعة المركزية والانتشار في الاحتمالات',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'What is the expected value (mean) of a discrete random variable X?',
                        'text_ar': 'ما هي القيمة المتوقعة (المتوسط) للمتغير العشوائي المتقطع X؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'E(X) = Σ x·P(X = x)', 'text_ar': 'E(X) = Σ x·P(X = x)', 'is_correct': True},
                            {'text': 'E(X) = Σ P(X = x)', 'text_ar': 'E(X) = Σ P(X = x)', 'is_correct': False},
                            {'text': 'E(X) = max(X)', 'text_ar': 'E(X) = max(X)', 'is_correct': False},
                            {'text': 'E(X) = (max + min)/2', 'text_ar': 'E(X) = (max + min)/2', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What does variance measure?',
                        'text_ar': 'ماذا يقيس التباين؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'The spread or dispersion of a distribution', 'text_ar': 'الانتشار أو التشتت للتوزيع', 'is_correct': True},
                            {'text': 'The center of a distribution', 'text_ar': 'مركز التوزيع', 'is_correct': False},
                            {'text': 'The maximum value', 'text_ar': 'القيمة العظمى', 'is_correct': False},
                            {'text': 'The number of possible outcomes', 'text_ar': 'عدد النتائج الممكنة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which formulas are correct for variance?',
                        'text_ar': 'أي الصيغ صحيحة للتباين؟',
                        'type': 'qcm_multiple',
                        'points': 6,
                        'choices': [
                            {'text': 'Var(X) = E(X²) - [E(X)]²', 'text_ar': 'Var(X) = E(X²) - [E(X)]²', 'is_correct': True},
                            {'text': 'Var(X) = E[(X - μ)²]', 'text_ar': 'Var(X) = E[(X - μ)²]', 'is_correct': True},
                            {'text': 'Standard deviation = √Var(X)', 'text_ar': 'الانحراف المعياري = √Var(X)', 'is_correct': True},
                            {'text': 'Var(X) = E(X) × E(X)', 'text_ar': 'Var(X) = E(X) × E(X)', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'For any constant c, E(c) = c and Var(c) = 0.',
                        'text_ar': 'لأي ثابت c، E(c) = c و Var(c) = 0.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'A random variable X has the distribution: P(X=1)=0.3, P(X=2)=0.5, P(X=3)=0.2. Calculate E(X) and Var(X).',
                        'text_ar': 'متغير عشوائي X له التوزيع: P(X=1)=0.3، P(X=2)=0.5، P(X=3)=0.2. احسب E(X) و Var(X).',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            }
        ]

        for i, exercise_data in enumerate(exercises_data, 1):
            exercise = Exercise.objects.create(
                lesson_id=lesson_id,
                created_by_id=1,  # Default admin user
                title=exercise_data['title'],
                title_arabic=exercise_data['title_ar'],
                instructions=exercise_data['description'],
                difficulty_level=exercise_data['difficulty'],
                order=i
            )

            # Create exercise reward
            ExerciseReward.objects.create(
                exercise=exercise,
                completion_points=exercise_data['points'],
                perfect_score_bonus=exercise_data['points'] // 2,
                high_score_bonus=exercise_data['points'] // 3,
                difficulty_multiplier=1.0 if exercise_data['difficulty'] == 'beginner' else 1.5 if exercise_data['difficulty'] == 'intermediate' else 2.0
            )

            for j, question_data in enumerate(exercise_data['questions'], 1):
                question = Question.objects.create(
                    exercise=exercise,
                    question_text=question_data['text'],
                    question_text_arabic=question_data['text_ar'],
                    question_type=question_data['type'],
                    points=question_data['points'],
                    order=j
                )

                for choice_data in question_data['choices']:
                    QuestionChoice.objects.create(
                        question=question,
                        choice_text=choice_data['text'],
                        choice_text_arabic=choice_data['text_ar'],
                        is_correct=choice_data['is_correct']
                    )

        # Count created objects
        exercise_count = Exercise.objects.filter(lesson_id=lesson_id).count()
        question_count = Question.objects.filter(exercise__lesson_id=lesson_id).count()
        choice_count = QuestionChoice.objects.filter(question__exercise__lesson_id=lesson_id).count()

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created for Lesson {lesson_id} ({lesson.title}):\n'
                f'Exercises: {exercise_count}\n'
                f'Questions: {question_count}\n'
                f'Choices: {choice_count}'
            )
        )