from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade, Track


class Command(BaseCommand):
    help = 'Create History, Geography and Civic Education lessons for 1AC (Première Année Collège)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing 1AC HGEC lessons before creating new ones',
        )

    def handle(self, *args, **options):
        # First Cycle - 18 lessons (6 History + 7 Geography + 5 Civic Education)
        lessons_s1 = [
            # History Lessons (6 lessons)
            {'order': 1, 'title': 'Religions in Ancient Civilizations Between Plurality and Monotheism', 'title_arabic': 'الديانات في الحضارات القديمة بين التعدد والتوحيد', 'title_french': 'Les religions dans les civilisations anciennes entre pluralité et monothéisme', 'category': 'History'},
            {'order': 2, 'title': 'Ancient Morocco: Amazigh Kingdoms and Roman Resistance', 'title_arabic': 'المغرب القديم: الممالك الأمازيغية ومقاومة الرومان', 'title_french': 'Le Maroc antique: royaumes amazighs et résistance romaine', 'category': 'History'},
            {'order': 3, 'title': 'Ancient Morocco: Phoenicians and Carthaginians', 'title_arabic': 'المغرب القديم: الفينيقيون والقرطاجيون', 'title_french': 'Le Maroc antique: Phéniciens et Carthaginois', 'category': 'History'},
            {'order': 4, 'title': 'Greek Civilization', 'title_arabic': 'الحضارة الإغريقية', 'title_french': 'La civilisation grecque', 'category': 'History'},
            {'order': 5, 'title': 'Ancient Egyptian Civilization', 'title_arabic': 'حضارة مصر القديمة', 'title_french': 'La civilisation de l\'Égypte ancienne', 'category': 'History'},
            {'order': 6, 'title': 'Mesopotamian Civilization', 'title_arabic': 'حضارة بلاد الرافدين', 'title_french': 'La civilisation mésopotamienne', 'category': 'History'},

            # Geography Lessons (7 lessons)
            {'order': 7, 'title': 'Earth: Its Shape and Representation', 'title_arabic': 'الأرض (شكلها وتمثيلها)', 'title_french': 'La Terre: sa forme et sa représentation', 'category': 'Geography'},
            {'order': 8, 'title': 'Training on Drawing Coordinates and Determining Location', 'title_arabic': 'التدرب على رسم الإحداثيات وتحديد الموقع', 'title_french': 'Entraînement au dessin des coordonnées et à la détermination de l\'emplacement', 'category': 'Geography'},
            {'order': 9, 'title': 'Earth in the Universe', 'title_arabic': 'الأرض في الكون', 'title_french': 'La Terre dans l\'univers', 'category': 'Geography'},
            {'order': 10, 'title': 'Earth as a Planet in Constant Transformation', 'title_arabic': 'الأرض كوكب في تحول مستمر', 'title_french': 'La Terre comme planète en transformation constante', 'category': 'Geography'},
            {'order': 11, 'title': 'Land and Water', 'title_arabic': 'اليابس والمائي', 'title_french': 'Terres émergées et eaux', 'category': 'Geography'},
            {'order': 12, 'title': 'Atmosphere', 'title_arabic': 'الغلاف الجوي', 'title_french': 'L\'atmosphère', 'category': 'Geography'},
            {'order': 13, 'title': 'Peaceful Use of the Sea', 'title_arabic': 'الاستخدام السلمي للبحر', 'title_french': 'Utilisation pacifique de la mer', 'category': 'Geography'},

            # Civic Education Lessons (5 lessons)
            {'order': 14, 'title': 'Dignity', 'title_arabic': 'الكرامة', 'title_french': 'La dignité', 'category': 'Civic Education'},
            {'order': 15, 'title': 'Freedom', 'title_arabic': 'الحرية', 'title_french': 'La liberté', 'category': 'Civic Education'},
            {'order': 16, 'title': 'Equality', 'title_arabic': 'المساواة', 'title_french': 'L\'égalité', 'category': 'Civic Education'},
            {'order': 17, 'title': 'Justice', 'title_arabic': 'العدل', 'title_french': 'La justice', 'category': 'Civic Education'},
            {'order': 18, 'title': 'Solidarity', 'title_arabic': 'التضامن', 'title_french': 'La solidarité', 'category': 'Civic Education'},
        ]

        # Second Cycle - 18 lessons (7 History + 6 Geography + 5 Civic Education)
        lessons_s2 = [
            # History Lessons (7 lessons)
            {'order': 1, 'title': 'The Rightly-Guided Caliphs', 'title_arabic': 'الخلفاء الراشدون', 'title_french': 'Les califes bien-guidés', 'category': 'History'},
            {'order': 2, 'title': 'The Rise of the Islamic State', 'title_arabic': 'نشأة الدولة الإسلامية', 'title_french': 'La naissance de l\'État islamique', 'category': 'History'},
            {'order': 3, 'title': 'The Great Islamic Caliphate: Umayyads and Abbasids', 'title_arabic': 'الخلافة الإسلامية الكبرى: الأمويون والعباسيون', 'title_french': 'Le grand califat islamique: Omeyyades et Abbassides', 'category': 'History'},
            {'order': 4, 'title': 'Islamic Civilization: Examples of Intellectual Production', 'title_arabic': 'الحضارة الإسلامية: نماذج من الإنتاج الفكري', 'title_french': 'La civilisation islamique: exemples de production intellectuelle', 'category': 'History'},
            {'order': 5, 'title': 'Feudal System in Medieval Europe', 'title_arabic': 'النظام الفيودالي في أوربا في العصر الوسيط', 'title_french': 'Le système féodal en Europe au Moyen Âge', 'category': 'History'},
            {'order': 6, 'title': 'Dialogue of Civilizations File', 'title_arabic': 'ملف حوار الحضارات', 'title_french': 'Dossier dialogue des civilisations', 'category': 'History'},
            {'order': 7, 'title': 'Crusades: Confrontation and Clash of Civilizations', 'title_arabic': 'الحروب الصليبية: المواجهة واحتكاك الحضارات', 'title_french': 'Les croisades: confrontation et choc des civilisations', 'category': 'History'},

            # Geography Lessons (6 lessons)
            {'order': 8, 'title': 'Population Dynamics and Distribution', 'title_arabic': 'دينامية السكان وتوزيعهم', 'title_french': 'Dynamique et répartition de la population', 'category': 'Geography'},
            {'order': 9, 'title': 'Training on Representing Population Structure and Density', 'title_arabic': 'التدرب على تمثيل البنية السكانية والكثافة السكانية', 'title_french': 'Entraînement à la représentation de la structure et de la densité de population', 'category': 'Geography'},
            {'order': 10, 'title': 'Population Activities: Agriculture', 'title_arabic': 'أنشطة السكان (الفلاحة)', 'title_french': 'Activités de la population: agriculture', 'category': 'Geography'},
            {'order': 11, 'title': 'Population Activities: Industry', 'title_arabic': 'أنشطة السكان (الصناعة)', 'title_french': 'Activités de la population: industrie', 'category': 'Geography'},
            {'order': 12, 'title': 'Population Activities: Trade and Services', 'title_arabic': 'أنشطة السكان (التجارة والخدمات)', 'title_french': 'Activités de la population: commerce et services', 'category': 'Geography'},
            {'order': 13, 'title': 'Natural and Human Characteristics of Learner\'s Environment and Their Exploitation', 'title_arabic': 'ملف الخصائص الطبيعية والبشرية لمحيط المتعلم وكيفية استغلالها', 'title_french': 'Dossier sur les caractéristiques naturelles et humaines de l\'environnement de l\'apprenant et leur exploitation', 'category': 'Geography'},

            # Civic Education Lessons (5 lessons)
            {'order': 14, 'title': 'Tolerance', 'title_arabic': 'التسامح', 'title_french': 'La tolérance', 'category': 'Civic Education'},
            {'order': 15, 'title': 'Democracy', 'title_arabic': 'الديمقراطية', 'title_french': 'La démocratie', 'category': 'Civic Education'},
            {'order': 16, 'title': 'Peace', 'title_arabic': 'السلم', 'title_french': 'La paix', 'category': 'Civic Education'},
            {'order': 17, 'title': 'Legal Rule', 'title_arabic': 'القاعدة القانونية', 'title_french': 'La règle juridique', 'category': 'Civic Education'},
            {'order': 18, 'title': 'Visiting an Institution Concerned with Human Rights', 'title_arabic': 'زيارة مؤسسة مهتمة بحقوق الإنسان', 'title_french': 'Visite d\'une institution concernée par les droits de l\'homme', 'category': 'Civic Education'},
        ]

        try:
            subject = Subject.objects.get(code='HGEC101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code HGEC101 not found. Please ensure it exists.')
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
            self.stdout.write('Deleting existing 1AC HGEC lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating 1AC HGEC lessons for this subject...')
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
                    'description': f"HGEC - {lesson_data['category']} - {lesson_data['title_arabic']}",
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
                    'description': f"HGEC - {lesson_data['category']} - {lesson_data['title_arabic']}",
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
                f'Successfully created {created_count_s1} new first term and {created_count_s2} new second term HGEC lessons for 1AC.'
            )
        )