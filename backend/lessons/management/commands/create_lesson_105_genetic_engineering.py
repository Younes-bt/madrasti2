from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Create exercises for Lesson 105: Genetic engineering - principles and techniques'

    def handle(self, *args, **options):
        lesson_id = 105

        try:
            lesson = Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'Lesson with ID {lesson_id} does not exist'))
            return

        # Get admin user
        admin_user = User.objects.filter(is_superuser=True).first()
        if not admin_user:
            self.stdout.write(self.style.ERROR('No superuser found'))
            return

        # Clear existing exercises
        Exercise.objects.filter(lesson_id=lesson_id).delete()

        exercises_data = [
            {
                'title': 'Introduction to Genetic Engineering',
                'title_ar': 'مقدمة في الهندسة الوراثية',
                'description': 'Understanding the fundamentals of genetic engineering',
                'description_ar': 'فهم أساسيات الهندسة الوراثية',
                'difficulty': 'beginner',
                'points': 12,
                'questions': [
                    {
                        'text': 'What is genetic engineering?',
                        'text_ar': 'ما هي الهندسة الوراثية؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Direct manipulation of an organism\'s genes using biotechnology', 'text_ar': 'التعامل المباشر مع جينات الكائن الحي باستخدام التكنولوجيا الحيوية', 'is_correct': True},
                            {'text': 'Natural selection process', 'text_ar': 'عملية الانتقاء الطبيعي', 'is_correct': False},
                            {'text': 'Study of heredity only', 'text_ar': 'دراسة الوراثة فقط', 'is_correct': False},
                            {'text': 'Cloning organisms naturally', 'text_ar': 'استنساخ الكائنات بشكل طبيعي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which of the following is a key goal of genetic engineering?',
                        'text_ar': 'أي من التالي هو هدف رئيسي للهندسة الوراثية؟',
                        'type': 'qcm_multiple',
                        'points': 2,
                        'choices': [
                            {'text': 'Producing medicines like insulin', 'text_ar': 'إنتاج أدوية مثل الأنسولين', 'is_correct': True},
                            {'text': 'Creating disease-resistant crops', 'text_ar': 'إنشاء محاصيل مقاومة للأمراض', 'is_correct': True},
                            {'text': 'Gene therapy for genetic disorders', 'text_ar': 'العلاج الجيني للاضطرابات الوراثية', 'is_correct': True},
                            {'text': 'Eliminating all mutations', 'text_ar': 'القضاء على جميع الطفرات', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is recombinant DNA?',
                        'text_ar': 'ما هو الحمض النووي المؤتلف (ADN recombinant)?',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'DNA formed by combining genetic material from multiple sources', 'text_ar': 'حمض نووي مكوّن من دمج مواد وراثية من مصادر متعددة', 'is_correct': True},
                            {'text': 'DNA that occurs naturally', 'text_ar': 'حمض نووي يحدث بشكل طبيعي', 'is_correct': False},
                            {'text': 'Damaged DNA', 'text_ar': 'حمض نووي تالف', 'is_correct': False},
                            {'text': 'RNA molecules', 'text_ar': 'جزيئات ARN', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Genetic engineering can only be performed on plants.',
                        'text_ar': 'يمكن إجراء الهندسة الوراثية على النباتات فقط.',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': True},
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is a GMO (Genetically Modified Organism)?',
                        'text_ar': 'ما هو الكائن المعدل وراثياً (OGM)?',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'An organism whose genetic material has been altered using genetic engineering', 'text_ar': 'كائن تم تغيير مادته الوراثية باستخدام الهندسة الوراثية', 'is_correct': True},
                            {'text': 'An organism from a different species', 'text_ar': 'كائن من نوع مختلف', 'is_correct': False},
                            {'text': 'A mutated organism', 'text_ar': 'كائن متحور', 'is_correct': False},
                            {'text': 'An extinct organism', 'text_ar': 'كائن منقرض', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which field benefits most from genetic engineering?',
                        'text_ar': 'أي مجال يستفيد أكثر من الهندسة الوراثية؟',
                        'type': 'qcm_multiple',
                        'points': 2,
                        'choices': [
                            {'text': 'Medicine', 'text_ar': 'الطب', 'is_correct': True},
                            {'text': 'Agriculture', 'text_ar': 'الزراعة', 'is_correct': True},
                            {'text': 'Industry', 'text_ar': 'الصناعة', 'is_correct': True},
                            {'text': 'Architecture', 'text_ar': 'الهندسة المعمارية', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Molecular Tools in Genetic Engineering',
                'title_ar': 'الأدوات الجزيئية في الهندسة الوراثية',
                'description': 'Understanding restriction enzymes, plasmids, and vectors',
                'description_ar': 'فهم إنزيمات القطع والبلاسميدات والنواقل',
                'difficulty': 'intermediate',
                'points': 12,
                'questions': [
                    {
                        'text': 'What are restriction enzymes?',
                        'text_ar': 'ما هي إنزيمات القطع (endonucléases de restriction)?',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Enzymes that cut DNA at specific recognition sequences', 'text_ar': 'إنزيمات تقطع الحمض النووي في مواقع تعرّف محددة', 'is_correct': True},
                            {'text': 'Enzymes that synthesize DNA', 'text_ar': 'إنزيمات تركّب الحمض النووي', 'is_correct': False},
                            {'text': 'Enzymes that destroy proteins', 'text_ar': 'إنزيمات تدمّر البروتينات', 'is_correct': False},
                            {'text': 'Enzymes that repair DNA', 'text_ar': 'إنزيمات تصلح الحمض النووي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the function of DNA ligase in genetic engineering?',
                        'text_ar': 'ما هي وظيفة إنزيم ADN ligase في الهندسة الوراثية؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'It joins DNA fragments together', 'text_ar': 'يربط أجزاء الحمض النووي معاً', 'is_correct': True},
                            {'text': 'It cuts DNA', 'text_ar': 'يقطع الحمض النووي', 'is_correct': False},
                            {'text': 'It denatures DNA', 'text_ar': 'يفكك الحمض النووي', 'is_correct': False},
                            {'text': 'It translates DNA to protein', 'text_ar': 'يترجم الحمض النووي إلى بروتين', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is a plasmid?',
                        'text_ar': 'ما هو البلاسميد (plasmide)?',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'A small circular DNA molecule found in bacteria', 'text_ar': 'جزيء حمض نووي دائري صغير موجود في البكتيريا', 'is_correct': True},
                            {'text': 'A type of protein', 'text_ar': 'نوع من البروتين', 'is_correct': False},
                            {'text': 'A chromosome fragment', 'text_ar': 'جزء من الكروموسوم', 'is_correct': False},
                            {'text': 'A viral particle', 'text_ar': 'جزيء فيروسي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which of the following are used as vectors in genetic engineering?',
                        'text_ar': 'أي من التالي يُستخدم كناقلات في الهندسة الوراثية؟',
                        'type': 'qcm_multiple',
                        'points': 2,
                        'choices': [
                            {'text': 'Plasmids', 'text_ar': 'البلاسميدات', 'is_correct': True},
                            {'text': 'Bacteriophages', 'text_ar': 'البكتيريوفاجات', 'is_correct': True},
                            {'text': 'Artificial chromosomes', 'text_ar': 'الكروموسومات الاصطناعية', 'is_correct': True},
                            {'text': 'Mitochondria', 'text_ar': 'الميتوكندريا', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Restriction enzymes cut DNA randomly.',
                        'text_ar': 'تقطع إنزيمات القطع الحمض النووي بشكل عشوائي.',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': True},
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What are sticky ends in DNA?',
                        'text_ar': 'ما هي النهايات اللاصقة (extrémités cohésives) في الحمض النووي؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Overhanging single-stranded DNA ends that can base-pair with complementary sequences', 'text_ar': 'نهايات حمض نووي أحادية السلسلة متدلية يمكنها الارتباط بتسلسلات مكملة', 'is_correct': True},
                            {'text': 'Blunt DNA ends', 'text_ar': 'نهايات حمض نووي حادة', 'is_correct': False},
                            {'text': 'Damaged DNA ends', 'text_ar': 'نهايات حمض نووي تالفة', 'is_correct': False},
                            {'text': 'Circular DNA', 'text_ar': 'حمض نووي دائري', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'PCR and DNA Amplification',
                'title_ar': 'تفاعل البوليميراز المتسلسل ومضاعفة الحمض النووي',
                'description': 'Understanding PCR technique and its applications',
                'description_ar': 'فهم تقنية PCR وتطبيقاتها',
                'difficulty': 'intermediate',
                'points': 12,
                'questions': [
                    {
                        'text': 'What does PCR stand for?',
                        'text_ar': 'ماذا تعني PCR?',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Polymerase Chain Reaction', 'text_ar': 'تفاعل البوليميراز المتسلسل', 'is_correct': True},
                            {'text': 'Protein Chain Reaction', 'text_ar': 'تفاعل سلسلة البروتين', 'is_correct': False},
                            {'text': 'Plasmid Cloning Reaction', 'text_ar': 'تفاعل استنساخ البلاسميد', 'is_correct': False},
                            {'text': 'Peptide Chain Replication', 'text_ar': 'تكاثر سلسلة الببتيد', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the main purpose of PCR?',
                        'text_ar': 'ما هو الهدف الرئيسي من PCR?',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'To amplify (make many copies of) a specific DNA segment', 'text_ar': 'لمضاعفة (صنع نسخ عديدة من) جزء محدد من الحمض النووي', 'is_correct': True},
                            {'text': 'To cut DNA', 'text_ar': 'لقطع الحمض النووي', 'is_correct': False},
                            {'text': 'To translate DNA to protein', 'text_ar': 'لترجمة الحمض النووي إلى بروتين', 'is_correct': False},
                            {'text': 'To sequence entire genomes', 'text_ar': 'لتسلسل الجينومات الكاملة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which enzyme is essential for PCR?',
                        'text_ar': 'أي إنزيم ضروري لـ PCR?',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'DNA polymerase (usually Taq polymerase)', 'text_ar': 'بوليميراز الحمض النووي (عادة Taq polymerase)', 'is_correct': True},
                            {'text': 'Ligase', 'text_ar': 'Ligase', 'is_correct': False},
                            {'text': 'Restriction enzyme', 'text_ar': 'إنزيم القطع', 'is_correct': False},
                            {'text': 'Helicase', 'text_ar': 'Helicase', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What are the three main steps of PCR?',
                        'text_ar': 'ما هي الخطوات الثلاث الرئيسية لـ PCR?',
                        'type': 'qcm_multiple',
                        'points': 2,
                        'choices': [
                            {'text': 'Denaturation (heating)', 'text_ar': 'التفكيك (التسخين)', 'is_correct': True},
                            {'text': 'Annealing (primer binding)', 'text_ar': 'الالتحام (ربط البادئات)', 'is_correct': True},
                            {'text': 'Extension (DNA synthesis)', 'text_ar': 'الامتداد (تركيب الحمض النووي)', 'is_correct': True},
                            {'text': 'Ligation', 'text_ar': 'الربط', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'PCR requires primers.',
                        'text_ar': 'يتطلب PCR بادئات (amorces).',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is Taq polymerase?',
                        'text_ar': 'ما هو Taq polymerase?',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'A heat-stable DNA polymerase from Thermus aquaticus bacteria', 'text_ar': 'بوليميراز حمض نووي مستقر للحرارة من بكتيريا Thermus aquaticus', 'is_correct': True},
                            {'text': 'A restriction enzyme', 'text_ar': 'إنزيم قطع', 'is_correct': False},
                            {'text': 'A type of plasmid', 'text_ar': 'نوع من البلاسميد', 'is_correct': False},
                            {'text': 'A cloning vector', 'text_ar': 'ناقل استنساخ', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Gene Cloning and Expression',
                'title_ar': 'استنساخ الجينات وتعبيرها',
                'description': 'Understanding how genes are cloned and expressed',
                'description_ar': 'فهم كيفية استنساخ الجينات وتعبيرها',
                'difficulty': 'advanced',
                'points': 12,
                'questions': [
                    {
                        'text': 'What is gene cloning?',
                        'text_ar': 'ما هو استنساخ الجينات؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'The process of making identical copies of a gene', 'text_ar': 'عملية صنع نسخ متطابقة من جين', 'is_correct': True},
                            {'text': 'Creating identical organisms', 'text_ar': 'إنشاء كائنات متطابقة', 'is_correct': False},
                            {'text': 'Mutating genes', 'text_ar': 'طفر الجينات', 'is_correct': False},
                            {'text': 'Deleting genes', 'text_ar': 'حذف الجينات', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which organism is commonly used as a host for gene cloning?',
                        'text_ar': 'أي كائن يُستخدم عادة كمضيف لاستنساخ الجينات؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Escherichia coli (E. coli) bacteria', 'text_ar': 'بكتيريا Escherichia coli (E. coli)', 'is_correct': True},
                            {'text': 'Human cells', 'text_ar': 'الخلايا البشرية', 'is_correct': False},
                            {'text': 'Viruses only', 'text_ar': 'الفيروسات فقط', 'is_correct': False},
                            {'text': 'Plant cells only', 'text_ar': 'الخلايا النباتية فقط', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is transformation in genetic engineering?',
                        'text_ar': 'ما هو التحويل (transformation) في الهندسة الوراثية؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Introducing foreign DNA into a bacterial cell', 'text_ar': 'إدخال حمض نووي أجنبي إلى خلية بكتيرية', 'is_correct': True},
                            {'text': 'Changing protein structure', 'text_ar': 'تغيير بنية البروتين', 'is_correct': False},
                            {'text': 'Cell division', 'text_ar': 'انقسام الخلية', 'is_correct': False},
                            {'text': 'Gene mutation', 'text_ar': 'طفرة جينية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which of the following are steps in gene cloning?',
                        'text_ar': 'أي من التالي خطوات في استنساخ الجينات؟',
                        'type': 'qcm_multiple',
                        'points': 2,
                        'choices': [
                            {'text': 'Isolating the gene of interest', 'text_ar': 'عزل الجين المطلوب', 'is_correct': True},
                            {'text': 'Inserting gene into a vector', 'text_ar': 'إدخال الجين في ناقل', 'is_correct': True},
                            {'text': 'Transforming host cells', 'text_ar': 'تحويل الخلايا المضيفة', 'is_correct': True},
                            {'text': 'Deleting all other genes', 'text_ar': 'حذف جميع الجينات الأخرى', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Recombinant insulin was the first genetically engineered drug approved for human use.',
                        'text_ar': 'كان الأنسولين المؤتلف أول دواء مهندس وراثياً تمت الموافقة عليه للاستخدام البشري.',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is a selectable marker in a cloning vector?',
                        'text_ar': 'ما هو المؤشر القابل للاختيار (marqueur sélectionnable) في ناقل الاستنساخ؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'A gene that allows identification of cells containing the vector (e.g., antibiotic resistance)', 'text_ar': 'جين يسمح بتحديد الخلايا التي تحتوي على الناقل (مثل مقاومة المضادات الحيوية)', 'is_correct': True},
                            {'text': 'A fluorescent dye', 'text_ar': 'صبغة فلورية', 'is_correct': False},
                            {'text': 'A protein marker', 'text_ar': 'مؤشر بروتيني', 'is_correct': False},
                            {'text': 'A radioactive label', 'text_ar': 'علامة مشعة', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Applications and CRISPR Technology',
                'title_ar': 'التطبيقات وتقنية CRISPR',
                'description': 'Modern applications and CRISPR-Cas9 gene editing',
                'description_ar': 'التطبيقات الحديثة وتحرير الجينات بواسطة CRISPR-Cas9',
                'difficulty': 'advanced',
                'points': 12,
                'questions': [
                    {
                        'text': 'What does CRISPR stand for?',
                        'text_ar': 'ماذا تعني CRISPR?',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Clustered Regularly Interspaced Short Palindromic Repeats', 'text_ar': 'تكرارات متناظرة قصيرة متباعدة بانتظام ومجمعة', 'is_correct': True},
                            {'text': 'Complete Replication of Interspaced Sequences', 'text_ar': 'تكرار كامل للتسلسلات المتباعدة', 'is_correct': False},
                            {'text': 'Cell Regulation by Inserted Sequences', 'text_ar': 'تنظيم الخلية بواسطة التسلسلات المدرجة', 'is_correct': False},
                            {'text': 'Chromosome Rearrangement System', 'text_ar': 'نظام إعادة ترتيب الكروموسومات', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the role of Cas9 in CRISPR technology?',
                        'text_ar': 'ما هو دور Cas9 في تقنية CRISPR?',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'It is an enzyme that cuts DNA at specific locations', 'text_ar': 'إنزيم يقطع الحمض النووي في مواقع محددة', 'is_correct': True},
                            {'text': 'It synthesizes new DNA', 'text_ar': 'يصنّع حمض نووي جديد', 'is_correct': False},
                            {'text': 'It repairs damaged DNA', 'text_ar': 'يصلح الحمض النووي التالف', 'is_correct': False},
                            {'text': 'It translates DNA to RNA', 'text_ar': 'يترجم الحمض النووي إلى ARN', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which of the following are applications of genetic engineering?',
                        'text_ar': 'أي من التالي تطبيقات للهندسة الوراثية؟',
                        'type': 'qcm_multiple',
                        'points': 2,
                        'choices': [
                            {'text': 'Production of human insulin in bacteria', 'text_ar': 'إنتاج الأنسولين البشري في البكتيريا', 'is_correct': True},
                            {'text': 'Creating crops resistant to pests', 'text_ar': 'إنشاء محاصيل مقاومة للآفات', 'is_correct': True},
                            {'text': 'Gene therapy for genetic diseases', 'text_ar': 'العلاج الجيني للأمراض الوراثية', 'is_correct': True},
                            {'text': 'Changing weather patterns', 'text_ar': 'تغيير أنماط الطقس', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What are GMO crops designed to be?',
                        'text_ar': 'ما هي المحاصيل المعدلة وراثياً المصممة لتكون؟',
                        'type': 'qcm_multiple',
                        'points': 2,
                        'choices': [
                            {'text': 'Resistant to herbicides', 'text_ar': 'مقاومة لمبيدات الأعشاب', 'is_correct': True},
                            {'text': 'Resistant to insects/pests', 'text_ar': 'مقاومة للحشرات/الآفات', 'is_correct': True},
                            {'text': 'More nutritious', 'text_ar': 'أكثر قيمة غذائية', 'is_correct': True},
                            {'text': 'Naturally toxic', 'text_ar': 'سامة بشكل طبيعي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'CRISPR-Cas9 can be used to edit genes in living organisms.',
                        'text_ar': 'يمكن استخدام CRISPR-Cas9 لتحرير الجينات في الكائنات الحية.',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is gene therapy?',
                        'text_ar': 'ما هو العلاج الجيني؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Treating diseases by inserting, altering, or removing genes', 'text_ar': 'علاج الأمراض عن طريق إدخال أو تغيير أو إزالة الجينات', 'is_correct': True},
                            {'text': 'Using drugs to treat genetic disorders', 'text_ar': 'استخدام الأدوية لعلاج الاضطرابات الوراثية', 'is_correct': False},
                            {'text': 'Physical therapy for genetic conditions', 'text_ar': 'العلاج الطبيعي للحالات الوراثية', 'is_correct': False},
                            {'text': 'Surgery to correct genetic defects', 'text_ar': 'الجراحة لتصحيح العيوب الوراثية', 'is_correct': False}
                        ]
                    }
                ]
            }
        ]

        # Create exercises
        for ex_data in exercises_data:
            exercise = Exercise.objects.create(
                lesson=lesson,
                title=ex_data['title'],
                title_arabic=ex_data['title_ar'],
                description=ex_data['description'],
                difficulty_level=ex_data['difficulty'],
                total_points=ex_data['points'],
                created_by=admin_user
            )

            # Create questions for this exercise
            for q_idx, q_data in enumerate(ex_data['questions'], 1):
                question = Question.objects.create(
                    exercise=exercise,
                    question_text=q_data['text'],
                    question_text_arabic=q_data['text_ar'],
                    question_type=q_data['type'],
                    points=q_data['points'],
                    order=q_idx
                )

                # Create choices for this question
                for c_idx, choice in enumerate(q_data['choices'], 1):
                    QuestionChoice.objects.create(
                        question=question,
                        choice_text=choice['text'],
                        choice_text_arabic=choice['text_ar'],
                        is_correct=choice['is_correct'],
                        order=c_idx
                    )

        self.stdout.write(self.style.SUCCESS(f'Successfully created {len(exercises_data)} exercises with 6 questions each for Lesson {lesson_id}'))
