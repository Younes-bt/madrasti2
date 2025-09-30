from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for The expression of genetic information - Lesson ID: 104'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=104)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Gene Expression Overview',
                    'title_arabic': 'نظرة عامة على التعبير الجيني',
                    'description': 'Understanding the fundamental concepts of gene expression and protein synthesis',
                    'description_arabic': 'فهم المفاهيم الأساسية للتعبير الجيني وتخليق البروتين',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is gene expression?',
                            'question_text_arabic': 'ما هو التعبير الجيني؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The process by which genetic information is used to synthesize proteins', 'choice_text_arabic': 'العملية التي تُستخدم فيها المعلومات الوراثية لتخليق البروتينات', 'is_correct': True},
                                {'choice_text': 'The replication of DNA during cell division', 'choice_text_arabic': 'تضاعف الحمض النووي أثناء انقسام الخلية', 'is_correct': False},
                                {'choice_text': 'The movement of genes between chromosomes', 'choice_text_arabic': 'حركة الجينات بين الكروموسومات', 'is_correct': False},
                                {'choice_text': 'The mutation of genetic material', 'choice_text_arabic': 'طفرة المادة الوراثية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are the two main steps of gene expression?',
                            'question_text_arabic': 'ما هما الخطوتان الرئيسيتان للتعبير الجيني؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Transcription and translation', 'choice_text_arabic': 'النسخ والترجمة', 'is_correct': True},
                                {'choice_text': 'Replication and transcription', 'choice_text_arabic': 'التضاعف والنسخ', 'is_correct': False},
                                {'choice_text': 'Translation and replication', 'choice_text_arabic': 'الترجمة والتضاعف', 'is_correct': False},
                                {'choice_text': 'Mutation and selection', 'choice_text_arabic': 'الطفرة والانتقاء', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Where does transcription occur in eukaryotic cells?',
                            'question_text_arabic': 'أين يحدث النسخ في الخلايا حقيقية النواة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'In the nucleus', 'choice_text_arabic': 'في النواة', 'is_correct': True},
                                {'choice_text': 'In the cytoplasm', 'choice_text_arabic': 'في السيتوبلازم', 'is_correct': False},
                                {'choice_text': 'In the mitochondria', 'choice_text_arabic': 'في الميتوكوندريا', 'is_correct': False},
                                {'choice_text': 'In the ribosomes', 'choice_text_arabic': 'في الريبوسومات', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Where does translation occur?',
                            'question_text_arabic': 'أين تحدث الترجمة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'On ribosomes in the cytoplasm', 'choice_text_arabic': 'على الريبوسومات في السيتوبلازم', 'is_correct': True},
                                {'choice_text': 'In the nucleus', 'choice_text_arabic': 'في النواة', 'is_correct': False},
                                {'choice_text': 'In the mitochondria only', 'choice_text_arabic': 'في الميتوكوندريا فقط', 'is_correct': False},
                                {'choice_text': 'In the endoplasmic reticulum only', 'choice_text_arabic': 'في الشبكة الإندوبلازمية فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Gene expression is the same in all cells of an organism.',
                            'question_text_arabic': 'التعبير الجيني متطابق في جميع خلايا الكائن الحي.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        }
                    ]
                },
                {
                    'title': 'Transcription Process',
                    'title_arabic': 'عملية النسخ',
                    'description': 'Detailed study of DNA transcription to RNA',
                    'description_arabic': 'دراسة مفصلة لنسخ الحمض النووي إلى الحمض النووي الريبوزي',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What enzyme is responsible for transcription?',
                            'question_text_arabic': 'ما الإنزيم المسؤول عن النسخ؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'RNA polymerase', 'choice_text_arabic': 'بوليميراز الحمض النووي الريبوزي', 'is_correct': True},
                                {'choice_text': 'DNA polymerase', 'choice_text_arabic': 'بوليميراز الحمض النووي', 'is_correct': False},
                                {'choice_text': 'Ligase', 'choice_text_arabic': 'اللايغيز', 'is_correct': False},
                                {'choice_text': 'Helicase', 'choice_text_arabic': 'الهليكيز', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the template strand?',
                            'question_text_arabic': 'ما هو الخيط القالب؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The DNA strand used as a template for RNA synthesis', 'choice_text_arabic': 'خيط الحمض النووي المستخدم كقالب لتخليق الحمض النووي الريبوزي', 'is_correct': True},
                                {'choice_text': 'The newly synthesized RNA strand', 'choice_text_arabic': 'خيط الحمض النووي الريبوزي المخلق حديثاً', 'is_correct': False},
                                {'choice_text': 'The coding DNA strand', 'choice_text_arabic': 'خيط الحمض النووي المشفر', 'is_correct': False},
                                {'choice_text': 'Any DNA strand in the gene', 'choice_text_arabic': 'أي خيط من الحمض النووي في الجين', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are the three main phases of transcription?',
                            'question_text_arabic': 'ما هي المراحل الثلاث الرئيسية للنسخ؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Initiation', 'choice_text_arabic': 'البدء', 'is_correct': True},
                                {'choice_text': 'Elongation', 'choice_text_arabic': 'الاستطالة', 'is_correct': True},
                                {'choice_text': 'Termination', 'choice_text_arabic': 'الإنهاء', 'is_correct': True},
                                {'choice_text': 'Replication', 'choice_text_arabic': 'التضاعف', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is a promoter?',
                            'question_text_arabic': 'ما هو المحفز؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'A DNA sequence where RNA polymerase binds to start transcription', 'choice_text_arabic': 'تسلسل من الحمض النووي حيث يرتبط بوليميراز الحمض النووي الريبوزي لبدء النسخ', 'is_correct': True},
                                {'choice_text': 'A protein that helps with transcription', 'choice_text_arabic': 'بروتين يساعد في النسخ', 'is_correct': False},
                                {'choice_text': 'The end of a gene', 'choice_text_arabic': 'نهاية الجين', 'is_correct': False},
                                {'choice_text': 'A type of RNA molecule', 'choice_text_arabic': 'نوع من جزيئات الحمض النووي الريبوزي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'During transcription, what base pairs with adenine in DNA?',
                            'question_text_arabic': 'أثناء النسخ، ما القاعدة التي تتزاوج مع الأدينين في الحمض النووي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Uracil', 'choice_text_arabic': 'اليوراسيل', 'is_correct': True},
                                {'choice_text': 'Thymine', 'choice_text_arabic': 'الثايمين', 'is_correct': False},
                                {'choice_text': 'Cytosine', 'choice_text_arabic': 'السيتوزين', 'is_correct': False},
                                {'choice_text': 'Guanine', 'choice_text_arabic': 'الجوانين', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Transcription produces a single-stranded RNA copy of a gene.',
                            'question_text_arabic': 'ينتج النسخ نسخة أحادية الخيط من الحمض النووي الريبوزي للجين.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'RNA Processing and Types',
                    'title_arabic': 'معالجة الحمض النووي الريبوزي وأنواعه',
                    'description': 'Understanding different types of RNA and post-transcriptional modifications',
                    'description_arabic': 'فهم أنواع مختلفة من الحمض النووي الريبوزي والتعديلات ما بعد النسخ',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What are the three main types of RNA involved in gene expression?',
                            'question_text_arabic': 'ما هي الأنواع الثلاثة الرئيسية للحمض النووي الريبوزي المشاركة في التعبير الجيني؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'mRNA (messenger RNA)', 'choice_text_arabic': 'mRNA (الحمض النووي الريبوزي الرسول)', 'is_correct': True},
                                {'choice_text': 'tRNA (transfer RNA)', 'choice_text_arabic': 'tRNA (الحمض النووي الريبوزي الناقل)', 'is_correct': True},
                                {'choice_text': 'rRNA (ribosomal RNA)', 'choice_text_arabic': 'rRNA (الحمض النووي الريبوزي الريبوسومي)', 'is_correct': True},
                                {'choice_text': 'dRNA (DNA RNA)', 'choice_text_arabic': 'dRNA (الحمض النووي الريبوزي DNA)', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the function of mRNA?',
                            'question_text_arabic': 'ما وظيفة الحمض النووي الريبوزي الرسول؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Carries genetic information from DNA to ribosomes', 'choice_text_arabic': 'ينقل المعلومات الوراثية من الحمض النووي إلى الريبوسومات', 'is_correct': True},
                                {'choice_text': 'Transfers amino acids to the ribosome', 'choice_text_arabic': 'ينقل الأحماض الأمينية إلى الريبوسوم', 'is_correct': False},
                                {'choice_text': 'Forms the structure of ribosomes', 'choice_text_arabic': 'يشكل بنية الريبوسومات', 'is_correct': False},
                                {'choice_text': 'Stores genetic information', 'choice_text_arabic': 'يخزن المعلومات الوراثية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are introns and exons?',
                            'question_text_arabic': 'ما هي الإنترونات والإكسونات؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Introns are non-coding sequences; exons are coding sequences', 'choice_text_arabic': 'الإنترونات تسلسلات غير مشفرة؛ الإكسونات تسلسلات مشفرة', 'is_correct': True},
                                {'choice_text': 'Introns are coding sequences; exons are non-coding sequences', 'choice_text_arabic': 'الإنترونات تسلسلات مشفرة؛ الإكسونات تسلسلات غير مشفرة', 'is_correct': False},
                                {'choice_text': 'Both are always removed during processing', 'choice_text_arabic': 'كلاهما يُزال دائماً أثناء المعالجة', 'is_correct': False},
                                {'choice_text': 'They are the same thing', 'choice_text_arabic': 'هما نفس الشيء', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is RNA splicing?',
                            'question_text_arabic': 'ما هو تقطيع الحمض النووي الريبوزي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Removal of introns and joining of exons in pre-mRNA', 'choice_text_arabic': 'إزالة الإنترونات وربط الإكسونات في الحمض النووي الريبوزي الأولي', 'is_correct': True},
                                {'choice_text': 'Cutting RNA into smaller pieces', 'choice_text_arabic': 'تقطيع الحمض النووي الريبوزي إلى قطع أصغر', 'is_correct': False},
                                {'choice_text': 'Adding a cap to mRNA', 'choice_text_arabic': 'إضافة غطاء للحمض النووي الريبوزي الرسول', 'is_correct': False},
                                {'choice_text': 'Translating mRNA to protein', 'choice_text_arabic': 'ترجمة الحمض النووي الريبوزي الرسول إلى بروتين', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What modifications occur to eukaryotic mRNA?',
                            'question_text_arabic': 'ما التعديلات التي تحدث للحمض النووي الريبوزي الرسول في حقيقيات النواة؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': '5\' capping', 'choice_text_arabic': 'إضافة غطاء 5\'', 'is_correct': True},
                                {'choice_text': '3\' polyadenylation', 'choice_text_arabic': 'إضافة متعدد الأدينين 3\'', 'is_correct': True},
                                {'choice_text': 'Splicing', 'choice_text_arabic': 'التقطيع', 'is_correct': True},
                                {'choice_text': 'Methylation of all bases', 'choice_text_arabic': 'مثيلة جميع القواعد', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Alternative splicing allows one gene to produce multiple protein variants.',
                            'question_text_arabic': 'التقطيع البديل يسمح لجين واحد بإنتاج متغيرات متعددة من البروتين.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Translation Process',
                    'title_arabic': 'عملية الترجمة',
                    'description': 'Converting mRNA into proteins through the translation process',
                    'description_arabic': 'تحويل الحمض النووي الريبوزي الرسول إلى بروتينات من خلال عملية الترجمة',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is the genetic code?',
                            'question_text_arabic': 'ما هو الكود الوراثي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The correspondence between codons and amino acids', 'choice_text_arabic': 'المطابقة بين الكودونات والأحماض الأمينية', 'is_correct': True},
                                {'choice_text': 'The sequence of DNA in a gene', 'choice_text_arabic': 'تسلسل الحمض النووي في الجين', 'is_correct': False},
                                {'choice_text': 'The structure of proteins', 'choice_text_arabic': 'بنية البروتينات', 'is_correct': False},
                                {'choice_text': 'The number of chromosomes', 'choice_text_arabic': 'عدد الكروموسومات', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How many bases make up a codon?',
                            'question_text_arabic': 'كم قاعدة تشكل الكودون؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '3', 'choice_text_arabic': '3', 'is_correct': True},
                                {'choice_text': '2', 'choice_text_arabic': '2', 'is_correct': False},
                                {'choice_text': '4', 'choice_text_arabic': '4', 'is_correct': False},
                                {'choice_text': '6', 'choice_text_arabic': '6', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the start codon?',
                            'question_text_arabic': 'ما هو كودون البدء؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'AUG', 'choice_text_arabic': 'AUG', 'is_correct': True},
                                {'choice_text': 'UAG', 'choice_text_arabic': 'UAG', 'is_correct': False},
                                {'choice_text': 'UGA', 'choice_text_arabic': 'UGA', 'is_correct': False},
                                {'choice_text': 'UAA', 'choice_text_arabic': 'UAA', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are the three phases of translation?',
                            'question_text_arabic': 'ما هي المراحل الثلاث للترجمة؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Initiation', 'choice_text_arabic': 'البدء', 'is_correct': True},
                                {'choice_text': 'Elongation', 'choice_text_arabic': 'الاستطالة', 'is_correct': True},
                                {'choice_text': 'Termination', 'choice_text_arabic': 'الإنهاء', 'is_correct': True},
                                {'choice_text': 'Transcription', 'choice_text_arabic': 'النسخ', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the function of tRNA?',
                            'question_text_arabic': 'ما وظيفة الحمض النووي الريبوزي الناقل؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Brings amino acids to the ribosome during translation', 'choice_text_arabic': 'يجلب الأحماض الأمينية إلى الريبوسوم أثناء الترجمة', 'is_correct': True},
                                {'choice_text': 'Carries genetic information from DNA', 'choice_text_arabic': 'ينقل المعلومات الوراثية من الحمض النووي', 'is_correct': False},
                                {'choice_text': 'Forms the ribosome structure', 'choice_text_arabic': 'يشكل بنية الريبوسوم', 'is_correct': False},
                                {'choice_text': 'Replicates DNA', 'choice_text_arabic': 'يضاعف الحمض النووي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What part of tRNA recognizes the codon on mRNA?',
                            'question_text_arabic': 'أي جزء من الحمض النووي الريبوزي الناقل يتعرف على الكودون في الحمض النووي الريبوزي الرسول؟',
                            'question_type': 'open_short',
                            'correct_answer': 'Anticodon'
                        }
                    ]
                },
                {
                    'title': 'Gene Regulation and Expression Control',
                    'title_arabic': 'تنظيم الجينات وضبط التعبير',
                    'description': 'Mechanisms that control when and how genes are expressed',
                    'description_arabic': 'الآليات التي تتحكم في متى وكيف يتم التعبير عن الجينات',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'Why is gene regulation important?',
                            'question_text_arabic': 'لماذا تنظيم الجينات مهم؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Different cell types need different proteins', 'choice_text_arabic': 'أنواع الخلايا المختلفة تحتاج بروتينات مختلفة', 'is_correct': True},
                                {'choice_text': 'Saves energy by not making unnecessary proteins', 'choice_text_arabic': 'يوفر الطاقة بعدم صنع بروتينات غير ضرورية', 'is_correct': True},
                                {'choice_text': 'Allows response to environmental changes', 'choice_text_arabic': 'يسمح بالاستجابة للتغيرات البيئية', 'is_correct': True},
                                {'choice_text': 'All genes should always be active', 'choice_text_arabic': 'جميع الجينات يجب أن تكون نشطة دائماً', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What are transcription factors?',
                            'question_text_arabic': 'ما هي عوامل النسخ؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Proteins that regulate gene transcription by binding to DNA', 'choice_text_arabic': 'بروتينات تنظم نسخ الجينات بالارتباط بالحمض النووي', 'is_correct': True},
                                {'choice_text': 'Enzymes that copy DNA', 'choice_text_arabic': 'إنزيمات تنسخ الحمض النووي', 'is_correct': False},
                                {'choice_text': 'RNA molecules that regulate translation', 'choice_text_arabic': 'جزيئات الحمض النووي الريبوزي التي تنظم الترجمة', 'is_correct': False},
                                {'choice_text': 'Proteins that form ribosomes', 'choice_text_arabic': 'بروتينات تشكل الريبوسومات', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is negative regulation?',
                            'question_text_arabic': 'ما هو التنظيم السلبي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'When a regulatory protein inhibits gene expression', 'choice_text_arabic': 'عندما يثبط بروتين تنظيمي التعبير الجيني', 'is_correct': True},
                                {'choice_text': 'When a regulatory protein enhances gene expression', 'choice_text_arabic': 'عندما يعزز بروتين تنظيمي التعبير الجيني', 'is_correct': False},
                                {'choice_text': 'When genes are never expressed', 'choice_text_arabic': 'عندما لا يتم التعبير عن الجينات أبداً', 'is_correct': False},
                                {'choice_text': 'When regulation only occurs in the nucleus', 'choice_text_arabic': 'عندما يحدث التنظيم في النواة فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'At what levels can gene expression be regulated?',
                            'question_text_arabic': 'في أي مستويات يمكن تنظيم التعبير الجيني؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Transcriptional level', 'choice_text_arabic': 'المستوى النسخي', 'is_correct': True},
                                {'choice_text': 'Post-transcriptional level', 'choice_text_arabic': 'المستوى ما بعد النسخي', 'is_correct': True},
                                {'choice_text': 'Translational level', 'choice_text_arabic': 'المستوى الترجمي', 'is_correct': True},
                                {'choice_text': 'Chromosomal level only', 'choice_text_arabic': 'المستوى الكروموسومي فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is epigenetic regulation?',
                            'question_text_arabic': 'ما هو التنظيم فوق الجيني؟',
                            'question_type': 'open_short',
                            'correct_answer': 'Regulation of gene expression through chemical modifications without changing DNA sequence'
                        },
                        {
                            'question_text': 'All cells in an organism have the same DNA but different gene expression patterns.',
                            'question_text_arabic': 'جميع خلايا الكائن الحي لها نفس الحمض النووي لكن أنماط تعبير جيني مختلفة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                }
            ]

            total_exercises = 0
            total_questions = 0
            total_choices = 0

            for ex_data in exercises_data:
                # Create exercise
                exercise = Exercise.objects.create(
                    lesson=lesson,
                    created_by_id=1,  # Assuming admin user with ID 1
                    title=ex_data['title'],
                    title_arabic=ex_data['title_arabic'],
                    description=ex_data['description'],
                    instructions=ex_data.get('description_arabic', ''),
                    difficulty_level=ex_data['difficulty'],
                    is_active=True
                )
                total_exercises += 1

                # Create questions for this exercise
                for q_data in ex_data['questions']:
                    question = Question.objects.create(
                        exercise=exercise,
                        question_text=q_data['question_text'],
                        question_text_arabic=q_data['question_text_arabic'],
                        question_type=q_data['question_type'],
                        points=10 if ex_data['difficulty'] == 'beginner' else 15 if ex_data['difficulty'] == 'intermediate' else 20
                    )
                    total_questions += 1

                    # Create choices for QCM questions
                    if q_data['question_type'] in ['qcm_single', 'qcm_multiple'] and 'choices' in q_data:
                        for choice_data in q_data['choices']:
                            QuestionChoice.objects.create(
                                question=question,
                                choice_text=choice_data['choice_text'],
                                choice_text_arabic=choice_data['choice_text_arabic'],
                                is_correct=choice_data['is_correct']
                            )
                            total_choices += 1

                    # Create choices for true/false questions
                    elif q_data['question_type'] == 'true_false':
                        correct_answer = q_data.get('correct_answer', 'True')
                        QuestionChoice.objects.create(
                            question=question,
                            choice_text='True',
                            choice_text_arabic='صواب',
                            is_correct=correct_answer == 'True'
                        )
                        QuestionChoice.objects.create(
                            question=question,
                            choice_text='False',
                            choice_text_arabic='خطأ',
                            is_correct=correct_answer == 'False'
                        )
                        total_choices += 2

                # Create rewards for exercise completion
                ExerciseReward.objects.create(
                    exercise=exercise,
                    completion_points=30 if ex_data['difficulty'] == 'beginner' else 50 if ex_data['difficulty'] == 'intermediate' else 70,
                    completion_coins=1,
                    perfect_score_bonus=20 if ex_data['difficulty'] == 'beginner' else 30 if ex_data['difficulty'] == 'intermediate' else 50
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created for Lesson 104 (The expression of genetic information):\\n'
                    f'Exercises: {total_exercises}\\n'
                    f'Questions: {total_questions}\\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 104 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )