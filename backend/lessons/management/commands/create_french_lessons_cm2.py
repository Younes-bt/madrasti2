from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create French lessons for CM2 (Cours Moyen 2)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CM2 French lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - First half of each section
        lessons_s1 = [
            # Grammaire (7 lessons)
            {'order': 1, 'title_arabic': 'أنواع الجمل', 'title': 'Les types de phrases', 'category': 'Grammaire'},
            {'order': 2, 'title_arabic': 'الجملة بدون فعل', 'title': 'La phrase sans verbe', 'category': 'Grammaire'},
            {'order': 3, 'title_arabic': 'المجموعة الاسمية الفاعل', 'title': 'Le Groupe Nominal Sujet (GNS)', 'category': 'Grammaire'},
            {'order': 4, 'title_arabic': 'المجموعة الفعلية', 'title': 'Le groupe verbal (GV)', 'category': 'Grammaire'},
            {'order': 5, 'title_arabic': 'المحددات', 'title': 'Les déterminants', 'category': 'Grammaire'},
            {'order': 6, 'title_arabic': 'الجملة الاستفهامية', 'title': 'La phrase interrogative', 'category': 'Grammaire'},
            {'order': 7, 'title_arabic': 'توسيع وتقليص الجملة', 'title': 'Expansion et réduction de la phrase', 'category': 'Grammaire'},

            # Conjugaison (6 lessons)
            {'order': 8, 'title_arabic': 'المجموعات الثلاث للأفعال', 'title': 'Les trois groupes de verbes', 'category': 'Conjugaison'},
            {'order': 9, 'title_arabic': 'الزمن - النهايات - الأشخاص', 'title': 'Temps – terminaisons – personnes', 'category': 'Conjugaison'},
            {'order': 10, 'title_arabic': 'الماضي - الحاضر - المستقبل', 'title': 'Passé – Présent – Futur', 'category': 'Conjugaison'},
            {'order': 11, 'title_arabic': 'الحاضر للأفعال المعتادة', 'title': 'Présent des verbes usuels', 'category': 'Conjugaison'},
            {'order': 12, 'title_arabic': 'الماضي المركب لأفعال المجموعة الأولى', 'title': 'Passé composé des verbes du 1er groupe', 'category': 'Conjugaison'},
            {'order': 13, 'title_arabic': 'الماضي المركب لأفعال المجموعة الثانية', 'title': 'Passé composé des verbes du 2ème groupe', 'category': 'Conjugaison'},

            # Orthographe (6 lessons)
            {'order': 14, 'title_arabic': 'a – à', 'title': 'a – à', 'category': 'Orthographe'},
            {'order': 15, 'title_arabic': 'علامات الترقيم', 'title': 'La ponctuation', 'category': 'Orthographe'},
            {'order': 16, 'title_arabic': 'المؤنث في [é] و [ée]', 'title': 'Les féminins en [é] & [ée]', 'category': 'Orthographe'},
            {'order': 17, 'title_arabic': 'Tout – toute(s) – tous', 'title': 'Tout – toute(s) – tous', 'category': 'Orthographe'},
            {'order': 18, 'title_arabic': 'اسم المفعول', 'title': 'Le participe passé', 'category': 'Orthographe'},
            {'order': 19, 'title_arabic': 'تطابق الصفة', 'title': 'Accord de l\'adjectif', 'category': 'Orthographe'},

            # Lexique (2 lessons)
            {'order': 20, 'title_arabic': 'القاموس', 'title': 'Le dictionnaire', 'category': 'Lexique'},
            {'order': 21, 'title_arabic': 'الكلمات المتجانسة', 'title': 'Les homonymes', 'category': 'Lexique'},

            # Pièces de théâtre éducatives (10 lessons)
            {'order': 22, 'title_arabic': 'حلم... في عام 2000 وبعض', 'title': 'Rêve…en 2000 et quelques', 'category': 'Théâtre'},
            {'order': 23, 'title_arabic': 'في المطعم', 'title': 'Au restaurant', 'category': 'Théâtre'},
            {'order': 24, 'title_arabic': 'أساتذة وتلاميذ', 'title': 'Profs et élèves', 'category': 'Théâtre'},
            {'order': 25, 'title_arabic': 'الأمير الصغير المجري', 'title': 'Le petit prince hongrois', 'category': 'Théâtre'},
            {'order': 26, 'title_arabic': 'المريض الصغير', 'title': 'Le petit malade', 'category': 'Théâtre'},
            {'order': 27, 'title_arabic': 'والدان في حيرة', 'title': 'Des parents dans l\'embarras', 'category': 'Théâtre'},
            {'order': 28, 'title_arabic': 'البعوضة', 'title': 'Le moustique', 'category': 'Théâtre'},
            {'order': 29, 'title_arabic': 'تلميذ سيء', 'title': 'Mauvais élève', 'category': 'Théâtre'},
            {'order': 30, 'title_arabic': 'الذئب المعلق', 'title': 'Le loup pendu', 'category': 'Théâtre'},
            {'order': 31, 'title_arabic': 'هل كان طبيب الأسنان يضمر له شرا', 'title': 'Le dentiste avait-il une dent contre lui', 'category': 'Théâtre'},
        ]

        # Second Cycle - Second half of each section
        lessons_s2 = [
            # Grammaire (7 lessons)
            {'order': 1, 'title_arabic': 'الصفة النوعية', 'title': 'L\'adjectif qualificatif', 'category': 'Grammaire'},
            {'order': 2, 'title_arabic': 'المفعول به المباشر', 'title': 'Le complément d\'objet direct (COD)', 'category': 'Grammaire'},
            {'order': 3, 'title_arabic': 'المفعول به غير المباشر', 'title': 'Le complément d\'objet indirect (COI)', 'category': 'Grammaire'},
            {'order': 4, 'title_arabic': 'الضمائر الإشارية', 'title': 'Les pronoms démonstratifs', 'category': 'Grammaire'},
            {'order': 5, 'title_arabic': 'الضمائر الملكية', 'title': 'Les pronoms possessifs', 'category': 'Grammaire'},
            {'order': 6, 'title_arabic': 'التنسيق', 'title': 'La coordination', 'category': 'Grammaire'},
            {'order': 7, 'title_arabic': 'ظرف الطريقة', 'title': 'L\'adverbe de manière', 'category': 'Grammaire'},

            # Conjugaison (5 lessons)
            {'order': 8, 'title_arabic': 'الماضي المركب لبعض أفعال المجموعة الثالثة', 'title': 'Passé composé de quelques verbes du 3ème groupe', 'category': 'Conjugaison'},
            {'order': 9, 'title_arabic': 'الأفعال الضميرية في الحاضر الإخباري', 'title': 'Verbes pronominaux au présent de l\'indicatif', 'category': 'Conjugaison'},
            {'order': 10, 'title_arabic': 'المستقبل الإخباري', 'title': 'Le futur de l\'indicatif', 'category': 'Conjugaison'},
            {'order': 11, 'title_arabic': 'كان-يملك وأفعال المجموعة الأولى في الماضي الناقص', 'title': 'Etre-avoir et les verbes du 1er groupe à l\'imparfait', 'category': 'Conjugaison'},
            {'order': 12, 'title_arabic': 'الماضي الناقص للأفعال الضميرية المعتادة', 'title': 'L\'imparfait des verbes pronominaux usuels', 'category': 'Conjugaison'},

            # Orthographe (5 lessons)
            {'order': 13, 'title_arabic': 'الكلمات في [eur] و [eure]', 'title': 'Mots en [eur] & [eure]', 'category': 'Orthographe'},
            {'order': 14, 'title_arabic': 'الضمائر - المحددات', 'title': 'Pronoms – déterminants', 'category': 'Orthographe'},
            {'order': 15, 'title_arabic': '[et – est] – [é – er] – [on – ont] – [son – sont]', 'title': '[et – est] – [é – er] – [on – ont] – [son – sont]', 'category': 'Orthographe'},
            {'order': 16, 'title_arabic': 'C\'est – ces – ses', 'title': 'C\'est – ces – ses', 'category': 'Orthographe'},
            {'order': 17, 'title_arabic': 'الكلمات غير المتغيرة', 'title': 'Les mots invariables', 'category': 'Orthographe'},

            # Lexique (2 lessons)
            {'order': 18, 'title_arabic': 'اللواحق', 'title': 'Les suffixes', 'category': 'Lexique'},
            {'order': 19, 'title_arabic': 'البادئات', 'title': 'Les préfixes', 'category': 'Lexique'},

            # Pièces de théâtre éducatives (9 lessons)
            {'order': 20, 'title_arabic': 'درس الإملاء', 'title': 'Leçon d\'orthographe', 'category': 'Théâtre'},
            {'order': 21, 'title_arabic': 'القبعة المدفونة', 'title': 'Le chapeau enfoncé', 'category': 'Théâtre'},
            {'order': 22, 'title_arabic': 'لعبة الممثلين', 'title': 'Le jeu des acteurs', 'category': 'Théâtre'},
            {'order': 23, 'title_arabic': 'العنزة والذئب', 'title': 'La chèvre et le loup', 'category': 'Théâtre'},
            {'order': 24, 'title_arabic': 'القطة الصغيرة العنيدة', 'title': 'Le petit chat têtu', 'category': 'Théâtre'},
            {'order': 25, 'title_arabic': 'لص يغير معطفه', 'title': 'Un bandit qui retourne sa veste', 'category': 'Théâtre'},
            {'order': 26, 'title_arabic': 'التهاب الزائدة الدودية', 'title': 'L\'appendicite', 'category': 'Théâtre'},
            {'order': 27, 'title_arabic': 'عرافة لم تفقد عقلها!', 'title': 'Une voyante qui n\'a pas perdu la boule!', 'category': 'Théâtre'},
            {'order': 28, 'title_arabic': 'نقاش', 'title': 'Discussion', 'category': 'Théâtre'},
        ]

        try:
            subject = Subject.objects.get(code='FREN101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code FREN101 not found. Please ensure it exists.')
            )
            return

        try:
            grade = Grade.objects.get(code='CM2')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "CM2" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing CM2 French lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating CM2 French lessons for this subject...')
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
                    'title_french': lesson_data['title'],
                    'description': f"{lesson_data['category']} - {lesson_data['title']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1

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
                    'title_french': lesson_data['title'],
                    'description': f"{lesson_data['category']} - {lesson_data['title']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term French lessons for CM2.'
            )
        )