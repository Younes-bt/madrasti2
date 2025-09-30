
from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for History and Geography - The Humanist Movement - Lesson ID: 254'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=254)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'The Humanist Movement',
                    'title_arabic': 'الحركة الإنسانية',
                    'description': 'Understanding the key aspects of the Humanist Movement.',
                    'description_arabic': 'فهم الجوانب الرئيسية للحركة الإنسانية.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What was the main focus of the Humanist Movement?',
                            'question_text_arabic': 'ما هو التركيز الرئيسي للحركة الإنسانية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'A focus on human potential and achievements', 'choice_text_arabic': 'التركيز على الإمكانات والإنجازات البشرية', 'is_correct': True},
                                {'choice_text': 'A focus on religious dogma', 'choice_text_arabic': 'التركيز على العقيدة الدينية', 'is_correct': False},
                                {'choice_text': 'A focus on military conquest', 'choice_text_arabic': 'التركيز على الفتح العسكري', 'is_correct': False},
                                {'choice_text': 'A focus on agricultural techniques', 'choice_text_arabic': 'التركيز على التقنيات الزراعية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The Humanist Movement began in the 14th century in Italy.',
                            'question_text_arabic': 'بدأت الحركة الإنسانية في القرن الرابع عشر في إيطاليا.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Key Figures of Humanism',
                    'title_arabic': 'شخصيات رئيسية في الحركة الإنسانية',
                    'description': 'Identifying key figures associated with the Humanist Movement.',
                    'description_arabic': 'تحديد الشخصيات الرئيسية المرتبطة بالحركة الإنسانية.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Who is often called the "Father of Humanism"?',
                            'question_text_arabic': 'من الذي يطلق عليه غالبًا "أبو الإنسانية"؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Petrarch', 'choice_text_arabic': 'بترارك', 'is_correct': True},
                                {'choice_text': 'Leonardo da Vinci', 'choice_text_arabic': 'ليوناردو دافنشي', 'is_correct': False},
                                {'choice_text': 'Galileo Galilei', 'choice_text_arabic': 'جاليليو جاليلي', 'is_correct': False},
                                {'choice_text': 'Martin Luther', 'choice_text_arabic': 'مارتن لوثر', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Humanist scholars studied the classical texts of ancient Greece and Rome.',
                            'question_text_arabic': 'درس علماء الإنسانية النصوص الكلاسيكية لليونان القديمة وروما.',
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
                    f'Successfully created for Lesson 254: {total_exercises} exercises, {total_questions} questions, {total_choices} choices.'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 254 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
