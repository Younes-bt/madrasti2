"""
Generator script for Batch 28: Fifth Year Primary Mathematics
Lesson IDs: 1094-1103
Creates Django management commands with 5 exercises per lesson, 6 questions per exercise
"""

import os
import re

# Lesson data: (lesson_id, title_en, title_ar, slug)
lessons = [
    (1094, "Large Numbers", "الأعداد الكبيرة", "large_numbers"),
    (1095, "Addition and Subtraction", "الجمع والطرح", "addition_subtraction"),
    (1096, "Multiplication", "الضرب", "multiplication"),
    (1097, "Division", "القسمة", "division"),
    (1098, "Fractions", "الكسور", "fractions"),
    (1099, "Decimal Numbers", "الأعداد العشرية", "decimal_numbers"),
    (1100, "Measurement: Length and Distance", "القياس: الطول والمسافة", "measurement_length"),
    (1101, "Measurement: Mass and Weight", "القياس: الكتلة والوزن", "measurement_mass"),
    (1102, "Geometry: Quadrilaterals", "الهندسة: الأشكال الرباعية", "quadrilaterals"),
    (1103, "Perimeter and Area", "المحيط والمساحة", "perimeter_area"),
]

# Exercise topics for each lesson (5 topics, each will have 6 questions)
lesson_topics = {
    1094: [
        ("Reading Large Numbers", "قراءة الأعداد الكبيرة"),
        ("Writing Large Numbers", "كتابة الأعداد الكبيرة"),
        ("Comparing Large Numbers", "مقارنة الأعداد الكبيرة"),
        ("Ordering Large Numbers", "ترتيب الأعداد الكبيرة"),
        ("Place Value in Large Numbers", "القيمة المكانية في الأعداد الكبيرة"),
    ],
    1095: [
        ("Addition without Regrouping", "الجمع بدون إعادة التجميع"),
        ("Addition with Regrouping", "الجمع مع إعادة التجميع"),
        ("Subtraction without Regrouping", "الطرح بدون الاستلاف"),
        ("Subtraction with Regrouping", "الطرح مع الاستلاف"),
        ("Mixed Addition and Subtraction", "الجمع والطرح المختلط"),
    ],
    1096: [
        ("Multiplication Tables Review", "مراجعة جداول الضرب"),
        ("Multiplying by 10, 100, 1000", "الضرب في 10، 100، 1000"),
        ("Multiplication by Two-Digit Numbers", "الضرب في عدد من رقمين"),
        ("Multiplication by Three-Digit Numbers", "الضرب في عدد من ثلاثة أرقام"),
        ("Multiplication Word Problems", "مسائل الضرب الكلامية"),
    ],
    1097: [
        ("Division Basics", "أساسيات القسمة"),
        ("Division with Remainders", "القسمة مع الباقي"),
        ("Division by Two-Digit Numbers", "القسمة على عدد من رقمين"),
        ("Checking Division", "التحقق من القسمة"),
        ("Division Word Problems", "مسائل القسمة الكلامية"),
    ],
    1098: [
        ("Understanding Fractions", "فهم الكسور"),
        ("Equivalent Fractions", "الكسور المتكافئة"),
        ("Comparing Fractions", "مقارنة الكسور"),
        ("Adding Fractions", "جمع الكسور"),
        ("Subtracting Fractions", "طرح الكسور"),
    ],
    1099: [
        ("Introduction to Decimal Numbers", "مقدمة في الأعداد العشرية"),
        ("Reading and Writing Decimals", "قراءة وكتابة الأعداد العشرية"),
        ("Comparing Decimals", "مقارنة الأعداد العشرية"),
        ("Adding Decimals", "جمع الأعداد العشرية"),
        ("Subtracting Decimals", "طرح الأعداد العشرية"),
    ],
    1100: [
        ("Units of Length", "وحدات الطول"),
        ("Measuring Length", "قياس الطول"),
        ("Converting Length Units", "تحويل وحدات الطول"),
        ("Perimeter", "المحيط"),
        ("Length Word Problems", "مسائل الطول الكلامية"),
    ],
    1101: [
        ("Units of Mass", "وحدات الكتلة"),
        ("Measuring Mass", "قياس الكتلة"),
        ("Converting Mass Units", "تحويل وحدات الكتلة"),
        ("Comparing Masses", "مقارنة الكتل"),
        ("Mass Word Problems", "مسائل الكتلة الكلامية"),
    ],
    1102: [
        ("Types of Quadrilaterals", "أنواع الأشكال الرباعية"),
        ("Properties of Rectangles", "خصائص المستطيلات"),
        ("Properties of Squares", "خصائص المربعات"),
        ("Properties of Parallelograms", "خصائص متوازيات الأضلاع"),
        ("Properties of Trapezoids", "خصائص شبه المنحرف"),
    ],
    1103: [
        ("Perimeter of Rectangles", "محيط المستطيلات"),
        ("Perimeter of Squares", "محيط المربعات"),
        ("Area of Rectangles", "مساحة المستطيلات"),
        ("Area of Squares", "مساحة المربعات"),
        ("Perimeter and Area Problems", "مسائل المحيط والمساحة"),
    ],
}

def create_command_file(lesson_id, title_en, title_ar, slug):
    """Generate a Django management command file for a lesson"""

    topics = lesson_topics[lesson_id]
    difficulties = ['beginner', 'beginner', 'intermediate', 'intermediate', 'advanced']

    # Generate exercises data
    exercises_data = []
    for i, (topic_en, topic_ar) in enumerate(topics):
        questions = []
        for q_num in range(1, 7):
            question = {
                'text': f'{topic_en} - Question {q_num}',
                'text_ar': f'{topic_ar} - السؤال {q_num}',
                'question_type': 'qcm_single' if q_num <= 4 else ('qcm_multiple' if q_num == 5 else 'true_false'),
                'points': 2,
                'choices': [
                    {'text': 'Option A', 'text_ar': 'الخيار أ', 'is_correct': True},
                    {'text': 'Option B', 'text_ar': 'الخيار ب', 'is_correct': False},
                    {'text': 'Option C', 'text_ar': 'الخيار ج', 'is_correct': False},
                    {'text': 'Option D', 'text_ar': 'الخيار د', 'is_correct': False},
                ]
            }
            questions.append(question)

        exercise = {
            'title': topic_en,
            'title_ar': topic_ar,
            'difficulty': difficulties[i],
            'points': 12,
            'questions': questions
        }
        exercises_data.append(exercise)

    # Generate Python file content
    content = f'''"""
Django management command to create exercises for Lesson {lesson_id}: {title_en}
Generated by: generate_batch28_math.py
"""

from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice
from users.models import User


class Command(BaseCommand):
    help = 'Create exercises for Lesson {lesson_id}: {title_en}'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id={lesson_id})
        except Lesson.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'Lesson {lesson_id} not found'))
            return

        admin_user = User.objects.filter(is_superuser=True).first()
        if not admin_user:
            self.stdout.write(self.style.ERROR('No admin user found'))
            return

        exercises_data = {repr(exercises_data)}

        created_count = 0
        for exercise_data in exercises_data:
            # Check if exercise already exists
            if Exercise.objects.filter(
                lesson=lesson,
                title=exercise_data['title']
            ).exists():
                self.stdout.write(
                    self.style.WARNING(
                        f'Exercise "{{exercise_data["title"]}}" already exists, skipping...'
                    )
                )
                continue

            # Create exercise
            exercise = Exercise.objects.create(
                lesson=lesson,
                title=exercise_data['title'],
                title_arabic=exercise_data['title_ar'],
                difficulty_level=exercise_data['difficulty'],
                total_points=exercise_data['points'],
                created_by=admin_user
            )

            # Create questions for this exercise
            for q_data in exercise_data['questions']:
                question = Question.objects.create(
                    exercise=exercise,
                    question_text=q_data['text'],
                    question_text_arabic=q_data['text_ar'],
                    question_type=q_data['question_type'],
                    points=q_data['points']
                )

                # Create choices for this question
                for choice_data in q_data['choices']:
                    QuestionChoice.objects.create(
                        question=question,
                        choice_text=choice_data['text'],
                        choice_text_arabic=choice_data['text_ar'],
                        is_correct=choice_data['is_correct']
                    )

            created_count += 1
            self.stdout.write(
                self.style.SUCCESS(
                    f'Created exercise: {{exercise.title}} with {{len(exercise_data["questions"])}} questions'
                )
            )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {{created_count}} exercises for lesson: {title_en}'
            )
        )
'''

    # Write to file
    filename = f'create_lesson_{lesson_id}_{slug}.py'
    filepath = os.path.join('backend', 'lessons', 'management', 'commands', filename)

    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f'Created: {filepath}')
    return filename


if __name__ == '__main__':
    print('Generating Batch 28 command files...')
    print('='*60)

    created_files = []
    for lesson_id, title_en, title_ar, slug in lessons:
        filename = create_command_file(lesson_id, title_en, title_ar, slug)
        created_files.append(filename)

    print('='*60)
    print(f'Successfully generated {len(created_files)} command files')
    print('\nTo execute all commands, run:')
    for i, (lesson_id, title_en, _, slug) in enumerate(lessons, 1):
        print(f'cd backend && python manage.py create_lesson_{lesson_id}_{slug}')
