from django.core.management.base import BaseCommand
from lessons.models import Lesson
import requests
import json
import time
import os

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

class Command(BaseCommand):
    help = 'Compare different AI models for educational exercise generation quality'

    def add_arguments(self, parser):
        parser.add_argument('--lesson-id', type=int, default=None, help='Specific lesson ID to test')
        parser.add_argument('--gemini-key', type=str, help='Gemini API key')
        parser.add_argument('--ollama-url', type=str, default='http://localhost:11434', help='Ollama server URL')

    def handle(self, *args, **options):
        self.stdout.write("🔬 AI MODEL COMPARISON FOR EDUCATIONAL CONTENT")
        self.stdout.write("=" * 60)

        # Get a test lesson
        if options['lesson_id']:
            lesson = Lesson.objects.filter(id=options['lesson_id']).first()
        else:
            lesson = Lesson.objects.filter(exercises__isnull=True).first()

        if not lesson:
            self.stdout.write(self.style.ERROR("No suitable lesson found for testing"))
            return

        self.stdout.write(f"📚 Testing with Lesson: {lesson.title}")
        self.stdout.write(f"📖 Subject: {lesson.subject.name}")
        self.stdout.write(f"🎓 Grade: {lesson.grade.name}")
        self.stdout.write("-" * 60)

        # Test Google Gemini
        if GEMINI_AVAILABLE and (options['gemini_key'] or os.getenv('GEMINI_API_KEY')):
            self.stdout.write("🤖 Testing Google Gemini...")
            gemini_result = self.test_gemini(lesson, options['gemini_key'])
            self.display_result("Google Gemini 1.5 Flash", gemini_result)
        else:
            self.stdout.write("⚠️  Gemini not available (missing API key or library)")

        # Test Ollama models
        ollama_models = ['qwen2.5:7b', 'llama3.1:8b', 'phi3:medium']

        for model in ollama_models:
            if self.check_ollama_model(options['ollama_url'], model):
                self.stdout.write(f"🤖 Testing Ollama {model}...")
                ollama_result = self.test_ollama(lesson, model, options['ollama_url'])
                self.display_result(f"Ollama {model}", ollama_result)
            else:
                self.stdout.write(f"⚠️  Ollama {model} not available")

        # Final recommendation
        self.stdout.write("\n" + "🏆 RECOMMENDATION FOR YOUR PROJECT:")
        self.stdout.write("=" * 60)
        if GEMINI_AVAILABLE and (options['gemini_key'] or os.getenv('GEMINI_API_KEY')):
            self.stdout.write("🥇 Use Google Gemini for best educational content quality")
            self.stdout.write("   - Superior Arabic translations")
            self.stdout.write("   - Better subject awareness")
            self.stdout.write("   - More consistent results")
        else:
            self.stdout.write("🥇 Use Ollama with qwen2.5:7b for best local results")
            self.stdout.write("   - Excellent Arabic support")
            self.stdout.write("   - Good educational content")
            self.stdout.write("   - 100% offline and free")

    def test_gemini(self, lesson, api_key):
        """Test Google Gemini"""
        try:
            genai.configure(api_key=api_key or os.getenv('GEMINI_API_KEY'))
            model = genai.GenerativeModel('gemini-1.5-flash')

            prompt = f"""Create one high-quality educational exercise for this lesson:
Title: {lesson.title}
Subject: {lesson.subject.name}
Grade: {lesson.grade.name}

Respond with JSON:
{{
  "title": "Exercise title",
  "title_arabic": "عنوان التمرين",
  "questions": [
    {{
      "question_text": "Question in English?",
      "question_text_arabic": "السؤال بالعربية؟",
      "question_type": "qcm_single",
      "choices": [
        {{"text": "Option 1", "text_arabic": "الخيار 1", "is_correct": true}},
        {{"text": "Option 2", "text_arabic": "الخيار 2", "is_correct": false}}
      ]
    }}
  ]
}}"""

            response = model.generate_content(prompt)
            result = response.text

            # Parse quality metrics
            return self.analyze_result_quality(result, "gemini")

        except Exception as e:
            return {"error": str(e), "quality_score": 0}

    def test_ollama(self, lesson, model, ollama_url):
        """Test Ollama model"""
        try:
            prompt = f"""Create one educational exercise for this lesson:
Title: {lesson.title}
Subject: {lesson.subject.name}
Grade: {lesson.grade.name}

Respond with only valid JSON:
{{
  "title": "Exercise title",
  "title_arabic": "عنوان التمرين",
  "questions": [
    {{
      "question_text": "Question in English?",
      "question_text_arabic": "السؤال بالعربية؟",
      "question_type": "qcm_single",
      "choices": [
        {{"text": "Option 1", "text_arabic": "الخيار 1", "is_correct": true}},
        {{"text": "Option 2", "text_arabic": "الخيار 2", "is_correct": false}}
      ]
    }}
  ]
}}"""

            response = requests.post(f"{ollama_url}/api/generate", json={
                "model": model,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.7}
            }, timeout=60)

            if response.status_code == 200:
                result = response.json().get('response', '')
                return self.analyze_result_quality(result, "ollama")
            else:
                return {"error": f"HTTP {response.status_code}", "quality_score": 0}

        except Exception as e:
            return {"error": str(e), "quality_score": 0}

    def analyze_result_quality(self, result, model_type):
        """Analyze the quality of generated content"""
        metrics = {
            "has_json": False,
            "has_arabic": False,
            "has_educational_content": False,
            "is_parseable": False,
            "content_length": len(result),
            "quality_score": 0
        }

        try:
            # Check if response contains JSON
            if '{' in result and '}' in result:
                metrics["has_json"] = True

            # Check for Arabic content
            if any(ord(char) > 1500 for char in result):  # Arabic Unicode range
                metrics["has_arabic"] = True

            # Check for educational keywords
            educational_words = ['question', 'exercise', 'learning', 'student', 'education']
            if any(word in result.lower() for word in educational_words):
                metrics["has_educational_content"] = True

            # Try to parse JSON
            json_start = result.find('{')
            json_end = result.rfind('}') + 1
            if json_start >= 0 and json_end > json_start:
                json_content = result[json_start:json_end]
                parsed = json.loads(json_content)
                if 'title' in parsed or 'questions' in parsed:
                    metrics["is_parseable"] = True

            # Calculate quality score
            score = 0
            if metrics["has_json"]: score += 25
            if metrics["has_arabic"]: score += 25
            if metrics["has_educational_content"]: score += 25
            if metrics["is_parseable"]: score += 25

            metrics["quality_score"] = score
            metrics["raw_result"] = result[:500] + "..." if len(result) > 500 else result

        except Exception as e:
            metrics["parse_error"] = str(e)

        return metrics

    def check_ollama_model(self, ollama_url, model):
        """Check if Ollama model is available"""
        try:
            response = requests.get(f"{ollama_url}/api/tags", timeout=5)
            if response.status_code == 200:
                models = response.json().get('models', [])
                return any(model in m.get('name', '') for m in models)
        except:
            pass
        return False

    def display_result(self, model_name, result):
        """Display test results"""
        self.stdout.write(f"\n📊 Results for {model_name}:")

        if "error" in result:
            self.stdout.write(self.style.ERROR(f"   ❌ Error: {result['error']}"))
            return

        score = result.get('quality_score', 0)

        # Score interpretation
        if score >= 75:
            score_color = self.style.SUCCESS
            rating = "⭐⭐⭐⭐⭐ Excellent"
        elif score >= 50:
            score_color = self.style.WARNING
            rating = "⭐⭐⭐⭐ Good"
        elif score >= 25:
            score_color = self.style.WARNING
            rating = "⭐⭐⭐ Fair"
        else:
            score_color = self.style.ERROR
            rating = "⭐⭐ Poor"

        self.stdout.write(f"   {score_color(f'Quality Score: {score}/100')} - {rating}")
        self.stdout.write(f"   ✓ JSON Format: {'Yes' if result.get('has_json') else 'No'}")
        self.stdout.write(f"   ✓ Arabic Content: {'Yes' if result.get('has_arabic') else 'No'}")
        self.stdout.write(f"   ✓ Educational Content: {'Yes' if result.get('has_educational_content') else 'No'}")
        self.stdout.write(f"   ✓ Parseable Output: {'Yes' if result.get('is_parseable') else 'No'}")

        if result.get('raw_result') and len(result['raw_result']) > 10:
            self.stdout.write(f"   📝 Sample Output:")
            sample = result['raw_result'][:200] + "..." if len(result['raw_result']) > 200 else result['raw_result']
            self.stdout.write(f"       {sample}")

        self.stdout.write("-" * 40)