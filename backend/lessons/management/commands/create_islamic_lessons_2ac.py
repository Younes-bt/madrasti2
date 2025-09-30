from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Islamic Education lessons for 2AC (Deuxième Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 2AC Islamic Education lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - First half of each section (11 lessons)
        lessons_s1 = [
            # مدخل التزكية - Section 1 (1st, 2nd & 3rd lessons)
            {'order': 1, 'title': 'Surah An-Najm', 'title_arabic': 'سورة النجم', 'title_french': 'Sourate An-Najm', 'section': 'مدخل التزكية'},
            {'order': 2, 'title': 'Allah Knows the Unseen and the Witnessed', 'title_arabic': 'الله عالم الغيب والشهادة', 'title_french': 'Allah connaît l\'invisible et le visible', 'section': 'مدخل التزكية'},
            {'order': 3, 'title': 'Revelation: Its Types and Definition', 'title_arabic': 'الوحي: أنواعه وتعريفه', 'title_french': 'La révélation: ses types et sa définition', 'section': 'مدخل التزكية'},

            # مدخل الاقتداء - Section 2 (1st & 2nd lessons)
            {'order': 4, 'title': 'Migration to Abyssinia and the Two Pledges of Aqaba', 'title_arabic': 'الهجرة إلى الحبشة وبيعتا العقبة: طلب الأمان والنصرة', 'title_french': 'Migration vers l\'Abyssinie et les deux serments d\'Aqaba', 'section': 'مدخل الاقتداء'},
            {'order': 5, 'title': 'Siege of the Call and Steadfastness of Its People', 'title_arabic': 'حصار الدعوة وثبات أهلها', 'title_french': 'Siège de l\'appel et fermeté de ses adeptes', 'section': 'مدخل الاقتداء'},

            # مدخل الاستجابة - Section 3 (1st & 2nd lessons)
            {'order': 6, 'title': 'Worship as the Purpose of Creation: Comprehensive Worship', 'title_arabic': 'العبادة غاية الخلق: شمول العبادة لمناحي الحياة', 'title_french': 'L\'adoration comme but de la création: adoration globale', 'section': 'مدخل الاستجابة'},
            {'order': 7, 'title': 'Fasting Rules and Purposes: Pillars, Conditions, Excuses', 'title_arabic': 'الصيام أحكامه ومقاصده: الأركان – الشروط – الأعذار المبيحة للإفطار', 'title_french': 'Règles et objectifs du jeûne: piliers, conditions, excuses', 'section': 'مدخل الاستجابة'},

            # مدخل القسط - Section 4 (1st & 2nd lessons)
            {'order': 8, 'title': 'God\'s Right: Honoring God\'s Boundaries and Rituals', 'title_arabic': 'حق الله : تعظيم حدود الله وشعائره', 'title_french': 'Le droit de Dieu: honorer les limites et les rites de Dieu', 'section': 'مدخل القسط'},
            {'order': 9, 'title': 'Right of the Self: Avoiding Major Sins', 'title_arabic': 'حق النفس: اجتناب الكبائر والموبقات', 'title_french': 'Le droit de soi: éviter les péchés majeurs', 'section': 'مدخل القسط'},

            # مدخل الحكمة - Section 5 (1st & 2nd lessons)
            {'order': 10, 'title': 'Taking Responsibility: The Strong Believer is Better', 'title_arabic': 'التحلي بالمسؤولية: المؤمن القوي خير', 'title_french': 'Assumer la responsabilité: le croyant fort vaut mieux', 'section': 'مدخل الحكمة'},
            {'order': 11, 'title': 'Avoiding Suspicions: The Lawful is Clear', 'title_arabic': 'اتقاء الشبهات: حديث (الحلال بين والحرام بين)', 'title_french': 'Éviter les soupçons: hadith "le licite est clair"', 'section': 'مدخل الحكمة'},
        ]

        # Second Cycle - Second half of each section (10 lessons)
        lessons_s2 = [
            # مدخل التزكية - Section 1 (4th & 5th lessons)
            {'order': 1, 'title': 'Prophets and Messengers: Definition and Qualities', 'title_arabic': 'الأنبياء والرسل ورسالاتهم : التعريف والصفات', 'title_french': 'Prophètes et messagers: définition et qualités', 'section': 'مدخل التزكية'},
            {'order': 2, 'title': 'Qualities of the Truthful Believer', 'title_arabic': 'صفات المؤمن الصادق', 'title_french': 'Qualités du croyant sincère', 'section': 'مدخل التزكية'},

            # مدخل الاقتداء - Section 2 (3rd & 4th lessons)
            {'order': 3, 'title': 'The Prophet Communes with His Lord: Taif, Isra and Miraj', 'title_arabic': 'الرسول (ص) يناجي ربه (الطائف والإسراء والمعراج)', 'title_french': 'Le Prophète dialogue avec son Seigneur: Taif, Isra et Miraj', 'section': 'مدخل الاقتداء'},
            {'order': 4, 'title': 'Believing in and Supporting the Prophet: Abu Bakr As-Siddiq', 'title_arabic': 'تصديق الرسول (ص) ونصرته: أبو بكر الصديق', 'title_french': 'Croire au Prophète et le soutenir: Abu Bakr As-Siddiq', 'section': 'مدخل الاقتداء'},

            # مدخل الاستجابة - Section 3 (3rd & 4th lessons)
            {'order': 5, 'title': 'Fasting Rules: Making Up and Expiation - Voluntary Fasting', 'title_arabic': 'الصيام أحكامه ومقاصده: القضاء والكفارة – صيام التطوع', 'title_french': 'Règles du jeûne: rattrapage et expiation - jeûne volontaire', 'section': 'مدخل الاستجابة'},
            {'order': 6, 'title': 'Quran and Fasting are Intercessors', 'title_arabic': 'القران والصيام شفيعان', 'title_french': 'Le Coran et le jeûne sont intercesseurs', 'section': 'مدخل الاستجابة'},

            # مدخل القسط - Section 4 (3rd & 4th lessons)
            {'order': 7, 'title': 'Rights of Others: Rights of Faith Brotherhood', 'title_arabic': 'حق الغير: حقوق الأخوة الإيمانية', 'title_french': 'Droits d\'autrui: droits de la fraternité de foi', 'section': 'مدخل القسط'},
            {'order': 8, 'title': 'Environmental Rights: Kindness to Animals', 'title_arabic': 'حق البيئة: الإحسان للحيوانات والرفق بها', 'title_french': 'Droits environnementaux: bonté envers les animaux', 'section': 'مدخل القسط'},

            # مدخل الحكمة - Section 5 (3rd & 4th lessons)
            {'order': 9, 'title': 'Human Brotherhood: Rights of Non-Muslims over Muslims', 'title_arabic': 'الأخوة الانسانية: حق غير المسلم على المسلم', 'title_french': 'Fraternité humaine: droits des non-musulmans sur les musulmans', 'section': 'مدخل الحكمة'},
            {'order': 10, 'title': 'Hadith: Who Will Take These Words from Me', 'title_arabic': 'حديث (من يأخذ عني هؤلاء الكلمات …)', 'title_french': 'Hadith: Qui prendra ces paroles de moi', 'section': 'مدخل الحكمة'},
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
            grade = Grade.objects.get(code='2AC')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "2AC" not found. Please create it first.')
            )
            return

        # Get both tracks
        try:
            track_nrml = Track.objects.get(code='2AC-NRML')
            self.stdout.write(f'Found NRML track: {track_nrml.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "2AC-NRML" not found. Please create it first.')
            )
            return

        try:
            track_frn = Track.objects.get(code='2AC-FRN')
            self.stdout.write(f'Found FRN track: {track_frn.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "2AC-FRN" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 2AC Islamic Education lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating 2AC Islamic Education lessons for this subject...')
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Islamic Education lessons for 2AC.'
            )
        )