from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice

User = get_user_model()

class Command(BaseCommand):
    help = 'Create exercises for Batch 18: Third Year Middle School Physics (Lesson IDs: 1642-1651)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises before creating new ones',
        )

    def handle(self, *args, **options):
        lesson_ids = range(1642, 1652)  # 1642-1651

        # Get admin user for created_by
        self.admin_user = User.objects.filter(is_superuser=True).first()
        if not self.admin_user:
            self.stdout.write(self.style.ERROR('No superuser found'))
            return

        with transaction.atomic():
            for lesson_id in lesson_ids:
                try:
                    lesson = Lesson.objects.get(id=lesson_id)
                    self.stdout.write(f'\nProcessing Lesson ID {lesson_id}: {lesson.title}')

                    if options['delete_existing']:
                        count = Exercise.objects.filter(lesson=lesson).count()
                        Exercise.objects.filter(lesson=lesson).delete()
                        self.stdout.write(self.style.WARNING(f'  Deleted {count} existing exercises'))

                    self.create_exercises_for_lesson(lesson)

                except Lesson.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f'  Lesson ID {lesson_id} not found'))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'  Error: {str(e)[:100]}'))

        self.stdout.write(self.style.SUCCESS('\nBatch 18 exercises created successfully'))

    def create_exercises_for_lesson(self, lesson):
        """Create exercises based on lesson ID"""
        exercises_map = {
            1642: self.create_materials_objects_exercises,
            1643: self.create_daily_materials_exercises,
            1644: self.create_materials_electricity_exercises,
            1645: self.create_atoms_ions_exercises,
            1646: self.create_metal_oxidation_exercises,
            1647: self.create_organic_oxidation_exercises,
            1648: self.create_acidic_basic_exercises,
            1649: self.create_reactions_exercises,
            1650: self.create_ion_tests_exercises,
            1651: self.create_material_dangers_exercises,
        }

        func = exercises_map.get(lesson.id)
        if func:
            func(lesson)

    def create_materials_objects_exercises(self, lesson):
        """ID 1642: Materials and Objects"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Materials and Objects - Fundamentals',
            title_arabic='المواد والأجسام - الأساسيات',
            description='Basic exercises on materials and objects',
            difficulty_level='beginner',
            estimated_duration=20,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'المادة هي:',
                'text_en': 'Matter is:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('كل ما له كتلة ويشغل حيزاً من الفراغ', True),
                    ('الطاقة الموجودة في الجسم', False),
                    ('شكل الجسم الخارجي فقط', False),
                    ('لون الجسم', False)
                ]
            },
            {
                'text_ar': 'أي مما يلي يعتبر خاصية فيزيائية للمادة؟',
                'text_en': 'Which of the following is a physical property of matter?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الكثافة', True),
                    ('القابلية للاشتعال', False),
                    ('التفاعل مع الأحماض', False),
                    ('القابلية للأكسدة', False)
                ]
            },
            {
                'text_ar': 'حالات المادة الأساسية هي:',
                'text_en': 'The basic states of matter are:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('صلبة', True),
                    ('سائلة', True),
                    ('غازية', True),
                    ('مضيئة', False)
                ]
            },
            {
                'text_ar': 'الكتلة الحجمية (الكثافة) تساوي:',
                'text_en': 'Density equals:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الكتلة / الحجم', True),
                    ('الحجم / الكتلة', False),
                    ('الكتلة × الحجم', False),
                    ('الحجم - الكتلة', False)
                ]
            },
            {
                'text_ar': 'أي من المواد التالية لها كثافة أكبر من الماء؟',
                'text_en': 'Which of the following materials has a density greater than water?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الحديد', True),
                    ('الخشب', False),
                    ('الفلين', False),
                    ('الزيت', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_daily_materials_exercises(self, lesson):
        """ID 1643: Examples of Materials Used in Daily Life"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Materials in Daily Life',
            title_arabic='المواد في الحياة اليومية',
            description='Exercises on everyday materials and their uses',
            difficulty_level='beginner',
            estimated_duration=20,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'أي من المواد التالية يُستخدم في صناعة الأسلاك الكهربائية؟',
                'text_en': 'Which material is used to make electrical wires?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('النحاس', True),
                    ('الخشب', False),
                    ('الزجاج', False),
                    ('البلاستيك', False)
                ]
            },
            {
                'text_ar': 'البلاستيك يُستخدم بكثرة لأنه:',
                'text_en': 'Plastic is widely used because it is:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('خفيف الوزن', True),
                    ('غير موصل للكهرباء', True),
                    ('رخيص الثمن', True),
                    ('موصل جيد للحرارة', False)
                ]
            },
            {
                'text_ar': 'الزجاج يتميز بأنه:',
                'text_en': 'Glass is characterized by being:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('شفاف وصلب', True),
                    ('مرن وقابل للطي', False),
                    ('موصل للكهرباء', False),
                    ('خفيف جداً', False)
                ]
            },
            {
                'text_ar': 'المعادن تُستخدم في البناء لأنها:',
                'text_en': 'Metals are used in construction because they are:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('صلبة ومتينة', True),
                    ('شفافة', False),
                    ('خفيفة جداً', False),
                    ('عازلة للحرارة', False)
                ]
            },
            {
                'text_ar': 'القطن والصوف يُستخدمان في صناعة:',
                'text_en': 'Cotton and wool are used to make:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الملابس', True),
                    ('الأسلاك الكهربائية', False),
                    ('الأواني', False),
                    ('أدوات البناء', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_materials_electricity_exercises(self, lesson):
        """ID 1644: Materials and Electricity"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Materials and Electrical Conductivity',
            title_arabic='المواد والموصلية الكهربائية',
            description='Exercises on electrical conductivity of materials',
            difficulty_level='intermediate',
            estimated_duration=25,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'الموصل الكهربائي هو مادة:',
                'text_en': 'An electrical conductor is a material that:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('تسمح بمرور التيار الكهربائي', True),
                    ('تمنع مرور التيار الكهربائي', False),
                    ('تنتج الكهرباء', False),
                    ('تخزن الطاقة الكهربائية', False)
                ]
            },
            {
                'text_ar': 'أي من المواد التالية موصل جيد للكهرباء؟',
                'text_en': 'Which of the following materials is a good electrical conductor?',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('الألومنيوم', True),
                    ('النحاس', True),
                    ('الحديد', True),
                    ('البلاستيك', False)
                ]
            },
            {
                'text_ar': 'العازل الكهربائي هو:',
                'text_en': 'An electrical insulator is:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('مادة لا توصل الكهرباء', True),
                    ('مادة توصل الكهرباء بشكل ضعيف', False),
                    ('مادة تنتج الكهرباء', False),
                    ('مادة تخزن الكهرباء', False)
                ]
            },
            {
                'text_ar': 'لماذا نستخدم البلاستيك لتغطية الأسلاك الكهربائية؟',
                'text_en': 'Why do we use plastic to cover electrical wires?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('لأنه عازل كهربائي يمنع الصدمات', True),
                    ('لأنه موصل للكهرباء', False),
                    ('لأنه يزيد من التوصيل', False),
                    ('لتجميل السلك فقط', False)
                ]
            },
            {
                'text_ar': 'الماء النقي يُعتبر:',
                'text_en': 'Pure water is considered:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('عازل كهربائي ضعيف', True),
                    ('موصل جيد للكهرباء', False),
                    ('موصل ممتاز للكهرباء', False),
                    ('لا يتأثر بالكهرباء', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_atoms_ions_exercises(self, lesson):
        """ID 1645: Atoms and Ions"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Atoms and Ions - Basics',
            title_arabic='الذرات والأيونات - الأساسيات',
            description='Fundamental exercises on atoms and ions',
            difficulty_level='intermediate',
            estimated_duration=30,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'الذرة هي:',
                'text_en': 'An atom is:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('أصغر جزء من العنصر يحتفظ بخصائصه', True),
                    ('جزيء مركب', False),
                    ('مجموعة من الجزيئات', False),
                    ('نوع من الطاقة', False)
                ]
            },
            {
                'text_ar': 'الذرة تتكون من:',
                'text_en': 'An atom consists of:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('نواة موجبة الشحنة', True),
                    ('إلكترونات سالبة الشحنة', True),
                    ('بروتونات ونيوترونات في النواة', True),
                    ('طاقة فقط', False)
                ]
            },
            {
                'text_ar': 'الأيون هو:',
                'text_en': 'An ion is:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('ذرة أو مجموعة ذرات مشحونة كهربائياً', True),
                    ('ذرة متعادلة', False),
                    ('جزيء متعادل', False),
                    ('إلكترون حر', False)
                ]
            },
            {
                'text_ar': 'الأيون الموجب (الكاتيون) يتكون عندما:',
                'text_en': 'A positive ion (cation) forms when:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('تفقد الذرة إلكتروناً أو أكثر', True),
                    ('تكتسب الذرة إلكتروناً أو أكثر', False),
                    ('تبقى الذرة متعادلة', False),
                    ('تنقسم الذرة', False)
                ]
            },
            {
                'text_ar': 'أي من الرموز التالية يمثل أيوناً سالباً؟',
                'text_en': 'Which of the following symbols represents a negative ion?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('Cl⁻', True),
                    ('Na⁺', False),
                    ('Ca²⁺', False),
                    ('Al³⁺', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_metal_oxidation_exercises(self, lesson):
        """ID 1646: Oxidation of Metals in Air"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Oxidation of Metals in Air',
            title_arabic='أكسدة المعادن في الهواء',
            description='Exercises on metal oxidation processes',
            difficulty_level='intermediate',
            estimated_duration=25,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'أكسدة المعادن هي:',
                'text_en': 'Oxidation of metals is:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('تفاعل المعدن مع الأكسجين', True),
                    ('ذوبان المعدن في الماء', False),
                    ('تبخر المعدن', False),
                    ('انصهار المعدن', False)
                ]
            },
            {
                'text_ar': 'عند أكسدة الحديد في الهواء الرطب ينتج:',
                'text_en': 'When iron oxidizes in moist air, it produces:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الصدأ (أكسيد الحديد)', True),
                    ('الماء', False),
                    ('ثاني أكسيد الكربون', False),
                    ('الهيدروجين', False)
                ]
            },
            {
                'text_ar': 'أي من المعادن التالية يتأكسد بسرعة في الهواء؟',
                'text_en': 'Which of the following metals oxidizes quickly in air?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الصوديوم', True),
                    ('الذهب', False),
                    ('الفضة', False),
                    ('البلاتين', False)
                ]
            },
            {
                'text_ar': 'لحماية المعادن من الأكسدة يمكن:',
                'text_en': 'To protect metals from oxidation, we can:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('طلاؤها بالدهان', True),
                    ('تغطيتها بطبقة من الزيت', True),
                    ('تركها معرضة للهواء والرطوبة', False),
                    ('تسخينها باستمرار', False)
                ]
            },
            {
                'text_ar': 'النحاس عند تعرضه للهواء لفترة طويلة يتكون على سطحه:',
                'text_en': 'When copper is exposed to air for a long time, it forms on its surface:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('طبقة خضراء من أكسيد النحاس', True),
                    ('طبقة حمراء', False),
                    ('طبقة بيضاء', False),
                    ('لا يتغير', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_organic_oxidation_exercises(self, lesson):
        """ID 1647: Reactions of Organic Materials with Oxygen"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Oxidation of Organic Materials',
            title_arabic='أكسدة المواد العضوية',
            description='Exercises on organic material oxidation',
            difficulty_level='intermediate',
            estimated_duration=25,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'المواد العضوية تحتوي أساساً على عنصر:',
                'text_en': 'Organic materials mainly contain the element:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الكربون', True),
                    ('الحديد', False),
                    ('النحاس', False),
                    ('الصوديوم', False)
                ]
            },
            {
                'text_ar': 'عند احتراق المواد العضوية ينتج:',
                'text_en': 'When organic materials burn, they produce:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('ثاني أكسيد الكربون', True),
                    ('بخار الماء', True),
                    ('طاقة حرارية', True),
                    ('الأكسجين', False)
                ]
            },
            {
                'text_ar': 'ثاني أكسيد الكربون الناتج عن الاحتراق يمكن الكشف عنه باستخدام:',
                'text_en': 'Carbon dioxide produced by combustion can be detected using:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('ماء الجير (يعكر ماء الجير)', True),
                    ('الماء المقطر', False),
                    ('المحلول الملحي', False),
                    ('الحمض', False)
                ]
            },
            {
                'text_ar': 'أي من المواد التالية عضوية؟',
                'text_en': 'Which of the following is an organic material?',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('الخشب', True),
                    ('الورق', True),
                    ('البلاستيك', True),
                    ('الحديد', False)
                ]
            },
            {
                'text_ar': 'الاحتراق الكامل للمواد العضوية يتطلب:',
                'text_en': 'Complete combustion of organic materials requires:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('كمية كافية من الأكسجين', True),
                    ('غياب الأكسجين', False),
                    ('درجة حرارة منخفضة', False),
                    ('وجود الماء', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_acidic_basic_exercises(self, lesson):
        """ID 1648: Acidic and Basic Solutions"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Acidic and Basic Solutions',
            title_arabic='المحاليل الحمضية والقاعدية',
            description='Exercises on acids and bases',
            difficulty_level='intermediate',
            estimated_duration=30,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'المحلول الحمضي له طعم:',
                'text_en': 'An acidic solution has a taste that is:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('حامض (لاذع)', True),
                    ('حلو', False),
                    ('مالح', False),
                    ('بلا طعم', False)
                ]
            },
            {
                'text_ar': 'ورق عباد الشمس الأزرق يتحول إلى اللون الأحمر في وجود:',
                'text_en': 'Blue litmus paper turns red in the presence of:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('محلول حمضي', True),
                    ('محلول قاعدي', False),
                    ('محلول متعادل', False),
                    ('الماء المقطر', False)
                ]
            },
            {
                'text_ar': 'المحاليل القاعدية (القلوية) تكون:',
                'text_en': 'Basic (alkaline) solutions are:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('صابونية الملمس', True),
                    ('خشنة الملمس', False),
                    ('لزجة', False),
                    ('صلبة', False)
                ]
            },
            {
                'text_ar': 'أي من المواد التالية حمضية؟',
                'text_en': 'Which of the following is acidic?',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('عصير الليمون', True),
                    ('الخل', True),
                    ('الصابون', False),
                    ('ماء الجافيل', False)
                ]
            },
            {
                'text_ar': 'قيمة pH للمحلول المتعادل هي:',
                'text_en': 'The pH value of a neutral solution is:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('7', True),
                    ('0', False),
                    ('14', False),
                    ('3', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_reactions_exercises(self, lesson):
        """ID 1649: Reactions of Materials with Acidic and Basic Solutions"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Chemical Reactions with Acids and Bases',
            title_arabic='التفاعلات الكيميائية مع الأحماض والقواعد',
            description='Exercises on chemical reactions',
            difficulty_level='intermediate',
            estimated_duration=30,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'عند تفاعل معدن مع حمض ينتج:',
                'text_en': 'When a metal reacts with an acid, it produces:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('ملح وغاز الهيدروجين', True),
                    ('ماء فقط', False),
                    ('أكسجين', False),
                    ('ثاني أكسيد الكربون', False)
                ]
            },
            {
                'text_ar': 'الزنك يتفاعل مع حمض الكلوريدريك لينتج:',
                'text_en': 'Zinc reacts with hydrochloric acid to produce:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('كلوريد الزنك وغاز الهيدروجين', True),
                    ('أكسيد الزنك والماء', False),
                    ('هيدروكسيد الزنك', False),
                    ('ثاني أكسيد الكربون', False)
                ]
            },
            {
                'text_ar': 'تفاعل حمض مع قاعدة يسمى:',
                'text_en': 'The reaction of an acid with a base is called:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('تعادل (Neutralisation)', True),
                    ('أكسدة', False),
                    ('احتراق', False),
                    ('تحلل', False)
                ]
            },
            {
                'text_ar': 'عند تعادل حمض مع قاعدة ينتج:',
                'text_en': 'When an acid neutralizes with a base, it produces:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('ملح وماء', True),
                    ('ملح وهيدروجين', False),
                    ('أكسجين وماء', False),
                    ('حمض جديد', False)
                ]
            },
            {
                'text_ar': 'أي من المعادن التالية يتفاعل مع الأحماض؟',
                'text_en': 'Which of the following metals reacts with acids?',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('الزنك', True),
                    ('الحديد', True),
                    ('الألومنيوم', True),
                    ('الذهب', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_ion_tests_exercises(self, lesson):
        """ID 1650: Tests for Detecting Some Ions"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Ion Detection Tests',
            title_arabic='اختبارات الكشف عن الأيونات',
            description='Exercises on chemical tests for ions',
            difficulty_level='intermediate',
            estimated_duration=25,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'للكشف عن أيون الكلور (Cl⁻) نستخدم:',
                'text_en': 'To detect chloride ions (Cl⁻), we use:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('نترات الفضة (يتكون راسب أبيض)', True),
                    ('محلول الصودا', False),
                    ('حمض الكبريتيك', False),
                    ('ماء الجير', False)
                ]
            },
            {
                'text_ar': 'للكشف عن أيون الحديد Fe³⁺ نستخدم:',
                'text_en': 'To detect iron(III) ions Fe³⁺, we use:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('محلول الصودا (يتكون راسب بني محمر)', True),
                    ('نترات الفضة', False),
                    ('ماء الجير', False),
                    ('حمض الكلوريدريك', False)
                ]
            },
            {
                'text_ar': 'للكشف عن أيون النحاس Cu²⁺ نستخدم:',
                'text_en': 'To detect copper ions Cu²⁺, we use:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('محلول الصودا (يتكون راسب أزرق)', True),
                    ('نترات الفضة', False),
                    ('الخل', False),
                    ('الماء المقطر', False)
                ]
            },
            {
                'text_ar': 'أيون الكبريتات SO₄²⁻ يُكشف عنه بـ:',
                'text_en': 'Sulfate ions SO₄²⁻ are detected with:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('كلوريد الباريوم (يتكون راسب أبيض)', True),
                    ('نترات الفضة', False),
                    ('محلول الصودا', False),
                    ('ماء الجير', False)
                ]
            },
            {
                'text_ar': 'الراسب هو:',
                'text_en': 'A precipitate is:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('مادة صلبة تتكون وتترسب في المحلول', True),
                    ('غاز يتصاعد', False),
                    ('سائل يطفو', False),
                    ('تغير في اللون فقط', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_material_dangers_exercises(self, lesson):
        """ID 1651: Danger of Materials on Health and Environment"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Material Safety and Environmental Impact',
            title_arabic='سلامة المواد وتأثيرها البيئي',
            description='Exercises on material safety and environmental hazards',
            difficulty_level='beginner',
            estimated_duration=25,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'أي من المواد التالية خطرة على الصحة؟',
                'text_en': 'Which of the following materials is dangerous to health?',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('الأحماض المركزة', True),
                    ('القواعد القوية', True),
                    ('المواد القابلة للاشتعال', True),
                    ('الماء', False)
                ]
            },
            {
                'text_ar': 'عند استخدام المواد الكيميائية يجب:',
                'text_en': 'When using chemical materials, one should:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('ارتداء القفازات والنظارات الواقية', True),
                    ('قراءة التعليمات والتحذيرات', True),
                    ('العمل في مكان جيد التهوية', True),
                    ('شم المواد مباشرة', False)
                ]
            },
            {
                'text_ar': 'البلاستيك خطر على البيئة لأنه:',
                'text_en': 'Plastic is dangerous to the environment because it:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('لا يتحلل بسهولة ويبقى لسنوات طويلة', True),
                    ('يذوب في الماء', False),
                    ('يتبخر بسرعة', False),
                    ('يتحول إلى سماد', False)
                ]
            },
            {
                'text_ar': 'الرموز الموجودة على عبوات المواد الكيميائية تدل على:',
                'text_en': 'Symbols on chemical containers indicate:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('درجة خطورة المادة ونوع الخطر', True),
                    ('سعر المادة', False),
                    ('لون المادة', False),
                    ('تاريخ الإنتاج فقط', False)
                ]
            },
            {
                'text_ar': 'للحفاظ على البيئة يجب:',
                'text_en': 'To protect the environment, we should:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('إعادة تدوير المواد', True),
                    ('التقليل من استخدام البلاستيك', True),
                    ('التخلص الآمن من النفايات الكيميائية', True),
                    ('رمي النفايات في الطبيعة', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_questions(self, exercise, questions):
        """Helper method to create questions and choices"""
        for idx, q_data in enumerate(questions, 1):
            question = Question.objects.create(
                exercise=exercise,
                question_text=f"{q_data['text_en']} / {q_data['text_ar']}",
                question_text_arabic=q_data['text_ar'],
                question_type=q_data['type'],
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
