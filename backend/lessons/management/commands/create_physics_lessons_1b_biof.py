from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Physics/Chemistry lessons for 1B BIOF (First Baccalaureate International Option French)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 1B BIOF Physics/Chemistry lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 13 lessons (starting from order 100 to avoid conflicts)
        lessons_s1 = [
            {'order': 101, 'title': 'Rotation of a Rigid Body Around a Fixed Axis - BIOF', 'title_arabic': 'دوران جسم صلب حول محور ثابت - BIOF', 'title_french': 'Rotation d\'un solide indéformable autour d\'un axe fixe - BIOF'},
            {'order': 102, 'title': 'Work and Power of a Force - BIOF', 'title_arabic': 'شغل وقدرة قوة - BIOF', 'title_french': 'Travail et puissance d\'une force - BIOF'},
            {'order': 103, 'title': 'Work and Kinetic Energy - BIOF', 'title_arabic': 'الشغل والطاقة الحركية - BIOF', 'title_french': 'Travail et énergie cinétique - BIOF'},
            {'order': 104, 'title': 'Work and Gravitational Potential Energy - Mechanical Energy - BIOF', 'title_arabic': 'الشغل وطاقة الوضع الثقالية – الطاقة الميكانيكية - BIOF', 'title_french': 'Travail et énergie potentielle de pesanteur – Énergie mécanique - BIOF'},
            {'order': 105, 'title': 'Work and Internal Energy (Mathematical Sciences) - BIOF', 'title_arabic': 'الشغل والطاقة الداخلية (العلوم الرياضية) - BIOF', 'title_french': 'Travail et énergie interne (Sciences Maths) - BIOF'},
            {'order': 106, 'title': 'Thermal Energy and Heat Transfer (Mathematical Sciences) - BIOF', 'title_arabic': 'الطاقة الحرارية والانتقال الحراري (العلوم الرياضية) - BIOF', 'title_french': 'Énergie thermique et transfert thermique (Sciences Maths) - BIOF'},
            {'order': 107, 'title': 'Importance of Measurement in Chemistry - BIOF', 'title_arabic': 'أهمية القياس في الكيمياء - BIOF', 'title_french': 'Importance de la mesure en chimie - BIOF'},
            {'order': 108, 'title': 'Physical Quantities Related to Amount of Matter - BIOF', 'title_arabic': 'المقادير الفيزيائية المرتبطة بكمية المادة - BIOF', 'title_french': 'Grandeurs physiques liées à la quantité de matière - BIOF'},
            {'order': 109, 'title': 'Concentration and Electrolytic Solutions - BIOF', 'title_arabic': 'التركيز والمحاليل الإلكتروليتية - BIOF', 'title_french': 'La concentration et les solutions électrolytiques - BIOF'},
            {'order': 110, 'title': 'Monitoring Chemical Transformation - BIOF', 'title_arabic': 'تتبع تحول كيميائي - BIOF', 'title_french': 'Suivi d\'une transformation chimique - BIOF'},
            {'order': 111, 'title': 'Measuring Quantities of Matter in Solution by Conductimetry - BIOF', 'title_arabic': 'قياس كميات المادة في المحلول بالموصلية - BIOF', 'title_french': 'Mesure des quantités de matière en solution par conductimétrie - BIOF'},
            {'order': 112, 'title': 'Acid-Base Reactions - BIOF', 'title_arabic': 'التفاعلات الحمضية القاعدية - BIOF', 'title_french': 'Les réactions acido-basiques - BIOF'},
            {'order': 113, 'title': 'Oxidation-Reduction Reactions - BIOF', 'title_arabic': 'تفاعلات الأكسدة والاختزال - BIOF', 'title_french': 'Les réactions d\'oxydo-réduction - BIOF'},
        ]

        # Second Cycle - 14 lessons (starting from order 200 to avoid conflicts)
        lessons_s2 = [
            {'order': 201, 'title': 'Direct Dosages (or Titrations) - BIOF', 'title_arabic': 'المعايرات المباشرة - BIOF', 'title_french': 'Les dosages (ou titrages) directs - BIOF'},
            {'order': 202, 'title': 'Electrostatic Field (Mathematical Sciences) - BIOF', 'title_arabic': 'المجال الكهرساكن (العلوم الرياضية) - BIOF', 'title_french': 'Champ électrostatique (Sciences Maths) - BIOF'},
            {'order': 203, 'title': 'Potential Energy of Electric Charge in Uniform Electric Field (Mathematical Sciences) - BIOF', 'title_arabic': 'طاقة الوضع لشحنة كهربائية في مجال كهربائي منتظم (العلوم الرياضية) - BIOF', 'title_french': 'Énergie potentielle d\'une charge électrique dans un champ électrique uniforme (Sciences Maths) - BIOF'},
            {'order': 204, 'title': 'Energy Transfer in Electric Circuit - BIOF', 'title_arabic': 'انتقال الطاقة في دارة كهربائية - BIOF', 'title_french': 'Transfert d\'énergie dans un circuit électrique - BIOF'},
            {'order': 205, 'title': 'Global Behavior of Electric Circuit - BIOF', 'title_arabic': 'السلوك العام لدارة كهربائية - BIOF', 'title_french': 'Comportement global d\'un circuit électrique - BIOF'},
            {'order': 206, 'title': 'Magnetic Field - BIOF', 'title_arabic': 'المجال المغناطيسي - BIOF', 'title_french': 'Le champ magnétique - BIOF'},
            {'order': 207, 'title': 'Magnetic Field Created by Electric Current - BIOF', 'title_arabic': 'المجال المغناطيسي المنشأ بواسطة تيار كهربائي - BIOF', 'title_french': 'Le champ magnétique crée par un courant électrique - BIOF'},
            {'order': 208, 'title': 'Electromagnetic Forces - Laplace Law - BIOF', 'title_arabic': 'القوى الكهرومغناطيسية – قانون لابلاس - BIOF', 'title_french': 'Les forces électromagnétiques – La loi de Laplace - BIOF'},
            {'order': 209, 'title': 'Visibility of an Object - BIOF', 'title_arabic': 'رؤية جسم - BIOF', 'title_french': 'Visibilité d\'un objet - BIOF'},
            {'order': 210, 'title': 'Images Formed by a Plane Mirror - BIOF', 'title_arabic': 'الصور المكونة بواسطة مرآة مستوية - BIOF', 'title_french': 'Les images formées par un miroire plan - BIOF'},
            {'order': 211, 'title': 'Images Formed by a Thin Converging Lens - BIOF', 'title_arabic': 'الصور المكونة بواسطة عدسة رقيقة مجمعة - BIOF', 'title_french': 'Les images formées par une lentille mince convergente - BIOF'},
            {'order': 212, 'title': 'Expansion of Organic Chemistry - BIOF', 'title_arabic': 'توسع الكيمياء العضوية - BIOF', 'title_french': 'Expansion de la chimie organique - BIOF'},
            {'order': 213, 'title': 'Organic Molecules and Carbon Skeletons - BIOF', 'title_arabic': 'الجزيئات العضوية والهياكل الكربونية - BIOF', 'title_french': 'Les molécules organiques et les squelettes carbonés - BIOF'},
            {'order': 214, 'title': 'Modification of Carbon Skeleton - BIOF', 'title_arabic': 'تعديل الهيكل الكربوني - BIOF', 'title_french': 'Modification du squelette carboné - BIOF'},
        ]

        try:
            subject = Subject.objects.get(code='PHYS101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code PHYS101 not found. Please ensure it exists.')
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

        # Get all specified BIOF tracks
        track_codes = ['1BAC-SM-BIOF', '1BAC-SE-BIOF', '1BAC-STE-BIOF', '1BAC-STM-BIOF']
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
            self.stdout.write('Deleting existing 1B BIOF Physics/Chemistry lessons...')
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
            self.stdout.write(self.style.WARNING('Removed existing BIOF Physics/Chemistry lessons for 1B tracks.'))

        self.stdout.write('Creating 1B BIOF Physics/Chemistry lessons...')
        created_count_s1 = 0
        for lesson_data in lessons_s1:
            lesson, created = Lesson.objects.get_or_create(
                subject=subject,
                grade=grade,
                cycle='first',
                order=lesson_data['order'],
                title=lesson_data['title'],
                title_arabic=lesson_data['title_arabic'],
                title_french=lesson_data['title_french'],
                defaults={
                    'description': f"Physics/Chemistry BIOF - {lesson_data['title_french']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
            # Add all specified BIOF tracks to the lesson
            lesson.tracks.add(*tracks)

        created_count_s2 = 0
        for lesson_data in lessons_s2:
            lesson, created = Lesson.objects.get_or_create(
                subject=subject,
                grade=grade,
                cycle='second',
                order=lesson_data['order'],
                title=lesson_data['title'],
                title_arabic=lesson_data['title_arabic'],
                title_french=lesson_data['title_french'],
                defaults={
                    'description': f"Physics/Chemistry BIOF - {lesson_data['title_french']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
            # Add all specified BIOF tracks to the lesson
            lesson.tracks.add(*tracks)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first cycle and {created_count_s2} new second cycle Physics/Chemistry BIOF lessons for 1B.'
            )
        )