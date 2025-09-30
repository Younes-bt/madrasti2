from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Esterification and hydrolysis reactions - Lesson ID: 66'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=66)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Introduction to Esters',
                    'title_arabic': 'مقدمة في الإسترات',
                    'description': 'Understanding the structure and nomenclature of esters.',
                    'description_arabic': 'فهم بنية وتسمية الإسترات.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'Esters are characterized by the functional group -COO-.',
                            'question_text_arabic': 'تتميز الإسترات بالمجموعة الوظيفية -COO-.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What are the two types of organic compounds that react to form an ester?',
                            'question_text_arabic': 'ما هما نوعا المركبات العضوية اللذان يتفاعلان لتكوين إستر؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'A carboxylic acid and an alcohol', 'choice_text_arabic': 'حمض كربوكسيلي وكحول', 'is_correct': True},
                                {'choice_text': 'An aldehyde and a ketone', 'choice_text_arabic': 'ألدهيد وكيتون', 'is_correct': False},
                                {'choice_text': 'An alkane and an alkene', 'choice_text_arabic': 'ألكان وألكين', 'is_correct': False},
                                {'choice_text': 'An ether and an amine', 'choice_text_arabic': 'إيثر وأمين', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Many esters have pleasant, fruity smells.',
                            'question_text_arabic': 'للعديد من الإسترات روائح فواكه لطيفة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Esterification Reaction',
                    'title_arabic': 'تفاعل الأسترة',
                    'description': 'Understanding the process of ester formation.',
                    'description_arabic': 'فهم عملية تكوين الإستر.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Esterification is a reversible reaction.',
                            'question_text_arabic': 'تفاعل الأسترة هو تفاعل عكوس.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is typically used as a catalyst for esterification?',
                            'question_text_arabic': 'ما الذي يستخدم عادة كعامل حفاز لتفاعل الأسترة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Concentrated sulfuric acid', 'choice_text_arabic': 'حمض الكبريتيك المركز', 'is_correct': True},
                                {'choice_text': 'Water', 'choice_text_arabic': 'الماء', 'is_correct': False},
                                {'choice_text': 'Sodium hydroxide', 'choice_text_arabic': 'هيدروكسيد الصوديوم', 'is_correct': False},
                                {'choice_text': 'A metal catalyst like platinum', 'choice_text_arabic': 'عامل حفاز معدني مثل البلاتين', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are the products of the reaction between ethanoic acid and ethanol?',
                            'question_text_arabic': 'ما هي نواتج التفاعل بين حمض الإيثانويك والإيثانول؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Ethyl ethanoate and water', 'choice_text_arabic': 'إيثانوات الإيثيل والماء', 'is_correct': True},
                                {'choice_text': 'Acetic anhydride and water', 'choice_text_arabic': 'أنهيدريد الخل والماء', 'is_correct': False},
                                {'choice_text': 'Diethyl ether and water', 'choice_text_arabic': 'ثنائي إيثيل الإيثر والماء', 'is_correct': False},
                                {'choice_text': 'Only ethyl ethanoate', 'choice_text_arabic': 'إيثانوات الإيثيل فقط', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Hydrolysis of Esters',
                    'title_arabic': 'حلمأة الإسترات',
                    'description': 'Understanding the breakdown of esters.',
                    'description_arabic': 'فهم تفكك الإسترات.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'Hydrolysis is the reverse of esterification.',
                            'question_text_arabic': 'الحلمأة هي عكس تفاعل الأسترة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What are the products of the acid-catalyzed hydrolysis of ethyl acetate?',
                            'question_text_arabic': 'ما هي نواتج الحلمأة المحفزة بالحمض لأسيتات الإيثيل؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Acetic acid and ethanol', 'choice_text_arabic': 'حمض الأسيتيك والإيثانول', 'is_correct': True},
                                {'choice_text': 'Sodium acetate and ethanol', 'choice_text_arabic': 'أسيتات الصوديوم والإيثانول', 'is_correct': False},
                                {'choice_text': 'Acetic acid and sodium ethoxide', 'choice_text_arabic': 'حمض الأسيتيك وإيثوكسيد الصوديوم', 'is_correct': False},
                                {'choice_text': 'Only acetic acid', 'choice_text_arabic': 'حمض الأسيتيك فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The base-catalyzed hydrolysis of an ester is called saponification.',
                            'question_text_arabic': 'تسمى الحلمأة المحفزة بالقاعدة للإستر بالتصبن.',
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
                    f'Successfully created for Lesson 66 (Esterification and hydrolysis reactions):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 66 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
