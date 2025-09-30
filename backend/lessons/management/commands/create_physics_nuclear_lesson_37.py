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
                    'title': 'Nuclear Structure and Notation',
                    'title_arabic': 'البنية النووية والرموز',
                    'description': 'Understanding atomic nucleus composition and notation',
                    'description_arabic': 'فهم تركيب النواة الذرية والرموز',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What are the two main particles in the nucleus?',
                            'question_text_arabic': 'ما هما الجسيمان الرئيسيان في النواة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Protons and neutrons', 'choice_text_arabic': 'البروتونات والنيوترونات', 'is_correct': True},
                                {'choice_text': 'Protons and electrons', 'choice_text_arabic': 'البروتونات والإلكترونات', 'is_correct': False},
                                {'choice_text': 'Neutrons and electrons', 'choice_text_arabic': 'النيوترونات والإلكترونات', 'is_correct': False},
                                {'choice_text': 'Positrons and neutrinos', 'choice_text_arabic': 'البوزيترونات والنيوترينات', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In nuclear notation ᴬX, what does A represent?',
                            'question_text_arabic': 'في الرمز النووي ᴬX، ماذا يمثل A؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Mass number (protons + neutrons)', 'choice_text_arabic': 'العدد الكتلي (بروتونات + نيوترونات)', 'is_correct': True},
                                {'choice_text': 'Atomic number (protons only)', 'choice_text_arabic': 'العدد الذري (البروتونات فقط)', 'is_correct': False},
                                {'choice_text': 'Number of neutrons only', 'choice_text_arabic': 'عدد النيوترونات فقط', 'is_correct': False},
                                {'choice_text': 'Number of electrons', 'choice_text_arabic': 'عدد الإلكترونات', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the atomic number Z?',
                            'question_text_arabic': 'ما هو العدد الذري Z؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Number of protons in the nucleus', 'choice_text_arabic': 'عدد البروتونات في النواة', 'is_correct': True},
                                {'choice_text': 'Number of neutrons in the nucleus', 'choice_text_arabic': 'عدد النيوترونات في النواة', 'is_correct': False},
                                {'choice_text': 'Total number of nucleons', 'choice_text_arabic': 'العدد الكلي للنوكليونات', 'is_correct': False},
                                {'choice_text': 'Number of electrons in orbit', 'choice_text_arabic': 'عدد الإلكترونات في المدار', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Isotopes have the same atomic number but different mass numbers.',
                            'question_text_arabic': 'النظائر لها نفس العدد الذري ولكن أعداد كتلية مختلفة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Types of Nuclear Transformations',
                    'title_arabic': 'أنواع التحولات النووية',
                    'description': 'Different types of radioactive decay processes',
                    'description_arabic': 'أنواع مختلفة من عمليات الانحلال الإشعاعي',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'In alpha decay, what is emitted?',
                            'question_text_arabic': 'في انحلال ألفا، ماذا ينبعث؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Helium nucleus (²He⁴)', 'choice_text_arabic': 'نواة الهليوم (²He⁴)', 'is_correct': True},
                                {'choice_text': 'High-energy electron', 'choice_text_arabic': 'إلكترون عالي الطاقة', 'is_correct': False},
                                {'choice_text': 'High-energy photon', 'choice_text_arabic': 'فوتون عالي الطاقة', 'is_correct': False},
                                {'choice_text': 'Positron', 'choice_text_arabic': 'بوزيترون', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In beta-minus decay, what happens?',
                            'question_text_arabic': 'في انحلال بيتا السالب، ماذا يحدث؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Neutron converts to proton + electron + antineutrino', 'choice_text_arabic': 'النيوترون يتحول إلى بروتون + إلكترون + نيوترينو مضاد', 'is_correct': True},
                                {'choice_text': 'Proton converts to neutron + positron + neutrino', 'choice_text_arabic': 'البروتون يتحول إلى نيوترون + بوزيترون + نيوترينو', 'is_correct': False},
                                {'choice_text': 'Nucleus emits alpha particle', 'choice_text_arabic': 'النواة تنبعث جسيم ألفا', 'is_correct': False},
                                {'choice_text': 'Nucleus captures electron', 'choice_text_arabic': 'النواة تلتقط إلكترون', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What characterizes gamma decay?',
                            'question_text_arabic': 'ما الذي يميز انحلال غاما؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Emission of high-energy photons', 'choice_text_arabic': 'انبعاث فوتونات عالية الطاقة', 'is_correct': True},
                                {'choice_text': 'Change in atomic number', 'choice_text_arabic': 'تغيير في العدد الذري', 'is_correct': False},
                                {'choice_text': 'Change in mass number', 'choice_text_arabic': 'تغيير في العدد الكتلي', 'is_correct': False},
                                {'choice_text': 'Emission of charged particles', 'choice_text_arabic': 'انبعاث جسيمات مشحونة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In alpha decay, the atomic number decreases by 2.',
                            'question_text_arabic': 'في انحلال ألفا، العدد الذري ينقص بـ 2.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Gamma rays have no mass or charge.',
                            'question_text_arabic': 'أشعة غاما ليس لها كتلة أو شحنة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Nuclear Equations and Conservation Laws',
                    'title_arabic': 'المعادلات النووية وقوانين الحفظ',
                    'description': 'Writing and balancing nuclear equations',
                    'description_arabic': 'كتابة وموازنة المعادلات النووية',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Which quantities are conserved in nuclear reactions?',
                            'question_text_arabic': 'أي الكميات محفوظة في التفاعلات النووية؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Mass number (A)', 'choice_text_arabic': 'العدد الكتلي (A)', 'is_correct': True},
                                {'choice_text': 'Atomic number (Z)', 'choice_text_arabic': 'العدد الذري (Z)', 'is_correct': True},
                                {'choice_text': 'Energy', 'choice_text_arabic': 'الطاقة', 'is_correct': True},
                                {'choice_text': 'Number of neutrons separately', 'choice_text_arabic': 'عدد النيوترونات منفصلاً', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Complete: ²³⁸U → ²³⁴Th + ?',
                            'question_text_arabic': 'أكمل: ²³⁸U → ²³⁴Th + ؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '⁴He (alpha particle)', 'choice_text_arabic': '⁴He (جسيم ألفا)', 'is_correct': True},
                                {'choice_text': 'e⁻ (beta particle)', 'choice_text_arabic': 'e⁻ (جسيم بيتا)', 'is_correct': False},
                                {'choice_text': 'γ (gamma ray)', 'choice_text_arabic': 'γ (أشعة غاما)', 'is_correct': False},
                                {'choice_text': 'n (neutron)', 'choice_text_arabic': 'n (نيوترون)', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In the equation ¹⁴C → ¹⁴N + e⁻ + ν̄, what type of decay is this?',
                            'question_text_arabic': 'في المعادلة ¹⁴C → ¹⁴N + e⁻ + ν̄، ما نوع الانحلال؟',
                            'question_type': 'open_short',
                            'correct_answer': 'Beta-minus decay'
                        },
                        {
                            'question_text': 'What is the mass number of the product in ²²⁶Ra → ²²²Rn + α?',
                            'question_text_arabic': 'ما هو العدد الكتلي للناتج في ²²⁶Ra → ²²²Rn + α؟',
                            'question_type': 'open_short',
                            'correct_answer': '222'
                        }
                    ]
                },
                {
                    'title': 'Induced Nuclear Reactions',
                    'title_arabic': 'التفاعلات النووية المستحثة',
                    'description': 'Artificially induced nuclear transformations',
                    'description_arabic': 'التحولات النووية المستحثة صناعياً',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is nuclear bombardment?',
                            'question_text_arabic': 'ما هو القصف النووي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Bombarding nuclei with particles to cause reactions', 'choice_text_arabic': 'قصف النوى بالجسيمات لإحداث تفاعلات', 'is_correct': True},
                                {'choice_text': 'Natural radioactive decay', 'choice_text_arabic': 'الانحلال الإشعاعي الطبيعي', 'is_correct': False},
                                {'choice_text': 'Nuclear fusion in stars', 'choice_text_arabic': 'الاندماج النووي في النجوم', 'is_correct': False},
                                {'choice_text': 'Electron capture process', 'choice_text_arabic': 'عملية التقاط الإلكترون', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The first artificial nuclear reaction was achieved by:',
                            'question_text_arabic': 'أول تفاعل نووي صناعي تم تحقيقه بواسطة:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Rutherford (alpha + nitrogen)', 'choice_text_arabic': 'رذرفورد (ألفا + نيتروجين)', 'is_correct': True},
                                {'choice_text': 'Curie (radium discovery)', 'choice_text_arabic': 'كوري (اكتشاف الراديوم)', 'is_correct': False},
                                {'choice_text': 'Einstein (mass-energy relation)', 'choice_text_arabic': 'آينشتاين (علاقة الكتلة-الطاقة)', 'is_correct': False},
                                {'choice_text': 'Becquerel (radioactivity discovery)', 'choice_text_arabic': 'بيكريل (اكتشاف الإشعاع)', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Complete: ¹⁴N + ⁴He → ¹⁷O + ?',
                            'question_text_arabic': 'أكمل: ¹⁴N + ⁴He → ¹⁷O + ؟',
                            'question_type': 'open_short',
                            'correct_answer': '¹H (proton)'
                        },
                        {
                            'question_text': 'Artificial radioactivity was discovered by bombarding aluminum with alpha particles.',
                            'question_text_arabic': 'تم اكتشاف الإشعاع الصناعي بقصف الألومنيوم بجسيمات ألفا.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Nuclear Fission and Fusion',
                    'title_arabic': 'الانشطار والاندماج النوويان',
                    'description': 'Large-scale nuclear energy release processes',
                    'description_arabic': 'عمليات تحرير الطاقة النووية واسعة النطاق',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is nuclear fission?',
                            'question_text_arabic': 'ما هو الانشطار النووي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Splitting heavy nucleus into lighter fragments', 'choice_text_arabic': 'تقسيم نواة ثقيلة إلى أجزاء أخف', 'is_correct': True},
                                {'choice_text': 'Combining light nuclei to form heavier nucleus', 'choice_text_arabic': 'دمج نوى خفيفة لتكوين نواة أثقل', 'is_correct': False},
                                {'choice_text': 'Emission of alpha particles', 'choice_text_arabic': 'انبعاث جسيمات ألفا', 'is_correct': False},
                                {'choice_text': 'Capture of neutrons by nucleus', 'choice_text_arabic': 'التقاط النيوترونات بواسطة النواة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What makes ²³⁵U suitable for nuclear reactors?',
                            'question_text_arabic': 'ما الذي يجعل ²³⁵U مناسباً للمفاعلات النووية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'It undergoes fission with thermal neutrons', 'choice_text_arabic': 'يخضع للانشطار مع النيوترونات الحرارية', 'is_correct': True},
                                {'choice_text': 'It has the longest half-life', 'choice_text_arabic': 'له أطول عمر نصف', 'is_correct': False},
                                {'choice_text': 'It emits only gamma rays', 'choice_text_arabic': 'ينبعث منه أشعة غاما فقط', 'is_correct': False},
                                {'choice_text': 'It is completely stable', 'choice_text_arabic': 'مستقر تماماً', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In nuclear fusion, what happens to mass?',
                            'question_text_arabic': 'في الاندماج النووي، ماذا يحدث للكتلة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Some mass is converted to energy (mass defect)', 'choice_text_arabic': 'بعض الكتلة تتحول إلى طاقة (نقص الكتلة)', 'is_correct': True},
                                {'choice_text': 'Mass increases significantly', 'choice_text_arabic': 'الكتلة تزداد بشكل كبير', 'is_correct': False},
                                {'choice_text': 'Mass remains perfectly conserved', 'choice_text_arabic': 'الكتلة تبقى محفوظة تماماً', 'is_correct': False},
                                {'choice_text': 'All mass disappears', 'choice_text_arabic': 'كل الكتلة تختفي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which process powers the Sun?',
                            'question_text_arabic': 'أي عملية تمد الشمس بالطاقة؟',
                            'question_type': 'open_short',
                            'correct_answer': 'Nuclear fusion'
                        },
                        {
                            'question_text': 'Nuclear fusion requires extremely high temperatures to overcome electrostatic repulsion.',
                            'question_text_arabic': 'الاندماج النووي يتطلب درجات حرارة عالية جداً للتغلب على التنافر الكهروستاتيكي.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Fission produces more radioactive waste than fusion.',
                            'question_text_arabic': 'الانشطار ينتج نفايات إشعاعية أكثر من الاندماج.',
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
                    f'Successfully created for Lesson 37 (Nuclear transformations):\\n'
                    f'Exercises: {total_exercises}\\n'
                    f'Questions: {total_questions}\\n'
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