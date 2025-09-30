from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Arabic lessons for 1AC (Première Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 1AC Arabic lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - First half of each section (27 lessons)
        lessons_s1 = [
            # مجال القيم الإسلامية - Section 1 (1st & 2nd lessons)
            {'order': 1, 'title': 'From Surah Al-An\'am', 'title_arabic': 'من سورة الأنعام', 'title_french': 'De la sourate Al-An\'am', 'section': 'مجال القيم الإسلامية'},
            {'order': 2, 'title': 'Farewell Pilgrimage Speech', 'title_arabic': 'خطبة حجة الوداع', 'title_french': 'Discours du pèlerinage d\'adieu', 'section': 'مجال القيم الإسلامية'},

            # مجال القيم الوطنية والإنسانية - Section 2 (1st, 2nd & 3rd lessons)
            {'order': 3, 'title': 'National and Human Values', 'title_arabic': 'القيم الوطنية والإنسانية', 'title_french': 'Valeurs nationales et humaines', 'section': 'مجال القيم الوطنية والإنسانية'},
            {'order': 4, 'title': 'Love of Homeland', 'title_arabic': 'حب الوطن', 'title_french': 'Amour de la patrie', 'section': 'مجال القيم الوطنية والإنسانية'},
            {'order': 5, 'title': 'Land of Passage and Refuge', 'title_arabic': 'أرض العبور والملاذ', 'title_french': 'Terre de passage et de refuge', 'section': 'مجال القيم الوطنية والإنسانية'},

            # المجال الحضاري - Section 3 (1st & 2nd lessons)
            {'order': 6, 'title': 'Pottery', 'title_arabic': 'الخزف', 'title_french': 'La poterie', 'section': 'المجال الحضاري'},
            {'order': 7, 'title': 'Mobile Phone', 'title_arabic': 'الهاتف النقال', 'title_french': 'Téléphone portable', 'section': 'المجال الحضاري'},

            # المجال الاجتماعي والاقتصادي - Section 4 (1st, 2nd & 3rd lessons)
            {'order': 8, 'title': 'Sports and Society', 'title_arabic': 'الرياضة والمجتمع', 'title_french': 'Sport et société', 'section': 'المجال الاجتماعي والاقتصادي'},
            {'order': 9, 'title': 'Economic Activity', 'title_arabic': 'النشاط الاقتصادي', 'title_french': 'Activité économique', 'section': 'المجال الاجتماعي والاقتصادي'},
            {'order': 10, 'title': 'Exodus', 'title_arabic': 'الخروج', 'title_french': 'L\'exode', 'section': 'المجال الاجتماعي والاقتصادي'},

            # المجال السكاني - Section 5 (1st & 2nd lessons)
            {'order': 11, 'title': 'Nature Between Yesterday and Today', 'title_arabic': 'الطبيعة بين الأمس و اليوم', 'title_french': 'La nature entre hier et aujourd\'hui', 'section': 'المجال السكاني'},
            {'order': 12, 'title': 'Water Pollution', 'title_arabic': 'تلوث الماء', 'title_french': 'Pollution de l\'eau', 'section': 'المجال السكاني'},

            # المجال الفني والثقافي - Section 6 (1st & 2nd lessons)
            {'order': 13, 'title': 'Don\'t Seek to Straighten What Cannot Be Straightened', 'title_arabic': 'لا تلتمس تقويم ما لا يستقيم', 'title_french': 'Ne cherche pas à redresser ce qui ne peut l\'être', 'section': 'المجال الفني والثقافي'},
            {'order': 14, 'title': 'The Circle', 'title_arabic': 'الحلقة', 'title_french': 'Le cercle', 'section': 'المجال الفني والثقافي'},

            # الدرس اللغوي - Section 7 (1st 12 lessons)
            {'order': 15, 'title': 'Morphological Scale and Root and Augmented Forms', 'title_arabic': 'الميزان الصرفي والمجرد والمزيد', 'title_french': 'Balance morphologique et formes simples et augmentées', 'section': 'الدرس اللغوي'},
            {'order': 16, 'title': 'Augmented Trilateral and Quadrilateral and Meanings of Augmentation Forms', 'title_arabic': 'مزيد الثلاثي والرباعي ومعاني صيغ الزوائد', 'title_french': 'Trilittères et quadrilittères augmentés et significations des formes d\'augmentation', 'section': 'الدرس اللغوي'},
            {'order': 17, 'title': 'Conjugation of Sound Verbs: Simple, Hamzated and Geminated', 'title_arabic': 'تصريف الفعل الصحيح: السالم والمهموز والمضعف', 'title_french': 'Conjugaison du verbe sain: simple, hamzé et géminé', 'section': 'الدرس اللغوي'},
            {'order': 18, 'title': 'Conjugation of Weak Verbs: Initial and Hollow', 'title_arabic': 'تصريف الفعل المعتل: المثال والأجوف', 'title_french': 'Conjugaison du verbe faible: initial et creux', 'section': 'الدرس اللغوي'},
            {'order': 19, 'title': 'Conjugation of Weak Verbs: Defective', 'title_arabic': 'تصريف الفعل المعتل: الناقص', 'title_french': 'Conjugaison du verbe faible: défectif', 'section': 'الدرس اللغوي'},
            {'order': 20, 'title': 'Conjugation of Doubly Weak Verbs: Separated and Joined', 'title_arabic': 'تصريف الفعل اللفيف المفروق واللفيف المقرون', 'title_french': 'Conjugaison du verbe doublement faible: séparé et joint', 'section': 'الدرس اللغوي'},
            {'order': 21, 'title': 'Inflection and Construction', 'title_arabic': 'الاعراب والبناء', 'title_french': 'Déclinaison et construction', 'section': 'الدرس اللغوي'},
            {'order': 22, 'title': 'Inflected and Built Nouns', 'title_arabic': 'الأسماء المعربة والأسماء المبنية', 'title_french': 'Noms déclinés et noms construits', 'section': 'الدرس اللغوي'},
            {'order': 23, 'title': 'Construction Signs in Verbs', 'title_arabic': 'علامات البناء في الأفعال', 'title_french': 'Signes de construction dans les verbes', 'section': 'الدرس اللغوي'},
            {'order': 24, 'title': 'Inflection of Present Verb - Nominative and Accusative', 'title_arabic': 'إعراب الفعل المضارع – رفعه ونصبه', 'title_french': 'Déclinaison du verbe présent - nominatif et accusatif', 'section': 'الدرس اللغوي'},
            {'order': 25, 'title': 'Inflection of Present Verb - Jussive', 'title_arabic': 'إعراب الفعل المضارع – جزمه', 'title_french': 'Déclinaison du verbe présent - jussif', 'section': 'الدرس اللغوي'},
            {'order': 26, 'title': 'Indefinite and Definite', 'title_arabic': 'النكرة والمعرفة', 'title_french': 'Indéfini et défini', 'section': 'الدرس اللغوي'},

            # التعبير والإنشاء - Section 8 (1st, 2nd & 3rd lessons)
            {'order': 27, 'title': 'Skill of Expanding and Explaining an Idea', 'title_arabic': 'مهارة توسيع فكرة وتفسيرها', 'title_french': 'Compétence d\'expansion et d\'explication d\'une idée', 'section': 'التعبير والإنشاء'},
        ]

        # Second Cycle - Second half of each section (28 lessons)
        lessons_s2 = [
            # مجال القيم الإسلامية - Section 1 (3rd & 4th lessons)
            {'order': 1, 'title': 'From the Reality of Islam', 'title_arabic': 'من حقيقة الإسلام', 'title_french': 'De la réalité de l\'Islam', 'section': 'مجال القيم الإسلامية'},
            {'order': 2, 'title': 'Burda', 'title_arabic': 'بردة', 'title_french': 'Burda', 'section': 'مجال القيم الإسلامية'},

            # مجال القيم الوطنية والإنسانية - Section 2 (4th & 5th lessons)
            {'order': 3, 'title': 'Dear Child', 'title_arabic': 'أيها الطفل العزيز', 'title_french': 'Cher enfant', 'section': 'مجال القيم الوطنية والإنسانية'},
            {'order': 4, 'title': 'My Country', 'title_arabic': 'بلادي', 'title_french': 'Mon pays', 'section': 'مجال القيم الوطنية والإنسانية'},

            # المجال الحضاري - Section 3 (3rd & 4th lessons)
            {'order': 5, 'title': 'Information Technology', 'title_arabic': 'تكنولوجيا المعلومات', 'title_french': 'Technologie de l\'information', 'section': 'المجال الحضاري'},
            {'order': 6, 'title': 'Ruins', 'title_arabic': 'أطلال', 'title_french': 'Ruines', 'section': 'المجال الحضاري'},

            # المجال الاجتماعي والاقتصادي - Section 4 (4th & 5th lessons)
            {'order': 7, 'title': 'To My Mother', 'title_arabic': 'إلى أمي', 'title_french': 'À ma mère', 'section': 'المجال الاجتماعي والاقتصادي'},
            {'order': 8, 'title': 'Tula', 'title_arabic': 'طولا', 'title_french': 'Tula', 'section': 'المجال الاجتماعي والاقتصادي'},

            # المجال السكاني - Section 5 (3rd & 4th lessons)
            {'order': 9, 'title': 'Capabilities of Science and Technology', 'title_arabic': 'قدرات العلم والتكنولوجيا', 'title_french': 'Capacités de la science et de la technologie', 'section': 'المجال السكاني'},
            {'order': 10, 'title': 'Chocolate', 'title_arabic': 'شكولاطة', 'title_french': 'Chocolat', 'section': 'المجال السكاني'},

            # المجال الفني والثقافي - Section 6 (3rd & 4th lessons)
            {'order': 11, 'title': 'From Our Cultural Heritage', 'title_arabic': 'من موروثنا الثقافي', 'title_french': 'De notre héritage culturel', 'section': 'المجال الفني والثقافي'},
            {'order': 12, 'title': 'Job', 'title_arabic': 'أيوب', 'title_french': 'Job', 'section': 'المجال الفني والثقافي'},

            # الدرس اللغوي - Section 7 (remaining 12 lessons)
            {'order': 13, 'title': 'Proper Noun', 'title_arabic': 'العلم', 'title_french': 'Nom propre', 'section': 'الدرس اللغوي'},
            {'order': 14, 'title': 'Apparent and Hidden Pronoun', 'title_arabic': 'الضمير البارز والضمير المستتر', 'title_french': 'Pronom apparent et pronom caché', 'section': 'الدرس اللغوي'},
            {'order': 15, 'title': 'Connected and Separate Pronoun', 'title_arabic': 'الضمير المتصل والمنفصل', 'title_french': 'Pronom connecté et séparé', 'section': 'الدرس اللغوي'},
            {'order': 16, 'title': 'Demonstrative Pronouns', 'title_arabic': 'أسماء الاشارة', 'title_french': 'Pronoms démonstratifs', 'section': 'الدرس اللغوي'},
            {'order': 17, 'title': 'Relative Noun', 'title_arabic': 'الاسم الموصول', 'title_french': 'Nom relatif', 'section': 'الدرس اللغوي'},
            {'order': 18, 'title': 'States of Subject and Predicate', 'title_arabic': 'أحوال المبتدأ والخبر', 'title_french': 'États du sujet et du prédicat', 'section': 'الدرس اللغوي'},
            {'order': 19, 'title': 'Subject and Predicate and Their Agreement', 'title_arabic': 'المبتدأ والخبر وتطابقهما', 'title_french': 'Sujet et prédicat et leur accord', 'section': 'الدرس اللغوي'},
            {'order': 20, 'title': 'Intransitive and Transitive Verb', 'title_arabic': 'الفعل اللازم والمتعدي', 'title_french': 'Verbe intransitif et transitif', 'section': 'الدرس اللغوي'},
            {'order': 21, 'title': 'Transitive Verbs to Two Objects Originally Subject and Predicate', 'title_arabic': 'الفعل اللازم والمتعدي: الافعال المتعدية الى مفعولين أصلهما مبتدا وخبر', 'title_french': 'Verbes transitifs à deux objets originellement sujet et prédicat', 'section': 'الدرس اللغوي'},
            {'order': 22, 'title': 'Transitive Verbs to Two Objects Not Originally Subject and Predicate', 'title_arabic': 'الفعل اللازم والمتعدي: الافعال المتعدية الى مفعولين ليس أصلهما مبتدا وخبر', 'title_french': 'Verbes transitifs à deux objets non originellement sujet et prédicat', 'section': 'الدرس اللغوي'},
            {'order': 23, 'title': 'Passive Voice and Its Rules', 'title_arabic': 'المبني للمجهول وأحكامه', 'title_french': 'Voix passive et ses règles', 'section': 'الدرس اللغوي'},

            # التعبير والإنشاء - Section 8 (4th & 5th lessons)
            {'order': 24, 'title': 'Skill of Book Definition and Preparing a Card to Present It', 'title_arabic': 'مهارة تعريف الكتاب وإعداد بطاقة لتقديمه', 'title_french': 'Compétence de définition du livre et préparation d\'une fiche pour le présenter', 'section': 'التعبير والإنشاء'},
            {'order': 25, 'title': 'Skill of Information Research and Preparing Documentary Files', 'title_arabic': 'مهارة البحث عن المعلومات وإعداد ملفات وثائقية', 'title_french': 'Compétence de recherche d\'informations et préparation de dossiers documentaires', 'section': 'التعبير والإنشاء'},
            {'order': 26, 'title': 'Skill of Journalistic Production: Definition of Clipping', 'title_arabic': 'مهارة الانتاج الصحفي: تعريف القصاصة (شكلها وعناصرها)', 'title_french': 'Compétence de production journalistique: définition du découpage', 'section': 'التعبير والإنشاء'},
            {'order': 27, 'title': 'Skill of Letter Writing and Communication', 'title_arabic': 'مهارة كتابة الرسائل والتواصل بها', 'title_french': 'Compétence d\'écriture de lettres et de communication', 'section': 'التعبير والإنشاء'},
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
            self.stdout.write('Deleting existing 1AC Arabic lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating 1AC Arabic lessons for this subject...')
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Arabic lessons for 1AC.'
            )
        )