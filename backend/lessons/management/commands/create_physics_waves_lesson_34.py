from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Periodic progressive mechanical waves - Lesson ID: 34'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=34)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Basic Wave Properties',
                    'title_arabic': 'خصائص الموجات الأساسية',
                    'description': 'Understanding fundamental wave characteristics',
                    'description_arabic': 'فهم الخصائص الأساسية للموجات',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is the definition of a mechanical wave?',
                            'question_text_arabic': 'ما هو تعريف الموجة الميكانيكية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'A disturbance that travels through a medium', 'choice_text_arabic': 'اضطراب ينتشر عبر وسط', 'is_correct': True},
                                {'choice_text': 'Energy moving without matter displacement', 'choice_text_arabic': 'طاقة تتحرك دون إزاحة المادة', 'is_correct': False},
                                {'choice_text': 'A vibration that stays in one place', 'choice_text_arabic': 'اهتزاز يبقى في مكان واحد', 'is_correct': False},
                                {'choice_text': 'Matter moving from one place to another', 'choice_text_arabic': 'مادة تتحرك من مكان إلى آخر', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the relationship between frequency (f) and period (T)?',
                            'question_text_arabic': 'ما هي العلاقة بين التردد (f) والدورة (T)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'f = 1/T', 'choice_text_arabic': 'f = 1/T', 'is_correct': True},
                                {'choice_text': 'f = T', 'choice_text_arabic': 'f = T', 'is_correct': False},
                                {'choice_text': 'f = 2T', 'choice_text_arabic': 'f = 2T', 'is_correct': False},
                                {'choice_text': 'f = T²', 'choice_text_arabic': 'f = T²', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The amplitude of a wave represents:',
                            'question_text_arabic': 'يمثل اتساع الموجة:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Maximum displacement from equilibrium', 'choice_text_arabic': 'أقصى إزاحة عن موضع التوازن', 'is_correct': True},
                                {'choice_text': 'The speed of the wave', 'choice_text_arabic': 'سرعة الموجة', 'is_correct': False},
                                {'choice_text': 'The wavelength', 'choice_text_arabic': 'الطول الموجي', 'is_correct': False},
                                {'choice_text': 'The frequency', 'choice_text_arabic': 'التردد', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Mechanical waves require a medium to propagate.',
                            'question_text_arabic': 'تحتاج الموجات الميكانيكية إلى وسط للانتشار.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Wave Equation and Speed',
                    'title_arabic': 'معادلة الموجة والسرعة',
                    'description': 'Understanding wave speed calculations',
                    'description_arabic': 'فهم حسابات سرعة الموجة',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the wave equation that relates speed, frequency, and wavelength?',
                            'question_text_arabic': 'ما هي معادلة الموجة التي تربط السرعة والتردد والطول الموجي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'v = fλ', 'choice_text_arabic': 'v = fλ', 'is_correct': True},
                                {'choice_text': 'v = f/λ', 'choice_text_arabic': 'v = f/λ', 'is_correct': False},
                                {'choice_text': 'v = λ/f', 'choice_text_arabic': 'v = λ/f', 'is_correct': False},
                                {'choice_text': 'v = f + λ', 'choice_text_arabic': 'v = f + λ', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A wave has a frequency of 50 Hz and wavelength of 0.4 m. Calculate its speed.',
                            'question_text_arabic': 'موجة لها تردد 50 هرتز وطول موجي 0.4 متر. احسب سرعتها.',
                            'question_type': 'open_short',
                            'correct_answer': '20 m/s'
                        },
                        {
                            'question_text': 'If a wave travels 100 m in 5 seconds, what is its speed?',
                            'question_text_arabic': 'إذا قطعت موجة مسافة 100 متر في 5 ثوان، ما هي سرعتها؟',
                            'question_type': 'open_short',
                            'correct_answer': '20 m/s'
                        },
                        {
                            'question_text': 'The speed of a wave depends on the properties of the medium.',
                            'question_text_arabic': 'تعتمد سرعة الموجة على خصائص الوسط.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A sound wave has frequency 440 Hz and speed 340 m/s. Find its wavelength.',
                            'question_text_arabic': 'موجة صوتية لها تردد 440 هرتز وسرعة 340 م/ث. اوجد طولها الموجي.',
                            'question_type': 'open_short',
                            'correct_answer': '0.77 m'
                        }
                    ]
                },
                {
                    'title': 'Types of Mechanical Waves',
                    'title_arabic': 'أنواع الموجات الميكانيكية',
                    'description': 'Transverse and longitudinal waves',
                    'description_arabic': 'الموجات المستعرضة والطولية',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'In a transverse wave, particles vibrate:',
                            'question_text_arabic': 'في الموجة المستعرضة، تهتز الجسيمات:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Perpendicular to wave direction', 'choice_text_arabic': 'عمودياً على اتجاه الموجة', 'is_correct': True},
                                {'choice_text': 'Parallel to wave direction', 'choice_text_arabic': 'موازياً لاتجاه الموجة', 'is_correct': False},
                                {'choice_text': 'In circular motion', 'choice_text_arabic': 'في حركة دائرية', 'is_correct': False},
                                {'choice_text': 'In random directions', 'choice_text_arabic': 'في اتجاهات عشوائية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which type of wave can travel through liquids?',
                            'question_text_arabic': 'أي نوع من الموجات يمكن أن ينتشر عبر السوائل؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Longitudinal waves only', 'choice_text_arabic': 'الموجات الطولية فقط', 'is_correct': True},
                                {'choice_text': 'Transverse waves only', 'choice_text_arabic': 'الموجات المستعرضة فقط', 'is_correct': False},
                                {'choice_text': 'Both types equally', 'choice_text_arabic': 'كلا النوعين بالتساوي', 'is_correct': False},
                                {'choice_text': 'Neither type', 'choice_text_arabic': 'لا أي من النوعين', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Sound waves in air are examples of longitudinal waves.',
                            'question_text_arabic': 'الموجات الصوتية في الهواء أمثلة على الموجات الطولية.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Water waves are purely transverse waves.',
                            'question_text_arabic': 'موجات الماء هي موجات مستعرضة بحتة.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        }
                    ]
                },
                {
                    'title': 'Wave Propagation in Different Media',
                    'title_arabic': 'انتشار الموجات في أوساط مختلفة',
                    'description': 'How waves travel through various materials',
                    'description_arabic': 'كيف تنتشر الموجات عبر مواد مختلفة',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Sound travels fastest in:',
                            'question_text_arabic': 'ينتشر الصوت بأسرع ما يمكن في:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Solids', 'choice_text_arabic': 'المواد الصلبة', 'is_correct': True},
                                {'choice_text': 'Liquids', 'choice_text_arabic': 'السوائل', 'is_correct': False},
                                {'choice_text': 'Gases', 'choice_text_arabic': 'الغازات', 'is_correct': False},
                                {'choice_text': 'Vacuum', 'choice_text_arabic': 'الفراغ', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The speed of sound in air at 20°C is approximately:',
                            'question_text_arabic': 'سرعة الصوت في الهواء عند 20°م تساوي تقريباً:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '343 m/s', 'choice_text_arabic': '343 م/ث', 'is_correct': True},
                                {'choice_text': '300 m/s', 'choice_text_arabic': '300 م/ث', 'is_correct': False},
                                {'choice_text': '400 m/s', 'choice_text_arabic': '400 م/ث', 'is_correct': False},
                                {'choice_text': '500 m/s', 'choice_text_arabic': '500 م/ث', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Temperature affects the speed of sound waves.',
                            'question_text_arabic': 'تؤثر درجة الحرارة على سرعة الموجات الصوتية.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Advanced Wave Analysis',
                    'title_arabic': 'تحليل الموجات المتقدم',
                    'description': 'Complex wave behavior and calculations',
                    'description_arabic': 'سلوك الموجات المعقد والحسابات',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'A string wave has the equation y = 0.05 sin(2πx - 100πt). What is the frequency?',
                            'question_text_arabic': 'موجة على وتر لها المعادلة y = 0.05 sin(2πx - 100πt). ما هو التردد؟',
                            'question_type': 'open_short',
                            'correct_answer': '50 Hz'
                        },
                        {
                            'question_text': 'If two waves of the same frequency but different amplitudes superpose, the result is:',
                            'question_text_arabic': 'إذا تداخلت موجتان لهما نفس التردد ولكن سعتان مختلفتان، فإن النتيجة هي:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'A wave with amplitude between the two original amplitudes', 'choice_text_arabic': 'موجة بسعة بين السعتين الأصليتين', 'is_correct': False},
                                {'choice_text': 'A wave with amplitude equal to the sum of amplitudes', 'choice_text_arabic': 'موجة بسعة تساوي مجموع السعتين', 'is_correct': False},
                                {'choice_text': 'Depends on the phase difference', 'choice_text_arabic': 'يعتمد على فرق الطور', 'is_correct': True},
                                {'choice_text': 'No wave at all', 'choice_text_arabic': 'لا توجد موجة على الإطلاق', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The intensity of a wave is proportional to the square of its amplitude.',
                            'question_text_arabic': 'شدة الموجة تتناسب مع مربع سعتها.',
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
                # Create exercise
                exercise = Exercise.objects.create(
                    lesson=lesson,
                    created_by_id=1,  # Assuming admin user with ID 1
                    title=ex_data['title'],
                    title_arabic=ex_data['title_arabic'],
                    description=ex_data['description'],
                    instructions=ex_data.get('description_arabic', ''),
                    difficulty_level=ex_data['difficulty'],
                    is_active=True
                )
                total_exercises += 1

                # Create questions for this exercise
                for q_data in ex_data['questions']:
                    question = Question.objects.create(
                        exercise=exercise,
                        question_text=q_data['question_text'],
                        question_text_arabic=q_data['question_text_arabic'],
                        question_type=q_data['question_type'],
                        points=10 if ex_data['difficulty'] == 'beginner' else 15 if ex_data['difficulty'] == 'intermediate' else 20
                    )
                    total_questions += 1

                    # Create choices for QCM questions
                    if q_data['question_type'] in ['qcm_single', 'qcm_multiple'] and 'choices' in q_data:
                        for choice_data in q_data['choices']:
                            QuestionChoice.objects.create(
                                question=question,
                                choice_text=choice_data['choice_text'],
                                choice_text_arabic=choice_data['choice_text_arabic'],
                                is_correct=choice_data['is_correct']
                            )
                            total_choices += 1

                    # Create choices for true/false questions
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

                # Create rewards for exercise completion
                ExerciseReward.objects.create(
                    exercise=exercise,
                    completion_points=30 if ex_data['difficulty'] == 'beginner' else 50 if ex_data['difficulty'] == 'intermediate' else 70,
                    completion_coins=1,
                    perfect_score_bonus=20 if ex_data['difficulty'] == 'beginner' else 30 if ex_data['difficulty'] == 'intermediate' else 50
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created for Lesson 34 (Periodic progressive mechanical waves):\\n'
                    f'Exercises: {total_exercises}\\n'
                    f'Questions: {total_questions}\\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 34 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )