from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Immunology - Lesson ID: 111'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=111)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Introduction to Immunology',
                    'title_arabic': 'مقدمة في علم المناعة',
                    'description': 'Basic concepts of the immune system',
                    'description_arabic': 'المفاهيم الأساسية لجهاز المناعة',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is immunology?',
                            'question_text_arabic': 'ما هو علم المناعة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Study of the immune system and its responses', 'choice_text_arabic': 'دراسة جهاز المناعة واستجاباته', 'is_correct': True},
                                {'choice_text': 'Study of infectious diseases only', 'choice_text_arabic': 'دراسة الأمراض المعدية فقط', 'is_correct': False},
                                {'choice_text': 'Study of antibiotics', 'choice_text_arabic': 'دراسة المضادات الحيوية', 'is_correct': False},
                                {'choice_text': 'Study of vaccination only', 'choice_text_arabic': 'دراسة التطعيم فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the primary function of the immune system?',
                            'question_text_arabic': 'ما هي الوظيفة الأساسية لجهاز المناعة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Protect the body from foreign substances and pathogens', 'choice_text_arabic': 'حماية الجسم من المواد الغريبة ومسببات الأمراض', 'is_correct': True},
                                {'choice_text': 'Digest food in the stomach', 'choice_text_arabic': 'هضم الطعام في المعدة', 'is_correct': False},
                                {'choice_text': 'Pump blood throughout the body', 'choice_text_arabic': 'ضخ الدم في جميع أنحاء الجسم', 'is_correct': False},
                                {'choice_text': 'Control breathing patterns', 'choice_text_arabic': 'التحكم في أنماط التنفس', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are antigens?',
                            'question_text_arabic': 'ما هي المستضدات؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Foreign substances that trigger immune responses', 'choice_text_arabic': 'مواد غريبة تحفز الاستجابات المناعية', 'is_correct': True},
                                {'choice_text': 'Immune system cells only', 'choice_text_arabic': 'خلايا الجهاز المناعي فقط', 'is_correct': False},
                                {'choice_text': 'Types of vitamins', 'choice_text_arabic': 'أنواع الفيتامينات', 'is_correct': False},
                                {'choice_text': 'Digestive enzymes', 'choice_text_arabic': 'إنزيمات الهضم', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The immune system can distinguish between self and non-self.',
                            'question_text_arabic': 'جهاز المناعة يمكنه التمييز بين الذات وغير الذات.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Types of Immunity',
                    'title_arabic': 'أنواع المناعة',
                    'description': 'Innate vs adaptive immunity and their characteristics',
                    'description_arabic': 'المناعة الفطرية مقابل المناعة التكيفية وخصائصهما',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What characterizes innate immunity?',
                            'question_text_arabic': 'ما الذي يميز المناعة الفطرية؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Present from birth', 'choice_text_arabic': 'موجودة منذ الولادة', 'is_correct': True},
                                {'choice_text': 'Non-specific response', 'choice_text_arabic': 'استجابة غير محددة', 'is_correct': True},
                                {'choice_text': 'Immediate response', 'choice_text_arabic': 'استجابة فورية', 'is_correct': True},
                                {'choice_text': 'Memory formation', 'choice_text_arabic': 'تكوين الذاكرة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which cells are part of innate immunity?',
                            'question_text_arabic': 'أي خلايا جزء من المناعة الفطرية؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Neutrophils', 'choice_text_arabic': 'العدلات', 'is_correct': True},
                                {'choice_text': 'Macrophages', 'choice_text_arabic': 'البلاعم الكبيرة', 'is_correct': True},
                                {'choice_text': 'Natural killer cells', 'choice_text_arabic': 'الخلايا القاتلة الطبيعية', 'is_correct': True},
                                {'choice_text': 'B cells', 'choice_text_arabic': 'الخلايا البائية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is adaptive immunity?',
                            'question_text_arabic': 'ما هي المناعة التكيفية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Specific immunity that develops with exposure and creates memory', 'choice_text_arabic': 'مناعة محددة تتطور مع التعرض وتخلق ذاكرة', 'is_correct': True},
                                {'choice_text': 'General protection present from birth', 'choice_text_arabic': 'حماية عامة موجودة منذ الولادة', 'is_correct': False},
                                {'choice_text': 'Physical barriers like skin', 'choice_text_arabic': 'حواجز فيزيائية مثل الجلد', 'is_correct': False},
                                {'choice_text': 'Chemical defenses only', 'choice_text_arabic': 'دفاعات كيميائية فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Adaptive immunity is faster than innate immunity.',
                            'question_text_arabic': 'المناعة التكيفية أسرع من المناعة الفطرية.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        },
                        {
                            'question_text': 'Innate immunity provides the first line of defense.',
                            'question_text_arabic': 'المناعة الفطرية توفر خط الدفاع الأول.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Antibodies and B Cells',
                    'title_arabic': 'الأجسام المضادة والخلايا البائية',
                    'description': 'Humoral immunity and antibody function',
                    'description_arabic': 'المناعة الخلطية ووظيفة الأجسام المضادة',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What are antibodies?',
                            'question_text_arabic': 'ما هي الأجسام المضادة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Proteins produced by B cells that bind to specific antigens', 'choice_text_arabic': 'بروتينات ينتجها الخلايا البائية ترتبط بمستضدات محددة', 'is_correct': True},
                                {'choice_text': 'Cells that destroy pathogens directly', 'choice_text_arabic': 'خلايا تدمر مسببات الأمراض مباشرة', 'is_correct': False},
                                {'choice_text': 'Chemical barriers in the skin', 'choice_text_arabic': 'حواجز كيميائية في الجلد', 'is_correct': False},
                                {'choice_text': 'Digestive enzymes', 'choice_text_arabic': 'إنزيمات الهضم', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the basic structure of an antibody?',
                            'question_text_arabic': 'ما هو التركيب الأساسي للجسم المضاد؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Y-shaped molecule with heavy and light chains', 'choice_text_arabic': 'جزيء على شكل Y بسلاسل ثقيلة وخفيفة', 'is_correct': True},
                                {'choice_text': 'Linear protein chain', 'choice_text_arabic': 'سلسلة بروتينية خطية', 'is_correct': False},
                                {'choice_text': 'Circular DNA molecule', 'choice_text_arabic': 'جزيء حمض نووي دائري', 'is_correct': False},
                                {'choice_text': 'Triangular lipid structure', 'choice_text_arabic': 'تركيب دهني مثلثي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which part of the antibody binds to antigens?',
                            'question_text_arabic': 'أي جزء من الجسم المضاد يرتبط بالمستضدات؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Variable region (Fab)', 'choice_text_arabic': 'المنطقة المتغيرة (Fab)', 'is_correct': True},
                                {'choice_text': 'Constant region (Fc)', 'choice_text_arabic': 'المنطقة الثابتة (Fc)', 'is_correct': False},
                                {'choice_text': 'Heavy chain only', 'choice_text_arabic': 'السلسلة الثقيلة فقط', 'is_correct': False},
                                {'choice_text': 'Light chain only', 'choice_text_arabic': 'السلسلة الخفيفة فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Name the five main classes of antibodies.',
                            'question_text_arabic': 'اذكر الأصناف الخمسة الرئيسية للأجسام المضادة.',
                            'question_type': 'open_short',
                            'correct_answer': 'IgG, IgA, IgM, IgD, IgE'
                        },
                        {
                            'question_text': 'B cells can differentiate into plasma cells and memory cells.',
                            'question_text_arabic': 'الخلايا البائية يمكن أن تتمايز إلى خلايا بلازمية وخلايا ذاكرة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'T Cells and Cell-Mediated Immunity',
                    'title_arabic': 'الخلايا التائية والمناعة الخلوية',
                    'description': 'T cell types and their functions in immune responses',
                    'description_arabic': 'أنواع الخلايا التائية ووظائفها في الاستجابات المناعية',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Where do T cells mature?',
                            'question_text_arabic': 'أين تنضج الخلايا التائية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Thymus', 'choice_text_arabic': 'الغدة الصعترية', 'is_correct': True},
                                {'choice_text': 'Bone marrow', 'choice_text_arabic': 'نخاع العظم', 'is_correct': False},
                                {'choice_text': 'Spleen', 'choice_text_arabic': 'الطحال', 'is_correct': False},
                                {'choice_text': 'Liver', 'choice_text_arabic': 'الكبد', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are the main types of T cells?',
                            'question_text_arabic': 'ما هي الأنواع الرئيسية للخلايا التائية؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Helper T cells (CD4+)', 'choice_text_arabic': 'الخلايا التائية المساعدة (CD4+)', 'is_correct': True},
                                {'choice_text': 'Cytotoxic T cells (CD8+)', 'choice_text_arabic': 'الخلايا التائية السامة (CD8+)', 'is_correct': True},
                                {'choice_text': 'Regulatory T cells', 'choice_text_arabic': 'الخلايا التائية التنظيمية', 'is_correct': True},
                                {'choice_text': 'Plasma cells', 'choice_text_arabic': 'الخلايا البلازمية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the primary function of cytotoxic T cells?',
                            'question_text_arabic': 'ما هي الوظيفة الأساسية للخلايا التائية السامة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Kill infected or abnormal cells directly', 'choice_text_arabic': 'قتل الخلايا المصابة أو غير الطبيعية مباشرة', 'is_correct': True},
                                {'choice_text': 'Produce antibodies', 'choice_text_arabic': 'إنتاج الأجسام المضادة', 'is_correct': False},
                                {'choice_text': 'Activate B cells only', 'choice_text_arabic': 'تنشيط الخلايا البائية فقط', 'is_correct': False},
                                {'choice_text': 'Suppress immune responses', 'choice_text_arabic': 'قمع الاستجابات المناعية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Helper T cells coordinate immune responses by activating other immune cells.',
                            'question_text_arabic': 'الخلايا التائية المساعدة تنسق الاستجابات المناعية بتنشيط خلايا مناعية أخرى.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Immunological Memory and Vaccination',
                    'title_arabic': 'الذاكرة المناعية والتطعيم',
                    'description': 'How immune memory works and vaccination principles',
                    'description_arabic': 'كيف تعمل الذاكرة المناعية ومبادئ التطعيم',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is immunological memory?',
                            'question_text_arabic': 'ما هي الذاكرة المناعية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Ability to mount faster, stronger responses upon re-exposure to antigens', 'choice_text_arabic': 'القدرة على تكوين استجابات أسرع وأقوى عند التعرض مرة أخرى للمستضدات', 'is_correct': True},
                                {'choice_text': 'Storage of antibodies in blood permanently', 'choice_text_arabic': 'تخزين الأجسام المضادة في الدم دائماً', 'is_correct': False},
                                {'choice_text': 'Brain function related to immune responses', 'choice_text_arabic': 'وظيفة دماغية متعلقة بالاستجابات المناعية', 'is_correct': False},
                                {'choice_text': 'Genetic inheritance of immunity', 'choice_text_arabic': 'الوراثة الجينية للمناعة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How do vaccines work?',
                            'question_text_arabic': 'كيف تعمل اللقاحات؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Expose immune system to harmless antigens to create memory', 'choice_text_arabic': 'تعرض الجهاز المناعي لمستضدات غير ضارة لتكوين ذاكرة', 'is_correct': True},
                                {'choice_text': 'Directly kill pathogens in the body', 'choice_text_arabic': 'تقتل مسببات الأمراض مباشرة في الجسم', 'is_correct': False},
                                {'choice_text': 'Replace damaged immune cells', 'choice_text_arabic': 'تحل محل الخلايا المناعية التالفة', 'is_correct': False},
                                {'choice_text': 'Boost general health without specific immunity', 'choice_text_arabic': 'تعزز الصحة العامة دون مناعة محددة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What types of vaccines exist?',
                            'question_text_arabic': 'ما أنواع اللقاحات الموجودة؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Live attenuated vaccines', 'choice_text_arabic': 'لقاحات حية مضعفة', 'is_correct': True},
                                {'choice_text': 'Inactivated vaccines', 'choice_text_arabic': 'لقاحات معطلة', 'is_correct': True},
                                {'choice_text': 'Subunit vaccines', 'choice_text_arabic': 'لقاحات الوحدات الفرعية', 'is_correct': True},
                                {'choice_text': 'Antibiotic vaccines', 'choice_text_arabic': 'لقاحات مضادة حيوية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is herd immunity?',
                            'question_text_arabic': 'ما هي مناعة القطيع؟',
                            'question_type': 'open_short',
                            'correct_answer': 'Protection of a population when a high percentage is immune, protecting non-immune individuals'
                        },
                        {
                            'question_text': 'Memory cells can remain in the body for decades.',
                            'question_text_arabic': 'خلايا الذاكرة يمكن أن تبقى في الجسم لعقود.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Booster shots are given to strengthen immune memory.',
                            'question_text_arabic': 'جرعات التقوية تُعطى لتقوية الذاكرة المناعية.',
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
                    f'Successfully created for Lesson 111 (Immunology):\\n'
                    f'Exercises: {total_exercises}\\n'
                    f'Questions: {total_questions}\\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 111 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )