from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward
from django.db import transaction

class Command(BaseCommand):
    help = 'Create exercises for Lesson 134: Conductance and conductivity'

    @transaction.atomic
    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=134)
            self.stdout.write(f"Creating exercises for lesson: {lesson.title}")

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Basic Concepts of Conductance',
                    'title_ar': 'المفاهيم الأساسية للموصلية',
                    'description': 'Understanding electrical conductance, conductivity, and their fundamental properties.',
                    'description_ar': 'فهم التوصيل الكهربائي والموصلية وخصائصهما الأساسية.',
                    'difficulty': 'beginner',
                    'points': 10,
                    'questions': [
                        {
                            'text': 'Electrical conductance is defined as:',
                            'text_ar': 'التوصيل الكهربائي يُعرَّف بأنه:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'The reciprocal of resistance', 'text_ar': 'مقلوب المقاومة', 'is_correct': True},
                                {'text': 'The same as resistance', 'text_ar': 'نفس المقاومة', 'is_correct': False},
                                {'text': 'Current times voltage', 'text_ar': 'التيار مضروب في الجهد', 'is_correct': False},
                                {'text': 'Voltage divided by current', 'text_ar': 'الجهد مقسوم على التيار', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'The SI unit for conductance is:',
                            'text_ar': 'وحدة التوصيل في النظام الدولي هي:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Siemens (S)', 'text_ar': 'سيمنز (S)', 'is_correct': True},
                                {'text': 'Ohm (Ω)', 'text_ar': 'أوم (Ω)', 'is_correct': False},
                                {'text': 'Ampere (A)', 'text_ar': 'أمبير (A)', 'is_correct': False},
                                {'text': 'Volt (V)', 'text_ar': 'فولت (V)', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'Conductivity is an intensive property.',
                            'text_ar': 'الموصلية خاصية مكثفة.',
                            'type': 'true_false',
                            'points': 2,
                            'choices': [
                                {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                                {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'Which factors affect the conductance of a solution?',
                            'text_ar': 'أي عوامل تؤثر على توصيل المحلول؟',
                            'type': 'qcm_multiple',
                            'points': 4,
                            'choices': [
                                {'text': 'Ion concentration', 'text_ar': 'تركيز الأيونات', 'is_correct': True},
                                {'text': 'Temperature', 'text_ar': 'درجة الحرارة', 'is_correct': True},
                                {'text': 'Nature of ions', 'text_ar': 'طبيعة الأيونات', 'is_correct': True},
                                {'text': 'Color of solution', 'text_ar': 'لون المحلول', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Molar Conductivity',
                    'title_ar': 'الموصلية المولارية',
                    'description': 'Understanding molar conductivity and its relationship with concentration.',
                    'description_ar': 'فهم الموصلية المولارية وعلاقتها بالتركيز.',
                    'difficulty': 'intermediate',
                    'points': 15,
                    'questions': [
                        {
                            'text': 'Molar conductivity is defined as:',
                            'text_ar': 'الموصلية المولارية تُعرَّف بأنها:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Conductivity divided by concentration', 'text_ar': 'الموصلية مقسومة على التركيز', 'is_correct': True},
                                {'text': 'Conductivity times concentration', 'text_ar': 'الموصلية مضروبة في التركيز', 'is_correct': False},
                                {'text': 'Concentration divided by conductivity', 'text_ar': 'التركيز مقسوم على الموصلية', 'is_correct': False},
                                {'text': 'The same as conductivity', 'text_ar': 'نفس الموصلية', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'The unit of molar conductivity is:',
                            'text_ar': 'وحدة الموصلية المولارية هي:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'S·m²·mol⁻¹', 'text_ar': 'S·m²·mol⁻¹', 'is_correct': True},
                                {'text': 'S·m⁻¹', 'text_ar': 'S·m⁻¹', 'is_correct': False},
                                {'text': 'S·mol⁻¹', 'text_ar': 'S·mol⁻¹', 'is_correct': False},
                                {'text': 'S·m²', 'text_ar': 'S·m²', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'For strong electrolytes, molar conductivity:',
                            'text_ar': 'للإلكتروليتات القوية، الموصلية المولارية:',
                            'type': 'qcm_single',
                            'points': 3,
                            'choices': [
                                {'text': 'Decreases slightly with increasing concentration', 'text_ar': 'تنخفض قليلاً مع زيادة التركيز', 'is_correct': True},
                                {'text': 'Increases with increasing concentration', 'text_ar': 'تزيد مع زيادة التركيز', 'is_correct': False},
                                {'text': 'Remains constant', 'text_ar': 'تبقى ثابتة', 'is_correct': False},
                                {'text': 'Decreases dramatically', 'text_ar': 'تنخفض بشكل كبير', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'The molar conductivity at infinite dilution represents:',
                            'text_ar': 'الموصلية المولارية عند التخفيف اللانهائي تمثل:',
                            'type': 'qcm_single',
                            'points': 3,
                            'choices': [
                                {'text': 'Maximum possible molar conductivity', 'text_ar': 'أقصى موصلية مولارية ممكنة', 'is_correct': True},
                                {'text': 'Zero conductivity', 'text_ar': 'موصلية صفر', 'is_correct': False},
                                {'text': 'Minimum conductivity', 'text_ar': 'أدنى موصلية', 'is_correct': False},
                                {'text': 'Average conductivity', 'text_ar': 'متوسط الموصلية', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'Calculate the molar conductivity of a 0.1 M NaCl solution with conductivity 1.06 × 10⁻² S·m⁻¹.',
                            'text_ar': 'احسب الموصلية المولارية لمحلول NaCl تركيز 0.1 M بموصلية 1.06 × 10⁻² S·m⁻¹.',
                            'type': 'open_short',
                            'points': 5,
                            'choices': []
                        }
                    ]
                },
                {
                    'title': 'Kohlrausch\'s Law',
                    'title_ar': 'قانون كولراوش',
                    'description': 'Understanding Kohlrausch\'s law of independent migration of ions.',
                    'description_ar': 'فهم قانون كولراوش للهجرة المستقلة للأيونات.',
                    'difficulty': 'intermediate',
                    'points': 15,
                    'questions': [
                        {
                            'text': 'Kohlrausch\'s law states that:',
                            'text_ar': 'قانون كولراوش ينص على أن:',
                            'type': 'qcm_single',
                            'points': 3,
                            'choices': [
                                {'text': 'Each ion contributes independently to the total conductivity', 'text_ar': 'كل أيون يساهم بشكل مستقل في الموصلية الإجمالية', 'is_correct': True},
                                {'text': 'All ions have the same conductivity', 'text_ar': 'جميع الأيونات لها نفس الموصلية', 'is_correct': False},
                                {'text': 'Conductivity is proportional to voltage', 'text_ar': 'الموصلية متناسبة مع الجهد', 'is_correct': False},
                                {'text': 'Ions migrate together', 'text_ar': 'الأيونات تهاجر معاً', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'The limiting molar conductivity of an electrolyte is:',
                            'text_ar': 'الموصلية المولارية الحدية للإلكتروليت هي:',
                            'type': 'qcm_single',
                            'points': 3,
                            'choices': [
                                {'text': 'Sum of ionic conductivities of all ions', 'text_ar': 'مجموع الموصليات الأيونية لجميع الأيونات', 'is_correct': True},
                                {'text': 'Product of ionic conductivities', 'text_ar': 'حاصل ضرب الموصليات الأيونية', 'is_correct': False},
                                {'text': 'Average of ionic conductivities', 'text_ar': 'متوسط الموصليات الأيونية', 'is_correct': False},
                                {'text': 'Difference of ionic conductivities', 'text_ar': 'فرق الموصليات الأيونية', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'Which ion has the highest molar ionic conductivity?',
                            'text_ar': 'أي أيون له أعلى موصلية أيونية مولارية؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'H⁺', 'text_ar': 'H⁺', 'is_correct': True},
                                {'text': 'Na⁺', 'text_ar': 'Na⁺', 'is_correct': False},
                                {'text': 'K⁺', 'text_ar': 'K⁺', 'is_correct': False},
                                {'text': 'Cl⁻', 'text_ar': 'Cl⁻', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'The high conductivity of H⁺ and OH⁻ ions is due to:',
                            'text_ar': 'الموصلية العالية لأيونات H⁺ و OH⁻ تعود إلى:',
                            'type': 'qcm_single',
                            'points': 3,
                            'choices': [
                                {'text': 'Proton jumping mechanism', 'text_ar': 'آلية قفز البروتون', 'is_correct': True},
                                {'text': 'Large ionic size', 'text_ar': 'الحجم الأيوني الكبير', 'is_correct': False},
                                {'text': 'High charge density', 'text_ar': 'كثافة الشحنة العالية', 'is_correct': False},
                                {'text': 'Weak hydration', 'text_ar': 'الإماهة الضعيفة', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'Use Kohlrausch\'s law to calculate Λ₀ for CH₃COOH if Λ₀(HCl) = 426.2, Λ₀(CH₃COONa) = 91.0, and Λ₀(NaCl) = 126.5 S·cm²·mol⁻¹.',
                            'text_ar': 'استخدم قانون كولراوش لحساب Λ₀ لـ CH₃COOH إذا كان Λ₀(HCl) = 426.2، Λ₀(CH₃COONa) = 91.0، و Λ₀(NaCl) = 126.5 S·cm²·mol⁻¹.',
                            'type': 'open_short',
                            'points': 4,
                            'choices': []
                        }
                    ]
                },
                {
                    'title': 'Conductometric Titrations',
                    'title_ar': 'المعايرات التوصيلية',
                    'description': 'Using conductivity measurements to determine equivalence points in titrations.',
                    'description_ar': 'استخدام قياسات الموصلية لتحديد نقاط التكافؤ في المعايرات.',
                    'difficulty': 'advanced',
                    'points': 20,
                    'questions': [
                        {
                            'text': 'In a conductometric titration, the equivalence point is determined by:',
                            'text_ar': 'في المعايرة التوصيلية، نقطة التكافؤ تُحدد بـ:',
                            'type': 'qcm_single',
                            'points': 3,
                            'choices': [
                                {'text': 'The break or change in slope of conductivity curve', 'text_ar': 'الانكسار أو التغيير في ميل منحنى الموصلية', 'is_correct': True},
                                {'text': 'Maximum conductivity', 'text_ar': 'أقصى موصلية', 'is_correct': False},
                                {'text': 'Minimum conductivity', 'text_ar': 'أدنى موصلية', 'is_correct': False},
                                {'text': 'Zero conductivity', 'text_ar': 'موصلية صفر', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'In the titration of HCl with NaOH, conductivity initially:',
                            'text_ar': 'في معايرة HCl مع NaOH، الموصلية في البداية:',
                            'type': 'qcm_single',
                            'points': 3,
                            'choices': [
                                {'text': 'Decreases', 'text_ar': 'تنخفض', 'is_correct': True},
                                {'text': 'Increases', 'text_ar': 'تزيد', 'is_correct': False},
                                {'text': 'Remains constant', 'text_ar': 'تبقى ثابتة', 'is_correct': False},
                                {'text': 'Becomes zero', 'text_ar': 'تصبح صفراً', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'Conductometric titrations are particularly useful for:',
                            'text_ar': 'المعايرات التوصيلية مفيدة بشكل خاص لـ:',
                            'type': 'qcm_multiple',
                            'points': 4,
                            'choices': [
                                {'text': 'Colored solutions', 'text_ar': 'المحاليل الملونة', 'is_correct': True},
                                {'text': 'Weak acid-weak base titrations', 'text_ar': 'معايرات الحمض الضعيف-القاعدة الضعيفة', 'is_correct': True},
                                {'text': 'Turbid solutions', 'text_ar': 'المحاليل العكرة', 'is_correct': True},
                                {'text': 'Only strong acid-strong base', 'text_ar': 'فقط الحمض القوي-القاعدة القوية', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'After the equivalence point in HCl-NaOH titration, conductivity increases due to:',
                            'text_ar': 'بعد نقطة التكافؤ في معايرة HCl-NaOH، الموصلية تزيد بسبب:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Excess OH⁻ ions', 'text_ar': 'فائض أيونات OH⁻', 'is_correct': True},
                                {'text': 'Formation of water', 'text_ar': 'تكوين الماء', 'is_correct': False},
                                {'text': 'Decrease in ionic strength', 'text_ar': 'انخفاض القوة الأيونية', 'is_correct': False},
                                {'text': 'Temperature change', 'text_ar': 'تغيير درجة الحرارة', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'The shape of the conductivity curve depends on:',
                            'text_ar': 'شكل منحنى الموصلية يعتمد على:',
                            'type': 'qcm_multiple',
                            'points': 3,
                            'choices': [
                                {'text': 'Strength of acid and base', 'text_ar': 'قوة الحمض والقاعدة', 'is_correct': True},
                                {'text': 'Ionic mobilities', 'text_ar': 'حركية الأيونات', 'is_correct': True},
                                {'text': 'Dilution effects', 'text_ar': 'تأثيرات التخفيف', 'is_correct': True},
                                {'text': 'Color of indicator', 'text_ar': 'لون الكاشف', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'Explain why conductivity decreases during the initial part of HCl titration with NaOH.',
                            'text_ar': 'اشرح لماذا تنخفض الموصلية خلال الجزء الأولي من معايرة HCl مع NaOH.',
                            'type': 'open_short',
                            'points': 5,
                            'choices': []
                        }
                    ]
                },
                {
                    'title': 'Applications and Measurements',
                    'title_ar': 'التطبيقات والقياسات',
                    'description': 'Practical applications of conductivity measurements in chemistry and industry.',
                    'description_ar': 'التطبيقات العملية لقياسات الموصلية في الكيمياء والصناعة.',
                    'difficulty': 'advanced',
                    'points': 20,
                    'questions': [
                        {
                            'text': 'Conductivity measurements are used to determine:',
                            'text_ar': 'قياسات الموصلية تُستخدم لتحديد:',
                            'type': 'qcm_multiple',
                            'points': 4,
                            'choices': [
                                {'text': 'Water purity', 'text_ar': 'نقاوة الماء', 'is_correct': True},
                                {'text': 'Solution concentration', 'text_ar': 'تركيز المحلول', 'is_correct': True},
                                {'text': 'Degree of ionization', 'text_ar': 'درجة التأين', 'is_correct': True},
                                {'text': 'Molecular weight', 'text_ar': 'الوزن الجزيئي', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'The conductivity of pure water at 25°C is approximately:',
                            'text_ar': 'موصلية الماء النقي عند 25°C تقريباً:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '5.5 × 10⁻⁶ S·m⁻¹', 'text_ar': '5.5 × 10⁻⁶ S·m⁻¹', 'is_correct': True},
                                {'text': '1.0 × 10⁻³ S·m⁻¹', 'text_ar': '1.0 × 10⁻³ S·m⁻¹', 'is_correct': False},
                                {'text': '1.0 S·m⁻¹', 'text_ar': '1.0 S·m⁻¹', 'is_correct': False},
                                {'text': 'Zero', 'text_ar': 'صفر', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'Cell constant (K) of a conductivity cell is:',
                            'text_ar': 'ثابت الخلية (K) لخلية الموصلية هو:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Length/Area (l/A)', 'text_ar': 'الطول/المساحة (l/A)', 'is_correct': True},
                                {'text': 'Area/Length (A/l)', 'text_ar': 'المساحة/الطول (A/l)', 'is_correct': False},
                                {'text': 'Length × Area (l × A)', 'text_ar': 'الطول × المساحة (l × A)', 'is_correct': False},
                                {'text': 'Independent of geometry', 'text_ar': 'مستقل عن الهندسة', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'Temperature coefficient of conductivity for electrolyte solutions is usually:',
                            'text_ar': 'معامل درجة الحرارة للموصلية في محاليل الإلكتروليت عادة:',
                            'type': 'qcm_single',
                            'points': 3,
                            'choices': [
                                {'text': 'Positive (increases with temperature)', 'text_ar': 'موجب (يزيد مع درجة الحرارة)', 'is_correct': True},
                                {'text': 'Negative (decreases with temperature)', 'text_ar': 'سالب (ينقص مع درجة الحرارة)', 'is_correct': False},
                                {'text': 'Zero (independent of temperature)', 'text_ar': 'صفر (مستقل عن درجة الحرارة)', 'is_correct': False},
                                {'text': 'Variable', 'text_ar': 'متغير', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'In quality control of drinking water, high conductivity indicates:',
                            'text_ar': 'في مراقبة جودة مياه الشرب، الموصلية العالية تشير إلى:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'High dissolved salt content', 'text_ar': 'محتوى عالي من الأملاح المذابة', 'is_correct': True},
                                {'text': 'High purity', 'text_ar': 'نقاوة عالية', 'is_correct': False},
                                {'text': 'Low mineral content', 'text_ar': 'محتوى منخفض من المعادن', 'is_correct': False},
                                {'text': 'Neutral pH', 'text_ar': 'أس هيدروجيني متعادل', 'is_correct': False}
                            ]
                        },
                        {
                            'text': 'Describe how conductivity measurements can be used to monitor the progress of precipitation reactions.',
                            'text_ar': 'صف كيف يمكن استخدام قياسات الموصلية لمراقبة تقدم تفاعلات الترسيب.',
                            'type': 'open_short',
                            'points': 7,
                            'choices': []
                        }
                    ]
                }
            ]

            for i, exercise_data in enumerate(exercises_data, 1):
                exercise = Exercise.objects.create(
                    lesson=lesson,
                    created_by_id=1,
                    title=exercise_data['title'],
                    title_arabic=exercise_data['title_ar'],
                    description=exercise_data['description'],
                    instructions=exercise_data['description_ar']
                )

                # Create reward configuration
                ExerciseReward.objects.create(
                    exercise=exercise,
                    completion_points=exercise_data['points'],
                    difficulty_multiplier=1.5 if exercise_data['difficulty'] == 'advanced' else 1.2 if exercise_data['difficulty'] == 'intermediate' else 1.0
                )

                for j, question_data in enumerate(exercise_data['questions'], 1):
                    question = Question.objects.create(
                        exercise=exercise,
                        question_text=question_data['text'],
                        question_text_arabic=question_data['text_ar'],
                        question_type=question_data['type'],
                        points=question_data['points']
                    )

                    for k, choice_data in enumerate(question_data['choices'], 1):
                        QuestionChoice.objects.create(
                            question=question,
                            choice_text=choice_data['text'],
                            choice_text_arabic=choice_data['text_ar'],
                            is_correct=choice_data['is_correct']
                        )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created {len(exercises_data)} exercises for lesson {lesson.id}: {lesson.title}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 134 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )