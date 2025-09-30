from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Lesson 93: Conic sections (Curves of the second degree)'

    def handle(self, *args, **options):
        lesson_id = 93

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
                'title': 'Introduction to Conic Sections',
                'title_ar': 'مقدمة في المقاطع المخروطية',
                'description': 'Understanding the basic definition and types of conic sections',
                'description_ar': 'فهم التعريف الأساسي وأنواع المقاطع المخروطية',
                'difficulty': 'beginner',
                'points': 10,
                'questions': [
                    {
                        'text': 'What are conic sections?',
                        'text_ar': 'ما هي المقاطع المخروطية؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Curves formed by intersecting a cone with a plane', 'text_ar': 'منحنيات تتكون من تقاطع مخروط مع مستوى', 'is_correct': True},
                            {'text': 'All curves with degree 2', 'text_ar': 'جميع المنحنيات من الدرجة 2', 'is_correct': False},
                            {'text': 'Only circular curves', 'text_ar': 'المنحنيات الدائرية فقط', 'is_correct': False},
                            {'text': 'Linear equations in two variables', 'text_ar': 'المعادلات الخطية في متغيرين', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What are the four types of conic sections?',
                        'text_ar': 'ما هي الأنواع الأربعة للمقاطع المخروطية؟',
                        'type': 'qcm_multiple',
                        'points': 3,
                        'choices': [
                            {'text': 'Circle', 'text_ar': 'الدائرة', 'is_correct': True},
                            {'text': 'Ellipse', 'text_ar': 'الإهليلج', 'is_correct': True},
                            {'text': 'Parabola', 'text_ar': 'القطع المكافئ', 'is_correct': True},
                            {'text': 'Hyperbola', 'text_ar': 'القطع الزائد', 'is_correct': True}
                        ]
                    },
                    {
                        'text': 'What is the general form of a second-degree equation in two variables?',
                        'text_ar': 'ما هي الصيغة العامة لمعادلة من الدرجة الثانية في متغيرين؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'Ax² + Bxy + Cy² + Dx + Ey + F = 0', 'text_ar': 'Ax² + Bxy + Cy² + Dx + Ey + F = 0', 'is_correct': True},
                            {'text': 'Ax + By + C = 0', 'text_ar': 'Ax + By + C = 0', 'is_correct': False},
                            {'text': 'Ax² + Bx + C = 0', 'text_ar': 'Ax² + Bx + C = 0', 'is_correct': False},
                            {'text': 'x² + y² = r²', 'text_ar': 'x² + y² = r²', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'A circle is a special case of an ellipse.',
                        'text_ar': 'الدائرة حالة خاصة من الإهليلج.',
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
                'title': 'Circles and Ellipses',
                'title_ar': 'الدوائر والإهليلجات',
                'description': 'Understanding the properties and equations of circles and ellipses',
                'description_ar': 'فهم خصائص ومعادلات الدوائر والإهليلجات',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What is the standard form of a circle with center (h, k) and radius r?',
                        'text_ar': 'ما هي الصيغة المعيارية للدائرة بمركز (h, k) ونصف قطر r؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': '(x - h)² + (y - k)² = r²', 'text_ar': '(x - h)² + (y - k)² = r²', 'is_correct': True},
                            {'text': '(x + h)² + (y + k)² = r²', 'text_ar': '(x + h)² + (y + k)² = r²', 'is_correct': False},
                            {'text': 'x² + y² = (h + k)²', 'text_ar': 'x² + y² = (h + k)²', 'is_correct': False},
                            {'text': '(x - h) + (y - k) = r', 'text_ar': '(x - h) + (y - k) = r', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the standard form of an ellipse centered at the origin?',
                        'text_ar': 'ما هي الصيغة المعيارية للإهليلج بمركز عند الأصل؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'x²/a² + y²/b² = 1', 'text_ar': 'x²/a² + y²/b² = 1', 'is_correct': True},
                            {'text': 'x²/a + y²/b = 1', 'text_ar': 'x²/a + y²/b = 1', 'is_correct': False},
                            {'text': 'x² + y² = a²b²', 'text_ar': 'x² + y² = a²b²', 'is_correct': False},
                            {'text': 'ax² + by² = 1', 'text_ar': 'ax² + by² = 1', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which parameters define an ellipse?',
                        'text_ar': 'أي المعاملات تحدد الإهليلج؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'Semi-major axis (a)', 'text_ar': 'نصف المحور الكبير (a)', 'is_correct': True},
                            {'text': 'Semi-minor axis (b)', 'text_ar': 'نصف المحور الصغير (b)', 'is_correct': True},
                            {'text': 'Foci', 'text_ar': 'البؤرتان', 'is_correct': True},
                            {'text': 'Diameter only', 'text_ar': 'القطر فقط', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Find the center and radius of the circle x² + y² - 6x + 4y - 12 = 0.',
                        'text_ar': 'أوجد مركز ونصف قطر الدائرة x² + y² - 6x + 4y - 12 = 0.',
                        'type': 'open_short',
                        'points': 5,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Parabolas',
                'title_ar': 'القطوع المكافئة',
                'description': 'Understanding the properties and equations of parabolas',
                'description_ar': 'فهم خصائص ومعادلات القطوع المكافئة',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What is the standard form of a parabola opening upward with vertex at the origin?',
                        'text_ar': 'ما هي الصيغة المعيارية للقطع المكافئ المتجه للأعلى برأس عند الأصل؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': 'x² = 4py', 'text_ar': 'x² = 4py', 'is_correct': True},
                            {'text': 'y² = 4px', 'text_ar': 'y² = 4px', 'is_correct': False},
                            {'text': 'x² + y² = p²', 'text_ar': 'x² + y² = p²', 'is_correct': False},
                            {'text': 'xy = p', 'text_ar': 'xy = p', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the focus of the parabola x² = 8y?',
                        'text_ar': 'ما هي بؤرة القطع المكافئ x² = 8y؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': '(0, 2)', 'text_ar': '(0, 2)', 'is_correct': True},
                            {'text': '(0, 8)', 'text_ar': '(0, 8)', 'is_correct': False},
                            {'text': '(2, 0)', 'text_ar': '(2, 0)', 'is_correct': False},
                            {'text': '(0, 4)', 'text_ar': '(0, 4)', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which are key elements of a parabola?',
                        'text_ar': 'أي العناصر الرئيسية للقطع المكافئ؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'Vertex', 'text_ar': 'الرأس', 'is_correct': True},
                            {'text': 'Focus', 'text_ar': 'البؤرة', 'is_correct': True},
                            {'text': 'Directrix', 'text_ar': 'الدليل', 'is_correct': True},
                            {'text': 'Center', 'text_ar': 'المركز', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The distance from any point on a parabola to the focus equals its distance to the directrix.',
                        'text_ar': 'المسافة من أي نقطة على القطع المكافئ إلى البؤرة تساوي مسافتها إلى الدليل.',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Find the vertex and focus of the parabola y = 2x² + 8x + 6.',
                        'text_ar': 'أوجد رأس وبؤرة القطع المكافئ y = 2x² + 8x + 6.',
                        'type': 'open_short',
                        'points': 2,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Hyperbolas',
                'title_ar': 'القطوع الزائدة',
                'description': 'Understanding the properties and equations of hyperbolas',
                'description_ar': 'فهم خصائص ومعادلات القطوع الزائدة',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'What is the standard form of a hyperbola centered at the origin with a horizontal transverse axis?',
                        'text_ar': 'ما هي الصيغة المعيارية للقطع الزائد بمركز عند الأصل ومحور مستعرض أفقي؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'x²/a² - y²/b² = 1', 'text_ar': 'x²/a² - y²/b² = 1', 'is_correct': True},
                            {'text': 'x²/a² + y²/b² = 1', 'text_ar': 'x²/a² + y²/b² = 1', 'is_correct': False},
                            {'text': 'y²/a² - x²/b² = 1', 'text_ar': 'y²/a² - x²/b² = 1', 'is_correct': False},
                            {'text': 'xy = ab', 'text_ar': 'xy = ab', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What are the foci of the hyperbola x²/9 - y²/16 = 1?',
                        'text_ar': 'ما هما بؤرتا القطع الزائد x²/9 - y²/16 = 1؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': '(±5, 0)', 'text_ar': '(±5, 0)', 'is_correct': True},
                            {'text': '(±3, 0)', 'text_ar': '(±3, 0)', 'is_correct': False},
                            {'text': '(±4, 0)', 'text_ar': '(±4, 0)', 'is_correct': False},
                            {'text': '(0, ±5)', 'text_ar': '(0, ±5)', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which characteristics define a hyperbola?',
                        'text_ar': 'أي الخصائص تحدد القطع الزائد؟',
                        'type': 'qcm_multiple',
                        'points': 6,
                        'choices': [
                            {'text': 'Two branches', 'text_ar': 'فرعان', 'is_correct': True},
                            {'text': 'Two foci', 'text_ar': 'بؤرتان', 'is_correct': True},
                            {'text': 'Asymptotes', 'text_ar': 'المقاربات', 'is_correct': True},
                            {'text': 'Single vertex', 'text_ar': 'رأس واحد', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The asymptotes of the hyperbola x²/a² - y²/b² = 1 are y = ±(b/a)x.',
                        'text_ar': 'مقاربات القطع الزائد x²/a² - y²/b² = 1 هي y = ±(b/a)x.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Find the vertices and asymptotes of the hyperbola 4x² - 9y² = 36.',
                        'text_ar': 'أوجد رؤوس ومقاربات القطع الزائد 4x² - 9y² = 36.',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Applications and Problem Solving',
                'title_ar': 'التطبيقات وحل المسائل',
                'description': 'Real-world applications and problem-solving with conic sections',
                'description_ar': 'التطبيقات الحقيقية وحل المسائل مع المقاطع المخروطية',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'Which conic section is used in satellite dish designs?',
                        'text_ar': 'أي مقطع مخروطي يستخدم في تصاميم الأطباق اللاقطة؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'Parabola', 'text_ar': 'القطع المكافئ', 'is_correct': True},
                            {'text': 'Circle', 'text_ar': 'الدائرة', 'is_correct': False},
                            {'text': 'Ellipse', 'text_ar': 'الإهليلج', 'is_correct': False},
                            {'text': 'Hyperbola', 'text_ar': 'القطع الزائد', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What shape do planetary orbits typically follow?',
                        'text_ar': 'أي شكل تتبعه المدارات الكوكبية عادة؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'Ellipse', 'text_ar': 'الإهليلج', 'is_correct': True},
                            {'text': 'Perfect circle', 'text_ar': 'دائرة مثالية', 'is_correct': False},
                            {'text': 'Parabola', 'text_ar': 'القطع المكافئ', 'is_correct': False},
                            {'text': 'Hyperbola', 'text_ar': 'القطع الزائد', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which applications use conic sections?',
                        'text_ar': 'أي التطبيقات تستخدم المقاطع المخروطية؟',
                        'type': 'qcm_multiple',
                        'points': 6,
                        'choices': [
                            {'text': 'Architecture (arches and domes)', 'text_ar': 'الهندسة المعمارية (الأقواس والقباب)', 'is_correct': True},
                            {'text': 'Navigation systems (GPS)', 'text_ar': 'أنظمة الملاحة (GPS)', 'is_correct': True},
                            {'text': 'Telescope and microscope design', 'text_ar': 'تصميم التلسكوبات والمجاهر', 'is_correct': True},
                            {'text': 'Digital photography only', 'text_ar': 'التصوير الرقمي فقط', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Hyperbolas are used in LORAN navigation systems.',
                        'text_ar': 'القطوع الزائدة تستخدم في أنظمة الملاحة LORAN.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'A bridge has a parabolic arch. If the arch is 40 meters wide at the base and 16 meters high at the center, find the equation of the parabola.',
                        'text_ar': 'جسر له قوس مكافئ. إذا كان عرض القوس 40 متراً عند القاعدة و16 متراً في الارتفاع عند المركز، أوجد معادلة القطع المكافئ.',
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