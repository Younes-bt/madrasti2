from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Islamic Education lessons for 1AC (Première Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 1AC Islamic Education lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - First half of each section (11 lessons)
        lessons_s1 = [
            # مدخل التزكية (القرآن الكريم) - Section 1 (1st lesson)
            {'order': 1, 'title': 'Surah Qaf', 'title_arabic': 'سورة ق', 'title_french': 'Sourate Qaf', 'section': 'مدخل التزكية (القرآن الكريم)'},

            # مدخل التزكية (العقيدة) - Section 2 (1st & 2nd lessons)
            {'order': 2, 'title': 'Correct Belief and False Beliefs', 'title_arabic': 'العقيدة الصحيحة والعقائد الفاسدة', 'title_french': 'La croyance correcte et les croyances fausses', 'section': 'مدخل التزكية (العقيدة)'},
            {'order': 3, 'title': 'Pillars of Faith: Hadith of Gabriel', 'title_arabic': 'أركان الإيمان: حديث جبريل عليه السلام', 'title_french': 'Les piliers de la foi: Hadith de Gabriel', 'section': 'مدخل التزكية (العقيدة)'},

            # مدخل الاقتداء - Section 3 (1st & 2nd lessons)
            {'order': 4, 'title': 'The Prophet\'s Mission and His Secret and Public Call', 'title_arabic': 'بعثة الرسول صلى الله عليه وسلم ودعوته السرية والجهرية', 'title_french': 'La mission du Prophète et son appel secret et public', 'section': 'مدخل الاقتداء'},
            {'order': 5, 'title': 'The Prophet\'s Steadfastness', 'title_arabic': 'ثبات الرسول صلى الله عليه وسلم', 'title_french': 'La fermeté du Prophète', 'section': 'مدخل الاقتداء'},

            # مدخل الاستجابة - Section 4 (1st & 2nd lessons)
            {'order': 6, 'title': 'Worship as the Purpose of Creation: Pillars of Islam', 'title_arabic': 'العبادة غاية الخلق: أركان الإسلام (المفهوم والغايات)', 'title_french': 'L\'adoration comme but de la création: Piliers de l\'Islam', 'section': 'مدخل الاستجابة'},
            {'order': 7, 'title': 'Purification: Types and Purposes', 'title_arabic': 'الطهارة: أنواعها ومقاصدها', 'title_french': 'La purification: types et objectifs', 'section': 'مدخل الاستجابة'},

            # مدخل القسط - Section 5 (1st & 2nd lessons)
            {'order': 8, 'title': 'God\'s Right: Monotheism and Sincerity', 'title_arabic': 'حق الله: التوحيد والإخلاص', 'title_french': 'Le droit de Dieu: monothéisme et sincérité', 'section': 'مدخل القسط'},
            {'order': 9, 'title': 'Right of the Self: Preservation and Care', 'title_arabic': 'حق النفس: الحفظ والرعاية', 'title_french': 'Le droit de soi: préservation et soins', 'section': 'مدخل القسط'},

            # مدخل الحكمة - Section 6 (1st & 2nd lessons)
            {'order': 10, 'title': 'Positive Interaction with Modern Communication Means', 'title_arabic': 'التعامل الإيجابي مع وسائل الاتصال الحديثة', 'title_french': 'Interaction positive avec les moyens de communication modernes', 'section': 'مدخل الحكمة'},
            {'order': 11, 'title': 'Excellence in Worship and Work', 'title_arabic': 'الإتقان عبادة وعمل', 'title_french': 'L\'excellence dans l\'adoration et le travail', 'section': 'مدخل الحكمة'},
        ]

        # Second Cycle - Second half of each section (11 lessons)
        lessons_s2 = [
            # مدخل التزكية (القرآن الكريم) - Section 1 (2nd lesson)
            {'order': 1, 'title': 'Surah Luqman', 'title_arabic': 'سورة لقمان', 'title_french': 'Sourate Luqman', 'section': 'مدخل التزكية (القرآن الكريم)'},

            # مدخل التزكية (العقيدة) - Section 2 (3rd & 4th lessons)
            {'order': 2, 'title': 'The Holy Quran as Guidance and Mercy for the Worlds', 'title_arabic': 'القرآن الكريم هدى ورحمة للعالمين', 'title_french': 'Le Saint Coran comme guidance et miséricorde pour les mondes', 'section': 'مدخل التزكية (العقيدة)'},
            {'order': 3, 'title': 'Reflection and Contemplation as Paths to Knowledge and Guidance', 'title_arabic': 'النظر والتفكر سبيل المعرفة والهداية', 'title_french': 'La réflexion et la contemplation comme chemins vers la connaissance et la guidance', 'section': 'مدخل التزكية (العقيدة)'},

            # مدخل الاقتداء - Section 3 (3rd & 4th lessons)
            {'order': 4, 'title': 'Patience of the Early Muslims', 'title_arabic': 'صبر السابقين الاولين', 'title_french': 'La patience des premiers musulmans', 'section': 'مدخل الاقتداء'},
            {'order': 5, 'title': 'House of Al-Arqam: Unity and Consultation', 'title_arabic': 'دار الأرقم: التآلف والتشاور', 'title_french': 'Maison d\'Al-Arqam: unité et consultation', 'section': 'مدخل الاقتداء'},

            # مدخل الاستجابة - Section 4 (3rd & 4th lessons)
            {'order': 6, 'title': 'Prayer: Rulings and Purposes (Forgetfulness, Makeup Prayers, Latecomer)', 'title_arabic': 'الصلاة: أحكامها ومقاصدها (أحكام السهو – قضاء الفوائت – أحكام المسبوق)', 'title_french': 'La prière: règles et objectifs (oubli, rattrapage, retardataire)', 'section': 'مدخل الاستجابة'},
            {'order': 7, 'title': 'Prayer: Rulings and Purposes (Obligations, Sunnah, Nullifiers)', 'title_arabic': 'الصلاة: احكامها ومقاصدها (الفرائض – السنن – المبطلات)', 'title_french': 'La prière: règles et objectifs (obligations, sunnah, annulations)', 'section': 'مدخل الاستجابة'},

            # مدخل القسط - Section 5 (3rd & 4th lessons)
            {'order': 8, 'title': 'Rights of Others: Rights of Parents, Children, and Relatives', 'title_arabic': 'حق الغير: حقوق الآباء والأبناء وذوي الرحم', 'title_french': 'Les droits d\'autrui: droits des parents, enfants et proches', 'section': 'مدخل القسط'},
            {'order': 9, 'title': 'Environmental Rights: Protecting Environment from Physical and Moral Pollution', 'title_arabic': 'حق البيئة: حماية البيئة من التلوث المادي والمعنوي', 'title_french': 'Les droits environnementaux: protection de l\'environnement contre la pollution physique et morale', 'section': 'مدخل القسط'},

            # مدخل الحكمة - Section 6 (3rd & 4th lessons)
            {'order': 10, 'title': 'The True Scholar: Hadith', 'title_arabic': 'الفقيه كل الفقيه: الحديث', 'title_french': 'Le vrai savant: Hadith', 'section': 'مدخل الحكمة'},
            {'order': 11, 'title': 'Adorning Oneself with Good Morals', 'title_arabic': 'التجمل بمحاسن الأخلاق', 'title_french': 'Se parer de bonnes mœurs', 'section': 'مدخل الحكمة'},
        ]

        try:
            subject = Subject.objects.get(code='ISLM101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code ISLM101 not found. Please ensure it exists.')
            )
            return

        try:
            grade = Grade.objects.get(code='1AC')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "1AC" not found. Please create it first.')
            )
            return

        # Get both tracks
        try:
            track_nrml = Track.objects.get(code='1AC-NRML')
            self.stdout.write(f'Found NRML track: {track_nrml.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "1AC-NRML" not found. Please create it first.')
            )
            return

        try:
            track_frn = Track.objects.get(code='1AC-FRN')
            self.stdout.write(f'Found FRN track: {track_frn.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "1AC-FRN" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 1AC Islamic Education lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating 1AC Islamic Education lessons for this subject...')
        created_count_s1 = 0
        for lesson_data in lessons_s1:
            lesson, created = Lesson.objects.get_or_create(
                subject=subject,
                grade=grade,
                cycle='first',
                order=lesson_data['order'],
                defaults={
                    'title': lesson_data['title'],
                    'title_arabic': lesson_data['title_arabic'],
                    'title_french': lesson_data['title_french'],
                    'description': f"Islamic Education - {lesson_data['section']} - {lesson_data['title_arabic']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
            # Add both tracks to the lesson
            lesson.tracks.add(track_nrml, track_frn)

        created_count_s2 = 0
        for lesson_data in lessons_s2:
            lesson, created = Lesson.objects.get_or_create(
                subject=subject,
                grade=grade,
                cycle='second',
                order=lesson_data['order'],
                defaults={
                    'title': lesson_data['title'],
                    'title_arabic': lesson_data['title_arabic'],
                    'title_french': lesson_data['title_french'],
                    'description': f"Islamic Education - {lesson_data['section']} - {lesson_data['title_arabic']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
            # Add both tracks to the lesson
            lesson.tracks.add(track_nrml, track_frn)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Islamic Education lessons for 1AC.'
            )
        )