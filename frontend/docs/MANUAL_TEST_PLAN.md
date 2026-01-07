# Madrasti 2.0 - Manual Test Plan

## Document Information
- **Version**: 1.0
- **Last Updated**: 2025-10-10
- **Purpose**: Comprehensive manual testing guide for all features across all user roles

---

## Table of Contents
1. [Authentication & Authorization](#authentication--authorization)
2. [Admin Role Tests](#admin-role-tests)
3. [Teacher Role Tests](#teacher-role-tests)
4. [Student Role Tests](#student-role-tests)
5. [Parent Role Tests](#parent-role-tests)
6. [Staff Role Tests](#staff-role-tests)
7. [Cross-Role Tests](#cross-role-tests)
8. [Multilingual Support Tests](#multilingual-support-tests)

---

## Test Environment Setup

### Prerequisites
- Browser: Chrome/Firefox (latest version)
- Screen resolutions to test: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- Test user accounts for each role (Admin, Teacher, Student, Parent, Staff)
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
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| AUTH-001 | Register new user (Admin) | 1. Navigate to register page<br>2. Enter valid email, password, first name, last name<br>3. Select role: Admin<br>4. Submit form | User created successfully, redirected to login | ☐ |
| AUTH-002 | Register with existing email | 1. Try to register with already used email | Error message: "Email already exists" | ☐ |
| AUTH-003 | Register with weak password | 1. Enter password less than 8 characters | Validation error displayed | ☐ |
| AUTH-004 | Register with invalid email | 1. Enter invalid email format | Email validation error | ☐ |

### 1.2 User Login
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| AUTH-005 | Login as Admin | 1. Enter admin credentials<br>2. Click login | Redirected to Admin dashboard | ☐ |
| AUTH-006 | Login as Teacher | 1. Enter teacher credentials<br>2. Click login | Redirected to Teacher dashboard | ☐ |
| AUTH-007 | Login as Student | 1. Enter student credentials<br>2. Click login | Redirected to Student dashboard | ☐ |
| AUTH-008 | Login as Parent | 1. Enter parent credentials<br>2. Click login | Redirected to Parent dashboard | ☐ |
| AUTH-009 | Login with wrong password | 1. Enter valid email, wrong password | Error: "Invalid credentials" | ☐ |
| AUTH-010 | Login with non-existent email | 1. Enter email not in system | Error: "Invalid credentials" | ☐ |

### 1.3 Session Management
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| AUTH-011 | JWT token refresh | 1. Login and wait for token expiry<br>2. Perform action | Token auto-refreshed, action succeeds | ☐ |
| AUTH-012 | Logout functionality | 1. Click logout button | User logged out, redirected to login | ☐ |
| AUTH-013 | Access protected route without login | 1. Navigate to dashboard URL without logging in | Redirected to login page | ☐ |
| AUTH-014 | Session timeout | 1. Login, wait for session timeout<br>2. Try to access page | Session expired, redirected to login | ☐ |

### 1.4 Password Management
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| AUTH-015 | Change password | 1. Navigate to profile<br>2. Click change password<br>3. Enter old and new passwords<br>4. Submit | Password changed successfully | ☐ |
| AUTH-016 | Force password change on first login | 1. Login with account marked for password change | Forced to change password screen | ☐ |

---

## 2. Admin Role Tests

### 2.1 School Configuration Management

#### 2.1.1 School Details
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ADMIN-001 | View school details | 1. Login as admin<br>2. Navigate to School Details page | School info displayed correctly | ☐ |
| ADMIN-002 | Edit school basic info | 1. Go to School Details<br>2. Click Edit<br>3. Update name, phone, email<br>4. Save | School info updated successfully | ☐ |
| ADMIN-003 | Update school multilingual names | 1. Edit school<br>2. Update Arabic and French names<br>3. Save | All language versions saved | ☐ |
| ADMIN-004 | Upload school logo | 1. Edit school<br>2. Upload logo image<br>3. Save | Logo uploaded and displayed | ☐ |
| ADMIN-005 | Update school address | 1. Edit school<br>2. Update address, city, region, postal code<br>3. Save | Address updated successfully | ☐ |

#### 2.1.2 Academic Year Management
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ADMIN-006 | Create new academic year | 1. Navigate to Academic Years<br>2. Click Add New<br>3. Enter year (e.g., "2024-2025")<br>4. Set start and end dates<br>5. Save | Academic year created | ☐ |
| ADMIN-007 | View all academic years | 1. Go to Academic Years page | List of all academic years displayed | ☐ |
| ADMIN-008 | Edit academic year | 1. Click edit on an academic year<br>2. Modify dates<br>3. Save | Academic year updated | ☐ |
| ADMIN-009 | Set current academic year | 1. Select an academic year<br>2. Mark as current<br>3. Save | Only one year marked as current | ☐ |
| ADMIN-010 | Delete academic year | 1. Select academic year with no dependencies<br>2. Click delete<br>3. Confirm | Academic year deleted | ☐ |
| ADMIN-011 | Delete academic year with dependencies | 1. Try to delete year with classes | Error: Cannot delete, has dependencies | ☐ |

#### 2.1.3 Educational Levels Management
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ADMIN-012 | Create educational level | 1. Navigate to Educational Levels<br>2. Click Add New<br>3. Select level type (e.g., PRIMARY)<br>4. Enter names in 3 languages<br>5. Set order<br>6. Save | Educational level created | ☐ |
| ADMIN-013 | View all educational levels | 1. Go to Educational Levels page | List displayed in order | ☐ |
| ADMIN-014 | Edit educational level | 1. Click edit<br>2. Modify names<br>3. Save | Level updated successfully | ☐ |
| ADMIN-015 | Reorder educational levels | 1. Change order numbers<br>2. Save | Levels reordered correctly | ☐ |
| ADMIN-016 | Delete educational level | 1. Select level with no grades<br>2. Delete | Level deleted successfully | ☐ |

#### 2.1.4 Grade Management
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ADMIN-017 | Create new grade | 1. Navigate to Grades<br>2. Click Add Grade<br>3. Select educational level<br>4. Enter grade number, code, names (3 languages)<br>5. Set passing grade<br>6. Save | Grade created successfully | ☐ |
| ADMIN-018 | View all grades | 1. Go to Grades page | All grades displayed by level and order | ☐ |
| ADMIN-019 | Edit grade details | 1. Click edit on a grade<br>2. Modify names, passing grade<br>3. Save | Grade updated | ☐ |
| ADMIN-020 | View grade details | 1. Click view on a grade | Shows grade info, subjects, classes | ☐ |
| ADMIN-021 | Delete grade | 1. Select grade with no classes<br>2. Click delete | Grade deleted | ☐ |
| ADMIN-022 | Filter grades by educational level | 1. Select educational level filter | Only grades from that level shown | ☐ |

#### 2.1.5 Track Management
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ADMIN-023 | Create track | 1. Navigate to Tracks<br>2. Click Add Track<br>3. Select grade<br>4. Enter track name, code (3 languages)<br>5. Add description<br>6. Set order<br>7. Save | Track created | ☐ |
| ADMIN-024 | View all tracks | 1. Go to Tracks page | All tracks listed by grade | ☐ |
| ADMIN-025 | Edit track | 1. Click edit<br>2. Modify details<br>3. Save | Track updated | ☐ |
| ADMIN-026 | Deactivate track | 1. Edit track<br>2. Set is_active to false<br>3. Save | Track deactivated | ☐ |
| ADMIN-027 | Delete track | 1. Select track with no classes<br>2. Delete | Track deleted | ☐ |

### 2.2 Class Management

#### 2.2.1 Class Operations
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ADMIN-028 | Create new class | 1. Navigate to Classes<br>2. Click Add Class<br>3. Select grade, track (optional), academic year<br>4. Enter section (e.g., "A")<br>5. Save | Class created with auto-generated name | ☐ |
| ADMIN-029 | View all classes | 1. Go to Classes page | All classes displayed with grade, section, year | ☐ |
| ADMIN-030 | Edit class | 1. Click edit on a class<br>2. Change section or track<br>3. Save | Class updated | ☐ |
| ADMIN-031 | View class details | 1. Click view on a class | Shows students, teachers, schedule | ☐ |
| ADMIN-032 | Assign teachers to class | 1. Edit class<br>2. Select multiple teachers<br>3. Save | Teachers assigned to class | ☐ |
| ADMIN-033 | Remove teacher from class | 1. Edit class<br>2. Deselect teacher<br>3. Save | Teacher removed from class | ☐ |
| ADMIN-034 | Filter classes by grade | 1. Select grade filter | Only classes from that grade shown | ☐ |
| ADMIN-035 | Filter classes by academic year | 1. Select year filter | Only classes from that year shown | ☐ |
| ADMIN-036 | Delete empty class | 1. Select class with no students<br>2. Delete | Class deleted | ☐ |
| ADMIN-037 | Try to delete class with students | 1. Try to delete class with students | Warning: Cannot delete or move students first | ☐ |

### 2.3 Subject Management

#### 2.3.1 Subject Operations
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ADMIN-038 | Create new subject | 1. Navigate to Subjects<br>2. Click Add Subject<br>3. Enter names (3 languages)<br>4. Enter unique code<br>5. Save | Subject created | ☐ |
| ADMIN-039 | View all subjects | 1. Go to Subjects page | All subjects listed with codes | ☐ |
| ADMIN-040 | Edit subject | 1. Click edit<br>2. Modify names<br>3. Save | Subject updated | ☐ |
| ADMIN-041 | Delete subject | 1. Select subject with no dependencies<br>2. Delete | Subject deleted | ☐ |
| ADMIN-042 | Create duplicate subject code | 1. Try to create subject with existing code | Error: Code must be unique | ☐ |

#### 2.3.2 Subject-Grade Configuration
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ADMIN-043 | Link subject to grade | 1. Edit subject<br>2. Add grade configuration<br>3. Set weekly hours, coefficient<br>4. Mark as mandatory/optional<br>5. Save | Subject-grade link created | ☐ |
| ADMIN-044 | Edit subject-grade config | 1. Modify weekly hours or coefficient<br>2. Save | Configuration updated | ☐ |
| ADMIN-045 | Remove subject from grade | 1. Delete subject-grade link | Link removed successfully | ☐ |

### 2.4 Room Management

#### 2.4.1 Room Operations
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ADMIN-046 | Create new room | 1. Navigate to Rooms<br>2. Click Add Room<br>3. Enter name, unique code<br>4. Select room type<br>5. Set capacity<br>6. Save | Room created | ☐ |
| ADMIN-047 | View all rooms | 1. Go to Rooms page | All rooms listed with types and capacity | ☐ |
| ADMIN-048 | Edit room details | 1. Click edit<br>2. Modify name, type, capacity<br>3. Save | Room updated | ☐ |
| ADMIN-049 | View room details | 1. Click view on room | Shows room info and gallery | ☐ |
| ADMIN-050 | Upload room images | 1. Edit room<br>2. Upload multiple images<br>3. Save | Images uploaded to gallery | ☐ |
| ADMIN-051 | Set featured room image | 1. In room gallery<br>2. Mark image as featured | Image set as featured | ☐ |
| ADMIN-052 | Delete room image | 1. In room gallery<br>2. Delete an image | Image removed | ☐ |
| ADMIN-053 | Delete room | 1. Select room<br>2. Click delete | Room deleted | ☐ |
| ADMIN-054 | Filter rooms by type | 1. Select room type filter | Only rooms of that type shown | ☐ |

### 2.5 Teacher Management

#### 2.5.1 Teacher CRUD Operations
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ADMIN-055 | Add new teacher | 1. Navigate to Teachers<br>2. Click Add Teacher<br>3. Enter email, name (English & Arabic)<br>4. Add phone, date of birth<br>5. Select subject specialization<br>6. Select teachable grades<br>7. Set hire date, salary<br>8. Save | Teacher account created | ☐ |
| ADMIN-056 | View all teachers | 1. Go to Teachers page | All teachers listed with subjects | ☐ |
| ADMIN-057 | Edit teacher profile | 1. Click edit on teacher<br>2. Update personal info<br>3. Save | Teacher profile updated | ☐ |
| ADMIN-058 | View teacher details | 1. Click view on teacher | Shows full profile, classes, schedule | ☐ |
| ADMIN-059 | Upload teacher profile picture | 1. Edit teacher<br>2. Upload profile picture<br>3. Save | Profile picture updated | ☐ |
| ADMIN-060 | Add emergency contact | 1. Edit teacher<br>2. Add emergency contact name and phone<br>3. Save | Emergency contact saved | ☐ |
| ADMIN-061 | Update teacher salary | 1. Edit teacher<br>2. Update salary<br>3. Save | Salary updated | ☐ |
| ADMIN-062 | Deactivate teacher | 1. Edit teacher<br>2. Set is_active to false<br>3. Save | Teacher deactivated | ☐ |
| ADMIN-063 | Delete teacher | 1. Select teacher<br>2. Click delete<br>3. Confirm | Teacher account deleted | ☐ |
| ADMIN-064 | Filter teachers by subject | 1. Select subject filter | Only teachers of that subject shown | ☐ |
| ADMIN-065 | Search teachers by name | 1. Enter teacher name in search | Matching teachers displayed | ☐ |

### 2.6 Student Management

#### 2.6.1 Student CRUD Operations
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ADMIN-066 | Add new student | 1. Navigate to Students<br>2. Click Add Student<br>3. Enter email, names (EN & AR)<br>4. Add phone, date of birth<br>5. Add address<br>6. Save | Student account created | ☐ |
| ADMIN-067 | View all students | 1. Go to Students page | All students listed with classes | ☐ |
| ADMIN-068 | Edit student profile | 1. Click edit<br>2. Update personal info<br>3. Save | Student profile updated | ☐ |
| ADMIN-069 | View student details | 1. Click view | Shows profile, enrollments, performance | ☐ |
| ADMIN-070 | Upload student profile picture | 1. Edit student<br>2. Upload picture<br>3. Save | Picture uploaded | ☐ |
| ADMIN-071 | Link student to parent | 1. Edit student<br>2. Select parent from dropdown<br>3. Save | Student linked to parent | ☐ |
| ADMIN-072 | Deactivate student | 1. Edit student<br>2. Set is_active to false<br>3. Save | Student deactivated | ☐ |
| ADMIN-073 | Delete student | 1. Select student<br>2. Delete | Student account deleted | ☐ |
| ADMIN-074 | Filter students by class | 1. Select class filter | Only students from that class shown | ☐ |
| ADMIN-075 | Search students by name | 1. Enter student name | Matching students displayed | ☐ |

#### 2.6.2 Student Enrollment Management
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ADMIN-076 | Enroll student in class | 1. Go to student details<br>2. Click Add Enrollment<br>3. Select class and academic year<br>4. Enter student number<br>5. Set enrollment date<br>6. Save | Student enrolled in class | ☐ |
| ADMIN-077 | View student enrollments | 1. Go to student details | All enrollments listed | ☐ |
| ADMIN-078 | Edit enrollment | 1. Click edit on enrollment<br>2. Update student number<br>3. Save | Enrollment updated | ☐ |
| ADMIN-079 | Deactivate enrollment | 1. Edit enrollment<br>2. Set is_active to false<br>3. Save | Enrollment deactivated | ☐ |
| ADMIN-080 | Transfer student to another class | 1. Create new enrollment in target class<br>2. Deactivate old enrollment | Student transferred | ☐ |
| ADMIN-081 | Prevent duplicate enrollment | 1. Try to enroll student in same class/year twice | Error: Already enrolled | ☐ |

#### 2.6.3 Bulk Student Import
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ADMIN-082 | Download import template | 1. Go to Bulk Import page<br>2. Click download template | Excel template downloaded | ☐ |
| ADMIN-083 | Import valid student list | 1. Upload filled template<br>2. Map columns<br>3. Start import | Students imported successfully | ☐ |
| ADMIN-084 | Import with errors | 1. Upload file with invalid data | Errors highlighted with details | ☐ |
| ADMIN-085 | View import progress | 1. During import<br>2. Check progress | Real-time progress shown | ☐ |
| ADMIN-086 | View import results | 1. After import completes<br>2. View results | Success/failure count with details | ☐ |
| ADMIN-087 | Import duplicate students | 1. Try to import existing students | Duplicates skipped or updated per settings | ☐ |

### 2.7 Parent Management

#### 2.7.1 Parent CRUD Operations
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ADMIN-088 | Add new parent | 1. Navigate to Parents<br>2. Click Add Parent<br>3. Enter email, names<br>4. Add phone<br>5. Save | Parent account created | ☐ |
| ADMIN-089 | View all parents | 1. Go to Parents page | All parents listed | ☐ |
| ADMIN-090 | Edit parent profile | 1. Click edit<br>2. Update info<br>3. Save | Parent profile updated | ☐ |
| ADMIN-091 | View parent details | 1. Click view | Shows profile and linked children | ☐ |
| ADMIN-092 | Link parent to students | 1. Edit parent<br>2. Add children relationships<br>3. Save | Parent linked to students | ☐ |
| ADMIN-093 | Delete parent | 1. Select parent<br>2. Delete | Parent account deleted | ☐ |

### 2.8 Staff Management

#### 2.8.1 Staff CRUD Operations
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ADMIN-094 | Add staff member | 1. Navigate to Staff<br>2. Click Add Staff<br>3. Enter details<br>4. Set department, position<br>5. Save | Staff account created | ☐ |
| ADMIN-095 | View all staff | 1. Go to Staff page | All staff members listed | ☐ |
| ADMIN-096 | Edit staff profile | 1. Click edit<br>2. Update info<br>3. Save | Staff profile updated | ☐ |
| ADMIN-097 | View staff details | 1. Click view | Shows full profile | ☐ |
| ADMIN-098 | Delete staff | 1. Select staff<br>2. Delete | Staff account deleted | ☐ |

### 2.9 Timetable Management

#### 2.9.1 Timetable Operations
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ADMIN-099 | Create timetable for class | 1. Navigate to Timetables<br>2. Click Add Timetable<br>3. Select class and academic year<br>4. Save | Timetable created | ☐ |
| ADMIN-100 | View all timetables | 1. Go to Timetables page | All timetables listed by class | ☐ |
| ADMIN-101 | Add session to timetable | 1. Open timetable<br>2. Click Add Session<br>3. Select day, subject, teacher<br>4. Set start/end times, order<br>5. Assign room<br>6. Save | Session added to timetable | ☐ |
| ADMIN-102 | Edit timetable session | 1. Click edit on session<br>2. Modify time or room<br>3. Save | Session updated | ☐ |
| ADMIN-103 | Delete timetable session | 1. Select session<br>2. Delete | Session removed | ☐ |
| ADMIN-104 | View timetable grid | 1. View timetable | Sessions displayed in weekly grid | ☐ |
| ADMIN-105 | Detect teacher time conflict | 1. Try to add session when teacher has another class | Error: Teacher conflict | ☐ |
| ADMIN-106 | Detect room time conflict | 1. Try to book room already in use | Error: Room conflict | ☐ |
| ADMIN-107 | Set active timetable | 1. Mark timetable as active | Previous active timetable deactivated | ☐ |

### 2.10 Lesson Management (Admin)

#### 2.10.1 Lesson Operations
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ADMIN-108 | Create lesson | 1. Navigate to Lessons<br>2. Click Create Lesson<br>3. Select subject, grade<br>4. Select tracks<br>5. Enter titles (3 languages)<br>6. Add description<br>7. Select cycle, set order<br>8. Add objectives<br>9. Set difficulty<br>10. Save | Lesson created | ☐ |
| ADMIN-109 | View all lessons | 1. Go to Lessons page | All lessons listed by subject/grade | ☐ |
| ADMIN-110 | Edit lesson | 1. Click edit<br>2. Modify content<br>3. Save | Lesson updated | ☐ |
| ADMIN-111 | View lesson details | 1. Click view | Shows lesson content and resources | ☐ |
| ADMIN-112 | Delete lesson | 1. Select lesson<br>2. Delete | Lesson deleted | ☐ |
| ADMIN-113 | Filter lessons by subject | 1. Select subject filter | Only lessons for that subject shown | ☐ |
| ADMIN-114 | Filter lessons by grade | 1. Select grade filter | Only lessons for that grade shown | ☐ |
| ADMIN-115 | Filter lessons by cycle | 1. Select cycle filter | Only lessons from that cycle shown | ☐ |

#### 2.10.2 Lesson Resource Management
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ADMIN-116 | Add PDF resource to lesson | 1. Open lesson<br>2. Click Add Resource<br>3. Select type: PDF<br>4. Upload PDF file<br>5. Add title, description<br>6. Save | PDF resource added | ☐ |
| ADMIN-117 | Add video resource | 1. Add resource<br>2. Select type: Video<br>3. Upload video or add YouTube link<br>4. Save | Video resource added | ☐ |
| ADMIN-118 | Add image resource | 1. Add resource<br>2. Select type: Image<br>3. Upload image<br>4. Save | Image added | ☐ |
| ADMIN-119 | Add external link resource | 1. Add resource<br>2. Select type: Link<br>3. Enter URL<br>4. Save | Link resource added | ☐ |
| ADMIN-120 | Reorder lesson resources | 1. Drag resources to reorder<br>2. Save | Resources reordered | ☐ |
| ADMIN-121 | Set resource visibility | 1. Edit resource<br>2. Toggle "Visible to students"<br>3. Save | Visibility updated | ☐ |
| ADMIN-122 | Set resource downloadable | 1. Edit resource<br>2. Toggle "Downloadable"<br>3. Save | Download permission updated | ☐ |
| ADMIN-123 | Delete resource | 1. Select resource<br>2. Delete | Resource removed | ☐ |

### 2.11 Exercise Management (Admin)

#### 2.11.1 Exercise Operations
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ADMIN-124 | Create exercise | 1. Navigate to Exercises<br>2. Click Create<br>3. Link to lesson<br>4. Enter title, description<br>5. Set format, difficulty<br>6. Save | Exercise created | ☐ |
| ADMIN-125 | View all exercises | 1. Go to Exercises page | All exercises listed | ☐ |
| ADMIN-126 | Edit exercise | 1. Click edit<br>2. Modify details<br>3. Save | Exercise updated | ☐ |
| ADMIN-127 | View exercise details | 1. Click view | Shows exercise and questions | ☐ |
| ADMIN-128 | Delete exercise | 1. Select exercise<br>2. Delete | Exercise deleted | ☐ |

### 2.12 Attendance Reports (Admin)

#### 2.12.1 Reports & Statistics
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ADMIN-129 | View daily attendance report | 1. Navigate to Attendance Reports<br>2. Select date<br>3. View report | All class attendance shown for date | ☐ |
| ADMIN-130 | View class attendance statistics | 1. Select class<br>2. Select date range<br>3. View stats | Attendance rates, charts displayed | ☐ |
| ADMIN-131 | View student attendance history | 1. Select student<br>2. View attendance history | All attendance records shown | ☐ |
| ADMIN-132 | Export attendance report | 1. Generate report<br>2. Click export | Report exported to Excel/PDF | ☐ |
| ADMIN-133 | View absence flags | 1. Navigate to Absence Flags<br>2. Filter by pending | All pending flags listed | ☐ |

---

## 3. Teacher Role Tests

### 3.1 Teacher Dashboard
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| TCHR-001 | View teacher dashboard | 1. Login as teacher<br>2. View dashboard | Shows today's schedule, upcoming classes | ☐ |
| TCHR-002 | View quick stats | 1. Check dashboard widgets | Shows student count, homework pending, etc. | ☐ |

### 3.2 My Classes

#### 3.2.1 Class Management
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| TCHR-003 | View my classes | 1. Navigate to My Classes | All assigned classes displayed | ☐ |
| TCHR-004 | View class details | 1. Click on a class | Shows students list, schedule | ☐ |
| TCHR-005 | View class roster | 1. Open class<br>2. View students tab | All enrolled students listed | ☐ |
| TCHR-006 | View student profile | 1. Click on student name | Shows student details, performance | ☐ |

### 3.3 My Schedule

#### 3.3.1 Schedule Viewing
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| TCHR-007 | View weekly schedule | 1. Navigate to My Schedule | Weekly timetable displayed | ☐ |
| TCHR-008 | View today's sessions | 1. Check today's schedule | Sessions listed with times, rooms | ☐ |
| TCHR-009 | View session details | 1. Click on a session | Shows class, room, students | ☐ |

### 3.4 Lesson Management (Teacher)

#### 3.4.1 Lesson Creation
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| TCHR-010 | Create new lesson | 1. Navigate to Lessons<br>2. Click Create Lesson<br>3. Select from my subjects/grades<br>4. Enter content<br>5. Save | Lesson created | ☐ |
| TCHR-011 | View my lessons | 1. Go to Lessons page | All my created lessons displayed | ☐ |
| TCHR-012 | Edit my lesson | 1. Click edit<br>2. Modify content<br>3. Save | Lesson updated | ☐ |
| TCHR-013 | View lesson | 1. Click on lesson | Shows full lesson content | ☐ |
| TCHR-014 | Delete my lesson | 1. Select lesson<br>2. Delete | Lesson deleted | ☐ |
| TCHR-015 | Filter lessons by subject | 1. Select subject filter | Only that subject's lessons shown | ☐ |
| TCHR-016 | Filter lessons by grade | 1. Select grade filter | Only that grade's lessons shown | ☐ |

#### 3.4.2 Lesson Resources
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| TCHR-017 | Add PDF to lesson | 1. Open lesson<br>2. Add resource<br>3. Upload PDF<br>4. Save | PDF added | ☐ |
| TCHR-018 | Add video to lesson | 1. Add resource<br>2. Upload video file<br>3. Save | Video uploaded and added | ☐ |
| TCHR-019 | Add YouTube link | 1. Add resource<br>2. Enter YouTube URL<br>3. Save | YouTube video linked | ☐ |
| TCHR-020 | Add presentation | 1. Add resource<br>2. Upload PowerPoint<br>3. Save | Presentation added | ☐ |
| TCHR-021 | Reorder resources | 1. Drag to reorder<br>2. Save | Order updated | ☐ |
| TCHR-022 | Delete resource | 1. Select resource<br>2. Delete | Resource removed | ☐ |

### 3.5 Lesson Exercises (Teacher)

#### 3.5.1 Exercise Creation
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| TCHR-023 | Create lesson exercise | 1. Navigate to lesson<br>2. Click Create Exercise<br>3. Enter title, description<br>4. Select format<br>5. Set difficulty<br>6. Save | Exercise created | ☐ |
| TCHR-024 | View lesson exercises | 1. Open lesson<br>2. Go to Exercises tab | All exercises for lesson shown | ☐ |
| TCHR-025 | Edit exercise | 1. Click edit<br>2. Modify details<br>3. Save | Exercise updated | ☐ |
| TCHR-026 | Delete exercise | 1. Select exercise<br>2. Delete | Exercise deleted | ☐ |

#### 3.5.2 Exercise Questions
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| TCHR-027 | Add QCM single choice question | 1. Open exercise<br>2. Add question<br>3. Select type: QCM Single<br>4. Enter question text<br>5. Add choices (mark one correct)<br>6. Set points<br>7. Save | QCM question added | ☐ |
| TCHR-028 | Add QCM multiple choice question | 1. Add question<br>2. Type: QCM Multiple<br>3. Add choices (mark multiple correct)<br>4. Save | Multi-choice question added | ☐ |
| TCHR-029 | Add open short question | 1. Add question<br>2. Type: Open Short<br>3. Enter question<br>4. Save | Open question added | ☐ |
| TCHR-030 | Add open long question | 1. Add question<br>2. Type: Open Long<br>3. Enter question<br>4. Save | Essay question added | ☐ |
| TCHR-031 | Add true/false question | 1. Add question<br>2. Type: True/False<br>3. Enter question<br>4. Set correct answer<br>5. Save | T/F question added | ☐ |
| TCHR-032 | Add fill-in-the-blank question | 1. Add question<br>2. Type: Fill Blank<br>3. Define blanks<br>4. Add options for each blank<br>5. Save | Fill blank question added | ☐ |
| TCHR-033 | Add matching question | 1. Add question<br>2. Type: Matching<br>3. Create pairs<br>4. Save | Matching question added | ☐ |
| TCHR-034 | Add ordering question | 1. Add question<br>2. Type: Ordering<br>3. Add items with correct order<br>4. Save | Ordering question added | ☐ |
| TCHR-035 | Add image to question | 1. Edit question<br>2. Upload question image<br>3. Save | Image attached to question | ☐ |
| TCHR-036 | Add explanation to question | 1. Edit question<br>2. Add explanation text<br>3. Save | Explanation added | ☐ |
| TCHR-037 | Reorder questions | 1. Drag questions<br>2. Save | Questions reordered | ☐ |
| TCHR-038 | Delete question | 1. Select question<br>2. Delete | Question removed | ☐ |
| TCHR-039 | Set question as optional | 1. Edit question<br>2. Uncheck "Required"<br>3. Save | Question made optional | ☐ |

### 3.6 Homework Management (Teacher)

#### 3.6.1 Homework Creation
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| TCHR-040 | Create homework assignment | 1. Navigate to Homework<br>2. Click Create Homework<br>3. Select subject, grade, class<br>4. Link to lesson (optional)<br>5. Enter title, description, instructions<br>6. Select homework type<br>7. Set due date<br>8. Set total points<br>9. Save | Homework created (draft) | ☐ |
| TCHR-041 | Set homework format | 1. Create homework<br>2. Select format (Mixed, QCM only, Open only, Book exercises)<br>3. Save | Format set | ☐ |
| TCHR-042 | Set time limit | 1. Create homework<br>2. Check "Is timed"<br>3. Set time limit in minutes<br>4. Save | Time limit set | ☐ |
| TCHR-043 | Set estimated duration | 1. Create homework<br>2. Enter estimated duration<br>3. Save | Duration set | ☐ |
| TCHR-044 | Allow multiple attempts | 1. Create homework<br>2. Check "Allow multiple attempts"<br>3. Set max attempts<br>4. Save | Multiple attempts enabled | ☐ |
| TCHR-045 | Set late submission policy | 1. Create homework<br>2. Check "Allow late submissions"<br>3. Set late penalty percentage<br>4. Save | Late policy set | ☐ |
| TCHR-046 | Enable auto-grading | 1. Create homework<br>2. Check "Auto-grade QCM"<br>3. Save | Auto-grading enabled | ☐ |
| TCHR-047 | Show results immediately | 1. Create homework<br>2. Check "Show results immediately"<br>3. Save | Immediate results enabled | ☐ |
| TCHR-048 | Randomize questions | 1. Create homework<br>2. Check "Randomize questions"<br>3. Save | Question randomization enabled | ☐ |

#### 3.6.2 Homework Questions
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| TCHR-049 | Add QCM to homework | 1. Open homework<br>2. Add question<br>3. Create QCM question<br>4. Save | QCM added to homework | ☐ |
| TCHR-050 | Add open question to homework | 1. Add question<br>2. Create open question<br>3. Save | Open question added | ☐ |
| TCHR-051 | Add book exercise reference | 1. Open homework<br>2. Click Add Book Exercise<br>3. Enter book title, chapter<br>4. Enter page number, exercise number<br>5. Add specific questions<br>6. Upload page image (optional)<br>7. Set points<br>8. Save | Book exercise added | ☐ |
| TCHR-052 | Edit book exercise | 1. Click edit<br>2. Modify details<br>3. Save | Book exercise updated | ☐ |
| TCHR-053 | Delete book exercise | 1. Select book exercise<br>2. Delete | Book exercise removed | ☐ |

#### 3.6.3 Homework Publishing
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| TCHR-054 | Publish homework | 1. Open draft homework<br>2. Review all settings<br>3. Click Publish | Homework published, visible to students | ☐ |
| TCHR-055 | Unpublish homework | 1. Open published homework<br>2. Click Unpublish | Homework hidden from students | ☐ |
| TCHR-056 | Try to publish homework without questions | 1. Create homework with no questions<br>2. Try to publish | Error: Must have at least one question | ☐ |

#### 3.6.4 Homework Management
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| TCHR-057 | View all my homework | 1. Navigate to Homework page | All created homework listed | ☐ |
| TCHR-058 | View homework details | 1. Click on homework | Shows full details, questions, submissions | ☐ |
| TCHR-059 | Edit published homework | 1. Edit published homework<br>2. Modify details<br>3. Save | Homework updated (note: affects active submissions) | ☐ |
| TCHR-060 | Delete homework | 1. Select homework with no submissions<br>2. Delete | Homework deleted | ☐ |
| TCHR-061 | Try to delete homework with submissions | 1. Try to delete homework with submissions | Warning: Cannot delete or must archive | ☐ |
| TCHR-062 | Filter homework by class | 1. Select class filter | Only homework for that class shown | ☐ |
| TCHR-063 | Filter homework by subject | 1. Select subject filter | Only homework for that subject shown | ☐ |
| TCHR-064 | Filter homework by status | 1. Select status (draft/published) | Only homework with that status shown | ☐ |
| TCHR-065 | View submission count | 1. View homework list | Submission count shown for each | ☐ |

### 3.7 Grading & Assessment

#### 3.7.1 Homework Submissions
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| TCHR-066 | View homework submissions | 1. Open homework<br>2. Go to Submissions tab | All student submissions listed | ☐ |
| TCHR-067 | View submission details | 1. Click on submission | Shows all answers and scores | ☐ |
| TCHR-068 | Grade open question | 1. Open submission<br>2. View open question answer<br>3. Enter points<br>4. Add feedback<br>5. Save | Question graded | ☐ |
| TCHR-069 | Grade book exercise | 1. View book exercise answer<br>2. Review uploaded files<br>3. Enter points<br>4. Add feedback<br>5. Save | Book exercise graded | ☐ |
| TCHR-070 | Add general submission feedback | 1. Open submission<br>2. Add general comment<br>3. Save | Feedback added | ☐ |
| TCHR-071 | View auto-graded QCM results | 1. Open submission with QCM<br>2. View QCM scores | Auto-calculated scores shown | ☐ |
| TCHR-072 | Override auto-grade | 1. View auto-graded answer<br>2. Manually adjust points<br>3. Save | Manual score overrides auto-grade | ☐ |
| TCHR-073 | Submit final grade | 1. Complete grading all questions<br>2. Click "Submit Grade" | Total score calculated and saved | ☐ |
| TCHR-074 | Filter submissions by status | 1. Select status filter (submitted, graded, etc.) | Only submissions with that status shown | ☐ |
| TCHR-075 | Filter late submissions | 1. Select "Late" filter | Only late submissions shown | ☐ |
| TCHR-076 | Sort submissions by score | 1. Click score column header | Submissions sorted by score | ☐ |
| TCHR-077 | Export grades to Excel | 1. View submissions<br>2. Click Export<br>3. Select Excel format | Grades exported to Excel file | ☐ |

#### 3.7.2 Exercise Submissions
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| TCHR-078 | View exercise submissions | 1. Open exercise<br>2. View submissions | All student attempts listed | ☐ |
| TCHR-079 | View exercise statistics | 1. View exercise<br>2. Check stats | Shows completion rate, avg score | ☐ |
| TCHR-080 | View student progress | 1. Select student<br>2. View their exercises | Shows all attempts and scores | ☐ |

### 3.8 Attendance Management (Teacher)

#### 3.8.1 Taking Attendance
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| TCHR-081 | View today's sessions | 1. Navigate to Attendance<br>2. View today's schedule | All sessions for today displayed | ☐ |
| TCHR-082 | Start attendance session | 1. Select session<br>2. Click Start Attendance | Session started, student list shown | ☐ |
| TCHR-083 | Mark student present | 1. In attendance session<br>2. Mark student as present | Student marked present | ☐ |
| TCHR-084 | Mark student absent | 1. Mark student as absent<br>2. Add note (optional) | Student marked absent | ☐ |
| TCHR-085 | Mark student late | 1. Mark student as late<br>2. Enter arrival time<br>3. Add note | Student marked late | ☐ |
| TCHR-086 | Mark excused absence | 1. Mark student as excused<br>2. Add reason | Student marked excused | ☐ |
| TCHR-087 | Bulk mark all present | 1. Click "Mark All Present" | All students marked present | ☐ |
| TCHR-088 | Add attendance notes | 1. Click on student<br>2. Add notes<br>3. Save | Notes saved | ☐ |
| TCHR-089 | Complete attendance session | 1. After marking all students<br>2. Click Complete | Session completed, flags created for absences | ☐ |
| TCHR-090 | Edit attendance after completion | 1. Open completed session<br>2. Modify attendance<br>3. Save | Attendance updated | ☐ |

#### 3.8.2 Attendance History
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| TCHR-091 | View attendance history | 1. Navigate to Attendance History | Past sessions listed | ☐ |
| TCHR-092 | View session details | 1. Click on past session | Shows all attendance records | ☐ |
| TCHR-093 | Filter by class | 1. Select class filter | Only sessions for that class shown | ☐ |
| TCHR-094 | Filter by date range | 1. Select date range<br>2. Apply filter | Sessions in range shown | ☐ |
| TCHR-095 | View student attendance pattern | 1. Click on student<br>2. View history | All attendance records for student shown | ☐ |
| TCHR-096 | Export attendance report | 1. Select session<br>2. Click Export | Attendance exported to Excel | ☐ |

### 3.9 Assessment Tools

#### 3.9.1 Assessment Creation
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| TCHR-097 | Create quiz | 1. Navigate to Assessment Tools<br>2. Create new homework<br>3. Select type: Quiz<br>4. Add questions<br>5. Publish | Quiz created and available | ☐ |
| TCHR-098 | Create exam | 1. Create homework<br>2. Type: Exam<br>3. Set timed<br>4. Add questions<br>5. Publish | Exam created | ☐ |
| TCHR-099 | Create project assignment | 1. Create homework<br>2. Type: Project<br>3. Add instructions<br>4. Set deadline<br>5. Publish | Project assignment created | ☐ |

### 3.10 Student Management (Teacher View)

#### 3.10.1 Student Information
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| TCHR-100 | View student profile | 1. From class roster<br>2. Click on student | Shows student details | ☐ |
| TCHR-101 | View student performance | 1. Open student profile<br>2. View grades tab | All grades for my subject shown | ☐ |
| TCHR-102 | View student attendance | 1. Open student profile<br>2. View attendance tab | Student's attendance history shown | ☐ |
| TCHR-103 | View student submissions | 1. Open student profile<br>2. View submissions tab | All homework/exercise submissions shown | ☐ |

### 3.11 Profile & Settings (Teacher)

#### 3.11.1 Profile Management
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| TCHR-104 | View my profile | 1. Click on profile icon<br>2. View profile | Profile information displayed | ☐ |
| TCHR-105 | Edit profile | 1. Click Edit Profile<br>2. Update phone, bio<br>3. Save | Profile updated | ☐ |
| TCHR-106 | Update profile picture | 1. Edit profile<br>2. Upload new picture<br>3. Save | Picture updated | ☐ |
| TCHR-107 | Change password | 1. Go to settings<br>2. Click Change Password<br>3. Enter old and new passwords<br>4. Save | Password changed | ☐ |

---

## 4. Student Role Tests

### 4.1 Student Dashboard
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| STU-001 | View student dashboard | 1. Login as student<br>2. View dashboard | Shows schedule, pending homework, grades | ☐ |
| STU-002 | View today's classes | 1. Check dashboard schedule | Today's classes displayed | ☐ |
| STU-003 | View pending homework | 1. Check homework widget | Pending homework listed with due dates | ☐ |
| STU-004 | View recent grades | 1. Check grades widget | Recent grades displayed | ☐ |
| STU-005 | View points/rewards | 1. Check rewards widget | Total points, coins, level shown | ☐ |

### 4.2 My Profile (Student)

#### 4.2.1 Profile Viewing
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| STU-006 | View my profile | 1. Navigate to Profile | Personal information displayed | ☐ |
| STU-007 | View my class | 1. Check profile | Current class and academic year shown | ☐ |
| STU-008 | View my teachers | 1. Check profile | List of my teachers displayed | ☐ |

#### 4.2.2 Profile Editing
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| STU-009 | Edit profile | 1. Click Edit Profile<br>2. Update phone, bio<br>3. Save | Profile updated | ☐ |
| STU-010 | Update profile picture | 1. Edit profile<br>2. Upload picture<br>3. Save | Picture updated | ☐ |
| STU-011 | Change password | 1. Go to settings<br>2. Change password<br>3. Save | Password changed | ☐ |

### 4.3 My Timetable

#### 4.3.1 Schedule Viewing
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| STU-012 | View weekly timetable | 1. Navigate to My Timetable | Weekly schedule displayed | ☐ |
| STU-013 | View today's schedule | 1. Check today's tab | Today's classes with times, rooms | ☐ |
| STU-014 | View session details | 1. Click on session | Shows subject, teacher, room | ☐ |
| STU-015 | Navigate between weeks | 1. Use next/previous week buttons | Schedule for selected week shown | ☐ |

### 4.4 My Lessons

#### 4.4.1 Lesson Access
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| STU-016 | View all my lessons | 1. Navigate to Lessons | All lessons for my subjects/grade shown | ☐ |
| STU-017 | Filter lessons by subject | 1. Select subject filter | Only that subject's lessons shown | ☐ |
| STU-018 | Filter lessons by cycle | 1. Select cycle filter | Lessons from selected cycle shown | ☐ |
| STU-019 | Search lessons | 1. Enter search term | Matching lessons displayed | ☐ |
| STU-020 | View lesson details | 1. Click on lesson | Lesson content displayed | ☐ |

#### 4.4.2 Lesson Resources
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| STU-021 | View lesson resources | 1. Open lesson<br>2. View resources | All visible resources listed | ☐ |
| STU-022 | Download PDF resource | 1. Click on PDF resource<br>2. Download | PDF downloaded | ☐ |
| STU-023 | Watch video resource | 1. Click on video<br>2. Play | Video plays in browser | ☐ |
| STU-024 | View YouTube video | 1. Click on YouTube link | Video plays embedded or opens YouTube | ☐ |
| STU-025 | Access external link | 1. Click on external link | Link opens in new tab | ☐ |
| STU-026 | View non-downloadable resource | 1. Try to download resource marked non-downloadable | Only view option available | ☐ |

#### 4.4.3 Lesson Exercises
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| STU-027 | View lesson exercises | 1. Open lesson<br>2. Go to Exercises tab | All exercises listed | ☐ |
| STU-028 | View exercise details | 1. Click on exercise | Shows description, difficulty, questions count | ☐ |
| STU-029 | Start exercise | 1. Click Start Exercise | Exercise begins, timer starts if timed | ☐ |
| STU-030 | Answer QCM question | 1. In exercise<br>2. Select answer<br>3. Click Next | Answer saved, next question shown | ☐ |
| STU-031 | Answer multiple choice question | 1. Select multiple answers<br>2. Submit | Multiple selections saved | ☐ |
| STU-032 | Answer open short question | 1. Type answer in text field<br>2. Submit | Text answer saved | ☐ |
| STU-033 | Answer open long question | 1. Type essay in text area<br>2. Submit | Long answer saved | ☐ |
| STU-034 | Answer true/false question | 1. Select True or False<br>2. Submit | Answer saved | ☐ |
| STU-035 | Answer fill-in-blank question | 1. Select option for each blank<br>2. Submit | Answers saved | ☐ |
| STU-036 | Answer matching question | 1. Match left items to right items<br>2. Submit | Matches saved | ☐ |
| STU-037 | Answer ordering question | 1. Drag items into correct order<br>2. Submit | Order saved | ☐ |
| STU-038 | Navigate between questions | 1. Use Previous/Next buttons | Navigation works, answers preserved | ☐ |
| STU-039 | View question explanation | 1. After answering<br>2. View explanation | Explanation displayed (if enabled) | ☐ |
| STU-040 | Complete exercise | 1. Answer all questions<br>2. Click Submit | Exercise submitted, score shown | ☐ |
| STU-041 | View exercise results | 1. After submission | Score, correct/incorrect answers shown | ☐ |
| STU-042 | Retake exercise | 1. From completed exercise<br>2. Click Retake | New attempt started | ☐ |
| STU-043 | View exercise attempts | 1. View exercise<br>2. Check attempts history | All attempts with scores shown | ☐ |
| STU-044 | Exercise time limit | 1. Start timed exercise<br>2. Let time expire | Auto-submitted when time runs out | ☐ |

### 4.5 My Homework

#### 4.5.1 Homework Viewing
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| STU-045 | View all homework | 1. Navigate to Homework | All assigned homework listed | ☐ |
| STU-046 | View pending homework | 1. Filter by status: Pending | Only pending homework shown | ☐ |
| STU-047 | View completed homework | 1. Filter by status: Completed | Only completed homework shown | ☐ |
| STU-048 | View graded homework | 1. Filter by status: Graded | Only graded homework shown | ☐ |
| STU-049 | Filter homework by subject | 1. Select subject filter | Only homework for that subject shown | ☐ |
| STU-050 | Sort by due date | 1. Sort by due date | Homework ordered by deadline | ☐ |
| STU-051 | View homework details | 1. Click on homework | Shows description, instructions, due date | ☐ |
| STU-052 | Check overdue status | 1. View homework past due date | Marked as overdue | ☐ |

#### 4.5.2 Homework Submission
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| STU-053 | Start homework | 1. Click Start on homework | Homework opened, timer starts if timed | ☐ |
| STU-054 | Save as draft | 1. Start homework<br>2. Answer some questions<br>3. Click Save Draft | Progress saved | ☐ |
| STU-055 | Resume draft | 1. Open saved draft | Previous answers restored | ☐ |
| STU-056 | Answer QCM questions | 1. Answer multiple QCM questions<br>2. Save | Answers saved | ☐ |
| STU-057 | Answer open questions | 1. Type answers to open questions<br>2. Save | Text answers saved | ☐ |
| STU-058 | Upload file for answer | 1. Open question allows file upload<br>2. Select and upload file<br>3. Save | File uploaded and linked to answer | ☐ |
| STU-059 | Complete book exercise | 1. View book exercise reference<br>2. Upload work images/files<br>3. Add description<br>4. Save | Book exercise submission saved | ☐ |
| STU-060 | View uploaded files | 1. Check book exercise answer<br>2. View files | Uploaded files displayed | ☐ |
| STU-061 | Delete uploaded file | 1. Select file<br>2. Delete | File removed | ☐ |
| STU-062 | Submit homework | 1. Complete all required questions<br>2. Click Submit | Homework submitted, confirmation shown | ☐ |
| STU-063 | Submit incomplete homework | 1. Try to submit with unanswered required questions | Error: Must answer all required questions | ☐ |
| STU-064 | Submit on time | 1. Submit before due date | Marked as on-time | ☐ |
| STU-065 | Submit late | 1. Submit after due date | Marked as late, penalty applied if set | ☐ |
| STU-066 | Submit when late not allowed | 1. Try to submit after due date when not allowed | Error: Late submissions not accepted | ☐ |
| STU-067 | View submission confirmation | 1. After submitting | Confirmation message with timestamp | ☐ |
| STU-068 | Attempt homework again | 1. For homework allowing multiple attempts<br>2. Start new attempt | New attempt started | ☐ |
| STU-069 | View attempt history | 1. View homework<br>2. Check attempts | All attempts with scores shown | ☐ |
| STU-070 | Homework time limit | 1. Start timed homework<br>2. Let timer expire | Auto-submitted | ☐ |

#### 4.5.3 Homework Results
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| STU-071 | View auto-graded results | 1. After submission with auto-grading enabled<br>2. View results | QCM scores shown immediately | ☐ |
| STU-072 | View manual grade | 1. After teacher grades<br>2. View results | Total grade displayed | ☐ |
| STU-073 | View teacher feedback | 1. View graded homework<br>2. Check feedback | General and per-question feedback shown | ☐ |
| STU-074 | View question-by-question results | 1. View graded homework<br>2. Review each question | Shows correct answer, score, feedback | ☐ |
| STU-075 | View book exercise grade | 1. Check book exercise<br>2. View grade | Points and feedback shown | ☐ |
| STU-076 | View total score | 1. View graded homework | Total score and percentage shown | ☐ |
| STU-077 | Download graded homework | 1. Click Download/Export<br>2. Save | Homework with grades downloaded | ☐ |

### 4.6 My Grades

#### 4.6.1 Grade Viewing
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| STU-078 | View all grades | 1. Navigate to Grades | All graded homework/exams listed | ☐ |
| STU-079 | Filter grades by subject | 1. Select subject | Only grades for that subject shown | ☐ |
| STU-080 | View grade details | 1. Click on grade | Shows homework, score, date | ☐ |
| STU-081 | View grade statistics | 1. Check stats | Shows average, highest, lowest | ☐ |
| STU-082 | View grade trend | 1. View grade chart | Visual graph of grades over time | ☐ |
| STU-083 | Export grades | 1. Click Export<br>2. Select format | Grades exported | ☐ |

### 4.7 My Attendance

#### 4.7.1 Attendance Viewing
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| STU-084 | View attendance history | 1. Navigate to My Attendance | All attendance records listed | ☐ |
| STU-085 | View attendance statistics | 1. Check attendance stats | Present/absent/late counts shown | ☐ |
| STU-086 | View attendance rate | 1. View stats | Attendance percentage displayed | ☐ |
| STU-087 | Filter by subject | 1. Select subject filter | Attendance for that subject shown | ☐ |
| STU-088 | Filter by date range | 1. Select date range | Attendance in range shown | ☐ |
| STU-089 | View absence flags | 1. Check flags section | Pending absence flags listed | ☐ |
| STU-090 | View cleared flags | 1. View flag history | Cleared flags with reasons shown | ☐ |

#### 4.7.2 Absence Justification
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| STU-091 | Request absence clearance | 1. View absence flag<br>2. Click Justify<br>3. Select reason<br>4. Upload document (medical cert, etc.)<br>5. Add notes<br>6. Submit | Clearance request submitted | ☐ |
| STU-092 | View clearance status | 1. Check absence flag | Status (pending/cleared) shown | ☐ |

### 4.8 Rewards & Points

#### 4.8.1 Wallet & Points
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| STU-093 | View my wallet | 1. Navigate to Rewards | Wallet with points, coins, stars shown | ☐ |
| STU-094 | View earned points | 1. Check transactions | All point transactions listed | ☐ |
| STU-095 | View level | 1. Check profile | Current level and XP shown | ☐ |
| STU-096 | View progress to next level | 1. Check level progress | Progress bar to next level | ☐ |
| STU-097 | View rewards breakdown | 1. View rewards | Points from homework, exercises, bonuses shown | ☐ |
| STU-098 | View streak | 1. Check wallet | Current and longest streak shown | ☐ |

#### 4.8.2 Badges
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| STU-099 | View earned badges | 1. Navigate to My Badges | All earned badges displayed | ☐ |
| STU-100 | View badge details | 1. Click on badge | Shows badge name, description, earned date | ☐ |
| STU-101 | View available badges | 1. Check available badges | Unearned badges shown (if not hidden) | ☐ |
| STU-102 | View badge requirements | 1. Click on available badge | Requirements to earn badge shown | ☐ |
| STU-103 | View badge rarity | 1. Check badges | Rarity (common, rare, epic, legendary) shown | ☐ |

#### 4.8.3 Leaderboards
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| STU-104 | View class leaderboard | 1. Navigate to Leaderboard<br>2. Select Class scope | Class leaderboard displayed | ☐ |
| STU-105 | View grade leaderboard | 1. Select Grade scope | Grade leaderboard displayed | ☐ |
| STU-106 | View my rank | 1. Check leaderboard | My position highlighted | ☐ |
| STU-107 | View weekly leaderboard | 1. Select Weekly period | Weekly rankings shown | ☐ |
| STU-108 | View monthly leaderboard | 1. Select Monthly period | Monthly rankings shown | ☐ |
| STU-109 | View top performers | 1. View leaderboard | Top 10 students listed | ☐ |
| STU-110 | View rank change | 1. Check my rank | Rank change (up/down) from last period shown | ☐ |

---

## 5. Parent Role Tests

### 5.1 Parent Dashboard
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| PAR-001 | View parent dashboard | 1. Login as parent<br>2. View dashboard | Shows children's info, notifications | ☐ |
| PAR-002 | View linked children | 1. Check dashboard | All linked children displayed | ☐ |
| PAR-003 | Select child | 1. Click on child's name<br>2. View details | Child's information shown | ☐ |

### 5.2 Child Information

#### 5.2.1 Child Profile
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| PAR-004 | View child profile | 1. Select child<br>2. View profile | Child's personal info, class shown | ☐ |
| PAR-005 | View child's teachers | 1. View child profile | List of teachers displayed | ☐ |
| PAR-006 | View child's class | 1. View child profile | Current class and grade shown | ☐ |

#### 5.2.2 Child Schedule
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| PAR-007 | View child's timetable | 1. Select child<br>2. Navigate to Timetable | Weekly schedule displayed | ☐ |
| PAR-008 | View today's classes | 1. Check today's schedule | Today's classes with times shown | ☐ |

#### 5.2.3 Child Academic Performance
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| PAR-009 | View child's grades | 1. Select child<br>2. Navigate to Grades | All grades listed by subject | ☐ |
| PAR-010 | View grade details | 1. Click on grade | Shows homework, score, date | ☐ |
| PAR-011 | View grade trends | 1. View grades<br>2. Check chart | Visual graph of performance | ☐ |
| PAR-012 | Filter grades by subject | 1. Select subject | Grades for that subject shown | ☐ |
| PAR-013 | View homework submissions | 1. Navigate to child's homework | All homework with statuses shown | ☐ |
| PAR-014 | View homework details | 1. Click on homework | Shows assignment, due date, status | ☐ |

#### 5.2.4 Child Attendance
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| PAR-015 | View child's attendance | 1. Select child<br>2. Navigate to Attendance | Attendance records listed | ☐ |
| PAR-016 | View attendance statistics | 1. Check attendance stats | Present/absent/late counts shown | ☐ |
| PAR-017 | View attendance rate | 1. View stats | Attendance percentage displayed | ☐ |
| PAR-018 | View absence details | 1. Click on absence | Shows date, subject, notes | ☐ |
| PAR-019 | View absence flags | 1. Check flags | Pending flags listed | ☐ |
| PAR-020 | View cleared absences | 1. View cleared flags | Clearance reasons and dates shown | ☐ |

#### 5.2.5 Child Rewards
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| PAR-021 | View child's points | 1. Select child<br>2. View Rewards | Total points, coins displayed | ☐ |
| PAR-022 | View child's badges | 1. View Rewards<br>2. Check badges | Earned badges shown | ☐ |
| PAR-023 | View child's leaderboard rank | 1. View Leaderboard | Child's rank displayed | ☐ |
| PAR-024 | View reward transactions | 1. View transactions | All point earnings listed | ☐ |

### 5.3 Notifications

#### 5.3.1 Attendance Notifications
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| PAR-025 | Receive absence notification | 1. When child is marked absent<br>2. Check notifications | Absence notification received | ☐ |
| PAR-026 | Receive late notification | 1. When child is marked late<br>2. Check notifications | Late notification received | ☐ |
| PAR-027 | Receive absence flag notification | 1. When absence flag created<br>2. Check notifications | Flag notification received | ☐ |
| PAR-028 | View notification details | 1. Click on notification | Full notification details shown | ☐ |
| PAR-029 | Mark notification as read | 1. Click on notification | Notification marked as read | ☐ |
| PAR-030 | View unread notifications | 1. Check notifications<br>2. Filter by unread | Only unread notifications shown | ☐ |

#### 5.3.2 Academic Notifications
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| PAR-031 | Receive grade notification | 1. When homework is graded<br>2. Check notifications | Grade notification received | ☐ |
| PAR-032 | Receive homework notification | 1. When homework is assigned<br>2. Check notifications | Assignment notification received | ☐ |

### 5.4 Communication (if implemented)

#### 5.4.1 Teacher Communication
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| PAR-033 | View teacher contact | 1. View child's teachers | Teacher contact info shown | ☐ |
| PAR-034 | Send message to teacher | 1. Select teacher<br>2. Compose message<br>3. Send | Message sent to teacher | ☐ |

---

## 6. Staff Role Tests

### 6.1 Staff Dashboard
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| STAFF-001 | View staff dashboard | 1. Login as staff<br>2. View dashboard | Dashboard displayed with assigned tasks | ☐ |

### 6.2 Staff Functions (if implemented)
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| STAFF-002 | View students | 1. Navigate to Students | Student list accessible | ☐ |
| STAFF-003 | View attendance reports | 1. Navigate to Reports | Attendance reports accessible | ☐ |

---

## 7. Cross-Role Tests

### 7.1 Security & Permissions

#### 7.1.1 Access Control
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| CROSS-001 | Student cannot access admin pages | 1. Login as student<br>2. Try to access admin URL directly | Redirected or access denied | ☐ |
| CROSS-002 | Teacher cannot access admin functions | 1. Login as teacher<br>2. Try to access admin functions | Access denied | ☐ |
| CROSS-003 | Parent cannot access teacher functions | 1. Login as parent<br>2. Try to access teacher pages | Access denied | ☐ |
| CROSS-004 | Student cannot see other students' data | 1. Login as student<br>2. Try to access another student's profile | Access denied | ☐ |
| CROSS-005 | Teacher cannot see other teachers' homework | 1. Login as teacher<br>2. Try to access another teacher's homework | Access denied or read-only | ☐ |

#### 7.1.2 Data Privacy
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| CROSS-006 | Student phone numbers hidden | 1. View student list<br>2. Check phone display | Phone numbers properly protected | ☐ |
| CROSS-007 | Email privacy | 1. View user lists<br>2. Check email display | Emails shown only to authorized roles | ☐ |
| CROSS-008 | Grade privacy | 1. As student, view grades<br>2. Check | Only own grades visible | ☐ |

### 7.2 Concurrent Operations

#### 7.2.1 Multi-User Scenarios
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| CROSS-009 | Multiple students submit homework | 1. Have 5+ students submit same homework simultaneously | All submissions processed correctly | ☐ |
| CROSS-010 | Teacher grades while student submits | 1. Teacher viewing submissions<br>2. Student submits new homework | Both actions complete successfully | ☐ |
| CROSS-011 | Admin edits class while teacher takes attendance | 1. Admin modifies class<br>2. Teacher taking attendance | Both actions succeed without conflict | ☐ |

### 7.3 Data Consistency

#### 7.3.1 Relational Integrity
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| CROSS-012 | Enrollment consistency | 1. Enroll student<br>2. Check in all views | Student appears in class roster, teacher view, parent view | ☐ |
| CROSS-013 | Grade consistency | 1. Teacher assigns grade<br>2. Check | Grade visible to student and parent immediately | ☐ |
| CROSS-014 | Attendance consistency | 1. Teacher marks attendance<br>2. Check | Attendance visible in reports, parent view, student view | ☐ |
| CROSS-015 | Homework assignment propagation | 1. Teacher publishes homework<br>2. Check | Homework appears for all students in class | ☐ |

---

## 8. Multilingual Support Tests

### 8.1 Language Switching

#### 8.1.1 Interface Language
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| LANG-001 | Switch to Arabic | 1. Click language selector<br>2. Select Arabic | UI switches to Arabic (RTL layout) | ☐ |
| LANG-002 | Switch to French | 1. Click language selector<br>2. Select French | UI switches to French | ☐ |
| LANG-003 | Switch to English | 1. Click language selector<br>2. Select English | UI switches to English | ☐ |
| LANG-004 | Language persistence | 1. Select language<br>2. Logout and login | Selected language persists | ☐ |

#### 8.1.2 Content Translation
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| LANG-005 | View subject names in Arabic | 1. Switch to Arabic<br>2. View subjects | Arabic subject names displayed | ☐ |
| LANG-006 | View grade names in French | 1. Switch to French<br>2. View grades | French grade names displayed | ☐ |
| LANG-007 | View lesson titles in all languages | 1. View lesson<br>2. Switch languages | Appropriate title shown per language | ☐ |
| LANG-008 | Fallback to default language | 1. View content without translation<br>2. Check display | Falls back to English/default | ☐ |

#### 8.1.3 RTL Support (Arabic)
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| LANG-009 | Navigation menu RTL | 1. Switch to Arabic<br>2. Check menu | Menu aligned right, RTL layout | ☐ |
| LANG-010 | Forms RTL | 1. In Arabic mode<br>2. View forms | Form labels and inputs RTL aligned | ☐ |
| LANG-011 | Tables RTL | 1. In Arabic mode<br>2. View data tables | Tables display RTL | ☐ |
| LANG-012 | Buttons RTL | 1. In Arabic mode<br>2. Check buttons | Icons and text properly aligned | ☐ |

---

## 9. Additional Test Scenarios

### 9.1 Responsive Design

#### 9.1.1 Mobile Responsiveness
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| RESP-001 | Login on mobile | 1. Access site on mobile (375x667)<br>2. Login | Login form responsive and functional | ☐ |
| RESP-002 | Navigation on mobile | 1. Open menu on mobile | Hamburger menu works, navigation accessible | ☐ |
| RESP-003 | Dashboard on mobile | 1. View dashboard on mobile | Widgets stack vertically, all info visible | ☐ |
| RESP-004 | Forms on mobile | 1. Fill form on mobile | Form inputs properly sized, submits correctly | ☐ |
| RESP-005 | Tables on mobile | 1. View data table on mobile | Table scrolls horizontally or stacks responsively | ☐ |

#### 9.1.2 Tablet Responsiveness
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| RESP-006 | Dashboard on tablet | 1. View dashboard on tablet (768x1024) | Layout adapts appropriately | ☐ |
| RESP-007 | Homework submission on tablet | 1. Complete homework on tablet | All question types work properly | ☐ |

### 9.2 File Upload & Media

#### 9.2.1 Cloudinary Integration
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| MEDIA-001 | Upload profile picture | 1. Upload image as profile picture | Image uploads to Cloudinary, displays correctly | ☐ |
| MEDIA-002 | Upload PDF | 1. Upload PDF to lesson resource | PDF uploads and is accessible | ☐ |
| MEDIA-003 | Upload video | 1. Upload video file | Video uploads and plays | ☐ |
| MEDIA-004 | Upload large file | 1. Try to upload file >10MB | Size limit enforced or file uploads | ☐ |
| MEDIA-005 | Upload invalid file type | 1. Try to upload .exe file | Error: File type not allowed | ☐ |
| MEDIA-006 | View image transformations | 1. Upload high-res image<br>2. View in different sizes | Cloudinary transformations applied | ☐ |

### 9.3 Performance

#### 9.3.1 Load Times
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| PERF-001 | Page load time | 1. Measure page load | Pages load in <3 seconds | ☐ |
| PERF-002 | Large class roster | 1. View class with 100+ students | List loads reasonably fast | ☐ |
| PERF-003 | Image gallery loading | 1. View room with 20+ images | Images load progressively | ☐ |

### 9.4 Error Handling

#### 9.4.1 Network Errors
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ERROR-001 | Submit form with network error | 1. Simulate network failure<br>2. Submit form | Error message shown, data preserved | ☐ |
| ERROR-002 | Load page with API error | 1. Backend returns 500 error<br>2. Load page | User-friendly error message shown | ☐ |
| ERROR-003 | Timeout on long operation | 1. Trigger long operation<br>2. Wait for timeout | Timeout handled gracefully | ☐ |

#### 9.4.2 Validation Errors
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|----------------|--------|
| ERROR-004 | Required field validation | 1. Submit form with empty required fields | Validation errors shown | ☐ |
| ERROR-005 | Email format validation | 1. Enter invalid email | Email format error shown | ☐ |
| ERROR-006 | Date validation | 1. Enter invalid date | Date validation error shown | ☐ |
| ERROR-007 | Duplicate entry error | 1. Try to create duplicate (e.g., same email) | Clear error: Already exists | ☐ |

---

## 10. Test Execution Guidelines

### 10.1 Test Execution Process

1. **Setup Phase**
   - Ensure test environment is properly configured
   - Create all required test user accounts
   - Populate test data
   - Verify all dependencies (database, Cloudinary, etc.)

2. **Execution Phase**
   - Execute tests in order (Authentication → Admin → Teacher → Student → Parent → Cross-Role)
   - Mark status: ✓ Pass, ✗ Fail, ~ Partial, N/A Not Applicable
   - Document any failures with screenshots
   - Note any unexpected behavior

3. **Reporting Phase**
   - Compile test results summary
   - Document all bugs found with reproduction steps
   - Prioritize issues (Critical, High, Medium, Low)
   - Create bug reports in issue tracking system

### 10.2 Bug Report Template

```
**Bug ID**: BUG-XXX
**Test ID**: [Related Test ID]
**Title**: [Brief description]
**Severity**: [Critical/High/Medium/Low]
**Priority**: [P0/P1/P2/P3]

**Steps to Reproduce**:
1.
2.
3.

**Expected Result**:
[What should happen]

**Actual Result**:
[What actually happened]

**Screenshots**:
[Attach screenshots]

**Environment**:
- Browser: [Chrome 120.0]
- OS: [Windows 11]
- Screen Size: [1920x1080]
- Role: [Admin/Teacher/Student/Parent]

**Additional Notes**:
[Any other relevant information]
```

### 10.3 Test Result Summary Template

```
# Test Execution Summary

**Test Date**: YYYY-MM-DD
**Tester**: [Name]
**Environment**: [Production/Staging/Development]

## Overall Statistics
- Total Test Cases: [XXX]
- Passed: [XXX] (XX%)
- Failed: [XXX] (XX%)
- Blocked: [XXX] (XX%)
- Not Executed: [XXX] (XX%)

## Results by Module
1. Authentication: XX/XX Passed (XX%)
2. Admin Functions: XX/XX Passed (XX%)
3. Teacher Functions: XX/XX Passed (XX%)
4. Student Functions: XX/XX Passed (XX%)
5. Parent Functions: XX/XX Passed (XX%)
6. Cross-Role: XX/XX Passed (XX%)
7. Multilingual: XX/XX Passed (XX%)

## Critical Issues Found
1. [Issue description] - [Bug ID]
2. [Issue description] - [Bug ID]

## Recommendations
1.
2.
3.

## Sign-off
Tester: _____________________ Date: _____
QA Lead: ____________________ Date: _____
```

---

## 11. Regression Testing Checklist

### 11.1 Core Functionality (Always Test)
- [ ] User login/logout
- [ ] Password change
- [ ] Create/edit/delete major entities (students, teachers, classes)
- [ ] Homework creation and submission
- [ ] Attendance taking
- [ ] Grade viewing
- [ ] File uploads
- [ ] Language switching

### 11.2 After Major Updates
- [ ] Re-run all affected test sections
- [ ] Verify database migrations
- [ ] Check API backwards compatibility
- [ ] Test cross-browser compatibility
- [ ] Verify mobile responsiveness

---

## Appendix: Test Data Requirements

### Test Users
- **Admin**: admin@madrasti.test / Password123!
- **Teacher 1**: teacher1@madrasti.test / Password123!
- **Teacher 2**: teacher2@madrasti.test / Password123!
- **Student 1-10**: student1@madrasti.test - student10@madrasti.test / Password123!
- **Parent 1-3**: parent1@madrasti.test - parent3@madrasti.test / Password123!
- **Staff 1**: staff1@madrasti.test / Password123!

### Sample Data
- **Academic Year**: 2024-2025 (Current)
- **Educational Levels**: Preschool, Primary, Lower Secondary, Upper Secondary
- **Grades**: At least 3 grades across different levels
- **Subjects**: Arabic, French, English, Math, Science, History, Geography, PE
- **Classes**: At least 5 classes with 10+ students each
- **Rooms**: 10 rooms with different types
- **Lessons**: At least 10 lessons with resources
- **Homework**: 5 active assignments
- **Exercises**: 5 exercises with various question types

---

**End of Test Plan**

*This document should be updated regularly as new features are added to the Madrasti 2.0 platform.*
