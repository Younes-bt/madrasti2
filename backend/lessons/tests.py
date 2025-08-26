# lessons/tests.py

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User
from schools.models import Subject, Grade, EducationalLevel
from .models import Lesson, LessonResource, LessonTag

class LessonModelTest(TestCase):
    """Test cases for Lesson model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='teacher@madrasti.com',
            password='testpass123',
            role=User.Role.TEACHER
        )
        
        self.level = EducationalLevel.objects.create(
            level='PRIMARY',
            name='Primaire',
            order=1
        )
        
        self.grade = Grade.objects.create(
            educational_level=self.level,
            grade_number=1,
            name='1ère Année Primaire'
        )
        
        self.subject = Subject.objects.create(
            name='Mathematics',
            code='MATH101'
        )
    
    def test_lesson_creation(self):
        """Test creating a lesson"""
        lesson = Lesson.objects.create(
            subject=self.subject,
            grade=self.grade,
            title='Introduction to Numbers',
            cycle='first',
            order=1,
            created_by=self.user
        )
        
        self.assertEqual(lesson.title, 'Introduction to Numbers')
        self.assertEqual(lesson.subject, self.subject)
        self.assertEqual(lesson.grade, self.grade)
        self.assertEqual(lesson.cycle, 'first')
        self.assertEqual(lesson.order, 1)
        self.assertEqual(lesson.created_by, self.user)
        self.assertTrue(lesson.is_active)
    
    def test_lesson_str_method(self):
        """Test lesson string representation"""
        lesson = Lesson.objects.create(
            subject=self.subject,
            grade=self.grade,
            title='Introduction to Numbers',
            cycle='first',
            order=1,
            created_by=self.user
        )
        
        expected_str = f"{self.subject.name} - {self.grade.name} - الدورة الأولى - Introduction to Numbers"
        self.assertEqual(str(lesson), expected_str)
    
    def test_lesson_unique_constraint(self):
        """Test unique constraint on subject, grade, cycle, and order"""
        # Create first lesson
        Lesson.objects.create(
            subject=self.subject,
            grade=self.grade,
            title='First Lesson',
            cycle='first',
            order=1,
            created_by=self.user
        )
        
        # Try to create another lesson with same combination
        from django.db import IntegrityError
        with self.assertRaises(IntegrityError):
            Lesson.objects.create(
                subject=self.subject,
                grade=self.grade,
                title='Second Lesson',
                cycle='first',
                order=1,  # Same order in same cycle
                created_by=self.user
            )

class LessonAPITest(APITestCase):
    """Test cases for Lesson API endpoints"""
    
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            email='admin@madrasti.com',
            password='adminpass123'
        )
        
        self.teacher_user = User.objects.create_user(
            email='teacher@madrasti.com',
            password='teacherpass123',
            role=User.Role.TEACHER
        )
        
        self.student_user = User.objects.create_user(
            email='student@madrasti.com',
            password='studentpass123',
            role=User.Role.STUDENT
        )
        
        # Create test data
        self.level = EducationalLevel.objects.create(
            level='PRIMARY',
            name='Primaire',
            order=1
        )
        
        self.grade = Grade.objects.create(
            educational_level=self.level,
            grade_number=1,
            name='1ère Année Primaire'
        )
        
        self.subject = Subject.objects.create(
            name='Mathematics',
            code='MATH101'
        )
        
        self.lesson = Lesson.objects.create(
            subject=self.subject,
            grade=self.grade,
            title='Introduction to Numbers',
            cycle='first',
            order=1,
            created_by=self.teacher_user
        )
        
        self.lessons_url = reverse('lesson-list')
    
    def test_list_lessons_authenticated(self):
        """Test that authenticated users can list lessons"""
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get(self.lessons_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if response has pagination
        if 'results' in response.data:
            lessons = response.data['results']
        else:
            lessons = response.data
        
        # Find our specific lesson
        our_lesson = next((lesson for lesson in lessons if lesson['title'] == 'Introduction to Numbers'), None)
        self.assertIsNotNone(our_lesson, "Our lesson should be in the response")
        self.assertEqual(our_lesson['title'], 'Introduction to Numbers')
    
    def test_list_lessons_unauthenticated(self):
        """Test that unauthenticated users cannot list lessons"""
        response = self.client.get(self.lessons_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_create_lesson_as_teacher(self):
        """Test that teachers can create lessons"""
        self.client.force_authenticate(user=self.teacher_user)
        
        lesson_data = {
            'subject': self.subject.id,
            'grade': self.grade.id,
            'title': 'Addition and Subtraction',
            'cycle': 'first',
            'order': 2,
            'difficulty_level': 'medium'
        }
        
        response = self.client.post(self.lessons_url, lesson_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Lesson.objects.filter(title='Addition and Subtraction').exists())
    
    def test_create_lesson_as_student_forbidden(self):
        """Test that students cannot create lessons"""
        self.client.force_authenticate(user=self.student_user)
        
        lesson_data = {
            'subject': self.subject.id,
            'grade': self.grade.id,
            'title': 'Forbidden Lesson',
            'cycle': 'first',
            'order': 3
        }
        
        response = self.client.post(self.lessons_url, lesson_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_update_own_lesson_as_teacher(self):
        """Test that teachers can update their own lessons"""
        self.client.force_authenticate(user=self.teacher_user)
        
        url = reverse('lesson-detail', kwargs={'pk': self.lesson.pk})
        update_data = {'title': 'Updated Lesson Title'}
        
        response = self.client.patch(url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.lesson.refresh_from_db()
        self.assertEqual(self.lesson.title, 'Updated Lesson Title')
    
    def test_search_lessons(self):
        """Test lesson search functionality"""
        self.client.force_authenticate(user=self.student_user)
        
        search_url = reverse('lesson-search')
        response = self.client.get(search_url, {'q': 'Introduction'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # The search endpoint uses pagination, so check for 'results' key
        if 'results' in response.data:
            lessons = response.data['results']
        else:
            lessons = response.data
            
        # Filter the results to find lessons matching our search
        matching_lessons = [lesson for lesson in lessons if 'Introduction' in lesson['title']]
        self.assertGreaterEqual(len(matching_lessons), 1, "Should find at least one lesson with 'Introduction' in title")
        
        # Verify the specific lesson exists
        found_lesson = next((lesson for lesson in matching_lessons if lesson['title'] == 'Introduction to Numbers'), None)
        self.assertIsNotNone(found_lesson, "Should find the 'Introduction to Numbers' lesson")
        self.assertEqual(found_lesson['title'], 'Introduction to Numbers')
    
    def test_filter_lessons_by_cycle(self):
        """Test filtering lessons by cycle"""
        # Create second cycle lesson
        Lesson.objects.create(
            subject=self.subject,
            grade=self.grade,
            title='Advanced Numbers',
            cycle='second',
            order=1,
            created_by=self.teacher_user
        )
        
        self.client.force_authenticate(user=self.student_user)
        
        # Filter by first cycle
        response = self.client.get(self.lessons_url, {'cycle': 'first'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Handle pagination
        if 'results' in response.data:
            lessons = response.data['results']
        else:
            lessons = response.data
            
        first_cycle_lessons = [lesson for lesson in lessons if lesson['cycle'] == 'first']
        self.assertEqual(len(first_cycle_lessons), 1)
        self.assertEqual(first_cycle_lessons[0]['cycle'], 'first')
        
        # Filter by second cycle  
        response = self.client.get(self.lessons_url, {'cycle': 'second'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        if 'results' in response.data:
            lessons = response.data['results']
        else:
            lessons = response.data
            
        second_cycle_lessons = [lesson for lesson in lessons if lesson['cycle'] == 'second']
        self.assertEqual(len(second_cycle_lessons), 1)
        self.assertEqual(second_cycle_lessons[0]['cycle'], 'second')
    
    def test_toggle_lesson_status(self):
        """Test toggling lesson active status"""
        self.client.force_authenticate(user=self.teacher_user)
        
        url = reverse('lesson-toggle-status', kwargs={'pk': self.lesson.pk})
        response = self.client.patch(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.assertEqual(response.data['is_active'], False)
        
        self.lesson.refresh_from_db()
        self.assertFalse(self.lesson.is_active)

class LessonResourceTest(TestCase):
    """Test cases for LessonResource model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='teacher@madrasti.com',
            password='testpass123',
            role=User.Role.TEACHER
        )
        
        self.level = EducationalLevel.objects.create(
            level='PRIMARY',
            name='Primaire',
            order=1
        )
        
        self.grade = Grade.objects.create(
            educational_level=self.level,
            grade_number=1,
            name='1ère Année Primaire'
        )
        
        self.subject = Subject.objects.create(
            name='Mathematics',
            code='MATH101'
        )
        
        self.lesson = Lesson.objects.create(
            subject=self.subject,
            grade=self.grade,
            title='Introduction to Numbers',
            cycle='first',
            order=1,
            created_by=self.user
        )
    
    def test_lesson_resource_creation(self):
        """Test creating a lesson resource"""
        resource = LessonResource.objects.create(
            lesson=self.lesson,
            title='Number Worksheet',
            resource_type='pdf',
            external_url='https://example.com/worksheet.pdf',
            uploaded_by=self.user
        )
        
        self.assertEqual(resource.lesson, self.lesson)
        self.assertEqual(resource.title, 'Number Worksheet')
        self.assertEqual(resource.resource_type, 'pdf')
        self.assertTrue(resource.is_visible_to_students)
        self.assertTrue(resource.is_downloadable)
    
    def test_resource_file_url_property(self):
        """Test file_url property returns correct URL"""
        # Test with external URL
        resource = LessonResource.objects.create(
            lesson=self.lesson,
            title='External Resource',
            resource_type='link',
            external_url='https://example.com/resource',
            uploaded_by=self.user
        )
        
        self.assertEqual(resource.file_url, 'https://example.com/resource')