# projects/permissions.py

from rest_framework import permissions


class IsAdminOrProjectMember(permissions.BasePermission):
    """
    Admin can do anything.
    Team members can view and update tasks assigned to them.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.user.role == 'ADMIN':
            return True

        # Non-admins can view
        if request.method in permissions.SAFE_METHODS:
            return True

        # Only admins can create projects
        if view.action in ['create', 'destroy']:
            return False

        return True

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'ADMIN':
            return True

        # Check if it's a Project or ProjectTask
        if hasattr(obj, 'team_members'):
            # It's a Project
            if request.method in permissions.SAFE_METHODS:
                return request.user in obj.team_members.all()
            return False
        elif hasattr(obj, 'project'):
            # It's a ProjectTask
            if request.method in permissions.SAFE_METHODS:
                return request.user in obj.project.team_members.all()
            # Can update own tasks
            return obj.assigned_to == request.user

        return False


class CanManageProjects(permissions.BasePermission):
    """Only admins can create/delete projects"""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ADMIN'
