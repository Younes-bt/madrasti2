from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for The body\'s defense mechanisms - Lesson ID: 113'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=113)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Physical and Chemical Barriers',
                    'title_arabic': 'الحواجز الفيزيائية والكيميائية',
                    'description': 'First line of defense: external barriers',
                    'description_arabic': 'خط الدفاع الأول: الحواجز الخارجية',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is the body\'s first line of defense?',
                            'question_text_arabic': 'ما هو خط الدفاع الأول للجسم؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Physical and chemical barriers', 'choice_text_arabic': 'الحواجز الفيزيائية والكيميائية', 'is_correct': True},
                                {'choice_text': 'White blood cells', 'choice_text_arabic': 'خلايا الدم البيضاء', 'is_correct': False},
                                {'choice_text': 'Antibodies', 'choice_text_arabic': 'الأجسام المضادة', 'is_correct': False},
                                {'choice_text': 'Memory cells', 'choice_text_arabic': 'خلايا الذاكرة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which physical barriers protect the body?',
                            'question_text_arabic': 'أي حواجز فيزيائية تحمي الجسم؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Skin', 'choice_text_arabic': 'الجلد', 'is_correct': True},
                                {'choice_text': 'Mucous membranes', 'choice_text_arabic': 'الأغشية المخاطية', 'is_correct': True},
                                {'choice_text': 'Cilia in respiratory tract', 'choice_text_arabic': 'الأهداب في الجهاز التنفسي', 'is_correct': True},
                                {'choice_text': 'Bone marrow', 'choice_text_arabic': 'نخاع العظم', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How does stomach acid protect the body?',
                            'question_text_arabic': 'كيف يحمي حمض المعدة الجسم؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Kills many pathogens before they enter the body', 'choice_text_arabic': 'يقتل العديد من مسببات الأمراض قبل دخولها الجسم', 'is_correct': True},
                                {'choice_text': 'Produces antibodies', 'choice_text_arabic': 'ينتج الأجسام المضادة', 'is_correct': False},
                                {'choice_text': 'Activates T cells', 'choice_text_arabic': 'ينشط الخلايا التائية', 'is_correct': False},
                                {'choice_text': 'Stores immune memory', 'choice_text_arabic': 'يخزن الذاكرة المناعية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Tears contain antimicrobial substances that help protect the eyes.',
                            'question_text_arabic': 'تحتوي الدموع على مواد مضادة للميكروبات تساعد في حماية العينين.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Innate Immune Responses',
                    'title_arabic': 'الاستجابات المناعية الفطرية',
                    'description': 'Non-specific immune responses and inflammation',
                    'description_arabic': 'الاستجابات المناعية غير المحددة والالتهاب',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What characterizes innate immunity?',
                            'question_text_arabic': 'ما الذي يميز المناعة الفطرية؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Rapid response', 'choice_text_arabic': 'استجابة سريعة', 'is_correct': True},
                                {'choice_text': 'Non-specific targeting', 'choice_text_arabic': 'استهداف غير محدد', 'is_correct': True},
                                {'choice_text': 'No memory formation', 'choice_text_arabic': 'لا تكوين ذاكرة', 'is_correct': True},
                                {'choice_text': 'Antibody production', 'choice_text_arabic': 'إنتاج الأجسام المضادة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is inflammation?',
                            'question_text_arabic': 'ما هو الالتهاب؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Localized immune response to injury or infection', 'choice_text_arabic': 'استجابة مناعية موضعية للإصابة أو العدوى', 'is_correct': True},
                                {'choice_text': 'Production of specific antibodies', 'choice_text_arabic': 'إنتاج أجسام مضادة محددة', 'is_correct': False},
                                {'choice_text': 'Formation of memory cells', 'choice_text_arabic': 'تكوين خلايا الذاكرة', 'is_correct': False},
                                {'choice_text': 'Breakdown of tissue barriers', 'choice_text_arabic': 'تكسير حواجز الأنسجة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are the classic signs of inflammation?',
                            'question_text_arabic': 'ما هي العلامات التقليدية للالتهاب؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Redness (rubor)', 'choice_text_arabic': 'الاحمرار', 'is_correct': True},
                                {'choice_text': 'Heat (calor)', 'choice_text_arabic': 'الحرارة', 'is_correct': True},
                                {'choice_text': 'Swelling (tumor)', 'choice_text_arabic': 'التورم', 'is_correct': True},
                                {'choice_text': 'Memory formation', 'choice_text_arabic': 'تكوين الذاكرة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which cells are involved in innate immunity?',
                            'question_text_arabic': 'أي خلايا تشارك في المناعة الفطرية؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Neutrophils', 'choice_text_arabic': 'العدلات', 'is_correct': True},
                                {'choice_text': 'Macrophages', 'choice_text_arabic': 'البلاعم الكبيرة', 'is_correct': True},
                                {'choice_text': 'Natural killer cells', 'choice_text_arabic': 'الخلايا القاتلة الطبيعية', 'is_correct': True},
                                {'choice_text': 'Plasma cells', 'choice_text_arabic': 'الخلايا البلازمية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Fever is a systemic inflammatory response that can help fight infections.',
                            'question_text_arabic': 'الحمى استجابة التهابية جهازية يمكن أن تساعد في مكافحة العدوى.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Phagocytosis and Cellular Defense',
                    'title_arabic': 'البلعمة والدفاع الخلوي',
                    'description': 'How immune cells engulf and destroy pathogens',
                    'description_arabic': 'كيف تبتلع الخلايا المناعية وتدمر مسببات الأمراض',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is phagocytosis?',
                            'question_text_arabic': 'ما هي البلعمة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Process of engulfing and digesting pathogens by immune cells', 'choice_text_arabic': 'عملية ابتلاع وهضم مسببات الأمراض بواسطة الخلايا المناعية', 'is_correct': True},
                                {'choice_text': 'Production of antibodies by B cells', 'choice_text_arabic': 'إنتاج الأجسام المضادة بواسطة الخلايا البائية', 'is_correct': False},
                                {'choice_text': 'Killing of infected cells by T cells', 'choice_text_arabic': 'قتل الخلايا المصابة بواسطة الخلايا التائية', 'is_correct': False},
                                {'choice_text': 'Formation of blood clots', 'choice_text_arabic': 'تكوين جلطات الدم', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which cells are professional phagocytes?',
                            'question_text_arabic': 'أي خلايا هي البلاعم المتخصصة؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Neutrophils', 'choice_text_arabic': 'العدلات', 'is_correct': True},
                                {'choice_text': 'Macrophages', 'choice_text_arabic': 'البلاعم الكبيرة', 'is_correct': True},
                                {'choice_text': 'Dendritic cells', 'choice_text_arabic': 'الخلايا التغصنية', 'is_correct': True},
                                {'choice_text': 'Red blood cells', 'choice_text_arabic': 'خلايا الدم الحمراء', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What happens during the steps of phagocytosis?',
                            'question_text_arabic': 'ماذا يحدث خلال خطوات البلعمة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Recognition → Engulfment → Digestion → Elimination', 'choice_text_arabic': 'التعرف → الابتلاع → الهضم → الإزالة', 'is_correct': True},
                                {'choice_text': 'Antibody binding → Memory formation → Replication', 'choice_text_arabic': 'ارتباط الأجسام المضادة → تكوين الذاكرة → التكاثر', 'is_correct': False},
                                {'choice_text': 'DNA replication → Protein synthesis → Cell division', 'choice_text_arabic': 'تضاعف الحمض النووي → تخليق البروتين → انقسام الخلية', 'is_correct': False},
                                {'choice_text': 'Inflammation → Healing → Regeneration', 'choice_text_arabic': 'الالتهاب → الشفاء → التجديد', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are lysosomes?',
                            'question_text_arabic': 'ما هي الليزوزومات؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Organelles containing digestive enzymes', 'choice_text_arabic': 'عضيات تحتوي على إنزيمات هاضمة', 'is_correct': True},
                                {'choice_text': 'Sites of protein synthesis', 'choice_text_arabic': 'مواقع تخليق البروتين', 'is_correct': False},
                                {'choice_text': 'Energy-producing organelles', 'choice_text_arabic': 'عضيات منتجة للطاقة', 'is_correct': False},
                                {'choice_text': 'DNA storage compartments', 'choice_text_arabic': 'حجرات تخزين الحمض النووي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Neutrophils are the most abundant white blood cells and first responders to infection.',
                            'question_text_arabic': 'العدلات هي أكثر خلايا الدم البيضاء وفرة وأول المستجيبين للعدوى.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Complement System',
                    'title_arabic': 'نظام المتممة',
                    'description': 'Complement cascade and its role in immune defense',
                    'description_arabic': 'تسلسل المتممة ودورها في الدفاع المناعي',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the complement system?',
                            'question_text_arabic': 'ما هو نظام المتممة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Series of plasma proteins that enhance immune responses', 'choice_text_arabic': 'سلسلة من بروتينات البلازما التي تعزز الاستجابات المناعية', 'is_correct': True},
                                {'choice_text': 'Type of white blood cell', 'choice_text_arabic': 'نوع من خلايا الدم البيضاء', 'is_correct': False},
                                {'choice_text': 'Organ that produces antibodies', 'choice_text_arabic': 'عضو ينتج الأجسام المضادة', 'is_correct': False},
                                {'choice_text': 'Physical barrier against pathogens', 'choice_text_arabic': 'حاجز فيزيائي ضد مسببات الأمراض', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are the main functions of complement?',
                            'question_text_arabic': 'ما هي الوظائف الرئيسية للمتممة؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Cell lysis (membrane attack complex)', 'choice_text_arabic': 'تحلل الخلايا (مركب الهجوم الغشائي)', 'is_correct': True},
                                {'choice_text': 'Opsonization (marking for phagocytosis)', 'choice_text_arabic': 'التمييز للبلعمة', 'is_correct': True},
                                {'choice_text': 'Inflammation enhancement', 'choice_text_arabic': 'تعزيز الالتهاب', 'is_correct': True},
                                {'choice_text': 'DNA repair', 'choice_text_arabic': 'إصلاح الحمض النووي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How is the complement system activated?',
                            'question_text_arabic': 'كيف يتم تنشيط نظام المتممة؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Classical pathway (antibody-mediated)', 'choice_text_arabic': 'المسار التقليدي (بوساطة الأجسام المضادة)', 'is_correct': True},
                                {'choice_text': 'Alternative pathway (direct pathogen recognition)', 'choice_text_arabic': 'المسار البديل (التعرف المباشر على مسببات الأمراض)', 'is_correct': True},
                                {'choice_text': 'Lectin pathway (carbohydrate recognition)', 'choice_text_arabic': 'مسار الليكتين (التعرف على الكربوهيدرات)', 'is_correct': True},
                                {'choice_text': 'Digestive pathway', 'choice_text_arabic': 'المسار الهضمي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is opsonization?',
                            'question_text_arabic': 'ما هو التمييز؟',
                            'question_type': 'open_short',
                            'correct_answer': 'Marking pathogens with complement or antibodies to enhance phagocytosis'
                        },
                        {
                            'question_text': 'Complement proteins work in a cascade fashion, amplifying the immune response.',
                            'question_text_arabic': 'بروتينات المتممة تعمل بطريقة متسلسلة، مما يضخم الاستجابة المناعية.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Antimicrobial Substances and Interferons',
                    'title_arabic': 'المواد المضادة للميكروبات والإنترفيرونات',
                    'description': 'Chemical defense mechanisms and antiviral responses',
                    'description_arabic': 'آليات الدفاع الكيميائية والاستجابات المضادة للفيروسات',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What are interferons?',
                            'question_text_arabic': 'ما هي الإنترفيرونات؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Proteins that interfere with viral replication', 'choice_text_arabic': 'بروتينات تتداخل مع تكاثر الفيروسات', 'is_correct': True},
                                {'choice_text': 'Antibodies that neutralize toxins', 'choice_text_arabic': 'أجسام مضادة تحيد السموم', 'is_correct': False},
                                {'choice_text': 'Enzymes that digest bacteria', 'choice_text_arabic': 'إنزيمات تهضم البكتيريا', 'is_correct': False},
                                {'choice_text': 'Hormones that regulate inflammation', 'choice_text_arabic': 'هرمونات تنظم الالتهاب', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How do interferons protect against viral infections?',
                            'question_text_arabic': 'كيف تحمي الإنترفيرونات من العدوى الفيروسية؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Block viral replication in infected cells', 'choice_text_arabic': 'تمنع تكاثر الفيروسات في الخلايا المصابة', 'is_correct': True},
                                {'choice_text': 'Activate natural killer cells', 'choice_text_arabic': 'تنشط الخلايا القاتلة الطبيعية', 'is_correct': True},
                                {'choice_text': 'Enhance MHC Class I expression', 'choice_text_arabic': 'تعزز التعبير عن MHC الصنف الأول', 'is_correct': True},
                                {'choice_text': 'Produce specific antibodies', 'choice_text_arabic': 'تنتج أجساماً مضادة محددة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What antimicrobial substances are found in body secretions?',
                            'question_text_arabic': 'ما المواد المضادة للميكروبات الموجودة في إفرازات الجسم؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Lysozyme (breaks down bacterial cell walls)', 'choice_text_arabic': 'الليزوزيم (يفكك جدران الخلايا البكتيرية)', 'is_correct': True},
                                {'choice_text': 'Lactoferrin (binds iron)', 'choice_text_arabic': 'اللاكتوفيرين (يرتبط بالحديد)', 'is_correct': True},
                                {'choice_text': 'Defensins (antimicrobial peptides)', 'choice_text_arabic': 'الديفينسينات (ببتيدات مضادة للميكروبات)', 'is_correct': True},
                                {'choice_text': 'Hemoglobin', 'choice_text_arabic': 'الهيموجلوبين', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which cells produce interferons when infected by viruses?',
                            'question_text_arabic': 'أي خلايا تنتج الإنترفيرونات عند إصابتها بالفيروسات؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Most nucleated cells can produce interferons', 'choice_text_arabic': 'معظم الخلايا ذات النواة يمكنها إنتاج الإنترفيرونات', 'is_correct': True},
                                {'choice_text': 'Only immune cells', 'choice_text_arabic': 'الخلايا المناعية فقط', 'is_correct': False},
                                {'choice_text': 'Only liver cells', 'choice_text_arabic': 'خلايا الكبد فقط', 'is_correct': False},
                                {'choice_text': 'Only bone marrow cells', 'choice_text_arabic': 'خلايا نخاع العظم فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Interferons are species-specific but not virus-specific.',
                            'question_text_arabic': 'الإنترفيرونات محددة للأنواع ولكن ليست محددة للفيروسات.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Natural killer cells can destroy virus-infected cells without prior sensitization.',
                            'question_text_arabic': 'الخلايا القاتلة الطبيعية يمكنها تدمير الخلايا المصابة بالفيروسات دون تحسس مسبق.',
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
                    f'Successfully created for Lesson 113 (The body\'s defense mechanisms):\\n'
                    f'Exercises: {total_exercises}\\n'
                    f'Questions: {total_questions}\\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 113 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )