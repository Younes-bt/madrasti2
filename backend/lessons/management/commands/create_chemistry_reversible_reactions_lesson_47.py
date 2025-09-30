from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Reversible chemical reactions - Lesson ID: 47'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=47)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Concept of Reversibility',
                    'title_arabic': 'مفهوم التفاعلات العكوسة',
                    'description': 'Understanding the difference between reversible and irreversible reactions.',
                    'description_arabic': 'فهم الفرق بين التفاعلات العكوسة وغير العكوسة.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is a reversible chemical reaction?',
                            'question_text_arabic': 'ما هو التفاعل الكيميائي العكوس؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'A reaction where products can react to re-form reactants', 'choice_text_arabic': 'تفاعل يمكن فيه للنواتج أن تتفاعل لتعيد تكوين المتفاعلات', 'is_correct': True},
                                {'choice_text': 'A reaction that proceeds in one direction only', 'choice_text_arabic': 'تفاعل يسير في اتجاه واحد فقط', 'is_correct': False},
                                {'choice_text': 'A reaction that never reaches completion', 'choice_text_arabic': 'تفاعل لا يكتمل أبدًا', 'is_correct': False},
                                {'choice_text': 'A very fast reaction', 'choice_text_arabic': 'تفاعل سريع جدًا', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The combustion of wood is an example of a reversible reaction.',
                            'question_text_arabic': 'احتراق الخشب مثال على تفاعل عكوس.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        },
                        {
                            'question_text': 'How is a reversible reaction represented in a chemical equation?',
                            'question_text_arabic': 'كيف يُمثل التفاعل العكوس في معادلة كيميائية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'With a double arrow (⇌)', 'choice_text_arabic': 'بسهم مزدوج (⇌)', 'is_correct': True},
                                {'choice_text': 'With a single arrow (→)', 'choice_text_arabic': 'بسهم واحد (→)', 'is_correct': False},
                                {'choice_text': 'With an equals sign (=)', 'choice_text_arabic': 'بعلامة يساوي (=)', 'is_correct': False},
                                {'choice_text': 'With a plus sign (+)', 'choice_text_arabic': 'بعلامة زائد (+)', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Chemical Equilibrium',
                    'title_arabic': 'التوازن الكيميائي',
                    'description': 'Understanding the state of dynamic equilibrium.',
                    'description_arabic': 'فهم حالة التوازن الديناميكي.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is true about a system at chemical equilibrium?',
                            'question_text_arabic': 'ما هو الصحيح بشأن نظام في حالة توازن كيميائي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The rates of the forward and reverse reactions are equal', 'choice_text_arabic': 'سرعتا التفاعل الأمامي والعكسي متساويتان', 'is_correct': True},
                                {'choice_text': 'The concentrations of reactants and products are equal', 'choice_text_arabic': 'تراكيز المتفاعلات والنواتج متساوية', 'is_correct': False},
                                {'choice_text': 'The reaction has stopped completely', 'choice_text_arabic': 'توقف التفاعل تمامًا', 'is_correct': False},
                                {'choice_text': 'All reactants have been converted to products', 'choice_text_arabic': 'تحولت كل المتفاعلات إلى نواتج', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Chemical equilibrium is a static state where no reactions are occurring.',
                            'question_text_arabic': 'التوازن الكيميائي هو حالة ساكنة لا تحدث فيها أي تفاعلات.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        },
                        {
                            'question_text': 'At equilibrium, the macroscopic properties of the system (like color, pressure, concentration) remain constant.',
                            'question_text_arabic': 'عند التوازن، تظل الخصائص الماكروسكوبية للنظام (مثل اللون والضغط والتركيز) ثابتة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Le Chatelier\'s Principle',
                    'title_arabic': 'مبدأ لو شاتولييه',
                    'description': 'Predicting how a system at equilibrium responds to changes.',
                    'description_arabic': 'التنبؤ بكيفية استجابة نظام في حالة توازن للتغيرات.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'According to Le Chatelier\'s principle, if a change of condition is applied to a system in equilibrium, the system will shift in a direction that...',
                            'question_text_arabic': 'وفقًا لمبدأ لو شاتولييه، إذا تم تطبيق تغيير في الظروف على نظام في حالة توازن، فإن النظام سينزاح في اتجاه...',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '...counteracts the change.', 'choice_text_arabic': '...يعاكس التغيير.', 'is_correct': True},
                                {'choice_text': '...enhances the change.', 'choice_text_arabic': '...يعزز التغيير.', 'is_correct': False},
                                {'choice_text': '...stops the reaction.', 'choice_text_arabic': '...يوقف التفاعل.', 'is_correct': False},
                                {'choice_text': '...increases the temperature.', 'choice_text_arabic': '...يزيد من درجة الحرارة.', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'For the exothermic reaction N₂(g) + 3H₂(g) ⇌ 2NH₃(g), increasing the temperature will shift the equilibrium to the left.',
                            'question_text_arabic': 'للتفاعل الطارد للحرارة N₂(g) + 3H₂(g) ⇌ 2NH₃(g)، ستؤدي زيادة درجة الحرارة إلى إزاحة التوازن إلى اليسار.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'For the reaction 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), what is the effect of increasing the pressure?',
                            'question_text_arabic': 'للتفاعل 2SO₂(g) + O₂(g) ⇌ 2SO₃(g)، ما هو تأثير زيادة الضغط؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The equilibrium shifts to the right (favors products)', 'choice_text_arabic': 'ينزاح التوازن إلى اليمين (يفضل النواتج)', 'is_correct': True},
                                {'choice_text': 'The equilibrium shifts to the left (favors reactants)', 'choice_text_arabic': 'ينزاح التوازن إلى اليسار (يفضل المتفاعلات)', 'is_correct': False},
                                {'choice_text': 'There is no effect on the equilibrium', 'choice_text_arabic': 'لا يوجد تأثير على التوازن', 'is_correct': False},
                                {'choice_text': 'The reaction rate decreases', 'choice_text_arabic': 'تنخفض سرعة التفاعل', 'is_correct': False}
                            ]
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
                    f'Successfully created for Lesson 47 (Reversible chemical reactions):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 47 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
