# schools/admin.py

from django.contrib import admin
from django.utils.html import format_html
from .models import (
    AcademicYear,
    School,
    EducationalLevel,
    Grade,
    Track,
    SchoolClass,
    Room,
    Equipment,
    Vehicle,
    VehicleMaintenanceRecord,
    GasoilRecord,
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
    list_display = ('name', 'email', 'phone', 'fix_phone', 'whatsapp_num', 'current_academic_year')
    search_fields = ('name', 'email', 'school_code', 'city')
    fieldsets = (
        ('School Identity', {
            'fields': ('name', 'name_arabic', 'name_french', 'logo', 'logo_preview')
        }),
        ('Contact Information', {
            'fields': ('phone', 'fix_phone', 'whatsapp_num', 'email', 'website')
        }),
        ('Social Media', {
            'fields': ('facebook_url', 'instagram_url', 'twitter_url', 'linkedin_url', 'youtube_url'),
            'classes': ('collapse',)
        }),
        ('Location', {
            'fields': ('address', 'city', 'region', 'postal_code')
        }),
        ('Administration', {
            'fields': ('current_academic_year', 'director', 'school_code', 'pattent', 'rc_code')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('logo_preview', 'created_at', 'updated_at')

    def logo_preview(self, obj):
        """Render a small preview of the uploaded logo."""
        if obj and obj.logo_url:
            return format_html('<img src="{}" style="max-height: 120px;" alt="School Logo" />', obj.logo_url)
        return "No logo uploaded"
    logo_preview.short_description = 'Current Logo'

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

class EquipmentInline(admin.TabularInline):
    """Inline to manage equipment items within a room."""
    model = Equipment
    extra = 0
    fields = ('name', 'quantity', 'is_active')

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'room_type', 'capacity')
    list_filter = ('room_type',)
    search_fields = ('name', 'code')
    inlines = [EquipmentInline]

@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'room', 'quantity', 'is_active', 'updated_at')
    list_filter = ('is_active', 'room__room_type')
    search_fields = ('name', 'room__name', 'description')
    autocomplete_fields = ['room']
    list_editable = ('quantity', 'is_active')
    readonly_fields = ('created_at', 'updated_at')

class VehicleMaintenanceInline(admin.TabularInline):
    """Display latest maintenance records within the vehicle admin page."""
    model = VehicleMaintenanceRecord
    extra = 0
    fields = ('service_date', 'service_type', 'service_location', 'mileage', 'cost', 'description')
    readonly_fields = ()
    ordering = ('-service_date',)
    show_change_link = True

class GasoilRecordInline(admin.TabularInline):
    """Display recent gasoil refills within the vehicle admin page."""
    model = GasoilRecord
    extra = 0
    fields = ('refuel_date', 'liters', 'amount', 'fuel_station', 'receipt_number', 'notes')
    readonly_fields = ()
    ordering = ('-refuel_date',)
    show_change_link = True

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'vehicle_type', 'plate_number', 'driver', 'last_oil_change_date', 'last_service_date', 'is_active')
    list_filter = ('vehicle_type', 'is_active')
    search_fields = ('name', 'model', 'plate_number')
    autocomplete_fields = ['driver', 'school']
    inlines = [VehicleMaintenanceInline, GasoilRecordInline]
    fieldsets = (
        ('Vehicle Details', {
            'fields': ('name', 'vehicle_type', 'model', 'plate_number', 'color', 'manufacture_year', 'capacity', 'school')
        }),
        ('Assignments', {
            'fields': ('driver', 'notes')
        }),
        ('Maintenance Tracking', {
            'fields': ('last_oil_change_date', 'last_service_date', 'insurance_expiry_date')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at', 'updated_at')

    def display_name(self, obj):
        return obj.name or obj.model
    display_name.short_description = 'Vehicle'

@admin.register(VehicleMaintenanceRecord)
class VehicleMaintenanceRecordAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'service_date', 'service_type', 'service_location', 'mileage', 'cost')
    list_filter = ('service_type', 'service_date')
    search_fields = ('vehicle__name', 'vehicle__model', 'vehicle__plate_number', 'service_type', 'service_location')
    autocomplete_fields = ['vehicle']

@admin.register(GasoilRecord)
class GasoilRecordAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'refuel_date', 'liters', 'amount', 'fuel_station', 'receipt_number')
    list_filter = ('refuel_date', 'fuel_station')
    search_fields = ('vehicle__name', 'vehicle__model', 'vehicle__plate_number', 'fuel_station', 'receipt_number')
    autocomplete_fields = ['vehicle']

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')

