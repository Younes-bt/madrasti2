# schools/admin.py

from django.contrib import admin
from .models import (
    AcademicYear,
    School,
    EducationalLevel,
    Grade,
    Track,
    SchoolClass,
    Room,
    Subject,
    SubjectGrade
)

# --- Inline Admins ---
# Inlines allow you to edit related models on the same page as the parent model.

class GradeInline(admin.TabularInline):
    """Allows editing Grades directly within the EducationalLevel admin page."""
    model = Grade
    extra = 1  # Number of empty forms to display
    ordering = ('grade_number',)

class TrackInline(admin.TabularInline):
    """Allows editing Tracks directly within the Grade admin page."""
    model = Track
    extra = 1
    ordering = ('order', 'name')

class SubjectGradeInline(admin.TabularInline):
    """Allows editing Subject configurations directly within the Grade admin page."""
    model = SubjectGrade
    extra = 1
    autocomplete_fields = ['subject'] # Use a search box for subjects

class SchoolClassInline(admin.TabularInline):
    """Allows viewing related SchoolClasses from the Grade admin page."""
    model = SchoolClass
    extra = 0
    fields = ('track', 'section', 'academic_year')
    readonly_fields = ('track', 'section', 'academic_year')
    can_delete = False
    show_change_link = True

    def has_add_permission(self, request, obj=None):
        return False

# --- Main ModelAdmins ---
# These classes customize the main list and edit pages for each model.

@admin.register(AcademicYear)
class AcademicYearAdmin(admin.ModelAdmin):
    list_display = ('year', 'start_date', 'end_date', 'is_current')
    list_filter = ('is_current',)
    search_fields = ('year',)

@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'current_academic_year')
    # Prevent adding more than one School configuration
    def has_add_permission(self, request):
        return not School.objects.exists()

@admin.register(EducationalLevel)
class EducationalLevelAdmin(admin.ModelAdmin):
    list_display = ('name', 'order', 'level')
    list_editable = ('order',)
    inlines = [GradeInline] # Add the Grade editor here

@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'educational_level', 'grade_number', 'passing_grade')
    list_filter = ('educational_level',)
    search_fields = ('name', 'code', 'educational_level__name')
    inlines = [TrackInline, SubjectGradeInline, SchoolClassInline] # Add Track, Subject and Class editors here

@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ('name', 'grade', 'code', 'is_active', 'order')
    list_filter = ('grade__educational_level', 'grade', 'is_active')
    search_fields = ('name', 'name_arabic', 'name_french', 'code')
    list_editable = ('order', 'is_active')
    autocomplete_fields = ['grade']

@admin.register(SchoolClass)
class SchoolClassAdmin(admin.ModelAdmin):
    list_display = ('name', 'grade', 'track', 'academic_year')
    list_filter = ('academic_year', 'grade__educational_level', 'track')
    search_fields = ('name', 'grade__name', 'track__name')
    autocomplete_fields = ['grade', 'track']
    # The 'name' field is auto-generated, so we don't need it in the form
    exclude = ('name',)

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'room_type', 'capacity')
    list_filter = ('room_type',)
    search_fields = ('name', 'code')

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')

