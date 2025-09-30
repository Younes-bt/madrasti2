from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Work and gravitational potential energy – Mechanical energy - Lesson ID: 126'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=126)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Gravitational Potential Energy',
                    'title_arabic': 'طاقة الوضع الجاذبية',
                    'description': 'Understanding gravitational potential energy and its relationship with height and mass',
                    'description_arabic': 'فهم طاقة الوضع الجاذبية وعلاقتها بالارتفاع والكتلة',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is gravitational potential energy?',
                            'question_text_arabic': 'ما هي طاقة الوضع الجاذبية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Energy stored in an object due to its position in a gravitational field', 'choice_text_arabic': 'الطاقة المخزونة في الجسم بسبب موضعه في المجال الجاذبي', 'is_correct': True},
                                {'choice_text': 'Energy due to motion of an object', 'choice_text_arabic': 'الطاقة بسبب حركة الجسم', 'is_correct': False},
                                {'choice_text': 'Energy stored in chemical bonds', 'choice_text_arabic': 'الطاقة المخزونة في الروابط الكيميائية', 'is_correct': False},
                                {'choice_text': 'Energy due to temperature', 'choice_text_arabic': 'الطاقة بسبب درجة الحرارة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the formula for gravitational potential energy near Earth\'s surface?',
                            'question_text_arabic': 'ما صيغة طاقة الوضع الجاذبية بالقرب من سطح الأرض؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'PE = mgh', 'choice_text_arabic': 'PE = mgh', 'is_correct': True},
                                {'choice_text': 'PE = ½mv²', 'choice_text_arabic': 'PE = ½mv²', 'is_correct': False},
                                {'choice_text': 'PE = mg', 'choice_text_arabic': 'PE = mg', 'is_correct': False},
                                {'choice_text': 'PE = mgh²', 'choice_text_arabic': 'PE = mgh²', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How does gravitational potential energy change with height?',
                            'question_text_arabic': 'كيف تتغير طاقة الوضع الجاذبية مع الارتفاع؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'It increases linearly with height', 'choice_text_arabic': 'تزداد خطياً مع الارتفاع', 'is_correct': True},
                                {'choice_text': 'It decreases with height', 'choice_text_arabic': 'تقل مع الارتفاع', 'is_correct': False},
                                {'choice_text': 'It increases quadratically with height', 'choice_text_arabic': 'تزداد تربيعياً مع الارتفاع', 'is_correct': False},
                                {'choice_text': 'It remains constant', 'choice_text_arabic': 'تبقى ثابتة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A 10 kg object is lifted to a height of 5 m. What is its gravitational potential energy? (g = 10 m/s²)',
                            'question_text_arabic': 'جسم كتلته 10 كيلوجرام يُرفع لارتفاع 5 أمتار. ما طاقة وضعه الجاذبية؟ (g = 10 م/ث²)',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '500 J', 'choice_text_arabic': '500 جول', 'is_correct': True},
                                {'choice_text': '50 J', 'choice_text_arabic': '50 جول', 'is_correct': False},
                                {'choice_text': '250 J', 'choice_text_arabic': '250 جول', 'is_correct': False},
                                {'choice_text': '1000 J', 'choice_text_arabic': '1000 جول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Gravitational potential energy is always positive.',
                            'question_text_arabic': 'طاقة الوضع الجاذبية دائماً موجبة.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        }
                    ]
                },
                {
                    'title': 'Conservation of Mechanical Energy',
                    'title_arabic': 'حفظ الطاقة الميكانيكية',
                    'description': 'Understanding the principle of conservation of mechanical energy in isolated systems',
                    'description_arabic': 'فهم مبدأ حفظ الطاقة الميكانيكية في الأنظمة المعزولة',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is mechanical energy?',
                            'question_text_arabic': 'ما هي الطاقة الميكانيكية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The sum of kinetic and potential energy', 'choice_text_arabic': 'مجموع الطاقة الحركية وطاقة الوضع', 'is_correct': True},
                                {'choice_text': 'Only kinetic energy', 'choice_text_arabic': 'الطاقة الحركية فقط', 'is_correct': False},
                                {'choice_text': 'Only potential energy', 'choice_text_arabic': 'طاقة الوضع فقط', 'is_correct': False},
                                {'choice_text': 'Energy due to friction', 'choice_text_arabic': 'الطاقة بسبب الاحتكاك', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'When is mechanical energy conserved?',
                            'question_text_arabic': 'متى تُحفظ الطاقة الميكانيكية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'When only conservative forces do work', 'choice_text_arabic': 'عندما تبذل القوى المحافظة فقط شغلاً', 'is_correct': True},
                                {'choice_text': 'When friction is present', 'choice_text_arabic': 'عند وجود الاحتكاك', 'is_correct': False},
                                {'choice_text': 'Always in any system', 'choice_text_arabic': 'دائماً في أي نظام', 'is_correct': False},
                                {'choice_text': 'Only in horizontal motion', 'choice_text_arabic': 'في الحركة الأفقية فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A ball is thrown upward. At what point is its kinetic energy maximum?',
                            'question_text_arabic': 'كرة تُرمى إلى أعلى. في أي نقطة تكون طاقتها الحركية أقصى ما يمكن؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'At the point of release (bottom)', 'choice_text_arabic': 'عند نقطة الإطلاق (الأسفل)', 'is_correct': True},
                                {'choice_text': 'At the highest point', 'choice_text_arabic': 'عند أعلى نقطة', 'is_correct': False},
                                {'choice_text': 'Halfway up', 'choice_text_arabic': 'في منتصف المسار', 'is_correct': False},
                                {'choice_text': 'It remains constant', 'choice_text_arabic': 'تبقى ثابتة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are conservative forces?',
                            'question_text_arabic': 'ما هي القوى المحافظة؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Gravitational force', 'choice_text_arabic': 'قوة الجاذبية', 'is_correct': True},
                                {'choice_text': 'Elastic force (spring force)', 'choice_text_arabic': 'القوة المرنة (قوة النابض)', 'is_correct': True},
                                {'choice_text': 'Electrostatic force', 'choice_text_arabic': 'القوة الكهروستاتيكية', 'is_correct': True},
                                {'choice_text': 'Friction force', 'choice_text_arabic': 'قوة الاحتكاك', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A 2 kg object falls from a height of 10 m. What is its speed just before hitting the ground? (g = 10 m/s²)',
                            'question_text_arabic': 'جسم كتلته 2 كيلوجرام يسقط من ارتفاع 10 أمتار. ما سرعته قبل اصطدامه بالأرض مباشرة؟ (g = 10 م/ث²)',
                            'question_type': 'open_short',
                            'correct_answer': '14.1 m/s or √200 m/s'
                        }
                    ]
                },
                {
                    'title': 'Work and Potential Energy',
                    'title_arabic': 'الشغل وطاقة الوضع',
                    'description': 'Relationship between work done against conservative forces and potential energy',
                    'description_arabic': 'العلاقة بين الشغل المبذول ضد القوى المحافظة وطاقة الوضع',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the relationship between work and potential energy?',
                            'question_text_arabic': 'ما العلاقة بين الشغل وطاقة الوضع؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Work done against a conservative force equals the increase in potential energy', 'choice_text_arabic': 'الشغل المبذول ضد قوة محافظة يساوي الزيادة في طاقة الوضع', 'is_correct': True},
                                {'choice_text': 'Work always decreases potential energy', 'choice_text_arabic': 'الشغل يقلل دائماً من طاقة الوضع', 'is_correct': False},
                                {'choice_text': 'Work and potential energy are unrelated', 'choice_text_arabic': 'الشغل وطاقة الوضع غير مترابطين', 'is_correct': False},
                                {'choice_text': 'Potential energy is always greater than work', 'choice_text_arabic': 'طاقة الوضع دائماً أكبر من الشغل', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'When you lift an object slowly at constant velocity, what happens to the work you do?',
                            'question_text_arabic': 'عندما ترفع جسماً ببطء بسرعة ثابتة، ماذا يحدث للشغل الذي تبذله؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'It is stored as gravitational potential energy', 'choice_text_arabic': 'يُخزن كطاقة وضع جاذبية', 'is_correct': True},
                                {'choice_text': 'It is converted to kinetic energy', 'choice_text_arabic': 'يتحول إلى طاقة حركية', 'is_correct': False},
                                {'choice_text': 'It is lost as heat', 'choice_text_arabic': 'يُفقد كحرارة', 'is_correct': False},
                                {'choice_text': 'It disappears', 'choice_text_arabic': 'يختفي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How much work is required to lift a 5 kg object from ground level to a height of 8 m? (g = 10 m/s²)',
                            'question_text_arabic': 'كم الشغل المطلوب لرفع جسم كتلته 5 كيلوجرام من مستوى الأرض إلى ارتفاع 8 أمتار؟ (g = 10 م/ث²)',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '400 J', 'choice_text_arabic': '400 جول', 'is_correct': True},
                                {'choice_text': '40 J', 'choice_text_arabic': '40 جول', 'is_correct': False},
                                {'choice_text': '200 J', 'choice_text_arabic': '200 جول', 'is_correct': False},
                                {'choice_text': '800 J', 'choice_text_arabic': '800 جول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'If gravity does positive work on an object, what happens to its potential energy?',
                            'question_text_arabic': 'إذا بذلت الجاذبية شغلاً موجباً على جسم، ماذا يحدث لطاقة وضعه؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'It decreases', 'choice_text_arabic': 'تقل', 'is_correct': True},
                                {'choice_text': 'It increases', 'choice_text_arabic': 'تزداد', 'is_correct': False},
                                {'choice_text': 'It remains constant', 'choice_text_arabic': 'تبقى ثابتة', 'is_correct': False},
                                {'choice_text': 'It becomes zero', 'choice_text_arabic': 'تصبح صفراً', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The work done by a conservative force is path-independent.',
                            'question_text_arabic': 'الشغل المبذول بواسطة قوة محافظة مستقل عن المسار.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Energy Transformations in Systems',
                    'title_arabic': 'تحولات الطاقة في الأنظمة',
                    'description': 'Analyzing energy transformations in various mechanical systems',
                    'description_arabic': 'تحليل تحولات الطاقة في الأنظمة الميكانيكية المختلفة',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'In a pendulum, when is the potential energy maximum?',
                            'question_text_arabic': 'في البندول، متى تكون طاقة الوضع أقصى ما يمكن؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'At the extreme positions (highest points)', 'choice_text_arabic': 'عند المواضع الطرفية (أعلى النقاط)', 'is_correct': True},
                                {'choice_text': 'At the lowest point', 'choice_text_arabic': 'عند أدنى نقطة', 'is_correct': False},
                                {'choice_text': 'Halfway through the swing', 'choice_text_arabic': 'في منتصف الأرجحة', 'is_correct': False},
                                {'choice_text': 'It remains constant throughout', 'choice_text_arabic': 'تبقى ثابتة طوال الوقت', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A roller coaster car starts from rest at the top of a 50 m hill. Ignoring friction, what is its speed at the bottom? (g = 10 m/s²)',
                            'question_text_arabic': 'عربة أفعوانية تبدأ من السكون في قمة تل ارتفاعه 50 متراً. بتجاهل الاحتكاك، ما سرعتها في الأسفل؟ (g = 10 م/ث²)',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '31.6 m/s', 'choice_text_arabic': '31.6 م/ث', 'is_correct': True},
                                {'choice_text': '25 m/s', 'choice_text_arabic': '25 م/ث', 'is_correct': False},
                                {'choice_text': '50 m/s', 'choice_text_arabic': '50 م/ث', 'is_correct': False},
                                {'choice_text': '22.4 m/s', 'choice_text_arabic': '22.4 م/ث', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What happens to mechanical energy when friction is present?',
                            'question_text_arabic': 'ماذا يحدث للطاقة الميكانيكية عند وجود الاحتكاك؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'It decreases and is converted to thermal energy', 'choice_text_arabic': 'تقل وتتحول إلى طاقة حرارية', 'is_correct': True},
                                {'choice_text': 'It increases', 'choice_text_arabic': 'تزداد', 'is_correct': False},
                                {'choice_text': 'It remains perfectly conserved', 'choice_text_arabic': 'تُحفظ بشكل مثالي', 'is_correct': False},
                                {'choice_text': 'It converts to chemical energy', 'choice_text_arabic': 'تتحول إلى طاقة كيميائية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In which systems is mechanical energy best conserved?',
                            'question_text_arabic': 'في أي أنظمة تُحفظ الطاقة الميكانيكية بشكل أفضل؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Systems with no friction', 'choice_text_arabic': 'أنظمة بلا احتكاك', 'is_correct': True},
                                {'choice_text': 'Systems in vacuum', 'choice_text_arabic': 'أنظمة في الفراغ', 'is_correct': True},
                                {'choice_text': 'Ideal pendulums', 'choice_text_arabic': 'البندولات المثالية', 'is_correct': True},
                                {'choice_text': 'Systems with air resistance', 'choice_text_arabic': 'أنظمة مع مقاومة الهواء', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A spring is compressed by 0.2 m with a spring constant of 1000 N/m. Calculate the elastic potential energy stored.',
                            'question_text_arabic': 'نابض مضغوط بمقدار 0.2 متر وثابت النابض 1000 نيوتن/متر. احسب طاقة الوضع المرنة المخزونة.',
                            'question_type': 'open_short',
                            'correct_answer': '20 J'
                        }
                    ]
                },
                {
                    'title': 'Real-World Applications and Problem Solving',
                    'title_arabic': 'التطبيقات الواقعية وحل المسائل',
                    'description': 'Applying energy concepts to solve complex real-world problems',
                    'description_arabic': 'تطبيق مفاهيم الطاقة لحل المسائل الواقعية المعقدة',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'A hydroelectric dam converts _______ energy to _______ energy.',
                            'question_text_arabic': 'سد الطاقة الكهرومائية يحول طاقة _______ إلى طاقة _______.',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'gravitational potential; electrical', 'choice_text_arabic': 'الوضع الجاذبية؛ كهربائية', 'is_correct': True},
                                {'choice_text': 'kinetic; chemical', 'choice_text_arabic': 'حركية؛ كيميائية', 'is_correct': False},
                                {'choice_text': 'thermal; mechanical', 'choice_text_arabic': 'حرارية؛ ميكانيكية', 'is_correct': False},
                                {'choice_text': 'electrical; gravitational', 'choice_text_arabic': 'كهربائية؛ جاذبية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Why do satellites in orbit not fall to Earth?',
                            'question_text_arabic': 'لماذا لا تسقط الأقمار الصناعية في المدار إلى الأرض؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Their orbital kinetic energy balances gravitational potential energy', 'choice_text_arabic': 'طاقتها الحركية المدارية توازن طاقة الوضع الجاذبية', 'is_correct': True},
                                {'choice_text': 'There is no gravity in space', 'choice_text_arabic': 'لا توجد جاذبية في الفضاء', 'is_correct': False},
                                {'choice_text': 'They are pushed away by solar wind', 'choice_text_arabic': 'يتم دفعها بعيداً بواسطة الرياح الشمسية', 'is_correct': False},
                                {'choice_text': 'They have rocket engines constantly firing', 'choice_text_arabic': 'لديها محركات صاروخية تعمل باستمرار', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A bungee jumper falls 100 m before the cord stops them. If they have 80 kg mass, how much energy was stored in the stretched cord? (g = 10 m/s²)',
                            'question_text_arabic': 'قافز بالحبل المطاطي يسقط 100 متر قبل أن يوقفه الحبل. إذا كانت كتلته 80 كيلوجراماً، كم الطاقة المخزونة في الحبل المشدود؟ (g = 10 م/ث²)',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '80,000 J', 'choice_text_arabic': '80,000 جول', 'is_correct': True},
                                {'choice_text': '8,000 J', 'choice_text_arabic': '8,000 جول', 'is_correct': False},
                                {'choice_text': '800 J', 'choice_text_arabic': '800 جول', 'is_correct': False},
                                {'choice_text': '160,000 J', 'choice_text_arabic': '160,000 جول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In which scenarios would you expect mechanical energy to NOT be conserved?',
                            'question_text_arabic': 'في أي سيناريوهات تتوقع ألا تُحفظ الطاقة الميكانيكية؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'A car braking to a stop', 'choice_text_arabic': 'سيارة تكبح حتى التوقف', 'is_correct': True},
                                {'choice_text': 'A ball bouncing on concrete', 'choice_text_arabic': 'كرة ترتد على الخرسانة', 'is_correct': True},
                                {'choice_text': 'An airplane flying through air', 'choice_text_arabic': 'طائرة تطير عبر الهواء', 'is_correct': True},
                                {'choice_text': 'A satellite orbiting in vacuum', 'choice_text_arabic': 'قمر صناعي يدور في الفراغ', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Energy can neither be created nor destroyed, only transformed from one form to another.',
                            'question_text_arabic': 'الطاقة لا يمكن خلقها أو إفناؤها، بل تتحول فقط من شكل إلى آخر.',
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
                    f'Successfully created for Lesson 126 (Work and gravitational potential energy – Mechanical energy):\\n'
                    f'Exercises: {total_exercises}\\n'
                    f'Questions: {total_questions}\\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 126 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )