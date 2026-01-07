# Madrasti 2.0 - Enhanced API Documentation

## Overview

This comprehensive documentation provides detailed information about the Madrasti 2.0 backend API endpoints, specifically designed for frontend development integration. The API follows RESTful conventions using Django Rest Framework with JWT authentication and comprehensive role-based permissions.

**Base URL (Development):** `http://localhost:8000/api/`  
**Base URL (Production):** `https://api.madrasti.ma/api/`  
**API Version:** v1.0  
**Authentication:** JWT Bearer Token  

> **📋 IMPLEMENTATION STATUS**: This documentation covers both implemented and planned features. Features marked with ⚠️ may be partially implemented or planned for future releases. Always verify endpoint availability during development.     

---

## Table of Contents

1. [Authentication](#authentication)
2. [Role-Based Permissions](#role-based-permissions)
3. [Users Module](#users-module)
4. [Schools Module](#schools-module)
5. [Lessons Module](#lessons-module)
6. [Homework Module](#homework-module)
7. [Attendance Module](#attendance-module)
8. [Real-time Features](#real-time-features)
9. [File Upload System](#file-upload-system)
10. [Error Handling](#error-handling)
11. [Common Patterns](#common-patterns)

---

## Authentication

The API uses JWT (JSON Web Token) for stateless authentication. All protected endpoints require a valid token in the Authorization header.

### Authentication Flow

#### 1. User Login
```http
POST /api/users/login/
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "teacher@madrasti.ma",      // required, valid email
  "password": "securePassword123"      // required, min 8 chars
}
```

**Success Response (200):**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "teacher@madrasti.ma",
    "full_name": "Ahmed Benali",
    "role": "TEACHER",
    "permissions": ["can_manage_attendance", "can_create_homework", "can_create_exercises"]
  }
}
```

**Error Response (400):**
```json
{
  "error": "Invalid credentials",
  "error_code": "INVALID_CREDENTIALS",
  "details": {
    "email": ["User with this email does not exist"],
    "password": ["Incorrect password"]
  }
}
```

#### 2. Token Refresh
```http
POST /api/token/refresh/
Content-Type: application/json
```

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Success Response (200):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### 3. Token Verification
```http
POST /api/token/verify/
Content-Type: application/json
```

### Authorization Header Format
```http
Authorization: Bearer <access_token>
```

### Token Expiration
- **Access Token:** 15 minutes
- **Refresh Token:** 7 days
- **Automatic refresh:** Frontend should implement automatic token refresh

---

## Role-Based Permissions

### User Roles
- **ADMIN** - System administrator with full access
- **TEACHER** - Classroom teacher with class management rights
- **STUDENT** - Student with limited access to own data
- **PARENT** - Parent with access to children's data
- **STAFF** - School staff with administrative duties
- **DRIVER** - Bus driver with transportation-related access

### Permission Matrix

| Resource | Action | Admin | Teacher | Student | Parent | Staff | Driver |
|----------|---------|-------|---------|---------|---------|-------|---------|
| **Users** |
| | List All | ✅ | Own Classes | Own Only | Children Only | ✅ | ❌ |
| | Create | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| | Update Profile | ✅ | Own Only | Own Only | Own Only | Own Only | Own Only |
| | Delete | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Schools** |
| | Manage Config | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| | View Structure | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Homework** |
| | Create | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| | View | ✅ | Own/Classes | Assigned | Children's | ✅ | ❌ |
| | Submit | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| | Grade | ✅ | Own Only | ❌ | ❌ | ❌ | ❌ |
| **Exercises** |
| | Create | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| | Attempt | ✅ | ✅ | ✅ | View Only | ✅ | ❌ |
| | View Progress | ✅ | Class Students | Own Only | Children Only | ✅ | ❌ |
| | Manage Rewards | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Attendance** |
| | Mark | ✅ | Session Teacher | ❌ | ❌ | ✅ | ❌ |
| | View Records | ✅ | Class Students | Own Only | Children Only | ✅ | ❌ |
| | Clear Flags | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |

---

## Users Module

Comprehensive user management with role-based functionality and profile customization.

### User Model Fields

```json
{
  "id": "integer",                    // Auto-generated primary key
  "email": "string",                  // required, unique, valid email format
  "first_name": "string",             // required, 1-50 chars
  "last_name": "string",              // required, 1-50 chars
  "full_name": "string",              // read-only, computed field
  "role": "enum",                     // required, see roles above
  "phone": "string",                  // optional, international format
  "date_of_birth": "date",            // optional, YYYY-MM-DD
  "address": "text",                  // optional, max 500 chars
  "profile_picture": "string",        // optional, Cloudinary public_id
  "profile_picture_url": "string",    // read-only, full Cloudinary URL
  "bio": "text",                      // optional, max 1000 chars
  "emergency_contact_name": "string", // optional, 1-100 chars
  "emergency_contact_phone": "string", // optional, phone format
  "is_active": "boolean",             // default: true
  "last_login": "datetime",           // read-only, auto-updated
  "created_at": "datetime",           // read-only, auto-generated
  "updated_at": "datetime"            // read-only, auto-updated
}
```

### Endpoints

#### 1. User Registration
```http
POST /api/users/register/
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "student@example.com",     // required, unique
  "password": "securePass123",        // required, min 8 chars
  "password_confirm": "securePass123", // required, must match
  "first_name": "Sara",               // required
  "last_name": "Alami",              // required
  "role": "STUDENT",                 // required
  "phone": "+212612345678",          // optional
  "date_of_birth": "2008-05-15"      // optional for students
}
```

**Validation Rules:**
- Email: Must be valid format and unique
- Password: Minimum 8 characters, contain letters and numbers
- Role: Must be valid role enum value
- Phone: International format if provided
- Date of birth: Cannot be future date

**Success Response (201):**
```json
{
  "id": 25,
  "email": "student@example.com",
  "first_name": "Sara",
  "last_name": "Alami",
  "full_name": "Sara Alami",
  "role": "STUDENT",
  "phone": "+212612345678",
  "date_of_birth": "2008-05-15",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### 2. User Profile Management
```http
GET /api/users/profile/
PUT /api/users/profile/
PATCH /api/users/profile/
```
**Authentication Required:** Yes

**GET Response (200):**
```json
{
  "id": 25,
  "email": "student@example.com",
  "first_name": "Sara",
  "last_name": "Alami", 
  "full_name": "Sara Alami",
  "role": "STUDENT",
  "phone": "+212612345678",
  "date_of_birth": "2008-05-15",
  "address": "123 Rue Mohammed V, Casablanca",
  "profile_picture": "profiles/student25_2024",
  "profile_picture_url": "https://res.cloudinary.com/madrasti/image/upload/v1642234567/profiles/student25_2024.jpg",
  "bio": "Passionate about mathematics and science",
  "emergency_contact_name": "Fatima Alami",
  "emergency_contact_phone": "+212611111111",
  "is_active": true,
  "last_login": "2024-01-15T09:15:00Z",
  "created_at": "2024-01-01T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

#### 3. Password Change
```http
POST /api/users/change-password/
Content-Type: application/json
```

**Request Body:**
```json
{
  "current_password": "oldPassword123",
  "new_password": "newSecurePass456",
  "new_password_confirm": "newSecurePass456"
}
```

#### 4. Password Reset Request
```http
POST /api/users/password-reset/
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### 5. Student Enrollments
```http
GET /api/users/enrollments/
POST /api/users/enrollments/
GET /api/users/enrollments/{id}/
PUT /api/users/enrollments/{id}/
DELETE /api/users/enrollments/{id}/
```
**Authentication Required:** Teacher/Admin

**Student Enrollment Fields:**
```json
{
  "id": "integer",
  "student": "integer",               // required, FK to User (STUDENT)
  "student_name": "string",           // read-only
  "school_class": "integer",          // required, FK to SchoolClass
  "school_class_name": "string",      // read-only
  "academic_year": "integer",         // required, FK to AcademicYear
  "academic_year_name": "string",     // read-only, "2024-2025"
  "enrollment_date": "date",          // required, enrollment date
  "is_active": "boolean",            // default: true
  "student_number": "string",         // optional, unique student ID
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**Query Parameters:**
- `student=25` - Filter by student ID
- `school_class=5` - Filter by class ID
- `academic_year=1` - Filter by academic year
- `is_active=true` - Active enrollments only
- `ordering=-created_at` - Order results

**Create Student with Enrollment Flow:**
```javascript
// Step 1: Create the student user
const studentResponse = await fetch('/api/users/register/', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    email: 'student@example.com',
    password: 'password123',
    first_name: 'Ahmed',
    last_name: 'Benali',
    role: 'STUDENT',
    phone: '+212612345678'
  })
});
const student = await studentResponse.json();

// Step 2: Enroll student in class
const enrollmentResponse = await fetch('/api/users/enrollments/', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    student: student.id,
    school_class: 5,
    academic_year: 1,
    student_number: 'ST2024001',
    enrollment_date: '2024-09-01'
  })
});
```

---

## Schools Module

Complete school structure management with academic organization and facility administration.

### School Configuration

#### 1. School Settings
```http
GET /api/schools/config/
PUT /api/schools/config/
PATCH /api/schools/config/
```
**Authentication:** Admin/Staff required

**School Config Fields:**
```json
{
  "id": "integer",
  "name": "string",                   // required, 1-200 chars
  "name_arabic": "string",            // optional, Arabic name
  "name_french": "string",            // optional, French name
  "phone": "string",                  // required, phone format
  "email": "string",                  // required, email format
  "website": "string",                // optional, URL format
  "logo": "string",                   // optional, Cloudinary public_id
  "logo_url": "string",               // read-only, full URL
  "address": "text",                  // required, full address
  "city": "string",                   // required, 1-100 chars
  "region": "string",                 // required, 1-100 chars
  "postal_code": "string",            // optional, postal code format
  "current_academic_year": "integer", // FK to AcademicYear
  "director": "integer",              // FK to User (role=ADMIN)
  "founded_date": "date",             // optional
  "student_capacity": "integer",      // optional, positive integer
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Academic Structure

#### 1. Academic Years

> **⚠️ NOTE**: Academic year management may be handled through the admin interface. API endpoints for academic years may not be fully implemented yet.

```http
GET /api/schools/academic-years/      # May not be implemented
POST /api/schools/academic-years/     # May not be implemented  
GET /api/schools/academic-years/{id}/ # May not be implemented
PUT /api/schools/academic-years/{id}/ # May not be implemented
DELETE /api/schools/academic-years/{id}/ # May not be implemented
```

**Academic Year Fields:**
```json
{
  "id": "integer",
  "year": "string",                   // required, format: "2024-2025"
  "start_date": "date",              // required, academic year start
  "end_date": "date",                // required, must be after start_date
  "is_current": "boolean",           // default: false, only one can be true
  "registration_start": "date",       // optional, enrollment period
  "registration_end": "date",         // optional
  "is_active": "boolean",            // default: true
  "description": "text"              // optional
}
```

**Query Parameters:**
- `is_current=true` - Get current academic year only
- `is_active=true` - Get active academic years only
- `ordering=start_date,-start_date` - Order by start date

#### 2. Educational Levels
```http
GET /api/schools/levels/
POST /api/schools/levels/
GET /api/schools/levels/{id}/
PUT /api/schools/levels/{id}/
DELETE /api/schools/levels/{id}/
```

**Educational Level Fields:**
```json
{
  "id": "integer",
  "name": "string",                   // required, "Primaire", "Collège", etc.
  "name_arabic": "string",            // optional, Arabic equivalent
  "name_french": "string",            // optional, French equivalent  
  "level": "enum",                    // required: PRIMARY|MIDDLE|HIGH
  "order": "integer",                 // required, display order (1, 2, 3...)
  "description": "text",              // optional
  "min_age": "integer",              // optional, minimum student age
  "max_age": "integer",              // optional, maximum student age
  "is_active": "boolean",            // default: true
  "grades_count": "integer",         // read-only, count of associated grades
  "grades": "array"                  // nested grades when detailed=true
}
```

**Level Enum Values:**
- `PRIMARY` - التعليم الابتدائي - Enseignement Primaire
- `MIDDLE` - التعليم الإعدادي - Enseignement Collégial  
- `HIGH` - التعليم الثانوي - Enseignement Secondaire

**Query Parameters:**
- `level=PRIMARY` - Filter by education level
- `is_active=true` - Active levels only
- `detailed=true` - Include nested grades
- `ordering=order,-order` - Order by display order

#### 3. Grades
```http
GET /api/schools/grades/
POST /api/schools/grades/
GET /api/schools/grades/{id}/
PUT /api/schools/grades/{id}/
DELETE /api/schools/grades/{id}/
```

**Grade Fields:**
```json
{
  "id": "integer",
  "name": "string",                   // required, "1ère Année Primaire"
  "name_arabic": "string",            // optional, Arabic name
  "name_french": "string",            // optional, French name
  "grade_number": "integer",          // required, 1-12 typically
  "educational_level": "integer",     // required, FK to EducationalLevel
  "educational_level_name": "string", // read-only, level name
  "description": "text",              // optional
  "is_active": "boolean",            // default: true
  "classes_count": "integer",        // read-only, count of classes
  "students_count": "integer",       // read-only, total enrolled students
  "subjects": "array"                // available subjects for this grade
}
```

**Query Parameters:**
- `educational_level=1` - Filter by educational level
- `grade_number=1` - Filter by grade number
- `is_active=true` - Active grades only
- `has_classes=true` - Grades with classes only
- `search=primaire` - Search in names
- `ordering=grade_number,-grade_number`

#### 4. Classes
```http
GET /api/schools/classes/
POST /api/schools/classes/
GET /api/schools/classes/{id}/
PUT /api/schools/classes/{id}/
DELETE /api/schools/classes/{id}/
```

**Class Fields:**
```json
{
  "id": "integer",
  "name": "string",                   // auto-generated: "{grade} - {section}"
  "section": "string",                // required, "A", "B", "C", etc.
  "grade": "integer",                 // required, FK to Grade
  "grade_name": "string",             // read-only, grade display name
  "academic_year": "integer",         // required, FK to AcademicYear
  "academic_year_display": "string",  // read-only, "2024-2025"
  "class_teacher": "integer",         // optional, FK to User (TEACHER)
  "class_teacher_name": "string",     // read-only, teacher full name
  "room": "integer",                  // optional, FK to Room
  "room_name": "string",              // read-only, room identifier
  "max_students": "integer",          // optional, capacity limit
  "current_students": "integer",      // read-only, enrolled count
  "is_active": "boolean",            // default: true
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**Custom Actions:**
```http
GET /api/schools/classes/{id}/students/     # Get enrolled students
POST /api/schools/classes/{id}/enroll/      # Enroll student
DELETE /api/schools/classes/{id}/unenroll/  # Remove student enrollment
```

**Query Parameters:**
- `grade=1` - Filter by grade
- `academic_year=1` - Filter by academic year
- `class_teacher=5` - Filter by teacher
- `section=A` - Filter by section
- `has_teacher=true` - Classes with assigned teachers
- `search=1A` - Search in class names
- `ordering=grade__grade_number,section`

#### 5. Subjects
```http
GET /api/schools/subjects/
POST /api/schools/subjects/
GET /api/schools/subjects/{id}/
PUT /api/schools/subjects/{id}/
DELETE /api/schools/subjects/{id}/
```

**Subject Fields:**
```json
{
  "id": "integer",
  "name": "string",                   // required, "Mathématiques"
  "name_arabic": "string",            // optional, "الرياضيات"
  "name_french": "string",            // optional, "Mathématiques"
  "code": "string",                   // required, unique, "MATH", "FR", etc.
  "description": "text",              // optional
  "color": "string",                  // optional, hex color for UI
  "icon": "string",                   // optional, icon identifier
  "is_active": "boolean",            // default: true
  "grade_subjects": "array"          // grades where this subject is taught
}
```

#### 6. Rooms
```http
GET /api/schools/rooms/
POST /api/schools/rooms/
GET /api/schools/rooms/{id}/
PUT /api/schools/rooms/{id}/
DELETE /api/schools/rooms/{id}/
```

**Room Fields:**
```json
{
  "id": "integer",
  "name": "string",                   // required, "Salle 101"
  "room_number": "string",            // required, "101", "A-201"
  "building": "string",               // optional, building identifier
  "floor": "integer",                 // optional, floor number
  "capacity": "integer",              // optional, student capacity
  "room_type": "enum",               // required, see below
  "equipment": "array",              // optional, equipment list
  "is_available": "boolean",         // default: true
  "notes": "text"                    // optional, additional notes
}
```

**Room Types:**
- `CLASSROOM` - قاعة دراسية - Salle de classe
- `LAB` - مختبر - Laboratoire
- `LIBRARY` - مكتبة - Bibliothèque
- `GYM` - قاعة رياضة - Gymnase
- `COMPUTER` - مختبر حاسوب - Salle informatique
- `ART` - قاعة فنون - Salle d'art
- `MUSIC` - قاعة موسيقى - Salle de musique
- `OTHER` - أخرى - Autre

---

## Lessons Module

Comprehensive lesson management with multimedia resources and curriculum organization.

### Lesson Model Fields

```json
{
  "id": "integer",
  "title": "string",                  // required, 1-200 chars
  "title_arabic": "string",           // optional, Arabic title
  "title_french": "string",           // optional, French title
  "description": "text",              // optional, lesson overview
  "content": "text",                  // required, lesson content (HTML supported)
  "cycle": "enum",                    // required: first|second
  "order": "integer",                 // required, lesson sequence number
  "objectives": "text",               // optional, learning objectives
  "prerequisites": "text",            // optional, required prior knowledge
  "difficulty_level": "enum",         // required: easy|medium|hard
  "estimated_duration": "integer",    // optional, minutes
  "subject": "integer",               // required, FK to Subject
  "subject_name": "string",           // read-only
  "grade": "integer",                 // required, FK to Grade
  "grade_name": "string",             // read-only
  "tags": "array",                    // optional, lesson tags
  "is_active": "boolean",            // default: true
  "is_published": "boolean",         // default: false
  "view_count": "integer",           // read-only, tracking
  "created_by": "integer",           // read-only, FK to User
  "created_by_name": "string",       // read-only
  "created_at": "datetime",
  "updated_at": "datetime",
  "resources_count": "integer",      // read-only, attached resources
  "resources": "array"               // nested resources when detailed=true
}
```

### Endpoints

#### 1. Lessons Management
```http
GET /api/lessons/lessons/
POST /api/lessons/lessons/
GET /api/lessons/lessons/{id}/
PUT /api/lessons/lessons/{id}/
PATCH /api/lessons/lessons/{id}/
DELETE /api/lessons/lessons/{id}/
```

**Query Parameters:**
- `subject=1` - Filter by subject
- `grade=1` - Filter by grade  
- `cycle=first` - Filter by cycle
- `difficulty_level=easy` - Filter by difficulty
- `is_published=true` - Published lessons only
- `created_by=5` - Filter by creator
- `tags=mathematics,algebra` - Filter by tags (comma-separated)
- `search=introduction` - Search in title, description
- `ordering=-created_at,order` - Order results

**Custom Actions:**
```http
POST /api/lessons/lessons/{id}/publish/     # Publish lesson
POST /api/lessons/lessons/{id}/unpublish/   # Unpublish lesson
POST /api/lessons/lessons/{id}/duplicate/   # Create copy
GET /api/lessons/lessons/{id}/analytics/    # View statistics
```

**Publish Lesson:**
```json
// Request
{}

// Response
{
  "id": 15,
  "is_published": true,
  "published_at": "2024-01-15T14:30:00Z",
  "message": "Lesson published successfully"
}
```

#### 2. Lesson Resources
```http
GET /api/lessons/lessons/{lesson_id}/resources/
POST /api/lessons/lessons/{lesson_id}/resources/
GET /api/lessons/lessons/{lesson_id}/resources/{id}/
PUT /api/lessons/lessons/{lesson_id}/resources/{id}/
PATCH /api/lessons/lessons/{lesson_id}/resources/{id}/
DELETE /api/lessons/lessons/{lesson_id}/resources/{id}/
```

**Note**: Resources are nested under lessons using nested routing. Replace `{lesson_id}` with the actual lesson ID.

**Resource Fields:**
```json
{
  "id": "integer",
  "lesson": "integer",               // required, FK to Lesson
  "title": "string",                 // required, resource title
  "description": "text",             // optional
  "resource_type": "enum",           // required, see below
  "file": "string",                  // Cloudinary public_id for files
  "file_url": "string",              // read-only, full Cloudinary URL
  "external_url": "string",          // for links and videos
  "content": "text",                 // for text resources
  "order": "integer",                // display order within lesson
  "is_downloadable": "boolean",      // default: true for files
  "file_size": "integer",            // read-only, bytes
  "mime_type": "string",             // read-only, file type
  "created_at": "datetime"
}
```

**Resource Types:**
- `PDF` - PDF document
- `IMAGE` - Image file  
- `VIDEO` - Video file
- `AUDIO` - Audio file
- `DOCUMENT` - Word/text document
- `PRESENTATION` - PowerPoint/slides
- `LINK` - External URL
- `TEXT` - Text content

#### 3. Lesson Tags
```http
GET /api/lessons/tags/
POST /api/lessons/tags/
GET /api/lessons/tags/{id}/
PUT /api/lessons/tags/{id}/
DELETE /api/lessons/tags/{id}/
```

#### 4. Helper Endpoints

**Get available grades for a subject:**
```http
GET /api/lessons/subjects/{subject_id}/grades/
```

**Get available subjects for a grade:**
```http
GET /api/lessons/grades/{grade_id}/subjects/
```

**Lesson Analytics:**
```http
GET /api/lessons/lessons/{id}/analytics/
```

**Response:**
```json
{
  "lesson_id": 15,
  "view_count": 142,
  "unique_viewers": 87,
  "completion_rate": 76.5,
  "average_time_spent": 1847, // seconds
  "weekly_views": [12, 18, 25, 31, 28, 19, 9],
  "top_viewers": [
    {"student_name": "Ahmed Ali", "view_count": 5},
    {"student_name": "Fatima Said", "view_count": 4}
  ]
}
```

---

## Homework Module

Comprehensive homework system with auto-grading, gamification, and detailed analytics.

### Homework & Exercise System

#### 1. Homework
```http
GET /api/homework/homework/
POST /api/homework/homework/
GET /api/homework/homework/{id}/
PUT /api/homework/homework/{id}/
PATCH /api/homework/homework/{id}/
DELETE /api/homework/homework/{id}/
```

**Homework Fields:**
```json
{
  "id": "integer",
  "title": "string",                  // required, 1-200 chars
  "title_arabic": "string",           // optional, Arabic title
  "title_french": "string",           // optional, French title
  "description": "text",              // optional, max 1000 chars
  "instructions": "text",             // optional, student instructions
  "homework_type": "enum",          // required: QCM|BOOK|OPEN|MIXED
  "subject": "integer",               // required, FK to Subject
  "subject_name": "string",           // read-only
  "grade": "integer",                 // required, FK to Grade  
  "grade_name": "string",             // read-only
  "classes": "array",                 // required, FK array to Class
  "class_names": "array",             // read-only, class display names
  "due_date": "datetime",             // required, ISO format
  "time_limit": "integer",            // optional, minutes (5-300)
  "max_attempts": "integer",          // default: 1, range: 1-10
  "passing_score": "float",           // optional, percentage (0-100)
  "is_published": "boolean",          // default: false
  "show_correct_answers": "boolean",  // default: true
  "show_score_immediately": "boolean", // default: true
  "shuffle_questions": "boolean",     // default: false
  "allow_late_submission": "boolean", // default: false
  "late_penalty": "float",            // optional, percentage penalty
  "auto_grade": "boolean",            // read-only, based on question types
  "total_points": "float",            // read-only, sum of question points
  "created_by": "integer",            // read-only, FK to User
  "created_by_name": "string",        // read-only
  "created_at": "datetime",
  "updated_at": "datetime",
  "questions_count": "integer",       // read-only
  "submissions_count": "integer",     // read-only
  "completion_rate": "float",         // read-only, percentage
  "average_score": "float"            // read-only, percentage
}
```

**Assignment Types:**
- `QCM` - Multiple Choice Questions only
- `BOOK` - Textbook exercises only  
- `OPEN` - Open-ended questions only
- `MIXED` - Combination of question types

**Query Parameters:**
```http
GET /api/homework/homework/?
  status=published&                    # draft|published|archived
  homework_type=QCM&                 # QCM|BOOK|OPEN|MIXED
  subject=1&                           # subject ID
  grade=2&                            # grade ID
  classes=1,2,3&                      # comma-separated class IDs
  created_by=5&                       # teacher ID
  due_date__gte=2024-01-01&           # homework due after date
  due_date__lte=2024-12-31&           # homework due before date
  is_published=true&                  # published homework only
  search=mathematics&                 # search in title, description
  ordering=-due_date&                 # order by due date desc
  page=1&                            # page number
  page_size=20                       # items per page (max 100)
```

**Custom Actions:**
```http
POST /api/homework/homework/{id}/publish/     # Publish homework
POST /api/homework/homework/{id}/unpublish/   # Unpublish homework
POST /api/homework/homework/{id}/duplicate/   # Create duplicate
GET /api/homework/homework/{id}/analytics/    # Detailed analytics
GET /api/homework/homework/{id}/submissions/ # List all submissions
POST /api/homework/homework/{id}/bulk_grade/ # Grade multiple submissions
```

**Homework Analytics:**
```json
{
  "homework_id": 25,
  "total_students": 30,
  "submitted_count": 28,
  "completion_rate": 93.3,
  "average_score": 78.5,
  "median_score": 80.0,
  "highest_score": 95.0,
  "lowest_score": 45.0,
  "perfect_scores": 4,
  "failing_scores": 3, // below passing_score
  "submission_timeline": [
    {"date": "2024-01-15", "count": 12},
    {"date": "2024-01-16", "count": 16}
  ],
  "question_analytics": [
    {
      "question_id": 1,
      "correct_rate": 85.7,
      "most_common_mistake": "Selected option B instead of C"
    }
  ],
  "time_statistics": {
    "average_time": 1247, // seconds
    "median_time": 1180,
    "fastest_completion": 567,
    "slowest_completion": 2340
  }
}
```

#### 2. Questions Management
```http
GET /api/homework/questions/
POST /api/homework/questions/
GET /api/homework/questions/{id}/
PUT /api/homework/questions/{id}/
PATCH /api/homework/questions/{id}/
DELETE /api/homework/questions/{id}/
```

**Question Fields:**
```json
{
  "id": "integer",
  "homework": "integer",            // required, FK to Homework
  "question_type": "enum",            // required, see types below
  "question_text": "text",           // required, the question
  "question_text_arabic": "text",    // optional, Arabic version
  "question_text_french": "text",    // optional, French version
  "points": "float",                  // required, positive number
  "order": "integer",                 // required, question sequence
  "explanation": "text",              // optional, answer explanation
  "is_required": "boolean",          // default: true
  "image": "string",                 // optional, Cloudinary public_id
  "image_url": "string",             // read-only, full image URL
  
  // QCM-specific fields
  "choices": "array",                // for QCM questions
  "correct_choices": "array",        // correct choice IDs
  "allow_multiple": "boolean",       // multiple correct answers
  
  // Fill-in-blank specific
  "blank_positions": "array",        // positions of blanks in text
  "correct_answers": "array",        // acceptable answers for blanks
  "case_sensitive": "boolean",       // default: false
  
  // Matching specific
  "left_items": "array",             // items to match from
  "right_items": "array",            // items to match to
  "correct_pairs": "array",          // correct matching pairs
  
  // Ordering specific
  "items_to_order": "array",         // items to be ordered
  "correct_order": "array",          // correct sequence
  
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**Question Types:**
- `QCM_SINGLE` - Single choice multiple choice
- `QCM_MULTIPLE` - Multiple choice with multiple correct answers
- `TRUE_FALSE` - True/False questions
- `FILL_BLANK` - Fill in the blanks
- `OPEN_SHORT` - Short text response (≤200 chars)
- `OPEN_LONG` - Long text response (≤2000 chars)
- `MATCHING` - Match items between two lists
- `ORDERING` - Arrange items in correct order

**Bulk Question Creation:**
```http
POST /api/homework/questions/bulk_create/
```

**Request:**
```json
{
  "homework": 25,
  "questions": [
    {
      "question_type": "QCM_SINGLE",
      "question_text": "What is 2 + 2?",
      "points": 5.0,
      "order": 1,
      "choices": [
        {"text": "3", "is_correct": false},
        {"text": "4", "is_correct": true},
        {"text": "5", "is_correct": false}
      ]
    }
  ]
}
```

#### 3. Submission System
```http
GET /api/homework/submissions/
POST /api/homework/submissions/
GET /api/homework/submissions/{id}/
PUT /api/homework/submissions/{id}/
PATCH /api/homework/submissions/{id}/
```

**Submission Fields:**
```json
{
  "id": "integer",
  "homework": "integer",            // required, FK to Homework
  "homework_title": "string",       // read-only
  "student": "integer",               // required, FK to User (STUDENT)
  "student_name": "string",           // read-only
  "submitted_at": "datetime",         // auto-set on submission
  "is_late": "boolean",              // read-only, after due_date
  "attempt_number": "integer",        // auto-incremented
  "time_taken": "integer",           // seconds spent
  "status": "enum",                  // draft|submitted|graded
  "score": "float",                  // auto-calculated for QCM
  "score_percentage": "float",       // read-only, score/total_points * 100
  "manual_score": "float",           // teacher override
  "feedback": "text",                // teacher feedback
  "auto_graded": "boolean",          // read-only
  "graded_by": "integer",            // FK to User (teacher)
  "graded_at": "datetime",           // when manually graded
  "answers": "array",                // nested answers
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**Submission Status:**
- `DRAFT` - Student is working on it
- `SUBMITTED` - Student has submitted
- `GRADED` - Teacher has graded (if manual grading required)

**Submit Assignment:**
```http
POST /api/homework/submissions/{id}/submit/
```

**Auto-Grading Response:**
```json
{
  "submission_id": 123,
  "status": "submitted",
  "score": 85.0,
  "score_percentage": 85.0,
  "auto_graded": true,
  "correct_answers": 17,
  "total_questions": 20,
  "points_earned": 85.0,
  "total_points": 100.0,
  "time_taken": 1247,
  "rewards_earned": {
    "base_points": 50,
    "score_bonus": 42.5, // 85% of max bonus (50)
    "time_bonus": 5,     // submitted early
    "total_points": 97.5,
    "badges_earned": ["Quick Solver"]
  }
}
```

### Reward System

#### 1. Student Wallet
```http
GET /api/homework/student-wallets/
GET /api/homework/student-wallets/{id}/
PATCH /api/homework/student-wallets/{id}/
```

**Student Wallet Fields:**
```json
{
  "id": "integer",
  "student": "integer",               // FK to User (STUDENT)
  "student_name": "string",           // read-only
  "total_points": "integer",          // accumulated points
  "total_coins": "integer",           // accumulated coins
  "points_spent": "integer",          // points used for rewards
  "coins_spent": "integer",           // coins used for rewards
  "available_points": "integer",      // read-only, total - spent
  "available_coins": "integer",       // read-only, total - spent
  "level": "integer",                // calculated level
  "level_progress": "float",         // progress to next level (0-100)
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### 2. Reward Transactions
```http
GET /api/homework/reward-transactions/
POST /api/homework/reward-transactions/
```

**Transaction Fields:**
```json
{
  "id": "integer",
  "student": "integer",               // FK to User (STUDENT)
  "transaction_type": "enum",         // EARNED|SPENT|BONUS|PENALTY
  "reason": "enum",                   // see reasons below
  "points": "integer",                // points changed (can be negative)
  "coins": "integer",                 // coins changed (can be negative)
  "reference_id": "integer",          // FK to related object (homework, etc.)
  "reference_type": "string",         // model name
  "description": "text",              // human-readable description
  "created_at": "datetime"
}
```

**Transaction Reasons:**
- `HOMEWORK_COMPLETION` - Completed homework
- `PERFECT_SCORE` - Got 100% on homework
- `EARLY_SUBMISSION` - Submitted before deadline
- `ON_TIME_SUBMISSION` - Submitted on time
- `STREAK_BONUS` - Consecutive completions
- `BADGE_EARNED` - New badge achievement
- `MANUAL_ADJUSTMENT` - Teacher/admin adjustment

#### 3. Badge System
```http
GET /api/homework/badges/
POST /api/homework/badges/
GET /api/homework/badges/{id}/
```

**Badge Fields:**
```json
{
  "id": "integer",
  "name": "string",                   // required, "Math Champion"
  "name_arabic": "string",            // optional, Arabic name
  "name_french": "string",            // optional, French name  
  "description": "text",              // badge description
  "icon": "string",                   // badge icon identifier
  "color": "string",                  // hex color code
  "rarity": "enum",                  // COMMON|RARE|EPIC|LEGENDARY
  "points_reward": "integer",         // points awarded when earned
  "requirements": "json",             // badge earning criteria
  "is_active": "boolean",            // can be earned
  "total_earned": "integer",         // read-only, how many students have it
  "created_at": "datetime"
}
```

**Badge Requirements Examples:**
```json
{
  "math_champion": {
    "subject": "MATH",
    "homework_completed": 10,
    "average_score__gte": 85
  },
  "perfect_streak": {
    "consecutive_perfect_scores": 5
  },
  "early_bird": {
    "early_submissions": 20
  }
}
```

#### 4. Leaderboards
```http
GET /api/homework/leaderboards/
GET /api/homework/leaderboards/{id}/
```

**Leaderboard Types:**
- `WEEKLY` - Weekly rankings
- `MONTHLY` - Monthly rankings  
- `SEMESTER` - Semester rankings
- `CLASS` - Class-specific rankings
- `GRADE` - Grade-level rankings
- `SUBJECT` - Subject-specific rankings

**Leaderboard Response:**
```json
{
  "id": 1,
  "leaderboard_type": "WEEKLY",
  "period_start": "2024-01-15",
  "period_end": "2024-01-21", 
  "class": 1, // optional, for class leaderboards
  "grade": null, // optional, for grade leaderboards
  "subject": null, // optional, for subject leaderboards
  "entries": [
    {
      "rank": 1,
      "student_name": "Sara Alami",
      "student_id": 25,
      "total_points": 450,
      "homework_completed": 8,
      "average_score": 92.5,
      "badges_count": 5,
      "rank_change": 2 // moved up 2 positions
    }
  ]
}
```

---

## Attendance Module

Comprehensive attendance tracking with session management, parent notifications, and detailed reporting.

### Timetable System

#### 1. School Timetables
```http
GET /api/attendance/timetables/
POST /api/attendance/timetables/
GET /api/attendance/timetables/{id}/
PUT /api/attendance/timetables/{id}/
DELETE /api/attendance/timetables/{id}/
```

**Timetable Fields:**
```json
{
  "id": "integer",
  "class": "integer",                 // required, FK to Class
  "class_name": "string",             // read-only
  "academic_year": "integer",         // required, FK to AcademicYear
  "academic_year_display": "string",  // read-only
  "effective_from": "date",           // when timetable becomes active
  "effective_to": "date",             // optional, when timetable expires
  "is_active": "boolean",            // default: true
  "sessions_count": "integer",        // read-only, total sessions
  "created_by": "integer",            // FK to User who created
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### 2. Timetable Sessions
```http
GET /api/attendance/timetable-sessions/
POST /api/attendance/timetable-sessions/
GET /api/attendance/timetable-sessions/{id}/
PUT /api/attendance/timetable-sessions/{id}/
DELETE /api/attendance/timetable-sessions/{id}/
```

**Timetable Session Fields:**
```json
{
  "id": "integer",
  "timetable": "integer",             // required, FK to Timetable
  "day_of_week": "integer",          // required, 1=Monday, 7=Sunday
  "day_name": "string",              // read-only, localized day name
  "start_time": "time",              // required, HH:MM format
  "end_time": "time",                // required, HH:MM format
  "subject": "integer",              // required, FK to Subject
  "subject_name": "string",          // read-only
  "teacher": "integer",              // required, FK to User (TEACHER)
  "teacher_name": "string",          // read-only
  "room": "integer",                 // optional, FK to Room
  "room_name": "string",             // read-only
  "session_type": "enum",            // REGULAR|EXAM|LAB|FIELD_TRIP
  "is_active": "boolean",            // default: true
  "notes": "text",                   // optional
  "created_at": "datetime"
}
```

**Custom Actions:**
```http
GET /api/attendance/timetable-sessions/today_sessions/    # Today's sessions for teacher
GET /api/attendance/timetable-sessions/weekly_schedule/   # Weekly schedule view
```

**Today's Sessions Response:**
```json
{
  "date": "2024-01-15",
  "teacher_id": 5,
  "sessions": [
    {
      "id": 101,
      "start_time": "08:00",
      "end_time": "09:00", 
      "subject": "Mathématiques",
      "class": "1ère Année A",
      "room": "Salle 101",
      "status": "upcoming", // upcoming|active|completed
      "attendance_session": 205, // FK if attendance session created
      "students_count": 25
    }
  ]
}
```

### Attendance Sessions

#### 1. Session Management
```http
GET /api/attendance/sessions/
POST /api/attendance/sessions/
GET /api/attendance/sessions/{id}/
PUT /api/attendance/sessions/{id}/
DELETE /api/attendance/sessions/{id}/
```

**Attendance Session Fields:**
```json
{
  "id": "integer",
  "timetable_session": "integer",     // required, FK to TimetableSession
  "date": "date",                    // required, session date
  "status": "enum",                  // NOT_STARTED|IN_PROGRESS|COMPLETED
  "started_at": "datetime",          // when session started
  "completed_at": "datetime",        // when session completed
  "started_by": "integer",           // FK to User who started
  "completed_by": "integer",         // FK to User who completed
  "total_students": "integer",       // read-only, enrolled students count
  "present_count": "integer",        // read-only, present students
  "absent_count": "integer",         // read-only, absent students  
  "late_count": "integer",           // read-only, late students
  "not_marked_count": "integer",     // read-only, unmarked students
  "attendance_percentage": "float",   // read-only, present/total * 100
  "notes": "text",                   // session notes
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**Session Status:**
- `NOT_STARTED` - Session not begun
- `IN_PROGRESS` - Attendance being marked
- `COMPLETED` - Attendance marking finished

**Custom Session Actions:**
```http
POST /api/attendance/sessions/{id}/start/        # Start attendance session
POST /api/attendance/sessions/{id}/complete/     # Complete attendance session
GET /api/attendance/sessions/{id}/students/      # Get student list with status
POST /api/attendance/sessions/{id}/bulk_mark/    # Mark multiple students
POST /api/attendance/sessions/{id}/reset/        # Reset session (admin only)
```

**Start Session:**
```json
// Request
{}

// Response
{
  "id": 205,
  "status": "IN_PROGRESS",
  "started_at": "2024-01-15T08:05:00Z",
  "total_students": 25,
  "students": [
    {
      "student_id": 25,
      "student_name": "Sara Alami",
      "attendance_status": "not_marked",
      "previous_attendance": "present" // last session status
    }
  ]
}
```

**Bulk Mark Attendance:**
```json
// Request
{
  "attendance_data": [
    {
      "student": 25,
      "status": "present",
      "arrived_late": false,
      "notes": ""
    },
    {
      "student": 26,
      "status": "absent", 
      "absence_reason": "illness",
      "notes": "Called in sick"
    }
  ]
}

// Response  
{
  "marked_count": 2,
  "present_count": 1,
  "absent_count": 1,
  "late_count": 0,
  "flags_created": 1,      // absence flags created
  "notifications_sent": 1  // parent notifications sent
}
```

#### 2. Attendance Records
```http
GET /api/attendance/records/
POST /api/attendance/records/
GET /api/attendance/records/{id}/
PUT /api/attendance/records/{id}/
```

**Attendance Record Fields:**
```json
{
  "id": "integer",
  "session": "integer",               // required, FK to AttendanceSession
  "student": "integer",               // required, FK to User (STUDENT)
  "student_name": "string",           // read-only
  "status": "enum",                   // PRESENT|ABSENT|LATE|EXCUSED
  "marked_at": "datetime",            // when attendance was marked
  "marked_by": "integer",             // FK to User who marked
  "arrived_late": "boolean",          // default: false
  "late_minutes": "integer",          // minutes late if applicable
  "absence_reason": "string",         // reason for absence
  "is_excused": "boolean",           // excused absence
  "notes": "text",                   // additional notes
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**Attendance Status:**
- `PRESENT` - حاضر - Présent
- `ABSENT` - غائب - Absent  
- `LATE` - متأخر - En retard
- `EXCUSED` - غياب مبرر - Absence justifiée

**Query Parameters:**
```http
GET /api/attendance/records/?
  session=205&                        # specific session
  student=25&                         # specific student
  status=absent&                      # filter by status
  date__gte=2024-01-01&              # records from date
  date__lte=2024-01-31&              # records to date
  is_excused=false&                  # unexcused absences only
  marked_by=5&                       # marked by specific teacher
  ordering=-marked_at                # order by marked time
```

### Student Enrollment System

> **📍 MOVED TO USERS MODULE**: Student enrollment endpoints have been moved to `/api/users/enrollments/` for better logical organization. See [Users Module - Student Enrollments](#5-student-enrollments) for complete documentation.

### Absence Flag System

#### 1. Student Absence Flags
```http
GET /api/attendance/absence-flags/
POST /api/attendance/absence-flags/
GET /api/attendance/absence-flags/{id}/
PUT /api/attendance/absence-flags/{id}/
DELETE /api/attendance/absence-flags/{id}/
```

**Absence Flag Fields:**
```json
{
  "id": "integer",
  "student": "integer",               // required, FK to User (STUDENT)
  "student_name": "string",           // read-only
  "session": "integer",               // required, FK to AttendanceSession
  "session_details": "object",        // read-only, session info
  "flag_type": "enum",               // ABSENCE|CHRONIC_ABSENCE|LATE_PATTERN
  "priority": "enum",                // LOW|MEDIUM|HIGH|URGENT
  "status": "enum",                  // ACTIVE|RESOLVED|DISMISSED
  "absence_count": "integer",        // consecutive absences
  "created_at": "datetime",          // when flag was created
  "resolved_at": "datetime",         // when flag was resolved
  "resolved_by": "integer",          // FK to User who resolved
  "resolution_notes": "text",        // resolution explanation
  "documents": "array",              // uploaded justification documents
  "auto_generated": "boolean",       // system-generated flag
  "parent_notified": "boolean",      // parent notification sent
  "follow_up_required": "boolean"    // needs staff follow-up
}
```

**Flag Types:**
- `ABSENCE` - Single absence flag
- `CHRONIC_ABSENCE` - Pattern of absences (5+ in 2 weeks)
- `LATE_PATTERN` - Chronic lateness (5+ late arrivals)

**Flag Priority:**
- `LOW` - Single unexcused absence
- `MEDIUM` - 2-3 consecutive absences  
- `HIGH` - 4-6 consecutive absences
- `URGENT` - 7+ consecutive absences or chronic pattern

**Custom Actions:**
```http
GET /api/attendance/absence-flags/pending/          # Active flags needing resolution
POST /api/attendance/absence-flags/{id}/resolve/    # Resolve flag with documentation
POST /api/attendance/absence-flags/{id}/dismiss/    # Dismiss flag without action
GET /api/attendance/absence-flags/analytics/        # Flag statistics and trends
```

**Resolve Flag:**
```json
// Request
{
  "resolution_type": "justified",     // justified|unjustified|partial
  "resolution_notes": "Medical certificate provided for illness",
  "documents": ["medical_cert_123"],  // Cloudinary public_ids
  "mark_excused": true,              // mark related absences as excused
  "follow_up_required": false
}

// Response
{
  "flag_id": 45,
  "status": "RESOLVED", 
  "resolved_at": "2024-01-15T10:30:00Z",
  "absences_updated": 3,             // absences marked as excused
  "parent_notified": true            // parent notification sent
}
```

### Parent Notification System

#### 1. Attendance Notifications
```http
GET /api/attendance/notifications/
POST /api/attendance/notifications/
GET /api/attendance/notifications/{id}/
PATCH /api/attendance/notifications/{id}/
```

**Notification Fields:**
```json
{
  "id": "integer",
  "recipient": "integer",             // required, FK to User (PARENT)
  "student": "integer",               // required, FK to User (STUDENT)
  "student_name": "string",           // read-only
  "notification_type": "enum",        // see types below
  "priority": "enum",                 // LOW|MEDIUM|HIGH|URGENT
  "title": "string",                  // notification title
  "title_arabic": "string",           // Arabic title
  "title_french": "string",           // French title
  "message": "text",                  // notification content
  "message_arabic": "text",           // Arabic content
  "message_french": "text",           // French content
  "status": "enum",                   // SENT|DELIVERED|READ|FAILED
  "sent_at": "datetime",              // when notification was sent
  "read_at": "datetime",              // when parent read it
  "delivery_method": "array",         // [SMS, EMAIL, PUSH, IN_APP]
  "reference_id": "integer",          // related object ID
  "reference_type": "string",         // related object type
  "auto_generated": "boolean",        // system-generated
  "requires_action": "boolean",       // needs parent response
  "action_taken": "boolean",          // parent has responded
  "created_at": "datetime"
}
```

**Notification Types:**
- `ABSENCE_ALERT` - Student absent from session
- `LATE_ALERT` - Student arrived late
- `FLAG_CREATED` - New absence flag created
- `FLAG_RESOLVED` - Absence flag resolved
- `CHRONIC_ABSENCE` - Pattern of absences detected
- `ATTENDANCE_SUMMARY` - Weekly/monthly summary
- `EXCUSE_REQUIRED` - Documentation needed

**Custom Actions:**
```http
POST /api/attendance/notifications/{id}/mark_read/   # Mark as read
GET /api/attendance/notifications/unread/           # Get unread notifications
POST /api/attendance/notifications/bulk_read/       # Mark multiple as read
```

### Reporting System

#### 1. Attendance Reports
```http
GET /api/attendance/reports/
POST /api/attendance/reports/
GET /api/attendance/reports/{id}/
```

**Custom Report Actions:**
```http
GET /api/attendance/reports/class_statistics/       # Class attendance statistics
GET /api/attendance/reports/student_history/        # Individual student history
GET /api/attendance/reports/daily_report/          # Daily attendance report
GET /api/attendance/reports/weekly_summary/        # Weekly attendance summary
GET /api/attendance/reports/monthly_analysis/      # Monthly attendance analysis
GET /api/attendance/reports/flag_statistics/       # Absence flag statistics
```

**Class Statistics:**
```json
{
  "class_id": 1,
  "class_name": "1ère Année A",
  "period": {
    "start_date": "2024-01-01",
    "end_date": "2024-01-31"
  },
  "total_sessions": 120,
  "total_students": 25,
  "statistics": {
    "overall_attendance_rate": 92.3,
    "total_absences": 180,
    "total_late_arrivals": 45,
    "excused_absences": 67,
    "unexcused_absences": 113,
    "chronic_absence_students": 3,
    "perfect_attendance_students": 8
  },
  "daily_trends": [
    {"date": "2024-01-15", "attendance_rate": 88.0, "absent_count": 3},
    {"date": "2024-01-16", "attendance_rate": 96.0, "absent_count": 1}
  ],
  "student_breakdown": [
    {
      "student_id": 25,
      "student_name": "Sara Alami",
      "attendance_rate": 95.8,
      "total_absences": 5,
      "total_late": 2,
      "current_flags": 0
    }
  ]
}
```

**Student History:**
```json
{
  "student_id": 25,
  "student_name": "Sara Alami",
  "class": "1ère Année A",
  "period": {
    "start_date": "2024-01-01", 
    "end_date": "2024-01-31"
  },
  "summary": {
    "attendance_rate": 95.8,
    "total_sessions": 120,
    "present": 115,
    "absent": 5,
    "late": 8,
    "excused": 2
  },
  "attendance_calendar": [
    {"date": "2024-01-15", "sessions": [
      {"subject": "Math", "status": "present", "marked_at": "08:05"},
      {"subject": "French", "status": "late", "late_minutes": 10}
    ]}
  ],
  "absence_patterns": {
    "most_absent_day": "Monday",
    "most_absent_subject": "Physical Education",
    "absence_reasons": {
      "illness": 3,
      "family_emergency": 1,
      "unexcused": 1
    }
  },
  "flags_history": [
    {
      "flag_id": 12,
      "created_date": "2024-01-10",
      "resolved_date": "2024-01-12",
      "reason": "Medical certificate provided"
    }
  ]
}
```

---

## Real-time Features

> **⚠️ PLANNED FEATURE**: The following WebSocket and real-time features are planned for future implementation and may not be currently available in the backend.

### WebSocket Connections

#### Connection Setup
```javascript
// WebSocket URL format
ws://localhost:8000/ws/notifications/{user_id}/

// Authentication required in connection headers
headers: {
  'Authorization': 'Bearer ' + access_token
}

// Connection events
connection.onopen = () => console.log('Connected to notifications');
connection.onmessage = (event) => handleNotification(JSON.parse(event.data));
connection.onclose = () => console.log('Disconnected from notifications');
connection.onerror = (error) => console.error('WebSocket error:', error);
```

#### Message Types

**Attendance Notifications:**
```json
{
  "type": "attendance_alert",
  "timestamp": "2024-01-15T09:05:00Z",
  "data": {
    "student_id": 25,
    "student_name": "Sara Alami",
    "class": "1ère Année A",
    "subject": "Mathématiques", 
    "session_date": "2024-01-15",
    "session_time": "09:00",
    "status": "absent",
    "flag_created": true,
    "priority": "medium"
  }
}
```

**Assignment Notifications:**
```json
{
  "type": "grade_published",
  "timestamp": "2024-01-15T14:30:00Z",
  "data": {
    "homework_id": 25,
    "homework_title": "Math Quiz 1",
    "student_id": 25,
    "score": 85.0,
    "score_percentage": 85.0,
    "points_earned": 42,
    "feedback_available": true
  }
}
```

**Gamification Notifications:**
```json
{
  "type": "badge_earned",
  "timestamp": "2024-01-15T15:45:00Z",
  "data": {
    "student_id": 25,
    "badge_id": 5,
    "badge_name": "Math Champion",
    "badge_icon": "🏆",
    "points_awarded": 100,
    "rarity": "EPIC"
  }
}
```

**System Notifications:**
```json
{
  "type": "system_alert",
  "timestamp": "2024-01-15T16:00:00Z",
  "data": {
    "alert_type": "maintenance",
    "title": "System Maintenance",
    "message": "System will be down for maintenance at 23:00",
    "priority": "high",
    "expires_at": "2024-01-15T23:00:00Z"
  }
}
```

#### Heartbeat System
```javascript
// Client must send heartbeat every 30 seconds
setInterval(() => {
  if (connection.readyState === WebSocket.OPEN) {
    connection.send(JSON.stringify({"type": "heartbeat"}));
  }
}, 30000);
```

---

## File Upload System

> **⚠️ PARTIALLY IMPLEMENTED**: Basic file uploads via Cloudinary are supported. Advanced signature generation endpoints may be planned for future implementation.

### Cloudinary Integration

#### 1. Upload Signature Generation
```http
POST /api/files/upload-signature/
Content-Type: application/json
```

**Request:**
```json
{
  "file_type": "image",               // image|document|video|audio
  "context": "profile_picture",       // upload context
  "folder": "profiles",               // optional, Cloudinary folder
  "max_size": 5242880                // optional, max size in bytes (5MB)
}
```

**Response:**
```json
{
  "signature": "a1b2c3d4e5f6...",     // upload signature
  "timestamp": 1642234567,            // Unix timestamp
  "api_key": "your_api_key",          // Cloudinary API key
  "upload_url": "https://api.cloudinary.com/v1_1/madrasti/image/upload",
  "folder": "profiles",
  "expires_at": "2024-01-15T10:35:00Z" // signature expiration
}
```

#### 2. Direct Upload to Cloudinary
```javascript
// Frontend upload using FormData
const formData = new FormData();
formData.append('file', fileObject);
formData.append('signature', signature);
formData.append('timestamp', timestamp);
formData.append('api_key', api_key);
formData.append('folder', folder);

fetch(upload_url, {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  // Handle upload success
  console.log('Upload successful:', data);
});
```

**Cloudinary Response:**
```json
{
  "public_id": "profiles/user25_2024",
  "version": 1642234567,
  "signature": "...",
  "width": 800,
  "height": 600,
  "format": "jpg",
  "resource_type": "image",
  "created_at": "2024-01-15T10:30:00Z",
  "bytes": 245760,
  "url": "http://res.cloudinary.com/madrasti/image/upload/v1642234567/profiles/user25_2024.jpg",
  "secure_url": "https://res.cloudinary.com/madrasti/image/upload/v1642234567/profiles/user25_2024.jpg"
}
```

#### 3. Update Record with File URL
```http
PATCH /api/users/profile/
Content-Type: application/json
```

**Request:**
```json
{
  "profile_picture": "profiles/user25_2024"  // Cloudinary public_id
}
```

### File Type Restrictions

**Image Files:**
- Formats: JPG, PNG, GIF, WebP
- Max size: 5MB
- Max dimensions: 2048x2048

**Document Files:**
- Formats: PDF, DOC, DOCX, TXT
- Max size: 10MB

**Video Files:**
- Formats: MP4, WebM, MOV
- Max size: 50MB
- Max duration: 10 minutes

**Audio Files:**
- Formats: MP3, WAV, OGG
- Max size: 20MB
- Max duration: 30 minutes

---

## Error Handling

### HTTP Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created successfully  
- **204 No Content** - Request successful, no content returned
- **400 Bad Request** - Invalid request data or validation error
- **401 Unauthorized** - Authentication required or token invalid
- **403 Forbidden** - Permission denied for this action
- **404 Not Found** - Requested resource does not exist
- **405 Method Not Allowed** - HTTP method not supported
- **422 Unprocessable Entity** - Validation error with specific details
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Unexpected server error

### Enhanced Error Response Format

#### Validation Errors (400/422)
```json
{
  "error": "Validation failed",
  "error_code": "VALIDATION_ERROR",
  "timestamp": "2024-01-15T10:30:00Z",
  "details": {
    "title": ["This field is required."],
    "due_date": ["Due date must be in the future.", "Invalid date format."],
    "time_limit": ["Must be between 5 and 300 minutes."],
    "homework_type": ["Must be one of: QCM, BOOK, OPEN, MIXED."]
  }
}
```

#### Permission Errors (403)
```json
{
  "error": "You don't have permission to perform this action",
  "error_code": "PERMISSION_DENIED", 
  "timestamp": "2024-01-15T10:30:00Z",
  "details": {
    "required_permissions": ["can_create_homework"],
    "user_role": "STUDENT",
    "required_roles": ["TEACHER", "ADMIN", "STAFF"]
  }
}
```

#### Authentication Errors (401)
```json
{
  "error": "Authentication required",
  "error_code": "AUTHENTICATION_REQUIRED",
  "timestamp": "2024-01-15T10:30:00Z", 
  "details": {
    "message": "Token has expired",
    "token_expired": true,
    "token_expired_at": "2024-01-15T10:15:00Z"
  }
}
```

#### Resource Not Found (404)
```json
{
  "error": "Resource not found",
  "error_code": "RESOURCE_NOT_FOUND",
  "timestamp": "2024-01-15T10:30:00Z",
  "details": {
    "resource": "Homework",
    "resource_id": 999,
    "message": "Homework with ID 999 does not exist"
  }
}
```

#### Rate Limit Errors (429)
```json
{
  "error": "Rate limit exceeded",
  "error_code": "RATE_LIMIT_EXCEEDED",
  "timestamp": "2024-01-15T10:30:00Z",
  "details": {
    "limit": 1000,
    "window": "1 hour", 
    "reset_at": "2024-01-15T11:00:00Z",
    "retry_after": 1800
  }
}
```

#### Server Errors (500)
```json
{
  "error": "Internal server error",
  "error_code": "INTERNAL_ERROR",
  "timestamp": "2024-01-15T10:30:00Z",
  "details": {
    "error_id": "err_1234567890",
    "message": "An unexpected error occurred. Please try again later."
  }
}
```

---

## Common Patterns

### Pagination

All list endpoints support pagination with consistent parameters:

**Request Parameters:**
- `page` - Page number (default: 1, min: 1)
- `page_size` - Items per page (default: 20, max: 100)

**Response Format:**
```json
{
  "count": 156,                       // total items
  "next": "http://localhost:8000/api/homework/homework/?page=3",
  "previous": "http://localhost:8000/api/homework/homework/?page=1", 
  "page_info": {
    "current_page": 2,
    "total_pages": 8,
    "page_size": 20,
    "has_next": true,
    "has_previous": true
  },
  "results": [...]                    // paginated items
}
```

### Filtering and Search

**Common Filter Parameters:**
- `search` - Full-text search across relevant fields
- `ordering` - Order results (prefix with `-` for descending)
- `created_at__gte` - Created after date
- `created_at__lte` - Created before date
- `is_active` - Filter by active status
- `is_published` - Filter by published status (where applicable)

**Search Example:**
```http
GET /api/homework/homework/?
  search=mathematics&               # search in title, description
  subject=1&                        # specific subject
  grade=2&                         # specific grade  
  is_published=true&               # published only
  due_date__gte=2024-01-15&        # due after date
  ordering=-created_at&            # newest first
  page=1&                          # first page
  page_size=25                     # 25 items per page
```

### Bulk Operations

**Bulk Creation:**
```http
POST /api/resource/bulk_create/
Content-Type: application/json
```

**Request:**
```json
{
  "items": [
    {"field1": "value1", "field2": "value2"},
    {"field1": "value3", "field2": "value4"}
  ]
}
```

**Response:**
```json
{
  "created_count": 2,
  "failed_count": 0,
  "created_ids": [15, 16],
  "errors": []
}
```

**Bulk Update:**
```http
PATCH /api/resource/bulk_update/
Content-Type: application/json
```

**Request:**
```json
{
  "ids": [1, 2, 3],
  "data": {
    "is_published": true,
    "updated_by": 5
  }
}
```

### Soft Delete

Resources with soft delete support (Users, Assignments, etc.) are not permanently removed but marked as inactive:

**Delete Response:**
```json
{
  "id": 25,
  "deleted": true,
  "deleted_at": "2024-01-15T10:30:00Z",
  "message": "Resource has been successfully deleted"
}
```

**Restore Soft Deleted:**
```http
POST /api/resource/{id}/restore/
```

### Caching Headers

**Cacheable Resources:**
```http
Cache-Control: public, max-age=3600
ETag: "a1b2c3d4e5f6789"
Last-Modified: Mon, 15 Jan 2024 10:30:00 GMT
```

**Dynamic Resources:**
```http
Cache-Control: no-cache, must-revalidate
Pragma: no-cache
```

**Real-time Resources:**
```http
Cache-Control: no-store, no-cache, must-revalidate
Pragma: no-cache
```

### Rate Limiting

**Default Limits:**
- Authenticated users: 1000 requests/hour
- Anonymous users: 100 requests/hour  
- File uploads: 50 uploads/hour
- Bulk operations: 10 operations/hour

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1642237200
X-RateLimit-Window: 3600
```

### Internationalization

**Language Detection:**
1. `Accept-Language` header
2. User profile language preference
3. Default: English

**Multilingual Fields:**
Most entities support Arabic, French, and English:
- `title` / `title_arabic` / `title_french`  
- `description` / `description_arabic` / `description_french`
- `name` / `name_arabic` / `name_french`

**Date/Time Localization:**
- Dates: Localized format based on user preference
- Times: 24-hour format with timezone
- Islamic calendar support available

---

## Development Environment

### Base URLs
- **Development:** `http://localhost:8000/api/`
- **Staging:** `https://staging-api.madrasti.ma/api/`
- **Production:** `https://api.madrasti.ma/api/`

### API Documentation
- **Swagger UI:** `/swagger/`
- **ReDoc:** `/redoc/`
- **OpenAPI Schema:** `/api/schema/`

### Health Checks
```http
GET /api/health/
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "database": "connected",
  "redis": "connected", 
  "cloudinary": "configured"
}
```

---

This enhanced API documentation provides comprehensive details for seamless frontend integration with the Madrasti 2.0 backend. For additional support or clarification, please contact the development team.

**Last Updated:** August 27, 2025 (Corrected)  
**API Version:** 1.0  
**Documentation Version:** 2.1