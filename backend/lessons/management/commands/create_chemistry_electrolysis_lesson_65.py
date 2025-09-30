from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Forced transformations – Electrolysis - Lesson ID: 65'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=65)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Basics of Electrolytic Cells',
                    'title_arabic': 'أساسيات الخلايا الإلكتروليتية',
                    'description': 'Understanding the components and function of an electrolytic cell.',
                    'description_arabic': 'فهم مكونات ووظيفة الخلية الإلكتروليتية.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'An electrolytic cell converts electrical energy into chemical energy.',
                            'question_text_arabic': 'تحول الخلية الإلكتروليتية الطاقة الكهربائية إلى طاقة كيميائية.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'In an electrolytic cell, the anode is the positive electrode.',
                            'question_text_arabic': 'في الخلية الإلكتروليتية، يكون المصعد (الأنود) هو القطب الموجب.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the purpose of the external power source in electrolysis?',
                            'question_text_arabic': 'ما هو الغرض من مصدر الطاقة الخارجي في التحليل الكهربائي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'To force a non-spontaneous reaction to occur', 'choice_text_arabic': 'لإجبار تفاعل غير تلقائي على الحدوث', 'is_correct': True},
                                {'choice_text': 'To measure the voltage of the cell', 'choice_text_arabic': 'لقياس جهد الخلية', 'is_correct': False},
                                {'choice_text': 'To complete the circuit', 'choice_text_arabic': 'لإكمال الدائرة', 'is_correct': False},
                                {'choice_text': 'To heat the electrolyte', 'choice_text_arabic': 'لتسخين الإلكتروليت', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Electrolysis of Molten Salts and Water',
                    'title_arabic': 'التحليل الكهربائي للأملاح المنصهرة والماء',
                    'description': 'Understanding the products of electrolysis.',
                    'description_arabic': 'فهم نواتج التحليل الكهربائي.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'During the electrolysis of molten NaCl, sodium metal is produced at the cathode.',
                            'question_text_arabic': 'أثناء التحليل الكهربائي لـ NaCl المنصهر، يتم إنتاج فلز الصوديوم عند المهبط (الكاثود).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What are the products of the electrolysis of water?',
                            'question_text_arabic': 'ما هي نواتج التحليل الكهربائي للماء؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Hydrogen gas and Oxygen gas', 'choice_text_arabic': 'غاز الهيدروجين وغاز الأكسجين', 'is_correct': True},
                                {'choice_text': 'Sodium and Chlorine', 'choice_text_arabic': 'الصوديوم والكلور', 'is_correct': False},
                                {'choice_text': 'Water and Salt', 'choice_text_arabic': 'الماء والملح', 'is_correct': False},
                                {'choice_text': 'Hydrogen peroxide', 'choice_text_arabic': 'بيروكسيد الهيدروجين', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In the electrolysis of aqueous NaCl, chlorine gas is produced at the anode.',
                            'question_text_arabic': 'في التحليل الكهربائي لمحلول NaCl المائي، يتم إنتاج غاز الكلور عند المصعد.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Faraday\'s Laws of Electrolysis',
                    'title_arabic': 'قوانين فاراداي للتحليل الكهربائي',
                    'description': 'Quantitative aspects of electrolysis.',
                    'description_arabic': 'الجوانب الكمية للتحليل الكهربائي.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'Faraday\'s first law states that the mass of a substance produced at an electrode is directly proportional to the quantity of electricity passed through the electrolyte.',
                            'question_text_arabic': 'ينص قانون فاراداي الأول على أن كتلة المادة المنتجة عند قطب كهربائي تتناسب طرديًا مع كمية الكهرباء المارة عبر الإلكتروليت.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'One Faraday is the charge of one mole of electrons.',
                            'question_text_arabic': 'الفاراداي الواحد هو شحنة مول واحد من الإلكترونات.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'How many moles of electrons are required to produce 1 mole of Al from Al³⁺?',
                            'question_text_arabic': 'كم عدد مولات الإلكترونات اللازمة لإنتاج 1 مول من Al من Al³⁺؟',
                            'question_type': 'open_short',
                            'correct_answer': '3 moles'
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
                    f'Successfully created for Lesson 65 (Forced transformations – Electrolysis):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 65 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
