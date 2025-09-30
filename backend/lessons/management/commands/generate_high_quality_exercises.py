from django.core.management.base import BaseCommand
from django.db import transaction
from django.conf import settings
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward
from schools.models import Subject, Grade
import openai
import json
import time
import logging
import os
from typing import Dict, List, Any

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Generate high-quality exercises using AI for all remaining lessons'

    def add_arguments(self, parser):
        parser.add_argument('--api-key', type=str, help='OpenAI API key (or set OPENAI_API_KEY env var)')
        parser.add_argument('--model', type=str, default='gpt-4', help='OpenAI model to use')
        parser.add_argument('--batch-size', type=int, default=10, help='Number of lessons to process in each batch')
        parser.add_argument('--start-id', type=int, help='Start from specific lesson ID')
        parser.add_argument('--end-id', type=int, help='End at specific lesson ID')
        parser.add_argument('--subject', type=str, help='Filter by subject name')
        parser.add_argument('--grade', type=str, help='Filter by grade name')
        parser.add_argument('--dry-run', action='store_true', help='Generate sample without saving to database')
        parser.add_argument('--verbose', action='store_true', help='Show detailed progress')
        parser.add_argument('--delay', type=float, default=1.0, help='Delay between API calls in seconds')

    def handle(self, *args, **options):
        # Initialize OpenAI
        api_key = options['api_key'] or os.getenv('OPENAI_API_KEY')
        if not api_key:
            self.stdout.write(
                self.style.ERROR('OpenAI API key required. Set --api-key or OPENAI_API_KEY environment variable')
            )
            return

        openai.api_key = api_key

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
            self.stdout.write(f"DRY RUN: Testing with first lesson...")
            lesson = queryset.first()
            if lesson:
                sample_exercises = self.generate_ai_exercises(lesson, options['model'], options['delay'])
                self.stdout.write(json.dumps(sample_exercises, indent=2, ensure_ascii=False))
            return

        self.stdout.write(f"Generating high-quality exercises for {total_lessons} lessons")
        self.stdout.write(f"Using model: {options['model']}")

        processed = 0
        errors = 0

        # Process in batches
        batch_size = options['batch_size']
        for batch_start in range(0, total_lessons, batch_size):
            batch_lessons = queryset[batch_start:batch_start + batch_size]

            for lesson in batch_lessons:
                try:
                    if options['verbose']:
                        self.stdout.write(f"Processing: {lesson.id} - {lesson.title[:50]}...")

                    # Generate high-quality exercises using AI
                    ai_exercises = self.generate_ai_exercises(lesson, options['model'], options['delay'])

                    # Create exercises in database
                    with transaction.atomic():
                        self.create_exercises_from_ai_data(lesson, ai_exercises)

                    processed += 1

                    # Add delay to respect API limits
                    if options['delay'] > 0:
                        time.sleep(options['delay'])

                except Exception as e:
                    errors += 1
                    logger.error(f"Error processing lesson {lesson.id}: {str(e)}")
                    if options['verbose']:
                        self.stdout.write(self.style.ERROR(f"Error in lesson {lesson.id}: {str(e)}"))

            # Progress update
            self.stdout.write(f"Progress: {processed}/{total_lessons} lessons processed, {errors} errors")

        self.stdout.write(
            self.style.SUCCESS(
                f'Completed! Processed {processed} lessons with high-quality AI-generated exercises, {errors} errors'
            )
        )

    def generate_ai_exercises(self, lesson: Lesson, model: str, delay: float) -> Dict[str, Any]:
        """Generate high-quality exercises using OpenAI API"""

        # Create comprehensive context about the lesson
        context = self.build_lesson_context(lesson)

        # Generate exercises using AI
        prompt = self.create_exercise_generation_prompt(lesson, context)

        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=[
                    {"role": "system", "content": self.get_system_prompt()},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=3000,
                temperature=0.7
            )

            # Parse AI response
            ai_content = response.choices[0].message.content
            exercises_data = self.parse_ai_response(ai_content, lesson)

            return exercises_data

        except Exception as e:
            logger.error(f"AI generation failed for lesson {lesson.id}: {str(e)}")
            # Fallback to high-quality template
            return self.create_fallback_exercises(lesson)

    def get_system_prompt(self) -> str:
        """System prompt that defines the AI's role as an educational content creator"""
        return """You are an expert educational content creator for the Madrasti platform, a Moroccan school management system. Your task is to create high-quality, pedagogically sound exercises for lessons across different subjects and grade levels.

Requirements:
1. Create 3-5 exercises per lesson with progressive difficulty (beginner → intermediate → advanced)
2. Each exercise should have 4-6 questions with varied types (multiple choice single, multiple choice multiple, true/false, short answer)
3. Questions must be educationally relevant and age-appropriate for the specified grade level
4. Include both English and Arabic versions of all content
5. Arabic translations should use proper educational terminology, not literal translations
6. Multiple choice questions should have 4 options with clear correct/incorrect answers
7. Include realistic distractors (wrong answers that seem plausible)
8. Short answer questions should test understanding and application

Respond in valid JSON format with this structure:
{
  "exercises": [
    {
      "title": "Exercise title in English",
      "title_arabic": "Exercise title in Arabic",
      "difficulty": "beginner|intermediate|advanced",
      "points": 10-25,
      "questions": [
        {
          "question_text": "Question in English",
          "question_text_arabic": "Question in Arabic",
          "question_type": "qcm_single|qcm_multiple|true_false|open_short",
          "choices": [
            {"text": "Choice in English", "text_arabic": "Choice in Arabic", "is_correct": true/false}
          ]
        }
      ]
    }
  ]
}

For open_short questions, use empty choices array.
Focus on deep understanding rather than memorization."""

    def build_lesson_context(self, lesson: Lesson) -> Dict[str, str]:
        """Build comprehensive context about the lesson for AI"""

        # Educational level classification
        grade_level = self.classify_educational_level(lesson.grade.name)

        # Subject specialization
        subject_context = self.get_subject_context(lesson.subject.name)

        return {
            'lesson_title': lesson.title,
            'lesson_title_arabic': lesson.title_arabic or '',
            'subject': lesson.subject.name,
            'grade': lesson.grade.name,
            'grade_level': grade_level,
            'subject_context': subject_context,
            'cycle': lesson.cycle if hasattr(lesson, 'cycle') else 'unknown',
        }

    def classify_educational_level(self, grade_name: str) -> str:
        """Classify the educational level for age-appropriate content"""
        grade_lower = grade_name.lower()

        if any(term in grade_lower for term in ['cp', 'ce1', 'ce2', 'cm1', 'cm2', 'primary', 'first year primary', 'second year primary']):
            return 'primary'
        elif any(term in grade_lower for term in ['1ac', '2ac', '3ac', 'middle', 'college']):
            return 'middle_school'
        elif any(term in grade_lower for term in ['1b', '2b', 'tc', 'terminal', 'baccalaureate', 'high']):
            return 'high_school'
        else:
            return 'general'

    def get_subject_context(self, subject_name: str) -> str:
        """Provide context about the subject for better content generation"""
        subject_contexts = {
            'mathematics': 'Focus on problem-solving, logical reasoning, and mathematical concepts. Include calculations, proofs, and real-world applications.',
            'physics': 'Emphasize scientific concepts, natural phenomena, experiments, and mathematical relationships. Include practical applications.',
            'chemistry': 'Cover chemical reactions, properties of matter, molecular structures, and laboratory practices. Include safety considerations.',
            'biology': 'Focus on living organisms, biological processes, ecosystems, and health. Include environmental connections.',
            'arabic': 'Develop reading, writing, speaking, and listening skills. Include grammar, vocabulary, literature, and cultural context.',
            'french': 'Build French language proficiency through grammar, vocabulary, reading comprehension, and communication skills.',
            'english': 'Enhance English language abilities including grammar, vocabulary, reading, writing, and conversation.',
            'geography': 'Explore places, environments, human-environment interactions, and spatial relationships.',
            'history': 'Study past events, historical analysis, cause and effect, and historical thinking skills.',
            'islamic': 'Focus on Islamic teachings, values, practices, and their application in daily life.',
            'science': 'General scientific inquiry, observation, experimentation, and understanding of natural world.',
        }

        # Find matching context
        subject_lower = subject_name.lower()
        for key, context in subject_contexts.items():
            if key in subject_lower:
                return context

        return 'Focus on core concepts, practical understanding, and skill development appropriate for the subject area.'

    def create_exercise_generation_prompt(self, lesson: Lesson, context: Dict[str, str]) -> str:
        """Create a detailed prompt for AI exercise generation"""

        return f"""Create high-quality educational exercises for the following lesson:

LESSON INFORMATION:
- Title: {context['lesson_title']}
- Arabic Title: {context['lesson_title_arabic']}
- Subject: {context['subject']}
- Grade Level: {context['grade']} ({context['grade_level']})

SUBJECT CONTEXT:
{context['subject_context']}

REQUIREMENTS FOR THIS LESSON:
1. Create 3-4 exercises with progressive difficulty
2. First exercise: Basic understanding and vocabulary (beginner level)
3. Middle exercises: Application and analysis (intermediate level)
4. Final exercise: Synthesis and evaluation (advanced level)
5. Each exercise should have 4-6 questions
6. Mix question types appropriately for the subject and grade level
7. For {context['grade_level']} level, ensure content is age-appropriate
8. Arabic translations should use proper educational terminology from Moroccan curriculum

SPECIFIC FOCUS AREAS for "{context['lesson_title']}":
- Core concepts and definitions
- Practical applications and examples
- Problem-solving strategies
- Real-world connections
- Critical thinking and analysis

Generate exercises that would help students master this lesson content effectively."""

    def parse_ai_response(self, ai_content: str, lesson: Lesson) -> Dict[str, Any]:
        """Parse and validate AI response"""
        try:
            # Clean up the response (remove markdown code blocks if present)
            cleaned_content = ai_content.strip()
            if cleaned_content.startswith('```json'):
                cleaned_content = cleaned_content[7:]
            if cleaned_content.endswith('```'):
                cleaned_content = cleaned_content[:-3]

            # Parse JSON
            exercises_data = json.loads(cleaned_content)

            # Validate structure
            if 'exercises' not in exercises_data:
                raise ValueError("Missing 'exercises' key in AI response")

            # Validate each exercise
            for exercise in exercises_data['exercises']:
                self.validate_exercise_structure(exercise)

            return exercises_data

        except (json.JSONDecodeError, ValueError) as e:
            logger.error(f"Failed to parse AI response for lesson {lesson.id}: {str(e)}")
            # Return fallback
            return self.create_fallback_exercises(lesson)

    def validate_exercise_structure(self, exercise: Dict[str, Any]) -> None:
        """Validate exercise structure"""
        required_fields = ['title', 'title_arabic', 'difficulty', 'points', 'questions']
        for field in required_fields:
            if field not in exercise:
                raise ValueError(f"Missing required field: {field}")

        # Validate questions
        for question in exercise['questions']:
            required_q_fields = ['question_text', 'question_text_arabic', 'question_type']
            for field in required_q_fields:
                if field not in question:
                    raise ValueError(f"Missing required question field: {field}")

    def create_fallback_exercises(self, lesson: Lesson) -> Dict[str, Any]:
        """Create high-quality fallback exercises when AI fails"""
        # This is a more sophisticated template system than the bulk generator
        subject_name = lesson.subject.name.lower()

        if 'math' in subject_name:
            return self.create_math_fallback(lesson)
        elif any(term in subject_name for term in ['physics', 'chemistry', 'biology', 'science']):
            return self.create_science_fallback(lesson)
        elif any(term in subject_name for term in ['arabic', 'french', 'english']):
            return self.create_language_fallback(lesson)
        else:
            return self.create_general_fallback(lesson)

    def create_math_fallback(self, lesson: Lesson) -> Dict[str, Any]:
        """High-quality math exercise fallback"""
        return {
            "exercises": [
                {
                    "title": f"Fundamental Concepts: {lesson.title}",
                    "title_arabic": f"المفاهيم الأساسية: {lesson.title_arabic or lesson.title}",
                    "difficulty": "beginner",
                    "points": 15,
                    "questions": [
                        {
                            "question_text": f"What is the mathematical definition of {lesson.title}?",
                            "question_text_arabic": f"ما هو التعريف الرياضي لـ {lesson.title_arabic or lesson.title}؟",
                            "question_type": "qcm_single",
                            "choices": [
                                {"text": f"The mathematical concept that describes {lesson.title}", "text_arabic": f"المفهوم الرياضي الذي يصف {lesson.title_arabic or lesson.title}", "is_correct": True},
                                {"text": "A purely theoretical construct", "text_arabic": "تركيب نظري محض", "is_correct": False},
                                {"text": "An advanced calculus operation", "text_arabic": "عملية تفاضل متقدمة", "is_correct": False},
                                {"text": "A basic arithmetic function", "text_arabic": "دالة حسابية أساسية", "is_correct": False}
                            ]
                        }
                    ]
                }
            ]
        }

    def create_science_fallback(self, lesson: Lesson) -> Dict[str, Any]:
        """High-quality science exercise fallback"""
        return {
            "exercises": [
                {
                    "title": f"Scientific Understanding: {lesson.title}",
                    "title_arabic": f"الفهم العلمي: {lesson.title_arabic or lesson.title}",
                    "difficulty": "intermediate",
                    "points": 18,
                    "questions": [
                        {
                            "question_text": f"What scientific principles are involved in {lesson.title}?",
                            "question_text_arabic": f"ما المبادئ العلمية المتضمنة في {lesson.title_arabic or lesson.title}؟",
                            "question_type": "qcm_multiple",
                            "choices": [
                                {"text": "Observation and measurement", "text_arabic": "الملاحظة والقياس", "is_correct": True},
                                {"text": "Hypothesis formation", "text_arabic": "تكوين الفرضيات", "is_correct": True},
                                {"text": "Experimental verification", "text_arabic": "التحقق التجريبي", "is_correct": True},
                                {"text": "Pure speculation", "text_arabic": "التخمين المحض", "is_correct": False}
                            ]
                        }
                    ]
                }
            ]
        }

    def create_language_fallback(self, lesson: Lesson) -> Dict[str, Any]:
        """High-quality language exercise fallback"""
        return {
            "exercises": [
                {
                    "title": f"Language Skills: {lesson.title}",
                    "title_arabic": f"المهارات اللغوية: {lesson.title_arabic or lesson.title}",
                    "difficulty": "beginner",
                    "points": 12,
                    "questions": [
                        {
                            "question_text": f"How does {lesson.title} contribute to language development?",
                            "question_text_arabic": f"كيف يساهم {lesson.title_arabic or lesson.title} في تطوير اللغة؟",
                            "question_type": "open_short",
                            "choices": []
                        }
                    ]
                }
            ]
        }

    def create_general_fallback(self, lesson: Lesson) -> Dict[str, Any]:
        """High-quality general exercise fallback"""
        return {
            "exercises": [
                {
                    "title": f"Understanding {lesson.title}",
                    "title_arabic": f"فهم {lesson.title_arabic or lesson.title}",
                    "difficulty": "intermediate",
                    "points": 15,
                    "questions": [
                        {
                            "question_text": f"What are the key learning objectives for {lesson.title}?",
                            "question_text_arabic": f"ما هي الأهداف التعليمية الأساسية لـ {lesson.title_arabic or lesson.title}؟",
                            "question_type": "qcm_multiple",
                            "choices": [
                                {"text": "Understanding core concepts", "text_arabic": "فهم المفاهيم الأساسية", "is_correct": True},
                                {"text": "Developing practical skills", "text_arabic": "تطوير المهارات العملية", "is_correct": True},
                                {"text": "Building critical thinking", "text_arabic": "بناء التفكير النقدي", "is_correct": True},
                                {"text": "Memorizing facts only", "text_arabic": "حفظ الحقائق فقط", "is_correct": False}
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