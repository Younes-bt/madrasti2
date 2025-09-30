from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Lesson 89: Integration'

    def handle(self, *args, **options):
        lesson_id = 89

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
                'title': 'Riemann Sums and Integration',
                'title_ar': 'مجاميع ريمان والتكامل',
                'description': 'Understanding the concept of Riemann sums as the foundation of integration',
                'description_ar': 'فهم مفهوم مجاميع ريمان كأساس للتكامل',
                'difficulty': 'beginner',
                'points': 10,
                'questions': [
                    {
                        'text': 'What is a Riemann sum used to approximate?',
                        'text_ar': 'ما الذي تستخدم مجموعة ريمان لتقريبه؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'The area under a curve', 'text_ar': 'المساحة تحت المنحنى', 'is_correct': True},
                            {'text': 'The slope of a line', 'text_ar': 'ميل الخط', 'is_correct': False},
                            {'text': 'The maximum value of a function', 'text_ar': 'القيمة العظمى للدالة', 'is_correct': False},
                            {'text': 'The derivative of a function', 'text_ar': 'مشتقة الدالة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'As the number of rectangles in a Riemann sum approaches infinity, what happens?',
                        'text_ar': 'عندما يقترب عدد المستطيلات في مجموعة ريمان من اللانهاية، ماذا يحدث؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'The sum approaches the exact value of the definite integral', 'text_ar': 'المجموع يقترب من القيمة الدقيقة للتكامل المحدود', 'is_correct': True},
                            {'text': 'The sum becomes zero', 'text_ar': 'المجموع يصبح صفراً', 'is_correct': False},
                            {'text': 'The sum becomes infinite', 'text_ar': 'المجموع يصبح لانهائياً', 'is_correct': False},
                            {'text': 'The sum remains constant', 'text_ar': 'المجموع يبقى ثابتاً', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which types of Riemann sums exist?',
                        'text_ar': 'أي أنواع مجاميع ريمان موجودة؟',
                        'type': 'qcm_multiple',
                        'points': 3,
                        'choices': [
                            {'text': 'Left endpoint rule', 'text_ar': 'قاعدة النقطة اليسرى', 'is_correct': True},
                            {'text': 'Right endpoint rule', 'text_ar': 'قاعدة النقطة اليمنى', 'is_correct': True},
                            {'text': 'Midpoint rule', 'text_ar': 'قاعدة النقطة الوسطى', 'is_correct': True},
                            {'text': 'Maximum point rule', 'text_ar': 'قاعدة النقطة العظمى', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The definite integral is defined as the limit of Riemann sums.',
                        'text_ar': 'التكامل المحدود يُعرَّف كنهاية مجاميع ريمان.',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Properties of Definite Integrals',
                'title_ar': 'خصائص التكاملات المحدودة',
                'description': 'Exploring the fundamental properties and rules of definite integrals',
                'description_ar': 'استكشاف الخصائص والقواعد الأساسية للتكاملات المحدودة',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What is the value of ∫[a,a] f(x) dx?',
                        'text_ar': 'ما قيمة ∫[a,a] f(x) dx؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': '0', 'text_ar': '0', 'is_correct': True},
                            {'text': '1', 'text_ar': '1', 'is_correct': False},
                            {'text': 'a', 'text_ar': 'a', 'is_correct': False},
                            {'text': 'f(a)', 'text_ar': 'f(a)', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'If ∫[a,b] f(x) dx = 5, what is ∫[b,a] f(x) dx?',
                        'text_ar': 'إذا كان ∫[a,b] f(x) dx = 5، فما قيمة ∫[b,a] f(x) dx؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': '-5', 'text_ar': '-5', 'is_correct': True},
                            {'text': '5', 'text_ar': '5', 'is_correct': False},
                            {'text': '0', 'text_ar': '0', 'is_correct': False},
                            {'text': '10', 'text_ar': '10', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which properties hold for definite integrals?',
                        'text_ar': 'أي الخصائص صحيحة للتكاملات المحدودة؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': '∫[a,b] [f(x) + g(x)] dx = ∫[a,b] f(x) dx + ∫[a,b] g(x) dx', 'text_ar': '∫[a,b] [f(x) + g(x)] dx = ∫[a,b] f(x) dx + ∫[a,b] g(x) dx', 'is_correct': True},
                            {'text': '∫[a,b] cf(x) dx = c∫[a,b] f(x) dx', 'text_ar': '∫[a,b] cf(x) dx = c∫[a,b] f(x) dx', 'is_correct': True},
                            {'text': '∫[a,c] f(x) dx = ∫[a,b] f(x) dx + ∫[b,c] f(x) dx', 'text_ar': '∫[a,c] f(x) dx = ∫[a,b] f(x) dx + ∫[b,c] f(x) dx', 'is_correct': True},
                            {'text': '∫[a,b] f(x)g(x) dx = ∫[a,b] f(x) dx × ∫[a,b] g(x) dx', 'text_ar': '∫[a,b] f(x)g(x) dx = ∫[a,b] f(x) dx × ∫[a,b] g(x) dx', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Use the properties of integrals to evaluate ∫[0,2] (3x² - 2x + 1) dx.',
                        'text_ar': 'استخدم خصائص التكاملات لحساب ∫[0,2] (3x² - 2x + 1) dx.',
                        'type': 'open_short',
                        'points': 5,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Fundamental Theorem of Calculus',
                'title_ar': 'النظرية الأساسية للتفاضل والتكامل',
                'description': 'Understanding both parts of the fundamental theorem and its applications',
                'description_ar': 'فهم كلا الجزأين من النظرية الأساسية وتطبيقاتها',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What does the first part of the Fundamental Theorem of Calculus state?',
                        'text_ar': 'ماذا ينص الجزء الأول من النظرية الأساسية للتفاضل والتكامل؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'If F\'(x) = f(x), then ∫[a,b] f(x) dx = F(b) - F(a)', 'text_ar': 'إذا كان F\'(x) = f(x)، فإن ∫[a,b] f(x) dx = F(b) - F(a)', 'is_correct': True},
                            {'text': 'Integration and differentiation are inverse operations', 'text_ar': 'التكامل والتفاضل عمليتان عكسيتان', 'is_correct': False},
                            {'text': 'd/dx ∫[a,x] f(t) dt = f(x)', 'text_ar': 'd/dx ∫[a,x] f(t) dt = f(x)', 'is_correct': False},
                            {'text': 'Every function has an antiderivative', 'text_ar': 'كل دالة لها مشتق عكسي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What does the second part of the Fundamental Theorem of Calculus state?',
                        'text_ar': 'ماذا ينص الجزء الثاني من النظرية الأساسية للتفاضل والتكامل؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'If g(x) = ∫[a,x] f(t) dt, then g\'(x) = f(x)', 'text_ar': 'إذا كان g(x) = ∫[a,x] f(t) dt، فإن g\'(x) = f(x)', 'is_correct': True},
                            {'text': 'Every continuous function has an antiderivative', 'text_ar': 'كل دالة مستمرة لها مشتق عكسي', 'is_correct': False},
                            {'text': '∫[a,b] f(x) dx = F(b) - F(a)', 'text_ar': '∫[a,b] f(x) dx = F(b) - F(a)', 'is_correct': False},
                            {'text': 'Integration by parts formula', 'text_ar': 'صيغة التكامل بالأجزاء', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which statements about the Fundamental Theorem are correct?',
                        'text_ar': 'أي البيانات حول النظرية الأساسية صحيحة؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'It connects differentiation and integration', 'text_ar': 'تربط بين التفاضل والتكامل', 'is_correct': True},
                            {'text': 'It provides a method to evaluate definite integrals', 'text_ar': 'توفر طريقة لحساب التكاملات المحدودة', 'is_correct': True},
                            {'text': 'It guarantees that every function has an antiderivative', 'text_ar': 'تضمن أن كل دالة لها مشتق عكسي', 'is_correct': True},
                            {'text': 'It only applies to polynomial functions', 'text_ar': 'تطبق فقط على الدوال كثيرة الحدود', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Find d/dx ∫[1,x²] t³ dt using the Fundamental Theorem of Calculus.',
                        'text_ar': 'أوجد d/dx ∫[1,x²] t³ dt باستخدام النظرية الأساسية للتفاضل والتكامل.',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Integration by Substitution',
                'title_ar': 'التكامل بالتعويض',
                'description': 'Mastering the substitution method for solving complex integrals',
                'description_ar': 'إتقان طريقة التعويض لحل التكاملات المعقدة',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'What is the general form of u-substitution?',
                        'text_ar': 'ما هي الصيغة العامة للتعويض u؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'If u = g(x), then ∫f(g(x))g\'(x) dx = ∫f(u) du', 'text_ar': 'إذا كان u = g(x)، فإن ∫f(g(x))g\'(x) dx = ∫f(u) du', 'is_correct': True},
                            {'text': '∫f(x) dx = f(x) + C', 'text_ar': '∫f(x) dx = f(x) + C', 'is_correct': False},
                            {'text': '∫u dv = uv - ∫v du', 'text_ar': '∫u dv = uv - ∫v du', 'is_correct': False},
                            {'text': '∫[a,b] f(x) dx = F(b) - F(a)', 'text_ar': '∫[a,b] f(x) dx = F(b) - F(a)', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'When is substitution most effective?',
                        'text_ar': 'متى يكون التعويض أكثر فعالية؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'When the integrand contains a composite function and its derivative', 'text_ar': 'عندما يحتوي المتكامل على دالة مركبة ومشتقتها', 'is_correct': True},
                            {'text': 'Only for polynomial functions', 'text_ar': 'فقط للدوال كثيرة الحدود', 'is_correct': False},
                            {'text': 'When the function is already simple', 'text_ar': 'عندما تكون الدالة بسيطة بالفعل', 'is_correct': False},
                            {'text': 'Never in definite integrals', 'text_ar': 'أبداً في التكاملات المحدودة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which integrals are good candidates for u-substitution?',
                        'text_ar': 'أي التكاملات مرشحة جيدة للتعويض u؟',
                        'type': 'qcm_multiple',
                        'points': 6,
                        'choices': [
                            {'text': '∫(2x + 1)⁵ dx', 'text_ar': '∫(2x + 1)⁵ dx', 'is_correct': True},
                            {'text': '∫x sin(x²) dx', 'text_ar': '∫x sin(x²) dx', 'is_correct': True},
                            {'text': '∫e^(3x) dx', 'text_ar': '∫e^(3x) dx', 'is_correct': True},
                            {'text': '∫x² dx', 'text_ar': '∫x² dx', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'In definite integrals with substitution, you must change the limits of integration.',
                        'text_ar': 'في التكاملات المحدودة مع التعويض، يجب تغيير حدود التكامل.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Evaluate ∫x(x² + 1)⁴ dx using substitution.',
                        'text_ar': 'احسب ∫x(x² + 1)⁴ dx باستخدام التعويض.',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Numerical Integration Methods',
                'title_ar': 'طرق التكامل العددي',
                'description': 'Approximating definite integrals using numerical methods',
                'description_ar': 'تقريب التكاملات المحدودة باستخدام الطرق العددية',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'Why do we need numerical integration methods?',
                        'text_ar': 'لماذا نحتاج طرق التكامل العددي؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'Some integrals cannot be evaluated analytically', 'text_ar': 'بعض التكاملات لا يمكن حسابها تحليلياً', 'is_correct': True},
                            {'text': 'They are always more accurate than analytical methods', 'text_ar': 'دائماً أكثر دقة من الطرق التحليلية', 'is_correct': False},
                            {'text': 'They are faster than analytical integration', 'text_ar': 'أسرع من التكامل التحليلي', 'is_correct': False},
                            {'text': 'Analytical methods never work', 'text_ar': 'الطرق التحليلية لا تعمل أبداً', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which numerical method is generally most accurate?',
                        'text_ar': 'أي الطرق العددية أكثر دقة عموماً؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'Simpson\'s rule', 'text_ar': 'قاعدة سيمبسون', 'is_correct': True},
                            {'text': 'Left Riemann sum', 'text_ar': 'مجموعة ريمان اليسرى', 'is_correct': False},
                            {'text': 'Right Riemann sum', 'text_ar': 'مجموعة ريمان اليمنى', 'is_correct': False},
                            {'text': 'Rectangular rule', 'text_ar': 'القاعدة المستطيلة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which numerical integration methods are commonly used?',
                        'text_ar': 'أي طرق التكامل العددي تستخدم عادة؟',
                        'type': 'qcm_multiple',
                        'points': 6,
                        'choices': [
                            {'text': 'Trapezoidal rule', 'text_ar': 'قاعدة شبه المنحرف', 'is_correct': True},
                            {'text': 'Simpson\'s rule', 'text_ar': 'قاعدة سيمبسون', 'is_correct': True},
                            {'text': 'Midpoint rule', 'text_ar': 'قاعدة النقطة الوسطى', 'is_correct': True},
                            {'text': 'Derivative rule', 'text_ar': 'قاعدة المشتقة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Simpson\'s rule uses parabolic approximations to estimate the area under a curve.',
                        'text_ar': 'قاعدة سيمبسون تستخدم التقريبات المكافئية لتقدير المساحة تحت المنحنى.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Compare the accuracy of the trapezoidal rule and Simpson\'s rule for approximating ∫[0,1] x² dx.',
                        'text_ar': 'قارن دقة قاعدة شبه المنحرف وقاعدة سيمبسون لتقريب ∫[0,1] x² dx.',
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