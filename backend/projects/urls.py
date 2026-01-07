# projects/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import ProjectViewSet, ProjectTaskViewSet, ProjectCommentViewSet

# Main router for projects
router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')

# Nested router for tasks within projects
projects_router = routers.NestedDefaultRouter(router, r'projects', lookup='project')
projects_router.register(r'tasks', ProjectTaskViewSet, basename='project-tasks')

# Nested router for comments on projects
projects_comments_router = routers.NestedDefaultRouter(router, r'projects', lookup='project')
projects_comments_router.register(r'comments', ProjectCommentViewSet, basename='project-comments')

# Nested router for comments on tasks
tasks_comments_router = routers.NestedDefaultRouter(projects_router, r'tasks', lookup='task')
tasks_comments_router.register(r'comments', ProjectCommentViewSet, basename='task-comments')

# Standalone tasks endpoint (for my_tasks action)
router.register(r'tasks', ProjectTaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(projects_router.urls)),
    path('', include(projects_comments_router.urls)),
    path('', include(tasks_comments_router.urls)),
]
