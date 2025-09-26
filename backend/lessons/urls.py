# lessons/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import (
    LessonViewSet,
    LessonResourceViewSet,
    LessonTagViewSet,
    SubjectGradesView,
    GradeSubjectsView,
    TeacherInfoView
)

# Main router
router = DefaultRouter()
router.register(r'lessons', LessonViewSet)
router.register(r'tags', LessonTagViewSet)

# Nested router for lesson resources
lessons_router = routers.NestedDefaultRouter(router, r'lessons', lookup='lesson')
lessons_router.register(r'resources', LessonResourceViewSet, basename='lesson-resources')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(lessons_router.urls)),
    
    # Helper endpoints for curriculum navigation
    path('subjects/<int:subject_id>/grades/', SubjectGradesView.as_view(), name='subject-grades'),
    path('grades/<int:grade_id>/subjects/', GradeSubjectsView.as_view(), name='grade-subjects'),
    path('teacher-info/', TeacherInfoView.as_view(), name='teacher-info'),
]