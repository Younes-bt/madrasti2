from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Spontaneous evolution of a chemical system - Lesson ID: 63'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=63)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Reaction Quotient (Qr)',
                    'title_arabic': 'خارج التفاعل (Qr)',
                    'description': 'Understanding and calculating the reaction quotient.',
                    'description_arabic': 'فهم وحساب خارج التفاعل.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'The reaction quotient (Qr) has the same mathematical form as the equilibrium constant (K).',
                            'question_text_arabic': 'خارج التفاعل (Qr) له نفس الشكل الرياضي لثابت التوازن (K).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the main difference between the reaction quotient (Qr) and the equilibrium constant (K)?',
                            'question_text_arabic': 'ما هو الفرق الرئيسي بين خارج التفاعل (Qr) وثابت التوازن (K)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Qr is calculated for any set of concentrations, while K is only for equilibrium concentrations.', 'choice_text_arabic': 'يُحسب Qr لأي مجموعة من التراكيز، بينما يُحسب K فقط لتراكيز التوازن.', 'is_correct': True},
                                {'choice_text': 'K is calculated for any set of concentrations, while Qr is only for equilibrium concentrations.', 'choice_text_arabic': 'يُحسب K لأي مجموعة من التراكيز، بينما يُحسب Qr فقط لتراكيز التوازن.', 'is_correct': False},
                                {'choice_text': 'Qr is always larger than K.', 'choice_text_arabic': 'Qr دائمًا أكبر من K.', 'is_correct': False},
                                {'choice_text': 'K is always larger than Qr.', 'choice_text_arabic': 'K دائمًا أكبر من Qr.', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Predicting the Direction of Reaction',
                    'title_arabic': 'التنبؤ باتجاه التفاعل',
                    'description': 'Using Qr and K to predict the direction of a spontaneous reaction.',
                    'description_arabic': 'استخدام Qr و K للتنبؤ باتجاه تفاعل تلقائي.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'If Qr < K, the reaction will proceed in the forward direction (towards products).',
                            'question_text_arabic': 'إذا كان Qr < K، فإن التفاعل سيسير في الاتجاه المباشر (نحو النواتج).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'If Qr > K, the reaction will proceed in the reverse direction (towards reactants).',
                            'question_text_arabic': 'إذا كان Qr > K، فإن التفاعل سيسير في الاتجاه المعاكس (نحو المتفاعلات).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'If Qr = K, the system is at equilibrium.',
                            'question_text_arabic': 'إذا كان Qr = K، فإن النظام في حالة توازن.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Applications',
                    'title_arabic': 'التطبيقات',
                    'description': 'Applying the concepts to real chemical systems.',
                    'description_arabic': 'تطبيق المفاهيم على أنظمة كيميائية حقيقية.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'For the reaction H₂(g) + I₂(g) ⇌ 2HI(g), K = 50. If the initial concentrations are [H₂]=0.1 M, [I₂]=0.1 M, and [HI]=0.5 M, in which direction will the reaction proceed?',
                            'question_text_arabic': 'للتفاعل H₂(g) + I₂(g) ⇌ 2HI(g)، K = 50. إذا كانت التراكيز الابتدائية هي [H₂]=0.1 M, [I₂]=0.1 M, و [HI]=0.5 M، ففي أي اتجاه سيسير التفاعل؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'To the right (forward)', 'choice_text_arabic': 'إلى اليمين (مباشر)', 'is_correct': True},
                                {'choice_text': 'To the left (reverse)', 'choice_text_arabic': 'إلى اليسار (معاكس)', 'is_correct': False},
                                {'choice_text': 'It is at equilibrium', 'choice_text_arabic': 'في حالة توازن', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The spontaneity of a reaction is related to the change in Gibbs free energy (ΔG).',
                            'question_text_arabic': 'ترتبط تلقائية التفاعل بالتغير في طاقة جيبس الحرة (ΔG).',
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
                    f'Successfully created for Lesson 63 (Spontaneous evolution of a chemical system):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 63 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
