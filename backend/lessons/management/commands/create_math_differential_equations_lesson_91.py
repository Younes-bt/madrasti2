from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Lesson 91: Differential equations'

    def handle(self, *args, **options):
        lesson_id = 91

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
                'title': 'Introduction to Differential Equations',
                'title_ar': 'مقدمة في المعادلات التفاضلية',
                'description': 'Understanding the basic concepts and terminology of differential equations',
                'description_ar': 'فهم المفاهيم الأساسية والمصطلحات للمعادلات التفاضلية',
                'difficulty': 'beginner',
                'points': 10,
                'questions': [
                    {
                        'text': 'What is a differential equation?',
                        'text_ar': 'ما هي المعادلة التفاضلية؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'An equation involving derivatives of an unknown function', 'text_ar': 'معادلة تتضمن مشتقات دالة مجهولة', 'is_correct': True},
                            {'text': 'An equation involving only algebraic expressions', 'text_ar': 'معادلة تتضمن فقط تعابير جبرية', 'is_correct': False},
                            {'text': 'An equation with no solutions', 'text_ar': 'معادلة بدون حلول', 'is_correct': False},
                            {'text': 'An equation involving integrals only', 'text_ar': 'معادلة تتضمن تكاملات فقط', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the order of the differential equation d²y/dx² + 3dy/dx - 2y = 0?',
                        'text_ar': 'ما رتبة المعادلة التفاضلية d²y/dx² + 3dy/dx - 2y = 0؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': '2', 'text_ar': '2', 'is_correct': True},
                            {'text': '1', 'text_ar': '1', 'is_correct': False},
                            {'text': '3', 'text_ar': '3', 'is_correct': False},
                            {'text': '0', 'text_ar': '0', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which of the following are types of differential equations?',
                        'text_ar': 'أي من التالي أنواع المعادلات التفاضلية؟',
                        'type': 'qcm_multiple',
                        'points': 3,
                        'choices': [
                            {'text': 'Ordinary differential equations (ODEs)', 'text_ar': 'المعادلات التفاضلية العادية', 'is_correct': True},
                            {'text': 'Partial differential equations (PDEs)', 'text_ar': 'المعادلات التفاضلية الجزئية', 'is_correct': True},
                            {'text': 'Linear differential equations', 'text_ar': 'المعادلات التفاضلية الخطية', 'is_correct': True},
                            {'text': 'Algebraic equations', 'text_ar': 'المعادلات الجبرية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'A first-order differential equation involves only the first derivative of the unknown function.',
                        'text_ar': 'المعادلة التفاضلية من الرتبة الأولى تتضمن فقط المشتقة الأولى للدالة المجهولة.',
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
                'title': 'First-Order Linear Differential Equations',
                'title_ar': 'المعادلات التفاضلية الخطية من الرتبة الأولى',
                'description': 'Solving first-order linear differential equations',
                'description_ar': 'حل المعادلات التفاضلية الخطية من الرتبة الأولى',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What is the general form of a first-order linear differential equation?',
                        'text_ar': 'ما هي الصيغة العامة للمعادلة التفاضلية الخطية من الرتبة الأولى؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'dy/dx + P(x)y = Q(x)', 'text_ar': 'dy/dx + P(x)y = Q(x)', 'is_correct': True},
                            {'text': 'd²y/dx² + y = 0', 'text_ar': 'd²y/dx² + y = 0', 'is_correct': False},
                            {'text': 'dy/dx = y²', 'text_ar': 'dy/dx = y²', 'is_correct': False},
                            {'text': 'y = mx + b', 'text_ar': 'y = mx + b', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is an integrating factor?',
                        'text_ar': 'ما هو عامل التكامل؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'A function used to make a differential equation exact', 'text_ar': 'دالة تستخدم لجعل المعادلة التفاضلية تامة', 'is_correct': True},
                            {'text': 'The derivative of the solution', 'text_ar': 'مشتقة الحل', 'is_correct': False},
                            {'text': 'The constant of integration', 'text_ar': 'ثابت التكامل', 'is_correct': False},
                            {'text': 'The initial condition', 'text_ar': 'الشرط الابتدائي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'For the equation dy/dx + P(x)y = Q(x), the integrating factor is:',
                        'text_ar': 'للمعادلة dy/dx + P(x)y = Q(x)، عامل التكامل هو:',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'μ(x) = e^∫P(x)dx', 'text_ar': 'μ(x) = e^∫P(x)dx', 'is_correct': True},
                            {'text': 'μ(x) = ∫P(x)dx', 'text_ar': 'μ(x) = ∫P(x)dx', 'is_correct': False},
                            {'text': 'μ(x) = P(x)', 'text_ar': 'μ(x) = P(x)', 'is_correct': False},
                            {'text': 'μ(x) = e^P(x)', 'text_ar': 'μ(x) = e^P(x)', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Solve the differential equation dy/dx + 2y = 4e^x using an integrating factor.',
                        'text_ar': 'حل المعادلة التفاضلية dy/dx + 2y = 4e^x باستخدام عامل التكامل.',
                        'type': 'open_short',
                        'points': 5,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Separable Differential Equations',
                'title_ar': 'المعادلات التفاضلية القابلة للفصل',
                'description': 'Solving differential equations by separation of variables',
                'description_ar': 'حل المعادلات التفاضلية بفصل المتغيرات',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What characterizes a separable differential equation?',
                        'text_ar': 'ما يميز المعادلة التفاضلية القابلة للفصل؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'It can be written as dy/dx = f(x)g(y)', 'text_ar': 'يمكن كتابتها كـ dy/dx = f(x)g(y)', 'is_correct': True},
                            {'text': 'It is always linear', 'text_ar': 'دائماً خطية', 'is_correct': False},
                            {'text': 'It has constant coefficients', 'text_ar': 'لها معاملات ثابتة', 'is_correct': False},
                            {'text': 'It has no solution', 'text_ar': 'ليس لها حل', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the method for solving separable equations?',
                        'text_ar': 'ما هي طريقة حل المعادلات القابلة للفصل؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'Separate variables and integrate both sides', 'text_ar': 'فصل المتغيرات وتكامل كلا الطرفين', 'is_correct': True},
                            {'text': 'Use an integrating factor', 'text_ar': 'استخدم عامل التكامل', 'is_correct': False},
                            {'text': 'Take the derivative of both sides', 'text_ar': 'أخذ مشتقة كلا الطرفين', 'is_correct': False},
                            {'text': 'Use substitution u = y/x', 'text_ar': 'استخدم التعويض u = y/x', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which of the following are separable differential equations?',
                        'text_ar': 'أي من التالي معادلات تفاضلية قابلة للفصل؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'dy/dx = x/y', 'text_ar': 'dy/dx = x/y', 'is_correct': True},
                            {'text': 'dy/dx = e^x sin(y)', 'text_ar': 'dy/dx = e^x sin(y)', 'is_correct': True},
                            {'text': 'dy/dx = x² + y²', 'text_ar': 'dy/dx = x² + y²', 'is_correct': False},
                            {'text': 'dy/dx + xy = x', 'text_ar': 'dy/dx + xy = x', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The separation of variables method requires that g(y) ≠ 0.',
                        'text_ar': 'طريقة فصل المتغيرات تتطلب أن g(y) ≠ 0.',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Solve dy/dx = xy by separation of variables.',
                        'text_ar': 'حل dy/dx = xy بفصل المتغيرات.',
                        'type': 'open_short',
                        'points': 2,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Second-Order Linear Differential Equations',
                'title_ar': 'المعادلات التفاضلية الخطية من الرتبة الثانية',
                'description': 'Understanding homogeneous and non-homogeneous second-order equations',
                'description_ar': 'فهم المعادلات المتجانسة وغير المتجانسة من الرتبة الثانية',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'What is the general form of a second-order linear differential equation?',
                        'text_ar': 'ما هي الصيغة العامة للمعادلة التفاضلية الخطية من الرتبة الثانية؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'ay\'\' + by\' + cy = f(x)', 'text_ar': 'ay\'\' + by\' + cy = f(x)', 'is_correct': True},
                            {'text': 'ay\' + by = f(x)', 'text_ar': 'ay\' + by = f(x)', 'is_correct': False},
                            {'text': 'ay\'\'\' + by\'\' + cy\' = 0', 'text_ar': 'ay\'\'\' + by\'\' + cy\' = 0', 'is_correct': False},
                            {'text': 'y = ax² + bx + c', 'text_ar': 'y = ax² + bx + c', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the characteristic equation for ay\'\' + by\' + cy = 0?',
                        'text_ar': 'ما هي المعادلة المميزة لـ ay\'\' + by\' + cy = 0؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'ar² + br + c = 0', 'text_ar': 'ar² + br + c = 0', 'is_correct': True},
                            {'text': 'ar + b = 0', 'text_ar': 'ar + b = 0', 'is_correct': False},
                            {'text': 'ar³ + br² + cr = 0', 'text_ar': 'ar³ + br² + cr = 0', 'is_correct': False},
                            {'text': 'a + b + c = 0', 'text_ar': 'a + b + c = 0', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What are the possible cases for roots of the characteristic equation?',
                        'text_ar': 'ما هي الحالات الممكنة لجذور المعادلة المميزة؟',
                        'type': 'qcm_multiple',
                        'points': 6,
                        'choices': [
                            {'text': 'Two distinct real roots', 'text_ar': 'جذران حقيقيان متميزان', 'is_correct': True},
                            {'text': 'One repeated real root', 'text_ar': 'جذر حقيقي مكرر واحد', 'is_correct': True},
                            {'text': 'Two complex conjugate roots', 'text_ar': 'جذران مركبان مترافقان', 'is_correct': True},
                            {'text': 'No roots exist', 'text_ar': 'لا توجد جذور', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The general solution of a homogeneous second-order equation with distinct real roots r₁ and r₂ is y = c₁e^(r₁x) + c₂e^(r₂x).',
                        'text_ar': 'الحل العام للمعادلة المتجانسة من الرتبة الثانية مع جذرين حقيقيين متميزين r₁ و r₂ هو y = c₁e^(r₁x) + c₂e^(r₂x).',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Find the general solution of y\'\' - 5y\' + 6y = 0.',
                        'text_ar': 'أوجد الحل العام لـ y\'\' - 5y\' + 6y = 0.',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Applications of Differential Equations',
                'title_ar': 'تطبيقات المعادلات التفاضلية',
                'description': 'Real-world applications including population growth, cooling, and oscillations',
                'description_ar': 'التطبيقات الحقيقية بما في ذلك نمو السكان والتبريد والذبذبات',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'Which differential equation models exponential population growth?',
                        'text_ar': 'أي معادلة تفاضلية تمثل النمو السكاني الأسي؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'dP/dt = kP', 'text_ar': 'dP/dt = kP', 'is_correct': True},
                            {'text': 'dP/dt = k', 'text_ar': 'dP/dt = k', 'is_correct': False},
                            {'text': 'dP/dt = kP²', 'text_ar': 'dP/dt = kP²', 'is_correct': False},
                            {'text': 'd²P/dt² = kP', 'text_ar': 'd²P/dt² = kP', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What does Newton\'s Law of Cooling state?',
                        'text_ar': 'ماذا ينص قانون نيوتن للتبريد؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'The rate of temperature change is proportional to the temperature difference', 'text_ar': 'معدل تغير درجة الحرارة متناسب مع فرق درجة الحرارة', 'is_correct': True},
                            {'text': 'Temperature changes at a constant rate', 'text_ar': 'درجة الحرارة تتغير بمعدل ثابت', 'is_correct': False},
                            {'text': 'Temperature never changes', 'text_ar': 'درجة الحرارة لا تتغير أبداً', 'is_correct': False},
                            {'text': 'Temperature increases exponentially', 'text_ar': 'درجة الحرارة تزيد أسياً', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which phenomena can be modeled using differential equations?',
                        'text_ar': 'أي الظواهر يمكن نمذجتها باستخدام المعادلات التفاضلية؟',
                        'type': 'qcm_multiple',
                        'points': 6,
                        'choices': [
                            {'text': 'Radioactive decay', 'text_ar': 'التحلل الإشعاعي', 'is_correct': True},
                            {'text': 'Simple harmonic motion', 'text_ar': 'الحركة التوافقية البسيطة', 'is_correct': True},
                            {'text': 'Compound interest', 'text_ar': 'الفائدة المركبة', 'is_correct': True},
                            {'text': 'Static equilibrium', 'text_ar': 'التوازن الساكن', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The equation for simple harmonic motion is d²x/dt² + ω²x = 0.',
                        'text_ar': 'معادلة الحركة التوافقية البسيطة هي d²x/dt² + ω²x = 0.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'A cup of coffee at 90°C is placed in a room at 20°C. If it cools to 70°C in 5 minutes, set up the differential equation using Newton\'s Law of Cooling.',
                        'text_ar': 'وضع كوب قهوة في درجة حرارة 90°م في غرفة درجة حرارتها 20°م. إذا برد إلى 70°م في 5 دقائق، ضع المعادلة التفاضلية باستخدام قانون نيوتن للتبريد.',
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