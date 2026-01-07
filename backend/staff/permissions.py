"""
Position-based permission classes for staff access control.

These permissions enforce security at the API level based on user positions.
Frontend navigation filtering is for UX only - real security is here.

Position Hierarchy:
- ADMIN: Full access to everything (bypass mechanism)
- DIRECTOR: Management staff, full operational access
- ASSISTANT: Management staff, full operational access  
- GENERAL_SUPERVISOR: Operational access, cannot manage tasks
- ACCOUNTANT: Finance-focused access
- DRIVER: Transport-focused access
"""
from rest_framework import permissions


class IsDriverPosition(permissions.BasePermission):
    """
    Permission class that allows access only to ADMIN or DRIVER position holders.
    Used for transport-related endpoints.
    
    Example usage:
        permission_classes = [IsDriverPosition]
    """
    message = "Only drivers can access this resource."
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # ADMIN bypass - always has access
        if request.user.role == 'ADMIN':
            return True
        
        # Check for DRIVER position
        if hasattr(request.user, 'profile') and request.user.profile.position == 'DRIVER':
            return True
        
        return False


class IsAccountantPosition(permissions.BasePermission):
    """
    Permission class for accountant-specific resources.
    Note: Finance module has its own IsFinanceAdmin that covers both ADMIN and ACCOUNTANT.
    This is a duplicate for consistency but finance.permissions.IsFinanceAdmin is preferred.
    
    Example usage:
        permission_classes = [IsAccountantPosition]
    """
    message = "Only accountants can access this resource."
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.user.role == 'ADMIN':
            return True
        
        if hasattr(request.user, 'profile') and request.user.profile.position == 'ACCOUNTANT':
            return True
        
        return False


class IsDirectorPosition(permissions.BasePermission):
    """
    Permission class for director-only resources.
    Directors have highest staff authority after ADMIN.
    
    Example usage:
        permission_classes = [IsDirectorPosition]
    """
    message = "Only directors can access this resource."
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.user.role == 'ADMIN':
            return True
        
        if hasattr(request.user, 'profile') and request.user.profile.position == 'DIRECTOR':
            return True
        
        return False


class IsAssistantPosition(permissions.BasePermission):
    """
    Permission class for assistant-specific resources.
    Assistants typically have similar permissions to directors.
    
    Example usage:
        permission_classes = [IsAssistantPosition]
    """
    message = "Only assistants can access this resource."
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.user.role == 'ADMIN':
            return True
        
        if hasattr(request.user, 'profile') and request.user.profile.position == 'ASSISTANT':
            return True
        
        return False


class IsGeneralSupervisor(permissions.BasePermission):
    """
    Permission class for general supervisor resources.
    Supervisors have operational access but limited administrative capabilities.
    
    Example usage:
        permission_classes = [IsGeneralSupervisor]
    """
    message = "Only general supervisors can access this resource."
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.user.role == 'ADMIN':
            return True
        
        if hasattr(request.user, 'profile') and request.user.profile.position == 'GENERAL_SUPERVISOR':
            return True
        
        return False


class IsManagementStaff(permissions.BasePermission):
    """
    Permission class for management-level staff.
    Includes: DIRECTOR, ASSISTANT, GENERAL_SUPERVISOR
    
    Used for endpoints that require management oversight but not admin privileges.
    
    Example usage:
        permission_classes = [IsManagementStaff]
    """
    message = "Only management staff can access this resource."
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # ADMIN always has access
        if request.user.role == 'ADMIN':
            return True
        
        # Check if user has management position
        if hasattr(request.user, 'profile'):
            management_positions = ['DIRECTOR', 'ASSISTANT', 'GENERAL_SUPERVISOR']
            if request.user.profile.position in management_positions:
                return True
        
        return False


class CanManageAttendance(permissions.BasePermission):
    """
    Permission class for attendance management operations.
    
    Allowed positions:
    - ADMIN (full access)
    - DIRECTOR (management access)
    - ASSISTANT (management access)
    - GENERAL_SUPERVISOR (operational access)
    
    Example usage:
        permission_classes = [CanManageAttendance]
    """
    message = "You do not have permission to manage attendance."
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # ADMIN always has access
        if request.user.role == 'ADMIN':
            return True
        
        # Management staff can manage attendance
        if hasattr(request.user, 'profile'):
            allowed_positions = ['DIRECTOR', 'ASSISTANT', 'GENERAL_SUPERVISOR']
            if request.user.profile.position in allowed_positions:
                return True
        
        return False


class CanViewTeachers(permissions.BasePermission):
    """
    Permission class for viewing teacher information.
    
    Allowed positions:
    - ADMIN
    - DIRECTOR
    - ASSISTANT
    - GENERAL_SUPERVISOR
    
    Note: This is READ permission. For write operations, use more restrictive permissions.
    
    Example usage:
        permission_classes = [CanViewTeachers]
    """
    message = "You do not have permission to view teacher information."
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.user.role == 'ADMIN':
            return True
        
        # Management staff can view teachers
        if hasattr(request.user, 'profile'):
            allowed_positions = ['DIRECTOR', 'ASSISTANT', 'GENERAL_SUPERVISOR']
            if request.user.profile.position in allowed_positions:
                return True
        
        return False


class CanManageTasks(permissions.BasePermission):
    """
    Permission class for task management operations.
    
    Allowed positions:
    - ADMIN (full access)
    - DIRECTOR (full management access)
    - ASSISTANT (full management access)
    
    Note: GENERAL_SUPERVISOR is explicitly excluded from task management.
    
    Example usage:
        permission_classes = [CanManageTasks]
    """
    message = "Only directors and assistants can manage tasks."
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # ADMIN always has access
        if request.user.role == 'ADMIN':
            return True
        
        # Only DIRECTOR and ASSISTANT can manage tasks
        if hasattr(request.user, 'profile'):
            allowed_positions = ['DIRECTOR', 'ASSISTANT']
            if request.user.profile.position in allowed_positions:
                return True
        
        return False


class CanViewDriverPages(permissions.BasePermission):
    """
    Permission class for driver-specific pages and resources.
    Alias for IsDriverPosition for semantic clarity.
    
    Example usage:
        permission_classes = [CanViewDriverPages]
    """
    message = "Only drivers can access transport resources."
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.user.role == 'ADMIN':
            return True
        
        if hasattr(request.user, 'profile') and request.user.profile.position == 'DRIVER':
            return True
        
        return False


class IsStaffMember(permissions.BasePermission):
    """
    Permission class for general staff access.
    Allows any user with role='STAFF' or role='DRIVER' or role='ADMIN'.
    
    Use this for endpoints that should be accessible to any staff member
    regardless of position.
    
    Example usage:
        permission_classes = [IsStaffMember]
    """
    message = "Only staff members can access this resource."
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # ADMIN always has access
        if request.user.role == 'ADMIN':
            return True
        
        # Check if user is staff or driver
        if request.user.role in ['STAFF', 'DRIVER']:
            return True
        
        return False


class IsManagementOrReadOnly(permissions.BasePermission):
    """
    Permission class that allows:
    - Read access: All authenticated management staff
    - Write access: Only ADMIN, DIRECTOR, ASSISTANT
    
    GENERAL_SUPERVISOR gets read-only access.
    
    Example usage:
        permission_classes = [IsManagementOrReadOnly]
    """
    message = "Only management staff with appropriate permissions can modify this resource."
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Allow read operations for all management staff
        if request.method in permissions.SAFE_METHODS:
            if request.user.role == 'ADMIN':
                return True
            
            if hasattr(request.user, 'profile'):
                management_positions = ['DIRECTOR', 'ASSISTANT', 'GENERAL_SUPERVISOR']
                if request.user.profile.position in management_positions:
                    return True
        
        # Write operations only for ADMIN, DIRECTOR, ASSISTANT
        if request.user.role == 'ADMIN':
            return True
        
        if hasattr(request.user, 'profile'):
            write_positions = ['DIRECTOR', 'ASSISTANT']
            if request.user.profile.position in write_positions:
                return True
        
        return False
