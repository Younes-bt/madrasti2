from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Lesson 95: Spatial geometry (Geometry in space)'

    def handle(self, *args, **options):
        lesson_id = 95

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
                'title': 'Points, Lines, and Planes in Space',
                'title_ar': 'النقاط والخطوط والمستويات في الفضاء',
                'description': 'Understanding basic elements of three-dimensional geometry',
                'description_ar': 'فهم العناصر الأساسية للهندسة ثلاثية الأبعاد',
                'difficulty': 'beginner',
                'points': 10,
                'questions': [
                    {
                        'text': 'How many coordinates are needed to specify a point in 3D space?',
                        'text_ar': 'كم إحداثي نحتاج لتحديد نقطة في الفضاء ثلاثي الأبعاد؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': '3', 'text_ar': '3', 'is_correct': True},
                            {'text': '2', 'text_ar': '2', 'is_correct': False},
                            {'text': '4', 'text_ar': '4', 'is_correct': False},
                            {'text': '1', 'text_ar': '1', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the distance formula between two points (x₁,y₁,z₁) and (x₂,y₂,z₂) in space?',
                        'text_ar': 'ما هي صيغة المسافة بين نقطتين (x₁,y₁,z₁) و (x₂,y₂,z₂) في الفضاء؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': '√[(x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²]', 'text_ar': '√[(x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²]', 'is_correct': True},
                            {'text': '√[(x₂-x₁)² + (y₂-y₁)²]', 'text_ar': '√[(x₂-x₁)² + (y₂-y₁)²]', 'is_correct': False},
                            {'text': '|x₂-x₁| + |y₂-y₁| + |z₂-z₁|', 'text_ar': '|x₂-x₁| + |y₂-y₁| + |z₂-z₁|', 'is_correct': False},
                            {'text': '(x₂-x₁)(y₂-y₁)(z₂-z₁)', 'text_ar': '(x₂-x₁)(y₂-y₁)(z₂-z₁)', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which elements define a plane in space?',
                        'text_ar': 'أي العناصر تحدد مستوى في الفضاء؟',
                        'type': 'qcm_multiple',
                        'points': 3,
                        'choices': [
                            {'text': 'Three non-collinear points', 'text_ar': 'ثلاث نقاط غير متراصة', 'is_correct': True},
                            {'text': 'A point and a normal vector', 'text_ar': 'نقطة وشعاع عمودي', 'is_correct': True},
                            {'text': 'Two intersecting lines', 'text_ar': 'خطان متقاطعان', 'is_correct': True},
                            {'text': 'One point only', 'text_ar': 'نقطة واحدة فقط', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Two distinct lines in space are either parallel, intersecting, or skew.',
                        'text_ar': 'خطان مختلفان في الفضاء إما متوازيان أو متقاطعان أو ملتويان.',
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
                'title': 'Vectors in 3D Space',
                'title_ar': 'الأشعة في الفضاء ثلاثي الأبعاد',
                'description': 'Working with vectors, operations, and applications in three dimensions',
                'description_ar': 'التعامل مع الأشعة والعمليات والتطبيقات في ثلاثة أبعاد',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What is the magnitude of vector v = (3, 4, 12)?',
                        'text_ar': 'ما هو مقدار الشعاع v = (3, 4, 12)؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': '13', 'text_ar': '13', 'is_correct': True},
                            {'text': '12', 'text_ar': '12', 'is_correct': False},
                            {'text': '5', 'text_ar': '5', 'is_correct': False},
                            {'text': '19', 'text_ar': '19', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'How do you find a unit vector in the direction of v = (2, -1, 2)?',
                        'text_ar': 'كيف تجد شعاع الوحدة في اتجاه v = (2, -1, 2)؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'v/|v| = (2/3, -1/3, 2/3)', 'text_ar': 'v/|v| = (2/3, -1/3, 2/3)', 'is_correct': True},
                            {'text': '(2, -1, 2)', 'text_ar': '(2, -1, 2)', 'is_correct': False},
                            {'text': '(1, 1, 1)', 'text_ar': '(1, 1, 1)', 'is_correct': False},
                            {'text': '(2, 1, 2)/3', 'text_ar': '(2, 1, 2)/3', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which operations are defined for 3D vectors?',
                        'text_ar': 'أي العمليات محددة للأشعة ثلاثية الأبعاد؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'Vector addition', 'text_ar': 'جمع الأشعة', 'is_correct': True},
                            {'text': 'Scalar multiplication', 'text_ar': 'الضرب القياسي', 'is_correct': True},
                            {'text': 'Dot product', 'text_ar': 'الضرب النقطي', 'is_correct': True},
                            {'text': 'Cross product', 'text_ar': 'الضرب الاتجاهي', 'is_correct': True}
                        ]
                    },
                    {
                        'text': 'Find the dot product of u = (1, 2, -3) and v = (4, -1, 2).',
                        'text_ar': 'أوجد الضرب النقطي لـ u = (1, 2, -3) و v = (4, -1, 2).',
                        'type': 'open_short',
                        'points': 4,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Equations of Lines and Planes',
                'title_ar': 'معادلات الخطوط والمستويات',
                'description': 'Deriving and working with equations of lines and planes in space',
                'description_ar': 'اشتقاق والتعامل مع معادلات الخطوط والمستويات في الفضاء',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What is the vector equation of a line passing through point P₀ with direction vector d?',
                        'text_ar': 'ما هي المعادلة الشعاعية للخط المار بالنقطة P₀ بشعاع اتجاه d؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'r = r₀ + td', 'text_ar': 'r = r₀ + td', 'is_correct': True},
                            {'text': 'r = r₀ × d', 'text_ar': 'r = r₀ × d', 'is_correct': False},
                            {'text': 'r = r₀ · d', 'text_ar': 'r = r₀ · d', 'is_correct': False},
                            {'text': 'r = d - r₀', 'text_ar': 'r = d - r₀', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the general equation of a plane?',
                        'text_ar': 'ما هي المعادلة العامة للمستوى؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'ax + by + cz = d', 'text_ar': 'ax + by + cz = d', 'is_correct': True},
                            {'text': 'ax + by = c', 'text_ar': 'ax + by = c', 'is_correct': False},
                            {'text': 'x² + y² + z² = r²', 'text_ar': 'x² + y² + z² = r²', 'is_correct': False},
                            {'text': 'xyz = k', 'text_ar': 'xyz = k', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'How do you determine if a line and plane intersect?',
                        'text_ar': 'كيف تحدد إذا كان الخط والمستوى يتقاطعان؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'Check if direction vector is parallel to plane', 'text_ar': 'تحقق إذا كان شعاع الاتجاه موازي للمستوى', 'is_correct': True},
                            {'text': 'Substitute line equation into plane equation', 'text_ar': 'عوض معادلة الخط في معادلة المستوى', 'is_correct': True},
                            {'text': 'Calculate dot product with normal vector', 'text_ar': 'احسب الضرب النقطي مع الشعاع العمودي', 'is_correct': True},
                            {'text': 'Lines always intersect planes', 'text_ar': 'الخطوط دائماً تقاطع المستويات', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Find the equation of the plane passing through points (1,0,0), (0,1,0), and (0,0,1).',
                        'text_ar': 'أوجد معادلة المستوى المار بالنقاط (1,0,0)، (0,1,0)، و (0,0,1).',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Angles and Distances in Space',
                'title_ar': 'الزوايا والمسافات في الفضاء',
                'description': 'Computing angles between vectors, lines, and planes, and distances in 3D',
                'description_ar': 'حساب الزوايا بين الأشعة والخطوط والمستويات والمسافات في 3D',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'How do you find the angle between two vectors u and v?',
                        'text_ar': 'كيف تجد الزاوية بين شعاعين u و v؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'cos θ = (u·v)/(|u||v|)', 'text_ar': 'cos θ = (u·v)/(|u||v|)', 'is_correct': True},
                            {'text': 'sin θ = (u×v)/(|u||v|)', 'text_ar': 'sin θ = (u×v)/(|u||v|)', 'is_correct': False},
                            {'text': 'tan θ = |u|/|v|', 'text_ar': 'tan θ = |u|/|v|', 'is_correct': False},
                            {'text': 'θ = |u| + |v|', 'text_ar': 'θ = |u| + |v|', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the distance from point P₀(x₀,y₀,z₀) to plane ax + by + cz = d?',
                        'text_ar': 'ما هي المسافة من النقطة P₀(x₀,y₀,z₀) إلى المستوى ax + by + cz = d؟',
                        'type': 'qcm_single',
                        'points': 5,
                        'choices': [
                            {'text': '|ax₀ + by₀ + cz₀ - d|/√(a² + b² + c²)', 'text_ar': '|ax₀ + by₀ + cz₀ - d|/√(a² + b² + c²)', 'is_correct': True},
                            {'text': '√[(x₀-a)² + (y₀-b)² + (z₀-c)²]', 'text_ar': '√[(x₀-a)² + (y₀-b)² + (z₀-c)²]', 'is_correct': False},
                            {'text': 'ax₀ + by₀ + cz₀', 'text_ar': 'ax₀ + by₀ + cz₀', 'is_correct': False},
                            {'text': '|d|', 'text_ar': '|d|', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which methods can find distances in 3D space?',
                        'text_ar': 'أي الطرق يمكن استخدامها لإيجاد المسافات في الفضاء ثلاثي الأبعاد؟',
                        'type': 'qcm_multiple',
                        'points': 5,
                        'choices': [
                            {'text': 'Point to point using distance formula', 'text_ar': 'نقطة إلى نقطة بصيغة المسافة', 'is_correct': True},
                            {'text': 'Point to line using projection', 'text_ar': 'نقطة إلى خط بالإسقاط', 'is_correct': True},
                            {'text': 'Point to plane using normal vector', 'text_ar': 'نقطة إلى مستوى بالشعاع العمودي', 'is_correct': True},
                            {'text': 'Direct measurement only', 'text_ar': 'القياس المباشر فقط', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Two planes are perpendicular if and only if their normal vectors are perpendicular.',
                        'text_ar': 'مستويان عموديان إذا وفقط إذا كانت الأشعة العمودية لهما عمودية.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Find the angle between the planes x + y + z = 1 and x - y + z = 0.',
                        'text_ar': 'أوجد الزاوية بين المستويين x + y + z = 1 و x - y + z = 0.',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Applications of 3D Geometry',
                'title_ar': 'تطبيقات الهندسة ثلاثية الأبعاد',
                'description': 'Real-world applications and problem-solving in spatial geometry',
                'description_ar': 'التطبيقات الحقيقية وحل المسائل في الهندسة الفضائية',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'In computer graphics, what is a common use of 3D geometry?',
                        'text_ar': 'في رسومات الكمبيوتر، ما هو الاستخدام الشائع للهندسة ثلاثية الأبعاد؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'Rendering 3D objects and calculating lighting', 'text_ar': 'عرض الكائنات ثلاثية الأبعاد وحساب الإضاءة', 'is_correct': True},
                            {'text': 'Storing text data', 'text_ar': 'تخزين البيانات النصية', 'is_correct': False},
                            {'text': 'Network communication', 'text_ar': 'التواصل الشبكي', 'is_correct': False},
                            {'text': 'File compression', 'text_ar': 'ضغط الملفات', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'How is 3D geometry used in architecture?',
                        'text_ar': 'كيف تستخدم الهندسة ثلاثية الأبعاد في العمارة؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'Designing buildings, calculating structural forces, and space planning', 'text_ar': 'تصميم المباني وحساب القوى الهيكلية وتخطيط الفضاء', 'is_correct': True},
                            {'text': 'Only for decoration', 'text_ar': 'للزينة فقط', 'is_correct': False},
                            {'text': 'Cost estimation only', 'text_ar': 'تقدير التكلفة فقط', 'is_correct': False},
                            {'text': 'Legal documentation', 'text_ar': 'التوثيق القانوني', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which fields extensively use 3D spatial geometry?',
                        'text_ar': 'أي المجالات تستخدم الهندسة الفضائية ثلاثية الأبعاد بكثرة؟',
                        'type': 'qcm_multiple',
                        'points': 6,
                        'choices': [
                            {'text': 'Robotics and automation', 'text_ar': 'الروبوتات والأتمتة', 'is_correct': True},
                            {'text': 'Medical imaging and surgery', 'text_ar': 'التصوير الطبي والجراحة', 'is_correct': True},
                            {'text': 'Aerospace and navigation', 'text_ar': 'الطيران والملاحة', 'is_correct': True},
                            {'text': 'Text processing', 'text_ar': 'معالجة النصوص', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'GPS systems use 3D geometry to determine location through triangulation.',
                        'text_ar': 'أنظمة GPS تستخدم الهندسة ثلاثية الأبعاد لتحديد الموقع عبر التثليث.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'A satellite is positioned at (1000, 2000, 300) km. Find its distance from the origin and describe how this relates to orbital mechanics.',
                        'text_ar': 'قمر صناعي موضوع عند (1000, 2000, 300) كم. أوجد مسافته من الأصل واشرح كيف يرتبط هذا بميكانيكا المدارات.',
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