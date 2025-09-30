from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for French - La nouvelle réaliste : Aux champs - Lesson ID: 222'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=222)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Characters and Setting in "Aux champs"',
                    'title_arabic': 'الشخصيات والإطار في "في الحقول"',
                    'description': 'Understanding the main characters and the setting of the story.',
                    'description_arabic': 'فهم الشخصيات الرئيسية وإطار القصة.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'Who are the two main families in "Aux champs"?',
                            'question_text_arabic': 'من هما العائلتان الرئيسيتان في قصة "في الحقول"؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The Tuvaches and the Vallins', 'choice_text_arabic': 'عائلة توفاش وعائلة فالان', 'is_correct': True},
                                {'choice_text': 'The Hubières and the d\'Hauterives', 'choice_text_arabic': 'عائلة أوبيير وعائلة دوتريف', 'is_correct': False},
                                {'choice_text': 'The Magloires and the Chiquets', 'choice_text_arabic': 'عائلة ماغلور وعائلة شيكيه', 'is_correct': False},
                                {'choice_text': 'The Loisels and the Forestiers', 'choice_text_arabic': 'عائلة لوازيل وعائلة فوريستييه', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The story is set in the countryside of Normandy, France.',
                            'question_text_arabic': 'تدور أحداث القصة في ريف نورماندي بفرنسا.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Plot and Themes',
                    'title_arabic': 'الحبكة والمواضيع',
                    'description': 'Analyzing the plot and main themes of the story.',
                    'description_arabic': 'تحليل حبكة القصة ومواضيعها الرئيسية.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What offer does Madame d\'Hubière make to the two families?',
                            'question_text_arabic': 'ما هو العرض الذي تقدمه السيدة دوبيير للعائلتين؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'To adopt one of their children', 'choice_text_arabic': 'تبني أحد أطفالهم', 'is_correct': True},
                                {'choice_text': 'To buy their farm', 'choice_text_arabic': 'شراء مزرعتهم', 'is_correct': False},
                                {'choice_text': 'To hire them as servants', 'choice_text_arabic': 'توظيفهم كخدم', 'is_correct': False},
                                {'choice_text': 'To give them a loan', 'choice_text_arabic': 'منحهم قرضًا', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The main themes of the story include poverty, maternal love, and social class differences.',
                            'question_text_arabic': 'تشمل المواضيع الرئيسية للقصة الفقر وحب الأمومة والفروق الطبقية الاجتماعية.',
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
                        points=10
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
                            choice_text_arabic='صحيح',
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
                    completion_points=50,
                    completion_coins=3,
                    perfect_score_bonus=25
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created for Lesson 222: {total_exercises} exercises, {total_questions} questions, {total_choices} choices.'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 222 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
