# lessons/management/commands/create_lesson_1589_rational_numbers.py

from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice
from users.models import User

class Command(BaseCommand):
    help = 'Create exercises for Lesson 1589: Rational Numbers'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    def handle(self, *args, **options):
        try:
            # Get the lesson
            lesson = Lesson.objects.get(id=1589)
            self.stdout.write(f"Found lesson: {lesson.title}")

            # Delete existing exercises if flag is set
            if options['delete_existing']:
                deleted_count = Exercise.objects.filter(lesson=lesson).delete()[0]
                self.stdout.write(self.style.WARNING(f"Deleted {deleted_count} existing exercises"))

            # Get admin user for created_by field
            admin_user = User.objects.filter(is_superuser=True).first()
            if not admin_user:
                self.stdout.write(self.style.ERROR("No admin user found"))
                return

            # Define exercises data
            exercises_data = [
                {
                    'title': 'Introduction to Rational Numbers',
                    'title_ar': 'مقدمة في الأعداد الكسرية',
                    'difficulty': 'beginner',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'What is a rational number?',
                            'text_ar': 'ما هو العدد الكسري؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'A number that can be expressed as a/b where a and b are integers and b ≠ 0', 'text_ar': 'عدد يمكن التعبير عنه بالشكل a/b حيث a و b أعداد صحيحة و b ≠ 0', 'is_correct': True},
                                {'text': 'A number with a decimal point', 'text_ar': 'عدد له فاصلة عشرية', 'is_correct': False},
                                {'text': 'A negative number only', 'text_ar': 'عدد سالب فقط', 'is_correct': False},
                                {'text': 'A whole number only', 'text_ar': 'عدد صحيح فقط', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Which of the following is a rational number?',
                            'text_ar': 'أي مما يلي عدد كسري؟',
                            'type': 'qcm_multiple',
                            'points': 2,
                            'choices': [
                                {'text': '3/4', 'text_ar': '3/4', 'is_correct': True},
                                {'text': '-5/2', 'text_ar': '-5/2', 'is_correct': True},
                                {'text': '0.75 (which equals 3/4)', 'text_ar': '0.75 (والذي يساوي 3/4)', 'is_correct': True},
                                {'text': 'Square root of 2', 'text_ar': 'الجذر التربيعي لـ 2', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Is zero a rational number?',
                            'text_ar': 'هل الصفر عدد كسري؟',
                            'type': 'true_false',
                            'points': 2,
                            'choices': [
                                {'text': 'True (0 can be written as 0/1)', 'text_ar': 'صحيح (يمكن كتابة 0 على شكل 0/1)', 'is_correct': True},
                                {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Which statement about rational numbers is correct?',
                            'text_ar': 'أي عبارة عن الأعداد الكسرية صحيحة؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'All integers are rational numbers', 'text_ar': 'جميع الأعداد الصحيحة أعداد كسرية', 'is_correct': True},
                                {'text': 'All rational numbers are integers', 'text_ar': 'جميع الأعداد الكسرية أعداد صحيحة', 'is_correct': False},
                                {'text': 'Rational numbers cannot be negative', 'text_ar': 'الأعداد الكسرية لا يمكن أن تكون سالبة', 'is_correct': False},
                                {'text': 'Rational numbers must have a denominator of 1', 'text_ar': 'يجب أن يكون للأعداد الكسرية مقام يساوي 1', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is the denominator in the rational number 5/8?',
                            'text_ar': 'ما هو المقام في العدد الكسري 5/8؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '8', 'text_ar': '8', 'is_correct': True},
                                {'text': '5', 'text_ar': '5', 'is_correct': False},
                                {'text': '13', 'text_ar': '13', 'is_correct': False},
                                {'text': '3', 'text_ar': '3', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Can the denominator of a rational number be zero?',
                            'text_ar': 'هل يمكن أن يكون مقام العدد الكسري صفرا؟',
                            'type': 'true_false',
                            'points': 2,
                            'choices': [
                                {'text': 'False (division by zero is undefined)', 'text_ar': 'خطأ (القسمة على صفر غير معرفة)', 'is_correct': True},
                                {'text': 'True', 'text_ar': 'صحيح', 'is_correct': False},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Equivalent Rational Numbers',
                    'title_ar': 'الأعداد الكسرية المتساوية',
                    'difficulty': 'beginner',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'Two rational numbers are equivalent if:',
                            'text_ar': 'عددان كسريان متساويان إذا:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'They represent the same value (e.g., 1/2 = 2/4)', 'text_ar': 'يمثلان نفس القيمة (مثلا، 1/2 = 2/4)', 'is_correct': True},
                                {'text': 'They have the same numerator', 'text_ar': 'لهما نفس البسط', 'is_correct': False},
                                {'text': 'They have the same denominator', 'text_ar': 'لهما نفس المقام', 'is_correct': False},
                                {'text': 'They are both positive', 'text_ar': 'كلاهما موجبان', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Which fraction is equivalent to 2/3?',
                            'text_ar': 'أي كسر يساوي 2/3؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '4/6', 'text_ar': '4/6', 'is_correct': True},
                                {'text': '3/2', 'text_ar': '3/2', 'is_correct': False},
                                {'text': '2/6', 'text_ar': '2/6', 'is_correct': False},
                                {'text': '3/4', 'text_ar': '3/4', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'To find an equivalent fraction, you can:',
                            'text_ar': 'لإيجاد كسر مساوٍ، يمكنك:',
                            'type': 'qcm_multiple',
                            'points': 2,
                            'choices': [
                                {'text': 'Multiply both numerator and denominator by the same non-zero number', 'text_ar': 'ضرب البسط والمقام بنفس العدد غير الصفري', 'is_correct': True},
                                {'text': 'Divide both numerator and denominator by the same non-zero number', 'text_ar': 'قسمة البسط والمقام على نفس العدد غير الصفري', 'is_correct': True},
                                {'text': 'Add the same number to both numerator and denominator', 'text_ar': 'إضافة نفس العدد إلى البسط والمقام', 'is_correct': False},
                                {'text': 'Subtract the same number from both', 'text_ar': 'طرح نفس العدد من كليهما', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Is 3/6 equivalent to 1/2?',
                            'text_ar': 'هل 3/6 يساوي 1/2؟',
                            'type': 'true_false',
                            'points': 2,
                            'choices': [
                                {'text': 'True (both simplify to 1/2)', 'text_ar': 'صحيح (كلاهما يبسط إلى 1/2)', 'is_correct': True},
                                {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is 6/9 simplified to its lowest terms?',
                            'text_ar': 'ما هو تبسيط 6/9 إلى أبسط صورة؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '2/3', 'text_ar': '2/3', 'is_correct': True},
                                {'text': '3/2', 'text_ar': '3/2', 'is_correct': False},
                                {'text': '1/3', 'text_ar': '1/3', 'is_correct': False},
                                {'text': '6/9 (already simplified)', 'text_ar': '6/9 (مبسط بالفعل)', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Which of these fractions is in simplest form?',
                            'text_ar': 'أي من هذه الكسور في أبسط صورة؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '5/7', 'text_ar': '5/7', 'is_correct': True},
                                {'text': '4/8', 'text_ar': '4/8', 'is_correct': False},
                                {'text': '6/9', 'text_ar': '6/9', 'is_correct': False},
                                {'text': '10/15', 'text_ar': '10/15', 'is_correct': False},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Comparing Rational Numbers',
                    'title_ar': 'مقارنة الأعداد الكسرية',
                    'difficulty': 'intermediate',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'To compare two rational numbers with the same denominator:',
                            'text_ar': 'لمقارنة عددين كسريين لهما نفس المقام:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Compare the numerators', 'text_ar': 'قارن البسطين', 'is_correct': True},
                                {'text': 'Compare the denominators', 'text_ar': 'قارن المقامين', 'is_correct': False},
                                {'text': 'Add them together first', 'text_ar': 'اجمعهما أولا', 'is_correct': False},
                                {'text': 'Always use a calculator', 'text_ar': 'استخدم دائما آلة حاسبة', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Which is greater: 3/5 or 4/5?',
                            'text_ar': 'أيهما أكبر: 3/5 أم 4/5؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '4/5', 'text_ar': '4/5', 'is_correct': True},
                                {'text': '3/5', 'text_ar': '3/5', 'is_correct': False},
                                {'text': 'They are equal', 'text_ar': 'هما متساويان', 'is_correct': False},
                                {'text': 'Cannot be determined', 'text_ar': 'لا يمكن تحديده', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'To compare rational numbers with different denominators, you should:',
                            'text_ar': 'لمقارنة أعداد كسرية لها مقامات مختلفة، يجب:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Find a common denominator first', 'text_ar': 'إيجاد مقام مشترك أولا', 'is_correct': True},
                                {'text': 'Compare the numerators directly', 'text_ar': 'مقارنة البسطين مباشرة', 'is_correct': False},
                                {'text': 'Compare the denominators only', 'text_ar': 'مقارنة المقامين فقط', 'is_correct': False},
                                {'text': 'Multiply them together', 'text_ar': 'ضربهما معا', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Is -3/4 less than -1/2?',
                            'text_ar': 'هل -3/4 أصغر من -1/2؟',
                            'type': 'true_false',
                            'points': 2,
                            'choices': [
                                {'text': 'True (-3/4 = -0.75, -1/2 = -0.5, and -0.75 < -0.5)', 'text_ar': 'صحيح (-3/4 = -0.75، -1/2 = -0.5، و -0.75 < -0.5)', 'is_correct': True},
                                {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Which comparison is correct?',
                            'text_ar': 'أي مقارنة صحيحة؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '1/3 < 1/2', 'text_ar': '1/3 < 1/2', 'is_correct': True},
                                {'text': '1/3 > 1/2', 'text_ar': '1/3 > 1/2', 'is_correct': False},
                                {'text': '1/3 = 1/2', 'text_ar': '1/3 = 1/2', 'is_correct': False},
                                {'text': '2/3 < 1/3', 'text_ar': '2/3 < 1/3', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Arrange in ascending order: 1/4, 1/2, 1/8',
                            'text_ar': 'رتب تصاعديا: 1/4، 1/2، 1/8',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '1/8, 1/4, 1/2', 'text_ar': '1/8، 1/4، 1/2', 'is_correct': True},
                                {'text': '1/2, 1/4, 1/8', 'text_ar': '1/2، 1/4، 1/8', 'is_correct': False},
                                {'text': '1/4, 1/8, 1/2', 'text_ar': '1/4، 1/8، 1/2', 'is_correct': False},
                                {'text': '1/8, 1/2, 1/4', 'text_ar': '1/8، 1/2، 1/4', 'is_correct': False},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Rational Numbers on the Number Line',
                    'title_ar': 'الأعداد الكسرية على خط الأعداد',
                    'difficulty': 'intermediate',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'Where is the rational number 1/2 located on the number line?',
                            'text_ar': 'أين يقع العدد الكسري 1/2 على خط الأعداد؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Midway between 0 and 1', 'text_ar': 'في منتصف المسافة بين 0 و 1', 'is_correct': True},
                                {'text': 'At 0', 'text_ar': 'عند 0', 'is_correct': False},
                                {'text': 'At 1', 'text_ar': 'عند 1', 'is_correct': False},
                                {'text': 'To the left of 0', 'text_ar': 'على يسار 0', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Negative rational numbers are located:',
                            'text_ar': 'الأعداد الكسرية السالبة تقع:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'To the left of zero on the number line', 'text_ar': 'على يسار الصفر على خط الأعداد', 'is_correct': True},
                                {'text': 'To the right of zero', 'text_ar': 'على يمين الصفر', 'is_correct': False},
                                {'text': 'At zero', 'text_ar': 'عند الصفر', 'is_correct': False},
                                {'text': 'Above the number line', 'text_ar': 'فوق خط الأعداد', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Between which two consecutive integers does 7/3 lie?',
                            'text_ar': 'بين أي عددين صحيحين متتاليين يقع 7/3؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Between 2 and 3', 'text_ar': 'بين 2 و 3', 'is_correct': True},
                                {'text': 'Between 1 and 2', 'text_ar': 'بين 1 و 2', 'is_correct': False},
                                {'text': 'Between 3 and 4', 'text_ar': 'بين 3 و 4', 'is_correct': False},
                                {'text': 'Between 0 and 1', 'text_ar': 'بين 0 و 1', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Can every rational number be represented on the number line?',
                            'text_ar': 'هل يمكن تمثيل كل عدد كسري على خط الأعداد؟',
                            'type': 'true_false',
                            'points': 2,
                            'choices': [
                                {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                                {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is the opposite of 3/5 on the number line?',
                            'text_ar': 'ما هو المعاكس لـ 3/5 على خط الأعداد؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '-3/5', 'text_ar': '-3/5', 'is_correct': True},
                                {'text': '5/3', 'text_ar': '5/3', 'is_correct': False},
                                {'text': '3/5', 'text_ar': '3/5', 'is_correct': False},
                                {'text': '-5/3', 'text_ar': '-5/3', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'The distance between a rational number and zero on the number line is called:',
                            'text_ar': 'المسافة بين عدد كسري والصفر على خط الأعداد تسمى:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Absolute value', 'text_ar': 'القيمة المطلقة', 'is_correct': True},
                                {'text': 'Opposite', 'text_ar': 'المعاكس', 'is_correct': False},
                                {'text': 'Reciprocal', 'text_ar': 'المقلوب', 'is_correct': False},
                                {'text': 'Equivalent', 'text_ar': 'المساوي', 'is_correct': False},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Absolute Value and Properties',
                    'title_ar': 'القيمة المطلقة والخصائص',
                    'difficulty': 'advanced',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'What is the absolute value of -4/5?',
                            'text_ar': 'ما القيمة المطلقة لـ -4/5؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '4/5', 'text_ar': '4/5', 'is_correct': True},
                                {'text': '-4/5', 'text_ar': '-4/5', 'is_correct': False},
                                {'text': '5/4', 'text_ar': '5/4', 'is_correct': False},
                                {'text': '-5/4', 'text_ar': '-5/4', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'The absolute value of a rational number is always:',
                            'text_ar': 'القيمة المطلقة لعدد كسري دائما:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Non-negative (zero or positive)', 'text_ar': 'غير سالبة (صفر أو موجبة)', 'is_correct': True},
                                {'text': 'Negative', 'text_ar': 'سالبة', 'is_correct': False},
                                {'text': 'Greater than 1', 'text_ar': 'أكبر من 1', 'is_correct': False},
                                {'text': 'An integer', 'text_ar': 'عدد صحيح', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'If |x| = 3/4, what are the possible values of x?',
                            'text_ar': 'إذا كان |x| = 3/4، ما القيم الممكنة لـ x؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'x = 3/4 or x = -3/4', 'text_ar': 'x = 3/4 أو x = -3/4', 'is_correct': True},
                                {'text': 'x = 3/4 only', 'text_ar': 'x = 3/4 فقط', 'is_correct': False},
                                {'text': 'x = -3/4 only', 'text_ar': 'x = -3/4 فقط', 'is_correct': False},
                                {'text': 'x = 4/3 or x = -4/3', 'text_ar': 'x = 4/3 أو x = -4/3', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Is |a/b| = |a|/|b| for all rational numbers a/b (where b ≠ 0)?',
                            'text_ar': 'هل |a/b| = |a|/|b| لجميع الأعداد الكسرية a/b (حيث b ≠ 0)؟',
                            'type': 'true_false',
                            'points': 2,
                            'choices': [
                                {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                                {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Which property is true about absolute values?',
                            'text_ar': 'أي خاصية صحيحة عن القيم المطلقة؟',
                            'type': 'qcm_multiple',
                            'points': 2,
                            'choices': [
                                {'text': '|a + b| ≤ |a| + |b| (triangle inequality)', 'text_ar': '|a + b| ≤ |a| + |b| (متباينة المثلث)', 'is_correct': True},
                                {'text': '|a × b| = |a| × |b|', 'text_ar': '|a × b| = |a| × |b|', 'is_correct': True},
                                {'text': '|-a| = |a|', 'text_ar': '|-a| = |a|', 'is_correct': True},
                                {'text': '|a| is always negative', 'text_ar': '|a| دائما سالبة', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is |0|?',
                            'text_ar': 'ما قيمة |0|؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '0', 'text_ar': '0', 'is_correct': True},
                                {'text': '1', 'text_ar': '1', 'is_correct': False},
                                {'text': 'Undefined', 'text_ar': 'غير معرفة', 'is_correct': False},
                                {'text': 'Infinity', 'text_ar': 'ما لا نهاية', 'is_correct': False},
                            ]
                        },
                    ]
                },
            ]

            # Create exercises
            for exercise_data in exercises_data:
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
                        question_type=q_data['type'],
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

                self.stdout.write(f"Created exercise: {exercise.title}")

            self.stdout.write(self.style.SUCCESS(
                f"Successfully created {len(exercises_data)} exercises for lesson {lesson.id}"
            ))

        except Lesson.DoesNotExist:
            self.stdout.write(self.style.ERROR("Lesson 1589 not found"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {str(e)}"))
