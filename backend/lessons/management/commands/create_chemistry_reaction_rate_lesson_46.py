from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Time tracking of a transformation – Reaction rate - Lesson ID: 46'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=46)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Defining Reaction Rate',
                    'title_arabic': 'تعريف سرعة التفاعل',
                    'description': 'Understanding the concept and definition of reaction rate.',
                    'description_arabic': 'فهم مفهوم وتعريف سرعة التفاعل.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What does the rate of a chemical reaction measure?',
                            'question_text_arabic': 'ماذا تقيس سرعة التفاعل الكيميائي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'How fast reactants are consumed or products are formed', 'choice_text_arabic': 'مدى سرعة استهلاك المتفاعلات أو تكون النواتج', 'is_correct': True},
                                {'choice_text': 'The total amount of product formed', 'choice_text_arabic': 'الكمية الإجمالية للناتج المتكون', 'is_correct': False},
                                {'choice_text': 'The temperature of the reaction', 'choice_text_arabic': 'درجة حرارة التفاعل', 'is_correct': False},
                                {'choice_text': 'The energy released by the reaction', 'choice_text_arabic': 'الطاقة المنبعثة من التفاعل', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The unit of reaction rate is typically mol·L⁻¹·s⁻¹.',
                            'question_text_arabic': 'وحدة سرعة التفاعل هي عادةً mol·L⁻¹·s⁻¹.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The rate of disappearance of a reactant is always positive.',
                            'question_text_arabic': 'سرعة اختفاء متفاعل تكون دائمًا موجبة.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        }
                    ]
                },
                {
                    'title': 'Calculating Average and Instantaneous Rate',
                    'title_arabic': 'حساب السرعة المتوسطة واللحظية',
                    'description': 'Learning how to calculate reaction rates from experimental data.',
                    'description_arabic': 'تعلم كيفية حساب سرعات التفاعل من البيانات التجريبية.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'The average rate of reaction is calculated over a specific time interval.',
                            'question_text_arabic': 'تُحسب السرعة المتوسطة للتفاعل خلال فترة زمنية محددة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'How is the instantaneous rate of reaction determined from a concentration-time graph?',
                            'question_text_arabic': 'كيف يتم تحديد السرعة اللحظية للتفاعل من منحنى التركيز-الزمن؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'By finding the slope of the tangent to the curve at a specific time', 'choice_text_arabic': 'بإيجاد ميل المماس للمنحنى عند زمن معين', 'is_correct': True},
                                {'choice_text': 'By finding the area under the curve', 'choice_text_arabic': 'بإيجاد المساحة تحت المنحنى', 'is_correct': False},
                                {'choice_text': 'By dividing the final concentration by the total time', 'choice_text_arabic': 'بقسمة التركيز النهائي على الزمن الكلي', 'is_correct': False},
                                {'choice_text': 'By finding the highest point of the curve', 'choice_text_arabic': 'بإيجاد أعلى نقطة في المنحنى', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In a reaction, the concentration of a reactant changes from 0.8 M to 0.6 M in 100 seconds. What is the average rate of disappearance of the reactant?',
                            'question_text_arabic': 'في تفاعل ما، يتغير تركيز متفاعل من 0.8 M إلى 0.6 M في 100 ثانية. ما هي السرعة المتوسطة لاختفاء المتفاعل؟',
                            'question_type': 'open_short',
                            'correct_answer': '0.002 M/s'
                        }
                    ]
                },
                {
                    'title': 'Rate Law and Reaction Order',
                    'title_arabic': 'قانون السرعة ورتبة التفاعل',
                    'description': 'Understanding the relationship between rate and concentration.',
                    'description_arabic': 'فهم العلاقة بين السرعة والتركيز.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What does the rate law express?',
                            'question_text_arabic': 'ماذا يعبر قانون السرعة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The relationship between the reaction rate and the concentration of reactants', 'choice_text_arabic': 'العلاقة بين سرعة التفاعل وتركيز المتفاعلات', 'is_correct': True},
                                {'choice_text': 'The relationship between temperature and reaction rate', 'choice_text_arabic': 'العلاقة بين درجة الحرارة وسرعة التفاعل', 'is_correct': False},
                                {'choice_text': 'The stoichiometry of the reaction', 'choice_text_arabic': 'تفاعلية التفاعل', 'is_correct': False},
                                {'choice_text': 'The time it takes for the reaction to complete', 'choice_text_arabic': 'الوقت الذي يستغرقه التفاعل ليكتمل', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The order of a reaction with respect to a certain reactant can only be determined experimentally.',
                            'question_text_arabic': 'لا يمكن تحديد رتبة تفاعل بالنسبة لمتفاعل معين إلا تجريبياً.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'For a reaction with rate law: Rate = k[A]²[B], what is the overall order of the reaction?',
                            'question_text_arabic': 'لتفاعل قانونه للسرعة: السرعة = k[A]²[B]، ما هي الرتبة الكلية للتفاعل؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '3', 'choice_text_arabic': '3', 'is_correct': True},
                                {'choice_text': '2', 'choice_text_arabic': '2', 'is_correct': False},
                                {'choice_text': '1', 'choice_text_arabic': '1', 'is_correct': False},
                                {'choice_text': 'k', 'choice_text_arabic': 'k', 'is_correct': False}
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
                    f'Successfully created for Lesson 46 (Time tracking of a transformation – Reaction rate):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 46 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
