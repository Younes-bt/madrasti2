# backend/users/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from django.contrib.auth.models import Group # Import the default Group model

# Unregister the default Group model from the admin
admin.site.unregister(Group)

class CustomUserAdmin(UserAdmin):
    """
    Configuration for our custom User model in the Django admin.
    """
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_staff', 'date_joined')
    ordering = ('email',)
    
    # These are necessary because we inherit from UserAdmin
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'password2'),
        }),
    )
    
    search_fields = ('email', 'first_name', 'last_name')
    filter_horizontal = ()
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')

# Register our custom User model with our custom admin configuration
admin.site.register(User, CustomUserAdmin)