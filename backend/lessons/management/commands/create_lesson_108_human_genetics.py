# lessons/management/commands/create_lesson_108_human_genetics.py

from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice
from users.models import User

class Command(BaseCommand):
    help = 'Create exercises for Lesson 108: Human genetics'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    def handle(self, *args, **options):
        try:
            # Get the lesson
            lesson = Lesson.objects.get(id=108)
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
                    'title': 'Human Chromosomes and Karyotypes',
                    'title_ar': 'الكروموسومات البشرية والنمط الكروموسومي',
                    'difficulty': 'beginner',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'How many chromosomes do normal human somatic cells contain?',
                            'text_ar': 'كم عدد الكروموسومات في الخلايا الجسدية البشرية الطبيعية؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '46 chromosomes (23 pairs)', 'text_ar': '46 كروموسوما (23 زوجا)', 'is_correct': True},
                                {'text': '23 chromosomes', 'text_ar': '23 كروموسوما', 'is_correct': False},
                                {'text': '48 chromosomes', 'text_ar': '48 كروموسوما', 'is_correct': False},
                                {'text': '92 chromosomes', 'text_ar': '92 كروموسوما', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What are the sex chromosomes in a human female?',
                            'text_ar': 'ما هي الكروموسومات الجنسية في الأنثى البشرية؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'XX', 'text_ar': 'XX', 'is_correct': True},
                                {'text': 'XY', 'text_ar': 'XY', 'is_correct': False},
                                {'text': 'YY', 'text_ar': 'YY', 'is_correct': False},
                                {'text': 'XO', 'text_ar': 'XO', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is a karyotype?',
                            'text_ar': 'ما هو النمط الكروموسومي؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'A photograph of chromosomes arranged by size and structure', 'text_ar': 'صورة للكروموسومات مرتبة حسب الحجم والبنية', 'is_correct': True},
                                {'text': 'A DNA sequence', 'text_ar': 'تسلسل الحمض النووي', 'is_correct': False},
                                {'text': 'A type of blood test', 'text_ar': 'نوع من تحليل الدم', 'is_correct': False},
                                {'text': 'A genetic mutation', 'text_ar': 'طفرة وراثية', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'How many pairs of autosomes do humans have?',
                            'text_ar': 'كم عدد أزواج الكروموسومات الجسمية عند الإنسان؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '22 pairs', 'text_ar': '22 زوجا', 'is_correct': True},
                                {'text': '23 pairs', 'text_ar': '23 زوجا', 'is_correct': False},
                                {'text': '21 pairs', 'text_ar': '21 زوجا', 'is_correct': False},
                                {'text': '46 pairs', 'text_ar': '46 زوجا', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Which parent determines the biological sex of offspring in humans?',
                            'text_ar': 'أي من الوالدين يحدد الجنس البيولوجي للنسل عند البشر؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'The father (provides X or Y chromosome)', 'text_ar': 'الأب (يقدم كروموسوم X أو Y)', 'is_correct': True},
                                {'text': 'The mother (provides X or Y chromosome)', 'text_ar': 'الأم (تقدم كروموسوم X أو Y)', 'is_correct': False},
                                {'text': 'Both parents equally', 'text_ar': 'كلا الوالدين بالتساوي', 'is_correct': False},
                                {'text': 'Random environmental factors', 'text_ar': 'عوامل بيئية عشوائية', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What stage of cell division is best for viewing chromosomes in a karyotype?',
                            'text_ar': 'ما مرحلة الانقسام الخلوي الأفضل لرؤية الكروموسومات في النمط الكروموسومي؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Metaphase (chromosomes most condensed)', 'text_ar': 'الطور الاستوائي (الكروموسومات أكثر تكثفا)', 'is_correct': True},
                                {'text': 'Interphase', 'text_ar': 'الطور البيني', 'is_correct': False},
                                {'text': 'Telophase', 'text_ar': 'الطور النهائي', 'is_correct': False},
                                {'text': 'Cytokinesis', 'text_ar': 'الانقسام السيتوبلازمي', 'is_correct': False},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Autosomal Genetic Disorders',
                    'title_ar': 'الاضطرابات الوراثية الجسمية',
                    'difficulty': 'intermediate',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'Cystic fibrosis is an example of which inheritance pattern?',
                            'text_ar': 'التليف الكيسي مثال على أي نمط وراثي؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Autosomal recessive', 'text_ar': 'جسمي متنحي', 'is_correct': True},
                                {'text': 'Autosomal dominant', 'text_ar': 'جسمي سائد', 'is_correct': False},
                                {'text': 'X-linked recessive', 'text_ar': 'متنحي مرتبط بX', 'is_correct': False},
                                {'text': 'Y-linked', 'text_ar': 'مرتبط بY', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is the probability that two carriers (Aa) of an autosomal recessive disorder will have an affected child?',
                            'text_ar': 'ما احتمال أن ينجب حاملان (Aa) لاضطراب جسمي متنحي طفلا مصابا؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '25% (1/4)', 'text_ar': '25% (1/4)', 'is_correct': True},
                                {'text': '50% (1/2)', 'text_ar': '50% (1/2)', 'is_correct': False},
                                {'text': '75% (3/4)', 'text_ar': '75% (3/4)', 'is_correct': False},
                                {'text': '100%', 'text_ar': '100%', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Huntington\'s disease is an autosomal dominant disorder. If one parent has the disease (Hh) and the other is healthy (hh), what percentage of offspring will inherit the disease?',
                            'text_ar': 'مرض هنتنغتون اضطراب جسمي سائد. إذا كان أحد الوالدين مصابا بالمرض (Hh) والآخر سليم (hh)، ما نسبة النسل التي سترث المرض؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '50%', 'text_ar': '50%', 'is_correct': True},
                                {'text': '25%', 'text_ar': '25%', 'is_correct': False},
                                {'text': '75%', 'text_ar': '75%', 'is_correct': False},
                                {'text': '100%', 'text_ar': '100%', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Sickle cell anemia is caused by:',
                            'text_ar': 'فقر الدم المنجلي ناتج عن:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'A mutation in the hemoglobin gene (autosomal recessive)', 'text_ar': 'طفرة في جين الهيموجلوبين (جسمي متنحي)', 'is_correct': True},
                                {'text': 'Missing chromosome 21', 'text_ar': 'فقدان الكروموسوم 21', 'is_correct': False},
                                {'text': 'Extra X chromosome', 'text_ar': 'كروموسوم X إضافي', 'is_correct': False},
                                {'text': 'Viral infection', 'text_ar': 'عدوى فيروسية', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Why do carriers of recessive genetic disorders typically not show symptoms?',
                            'text_ar': 'لماذا لا يظهر الحاملون للاضطرابات الوراثية المتنحية أعراضا عادة؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'One functional allele produces enough normal protein', 'text_ar': 'أليل وظيفي واحد ينتج بروتينا طبيعيا كافيا', 'is_correct': True},
                                {'text': 'The disorder skips a generation', 'text_ar': 'يتخطى الاضطراب جيلا', 'is_correct': False},
                                {'text': 'Carriers have extra chromosomes', 'text_ar': 'الحاملون لديهم كروموسومات إضافية', 'is_correct': False},
                                {'text': 'Environmental factors prevent symptoms', 'text_ar': 'العوامل البيئية تمنع الأعراض', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Which statement is true about autosomal dominant disorders?',
                            'text_ar': 'أي عبارة صحيحة عن الاضطرابات الجسمية السائدة؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Only one mutant allele is needed to express the disorder', 'text_ar': 'يلزم أليل متحور واحد فقط لإظهار الاضطراب', 'is_correct': True},
                                {'text': 'Both parents must be carriers', 'text_ar': 'يجب أن يكون كلا الوالدين حاملين', 'is_correct': False},
                                {'text': 'Only males are affected', 'text_ar': 'الذكور فقط يتأثرون', 'is_correct': False},
                                {'text': 'The disorder only affects reproductive organs', 'text_ar': 'الاضطراب يؤثر فقط على الأعضاء التناسلية', 'is_correct': False},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Sex-Linked Inheritance',
                    'title_ar': 'الوراثة المرتبطة بالجنس',
                    'difficulty': 'intermediate',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'Color blindness is typically inherited as an X-linked recessive trait. Why are males more commonly affected than females?',
                            'text_ar': 'عمى الألوان عادة يورث كصفة متنحية مرتبطة بX. لماذا الذكور أكثر تأثرا من الإناث؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Males have only one X chromosome, so one recessive allele causes the condition', 'text_ar': 'الذكور لديهم كروموسوم X واحد فقط، لذا أليل متنحي واحد يسبب الحالة', 'is_correct': True},
                                {'text': 'Males have weaker immune systems', 'text_ar': 'الذكور لديهم أجهزة مناعية أضعف', 'is_correct': False},
                                {'text': 'The Y chromosome enhances the trait', 'text_ar': 'كروموسوم Y يعزز الصفة', 'is_correct': False},
                                {'text': 'Males are exposed to more environmental triggers', 'text_ar': 'الذكور معرضون لمحفزات بيئية أكثر', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'A carrier female (X^H X^h) for hemophilia has children with a normal male (X^H Y). What is the probability their son will have hemophilia?',
                            'text_ar': 'أنثى حاملة (X^H X^h) للهيموفيليا لديها أطفال مع ذكر طبيعي (X^H Y). ما احتمال أن يكون ابنهم مصابا بالهيموفيليا؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '50% (sons have 1/2 chance of inheriting X^h)', 'text_ar': '50% (الأبناء لديهم فرصة 1/2 لوراثة X^h)', 'is_correct': True},
                                {'text': '25%', 'text_ar': '25%', 'is_correct': False},
                                {'text': '75%', 'text_ar': '75%', 'is_correct': False},
                                {'text': '0% (only daughters can be carriers)', 'text_ar': '0% (الإناث فقط يمكن أن يكونوا حاملين)', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Can a daughter inherit an X-linked recessive disorder?',
                            'text_ar': 'هل يمكن للبنت أن ترث اضطرابا متنحيا مرتبطا بX؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Yes, if she inherits the recessive allele from both parents', 'text_ar': 'نعم، إذا ورثت الأليل المتنحي من كلا الوالدين', 'is_correct': True},
                                {'text': 'No, only males can have X-linked disorders', 'text_ar': 'لا، الذكور فقط يمكن أن يكون لديهم اضطرابات مرتبطة بX', 'is_correct': False},
                                {'text': 'Yes, but only from the mother', 'text_ar': 'نعم، ولكن فقط من الأم', 'is_correct': False},
                                {'text': 'No, daughters always have normal vision', 'text_ar': 'لا، البنات دائما لديهن رؤية طبيعية', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is the genotype of a carrier female for an X-linked recessive trait?',
                            'text_ar': 'ما هو النمط الوراثي لأنثى حاملة لصفة متنحية مرتبطة بX؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'X^H X^h (heterozygous)', 'text_ar': 'X^H X^h (هجينة)', 'is_correct': True},
                                {'text': 'X^h X^h (homozygous recessive)', 'text_ar': 'X^h X^h (متنحية نقية)', 'is_correct': False},
                                {'text': 'X^H Y', 'text_ar': 'X^H Y', 'is_correct': False},
                                {'text': 'X^h Y', 'text_ar': 'X^h Y', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Duchenne muscular dystrophy is X-linked recessive. An affected male (X^d Y) has children with a carrier female (X^D X^d). What proportion of their daughters will be carriers?',
                            'text_ar': 'حثل دوشين العضلي متنحي مرتبط بX. ذكر مصاب (X^d Y) لديه أطفال مع أنثى حاملة (X^D X^d). ما نسبة بناتهم اللواتي سيكونون حاملات؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '50% carriers, 50% affected', 'text_ar': '50% حاملات، 50% مصابات', 'is_correct': True},
                                {'text': '100% carriers', 'text_ar': '100% حاملات', 'is_correct': False},
                                {'text': '25% carriers', 'text_ar': '25% حاملات', 'is_correct': False},
                                {'text': '0% carriers (all normal)', 'text_ar': '0% حاملات (كلهن طبيعيات)', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Which parent passes the X chromosome to male offspring?',
                            'text_ar': 'أي من الوالدين ينقل كروموسوم X إلى النسل الذكور؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Only the mother', 'text_ar': 'الأم فقط', 'is_correct': True},
                                {'text': 'Only the father', 'text_ar': 'الأب فقط', 'is_correct': False},
                                {'text': 'Both parents', 'text_ar': 'كلا الوالدين', 'is_correct': False},
                                {'text': 'Neither parent', 'text_ar': 'لا أحد من الوالدين', 'is_correct': False},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Chromosomal Abnormalities',
                    'title_ar': 'الشذوذات الكروموسومية',
                    'difficulty': 'advanced',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'Down syndrome (Trisomy 21) is caused by:',
                            'text_ar': 'متلازمة داون (تثلث الصبغي 21) ناتجة عن:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Three copies of chromosome 21 instead of two', 'text_ar': 'ثلاث نسخ من الكروموسوم 21 بدلا من اثنتين', 'is_correct': True},
                                {'text': 'Missing chromosome 21', 'text_ar': 'فقدان الكروموسوم 21', 'is_correct': False},
                                {'text': 'Mutation in chromosome 21 gene', 'text_ar': 'طفرة في جين الكروموسوم 21', 'is_correct': False},
                                {'text': 'Extra sex chromosome', 'text_ar': 'كروموسوم جنسي إضافي', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What process during cell division typically causes chromosomal abnormalities like trisomy?',
                            'text_ar': 'ما العملية أثناء الانقسام الخلوي التي تسبب عادة الشذوذات الكروموسومية مثل التثلث الصبغي؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Nondisjunction (chromosomes fail to separate properly)', 'text_ar': 'عدم الانفصال (تفشل الكروموسومات في الانفصال بشكل صحيح)', 'is_correct': True},
                                {'text': 'DNA replication errors', 'text_ar': 'أخطاء في تضاعف الحمض النووي', 'is_correct': False},
                                {'text': 'Crossing over', 'text_ar': 'العبور', 'is_correct': False},
                                {'text': 'Gene mutation', 'text_ar': 'طفرة جينية', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Turner syndrome (45,X) affects which sex?',
                            'text_ar': 'متلازمة تيرنر (45,X) تصيب أي جنس؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Females (missing one X chromosome)', 'text_ar': 'الإناث (فقدان كروموسوم X واحد)', 'is_correct': True},
                                {'text': 'Males (missing Y chromosome)', 'text_ar': 'الذكور (فقدان كروموسوم Y)', 'is_correct': False},
                                {'text': 'Both males and females equally', 'text_ar': 'الذكور والإناث بالتساوي', 'is_correct': False},
                                {'text': 'Neither sex', 'text_ar': 'لا أي جنس', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Klinefelter syndrome has which chromosomal composition?',
                            'text_ar': 'متلازمة كلاينفلتر لها أي تركيب كروموسومي؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '47,XXY (males with extra X chromosome)', 'text_ar': '47,XXY (ذكور بكروموسوم X إضافي)', 'is_correct': True},
                                {'text': '45,X', 'text_ar': '45,X', 'is_correct': False},
                                {'text': '47,XYY', 'text_ar': '47,XYY', 'is_correct': False},
                                {'text': '47,XXX', 'text_ar': '47,XXX', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is the primary risk factor for chromosomal nondisjunction?',
                            'text_ar': 'ما عامل الخطر الأساسي لعدم الانفصال الكروموسومي؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Advanced maternal age (particularly for trisomies)', 'text_ar': 'عمر الأم المتقدم (خاصة للتثلثات الصبغية)', 'is_correct': True},
                                {'text': 'Paternal smoking', 'text_ar': 'تدخين الأب', 'is_correct': False},
                                {'text': 'Diet during pregnancy', 'text_ar': 'النظام الغذائي أثناء الحمل', 'is_correct': False},
                                {'text': 'Exercise level', 'text_ar': 'مستوى التمرين', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is monosomy?',
                            'text_ar': 'ما هو أحادي الصبغي؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Having only one copy of a chromosome instead of two', 'text_ar': 'وجود نسخة واحدة فقط من الكروموسوم بدلا من اثنتين', 'is_correct': True},
                                {'text': 'Having three copies of a chromosome', 'text_ar': 'وجود ثلاث نسخ من الكروموسوم', 'is_correct': False},
                                {'text': 'Having four copies of a chromosome', 'text_ar': 'وجود أربع نسخ من الكروموسوم', 'is_correct': False},
                                {'text': 'Having normal chromosome number', 'text_ar': 'وجود عدد طبيعي من الكروموسومات', 'is_correct': False},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Genetic Counseling and Pedigree Analysis',
                    'title_ar': 'الاستشارة الوراثية وتحليل النسب',
                    'difficulty': 'advanced',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'What is a pedigree in genetics?',
                            'text_ar': 'ما هي شجرة النسب في علم الوراثة؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'A diagram showing inheritance patterns across multiple generations', 'text_ar': 'مخطط يظهر أنماط الوراثة عبر أجيال متعددة', 'is_correct': True},
                                {'text': 'A type of chromosome', 'text_ar': 'نوع من الكروموسومات', 'is_correct': False},
                                {'text': 'A genetic test result', 'text_ar': 'نتيجة اختبار وراثي', 'is_correct': False},
                                {'text': 'A mutation catalog', 'text_ar': 'كتالوج الطفرات', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'In a pedigree, how are affected individuals typically shown?',
                            'text_ar': 'في شجرة النسب، كيف يظهر الأفراد المصابون عادة؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Filled/shaded symbols (squares for males, circles for females)', 'text_ar': 'رموز ممتلئة/مظللة (مربعات للذكور، دوائر للإناث)', 'is_correct': True},
                                {'text': 'Empty symbols', 'text_ar': 'رموز فارغة', 'is_correct': False},
                                {'text': 'Triangle shapes', 'text_ar': 'أشكال مثلثة', 'is_correct': False},
                                {'text': 'Star symbols', 'text_ar': 'رموز نجمية', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Which pattern suggests autosomal recessive inheritance in a pedigree?',
                            'text_ar': 'أي نمط يقترح الوراثة الجسمية المتنحية في شجرة النسب؟',
                            'type': 'qcm_multiple',
                            'points': 2,
                            'choices': [
                                {'text': 'Affected children from unaffected parents', 'text_ar': 'أطفال مصابون من والدين غير مصابين', 'is_correct': True},
                                {'text': 'Appears in every generation', 'text_ar': 'تظهر في كل جيل', 'is_correct': False},
                                {'text': 'Affects both sexes equally', 'text_ar': 'تصيب كلا الجنسين بالتساوي', 'is_correct': True},
                                {'text': 'Only affects males', 'text_ar': 'تصيب الذكور فقط', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is the role of a genetic counselor?',
                            'text_ar': 'ما هو دور المستشار الوراثي؟',
                            'type': 'qcm_multiple',
                            'points': 2,
                            'choices': [
                                {'text': 'Assess genetic risk for families', 'text_ar': 'تقييم المخاطر الوراثية للعائلات', 'is_correct': True},
                                {'text': 'Interpret genetic test results', 'text_ar': 'تفسير نتائج الاختبارات الوراثية', 'is_correct': True},
                                {'text': 'Perform surgery', 'text_ar': 'إجراء الجراحة', 'is_correct': False},
                                {'text': 'Prescribe medications', 'text_ar': 'وصف الأدوية', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Prenatal diagnostic tests like amniocentesis are used to:',
                            'text_ar': 'تستخدم الاختبارات التشخيصية قبل الولادة مثل بزل السلى لـ:',
                            'type': 'qcm_multiple',
                            'points': 2,
                            'choices': [
                                {'text': 'Detect chromosomal abnormalities in the fetus', 'text_ar': 'كشف الشذوذات الكروموسومية في الجنين', 'is_correct': True},
                                {'text': 'Identify genetic disorders before birth', 'text_ar': 'تحديد الاضطرابات الوراثية قبل الولادة', 'is_correct': True},
                                {'text': 'Change the fetus\'s genes', 'text_ar': 'تغيير جينات الجنين', 'is_correct': False},
                                {'text': 'Prevent all genetic diseases', 'text_ar': 'منع جميع الأمراض الوراثية', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What information is most important when constructing a medical pedigree?',
                            'text_ar': 'ما المعلومات الأكثر أهمية عند بناء شجرة نسب طبية؟',
                            'type': 'qcm_multiple',
                            'points': 2,
                            'choices': [
                                {'text': 'Family health history across generations', 'text_ar': 'تاريخ العائلة الصحي عبر الأجيال', 'is_correct': True},
                                {'text': 'Ages of onset for genetic conditions', 'text_ar': 'أعمار بداية الحالات الوراثية', 'is_correct': True},
                                {'text': 'Blood types of all family members', 'text_ar': 'فصائل دم جميع أفراد العائلة', 'is_correct': False},
                                {'text': 'Favorite foods', 'text_ar': 'الأطعمة المفضلة', 'is_correct': False},
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
            self.stdout.write(self.style.ERROR("Lesson 108 not found"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {str(e)}"))
