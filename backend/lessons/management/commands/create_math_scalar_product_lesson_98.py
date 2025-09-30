from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Scalar product (Dot product) in space - Lesson ID: 98'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=98)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Definition and Properties of Scalar Product',
                    'title_arabic': 'تعريف وخصائص الجداء القياسي',
                    'description': 'Understanding the definition and fundamental properties of scalar product in 3D space',
                    'description_arabic': 'فهم تعريف والخصائص الأساسية للجداء القياسي في الفضاء ثلاثي الأبعاد',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is the scalar product (dot product) of two vectors u and v?',
                            'question_text_arabic': 'ما هو الجداء القياسي لمتجهين u و v؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'u · v = |u| |v| cos θ where θ is the angle between the vectors', 'choice_text_arabic': 'u · v = |u| |v| cos θ حيث θ هو الزاوية بين المتجهين', 'is_correct': True},
                                {'choice_text': 'u · v = |u| |v| sin θ where θ is the angle between the vectors', 'choice_text_arabic': 'u · v = |u| |v| sin θ حيث θ هو الزاوية بين المتجهين', 'is_correct': False},
                                {'choice_text': 'u · v = u × v (cross product)', 'choice_text_arabic': 'u · v = u × v (الجداء الشعاعي)', 'is_correct': False},
                                {'choice_text': 'u · v = |u + v|', 'choice_text_arabic': 'u · v = |u + v|', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'If vectors u and v are perpendicular, what is u · v?',
                            'question_text_arabic': 'إذا كان المتجهان u و v متعامدان، فما قيمة u · v؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '0', 'choice_text_arabic': '0', 'is_correct': True},
                                {'choice_text': '1', 'choice_text_arabic': '1', 'is_correct': False},
                                {'choice_text': '|u| × |v|', 'choice_text_arabic': '|u| × |v|', 'is_correct': False},
                                {'choice_text': 'undefined', 'choice_text_arabic': 'غير معرف', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which property does the scalar product satisfy?',
                            'question_text_arabic': 'أي خاصية يحققها الجداء القياسي؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Commutative: u · v = v · u', 'choice_text_arabic': 'التبديلية: u · v = v · u', 'is_correct': True},
                                {'choice_text': 'Distributive: u · (v + w) = u · v + u · w', 'choice_text_arabic': 'التوزيعية: u · (v + w) = u · v + u · w', 'is_correct': True},
                                {'choice_text': 'Associative with scalars: (ku) · v = k(u · v)', 'choice_text_arabic': 'التجميعية مع القياسيات: (ku) · v = k(u · v)', 'is_correct': True},
                                {'choice_text': 'Associative: (u · v) · w = u · (v · w)', 'choice_text_arabic': 'التجميعية: (u · v) · w = u · (v · w)', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The scalar product of a vector with itself gives the square of its magnitude.',
                            'question_text_arabic': 'الجداء القياسي لمتجه مع نفسه يعطي مربع طول المتجه.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'If u · v > 0, what can we conclude about the angle between u and v?',
                            'question_text_arabic': 'إذا كان u · v > 0، فماذا يمكننا أن نستنتج عن الزاوية بين u و v؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The angle is acute (less than 90°)', 'choice_text_arabic': 'الزاوية حادة (أقل من 90°)', 'is_correct': True},
                                {'choice_text': 'The angle is obtuse (greater than 90°)', 'choice_text_arabic': 'الزاوية منفرجة (أكبر من 90°)', 'is_correct': False},
                                {'choice_text': 'The angle is exactly 90°', 'choice_text_arabic': 'الزاوية تساوي 90° بالضبط', 'is_correct': False},
                                {'choice_text': 'Cannot determine the angle', 'choice_text_arabic': 'لا يمكن تحديد الزاوية', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Calculating Scalar Product in Coordinates',
                    'title_arabic': 'حساب الجداء القياسي بالإحداثيات',
                    'description': 'Computing scalar products using vector components in 3D coordinate systems',
                    'description_arabic': 'حساب الجداء القياسي باستخدام مركبات المتجهات في نظام الإحداثيات ثلاثي الأبعاد',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'If u = (3, 4, 5) and v = (1, 2, 3), what is u · v?',
                            'question_text_arabic': 'إذا كان u = (3, 4, 5) و v = (1, 2, 3)، فما قيمة u · v؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '26', 'choice_text_arabic': '26', 'is_correct': True},
                                {'choice_text': '11', 'choice_text_arabic': '11', 'is_correct': False},
                                {'choice_text': '15', 'choice_text_arabic': '15', 'is_correct': False},
                                {'choice_text': '36', 'choice_text_arabic': '36', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'For vectors u = (a₁, a₂, a₃) and v = (b₁, b₂, b₃), the scalar product is:',
                            'question_text_arabic': 'للمتجهين u = (a₁, a₂, a₃) و v = (b₁, b₂, b₃)، الجداء القياسي هو:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'u · v = a₁b₁ + a₂b₂ + a₃b₃', 'choice_text_arabic': 'u · v = a₁b₁ + a₂b₂ + a₃b₃', 'is_correct': True},
                                {'choice_text': 'u · v = a₁b₁ × a₂b₂ × a₃b₃', 'choice_text_arabic': 'u · v = a₁b₁ × a₂b₂ × a₃b₃', 'is_correct': False},
                                {'choice_text': 'u · v = (a₁ + b₁, a₂ + b₂, a₃ + b₃)', 'choice_text_arabic': 'u · v = (a₁ + b₁, a₂ + b₂, a₃ + b₃)', 'is_correct': False},
                                {'choice_text': 'u · v = √(a₁² + a₂² + a₃²) × √(b₁² + b₂² + b₃²)', 'choice_text_arabic': 'u · v = √(a₁² + a₂² + a₃²) × √(b₁² + b₂² + b₃²)', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Find the scalar product of i = (1, 0, 0) and j = (0, 1, 0)',
                            'question_text_arabic': 'أوجد الجداء القياسي للمتجهين i = (1, 0, 0) و j = (0, 1, 0)',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '0', 'choice_text_arabic': '0', 'is_correct': True},
                                {'choice_text': '1', 'choice_text_arabic': '1', 'is_correct': False},
                                {'choice_text': '-1', 'choice_text_arabic': '-1', 'is_correct': False},
                                {'choice_text': '√2', 'choice_text_arabic': '√2', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'If a = (2, -1, 3) and b = (-1, 4, 2), calculate a · b',
                            'question_text_arabic': 'إذا كان a = (2, -1, 3) و b = (-1, 4, 2)، احسب a · b',
                            'question_type': 'open_short',
                            'correct_answer': '0'
                        },
                        {
                            'question_text': 'The scalar product of orthogonal unit vectors is always zero.',
                            'question_text_arabic': 'الجداء القياسي للمتجهات الوحدة المتعامدة يساوي صفراً دائماً.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Applications: Angles and Projections',
                    'title_arabic': 'التطبيقات: الزوايا والإسقاطات',
                    'description': 'Using scalar product to find angles between vectors and vector projections',
                    'description_arabic': 'استخدام الجداء القياسي لإيجاد الزوايا بين المتجهات وإسقاطات المتجهات',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'How do you find the angle θ between two vectors u and v using their scalar product?',
                            'question_text_arabic': 'كيف تجد الزاوية θ بين متجهين u و v باستخدام جداؤهما القياسي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'cos θ = (u · v) / (|u| |v|)', 'choice_text_arabic': 'cos θ = (u · v) / (|u| |v|)', 'is_correct': True},
                                {'choice_text': 'sin θ = (u · v) / (|u| |v|)', 'choice_text_arabic': 'sin θ = (u · v) / (|u| |v|)', 'is_correct': False},
                                {'choice_text': 'tan θ = (u · v) / (|u| |v|)', 'choice_text_arabic': 'tan θ = (u · v) / (|u| |v|)', 'is_correct': False},
                                {'choice_text': 'θ = u · v', 'choice_text_arabic': 'θ = u · v', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The projection of vector u onto vector v is given by:',
                            'question_text_arabic': 'إسقاط المتجه u على المتجه v يُعطى بـ:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'proj_v(u) = (u · v / |v|²) v', 'choice_text_arabic': 'proj_v(u) = (u · v / |v|²) v', 'is_correct': True},
                                {'choice_text': 'proj_v(u) = (u · v / |u|²) v', 'choice_text_arabic': 'proj_v(u) = (u · v / |u|²) v', 'is_correct': False},
                                {'choice_text': 'proj_v(u) = u · v', 'choice_text_arabic': 'proj_v(u) = u · v', 'is_correct': False},
                                {'choice_text': 'proj_v(u) = u + v', 'choice_text_arabic': 'proj_v(u) = u + v', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'If u = (3, 4, 0) and v = (1, 0, 0), what is the scalar projection of u onto v?',
                            'question_text_arabic': 'إذا كان u = (3, 4, 0) و v = (1, 0, 0)، فما هو الإسقاط القياسي لـ u على v؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '3', 'choice_text_arabic': '3', 'is_correct': True},
                                {'choice_text': '4', 'choice_text_arabic': '4', 'is_correct': False},
                                {'choice_text': '5', 'choice_text_arabic': '5', 'is_correct': False},
                                {'choice_text': '7', 'choice_text_arabic': '7', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Find the cosine of the angle between vectors a = (1, 1, 1) and b = (1, 0, 1)',
                            'question_text_arabic': 'أوجد جيب تمام الزاوية بين المتجهين a = (1, 1, 1) و b = (1, 0, 1)',
                            'question_type': 'open_short',
                            'correct_answer': '√6/3 or 2/√6'
                        },
                        {
                            'question_text': 'The scalar projection is always positive.',
                            'question_text_arabic': 'الإسقاط القياسي دائماً موجب.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        }
                    ]
                },
                {
                    'title': 'Equations of Lines and Planes',
                    'title_arabic': 'معادلات الخطوط والمستويات',
                    'description': 'Using scalar product in geometric applications: lines, planes, and distances',
                    'description_arabic': 'استخدام الجداء القياسي في التطبيقات الهندسية: الخطوط والمستويات والمسافات',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'A plane has normal vector n = (1, 2, 3) and passes through point P(1, 0, 2). What is its equation?',
                            'question_text_arabic': 'مستوى له متجه عمودي n = (1, 2, 3) ويمر بالنقطة P(1, 0, 2). ما معادلته؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'x + 2y + 3z = 7', 'choice_text_arabic': 'x + 2y + 3z = 7', 'is_correct': True},
                                {'choice_text': 'x + 2y + 3z = 1', 'choice_text_arabic': 'x + 2y + 3z = 1', 'is_correct': False},
                                {'choice_text': 'x + 2y + 3z = 6', 'choice_text_arabic': 'x + 2y + 3z = 6', 'is_correct': False},
                                {'choice_text': '2x + y + 3z = 8', 'choice_text_arabic': '2x + y + 3z = 8', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Two lines are perpendicular if and only if:',
                            'question_text_arabic': 'خطان متعامدان إذا وفقط إذا:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Their direction vectors have scalar product equal to zero', 'choice_text_arabic': 'متجهات اتجاههما لها جداء قياسي يساوي صفراً', 'is_correct': True},
                                {'choice_text': 'Their direction vectors have scalar product equal to one', 'choice_text_arabic': 'متجهات اتجاههما لها جداء قياسي يساوي واحداً', 'is_correct': False},
                                {'choice_text': 'They intersect at the origin', 'choice_text_arabic': 'يتقاطعان في نقطة الأصل', 'is_correct': False},
                                {'choice_text': 'They have the same slope', 'choice_text_arabic': 'لهما نفس الميل', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The distance from point P(x₀, y₀, z₀) to plane ax + by + cz + d = 0 is:',
                            'question_text_arabic': 'المسافة من النقطة P(x₀, y₀, z₀) إلى المستوى ax + by + cz + d = 0 هي:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '|ax₀ + by₀ + cz₀ + d| / √(a² + b² + c²)', 'choice_text_arabic': '|ax₀ + by₀ + cz₀ + d| / √(a² + b² + c²)', 'is_correct': True},
                                {'choice_text': '(ax₀ + by₀ + cz₀ + d) / (a² + b² + c²)', 'choice_text_arabic': '(ax₀ + by₀ + cz₀ + d) / (a² + b² + c²)', 'is_correct': False},
                                {'choice_text': '√((x₀ - a)² + (y₀ - b)² + (z₀ - c)²)', 'choice_text_arabic': '√((x₀ - a)² + (y₀ - b)² + (z₀ - c)²)', 'is_correct': False},
                                {'choice_text': 'ax₀ + by₀ + cz₀ + d', 'choice_text_arabic': 'ax₀ + by₀ + cz₀ + d', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the general equation of a plane in 3D space?',
                            'question_text_arabic': 'ما هي المعادلة العامة للمستوى في الفضاء ثلاثي الأبعاد؟',
                            'question_type': 'open_short',
                            'correct_answer': 'ax + by + cz + d = 0'
                        },
                        {
                            'question_text': 'The scalar product can be used to determine if two planes are parallel.',
                            'question_text_arabic': 'يمكن استخدام الجداء القياسي لتحديد ما إذا كان مستويان متوازيان.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'If two vectors are collinear (parallel), their scalar product equals the product of their magnitudes.',
                            'question_text_arabic': 'إذا كان متجهان متوازيان، فإن جداؤهما القياسي يساوي حاصل ضرب طوليهما.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        }
                    ]
                },
                {
                    'title': 'Advanced Applications and Problem Solving',
                    'title_arabic': 'التطبيقات المتقدمة وحل المسائل',
                    'description': 'Complex problems involving scalar product in geometry and physics',
                    'description_arabic': 'مسائل معقدة تتضمن الجداء القياسي في الهندسة والفيزياء',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'In physics, work done by a constant force F through displacement d is given by:',
                            'question_text_arabic': 'في الفيزياء، الشغل المبذول بواسطة قوة ثابتة F عبر إزاحة d يُعطى بـ:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'W = F · d', 'choice_text_arabic': 'W = F · d', 'is_correct': True},
                                {'choice_text': 'W = F × d', 'choice_text_arabic': 'W = F × d', 'is_correct': False},
                                {'choice_text': 'W = |F| + |d|', 'choice_text_arabic': 'W = |F| + |d|', 'is_correct': False},
                                {'choice_text': 'W = F / d', 'choice_text_arabic': 'W = F / d', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'If vectors u, v, and w form an orthogonal basis, what is (au + bv + cw) · (du + ev + fw)?',
                            'question_text_arabic': 'إذا شكلت المتجهات u, v, w أساساً متعامداً، فما قيمة (au + bv + cw) · (du + ev + fw)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'ad|u|² + be|v|² + cf|w|²', 'choice_text_arabic': 'ad|u|² + be|v|² + cf|w|²', 'is_correct': True},
                                {'choice_text': 'ad + be + cf', 'choice_text_arabic': 'ad + be + cf', 'is_correct': False},
                                {'choice_text': '(a + b + c)(d + e + f)', 'choice_text_arabic': '(a + b + c)(d + e + f)', 'is_correct': False},
                                {'choice_text': 'adef + bcde + cfab', 'choice_text_arabic': 'adef + bcde + cfab', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'For which value of t are vectors a = (2, 3, t) and b = (1, -2, 4) perpendicular?',
                            'question_text_arabic': 'لأي قيمة لـ t يكون المتجهان a = (2, 3, t) و b = (1, -2, 4) متعامدين؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 't = 1', 'choice_text_arabic': 't = 1', 'is_correct': True},
                                {'choice_text': 't = -1', 'choice_text_arabic': 't = -1', 'is_correct': False},
                                {'choice_text': 't = 2', 'choice_text_arabic': 't = 2', 'is_correct': False},
                                {'choice_text': 't = 4', 'choice_text_arabic': 't = 4', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Find the area of triangle with vertices A(1,0,0), B(0,1,0), C(0,0,1)',
                            'question_text_arabic': 'أوجد مساحة المثلث ذي الرؤوس A(1,0,0), B(0,1,0), C(0,0,1)',
                            'question_type': 'open_short',
                            'correct_answer': '√3/2'
                        },
                        {
                            'question_text': 'The scalar triple product [u, v, w] = u · (v × w) gives the volume of the parallelepiped.',
                            'question_text_arabic': 'الجداء الثلاثي القياسي [u, v, w] = u · (v × w) يعطي حجم متوازي السطوح.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                }
            ]

            total_exercises = 0
            total_questions = 0
            total_choices = 0

            for ex_data in exercises_data:
                # Create exercise
                exercise = Exercise.objects.create(
                    lesson=lesson,
                    created_by_id=1,  # Assuming admin user with ID 1
                    title=ex_data['title'],
                    title_arabic=ex_data['title_arabic'],
                    description=ex_data['description'],
                    instructions=ex_data.get('description_arabic', ''),
                    difficulty_level=ex_data['difficulty'],
                    is_active=True
                )
                total_exercises += 1

                # Create questions for this exercise
                for q_data in ex_data['questions']:
                    question = Question.objects.create(
                        exercise=exercise,
                        question_text=q_data['question_text'],
                        question_text_arabic=q_data['question_text_arabic'],
                        question_type=q_data['question_type'],
                        points=10 if ex_data['difficulty'] == 'beginner' else 15 if ex_data['difficulty'] == 'intermediate' else 20
                    )
                    total_questions += 1

                    # Create choices for QCM questions
                    if q_data['question_type'] in ['qcm_single', 'qcm_multiple'] and 'choices' in q_data:
                        for choice_data in q_data['choices']:
                            QuestionChoice.objects.create(
                                question=question,
                                choice_text=choice_data['choice_text'],
                                choice_text_arabic=choice_data['choice_text_arabic'],
                                is_correct=choice_data['is_correct']
                            )
                            total_choices += 1

                    # Create choices for true/false questions
                    elif q_data['question_type'] == 'true_false':
                        correct_answer = q_data.get('correct_answer', 'True')
                        QuestionChoice.objects.create(
                            question=question,
                            choice_text='True',
                            choice_text_arabic='صواب',
                            is_correct=correct_answer == 'True'
                        )
                        QuestionChoice.objects.create(
                            question=question,
                            choice_text='False',
                            choice_text_arabic='خطأ',
                            is_correct=correct_answer == 'False'
                        )
                        total_choices += 2

                # Create rewards for exercise completion
                ExerciseReward.objects.create(
                    exercise=exercise,
                    completion_points=30 if ex_data['difficulty'] == 'beginner' else 50 if ex_data['difficulty'] == 'intermediate' else 70,
                    completion_coins=1,
                    perfect_score_bonus=20 if ex_data['difficulty'] == 'beginner' else 30 if ex_data['difficulty'] == 'intermediate' else 50
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created for Lesson 98 (Scalar product in space):\\n'
                    f'Exercises: {total_exercises}\\n'
                    f'Questions: {total_questions}\\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 98 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )