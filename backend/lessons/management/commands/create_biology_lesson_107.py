"""
Management Command for Creating Exercises for Lesson: Statistical laws of the transmission of hereditary traits in diploids (ID 107)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward


class Command(BaseCommand):
    help = 'Create exercises for "Statistical laws of the transmission of hereditary traits in diploids" - Lesson ID: 107'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            dest='delete_existing',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        lesson_id = 107
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
                'title': 'Mendel\'s Law of Segregation (Monohybrid Cross)', 'title_arabic': 'قانون مندل للانعزال (الهجونة الأحادية)', 'difficulty': 'beginner',
                'questions': [
                    {'type': 'qcm_single', 'text': 'An individual with two identical alleles for a trait is called:', 'text_arabic': 'يسمى الفرد الذي لديه أليلان متطابقان لصفة ما:', 'points': 2.0, 'choices': [
                        {'text': 'Homozygous', 'text_arabic': 'متماثل الزيجوت', 'is_correct': True},
                        {'text': 'Heterozygous', 'text_arabic': 'متخالف الزيجوت', 'is_correct': False},
                        {'text': 'Recessive', 'text_arabic': 'متنحي', 'is_correct': False},
                        {'text': 'Dominant', 'text_arabic': 'سائد', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'The observable characteristics of an organism constitute its genotype.', 'text_arabic': 'تشكل الخصائص الظاهرية للكائن الحي نمطه الوراثي.', 'points': 2.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'This is the phenotype. The genotype is the genetic makeup.', 'explanation_arabic': 'هذا هو النمط الظاهري. النمط الوراثي هو التركيب الجيني.'},
                    {'type': 'qcm_single', 'text': 'Mendel\'s Law of Segregation states that:', 'text_arabic': 'ينص قانون مندل للانعزال على أن:', 'points': 3.0, 'choices': [
                        {'text': 'Two alleles for a heritable character separate from each other during gamete formation.', 'text_arabic': 'ينفصل أليلان لصفة وراثية عن بعضهما البعض أثناء تكوين الأمشاج.', 'is_correct': True},
                        {'text': 'Genes for different traits assort independently of one another.', 'text_arabic': 'تتوزع جينات الصفات المختلفة بشكل مستقل عن بعضها البعض.', 'is_correct': False},
                        {'text': 'Recessive alleles are always masked by dominant alleles.', 'text_arabic': 'تُخفى الأليلات المتنحية دائمًا بواسطة الأليلات السائدة.', 'is_correct': False},
                        {'text': 'All offspring will resemble one of the parents.', 'text_arabic': 'سيشبه كل النسل أحد الوالدين.', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'In pea plants, purple flowers (P) are dominant to white flowers (p). What is the phenotype of a plant with the genotype Pp?', 'text_arabic': 'في نباتات البازلاء، الزهور الأرجوانية (P) سائدة على الزهور البيضاء (p). ما هو النمط الظاهري لنبات له النمط الوراثي Pp؟', 'points': 3.0, 'explanation': 'Purple flowers', 'explanation_arabic': 'زهور أرجوانية'},
                    {'type': 'qcm_single', 'text': 'A cross between two heterozygous individuals (e.g., Pp x Pp) results in what expected phenotypic ratio?', 'text_arabic': 'ينتج عن تزاوج بين فردين متخالفي الزيجوت (مثل Pp x Pp) أي نسبة مظهرية متوقعة؟', 'points': 3.0, 'choices': [
                        {'text': '3 dominant : 1 recessive', 'text_arabic': '3 سائد : 1 متنحي', 'is_correct': True},
                        {'text': '1 dominant : 1 recessive', 'text_arabic': '1 سائد : 1 متنحي', 'is_correct': False},
                        {'text': '1:2:1', 'text_arabic': '1:2:1', 'is_correct': False},
                        {'text': 'All dominant', 'text_arabic': 'كلها سائدة', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is a Punnett square used for?', 'text_arabic': 'فيم يستخدم مربع بانيت؟', 'points': 2.0, 'explanation': 'To predict the possible genotypes of offspring from a cross.', 'explanation_arabic': 'للتنبؤ بالأنماط الوراثية المحتملة للنسل من تزاوج.'},
                ]
            },
            {
                'title': 'Mendel\'s Law of Independent Assortment (Dihybrid Cross)', 'title_arabic': 'قانون مندل للتوزيع المستقل (الهجونة الثنائية)', 'difficulty': 'intermediate',
                'questions': [
                    {'type': 'qcm_single', 'text': 'The Law of Independent Assortment applies to genes that are:', 'text_arabic': 'ينطبق قانون التوزيع المستقل على الجينات التي تكون:', 'points': 3.0, 'choices': [
                        {'text': 'Located on different, non-homologous chromosomes', 'text_arabic': 'موجودة على صبغيات مختلفة وغير متماثلة', 'is_correct': True},
                        {'text': 'Located very close together on the same chromosome', 'text_arabic': 'موجودة قريبة جدًا من بعضها البعض على نفس الصبغي', 'is_correct': False},
                        {'text': 'Codes for the same trait', 'text_arabic': 'تشفر لنفس الصفة', 'is_correct': False},
                        {'text': 'Only found in pea plants', 'text_arabic': 'موجودة فقط في نباتات البازلاء', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'A dihybrid cross involves tracking a single character.', 'text_arabic': 'تتضمن الهجونة الثنائية تتبع صفة واحدة.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'It involves tracking two different characters.', 'explanation_arabic': 'تتضمن تتبع صفتين مختلفتين.'},
                    {'type': 'qcm_single', 'text': 'What is the expected phenotypic ratio of a dihybrid cross between two individuals heterozygous for both traits (e.g., RrYy x RrYy)?', 'text_arabic': 'ما هي النسبة المظهرية المتوقعة لهجونة ثنائية بين فردين متخالفي الزيجوت لكلا الصفتين (مثل RrYy x RrYy)؟', 'points': 4.0, 'choices': [
                        {'text': '9:3:3:1', 'text_arabic': '9:3:3:1', 'is_correct': True},
                        {'text': '3:1', 'text_arabic': '3:1', 'is_correct': False},
                        {'text': '1:1:1:1', 'text_arabic': '1:1:1:1', 'is_correct': False},
                        {'text': '1:2:1', 'text_arabic': '1:2:1', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'An individual with genotype RrYy can produce how many different types of gametes?', 'text_arabic': 'يمكن لفرد له النمط الوراثي RrYy إنتاج كم عدد من أنواع الأمشاج المختلفة؟', 'points': 4.0, 'explanation': 'Four (RY, Ry, rY, ry)', 'explanation_arabic': 'أربعة (RY, Ry, rY, ry)'},
                    {'type': 'qcm_single', 'text': 'A test cross is performed by breeding an individual of unknown genotype with an individual that is:', 'text_arabic': 'يتم إجراء تزاوج اختباري عن طريق تزاوج فرد ذي نمط وراثي غير معروف مع فرد يكون:', 'points': 3.0, 'choices': [
                        {'text': 'Homozygous recessive', 'text_arabic': 'متماثل الزيجوت متنحي', 'is_correct': True},
                        {'text': 'Homozygous dominant', 'text_arabic': 'متماثل الزيجوت سائد', 'is_correct': False},
                        {'text': 'Heterozygous', 'text_arabic': 'متخالف الزيجوت', 'is_correct': False},
                        {'text': 'A sibling', 'text_arabic': 'شقيق', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'The Law of Independent Assortment is a consequence of the behavior of chromosomes during meiosis.', 'text_arabic': 'قانون التوزيع المستقل هو نتيجة لسلوك الصبغيات أثناء الانقسام الاختزالي.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                ]
            },
            {
                'title': 'Beyond Mendelian Genetics', 'title_arabic': 'ما بعد وراثة مندل', 'difficulty': 'intermediate',
                'questions': [
                    {'type': 'qcm_single', 'text': 'When the phenotype of the heterozygote is an intermediate between the phenotypes of the two homozygotes, this is called:', 'text_arabic': 'عندما يكون النمط الظاهري لمتخالف الزيجوت وسيطًا بين النمطين الظاهريين لمتماثلي الزيجوت، يسمى هذا:', 'points': 3.0, 'choices': [
                        {'text': 'Incomplete dominance', 'text_arabic': 'السيادة غير التامة', 'is_correct': True},
                        {'text': 'Codominance', 'text_arabic': 'السيادة المشتركة', 'is_correct': False},
                        {'text': 'Complete dominance', 'text_arabic': 'السيادة التامة', 'is_correct': False},
                        {'text': 'Epistasis', 'text_arabic': 'التفوق', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'A person with type AB blood is an example of codominance.', 'text_arabic': 'الشخص الذي فصيلة دمه AB هو مثال على السيادة المشتركة.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'open_short', 'text': 'What is it called when a single gene has multiple effects on the phenotype?', 'text_arabic': 'ماذا يطلق على الحالة التي يكون فيها لجين واحد تأثيرات متعددة على النمط الظاهري؟', 'points': 4.0, 'explanation': 'Pleiotropy', 'explanation_arabic': 'تعدد المظاهر'},
                    {'type': 'qcm_single', 'text': 'Traits that are determined by the interaction of multiple genes, such as human height, are called:', 'text_arabic': 'تسمى الصفات التي يتم تحديدها من خلال تفاعل جينات متعددة، مثل طول الإنسان:', 'points': 4.0, 'choices': [
                        {'text': 'Polygenic traits', 'text_arabic': 'صفات متعددة الجينات', 'is_correct': True},
                        {'text': 'Pleiotropic traits', 'text_arabic': 'صفات متعددة المظاهر', 'is_correct': False},
                        {'text': 'Codominant traits', 'text_arabic': 'صفات السيادة المشتركة', 'is_correct': False},
                        {'text': 'Recessive traits', 'text_arabic': 'صفات متنحية', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is epistasis?', 'text_arabic': 'ما هو التفوق؟', 'points': 5.0, 'explanation': 'A phenomenon where the effect of one gene is modified by one or several other genes.', 'explanation_arabic': 'ظاهرة يتم فيها تعديل تأثير جين واحد بواسطة جين واحد أو عدة جينات أخرى.'},
                    {'type': 'true_false', 'text': 'The environment can influence the expression of a genotype.', 'text_arabic': 'يمكن للبيئة أن تؤثر على التعبير عن النمط الوراثي.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                ]
            },
            {
                'title': 'Sex-Linked Inheritance', 'title_arabic': 'الوراثة المرتبطة بالجنس', 'difficulty': 'advanced',
                'questions': [
                    {'type': 'qcm_single', 'text': 'Genes located on a sex chromosome are called:', 'text_arabic': 'تسمى الجينات الموجودة على صبغي جنسي:', 'points': 4.0, 'choices': [
                        {'text': 'Sex-linked genes', 'text_arabic': 'جينات مرتبطة بالجنس', 'is_correct': True},
                        {'text': 'Autosomal genes', 'text_arabic': 'جينات جسمية', 'is_correct': False},
                        {'text': 'Linked genes', 'text_arabic': 'جينات مرتبطة', 'is_correct': False},
                        {'text': 'Polygenic genes', 'text_arabic': 'جينات متعددة', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'Why are sex-linked recessive disorders more common in males than in females?', 'text_arabic': 'لماذا تكون الاضطرابات المتنحية المرتبطة بالجنس أكثر شيوعًا عند الذكور منها عند الإناث؟', 'points': 5.0, 'explanation': 'Because males have only one X chromosome, so a single recessive allele on that X chromosome will be expressed.', 'explanation_arabic': 'لأن الذكور لديهم صبغي X واحد فقط، لذلك سيتم التعبير عن أليل متنحي واحد على هذا الصبغي X.'},
                    {'type': 'qcm_single', 'text': 'Which of the following is a well-known example of an X-linked recessive trait in humans?', 'text_arabic': 'أي مما يلي هو مثال معروف لصفة متنحية مرتبطة بالصبغي X عند البشر؟', 'points': 4.0, 'choices': [
                        {'text': 'Red-green color blindness', 'text_arabic': 'عمى الألوان الأحمر والأخضر', 'is_correct': True},
                        {'text': 'Huntington\'s disease', 'text_arabic': 'مرض هنتنغتون', 'is_correct': False},
                        {'text': 'Cystic fibrosis', 'text_arabic': 'التليف الكيسي', 'is_correct': False},
                        {'text': 'Blood type', 'text_arabic': 'فصيلة الدم', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'A male can be a carrier of an X-linked recessive trait without expressing it.', 'text_arabic': 'يمكن للذكر أن يكون حاملاً لصفة متنحية مرتبطة بالصبغي X دون التعبير عنها.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'If a male has the allele on his X chromosome, he will express the trait.', 'explanation_arabic': 'إذا كان لدى الذكر الأليل على صبغيه X، فسوف يعبر عن الصفة.'},
                    {'type': 'open_short', 'text': 'If a colorblind man (X^rY) marries a woman who is a carrier for color blindness (X^RX^r), what is the probability that they will have a colorblind son?', 'text_arabic': 'إذا تزوج رجل مصاب بعمى الألوان (X^rY) من امرأة حاملة لعمى الألوان (X^RX^r)، فما هو احتمال أن يكون لديهما ابن مصاب بعمى الألوان؟', 'points': 6.0, 'explanation': '50%. (The mother has a 50% chance of passing on the X^r allele, and the father passes on the Y chromosome).', 'explanation_arabic': '50%. (لدى الأم فرصة 50% لنقل الأليل X^r، والأب ينقل الصبغي Y).'},
                    {'type': 'qcm_single', 'text': 'What are the sex chromosomes for a typical human female?', 'text_arabic': 'ما هي الصبغيات الجنسية لأنثى بشرية نموذجية؟', 'points': 4.0, 'choices': [
                        {'text': 'XX', 'text_arabic': 'XX', 'is_correct': True},
                        {'text': 'XY', 'text_arabic': 'XY', 'is_correct': False},
                        {'text': 'XO', 'text_arabic': 'XO', 'is_correct': False},
                        {'text': 'YY', 'text_arabic': 'YY', 'is_correct': False},
                    ]},
                ]
            },
            {
                'title': 'Linked Genes and Chromosome Mapping', 'title_arabic': 'الجينات المرتبطة ورسم خرائط الصبغيات', 'difficulty': 'advanced',
                'questions': [
                    {'type': 'qcm_single', 'text': 'Genes that are located on the same chromosome and tend to be inherited together are called:', 'text_arabic': 'تسمى الجينات الموجودة على نفس الصبغي والتي تميل إلى أن تورث معًا:', 'points': 4.0, 'choices': [
                        {'text': 'Linked genes', 'text_arabic': 'جينات مرتبطة', 'is_correct': True},
                        {'text': 'Alleles', 'text_arabic': 'أليلات', 'is_correct': False},
                        {'text': 'Independent genes', 'text_arabic': 'جينات مستقلة', 'is_correct': False},
                        {'text': 'Polygenes', 'text_arabic': 'جينات متعددة', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What process can "unlink" genes that are on the same chromosome?', 'text_arabic': 'ما هي العملية التي يمكن أن "تفصل" الجينات الموجودة على نفس الصبغي؟', 'points': 5.0, 'explanation': 'Crossing over', 'explanation_arabic': 'العبور'},
                    {'type': 'true_false', 'text': 'The farther apart two genes are on a chromosome, the more likely they are to be separated by crossing over.', 'text_arabic': 'كلما زادت المسافة بين جينين على الصبغي، زاد احتمال فصلهما عن طريق العبور.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'qcm_single', 'text': 'The frequency of recombination between two linked genes is used to:', 'text_arabic': 'يستخدم تردد إعادة التركيب بين جينين مرتبطين لـ:', 'points': 5.0, 'choices': [
                        {'text': 'Create a linkage map of the chromosome', 'text_arabic': 'إنشاء خريطة ارتباط للصبغي', 'is_correct': True},
                        {'text': 'Determine if the genes are dominant or recessive', 'text_arabic': 'تحديد ما إذا كانت الجينات سائدة أم متنحية', 'is_correct': False},
                        {'text': 'Count the number of chromosomes', 'text_arabic': 'عد عدد الصبغيات', 'is_correct': False},
                        {'text': 'Identify the function of the genes', 'text_arabic': 'تحديد وظيفة الجينات', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is a map unit (or centimorgan) on a linkage map?', 'text_arabic': 'ما هي وحدة الخريطة (أو السنتيمورغان) على خريطة الارتباط؟', 'points': 6.0, 'explanation': 'It represents a 1% recombination frequency between two genes.', 'explanation_arabic': 'تمثل تردد إعادة تركيب بنسبة 1% بين جينين.'},
                    {'type': 'true_false', 'text': 'Linked genes do not follow the Law of Independent Assortment.', 'text_arabic': 'لا تتبع الجينات المرتبطة قانون التوزيع المستقل.', 'points': 5.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
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
