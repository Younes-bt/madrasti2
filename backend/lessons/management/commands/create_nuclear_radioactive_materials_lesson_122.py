from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Lesson 122: Radioactive materials and nuclear energy (Physical Sciences Track)'

    def handle(self, *args, **options):
        with transaction.atomic():
            try:
                lesson = Lesson.objects.get(id=122)
                self.stdout.write(f"Creating exercises for: {lesson.title}")

                # Clear existing exercises for this lesson
                Exercise.objects.filter(lesson=lesson).delete()

                exercises_data = [
                    {
                        'title': 'Radioactivity Fundamentals and Nuclear Physics',
                        'title_arabic': 'أساسيات الإشعاع والفيزياء النووية',
                        'difficulty': 'beginner',
                        'points': 10,
                        'questions': [
                            {
                                'question_text': 'What are the three main types of radioactive decay?',
                                'question_text_arabic': 'ما هي الأنواع الثلاثة الرئيسية للتحلل الإشعاعي؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Alpha decay (α)', 'تحلل ألفا', True),
                                    ('Beta decay (β)', 'تحلل بيتا', True),
                                    ('Gamma decay (γ)', 'تحلل جاما', True),
                                    ('Delta decay (δ)', 'تحلل دلتا', False),
                                    ('Epsilon decay (ε)', 'تحلل إبسيلون', False)
                                ]
                            },
                            {
                                'question_text': 'What is the unit used to measure radioactive activity?',
                                'question_text_arabic': 'ما هي الوحدة المستخدمة لقياس النشاط الإشعاعي؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Joule (J)', 'جول', False),
                                    ('Becquerel (Bq)', 'بيكيريل', True),
                                    ('Newton (N)', 'نيوتن', False),
                                    ('Watt (W)', 'واط', False)
                                ]
                            },
                            {
                                'question_text': 'What is the half-life of a radioactive isotope?',
                                'question_text_arabic': 'ما هو عمر النصف للنظير المشع؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Time for complete decay', 'الوقت للتحلل الكامل', False),
                                    ('Time for half of nuclei to decay', 'الوقت لتحلل نصف النوى', True),
                                    ('Time for one nucleus to decay', 'الوقت لتحلل نواة واحدة', False),
                                    ('Time for radiation to stop', 'الوقت لتوقف الإشعاع', False)
                                ]
                            },
                            {
                                'question_text': 'Natural radioactivity exists in the environment.',
                                'question_text_arabic': 'الإشعاع الطبيعي موجود في البيئة.',
                                'question_type': 'true_false',
                                'choices': [
                                    ('True', 'صحيح', True),
                                    ('False', 'خطأ', False)
                                ]
                            },
                            {
                                'question_text': 'Name two naturally occurring radioactive elements.',
                                'question_text_arabic': 'اذكر عنصرين مشعين طبيعيين.',
                                'question_type': 'open_short',
                                'choices': []
                            }
                        ]
                    },
                    {
                        'title': 'Nuclear Energy Production and Nuclear Power Plants',
                        'title_arabic': 'إنتاج الطاقة النووية ومحطات الطاقة النووية',
                        'difficulty': 'intermediate',
                        'points': 15,
                        'questions': [
                            {
                                'question_text': 'What nuclear process is used in nuclear power plants for electricity generation?',
                                'question_text_arabic': 'ما هي العملية النووية المستخدمة في محطات الطاقة النووية لتوليد الكهرباء؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Nuclear fusion', 'الاندماج النووي', False),
                                    ('Nuclear fission', 'الانشطار النووي', True),
                                    ('Radioactive decay', 'التحلل الإشعاعي', False),
                                    ('Nuclear transmutation', 'التحويل النووي', False)
                                ]
                            },
                            {
                                'question_text': 'Which isotope is commonly used as fuel in nuclear reactors?',
                                'question_text_arabic': 'أي نظير يُستخدم عادة كوقود في المفاعلات النووية؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Uranium-238', 'يورانيوم-238', False),
                                    ('Uranium-235', 'يورانيوم-235', True),
                                    ('Carbon-14', 'كربون-14', False),
                                    ('Hydrogen-3', 'هيدروجين-3', False)
                                ]
                            },
                            {
                                'question_text': 'What are the main components of a nuclear power plant?',
                                'question_text_arabic': 'ما هي المكونات الرئيسية لمحطة الطاقة النووية؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Reactor core', 'قلب المفاعل', True),
                                    ('Control rods', 'قضبان التحكم', True),
                                    ('Steam generator', 'مولد البخار', True),
                                    ('Cooling system', 'نظام التبريد', True),
                                    ('Solar panels', 'الألواح الشمسية', False)
                                ]
                            },
                            {
                                'question_text': 'Nuclear power plants produce greenhouse gases during electricity generation.',
                                'question_text_arabic': 'تنتج محطات الطاقة النووية غازات الدفيئة أثناء توليد الكهرباء.',
                                'question_type': 'true_false',
                                'choices': [
                                    ('True', 'صحيح', False),
                                    ('False', 'خطأ', True)
                                ]
                            },
                            {
                                'question_text': 'Explain the difference between nuclear fission and nuclear fusion.',
                                'question_text_arabic': 'اشرح الفرق بين الانشطار النووي والاندماج النووي.',
                                'question_type': 'open_short',
                                'choices': []
                            }
                        ]
                    },
                    {
                        'title': 'Radioactive Waste Management and Environmental Impact',
                        'title_arabic': 'إدارة النفايات المشعة والتأثير البيئي',
                        'difficulty': 'intermediate',
                        'points': 15,
                        'questions': [
                            {
                                'question_text': 'How are radioactive wastes classified?',
                                'question_text_arabic': 'كيف تُصنف النفايات المشعة؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Low-level waste (LLW)', 'نفايات منخفضة المستوى', True),
                                    ('Intermediate-level waste (ILW)', 'نفايات متوسطة المستوى', True),
                                    ('High-level waste (HLW)', 'نفايات عالية المستوى', True),
                                    ('Very high-level waste (VHLW)', 'نفايات عالية جداً', False),
                                    ('Non-radioactive waste', 'نفايات غير مشعة', False)
                                ]
                            },
                            {
                                'question_text': 'What is the primary method for long-term storage of high-level radioactive waste?',
                                'question_text_arabic': 'ما هي الطريقة الأساسية للتخزين طويل الأمد للنفايات المشعة عالية المستوى؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Ocean disposal', 'التخلص في المحيط', False),
                                    ('Deep geological repository', 'المستودعات الجيولوجية العميقة', True),
                                    ('Surface storage', 'التخزين السطحي', False),
                                    ('Atmospheric release', 'الإطلاق الجوي', False)
                                ]
                            },
                            {
                                'question_text': 'How long do high-level radioactive wastes remain dangerous?',
                                'question_text_arabic': 'كم من الوقت تبقى النفايات المشعة عالية المستوى خطيرة؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('10-50 years', '10-50 سنة', False),
                                    ('100-500 years', '100-500 سنة', False),
                                    ('Thousands to hundreds of thousands of years', 'آلاف إلى مئات الآلاف من السنين', True),
                                    ('Millions of years', 'ملايين السنين', False)
                                ]
                            },
                            {
                                'question_text': 'Reprocessing spent nuclear fuel can reduce the volume of high-level waste.',
                                'question_text_arabic': 'إعادة معالجة الوقود النووي المستنفد يمكن أن تقلل من حجم النفايات عالية المستوى.',
                                'question_type': 'true_false',
                                'choices': [
                                    ('True', 'صحيح', True),
                                    ('False', 'خطأ', False)
                                ]
                            },
                            {
                                'question_text': 'Describe the concept of multiple barrier systems in radioactive waste disposal.',
                                'question_text_arabic': 'اصف مفهوم أنظمة الحواجز المتعددة في التخلص من النفايات المشعة.',
                                'question_type': 'open_short',
                                'choices': []
                            }
                        ]
                    },
                    {
                        'title': 'Health Effects and Radiation Protection',
                        'title_arabic': 'التأثيرات الصحية والحماية من الإشعاع',
                        'difficulty': 'advanced',
                        'points': 20,
                        'questions': [
                            {
                                'question_text': 'What are the main biological effects of ionizing radiation?',
                                'question_text_arabic': 'ما هي التأثيرات البيولوجية الرئيسية للإشعاع المؤين؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('DNA damage', 'تضرر الحمض النووي', True),
                                    ('Cell death', 'موت الخلايا', True),
                                    ('Cancer induction', 'تحفيز السرطان', True),
                                    ('Genetic mutations', 'الطفرات الجينية', True),
                                    ('Enhanced immunity', 'تعزيز المناعة', False)
                                ]
                            },
                            {
                                'question_text': 'What unit is used to measure radiation dose to humans?',
                                'question_text_arabic': 'ما هي الوحدة المستخدمة لقياس جرعة الإشعاع للبشر؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Gray (Gy)', 'جراي', False),
                                    ('Sievert (Sv)', 'سيفيرت', True),
                                    ('Roentgen (R)', 'رونتجن', False),
                                    ('Curie (Ci)', 'كوري', False)
                                ]
                            },
                            {
                                'question_text': 'What are the three fundamental principles of radiation protection?',
                                'question_text_arabic': 'ما هي المبادئ الأساسية الثلاثة للحماية من الإشعاع؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Time (minimize exposure time)', 'الوقت (تقليل وقت التعرض)', True),
                                    ('Distance (maximize distance from source)', 'المسافة (تعظيم المسافة من المصدر)', True),
                                    ('Shielding (use protective barriers)', 'التدريع (استخدام حواجز واقية)', True),
                                    ('Speed (move quickly)', 'السرعة (التحرك بسرعة)', False),
                                    ('Color (wear bright colors)', 'اللون (ارتداء ألوان زاهية)', False)
                                ]
                            },
                            {
                                'question_text': 'Linear no-threshold (LNT) model assumes any radiation exposure carries some risk.',
                                'question_text_arabic': 'نموذج اللاخطي بدون عتبة يفترض أن أي تعرض إشعاعي يحمل بعض المخاطر.',
                                'question_type': 'true_false',
                                'choices': [
                                    ('True', 'صحيح', True),
                                    ('False', 'خطأ', False)
                                ]
                            },
                            {
                                'question_text': 'Analyze the health risks associated with different levels of radiation exposure.',
                                'question_text_arabic': 'حلل المخاطر الصحية المرتبطة بمستويات مختلفة من التعرض للإشعاع.',
                                'question_type': 'open_short',
                                'choices': []
                            }
                        ]
                    },
                    {
                        'title': 'Nuclear Accidents and Emergency Response',
                        'title_arabic': 'الحوادث النووية والاستجابة للطوارئ',
                        'difficulty': 'advanced',
                        'points': 20,
                        'questions': [
                            {
                                'question_text': 'What were the major nuclear accidents in history?',
                                'question_text_arabic': 'ما هي الحوادث النووية الكبرى في التاريخ؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Chernobyl (1986)', 'تشيرنوبيل (1986)', True),
                                    ('Fukushima (2011)', 'فوكوشيما (2011)', True),
                                    ('Three Mile Island (1979)', 'جزيرة الميل الثلاثة (1979)', True),
                                    ('Kyshtym (1957)', 'كيشتيم (1957)', True),
                                    ('New York Blackout (2003)', 'انقطاع الكهرباء في نيويورك (2003)', False)
                                ]
                            },
                            {
                                'question_text': 'What is the International Nuclear and Radiological Event Scale (INES)?',
                                'question_text_arabic': 'ما هو المقياس الدولي للأحداث النووية والإشعاعية؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Scale from 0-5 for nuclear events', 'مقياس من 0-5 للأحداث النووية', False),
                                    ('Scale from 1-7 for nuclear and radiological events', 'مقياس من 1-7 للأحداث النووية والإشعاعية', True),
                                    ('Scale from 1-10 for all industrial accidents', 'مقياس من 1-10 لجميع الحوادث الصناعية', False),
                                    ('Scale for measuring radiation doses', 'مقياس لقياس جرعات الإشعاع', False)
                                ]
                            },
                            {
                                'question_text': 'What are the main emergency response measures during a nuclear accident?',
                                'question_text_arabic': 'ما هي إجراءات الاستجابة الرئيسية للطوارئ أثناء حادث نووي؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Evacuation of affected areas', 'إخلاء المناطق المتضررة', True),
                                    ('Distribution of potassium iodide', 'توزيع يوديد البوتاسيوم', True),
                                    ('Food and water restrictions', 'قيود على الطعام والمياه', True),
                                    ('Shelter-in-place orders', 'أوامر البقاء في المكان', True),
                                    ('Increased energy production', 'زيادة إنتاج الطاقة', False)
                                ]
                            },
                            {
                                'question_text': 'Modern nuclear reactors have passive safety systems that work without external power.',
                                'question_text_arabic': 'المفاعلات النووية الحديثة لديها أنظمة أمان سلبية تعمل بدون طاقة خارجية.',
                                'question_type': 'true_false',
                                'choices': [
                                    ('True', 'صحيح', True),
                                    ('False', 'خطأ', False)
                                ]
                            },
                            {
                                'question_text': 'Compare the environmental consequences of the Chernobyl and Fukushima accidents.',
                                'question_text_arabic': 'قارن بين العواقب البيئية لحادثي تشيرنوبيل وفوكوشيما.',
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
                    self.style.ERROR('Lesson with ID 122 does not exist')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error creating exercises: {str(e)}')
                )