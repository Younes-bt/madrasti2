"""
Generator script for Batch 26: Sixth Year Primary Mathematics
Lesson IDs: 1072-1081
Creates Django management commands with 5 exercises per lesson, 6 questions per exercise
"""

import os
import re

# Lesson data: (lesson_id, title_en, title_ar, slug)
lessons = [
    (1072, "Decimal Numbers", "الأعداد العشرية", "decimal_numbers"),
    (1073, "Operations on Decimal Numbers", "العمليات على الأعداد العشرية", "operations_decimals"),
    (1074, "Fractions", "الكسور", "fractions"),
    (1075, "Operations on Fractions", "العمليات على الكسور", "operations_fractions"),
    (1076, "Proportionality", "التناسبية", "proportionality"),
    (1077, "Percentages", "النسب المئوية", "percentages"),
    (1078, "Geometry: Circles and Discs", "الهندسة: الدوائر والأقراص", "circles_discs"),
    (1079, "Areas and Perimeters", "المساحات والمحيطات", "areas_perimeters"),
    (1080, "Volumes", "الحجوم", "volumes"),
    (1081, "Statistics and Data", "الإحصاء والبيانات", "statistics_data"),
]

# Exercise topics for each lesson (5 topics, each will have 6 questions)
lesson_topics = {
    1072: [
        ("Understanding Decimal Numbers", "فهم الأعداد العشرية"),
        ("Reading and Writing Decimals", "قراءة وكتابة الأعداد العشرية"),
        ("Comparing Decimal Numbers", "مقارنة الأعداد العشرية"),
        ("Ordering Decimals", "ترتيب الأعداد العشرية"),
        ("Place Value in Decimals", "القيمة المكانية في الأعداد العشرية"),
    ],
    1073: [
        ("Addition of Decimals", "جمع الأعداد العشرية"),
        ("Subtraction of Decimals", "طرح الأعداد العشرية"),
        ("Multiplication of Decimals", "ضرب الأعداد العشرية"),
        ("Division of Decimals", "قسمة الأعداد العشرية"),
        ("Mixed Operations", "العمليات المختلطة"),
    ],
    1074: [
        ("Understanding Fractions", "فهم الكسور"),
        ("Equivalent Fractions", "الكسور المتكافئة"),
        ("Comparing Fractions", "مقارنة الكسور"),
        ("Simplifying Fractions", "تبسيط الكسور"),
        ("Mixed Numbers and Improper Fractions", "الأعداد الكسرية والكسور غير الفعلية"),
    ],
    1075: [
        ("Addition of Fractions", "جمع الكسور"),
        ("Subtraction of Fractions", "طرح الكسور"),
        ("Multiplication of Fractions", "ضرب الكسور"),
        ("Division of Fractions", "قسمة الكسور"),
        ("Mixed Operations with Fractions", "العمليات المختلطة بالكسور"),
    ],
    1076: [
        ("What is Proportionality?", "ما هي التناسبية؟"),
        ("Direct Proportionality", "التناسب الطردي"),
        ("Proportionality Tables", "جداول التناسب"),
        ("Scale and Maps", "المقياس والخرائط"),
        ("Solving Proportion Problems", "حل مسائل التناسب"),
    ],
    1077: [
        ("Understanding Percentages", "فهم النسب المئوية"),
        ("Converting Fractions to Percentages", "تحويل الكسور إلى نسب مئوية"),
        ("Calculating Percentages", "حساب النسب المئوية"),
        ("Percentage Increase and Decrease", "الزيادة والنقصان المئوي"),
        ("Real-Life Percentage Problems", "مسائل النسب المئوية في الحياة"),
    ],
    1078: [
        ("Parts of a Circle", "أجزاء الدائرة"),
        ("Radius and Diameter", "نصف القطر والقطر"),
        ("Circumference of a Circle", "محيط الدائرة"),
        ("Area of a Circle", "مساحة الدائرة"),
        ("Circle Problems", "مسائل الدائرة"),
    ],
    1079: [
        ("Perimeter of Polygons", "محيط المضلعات"),
        ("Area of Rectangles and Squares", "مساحة المستطيلات والمربعات"),
        ("Area of Triangles", "مساحة المثلثات"),
        ("Area of Parallelograms", "مساحة متوازيات الأضلاع"),
        ("Composite Shapes", "الأشكال المركبة"),
    ],
    1080: [
        ("What is Volume?", "ما هو الحجم؟"),
        ("Volume of Cubes", "حجم المكعبات"),
        ("Volume of Rectangular Prisms", "حجم المنشورات المستطيلة"),
        ("Volume Units", "وحدات الحجم"),
        ("Volume Problems", "مسائل الحجم"),
    ],
    1081: [
        ("Collecting and Organizing Data", "جمع وتنظيم البيانات"),
        ("Reading Tables and Charts", "قراءة الجداول والرسوم البيانية"),
        ("Bar Graphs", "الرسوم البيانية بالأعمدة"),
        ("Line Graphs", "الرسوم البيانية الخطية"),
        ("Mean and Average", "المتوسط الحسابي"),
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
Generated by: generate_batch26_math.py
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
    print('Generating Batch 26 command files...')
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
