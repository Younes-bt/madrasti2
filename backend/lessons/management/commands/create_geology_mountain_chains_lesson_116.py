from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Lesson 116: Recent mountain chains and their relationship with plate tectonics'

    def handle(self, *args, **options):
        lesson_id = 116

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
                'title': 'Plate Tectonics Fundamentals',
                'title_ar': 'أساسيات تكتونية الصفائح',
                'description': 'Understanding the basic principles of plate tectonics and mountain formation',
                'description_ar': 'فهم المبادئ الأساسية لتكتونية الصفائح وتكوين الجبال',
                'difficulty': 'beginner',
                'points': 10,
                'questions': [
                    {
                        'text': 'What is the primary driving force behind plate tectonics?',
                        'text_ar': 'ما هي القوة المحركة الأساسية وراء تكتونية الصفائح؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Convection currents in the mantle', 'text_ar': 'تيارات الحمل الحراري في الوشاح', 'is_correct': True},
                            {'text': 'Solar radiation', 'text_ar': 'الإشعاع الشمسي', 'is_correct': False},
                            {'text': 'Gravitational pull of the moon', 'text_ar': 'الجذب الجاذبي للقمر', 'is_correct': False},
                            {'text': 'Magnetic field variations', 'text_ar': 'تغيرات المجال المغناطيسي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which type of plate boundary is primarily responsible for mountain formation?',
                        'text_ar': 'أي نوع من حدود الصفائح مسؤول بشكل أساسي عن تكوين الجبال؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Convergent boundaries', 'text_ar': 'الحدود المتقاربة', 'is_correct': True},
                            {'text': 'Divergent boundaries', 'text_ar': 'الحدود المتباعدة', 'is_correct': False},
                            {'text': 'Transform boundaries', 'text_ar': 'الحدود التحويلية', 'is_correct': False},
                            {'text': 'Passive boundaries', 'text_ar': 'الحدود السلبية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The lithosphere consists of which two main layers?',
                        'text_ar': 'يتكون الغلاف الصخري من أي طبقتين رئيسيتين؟',
                        'type': 'qcm_multiple',
                        'points': 3,
                        'choices': [
                            {'text': 'Crust', 'text_ar': 'القشرة', 'is_correct': True},
                            {'text': 'Upper mantle', 'text_ar': 'الوشاح العلوي', 'is_correct': True},
                            {'text': 'Lower mantle', 'text_ar': 'الوشاح السفلي', 'is_correct': False},
                            {'text': 'Outer core', 'text_ar': 'النواة الخارجية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Recent mountain chains are typically formed within the last 65 million years.',
                        'text_ar': 'السلاسل الجبلية الحديثة تتكون عادة خلال آخر 65 مليون سنة.',
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
                'title': 'Types of Mountain Formation',
                'title_ar': 'أنواع تكوين الجبال',
                'description': 'Exploring different mechanisms of mountain formation at convergent boundaries',
                'description_ar': 'استكشاف آليات مختلفة لتكوين الجبال عند الحدود المتقاربة',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What type of mountains form when oceanic and continental plates collide?',
                        'text_ar': 'أي نوع من الجبال يتكون عندما تصطدم الصفائح المحيطية والقارية؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'Volcanic arcs', 'text_ar': 'الأقواس البركانية', 'is_correct': True},
                            {'text': 'Fold mountains', 'text_ar': 'الجبال المطوية', 'is_correct': False},
                            {'text': 'Block mountains', 'text_ar': 'الجبال الكتلية', 'is_correct': False},
                            {'text': 'Dome mountains', 'text_ar': 'الجبال القبابية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which mountain range exemplifies continent-continent collision?',
                        'text_ar': 'أي سلسلة جبلية تمثل مثالاً على تصادم قارة بقارة؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'Himalayas', 'text_ar': 'جبال الهيمالايا', 'is_correct': True},
                            {'text': 'Andes', 'text_ar': 'جبال الأنديز', 'is_correct': False},
                            {'text': 'Rocky Mountains', 'text_ar': 'الجبال الصخرية', 'is_correct': False},
                            {'text': 'Japanese Alps', 'text_ar': 'جبال الألب اليابانية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'In ocean-ocean convergence, what geological features are commonly formed?',
                        'text_ar': 'في تقارب المحيط-المحيط، ما هي الميزات الجيولوجية التي تتكون عادة؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'Volcanic island arcs', 'text_ar': 'أقواس الجزر البركانية', 'is_correct': True},
                            {'text': 'Deep ocean trenches', 'text_ar': 'الخنادق المحيطية العميقة', 'is_correct': True},
                            {'text': 'Mid-ocean ridges', 'text_ar': 'الحواف المحيطية المتوسطة', 'is_correct': False},
                            {'text': 'Continental shelves', 'text_ar': 'الرفوف القارية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Describe the process of subduction and its role in mountain formation.',
                        'text_ar': 'صف عملية الاندساس ودورها في تكوين الجبال.',
                        'type': 'open_short',
                        'points': 5,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'The Alpine-Himalayan Belt',
                'title_ar': 'حزام جبال الألب والهيمالايا',
                'description': 'Analyzing the formation and characteristics of the Alpine-Himalayan mountain system',
                'description_ar': 'تحليل تكوين وخصائص نظام جبال الألب والهيمالايا',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'The Alpine-Himalayan belt extends from which regions?',
                        'text_ar': 'يمتد حزام جبال الألب والهيمالايا من أي مناطق؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'Western Europe to Southeast Asia', 'text_ar': 'أوروبا الغربية إلى جنوب شرق آسيا', 'is_correct': True},
                            {'text': 'North America to South America', 'text_ar': 'أمريكا الشمالية إلى أمريكا الجنوبية', 'is_correct': False},
                            {'text': 'Africa to Australia', 'text_ar': 'أفريقيا إلى أستراليا', 'is_correct': False},
                            {'text': 'Siberia to Antarctica', 'text_ar': 'سيبيريا إلى القارة القطبية الجنوبية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What was the ancient ocean that closed to form the Alpine-Himalayan belt?',
                        'text_ar': 'ما هو المحيط القديم الذي انغلق ليشكل حزام جبال الألب والهيمالايا؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'Tethys Ocean', 'text_ar': 'محيط تيثيس', 'is_correct': True},
                            {'text': 'Panthalassa Ocean', 'text_ar': 'محيط بانثالاسا', 'is_correct': False},
                            {'text': 'Iapetus Ocean', 'text_ar': 'محيط إيابيتوس', 'is_correct': False},
                            {'text': 'Rheic Ocean', 'text_ar': 'محيط ريك', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which geological periods saw the main phases of Alpine orogeny?',
                        'text_ar': 'أي الفترات الجيولوجية شهدت المراحل الرئيسية لتكوين جبال الألب؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'Cretaceous', 'text_ar': 'الطباشيري', 'is_correct': True},
                            {'text': 'Paleogene', 'text_ar': 'الباليوجيني', 'is_correct': True},
                            {'text': 'Triassic', 'text_ar': 'الترياسي', 'is_correct': False},
                            {'text': 'Jurassic', 'text_ar': 'الجوراسي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The Himalayas continue to rise today due to ongoing continental collision.',
                        'text_ar': 'تستمر جبال الهيمالايا في الارتفاع اليوم بسبب التصادم القاري المستمر.',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Explain the role of the Indian plate collision in Himalayan formation.',
                        'text_ar': 'اشرح دور تصادم الصفيحة الهندية في تكوين جبال الهيمالايا.',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Circum-Pacific Ring of Fire',
                'title_ar': 'حلقة النار المحيطة بالمحيط الهادئ',
                'description': 'Understanding the volcanic mountain chains around the Pacific Ocean',
                'description_ar': 'فهم السلاسل الجبلية البركانية حول المحيط الهادئ',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What percentage of the world\'s active volcanoes are located in the Ring of Fire?',
                        'text_ar': 'ما نسبة البراكين النشطة في العالم الموجودة في حلقة النار؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'About 75%', 'text_ar': 'حوالي 75%', 'is_correct': True},
                            {'text': 'About 50%', 'text_ar': 'حوالي 50%', 'is_correct': False},
                            {'text': 'About 25%', 'text_ar': 'حوالي 25%', 'is_correct': False},
                            {'text': 'About 90%', 'text_ar': 'حوالي 90%', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which mountain range in South America is part of the Ring of Fire?',
                        'text_ar': 'أي سلسلة جبلية في أمريكا الجنوبية جزء من حلقة النار؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'Andes Mountains', 'text_ar': 'جبال الأنديز', 'is_correct': True},
                            {'text': 'Guiana Highlands', 'text_ar': 'مرتفعات غيانا', 'is_correct': False},
                            {'text': 'Brazilian Highlands', 'text_ar': 'مرتفعات البرازيل', 'is_correct': False},
                            {'text': 'Patagonian Mountains', 'text_ar': 'جبال باتاغونيا', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What geological processes contribute to Ring of Fire formation?',
                        'text_ar': 'ما هي العمليات الجيولوجية التي تساهم في تكوين حلقة النار؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'Subduction of oceanic plates', 'text_ar': 'اندساس الصفائح المحيطية', 'is_correct': True},
                            {'text': 'Volcanic activity', 'text_ar': 'النشاط البركاني', 'is_correct': True},
                            {'text': 'Continental drift', 'text_ar': 'انجراف القارات', 'is_correct': False},
                            {'text': 'Glacial erosion', 'text_ar': 'التعرية الجليدية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The Ring of Fire is characterized by frequent earthquakes and tsunamis.',
                        'text_ar': 'تتميز حلقة النار بالزلازل المتكررة وأمواج التسونامي.',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Compare the formation mechanisms of the Andes and the Japanese Alps.',
                        'text_ar': 'قارن بين آليات تكوين جبال الأنديز وجبال الألب اليابانية.',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Modern Plate Tectonic Evidence',
                'title_ar': 'الأدلة الحديثة على تكتونية الصفائح',
                'description': 'Examining contemporary evidence supporting plate tectonic theory and mountain formation',
                'description_ar': 'فحص الأدلة المعاصرة التي تدعم نظرية تكتونية الصفائح وتكوين الجبال',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'Which technology provides the most accurate measurements of plate movement?',
                        'text_ar': 'أي تقنية توفر أدق القياسات لحركة الصفائح؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'GPS satellite systems', 'text_ar': 'أنظمة الأقمار الصناعية GPS', 'is_correct': True},
                            {'text': 'Seismographs', 'text_ar': 'أجهزة رصد الزلازل', 'is_correct': False},
                            {'text': 'Magnetic compasses', 'text_ar': 'البوصلات المغناطيسية', 'is_correct': False},
                            {'text': 'Radiocarbon dating', 'text_ar': 'التأريخ بالكربون المشع', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the average rate of Himalayan uplift per year?',
                        'text_ar': 'ما هو المعدل السنوي المتوسط لارتفاع جبال الهيمالايا؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': '5-10 millimeters', 'text_ar': '5-10 مليمتر', 'is_correct': True},
                            {'text': '1-2 centimeters', 'text_ar': '1-2 سنتيمتر', 'is_correct': False},
                            {'text': '10-15 centimeters', 'text_ar': '10-15 سنتيمتر', 'is_correct': False},
                            {'text': '1-2 millimeters', 'text_ar': '1-2 مليمتر', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which methods confirm active mountain building processes?',
                        'text_ar': 'أي الطرق تؤكد عمليات بناء الجبال النشطة؟',
                        'type': 'qcm_multiple',
                        'points': 6,
                        'choices': [
                            {'text': 'Satellite geodesy', 'text_ar': 'الجيوديسيا بالأقمار الصناعية', 'is_correct': True},
                            {'text': 'Earthquake monitoring', 'text_ar': 'مراقبة الزلازل', 'is_correct': True},
                            {'text': 'Volcanic activity tracking', 'text_ar': 'تتبع النشاط البركاني', 'is_correct': True},
                            {'text': 'Fossil correlation', 'text_ar': 'ربط الأحافير', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Modern technology shows that some mountain ranges are still actively growing.',
                        'text_ar': 'تُظهر التكنولوجيا الحديثة أن بعض السلاسل الجبلية لا تزال تنمو بنشاط.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Analyze how paleomagnetic evidence supports the theory of continental drift and mountain formation.',
                        'text_ar': 'حلل كيف تدعم الأدلة المغناطيسية القديمة نظرية انجراف القارات وتكوين الجبال.',
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