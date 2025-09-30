from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Diffraction of light by a grating - Lesson ID: 36'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=36)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Introduction to Diffraction',
                    'title_arabic': 'مقدمة في الحيود',
                    'description': 'Basic concepts of light diffraction',
                    'description_arabic': 'المفاهيم الأساسية لحيود الضوء',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is diffraction?',
                            'question_text_arabic': 'ما هو الحيود؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Bending of light around obstacles or through openings', 'choice_text_arabic': 'انحناء الضوء حول العوائق أو عبر الفتحات', 'is_correct': True},
                                {'choice_text': 'Reflection of light from surfaces', 'choice_text_arabic': 'انعكاس الضوء من الأسطح', 'is_correct': False},
                                {'choice_text': 'Refraction of light through media', 'choice_text_arabic': 'انكسار الضوء عبر الأوساط', 'is_correct': False},
                                {'choice_text': 'Absorption of light by materials', 'choice_text_arabic': 'امتصاص الضوء بواسطة المواد', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Diffraction is more pronounced when:',
                            'question_text_arabic': 'يكون الحيود أكثر وضوحاً عندما:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Wavelength is comparable to obstacle size', 'choice_text_arabic': 'يكون الطول الموجي مقارباً لحجم العائق', 'is_correct': True},
                                {'choice_text': 'Wavelength is much smaller than obstacle', 'choice_text_arabic': 'يكون الطول الموجي أصغر بكثير من العائق', 'is_correct': False},
                                {'choice_text': 'Light intensity is very high', 'choice_text_arabic': 'تكون شدة الضوء عالية جداً', 'is_correct': False},
                                {'choice_text': 'Light frequency is very low', 'choice_text_arabic': 'يكون تردد الضوء منخفضاً جداً', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Diffraction occurs only with light waves.',
                            'question_text_arabic': 'يحدث الحيود فقط مع موجات الضوء.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        },
                        {
                            'question_text': 'Which color of light diffracts more?',
                            'question_text_arabic': 'أي لون من الضوء يحيد أكثر؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Red (longer wavelength)', 'choice_text_arabic': 'الأحمر (طول موجي أطول)', 'is_correct': True},
                                {'choice_text': 'Blue (shorter wavelength)', 'choice_text_arabic': 'الأزرق (طول موجي أقصر)', 'is_correct': False},
                                {'choice_text': 'Green (medium wavelength)', 'choice_text_arabic': 'الأخضر (طول موجي متوسط)', 'is_correct': False},
                                {'choice_text': 'All colors diffract equally', 'choice_text_arabic': 'جميع الألوان تحيد بالتساوي', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Diffraction Grating Basics',
                    'title_arabic': 'أساسيات محزوز الحيود',
                    'description': 'Understanding diffraction gratings and their properties',
                    'description_arabic': 'فهم محازيز الحيود وخصائصها',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'A diffraction grating consists of:',
                            'question_text_arabic': 'يتكون محزوز الحيود من:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Many parallel slits of equal width and spacing', 'choice_text_arabic': 'شقوق متوازية كثيرة بعرض ومسافات متساوية', 'is_correct': True},
                                {'choice_text': 'A single narrow slit', 'choice_text_arabic': 'شق ضيق واحد', 'is_correct': False},
                                {'choice_text': 'Two parallel slits', 'choice_text_arabic': 'شقان متوازيان', 'is_correct': False},
                                {'choice_text': 'A circular aperture', 'choice_text_arabic': 'فتحة دائرية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the grating spacing (d)?',
                            'question_text_arabic': 'ما هي المسافة بين شقوق المحزوز (d)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Distance between centers of adjacent slits', 'choice_text_arabic': 'المسافة بين مراكز الشقوق المتجاورة', 'is_correct': True},
                                {'choice_text': 'Width of each slit', 'choice_text_arabic': 'عرض كل شق', 'is_correct': False},
                                {'choice_text': 'Total length of the grating', 'choice_text_arabic': 'الطول الكلي للمحزوز', 'is_correct': False},
                                {'choice_text': 'Number of slits per unit length', 'choice_text_arabic': 'عدد الشقوق لكل وحدة طول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'If a grating has 500 lines per mm, what is the grating spacing?',
                            'question_text_arabic': 'إذا كان للمحزوز 500 خط لكل مم، ما هي المسافة بين الشقوق؟',
                            'question_type': 'open_short',
                            'correct_answer': '2 × 10⁻⁶ m'
                        },
                        {
                            'question_text': 'The more lines per unit length a grating has, the better its resolution.',
                            'question_text_arabic': 'كلما زاد عدد الخطوط لكل وحدة طول في المحزوز، كانت دقته أفضل.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Grating Equation and Analysis',
                    'title_arabic': 'معادلة المحزوز والتحليل',
                    'description': 'Mathematical analysis of diffraction patterns',
                    'description_arabic': 'التحليل الرياضي لأنماط الحيود',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'The grating equation is:',
                            'question_text_arabic': 'معادلة المحزوز هي:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'd sin θ = mλ', 'choice_text_arabic': 'd sin θ = mλ', 'is_correct': True},
                                {'choice_text': 'd cos θ = mλ', 'choice_text_arabic': 'd cos θ = mλ', 'is_correct': False},
                                {'choice_text': 'd tan θ = mλ', 'choice_text_arabic': 'd tan θ = mλ', 'is_correct': False},
                                {'choice_text': 'd θ = mλ', 'choice_text_arabic': 'd θ = mλ', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In the grating equation, m represents:',
                            'question_text_arabic': 'في معادلة المحزوز، m يمثل:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Order of diffraction (integer)', 'choice_text_arabic': 'رتبة الحيود (عدد صحيح)', 'is_correct': True},
                                {'choice_text': 'Mass of photon', 'choice_text_arabic': 'كتلة الفوتون', 'is_correct': False},
                                {'choice_text': 'Magnitude of wave', 'choice_text_arabic': 'مقدار الموجة', 'is_correct': False},
                                {'choice_text': 'Number of slits', 'choice_text_arabic': 'عدد الشقوق', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'For a grating with d = 2μm, find the angle for first-order diffraction of red light (λ = 650nm).',
                            'question_text_arabic': 'لمحزوز بمسافة d = 2μm، اوجد الزاوية للحيود من الرتبة الأولى للضوء الأحمر (λ = 650nm).',
                            'question_type': 'open_short',
                            'correct_answer': '19.0°'
                        },
                        {
                            'question_text': 'The central bright fringe corresponds to m = 0.',
                            'question_text_arabic': 'الهدب المضيء المركزي يقابل m = 0.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Higher order diffractions (larger m) appear at smaller angles.',
                            'question_text_arabic': 'حيود الرتب العليا (m أكبر) يظهر عند زوايا أصغر.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        }
                    ]
                },
                {
                    'title': 'Spectral Analysis with Gratings',
                    'title_arabic': 'التحليل الطيفي بالمحازيز',
                    'description': 'Using gratings for wavelength measurement and spectroscopy',
                    'description_arabic': 'استخدام المحازيز لقياس الطول الموجي والتحليل الطيفي',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Why do different wavelengths diffract at different angles in a grating?',
                            'question_text_arabic': 'لماذا تحيد الأطوال الموجية المختلفة عند زوايا مختلفة في المحزوز؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Angle depends on wavelength in grating equation', 'choice_text_arabic': 'الزاوية تعتمد على الطول الموجي في معادلة المحزوز', 'is_correct': True},
                                {'choice_text': 'Different colors have different speeds', 'choice_text_arabic': 'الألوان المختلفة لها سرعات مختلفة', 'is_correct': False},
                                {'choice_text': 'Grating spacing changes with color', 'choice_text_arabic': 'مسافة المحزوز تتغير مع اللون', 'is_correct': False},
                                {'choice_text': 'Intensity varies with wavelength', 'choice_text_arabic': 'الشدة تتغير مع الطول الموجي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'White light passing through a grating produces:',
                            'question_text_arabic': 'الضوء الأبيض المار عبر المحزوز ينتج:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'A spectrum with red farthest from center', 'choice_text_arabic': 'طيفاً بالأحمر الأبعد عن المركز', 'is_correct': True},
                                {'choice_text': 'A spectrum with blue farthest from center', 'choice_text_arabic': 'طيفاً بالأزرق الأبعد عن المركز', 'is_correct': False},
                                {'choice_text': 'Only a central white bright fringe', 'choice_text_arabic': 'هدب مضيء أبيض مركزي فقط', 'is_correct': False},
                                {'choice_text': 'Alternating bright and dark fringes', 'choice_text_arabic': 'أهداب مضيئة ومظلمة متناوبة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Diffraction gratings can be used to measure unknown wavelengths.',
                            'question_text_arabic': 'يمكن استخدام محازيز الحيود لقياس الأطوال الموجية المجهولة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The resolving power of a grating increases with the number of illuminated slits.',
                            'question_text_arabic': 'القدرة التحليلية للمحزوز تزداد بزيادة عدد الشقوق المضاءة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Advanced Grating Applications',
                    'title_arabic': 'تطبيقات المحازيز المتقدمة',
                    'description': 'Real-world applications and advanced concepts',
                    'description_arabic': 'التطبيقات الحقيقية والمفاهيم المتقدمة',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'Reflection gratings work by:',
                            'question_text_arabic': 'تعمل محازيز الانعكاس بواسطة:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Reflecting light from ruled lines on a surface', 'choice_text_arabic': 'عكس الضوء من خطوط محفورة على سطح', 'is_correct': True},
                                {'choice_text': 'Transmitting light through transparent slits', 'choice_text_arabic': 'نقل الضوء عبر شقوق شفافة', 'is_correct': False},
                                {'choice_text': 'Absorbing specific wavelengths', 'choice_text_arabic': 'امتصاص أطوال موجية محددة', 'is_correct': False},
                                {'choice_text': 'Polarizing the incident light', 'choice_text_arabic': 'استقطاب الضوء الساقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which application uses diffraction gratings?',
                            'question_text_arabic': 'أي تطبيق يستخدم محازيز الحيود؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Spectrometers for chemical analysis', 'choice_text_arabic': 'أجهزة قياس الطيف للتحليل الكيميائي', 'is_correct': True},
                                {'choice_text': 'Magnifying glasses', 'choice_text_arabic': 'العدسات المكبرة', 'is_correct': False},
                                {'choice_text': 'Simple mirrors', 'choice_text_arabic': 'المرايا البسيطة', 'is_correct': False},
                                {'choice_text': 'Camera lenses', 'choice_text_arabic': 'عدسات الكاميرا', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Calculate the maximum order of diffraction for λ = 500nm and d = 1μm.',
                            'question_text_arabic': 'احسب أقصى رتبة حيود لـ λ = 500nm و d = 1μm.',
                            'question_type': 'open_short',
                            'correct_answer': 'm = 2'
                        },
                        {
                            'question_text': 'Holographic gratings are made using laser interference patterns.',
                            'question_text_arabic': 'تُصنع المحازيز المجسمة باستخدام أنماط تداخل الليزر.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Transmission gratings generally have higher efficiency than reflection gratings.',
                            'question_text_arabic': 'محازيز النفاذ لها كفاءة أعلى عموماً من محازيز الانعكاس.',
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
                    f'Successfully created for Lesson 36 (Diffraction of light by a grating):\\n'
                    f'Exercises: {total_exercises}\\n'
                    f'Questions: {total_questions}\\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 36 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )