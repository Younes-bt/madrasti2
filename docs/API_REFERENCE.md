# API Reference

This document provides a comprehensive reference for all API endpoints in the Madrasti 2.0 platform.

## Base URL

```
Development: http://localhost:8000/api/
Production: https://api.madrasti.com/api/
```

## Authentication

All API requests (except login/register) require JWT authentication.

### Headers

```http
Authorization: Bearer <access_token>
Content-Type: application/json
Accept-Language: ar|en|fr
```

### Token Endpoints

#### Obtain Token
```http
POST /api/token/
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Refresh Token
```http
POST /api/token/refresh/
```

**Request Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response**:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Verify Token
```http
POST /api/token/verify/
```

**Request Body**:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## User Management

### Authentication

#### Login
```http
POST /api/users/login/
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "STUDENT",
    "first_name": "Ahmed",
    "last_name": "Ali"
  },
  "tokens": {
    "access": "...",
    "refresh": "..."
  }
}
```

#### Register
```http
POST /api/users/register/
```

**Request Body**:
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "first_name": "Sara",
  "last_name": "Hassan",
  "role": "STUDENT"
}
```

#### Change Password
```http
POST /api/users/change-password/
```

**Request Body**:
```json
{
  "old_password": "oldpass123",
  "new_password": "newpass456"
}
```

### Profile Management

#### Get Current User Profile
```http
GET /api/users/profile/
```

**Response**:
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "email": "student@example.com",
    "first_name": "Ahmed",
    "last_name": "Ali",
    "role": "STUDENT"
  },
  "ar_first_name": "أحمد",
  "ar_last_name": "علي",
  "phone": "+212612345678",
  "date_of_birth": "2005-05-15",
  "profile_picture_url": "https://res.cloudinary.com/...",
  "bio": "Student profile...",
  "created_at": "2024-09-01T10:00:00Z"
}
```

#### Update Profile
```http
PUT /api/users/profile/
PATCH /api/users/profile/
```

**Request Body** (partial update allowed):
```json
{
  "phone": "+212612345678",
  "bio": "Updated bio...",
  "ar_first_name": "أحمد"
}
```

### Student Enrollments

#### List Student Enrollments
```http
GET /api/users/enrollments/
```

**Query Parameters**:
- `academic_year`: Filter by academic year ID
- `is_active`: Filter active enrollments (true/false)

**Response**:
```json
{
  "count": 2,
  "results": [
    {
      "id": 1,
      "student": {...},
      "school_class": {
        "id": 5,
        "name": "1BAC SM - A",
        "grade": {...},
        "track": {...}
      },
      "academic_year": {
        "id": 1,
        "year": "2024-2025",
        "is_current": true
      },
      "student_number": "2024001",
      "enrollment_date": "2024-09-01",
      "is_active": true
    }
  ]
}
```

#### Create Enrollment
```http
POST /api/users/enrollments/
```

**Request Body**:
```json
{
  "student": 15,
  "school_class": 5,
  "academic_year": 1,
  "student_number": "2024025"
}
```

---

## School Management

### School Configuration

#### Get School Config
```http
GET /api/schools/config/
```

**Response**:
```json
{
  "id": 1,
  "name": "Al-Amal Private School",
  "name_arabic": "مدرسة الأمل الخاصة",
  "name_french": "École Privée Al-Amal",
  "phone": "+212520123456",
  "email": "info@alanal.ma",
  "logo_url": "https://res.cloudinary.com/...",
  "address": "123 Main St, Casablanca",
  "city": "Casablanca",
  "region": "Casablanca-Settat",
  "current_academic_year": {...}
}
```

#### Update School Config
```http
PUT /api/schools/config/
PATCH /api/schools/config/
```

**Permissions**: Admin only

### Educational Structure

#### List Educational Levels
```http
GET /api/schools/levels/
```

**Response**:
```json
{
  "count": 4,
  "results": [
    {
      "id": 1,
      "level": "PRIMARY",
      "name": "Primary School",
      "name_arabic": "المدرسة الابتدائية",
      "name_french": "École Primaire",
      "order": 2
    }
  ]
}
```

#### List Grades
```http
GET /api/schools/grades/
```

**Query Parameters**:
- `educational_level`: Filter by level ID
- `search`: Search by name/code

**Response**:
```json
{
  "count": 12,
  "results": [
    {
      "id": 10,
      "educational_level": {...},
      "grade_number": 1,
      "code": "1BAC",
      "name": "1st Baccalaureate",
      "name_arabic": "السنة الأولى باكالوريا",
      "name_french": "1ère Année Baccalauréat",
      "passing_grade": "10.00"
    }
  ]
}
```

#### List Tracks
```http
GET /api/schools/tracks/
```

**Query Parameters**:
- `grade`: Filter by grade ID
- `is_active`: Filter active tracks

#### List Classes
```http
GET /api/schools/classes/
```

**Query Parameters**:
- `academic_year`: Filter by academic year
- `grade`: Filter by grade
- `track`: Filter by track

**Response**:
```json
{
  "count": 8,
  "results": [
    {
      "id": 5,
      "grade": {...},
      "track": {...},
      "academic_year": {...},
      "section": "A",
      "name": "1BAC SM - A",
      "teachers": [...]
    }
  ]
}
```

#### Get Class Students
```http
GET /api/schools/classes/{class_id}/students/
```

**Response**:
```json
{
  "count": 30,
  "results": [
    {
      "id": 1,
      "student": {
        "id": 15,
        "email": "student@example.com",
        "full_name": "Ahmed Ali"
      },
      "student_number": "2024001",
      "enrollment_date": "2024-09-01"
    }
  ]
}
```

#### Enroll Student in Class
```http
POST /api/schools/classes/{class_id}/enroll/
```

**Request Body**:
```json
{
  "student_id": 15,
  "student_number": "2024025"
}
```

### Subjects

#### List Subjects
```http
GET /api/schools/subjects/
```

**Response**:
```json
{
  "count": 15,
  "results": [
    {
      "id": 1,
      "name": "Mathematics",
      "name_arabic": "الرياضيات",
      "name_french": "Mathématiques",
      "code": "MATH"
    }
  ]
}
```

### Rooms & Infrastructure

#### List Rooms
```http
GET /api/schools/rooms/
```

**Query Parameters**:
- `room_type`: Filter by type (CLASSROOM, LAB, etc.)

#### List Vehicles
```http
GET /api/schools/vehicles/
```

**Query Parameters**:
- `vehicle_type`: Filter by type
- `is_active`: Filter active vehicles

---

## Lesson Management

### Lessons

#### List Lessons
```http
GET /api/lessons/lessons/
```

**Query Parameters**:
- `subject`: Filter by subject ID
- `grade`: Filter by grade ID
- `cycle`: Filter by cycle (first/second)
- `difficulty_level`: Filter by difficulty
- `is_active`: Filter active lessons
- `search`: Search in title/description

**Response**:
```json
{
  "count": 45,
  "results": [
    {
      "id": 1,
      "subject": {...},
      "grade": {...},
      "tracks": [...],
      "title": "Introduction to Functions",
      "title_arabic": "مقدمة في الدوال",
      "cycle": "first",
      "order": 1,
      "difficulty_level": "medium",
      "objectives": "Understand basic function concepts...",
      "is_active": true,
      "created_at": "2024-09-01T10:00:00Z"
    }
  ]
}
```

#### Create Lesson
```http
POST /api/lessons/lessons/
```

**Request Body**:
```json
{
  "subject": 1,
  "grade": 10,
  "tracks": [1, 2],
  "title": "Derivatives",
  "title_arabic": "المشتقات",
  "title_french": "Les Dérivées",
  "description": "Introduction to derivatives...",
  "cycle": "first",
  "order": 5,
  "difficulty_level": "medium",
  "objectives": "- Understand derivative concept\n- Calculate simple derivatives",
  "prerequisites": "Understanding of limits"
}
```

**Permissions**: Teacher, Admin

#### Get Lesson Detail
```http
GET /api/lessons/lessons/{lesson_id}/
```

**Response** includes all fields plus resources:
```json
{
  "id": 1,
  "subject": {...},
  "resources": [
    {
      "id": 1,
      "title": "Lesson Video",
      "resource_type": "video",
      "file_url": "https://res.cloudinary.com/..."
    }
  ],
  ...
}
```

#### Update Lesson
```http
PUT /api/lessons/lessons/{lesson_id}/
PATCH /api/lessons/lessons/{lesson_id}/
```

**Permissions**: Creator or Admin

#### Delete Lesson
```http
DELETE /api/lessons/lessons/{lesson_id}/
```

**Permissions**: Creator or Admin

#### Publish Lesson to Classes
```http
POST /api/lessons/lessons/{lesson_id}/publish/
```

**Request Body**:
```json
{
  "class_ids": [5, 6, 7]
}
```

**Response**:
```json
{
  "message": "Lesson published to 3 classes",
  "published_classes": [5, 6, 7]
}
```

#### Unpublish Lesson from Classes
```http
POST /api/lessons/lessons/{lesson_id}/unpublish/
```

**Request Body**:
```json
{
  "class_ids": [5]
}
```

### Lesson Resources

#### List Lesson Resources
```http
GET /api/lessons/lessons/{lesson_id}/resources/
```

**Response**:
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "lesson": 1,
      "title": "Lesson PDF",
      "description": "Main lesson content",
      "resource_type": "pdf",
      "file_url": "https://res.cloudinary.com/...",
      "file_size": 2048576,
      "file_format": "pdf",
      "is_visible_to_students": true,
      "is_downloadable": true,
      "order": 1,
      "uploaded_at": "2024-09-01T10:00:00Z"
    }
  ]
}
```

#### Add Resource to Lesson
```http
POST /api/lessons/lessons/{lesson_id}/resources/
```

**Request Body** (file upload):
```http
Content-Type: multipart/form-data

title: Lesson Video
resource_type: video
file: <binary file data>
is_visible_to_students: true
```

**Request Body** (blocks content):
```json
{
  "title": "Interactive Lesson",
  "resource_type": "blocks",
  "blocks_content": [
    {
      "id": "block1",
      "type": "heading_1",
      "content": "Introduction"
    },
    {
      "id": "block2",
      "type": "paragraph",
      "content": "This lesson covers..."
    }
  ]
}
```

#### Update Resource
```http
PUT /api/lessons/lessons/{lesson_id}/resources/{resource_id}/
PATCH /api/lessons/lessons/{lesson_id}/resources/{resource_id}/
```

#### Delete Resource
```http
DELETE /api/lessons/lessons/{lesson_id}/resources/{resource_id}/
```

---

## Homework & Assessment

### Homework

#### List Homework
```http
GET /api/homework/homework/
```

**Query Parameters**:
- `subject`: Filter by subject
- `grade`: Filter by grade
- `school_class`: Filter by class
- `teacher`: Filter by teacher
- `homework_type`: Filter by type
- `is_published`: Filter published
- `is_overdue`: Filter overdue

**Response**:
```json
{
  "count": 20,
  "results": [
    {
      "id": 1,
      "subject": {...},
      "grade": {...},
      "school_class": {...},
      "teacher": {...},
      "title": "Chapter 1 Quiz",
      "homework_type": "quiz",
      "homework_format": "qcm_only",
      "due_date": "2024-12-30T23:59:59Z",
      "total_points": "20.00",
      "is_timed": true,
      "time_limit": 30,
      "is_published": true,
      "submissions_count": 25
    }
  ]
}
```

#### Create Homework
```http
POST /api/homework/homework/
```

**Request Body**:
```json
{
  "subject": 1,
  "grade": 10,
  "school_class": 5,
  "lesson": 1,
  "title": "Functions Quiz",
  "description": "Quiz on basic functions",
  "instructions": "Answer all questions within 30 minutes",
  "homework_format": "qcm_only",
  "homework_type": "quiz",
  "due_date": "2024-12-30T23:59:59Z",
  "estimated_duration": 30,
  "time_limit": 30,
  "is_timed": true,
  "total_points": "20.00",
  "auto_grade_qcm": true,
  "allow_multiple_attempts": false
}
```

#### Get Homework Detail
```http
GET /api/homework/homework/{homework_id}/
```

**Response** includes questions:
```json
{
  "id": 1,
  "title": "Functions Quiz",
  "questions": [
    {
      "id": 1,
      "question_type": "qcm_single",
      "question_text": "What is f(x) = x^2 at x=2?",
      "points": "2.00",
      "order": 1,
      "choices": [
        {
          "id": 1,
          "choice_text": "2",
          "order": 1
        },
        {
          "id": 2,
          "choice_text": "4",
          "order": 2
        }
      ]
    }
  ],
  ...
}
```

#### Publish Homework
```http
POST /api/homework/homework/{homework_id}/publish/
```

**Response**:
```json
{
  "message": "Homework published successfully",
  "is_published": true
}
```

#### Get Homework Analytics
```http
GET /api/homework/homework/{homework_id}/analytics/
```

**Response**:
```json
{
  "total_students": 30,
  "submitted": 25,
  "not_submitted": 5,
  "submission_rate": 83.33,
  "average_score": 15.5,
  "on_time": 20,
  "late": 5,
  "score_distribution": {
    "0-5": 2,
    "6-10": 5,
    "11-15": 10,
    "16-20": 8
  },
  "question_performance": [
    {
      "question_id": 1,
      "correct_count": 20,
      "incorrect_count": 5,
      "average_points": 1.6
    }
  ]
}
```

#### Get Homework Submissions
```http
GET /api/homework/homework/{homework_id}/submissions/
```

**Response**:
```json
{
  "count": 25,
  "results": [
    {
      "id": 1,
      "student": {...},
      "status": "manually_graded",
      "score": "18.00",
      "percentage": "90.00",
      "submitted_at": "2024-12-25T14:30:00Z",
      "is_late": false
    }
  ]
}
```

### Questions

#### Create Question
```http
POST /api/homework/questions/
```

**QCM Single Choice**:
```json
{
  "homework": 1,
  "question_type": "qcm_single",
  "question_text": "What is 2+2?",
  "points": "2.00",
  "order": 1,
  "choices": [
    {"choice_text": "3", "is_correct": false, "order": 1},
    {"choice_text": "4", "is_correct": true, "order": 2},
    {"choice_text": "5", "is_correct": false, "order": 3}
  ],
  "explanation": "2+2 equals 4"
}
```

**Open-Ended**:
```json
{
  "homework": 1,
  "question_type": "open_long",
  "question_text": "Explain the concept of derivatives.",
  "points": "10.00",
  "order": 2
}
```

#### Bulk Create Questions
```http
POST /api/homework/questions/bulk_create/
```

**Request Body**:
```json
{
  "homework": 1,
  "questions": [
    {
      "question_type": "qcm_single",
      "question_text": "Question 1?",
      "points": "2.00",
      "choices": [...]
    },
    {
      "question_type": "true_false",
      "question_text": "The earth is flat?",
      "points": "1.00",
      "choices": [
        {"choice_text": "True", "is_correct": false},
        {"choice_text": "False", "is_correct": true}
      ]
    }
  ]
}
```

### Submissions

#### List My Submissions (Student)
```http
GET /api/homework/submissions/
```

**Query Parameters**:
- `homework`: Filter by homework
- `status`: Filter by status

#### Create Submission (Start Homework)
```http
POST /api/homework/submissions/
```

**Request Body**:
```json
{
  "homework": 1
}
```

**Response**:
```json
{
  "id": 1,
  "homework": {...},
  "student": {...},
  "status": "in_progress",
  "attempt_number": 1,
  "started_at": "2024-12-25T14:00:00Z"
}
```

#### Get Submission Detail
```http
GET /api/homework/submissions/{submission_id}/
```

#### Submit Homework
```http
POST /api/homework/submissions/{submission_id}/submit/
```

**Request Body**:
```json
{
  "answers": [
    {
      "question": 1,
      "selected_choices": [2]
    },
    {
      "question": 2,
      "answer_text": "Derivatives represent the rate of change..."
    }
  ]
}
```

**Response**:
```json
{
  "id": 1,
  "status": "auto_graded",
  "score": "15.00",
  "percentage": "75.00",
  "submitted_at": "2024-12-25T14:30:00Z",
  "rewards": {
    "points": 25,
    "coins": 2,
    "xp": 15
  }
}
```

### Exercises

#### List Exercises
```http
GET /api/homework/exercises/
```

**Query Parameters**:
- `lesson`: Filter by lesson
- `difficulty_level`: Filter by difficulty
- `is_published`: Filter published

#### Create Exercise
```http
POST /api/homework/exercises/
```

**Request Body**:
```json
{
  "lesson": 1,
  "title": "Practice Problems",
  "difficulty_level": "intermediate",
  "estimated_duration": 20,
  "allow_multiple_attempts": true
}
```

#### Submit Exercise
```http
POST /api/homework/exercise-submissions/
```

**Similar to homework submission**

---

## Gamification

### Student Wallet

#### Get My Wallet
```http
GET /api/homework/wallets/me/
```

**Response**:
```json
{
  "id": 1,
  "student": {...},
  "total_points": 1250,
  "total_coins": 125,
  "total_gems": 5,
  "total_stars": 10,
  "experience_points": 850,
  "level": 3,
  "current_level_name": "خبير - Expert",
  "weekly_points": 150,
  "monthly_points": 500,
  "assignments_completed": 25,
  "perfect_scores": 5,
  "current_streak": 7,
  "longest_streak": 15
}
```

### Badges

#### List Available Badges
```http
GET /api/homework/badges/
```

**Query Parameters**:
- `badge_type`: Filter by type
- `rarity`: Filter by rarity
- `is_active`: Filter active

**Response**:
```json
{
  "count": 50,
  "results": [
    {
      "id": 1,
      "name": "First Steps",
      "name_arabic": "الخطوات الأولى",
      "description": "Complete your first homework",
      "badge_type": "achievement",
      "rarity": "common",
      "icon": "🎯",
      "points_reward": 10,
      "is_hidden": false
    }
  ]
}
```

#### List My Earned Badges
```http
GET /api/homework/student-badges/
```

**Response**:
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "badge": {...},
      "earned_at": "2024-12-20T10:00:00Z",
      "earned_for": "Completed first homework"
    }
  ]
}
```

### Leaderboards

#### List Leaderboards
```http
GET /api/homework/leaderboards/
```

**Query Parameters**:
- `leaderboard_type`: weekly, monthly, semester, yearly
- `scope`: school, grade, class, subject
- `is_active`: true/false

**Response**:
```json
{
  "count": 10,
  "results": [
    {
      "id": 1,
      "name": "Weekly Leaderboard - 1st Bac",
      "leaderboard_type": "weekly",
      "scope": "grade",
      "grade": {...},
      "start_date": "2024-12-23",
      "end_date": "2024-12-29",
      "is_active": true
    }
  ]
}
```

#### Get Leaderboard Detail
```http
GET /api/homework/leaderboards/{leaderboard_id}/
```

**Response**:
```json
{
  "id": 1,
  "name": "Weekly Leaderboard - 1st Bac",
  "entries": [
    {
      "current_rank": 1,
      "previous_rank": 2,
      "rank_change": 1,
      "student": {
        "id": 15,
        "full_name": "Ahmed Ali"
      },
      "total_points": 1250,
      "total_coins": 125,
      "assignments_completed": 10,
      "perfect_scores": 3
    },
    {
      "current_rank": 2,
      "rank_change": -1,
      "student": {...},
      "total_points": 1180
    }
  ]
}
```

### Reward Transactions

#### List My Transactions
```http
GET /api/homework/reward-transactions/
```

**Query Parameters**:
- `transaction_type`: Filter by type
- `date_from`: Filter from date
- `date_to`: Filter to date

**Response**:
```json
{
  "count": 100,
  "results": [
    {
      "id": 1,
      "transaction_type": "earned",
      "points_earned": 25,
      "coins_earned": 2,
      "xp_earned": 15,
      "reason": "Completed homework on time",
      "created_at": "2024-12-25T14:35:00Z",
      "homework": {...}
    }
  ]
}
```

---

## Attendance Management

### Timetables

#### List Timetables
```http
GET /api/attendance/timetables/
```

#### Create Timetable
```http
POST /api/attendance/timetables/
```

**Request Body**:
```json
{
  "school_class": 5,
  "academic_year": 1,
  "is_active": true
}
```

### Timetable Sessions

#### List Today's Sessions
```http
GET /api/attendance/timetable-sessions/today_sessions/
```

**Query Parameters**:
- `teacher`: Filter by teacher ID

**Response**:
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "timetable": {...},
      "subject": {...},
      "teacher": {...},
      "day_of_week": 1,
      "start_time": "08:00:00",
      "end_time": "08:55:00",
      "session_order": 1,
      "room": {...}
    }
  ]
}
```

### Attendance Sessions

#### List Attendance Sessions
```http
GET /api/attendance/sessions/
```

**Query Parameters**:
- `date`: Filter by date (YYYY-MM-DD)
- `teacher`: Filter by teacher
- `status`: Filter by status

#### Create Attendance Session
```http
POST /api/attendance/sessions/
```

**Request Body**:
```json
{
  "timetable_session": 1,
  "date": "2024-12-25"
}
```

#### Start Attendance
```http
POST /api/attendance/sessions/{session_id}/start/
```

**Response**:
```json
{
  "id": 1,
  "status": "in_progress",
  "started_at": "2024-12-25T08:00:00Z",
  "total_students": 30,
  "present_count": 30
}
```

#### Bulk Mark Attendance
```http
POST /api/attendance/sessions/{session_id}/bulk_mark/
```

**Request Body**:
```json
{
  "records": [
    {
      "student_id": 15,
      "status": "present"
    },
    {
      "student_id": 16,
      "status": "absent"
    },
    {
      "student_id": 17,
      "status": "late",
      "arrival_time": "08:15:00"
    }
  ]
}
```

#### Complete Attendance
```http
POST /api/attendance/sessions/{session_id}/complete/
```

**Response**:
```json
{
  "id": 1,
  "status": "completed",
  "completed_at": "2024-12-25T08:30:00Z",
  "present_count": 27,
  "absent_count": 2,
  "late_count": 1,
  "flags_created": 2
}
```

### Absence Flags

#### List Pending Flags
```http
GET /api/attendance/absence-flags/pending/
```

**Response**:
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "student": {...},
      "attendance_record": {...},
      "is_cleared": false,
      "created_at": "2024-12-25T08:30:00Z"
    }
  ]
}
```

#### Resolve Flag
```http
POST /api/attendance/absence-flags/{flag_id}/resolve/
```

**Request Body**:
```http
Content-Type: multipart/form-data

clearance_reason: medical
clearance_notes: Student was sick
clearance_document: <PDF file>
```

---

## Lab Tools

### Lab Tools

#### List Lab Tools
```http
GET /api/lab/tools/
```

**Query Parameters**:
- `category`: Filter by category
- `grade_levels`: Filter by grade
- `is_active`: Filter active

**Response**:
```json
{
  "count": 20,
  "results": [
    {
      "id": 1,
      "tool_id": "function-grapher",
      "name_en": "Function Grapher",
      "name_ar": "راسم الدوال",
      "category": {...},
      "icon": "LineChart",
      "is_premium": false,
      "is_new": true,
      "total_uses": 1250
    }
  ]
}
```

#### Get Tool Detail
```http
GET /api/lab/tools/{tool_id}/
```

### Lab Usage

#### Track Usage
```http
POST /api/lab/usage/
```

**Request Body**:
```json
{
  "tool": 1,
  "started_at": "2024-12-25T10:00:00Z",
  "ended_at": "2024-12-25T10:15:00Z",
  "duration_seconds": 900,
  "device_type": "desktop",
  "interaction_data": {
    "functions_plotted": ["x^2", "sin(x)"],
    "zoom_level": 1.5
  }
}
```

### Lab Assignments

#### List Lab Assignments
```http
GET /api/lab/assignments/
```

#### Create Lab Assignment
```http
POST /api/lab/assignments/
```

**Request Body**:
```json
{
  "title": "Plot Trigonometric Functions",
  "school_class": 5,
  "subject": 1,
  "tool": 1,
  "task_details": {
    "functions": ["sin(x)", "cos(x)", "tan(x)"],
    "range": {"x": [-10, 10], "y": [-2, 2]}
  },
  "due_date": "2024-12-30T23:59:59Z",
  "requires_submission": true,
  "submission_format": "screenshot",
  "total_points": "10.00"
}
```

---

## Error Responses

### Standard Error Format

```json
{
  "error": "Error message",
  "detail": "Detailed error description",
  "code": "ERROR_CODE"
}
```

### HTTP Status Codes

- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Permission denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Common Errors

```json
// Authentication required
{
  "detail": "Authentication credentials were not provided."
}

// Permission denied
{
  "detail": "You do not have permission to perform this action."
}

// Validation error
{
  "email": ["This field is required."],
  "password": ["This field may not be blank."]
}
```

---

## Pagination

All list endpoints support pagination:

**Query Parameters**:
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)

**Response Format**:
```json
{
  "count": 150,
  "next": "http://api.example.com/api/endpoint/?page=2",
  "previous": null,
  "results": [...]
}
```

---

## Filtering & Search

Most list endpoints support:
- **Filtering**: `?field=value`
- **Search**: `?search=query`
- **Ordering**: `?ordering=field` or `?ordering=-field` (descending)

**Example**:
```http
GET /api/lessons/lessons/?subject=1&difficulty_level=medium&ordering=-created_at
```

---

**Last Updated**: December 2025
