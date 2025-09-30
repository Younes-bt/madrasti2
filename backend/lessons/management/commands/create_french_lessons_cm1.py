from django.core.management.base import BaseCommand
from lessons.models import Lesson
from schools.models import Subject, Grade
import math

class Command(BaseCommand):
    help = 'Create French lessons for CM1 (Cours Moyen 1)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing CM1 French lessons before creating new ones',
        )

    def handle(self, *args, **options):
        sections = {
            'Cours de Grammaire': [
                {'title_french': 'La phrase'},
                {'title_french': 'La ponctuation'},
                {'title_french': 'Le genre du nom'},
                {'title_french': 'Le pluriel des noms'},
                {'title_french': 'Les déterminants possessifs'},
                {'title_french': 'La phrase impérative'},
                {'title_french': 'La phrase négative'},
                {'title_french': 'La phrase interrogative'},
                {'title_french': 'La phrase exclamative'},
                {'title_french': 'Les pronoms personnels sujets'},
                {'title_french': 'L\'adjectif qualificatif'},
                {'title_french': 'Les pronoms possessifs'},
                {'title_french': 'La notion de verbe'},
                {'title_french': 'Le groupe nominal sujet'},
                {'title_french': 'Le groupe verbal'},
                {'title_french': 'Le groupe nominal complément'},
                {'title_french': 'Le complément d\'objet direct'},
                {'title_french': "L'expansion de la phrase"},
                {'title_french': 'La réduction de la phrase'},
            ],
            'Cours de Conjugaison': [
                {'title_french': 'Avoir au présent'},
                {'title_french': 'Être au présent'},
                {'title_french': 'Le premier groupe au présent'},
                {'title_french': 'Aller au présent'},
                {'title_french': 'Les verbes pronominaux au présent'},
                {'title_french': "Aller et d'autres verbes usuels à l'impératif"},
                {'title_french': 'Le 2ème groupe au présent'},
                {'title_french': 'Le 1er groupe au futur'},
                {'title_french': 'Le 2ème groupe au futur'},
                {'title_french': 'Aller au futur'},
                {'title_french': 'Le 2ème groupe au passé composé'},
                {'title_french': 'Le passé composé avec avoir'},
                {'title_french': 'Le passé composé avec être'},
                {'title_french': 'Le 3ème groupe au présent'},
                {'title_french': 'Le 3ème groupe au futur'},
                {'title_french': 'Pouvoir au présent'},
                {'title_french': 'Vouloir au présent'},
                {'title_french': 'Faire au présent'},
                {'title_french': 'Dire au présent'},
                {'title_french': 'Le futur proche'},
                {'title_french': 'Le passé récent'},
            ],
            'Cours d\'Orthographe': [
                {'title_french': 'a - à'},
                {'title_french': 'et - est'},
                {'title_french': 'son - sont'},
                {'title_french': 'Le pluriel'},
                {'title_french': 'ont - on'},
                {'title_french': 'Le féminin'},
                {'title_french': 'm devant m, b, p'},
                {'title_french': 's - c'},
                {'title_french': 'g - gu'},
                {'title_french': 'Le nom - le verbe'},
                {'title_french': "L'accord sujet-verbe"},
                {'title_french': 'Le pluriel en -s, -x'},
                {'title_french': 'Le pluriel des noms en -eau, -au, -eu'},
                {'title_french': 'Le pluriel des noms en -ou'},
                {'title_french': 'Le pluriel des noms en -al, -ail'},
                {'title_french': "L'accord de l'adjectif"},
            ],
            'Lecture': [
                {'title_french': 'La rentrée de P\'it-Loup'},
                {'title_french': 'L\'ordinateur'},
                {'title_french': 'La marmotte'},
                {'title_french': 'Les animaux'},
                {'title_french': 'Le petit Chaperon rouge'},
                {'title_french': 'Vive le sport'},
                {'title_french': 'Les misérables'},
            ],
            'Récitations': [
                {'title_french': 'Le petit Chaperon rouge'},
                {'title_french': 'Une goutte d\'eau'},
                {'title_french': 'Dessin étonnant d\'une fleur'},
                {'title_french': 'Le chat botté'},
                {'title_french': 'Les crayons de couleurs'},
                {'title_french': 'A petits pas'},
            ],
            'Pièces de théâtre informatives': [
                {'title_french': "L'eau... un trésor à préserver"},
                {'title_french': 'Au restaurant'},
                {'title_french': 'Forêt en danger'},
                {'title_french': 'Le défilé princier burlesque'},
                {'title_french': 'Le petit malade'},
                {'title_french': 'Des parents dans l\'embarras'},
                {'title_french': 'Le mouchoir'},
                {'title_french': 'Rêveries de Noël'},
                {'title_french': 'Le loup perdu'},
                {'title_french': "Le dentiste reçoit une dent contre lui"},
                {'title_french': "Leçon d'orthographe"},
                {'title_french': 'Le chapeau artisanal'},
                {'title_french': 'Le jeu des acteurs'},
                {'title_french': 'Le chœur et le loup'},
                {'title_french': 'Le petit mot bleu'},
                {'title_french': 'Un bandit qui réclame sa rançon'},
                {'title_french': "L'appendicite"},
                {'title_french': 'Drôle de surprise qui n\'a pas perdu la boule'},
                {'title_french': 'La cigale et la fourmi'},
            ]
        }

        try:
            subject = Subject.objects.get(code='FREN101')
            self.stdout.write(f'Found subject: {subject.name}')
        except Subject.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Subject with code FREN101 not found. Please ensure it exists.')
            )
            return

        try:
            grade = Grade.objects.get(code='CM1')
            self.stdout.write(f'Found grade: {grade.name}')
        except Grade.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Grade with code "CM1" not found. Please create it first.')
            )
            return

        if options['delete_existing']:
            self.stdout.write('Deleting existing CM1 lessons for this subject...')
            Lesson.objects.filter(subject=subject, grade=grade).delete()
            self.stdout.write(self.style.WARNING('Deleted all existing lessons for this subject and grade.'))

        self.stdout.write('Creating CM1 lessons for this subject...')
        total_created_s1 = 0
        total_created_s2 = 0

        lesson_order_counter = 1

        for section_title, lessons in sections.items():
            num_lessons = len(lessons)
            s1_count = math.ceil(num_lessons / 2.0)
            s1_lessons = lessons[:s1_count]
            s2_lessons = lessons[s1_count:]

            for lesson_data in s1_lessons:
                lesson, created = Lesson.objects.get_or_create(
                    subject=subject,
                    grade=grade,
                    cycle='first',
                    order=lesson_order_counter,
                    defaults={
                        'title': f"{section_title} - {lesson_data['title_french']}",
                        'title_arabic': lesson_data.get('title_arabic', ''),
                        'title_french': f"{section_title} - {lesson_data['title_french']}",
                        'difficulty_level': 'easy',
                        'is_active': True,
                    }
                )
                if created:
                    total_created_s1 += 1
                lesson_order_counter += 1

            for lesson_data in s2_lessons:
                lesson, created = Lesson.objects.get_or_create(
                    subject=subject,
                    grade=grade,
                    cycle='second',
                    order=lesson_order_counter,
                    defaults={
                        'title': f"{section_title} - {lesson_data['title_french']}",
                        'title_arabic': lesson_data.get('title_arabic', ''),
                        'title_french': f"{section_title} - {lesson_data['title_french']}",
                        'difficulty_level': 'easy',
                        'is_active': True,
                    }
                )
                if created:
                    total_created_s2 += 1
                lesson_order_counter += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {total_created_s1} new first term and {total_created_s2} new second term lessons for CM1 French.'
            )
        )
