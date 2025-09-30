"""
Management Command for Creating Exercises for Lesson: The role of the striated skeletal muscle in energy conversion (ID 102)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward


class Command(BaseCommand):
    help = 'Create exercises for "The role of the striated skeletal muscle in energy conversion" - Lesson ID: 102'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            dest='delete_existing',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        lesson_id = 102
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
                'title': 'Structure of Skeletal Muscle', 'title_arabic': 'بنية العضلة الهيكلية المخططة', 'difficulty': 'beginner',
                'questions': [
                    {'type': 'qcm_single', 'text': 'What is the basic contractile unit of a muscle fiber?', 'text_arabic': 'ما هي الوحدة الانقباضية الأساسية لليف عضلي؟', 'points': 2.0, 'choices': [
                        {'text': 'Sarcomere', 'text_arabic': 'الساركومير', 'is_correct': True},
                        {'text': 'Myofibril', 'text_arabic': 'اللييف العضلي', 'is_correct': False},
                        {'text': 'Fascicle', 'text_arabic': 'الحزمة العضلية', 'is_correct': False},
                        {'text': 'Tendon', 'text_arabic': 'الوتر', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Skeletal muscles are also known as voluntary muscles.', 'text_arabic': 'تُعرف العضلات الهيكلية أيضًا بالعضلات الإرادية.', 'points': 2.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'qcm_single', 'text': 'The thick filaments in a sarcomere are made of which protein?', 'text_arabic': 'تتكون الخيوط السميكة في الساركومير من أي بروتين؟', 'points': 2.0, 'choices': [
                        {'text': 'Myosin', 'text_arabic': 'الميوسين', 'is_correct': True},
                        {'text': 'Actin', 'text_arabic': 'الأكتين', 'is_correct': False},
                        {'text': 'Troponin', 'text_arabic': 'التروبونين', 'is_correct': False},
                        {'text': 'Tropomyosin', 'text_arabic': 'التروبوميوسين', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What connects muscles to bones?', 'text_arabic': 'ما الذي يربط العضلات بالعظام؟', 'points': 3.0, 'explanation': 'Tendons', 'explanation_arabic': 'الأوتار'},
                    {'type': 'qcm_single', 'text': 'The thin filaments in a sarcomere are primarily made of which protein?', 'text_arabic': 'تتكون الخيوط الرقيقة في الساركومير بشكل أساسي من أي بروتين؟', 'points': 2.0, 'choices': [
                        {'text': 'Actin', 'text_arabic': 'الأكتين', 'is_correct': True},
                        {'text': 'Myosin', 'text_arabic': 'الميوسين', 'is_correct': False},
                        {'text': 'Titin', 'text_arabic': 'التيتين', 'is_correct': False},
                        {'text': 'Nebulin', 'text_arabic': 'النيبولين', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'A muscle fiber is a single muscle cell.', 'text_arabic': 'الليف العضلي هو خلية عضلية واحدة.', 'points': 2.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                ]
            },
            {
                'title': 'Mechanism of Muscle Contraction', 'title_arabic': 'آلية الانقباض العضلي', 'difficulty': 'intermediate',
                'questions': [
                    {'type': 'qcm_single', 'text': 'What is the name of the theory that explains muscle contraction?', 'text_arabic': 'ما اسم النظرية التي تفسر الانقباض العضلي؟', 'points': 3.0, 'choices': [
                        {'text': 'Sliding Filament Theory', 'text_arabic': 'نظرية الخيوط المنزلقة', 'is_correct': True},
                        {'text': 'Cell Theory', 'text_arabic': 'نظرية الخلية', 'is_correct': False},
                        {'text': 'Theory of Relativity', 'text_arabic': 'نظرية النسبية', 'is_correct': False},
                        {'text': 'Lock and Key Theory', 'text_arabic': 'نظرية القفل والمفتاح', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What ion is essential for initiating muscle contraction by binding to troponin?', 'text_arabic': 'ما هو الأيون الضروري لبدء الانقباض العضلي عن طريق الارتباط بالتروبونين؟', 'points': 4.0, 'explanation': 'Calcium ions (Ca2+)', 'explanation_arabic': 'أيونات الكالسيوم (Ca2+)'},
                    {'type': 'qcm_single', 'text': 'What molecule provides the energy for the myosin head to detach from actin?', 'text_arabic': 'ما هي الجزيئة التي توفر الطاقة لرأس الميوسين للانفصال عن الأكتين؟', 'points': 3.0, 'choices': [
                        {'text': 'ATP', 'text_arabic': 'ATP', 'is_correct': True},
                        {'text': 'ADP', 'text_arabic': 'ADP', 'is_correct': False},
                        {'text': 'Calcium', 'text_arabic': 'الكالسيوم', 'is_correct': False},
                        {'text': 'Phosphate', 'text_arabic': 'الفوسفات', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'During muscle contraction, the actin and myosin filaments shorten.', 'text_arabic': 'أثناء الانقباض العضلي، تقصر خيوط الأكتين والميوسين.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'The filaments slide past each other; they do not change length.', 'explanation_arabic': 'تنزلق الخيوط فوق بعضها البعض؛ لا يتغير طولها.'},
                    {'type': 'open_short', 'text': 'What is a cross-bridge in the context of muscle contraction?', 'text_arabic': 'ما هو الجسر المستعرض في سياق الانقباض العضلي؟', 'points': 4.0, 'explanation': 'The attachment of a myosin head to an actin filament.', 'explanation_arabic': 'ارتباط رأس الميوسين بخيط الأكتين.'},
                    {'type': 'qcm_single', 'text': 'The release of calcium ions into the sarcoplasm is triggered by:', 'text_arabic': 'يتم تحفيز إطلاق أيونات الكالسيوم في الساركوبلازم عن طريق:', 'points': 4.0, 'choices': [
                        {'text': 'An action potential from a motor neuron', 'text_arabic': 'جهد فعل من عصبون حركي', 'is_correct': True},
                        {'text': 'The binding of ATP to myosin', 'text_arabic': 'ارتباط ATP بالميوسين', 'is_correct': False},
                        {'text': 'A decrease in temperature', 'text_arabic': 'انخفاض في درجة الحرارة', 'is_correct': False},
                        {'text': 'The stretching of the muscle', 'text_arabic': 'تمدد العضلة', 'is_correct': False},
                    ]},
                ]
            },
            {
                'title': 'Energy for Muscle Contraction', 'title_arabic': 'الطاقة اللازمة للانقباض العضلي', 'difficulty': 'intermediate',
                'questions': [
                    {'type': 'qcm_single', 'text': 'What is the immediate source of energy for muscle contraction?', 'text_arabic': 'ما هو المصدر الفوري للطاقة للانقباض العضلي؟', 'points': 3.0, 'choices': [
                        {'text': 'ATP', 'text_arabic': 'ATP', 'is_correct': True},
                        {'text': 'Glucose', 'text_arabic': 'الجلوكوز', 'is_correct': False},
                        {'text': 'Creatine phosphate', 'text_arabic': 'فوسفات الكرياتين', 'is_correct': False},
                        {'text': 'Glycogen', 'text_arabic': 'الجليكوجين', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Muscles can store a large amount of ATP, enough for several minutes of contraction.', 'text_arabic': 'يمكن للعضلات تخزين كمية كبيرة من ATP، تكفي لعدة دقائق من الانقباض.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'Muscles only store enough ATP for a few seconds of activity.', 'explanation_arabic': 'تخزن العضلات ما يكفي من ATP لبضع ثوانٍ فقط من النشاط.'},
                    {'type': 'open_short', 'text': 'What high-energy molecule can quickly regenerate ATP in muscle cells?', 'text_arabic': 'ما هي الجزيئة عالية الطاقة التي يمكنها تجديد ATP بسرعة في خلايا العضلات؟', 'points': 4.0, 'explanation': 'Creatine phosphate (or phosphocreatine)', 'explanation_arabic': 'فوسفات الكرياتين (أو فوسفوكرياتين)'},
                    {'type': 'qcm_single', 'text': 'During prolonged, low-intensity exercise, what is the main source of ATP?', 'text_arabic': 'أثناء التمرين المطول منخفض الشدة، ما هو المصدر الرئيسي لـ ATP؟', 'points': 3.0, 'choices': [
                        {'text': 'Aerobic respiration', 'text_arabic': 'التنفس الهوائي', 'is_correct': True},
                        {'text': 'Anaerobic respiration', 'text_arabic': 'التنفس اللاهوائي', 'is_correct': False},
                        {'text': 'Creatine phosphate', 'text_arabic': 'فوسفات الكرياتين', 'is_correct': False},
                        {'text': 'Stored ATP', 'text_arabic': 'ATP المخزن', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is muscle fatigue?', 'text_arabic': 'ما هو التعب العضلي؟', 'points': 4.0, 'explanation': 'The decline in ability of a muscle to generate force.', 'explanation_arabic': 'انخفاض قدرة العضلة على توليد القوة.'},
                    {'type': 'true_false', 'text': 'Lactic acid buildup is the sole cause of muscle fatigue.', 'text_arabic': 'تراكم حمض اللاكتيك هو السبب الوحيد للتعب العضلي.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'Fatigue is complex and involves multiple factors, including ion imbalances and glycogen depletion.', 'explanation_arabic': 'التعب معقد ويشمل عوامل متعددة، بما في ذلك اختلالات الأيونات ونضوب الجليكوجين.'},
                ]
            },
            {
                'title': 'Types of Muscle Fibers', 'title_arabic': 'أنواع الألياف العضلية', 'difficulty': 'advanced',
                'questions': [
                    {'type': 'qcm_single', 'text': 'Which type of muscle fiber is best suited for endurance activities like marathon running?', 'text_arabic': 'أي نوع من الألياف العضلية هو الأنسب لأنشطة التحمل مثل سباق الماراثون؟', 'points': 4.0, 'choices': [
                        {'text': 'Slow-twitch (Type I)', 'text_arabic': 'بطيئة الانقباض (النوع الأول)', 'is_correct': True},
                        {'text': 'Fast-twitch (Type IIb)', 'text_arabic': 'سريعة الانقباض (النوع IIb)', 'is_correct': False},
                        {'text': 'Intermediate (Type IIa)', 'text_arabic': 'متوسطة (النوع IIa)', 'is_correct': False},
                        {'text': 'Cardiac muscle fibers', 'text_arabic': 'ألياف العضلة القلبية', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What protein gives slow-twitch fibers their reddish color?', 'text_arabic': 'ما هو البروتين الذي يعطي الألياف بطيئة الانقباض لونها المحمر؟', 'points': 5.0, 'explanation': 'Myoglobin', 'explanation_arabic': 'الميوغلوبين'},
                    {'type': 'qcm_single', 'text': 'Fast-twitch fibers primarily generate ATP through which process?', 'text_arabic': 'تولد الألياف سريعة الانقباض ATP بشكل أساسي من خلال أي عملية؟', 'points': 4.0, 'choices': [
                        {'text': 'Anaerobic glycolysis', 'text_arabic': 'تحلل الجلوكوز اللاهوائي', 'is_correct': True},
                        {'text': 'Aerobic respiration', 'text_arabic': 'التنفس الهوائي', 'is_correct': False},
                        {'text': 'Beta-oxidation', 'text_arabic': 'أكسدة بيتا', 'is_correct': False},
                        {'text': 'Photosynthesis', 'text_arabic': 'التركيب الضوئي', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Fast-twitch fibers fatigue more quickly than slow-twitch fibers.', 'text_arabic': 'تتعب الألياف سريعة الانقباض بسرعة أكبر من الألياف بطيئة الانقباض.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'open_short', 'text': 'Why are slow-twitch fibers rich in mitochondria?', 'text_arabic': 'لماذا تكون الألياف بطيئة الانقباض غنية بالميتوكوندريا؟', 'points': 6.0, 'explanation': 'Because they rely on aerobic respiration, which occurs in the mitochondria, to produce ATP for sustained contractions.', 'explanation_arabic': 'لأنها تعتمد على التنفس الهوائي، الذي يحدث في الميتوكوندريا، لإنتاج ATP للانقباضات المستمرة.'},
                    {'type': 'qcm_single', 'text': 'An activity like sprinting would primarily use which type of muscle fiber?', 'text_arabic': 'نشاط مثل الركض السريع سيستخدم بشكل أساسي أي نوع من الألياف العضلية؟', 'points': 4.0, 'choices': [
                        {'text': 'Fast-twitch (Type II)', 'text_arabic': 'سريعة الانقباض (النوع الثاني)', 'is_correct': True},
                        {'text': 'Slow-twitch (Type I)', 'text_arabic': 'بطيئة الانقباض (النوع الأول)', 'is_correct': False},
                        {'text': 'Smooth muscle fibers', 'text_arabic': 'ألياف العضلات الملساء', 'is_correct': False},
                        {'text': 'Cardiac muscle fibers', 'text_arabic': 'ألياف العضلة القلبية', 'is_correct': False},
                    ]},
                ]
            },
            {
                'title': 'Thermal Phenomena in Muscle Contraction', 'title_arabic': 'الظواهر الحرارية في الانقباض العضلي', 'difficulty': 'advanced',
                'questions': [
                    {'type': 'qcm_single', 'text': 'Muscle contraction converts chemical energy into mechanical work and what other form of energy?', 'text_arabic': 'يحول الانقباض العضلي الطاقة الكيميائية إلى عمل ميكانيكي وأي شكل آخر من أشكال الطاقة؟', 'points': 4.0, 'choices': [
                        {'text': 'Heat', 'text_arabic': 'حرارة', 'is_correct': True},
                        {'text': 'Light', 'text_arabic': 'ضوء', 'is_correct': False},
                        {'text': 'Electrical', 'text_arabic': 'كهربائية', 'is_correct': False},
                        {'text': 'Sound', 'text_arabic': 'صوت', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is the initial heat produced during the contraction and relaxation phases of a muscle twitch?', 'text_arabic': 'ما هي الحرارة الأولية المنتجة خلال مرحلتي الانقباض والاسترخاء في رعشة عضلية؟', 'points': 5.0, 'explanation': 'Activation heat or initial heat.', 'explanation_arabic': 'حرارة التنشيط أو الحرارة الأولية.'},
                    {'type': 'true_false', 'text': 'The majority of the energy released from ATP hydrolysis during contraction is converted into mechanical work.', 'text_arabic': 'تتحول غالبية الطاقة المنبعثة من التحلل المائي لـ ATP أثناء الانقباض إلى عمل ميكانيكي.', 'points': 5.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'Only about 20-25% is converted to work; the rest is lost as heat.', 'explanation_arabic': 'يتحول حوالي 20-25% فقط إلى عمل؛ والباقي يفقد على شكل حرارة.'},
                    {'type': 'qcm_single', 'text': 'The heat produced by a muscle long after the contraction is over is called:', 'text_arabic': 'تسمى الحرارة التي تنتجها العضلة بعد فترة طويلة من انتهاء الانقباض:', 'points': 5.0, 'choices': [
                        {'text': 'Recovery heat', 'text_arabic': 'حرارة الاستشفاء', 'is_correct': True},
                        {'text': 'Initial heat', 'text_arabic': 'الحرارة الأولية', 'is_correct': False},
                        {'text': 'Activation heat', 'text_arabic': 'حرارة التنشيط', 'is_correct': False},
                        {'text': 'Contraction heat', 'text_arabic': 'حرارة الانقباض', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What metabolic processes are responsible for producing recovery heat?', 'text_arabic': 'ما هي العمليات الأيضية المسؤولة عن إنتاج حرارة الاستشفاء؟', 'points': 6.0, 'explanation': 'The aerobic processes that restore the muscle to its pre-contraction state, such as replenishing glycogen and creatine phosphate stores.', 'explanation_arabic': 'العمليات الهوائية التي تعيد العضلة إلى حالتها قبل الانقباض، مثل تجديد مخازن الجليكوجين وفوسفات الكرياتين.'},
                    {'type': 'true_false', 'text': 'Shivering is a mechanism that uses involuntary muscle contractions to generate heat.', 'text_arabic': 'الارتعاش هو آلية تستخدم انقباضات عضلية لا إرادية لتوليد الحرارة.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
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
