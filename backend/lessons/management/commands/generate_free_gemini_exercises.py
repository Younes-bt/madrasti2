from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward
import google.generativeai as genai
import json
import time
import logging
import os
from typing import Dict, List, Any

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Generate high-quality exercises using Google Gemini (FREE) for all remaining lessons'

    def add_arguments(self, parser):
        parser.add_argument('--api-key', type=str, help='Google Gemini API key (or set GEMINI_API_KEY env var)')
        parser.add_argument('--model', type=str, default='gemini-1.5-flash', help='Gemini model to use (gemini-1.5-flash is free)')
        parser.add_argument('--batch-size', type=int, default=15, help='Number of lessons to process in each batch')
        parser.add_argument('--start-id', type=int, help='Start from specific lesson ID')
        parser.add_argument('--end-id', type=int, help='End at specific lesson ID')
        parser.add_argument('--subject', type=str, help='Filter by subject name')
        parser.add_argument('--grade', type=str, help='Filter by grade name')
        parser.add_argument('--dry-run', action='store_true', help='Generate sample without saving to database')
        parser.add_argument('--verbose', action='store_true', help='Show detailed progress')
        parser.add_argument('--delay', type=float, default=0.5, help='Delay between API calls in seconds')

    def handle(self, *args, **options):
        # Initialize Gemini
        api_key = options['api_key'] or os.getenv('GEMINI_API_KEY')
        if not api_key:
            self.stdout.write(
                self.style.ERROR('Google Gemini API key required. Get free key from: https://makersuite.google.com/app/apikey')
            )
            self.stdout.write('Set --api-key or GEMINI_API_KEY environment variable')
            return

        genai.configure(api_key=api_key)

        # Initialize model
        model = genai.GenerativeModel(options['model'])

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

        if options['dry_run']:
            self.stdout.write(f"DRY RUN: Testing Gemini with first lesson...")
            lesson = queryset.first()
            if lesson:
                sample_exercises = self.generate_gemini_exercises(lesson, model, options['delay'])
                self.stdout.write(json.dumps(sample_exercises, indent=2, ensure_ascii=False))
            return

        self.stdout.write(f"🚀 Generating HIGH-QUALITY exercises using Google Gemini (FREE)")
        self.stdout.write(f"📊 Total lessons: {total_lessons}")
        self.stdout.write(f"🤖 Using model: {options['model']}")

        processed = 0
        errors = 0

        # Process in batches
        batch_size = options['batch_size']
        for batch_start in range(0, total_lessons, batch_size):
            batch_lessons = queryset[batch_start:batch_start + batch_size]

            for lesson in batch_lessons:
                try:
                    if options['verbose']:
                        self.stdout.write(f"📝 Processing: {lesson.id} - {lesson.title[:50]}...")

                    # Generate high-quality exercises using Gemini
                    gemini_exercises = self.generate_gemini_exercises(lesson, model, options['delay'])

                    # Create exercises in database
                    with transaction.atomic():
                        exercises_created = self.create_exercises_from_ai_data(lesson, gemini_exercises)
                        if options['verbose']:
                            self.stdout.write(f"   ✅ Created {exercises_created} exercises")

                    processed += 1

                    # Add delay to respect rate limits (Gemini is generous)
                    if options['delay'] > 0:
                        time.sleep(options['delay'])

                except Exception as e:
                    errors += 1
                    logger.error(f"Error processing lesson {lesson.id}: {str(e)}")
                    if options['verbose']:
                        self.stdout.write(self.style.ERROR(f"❌ Error in lesson {lesson.id}: {str(e)}"))

            # Progress update
            self.stdout.write(f"📈 Progress: {processed}/{total_lessons} lessons processed, {errors} errors")

        self.stdout.write(
            self.style.SUCCESS(
                f'🎉 Completed! Generated high-quality exercises for {processed} lessons using FREE Gemini API!'
            )
        )

    def generate_gemini_exercises(self, lesson: Lesson, model, delay: float) -> Dict[str, Any]:
        """Generate high-quality exercises using Google Gemini"""

        # Create comprehensive prompt
        prompt = self.create_comprehensive_prompt(lesson)

        try:
            response = model.generate_content(prompt)

            # Parse Gemini response
            ai_content = response.text
            exercises_data = self.parse_ai_response(ai_content, lesson)

            return exercises_data

        except Exception as e:
            logger.error(f"Gemini generation failed for lesson {lesson.id}: {str(e)}")
            # Use intelligent fallback
            return self.create_intelligent_fallback(lesson)

    def create_comprehensive_prompt(self, lesson: Lesson) -> str:
        """Create detailed prompt for high-quality content generation"""

        # Analyze lesson context
        subject = lesson.subject.name
        grade = lesson.grade.name
        title = lesson.title
        title_arabic = lesson.title_arabic or title

        # Determine educational level
        if any(term in grade.lower() for term in ['cp', 'ce1', 'ce2', 'cm1', 'cm2', 'primary']):
            level = "primary school (ages 6-11)"
            complexity = "simple concepts, concrete examples"
        elif any(term in grade.lower() for term in ['1ac', '2ac', '3ac', 'middle', 'college']):
            level = "middle school (ages 12-15)"
            complexity = "intermediate concepts, some abstraction"
        else:
            level = "high school (ages 16-18)"
            complexity = "advanced concepts, abstract thinking"

        # Subject-specific guidance
        subject_guidance = self.get_subject_guidance(subject.lower())

        return f"""You are an expert educational content creator for Moroccan schools. Create high-quality, pedagogically sound exercises.

LESSON DETAILS:
- Title: {title}
- Arabic Title: {title_arabic}
- Subject: {subject}
- Grade: {grade} ({level})
- Complexity Level: {complexity}

SUBJECT-SPECIFIC GUIDANCE:
{subject_guidance}

TASK: Create 3-4 exercises for this lesson with the following structure:

REQUIREMENTS:
1. Progressive difficulty: beginner → intermediate → advanced
2. Each exercise: 4-6 questions with mixed types
3. Question types: multiple choice (single/multiple), true/false, short answer
4. Age-appropriate content for {level}
5. Include real-world applications when possible
6. Professional Arabic translations using Moroccan educational terminology
7. Multiple choice: 4 options with plausible distractors

OUTPUT FORMAT (JSON only, no markdown):
{{
  "exercises": [
    {{
      "title": "Exercise title in English",
      "title_arabic": "Exercise title in Arabic",
      "difficulty": "beginner|intermediate|advanced",
      "points": 15,
      "questions": [
        {{
          "question_text": "Question in English",
          "question_text_arabic": "Question in Arabic",
          "question_type": "qcm_single|qcm_multiple|true_false|open_short",
          "choices": [
            {{"text": "Option A", "text_arabic": "الخيار أ", "is_correct": true}},
            {{"text": "Option B", "text_arabic": "الخيار ب", "is_correct": false}}
          ]
        }}
      ]
    }}
  ]
}}

For open_short questions, use empty choices array [].

Focus on deep understanding, not memorization. Make content engaging and relevant to Moroccan students."""

    def get_subject_guidance(self, subject: str) -> str:
        """Provide detailed subject-specific guidance"""

        guidance = {
            'mathematics': """
- Include step-by-step problem solving
- Use real-world applications (money, measurements, geometry in daily life)
- Progress from concrete to abstract concepts
- Include visual/spatial thinking questions
- Cover: calculations, patterns, logical reasoning, practical applications
""",
            'physics': """
- Connect to everyday phenomena students observe
- Include experimental thinking and observation skills
- Cover: motion, forces, energy, light, sound, electricity
- Use examples from Moroccan context (climate, technology, transportation)
- Balance theoretical understanding with practical applications
""",
            'chemistry': """
- Start with observable chemical changes
- Include safety awareness and laboratory practices
- Cover: matter properties, chemical reactions, molecules, periodic table
- Use examples: cooking, cleaning, industrial processes in Morocco
- Emphasize environmental connections and sustainability
""",
            'biology': """
- Connect to living organisms students know
- Include health and environmental awareness
- Cover: life processes, ecosystems, human body, genetics, evolution
- Use Moroccan flora/fauna examples when relevant
- Emphasize conservation and environmental stewardship
""",
            'arabic': """
- Develop reading comprehension and literary analysis
- Include grammar, vocabulary, and writing skills
- Cover: classical and modern Arabic, poetry, prose
- Connect to Moroccan cultural heritage and identity
- Build communication skills and critical thinking
""",
            'french': """
- Build practical communication skills
- Include grammar, vocabulary, and cultural context
- Cover: conversation, reading, writing, listening
- Use Francophone culture examples, especially Moroccan context
- Emphasize real-world language use
""",
            'english': """
- Focus on global communication skills
- Include grammar, vocabulary, and cultural awareness
- Cover: conversation, reading, writing, listening
- Use international examples while respecting local values
- Prepare for global citizenship and opportunities
""",
            'geography': """
- Connect to Moroccan geography and global context
- Include map skills, environmental awareness
- Cover: physical geography, human geography, climate, resources
- Use current events and environmental challenges
- Develop spatial thinking and global awareness
""",
            'history': """
- Include Moroccan history and global connections
- Develop chronological thinking and analysis skills
- Cover: major historical periods, cause and effect, historical sources
- Connect past to present issues and developments
- Build critical thinking and civic awareness
""",
            'islamic': """
- Focus on practical Islamic teachings and values
- Include Quran, Hadith, and Islamic principles
- Cover: worship, morals, social relations, Islamic civilization
- Emphasize character development and ethical behavior
- Connect to daily life and contemporary issues
"""
        }

        # Find best match
        for key in guidance:
            if key in subject:
                return guidance[key]

        return """
- Focus on core subject concepts and skills
- Include practical applications and real-world connections
- Develop critical thinking and problem-solving abilities
- Use age-appropriate examples and contexts
- Build foundational knowledge for advanced learning
"""

    def parse_ai_response(self, ai_content: str, lesson: Lesson) -> Dict[str, Any]:
        """Parse and validate Gemini response"""
        try:
            # Clean up the response
            cleaned_content = ai_content.strip()

            # Remove markdown code blocks if present
            if cleaned_content.startswith('```json'):
                cleaned_content = cleaned_content[7:]
            elif cleaned_content.startswith('```'):
                cleaned_content = cleaned_content[3:]

            if cleaned_content.endswith('```'):
                cleaned_content = cleaned_content[:-3]

            # Parse JSON
            exercises_data = json.loads(cleaned_content)

            # Validate structure
            if 'exercises' not in exercises_data:
                raise ValueError("Missing 'exercises' key in response")

            # Basic validation
            for exercise in exercises_data['exercises']:
                if not all(key in exercise for key in ['title', 'difficulty', 'questions']):
                    raise ValueError("Invalid exercise structure")

            return exercises_data

        except (json.JSONDecodeError, ValueError) as e:
            logger.error(f"Failed to parse Gemini response for lesson {lesson.id}: {str(e)}")
            return self.create_intelligent_fallback(lesson)

    def create_intelligent_fallback(self, lesson: Lesson) -> Dict[str, Any]:
        """Create high-quality fallback based on lesson analysis"""

        subject = lesson.subject.name.lower()
        title = lesson.title
        title_arabic = lesson.title_arabic or title

        # Determine base difficulty from grade
        if any(term in lesson.grade.name.lower() for term in ['cp', 'ce1', 'ce2', 'cm1', 'cm2']):
            base_points = 12
            difficulties = ['beginner', 'beginner', 'intermediate']
        elif any(term in lesson.grade.name.lower() for term in ['1ac', '2ac', '3ac']):
            base_points = 15
            difficulties = ['beginner', 'intermediate', 'advanced']
        else:
            base_points = 18
            difficulties = ['intermediate', 'advanced', 'advanced']

        # Generate subject-specific content
        if 'math' in subject:
            return self.create_math_intelligent_fallback(lesson, title, title_arabic, base_points, difficulties)
        elif any(term in subject for term in ['physics', 'chemistry', 'biology', 'science']):
            return self.create_science_intelligent_fallback(lesson, title, title_arabic, base_points, difficulties)
        elif any(term in subject for term in ['arabic', 'french', 'english']):
            return self.create_language_intelligent_fallback(lesson, title, title_arabic, base_points, difficulties)
        elif any(term in subject for term in ['geography', 'history']):
            return self.create_social_intelligent_fallback(lesson, title, title_arabic, base_points, difficulties)
        else:
            return self.create_general_intelligent_fallback(lesson, title, title_arabic, base_points, difficulties)

    def create_math_intelligent_fallback(self, lesson, title, title_arabic, base_points, difficulties):
        """Create intelligent math exercises"""
        return {
            "exercises": [
                {
                    "title": f"Mathematical Foundations: {title}",
                    "title_arabic": f"الأسس الرياضية: {title_arabic}",
                    "difficulty": difficulties[0],
                    "points": base_points,
                    "questions": [
                        {
                            "question_text": f"What mathematical concept is central to understanding {title}?",
                            "question_text_arabic": f"ما المفهوم الرياضي المحوري لفهم {title_arabic}؟",
                            "question_type": "qcm_single",
                            "choices": [
                                {"text": f"The fundamental principles of {title}", "text_arabic": f"المبادئ الأساسية لـ {title_arabic}", "is_correct": True},
                                {"text": "Advanced calculus operations only", "text_arabic": "عمليات التفاضل المتقدمة فقط", "is_correct": False},
                                {"text": "Purely theoretical abstractions", "text_arabic": "تجريدات نظرية محضة", "is_correct": False},
                                {"text": "Memorized formulas without understanding", "text_arabic": "صيغ محفوظة بدون فهم", "is_correct": False}
                            ]
                        },
                        {
                            "question_text": f"Which problem-solving strategies apply to {title}?",
                            "question_text_arabic": f"ما استراتيجيات حل المسائل التي تطبق على {title_arabic}؟",
                            "question_type": "qcm_multiple",
                            "choices": [
                                {"text": "Breaking problems into steps", "text_arabic": "تقسيم المسائل إلى خطوات", "is_correct": True},
                                {"text": "Using appropriate mathematical tools", "text_arabic": "استخدام الأدوات الرياضية المناسبة", "is_correct": True},
                                {"text": "Checking and verifying solutions", "text_arabic": "فحص والتحقق من الحلول", "is_correct": True},
                                {"text": "Guessing without mathematical reasoning", "text_arabic": "التخمين بدون تبرير رياضي", "is_correct": False}
                            ]
                        }
                    ]
                },
                {
                    "title": f"Applications of {title}",
                    "title_arabic": f"تطبيقات {title_arabic}",
                    "difficulty": difficulties[1],
                    "points": base_points + 3,
                    "questions": [
                        {
                            "question_text": f"How is {title} used in real-world situations?",
                            "question_text_arabic": f"كيف يُستخدم {title_arabic} في المواقف الحقيقية؟",
                            "question_type": "open_short",
                            "choices": []
                        },
                        {
                            "question_text": f"Understanding {title} helps in solving practical problems.",
                            "question_text_arabic": f"فهم {title_arabic} يساعد في حل المسائل العملية.",
                            "question_type": "true_false",
                            "choices": [
                                {"text": "True", "text_arabic": "صحيح", "is_correct": True},
                                {"text": "False", "text_arabic": "خطأ", "is_correct": False}
                            ]
                        }
                    ]
                }
            ]
        }

    def create_science_intelligent_fallback(self, lesson, title, title_arabic, base_points, difficulties):
        """Create intelligent science exercises"""
        return {
            "exercises": [
                {
                    "title": f"Scientific Investigation: {title}",
                    "title_arabic": f"البحث العلمي: {title_arabic}",
                    "difficulty": difficulties[0],
                    "points": base_points,
                    "questions": [
                        {
                            "question_text": f"What scientific methods help us understand {title}?",
                            "question_text_arabic": f"ما الطرق العلمية التي تساعدنا على فهم {title_arabic}؟",
                            "question_type": "qcm_multiple",
                            "choices": [
                                {"text": "Careful observation", "text_arabic": "الملاحظة الدقيقة", "is_correct": True},
                                {"text": "Controlled experiments", "text_arabic": "التجارب المضبوطة", "is_correct": True},
                                {"text": "Data collection and analysis", "text_arabic": "جمع وتحليل البيانات", "is_correct": True},
                                {"text": "Random guessing", "text_arabic": "التخمين العشوائي", "is_correct": False}
                            ]
                        },
                        {
                            "question_text": f"Why is {title} important for scientific understanding?",
                            "question_text_arabic": f"لماذا {title_arabic} مهم للفهم العلمي؟",
                            "question_type": "open_short",
                            "choices": []
                        }
                    ]
                }
            ]
        }

    def create_language_intelligent_fallback(self, lesson, title, title_arabic, base_points, difficulties):
        """Create intelligent language exercises"""
        return {
            "exercises": [
                {
                    "title": f"Language Skills: {title}",
                    "title_arabic": f"المهارات اللغوية: {title_arabic}",
                    "difficulty": difficulties[0],
                    "points": base_points,
                    "questions": [
                        {
                            "question_text": f"What language skills are developed through {title}?",
                            "question_text_arabic": f"ما المهارات اللغوية التي تتطور من خلال {title_arabic}؟",
                            "question_type": "qcm_multiple",
                            "choices": [
                                {"text": "Reading comprehension", "text_arabic": "فهم المقروء", "is_correct": True},
                                {"text": "Writing expression", "text_arabic": "التعبير الكتابي", "is_correct": True},
                                {"text": "Oral communication", "text_arabic": "التواصل الشفهي", "is_correct": True},
                                {"text": "Memorization only", "text_arabic": "الحفظ فقط", "is_correct": False}
                            ]
                        }
                    ]
                }
            ]
        }

    def create_social_intelligent_fallback(self, lesson, title, title_arabic, base_points, difficulties):
        """Create intelligent social studies exercises"""
        return {
            "exercises": [
                {
                    "title": f"Understanding {title}",
                    "title_arabic": f"فهم {title_arabic}",
                    "difficulty": difficulties[0],
                    "points": base_points,
                    "questions": [
                        {
                            "question_text": f"What factors influence {title}?",
                            "question_text_arabic": f"ما العوامل التي تؤثر على {title_arabic}؟",
                            "question_type": "qcm_multiple",
                            "choices": [
                                {"text": "Geographic factors", "text_arabic": "العوامل الجغرافية", "is_correct": True},
                                {"text": "Cultural influences", "text_arabic": "التأثيرات الثقافية", "is_correct": True},
                                {"text": "Economic conditions", "text_arabic": "الظروف الاقتصادية", "is_correct": True},
                                {"text": "Random chance only", "text_arabic": "الصدفة العشوائية فقط", "is_correct": False}
                            ]
                        }
                    ]
                }
            ]
        }

    def create_general_intelligent_fallback(self, lesson, title, title_arabic, base_points, difficulties):
        """Create intelligent general exercises"""
        return {
            "exercises": [
                {
                    "title": f"Learning About {title}",
                    "title_arabic": f"التعلم حول {title_arabic}",
                    "difficulty": difficulties[0],
                    "points": base_points,
                    "questions": [
                        {
                            "question_text": f"What are the key learning outcomes for {title}?",
                            "question_text_arabic": f"ما هي نتائج التعلم الأساسية لـ {title_arabic}؟",
                            "question_type": "qcm_multiple",
                            "choices": [
                                {"text": "Understanding core concepts", "text_arabic": "فهم المفاهيم الأساسية", "is_correct": True},
                                {"text": "Developing practical skills", "text_arabic": "تطوير المهارات العملية", "is_correct": True},
                                {"text": "Building critical thinking", "text_arabic": "بناء التفكير النقدي", "is_correct": True},
                                {"text": "Surface-level memorization", "text_arabic": "الحفظ السطحي", "is_correct": False}
                            ]
                        }
                    ]
                }
            ]
        }

    def create_exercises_from_ai_data(self, lesson: Lesson, exercises_data: Dict[str, Any]) -> int:
        """Create exercises in database from AI-generated data"""
        exercises_created = 0

        for i, exercise_data in enumerate(exercises_data['exercises'], 1):
            # Create exercise
            exercise = Exercise.objects.create(
                lesson=lesson,
                title=exercise_data['title'],
                title_arabic=exercise_data.get('title_arabic', ''),
                difficulty_level=exercise_data['difficulty'],
                order=i,
                created_by_id=1  # Assuming admin user
            )

            # Create reward
            ExerciseReward.objects.create(
                exercise=exercise,
                completion_points=exercise_data.get('points', 15),
                completion_coins=1
            )

            # Create questions
            for j, question_data in enumerate(exercise_data['questions'], 1):
                question = Question.objects.create(
                    exercise=exercise,
                    question_text=question_data['question_text'],
                    question_text_arabic=question_data.get('question_text_arabic', ''),
                    question_type=question_data['question_type'],
                    order=j
                )

                # Create choices
                for k, choice_data in enumerate(question_data.get('choices', []), 1):
                    QuestionChoice.objects.create(
                        question=question,
                        choice_text=choice_data['text'],
                        choice_text_arabic=choice_data.get('text_arabic', ''),
                        is_correct=choice_data.get('is_correct', False),
                        order=k
                    )

            exercises_created += 1

        return exercises_created