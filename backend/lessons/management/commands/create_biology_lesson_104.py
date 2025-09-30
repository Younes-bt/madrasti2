"""
Management Command for Creating Exercises for Lesson: The expression of genetic information (ID 104)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward


class Command(BaseCommand):
    help = 'Create exercises for "The expression of genetic information" - Lesson ID: 104'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            dest='delete_existing',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        lesson_id = 104
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
                'title': 'Transcription: DNA to RNA', 'title_arabic': 'النسخ: من DNA إلى RNA', 'difficulty': 'beginner',
                'questions': [
                    {'type': 'qcm_single', 'text': 'What is the process of synthesizing an RNA molecule from a DNA template called?', 'text_arabic': 'ماذا تسمى عملية تخليق جزيء RNA من قالب DNA؟', 'points': 2.0, 'choices': [
                        {'text': 'Transcription', 'text_arabic': 'النسخ', 'is_correct': True},
                        {'text': 'Translation', 'text_arabic': 'الترجمة', 'is_correct': False},
                        {'text': 'Replication', 'text_arabic': 'التضاعف', 'is_correct': False},
                        {'text': 'Mutation', 'text_arabic': 'الطفرة', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Transcription occurs in the cytoplasm of eukaryotic cells.', 'text_arabic': 'يحدث النسخ في سيتوبلازم الخلايا حقيقية النواة.', 'points': 2.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'It occurs in the nucleus.', 'explanation_arabic': 'يحدث في النواة.'},
                    {'type': 'qcm_single', 'text': 'Which enzyme is responsible for transcription?', 'text_arabic': 'أي إنزيم هو المسؤول عن النسخ؟', 'points': 2.0, 'choices': [
                        {'text': 'RNA polymerase', 'text_arabic': 'بوليميراز RNA', 'is_correct': True},
                        {'text': 'DNA polymerase', 'text_arabic': 'بوليميراز DNA', 'is_correct': False},
                        {'text': 'Helicase', 'text_arabic': 'هيليكاز', 'is_correct': False},
                        {'text': 'Ligase', 'text_arabic': 'ليغاز', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'In RNA, which base replaces Thymine (T) found in DNA?', 'text_arabic': 'في RNA، أي قاعدة تحل محل الثايمين (T) الموجود في DNA؟', 'points': 3.0, 'explanation': 'Uracil (U)', 'explanation_arabic': 'اليوراسيل (U)'},
                    {'type': 'qcm_single', 'text': 'The product of transcription is a molecule of:', 'text_arabic': 'ناتج عملية النسخ هو جزيء من:', 'points': 2.0, 'choices': [
                        {'text': 'messenger RNA (mRNA)', 'text_arabic': 'RNA الرسول (mRNA)', 'is_correct': True},
                        {'text': 'transfer RNA (tRNA)', 'text_arabic': 'RNA الناقل (tRNA)', 'is_correct': False},
                        {'text': 'ribosomal RNA (rRNA)', 'text_arabic': 'RNA الريبوسومي (rRNA)', 'is_correct': False},
                        {'text': 'DNA', 'text_arabic': 'DNA', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Both strands of the DNA molecule are transcribed into a single mRNA molecule.', 'text_arabic': 'يتم نسخ كلا شريطي جزيء DNA إلى جزيء mRNA واحد.', 'points': 2.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'Only one strand (the template strand) is transcribed.', 'explanation_arabic': 'يتم نسخ شريط واحد فقط (الشريط القالب).'},
                ]
            },
            {
                'title': 'Translation: RNA to Protein', 'title_arabic': 'الترجمة: من RNA إلى بروتين', 'difficulty': 'intermediate',
                'questions': [
                    {'type': 'qcm_single', 'text': 'Where does translation occur in the cell?', 'text_arabic': 'أين تحدث الترجمة في الخلية؟', 'points': 3.0, 'choices': [
                        {'text': 'Ribosome', 'text_arabic': 'الريبوسوم', 'is_correct': True},
                        {'text': 'Nucleus', 'text_arabic': 'النواة', 'is_correct': False},
                        {'text': 'Mitochondrion', 'text_arabic': 'الميتوكوندريا', 'is_correct': False},
                        {'text': 'Golgi apparatus', 'text_arabic': 'جهاز جولجي', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is a codon?', 'text_arabic': 'ما هو الكودون؟', 'points': 4.0, 'explanation': 'A sequence of three nucleotides on an mRNA molecule that codes for a specific amino acid.', 'explanation_arabic': 'تسلسل من ثلاثة نيوكليوتيدات على جزيء mRNA يشفر لحمض أميني معين.'},
                    {'type': 'qcm_single', 'text': 'Which type of RNA is responsible for bringing amino acids to the ribosome?', 'text_arabic': 'أي نوع من RNA هو المسؤول عن جلب الأحماض الأمينية إلى الريبوسوم؟', 'points': 3.0, 'choices': [
                        {'text': 'transfer RNA (tRNA)', 'text_arabic': 'RNA الناقل (tRNA)', 'is_correct': True},
                        {'text': 'messenger RNA (mRNA)', 'text_arabic': 'RNA الرسول (mRNA)', 'is_correct': False},
                        {'text': 'ribosomal RNA (rRNA)', 'text_arabic': 'RNA الريبوسومي (rRNA)', 'is_correct': False},
                        {'text': 'small nuclear RNA (snRNA)', 'text_arabic': 'RNA النووي الصغير (snRNA)', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Each codon can code for multiple different amino acids.', 'text_arabic': 'يمكن لكل كودون أن يشفر لأحماض أمينية متعددة ومختلفة.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'The genetic code is unambiguous; each codon specifies only one amino acid.', 'explanation_arabic': 'الشفرة الوراثية لا لبس فيها؛ يحدد كل كودون حمضًا أمينيًا واحدًا فقط.'},
                    {'type': 'open_short', 'text': 'What is the sequence of the start codon?', 'text_arabic': 'ما هو تسلسل كودون البدء؟', 'points': 4.0, 'explanation': 'AUG', 'explanation_arabic': 'AUG'},
                    {'type': 'qcm_single', 'text': 'The bond that forms between adjacent amino acids in a polypeptide chain is called a:', 'text_arabic': 'تسمى الرابطة التي تتكون بين الأحماض الأمينية المتجاورة في سلسلة ببتيدية:', 'points': 4.0, 'choices': [
                        {'text': 'Peptide bond', 'text_arabic': 'رابطة ببتيدية', 'is_correct': True},
                        {'text': 'Hydrogen bond', 'text_arabic': 'رابطة هيدروجينية', 'is_correct': False},
                        {'text': 'Ionic bond', 'text_arabic': 'رابطة أيونية', 'is_correct': False},
                        {'text': 'Covalent bond', 'text_arabic': 'رابطة تساهمية', 'is_correct': False},
                    ]},
                ]
            },
            {
                'title': 'The Genetic Code', 'title_arabic': 'الشفرة الوراثية', 'difficulty': 'intermediate',
                'questions': [
                    {'type': 'qcm_single', 'text': 'The genetic code is described as "degenerate" or "redundant". What does this mean?', 'text_arabic': 'توصف الشفرة الوراثية بأنها "متدهورة" أو "زائدة عن الحاجة". ماذا يعني هذا؟', 'points': 3.0, 'choices': [
                        {'text': 'Multiple codons can code for the same amino acid.', 'text_arabic': 'يمكن أن تشفر كودونات متعددة لنفس الحمض الأميني.', 'is_correct': True},
                        {'text': 'One codon can code for multiple amino acids.', 'text_arabic': 'يمكن أن يشفر كودون واحد لأحماض أمينية متعددة.', 'is_correct': False},
                        {'text': 'The code is not universal among organisms.', 'text_arabic': 'الشفرة ليست عالمية بين الكائنات الحية.', 'is_correct': False},
                        {'text': 'There are no stop codons.', 'text_arabic': 'لا توجد كودونات توقف.', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'The genetic code is nearly universal, meaning the same codons specify the same amino acids in almost all organisms.', 'text_arabic': 'الشفرة الوراثية عالمية تقريبًا، مما يعني أن نفس الكودونات تحدد نفس الأحماض الأمينية في جميع الكائنات الحية تقريبًا.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'open_short', 'text': 'How many possible codons are there in the genetic code?', 'text_arabic': 'كم عدد الكودونات المحتملة في الشفرة الوراثية؟', 'points': 4.0, 'explanation': '64 (4 bases taken 3 at a time: 4^3)', 'explanation_arabic': '64 (4 قواعد مأخوذة 3 في كل مرة: 4^3)'},
                    {'type': 'qcm_single', 'text': 'What is the function of a stop codon?', 'text_arabic': 'ما هي وظيفة كودون التوقف؟', 'points': 3.0, 'choices': [
                        {'text': 'To terminate translation', 'text_arabic': 'لإنهاء الترجمة', 'is_correct': True},
                        {'text': 'To start translation', 'text_arabic': 'لبدء الترجمة', 'is_correct': False},
                        {'text': 'To add a specific amino acid', 'text_arabic': 'لإضافة حمض أميني معين', 'is_correct': False},
                        {'text': 'To initiate transcription', 'text_arabic': 'لبدء النسخ', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'If an mRNA sequence is 5omino-AUGGGCUAC-3omino, what is the corresponding amino acid sequence? (Use a codon table if needed)', 'text_arabic': 'إذا كان تسلسل mRNA هو 5omino-AUGGGCUAC-3omino، فما هو تسلسل الأحماض الأمينية المقابل؟ (استخدم جدول الكودونات إذا لزم الأمر)', 'points': 5.0, 'explanation': 'Methionine-Glycine-Tyrosine (Met-Gly-Tyr)', 'explanation_arabic': 'ميثيونين-جلايسين-تيروسين (Met-Gly-Tyr)'},
                    {'type': 'true_false', 'text': 'The reading frame is established by the start codon.', 'text_arabic': 'يتم تحديد إطار القراءة بواسطة كودون البدء.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                ]
            },
            {
                'title': 'RNA Processing in Eukaryotes', 'title_arabic': 'معالجة RNA في حقيقيات النواة', 'difficulty': 'advanced',
                'questions': [
                    {'type': 'qcm_single', 'text': 'What is the process of removing non-coding regions from pre-mRNA called?', 'text_arabic': 'ماذا تسمى عملية إزالة المناطق غير المشفرة من pre-mRNA؟', 'points': 4.0, 'choices': [
                        {'text': 'Splicing', 'text_arabic': 'التوصيل (الربط)', 'is_correct': True},
                        {'text': 'Capping', 'text_arabic': 'التقبيع', 'is_correct': False},
                        {'text': 'Tailing', 'text_arabic': 'التذييل', 'is_correct': False},
                        {'text': 'Translation', 'text_arabic': 'الترجمة', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What are the non-coding regions of a eukaryotic gene that are removed from the mRNA transcript?', 'text_arabic': 'ما هي المناطق غير المشفرة في جين حقيقي النواة والتي تتم إزالتها من نسخة mRNA؟', 'points': 5.0, 'explanation': 'Introns', 'explanation_arabic': 'الإنترونات'},
                    {'type': 'qcm_single', 'text': 'What is added to the 5omino end of a eukaryotic mRNA molecule during processing?', 'text_arabic': 'ما الذي يضاف إلى النهاية 5omino لجزيء mRNA حقيقي النواة أثناء المعالجة؟', 'points': 4.0, 'choices': [
                        {'text': 'A 5omino cap (modified guanine nucleotide)', 'text_arabic': 'قبعة 5omino (نيوكليوتيد جوانين معدل)', 'is_correct': True},
                        {'text': 'A poly-A tail', 'text_arabic': 'ذيل بولي-A', 'is_correct': False},
                        {'text': 'An intron', 'text_arabic': 'إنترون', 'is_correct': False},
                        {'text': 'A start codon', 'text_arabic': 'كودون بدء', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'RNA processing occurs in the cytoplasm.', 'text_arabic': 'تحدث معالجة RNA في السيتوبلازم.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'It occurs in the nucleus before the mRNA is exported.', 'explanation_arabic': 'تحدث في النواة قبل تصدير mRNA.'},
                    {'type': 'open_short', 'text': 'What is the function of the poly-A tail?', 'text_arabic': 'ما هي وظيفة ذيل بولي-A؟', 'points': 6.0, 'explanation': 'It helps protect the mRNA from degradation and aids in its export from the nucleus.', 'explanation_arabic': 'يساعد على حماية mRNA من التحلل ويساعد في تصديره من النواة.'},
                    {'type': 'qcm_single', 'text': 'The coding regions of a eukaryotic gene that are joined together to form the mature mRNA are called:', 'text_arabic': 'تسمى المناطق المشفرة في جين حقيقي النواة والتي يتم ربطها معًا لتكوين mRNA الناضج:', 'points': 4.0, 'choices': [
                        {'text': 'Exons', 'text_arabic': 'الإكسونات', 'is_correct': True},
                        {'text': 'Introns', 'text_arabic': 'الإنترونات', 'is_correct': False},
                        {'text': 'Promoters', 'text_arabic': 'المحفزات', 'is_correct': False},
                        {'text': 'Terminators', 'text_arabic': 'المنهيات', 'is_correct': False},
                    ]},
                ]
            },
            {
                'title': 'Gene Regulation', 'title_arabic': 'تنظيم الجينات', 'difficulty': 'advanced',
                'questions': [
                    {'type': 'qcm_single', 'text': 'Why is gene regulation important for multicellular organisms?', 'text_arabic': 'لماذا يعتبر تنظيم الجينات مهمًا للكائنات متعددة الخلايا؟', 'points': 4.0, 'choices': [
                        {'text': 'It allows for cell specialization and differentiation.', 'text_arabic': 'يسمح بتخصص الخلايا والتمايز.', 'is_correct': True},
                        {'text': 'It ensures all genes are expressed at all times.', 'text_arabic': 'يضمن التعبير عن جميع الجينات في جميع الأوقات.', 'is_correct': False},
                        {'text': 'It prevents mutations from occurring.', 'text_arabic': 'يمنع حدوث الطفرات.', 'is_correct': False},
                        {'text': 'It speeds up the process of protein synthesis.', 'text_arabic': 'يسرع عملية تخليق البروتين.', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is an operon in prokaryotic gene regulation?', 'text_arabic': 'ما هو الأوبرون في تنظيم الجينات بدائية النواة؟', 'points': 5.0, 'explanation': 'A cluster of genes under the control of a single promoter and operator.', 'explanation_arabic': 'مجموعة من الجينات تحت سيطرة محفز ومشغل واحد.'},
                    {'type': 'true_false', 'text': 'Gene expression can only be regulated at the level of transcription.', 'text_arabic': 'يمكن تنظيم التعبير الجيني فقط على مستوى النسخ.', 'points': 5.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'It can be regulated at many levels, including transcription, RNA processing, translation, and post-translation.', 'explanation_arabic': 'يمكن تنظيمه على مستويات عديدة، بما في ذلك النسخ، ومعالجة RNA، والترجمة، وما بعد الترجمة.'},
                    {'type': 'qcm_single', 'text': 'In the lac operon, what happens when lactose is present?', 'text_arabic': 'في أوبرون اللاكتوز، ماذا يحدث عند وجود اللاكتوز؟', 'points': 5.0, 'choices': [
                        {'text': 'Lactose binds to the repressor, which then detaches from the operator, allowing transcription.', 'text_arabic': 'يرتبط اللاكتوز بالكابت، الذي ينفصل بعد ذلك عن المشغل، مما يسمح بالنسخ.', 'is_correct': True},
                        {'text': 'Lactose binds to the operator, preventing transcription.', 'text_arabic': 'يرتبط اللاكتوز بالمشغل، مما يمنع النسخ.', 'is_correct': False},
                        {'text': 'Lactose acts as a co-repressor, activating the repressor.', 'text_arabic': 'يعمل اللاكتوز ككابت مساعد، وينشط الكابت.', 'is_correct': False},
                        {'text': 'Lactose binds to RNA polymerase, enhancing transcription.', 'text_arabic': 'يرتبط اللاكتوز ببوليميراز RNA، مما يعزز النسخ.', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What are transcription factors?', 'text_arabic': 'ما هي عوامل النسخ؟', 'points': 6.0, 'explanation': 'Proteins that bind to specific DNA sequences to control the rate of transcription.', 'explanation_arabic': 'بروتينات ترتبط بتسلسلات DNA محددة للتحكم في معدل النسخ.'},
                    {'type': 'qcm_single', 'text': 'The study of heritable changes in gene expression that do not involve changes to the underlying DNA sequence is called:', 'text_arabic': 'تسمى دراسة التغيرات الموروثة في التعبير الجيني التي لا تنطوي على تغييرات في تسلسل DNA الأساسي:', 'points': 4.0, 'choices': [
                        {'text': 'Epigenetics', 'text_arabic': 'علم التخلق', 'is_correct': True},
                        {'text': 'Genomics', 'text_arabic': 'علم الجينوم', 'is_correct': False},
                        {'text': 'Proteomics', 'text_arabic': 'علم البروتينات', 'is_correct': False},
                        {'text': 'Metabolomics', 'text_arabic': 'علم الأيض', 'is_correct': False},
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
