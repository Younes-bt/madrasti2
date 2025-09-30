from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Propagation of a light wave - Lesson ID: 35'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=35)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Basic Light Wave Properties',
                    'title_arabic': 'خصائص موجات الضوء الأساسية',
                    'description': 'Understanding fundamental properties of light waves',
                    'description_arabic': 'فهم الخصائص الأساسية لموجات الضوء',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What type of wave is light?',
                            'question_text_arabic': 'ما نوع الموجة التي يمثلها الضوء؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Electromagnetic wave', 'choice_text_arabic': 'موجة كهرومغناطيسية', 'is_correct': True},
                                {'choice_text': 'Mechanical wave', 'choice_text_arabic': 'موجة ميكانيكية', 'is_correct': False},
                                {'choice_text': 'Sound wave', 'choice_text_arabic': 'موجة صوتية', 'is_correct': False},
                                {'choice_text': 'Water wave', 'choice_text_arabic': 'موجة مائية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the speed of light in vacuum?',
                            'question_text_arabic': 'ما هي سرعة الضوء في الفراغ؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '3 × 10⁸ m/s', 'choice_text_arabic': '3 × 10⁸ م/ث', 'is_correct': True},
                                {'choice_text': '3 × 10⁶ m/s', 'choice_text_arabic': '3 × 10⁶ م/ث', 'is_correct': False},
                                {'choice_text': '3 × 10¹⁰ m/s', 'choice_text_arabic': '3 × 10¹⁰ م/ث', 'is_correct': False},
                                {'choice_text': '3 × 10⁵ m/s', 'choice_text_arabic': '3 × 10⁵ م/ث', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Light waves can travel through vacuum.',
                            'question_text_arabic': 'يمكن لموجات الضوء أن تنتشر في الفراغ.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What determines the color of light?',
                            'question_text_arabic': 'ما الذي يحدد لون الضوء؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Frequency/Wavelength', 'choice_text_arabic': 'التردد/الطول الموجي', 'is_correct': True},
                                {'choice_text': 'Amplitude', 'choice_text_arabic': 'الاتساع', 'is_correct': False},
                                {'choice_text': 'Speed', 'choice_text_arabic': 'السرعة', 'is_correct': False},
                                {'choice_text': 'Phase', 'choice_text_arabic': 'الطور', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Light Propagation in Different Media',
                    'title_arabic': 'انتشار الضوء في أوساط مختلفة',
                    'description': 'How light travels through various materials',
                    'description_arabic': 'كيف ينتشر الضوء عبر مواد مختلفة',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What happens to the speed of light when it enters a denser medium?',
                            'question_text_arabic': 'ماذا يحدث لسرعة الضوء عندما يدخل وسطاً أكثر كثافة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'It decreases', 'choice_text_arabic': 'تقل', 'is_correct': True},
                                {'choice_text': 'It increases', 'choice_text_arabic': 'تزيد', 'is_correct': False},
                                {'choice_text': 'It remains constant', 'choice_text_arabic': 'تبقى ثابتة', 'is_correct': False},
                                {'choice_text': 'It becomes zero', 'choice_text_arabic': 'تصبح صفراً', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The refractive index of a medium is defined as:',
                            'question_text_arabic': 'يُعرَّف معامل الانكسار للوسط بأنه:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'n = c/v', 'choice_text_arabic': 'n = c/v', 'is_correct': True},
                                {'choice_text': 'n = v/c', 'choice_text_arabic': 'n = v/c', 'is_correct': False},
                                {'choice_text': 'n = c × v', 'choice_text_arabic': 'n = c × v', 'is_correct': False},
                                {'choice_text': 'n = c + v', 'choice_text_arabic': 'n = c + v', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Calculate the speed of light in glass with refractive index n = 1.5',
                            'question_text_arabic': 'احسب سرعة الضوء في الزجاج الذي معامل انكساره n = 1.5',
                            'question_type': 'open_short',
                            'correct_answer': '2 × 10⁸ m/s'
                        },
                        {
                            'question_text': 'Wavelength changes when light enters a different medium.',
                            'question_text_arabic': 'يتغير الطول الموجي عندما يدخل الضوء وسطاً مختلفاً.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Frequency changes when light enters a different medium.',
                            'question_text_arabic': 'يتغير التردد عندما يدخل الضوء وسطاً مختلفاً.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        }
                    ]
                },
                {
                    'title': 'Reflection and Refraction',
                    'title_arabic': 'الانعكاس والانكسار',
                    'description': 'Light behavior at interfaces between media',
                    'description_arabic': 'سلوك الضوء عند الحدود بين الأوساط',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'According to the law of reflection, the angle of incidence equals:',
                            'question_text_arabic': 'وفقاً لقانون الانعكاس، زاوية السقوط تساوي:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Angle of reflection', 'choice_text_arabic': 'زاوية الانعكاس', 'is_correct': True},
                                {'choice_text': 'Angle of refraction', 'choice_text_arabic': 'زاوية الانكسار', 'is_correct': False},
                                {'choice_text': 'Critical angle', 'choice_text_arabic': 'الزاوية الحرجة', 'is_correct': False},
                                {'choice_text': 'Twice the angle of reflection', 'choice_text_arabic': 'ضعف زاوية الانعكاس', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Snell\'s law relates:',
                            'question_text_arabic': 'قانون سنيل يربط بين:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Angles of incidence and refraction', 'choice_text_arabic': 'زاويتي السقوط والانكسار', 'is_correct': True},
                                {'choice_text': 'Angles of incidence and reflection', 'choice_text_arabic': 'زاويتي السقوط والانعكاس', 'is_correct': False},
                                {'choice_text': 'Wavelength and frequency', 'choice_text_arabic': 'الطول الموجي والتردد', 'is_correct': False},
                                {'choice_text': 'Speed and amplitude', 'choice_text_arabic': 'السرعة والاتساع', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is Snell\'s law formula?',
                            'question_text_arabic': 'ما هي صيغة قانون سنيل؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'n₁sin θ₁ = n₂sin θ₂', 'choice_text_arabic': 'n₁sin θ₁ = n₂sin θ₂', 'is_correct': True},
                                {'choice_text': 'n₁cos θ₁ = n₂cos θ₂', 'choice_text_arabic': 'n₁cos θ₁ = n₂cos θ₂', 'is_correct': False},
                                {'choice_text': 'n₁tan θ₁ = n₂tan θ₂', 'choice_text_arabic': 'n₁tan θ₁ = n₂tan θ₂', 'is_correct': False},
                                {'choice_text': 'n₁ θ₁ = n₂ θ₂', 'choice_text_arabic': 'n₁ θ₁ = n₂ θ₂', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'When light travels from a denser to a rarer medium, it bends away from the normal.',
                            'question_text_arabic': 'عندما ينتقل الضوء من وسط أكثر كثافة إلى وسط أقل كثافة، ينحني بعيداً عن العمود.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Total Internal Reflection',
                    'title_arabic': 'الانعكاس الداخلي الكلي',
                    'description': 'Critical angle and total internal reflection',
                    'description_arabic': 'الزاوية الحرجة والانعكاس الداخلي الكلي',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Total internal reflection occurs when:',
                            'question_text_arabic': 'يحدث الانعكاس الداخلي الكلي عندما:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Angle of incidence > Critical angle', 'choice_text_arabic': 'زاوية السقوط > الزاوية الحرجة', 'is_correct': True},
                                {'choice_text': 'Angle of incidence < Critical angle', 'choice_text_arabic': 'زاوية السقوط < الزاوية الحرجة', 'is_correct': False},
                                {'choice_text': 'Angle of incidence = 0°', 'choice_text_arabic': 'زاوية السقوط = 0°', 'is_correct': False},
                                {'choice_text': 'Angle of incidence = 90°', 'choice_text_arabic': 'زاوية السقوط = 90°', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The critical angle formula is:',
                            'question_text_arabic': 'صيغة الزاوية الحرجة هي:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'sin θc = n₂/n₁', 'choice_text_arabic': 'sin θc = n₂/n₁', 'is_correct': True},
                                {'choice_text': 'sin θc = n₁/n₂', 'choice_text_arabic': 'sin θc = n₁/n₂', 'is_correct': False},
                                {'choice_text': 'cos θc = n₂/n₁', 'choice_text_arabic': 'cos θc = n₂/n₁', 'is_correct': False},
                                {'choice_text': 'tan θc = n₂/n₁', 'choice_text_arabic': 'tan θc = n₂/n₁', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Calculate the critical angle for light going from glass (n=1.5) to air (n=1).',
                            'question_text_arabic': 'احسب الزاوية الحرجة للضوء المنتقل من الزجاج (n=1.5) إلى الهواء (n=1).',
                            'question_type': 'open_short',
                            'correct_answer': '41.8°'
                        }
                    ]
                },
                {
                    'title': 'Optical Fiber Applications',
                    'title_arabic': 'تطبيقات الألياف البصرية',
                    'description': 'Real-world applications of light propagation',
                    'description_arabic': 'التطبيقات الحقيقية لانتشار الضوء',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'Optical fibers work based on the principle of:',
                            'question_text_arabic': 'تعمل الألياف البصرية على أساس مبدأ:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Total internal reflection', 'choice_text_arabic': 'الانعكاس الداخلي الكلي', 'is_correct': True},
                                {'choice_text': 'Refraction only', 'choice_text_arabic': 'الانكسار فقط', 'is_correct': False},
                                {'choice_text': 'Diffraction', 'choice_text_arabic': 'الحيود', 'is_correct': False},
                                {'choice_text': 'Interference', 'choice_text_arabic': 'التداخل', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What advantage do optical fibers have over copper wires?',
                            'question_text_arabic': 'ما الميزة التي تتمتع بها الألياف البصرية مقارنة بالأسلاك النحاسية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Higher data transmission rate', 'choice_text_arabic': 'معدل نقل بيانات أعلى', 'is_correct': True},
                                {'choice_text': 'Lower cost', 'choice_text_arabic': 'تكلفة أقل', 'is_correct': False},
                                {'choice_text': 'Easier installation', 'choice_text_arabic': 'تركيب أسهل', 'is_correct': False},
                                {'choice_text': 'Better conductivity', 'choice_text_arabic': 'توصيل أفضل', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The core of an optical fiber has a higher refractive index than the cladding.',
                            'question_text_arabic': 'لب الليف البصري له معامل انكسار أعلى من الغلاف.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Light signals in optical fibers travel at the speed of light in vacuum.',
                            'question_text_arabic': 'تنتشر الإشارات الضوئية في الألياف البصرية بسرعة الضوء في الفراغ.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
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
                    f'Successfully created for Lesson 35 (Propagation of a light wave):\\n'
                    f'Exercises: {total_exercises}\\n'
                    f'Questions: {total_questions}\\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 35 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )