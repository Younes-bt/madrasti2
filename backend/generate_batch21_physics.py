#!/usr/bin/env python
"""
Script to generate command files for Batch 21 (lessons 1570-1579)
Second Year Middle School Physics
"""

LESSONS_DATA = {
    1570: {
        'title': 'Air Around Us',
        'title_ar': 'الهواء من حولنا',
        'topics': [
            ('Introduction to Air', 'مقدمة عن الهواء'),
            ('Composition of Air', 'تركيب الهواء'),
            ('Properties of Air', 'خصائص الهواء'),
            ('Air and Living Organisms', 'الهواء والكائنات الحية'),
            ('Importance of Air', 'أهمية الهواء')
        ]
    },
    1571: {
        'title': 'Properties of Air',
        'title_ar': 'خصائص الهواء',
        'topics': [
            ('Air Has Mass', 'الهواء له كتلة'),
            ('Air Occupies Space', 'الهواء يشغل حيزا'),
            ('Air Pressure', 'ضغط الهواء'),
            ('Air Can Be Compressed', 'الهواء قابل للانضغاط'),
            ('Applications of Air Properties', 'تطبيقات خصائص الهواء')
        ]
    },
    1572: {
        'title': 'Molecules and Atoms',
        'title_ar': 'الجزيئات والذرات',
        'topics': [
            ('Introduction to Matter', 'مقدمة عن المادة'),
            ('Atoms: Building Blocks', 'الذرات: وحدات البناء'),
            ('Molecules', 'الجزيئات'),
            ('Elements and Compounds', 'العناصر والمركبات'),
            ('Chemical Symbols and Formulas', 'الرموز والصيغ الكيميائية')
        ]
    },
    1573: {
        'title': 'Combustion',
        'title_ar': 'الاحتراق',
        'topics': [
            ('What is Combustion?', 'ما هو الاحتراق؟'),
            ('Conditions for Combustion', 'شروط الاحتراق'),
            ('Types of Combustion', 'أنواع الاحتراق'),
            ('Products of Combustion', 'نواتج الاحتراق'),
            ('Safety and Fire Prevention', 'السلامة والوقاية من الحرائق')
        ]
    },
    1574: {
        'title': 'Chemical Reaction: Concept and Laws',
        'title_ar': 'التفاعل الكيميائي: المفهوم والقوانين',
        'topics': [
            ('Definition of Chemical Reaction', 'تعريف التفاعل الكيميائي'),
            ('Reactants and Products', 'المتفاعلات والنواتج'),
            ('Law of Conservation of Mass', 'قانون حفظ الكتلة'),
            ('Chemical Equations', 'المعادلات الكيميائية'),
            ('Balancing Chemical Equations', 'موازنة المعادلات الكيميائية')
        ]
    },
    1575: {
        'title': 'Concept of Chemical Reaction',
        'title_ar': 'مفهوم التفاعل الكيميائي',
        'topics': [
            ('Physical vs Chemical Changes', 'التغيرات الفيزيائية والكيميائية'),
            ('Evidence of Chemical Reactions', 'أدلة التفاعلات الكيميائية'),
            ('Energy in Chemical Reactions', 'الطاقة في التفاعلات الكيميائية'),
            ('Rate of Chemical Reactions', 'سرعة التفاعلات الكيميائية'),
            ('Examples of Common Reactions', 'أمثلة على تفاعلات شائعة')
        ]
    },
    1576: {
        'title': 'Natural and Synthetic Materials',
        'title_ar': 'المواد الطبيعية والاصطناعية',
        'topics': [
            ('Natural Materials', 'المواد الطبيعية'),
            ('Synthetic Materials', 'المواد الاصطناعية'),
            ('Properties Comparison', 'مقارنة الخصائص'),
            ('Manufacturing Synthetic Materials', 'تصنيع المواد الاصطناعية'),
            ('Environmental Impact', 'التأثير البيئي')
        ]
    },
    1577: {
        'title': 'Air Pollution',
        'title_ar': 'تلوث الهواء',
        'topics': [
            ('Sources of Air Pollution', 'مصادر تلوث الهواء'),
            ('Types of Air Pollutants', 'أنواع ملوثات الهواء'),
            ('Effects of Air Pollution', 'آثار تلوث الهواء'),
            ('Air Quality and Health', 'جودة الهواء والصحة'),
            ('Prevention and Solutions', 'الوقاية والحلول')
        ]
    },
    1578: {
        'title': 'Light Around Us',
        'title_ar': 'الضوء من حولنا',
        'topics': [
            ('What is Light?', 'ما هو الضوء؟'),
            ('Properties of Light', 'خصائص الضوء'),
            ('Light Travels in Straight Lines', 'الضوء يسير في خطوط مستقيمة'),
            ('Speed of Light', 'سرعة الضوء'),
            ('Light and Shadows', 'الضوء والظلال')
        ]
    },
    1579: {
        'title': 'Light Sources and Receivers',
        'title_ar': 'مصادر الضوء ومستقبلاته',
        'topics': [
            ('Natural Light Sources', 'مصادر الضوء الطبيعية'),
            ('Artificial Light Sources', 'مصادر الضوء الاصطناعية'),
            ('Luminous and Non-Luminous Objects', 'الأجسام المضيئة وغير المضيئة'),
            ('Light Receivers and Vision', 'مستقبلات الضوء والرؤية'),
            ('Applications of Light Sources', 'تطبيقات مصادر الضوء')
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

    print(f"\\nGenerated {len(LESSONS_DATA)} command files for Batch 21!")
    print("Run them with: python manage.py create_lesson_<id>_<name>")
