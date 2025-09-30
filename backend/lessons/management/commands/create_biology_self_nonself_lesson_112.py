from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Distinguishing self from non-self - Lesson ID: 112'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=112)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Concept of Self vs Non-Self Recognition',
                    'title_arabic': 'مفهوم التعرف على الذات مقابل غير الذات',
                    'description': 'Understanding how the immune system distinguishes self from foreign',
                    'description_arabic': 'فهم كيف يميز الجهاز المناعي بين الذات والغريب',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What does "self" refer to in immunology?',
                            'question_text_arabic': 'إلى ماذا تشير "الذات" في علم المناعة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Body\'s own cells and molecules recognized as belonging to the organism', 'choice_text_arabic': 'خلايا وجزيئات الجسم التي يُتعرف عليها كجزء من الكائن', 'is_correct': True},
                                {'choice_text': 'All foreign substances entering the body', 'choice_text_arabic': 'جميع المواد الغريبة التي تدخل الجسم', 'is_correct': False},
                                {'choice_text': 'Only immune system cells', 'choice_text_arabic': 'خلايا الجهاز المناعي فقط', 'is_correct': False},
                                {'choice_text': 'Pathogens and microorganisms', 'choice_text_arabic': 'مسببات الأمراض والكائنات الدقيقة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are non-self substances?',
                            'question_text_arabic': 'ما هي المواد غير الذاتية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Foreign substances not recognized as part of the body', 'choice_text_arabic': 'مواد غريبة لا يُتعرف عليها كجزء من الجسم', 'is_correct': True},
                                {'choice_text': 'Normal body proteins', 'choice_text_arabic': 'بروتينات الجسم الطبيعية', 'is_correct': False},
                                {'choice_text': 'Healthy tissue cells', 'choice_text_arabic': 'خلايا الأنسجة الصحية', 'is_correct': False},
                                {'choice_text': 'Blood cells only', 'choice_text_arabic': 'خلايا الدم فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Why is self vs non-self recognition important?',
                            'question_text_arabic': 'لماذا يعتبر التعرف على الذات مقابل غير الذات مهماً؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'To attack harmful substances while protecting healthy tissue', 'choice_text_arabic': 'لمهاجمة المواد الضارة مع حماية الأنسجة الصحية', 'is_correct': True},
                                {'choice_text': 'To destroy all foreign substances equally', 'choice_text_arabic': 'لتدمير جميع المواد الغريبة بالتساوي', 'is_correct': False},
                                {'choice_text': 'To prevent any immune response', 'choice_text_arabic': 'لمنع أي استجابة مناعية', 'is_correct': False},
                                {'choice_text': 'To eliminate all body cells', 'choice_text_arabic': 'للقضاء على جميع خلايا الجسم', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The immune system normally does not attack the body\'s own healthy cells.',
                            'question_text_arabic': 'الجهاز المناعي عادة لا يهاجم خلايا الجسم الصحية.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Major Histocompatibility Complex (MHC)',
                    'title_arabic': 'مركب التوافق النسيجي الرئيسي',
                    'description': 'Understanding MHC molecules and their role in self-recognition',
                    'description_arabic': 'فهم جزيئات المركب النسيجي ودورها في التعرف على الذات',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What are MHC molecules?',
                            'question_text_arabic': 'ما هي جزيئات MHC؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Cell surface proteins that identify cells as self', 'choice_text_arabic': 'بروتينات على سطح الخلية تحدد الخلايا كذاتية', 'is_correct': True},
                                {'choice_text': 'Antibodies that attack foreign cells', 'choice_text_arabic': 'أجسام مضادة تهاجم الخلايا الغريبة', 'is_correct': False},
                                {'choice_text': 'Enzymes that digest pathogens', 'choice_text_arabic': 'إنزيمات تهضم مسببات الأمراض', 'is_correct': False},
                                {'choice_text': 'Hormones that regulate immune responses', 'choice_text_arabic': 'هرمونات تنظم الاستجابات المناعية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are the two main classes of MHC molecules?',
                            'question_text_arabic': 'ما الصنفان الرئيسيان لجزيئات MHC؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'MHC Class I and MHC Class II', 'choice_text_arabic': 'MHC الصنف الأول وMHC الصنف الثاني', 'is_correct': True},
                                {'choice_text': 'Alpha and Beta chains', 'choice_text_arabic': 'السلاسل ألفا وبيتا', 'is_correct': False},
                                {'choice_text': 'Heavy and light chains', 'choice_text_arabic': 'السلاسل الثقيلة والخفيفة', 'is_correct': False},
                                {'choice_text': 'Primary and secondary structures', 'choice_text_arabic': 'التراكيب الأولية والثانوية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which cells express MHC Class I molecules?',
                            'question_text_arabic': 'أي خلايا تعبر عن جزيئات MHC الصنف الأول؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'All nucleated cells in the body', 'choice_text_arabic': 'جميع الخلايا ذات النواة في الجسم', 'is_correct': True},
                                {'choice_text': 'Only immune cells', 'choice_text_arabic': 'الخلايا المناعية فقط', 'is_correct': False},
                                {'choice_text': 'Only red blood cells', 'choice_text_arabic': 'خلايا الدم الحمراء فقط', 'is_correct': False},
                                {'choice_text': 'Only antigen-presenting cells', 'choice_text_arabic': 'الخلايا مقدمة المستضد فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What do MHC Class II molecules primarily present?',
                            'question_text_arabic': 'ماذا تقدم جزيئات MHC الصنف الثاني بشكل أساسي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Extracellular antigens to CD4+ T cells', 'choice_text_arabic': 'مستضدات خارج خلوية للخلايا التائية CD4+', 'is_correct': True},
                                {'choice_text': 'Intracellular antigens to CD8+ T cells', 'choice_text_arabic': 'مستضدات داخل خلوية للخلايا التائية CD8+', 'is_correct': False},
                                {'choice_text': 'Antibodies to B cells', 'choice_text_arabic': 'أجسام مضادة للخلايا البائية', 'is_correct': False},
                                {'choice_text': 'Nutrients to all cells', 'choice_text_arabic': 'مغذيات لجميع الخلايا', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'MHC molecules are highly polymorphic, meaning they vary greatly between individuals.',
                            'question_text_arabic': 'جزيئات MHC متعددة الأشكال، مما يعني أنها تختلف كثيراً بين الأفراد.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Antigen Presentation and Recognition',
                    'title_arabic': 'عرض والتعرف على المستضدات',
                    'description': 'How antigens are presented and recognized by immune cells',
                    'description_arabic': 'كيف يتم عرض والتعرف على المستضدات بواسطة الخلايا المناعية',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What are antigen-presenting cells (APCs)?',
                            'question_text_arabic': 'ما هي الخلايا مقدمة المستضد؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Cells that process and display antigens to T cells', 'choice_text_arabic': 'خلايا تعالج وتعرض المستضدات للخلايا التائية', 'is_correct': True},
                                {'choice_text': 'Cells that produce antibodies', 'choice_text_arabic': 'خلايا تنتج الأجسام المضادة', 'is_correct': False},
                                {'choice_text': 'Cells that destroy pathogens directly', 'choice_text_arabic': 'خلايا تدمر مسببات الأمراض مباشرة', 'is_correct': False},
                                {'choice_text': 'Cells that store immune memory', 'choice_text_arabic': 'خلايا تخزن الذاكرة المناعية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which cells are professional antigen-presenting cells?',
                            'question_text_arabic': 'أي خلايا هي الخلايا مقدمة المستضد المتخصصة؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Dendritic cells', 'choice_text_arabic': 'الخلايا التغصنية', 'is_correct': True},
                                {'choice_text': 'Macrophages', 'choice_text_arabic': 'البلاعم الكبيرة', 'is_correct': True},
                                {'choice_text': 'B cells', 'choice_text_arabic': 'الخلايا البائية', 'is_correct': True},
                                {'choice_text': 'Red blood cells', 'choice_text_arabic': 'خلايا الدم الحمراء', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How do CD8+ T cells recognize infected cells?',
                            'question_text_arabic': 'كيف تتعرف الخلايا التائية CD8+ على الخلايا المصابة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Through viral peptides presented on MHC Class I', 'choice_text_arabic': 'عبر الببتيدات الفيروسية المعروضة على MHC الصنف الأول', 'is_correct': True},
                                {'choice_text': 'Through bacterial antigens on MHC Class II', 'choice_text_arabic': 'عبر المستضدات البكتيرية على MHC الصنف الثاني', 'is_correct': False},
                                {'choice_text': 'Through antibodies on cell surface', 'choice_text_arabic': 'عبر الأجسام المضادة على سطح الخلية', 'is_correct': False},
                                {'choice_text': 'Through complement proteins', 'choice_text_arabic': 'عبر بروتينات المتممة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What happens when MHC Class I presentation is disrupted?',
                            'question_text_arabic': 'ماذا يحدث عندما يتعطل عرض MHC الصنف الأول؟',
                            'question_type': 'open_short',
                            'correct_answer': 'Natural killer cells may attack the cell, or immune surveillance is compromised'
                        },
                        {
                            'question_text': 'Dendritic cells are the most potent antigen-presenting cells.',
                            'question_text_arabic': 'الخلايا التغصنية هي أقوى الخلايا مقدمة المستضد.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Tolerance and Autoimmunity',
                    'title_arabic': 'التحمل والمناعة الذاتية',
                    'description': 'Understanding immune tolerance and autoimmune disorders',
                    'description_arabic': 'فهم التحمل المناعي واضطرابات المناعة الذاتية',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is immune tolerance?',
                            'question_text_arabic': 'ما هو التحمل المناعي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Immune system\'s ability to avoid attacking self-tissues', 'choice_text_arabic': 'قدرة الجهاز المناعي على تجنب مهاجمة الأنسجة الذاتية', 'is_correct': True},
                                {'choice_text': 'Complete shutdown of immune responses', 'choice_text_arabic': 'إيقاف كامل للاستجابات المناعية', 'is_correct': False},
                                {'choice_text': 'Ability to tolerate all foreign substances', 'choice_text_arabic': 'القدرة على تحمل جميع المواد الغريبة', 'is_correct': False},
                                {'choice_text': 'Enhanced immune response to pathogens', 'choice_text_arabic': 'استجابة مناعية معززة لمسببات الأمراض', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are the two main types of tolerance?',
                            'question_text_arabic': 'ما النوعان الرئيسيان للتحمل؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Central and peripheral tolerance', 'choice_text_arabic': 'التحمل المركزي والمحيطي', 'is_correct': True},
                                {'choice_text': 'Active and passive tolerance', 'choice_text_arabic': 'التحمل النشط والسلبي', 'is_correct': False},
                                {'choice_text': 'Innate and adaptive tolerance', 'choice_text_arabic': 'التحمل الفطري والتكيفي', 'is_correct': False},
                                {'choice_text': 'Primary and secondary tolerance', 'choice_text_arabic': 'التحمل الأولي والثانوي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Where does central tolerance occur?',
                            'question_text_arabic': 'أين يحدث التحمل المركزي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'In primary lymphoid organs (thymus and bone marrow)', 'choice_text_arabic': 'في الأعضاء اللمفاوية الأولية (الغدة الصعترية ونخاع العظم)', 'is_correct': True},
                                {'choice_text': 'In secondary lymphoid organs only', 'choice_text_arabic': 'في الأعضاء اللمفاوية الثانوية فقط', 'is_correct': False},
                                {'choice_text': 'In the bloodstream', 'choice_text_arabic': 'في مجرى الدم', 'is_correct': False},
                                {'choice_text': 'In peripheral tissues only', 'choice_text_arabic': 'في الأنسجة المحيطية فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is autoimmunity?',
                            'question_text_arabic': 'ما هي المناعة الذاتية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Immune system attacking body\'s own healthy tissues', 'choice_text_arabic': 'مهاجمة الجهاز المناعي لأنسجة الجسم الصحية', 'is_correct': True},
                                {'choice_text': 'Enhanced protection against infections', 'choice_text_arabic': 'حماية معززة ضد العدوى', 'is_correct': False},
                                {'choice_text': 'Self-healing of damaged tissues', 'choice_text_arabic': 'الشفاء الذاتي للأنسجة التالفة', 'is_correct': False},
                                {'choice_text': 'Automatic immune responses', 'choice_text_arabic': 'استجابات مناعية تلقائية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Give an example of an autoimmune disease.',
                            'question_text_arabic': 'أعط مثالاً على مرض المناعة الذاتية.',
                            'question_type': 'open_short',
                            'correct_answer': 'Type 1 diabetes, rheumatoid arthritis, multiple sclerosis, or lupus'
                        },
                        {
                            'question_text': 'Regulatory T cells help maintain immune tolerance.',
                            'question_text_arabic': 'الخلايا التائية التنظيمية تساعد في الحفاظ على التحمل المناعي.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Transplantation Immunology',
                    'title_arabic': 'علم المناعة في زراعة الأعضاء',
                    'description': 'Understanding tissue compatibility and transplant rejection',
                    'description_arabic': 'فهم توافق الأنسجة ورفض الزراعة',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'Why do organ transplants get rejected?',
                            'question_text_arabic': 'لماذا يتم رفض زراعة الأعضاء؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Recipient\'s immune system recognizes donor tissue as foreign', 'choice_text_arabic': 'الجهاز المناعي للمتلقي يتعرف على نسيج المتبرع كغريب', 'is_correct': True},
                                {'choice_text': 'Donor tissue is always diseased', 'choice_text_arabic': 'نسيج المتبرع مريض دائماً', 'is_correct': False},
                                {'choice_text': 'Surgical complications only', 'choice_text_arabic': 'مضاعفات جراحية فقط', 'is_correct': False},
                                {'choice_text': 'Blood type incompatibility only', 'choice_text_arabic': 'عدم توافق فصيلة الدم فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is HLA typing?',
                            'question_text_arabic': 'ما هو تحديد نوع HLA؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Testing MHC compatibility between donor and recipient', 'choice_text_arabic': 'اختبار توافق MHC بين المتبرع والمتلقي', 'is_correct': True},
                                {'choice_text': 'Blood type determination', 'choice_text_arabic': 'تحديد فصيلة الدم', 'is_correct': False},
                                {'choice_text': 'Organ size measurement', 'choice_text_arabic': 'قياس حجم العضو', 'is_correct': False},
                                {'choice_text': 'Disease screening test', 'choice_text_arabic': 'اختبار فحص المرض', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are immunosuppressive drugs used for?',
                            'question_text_arabic': 'لماذا تُستخدم الأدوية مثبطة المناعة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'To prevent transplant rejection by suppressing immune responses', 'choice_text_arabic': 'لمنع رفض الزراعة بقمع الاستجابات المناعية', 'is_correct': True},
                                {'choice_text': 'To enhance immune function', 'choice_text_arabic': 'لتعزيز الوظيفة المناعية', 'is_correct': False},
                                {'choice_text': 'To treat infections only', 'choice_text_arabic': 'لعلاج العدوى فقط', 'is_correct': False},
                                {'choice_text': 'To promote tissue growth', 'choice_text_arabic': 'لتعزيز نمو الأنسجة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is graft-versus-host disease?',
                            'question_text_arabic': 'ما هو مرض الطعم ضد المضيف؟',
                            'question_type': 'open_short',
                            'correct_answer': 'When donor immune cells attack recipient tissues'
                        },
                        {
                            'question_text': 'Identical twins can donate organs to each other without rejection.',
                            'question_text_arabic': 'التوائم المتطابقة يمكنها التبرع بالأعضاء لبعضها دون رفض.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Immunosuppressive drugs increase susceptibility to infections.',
                            'question_text_arabic': 'الأدوية مثبطة المناعة تزيد القابلية للعدوى.',
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
                    f'Successfully created for Lesson 112 (Distinguishing self from non-self):\\n'
                    f'Exercises: {total_exercises}\\n'
                    f'Questions: {total_questions}\\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 112 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )