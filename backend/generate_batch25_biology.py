"""
Generator script for Batch 25: First Year Middle School Life & Earth Sciences
Lesson IDs: 1240-1249
Creates Django management commands with 5 exercises per lesson, 6 questions per exercise
"""

import os
import re

# Lesson data: (lesson_id, title_en, title_ar, slug)
lessons = [
    (1240, "Characteristics of Living Beings", "خصائص الكائنات الحية", "living_beings_characteristics"),
    (1241, "Classification of Living Beings", "تصنيف الكائنات الحية", "classification_living_beings"),
    (1242, "The Cell: Unit of Living Beings", "الخلية: وحدة الكائنات الحية", "cell_unit_life"),
    (1243, "Nutrition in Living Beings", "التغذية عند الكائنات الحية", "nutrition_living_beings"),
    (1244, "Respiration in Living Beings", "التنفس عند الكائنات الحية", "respiration_living_beings"),
    (1245, "The Digestive System", "الجهاز الهضمي", "digestive_system"),
    (1246, "The Respiratory System", "الجهاز التنفسي", "respiratory_system"),
    (1247, "The Circulatory System", "الجهاز الدوري", "circulatory_system"),
    (1248, "The Excretory System", "الجهاز الإخراجي", "excretory_system"),
    (1249, "Ecosystems and Food Chains", "الأنظمة البيئية والسلاسل الغذائية", "ecosystems_food_chains"),
]

# Exercise topics for each lesson (5 topics, each will have 6 questions)
lesson_topics = {
    1240: [
        ("Movement in Living Beings", "الحركة عند الكائنات الحية"),
        ("Nutrition and Growth", "التغذية والنمو"),
        ("Reproduction", "التكاثر"),
        ("Response to Stimuli", "الاستجابة للمؤثرات"),
        ("Life Cycle", "دورة الحياة"),
    ],
    1241: [
        ("Classification Criteria", "معايير التصنيف"),
        ("Vertebrates and Invertebrates", "الفقاريات واللافقاريات"),
        ("Plant Classification", "تصنيف النباتات"),
        ("Animal Kingdom", "المملكة الحيوانية"),
        ("Plant Kingdom", "المملكة النباتية"),
    ],
    1242: [
        ("Cell Structure", "تركيب الخلية"),
        ("Cell Membrane and Nucleus", "الغشاء الخلوي والنواة"),
        ("Cytoplasm and Organelles", "السيتوبلازم والعضيات"),
        ("Plant Cells vs Animal Cells", "الخلايا النباتية والحيوانية"),
        ("Cell Functions", "وظائف الخلية"),
    ],
    1243: [
        ("Autotrophic Nutrition", "التغذية الذاتية"),
        ("Heterotrophic Nutrition", "التغذية غير الذاتية"),
        ("Photosynthesis", "التركيب الضوئي"),
        ("Types of Nutrition in Animals", "أنواع التغذية عند الحيوانات"),
        ("Nutrients and Energy", "المغذيات والطاقة"),
    ],
    1244: [
        ("What is Respiration?", "ما هو التنفس؟"),
        ("Aerobic Respiration", "التنفس الهوائي"),
        ("Respiration in Animals", "التنفس عند الحيوانات"),
        ("Respiration in Plants", "التنفس عند النباتات"),
        ("Gas Exchange", "تبادل الغازات"),
    ],
    1245: [
        ("Organs of the Digestive System", "أعضاء الجهاز الهضمي"),
        ("The Mouth and Teeth", "الفم والأسنان"),
        ("The Stomach", "المعدة"),
        ("The Intestines", "الأمعاء"),
        ("Digestion and Absorption", "الهضم والامتصاص"),
    ],
    1246: [
        ("Organs of the Respiratory System", "أعضاء الجهاز التنفسي"),
        ("The Nose and Trachea", "الأنف والقصبة الهوائية"),
        ("The Lungs", "الرئتان"),
        ("The Breathing Process", "عملية التنفس"),
        ("Gas Exchange in Lungs", "تبادل الغازات في الرئتين"),
    ],
    1247: [
        ("The Heart", "القلب"),
        ("Blood Vessels", "الأوعية الدموية"),
        ("Blood Composition", "تركيب الدم"),
        ("Blood Circulation", "الدورة الدموية"),
        ("Functions of Blood", "وظائف الدم"),
    ],
    1248: [
        ("Organs of Excretion", "أعضاء الإخراج"),
        ("The Kidneys", "الكليتان"),
        ("The Urinary System", "الجهاز البولي"),
        ("Urine Formation", "تكوين البول"),
        ("Waste Removal", "إزالة الفضلات"),
    ],
    1249: [
        ("What is an Ecosystem?", "ما هو النظام البيئي؟"),
        ("Producers, Consumers, Decomposers", "المنتجات والمستهلكات والمحللات"),
        ("Food Chains", "السلاسل الغذائية"),
        ("Food Webs", "الشبكات الغذائية"),
        ("Energy Flow in Ecosystems", "تدفق الطاقة في الأنظمة البيئية"),
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
Generated by: generate_batch25_biology.py
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
    print('Generating Batch 25 command files...')
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
