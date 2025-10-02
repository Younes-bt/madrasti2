"""
Generator script for Batch 29: Fourth Year Primary Mathematics
Lesson IDs: 1116-1125
Creates Django management commands with 5 exercises per lesson, 6 questions per exercise
"""

import os
import re

# Lesson data: (lesson_id, title_en, title_ar, slug)
lessons = [
    (1116, "Numbers up to 10,000", "الأعداد حتى 10,000", "numbers_10000"),
    (1117, "Addition and Subtraction", "الجمع والطرح", "addition_subtraction"),
    (1118, "Multiplication", "الضرب", "multiplication"),
    (1119, "Division", "القسمة", "division"),
    (1120, "Introduction to Fractions", "مقدمة في الكسور", "intro_fractions"),
    (1121, "Time and Calendar", "الوقت والتقويم", "time_calendar"),
    (1122, "Money and Shopping", "المال والتسوق", "money_shopping"),
    (1123, "Measurement: Length", "القياس: الطول", "measurement_length"),
    (1124, "Geometry: Shapes and Angles", "الهندسة: الأشكال والزوايا", "shapes_angles"),
    (1125, "Perimeter", "المحيط", "perimeter"),
]

# Exercise topics for each lesson (5 topics, each will have 6 questions)
lesson_topics = {
    1116: [
        ("Reading Numbers up to 10,000", "قراءة الأعداد حتى 10,000"),
        ("Writing Numbers up to 10,000", "كتابة الأعداد حتى 10,000"),
        ("Comparing Numbers", "مقارنة الأعداد"),
        ("Ordering Numbers", "ترتيب الأعداد"),
        ("Place Value", "القيمة المكانية"),
    ],
    1117: [
        ("Addition without Carrying", "الجمع بدون حمل"),
        ("Addition with Carrying", "الجمع مع الحمل"),
        ("Subtraction without Borrowing", "الطرح بدون استلاف"),
        ("Subtraction with Borrowing", "الطرح مع الاستلاف"),
        ("Word Problems", "المسائل الكلامية"),
    ],
    1118: [
        ("Multiplication Tables 1-10", "جداول الضرب من 1 إلى 10"),
        ("Multiplying by 10 and 100", "الضرب في 10 و 100"),
        ("Two-Digit Multiplication", "ضرب الأعداد من رقمين"),
        ("Multiplication Properties", "خصائص الضرب"),
        ("Multiplication Word Problems", "مسائل الضرب الكلامية"),
    ],
    1119: [
        ("Division Concept", "مفهوم القسمة"),
        ("Division with No Remainder", "القسمة بدون باقي"),
        ("Division with Remainder", "القسمة مع الباقي"),
        ("Relationship between Multiplication and Division", "العلاقة بين الضرب والقسمة"),
        ("Division Word Problems", "مسائل القسمة الكلامية"),
    ],
    1120: [
        ("What is a Fraction?", "ما هو الكسر؟"),
        ("Parts of a Whole", "أجزاء من الكل"),
        ("Unit Fractions", "الكسور الوحدوية"),
        ("Comparing Simple Fractions", "مقارنة الكسور البسيطة"),
        ("Fractions on a Number Line", "الكسور على خط الأعداد"),
    ],
    1121: [
        ("Telling Time: Hours and Minutes", "قراءة الوقت: الساعات والدقائق"),
        ("AM and PM", "صباحاً ومساءً"),
        ("Days, Weeks, and Months", "الأيام والأسابيع والشهور"),
        ("Reading a Calendar", "قراءة التقويم"),
        ("Time Word Problems", "مسائل الوقت الكلامية"),
    ],
    1122: [
        ("Coins and Bills", "العملات المعدنية والورقية"),
        ("Counting Money", "عد النقود"),
        ("Making Change", "إرجاع الفكة"),
        ("Comparing Amounts", "مقارنة المبالغ"),
        ("Shopping Problems", "مسائل التسوق"),
    ],
    1123: [
        ("Units of Length", "وحدات الطول"),
        ("Measuring with a Ruler", "القياس بالمسطرة"),
        ("Meters and Centimeters", "الأمتار والسنتيمترات"),
        ("Estimating Length", "تقدير الطول"),
        ("Length Word Problems", "مسائل الطول الكلامية"),
    ],
    1124: [
        ("2D Shapes", "الأشكال ثنائية الأبعاد"),
        ("3D Shapes", "الأشكال ثلاثية الأبعاد"),
        ("Lines and Line Segments", "الخطوط وقطع المستقيم"),
        ("Types of Angles", "أنواع الزوايا"),
        ("Symmetry", "التماثل"),
    ],
    1125: [
        ("What is Perimeter?", "ما هو المحيط؟"),
        ("Perimeter of Rectangles", "محيط المستطيلات"),
        ("Perimeter of Squares", "محيط المربعات"),
        ("Perimeter of Triangles", "محيط المثلثات"),
        ("Perimeter Word Problems", "مسائل المحيط الكلامية"),
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
Generated by: generate_batch29_math.py
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
    print('Generating Batch 29 command files...')
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
