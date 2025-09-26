from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create philosophy lessons for Tronc Commun (Common Core)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing Tronc Commun philosophy lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # Philosophy lessons data for Tronc Commun
        lessons_s1 = [
            {
                'order': 1,
                'title': 'General introduction to the module of philosophy',
                'title_arabic': 'تقديم عام لمجزوءة الفلسفة',
                'title_french': 'Introduction générale au module de la philosophie',
            },
            {
                'order': 2,
                'title': 'The birth of philosophy',
                'title_arabic': 'نشأة الفلسفة',
                'title_french': 'La naissance de la philosophie',
            },
            {
                'order': 3,
                'title': 'Stages in the development of philosophy',
                'title_arabic': 'محطات في تطور الفلسفة',
                'title_french': 'Les étapes du développement de la philosophie',
            },
            {
                'order': 4,
                'title': 'Islamic philosophy',
                'title_arabic': 'الفلسفة الإسلامية',
                'title_french': 'La philosophie islamique',
            },
            {
                'order': 5,
                'title': 'Contemporary Western philosophy',
                'title_arabic': 'الفلسفة الغربية المعاصرة',
                'title_french': 'La philosophie occidentale contemporaine',
            },
            {
                'order': 6,
                'title': 'Why philosophize?',
                'title_arabic': 'لماذا التـفـلـسـف ؟',
                'title_french': 'Pourquoi philosopher ?',
            },
            {
                'order': 7,
                'title': 'The logic of philosophy',
                'title_arabic': 'منطق الفلسفة',
                'title_french': 'La logique de la philosophie',
            },
            {
                'order': 8,
                'title': 'Philosophy and values',
                'title_arabic': 'الفلسفة والقيم',
                'title_french': 'La philosophie et les valeurs',
            },
        ]

        lessons_s2 = [
            {
                'order': 9,
                'title': 'General introduction to the module of nature and culture',
                'title_arabic': 'تقديم عام لمجزوءة الطبيعة والثقافة',
                'title_french': 'Introduction générale au module de la nature et la culture',
            },
            {
                'order': 10,
                'title': 'Man as a cultural being',
                'title_arabic': 'الإنسان كائن ثقافي',
                'title_french': 'L\'homme en tant qu\'être culturel',
            },
            {
                'order': 11,
                'title': 'Man as a linguistic being',
                'title_arabic': 'الإنسان كائن لغوي',
                'title_french': 'L\'homme en tant qu\'être de langage',
            },
            {
                'order': 12,
                'title': 'The institution as a manifestation of culture',
                'title_arabic': 'المؤسسة كمظهر من مظاهر الثقافة',
                'title_french': 'L\'institution comme manifestation de la culture',
            },
            {
                'order': 13,
                'title': 'The distinction between nature and culture',
                'title_arabic': 'التمييز بين الطبيعة والثقافة',
                'title_french': 'La distinction entre nature et culture',
            },
            {
                'order': 14,
                'title': 'Nature and human activity',
                'title_arabic': 'الطبيعة والنشاط الإنساني',
                'title_french': 'La nature et l\'activité humaine',
            },
            {
                'order': 15,
                'title': 'From dominating nature to harmonizing with it',
                'title_arabic': 'من السيطرة على الطبيعة إلى الانسجام معها',
                'title_french': 'De la domination de la nature à l\'harmonie avec elle',
            },
        ]

        try:
            subject = Subject.objects.get(code='PHIL101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code PHIL101 not found. Please ensure it exists.')
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
