from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Create exercises for Lesson 106: Transmission of genetic information through sexual reproduction'

    def handle(self, *args, **options):
        lesson_id = 106

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
                'title': 'Sexual Reproduction Basics',
                'title_ar': 'أساسيات التكاثر الجنسي',
                'description': 'Understanding the fundamentals of sexual reproduction',
                'description_ar': 'فهم أساسيات التكاثر الجنسي',
                'difficulty': 'beginner',
                'points': 12,
                'questions': [
                    {
                        'text': 'What is sexual reproduction?',
                        'text_ar': 'ما هو التكاثر الجنسي؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Reproduction involving the fusion of two gametes', 'text_ar': 'تكاثر يتضمن اندماج خليتين جنسيتين (أمشاج)', 'is_correct': True},
                            {'text': 'Reproduction from a single parent', 'text_ar': 'تكاثر من والد واحد', 'is_correct': False},
                            {'text': 'Division of a cell into two identical cells', 'text_ar': 'انقسام خلية إلى خليتين متطابقتين', 'is_correct': False},
                            {'text': 'Cloning process', 'text_ar': 'عملية الاستنساخ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What are gametes?',
                        'text_ar': 'ما هي الأمشاج (gamètes)?',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Sex cells (sperm and egg)', 'text_ar': 'الخلايا الجنسية (الحيوانات المنوية والبويضات)', 'is_correct': True},
                            {'text': 'Body cells', 'text_ar': 'الخلايا الجسدية', 'is_correct': False},
                            {'text': 'Nerve cells', 'text_ar': 'الخلايا العصبية', 'is_correct': False},
                            {'text': 'Blood cells', 'text_ar': 'خلايا الدم', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Gametes are produced by which type of cell division?',
                        'text_ar': 'تُنتج الأمشاج بواسطة أي نوع من الانقسام الخلوي؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Meiosis', 'text_ar': 'الانقسام الاختزالي (méiose)', 'is_correct': True},
                            {'text': 'Mitosis', 'text_ar': 'الانقسام المتساوي (mitose)', 'is_correct': False},
                            {'text': 'Binary fission', 'text_ar': 'الانشطار الثنائي', 'is_correct': False},
                            {'text': 'Budding', 'text_ar': 'التبرعم', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is fertilization?',
                        'text_ar': 'ما هو الإخصاب (fécondation)?',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'The fusion of a sperm and egg to form a zygote', 'text_ar': 'اندماج حيوان منوي وبويضة لتكوين زيجوت', 'is_correct': True},
                            {'text': 'The production of gametes', 'text_ar': 'إنتاج الأمشاج', 'is_correct': False},
                            {'text': 'The division of a cell', 'text_ar': 'انقسام خلية', 'is_correct': False},
                            {'text': 'The death of a cell', 'text_ar': 'موت خلية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Sexual reproduction increases genetic diversity.',
                        'text_ar': 'التكاثر الجنسي يزيد التنوع الوراثي.',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which organisms use sexual reproduction?',
                        'text_ar': 'أي الكائنات تستخدم التكاثر الجنسي؟',
                        'type': 'qcm_multiple',
                        'points': 2,
                        'choices': [
                            {'text': 'Animals', 'text_ar': 'الحيوانات', 'is_correct': True},
                            {'text': 'Plants', 'text_ar': 'النباتات', 'is_correct': True},
                            {'text': 'Some fungi', 'text_ar': 'بعض الفطريات', 'is_correct': True},
                            {'text': 'All bacteria', 'text_ar': 'جميع البكتيريا', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Meiosis - The Reduction Division',
                'title_ar': 'الانقسام الاختزالي - انقسام الاختزال',
                'description': 'Understanding meiosis and chromosome reduction',
                'description_ar': 'فهم الانقسام الاختزالي واختزال الكروموسومات',
                'difficulty': 'intermediate',
                'points': 12,
                'questions': [
                    {
                        'text': 'What is meiosis?',
                        'text_ar': 'ما هو الانقسام الاختزالي (méiose)?',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'A type of cell division that produces four haploid cells from one diploid cell', 'text_ar': 'نوع من الانقسام الخلوي ينتج أربع خلايا أحادية من خلية ثنائية', 'is_correct': True},
                            {'text': 'Division producing two identical diploid cells', 'text_ar': 'انقسام ينتج خليتين ثنائيتين متطابقتين', 'is_correct': False},
                            {'text': 'Growth process of cells', 'text_ar': 'عملية نمو الخلايا', 'is_correct': False},
                            {'text': 'Cell death process', 'text_ar': 'عملية موت الخلايا', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'How many divisions occur in meiosis?',
                        'text_ar': 'كم عدد الانقسامات في الانقسام الاختزالي؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Two consecutive divisions (Meiosis I and Meiosis II)', 'text_ar': 'انقسامان متتاليان (الانقسام الاختزالي الأول والثاني)', 'is_correct': True},
                            {'text': 'One division', 'text_ar': 'انقسام واحد', 'is_correct': False},
                            {'text': 'Three divisions', 'text_ar': 'ثلاثة انقسامات', 'is_correct': False},
                            {'text': 'Four divisions', 'text_ar': 'أربعة انقسامات', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is a haploid cell?',
                        'text_ar': 'ما هي الخلية الأحادية (haploïde)?',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'A cell with half the normal number of chromosomes (n)', 'text_ar': 'خلية بنصف العدد الطبيعي من الكروموسومات (n)', 'is_correct': True},
                            {'text': 'A cell with the full number of chromosomes (2n)', 'text_ar': 'خلية بالعدد الكامل من الكروموسومات (2n)', 'is_correct': False},
                            {'text': 'A cell with double the chromosomes', 'text_ar': 'خلية بضعف الكروموسومات', 'is_correct': False},
                            {'text': 'A cell with no chromosomes', 'text_ar': 'خلية بدون كروموسومات', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is a diploid cell?',
                        'text_ar': 'ما هي الخلية الثنائية (diploïde)?',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'A cell with two complete sets of chromosomes (2n)', 'text_ar': 'خلية بمجموعتين كاملتين من الكروموسومات (2n)', 'is_correct': True},
                            {'text': 'A cell with one set of chromosomes (n)', 'text_ar': 'خلية بمجموعة واحدة من الكروموسومات (n)', 'is_correct': False},
                            {'text': 'A cell in the process of dividing', 'text_ar': 'خلية في عملية الانقسام', 'is_correct': False},
                            {'text': 'A mutated cell', 'text_ar': 'خلية متحورة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'If a diploid cell has 46 chromosomes (2n = 46), how many chromosomes will each gamete have after meiosis?',
                        'text_ar': 'إذا كان لدى خلية ثنائية 46 كروموسوماً (2n = 46)، كم كروموسوماً ستحتوي كل مشيج بعد الانقسام الاختزالي؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': '23 chromosomes (n = 23)', 'text_ar': '23 كروموسوماً (n = 23)', 'is_correct': True},
                            {'text': '46 chromosomes', 'text_ar': '46 كروموسوماً', 'is_correct': False},
                            {'text': '92 chromosomes', 'text_ar': '92 كروموسوماً', 'is_correct': False},
                            {'text': '12 chromosomes', 'text_ar': '12 كروموسوماً', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Crossing over (recombination) occurs during which phase of meiosis?',
                        'text_ar': 'يحدث العبور (إعادة التركيب) خلال أي طور من الانقسام الاختزالي؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Prophase I', 'text_ar': 'الطور التمهيدي الأول', 'is_correct': True},
                            {'text': 'Metaphase I', 'text_ar': 'الطور الاستوائي الأول', 'is_correct': False},
                            {'text': 'Anaphase II', 'text_ar': 'الطور الانفصالي الثاني', 'is_correct': False},
                            {'text': 'Telophase II', 'text_ar': 'الطور النهائي الثاني', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Fertilization and Zygote Formation',
                'title_ar': 'الإخصاب وتكوين الزيجوت',
                'description': 'Understanding fertilization and restoration of diploid number',
                'description_ar': 'فهم الإخصاب واستعادة العدد الثنائي',
                'difficulty': 'intermediate',
                'points': 12,
                'questions': [
                    {
                        'text': 'What is a zygote?',
                        'text_ar': 'ما هو الزيجوت (zygote)?',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'A fertilized egg; the first diploid cell of a new organism', 'text_ar': 'بويضة مخصبة؛ أول خلية ثنائية لكائن جديد', 'is_correct': True},
                            {'text': 'An unfertilized egg', 'text_ar': 'بويضة غير مخصبة', 'is_correct': False},
                            {'text': 'A sperm cell', 'text_ar': 'حيوان منوي', 'is_correct': False},
                            {'text': 'A body cell', 'text_ar': 'خلية جسدية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'During fertilization, the chromosome number is:',
                        'text_ar': 'خلال الإخصاب، عدد الكروموسومات:',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Restored to diploid (2n) from two haploid (n) gametes', 'text_ar': 'يُستعاد إلى الثنائي (2n) من خليتين أحاديتين (n)', 'is_correct': True},
                            {'text': 'Reduced to haploid', 'text_ar': 'يُختزل إلى أحادي', 'is_correct': False},
                            {'text': 'Doubled to 4n', 'text_ar': 'يتضاعف إلى 4n', 'is_correct': False},
                            {'text': 'Remains unchanged', 'text_ar': 'يبقى دون تغيير', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Where does fertilization typically occur in humans?',
                        'text_ar': 'أين يحدث الإخصاب عادة في البشر؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'In the fallopian tube (oviduct)', 'text_ar': 'في قناة فالوب', 'is_correct': True},
                            {'text': 'In the uterus', 'text_ar': 'في الرحم', 'is_correct': False},
                            {'text': 'In the ovary', 'text_ar': 'في المبيض', 'is_correct': False},
                            {'text': 'In the vagina', 'text_ar': 'في المهبل', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What happens after the zygote is formed?',
                        'text_ar': 'ماذا يحدث بعد تكوين الزيجوت؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'It undergoes mitotic divisions to form an embryo', 'text_ar': 'يخضع لانقسامات متساوية لتكوين جنين', 'is_correct': True},
                            {'text': 'It immediately becomes an adult', 'text_ar': 'يصبح بالغاً فوراً', 'is_correct': False},
                            {'text': 'It remains dormant forever', 'text_ar': 'يبقى خاملاً إلى الأبد', 'is_correct': False},
                            {'text': 'It dies', 'text_ar': 'يموت', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Each gamete contributes half of the genetic information to the offspring.',
                        'text_ar': 'كل مشيج يساهم بنصف المعلومات الوراثية للنسل.',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The zygote contains genetic material from:',
                        'text_ar': 'يحتوي الزيجوت على مواد وراثية من:',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Both parents (mother and father)', 'text_ar': 'كلا الوالدين (الأم والأب)', 'is_correct': True},
                            {'text': 'Only the mother', 'text_ar': 'الأم فقط', 'is_correct': False},
                            {'text': 'Only the father', 'text_ar': 'الأب فقط', 'is_correct': False},
                            {'text': 'Neither parent', 'text_ar': 'لا أحد من الوالدين', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Genetic Variation in Sexual Reproduction',
                'title_ar': 'التنوع الوراثي في التكاثر الجنسي',
                'description': 'How sexual reproduction creates genetic diversity',
                'description_ar': 'كيف يخلق التكاثر الجنسي التنوع الوراثي',
                'difficulty': 'advanced',
                'points': 12,
                'questions': [
                    {
                        'text': 'Which processes contribute to genetic variation in sexual reproduction?',
                        'text_ar': 'أي العمليات تساهم في التنوع الوراثي في التكاثر الجنسي؟',
                        'type': 'qcm_multiple',
                        'points': 2,
                        'choices': [
                            {'text': 'Independent assortment of chromosomes', 'text_ar': 'التوزيع المستقل للكروموسومات', 'is_correct': True},
                            {'text': 'Crossing over (recombination)', 'text_ar': 'العبور (إعادة التركيب)', 'is_correct': True},
                            {'text': 'Random fertilization', 'text_ar': 'الإخصاب العشوائي', 'is_correct': True},
                            {'text': 'Mitosis', 'text_ar': 'الانقسام المتساوي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is crossing over?',
                        'text_ar': 'ما هو العبور (crossing over)?',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Exchange of genetic material between homologous chromosomes during meiosis', 'text_ar': 'تبادل مواد وراثية بين الكروموسومات المتماثلة أثناء الانقسام الاختزالي', 'is_correct': True},
                            {'text': 'Separation of sister chromatids', 'text_ar': 'انفصال الكروماتيدات الشقيقة', 'is_correct': False},
                            {'text': 'Fusion of gametes', 'text_ar': 'اندماج الأمشاج', 'is_correct': False},
                            {'text': 'DNA replication', 'text_ar': 'تضاعف الحمض النووي', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Independent assortment means:',
                        'text_ar': 'التوزيع المستقل يعني:',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Chromosomes are randomly distributed into gametes', 'text_ar': 'الكروموسومات توزع عشوائياً في الأمشاج', 'is_correct': True},
                            {'text': 'All chromosomes go to one cell', 'text_ar': 'جميع الكروموسومات تذهب لخلية واحدة', 'is_correct': False},
                            {'text': 'Chromosomes are sorted by size', 'text_ar': 'الكروموسومات ترتب حسب الحجم', 'is_correct': False},
                            {'text': 'Chromosomes do not separate', 'text_ar': 'الكروموسومات لا تنفصل', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Why is genetic variation important for populations?',
                        'text_ar': 'لماذا التنوع الوراثي مهم للمجتمعات؟',
                        'type': 'qcm_multiple',
                        'points': 2,
                        'choices': [
                            {'text': 'Increases adaptability to environmental changes', 'text_ar': 'يزيد القدرة على التكيف مع التغيرات البيئية', 'is_correct': True},
                            {'text': 'Provides raw material for natural selection', 'text_ar': 'يوفر مادة خام للانتقاء الطبيعي', 'is_correct': True},
                            {'text': 'Reduces risk of genetic diseases spreading', 'text_ar': 'يقلل خطر انتشار الأمراض الوراثية', 'is_correct': True},
                            {'text': 'Makes all organisms identical', 'text_ar': 'يجعل جميع الكائنات متطابقة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Asexual reproduction produces more genetic variation than sexual reproduction.',
                        'text_ar': 'التكاثر اللاجنسي ينتج تنوعاً وراثياً أكثر من التكاثر الجنسي.',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': True},
                            {'text': 'True', 'text_ar': 'صحيح', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'If an organism has 4 pairs of chromosomes, how many different gamete combinations are possible through independent assortment alone (2^n)?',
                        'text_ar': 'إذا كان لدى كائن 4 أزواج من الكروموسومات، كم عدد تركيبات الأمشاج المختلفة الممكنة من خلال التوزيع المستقل فقط (2^n)؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': '16 different combinations (2^4)', 'text_ar': '16 تركيبة مختلفة (2^4)', 'is_correct': True},
                            {'text': '4 combinations', 'text_ar': '4 تركيبات', 'is_correct': False},
                            {'text': '8 combinations', 'text_ar': '8 تركيبات', 'is_correct': False},
                            {'text': '32 combinations', 'text_ar': '32 تركيبة', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Life Cycles and Alternation of Generations',
                'title_ar': 'دورات الحياة وتعاقب الأجيال',
                'description': 'Understanding life cycles in different organisms',
                'description_ar': 'فهم دورات الحياة في كائنات مختلفة',
                'difficulty': 'advanced',
                'points': 12,
                'questions': [
                    {
                        'text': 'In the human life cycle, which stage is haploid?',
                        'text_ar': 'في دورة حياة الإنسان، أي مرحلة أحادية؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Gametes (sperm and egg)', 'text_ar': 'الأمشاج (الحيوانات المنوية والبويضات)', 'is_correct': True},
                            {'text': 'Zygote', 'text_ar': 'الزيجوت', 'is_correct': False},
                            {'text': 'Adult organism', 'text_ar': 'الكائن البالغ', 'is_correct': False},
                            {'text': 'Embryo', 'text_ar': 'الجنين', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'In the human life cycle, which stage is diploid?',
                        'text_ar': 'في دورة حياة الإنسان، أي مرحلة ثنائية؟',
                        'type': 'qcm_multiple',
                        'points': 2,
                        'choices': [
                            {'text': 'Zygote', 'text_ar': 'الزيجوت', 'is_correct': True},
                            {'text': 'Embryo', 'text_ar': 'الجنين', 'is_correct': True},
                            {'text': 'Adult organism', 'text_ar': 'الكائن البالغ', 'is_correct': True},
                            {'text': 'Gametes', 'text_ar': 'الأمشاج', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the function of meiosis in the life cycle?',
                        'text_ar': 'ما هي وظيفة الانقسام الاختزالي في دورة الحياة؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'To reduce chromosome number and produce gametes', 'text_ar': 'لتقليل عدد الكروموسومات وإنتاج الأمشاج', 'is_correct': True},
                            {'text': 'To increase chromosome number', 'text_ar': 'لزيادة عدد الكروموسومات', 'is_correct': False},
                            {'text': 'To grow body tissues', 'text_ar': 'لنمو أنسجة الجسم', 'is_correct': False},
                            {'text': 'To repair damaged cells', 'text_ar': 'لإصلاح الخلايا التالفة', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the function of fertilization in the life cycle?',
                        'text_ar': 'ما هي وظيفة الإخصاب في دورة الحياة؟',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'To restore diploid number and combine genetic material from two parents', 'text_ar': 'لاستعادة العدد الثنائي ودمج مواد وراثية من والدين', 'is_correct': True},
                            {'text': 'To reduce chromosome number', 'text_ar': 'لتقليل عدد الكروموسومات', 'is_correct': False},
                            {'text': 'To produce gametes', 'text_ar': 'لإنتاج الأمشاج', 'is_correct': False},
                            {'text': 'To kill cells', 'text_ar': 'لقتل الخلايا', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'In plants with alternation of generations, the sporophyte generation is:',
                        'text_ar': 'في النباتات ذات تعاقب الأجيال، جيل الطور البوغي هو:',
                        'type': 'qcm_single',
                        'points': 2,
                        'choices': [
                            {'text': 'Diploid (2n)', 'text_ar': 'ثنائي (2n)', 'is_correct': True},
                            {'text': 'Haploid (n)', 'text_ar': 'أحادي (n)', 'is_correct': False},
                            {'text': 'Triploid (3n)', 'text_ar': 'ثلاثي (3n)', 'is_correct': False},
                            {'text': 'Polyploid', 'text_ar': 'متعدد المجموعات الكروموسومية', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'The primary purpose of sexual reproduction is to maintain chromosome number across generations.',
                        'text_ar': 'الهدف الأساسي للتكاثر الجنسي هو الحفاظ على عدد الكروموسومات عبر الأجيال.',
                        'type': 'true_false',
                        'points': 2,
                        'choices': [
                            {'text': 'True (through the alternation of meiosis and fertilization)', 'text_ar': 'صحيح (من خلال تعاقب الانقسام الاختزالي والإخصاب)', 'is_correct': True},
                            {'text': 'False', 'text_ar': 'خطأ', 'is_correct': False}
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

        self.stdout.write(self.style.SUCCESS(f'Successfully created {len(exercises_data)} exercises with 30 questions total for Lesson {lesson_id}'))
