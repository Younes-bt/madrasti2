from django.core.management.base import BaseCommand
from django.db import transaction, connections
from django.db.models import Q
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward
from schools.models import Subject, Grade
import random
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Generate exercises for all remaining lessons without exercises (~1916 lessons)'

    def add_arguments(self, parser):
        parser.add_argument('--batch-size', type=int, default=50, help='Number of lessons to process in each batch')
        parser.add_argument('--start-id', type=int, help='Start from specific lesson ID')
        parser.add_argument('--end-id', type=int, help='End at specific lesson ID')
        parser.add_argument('--dry-run', action='store_true', help='Show what would be created without actually creating')
        parser.add_argument('--subject', type=str, help='Filter by subject name')
        parser.add_argument('--grade', type=str, help='Filter by grade name')
        parser.add_argument('--verbose', action='store_true', help='Show detailed progress')

    def handle(self, *args, **options):
        batch_size = options['batch_size']
        dry_run = options['dry_run']
        verbose = options['verbose']

        # Get lessons without exercises
        queryset = Lesson.objects.filter(exercises__isnull=True).select_related('subject', 'grade')

        # Apply filters
        if options['start_id']:
            queryset = queryset.filter(id__gte=options['start_id'])
        if options['end_id']:
            queryset = queryset.filter(id__lte=options['end_id'])
        if options['subject']:
            queryset = queryset.filter(subject__name__icontains=options['subject'])
        if options['grade']:
            queryset = queryset.filter(grade__name__icontains=options['grade'])

        total_lessons = queryset.count()

        if dry_run:
            self.stdout.write(f"DRY RUN: Would process {total_lessons} lessons")
            return

        self.stdout.write(f"Processing {total_lessons} lessons in batches of {batch_size}")

        processed = 0
        errors = 0

        # Process in batches to avoid memory issues
        for batch_start in range(0, total_lessons, batch_size):
            batch_lessons = queryset[batch_start:batch_start + batch_size]

            try:
                with transaction.atomic():
                    for lesson in batch_lessons:
                        try:
                            if verbose:
                                self.stdout.write(f"Processing: {lesson.id} - {lesson.title[:50]}...")

                            self.create_exercises_for_lesson(lesson)
                            processed += 1

                        except Exception as e:
                            errors += 1
                            logger.error(f"Error processing lesson {lesson.id}: {str(e)}")
                            if verbose:
                                self.stdout.write(self.style.ERROR(f"Error in lesson {lesson.id}: {str(e)}"))

                # Progress update
                self.stdout.write(f"Progress: {processed}/{total_lessons} lessons processed, {errors} errors")

            except Exception as e:
                logger.error(f"Batch error at {batch_start}: {str(e)}")
                errors += batch_size

        self.stdout.write(
            self.style.SUCCESS(
                f'Completed! Processed {processed} lessons, {errors} errors'
            )
        )

    def create_exercises_for_lesson(self, lesson):
        """Create contextually appropriate exercises for a lesson"""

        # Determine exercise configuration based on subject and grade
        config = self.get_exercise_config(lesson)

        exercises_created = 0

        for i, exercise_template in enumerate(config['exercises'], 1):
            # Create exercise
            exercise = Exercise.objects.create(
                lesson=lesson,
                title=exercise_template['title'],
                title_arabic=exercise_template['title_arabic'],
                difficulty_level=exercise_template['difficulty'],
                order=i,
                created_by_id=1  # Assuming admin user with ID 1
            )

            # Create reward
            ExerciseReward.objects.create(
                exercise=exercise,
                completion_points=exercise_template['points'],
                completion_coins=1
            )

            # Create questions
            for j, question_template in enumerate(exercise_template['questions'], 1):
                question = Question.objects.create(
                    exercise=exercise,
                    question_text=question_template['question_text'],
                    question_text_arabic=question_template['question_text_arabic'],
                    question_type=question_template['question_type'],
                    order=j
                )

                # Create choices if applicable
                for k, (choice_text, choice_text_arabic, is_correct) in enumerate(question_template['choices'], 1):
                    QuestionChoice.objects.create(
                        question=question,
                        choice_text=choice_text,
                        choice_text_arabic=choice_text_arabic,
                        is_correct=is_correct,
                        order=k
                    )

            exercises_created += 1

        return exercises_created

    def get_exercise_config(self, lesson):
        """Generate contextually appropriate exercise configuration for a lesson"""

        subject_name = lesson.subject.name.lower()
        grade_name = lesson.grade.name.lower()
        lesson_title = lesson.title

        # Determine difficulty and content based on grade level
        if any(term in grade_name for term in ['primary', 'cp', 'ce1', 'ce2', 'cm1', 'cm2']):
            base_difficulty = 'beginner'
            base_points = 8
        elif any(term in grade_name for term in ['middle', '1ac', '2ac', '3ac']):
            base_difficulty = 'intermediate'
            base_points = 12
        else:  # High school and above
            base_difficulty = 'advanced'
            base_points = 15

        # Subject-specific configurations
        if 'math' in subject_name:
            return self.get_math_exercises(lesson, base_difficulty, base_points)
        elif any(term in subject_name for term in ['physics', 'chemistry', 'science']):
            return self.get_science_exercises(lesson, base_difficulty, base_points)
        elif any(term in subject_name for term in ['arabic', 'french', 'english']):
            return self.get_language_exercises(lesson, base_difficulty, base_points)
        elif any(term in subject_name for term in ['geography', 'history', 'social']):
            return self.get_social_studies_exercises(lesson, base_difficulty, base_points)
        elif any(term in subject_name for term in ['islamic', 'religion']):
            return self.get_islamic_exercises(lesson, base_difficulty, base_points)
        else:
            return self.get_general_exercises(lesson, base_difficulty, base_points)

    def get_math_exercises(self, lesson, difficulty, base_points):
        """Generate mathematics exercises"""
        return {
            'exercises': [
                {
                    'title': f'Basic Concepts: {lesson.title}',
                    'title_arabic': f'المفاهيم الأساسية: {lesson.title_arabic or lesson.title}',
                    'difficulty': 'beginner',
                    'points': base_points,
                    'questions': [
                        {
                            'question_text': f'What is the main concept in {lesson.title}?',
                            'question_text_arabic': f'ما هو المفهوم الأساسي في {lesson.title_arabic or lesson.title}؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                (f'Definition of {lesson.title}', f'تعريف {lesson.title_arabic or lesson.title}', True),
                                ('Unrelated concept A', 'مفهوم غير متعلق أ', False),
                                ('Unrelated concept B', 'مفهوم غير متعلق ب', False),
                                ('Unrelated concept C', 'مفهوم غير متعلق ج', False)
                            ]
                        },
                        {
                            'question_text': f'Which mathematical operations are used in {lesson.title}?',
                            'question_text_arabic': f'ما العمليات الرياضية المستخدمة في {lesson.title_arabic or lesson.title}؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                ('Addition', 'الجمع', True),
                                ('Subtraction', 'الطرح', True),
                                ('Multiplication', 'الضرب', True),
                                ('Division', 'القسمة', True),
                                ('None', 'لا شيء', False)
                            ]
                        },
                        {
                            'question_text': f'{lesson.title} is an important mathematical concept.',
                            'question_text_arabic': f'{lesson.title_arabic or lesson.title} مفهوم رياضي مهم.',
                            'question_type': 'true_false',
                            'choices': [
                                ('True', 'صحيح', True),
                                ('False', 'خطأ', False)
                            ]
                        },
                        {
                            'question_text': f'Provide an example related to {lesson.title}.',
                            'question_text_arabic': f'قدم مثالاً متعلقاً بـ {lesson.title_arabic or lesson.title}.',
                            'question_type': 'open_short',
                            'choices': []
                        }
                    ]
                },
                {
                    'title': f'Problem Solving: {lesson.title}',
                    'title_arabic': f'حل المسائل: {lesson.title_arabic or lesson.title}',
                    'difficulty': difficulty,
                    'points': base_points + 5,
                    'questions': [
                        {
                            'question_text': f'How do you solve problems involving {lesson.title}?',
                            'question_text_arabic': f'كيف تحل المسائل المتعلقة بـ {lesson.title_arabic or lesson.title}؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                ('Follow systematic steps', 'اتبع خطوات منهجية', True),
                                ('Guess randomly', 'خمن عشوائياً', False),
                                ('Skip the problem', 'تجاهل المسألة', False),
                                ('Use unrelated methods', 'استخدم طرق غير متعلقة', False)
                            ]
                        },
                        {
                            'question_text': f'What tools might be helpful for {lesson.title}?',
                            'question_text_arabic': f'ما الأدوات التي قد تكون مفيدة لـ {lesson.title_arabic or lesson.title}؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                ('Calculator', 'الآلة الحاسبة', True),
                                ('Ruler', 'المسطرة', True),
                                ('Graph paper', 'ورق الرسم البياني', True),
                                ('Compass', 'البوصلة', True),
                                ('Random objects', 'أشياء عشوائية', False)
                            ]
                        },
                        {
                            'question_text': f'Practice is important for mastering {lesson.title}.',
                            'question_text_arabic': f'التمرين مهم لإتقان {lesson.title_arabic or lesson.title}.',
                            'question_type': 'true_false',
                            'choices': [
                                ('True', 'صحيح', True),
                                ('False', 'خطأ', False)
                            ]
                        },
                        {
                            'question_text': f'Explain the steps to solve a problem in {lesson.title}.',
                            'question_text_arabic': f'اشرح خطوات حل مسألة في {lesson.title_arabic or lesson.title}.',
                            'question_type': 'open_short',
                            'choices': []
                        }
                    ]
                },
                {
                    'title': f'Applications of {lesson.title}',
                    'title_arabic': f'تطبيقات {lesson.title_arabic or lesson.title}',
                    'difficulty': 'advanced',
                    'points': base_points + 10,
                    'questions': [
                        {
                            'question_text': f'Where can {lesson.title} be applied in real life?',
                            'question_text_arabic': f'أين يمكن تطبيق {lesson.title_arabic or lesson.title} في الحياة الحقيقية؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                ('Science and engineering', 'العلوم والهندسة', True),
                                ('Daily life calculations', 'الحسابات اليومية', True),
                                ('Technology and computers', 'التكنولوجيا والحاسوب', True),
                                ('Art and design', 'الفن والتصميم', True),
                                ('Nowhere', 'في أي مكان', False)
                            ]
                        },
                        {
                            'question_text': f'What careers might use {lesson.title}?',
                            'question_text_arabic': f'ما المهن التي قد تستخدم {lesson.title_arabic or lesson.title}؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                ('Engineer, scientist, analyst', 'مهندس، عالم، محلل', True),
                                ('Only teachers', 'المعلمون فقط', False),
                                ('No careers use it', 'لا توجد مهن تستخدمه', False),
                                ('Only mathematicians', 'علماء الرياضيات فقط', False)
                            ]
                        },
                        {
                            'question_text': f'{lesson.title} has practical applications beyond school.',
                            'question_text_arabic': f'{lesson.title_arabic or lesson.title} له تطبيقات عملية خارج المدرسة.',
                            'question_type': 'true_false',
                            'choices': [
                                ('True', 'صحيح', True),
                                ('False', 'خطأ', False)
                            ]
                        },
                        {
                            'question_text': f'Give a real-world example of {lesson.title}.',
                            'question_text_arabic': f'أعط مثالاً من الحياة الحقيقية على {lesson.title_arabic or lesson.title}.',
                            'question_type': 'open_short',
                            'choices': []
                        }
                    ]
                }
            ]
        }

    def get_science_exercises(self, lesson, difficulty, base_points):
        """Generate science exercises"""
        return {
            'exercises': [
                {
                    'title': f'Understanding {lesson.title}',
                    'title_arabic': f'فهم {lesson.title_arabic or lesson.title}',
                    'difficulty': 'beginner',
                    'points': base_points,
                    'questions': [
                        {
                            'question_text': f'What is {lesson.title}?',
                            'question_text_arabic': f'ما هو {lesson.title_arabic or lesson.title}؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                (f'A scientific concept related to {lesson.title}', f'مفهوم علمي متعلق بـ {lesson.title_arabic or lesson.title}', True),
                                ('A literary work', 'عمل أدبي', False),
                                ('A mathematical equation', 'معادلة رياضية', False),
                                ('A historical event', 'حدث تاريخي', False)
                            ]
                        },
                        {
                            'question_text': f'Which scientific principles are involved in {lesson.title}?',
                            'question_text_arabic': f'ما المبادئ العلمية المتضمنة في {lesson.title_arabic or lesson.title}؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                ('Observation', 'الملاحظة', True),
                                ('Experimentation', 'التجريب', True),
                                ('Analysis', 'التحليل', True),
                                ('Hypothesis formation', 'تكوين الفرضيات', True),
                                ('Pure imagination', 'الخيال المحض', False)
                            ]
                        },
                        {
                            'question_text': f'{lesson.title} can be studied through scientific methods.',
                            'question_text_arabic': f'يمكن دراسة {lesson.title_arabic or lesson.title} من خلال الطرق العلمية.',
                            'question_type': 'true_false',
                            'choices': [
                                ('True', 'صحيح', True),
                                ('False', 'خطأ', False)
                            ]
                        },
                        {
                            'question_text': f'Describe an observation related to {lesson.title}.',
                            'question_text_arabic': f'اصف ملاحظة متعلقة بـ {lesson.title_arabic or lesson.title}.',
                            'question_type': 'open_short',
                            'choices': []
                        }
                    ]
                },
                {
                    'title': f'Experiments and {lesson.title}',
                    'title_arabic': f'التجارب و {lesson.title_arabic or lesson.title}',
                    'difficulty': difficulty,
                    'points': base_points + 5,
                    'questions': [
                        {
                            'question_text': f'How would you investigate {lesson.title}?',
                            'question_text_arabic': f'كيف ستبحث في {lesson.title_arabic or lesson.title}؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                ('Through controlled experiments', 'من خلال التجارب المحكمة', True),
                                ('By guessing', 'بالتخمين', False),
                                ('By asking friends', 'بسؤال الأصدقاء', False),
                                ('By avoiding the topic', 'بتجنب الموضوع', False)
                            ]
                        },
                        {
                            'question_text': f'What safety measures are important when studying {lesson.title}?',
                            'question_text_arabic': f'ما تدابير السلامة المهمة عند دراسة {lesson.title_arabic or lesson.title}؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                ('Wear safety equipment', 'ارتداء معدات السلامة', True),
                                ('Follow instructions', 'اتباع التعليمات', True),
                                ('Work in supervised environment', 'العمل في بيئة مراقبة', True),
                                ('Keep workspace clean', 'الحفاظ على نظافة مكان العمل', True),
                                ('Ignore safety rules', 'تجاهل قواعد السلامة', False)
                            ]
                        },
                        {
                            'question_text': f'Scientific understanding of {lesson.title} evolves over time.',
                            'question_text_arabic': f'الفهم العلمي لـ {lesson.title_arabic or lesson.title} يتطور مع الوقت.',
                            'question_type': 'true_false',
                            'choices': [
                                ('True', 'صحيح', True),
                                ('False', 'خطأ', False)
                            ]
                        },
                        {
                            'question_text': f'Propose an experiment to study {lesson.title}.',
                            'question_text_arabic': f'اقترح تجربة لدراسة {lesson.title_arabic or lesson.title}.',
                            'question_type': 'open_short',
                            'choices': []
                        }
                    ]
                }
            ]
        }

    def get_language_exercises(self, lesson, difficulty, base_points):
        """Generate language learning exercises"""
        return {
            'exercises': [
                {
                    'title': f'Vocabulary: {lesson.title}',
                    'title_arabic': f'المفردات: {lesson.title_arabic or lesson.title}',
                    'difficulty': 'beginner',
                    'points': base_points,
                    'questions': [
                        {
                            'question_text': f'What does "{lesson.title}" mean?',
                            'question_text_arabic': f'ماذا تعني "{lesson.title_arabic or lesson.title}"؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                (f'Related to {lesson.title}', f'متعلق بـ {lesson.title_arabic or lesson.title}', True),
                                ('Something completely different', 'شيء مختلف تماماً', False),
                                ('A number', 'رقم', False),
                                ('A color', 'لون', False)
                            ]
                        },
                        {
                            'question_text': f'Which skills are developed through {lesson.title}?',
                            'question_text_arabic': f'ما المهارات التي تطور من خلال {lesson.title_arabic or lesson.title}؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                ('Reading', 'القراءة', True),
                                ('Writing', 'الكتابة', True),
                                ('Speaking', 'التحدث', True),
                                ('Listening', 'الاستماع', True),
                                ('Dancing', 'الرقص', False)
                            ]
                        },
                        {
                            'question_text': f'Learning {lesson.title} improves communication skills.',
                            'question_text_arabic': f'تعلم {lesson.title_arabic or lesson.title} يحسن مهارات التواصل.',
                            'question_type': 'true_false',
                            'choices': [
                                ('True', 'صحيح', True),
                                ('False', 'خطأ', False)
                            ]
                        },
                        {
                            'question_text': f'Use "{lesson.title}" in a sentence.',
                            'question_text_arabic': f'استخدم "{lesson.title_arabic or lesson.title}" في جملة.',
                            'question_type': 'open_short',
                            'choices': []
                        }
                    ]
                },
                {
                    'title': f'Grammar and {lesson.title}',
                    'title_arabic': f'القواعد و {lesson.title_arabic or lesson.title}',
                    'difficulty': difficulty,
                    'points': base_points + 5,
                    'questions': [
                        {
                            'question_text': f'What grammatical rules apply to {lesson.title}?',
                            'question_text_arabic': f'ما القواعد النحوية التي تطبق على {lesson.title_arabic or lesson.title}؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                ('Standard grammar rules', 'قواعد النحو القياسية', True),
                                ('No rules apply', 'لا توجد قواعد تطبق', False),
                                ('Only foreign rules', 'القواعد الأجنبية فقط', False),
                                ('Made-up rules', 'قواعد مخترعة', False)
                            ]
                        },
                        {
                            'question_text': f'How does {lesson.title} function in sentence structure?',
                            'question_text_arabic': f'كيف يعمل {lesson.title_arabic or lesson.title} في بنية الجملة؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                ('As subject', 'كفاعل', True),
                                ('As object', 'كمفعول', True),
                                ('As modifier', 'كصفة', True),
                                ('In various positions', 'في مواضع مختلفة', True),
                                ('Never in sentences', 'لا يستخدم في الجمل', False)
                            ]
                        },
                        {
                            'question_text': f'Correct usage of {lesson.title} is important.',
                            'question_text_arabic': f'الاستخدام الصحيح لـ {lesson.title_arabic or lesson.title} مهم.',
                            'question_type': 'true_false',
                            'choices': [
                                ('True', 'صحيح', True),
                                ('False', 'خطأ', False)
                            ]
                        },
                        {
                            'question_text': f'Explain the grammatical function of {lesson.title}.',
                            'question_text_arabic': f'اشرح الوظيفة النحوية لـ {lesson.title_arabic or lesson.title}.',
                            'question_type': 'open_short',
                            'choices': []
                        }
                    ]
                }
            ]
        }

    def get_social_studies_exercises(self, lesson, difficulty, base_points):
        """Generate social studies exercises"""
        return {
            'exercises': [
                {
                    'title': f'Understanding {lesson.title}',
                    'title_arabic': f'فهم {lesson.title_arabic or lesson.title}',
                    'difficulty': 'beginner',
                    'points': base_points,
                    'questions': [
                        {
                            'question_text': f'What is the significance of {lesson.title}?',
                            'question_text_arabic': f'ما أهمية {lesson.title_arabic or lesson.title}؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                (f'Important for understanding society/history', f'مهم لفهم المجتمع/التاريخ', True),
                                ('Has no significance', 'ليس له أهمية', False),
                                ('Only for entertainment', 'للترفيه فقط', False),
                                ('Purely fictional', 'خيالي محض', False)
                            ]
                        },
                        {
                            'question_text': f'Which factors influence {lesson.title}?',
                            'question_text_arabic': f'ما العوامل التي تؤثر على {lesson.title_arabic or lesson.title}؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                ('Geographic factors', 'العوامل الجغرافية', True),
                                ('Cultural factors', 'العوامل الثقافية', True),
                                ('Economic factors', 'العوامل الاقتصادية', True),
                                ('Social factors', 'العوامل الاجتماعية', True),
                                ('Random chance only', 'الصدفة العشوائية فقط', False)
                            ]
                        },
                        {
                            'question_text': f'{lesson.title} helps us understand human society.',
                            'question_text_arabic': f'{lesson.title_arabic or lesson.title} يساعدنا على فهم المجتمع الإنساني.',
                            'question_type': 'true_false',
                            'choices': [
                                ('True', 'صحيح', True),
                                ('False', 'خطأ', False)
                            ]
                        },
                        {
                            'question_text': f'Explain why {lesson.title} is important to study.',
                            'question_text_arabic': f'اشرح لماذا من المهم دراسة {lesson.title_arabic or lesson.title}.',
                            'question_type': 'open_short',
                            'choices': []
                        }
                    ]
                }
            ]
        }

    def get_islamic_exercises(self, lesson, difficulty, base_points):
        """Generate Islamic education exercises"""
        return {
            'exercises': [
                {
                    'title': f'Understanding {lesson.title}',
                    'title_arabic': f'فهم {lesson.title_arabic or lesson.title}',
                    'difficulty': 'beginner',
                    'points': base_points,
                    'questions': [
                        {
                            'question_text': f'What is the Islamic teaching about {lesson.title}?',
                            'question_text_arabic': f'ما التعليم الإسلامي حول {lesson.title_arabic or lesson.title}؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                (f'Islamic guidance on {lesson.title}', f'الهداية الإسلامية حول {lesson.title_arabic or lesson.title}', True),
                                ('Has no Islamic relevance', 'ليس له صلة إسلامية', False),
                                ('Contradicts Islamic teachings', 'يتعارض مع التعاليم الإسلامية', False),
                                ('Is forbidden in Islam', 'محرم في الإسلام', False)
                            ]
                        },
                        {
                            'question_text': f'Which Islamic values are related to {lesson.title}?',
                            'question_text_arabic': f'ما القيم الإسلامية المتعلقة بـ {lesson.title_arabic or lesson.title}؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                ('Faith (Iman)', 'الإيمان', True),
                                ('Good deeds (Amal Salih)', 'العمل الصالح', True),
                                ('Justice (Adl)', 'العدل', True),
                                ('Compassion (Rahma)', 'الرحمة', True),
                                ('Greed (Tama)', 'الطمع', False)
                            ]
                        },
                        {
                            'question_text': f'{lesson.title} is consistent with Islamic teachings.',
                            'question_text_arabic': f'{lesson.title_arabic or lesson.title} متوافق مع التعاليم الإسلامية.',
                            'question_type': 'true_false',
                            'choices': [
                                ('True', 'صحيح', True),
                                ('False', 'خطأ', False)
                            ]
                        },
                        {
                            'question_text': f'How does {lesson.title} relate to Islamic life?',
                            'question_text_arabic': f'كيف يرتبط {lesson.title_arabic or lesson.title} بالحياة الإسلامية؟',
                            'question_type': 'open_short',
                            'choices': []
                        }
                    ]
                }
            ]
        }

    def get_general_exercises(self, lesson, difficulty, base_points):
        """Generate general exercises for unspecified subjects"""
        return {
            'exercises': [
                {
                    'title': f'Learning about {lesson.title}',
                    'title_arabic': f'التعلم حول {lesson.title_arabic or lesson.title}',
                    'difficulty': 'beginner',
                    'points': base_points,
                    'questions': [
                        {
                            'question_text': f'What is {lesson.title}?',
                            'question_text_arabic': f'ما هو {lesson.title_arabic or lesson.title}؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                (f'The topic of this lesson: {lesson.title}', f'موضوع هذا الدرس: {lesson.title_arabic or lesson.title}', True),
                                ('An unrelated topic', 'موضوع غير متعلق', False),
                                ('A mathematical formula', 'معادلة رياضية', False),
                                ('A type of food', 'نوع من الطعام', False)
                            ]
                        },
                        {
                            'question_text': f'Why is it important to learn about {lesson.title}?',
                            'question_text_arabic': f'لماذا من المهم تعلم {lesson.title_arabic or lesson.title}؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                ('Increases knowledge', 'يزيد المعرفة', True),
                                ('Develops understanding', 'ينمي الفهم', True),
                                ('Improves skills', 'يحسن المهارات', True),
                                ('Builds character', 'يبني الشخصية', True),
                                ('Is completely useless', 'عديم الفائدة تماماً', False)
                            ]
                        },
                        {
                            'question_text': f'Learning about {lesson.title} is beneficial.',
                            'question_text_arabic': f'تعلم {lesson.title_arabic or lesson.title} مفيد.',
                            'question_type': 'true_false',
                            'choices': [
                                ('True', 'صحيح', True),
                                ('False', 'خطأ', False)
                            ]
                        },
                        {
                            'question_text': f'Describe what you learned about {lesson.title}.',
                            'question_text_arabic': f'اصف ما تعلمته حول {lesson.title_arabic or lesson.title}.',
                            'question_type': 'open_short',
                            'choices': []
                        }
                    ]
                },
                {
                    'title': f'Application of {lesson.title}',
                    'title_arabic': f'تطبيق {lesson.title_arabic or lesson.title}',
                    'difficulty': difficulty,
                    'points': base_points + 5,
                    'questions': [
                        {
                            'question_text': f'How can you apply knowledge of {lesson.title}?',
                            'question_text_arabic': f'كيف يمكنك تطبيق معرفة {lesson.title_arabic or lesson.title}؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                ('In practical situations', 'في المواقف العملية', True),
                                ('Never apply it', 'لا تطبقه أبداً', False),
                                ('Only in tests', 'في الاختبارات فقط', False),
                                ('Forget about it', 'انسه', False)
                            ]
                        },
                        {
                            'question_text': f'What benefits come from understanding {lesson.title}?',
                            'question_text_arabic': f'ما الفوائد التي تأتي من فهم {lesson.title_arabic or lesson.title}؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                ('Better decision making', 'اتخاذ قرارات أفضل', True),
                                ('Improved problem solving', 'تحسين حل المشكلات', True),
                                ('Enhanced creativity', 'تعزيز الإبداع', True),
                                ('Greater confidence', 'ثقة أكبر', True),
                                ('No benefits at all', 'لا توجد فوائد على الإطلاق', False)
                            ]
                        },
                        {
                            'question_text': f'Understanding {lesson.title} helps in daily life.',
                            'question_text_arabic': f'فهم {lesson.title_arabic or lesson.title} يساعد في الحياة اليومية.',
                            'question_type': 'true_false',
                            'choices': [
                                ('True', 'صحيح', True),
                                ('False', 'خطأ', False)
                            ]
                        },
                        {
                            'question_text': f'Give an example of how {lesson.title} is useful.',
                            'question_text_arabic': f'أعط مثالاً على كيفية فائدة {lesson.title_arabic or lesson.title}.',
                            'question_type': 'open_short',
                            'choices': []
                        }
                    ]
                }
            ]
        }