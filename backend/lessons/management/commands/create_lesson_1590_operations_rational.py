# lessons/management/commands/create_lesson_1590_operations_rational.py

from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice
from users.models import User

class Command(BaseCommand):
    help = 'Create exercises for Lesson 1590: Operations on Rational Numbers'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=1590)
            self.stdout.write(f"Found lesson: {lesson.title}")

            if options['delete_existing']:
                deleted_count = Exercise.objects.filter(lesson=lesson).delete()[0]
                self.stdout.write(self.style.WARNING(f"Deleted {deleted_count} existing exercises"))

            admin_user = User.objects.filter(is_superuser=True).first()
            if not admin_user:
                self.stdout.write(self.style.ERROR("No admin user found"))
                return

            exercises_data = [
                {
                    'title': 'Addition of Rational Numbers - Same Denominator',
                    'title_ar': 'جمع الأعداد الكسرية - نفس المقام',
                    'difficulty': 'beginner',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'To add two rational numbers with the same denominator, you:',
                            'text_ar': 'لجمع عددين كسريين لهما نفس المقام:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Add the numerators and keep the denominator', 'text_ar': 'اجمع البسطين واحتفظ بالمقام', 'is_correct': True},
                                {'text': 'Add both numerators and denominators', 'text_ar': 'اجمع البسطين والمقامين', 'is_correct': False},
                                {'text': 'Add the denominators only', 'text_ar': 'اجمع المقامين فقط', 'is_correct': False},
                                {'text': 'Multiply the fractions', 'text_ar': 'اضرب الكسور', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Calculate: 2/7 + 3/7',
                            'text_ar': 'احسب: 2/7 + 3/7',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '5/7', 'text_ar': '5/7', 'is_correct': True},
                                {'text': '5/14', 'text_ar': '5/14', 'is_correct': False},
                                {'text': '2/7', 'text_ar': '2/7', 'is_correct': False},
                                {'text': '6/49', 'text_ar': '6/49', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is 1/5 + 3/5?',
                            'text_ar': 'ما قيمة 1/5 + 3/5؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '4/5', 'text_ar': '4/5', 'is_correct': True},
                                {'text': '4/10', 'text_ar': '4/10', 'is_correct': False},
                                {'text': '3/5', 'text_ar': '3/5', 'is_correct': False},
                                {'text': '1/5', 'text_ar': '1/5', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'When adding 5/9 + 2/9, the result is:',
                            'text_ar': 'عند جمع 5/9 + 2/9، النتيجة هي:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '7/9', 'text_ar': '7/9', 'is_correct': True},
                                {'text': '7/18', 'text_ar': '7/18', 'is_correct': False},
                                {'text': '10/81', 'text_ar': '10/81', 'is_correct': False},
                                {'text': '3/9', 'text_ar': '3/9', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Is (a/c) + (b/c) = (a+b)/c?',
                            'text_ar': 'هل (a/c) + (b/c) = (a+b)/c؟',
                            'type': 'true_false',
                            'points': 2,
                            'choices': [
                                {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                                {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Simplify: 3/8 + 5/8',
                            'text_ar': 'بسط: 3/8 + 5/8',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '8/8 = 1', 'text_ar': '8/8 = 1', 'is_correct': True},
                                {'text': '8/16', 'text_ar': '8/16', 'is_correct': False},
                                {'text': '15/64', 'text_ar': '15/64', 'is_correct': False},
                                {'text': '2/8', 'text_ar': '2/8', 'is_correct': False},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Subtraction of Rational Numbers',
                    'title_ar': 'طرح الأعداد الكسرية',
                    'difficulty': 'beginner',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'To subtract rational numbers with the same denominator:',
                            'text_ar': 'لطرح أعداد كسرية لها نفس المقام:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Subtract the numerators and keep the denominator', 'text_ar': 'اطرح البسطين واحتفظ بالمقام', 'is_correct': True},
                                {'text': 'Subtract both numerators and denominators', 'text_ar': 'اطرح البسطين والمقامين', 'is_correct': False},
                                {'text': 'Divide the fractions', 'text_ar': 'اقسم الكسور', 'is_correct': False},
                                {'text': 'Add them first', 'text_ar': 'اجمعهما أولا', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Calculate: 7/10 - 3/10',
                            'text_ar': 'احسب: 7/10 - 3/10',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '4/10 = 2/5', 'text_ar': '4/10 = 2/5', 'is_correct': True},
                                {'text': '4/20', 'text_ar': '4/20', 'is_correct': False},
                                {'text': '10/10', 'text_ar': '10/10', 'is_correct': False},
                                {'text': '21/100', 'text_ar': '21/100', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is 5/6 - 1/6?',
                            'text_ar': 'ما قيمة 5/6 - 1/6؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '4/6 = 2/3', 'text_ar': '4/6 = 2/3', 'is_correct': True},
                                {'text': '4/12', 'text_ar': '4/12', 'is_correct': False},
                                {'text': '6/6', 'text_ar': '6/6', 'is_correct': False},
                                {'text': '5/36', 'text_ar': '5/36', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Calculate: 3/4 - 3/4',
                            'text_ar': 'احسب: 3/4 - 3/4',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '0', 'text_ar': '0', 'is_correct': True},
                                {'text': '6/4', 'text_ar': '6/4', 'is_correct': False},
                                {'text': '0/8', 'text_ar': '0/8', 'is_correct': False},
                                {'text': '9/16', 'text_ar': '9/16', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Is subtraction of rational numbers commutative (a - b = b - a)?',
                            'text_ar': 'هل طرح الأعداد الكسرية تبديلي (a - b = b - a)؟',
                            'type': 'true_false',
                            'points': 2,
                            'choices': [
                                {'text': 'False (subtraction is not commutative)', 'text_ar': 'خطأ (الطرح ليس تبديليا)', 'is_correct': True},
                                {'text': 'True', 'text_ar': 'صحيح', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is 11/12 - 5/12?',
                            'text_ar': 'ما قيمة 11/12 - 5/12؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '6/12 = 1/2', 'text_ar': '6/12 = 1/2', 'is_correct': True},
                                {'text': '6/24', 'text_ar': '6/24', 'is_correct': False},
                                {'text': '16/12', 'text_ar': '16/12', 'is_correct': False},
                                {'text': '55/144', 'text_ar': '55/144', 'is_correct': False},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Multiplication of Rational Numbers',
                    'title_ar': 'ضرب الأعداد الكسرية',
                    'difficulty': 'intermediate',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'To multiply two rational numbers:',
                            'text_ar': 'لضرب عددين كسريين:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Multiply numerators together and denominators together', 'text_ar': 'اضرب البسطين معا والمقامين معا', 'is_correct': True},
                                {'text': 'Add numerators and denominators', 'text_ar': 'اجمع البسطين والمقامين', 'is_correct': False},
                                {'text': 'Find common denominator first', 'text_ar': 'أوجد مقاما مشتركا أولا', 'is_correct': False},
                                {'text': 'Multiply numerators only', 'text_ar': 'اضرب البسطين فقط', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Calculate: (2/3) × (4/5)',
                            'text_ar': 'احسب: (2/3) × (4/5)',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '8/15', 'text_ar': '8/15', 'is_correct': True},
                                {'text': '6/8', 'text_ar': '6/8', 'is_correct': False},
                                {'text': '6/15', 'text_ar': '6/15', 'is_correct': False},
                                {'text': '8/8', 'text_ar': '8/8', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is (3/4) × (2/3)?',
                            'text_ar': 'ما قيمة (3/4) × (2/3)؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '6/12 = 1/2', 'text_ar': '6/12 = 1/2', 'is_correct': True},
                                {'text': '5/7', 'text_ar': '5/7', 'is_correct': False},
                                {'text': '6/7', 'text_ar': '6/7', 'is_correct': False},
                                {'text': '9/8', 'text_ar': '9/8', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'The product of any rational number and zero is:',
                            'text_ar': 'ناتج ضرب أي عدد كسري في الصفر هو:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '0', 'text_ar': '0', 'is_correct': True},
                                {'text': '1', 'text_ar': '1', 'is_correct': False},
                                {'text': 'The number itself', 'text_ar': 'العدد نفسه', 'is_correct': False},
                                {'text': 'Undefined', 'text_ar': 'غير معرف', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Is multiplication of rational numbers commutative (a × b = b × a)?',
                            'text_ar': 'هل ضرب الأعداد الكسرية تبديلي (a × b = b × a)؟',
                            'type': 'true_false',
                            'points': 2,
                            'choices': [
                                {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                                {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Calculate: (-2/5) × (3/7)',
                            'text_ar': 'احسب: (-2/5) × (3/7)',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '-6/35', 'text_ar': '-6/35', 'is_correct': True},
                                {'text': '6/35', 'text_ar': '6/35', 'is_correct': False},
                                {'text': '-6/12', 'text_ar': '-6/12', 'is_correct': False},
                                {'text': '1/12', 'text_ar': '1/12', 'is_correct': False},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Division of Rational Numbers',
                    'title_ar': 'قسمة الأعداد الكسرية',
                    'difficulty': 'intermediate',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'To divide one rational number by another:',
                            'text_ar': 'لقسمة عدد كسري على آخر:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Multiply by the reciprocal of the divisor', 'text_ar': 'اضرب في مقلوب المقسوم عليه', 'is_correct': True},
                                {'text': 'Divide numerators and denominators separately', 'text_ar': 'اقسم البسطين والمقامين منفصلين', 'is_correct': False},
                                {'text': 'Add the fractions', 'text_ar': 'اجمع الكسور', 'is_correct': False},
                                {'text': 'Find common denominator', 'text_ar': 'أوجد مقاما مشتركا', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is the reciprocal of 3/4?',
                            'text_ar': 'ما مقلوب 3/4؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '4/3', 'text_ar': '4/3', 'is_correct': True},
                                {'text': '3/4', 'text_ar': '3/4', 'is_correct': False},
                                {'text': '-3/4', 'text_ar': '-3/4', 'is_correct': False},
                                {'text': '1/12', 'text_ar': '1/12', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Calculate: (2/3) ÷ (4/5)',
                            'text_ar': 'احسب: (2/3) ÷ (4/5)',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '(2/3) × (5/4) = 10/12 = 5/6', 'text_ar': '(2/3) × (5/4) = 10/12 = 5/6', 'is_correct': True},
                                {'text': '8/15', 'text_ar': '8/15', 'is_correct': False},
                                {'text': '2/12', 'text_ar': '2/12', 'is_correct': False},
                                {'text': '6/5', 'text_ar': '6/5', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is (3/5) ÷ (1/2)?',
                            'text_ar': 'ما قيمة (3/5) ÷ (1/2)؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '(3/5) × 2 = 6/5', 'text_ar': '(3/5) × 2 = 6/5', 'is_correct': True},
                                {'text': '3/10', 'text_ar': '3/10', 'is_correct': False},
                                {'text': '3/7', 'text_ar': '3/7', 'is_correct': False},
                                {'text': '5/3', 'text_ar': '5/3', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Can you divide a rational number by zero?',
                            'text_ar': 'هل يمكنك قسمة عدد كسري على صفر؟',
                            'type': 'true_false',
                            'points': 2,
                            'choices': [
                                {'text': 'False (division by zero is undefined)', 'text_ar': 'خطأ (القسمة على صفر غير معرفة)', 'is_correct': True},
                                {'text': 'True', 'text_ar': 'صحيح', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Calculate: (5/6) ÷ (5/6)',
                            'text_ar': 'احسب: (5/6) ÷ (5/6)',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '1', 'text_ar': '1', 'is_correct': True},
                                {'text': '0', 'text_ar': '0', 'is_correct': False},
                                {'text': '25/36', 'text_ar': '25/36', 'is_correct': False},
                                {'text': '10/12', 'text_ar': '10/12', 'is_correct': False},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Properties of Operations on Rational Numbers',
                    'title_ar': 'خصائص العمليات على الأعداد الكسرية',
                    'difficulty': 'advanced',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'Which operations on rational numbers are commutative?',
                            'text_ar': 'أي العمليات على الأعداد الكسرية تبديلية؟',
                            'type': 'qcm_multiple',
                            'points': 2,
                            'choices': [
                                {'text': 'Addition', 'text_ar': 'الجمع', 'is_correct': True},
                                {'text': 'Multiplication', 'text_ar': 'الضرب', 'is_correct': True},
                                {'text': 'Subtraction', 'text_ar': 'الطرح', 'is_correct': False},
                                {'text': 'Division', 'text_ar': 'القسمة', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is the additive identity for rational numbers?',
                            'text_ar': 'ما العنصر المحايد للجمع في الأعداد الكسرية؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '0 (because a + 0 = a)', 'text_ar': '0 (لأن a + 0 = a)', 'is_correct': True},
                                {'text': '1', 'text_ar': '1', 'is_correct': False},
                                {'text': '-1', 'text_ar': '-1', 'is_correct': False},
                                {'text': 'No identity exists', 'text_ar': 'لا يوجد عنصر محايد', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is the multiplicative identity for rational numbers?',
                            'text_ar': 'ما العنصر المحايد للضرب في الأعداد الكسرية؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '1 (because a × 1 = a)', 'text_ar': '1 (لأن a × 1 = a)', 'is_correct': True},
                                {'text': '0', 'text_ar': '0', 'is_correct': False},
                                {'text': 'a/a', 'text_ar': 'a/a', 'is_correct': False},
                                {'text': 'No identity exists', 'text_ar': 'لا يوجد عنصر محايد', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'The distributive property states that:',
                            'text_ar': 'خاصية التوزيع تنص على:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'a × (b + c) = (a × b) + (a × c)', 'text_ar': 'a × (b + c) = (a × b) + (a × c)', 'is_correct': True},
                                {'text': 'a + (b × c) = (a + b) × (a + c)', 'text_ar': 'a + (b × c) = (a + b) × (a + c)', 'is_correct': False},
                                {'text': 'a × b = b × a', 'text_ar': 'a × b = b × a', 'is_correct': False},
                                {'text': 'a ÷ b = b ÷ a', 'text_ar': 'a ÷ b = b ÷ a', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Is addition of rational numbers associative: (a + b) + c = a + (b + c)?',
                            'text_ar': 'هل جمع الأعداد الكسرية تجميعي: (a + b) + c = a + (b + c)؟',
                            'type': 'true_false',
                            'points': 2,
                            'choices': [
                                {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                                {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is the additive inverse of 3/5?',
                            'text_ar': 'ما المعكوس الجمعي لـ 3/5؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '-3/5 (because 3/5 + (-3/5) = 0)', 'text_ar': '-3/5 (لأن 3/5 + (-3/5) = 0)', 'is_correct': True},
                                {'text': '5/3', 'text_ar': '5/3', 'is_correct': False},
                                {'text': '-5/3', 'text_ar': '-5/3', 'is_correct': False},
                                {'text': '3/5', 'text_ar': '3/5', 'is_correct': False},
                            ]
                        },
                    ]
                },
            ]

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

                self.stdout.write(f"Created exercise: {exercise.title}")

            self.stdout.write(self.style.SUCCESS(
                f"Successfully created {len(exercises_data)} exercises for lesson {lesson.id}"
            ))

        except Lesson.DoesNotExist:
            self.stdout.write(self.style.ERROR("Lesson 1590 not found"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {str(e)}"))
