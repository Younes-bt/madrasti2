#!/usr/bin/env python
"""
Script to generate remaining command files for Batch 20 (lessons 1591-1598)
This creates simplified but complete command files with 5 exercises × 6 questions each
"""

LESSONS_DATA = {
    1591: {
        'title': 'Sum and Difference of Two Rational Numbers',
        'title_ar': 'جمع وطرح عددين كسريين',
        'topics': [
            ('Finding Common Denominators', 'إيجاد المقام المشترك'),
            ('Adding with Different Denominators', 'الجمع بمقامات مختلفة'),
            ('Subtracting with Different Denominators', 'الطرح بمقامات مختلفة'),
            ('Mixed Numbers and Improper Fractions', 'الأعداد المختلطة والكسور غير الفعلية'),
            ('Word Problems with Addition and Subtraction', 'مسائل كلامية عن الجمع والطرح')
        ]
    },
    1592: {
        'title': 'Product and Quotient of Two Rational Numbers',
        'title_ar': 'ضرب وقسمة عددين كسريين',
        'topics': [
            ('Multiplying Rational Numbers', 'ضرب الأعداد الكسرية'),
            ('Simplifying Before Multiplying', 'التبسيط قبل الضرب'),
            ('Dividing Rational Numbers', 'قسمة الأعداد الكسرية'),
            ('Reciprocals and Division', 'المقلوبات والقسمة'),
            ('Combined Multiplication and Division', 'الضرب والقسمة معا')
        ]
    },
    1593: {
        'title': 'Four Operations on Rational Numbers',
        'title_ar': 'العمليات الأربع على الأعداد الكسرية',
        'topics': [
            ('Order of Operations (PEMDAS)', 'ترتيب العمليات'),
            ('Mixed Operations with Parentheses', 'عمليات مختلطة مع أقواس'),
            ('Complex Expressions', 'تعابير معقدة'),
            ('Simplifying Complex Fractions', 'تبسيط الكسور المعقدة'),
            ('Problem Solving with Multiple Operations', 'حل المسائل بعمليات متعددة')
        ]
    },
    1594: {
        'title': 'Powers of 10',
        'title_ar': 'قوى العدد 10',
        'topics': [
            ('Understanding Powers of 10', 'فهم قوى العدد 10'),
            ('Positive Exponents', 'الأسس الموجبة'),
            ('Negative Exponents', 'الأسس السالبة'),
            ('Scientific Notation', 'الترميز العلمي'),
            ('Operations with Powers of 10', 'العمليات على قوى العدد 10')
        ]
    },
    1595: {
        'title': 'Powers of a Rational Number',
        'title_ar': 'قوى عدد كسري',
        'topics': [
            ('Definition of Powers', 'تعريف القوى'),
            ('Positive Integer Exponents', 'الأسس الصحيحة الموجبة'),
            ('Negative Integer Exponents', 'الأسس الصحيحة السالبة'),
            ('Zero Exponent', 'الأس الصفري'),
            ('Properties of Exponents', 'خصائص الأسس')
        ]
    },
    1596: {
        'title': 'Axial Symmetry',
        'title_ar': 'التناظر المحوري',
        'topics': [
            ('Definition of Axial Symmetry', 'تعريف التناظر المحوري'),
            ('Axis of Symmetry', 'محور التناظر'),
            ('Properties of Symmetric Figures', 'خصائص الأشكال المتناظرة'),
            ('Constructing Symmetric Figures', 'إنشاء أشكال متناظرة'),
            ('Applications of Symmetry', 'تطبيقات التناظر')
        ]
    },
    1597: {
        'title': 'Lines Parallel to the Sides of a Triangle',
        'title_ar': 'المستقيمات الموازية لأضلاع مثلث',
        'topics': [
            ('Parallel Lines in Triangles', 'المستقيمات الموازية في المثلثات'),
            ('Proportional Segments', 'القطع المتناسبة'),
            ('Thales Theorem', 'مبرهنة طاليس'),
            ('Applications of Parallel Lines', 'تطبيقات المستقيمات الموازية'),
            ('Problem Solving', 'حل المسائل')
        ]
    },
    1598: {
        'title': 'Important Lines in a Triangle',
        'title_ar': 'المستقيمات الهامة في مثلث',
        'topics': [
            ('Medians of a Triangle', 'متوسطات المثلث'),
            ('Altitudes of a Triangle', 'ارتفاعات المثلث'),
            ('Angle Bisectors', 'منصفات الزوايا'),
            ('Perpendicular Bisectors', 'المنصفات العمودية'),
            ('Special Points in Triangles', 'النقاط الخاصة في المثلثات')
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

    print(f"\\nGenerated {len(LESSONS_DATA)} command files!")
    print("Run them with: python manage.py create_lesson_<id>_<name>")
