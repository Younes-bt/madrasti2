from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice

User = get_user_model()

class Command(BaseCommand):
    help = 'Create exercises for Batch 19: Third Year Middle School Biology (Lesson IDs: 1774-1783)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises before creating new ones',
        )

    def handle(self, *args, **options):
        lesson_ids = range(1774, 1784)  # 1774-1783

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

        self.stdout.write(self.style.SUCCESS('\nBatch 19 exercises created successfully'))

    def create_exercises_for_lesson(self, lesson):
        """Create exercises based on lesson ID"""
        exercises_map = {
            1774: self.create_digestion_exercises,
            1775: self.create_excretion_exercises,
            1776: self.create_nervous_system_exercises,
            1777: self.create_muscular_system_exercises,
            1778: self.create_circulation_exercises,
            1779: self.create_respiration_exercises,
            1780: self.create_blood_system_exercises,
            1781: self.create_human_respiration_exercises,
            1782: self.create_nutrition_exercises,
            1783: self.create_body_health_exercises,
        }

        func = exercises_map.get(lesson.id)
        if func:
            func(lesson)

    def create_digestion_exercises(self, lesson):
        """ID 1774: Digestion and Absorption"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Digestion and Absorption Processes',
            title_arabic='عمليات الهضم والامتصاص',
            description='Exercises on digestive system',
            difficulty_level='intermediate',
            estimated_duration=30,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'الهضم هو:',
                'text_en': 'Digestion is:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('تحويل الغذاء إلى جزيئات صغيرة قابلة للامتصاص', True),
                    ('امتصاص الماء فقط', False),
                    ('طرح الفضلات', False),
                    ('تخزين الطعام', False)
                ]
            },
            {
                'text_ar': 'أين يبدأ الهضم في جسم الإنسان؟',
                'text_en': 'Where does digestion begin in the human body?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الفم', True),
                    ('المعدة', False),
                    ('الأمعاء الدقيقة', False),
                    ('الأمعاء الغليظة', False)
                ]
            },
            {
                'text_ar': 'دور اللعاب في الفم هو:',
                'text_en': 'The role of saliva in the mouth is:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('بدء هضم النشويات (السكريات المعقدة)', True),
                    ('هضم البروتينات', False),
                    ('هضم الدهون', False),
                    ('امتصاص الفيتامينات', False)
                ]
            },
            {
                'text_ar': 'أين يتم امتصاص معظم المواد الغذائية؟',
                'text_en': 'Where is most nutrient absorption?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الأمعاء الدقيقة', True),
                    ('المعدة', False),
                    ('الفم', False),
                    ('الأمعاء الغليظة', False)
                ]
            },
            {
                'text_ar': 'أعضاء الجهاز الهضمي تشمل:',
                'text_en': 'Digestive system organs include:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('الفم والمريء', True),
                    ('المعدة والأمعاء', True),
                    ('الكبد والبنكرياس', True),
                    ('القلب والرئتان', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_excretion_exercises(self, lesson):
        """ID 1775: Urinary Excretion"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Urinary Excretion System',
            title_arabic='الإطراح البولي',
            description='Exercises on urinary system',
            difficulty_level='intermediate',
            estimated_duration=25,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'الإطراح هو:',
                'text_en': 'Excretion is:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('التخلص من الفضلات والمواد السامة', True),
                    ('امتصاص الغذاء', False),
                    ('تخزين الطاقة', False),
                    ('نقل الأكسجين', False)
                ]
            },
            {
                'text_ar': 'الكليتان تقومان بـ:',
                'text_en': 'The kidneys function to:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('تصفية الدم وإزالة الفضلات', True),
                    ('هضم الطعام', False),
                    ('إنتاج خلايا الدم', False),
                    ('تخزين البول', False)
                ]
            },
            {
                'text_ar': 'البول يتكون أساساً من:',
                'text_en': 'Urine is mainly composed of:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الماء واليوريا والأملاح', True),
                    ('البروتينات والدهون', False),
                    ('السكريات فقط', False),
                    ('الفيتامينات', False)
                ]
            },
            {
                'text_ar': 'المثانة تقوم بـ:',
                'text_en': 'The bladder functions to:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('تخزين البول قبل الإطراح', True),
                    ('تصفية الدم', False),
                    ('إنتاج البول', False),
                    ('امتصاص الماء', False)
                ]
            },
            {
                'text_ar': 'الجهاز البولي يتكون من:',
                'text_en': 'The urinary system consists of:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('كليتان', True),
                    ('حالبان ومثانة', True),
                    ('إحليل', True),
                    ('قلب ورئتان', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_nervous_system_exercises(self, lesson):
        """ID 1776: Nervous System"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='The Nervous System',
            title_arabic='الجهاز العصبي',
            description='Exercises on nervous system',
            difficulty_level='intermediate',
            estimated_duration=30,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'الجهاز العصبي مسؤول عن:',
                'text_en': 'The nervous system is responsible for:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('التحكم في حركة الجسم', True),
                    ('استقبال المعلومات من الحواس', True),
                    ('تنسيق وظائف الأعضاء', True),
                    ('هضم الطعام', False)
                ]
            },
            {
                'text_ar': 'الدماغ هو مركز:',
                'text_en': 'The brain is the center of:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('التفكير والتنسيق والتحكم', True),
                    ('الهضم فقط', False),
                    ('الإطراح', False),
                    ('التنفس فقط', False)
                ]
            },
            {
                'text_ar': 'الحبل الشوكي يمتد:',
                'text_en': 'The spinal cord extends:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('داخل العمود الفقري', True),
                    ('في الدماغ', False),
                    ('في القلب', False),
                    ('في الأمعاء', False)
                ]
            },
            {
                'text_ar': 'الأعصاب تنقل:',
                'text_en': 'Nerves transmit:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الإشارات الكهربائية بين الدماغ والجسم', True),
                    ('الدم', False),
                    ('الهواء', False),
                    ('الطعام', False)
                ]
            },
            {
                'text_ar': 'أجزاء الجهاز العصبي تشمل:',
                'text_en': 'Parts of the nervous system include:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('الدماغ', True),
                    ('الحبل الشوكي', True),
                    ('الأعصاب', True),
                    ('القلب', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_muscular_system_exercises(self, lesson):
        """ID 1777: Muscular System"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='The Muscular System',
            title_arabic='الجهاز العضلي',
            description='Exercises on muscular system',
            difficulty_level='intermediate',
            estimated_duration=25,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'العضلات مسؤولة عن:',
                'text_en': 'Muscles are responsible for:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الحركة والتنقل', True),
                    ('الهضم فقط', False),
                    ('التنفس فقط', False),
                    ('التفكير', False)
                ]
            },
            {
                'text_ar': 'أنواع العضلات في جسم الإنسان:',
                'text_en': 'Types of muscles in the human body:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('عضلات إرادية (هيكلية)', True),
                    ('عضلات لا إرادية (ملساء)', True),
                    ('عضلة القلب', True),
                    ('عضلات دماغية', False)
                ]
            },
            {
                'text_ar': 'العضلات الإرادية هي التي:',
                'text_en': 'Voluntary muscles are those that:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('نتحكم فيها بإرادتنا', True),
                    ('تعمل تلقائياً دون تحكم', False),
                    ('موجودة في القلب فقط', False),
                    ('لا تتحرك أبداً', False)
                ]
            },
            {
                'text_ar': 'العضلات ترتبط بالعظام عن طريق:',
                'text_en': 'Muscles attach to bones via:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الأوتار', True),
                    ('الأعصاب', False),
                    ('الأوعية الدموية', False),
                    ('الغضاريف', False)
                ]
            },
            {
                'text_ar': 'عضلة القلب تتميز بأنها:',
                'text_en': 'Cardiac muscle is characterized by being:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('لا إرادية وتعمل باستمرار', True),
                    ('إرادية', False),
                    ('لا تتحرك', False),
                    ('موجودة في الذراعين', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_circulation_exercises(self, lesson):
        """ID 1778: Blood Circulation"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Blood Circulation System',
            title_arabic='الدورة الدموية',
            description='Exercises on blood circulation',
            difficulty_level='intermediate',
            estimated_duration=30,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'القلب يقوم بـ:',
                'text_en': 'The heart functions to:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('ضخ الدم إلى جميع أنحاء الجسم', True),
                    ('تنقية الهواء', False),
                    ('هضم الطعام', False),
                    ('تخزين الدم', False)
                ]
            },
            {
                'text_ar': 'الدورة الدموية الكبرى تنقل الدم:',
                'text_en': 'The systemic circulation transports blood:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('من القلب إلى جميع أعضاء الجسم', True),
                    ('من القلب إلى الرئتين فقط', False),
                    ('من الكبد إلى المعدة', False),
                    ('من الدماغ إلى القدمين', False)
                ]
            },
            {
                'text_ar': 'الدورة الدموية الصغرى تنقل الدم:',
                'text_en': 'Pulmonary circulation transports blood:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('بين القلب والرئتين', True),
                    ('من القلب إلى الدماغ', False),
                    ('من الكبد إلى الأمعاء', False),
                    ('من الكلى إلى المثانة', False)
                ]
            },
            {
                'text_ar': 'الشرايين تحمل الدم:',
                'text_en': 'Arteries carry blood:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('من القلب إلى الأعضاء', True),
                    ('من الأعضاء إلى القلب', False),
                    ('داخل القلب فقط', False),
                    ('في الدماغ فقط', False)
                ]
            },
            {
                'text_ar': 'الأوردة تحمل الدم:',
                'text_en': 'Veins carry blood:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('من الأعضاء إلى القلب', True),
                    ('من القلب إلى الأعضاء', False),
                    ('في الرئتين فقط', False),
                    ('لا تحمل دماً', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_respiration_exercises(self, lesson):
        """ID 1779: Respiration"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Respiration Process',
            title_arabic='عملية التنفس',
            description='Exercises on respiration',
            difficulty_level='intermediate',
            estimated_duration=25,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'التنفس هو:',
                'text_en': 'Respiration is:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('تبادل الأكسجين وثاني أكسيد الكربون', True),
                    ('هضم الطعام', False),
                    ('ضخ الدم', False),
                    ('إطراح البول', False)
                ]
            },
            {
                'text_ar': 'أين يحدث تبادل الغازات في الرئتين؟',
                'text_en': 'Where does gas exchange occur in the lungs?',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('في الحويصلات الهوائية', True),
                    ('في القصبة الهوائية', False),
                    ('في الأنف', False),
                    ('في البلعوم', False)
                ]
            },
            {
                'text_ar': 'عند الشهيق نستنشق:',
                'text_en': 'During inhalation we breathe in:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الأكسجين', True),
                    ('ثاني أكسيد الكربون', False),
                    ('النيتروجين فقط', False),
                    ('بخار الماء', False)
                ]
            },
            {
                'text_ar': 'عند الزفير نطرح:',
                'text_en': 'During exhalation we expel:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('ثاني أكسيد الكربون', True),
                    ('الأكسجين', False),
                    ('الهيدروجين', False),
                    ('الهيليوم', False)
                ]
            },
            {
                'text_ar': 'الجهاز التنفسي يتكون من:',
                'text_en': 'The respiratory system consists of:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('الأنف والقصبة الهوائية', True),
                    ('الرئتان', True),
                    ('الحويصلات الهوائية', True),
                    ('الكلى', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_blood_system_exercises(self, lesson):
        """ID 1780: Blood and Circulatory System"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Blood Components and Functions',
            title_arabic='مكونات الدم ووظائفه',
            description='Exercises on blood and circulatory system',
            difficulty_level='intermediate',
            estimated_duration=30,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'الدم يتكون من:',
                'text_en': 'Blood consists of:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('البلازما (سائل)', True),
                    ('كريات الدم الحمراء', True),
                    ('كريات الدم البيضاء والصفائح', True),
                    ('الماء فقط', False)
                ]
            },
            {
                'text_ar': 'كريات الدم الحمراء تحمل:',
                'text_en': 'Red blood cells carry:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الأكسجين', True),
                    ('ثاني أكسيد الكربون فقط', False),
                    ('الطعام', False),
                    ('الفضلات', False)
                ]
            },
            {
                'text_ar': 'كريات الدم البيضاء مسؤولة عن:',
                'text_en': 'White blood cells are responsible for:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الدفاع عن الجسم ضد الأمراض', True),
                    ('نقل الأكسجين', False),
                    ('تخثر الدم', False),
                    ('هضم الطعام', False)
                ]
            },
            {
                'text_ar': 'الصفائح الدموية تساعد في:',
                'text_en': 'Blood platelets help in:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('تخثر الدم وإيقاف النزيف', True),
                    ('نقل الأكسجين', False),
                    ('مقاومة الأمراض', False),
                    ('الهضم', False)
                ]
            },
            {
                'text_ar': 'فصائل الدم الأساسية هي:',
                'text_en': 'The basic blood types are:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('A', True),
                    ('B', True),
                    ('AB و O', True),
                    ('X و Y', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_human_respiration_exercises(self, lesson):
        """ID 1781: Human Respiration"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Human Respiratory System',
            title_arabic='جهاز التنفس عند الإنسان',
            description='Detailed exercises on human respiration',
            difficulty_level='intermediate',
            estimated_duration=30,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'الحجاب الحاجز هو:',
                'text_en': 'The diaphragm is:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('عضلة تفصل بين الصدر والبطن وتساعد في التنفس', True),
                    ('عظمة في القفص الصدري', False),
                    ('جزء من القلب', False),
                    ('غشاء يغطي الرئتين فقط', False)
                ]
            },
            {
                'text_ar': 'عدد الرئتين في جسم الإنسان:',
                'text_en': 'The number of lungs in the human body:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('اثنتان', True),
                    ('واحدة', False),
                    ('ثلاث', False),
                    ('أربع', False)
                ]
            },
            {
                'text_ar': 'القصبة الهوائية تتفرع إلى:',
                'text_en': 'The trachea branches into:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('قصبتان هوائيتان (واحدة لكل رئة)', True),
                    ('أربع قصبات', False),
                    ('لا تتفرع', False),
                    ('ست قصبات', False)
                ]
            },
            {
                'text_ar': 'الأهداب في الممرات التنفسية تقوم بـ:',
                'text_en': 'Cilia in respiratory passages function to:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('تنظيف الهواء من الغبار والجراثيم', True),
                    ('تسخين الهواء فقط', False),
                    ('امتصاص الأكسجين', False),
                    ('إنتاج المخاط', False)
                ]
            },
            {
                'text_ar': 'معدل التنفس الطبيعي عند الإنسان البالغ حوالي:',
                'text_en': 'Normal breathing rate for an adult human is about:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('12-20 نفساً في الدقيقة', True),
                    ('50-60 نفساً في الدقيقة', False),
                    ('5 أنفاس في الدقيقة', False),
                    ('100 نفس في الدقيقة', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_nutrition_exercises(self, lesson):
        """ID 1782: Nutritional Education"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Nutritional Education and Balanced Diet',
            title_arabic='التربية الغذائية والنظام المتوازن',
            description='Exercises on nutrition and health',
            difficulty_level='beginner',
            estimated_duration=25,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'الغذاء المتوازن يحتوي على:',
                'text_en': 'A balanced diet contains:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('البروتينات', True),
                    ('الكربوهيدرات والدهون', True),
                    ('الفيتامينات والمعادن', True),
                    ('السكريات فقط', False)
                ]
            },
            {
                'text_ar': 'البروتينات ضرورية لـ:',
                'text_en': 'Proteins are essential for:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('بناء وإصلاح الأنسجة', True),
                    ('تخزين الطاقة فقط', False),
                    ('التنفس', False),
                    ('الإطراح', False)
                ]
            },
            {
                'text_ar': 'الكربوهيدرات تمد الجسم بـ:',
                'text_en': 'Carbohydrates provide the body with:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('الطاقة السريعة', True),
                    ('البروتينات', False),
                    ('الفيتامينات', False),
                    ('الأكسجين', False)
                ]
            },
            {
                'text_ar': 'مصادر البروتينات تشمل:',
                'text_en': 'Protein sources include:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('اللحوم والأسماك', True),
                    ('البيض والحليب', True),
                    ('البقوليات', True),
                    ('السكر', False)
                ]
            },
            {
                'text_ar': 'الماء مهم للجسم لأنه:',
                'text_en': 'Water is important for the body because it:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('ينقل المواد الغذائية', True),
                    ('ينظم درجة حرارة الجسم', True),
                    ('يساعد في الهضم والإطراح', True),
                    ('يزيد الوزن فقط', False)
                ]
            }
        ]

        self.create_questions(ex1, questions)
        self.stdout.write(f'  Created 1 exercise with 5 questions')

    def create_body_health_exercises(self, lesson):
        """ID 1783: Body Health"""
        ex1 = Exercise.objects.create(
            lesson=lesson,
            title='Body Health and Hygiene',
            title_arabic='صحة الجسم والنظافة',
            description='Exercises on health and hygiene',
            difficulty_level='beginner',
            estimated_duration=25,
            total_points=50.0,
            created_by=self.admin_user
        )

        questions = [
            {
                'text_ar': 'للمحافظة على صحة الجسم يجب:',
                'text_en': 'To maintain body health, one should:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('تناول غذاء متوازن', True),
                    ('ممارسة الرياضة بانتظام', True),
                    ('النوم الكافي', True),
                    ('تناول الطعام غير الصحي', False)
                ]
            },
            {
                'text_ar': 'غسل اليدين مهم:',
                'text_en': 'Washing hands is important:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('قبل الأكل', True),
                    ('بعد استعمال الحمام', True),
                    ('بعد لمس الأشياء القذرة', True),
                    ('مرة واحدة في الأسبوع فقط', False)
                ]
            },
            {
                'text_ar': 'النوم الكافي للأطفال والمراهقين هو حوالي:',
                'text_en': 'Adequate sleep for children and adolescents is about:',
                'type': 'qcm_single',
                'points': 10.0,
                'choices': [
                    ('8-10 ساعات', True),
                    ('3-4 ساعات', False),
                    ('1-2 ساعة', False),
                    ('15 ساعة', False)
                ]
            },
            {
                'text_ar': 'الرياضة مفيدة للجسم لأنها:',
                'text_en': 'Exercise is beneficial for the body because it:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('تقوي العضلات والعظام', True),
                    ('تحسن الدورة الدموية', True),
                    ('تساعد في التحكم بالوزن', True),
                    ('تسبب الأمراض', False)
                ]
            },
            {
                'text_ar': 'من عادات النظافة الشخصية:',
                'text_en': 'Personal hygiene habits include:',
                'type': 'qcm_multiple',
                'points': 10.0,
                'choices': [
                    ('الاستحمام المنتظم', True),
                    ('تنظيف الأسنان', True),
                    ('تقليم الأظافر', True),
                    ('إهمال النظافة', False)
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
