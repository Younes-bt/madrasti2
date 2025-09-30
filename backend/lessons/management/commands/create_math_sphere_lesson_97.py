from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Lesson 97: The sphere'

    def handle(self, *args, **options):
        lesson_id = 97

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
                'title': 'Equation of a Sphere',
                'title_ar': 'معادلة الكرة',
                'description': 'Understanding the standard and general equations of a sphere',
                'description_ar': 'فهم المعادلات المعيارية والعامة للكرة',
                'difficulty': 'beginner',
                'points': 10,
                'questions': [
                    {
                        'text': 'What is the standard equation of a sphere with center (h, k, l) and radius r?',
                        'text_ar': 'ما هي المعادلة المعيارية للكرة بمركز (h, k, l) ونصف قطر r؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': '(x - h)² + (y - k)² + (z - l)² = r²', 'text_ar': '(x - h)² + (y - k)² + (z - l)² = r²', 'is_correct': True},
                            {'text': '(x + h)² + (y + k)² + (z + l)² = r²', 'text_ar': '(x + h)² + (y + k)² + (z + l)² = r²', 'is_correct': False},
                            {'text': 'x² + y² + z² = r²', 'text_ar': 'x² + y² + z² = r²', 'is_correct': False},
                            {'text': '(x - h) + (y - k) + (z - l) = r', 'text_ar': '(x - h) + (y - k) + (z - l) = r', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the equation of a unit sphere centered at the origin?',
                        'text_ar': 'ما معادلة كرة الوحدة بمركز عند الأصل؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'x² + y² + z² = 1', 'text_ar': 'x² + y² + z² = 1', 'is_correct': True},
                            {'text': 'x² + y² + z² = 0', 'text_ar': 'x² + y² + z² = 0', 'is_correct': False},
                            {'text': 'x + y + z = 1', 'text_ar': 'x + y + z = 1', 'is_correct': False},
                            {'text': '|x| + |y| + |z| = 1', 'text_ar': '|x| + |y| + |z| = 1', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which parameters completely define a sphere?',
                        'text_ar': 'أي المعاملات تحدد الكرة بالكامل؟',
                        'type': 'qcm_multiple',
                        'points': 3,
                        'choices': [
                            {'text': 'Center coordinates (h, k, l)', 'text_ar': 'إحداثيات المركز (h, k, l)', 'is_correct': True},
                            {'text': 'Radius r', 'text_ar': 'نصف القطر r', 'is_correct': True},
                            {'text': 'Four points on the sphere', 'text_ar': 'أربع نقاط على الكرة', 'is_correct': True},
                            {'text': 'Only the diameter', 'text_ar': 'القطر فقط', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'A sphere is a 3D analogue of a circle in 2D.',
                        'text_ar': 'الكرة هي النظير ثلاثي الأبعاد للدائرة في البعدين.',
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
                'title': 'Properties and Measurements',
                'title_ar': 'الخصائص والقياسات',
                'description': 'Calculating surface area, volume, and other properties of spheres',
                'description_ar': 'حساب المساحة السطحية والحجم وخصائص أخرى للكرات',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What is the formula for the volume of a sphere with radius r?',
                        'text_ar': 'ما هي صيغة حجم الكرة بنصف قطر r؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': '(4/3)πr³', 'text_ar': '(4/3)πr³', 'is_correct': True},
                            {'text': '4πr²', 'text_ar': '4πr²', 'is_correct': False},
                            {'text': 'πr²', 'text_ar': 'πr²', 'is_correct': False},
                            {'text': '2πr³', 'text_ar': '2πr³', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the formula for the surface area of a sphere?',
                        'text_ar': 'ما هي صيغة المساحة السطحية للكرة؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': '4πr²', 'text_ar': '4πr²', 'is_correct': True},
                            {'text': '(4/3)πr³', 'text_ar': '(4/3)πr³', 'is_correct': False},
                            {'text': '2πr²', 'text_ar': '2πr²', 'is_correct': False},
                            {'text': 'πr²', 'text_ar': 'πr²', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'How do changes in radius affect sphere properties?',
                        'text_ar': 'كيف تؤثر التغييرات في نصف القطر على خصائص الكرة؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'Volume scales as r³', 'text_ar': 'الحجم يتغير مع r³', 'is_correct': True},
                            {'text': 'Surface area scales as r²', 'text_ar': 'المساحة السطحية تتغير مع r²', 'is_correct': True},
                            {'text': 'Doubling radius multiplies volume by 8', 'text_ar': 'مضاعفة نصف القطر تضرب الحجم في 8', 'is_correct': True},
                            {'text': 'Volume and surface area change equally', 'text_ar': 'الحجم والمساحة السطحية تتغير بالتساوي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Calculate the volume and surface area of a sphere with radius 3 units.',
                        'text_ar': 'احسب الحجم والمساحة السطحية لكرة بنصف قطر 3 وحدات.',
                        'type': 'open_short',
                        'points': 5,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Intersections with Lines and Planes',
                'title_ar': 'التقاطعات مع الخطوط والمستويات',
                'description': 'Understanding how spheres intersect with lines, planes, and other spheres',
                'description_ar': 'فهم كيفية تقاطع الكرات مع الخطوط والمستويات والكرات الأخرى',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'How many intersection points can a line have with a sphere?',
                        'text_ar': 'كم نقطة تقاطع يمكن أن يكون للخط مع الكرة؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': '0, 1, or 2 points', 'text_ar': '0 أو 1 أو 2 نقطة', 'is_correct': True},
                            {'text': 'Always 2 points', 'text_ar': 'دائماً نقطتان', 'is_correct': False},
                            {'text': 'Always 1 point', 'text_ar': 'دائماً نقطة واحدة', 'is_correct': False},
                            {'text': 'Infinitely many points', 'text_ar': 'نقاط لانهائية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the intersection of a plane and a sphere?',
                        'text_ar': 'ما هو تقاطع المستوى مع الكرة؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'A circle (if they intersect)', 'text_ar': 'دائرة (إذا تقاطعا)', 'is_correct': True},
                            {'text': 'An ellipse', 'text_ar': 'إهليلج', 'is_correct': False},
                            {'text': 'A parabola', 'text_ar': 'قطع مكافئ', 'is_correct': False},
                            {'text': 'A straight line', 'text_ar': 'خط مستقيم', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What determines whether a plane intersects, is tangent to, or misses a sphere?',
                        'text_ar': 'ما الذي يحدد إذا كان المستوى يتقاطع أو يماس أو يخطئ الكرة؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'Distance from sphere center to plane', 'text_ar': 'المسافة من مركز الكرة إلى المستوى', 'is_correct': True},
                            {'text': 'Sphere radius', 'text_ar': 'نصف قطر الكرة', 'is_correct': True},
                            {'text': 'Comparison: d < r (intersects), d = r (tangent), d > r (misses)', 'text_ar': 'المقارنة: d < r (يتقاطع)، d = r (يماس)، d > r (يخطئ)', 'is_correct': True},
                            {'text': 'Plane orientation only', 'text_ar': 'اتجاه المستوى فقط', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Find where the line through points (0,0,0) and (1,1,1) intersects the sphere x² + y² + z² = 3.',
                        'text_ar': 'أوجد أين يتقاطع الخط المار بالنقطتين (0,0,0) و (1,1,1) مع الكرة x² + y² + z² = 3.',
                        'type': 'open_short',
                        'points': 4,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Spherical Coordinates',
                'title_ar': 'الإحداثيات الكروية',
                'description': 'Understanding spherical coordinate systems and their applications',
                'description_ar': 'فهم أنظمة الإحداثيات الكروية وتطبيقاتها',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'What are the three coordinates in a spherical coordinate system?',
                        'text_ar': 'ما هي الإحداثيات الثلاثة في نظام الإحداثيات الكروي؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'ρ (distance), θ (azimuthal angle), φ (polar angle)', 'text_ar': 'ρ (المسافة)، θ (الزاوية السمتية)، φ (الزاوية القطبية)', 'is_correct': True},
                            {'text': 'x, y, z coordinates', 'text_ar': 'إحداثيات x، y، z', 'is_correct': False},
                            {'text': 'r (radius), θ (angle) only', 'text_ar': 'r (نصف القطر)، θ (الزاوية) فقط', 'is_correct': False},
                            {'text': 'Length, width, height', 'text_ar': 'الطول، العرض، الارتفاع', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'How do you convert from spherical (ρ, θ, φ) to Cartesian (x, y, z) coordinates?',
                        'text_ar': 'كيف تحول من الإحداثيات الكروية (ρ, θ, φ) إلى الكارتيزية (x, y, z)؟',
                        'type': 'qcm_single',
                        'points': 5,
                        'choices': [
                            {'text': 'x = ρsin φ cos θ, y = ρsin φ sin θ, z = ρcos φ', 'text_ar': 'x = ρsin φ cos θ، y = ρsin φ sin θ، z = ρcos φ', 'is_correct': True},
                            {'text': 'x = ρcos θ, y = ρsin θ, z = φ', 'text_ar': 'x = ρcos θ، y = ρsin θ، z = φ', 'is_correct': False},
                            {'text': 'x = ρ, y = θ, z = φ', 'text_ar': 'x = ρ، y = θ، z = φ', 'is_correct': False},
                            {'text': 'x = ρθφ, y = ρ + θ, z = ρ - φ', 'text_ar': 'x = ρθφ، y = ρ + θ، z = ρ - φ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What applications use spherical coordinates?',
                        'text_ar': 'أي التطبيقات تستخدم الإحداثيات الكروية؟',
                        'type': 'qcm_multiple',
                        'points': 5,
                        'choices': [
                            {'text': 'Physics: electromagnetic radiation patterns', 'text_ar': 'الفيزياء: أنماط الإشعاع الكهرومغناطيسي', 'is_correct': True},
                            {'text': 'Astronomy: celestial coordinate systems', 'text_ar': 'علم الفلك: أنظمة الإحداثيات السماوية', 'is_correct': True},
                            {'text': 'Computer graphics: 3D modeling and rendering', 'text_ar': 'رسومات الكمبيوتر: النمذجة والعرض ثلاثي الأبعاد', 'is_correct': True},
                            {'text': 'Banking systems', 'text_ar': 'الأنظمة المصرفية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'In spherical coordinates, a sphere of radius R centered at origin is simply ρ = R.',
                        'text_ar': 'في الإحداثيات الكروية، كرة بنصف قطر R بمركز عند الأصل هي ببساطة ρ = R.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Convert the Cartesian point (1, 1, √2) to spherical coordinates.',
                        'text_ar': 'حول النقطة الكارتيزية (1, 1, √2) إلى إحداثيات كروية.',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Applications and Real-World Problems',
                'title_ar': 'التطبيقات والمسائل الحقيقية',
                'description': 'Solving practical problems involving spheres in various contexts',
                'description_ar': 'حل المسائل العملية المتعلقة بالكرات في سياقات مختلفة',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'How are spheres used in engineering design?',
                        'text_ar': 'كيف تستخدم الكرات في التصميم الهندسي؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'Storage tanks, ball bearings, pressure vessels, and dome structures', 'text_ar': 'خزانات التخزين، كريات المحامل، أوعية الضغط، والهياكل القبابية', 'is_correct': True},
                            {'text': 'Only decorative purposes', 'text_ar': 'للأغراض الزخرفية فقط', 'is_correct': False},
                            {'text': 'Flat surface construction only', 'text_ar': 'بناء الأسطح المسطحة فقط', 'is_correct': False},
                            {'text': 'Linear measurement tools', 'text_ar': 'أدوات القياس الخطي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Why do soap bubbles form spherical shapes?',
                        'text_ar': 'لماذا تتكون فقاعات الصابون بأشكال كروية؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'Spheres minimize surface area for a given volume', 'text_ar': 'الكرات تقلل المساحة السطحية لحجم معين', 'is_correct': True},
                            {'text': 'Air pressure forces them to be round', 'text_ar': 'ضغط الهواء يجبرها على أن تكون مستديرة', 'is_correct': False},
                            {'text': 'Gravity pulls them into spheres', 'text_ar': 'الجاذبية تسحبها لتصبح كرات', 'is_correct': False},
                            {'text': 'Chemical reaction creates spherical shape', 'text_ar': 'التفاعل الكيميائي ينشئ الشكل الكروي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'In which real-world contexts are spherical calculations important?',
                        'text_ar': 'في أي السياقات الحقيقية تكون الحسابات الكروية مهمة؟',
                        'type': 'qcm_multiple',
                        'points': 6,
                        'choices': [
                            {'text': 'GPS and navigation systems', 'text_ar': 'أنظمة GPS والملاحة', 'is_correct': True},
                            {'text': 'Weather prediction and climate modeling', 'text_ar': 'التنبؤ بالطقس ونمذجة المناخ', 'is_correct': True},
                            {'text': 'Medical imaging (MRI, CT scans)', 'text_ar': 'التصوير الطبي (الرنين المغناطيسي، الأشعة المقطعية)', 'is_correct': True},
                            {'text': 'Text document formatting', 'text_ar': 'تنسيق الوثائق النصية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The Earth can be approximated as a sphere for many calculations.',
                        'text_ar': 'يمكن تقريب الأرض ككرة للكثير من الحسابات.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'A spherical water tank has radius 5 meters. If it needs to hold 400 cubic meters of water, determine if the tank is large enough.',
                        'text_ar': 'خزان ماء كروي بنصف قطر 5 أمتار. إذا كان يحتاج لحمل 400 متر مكعب من الماء، حدد إذا كان الخزان كبيراً بما فيه الكفاية.',
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