from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create Physics lessons for 2AC French track (Deuxième Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 2AC Physics lessons for French track before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 8 lessons (Chemistry focus)
        lessons_s1 = [
            {'order': 1, 'title': 'Air Around Us', 'title_arabic': 'الهواء من حولنا', 'title_french': 'L\'air qui nous entoure'},
            {'order': 2, 'title': 'Some Properties of Air and Its Components', 'title_arabic': 'بعض خصائص الهواء ومكوناته', 'title_french': 'Quelques propriétés de l\'air et ses constituants'},
            {'order': 3, 'title': 'Molecules and Atoms', 'title_arabic': 'الجزيئات والذرات', 'title_french': 'Les molécules et les atomes'},
            {'order': 4, 'title': 'Combustion', 'title_arabic': 'الاحتراقات', 'title_french': 'Les combustions'},
            {'order': 5, 'title': 'Chemical Reactions', 'title_arabic': 'التفاعلات الكيميائية', 'title_french': 'Les réactions chimiques'},
            {'order': 6, 'title': 'Laws of Chemical Reaction', 'title_arabic': 'قوانين التفاعل الكيميائي', 'title_french': 'Les lois de la réaction chimique'},
            {'order': 7, 'title': 'Natural and Synthetic Substances', 'title_arabic': 'المواد الطبيعية والاصطناعية', 'title_french': 'Les substances naturelles et synthétiques'},
            {'order': 8, 'title': 'Air Pollution', 'title_arabic': 'تلوث الهواء', 'title_french': 'La pollution de l\'air'},
        ]

        # Second Cycle - 8 lessons (Optics and Electricity focus)
        lessons_s2 = [
            {'order': 1, 'title': 'Light Sources and Receivers', 'title_arabic': 'منابع الضوء ومستقبلاته', 'title_french': 'Les sources et les récepteurs de la lumière'},
            {'order': 2, 'title': 'Light and Colors - Light Dispersion', 'title_arabic': 'الضوء والألوان – تبدد الضوء', 'title_french': 'Lumière et couleurs – Dispersion de la lumière'},
            {'order': 3, 'title': 'Light Propagation', 'title_arabic': 'انتشار الضوء', 'title_french': 'La propagation de la lumière'},
            {'order': 4, 'title': 'Applications of Rectilinear Light Propagation', 'title_arabic': 'تطبيقات الانتشار المستقيمي للضوء', 'title_french': 'Applications de la propagation rectiligne de la lumière'},
            {'order': 5, 'title': 'Thin Lenses - Image Formed by a Converging Thin Lens', 'title_arabic': 'العدسات الرقيقة – الصورة المتكونة بواسطة عدسة رقيقة مجمعة', 'title_french': 'Les lentilles minces – L\'image formée par une lentille mince convergente'},
            {'order': 6, 'title': 'Study of Some Optical Instruments', 'title_arabic': 'دراسة بعض الأجهزة البصرية', 'title_french': 'Étude de quelques instruments optiques'},
            {'order': 7, 'title': 'Sinusoidal Alternating Electric Current', 'title_arabic': 'التيار الكهربائي المتناوب الجيبي', 'title_french': 'Le courant électrique alternatif sinusoïdal'},
            {'order': 8, 'title': 'Domestic Electrical Installation', 'title_arabic': 'التركيب الكهربائي المنزلي', 'title_french': 'L\'installation électrique domestique'},
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
            track_frn = Track.objects.get(code='2AC-FRN')
            self.stdout.write(f'Found FRN track: {track_frn.name}')
        except Track.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Track with code "2AC-FRN" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing 2AC Physics lessons for French track...')
            existing_lessons = Lesson.objects.filter(
                subject=subject,
                grade=grade,
                tracks__code='2AC-FRN'
            )
            for lesson in existing_lessons:
                if lesson.tracks.count() == 1:  # Only delete if this is the only track
                    lesson.delete()
                else:
                    lesson.tracks.remove(track_frn)  # Just remove from this track
            self.stdout.write(self.style.WARNING('Removed existing lessons for French track.'))

        self.stdout.write('Creating/updating 2AC Physics lessons for French track...')
        created_count_s1 = 0
        updated_count_s1 = 0
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
                    'description': f"Physics - {lesson_data['title_french']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s1 += 1
            else:
                # Update existing lesson with French titles if needed
                lesson.title_french = lesson_data['title_french']
                lesson.save()
                updated_count_s1 += 1
            # Add French track to the lesson
            lesson.tracks.add(track_frn)

        created_count_s2 = 0
        updated_count_s2 = 0
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
                    'description': f"Physics - {lesson_data['title_french']}",
                    'difficulty_level': 'medium',
                    'is_active': True,
                }
            )
            if created:
                created_count_s2 += 1
            else:
                # Update existing lesson with French titles if needed
                lesson.title_french = lesson_data['title_french']
                lesson.save()
                updated_count_s2 += 1
            # Add French track to the lesson
            lesson.tracks.add(track_frn)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term Physics lessons. '
                f'Updated {updated_count_s1} first term and {updated_count_s2} second term existing lessons for 2AC French track.'
            )
        )