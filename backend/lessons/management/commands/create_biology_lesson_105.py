"""
Management Command for Creating Exercises for Lesson: Genetic engineering: principles and techniques (ID 105)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward


class Command(BaseCommand):
    help = 'Create exercises for "Genetic engineering: principles and techniques" - Lesson ID: 105'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            dest='delete_existing',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        lesson_id = 105
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
                'title': 'Introduction to Genetic Engineering', 'title_arabic': 'مقدمة في الهندسة الوراثية', 'difficulty': 'beginner',
                'questions': [
                    {'type': 'qcm_single', 'text': 'What is genetic engineering?', 'text_arabic': 'ما هي الهندسة الوراثية؟', 'points': 2.0, 'choices': [
                        {'text': 'The direct manipulation of an organism\'s genes using biotechnology.', 'text_arabic': 'التلاعب المباشر بجينات كائن حي باستخدام التكنولوجيا الحيوية.', 'is_correct': True},
                        {'text': 'The study of how traits are inherited.', 'text_arabic': 'دراسة كيفية توارث الصفات.', 'is_correct': False},
                        {'text': 'The process of selective breeding.', 'text_arabic': 'عملية التربية الانتقائية.', 'is_correct': False},
                        {'text': 'The classification of organisms based on their genetics.', 'text_arabic': 'تصنيف الكائنات الحية بناءً على جيناتها.', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Genetic engineering can only be performed on microorganisms.', 'text_arabic': 'لا يمكن إجراء الهندسة الوراثية إلا على الكائنات الحية الدقيقة.', 'points': 2.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}]},
                    {'type': 'qcm_single', 'text': 'An organism that has received a gene from another species is called:', 'text_arabic': 'يسمى الكائن الحي الذي تلقى جينًا من نوع آخر:', 'points': 2.0, 'choices': [
                        {'text': 'Transgenic', 'text_arabic': 'معدل وراثيًا', 'is_correct': True},
                        {'text': 'A hybrid', 'text_arabic': 'هجين', 'is_correct': False},
                        {'text': 'A clone', 'text_arabic': 'مستنسخ', 'is_correct': False},
                        {'text': 'A mutant', 'text_arabic': 'طافر', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is recombinant DNA?', 'text_arabic': 'ما هو الحمض النووي معاد التركيب؟', 'points': 3.0, 'explanation': 'DNA that has been formed artificially by combining constituents from different organisms.', 'explanation_arabic': 'حمض نووي تم تكوينه صناعياً عن طريق دمج مكونات من كائنات مختلفة.'},
                    {'type': 'qcm_single', 'text': 'Which of the following is a common application of genetic engineering?', 'text_arabic': 'أي مما يلي هو تطبيق شائع للهندسة الوراثية؟', 'points': 2.0, 'choices': [
                        {'text': 'Producing insulin for diabetics', 'text_arabic': 'إنتاج الأنسولين لمرضى السكري', 'is_correct': True},
                        {'text': 'Creating new fossil fuels', 'text_arabic': 'إنشاء أنواع جديدة من الوقود الأحفوري', 'is_correct': False},
                        {'text': 'Predicting the weather', 'text_arabic': 'التنبؤ بالطقس', 'is_correct': False},
                        {'text': 'Designing computer chips', 'text_arabic': 'تصميم رقائق الكمبيوتر', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'The goal of genetic engineering is always to create a new species.', 'text_arabic': 'الهدف من الهندسة الوراثية هو دائمًا إنشاء نوع جديد.', 'points': 2.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}]}
                ]
            },
            {
                'title': 'Tools of Genetic Engineering', 'title_arabic': 'أدوات الهندسة الوراثية', 'difficulty': 'intermediate',
                'questions': [
                    {'type': 'qcm_single', 'text': 'What are "molecular scissors" used to cut DNA at specific sequences?', 'text_arabic': 'ما هي "المقصات الجزيئية" المستخدمة لقطع الحمض النووي في تسلسلات محددة؟', 'points': 3.0, 'choices': [
                        {'text': 'Restriction enzymes', 'text_arabic': 'إنزيمات القطع', 'is_correct': True},
                        {'text': 'DNA ligase', 'text_arabic': 'ليغاز الحمض النووي', 'is_correct': False},
                        {'text': 'DNA polymerase', 'text_arabic': 'بوليميراز الحمض النووي', 'is_correct': False},
                        {'text': 'Helicase', 'text_arabic': 'هيليكاز', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is a vector in the context of genetic engineering?', 'text_arabic': 'ما هو الناقل في سياق الهندسة الوراثية؟', 'points': 4.0, 'explanation': 'A DNA molecule (often a plasmid or virus) used as a vehicle to artificially carry foreign genetic material into another cell.', 'explanation_arabic': 'جزيء DNA (غالبًا ما يكون بلازميدًا أو فيروسًا) يستخدم كوسيلة لنقل مادة وراثية غريبة بشكل مصطنع إلى خلية أخرى.'},
                    {'type': 'qcm_single', 'text': 'Which enzyme is used to join two pieces of DNA together?', 'text_arabic': 'أي إنزيم يستخدم لربط قطعتين من الحمض النووي معًا؟', 'points': 3.0, 'choices': [
                        {'text': 'DNA ligase', 'text_arabic': 'ليغاز الحمض النووي', 'is_correct': True},
                        {'text': 'Restriction enzyme', 'text_arabic': 'إنزيم القطع', 'is_correct': False},
                        {'text': 'RNA polymerase', 'text_arabic': 'بوليميراز RNA', 'is_correct': False},
                        {'text': 'Reverse transcriptase', 'text_arabic': 'الناسخ العكسي', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Plasmids are small, circular DNA molecules found in bacteria.', 'text_arabic': 'البلازميدات هي جزيئات DNA دائرية صغيرة توجد في البكتيريا.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'open_short', 'text': 'What does PCR stand for, and what is its purpose?', 'text_arabic': 'ماذا يرمز PCR، وما هو الغرض منه؟', 'points': 5.0, 'explanation': 'Polymerase Chain Reaction. It is used to amplify (make many copies of) a specific segment of DNA.', 'explanation_arabic': 'تفاعل البوليميراز المتسلسل. يستخدم لتضخيم (عمل نسخ كثيرة من) جزء معين من الحمض النووي.'},
                    {'type': 'qcm_single', 'text': 'The process of separating DNA fragments by size using an electric field is called:', 'text_arabic': 'تسمى عملية فصل شظايا الحمض النووي حسب الحجم باستخدام مجال كهربائي:', 'points': 4.0, 'choices': [
                        {'text': 'Gel electrophoresis', 'text_arabic': 'الرحلان الكهربائي الهلامي', 'is_correct': True},
                        {'text': 'PCR', 'text_arabic': 'PCR', 'is_correct': False},
                        {'text': 'Cloning', 'text_arabic': 'الاستنساخ', 'is_correct': False},
                        {'text': 'Transformation', 'text_arabic': 'التحول', 'is_correct': False},
                    ]}
                ]
            },
            {
                'title': 'The Process of Creating a GMO', 'title_arabic': 'عملية إنشاء كائن معدل وراثيًا', 'difficulty': 'intermediate',
                'questions': [
                    {'type': 'qcm_single', 'text': 'What is the first step in creating a transgenic organism?', 'text_arabic': 'ما هي الخطوة الأولى في إنشاء كائن معدل وراثيًا؟', 'points': 3.0, 'choices': [
                        {'text': 'Identify and isolate the gene of interest.', 'text_arabic': 'تحديد وعزل الجين المرغوب.', 'is_correct': True},
                        {'text': 'Insert the gene into the host organism.', 'text_arabic': 'إدخال الجين في الكائن المضيف.', 'is_correct': False},
                        {'text': 'Select for organisms that have successfully incorporated the gene.', 'text_arabic': 'اختيار الكائنات الحية التي أدمجت الجين بنجاح.', 'is_correct': False},
                        {'text': 'Clone the host organism.', 'text_arabic': 'استنساخ الكائن المضيف.', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'The same restriction enzyme must be used to cut both the gene of interest and the vector DNA.', 'text_arabic': 'يجب استخدام نفس إنزيم القطع لقطع كل من الجين المرغوب والحمض النووي للناقل.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}], 'explanation': 'This creates compatible "sticky ends" that allow the gene to be inserted into the vector.', 'explanation_arabic': 'هذا يخلق "نهايات لزجة" متوافقة تسمح بإدخال الجين في الناقل.'},
                    {'type': 'open_short', 'text': 'What is transformation in the context of bacteria?', 'text_arabic': 'ما هو التحول في سياق البكتيريا؟', 'points': 4.0, 'explanation': 'The process by which a bacterial cell takes up foreign DNA from its environment.', 'explanation_arabic': 'العملية التي من خلالها تأخذ خلية بكتيرية حمضًا نوويًا غريبًا من بيئتها.'},
                    {'type': 'qcm_single', 'text': 'How can scientists select for bacteria that have successfully taken up a plasmid vector?', 'text_arabic': 'كيف يمكن للعلماء اختيار البكتيريا التي نجحت في امتصاص ناقل البلازميد؟', 'points': 4.0, 'choices': [
                        {'text': 'By using a plasmid that also contains an antibiotic resistance gene.', 'text_arabic': 'باستخدام بلازميد يحتوي أيضًا على جين مقاومة للمضادات الحيوية.', 'is_correct': True},
                        {'text': 'By observing the bacteria under a microscope.', 'text_arabic': 'من خلال مراقبة البكتيريا تحت المجهر.', 'is_correct': False},
                        {'text': 'By measuring the size of the bacteria.', 'text_arabic': 'عن طريق قياس حجم البكتيريا.', 'is_correct': False},
                        {'text': 'All bacteria will take up the plasmid.', 'text_arabic': 'جميع البكتيريا ستمتص البلازميد.', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'Name a method used to introduce foreign DNA into animal cells.', 'text_arabic': 'اذكر طريقة تستخدم لإدخال الحمض النووي الغريب في الخلايا الحيوانية.', 'points': 5.0, 'explanation': 'Microinjection, electroporation, or using a viral vector.', 'explanation_arabic': 'الحقن المجهري، أو التثقيب الكهربائي، أو استخدام ناقل فيروسي.'},
                    {'type': 'true_false', 'text': 'Once a gene is inserted into a host, it is automatically expressed.', 'text_arabic': 'بمجرد إدخال الجين في المضيف، يتم التعبير عنه تلقائيًا.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'The gene needs the correct promoter and other regulatory sequences to be expressed.', 'explanation_arabic': 'يحتاج الجين إلى المحفز الصحيح والتسلسلات التنظيمية الأخرى ليتم التعبير عنه.'}
                ]
            },
            {
                'title': 'Applications of Genetic Engineering', 'title_arabic': 'تطبيقات الهندسة الوراثية', 'difficulty': 'advanced',
                'questions': [
                    {'type': 'qcm_single', 'text': 'Golden Rice is a genetically modified crop designed to produce:', 'text_arabic': 'الأرز الذهبي هو محصول معدل وراثيًا مصمم لإنتاج:', 'points': 4.0, 'choices': [
                        {'text': 'Beta-carotene (a precursor to Vitamin A)', 'text_arabic': 'بيتا كاروتين (مقدمة لفيتامين أ)', 'is_correct': True},
                        {'text': 'More protein', 'text_arabic': 'المزيد من البروتين', 'is_correct': False},
                        {'text': 'Resistance to herbicides', 'text_arabic': 'مقاومة لمبيدات الأعشاب', 'is_correct': False},
                        {'text': 'Larger grains', 'text_arabic': 'حبوب أكبر', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is gene therapy?', 'text_arabic': 'ما هو العلاج الجيني؟', 'points': 5.0, 'explanation': 'An experimental technique that uses genes to treat or prevent disease.', 'explanation_arabic': 'تقنية تجريبية تستخدم الجينات لعلاج الأمراض أو الوقاية منها.'},
                    {'type': 'qcm_single', 'text': 'The CRISPR-Cas9 system is a powerful tool for:', 'text_arabic': 'نظام CRISPR-Cas9 هو أداة قوية لـ:', 'points': 5.0, 'choices': [
                        {'text': 'Editing genes with high precision', 'text_arabic': 'تحرير الجينات بدقة عالية', 'is_correct': True},
                        {'text': 'Amplifying DNA', 'text_arabic': 'تضخيم الحمض النووي', 'is_correct': False},
                        {'text': 'Separating proteins', 'text_arabic': 'فصل البروتينات', 'is_correct': False},
                        {'text': 'Sequencing genomes', 'text_arabic': 'تحديد تسلسل الجينوم', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'DNA fingerprinting uses unique patterns in an individual\'s DNA for identification.', 'text_arabic': 'تستخدم بصمة الحمض النووي أنماطًا فريدة في الحمض النووي للفرد لتحديد الهوية.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'open_short', 'text': 'Name one benefit of creating herbicide-resistant crops.', 'text_arabic': 'اذكر فائدة واحدة لإنشاء محاصيل مقاومة لمبيدات الأعشاب.', 'points': 5.0, 'explanation': 'It allows farmers to spray herbicides to kill weeds without harming their crops, potentially increasing yield.', 'explanation_arabic': 'يسمح للمزارعين برش مبيدات الأعشاب لقتل الحشائش دون الإضرار بمحاصيلهم، مما قد يزيد من المحصول.'},
                    {'type': 'qcm_single', 'text': 'The production of human proteins (like insulin) in bacteria is an example of:', 'text_arabic': 'إنتاج البروتينات البشرية (مثل الأنسولين) في البكتيريا هو مثال على:', 'points': 4.0, 'choices': [
                        {'text': 'Pharmaceutical application of genetic engineering', 'text_arabic': 'تطبيق صيدلاني للهندسة الوراثية', 'is_correct': True},
                        {'text': 'Agricultural application of genetic engineering', 'text_arabic': 'تطبيق زراعي للهندسة الوراثية', 'is_correct': False},
                        {'text': 'Gene therapy', 'text_arabic': 'العلاج الجيني', 'is_correct': False},
                        {'text': 'Forensic science', 'text_arabic': 'علم الطب الشرعي', 'is_correct': False},
                    ]}
                ]
            },
            {
                'title': 'Ethical and Safety Considerations', 'title_arabic': 'الاعتبارات الأخلاقية والسلامة', 'difficulty': 'advanced',
                'questions': [
                    {'type': 'qcm_single', 'text': 'Which of the following is a potential environmental concern related to GMOs?', 'text_arabic': 'أي مما يلي هو مصدر قلق بيئي محتمل يتعلق بالكائنات المعدلة وراثيًا؟', 'points': 4.0, 'choices': [
                        {'text': 'The potential for gene flow to wild relatives.', 'text_arabic': 'احتمال تدفق الجينات إلى الأقارب البرية.', 'is_correct': True},
                        {'text': 'GMOs are always less nutritious.', 'text_arabic': 'الكائنات المعدلة وراثيًا دائمًا أقل قيمة غذائية.', 'is_correct': False},
                        {'text': 'GMOs consume more water than non-GMO crops.', 'text_arabic': 'تستهلك الكائنات المعدلة وراثيًا مياهًا أكثر من المحاصيل غير المعدلة وراثيًا.', 'is_correct': False},
                        {'text': 'GMOs cannot reproduce.', 'text_arabic': 'لا يمكن للكائنات المعدلة وراثيًا التكاثر.', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is a potential ethical concern regarding human gene therapy?', 'text_arabic': 'ما هو مصدر القلق الأخلاقي المحتمل فيما يتعلق بالعلاج الجيني البشري؟', 'points': 6.0, 'explanation': 'Concerns about "designer babies," the distinction between therapy and enhancement, and the safety of altering the human germline.', 'explanation_arabic': 'مخاوف بشأن "الأطفال المصممين"، والتمييز بين العلاج والتحسين، وسلامة تغيير السلالة الجرثومية البشرية.'},
                    {'type': 'true_false', 'text': 'There is a broad scientific consensus that currently approved GMO foods are safe to eat.', 'text_arabic': 'هناك إجماع علمي واسع على أن الأطعمة المعدلة وراثيًا المعتمدة حاليًا آمنة للأكل.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'qcm_single', 'text': 'The creation of "superweeds" that are resistant to herbicides is a potential risk associated with:', 'text_arabic': 'إنشاء "الأعشاب الخارقة" المقاومة لمبيدات الأعشاب هو خطر محتمل مرتبط بـ:', 'points': 5.0, 'choices': [
                        {'text': 'The widespread use of herbicide-resistant crops.', 'text_arabic': 'الاستخدام الواسع النطاق للمحاصيل المقاومة لمبيدات الأعشاب.', 'is_correct': True},
                        {'text': 'The production of insulin in bacteria.', 'text_arabic': 'إنتاج الأنسولين في البكتيريا.', 'is_correct': False},
                        {'text': 'Gene therapy.', 'text_arabic': 'العلاج الجيني.', 'is_correct': False},
                        {'text': 'DNA fingerprinting.', 'text_arabic': 'بصمة الحمض النووي.', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'Why is labeling of GMO foods a controversial topic?', 'text_arabic': 'لماذا يعتبر وضع العلامات على الأطعمة المعدلة وراثيًا موضوعًا مثيرًا للجدل؟', 'points': 5.0, 'explanation': 'Proponents argue for the consumer\'s right to know, while opponents argue it may imply a safety risk that doesn\'t exist and increase costs.', 'explanation_arabic': 'يجادل المؤيدون بحق المستهلك في المعرفة، بينما يجادل المعارضون بأنه قد يوحي بوجود خطر على السلامة غير موجود ويزيد من التكاليف.'},
                    {'type': 'true_false', 'text': 'Germline gene therapy involves making genetic changes that can be passed on to future generations.', 'text_arabic': 'يتضمن العلاج الجيني للسلالة الجرثومية إجراء تغييرات وراثية يمكن أن تنتقل إلى الأجيال القادمة.', 'points': 5.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]}
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
