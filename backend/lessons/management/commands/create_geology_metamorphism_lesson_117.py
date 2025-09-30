from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Lesson 117: Metamorphism and its relationship with plate dynamics'

    def handle(self, *args, **options):
        lesson_id = 117

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
                'title': 'Introduction to Metamorphism',
                'title_ar': 'مقدمة في التحول الصخري',
                'description': 'Understanding the basic concepts and types of metamorphism',
                'description_ar': 'فهم المفاهيم الأساسية وأنواع التحول الصخري',
                'difficulty': 'beginner',
                'points': 10,
                'questions': [
                    {
                        'text': 'What is metamorphism?',
                        'text_ar': 'ما هو التحول الصخري؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'The transformation of existing rocks by heat, pressure, and chemically active fluids', 'text_ar': 'تحول الصخور الموجودة بفعل الحرارة والضغط والسوائل النشطة كيميائياً', 'is_correct': True},
                            {'text': 'The weathering of rocks at Earth\'s surface', 'text_ar': 'تعرية الصخور على سطح الأرض', 'is_correct': False},
                            {'text': 'The formation of rocks from magma', 'text_ar': 'تكوين الصخور من الصهارة', 'is_correct': False},
                            {'text': 'The deposition of sediments in layers', 'text_ar': 'ترسيب الرواسب في طبقات', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which factors are primarily responsible for metamorphism?',
                        'text_ar': 'أي العوامل مسؤولة بشكل أساسي عن التحول الصخري؟',
                        'type': 'qcm_multiple',
                        'points': 3,
                        'choices': [
                            {'text': 'Temperature', 'text_ar': 'درجة الحرارة', 'is_correct': True},
                            {'text': 'Pressure', 'text_ar': 'الضغط', 'is_correct': True},
                            {'text': 'Chemically active fluids', 'text_ar': 'السوائل النشطة كيميائياً', 'is_correct': True},
                            {'text': 'Solar radiation', 'text_ar': 'الإشعاع الشمسي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What distinguishes metamorphic rocks from igneous and sedimentary rocks?',
                        'text_ar': 'ما الذي يميز الصخور المتحولة عن الصخور النارية والرسوبية؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'They form from pre-existing rocks under altered conditions without melting', 'text_ar': 'تتكون من صخور موجودة مسبقاً في ظروف متغيرة دون انصهار', 'is_correct': True},
                            {'text': 'They always contain fossils', 'text_ar': 'تحتوي دائماً على أحافير', 'is_correct': False},
                            {'text': 'They form only from magma cooling', 'text_ar': 'تتكون فقط من تبريد الصهارة', 'is_correct': False},
                            {'text': 'They are always found at the surface', 'text_ar': 'توجد دائماً على السطح', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Metamorphism occurs without the complete melting of the original rock.',
                        'text_ar': 'يحدث التحول الصخري دون الانصهار الكامل للصخر الأصلي.',
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
                'title': 'Types of Metamorphism',
                'title_ar': 'أنواع التحول الصخري',
                'description': 'Exploring contact, regional, and dynamic metamorphism',
                'description_ar': 'استكشاف التحول التلامسي والإقليمي والديناميكي',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'Which type of metamorphism occurs around igneous intrusions?',
                        'text_ar': 'أي نوع من التحول الصخري يحدث حول التداخلات النارية؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'Contact metamorphism', 'text_ar': 'التحول التلامسي', 'is_correct': True},
                            {'text': 'Regional metamorphism', 'text_ar': 'التحول الإقليمي', 'is_correct': False},
                            {'text': 'Dynamic metamorphism', 'text_ar': 'التحول الديناميكي', 'is_correct': False},
                            {'text': 'Hydrothermal metamorphism', 'text_ar': 'التحول الحراري المائي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What characterizes regional metamorphism?',
                        'text_ar': 'ما الذي يميز التحول الإقليمي؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'Large-scale metamorphism over extensive areas due to tectonic forces', 'text_ar': 'تحول واسع النطاق على مناطق واسعة بسبب القوى التكتونية', 'is_correct': True},
                            {'text': 'Metamorphism limited to small contact zones', 'text_ar': 'تحول محدود بمناطق تلامس صغيرة', 'is_correct': False},
                            {'text': 'Metamorphism caused only by heat', 'text_ar': 'تحول ناتج عن الحرارة فقط', 'is_correct': False},
                            {'text': 'Metamorphism occurring only at the surface', 'text_ar': 'تحول يحدث فقط على السطح', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Dynamic metamorphism is associated with which geological structures?',
                        'text_ar': 'يرتبط التحول الديناميكي بأي التراكيب الجيولوجية؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'Fault zones', 'text_ar': 'مناطق الصدوع', 'is_correct': True},
                            {'text': 'Shear zones', 'text_ar': 'مناطق القص', 'is_correct': True},
                            {'text': 'Sedimentary basins', 'text_ar': 'الأحواض الرسوبية', 'is_correct': False},
                            {'text': 'Volcanic vents', 'text_ar': 'فتحات بركانية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the main difference between contact and regional metamorphism in terms of pressure conditions?',
                        'text_ar': 'ما هو الاختلاف الرئيسي بين التحول التلامسي والإقليمي من ناحية ظروف الضغط؟',
                        'type': 'open_short',
                        'points': 5,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Metamorphic Grade and Zones',
                'title_ar': 'درجة التحول والمناطق المتحولة',
                'description': 'Understanding metamorphic grades and index minerals',
                'description_ar': 'فهم درجات التحول والمعادن الدليلية',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What determines metamorphic grade?',
                        'text_ar': 'ما الذي يحدد درجة التحول؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'The intensity of temperature and pressure conditions', 'text_ar': 'شدة ظروف درجة الحرارة والضغط', 'is_correct': True},
                            {'text': 'The age of the original rock', 'text_ar': 'عمر الصخر الأصلي', 'is_correct': False},
                            {'text': 'The color of the resulting minerals', 'text_ar': 'لون المعادن الناتجة', 'is_correct': False},
                            {'text': 'The size of the rock mass', 'text_ar': 'حجم الكتلة الصخرية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which mineral indicates high-grade metamorphism in pelitic rocks?',
                        'text_ar': 'أي معدن يشير إلى التحول عالي الدرجة في الصخور الطينية؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'Sillimanite', 'text_ar': 'السيليمانيت', 'is_correct': True},
                            {'text': 'Chlorite', 'text_ar': 'الكلوريت', 'is_correct': False},
                            {'text': 'Biotite', 'text_ar': 'البيوتيت', 'is_correct': False},
                            {'text': 'Muscovite', 'text_ar': 'المسكوفيت', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What are index minerals?',
                        'text_ar': 'ما هي المعادن الدليلية؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'Minerals that indicate specific metamorphic conditions', 'text_ar': 'معادن تشير إلى ظروف تحول معينة', 'is_correct': True},
                            {'text': 'Minerals used to define metamorphic zones', 'text_ar': 'معادن تستخدم لتحديد مناطق التحول', 'is_correct': True},
                            {'text': 'The most abundant minerals in a rock', 'text_ar': 'المعادن الأكثر وفرة في الصخر', 'is_correct': False},
                            {'text': 'Minerals that resist metamorphism', 'text_ar': 'معادن تقاوم التحول', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Isograds represent lines of equal metamorphic grade on geological maps.',
                        'text_ar': 'تمثل الخطوط المتساوية التحول خطوط درجة التحول المتساوية على الخرائط الجيولوجية.',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Describe the sequence of index minerals in the progressive metamorphism of shale.',
                        'text_ar': 'صف تسلسل المعادن الدليلية في التحول التدريجي للصخر الزيتي.',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Metamorphism and Plate Tectonics',
                'title_ar': 'التحول الصخري وتكتونية الصفائح',
                'description': 'Connecting metamorphic processes to plate tectonic settings',
                'description_ar': 'ربط عمليات التحول الصخري ببيئات تكتونية الصفائح',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'Which type of metamorphism is associated with subduction zones?',
                        'text_ar': 'أي نوع من التحول الصخري مرتبط بمناطق الاندساس؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'High-pressure, low-temperature metamorphism', 'text_ar': 'التحول عالي الضغط منخفض الحرارة', 'is_correct': True},
                            {'text': 'High-temperature, low-pressure metamorphism', 'text_ar': 'التحول عالي الحرارة منخفض الضغط', 'is_correct': False},
                            {'text': 'Contact metamorphism only', 'text_ar': 'التحول التلامسي فقط', 'is_correct': False},
                            {'text': 'No metamorphism occurs', 'text_ar': 'لا يحدث تحول', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What metamorphic rock is characteristic of high-pressure, low-temperature conditions?',
                        'text_ar': 'أي صخر متحول مميز لظروف الضغط العالي والحرارة المنخفضة؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'Blueschist', 'text_ar': 'الشست الأزرق', 'is_correct': True},
                            {'text': 'Hornfels', 'text_ar': 'الهورنفلس', 'is_correct': False},
                            {'text': 'Granulite', 'text_ar': 'الجرانوليت', 'is_correct': False},
                            {'text': 'Migmatite', 'text_ar': 'الميجماتيت', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which plate tectonic settings favor different types of metamorphism?',
                        'text_ar': 'أي بيئات تكتونية الصفائح تفضل أنواع مختلفة من التحول؟',
                        'type': 'qcm_multiple',
                        'points': 6,
                        'choices': [
                            {'text': 'Mid-ocean ridges - low-grade metamorphism', 'text_ar': 'حواف المحيط المتوسطة - تحول منخفض الدرجة', 'is_correct': True},
                            {'text': 'Continental collision zones - high-grade regional metamorphism', 'text_ar': 'مناطق التصادم القاري - تحول إقليمي عالي الدرجة', 'is_correct': True},
                            {'text': 'Transform faults - dynamic metamorphism', 'text_ar': 'الصدوع التحويلية - تحول ديناميكي', 'is_correct': True},
                            {'text': 'Passive margins - high-temperature metamorphism', 'text_ar': 'الحواف السلبية - تحول عالي الحرارة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Paired metamorphic belts represent different pressure-temperature paths in subduction zones.',
                        'text_ar': 'تمثل الأحزمة المتحولة المزدوجة مسارات ضغط-حرارة مختلفة في مناطق الاندساس.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Explain how the formation of metamorphic core complexes relates to extensional tectonics.',
                        'text_ar': 'اشرح كيف يرتبط تكوين المجمعات النواة المتحولة بالتكتونية التمددية.',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Metamorphic Textures and Structures',
                'title_ar': 'النسيج والتراكيب المتحولة',
                'description': 'Analyzing metamorphic textures and their tectonic significance',
                'description_ar': 'تحليل النسيج المتحول وأهميته التكتونية',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'What is foliation in metamorphic rocks?',
                        'text_ar': 'ما هو التورق في الصخور المتحولة؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'The parallel alignment of platy minerals due to directed pressure', 'text_ar': 'الترتيب المتوازي للمعادن المسطحة بسبب الضغط الموجه', 'is_correct': True},
                            {'text': 'The random arrangement of crystals', 'text_ar': 'الترتيب العشوائي للبلورات', 'is_correct': False},
                            {'text': 'The presence of large crystals', 'text_ar': 'وجود بلورات كبيرة', 'is_correct': False},
                            {'text': 'The layering inherited from sedimentary rocks', 'text_ar': 'التطبق الموروث من الصخور الرسوبية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which metamorphic rock shows the highest degree of foliation?',
                        'text_ar': 'أي صخر متحول يظهر أعلى درجة من التورق؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'Schist', 'text_ar': 'الشست', 'is_correct': True},
                            {'text': 'Quartzite', 'text_ar': 'الكوارتزيت', 'is_correct': False},
                            {'text': 'Marble', 'text_ar': 'الرخام', 'is_correct': False},
                            {'text': 'Hornfels', 'text_ar': 'الهورنفلس', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What structural features indicate intense deformation during metamorphism?',
                        'text_ar': 'ما الميزات التركيبية التي تشير إلى تشوه شديد أثناء التحول؟',
                        'type': 'qcm_multiple',
                        'points': 6,
                        'choices': [
                            {'text': 'Mylonitic texture', 'text_ar': 'النسيج الميلونيتي', 'is_correct': True},
                            {'text': 'Mineral lineation', 'text_ar': 'الخطية المعدنية', 'is_correct': True},
                            {'text': 'Crenulation cleavage', 'text_ar': 'انفصام التجعد', 'is_correct': True},
                            {'text': 'Porphyroblastic texture', 'text_ar': 'النسيج البورفيروبلاستي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Gneissic banding develops perpendicular to the maximum stress direction.',
                        'text_ar': 'يتطور التحزم النايسي عمودياً على اتجاه الإجهاد الأقصى.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'How can metamorphic textures be used to determine the stress field during metamorphism?',
                        'text_ar': 'كيف يمكن استخدام النسيج المتحول لتحديد مجال الإجهاد أثناء التحول؟',
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