#!/usr/bin/env python
"""
Script to generate command files for Batch 22 (lessons 1611-1620)
Second Year Middle School Life & Earth Sciences
"""

LESSONS_DATA = {
    1611: {
        'title': 'Plate Tectonics Theory',
        'title_ar': 'نظرية تكتونية الصفائح',
        'topics': [
            ('Introduction to Plate Tectonics', 'مقدمة في تكتونية الصفائح'),
            ('Structure of the Earth', 'بنية الأرض'),
            ('Tectonic Plates', 'الصفائح التكتونية'),
            ('Plate Boundaries', 'حدود الصفائح'),
            ('Evidence for Plate Tectonics', 'أدلة على تكتونية الصفائح')
        ]
    },
    1612: {
        'title': 'Earthquakes and Plate Tectonics',
        'title_ar': 'الزلازل وتكتونية الصفائح',
        'topics': [
            ('What are Earthquakes?', 'ما هي الزلازل؟'),
            ('Causes of Earthquakes', 'أسباب الزلازل'),
            ('Measuring Earthquakes', 'قياس الزلازل'),
            ('Earthquake Zones', 'مناطق الزلازل'),
            ('Earthquake Safety', 'السلامة من الزلازل')
        ]
    },
    1613: {
        'title': 'Volcanoes and Plate Tectonics',
        'title_ar': 'البراكين وتكتونية الصفائح',
        'topics': [
            ('What are Volcanoes?', 'ما هي البراكين؟'),
            ('Types of Volcanoes', 'أنواع البراكين'),
            ('Volcanic Eruptions', 'الانفجارات البركانية'),
            ('Volcanic Zones', 'المناطق البركانية'),
            ('Benefits and Hazards', 'الفوائد والمخاطر')
        ]
    },
    1614: {
        'title': 'Tectonic Deformations and Plate Tectonics',
        'title_ar': 'التشوهات التكتونية وتكتونية الصفائح',
        'topics': [
            ('Types of Deformation', 'أنواع التشوه'),
            ('Folds and Folding', 'الطيات والطي'),
            ('Faults and Faulting', 'الصدوع والتصدع'),
            ('Mountain Building', 'بناء الجبال'),
            ('Deformation Processes', 'عمليات التشوه')
        ]
    },
    1615: {
        'title': 'Formation of Igneous Rocks',
        'title_ar': 'تكوين الصخور النارية',
        'topics': [
            ('Introduction to Igneous Rocks', 'مقدمة عن الصخور النارية'),
            ('Intrusive Igneous Rocks', 'الصخور النارية الجوفية'),
            ('Extrusive Igneous Rocks', 'الصخور النارية البركانية'),
            ('Texture and Composition', 'النسيج والتركيب'),
            ('Classification of Igneous Rocks', 'تصنيف الصخور النارية')
        ]
    },
    1616: {
        'title': 'Formation of Mountain Ranges',
        'title_ar': 'تكوين السلاسل الجبلية',
        'topics': [
            ('Mountain Building Processes', 'عمليات بناء الجبال'),
            ('Fold Mountains', 'الجبال الالتوائية'),
            ('Fault-Block Mountains', 'جبال الكتل الصدعية'),
            ('Volcanic Mountains', 'الجبال البركانية'),
            ('Major Mountain Ranges', 'السلاسل الجبلية الرئيسية')
        ]
    },
    1617: {
        'title': 'Reproduction in Animals',
        'title_ar': 'التكاثر عند الحيوانات',
        'topics': [
            ('Types of Reproduction', 'أنواع التكاثر'),
            ('Asexual Reproduction', 'التكاثر اللاجنسي'),
            ('Sexual Reproduction', 'التكاثر الجنسي'),
            ('Reproductive Systems', 'الأجهزة التناسلية'),
            ('Development and Growth', 'النمو والتطور')
        ]
    },
    1618: {
        'title': 'Reproduction in Plants',
        'title_ar': 'التكاثر عند النباتات',
        'topics': [
            ('Plant Reproduction Overview', 'نظرة عامة على التكاثر النباتي'),
            ('Asexual Reproduction in Plants', 'التكاثر اللاجنسي عند النباتات'),
            ('Sexual Reproduction in Plants', 'التكاثر الجنسي عند النباتات'),
            ('Pollination and Fertilization', 'التلقيح والإخصاب'),
            ('Seed Formation and Dispersal', 'تكوين البذور وانتشارها')
        ]
    },
    1619: {
        'title': 'Human Reproduction',
        'title_ar': 'التكاثر عند الإنسان',
        'topics': [
            ('Male Reproductive System', 'الجهاز التناسلي الذكري'),
            ('Female Reproductive System', 'الجهاز التناسلي الأنثوي'),
            ('Fertilization and Pregnancy', 'الإخصاب والحمل'),
            ('Fetal Development', 'نمو الجنين'),
            ('Birth and Postnatal Development', 'الولادة والنمو بعد الولادة')
        ]
    },
    1620: {
        'title': 'Human Heredity',
        'title_ar': 'الوراثة البشرية',
        'topics': [
            ('Introduction to Human Heredity', 'مقدمة في الوراثة البشرية'),
            ('Chromosomes and Genes', 'الكروموسومات والجينات'),
            ('Inheritance Patterns', 'أنماط الوراثة'),
            ('Genetic Disorders', 'الاضطرابات الوراثية'),
            ('Family Pedigrees', 'شجرة النسب العائلية')
        ]
    },
}

TEMPLATE = '''# lessons/management/commands/create_lesson_{lesson_id}_{slug}.py

from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice
from users.models import User

class Command(BaseCommand):
    help = 'Create exercises for Lesson {lesson_id}: {title}'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id={lesson_id})
            self.stdout.write(f"Found lesson: {{lesson.title}}")

            if options['delete_existing']:
                deleted_count = Exercise.objects.filter(lesson=lesson).delete()[0]
                self.stdout.write(self.style.WARNING(f"Deleted {{deleted_count}} existing exercises"))

            admin_user = User.objects.filter(is_superuser=True).first()
            if not admin_user:
                self.stdout.write(self.style.ERROR("No admin user found"))
                return

            exercises_data = {exercises_data}

            for exercise_data in exercises_data:
                exercise = Exercise.objects.create(
                    lesson=lesson,
                    title=exercise_data['title'],
                    title_arabic=exercise_data['title_ar'],
                    difficulty_level=exercise_data['difficulty'],
                    total_points=exercise_data['points'],
                    created_by=admin_user
                )

                for q_data in exercise_data['questions']:
                    question = Question.objects.create(
                        exercise=exercise,
                        question_text=q_data['text'],
                        question_text_arabic=q_data['text_ar'],
                        question_type=q_data['type'],
                        points=q_data['points']
                    )

                    for choice_data in q_data['choices']:
                        QuestionChoice.objects.create(
                            question=question,
                            choice_text=choice_data['text'],
                            choice_text_arabic=choice_data['text_ar'],
                            is_correct=choice_data['is_correct']
                        )

                self.stdout.write(f"Created exercise: {{exercise.title}}")

            self.stdout.write(self.style.SUCCESS(
                f"Successfully created {{len(exercises_data)}} exercises for lesson {{lesson.id}}"
            ))

        except Lesson.DoesNotExist:
            self.stdout.write(self.style.ERROR("Lesson {lesson_id} not found"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {{str(e)}}"))
'''

def generate_generic_questions(topic_en, topic_ar, difficulty='beginner'):
    """Generate 6 generic questions for a topic"""
    return [
        {
            'text': f'What is the main concept of {topic_en}?',
            'text_ar': f'ما هو المفهوم الأساسي لـ {topic_ar}؟',
            'type': 'qcm_single',
            'points': 2,
            'choices': [
                {'text': f'Core concept of {topic_en}', 'text_ar': f'المفهوم الأساسي لـ {topic_ar}', 'is_correct': True},
                {'text': 'Alternative option 1', 'text_ar': 'خيار بديل 1', 'is_correct': False},
                {'text': 'Alternative option 2', 'text_ar': 'خيار بديل 2', 'is_correct': False},
                {'text': 'Alternative option 3', 'text_ar': 'خيار بديل 3', 'is_correct': False},
            ]
        },
        {
            'text': f'Which statement is true about {topic_en}?',
            'text_ar': f'أي عبارة صحيحة عن {topic_ar}؟',
            'type': 'qcm_single',
            'points': 2,
            'choices': [
                {'text': 'Correct statement', 'text_ar': 'عبارة صحيحة', 'is_correct': True},
                {'text': 'Incorrect statement 1', 'text_ar': 'عبارة خاطئة 1', 'is_correct': False},
                {'text': 'Incorrect statement 2', 'text_ar': 'عبارة خاطئة 2', 'is_correct': False},
                {'text': 'Incorrect statement 3', 'text_ar': 'عبارة خاطئة 3', 'is_correct': False},
            ]
        },
        {
            'text': f'How do you apply {topic_en}?',
            'text_ar': f'كيف تطبق {topic_ar}؟',
            'type': 'qcm_single',
            'points': 2,
            'choices': [
                {'text': 'Correct application method', 'text_ar': 'طريقة التطبيق الصحيحة', 'is_correct': True},
                {'text': 'Incorrect method 1', 'text_ar': 'طريقة خاطئة 1', 'is_correct': False},
                {'text': 'Incorrect method 2', 'text_ar': 'طريقة خاطئة 2', 'is_correct': False},
                {'text': 'Incorrect method 3', 'text_ar': 'طريقة خاطئة 3', 'is_correct': False},
            ]
        },
        {
            'text': f'Which property relates to {topic_en}?',
            'text_ar': f'أي خاصية تتعلق بـ {topic_ar}؟',
            'type': 'qcm_multiple',
            'points': 2,
            'choices': [
                {'text': 'Property 1', 'text_ar': 'خاصية 1', 'is_correct': True},
                {'text': 'Property 2', 'text_ar': 'خاصية 2', 'is_correct': True},
                {'text': 'Unrelated property 1', 'text_ar': 'خاصية غير متعلقة 1', 'is_correct': False},
                {'text': 'Unrelated property 2', 'text_ar': 'خاصية غير متعلقة 2', 'is_correct': False},
            ]
        },
        {
            'text': f'Is the statement about {topic_en} correct?',
            'text_ar': f'هل العبارة عن {topic_ar} صحيحة؟',
            'type': 'true_false',
            'points': 2,
            'choices': [
                {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False},
            ]
        },
        {
            'text': f'Solve a problem involving {topic_en}',
            'text_ar': f'حل مسألة تتضمن {topic_ar}',
            'type': 'qcm_single',
            'points': 2,
            'choices': [
                {'text': 'Correct solution', 'text_ar': 'الحل الصحيح', 'is_correct': True},
                {'text': 'Incorrect solution 1', 'text_ar': 'حل خاطئ 1', 'is_correct': False},
                {'text': 'Incorrect solution 2', 'text_ar': 'حل خاطئ 2', 'is_correct': False},
                {'text': 'Incorrect solution 3', 'text_ar': 'حل خاطئ 3', 'is_correct': False},
            ]
        },
    ]

def generate_command_file(lesson_id, data):
    """Generate command file for a lesson"""
    import re

    title = data['title']
    title_ar = data['title_ar']
    slug = re.sub(r'[^a-z0-9]+', '_', title.lower()).strip('_')

    exercises_data = []
    difficulties = ['beginner', 'beginner', 'intermediate', 'intermediate', 'advanced']

    for i, (topic_en, topic_ar) in enumerate(data['topics']):
        exercise = {
            'title': topic_en,
            'title_ar': topic_ar,
            'difficulty': difficulties[i],
            'points': 12,
            'questions': generate_generic_questions(topic_en, topic_ar, difficulties[i])
        }
        exercises_data.append(exercise)

    content = TEMPLATE.format(
        lesson_id=lesson_id,
        title=title,
        slug=slug,
        exercises_data=repr(exercises_data)
    )

    filename = f'backend/lessons/management/commands/create_lesson_{lesson_id}_{slug}.py'
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Created: {filename}")

if __name__ == '__main__':
    for lesson_id, data in LESSONS_DATA.items():
        generate_command_file(lesson_id, data)

    print(f"\\nGenerated {len(LESSONS_DATA)} command files for Batch 22!")
    print("Run them with: python manage.py create_lesson_<id>_<name>")
