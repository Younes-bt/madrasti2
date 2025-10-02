# lessons/management/commands/create_lesson_109_biometrics.py

from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice
from users.models import User

class Command(BaseCommand):
    help = 'Create exercises for Lesson 109: Quantitative study of variation - Biometrics'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    def handle(self, *args, **options):
        try:
            # Get the lesson
            lesson = Lesson.objects.get(id=109)
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
                    'title': 'Introduction to Biometrics and Continuous Variation',
                    'title_ar': 'مقدمة في القياسات الحيوية والتنوع المستمر',
                    'difficulty': 'beginner',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'What is biometrics in genetics?',
                            'text_ar': 'ما هي القياسات الحيوية في علم الوراثة؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'The statistical study of biological variation in populations', 'text_ar': 'الدراسة الإحصائية للتنوع البيولوجي في المجتمعات', 'is_correct': True},
                                {'text': 'Fingerprint identification systems', 'text_ar': 'أنظمة تحديد بصمات الأصابع', 'is_correct': False},
                                {'text': 'DNA sequencing techniques', 'text_ar': 'تقنيات تسلسل الحمض النووي', 'is_correct': False},
                                {'text': 'Chromosome counting methods', 'text_ar': 'طرق عد الكروموسومات', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is continuous variation?',
                            'text_ar': 'ما هو التنوع المستمر؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Traits that show a range of phenotypes rather than discrete categories', 'text_ar': 'الصفات التي تظهر نطاقا من الأنماط المظهرية بدلا من فئات منفصلة', 'is_correct': True},
                                {'text': 'Traits with only two possible phenotypes', 'text_ar': 'الصفات بنمطين مظهريين محتملين فقط', 'is_correct': False},
                                {'text': 'Traits that never change', 'text_ar': 'الصفات التي لا تتغير أبدا', 'is_correct': False},
                                {'text': 'Traits inherited only from one parent', 'text_ar': 'الصفات الموروثة من والد واحد فقط', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Which of the following is an example of continuous variation?',
                            'text_ar': 'أي مما يلي مثال على التنوع المستمر؟',
                            'type': 'qcm_multiple',
                            'points': 2,
                            'choices': [
                                {'text': 'Human height', 'text_ar': 'طول الإنسان', 'is_correct': True},
                                {'text': 'Skin color', 'text_ar': 'لون البشرة', 'is_correct': True},
                                {'text': 'ABO blood types', 'text_ar': 'فصائل الدم ABO', 'is_correct': False},
                                {'text': 'Presence or absence of widow\'s peak', 'text_ar': 'وجود أو غياب قمة الأرملة', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Continuous variation is typically caused by:',
                            'text_ar': 'التنوع المستمر عادة ناتج عن:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Multiple genes (polygenic) and environmental factors', 'text_ar': 'جينات متعددة (متعدد الجينات) وعوامل بيئية', 'is_correct': True},
                                {'text': 'A single gene with two alleles', 'text_ar': 'جين واحد بأليلين', 'is_correct': False},
                                {'text': 'Only environmental factors', 'text_ar': 'العوامل البيئية فقط', 'is_correct': False},
                                {'text': 'Chromosomal abnormalities', 'text_ar': 'الشذوذات الكروموسومية', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What distinguishes discontinuous variation from continuous variation?',
                            'text_ar': 'ما الذي يميز التنوع المنفصل عن التنوع المستمر؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Discontinuous traits fall into distinct categories with no intermediates', 'text_ar': 'الصفات المنفصلة تقع في فئات متميزة بدون وسيطات', 'is_correct': True},
                                {'text': 'Discontinuous traits are always dominant', 'text_ar': 'الصفات المنفصلة دائما سائدة', 'is_correct': False},
                                {'text': 'Discontinuous traits are not inherited', 'text_ar': 'الصفات المنفصلة غير موروثة', 'is_correct': False},
                                {'text': 'Discontinuous traits only appear in males', 'text_ar': 'الصفات المنفصلة تظهر في الذكور فقط', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'When plotting continuous variation data, what type of graph is typically produced?',
                            'text_ar': 'عند رسم بيانات التنوع المستمر، ما نوع الرسم البياني الذي يُنتج عادة؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Bell-shaped curve (normal distribution)', 'text_ar': 'منحنى على شكل جرس (التوزيع الطبيعي)', 'is_correct': True},
                                {'text': 'Straight horizontal line', 'text_ar': 'خط أفقي مستقيم', 'is_correct': False},
                                {'text': 'Discrete bars only', 'text_ar': 'أشرطة منفصلة فقط', 'is_correct': False},
                                {'text': 'Circular pie chart', 'text_ar': 'مخطط دائري', 'is_correct': False},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Statistical Measures - Mean, Median, and Mode',
                    'title_ar': 'المقاييس الإحصائية - الوسط، الوسيط، والمنوال',
                    'difficulty': 'intermediate',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'What is the mean (average) in statistics?',
                            'text_ar': 'ما هو الوسط (المتوسط) في الإحصاء؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'The sum of all values divided by the number of values', 'text_ar': 'مجموع جميع القيم مقسوما على عدد القيم', 'is_correct': True},
                                {'text': 'The middle value when data is ordered', 'text_ar': 'القيمة الوسطى عند ترتيب البيانات', 'is_correct': False},
                                {'text': 'The most frequently occurring value', 'text_ar': 'القيمة الأكثر تكرارا', 'is_correct': False},
                                {'text': 'The difference between highest and lowest values', 'text_ar': 'الفرق بين أعلى وأدنى القيم', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Given heights: 150, 160, 165, 170, 180 cm. What is the median?',
                            'text_ar': 'الأطوال المعطاة: 150، 160، 165، 170، 180 سم. ما هو الوسيط؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '165 cm (middle value)', 'text_ar': '165 سم (القيمة الوسطى)', 'is_correct': True},
                                {'text': '160 cm', 'text_ar': '160 سم', 'is_correct': False},
                                {'text': '170 cm', 'text_ar': '170 سم', 'is_correct': False},
                                {'text': '165.5 cm', 'text_ar': '165.5 سم', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is the mode in a dataset?',
                            'text_ar': 'ما هو المنوال في مجموعة بيانات؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'The value that appears most frequently', 'text_ar': 'القيمة التي تظهر بشكل أكثر تكرارا', 'is_correct': True},
                                {'text': 'The average of all values', 'text_ar': 'متوسط جميع القيم', 'is_correct': False},
                                {'text': 'The middle value', 'text_ar': 'القيمة الوسطى', 'is_correct': False},
                                {'text': 'The highest value', 'text_ar': 'أعلى قيمة', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'In a dataset: 5, 7, 7, 9, 10, 7, 12. What is the mode?',
                            'text_ar': 'في مجموعة بيانات: 5، 7، 7، 9، 10، 7، 12. ما هو المنوال؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '7 (appears 3 times)', 'text_ar': '7 (يظهر 3 مرات)', 'is_correct': True},
                                {'text': '9', 'text_ar': '9', 'is_correct': False},
                                {'text': '12', 'text_ar': '12', 'is_correct': False},
                                {'text': '8.14', 'text_ar': '8.14', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Which measure of central tendency is most affected by extreme outliers?',
                            'text_ar': 'أي مقياس للنزعة المركزية يتأثر أكثر بالقيم الشاذة المتطرفة؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Mean (average)', 'text_ar': 'الوسط (المتوسط)', 'is_correct': True},
                                {'text': 'Median', 'text_ar': 'الوسيط', 'is_correct': False},
                                {'text': 'Mode', 'text_ar': 'المنوال', 'is_correct': False},
                                {'text': 'All are equally affected', 'text_ar': 'كلها تتأثر بالتساوي', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'For a normal distribution (bell curve), which relationship is true?',
                            'text_ar': 'بالنسبة للتوزيع الطبيعي (منحنى الجرس)، أي علاقة صحيحة؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Mean = Median = Mode', 'text_ar': 'الوسط = الوسيط = المنوال', 'is_correct': True},
                                {'text': 'Mean > Median > Mode', 'text_ar': 'الوسط > الوسيط > المنوال', 'is_correct': False},
                                {'text': 'Mode > Mean > Median', 'text_ar': 'المنوال > الوسط > الوسيط', 'is_correct': False},
                                {'text': 'They are never equal', 'text_ar': 'هم ليسوا متساوين أبدا', 'is_correct': False},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Variance and Standard Deviation',
                    'title_ar': 'التباين والانحراف المعياري',
                    'difficulty': 'intermediate',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'What does standard deviation measure?',
                            'text_ar': 'ماذا يقيس الانحراف المعياري؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'The spread or dispersion of data around the mean', 'text_ar': 'انتشار أو تشتت البيانات حول الوسط', 'is_correct': True},
                                {'text': 'The average value of the data', 'text_ar': 'القيمة المتوسطة للبيانات', 'is_correct': False},
                                {'text': 'The most common value', 'text_ar': 'القيمة الأكثر شيوعا', 'is_correct': False},
                                {'text': 'The total number of data points', 'text_ar': 'العدد الإجمالي لنقاط البيانات', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'A large standard deviation indicates:',
                            'text_ar': 'انحراف معياري كبير يشير إلى:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Data points are widely spread from the mean', 'text_ar': 'نقاط البيانات منتشرة بشكل واسع عن الوسط', 'is_correct': True},
                                {'text': 'Data points are clustered close to the mean', 'text_ar': 'نقاط البيانات متجمعة قريبا من الوسط', 'is_correct': False},
                                {'text': 'All data values are identical', 'text_ar': 'جميع قيم البيانات متطابقة', 'is_correct': False},
                                {'text': 'The mean is very large', 'text_ar': 'الوسط كبير جدا', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is variance?',
                            'text_ar': 'ما هو التباين؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'The average of squared deviations from the mean', 'text_ar': 'متوسط مربعات الانحرافات عن الوسط', 'is_correct': True},
                                {'text': 'The square root of standard deviation', 'text_ar': 'الجذر التربيعي للانحراف المعياري', 'is_correct': False},
                                {'text': 'The range of the data', 'text_ar': 'مدى البيانات', 'is_correct': False},
                                {'text': 'The median minus the mode', 'text_ar': 'الوسيط ناقص المنوال', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'How is standard deviation related to variance?',
                            'text_ar': 'كيف يرتبط الانحراف المعياري بالتباين؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Standard deviation = square root of variance', 'text_ar': 'الانحراف المعياري = الجذر التربيعي للتباين', 'is_correct': True},
                                {'text': 'Variance = square root of standard deviation', 'text_ar': 'التباين = الجذر التربيعي للانحراف المعياري', 'is_correct': False},
                                {'text': 'They are the same thing', 'text_ar': 'هما نفس الشيء', 'is_correct': False},
                                {'text': 'They are unrelated', 'text_ar': 'غير مرتبطين', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'In a normal distribution, approximately what percentage of data falls within one standard deviation of the mean?',
                            'text_ar': 'في التوزيع الطبيعي، ما النسبة المئوية تقريبا من البيانات التي تقع ضمن انحراف معياري واحد من الوسط؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Approximately 68%', 'text_ar': 'حوالي 68%', 'is_correct': True},
                                {'text': 'Approximately 50%', 'text_ar': 'حوالي 50%', 'is_correct': False},
                                {'text': 'Approximately 95%', 'text_ar': 'حوالي 95%', 'is_correct': False},
                                {'text': 'Approximately 99%', 'text_ar': 'حوالي 99%', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Why is standard deviation more commonly used than variance in biometrics?',
                            'text_ar': 'لماذا يُستخدم الانحراف المعياري بشكل أكثر شيوعا من التباين في القياسات الحيوية؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Standard deviation is in the same units as the original data', 'text_ar': 'الانحراف المعياري بنفس وحدات البيانات الأصلية', 'is_correct': True},
                                {'text': 'Variance is always negative', 'text_ar': 'التباين دائما سالب', 'is_correct': False},
                                {'text': 'Standard deviation is easier to calculate', 'text_ar': 'الانحراف المعياري أسهل في الحساب', 'is_correct': False},
                                {'text': 'Variance cannot be used with biological data', 'text_ar': 'لا يمكن استخدام التباين مع البيانات البيولوجية', 'is_correct': False},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Normal Distribution and the Bell Curve',
                    'title_ar': 'التوزيع الطبيعي ومنحنى الجرس',
                    'difficulty': 'advanced',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'What shape does a normal distribution graph have?',
                            'text_ar': 'ما شكل رسم التوزيع الطبيعي؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Symmetrical bell-shaped curve', 'text_ar': 'منحنى متماثل على شكل جرس', 'is_correct': True},
                                {'text': 'Straight line', 'text_ar': 'خط مستقيم', 'is_correct': False},
                                {'text': 'Skewed to one side', 'text_ar': 'منحرف إلى جانب واحد', 'is_correct': False},
                                {'text': 'U-shaped curve', 'text_ar': 'منحنى على شكل U', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'In a normal distribution, where is the mean located?',
                            'text_ar': 'في التوزيع الطبيعي، أين يقع الوسط؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'At the center (peak) of the bell curve', 'text_ar': 'في مركز (قمة) منحنى الجرس', 'is_correct': True},
                                {'text': 'At the left tail', 'text_ar': 'في الذيل الأيسر', 'is_correct': False},
                                {'text': 'At the right tail', 'text_ar': 'في الذيل الأيمن', 'is_correct': False},
                                {'text': 'Outside the curve', 'text_ar': 'خارج المنحنى', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'The "68-95-99.7 rule" (empirical rule) states that in a normal distribution:',
                            'text_ar': 'قاعدة "68-95-99.7" (القاعدة التجريبية) تنص على أنه في التوزيع الطبيعي:',
                            'type': 'qcm_multiple',
                            'points': 2,
                            'choices': [
                                {'text': '68% of data falls within 1 standard deviation', 'text_ar': '68% من البيانات تقع ضمن انحراف معياري واحد', 'is_correct': True},
                                {'text': '95% falls within 2 standard deviations', 'text_ar': '95% تقع ضمن انحرافين معياريين', 'is_correct': True},
                                {'text': '50% falls within 1 standard deviation', 'text_ar': '50% تقع ضمن انحراف معياري واحد', 'is_correct': False},
                                {'text': '99.7% falls within 3 standard deviations', 'text_ar': '99.7% تقع ضمن 3 انحرافات معيارية', 'is_correct': True},
                            ]
                        },
                        {
                            'text': 'Which biological traits typically show normal distribution?',
                            'text_ar': 'أي الصفات البيولوجية تظهر عادة توزيعا طبيعيا؟',
                            'type': 'qcm_multiple',
                            'points': 2,
                            'choices': [
                                {'text': 'Human height', 'text_ar': 'طول الإنسان', 'is_correct': True},
                                {'text': 'Birth weight', 'text_ar': 'وزن المواليد', 'is_correct': True},
                                {'text': 'Number of fingers', 'text_ar': 'عدد الأصابع', 'is_correct': False},
                                {'text': 'Blood type categories', 'text_ar': 'فئات فصائل الدم', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What causes traits to show normal distribution in populations?',
                            'text_ar': 'ما الذي يتسبب في إظهار الصفات توزيعا طبيعيا في المجتمعات؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Combined effects of multiple genes and environmental factors', 'text_ar': 'التأثيرات المشتركة لجينات متعددة وعوامل بيئية', 'is_correct': True},
                                {'text': 'Single gene with complete dominance', 'text_ar': 'جين واحد بسيادة تامة', 'is_correct': False},
                                {'text': 'Random mutations only', 'text_ar': 'الطفرات العشوائية فقط', 'is_correct': False},
                                {'text': 'Chromosomal abnormalities', 'text_ar': 'الشذوذات الكروموسومية', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'If human height has a mean of 170 cm and standard deviation of 10 cm, what range contains approximately 95% of the population?',
                            'text_ar': 'إذا كان متوسط طول الإنسان 170 سم والانحراف المعياري 10 سم، ما النطاق الذي يحتوي على حوالي 95% من السكان؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '150-190 cm (mean ± 2 standard deviations)', 'text_ar': '150-190 سم (الوسط ± 2 انحرافات معيارية)', 'is_correct': True},
                                {'text': '160-180 cm', 'text_ar': '160-180 سم', 'is_correct': False},
                                {'text': '140-200 cm', 'text_ar': '140-200 سم', 'is_correct': False},
                                {'text': '165-175 cm', 'text_ar': '165-175 سم', 'is_correct': False},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Applications of Biometrics in Genetics',
                    'title_ar': 'تطبيقات القياسات الحيوية في علم الوراثة',
                    'difficulty': 'advanced',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'Why is biometric analysis important in studying polygenic traits?',
                            'text_ar': 'لماذا يعد التحليل البيومتري مهما في دراسة الصفات متعددة الجينات؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'It helps quantify variation that cannot be explained by simple Mendelian ratios', 'text_ar': 'يساعد على قياس التنوع الذي لا يمكن تفسيره بنسب مندلية بسيطة', 'is_correct': True},
                                {'text': 'It replaces DNA sequencing', 'text_ar': 'يحل محل تسلسل الحمض النووي', 'is_correct': False},
                                {'text': 'It eliminates the need for pedigree analysis', 'text_ar': 'يلغي الحاجة إلى تحليل النسب', 'is_correct': False},
                                {'text': 'It only works with single-gene traits', 'text_ar': 'يعمل فقط مع صفات الجين الواحد', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Heritability (h²) measures:',
                            'text_ar': 'التوريثية (h²) تقيس:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'The proportion of phenotypic variation due to genetic factors', 'text_ar': 'نسبة التنوع المظهري الناتج عن العوامل الوراثية', 'is_correct': True},
                                {'text': 'The number of genes controlling a trait', 'text_ar': 'عدد الجينات التي تتحكم في صفة', 'is_correct': False},
                                {'text': 'The mutation rate of genes', 'text_ar': 'معدل طفرات الجينات', 'is_correct': False},
                                {'text': 'The chromosome number', 'text_ar': 'عدد الكروموسومات', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'A heritability value of 0.8 (80%) for height suggests that:',
                            'text_ar': 'قيمة توريثية 0.8 (80%) للطول تشير إلى أن:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '80% of height variation in the population is due to genetic differences', 'text_ar': '80% من تنوع الطول في المجتمع ناتج عن اختلافات وراثية', 'is_correct': True},
                                {'text': '80% of an individual\'s height comes from genes', 'text_ar': '80% من طول الفرد يأتي من الجينات', 'is_correct': False},
                                {'text': 'Environment contributes 80%', 'text_ar': 'البيئة تساهم بنسبة 80%', 'is_correct': False},
                                {'text': '80% of people have the same height', 'text_ar': '80% من الناس لديهم نفس الطول', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'How can biometrics help in agriculture and animal breeding?',
                            'text_ar': 'كيف يمكن للقياسات الحيوية أن تساعد في الزراعة وتربية الحيوانات؟',
                            'type': 'qcm_multiple',
                            'points': 2,
                            'choices': [
                                {'text': 'Select breeding stock with desirable quantitative traits', 'text_ar': 'اختيار قطعان التربية ذات الصفات الكمية المرغوبة', 'is_correct': True},
                                {'text': 'Predict crop yield variation', 'text_ar': 'التنبؤ بتنوع إنتاجية المحاصيل', 'is_correct': True},
                                {'text': 'Create new chromosomes', 'text_ar': 'إنشاء كروموسومات جديدة', 'is_correct': False},
                                {'text': 'Eliminate all genetic variation', 'text_ar': 'القضاء على كل التنوع الوراثي', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Correlation coefficients in biometrics range from:',
                            'text_ar': 'معاملات الارتباط في القياسات الحيوية تتراوح من:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '-1 to +1', 'text_ar': '-1 إلى +1', 'is_correct': True},
                                {'text': '0 to 100', 'text_ar': '0 إلى 100', 'is_correct': False},
                                {'text': '0 to infinity', 'text_ar': '0 إلى ما لا نهاية', 'is_correct': False},
                                {'text': '-100 to +100', 'text_ar': '-100 إلى +100', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Twin studies in biometrics are valuable because they help:',
                            'text_ar': 'دراسات التوائم في القياسات الحيوية قيمة لأنها تساعد على:',
                            'type': 'qcm_multiple',
                            'points': 2,
                            'choices': [
                                {'text': 'Separate genetic from environmental contributions to traits', 'text_ar': 'فصل المساهمات الوراثية عن البيئية للصفات', 'is_correct': True},
                                {'text': 'Estimate heritability of complex traits', 'text_ar': 'تقدير توريثية الصفات المعقدة', 'is_correct': True},
                                {'text': 'Create identical organisms artificially', 'text_ar': 'إنشاء كائنات متطابقة اصطناعيا', 'is_correct': False},
                                {'text': 'Prevent all genetic diseases', 'text_ar': 'منع جميع الأمراض الوراثية', 'is_correct': False},
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
            self.stdout.write(self.style.ERROR("Lesson 109 not found"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {str(e)}"))
