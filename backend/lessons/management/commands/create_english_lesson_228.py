from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for English - Unit 2: Education - Lesson ID: 228'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=228)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Vocabulary of Education',
                    'title_arabic': 'مفردات التعليم',
                    'description': 'Understanding key terms related to education.',
                    'description_arabic': 'فهم المصطلحات الرئيسية المتعلقة بالتعليم.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is a curriculum?',
                            'question_text_arabic': 'ما هو المنهج الدراسي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The subjects comprising a course of study in a school or college', 'choice_text_arabic': 'المواد التي يتكون منها مقرر دراسي في مدرسة أو كلية', 'is_correct': True},
                                {'choice_text': 'A single lesson plan', 'choice_text_arabic': 'خطة درس واحدة', 'is_correct': False},
                                {'choice_text': 'A student\'s report card', 'choice_text_arabic': 'بطاقة تقرير الطالب', 'is_correct': False},
                                {'choice_text': 'A list of school holidays', 'choice_text_arabic': 'قائمة العطل المدرسية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Extracurricular activities are activities performed by students that fall outside the realm of the normal curriculum.',
                            'question_text_arabic': 'الأنشطة اللاصفية هي أنشطة يقوم بها الطلاب خارج نطاق المنهج الدراسي العادي.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'The Importance of Education',
                    'title_arabic': 'أهمية التعليم',
                    'description': 'Understanding the value and importance of education.',
                    'description_arabic': 'فهم قيمة وأهمية التعليم.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Why is education important for personal development?',
                            'question_text_arabic': 'لماذا التعليم مهم للتنمية الشخصية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'It helps develop critical thinking and problem-solving skills', 'choice_text_arabic': 'يساعد على تطوير التفكير النقدي ومهارات حل المشكلات', 'is_correct': True},
                                {'choice_text': 'It guarantees a high-paying job', 'choice_text_arabic': 'يضمن وظيفة ذات أجر مرتفع', 'is_correct': False},
                                {'choice_text': 'It is the only way to make friends', 'choice_text_arabic': 'إنها الطريقة الوحيدة لتكوين صداقات', 'is_correct': False},
                                {'choice_text': 'It is not important for personal development', 'choice_text_arabic': 'إنه ليس مهمًا للتنمية الشخصية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Education plays a crucial role in the economic and social development of a country.',
                            'question_text_arabic': 'يلعب التعليم دورًا حاسمًا في التنمية الاقتصادية والاجتماعية للبلد.',
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
                    f'Successfully created for Lesson 228: {total_exercises} exercises, {total_questions} questions, {total_choices} choices.'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 228 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
