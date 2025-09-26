from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create history lessons for Tronc Commun (Common Core)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing Tronc Commun history lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # History lessons data for Tronc Commun
        lessons_s1 = [
            {
                'order': 1,
                'title': 'The Mediterranean World in the 15th and 18th Centuries',
                'title_arabic': 'العالم المتوسطي في القرنين 15م و18م',
                'title_french': 'Le monde méditerranéen aux XVe et XVIIIe siècles',
            },
            {
                'order': 2,
                'title': 'Intellectual, Scientific, and Artistic Transformations: Humanism',
                'title_arabic': 'التحولات الفكرية والعلمية والفنية: الحركة الإنسية',
                'title_french': 'Les transformations intellectuelles, scientifiques et artistiques : L\'humanisme',
            },
            {
                'order': 3,
                'title': 'Political and Social Transformations in Europe during the 15th and 16th Centuries',
                'title_arabic': 'التحولات السياسية والاجتماعية في أوربا خلال القرنين 15 و16م',
                'title_french': 'Les transformations politiques et sociales en Europe aux XVe et XVIe siècles',
            },
            {
                'order': 4,
                'title': 'Geographical Discoveries and the Phenomenon of Mercantilism',
                'title_arabic': 'الاكتشافات الجغرافية وظاهرة الميركنتيلية',
                'title_french': 'Les découvertes géographiques et le phénomène du mercantilisme',
            },
            {
                'order': 5,
                'title': 'The Islamic Expansion (The spread of Ottoman influence and the beginning of European intervention)',
                'title_arabic': 'المد الإسلامي (امتداد النفوذ العثماني وبداية التدخل الأوربي)',
                'title_french': "L'expansion islamique (l'extension de l'influence ottomane et le début de l'intervention européenne)",
            },
            {
                'order': 6,
                'title': 'Political and Social Developments in the Islamic World',
                'title_arabic': 'التطورات السياسية والاجتماعية في العالم الإسلامي',
                'title_french': 'Les évolutions politiques et sociales dans le monde islamique',
            },
            {
                'order': 7,
                'title': 'Economic Developments in the Islamic World',
                'title_arabic': 'التطورات الاقتصادية في العالم الإسلامي',
                'title_french': 'Les évolutions économiques dans le monde islamique',
            },
            {
                'order': 8,
                'title': 'The Religious Reformation',
                'title_arabic': 'الإصلاح الديني',
                'title_french': 'La réforme religieuse',
            },
            {
                'order': 9,
                'title': 'The Islamic Expansion and the Beginning of European Intervention',
                'title_arabic': 'المد الإسلامي وبداية التدخل الأوروبي',
                'title_french': 'L\'expansion islamique et le début de l\'intervention européenne',
            },
            {
                'order': 10,
                'title': 'Intellectual and Artistic Life in the Islamic World',
                'title_arabic': 'الحياة الفكرية والفنية في العالم الإسلامي',
                'title_french': 'La vie intellectuelle et artistique dans le monde islamique',
            },
        ]

        lessons_s2 = [
            {
                'order': 11,
                'title': 'The Age of Enlightenment: English and French Thought',
                'title_arabic': 'عصر الأنوار: الفكر الإنجليزي والفكر الفرنسي',
                'title_french': 'Le Siècle des Lumières : La pensée anglaise et la pensée française',
            },
            {
                'order': 12,
                'title': 'Social and Political Revolutions: The French Revolution',
                'title_arabic': 'الثورات الاجتماعية والسياسية: الثورة الفرنسية',
                'title_french': 'Les révolutions sociales et politiques : La Révolution française',
            },
            {
                'order': 13,
                'title': 'The Beginning of the Industrial Revolution: Technical Development and Repercussions on the Social Structure',
                'title_arabic': 'انطلاقة الثورة الصناعية: التطور التقني والانعكاسات على البنية الاجتماعية',
                'title_french': 'Le début de la Révolution industrielle : Évolution technique et répercussions sur la structure sociale',
            },
            {
                'order': 14,
                'title': 'The General Situation in the Islamic World during the 17th and 18th Centuries',
                'title_arabic': 'الأوضاع العامة في العالم الإسلامي خلال القرنين 17 و18م',
                'title_french': 'La situation générale dans le monde islamique aux XVIIe et XVIIIe siècles',
            },
            {
                'order': 15,
                'title': 'The Rise of European Pressures on the Islamic World',
                'title_arabic': 'تصاعد الضغوط الأوربية على العالم الإسلامي',
                'title_french': 'La montée des pressions européennes sur le monde islamique',
            },
            {
                'order': 16,
                'title': 'The Beginning of Reform Attempts and their Limits',
                'title_arabic': 'بداية محاولات الإصلاح وحدودها',
                'title_french': 'Le début des tentatives de réforme et leurs limites',
            },
            {
                'order': 17,
                'title': 'Social and Political Revolutions: The English Revolution',
                'title_arabic': 'الثورات الاجتماعية والسياسية: الثورة الإنجليزية',
                'title_french': 'Les révolutions sociales et politiques : La Révolution anglaise',
            },
        ]

        try:
            subject = Subject.objects.get(code='HIST101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code HIST101 not found. Please ensure it exists.')
            )
            return

        try:
            common_core_grade = Grade.objects.get(name='Common Core')
            self.stdout.write(f'Found grade: {common_core_grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade "Common Core" not found. Please create it first.')
            )
            return
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error finding grade: {e}')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing Tronc Commun lessons for this subject...')
            deleted_count_s1 = Lesson.objects.filter(
                subject=subject,
                grade=common_core_grade,
                cycle='first'
            ).delete()[0]
            deleted_count_s2 = Lesson.objects.filter(
                subject=subject,
                grade=common_core_grade,
                cycle='second'
            ).delete()[0]
            self.stdout.write(
                self.style.WARNING(f'Deleted {deleted_count_s1} first term and {deleted_count_s2} second term existing lessons.')
            )

        self.stdout.write('Creating Tronc Commun lessons for this subject...')

        created_count_s1 = 0
        for lesson_data in lessons_s1:
            lesson, created = Lesson.objects.get_or_create(
                subject=subject,
                grade=common_core_grade,
                cycle='first',
                order=lesson_data['order'],
                defaults={
                    'title': lesson_data['title'],
                    'title_arabic': lesson_data['title_arabic'],
                    'title_french': lesson_data['title_french'],
                    'difficulty_level': 'easy',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
                self.stdout.write(f'Created: Term 1, Lesson {lesson.order} - {lesson.title}')
            else:
                self.stdout.write(f'Already exists: Term 1, Lesson {lesson.order} - {lesson.title}')

        created_count_s2 = 0
        for lesson_data in lessons_s2:
            lesson, created = Lesson.objects.get_or_create(
                subject=subject,
                grade=common_core_grade,
                cycle='second',
                order=lesson_data['order'],
                defaults={
                    'title': lesson_data['title'],
                    'title_arabic': lesson_data['title_arabic'],
                    'title_french': lesson_data['title_french'],
                    'difficulty_level': 'easy',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
                self.stdout.write(f'Created: Term 2, Lesson {lesson.order} - {lesson.title}')
            else:
                self.stdout.write(f'Already exists: Term 2, Lesson {lesson.order} - {lesson.title}')

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term lessons for Tronc Commun.'
            )
        )
