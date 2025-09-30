"""
Template Management Command for Creating Lesson Exercises

This template can be copied and adapted for any lesson to create structured exercises
with mixed question types (QCM, open answer, true/false, etc.) and reward configurations.

MULTILINGUAL SUPPORT:
- Currently supports English and Arabic for all text fields
- Questions and choices display in both languages in the UI
- French support can be added by extending the models with *_french fields

USAGE:
1. Copy this file and rename it (e.g., create_math_algebra_exercises.py)
2. Modify the lesson identification logic in get_lesson()
3. Update exercises_data with your lesson-specific content
4. Customize question data in get_exercise_X_questions() methods
5. Provide both English and Arabic text for all questions and choices
6. Run: python manage.py your_command_name --lesson-id X

SUPPORTED QUESTION TYPES:
- qcm_single: Single choice QCM
- qcm_multiple: Multiple choice QCM
- open_short: Short open answer
- open_long: Long open answer
- true_false: True/False questions
- fill_blank: Fill in the blank
- matching: Matching questions
- ordering: Ordering/sequence questions

MULTILINGUAL BEST PRACTICES:
- Always provide meaningful translations, not literal ones
- Consider cultural context in Arabic translations
- Use proper mathematical notation in both languages
- Maintain consistency in technical terminology
- Test both languages in the UI to ensure proper display
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward


class Command(BaseCommand):
    help = 'Template for creating exercises and questions for any lesson'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises for this lesson before creating new ones',
        )
        parser.add_argument(
            '--lesson-id',
            type=int,
            required=True,
            help='Lesson ID to create exercises for',
        )

    def handle(self, *args, **options):
        with transaction.atomic():
            # Find the target lesson
            lesson = self.get_lesson(options['lesson_id'])
            if not lesson:
                return

            if options['delete_existing']:
                self.delete_existing_exercises(lesson)

            # Create exercises for this lesson
            self.create_exercises_and_questions(lesson)

    def get_lesson(self, lesson_id):
        """Find the target lesson by ID"""
        try:
            lesson = Lesson.objects.get(id=lesson_id)
            self.stdout.write(f'Found lesson ID: {lesson_id}')
            return lesson
        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'Lesson with ID {lesson_id} not found.')
            )
            return None
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error finding lesson: {e}'))
            return None

    def delete_existing_exercises(self, lesson):
        """Delete existing exercises for this lesson"""
        existing_count = Exercise.objects.filter(lesson=lesson).count()
        Exercise.objects.filter(lesson=lesson).delete()
        self.stdout.write(
            self.style.WARNING(f'Deleted {existing_count} existing exercises for lesson ID: {lesson.id}')
        )

    def create_exercises_and_questions(self, lesson):
        """
        Create exercises and questions for the lesson

        CUSTOMIZE THIS SECTION for your specific lesson:
        - Update exercise titles and descriptions
        - Modify difficulty levels and durations
        - Adjust total points based on question complexity
        """
        exercises_data = [
            {
                'title': 'Exercise Set 1 - Basic Concepts',
                'title_arabic': 'مجموعة التمارين 1 - المفاهيم الأساسية',
                'description': 'Fundamental questions and basic understanding',
                'difficulty': 'beginner',
                'estimated_duration': 20,
                'total_points': 10.0,
                'questions': self.get_exercise_1_questions()
            },
            {
                'title': 'Exercise Set 2 - Applied Problems',
                'title_arabic': 'مجموعة التمارين 2 - المسائل التطبيقية',
                'description': 'Applied problems and calculations',
                'difficulty': 'intermediate',
                'estimated_duration': 35,
                'total_points': 15.0,
                'questions': self.get_exercise_2_questions()
            },
            {
                'title': 'Exercise Set 3 - Advanced Concepts',
                'title_arabic': 'مجموعة التمارين 3 - المفاهيم المتقدمة',
                'description': 'Complex problems and synthesis',
                'difficulty': 'advanced',
                'estimated_duration': 50,
                'total_points': 20.0,
                'questions': self.get_exercise_3_questions()
            }
        ]

        created_exercises = 0
        total_questions = 0

        for i, exercise_data in enumerate(exercises_data, 1):
            # Create exercise
            exercise = Exercise.objects.create(
                lesson=lesson,
                created_by_id=1,  # Assuming admin user ID 1 exists
                title=exercise_data['title'],
                title_arabic=exercise_data['title_arabic'],
                description=exercise_data['description'],
                exercise_format='mixed',
                difficulty_level=exercise_data['difficulty'],
                order=i,
                estimated_duration=exercise_data['estimated_duration'],
                total_points=exercise_data['total_points'],
                auto_grade=True,
                show_results_immediately=True,
                allow_multiple_attempts=True,
                max_attempts=3,
                is_active=True,
                is_published=True
            )

            # Create questions for this exercise
            question_count = self.create_questions_for_exercise(exercise, exercise_data['questions'])
            total_questions += question_count

            # Create reward configuration
            self.create_exercise_rewards(exercise, exercise_data['difficulty'])

            created_exercises += 1
            self.stdout.write(f'Created exercise with {question_count} questions (ID: {exercise.id})')

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_exercises} exercises with {total_questions} total questions for lesson ID: {lesson.id}'
            )
        )

    def create_questions_for_exercise(self, exercise, questions_data):
        """Create questions for a specific exercise"""
        question_count = 0

        for i, question_data in enumerate(questions_data, 1):
            question = Question.objects.create(
                exercise=exercise,
                question_type=question_data['type'],
                question_text=question_data['text'],
                question_text_arabic=question_data.get('text_arabic', ''),
                explanation=question_data.get('explanation', ''),
                explanation_arabic=question_data.get('explanation_arabic', ''),
                points=question_data['points'],
                order=i,
                is_required=True
            )

            # Create choices for QCM questions
            if question_data['type'] in ['qcm_single', 'qcm_multiple', 'true_false']:
                for j, choice_data in enumerate(question_data.get('choices', []), 1):
                    QuestionChoice.objects.create(
                        question=question,
                        choice_text=choice_data['text'],
                        choice_text_arabic=choice_data.get('text_arabic', ''),
                        is_correct=choice_data['is_correct'],
                        order=j
                    )

            question_count += 1

        return question_count

    def create_exercise_rewards(self, exercise, difficulty):
        """Create reward configuration for exercise based on difficulty"""
        difficulty_rewards = {
            'beginner': {
                'attempt_points': 2,
                'completion_points': 5,
                'completion_coins': 1,
                'perfect_score_bonus': 8,
                'high_score_bonus': 4,
                'difficulty_multiplier': 1.0,
                'base_xp': 5
            },
            'intermediate': {
                'attempt_points': 3,
                'completion_points': 8,
                'completion_coins': 2,
                'perfect_score_bonus': 12,
                'high_score_bonus': 6,
                'difficulty_multiplier': 1.2,
                'base_xp': 8
            },
            'advanced': {
                'attempt_points': 4,
                'completion_points': 12,
                'completion_coins': 3,
                'perfect_score_bonus': 18,
                'high_score_bonus': 9,
                'difficulty_multiplier': 1.5,
                'base_xp': 12
            }
        }

        rewards = difficulty_rewards.get(difficulty, difficulty_rewards['intermediate'])

        ExerciseReward.objects.create(
            exercise=exercise,
            attempt_points=rewards['attempt_points'],
            completion_points=rewards['completion_points'],
            completion_coins=rewards['completion_coins'],
            perfect_score_bonus=rewards['perfect_score_bonus'],
            high_score_bonus=rewards['high_score_bonus'],
            improvement_bonus=3,
            daily_streak_bonus=2,
            lesson_completion_bonus=15,
            difficulty_multiplier=rewards['difficulty_multiplier'],
            first_attempt_multiplier=1.5,
            base_xp=rewards['base_xp'],
            bonus_xp=rewards['base_xp'] * 2
        )

    # =====================================================================
    # CUSTOMIZE THESE METHODS FOR YOUR SPECIFIC LESSON CONTENT
    # =====================================================================

    def get_exercise_1_questions(self):
        """
        BEGINNER LEVEL QUESTIONS - MULTILINGUAL EXAMPLES

        Replace this content with your lesson-specific questions.
        All text should be provided in both English and Arabic for full multilingual support.
        """
        return [
            # Example QCM Single Choice - Multilingual
            {
                'type': 'qcm_single',
                'text': 'What is the fundamental unit used to measure energy in physics?',
                'text_arabic': 'ما هي الوحدة الأساسية لقياس الطاقة في الفيزياء؟',
                'points': 2.0,
                'choices': [
                    {
                        'text': 'Joule (J)',
                        'text_arabic': 'جول (J)',
                        'is_correct': True
                    },
                    {
                        'text': 'Newton (N)',
                        'text_arabic': 'نيوتن (N)',
                        'is_correct': False
                    },
                    {
                        'text': 'Watt (W)',
                        'text_arabic': 'وات (W)',
                        'is_correct': False
                    },
                    {
                        'text': 'Pascal (Pa)',
                        'text_arabic': 'باسكال (Pa)',
                        'is_correct': False
                    }
                ],
                'explanation': 'The Joule (J) is the standard SI unit for measuring energy, work, and heat.',
                'explanation_arabic': 'الجول (J) هو الوحدة المعيارية في النظام الدولي لقياس الطاقة والشغل والحرارة.'
            },

            # Example True/False - Multilingual
            {
                'type': 'true_false',
                'text': 'Energy can be created or destroyed according to the law of conservation.',
                'text_arabic': 'يمكن خلق الطاقة أو إفناؤها وفقاً لقانون حفظ الطاقة.',
                'points': 1.5,
                'choices': [
                    {
                        'text': 'True',
                        'text_arabic': 'صحيح',
                        'is_correct': False
                    },
                    {
                        'text': 'False',
                        'text_arabic': 'خطأ',
                        'is_correct': True
                    }
                ],
                'explanation': 'False. According to the law of conservation of energy, energy cannot be created or destroyed, only transformed from one form to another.',
                'explanation_arabic': 'خطأ. وفقاً لقانون حفظ الطاقة، لا يمكن خلق الطاقة أو إفناؤها، بل تتحول فقط من شكل إلى آخر.'
            },

            # Example Short Open Answer - Multilingual
            {
                'type': 'open_short',
                'text': 'Write the mathematical formula that relates work, force, and displacement.',
                'text_arabic': 'اكتب الصيغة الرياضية التي تربط بين الشغل والقوة والإزاحة.',
                'points': 3.0,
                'explanation': 'W = F × d × cos(θ), where W is work, F is force, d is displacement, and θ is the angle between force and displacement vectors.',
                'explanation_arabic': 'W = F × d × cos(θ)، حيث W هو الشغل، F هي القوة، d هي الإزاحة، و θ هي الزاوية بين متجهي القوة والإزاحة.'
            },

            # Example Fill in the Blank - Multilingual
            {
                'type': 'fill_blank',
                'text': 'When force and displacement are perpendicular to each other, the work done is _____.',
                'text_arabic': 'عندما تكون القوة والإزاحة متعامدتان، فإن الشغل المبذول يساوي _____.',
                'points': 2.0,
                'explanation': 'Zero. When force and displacement are perpendicular (θ = 90°), cos(90°) = 0, so W = F × d × 0 = 0.',
                'explanation_arabic': 'صفر. عندما تكون القوة والإزاحة متعامدتان (θ = 90°)، فإن cos(90°) = 0، إذن W = F × d × 0 = 0.'
            }
        ]

    def get_exercise_2_questions(self):
        """
        INTERMEDIATE LEVEL QUESTIONS - MULTILINGUAL EXAMPLES

        More complex questions, calculations, and applications.
        Includes problem-solving and analytical thinking questions.
        """
        return [
            # Example QCM Multiple Choice - Multilingual
            {
                'type': 'qcm_multiple',
                'text': 'Which of the following factors directly affect the amount of work done by a force? (Select all that apply)',
                'text_arabic': 'أي من العوامل التالية تؤثر مباشرة على مقدار الشغل المبذول من طرف قوة؟ (اختر جميع الإجابات الصحيحة)',
                'points': 4.0,
                'choices': [
                    {
                        'text': 'Magnitude of the applied force',
                        'text_arabic': 'مقدار القوة المطبقة',
                        'is_correct': True
                    },
                    {
                        'text': 'Distance through which force is applied',
                        'text_arabic': 'المسافة التي تطبق خلالها القوة',
                        'is_correct': True
                    },
                    {
                        'text': 'Mass of the object being moved',
                        'text_arabic': 'كتلة الجسم المتحرك',
                        'is_correct': False
                    },
                    {
                        'text': 'Angle between force and displacement vectors',
                        'text_arabic': 'الزاوية بين متجهي القوة والإزاحة',
                        'is_correct': True
                    }
                ],
                'explanation': 'Work depends on force magnitude, displacement distance, and the cosine of the angle between them. Mass affects the required force but not the work calculation directly.',
                'explanation_arabic': 'الشغل يعتمد على مقدار القوة، مسافة الإزاحة، وجيب تمام الزاوية بينهما. الكتلة تؤثر على القوة المطلوبة لكن ليس على حساب الشغل مباشرة.'
            },

            # Example Problem Solving - Multilingual
            {
                'type': 'open_long',
                'text': 'A worker applies a horizontal force of 120 N to push a crate 8 meters across a floor. If the force of friction is 30 N, calculate: a) Work done by the applied force, b) Work done by friction, c) Net work done on the crate.',
                'text_arabic': 'يطبق عامل قوة أفقية مقدارها 120 نيوتن لدفع صندوق مسافة 8 أمتار عبر أرضية. إذا كانت قوة الاحتكاك 30 نيوتن، احسب: أ) الشغل المبذول من طرف القوة المطبقة، ب) الشغل المبذول من طرف الاحتكاك، ج) الشغل الصافي المبذول على الصندوق.',
                'points': 6.0,
                'explanation': 'a) W_applied = F × d = 120 N × 8 m = 960 J, b) W_friction = -30 N × 8 m = -240 J (negative because friction opposes motion), c) W_net = 960 J + (-240 J) = 720 J',
                'explanation_arabic': 'أ) W_applied = F × d = 120 نيوتن × 8 م = 960 جول، ب) W_friction = -30 نيوتن × 8 م = -240 جول (سالب لأن الاحتكاك يعارض الحركة)، ج) W_net = 960 جول + (-240 جول) = 720 جول'
            },

            # Example Conceptual Understanding - Multilingual
            {
                'type': 'open_short',
                'text': 'Explain why no work is done when you hold a heavy object stationary above your head, despite exerting force.',
                'text_arabic': 'اشرح لماذا لا يبذل شغل عندما تحمل جسماً ثقيلاً ساكناً فوق رأسك، رغم بذل قوة.',
                'points': 3.5,
                'explanation': 'No work is done because there is no displacement. Work requires both force and displacement in the direction of force. When holding an object stationary, displacement = 0, so W = F × 0 = 0.',
                'explanation_arabic': 'لا يبذل شغل لأنه لا توجد إزاحة. الشغل يتطلب كلاً من القوة والإزاحة في اتجاه القوة. عند حمل جسم ساكن، الإزاحة = 0، إذن W = F × 0 = 0.'
            },

            # Example Unit Conversion - Multilingual
            {
                'type': 'qcm_single',
                'text': 'A machine performs 2.5 kJ of work in 10 seconds. What is its power output in watts?',
                'text_arabic': 'تنجز آلة شغلاً مقداره 2.5 كيلوجول في 10 ثوان. ما هي قدرتها الناتجة بالوات؟',
                'points': 3.0,
                'choices': [
                    {
                        'text': '250 W',
                        'text_arabic': '250 وات',
                        'is_correct': True
                    },
                    {
                        'text': '25 W',
                        'text_arabic': '25 وات',
                        'is_correct': False
                    },
                    {
                        'text': '2500 W',
                        'text_arabic': '2500 وات',
                        'is_correct': False
                    },
                    {
                        'text': '0.25 W',
                        'text_arabic': '0.25 وات',
                        'is_correct': False
                    }
                ],
                'explanation': 'Power = Work / Time = 2500 J / 10 s = 250 W. Remember to convert kJ to J first.',
                'explanation_arabic': 'القدرة = الشغل / الزمن = 2500 جول / 10 ثانية = 250 وات. تذكر تحويل الكيلوجول إلى جول أولاً.'
            }
        ]

    def get_exercise_3_questions(self):
        """
        ADVANCED LEVEL QUESTIONS - MULTILINGUAL EXAMPLES

        Complex analysis, synthesis, and advanced problem solving.
        Requires deep understanding and application of multiple concepts.
        """
        return [
            # Example Complex Multi-Step Problem - Multilingual
            {
                'type': 'open_long',
                'text': 'A 1200 kg car accelerates from rest to 25 m/s while traveling 200 m up a hill inclined at 15° to the horizontal. The engine provides a constant force of 8000 N parallel to the road surface, while friction and air resistance total 1500 N. Calculate: a) The work done by the engine, b) The work done against gravity, c) The work done against friction, d) The kinetic energy gained by the car, e) Verify your answer using the work-energy theorem.',
                'text_arabic': 'سيارة كتلتها 1200 كغ تتسارع من السكون إلى 25 م/ث بينما تقطع 200 م صاعدة تلة مائلة 15° عن الأفقي. يولد المحرك قوة ثابتة 8000 نيوتن موازية لسطح الطريق، بينما يبلغ مجموع الاحتكاك ومقاومة الهواء 1500 نيوتن. احسب: أ) الشغل المبذول من طرف المحرك، ب) الشغل المبذول ضد الجاذبية، ج) الشغل المبذول ضد الاحتكاك، د) الطاقة الحركية المكتسبة للسيارة، هـ) تحقق من إجابتك باستخدام نظرية الشغل-الطاقة.',
                'points': 10.0,
                'explanation': 'a) W_engine = 8000 N × 200 m = 1,600,000 J, b) W_gravity = -mgh = -1200 × 9.8 × 200 × sin(15°) = -608,472 J, c) W_friction = -1500 N × 200 m = -300,000 J, d) KE = ½mv² = ½ × 1200 × 25² = 375,000 J, e) Net work = 1,600,000 - 608,472 - 300,000 = 691,528 J ≠ 375,000 J (check calculations or given values)',
                'explanation_arabic': 'أ) W_engine = 8000 نيوتن × 200 م = 1,600,000 جول، ب) W_gravity = -mgh = -1200 × 9.8 × 200 × sin(15°) = -608,472 جول، ج) W_friction = -1500 نيوتن × 200 م = -300,000 جول، د) KE = ½mv² = ½ × 1200 × 25² = 375,000 جول، هـ) الشغل الصافي = 1,600,000 - 608,472 - 300,000 = 691,528 جول ≠ 375,000 جول (راجع الحسابات أو القيم المعطاة)'
            },

            # Example Energy Efficiency Analysis - Multilingual
            {
                'type': 'open_long',
                'text': 'A hydroelectric power plant converts the gravitational potential energy of water falling through a height of 100 m into electrical energy. If 1000 m³ of water passes through the turbines per second, and the overall efficiency of the plant is 85%, calculate: a) The theoretical maximum power output, b) The actual electrical power generated, c) The power lost to inefficiencies.',
                'text_arabic': 'محطة طاقة كهرومائية تحول طاقة الوضع الثقالية للماء الساقط من ارتفاع 100 م إلى طاقة كهربائية. إذا مر 1000 م³ من الماء عبر التوربينات في الثانية، وكان المردود الإجمالي للمحطة 85%، احسب: أ) أقصى قدرة نظرية، ب) القدرة الكهربائية الفعلية المولدة، ج) القدرة المفقودة بسبب عدم الكفاءة.',
                'points': 8.0,
                'explanation': 'a) P_max = ρVgh/t = 1000 kg/m³ × 1000 m³/s × 9.8 m/s² × 100 m = 980 MW, b) P_actual = 0.85 × 980 MW = 833 MW, c) P_lost = 980 MW - 833 MW = 147 MW',
                'explanation_arabic': 'أ) P_max = ρVgh/t = 1000 كغ/م³ × 1000 م³/ث × 9.8 م/ث² × 100 م = 980 ميغاوات، ب) P_actual = 0.85 × 980 ميغاوات = 833 ميغاوات، ج) P_lost = 980 ميغاوات - 833 ميغاوات = 147 ميغاوات'
            },

            # Example Conceptual Analysis - Multilingual
            {
                'type': 'open_long',
                'text': 'Compare and contrast the concepts of work and power in physics. Discuss their relationship, units, and provide real-world examples where high work is done with low power, and where high power is achieved with relatively little work.',
                'text_arabic': 'قارن بين مفهومي الشغل والقدرة في الفيزياء. ناقش العلاقة بينهما، وحداتهما، وقدم أمثلة من الواقع حيث يبذل شغل كبير بقدرة منخفضة، وحيث تتحقق قدرة عالية بشغل قليل نسبياً.',
                'points': 7.0,
                'explanation': 'Work is energy transferred (J), power is rate of energy transfer (W = J/s). High work/low power: building construction over months. High power/low work: camera flash (brief, intense). Power = Work/Time, so same work can be high or low power depending on time taken.',
                'explanation_arabic': 'الشغل هو طاقة منقولة (جول)، القدرة هي معدل نقل الطاقة (وات = جول/ثانية). شغل عالي/قدرة منخفضة: بناء عمارة عبر شهور. قدرة عالية/شغل قليل: فلاش الكاميرا (قصير، مكثف). القدرة = الشغل/الزمن، فنفس الشغل يمكن أن يكون قدرة عالية أو منخفضة حسب الزمن المستغرق.'
            },

            # Example Advanced Application - Multilingual
            {
                'type': 'qcm_single',
                'text': 'A satellite in Earth orbit maintains constant speed in a circular path. Which statement about the work done by gravitational force is correct?',
                'text_arabic': 'قمر صناعي في مدار الأرض يحافظ على سرعة ثابتة في مسار دائري. أي عبارة عن الشغل المبذول من طرف قوة الجاذبية صحيحة؟',
                'points': 4.0,
                'choices': [
                    {
                        'text': 'Positive work is done because gravity acts on the satellite',
                        'text_arabic': 'يبذل شغل موجب لأن الجاذبية تؤثر على القمر',
                        'is_correct': False
                    },
                    {
                        'text': 'Negative work is done because gravity opposes motion',
                        'text_arabic': 'يبذل شغل سالب لأن الجاذبية تعارض الحركة',
                        'is_correct': False
                    },
                    {
                        'text': 'Zero work is done because force is perpendicular to velocity',
                        'text_arabic': 'لا يبذل شغل لأن القوة عمودية على السرعة',
                        'is_correct': True
                    },
                    {
                        'text': 'Work varies depending on orbital altitude',
                        'text_arabic': 'الشغل يتغير حسب ارتفاع المدار',
                        'is_correct': False
                    }
                ],
                'explanation': 'In circular orbital motion, gravitational force is always perpendicular to the velocity vector (centripetal force). Since W = F·d·cos(90°) = 0, no work is done by gravity.',
                'explanation_arabic': 'في الحركة المدارية الدائرية، قوة الجاذبية دائماً عمودية على متجه السرعة (قوة مركزية). بما أن W = F·d·cos(90°) = 0، لا تبذل الجاذبية أي شغل.'
            },

            # Example Order of Magnitude - Multilingual
            {
                'type': 'qcm_single',
                'text': 'A typical household uses 10,000 kWh of electrical energy per year. What is the approximate average power consumption?',
                'text_arabic': 'يستهلك منزل نموذجي 10,000 كيلووات·ساعة من الطاقة الكهربائية سنوياً. ما هو متوسط استهلاك القدرة التقريبي؟',
                'points': 3.5,
                'choices': [
                    {
                        'text': '1.1 kW',
                        'text_arabic': '1.1 كيلووات',
                        'is_correct': True
                    },
                    {
                        'text': '10 kW',
                        'text_arabic': '10 كيلووات',
                        'is_correct': False
                    },
                    {
                        'text': '100 W',
                        'text_arabic': '100 وات',
                        'is_correct': False
                    },
                    {
                        'text': '10 MW',
                        'text_arabic': '10 ميغاوات',
                        'is_correct': False
                    }
                ],
                'explanation': 'Average power = Total energy / Total time = 10,000 kWh / (365 × 24 h) = 10,000 / 8760 ≈ 1.14 kW',
                'explanation_arabic': 'متوسط القدرة = مجموع الطاقة / مجموع الوقت = 10,000 كيلووات·ساعة / (365 × 24 ساعة) = 10,000 / 8760 ≈ 1.14 كيلووات'
            }
        ]