from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for The atom and Newtonian mechanics - Lesson ID: 62'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=62)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Early Atomic Models',
                    'title_arabic': 'النماذج الذرية المبكرة',
                    'description': 'Understanding the historical development of atomic models.',
                    'description_arabic': 'فهم التطور التاريخي للنماذج الذرية.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'Which model described the atom as a uniform positive sphere with electrons embedded in it (plum pudding model)?',
                            'question_text_arabic': 'أي نموذج وصف الذرة بأنها كرة موجبة متجانسة مع إلكترونات مغروسة فيها (نموذج بودنغ البرقوق)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Thomson\'s model', 'choice_text_arabic': 'نموذج طومسون', 'is_correct': True},
                                {'choice_text': 'Rutherford\'s model', 'choice_text_arabic': 'نموذج رذرفورد', 'is_correct': False},
                                {'choice_text': 'Bohr\'s model', 'choice_text_arabic': 'نموذج بور', 'is_correct': False},
                                {'choice_text': 'Dalton\'s model', 'choice_text_arabic': 'نموذج دالتون', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Rutherford\'s gold foil experiment led to the discovery of the atomic nucleus.',
                            'question_text_arabic': 'أدت تجربة رقائق الذهب لرذرفورد إلى اكتشاف نواة الذرة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Rutherford\'s model proposed that electrons orbit the nucleus like planets around the sun.',
                            'question_text_arabic': 'اقترح نموذج رذرفورد أن الإلكترونات تدور حول النواة مثل الكواكب حول الشمس.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Limitations of Newtonian Mechanics at the Atomic Scale',
                    'title_arabic': 'حدود ميكانيكا نيوتن على المستوى الذري',
                    'description': 'Understanding why classical mechanics fails to describe the atom.',
                    'description_arabic': 'فهم سبب فشل الميكانيكا الكلاسيكية في وصف الذرة.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'According to classical physics, an orbiting electron should continuously radiate energy and spiral into the nucleus.',
                            'question_text_arabic': 'وفقًا للفيزياء الكلاسيكية، يجب أن يشع الإلكترون المداري طاقة باستمرار ويدور حلزونيًا إلى النواة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Classical mechanics could not explain the discrete emission spectra of atoms.',
                            'question_text_arabic': 'لم تستطع الميكانيكا الكلاسيكية تفسير أطياف الانبعاث المتقطعة للذرات.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The failure of Newtonian mechanics to explain atomic phenomena led to the development of quantum mechanics.',
                            'question_text_arabic': 'أدى فشل ميكانيكا نيوتن في تفسير الظواهر الذرية إلى تطوير ميكانيكا الكم.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'The Bohr Model and Quantization',
                    'title_arabic': 'نموذج بور والتكميم',
                    'description': 'Understanding Bohr\'s postulates and the concept of quantized energy levels.',
                    'description_arabic': 'فهم فرضيات بور ومفهوم مستويات الطاقة المكممة.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What was a key postulate of the Bohr model?',
                            'question_text_arabic': 'ما هي إحدى الفرضيات الرئيسية لنموذج بور؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Electrons exist in stable, quantized orbits without radiating energy', 'choice_text_arabic': 'توجد الإلكترونات في مدارات مستقرة ومكممة دون إشعاع طاقة', 'is_correct': True},
                                {'choice_text': 'Electrons can have any amount of energy', 'choice_text_arabic': 'يمكن أن يكون للإلكترونات أي كمية من الطاقة', 'is_correct': False},
                                {'choice_text': 'The nucleus is a uniform positive sphere', 'choice_text_arabic': 'النواة كرة موجبة متجانسة', 'is_correct': False},
                                {'choice_text': 'Atoms are indivisible', 'choice_text_arabic': 'الذرات غير قابلة للتجزئة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'According to Bohr, an electron emits a photon when it jumps from a higher energy level to a lower one.',
                            'question_text_arabic': 'وفقًا لبور، يبعث الإلكترون فوتونًا عندما يقفز من مستوى طاقة أعلى إلى مستوى أدنى.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The concept of quantized energy levels means that electrons can only have specific, discrete energy values.',
                            'question_text_arabic': 'يعني مفهوم مستويات الطاقة المكممة أن الإلكترونات لا يمكن أن يكون لها إلا قيم طاقة محددة ومتقطعة.',
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
                    f'Successfully created for Lesson 62 (The atom and Newtonian mechanics):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 62 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
