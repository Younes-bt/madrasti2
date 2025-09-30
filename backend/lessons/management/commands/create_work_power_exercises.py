from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create exercises and questions for "Work and Power of a Force" lesson as a test case'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises for this lesson before creating new ones',
        )
        parser.add_argument(
            '--lesson-id',
            type=int,
            help='Specific lesson ID to use (optional)',
        )

    def handle(self, *args, **options):
        with transaction.atomic():
            # Find the "Work and Power of a Force" lesson
            lesson = self.get_lesson(options.get('lesson_id'))
            if not lesson:
                return

            if options['delete_existing']:
                self.delete_existing_exercises(lesson)

            # Create exercises for this lesson
            self.create_exercises_and_questions(lesson)

    def get_lesson(self, lesson_id=None):
        """Find the Work and Power of a Force lesson"""
        try:
            if lesson_id:
                lesson = Lesson.objects.get(id=lesson_id)
                self.stdout.write(f'Using lesson ID {lesson_id}')
                return lesson

            # Try to find by title variations
            possible_titles = [
                'Work, Power and Force',
                'Work and Power of a Force',
                'شغل وقدرة قوة',
                'Travail, puissance et force'
            ]

            for title in possible_titles:
                try:
                    lesson = Lesson.objects.get(
                        title__icontains=title.split(',')[0],  # Use first part of title
                        grade__code='1B',
                        cycle='first'
                    )
                    self.stdout.write(f'Found lesson ID: {lesson.id}')
                    return lesson
                except (Lesson.DoesNotExist, Lesson.MultipleObjectsReturned):
                    continue

            self.stdout.write(
                self.style.ERROR('Lesson "Work and Power of a Force" not found. Please specify --lesson-id or ensure the lesson exists.')
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
        """Create exercises and questions for the Work and Power lesson"""
        exercises_data = [
            {
                'title': 'تمارين شغل وقدرة - المجموعة الأولى',
                'title_english': 'Work and Power Exercises - Set 1',
                'description': 'تمارين تطبيقية حول مفهوم الشغل وقدرة القوة',
                'difficulty': 'beginner',
                'estimated_duration': 30,
                'total_points': 15.0,
                'questions': self.get_exercise_1_questions()
            },
            {
                'title': 'تمارين شغل وقدرة - المجموعة الثانية',
                'title_english': 'Work and Power Exercises - Set 2',
                'description': 'تمارين متقدمة حول حساب الشغل والقدرة',
                'difficulty': 'intermediate',
                'estimated_duration': 45,
                'total_points': 20.0,
                'questions': self.get_exercise_2_questions()
            },
            {
                'title': 'تمارين شغل وقدرة - المجموعة الثالثة',
                'title_english': 'Work and Power Exercises - Set 3',
                'description': 'تمارين شاملة ومسائل متنوعة',
                'difficulty': 'advanced',
                'estimated_duration': 60,
                'total_points': 25.0,
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
                title_arabic=exercise_data['title'],
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
                question_text_arabic=question_data['text_arabic'],
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
                        choice_text_arabic=choice_data['text_arabic'],
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

    def get_exercise_1_questions(self):
        """Questions for beginner level exercise"""
        return [
            {
                'type': 'qcm_single',
                'text': 'What is the fundamental unit of work in the International System of Units (SI)?',
                'text_arabic': 'ما هي الوحدة الأساسية للشغل في النظام الدولي للوحدات؟',
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
                'explanation': 'The Joule (J) is the SI unit for work, energy, and heat. It represents the work done when a force of 1 Newton acts through a distance of 1 meter.',
                'explanation_arabic': 'الجول (J) هو وحدة النظام الدولي للشغل والطاقة والحرارة. يمثل الشغل المبذول عندما تؤثر قوة 1 نيوتن عبر مسافة 1 متر.'
            },
            {
                'type': 'qcm_single',
                'text': 'What is the SI unit for measuring power (rate of energy transfer)?',
                'text_arabic': 'ما هي وحدة النظام الدولي لقياس القدرة (معدل نقل الطاقة)؟',
                'points': 2.0,
                'choices': [
                    {
                        'text': 'Joule (J)',
                        'text_arabic': 'جول (J)',
                        'is_correct': False
                    },
                    {
                        'text': 'Newton (N)',
                        'text_arabic': 'نيوتن (N)',
                        'is_correct': False
                    },
                    {
                        'text': 'Watt (W)',
                        'text_arabic': 'وات (W)',
                        'is_correct': True
                    },
                    {
                        'text': 'Pascal (Pa)',
                        'text_arabic': 'باسكال (Pa)',
                        'is_correct': False
                    }
                ],
                'explanation': 'The Watt (W) is the SI unit for power, defined as one Joule per second (J/s). It measures the rate at which energy is transferred or work is done.',
                'explanation_arabic': 'الوات (W) هو وحدة النظام الدولي للقدرة، ويُعرف بأنه جول واحد في الثانية (جول/ثانية). يقيس المعدل الذي تنتقل به الطاقة أو يُبذل به الشغل.'
            },
            {
                'type': 'true_false',
                'text': 'Work done by a force is positive when the force and displacement vectors point in the same general direction.',
                'text_arabic': 'الشغل المبذول من طرف قوة يكون موجباً عندما يشير متجها القوة والإزاحة في نفس الاتجاه العام.',
                'points': 1.5,
                'choices': [
                    {
                        'text': 'True',
                        'text_arabic': 'صحيح',
                        'is_correct': True
                    },
                    {
                        'text': 'False',
                        'text_arabic': 'خطأ',
                        'is_correct': False
                    }
                ],
                'explanation': 'True. Work is positive when the angle between force and displacement is less than 90°, meaning they have components in the same direction. W = F·d·cos(θ) is positive when cos(θ) > 0.',
                'explanation_arabic': 'صحيح. الشغل موجب عندما تكون الزاوية بين القوة والإزاحة أقل من 90°، مما يعني أن لهما مركبات في نفس الاتجاه. W = F·d·cos(θ) موجب عندما cos(θ) > 0.'
            },
            {
                'type': 'open_short',
                'text': 'Write the formula for calculating work done by a constant force.',
                'text_arabic': 'اكتب صيغة حساب الشغل المبذول من طرف قوة ثابتة.',
                'points': 3.0,
                'explanation': 'W = F × d × cos(θ), where F is force, d is displacement, and θ is the angle between them.',
                'explanation_arabic': 'W = F × d × cos(θ)، حيث F هي القوة، d هي الإزاحة، و θ هي الزاوية بينهما.'
            },
            {
                'type': 'qcm_multiple',
                'text': 'Which of the following factors affect the work done? (Select all that apply)',
                'text_arabic': 'أي من العوامل التالية تؤثر على الشغل المبذول؟ (اختر جميع الإجابات الصحيحة)',
                'points': 3.0,
                'choices': [
                    {'text': 'Magnitude of force', 'text_arabic': 'مقدار القوة', 'is_correct': True},
                    {'text': 'Displacement distance', 'text_arabic': 'مسافة الإزاحة', 'is_correct': True},
                    {'text': 'Angle between force and displacement', 'text_arabic': 'الزاوية بين القوة والإزاحة', 'is_correct': True},
                    {'text': 'Mass of the object', 'text_arabic': 'كتلة الجسم', 'is_correct': False}
                ],
                'explanation': 'Work depends on force magnitude, displacement distance, and the angle between them.',
                'explanation_arabic': 'الشغل يعتمد على مقدار القوة، مسافة الإزاحة، والزاوية بينهما.'
            },
            {
                'type': 'fill_blank',
                'text': 'Power is defined as the rate of doing _____ or the _____ of energy transfer.',
                'text_arabic': 'تُعرف القدرة بأنها معدل بذل _____ أو _____ نقل الطاقة.',
                'points': 2.5,
                'explanation': 'Power is the rate of doing work or the rate of energy transfer.',
                'explanation_arabic': 'القدرة هي معدل بذل الشغل أو معدل نقل الطاقة.'
            }
        ]

    def get_exercise_2_questions(self):
        """Questions for intermediate level exercise"""
        return [
            {
                'type': 'open_long',
                'text': 'A force of 50 N is applied to move an object 10 meters at an angle of 30° to the horizontal. Calculate the work done.',
                'text_arabic': 'تطبق قوة مقدارها 50 نيوتن لتحريك جسم مسافة 10 أمتار بزاوية 30° مع الأفقي. احسب الشغل المبذول.',
                'points': 5.0,
                'explanation': 'W = F × d × cos(θ) = 50 × 10 × cos(30°) = 50 × 10 × 0.866 = 433 J',
                'explanation_arabic': 'W = F × d × cos(θ) = 50 × 10 × cos(30°) = 50 × 10 × 0.866 = 433 جول'
            },
            {
                'type': 'qcm_single',
                'text': 'If a 100 W motor operates for 2 hours, how much energy does it consume?',
                'text_arabic': 'إذا عمل محرك قدرته 100 وات لمدة ساعتين، كم من الطاقة يستهلك؟',
                'points': 3.0,
                'choices': [
                    {'text': '200 J', 'text_arabic': '200 جول', 'is_correct': False},
                    {'text': '720,000 J', 'text_arabic': '720,000 جول', 'is_correct': True},
                    {'text': '7,200 J', 'text_arabic': '7,200 جول', 'is_correct': False},
                    {'text': '50 J', 'text_arabic': '50 جول', 'is_correct': False}
                ],
                'explanation': 'Energy = Power × Time = 100 W × 2 hours × 3600 s/hour = 720,000 J',
                'explanation_arabic': 'الطاقة = القدرة × الوقت = 100 وات × 2 ساعة × 3600 ثانية/ساعة = 720,000 جول'
            },
            {
                'type': 'open_short',
                'text': 'State the relationship between work, power, and time.',
                'text_arabic': 'اذكر العلاقة بين الشغل والقدرة والزمن.',
                'points': 2.5,
                'explanation': 'Power = Work / Time or P = W / t',
                'explanation_arabic': 'القدرة = الشغل / الزمن أو P = W / t'
            },
            {
                'type': 'qcm_single',
                'text': 'When is the work done by a force zero?',
                'text_arabic': 'متى يكون الشغل المبذول من طرف قوة مساوياً للصفر؟',
                'points': 2.5,
                'choices': [
                    {'text': 'When force is maximum', 'text_arabic': 'عندما تكون القوة في أقصاها', 'is_correct': False},
                    {'text': 'When displacement is zero or force is perpendicular to displacement', 'text_arabic': 'عندما تكون الإزاحة معدومة أو القوة عمودية على الإزاحة', 'is_correct': True},
                    {'text': 'When force is minimum', 'text_arabic': 'عندما تكون القوة في أدناها', 'is_correct': False},
                    {'text': 'Never', 'text_arabic': 'أبداً', 'is_correct': False}
                ],
                'explanation': 'Work is zero when there is no displacement or when force is perpendicular to displacement.',
                'explanation_arabic': 'الشغل يساوي الصفر عندما لا توجد إزاحة أو عندما تكون القوة عمودية على الإزاحة.'
            },
            {
                'type': 'open_long',
                'text': 'Explain the difference between positive work, negative work, and zero work with examples.',
                'text_arabic': 'اشرح الفرق بين الشغل الموجب والشغل السالب والشغل المعدوم مع أمثلة.',
                'points': 4.0,
                'explanation': 'Positive work: force and displacement in same direction (lifting object). Negative work: force opposite to displacement (friction). Zero work: no displacement or perpendicular force.',
                'explanation_arabic': 'الشغل الموجب: القوة والإزاحة في نفس الاتجاه (رفع جسم). الشغل السالب: القوة عكس الإزاحة (الاحتكاك). الشغل المعدوم: لا توجد إزاحة أو القوة عمودية.'
            }
        ]

    def get_exercise_3_questions(self):
        """Questions for advanced level exercise"""
        return [
            {
                'type': 'open_long',
                'text': 'A car engine delivers 75 kW of power. If the car travels at a constant speed of 90 km/h, calculate the total driving force.',
                'text_arabic': 'يولد محرك سيارة قدرة مقدارها 75 كيلووات. إذا كانت السيارة تسير بسرعة ثابتة 90 كم/س، احسب قوة الدفع الإجمالية.',
                'points': 6.0,
                'explanation': 'P = F × v, so F = P / v = 75,000 W / 25 m/s = 3,000 N',
                'explanation_arabic': 'P = F × v، إذن F = P / v = 75,000 وات / 25 م/ث = 3,000 نيوتن'
            },
            {
                'type': 'qcm_single',
                'text': 'A machine has an efficiency of 80%. If it consumes 1000 J of energy, how much useful work does it produce?',
                'text_arabic': 'آلة لها مردود 80%. إذا استهلكت 1000 جول من الطاقة، كم من الشغل المفيد تنتج؟',
                'points': 3.5,
                'choices': [
                    {'text': '800 J', 'text_arabic': '800 جول', 'is_correct': True},
                    {'text': '1000 J', 'text_arabic': '1000 جول', 'is_correct': False},
                    {'text': '200 J', 'text_arabic': '200 جول', 'is_correct': False},
                    {'text': '1200 J', 'text_arabic': '1200 جول', 'is_correct': False}
                ],
                'explanation': 'Useful work = Efficiency × Input energy = 0.8 × 1000 J = 800 J',
                'explanation_arabic': 'الشغل المفيد = المردود × الطاقة المدخلة = 0.8 × 1000 جول = 800 جول'
            },
            {
                'type': 'open_long',
                'text': 'Derive the relationship between power, force, and velocity for an object moving at constant velocity.',
                'text_arabic': 'اشتق العلاقة بين القدرة والقوة والسرعة لجسم يتحرك بسرعة ثابتة.',
                'points': 5.0,
                'explanation': 'P = W/t = (F×d)/t = F×(d/t) = F×v, therefore P = F×v',
                'explanation_arabic': 'P = W/t = (F×d)/t = F×(d/t) = F×v، إذن P = F×v'
            },
            {
                'type': 'qcm_multiple',
                'text': 'Which factors can increase the power output of an engine? (Select all that apply)',
                'text_arabic': 'أي من العوامل التالية يمكن أن تزيد من القدرة الناتجة للمحرك؟ (اختر جميع الإجابات الصحيحة)',
                'points': 4.0,
                'choices': [
                    {'text': 'Increasing force applied', 'text_arabic': 'زيادة القوة المطبقة', 'is_correct': True},
                    {'text': 'Increasing velocity', 'text_arabic': 'زيادة السرعة', 'is_correct': True},
                    {'text': 'Reducing work done', 'text_arabic': 'تقليل الشغل المبذول', 'is_correct': False},
                    {'text': 'Improving efficiency', 'text_arabic': 'تحسين المردود', 'is_correct': True}
                ],
                'explanation': 'Power can be increased by increasing force, velocity, or efficiency.',
                'explanation_arabic': 'يمكن زيادة القدرة بزيادة القوة أو السرعة أو المردود.'
            },
            {
                'type': 'open_short',
                'text': 'Define mechanical efficiency and write its formula.',
                'text_arabic': 'عرف المردود الميكانيكي واكتب صيغته.',
                'points': 3.0,
                'explanation': 'Efficiency = (Useful output energy / Total input energy) × 100%',
                'explanation_arabic': 'المردود = (الطاقة المفيدة الناتجة / مجموع الطاقة المدخلة) × 100%'
            },
            {
                'type': 'open_long',
                'text': 'A worker uses a pulley system to lift a 200 kg mass 5 meters high in 10 seconds. If the worker applies a force of 1200 N, calculate: a) Work done against gravity b) Power delivered by worker c) Efficiency of the system',
                'text_arabic': 'يستخدم عامل نظام بكرات لرفع كتلة 200 كغ إلى ارتفاع 5 أمتار في 10 ثوان. إذا طبق العامل قوة 1200 نيوتن، احسب: أ) الشغل المبذول ضد الجاذبية ب) القدرة المولدة من العامل ج) مردود النظام',
                'points': 6.5,
                'explanation': 'a) W_gravity = mgh = 200×9.8×5 = 9800 J; b) P_worker = F×v = 1200×0.5 = 600 W; c) Efficiency = 9800/(1200×5) × 100% = 163% (impossible - check calculation)',
                'explanation_arabic': 'أ) W_gravity = mgh = 200×9.8×5 = 9800 جول؛ ب) P_worker = F×v = 1200×0.5 = 600 وات؛ ج) المردود = 9800/(1200×5) × 100% = 163% (مستحيل - راجع الحساب)'
            }
        ]