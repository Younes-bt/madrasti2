from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Disorders of the immune system - Lesson ID: 114'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=114)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Introduction to Immune Disorders',
                    'title_arabic': 'مقدمة في اضطرابات الجهاز المناعي',
                    'description': 'Overview of immune system dysfunction',
                    'description_arabic': 'نظرة عامة على خلل وظائف الجهاز المناعي',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What are immune disorders?',
                            'question_text_arabic': 'ما هي اضطرابات الجهاز المناعي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Conditions where the immune system functions abnormally', 'choice_text_arabic': 'حالات يعمل فيها الجهاز المناعي بشكل غير طبيعي', 'is_correct': True},
                                {'choice_text': 'Only infections caused by pathogens', 'choice_text_arabic': 'العدوى الناجمة عن مسببات الأمراض فقط', 'is_correct': False},
                                {'choice_text': 'Genetic mutations only', 'choice_text_arabic': 'الطفرات الجينية فقط', 'is_correct': False},
                                {'choice_text': 'Nutritional deficiencies only', 'choice_text_arabic': 'نقص التغذية فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are the main categories of immune disorders?',
                            'question_text_arabic': 'ما هي الفئات الرئيسية لاضطرابات الجهاز المناعي؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Immunodeficiency diseases', 'choice_text_arabic': 'أمراض نقص المناعة', 'is_correct': True},
                                {'choice_text': 'Autoimmune diseases', 'choice_text_arabic': 'أمراض المناعة الذاتية', 'is_correct': True},
                                {'choice_text': 'Hypersensitivity reactions', 'choice_text_arabic': 'تفاعلات فرط الحساسية', 'is_correct': True},
                                {'choice_text': 'Digestive disorders', 'choice_text_arabic': 'اضطرابات الهضم', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which factors can contribute to immune disorders?',
                            'question_text_arabic': 'أي عوامل يمكن أن تساهم في اضطرابات الجهاز المناعي؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Genetic factors', 'choice_text_arabic': 'العوامل الجينية', 'is_correct': True},
                                {'choice_text': 'Environmental triggers', 'choice_text_arabic': 'المحفزات البيئية', 'is_correct': True},
                                {'choice_text': 'Infections', 'choice_text_arabic': 'العدوى', 'is_correct': True},
                                {'choice_text': 'Exercise only', 'choice_text_arabic': 'التمرين فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Immune disorders can affect people of all ages.',
                            'question_text_arabic': 'اضطرابات الجهاز المناعي يمكن أن تؤثر على الأشخاص من جميع الأعمار.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Autoimmune Diseases',
                    'title_arabic': 'أمراض المناعة الذاتية',
                    'description': 'When the immune system attacks the body\'s own tissues',
                    'description_arabic': 'عندما يهاجم الجهاز المناعي أنسجة الجسم نفسه',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What happens in autoimmune diseases?',
                            'question_text_arabic': 'ماذا يحدث في أمراض المناعة الذاتية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Immune system mistakenly attacks healthy body tissues', 'choice_text_arabic': 'الجهاز المناعي يهاجم خطأً أنسجة الجسم الصحية', 'is_correct': True},
                                {'choice_text': 'Immune system becomes completely inactive', 'choice_text_arabic': 'الجهاز المناعي يصبح غير نشط تماماً', 'is_correct': False},
                                {'choice_text': 'Body produces too many antibodies against infections', 'choice_text_arabic': 'الجسم ينتج أجساماً مضادة كثيرة ضد العدوى', 'is_correct': False},
                                {'choice_text': 'Pathogens become resistant to immune responses', 'choice_text_arabic': 'مسببات الأمراض تصبح مقاومة للاستجابات المناعية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which are examples of autoimmune diseases?',
                            'question_text_arabic': 'أي منها أمثلة على أمراض المناعة الذاتية؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Type 1 diabetes', 'choice_text_arabic': 'داء السكري النوع الأول', 'is_correct': True},
                                {'choice_text': 'Rheumatoid arthritis', 'choice_text_arabic': 'التهاب المفاصل الروماتويدي', 'is_correct': True},
                                {'choice_text': 'Multiple sclerosis', 'choice_text_arabic': 'التصلب المتعدد', 'is_correct': True},
                                {'choice_text': 'Common cold', 'choice_text_arabic': 'الزكام العادي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What happens in Type 1 diabetes?',
                            'question_text_arabic': 'ماذا يحدث في داء السكري النوع الأول؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Immune system destroys insulin-producing beta cells', 'choice_text_arabic': 'الجهاز المناعي يدمر خلايا بيتا المنتجة للأنسولين', 'is_correct': True},
                                {'choice_text': 'Body produces too much insulin', 'choice_text_arabic': 'الجسم ينتج أنسولين أكثر من اللازم', 'is_correct': False},
                                {'choice_text': 'Cells become resistant to glucose', 'choice_text_arabic': 'الخلايا تصبح مقاومة للجلوكوز', 'is_correct': False},
                                {'choice_text': 'Kidneys stop filtering blood', 'choice_text_arabic': 'الكلى تتوقف عن ترشيح الدم', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What characterizes rheumatoid arthritis?',
                            'question_text_arabic': 'ما الذي يميز التهاب المفاصل الروماتويدي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Chronic inflammation of joint tissues', 'choice_text_arabic': 'التهاب مزمن في أنسجة المفاصل', 'is_correct': True},
                                {'choice_text': 'Acute bacterial infection of bones', 'choice_text_arabic': 'عدوى بكتيرية حادة في العظام', 'is_correct': False},
                                {'choice_text': 'Vitamin deficiency in cartilage', 'choice_text_arabic': 'نقص فيتامين في الغضروف', 'is_correct': False},
                                {'choice_text': 'Excessive bone formation', 'choice_text_arabic': 'تكوين عظام مفرط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Multiple sclerosis affects the central nervous system by damaging myelin sheaths.',
                            'question_text_arabic': 'التصلب المتعدد يؤثر على الجهاز العصبي المركزي بإتلاف أغماد الميالين.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Autoimmune diseases are more common in women than men.',
                            'question_text_arabic': 'أمراض المناعة الذاتية أكثر شيوعاً في النساء من الرجال.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Immunodeficiency Diseases',
                    'title_arabic': 'أمراض نقص المناعة',
                    'description': 'Conditions where immune function is reduced or absent',
                    'description_arabic': 'حالات تكون فيها الوظيفة المناعية مقلة أو غائبة',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What are immunodeficiency diseases?',
                            'question_text_arabic': 'ما هي أمراض نقص المناعة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Conditions where immune responses are weakened or absent', 'choice_text_arabic': 'حالات تكون فيها الاستجابات المناعية ضعيفة أو غائبة', 'is_correct': True},
                                {'choice_text': 'Overactive immune system responses', 'choice_text_arabic': 'استجابات مفرطة النشاط للجهاز المناعي', 'is_correct': False},
                                {'choice_text': 'Immune system attacking healthy tissues', 'choice_text_arabic': 'الجهاز المناعي يهاجم الأنسجة الصحية', 'is_correct': False},
                                {'choice_text': 'Allergic reactions to harmless substances', 'choice_text_arabic': 'تفاعلات تحسسية للمواد غير الضارة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are the two main types of immunodeficiency?',
                            'question_text_arabic': 'ما النوعان الرئيسيان لنقص المناعة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Primary (congenital) and secondary (acquired)', 'choice_text_arabic': 'أولي (خلقي) وثانوي (مكتسب)', 'is_correct': True},
                                {'choice_text': 'Acute and chronic', 'choice_text_arabic': 'حاد ومزمن', 'is_correct': False},
                                {'choice_text': 'Cellular and humoral', 'choice_text_arabic': 'خلوي وخلطي', 'is_correct': False},
                                {'choice_text': 'Inherited and environmental', 'choice_text_arabic': 'وراثي وبيئي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is SCID (Severe Combined Immunodeficiency)?',
                            'question_text_arabic': 'ما هو نقص المناعة المشترك الحاد؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Genetic disorder affecting both T and B cell function', 'choice_text_arabic': 'اضطراب جيني يؤثر على وظيفة الخلايا التائية والبائية', 'is_correct': True},
                                {'choice_text': 'Viral infection destroying immune cells', 'choice_text_arabic': 'عدوى فيروسية تدمر الخلايا المناعية', 'is_correct': False},
                                {'choice_text': 'Autoimmune attack on bone marrow', 'choice_text_arabic': 'هجوم مناعي ذاتي على نخاع العظم', 'is_correct': False},
                                {'choice_text': 'Bacterial infection of lymph nodes', 'choice_text_arabic': 'عدوى بكتيرية في العقد اللمفاوية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which can cause secondary immunodeficiency?',
                            'question_text_arabic': 'أي منها يمكن أن يسبب نقص المناعة الثانوي؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'HIV infection', 'choice_text_arabic': 'عدوى فيروس نقص المناعة البشرية', 'is_correct': True},
                                {'choice_text': 'Chemotherapy treatment', 'choice_text_arabic': 'علاج العلاج الكيميائي', 'is_correct': True},
                                {'choice_text': 'Malnutrition', 'choice_text_arabic': 'سوء التغذية', 'is_correct': True},
                                {'choice_text': 'Regular exercise', 'choice_text_arabic': 'التمرين المنتظم', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'People with immunodeficiency are more susceptible to infections.',
                            'question_text_arabic': 'الأشخاص المصابون بنقص المناعة أكثر عرضة للعدوى.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Primary immunodeficiencies are usually present from birth.',
                            'question_text_arabic': 'نقص المناعة الأولي عادة ما يكون موجوداً منذ الولادة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Hypersensitivity Reactions and Allergies',
                    'title_arabic': 'تفاعلات فرط الحساسية والحساسية',
                    'description': 'Excessive immune responses to harmless substances',
                    'description_arabic': 'استجابات مناعية مفرطة للمواد غير الضارة',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is a hypersensitivity reaction?',
                            'question_text_arabic': 'ما هو تفاعل فرط الحساسية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Excessive immune response to harmless antigens', 'choice_text_arabic': 'استجابة مناعية مفرطة للمستضدات غير الضارة', 'is_correct': True},
                                {'choice_text': 'Lack of immune response to pathogens', 'choice_text_arabic': 'عدم وجود استجابة مناعية لمسببات الأمراض', 'is_correct': False},
                                {'choice_text': 'Normal immune response to infection', 'choice_text_arabic': 'استجابة مناعية طبيعية للعدوى', 'is_correct': False},
                                {'choice_text': 'Immune tolerance to self-antigens', 'choice_text_arabic': 'التحمل المناعي للمستضدات الذاتية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are the four types of hypersensitivity reactions?',
                            'question_text_arabic': 'ما هي الأنواع الأربعة لتفاعلات فرط الحساسية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Type I (immediate), Type II (cytotoxic), Type III (immune complex), Type IV (delayed)', 'choice_text_arabic': 'النوع الأول (فوري)، النوع الثاني (سام للخلايا)، النوع الثالث (مركب مناعي)، النوع الرابع (متأخر)', 'is_correct': True},
                                {'choice_text': 'Acute, chronic, mild, severe', 'choice_text_arabic': 'حاد، مزمن، خفيف، شديد', 'is_correct': False},
                                {'choice_text': 'Local, systemic, primary, secondary', 'choice_text_arabic': 'موضعي، جهازي، أولي، ثانوي', 'is_correct': False},
                                {'choice_text': 'Inherited, acquired, environmental, dietary', 'choice_text_arabic': 'وراثي، مكتسب، بيئي، غذائي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What mediates Type I hypersensitivity (allergic reactions)?',
                            'question_text_arabic': 'ما الذي يتوسط فرط الحساسية من النوع الأول (التفاعلات التحسسية)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'IgE antibodies and mast cells/basophils', 'choice_text_arabic': 'الأجسام المضادة IgE والخلايا البدينة/القاعدية', 'is_correct': True},
                                {'choice_text': 'IgG antibodies and complement', 'choice_text_arabic': 'الأجسام المضادة IgG والمتممة', 'is_correct': False},
                                {'choice_text': 'T cells and macrophages', 'choice_text_arabic': 'الخلايا التائية والبلاعم الكبيرة', 'is_correct': False},
                                {'choice_text': 'Natural killer cells and interferons', 'choice_text_arabic': 'الخلايا القاتلة الطبيعية والإنترفيرونات', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is anaphylaxis?',
                            'question_text_arabic': 'ما هو الصدمة التأقية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Severe, life-threatening allergic reaction', 'choice_text_arabic': 'تفاعل تحسسي شديد ومهدد للحياة', 'is_correct': True},
                                {'choice_text': 'Mild skin rash', 'choice_text_arabic': 'طفح جلدي خفيف', 'is_correct': False},
                                {'choice_text': 'Chronic inflammation', 'choice_text_arabic': 'التهاب مزمن', 'is_correct': False},
                                {'choice_text': 'Immune tolerance development', 'choice_text_arabic': 'تطوير التحمل المناعي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Common allergens include pollen, food proteins, and insect venom.',
                            'question_text_arabic': 'مسببات الحساسية الشائعة تشمل حبوب اللقاح وبروتينات الطعام وسم الحشرات.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Type IV hypersensitivity involves T cells and occurs within minutes.',
                            'question_text_arabic': 'فرط الحساسية من النوع الرابع يشمل الخلايا التائية ويحدث خلال دقائق.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        }
                    ]
                },
                {
                    'title': 'Cancer and Immune Surveillance',
                    'title_arabic': 'السرطان والمراقبة المناعية',
                    'description': 'How the immune system detects and responds to cancer',
                    'description_arabic': 'كيف يكتشف الجهاز المناعي ويستجيب للسرطان',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is immune surveillance in cancer?',
                            'question_text_arabic': 'ما هي المراقبة المناعية في السرطان؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Immune system\'s ability to detect and eliminate cancer cells', 'choice_text_arabic': 'قدرة الجهاز المناعي على اكتشاف والقضاء على الخلايا السرطانية', 'is_correct': True},
                                {'choice_text': 'Cancer cells monitoring immune responses', 'choice_text_arabic': 'الخلايا السرطانية تراقب الاستجابات المناعية', 'is_correct': False},
                                {'choice_text': 'Regular cancer screening tests', 'choice_text_arabic': 'فحوصات الكشف المنتظمة عن السرطان', 'is_correct': False},
                                {'choice_text': 'Genetic testing for cancer risk', 'choice_text_arabic': 'الفحوصات الجينية لخطر السرطان', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How do cancer cells evade immune surveillance?',
                            'question_text_arabic': 'كيف تتهرب الخلايا السرطانية من المراقبة المناعية؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Reducing MHC Class I expression', 'choice_text_arabic': 'تقليل التعبير عن MHC الصنف الأول', 'is_correct': True},
                                {'choice_text': 'Producing immunosuppressive factors', 'choice_text_arabic': 'إنتاج عوامل مثبطة للمناعة', 'is_correct': True},
                                {'choice_text': 'Mimicking normal cell signals', 'choice_text_arabic': 'محاكاة إشارات الخلايا الطبيعية', 'is_correct': True},
                                {'choice_text': 'Increasing oxygen consumption', 'choice_text_arabic': 'زيادة استهلاك الأكسجين', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are tumor-associated antigens (TAAs)?',
                            'question_text_arabic': 'ما هي المستضدات المرتبطة بالورم؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Abnormal proteins expressed by cancer cells', 'choice_text_arabic': 'بروتينات غير طبيعية تعبر عنها الخلايا السرطانية', 'is_correct': True},
                                {'choice_text': 'Normal proteins found in healthy tissues', 'choice_text_arabic': 'بروتينات طبيعية موجودة في الأنسجة الصحية', 'is_correct': False},
                                {'choice_text': 'Viral proteins in infected cells', 'choice_text_arabic': 'بروتينات فيروسية في الخلايا المصابة', 'is_correct': False},
                                {'choice_text': 'Bacterial toxins in tumors', 'choice_text_arabic': 'سموم بكتيرية في الأورام', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which immune cells are important in anti-tumor responses?',
                            'question_text_arabic': 'أي خلايا مناعية مهمة في الاستجابات المضادة للورم؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Cytotoxic T lymphocytes (CTLs)', 'choice_text_arabic': 'الخلايا اللمفاوية التائية السامة', 'is_correct': True},
                                {'choice_text': 'Natural killer (NK) cells', 'choice_text_arabic': 'الخلايا القاتلة الطبيعية', 'is_correct': True},
                                {'choice_text': 'Macrophages', 'choice_text_arabic': 'البلاعم الكبيرة', 'is_correct': True},
                                {'choice_text': 'Red blood cells', 'choice_text_arabic': 'خلايا الدم الحمراء', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is immunotherapy in cancer treatment?',
                            'question_text_arabic': 'ما هو العلاج المناعي في علاج السرطان؟',
                            'question_type': 'open_short',
                            'correct_answer': 'Treatment that harnesses the immune system to fight cancer'
                        },
                        {
                            'question_text': 'Cancer immunotherapy includes checkpoint inhibitors and CAR-T cell therapy.',
                            'question_text_arabic': 'العلاج المناعي للسرطان يشمل مثبطات نقاط التفتيش وعلاج الخلايا التائية CAR.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Some cancers are caused by oncogenic viruses that trigger immune responses.',
                            'question_text_arabic': 'بعض أنواع السرطان ناجمة عن فيروسات مسرطنة تؤدي إلى استجابات مناعية.',
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
                    f'Successfully created for Lesson 114 (Disorders of the immune system):\\n'
                    f'Exercises: {total_exercises}\\n'
                    f'Questions: {total_questions}\\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 114 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )