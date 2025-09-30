from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for The Nucleus – Mass and energy - Lesson ID: 39'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=39)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Composition and Mass of the Nucleus',
                    'title_arabic': 'تركيب وكتلة النواة',
                    'description': 'Understanding the basic components and mass properties of the nucleus.',
                    'description_arabic': 'فهم المكونات الأساسية وخصائص الكتلة للنواة.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'The mass of a nucleus is always exactly equal to the sum of the masses of its individual protons and neutrons.',
                            'question_text_arabic': 'كتلة النواة تساوي دائمًا بالضبط مجموع كتل بروتوناتها ونيوتروناتها الفردية.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        },
                        {
                            'question_text': 'What is the atomic mass unit (u) approximately equal to?',
                            'question_text_arabic': 'ماذا تساوي وحدة الكتل الذرية (u) تقريبًا؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The mass of a proton or neutron', 'choice_text_arabic': 'كتلة بروتون أو نيوترون', 'is_correct': True},
                                {'choice_text': 'The mass of an electron', 'choice_text_arabic': 'كتلة إلكترون', 'is_correct': False},
                                {'choice_text': 'The mass of a hydrogen atom', 'choice_text_arabic': 'كتلة ذرة هيدروجين', 'is_correct': False},
                                {'choice_text': '1/12 the mass of a carbon-12 atom', 'choice_text_arabic': '1/12 من كتلة ذرة الكربون-12', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Define the mass number A.',
                            'question_text_arabic': 'عرّف عدد الكتلة A.',
                            'question_type': 'open_short',
                            'correct_answer': 'The total number of protons and neutrons in a nucleus.'
                        }
                    ]
                },
                {
                    'title': 'Mass Defect',
                    'title_arabic': 'النقص الكتلي',
                    'description': 'Calculating the mass defect of a nucleus.',
                    'description_arabic': 'حساب النقص الكتلي لنواة.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is mass defect (Δm)?',
                            'question_text_arabic': 'ما هو النقص الكتلي (Δm)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The difference between the mass of a nucleus and the sum of the masses of its nucleons', 'choice_text_arabic': 'الفرق بين كتلة النواة ومجموع كتل نوياتها', 'is_correct': True},
                                {'choice_text': 'The mass lost during radioactive decay', 'choice_text_arabic': 'الكتلة المفقودة أثناء التفكك الإشعاعي', 'is_correct': False},
                                {'choice_text': 'The mass of the binding energy', 'choice_text_arabic': 'كتلة طاقة الربط', 'is_correct': False},
                                {'choice_text': 'The mass of a neutron minus the mass of a proton', 'choice_text_arabic': 'كتلة النيوترون ناقص كتلة البروتون', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'For a stable nucleus, the mass defect is always positive.',
                            'question_text_arabic': 'بالنسبة لنواة مستقرة، يكون النقص الكتلي دائمًا موجبًا.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Calculate the mass defect of a Helium-4 nucleus (⁴₂He). Given: m(proton)=1.00728u, m(neutron)=1.00866u, m(He nucleus)=4.00150u.',
                            'question_text_arabic': 'احسب النقص الكتلي لنواة الهيليوم-4 (⁴₂He). معطيات: m(بروتون)=1.00728u, m(نيوترون)=1.00866u, m(نواة He)=4.00150u.',
                            'question_type': 'open_short',
                            'correct_answer': '0.0304 u'
                        }
                    ]
                },
                {
                    'title': 'Binding Energy',
                    'title_arabic': 'طاقة الربط',
                    'description': 'Understanding binding energy and its relation to mass defect.',
                    'description_arabic': 'فهم طاقة الربط وعلاقتها بالنقص الكتلي.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the relationship between binding energy (Eb) and mass defect (Δm)?',
                            'question_text_arabic': 'ما هي العلاقة بين طاقة الربط (Eb) والنقص الكتلي (Δm)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Eb = Δm * c²', 'choice_text_arabic': 'Eb = Δm * c²', 'is_correct': True},
                                {'choice_text': 'Eb = Δm / c²', 'choice_text_arabic': 'Eb = Δm / c²', 'is_correct': False},
                                {'choice_text': 'Eb = c² / Δm', 'choice_text_arabic': 'Eb = c² / Δm', 'is_correct': False},
                                {'choice_text': 'Eb = Δm + c²', 'choice_text_arabic': 'Eb = Δm + c²', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A higher binding energy per nucleon indicates a more stable nucleus.',
                            'question_text_arabic': 'طاقة ربط أعلى لكل نويّة تشير إلى نواة أكثر استقرارًا.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Calculate the binding energy of a Helium-4 nucleus in MeV, given its mass defect is 0.0304 u. (1 u = 931.5 MeV/c²)',
                            'question_text_arabic': 'احسب طاقة الربط لنواة الهيليوم-4 بـ MeV، علمًا أن نقصها الكتلي هو 0.0304 u. (1 u = 931.5 MeV/c²)',
                            'question_type': 'open_short',
                            'correct_answer': '28.3 MeV'
                        }
                    ]
                },
                {
                    'title': 'Binding Energy Curve',
                    'title_arabic': 'منحنى طاقة الربط',
                    'description': 'Interpreting the curve of binding energy per nucleon.',
                    'description_arabic': 'تفسير منحنى طاقة الربط لكل نويّة.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'Which element is located at the peak of the binding energy per nucleon curve, representing the most stable nuclei?',
                            'question_text_arabic': 'أي عنصر يقع في قمة منحنى طاقة الربط لكل نويّة، ممثلاً أكثر النوى استقرارًا؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Iron (Fe)', 'choice_text_arabic': 'الحديد (Fe)', 'is_correct': True},
                                {'choice_text': 'Hydrogen (H)', 'choice_text_arabic': 'الهيدروجين (H)', 'is_correct': False},
                                {'choice_text': 'Uranium (U)', 'choice_text_arabic': 'اليورانيوم (U)', 'is_correct': False},
                                {'choice_text': 'Helium (He)', 'choice_text_arabic': 'الهيليوم (He)', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Nuclear fission releases energy because the total binding energy of the products is greater than the binding energy of the initial nucleus.',
                            'question_text_arabic': 'يحرر الانشطار النووي طاقة لأن طاقة الربط الإجمالية للنواتج أكبر من طاقة الربط للنواة الأولية.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Explain why the fusion of light nuclei releases energy, with reference to the binding energy curve.',
                            'question_text_arabic': 'اشرح لماذا يحرر اندماج النوى الخفيفة طاقة، بالإشارة إلى منحنى طاقة الربط.',
                            'question_type': 'open_short',
                            'correct_answer': 'Light nuclei have low binding energy per nucleon. When they fuse, the resulting nucleus is heavier and has a much higher binding energy per nucleon, so the difference in energy is released.'
                        }
                    ]
                },
                {
                    'title': 'Energy of Nuclear Reactions',
                    'title_arabic': 'طاقة التفاعلات النووية',
                    'description': 'Calculating the energy released or absorbed in nuclear reactions.',
                    'description_arabic': 'حساب الطاقة المحررة أو الممتصة في التفاعلات النووية.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'The energy of a reaction (Q-value) is positive if the reaction is:',
                            'question_text_arabic': 'تكون طاقة التفاعل (Q-value) موجبة إذا كان التفاعل:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Exothermic (releases energy)', 'choice_text_arabic': 'ناشر للحرارة (يحرر طاقة)', 'is_correct': True},
                                {'choice_text': 'Endothermic (absorbs energy)', 'choice_text_arabic': 'ماص للحرارة (يمتص طاقة)', 'is_correct': False},
                                {'choice_text': 'Isotopic', 'choice_text_arabic': 'نظائري', 'is_correct': False},
                                {'choice_text': 'Stable', 'choice_text_arabic': 'مستقر', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A reaction is exothermic if the total mass of the reactants is greater than the total mass of the products.',
                            'question_text_arabic': 'يكون التفاعل ناشرًا للحرارة إذا كانت الكتلة الإجمالية للمتفاعلات أكبر من الكتلة الإجمالية للنواتج.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Calculate the energy released (in MeV) in the fusion reaction: ²₁H + ³₁H → ⁴₂He + ¹₀n. Given masses: m(²H)=2.0141u, m(³H)=3.0160u, m(⁴He)=4.0026u, m(¹n)=1.0087u. (1u = 931.5 MeV/c²)',
                            'question_text_arabic': 'احسب الطاقة المحررة (بـ MeV) في تفاعل الاندماج: ²₁H + ³₁H → ⁴₂He + ¹₀n. معطيات الكتل: m(²H)=2.0141u, m(³H)=3.0160u, m(⁴He)=4.0026u, m(¹n)=1.0087u. (1u = 931.5 MeV/c²)',
                            'question_type': 'open_short',
                            'correct_answer': '17.59 MeV'
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
                    f'Successfully created for Lesson 39 (The Nucleus – Mass and energy):\n' 
                    f'Exercises: {total_exercises}\n' 
                    f'Questions: {total_questions}\n' 
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 39 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
