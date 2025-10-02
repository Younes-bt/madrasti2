#!/usr/bin/env python
"""
Script to generate command files for Batch 23 (lessons 1205-1214)
First Year Middle School Mathematics
"""

LESSONS_DATA = {
    1205: {
        'title': 'Operations on Decimal Numbers',
        'title_ar': 'العمليات على الأعداد العشرية',
        'topics': [
            ('Addition of Decimal Numbers', 'جمع الأعداد العشرية'),
            ('Subtraction of Decimal Numbers', 'طرح الأعداد العشرية'),
            ('Multiplication of Decimal Numbers', 'ضرب الأعداد العشرية'),
            ('Division of Decimal Numbers', 'قسمة الأعداد العشرية'),
            ('Order of Operations with Decimals', 'ترتيب العمليات على الأعداد العشرية')
        ]
    },
    1206: {
        'title': 'Numbers in Fractional Form',
        'title_ar': 'الأعداد الكسرية',
        'topics': [
            ('Introduction to Fractions', 'مقدمة في الكسور'),
            ('Equivalent Fractions', 'الكسور المتكافئة'),
            ('Comparing Fractions', 'مقارنة الكسور'),
            ('Operations on Fractions', 'العمليات على الكسور'),
            ('Mixed Numbers and Improper Fractions', 'الأعداد المختلطة والكسور غير الفعلية')
        ]
    },
    1207: {
        'title': 'Angles',
        'title_ar': 'الزوايا',
        'topics': [
            ('What are Angles?', 'ما هي الزوايا؟'),
            ('Types of Angles', 'أنواع الزوايا'),
            ('Measuring Angles', 'قياس الزوايا'),
            ('Angle Relationships', 'علاقات الزوايا'),
            ('Complementary and Supplementary Angles', 'الزوايا المتتامة والمتكاملة')
        ]
    },
    1208: {
        'title': 'Triangle',
        'title_ar': 'المثلث',
        'topics': [
            ('Introduction to Triangles', 'مقدمة في المثلثات'),
            ('Types of Triangles', 'أنواع المثلثات'),
            ('Properties of Triangles', 'خصائص المثلثات'),
            ('Angle Sum in Triangles', 'مجموع زوايا المثلث'),
            ('Construction of Triangles', 'إنشاء المثلثات')
        ]
    },
    1209: {
        'title': 'Perpendicular Bisector and Triangle Inequality',
        'title_ar': 'المنصف العمودي ومتباينة المثلث',
        'topics': [
            ('Perpendicular Bisector', 'المنصف العمودي'),
            ('Properties of Perpendicular Bisector', 'خصائص المنصف العمودي'),
            ('Triangle Inequality Theorem', 'مبرهنة متباينة المثلث'),
            ('Applications of Triangle Inequality', 'تطبيقات متباينة المثلث'),
            ('Problem Solving', 'حل المسائل')
        ]
    },
    1210: {
        'title': 'Notable Lines of a Triangle',
        'title_ar': 'المستقيمات الهامة في المثلث',
        'topics': [
            ('Medians', 'المتوسطات'),
            ('Altitudes', 'الارتفاعات'),
            ('Angle Bisectors', 'منصفات الزوايا'),
            ('Perpendicular Bisectors of Sides', 'المنصفات العمودية للأضلاع'),
            ('Centers of a Triangle', 'مراكز المثلث')
        ]
    },
    1211: {
        'title': 'Relative Numbers',
        'title_ar': 'الأعداد النسبية',
        'topics': [
            ('Introduction to Relative Numbers', 'مقدمة في الأعداد النسبية'),
            ('Positive and Negative Numbers', 'الأعداد الموجبة والسالبة'),
            ('Number Line', 'خط الأعداد'),
            ('Comparing Relative Numbers', 'مقارنة الأعداد النسبية'),
            ('Absolute Value', 'القيمة المطلقة')
        ]
    },
    1212: {
        'title': 'Powers',
        'title_ar': 'القوى',
        'topics': [
            ('Introduction to Powers', 'مقدمة في القوى'),
            ('Positive Integer Exponents', 'الأسس الصحيحة الموجبة'),
            ('Properties of Powers', 'خصائص القوى'),
            ('Multiplication and Division of Powers', 'ضرب وقسمة القوى'),
            ('Power of a Power', 'قوة القوة')
        ]
    },
    1213: {
        'title': 'Development and Factorization',
        'title_ar': 'النشر والتعميل',
        'topics': [
            ('Expanding Expressions', 'نشر التعابير'),
            ('Distributive Property', 'خاصية التوزيع'),
            ('Factoring Expressions', 'تعميل التعابير'),
            ('Common Factors', 'العوامل المشتركة'),
            ('Applications', 'التطبيقات')
        ]
    },
    1214: {
        'title': 'Equations',
        'title_ar': 'المعادلات',
        'topics': [
            ('What is an Equation?', 'ما هي المعادلة؟'),
            ('Solving Linear Equations', 'حل المعادلات الخطية'),
            ('Equations with One Variable', 'معادلات بمجهول واحد'),
            ('Checking Solutions', 'التحقق من الحلول'),
            ('Word Problems with Equations', 'مسائل كلامية على المعادلات')
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

    print(f"\\nGenerated {len(LESSONS_DATA)} command files for Batch 23!")
    print("Run them with: python manage.py create_lesson_<id>_<name>")
