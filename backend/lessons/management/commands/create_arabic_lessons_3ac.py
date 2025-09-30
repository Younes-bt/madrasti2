from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Arabic lessons for 3AC (Troisième Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 3AC Arabic lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # Split each section across both cycles

        # First Cycle - 40 lessons (first half of each section)
        lessons_s1 = [
            # الدرس اللغوي (5 lessons)
            {'order': 1, 'title': 'Participle and Exaggeration Forms', 'title_arabic': 'اسم الفاعل وصيغ المبالغة وعملهما', 'title_french': 'Participe actif et formes d\'exagération', 'section': 'الدرس اللغوي'},
            {'order': 2, 'title': 'Passive Participle and Its Function', 'title_arabic': 'اسم المفعول وعمله', 'title_french': 'Participe passif et sa fonction', 'section': 'الدرس اللغوي'},
            {'order': 3, 'title': 'Nouns of Time and Place', 'title_arabic': 'أسماء الزمان والمكان', 'title_french': 'Noms de temps et de lieu', 'section': 'الدرس اللغوي'},
            {'order': 4, 'title': 'Noun of Instrument', 'title_arabic': 'اسم الآلة', 'title_french': 'Nom d\'instrument', 'section': 'الدرس اللغوي'},
            {'order': 5, 'title': 'Vowel Change (Ilal)', 'title_arabic': 'الإعلال', 'title_french': 'Changement vocalique', 'section': 'الدرس اللغوي'},

            # التعبير والإنشاء (2 lessons)
            {'order': 6, 'title': 'Narrative Skills: Writing Diaries', 'title_arabic': 'مهارة السرد: كتابة اليوميات', 'title_french': 'Compétences narratives: écriture de journaux', 'section': 'التعبير والإنشاء'},
            {'order': 7, 'title': 'Commenting and Responding to Opinions', 'title_arabic': 'مهارة التعقيب والتعليق على رأي', 'title_french': 'Commenter et répondre aux opinions', 'section': 'التعبير والإنشاء'},

            # مجال القيم الإسلامية (4 lessons)
            {'order': 8, 'title': 'Allah\'s Speaker (Moses)', 'title_arabic': 'كليم الله', 'title_french': 'L\'interlocuteur d\'Allah (Moïse)', 'section': 'مجال القيم الإسلامية'},
            {'order': 9, 'title': 'Muslim Qualities', 'title_arabic': 'خصال المسلم', 'title_french': 'Qualités du musulman', 'section': 'مجال القيم الإسلامية'},
            {'order': 10, 'title': 'Islam and Human Rights', 'title_arabic': 'الإسلام وحقوق الإنسان', 'title_french': 'Islam et droits de l\'homme', 'section': 'مجال القيم الإسلامية'},
            {'order': 11, 'title': 'Talk of the Soul', 'title_arabic': 'حديث الروح', 'title_french': 'Discours de l\'âme', 'section': 'مجال القيم الإسلامية'},

            # القيم الوطنية والإنسانية (5 lessons)
            {'order': 12, 'title': 'Exile', 'title_arabic': 'المنفى', 'title_french': 'L\'exil', 'section': 'القيم الوطنية والإنسانية'},
            {'order': 13, 'title': 'Strange Dialogue', 'title_arabic': 'حوار عجيب', 'title_french': 'Dialogue étrange', 'section': 'القيم الوطنية والإنسانية'},
            {'order': 14, 'title': 'Eternal Song', 'title_arabic': 'الأغنية الأبدية', 'title_french': 'Chanson éternelle', 'section': 'القيم الوطنية والإنسانية'},
            {'order': 15, 'title': 'My Homeland', 'title_arabic': 'وطني', 'title_french': 'Ma patrie', 'section': 'القيم الوطنية والإنسانية'},
            {'order': 16, 'title': 'The Locusts', 'title_arabic': 'الجراد', 'title_french': 'Les sauterelles', 'section': 'القيم الوطنية والإنسانية'},

            # المجال الحضاري (3 lessons)
            {'order': 17, 'title': 'Radiance of Moroccan Civilization', 'title_arabic': 'إشعاع الحضارة المغربية', 'title_french': 'Rayonnement de la civilisation marocaine', 'section': 'المجال الحضاري'},
            {'order': 18, 'title': 'Internet', 'title_arabic': 'الإنترنت', 'title_french': 'Internet', 'section': 'المجال الحضاري'},
            {'order': 19, 'title': 'On the Magic Carpet', 'title_arabic': 'على بساط الريح', 'title_french': 'Sur le tapis volant', 'section': 'المجال الحضاري'},

            # نصوص أخرى من الدورة الأولى (21 lessons)
            {'order': 20, 'title': 'Information Technology', 'title_arabic': 'تقنيات المعلومات', 'title_french': 'Technologies de l\'information', 'section': 'نصوص أخرى'},
            {'order': 21, 'title': 'From Our Civilization\'s Fragrance', 'title_arabic': 'من عبق حضارتنا', 'title_french': 'Du parfum de notre civilisation', 'section': 'نصوص أخرى'},
            {'order': 22, 'title': 'Sites of Islamic Cities', 'title_arabic': 'مواقع المدن الإسلامية', 'title_french': 'Sites des villes islamiques', 'section': 'نصوص أخرى'},
            {'order': 23, 'title': 'Near Your Alley', 'title_arabic': 'بالقرب من زقاقكم', 'title_french': 'Près de votre ruelle', 'section': 'نصوص أخرى'},
            {'order': 24, 'title': 'Women\'s Role in National Economy', 'title_arabic': 'دور المرأة في الاقتصاد الوطني', 'title_french': 'Rôle de la femme dans l\'économie nationale', 'section': 'نصوص أخرى'},
            {'order': 25, 'title': 'Civil Behavior', 'title_arabic': 'سلوك مدني', 'title_french': 'Comportement civil', 'section': 'نصوص أخرى'},
            {'order': 26, 'title': 'Anger', 'title_arabic': 'غضب', 'title_french': 'Colère', 'section': 'نصوص أخرى'},
            {'order': 27, 'title': 'The House', 'title_arabic': 'البيت', 'title_french': 'La maison', 'section': 'نصوص أخرى'},
            {'order': 28, 'title': 'Traffic Accidents', 'title_arabic': 'حوادث السير', 'title_french': 'Accidents de circulation', 'section': 'نصوص أخرى'},
            {'order': 29, 'title': 'Smoking Harm', 'title_arabic': 'مضار التدخين', 'title_french': 'Méfaits du tabagisme', 'section': 'نصوص أخرى'},
            {'order': 30, 'title': 'We and Archaeological Monuments', 'title_arabic': 'نحن والمعالم الأثرية', 'title_french': 'Nous et les monuments archéologiques', 'section': 'نصوص أخرى'},
            {'order': 31, 'title': 'Family Planning', 'title_arabic': 'تنظيم الأسرة', 'title_french': 'Planification familiale', 'section': 'نصوص أخرى'},
            {'order': 32, 'title': 'We and Our Environment', 'title_arabic': 'نحن وبيئتنا', 'title_french': 'Nous et notre environnement', 'section': 'نصوص أخرى'},
            {'order': 33, 'title': 'Taskiwin Dance', 'title_arabic': 'رقصة تاسكيوين', 'title_french': 'Danse Taskiwin', 'section': 'نصوص أخرى'},
            {'order': 34, 'title': 'Moroccan Folk Music', 'title_arabic': 'الموسيقى الشعبية المغربية', 'title_french': 'Musique folklorique marocaine', 'section': 'نصوص أخرى'},
            {'order': 35, 'title': 'Genius of Arabic Calligraphy', 'title_arabic': 'عبقرية الخط العربي', 'title_french': 'Génie de la calligraphie arabe', 'section': 'نصوص أخرى'},
            {'order': 36, 'title': 'My Human Brother', 'title_arabic': 'أخي الإنسان', 'title_french': 'Mon frère humain', 'section': 'نصوص أخرى'},
            {'order': 37, 'title': 'For a Better Society', 'title_arabic': 'من أجل مجتمع أفضل', 'title_french': 'Pour une meilleure société', 'section': 'نصوص أخرى'},
            {'order': 38, 'title': 'We All Hope for Peace', 'title_arabic': 'كلنا نرجو السلام', 'title_french': 'Nous espérons tous la paix', 'section': 'نصوص أخرى'},
            {'order': 39, 'title': 'Homeland and Patriotism', 'title_arabic': 'الوطن والوطنية', 'title_french': 'Patrie et patriotisme', 'section': 'نصوص أخرى'},
            {'order': 40, 'title': 'Sacrifice Until Victory', 'title_arabic': 'الفداء حتى النصر', 'title_french': 'Sacrifice jusqu\'à la victoire', 'section': 'نصوص أخرى'},
        ]

        # Second Cycle - 37 lessons (second half of each section)
        lessons_s2 = [
            # الدرس اللغوي (6 lessons)
            {'order': 1, 'title': 'Substitution (Ibdal)', 'title_arabic': 'الإبدال', 'title_french': 'Substitution', 'section': 'الدرس اللغوي'},
            {'order': 2, 'title': 'Diminutive', 'title_arabic': 'التصغير', 'title_french': 'Diminutif', 'section': 'الدرس اللغوي'},
            {'order': 3, 'title': 'Attribution', 'title_arabic': 'النسبة', 'title_french': 'Attribution', 'section': 'الدرس اللغوي'},
            {'order': 4, 'title': 'Dictionaries', 'title_arabic': 'المعاجم', 'title_french': 'Dictionnaires', 'section': 'الدرس اللغوي'},
            {'order': 5, 'title': 'Vocative Style', 'title_arabic': 'أسلوب النداء', 'title_french': 'Style vocatif', 'section': 'الدرس اللغوي'},
            {'order': 6, 'title': 'Interrogative Style', 'title_arabic': 'أسلوب الاستفهام', 'title_french': 'Style interrogatif', 'section': 'الدرس اللغوي'},

            # التعبير والإنشاء (3 lessons)
            {'order': 7, 'title': 'Describing Characters and Places', 'title_arabic': 'مهارة وصف الشخوص والأمكنة', 'title_french': 'Décrire personnages et lieux', 'section': 'التعبير والإنشاء'},
            {'order': 8, 'title': 'Describing a Journey', 'title_arabic': 'مهارة وصف رحلة', 'title_french': 'Décrire un voyage', 'section': 'التعبير والإنشاء'},
            {'order': 9, 'title': 'Training on Issuing Value Judgments on Creative Work', 'title_arabic': 'التدريب على إصدار حكم قيمة على عمل إبداعي', 'title_french': 'Formation au jugement de valeur sur œuvre créative', 'section': 'التعبير والإنشاء'},

            # المجال الاجتماعي والاقتصادي (4 lessons)
            {'order': 10, 'title': 'School of Life', 'title_arabic': 'مدرسة الحياة', 'title_french': 'École de la vie', 'section': 'المجال الاجتماعي والاقتصادي'},
            {'order': 11, 'title': 'A Woman\'s Journey', 'title_arabic': 'مسيرة إمرأة', 'title_french': 'Parcours d\'une femme', 'section': 'المجال الاجتماعي والاقتصادي'},
            {'order': 12, 'title': 'Economic Power', 'title_arabic': 'القوة الاقتصادية', 'title_french': 'Puissance économique', 'section': 'المجال الاجتماعي والاقتصادي'},
            {'order': 13, 'title': 'The Toiler', 'title_arabic': 'الكادح', 'title_french': 'Le travailleur', 'section': 'المجال الاجتماعي والاقتصادي'},

            # المجال السكاني (4 lessons)
            {'order': 14, 'title': 'Water Pollution', 'title_arabic': 'التلوث المائي', 'title_french': 'Pollution de l\'eau', 'section': 'المجال السكاني'},
            {'order': 15, 'title': 'Al-Farsiui\'s Journey', 'title_arabic': 'رحلة الفرسيوي', 'title_french': 'Voyage d\'Al-Farsiui', 'section': 'المجال السكاني'},
            {'order': 16, 'title': 'Black Clouds', 'title_arabic': 'غيم أسود', 'title_french': 'Nuages noirs', 'section': 'المجال السكاني'},
            {'order': 17, 'title': 'Me and the City', 'title_arabic': 'أنا والمدينة', 'title_french': 'Moi et la ville', 'section': 'المجال السكاني'},

            # المجال الفني والثقافي (3 lessons)
            {'order': 18, 'title': 'Cinema and Photography', 'title_arabic': 'السينما والصورة الفوتوغرافية', 'title_french': 'Cinéma et photographie', 'section': 'المجال الفني والثقافي'},
            {'order': 19, 'title': 'Story of the Fox and the Crow', 'title_arabic': 'حكاية الثعلب والغراب', 'title_french': 'Histoire du renard et du corbeau', 'section': 'المجال الفني والثقافي'},
            {'order': 20, 'title': 'The Blind Musician', 'title_arabic': 'الموسيقية العمياء', 'title_french': 'La musicienne aveugle', 'section': 'المجال الفني والثقافي'},

            # نصوص أخرى من الدورة الثانية (17 lessons)
            {'order': 21, 'title': 'Sang Mecca', 'title_arabic': 'غنيت مكة', 'title_french': 'J\'ai chanté La Mecque', 'section': 'نصوص أخرى'},
            {'order': 22, 'title': 'Man in Islam', 'title_arabic': 'الإنسان في الإسلام', 'title_french': 'L\'homme dans l\'Islam', 'section': 'نصوص أخرى'},
            {'order': 23, 'title': 'True Dawn', 'title_arabic': 'الفجر الصادق', 'title_french': 'L\'aube véritable', 'section': 'نصوص أخرى'},
            {'order': 24, 'title': 'Necessities Not Rights', 'title_arabic': 'ضرورات لا حقوق', 'title_french': 'Nécessités pas droits', 'section': 'نصوص أخرى'},
            {'order': 25, 'title': 'From Islamic Values', 'title_arabic': 'من قيم الإسلام', 'title_french': 'Des valeurs de l\'Islam', 'section': 'نصوص أخرى'},
            {'order': 26, 'title': 'Text Kalim', 'title_arabic': 'نص كليم', 'title_french': 'Texte Kalim', 'section': 'نصوص أخرى'},
            {'order': 27, 'title': 'Specialization Style', 'title_arabic': 'أسلوب الاختصاص', 'title_french': 'Style de spécialisation', 'section': 'الدرس اللغوي'},
            {'order': 28, 'title': 'Praise and Blame Style', 'title_arabic': 'أسلوب المدح والذم', 'title_french': 'Style d\'éloge et de blâme', 'section': 'الدرس اللغوي'},
            {'order': 29, 'title': 'Exclamation Style', 'title_arabic': 'أسلوب التعجب', 'title_french': 'Style d\'exclamation', 'section': 'الدرس اللغوي'},
            {'order': 30, 'title': 'Superlative (Formation)', 'title_arabic': 'اسم التفضيل (صياغته)', 'title_french': 'Superlatif (formation)', 'section': 'الدرس اللغوي'},
            {'order': 31, 'title': 'Indeclinable Nouns', 'title_arabic': 'الممنوع من الصرف', 'title_french': 'Noms indéclinables', 'section': 'الدرس اللغوي'},
            {'order': 32, 'title': 'Genitive Construction', 'title_arabic': 'الإضافة', 'title_french': 'Construction génitive', 'section': 'الدرس اللغوي'},
            {'order': 33, 'title': 'Descriptive Adjective', 'title_arabic': 'الصفة المشبهة', 'title_french': 'Adjectif descriptif', 'section': 'الدرس اللغوي'},
            {'order': 34, 'title': 'Warning and Encouragement Style', 'title_arabic': 'أسلوب التحذير والإغراء', 'title_french': 'Style d\'avertissement et d\'encouragement', 'section': 'الدرس اللغوي'},
            {'order': 35, 'title': 'Training on Imagining Strange or Science Fiction Stories', 'title_arabic': 'التدريب على تخيل حكاية عجيبة أو من الخيال العلمي', 'title_french': 'Formation à l\'imagination d\'histoires étranges ou de science-fiction', 'section': 'التعبير والإنشاء'},
            {'order': 36, 'title': 'Training on Writing Autobiography or Biography', 'title_arabic': 'التدريب على مهارة كتابة سيرة ذاتية أو غيرية', 'title_french': 'Formation à la rédaction d\'autobiographie ou biographie', 'section': 'التعبير والإنشاء'},
            {'order': 37, 'title': 'Specialization Style (Repeated)', 'title_arabic': 'أسلوب الاختصاص', 'title_french': 'Style de spécialisation (répété)', 'section': 'الدرس اللغوي'},
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
            grade = Grade.objects.get(code='3AC')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "3AC" not found. Please create it first.')
            )
            return

        # Get both tracks
        try:
            track_nrml = Track.objects.get(code='3AC-NRML')
            self.stdout.write(f'Found NRML track: {track_nrml.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "3AC-NRML" not found. Please create it first.')
            )
            return

        try:
            track_frn = Track.objects.get(code='3AC-FRN')
            self.stdout.write(f'Found FRN track: {track_frn.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "3AC-FRN" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 3AC Arabic lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating 3AC Arabic lessons for this subject...')
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Arabic lessons for 3AC.'
            )
        )