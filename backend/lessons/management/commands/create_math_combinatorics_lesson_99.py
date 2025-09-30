from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Counting (Combinatorics) - Lesson ID: 99'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=99)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Fundamental Counting Principles',
                    'title_arabic': 'مبادئ العد الأساسية',
                    'description': 'Understanding the multiplication and addition principles of counting',
                    'description_arabic': 'فهم مبادئ الضرب والجمع في العد',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'If there are 3 ways to choose a shirt and 4 ways to choose pants, how many different outfits can be made?',
                            'question_text_arabic': 'إذا كان هناك 3 طرق لاختيار قميص و 4 طرق لاختيار بنطال، كم عدد الملابس المختلفة التي يمكن تكوينها؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '12', 'choice_text_arabic': '12', 'is_correct': True},
                                {'choice_text': '7', 'choice_text_arabic': '7', 'is_correct': False},
                                {'choice_text': '10', 'choice_text_arabic': '10', 'is_correct': False},
                                {'choice_text': '24', 'choice_text_arabic': '24', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the multiplication principle in counting?',
                            'question_text_arabic': 'ما هو مبدأ الضرب في العد؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'If task A can be done in m ways and task B in n ways, then both tasks can be done in m × n ways', 'choice_text_arabic': 'إذا كان يمكن القيام بالمهمة A بـ m طرق والمهمة B بـ n طرق، فيمكن القيام بكلا المهمتين بـ m × n طرق', 'is_correct': True},
                                {'choice_text': 'If task A can be done in m ways and task B in n ways, then both tasks can be done in m + n ways', 'choice_text_arabic': 'إذا كان يمكن القيام بالمهمة A بـ m طرق والمهمة B بـ n طرق، فيمكن القيام بكلا المهمتين بـ m + n طرق', 'is_correct': False},
                                {'choice_text': 'Multiply all possible outcomes by 2', 'choice_text_arabic': 'ضرب جميع النتائج المحتملة في 2', 'is_correct': False},
                                {'choice_text': 'Count each task separately then multiply by the number of tasks', 'choice_text_arabic': 'عد كل مهمة بشكل منفصل ثم اضرب في عدد المهام', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A password has 2 letters followed by 3 digits. How many different passwords are possible?',
                            'question_text_arabic': 'كلمة مرور تتكون من حرفين متبوعين بـ 3 أرقام. كم عدد كلمات المرور المختلفة الممكنة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '676,000', 'choice_text_arabic': '676,000', 'is_correct': True},
                                {'choice_text': '260,000', 'choice_text_arabic': '260,000', 'is_correct': False},
                                {'choice_text': '31,000', 'choice_text_arabic': '31,000', 'is_correct': False},
                                {'choice_text': '1,000,000', 'choice_text_arabic': '1,000,000', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'When do we use the addition principle in counting?',
                            'question_text_arabic': 'متى نستخدم مبدأ الجمع في العد؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'When events are mutually exclusive (cannot happen simultaneously)', 'choice_text_arabic': 'عندما تكون الأحداث متنافية (لا يمكن أن تحدث في نفس الوقت)', 'is_correct': True},
                                {'choice_text': 'When events are independent', 'choice_text_arabic': 'عندما تكون الأحداث مستقلة', 'is_correct': False},
                                {'choice_text': 'When we want to find the total number of ways', 'choice_text_arabic': 'عندما نريد إيجاد العدد الإجمالي للطرق', 'is_correct': False},
                                {'choice_text': 'Always, regardless of the situation', 'choice_text_arabic': 'دائماً، بغض النظر عن الحالة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The multiplication principle applies when events must occur in sequence.',
                            'question_text_arabic': 'ينطبق مبدأ الضرب عندما يجب أن تحدث الأحداث بالتسلسل.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Permutations',
                    'title_arabic': 'التباديل',
                    'description': 'Arrangements of objects where order matters',
                    'description_arabic': 'ترتيبات الأشياء حيث الترتيب مهم',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is a permutation?',
                            'question_text_arabic': 'ما هو التبديل؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'An arrangement of objects where order matters', 'choice_text_arabic': 'ترتيب للأشياء حيث الترتيب مهم', 'is_correct': True},
                                {'choice_text': 'A selection of objects where order does not matter', 'choice_text_arabic': 'اختيار للأشياء حيث الترتيب غير مهم', 'is_correct': False},
                                {'choice_text': 'Any collection of distinct objects', 'choice_text_arabic': 'أي مجموعة من الأشياء المتميزة', 'is_correct': False},
                                {'choice_text': 'A mathematical operation', 'choice_text_arabic': 'عملية رياضية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The number of permutations of n distinct objects is:',
                            'question_text_arabic': 'عدد تباديل n من الأشياء المتميزة هو:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'n!', 'choice_text_arabic': 'n!', 'is_correct': True},
                                {'choice_text': 'n²', 'choice_text_arabic': 'n²', 'is_correct': False},
                                {'choice_text': '2ⁿ', 'choice_text_arabic': '2ⁿ', 'is_correct': False},
                                {'choice_text': 'n × (n-1)', 'choice_text_arabic': 'n × (n-1)', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How many ways can 5 people sit in a row?',
                            'question_text_arabic': 'بكم طريقة يمكن لـ 5 أشخاص الجلوس في صف؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '120', 'choice_text_arabic': '120', 'is_correct': True},
                                {'choice_text': '25', 'choice_text_arabic': '25', 'is_correct': False},
                                {'choice_text': '10', 'choice_text_arabic': '10', 'is_correct': False},
                                {'choice_text': '5', 'choice_text_arabic': '5', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is P(n,r) or ₙPᵣ (permutations of r objects from n objects)?',
                            'question_text_arabic': 'ما هو P(n,r) أو ₙPᵣ (تباديل r من الأشياء من n شيء)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'n!/(n-r)!', 'choice_text_arabic': 'n!/(n-r)!', 'is_correct': True},
                                {'choice_text': 'n!/r!', 'choice_text_arabic': 'n!/r!', 'is_correct': False},
                                {'choice_text': 'n!/(n-r)!r!', 'choice_text_arabic': 'n!/(n-r)!r!', 'is_correct': False},
                                {'choice_text': 'n × r', 'choice_text_arabic': 'n × r', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Calculate P(7,3)',
                            'question_text_arabic': 'احسب P(7,3)',
                            'question_type': 'open_short',
                            'correct_answer': '210'
                        }
                    ]
                },
                {
                    'title': 'Combinations',
                    'title_arabic': 'التوافيق',
                    'description': 'Selections of objects where order does not matter',
                    'description_arabic': 'اختيارات الأشياء حيث الترتيب غير مهم',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is a combination?',
                            'question_text_arabic': 'ما هو التوافق؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'A selection of objects where order does not matter', 'choice_text_arabic': 'اختيار للأشياء حيث الترتيب غير مهم', 'is_correct': True},
                                {'choice_text': 'An arrangement of objects where order matters', 'choice_text_arabic': 'ترتيب للأشياء حيث الترتيب مهم', 'is_correct': False},
                                {'choice_text': 'Any group of identical objects', 'choice_text_arabic': 'أي مجموعة من الأشياء المتطابقة', 'is_correct': False},
                                {'choice_text': 'A mathematical sequence', 'choice_text_arabic': 'متتالية رياضية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The formula for combinations C(n,r) or ₙCᵣ is:',
                            'question_text_arabic': 'صيغة التوافيق C(n,r) أو ₙCᵣ هي:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'n!/(r!(n-r)!)', 'choice_text_arabic': 'n!/(r!(n-r)!)', 'is_correct': True},
                                {'choice_text': 'n!/(n-r)!', 'choice_text_arabic': 'n!/(n-r)!', 'is_correct': False},
                                {'choice_text': 'n!/r!', 'choice_text_arabic': 'n!/r!', 'is_correct': False},
                                {'choice_text': 'n × r', 'choice_text_arabic': 'n × r', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How many ways can you choose 3 students from a class of 10?',
                            'question_text_arabic': 'بكم طريقة يمكنك اختيار 3 طلاب من فصل من 10 طلاب؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '120', 'choice_text_arabic': '120', 'is_correct': True},
                                {'choice_text': '720', 'choice_text_arabic': '720', 'is_correct': False},
                                {'choice_text': '30', 'choice_text_arabic': '30', 'is_correct': False},
                                {'choice_text': '1000', 'choice_text_arabic': '1000', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the relationship between permutations and combinations?',
                            'question_text_arabic': 'ما هي العلاقة بين التباديل والتوافيق؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'P(n,r) = C(n,r) × r!', 'choice_text_arabic': 'P(n,r) = C(n,r) × r!', 'is_correct': True},
                                {'choice_text': 'C(n,r) = P(n,r) × r!', 'choice_text_arabic': 'C(n,r) = P(n,r) × r!', 'is_correct': False},
                                {'choice_text': 'P(n,r) = C(n,r) + r!', 'choice_text_arabic': 'P(n,r) = C(n,r) + r!', 'is_correct': False},
                                {'choice_text': 'They are always equal', 'choice_text_arabic': 'هما متساويان دائماً', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Calculate C(8,5)',
                            'question_text_arabic': 'احسب C(8,5)',
                            'question_type': 'open_short',
                            'correct_answer': '56'
                        },
                        {
                            'question_text': 'C(n,r) = C(n,n-r) for any valid values of n and r.',
                            'question_text_arabic': 'C(n,r) = C(n,n-r) لأي قيم صحيحة لـ n و r.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Binomial Theorem and Applications',
                    'title_arabic': 'مبرهنة ذات الحدين والتطبيقات',
                    'description': 'Using combinations in the binomial theorem and probability',
                    'description_arabic': 'استخدام التوافيق في مبرهنة ذات الحدين والاحتمالات',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'The binomial theorem states that (a + b)ⁿ equals:',
                            'question_text_arabic': 'تنص مبرهنة ذات الحدين على أن (a + b)ⁿ تساوي:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Σ(k=0 to n) C(n,k) aⁿ⁻ᵏ bᵏ', 'choice_text_arabic': 'Σ(k=0 to n) C(n,k) aⁿ⁻ᵏ bᵏ', 'is_correct': True},
                                {'choice_text': 'aⁿ + bⁿ', 'choice_text_arabic': 'aⁿ + bⁿ', 'is_correct': False},
                                {'choice_text': 'n × (a + b)', 'choice_text_arabic': 'n × (a + b)', 'is_correct': False},
                                {'choice_text': '(a × b)ⁿ', 'choice_text_arabic': '(a × b)ⁿ', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the coefficient of x³ in the expansion of (1 + x)⁵?',
                            'question_text_arabic': 'ما هو معامل x³ في تفكيك (1 + x)⁵؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '10', 'choice_text_arabic': '10', 'is_correct': True},
                                {'choice_text': '5', 'choice_text_arabic': '5', 'is_correct': False},
                                {'choice_text': '15', 'choice_text_arabic': '15', 'is_correct': False},
                                {'choice_text': '3', 'choice_text_arabic': '3', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Pascal\'s triangle is related to:',
                            'question_text_arabic': 'مثلث باسكال مرتبط بـ:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Binomial coefficients C(n,k)', 'choice_text_arabic': 'معاملات ذات الحدين C(n,k)', 'is_correct': True},
                                {'choice_text': 'Prime numbers', 'choice_text_arabic': 'الأعداد الأولية', 'is_correct': False},
                                {'choice_text': 'Geometric sequences', 'choice_text_arabic': 'المتتاليات الهندسية', 'is_correct': False},
                                {'choice_text': 'Trigonometric functions', 'choice_text_arabic': 'الدوال المثلثية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How many subsets does a set with n elements have?',
                            'question_text_arabic': 'كم عدد المجموعات الجزئية لمجموعة بها n عنصراً؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '2ⁿ', 'choice_text_arabic': '2ⁿ', 'is_correct': True},
                                {'choice_text': 'n!', 'choice_text_arabic': 'n!', 'is_correct': False},
                                {'choice_text': 'n²', 'choice_text_arabic': 'n²', 'is_correct': False},
                                {'choice_text': '2n', 'choice_text_arabic': '2n', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Expand (x + 2)³',
                            'question_text_arabic': 'فكك (x + 2)³',
                            'question_type': 'open_short',
                            'correct_answer': 'x³ + 6x² + 12x + 8'
                        }
                    ]
                },
                {
                    'title': 'Advanced Counting Problems',
                    'title_arabic': 'مسائل العد المتقدمة',
                    'description': 'Complex counting problems involving restrictions and multiple conditions',
                    'description_arabic': 'مسائل عد معقدة تتضمن قيود وشروط متعددة',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'How many 4-digit numbers can be formed using digits 1,2,3,4,5 without repetition?',
                            'question_text_arabic': 'كم عدداً من 4 أرقام يمكن تكوينه باستخدام الأرقام 1,2,3,4,5 دون تكرار؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '120', 'choice_text_arabic': '120', 'is_correct': True},
                                {'choice_text': '625', 'choice_text_arabic': '625', 'is_correct': False},
                                {'choice_text': '20', 'choice_text_arabic': '20', 'is_correct': False},
                                {'choice_text': '5', 'choice_text_arabic': '5', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In how many ways can 6 people be arranged in a circle?',
                            'question_text_arabic': 'بكم طريقة يمكن ترتيب 6 أشخاص في دائرة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '120', 'choice_text_arabic': '120', 'is_correct': True},
                                {'choice_text': '720', 'choice_text_arabic': '720', 'is_correct': False},
                                {'choice_text': '36', 'choice_text_arabic': '36', 'is_correct': False},
                                {'choice_text': '24', 'choice_text_arabic': '24', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How many ways can you arrange the letters in BANANA?',
                            'question_text_arabic': 'بكم طريقة يمكن ترتيب حروف كلمة BANANA؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '60', 'choice_text_arabic': '60', 'is_correct': True},
                                {'choice_text': '720', 'choice_text_arabic': '720', 'is_correct': False},
                                {'choice_text': '120', 'choice_text_arabic': '120', 'is_correct': False},
                                {'choice_text': '30', 'choice_text_arabic': '30', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the inclusion-exclusion principle used for?',
                            'question_text_arabic': 'لماذا يُستخدم مبدأ الإدراج-الاستبعاد؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Counting elements in overlapping sets', 'choice_text_arabic': 'عد العناصر في المجموعات المتداخلة', 'is_correct': True},
                                {'choice_text': 'Finding permutations with restrictions', 'choice_text_arabic': 'إيجاد التباديل مع القيود', 'is_correct': False},
                                {'choice_text': 'Calculating combinations only', 'choice_text_arabic': 'حساب التوافيق فقط', 'is_correct': False},
                                {'choice_text': 'Solving probability problems only', 'choice_text_arabic': 'حل مسائل الاحتمالات فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How many integers from 1 to 100 are divisible by 3 or 5?',
                            'question_text_arabic': 'كم عدداً صحيحاً من 1 إلى 100 قابل للقسمة على 3 أو 5؟',
                            'question_type': 'open_short',
                            'correct_answer': '47'
                        },
                        {
                            'question_text': 'Circular permutations of n objects is (n-1)!',
                            'question_text_arabic': 'التباديل الدائرية لـ n من الأشياء هي (n-1)!',
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
                    f'Successfully created for Lesson 99 (Counting - Combinatorics):\\n'
                    f'Exercises: {total_exercises}\\n'
                    f'Questions: {total_questions}\\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 99 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )