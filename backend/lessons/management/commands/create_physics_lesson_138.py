
from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Physics - Mechanical work and energy (continued) - Lesson ID: 138'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=138)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Work-Energy Theorem',
                    'title_arabic': 'نظرية الشغل والطاقة',
                    'description': 'Understanding the work-energy theorem.',
                    'description_arabic': 'فهم نظرية الشغل والطاقة.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'The work-energy theorem states that the work done on an object is equal to the change in its:',
                            'question_text_arabic': 'تنص نظرية الشغل والطاقة على أن الشغل المبذول على جسم ما يساوي التغير في:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Kinetic energy', 'choice_text_arabic': 'طاقته الحركية', 'is_correct': True},
                                {'choice_text': 'Potential energy', 'choice_text_arabic': 'طاقته الكامنة', 'is_correct': False},
                                {'choice_text': 'Mechanical energy', 'choice_text_arabic': 'طاقته الميكانيكية', 'is_correct': False},
                                {'choice_text': 'Thermal energy', 'choice_text_arabic': 'طاقته الحرارية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'If the net work done on an object is positive, its kinetic energy increases.',
                            'question_text_arabic': 'إذا كان الشغل الصافي المبذول على جسم ما موجبًا، فإن طاقته الحركية تزداد.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Conservation of Mechanical Energy',
                    'title_arabic': 'حفظ الطاقة الميكانيكية',
                    'description': 'Understanding the principle of conservation of mechanical energy.',
                    'description_arabic': 'فهم مبدأ حفظ الطاقة الميكانيكية.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'When is mechanical energy conserved?',
                            'question_text_arabic': 'متى يتم حفظ الطاقة الميكانيكية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'When only conservative forces are acting on the system', 'choice_text_arabic': 'عندما تؤثر القوى المحافظة فقط على النظام', 'is_correct': True},
                                {'choice_text': 'When non-conservative forces are acting on the system', 'choice_text_arabic': 'عندما تؤثر القوى غير المحافظة على النظام', 'is_correct': False},
                                {'choice_text': 'When the system is at rest', 'choice_text_arabic': 'عندما يكون النظام في حالة سكون', 'is_correct': False},
                                {'choice_text': 'Always', 'choice_text_arabic': 'دائما', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Friction is an example of a non-conservative force.',
                            'question_text_arabic': 'الاحتكاك هو مثال على قوة غير محافظة.',
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
                    f'Successfully created for Lesson 138: {total_exercises} exercises, {total_questions} questions, {total_choices} choices.'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 138 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
