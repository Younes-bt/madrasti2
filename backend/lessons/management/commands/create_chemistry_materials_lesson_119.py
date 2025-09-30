from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Lesson 119: Use of organic and inorganic materials (Physical Sciences Track)'

    def handle(self, *args, **options):
        lesson_id = 119

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
                'title': 'Classification of Materials',
                'title_ar': 'تصنيف المواد',
                'description': 'Understanding the basic classification of organic and inorganic materials',
                'description_ar': 'فهم التصنيف الأساسي للمواد العضوية وغير العضوية',
                'difficulty': 'beginner',
                'points': 10,
                'questions': [
                    {
                        'text': 'What distinguishes organic materials from inorganic materials?',
                        'text_ar': 'ما الذي يميز المواد العضوية عن المواد غير العضوية؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Organic materials primarily contain carbon-hydrogen bonds', 'text_ar': 'المواد العضوية تحتوي بشكل أساسي على روابط كربون-هيدروجين', 'is_correct': True},
                            {'text': 'Organic materials are always synthetic', 'text_ar': 'المواد العضوية دائماً صناعية', 'is_correct': False},
                            {'text': 'Inorganic materials contain only metals', 'text_ar': 'المواد غير العضوية تحتوي فقط على معادن', 'is_correct': False},
                            {'text': 'There is no difference between them', 'text_ar': 'لا يوجد فرق بينهما', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which of the following are examples of organic materials?',
                        'text_ar': 'أي من التالي أمثلة على المواد العضوية؟',
                        'type': 'qcm_multiple',
                        'points': 3,
                        'choices': [
                            {'text': 'Plastics', 'text_ar': 'البلاستيك', 'is_correct': True},
                            {'text': 'Wood', 'text_ar': 'الخشب', 'is_correct': True},
                            {'text': 'Cotton', 'text_ar': 'القطن', 'is_correct': True},
                            {'text': 'Steel', 'text_ar': 'الفولاذ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What are the main sources of organic materials?',
                        'text_ar': 'ما هي المصادر الرئيسية للمواد العضوية؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'Living organisms and fossil fuels', 'text_ar': 'الكائنات الحية والوقود الأحفوري', 'is_correct': True},
                            {'text': 'Only synthetic production', 'text_ar': 'الإنتاج الصناعي فقط', 'is_correct': False},
                            {'text': 'Mineral deposits', 'text_ar': 'الترسبات المعدنية', 'is_correct': False},
                            {'text': 'Atmospheric gases', 'text_ar': 'الغازات الجوية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'All synthetic materials are considered inorganic.',
                        'text_ar': 'جميع المواد الصناعية تعتبر غير عضوية.',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': True},
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Properties and Applications of Organic Materials',
                'title_ar': 'خصائص وتطبيقات المواد العضوية',
                'description': 'Exploring the characteristics and uses of various organic materials',
                'description_ar': 'استكشاف خصائص واستخدامات المواد العضوية المختلفة',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'Which property makes polymers particularly useful in manufacturing?',
                        'text_ar': 'أي خاصية تجعل البوليمرات مفيدة بشكل خاص في التصنيع؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'Their ability to be molded into various shapes and forms', 'text_ar': 'قدرتها على التشكيل في أشكال وصور مختلفة', 'is_correct': True},
                            {'text': 'Their high electrical conductivity', 'text_ar': 'توصيلها الكهربائي العالي', 'is_correct': False},
                            {'text': 'Their magnetic properties', 'text_ar': 'خصائصها المغناطيسية', 'is_correct': False},
                            {'text': 'Their extreme hardness', 'text_ar': 'صلابتها الشديدة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What are the advantages of natural organic fibers?',
                        'text_ar': 'ما هي مزايا الألياف العضوية الطبيعية؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'Biodegradability', 'text_ar': 'القابلية للتحلل البيولوجي', 'is_correct': True},
                            {'text': 'Comfort and breathability', 'text_ar': 'الراحة والتهوية', 'is_correct': True},
                            {'text': 'Renewable source', 'text_ar': 'مصدر متجدد', 'is_correct': True},
                            {'text': 'Higher strength than all synthetic fibers', 'text_ar': 'قوة أعلى من جميع الألياف الصناعية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which organic material is widely used in the automotive industry?',
                        'text_ar': 'أي مادة عضوية تستخدم على نطاق واسع في صناعة السيارات؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'Carbon fiber composites', 'text_ar': 'مركبات ألياف الكربون', 'is_correct': True},
                            {'text': 'Pure cellulose', 'text_ar': 'السليلوز النقي', 'is_correct': False},
                            {'text': 'Natural rubber only', 'text_ar': 'المطاط الطبيعي فقط', 'is_correct': False},
                            {'text': 'Unprocessed wood', 'text_ar': 'الخشب غير المعالج', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What environmental challenges are associated with synthetic organic materials?',
                        'text_ar': 'ما التحديات البيئية المرتبطة بالمواد العضوية الصناعية؟',
                        'type': 'open_short',
                        'points': 5,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Properties and Applications of Inorganic Materials',
                'title_ar': 'خصائص وتطبيقات المواد غير العضوية',
                'description': 'Understanding the characteristics and uses of inorganic materials',
                'description_ar': 'فهم خصائص واستخدامات المواد غير العضوية',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What makes ceramics suitable for high-temperature applications?',
                        'text_ar': 'ما الذي يجعل السيراميك مناسباً للتطبيقات عالية الحرارة؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'High melting point and thermal stability', 'text_ar': 'نقطة انصهار عالية واستقرار حراري', 'is_correct': True},
                            {'text': 'Low density', 'text_ar': 'كثافة منخفضة', 'is_correct': False},
                            {'text': 'High electrical conductivity', 'text_ar': 'توصيل كهربائي عالي', 'is_correct': False},
                            {'text': 'Flexibility', 'text_ar': 'المرونة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which properties make metals valuable in construction?',
                        'text_ar': 'أي الخصائص تجعل المعادن قيمة في البناء؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'High strength and durability', 'text_ar': 'قوة ومتانة عالية', 'is_correct': True},
                            {'text': 'Malleability and ductility', 'text_ar': 'القابلية للطرق والسحب', 'is_correct': True},
                            {'text': 'Corrosion resistance (with treatment)', 'text_ar': 'مقاومة التآكل (مع المعالجة)', 'is_correct': True},
                            {'text': 'Low thermal conductivity', 'text_ar': 'توصيل حراري منخفض', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What are semiconductors primarily used for?',
                        'text_ar': 'ما الاستخدام الأساسي لأشباه الموصلات؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'Electronic devices and solar cells', 'text_ar': 'الأجهزة الإلكترونية والخلايا الشمسية', 'is_correct': True},
                            {'text': 'Building foundations', 'text_ar': 'أسس المباني', 'is_correct': False},
                            {'text': 'Food packaging', 'text_ar': 'تغليف الطعام', 'is_correct': False},
                            {'text': 'Textile production', 'text_ar': 'إنتاج المنسوجات', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Glass is considered a crystalline solid.',
                        'text_ar': 'الزجاج يعتبر مادة صلبة بلورية.',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': True},
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Explain the significance of alloys in modern technology.',
                        'text_ar': 'اشرح أهمية السبائك في التكنولوجيا الحديثة.',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Sustainable Material Use and Recycling',
                'title_ar': 'الاستخدام المستدام للمواد والتدوير',
                'description': 'Exploring sustainable practices in material use and waste management',
                'description_ar': 'استكشاف الممارسات المستدامة في استخدام المواد وإدارة النفايات',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'What is the primary goal of the circular economy in materials management?',
                        'text_ar': 'ما هو الهدف الأساسي للاقتصاد الدائري في إدارة المواد؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'Minimize waste and maximize material reuse and recycling', 'text_ar': 'تقليل النفايات وزيادة إعادة الاستخدام والتدوير للمواد', 'is_correct': True},
                            {'text': 'Increase production of new materials', 'text_ar': 'زيادة إنتاج مواد جديدة', 'is_correct': False},
                            {'text': 'Replace all organic materials with inorganic ones', 'text_ar': 'استبدال جميع المواد العضوية بغير عضوية', 'is_correct': False},
                            {'text': 'Eliminate all synthetic materials', 'text_ar': 'إلغاء جميع المواد الصناعية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which materials are most challenging to recycle?',
                        'text_ar': 'أي المواد الأكثر تحدياً في إعادة التدوير؟',
                        'type': 'qcm_multiple',
                        'points': 5,
                        'choices': [
                            {'text': 'Composite materials', 'text_ar': 'المواد المركبة', 'is_correct': True},
                            {'text': 'Thermoset plastics', 'text_ar': 'البلاستيك المتصلد بالحرارة', 'is_correct': True},
                            {'text': 'Mixed material products', 'text_ar': 'المنتجات متعددة المواد', 'is_correct': True},
                            {'text': 'Pure aluminum', 'text_ar': 'الألومنيوم النقي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What are the benefits of biodegradable materials?',
                        'text_ar': 'ما هي فوائد المواد القابلة للتحلل البيولوجي؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'They break down naturally without harmful environmental impact', 'text_ar': 'تتحلل طبيعياً دون تأثير بيئي ضار', 'is_correct': True},
                            {'text': 'They are always stronger than synthetic materials', 'text_ar': 'دائماً أقوى من المواد الصناعية', 'is_correct': False},
                            {'text': 'They are cheaper to produce', 'text_ar': 'أرخص في الإنتاج', 'is_correct': False},
                            {'text': 'They never decompose', 'text_ar': 'لا تتحلل أبداً', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The concept of cradle-to-cradle design considers the entire lifecycle of materials.',
                        'text_ar': 'مفهوم التصميم من المهد إلى المهد يعتبر دورة الحياة الكاملة للمواد.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Analyze the environmental and economic trade-offs between using natural vs. synthetic materials.',
                        'text_ar': 'حلل التبادلات البيئية والاقتصادية بين استخدام المواد الطبيعية مقابل الصناعية.',
                        'type': 'open_short',
                        'points': 4,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Future Trends in Material Science',
                'title_ar': 'الاتجاهات المستقبلية في علوم المواد',
                'description': 'Exploring emerging materials and future technologies',
                'description_ar': 'استكشاف المواد الناشئة والتقنيات المستقبلية',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'What are smart materials?',
                        'text_ar': 'ما هي المواد الذكية؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'Materials that can change their properties in response to external stimuli', 'text_ar': 'مواد يمكنها تغيير خصائصها استجابة للمحفزات الخارجية', 'is_correct': True},
                            {'text': 'Materials that contain computer chips', 'text_ar': 'مواد تحتوي على رقائق الكمبيوتر', 'is_correct': False},
                            {'text': 'Materials that are artificially intelligent', 'text_ar': 'مواد ذكية اصطناعياً', 'is_correct': False},
                            {'text': 'Materials that never wear out', 'text_ar': 'مواد لا تتآكل أبداً', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which emerging technologies rely heavily on advanced materials?',
                        'text_ar': 'أي التقنيات الناشئة تعتمد بكثرة على المواد المتقدمة؟',
                        'type': 'qcm_multiple',
                        'points': 5,
                        'choices': [
                            {'text': 'Quantum computing', 'text_ar': 'الحوسبة الكمية', 'is_correct': True},
                            {'text': 'Renewable energy systems', 'text_ar': 'أنظمة الطاقة المتجددة', 'is_correct': True},
                            {'text': 'Nanotechnology', 'text_ar': 'تكنولوجيا النانو', 'is_correct': True},
                            {'text': 'Traditional printing', 'text_ar': 'الطباعة التقليدية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What potential do biomaterials have in medical applications?',
                        'text_ar': 'ما الإمكانات التي تتمتع بها المواد الحيوية في التطبيقات الطبية؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'Biocompatibility and integration with living tissue', 'text_ar': 'التوافق الحيوي والاندماج مع الأنسجة الحية', 'is_correct': True},
                            {'text': 'Lower cost than traditional materials', 'text_ar': 'تكلفة أقل من المواد التقليدية', 'is_correct': False},
                            {'text': 'Higher strength than metals', 'text_ar': 'قوة أعلى من المعادن', 'is_correct': False},
                            {'text': 'No special properties', 'text_ar': 'لا توجد خصائص خاصة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Graphene is considered a wonder material due to its exceptional properties.',
                        'text_ar': 'الجرافين يعتبر مادة عجيبة بسبب خصائصه الاستثنائية.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Discuss the potential impact of 3D printing on material use and manufacturing.',
                        'text_ar': 'ناقش التأثير المحتمل للطباعة ثلاثية الأبعاد على استخدام المواد والتصنيع.',
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