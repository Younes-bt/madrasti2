from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Satellites and planets - Lesson ID: 58'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=58)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Kepler\'s Laws of Planetary Motion',
                    'title_arabic': 'قوانين كبلر لحركة الكواكب',
                    'description': 'Understanding Kepler\'s three laws.',
                    'description_arabic': 'فهم قوانين كبلر الثلاثة.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'Kepler\'s First Law states that the orbit of a planet is an ellipse with the Sun at one of the two foci.',
                            'question_text_arabic': 'ينص قانون كبلر الأول على أن مدار الكوكب هو قطع ناقص تكون الشمس في إحدى بؤرتيه.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'According to Kepler\'s Second Law, a planet moves fastest when it is farthest from the Sun.',
                            'question_text_arabic': 'وفقًا لقانون كبلر الثاني، يتحرك الكوكب بأسرع ما يمكن عندما يكون في أبعد نقطة عن الشمس.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        },
                        {
                            'question_text': 'What does Kepler\'s Third Law relate?',
                            'question_text_arabic': 'ماذا يربط قانون كبلر الثالث؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The orbital period and the semi-major axis of an orbit', 'choice_text_arabic': 'الدور المداري ونصف المحور الأكبر للمدار', 'is_correct': True},
                                {'choice_text': 'The planet\'s mass and its orbital speed', 'choice_text_arabic': 'كتلة الكوكب وسرعته المدارية', 'is_correct': False},
                                {'choice_text': 'The planet\'s size and its distance from the Sun', 'choice_text_arabic': 'حجم الكوكب وبعده عن الشمس', 'is_correct': False},
                                {'choice_text': 'The Sun\'s mass and the planet\'s orbital period', 'choice_text_arabic': 'كتلة الشمس والدور المداري للكوكب', 'is_correct': False}
                            ]
                        }
                    ]
                },
                {
                    'title': 'Newton\'s Law of Universal Gravitation',
                    'title_arabic': 'قانون نيوتن للجاذبية الكونية',
                    'description': 'Understanding the force of gravity between celestial bodies.',
                    'description_arabic': 'فهم قوة الجاذبية بين الأجرام السماوية.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'The force of gravity between two objects is inversely proportional to the square of the distance between their centers.',
                            'question_text_arabic': 'تتناسب قوة الجاذبية بين جسمين عكسياً مع مربع المسافة بين مركزيهما.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'What is the formula for Newton\'s Law of Universal Gravitation?',
                            'question_text_arabic': 'ما هي صيغة قانون نيوتن للجاذبية الكونية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'F = G(m₁m₂/r²)', 'choice_text_arabic': 'F = G(m₁m₂/r²)', 'is_correct': True},
                                {'choice_text': 'F = G(m₁+m₂)/r²', 'choice_text_arabic': 'F = G(m₁+m₂)/r²', 'is_correct': False},
                                {'choice_text': 'F = G(m₁m₂)r²', 'choice_text_arabic': 'F = G(m₁m₂)r²', 'is_correct': False},
                                {'choice_text': 'F = m₁g', 'choice_text_arabic': 'F = m₁g', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The gravitational force is always attractive.',
                            'question_text_arabic': 'قوة الجاذبية دائما جاذبة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Orbital Mechanics',
                    'title_arabic': 'ميكانيكا المدارات',
                    'description': 'Calculating orbital parameters for satellites and planets.',
                    'description_arabic': 'حساب معلمات المدارات للأقمار الصناعية والكواكب.',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'For a satellite in a circular orbit, the gravitational force provides the necessary centripetal force.',
                            'question_text_arabic': 'لقمر صناعي في مدار دائري، توفر قوة الجاذبية القوة الجاذبة المركزية اللازمة.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        },
                        {
                            'question_text': 'The orbital speed of a satellite in a circular orbit depends on its mass.',
                            'question_text_arabic': 'تعتمد السرعة المدارية لقمر صناعي في مدار دائري على كتلته.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        },
                        {
                            'question_text': 'A geostationary satellite has an orbital period of 24 hours.',
                            'question_text_arabic': 'يبلغ الدور المداري للقمر الصناعي المستقر بالنسبة للأرض 24 ساعة.',
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
                    f'Successfully created for Lesson 58 (Satellites and planets):\n'
                    f'Exercises: {total_exercises}\n'
                    f'Questions: {total_questions}\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 58 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
