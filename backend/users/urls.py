# backend/users/urls.py

from django.urls import path
from .views import RegisterView, ProfileView, LoginView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='user_register'),
    path('profile/', ProfileView.as_view(), name='user_profile'),
    path('login/', LoginView.as_view(), name='user_login'),  # Add this line
]