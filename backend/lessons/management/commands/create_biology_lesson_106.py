"""
Management Command for Creating Exercises for Lesson: Transmission of genetic information through sexual reproduction (ID 106)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward


class Command(BaseCommand):
    help = 'Create exercises for "Transmission of genetic information through sexual reproduction" - Lesson ID: 106'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            dest='delete_existing',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        lesson_id = 106
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
                'title': 'Meiosis and Gamete Formation', 'title_arabic': 'الانقسام الاختزالي وتكوين الأمشاج', 'difficulty': 'beginner',
                'questions': [
                    {'type': 'qcm_single', 'text': 'What is the primary purpose of meiosis?', 'text_arabic': 'ما هو الغرض الأساسي من الانقسام الاختزالي؟', 'points': 2.0, 'choices': [
                        {'text': 'To produce haploid gametes', 'text_arabic': 'لإنتاج أمشاج أحادية الصيغة الصبغية', 'is_correct': True},
                        {'text': 'To produce diploid somatic cells', 'text_arabic': 'لإنتاج خلايا جسدية ثنائية الصيغة الصبغية', 'is_correct': False},
                        {'text': 'To repair damaged tissues', 'text_arabic': 'لإصلاح الأنسجة التالفة', 'is_correct': False},
                        {'text': 'To grow the organism', 'text_arabic': 'لنمو الكائن الحي', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'A human gamete (sperm or egg) contains 46 chromosomes.', 'text_arabic': 'يحتوي المشيج البشري (الحيوان المنوي أو البويضة) على 46 صبغيًا.', 'points': 2.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'It contains 23 chromosomes.', 'explanation_arabic': 'يحتوي على 23 صبغيًا.'},
                    {'type': 'qcm_single', 'text': 'How many cell divisions occur in meiosis?', 'text_arabic': 'كم عدد الانقسامات الخلوية التي تحدث في الانقسام الاختزالي؟', 'points': 2.0, 'choices': [
                        {'text': 'Two', 'text_arabic': 'اثنان', 'is_correct': True},
                        {'text': 'One', 'text_arabic': 'واحد', 'is_correct': False},
                        {'text': 'Three', 'text_arabic': 'ثلاثة', 'is_correct': False},
                        {'text': 'Four', 'text_arabic': 'أربعة', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is a cell with a full set of chromosomes (2n) called?', 'text_arabic': 'ماذا تسمى الخلية التي تحتوي على مجموعة كاملة من الصبغيات (2n)؟', 'points': 3.0, 'explanation': 'Diploid', 'explanation_arabic': 'ثنائية الصيغة الصبغية'},
                    {'type': 'qcm_single', 'text': 'The result of meiosis is the formation of:', 'text_arabic': 'نتيجة الانقسام الاختزالي هي تكوين:', 'points': 2.0, 'choices': [
                        {'text': 'Four genetically different haploid cells', 'text_arabic': 'أربع خلايا أحادية الصيغة الصبغية مختلفة وراثيًا', 'is_correct': True},
                        {'text': 'Two genetically identical diploid cells', 'text_arabic': 'خليتان ثنائيتا الصيغة الصبغية متطابقتان وراثيًا', 'is_correct': False},
                        {'text': 'Four genetically identical diploid cells', 'text_arabic': 'أربع خلايا ثنائية الصيغة الصبغية متطابقة وراثيًا', 'is_correct': False},
                        {'text': 'Two genetically different haploid cells', 'text_arabic': 'خليتان أحاديتا الصيغة الصبغية مختلفتان وراثيًا', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Meiosis is a form of asexual reproduction.', 'text_arabic': 'الانقسام الاختزالي هو شكل من أشكال التكاثر اللاجنسي.', 'points': 2.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}]},
                ]
            },
            {
                'title': 'Genetic Variation in Meiosis', 'title_arabic': 'التنوع الوراثي في الانقسام الاختزالي', 'difficulty': 'intermediate',
                'questions': [
                    {'type': 'qcm_single', 'text': 'The exchange of genetic material between homologous chromosomes during Prophase I is called:', 'text_arabic': 'يسمى تبادل المادة الوراثية بين الصبغيات المتماثلة خلال الطور التمهيدي الأول:', 'points': 3.0, 'choices': [
                        {'text': 'Crossing over', 'text_arabic': 'العبور', 'is_correct': True},
                        {'text': 'Independent assortment', 'text_arabic': 'التوزيع المستقل', 'is_correct': False},
                        {'text': 'Fertilization', 'text_arabic': 'الإخصاب', 'is_correct': False},
                        {'text': 'Cytokinesis', 'text_arabic': 'انقسام السيتوبلازم', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is independent assortment?', 'text_arabic': 'ما هو التوزيع المستقل؟', 'points': 4.0, 'explanation': 'The random orientation of homologous chromosome pairs at the metaphase plate during Metaphase I.', 'explanation_arabic': 'التوجه العشوائي لأزواج الصبغيات المتماثلة عند الصفيحة الاستوائية خلال الطور الاستوائي الأول.'},
                    {'type': 'qcm_single', 'text': 'During which phase of meiosis does crossing over occur?', 'text_arabic': 'خلال أي طور من أطوار الانقسام الاختزالي يحدث العبور؟', 'points': 3.0, 'choices': [
                        {'text': 'Prophase I', 'text_arabic': 'الطور التمهيدي الأول', 'is_correct': True},
                        {'text': 'Metaphase I', 'text_arabic': 'الطور الاستوائي الأول', 'is_correct': False},
                        {'text': 'Anaphase II', 'text_arabic': 'الطور الانفصالي الثاني', 'is_correct': False},
                        {'text': 'Prophase II', 'text_arabic': 'الطور التمهيدي الثاني', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'Crossing over creates new combinations of alleles on a chromosome.', 'text_arabic': 'يخلق العبور تركيبات جديدة من الأليلات على الصبغي.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'open_short', 'text': 'Besides crossing over and independent assortment, what is the third major source of genetic variation in sexual reproduction?', 'text_arabic': 'إلى جانب العبور والتوزيع المستقل، ما هو المصدر الرئيسي الثالث للتنوع الوراثي في التكاثر الجنسي؟', 'points': 5.0, 'explanation': 'Random fertilization (the random fusion of gametes).', 'explanation_arabic': 'الإخصاب العشوائي (الاندماج العشوائي للأمشاج).'},
                    {'type': 'qcm_single', 'text': 'Homologous chromosomes separate during which phase of meiosis?', 'text_arabic': 'تنفصل الصبغيات المتماثلة خلال أي طور من أطوار الانقسام الاختزالي؟', 'points': 4.0, 'choices': [
                        {'text': 'Anaphase I', 'text_arabic': 'الطور الانفصالي الأول', 'is_correct': True},
                        {'text': 'Anaphase II', 'text_arabic': 'الطور الانفصالي الثاني', 'is_correct': False},
                        {'text': 'Metaphase I', 'text_arabic': 'الطور الاستوائي الأول', 'is_correct': False},
                        {'text': 'Telophase II', 'text_arabic': 'الطور النهائي الثاني', 'is_correct': False},
                    ]},
                ]
            },
            {
                'title': 'Fertilization and Zygote Formation', 'title_arabic': 'الإخصاب وتكوين الزيجوت', 'difficulty': 'intermediate',
                'questions': [
                    {'type': 'qcm_single', 'text': 'What is fertilization?', 'text_arabic': 'ما هو الإخصاب؟', 'points': 3.0, 'choices': [
                        {'text': 'The fusion of a male and a female gamete.', 'text_arabic': 'اندماج مشيج ذكري وأنثوي.', 'is_correct': True},
                        {'text': 'The process of cell division.', 'text_arabic': 'عملية انقسام الخلية.', 'is_correct': False},
                        {'text': 'The development of an embryo.', 'text_arabic': 'تطور الجنين.', 'is_correct': False},
                        {'text': 'The production of sperm.', 'text_arabic': 'إنتاج الحيوانات المنوية.', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'A zygote is a haploid cell.', 'text_arabic': 'الزيجوت هو خلية أحادية الصيغة الصبغية.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'A zygote is diploid (2n), formed by the fusion of two haploid (n) gametes.', 'explanation_arabic': 'الزيجوت ثنائي الصيغة الصبغية (2n)، يتكون من اندماج مشيجين أحاديي الصيغة الصبغية (n).'},
                    {'type': 'open_short', 'text': 'What process does the zygote undergo to develop into a multicellular organism?', 'text_arabic': 'ما هي العملية التي يخضع لها الزيجوت ليتطور إلى كائن متعدد الخلايا؟', 'points': 4.0, 'explanation': 'Mitosis', 'explanation_arabic': 'الانقسام المتساوي'},
                    {'type': 'qcm_single', 'text': 'Fertilization restores the ________ number of chromosomes.', 'text_arabic': 'يعيد الإخصاب العدد ________ من الصبغيات.', 'points': 3.0, 'choices': [
                        {'text': 'diploid', 'text_arabic': 'ثنائي الصيغة الصبغية', 'is_correct': True},
                        {'text': 'haploid', 'text_arabic': 'أحادي الصيغة الصبغية', 'is_correct': False},
                        {'text': 'triploid', 'text_arabic': 'ثلاثي الصيغة الصبغية', 'is_correct': False},
                        {'text': 'polyploid', 'text_arabic': 'متعدد الصيغ الصبغية', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'Where does fertilization typically occur in humans?', 'text_arabic': 'أين يحدث الإخصاب عادة عند البشر؟', 'points': 4.0, 'explanation': 'In the fallopian tube (oviduct).', 'explanation_arabic': 'في قناة فالوب (قناة البيض).'},
                    {'type': 'true_false', 'text': 'The genetic makeup of the zygote is identical to one of its parents.', 'text_arabic': 'التركيب الوراثي للزيجوت مطابق لأحد والديه.', 'points': 3.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True}], 'explanation': 'It is a unique combination of genes from both parents.', 'explanation_arabic': 'إنه مزيج فريد من جينات كلا الوالدين.'},
                ]
            },
            {
                'title': 'Comparing Mitosis and Meiosis', 'title_arabic': 'مقارنة بين الانقسام المتساوي والانقسام الاختزالي', 'difficulty': 'advanced',
                'questions': [
                    {'type': 'qcm_single', 'text': 'Which of the following is a key difference between mitosis and meiosis?', 'text_arabic': 'أي مما يلي هو فرق رئيسي بين الانقسام المتساوي والانقسام الاختزالي؟', 'points': 4.0, 'choices': [
                        {'text': 'Meiosis produces haploid cells, while mitosis produces diploid cells.', 'text_arabic': 'ينتج الانقسام الاختزالي خلايا أحادية الصيغة الصبغية، بينما ينتج الانقسام المتساوي خلايا ثنائية الصيغة الصبغية.', 'is_correct': True},
                        {'text': 'Mitosis involves two cell divisions, while meiosis involves one.', 'text_arabic': 'يتضمن الانقسام المتساوي انقسامين خلويين، بينما يتضمن الانقسام الاختزالي واحدًا.', 'is_correct': False},
                        {'text': 'The daughter cells of mitosis are genetically different, while those of meiosis are identical.', 'text_arabic': 'الخلايا الوليدة للانقسام المتساوي مختلفة وراثيًا، بينما خلايا الانقسام الاختزالي متطابقة.', 'is_correct': False},
                        {'text': 'Mitosis occurs in gametes, while meiosis occurs in somatic cells.', 'text_arabic': 'يحدث الانقسام المتساوي في الأمشاج، بينما يحدث الانقسام الاختزالي في الخلايا الجسدية.', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'Does crossing over occur in mitosis?', 'text_arabic': 'هل يحدث العبور في الانقسام المتساوي؟', 'points': 4.0, 'explanation': 'No, crossing over is unique to Meiosis I.', 'explanation_arabic': 'لا، العبور فريد من نوعه في الانقسام الاختزالي الأول.'},
                    {'type': 'qcm_single', 'text': 'How do homologous chromosomes behave differently in Metaphase I of meiosis compared to Metaphase of mitosis?', 'text_arabic': 'كيف تتصرف الصبغيات المتماثلة بشكل مختلف في الطور الاستوائي الأول من الانقسام الاختزالي مقارنة بالطور الاستوائي من الانقسام المتساوي؟', 'points': 5.0, 'choices': [
                        {'text': 'In meiosis, they pair up at the metaphase plate; in mitosis, they line up individually.', 'text_arabic': 'في الانقسام الاختزالي، تتزاوج عند الصفيحة الاستوائية؛ في الانقسام المتساوي، تصطف بشكل فردي.', 'is_correct': True},
                        {'text': 'In mitosis, they pair up at the metaphase plate; in meiosis, they line up individually.', 'text_arabic': 'في الانقسام المتساوي، تتزاوج عند الصفيحة الاستوائية؛ في الانقسام الاختزالي، تصطف بشكل فردي.', 'is_correct': False},
                        {'text': 'There is no difference in their behavior.', 'text_arabic': 'لا يوجد فرق في سلوكهم.', 'is_correct': False},
                        {'text': 'They do not go to the metaphase plate in meiosis.', 'text_arabic': 'لا تذهب إلى الصفيحة الاستوائية في الانقسام الاختزالي.', 'is_correct': False},
                    ]},
                    {'type': 'true_false', 'text': 'The purpose of mitosis is growth and repair, while the purpose of meiosis is sexual reproduction.', 'text_arabic': 'الغرض من الانقسام المتساوي هو النمو والإصلاح، بينما الغرض من الانقسام الاختزالي هو التكاثر الجنسي.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'open_short', 'text': 'What separates during Anaphase I of meiosis versus Anaphase of mitosis?', 'text_arabic': 'ما الذي ينفصل خلال الطور الانفصالي الأول من الانقسام الاختزالي مقابل الطور الانفصالي من الانقسام المتساوي؟', 'points': 6.0, 'explanation': 'In Anaphase I, homologous chromosomes separate. In Anaphase of mitosis, sister chromatids separate.', 'explanation_arabic': 'في الطور الانفصالي الأول، تنفصل الصبغيات المتماثلة. في الطور الانفصالي من الانقسام المتساوي، تنفصل الكروماتيدات الشقيقة.'},
                    {'type': 'qcm_single', 'text': 'Starting with one diploid cell, mitosis results in:', 'text_arabic': 'بدءًا من خلية ثنائية الصيغة الصبغية واحدة، ينتج عن الانقسام المتساوي:', 'points': 4.0, 'choices': [
                        {'text': 'Two diploid cells', 'text_arabic': 'خليتان ثنائيتا الصيغة الصبغية', 'is_correct': True},
                        {'text': 'Four haploid cells', 'text_arabic': 'أربع خلايا أحادية الصيغة الصبغية', 'is_correct': False},
                        {'text': 'Two haploid cells', 'text_arabic': 'خليتان أحاديتا الصيغة الصبغية', 'is_correct': False},
                        {'text': 'Four diploid cells', 'text_arabic': 'أربع خلايا ثنائية الصيغة الصبغية', 'is_correct': False},
                    ]},
                ]
            },
            {
                'title': 'Life Cycles', 'title_arabic': 'دورات الحياة', 'difficulty': 'advanced',
                'questions': [
                    {'type': 'qcm_single', 'text': 'In the human life cycle, which stage is multicellular?', 'text_arabic': 'في دورة حياة الإنسان، أي مرحلة تكون متعددة الخلايا؟', 'points': 4.0, 'choices': [
                        {'text': 'The diploid stage', 'text_arabic': 'المرحلة ثنائية الصيغة الصبغية', 'is_correct': True},
                        {'text': 'The haploid stage', 'text_arabic': 'المرحلة أحادية الصيغة الصبغية', 'is_correct': False},
                        {'text': 'Both diploid and haploid stages', 'text_arabic': 'كل من المرحلتين ثنائية وأحادية الصيغة الصبغية', 'is_correct': False},
                        {'text': 'Neither stage is multicellular', 'text_arabic': 'لا توجد مرحلة متعددة الخلايا', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'What is "alternation of generations" in plant life cycles?', 'text_arabic': 'ما هو "تعاقب الأجيال" في دورات حياة النبات؟', 'points': 5.0, 'explanation': 'A life cycle that includes both a multicellular diploid stage (sporophyte) and a multicellular haploid stage (gametophyte).', 'explanation_arabic': 'دورة حياة تتضمن كلاً من مرحلة ثنائية الصيغة الصبغية متعددة الخلايا (النبات البوغي) ومرحلة أحادية الصيغة الصبغية متعددة الخلايا (النبات المشيجي).'},
                    {'type': 'true_false', 'text': 'In fungi, the dominant part of the life cycle is often haploid.', 'text_arabic': 'في الفطريات، غالبًا ما يكون الجزء السائد من دورة الحياة أحادي الصيغة الصبغية.', 'points': 4.0, 'choices': [{'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True}, {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False}]},
                    {'type': 'qcm_single', 'text': 'In plants, the sporophyte produces ________ by ________.', 'text_arabic': 'في النباتات، ينتج النبات البوغي ________ عن طريق ________.', 'points': 5.0, 'choices': [
                        {'text': 'spores; meiosis', 'text_arabic': 'أبواغ؛ الانقسام الاختزالي', 'is_correct': True},
                        {'text': 'gametes; mitosis', 'text_arabic': 'أمشاج؛ الانقسام المتساوي', 'is_correct': False},
                        {'text': 'spores; mitosis', 'text_arabic': 'أبواغ؛ الانقسام المتساوي', 'is_correct': False},
                        {'text': 'gametes; meiosis', 'text_arabic': 'أمشاج؛ الانقسام الاختزالي', 'is_correct': False},
                    ]},
                    {'type': 'open_short', 'text': 'In the human life cycle, what are the only haploid cells?', 'text_arabic': 'في دورة حياة الإنسان، ما هي الخلايا الوحيدة أحادية الصيغة الصبغية؟', 'points': 5.0, 'explanation': 'Gametes (sperm and egg cells).', 'explanation_arabic': 'الأمشاج (الحيوانات المنوية والبويضات).'},
                    {'type': 'qcm_single', 'text': 'In plants, the gametophyte produces ________ by ________.', 'text_arabic': 'في النباتات، ينتج النبات المشيجي ________ عن طريق ________.', 'points': 5.0, 'choices': [
                        {'text': 'gametes; mitosis', 'text_arabic': 'أمشاج؛ الانقسام المتساوي', 'is_correct': True},
                        {'text': 'spores; meiosis', 'text_arabic': 'أبواغ؛ الانقسام الاختزالي', 'is_correct': False},
                        {'text': 'gametes; meiosis', 'text_arabic': 'أمشاج؛ الانقسام الاختزالي', 'is_correct': False},
                        {'text': 'spores; mitosis', 'text_arabic': 'أبواغ؛ الانقسام المتساوي', 'is_correct': False},
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
