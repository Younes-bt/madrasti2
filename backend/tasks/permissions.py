# tasks/permissions.py

from rest_framework import permissions


class IsAdminOrReadOwn(permissions.BasePermission):
    """
    Admin, Director, and Assistant can do anything.
    Other users can read their own tasks.
    General Supervisor can view all but not create/modify.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        # Admin has full access
        if request.user.role == 'ADMIN':
            return True

        # Director and Assistant have full access (can manage tasks)
        if request.user.role == 'STAFF' and hasattr(request.user, 'profile'):
            if request.user.profile.position in ['DIRECTOR', 'ASSISTANT']:
                return True

        # General Supervisor and others can only view
        return request.method in permissions.SAFE_METHODS

    def has_object_permission(self, request, view, obj):
        # Admin has full access
        if request.user.role == 'ADMIN':
            return True

        # Director and Assistant have full access
        if request.user.role == 'STAFF' and hasattr(request.user, 'profile'):
            if request.user.profile.position in ['DIRECTOR', 'ASSISTANT']:
                return True

        # General Supervisor can view all tasks (read-only)
        if request.user.role == 'STAFF' and hasattr(request.user, 'profile'):
            if request.user.profile.position == 'GENERAL_SUPERVISOR':
                return request.method in permissions.SAFE_METHODS

        # Users can view their own tasks
        if hasattr(obj, 'assigned_to'):
            return obj.assigned_to == request.user

        return False


class CanRateTask(permissions.BasePermission):
    """Only admins, directors, and assistants can rate tasks"""

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        # Admin can rate
        if request.user.role == 'ADMIN':
            return True

        # Director and Assistant can rate tasks
        if request.user.role == 'STAFF' and hasattr(request.user, 'profile'):
            if request.user.profile.position in ['DIRECTOR', 'ASSISTANT']:
                return True

        return False
