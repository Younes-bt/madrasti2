# Backend Django Models Documentation

## Table of Contents
1. [Users App](#users-app)
2. [Schools App](#schools-app)
3. [Lessons App](#lessons-app)
4. [Homework App](#homework-app)
5. [Attendance App](#attendance-app)
6. [Media App](#media-app)

---

## Users App

### User Model
**Purpose**: Custom authentication user model extending AbstractUser

**Fields**:
- `email` (EmailField, unique): Primary identifier instead of username
- `role` (CharField): User role - ADMIN, TEACHER, STUDENT, PARENT, STAFF, DRIVER
- `parent` (ForeignKey to self): Links student to parent account
- `is_active` (BooleanField): Account active status
- `is_online` (BooleanField): Current online status
- `last_seen` (DateTimeField): Last activity timestamp
- `force_password_change` (BooleanField): Forces password reset on next login
- `created_at`, `updated_at` (DateTimeField): Timestamps

**Methods**:
- `full_name` (property): Returns user's full name from profile
- `update_last_seen()`: Updates last seen timestamp
- `set_online_status(is_online)`: Sets online status and updates last seen

**Relationships**:
- OneToOne with Profile
- ForeignKey to self (parent-children relationship)
- ManyToMany with Group and Permission

**Meta**:
- `db_table`: 'users_user'
- `USERNAME_FIELD`: 'email' (no username field)
- Custom manager: `CustomUserManager`

### Profile Model
**Purpose**: Stores detailed user profile information

**Fields**:
- `user` (OneToOneField): Links to User model
- `ar_first_name`, `ar_last_name` (CharField): Arabic name fields
- `phone` (CharField): Contact number
- `date_of_birth` (DateField): Birth date
- `address` (TextField): Physical address
- `profile_picture` (CloudinaryField): Cloudinary-hosted profile image
- `bio` (TextField): User biography
- `emergency_contact_name`, `emergency_contact_phone` (CharField): Emergency contact info
- `linkedin_url`, `twitter_url` (URLField): Social media links
- `department` (CharField): For staff/teachers
- `position` (CharField, choices): Staff position (DIRECTOR, ASSISTANT, IT_SUPPORT, etc.)
- `school_subject` (ForeignKey to Subject): Teacher's specialization
- `teachable_grades` (ManyToManyField to Grade): Grades teacher can teach
- `hire_date` (DateField): Employment start date
- `salary` (DecimalField): Compensation

**Properties**:
- `full_name`: Returns English full name
- `ar_full_name`: Returns Arabic full name
- `profile_picture_url`: Cloudinary URL for profile picture
- `age`: Calculated age from date_of_birth

**Methods**:
- `get_full_name(language)`: Returns name in specified language
- `get_position_label(language)`: Returns translated position label
- `get_position_labels()`: Returns all position translations

### StudentEnrollment Model
**Purpose**: Tracks student enrollment in specific classes per academic year

**Fields**:
- `student` (ForeignKey to User): Student being enrolled
- `school_class` (ForeignKey to SchoolClass): Class enrolled in
- `academic_year` (ForeignKey to AcademicYear): Enrollment year
- `enrollment_date` (DateField): When enrolled
- `is_active` (BooleanField): Active enrollment status
- `student_number` (CharField): Student ID in class

**Meta**:
- `unique_together`: ['student', 'school_class', 'academic_year']
- `ordering`: ['student__last_name', 'student__first_name']

### BulkImportJob Model
**Purpose**: Tracks bulk user import operations

**Fields**:
- `job_id` (UUIDField): Unique job identifier
- `created_by` (ForeignKey to User): User who started import
- `status` (CharField, choices): PENDING, PROCESSING, COMPLETED, FAILED
- `progress` (IntegerField): Progress percentage (0-100)
- `current_status` (CharField): Current operation description
- `total_records`, `processed_records`, `successful_records`, `failed_records` (IntegerField): Counts
- `error_message` (TextField): Error details if failed
- `results` (JSONField): Import results data
- `created_at`, `started_at`, `completed_at` (DateTimeField): Timestamps

**Properties**:
- `is_completed`: Returns if job is finished

**Methods**:
- `update_progress(progress, status)`: Updates job progress
- `mark_completed(results)`: Marks job as completed
- `mark_failed(error_message)`: Marks job as failed

---

## Schools App

### AcademicYear Model
**Purpose**: Represents academic years (e.g., '2024-2025')

**Fields**:
- `year` (CharField, unique): Format YYYY-YYYY
- `start_date`, `end_date` (DateField): Year boundaries
- `is_current` (BooleanField): Marks current academic year

**Behavior**: Only one year can be `is_current=True` (enforced in save())

### School Model
**Purpose**: Singleton model for school configuration

**Fields**:
- `name`, `name_arabic`, `name_french` (CharField): School names
- `phone`, `fix_phone`, `whatsapp_num` (CharField): Contact numbers
- `email` (EmailField, unique): School email
- `website`, `facebook_url`, `instagram_url`, `twitter_url`, `linkedin_url`, `youtube_url` (URLField): Web presence
- `school_code`, `pattent`, `rc_code` (CharField): Official codes
- `logo` (CloudinaryField): School logo
- `address` (TextField): Physical address
- `city`, `region` (CharField): Location
- `postal_code` (CharField): Postal code
- `current_academic_year` (ForeignKey to AcademicYear): Active year
- `director` (ForeignKey to User): School director

**Properties**:
- `logo_url`: Returns Cloudinary URL for logo

**Behavior**: Only one School instance allowed (enforced in save())

### EducationalLevel Model
**Purpose**: Educational levels (Preschool, Primary, Lower Secondary, Upper Secondary)

**Fields**:
- `level` (CharField, unique): PRESCHOOL, PRIMARY, LOWER_SECONDARY, UPPER_SECONDARY
- `name`, `name_arabic`, `name_french` (CharField): Level names
- `order` (PositiveIntegerField, unique): Progression order

**Meta**:
- `ordering`: ['order']

### Grade Model
**Purpose**: Specific grades within educational levels

**Fields**:
- `educational_level` (ForeignKey to EducationalLevel): Parent level
- `grade_number` (PositiveIntegerField): Numeric grade (1, 2, 3...)
- `code` (CharField, unique): Grade code (e.g., 'G1', '1BAC')
- `name`, `name_arabic`, `name_french` (CharField): Grade names
- `passing_grade` (DecimalField): Minimum passing score (default 10.00)

**Meta**:
- `unique_together`: ['educational_level', 'grade_number']
- `ordering`: ['educational_level__order', 'grade_number']

### Track Model
**Purpose**: Academic tracks/paths within grades (مسالك) e.g., Sciences Math A

**Fields**:
- `grade` (ForeignKey to Grade): Parent grade
- `name`, `name_arabic`, `name_french` (CharField): Track names
- `code` (CharField): Track code (e.g., 'SMA')
- `description`, `description_arabic`, `description_french` (TextField): Track descriptions
- `is_active` (BooleanField): Active status
- `order` (PositiveIntegerField): Display order

**Meta**:
- `unique_together`: ['grade', 'code']
- `ordering`: ['grade__educational_level__order', 'grade__grade_number', 'order', 'name']

### SchoolClass Model
**Purpose**: Specific student groups for an academic year

**Fields**:
- `grade` (ForeignKey to Grade): Class grade
- `track` (ForeignKey to Track, optional): Class track/specialization
- `academic_year` (ForeignKey to AcademicYear): Year this class is for
- `section` (CharField): Section identifier (A, B, Groupe 1, etc.)
- `name` (CharField, auto-generated): Auto-generated class name
- `teachers` (ManyToManyField to User): Teachers assigned

**Behavior**: `name` is auto-generated from track/grade code + section

**Meta**:
- `unique_together`: ['grade', 'track', 'section', 'academic_year']

### Room Model
**Purpose**: Physical classroom/facility

**Fields**:
- `name` (CharField): Room name
- `code` (CharField, unique): Room code (e.g., 'B101')
- `room_type` (CharField, choices): CLASSROOM, LAB, LIBRARY, GYM, COMPUTER, ART, MUSIC, OTHER
- `capacity` (PositiveIntegerField): Max occupancy

**Methods**:
- `get_images()`: Returns all room media relations
- `get_featured_image()`: Returns featured image
- `get_gallery_images()`: Returns gallery images
- `get_image_count()`: Returns image count

### Equipment Model
**Purpose**: Equipment items assigned to rooms

**Fields**:
- `room` (ForeignKey to Room): Containing room
- `name` (CharField): Equipment name
- `description` (TextField): Equipment description
- `quantity` (PositiveIntegerField): Number of items
- `is_active` (BooleanField): Active status

**Meta**:
- `unique_together`: ('room', 'name')

**Methods**: Similar media methods as Room model

### Vehicle Model
**Purpose**: School-owned vehicles (buses, vans, cars)

**Fields**:
- `school` (ForeignKey to School, optional): Owning school
- `name` (CharField, optional): Friendly name/route identifier
- `vehicle_type` (CharField, choices): BUS, MINIBUS, VAN, CAR, OTHER
- `model` (CharField): Manufacturer and model
- `plate_number` (CharField, unique): License plate
- `driver` (ForeignKey to User, optional): Assigned driver
- `capacity` (PositiveIntegerField, optional): Passenger capacity
- `color`, `manufacture_year` (CharField/PositiveIntegerField): Vehicle details
- `last_oil_change_date`, `last_service_date`, `insurance_expiry_date` (DateField): Maintenance tracking
- `notes` (TextField): Additional notes
- `is_active` (BooleanField): Active status

**Methods**: Similar media methods as Room model

### VehicleMaintenanceRecord Model
**Purpose**: Maintenance and repair history

**Fields**:
- `vehicle` (ForeignKey to Vehicle): Vehicle serviced
- `service_date` (DateField): Service date
- `service_type` (CharField): Type of service
- `description` (TextField): Service details
- `service_location` (CharField): Where serviced
- `mileage` (PositiveIntegerField, optional): Mileage at service
- `cost` (DecimalField, optional): Service cost
- `attachments` (GenericRelation to MediaRelation): Attached documents

### GasoilRecord Model
**Purpose**: Fuel refill tracking

**Fields**:
- `vehicle` (ForeignKey to Vehicle): Refueled vehicle
- `refuel_date` (DateField): Refill date
- `liters` (DecimalField): Liters filled
- `amount` (DecimalField): Amount paid
- `fuel_station` (CharField): Where refueled
- `receipt_number` (CharField, optional): Receipt reference
- `notes` (TextField): Additional notes
- `attachments` (GenericRelation to MediaRelation): Receipt attachments

### Subject Model
**Purpose**: Academic subjects (Math, Science, etc.)

**Fields**:
- `name`, `name_arabic`, `name_french` (CharField): Subject names
- `code` (CharField, unique): Subject code (e.g., 'MATH101')

### SubjectGrade Model
**Purpose**: Links subjects to grades with curriculum details

**Fields**:
- `subject` (ForeignKey to Subject): Subject taught
- `grade` (ForeignKey to Grade): Grade level
- `is_mandatory` (BooleanField): Required vs elective
- `weekly_hours` (PositiveIntegerField): Hours per week (default 2)
- `coefficient` (DecimalField): Grading coefficient (default 1.0)

**Meta**:
- `unique_together`: ['subject', 'grade']

---

## Lessons App

### Lesson Model
**Purpose**: Individual lesson/topic content

**Fields**:
- `subject` (ForeignKey to Subject): Subject this lesson belongs to
- `grade` (ForeignKey to Grade): Grade level
- `tracks` (ManyToManyField to Track): Applicable tracks
- `title`, `title_arabic`, `title_french` (CharField): Lesson titles
- `description` (TextField): Lesson description
- `cycle` (CharField, choices): 'first' or 'second' Moroccan cycle
- `order` (PositiveIntegerField): Sequence within cycle
- `objectives`, `prerequisites` (TextField): Learning goals and requirements
- `difficulty_level` (CharField, choices): easy, medium, hard
- `is_active` (BooleanField): Published status
- `created_by` (ForeignKey to User): Creator

**Meta**:
- `unique_together`: ['subject', 'grade', 'cycle', 'order']
- `ordering`: ['subject', 'grade', 'cycle', 'order']

### LessonResource Model
**Purpose**: Educational resources attached to lessons

**Fields**:
- `lesson` (ForeignKey to Lesson): Parent lesson
- `title`, `description` (CharField/TextField): Resource details
- `resource_type` (CharField, choices): pdf, video, audio, image, document, link, exercise, presentation
- `file` (CloudinaryField): Cloudinary-hosted file
- `external_url` (URLField): Alternative external link
- `file_size`, `file_format` (PositiveIntegerField/CharField): File metadata
- `is_visible_to_students`, `is_downloadable` (BooleanField): Access permissions
- `order` (PositiveIntegerField): Display order
- `uploaded_by` (ForeignKey to User): Uploader

**Properties**:
- `file_url`: Returns Cloudinary URL or external URL

### LessonTag Model
**Purpose**: Categorization tags for lessons

**Fields**:
- `name`, `name_arabic` (CharField): Tag names
- `color` (CharField): Hex color code for UI

### LessonTagging Model
**Purpose**: Many-to-many relationship between lessons and tags

**Meta**:
- `unique_together`: ['lesson', 'tag']

### LessonAvailability Model
**Purpose**: Controls which classes can access lessons (class-specific publishing)

**Fields**:
- `lesson` (ForeignKey to Lesson): Lesson to publish
- `school_class` (ForeignKey to SchoolClass): Target class
- `is_published` (BooleanField): Visibility status
- `published_at` (DateTimeField, optional): Publication timestamp
- `published_by` (ForeignKey to User, optional): Who published

**Meta**:
- `unique_together`: ['lesson', 'school_class']

---

## Homework App

*Due to the extensive size of the Homework app, here are the key model groups:*

### Reward System Models

#### RewardSettings
Global reward point configuration for the school

#### RewardType
Types of rewards (points, coins, gems, stars, xp)

#### StudentWallet
Student's accumulated rewards and achievements

**Key Fields**:
- Total/weekly/monthly balances for each reward type
- Level, assignments_completed, perfect_scores
- Current/longest streak tracking

#### RewardTransaction
Track all reward transactions with reasons

#### Badge, StudentBadge
Badge system for student achievements

#### Leaderboard, LeaderboardEntry, WeeklyLeaderboardSnapshot
Competition and ranking system

### Assignment Models

#### Homework
Teacher-created mandatory assignments

**Key Fields**:
- Linked to subject, grade, class, lesson, teacher
- `homework_format`: mixed, qcm_only, open_only, book_exercises, project, practical
- `homework_type`: homework, classwork, quiz, exam, project
- `due_date`, `time_limit`, `is_timed`
- `total_points`, `auto_grade_qcm`
- `allow_multiple_attempts`, `max_attempts`
- `allow_late_submissions`, `late_penalty_percentage`

#### Exercise
Optional practice exercises linked to lessons

**Similar structure to Homework but**:
- No strict deadlines or penalties
- Focused on practice and improvement
- Can have prerequisites (unlock system)
- Multiple attempts encouraged

#### HomeworkReward, ExerciseReward
Reward configuration for specific assignments

### Question Models

#### Question
Questions for homework/exercises

**Question Types**:
- `qcm_single`: Multiple choice (single answer)
- `qcm_multiple`: Multiple choice (multiple answers)
- `open_short`, `open_long`: Open-ended questions
- `true_false`: True/False questions
- `fill_blank`: Fill in the blanks
- `matching`: Match pairs
- `ordering`: Order items

#### QuestionChoice
Choices for QCM questions

#### FillBlank, FillBlankOption
Structure for fill-in-the-blank questions

#### OrderingItem
Items for ordering questions

#### MatchingPair
Correct pairs for matching questions

#### BookExercise
References to textbook exercises

### Submission Models

#### Submission
Student submissions for homework

**Key Fields**:
- `status`: draft, in_progress, submitted, late, auto_graded, manually_graded
- `attempt_number`, `is_late`
- `total_score`, `auto_score`, `manual_score`
- `points_earned`, `coins_earned`, `bonus_points`
- `teacher_feedback`, `graded_by`

#### QuestionAnswer
Student's answer to individual questions

#### AnswerFillBlankSelection, AnswerOrderingSelection, AnswerMatchingSelection
Specialized answer structures for advanced question types

#### AnswerFile
Files uploaded with answers

#### BookExerciseAnswer, BookExerciseFile
Answers for textbook exercises

#### ExerciseSubmission
Student submissions for exercises (similar to Submission but for practice)

#### ExerciseAnswer
Student's answers for exercise questions

#### ExerciseAnswerFile
Files for exercise answers

### Progress Tracking

#### LessonProgress
Tracks student progress through lessons

**Key Metrics**:
- `exercises_completed` / `exercises_total`
- `completion_percentage`
- `average_score`, `total_points_earned`
- `total_questions_answered`, `total_questions_correct`
- `accuracy_percentage`
- `total_time_spent`
- `status`: not_started, in_progress, completed

**Methods**:
- `update_progress()`: Recalculates all metrics
- `is_completed` (property)
- `next_exercise` (property)

---

## Attendance App

### Timetable Models

#### SchoolTimetable
Main timetable for each class per academic year

**Fields**:
- `school_class` (ForeignKey)
- `academic_year` (ForeignKey)
- `is_active` (BooleanField): Only one active per class per year

#### TimetableSession
Individual class sessions in the timetable

**Fields**:
- `timetable` (ForeignKey)
- `subject`, `teacher` (ForeignKey)
- `day_of_week` (IntegerField, choices): Monday-Saturday (1-6)
- `start_time`, `end_time` (TimeField)
- `session_order` (PositiveIntegerField): Period number
- `room` (ForeignKey, optional)
- `is_active`, `notes`

**Validation**:
- No teacher conflicts (can't be in two places)
- No overlapping sessions
- Start time before end time

### Attendance Models

#### AttendanceSession
Specific instance of attendance taking

**Fields**:
- `timetable_session` (ForeignKey)
- `date` (DateField)
- `teacher` (ForeignKey)
- `status`: not_started, in_progress, completed, cancelled
- `started_at`, `completed_at`

**Methods**:
- `start_session()`: Creates attendance records for all students
- `complete_session()`: Finalizes and creates absence flags
- Properties: `total_students`, `present_count`, `absent_count`, `late_count`

#### AttendanceRecord
Individual student attendance for a session

**Fields**:
- `attendance_session` (ForeignKey)
- `student` (ForeignKey)
- `status`: present, absent, late, excused
- `marked_by` (ForeignKey)
- `arrival_time` (TimeField, optional): For late students
- `notes` (TextField)

### Absence Management

#### StudentAbsenceFlag
Tracks absences needing attention/clearance

**Fields**:
- `student` (ForeignKey)
- `attendance_record` (ForeignKey)
- `is_cleared` (BooleanField)
- `cleared_at`, `cleared_by`
- `clearance_reason`: medical, family, parent_permission, school_activity, other
- `clearance_notes`
- `clearance_document` (CloudinaryField): Medical certificate, etc.

**Methods**:
- `clear_flag(cleared_by, reason, notes, document)`: Clears flag and updates attendance record

#### StudentParentRelation
Links students to parents for notifications

**Fields**:
- `student`, `parent` (ForeignKey)
- `relationship_type`: father, mother, guardian, other
- `is_primary_contact` (BooleanField)
- `notify_absence`, `notify_late`, `notify_flags` (BooleanField): Notification preferences

#### AttendanceNotification
Notifications sent to parents

**Fields**:
- `recipient` (ForeignKey): Parent receiving notification
- `student` (ForeignKey): Student the notification is about
- `notification_type`: absence, late, flag_created, flag_cleared, chronic_absence
- `title`, `message` (CharField/TextField)
- `attendance_record`, `absence_flag` (ForeignKey, optional): Related objects
- `status`: pending, sent, delivered, failed
- `sent_at`, `delivered_at`, `read_at`

**Methods**:
- `mark_as_sent()`, `mark_as_delivered()`, `mark_as_read()`

---

## Media App

### MediaFile Model
**Purpose**: Versatile file storage using Cloudinary

**Fields**:
- `id` (UUIDField): Unique identifier
- `title`, `description` (CharField/TextField): Media metadata
- `media_type` (CharField, choices): IMAGE, PDF, VIDEO, AUDIO, DOCUMENT, OTHER
- `file` (CloudinaryField): Cloudinary-hosted file
- `public_id`, `url`, `secure_url` (CharField/URLField): Cloudinary metadata
- `file_size`, `width`, `height`, `duration`, `format`: File properties
- `tags` (CharField): Comma-separated tags
- `alt_text` (CharField): Accessibility text
- `uploaded_by` (ForeignKey to User)
- `is_active` (BooleanField)

**Methods**:
- `get_file_size_display()`: Human-readable file size
- `get_tags_list()`: Returns tags as list

### MediaRelation Model
**Purpose**: Generic relationship between media and any model

**Fields**:
- `media_file` (ForeignKey to MediaFile)
- `content_type`, `object_id` (Generic Foreign Key fields)
- `content_object` (GenericForeignKey): Links to any model
- `relation_type` (CharField, choices): ROOM_GALLERY, VEHICLE_FEATURED, LESSON_MATERIAL, etc.
- `order` (PositiveIntegerField): Display order
- `is_featured` (BooleanField): Main/featured media flag
- `caption` (CharField, optional): Usage-specific caption

**Behavior**:
- Only one featured media per relation type per object
- Automatically unmarks other featured items when marking new one

**Meta**:
- `unique_together`: ['content_type', 'object_id', 'media_file', 'relation_type']

---

## Summary Statistics

### Total Models: 50+

**By App**:
- Users: 4 models
- Schools: 14 models
- Lessons: 4 models
- Homework: 24+ models (complex gamification & assessment system)
- Attendance: 6 models
- Media: 2 models

### Key Model Relationships:
- Heavy use of ForeignKey relationships
- Strategic use of ManyToManyField for complex associations
- Generic Foreign Keys for flexible media attachments
- Unique constraints to prevent data inconsistencies
- Cascade delete patterns for data integrity

### Cloudinary Integration:
Models using CloudinaryField:
- Profile (profile_picture)
- School (logo)
- Badge (image)
- TextbookLibrary (cover_image)
- LessonResource (file)
- Question (question_image)
- QuestionChoice (choice_image)
- BookExercise (page_image)
- AnswerFile, BookExerciseFile, ExerciseAnswerFile (file)
- StudentAbsenceFlag (clearance_document)
- MediaFile (file)

### Signals:
- User post_save → creates Profile automatically
- Potential signals in homework/lessons apps for reward calculations (check signals.py files)

### Custom Managers:
- CustomUserManager (for email-based authentication)

---

*This documentation covers all major models in the Madrasti 2.0 backend. For API endpoint documentation, see api-endpoints.md*
