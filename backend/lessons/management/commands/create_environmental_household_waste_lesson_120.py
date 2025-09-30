from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Lesson 120: Household waste from the use of organic materials (Physical Sciences Track)'

    def handle(self, *args, **options):
        with transaction.atomic():
            try:
                lesson = Lesson.objects.get(id=120)
                self.stdout.write(f"Creating exercises for: {lesson.title}")

                # Clear existing exercises for this lesson
                Exercise.objects.filter(lesson=lesson).delete()

                exercises_data = [
                    {
                        'title': 'Types and Classification of Household Waste',
                        'title_arabic': 'أنواع وتصنيف النفايات المنزلية',
                        'difficulty': 'beginner',
                        'points': 10,
                        'questions': [
                            {
                                'question_text': 'What are the main categories of household waste?',
                                'question_text_arabic': 'ما هي الفئات الرئيسية للنفايات المنزلية؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Organic waste', 'النفايات العضوية', True),
                                    ('Plastic waste', 'النفايات البلاستيكية', True),
                                    ('Paper waste', 'نفايات الورق', True),
                                    ('Hazardous waste', 'النفايات الخطرة', True),
                                    ('Nuclear waste', 'النفايات النووية', False)
                                ]
                            },
                            {
                                'question_text': 'Which materials are considered biodegradable organic waste?',
                                'question_text_arabic': 'ما هي المواد التي تعتبر نفايات عضوية قابلة للتحلل البيولوجي؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Plastic bottles', 'الزجاجات البلاستيكية', False),
                                    ('Food scraps and garden waste', 'بقايا الطعام ونفايات الحديقة', True),
                                    ('Metal cans', 'العلب المعدنية', False),
                                    ('Glass containers', 'الحاويات الزجاجية', False)
                                ]
                            },
                            {
                                'question_text': 'What percentage of household waste typically consists of organic materials?',
                                'question_text_arabic': 'ما هي النسبة المئوية للنفايات المنزلية التي تتكون عادة من المواد العضوية؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('10-20%', '10-20%', False),
                                    ('30-40%', '30-40%', True),
                                    ('60-70%', '60-70%', False),
                                    ('80-90%', '80-90%', False)
                                ]
                            },
                            {
                                'question_text': 'Hazardous household waste requires special disposal methods.',
                                'question_text_arabic': 'تتطلب النفايات المنزلية الخطرة طرق تخلص خاصة.',
                                'question_type': 'true_false',
                                'choices': [
                                    ('True', 'صحيح', True),
                                    ('False', 'خطأ', False)
                                ]
                            },
                            {
                                'question_text': 'Name two examples of hazardous household waste.',
                                'question_text_arabic': 'اذكر مثالين على النفايات المنزلية الخطرة.',
                                'question_type': 'open_short',
                                'choices': []
                            }
                        ]
                    },
                    {
                        'title': 'Environmental Impact of Organic Waste',
                        'title_arabic': 'التأثير البيئي للنفايات العضوية',
                        'difficulty': 'intermediate',
                        'points': 15,
                        'questions': [
                            {
                                'question_text': 'What gas is primarily produced when organic waste decomposes in landfills?',
                                'question_text_arabic': 'ما هو الغاز الذي ينتج بشكل أساسي عند تحلل النفايات العضوية في مدافن النفايات؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Carbon dioxide (CO2)', 'ثاني أكسيد الكربون', False),
                                    ('Methane (CH4)', 'الميثان', True),
                                    ('Oxygen (O2)', 'الأكسجين', False),
                                    ('Nitrogen (N2)', 'النيتروجين', False)
                                ]
                            },
                            {
                                'question_text': 'Which environmental problems are caused by improper organic waste disposal?',
                                'question_text_arabic': 'ما هي المشاكل البيئية الناجمة عن التخلص غير السليم من النفايات العضوية؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Soil contamination', 'تلوث التربة', True),
                                    ('Water pollution', 'تلوث المياه', True),
                                    ('Air pollution', 'تلوث الهواء', True),
                                    ('Greenhouse gas emissions', 'انبعاثات غازات الدفيئة', True),
                                    ('Solar radiation increase', 'زيادة الإشعاع الشمسي', False)
                                ]
                            },
                            {
                                'question_text': 'How does leachate from organic waste affect groundwater?',
                                'question_text_arabic': 'كيف تؤثر الرشاحة من النفايات العضوية على المياه الجوفية؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('It purifies the groundwater', 'تنقي المياه الجوفية', False),
                                    ('It has no effect on groundwater', 'ليس لها تأثير على المياه الجوفية', False),
                                    ('It contaminates groundwater with harmful substances', 'تلوث المياه الجوفية بالمواد الضارة', True),
                                    ('It increases groundwater temperature', 'تزيد من درجة حرارة المياه الجوفية', False)
                                ]
                            },
                            {
                                'question_text': 'Composting organic waste reduces methane emissions compared to landfilling.',
                                'question_text_arabic': 'يقلل تحويل النفايات العضوية إلى سماد من انبعاثات الميثان مقارنة بدفنها.',
                                'question_type': 'true_false',
                                'choices': [
                                    ('True', 'صحيح', True),
                                    ('False', 'خطأ', False)
                                ]
                            },
                            {
                                'question_text': 'Explain how organic waste contributes to climate change.',
                                'question_text_arabic': 'اشرح كيف تساهم النفايات العضوية في تغير المناخ.',
                                'question_type': 'open_short',
                                'choices': []
                            }
                        ]
                    },
                    {
                        'title': 'Waste Management Strategies and Solutions',
                        'title_arabic': 'استراتيجيات وحلول إدارة النفايات',
                        'difficulty': 'intermediate',
                        'points': 15,
                        'questions': [
                            {
                                'question_text': 'What is the waste management hierarchy principle?',
                                'question_text_arabic': 'ما هو مبدأ هرمية إدارة النفايات؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Dispose, Reduce, Reuse, Recycle', 'تخلص، قلل، أعد استخدام، أعد تدوير', False),
                                    ('Reduce, Reuse, Recycle, Dispose', 'قلل، أعد استخدام، أعد تدوير، تخلص', True),
                                    ('Recycle, Reuse, Reduce, Dispose', 'أعد تدوير، أعد استخدام، قلل، تخلص', False),
                                    ('Reuse, Recycle, Reduce, Dispose', 'أعد استخدام، أعد تدوير، قلل، تخلص', False)
                                ]
                            },
                            {
                                'question_text': 'Which methods can be used to treat organic household waste?',
                                'question_text_arabic': 'ما هي الطرق التي يمكن استخدامها لمعالجة النفايات المنزلية العضوية؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Composting', 'التسميد', True),
                                    ('Anaerobic digestion', 'الهضم اللاهوائي', True),
                                    ('Incineration with energy recovery', 'الحرق مع استرداد الطاقة', True),
                                    ('Vermicomposting', 'التسميد بالديدان', True),
                                    ('Nuclear fusion', 'الاندماج النووي', False)
                                ]
                            },
                            {
                                'question_text': 'What are the benefits of composting organic waste?',
                                'question_text_arabic': 'ما هي فوائد تحويل النفايات العضوية إلى سماد؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Reduces landfill volume', 'يقلل من حجم مكبات النفايات', True),
                                    ('Produces nutrient-rich soil amendment', 'ينتج محسن تربة غني بالمغذيات', True),
                                    ('Reduces greenhouse gas emissions', 'يقلل من انبعاثات غازات الدفيئة', True),
                                    ('Saves disposal costs', 'يوفر تكاليف التخلص', True),
                                    ('Increases water consumption', 'يزيد من استهلاك المياه', False)
                                ]
                            },
                            {
                                'question_text': 'Source separation of waste improves recycling efficiency.',
                                'question_text_arabic': 'فصل النفايات من المصدر يحسن من كفاءة إعادة التدوير.',
                                'question_type': 'true_false',
                                'choices': [
                                    ('True', 'صحيح', True),
                                    ('False', 'خطأ', False)
                                ]
                            },
                            {
                                'question_text': 'Describe the process of anaerobic digestion for organic waste treatment.',
                                'question_text_arabic': 'اصف عملية الهضم اللاهوائي لمعالجة النفايات العضوية.',
                                'question_type': 'open_short',
                                'choices': []
                            }
                        ]
                    },
                    {
                        'title': 'Circular Economy and Waste Prevention',
                        'title_arabic': 'الاقتصاد الدائري ومنع النفايات',
                        'difficulty': 'advanced',
                        'points': 20,
                        'questions': [
                            {
                                'question_text': 'What is the main principle of circular economy in waste management?',
                                'question_text_arabic': 'ما هو المبدأ الأساسي للاقتصاد الدائري في إدارة النفايات؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Linear production and disposal', 'الإنتاج والتخلص الخطي', False),
                                    ('Keeping materials in use for as long as possible', 'الحفاظ على المواد قيد الاستخدام لأطول فترة ممكنة', True),
                                    ('Increasing waste generation', 'زيادة توليد النفايات', False),
                                    ('Promoting single-use products', 'تشجيع المنتجات أحادية الاستخدام', False)
                                ]
                            },
                            {
                                'question_text': 'Which strategies support waste prevention at the household level?',
                                'question_text_arabic': 'ما هي الاستراتيجيات التي تدعم منع النفايات على مستوى الأسرة؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Meal planning to reduce food waste', 'تخطيط الوجبات لتقليل نفايات الطعام', True),
                                    ('Buying products with minimal packaging', 'شراء المنتجات ذات التغليف الأدنى', True),
                                    ('Repairing items instead of discarding', 'إصلاح العناصر بدلاً من التخلص منها', True),
                                    ('Choosing durable products', 'اختيار المنتجات المتينة', True),
                                    ('Increasing consumption rates', 'زيادة معدلات الاستهلاك', False)
                                ]
                            },
                            {
                                'question_text': 'How does extended producer responsibility (EPR) help reduce waste?',
                                'question_text_arabic': 'كيف تساعد المسؤولية الموسعة للمنتج في تقليل النفايات؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('It shifts responsibility to consumers only', 'تنقل المسؤولية إلى المستهلكين فقط', False),
                                    ('It makes producers responsible for entire product lifecycle', 'تجعل المنتجين مسؤولين عن دورة حياة المنتج بأكملها', True),
                                    ('It eliminates the need for recycling', 'تلغي الحاجة لإعادة التدوير', False),
                                    ('It increases production costs only', 'تزيد من تكاليف الإنتاج فقط', False)
                                ]
                            },
                            {
                                'question_text': 'Digital technologies can help optimize waste collection and management.',
                                'question_text_arabic': 'يمكن للتقنيات الرقمية أن تساعد في تحسين جمع النفايات وإدارتها.',
                                'question_type': 'true_false',
                                'choices': [
                                    ('True', 'صحيح', True),
                                    ('False', 'خطأ', False)
                                ]
                            },
                            {
                                'question_text': 'Analyze the role of consumer behavior in household waste generation.',
                                'question_text_arabic': 'حلل دور سلوك المستهلك في توليد النفايات المنزلية.',
                                'question_type': 'open_short',
                                'choices': []
                            }
                        ]
                    },
                    {
                        'title': 'Case Studies and Real-world Applications',
                        'title_arabic': 'دراسات حالة وتطبيقات في العالم الحقيقي',
                        'difficulty': 'advanced',
                        'points': 20,
                        'questions': [
                            {
                                'question_text': 'Which country is considered a leader in household waste management and recycling?',
                                'question_text_arabic': 'أي دولة تعتبر رائدة في إدارة النفايات المنزلية وإعادة التدوير؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Germany', 'ألمانيا', True),
                                    ('United States', 'الولايات المتحدة', False),
                                    ('China', 'الصين', False),
                                    ('Brazil', 'البرازيل', False)
                                ]
                            },
                            {
                                'question_text': 'What are the key components of successful waste management programs?',
                                'question_text_arabic': 'ما هي المكونات الأساسية لبرامج إدارة النفايات الناجحة؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Public education and awareness', 'التعليم والوعي العام', True),
                                    ('Adequate infrastructure', 'البنية التحتية المناسبة', True),
                                    ('Government policies and regulations', 'السياسات واللوائح الحكومية', True),
                                    ('Economic incentives', 'الحوافز الاقتصادية', True),
                                    ('Ignoring community participation', 'تجاهل مشاركة المجتمع', False)
                                ]
                            },
                            {
                                'question_text': 'How do pay-as-you-throw (PAYT) systems work in waste management?',
                                'question_text_arabic': 'كيف تعمل أنظمة الدفع حسب الكمية في إدارة النفايات؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Fixed fee regardless of waste amount', 'رسم ثابت بغض النظر عن كمية النفايات', False),
                                    ('Charging based on volume or weight of waste generated', 'الشحن حسب حجم أو وزن النفايات المنتجة', True),
                                    ('Free waste collection service', 'خدمة جمع النفايات المجانية', False),
                                    ('Charging only for recycling services', 'الشحن فقط لخدمات إعادة التدوير', False)
                                ]
                            },
                            {
                                'question_text': 'Smart waste bins can monitor fill levels and optimize collection routes.',
                                'question_text_arabic': 'يمكن لصناديق النفايات الذكية مراقبة مستويات الامتلاء وتحسين مسارات الجمع.',
                                'question_type': 'true_false',
                                'choices': [
                                    ('True', 'صحيح', True),
                                    ('False', 'خطأ', False)
                                ]
                            },
                            {
                                'question_text': 'Compare the effectiveness of different household waste treatment methods.',
                                'question_text_arabic': 'قارن بين فعالية طرق معالجة النفايات المنزلية المختلفة.',
                                'question_type': 'open_short',
                                'choices': []
                            }
                        ]
                    }
                ]

                # Create exercises
                for i, exercise_data in enumerate(exercises_data, 1):
                    exercise = Exercise.objects.create(
                        lesson=lesson,
                        title=exercise_data['title'],
                        title_arabic=exercise_data['title_arabic'],
                        difficulty_level=exercise_data['difficulty'],
                        order=i,
                        created_by_id=1  # Assuming admin user with ID 1
                    )

                    # Create reward for the exercise
                    ExerciseReward.objects.create(
                        exercise=exercise,
                        completion_points=exercise_data['points'],
                        completion_coins=1
                    )

                    # Create questions
                    for j, question_data in enumerate(exercise_data['questions'], 1):
                        question = Question.objects.create(
                            exercise=exercise,
                            question_text=question_data['question_text'],
                            question_text_arabic=question_data['question_text_arabic'],
                            question_type=question_data['question_type'],
                            order=j
                        )

                        # Create choices for the question
                        for k, (choice_text, choice_text_arabic, is_correct) in enumerate(question_data['choices'], 1):
                            QuestionChoice.objects.create(
                                question=question,
                                choice_text=choice_text,
                                choice_text_arabic=choice_text_arabic,
                                is_correct=is_correct,
                                order=k
                            )

                self.stdout.write(
                    self.style.SUCCESS(
                        f'Successfully created {len(exercises_data)} exercises for lesson: {lesson.title}'
                    )
                )

            except Lesson.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR('Lesson with ID 120 does not exist')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error creating exercises: {str(e)}')
                )