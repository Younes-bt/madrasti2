from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create French lessons for CE6 (Cours Élémentaire 6)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CE6 French lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - First half of each section
        lessons_s1 = [
            # Grammaire (11 lessons - first half)
            {'order': 1, 'title_arabic': 'الجملة', 'title': 'La phrase', 'category': 'Grammaire'},
            {'order': 2, 'title_arabic': 'بناء الجملة', 'title': 'Construction de la phrase', 'category': 'Grammaire'},
            {'order': 3, 'title_arabic': 'أشكال الجمل', 'title': 'Les formes de phrases', 'category': 'Grammaire'},
            {'order': 4, 'title_arabic': 'الاسم', 'title': 'Le nom', 'category': 'Grammaire'},
            {'order': 5, 'title_arabic': 'الأسماء العامة', 'title': 'Les noms communs', 'category': 'Grammaire'},
            {'order': 6, 'title_arabic': 'التمييز بين الفروق الدقيقة لمجموعات "مكمل الجملة"', 'title': 'Distinguer les nuances des groupes «complément de phrase»', 'category': 'Grammaire'},
            {'order': 7, 'title_arabic': 'التعرف على واستخدام مجموعة مكمل الجملة', 'title': 'Reconnaître et employer le groupe complément de phrase', 'category': 'Grammaire'},
            {'order': 8, 'title_arabic': 'الأنواع المختلفة من المكملات', 'title': 'Les différentes sortes de compléments', 'category': 'Grammaire'},
            {'order': 9, 'title_arabic': 'الصفات الملكية', 'title': 'Les adjectifs possessifs', 'category': 'Grammaire'},
            {'order': 10, 'title_arabic': 'الصفة النوعية', 'title': 'L\'adjectif qualificatif', 'category': 'Grammaire'},
            {'order': 11, 'title_arabic': 'أدوات التعريف', 'title': 'Les articles', 'category': 'Grammaire'},

            # Conjugaison (3 lessons - first half)
            {'order': 12, 'title_arabic': 'الفعل', 'title': 'Le verbe', 'category': 'Conjugaison'},
            {'order': 13, 'title_arabic': 'الحاضر الإخباري', 'title': 'Le présent de l\'indicatif', 'category': 'Conjugaison'},
            {'order': 14, 'title_arabic': 'المستقبل الإخباري', 'title': 'Le futur de l\'indicatif', 'category': 'Conjugaison'},

            # Orthographe (21 lessons - first half)
            {'order': 15, 'title_arabic': '[m] قبل [p] و [b]', 'title': '[m] devant [p] et [b]', 'category': 'Orthographe'},
            {'order': 16, 'title_arabic': 'الأفعال المنتهية بـ [dre] في الحاضر الإخباري', 'title': 'Les verbes en [dre] au présent de l\'indicatif', 'category': 'Orthographe'},
            {'order': 17, 'title_arabic': 'اسم المفعول في [é] أو المصدر في [er]', 'title': 'Le particip passé en [é] ou infinitif en [er]', 'category': 'Orthographe'},
            {'order': 18, 'title_arabic': 'تطابق اسم المفعول', 'title': 'L\'accord du participe passé', 'category': 'Orthographe'},
            {'order': 19, 'title_arabic': 'العدد المفرد والجمع', 'title': 'le nombre singulier et pluriel', 'category': 'Orthographe'},
            {'order': 20, 'title_arabic': 'صفات الألوان', 'title': 'Les adjectifs de couleur', 'category': 'Orthographe'},
            {'order': 21, 'title_arabic': 'الصفات العددية', 'title': 'Les adjectifs numéraux', 'category': 'Orthographe'},
            {'order': 22, 'title_arabic': 'الكلمات التي تعبر عن المدة', 'title': 'Les mots exprimant la durée', 'category': 'Orthographe'},
            {'order': 23, 'title_arabic': 'اسم الفاعل أو الصفة الفعلية', 'title': 'Le participe présent ou adjectif verbal', 'category': 'Orthographe'},
            {'order': 24, 'title_arabic': 'الاسم العلم-الاسم العام أو صفة الجنسية', 'title': 'Le nom propre-nom commun ou adjectif de nationalité', 'category': 'Orthographe'},
            {'order': 25, 'title_arabic': 'الأسماء في [oir]', 'title': 'Les noms en [oir]', 'category': 'Orthographe'},
            {'order': 26, 'title_arabic': 'جمع الأسماء في [ou]', 'title': 'Le pluriel des noms en [ou]', 'category': 'Orthographe'},
            {'order': 27, 'title_arabic': 'الأسماء في ail-eil-euil-ouil', 'title': 'Les noms en ail-eil-euil-ouil', 'category': 'Orthographe'},
            {'order': 28, 'title_arabic': 'الأسماء المؤنثة في [i]', 'title': 'Les noms féminins en [i]', 'category': 'Orthographe'},
            {'order': 29, 'title_arabic': 'الأسماء في [u]', 'title': 'Les noms en [u]', 'category': 'Orthographe'},
            {'order': 30, 'title_arabic': 'الأسماء في [ule]', 'title': 'Les noms en [ule]', 'category': 'Orthographe'},
            {'order': 31, 'title_arabic': 'Et – es – est', 'title': 'Et – es – est', 'category': 'Orthographe'},
            {'order': 32, 'title_arabic': 'On & ont', 'title': 'On & ont', 'category': 'Orthographe'},
            {'order': 33, 'title_arabic': 'Ce – se', 'title': 'Ce – se', 'category': 'Orthographe'},
            {'order': 34, 'title_arabic': 'Ces – ses', 'title': 'Ces – ses', 'category': 'Orthographe'},
            {'order': 35, 'title_arabic': 'C\'est – s\'est', 'title': 'C\'est – s\'est', 'category': 'Orthographe'},

            # Vocabulaire (4 lessons - first half)
            {'order': 36, 'title_arabic': 'القاموس', 'title': 'Le dictionnaire', 'category': 'Vocabulaire'},
            {'order': 37, 'title_arabic': 'التصنيف الأبجدي', 'title': 'Le classement alphabétique', 'category': 'Vocabulaire'},
            {'order': 38, 'title_arabic': 'البحث عن الكلمات', 'title': 'La recherche des mots', 'category': 'Vocabulaire'},
            {'order': 39, 'title_arabic': 'الاختصارات في القاموس', 'title': 'Les abréviations dans le dictionnaire', 'category': 'Vocabulaire'},
        ]

        # Second Cycle - Second half of each section
        lessons_s2 = [
            # Grammaire (10 lessons - second half)
            {'order': 1, 'title_arabic': 'الأحوال', 'title': 'Les adverbes', 'category': 'Grammaire'},
            {'order': 2, 'title_arabic': 'حروف العطف', 'title': 'Les conjonctions', 'category': 'Grammaire'},
            {'order': 3, 'title_arabic': 'الجنس في الفرنسية (مذكر - مؤنث)', 'title': 'Le genre en français (masculin – féminin)', 'category': 'Grammaire'},
            {'order': 4, 'title_arabic': 'حرف الجر', 'title': 'La préposition', 'category': 'Grammaire'},
            {'order': 5, 'title_arabic': 'خبر الفاعل', 'title': 'L\'attribut du sujet', 'category': 'Grammaire'},
            {'order': 6, 'title_arabic': 'مكمل الاسم', 'title': 'Le complément du nom', 'category': 'Grammaire'},
            {'order': 7, 'title_arabic': 'مجموعة الفاعل', 'title': 'Le groupe sujet', 'category': 'Grammaire'},
            {'order': 8, 'title_arabic': 'مجموعة الفعل', 'title': 'Le groupe du verbe', 'category': 'Grammaire'},
            {'order': 9, 'title_arabic': 'التمييز بين مجموعة الفاعل ومجموعة الفعل', 'title': 'Distinguer le groupe sujet et le groupe du verbe', 'category': 'Grammaire'},
            {'order': 10, 'title_arabic': 'الضمائر', 'title': 'Les pronoms', 'category': 'Grammaire'},

            # Conjugaison (2 lessons - second half)
            {'order': 11, 'title_arabic': 'الماضي الإخباري', 'title': 'Le passé de l\'indicatif', 'category': 'Conjugaison'},
            {'order': 12, 'title_arabic': 'الأمر الحاضر', 'title': 'L\'impératif présent', 'category': 'Conjugaison'},

            # Orthographe (21 lessons - second half)
            {'order': 13, 'title_arabic': 'Sa أو ça', 'title': 'Sa ou ça', 'category': 'Orthographe'},
            {'order': 14, 'title_arabic': 'A – as – à', 'title': 'A – as – à', 'category': 'Orthographe'},
            {'order': 15, 'title_arabic': 'La – là – l\'a – l\'as', 'title': 'La – là – l\'a – l\'as', 'category': 'Orthographe'},
            {'order': 16, 'title_arabic': 'Son & sont', 'title': 'Son & sont', 'category': 'Orthographe'},
            {'order': 17, 'title_arabic': 'Ou & où', 'title': 'Ou & où', 'category': 'Orthographe'},
            {'order': 18, 'title_arabic': 'Quel – quelle – quels – quelles – qu\'elle – qu\'elles', 'title': 'Quel – quelle – quels – quelles – qu\'elle – qu\'elles', 'category': 'Orthographe'},
            {'order': 19, 'title_arabic': 'Tout – tous – toute – toutes', 'title': 'Tout – tous – toute – toutes', 'category': 'Orthographe'},
            {'order': 20, 'title_arabic': 'Leur', 'title': 'Leur', 'category': 'Orthographe'},
            {'order': 21, 'title_arabic': 'Court ومرادفاتها', 'title': 'Court et ses homonymes', 'category': 'Orthographe'},
            {'order': 22, 'title_arabic': 'Peu – peut – peux', 'title': 'Peu – peut – peux', 'category': 'Orthographe'},
            {'order': 23, 'title_arabic': 'Y & ill', 'title': 'Y & ill', 'category': 'Orthographe'},
            {'order': 24, 'title_arabic': 'Mais ومرادفاتها', 'title': 'Mais et ses homonymes', 'category': 'Orthographe'},
            {'order': 25, 'title_arabic': 'Quand ومرادفاتها', 'title': 'Quand et ses homonymes', 'category': 'Orthographe'},
            {'order': 26, 'title_arabic': 'Sans ومرادفاتها', 'title': 'Sans et ses homonymes', 'category': 'Orthographe'},
            {'order': 27, 'title_arabic': 'Vers ومرادفاتها', 'title': 'Vers et ses homonymes', 'category': 'Orthographe'},
            {'order': 28, 'title_arabic': 'السذاجة', 'title': 'La cédille', 'category': 'Orthographe'},
            {'order': 29, 'title_arabic': 'الصوت [g]', 'title': 'Le son [g]', 'category': 'Orthographe'},
            {'order': 30, 'title_arabic': 'الأسماء المؤنثة في [é]', 'title': 'Les noms féminins en [é]', 'category': 'Orthographe'},
            {'order': 31, 'title_arabic': 'الأسماء المؤنثة في [té] و [tié]', 'title': 'Les noms féminins en [té] & [tié]', 'category': 'Orthographe'},
            {'order': 32, 'title_arabic': 'الأسماء في [eur]', 'title': 'Les noms en [eur]', 'category': 'Orthographe'},
            {'order': 33, 'title_arabic': 'الأسماء في [ure]', 'title': 'Les noms en [ure]', 'category': 'Orthographe'},

            # Vocabulaire (3 lessons - second half)
            {'order': 34, 'title_arabic': 'تكوين الكلمات', 'title': 'La formation des mots', 'category': 'Vocabulaire'},
            {'order': 35, 'title_arabic': 'المرادفات', 'title': 'Les synonymes', 'category': 'Vocabulaire'},
            {'order': 36, 'title_arabic': 'مستويات اللغة', 'title': 'Les registres de langue', 'category': 'Vocabulaire'},
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
            grade = Grade.objects.get(code='CE6')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "CE6" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing CE6 French lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating CE6 French lessons for this subject...')
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
                    'difficulty_level': 'easy',
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
                    'difficulty_level': 'easy',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term French lessons for CE6.'
            )
        )