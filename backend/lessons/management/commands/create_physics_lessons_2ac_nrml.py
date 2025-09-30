from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Physics lessons for 2AC Normal track (Deuxième Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 2AC Physics lessons for Normal track before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 8 lessons (Chemistry focus)
        lessons_s1 = [
            {'order': 1, 'title': 'Air Around Us', 'title_arabic': 'الهواء من حولنا', 'title_french': 'L\'air qui nous entoure'},
            {'order': 2, 'title': 'Properties of Air', 'title_arabic': 'خصائص الهواء', 'title_french': 'Propriétés de l\'air'},
            {'order': 3, 'title': 'Molecules and Atoms', 'title_arabic': 'الجزيئات والذرات', 'title_french': 'Molécules et atomes'},
            {'order': 4, 'title': 'Combustion', 'title_arabic': 'الاحتراقات', 'title_french': 'Combustions'},
            {'order': 5, 'title': 'Chemical Reaction: Concept and Laws', 'title_arabic': 'التفاعل الكيميائي: مفهومه وقوانينه', 'title_french': 'Réaction chimique: concept et lois'},
            {'order': 6, 'title': 'Concept of Chemical Reaction', 'title_arabic': 'مفهوم التفاعل الكيميائي', 'title_french': 'Concept de réaction chimique'},
            {'order': 7, 'title': 'Natural and Synthetic Materials', 'title_arabic': 'المواد الطبيعية والمواد الصناعية', 'title_french': 'Matériaux naturels et synthétiques'},
            {'order': 8, 'title': 'Air Pollution', 'title_arabic': 'تلوث الهواء', 'title_french': 'Pollution de l\'air'},
        ]

        # Second Cycle - 11 lessons (Optics and Electricity focus)
        lessons_s2 = [
            {'order': 1, 'title': 'Light Around Us', 'title_arabic': 'الضوء من حولنا', 'title_french': 'La lumière autour de nous'},
            {'order': 2, 'title': 'Light Sources and Receivers', 'title_arabic': 'منابع الضوء ومستقبلاته', 'title_french': 'Sources et récepteurs de lumière'},
            {'order': 3, 'title': 'Light and Colors', 'title_arabic': 'الضوء والألوان', 'title_french': 'Lumière et couleurs'},
            {'order': 4, 'title': 'Light and Colors - Light Dispersion', 'title_arabic': 'الضوء والألوان – تبدد الضوء', 'title_french': 'Lumière et couleurs - Dispersion de la lumière'},
            {'order': 5, 'title': 'Light Propagation', 'title_arabic': 'انتشار الضوء', 'title_french': 'Propagation de la lumière'},
            {'order': 6, 'title': 'Applications of Rectilinear Light Propagation', 'title_arabic': 'تطبيقات الانتشار المستقيمي للضوء', 'title_french': 'Applications de la propagation rectiligne de la lumière'},
            {'order': 7, 'title': 'Thin Lenses', 'title_arabic': 'العدسات الرقيقة', 'title_french': 'Lentilles minces'},
            {'order': 8, 'title': 'Image Obtained by a Thin Converging Lens', 'title_arabic': 'الصورة المحصل عليها بواسطة عدسة رقيقة مجمعة', 'title_french': 'Image obtenue par une lentille mince convergente'},
            {'order': 9, 'title': 'Study of Some Optical Devices', 'title_arabic': 'دراسة بعض الأجهزة البصرية', 'title_french': 'Étude de quelques appareils optiques'},
            {'order': 10, 'title': 'Sinusoidal Alternating Electric Current', 'title_arabic': 'التيار الكهربائي المتناوب الجيبي', 'title_french': 'Courant électrique alternatif sinusoïdal'},
            {'order': 11, 'title': 'Household Electrical Installation', 'title_arabic': 'التركيب الكهربائي المنزلي', 'title_french': 'Installation électrique domestique'},
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
            grade = Grade.objects.get(code='2AC')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "2AC" not found. Please create it first.')
            )
            return

        try:
            track_nrml = Track.objects.get(code='2AC-NRML')
            self.stdout.write(f'Found NRML track: {track_nrml.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "2AC-NRML" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 2AC Physics lessons for Normal track...')
            existing_lessons = Lesson.objects.filter(
                subject=subject,
                grade=grade,
                tracks__code='2AC-NRML'
            )
            for lesson in existing_lessons:
                if lesson.tracks.count() == 1:  # Only delete if this is the only track
                    lesson.delete()
                else:
                    lesson.tracks.remove(track_nrml)  # Just remove from this track
            self.stdout.write(self.style.WARNING('Removed existing lessons for Normal track.'))

        self.stdout.write('Creating 2AC Physics lessons for Normal track...')
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
                    'description': f"Physics - {lesson_data['title_arabic']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
            # Add Normal track to the lesson
            lesson.tracks.add(track_nrml)

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
                    'description': f"Physics - {lesson_data['title_arabic']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
            # Add Normal track to the lesson
            lesson.tracks.add(track_nrml)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Physics lessons for 2AC Normal track.'
            )
        )