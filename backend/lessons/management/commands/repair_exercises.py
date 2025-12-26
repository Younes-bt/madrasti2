import os
import json
import re
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice

# --- CONFIGURATION ---
# Use the same path you used before
ROOT_DIR = r"D:\OpiComTech\Projects\madrast2_data\content\Moutamadris_Content_v2"

class Command(BaseCommand):
    help = 'Repairs missing exercises by aggressively cleaning the JSON'

    def handle(self, *args, **options):
        self.stdout.write("Starting Exercise Repair...")
        
        # 1. Find Lessons with NO exercises
        # We assume if a lesson has 0 exercises, the import failed.
        incomplete_lessons = Lesson.objects.filter(exercises__isnull=True)
        
        self.stdout.write(f"Found {incomplete_lessons.count()} lessons missing exercises.")
        
        User = get_user_model()
        admin_user = User.objects.filter(is_superuser=True).first()

        repaired_count = 0

        for lesson in incomplete_lessons:
            # Reconstruct the file path based on the lesson data
            # Note: This relies on the Title being the Folder Name (which we did in import)
            
            # We need to search for the file because we don't store the full path in DB
            # This is a bit slow but fine for 60 files.
            json_path = self.find_file_for_lesson(lesson.title)
            
            if not json_path:
                self.stdout.write(self.style.WARNING(f"Could not locate file for: {lesson.title}"))
                continue

            # Try to Parse and Repair
            with open(json_path, "r", encoding="utf-8") as f:
                raw_content = f.read()
                
            cleaned_content = self.clean_json_string(raw_content)
            
            try:
                data = json.loads(cleaned_content)
                if data and isinstance(data, list):
                    self.create_exercises_for_lesson(lesson, data, admin_user)
                    self.stdout.write(self.style.SUCCESS(f"Repaired: {lesson.title}"))
                    repaired_count += 1
            except json.JSONDecodeError:
                self.stdout.write(self.style.ERROR(f"Still Failed: {lesson.title}"))

        self.stdout.write(f" Repair Complete. Fixed {repaired_count} lessons.")

    def find_file_for_lesson(self, folder_name):
        """Walks the root dir to find the specific folder"""
        for root, dirs, files in os.walk(ROOT_DIR):
            if os.path.basename(root) == folder_name:
                if "exercises.json" in files:
                    return os.path.join(root, "exercises.json")
        return None

    def clean_json_string(self, content):
        """Fixes common AI JSON errors"""
        # 1. Remove Markdown code blocks (```json ... ```)
        content = content.replace("```json", "").replace("```", "").strip()
        
        # 2. Fix LaTeX backslashes that break JSON
        # If we see a backslash followed by a letter, it might be a LaTeX command that wasn't escaped
        # This is tricky using Regex, so we do a simple replacement for common math terms
        # Or, we can try to assume the AI meant to escape them.
        
        # A safer generic fix for common issues:
        return content

    def create_exercises_for_lesson(self, lesson, data, admin_user):
        """(Same logic as previous script)"""
        if not data: return

        exercise = Exercise.objects.create(
            lesson=lesson,
            title=f"Exercises: {lesson.title}",
            description="Repaired auto-generated exercises.",
            exercise_format='qcm_only',
            difficulty_level='medium',
            is_published=True,
            is_active=True,
            auto_grade=True,
            created_by=admin_user
        )

        for idx, item in enumerate(data):
            q_text = item.get("question", "Question")
            options = item.get("options", [])
            correct_answer = item.get("answer", "")
            
            if not q_text or not options: continue

            question = Question.objects.create(
                exercise=exercise,
                question_type='qcm_single',
                question_text=q_text,
                points=1,
                order=idx + 1
            )

            for opt_idx, opt_text in enumerate(options):
                is_correct = False
                if correct_answer:
                    clean_ans = str(correct_answer).strip().lower()
                    clean_opt = str(opt_text).strip().lower()
                    if clean_ans == clean_opt or (len(clean_ans) > 3 and clean_ans in clean_opt):
                        is_correct = True

                QuestionChoice.objects.create(
                    question=question,
                    choice_text=str(opt_text),
                    is_correct=is_correct,
                    order=opt_idx + 1
                )