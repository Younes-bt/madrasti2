from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Lesson 90: Antiderivatives (Primitives)'

    def handle(self, *args, **options):
        lesson_id = 90

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
                'title': 'Introduction to Antiderivatives',
                'title_ar': 'مقدمة في المشتقات العكسية',
                'description': 'Understanding the concept and notation of antiderivatives',
                'description_ar': 'فهم مفهوم ورموز المشتقات العكسية',
                'difficulty': 'beginner',
                'points': 10,
                'questions': [
                    {
                        'text': 'What is an antiderivative of a function f(x)?',
                        'text_ar': 'ما هو المشتق العكسي للدالة f(x)؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'A function F(x) such that F\'(x) = f(x)', 'text_ar': 'دالة F(x) بحيث F\'(x) = f(x)', 'is_correct': True},
                            {'text': 'The derivative of f(x)', 'text_ar': 'مشتقة f(x)', 'is_correct': False},
                            {'text': 'The inverse function of f(x)', 'text_ar': 'الدالة العكسية لـ f(x)', 'is_correct': False},
                            {'text': 'The negative of f(x)', 'text_ar': 'سالب f(x)', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Why do we add a constant C when finding antiderivatives?',
                        'text_ar': 'لماذا نضيف الثابت C عند إيجاد المشتقات العكسية؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'Because the derivative of any constant is zero', 'text_ar': 'لأن مشتقة أي ثابت تساوي صفراً', 'is_correct': True},
                            {'text': 'It makes the calculation easier', 'text_ar': 'يجعل الحساب أسهل', 'is_correct': False},
                            {'text': 'It is a mathematical tradition', 'text_ar': 'هو تقليد رياضي', 'is_correct': False},
                            {'text': 'It is not necessary', 'text_ar': 'ليس ضرورياً', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which terms are synonymous with antiderivative?',
                        'text_ar': 'أي المصطلحات مرادفة للمشتق العكسي؟',
                        'type': 'qcm_multiple',
                        'points': 3,
                        'choices': [
                            {'text': 'Primitive function', 'text_ar': 'الدالة الأولية', 'is_correct': True},
                            {'text': 'Indefinite integral', 'text_ar': 'التكامل غير المحدود', 'is_correct': True},
                            {'text': 'Integral', 'text_ar': 'التكامل', 'is_correct': True},
                            {'text': 'Derivative', 'text_ar': 'المشتقة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'If F(x) is an antiderivative of f(x), then F(x) + C is the most general antiderivative.',
                        'text_ar': 'إذا كان F(x) مشتقاً عكسياً لـ f(x)، فإن F(x) + C هو أعم مشتق عكسي.',
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
                'title': 'Basic Antiderivative Formulas',
                'title_ar': 'صيغ المشتقات العكسية الأساسية',
                'description': 'Learning fundamental antiderivative formulas for common functions',
                'description_ar': 'تعلم صيغ المشتقات العكسية الأساسية للدوال الشائعة',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What is the antiderivative of x^n where n ≠ -1?',
                        'text_ar': 'ما هو المشتق العكسي لـ x^n حيث n ≠ -1؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'x^(n+1)/(n+1) + C', 'text_ar': 'x^(n+1)/(n+1) + C', 'is_correct': True},
                            {'text': 'nx^(n-1) + C', 'text_ar': 'nx^(n-1) + C', 'is_correct': False},
                            {'text': 'x^(n-1) + C', 'text_ar': 'x^(n-1) + C', 'is_correct': False},
                            {'text': 'nx^n + C', 'text_ar': 'nx^n + C', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the antiderivative of 1/x?',
                        'text_ar': 'ما هو المشتق العكسي لـ 1/x؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'ln|x| + C', 'text_ar': 'ln|x| + C', 'is_correct': True},
                            {'text': '-1/x² + C', 'text_ar': '-1/x² + C', 'is_correct': False},
                            {'text': 'x + C', 'text_ar': 'x + C', 'is_correct': False},
                            {'text': '1/x² + C', 'text_ar': '1/x² + C', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which functions have the following antiderivatives?',
                        'text_ar': 'أي الدوال لها المشتقات العكسية التالية؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'Antiderivative of e^x is e^x + C', 'text_ar': 'المشتق العكسي لـ e^x هو e^x + C', 'is_correct': True},
                            {'text': 'Antiderivative of sin(x) is -cos(x) + C', 'text_ar': 'المشتق العكسي لـ sin(x) هو -cos(x) + C', 'is_correct': True},
                            {'text': 'Antiderivative of cos(x) is sin(x) + C', 'text_ar': 'المشتق العكسي لـ cos(x) هو sin(x) + C', 'is_correct': True},
                            {'text': 'Antiderivative of x² is 2x + C', 'text_ar': 'المشتق العكسي لـ x² هو 2x + C', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Find the antiderivative of f(x) = 4x³ - 6x² + 2x - 5.',
                        'text_ar': 'أوجد المشتق العكسي للدالة f(x) = 4x³ - 6x² + 2x - 5.',
                        'type': 'open_short',
                        'points': 5,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Properties of Antiderivatives',
                'title_ar': 'خصائص المشتقات العكسية',
                'description': 'Understanding linearity and other properties of antiderivatives',
                'description_ar': 'فهم الخطية وخصائص أخرى للمشتقات العكسية',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What is the linearity property of antiderivatives?',
                        'text_ar': 'ما هي خاصية الخطية للمشتقات العكسية؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': '∫[af(x) + bg(x)]dx = a∫f(x)dx + b∫g(x)dx', 'text_ar': '∫[af(x) + bg(x)]dx = a∫f(x)dx + b∫g(x)dx', 'is_correct': True},
                            {'text': '∫[f(x)g(x)]dx = ∫f(x)dx × ∫g(x)dx', 'text_ar': '∫[f(x)g(x)]dx = ∫f(x)dx × ∫g(x)dx', 'is_correct': False},
                            {'text': '∫f\'(x)dx = f(x)', 'text_ar': '∫f\'(x)dx = f(x)', 'is_correct': False},
                            {'text': 'Antiderivatives are always unique', 'text_ar': 'المشتقات العكسية دائماً فريدة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'If F(x) and G(x) are both antiderivatives of f(x), what is their relationship?',
                        'text_ar': 'إذا كان F(x) و G(x) كلاهما مشتقين عكسيين لـ f(x)، ما علاقتهما؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'They differ by a constant: F(x) = G(x) + C', 'text_ar': 'يختلفان بثابت: F(x) = G(x) + C', 'is_correct': True},
                            {'text': 'They are identical: F(x) = G(x)', 'text_ar': 'متطابقان: F(x) = G(x)', 'is_correct': False},
                            {'text': 'They are inverses: F(x) = 1/G(x)', 'text_ar': 'عكسيان: F(x) = 1/G(x)', 'is_correct': False},
                            {'text': 'They are unrelated', 'text_ar': 'غير مرتبطان', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which properties apply to antiderivatives?',
                        'text_ar': 'أي الخصائص تطبق على المشتقات العكسية؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'Sum rule: ∫[f(x) + g(x)]dx = ∫f(x)dx + ∫g(x)dx', 'text_ar': 'قاعدة الجمع: ∫[f(x) + g(x)]dx = ∫f(x)dx + ∫g(x)dx', 'is_correct': True},
                            {'text': 'Constant multiple rule: ∫cf(x)dx = c∫f(x)dx', 'text_ar': 'قاعدة المضاعف الثابت: ∫cf(x)dx = c∫f(x)dx', 'is_correct': True},
                            {'text': 'The antiderivative is unique up to a constant', 'text_ar': 'المشتق العكسي فريد عدا ثابت', 'is_correct': True},
                            {'text': 'Product rule: ∫[f(x)g(x)]dx = ∫f(x)dx × ∫g(x)dx', 'text_ar': 'قاعدة الضرب: ∫[f(x)g(x)]dx = ∫f(x)dx × ∫g(x)dx', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The derivative of an antiderivative gives back the original function.',
                        'text_ar': 'مشتقة المشتق العكسي تعطي الدالة الأصلية.',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Use the linearity property to find ∫(3x² - 4x + 7)dx.',
                        'text_ar': 'استخدم خاصية الخطية لإيجاد ∫(3x² - 4x + 7)dx.',
                        'type': 'open_short',
                        'points': 2,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Special Antiderivative Cases',
                'title_ar': 'حالات خاصة للمشتقات العكسية',
                'description': 'Handling more complex functions and special cases',
                'description_ar': 'التعامل مع الدوال الأكثر تعقيداً والحالات الخاصة',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'What is the antiderivative of sec²(x)?',
                        'text_ar': 'ما هو المشتق العكسي لـ sec²(x)؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'tan(x) + C', 'text_ar': 'tan(x) + C', 'is_correct': True},
                            {'text': 'sec(x) + C', 'text_ar': 'sec(x) + C', 'is_correct': False},
                            {'text': '-cot(x) + C', 'text_ar': '-cot(x) + C', 'is_correct': False},
                            {'text': 'csc(x) + C', 'text_ar': 'csc(x) + C', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the antiderivative of 1/(1 + x²)?',
                        'text_ar': 'ما هو المشتق العكسي لـ 1/(1 + x²)؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'arctan(x) + C', 'text_ar': 'arctan(x) + C', 'is_correct': True},
                            {'text': 'ln(1 + x²) + C', 'text_ar': 'ln(1 + x²) + C', 'is_correct': False},
                            {'text': 'arcsin(x) + C', 'text_ar': 'arcsin(x) + C', 'is_correct': False},
                            {'text': '1/x + C', 'text_ar': '1/x + C', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which functions require special techniques to find their antiderivatives?',
                        'text_ar': 'أي الدوال تتطلب تقنيات خاصة لإيجاد مشتقاتها العكسية؟',
                        'type': 'qcm_multiple',
                        'points': 6,
                        'choices': [
                            {'text': 'Products of functions', 'text_ar': 'ضرب الدوال', 'is_correct': True},
                            {'text': 'Composite functions', 'text_ar': 'الدوال المركبة', 'is_correct': True},
                            {'text': 'Rational functions with complex denominators', 'text_ar': 'الدوال النسبية ذات المقامات المعقدة', 'is_correct': True},
                            {'text': 'Simple polynomial functions', 'text_ar': 'الدوال كثيرة الحدود البسيطة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Every continuous function has an antiderivative.',
                        'text_ar': 'كل دالة مستمرة لها مشتق عكسي.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Explain why some elementary functions do not have elementary antiderivatives.',
                        'text_ar': 'اشرح لماذا بعض الدوال الأساسية ليس لها مشتقات عكسية أساسية.',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Initial Value Problems',
                'title_ar': 'مسائل القيمة الابتدائية',
                'description': 'Solving differential equations using antiderivatives with initial conditions',
                'description_ar': 'حل المعادلات التفاضلية باستخدام المشتقات العكسية مع الشروط الابتدائية',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'What is an initial value problem?',
                        'text_ar': 'ما هي مسألة القيمة الابتدائية؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'A differential equation with a specified condition at a point', 'text_ar': 'معادلة تفاضلية مع شرط محدد عند نقطة', 'is_correct': True},
                            {'text': 'Finding the first derivative of a function', 'text_ar': 'إيجاد المشتقة الأولى للدالة', 'is_correct': False},
                            {'text': 'Evaluating a function at x = 0', 'text_ar': 'تقييم دالة عند x = 0', 'is_correct': False},
                            {'text': 'The starting point of integration', 'text_ar': 'نقطة البداية للتكامل', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'How do initial conditions help determine the constant C?',
                        'text_ar': 'كيف تساعد الشروط الابتدائية في تحديد الثابت C؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'By providing a specific point that the solution must pass through', 'text_ar': 'بتوفير نقطة محددة يجب أن يمر بها الحل', 'is_correct': True},
                            {'text': 'By making the constant always equal to zero', 'text_ar': 'بجعل الثابت يساوي صفراً دائماً', 'is_correct': False},
                            {'text': 'By making the constant always equal to one', 'text_ar': 'بجعل الثابت يساوي واحداً دائماً', 'is_correct': False},
                            {'text': 'They do not help determine C', 'text_ar': 'لا تساعد في تحديد C', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which steps are involved in solving an initial value problem?',
                        'text_ar': 'أي الخطوات متضمنة في حل مسألة القيمة الابتدائية؟',
                        'type': 'qcm_multiple',
                        'points': 6,
                        'choices': [
                            {'text': 'Find the general antiderivative', 'text_ar': 'إيجاد المشتق العكسي العام', 'is_correct': True},
                            {'text': 'Apply the initial condition', 'text_ar': 'تطبيق الشرط الابتدائي', 'is_correct': True},
                            {'text': 'Solve for the constant C', 'text_ar': 'حل للثابت C', 'is_correct': True},
                            {'text': 'Take the derivative of the result', 'text_ar': 'أخذ مشتقة النتيجة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'An initial value problem has a unique solution when the function is continuous.',
                        'text_ar': 'مسألة القيمة الابتدائية لها حل وحيد عندما تكون الدالة مستمرة.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Solve the initial value problem: dy/dx = 2x + 3, y(0) = 5.',
                        'text_ar': 'حل مسألة القيمة الابتدائية: dy/dx = 2x + 3، y(0) = 5.',
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