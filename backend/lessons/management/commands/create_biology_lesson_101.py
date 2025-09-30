"""
Management Command for Creating Exercises for Lesson: Release of potential energy from organic matter (ID 101)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward


class Command(BaseCommand):
    help = 'Create exercises for "Release of potential energy from organic matter" - Lesson ID: 101'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            dest='delete_existing',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        lesson_id = 101
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
                'title': 'Introduction to Cellular Respiration', 'title_arabic': 'مقدمة في التنفس الخلوي', 'difficulty': 'beginner',
                'questions': [
                    {'type': 'qcm_single', 'text': 'What is the primary purpose of cellular respiration?', 'text_arabic': 'ما هو الغرض الأساسي من التنفس الخلوي؟', 'points': 2.0, 'choices': [
                        {'text': 'To produce ATP', 'text_arabic': 'لإنتاج ATP', 'is_correct': True},
                        {'text': 'To produce glucose', 'text_arabic': 'لإنتاج الجلوكوز', 'is_correct': False},
                        {'text': 'To release oxygen', 'text_arabic': 'لإطلاق الأكسجين', 'is_correct': False},
                        {'text': 'To consume water', 'text_arabic': 'لاستهلاك الماء', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Cellular respiration occurs only in animal cells.', 'text_arabic': 'يحدث التنفس الخلوي فقط في الخلايا الحيوانية.', 'points': 2.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}]},
                    {'type': 'qcm_single', 'text': 'What is the main organic molecule broken down in cellular respiration?', 'text_arabic': 'ما هي الجزيئة العضوية الرئيسية التي يتم تفكيكها في التنفس الخلوي؟', 'points': 2.0, 'choices': [
                        {'text': 'Glucose', 'text_arabic': 'الجلوكوز', 'is_correct': True},
                        {'text': 'ATP', 'text_arabic': 'ATP', 'is_correct': False},
                        {'text': 'DNA', 'text_arabic': 'DNA', 'is_correct': False},
                        {'text': 'Water', 'text_arabic': 'الماء', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What are the two main types of cellular respiration?', 'text_arabic': 'ما هما النوعان الرئيسيان للتنفس الخلوي؟', 'points': 3.0, 'explanation': 'Aerobic and anaerobic respiration.', 'explanation_arabic': 'التنفس الهوائي واللاهوائي.'},
                    {'type': 'qcm_single', 'text': 'Where in the cell does glycolysis occur?', 'text_arabic': 'أين يحدث تحلل الجلوكوز في الخلية؟', 'points': 2.0, 'choices': [
                        {'text': 'Cytoplasm', 'text_arabic': 'السيتوبلازم', 'is_correct': True},
                        {'text': 'Mitochondrion', 'text_arabic': 'الميتوكوندريا', 'is_correct': False},
                        {'text': 'Nucleus', 'text_arabic': 'النواة', 'is_correct': False},
                        {'text': 'Ribosome', 'text_arabic': 'الريبوسوم', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Oxygen is required for glycolysis.', 'text_arabic': 'الأكسجين ضروري لتحلل الجلوكوز.', 'points': 2.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}]},
                ]
            },
            {
                'title': 'Aerobic Respiration: Krebs Cycle and ETC', 'title_arabic': 'التنفس الهوائي: دورة كريبس وسلسلة نقل الإلكترون', 'difficulty': 'intermediate',
                'questions': [
                    {'type': 'qcm_single', 'text': 'Where does the Krebs cycle (citric acid cycle) take place?', 'text_arabic': 'أين تحدث دورة كريبس (دورة حمض الستريك)؟', 'points': 3.0, 'choices': [
                        {'text': 'Mitochondrial matrix', 'text_arabic': 'مصفوفة الميتوكوندريا', 'is_correct': True},
                        {'text': 'Cytoplasm', 'text_arabic': 'السيتوبلازم', 'is_correct': False},
                        {'text': 'Inner mitochondrial membrane', 'text_arabic': 'الغشاء الداخلي للميتوكوندريا', 'is_correct': False},
                        {'text': 'Outer mitochondrial membrane', 'text_arabic': 'الغشاء الخارجي للميتوكوندريا', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What are the main products of the Krebs cycle per glucose molecule?', 'text_arabic': 'ما هي المنتجات الرئيسية لدورة كريبس لكل جزيء جلوكوز؟', 'points': 4.0, 'explanation': 'ATP, NADH, FADH2, and CO2.', 'explanation_arabic': 'ATP و NADH و FADH2 و CO2.'},
                    {'type': 'qcm_single', 'text': 'The final electron acceptor in the electron transport chain (ETC) is:', 'text_arabic': 'المستقبل النهائي للإلكترون في سلسلة نقل الإلكترون هو:', 'points': 3.0, 'choices': [
                        {'text': 'Oxygen', 'text_arabic': 'الأكسجين', 'is_correct': True},
                        {'text': 'Water', 'text_arabic': 'الماء', 'is_correct': False},
                        {'text': 'NADH', 'text_arabic': 'NADH', 'is_correct': False},
                        {'text': 'ATP', 'text_arabic': 'ATP', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'The electron transport chain directly produces the majority of ATP in aerobic respiration.', 'text_arabic': 'تنتج سلسلة نقل الإلكترون مباشرة غالبية ATP في التنفس الهوائي.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'open_short', 'text': 'What molecule is formed when oxygen accepts electrons at the end of the ETC?', 'text_arabic': 'ما هي الجزيئة التي تتكون عندما يقبل الأكسجين الإلكترونات في نهاية سلسلة نقل الإلكترون؟', 'points': 4.0, 'explanation': 'Water (H2O)', 'explanation_arabic': 'الماء (H2O)'},
                    {'type': 'qcm_single', 'text': 'The process of generating ATP using the energy from a proton gradient across a membrane is called:', 'text_arabic': 'تسمى عملية توليد ATP باستخدام الطاقة من تدرج البروتون عبر غشاء:', 'points': 4.0, 'choices': [
                        {'text': 'Chemiosmosis', 'text_arabic': 'التناضح الكيميائي', 'is_correct': True},
                        {'text': 'Glycolysis', 'text_arabic': 'تحلل الجلوكوز', 'is_correct': False},
                        {'text': 'Fermentation', 'text_arabic': 'التخمر', 'is_correct': False},
                        {'text': 'Substrate-level phosphorylation', 'text_arabic': 'الفسفرة على مستوى الركيزة', 'is_correct': False},
                    ]},
                ]
            },
            {
                'title': 'Anaerobic Respiration and Fermentation', 'title_arabic': 'التنفس اللاهوائي والتخمر', 'difficulty': 'intermediate',
                'questions': [
                    {'type': 'qcm_single', 'text': 'Which process follows glycolysis in the absence of oxygen?', 'text_arabic': 'أي عملية تلي تحلل الجلوكوز في غياب الأكسجين؟', 'points': 3.0, 'choices': [
                        {'text': 'Fermentation', 'text_arabic': 'التخمر', 'is_correct': True},
                        {'text': 'Krebs cycle', 'text_arabic': 'دورة كريبس', 'is_correct': False},
                        {'text': 'Electron transport chain', 'text_arabic': 'سلسلة نقل الإلكترون', 'is_correct': False},
                        {'text': 'Photosynthesis', 'text_arabic': 'التركيب الضوئي', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Fermentation produces a large amount of ATP.', 'text_arabic': 'ينتج التخمر كمية كبيرة من ATP.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}]},
                    {'type': 'open_short', 'text': 'What are the two common types of fermentation?', 'text_arabic': 'ما هما النوعان الشائعان للتخمر؟', 'points': 4.0, 'explanation': 'Lactic acid fermentation and alcoholic fermentation.', 'explanation_arabic': 'تخمر حمض اللاكتيك والتخمر الكحولي.'},
                    {'type': 'qcm_single', 'text': 'In human muscle cells, what is the product of fermentation during intense exercise?', 'text_arabic': 'في خلايا العضلات البشرية، ما هو ناتج التخمر أثناء التمرين المكثف؟', 'points': 3.0, 'choices': [
                        {'text': 'Lactic acid', 'text_arabic': 'حمض اللاكتيك', 'is_correct': True},
                        {'text': 'Ethanol', 'text_arabic': 'الإيثانول', 'is_correct': False},
                        {'text': 'Carbon dioxide', 'text_arabic': 'ثاني أكسيد الكربون', 'is_correct': False},
                        {'text': 'Glucose', 'text_arabic': 'الجلوكوز', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is the main purpose of fermentation for the cell?', 'text_arabic': 'ما هو الغرض الرئيسي من التخمر للخلية؟', 'points': 5.0, 'explanation': 'To regenerate NAD+ from NADH so that glycolysis can continue.', 'explanation_arabic': 'لتجديد NAD+ من NADH حتى يتمكن تحلل الجلوكوز من الاستمرار.'},
                    {'type': 'true_false', 'text': 'Yeast performs alcoholic fermentation.', 'text_arabic': 'تقوم الخميرة بالتخمر الكحولي.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                ]
            },
            {
                'title': 'ATP Synthesis and Energy Yield', 'title_arabic': 'تخليق ATP ومردود الطاقة', 'difficulty': 'advanced',
                'questions': [
                    {'type': 'qcm_single', 'text': 'Theoretically, what is the maximum net ATP yield from one molecule of glucose in aerobic respiration?', 'text_arabic': 'نظريًا، ما هو أقصى صافي مردود ATP من جزيء واحد من الجلوكوز في التنفس الهوائي؟', 'points': 4.0, 'choices': [
                        {'text': '36-38 ATP', 'text_arabic': '36-38 ATP', 'is_correct': True},
                        {'text': '2 ATP', 'text_arabic': '2 ATP', 'is_correct': False},
                        {'text': '10 ATP', 'text_arabic': '10 ATP', 'is_correct': False},
                        {'text': '100 ATP', 'text_arabic': '100 ATP', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is the net ATP yield from glycolysis?', 'text_arabic': 'ما هو صافي مردود ATP من تحلل الجلوكوز؟', 'points': 4.0, 'explanation': '2 ATP', 'explanation_arabic': '2 ATP'},
                    {'type': 'qcm_single', 'text': 'Which stage of cellular respiration produces the most ATP?', 'text_arabic': 'أي مرحلة من مراحل التنفس الخلوي تنتج أكبر قدر من ATP؟', 'points': 4.0, 'choices': [
                        {'text': 'Electron transport chain and chemiosmosis', 'text_arabic': 'سلسلة نقل الإلكترون والتناضح الكيميائي', 'is_correct': True},
                        {'text': 'Glycolysis', 'text_arabic': 'تحلل الجلوكوز', 'is_correct': False},
                        {'text': 'Krebs cycle', 'text_arabic': 'دورة كريبس', 'is_correct': False},
                        {'text': 'Fermentation', 'text_arabic': 'التخمر', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Substrate-level phosphorylation occurs in both glycolysis and the Krebs cycle.', 'text_arabic': 'تحدث الفسفرة على مستوى الركيزة في كل من تحلل الجلوكوز ودورة كريبس.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'open_short', 'text': 'Why is the actual ATP yield often less than the theoretical maximum?', 'text_arabic': 'لماذا يكون مردود ATP الفعلي غالبًا أقل من الحد الأقصى النظري؟', 'points': 6.0, 'explanation': 'The proton gradient is also used for other processes, and the inner mitochondrial membrane is not completely impermeable to protons.', 'explanation_arabic': 'يستخدم تدرج البروتون أيضًا في عمليات أخرى، والغشاء الداخلي للميتوكوندريا ليس غير منفذ تمامًا للبروتونات.'},
                    {'type': 'qcm_single', 'text': 'How many ATP molecules are produced per NADH molecule that enters the ETC?', 'text_arabic': 'كم عدد جزيئات ATP التي يتم إنتاجها لكل جزيء NADH يدخل سلسلة نقل الإلكترون؟', 'points': 5.0, 'choices': [
                        {'text': 'Approximately 2.5-3', 'text_arabic': 'حوالي 2.5-3', 'is_correct': True},
                        {'text': '1', 'text_arabic': '1', 'is_correct': False},
                        {'text': 'Approximately 1.5-2', 'text_arabic': 'حوالي 1.5-2', 'is_correct': False},
                        {'text': '4', 'text_arabic': '4', 'is_correct': False},
                    ]},
                ]
            },
            {
                'title': 'Regulation and Connections to Other Pathways', 'title_arabic': 'التنظيم والارتباطات بالمسارات الأخرى', 'difficulty': 'advanced',
                'questions': [
                    {'type': 'qcm_single', 'text': 'Which enzyme is a key regulator of glycolysis?', 'text_arabic': 'أي إنزيم هو منظم رئيسي لتحلل الجلوكوز؟', 'points': 5.0, 'choices': [
                        {'text': 'Phosphofructokinase', 'text_arabic': 'فوسفوفركتوكيناز', 'is_correct': True},
                        {'text': 'ATP synthase', 'text_arabic': 'سينثاز ATP', 'is_correct': False},
                        {'text': 'Hexokinase', 'text_arabic': 'هيكسوكيناز', 'is_correct': False},
                        {'text': 'Pyruvate kinase', 'text_arabic': 'بيروفات كيناز', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'How can fats and proteins be used as fuel for cellular respiration?', 'text_arabic': 'كيف يمكن استخدام الدهون والبروتينات كوقود للتنفس الخلوي؟', 'points': 6.0, 'explanation': 'They are broken down into components that can enter glycolysis or the Krebs cycle at various points.', 'explanation_arabic': 'يتم تفكيكها إلى مكونات يمكن أن تدخل تحلل الجلوكوز أو دورة كريبس في نقاط مختلفة.'},
                    {'type': 'true_false', 'text': 'High levels of ATP inhibit cellular respiration.', 'text_arabic': 'تثبط المستويات العالية من ATP التنفس الخلوي.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'qcm_single', 'text': 'The breakdown of fatty acids to be used in respiration is called:', 'text_arabic': 'يسمى تفكك الأحماض الدهنية لاستخدامها في التنفس:', 'points': 5.0, 'choices': [
                        {'text': 'Beta-oxidation', 'text_arabic': 'أكسدة بيتا', 'is_correct': True},
                        {'text': 'Glycolysis', 'text_arabic': 'تحلل الجلوكوز', 'is_correct': False},
                        {'text': 'Deamination', 'text_arabic': 'نزع الأمين', 'is_correct': False},
                        {'text': 'Fermentation', 'text_arabic': 'التخمر', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What happens to the amino group of an amino acid before it can enter the respiratory pathway?', 'text_arabic': 'ماذا يحدث لمجموعة الأمين في الحمض الأميني قبل أن يتمكن من دخول مسار التنفس؟', 'points': 5.0, 'explanation': 'It is removed through a process called deamination.', 'explanation_arabic': 'تتم إزالتها من خلال عملية تسمى نزع الأمين.'},
                    {'type': 'true_false', 'text': 'The intermediates of cellular respiration can be used to synthesize other organic molecules.', 'text_arabic': 'يمكن استخدام المركبات الوسيطة للتنفس الخلوي لتخليق جزيئات عضوية أخرى.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
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
