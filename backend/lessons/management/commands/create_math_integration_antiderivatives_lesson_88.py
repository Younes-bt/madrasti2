from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Lesson 88: Integration and Antiderivatives'

    def handle(self, *args, **options):
        lesson_id = 88

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
                'title': 'Introduction to Integration',
                'title_ar': 'مقدمة في التكامل',
                'description': 'Understanding the concept and fundamental principles of integration',
                'description_ar': 'فهم مفهوم ومبادئ التكامل الأساسية',
                'difficulty': 'beginner',
                'points': 10,
                'questions': [
                    {
                        'text': 'What is integration in calculus?',
                        'text_ar': 'ما هو التكامل في التفاضل والتكامل؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'The reverse process of differentiation', 'text_ar': 'العملية العكسية للتفاضل', 'is_correct': True},
                            {'text': 'The same as differentiation', 'text_ar': 'نفس التفاضل', 'is_correct': False},
                            {'text': 'A type of algebraic equation', 'text_ar': 'نوع من المعادلات الجبرية', 'is_correct': False},
                            {'text': 'A geometric transformation', 'text_ar': 'تحويل هندسي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The symbol ∫ represents what mathematical operation?',
                        'text_ar': 'الرمز ∫ يمثل أي عملية رياضية؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Integration', 'text_ar': 'التكامل', 'is_correct': True},
                            {'text': 'Differentiation', 'text_ar': 'التفاضل', 'is_correct': False},
                            {'text': 'Summation', 'text_ar': 'الجمع', 'is_correct': False},
                            {'text': 'Multiplication', 'text_ar': 'الضرب', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which of the following are types of integration?',
                        'text_ar': 'أي من التالي أنواع التكامل؟',
                        'type': 'qcm_multiple',
                        'points': 3,
                        'choices': [
                            {'text': 'Definite integral', 'text_ar': 'التكامل المحدود', 'is_correct': True},
                            {'text': 'Indefinite integral', 'text_ar': 'التكامل غير المحدود', 'is_correct': True},
                            {'text': 'Improper integral', 'text_ar': 'التكامل غير المناسب', 'is_correct': True},
                            {'text': 'Derivative integral', 'text_ar': 'التكامل المشتق', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The fundamental theorem of calculus connects differentiation and integration.',
                        'text_ar': 'النظرية الأساسية للتفاضل والتكامل تربط بين التفاضل والتكامل.',
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
                'title': 'Basic Integration Rules',
                'title_ar': 'قواعد التكامل الأساسية',
                'description': 'Learning fundamental integration formulas and rules',
                'description_ar': 'تعلم صيغ وقواعد التكامل الأساسية',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What is ∫x^n dx where n ≠ -1?',
                        'text_ar': 'ما هو ∫x^n dx حيث n ≠ -1؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': '(x^(n+1))/(n+1) + C', 'text_ar': '(x^(n+1))/(n+1) + C', 'is_correct': True},
                            {'text': 'nx^(n-1) + C', 'text_ar': 'nx^(n-1) + C', 'is_correct': False},
                            {'text': 'x^(n-1) + C', 'text_ar': 'x^(n-1) + C', 'is_correct': False},
                            {'text': 'nx^n + C', 'text_ar': 'nx^n + C', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is ∫(1/x) dx?',
                        'text_ar': 'ما هو ∫(1/x) dx؟',
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
                        'text': 'Which functions have the following integrals?',
                        'text_ar': 'أي الدوال لها التكاملات التالية؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': '∫e^x dx = e^x + C', 'text_ar': '∫e^x dx = e^x + C', 'is_correct': True},
                            {'text': '∫sin(x) dx = -cos(x) + C', 'text_ar': '∫sin(x) dx = -cos(x) + C', 'is_correct': True},
                            {'text': '∫cos(x) dx = sin(x) + C', 'text_ar': '∫cos(x) dx = sin(x) + C', 'is_correct': True},
                            {'text': '∫x² dx = 2x + C', 'text_ar': '∫x² dx = 2x + C', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Calculate ∫(3x² + 2x + 1) dx',
                        'text_ar': 'احسب ∫(3x² + 2x + 1) dx',
                        'type': 'open_short',
                        'points': 5,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Definite Integrals',
                'title_ar': 'التكاملات المحدودة',
                'description': 'Understanding definite integrals and their geometric interpretation',
                'description_ar': 'فهم التكاملات المحدودة وتفسيرها الهندسي',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What does a definite integral ∫[a,b] f(x) dx represent geometrically?',
                        'text_ar': 'ماذا يمثل التكامل المحدود ∫[a,b] f(x) dx هندسياً؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'The area under the curve f(x) between x = a and x = b', 'text_ar': 'المساحة تحت المنحنى f(x) بين x = a و x = b', 'is_correct': True},
                            {'text': 'The slope of the tangent line', 'text_ar': 'ميل الخط المماس', 'is_correct': False},
                            {'text': 'The maximum value of f(x)', 'text_ar': 'القيمة العظمى لـ f(x)', 'is_correct': False},
                            {'text': 'The length of the curve', 'text_ar': 'طول المنحنى', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the value of ∫[0,1] x dx?',
                        'text_ar': 'ما قيمة ∫[0,1] x dx؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': '1/2', 'text_ar': '1/2', 'is_correct': True},
                            {'text': '1', 'text_ar': '1', 'is_correct': False},
                            {'text': '0', 'text_ar': '0', 'is_correct': False},
                            {'text': '2', 'text_ar': '2', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which properties apply to definite integrals?',
                        'text_ar': 'أي الخصائص تطبق على التكاملات المحدودة؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': '∫[a,b] f(x) dx = -∫[b,a] f(x) dx', 'text_ar': '∫[a,b] f(x) dx = -∫[b,a] f(x) dx', 'is_correct': True},
                            {'text': '∫[a,a] f(x) dx = 0', 'text_ar': '∫[a,a] f(x) dx = 0', 'is_correct': True},
                            {'text': '∫[a,c] f(x) dx = ∫[a,b] f(x) dx + ∫[b,c] f(x) dx', 'text_ar': '∫[a,c] f(x) dx = ∫[a,b] f(x) dx + ∫[b,c] f(x) dx', 'is_correct': True},
                            {'text': '∫[a,b] f(x) dx always equals 0', 'text_ar': '∫[a,b] f(x) dx دائماً يساوي 0', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The mean value theorem for integrals guarantees the existence of a point c such that f(c) equals the average value of f on [a,b].',
                        'text_ar': 'نظرية القيمة المتوسطة للتكاملات تضمن وجود نقطة c بحيث f(c) تساوي القيمة المتوسطة لـ f على [a,b].',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Evaluate ∫[1,2] (x² + 1) dx using the fundamental theorem of calculus.',
                        'text_ar': 'احسب ∫[1,2] (x² + 1) dx باستخدام النظرية الأساسية للتفاضل والتكامل.',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Integration Techniques',
                'title_ar': 'تقنيات التكامل',
                'description': 'Advanced methods for solving complex integrals',
                'description_ar': 'الطرق المتقدمة لحل التكاملات المعقدة',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'What is the integration by parts formula?',
                        'text_ar': 'ما هي صيغة التكامل بالأجزاء؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': '∫u dv = uv - ∫v du', 'text_ar': '∫u dv = uv - ∫v du', 'is_correct': True},
                            {'text': '∫u dv = uv + ∫v du', 'text_ar': '∫u dv = uv + ∫v du', 'is_correct': False},
                            {'text': '∫u dv = ∫v du', 'text_ar': '∫u dv = ∫v du', 'is_correct': False},
                            {'text': '∫u dv = u + v', 'text_ar': '∫u dv = u + v', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'When should you use substitution method in integration?',
                        'text_ar': 'متى يجب استخدام طريقة التعويض في التكامل؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'When the integrand contains a function and its derivative', 'text_ar': 'عندما يحتوي المتكامل على دالة ومشتقتها', 'is_correct': True},
                            {'text': 'Only for polynomial functions', 'text_ar': 'فقط للدوال كثيرة الحدود', 'is_correct': False},
                            {'text': 'Never in definite integrals', 'text_ar': 'أبداً في التكاملات المحدودة', 'is_correct': False},
                            {'text': 'Only for trigonometric functions', 'text_ar': 'فقط للدوال المثلثية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which techniques are commonly used for integration?',
                        'text_ar': 'أي التقنيات تستخدم عادة في التكامل؟',
                        'type': 'qcm_multiple',
                        'points': 6,
                        'choices': [
                            {'text': 'Integration by substitution', 'text_ar': 'التكامل بالتعويض', 'is_correct': True},
                            {'text': 'Integration by parts', 'text_ar': 'التكامل بالأجزاء', 'is_correct': True},
                            {'text': 'Partial fractions', 'text_ar': 'الكسور الجزئية', 'is_correct': True},
                            {'text': 'Integration by differentiation', 'text_ar': 'التكامل بالتفاضل', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Trigonometric substitution is useful for integrals involving √(a² - x²).',
                        'text_ar': 'التعويض المثلثي مفيد للتكاملات التي تتضمن √(a² - x²).',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Solve ∫xe^x dx using integration by parts.',
                        'text_ar': 'حل ∫xe^x dx باستخدام التكامل بالأجزاء.',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Applications of Integration',
                'title_ar': 'تطبيقات التكامل',
                'description': 'Real-world applications of integration in physics and geometry',
                'description_ar': 'التطبيقات الحقيقية للتكامل في الفيزياء والهندسة',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'How is integration used to find the area between two curves?',
                        'text_ar': 'كيف يستخدم التكامل لإيجاد المساحة بين منحنيين؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'By integrating the absolute difference of the functions', 'text_ar': 'بتكامل القيمة المطلقة لفرق الدالتين', 'is_correct': True},
                            {'text': 'By adding the integrals of both functions', 'text_ar': 'بجمع تكاملي الدالتين', 'is_correct': False},
                            {'text': 'By multiplying the integrals', 'text_ar': 'بضرب التكاملين', 'is_correct': False},
                            {'text': 'It cannot be done with integration', 'text_ar': 'لا يمكن فعل ذلك بالتكامل', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What formula gives the volume of a solid of revolution about the x-axis?',
                        'text_ar': 'ما الصيغة التي تعطي حجم المجسم الدوراني حول المحور x؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'V = π∫[a,b] [f(x)]² dx', 'text_ar': 'V = π∫[a,b] [f(x)]² dx', 'is_correct': True},
                            {'text': 'V = ∫[a,b] f(x) dx', 'text_ar': 'V = ∫[a,b] f(x) dx', 'is_correct': False},
                            {'text': 'V = 2π∫[a,b] f(x) dx', 'text_ar': 'V = 2π∫[a,b] f(x) dx', 'is_correct': False},
                            {'text': 'V = π∫[a,b] f(x) dx', 'text_ar': 'V = π∫[a,b] f(x) dx', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which physical quantities can be calculated using integration?',
                        'text_ar': 'أي الكميات الفيزيائية يمكن حسابها باستخدام التكامل؟',
                        'type': 'qcm_multiple',
                        'points': 6,
                        'choices': [
                            {'text': 'Work done by a variable force', 'text_ar': 'الشغل المبذول بواسطة قوة متغيرة', 'is_correct': True},
                            {'text': 'Center of mass', 'text_ar': 'مركز الكتلة', 'is_correct': True},
                            {'text': 'Arc length of curves', 'text_ar': 'طول قوس المنحنيات', 'is_correct': True},
                            {'text': 'Instantaneous velocity', 'text_ar': 'السرعة اللحظية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The average value of a function f(x) on [a,b] is given by (1/(b-a))∫[a,b] f(x) dx.',
                        'text_ar': 'القيمة المتوسطة للدالة f(x) على [a,b] تعطى بـ (1/(b-a))∫[a,b] f(x) dx.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Find the area enclosed by y = x² and y = 4 between their intersection points.',
                        'text_ar': 'أوجد المساحة المحاطة بـ y = x² و y = 4 بين نقطتي التقاطع.',
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