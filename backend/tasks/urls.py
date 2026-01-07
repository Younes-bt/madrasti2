# tasks/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DailyTaskViewSet, UserTaskProgressViewSet

router = DefaultRouter()
router.register(r'daily-tasks', DailyTaskViewSet, basename='daily-task')
router.register(r'task-progress', UserTaskProgressViewSet, basename='task-progress')

urlpatterns = [
    path('', include(router.urls)),
]
