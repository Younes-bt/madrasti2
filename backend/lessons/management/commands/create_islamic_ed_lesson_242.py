
from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Islamic Education - Faith and Knowledge - Lesson ID: 242'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=242)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'The Relationship Between Faith and Knowledge',
                    'title_arabic': 'العلاقة بين الإيمان والعلم',
                    'description': 'Understanding the connection between faith and the pursuit of knowledge in Islam.',
                    'description_arabic': 'فهم العلاقة بين الإيمان وطلب العلم في الإسلام.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'In Islam, faith and knowledge are considered to be:',
                            'question_text_arabic': 'في الإسلام، يعتبر الإيمان والعلم:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Complementary and interconnected', 'choice_text_arabic': 'متكاملان ومترابطان', 'is_correct': True},
                                {'choice_text': 'Opposing forces', 'choice_text_arabic': 'قوتان متعارضتان', 'is_correct': False},
                                {'choice_text': 'Unrelated concepts', 'choice_text_arabic': 'مفهومان غير مترابطين', 'is_correct': False},
                                {'choice_text': 'Only for scholars', 'choice_text_arabic': 'للعلماء فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The first word of the Quran revealed to Prophet Muhammad was "Read" (Iqra).',
                            'question_text_arabic': 'كانت أول كلمة نزلت من القرآن على النبي محمد هي "اقرأ".',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'The Pursuit of Knowledge',
                    'title_arabic': 'طلب العلم',
                    'description': 'Understanding the importance of seeking knowledge in Islam.',
                    'description_arabic': 'فهم أهمية طلب العلم في الإسلام.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the Islamic ruling on seeking knowledge?',
                            'question_text_arabic': 'ما هو حكم طلب العلم في الإسلام؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'An obligation upon every Muslim', 'choice_text_arabic': 'واجب على كل مسلم', 'is_correct': True},
                                {'choice_text': 'Optional but recommended', 'choice_text_arabic': 'اختياري ولكنه مستحب', 'is_correct': False},
                                {'choice_text': 'Only for men', 'choice_text_arabic': 'للرجال فقط', 'is_correct': False},
                                {'choice_text': 'Discouraged', 'choice_text_arabic': 'غير مستحب', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Islam encourages the pursuit of both religious and worldly knowledge.',
                            'question_text_arabic': 'يشجع الإسلام على طلب العلم الديني والدنيوي.',
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
                    f'Successfully created for Lesson 242: {total_exercises} exercises, {total_questions} questions, {total_choices} choices.'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 242 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
