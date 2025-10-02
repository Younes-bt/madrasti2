"""
Generator script for Batch 24: First Year Middle School Physics
Lesson IDs: 1254-1263
Creates Django management commands with 5 exercises per lesson, 6 questions per exercise
"""

import os
import re

# Lesson data: (lesson_id, title_en, title_ar, slug)
lessons = [
    (1254, "Light Sources and Optical Receivers", "مصادر الضوء والمستقبلات الضوئية", "light_sources_receivers"),
    (1255, "Shadow and Reflection", "الظل والانعكاس", "shadow_reflection"),
    (1256, "Colors and Filters", "الألوان والمرشحات", "colors_filters"),
    (1257, "Introduction to Matter", "مقدمة في المادة", "intro_matter"),
    (1258, "States of Matter", "حالات المادة", "states_matter"),
    (1259, "Volume and Mass", "الحجم والكتلة", "volume_mass"),
    (1260, "Introduction to Electrical Circuits", "مقدمة في الدارات الكهربائية", "intro_circuits"),
    (1261, "Simple Electrical Circuits", "الدارات الكهربائية البسيطة", "simple_circuits"),
    (1262, "Series and Parallel Circuits", "دارات التوالي والتوازي", "series_parallel"),
    (1263, "Electrical Safety", "السلامة الكهربائية", "electrical_safety"),
]

# Exercise topics for each lesson (5 topics, each will have 6 questions)
lesson_topics = {
    1254: [
        ("Natural Light Sources", "المصادر الطبيعية للضوء"),
        ("Artificial Light Sources", "المصادر الصناعية للضوء"),
        ("Optical Receivers and the Eye", "المستقبلات الضوئية والعين"),
        ("Properties of Light", "خصائص الضوء"),
        ("Light Propagation", "انتشار الضوء"),
    ],
    1255: [
        ("Formation of Shadows", "تكوين الظلال"),
        ("Types of Shadows", "أنواع الظلال"),
        ("Law of Reflection", "قانون الانعكاس"),
        ("Plane Mirrors", "المرايا المستوية"),
        ("Applications of Reflection", "تطبيقات الانعكاس"),
    ],
    1256: [
        ("White Light and Colors", "الضوء الأبيض والألوان"),
        ("Primary Colors of Light", "الألوان الأساسية للضوء"),
        ("Color Mixing", "خلط الألوان"),
        ("Color Filters", "المرشحات اللونية"),
        ("Colored Objects", "الأجسام الملونة"),
    ],
    1257: [
        ("What is Matter?", "ما هي المادة؟"),
        ("Properties of Matter", "خصائص المادة"),
        ("Types of Matter", "أنواع المادة"),
        ("Matter and Energy", "المادة والطاقة"),
        ("Conservation of Matter", "حفظ المادة"),
    ],
    1258: [
        ("The Three States of Matter", "حالات المادة الثلاث"),
        ("Properties of Solids", "خصائص الأجسام الصلبة"),
        ("Properties of Liquids", "خصائص السوائل"),
        ("Properties of Gases", "خصائص الغازات"),
        ("Changes of State", "تغيرات الحالة"),
    ],
    1259: [
        ("What is Volume?", "ما هو الحجم؟"),
        ("Measuring Volume", "قياس الحجم"),
        ("What is Mass?", "ما هي الكتلة؟"),
        ("Measuring Mass", "قياس الكتلة"),
        ("Density", "الكثافة"),
    ],
    1260: [
        ("What is Electricity?", "ما هي الكهرباء؟"),
        ("Electrical Components", "المكونات الكهربائية"),
        ("Electrical Symbols", "الرموز الكهربائية"),
        ("Circuit Diagrams", "مخططات الدارات"),
        ("Open and Closed Circuits", "الدارات المفتوحة والمغلقة"),
    ],
    1261: [
        ("Building a Simple Circuit", "بناء دارة بسيطة"),
        ("Batteries and Power Sources", "البطاريات ومصادر الطاقة"),
        ("Switches", "المفاتيح الكهربائية"),
        ("Lamps and Bulbs", "المصابيح"),
        ("Conductors and Insulators", "الموصلات والعوازل"),
    ],
    1262: [
        ("Series Circuits", "دارات التوالي"),
        ("Properties of Series Circuits", "خصائص دارات التوالي"),
        ("Parallel Circuits", "دارات التوازي"),
        ("Properties of Parallel Circuits", "خصائص دارات التوازي"),
        ("Comparing Series and Parallel", "مقارنة التوالي والتوازي"),
    ],
    1263: [
        ("Electrical Hazards", "مخاطر الكهرباء"),
        ("Safety Rules", "قواعد السلامة"),
        ("Circuit Breakers and Fuses", "القواطع والمنصهرات"),
        ("Electrical Shock", "الصدمة الكهربائية"),
        ("Safe Practices", "الممارسات الآمنة"),
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
Generated by: generate_batch24_physics.py
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
    filepath = os.path.join('lessons', 'management', 'commands', filename)

    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f'Created: {filepath}')
    return filename


if __name__ == '__main__':
    print('Generating Batch 24 command files...')
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
