from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Electromagnetic waves – Transmission of information - Lesson ID: 50'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=50)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Properties of Electromagnetic Waves',
                    'title_arabic': 'خصائص الموجات الكهرومغناطيسية',
                    'description': 'Understanding the fundamental properties of EM waves.',
                    'description_arabic': 'فهم الخصائص الأساسية للموجات الكهرومغناطيسية.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'Electromagnetic waves consist of oscillating electric and magnetic fields that are perpendicular to each other.',
                            'question_text_arabic': 'تتكون الموجات الكهرومغناطيسية من مجالات كهربائية ومغناطيسية متذبذبة ومتعامدة مع بعضها البعض.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Which of the following is NOT an electromagnetic wave?',
                            'question_text_arabic': 'أي مما يلي ليس موجة كهرومغناطيسية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Sound waves', 'choice_text_arabic': 'الموجات الصوتية', 'is_correct': True},
                                {'choice_text': 'Radio waves', 'choice_text_arabic': 'موجات الراديو', 'is_correct': False},
                                {'choice_text': 'X-rays', 'choice_text_arabic': 'الأشعة السينية', 'is_correct': False},
                                {'choice_text': 'Visible light', 'choice_text_arabic': 'الضوء المرئي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'All electromagnetic waves travel at the same speed in a vacuum.',
                            'question_text_arabic': 'تنتقل جميع الموجات الكهرومغناطيسية بنفس السرعة في الفراغ.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'The Electromagnetic Spectrum',
                    'title_arabic': 'الطيف الكهرومغناطيسي',
                    'description': 'Understanding the different types of EM waves and their arrangement in the spectrum.',
                    'description_arabic': 'فهم الأنواع المختلفة من الموجات الكهرومغناطيسية وترتيبها في الطيف.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Which of the following has the longest wavelength?',
                            'question_text_arabic': 'أي مما يلي له أطول طول موجي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Radio waves', 'choice_text_arabic': 'موجات الراديو', 'is_correct': True},
                                {'choice_text': 'Gamma rays', 'choice_text_arabic': 'أشعة جاما', 'is_correct': False},
                                {'choice_text': 'Infrared', 'choice_text_arabic': 'الأشعة تحت الحمراء', 'is_correct': False},
                                {'choice_text': 'Ultraviolet', 'choice_text_arabic': 'الأشعة فوق البنفسجية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which of the following has the highest frequency and energy?',
                            'question_text_arabic': 'أي مما يلي له أعلى تردد وطاقة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Gamma rays', 'choice_text_arabic': 'أشعة جاما', 'is_correct': True},
                                {'choice_text': 'Microwaves', 'choice_text_arabic': 'الميكروويف', 'is_correct': False},
                                {'choice_text': 'Visible light', 'choice_text_arabic': 'الضوء المرئي', 'is_correct': False},
                                {'choice_text': 'Radio waves', 'choice_text_arabic': 'موجات الراديو', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The relationship between frequency (f), wavelength (λ), and the speed of light (c) is c = f * λ.',
                            'question_text_arabic': 'العلاقة بين التردد (f) والطول الموجي (λ) وسرعة الضوء (c) هي c = f * λ.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Transmission of Information',
                    'title_arabic': 'نقل المعلومات',
                    'description': 'Understanding how EM waves are used to carry information.',
                    'description_arabic': 'فهم كيفية استخدام الموجات الكهرومغناطيسية لنقل المعلومات.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is the process of superimposing an information signal onto a carrier wave called?',
                            'question_text_arabic': 'ماذا تسمى عملية تحميل إشارة معلومات على موجة حاملة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Modulation', 'choice_text_arabic': 'التضمين', 'is_correct': True},
                                {'choice_text': 'Demodulation', 'choice_text_arabic': 'فك التضمين', 'is_correct': False},
                                {'choice_text': 'Amplification', 'choice_text_arabic': 'التضخيم', 'is_correct': False},
                                {'choice_text': 'Reception', 'choice_text_arabic': 'الاستقبال', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Why is a high-frequency carrier wave needed to transmit information over long distances?',
                            'question_text_arabic': 'لماذا هناك حاجة إلى موجة حاملة عالية التردد لنقل المعلومات لمسافات طويلة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'High-frequency waves travel further and require smaller antennas', 'choice_text_arabic': 'الموجات عالية التردد تنتقل لمسافات أبعد وتتطلب هوائيات أصغر', 'is_correct': True},
                                {'choice_text': 'They are cheaper to produce', 'choice_text_arabic': 'إنتاجها أرخص', 'is_correct': False},
                                {'choice_text': 'They travel faster than low-frequency waves', 'choice_text_arabic': 'تنتقل أسرع من الموجات منخفضة التردد', 'is_correct': False},
                                {'choice_text': 'They are not affected by obstacles', 'choice_text_arabic': 'لا تتأثر بالعوائق', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The process of extracting the original information signal from the carrier wave at the receiver is called demodulation.',
                            'question_text_arabic': 'تسمى عملية استخلاص إشارة المعلومات الأصلية من الموجة الحاملة عند المستقبل بفك التضمين.',
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
                    f'Successfully created for Lesson 50 (Electromagnetic waves – Transmission of information):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 50 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
