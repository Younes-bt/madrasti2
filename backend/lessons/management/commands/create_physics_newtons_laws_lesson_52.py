from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Newton\'s laws - Lesson ID: 52'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=52)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Newton\'s First Law of Motion',
                    'title_arabic': 'قانون نيوتن الأول للحركة',
                    'description': 'Understanding the concept of inertia.',
                    'description_arabic': 'فهم مفهوم القصور الذاتي.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is Newton\'s First Law also known as?',
                            'question_text_arabic': 'بماذا يُعرف قانون نيوتن الأول أيضًا؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The Law of Inertia', 'choice_text_arabic': 'قانون القصور الذاتي', 'is_correct': True},
                                {'choice_text': 'The Law of Acceleration', 'choice_text_arabic': 'قانون التسارع', 'is_correct': False},
                                {'choice_text': 'The Law of Action-Reaction', 'choice_text_arabic': 'قانون الفعل ورد الفعل', 'is_correct': False},
                                {'choice_text': 'The Law of Gravity', 'choice_text_arabic': 'قانون الجاذبية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'An object at rest will remain at rest unless acted upon by a net external force.',
                            'question_text_arabic': 'يبقى الجسم الساكن ساكنًا ما لم تؤثر عليه قوة خارجية محصلة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'Inertia is the tendency of an object to resist changes in its state of motion.',
                            'question_text_arabic': 'القصور الذاتي هو ميل الجسم لمقاومة التغيرات في حالته الحركية.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Newton\'s Second Law of Motion',
                    'title_arabic': 'قانون نيوتن الثاني للحركة',
                    'description': 'Understanding the relationship between force, mass, and acceleration.',
                    'description_arabic': 'فهم العلاقة بين القوة والكتلة والتسارع.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is the mathematical expression for Newton\'s Second Law?',
                            'question_text_arabic': 'ما هو التعبير الرياضي لقانون نيوتن الثاني؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'F = ma', 'choice_text_arabic': 'F = ma', 'is_correct': True},
                                {'choice_text': 'F = m/a', 'choice_text_arabic': 'F = m/a', 'is_correct': False},
                                {'choice_text': 'F = a/m', 'choice_text_arabic': 'F = a/m', 'is_correct': False},
                                {'choice_text': 'm = Fa', 'choice_text_arabic': 'm = Fa', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'If the net force on an object is doubled, its acceleration will also double, assuming mass is constant.',
                            'question_text_arabic': 'إذا تضاعفت القوة المحصلة المؤثرة على جسم، فإن تسارعه سيتضاعف أيضًا، بافتراض أن الكتلة ثابتة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'A net force of 20 N is applied to a 5 kg object. What is the acceleration of the object?',
                            'question_text_arabic': 'تؤثر قوة محصلة قدرها 20 نيوتن على جسم كتلته 5 كجم. ما هو تسارع الجسم؟',
                            'question_type': 'open_short',
                            'correct_answer': '4 m/s²'
                        }
                    ]
                },
                {
                    'title': 'Newton\'s Third Law of Motion',
                    'title_arabic': 'قانون نيوتن الثالث للحركة',
                    'description': 'Understanding action-reaction pairs.',
                    'description_arabic': 'فهم أزواج الفعل ورد الفعل.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Newton\'s Third Law states that for every action, there is an equal and opposite reaction.',
                            'question_text_arabic': 'ينص قانون نيوتن الثالث على أن لكل فعل رد فعل مساوٍ له في المقدار ومعاكس له في الاتجاه.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'When you jump, you push down on the Earth, and the Earth pushes up on you. This is an example of:',
                            'question_text_arabic': 'عندما تقفز، فإنك تدفع الأرض لأسفل، والأرض تدفعك لأعلى. هذا مثال على:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Newton\'s Third Law', 'choice_text_arabic': 'قانون نيوتن الثالث', 'is_correct': True},
                                {'choice_text': 'Newton\'s First Law', 'choice_text_arabic': 'قانون نيوتن الأول', 'is_correct': False},
                                {'choice_text': 'Newton\'s Second Law', 'choice_text_arabic': 'قانون نيوتن الثاني', 'is_correct': False},
                                {'choice_text': 'Friction', 'choice_text_arabic': 'الاحتكاك', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The action and reaction forces in a pair act on the same object.',
                            'question_text_arabic': 'قوتا الفعل ورد الفعل في زوج تؤثران على نفس الجسم.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
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
                        points=10 if ex_data['difficulty'] == 'beginner' else 15
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
                    f'Successfully created for Lesson 52 (Newton\'s laws):\n' 
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 52 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
