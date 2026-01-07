from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LabToolCategoryViewSet,
    LabToolViewSet,
    LabUsageViewSet,
    LabAssignmentViewSet,
    LabAssignmentSubmissionViewSet,
    LabActivityViewSet
)

router = DefaultRouter()
router.register(r'categories', LabToolCategoryViewSet, basename='lab-category')
router.register(r'tools', LabToolViewSet, basename='lab-tool')
router.register(r'usage', LabUsageViewSet, basename='lab-usage')
router.register(r'assignments', LabAssignmentViewSet, basename='lab-assignment')
router.register(r'submissions', LabAssignmentSubmissionViewSet, basename='lab-submission')
router.register(r'activities', LabActivityViewSet, basename='lab-activity')

urlpatterns = [
    path('', include(router.urls)),
]
