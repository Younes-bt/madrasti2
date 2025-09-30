from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Lesson 118: Granitization and its relationship with metamorphism'

    def handle(self, *args, **options):
        lesson_id = 118

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
                'title': 'Introduction to Granitization',
                'title_ar': 'مقدمة في الجرنتة',
                'description': 'Understanding the concept and processes of granitization',
                'description_ar': 'فهم مفهوم وعمليات الجرنتة',
                'difficulty': 'beginner',
                'points': 10,
                'questions': [
                    {
                        'text': 'What is granitization?',
                        'text_ar': 'ما هي الجرنتة؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'The transformation of non-granitic rocks into granite-like rocks through metasomatism', 'text_ar': 'تحول الصخور غير الجرانيتية إلى صخور شبيهة بالجرانيت عبر التبدل الكيميائي', 'is_correct': True},
                            {'text': 'The weathering of granite into sediments', 'text_ar': 'تعرية الجرانيت إلى رواسب', 'is_correct': False},
                            {'text': 'The crystallization of granite from magma', 'text_ar': 'تبلور الجرانيت من الصهارة', 'is_correct': False},
                            {'text': 'The folding of granite layers', 'text_ar': 'طي طبقات الجرانيت', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which process is fundamental to granitization?',
                        'text_ar': 'أي عملية أساسية في الجرنتة؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Metasomatism', 'text_ar': 'التبدل الكيميائي', 'is_correct': True},
                            {'text': 'Mechanical weathering', 'text_ar': 'التجوية الميكانيكية', 'is_correct': False},
                            {'text': 'Sedimentary deposition', 'text_ar': 'الترسب الرسوبي', 'is_correct': False},
                            {'text': 'Volcanic eruption', 'text_ar': 'الثوران البركاني', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What distinguishes granitization from normal metamorphism?',
                        'text_ar': 'ما الذي يميز الجرنتة عن التحول العادي؟',
                        'type': 'qcm_multiple',
                        'points': 3,
                        'choices': [
                            {'text': 'Chemical exchange with external fluids', 'text_ar': 'التبادل الكيميائي مع السوائل الخارجية', 'is_correct': True},
                            {'text': 'Addition and removal of chemical components', 'text_ar': 'إضافة وإزالة المكونات الكيميائية', 'is_correct': True},
                            {'text': 'Change in bulk composition', 'text_ar': 'تغيير في التركيب الكتلي', 'is_correct': True},
                            {'text': 'Preservation of original composition', 'text_ar': 'الحفاظ على التركيب الأصلي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Granitization involves the complete melting of the parent rock.',
                        'text_ar': 'تتضمن الجرنتة الانصهار الكامل للصخر الأصلي.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': True},
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Mechanisms of Granitization',
                'title_ar': 'آليات الجرنتة',
                'description': 'Exploring the chemical and physical processes involved in granitization',
                'description_ar': 'استكشاف العمليات الكيميائية والفيزيائية المشاركة في الجرنتة',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'Which fluids are primarily involved in granitization processes?',
                        'text_ar': 'أي السوائل تشارك بشكل أساسي في عمليات الجرنتة؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'Silica and alkali-rich hydrothermal fluids', 'text_ar': 'السوائل الحرارية المائية الغنية بالسيليكا والقلويات', 'is_correct': True},
                            {'text': 'Pure water', 'text_ar': 'الماء النقي', 'is_correct': False},
                            {'text': 'Carbon dioxide', 'text_ar': 'ثاني أكسيد الكربون', 'is_correct': False},
                            {'text': 'Sulfur compounds', 'text_ar': 'مركبات الكبريت', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the role of temperature in granitization?',
                        'text_ar': 'ما هو دور درجة الحرارة في الجرنتة؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'High temperatures facilitate chemical reactions and fluid mobility', 'text_ar': 'الحرارة العالية تسهل التفاعلات الكيميائية وحركة السوائل', 'is_correct': True},
                            {'text': 'Low temperatures are required for granitization', 'text_ar': 'الحرارة المنخفضة مطلوبة للجرنتة', 'is_correct': False},
                            {'text': 'Temperature has no effect on the process', 'text_ar': 'درجة الحرارة ليس لها تأثير على العملية', 'is_correct': False},
                            {'text': 'Only surface temperatures are involved', 'text_ar': 'فقط درجات حرارة السطح تشارك', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which chemical changes occur during granitization?',
                        'text_ar': 'أي التغيرات الكيميائية تحدث أثناء الجرنتة؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'Addition of potassium and sodium', 'text_ar': 'إضافة البوتاسيوم والصوديوم', 'is_correct': True},
                            {'text': 'Introduction of silica', 'text_ar': 'إدخال السيليكا', 'is_correct': True},
                            {'text': 'Removal of calcium and magnesium', 'text_ar': 'إزالة الكالسيوم والمغنيسيوم', 'is_correct': True},
                            {'text': 'Addition of iron', 'text_ar': 'إضافة الحديد', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Describe the difference between front-controlled and infiltration-controlled granitization.',
                        'text_ar': 'صف الاختلاف بين الجرنتة المتحكم بها من الجبهة والمتحكم بها بالتسلل.',
                        'type': 'open_short',
                        'points': 5,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Evidence and Recognition of Granitization',
                'title_ar': 'أدلة والتعرف على الجرنتة',
                'description': 'Identifying field and microscopic evidence of granitization',
                'description_ar': 'تحديد الأدلة الحقلية والمجهرية للجرنتة',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What field evidence suggests granitization has occurred?',
                        'text_ar': 'ما الأدلة الحقلية التي تشير إلى حدوث جرنتة؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'Gradual transition from unaltered rock to granite-like rock', 'text_ar': 'تحول تدريجي من صخر غير متغير إلى صخر شبيه بالجرانيت', 'is_correct': True},
                            {'text': 'Sharp contacts between different rock types', 'text_ar': 'تلامسات حادة بين أنواع الصخور المختلفة', 'is_correct': False},
                            {'text': 'Presence of volcanic glass', 'text_ar': 'وجود الزجاج البركاني', 'is_correct': False},
                            {'text': 'Sedimentary layering', 'text_ar': 'التطبق الرسوبي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which microscopic features indicate granitization?',
                        'text_ar': 'أي الميزات المجهرية تشير إلى الجرنتة؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'Replacement textures', 'text_ar': 'نسيج الاستبدال', 'is_correct': True},
                            {'text': 'Relict minerals from original rock', 'text_ar': 'معادن متبقية من الصخر الأصلي', 'is_correct': True},
                            {'text': 'Compositional zoning in feldspars', 'text_ar': 'التنطق التركيبي في الفلسبارات', 'is_correct': True},
                            {'text': 'Perfect crystal faces', 'text_ar': 'وجوه بلورية مثالية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is a migmatite?',
                        'text_ar': 'ما هو الميجماتيت؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'A mixed rock showing both metamorphic and igneous characteristics', 'text_ar': 'صخر مختلط يظهر خصائص متحولة ونارية', 'is_correct': True},
                            {'text': 'A pure granite', 'text_ar': 'جرانيت خالص', 'is_correct': False},
                            {'text': 'A sedimentary rock', 'text_ar': 'صخر رسوبي', 'is_correct': False},
                            {'text': 'A volcanic glass', 'text_ar': 'زجاج بركاني', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Ghost structures from the original rock are always completely destroyed during granitization.',
                        'text_ar': 'التراكيب الشبحية من الصخر الأصلي تُدمر دائماً بالكامل أثناء الجرنتة.',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': True},
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'How can geochemical analysis help distinguish between primary granite and granitized rock?',
                        'text_ar': 'كيف يمكن للتحليل الجيوكيميائي أن يساعد في التمييز بين الجرانيت الأولي والصخر المُجرنت؟',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Granitization in Tectonic Settings',
                'title_ar': 'الجرنتة في البيئات التكتونية',
                'description': 'Understanding granitization in different geological environments',
                'description_ar': 'فهم الجرنتة في البيئات الجيولوجية المختلفة',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'In which tectonic setting is granitization most commonly observed?',
                        'text_ar': 'في أي بيئة تكتونية تُلاحظ الجرنتة بشكل أكثر شيوعاً؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'Continental collision zones and orogenic belts', 'text_ar': 'مناطق التصادم القاري والأحزمة الجبلية', 'is_correct': True},
                            {'text': 'Mid-ocean ridges', 'text_ar': 'حواف المحيط المتوسطة', 'is_correct': False},
                            {'text': 'Transform fault zones', 'text_ar': 'مناطق الصدوع التحويلية', 'is_correct': False},
                            {'text': 'Passive continental margins', 'text_ar': 'الحواف القارية السلبية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What role do granite intrusions play in granitization?',
                        'text_ar': 'ما هو دور التداخلات الجرانيتية في الجرنتة؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'They provide heat and metasomatic fluids for the process', 'text_ar': 'توفر الحرارة والسوائل المبدلة كيميائياً للعملية', 'is_correct': True},
                            {'text': 'They prevent granitization from occurring', 'text_ar': 'تمنع حدوث الجرنتة', 'is_correct': False},
                            {'text': 'They are not related to granitization', 'text_ar': 'غير مرتبطة بالجرنتة', 'is_correct': False},
                            {'text': 'They only provide mechanical stress', 'text_ar': 'توفر فقط الإجهاد الميكانيكي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which factors control the extent of granitization?',
                        'text_ar': 'أي العوامل تتحكم في مدى الجرنتة؟',
                        'type': 'qcm_multiple',
                        'points': 6,
                        'choices': [
                            {'text': 'Temperature and pressure conditions', 'text_ar': 'ظروف درجة الحرارة والضغط', 'is_correct': True},
                            {'text': 'Fluid composition and availability', 'text_ar': 'تركيب السوائل وتوفرها', 'is_correct': True},
                            {'text': 'Permeability of the host rock', 'text_ar': 'نفاذية الصخر المضيف', 'is_correct': True},
                            {'text': 'Surface weathering rates', 'text_ar': 'معدلات التجوية السطحية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Granitization can occur at temperatures below the granite solidus.',
                        'text_ar': 'يمكن أن تحدث الجرنتة في درجات حرارة أقل من خط الانصهار الجرانيتي.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Explain the relationship between regional metamorphism and granitization in orogenic belts.',
                        'text_ar': 'اشرح العلاقة بين التحول الإقليمي والجرنتة في الأحزمة الجبلية.',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Economic and Scientific Significance',
                'title_ar': 'الأهمية الاقتصادية والعلمية',
                'description': 'Exploring the importance of granitization in geology and resource formation',
                'description_ar': 'استكشاف أهمية الجرنتة في الجيولوجيا وتكوين الموارد',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'How does granitization contribute to ore formation?',
                        'text_ar': 'كيف تساهم الجرنتة في تكوين الخامات؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'Metasomatic fluids can transport and concentrate valuable metals', 'text_ar': 'السوائل المبدلة كيميائياً يمكنها نقل وتركيز المعادن القيمة', 'is_correct': True},
                            {'text': 'It destroys all mineral deposits', 'text_ar': 'تدمر جميع الترسبات المعدنية', 'is_correct': False},
                            {'text': 'It only produces building stones', 'text_ar': 'تنتج فقط أحجار البناء', 'is_correct': False},
                            {'text': 'It has no economic significance', 'text_ar': 'ليس لها أهمية اقتصادية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which minerals are commonly associated with granitization zones?',
                        'text_ar': 'أي المعادن ترتبط عادة بمناطق الجرنتة؟',
                        'type': 'qcm_multiple',
                        'points': 5,
                        'choices': [
                            {'text': 'Quartz', 'text_ar': 'الكوارتز', 'is_correct': True},
                            {'text': 'Feldspar', 'text_ar': 'الفلسبار', 'is_correct': True},
                            {'text': 'Mica', 'text_ar': 'الميكا', 'is_correct': True},
                            {'text': 'Olivine', 'text_ar': 'الأوليفين', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the significance of granitization in understanding Earth\'s evolution?',
                        'text_ar': 'ما أهمية الجرنتة في فهم تطور الأرض؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'It helps explain continental crust formation and differentiation', 'text_ar': 'تساعد في شرح تكوين وتمايز القشرة القارية', 'is_correct': True},
                            {'text': 'It explains oceanic crust formation', 'text_ar': 'تشرح تكوين القشرة المحيطية', 'is_correct': False},
                            {'text': 'It has no relevance to Earth evolution', 'text_ar': 'ليس لها صلة بتطور الأرض', 'is_correct': False},
                            {'text': 'It only affects surface processes', 'text_ar': 'تؤثر فقط على العمليات السطحية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Granitization processes are important for understanding uranium and thorium distribution in the continental crust.',
                        'text_ar': 'عمليات الجرنتة مهمة لفهم توزيع اليورانيوم والثوريوم في القشرة القارية.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Discuss the debate between magmatic and metasomatic origins of granite.',
                        'text_ar': 'ناقش الجدل بين الأصول الصهارية والمبدلة كيميائياً للجرانيت.',
                        'type': 'open_short',
                        'points': 4,
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