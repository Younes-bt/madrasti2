# backend/schools/test_views.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User
from schools.models import Subject, EducationalLevel

class SchoolAPITests(APITestCase):
    """
    Test suite for the School API endpoints.
    Verifies authentication and admin-level permissions.
    """

    def setUp(self):
        # Create an admin user who has all permissions
        self.admin_user = User.objects.create_superuser(
            'admin@madrasti.com', 'adminpassword'
        )
        # Create a regular user (teacher) who has limited permissions
        self.teacher_user = User.objects.create_user(
            'teacher@madrasti.com', 'teacherpassword', role=User.Role.TEACHER
        )
        
        # Pre-populate the database with some data to test GET requests
        self.level = EducationalLevel.objects.create(level='PRIMARY', name='Primaire', order=1)
        self.subject = Subject.objects.create(name="Mathematics", code="MATH101")
        
        # Define URLs
        self.subjects_url = reverse('subject-list') # DRF names list views as '<modelname>-list'
        self.levels_url = reverse('educationallevel-list')

    # --- Test Authenticated Access (as Teacher) ---
    
    def test_list_subjects_as_teacher(self):
        """Ensure a regular authenticated user can view the list of subjects."""
        self.client.force_authenticate(user=self.teacher_user)
        response = self.client.get(self.subjects_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Handle pagination if present
        if 'results' in response.data:
            subjects = response.data['results']
        else:
            subjects = response.data
        
        # Find our specific subject
        our_subject = next((subj for subj in subjects if subj['name'] == self.subject.name), None)
        self.assertIsNotNone(our_subject, "Our subject should be in the response")
        self.assertEqual(our_subject['name'], self.subject.name)

        
    def test_list_levels_as_teacher(self):
        """Ensure a regular authenticated user can view the list of levels."""
        self.client.force_authenticate(user=self.teacher_user)
        response = self.client.get(self.levels_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # --- Test Unauthenticated Access ---

    def test_list_subjects_unauthenticated(self):
        """Ensure unauthenticated users cannot access the subjects list."""
        response = self.client.get(self.subjects_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    # --- Test Admin Permissions ---
    
    def test_create_subject_as_admin(self):
        """Ensure an admin user CAN create a new subject."""
        self.client.force_authenticate(user=self.admin_user)
        payload = {'name': 'Physics', 'code': 'PHY101'}
        response = self.client.post(self.subjects_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Subject.objects.filter(code='PHY101').exists())

    def test_create_subject_as_teacher_is_forbidden(self):
        """Ensure a non-admin user CANNOT create a new subject."""
        self.client.force_authenticate(user=self.teacher_user)
        payload = {'name': 'Forbidden Subject', 'code': 'FORBID1'}
        response = self.client.post(self.subjects_url, payload, format='json')
        # This is a successful test because we expect a 'Forbidden' error
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_subject_as_admin(self):
        """Ensure an admin user CAN delete a subject."""
        self.client.force_authenticate(user=self.admin_user)
        # Detail views are named '<modelname>-detail' and need a pk
        url = reverse('subject-detail', kwargs={'pk': self.subject.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Subject.objects.filter(pk=self.subject.pk).exists())

    def test_delete_subject_as_teacher_is_forbidden(self):
        """Ensure a non-admin user CANNOT delete a subject."""
        self.client.force_authenticate(user=self.teacher_user)
        url = reverse('subject-detail', kwargs={'pk': self.subject.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)