# schools/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SchoolConfigViewSet,
    AcademicYearViewSet,
    EducationalLevelViewSet,
    GradeViewSet,
    SchoolClassViewSet,
    RoomViewSet,
    SubjectViewSet
)

router = DefaultRouter()
# The 'basename' is only needed if the queryset in the view is not standard.
# For SchoolConfig, we have a custom get_object(), so basename is good practice.
router.register(r'config', SchoolConfigViewSet, basename='school-config')
router.register(r'academic-years', AcademicYearViewSet)
router.register(r'levels', EducationalLevelViewSet)
router.register(r'grades', GradeViewSet)
router.register(r'classes', SchoolClassViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'subjects', SubjectViewSet)

urlpatterns = [
    path('', include(router.urls)),
]