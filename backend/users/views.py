# backend/users/views.py

from rest_framework import generics, status, viewsets, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.contrib.auth import authenticate
from django.http import HttpResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
import pandas as pd
import io
from datetime import datetime
import threading
import time
from django.utils import timezone

from .models import User, StudentEnrollment, BulkImportJob
from .serializers import UserRegisterSerializer, UserProfileSerializer, MyTokenObtainPairSerializer, StudentEnrollmentSerializer, StudentEnrollmentCreateSerializer, UserBasicSerializer, UserUpdateSerializer

# The RegisterView and ProfileView remain the same
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegisterSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    
    def get_serializer_class(self):
        # For GET (retrieve) return UserUpdateSerializer to include
        # academic, parent, and flattened profile fields expected by the frontend.
        # Keep the same serializer for updates.
        if self.request.method in ['GET', 'PUT', 'PATCH']:
            return UserUpdateSerializer
        return UserProfileSerializer

    def get_object(self):
        return self.request.user


# Add this NEW LoginView
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Please provide both email and password"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Use Django's built-in authentication
        user = authenticate(request, email=email, password=password)

        if user:
            # Check if user is using default password
            default_password = 'defaultStrongPassword25'
            if password == default_password and not user.force_password_change:
                # Mark user for forced password change
                user.force_password_change = True
                user.save()
            
            # Set user as online and update last_login
            from django.utils import timezone
            user.set_online_status(True)
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])

            # If authentication is successful, use our serializer to get tokens
            serializer = MyTokenObtainPairSerializer.get_token(user)
            refresh = str(serializer)
            access = str(serializer.access_token)

            # Use UserUpdateSerializer to get complete user data including profile
            user_serializer = UserUpdateSerializer(user)

            return Response(
                {
                    "refresh": refresh,
                    "access": access,
                    "force_password_change": user.force_password_change,
                    "user": user_serializer.data
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {"error": "Invalid Credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )


class LogoutView(APIView):
    """API endpoint for user logout"""
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """Mark user as offline during logout"""
        try:
            user = request.user
            user.set_online_status(False)

            return Response(
                {"message": "Logout successful"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": f"Logout failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class HeartbeatView(APIView):
    """API endpoint for tracking user activity"""
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """Update user's last seen timestamp and ensure they're marked as online"""
        try:
            user = request.user
            user.update_last_seen()

            # Ensure user is marked as online (in case they weren't)
            if not user.is_online:
                user.set_online_status(True)

            return Response(
                {
                    "status": "success",
                    "last_seen": user.last_seen,
                    "is_online": user.is_online
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": f"Heartbeat failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CleanupInactiveUsersView(APIView):
    """API endpoint for cleanup of inactive users (admin only)"""
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """Mark users as offline if they haven't been active for a while"""
        if not request.user.role == 'ADMIN':
            return Response(
                {"error": "Admin access required"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            from datetime import timedelta

            # Mark users as offline if they haven't been seen in 10 minutes
            inactive_threshold = timezone.now() - timedelta(minutes=10)

            updated_count = User.objects.filter(
                is_online=True,
                last_seen__lt=inactive_threshold
            ).update(is_online=False)

            return Response(
                {
                    "status": "success",
                    "users_marked_offline": updated_count,
                    "threshold_minutes": 10
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": f"Cleanup failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ChangePasswordView(APIView):
    """API endpoint for changing user password"""
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not all([current_password, new_password, confirm_password]):
            return Response(
                {"error": "All fields are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if new passwords match
        if new_password != confirm_password:
            return Response(
                {"error": "New passwords do not match"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate current password
        if not user.check_password(current_password):
            return Response(
                {"error": "Current password is incorrect"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate new password strength
        if len(new_password) < 8:
            return Response(
                {"error": "Password must be at least 8 characters long"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if new password is different from current
        if user.check_password(new_password):
            return Response(
                {"error": "New password must be different from current password"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Set new password and clear force password change flag
        user.set_password(new_password)
        user.force_password_change = False
        user.save()

        return Response(
            {"message": "Password changed successfully"},
            status=status.HTTP_200_OK
        )


# =====================================
# PERMISSION CLASSES
# =====================================

class IsTeacherOrAdmin(permissions.BasePermission):
    """Permission for teachers and admins"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['TEACHER', 'ADMIN']


class IsAdminOrReadOnly(permissions.BasePermission):
    """Permission for admins to modify, others to read only"""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role == 'ADMIN'


# =====================================
# USER VIEWSET
# =====================================

class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for listing, retrieving, and updating users"""
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['role', 'is_active', 'profile__school_subject', 'profile__teachable_grades']
    search_fields = ['first_name', 'last_name', 'email', 'profile__phone']
    ordering_fields = ['first_name', 'last_name', 'email', 'created_at']
    ordering = ['last_name', 'first_name']
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        elif self.action == 'retrieve':
            return UserUpdateSerializer  # Use same serializer for retrieve to get profile data
        return UserBasicSerializer
    
    def get_queryset(self):
        # Base queryset with optimized relations
        queryset = User.objects.select_related(
            'profile',  # User profile data
            'parent',   # Parent information for students
            'parent__profile',  # Parent profile data
            'profile__school_subject'  # Subject specialization for teachers
        ).prefetch_related(
            'student_enrollments__school_class__grade__educational_level',  # Academic information
            'student_enrollments__academic_year',  # Academic year information
            'profile__teachable_grades',  # Teachable grades for teachers
            'teaching_classes__grade__educational_level',  # Teacher's classes
            'teaching_classes__academic_year'  # Academic year for teacher's classes
        ).all()

        # Additional filtering by role
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role.upper())

        # Filter teachers by subject specialization
        subject_id = self.request.query_params.get('subject_id')
        if subject_id and role and role.upper() == 'TEACHER':
            queryset = queryset.filter(profile__school_subject_id=subject_id)

        return queryset

    @action(detail=False, methods=['get'])
    def my_classes(self, request):
        """Get current teacher's assigned classes"""
        if request.user.role != 'TEACHER':
            return Response({'error': 'Only teachers can access this endpoint'}, status=403)

        from schools.models import SchoolClass
        from schools.serializers import SchoolClassSerializer

        # Get teacher's assigned classes with related data
        classes = SchoolClass.objects.filter(
            teachers=request.user
        ).select_related(
            'grade',
            'grade__educational_level',
            'track',
            'academic_year'
        ).prefetch_related(
            'student_enrollments__student'
        )

        serializer = SchoolClassSerializer(classes, many=True)
        return Response({
            'classes': serializer.data,
            'teacher': {
                'id': request.user.id,
                'name': request.user.full_name,
                'subject': request.user.profile.school_subject.name if request.user.profile.school_subject else None
            }
        })

    @action(detail=False, methods=['get'])
    def my_teachable_classes(self, request):
        """Get all classes that match teacher's subject and teachable grades (for assignment purposes)"""
        if request.user.role != 'TEACHER':
            return Response({'error': 'Only teachers can access this endpoint'}, status=403)

        from schools.models import SchoolClass
        from schools.serializers import SchoolClassSerializer

        # Get classes that match teacher's teachable grades and current academic year
        teachable_grades = request.user.profile.teachable_grades.all()
        if not teachable_grades.exists():
            return Response({
                'classes': [],
                'message': 'No teachable grades assigned to teacher'
            })

        # Get current academic year
        from schools.models import AcademicYear
        current_year = AcademicYear.objects.filter(is_current=True).first()
        if not current_year:
            return Response({
                'classes': [],
                'message': 'No current academic year set'
            })

        classes = SchoolClass.objects.filter(
            grade__in=teachable_grades,
            academic_year=current_year
        ).select_related(
            'grade',
            'grade__educational_level',
            'track',
            'academic_year'
        ).prefetch_related(
            'teachers',
            'student_enrollments__student'
        )

        serializer = SchoolClassSerializer(classes, many=True)
        return Response({
            'classes': serializer.data,
            'teacher': {
                'id': request.user.id,
                'name': request.user.full_name,
                'subject': request.user.profile.school_subject.name if request.user.profile.school_subject else None,
                'teachable_grades': [{'id': g.id, 'name': g.name} for g in teachable_grades]
            }
        })


# =====================================
# STUDENT ENROLLMENT VIEWSET
# =====================================

class StudentEnrollmentViewSet(viewsets.ModelViewSet):
    """ViewSet for student enrollments"""
    queryset = StudentEnrollment.objects.select_related(
        'student', 'school_class', 'academic_year', 'school_class__grade', 'school_class__grade__educational_level'
    ).all()
    permission_classes = [IsTeacherOrAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = {
        'school_class__grade__educational_level': ['exact'],
        'school_class__grade': ['exact'],
        'school_class': ['exact'],
        'academic_year': ['exact'],
        'is_active': ['exact'],
    }
    search_fields = ['student__first_name', 'student__last_name', 'student__email', 'student_number']
    ordering_fields = ['student__last_name', 'student__first_name', 'enrollment_date']
    ordering = ['student__last_name', 'student__first_name']

    def get_serializer_class(self):
        if self.action == 'create':
            return StudentEnrollmentCreateSerializer
        return StudentEnrollmentSerializer


# =====================================
# BULK IMPORT VIEWS
# =====================================

class StudentBulkImportView(APIView):
    """
    View for bulk import of students via Excel template
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Download Excel template for bulk student import"""
        try:
            # Get educational structure parameters (if provided)
            level_id = request.GET.get('level_id')
            grade_id = request.GET.get('grade_id')  
            class_id = request.GET.get('class_id')
            academic_year_id = request.GET.get('academic_year_id')
            
            # Get educational structure names for template info
            level_name = ''
            grade_name = ''
            class_name = ''
            academic_year = ''
            
            if level_id and grade_id and class_id and academic_year_id:
                from schools.models import EducationalLevel, Grade, SchoolClass, AcademicYear
                try:
                    level = EducationalLevel.objects.get(id=level_id)
                    grade = Grade.objects.get(id=grade_id)
                    school_class = SchoolClass.objects.get(id=class_id)
                    academic_year_obj = AcademicYear.objects.get(id=academic_year_id)
                    
                    level_name = level.name
                    grade_name = grade.name
                    class_name = school_class.name
                    academic_year = academic_year_obj.year
                except:
                    pass  # Use default template if IDs are invalid
            
            # Create simplified template without educational structure fields
            template_data = {
                'Student First Name': ['Ahmed', 'Fatima', ''],
                'Student Last Name': ['Smith', 'Johnson', ''],
                'Arabic First Name': ['أحمد', 'فاطمة', ''],
                'Arabic Last Name': ['سميث', 'جونسون', ''],
                'Student Phone': ['', '', ''],
                'Date of Birth': ['2010-05-15', '2009-12-03', ''],
                'Address': ['123 Main St, City', '456 Oak Ave, Town', ''],
                'Parent First Name': ['Mohamed', 'Hassan', ''],
                'Parent Last Name': ['Smith', 'Johnson', ''],
                'Parent Phone': ['', '', ''],
                'Emergency Contact Name': ['Uncle Ali', 'Aunt Sarah', ''],
                'Emergency Contact Phone': ['', '', ''],
                'Notes': ['Good student', 'Excellent in math', '']
            }
            
            df = pd.DataFrame(template_data)
            
            # Create Excel file in memory
            buffer = io.BytesIO()
            with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
                # Write main data sheet
                df.to_excel(writer, sheet_name='Students', index=False)
                
                # Add instructions sheet with educational structure info
                instructions_data = {
                    'Instructions': [
                        '1. Fill in the student information in the "Students" sheet',
                        '2. Required fields: Student First Name, Student Last Name, Arabic names',
                        '3. Educational structure is pre-selected (see below)',
                        '4. Parent information will create parent accounts automatically',
                        '5. Date format: YYYY-MM-DD (e.g., 2010-05-15)',
                        '6. Phone format: +1234567890 or any valid format',
                        '7. Delete sample rows before uploading',
                        '8. Save file and upload back to the system',
                        '9. System will validate and show preview before import',
                        '10. All students will be enrolled in the same class'
                    ],
                    'Details': [
                        'Sample data is provided in first 2 rows',
                        'All names are required for account creation',
                        f'Level: {level_name}' if level_name else 'Educational structure not selected',
                        f'Grade: {grade_name}' if grade_name else 'Please select educational structure first',
                        f'Class: {class_name}' if class_name else 'Please select educational structure first',
                        f'Academic Year: {academic_year}' if academic_year else 'Please select educational structure first',
                        'Parents with same email will not be duplicated',
                        'Use format: 2010-05-15 (year-month-day)',
                        'Must be .xlsx format (Excel 2007+)',
                        'Errors will be shown with row numbers'
                    ]
                }
                
                instructions = pd.DataFrame(instructions_data)
                instructions.to_excel(writer, sheet_name='Instructions', index=False)
            
            buffer.seek(0)
            
            # Create response with Excel file
            response = HttpResponse(
                buffer.getvalue(),
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            response['Content-Disposition'] = f'attachment; filename="student_import_template_{datetime.now().strftime("%Y%m%d")}.xlsx'
            
            return response
            
        except Exception as e:
            return Response(
                {'error': f'Failed to generate template: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self, request):
        """Process uploaded Excel file for bulk student import"""
        try:
            # Debug: Log the incoming request
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"BULK IMPORT DEBUG: Method={request.method}, Preview param={request.data.get('preview')}")
            
            # Check if file was uploaded
            if 'file' not in request.FILES:
                return Response(
                    {'error': 'No file uploaded'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get educational structure parameters
            level_id = request.data.get('level_id')
            grade_id = request.data.get('grade_id')
            class_id = request.data.get('class_id')
            academic_year_id = request.data.get('academic_year_id')
            
            # Validate educational structure parameters
            if not all([level_id, grade_id, class_id, academic_year_id]):
                return Response(
                    {'error': 'Educational structure parameters (level_id, grade_id, class_id, academic_year_id) are required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            uploaded_file = request.FILES['file']
            
            # Validate file type
            if not uploaded_file.name.endswith(('.xlsx', '.xls')):
                return Response(
                    {'error': 'Please upload an Excel file (.xlsx or .xls)'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Read Excel file
            try:
                df = pd.read_excel(uploaded_file, sheet_name='Students')
            except Exception as e:
                return Response(
                    {'error': f'Failed to read Excel file: {str(e)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate required columns (simplified - no educational structure columns)
            required_columns = [
                'Student First Name', 'Student Last Name', 
                'Arabic First Name', 'Arabic Last Name'
            ]
            
            missing_columns = [col for col in required_columns if col not in df.columns]
            if missing_columns:
                return Response(
                    {'error': f'Missing required columns: {", ".join(missing_columns)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Process and validate data with pre-selected educational structure
            preview_mode = request.data.get('preview', 'true').lower() == 'true'
            educational_structure = {
                'level_id': int(level_id),
                'grade_id': int(grade_id), 
                'class_id': int(class_id),
                'academic_year_id': int(academic_year_id)
            }
            
            if preview_mode:
                # For preview, process synchronously
                results = self._process_student_data(df, preview_mode, educational_structure)
                return Response(results, status=status.HTTP_200_OK)
            else:
                # For actual import, process asynchronously
                job = BulkImportJob.objects.create(
                    created_by=request.user,
                    total_records=len(df),
                    current_status='Initializing import...'
                )
                
                # Start background processing
                thread = threading.Thread(
                    target=self._process_import_async,
                    args=(job.job_id, df, educational_structure)
                )
                thread.daemon = True
                thread.start()
                
                return Response({
                    'job_id': str(job.job_id),
                    'status': 'started',
                    'message': 'Import job started successfully'
                }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Import failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _process_import_async(self, job_id, df, educational_structure):
        """Process import in background thread"""
        import logging
        logger = logging.getLogger(__name__)
        
        try:
            job = BulkImportJob.objects.get(job_id=job_id)
            job.status = BulkImportJob.Status.PROCESSING
            job.started_at = timezone.now()
            job.save()
            
            # Process the import with progress tracking
            results = self._process_student_data_with_progress(df, job, educational_structure)
            
            # Mark job as completed
            job.mark_completed(results)
            logger.info(f"Import job {job_id} completed successfully")
            
        except Exception as e:
            logger.error(f"Import job {job_id} failed: {str(e)}")
            try:
                job = BulkImportJob.objects.get(job_id=job_id)
                job.mark_failed(str(e))
            except:
                pass

    def _generate_unique_email_for_import(self, first_name, last_name, role, used_emails):
        """
        Generates a unique email for the import process.
        Checks against the database and a set of emails used in the current batch.
        """
        import re
        from .models import User

        # Clean names and get initial
        clean_last_name = re.sub(r'[^a-z0-9]', '', last_name.lower().replace(' ', '')).strip()
        initial = first_name[0].lower() if first_name else 'u'
        
        # Determine email domain
        school_name = 'madrasti' # This could be a setting
        role_suffix_map = {'STUDENT': 'students', 'PARENT': 'parents', 'TEACHER': 'teachers', 'ADMIN': 'team', 'STAFF': 'team'}
        domain_suffix = role_suffix_map.get(role, 'users')
        email_domain = f"@{school_name}-{domain_suffix}.com"
        
        # Base email part (e.g., j.doe)
        base_email_part = f"{initial}.{clean_last_name}"
        
        # First attempt - clean email without numbers
        candidate_email = base_email_part + email_domain
        
        # Check for uniqueness and add simple incremental number if needed
        counter = 2  # Start with 2 for the second attempt (first attempt has no number)
        while User.objects.filter(email=candidate_email).exists() or candidate_email in used_emails:
            candidate_email = f"{base_email_part}{counter}{email_domain}"
            counter += 1
            # Safety break to avoid infinite loop
            if counter > 1000:
                break
            
        return candidate_email

    def _process_student_data(self, df, preview_mode=True, educational_structure=None):
        """Process student data from DataFrame"""
        results = {
            'total_rows': len(df),
            'processed_rows': 0,
            'successful_imports': 0,
            'errors': [],
            'warnings': [],
            'preview_data': [] if preview_mode else None,
            'created_students': [] if not preview_mode else None,
            'created_parents': [] if not preview_mode else None
        }
        
        generated_emails_in_batch = set()
        
        for index, row in df.iterrows():
            try:
                # Skip empty rows
                if pd.isna(row['Student First Name']) or pd.isna(row['Student Last Name']):
                    continue
                
                results['processed_rows'] += 1
                row_number = index + 2  # Excel row number (accounting for header)

                # --- Basic Row Validation ---
                row_errors = []
                required_fields = {'Student First Name': 'Student first name', 'Student Last Name': 'Student last name', 'Arabic First Name': 'Arabic first name', 'Arabic Last Name': 'Arabic last name'}
                for field, display_name in required_fields.items():
                    if pd.isna(row.get(field)) or str(row.get(field)).strip() == '':
                        row_errors.append(f'{display_name} is required.')
                
                if not pd.isna(row.get('Date of Birth')):
                    try: pd.to_datetime(row['Date of Birth'])
                    except: row_errors.append('Invalid date format for Date of Birth. Use YYYY-MM-DD.')
                
                if row_errors:
                    results['errors'].append({'row': row_number, 'error': ' '.join(row_errors)})
                    continue
                # --- End Basic Validation ---

                # --- Prepare Student Data ---
                from datetime import date
                student_first_name = str(row['Student First Name']).strip()
                student_last_name = str(row['Student Last Name']).strip()
                
                # Generate final, unique email before validation
                student_email = self._generate_unique_email_for_import(
                    student_first_name, student_last_name, 'STUDENT', generated_emails_in_batch
                )

                student_data = {
                    'email': student_email,
                    'password': 'defaultStrongPassword25',
                    'first_name': student_first_name,
                    'last_name': student_last_name,
                    'role': 'STUDENT',
                    'ar_first_name': str(row['Arabic First Name']).strip(),
                    'ar_last_name': str(row['Arabic Last Name']).strip(),
                    'enrollment_date': date.today(),
                }
                
                if educational_structure:
                    student_data['school_class_id'] = educational_structure['class_id']
                    student_data['academic_year_id'] = educational_structure['academic_year_id']
                
                optional_fields = {
                    'phone': 'Student Phone', 'address': 'Address', 'bio': 'Notes',
                    'emergency_contact_name': 'Emergency Contact Name', 'emergency_contact_phone': 'Emergency Contact Phone',
                    'parent_first_name': 'Parent First Name', 'parent_last_name': 'Parent Last Name', 'parent_phone': 'Parent Phone'
                }
                for field, column in optional_fields.items():
                    if column in row and not pd.isna(row[column]):
                        student_data[field] = str(row[column]).strip()
                
                if 'Date of Birth' in row and not pd.isna(row['Date of Birth']):
                    student_data['date_of_birth'] = pd.to_datetime(row['Date of Birth']).date()
                # --- End Data Preparation ---

                if preview_mode:
                    generated_emails_in_batch.add(student_email) # Add to set even in preview
                    
                    # Generate predicted parent email if parent data exists
                    predicted_parent_email = None
                    if student_data.get('parent_first_name') and student_data.get('parent_last_name'):
                        predicted_parent_email = self._generate_unique_email_for_import(
                            student_data['parent_first_name'], 
                            student_data['parent_last_name'], 
                            'PARENT', 
                            generated_emails_in_batch
                        )
                    
                    preview_item = {
                        'row_number': row_number,
                        'student_name': f"{student_first_name} {student_last_name}",
                        'arabic_name': f"{row['Arabic First Name']} {row['Arabic Last Name']}",
                        'parent_name': f"{row.get('Parent First Name', '')} {row.get('Parent Last Name', '')}".strip(),
                        'predicted_student_email': student_email,
                        'predicted_parent_email': predicted_parent_email or 'No parent data provided'
                    }
                    if results['preview_data'] is None: results['preview_data'] = []
                    results['preview_data'].append(preview_item)
                else:
                    # Final Import: Validate and Save
                    serializer = UserRegisterSerializer(data=student_data)
                    if serializer.is_valid():
                        try:
                            student = serializer.save()
                            generated_emails_in_batch.add(student.email) # Add final email to set
                            results['successful_imports'] += 1
                            results['created_students'].append({'id': student.id, 'email': student.email, 'full_name': student.full_name, 'row_number': row_number})
                            
                            # Track parent creation for results
                            if student_data.get('parent_first_name') and student.parent:
                                # Check if this parent was already tracked in this batch
                                parent_already_tracked = any(
                                    p['id'] == student.parent.id 
                                    for p in results['created_parents']
                                )
                                if not parent_already_tracked:
                                    results['created_parents'].append({
                                        'id': student.parent.id, 
                                        'email': student.parent.email, 
                                        'full_name': student.parent.full_name,
                                        'children_count': student.parent.children.count()
                                    })

                        except Exception as save_error:
                            results['errors'].append({'row': row_number, 'error': f"Save Error: {save_error}"})
                    else:
                        results['errors'].append({'row': row_number, 'error': f"Validation failed: {serializer.errors}"})
                                
            except Exception as e:
                results['errors'].append({'row': index + 2, 'error': str(e)})
        
        return results

    def _process_student_data_with_progress(self, df, job, educational_structure):
        """Process student data with progress tracking"""
        results = {
            'total_rows': len(df),
            'processed_rows': 0,
            'successful_imports': 0,
            'errors': [],
            'warnings': [],
            'created_students': [],
            'created_parents': []
        }
        
        generated_emails_in_batch = set()
        total_rows = len(df)
        
        job.update_progress(5, "Validating data...")
        
        for index, row in df.iterrows():
            try:
                # Skip empty rows
                if pd.isna(row['Student First Name']) or pd.isna(row['Student Last Name']):
                    continue
                
                results['processed_rows'] += 1
                row_number = index + 2  # Excel row number (accounting for header)
                
                # Update progress after each record for smoother progress bar
                progress = 10 + (results['processed_rows'] / total_rows * 85)  # 10% to 95%
                status = f"Processing student {results['processed_rows']} of {total_rows}..."
                job.update_progress(int(progress), status)

                # --- Basic Row Validation ---
                row_errors = []
                required_fields = {'Student First Name': 'Student first name', 'Student Last Name': 'Student last name', 'Arabic First Name': 'Arabic first name', 'Arabic Last Name': 'Arabic last name'}
                for field, display_name in required_fields.items():
                    if pd.isna(row.get(field)) or str(row.get(field)).strip() == '':
                        row_errors.append(f'{display_name} is required.')
                
                if not pd.isna(row.get('Date of Birth')):
                    try: pd.to_datetime(row['Date of Birth'])
                    except: row_errors.append('Invalid date format for Date of Birth. Use YYYY-MM-DD.')
                
                if row_errors:
                    results['errors'].append({'row': row_number, 'error': ' '.join(row_errors)})
                    continue
                # --- End Basic Validation ---

                # --- Prepare Student Data ---
                from datetime import date
                student_first_name = str(row['Student First Name']).strip()
                student_last_name = str(row['Student Last Name']).strip()
                
                # Generate final, unique email before validation
                student_email = self._generate_unique_email_for_import(
                    student_first_name, student_last_name, 'STUDENT', generated_emails_in_batch
                )

                student_data = {
                    'email': student_email,
                    'password': 'defaultStrongPassword25',
                    'first_name': student_first_name,
                    'last_name': student_last_name,
                    'role': 'STUDENT',
                    'ar_first_name': str(row['Arabic First Name']).strip(),
                    'ar_last_name': str(row['Arabic Last Name']).strip(),
                    'enrollment_date': date.today(),
                }
                
                if educational_structure:
                    student_data['school_class_id'] = educational_structure['class_id']
                    student_data['academic_year_id'] = educational_structure['academic_year_id']
                
                optional_fields = {
                    'phone': 'Student Phone', 'address': 'Address', 'bio': 'Notes',
                    'emergency_contact_name': 'Emergency Contact Name', 'emergency_contact_phone': 'Emergency Contact Phone',
                    'parent_first_name': 'Parent First Name', 'parent_last_name': 'Parent Last Name', 'parent_phone': 'Parent Phone'
                }
                for field, column in optional_fields.items():
                    if column in row and not pd.isna(row[column]):
                        student_data[field] = str(row[column]).strip()
                
                if 'Date of Birth' in row and not pd.isna(row['Date of Birth']):
                    student_data['date_of_birth'] = pd.to_datetime(row['Date of Birth']).date()
                # --- End Data Preparation ---

                # Final Import: Validate and Save
                serializer = UserRegisterSerializer(data=student_data)
                if serializer.is_valid():
                    try:
                        student = serializer.save()
                        generated_emails_in_batch.add(student.email) # Add final email to set
                        results['successful_imports'] += 1
                        results['created_students'].append({
                            'id': student.id, 
                            'email': student.email, 
                            'full_name': student.full_name, 
                            'row_number': row_number
                        })
                        
                        # Track parent creation for results
                        if student_data.get('parent_first_name') and student.parent:
                            # Check if this parent was already tracked in this batch
                            parent_already_tracked = any(
                                p['id'] == student.parent.id 
                                for p in results['created_parents']
                            )
                            if not parent_already_tracked:
                                results['created_parents'].append({
                                    'id': student.parent.id, 
                                    'email': student.parent.email, 
                                    'full_name': student.parent.full_name,
                                    'children_count': student.parent.children.count()
                                })

                    except Exception as save_error:
                        results['errors'].append({'row': row_number, 'error': f"Save Error: {save_error}"})
                else:
                    results['errors'].append({'row': row_number, 'error': f"Validation failed: {serializer.errors}"})
                                
            except Exception as e:
                results['errors'].append({'row': index + 2, 'error': str(e)})
        
        # Update job statistics
        job.successful_records = results['successful_imports']
        job.failed_records = len(results['errors'])
        job.processed_records = results['processed_rows']
        job.save()
        
        job.update_progress(100, f"Import completed: {results['successful_imports']} students created")
        
        return results


class BulkImportStatusView(APIView):
    """
    View to check bulk import status and get available IDs for template
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get available IDs for educational levels, grades, classes, academic years"""
        from schools.models import EducationalLevel, Grade, SchoolClass, AcademicYear
        
        try:
            # Get educational levels with their grades
            levels_data = []
            for level in EducationalLevel.objects.prefetch_related('grades').all():
                level_info = {
                    'id': level.id,
                    'name': level.name,
                    'grades': [{'id': g.id, 'name': g.name} for g in level.grades.all()]
                }
                levels_data.append(level_info)
            
            # Get current academic year
            current_year = AcademicYear.objects.filter(is_current=True).first()
            
            # Get all academic years
            academic_years = [
                {'id': ay.id, 'year': ay.year, 'is_current': ay.is_current}
                for ay in AcademicYear.objects.all().order_by('-year')
            ]
            
            # Get sample classes (limited to 10 for template reference)
            sample_classes = [
                {'id': sc.id, 'name': sc.name, 'grade_id': sc.grade_id}
                for sc in SchoolClass.objects.select_related('grade').all()[:10]
            ]
            
            return Response({
                'educational_levels': levels_data,
                'academic_years': academic_years,
                'current_academic_year': {
                    'id': current_year.id,
                    'year': current_year.year
                } if current_year else None,
                'sample_classes': sample_classes,
                'instructions': [
                    'Use the IDs from educational_levels and their grades',
                    'Class ID must match the selected grade',
                    f'Current academic year ID is: {current_year.id if current_year else "Not set"}',
                    'Contact administrator if you need specific class IDs'
                ]
            })
            
        except Exception as e:
            return Response(
                {'error': f'Failed to get import info: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class BulkImportProgressView(APIView):
    """
    View to check the progress of a bulk import job
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, job_id):
        """Get progress status of a bulk import job"""
        try:
            # Find the job
            job = BulkImportJob.objects.get(job_id=job_id, created_by=request.user)
            
            response_data = {
                'job_id': str(job.job_id),
                'status': job.status,
                'progress': job.progress,
                'current_status': job.current_status or 'Processing...',
                'total_records': job.total_records,
                'processed_records': job.processed_records,
                'successful_records': job.successful_records,
                'failed_records': job.failed_records,
                'completed': job.is_completed,
                'created_at': job.created_at,
                'started_at': job.started_at,
                'completed_at': job.completed_at,
            }
            
            # Include error message if job failed
            if job.status == BulkImportJob.Status.FAILED:
                response_data['error'] = job.error_message
            
            # Include results if job completed successfully
            if job.status == BulkImportJob.Status.COMPLETED and job.results:
                response_data['results'] = job.results
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except BulkImportJob.DoesNotExist:
            return Response(
                {'error': 'Import job not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to get job status: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
