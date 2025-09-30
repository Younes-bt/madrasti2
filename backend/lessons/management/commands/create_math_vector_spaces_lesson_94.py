from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Lesson 94: Real vector spaces'

    def handle(self, *args, **options):
        lesson_id = 94

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
                'title': 'Introduction to Vector Spaces',
                'title_ar': 'مقدمة في الفضاءات الشعاعية',
                'description': 'Understanding the definition and axioms of vector spaces',
                'description_ar': 'فهم تعريف وبديهيات الفضاءات الشعاعية',
                'difficulty': 'beginner',
                'points': 10,
                'questions': [
                    {
                        'text': 'What is a vector space?',
                        'text_ar': 'ما هو الفضاء الشعاعي؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'A set of vectors with operations of addition and scalar multiplication', 'text_ar': 'مجموعة من الأشعة مع عمليات الجمع والضرب القياسي', 'is_correct': True},
                            {'text': 'Any set of numbers', 'text_ar': 'أي مجموعة من الأرقام', 'is_correct': False},
                            {'text': 'A geometric space with coordinates', 'text_ar': 'فضاء هندسي بإحداثيات', 'is_correct': False},
                            {'text': 'A collection of matrices', 'text_ar': 'مجموعة من المصفوفات', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which are fundamental operations in a vector space?',
                        'text_ar': 'أي العمليات الأساسية في الفضاء الشعاعي؟',
                        'type': 'qcm_multiple',
                        'points': 3,
                        'choices': [
                            {'text': 'Vector addition', 'text_ar': 'جمع الأشعة', 'is_correct': True},
                            {'text': 'Scalar multiplication', 'text_ar': 'الضرب القياسي', 'is_correct': True},
                            {'text': 'Zero vector existence', 'text_ar': 'وجود الشعاع الصفري', 'is_correct': True},
                            {'text': 'Vector division', 'text_ar': 'قسمة الأشعة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the zero vector in R²?',
                        'text_ar': 'ما هو الشعاع الصفري في R²؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': '(0, 0)', 'text_ar': '(0, 0)', 'is_correct': True},
                            {'text': '(1, 1)', 'text_ar': '(1, 1)', 'is_correct': False},
                            {'text': '(1, 0)', 'text_ar': '(1, 0)', 'is_correct': False},
                            {'text': 'undefined', 'text_ar': 'غير محدد', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Every vector has an additive inverse in a vector space.',
                        'text_ar': 'كل شعاع له نظير جمعي في الفضاء الشعاعي.',
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
                'title': 'Linear Independence and Dependence',
                'title_ar': 'الاستقلال والتبعية الخطية',
                'description': 'Understanding linear independence, dependence, and spanning sets',
                'description_ar': 'فهم الاستقلال والتبعية الخطية والمجموعات المولدة',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'When are vectors linearly independent?',
                        'text_ar': 'متى تكون الأشعة مستقلة خطياً؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'When no vector can be written as a linear combination of others', 'text_ar': 'عندما لا يمكن كتابة أي شعاع كتركيب خطي للآخرين', 'is_correct': True},
                            {'text': 'When all vectors are the same', 'text_ar': 'عندما تكون جميع الأشعة متساوية', 'is_correct': False},
                            {'text': 'When vectors are perpendicular', 'text_ar': 'عندما تكون الأشعة عمودية', 'is_correct': False},
                            {'text': 'When vectors have the same length', 'text_ar': 'عندما تكون الأشعة بنفس الطول', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What does it mean for vectors to span a space?',
                        'text_ar': 'ماذا يعني أن الأشعة تولد فضاءً؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'Every vector in the space can be written as their linear combination', 'text_ar': 'كل شعاع في الفضاء يمكن كتابته كتركيب خطي لها', 'is_correct': True},
                            {'text': 'The vectors fill the entire space', 'text_ar': 'الأشعة تملأ الفضاء بالكامل', 'is_correct': False},
                            {'text': 'The vectors are orthogonal', 'text_ar': 'الأشعة متعامدة', 'is_correct': False},
                            {'text': 'The vectors have unit length', 'text_ar': 'الأشعة لها طول وحدة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which conditions characterize linear dependence?',
                        'text_ar': 'أي الشروط تميز التبعية الخطية؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'At least one vector is a linear combination of others', 'text_ar': 'على الأقل شعاع واحد هو تركيب خطي للآخرين', 'is_correct': True},
                            {'text': 'The zero vector can be written as a non-trivial combination', 'text_ar': 'الشعاع الصفري يمكن كتابته كتركيب غير بديهي', 'is_correct': True},
                            {'text': 'More vectors than dimensions', 'text_ar': 'أشعة أكثر من الأبعاد', 'is_correct': True},
                            {'text': 'All vectors have the same direction', 'text_ar': 'جميع الأشعة لها نفس الاتجاه', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Determine if vectors (1,2) and (2,4) are linearly independent.',
                        'text_ar': 'حدد إذا كان الشعاعان (1,2) و (2,4) مستقلين خطياً.',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Basis and Dimension',
                'title_ar': 'الأساس والبُعد',
                'description': 'Understanding basis, dimension, and coordinate systems',
                'description_ar': 'فهم الأساس والبُعد وأنظمة الإحداثيات',
                'difficulty': 'intermediate',
                'points': 15,
                'questions': [
                    {
                        'text': 'What is a basis of a vector space?',
                        'text_ar': 'ما هو أساس الفضاء الشعاعي؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'A linearly independent set that spans the space', 'text_ar': 'مجموعة مستقلة خطياً تولد الفضاء', 'is_correct': True},
                            {'text': 'Any set of vectors in the space', 'text_ar': 'أي مجموعة من الأشعة في الفضاء', 'is_correct': False},
                            {'text': 'The largest set of vectors', 'text_ar': 'أكبر مجموعة من الأشعة', 'is_correct': False},
                            {'text': 'A set of perpendicular vectors', 'text_ar': 'مجموعة من الأشعة المتعامدة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the dimension of R³?',
                        'text_ar': 'ما هو بُعد R³؟',
                        'type': 'qcm_single',
                        'points': 3,
                        'choices': [
                            {'text': '3', 'text_ar': '3', 'is_correct': True},
                            {'text': '2', 'text_ar': '2', 'is_correct': False},
                            {'text': '4', 'text_ar': '4', 'is_correct': False},
                            {'text': '1', 'text_ar': '1', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which properties hold for bases?',
                        'text_ar': 'أي الخصائص صحيحة للأسس؟',
                        'type': 'qcm_multiple',
                        'points': 4,
                        'choices': [
                            {'text': 'All bases of a space have the same number of vectors', 'text_ar': 'جميع أسس الفضاء لها نفس عدد الأشعة', 'is_correct': True},
                            {'text': 'Every vector has unique coordinates with respect to a basis', 'text_ar': 'كل شعاع له إحداثيات وحيدة بالنسبة لأساس', 'is_correct': True},
                            {'text': 'Bases are minimal spanning sets', 'text_ar': 'الأسس هي أصغر مجموعات مولدة', 'is_correct': True},
                            {'text': 'All bases must be orthogonal', 'text_ar': 'جميع الأسس يجب أن تكون متعامدة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The standard basis for R² is {(1,0), (0,1)}.',
                        'text_ar': 'الأساس المعياري لـ R² هو {(1,0), (0,1)}.',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Find coordinates of vector (5,3) with respect to basis {(1,1), (1,-1)}.',
                        'text_ar': 'أوجد إحداثيات الشعاع (5,3) بالنسبة للأساس {(1,1), (1,-1)}.',
                        'type': 'open_short',
                        'points': 2,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Subspaces',
                'title_ar': 'الفضاءات الجزئية',
                'description': 'Understanding subspaces and their properties',
                'description_ar': 'فهم الفضاءات الجزئية وخصائصها',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'What is a subspace of a vector space?',
                        'text_ar': 'ما هو الفضاء الجزئي للفضاء الشعاعي؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'A subset that is closed under addition and scalar multiplication', 'text_ar': 'مجموعة جزئية مغلقة تحت الجمع والضرب القياسي', 'is_correct': True},
                            {'text': 'Any subset of vectors', 'text_ar': 'أي مجموعة جزئية من الأشعة', 'is_correct': False},
                            {'text': 'A smaller dimension space', 'text_ar': 'فضاء بُعد أصغر', 'is_correct': False},
                            {'text': 'A subset containing the origin', 'text_ar': 'مجموعة جزئية تحتوي على الأصل', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which conditions must a subset satisfy to be a subspace?',
                        'text_ar': 'أي الشروط يجب أن تحققها المجموعة الجزئية لتكون فضاءً جزئياً؟',
                        'type': 'qcm_multiple',
                        'points': 6,
                        'choices': [
                            {'text': 'Contains the zero vector', 'text_ar': 'تحتوي على الشعاع الصفري', 'is_correct': True},
                            {'text': 'Closed under vector addition', 'text_ar': 'مغلقة تحت جمع الأشعة', 'is_correct': True},
                            {'text': 'Closed under scalar multiplication', 'text_ar': 'مغلقة تحت الضرب القياسي', 'is_correct': True},
                            {'text': 'Contains all unit vectors', 'text_ar': 'تحتوي على جميع أشعة الوحدة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the span of a set of vectors?',
                        'text_ar': 'ما هو المدى لمجموعة من الأشعة؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'The set of all linear combinations of those vectors', 'text_ar': 'مجموعة جميع التراكيب الخطية لتلك الأشعة', 'is_correct': True},
                            {'text': 'The distance between vectors', 'text_ar': 'المسافة بين الأشعة', 'is_correct': False},
                            {'text': 'The maximum length of vectors', 'text_ar': 'أقصى طول للأشعة', 'is_correct': False},
                            {'text': 'The angle between vectors', 'text_ar': 'الزاوية بين الأشعة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The intersection of two subspaces is always a subspace.',
                        'text_ar': 'تقاطع فضاءين جزئيين دائماً فضاء جزئي.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Show that the set {(x,y,z) : x + y + z = 0} is a subspace of R³.',
                        'text_ar': 'أثبت أن المجموعة {(x,y,z) : x + y + z = 0} فضاء جزئي من R³.',
                        'type': 'open_short',
                        'points': 3,
                        'choices': []
                    }
                ]
            },
            {
                'title': 'Linear Transformations',
                'title_ar': 'التحويلات الخطية',
                'description': 'Understanding linear transformations and their properties',
                'description_ar': 'فهم التحويلات الخطية وخصائصها',
                'difficulty': 'advanced',
                'points': 20,
                'questions': [
                    {
                        'text': 'What is a linear transformation?',
                        'text_ar': 'ما هو التحويل الخطي؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'A function T: V → W that preserves addition and scalar multiplication', 'text_ar': 'دالة T: V → W تحافظ على الجمع والضرب القياسي', 'is_correct': True},
                            {'text': 'Any function between vector spaces', 'text_ar': 'أي دالة بين الفضاءات الشعاعية', 'is_correct': False},
                            {'text': 'A transformation that changes dimensions', 'text_ar': 'تحويل يغير الأبعاد', 'is_correct': False},
                            {'text': 'A geometric rotation or reflection', 'text_ar': 'دوران أو انعكاس هندسي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which properties must T satisfy to be linear?',
                        'text_ar': 'أي الخصائص يجب أن يحققها T ليكون خطياً؟',
                        'type': 'qcm_multiple',
                        'points': 6,
                        'choices': [
                            {'text': 'T(u + v) = T(u) + T(v)', 'text_ar': 'T(u + v) = T(u) + T(v)', 'is_correct': True},
                            {'text': 'T(cu) = cT(u)', 'text_ar': 'T(cu) = cT(u)', 'is_correct': True},
                            {'text': 'T(0) = 0', 'text_ar': 'T(0) = 0', 'is_correct': True},
                            {'text': 'T preserves all distances', 'text_ar': 'T يحافظ على جميع المسافات', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What are the kernel and image of a linear transformation?',
                        'text_ar': 'ما هما النواة والصورة للتحويل الخطي؟',
                        'type': 'qcm_single',
                        'points': 4,
                        'choices': [
                            {'text': 'Kernel: vectors mapped to zero; Image: all possible outputs', 'text_ar': 'النواة: الأشعة المحولة للصفر؛ الصورة: جميع المخرجات الممكنة', 'is_correct': True},
                            {'text': 'Kernel: all inputs; Image: zero vector', 'text_ar': 'النواة: جميع المدخلات؛ الصورة: الشعاع الصفري', 'is_correct': False},
                            {'text': 'Kernel: basis vectors; Image: transformed basis', 'text_ar': 'النواة: أشعة الأساس؛ الصورة: الأساس المحول', 'is_correct': False},
                            {'text': 'Kernel and image are the same', 'text_ar': 'النواة والصورة متطابقتان', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'A linear transformation is one-to-one if and only if its kernel contains only the zero vector.',
                        'text_ar': 'التحويل الخطي أحادي إذا وفقط إذا كانت نواته تحتوي على الشعاع الصفري فقط.',
                        'type': 'true_false',
                        'points': 3,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Find the matrix representation of the linear transformation T(x,y) = (2x + y, x - y) from R² to R².',
                        'text_ar': 'أوجد تمثيل المصفوفة للتحويل الخطي T(x,y) = (2x + y, x - y) من R² إلى R².',
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