from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Amplitude modulation - Lesson ID: 51'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=51)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Basics of Amplitude Modulation (AM)',
                    'title_arabic': 'أساسيات تضمين السعة (AM)',
                    'description': 'Understanding the fundamental concept of AM.',
                    'description_arabic': 'فهم المفهوم الأساسي لتضمين السعة.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is amplitude modulation?',
                            'question_text_arabic': 'ما هو تضمين السعة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Varying the amplitude of the carrier wave in accordance with the information signal', 'choice_text_arabic': 'تغيير سعة الموجة الحاملة وفقًا لإشارة المعلومات', 'is_correct': True},
                                {'choice_text': 'Varying the frequency of the carrier wave', 'choice_text_arabic': 'تغيير تردد الموجة الحاملة', 'is_correct': False},
                                {'choice_text': 'Varying the phase of the carrier wave', 'choice_text_arabic': 'تغيير طور الموجة الحاملة', 'is_correct': False},
                                {'choice_text': 'Varying both amplitude and frequency', 'choice_text_arabic': 'تغيير كل من السعة والتردد', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In AM, the frequency of the carrier wave remains constant.',
                            'question_text_arabic': 'في تضمين السعة، يظل تردد الموجة الحاملة ثابتًا.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Which two signals are required for amplitude modulation?',
                            'question_text_arabic': 'ما هما الإشارتان المطلوبتان لتضمين السعة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'A carrier signal and a modulating (information) signal', 'choice_text_arabic': 'إشارة حاملة وإشارة مُضمِّنة (معلومات)', 'is_correct': True},
                                {'choice_text': 'An analog signal and a digital signal', 'choice_text_arabic': 'إشارة تماثلية وإشارة رقمية', 'is_correct': False},
                                {'choice_text': 'A high-frequency and a low-frequency signal', 'choice_text_arabic': 'إشارة عالية التردد وإشارة منخفضة التردد', 'is_correct': False},
                                {'choice_text': 'An electric signal and a magnetic signal', 'choice_text_arabic': 'إشارة كهربائية وإشارة مغناطيسية', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Modulation Index',
                    'title_arabic': 'معامل التضمين',
                    'description': 'Understanding the quality and depth of modulation.',
                    'description_arabic': 'فهم جودة وعمق التضمين.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What does the modulation index (m) describe?',
                            'question_text_arabic': 'ماذا يصف معامل التضمين (m)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The extent to which the carrier amplitude is varied by the modulating signal', 'choice_text_arabic': 'مدى تغير سعة الموجة الحاملة بواسطة الإشارة المُضمِّنة', 'is_correct': True},
                                {'choice_text': 'The frequency of the carrier wave', 'choice_text_arabic': 'تردد الموجة الحاملة', 'is_correct': False},
                                {'choice_text': 'The power of the modulated signal', 'choice_text_arabic': 'قدرة الإشارة المُضمَّنة', 'is_correct': False},
                                {'choice_text': 'The speed of the wave', 'choice_text_arabic': 'سرعة الموجة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'For good quality modulation, the modulation index (m) should be less than or equal to 1.',
                            'question_text_arabic': 'للحصول على تضمين جيد الجودة، يجب أن يكون معامل التضمين (m) أصغر من أو يساوي 1.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What happens if the modulation index is greater than 1 (overmodulation)?',
                            'question_text_arabic': 'ماذا يحدث إذا كان معامل التضمين أكبر من 1 (تضمين مفرط)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Distortion of the signal occurs', 'choice_text_arabic': 'يحدث تشويه للإشارة', 'is_correct': True},
                                {'choice_text': 'The signal becomes clearer', 'choice_text_arabic': 'تصبح الإشارة أكثر وضوحًا', 'is_correct': False},
                                {'choice_text': 'The carrier frequency changes', 'choice_text_arabic': 'يتغير تردد الموجة الحاملة', 'is_correct': False},
                                {'choice_text': 'The power is reduced', 'choice_text_arabic': 'تنخفض القدرة', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Demodulation of AM Waves',
                    'title_arabic': 'فك تضمين موجات AM',
                    'description': 'Understanding how the original information is recovered.',
                    'description_arabic': 'فهم كيفية استعادة المعلومات الأصلية.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is the key component used for the demodulation (detection) of an AM wave?',
                            'question_text_arabic': 'ما هو المكون الرئيسي المستخدم لفك تضمين (كشف) موجة AM؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'A diode (rectifier)', 'choice_text_arabic': 'صمام ثنائي (مقوم)', 'is_correct': True},
                                {'choice_text': 'An inductor', 'choice_text_arabic': 'وشيعة', 'is_correct': False},
                                {'choice_text': 'A transistor', 'choice_text_arabic': 'ترانزستور', 'is_correct': False},
                                {'choice_text': 'A resistor', 'choice_text_arabic': 'مقاوم', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The purpose of a low-pass filter in an AM receiver is to remove the high-frequency carrier wave component.',
                            'question_text_arabic': 'الغرض من مرشح الترددات المنخفضة في مستقبل AM هو إزالة مكون الموجة الحاملة عالية التردد.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A simple AM demodulator circuit is often called an envelope detector.',
                            'question_text_arabic': 'غالبًا ما تسمى دارة فك تضمين AM البسيطة بكاشف الغلاف.',
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
                    f'Successfully created for Lesson 51 (Amplitude modulation):\n' 
                    f'Exercises: {total_exercises}\n' 
                    f'Questions: {total_questions}\n' 
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 51 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
