"""
Management Command for Creating Exercises for Lesson: Quantitative study of variation - Biometrics (ID 109)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward


class Command(BaseCommand):
    help = 'Create exercises for "Quantitative study of variation - Biometrics" - Lesson ID: 109'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            dest='delete_existing',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        lesson_id = 109
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
                'title': 'Types of Variation', 'title_arabic': 'أنواع التباين', 'difficulty': 'beginner',
                'questions': [
                    {'type': 'qcm_single', 'text': 'Variation that shows a range of values between two extremes, like height, is called:', 'text_arabic': 'يسمى التباين الذي يظهر نطاقًا من القيم بين طرفين، مثل الطول:', 'points': 2.0, 'choices': [
                        {'text': 'Continuous variation', 'text_arabic': 'التباين المستمر', 'is_correct': True},
                        {'text': 'Discontinuous variation', 'text_arabic': 'التباين المتقطع', 'is_correct': False},
                        {'text': 'Genetic variation', 'text_arabic': 'التباين الوراثي', 'is_correct': False},
                        {'text': 'Environmental variation', 'text_arabic': 'التباين البيئي', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Human blood type is an example of continuous variation.', 'text_arabic': 'فصيلة الدم البشرية هي مثال على التباين المستمر.', 'points': 2.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'It is an example of discontinuous variation (distinct categories).', 'explanation_arabic': 'إنه مثال على التباين المتقطع (فئات مميزة).'}, 
                    {'type': 'qcm_single', 'text': 'Discontinuous variation is typically controlled by:', 'text_arabic': 'يتم التحكم في التباين المتقطع عادة عن طريق:', 'points': 2.0, 'choices': [
                        {'text': 'A single gene or a few genes', 'text_arabic': 'جين واحد أو عدد قليل من الجينات', 'is_correct': True},
                        {'text': 'Many genes (polygenic)', 'text_arabic': 'العديد من الجينات (متعدد الجينات)', 'is_correct': False},
                        {'text': 'Environmental factors only', 'text_arabic': 'العوامل البيئية فقط', 'is_correct': False},
                        {'text': 'Random chance', 'text_arabic': 'الصدفة العشوائية', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What are the two main causes of variation within a species?', 'text_arabic': 'ما هما السببان الرئيسيان للتباين داخل النوع؟', 'points': 3.0, 'explanation': 'Genetic factors and environmental factors.', 'explanation_arabic': 'العوامل الوراثية والعوامل البيئية.'},
                    {'type': 'qcm_single', 'text': 'Which of the following is an example of a trait showing discontinuous variation?', 'text_arabic': 'أي مما يلي هو مثال على صفة تظهر تباينًا متقطعًا؟', 'points': 2.0, 'choices': [
                        {'text': 'Ability to roll the tongue', 'text_arabic': 'القدرة على لف اللسان', 'is_correct': True},
                        {'text': 'Weight', 'text_arabic': 'الوزن', 'is_correct': False},
                        {'text': 'Skin color', 'text_arabic': 'لون البشرة', 'is_correct': False},
                        {'text': 'Shoe size', 'text_arabic': 'مقاس الحذاء', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Continuous variation is often influenced by both genetic and environmental factors.', 'text_arabic': 'غالبًا ما يتأثر التباين المستمر بكل من العوامل الوراثية والبيئية.', 'points': 2.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]}
                ]
            },
            {
                'title': 'Measuring and Displaying Variation', 'title_arabic': 'قياس وعرض التباين', 'difficulty': 'intermediate',
                'questions': [
                    {'type': 'qcm_single', 'text': 'Which type of graph is most suitable for displaying continuous variation?', 'text_arabic': 'أي نوع من الرسوم البيانية هو الأنسب لعرض التباين المستمر؟', 'points': 3.0, 'choices': [
                        {'text': 'Histogram or line graph', 'text_arabic': 'مدرج تكراري أو رسم بياني خطي', 'is_correct': True},
                        {'text': 'Bar chart', 'text_arabic': 'مخطط شريطي', 'is_correct': False},
                        {'text': 'Pie chart', 'text_arabic': 'مخطط دائري', 'is_correct': False},
                        {'text': 'Scatter plot', 'text_arabic': 'مخطط التشتت', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is the term for the average value of a set of data?', 'text_arabic': 'ما هو المصطلح الذي يطلق على متوسط قيمة مجموعة من البيانات؟', 'points': 3.0, 'explanation': 'Mean', 'explanation_arabic': 'المتوسط الحسابي'},
                    {'type': 'qcm_single', 'text': 'A normal distribution curve for a continuous trait is often described as:', 'text_arabic': 'غالبًا ما يوصف منحنى التوزيع الطبيعي لصفة مستمرة بأنه:', 'points': 3.0, 'choices': [
                        {'text': 'Bell-shaped', 'text_arabic': 'على شكل جرس', 'is_correct': True},
                        {'text': 'U-shaped', 'text_arabic': 'على شكل حرف U', 'is_correct': False},
                        {'text': 'Linear', 'text_arabic': 'خطي', 'is_correct': False},
                        {'text': 'Exponential', 'text_arabic': 'أسي', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'A bar chart is used to display discontinuous variation.', 'text_arabic': 'يستخدم المخطط الشريطي لعرض التباين المتقطع.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'open_short', 'text': 'What does the standard deviation of a data set measure?', 'text_arabic': 'ماذا يقيس الانحراف المعياري لمجموعة بيانات؟', 'points': 4.0, 'explanation': 'The amount of variation or dispersion of the data values around the mean.', 'explanation_arabic': 'مقدار التباين أو تشتت قيم البيانات حول المتوسط.'},
                    {'type': 'qcm_single', 'text': 'If you measure the height of 1000 students, what value would you expect to be most frequent?', 'text_arabic': 'إذا قمت بقياس طول 1000 طالب، فما القيمة التي تتوقع أن تكون الأكثر تكرارًا؟', 'points': 4.0, 'choices': [
                        {'text': 'The mean height', 'text_arabic': 'متوسط الطول', 'is_correct': True},
                        {'text': 'The shortest height', 'text_arabic': 'أقصر طول', 'is_correct': False},
                        {'text': 'The tallest height', 'text_arabic': 'أطول طول', 'is_correct': False},
                        {'text': 'All heights would be equally frequent', 'text_arabic': 'ستكون جميع الأطوال متساوية في التكرار', 'is_correct': False},
                    ]}
                ]
            },
            {
                'title': 'Statistical Concepts in Biometrics', 'title_arabic': 'المفاهيم الإحصائية في القياسات الحيوية', 'difficulty': 'intermediate',
                'questions': [
                    {'type': 'qcm_single', 'text': 'What is the mode of a data set?', 'text_arabic': 'ما هو المنوال لمجموعة بيانات؟', 'points': 3.0, 'choices': [
                        {'text': 'The most frequently occurring value', 'text_arabic': 'القيمة الأكثر تكرارًا', 'is_correct': True},
                        {'text': 'The average value', 'text_arabic': 'متوسط القيمة', 'is_correct': False},
                        {'text': 'The middle value', 'text_arabic': 'القيمة الوسطى', 'is_correct': False},
                        {'text': 'The range of values', 'text_arabic': 'نطاق القيم', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'The range is a measure of the spread of data.', 'text_arabic': 'المدى هو مقياس لتشتت البيانات.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'open_short', 'text': 'What is the median of the following data set: 2, 5, 8, 10, 11?', 'text_arabic': 'ما هو الوسيط لمجموعة البيانات التالية: 2، 5، 8، 10، 11؟', 'points': 4.0, 'explanation': '8 (the middle value)', 'explanation_arabic': '8 (القيمة الوسطى)'},
                    {'type': 'qcm_single', 'text': 'A small standard deviation indicates that the data points tend to be:', 'text_arabic': 'يشير الانحراف المعياري الصغير إلى أن نقاط البيانات تميل إلى أن تكون:', 'points': 4.0, 'choices': [
                        {'text': 'Close to the mean', 'text_arabic': 'قريبة من المتوسط', 'is_correct': True},
                        {'text': 'Spread out over a wide range', 'text_arabic': 'منتشرة على نطاق واسع', 'is_correct': False},
                        {'text': 'Bimodal', 'text_arabic': 'ثنائية المنوال', 'is_correct': False},
                        {'text': 'Skewed', 'text_arabic': 'ملتوية', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is a sample in a statistical study?', 'text_arabic': 'ما هي العينة في دراسة إحصائية؟', 'points': 4.0, 'explanation': 'A subset of individuals from a larger population that is studied to make inferences about the whole population.', 'explanation_arabic': 'مجموعة فرعية من الأفراد من مجموعة أكبر يتم دراستها لعمل استنتاجات حول المجموعة بأكملها.'},
                    {'type': 'true_false', 'text': 'For a normal distribution, the mean, median, and mode are all the same.', 'text_arabic': 'بالنسبة للتوزيع الطبيعي، يكون المتوسط والوسيط والمنوال كلها متساوية.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]}
                ]
            },
            {
                'title': 'Heritability', 'title_arabic': 'التوريث', 'difficulty': 'advanced',
                'questions': [
                    {'type': 'qcm_single', 'text': 'What does heritability measure?', 'text_arabic': 'ماذا يقيس التوريث؟', 'points': 4.0, 'choices': [
                        {'text': 'The proportion of phenotypic variation in a population that is attributable to genetic variation.', 'text_arabic': 'نسبة التباين المظهري في مجموعة سكانية والتي تعزى إلى التباين الوراثي.', 'is_correct': True},
                        {'text': 'The probability that an individual will inherit a specific trait.', 'text_arabic': 'احتمال أن يرث الفرد صفة معينة.', 'is_correct': False},
                        {'text': 'Whether a trait is dominant or recessive.', 'text_arabic': 'ما إذا كانت الصفة سائدة أم متنحية.', 'is_correct': False},
                        {'text': 'The number of genes that control a trait.', 'text_arabic': 'عدد الجينات التي تتحكم في الصفة.', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'If the heritability of a trait is 1.0, what does this mean?', 'text_arabic': 'إذا كان توريث صفة ما هو 1.0، فماذا يعني هذا؟', 'points': 5.0, 'explanation': 'It means that all of the observed variation in the trait within the population is due to genetic differences.', 'explanation_arabic': 'يعني أن كل التباين الملاحظ في الصفة داخل المجموعة السكانية يرجع إلى اختلافات وراثية.'},
                    {'type': 'qcm_single', 'text': 'Twin studies are often used to estimate heritability. Why are identical twins useful for this?', 'text_arabic': 'غالبًا ما تستخدم دراسات التوائم لتقدير التوريث. لماذا يكون التوائم المتطابقون مفيدين لهذا الغرض؟', 'points': 5.0, 'choices': [
                        {'text': 'They are genetically identical, so differences between them are likely due to environmental factors.', 'text_arabic': 'إنهم متطابقون وراثيًا، لذا فإن الاختلافات بينهم من المحتمل أن تكون بسبب عوامل بيئية.', 'is_correct': True},
                        {'text': 'They share 50% of their genes, just like regular siblings.', 'text_arabic': 'يتشاركون 50% من جيناتهم، تمامًا مثل الأشقاء العاديين.', 'is_correct': False},
                        {'text': 'They are always raised in identical environments.', 'text_arabic': 'يتم تربيتهم دائمًا في بيئات متطابقة.', 'is_correct': False},
                        {'text': 'They have a higher mutation rate.', 'text_arabic': 'لديهم معدل طفرات أعلى.', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'A high heritability for a trait means that the environment has no influence on it.', 'text_arabic': 'يعني التوريث العالي لصفة ما أن البيئة ليس لها أي تأثير عليها.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'Heritability is a population statistic; it does not negate environmental influence on an individual\includegraphics[width=0.5cm]{s development.', 'explanation_arabic': 'التوريث هو إحصاء سكاني؛ لا ينفي التأثير البيئي على تطور الفرد.'},
                    {'type': 'open_short', 'text': 'What is the term for the combined effects of genetic and environmental factors on a phenotype?', 'text_arabic': 'ما هو المصطلح الذي يطلق على التأثيرات المشتركة للعوامل الوراثية والبيئية على النمط الظاهري؟', 'points': 5.0, 'explanation': 'Multifactorial inheritance', 'explanation_arabic': 'الوراثة متعددة العوامل'},
                    {'type': 'qcm_single', 'text': 'If a trait has low heritability, it means that most of the variation in the population is due to:', 'text_arabic': 'إذا كانت لصفة ما قابلية توريث منخفضة، فهذا يعني أن معظم التباين في السكان يرجع إلى:', 'points': 5.0, 'choices': [
                        {'text': 'Environmental factors', 'text_arabic': 'عوامل بيئية', 'is_correct': True},
                        {'text': 'Genetic factors', 'text_arabic': 'عوامل وراثية', 'is_correct': False},
                        {'text': 'Random chance', 'text_arabic': 'الصدفة العشوائية', 'is_correct': False},
                        {'text': 'A single dominant gene', 'text_arabic': 'جين سائد واحد', 'is_correct': False},
                    ]}
                ]
            },
            {
                'title': 'Selection and Variation', 'title_arabic': 'الانتخاب والتباين', 'difficulty': 'advanced',
                'questions': [
                    {'type': 'qcm_single', 'text': 'What is natural selection?', 'text_arabic': 'ما هو الانتخاب الطبيعي؟', 'points': 4.0, 'choices': [
                        {'text': 'The process whereby organisms better adapted to their environment tend to survive and produce more offspring.', 'text_arabic': 'العملية التي من خلالها تميل الكائنات الحية الأفضل تكيفًا مع بيئتها إلى البقاء على قيد الحياة وإنتاج المزيد من النسل.', 'is_correct': True},
                        {'text': 'The process of humans breeding organisms for desired traits.', 'text_arabic': 'عملية تربية البشر للكائنات الحية للحصول على الصفات المرغوبة.', 'is_correct': False},
                        {'text': 'The random change in allele frequencies in a population.', 'text_arabic': 'التغير العشوائي في ترددات الأليلات في مجموعة سكانية.', 'is_correct': False},
                        {'text': 'The movement of genes from one population to another.', 'text_arabic': 'حركة الجينات من مجموعة سكانية إلى أخرى.', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is the raw material for natural selection?', 'text_arabic': 'ما هي المادة الخام للانتخاب الطبيعي؟', 'points': 5.0, 'explanation': 'Genetic variation', 'explanation_arabic': 'التباين الوراثي'},
                    {'type': 'qcm_single', 'text': 'Selection that favors individuals at one extreme of the phenotypic range is called:', 'text_arabic': 'يسمى الانتخاب الذي يفضل الأفراد في أحد طرفي النطاق المظهري:', 'points': 5.0, 'choices': [
                        {'text': 'Directional selection', 'text_arabic': 'الانتخاب الاتجاهي', 'is_correct': True},
                        {'text': 'Stabilizing selection', 'text_arabic': 'الانتخاب المثبت', 'is_correct': False},
                        {'text': 'Disruptive selection', 'text_arabic': 'الانتخاب التمزيقي', 'is_correct': False},
                        {'text': 'Artificial selection', 'text_arabic': 'الانتخاب الاصطناعي', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Artificial selection is driven by environmental pressures.', 'text_arabic': 'الانتخاب الاصطناعي مدفوع بالضغوط البيئية.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'It is driven by human intervention.', 'explanation_arabic': 'إنه مدفوع بالتدخل البشري.'},
                    {'type': 'open_short', 'text': 'What is stabilizing selection?', 'text_arabic': 'ما هو الانتخاب المثبت؟', 'points': 6.0, 'explanation': 'A type of natural selection that favors intermediate phenotypes and selects against extreme variations.', 'explanation_arabic': 'نوع من الانتخاب الطبيعي يفضل الأنماط الظاهرية المتوسطة وينتخب ضد التباينات المتطرفة.'},
                    {'type': 'qcm_single', 'text': 'The evolution of antibiotic resistance in bacteria is a modern example of:', 'text_arabic': 'تطور مقاومة المضادات الحيوية في البكتيريا هو مثال حديث على:', 'points': 5.0, 'choices': [
                        {'text': 'Directional selection', 'text_arabic': 'الانتخاب الاتجاهي', 'is_correct': True},
                        {'text': 'Genetic drift', 'text_arabic': 'الانحراف الوراثي', 'is_correct': False},
                        {'text': 'Stabilizing selection', 'text_arabic': 'الانتخاب المثبت', 'is_correct': False},
                        {'text': 'Gene flow', 'text_arabic': 'تدفق الجينات', 'is_correct': False},
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
