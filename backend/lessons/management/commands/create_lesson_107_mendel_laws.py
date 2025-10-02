# lessons/management/commands/create_lesson_107_mendel_laws.py

from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice
from users.models import User

class Command(BaseCommand):
    help = 'Create exercises for Lesson 107: Statistical laws of transmission of hereditary traits in diploids'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    def handle(self, *args, **options):
        try:
            # Get the lesson
            lesson = Lesson.objects.get(id=107)
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
                    'title': 'Mendel\'s First Law - Law of Segregation',
                    'title_ar': 'قانون مندل الأول - قانون الفصل',
                    'difficulty': 'beginner',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'What does Mendel\'s First Law state?',
                            'text_ar': 'ماذا ينص قانون مندل الأول؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Alleles segregate during gamete formation', 'text_ar': 'تنفصل الأليلات أثناء تكوين الأمشاج', 'is_correct': True},
                                {'text': 'Genes are always inherited together', 'text_ar': 'تورث الجينات دائما معا', 'is_correct': False},
                                {'text': 'Dominant traits are always expressed', 'text_ar': 'تظهر الصفات السائدة دائما', 'is_correct': False},
                                {'text': 'Genes mutate during reproduction', 'text_ar': 'تتحور الجينات أثناء التكاثر', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'In a monohybrid cross between two heterozygotes (Aa × Aa), what is the phenotypic ratio?',
                            'text_ar': 'في تزاوج أحادي بين فردين هجينين (Aa × Aa)، ما هي النسبة المظهرية؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '3:1 (dominant:recessive)', 'text_ar': '3:1 (سائد:متنحي)', 'is_correct': True},
                                {'text': '1:1 (dominant:recessive)', 'text_ar': '1:1 (سائد:متنحي)', 'is_correct': False},
                                {'text': '2:1 (dominant:recessive)', 'text_ar': '2:1 (سائد:متنحي)', 'is_correct': False},
                                {'text': '4:0 (all dominant)', 'text_ar': '4:0 (كلها سائدة)', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is the genotypic ratio in an Aa × Aa cross?',
                            'text_ar': 'ما هي النسبة الوراثية في تزاوج Aa × Aa؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '1 AA : 2 Aa : 1 aa', 'text_ar': '1 AA : 2 Aa : 1 aa', 'is_correct': True},
                                {'text': '3 AA : 1 aa', 'text_ar': '3 AA : 1 aa', 'is_correct': False},
                                {'text': '2 AA : 2 aa', 'text_ar': '2 AA : 2 aa', 'is_correct': False},
                                {'text': '1 AA : 3 Aa', 'text_ar': '1 AA : 3 Aa', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'In a test cross (Aa × aa), what proportion of offspring will show the recessive phenotype?',
                            'text_ar': 'في تزاوج اختباري (Aa × aa)، ما نسبة النسل الذي سيظهر الصفة المتنحية؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '50% (1:1 ratio)', 'text_ar': '50% (نسبة 1:1)', 'is_correct': True},
                                {'text': '25%', 'text_ar': '25%', 'is_correct': False},
                                {'text': '75%', 'text_ar': '75%', 'is_correct': False},
                                {'text': '100%', 'text_ar': '100%', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'A heterozygote carries which combination of alleles?',
                            'text_ar': 'يحمل الفرد الهجين أي مزيج من الأليلات؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'One dominant and one recessive allele', 'text_ar': 'أليل سائد واحد وأليل متنحي واحد', 'is_correct': True},
                                {'text': 'Two dominant alleles', 'text_ar': 'أليلان سائدان', 'is_correct': False},
                                {'text': 'Two recessive alleles', 'text_ar': 'أليلان متنحيان', 'is_correct': False},
                                {'text': 'Three or more alleles', 'text_ar': 'ثلاثة أليلات أو أكثر', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Mendel\'s pea plants with round seeds (R) are dominant over wrinkled seeds (r). A homozygous round plant crosses with a wrinkled plant. What percentage of F1 will have round seeds?',
                            'text_ar': 'نباتات البازلاء ذات البذور المستديرة (R) سائدة على البذور المتجعدة (r). نبات مستدير نقي يتزاوج مع نبات متجعد. ما نسبة الجيل الأول التي ستكون لها بذور مستديرة؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '100%', 'text_ar': '100%', 'is_correct': True},
                                {'text': '75%', 'text_ar': '75%', 'is_correct': False},
                                {'text': '50%', 'text_ar': '50%', 'is_correct': False},
                                {'text': '25%', 'text_ar': '25%', 'is_correct': False},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Mendel\'s Second Law - Law of Independent Assortment',
                    'title_ar': 'قانون مندل الثاني - قانون التوزيع الحر',
                    'difficulty': 'intermediate',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'What does Mendel\'s Second Law state?',
                            'text_ar': 'ماذا ينص قانون مندل الثاني؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Genes for different traits assort independently during gamete formation', 'text_ar': 'تتوزع الجينات الخاصة بصفات مختلفة بشكل مستقل أثناء تكوين الأمشاج', 'is_correct': True},
                                {'text': 'All genes are inherited together', 'text_ar': 'تورث جميع الجينات معا', 'is_correct': False},
                                {'text': 'Dominant genes prevent recessive ones from being expressed', 'text_ar': 'تمنع الجينات السائدة الجينات المتنحية من الظهور', 'is_correct': False},
                                {'text': 'Genes always stay on the same chromosome', 'text_ar': 'تبقى الجينات دائما على نفس الكروموسوم', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'In a dihybrid cross (RrYy × RrYy), how many different phenotypes appear in F2?',
                            'text_ar': 'في تزاوج ثنائي (RrYy × RrYy)، كم عدد الأنماط المظهرية المختلفة في الجيل الثاني؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '4 phenotypes', 'text_ar': '4 أنماط مظهرية', 'is_correct': True},
                                {'text': '2 phenotypes', 'text_ar': 'نمطان مظهريان', 'is_correct': False},
                                {'text': '9 phenotypes', 'text_ar': '9 أنماط مظهرية', 'is_correct': False},
                                {'text': '16 phenotypes', 'text_ar': '16 نمطا مظهريا', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is the classic phenotypic ratio in a dihybrid cross F2 generation?',
                            'text_ar': 'ما هي النسبة المظهرية الكلاسيكية في الجيل الثاني من التزاوج الثنائي؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '9:3:3:1', 'text_ar': '9:3:3:1', 'is_correct': True},
                                {'text': '3:1', 'text_ar': '3:1', 'is_correct': False},
                                {'text': '1:2:1', 'text_ar': '1:2:1', 'is_correct': False},
                                {'text': '1:1:1:1', 'text_ar': '1:1:1:1', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'How many different gamete types can an RrYy individual produce?',
                            'text_ar': 'كم عدد أنواع الأمشاج المختلفة التي يمكن أن ينتجها فرد RrYy؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '4 types (RY, Ry, rY, ry)', 'text_ar': '4 أنواع (RY, Ry, rY, ry)', 'is_correct': True},
                                {'text': '2 types', 'text_ar': 'نوعان', 'is_correct': False},
                                {'text': '8 types', 'text_ar': '8 أنواع', 'is_correct': False},
                                {'text': '16 types', 'text_ar': '16 نوعا', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Independent assortment occurs during which phase of meiosis?',
                            'text_ar': 'يحدث التوزيع المستقل خلال أي مرحلة من الانقسام المنصف؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Metaphase I', 'text_ar': 'الطور الاستوائي الأول', 'is_correct': True},
                                {'text': 'Prophase I', 'text_ar': 'الطور التمهيدي الأول', 'is_correct': False},
                                {'text': 'Anaphase II', 'text_ar': 'الطور الانفصالي الثاني', 'is_correct': False},
                                {'text': 'Telophase I', 'text_ar': 'الطور النهائي الأول', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What condition is necessary for independent assortment to occur?',
                            'text_ar': 'ما هو الشرط الضروري لحدوث التوزيع المستقل؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Genes must be on different chromosomes or far apart on the same chromosome', 'text_ar': 'يجب أن تكون الجينات على كروموسومات مختلفة أو بعيدة عن بعضها على نفس الكروموسوم', 'is_correct': True},
                                {'text': 'Genes must be on the same chromosome close together', 'text_ar': 'يجب أن تكون الجينات على نفس الكروموسوم قريبة من بعضها', 'is_correct': False},
                                {'text': 'All genes must be dominant', 'text_ar': 'يجب أن تكون جميع الجينات سائدة', 'is_correct': False},
                                {'text': 'Organisms must be haploid', 'text_ar': 'يجب أن تكون الكائنات أحادية المجموعة الكروموسومية', 'is_correct': False},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Punnett Squares and Probability',
                    'title_ar': 'مربعات بانيت والاحتمالات',
                    'difficulty': 'intermediate',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'What tool did Reginald Punnett develop to predict genetic outcomes?',
                            'text_ar': 'ما الأداة التي طورها رجينالد بانيت للتنبؤ بالنتائج الوراثية؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Punnett Square', 'text_ar': 'مربع بانيت', 'is_correct': True},
                                {'text': 'Genetic calculator', 'text_ar': 'حاسبة وراثية', 'is_correct': False},
                                {'text': 'DNA sequencer', 'text_ar': 'جهاز تسلسل الحمض النووي', 'is_correct': False},
                                {'text': 'Karyotype chart', 'text_ar': 'مخطط النمط الكروموسومي', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'In a monohybrid cross, how many boxes does a Punnett square contain?',
                            'text_ar': 'في التزاوج الأحادي، كم عدد المربعات في مربع بانيت؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '4 boxes (2×2 grid)', 'text_ar': '4 مربعات (شبكة 2×2)', 'is_correct': True},
                                {'text': '9 boxes', 'text_ar': '9 مربعات', 'is_correct': False},
                                {'text': '16 boxes', 'text_ar': '16 مربعا', 'is_correct': False},
                                {'text': '2 boxes', 'text_ar': 'مربعان', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is the probability that an Aa × Aa cross will produce an aa offspring?',
                            'text_ar': 'ما هو احتمال أن ينتج عن تزاوج Aa × Aa نسل aa؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '1/4 or 25%', 'text_ar': '1/4 أو 25%', 'is_correct': True},
                                {'text': '1/2 or 50%', 'text_ar': '1/2 أو 50%', 'is_correct': False},
                                {'text': '3/4 or 75%', 'text_ar': '3/4 أو 75%', 'is_correct': False},
                                {'text': '1/8 or 12.5%', 'text_ar': '1/8 أو 12.5%', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'In a dihybrid cross, a Punnett square contains how many boxes?',
                            'text_ar': 'في التزاوج الثنائي، كم عدد المربعات في مربع بانيت؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '16 boxes (4×4 grid)', 'text_ar': '16 مربعا (شبكة 4×4)', 'is_correct': True},
                                {'text': '4 boxes', 'text_ar': '4 مربعات', 'is_correct': False},
                                {'text': '9 boxes', 'text_ar': '9 مربعات', 'is_correct': False},
                                {'text': '8 boxes', 'text_ar': '8 مربعات', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What mathematical principle allows us to calculate probabilities of independent genetic events?',
                            'text_ar': 'ما المبدأ الرياضي الذي يسمح لنا بحساب احتمالات الأحداث الوراثية المستقلة؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Multiplication rule (probability of both events = P(A) × P(B))', 'text_ar': 'قاعدة الضرب (احتمال كلا الحدثين = ح(أ) × ح(ب))', 'is_correct': True},
                                {'text': 'Addition rule only', 'text_ar': 'قاعدة الجمع فقط', 'is_correct': False},
                                {'text': 'Division rule', 'text_ar': 'قاعدة القسمة', 'is_correct': False},
                                {'text': 'Subtraction rule', 'text_ar': 'قاعدة الطرح', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'If two parents are both heterozygous for two traits (RrYy × RrYy), what is the probability of offspring being homozygous recessive for both traits (rryy)?',
                            'text_ar': 'إذا كان كلا الوالدين هجينين لصفتين (RrYy × RrYy)، ما احتمال أن يكون النسل متنحيا نقيا لكلتا الصفتين (rryy)؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '1/16 (6.25%)', 'text_ar': '1/16 (6.25%)', 'is_correct': True},
                                {'text': '1/4 (25%)', 'text_ar': '1/4 (25%)', 'is_correct': False},
                                {'text': '3/16 (18.75%)', 'text_ar': '3/16 (18.75%)', 'is_correct': False},
                                {'text': '9/16 (56.25%)', 'text_ar': '9/16 (56.25%)', 'is_correct': False},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Test Crosses and Genetic Analysis',
                    'title_ar': 'التزاوجات الاختبارية والتحليل الوراثي',
                    'difficulty': 'advanced',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'What is the purpose of a test cross?',
                            'text_ar': 'ما هو الغرض من التزاوج الاختباري؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'To determine if an organism with dominant phenotype is homozygous or heterozygous', 'text_ar': 'لتحديد ما إذا كان الكائن الحي ذو النمط المظهري السائد نقيا أو هجينا', 'is_correct': True},
                                {'text': 'To create new species', 'text_ar': 'لإنشاء أنواع جديدة', 'is_correct': False},
                                {'text': 'To measure mutation rates', 'text_ar': 'لقياس معدلات الطفرات', 'is_correct': False},
                                {'text': 'To identify chromosome numbers', 'text_ar': 'لتحديد أعداد الكروموسومات', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'In a test cross, the organism with the dominant phenotype is crossed with which type?',
                            'text_ar': 'في التزاوج الاختباري، يتزاوج الكائن الحي ذو النمط المظهري السائد مع أي نوع؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Homozygous recessive individual (aa)', 'text_ar': 'فرد متنحي نقي (aa)', 'is_correct': True},
                                {'text': 'Homozygous dominant individual', 'text_ar': 'فرد سائد نقي', 'is_correct': False},
                                {'text': 'Another heterozygote', 'text_ar': 'فرد هجين آخر', 'is_correct': False},
                                {'text': 'Any random individual', 'text_ar': 'أي فرد عشوائي', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'If a test cross (A_ × aa) produces all offspring with the dominant phenotype, what is the genotype of the parent with dominant phenotype?',
                            'text_ar': 'إذا أنتج تزاوج اختباري (A_ × aa) نسلا كلهم بالنمط المظهري السائد، ما هو النمط الوراثي للوالد ذي النمط المظهري السائد؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'AA (homozygous dominant)', 'text_ar': 'AA (سائد نقي)', 'is_correct': True},
                                {'text': 'Aa (heterozygous)', 'text_ar': 'Aa (هجين)', 'is_correct': False},
                                {'text': 'aa (homozygous recessive)', 'text_ar': 'aa (متنحي نقي)', 'is_correct': False},
                                {'text': 'Cannot be determined', 'text_ar': 'لا يمكن تحديده', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'If a test cross produces a 1:1 ratio of dominant to recessive phenotypes, what is the unknown genotype?',
                            'text_ar': 'إذا أنتج تزاوج اختباري نسبة 1:1 من الأنماط المظهرية السائدة إلى المتنحية، ما هو النمط الوراثي المجهول؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Aa (heterozygous)', 'text_ar': 'Aa (هجين)', 'is_correct': True},
                                {'text': 'AA (homozygous dominant)', 'text_ar': 'AA (سائد نقي)', 'is_correct': False},
                                {'text': 'aa (homozygous recessive)', 'text_ar': 'aa (متنحي نقي)', 'is_correct': False},
                                {'text': 'AAa (trisomic)', 'text_ar': 'AAa (ثلاثي الصبغيات)', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What statistical test is commonly used to determine if observed genetic ratios match expected ratios?',
                            'text_ar': 'ما الاختبار الإحصائي المستخدم عادة لتحديد ما إذا كانت النسب الوراثية المرصودة تطابق النسب المتوقعة؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Chi-square (χ²) test', 'text_ar': 'اختبار كاي تربيع (χ²)', 'is_correct': True},
                                {'text': 'T-test', 'text_ar': 'اختبار ت', 'is_correct': False},
                                {'text': 'ANOVA', 'text_ar': 'تحليل التباين', 'is_correct': False},
                                {'text': 'Correlation test', 'text_ar': 'اختبار الارتباط', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'A dihybrid test cross (AaBb × aabb) produces offspring in which ratio?',
                            'text_ar': 'ينتج تزاوج اختباري ثنائي (AaBb × aabb) نسلا بأي نسبة؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': '1:1:1:1 (four equal phenotypes)', 'text_ar': '1:1:1:1 (أربعة أنماط مظهرية متساوية)', 'is_correct': True},
                                {'text': '9:3:3:1', 'text_ar': '9:3:3:1', 'is_correct': False},
                                {'text': '3:1', 'text_ar': '3:1', 'is_correct': False},
                                {'text': '1:2:1', 'text_ar': '1:2:1', 'is_correct': False},
                            ]
                        },
                    ]
                },
                {
                    'title': 'Applications and Extensions of Mendelian Genetics',
                    'title_ar': 'تطبيقات وامتدادات علم الوراثة المندلية',
                    'difficulty': 'advanced',
                    'points': 12,
                    'questions': [
                        {
                            'text': 'Which phenomenon occurs when offspring phenotypes are intermediate between two parental phenotypes?',
                            'text_ar': 'ما الظاهرة التي تحدث عندما تكون الأنماط المظهرية للنسل وسطا بين نمطين والديين؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Incomplete dominance', 'text_ar': 'السيادة غير التامة', 'is_correct': True},
                                {'text': 'Complete dominance', 'text_ar': 'السيادة التامة', 'is_correct': False},
                                {'text': 'Epistasis', 'text_ar': 'الإخفاء الجيني', 'is_correct': False},
                                {'text': 'Pleiotropy', 'text_ar': 'تعدد التأثيرات', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What genetic situation occurs when both alleles are fully expressed in heterozygotes (e.g., ABO blood types)?',
                            'text_ar': 'ما الحالة الوراثية التي تحدث عندما يظهر كلا الأليلين بالكامل في الأفراد الهجينة (مثل فصائل الدم ABO)؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Codominance', 'text_ar': 'السيادة المشتركة', 'is_correct': True},
                                {'text': 'Incomplete dominance', 'text_ar': 'السيادة غير التامة', 'is_correct': False},
                                {'text': 'Recessive inheritance', 'text_ar': 'الوراثة المتنحية', 'is_correct': False},
                                {'text': 'Sex-linked inheritance', 'text_ar': 'الوراثة المرتبطة بالجنس', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What term describes a gene that affects multiple phenotypic traits?',
                            'text_ar': 'ما المصطلح الذي يصف الجين الذي يؤثر على صفات مظهرية متعددة؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Pleiotropic gene', 'text_ar': 'جين متعدد التأثيرات', 'is_correct': True},
                                {'text': 'Polygenic gene', 'text_ar': 'جين متعدد الجينات', 'is_correct': False},
                                {'text': 'Epistatic gene', 'text_ar': 'جين إخفائي', 'is_correct': False},
                                {'text': 'Linked gene', 'text_ar': 'جين مرتبط', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'When multiple genes influence a single phenotypic trait (e.g., skin color, height), this is called:',
                            'text_ar': 'عندما تؤثر جينات متعددة على صفة مظهرية واحدة (مثل لون البشرة، الطول)، يسمى هذا:',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'Polygenic inheritance', 'text_ar': 'الوراثة متعددة الجينات', 'is_correct': True},
                                {'text': 'Pleiotropy', 'text_ar': 'تعدد التأثيرات', 'is_correct': False},
                                {'text': 'Complete dominance', 'text_ar': 'السيادة التامة', 'is_correct': False},
                                {'text': 'Epistasis', 'text_ar': 'الإخفاء الجيني', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'What is epistasis?',
                            'text_ar': 'ما هو الإخفاء الجيني؟',
                            'type': 'qcm_single',
                            'points': 2,
                            'choices': [
                                {'text': 'When one gene masks or modifies the expression of another gene', 'text_ar': 'عندما يخفي جين أو يعدل تعبير جين آخر', 'is_correct': True},
                                {'text': 'When genes mutate frequently', 'text_ar': 'عندما تتحور الجينات بشكل متكرر', 'is_correct': False},
                                {'text': 'When dominant alleles disappear', 'text_ar': 'عندما تختفي الأليلات السائدة', 'is_correct': False},
                                {'text': 'When chromosomes fail to separate', 'text_ar': 'عندما تفشل الكروموسومات في الانفصال', 'is_correct': False},
                            ]
                        },
                        {
                            'text': 'Mendel\'s laws do NOT apply directly to genes that are:',
                            'text_ar': 'لا تنطبق قوانين مندل مباشرة على الجينات التي:',
                            'type': 'qcm_multiple',
                            'points': 2,
                            'choices': [
                                {'text': 'Located close together on the same chromosome (linked)', 'text_ar': 'تقع قريبة من بعضها على نفس الكروموسوم (مرتبطة)', 'is_correct': True},
                                {'text': 'Show incomplete dominance', 'text_ar': 'تظهر سيادة غير تامة', 'is_correct': True},
                                {'text': 'On different chromosomes', 'text_ar': 'على كروموسومات مختلفة', 'is_correct': False},
                                {'text': 'Follow standard dominant/recessive patterns', 'text_ar': 'تتبع الأنماط القياسية للسيادة/التنحي', 'is_correct': False},
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
            self.stdout.write(self.style.ERROR("Lesson 107 not found"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {str(e)}"))
