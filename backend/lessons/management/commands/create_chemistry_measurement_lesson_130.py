from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Measurement in chemistry - Lesson ID: 130'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=130)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Significant Figures and Precision',
                    'title_arabic': 'الأرقام المعنوية والدقة',
                    'description': 'Understanding significant figures, precision, and accuracy in chemical measurements',
                    'description_arabic': 'فهم الأرقام المعنوية والدقة والضبط في القياسات الكيميائية',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What are significant figures?',
                            'question_text_arabic': 'ما هي الأرقام المعنوية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Digits that carry meaningful information about precision', 'choice_text_arabic': 'الأرقام التي تحمل معلومات مفيدة عن الدقة', 'is_correct': True},
                                {'choice_text': 'Only the first digit in a number', 'choice_text_arabic': 'الرقم الأول فقط في العدد', 'is_correct': False},
                                {'choice_text': 'All numbers after the decimal point', 'choice_text_arabic': 'جميع الأرقام بعد العلامة العشرية', 'is_correct': False},
                                {'choice_text': 'The largest digits in a measurement', 'choice_text_arabic': 'أكبر الأرقام في القياس', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How many significant figures are in 0.00420?',
                            'question_text_arabic': 'كم عدد الأرقام المعنوية في 0.00420؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '3', 'choice_text_arabic': '3', 'is_correct': True},
                                {'choice_text': '5', 'choice_text_arabic': '5', 'is_correct': False},
                                {'choice_text': '2', 'choice_text_arabic': '2', 'is_correct': False},
                                {'choice_text': '6', 'choice_text_arabic': '6', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the difference between precision and accuracy?',
                            'question_text_arabic': 'ما الفرق بين الدقة والضبط؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Precision is reproducibility; accuracy is closeness to true value', 'choice_text_arabic': 'الدقة هي إمكانية التكرار؛ الضبط هو القرب من القيمة الحقيقية', 'is_correct': True},
                                {'choice_text': 'Precision and accuracy are the same thing', 'choice_text_arabic': 'الدقة والضبط نفس الشيء', 'is_correct': False},
                                {'choice_text': 'Accuracy is reproducibility; precision is closeness to true value', 'choice_text_arabic': 'الضبط هو إمكانية التكرار؛ الدقة هي القرب من القيمة الحقيقية', 'is_correct': False},
                                {'choice_text': 'Both depend only on the instrument used', 'choice_text_arabic': 'كلاهما يعتمد فقط على الأداة المستخدمة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'When multiplying measurements, the result should have how many significant figures?',
                            'question_text_arabic': 'عند ضرب القياسات، كم عدد الأرقام المعنوية التي يجب أن تكون في النتيجة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The same as the measurement with the fewest significant figures', 'choice_text_arabic': 'نفس عدد الأرقام المعنوية في القياس الذي له أقل أرقام معنوية', 'is_correct': True},
                                {'choice_text': 'The sum of all significant figures', 'choice_text_arabic': 'مجموع جميع الأرقام المعنوية', 'is_correct': False},
                                {'choice_text': 'Always 3 significant figures', 'choice_text_arabic': 'دائماً 3 أرقام معنوية', 'is_correct': False},
                                {'choice_text': 'The average of significant figures', 'choice_text_arabic': 'متوسط الأرقام المعنوية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Leading zeros are never significant.',
                            'question_text_arabic': 'الأصفار البادئة ليست معنوية أبداً.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Units and Dimensional Analysis',
                    'title_arabic': 'الوحدات والتحليل البعدي',
                    'description': 'Understanding SI units and converting between different unit systems',
                    'description_arabic': 'فهم وحدات النظام الدولي والتحويل بين أنظمة الوحدات المختلفة',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the SI base unit for amount of substance?',
                            'question_text_arabic': 'ما وحدة النظام الدولي الأساسية لكمية المادة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Mole (mol)', 'choice_text_arabic': 'مول (mol)', 'is_correct': True},
                                {'choice_text': 'Gram (g)', 'choice_text_arabic': 'جرام (g)', 'is_correct': False},
                                {'choice_text': 'Liter (L)', 'choice_text_arabic': 'لتر (L)', 'is_correct': False},
                                {'choice_text': 'Molecule', 'choice_text_arabic': 'جزيء', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Convert 2.5 kg to grams',
                            'question_text_arabic': 'حول 2.5 كيلوجرام إلى جرامات',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '2500 g', 'choice_text_arabic': '2500 جرام', 'is_correct': True},
                                {'choice_text': '25 g', 'choice_text_arabic': '25 جرام', 'is_correct': False},
                                {'choice_text': '250 g', 'choice_text_arabic': '250 جرام', 'is_correct': False},
                                {'choice_text': '0.25 g', 'choice_text_arabic': '0.25 جرام', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is dimensional analysis used for?',
                            'question_text_arabic': 'لماذا يُستخدم التحليل البعدي؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Converting between units', 'choice_text_arabic': 'التحويل بين الوحدات', 'is_correct': True},
                                {'choice_text': 'Checking equation validity', 'choice_text_arabic': 'فحص صحة المعادلات', 'is_correct': True},
                                {'choice_text': 'Solving complex calculations', 'choice_text_arabic': 'حل الحسابات المعقدة', 'is_correct': True},
                                {'choice_text': 'Measuring temperature only', 'choice_text_arabic': 'قياس درجة الحرارة فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which prefix represents 10⁻³?',
                            'question_text_arabic': 'أي بادئة تمثل 10⁻³؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'milli- (m)', 'choice_text_arabic': 'ميلي- (m)', 'is_correct': True},
                                {'choice_text': 'micro- (μ)', 'choice_text_arabic': 'مايكرو- (μ)', 'is_correct': False},
                                {'choice_text': 'nano- (n)', 'choice_text_arabic': 'نانو- (n)', 'is_correct': False},
                                {'choice_text': 'centi- (c)', 'choice_text_arabic': 'سنتي- (c)', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Convert 500 mL to L',
                            'question_text_arabic': 'حول 500 مليلتر إلى لتر',
                            'question_type': 'open_short',
                            'correct_answer': '0.5 L'
                        }
                    ]
                },
                {
                    'title': 'Laboratory Equipment and Techniques',
                    'title_arabic': 'أدوات وتقنيات المختبر',
                    'description': 'Understanding common laboratory equipment and proper measurement techniques',
                    'description_arabic': 'فهم أدوات المختبر الشائعة وتقنيات القياس الصحيحة',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Which piece of glassware is most accurate for measuring volume?',
                            'question_text_arabic': 'أي قطعة زجاجية هي الأكثر دقة لقياس الحجم؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Volumetric flask', 'choice_text_arabic': 'دورق معايرة', 'is_correct': True},
                                {'choice_text': 'Beaker', 'choice_text_arabic': 'كأس زجاجي', 'is_correct': False},
                                {'choice_text': 'Erlenmeyer flask', 'choice_text_arabic': 'دورق مخروطي', 'is_correct': False},
                                {'choice_text': 'Test tube', 'choice_text_arabic': 'أنبوب اختبار', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the purpose of a meniscus when reading liquid volumes?',
                            'question_text_arabic': 'ما الغرض من الهلال السائل عند قراءة أحجام السوائل؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'To read the volume at eye level at the bottom of the curve', 'choice_text_arabic': 'لقراءة الحجم عند مستوى العين في أسفل المنحنى', 'is_correct': True},
                                {'choice_text': 'To make the liquid look more colorful', 'choice_text_arabic': 'لجعل السائل يبدو أكثر تلويناً', 'is_correct': False},
                                {'choice_text': 'To prevent spilling', 'choice_text_arabic': 'لمنع الانسكاب', 'is_correct': False},
                                {'choice_text': 'To increase surface tension', 'choice_text_arabic': 'لزيادة التوتر السطحي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which tools are used for accurate mass measurement?',
                            'question_text_arabic': 'أي أدوات تُستخدم لقياس الكتلة بدقة؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Analytical balance', 'choice_text_arabic': 'ميزان تحليلي', 'is_correct': True},
                                {'choice_text': 'Electronic balance', 'choice_text_arabic': 'ميزان إلكتروني', 'is_correct': True},
                                {'choice_text': 'Top-loading balance', 'choice_text_arabic': 'ميزان علوي التحميل', 'is_correct': True},
                                {'choice_text': 'Thermometer', 'choice_text_arabic': 'ميزان حرارة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the typical precision of a graduated cylinder?',
                            'question_text_arabic': 'ما الدقة النموذجية للاسطوانة المدرجة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '±0.1 mL', 'choice_text_arabic': '±0.1 مليلتر', 'is_correct': True},
                                {'choice_text': '±1 mL', 'choice_text_arabic': '±1 مليلتر', 'is_correct': False},
                                {'choice_text': '±0.01 mL', 'choice_text_arabic': '±0.01 مليلتر', 'is_correct': False},
                                {'choice_text': '±10 mL', 'choice_text_arabic': '±10 مليلتر', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A burette is primarily used for titrations.',
                            'question_text_arabic': 'السحاحة تُستخدم بشكل أساسي للمعايرات.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Error Analysis and Data Treatment',
                    'title_arabic': 'تحليل الأخطاء ومعالجة البيانات',
                    'description': 'Understanding types of errors and statistical treatment of data',
                    'description_arabic': 'فهم أنواع الأخطاء والمعالجة الإحصائية للبيانات',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What are the two main types of experimental errors?',
                            'question_text_arabic': 'ما النوعان الرئيسيان للأخطاء التجريبية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Random (indeterminate) and systematic (determinate)', 'choice_text_arabic': 'عشوائية (غير محددة) ومنتظمة (محددة)', 'is_correct': True},
                                {'choice_text': 'Large and small errors', 'choice_text_arabic': 'أخطاء كبيرة وصغيرة', 'is_correct': False},
                                {'choice_text': 'Human and instrument errors', 'choice_text_arabic': 'أخطاء بشرية وأخطاء الأدوات', 'is_correct': False},
                                {'choice_text': 'Positive and negative errors', 'choice_text_arabic': 'أخطاء موجبة وسالبة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How can systematic errors be reduced?',
                            'question_text_arabic': 'كيف يمكن تقليل الأخطاء المنتظمة؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Calibrating instruments', 'choice_text_arabic': 'معايرة الأدوات', 'is_correct': True},
                                {'choice_text': 'Using standard reference materials', 'choice_text_arabic': 'استخدام مواد مرجعية معيارية', 'is_correct': True},
                                {'choice_text': 'Proper technique training', 'choice_text_arabic': 'التدريب على التقنيات الصحيحة', 'is_correct': True},
                                {'choice_text': 'Taking more measurements', 'choice_text_arabic': 'أخذ قياسات أكثر', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What does the standard deviation measure?',
                            'question_text_arabic': 'ماذا يقيس الانحراف المعياري؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The spread or precision of data around the mean', 'choice_text_arabic': 'انتشار أو دقة البيانات حول المتوسط', 'is_correct': True},
                                {'choice_text': 'The accuracy of measurements', 'choice_text_arabic': 'دقة القياسات', 'is_correct': False},
                                {'choice_text': 'The number of significant figures', 'choice_text_arabic': 'عدد الأرقام المعنوية', 'is_correct': False},
                                {'choice_text': 'The systematic error', 'choice_text_arabic': 'الخطأ المنتظم', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which statistical measure is most affected by outliers?',
                            'question_text_arabic': 'أي مقياس إحصائي يتأثر أكثر بالقيم الشاذة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Mean (average)', 'choice_text_arabic': 'المتوسط', 'is_correct': True},
                                {'choice_text': 'Median', 'choice_text_arabic': 'الوسيط', 'is_correct': False},
                                {'choice_text': 'Mode', 'choice_text_arabic': 'المنوال', 'is_correct': False},
                                {'choice_text': 'Range', 'choice_text_arabic': 'المدى', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Calculate the average of these measurements: 12.1, 12.3, 12.0, 12.2 g',
                            'question_text_arabic': 'احسب متوسط هذه القياسات: 12.1, 12.3, 12.0, 12.2 جرام',
                            'question_type': 'open_short',
                            'correct_answer': '12.15 g'
                        }
                    ]
                },
                {
                    'title': 'Safety and Good Laboratory Practices',
                    'title_arabic': 'السلامة والممارسات المختبرية الجيدة',
                    'description': 'Understanding laboratory safety procedures and best practices',
                    'description_arabic': 'فهم إجراءات السلامة المختبرية وأفضل الممارسات',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What should you do before starting any experiment?',
                            'question_text_arabic': 'ماذا يجب أن تفعل قبل بدء أي تجربة؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Read and understand the procedure', 'choice_text_arabic': 'قراءة وفهم الإجراء', 'is_correct': True},
                                {'choice_text': 'Put on appropriate safety equipment', 'choice_text_arabic': 'ارتداء معدات السلامة المناسبة', 'is_correct': True},
                                {'choice_text': 'Check that all equipment is clean', 'choice_text_arabic': 'التأكد من نظافة جميع المعدات', 'is_correct': True},
                                {'choice_text': 'Work as quickly as possible', 'choice_text_arabic': 'العمل بأسرع ما يمكن', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the universal solvent for cleaning glassware?',
                            'question_text_arabic': 'ما المذيب العام لتنظيف الأدوات الزجاجية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Distilled water', 'choice_text_arabic': 'الماء المقطر', 'is_correct': True},
                                {'choice_text': 'Alcohol', 'choice_text_arabic': 'الكحول', 'is_correct': False},
                                {'choice_text': 'Acetone', 'choice_text_arabic': 'الأسيتون', 'is_correct': False},
                                {'choice_text': 'Soap', 'choice_text_arabic': 'الصابون', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'When should you wear safety goggles?',
                            'question_text_arabic': 'متى يجب ارتداء نظارات السلامة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Always when in the laboratory', 'choice_text_arabic': 'دائماً عند التواجد في المختبر', 'is_correct': True},
                                {'choice_text': 'Only when working with acids', 'choice_text_arabic': 'فقط عند العمل مع الأحماض', 'is_correct': False},
                                {'choice_text': 'Only during heating experiments', 'choice_text_arabic': 'فقط أثناء تجارب التسخين', 'is_correct': False},
                                {'choice_text': 'Only when instructor is present', 'choice_text_arabic': 'فقط عند حضور المدرس', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What should you do if you spill a chemical on your skin?',
                            'question_text_arabic': 'ماذا يجب أن تفعل إذا انسكبت مادة كيميائية على جلدك؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Immediately flush with water for at least 15 minutes', 'choice_text_arabic': 'اغسل فوراً بالماء لمدة 15 دقيقة على الأقل', 'is_correct': True},
                                {'choice_text': 'Wipe it off with a towel', 'choice_text_arabic': 'امسحه بمنشفة', 'is_correct': False},
                                {'choice_text': 'Apply ice to the area', 'choice_text_arabic': 'ضع ثلج على المنطقة', 'is_correct': False},
                                {'choice_text': 'Continue working and clean it later', 'choice_text_arabic': 'استمر في العمل ونظفه لاحقاً', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'It is acceptable to eat or drink in the laboratory if you are careful.',
                            'question_text_arabic': 'من المقبول الأكل أو الشرب في المختبر إذا كنت حذراً.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        }
                    ]
                }
            ]

            total_exercises = 0
            total_questions = 0
            total_choices = 0

            for ex_data in exercises_data:
                # Create exercise
                exercise = Exercise.objects.create(
                    lesson=lesson,
                    created_by_id=1,  # Assuming admin user with ID 1
                    title=ex_data['title'],
                    title_arabic=ex_data['title_arabic'],
                    description=ex_data['description'],
                    instructions=ex_data.get('description_arabic', ''),
                    difficulty_level=ex_data['difficulty'],
                    is_active=True
                )
                total_exercises += 1

                # Create questions for this exercise
                for q_data in ex_data['questions']:
                    question = Question.objects.create(
                        exercise=exercise,
                        question_text=q_data['question_text'],
                        question_text_arabic=q_data['question_text_arabic'],
                        question_type=q_data['question_type'],
                        points=10 if ex_data['difficulty'] == 'beginner' else 15 if ex_data['difficulty'] == 'intermediate' else 20
                    )
                    total_questions += 1

                    # Create choices for QCM questions
                    if q_data['question_type'] in ['qcm_single', 'qcm_multiple'] and 'choices' in q_data:
                        for choice_data in q_data['choices']:
                            QuestionChoice.objects.create(
                                question=question,
                                choice_text=choice_data['choice_text'],
                                choice_text_arabic=choice_data['choice_text_arabic'],
                                is_correct=choice_data['is_correct']
                            )
                            total_choices += 1

                    # Create choices for true/false questions
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

                # Create rewards for exercise completion
                ExerciseReward.objects.create(
                    exercise=exercise,
                    completion_points=30 if ex_data['difficulty'] == 'beginner' else 50 if ex_data['difficulty'] == 'intermediate' else 70,
                    completion_coins=1,
                    perfect_score_bonus=20 if ex_data['difficulty'] == 'beginner' else 30 if ex_data['difficulty'] == 'intermediate' else 50
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created for Lesson 130 (Measurement in chemistry):\\n'
                    f'Exercises: {total_exercises}\\n'
                    f'Questions: {total_questions}\\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 130 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )