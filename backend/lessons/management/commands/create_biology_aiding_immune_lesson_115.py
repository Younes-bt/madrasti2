from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Aiding the immune system - Lesson ID: 115'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=115)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Vaccination and Immunization',
                    'title_arabic': 'التطعيم والتمنيع',
                    'description': 'How vaccines boost immune protection',
                    'description_arabic': 'كيف تعزز اللقاحات الحماية المناعية',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is vaccination?',
                            'question_text_arabic': 'ما هو التطعيم؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Administration of vaccines to stimulate immune memory', 'choice_text_arabic': 'إعطاء اللقاحات لتحفيز الذاكرة المناعية', 'is_correct': True},
                                {'choice_text': 'Treatment with antibiotics for infections', 'choice_text_arabic': 'العلاج بالمضادات الحيوية للعدوى', 'is_correct': False},
                                {'choice_text': 'Surgical removal of pathogens', 'choice_text_arabic': 'الإزالة الجراحية لمسببات الأمراض', 'is_correct': False},
                                {'choice_text': 'Use of antiseptics on wounds', 'choice_text_arabic': 'استخدام المطهرات على الجروح', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What types of vaccines exist?',
                            'question_text_arabic': 'ما أنواع اللقاحات الموجودة؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Live attenuated vaccines', 'choice_text_arabic': 'لقاحات حية مضعفة', 'is_correct': True},
                                {'choice_text': 'Inactivated (killed) vaccines', 'choice_text_arabic': 'لقاحات معطلة (مقتولة)', 'is_correct': True},
                                {'choice_text': 'Subunit vaccines', 'choice_text_arabic': 'لقاحات الوحدات الفرعية', 'is_correct': True},
                                {'choice_text': 'Antibiotic vaccines', 'choice_text_arabic': 'لقاحات مضادة حيوية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How do vaccines create immunity?',
                            'question_text_arabic': 'كيف تخلق اللقاحات المناعة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Expose immune system to safe antigens to build memory', 'choice_text_arabic': 'تعرض الجهاز المناعي لمستضدات آمنة لبناء الذاكرة', 'is_correct': True},
                                {'choice_text': 'Directly kill all pathogens in the body', 'choice_text_arabic': 'تقتل مباشرة جميع مسببات الأمراض في الجسم', 'is_correct': False},
                                {'choice_text': 'Replace damaged immune cells', 'choice_text_arabic': 'تحل محل الخلايا المناعية التالفة', 'is_correct': False},
                                {'choice_text': 'Strengthen physical barriers only', 'choice_text_arabic': 'تقوي الحواجز الفيزيائية فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Vaccines can prevent diseases before infection occurs.',
                            'question_text_arabic': 'اللقاحات يمكن أن تمنع الأمراض قبل حدوث العدوى.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Immunotherapy and Medical Interventions',
                    'title_arabic': 'العلاج المناعي والتدخلات الطبية',
                    'description': 'Medical treatments that enhance or modulate immune responses',
                    'description_arabic': 'العلاجات الطبية التي تعزز أو تنظم الاستجابات المناعية',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is passive immunization?',
                            'question_text_arabic': 'ما هو التمنيع السلبي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Transfer of ready-made antibodies from another source', 'choice_text_arabic': 'نقل أجسام مضادة جاهزة من مصدر آخر', 'is_correct': True},
                                {'choice_text': 'Stimulation of body to produce its own antibodies', 'choice_text_arabic': 'تحفيز الجسم لإنتاج أجسامه المضادة الخاصة', 'is_correct': False},
                                {'choice_text': 'Suppression of all immune responses', 'choice_text_arabic': 'قمع جميع الاستجابات المناعية', 'is_correct': False},
                                {'choice_text': 'Replacement of immune cells with artificial ones', 'choice_text_arabic': 'استبدال الخلايا المناعية بأخرى صناعية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'When is passive immunization used?',
                            'question_text_arabic': 'متى يُستخدم التمنيع السلبي؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Emergency exposure situations', 'choice_text_arabic': 'حالات التعرض الطارئة', 'is_correct': True},
                                {'choice_text': 'Immunocompromised patients', 'choice_text_arabic': 'المرضى ذوو المناعة المضعفة', 'is_correct': True},
                                {'choice_text': 'Snake bite treatment', 'choice_text_arabic': 'علاج لدغة الثعبان', 'is_correct': True},
                                {'choice_text': 'Routine childhood immunization', 'choice_text_arabic': 'التطعيم الروتيني للأطفال', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are monoclonal antibodies?',
                            'question_text_arabic': 'ما هي الأجسام المضادة وحيدة النسيلة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Identical antibodies produced by cloned immune cells', 'choice_text_arabic': 'أجسام مضادة متطابقة ينتجها خلايا مناعية مستنسخة', 'is_correct': True},
                                {'choice_text': 'Multiple different antibodies from one person', 'choice_text_arabic': 'أجسام مضادة مختلفة متعددة من شخص واحد', 'is_correct': False},
                                {'choice_text': 'Antibodies that target only one type of cell', 'choice_text_arabic': 'أجسام مضادة تستهدف نوعاً واحداً من الخلايا فقط', 'is_correct': False},
                                {'choice_text': 'Naturally occurring antibodies in blood', 'choice_text_arabic': 'أجسام مضادة طبيعية في الدم', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is immunosuppressive therapy?',
                            'question_text_arabic': 'ما هو العلاج المثبط للمناعة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Treatment that reduces immune system activity', 'choice_text_arabic': 'علاج يقلل نشاط الجهاز المناعي', 'is_correct': True},
                                {'choice_text': 'Treatment that enhances immune responses', 'choice_text_arabic': 'علاج يعزز الاستجابات المناعية', 'is_correct': False},
                                {'choice_text': 'Treatment that replaces immune cells', 'choice_text_arabic': 'علاج يحل محل الخلايا المناعية', 'is_correct': False},
                                {'choice_text': 'Treatment that repairs damaged tissues', 'choice_text_arabic': 'علاج يصلح الأنسجة التالفة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Immunosuppressive drugs are used to prevent organ transplant rejection.',
                            'question_text_arabic': 'الأدوية مثبطة المناعة تُستخدم لمنع رفض زراعة الأعضاء.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Nutrition and Immune Health',
                    'title_arabic': 'التغذية وصحة المناعة',
                    'description': 'How proper nutrition supports immune function',
                    'description_arabic': 'كيف تدعم التغذية السليمة وظيفة المناعة',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Which nutrients are essential for immune function?',
                            'question_text_arabic': 'أي العناصر الغذائية ضرورية لوظيفة المناعة؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Vitamin C (ascorbic acid)', 'choice_text_arabic': 'فيتامين سي (حمض الأسكوربيك)', 'is_correct': True},
                                {'choice_text': 'Vitamin D', 'choice_text_arabic': 'فيتامين د', 'is_correct': True},
                                {'choice_text': 'Zinc', 'choice_text_arabic': 'الزنك', 'is_correct': True},
                                {'choice_text': 'Saturated fats only', 'choice_text_arabic': 'الدهون المشبعة فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How does malnutrition affect immunity?',
                            'question_text_arabic': 'كيف يؤثر سوء التغذية على المناعة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Weakens immune responses and increases infection risk', 'choice_text_arabic': 'يضعف الاستجابات المناعية ويزيد خطر العدوى', 'is_correct': True},
                                {'choice_text': 'Strengthens immunity by reducing metabolic burden', 'choice_text_arabic': 'يقوي المناعة بتقليل العبء الأيضي', 'is_correct': False},
                                {'choice_text': 'Has no effect on immune system function', 'choice_text_arabic': 'ليس له تأثير على وظيفة الجهاز المناعي', 'is_correct': False},
                                {'choice_text': 'Only affects physical barriers, not immune cells', 'choice_text_arabic': 'يؤثر فقط على الحواجز الفيزيائية وليس الخلايا المناعية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What role does vitamin D play in immunity?',
                            'question_text_arabic': 'ما دور فيتامين د في المناعة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Modulates immune cell function and reduces inflammation', 'choice_text_arabic': 'ينظم وظيفة الخلايا المناعية ويقلل الالتهاب', 'is_correct': True},
                                {'choice_text': 'Only helps with calcium absorption', 'choice_text_arabic': 'يساعد فقط في امتصاص الكالسيوم', 'is_correct': False},
                                {'choice_text': 'Produces antibodies directly', 'choice_text_arabic': 'ينتج الأجسام المضادة مباشرة', 'is_correct': False},
                                {'choice_text': 'Destroys pathogens in the blood', 'choice_text_arabic': 'يدمر مسببات الأمراض في الدم', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which foods can support immune health?',
                            'question_text_arabic': 'أي الأطعمة يمكن أن تدعم صحة المناعة؟',
                            'question_type': 'open_short',
                            'correct_answer': 'Citrus fruits, leafy greens, yogurt, nuts, fish, garlic'
                        },
                        {
                            'question_text': 'Probiotics can help support immune function by maintaining healthy gut bacteria.',
                            'question_text_arabic': 'البروبيوتيك يمكن أن يساعد في دعم وظيفة المناعة بالحفاظ على بكتيريا الأمعاء الصحية.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Lifestyle Factors and Immune Support',
                    'title_arabic': 'عوامل نمط الحياة ودعم المناعة',
                    'description': 'How lifestyle choices affect immune system strength',
                    'description_arabic': 'كيف تؤثر خيارات نمط الحياة على قوة الجهاز المناعي',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'How does exercise affect immune function?',
                            'question_text_arabic': 'كيف يؤثر التمرين على وظيفة المناعة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Moderate exercise boosts immunity; excessive exercise may suppress it', 'choice_text_arabic': 'التمرين المعتدل يعزز المناعة؛ التمرين المفرط قد يثبطها', 'is_correct': True},
                                {'choice_text': 'Exercise always weakens immune function', 'choice_text_arabic': 'التمرين يضعف دائماً وظيفة المناعة', 'is_correct': False},
                                {'choice_text': 'Exercise has no effect on immunity', 'choice_text_arabic': 'التمرين ليس له تأثير على المناعة', 'is_correct': False},
                                {'choice_text': 'Only strength training affects immunity', 'choice_text_arabic': 'تمارين القوة فقط تؤثر على المناعة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the relationship between sleep and immunity?',
                            'question_text_arabic': 'ما العلاقة بين النوم والمناعة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Adequate sleep is essential for optimal immune function', 'choice_text_arabic': 'النوم الكافي ضروري للوظيفة المناعية المثلى', 'is_correct': True},
                                {'choice_text': 'Sleep has no impact on immune responses', 'choice_text_arabic': 'النوم ليس له تأثير على الاستجابات المناعية', 'is_correct': False},
                                {'choice_text': 'More sleep always weakens immunity', 'choice_text_arabic': 'النوم أكثر يضعف دائماً المناعة', 'is_correct': False},
                                {'choice_text': 'Only REM sleep affects immune function', 'choice_text_arabic': 'نوم حركة العين السريعة فقط يؤثر على وظيفة المناعة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How does chronic stress affect immunity?',
                            'question_text_arabic': 'كيف يؤثر الإجهاد المزمن على المناعة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Suppresses immune responses and increases disease susceptibility', 'choice_text_arabic': 'يثبط الاستجابات المناعية ويزيد القابلية للمرض', 'is_correct': True},
                                {'choice_text': 'Always enhances immune function', 'choice_text_arabic': 'يعزز دائماً وظيفة المناعة', 'is_correct': False},
                                {'choice_text': 'Only affects mental health, not immunity', 'choice_text_arabic': 'يؤثر فقط على الصحة النفسية وليس المناعة', 'is_correct': False},
                                {'choice_text': 'Has no measurable effects on the body', 'choice_text_arabic': 'ليس له تأثيرات قابلة للقياس على الجسم', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which lifestyle factors can weaken immunity?',
                            'question_text_arabic': 'أي عوامل نمط الحياة يمكن أن تضعف المناعة؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Smoking', 'choice_text_arabic': 'التدخين', 'is_correct': True},
                                {'choice_text': 'Excessive alcohol consumption', 'choice_text_arabic': 'الاستهلاك المفرط للكحول', 'is_correct': True},
                                {'choice_text': 'Poor hygiene', 'choice_text_arabic': 'النظافة السيئة', 'is_correct': True},
                                {'choice_text': 'Drinking water regularly', 'choice_text_arabic': 'شرب الماء بانتظام', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Hand washing is one of the most effective ways to prevent infections.',
                            'question_text_arabic': 'غسل اليدين إحدى أكثر الطرق فعالية لمنع العدوى.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Emerging Immunotherapies and Future Directions',
                    'title_arabic': 'العلاجات المناعية الناشئة والاتجاهات المستقبلية',
                    'description': 'Advanced immune system support and cutting-edge treatments',
                    'description_arabic': 'دعم الجهاز المناعي المتقدم والعلاجات المتطورة',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is CAR-T cell therapy?',
                            'question_text_arabic': 'ما هو علاج الخلايا التائية CAR-T؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Genetically modified T cells designed to target specific cancers', 'choice_text_arabic': 'خلايا تائية معدلة وراثياً مصممة لاستهداف سرطانات محددة', 'is_correct': True},
                                {'choice_text': 'Traditional chemotherapy treatment', 'choice_text_arabic': 'علاج كيميائي تقليدي', 'is_correct': False},
                                {'choice_text': 'Surgical removal of tumors', 'choice_text_arabic': 'الإزالة الجراحية للأورام', 'is_correct': False},
                                {'choice_text': 'Radiation therapy for cancer', 'choice_text_arabic': 'العلاج الإشعاعي للسرطان', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are checkpoint inhibitors?',
                            'question_text_arabic': 'ما هي مثبطات نقاط التفتيش؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Drugs that remove brakes on immune system to fight cancer', 'choice_text_arabic': 'أدوية تزيل الفرامل عن الجهاز المناعي لمحاربة السرطان', 'is_correct': True},
                                {'choice_text': 'Drugs that stop all immune responses', 'choice_text_arabic': 'أدوية توقف جميع الاستجابات المناعية', 'is_correct': False},
                                {'choice_text': 'Vaccines for viral infections', 'choice_text_arabic': 'لقاحات للعدوى الفيروسية', 'is_correct': False},
                                {'choice_text': 'Antibiotics for bacterial infections', 'choice_text_arabic': 'مضادات حيوية للعدوى البكتيرية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is personalized immunotherapy?',
                            'question_text_arabic': 'ما هو العلاج المناعي الشخصي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Treatment tailored to individual patient\'s immune profile', 'choice_text_arabic': 'علاج مصمم خصيصاً للملف المناعي للمريض الفردي', 'is_correct': True},
                                {'choice_text': 'One-size-fits-all treatment approach', 'choice_text_arabic': 'نهج علاجي واحد يناسب الجميع', 'is_correct': False},
                                {'choice_text': 'Treatment based only on disease type', 'choice_text_arabic': 'علاج يعتمد فقط على نوع المرض', 'is_correct': False},
                                {'choice_text': 'Traditional vaccination programs', 'choice_text_arabic': 'برامج التطعيم التقليدية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How might gene therapy help immune disorders?',
                            'question_text_arabic': 'كيف يمكن للعلاج الجيني أن يساعد في اضطرابات المناعة؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Correct genetic defects in immune cells', 'choice_text_arabic': 'تصحيح العيوب الجينية في الخلايا المناعية', 'is_correct': True},
                                {'choice_text': 'Enhance immune cell function', 'choice_text_arabic': 'تعزيز وظيفة الخلايا المناعية', 'is_correct': True},
                                {'choice_text': 'Replace missing immune factors', 'choice_text_arabic': 'استبدال العوامل المناعية المفقودة', 'is_correct': True},
                                {'choice_text': 'Eliminate the need for immune system', 'choice_text_arabic': 'إلغاء الحاجة للجهاز المناعي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the role of artificial intelligence in immunotherapy?',
                            'question_text_arabic': 'ما دور الذكاء الاصطناعي في العلاج المناعي؟',
                            'question_type': 'open_short',
                            'correct_answer': 'Analyzing immune patterns, predicting treatment responses, designing personalized therapies'
                        },
                        {
                            'question_text': 'Immunotherapy represents one of the most promising areas in modern medicine.',
                            'question_text_arabic': 'العلاج المناعي يمثل أحد أكثر المجالات الواعدة في الطب الحديث.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Future vaccines may be developed using mRNA technology for rapid response to new diseases.',
                            'question_text_arabic': 'اللقاحات المستقبلية قد تُطور باستخدام تقنية الرنا المرسال للاستجابة السريعة للأمراض الجديدة.',
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
                    f'Successfully created for Lesson 115 (Aiding the immune system):\\n'
                    f'Exercises: {total_exercises}\\n'
                    f'Questions: {total_questions}\\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 115 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )