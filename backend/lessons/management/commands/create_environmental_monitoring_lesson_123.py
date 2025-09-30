from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Lesson 123: Monitoring the quality and health of natural environments (Physical Sciences Track)'

    def handle(self, *args, **options):
        with transaction.atomic():
            try:
                lesson = Lesson.objects.get(id=123)
                self.stdout.write(f"Creating exercises for: {lesson.title}")

                # Clear existing exercises for this lesson
                Exercise.objects.filter(lesson=lesson).delete()

                exercises_data = [
                    {
                        'title': 'Environmental Indicators and Monitoring Parameters',
                        'title_arabic': 'المؤشرات البيئية ومعايير المراقبة',
                        'difficulty': 'beginner',
                        'points': 10,
                        'questions': [
                            {
                                'question_text': 'What are environmental indicators?',
                                'question_text_arabic': 'ما هي المؤشرات البيئية؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Random measurements in nature', 'قياسات عشوائية في الطبيعة', False),
                                    ('Measurable parameters that reflect environmental condition', 'معايير قابلة للقياس تعكس الحالة البيئية', True),
                                    ('Weather forecasting tools', 'أدوات توقع الطقس', False),
                                    ('Industrial production metrics', 'مقاييس الإنتاج الصناعي', False)
                                ]
                            },
                            {
                                'question_text': 'Which parameters are commonly monitored in water quality assessment?',
                                'question_text_arabic': 'ما هي المعايير التي تُراقب عادة في تقييم جودة المياه؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('pH level', 'مستوى الحموضة', True),
                                    ('Dissolved oxygen', 'الأكسجين المذاب', True),
                                    ('Temperature', 'درجة الحرارة', True),
                                    ('Heavy metals concentration', 'تركيز المعادن الثقيلة', True),
                                    ('Color preference', 'تفضيل اللون', False)
                                ]
                            },
                            {
                                'question_text': 'What does BOD stand for in water quality monitoring?',
                                'question_text_arabic': 'ماذا يعني BOD في مراقبة جودة المياه؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Basic Oxygen Demand', 'الطلب الأساسي للأكسجين', False),
                                    ('Biochemical Oxygen Demand', 'الطلب البيوكيميائي للأكسجين', True),
                                    ('Biological Oxygen Deficit', 'العجز البيولوجي للأكسجين', False),
                                    ('Biodegradable Organic Decomposition', 'التحلل العضوي القابل للتحلل البيولوجي', False)
                                ]
                            },
                            {
                                'question_text': 'Biodiversity indices are useful indicators of ecosystem health.',
                                'question_text_arabic': 'مؤشرات التنوع البيولوجي هي مؤشرات مفيدة لصحة النظام البيئي.',
                                'question_type': 'true_false',
                                'choices': [
                                    ('True', 'صحيح', True),
                                    ('False', 'خطأ', False)
                                ]
                            },
                            {
                                'question_text': 'List three physical parameters used in air quality monitoring.',
                                'question_text_arabic': 'اذكر ثلاثة معايير فيزيائية مستخدمة في مراقبة جودة الهواء.',
                                'question_type': 'open_short',
                                'choices': []
                            }
                        ]
                    },
                    {
                        'title': 'Environmental Monitoring Technologies and Methods',
                        'title_arabic': 'تقنيات وطرق المراقبة البيئية',
                        'difficulty': 'intermediate',
                        'points': 15,
                        'questions': [
                            {
                                'question_text': 'What are the main categories of environmental monitoring methods?',
                                'question_text_arabic': 'ما هي الفئات الرئيسية لطرق المراقبة البيئية؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Physical monitoring', 'المراقبة الفيزيائية', True),
                                    ('Chemical monitoring', 'المراقبة الكيميائية', True),
                                    ('Biological monitoring', 'المراقبة البيولوجية', True),
                                    ('Remote sensing', 'الاستشعار عن بعد', True),
                                    ('Financial monitoring', 'المراقبة المالية', False)
                                ]
                            },
                            {
                                'question_text': 'Which technology is used for large-scale environmental monitoring from space?',
                                'question_text_arabic': 'أي تقنية تُستخدم للمراقبة البيئية واسعة النطاق من الفضاء؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Ground-based sensors', 'أجهزة الاستشعار الأرضية', False),
                                    ('Satellite remote sensing', 'الاستشعار عن بعد بالأقمار الصناعية', True),
                                    ('Manual field surveys', 'المسوحات الميدانية اليدوية', False),
                                    ('Laboratory analysis only', 'التحليل المخبري فقط', False)
                                ]
                            },
                            {
                                'question_text': 'What are bioindicators in environmental monitoring?',
                                'question_text_arabic': 'ما هي المؤشرات الحيوية في المراقبة البيئية؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Chemical substances that indicate pollution', 'مواد كيميائية تشير إلى التلوث', False),
                                    ('Living organisms that indicate environmental conditions', 'كائنات حية تشير إلى الظروف البيئية', True),
                                    ('Physical instruments for measurement', 'أدوات فيزيائية للقياس', False),
                                    ('Statistical models for prediction', 'نماذج إحصائية للتنبؤ', False)
                                ]
                            },
                            {
                                'question_text': 'Real-time monitoring systems provide continuous data collection.',
                                'question_text_arabic': 'توفر أنظمة المراقبة في الوقت الفعلي جمع البيانات المستمر.',
                                'question_type': 'true_false',
                                'choices': [
                                    ('True', 'صحيح', True),
                                    ('False', 'خطأ', False)
                                ]
                            },
                            {
                                'question_text': 'Explain the advantages of using lichen as bioindicators for air quality.',
                                'question_text_arabic': 'اشرح مزايا استخدام الأشنات كمؤشرات حيوية لجودة الهواء.',
                                'question_type': 'open_short',
                                'choices': []
                            }
                        ]
                    },
                    {
                        'title': 'Data Collection, Analysis, and Interpretation',
                        'title_arabic': 'جمع البيانات والتحليل والتفسير',
                        'difficulty': 'intermediate',
                        'points': 15,
                        'questions': [
                            {
                                'question_text': 'What factors should be considered when designing an environmental monitoring program?',
                                'question_text_arabic': 'ما هي العوامل التي يجب مراعاتها عند تصميم برنامج للمراقبة البيئية؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Monitoring objectives', 'أهداف المراقبة', True),
                                    ('Sampling frequency', 'تكرار أخذ العينات', True),
                                    ('Spatial coverage', 'التغطية المكانية', True),
                                    ('Quality assurance/control', 'ضمان الجودة/التحكم', True),
                                    ('Personal preferences', 'التفضيلات الشخصية', False)
                                ]
                            },
                            {
                                'question_text': 'What is the purpose of quality assurance in environmental monitoring?',
                                'question_text_arabic': 'ما هو الغرض من ضمان الجودة في المراقبة البيئية؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('To increase monitoring costs', 'لزيادة تكاليف المراقبة', False),
                                    ('To ensure data accuracy and reliability', 'لضمان دقة وموثوقية البيانات', True),
                                    ('To reduce monitoring frequency', 'لتقليل تكرار المراقبة', False),
                                    ('To simplify data collection', 'لتبسيط جمع البيانات', False)
                                ]
                            },
                            {
                                'question_text': 'Which statistical methods are commonly used in environmental data analysis?',
                                'question_text_arabic': 'ما هي الطرق الإحصائية المستخدمة عادة في تحليل البيانات البيئية؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Trend analysis', 'تحليل الاتجاه', True),
                                    ('Correlation analysis', 'تحليل الارتباط', True),
                                    ('Regression analysis', 'تحليل الانحدار', True),
                                    ('Time series analysis', 'تحليل السلاسل الزمنية', True),
                                    ('Random guessing', 'التخمين العشوائي', False)
                                ]
                            },
                            {
                                'question_text': 'Environmental monitoring data should be made publicly available for transparency.',
                                'question_text_arabic': 'يجب أن تكون بيانات المراقبة البيئية متاحة للعامة من أجل الشفافية.',
                                'question_type': 'true_false',
                                'choices': [
                                    ('True', 'صحيح', True),
                                    ('False', 'خطأ', False)
                                ]
                            },
                            {
                                'question_text': 'Describe the importance of baseline data in environmental monitoring programs.',
                                'question_text_arabic': 'اصف أهمية البيانات الأساسية في برامج المراقبة البيئية.',
                                'question_type': 'open_short',
                                'choices': []
                            }
                        ]
                    },
                    {
                        'title': 'Environmental Health Assessment and Risk Evaluation',
                        'title_arabic': 'تقييم الصحة البيئية وتقييم المخاطر',
                        'difficulty': 'advanced',
                        'points': 20,
                        'questions': [
                            {
                                'question_text': 'What are the main steps in environmental risk assessment?',
                                'question_text_arabic': 'ما هي الخطوات الرئيسية في تقييم المخاطر البيئية؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Hazard identification', 'تحديد الخطر', True),
                                    ('Exposure assessment', 'تقييم التعرض', True),
                                    ('Dose-response assessment', 'تقييم الجرعة-الاستجابة', True),
                                    ('Risk characterization', 'توصيف المخاطر', True),
                                    ('Risk ignoring', 'تجاهل المخاطر', False)
                                ]
                            },
                            {
                                'question_text': 'What is the concept of "acceptable risk" in environmental health?',
                                'question_text_arabic': 'ما هو مفهوم "المخاطر المقبولة" في الصحة البيئية؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Zero risk only', 'المخاطر الصفر فقط', False),
                                    ('Risk level that society is willing to accept', 'مستوى المخاطر التي يرضى المجتمع بقبولها', True),
                                    ('Maximum possible risk', 'أقصى مخاطر ممكنة', False),
                                    ('Risk that cannot be measured', 'المخاطر التي لا يمكن قياسها', False)
                                ]
                            },
                            {
                                'question_text': 'Which factors influence environmental health outcomes?',
                                'question_text_arabic': 'ما هي العوامل التي تؤثر على النتائج الصحية البيئية؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Air quality', 'جودة الهواء', True),
                                    ('Water quality', 'جودة المياه', True),
                                    ('Soil contamination', 'تلوث التربة', True),
                                    ('Noise pollution', 'التلوث الضوضائي', True),
                                    ('Fashion trends', 'اتجاهات الموضة', False)
                                ]
                            },
                            {
                                'question_text': 'Vulnerable populations may have higher susceptibility to environmental hazards.',
                                'question_text_arabic': 'قد يكون لدى الفئات الضعيفة قابلية أعلى للتأثر بالمخاطر البيئية.',
                                'question_type': 'true_false',
                                'choices': [
                                    ('True', 'صحيح', True),
                                    ('False', 'خطأ', False)
                                ]
                            },
                            {
                                'question_text': 'Evaluate the relationship between environmental monitoring and public health protection.',
                                'question_text_arabic': 'قيم العلاقة بين المراقبة البيئية وحماية الصحة العامة.',
                                'question_type': 'open_short',
                                'choices': []
                            }
                        ]
                    },
                    {
                        'title': 'Integrated Environmental Management and Policy',
                        'title_arabic': 'الإدارة البيئية المتكاملة والسياسات',
                        'difficulty': 'advanced',
                        'points': 20,
                        'questions': [
                            {
                                'question_text': 'What is the ecosystem approach to environmental management?',
                                'question_text_arabic': 'ما هو نهج النظام البيئي في الإدارة البيئية؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Managing single species only', 'إدارة نوع واحد فقط', False),
                                    ('Holistic management considering all ecosystem components', 'الإدارة الشمولية التي تعتبر جميع مكونات النظام البيئي', True),
                                    ('Focus on economic benefits only', 'التركيز على الفوائد الاقتصادية فقط', False),
                                    ('Short-term management solutions', 'حلول إدارة قصيرة الأمد', False)
                                ]
                            },
                            {
                                'question_text': 'Which international frameworks guide environmental monitoring and protection?',
                                'question_text_arabic': 'ما هي الأطر الدولية التي توجه المراقبة والحماية البيئية؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Convention on Biological Diversity', 'اتفاقية التنوع البيولوجي', True),
                                    ('Paris Climate Agreement', 'اتفاقية باريس للمناخ', True),
                                    ('Stockholm Convention on POPs', 'اتفاقية ستوكهولم للملوثات العضوية الثابتة', True),
                                    ('Montreal Protocol on Ozone', 'بروتوكول مونتريال للأوزون', True),
                                    ('International Trade Agreement', 'اتفاقية التجارة الدولية', False)
                                ]
                            },
                            {
                                'question_text': 'What is adaptive management in environmental contexts?',
                                'question_text_arabic': 'ما هي الإدارة التكيفية في السياقات البيئية؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Fixed management strategies', 'استراتيجيات إدارة ثابتة', False),
                                    ('Management that learns and adjusts based on monitoring results', 'الإدارة التي تتعلم وتتكيف بناءً على نتائج المراقبة', True),
                                    ('Management by single authorities', 'الإدارة من قبل سلطات واحدة', False),
                                    ('Crisis-reactive management only', 'الإدارة المتفاعلة مع الأزمات فقط', False)
                                ]
                            },
                            {
                                'question_text': 'Citizen science can contribute valuable data to environmental monitoring programs.',
                                'question_text_arabic': 'يمكن لعلوم المواطن أن تساهم ببيانات قيمة لبرامج المراقبة البيئية.',
                                'question_type': 'true_false',
                                'choices': [
                                    ('True', 'صحيح', True),
                                    ('False', 'خطأ', False)
                                ]
                            },
                            {
                                'question_text': 'Discuss the challenges of implementing effective environmental monitoring in developing countries.',
                                'question_text_arabic': 'ناقش تحديات تنفيذ المراقبة البيئية الفعالة في البلدان النامية.',
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
                    self.style.ERROR('Lesson with ID 123 does not exist')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error creating exercises: {str(e)}')
                )