from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Mechanical work and energy - Lesson ID: 129'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=129)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Work in Mechanical Systems',
                    'title_arabic': 'الشغل في الأنظمة الميكانيكية',
                    'description': 'Understanding work done by various forces in mechanical systems',
                    'description_arabic': 'فهم الشغل المبذول بواسطة القوى المختلفة في الأنظمة الميكانيكية',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'When is work done on an object?',
                            'question_text_arabic': 'متى يُبذل شغل على جسم؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'When a force causes displacement in the direction of the force', 'choice_text_arabic': 'عندما تسبب قوة إزاحة في اتجاه القوة', 'is_correct': True},
                                {'choice_text': 'When any force is applied regardless of motion', 'choice_text_arabic': 'عندما تُطبق أي قوة بغض النظر عن الحركة', 'is_correct': False},
                                {'choice_text': 'Only when objects move vertically', 'choice_text_arabic': 'فقط عندما تتحرك الأجسام عمودياً', 'is_correct': False},
                                {'choice_text': 'When objects are at rest', 'choice_text_arabic': 'عندما تكون الأجسام في حالة سكون', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the work done by friction?',
                            'question_text_arabic': 'ما الشغل المبذول بواسطة الاحتكاك؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Always negative (opposes motion)', 'choice_text_arabic': 'دائماً سالب (يعارض الحركة)', 'is_correct': True},
                                {'choice_text': 'Always positive', 'choice_text_arabic': 'دائماً موجب', 'is_correct': False},
                                {'choice_text': 'Always zero', 'choice_text_arabic': 'دائماً صفر', 'is_correct': False},
                                {'choice_text': 'Can be positive or negative', 'choice_text_arabic': 'يمكن أن يكون موجباً أو سالباً', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A person pushes a box with 50 N force through 3 m distance. What work is done?',
                            'question_text_arabic': 'شخص يدفع صندوقاً بقوة 50 نيوتن عبر مسافة 3 أمتار. ما الشغل المبذول؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '150 J', 'choice_text_arabic': '150 جول', 'is_correct': True},
                                {'choice_text': '53 J', 'choice_text_arabic': '53 جول', 'is_correct': False},
                                {'choice_text': '47 J', 'choice_text_arabic': '47 جول', 'is_correct': False},
                                {'choice_text': '17 J', 'choice_text_arabic': '17 جول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the work done by gravity on a falling object?',
                            'question_text_arabic': 'ما الشغل المبذول بواسطة الجاذبية على جسم ساقط؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Positive (force and displacement in same direction)', 'choice_text_arabic': 'موجب (القوة والإزاحة في نفس الاتجاه)', 'is_correct': True},
                                {'choice_text': 'Negative', 'choice_text_arabic': 'سالب', 'is_correct': False},
                                {'choice_text': 'Zero', 'choice_text_arabic': 'صفر', 'is_correct': False},
                                {'choice_text': 'Undefined', 'choice_text_arabic': 'غير محدد', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Work is done only by the net force on an object.',
                            'question_text_arabic': 'الشغل يُبذل فقط بواسطة القوة المحصلة على الجسم.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        }
                    ]
                },
                {
                    'title': 'Energy Conversion in Machines',
                    'title_arabic': 'تحويل الطاقة في الآلات',
                    'description': 'Understanding how machines convert and transfer energy',
                    'description_arabic': 'فهم كيف تحول الآلات وتنقل الطاقة',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is mechanical advantage?',
                            'question_text_arabic': 'ما هي الفائدة الميكانيكية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The ratio of output force to input force', 'choice_text_arabic': 'نسبة القوة الخارجة إلى القوة الداخلة', 'is_correct': True},
                                {'choice_text': 'The speed of a machine', 'choice_text_arabic': 'سرعة الآلة', 'is_correct': False},
                                {'choice_text': 'The efficiency of energy conversion', 'choice_text_arabic': 'كفاءة تحويل الطاقة', 'is_correct': False},
                                {'choice_text': 'The power output of a machine', 'choice_text_arabic': 'القدرة الخارجة للآلة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the efficiency of a machine?',
                            'question_text_arabic': 'ما كفاءة الآلة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Output work divided by input work', 'choice_text_arabic': 'الشغل الخارج مقسوماً على الشغل الداخل', 'is_correct': True},
                                {'choice_text': 'Input work divided by output work', 'choice_text_arabic': 'الشغل الداخل مقسوماً على الشغل الخارج', 'is_correct': False},
                                {'choice_text': 'Total work done by the machine', 'choice_text_arabic': 'إجمالي الشغل المبذول بواسطة الآلة', 'is_correct': False},
                                {'choice_text': 'Work lost to friction', 'choice_text_arabic': 'الشغل المفقود للاحتكاك', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Why is no machine 100% efficient?',
                            'question_text_arabic': 'لماذا لا توجد آلة بكفاءة 100%؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Energy is always lost to friction and heat', 'choice_text_arabic': 'الطاقة تُفقد دائماً للاحتكاك والحرارة', 'is_correct': True},
                                {'choice_text': 'Machines create energy', 'choice_text_arabic': 'الآلات تخلق الطاقة', 'is_correct': False},
                                {'choice_text': 'Input work is always greater than needed', 'choice_text_arabic': 'الشغل الداخل دائماً أكبر من المطلوب', 'is_correct': False},
                                {'choice_text': 'Machines destroy some energy', 'choice_text_arabic': 'الآلات تدمر بعض الطاقة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A machine does 800 J of useful work when 1000 J of energy is input. What is its efficiency?',
                            'question_text_arabic': 'آلة تبذل 800 جول من الشغل المفيد عندما تدخل 1000 جول من الطاقة. ما كفاءتها؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '80%', 'choice_text_arabic': '80%', 'is_correct': True},
                                {'choice_text': '125%', 'choice_text_arabic': '125%', 'is_correct': False},
                                {'choice_text': '20%', 'choice_text_arabic': '20%', 'is_correct': False},
                                {'choice_text': '1800%', 'choice_text_arabic': '1800%', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A lever can multiply force but never multiply work.',
                            'question_text_arabic': 'الرافعة يمكنها مضاعفة القوة لكن لا تضاعف الشغل أبداً.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Simple Machines and Work',
                    'title_arabic': 'الآلات البسيطة والشغل',
                    'description': 'Analyzing work and energy in simple machines',
                    'description_arabic': 'تحليل الشغل والطاقة في الآلات البسيطة',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Which are examples of simple machines?',
                            'question_text_arabic': 'أي منها أمثلة على الآلات البسيطة؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Lever', 'choice_text_arabic': 'الرافعة', 'is_correct': True},
                                {'choice_text': 'Pulley', 'choice_text_arabic': 'البكرة', 'is_correct': True},
                                {'choice_text': 'Inclined plane', 'choice_text_arabic': 'المستوى المائل', 'is_correct': True},
                                {'choice_text': 'Electric motor', 'choice_text_arabic': 'المحرك الكهربائي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In a pulley system, what is the trade-off for gaining mechanical advantage?',
                            'question_text_arabic': 'في نظام البكرات، ما المقايضة للحصول على فائدة ميكانيكية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'You must pull the rope a greater distance', 'choice_text_arabic': 'يجب سحب الحبل مسافة أكبر', 'is_correct': True},
                                {'choice_text': 'You lose energy', 'choice_text_arabic': 'تفقد الطاقة', 'is_correct': False},
                                {'choice_text': 'The load becomes heavier', 'choice_text_arabic': 'الحمولة تصبح أثقل', 'is_correct': False},
                                {'choice_text': 'The machine works slower', 'choice_text_arabic': 'الآلة تعمل بشكل أبطأ', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What advantage does an inclined plane provide?',
                            'question_text_arabic': 'ما الفائدة التي يوفرها المستوى المائل؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Reduces the force needed to lift an object', 'choice_text_arabic': 'يقلل القوة المطلوبة لرفع جسم', 'is_correct': True},
                                {'choice_text': 'Reduces the total work needed', 'choice_text_arabic': 'يقلل إجمالي الشغل المطلوب', 'is_correct': False},
                                {'choice_text': 'Makes objects lighter', 'choice_text_arabic': 'يجعل الأجسام أخف', 'is_correct': False},
                                {'choice_text': 'Increases the speed of movement', 'choice_text_arabic': 'يزيد سرعة الحركة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A wheel and axle system has a wheel radius of 30 cm and axle radius of 5 cm. What is the mechanical advantage?',
                            'question_text_arabic': 'نظام عجلة ومحور له عجلة نصف قطرها 30 سم ومحور نصف قطره 5 سم. ما الفائدة الميكانيكية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '6', 'choice_text_arabic': '6', 'is_correct': True},
                                {'choice_text': '25', 'choice_text_arabic': '25', 'is_correct': False},
                                {'choice_text': '35', 'choice_text_arabic': '35', 'is_correct': False},
                                {'choice_text': '150', 'choice_text_arabic': '150', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Calculate the work needed to push a 100 N box up a 5 m long ramp to a height of 2 m (ignore friction)',
                            'question_text_arabic': 'احسب الشغل المطلوب لدفع صندوق وزنه 100 نيوتن أعلى منحدر طوله 5 أمتار لارتفاع 2 متر (تجاهل الاحتكاك)',
                            'question_type': 'open_short',
                            'correct_answer': '200 J'
                        }
                    ]
                },
                {
                    'title': 'Energy Conservation in Mechanical Systems',
                    'title_arabic': 'حفظ الطاقة في الأنظمة الميكانيكية',
                    'description': 'Applying conservation of energy to analyze mechanical systems',
                    'description_arabic': 'تطبيق حفظ الطاقة لتحليل الأنظمة الميكانيكية',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'In a conservative system, what remains constant?',
                            'question_text_arabic': 'في النظام المحافظ، ما الذي يبقى ثابتاً؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Total mechanical energy', 'choice_text_arabic': 'إجمالي الطاقة الميكانيكية', 'is_correct': True},
                                {'choice_text': 'Kinetic energy only', 'choice_text_arabic': 'الطاقة الحركية فقط', 'is_correct': False},
                                {'choice_text': 'Potential energy only', 'choice_text_arabic': 'طاقة الوضع فقط', 'is_correct': False},
                                {'choice_text': 'Force applied', 'choice_text_arabic': 'القوة المطبقة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A 5 kg ball falls from 10 m height. What is its speed just before hitting the ground? (g = 10 m/s²)',
                            'question_text_arabic': 'كرة كتلتها 5 كيلوجرام تسقط من ارتفاع 10 أمتار. ما سرعتها قبل اصطدامها بالأرض مباشرة؟ (g = 10 م/ث²)',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '14.1 m/s', 'choice_text_arabic': '14.1 م/ث', 'is_correct': True},
                                {'choice_text': '10 m/s', 'choice_text_arabic': '10 م/ث', 'is_correct': False},
                                {'choice_text': '50 m/s', 'choice_text_arabic': '50 م/ث', 'is_correct': False},
                                {'choice_text': '100 m/s', 'choice_text_arabic': '100 م/ث', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'When is mechanical energy NOT conserved?',
                            'question_text_arabic': 'متى لا تُحفظ الطاقة الميكانيكية؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'When friction is present', 'choice_text_arabic': 'عند وجود الاحتكاك', 'is_correct': True},
                                {'choice_text': 'When air resistance acts', 'choice_text_arabic': 'عندما تؤثر مقاومة الهواء', 'is_correct': True},
                                {'choice_text': 'During inelastic collisions', 'choice_text_arabic': 'أثناء التصادمات غير المرنة', 'is_correct': True},
                                {'choice_text': 'In gravitational fields', 'choice_text_arabic': 'في المجالات الجاذبية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A spring-mass system oscillates. When is kinetic energy maximum?',
                            'question_text_arabic': 'نظام نابض-كتلة يتذبذب. متى تكون الطاقة الحركية أقصى ما يمكن؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'At the equilibrium position', 'choice_text_arabic': 'عند موضع التوازن', 'is_correct': True},
                                {'choice_text': 'At maximum displacement', 'choice_text_arabic': 'عند أقصى إزاحة', 'is_correct': False},
                                {'choice_text': 'When spring is most compressed', 'choice_text_arabic': 'عندما يكون النابض أكثر انضغاطاً', 'is_correct': False},
                                {'choice_text': 'It remains constant', 'choice_text_arabic': 'تبقى ثابتة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In an isolated system, total energy is always conserved.',
                            'question_text_arabic': 'في النظام المعزول، إجمالي الطاقة محفوظ دائماً.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Power in Mechanical Systems',
                    'title_arabic': 'القدرة في الأنظمة الميكانيكية',
                    'description': 'Understanding power as rate of energy transfer in mechanical applications',
                    'description_arabic': 'فهم القدرة كمعدل نقل الطاقة في التطبيقات الميكانيكية',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'How is power related to force and velocity?',
                            'question_text_arabic': 'كيف ترتبط القدرة بالقوة والسرعة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Power = Force × velocity', 'choice_text_arabic': 'القدرة = القوة × السرعة', 'is_correct': True},
                                {'choice_text': 'Power = Force / velocity', 'choice_text_arabic': 'القدرة = القوة / السرعة', 'is_correct': False},
                                {'choice_text': 'Power = Force + velocity', 'choice_text_arabic': 'القدرة = القوة + السرعة', 'is_correct': False},
                                {'choice_text': 'Power = Force - velocity', 'choice_text_arabic': 'القدرة = القوة - السرعة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A car engine produces 100 kW of power while driving at 25 m/s. What force does it exert?',
                            'question_text_arabic': 'محرك سيارة ينتج قدرة 100 كيلوواط أثناء القيادة بسرعة 25 م/ث. ما القوة التي يبذلها؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '4000 N', 'choice_text_arabic': '4000 نيوتن', 'is_correct': True},
                                {'choice_text': '2500 N', 'choice_text_arabic': '2500 نيوتن', 'is_correct': False},
                                {'choice_text': '125 N', 'choice_text_arabic': '125 نيوتن', 'is_correct': False},
                                {'choice_text': '100,000 N', 'choice_text_arabic': '100,000 نيوتن', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Why do cars need more power at higher speeds?',
                            'question_text_arabic': 'لماذا تحتاج السيارات قدرة أكثر عند السرعات الأعلى؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Air resistance increases with speed squared', 'choice_text_arabic': 'مقاومة الهواء تزداد مع مربع السرعة', 'is_correct': True},
                                {'choice_text': 'Engine efficiency decreases', 'choice_text_arabic': 'كفاءة المحرك تقل', 'is_correct': False},
                                {'choice_text': 'Wheels need more force', 'choice_text_arabic': 'العجلات تحتاج قوة أكثر', 'is_correct': False},
                                {'choice_text': 'Gravity increases', 'choice_text_arabic': 'الجاذبية تزداد', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What factors affect the power requirements of moving objects?',
                            'question_text_arabic': 'ما العوامل التي تؤثر على متطلبات القدرة للأجسام المتحركة؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Speed of motion', 'choice_text_arabic': 'سرعة الحركة', 'is_correct': True},
                                {'choice_text': 'Resistance forces', 'choice_text_arabic': 'قوى المقاومة', 'is_correct': True},
                                {'choice_text': 'Mass of object', 'choice_text_arabic': 'كتلة الجسم', 'is_correct': True},
                                {'choice_text': 'Color of object', 'choice_text_arabic': 'لون الجسم', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'An elevator motor rated at 20 kW can lift how much mass at 2 m/s constant speed? (g = 10 m/s²)',
                            'question_text_arabic': 'محرك مصعد بقدرة 20 كيلوواط يمكنه رفع كم كتلة بسرعة ثابتة 2 م/ث؟ (g = 10 م/ث²)',
                            'question_type': 'open_short',
                            'correct_answer': '1000 kg'
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
                    f'Successfully created for Lesson 129 (Mechanical work and energy):\\n'
                    f'Exercises: {total_exercises}\\n'
                    f'Questions: {total_questions}\\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 129 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )