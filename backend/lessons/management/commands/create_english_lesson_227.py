
from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for English - Unit 1: Our cultural heritage - Lesson ID: 227'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=227)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Vocabulary of Cultural Heritage',
                    'title_arabic': 'مفردات التراث الثقافي',
                    'description': 'Understanding key terms related to cultural heritage.',
                    'description_arabic': 'فهم المصطلحات الرئيسية المتعلقة بالتراث الثقافي.',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is cultural heritage?',
                            'question_text_arabic': 'ما هو التراث الثقافي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The legacy of physical artifacts and intangible attributes of a group or society', 'choice_text_arabic': 'تراث المصنوعات المادية والسمات غير الملموسة لمجموعة أو مجتمع', 'is_correct': True},
                                {'choice_text': 'Only ancient buildings and monuments', 'choice_text_arabic': 'المباني والآثار القديمة فقط', 'is_correct': False},
                                {'choice_text': 'Modern pop culture', 'choice_text_arabic': 'الثقافة الشعبية الحديثة', 'is_correct': False},
                                {'choice_text': 'Scientific discoveries only', 'choice_text_arabic': 'الاكتشافات العلمية فقط', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Intangible cultural heritage includes traditions, oral history, and performing arts.',
                            'question_text_arabic': 'يشمل التراث الثقافي غير المادي التقاليد والتاريخ الشفوي وفنون الأداء.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Preserving Cultural Heritage',
                    'title_arabic': 'الحفاظ على التراث الثقافي',
                    'description': 'Understanding the importance and methods of preserving heritage.',
                    'description_arabic': 'فهم أهمية وطرق الحفاظ على التراث.',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'Why is it important to preserve cultural heritage?',
                            'question_text_arabic': 'لماذا من المهم الحفاظ على التراث الثقافي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'To maintain a sense of identity and continuity for future generations', 'choice_text_arabic': 'للحفاظ على الشعور بالهوية والاستمرارية للأجيال القادمة', 'is_correct': True},
                                {'choice_text': 'To attract tourists only', 'choice_text_arabic': 'لجذب السياح فقط', 'is_correct': False},
                                {'choice_text': 'To prevent any new cultural developments', 'choice_text_arabic': 'لمنع أي تطورات ثقافية جديدة', 'is_correct': False},
                                {'choice_text': 'It is not important', 'choice_text_arabic': 'إنه ليس مهمًا', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'UNESCO is an organization that helps protect world heritage sites.',
                            'question_text_arabic': 'اليونسكو هي منظمة تساعد في حماية مواقع التراث العالمي.',
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
                    f'Successfully created for Lesson 227: {total_exercises} exercises, {total_questions} questions, {total_choices} choices.'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 227 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )
