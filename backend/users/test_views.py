# backend/users/test_views.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User

class UserAPITests(APITestCase):
    """
    Test suite for the User API endpoints (Register, Login, Profile).
    """

    def setUp(self):
        """This method is run before each individual test."""
        # Create a pre-existing user for login and profile tests
        self.user_data = {
            'email': 'testuser@madrasti.com',
            'password': 'strongpassword123',
            'first_name': 'Test',
            'last_name': 'User',
            'role': User.Role.TEACHER
        }
        self.user = User.objects.create_user(**self.user_data)

        # Define the URLs for convenience
        self.register_url = reverse('user_register')
        self.login_url = reverse('user_login')
        self.profile_url = reverse('user_profile')

    def test_user_registration_success(self):
        """Ensure a new user can be registered successfully."""
        payload = {
            "email": "newstudent@madrasti.com",
            "password": "newpassword456",
            "first_name": "New",
            "last_name": "Student",
            "role": "STUDENT"
        }
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email=payload['email']).exists())

    def test_user_registration_duplicate_email(self):
        """Ensure registration fails if the email already exists."""
        payload = {
            "email": self.user_data['email'], # Use existing user's email
            "password": "anotherpassword",
        }
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login_success(self):
        """Ensure an existing user can log in and receive JWT tokens."""
        payload = {'email': self.user_data['email'], 'password': self.user_data['password']}
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_user_login_invalid_credentials(self):
        """Ensure login fails with an incorrect password."""
        payload = {'email': self.user_data['email'], 'password': 'wrongpassword'}
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['error'], 'Invalid Credentials')

    def test_get_profile_authenticated(self):
        """Ensure a logged-in user can access their own profile."""
        # Simulate that the user is logged in
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user_data['email'])

    def test_get_profile_unauthenticated(self):
        """Ensure an unauthenticated user cannot access the profile endpoint."""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_profile(self):
        """Ensure a logged-in user can update their own profile."""
        self.client.force_authenticate(user=self.user)
        update_payload = {'first_name': 'UpdatedFirstName'}
        response = self.client.patch(self.profile_url, update_payload, format='json')
        
        # Refresh the user object from the database to get the updated value
        self.user.refresh_from_db()
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.user.first_name, 'UpdatedFirstName')