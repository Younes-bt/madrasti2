from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Islamic Education lessons for 1B (First Baccalaureate)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 1B Islamic Education lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 13 lessons (Split across all sections)
        lessons_s1 = [
            # Purification Entry (Quran) - 1 lesson for first cycle
            {'order': 1, 'title': 'Surat Yusuf', 'title_arabic': 'سورة يوسف', 'title_french': 'Sourate Youssef'},
            # Purification Entry (Creed) - 2 lessons for first cycle
            {'order': 2, 'title': 'Faith and the Unseen', 'title_arabic': 'الإيمان والغيب', 'title_french': 'Foi et invisible'},
            {'order': 3, 'title': 'Faith and Knowledge', 'title_arabic': 'الإيمان والعلم', 'title_french': 'Foi et connaissance'},
            # Following Entry - 2 lessons for first cycle
            {'order': 4, 'title': 'Treaty of Hudaybiyyah and Conquest of Mecca: Lessons and Morals', 'title_arabic': 'صلح الحديبية وفتح مكة: دروس وعبر', 'title_french': 'Traité de Hudaybiyyah et conquête de La Mecque: leçons et morales'},
            {'order': 5, 'title': 'The Prophet as Negotiator and Counselor', 'title_arabic': 'الرسول صلى الله عليه وسلم مفاوضا ومستشيرا', 'title_french': 'Le Prophète négociateur et conseiller'},
            # Response Entry - 2 lessons for first cycle
            {'order': 6, 'title': 'Family Jurisprudence: Marriage - Rules and Purposes', 'title_arabic': 'فقه الأسرة: الزواج – الأحكام والمقاصد', 'title_french': 'Jurisprudence familiale: mariage - règles et objectifs'},
            {'order': 7, 'title': 'Family Jurisprudence: Divorce - Rules and Purposes', 'title_arabic': 'فقه الأسرة: الطلاق – الأحكام والمقاصد', 'title_french': 'Jurisprudence familiale: divorce - règles et objectifs'},
            # Justice Entry - 3 lessons for first cycle
            {'order': 8, 'title': 'Rights of Allah: Fulfilling Trust and Responsibility', 'title_arabic': 'حق الله: الوفاء بالأمانة والمسؤولية', 'title_french': 'Droits d\'Allah: accomplir la confiance et la responsabilité'},
            {'order': 9, 'title': 'Rights of Self: Patience and Certainty', 'title_arabic': 'حق النفس: الصبر واليقين', 'title_french': 'Droits de soi: patience et certitude'},
            {'order': 10, 'title': 'Rights of Others: Chastity and Modesty', 'title_arabic': 'حق الغير: العفة والحياء', 'title_french': 'Droits d\'autrui: chasteté et pudeur'},
            # Wisdom Entry - 3 lessons for first cycle
            {'order': 11, 'title': 'Competence and Merit as Basis of Assignment', 'title_arabic': 'الكفاءة والإستحقاق أساس التكليف', 'title_french': 'Compétence et mérite comme base d\'assignation'},
            {'order': 12, 'title': 'Forgiveness and Tolerance', 'title_arabic': 'العفو والتسامح', 'title_french': 'Pardon et tolérance'},
            {'order': 13, 'title': 'Protecting Society from Spread of Indecencies', 'title_arabic': 'وقاية المجتمع من تفشي الفواحش', 'title_french': 'Protection de la société contre la propagation des indécences'},
        ]

        # Second Cycle - 10 lessons (Split across remaining sections)
        lessons_s2 = [
            # Purification Entry (Creed) - 2 lessons for second cycle
            {'order': 1, 'title': 'Faith and Philosophy', 'title_arabic': 'الإيمان والفلسفة', 'title_french': 'Foi et philosophie'},
            {'order': 2, 'title': 'Faith and Building the Earth', 'title_arabic': 'الإيمان وعمارة الأرض', 'title_french': 'Foi et édification de la terre'},
            # Following Entry - 2 lessons for second cycle
            {'order': 3, 'title': 'Models for Emulation: Uthman ibn Affan and the Power of Giving and Modesty', 'title_arabic': 'نماذج للتأسي: عثمان بن عفان وقوة البذل والحياء', 'title_french': 'Modèles d\'émulation: Othman ibn Affan et le pouvoir de donner et de modestie'},
            {'order': 4, 'title': 'The Prophet at Home', 'title_arabic': 'الرسول صلى الله عليه وسلم في بيته', 'title_french': 'Le Prophète à la maison'},
            # Response Entry - 2 lessons for second cycle
            {'order': 5, 'title': 'Family Jurisprudence: Child Care and Their Rights', 'title_arabic': 'فقه الأسرة: رعاية الأطفال وحقوقهم', 'title_french': 'Jurisprudence familiale: soins aux enfants et leurs droits'},
            {'order': 6, 'title': 'Family Jurisprudence: Family as Core of Society', 'title_arabic': 'فقه الأسرة: الأسرة نواة المجتمع', 'title_french': 'Jurisprudence familiale: famille comme noyau de la société'},
            # Justice Entry - 1 lesson for second cycle
            {'order': 7, 'title': 'Environmental Rights: Moderation in Environmental Exploitation', 'title_arabic': 'حق البيئة: التوسط والإعتدال في استغلال البيئة', 'title_french': 'Droits environnementaux: modération dans l\'exploitation environnementale'},
            # Wisdom Entry - 3 lessons remaining moved to second cycle
            {'order': 8, 'title': 'Hadith of the Seven Whom Allah Will Shade', 'title_arabic': 'حديث السبعة الذين يظلهم الله', 'title_french': 'Hadith des sept qu\'Allah ombragera'},
            # Additional lessons to balance cycles
            {'order': 9, 'title': 'Review of Purification Concepts', 'title_arabic': 'مراجعة مفاهيم التزكية', 'title_french': 'Révision des concepts de purification'},
            {'order': 10, 'title': 'Integration of Islamic Values', 'title_arabic': 'تكامل القيم الإسلامية', 'title_french': 'Intégration des valeurs islamiques'},
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
            grade = Grade.objects.get(code='1B')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "1B" not found. Please create it first.')
            )
            return

        # Get all specified tracks
        track_codes = ['1BAC-SM', '1BAC-SE', '1BAC-ECO', '1BAC-LSH', '1BAC-AA', '1BAC-STM', '1BAC-STE', '1BAC-LA', '1BAC-SC', '1BAC-SM-BIOF', '1BAC-SE-BIOF', '1BAC-STE-BIOF', '1BAC-STM-BIOF']
        tracks = []

        for track_code in track_codes:
            try:
                track = Track.objects.get(code=track_code)
                tracks.append(track)
                self.stdout.write(f'Found track: {track.name}')
            except Track.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'Track with code "{track_code}" not found. Please create it first.')
                )
                return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 1B Islamic Education lessons...')
            for track in tracks:
                existing_lessons = Lesson.objects.filter(
                    subject=subject,
                    grade=grade,
                    tracks__code=track.code
                )
                for lesson in existing_lessons:
                    if lesson.tracks.count() == 1:
                        lesson.delete()
                    else:
                        lesson.tracks.remove(track)
            self.stdout.write(self.style.WARNING('Removed existing Islamic Education lessons for 1B tracks.'))

        self.stdout.write('Creating 1B Islamic Education lessons...')
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
                    'description': f"Islamic Education - {lesson_data['title_arabic']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
            # Add all specified tracks to the lesson
            lesson.tracks.add(*tracks)

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
                    'description': f"Islamic Education - {lesson_data['title_arabic']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
            # Add all specified tracks to the lesson
            lesson.tracks.add(*tracks)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first cycle and {created_count_s2} new second cycle Islamic Education lessons for 1B.'
            )
        )