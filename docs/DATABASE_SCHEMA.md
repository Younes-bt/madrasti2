# Database Schema Documentation

This document provides a comprehensive overview of all database models in the Madrasti 2.0 system.

## Table of Contents

1. [Users App Models](#users-app-models)
2. [Schools App Models](#schools-app-models)
3. [Lessons App Models](#lessons-app-models)
4. [Homework App Models](#homework-app-models)
5. [Attendance App Models](#attendance-app-models)
6. [Lab App Models](#lab-app-models)
7. [Activity Log Models](#activity-log-models)
8. [Relationships Overview](#relationships-overview)

---

## Users App Models

### User
**Purpose**: Custom user model for authentication

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| email | EmailField | Unique email (username field) |
| password | CharField | Hashed password |
| first_name | CharField | User's first name |
| last_name | CharField | User's last name |
| role | CharField | User role (ADMIN, TEACHER, STUDENT, PARENT, STAFF, DRIVER) |
| parent | ForeignKey | Parent user (for students) |
| is_active | BooleanField | Account active status |
| is_online | BooleanField | Current online status |
| last_seen | DateTimeField | Last activity timestamp |
| force_password_change | BooleanField | Force password change on next login |
| created_at | DateTimeField | Account creation timestamp |
| updated_at | DateTimeField | Last update timestamp |

**Relationships**:
- Self-referential FK to parent (for students)
- One-to-One with Profile
- One-to-Many with StudentEnrollment
- Many-to-Many with SchoolClass (through teachers field)

**Constraints**:
- Unique email
- Custom user manager (no username)

---

### Profile
**Purpose**: Extended user information

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| user | OneToOneField | User reference |
| ar_first_name | CharField | Arabic first name |
| ar_last_name | CharField | Arabic last name |
| phone | CharField | Phone number |
| date_of_birth | DateField | Date of birth |
| address | TextField | Physical address |
| profile_picture | CloudinaryField | Profile photo |
| bio | TextField | Biography |
| emergency_contact_name | CharField | Emergency contact name |
| emergency_contact_phone | CharField | Emergency contact phone |
| linkedin_url | URLField | LinkedIn profile |
| twitter_url | URLField | Twitter profile |
| department | CharField | Department (for staff) |
| position | CharField | Staff position |
| school_subject | ForeignKey | Teacher's subject specialization |
| teachable_grades | ManyToManyField | Grades teacher can teach |
| hire_date | DateField | Hire date (for staff) |
| salary | DecimalField | Salary amount |
| created_at | DateTimeField | Profile creation |
| updated_at | DateTimeField | Last update |

**Relationships**:
- One-to-One with User
- FK to Subject (for teachers)
- Many-to-Many with Grade (teachable_grades)

**Properties**:
- `full_name`: English full name
- `ar_full_name`: Arabic full name
- `profile_picture_url`: Cloudinary URL
- `age`: Calculated from date_of_birth

---

### StudentEnrollment
**Purpose**: Student enrollment in classes

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| student | ForeignKey | Student user |
| school_class | ForeignKey | Enrolled class |
| academic_year | ForeignKey | Academic year |
| enrollment_date | DateField | Enrollment date |
| is_active | BooleanField | Active status |
| student_number | CharField | Student ID in class |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Update timestamp |

**Constraints**:
- Unique together: student, school_class, academic_year

---

### BulkImportJob
**Purpose**: Track bulk user import operations

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| job_id | UUIDField | Unique job identifier |
| created_by | ForeignKey | User who initiated import |
| status | CharField | Job status (PENDING, PROCESSING, COMPLETED, FAILED) |
| progress | IntegerField | Progress percentage (0-100) |
| current_status | CharField | Current operation status |
| total_records | IntegerField | Total records to import |
| processed_records | IntegerField | Records processed |
| successful_records | IntegerField | Successful imports |
| failed_records | IntegerField | Failed imports |
| error_message | TextField | Error details |
| results | JSONField | Import results data |
| created_at | DateTimeField | Job creation |
| started_at | DateTimeField | Job start time |
| completed_at | DateTimeField | Job completion time |

---

## Schools App Models

### School
**Purpose**: Singleton school configuration

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| name | CharField | School name (English) |
| name_arabic | CharField | School name (Arabic) |
| name_french | CharField | School name (French) |
| phone | CharField | Primary phone |
| fix_phone | CharField | Fixed line phone |
| whatsapp_num | CharField | WhatsApp number |
| email | EmailField | School email |
| website | URLField | School website |
| facebook_url | URLField | Facebook page |
| instagram_url | URLField | Instagram profile |
| twitter_url | URLField | Twitter profile |
| linkedin_url | URLField | LinkedIn page |
| youtube_url | URLField | YouTube channel |
| school_code | CharField | Official school code |
| pattent | CharField | Patent number |
| rc_code | CharField | RC code |
| logo | CloudinaryField | School logo |
| address | TextField | School address |
| city | CharField | City |
| region | CharField | Region |
| postal_code | CharField | Postal code |
| current_academic_year | ForeignKey | Current academic year |
| director | ForeignKey | School director |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Update timestamp |

**Constraints**:
- Singleton (only one instance allowed)

---

### AcademicYear
**Purpose**: Academic year management

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| year | CharField | Year format (YYYY-YYYY) |
| start_date | DateField | Academic year start |
| end_date | DateField | Academic year end |
| is_current | BooleanField | Currently active year |

**Constraints**:
- Unique year
- Only one year can be current

---

### EducationalLevel
**Purpose**: School divisions (Primary, Secondary, etc.)

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| level | CharField | Level type (PRESCHOOL, PRIMARY, LOWER_SECONDARY, UPPER_SECONDARY) |
| name | CharField | Level name (English) |
| name_arabic | CharField | Level name (Arabic) |
| name_french | CharField | Level name (French) |
| order | PositiveIntegerField | Display order |

**Constraints**:
- Unique level

---

### Grade
**Purpose**: Grade levels within educational levels

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| educational_level | ForeignKey | Parent educational level |
| grade_number | PositiveIntegerField | Grade number within level |
| code | CharField | Grade code (e.g., 'G1', '1BAC') |
| name | CharField | Grade name (English) |
| name_arabic | CharField | Grade name (Arabic) |
| name_french | CharField | Grade name (French) |
| passing_grade | DecimalField | Minimum passing grade |

**Constraints**:
- Unique together: educational_level, grade_number
- Unique code

---

### Track
**Purpose**: Academic tracks/specializations (مسالك)

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| grade | ForeignKey | Parent grade |
| name | CharField | Track name (English) |
| name_arabic | CharField | Track name (Arabic) |
| name_french | CharField | Track name (French) |
| code | CharField | Track code (e.g., 'SMA') |
| description | TextField | Track description |
| description_arabic | TextField | Description (Arabic) |
| description_french | TextField | Description (French) |
| is_active | BooleanField | Active status |
| order | PositiveIntegerField | Display order |

**Constraints**:
- Unique together: grade, code

---

### SchoolClass
**Purpose**: Student groups for an academic year

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| grade | ForeignKey | Grade level |
| track | ForeignKey | Track (optional) |
| academic_year | ForeignKey | Academic year |
| section | CharField | Section (e.g., 'A', 'B') |
| name | CharField | Auto-generated class name |
| teachers | ManyToManyField | Assigned teachers |

**Constraints**:
- Unique together: grade, track, section, academic_year

---

### Subject
**Purpose**: Academic subjects

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| name | CharField | Subject name (English) |
| name_arabic | CharField | Subject name (Arabic) |
| name_french | CharField | Subject name (French) |
| code | CharField | Subject code |

**Constraints**:
- Unique code

---

### SubjectGrade
**Purpose**: Subject configuration for specific grades

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| subject | ForeignKey | Subject reference |
| grade | ForeignKey | Grade reference |
| is_mandatory | BooleanField | Required subject |
| weekly_hours | PositiveIntegerField | Hours per week |
| coefficient | DecimalField | Subject coefficient |

**Constraints**:
- Unique together: subject, grade

---

### Room
**Purpose**: Physical classroom/lab spaces

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| name | CharField | Room name |
| code | CharField | Room code |
| room_type | CharField | Type (CLASSROOM, LAB, LIBRARY, GYM, etc.) |
| capacity | PositiveIntegerField | Maximum capacity |

**Constraints**:
- Unique code

---

### Equipment
**Purpose**: Room equipment inventory

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| room | ForeignKey | Parent room |
| name | CharField | Equipment name |
| description | TextField | Description |
| quantity | PositiveIntegerField | Quantity |
| is_active | BooleanField | Active status |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Update timestamp |

**Constraints**:
- Unique together: room, name

---

### Vehicle
**Purpose**: School vehicle fleet

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| school | ForeignKey | School reference |
| name | CharField | Vehicle name |
| vehicle_type | CharField | Type (BUS, MINIBUS, VAN, CAR) |
| model | CharField | Vehicle model |
| plate_number | CharField | License plate |
| driver | ForeignKey | Assigned driver |
| capacity | PositiveIntegerField | Passenger capacity |
| color | CharField | Vehicle color |
| manufacture_year | PositiveIntegerField | Year manufactured |
| last_oil_change_date | DateField | Last oil change |
| last_service_date | DateField | Last service |
| insurance_expiry_date | DateField | Insurance expiry |
| notes | TextField | Additional notes |
| is_active | BooleanField | Active status |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Update timestamp |

**Constraints**:
- Unique plate_number

---

### VehicleMaintenanceRecord
**Purpose**: Vehicle maintenance history

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| vehicle | ForeignKey | Vehicle reference |
| service_date | DateField | Service date |
| service_type | CharField | Type of service |
| description | TextField | Service description |
| service_location | CharField | Service location |
| mileage | PositiveIntegerField | Mileage at service |
| cost | DecimalField | Service cost |
| created_at | DateTimeField | Record creation |
| updated_at | DateTimeField | Record update |

---

### GasoilRecord
**Purpose**: Fuel refill tracking

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| vehicle | ForeignKey | Vehicle reference |
| refuel_date | DateField | Refuel date |
| liters | DecimalField | Liters filled |
| amount | DecimalField | Total cost |
| fuel_station | CharField | Fuel station |
| receipt_number | CharField | Receipt number |
| notes | TextField | Additional notes |
| created_at | DateTimeField | Record creation |
| updated_at | DateTimeField | Record update |

---

## Lessons App Models

### Lesson
**Purpose**: Core lesson/topic entity

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| subject | ForeignKey | Subject reference |
| grade | ForeignKey | Grade reference |
| tracks | ManyToManyField | Associated tracks |
| category | ForeignKey | Subject category (optional) |
| unit | CharField | Unit name |
| title | CharField | Lesson title (English) |
| title_arabic | CharField | Lesson title (Arabic) |
| title_french | CharField | Lesson title (French) |
| description | TextField | Lesson description |
| cycle | CharField | Moroccan cycle (first/second) |
| order | PositiveIntegerField | Lesson sequence |
| objectives | TextField | Learning objectives |
| prerequisites | TextField | Prerequisites |
| difficulty_level | CharField | Difficulty (easy, medium, hard) |
| is_active | BooleanField | Active status |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Update timestamp |
| created_by | ForeignKey | Creator user |

**Constraints**:
- Unique together: subject, grade, cycle, order

---

### LessonResource
**Purpose**: Lesson materials and content

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| lesson | ForeignKey | Parent lesson |
| title | CharField | Resource title |
| description | TextField | Resource description |
| resource_type | CharField | Type (pdf, video, audio, image, link, blocks, markdown, etc.) |
| file | CloudinaryField | Uploaded file |
| external_url | URLField | External resource URL |
| markdown_content | TextField | Markdown formatted content |
| blocks_content | JSONField | Notion-style blocks |
| content_version | PositiveIntegerField | Version for concurrent editing |
| file_size | PositiveIntegerField | File size in bytes |
| file_format | CharField | File format |
| is_visible_to_students | BooleanField | Student visibility |
| is_downloadable | BooleanField | Download permission |
| order | PositiveIntegerField | Display order |
| uploaded_at | DateTimeField | Upload timestamp |
| uploaded_by | ForeignKey | Uploader user |

---

### SubjectCategory
**Purpose**: Subject subdivisions (e.g., Algebra, Geometry)

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| subject | ForeignKey | Parent subject |
| ar_name | CharField | Arabic name |
| fr_name | CharField | French name |
| en_name | CharField | English name |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Update timestamp |

---

### LessonTag
**Purpose**: Tags for lesson categorization

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| name | CharField | Tag name (English) |
| name_arabic | CharField | Tag name (Arabic) |
| color | CharField | Tag color (hex) |

---

### LessonAvailability
**Purpose**: Class-specific lesson publishing

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| lesson | ForeignKey | Lesson reference |
| school_class | ForeignKey | Target class |
| is_published | BooleanField | Published status |
| published_at | DateTimeField | Publication timestamp |
| published_by | ForeignKey | Publisher user |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Update timestamp |

**Constraints**:
- Unique together: lesson, school_class

---

## Homework App Models

### RewardSettings
**Purpose**: Global gamification settings

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| school | OneToOneField | School reference |
| points_per_correct_qcm | PositiveIntegerField | Points per correct QCM |
| points_per_assignment_completion | PositiveIntegerField | Completion points |
| points_perfect_score | PositiveIntegerField | Perfect score bonus |
| points_on_time_submission | PositiveIntegerField | On-time bonus |
| points_early_submission | PositiveIntegerField | Early submission bonus |
| late_submission_penalty | PositiveIntegerField | Late penalty |
| points_to_coins_ratio | DecimalField | Point-to-coin conversion |
| enable_leaderboard | BooleanField | Enable leaderboards |
| enable_badges | BooleanField | Enable badges |
| enable_weekly_reset | BooleanField | Weekly reset enabled |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Update timestamp |

---

### StudentWallet
**Purpose**: Student reward balances

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| student | OneToOneField | Student user |
| total_points | PositiveIntegerField | Total points |
| total_coins | PositiveIntegerField | Total coins |
| total_gems | PositiveIntegerField | Total gems |
| total_stars | PositiveIntegerField | Total stars |
| experience_points | PositiveIntegerField | XP (for levels) |
| weekly_points | PositiveIntegerField | Weekly points |
| weekly_coins | PositiveIntegerField | Weekly coins |
| current_week | DateField | Current week tracker |
| monthly_points | PositiveIntegerField | Monthly points |
| monthly_coins | PositiveIntegerField | Monthly coins |
| current_month | DateField | Current month tracker |
| level | PositiveIntegerField | Current level |
| assignments_completed | PositiveIntegerField | Completed count |
| perfect_scores | PositiveIntegerField | Perfect scores count |
| early_submissions | PositiveIntegerField | Early submissions count |
| current_streak | PositiveIntegerField | Current daily streak |
| longest_streak | PositiveIntegerField | Longest streak |
| last_activity | DateField | Last activity date |
| created_at | DateTimeField | Wallet creation |
| updated_at | DateTimeField | Last update |

---

### RewardTransaction
**Purpose**: Reward transaction history

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| student | ForeignKey | Student user |
| homework | ForeignKey | Related homework (optional) |
| exercise | ForeignKey | Related exercise (optional) |
| submission | ForeignKey | Related submission (optional) |
| exercise_submission | ForeignKey | Related exercise submission (optional) |
| transaction_type | CharField | Type (earned, bonus, penalty, spent, gift, achievement) |
| points_earned | IntegerField | Points amount |
| coins_earned | IntegerField | Coins amount |
| gems_earned | IntegerField | Gems amount |
| stars_earned | IntegerField | Stars amount |
| xp_earned | IntegerField | XP amount |
| reason | CharField | Transaction reason (English) |
| reason_arabic | CharField | Transaction reason (Arabic) |
| created_at | DateTimeField | Transaction timestamp |
| awarded_by | ForeignKey | Awarder user |

---

### Badge
**Purpose**: Available achievement badges

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| name | CharField | Badge name (English) |
| name_arabic | CharField | Badge name (Arabic) |
| description | TextField | Description (English) |
| description_arabic | TextField | Description (Arabic) |
| icon | CharField | Icon class/emoji |
| color | CharField | Badge color (hex) |
| image | CloudinaryField | Badge image |
| badge_type | CharField | Type (achievement, milestone, streak, performance, participation, special) |
| rarity | CharField | Rarity (common, rare, epic, legendary) |
| requirements | JSONField | Earning criteria |
| points_reward | PositiveIntegerField | Points reward |
| coins_reward | PositiveIntegerField | Coins reward |
| is_active | BooleanField | Active status |
| is_hidden | BooleanField | Hidden until earned |
| created_at | DateTimeField | Badge creation |

---

### StudentBadge
**Purpose**: Badges earned by students

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| student | ForeignKey | Student user |
| badge | ForeignKey | Badge earned |
| earned_at | DateTimeField | Earning timestamp |
| earned_for | CharField | Earning context |
| homework | ForeignKey | Related homework (optional) |
| exercise | ForeignKey | Related exercise (optional) |
| submission | ForeignKey | Related submission (optional) |
| exercise_submission | ForeignKey | Related exercise submission (optional) |

**Constraints**:
- Unique together: student, badge

---

### Leaderboard
**Purpose**: Competition leaderboards

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| name | CharField | Leaderboard name |
| leaderboard_type | CharField | Type (weekly, monthly, semester, yearly) |
| scope | CharField | Scope (school, grade, class, subject) |
| grade | ForeignKey | Grade filter (optional) |
| school_class | ForeignKey | Class filter (optional) |
| subject | ForeignKey | Subject filter (optional) |
| start_date | DateField | Period start |
| end_date | DateField | Period end |
| is_active | BooleanField | Active status |
| max_participants | PositiveIntegerField | Max participants |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Update timestamp |

---

### LeaderboardEntry
**Purpose**: Individual leaderboard rankings

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| leaderboard | ForeignKey | Parent leaderboard |
| student | ForeignKey | Student user |
| current_rank | PositiveIntegerField | Current rank |
| previous_rank | PositiveIntegerField | Previous rank |
| total_points | PositiveIntegerField | Total points |
| total_coins | PositiveIntegerField | Total coins |
| assignments_completed | PositiveIntegerField | Completed count |
| perfect_scores | PositiveIntegerField | Perfect scores |
| points_this_period | PositiveIntegerField | Period points |
| rank_change | IntegerField | Rank change |
| last_updated | DateTimeField | Last update |

**Constraints**:
- Unique together: leaderboard, student

---

### Homework
**Purpose**: Teacher-assigned mandatory work

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| subject | ForeignKey | Subject reference |
| grade | ForeignKey | Grade reference |
| school_class | ForeignKey | Class reference |
| lesson | ForeignKey | Related lesson (optional) |
| teacher | ForeignKey | Creator teacher |
| title | CharField | Homework title (English) |
| title_arabic | CharField | Homework title (Arabic) |
| description | TextField | Description |
| instructions | TextField | Instructions |
| homework_format | CharField | Format (mixed, qcm_only, open_only, book_exercises, project, practical) |
| homework_type | CharField | Type (homework, classwork, quiz, exam, project) |
| assigned_date | DateTimeField | Assignment date |
| due_date | DateTimeField | Due date |
| estimated_duration | PositiveIntegerField | Duration in minutes |
| time_limit | PositiveIntegerField | Time limit in minutes |
| is_timed | BooleanField | Timed assignment |
| total_points | DecimalField | Total points |
| auto_grade_qcm | BooleanField | Auto-grade QCM |
| randomize_questions | BooleanField | Randomize questions |
| show_results_immediately | BooleanField | Show results |
| allow_multiple_attempts | BooleanField | Multiple attempts |
| max_attempts | PositiveIntegerField | Max attempts |
| allow_late_submissions | BooleanField | Late submissions |
| late_penalty_percentage | DecimalField | Late penalty % |
| is_active | BooleanField | Active status |
| is_published | BooleanField | Published status |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Update timestamp |

---

### Exercise
**Purpose**: Optional practice exercises linked to lessons

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| lesson | ForeignKey | Parent lesson |
| created_by | ForeignKey | Creator user |
| title | CharField | Exercise title (English) |
| title_arabic | CharField | Exercise title (Arabic) |
| description | TextField | Description |
| instructions | TextField | Instructions |
| exercise_format | CharField | Format (mixed, qcm_only, open_only, practical, interactive) |
| difficulty_level | CharField | Difficulty (beginner, intermediate, advanced, expert) |
| order | PositiveIntegerField | Order in lesson |
| estimated_duration | PositiveIntegerField | Duration in minutes |
| total_points | DecimalField | Total points |
| is_published | BooleanField | Published status |
| allow_multiple_attempts | BooleanField | Multiple attempts |
| max_attempts | PositiveIntegerField | Max attempts |
| prerequisite_exercise | ForeignKey | Prerequisite exercise (optional) |
| available_from | DateTimeField | Available from |
| available_until | DateTimeField | Available until |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Update timestamp |

---

### Question
**Purpose**: Universal question model (8 types)

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| homework | ForeignKey | Parent homework (optional) |
| exercise | ForeignKey | Parent exercise (optional) |
| question_type | CharField | Type (qcm_single, qcm_multiple, true_false, fill_blank, matching, ordering, open_short, open_long) |
| question_text | TextField | Question text (English) |
| question_text_arabic | TextField | Question text (Arabic) |
| question_image | CloudinaryField | Question image (optional) |
| points | DecimalField | Points value |
| order | PositiveIntegerField | Question order |
| explanation | TextField | Answer explanation |
| explanation_arabic | TextField | Explanation (Arabic) |
| is_required | BooleanField | Required question |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Update timestamp |

---

### QuestionChoice
**Purpose**: Multiple choice options

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| question | ForeignKey | Parent question |
| choice_text | TextField | Choice text (English) |
| choice_text_arabic | TextField | Choice text (Arabic) |
| is_correct | BooleanField | Correct answer |
| order | PositiveIntegerField | Choice order |

---

### Submission
**Purpose**: Homework submissions

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| homework | ForeignKey | Parent homework |
| student | ForeignKey | Student user |
| status | CharField | Status (draft, in_progress, submitted, late, auto_graded, manually_graded) |
| attempt_number | PositiveIntegerField | Attempt number |
| started_at | DateTimeField | Start timestamp |
| submitted_at | DateTimeField | Submission timestamp |
| time_spent_seconds | PositiveIntegerField | Time spent |
| score | DecimalField | Achieved score |
| percentage | DecimalField | Score percentage |
| auto_graded_score | DecimalField | Auto-graded portion |
| manual_grade | DecimalField | Manual grade |
| teacher_feedback | TextField | Teacher feedback |
| is_late | BooleanField | Late submission |
| late_penalty_applied | DecimalField | Penalty amount |
| graded_at | DateTimeField | Grading timestamp |
| graded_by | ForeignKey | Grader user |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Update timestamp |

**Constraints**:
- Unique together: homework, student, attempt_number

---

### QuestionAnswer
**Purpose**: Individual question responses

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| submission | ForeignKey | Parent submission |
| question | ForeignKey | Question reference |
| answer_text | TextField | Text answer |
| selected_choices | ManyToManyField | Selected choices (for QCM) |
| is_correct | BooleanField | Correctness (auto-graded) |
| points_earned | DecimalField | Points earned |
| manually_graded | BooleanField | Manually graded |
| teacher_comment | TextField | Teacher comment |
| created_at | DateTimeField | Answer timestamp |
| updated_at | DateTimeField | Update timestamp |

---

### LessonProgress
**Purpose**: Track student progress in lessons

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| student | ForeignKey | Student user |
| lesson | ForeignKey | Lesson reference |
| completion_percentage | DecimalField | Completion % |
| time_spent_minutes | PositiveIntegerField | Time spent |
| exercises_completed | PositiveIntegerField | Exercises done |
| average_score | DecimalField | Average score |
| last_accessed | DateTimeField | Last access |
| is_completed | BooleanField | Completion status |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Update timestamp |

**Constraints**:
- Unique together: student, lesson

---

## Attendance App Models

### SchoolTimetable
**Purpose**: Class schedule for academic year

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| school_class | ForeignKey | Class reference |
| academic_year | ForeignKey | Academic year |
| is_active | BooleanField | Active status |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Update timestamp |
| created_by | ForeignKey | Creator user |

**Constraints**:
- Unique together: school_class, academic_year

---

### TimetableSession
**Purpose**: Individual class periods

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| timetable | ForeignKey | Parent timetable |
| subject | ForeignKey | Subject reference |
| teacher | ForeignKey | Teacher reference |
| day_of_week | IntegerField | Day (1-6 for Mon-Sat) |
| start_time | TimeField | Session start |
| end_time | TimeField | Session end |
| session_order | PositiveIntegerField | Period number |
| room | ForeignKey | Room assignment (optional) |
| is_active | BooleanField | Active status |
| notes | TextField | Session notes |

**Constraints**:
- Unique together: timetable, day_of_week, session_order
- No teacher conflicts (same teacher, day, time)

---

### AttendanceSession
**Purpose**: Attendance taking session

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| timetable_session | ForeignKey | Timetable session |
| date | DateField | Attendance date |
| teacher | ForeignKey | Teacher taking attendance |
| status | CharField | Status (not_started, in_progress, completed, cancelled) |
| started_at | DateTimeField | Start timestamp |
| completed_at | DateTimeField | Completion timestamp |
| notes | TextField | Session notes |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Update timestamp |

**Constraints**:
- Unique together: timetable_session, date

---

### AttendanceRecord
**Purpose**: Individual student attendance

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| attendance_session | ForeignKey | Parent session |
| student | ForeignKey | Student user |
| status | CharField | Status (present, absent, late, excused) |
| marked_at | DateTimeField | Marking timestamp |
| marked_by | ForeignKey | Marker user |
| arrival_time | TimeField | Arrival time (for late) |
| notes | TextField | Record notes |
| updated_at | DateTimeField | Update timestamp |

**Constraints**:
- Unique together: attendance_session, student

---

### StudentAbsenceFlag
**Purpose**: Absence alerts requiring attention

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| student | ForeignKey | Student user |
| attendance_record | ForeignKey | Related attendance record |
| is_cleared | BooleanField | Cleared status |
| created_at | DateTimeField | Flag creation |
| cleared_at | DateTimeField | Clearance timestamp |
| cleared_by | ForeignKey | Clearer user |
| clearance_reason | CharField | Reason (medical, family, parent_permission, school_activity, other) |
| clearance_notes | TextField | Clearance notes |
| clearance_document | CloudinaryField | Supporting document |

**Constraints**:
- Unique together: student, attendance_record

---

### StudentParentRelation
**Purpose**: Parent-student relationships for notifications

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| student | ForeignKey | Student user |
| parent | ForeignKey | Parent user |
| relationship_type | CharField | Type (father, mother, guardian, other) |
| is_primary_contact | BooleanField | Primary contact |
| is_active | BooleanField | Active status |
| notify_absence | BooleanField | Send absence notifications |
| notify_late | BooleanField | Send late notifications |
| notify_flags | BooleanField | Send flag notifications |
| created_at | DateTimeField | Creation timestamp |

**Constraints**:
- Unique together: student, parent

---

### AttendanceNotification
**Purpose**: Parent attendance notifications

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| recipient | ForeignKey | Recipient user (parent) |
| student | ForeignKey | Related student |
| notification_type | CharField | Type (absence, late, flag_created, flag_cleared, chronic_absence) |
| title | CharField | Notification title |
| message | TextField | Message content |
| attendance_record | ForeignKey | Related record (optional) |
| absence_flag | ForeignKey | Related flag (optional) |
| delivery_status | CharField | Status (pending, sent, delivered, failed) |
| delivery_method | CharField | Method (sms, email, push, in_app) |
| sent_at | DateTimeField | Send timestamp |
| read_at | DateTimeField | Read timestamp |
| is_read | BooleanField | Read status |
| requires_action | BooleanField | Action required |
| created_at | DateTimeField | Creation timestamp |

---

## Lab App Models

### LabToolCategory
**Purpose**: Lab tool organization

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| name | CharField | Category name (math, physics, chemistry, biology, economics, languages) |
| name_ar | CharField | Arabic name |
| name_fr | CharField | French name |
| name_en | CharField | English name |
| icon | CharField | Lucide icon name |
| color | CharField | Category color (hex) |
| order | PositiveIntegerField | Display order |
| is_active | BooleanField | Active status |

---

### LabTool
**Purpose**: Available virtual lab tools

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| tool_id | CharField | URL-safe identifier |
| name_ar | CharField | Arabic name |
| name_fr | CharField | French name |
| name_en | CharField | English name |
| description_ar | TextField | Arabic description |
| description_fr | TextField | French description |
| description_en | TextField | English description |
| instructions_ar | TextField | Arabic instructions |
| instructions_fr | TextField | French instructions |
| instructions_en | TextField | English instructions |
| category | ForeignKey | Tool category |
| icon | CharField | Lucide icon name |
| thumbnail | ImageField | Tool thumbnail |
| grade_levels | JSONField | Applicable grades list |
| features | JSONField | Tool-specific features |
| is_active | BooleanField | Active status |
| is_premium | BooleanField | Premium tool |
| is_new | BooleanField | Show NEW badge |
| version | CharField | Tool version |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Update timestamp |
| created_by | ForeignKey | Creator user |
| total_uses | PositiveIntegerField | Total uses count |
| unique_users | PositiveIntegerField | Unique users count |
| average_duration | PositiveIntegerField | Average duration (seconds) |

**Constraints**:
- Unique tool_id

---

### LabUsage
**Purpose**: Track tool usage sessions

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| user | ForeignKey | User reference |
| tool | ForeignKey | Tool reference |
| started_at | DateTimeField | Session start |
| ended_at | DateTimeField | Session end |
| duration_seconds | PositiveIntegerField | Duration |
| assignment | ForeignKey | Related assignment (optional) |
| activity | ForeignKey | Related activity (optional) |
| interaction_data | JSONField | Tool-specific data |
| device_type | CharField | Device (desktop, tablet, mobile) |

---

### LabAssignment
**Purpose**: Teacher-assigned lab tasks

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| title | CharField | Assignment title (English) |
| title_ar | CharField | Assignment title (Arabic) |
| description | TextField | Description |
| instructions | TextField | Instructions |
| teacher | ForeignKey | Creator teacher |
| school_class | ForeignKey | Target class |
| subject | ForeignKey | Subject reference |
| tool | ForeignKey | Lab tool |
| task_details | JSONField | Task specifics |
| assigned_date | DateTimeField | Assignment date |
| due_date | DateTimeField | Due date |
| estimated_duration | PositiveIntegerField | Duration (minutes) |
| requires_submission | BooleanField | Submission required |
| submission_format | CharField | Format (screenshot, file, text, automatic) |
| total_points | DecimalField | Total points |
| auto_grade | BooleanField | Auto-grading enabled |
| is_active | BooleanField | Active status |
| is_published | BooleanField | Published status |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Update timestamp |

---

### LabAssignmentSubmission
**Purpose**: Student lab submissions

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| assignment | ForeignKey | Parent assignment |
| student | ForeignKey | Student user |
| submitted_at | DateTimeField | Submission timestamp |
| submission_text | TextField | Text submission |
| submission_file | FileField | File submission |
| usage_session | ForeignKey | Related usage session |
| time_spent | PositiveIntegerField | Time spent (minutes) |
| status | CharField | Status (not_started, in_progress, submitted, graded) |
| score | DecimalField | Achieved score |
| teacher_feedback | TextField | Teacher feedback |
| graded_at | DateTimeField | Grading timestamp |
| graded_by | ForeignKey | Grader user |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Update timestamp |

**Constraints**:
- Unique together: assignment, student

---

### LabActivity
**Purpose**: Reusable lab activity templates

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| title | CharField | Activity title (English) |
| title_ar | CharField | Activity title (Arabic) |
| description | TextField | Description |
| created_by | ForeignKey | Creator user |
| tool | ForeignKey | Lab tool |
| activity_config | JSONField | Tool-specific config |
| grade_levels | JSONField | Applicable grades |
| is_public | BooleanField | Public sharing |
| is_template | BooleanField | Template status |
| uses_count | PositiveIntegerField | Usage count |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Update timestamp |

---

### LabToolAnalytics
**Purpose**: Daily tool usage analytics

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| tool | ForeignKey | Tool reference |
| date | DateField | Analytics date |
| total_sessions | PositiveIntegerField | Total sessions |
| unique_users | PositiveIntegerField | Unique users |
| total_duration_seconds | PositiveIntegerField | Total duration |
| average_duration_seconds | PositiveIntegerField | Average duration |
| student_users | PositiveIntegerField | Student users |
| teacher_users | PositiveIntegerField | Teacher users |
| admin_users | PositiveIntegerField | Admin users |
| desktop_sessions | PositiveIntegerField | Desktop sessions |
| tablet_sessions | PositiveIntegerField | Tablet sessions |
| mobile_sessions | PositiveIntegerField | Mobile sessions |
| created_at | DateTimeField | Creation timestamp |

**Constraints**:
- Unique together: tool, date

---

## Activity Log Models

### ActivityLog
**Purpose**: System audit trail

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| actor | ForeignKey | User who performed action |
| actor_role | CharField | Actor's role |
| action | CharField | Action type (MESSAGE_SENT, HOMEWORK_CREATED, PAYMENT_RECORDED, etc.) |
| description | TextField | Action description |
| target_app | CharField | Target app name |
| target_model | CharField | Target model name |
| target_id | CharField | Target object ID |
| target_repr | CharField | String representation |
| metadata | JSONField | Additional metadata |
| ip_address | GenericIPAddressField | IP address |
| user_agent | TextField | User agent string |
| created_at | DateTimeField | Log timestamp |

**Indexes**:
- created_at (descending)
- action
- actor

---

## Relationships Overview

### Key Relationships

```
User (1) ←→ (1) Profile
User (1) ←→ (Many) StudentEnrollment
User (Parent) (1) ←→ (Many) User (Student)

School (1) ←→ (Many) Vehicle
School (1) ←→ (1) RewardSettings

AcademicYear (1) ←→ (Many) SchoolClass
AcademicYear (1) ←→ (Many) StudentEnrollment

EducationalLevel (1) ←→ (Many) Grade
Grade (1) ←→ (Many) Track
Grade (1) ←→ (Many) SchoolClass

Subject (1) ←→ (Many) Lesson
Grade (1) ←→ (Many) Lesson

Lesson (1) ←→ (Many) LessonResource
Lesson (1) ←→ (Many) Exercise
Lesson (1) ←→ (Many) Homework

Homework (1) ←→ (Many) Question
Homework (1) ←→ (Many) Submission

Question (1) ←→ (Many) QuestionChoice
Question (1) ←→ (Many) QuestionAnswer

Student (1) ←→ (1) StudentWallet
Student (1) ←→ (Many) RewardTransaction
Student (1) ←→ (Many) StudentBadge

SchoolClass (1) ←→ (1) SchoolTimetable
TimetableSession (1) ←→ (Many) AttendanceSession
AttendanceSession (1) ←→ (Many) AttendanceRecord

LabTool (1) ←→ (Many) LabUsage
LabTool (1) ←→ (Many) LabAssignment
```

### Cascade Behaviors

**CASCADE**: When parent is deleted, children are deleted
- User → StudentEnrollment
- Homework → Question
- Homework → Submission
- AttendanceSession → AttendanceRecord

**SET_NULL**: When parent is deleted, FK is set to NULL
- User (teacher) → Lesson (created_by)
- User (teacher) → Homework (teacher)
- Subject → Lesson (subject)

**PROTECT**: Prevents deletion if children exist
- AcademicYear → SchoolClass

---

**Total Models**: 80+ models
**Last Updated**: December 2025
