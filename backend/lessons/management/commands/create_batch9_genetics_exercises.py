from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice

User = get_user_model()

class Command(BaseCommand):
    help = 'Create exercises for Batch 9: Genetics and Genetic Engineering (Lesson IDs: 105-109)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises before creating new ones',
        )

    def handle(self, *args, **options):
        lesson_ids = [105, 106, 107, 108, 109]

        # Get admin user for created_by
        self.admin_user = User.objects.filter(is_superuser=True).first()
        if not self.admin_user:
            self.stdout.write(self.style.ERROR('No superuser found. Please create one first.'))
            return

        with transaction.atomic():
            for lesson_id in lesson_ids:
                try:
                    lesson = Lesson.objects.get(id=lesson_id)
                    self.stdout.write(f'\n Processing Lesson ID {lesson_id}: {lesson.title}')

                    if options['delete_existing']:
                        count = Exercise.objects.filter(lesson=lesson).count()
                        Exercise.objects.filter(lesson=lesson).delete()
                        self.stdout.write(self.style.WARNING(f'  Deleted {count} existing exercises'))

                    self.create_exercises_for_lesson(lesson)

                except Lesson.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f'  Lesson ID {lesson_id} not found'))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'  Error: {e}'))

        self.stdout.write(self.style.SUCCESS('\nBatch 9 exercises created successfully'))

    def create_exercises_for_lesson(self, lesson):
        """Create exercises based on lesson ID"""
        if lesson.id == 105:
            self.create_genetic_engineering_exercises(lesson)
        elif lesson.id == 106:
            self.create_genetic_transmission_exercises(lesson)
        elif lesson.id == 107:
            self.create_statistical_laws_exercises(lesson)
        elif lesson.id == 108:
            self.create_human_genetics_exercises(lesson)
        elif lesson.id == 109:
            self.create_biometrics_exercises(lesson)

    # ===== LESSON 105: Genetic Engineering =====
    def create_genetic_engineering_exercises(self, lesson):
        """Genetic engineering: principles and techniques"""

        # Exercise 1: Principles and Concepts
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Genetic Engineering: Principles and Basic Concepts',
            title_arabic='الهندسة الوراثية: المبادئ والمفاهيم الأساسية',
            description='Questions about the basic principles of genetic engineering / أسئلة حول المبادئ الأساسية للهندسة الوراثية',
            difficulty_level='beginner',
            estimated_duration=25,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions_data = [
            {
                'text': 'ما هو تعريف الهندسة الوراثية؟',
                'text_en': 'What is the definition of genetic engineering?',
                'text_fr': 'Quelle est la définition du génie génétique?',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('مجموعة من التقنيات تسمح بتعديل المادة الوراثية للكائنات الحية', True),
                    ('دراسة تطور الكائنات الحية عبر الزمن', False),
                    ('علم يدرس وراثة الصفات من الآباء إلى الأبناء', False),
                    ('تقنية لاستنساخ الكائنات الحية فقط', False)
                ]
            },
            {
                'text': 'ما هي الإنزيمات المستخدمة لقطع ADN في مواقع محددة؟',
                'text_en': 'What are the enzymes used to cut DNA at specific sites?',
                'text_fr': 'Quels sont les enzymes utilisés pour couper l\'ADN à des sites spécifiques?',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('إنزيمات القطع (Endonucléases de restriction)', True),
                    ('إنزيمات الربط (Ligases)', False),
                    ('إنزيمات البلمرة (Polymérases)', False),
                    ('إنزيمات الهضم (Peptidases)', False)
                ]
            },
            {
                'text': 'ما هو دور البلاسميدات في الهندسة الوراثية؟',
                'text_en': 'What is the role of plasmids in genetic engineering?',
                'text_fr': 'Quel est le rôle des plasmides en génie génétique?',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('ناقلات لإدخال الجينات إلى الخلايا المستقبلة', True),
                    ('مصدر للطاقة في الخلية', False),
                    ('مواد تحمي الخلية من الفيروسات', False),
                    ('إنزيمات تساعد في تضاعف ADN', False)
                ]
            },
            {
                'text': 'ما هي التقنية المستخدمة لمضاعفة قطع ADN في المختبر؟',
                'text_en': 'What technique is used to amplify DNA fragments in the laboratory?',
                'text_fr': 'Quelle technique est utilisée pour amplifier des fragments d\'ADN en laboratoire?',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('تفاعل البوليميراز المتسلسل (PCR)', True),
                    ('الرحلان الكهربائي (Electrophorèse)', False),
                    ('الاستنساخ الجيني (Clonage)', False),
                    ('التهجين الجزيئي (Hybridation)', False)
                ]
            },
            {
                'text': 'أي من التطبيقات التالية تعتبر من استخدامات الهندسة الوراثية؟',
                'text_en': 'Which of the following applications is a use of genetic engineering?',
                'text_fr': 'Laquelle des applications suivantes est une utilisation du génie génétique?',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('إنتاج الأنسولين البشري في البكتيريا', True),
                    ('تحسين تقنيات الزراعة التقليدية', False),
                    ('دراسة سلوك الحيوانات', False),
                    ('تصنيف النباتات حسب خصائصها', False)
                ]
            }
        ]

        self.create_questions(ex1, questions_data)

        # Exercise 2: Techniques and Tools
        ex2 = Exercise.objects.create(
            lesson=lesson,
            title='Genetic Engineering Techniques and Tools',
            title_arabic='تقنيات وأدوات الهندسة الوراثية',
            description='Exercises on techniques and tools used in genetic engineering / تمارين حول التقنيات والأدوات المستخدمة في الهندسة الوراثية',
            difficulty_level='intermediate',
            estimated_duration=30,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions_data_2 = [
            {
                'text': 'ما هي خطوات عملية استنساخ جين؟',
                'text_en': 'What are the steps of gene cloning?',
                'text_fr': 'Quelles sont les étapes du clonage d\'un gène?',
                'type': 'multiple_choice',
                'points': 15.0,
                'choices': [
                    ('عزل الجين المراد استنساخه', True),
                    ('إدخال الجين في ناقل (بلاسميد)', True),
                    ('إدخال الناقل في خلية مضيفة', True),
                    ('تدمير الجين المستنسخ', False)
                ]
            },
            {
                'text': 'الرحلان الكهربائي للـADN يستخدم لـ:',
                'text_en': 'DNA electrophoresis is used to:',
                'text_fr': 'L\'électrophorèse de l\'ADN est utilisée pour:',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('فصل قطع ADN حسب حجمها', True),
                    ('مضاعفة ADN', False),
                    ('قطع ADN في مواقع محددة', False),
                    ('ربط قطع ADN', False)
                ]
            },
            {
                'text': 'إنزيم ADN ligase يقوم بـ:',
                'text_en': 'DNA ligase enzyme performs:',
                'text_fr': 'L\'enzyme ADN ligase effectue:',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('ربط قطع ADN ببعضها', True),
                    ('قطع ADN', False),
                    ('مضاعفة ADN', False),
                    ('ترجمة ADN إلى بروتين', False)
                ]
            },
            {
                'text': 'ما هو الناقل الأكثر استخداماً في الهندسة الوراثية؟',
                'text_en': 'What is the most commonly used vector in genetic engineering?',
                'text_fr': 'Quel est le vecteur le plus utilisé en génie génétique?',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('البلاسميدات البكتيرية', True),
                    ('الكروموسومات البشرية', False),
                    ('الميتوكندريا', False),
                    ('الريبوسومات', False)
                ]
            },
            {
                'text': 'CRISPR-Cas9 هي تقنية تستخدم لـ:',
                'text_en': 'CRISPR-Cas9 is a technique used for:',
                'text_fr': 'CRISPR-Cas9 est une technique utilisée pour:',
                'type': 'single_choice',
                'points': 5.0,
                'choices': [
                    ('التعديل الدقيق للجينوم', True),
                    ('تحليل البروتينات', False),
                    ('زراعة الخلايا', False),
                    ('تصوير الخلايا', False)
                ]
            }
        ]

        self.create_questions(ex2, questions_data_2)
        self.stdout.write(f'  Created 2 exercises with 10 questions for Lesson {lesson.id}')

    # ===== LESSON 106: Genetic Transmission =====
    def create_genetic_transmission_exercises(self, lesson):
        """Transmission of genetic information through sexual reproduction"""

        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Transmission of Genetic Information Through Sexual Reproduction',
            title_arabic='انتقال المعلومة الوراثية عبر التوالد الجنسي',
            description='Questions about mechanisms of genetic information transmission / أسئلة حول آليات انتقال المعلومة الوراثية',
            difficulty_level='beginner',
            estimated_duration=25,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions_data = [
            {
                'text': 'ما هي الخلايا الجنسية في الكائنات الحية؟',
                'text_en': 'What are the sex cells in living organisms?',
                'text_fr': 'Quelles sont les cellules sexuelles chez les êtres vivants?',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('الأمشاج (الحيوانات المنوية والبويضات)', True),
                    ('الخلايا الجسدية', False),
                    ('الخلايا العصبية', False),
                    ('خلايا الدم', False)
                ]
            },
            {
                'text': 'الانقسام الاختزالي (Méiose) ينتج خلايا:',
                'text_en': 'Meiosis produces cells that are:',
                'text_fr': 'La méiose produit des cellules qui sont:',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('أحادية الصيغة الصبغية (n)', True),
                    ('ثنائية الصيغة الصبغية (2n)', False),
                    ('ثلاثية الصيغة الصبغية (3n)', False),
                    ('رباعية الصيغة الصبغية (4n)', False)
                ]
            },
            {
                'text': 'عملية الإخصاب تؤدي إلى:',
                'text_en': 'Fertilization leads to:',
                'text_fr': 'La fécondation conduit à:',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('استعادة الصيغة الصبغية الثنائية (2n)', True),
                    ('تكوين خلايا أحادية', False),
                    ('موت الخلايا', False),
                    ('انقسام الخلية إلى أربع خلايا', False)
                ]
            },
            {
                'text': 'كم عدد الانقسامات في الانقسام الاختزالي؟',
                'text_en': 'How many divisions occur in meiosis?',
                'text_fr': 'Combien de divisions se produisent dans la méiose?',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('انقسامان متتاليان', True),
                    ('انقسام واحد', False),
                    ('ثلاثة انقسامات', False),
                    ('أربعة انقسامات', False)
                ]
            },
            {
                'text': 'ما هي أهمية التوالد الجنسي؟',
                'text_en': 'What is the importance of sexual reproduction?',
                'text_fr': 'Quelle est l\'importance de la reproduction sexuée?',
                'type': 'multiple_choice',
                'points': 10.0,
                'choices': [
                    ('زيادة التنوع الوراثي', True),
                    ('إنتاج أفراد جديدة', True),
                    ('الحفاظ على ثبات الصفات تماماً', False),
                    ('تقليل التكيف مع البيئة', False)
                ]
            }
        ]

        self.create_questions(ex1, questions_data)
        self.stdout.write(f'  Created 1 exercise with 5 questions for Lesson {lesson.id}')

    # ===== LESSON 107: Statistical Laws =====
    def create_statistical_laws_exercises(self, lesson):
        """Statistical laws of the transmission of hereditary traits"""

        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Mendel\'s Statistical Laws',
            title_arabic='قوانين مندل الإحصائية',
            description='Exercises on Mendel\'s laws of hereditary trait transmission / تمارين حول قوانين مندل لانتقال الصفات الوراثية',
            difficulty_level='intermediate',
            estimated_duration=30,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions_data = [
            {
                'text': 'ما هو قانون مندل الأول (قانون نقاوة الأمشاج)؟',
                'text_en': 'What is Mendel\'s First Law (Law of Segregation)?',
                'text_fr': 'Quelle est la première loi de Mendel (loi de ségrégation)?',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('انفصال الأليلات أثناء تكوين الأمشاج', True),
                    ('اقتران الصفات المتقابلة', False),
                    ('سيادة صفة على أخرى', False),
                    ('توزيع الصفات بشكل عشوائي', False)
                ]
            },
            {
                'text': 'في الجيل الأول (F1) من تزاوج فردين نقيين لصفة سائدة ومتنحية، النسبة المظهرية تكون:',
                'text_en': 'In the first generation (F1) from crossing two pure individuals for a dominant and recessive trait, the phenotypic ratio is:',
                'text_fr': 'Dans la première génération (F1) issue du croisement de deux individus purs pour un caractère dominant et récessif, le rapport phénotypique est:',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('100% تظهر الصفة السائدة', True),
                    ('50% سائدة و 50% متنحية', False),
                    ('75% سائدة و 25% متنحية', False),
                    ('100% تظهر الصفة المتنحية', False)
                ]
            },
            {
                'text': 'في الجيل الثاني (F2) من تزاوج أفراد F1، النسبة المظهرية تكون:',
                'text_en': 'In the second generation (F2) from crossing F1 individuals, the phenotypic ratio is:',
                'text_fr': 'Dans la deuxième génération (F2) issue du croisement des individus F1, le rapport phénotypique est:',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('3:1 (ثلاثة أرباع سائدة وربع متنحية)', True),
                    ('1:1', False),
                    ('2:1', False),
                    ('1:2:1', False)
                ]
            },
            {
                'text': 'ما هو التهجين الاختباري (Test-cross)؟',
                'text_en': 'What is a test-cross?',
                'text_fr': 'Qu\'est-ce qu\'un croisement-test?',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('تزاوج فرد مجهول الطراز الجيني مع فرد متنحي نقي', True),
                    ('تزاوج فردين سائدين نقيين', False),
                    ('تزاوج فردين متنحيين', False),
                    ('تزاوج فرد سائد مع فرد هجين', False)
                ]
            },
            {
                'text': 'الأليلات (Allèles) هي:',
                'text_en': 'Alleles are:',
                'text_fr': 'Les allèles sont:',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('أشكال مختلفة من نفس الجين', True),
                    ('جينات مختلفة لصفات مختلفة', False),
                    ('بروتينات في الخلية', False),
                    ('كروموسومات متماثلة', False)
                ]
            }
        ]

        self.create_questions(ex1, questions_data)
        self.stdout.write(f'  Created 1 exercise with 5 questions for Lesson {lesson.id}')

    # ===== LESSON 108: Human Genetics =====
    def create_human_genetics_exercises(self, lesson):
        """Human genetics"""

        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Human Genetics: Fundamentals',
            title_arabic='علم الوراثة البشرية: الأساسيات',
            description='Questions about fundamental concepts of human genetics / أسئلة حول المفاهيم الأساسية لعلم الوراثة البشرية',
            difficulty_level='intermediate',
            estimated_duration=30,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions_data = [
            {
                'text': 'كم عدد الكروموسومات في الخلية الجسدية البشرية؟',
                'text_en': 'How many chromosomes are in a human somatic cell?',
                'text_fr': 'Combien de chromosomes y a-t-il dans une cellule somatique humaine?',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('46 كروموسوم (23 زوج)', True),
                    ('23 كروموسوم', False),
                    ('48 كروموسوم', False),
                    ('92 كروموسوم', False)
                ]
            },
            {
                'text': 'ما هي الكروموسومات الجنسية في الإنسان؟',
                'text_en': 'What are the sex chromosomes in humans?',
                'text_fr': 'Quels sont les chromosomes sexuels chez l\'humain?',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('X و Y', True),
                    ('A و B', False),
                    ('M و F', False),
                    ('1 و 2', False)
                ]
            },
            {
                'text': 'الصيغة الصبغية للذكر البشري هي:',
                'text_en': 'The karyotype of a human male is:',
                'text_fr': 'Le caryotype d\'un homme est:',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('44+XY', True),
                    ('44+XX', False),
                    ('46+XY', False),
                    ('23+XY', False)
                ]
            },
            {
                'text': 'ما هي الأمراض الوراثية المرتبطة بالكروموسوم X؟',
                'text_en': 'What are X-linked genetic diseases?',
                'text_fr': 'Quelles sont les maladies génétiques liées au chromosome X?',
                'type': 'multiple_choice',
                'points': 10.0,
                'choices': [
                    ('عمى الألوان (Daltonisme)', True),
                    ('الناعور (Hémophilie)', True),
                    ('فقر الدم المنجلي', False),
                    ('التليف الكيسي', False)
                ]
            },
            {
                'text': 'شجرة النسب (Arbre généalogique) تستخدم لـ:',
                'text_en': 'A pedigree tree is used to:',
                'text_fr': 'Un arbre généalogique est utilisé pour:',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('تتبع انتقال الصفات الوراثية عبر الأجيال', True),
                    ('تصنيف الكائنات الحية', False),
                    ('قياس حجم الكروموسومات', False),
                    ('تحديد عمر الأفراد', False)
                ]
            }
        ]

        self.create_questions(ex1, questions_data)
        self.stdout.write(f'  Created 1 exercise with 5 questions for Lesson {lesson.id}')

    # ===== LESSON 109: Biometrics =====
    def create_biometrics_exercises(self, lesson):
        """Quantitative study of variation - Biometrics"""

        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Quantitative Study of Variation - Biometrics',
            title_arabic='الدراسة الكمية للتنوع - البيوميتريا',
            description='Exercises on fundamental concepts of biometrics / تمارين حول المفاهيم الأساسية للبيوميتريا',
            difficulty_level='intermediate',
            estimated_duration=30,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions_data = [
            {
                'text': 'البيوميتريا (Biométrie) هي:',
                'text_en': 'Biometrics is:',
                'text_fr': 'La biométrie est:',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('دراسة كمية للتنوع البيولوجي باستخدام الإحصاء', True),
                    ('دراسة الخلايا الحية', False),
                    ('تقنية لتعديل الجينات', False),
                    ('علم تصنيف الكائنات', False)
                ]
            },
            {
                'text': 'ما هو المتوسط الحسابي في البيوميتريا؟',
                'text_en': 'What is the arithmetic mean in biometrics?',
                'text_fr': 'Qu\'est-ce que la moyenne arithmétique en biométrie?',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('مجموع القيم مقسوم على عددها', True),
                    ('القيمة الأكثر تكراراً', False),
                    ('القيمة الوسطى في البيانات', False),
                    ('الفرق بين أكبر وأصغر قيمة', False)
                ]
            },
            {
                'text': 'الانحراف المعياري يقيس:',
                'text_en': 'Standard deviation measures:',
                'text_fr': 'L\'écart-type mesure:',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('تشتت القيم حول المتوسط', True),
                    ('القيمة الوسطى للبيانات', False),
                    ('عدد الأفراد في العينة', False),
                    ('نسبة الذكور إلى الإناث', False)
                ]
            },
            {
                'text': 'المنحنى الجرسي (Courbe de Gauss) يظهر:',
                'text_en': 'The bell curve (Gaussian curve) shows:',
                'text_fr': 'La courbe en cloche (courbe de Gauss) montre:',
                'type': 'single_choice',
                'points': 10.0,
                'choices': [
                    ('التوزيع الطبيعي للصفات في المجتمع', True),
                    ('النمو الأسي للخلايا', False),
                    ('تطور الكائنات عبر الزمن', False),
                    ('دورة الخلية', False)
                ]
            },
            {
                'text': 'أي من الصفات التالية تدرس بالبيوميتريا؟',
                'text_en': 'Which of the following traits is studied by biometrics?',
                'text_fr': 'Lequel des caractères suivants est étudié par la biométrie?',
                'type': 'multiple_choice',
                'points': 10.0,
                'choices': [
                    ('الطول عند الإنسان', True),
                    ('الوزن', True),
                    ('فصيلة الدم ABO', False),
                    ('لون العيون', False)
                ]
            }
        ]

        self.create_questions(ex1, questions_data)
        self.stdout.write(f'  Created 1 exercise with 5 questions for Lesson {lesson.id}')

    def create_questions(self, exercise, questions_data):
        """Helper method to create questions and choices"""
        for idx, q_data in enumerate(questions_data, 1):
            # Map type to correct format
            q_type = q_data['type']
            if q_type == 'single_choice':
                q_type = 'qcm_single'
            elif q_type == 'multiple_choice':
                q_type = 'qcm_multiple'

            question = Question.objects.create(
                exercise=exercise,
                question_text=f"{q_data['text_en']} / {q_data['text']}",
                question_text_arabic=q_data['text'],
                question_type=q_type,
                points=q_data['points'],
                order=idx
            )

            for choice_idx, (choice_text, is_correct) in enumerate(q_data['choices'], 1):
                QuestionChoice.objects.create(
                    question=question,
                    choice_text=choice_text,
                    is_correct=is_correct,
                    order=choice_idx
                )
