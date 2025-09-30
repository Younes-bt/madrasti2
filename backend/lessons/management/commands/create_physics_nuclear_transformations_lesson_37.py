from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Nuclear transformations - Lesson ID: 37'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=37)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Basics of the Atomic Nucleus',
                    'title_arabic': 'أساسيات نواة الذرة',
                    'description': 'Understanding the composition and properties of the atomic nucleus.',
                    'description_arabic': 'فهم مكونات وخصائص نواة الذرة.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What are the constituents of an atomic nucleus called?',
                            'question_text_arabic': 'ماذا تسمى مكونات نواة الذرة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Nucleons', 'choice_text_arabic': 'النيوكليونات', 'is_correct': True},
                                {'choice_text': 'Electrons', 'choice_text_arabic': 'الإلكترونات', 'is_correct': False},
                                {'choice_text': 'Photons', 'choice_text_arabic': 'الفوتونات', 'is_correct': False},
                                {'choice_text': 'Neutrinos', 'choice_text_arabic': 'النيوترينوات', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Isotopes of an element have the same number of protons but a different number of neutrons.',
                            'question_text_arabic': 'نظائر عنصر ما لها نفس عدد البروتونات ولكن عدد مختلف من النيوترونات.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What does the mass number (A) represent?',
                            'question_text_arabic': 'ماذا يمثل عدد الكتلة (A)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Total number of protons and neutrons', 'choice_text_arabic': 'العدد الإجمالي للبروتونات والنيوترونات', 'is_correct': True},
                                {'choice_text': 'Number of protons', 'choice_text_arabic': 'عدد البروتونات', 'is_correct': False},
                                {'choice_text': 'Number of neutrons', 'choice_text_arabic': 'عدد النيوترونات', 'is_correct': False},
                                {'choice_text': 'Number of electrons', 'choice_text_arabic': 'عدد الإلكترونات', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How many neutrons are in the nucleus of Uranium-235 (⁹²U)?',
                            'question_text_arabic': 'كم عدد النيوترونات في نواة اليورانيوم-235 (⁹²U)؟',
                            'question_type': 'open_short',
                            'correct_answer': '143'
                        }
                    ]
                },
                {
                    'title': 'Radioactivity and Decay',
                    'title_arabic': 'النشاط الإشعاعي والتفكك',
                    'description': 'Understanding different types of radioactive decay.',
                    'description_arabic': 'فهم الأنواع المختلفة للتفكك الإشعاعي.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Which type of decay emits a helium nucleus (²⁴He)?',
                            'question_text_arabic': 'أي نوع من التفكك يبعث نواة هيليوم (²⁴He)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Alpha (α) decay', 'choice_text_arabic': 'تفكك ألفا (α)', 'is_correct': True},
                                {'choice_text': 'Beta-minus (β⁻) decay', 'choice_text_arabic': 'تفكك بيتا سالب (β⁻)', 'is_correct': False},
                                {'choice_text': 'Beta-plus (β⁺) decay', 'choice_text_arabic': 'تفكك بيتا موجب (β⁺)', 'is_correct': False},
                                {'choice_text': 'Gamma (γ) decay', 'choice_text_arabic': 'تفكك غاما (γ)', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'During beta-minus (β⁻) decay, a neutron is converted into a proton.',
                            'question_text_arabic': 'خلال تفكك بيتا سالب (β⁻)، يتحول نيوترون إلى بروتون.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What are the laws of conservation in nuclear reactions called?',
                            'question_text_arabic': 'ماذا تسمى قوانين الانحفاظ في التفاعلات النووية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Soddy\'s Laws', 'choice_text_arabic': 'قوانين سودي', 'is_correct': True},
                                {'choice_text': 'Newton\'s Laws', 'choice_text_arabic': 'قوانين نيوتن', 'is_correct': False},
                                {'choice_text': 'Ohm\'s Law', 'choice_text_arabic': 'قانون أوم', 'is_correct': False},
                                {'choice_text': 'Kepler\'s Laws', 'choice_text_arabic': 'قوانين كبلر', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A Polonium-210 nucleus (²¹⁰₈₄Po) undergoes alpha decay. What is the resulting nucleus?',
                            'question_text_arabic': 'تخضع نواة بولونيوم-210 (²¹⁰₈₄Po) لتفكك ألفا. ما هي النواة الناتجة؟',
                            'question_type': 'open_short',
                            'correct_answer': '²⁰⁶₈₂Pb'
                        }
                    ]
                },
                {
                    'title': 'Nuclear Fission and Fusion',
                    'title_arabic': 'الانشطار والاندماج النووي',
                    'description': 'Differentiating between fission and fusion reactions.',
                    'description_arabic': 'التمييز بين تفاعلات الانشطار والاندماج.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Which process involves splitting a heavy nucleus into lighter nuclei?',
                            'question_text_arabic': 'أي عملية تتضمن انقسام نواة ثقيلة إلى نوى أخف؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Fission', 'choice_text_arabic': 'الانشطار', 'is_correct': True},
                                {'choice_text': 'Fusion', 'choice_text_arabic': 'الاندماج', 'is_correct': False},
                                {'choice_text': 'Alpha decay', 'choice_text_arabic': 'تفكك ألفا', 'is_correct': False},
                                {'choice_text': 'Beta decay', 'choice_text_arabic': 'تفكك بيتا', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Nuclear fusion is the process that powers stars, including our Sun.',
                            'question_text_arabic': 'الاندماج النووي هو العملية التي تزود النجوم بالطاقة، بما في ذلك شمسنا.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Complete the following fission reaction: ²³⁵U + ¹n → ¹⁴¹Ba + ⁹²Kr + ?',
                            'question_text_arabic': 'أكمل تفاعل الانشطار التالي: ²³⁵U + ¹n → ¹⁴¹Ba + ⁹²Kr + ?',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '3 ¹n', 'choice_text_arabic': '3 ¹n', 'is_correct': True},
                                {'choice_text': '2 ¹n', 'choice_text_arabic': '2 ¹n', 'is_correct': False},
                                {'choice_text': '¹p', 'choice_text_arabic': '¹p', 'is_correct': False},
                                {'choice_text': '⁴He', 'choice_text_arabic': '⁴He', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Mass-Energy Equivalence',
                    'title_arabic': 'تكافؤ الكتلة والطاقة',
                    'description': 'Applying Einstein\'s famous equation E=mc².',
                    'description_arabic': 'تطبيق معادلة أينشتاين الشهيرة E=mc².',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is the name for the difference between the mass of a nucleus and the sum of the masses of its constituent nucleons?',
                            'question_text_arabic': 'ما هو اسم الفرق بين كتلة النواة ومجموع كتل النيوكليونات المكونة لها؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Mass defect', 'choice_text_arabic': 'النقص الكتلي', 'is_correct': True},
                                {'choice_text': 'Binding energy', 'choice_text_arabic': 'طاقة الربط', 'is_correct': False},
                                {'choice_text': 'Half-life', 'choice_text_arabic': 'عمر النصف', 'is_correct': False},
                                {'choice_text': 'Atomic mass unit', 'choice_text_arabic': 'وحدة الكتل الذرية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The energy released in a nuclear reaction corresponds to a decrease in mass.',
                            'question_text_arabic': 'الطاقة المنبعثة في تفاعل نووي تقابلها نقصان في الكتلة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Calculate the energy (in MeV) corresponding to a mass defect of 1 atomic mass unit (u), given that 1 u = 931.5 MeV/c².',
                            'question_text_arabic': 'احسب الطاقة (بـ MeV) المقابلة لنقص كتلي قدره 1 وحدة كتل ذرية (u)، علماً أن 1 u = 931.5 MeV/c².',
                            'question_type': 'open_short',
                            'correct_answer': '931.5 MeV'
                        }
                    ]
                },
                {
                    'title': 'Radioactive Dating and Applications',
                    'title_arabic': 'التأريخ الإشعاعي والتطبيقات',
                    'description': 'Understanding the applications of nuclear transformations.',
                    'description_arabic': 'فهم تطبيقات التحولات النووية.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'Which isotope is commonly used for dating ancient organic materials?',
                            'question_text_arabic': 'أي نظير يستخدم عادة لتأريخ المواد العضوية القديمة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Carbon-14', 'choice_text_arabic': 'الكربون-14', 'is_correct': True},
                                {'choice_text': 'Uranium-238', 'choice_text_arabic': 'اليورانيوم-238', 'is_correct': False},
                                {'choice_text': 'Potassium-40', 'choice_text_arabic': 'البوتاسيوم-40', 'is_correct': False},
                                {'choice_text': 'Cobalt-60', 'choice_text_arabic': 'الكوبالت-60', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A radioactive sample has a half-life of 20 years. What fraction of the sample will remain after 60 years?',
                            'question_text_arabic': 'عينة مشعة لها عمر نصف 20 سنة. ما هو الكسر المتبقي من العينة بعد 60 سنة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '1/8', 'choice_text_arabic': '1/8', 'is_correct': True},
                                {'choice_text': '1/4', 'choice_text_arabic': '1/4', 'is_correct': False},
                                {'choice_text': '1/6', 'choice_text_arabic': '1/6', 'is_correct': False},
                                {'choice_text': '1/3', 'choice_text_arabic': '1/3', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The half-life of a radioactive isotope is the time it takes for half of the nuclei in a sample to decay.',
                            'question_text_arabic': 'عمر النصف لنظير مشع هو الزمن اللازم لتفكك نصف نوى العينة.',
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
                exercise = Exercise.objects.create(
                    lesson=lesson,
                    created_by_id=1,
                    title=ex_data['title'],
                    title_arabic=ex_data['title_arabic'],
                    description=ex_data['description'],
                    instructions=ex_data.get('description_arabic', ''),
                    difficulty_level=ex_data['difficulty'],
                    is_active=True
                )
                total_exercises += 1

                for q_data in ex_data['questions']:
                    question = Question.objects.create(
                        exercise=exercise,
                        question_text=q_data['question_text'],
                        question_text_arabic=q_data['question_text_arabic'],
                        question_type=q_data['question_type'],
                        points=10 if ex_data['difficulty'] == 'beginner' else 15 if ex_data['difficulty'] == 'intermediate' else 20
                    )
                    total_questions += 1

                    if q_data['question_type'] in ['qcm_single', 'qcm_multiple'] and 'choices' in q_data:
                        for choice_data in q_data['choices']:
                            QuestionChoice.objects.create(
                                question=question,
                                choice_text=choice_data['choice_text'],
                                choice_text_arabic=choice_data['choice_text_arabic'],
                                is_correct=choice_data['is_correct']
                            )
                            total_choices += 1
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

                ExerciseReward.objects.create(
                    exercise=exercise,
                    completion_points=30 if ex_data['difficulty'] == 'beginner' else 50 if ex_data['difficulty'] == 'intermediate' else 70,
                    completion_coins=1,
                    perfect_score_bonus=20 if ex_data['difficulty'] == 'beginner' else 30 if ex_data['difficulty'] == 'intermediate' else 50
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created for Lesson 37 (Nuclear transformations):\n' 
                    f'Exercises: {total_exercises}\n' 
                    f'Questions: {total_questions}\n' 
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 37 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
