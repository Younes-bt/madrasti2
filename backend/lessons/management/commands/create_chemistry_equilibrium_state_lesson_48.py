from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Equilibrium state of a chemical system - Lesson ID: 48'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=48)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'The Equilibrium Constant (Kc)',
                    'title_arabic': 'ثابت التوازن (Kc)',
                    'description': 'Understanding and writing the equilibrium constant expression.',
                    'description_arabic': 'فهم وكتابة تعبير ثابت التوازن.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What does the equilibrium constant (Kc) represent?',
                            'question_text_arabic': 'ماذا يمثل ثابت التوازن (Kc)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The ratio of product concentrations to reactant concentrations at equilibrium', 'choice_text_arabic': 'نسبة تراكيز النواتج إلى تراكيز المتفاعلات عند التوازن', 'is_correct': True},
                                {'choice_text': 'The rate of the forward reaction', 'choice_text_arabic': 'سرعة التفاعل الأمامي', 'is_correct': False},
                                {'choice_text': 'The temperature at which equilibrium is reached', 'choice_text_arabic': 'درجة الحرارة التي يتم عندها الوصول إلى التوازن', 'is_correct': False},
                                {'choice_text': 'The total concentration of all species', 'choice_text_arabic': 'التركيز الكلي لجميع الأنواع', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The concentrations of pure solids and pure liquids are included in the equilibrium constant expression.',
                            'question_text_arabic': 'يتم تضمين تراكيز المواد الصلبة النقية والسوائل النقية في تعبير ثابت التوازن.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        },
                        {
                            'question_text': 'Write the Kc expression for the reaction: 2A(g) + B(g) ⇌ 3C(g)',
                            'question_text_arabic': 'اكتب تعبير Kc للتفاعل: 2A(g) + B(g) ⇌ 3C(g)',
                            'question_type': 'open_short',
                            'correct_answer': 'Kc = [C]³ / ([A]²[B])'
                        }
                    ]
                },
                {
                    'title': 'Interpreting Kc Values',
                    'title_arabic': 'تفسير قيم Kc',
                    'description': 'Understanding what the magnitude of Kc tells us about a reaction.',
                    'description_arabic': 'فهم ما تخبرنا به قيمة Kc عن تفاعل ما.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'A very large value of Kc (Kc >> 1) indicates that:',
                            'question_text_arabic': 'قيمة كبيرة جدًا لـ Kc (Kc >> 1) تشير إلى أن:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The equilibrium lies to the right; products are favored', 'choice_text_arabic': 'التوازن ينزاح إلى اليمين؛ النواتج هي المفضلة', 'is_correct': True},
                                {'choice_text': 'The equilibrium lies to the left; reactants are favored', 'choice_text_arabic': 'التوازن ينزاح إلى اليسار؛ المتفاعلات هي المفضلة', 'is_correct': False},
                                {'choice_text': 'The reaction is very slow', 'choice_text_arabic': 'التفاعل بطيء جدًا', 'is_correct': False},
                                {'choice_text': 'The reaction is exothermic', 'choice_text_arabic': 'التفاعل طارد للحرارة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'If Kc is very small (Kc << 1), the reaction mixture at equilibrium will consist mainly of reactants.',
                            'question_text_arabic': 'إذا كانت قيمة Kc صغيرة جدًا (Kc << 1)، فإن خليط التفاعل عند التوازن سيتكون بشكل أساسي من المتفاعلات.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The value of the equilibrium constant Kc depends on the temperature.',
                            'question_text_arabic': 'تعتمد قيمة ثابت التوازن Kc على درجة الحرارة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'The Reaction Quotient (Qc)',
                    'title_arabic': 'حاصل التفاعل (Qc)',
                    'description': 'Using the reaction quotient to predict the direction of a reaction.',
                    'description_arabic': 'استخدام حاصل التفاعل للتنبؤ باتجاه التفاعل.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'If the reaction quotient Qc is less than Kc, which way will the reaction proceed to reach equilibrium?',
                            'question_text_arabic': 'إذا كان حاصل التفاعل Qc أقل من Kc، ففي أي اتجاه سيسير التفاعل للوصول إلى التوازن؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'To the right (towards products)', 'choice_text_arabic': 'إلى اليمين (نحو النواتج)', 'is_correct': True},
                                {'choice_text': 'To the left (towards reactants)', 'choice_text_arabic': 'إلى اليسار (نحو المتفاعلات)', 'is_correct': False},
                                {'choice_text': 'The system is already at equilibrium', 'choice_text_arabic': 'النظام في حالة توازن بالفعل', 'is_correct': False},
                                {'choice_text': 'The reaction will stop', 'choice_text_arabic': 'سيتوقف التفاعل', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the relationship between Qc and Kc when the system is at equilibrium?',
                            'question_text_arabic': 'ما هي العلاقة بين Qc و Kc عندما يكون النظام في حالة توازن؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Qc = Kc', 'choice_text_arabic': 'Qc = Kc', 'is_correct': True},
                                {'choice_text': 'Qc > Kc', 'choice_text_arabic': 'Qc > Kc', 'is_correct': False},
                                {'choice_text': 'Qc < Kc', 'choice_text_arabic': 'Qc < Kc', 'is_correct': False},
                                {'choice_text': 'Qc = 0', 'choice_text_arabic': 'Qc = 0', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The expression for the reaction quotient Qc is formulated in the same way as the expression for the equilibrium constant Kc.',
                            'question_text_arabic': 'تتم صياغة تعبير حاصل التفاعل Qc بنفس طريقة تعبير ثابت التوازن Kc.',
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
                        points=10 if ex_data['difficulty'] == 'beginner' else (15 if ex_data['difficulty'] == 'intermediate' else 20)
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
                    completion_points=40,
                    completion_coins=2,
                    perfect_score_bonus=25
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created for Lesson 48 (Equilibrium state of a chemical system):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 48 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
