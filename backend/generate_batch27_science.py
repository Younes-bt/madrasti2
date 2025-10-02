"""
Generator script for Batch 27: Sixth Year Primary Science
Lesson IDs: 1147-1156
Creates Django management commands with 5 exercises per lesson, 6 questions per exercise
"""

import os
import re

# Lesson data: (lesson_id, title_en, title_ar, slug)
lessons = [
    (1147, "The Human Body: Skeleton and Muscles", "جسم الإنسان: الهيكل العظمي والعضلات", "skeleton_muscles"),
    (1148, "The Digestive System", "الجهاز الهضمي", "digestive_system"),
    (1149, "The Respiratory System", "الجهاز التنفسي", "respiratory_system"),
    (1150, "The Circulatory System", "الجهاز الدوري", "circulatory_system"),
    (1151, "The Nervous System", "الجهاز العصبي", "nervous_system"),
    (1152, "Plants and Their Growth", "النباتات ونموها", "plants_growth"),
    (1153, "Photosynthesis", "التركيب الضوئي", "photosynthesis"),
    (1154, "Ecosystems", "الأنظمة البيئية", "ecosystems"),
    (1155, "Energy and Energy Sources", "الطاقة ومصادر الطاقة", "energy_sources"),
    (1156, "Matter and Its States", "المادة وحالاتها", "matter_states"),
]

# Exercise topics for each lesson (5 topics, each will have 6 questions)
lesson_topics = {
    1147: [
        ("The Skeleton: Structure and Functions", "الهيكل العظمي: التركيب والوظائف"),
        ("Types of Bones", "أنواع العظام"),
        ("Muscles and Movement", "العضلات والحركة"),
        ("Joints", "المفاصل"),
        ("Caring for Bones and Muscles", "العناية بالعظام والعضلات"),
    ],
    1148: [
        ("The Digestive System Organs", "أعضاء الجهاز الهضمي"),
        ("The Mouth and Teeth", "الفم والأسنان"),
        ("The Stomach and Digestion", "المعدة والهضم"),
        ("The Intestines and Absorption", "الأمعاء والامتصاص"),
        ("Healthy Eating", "التغذية الصحية"),
    ],
    1149: [
        ("The Respiratory System Organs", "أعضاء الجهاز التنفسي"),
        ("The Lungs", "الرئتان"),
        ("The Breathing Process", "عملية التنفس"),
        ("Gas Exchange", "تبادل الغازات"),
        ("Respiratory Health", "صحة الجهاز التنفسي"),
    ],
    1150: [
        ("The Heart and Blood Vessels", "القلب والأوعية الدموية"),
        ("Blood Composition", "تركيب الدم"),
        ("Blood Circulation", "الدورة الدموية"),
        ("Functions of Blood", "وظائف الدم"),
        ("Cardiovascular Health", "صحة القلب والأوعية"),
    ],
    1151: [
        ("The Brain", "الدماغ"),
        ("The Spinal Cord", "الحبل الشوكي"),
        ("Nerves and Neurons", "الأعصاب والخلايا العصبية"),
        ("The Five Senses", "الحواس الخمس"),
        ("Reflexes", "ردود الفعل المنعكسة"),
    ],
    1152: [
        ("Parts of a Plant", "أجزاء النبات"),
        ("Seeds and Germination", "البذور والإنبات"),
        ("Plant Growth", "نمو النبات"),
        ("Roots, Stems, and Leaves", "الجذور والسيقان والأوراق"),
        ("Flowers and Reproduction", "الأزهار والتكاثر"),
    ],
    1153: [
        ("What is Photosynthesis?", "ما هو التركيب الضوئي؟"),
        ("Chlorophyll and Light", "الكلوروفيل والضوء"),
        ("Raw Materials for Photosynthesis", "المواد الخام للتركيب الضوئي"),
        ("Products of Photosynthesis", "نواتج التركيب الضوئي"),
        ("Importance of Photosynthesis", "أهمية التركيب الضوئي"),
    ],
    1154: [
        ("What is an Ecosystem?", "ما هو النظام البيئي؟"),
        ("Living and Non-Living Components", "المكونات الحية وغير الحية"),
        ("Food Chains", "السلاسل الغذائية"),
        ("Food Webs", "الشبكات الغذائية"),
        ("Protecting Ecosystems", "حماية الأنظمة البيئية"),
    ],
    1155: [
        ("What is Energy?", "ما هي الطاقة؟"),
        ("Forms of Energy", "أشكال الطاقة"),
        ("Renewable Energy Sources", "مصادر الطاقة المتجددة"),
        ("Non-Renewable Energy Sources", "مصادر الطاقة غير المتجددة"),
        ("Energy Conservation", "الحفاظ على الطاقة"),
    ],
    1156: [
        ("What is Matter?", "ما هي المادة؟"),
        ("The Three States of Matter", "حالات المادة الثلاث"),
        ("Properties of Solids", "خصائص الأجسام الصلبة"),
        ("Properties of Liquids and Gases", "خصائص السوائل والغازات"),
        ("Changes of State", "تغيرات الحالة"),
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
Generated by: generate_batch27_science.py
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
    print('Generating Batch 27 command files...')
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
