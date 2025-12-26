import os
import json
from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model
from schools.models import Grade, Subject
from lessons.models import Lesson, LessonResource
from homework.models import Exercise, Question, QuestionChoice

# --- CONFIGURATION ---
ROOT_DIR = r"D:\OpiComTech\Projects\madrast2_data\content\Moutamadris_Content_v2"

# --- GRADE MAPPING (Folder Name -> DB ID) ---
GRADE_MAP = {
    "الأولى اعدادي": 1,
    "الثانية اعدادي": 2,
    "الأول ابتدائي": 3,
    "الثاني ابتدائي": 4,
    "الثالث ابتدائي": 5,
    "الرابع ابتدائي": 6,
    "الخامس ابتدائي": 7,
    "السادس ابتدائي": 8,
    "الثالثة اعدادي": 9,
    "الجذع مشترك": 10,
    "اولى باك": 11,
    "الثانية باك": 12,
}

# --- SUBJECT MAPPING (Folder Name -> DB ID) ---
# We map Arabic Folder Names to the English Subject IDs from your DB report.
SUBJECT_MAP = {
    # Math
    "الرياضيات": 7,
    "الرياضيات – اداب": 7,
    "الرياضيات – خيار فرنسية": 7,
    "الرياضيات – خيار فرنسية علوم الحياة والارض": 7,
    "الرياضيات – خيار فرنسية علوم تجريبية": 7,
    "الرياضيات – خيار فرنسية علوم رياضية": 7,
    "الرياضيات – خيار فرنسية علوم فيزيائية": 7,

    # Physics/Chem
    "الفيزياء والكيمياء": 8,
    "الفيزياء والكيمياء – خيار فرنسية": 8,
    "الفيزياء والكيمياء – خيار فرنسية علوم الحياة والارض": 8,
    "الفيزياء والكيمياء – خيار فرنسية علوم تجريبية": 8,
    "الفيزياء والكيمياء – خيار فرنسية علوم رياضية": 8,
    "الفيزياء والكيمياء – خيار فرنسية علوم فيزيائية": 8,

    # SVT (Biology)
    "علوم الحياة والارض": 10,
    "علوم الحياة والارض – اداب": 10,
    "علوم الحياة والارض – خيار فرنسية": 10,
    "علوم الحياة والارض – خيار فرنسية علوم الحياة والارض": 10,
    "علوم الحياة والارض – خيار فرنسية علوم تجريبية": 10,
    "علوم الحياة والارض – خيار فرنسية علوم رياضية": 10,
    "علوم الحياة والارض – خيار فرنسية علوم فيزيائية": 10,
    "النشاط العلمي": 35, # Scientific Activity

    # Languages
    "اللغة العربية": 4,
    "اللغة العربية – اداب": 4,
    "اللغة الفرنسية": 5,
    "اللغة الانجليزية": 6,

    # Humanities / Social Studies
    "الفلسفة": 11,
    "التاريخ والجغرافيا": 36,
    "التاريخ و الجغرافيا": 36,
    "الاجتماعيات": 36,
    "التربية الإسلامية": 15,
    "التربية الاسلامية": 15,
    "الفقه والاصول": 15, # Mapping to Islamic Education
    "القانون": 14, # Civics

    # Technology / Engineering
    "التكنولوجيا الصناعية": 23,
    "علوم المهندس": 27, # Mechanical Engineering
    "المعلوميات": 25, # IT
    "معلوميات التدبير": 25, # IT Management

    # Economics / Management
    "الإقتصاد العام والإحصاء": 16,
    "الاقتصاد العام والإحصاء": 16,
    "الإقتصاد والتنظيم الاداري للمقاولات": 18,
    "الاقتصاد والتنظيم الاداري للمقاولات": 18,
    "المحاسبة والرياضيات المالية": 17,
}

class Command(BaseCommand):
    help = 'Imports lessons from the generated content folders into the database'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Starting Fresh Import Process..."))
        
        # 0. Check Root Directory
        if not os.path.exists(ROOT_DIR):
            self.stdout.write(self.style.ERROR(f"Directory '{ROOT_DIR}' not found. Place script next to folder."))
            return

        # 1. Get Admin User (To set as creator)
        User = get_user_model()
        admin_user = User.objects.filter(is_superuser=True).first()
        if not admin_user:
            self.stdout.write(self.style.ERROR("No Superuser found! Create one first (python manage.py createsuperuser)"))
            return
        
        self.stdout.write(f"Assigning content to user: {admin_user.email}")

        # 2. Wipe Old Data
        self.stdout.write("Wiping old Lesson, Exercise, and Question data...")
        # Note: Deleting Lessons cascades to Exercises/Questions usually, but we delete explicitly to be safe
        Exercise.objects.all().delete()
        Lesson.objects.all().delete()
        
        count_lessons = 0
        count_exercises = 0

        # 3. Main Loop
        for grade_folder in os.listdir(ROOT_DIR):
            grade_path = os.path.join(ROOT_DIR, grade_folder)
            if not os.path.isdir(grade_path): continue

            # Map Grade
            grade_id = GRADE_MAP.get(grade_folder.strip())
            if not grade_id:
                # self.stdout.write(f"Skipping unknown grade: {grade_folder}")
                continue
            
            try:
                grade_obj = Grade.objects.get(id=grade_id)
            except Grade.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"Grade ID {grade_id} missing in DB!"))
                continue

            # Process Subjects
            for subject_folder in os.listdir(grade_path):
                subj_path = os.path.join(grade_path, subject_folder)
                if not os.path.isdir(subj_path): continue

                # Map Subject
                clean_subj_name = subject_folder.strip()
                subject_id = SUBJECT_MAP.get(clean_subj_name)
                
                # If exact match fails, try splitting by dash (e.g., remove " - Option French")
                if not subject_id:
                    base_name = clean_subj_name.split('–')[0].split('-')[0].strip()
                    subject_id = SUBJECT_MAP.get(base_name)

                if not subject_id:
                    # self.stdout.write(f"Skipping unknown subject: {clean_subj_name}")
                    continue

                try:
                    subject_obj = Subject.objects.get(id=subject_id)
                except Subject.DoesNotExist:
                    continue

                # Process Lessons
                for lesson_folder in os.listdir(subj_path):
                    lesson_path = os.path.join(subj_path, lesson_folder)
                    if not os.path.isdir(lesson_path): continue

                    # Paths to generated files
                    md_file = os.path.join(lesson_path, "lesson.md")
                    json_file = os.path.join(lesson_path, "exercises.json")

                    if not os.path.exists(md_file):
                        continue

                    # --- DATABASE CREATION ---
                    try:
                        with transaction.atomic():
                            # 1. Create Lesson
                            # We use transaction.atomic so if exercises fail, the lesson isn't created half-baked
                            
                            # Read MD Content
                            with open(md_file, "r", encoding="utf-8") as f:
                                content = f.read()

                            lesson = Lesson.objects.create(
                                subject=subject_obj,
                                grade=grade_obj,
                                title=lesson_folder,
                                title_arabic=lesson_folder, # Use folder name as Arabic title
                                description=f"Imported lesson for {subject_obj.name}",
                                cycle='first', # Default
                                order=count_lessons + 1,
                                difficulty_level='medium',
                                is_active=True,
                                created_by=admin_user
                            )

                            # 2. Create Lesson Resource (The Summary)
                            LessonResource.objects.create(
                                lesson=lesson,
                                title="Lesson Summary (Mulakhas)",
                                resource_type='markdown',
                                markdown_content=content,
                                order=1,
                                is_visible_to_students=True,
                                uploaded_by=admin_user
                            )
                            
                            count_lessons += 1

                            # 3. Create Exercises (from JSON)
                            if os.path.exists(json_file):
                                with open(json_file, "r", encoding="utf-8") as f:
                                    try:
                                        exercises_data = json.load(f)
                                        if exercises_data and isinstance(exercises_data, list):
                                            self.create_exercises_for_lesson(lesson, exercises_data, admin_user)
                                            count_exercises += 1
                                    except json.JSONDecodeError:
                                        self.stdout.write(self.style.WARNING(f"Invalid JSON in: {lesson_folder}"))

                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f"Failed to import {lesson_folder}: {str(e)}"))

        self.stdout.write(self.style.SUCCESS(f"IMPORT COMPLETE."))
        self.stdout.write(f"Lessons Created: {count_lessons}")
        self.stdout.write(f"Exercise Sets Created: {count_exercises}")

    def create_exercises_for_lesson(self, lesson, data, admin_user):
        """
        Parses the JSON list from Gemini and creates:
        1. An 'Exercise' object
        2. Related 'Question' objects
        3. Related 'QuestionChoice' objects
        """
        if not data: return

        # Create one Exercise container
        exercise = Exercise.objects.create(
            lesson=lesson,
            title=f"Exercises: {lesson.title}",
            description="Auto-generated exercises from lesson content.",
            exercise_format='qcm_only',
            difficulty_level='medium',
            is_published=True,
            is_active=True,
            auto_grade=True,
            created_by=admin_user
        )

        for idx, item in enumerate(data):
            # Safe get for fields
            q_text = item.get("question", "Question Text Missing")
            options = item.get("options", [])
            correct_answer = item.get("answer", "")
            
            # Skip empty questions
            if not q_text or not options:
                continue

            # Create Question
            question = Question.objects.create(
                exercise=exercise,
                question_type='qcm_single', # Defaulting to Single Choice
                question_text=q_text,
                points=1,
                order=idx + 1
            )

            # Create Choices
            if isinstance(options, list):
                for opt_idx, opt_text in enumerate(options):
                    # Determine if this option is the correct one
                    # Logic: Exact match OR if the answer string is contained in the option
                    is_correct = False
                    if correct_answer:
                        clean_answer = str(correct_answer).strip().lower()
                        clean_opt = str(opt_text).strip().lower()
                        if clean_answer == clean_opt:
                            is_correct = True
                        elif clean_answer in clean_opt and len(clean_answer) > 3: 
                            # Fuzzy fallback: if "4" is answer and option is "4 apples"
                            is_correct = True

                    QuestionChoice.objects.create(
                        question=question,
                        choice_text=str(opt_text),
                        is_correct=is_correct,
                        order=opt_idx + 1
                    )