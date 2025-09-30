from django.core.management.base import BaseCommand
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward

class Command(BaseCommand):
    help = 'Create exercises for Thermal energy and heat transfer - Lesson ID: 128'

    def handle(self, *args, **options):
        try:
            lesson = Lesson.objects.get(id=128)

            # Clear existing exercises for this lesson
            Exercise.objects.filter(lesson=lesson).delete()

            exercises_data = [
                {
                    'title': 'Heat and Temperature',
                    'title_arabic': 'الحرارة ودرجة الحرارة',
                    'description': 'Understanding the difference between heat and temperature and their relationship',
                    'description_arabic': 'فهم الفرق بين الحرارة ودرجة الحرارة وعلاقتهما',
                    'difficulty': 'beginner',
                    'questions': [
                        {
                            'question_text': 'What is the difference between heat and temperature?',
                            'question_text_arabic': 'ما الفرق بين الحرارة ودرجة الحرارة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Heat is energy transfer; temperature is a measure of average kinetic energy of particles', 'choice_text_arabic': 'الحرارة نقل للطاقة؛ درجة الحرارة مقياس لمتوسط الطاقة الحركية للجسيمات', 'is_correct': True},
                                {'choice_text': 'Heat and temperature are the same thing', 'choice_text_arabic': 'الحرارة ودرجة الحرارة نفس الشيء', 'is_correct': False},
                                {'choice_text': 'Temperature is energy; heat is a measure', 'choice_text_arabic': 'درجة الحرارة طاقة؛ الحرارة مقياس', 'is_correct': False},
                                {'choice_text': 'Heat is faster moving particles; temperature is slower ones', 'choice_text_arabic': 'الحرارة جسيمات تتحرك بسرعة؛ درجة الحرارة جسيمات تتحرك ببطء', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What is the SI unit of heat?',
                            'question_text_arabic': 'ما وحدة الحرارة في النظام الدولي؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Joule (J)', 'choice_text_arabic': 'جول (J)', 'is_correct': True},
                                {'choice_text': 'Celsius (°C)', 'choice_text_arabic': 'سلسيوس (°س)', 'is_correct': False},
                                {'choice_text': 'Kelvin (K)', 'choice_text_arabic': 'كلفن (K)', 'is_correct': False},
                                {'choice_text': 'Calorie (cal)', 'choice_text_arabic': 'سعرة حرارية (cal)', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Heat flows from:',
                            'question_text_arabic': 'الحرارة تتدفق من:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Hot objects to cold objects', 'choice_text_arabic': 'الأجسام الساخنة إلى الأجسام الباردة', 'is_correct': True},
                                {'choice_text': 'Cold objects to hot objects', 'choice_text_arabic': 'الأجسام الباردة إلى الأجسام الساخنة', 'is_correct': False},
                                {'choice_text': 'Objects of equal temperature', 'choice_text_arabic': 'الأجسام متساوية درجة الحرارة', 'is_correct': False},
                                {'choice_text': 'It flows randomly in any direction', 'choice_text_arabic': 'تتدفق عشوائياً في أي اتجاه', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'What happens when two objects at different temperatures are in contact?',
                            'question_text_arabic': 'ماذا يحدث عندما يتلامس جسمان بدرجتي حرارة مختلفتين؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'They eventually reach thermal equilibrium', 'choice_text_arabic': 'يصلان في النهاية للتوازن الحراري', 'is_correct': True},
                                {'choice_text': 'The hot object gets hotter', 'choice_text_arabic': 'الجسم الساخن يصبح أكثر سخونة', 'is_correct': False},
                                {'choice_text': 'The cold object gets colder', 'choice_text_arabic': 'الجسم البارد يصبح أكثر برودة', 'is_correct': False},
                                {'choice_text': 'Nothing happens', 'choice_text_arabic': 'لا يحدث شيء', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Temperature is an intensive property.',
                            'question_text_arabic': 'درجة الحرارة خاصية كثافية.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Mechanisms of Heat Transfer',
                    'title_arabic': 'آليات انتقال الحرارة',
                    'description': 'Understanding conduction, convection, and radiation as methods of heat transfer',
                    'description_arabic': 'فهم التوصيل والحمل والإشعاع كطرق لانتقال الحرارة',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What are the three methods of heat transfer?',
                            'question_text_arabic': 'ما الطرق الثلاث لانتقال الحرارة؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Conduction', 'choice_text_arabic': 'التوصيل', 'is_correct': True},
                                {'choice_text': 'Convection', 'choice_text_arabic': 'الحمل', 'is_correct': True},
                                {'choice_text': 'Radiation', 'choice_text_arabic': 'الإشعاع', 'is_correct': True},
                                {'choice_text': 'Sublimation', 'choice_text_arabic': 'التسامي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How does conduction work?',
                            'question_text_arabic': 'كيف يعمل التوصيل؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Heat transfers through direct contact between particles', 'choice_text_arabic': 'الحرارة تنتقل عبر التلامس المباشر بين الجسيمات', 'is_correct': True},
                                {'choice_text': 'Heat transfers through fluid motion', 'choice_text_arabic': 'الحرارة تنتقل عبر حركة الموائع', 'is_correct': False},
                                {'choice_text': 'Heat travels as electromagnetic waves', 'choice_text_arabic': 'الحرارة تنتقل كموجات كهرومغناطيسية', 'is_correct': False},
                                {'choice_text': 'Heat jumps between objects without contact', 'choice_text_arabic': 'الحرارة تقفز بين الأجسام بدون تلامس', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which materials are good thermal conductors?',
                            'question_text_arabic': 'أي مواد موصلات جيدة للحرارة؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Metals like copper and aluminum', 'choice_text_arabic': 'المعادن مثل النحاس والألومنيوم', 'is_correct': True},
                                {'choice_text': 'Silver and gold', 'choice_text_arabic': 'الفضة والذهب', 'is_correct': True},
                                {'choice_text': 'Diamond', 'choice_text_arabic': 'الماس', 'is_correct': True},
                                {'choice_text': 'Wood and plastic', 'choice_text_arabic': 'الخشب والبلاستيك', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Convection occurs in:',
                            'question_text_arabic': 'الحمل يحدث في:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Fluids (liquids and gases)', 'choice_text_arabic': 'الموائع (السوائل والغازات)', 'is_correct': True},
                                {'choice_text': 'Solids only', 'choice_text_arabic': 'المواد الصلبة فقط', 'is_correct': False},
                                {'choice_text': 'Vacuum', 'choice_text_arabic': 'الفراغ', 'is_correct': False},
                                {'choice_text': 'All states of matter equally', 'choice_text_arabic': 'جميع حالات المادة بالتساوي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Radiation can transfer heat through a vacuum.',
                            'question_text_arabic': 'الإشعاع يمكنه نقل الحرارة عبر الفراغ.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Heat Capacity and Specific Heat',
                    'title_arabic': 'السعة الحرارية والحرارة النوعية',
                    'description': 'Calculating heat transfer using specific heat capacity',
                    'description_arabic': 'حساب انتقال الحرارة باستخدام السعة الحرارية النوعية',
                    'difficulty': 'intermediate',
                    'questions': [
                        {
                            'question_text': 'What is specific heat capacity?',
                            'question_text_arabic': 'ما هي السعة الحرارية النوعية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Heat required to raise 1 kg of a substance by 1°C', 'choice_text_arabic': 'الحرارة المطلوبة لرفع درجة حرارة 1 كيلوجرام من مادة بمقدار 1°س', 'is_correct': True},
                                {'choice_text': 'Maximum heat a substance can store', 'choice_text_arabic': 'أقصى حرارة يمكن للمادة تخزينها', 'is_correct': False},
                                {'choice_text': 'Rate of heat transfer in a material', 'choice_text_arabic': 'معدل انتقال الحرارة في المادة', 'is_correct': False},
                                {'choice_text': 'Temperature at which a substance melts', 'choice_text_arabic': 'درجة الحرارة التي تنصهر عندها المادة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The formula for heat transfer is:',
                            'question_text_arabic': 'صيغة انتقال الحرارة هي:',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Q = mcΔT', 'choice_text_arabic': 'Q = mcΔT', 'is_correct': True},
                                {'choice_text': 'Q = mΔT', 'choice_text_arabic': 'Q = mΔT', 'is_correct': False},
                                {'choice_text': 'Q = cΔT', 'choice_text_arabic': 'Q = cΔT', 'is_correct': False},
                                {'choice_text': 'Q = mc²', 'choice_text_arabic': 'Q = mc²', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'How much heat is required to raise the temperature of 2 kg of water from 20°C to 80°C? (c_water = 4180 J/kg°C)',
                            'question_text_arabic': 'كم الحرارة المطلوبة لرفع درجة حرارة 2 كيلوجرام من الماء من 20°س إلى 80°س؟ (c_ماء = 4180 ج/كجم°س)',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '501,600 J', 'choice_text_arabic': '501,600 جول', 'is_correct': True},
                                {'choice_text': '250,800 J', 'choice_text_arabic': '250,800 جول', 'is_correct': False},
                                {'choice_text': '8,360 J', 'choice_text_arabic': '8,360 جول', 'is_correct': False},
                                {'choice_text': '1,003,200 J', 'choice_text_arabic': '1,003,200 جول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which substance has the highest specific heat capacity?',
                            'question_text_arabic': 'أي مادة لها أعلى سعة حرارية نوعية؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Water', 'choice_text_arabic': 'الماء', 'is_correct': True},
                                {'choice_text': 'Iron', 'choice_text_arabic': 'الحديد', 'is_correct': False},
                                {'choice_text': 'Lead', 'choice_text_arabic': 'الرصاص', 'is_correct': False},
                                {'choice_text': 'Gold', 'choice_text_arabic': 'الذهب', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'A substance with higher specific heat capacity heats up faster.',
                            'question_text_arabic': 'مادة بسعة حرارية نوعية أعلى تسخن بشكل أسرع.',
                            'question_type': 'true_false',
                            'correct_answer': 'False'
                        }
                    ]
                },
                {
                    'title': 'Phase Changes and Latent Heat',
                    'title_arabic': 'تغيرات الطور والحرارة الكامنة',
                    'description': 'Understanding heat transfer during phase transitions',
                    'description_arabic': 'فهم انتقال الحرارة أثناء انتقالات الطور',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is latent heat?',
                            'question_text_arabic': 'ما هي الحرارة الكامنة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Heat required to change phase without changing temperature', 'choice_text_arabic': 'الحرارة المطلوبة لتغيير الطور دون تغيير درجة الحرارة', 'is_correct': True},
                                {'choice_text': 'Heat that increases temperature', 'choice_text_arabic': 'الحرارة التي ترفع درجة الحرارة', 'is_correct': False},
                                {'choice_text': 'Heat lost to the environment', 'choice_text_arabic': 'الحرارة المفقودة للبيئة المحيطة', 'is_correct': False},
                                {'choice_text': 'Heat stored in molecular bonds', 'choice_text_arabic': 'الحرارة المخزونة في الروابط الجزيئية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'During melting, what happens to temperature?',
                            'question_text_arabic': 'أثناء الانصهار، ماذا يحدث لدرجة الحرارة؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'It remains constant', 'choice_text_arabic': 'تبقى ثابتة', 'is_correct': True},
                                {'choice_text': 'It increases steadily', 'choice_text_arabic': 'تزداد بانتظام', 'is_correct': False},
                                {'choice_text': 'It decreases', 'choice_text_arabic': 'تقل', 'is_correct': False},
                                {'choice_text': 'It fluctuates randomly', 'choice_text_arabic': 'تتذبذب عشوائياً', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'The latent heat of fusion for ice is 334,000 J/kg. How much energy is needed to melt 500 g of ice at 0°C?',
                            'question_text_arabic': 'الحرارة الكامنة للانصهار للجليد هي 334,000 ج/كجم. كم الطاقة المطلوبة لإذابة 500 جرام من الجليد عند 0°س؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': '167,000 J', 'choice_text_arabic': '167,000 جول', 'is_correct': True},
                                {'choice_text': '334,000 J', 'choice_text_arabic': '334,000 جول', 'is_correct': False},
                                {'choice_text': '668,000 J', 'choice_text_arabic': '668,000 جول', 'is_correct': False},
                                {'choice_text': '83,500 J', 'choice_text_arabic': '83,500 جول', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which process requires more energy?',
                            'question_text_arabic': 'أي عملية تتطلب طاقة أكثر؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Vaporization (liquid to gas)', 'choice_text_arabic': 'التبخير (من سائل إلى غاز)', 'is_correct': True},
                                {'choice_text': 'Melting (solid to liquid)', 'choice_text_arabic': 'الانصهار (من صلب إلى سائل)', 'is_correct': False},
                                {'choice_text': 'Both require the same energy', 'choice_text_arabic': 'كلاهما يتطلب نفس الطاقة', 'is_correct': False},
                                {'choice_text': 'It depends on the substance', 'choice_text_arabic': 'يعتمد على المادة', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Evaporation occurs at any temperature, while boiling occurs only at the boiling point.',
                            'question_text_arabic': 'التبخر يحدث عند أي درجة حرارة، بينما الغليان يحدث فقط عند نقطة الغليان.',
                            'question_type': 'true_false',
                            'correct_answer': 'True'
                        }
                    ]
                },
                {
                    'title': 'Thermal Expansion and Applications',
                    'title_arabic': 'التمدد الحراري والتطبيقات',
                    'description': 'Understanding thermal expansion and its practical applications',
                    'description_arabic': 'فهم التمدد الحراري وتطبيقاته العملية',
                    'difficulty': 'advanced',
                    'questions': [
                        {
                            'question_text': 'What is thermal expansion?',
                            'question_text_arabic': 'ما هو التمدد الحراري؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'The tendency of matter to increase in volume when heated', 'choice_text_arabic': 'ميل المادة لزيادة حجمها عند التسخين', 'is_correct': True},
                                {'choice_text': 'The cooling of objects in space', 'choice_text_arabic': 'تبريد الأجسام في الفضاء', 'is_correct': False},
                                {'choice_text': 'The contraction of materials when heated', 'choice_text_arabic': 'انكماش المواد عند التسخين', 'is_correct': False},
                                {'choice_text': 'The change in mass during heating', 'choice_text_arabic': 'التغير في الكتلة أثناء التسخين', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Why do materials expand when heated?',
                            'question_text_arabic': 'لماذا تتمدد المواد عند التسخين؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Particles move more vigorously and need more space', 'choice_text_arabic': 'الجسيمات تتحرك بقوة أكبر وتحتاج مساحة أكبر', 'is_correct': True},
                                {'choice_text': 'Mass increases with temperature', 'choice_text_arabic': 'الكتلة تزداد مع درجة الحرارة', 'is_correct': False},
                                {'choice_text': 'Gravity weakens at higher temperatures', 'choice_text_arabic': 'الجاذبية تضعف عند درجات حرارة أعلى', 'is_correct': False},
                                {'choice_text': 'New particles are created', 'choice_text_arabic': 'جسيمات جديدة تُخلق', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which applications use thermal expansion?',
                            'question_text_arabic': 'أي تطبيقات تستخدم التمدد الحراري؟',
                            'question_type': 'qcm_multiple',
                            'choices': [
                                {'choice_text': 'Thermostats', 'choice_text_arabic': 'منظمات الحرارة', 'is_correct': True},
                                {'choice_text': 'Expansion joints in bridges', 'choice_text_arabic': 'مفاصل التمدد في الجسور', 'is_correct': True},
                                {'choice_text': 'Thermometers', 'choice_text_arabic': 'موازين الحرارة', 'is_correct': True},
                                {'choice_text': 'Electric batteries', 'choice_text_arabic': 'البطاريات الكهربائية', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Which state of matter shows the greatest thermal expansion?',
                            'question_text_arabic': 'أي حالة للمادة تظهر أكبر تمدد حراري؟',
                            'question_type': 'qcm_single',
                            'choices': [
                                {'choice_text': 'Gases', 'choice_text_arabic': 'الغازات', 'is_correct': True},
                                {'choice_text': 'Liquids', 'choice_text_arabic': 'السوائل', 'is_correct': False},
                                {'choice_text': 'Solids', 'choice_text_arabic': 'المواد الصلبة', 'is_correct': False},
                                {'choice_text': 'All expand equally', 'choice_text_arabic': 'جميعها تتمدد بالتساوي', 'is_correct': False}
                            ]
                        },
                        {
                            'question_text': 'Water is unusual because it expands when it freezes.',
                            'question_text_arabic': 'الماء غير عادي لأنه يتمدد عندما يتجمد.',
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
                    f'Successfully created for Lesson 128 (Thermal energy and heat transfer):\\n'
                    f'Exercises: {total_exercises}\\n'
                    f'Questions: {total_questions}\\n'
                    f'Choices: {total_choices}'
                )
            )

        except Lesson.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Lesson with ID 128 does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating exercises: {str(e)}')
            )