from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Arabic lessons for 2AC (Deuxième Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 2AC Arabic lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - First half of each section (26 lessons)
        lessons_s1 = [
            # الدرس اللغوي - Section 1 (1st 11 lessons)
            {'order': 1, 'title': 'Formation and Declension of Dual', 'title_arabic': 'صوغ المثنى وإعرابه', 'title_french': 'Formation et déclinaison du duel', 'section': 'الدرس اللغوي'},
            {'order': 2, 'title': 'Formation and Declension of Masculine Sound Plural', 'title_arabic': 'صوغ جمع المذكر السالم وإعرابه', 'title_french': 'Formation et déclinaison du pluriel masculin sain', 'section': 'الدرس اللغوي'},
            {'order': 3, 'title': 'Formation and Declension of Feminine Sound Plural', 'title_arabic': 'صوغ جمع المؤنث السالم و إعرابه', 'title_french': 'Formation et déclinaison du pluriel féminin sain', 'section': 'الدرس اللغوي'},
            {'order': 4, 'title': 'Broken Plural: Plural of Paucity and Abundance', 'title_arabic': 'جمع التكسير: جمع القلة وجمع الكثرة', 'title_french': 'Pluriel brisé: pluriel de rareté et d\'abondance', 'section': 'الدرس اللغوي'},
            {'order': 5, 'title': 'Subject: Obligatory and Optional Pronominalization', 'title_arabic': 'الفاعل: الاضمار الواجب والجائز', 'title_french': 'Le sujet: pronominalisation obligatoire et optionnelle', 'section': 'الدرس اللغوي'},
            {'order': 6, 'title': 'Direct Object', 'title_arabic': 'المفعول به', 'title_french': 'Complément d\'objet direct', 'section': 'الدرس اللغوي'},
            {'order': 7, 'title': 'Absolute Object', 'title_arabic': 'المفعول المطلق', 'title_french': 'Complément d\'objet absolu', 'section': 'الدرس اللغوي'},
            {'order': 8, 'title': 'Adverbial Object', 'title_arabic': 'المفعول فيه', 'title_french': 'Complément circonstanciel', 'section': 'الدرس اللغوي'},
            {'order': 9, 'title': 'Object of Accompaniment', 'title_arabic': 'المفعول معه', 'title_french': 'Complément d\'accompagnement', 'section': 'الدرس اللغوي'},
            {'order': 10, 'title': 'Object of Purpose', 'title_arabic': 'المفعول لأجله', 'title_french': 'Complément de but', 'section': 'الدرس اللغوي'},
            {'order': 11, 'title': 'State/Circumstance', 'title_arabic': 'الحال', 'title_french': 'Complément de circonstance', 'section': 'الدرس اللغوي'},

            # التعبير والإنشاء - Section 2 (1st & 2nd lessons)
            {'order': 12, 'title': 'Summarization Skill', 'title_arabic': 'مهارة التلخيص', 'title_french': 'Compétence de résumé', 'section': 'التعبير والإنشاء'},
            {'order': 13, 'title': 'Converting Purpose, Topic, Form or Situation', 'title_arabic': 'تحويل غرض أو موضوع أو شكل أو وضعية', 'title_french': 'Conversion d\'objectif, sujet, forme ou situation', 'section': 'التعبير والإنشاء'},

            # مجال القيم الإسلامية - Section 3 (1st 3 lessons)
            {'order': 14, 'title': 'Dawn Quran', 'title_arabic': 'قرآن الفجر', 'title_french': 'Coran de l\'aube', 'section': 'مجال القيم الإسلامية'},
            {'order': 15, 'title': 'From the Noble Prophetic Morals', 'title_arabic': 'من مكارم الأخلاق النبوية', 'title_french': 'Des nobles morales prophétiques', 'section': 'مجال القيم الإسلامية'},
            {'order': 16, 'title': 'Islam is the Religion of Mercy', 'title_arabic': 'الإسلام دين الرحمة', 'title_french': 'L\'Islam est la religion de la miséricorde', 'section': 'مجال القيم الإسلامية'},

            # القيم الوطنية والإنسانية - Section 4 (1st 3 lessons)
            {'order': 17, 'title': 'Women and the Right to Work', 'title_arabic': 'المرأة وحق العمل', 'title_french': 'La femme et le droit au travail', 'section': 'القيم الوطنية والإنسانية'},
            {'order': 18, 'title': 'Moroccan Unity Through the Ages', 'title_arabic': 'الوحدة المغربية عبر العصور', 'title_french': 'L\'unité marocaine à travers les âges', 'section': 'القيم الوطنية والإنسانية'},
            {'order': 19, 'title': 'Patriotism', 'title_arabic': 'الوطنية', 'title_french': 'Le patriotisme', 'section': 'القيم الوطنية والإنسانية'},

            # المجال الحضاري - Section 5 (1st lesson)
            {'order': 20, 'title': 'Land of the Noble', 'title_arabic': 'وطن الكرام', 'title_french': 'Patrie des nobles', 'section': 'المجال الحضاري'},

            # المجال الاجتماعي والاقتصادي - Section 6 (1st 3 lessons)
            {'order': 21, 'title': 'Children in Our Contemporary World', 'title_arabic': 'الأطفال في عالمنا المعاصر', 'title_french': 'Les enfants dans notre monde contemporain', 'section': 'المجال الاجتماعي والاقتصادي'},
            {'order': 22, 'title': 'My Sister', 'title_arabic': 'أختي', 'title_french': 'Ma sœur', 'section': 'المجال الاجتماعي والاقتصادي'},
            {'order': 23, 'title': 'The Road', 'title_arabic': 'الطريق', 'title_french': 'La route', 'section': 'المجال الاجتماعي والاقتصادي'},

            # المجال السكاني - Section 7 (1st 3 lessons)
            {'order': 24, 'title': 'Youth Nutrition', 'title_arabic': 'غذاء الشباب', 'title_french': 'Nutrition des jeunes', 'section': 'المجال السكاني'},
            {'order': 25, 'title': 'Water Waste', 'title_arabic': 'تبذير الماء', 'title_french': 'Gaspillage d\'eau', 'section': 'المجال السكاني'},
            {'order': 26, 'title': 'Noise Pollution of the Environment', 'title_arabic': 'التلوث الضجيجي للبيئة', 'title_french': 'Pollution sonore de l\'environnement', 'section': 'المجال السكاني'},
        ]

        # Second Cycle - Second half of each section (26 lessons)
        lessons_s2 = [
            # الدرس اللغوي - Section 1 (remaining 11 lessons)
            {'order': 1, 'title': 'Exception', 'title_arabic': 'الإستثناء', 'title_french': 'L\'exception', 'section': 'الدرس اللغوي'},
            {'order': 2, 'title': 'Number (Masculine and Feminine)', 'title_arabic': 'العدد (تذكيره وتأنيثه)', 'title_french': 'Le nombre (masculin et féminin)', 'section': 'الدرس اللغوي'},
            {'order': 3, 'title': 'Number (Singular and Compound)', 'title_arabic': 'العدد (المفرد والمركب)', 'title_french': 'Le nombre (simple et composé)', 'section': 'الدرس اللغوي'},
            {'order': 4, 'title': 'Number (Declension and Construction)', 'title_arabic': 'العدد (إعرابه وبناؤه)', 'title_french': 'Le nombre (déclinaison et construction)', 'section': 'الدرس اللغوي'},
            {'order': 5, 'title': 'Declension of Number and Its Specifier', 'title_arabic': 'إعراب العدد وتمييزه', 'title_french': 'Déclinaison du nombre et son spécificateur', 'section': 'الدرس اللغوي'},
            {'order': 6, 'title': 'Specification/Tamyiz', 'title_arabic': 'التمييز', 'title_french': 'La spécification', 'section': 'الدرس اللغوي'},
            {'order': 7, 'title': 'Adjective/Attribution', 'title_arabic': 'النعت', 'title_french': 'L\'adjectif épithète', 'section': 'الدرس اللغوي'},
            {'order': 8, 'title': 'Emphasis/Confirmation', 'title_arabic': 'التوكيد', 'title_french': 'L\'emphase', 'section': 'الدرس اللغوي'},
            {'order': 9, 'title': 'Coordination', 'title_arabic': 'العطف', 'title_french': 'La coordination', 'section': 'الدرس اللغوي'},
            {'order': 10, 'title': 'Substitution', 'title_arabic': 'البدل', 'title_french': 'La substitution', 'section': 'الدرس اللغوي'},
            {'order': 11, 'title': 'Masculine and Feminine', 'title_arabic': 'المذكر والمؤنث', 'title_french': 'Le masculin et le féminin', 'section': 'الدرس اللغوي'},

            # التعبير والإنشاء - Section 2 (3rd lesson)
            {'order': 12, 'title': 'Role-playing Social Roles to Solve Population Problems', 'title_arabic': 'محاكاة أدوار اجتماعية لحل مشكلات سكانية', 'title_french': 'Jeu de rôles sociaux pour résoudre les problèmes de population', 'section': 'التعبير والإنشاء'},

            # مجال القيم الإسلامية - Section 3 (remaining 3 lessons)
            {'order': 13, 'title': 'Social Solidarity', 'title_arabic': 'التضامن الاجتماعي', 'title_french': 'La solidarité sociale', 'section': 'مجال القيم الإسلامية'},
            {'order': 14, 'title': 'Memory of Migration', 'title_arabic': 'ذكرى الهجرة', 'title_french': 'Mémoire de la migration', 'section': 'مجال القيم الإسلامية'},
            {'order': 15, 'title': 'Musab ibn Umair', 'title_arabic': 'مصعب بن عمير', 'title_french': 'Musab ibn Umair', 'section': 'مجال القيم الإسلامية'},

            # القيم الوطنية والإنسانية - Section 4 (remaining 2 lessons)
            {'order': 16, 'title': 'Human Rights Culture', 'title_arabic': 'ثقافة حقوق الإنسان', 'title_french': 'Culture des droits de l\'homme', 'section': 'القيم الوطنية والإنسانية'},
            {'order': 17, 'title': 'Images from National Struggle', 'title_arabic': 'صور من الكفاح الوطني', 'title_french': 'Images de la lutte nationale', 'section': 'القيم الوطنية والإنسانية'},

            # المجال الحضاري - Section 5 (2nd lesson)
            {'order': 18, 'title': 'Civilizational Interaction', 'title_arabic': 'التفاعل الحضاري', 'title_french': 'Interaction civilisationnelle', 'section': 'المجال الحضاري'},

            # المجال الاجتماعي والاقتصادي - Section 6 (remaining 2 lessons)
            {'order': 19, 'title': 'Story Number 22', 'title_arabic': 'الحكاية رقم 22', 'title_french': 'Histoire numéro 22', 'section': 'المجال الاجتماعي والاقتصادي'},
            {'order': 20, 'title': 'Letter to My Mother', 'title_arabic': 'رسالة إلى أمي', 'title_french': 'Lettre à ma mère', 'section': 'المجال الاجتماعي والاقتصادي'},

            # المجال السكاني - Section 7 (remaining 2 lessons)
            {'order': 21, 'title': 'Valley of Springs', 'title_arabic': 'وادي العيون', 'title_french': 'Vallée des sources', 'section': 'المجال السكاني'},
            {'order': 22, 'title': 'Basket of Lemons', 'title_arabic': 'سلة ليمون', 'title_french': 'Panier de citrons', 'section': 'المجال السكاني'},

            # المجال الفني والثقافي - Section 8 (4 lessons)
            {'order': 23, 'title': 'Music', 'title_arabic': 'الموسيقى', 'title_french': 'La musique', 'section': 'المجال الفني والثقافي'},
            {'order': 24, 'title': 'To the Season Imichil', 'title_arabic': 'إلى الموسم إيميشيل', 'title_french': 'À la saison Imichil', 'section': 'المجال الفني والثقافي'},
            {'order': 25, 'title': 'Be Cultured', 'title_arabic': 'كن مثقفا', 'title_french': 'Sois cultivé', 'section': 'المجال الفني والثقافي'},
            {'order': 26, 'title': 'Sunset Thoughts', 'title_arabic': 'خواطر الغروب', 'title_french': 'Pensées du coucher du soleil', 'section': 'المجال الفني والثقافي'},
        ]

        try:
            subject = Subject.objects.get(code='ARA101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code ARA101 not found. Please ensure it exists.')
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
            self.stdout.write('Deleting existing 2AC Arabic lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating 2AC Arabic lessons for this subject...')
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
                    'description': f"Arabic - {lesson_data['section']} - {lesson_data['title_arabic']}",
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
                    'description': f"Arabic - {lesson_data['section']} - {lesson_data['title_arabic']}",
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Arabic lessons for 2AC.'
            )
        )