"""
Management Command for Creating Exercises for Lesson: Human genetics (ID 108)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward


class Command(BaseCommand):
    help = 'Create exercises for "Human genetics" - Lesson ID: 108'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            dest='delete_existing',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        lesson_id = 108
        try:
            lesson = Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'Lesson with ID {lesson_id} not found.'))
            return

        if options.get('delete_existing'):
            Exercise.objects.filter(lesson=lesson).delete()
            self.stdout.write(self.style.WARNING(f'Deleted existing exercises for lesson ID: {lesson.id}'))

        exercises_data = [
            {
                'title': 'Human Chromosomes and Karyotypes', 'title_arabic': 'الصبغيات البشرية والأنماط النووية', 'difficulty': 'beginner',
                'questions': [
                    {'type': 'qcm_single', 'text': 'A visual representation of an individual\'s chromosomes arranged in order is called a:', 'text_arabic': 'يسمى التمثيل البصري لصبغيات الفرد مرتبة بالترتيب:', 'points': 2.0, 'choices': [
                        {'text': 'Karyotype', 'text_arabic': 'النمط النووي', 'is_correct': True},
                        {'text': 'Genotype', 'text_arabic': 'النمط الوراثي', 'is_correct': False},
                        {'text': 'Phenotype', 'text_arabic': 'النمط الظاهري', 'is_correct': False},
                        {'text': 'Genome', 'text_arabic': 'الجينوم', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Humans have 22 pairs of autosomes and 1 pair of sex chromosomes.', 'text_arabic': 'لدى البشر 22 زوجًا من الصبغيات الجسمية وزوج واحد من الصبغيات الجنسية.', 'points': 2.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'qcm_single', 'text': 'Which combination of sex chromosomes results in a male?', 'text_arabic': 'أي مزيج من الصبغيات الجنسية ينتج عنه ذكر؟', 'points': 2.0, 'choices': [
                        {'text': 'XY', 'text_arabic': 'XY', 'is_correct': True},
                        {'text': 'XX', 'text_arabic': 'XX', 'is_correct': False},
                        {'text': 'XO', 'text_arabic': 'XO', 'is_correct': False},
                        {'text': 'YY', 'text_arabic': 'YY', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What are chromosomes that are not sex chromosomes called?', 'text_arabic': 'ماذا تسمى الصبغيات التي ليست صبغيات جنسية؟', 'points': 3.0, 'explanation': 'Autosomes', 'explanation_arabic': 'الصبغيات الجسمية'},
                    {'type': 'qcm_single', 'text': 'A normal human karyotype has a total of how many chromosomes?', 'text_arabic': 'يحتوي النمط النووي البشري الطبيعي على إجمالي كم عدد من الصبغيات؟', 'points': 2.0, 'choices': [
                        {'text': '46', 'text_arabic': '46', 'is_correct': True},
                        {'text': '23', 'text_arabic': '23', 'is_correct': False},
                        {'text': '48', 'text_arabic': '48', 'is_correct': False},
                        {'text': '44', 'text_arabic': '44', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'A karyotype can be used to diagnose genetic disorders caused by an abnormal number of chromosomes.', 'text_arabic': 'يمكن استخدام النمط النووي لتشخيص الاضطرابات الوراثية الناتجة عن عدد غير طبيعي من الصبغيات.', 'points': 2.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]}
                ]
            },
            {
                'title': 'Pedigree Analysis', 'title_arabic': 'تحليل شجرة النسب', 'difficulty': 'intermediate',
                'questions': [
                    {'type': 'qcm_single', 'text': 'In a pedigree chart, what does a square represent?', 'text_arabic': 'في مخطط شجرة النسب، ماذا يمثل المربع؟', 'points': 3.0, 'choices': [
                        {'text': 'A male', 'text_arabic': 'ذكر', 'is_correct': True},
                        {'text': 'A female', 'text_arabic': 'أنثى', 'is_correct': False},
                        {'text': 'An affected individual', 'text_arabic': 'فرد مصاب', 'is_correct': False},
                        {'text': 'A deceased individual', 'text_arabic': 'فرد متوفى', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What does a horizontal line connecting a square and a circle represent in a pedigree?', 'text_arabic': 'ماذا يمثل الخط الأفقي الذي يربط بين مربع ودائرة في شجرة النسب؟', 'points': 4.0, 'explanation': 'Mating or marriage', 'explanation_arabic': 'تزاوج أو زواج'},
                    {'type': 'qcm_single', 'text': 'If a trait appears in every generation, it is most likely:', 'text_arabic': 'إذا ظهرت صفة في كل جيل، فمن المرجح أن تكون:', 'points': 4.0, 'choices': [
                        {'text': 'Dominant', 'text_arabic': 'سائدة', 'is_correct': True},
                        {'text': 'Recessive', 'text_arabic': 'متنحية', 'is_correct': False},
                        {'text': 'Sex-linked', 'text_arabic': 'مرتبطة بالجنس', 'is_correct': False},
                        {'text': 'Polygenic', 'text_arabic': 'متعددة الجينات', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'A shaded symbol in a pedigree represents an individual who is affected by the trait being studied.', 'text_arabic': 'يمثل الرمز المظلل في شجرة النسب فردًا مصابًا بالصفة قيد الدراسة.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'open_short', 'text': 'If two unaffected parents have an affected child, what is the likely mode of inheritance for the trait?', 'text_arabic': 'إذا كان لوالدين غير مصابين طفل مصاب، فما هو نمط الوراثة المحتمل للصفة؟', 'points': 5.0, 'explanation': 'Autosomal recessive', 'explanation_arabic': 'جسمي متنحي'},
                    {'type': 'qcm_single', 'text': 'What does a circle represent in a pedigree chart?', 'text_arabic': 'ماذا تمثل الدائرة في مخطط شجرة النسب؟', 'points': 3.0, 'choices': [
                        {'text': 'A female', 'text_arabic': 'أنثى', 'is_correct': True},
                        {'text': 'A male', 'text_arabic': 'ذكر', 'is_correct': False},
                        {'text': 'An affected individual', 'text_arabic': 'فرد مصاب', 'is_correct': False},
                        {'text': 'A carrier', 'text_arabic': 'حامل للمرض', 'is_correct': False},
                    ]}
                ]
            },
            {
                'title': 'Autosomal Disorders', 'title_arabic': 'الاضطرابات الجسمية', 'difficulty': 'intermediate',
                'questions': [
                    {'type': 'qcm_single', 'text': 'Cystic fibrosis is an example of what type of genetic disorder?', 'text_arabic': 'التليف الكيسي هو مثال على أي نوع من الاضطرابات الوراثية؟', 'points': 3.0, 'choices': [
                        {'text': 'Autosomal recessive', 'text_arabic': 'جسمي متنحي', 'is_correct': True},
                        {'text': 'Autosomal dominant', 'text_arabic': 'جسمي سائد', 'is_correct': False},
                        {'text': 'X-linked recessive', 'text_arabic': 'متنحي مرتبط بالصبغي X', 'is_correct': False},
                        {'text': 'Chromosomal nondisjunction', 'text_arabic': 'عدم الانفصال الصبغي', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'For an autosomal dominant disorder, an individual only needs to inherit one copy of the affected allele to show the trait.', 'text_arabic': 'بالنسبة لاضطراب جسمي سائد، يحتاج الفرد فقط إلى وراثة نسخة واحدة من الأليل المصاب لإظهار الصفة.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'open_short', 'text': 'Huntington\'s disease is an example of an autosomal ________ disorder.', 'text_arabic': 'مرض هنتنغتون هو مثال على اضطراب جسمي ________.', 'points': 4.0, 'explanation': 'Dominant', 'explanation_arabic': 'سائد'},
                    {'type': 'qcm_single', 'text': 'If two parents are carriers for an autosomal recessive disorder (e.g., Aa x Aa), what is the probability their child will have the disorder?', 'text_arabic': 'إذا كان كلا الوالدين حاملين لاضطراب جسمي متنحي (مثل Aa x Aa)، فما هو احتمال أن يكون طفلهما مصابًا بالاضطراب؟', 'points': 4.0, 'choices': [
                        {'text': '25%', 'text_arabic': '25%', 'is_correct': True},
                        {'text': '50%', 'text_arabic': '50%', 'is_correct': False},
                        {'text': '75%', 'text_arabic': '75%', 'is_correct': False},
                        {'text': '100%', 'text_arabic': '100%', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is a carrier of a genetic disorder?', 'text_arabic': 'ما هو حامل الاضطراب الوراثي؟', 'points': 4.0, 'explanation': 'An individual who is heterozygous for a recessive disorder and does not show symptoms but can pass the allele to their offspring.', 'explanation_arabic': 'فرد متخالف الزيجوت لاضطراب متنحي ولا تظهر عليه الأعراض ولكن يمكنه نقل الأليل إلى نسله.'},
                    {'type': 'true_false', 'text': 'Autosomal disorders affect males and females with equal frequency.', 'text_arabic': 'تؤثر الاضطرابات الجسمية على الذكور والإناث بنفس التردد.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]}
                ]
            },
            {
                'title': 'Sex-Linked Disorders', 'title_arabic': 'الاضطرابات المرتبطة بالجنس', 'difficulty': 'advanced',
                'questions': [
                    {'type': 'qcm_single', 'text': 'Hemophilia is a classic example of an ________ disorder.', 'text_arabic': 'الهيموفيليا (الناعور) هو مثال كلاسيكي لاضطراب ________.', 'points': 4.0, 'choices': [
                        {'text': 'X-linked recessive', 'text_arabic': 'متنحي مرتبط بالصبغي X', 'is_correct': True},
                        {'text': 'Autosomal dominant', 'text_arabic': 'جسمي سائد', 'is_correct': False},
                        {'text': 'Y-linked', 'text_arabic': 'مرتبط بالصبغي Y', 'is_correct': False},
                        {'text': 'Autosomal recessive', 'text_arabic': 'جسمي متنحي', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'Can a father pass an X-linked trait to his son? Why or why not?', 'text_arabic': 'هل يمكن للأب أن ينقل صفة مرتبطة بالصبغي X إلى ابنه؟ لماذا أو لماذا لا؟', 'points': 5.0, 'explanation': 'No, because a father passes his Y chromosome to his son, not his X chromosome.', 'explanation_arabic': 'لا، لأن الأب ينقل صبغيه Y إلى ابنه، وليس صبغيه X.'},
                    {'type': 'qcm_single', 'text': 'If a woman is a carrier for an X-linked recessive allele and her partner is unaffected, what is the chance that her son will be affected?', 'text_arabic': 'إذا كانت امرأة حاملة لأليل متنحي مرتبط بالصبغي X وشريكها غير مصاب، فما هي فرصة أن يكون ابنها مصابًا؟', 'points': 5.0, 'choices': [
                        {'text': '50%', 'text_arabic': '50%', 'is_correct': True},
                        {'text': '25%', 'text_arabic': '25%', 'is_correct': False},
                        {'text': '100%', 'text_arabic': '100%', 'is_correct': False},
                        {'text': '0%', 'text_arabic': '0%', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Y-linked traits are passed from fathers to all of their sons.', 'text_arabic': 'تنتقل الصفات المرتبطة بالصبغي Y من الآباء إلى جميع أبنائهم.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'open_short', 'text': 'Duchenne muscular dystrophy is another example of an ________ disorder.', 'text_arabic': 'الحثل العضلي الدوشيني هو مثال آخر على اضطراب ________.', 'points': 5.0, 'explanation': 'X-linked recessive', 'explanation_arabic': 'متنحي مرتبط بالصبغي X'},
                    {'type': 'qcm_single', 'text': 'For an X-linked dominant disorder, an affected male will pass the trait to:', 'text_arabic': 'بالنسبة لاضطراب سائد مرتبط بالصبغي X، سينقل الذكر المصاب الصفة إلى:', 'points': 5.0, 'choices': [
                        {'text': 'All of his daughters', 'text_arabic': 'جميع بناته', 'is_correct': True},
                        {'text': 'All of his sons', 'text_arabic': 'جميع أبنائه', 'is_correct': False},
                        {'text': 'Half of his daughters', 'text_arabic': 'نصف بناته', 'is_correct': False},
                        {'text': 'Half of his sons', 'text_arabic': 'نصف أبنائه', 'is_correct': False},
                    ]}
                ]
            },
            {
                'title': 'Chromosomal Abnormalities', 'title_arabic': 'الاضطرابات الصبغية', 'difficulty': 'advanced',
                'questions': [
                    {'type': 'qcm_single', 'text': 'The failure of chromosomes to separate properly during meiosis is called:', 'text_arabic': 'يسمى فشل الصبغيات في الانفصال بشكل صحيح أثناء الانقسام الاختزالي:', 'points': 4.0, 'choices': [
                        {'text': 'Nondisjunction', 'text_arabic': 'عدم الانفصال', 'is_correct': True},
                        {'text': 'Translocation', 'text_arabic': 'الانتقال', 'is_correct': False},
                        {'text': 'Inversion', 'text_arabic': 'الانقلاب', 'is_correct': False},
                        {'text': 'Deletion', 'text_arabic': 'الحذف', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'Down syndrome is caused by a trisomy of which chromosome?', 'text_arabic': 'ينتج متلازمة داون عن تثالث أي صبغي؟', 'points': 5.0, 'explanation': 'Chromosome 21', 'explanation_arabic': 'الصبغي 21'},
                    {'type': 'qcm_single', 'text': 'Turner syndrome (XO) is an example of:', 'text_arabic': 'متلازمة تيرنر (XO) هي مثال على:', 'points': 5.0, 'choices': [
                        {'text': 'A monosomy of a sex chromosome', 'text_arabic': 'أحادية الصبغي الجنسي', 'is_correct': True},
                        {'text': 'A trisomy of a sex chromosome', 'text_arabic': 'تثالث الصبغي الجنسي', 'is_correct': False},
                        {'text': 'A trisomy of an autosome', 'text_arabic': 'تثالث صبغي جسمي', 'is_correct': False},
                        {'text': 'A chromosomal deletion', 'text_arabic': 'حذف صبغي', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Nondisjunction can occur in either meiosis I or meiosis II.', 'text_arabic': 'يمكن أن يحدث عدم الانفصال في الانقسام الاختزالي الأول أو الانقسام الاختزالي الثاني.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'open_short', 'text': 'What is the term for a condition in which an organism has an abnormal number of chromosomes?', 'text_arabic': 'ما هو المصطلح الذي يطلق على الحالة التي يكون فيها للكائن الحي عدد غير طبيعي من الصبغيات؟', 'points': 5.0, 'explanation': 'Aneuploidy', 'explanation_arabic': 'اختلال الصيغة الصبغية'},
                    {'type': 'qcm_single', 'text': 'Klinefelter syndrome is characterized by which combination of sex chromosomes?', 'text_arabic': 'تتميز متلازمة كلاينفلتر بأي مزيج من الصبغيات الجنسية؟', 'points': 5.0, 'choices': [
                        {'text': 'XXY', 'text_arabic': 'XXY', 'is_correct': True},
                        {'text': 'XO', 'text_arabic': 'XO', 'is_correct': False},
                        {'text': 'XYY', 'text_arabic': 'XYY', 'is_correct': False},
                        {'text': 'XXX', 'text_arabic': 'XXX', 'is_correct': False},
                    ]}
                ]
            }
        ]

        self.create_exercises(lesson, exercises_data)
        self.stdout.write(self.style.SUCCESS(f'Successfully created exercises for lesson ID: {lesson_id}'))

    def create_exercises(self, lesson, exercises_data):
        for i, ex_data in enumerate(exercises_data, 1):
            exercise = Exercise.objects.create(
                lesson=lesson, created_by_id=1, title=ex_data['title'], title_arabic=ex_data['title_arabic'],
                difficulty_level=ex_data['difficulty'], order=i, is_active=True, is_published=True
            )
            for j, q_data in enumerate(ex_data['questions'], 1):
                question = Question.objects.create(
                    exercise=exercise, question_type=q_data['type'], question_text=q_data['text'],
                    question_text_arabic=q_data.get('text_arabic', ''), points=q_data['points'], order=j,
                    explanation=q_data.get('explanation', ''), explanation_arabic=q_data.get('explanation_arabic', '')
                )
                if 'choices' in q_data:
                    for k, choice_data in enumerate(q_data['choices'], 1):
                        QuestionChoice.objects.create(
                            question=question, choice_text=choice_data['text'],
                            choice_text_arabic=choice_data.get('text_arabic', ''),
                            is_correct=choice_data['is_correct'], order=k
                        )
            self.create_exercise_rewards(exercise, ex_data['difficulty'])

    def create_exercise_rewards(self, exercise, difficulty):
        rewards = {'beginner': 5, 'intermediate': 10, 'advanced': 15}
        ExerciseReward.objects.create(
            exercise=exercise, completion_points=rewards.get(difficulty, 10),
            perfect_score_bonus=rewards.get(difficulty, 10) + 5
        )
