"""
Custom permission classes for the finance app.
"""
from rest_framework import permissions


class IsFinanceAdmin(permissions.BasePermission):
    """
    Permission class that allows access only to ADMIN users or users with ACCOUNTANT position.
    Used for financial management operations that require elevated privileges.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        # Allow access for ADMIN users
        if request.user.role == 'ADMIN':
            return True

        # Allow access for users with ACCOUNTANT position
        if hasattr(request.user, 'profile') and request.user.profile.position == 'ACCOUNTANT':
            return True

        return False


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permission class that allows read access to authenticated users,
    but write access only to ADMIN users or ACCOUNTANT position holders.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        # Allow read operations for all authenticated users
        if request.method in permissions.SAFE_METHODS:
            return True

        # Allow write operations only for ADMIN or ACCOUNTANT
        return (
            request.user.role == 'ADMIN' or
            (hasattr(request.user, 'profile') and request.user.profile.position == 'ACCOUNTANT')
        )


class CanViewPayroll(permissions.BasePermission):
    """
    Permission class for payroll viewing.
    - ADMIN and ACCOUNTANT: Full access to all payroll records
    - HR_COORDINATOR: Full access to all payroll records
    - Regular employees: Can only view their own payroll entries
    """
    def has_permission(self, request, view):
        """Check if user has permission to access payroll endpoints"""
        if not request.user.is_authenticated:
            return False

        # ADMIN always has access
        if request.user.role == 'ADMIN':
            return True

        # ACCOUNTANT and HR_COORDINATOR have full access
        if hasattr(request.user, 'profile'):
            if request.user.profile.position in ['ACCOUNTANT', 'HR_COORDINATOR']:
                return True

        # Regular employees can access (but object permissions will limit to own records)
        return True

    def has_object_permission(self, request, view, obj):
        """Check if user has permission to access specific payroll object"""
        # ADMIN always has access
        if request.user.role == 'ADMIN':
            return True

        # ACCOUNTANT and HR_COORDINATOR have full access
        if hasattr(request.user, 'profile'):
            if request.user.profile.position in ['ACCOUNTANT', 'HR_COORDINATOR']:
                return True

        # For PayrollEntry objects, check if it belongs to the user
        from .models import PayrollEntry
        if isinstance(obj, PayrollEntry):
            return obj.employee == request.user

        # For PayrollPeriod objects, regular users can view if they have entries in that period
        from .models import PayrollPeriod
        if isinstance(obj, PayrollPeriod):
            # Check if user has any entries in this period
            return obj.payroll_entries.filter(employee=request.user).exists()

        return False


class CanManageContracts(permissions.BasePermission):
    """
    Permission class for employment contract management.
    - ADMIN, ACCOUNTANT, HR_COORDINATOR: Full access
    - Regular employees: Read-only access to their own contracts
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        # ADMIN always has full access
        if request.user.role == 'ADMIN':
            return True

        # ACCOUNTANT and HR_COORDINATOR have full access
        if hasattr(request.user, 'profile'):
            if request.user.profile.position in ['ACCOUNTANT', 'HR_COORDINATOR']:
                return True

        # Regular employees can view (read-only)
        if request.method in permissions.SAFE_METHODS:
            return True

        return False

    def has_object_permission(self, request, view, obj):
        # ADMIN always has access
        if request.user.role == 'ADMIN':
            return True

        # ACCOUNTANT and HR_COORDINATOR have full access
        if hasattr(request.user, 'profile'):
            if request.user.profile.position in ['ACCOUNTANT', 'HR_COORDINATOR']:
                return True

        # Regular employees can only view their own contracts
        if request.method in permissions.SAFE_METHODS:
            return obj.employee == request.user

        return False


class CanApproveExpenses(permissions.BasePermission):
    """
    Permission class for expense approval.
    - ADMIN and ACCOUNTANT: Can approve expenses
    - Others: Cannot approve
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        return (
            request.user.role == 'ADMIN' or
            (hasattr(request.user, 'profile') and request.user.profile.position == 'ACCOUNTANT')
        )
