from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Lesson 96: Vector product (Cross product)'

    def handle(self, *args, **options):
        lesson_id = 96

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
                'title': 'Introduction to Cross Product',
                'title_ar': 'مقدمة في الضرب الاتجاهي',
                'description': 'Understanding the definition and basic properties of cross product',
                'description_ar': 'فهم تعريف والخصائص الأساسية للضرب الاتجاهي',
                'difficulty': 'beginner',
                'points': 10,
                'questions': [
                    {
                        'text': 'What is the cross product of two vectors?',
                        'text_ar': 'ما هو الضرب الاتجاهي لشعاعين؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'A vector perpendicular to both original vectors', 'text_ar': 'شعاع عمودي على كلا الشعاعين الأصليين', 'is_correct': True},
                            {'text': 'A scalar quantity', 'text_ar': 'كمية قياسية', 'is_correct': False},
                            {'text': 'The sum of the two vectors', 'text_ar': 'مجموع الشعاعين', 'is_correct': False},
                            {'text': 'The magnitude of both vectors', 'text_ar': 'مقدار كلا الشعاعين', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'In what dimension is the cross product primarily defined?',
                        'text_ar': 'في أي بُعد يُعرَّف الضرب الاتجاهي بشكل أساسي؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': '3D', 'text_ar': 'ثلاثي الأبعاد', 'is_correct': True},
                            {'text': '2D', 'text_ar': 'ثنائي الأبعاد', 'is_correct': False},
                            {'text': '4D', 'text_ar': 'رباعي الأبعاد', 'is_correct': False},
                            {'text': '1D', 'text_ar': 'أحادي البعد', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which properties characterize the cross product?',
                        'text_ar': 'أي الخصائص تميز الضرب الاتجاهي؟',
                        'type': 'qcm_multiple',
                        'points': 3,
                        'choices': [
                            {'text': 'Anti-commutative: a × b = -(b × a)', 'text_ar': 'غير تبادلي: a × b = -(b × a)', 'is_correct': True},
                            {'text': 'Distributive over addition', 'text_ar': 'توزيعي على الجمع', 'is_correct': True},
                            {'text': 'Result is perpendicular to both vectors', 'text_ar': 'النتيجة عمودية على كلا الشعاعين', 'is_correct': True},
                            {'text': 'Commutative: a × b = b × a', 'text_ar': 'تبادلي: a × b = b × a', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The cross product of a vector with itself is the zero vector.',
                        'text_ar': 'الضرب الاتجاهي لشعاع مع نفسه هو الشعاع الصفري.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Computing Cross Products',
                'title_ar': 'حساب الضرب الاتجاهي',
                'description': 'Methods for calculating cross products using determinants and components',
                'description_ar': 'طرق حساب الضرب الاتجاهي باستخدام المحددات والمكونات',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What is the formula for cross product a × b where a = (a₁,a₂,a₃) and b = (b₁,b₂,b₃)?',
                        'text_ar': 'ما هي صيغة الضرب الاتجاهي a × b حيث a = (a₁,a₂,a₃) و b = (b₁,b₂,b₃)؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': '(a₂b₃-a₃b₂, a₃b₁-a₁b₃, a₁b₂-a₂b₁)', 'text_ar': '(a₂b₃-a₃b₂, a₃b₁-a₁b₃, a₁b₂-a₂b₁)', 'is_correct': True},
                            {'text': '(a₁b₁, a₂b₂, a₃b₃)', 'text_ar': '(a₁b₁, a₂b₂, a₃b₃)', 'is_correct': False},
                            {'text': 'a₁b₁ + a₂b₂ + a₃b₃', 'text_ar': 'a₁b₁ + a₂b₂ + a₃b₃', 'is_correct': False},
                            {'text': '(a₁+b₁, a₂+b₂, a₃+b₃)', 'text_ar': '(a₁+b₁, a₂+b₂, a₃+b₃)', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Calculate i × j where i and j are standard unit vectors.',
                        'text_ar': 'احسب i × j حيث i و j أشعة وحدة معيارية.',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'k', 'text_ar': 'k', 'is_correct': True},
                            {'text': '-k', 'text_ar': '-k', 'is_correct': False},
                            {'text': 'i', 'text_ar': 'i', 'is_correct': False},
                            {'text': 'j', 'text_ar': 'j', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which determinant method can compute cross products?',
                        'text_ar': 'أي طريقة محددات يمكن استخدامها لحساب الضرب الاتجاهي؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': '3×3 determinant with unit vectors', 'text_ar': 'محدد 3×3 مع أشعة الوحدة', 'is_correct': True},
                            {'text': 'Expansion along first row', 'text_ar': 'التوسع على الصف الأول', 'is_correct': True},
                            {'text': 'Cofactor expansion', 'text_ar': 'توسع العامل المساعد', 'is_correct': True},
                            {'text': '2×2 determinant only', 'text_ar': 'محدد 2×2 فقط', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Find the cross product of a = (2, 1, -3) and b = (1, -2, 1).',
                        'text_ar': 'أوجد الضرب الاتجاهي لـ a = (2, 1, -3) و b = (1, -2, 1).',
                        'type': 'open_short',
                        'points': 4,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Geometric Interpretation',
                'title_ar': 'التفسير الهندسي',
                'description': 'Understanding the geometric meaning of cross products',
                'description_ar': 'فهم المعنى الهندسي للضرب الاتجاهي',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What does |a × b| represent geometrically?',
                        'text_ar': 'ماذا يمثل |a × b| هندسياً؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'Area of the parallelogram formed by vectors a and b', 'text_ar': 'مساحة متوازي الأضلاع المكون من الشعاعين a و b', 'is_correct': True},
                            {'text': 'Perimeter of the parallelogram', 'text_ar': 'محيط متوازي الأضلاع', 'is_correct': False},
                            {'text': 'Volume of a cube', 'text_ar': 'حجم المكعب', 'is_correct': False},
                            {'text': 'Distance between the vectors', 'text_ar': 'المسافة بين الشعاعين', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'How is the magnitude of cross product related to the angle between vectors?',
                        'text_ar': 'كيف يرتبط مقدار الضرب الاتجاهي بالزاوية بين الشعاعين؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': '|a × b| = |a||b|sin θ', 'text_ar': '|a × b| = |a||b|sin θ', 'is_correct': True},
                            {'text': '|a × b| = |a||b|cos θ', 'text_ar': '|a × b| = |a||b|cos θ', 'is_correct': False},
                            {'text': '|a × b| = |a||b|tan θ', 'text_ar': '|a × b| = |a||b|tan θ', 'is_correct': False},
                            {'text': '|a × b| = |a| + |b|', 'text_ar': '|a × b| = |a| + |b|', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which applications use the geometric properties of cross products?',
                        'text_ar': 'أي التطبيقات تستخدم الخصائص الهندسية للضرب الاتجاهي؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'Finding area of triangles and parallelograms', 'text_ar': 'إيجاد مساحة المثلثات ومتوازيات الأضلاع', 'is_correct': True},
                            {'text': 'Determining surface normals', 'text_ar': 'تحديد الأعمدة على السطوح', 'is_correct': True},
                            {'text': 'Computing torque in physics', 'text_ar': 'حساب العزم في الفيزياء', 'is_correct': True},
                            {'text': 'Solving linear equations', 'text_ar': 'حل المعادلات الخطية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The direction of a × b follows the right-hand rule.',
                        'text_ar': 'اتجاه a × b يتبع قاعدة اليد اليمنى.',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Find the area of the triangle with vertices at (0,0,0), (1,2,3), and (2,1,1).',
                        'text_ar': 'أوجد مساحة المثلث برؤوس عند (0,0,0)، (1,2,3)، و (2,1,1).',
                        'type': 'open_short',
                        'points': 1,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Triple Products',
                'title_ar': 'الضرب الثلاثي',
                'description': 'Understanding scalar and vector triple products',
                'description_ar': 'فهم الضرب الثلاثي القياسي والاتجاهي',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'What is the scalar triple product a · (b × c)?',
                        'text_ar': 'ما هو الضرب الثلاثي القياسي a · (b × c)؟',
                        'type': 'qcm_single',
                        'points': 5,
                        'choices': [
                            {'text': 'The volume of the parallelepiped formed by vectors a, b, and c', 'text_ar': 'حجم متوازي السطوح المكون من الأشعة a، b، و c', 'is_correct': True},
                            {'text': 'The surface area of the parallelepiped', 'text_ar': 'المساحة السطحية لمتوازي السطوح', 'is_correct': False},
                            {'text': 'The length of vector a', 'text_ar': 'طول الشعاع a', 'is_correct': False},
                            {'text': 'A vector perpendicular to all three', 'text_ar': 'شعاع عمودي على الثلاثة جميعاً', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'How can the scalar triple product be computed?',
                        'text_ar': 'كيف يمكن حساب الضرب الثلاثي القياسي؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'Using a 3×3 determinant', 'text_ar': 'باستخدام محدد 3×3', 'is_correct': True},
                            {'text': 'Adding the three vectors', 'text_ar': 'بجمع الأشعة الثلاثة', 'is_correct': False},
                            {'text': 'Multiplying their magnitudes', 'text_ar': 'بضرب مقاديرها', 'is_correct': False},
                            {'text': 'Using the Pythagorean theorem', 'text_ar': 'باستخدام نظرية فيثاغورس', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which properties hold for triple products?',
                        'text_ar': 'أي الخصائص صحيحة للضرب الثلاثي؟',
                        'type': 'qcm_multiple',
                        'points': 5,
                        'choices': [
                            {'text': 'a · (b × c) = b · (c × a) = c · (a × b)', 'text_ar': 'a · (b × c) = b · (c × a) = c · (a × b)', 'is_correct': True},
                            {'text': 'If vectors are coplanar, scalar triple product is zero', 'text_ar': 'إذا كانت الأشعة متحدة المستوى، الضرب الثلاثي القياسي صفر', 'is_correct': True},
                            {'text': 'a × (b × c) = (a · c)b - (a · b)c', 'text_ar': 'a × (b × c) = (a · c)b - (a · b)c', 'is_correct': True},
                            {'text': 'All triple products are commutative', 'text_ar': 'جميع الضرب الثلاثي تبادلي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The vector triple product a × (b × c) lies in the plane of vectors b and c.',
                        'text_ar': 'الضرب الثلاثي الاتجاهي a × (b × c) يقع في مستوى الشعاعين b و c.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Calculate the volume of the parallelepiped formed by vectors a = (1,2,3), b = (2,1,0), and c = (1,1,1).',
                        'text_ar': 'احسب حجم متوازي السطوح المكون من الأشعة a = (1,2,3)، b = (2,1,0)، و c = (1,1,1).',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Applications in Physics and Engineering',
                'title_ar': 'التطبيقات في الفيزياء والهندسة',
                'description': 'Real-world applications of cross products in various fields',
                'description_ar': 'التطبيقات الحقيقية للضرب الاتجاهي في مجالات مختلفة',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'How is cross product used to calculate torque?',
                        'text_ar': 'كيف يستخدم الضرب الاتجاهي لحساب العزم؟',
                        'type': 'qcm_single',
                        'points': 5,
                        'choices': [
                            {'text': 'τ = r × F (torque = position × force)', 'text_ar': 'τ = r × F (العزم = الموضع × القوة)', 'is_correct': True},
                            {'text': 'τ = r · F (torque = position · force)', 'text_ar': 'τ = r · F (العزم = الموضع · القوة)', 'is_correct': False},
                            {'text': 'τ = |r| + |F|', 'text_ar': 'τ = |r| + |F|', 'is_correct': False},
                            {'text': 'τ = r/F', 'text_ar': 'τ = r/F', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'In electromagnetism, what does F = q(v × B) represent?',
                        'text_ar': 'في الكهرومغناطيسية، ماذا يمثل F = q(v × B)؟',
                        'type': 'qcm_single',
                        'points': 5,
                        'choices': [
                            {'text': 'Lorentz force on a moving charged particle', 'text_ar': 'قوة لورنتز على جسيم مشحون متحرك', 'is_correct': True},
                            {'text': 'Gravitational force', 'text_ar': 'القوة الجذبية', 'is_correct': False},
                            {'text': 'Elastic force', 'text_ar': 'القوة المرنة', 'is_correct': False},
                            {'text': 'Nuclear force', 'text_ar': 'القوة النووية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which engineering applications use cross products?',
                        'text_ar': 'أي التطبيقات الهندسية تستخدم الضرب الاتجاهي؟',
                        'type': 'qcm_multiple',
                        'points': 5,
                        'choices': [
                            {'text': 'Computer graphics for 3D rendering', 'text_ar': 'رسومات الكمبيوتر للعرض ثلاثي الأبعاد', 'is_correct': True},
                            {'text': 'Robotics for joint rotation calculations', 'text_ar': 'الروبوتات لحسابات دوران المفاصل', 'is_correct': True},
                            {'text': 'Structural engineering for moment calculations', 'text_ar': 'الهندسة الإنشائية لحسابات العزم', 'is_correct': True},
                            {'text': 'Financial calculations', 'text_ar': 'الحسابات المالية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Angular velocity vector ω and position vector r determine linear velocity as v = ω × r.',
                        'text_ar': 'شعاع السرعة الزاوية ω وشعاع الموضع r يحددان السرعة الخطية كـ v = ω × r.',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'A force F = (10, 0, 5) N acts at position r = (2, 3, 0) m. Calculate the torque about the origin.',
                        'text_ar': 'قوة F = (10, 0, 5) نيوتن تؤثر عند الموضع r = (2, 3, 0) متر. احسب العزم حول الأصل.',
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