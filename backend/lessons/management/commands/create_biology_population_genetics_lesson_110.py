from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Population genetics - Lesson ID: 110'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=110)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Introduction to Population Genetics',
                    'title_arabic': 'مقدمة في علم الوراثة السكانية',
                    'description': 'Basic concepts of population genetics and allele frequencies',
                    'description_arabic': 'المفاهيم الأساسية لعلم الوراثة السكانية وترددات الأليلات',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is population genetics?',
                            'question_text_arabic': 'ما هو علم الوراثة السكانية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Study of genetic variation and change in populations', 'choice_text_arabic': 'دراسة التنوع الجيني والتغيير في الجماعات', 'is_correct': True},
                                {'choice_text': 'Study of individual inheritance patterns', 'choice_text_arabic': 'دراسة أنماط الوراثة الفردية', 'is_correct': False},
                                {'choice_text': 'Study of DNA structure only', 'choice_text_arabic': 'دراسة بنية الحمض النووي فقط', 'is_correct': False},
                                {'choice_text': 'Study of protein synthesis', 'choice_text_arabic': 'دراسة تخليق البروتين', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is an allele frequency?',
                            'question_text_arabic': 'ما هو تردد الأليل؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Proportion of a specific allele in a population', 'choice_text_arabic': 'نسبة أليل محدد في الجماعة', 'is_correct': True},
                                {'choice_text': 'Number of genes in an individual', 'choice_text_arabic': 'عدد الجينات في الفرد', 'is_correct': False},
                                {'choice_text': 'Rate of gene expression', 'choice_text_arabic': 'معدل التعبير الجيني', 'is_correct': False},
                                {'choice_text': 'Speed of DNA replication', 'choice_text_arabic': 'سرعة تضاعف الحمض النووي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In a population of 100 individuals with 60 AA, 30 Aa, and 10 aa genotypes, what is the frequency of allele A?',
                            'question_text_arabic': 'في جماعة من 100 فرد بها 60 AA، 30 Aa، و 10 aa، ما تردد الأليل A؟',
                            'question_type': 'open_short',
                            'correct_answer': '0.75 or 75%'
                        },
                        {
                            'question_text': 'Population genetics only applies to large populations.',
                            'question_text_arabic': 'علم الوراثة السكانية ينطبق فقط على الجماعات الكبيرة.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        }
                    ]
                },
                {
                    'title': 'Hardy-Weinberg Principle',
                    'title_arabic': 'مبدأ هاردي-واينبرغ',
                    'description': 'Understanding Hardy-Weinberg equilibrium and its conditions',
                    'description_arabic': 'فهم توازن هاردي-واينبرغ وشروطه',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What does the Hardy-Weinberg principle state?',
                            'question_text_arabic': 'ماذا ينص مبدأ هاردي-واينبرغ؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Allele frequencies remain constant without evolutionary forces', 'choice_text_arabic': 'ترددات الأليلات تبقى ثابتة بدون قوى تطورية', 'is_correct': True},
                                {'choice_text': 'All populations evolve rapidly', 'choice_text_arabic': 'جميع الجماعات تتطور بسرعة', 'is_correct': False},
                                {'choice_text': 'Mutations always increase genetic diversity', 'choice_text_arabic': 'الطفرات تزيد دائماً التنوع الجيني', 'is_correct': False},
                                {'choice_text': 'Natural selection favors all traits equally', 'choice_text_arabic': 'الانتقاء الطبيعي يفضل جميع الصفات بالتساوي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which conditions are required for Hardy-Weinberg equilibrium?',
                            'question_text_arabic': 'ما الشروط المطلوبة لتوازن هاردي-واينبرغ؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'No mutations', 'choice_text_arabic': 'لا طفرات', 'is_correct': True},
                                {'choice_text': 'Random mating', 'choice_text_arabic': 'تزاوج عشوائي', 'is_correct': True},
                                {'choice_text': 'No gene flow', 'choice_text_arabic': 'لا تدفق جيني', 'is_correct': True},
                                {'choice_text': 'Strong natural selection', 'choice_text_arabic': 'انتقاء طبيعي قوي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the Hardy-Weinberg equation for two alleles?',
                            'question_text_arabic': 'ما معادلة هاردي-واينبرغ لأليلين؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'p² + 2pq + q² = 1', 'choice_text_arabic': 'p² + 2pq + q² = 1', 'is_correct': True},
                                {'choice_text': 'p + q = 1', 'choice_text_arabic': 'p + q = 1', 'is_correct': False},
                                {'choice_text': 'p² + q² = 1', 'choice_text_arabic': 'p² + q² = 1', 'is_correct': False},
                                {'choice_text': 'pq = 1', 'choice_text_arabic': 'pq = 1', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'If allele A has frequency 0.6, what is the expected frequency of AA genotype?',
                            'question_text_arabic': 'إذا كان تردد الأليل A هو 0.6، ما التردد المتوقع للنمط الجيني AA؟',
                            'question_type': 'open_short',
                            'correct_answer': '0.36 or 36%'
                        },
                        {
                            'question_text': 'Hardy-Weinberg equilibrium can be achieved in real populations.',
                            'question_text_arabic': 'يمكن تحقيق توازن هاردي-واينبرغ في الجماعات الحقيقية.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        }
                    ]
                },
                {
                    'title': 'Factors Affecting Allele Frequencies',
                    'title_arabic': 'العوامل المؤثرة على ترددات الأليلات',
                    'description': 'Evolutionary forces that change allele frequencies',
                    'description_arabic': 'القوى التطورية التي تغير ترددات الأليلات',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Which factor can increase genetic diversity in a population?',
                            'question_text_arabic': 'أي عامل يمكن أن يزيد التنوع الجيني في الجماعة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Gene flow (migration)', 'choice_text_arabic': 'التدفق الجيني (الهجرة)', 'is_correct': True},
                                {'choice_text': 'Genetic drift only', 'choice_text_arabic': 'الانحراف الجيني فقط', 'is_correct': False},
                                {'choice_text': 'Inbreeding', 'choice_text_arabic': 'التزاوج الداخلي', 'is_correct': False},
                                {'choice_text': 'Population isolation', 'choice_text_arabic': 'عزل الجماعة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is genetic drift?',
                            'question_text_arabic': 'ما هو الانحراف الجيني؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Random changes in allele frequencies due to sampling', 'choice_text_arabic': 'تغيرات عشوائية في ترددات الأليلات بسبب العينات', 'is_correct': True},
                                {'choice_text': 'Directional selection for beneficial traits', 'choice_text_arabic': 'انتقاء اتجاهي للصفات المفيدة', 'is_correct': False},
                                {'choice_text': 'Movement of individuals between populations', 'choice_text_arabic': 'حركة الأفراد بين الجماعات', 'is_correct': False},
                                {'choice_text': 'Changes in DNA sequence', 'choice_text_arabic': 'تغيرات في تسلسل الحمض النووي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'In which population size is genetic drift most pronounced?',
                            'question_text_arabic': 'في أي حجم جماعة يكون الانحراف الجيني أكثر وضوحاً؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Small populations', 'choice_text_arabic': 'الجماعات الصغيرة', 'is_correct': True},
                                {'choice_text': 'Large populations', 'choice_text_arabic': 'الجماعات الكبيرة', 'is_correct': False},
                                {'choice_text': 'Medium-sized populations', 'choice_text_arabic': 'الجماعات متوسطة الحجم', 'is_correct': False},
                                {'choice_text': 'Population size does not matter', 'choice_text_arabic': 'حجم الجماعة لا يهم', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Natural selection always increases allele frequencies.',
                            'question_text_arabic': 'الانتقاء الطبيعي يزيد دائماً ترددات الأليلات.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        },
                        {
                            'question_text': 'Bottleneck effects can lead to loss of genetic diversity.',
                            'question_text_arabic': 'تأثيرات عنق الزجاجة يمكن أن تؤدي إلى فقدان التنوع الجيني.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Types of Natural Selection',
                    'title_arabic': 'أنواع الانتقاء الطبيعي',
                    'description': 'Different patterns of natural selection and their effects',
                    'description_arabic': 'أنماط مختلفة من الانتقاء الطبيعي وتأثيراتها',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is directional selection?',
                            'question_text_arabic': 'ما هو الانتقاء الاتجاهي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Selection favoring one extreme phenotype', 'choice_text_arabic': 'انتقاء يفضل نمط ظاهري متطرف واحد', 'is_correct': True},
                                {'choice_text': 'Selection favoring intermediate phenotypes', 'choice_text_arabic': 'انتقاء يفضل الأنماط الظاهرية المتوسطة', 'is_correct': False},
                                {'choice_text': 'Selection favoring both extremes', 'choice_text_arabic': 'انتقاء يفضل كلا الطرفين المتطرفين', 'is_correct': False},
                                {'choice_text': 'Random selection without preference', 'choice_text_arabic': 'انتقاء عشوائي بدون تفضيل', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Stabilizing selection results in:',
                            'question_text_arabic': 'الانتقاء المثبت ينتج عنه:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Reduced phenotypic variation', 'choice_text_arabic': 'تقليل التنوع الظاهري', 'is_correct': True},
                                {'choice_text': 'Increased phenotypic variation', 'choice_text_arabic': 'زيادة التنوع الظاهري', 'is_correct': False},
                                {'choice_text': 'Shift toward one extreme', 'choice_text_arabic': 'تحول نحو طرف متطرف واحد', 'is_correct': False},
                                {'choice_text': 'Formation of two distinct groups', 'choice_text_arabic': 'تكوين مجموعتين متميزتين', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which type of selection can lead to speciation?',
                            'question_text_arabic': 'أي نوع من الانتقاء يمكن أن يؤدي إلى تكوين الأنواع؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Disruptive selection', 'choice_text_arabic': 'الانتقاء التفكيكي', 'is_correct': True},
                                {'choice_text': 'Stabilizing selection', 'choice_text_arabic': 'الانتقاء المثبت', 'is_correct': False},
                                {'choice_text': 'Sexual selection only', 'choice_text_arabic': 'الانتقاء الجنسي فقط', 'is_correct': False},
                                {'choice_text': 'Artificial selection', 'choice_text_arabic': 'الانتقاء الصناعي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Give an example of directional selection.',
                            'question_text_arabic': 'أعط مثالاً على الانتقاء الاتجاهي.',
                            'question_type': 'open_short',
                            'correct_answer': 'Peppered moth evolution, antibiotic resistance, or giraffe neck length'
                        }
                    ]
                },
                {
                    'title': 'Population Genetics Applications',
                    'title_arabic': 'تطبيقات علم الوراثة السكانية',
                    'description': 'Real-world applications of population genetics principles',
                    'description_arabic': 'التطبيقات الحقيقية لمبادئ علم الوراثة السكانية',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'How is population genetics used in conservation biology?',
                            'question_text_arabic': 'كيف يُستخدم علم الوراثة السكانية في بيولوجيا الحفظ؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'To assess genetic diversity and plan breeding programs', 'choice_text_arabic': 'لتقييم التنوع الجيني وتخطيط برامج التربية', 'is_correct': True},
                                {'choice_text': 'To increase mutation rates', 'choice_text_arabic': 'لزيادة معدلات الطفرة', 'is_correct': False},
                                {'choice_text': 'To eliminate genetic variation', 'choice_text_arabic': 'للقضاء على التنوع الجيني', 'is_correct': False},
                                {'choice_text': 'To promote inbreeding', 'choice_text_arabic': 'لتعزيز التزاوج الداخلي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the founder effect?',
                            'question_text_arabic': 'ما هو تأثير المؤسس؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Reduced genetic diversity in populations established by few individuals', 'choice_text_arabic': 'تقليل التنوع الجيني في الجماعات المؤسسة بواسطة أفراد قلائل', 'is_correct': True},
                                {'choice_text': 'Increased genetic diversity in new populations', 'choice_text_arabic': 'زيادة التنوع الجيني في الجماعات الجديدة', 'is_correct': False},
                                {'choice_text': 'Random mating in large populations', 'choice_text_arabic': 'تزاوج عشوائي في الجماعات الكبيرة', 'is_correct': False},
                                {'choice_text': 'Stable allele frequencies over time', 'choice_text_arabic': 'ترددات أليلات مستقرة عبر الزمن', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Population genetics helps in understanding disease susceptibility.',
                            'question_text_arabic': 'علم الوراثة السكانية يساعد في فهم القابلية للإصابة بالأمراض.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Calculate the heterozygote frequency if p = 0.7 and q = 0.3 in Hardy-Weinberg equilibrium.',
                            'question_text_arabic': 'احسب تردد الطفرات المتغايرة إذا كان p = 0.7 و q = 0.3 في توازن هاردي-واينبرغ.',
                            'question_type': 'open_short',
                            'correct_answer': '0.42 or 42%'
                        },
                        {
                            'question_text': 'Genetic rescue can help small populations recover genetic diversity.',
                            'question_text_arabic': 'الإنقاذ الجيني يمكن أن يساعد الجماعات الصغيرة على استعادة التنوع الجيني.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                }
            ]

            total_exercises = 0
            total_questions = 0
            total_choices = 0

            for ex_data in exercises_data:
                # Create exercise
                exercise = Exercise.objects.create(
                    lesson=lesson,
                    created_by_id=1,  # Assuming admin user with ID 1
                    title=ex_data['title'],
                    title_arabic=ex_data['title_arabic'],
                    description=ex_data['description'],
                    instructions=ex_data.get('description_arabic', ''),
                    difficulty_level=ex_data['difficulty'],
                    is_active=True
                )
                total_exercises += 1

                # Create questions for this exercise
                for q_data in ex_data['questions']:
                    question = Question.objects.create(
                        exercise=exercise,
                        question_text=q_data['question_text'],
                        question_text_arabic=q_data['question_text_arabic'],
                        question_type=q_data['question_type'],
                        points=10 if ex_data['difficulty'] == 'beginner' else 15 if ex_data['difficulty'] == 'intermediate' else 20
                    )
                    total_questions += 1

                    # Create choices for QCM questions
                    if q_data['question_type'] in ['qcm_single', 'qcm_multiple'] and 'choices' in q_data:
                        for choice_data in q_data['choices']:
                            QuestionChoice.objects.create(
                                question=question,
                                choice_text=choice_data['choice_text'],
                                choice_text_arabic=choice_data['choice_text_arabic'],
                                is_correct=choice_data['is_correct']
                            )
                            total_choices += 1

                    # Create choices for true/false questions
                    elif q_data['question_type'] == 'true_false':
                        correct_answer = q_data.get('correct_answer', 'True')
                        QuestionChoice.objects.create(
                            question=question,
                            choice_text='True',
                            choice_text_arabic='صواب',
                            is_correct=correct_answer == 'True'
                        )
                        QuestionChoice.objects.create(
                            question=question,
                            choice_text='False',
                            choice_text_arabic='خطأ',
                            is_correct=correct_answer == 'False'
                        )
                        total_choices += 2

                # Create rewards for exercise completion
                ExerciseReward.objects.create(
                    exercise=exercise,
                    completion_points=30 if ex_data['difficulty'] == 'beginner' else 50 if ex_data['difficulty'] == 'intermediate' else 70,
                    completion_coins=1,
                    perfect_score_bonus=20 if ex_data['difficulty'] == 'beginner' else 30 if ex_data['difficulty'] == 'intermediate' else 50
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created for Lesson 110 (Population genetics):\\n'
                    f'Exercises: {total_exercises}\\n'
                    f'Questions: {total_questions}\\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 110 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )