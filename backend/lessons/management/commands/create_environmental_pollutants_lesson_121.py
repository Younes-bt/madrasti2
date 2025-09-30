from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Lesson 121: Pollutants from energy consumption and the use of organic and inorganic materials (Physical Sciences Track)'

    def handle(self, *args, **options):
        with transaction.atomic():
            try:
                lesson = Lesson.objects.get(id=121)
                self.stdout.write(f"Creating exercises for: {lesson.title}")

                # Clear existing exercises for this lesson
                Exercise.objects.filter(lesson=lesson).delete()

                exercises_data = [
                    {
                        'title': 'Sources and Types of Environmental Pollutants',
                        'title_arabic': 'مصادر وأنواع الملوثات البيئية',
                        'difficulty': 'beginner',
                        'points': 10,
                        'questions': [
                            {
                                'question_text': 'What are the main sources of environmental pollutants?',
                                'question_text_arabic': 'ما هي المصادر الرئيسية للملوثات البيئية؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Industrial activities', 'الأنشطة الصناعية', True),
                                    ('Transportation', 'النقل', True),
                                    ('Energy production', 'إنتاج الطاقة', True),
                                    ('Agriculture', 'الزراعة', True),
                                    ('Natural photosynthesis', 'التمثيل الضوئي الطبيعي', False)
                                ]
                            },
                            {
                                'question_text': 'Which type of pollutant is carbon dioxide (CO2)?',
                                'question_text_arabic': 'ما نوع الملوث الذي يمثله ثاني أكسيد الكربون؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Primary air pollutant', 'ملوث هوائي أولي', False),
                                    ('Greenhouse gas', 'غاز دفيئة', True),
                                    ('Heavy metal', 'معدن ثقيل', False),
                                    ('Organic compound', 'مركب عضوي', False)
                                ]
                            },
                            {
                                'question_text': 'What percentage of global CO2 emissions comes from energy production?',
                                'question_text_arabic': 'ما هي النسبة المئوية لانبعاثات ثاني أكسيد الكربون العالمية من إنتاج الطاقة؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('25%', '25%', False),
                                    ('45%', '45%', False),
                                    ('65%', '65%', True),
                                    ('85%', '85%', False)
                                ]
                            },
                            {
                                'question_text': 'Fossil fuel combustion is the largest source of greenhouse gas emissions.',
                                'question_text_arabic': 'حرق الوقود الأحفوري هو أكبر مصدر لانبعاثات غازات الدفيئة.',
                                'question_type': 'true_false',
                                'choices': [
                                    ('True', 'صحيح', True),
                                    ('False', 'خطأ', False)
                                ]
                            },
                            {
                                'question_text': 'Name three major air pollutants from vehicle emissions.',
                                'question_text_arabic': 'اذكر ثلاثة ملوثات هوائية رئيسية من انبعاثات المركبات.',
                                'question_type': 'open_short',
                                'choices': []
                            }
                        ]
                    },
                    {
                        'title': 'Air Pollution from Energy and Material Use',
                        'title_arabic': 'تلوث الهواء من استخدام الطاقة والمواد',
                        'difficulty': 'intermediate',
                        'points': 15,
                        'questions': [
                            {
                                'question_text': 'Which pollutants are produced by coal-fired power plants?',
                                'question_text_arabic': 'ما هي الملوثات التي تنتجها محطات الطاقة التي تعمل بالفحم؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Sulfur dioxide (SO2)', 'ثاني أكسيد الكبريت', True),
                                    ('Nitrogen oxides (NOx)', 'أكاسيد النيتروجين', True),
                                    ('Particulate matter (PM)', 'الجسيمات العالقة', True),
                                    ('Mercury (Hg)', 'الزئبق', True),
                                    ('Oxygen (O2)', 'الأكسجين', False)
                                ]
                            },
                            {
                                'question_text': 'What is the main cause of acid rain?',
                                'question_text_arabic': 'ما هو السبب الرئيسي للمطر الحمضي؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Carbon dioxide emissions', 'انبعاثات ثاني أكسيد الكربون', False),
                                    ('Sulfur and nitrogen oxides', 'أكاسيد الكبريت والنيتروجين', True),
                                    ('Ozone depletion', 'تدمير الأوزون', False),
                                    ('Plastic pollution', 'التلوث البلاستيكي', False)
                                ]
                            },
                            {
                                'question_text': 'Which industrial process releases the most air pollutants?',
                                'question_text_arabic': 'أي عملية صناعية تطلق أكبر كمية من ملوثات الهواء؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Food processing', 'تصنيع الأغذية', False),
                                    ('Steel and iron production', 'إنتاج الصلب والحديد', True),
                                    ('Textile manufacturing', 'صناعة النسيج', False),
                                    ('Electronics assembly', 'تجميع الإلكترونيات', False)
                                ]
                            },
                            {
                                'question_text': 'Ground-level ozone is formed by reactions involving NOx and volatile organic compounds.',
                                'question_text_arabic': 'يتكون الأوزون على مستوى الأرض من تفاعلات تشمل أكاسيد النيتروجين والمركبات العضوية المتطايرة.',
                                'question_type': 'true_false',
                                'choices': [
                                    ('True', 'صحيح', True),
                                    ('False', 'خطأ', False)
                                ]
                            },
                            {
                                'question_text': 'Explain how particulate matter affects human health.',
                                'question_text_arabic': 'اشرح كيف تؤثر الجسيمات العالقة على صحة الإنسان.',
                                'question_type': 'open_short',
                                'choices': []
                            }
                        ]
                    },
                    {
                        'title': 'Water and Soil Contamination',
                        'title_arabic': 'تلوث المياه والتربة',
                        'difficulty': 'intermediate',
                        'points': 15,
                        'questions': [
                            {
                                'question_text': 'What are the main sources of water pollution from industrial activities?',
                                'question_text_arabic': 'ما هي المصادر الرئيسية لتلوث المياه من الأنشطة الصناعية؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Chemical discharge', 'تصريف المواد الكيميائية', True),
                                    ('Thermal pollution', 'التلوث الحراري', True),
                                    ('Heavy metals', 'المعادن الثقيلة', True),
                                    ('Radioactive materials', 'المواد المشعة', True),
                                    ('Pure water discharge', 'تصريف المياه النقية', False)
                                ]
                            },
                            {
                                'question_text': 'Which heavy metals are most commonly found in industrial waste?',
                                'question_text_arabic': 'ما هي المعادن الثقيلة الأكثر شيوعاً في النفايات الصناعية؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Lead (Pb)', 'الرصاص', True),
                                    ('Mercury (Hg)', 'الزئبق', True),
                                    ('Cadmium (Cd)', 'الكادميوم', True),
                                    ('Chromium (Cr)', 'الكروم', True),
                                    ('Sodium (Na)', 'الصوديوم', False)
                                ]
                            },
                            {
                                'question_text': 'What is bioaccumulation in the context of environmental pollution?',
                                'question_text_arabic': 'ما هو التراكم البيولوجي في سياق التلوث البيئي؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Rapid breakdown of pollutants', 'التحلل السريع للملوثات', False),
                                    ('Concentration of toxins in organisms over time', 'تركز السموم في الكائنات عبر الزمن', True),
                                    ('Natural purification process', 'عملية تنقية طبيعية', False),
                                    ('Dilution of pollutants', 'تخفيف الملوثات', False)
                                ]
                            },
                            {
                                'question_text': 'Persistent organic pollutants (POPs) can travel long distances in the environment.',
                                'question_text_arabic': 'يمكن للملوثات العضوية الثابتة أن تنتقل لمسافات طويلة في البيئة.',
                                'question_type': 'true_false',
                                'choices': [
                                    ('True', 'صحيح', True),
                                    ('False', 'خطأ', False)
                                ]
                            },
                            {
                                'question_text': 'Describe the process of eutrophication caused by nutrient pollution.',
                                'question_text_arabic': 'اصف عملية التخصيب الناتجة عن تلوث المغذيات.',
                                'question_type': 'open_short',
                                'choices': []
                            }
                        ]
                    },
                    {
                        'title': 'Plastic and Chemical Pollutants',
                        'title_arabic': 'الملوثات البلاستيكية والكيميائية',
                        'difficulty': 'advanced',
                        'points': 20,
                        'questions': [
                            {
                                'question_text': 'What are microplastics and how do they enter the environment?',
                                'question_text_arabic': 'ما هي البلاستيك المجهري وكيف يدخل إلى البيئة؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Large plastic debris only', 'حطام بلاستيكي كبير فقط', False),
                                    ('Plastic particles smaller than 5mm from degradation', 'جسيمات بلاستيكية أصغر من 5 مم من التحلل', True),
                                    ('Natural plastic compounds', 'مركبات بلاستيكية طبيعية', False),
                                    ('Biodegradable materials', 'مواد قابلة للتحلل البيولوجي', False)
                                ]
                            },
                            {
                                'question_text': 'Which chemicals are known as endocrine disruptors?',
                                'question_text_arabic': 'ما هي الكيماويات المعروفة كمختلات الغدد الصماء؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Bisphenol A (BPA)', 'بيسفينول أ', True),
                                    ('Phthalates', 'الفثالات', True),
                                    ('PCBs (Polychlorinated biphenyls)', 'البي سي بي', True),
                                    ('Dioxins', 'الديوكسينات', True),
                                    ('Pure water', 'المياه النقية', False)
                                ]
                            },
                            {
                                'question_text': 'How do pharmaceutical pollutants enter water systems?',
                                'question_text_arabic': 'كيف تدخل الملوثات الصيدلانية إلى أنظمة المياه؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Human excretion after medication use', 'الإفراز البشري بعد تناول الأدوية', True),
                                    ('Industrial pharmaceutical waste', 'النفايات الصيدلانية الصناعية', True),
                                    ('Veterinary drug use in agriculture', 'استخدام الأدوية البيطرية في الزراعة', True),
                                    ('Improper disposal of medications', 'التخلص غير السليم من الأدوية', True),
                                    ('Natural water filtration', 'ترشيح المياه الطبيعي', False)
                                ]
                            },
                            {
                                'question_text': 'Nanomaterials can have different toxicity properties compared to their bulk counterparts.',
                                'question_text_arabic': 'يمكن أن تمتلك المواد النانوية خصائص سمية مختلفة مقارنة بنظيراتها الكتلية.',
                                'question_type': 'true_false',
                                'choices': [
                                    ('True', 'صحيح', True),
                                    ('False', 'خطأ', False)
                                ]
                            },
                            {
                                'question_text': 'Analyze the environmental fate of plastic polymers in marine ecosystems.',
                                'question_text_arabic': 'حلل مصير البوليمرات البلاستيكية في النظم البيئية البحرية.',
                                'question_type': 'open_short',
                                'choices': []
                            }
                        ]
                    },
                    {
                        'title': 'Pollution Prevention and Control Technologies',
                        'title_arabic': 'تقنيات منع ومراقبة التلوث',
                        'difficulty': 'advanced',
                        'points': 20,
                        'questions': [
                            {
                                'question_text': 'What are the main strategies for pollution prevention?',
                                'question_text_arabic': 'ما هي الاستراتيجيات الرئيسية لمنع التلوث؟',
                                'question_type': 'qcm_multiple',
                                'choices': [
                                    ('Source reduction', 'تقليل المصدر', True),
                                    ('Cleaner production technologies', 'تقنيات الإنتاج الأنظف', True),
                                    ('Waste minimization', 'تقليل النفايات', True),
                                    ('End-of-pipe treatment', 'معالجة نهاية الأنبوب', True),
                                    ('Increasing production volumes', 'زيادة أحجام الإنتاج', False)
                                ]
                            },
                            {
                                'question_text': 'Which technology is most effective for removing SO2 from flue gas?',
                                'question_text_arabic': 'أي تقنية هي الأكثر فعالية لإزالة ثاني أكسيد الكبريت من غازات المداخن؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Electrostatic precipitation', 'الترسيب الكهروستاتيكي', False),
                                    ('Flue gas desulfurization (FGD)', 'إزالة الكبريت من غازات المداخن', True),
                                    ('Catalytic reduction', 'التقليل التحفيزي', False),
                                    ('Simple filtration', 'الترشيح البسيط', False)
                                ]
                            },
                            {
                                'question_text': 'What is the principle behind carbon capture and storage (CCS)?',
                                'question_text_arabic': 'ما هو المبدأ وراء التقاط وتخزين الكربون؟',
                                'question_type': 'qcm_single',
                                'choices': [
                                    ('Converting CO2 to oxygen', 'تحويل ثاني أكسيد الكربون إلى أكسجين', False),
                                    ('Capturing CO2 from emissions and storing underground', 'التقاط ثاني أكسيد الكربون من الانبعاثات وتخزينه تحت الأرض', True),
                                    ('Burning CO2 for energy', 'حرق ثاني أكسيد الكربون للطاقة', False),
                                    ('Dissolving CO2 in water', 'إذابة ثاني أكسيد الكربون في الماء', False)
                                ]
                            },
                            {
                                'question_text': 'Advanced wastewater treatment can remove pharmaceutical pollutants.',
                                'question_text_arabic': 'يمكن لمعالجة مياه الصرف المتقدمة إزالة الملوثات الصيدلانية.',
                                'question_type': 'true_false',
                                'choices': [
                                    ('True', 'صحيح', True),
                                    ('False', 'خطأ', False)
                                ]
                            },
                            {
                                'question_text': 'Compare the effectiveness of different air pollution control technologies.',
                                'question_text_arabic': 'قارن بين فعالية تقنيات مراقبة تلوث الهواء المختلفة.',
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
                    self.style.ERROR('Lesson with ID 121 does not exist')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error creating exercises: {str(e)}')
                )