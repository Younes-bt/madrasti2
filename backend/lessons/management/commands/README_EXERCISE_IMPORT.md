# Exercise Import System - Team Guide

## 📋 Overview

This guide shows you how to create exercises for lessons using JSON files.

## 🚀 Quick Start

### Step 1: Copy the Django Management Command

Copy the `import_exercise_from_json.py` file to:
```
backend/homework/management/commands/import_exercise_from_json.py
```

Make sure the directories exist. Create them if needed:
```bash
cd backend/homework
mkdir -p management/commands
touch management/commands/__init__.py
```

### Step 2: Prepare Your JSON File

Use `exercise_example_simple.json` as a template. You need to specify:

**Option A: Use Lesson ID (Easiest)**
```json
{
  "lesson_info": {
    "lesson_id": 1753
  },
  ...
}
```

**Option B: Use Lesson Details (When you don't know the ID)**
```json
{
  "lesson_info": {
    "lesson_title": "Logic and Set Theory",
    "lesson_title_arabic": "المنطق ونظرية المجموعات",
    "grade_name": "2nd Year Baccalaureate",
    "subject_name": "Mathematics"
  },
  ...
}
```

### Step 3: Run the Import Command

```bash
# Navigate to backend directory
cd backend

# Run the import
python manage.py import_exercise_from_json path/to/your_exercise.json

# Example:
python manage.py import_exercise_from_json ../exercises/math_logic_quiz.json
```

### Step 4: Delete and Re-import (if needed)

If you need to fix mistakes and re-import:
```bash
python manage.py import_exercise_from_json path/to/exercise.json --delete-existing
```

## 📁 File Structure Examples

### Simple QCM Exercise (Most Common)

```json
{
  "lesson_info": {
    "lesson_id": 1753
  },
  "exercise": {
    "title": "Quick Quiz",
    "title_arabic": "اختبار سريع",
    "exercise_format": "qcm_only",
    "difficulty_level": "beginner",
    "total_points": 5
  },
  "questions": [
    {
      "order": 1,
      "question_type": "qcm_single",
      "question_text": "What is 2 + 2?",
      "question_text_arabic": "كم يساوي 2 + 2؟",
      "points": 1.0,
      "choices": [
        {
          "order": 1,
          "choice_text": "3",
          "choice_text_arabic": "3",
          "is_correct": false
        },
        {
          "order": 2,
          "choice_text": "4",
          "choice_text_arabic": "4",
          "is_correct": true
        }
      ]
    }
  ]
}
```

## 🎯 Question Types Reference

| Type | Code | Use For |
|------|------|---------|
| Single Choice QCM | `qcm_single` | One correct answer |
| Multiple Choice QCM | `qcm_multiple` | Multiple correct answers |
| True/False | `true_false` | Yes/No questions |
| Short Answer | `open_short` | Brief text response |
| Essay | `open_long` | Long text response |
| Fill in Blank | `fill_blank` | Complete the sentence |
| Matching | `matching` | Match pairs |
| Ordering | `ordering` | Put in correct order |

## 🎨 Exercise Format Options

- `qcm_only` - Only multiple choice questions
- `mixed` - Mix of different types
- `open_only` - Only open questions
- `practical` - Practical exercises
- `interactive` - Interactive exercises

## 📊 Difficulty Levels

- `beginner` - مبتدئ - Easy
- `intermediate` - متوسط - Medium
- `advanced` - متقدم - Hard
- `expert` - خبير - Expert

## ✅ Best Practices

### 1. Always Include Arabic Translations
```json
{
  "question_text": "French or English version",
  "question_text_arabic": "النسخة العربية"
}
```

### 2. Mark Correct Answers
```json
{
  "choice_text": "Correct answer",
  "is_correct": true  // ← IMPORTANT!
}
```

### 3. Add Explanations
```json
{
  "explanation": "This is why the answer is correct",
  "explanation_arabic": "هذا هو السبب في أن الإجابة صحيحة"
}
```

### 4. Set Appropriate Points
- Easy questions: 1 point
- Medium questions: 2 points
- Hard questions: 3-5 points
- Essays: 5-10 points

### 5. Use Logical Order
```json
{
  "order": 1,  // First question
  "order": 2,  // Second question
  ...
}
```

## 🔍 How to Find Lesson IDs

### Method 1: Django Admin
1. Go to http://localhost:8000/admin/
2. Navigate to Lessons
3. Click on the lesson
4. Look at the URL: `/admin/lessons/lesson/1753/change/` → ID is 1753

### Method 2: Django Shell
```bash
python manage.py shell
```

```python
from lessons.models import Lesson

# Search by title
lessons = Lesson.objects.filter(title__icontains="Logic")
for l in lessons:
    print(f"ID: {l.id}, Title: {l.title}, Grade: {l.grade.name}")

# Or by grade + subject
from schools.models import Grade, Subject
grade = Grade.objects.get(name__icontains="2nd Year Bac")
subject = Subject.objects.get(name__icontains="Math")
lessons = Lesson.objects.filter(grade=grade, subject=subject)
for l in lessons:
    print(f"ID: {l.id}, Title: {l.title}")
```

### Method 3: Use Lesson Details in JSON (No ID needed!)
If you don't know the ID, just use:
```json
{
  "lesson_info": {
    "lesson_title": "Logic and Set Theory",
    "grade_name": "2nd Year Baccalaureate",
    "subject_name": "Mathematics"
  }
}
```

## 🐛 Troubleshooting

### Error: "Lesson not found"
- Check the lesson ID exists in the database
- Or verify lesson_title, grade_name, subject_name are correct
- Use partial matches (command uses `icontains`)

### Error: "No superuser found"
```bash
python manage.py createsuperuser
```

### Error: "Invalid JSON file"
- Validate your JSON: https://jsonlint.com/
- Check for missing commas
- Check for extra commas after last item
- Ensure proper quotes (use `"`, not `'` in JSON)

### Questions not appearing
- Check `is_correct` is set on at least one choice
- Verify `question_type` matches the question format
- Make sure `choices` array is not empty for QCM questions

## 📝 Workflow for Your Team

1. **Content Creator** creates exercise in JSON format
2. **Content Creator** validates JSON (use jsonlint.com)
3. **Technical Person** runs import command
4. **Teacher** reviews exercise in admin panel
5. **Teacher** publishes exercise to students

## 📂 Recommended File Organization

```
exercises/
├── math/
│   ├── 2nd_bac/
│   │   ├── logic_quiz_1.json
│   │   ├── logic_quiz_2.json
│   │   └── sets_practice.json
│   └── 1st_bac/
│       └── ...
├── physics/
│   └── ...
└── templates/
    ├── exercise_template_complete.json
    └── exercise_example_simple.json
```

## 🎓 Examples

See the provided files:
- `exercise_template_complete.json` - Shows ALL question types
- `exercise_example_simple.json` - Simple QCM example (ready to use)

## 🤝 Need Help?

1. Check this README
2. Look at `exercise_example_simple.json`
3. Ask the technical team
4. Check Django admin for lesson IDs

---

**Happy Exercise Creating! 🚀**
