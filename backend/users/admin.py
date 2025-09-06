# backend/users/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Profile, StudentEnrollment
from django.contrib.auth.models import Group # Import the default Group model

# Unregister the default Group model from the admin
admin.site.unregister(Group)

class ProfileInline(admin.StackedInline):
    """
    Inline Profile admin for User model.
    """
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile Information'
    
    fieldsets = (
        ('Multilingual Names', {
            'fields': ('ar_first_name', 'ar_last_name')
        }),
        ('Personal Information', {
            'fields': ('phone', 'date_of_birth', 'address')
        }),
        ('Profile Media', {
            'fields': ('profile_picture',)
        }),
        ('Biography', {
            'fields': ('bio',),
            'classes': ('collapse',)
        }),
        ('Emergency Contact', {
            'fields': ('emergency_contact_name', 'emergency_contact_phone'),
            'classes': ('collapse',)
        }),
        ('Social Media', {
            'fields': ('linkedin_url', 'twitter_url'),
            'classes': ('collapse',)
        }),
        ('Professional Information', {
            'fields': ('department', 'position', 'hire_date', 'salary'),
            'classes': ('collapse',)
        }),
    )

class CustomUserAdmin(UserAdmin):
    """
    Configuration for our custom User model in the Django admin.
    """
    inlines = (ProfileInline,)
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_staff', 'is_active', 'date_joined')
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
            'fields': ('email', 'password1', 'password2'),
        }),
        ('Personal Information', {
            'classes': ('wide',),
            'fields': ('first_name', 'last_name', 'role'),
        }),
        ('Permissions', {
            'classes': ('collapse',),
            'fields': ('is_active', 'is_staff', 'is_superuser'),
        }),
    )
    
    search_fields = ('email', 'first_name', 'last_name', 'profile__phone')
    filter_horizontal = ()
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active', 'groups')

class ProfileAdmin(admin.ModelAdmin):
    """
    Standalone Profile admin for advanced profile management.
    """
    list_display = ('user', 'ar_full_name', 'phone', 'department', 'position', 'hire_date', 'created_at')
    list_filter = ('department', 'position', 'hire_date')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'ar_first_name', 'ar_last_name', 'phone', 'department')
    readonly_fields = ('created_at', 'updated_at', 'full_name', 'ar_full_name', 'age', 'profile_picture_url')
    
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Multilingual Names', {
            'fields': ('ar_first_name', 'ar_last_name', 'full_name', 'ar_full_name')
        }),
        ('Personal Information', {
            'fields': ('phone', 'date_of_birth', 'age', 'address')
        }),
        ('Profile Media', {
            'fields': ('profile_picture', 'profile_picture_url')
        }),
        ('Biography', {
            'fields': ('bio',)
        }),
        ('Emergency Contact', {
            'fields': ('emergency_contact_name', 'emergency_contact_phone')
        }),
        ('Social Media', {
            'fields': ('linkedin_url', 'twitter_url'),
            'classes': ('collapse',)
        }),
        ('Professional Information', {
            'fields': ('department', 'position', 'hire_date', 'salary')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

# Student Enrollment Inline for User Admin
class StudentEnrollmentInline(admin.TabularInline):
    model = StudentEnrollment
    extra = 0
    fields = ('school_class', 'academic_year', 'student_number', 'enrollment_date', 'is_active')
    readonly_fields = ('created_at', 'updated_at')

# Add enrollment inline to User admin
CustomUserAdmin.inlines = [StudentEnrollmentInline]

# Student Enrollment Admin
class StudentEnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'school_class', 'academic_year', 'student_number', 'enrollment_date', 'is_active')
    list_filter = ('school_class__grade__educational_level', 'academic_year', 'is_active', 'enrollment_date')
    search_fields = ('student__email', 'student__first_name', 'student__last_name', 'student_number')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Student Information', {
            'fields': ('student', 'student_number')
        }),
        ('Academic Assignment', {
            'fields': ('school_class', 'academic_year', 'enrollment_date')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

# Register our custom User model with our custom admin configuration
admin.site.register(User, CustomUserAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(StudentEnrollment, StudentEnrollmentAdmin)