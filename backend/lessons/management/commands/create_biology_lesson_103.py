"""
Management Command for Creating Exercises for Lesson: The concept of genetic information (ID 103)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward


class Command(BaseCommand):
    help = 'Create exercises for "The concept of genetic information" - Lesson ID: 103'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            dest='delete_existing',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        lesson_id = 103
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
                'title': 'Location of Genetic Information', 'title_arabic': 'موقع المعلومات الوراثية', 'difficulty': 'beginner',
                'questions': [
                    {'type': 'qcm_single', 'text': 'In eukaryotic cells, where is most of the genetic information located?', 'text_arabic': 'في الخلايا حقيقية النواة، أين يقع معظم المعلومات الوراثية؟', 'points': 2.0, 'choices': [
                        {'text': 'Nucleus', 'text_arabic': 'النواة', 'is_correct': True},
                        {'text': 'Cytoplasm', 'text_arabic': 'السيتوبلازم', 'is_correct': False},
                        {'text': 'Mitochondria', 'text_arabic': 'الميتوكوندريا', 'is_correct': False},
                        {'text': 'Ribosome', 'text_arabic': 'الريبوسوم', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Prokaryotic cells have a nucleus to store their DNA.', 'text_arabic': 'تحتوي الخلايا بدائية النواة على نواة لتخزين حمضها النووي.', 'points': 2.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}]},
                    {'type': 'qcm_single', 'text': 'What is the name of the structure that contains the genetic material in the nucleus?', 'text_arabic': 'ما اسم البنية التي تحتوي على المادة الوراثية في النواة؟', 'points': 2.0, 'choices': [
                        {'text': 'Chromosome', 'text_arabic': 'الصبغي (الكروموسوم)', 'is_correct': True},
                        {'text': 'Nucleolus', 'text_arabic': 'النوية', 'is_correct': False},
                        {'text': 'Nuclear envelope', 'text_arabic': 'الغلاف النووي', 'is_correct': False},
                        {'text': 'Cytoskeleton', 'text_arabic': 'الهيكل الخلوي', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is the molecule that carries genetic information?', 'text_arabic': 'ما هي الجزيئة التي تحمل المعلومات الوراثية؟', 'points': 3.0, 'explanation': 'Deoxyribonucleic acid (DNA)', 'explanation_arabic': 'الحمض النووي الريبوزي منقوص الأكسجين (DNA)'},
                    {'type': 'qcm_single', 'text': 'Where is the DNA located in a prokaryotic cell?', 'text_arabic': 'أين يقع الحمض النووي في خلية بدائية النواة؟', 'points': 2.0, 'choices': [
                        {'text': 'In a region called the nucleoid', 'text_arabic': 'في منطقة تسمى المنطقة النووية', 'is_correct': True},
                        {'text': 'Inside the nucleus', 'text_arabic': 'داخل النواة', 'is_correct': False},
                        {'text': 'Attached to the cell membrane', 'text_arabic': 'مرتبط بالغشاء الخلوي', 'is_correct': False},
                        {'text': 'In the mitochondria', 'text_arabic': 'في الميتوكوندريا', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Mitochondria and chloroplasts contain their own DNA.', 'text_arabic': 'تحتوي الميتوكوندريا والبلاستيدات الخضراء على حمضها النووي الخاص.', 'points': 2.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                ]
            },
            {
                'title': 'The Chemical Nature of DNA', 'title_arabic': 'الطبيعة الكيميائية للحمض النووي', 'difficulty': 'intermediate',
                'questions': [
                    {'type': 'qcm_single', 'text': 'What are the three components of a DNA nucleotide?', 'text_arabic': 'ما هي المكونات الثلاثة لنيوكليوتيد الحمض النووي؟', 'points': 3.0, 'choices': [
                        {'text': 'A phosphate group, a deoxyribose sugar, and a nitrogenous base', 'text_arabic': 'مجموعة فوسفات، وسكر ديوكسي ريبوز، وقاعدة نيتروجينية', 'is_correct': True},
                        {'text': 'A phosphate group, a ribose sugar, and a nitrogenous base', 'text_arabic': 'مجموعة فوسفات، وسكر ريبوز، وقاعدة نيتروجينية', 'is_correct': False},
                        {'text': 'A carboxyl group, a deoxyribose sugar, and an amino acid', 'text_arabic': 'مجموعة كربوكسيل، وسكر ديوكسي ريبوز، وحمض أميني', 'is_correct': False},
                        {'text': 'A phosphate group, a glucose sugar, and a nitrogenous base', 'text_arabic': 'مجموعة فوسفات، وسكر جلوكوز، وقاعدة نيتروجينية', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What are the four nitrogenous bases found in DNA?', 'text_arabic': 'ما هي القواعد النيتروجينية الأربعة الموجودة في الحمض النووي؟', 'points': 4.0, 'explanation': 'Adenine (A), Guanine (G), Cytosine (C), and Thymine (T)', 'explanation_arabic': 'الأدينين (A)، والجوانين (G)، والسيتوزين (C)، والثايمين (T)'},
                    {'type': 'qcm_single', 'text': 'According to the base pairing rules, Adenine (A) always pairs with:', 'text_arabic': 'وفقًا لقواعد الاقتران الأساسية، يرتبط الأدينين (A) دائمًا بـ:', 'points': 3.0, 'choices': [
                        {'text': 'Thymine (T)', 'text_arabic': 'الثايمين (T)', 'is_correct': True},
                        {'text': 'Guanine (G)', 'text_arabic': 'الجوانين (G)', 'is_correct': False},
                        {'text': 'Cytosine (C)', 'text_arabic': 'السيتوزين (C)', 'is_correct': False},
                        {'text': 'Uracil (U)', 'text_arabic': 'اليوراسيل (U)', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'The two strands of a DNA molecule are parallel to each other.', 'text_arabic': 'يكون شريطا جزيء الحمض النووي متوازيين مع بعضهما البعض.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'They are antiparallel.', 'explanation_arabic': 'إنهما متوازيان متعاكسان.'},
                    {'type': 'open_short', 'text': 'What type of bond holds the two strands of the DNA double helix together?', 'text_arabic': 'ما نوع الرابطة التي تربط شريطي لولب الحمض النووي المزدوج معًا؟', 'points': 4.0, 'explanation': 'Hydrogen bonds', 'explanation_arabic': 'روابط هيدروجينية'},
                    {'type': 'qcm_single', 'text': 'The "backbone" of a DNA strand is made of alternating:', 'text_arabic': 'يتكون "العمود الفقري" لشريط الحمض النووي من تناوب:', 'points': 4.0, 'choices': [
                        {'text': 'Sugar and phosphate groups', 'text_arabic': 'مجموعات السكر والفوسفات', 'is_correct': True},
                        {'text': 'Nitrogenous bases', 'text_arabic': 'قواعد نيتروجينية', 'is_correct': False},
                        {'text': 'Amino acids', 'text_arabic': 'أحماض أمينية', 'is_correct': False},
                        {'text': 'Sugars and bases', 'text_arabic': 'سكريات وقواعد', 'is_correct': False},
                    ]},
                ]
            },
            {
                'title': 'DNA Replication', 'title_arabic': 'تضاعف الحمض النووي', 'difficulty': 'intermediate',
                'questions': [
                    {'type': 'qcm_single', 'text': 'DNA replication is described as semi-conservative. What does this mean?', 'text_arabic': 'يوصف تضاعف الحمض النووي بأنه شبه محافظ. ماذا يعني هذا؟', 'points': 3.0, 'choices': [
                        {'text': 'Each new DNA molecule consists of one old strand and one new strand.', 'text_arabic': 'يتكون كل جزيء DNA جديد من شريط قديم وشريط جديد.', 'is_correct': True},
                        {'text': 'One new DNA molecule is made of two old strands, and the other is made of two new strands.', 'text_arabic': 'يتكون جزيء DNA جديد واحد من شريطين قديمين، والآخر يتكون من شريطين جديدين.', 'is_correct': False},
                        {'text': 'The original DNA molecule is conserved, and a completely new one is made.', 'text_arabic': 'يتم الحفاظ على جزيء DNA الأصلي، ويتم صنع جزيء جديد تمامًا.', 'is_correct': False},
                        {'text': 'Half of the original DNA molecule is degraded.', 'text_arabic': 'يتحلل نصف جزيء DNA الأصلي.', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'DNA replication occurs after cell division.', 'text_arabic': 'يحدث تضاعف الحمض النووي بعد انقسام الخلية.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'It occurs before cell division, during the S phase of interphase.', 'explanation_arabic': 'يحدث قبل انقسام الخلية، خلال المرحلة S من الطور البيني.'},
                    {'type': 'open_short', 'text': 'What is the main enzyme responsible for synthesizing new DNA strands?', 'text_arabic': 'ما هو الإنزيم الرئيسي المسؤول عن تخليق أشرطة DNA جديدة؟', 'points': 4.0, 'explanation': 'DNA polymerase', 'explanation_arabic': 'بوليميراز الحمض النووي'},
                    {'type': 'qcm_single', 'text': 'The enzyme that unwinds the DNA double helix during replication is called:', 'text_arabic': 'يسمى الإنزيم الذي يفك لولب الحمض النووي المزدوج أثناء التضاعف:', 'points': 3.0, 'choices': [
                        {'text': 'Helicase', 'text_arabic': 'هيليكاز', 'is_correct': True},
                        {'text': 'Polymerase', 'text_arabic': 'بوليميراز', 'is_correct': False},
                        {'text': 'Ligase', 'text_arabic': 'ليغاز', 'is_correct': False},
                        {'text': 'Primase', 'text_arabic': 'بريماز', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What are Okazaki fragments?', 'text_arabic': 'ما هي شظايا أوكازاكي؟', 'points': 5.0, 'explanation': 'Short sequences of DNA nucleotides which are synthesized discontinuously and later linked together to create the lagging strand.', 'explanation_arabic': 'تسلسلات قصيرة من نيوكليوتيدات الحمض النووي التي يتم تصنيعها بشكل متقطع وترتبط لاحقًا معًا لإنشاء الشريط المتأخر.'},
                    {'type': 'true_false', 'text': 'Both new DNA strands are synthesized continuously.', 'text_arabic': 'يتم تصنيع كلا شريطي DNA الجديدين بشكل مستمر.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'Only the leading strand is synthesized continuously; the lagging strand is synthesized in fragments.', 'explanation_arabic': 'يتم تصنيع الشريط المتقدم فقط بشكل مستمر؛ يتم تصنيع الشريط المتأخر في شظايا.'},
                ]
            },
            {
                'title': 'Genes and Chromosomes', 'title_arabic': 'الجينات والصبغيات', 'difficulty': 'advanced',
                'questions': [
                    {'type': 'qcm_single', 'text': 'What is a gene?', 'text_arabic': 'ما هو الجين؟', 'points': 4.0, 'choices': [
                        {'text': 'A specific sequence of DNA that codes for a protein or functional RNA molecule.', 'text_arabic': 'تسلسل محدد من الحمض النووي يشفر لبروتين أو جزيء RNA وظيفي.', 'is_correct': True},
                        {'text': 'An entire chromosome.', 'text_arabic': 'صبغي كامل.', 'is_correct': False},
                        {'text': 'A type of sugar in DNA.', 'text_arabic': 'نوع من السكر في الحمض النووي.', 'is_correct': False},
                        {'text': 'A structure that contains RNA.', 'text_arabic': 'بنية تحتوي على RNA.', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is the relationship between DNA, genes, and chromosomes?', 'text_arabic': 'ما هي العلاقة بين الحمض النووي والجينات والصبغيات؟', 'points': 6.0, 'explanation': 'Chromosomes are long structures made of DNA tightly coiled around proteins. Genes are segments of that DNA.', 'explanation_arabic': 'الصبغيات هي هياكل طويلة مصنوعة من الحمض النووي ملفوفة بإحكام حول البروتينات. الجينات هي أجزاء من هذا الحمض النووي.'},
                    {'type': 'qcm_single', 'text': 'In humans, how many chromosomes are typically found in a somatic (non-sex) cell?', 'text_arabic': 'في البشر، كم عدد الصبغيات الموجودة عادة في خلية جسدية (غير جنسية)؟', 'points': 4.0, 'choices': [
                        {'text': '46', 'text_arabic': '46', 'is_correct': True},
                        {'text': '23', 'text_arabic': '23', 'is_correct': False},
                        {'text': '48', 'text_arabic': '48', 'is_correct': False},
                        {'text': '2', 'text_arabic': '2', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'All of an organism\'s genes are expressed in every cell.', 'text_arabic': 'يتم التعبير عن جميع جينات الكائن الحي في كل خلية.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'Cells are specialized and only express the genes needed for their specific function.', 'explanation_arabic': 'الخلايا متخصصة وتعبر فقط عن الجينات اللازمة لوظيفتها المحددة.'},
                    {'type': 'open_short', 'text': 'What are alleles?', 'text_arabic': 'ما هي الأليلات؟', 'points': 5.0, 'explanation': 'Different versions or variations of the same gene.', 'explanation_arabic': 'نسخ أو اختلافات مختلفة من نفس الجين.'},
                    {'type': 'qcm_single', 'text': 'The complete set of genetic information in an organism is called its:', 'text_arabic': 'تسمى المجموعة الكاملة من المعلومات الوراثية في كائن حي:', 'points': 4.0, 'choices': [
                        {'text': 'Genome', 'text_arabic': 'الجينوم', 'is_correct': True},
                        {'text': 'Proteome', 'text_arabic': 'البروتيوم', 'is_correct': False},
                        {'text': 'Phenotype', 'text_arabic': 'النمط الظاهري', 'is_correct': False},
                        {'text': 'Karyotype', 'text_arabic': 'النمط النووي', 'is_correct': False},
                    ]},
                ]
            },
            {
                'title': 'Mutations', 'title_arabic': 'الطفرات', 'difficulty': 'advanced',
                'questions': [
                    {'type': 'qcm_single', 'text': 'A mutation that changes a single nucleotide in the DNA sequence is called a:', 'text_arabic': 'تسمى الطفرة التي تغير نيوكليوتيدًا واحدًا في تسلسل الحمض النووي:', 'points': 4.0, 'choices': [
                        {'text': 'Point mutation', 'text_arabic': 'طفرة نقطية', 'is_correct': True},
                        {'text': 'Frameshift mutation', 'text_arabic': 'طفرة إزاحة الإطار', 'is_correct': False},
                        {'text': 'Chromosomal mutation', 'text_arabic': 'طفرة صبغية', 'is_correct': False},
                        {'text': 'Silent mutation', 'text_arabic': 'طفرة صامتة', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is a frameshift mutation?', 'text_arabic': 'ما هي طفرة إزاحة الإطار؟', 'points': 5.0, 'explanation': 'A genetic mutation caused by an insertion or deletion of a number of nucleotides that is not divisible by three, thus changing the reading frame for protein synthesis.', 'explanation_arabic': 'طفرة وراثية ناتجة عن إدخال أو حذف عدد من النيوكليوتيدات غير قابل للقسمة على ثلاثة، وبالتالي تغيير إطار القراءة لتخليق البروتين.'},
                    {'type': 'true_false', 'text': 'All mutations are harmful.', 'text_arabic': 'كل الطفرات ضارة.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'Mutations can be harmful, neutral, or even beneficial.', 'explanation_arabic': 'يمكن أن تكون الطفرات ضارة أو محايدة أو حتى مفيدة.'},
                    {'type': 'qcm_single', 'text': 'A mutation that results in a codon that codes for the same amino acid is called a:', 'text_arabic': 'تسمى الطفرة التي تؤدي إلى كودون يشفر لنفس الحمض الأميني:', 'points': 5.0, 'choices': [
                        {'text': 'Silent mutation', 'text_arabic': 'طفرة صامتة', 'is_correct': True},
                        {'text': 'Nonsense mutation', 'text_arabic': 'طفرة هراء', 'is_correct': False},
                        {'text': 'Missense mutation', 'text_arabic': 'طفرة مغلطة', 'is_correct': False},
                        {'text': 'Frameshift mutation', 'text_arabic': 'طفرة إزاحة الإطار', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is a mutagen?', 'text_arabic': 'ما هو المطفر؟', 'points': 5.0, 'explanation': 'A physical or chemical agent that changes the genetic material (DNA) of an organism.', 'explanation_arabic': 'عامل فيزيائي أو كيميائي يغير المادة الوراثية (DNA) لكائن حي.'},
                    {'type': 'qcm_single', 'text': 'Which of the following is an example of a physical mutagen?', 'text_arabic': 'أي مما يلي هو مثال على مطفر فيزيائي؟', 'points': 4.0, 'choices': [
                        {'text': 'UV radiation', 'text_arabic': 'الأشعة فوق البنفسجية', 'is_correct': True},
                        {'text': 'Nitrous acid', 'text_arabic': 'حمض النيتروز', 'is_correct': False},
                        {'text': 'Benzene', 'text_arabic': 'البنزين', 'is_correct': False},
                        {'text': 'Viruses', 'text_arabic': 'الفيروسات', 'is_correct': False},
                    ]},
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
