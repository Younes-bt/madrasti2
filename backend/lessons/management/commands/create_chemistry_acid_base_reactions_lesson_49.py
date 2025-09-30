from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Chemical transformations associated with acid-base - Lesson ID: 49'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=49)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Acids and Bases Definitions',
                    'title_arabic': 'تعاريف الأحماض والقواعد',
                    'description': 'Understanding the Brønsted-Lowry definitions of acids and bases.',
                    'description_arabic': 'فهم تعاريف برونستد-لوري للأحماض والقواعد.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'According to the Brønsted-Lowry theory, an acid is a:',
                            'question_text_arabic': 'وفقًا لنظرية برونستد-لوري، الحمض هو:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Proton (H⁺) donor', 'choice_text_arabic': 'مانح للبروتون (H⁺)', 'is_correct': True},
                                {'choice_text': 'Proton (H⁺) acceptor', 'choice_text_arabic': 'مستقبل للبروتون (H⁺)', 'is_correct': False},
                                {'choice_text': 'Electron pair donor', 'choice_text_arabic': 'مانح لزوج من الإلكترونات', 'is_correct': False},
                                {'choice_text': 'Electron pair acceptor', 'choice_text_arabic': 'مستقبل لزوج من الإلكترونات', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'According to the Brønsted-Lowry theory, a base is a proton (H⁺) acceptor.',
                            'question_text_arabic': 'وفقًا لنظرية برونستد-لوري، القاعدة هي مستقبل للبروتون (H⁺).',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'In the reaction NH₃ + H₂O ⇌ NH₄⁺ + OH⁻, which species acts as the Brønsted-Lowry acid?',
                            'question_text_arabic': 'في التفاعل NH₃ + H₂O ⇌ NH₄⁺ + OH⁻، أي الأنواع يعمل كحمض برونستد-لوري؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'H₂O', 'choice_text_arabic': 'H₂O', 'is_correct': True},
                                {'choice_text': 'NH₃', 'choice_text_arabic': 'NH₃', 'is_correct': False},
                                {'choice_text': 'NH₄⁺', 'choice_text_arabic': 'NH₄⁺', 'is_correct': False},
                                {'choice_text': 'OH⁻', 'choice_text_arabic': 'OH⁻', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'pH and Autoionization of Water',
                    'title_arabic': 'الأس الهيدروجيني (pH) والتأين الذاتي للماء',
                    'description': 'Understanding the pH scale and the ion product of water.',
                    'description_arabic': 'فهم مقياس الأس الهيدروجيني والجداء الأيوني للماء.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the definition of pH?',
                            'question_text_arabic': 'ما هو تعريف الأس الهيدروجيني (pH)؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'pH = -log[H₃O⁺]', 'choice_text_arabic': 'pH = -log[H₃O⁺]', 'is_correct': True},
                                {'choice_text': 'pH = log[H₃O⁺]', 'choice_text_arabic': 'pH = log[H₃O⁺]', 'is_correct': False},
                                {'choice_text': 'pH = -log[OH⁻]', 'choice_text_arabic': 'pH = -log[OH⁻]', 'is_correct': False},
                                {'choice_text': 'pH = [H₃O⁺] / [OH⁻]', 'choice_text_arabic': 'pH = [H₃O⁺] / [OH⁻]', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A solution with a pH of 3 is acidic.',
                            'question_text_arabic': 'محلول له أس هيدروجيني يساوي 3 هو محلول حمضي.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the value of the ion product of water (Kw) at 25°C?',
                            'question_text_arabic': 'ما هي قيمة الجداء الأيوني للماء (Kw) عند 25 درجة مئوية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '1.0 x 10⁻¹⁴', 'choice_text_arabic': '1.0 x 10⁻¹⁴', 'is_correct': True},
                                {'choice_text': '1.0 x 10⁻⁷', 'choice_text_arabic': '1.0 x 10⁻⁷', 'is_correct': False},
                                {'choice_text': '7.0', 'choice_text_arabic': '7.0', 'is_correct': False},
                                {'choice_text': '14.0', 'choice_text_arabic': '14.0', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Calculate the pH of a solution with [H₃O⁺] = 1.0 x 10⁻⁵ M.',
                            'question_text_arabic': 'احسب الأس الهيدروجيني لمحلول تركيز [H₃O⁺] فيه يساوي 1.0 x 10⁻⁵ M.',
                            'question_type': 'open_short',
                            'correct_answer': '5'
                        }
                    ]
                },
                {
                    'title': 'Acid-Base Strength and Ka',
                    'title_arabic': 'قوة الأحماض والقواعد و Ka',
                    'description': 'Understanding strong vs. weak acids and the acid dissociation constant.',
                    'description_arabic': 'فهم الأحماض القوية مقابل الضعيفة وثابت تفكك الحمض.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'A strong acid completely dissociates in water.',
                            'question_text_arabic': 'يتفكك الحمض القوي تمامًا في الماء.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A larger value of the acid dissociation constant (Ka) indicates a stronger acid.',
                            'question_text_arabic': 'قيمة أكبر لثابت تفكك الحمض (Ka) تشير إلى حمض أقوى.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the relationship between Ka, Kb, and Kw for a conjugate acid-base pair?',
                            'question_text_arabic': 'ما هي العلاقة بين Ka و Kb و Kw لزوج حمض-قاعدة مترافق؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Ka * Kb = Kw', 'choice_text_arabic': 'Ka * Kb = Kw', 'is_correct': True},
                                {'choice_text': 'Ka / Kb = Kw', 'choice_text_arabic': 'Ka / Kb = Kw', 'is_correct': False},
                                {'choice_text': 'Ka + Kb = Kw', 'choice_text_arabic': 'Ka + Kb = Kw', 'is_correct': False},
                                {'choice_text': 'pKa + pKb = 7', 'choice_text_arabic': 'pKa + pKb = 7', 'is_correct': False}
                            ]
                        }
                    ]
                }
            ]

            total_exercises = 0
            total_questions = 0
            total_choices = 0

            for ex_data in exercises_data:
                exercise = Exercise.objects.create(
                    lesson=lesson,
                    created_by_id=1,
                    title=ex_data['title'],
                    title_arabic=ex_data['title_arabic'],
                    description=ex_data['description'],
                    instructions=ex_data.get('description_arabic', ''),
                    difficulty_level=ex_data['difficulty'],
                    is_active=True
                )
                total_exercises += 1

                for q_data in ex_data['questions']:
                    question = Question.objects.create(
                        exercise=exercise,
                        question_text=q_data['question_text'],
                        question_text_arabic=q_data['question_text_arabic'],
                        question_type=q_data['question_type'],
                        points=10 if ex_data['difficulty'] == 'beginner' else (15 if ex_data['difficulty'] == 'intermediate' else 20)
                    )
                    total_questions += 1

                    if q_data['question_type'] in ['qcm_single', 'qcm_multiple'] and 'choices' in q_data:
                        for choice_data in q_data['choices']:
                            QuestionChoice.objects.create(
                                question=question,
                                choice_text=choice_data['choice_text'],
                                choice_text_arabic=choice_data['choice_text_arabic'],
                                is_correct=choice_data['is_correct']
                            )
                            total_choices += 1
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

                ExerciseReward.objects.create(
                    exercise=exercise,
                    completion_points=40,
                    completion_coins=2,
                    perfect_score_bonus=25
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created for Lesson 49 (Chemical transformations associated with acid-base):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 49 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
