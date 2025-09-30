"""
Management Command for Creating Exercises for Lesson: Consumption of organic matter and energy flow (ID 100)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward


class Command(BaseCommand):
    help = 'Create exercises for "Consumption of organic matter and energy flow" - Lesson ID: 100'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            dest='delete_existing',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        lesson_id = 100
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
                'title': 'Trophic Levels and Food Chains', 'title_arabic': 'المستويات الغذائية والسلاسل الغذائية', 'difficulty': 'beginner',
                'questions': [
                    {'type': 'qcm_single', 'text': 'Which organism is at the start of a food chain?', 'text_arabic': 'أي كائن حي يوجد في بداية السلسلة الغذائية؟', 'points': 2.0, 'choices': [
                        {'text': 'Producer', 'text_arabic': 'منتج', 'is_correct': True},
                        {'text': 'Primary Consumer', 'text_arabic': 'مستهلك أولي', 'is_correct': False},
                        {'text': 'Decomposer', 'text_arabic': 'محلل', 'is_correct': False},
                        {'text': 'Secondary Consumer', 'text_arabic': 'مستهلك ثانوي', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'A herbivore is a primary consumer.', 'text_arabic': 'الحيوان العاشب هو مستهلك أولي.', 'points': 2.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'qcm_single', 'text': 'What is the main source of energy for most ecosystems on Earth?', 'text_arabic': 'ما هو المصدر الرئيسي للطاقة لمعظم النظم البيئية على الأرض؟', 'points': 2.0, 'choices': [
                        {'text': 'The Sun', 'text_arabic': 'الشمس', 'is_correct': True},
                        {'text': 'Geothermal heat', 'text_arabic': 'الحرارة الجوفية', 'is_correct': False},
                        {'text': 'Chemical reactions', 'text_arabic': 'التفاعلات الكيميائية', 'is_correct': False},
                        {'text': 'Wind', 'text_arabic': 'الرياح', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What term describes an organism that eats both plants and animals?', 'text_arabic': 'ما هو المصطلح الذي يصف كائناً يأكل النباتات والحيوانات؟', 'points': 3.0, 'explanation': 'Omnivore', 'explanation_arabic': 'آكل اللحوم والنباتات (قارت)'},
                    {'type': 'qcm_single', 'text': 'In a food chain, which level has the most energy?', 'text_arabic': 'في السلسلة الغذائية، أي مستوى لديه أكبر قدر من الطاقة؟', 'points': 2.0, 'choices': [
                        {'text': 'Producers', 'text_arabic': 'المنتجون', 'is_correct': True},
                        {'text': 'Primary Consumers', 'text_arabic': 'المستهلكون الأوليون', 'is_correct': False},
                        {'text': 'Secondary Consumers', 'text_arabic': 'المستهلكون الثانويون', 'is_correct': False},
                        {'text': 'Tertiary Consumers', 'text_arabic': 'المستهلكون الثالثيون', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Decomposers break down dead organic matter.', 'text_arabic': 'المحللات تحلل المواد العضوية الميتة.', 'points': 2.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                ]
            },
            {
                'title': 'Energy Flow in Ecosystems', 'title_arabic': 'تدفق الطاقة في النظم البيئية', 'difficulty': 'intermediate',
                'questions': [
                    {'type': 'qcm_single', 'text': 'Approximately what percentage of energy is transferred from one trophic level to the next?', 'text_arabic': 'ما هي النسبة المئوية التقريبية للطاقة التي تنتقل من مستوى غذائي إلى آخر؟', 'points': 3.0, 'choices': [
                        {'text': '10%', 'text_arabic': '10%', 'is_correct': True},
                        {'text': '50%', 'text_arabic': '50%', 'is_correct': False},
                        {'text': '90%', 'text_arabic': '90%', 'is_correct': False},
                        {'text': '100%', 'text_arabic': '100%', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What happens to the energy that is not transferred to the next trophic level?', 'text_arabic': 'ماذا يحدث للطاقة التي لا تنتقل إلى المستوى الغذائي التالي؟', 'points': 4.0, 'explanation': 'It is lost as heat, used for metabolic processes, or remains in uneaten parts.', 'explanation_arabic': 'تفقد على شكل حرارة، أو تستخدم في العمليات الأيضية، أو تبقى في الأجزاء غير المأكولة.'},
                    {'type': 'qcm_single', 'text': 'A diagram that shows the amount of energy at each trophic level is called:', 'text_arabic': 'الرسم البياني الذي يوضح كمية الطاقة في كل مستوى غذائي يسمى:', 'points': 3.0, 'choices': [
                        {'text': 'An energy pyramid', 'text_arabic': 'هرم الطاقة', 'is_correct': True},
                        {'text': 'A food web', 'text_arabic': 'شبكة غذائية', 'is_correct': False},
                        {'text': 'A biomass pyramid', 'text_arabic': 'هرم الكتلة الحيوية', 'is_correct': False},
                        {'text': 'A numbers pyramid', 'text_arabic': 'هرم الأعداد', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Energy flows in a one-way direction through an ecosystem.', 'text_arabic': 'تتدفق الطاقة في اتجاه واحد عبر النظام البيئي.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'open_short', 'text': 'If producers in an ecosystem have 10,000 kcal of energy, how much energy will be available to the secondary consumers?', 'text_arabic': 'إذا كان لدى المنتجين في نظام بيئي 10,000 سعرة حرارية من الطاقة، فما كمية الطاقة التي ستكون متاحة للمستهلكين الثانويين؟', 'points': 5.0, 'explanation': '100 kcal. (10% to primary, then 10% of that to secondary)', 'explanation_arabic': '100 سعرة حرارية. (10% إلى المستهلكين الأوليين، ثم 10% من ذلك إلى الثانويين)'},
                    {'type': 'qcm_single', 'text': 'The process by which producers create their own food using sunlight is called:', 'text_arabic': 'العملية التي يقوم بها المنتجون بإنتاج طعامهم باستخدام ضوء الشمس تسمى:', 'points': 3.0, 'choices': [
                        {'text': 'Photosynthesis', 'text_arabic': 'التركيب الضوئي', 'is_correct': True},
                        {'text': 'Respiration', 'text_arabic': 'التنفس', 'is_correct': False},
                        {'text': 'Chemosynthesis', 'text_arabic': 'التركيب الكيميائي', 'is_correct': False},
                        {'text': 'Decomposition', 'text_arabic': 'التحلل', 'is_correct': False},
                    ]},
                ]
            },
            {
                'title': 'Food Webs and Ecological Pyramids', 'title_arabic': 'الشبكات الغذائية والأهرامات البيئية', 'difficulty': 'intermediate',
                'questions': [
                    {'type': 'qcm_single', 'text': 'What is the main difference between a food chain and a food web?', 'text_arabic': 'ما هو الفرق الرئيسي بين السلسلة الغذائية والشبكة الغذائية؟', 'points': 3.0, 'choices': [
                        {'text': 'A food web shows multiple interconnected food chains.', 'text_arabic': 'تظهر الشبكة الغذائية سلاسل غذائية متعددة ومترابطة.', 'is_correct': True},
                        {'text': 'A food chain is more complex than a food web.', 'text_arabic': 'السلسلة الغذائية أكثر تعقيدًا من الشبكة الغذائية.', 'is_correct': False},
                        {'text': 'A food web only includes producers and consumers.', 'text_arabic': 'تتضمن الشبكة الغذائية المنتجين والمستهلكين فقط.', 'is_correct': False},
                        {'text': 'A food chain shows the flow of energy, but a food web does not.', 'text_arabic': 'تظهر السلسلة الغذائية تدفق الطاقة، لكن الشبكة الغذائية لا تظهره.', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'An inverted pyramid of numbers can occur in some ecosystems.', 'text_arabic': 'يمكن أن يوجد هرم أعداد مقلوب في بعض النظم البيئية.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}], 'explanation': 'For example, one large tree (producer) can support thousands of insects (primary consumers).', 'explanation_arabic': 'على سبيل المثال، يمكن لشجرة واحدة كبيرة (منتج) أن تدعم آلاف الحشرات (مستهلكين أوليين).'},
                    {'type': 'open_short', 'text': 'What does a pyramid of biomass represent?', 'text_arabic': 'ماذا يمثل هرم الكتلة الحيوية؟', 'points': 4.0, 'explanation': 'The total dry mass of all organisms at each trophic level.', 'explanation_arabic': 'الكتلة الجافة الإجمالية لجميع الكائنات الحية في كل مستوى غذائي.'},
                    {'type': 'qcm_single', 'text': 'In a stable ecosystem, which pyramid can never be inverted?', 'text_arabic': 'في نظام بيئي مستقر، أي هرم لا يمكن أن يكون مقلوبًا أبدًا؟', 'points': 4.0, 'choices': [
                        {'text': 'Pyramid of energy', 'text_arabic': 'هرم الطاقة', 'is_correct': True},
                        {'text': 'Pyramid of numbers', 'text_arabic': 'هرم الأعداد', 'is_correct': False},
                        {'text': 'Pyramid of biomass', 'text_arabic': 'هرم الكتلة الحيوية', 'is_correct': False},
                        {'text': 'All pyramids can be inverted', 'text_arabic': 'كل الأهرامات يمكن أن تكون مقلوبة', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'An organism that feeds on dead animals is called a _____.', 'text_arabic': 'الكائن الحي الذي يتغذى على الحيوانات الميتة يسمى _____.', 'points': 3.0, 'explanation': 'Scavenger', 'explanation_arabic': 'آكل جيف'},
                    {'type': 'true_false', 'text': 'Removing a top predator from a food web can affect the populations of organisms at lower trophic levels.', 'text_arabic': 'إزالة مفترس علوي من شبكة غذائية يمكن أن يؤثر على تجمعات الكائنات الحية في المستويات الغذائية الأدنى.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                ]
            },
            {
                'title': 'Biogeochemical Cycles', 'title_arabic': 'الدورات البيوجيوكيميائية', 'difficulty': 'advanced',
                'questions': [
                    {'type': 'qcm_single', 'text': 'Which process removes carbon dioxide from the atmosphere?', 'text_arabic': 'أي عملية تزيل ثاني أكسيد الكربون من الغلاف الجوي؟', 'points': 4.0, 'choices': [
                        {'text': 'Photosynthesis', 'text_arabic': 'التركيب الضوئي', 'is_correct': True},
                        {'text': 'Respiration', 'text_arabic': 'التنفس', 'is_correct': False},
                        {'text': 'Combustion', 'text_arabic': 'الاحتراق', 'is_correct': False},
                        {'text': 'Decomposition', 'text_arabic': 'التحلل', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is the role of bacteria in the nitrogen cycle?', 'text_arabic': 'ما هو دور البكتيريا في دورة النيتروجين؟', 'points': 5.0, 'explanation': 'Nitrogen fixation, nitrification, and denitrification.', 'explanation_arabic': 'تثبيت النيتروجين، والنترجة، ونزع النتروجين.'},
                    {'type': 'qcm_single', 'text': 'The process of water vapor turning into liquid water is called:', 'text_arabic': 'تسمى عملية تحول بخار الماء إلى ماء سائل:', 'points': 4.0, 'choices': [
                        {'text': 'Condensation', 'text_arabic': 'التكثف', 'is_correct': True},
                        {'text': 'Evaporation', 'text_arabic': 'التبخر', 'is_correct': False},
                        {'text': 'Transpiration', 'text_arabic': 'النتح', 'is_correct': False},
                        {'text': 'Precipitation', 'text_arabic': 'الهطول', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Nutrients like carbon and nitrogen are recycled within an ecosystem.', 'text_arabic': 'يتم إعادة تدوير العناصر الغذائية مثل الكربون والنيتروجين داخل النظام البيئي.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'open_short', 'text': 'How do animals obtain nitrogen?', 'text_arabic': 'كيف تحصل الحيوانات على النيتروجين؟', 'points': 5.0, 'explanation': 'By eating plants or other animals that contain nitrogen.', 'explanation_arabic': 'عن طريق أكل النباتات أو الحيوانات الأخرى التي تحتوي على النيتروجين.'},
                    {'type': 'qcm_single', 'text': 'The burning of fossil fuels primarily affects which cycle?', 'text_arabic': 'يؤثر حرق الوقود الأحفوري بشكل أساسي على أي دورة؟', 'points': 4.0, 'choices': [
                        {'text': 'Carbon cycle', 'text_arabic': 'دورة الكربون', 'is_correct': True},
                        {'text': 'Nitrogen cycle', 'text_arabic': 'دورة النيتروجين', 'is_correct': False},
                        {'text': 'Water cycle', 'text_arabic': 'دورة الماء', 'is_correct': False},
                        {'text': 'Phosphorus cycle', 'text_arabic': 'دورة الفوسفور', 'is_correct': False},
                    ]},
                ]
            },
            {
                'title': 'Human Impact on Energy Flow', 'title_arabic': 'تأثير الإنسان على تدفق الطاقة', 'difficulty': 'advanced',
                'questions': [
                    {'type': 'qcm_single', 'text': 'Deforestation primarily disrupts the flow of energy by:', 'text_arabic': 'تؤدي إزالة الغابات بشكل أساسي إلى تعطيل تدفق الطاقة عن طريق:', 'points': 4.0, 'choices': [
                        {'text': 'Reducing the number of producers', 'text_arabic': 'تقليل عدد المنتجين', 'is_correct': True},
                        {'text': 'Increasing the number of decomposers', 'text_arabic': 'زيادة عدد المحللات', 'is_correct': False},
                        {'text': 'Increasing the amount of sunlight', 'text_arabic': 'زيادة كمية ضوء الشمس', 'is_correct': False},
                        {'text': 'Decreasing the number of consumers', 'text_arabic': 'تقليل عدد المستهلكين', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is biomagnification?', 'text_arabic': 'ما هو التضخم الحيوي؟', 'points': 5.0, 'explanation': 'The increasing concentration of toxins in organisms at successively higher levels in a food chain.', 'explanation_arabic': 'التركيز المتزايد للسموم في الكائنات الحية في مستويات أعلى متتالية في السلسلة الغذائية.'},
                    {'type': 'true_false', 'text': 'The introduction of invasive species can disrupt local food webs.', 'text_arabic': 'يمكن أن يؤدي إدخال الأنواع الغازية إلى تعطيل الشبكات الغذائية المحلية.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'qcm_single', 'text': 'Acid rain is primarily caused by the release of which pollutants into the atmosphere?', 'text_arabic': 'يحدث المطر الحمضي بشكل أساسي بسبب إطلاق أي ملوثات في الغلاف الجوي؟', 'points': 5.0, 'choices': [
                        {'text': 'Sulfur dioxide and nitrogen oxides', 'text_arabic': 'ثاني أكسيد الكبريت وأكاسيد النيتروجين', 'is_correct': True},
                        {'text': 'Carbon dioxide and methane', 'text_arabic': 'ثاني أكسيد الكربون والميثان', 'is_correct': False},
                        {'text': 'Ozone and chlorofluorocarbons', 'text_arabic': 'الأوزون ومركبات الكلوروفلوروكربون', 'is_correct': False},
                        {'text': 'Lead and mercury', 'text_arabic': 'الرصاص والزئبق', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'Explain how agriculture can impact energy flow in an ecosystem.', 'text_arabic': 'اشرح كيف يمكن للزراعة أن تؤثر على تدفق الطاقة في نظام بيئي.', 'points': 6.0, 'explanation': 'It simplifies ecosystems, reduces biodiversity, and diverts energy to human consumption, often using artificial energy inputs (fertilizers, pesticides).', 'explanation_arabic': 'إنها تبسط النظم البيئية، وتقلل من التنوع البيولوجي، وتحول الطاقة إلى الاستهلاك البشري، وغالبًا ما تستخدم مدخلات طاقة اصطناعية (الأسمدة والمبيدات الحشرية).'},
                    {'type': 'qcm_single', 'text': 'The greenhouse effect is the trapping of heat in the atmosphere by certain gases. Which is a major greenhouse gas?', 'text_arabic': 'تأثير الدفيئة هو احتباس الحرارة في الغلاف الجوي بواسطة غازات معينة. أي مما يلي هو غاز دفيئة رئيسي؟', 'points': 4.0, 'choices': [
                        {'text': 'Carbon Dioxide (CO2)', 'text_arabic': 'ثاني أكسيد الكربون (CO2)', 'is_correct': True},
                        {'text': 'Oxygen (O2)', 'text_arabic': 'الأكسجين (O2)', 'is_correct': False},
                        {'text': 'Nitrogen (N2)', 'text_arabic': 'النيتروجين (N2)', 'is_correct': False},
                        {'text': 'Argon (Ar)', 'text_arabic': 'الأرجون (Ar)', 'is_correct': False},
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
