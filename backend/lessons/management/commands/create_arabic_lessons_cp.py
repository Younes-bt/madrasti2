from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade


class Command(BaseCommand):
    help = 'Create Arabic lessons for CP (Cours Préparatoire)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CP Arabic lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # Arabic lessons data for CP
        lessons_s1 = [
            {'order': 1, 'title_arabic': 'حرف الدال ( د )', 'title': 'The letter Daal (d)'},
            {'order': 2, 'title_arabic': 'حرف الميم ( م )', 'title': 'The letter Meem (m)'},
            {'order': 3, 'title_arabic': 'حرف الراء ( ر )', 'title': 'The letter Raa (r)'},
            {'order': 4, 'title_arabic': 'حرف الباء ( ب )', 'title': 'The letter Baa (b)'},
            {'order': 5, 'title_arabic': 'حرف السين ( س )', 'title': 'The letter Seen (s)'},
            {'order': 6, 'title_arabic': 'حرف الفاء ( ف )', 'title': 'The letter Faa (f)'},
            {'order': 7, 'title_arabic': 'حرف اللام ( ل )', 'title': 'The letter Laam (l)'},
            {'order': 8, 'title_arabic': 'حرف الصاد ( ص )', 'title': 'The letter Saad (s)'},
            {'order': 9, 'title_arabic': 'حرف الدال ( د )', 'title': 'The letter Daal (d)'},
            {'order': 10, 'title_arabic': 'حرف الزاي ( ز )', 'title': 'The letter Zaay (z)'},
            {'order': 11, 'title_arabic': 'حرف الطاء ( ط )', 'title': 'The letter Taa (t)'},
            {'order': 12, 'title_arabic': 'حرف الضاد (ض)', 'title': 'The letter Daad (d)'},
            {'order': 13, 'title_arabic': 'حروف وصور', 'title': 'Letters and Pictures'},
        ]

        lessons_s2 = [
            {'order': 1, 'title_arabic': 'حرف النون ( ن )', 'title': 'The letter Noon (n)'},
            {'order': 2, 'title_arabic': 'حرف العين ( ع )', 'title': 'The letter Ayn (a)'},
            {'order': 3, 'title_arabic': 'حرف التاء ( ت )', 'title': 'The letter Taa (t)'},
            {'order': 4, 'title_arabic': 'حرف الظاء (ظ)', 'title': 'The letter Dhaa (dh)'},
            {'order': 5, 'title_arabic': 'حرف الحاء ( ح )', 'title': 'The letter Haa (h)'},
            {'order': 6, 'title_arabic': 'حرف الهاء ( ٥ )', 'title': 'The letter Haa (h)'},
            {'order': 7, 'title_arabic': 'حرف الهمزة ( ء )', 'title': "The letter Hamza (')"},
            {'order': 8, 'title_arabic': 'حرف الجيم ( ج )', 'title': 'The letter Jeem (j)'},
            {'order': 9, 'title_arabic': 'حرف الخاء ( خ )', 'title': 'The letter Khaa (kh)'},
            {'order': 10, 'title_arabic': 'حرف الغين (غ )', 'title': 'The letter Ghain (gh)'},
            {'order': 11, 'title_arabic': 'حرف الكاف ( ك )', 'title': 'The letter Kaaf (k)'},
            {'order': 12, 'title_arabic': 'حرف الثاء ( ث )', 'title': 'The letter Thaa (th)'},
            {'order': 13, 'title_arabic': 'حرف القاف ( ق )', 'title': 'The letter Qaaf (q)'},
            {'order': 14, 'title_arabic': 'حرف الشين ( ش )', 'title': 'The letter Sheen (sh)'},
            {'order': 15, 'title_arabic': 'حرف الواو ( و )', 'title': 'The letter Waaw (w)'},
            {'order': 16, 'title_arabic': 'حرف الياء ( ي )', 'title': 'The letter Yaa (y)'},
        ]

        try:
            subject = Subject.objects.get(code='ARAB101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code ARAB101 not found. Please ensure it exists.')
            )
            return

        try:
            grade = Grade.objects.get(code='CP')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "CP" not found. Please create it first.')
            )
            return
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error finding grade: {e}')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing CP lessons for this subject...')
            deleted_count_s1 = Lesson.objects.filter(
                subject=subject,
                grade=grade,
                cycle='first'
            ).delete()[0]
            deleted_count_s2 = Lesson.objects.filter(
                subject=subject,
                grade=grade,
                cycle='second'
            ).delete()[0]
            self.stdout.write(
                self.style.WARNING(f'Deleted {deleted_count_s1} first term and {deleted_count_s2} second term existing lessons.')
            )

        self.stdout.write('Creating CP lessons for this subject...')

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
                    'title_french': f"Leçon {lesson_data['order']}",
                    'difficulty_level': 'easy',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
            else:
                pass

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
                    'title_french': f"Leçon {lesson_data['order']}",
                    'difficulty_level': 'easy',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
            else:
                pass

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term lessons for CP.'
            )
        )
