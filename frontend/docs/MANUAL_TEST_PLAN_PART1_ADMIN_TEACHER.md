# Madrasti 2.0 - Manual Test Plan
## Part 1: Admin & Teacher Roles

**Version**: 1.0
**Last Updated**: 2025-10-10
**Purpose**: Comprehensive manual testing guide for Admin and Teacher roles

---

## Test Environment Setup

### Prerequisites
- Browser: Chrome/Firefox (latest version)
- Screen resolutions to test: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- Test user accounts for each role
- Active internet connection for Cloudinary media
- Sample test data (students, classes, lessons, homework)

### Test Data Requirements
- At least 3 grades with multiple classes
- At least 5 subjects
- At least 10 students per class
- At least 5 teachers
- At least 3 parents with linked students
- Sample lessons with resources
- Sample homework assignments
- Sample attendance sessions

---

## 1. Authentication & Authorization

### 1.1 User Registration

**AUTH-001: Register new user (Admin)**
- Steps:
  1. Navigate to register page
  2. Enter valid email, password, first name, last name
  3. Select role: Admin
  4. Submit form
- Expected Result: User created successfully, redirected to login
- Status: ☐

**AUTH-002: Register with existing email**
- Steps:
  1. Try to register with already used email
- Expected Result: Error message: "Email already exists"
- Status: ☐

**AUTH-003: Register with weak password**
- Steps:
  1. Enter password less than 8 characters
- Expected Result: Validation error displayed
- Status: ☐

**AUTH-004: Register with invalid email**
- Steps:
  1. Enter invalid email format
- Expected Result: Email validation error
- Status: ☐

### 1.2 User Login

**AUTH-005: Login as Admin**
- Steps:
  1. Enter admin credentials
  2. Click login
- Expected Result: Redirected to Admin dashboard
- Status: ☐

**AUTH-006: Login as Teacher**
- Steps:
  1. Enter teacher credentials
  2. Click login
- Expected Result: Redirected to Teacher dashboard
- Status: ☐

**AUTH-007: Login as Student**
- Steps:
  1. Enter student credentials
  2. Click login
- Expected Result: Redirected to Student dashboard
- Status: ☐

**AUTH-008: Login as Parent**
- Steps:
  1. Enter parent credentials
  2. Click login
- Expected Result: Redirected to Parent dashboard
- Status: ☐

**AUTH-009: Login with wrong password**
- Steps:
  1. Enter valid email, wrong password
- Expected Result: Error: "Invalid credentials"
- Status: ☐

**AUTH-010: Login with non-existent email**
- Steps:
  1. Enter email not in system
- Expected Result: Error: "Invalid credentials"
- Status: ☐

### 1.3 Session Management

**AUTH-011: JWT token refresh**
- Steps:
  1. Login and wait for token expiry
  2. Perform action
- Expected Result: Token auto-refreshed, action succeeds
- Status: ☐

**AUTH-012: Logout functionality**
- Steps:
  1. Click logout button
- Expected Result: User logged out, redirected to login
- Status: ☐

**AUTH-013: Access protected route without login**
- Steps:
  1. Navigate to dashboard URL without logging in
- Expected Result: Redirected to login page
- Status: ☐

**AUTH-014: Session timeout**
- Steps:
  1. Login, wait for session timeout
  2. Try to access page
- Expected Result: Session expired, redirected to login
- Status: ☐

### 1.4 Password Management

**AUTH-015: Change password**
- Steps:
  1. Navigate to profile
  2. Click change password
  3. Enter old and new passwords
  4. Submit
- Expected Result: Password changed successfully
- Status: ☐

**AUTH-016: Force password change on first login**
- Steps:
  1. Login with account marked for password change
- Expected Result: Forced to change password screen
- Status: ☐

---

## 2. Admin Role Tests

### 2.1 School Configuration Management

#### School Details

**ADMIN-001: View school details**
- Steps:
  1. Login as admin
  2. Navigate to School Details page
- Expected Result: School info displayed correctly
- Status: ☐

**ADMIN-002: Edit school basic info**
- Steps:
  1. Go to School Details
  2. Click Edit
  3. Update name, phone, email
  4. Save
- Expected Result: School info updated successfully
- Status: ☐

**ADMIN-003: Update school multilingual names**
- Steps:
  1. Edit school
  2. Update Arabic and French names
  3. Save
- Expected Result: All language versions saved
- Status: ☐

**ADMIN-004: Upload school logo**
- Steps:
  1. Edit school
  2. Upload logo image
  3. Save
- Expected Result: Logo uploaded and displayed
- Status: ☐

**ADMIN-005: Update school address**
- Steps:
  1. Edit school
  2. Update address, city, region, postal code
  3. Save
- Expected Result: Address updated successfully
- Status: ☐

#### Academic Year Management

**ADMIN-006: Create new academic year**
- Steps:
  1. Navigate to Academic Years
  2. Click Add New
  3. Enter year (e.g., "2024-2025")
  4. Set start and end dates
  5. Save
- Expected Result: Academic year created
- Status: ☐

**ADMIN-007: View all academic years**
- Steps:
  1. Go to Academic Years page
- Expected Result: List of all academic years displayed
- Status: ☐

**ADMIN-008: Edit academic year**
- Steps:
  1. Click edit on an academic year
  2. Modify dates
  3. Save
- Expected Result: Academic year updated
- Status: ☐

**ADMIN-009: Set current academic year**
- Steps:
  1. Select an academic year
  2. Mark as current
  3. Save
- Expected Result: Only one year marked as current
- Status: ☐

**ADMIN-010: Delete academic year**
- Steps:
  1. Select academic year with no dependencies
  2. Click delete
  3. Confirm
- Expected Result: Academic year deleted
- Status: ☐

**ADMIN-011: Delete academic year with dependencies**
- Steps:
  1. Try to delete year with classes
- Expected Result: Error: Cannot delete, has dependencies
- Status: ☐

#### Educational Levels Management

**ADMIN-012: Create educational level**
- Steps:
  1. Navigate to Educational Levels
  2. Click Add New
  3. Select level type (e.g., PRIMARY)
  4. Enter names in 3 languages
  5. Set order
  6. Save
- Expected Result: Educational level created
- Status: ☐

**ADMIN-013: View all educational levels**
- Steps:
  1. Go to Educational Levels page
- Expected Result: List displayed in order
- Status: ☐

**ADMIN-014: Edit educational level**
- Steps:
  1. Click edit
  2. Modify names
  3. Save
- Expected Result: Level updated successfully
- Status: ☐

**ADMIN-015: Reorder educational levels**
- Steps:
  1. Change order numbers
  2. Save
- Expected Result: Levels reordered correctly
- Status: ☐

**ADMIN-016: Delete educational level**
- Steps:
  1. Select level with no grades
  2. Delete
- Expected Result: Level deleted successfully
- Status: ☐

#### Grade Management

**ADMIN-017: Create new grade**
- Steps:
  1. Navigate to Grades
  2. Click Add Grade
  3. Select educational level
  4. Enter grade number, code, names (3 languages)
  5. Set passing grade
  6. Save
- Expected Result: Grade created successfully
- Status: ☐

**ADMIN-018: View all grades**
- Steps:
  1. Go to Grades page
- Expected Result: All grades displayed by level and order
- Status: ☐

**ADMIN-019: Edit grade details**
- Steps:
  1. Click edit on a grade
  2. Modify names, passing grade
  3. Save
- Expected Result: Grade updated
- Status: ☐

**ADMIN-020: View grade details**
- Steps:
  1. Click view on a grade
- Expected Result: Shows grade info, subjects, classes
- Status: ☐

**ADMIN-021: Delete grade**
- Steps:
  1. Select grade with no classes
  2. Click delete
- Expected Result: Grade deleted
- Status: ☐

**ADMIN-022: Filter grades by educational level**
- Steps:
  1. Select educational level filter
- Expected Result: Only grades from that level shown
- Status: ☐

#### Track Management

**ADMIN-023: Create track**
- Steps:
  1. Navigate to Tracks
  2. Click Add Track
  3. Select grade
  4. Enter track name, code (3 languages)
  5. Add description
  6. Set order
  7. Save
- Expected Result: Track created
- Status: ☐

**ADMIN-024: View all tracks**
- Steps:
  1. Go to Tracks page
- Expected Result: All tracks listed by grade
- Status: ☐

**ADMIN-025: Edit track**
- Steps:
  1. Click edit
  2. Modify details
  3. Save
- Expected Result: Track updated
- Status: ☐

**ADMIN-026: Deactivate track**
- Steps:
  1. Edit track
  2. Set is_active to false
  3. Save
- Expected Result: Track deactivated
- Status: ☐

**ADMIN-027: Delete track**
- Steps:
  1. Select track with no classes
  2. Delete
- Expected Result: Track deleted
- Status: ☐

### 2.2 Class Management

**ADMIN-028: Create new class**
- Steps:
  1. Navigate to Classes
  2. Click Add Class
  3. Select grade, track (optional), academic year
  4. Enter section (e.g., "A")
  5. Save
- Expected Result: Class created with auto-generated name
- Status: ☐

**ADMIN-029: View all classes**
- Steps:
  1. Go to Classes page
- Expected Result: All classes displayed with grade, section, year
- Status: ☐

**ADMIN-030: Edit class**
- Steps:
  1. Click edit on a class
  2. Change section or track
  3. Save
- Expected Result: Class updated
- Status: ☐

**ADMIN-031: View class details**
- Steps:
  1. Click view on a class
- Expected Result: Shows students, teachers, schedule
- Status: ☐

**ADMIN-032: Assign teachers to class**
- Steps:
  1. Edit class
  2. Select multiple teachers
  3. Save
- Expected Result: Teachers assigned to class
- Status: ☐

**ADMIN-033: Remove teacher from class**
- Steps:
  1. Edit class
  2. Deselect teacher
  3. Save
- Expected Result: Teacher removed from class
- Status: ☐

**ADMIN-034: Filter classes by grade**
- Steps:
  1. Select grade filter
- Expected Result: Only classes from that grade shown
- Status: ☐

**ADMIN-035: Filter classes by academic year**
- Steps:
  1. Select year filter
- Expected Result: Only classes from that year shown
- Status: ☐

**ADMIN-036: Delete empty class**
- Steps:
  1. Select class with no students
  2. Delete
- Expected Result: Class deleted
- Status: ☐

**ADMIN-037: Try to delete class with students**
- Steps:
  1. Try to delete class with students
- Expected Result: Warning: Cannot delete or move students first
- Status: ☐

### 2.3 Subject Management

**ADMIN-038: Create new subject**
- Steps:
  1. Navigate to Subjects
  2. Click Add Subject
  3. Enter names (3 languages)
  4. Enter unique code
  5. Save
- Expected Result: Subject created
- Status: ☐

**ADMIN-039: View all subjects**
- Steps:
  1. Go to Subjects page
- Expected Result: All subjects listed with codes
- Status: ☐

**ADMIN-040: Edit subject**
- Steps:
  1. Click edit
  2. Modify names
  3. Save
- Expected Result: Subject updated
- Status: ☐

**ADMIN-041: Delete subject**
- Steps:
  1. Select subject with no dependencies
  2. Delete
- Expected Result: Subject deleted
- Status: ☐

**ADMIN-042: Create duplicate subject code**
- Steps:
  1. Try to create subject with existing code
- Expected Result: Error: Code must be unique
- Status: ☐

**ADMIN-043: Link subject to grade**
- Steps:
  1. Edit subject
  2. Add grade configuration
  3. Set weekly hours, coefficient
  4. Mark as mandatory/optional
  5. Save
- Expected Result: Subject-grade link created
- Status: ☐

**ADMIN-044: Edit subject-grade config**
- Steps:
  1. Modify weekly hours or coefficient
  2. Save
- Expected Result: Configuration updated
- Status: ☐

**ADMIN-045: Remove subject from grade**
- Steps:
  1. Delete subject-grade link
- Expected Result: Link removed successfully
- Status: ☐

### 2.4 Room Management

**ADMIN-046: Create new room**
- Steps:
  1. Navigate to Rooms
  2. Click Add Room
  3. Enter name, unique code
  4. Select room type
  5. Set capacity
  6. Save
- Expected Result: Room created
- Status: ☐

**ADMIN-047: View all rooms**
- Steps:
  1. Go to Rooms page
- Expected Result: All rooms listed with types and capacity
- Status: ☐

**ADMIN-048: Edit room details**
- Steps:
  1. Click edit
  2. Modify name, type, capacity
  3. Save
- Expected Result: Room updated
- Status: ☐

**ADMIN-049: View room details**
- Steps:
  1. Click view on room
- Expected Result: Shows room info and gallery
- Status: ☐

**ADMIN-050: Upload room images**
- Steps:
  1. Edit room
  2. Upload multiple images
  3. Save
- Expected Result: Images uploaded to gallery
- Status: ☐

**ADMIN-051: Set featured room image**
- Steps:
  1. In room gallery
  2. Mark image as featured
- Expected Result: Image set as featured
- Status: ☐

**ADMIN-052: Delete room image**
- Steps:
  1. In room gallery
  2. Delete an image
- Expected Result: Image removed
- Status: ☐

**ADMIN-053: Delete room**
- Steps:
  1. Select room
  2. Click delete
- Expected Result: Room deleted
- Status: ☐

**ADMIN-054: Filter rooms by type**
- Steps:
  1. Select room type filter
- Expected Result: Only rooms of that type shown
- Status: ☐

### 2.5 Teacher Management

**ADMIN-055: Add new teacher**
- Steps:
  1. Navigate to Teachers
  2. Click Add Teacher
  3. Enter email, name (English & Arabic)
  4. Add phone, date of birth
  5. Select subject specialization
  6. Select teachable grades
  7. Set hire date, salary
  8. Save
- Expected Result: Teacher account created
- Status: ☐

**ADMIN-056: View all teachers**
- Steps:
  1. Go to Teachers page
- Expected Result: All teachers listed with subjects
- Status: ☐

**ADMIN-057: Edit teacher profile**
- Steps:
  1. Click edit on teacher
  2. Update personal info
  3. Save
- Expected Result: Teacher profile updated
- Status: ☐

**ADMIN-058: View teacher details**
- Steps:
  1. Click view on teacher
- Expected Result: Shows full profile, classes, schedule
- Status: ☐

**ADMIN-059: Upload teacher profile picture**
- Steps:
  1. Edit teacher
  2. Upload profile picture
  3. Save
- Expected Result: Profile picture updated
- Status: ☐

**ADMIN-060: Add emergency contact**
- Steps:
  1. Edit teacher
  2. Add emergency contact name and phone
  3. Save
- Expected Result: Emergency contact saved
- Status: ☐

**ADMIN-061: Update teacher salary**
- Steps:
  1. Edit teacher
  2. Update salary
  3. Save
- Expected Result: Salary updated
- Status: ☐

**ADMIN-062: Deactivate teacher**
- Steps:
  1. Edit teacher
  2. Set is_active to false
  3. Save
- Expected Result: Teacher deactivated
- Status: ☐

**ADMIN-063: Delete teacher**
- Steps:
  1. Select teacher
  2. Click delete
  3. Confirm
- Expected Result: Teacher account deleted
- Status: ☐

**ADMIN-064: Filter teachers by subject**
- Steps:
  1. Select subject filter
- Expected Result: Only teachers of that subject shown
- Status: ☐

**ADMIN-065: Search teachers by name**
- Steps:
  1. Enter teacher name in search
- Expected Result: Matching teachers displayed
- Status: ☐

### 2.6 Student Management

**ADMIN-066: Add new student**
- Steps:
  1. Navigate to Students
  2. Click Add Student
  3. Enter email, names (EN & AR)
  4. Add phone, date of birth
  5. Add address
  6. Save
- Expected Result: Student account created
- Status: ☐

**ADMIN-067: View all students**
- Steps:
  1. Go to Students page
- Expected Result: All students listed with classes
- Status: ☐

**ADMIN-068: Edit student profile**
- Steps:
  1. Click edit
  2. Update personal info
  3. Save
- Expected Result: Student profile updated
- Status: ☐

**ADMIN-069: View student details**
- Steps:
  1. Click view
- Expected Result: Shows profile, enrollments, performance
- Status: ☐

**ADMIN-070: Upload student profile picture**
- Steps:
  1. Edit student
  2. Upload picture
  3. Save
- Expected Result: Picture uploaded
- Status: ☐

**ADMIN-071: Link student to parent**
- Steps:
  1. Edit student
  2. Select parent from dropdown
  3. Save
- Expected Result: Student linked to parent
- Status: ☐

**ADMIN-072: Deactivate student**
- Steps:
  1. Edit student
  2. Set is_active to false
  3. Save
- Expected Result: Student deactivated
- Status: ☐

**ADMIN-073: Delete student**
- Steps:
  1. Select student
  2. Delete
- Expected Result: Student account deleted
- Status: ☐

**ADMIN-074: Filter students by class**
- Steps:
  1. Select class filter
- Expected Result: Only students from that class shown
- Status: ☐

**ADMIN-075: Search students by name**
- Steps:
  1. Enter student name
- Expected Result: Matching students displayed
- Status: ☐

**ADMIN-076: Enroll student in class**
- Steps:
  1. Go to student details
  2. Click Add Enrollment
  3. Select class and academic year
  4. Enter student number
  5. Set enrollment date
  6. Save
- Expected Result: Student enrolled in class
- Status: ☐

**ADMIN-077: View student enrollments**
- Steps:
  1. Go to student details
- Expected Result: All enrollments listed
- Status: ☐

**ADMIN-078: Edit enrollment**
- Steps:
  1. Click edit on enrollment
  2. Update student number
  3. Save
- Expected Result: Enrollment updated
- Status: ☐

**ADMIN-079: Deactivate enrollment**
- Steps:
  1. Edit enrollment
  2. Set is_active to false
  3. Save
- Expected Result: Enrollment deactivated
- Status: ☐

**ADMIN-080: Transfer student to another class**
- Steps:
  1. Create new enrollment in target class
  2. Deactivate old enrollment
- Expected Result: Student transferred
- Status: ☐

**ADMIN-081: Prevent duplicate enrollment**
- Steps:
  1. Try to enroll student in same class/year twice
- Expected Result: Error: Already enrolled
- Status: ☐

**ADMIN-082: Download import template**
- Steps:
  1. Go to Bulk Import page
  2. Click download template
- Expected Result: Excel template downloaded
- Status: ☐

**ADMIN-083: Import valid student list**
- Steps:
  1. Upload filled template
  2. Map columns
  3. Start import
- Expected Result: Students imported successfully
- Status: ☐

**ADMIN-084: Import with errors**
- Steps:
  1. Upload file with invalid data
- Expected Result: Errors highlighted with details
- Status: ☐

**ADMIN-085: View import progress**
- Steps:
  1. During import
  2. Check progress
- Expected Result: Real-time progress shown
- Status: ☐

**ADMIN-086: View import results**
- Steps:
  1. After import completes
  2. View results
- Expected Result: Success/failure count with details
- Status: ☐

**ADMIN-087: Import duplicate students**
- Steps:
  1. Try to import existing students
- Expected Result: Duplicates skipped or updated per settings
- Status: ☐

### 2.7 Parent Management

**ADMIN-088: Add new parent**
- Steps:
  1. Navigate to Parents
  2. Click Add Parent
  3. Enter email, names
  4. Add phone
  5. Save
- Expected Result: Parent account created
- Status: ☐

**ADMIN-089: View all parents**
- Steps:
  1. Go to Parents page
- Expected Result: All parents listed
- Status: ☐

**ADMIN-090: Edit parent profile**
- Steps:
  1. Click edit
  2. Update info
  3. Save
- Expected Result: Parent profile updated
- Status: ☐

**ADMIN-091: View parent details**
- Steps:
  1. Click view
- Expected Result: Shows profile and linked children
- Status: ☐

**ADMIN-092: Link parent to students**
- Steps:
  1. Edit parent
  2. Add children relationships
  3. Save
- Expected Result: Parent linked to students
- Status: ☐

**ADMIN-093: Delete parent**
- Steps:
  1. Select parent
  2. Delete
- Expected Result: Parent account deleted
- Status: ☐

### 2.8 Staff Management

**ADMIN-094: Add staff member**
- Steps:
  1. Navigate to Staff
  2. Click Add Staff
  3. Enter details
  4. Set department, position
  5. Save
- Expected Result: Staff account created
- Status: ☐

**ADMIN-095: View all staff**
- Steps:
  1. Go to Staff page
- Expected Result: All staff members listed
- Status: ☐

**ADMIN-096: Edit staff profile**
- Steps:
  1. Click edit
  2. Update info
  3. Save
- Expected Result: Staff profile updated
- Status: ☐

**ADMIN-097: View staff details**
- Steps:
  1. Click view
- Expected Result: Shows full profile
- Status: ☐

**ADMIN-098: Delete staff**
- Steps:
  1. Select staff
  2. Delete
- Expected Result: Staff account deleted
- Status: ☐

### 2.9 Timetable Management

**ADMIN-099: Create timetable for class**
- Steps:
  1. Navigate to Timetables
  2. Click Add Timetable
  3. Select class and academic year
  4. Save
- Expected Result: Timetable created
- Status: ☐

**ADMIN-100: View all timetables**
- Steps:
  1. Go to Timetables page
- Expected Result: All timetables listed by class
- Status: ☐

**ADMIN-101: Add session to timetable**
- Steps:
  1. Open timetable
  2. Click Add Session
  3. Select day, subject, teacher
  4. Set start/end times, order
  5. Assign room
  6. Save
- Expected Result: Session added to timetable
- Status: ☐

**ADMIN-102: Edit timetable session**
- Steps:
  1. Click edit on session
  2. Modify time or room
  3. Save
- Expected Result: Session updated
- Status: ☐

**ADMIN-103: Delete timetable session**
- Steps:
  1. Select session
  2. Delete
- Expected Result: Session removed
- Status: ☐

**ADMIN-104: View timetable grid**
- Steps:
  1. View timetable
- Expected Result: Sessions displayed in weekly grid
- Status: ☐

**ADMIN-105: Detect teacher time conflict**
- Steps:
  1. Try to add session when teacher has another class
- Expected Result: Error: Teacher conflict
- Status: ☐

**ADMIN-106: Detect room time conflict**
- Steps:
  1. Try to book room already in use
- Expected Result: Error: Room conflict
- Status: ☐

**ADMIN-107: Set active timetable**
- Steps:
  1. Mark timetable as active
- Expected Result: Previous active timetable deactivated
- Status: ☐

### 2.10 Lesson Management (Admin)

**ADMIN-108: Create lesson**
- Steps:
  1. Navigate to Lessons
  2. Click Create Lesson
  3. Select subject, grade
  4. Select tracks
  5. Enter titles (3 languages)
  6. Add description
  7. Select cycle, set order
  8. Add objectives
  9. Set difficulty
  10. Save
- Expected Result: Lesson created
- Status: ☐

**ADMIN-109: View all lessons**
- Steps:
  1. Go to Lessons page
- Expected Result: All lessons listed by subject/grade
- Status: ☐

**ADMIN-110: Edit lesson**
- Steps:
  1. Click edit
  2. Modify content
  3. Save
- Expected Result: Lesson updated
- Status: ☐

**ADMIN-111: View lesson details**
- Steps:
  1. Click view
- Expected Result: Shows lesson content and resources
- Status: ☐

**ADMIN-112: Delete lesson**
- Steps:
  1. Select lesson
  2. Delete
- Expected Result: Lesson deleted
- Status: ☐

**ADMIN-113: Filter lessons by subject**
- Steps:
  1. Select subject filter
- Expected Result: Only lessons for that subject shown
- Status: ☐

**ADMIN-114: Filter lessons by grade**
- Steps:
  1. Select grade filter
- Expected Result: Only lessons for that grade shown
- Status: ☐

**ADMIN-115: Filter lessons by cycle**
- Steps:
  1. Select cycle filter
- Expected Result: Only lessons from that cycle shown
- Status: ☐

**ADMIN-116: Add PDF resource to lesson**
- Steps:
  1. Open lesson
  2. Click Add Resource
  3. Select type: PDF
  4. Upload PDF file
  5. Add title, description
  6. Save
- Expected Result: PDF resource added
- Status: ☐

**ADMIN-117: Add video resource**
- Steps:
  1. Add resource
  2. Select type: Video
  3. Upload video or add YouTube link
  4. Save
- Expected Result: Video resource added
- Status: ☐

**ADMIN-118: Add image resource**
- Steps:
  1. Add resource
  2. Select type: Image
  3. Upload image
  4. Save
- Expected Result: Image added
- Status: ☐

**ADMIN-119: Add external link resource**
- Steps:
  1. Add resource
  2. Select type: Link
  3. Enter URL
  4. Save
- Expected Result: Link resource added
- Status: ☐

**ADMIN-120: Reorder lesson resources**
- Steps:
  1. Drag resources to reorder
  2. Save
- Expected Result: Resources reordered
- Status: ☐

**ADMIN-121: Set resource visibility**
- Steps:
  1. Edit resource
  2. Toggle "Visible to students"
  3. Save
- Expected Result: Visibility updated
- Status: ☐

**ADMIN-122: Set resource downloadable**
- Steps:
  1. Edit resource
  2. Toggle "Downloadable"
  3. Save
- Expected Result: Download permission updated
- Status: ☐

**ADMIN-123: Delete resource**
- Steps:
  1. Select resource
  2. Delete
- Expected Result: Resource removed
- Status: ☐

### 2.11 Exercise Management (Admin)

**ADMIN-124: Create exercise**
- Steps:
  1. Navigate to Exercises
  2. Click Create
  3. Link to lesson
  4. Enter title, description
  5. Set format, difficulty
  6. Save
- Expected Result: Exercise created
- Status: ☐

**ADMIN-125: View all exercises**
- Steps:
  1. Go to Exercises page
- Expected Result: All exercises listed
- Status: ☐

**ADMIN-126: Edit exercise**
- Steps:
  1. Click edit
  2. Modify details
  3. Save
- Expected Result: Exercise updated
- Status: ☐

**ADMIN-127: View exercise details**
- Steps:
  1. Click view
- Expected Result: Shows exercise and questions
- Status: ☐

**ADMIN-128: Delete exercise**
- Steps:
  1. Select exercise
  2. Delete
- Expected Result: Exercise deleted
- Status: ☐

### 2.12 Attendance Reports (Admin)

**ADMIN-129: View daily attendance report**
- Steps:
  1. Navigate to Attendance Reports
  2. Select date
  3. View report
- Expected Result: All class attendance shown for date
- Status: ☐

**ADMIN-130: View class attendance statistics**
- Steps:
  1. Select class
  2. Select date range
  3. View stats
- Expected Result: Attendance rates, charts displayed
- Status: ☐

**ADMIN-131: View student attendance history**
- Steps:
  1. Select student
  2. View attendance history
- Expected Result: All attendance records shown
- Status: ☐

**ADMIN-132: Export attendance report**
- Steps:
  1. Generate report
  2. Click export
- Expected Result: Report exported to Excel/PDF
- Status: ☐

**ADMIN-133: View absence flags**
- Steps:
  1. Navigate to Absence Flags
  2. Filter by pending
- Expected Result: All pending flags listed
- Status: ☐

---

## 3. Teacher Role Tests

### 3.1 Teacher Dashboard

**TCHR-001: View teacher dashboard**
- Steps:
  1. Login as teacher
  2. View dashboard
- Expected Result: Shows today's schedule, upcoming classes
- Status: ☐

**TCHR-002: View quick stats**
- Steps:
  1. Check dashboard widgets
- Expected Result: Shows student count, homework pending, etc.
- Status: ☐

### 3.2 My Classes

**TCHR-003: View my classes**
- Steps:
  1. Navigate to My Classes
- Expected Result: All assigned classes displayed
- Status: ☐

**TCHR-004: View class details**
- Steps:
  1. Click on a class
- Expected Result: Shows students list, schedule
- Status: ☐

**TCHR-005: View class roster**
- Steps:
  1. Open class
  2. View students tab
- Expected Result: All enrolled students listed
- Status: ☐

**TCHR-006: View student profile**
- Steps:
  1. Click on student name
- Expected Result: Shows student details, performance
- Status: ☐

### 3.3 My Schedule

**TCHR-007: View weekly schedule**
- Steps:
  1. Navigate to My Schedule
- Expected Result: Weekly timetable displayed
- Status: ☐

**TCHR-008: View today's sessions**
- Steps:
  1. Check today's schedule
- Expected Result: Sessions listed with times, rooms
- Status: ☐

**TCHR-009: View session details**
- Steps:
  1. Click on a session
- Expected Result: Shows class, room, students
- Status: ☐

### 3.4 Lesson Management (Teacher)

**TCHR-010: Create new lesson**
- Steps:
  1. Navigate to Lessons
  2. Click Create Lesson
  3. Select from my subjects/grades
  4. Enter content
  5. Save
- Expected Result: Lesson created
- Status: ☐

**TCHR-011: View my lessons**
- Steps:
  1. Go to Lessons page
- Expected Result: All my created lessons displayed
- Status: ☐

**TCHR-012: Edit my lesson**
- Steps:
  1. Click edit
  2. Modify content
  3. Save
- Expected Result: Lesson updated
- Status: ☐

**TCHR-013: View lesson**
- Steps:
  1. Click on lesson
- Expected Result: Shows full lesson content
- Status: ☐

**TCHR-014: Delete my lesson**
- Steps:
  1. Select lesson
  2. Delete
- Expected Result: Lesson deleted
- Status: ☐

**TCHR-015: Filter lessons by subject**
- Steps:
  1. Select subject filter
- Expected Result: Only that subject's lessons shown
- Status: ☐

**TCHR-016: Filter lessons by grade**
- Steps:
  1. Select grade filter
- Expected Result: Only that grade's lessons shown
- Status: ☐

**TCHR-017: Add PDF to lesson**
- Steps:
  1. Open lesson
  2. Add resource
  3. Upload PDF
  4. Save
- Expected Result: PDF added
- Status: ☐

**TCHR-018: Add video to lesson**
- Steps:
  1. Add resource
  2. Upload video file
  3. Save
- Expected Result: Video uploaded and added
- Status: ☐

**TCHR-019: Add YouTube link**
- Steps:
  1. Add resource
  2. Enter YouTube URL
  3. Save
- Expected Result: YouTube video linked
- Status: ☐

**TCHR-020: Add presentation**
- Steps:
  1. Add resource
  2. Upload PowerPoint
  3. Save
- Expected Result: Presentation added
- Status: ☐

**TCHR-021: Reorder resources**
- Steps:
  1. Drag to reorder
  2. Save
- Expected Result: Order updated
- Status: ☐

**TCHR-022: Delete resource**
- Steps:
  1. Select resource
  2. Delete
- Expected Result: Resource removed
- Status: ☐

### 3.5 Lesson Exercises (Teacher)

**TCHR-023: Create lesson exercise**
- Steps:
  1. Navigate to lesson
  2. Click Create Exercise
  3. Enter title, description
  4. Select format
  5. Set difficulty
  6. Save
- Expected Result: Exercise created
- Status: ☐

**TCHR-024: View lesson exercises**
- Steps:
  1. Open lesson
  2. Go to Exercises tab
- Expected Result: All exercises for lesson shown
- Status: ☐

**TCHR-025: Edit exercise**
- Steps:
  1. Click edit
  2. Modify details
  3. Save
- Expected Result: Exercise updated
- Status: ☐

**TCHR-026: Delete exercise**
- Steps:
  1. Select exercise
  2. Delete
- Expected Result: Exercise deleted
- Status: ☐

**TCHR-027: Add QCM single choice question**
- Steps:
  1. Open exercise
  2. Add question
  3. Select type: QCM Single
  4. Enter question text
  5. Add choices (mark one correct)
  6. Set points
  7. Save
- Expected Result: QCM question added
- Status: ☐

**TCHR-028: Add QCM multiple choice question**
- Steps:
  1. Add question
  2. Type: QCM Multiple
  3. Add choices (mark multiple correct)
  4. Save
- Expected Result: Multi-choice question added
- Status: ☐

**TCHR-029: Add open short question**
- Steps:
  1. Add question
  2. Type: Open Short
  3. Enter question
  4. Save
- Expected Result: Open question added
- Status: ☐

**TCHR-030: Add open long question**
- Steps:
  1. Add question
  2. Type: Open Long
  3. Enter question
  4. Save
- Expected Result: Essay question added
- Status: ☐

**TCHR-031: Add true/false question**
- Steps:
  1. Add question
  2. Type: True/False
  3. Enter question
  4. Set correct answer
  5. Save
- Expected Result: T/F question added
- Status: ☐

**TCHR-032: Add fill-in-the-blank question**
- Steps:
  1. Add question
  2. Type: Fill Blank
  3. Define blanks
  4. Add options for each blank
  5. Save
- Expected Result: Fill blank question added
- Status: ☐

**TCHR-033: Add matching question**
- Steps:
  1. Add question
  2. Type: Matching
  3. Create pairs
  4. Save
- Expected Result: Matching question added
- Status: ☐

**TCHR-034: Add ordering question**
- Steps:
  1. Add question
  2. Type: Ordering
  3. Add items with correct order
  4. Save
- Expected Result: Ordering question added
- Status: ☐

**TCHR-035: Add image to question**
- Steps:
  1. Edit question
  2. Upload question image
  3. Save
- Expected Result: Image attached to question
- Status: ☐

**TCHR-036: Add explanation to question**
- Steps:
  1. Edit question
  2. Add explanation text
  3. Save
- Expected Result: Explanation added
- Status: ☐

**TCHR-037: Reorder questions**
- Steps:
  1. Drag questions
  2. Save
- Expected Result: Questions reordered
- Status: ☐

**TCHR-038: Delete question**
- Steps:
  1. Select question
  2. Delete
- Expected Result: Question removed
- Status: ☐

**TCHR-039: Set question as optional**
- Steps:
  1. Edit question
  2. Uncheck "Required"
  3. Save
- Expected Result: Question made optional
- Status: ☐

### 3.6 Homework Management (Teacher)

**TCHR-040: Create homework assignment**
- Steps:
  1. Navigate to Homework
  2. Click Create Homework
  3. Select subject, grade, class
  4. Link to lesson (optional)
  5. Enter title, description, instructions
  6. Select homework type
  7. Set due date
  8. Set total points
  9. Save
- Expected Result: Homework created (draft)
- Status: ☐

**TCHR-041: Set homework format**
- Steps:
  1. Create homework
  2. Select format (Mixed, QCM only, Open only, Book exercises)
  3. Save
- Expected Result: Format set
- Status: ☐

**TCHR-042: Set time limit**
- Steps:
  1. Create homework
  2. Check "Is timed"
  3. Set time limit in minutes
  4. Save
- Expected Result: Time limit set
- Status: ☐

**TCHR-043: Set estimated duration**
- Steps:
  1. Create homework
  2. Enter estimated duration
  3. Save
- Expected Result: Duration set
- Status: ☐

**TCHR-044: Allow multiple attempts**
- Steps:
  1. Create homework
  2. Check "Allow multiple attempts"
  3. Set max attempts
  4. Save
- Expected Result: Multiple attempts enabled
- Status: ☐

**TCHR-045: Set late submission policy**
- Steps:
  1. Create homework
  2. Check "Allow late submissions"
  3. Set late penalty percentage
  4. Save
- Expected Result: Late policy set
- Status: ☐

**TCHR-046: Enable auto-grading**
- Steps:
  1. Create homework
  2. Check "Auto-grade QCM"
  3. Save
- Expected Result: Auto-grading enabled
- Status: ☐

**TCHR-047: Show results immediately**
- Steps:
  1. Create homework
  2. Check "Show results immediately"
  3. Save
- Expected Result: Immediate results enabled
- Status: ☐

**TCHR-048: Randomize questions**
- Steps:
  1. Create homework
  2. Check "Randomize questions"
  3. Save
- Expected Result: Question randomization enabled
- Status: ☐

**TCHR-049: Add QCM to homework**
- Steps:
  1. Open homework
  2. Add question
  3. Create QCM question
  4. Save
- Expected Result: QCM added to homework
- Status: ☐

**TCHR-050: Add open question to homework**
- Steps:
  1. Add question
  2. Create open question
  3. Save
- Expected Result: Open question added
- Status: ☐

**TCHR-051: Add book exercise reference**
- Steps:
  1. Open homework
  2. Click Add Book Exercise
  3. Enter book title, chapter
  4. Enter page number, exercise number
  5. Add specific questions
  6. Upload page image (optional)
  7. Set points
  8. Save
- Expected Result: Book exercise added
- Status: ☐

**TCHR-052: Edit book exercise**
- Steps:
  1. Click edit
  2. Modify details
  3. Save
- Expected Result: Book exercise updated
- Status: ☐

**TCHR-053: Delete book exercise**
- Steps:
  1. Select book exercise
  2. Delete
- Expected Result: Book exercise removed
- Status: ☐

**TCHR-054: Publish homework**
- Steps:
  1. Open draft homework
  2. Review all settings
  3. Click Publish
- Expected Result: Homework published, visible to students
- Status: ☐

**TCHR-055: Unpublish homework**
- Steps:
  1. Open published homework
  2. Click Unpublish
- Expected Result: Homework hidden from students
- Status: ☐

**TCHR-056: Try to publish homework without questions**
- Steps:
  1. Create homework with no questions
  2. Try to publish
- Expected Result: Error: Must have at least one question
- Status: ☐

**TCHR-057: View all my homework**
- Steps:
  1. Navigate to Homework page
- Expected Result: All created homework listed
- Status: ☐

**TCHR-058: View homework details**
- Steps:
  1. Click on homework
- Expected Result: Shows full details, questions, submissions
- Status: ☐

**TCHR-059: Edit published homework**
- Steps:
  1. Edit published homework
  2. Modify details
  3. Save
- Expected Result: Homework updated (note: affects active submissions)
- Status: ☐

**TCHR-060: Delete homework**
- Steps:
  1. Select homework with no submissions
  2. Delete
- Expected Result: Homework deleted
- Status: ☐

**TCHR-061: Try to delete homework with submissions**
- Steps:
  1. Try to delete homework with submissions
- Expected Result: Warning: Cannot delete or must archive
- Status: ☐

**TCHR-062: Filter homework by class**
- Steps:
  1. Select class filter
- Expected Result: Only homework for that class shown
- Status: ☐

**TCHR-063: Filter homework by subject**
- Steps:
  1. Select subject filter
- Expected Result: Only homework for that subject shown
- Status: ☐

**TCHR-064: Filter homework by status**
- Steps:
  1. Select status (draft/published)
- Expected Result: Only homework with that status shown
- Status: ☐

**TCHR-065: View submission count**
- Steps:
  1. View homework list
- Expected Result: Submission count shown for each
- Status: ☐

### 3.7 Grading & Assessment

**TCHR-066: View homework submissions**
- Steps:
  1. Open homework
  2. Go to Submissions tab
- Expected Result: All student submissions listed
- Status: ☐

**TCHR-067: View submission details**
- Steps:
  1. Click on submission
- Expected Result: Shows all answers and scores
- Status: ☐

**TCHR-068: Grade open question**
- Steps:
  1. Open submission
  2. View open question answer
  3. Enter points
  4. Add feedback
  5. Save
- Expected Result: Question graded
- Status: ☐

**TCHR-069: Grade book exercise**
- Steps:
  1. View book exercise answer
  2. Review uploaded files
  3. Enter points
  4. Add feedback
  5. Save
- Expected Result: Book exercise graded
- Status: ☐

**TCHR-070: Add general submission feedback**
- Steps:
  1. Open submission
  2. Add general comment
  3. Save
- Expected Result: Feedback added
- Status: ☐

**TCHR-071: View auto-graded QCM results**
- Steps:
  1. Open submission with QCM
  2. View QCM scores
- Expected Result: Auto-calculated scores shown
- Status: ☐

**TCHR-072: Override auto-grade**
- Steps:
  1. View auto-graded answer
  2. Manually adjust points
  3. Save
- Expected Result: Manual score overrides auto-grade
- Status: ☐

**TCHR-073: Submit final grade**
- Steps:
  1. Complete grading all questions
  2. Click "Submit Grade"
- Expected Result: Total score calculated and saved
- Status: ☐

**TCHR-074: Filter submissions by status**
- Steps:
  1. Select status filter (submitted, graded, etc.)
- Expected Result: Only submissions with that status shown
- Status: ☐

**TCHR-075: Filter late submissions**
- Steps:
  1. Select "Late" filter
- Expected Result: Only late submissions shown
- Status: ☐

**TCHR-076: Sort submissions by score**
- Steps:
  1. Click score column header
- Expected Result: Submissions sorted by score
- Status: ☐

**TCHR-077: Export grades to Excel**
- Steps:
  1. View submissions
  2. Click Export
  3. Select Excel format
- Expected Result: Grades exported to Excel file
- Status: ☐

**TCHR-078: View exercise submissions**
- Steps:
  1. Open exercise
  2. View submissions
- Expected Result: All student attempts listed
- Status: ☐

**TCHR-079: View exercise statistics**
- Steps:
  1. View exercise
  2. Check stats
- Expected Result: Shows completion rate, avg score
- Status: ☐

**TCHR-080: View student progress**
- Steps:
  1. Select student
  2. View their exercises
- Expected Result: Shows all attempts and scores
- Status: ☐

### 3.8 Attendance Management (Teacher)

**TCHR-081: View today's sessions**
- Steps:
  1. Navigate to Attendance
  2. View today's schedule
- Expected Result: All sessions for today displayed
- Status: ☐

**TCHR-082: Start attendance session**
- Steps:
  1. Select session
  2. Click Start Attendance
- Expected Result: Session started, student list shown
- Status: ☐

**TCHR-083: Mark student present**
- Steps:
  1. In attendance session
  2. Mark student as present
- Expected Result: Student marked present
- Status: ☐

**TCHR-084: Mark student absent**
- Steps:
  1. Mark student as absent
  2. Add note (optional)
- Expected Result: Student marked absent
- Status: ☐

**TCHR-085: Mark student late**
- Steps:
  1. Mark student as late
  2. Enter arrival time
  3. Add note
- Expected Result: Student marked late
- Status: ☐

**TCHR-086: Mark excused absence**
- Steps:
  1. Mark student as excused
  2. Add reason
- Expected Result: Student marked excused
- Status: ☐

**TCHR-087: Bulk mark all present**
- Steps:
  1. Click "Mark All Present"
- Expected Result: All students marked present
- Status: ☐

**TCHR-088: Add attendance notes**
- Steps:
  1. Click on student
  2. Add notes
  3. Save
- Expected Result: Notes saved
- Status: ☐

**TCHR-089: Complete attendance session**
- Steps:
  1. After marking all students
  2. Click Complete
- Expected Result: Session completed, flags created for absences
- Status: ☐

**TCHR-090: Edit attendance after completion**
- Steps:
  1. Open completed session
  2. Modify attendance
  3. Save
- Expected Result: Attendance updated
- Status: ☐

**TCHR-091: View attendance history**
- Steps:
  1. Navigate to Attendance History
- Expected Result: Past sessions listed
- Status: ☐

**TCHR-092: View session details**
- Steps:
  1. Click on past session
- Expected Result: Shows all attendance records
- Status: ☐

**TCHR-093: Filter by class**
- Steps:
  1. Select class filter
- Expected Result: Only sessions for that class shown
- Status: ☐

**TCHR-094: Filter by date range**
- Steps:
  1. Select date range
  2. Apply filter
- Expected Result: Sessions in range shown
- Status: ☐

**TCHR-095: View student attendance pattern**
- Steps:
  1. Click on student
  2. View history
- Expected Result: All attendance records for student shown
- Status: ☐

**TCHR-096: Export attendance report**
- Steps:
  1. Select session
  2. Click Export
- Expected Result: Attendance exported to Excel
- Status: ☐

### 3.9 Assessment Tools

**TCHR-097: Create quiz**
- Steps:
  1. Navigate to Assessment Tools
  2. Create new homework
  3. Select type: Quiz
  4. Add questions
  5. Publish
- Expected Result: Quiz created and available
- Status: ☐

**TCHR-098: Create exam**
- Steps:
  1. Create homework
  2. Type: Exam
  3. Set timed
  4. Add questions
  5. Publish
- Expected Result: Exam created
- Status: ☐

**TCHR-099: Create project assignment**
- Steps:
  1. Create homework
  2. Type: Project
  3. Add instructions
  4. Set deadline
  5. Publish
- Expected Result: Project assignment created
- Status: ☐

### 3.10 Student Management (Teacher View)

**TCHR-100: View student profile**
- Steps:
  1. From class roster
  2. Click on student
- Expected Result: Shows student details
- Status: ☐

**TCHR-101: View student performance**
- Steps:
  1. Open student profile
  2. View grades tab
- Expected Result: All grades for my subject shown
- Status: ☐

**TCHR-102: View student attendance**
- Steps:
  1. Open student profile
  2. View attendance tab
- Expected Result: Student's attendance history shown
- Status: ☐

**TCHR-103: View student submissions**
- Steps:
  1. Open student profile
  2. View submissions tab
- Expected Result: All homework/exercise submissions shown
- Status: ☐

### 3.11 Profile & Settings (Teacher)

**TCHR-104: View my profile**
- Steps:
  1. Click on profile icon
  2. View profile
- Expected Result: Profile information displayed
- Status: ☐

**TCHR-105: Edit profile**
- Steps:
  1. Click Edit Profile
  2. Update phone, bio
  3. Save
- Expected Result: Profile updated
- Status: ☐

**TCHR-106: Update profile picture**
- Steps:
  1. Edit profile
  2. Upload new picture
  3. Save
- Expected Result: Picture updated
- Status: ☐

**TCHR-107: Change password**
- Steps:
  1. Go to settings
  2. Click Change Password
  3. Enter old and new passwords
  4. Save
- Expected Result: Password changed
- Status: ☐

---

## End of Part 1

**Continue to Part 2 for Student, Parent, Staff, and Cross-Role Tests**
