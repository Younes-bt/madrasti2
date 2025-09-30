from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Work and kinetic energy - Lesson ID: 125'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=125)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Work Done by Forces',
                    'title_arabic': 'الشغل المبذول بواسطة القوى',
                    'description': 'Understanding the concept of work and calculating work done by constant and variable forces',
                    'description_arabic': 'فهم مفهوم الشغل وحساب الشغل المبذول بواسطة القوى الثابتة والمتغيرة',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is the definition of work in physics?',
                            'question_text_arabic': 'ما تعريف الشغل في الفيزياء؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Work = Force × displacement × cos(θ)', 'choice_text_arabic': 'الشغل = القوة × الإزاحة × cos(θ)', 'is_correct': True},
                                {'choice_text': 'Work = Force × time', 'choice_text_arabic': 'الشغل = القوة × الزمن', 'is_correct': False},
                                {'choice_text': 'Work = mass × acceleration', 'choice_text_arabic': 'الشغل = الكتلة × التسارع', 'is_correct': False},
                                {'choice_text': 'Work = Force × velocity', 'choice_text_arabic': 'الشغل = القوة × السرعة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the SI unit of work?',
                            'question_text_arabic': 'ما وحدة الشغل في النظام الدولي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Joule (J)', 'choice_text_arabic': 'جول (J)', 'is_correct': True},
                                {'choice_text': 'Newton (N)', 'choice_text_arabic': 'نيوتن (N)', 'is_correct': False},
                                {'choice_text': 'Watt (W)', 'choice_text_arabic': 'واط (W)', 'is_correct': False},
                                {'choice_text': 'Pascal (Pa)', 'choice_text_arabic': 'باسكال (Pa)', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'When is the work done by a force zero?',
                            'question_text_arabic': 'متى يكون الشغل المبذول بواسطة قوة مساوياً للصفر؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'When the force is perpendicular to displacement', 'choice_text_arabic': 'عندما تكون القوة عمودية على الإزاحة', 'is_correct': True},
                                {'choice_text': 'When there is no displacement', 'choice_text_arabic': 'عندما لا توجد إزاحة', 'is_correct': True},
                                {'choice_text': 'When the force is zero', 'choice_text_arabic': 'عندما تكون القوة صفراً', 'is_correct': True},
                                {'choice_text': 'When the force is maximum', 'choice_text_arabic': 'عندما تكون القوة في أقصاها', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A force of 10 N acts on an object through a displacement of 5 m at an angle of 60°. Calculate the work done.',
                            'question_text_arabic': 'قوة مقدارها 10 نيوتن تؤثر على جسم عبر إزاحة 5 أمتار بزاوية 60°. احسب الشغل المبذول.',
                            'question_type': 'open_short',
                            'correct_answer': '25 J'
                        },
                        {
                            'question_text': 'Work is a scalar quantity.',
                            'question_text_arabic': 'الشغل كمية قياسية.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Kinetic Energy Fundamentals',
                    'title_arabic': 'أساسيات الطاقة الحركية',
                    'description': 'Understanding kinetic energy, its formula, and relationship with motion',
                    'description_arabic': 'فهم الطاقة الحركية وصيغتها وعلاقتها بالحركة',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is kinetic energy?',
                            'question_text_arabic': 'ما هي الطاقة الحركية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Energy possessed by an object due to its motion', 'choice_text_arabic': 'الطاقة التي يمتلكها الجسم بسبب حركته', 'is_correct': True},
                                {'choice_text': 'Energy stored in an object due to its position', 'choice_text_arabic': 'الطاقة المخزونة في الجسم بسبب موضعه', 'is_correct': False},
                                {'choice_text': 'Energy due to temperature', 'choice_text_arabic': 'الطاقة بسبب درجة الحرارة', 'is_correct': False},
                                {'choice_text': 'Energy in chemical bonds', 'choice_text_arabic': 'الطاقة في الروابط الكيميائية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the formula for kinetic energy?',
                            'question_text_arabic': 'ما صيغة الطاقة الحركية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'KE = ½mv²', 'choice_text_arabic': 'KE = ½mv²', 'is_correct': True},
                                {'choice_text': 'KE = mv²', 'choice_text_arabic': 'KE = mv²', 'is_correct': False},
                                {'choice_text': 'KE = ½m²v', 'choice_text_arabic': 'KE = ½m²v', 'is_correct': False},
                                {'choice_text': 'KE = mgh', 'choice_text_arabic': 'KE = mgh', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How does kinetic energy change when velocity doubles?',
                            'question_text_arabic': 'كيف تتغير الطاقة الحركية عندما تتضاعف السرعة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'It increases by a factor of 4', 'choice_text_arabic': 'تزداد بمعامل 4', 'is_correct': True},
                                {'choice_text': 'It doubles', 'choice_text_arabic': 'تتضاعف', 'is_correct': False},
                                {'choice_text': 'It stays the same', 'choice_text_arabic': 'تبقى كما هي', 'is_correct': False},
                                {'choice_text': 'It increases by a factor of 8', 'choice_text_arabic': 'تزداد بمعامل 8', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A car of mass 1000 kg is moving at 20 m/s. What is its kinetic energy?',
                            'question_text_arabic': 'سيارة كتلتها 1000 كيلوجرام تتحرك بسرعة 20 م/ث. ما طاقتها الحركية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '200,000 J', 'choice_text_arabic': '200,000 جول', 'is_correct': True},
                                {'choice_text': '20,000 J', 'choice_text_arabic': '20,000 جول', 'is_correct': False},
                                {'choice_text': '400,000 J', 'choice_text_arabic': '400,000 جول', 'is_correct': False},
                                {'choice_text': '100,000 J', 'choice_text_arabic': '100,000 جول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Kinetic energy can be negative.',
                            'question_text_arabic': 'يمكن أن تكون الطاقة الحركية سالبة.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        }
                    ]
                },
                {
                    'title': 'Work-Energy Theorem',
                    'title_arabic': 'مبرهنة الشغل-الطاقة',
                    'description': 'Understanding the relationship between work done and change in kinetic energy',
                    'description_arabic': 'فهم العلاقة بين الشغل المبذول والتغير في الطاقة الحركية',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What does the work-energy theorem state?',
                            'question_text_arabic': 'ما الذي تنص عليه مبرهنة الشغل-الطاقة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The net work done on an object equals its change in kinetic energy', 'choice_text_arabic': 'الشغل الصافي المبذول على الجسم يساوي التغير في طاقته الحركية', 'is_correct': True},
                                {'choice_text': 'Work is always equal to kinetic energy', 'choice_text_arabic': 'الشغل يساوي دائماً الطاقة الحركية', 'is_correct': False},
                                {'choice_text': 'Energy cannot be created or destroyed', 'choice_text_arabic': 'الطاقة لا يمكن خلقها أو إفناؤها', 'is_correct': False},
                                {'choice_text': 'Work is independent of kinetic energy', 'choice_text_arabic': 'الشغل مستقل عن الطاقة الحركية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'If positive work is done on an object, what happens to its kinetic energy?',
                            'question_text_arabic': 'إذا بُذل شغل موجب على جسم، ماذا يحدث لطاقته الحركية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'It increases', 'choice_text_arabic': 'تزداد', 'is_correct': True},
                                {'choice_text': 'It decreases', 'choice_text_arabic': 'تقل', 'is_correct': False},
                                {'choice_text': 'It remains constant', 'choice_text_arabic': 'تبقى ثابتة', 'is_correct': False},
                                {'choice_text': 'It becomes zero', 'choice_text_arabic': 'تصبح صفراً', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A 2 kg object accelerates from rest to 10 m/s. How much work was done?',
                            'question_text_arabic': 'جسم كتلته 2 كيلوجرام يتسارع من السكون إلى 10 م/ث. كم الشغل المبذول؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '100 J', 'choice_text_arabic': '100 جول', 'is_correct': True},
                                {'choice_text': '20 J', 'choice_text_arabic': '20 جول', 'is_correct': False},
                                {'choice_text': '200 J', 'choice_text_arabic': '200 جول', 'is_correct': False},
                                {'choice_text': '50 J', 'choice_text_arabic': '50 جول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The work-energy theorem applies to which type of work?',
                            'question_text_arabic': 'مبرهنة الشغل-الطاقة تنطبق على أي نوع من الشغل؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Net work (total work)', 'choice_text_arabic': 'الشغل الصافي (الشغل الكلي)', 'is_correct': True},
                                {'choice_text': 'Work by gravity only', 'choice_text_arabic': 'شغل الجاذبية فقط', 'is_correct': False},
                                {'choice_text': 'Work by friction only', 'choice_text_arabic': 'شغل الاحتكاك فقط', 'is_correct': False},
                                {'choice_text': 'Work by applied forces only', 'choice_text_arabic': 'شغل القوى المطبقة فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'If an object slows down, negative work is being done on it.',
                            'question_text_arabic': 'إذا تباطأ جسم، فإن شغلاً سالباً يُبذل عليه.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Power and Energy Transfer',
                    'title_arabic': 'القدرة ونقل الطاقة',
                    'description': 'Understanding power as the rate of energy transfer and work done per unit time',
                    'description_arabic': 'فهم القدرة كمعدل نقل الطاقة والشغل المبذول لكل وحدة زمن',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is power in physics?',
                            'question_text_arabic': 'ما هي القدرة في الفيزياء؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The rate of doing work or transferring energy', 'choice_text_arabic': 'معدل بذل الشغل أو نقل الطاقة', 'is_correct': True},
                                {'choice_text': 'The total amount of work done', 'choice_text_arabic': 'المقدار الكلي للشغل المبذول', 'is_correct': False},
                                {'choice_text': 'The force applied to an object', 'choice_text_arabic': 'القوة المطبقة على الجسم', 'is_correct': False},
                                {'choice_text': 'The energy stored in an object', 'choice_text_arabic': 'الطاقة المخزونة في الجسم', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the SI unit of power?',
                            'question_text_arabic': 'ما وحدة القدرة في النظام الدولي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Watt (W)', 'choice_text_arabic': 'واط (W)', 'is_correct': True},
                                {'choice_text': 'Joule (J)', 'choice_text_arabic': 'جول (J)', 'is_correct': False},
                                {'choice_text': 'Newton (N)', 'choice_text_arabic': 'نيوتن (N)', 'is_correct': False},
                                {'choice_text': 'Hertz (Hz)', 'choice_text_arabic': 'هرتز (Hz)', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which formula represents power?',
                            'question_text_arabic': 'أي صيغة تمثل القدرة؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'P = W/t', 'choice_text_arabic': 'P = W/t', 'is_correct': True},
                                {'choice_text': 'P = F·v', 'choice_text_arabic': 'P = F·v', 'is_correct': True},
                                {'choice_text': 'P = ΔE/Δt', 'choice_text_arabic': 'P = ΔE/Δt', 'is_correct': True},
                                {'choice_text': 'P = mv²', 'choice_text_arabic': 'P = mv²', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A machine does 1000 J of work in 10 seconds. What is its power output?',
                            'question_text_arabic': 'آلة تبذل 1000 جول من الشغل في 10 ثوانٍ. ما قدرتها الخارجة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '100 W', 'choice_text_arabic': '100 واط', 'is_correct': True},
                                {'choice_text': '1000 W', 'choice_text_arabic': '1000 واط', 'is_correct': False},
                                {'choice_text': '10 W', 'choice_text_arabic': '10 واط', 'is_correct': False},
                                {'choice_text': '10,000 W', 'choice_text_arabic': '10,000 واط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Calculate the power required to lift a 50 kg object 10 m high in 5 seconds (g = 10 m/s²)',
                            'question_text_arabic': 'احسب القدرة المطلوبة لرفع جسم كتلته 50 كيلوجرام لارتفاع 10 أمتار في 5 ثوانٍ (g = 10 م/ث²)',
                            'question_type': 'open_short',
                            'correct_answer': '1000 W'
                        },
                        {
                            'question_text': 'Higher power means work is done faster.',
                            'question_text_arabic': 'القدرة الأعلى تعني أن الشغل يُبذل بشكل أسرع.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Applications and Problem Solving',
                    'title_arabic': 'التطبيقات وحل المسائل',
                    'description': 'Real-world applications of work, kinetic energy, and power concepts',
                    'description_arabic': 'التطبيقات الواقعية لمفاهيم الشغل والطاقة الحركية والقدرة',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'A car engine provides 50 kW of power. How much work does it do in 2 hours?',
                            'question_text_arabic': 'محرك سيارة يوفر قدرة 50 كيلوواط. كم الشغل الذي يبذله في ساعتين؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '360 MJ', 'choice_text_arabic': '360 ميجاجول', 'is_correct': True},
                                {'choice_text': '100 MJ', 'choice_text_arabic': '100 ميجاجول', 'is_correct': False},
                                {'choice_text': '25 MJ', 'choice_text_arabic': '25 ميجاجول', 'is_correct': False},
                                {'choice_text': '180 MJ', 'choice_text_arabic': '180 ميجاجول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Why do brakes get hot when stopping a car?',
                            'question_text_arabic': 'لماذا تسخن المكابح عند إيقاف السيارة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Kinetic energy is converted to thermal energy through friction', 'choice_text_arabic': 'الطاقة الحركية تتحول إلى طاقة حرارية عبر الاحتكاك', 'is_correct': True},
                                {'choice_text': 'The engine generates extra heat', 'choice_text_arabic': 'المحرك ينتج حرارة إضافية', 'is_correct': False},
                                {'choice_text': 'Air resistance causes heating', 'choice_text_arabic': 'مقاومة الهواء تسبب التسخين', 'is_correct': False},
                                {'choice_text': 'Chemical reactions in the brake fluid', 'choice_text_arabic': 'تفاعلات كيميائية في سائل المكابح', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A ball is dropped from height h. Just before hitting the ground, its kinetic energy equals:',
                            'question_text_arabic': 'كرة تُسقط من ارتفاع h. قبل اصطدامها بالأرض مباشرة، طاقتها الحركية تساوي:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'mgh (its initial potential energy)', 'choice_text_arabic': 'mgh (طاقتها الكامنة الأولية)', 'is_correct': True},
                                {'choice_text': '½mgh', 'choice_text_arabic': '½mgh', 'is_correct': False},
                                {'choice_text': '2mgh', 'choice_text_arabic': '2mgh', 'is_correct': False},
                                {'choice_text': 'mg', 'choice_text_arabic': 'mg', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In which situations is kinetic energy NOT conserved?',
                            'question_text_arabic': 'في أي حالات لا تُحفظ الطاقة الحركية؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Inelastic collisions', 'choice_text_arabic': 'التصادمات غير المرنة', 'is_correct': True},
                                {'choice_text': 'When friction is present', 'choice_text_arabic': 'عند وجود الاحتكاك', 'is_correct': True},
                                {'choice_text': 'During energy transformations', 'choice_text_arabic': 'أثناء تحولات الطاقة', 'is_correct': True},
                                {'choice_text': 'In perfectly elastic collisions', 'choice_text_arabic': 'في التصادمات المرنة تماماً', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A roller coaster at the top of a hill has maximum potential energy and minimum kinetic energy.',
                            'question_text_arabic': 'الأفعوانية في قمة التل لها أقصى طاقة كامنة وأقل طاقة حركية.',
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
                    f'Successfully created for Lesson 125 (Work and kinetic energy):\\n'
                    f'Exercises: {total_exercises}\\n'
                    f'Questions: {total_questions}\\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 125 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )