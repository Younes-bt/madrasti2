# Features & Workflows

This document details all features and workflows in the Madrasti 2.0 platform.

## Table of Contents

1. [User Management](#user-management)
2. [School Management](#school-management)
3. [Lesson Management](#lesson-management)
4. [Assessment System](#assessment-system)
5. [Gamification System](#gamification-system)
6. [Attendance Management](#attendance-management)
7. [Virtual Laboratory](#virtual-laboratory)
8. [Progress Tracking](#progress-tracking)

---

## User Management

### User Roles

The system supports **6 user roles**, each with specific permissions:

1. **ADMIN** - Full system access
2. **TEACHER** - Class and subject management
3. **STUDENT** - Learning and submission
4. **PARENT** - Monitor children's progress
5. **STAFF** - Administrative tasks
6. **DRIVER** - Vehicle management

### User Registration & Authentication

**Workflow**:
```
1. Admin/Staff creates user account
   ├─> Email used as username
   ├─> Role assigned (TEACHER, STUDENT, PARENT, STAFF, DRIVER)
   ├─> Auto-generated or custom password
   └─> Profile automatically created

2. User receives credentials
   └─> Email with login details

3. First login
   ├─> JWT token issued
   ├─> User redirected to role-specific dashboard
   └─> Optional: Force password change

4. Subsequent logins
   ├─> Email + password authentication
   ├─> JWT access token (60 min)
   ├─> JWT refresh token (7 days)
   └─> Token stored in frontend
```

### Profile Management

**Features**:
- Multilingual names (Arabic, English, French)
- Profile picture upload (Cloudinary)
- Contact information
- Emergency contacts
- Social media links
- Professional details (for staff/teachers)
- Subject specialization (for teachers)

**Teacher-Specific**:
- Subject specialization
- Teachable grades
- Department assignment
- Hire date and salary

**Student-Specific**:
- Parent linkage
- Class enrollments
- Student number per class

### Bulk User Import

**Workflow**:
```
1. Admin prepares Excel/CSV file
   ├─> Columns: email, first_name, last_name, role, etc.
   └─> Validation rules defined

2. Upload file to system
   └─> BulkImportJob created

3. Background processing
   ├─> Job status: PENDING → PROCESSING
   ├─> Validate each record
   ├─> Create users and profiles
   └─> Track progress (0-100%)

4. Completion
   ├─> Status: COMPLETED or FAILED
   ├─> Results: successful_records, failed_records
   └─> Error report available

5. Admin reviews results
   └─> Retry failed imports if needed
```

---

## School Management

### School Structure

**Hierarchy**:
```
School (Singleton)
└─> AcademicYear (2024-2025, 2025-2026, etc.)
    └─> EducationalLevel (Primary, Secondary, etc.)
        └─> Grade (1st, 2nd, 3rd, etc.)
            └─> Track (Sciences Math, Sciences Physics, etc.)
                └─> SchoolClass (Section A, Section B, etc.)
                    └─> Students (via StudentEnrollment)
```

### Academic Year Management

**Workflow**:
```
1. Create new academic year
   ├─> Year: "2024-2025"
   ├─> Start date: September 1, 2024
   └─> End date: June 30, 2025

2. Set as current year
   └─> Only one year can be current

3. Configure classes for year
   ├─> Create SchoolClass instances
   ├─> Assign teachers
   └─> Set timetables

4. Enroll students
   └─> Create StudentEnrollment records

5. Year-end operations
   ├─> Archive year data
   ├─> Promote students
   └─> Create next year
```

### Class Management

**Features**:
- Auto-generated class names (Grade + Track + Section)
- Multiple teacher assignment
- Student enrollment tracking
- Timetable assignment

**Example**: "1BAC SM - A" = 1st Baccalaureate, Sciences Mathématiques, Section A

### Subject Management

**Features**:
- Multilingual subject names
- Unique subject codes
- Grade-specific configuration (SubjectGrade):
  - Weekly hours
  - Coefficient (for grading)
  - Mandatory/Optional status

**Example**:
```
Subject: Mathematics (CODE: MATH)
├─> Grade: 1st Bac
│   ├─> Weekly hours: 6
│   ├─> Coefficient: 7
│   └─> Mandatory: Yes
└─> Grade: 2nd Bac
    ├─> Weekly hours: 8
    ├─> Coefficient: 9
    └─> Mandatory: Yes
```

### Infrastructure Management

**Rooms**:
- Types: Classroom, Lab, Library, Gym, Computer Lab, etc.
- Capacity tracking
- Equipment inventory
- Media gallery support

**Vehicles**:
- Fleet tracking (Bus, Minibus, Van, Car)
- Driver assignment
- Maintenance records
- Fuel (Gasoil) tracking
- Insurance tracking

---

## Lesson Management

### Lesson Creation Workflow

```
1. Teacher selects subject and grade
   └─> Chooses applicable tracks

2. Define lesson details
   ├─> Title (multilingual)
   ├─> Description
   ├─> Cycle (First/Second - Moroccan system)
   ├─> Order within cycle
   ├─> Difficulty level
   ├─> Learning objectives
   └─> Prerequisites

3. Add resources
   ├─> Upload files (PDF, video, audio, images)
   ├─> Add external links (YouTube, etc.)
   ├─> Create markdown content
   ├─> Create Notion-style blocks
   └─> Add exercises

4. Configure visibility
   ├─> Student access permissions
   └─> Download permissions

5. Publish lesson
   └─> Create LessonAvailability per class
```

### Notion-Style Block Editor

**Supported Block Types**:
- **PARAGRAPH**: Rich text paragraph
- **HEADING_1/2/3**: Section headings
- **BULLETED_LIST**: Bullet points
- **NUMBERED_LIST**: Numbered lists
- **CODE**: Code snippets with syntax highlighting
- **QUOTE**: Blockquotes
- **CALLOUT**: Info/warning boxes
- **IMAGE**: Embedded images
- **VIDEO**: Embedded videos
- **EQUATION**: Math equations (KaTeX)
- **DIVIDER**: Section divider

**Features**:
- Drag-and-drop reordering
- Real-time preview
- Version control for concurrent editing
- Markdown export

**Version Control**:
```
1. Teacher opens lesson for editing
   └─> Current content_version: 5

2. Teacher makes changes
   └─> Saves with version: 5

3. System checks version
   ├─> If version matches: Save successful
   └─> If version mismatch: Conflict warning

4. On conflict:
   └─> Show both versions
   └─> Teacher merges manually
```

### Class-Specific Publishing

**Workflow**:
```
1. Teacher creates lesson
   └─> Initially unpublished

2. Select target classes
   ├─> Class A: 1BAC SM - A
   ├─> Class B: 1BAC SM - B
   └─> Class C: 1BAC SP - A

3. Publish to specific classes
   ├─> Create LessonAvailability for each class
   ├─> Set is_published = True
   └─> Record published_by and published_at

4. Students see lesson
   └─> Only in their enrolled class

5. Unpublish if needed
   └─> Set is_published = False per class
```

---

## Assessment System

### Question Types (8 Types)

#### 1. QCM Single Choice
- One correct answer from multiple options
- **Auto-gradable**: Yes
- **Use case**: Definition questions, factual recall

#### 2. QCM Multiple Choice
- Multiple correct answers
- **Auto-gradable**: Yes (all correct must be selected)
- **Use case**: "Select all that apply" questions

#### 3. True/False
- Boolean answer
- **Auto-gradable**: Yes
- **Use case**: Statement verification

#### 4. Fill in the Blank
- Complete sentence with missing word(s)
- **Auto-gradable**: Yes (exact match or predefined options)
- **Use case**: Vocabulary, formulas

#### 5. Matching
- Match items from two columns
- **Auto-gradable**: Yes
- **Use case**: Definitions, translations

#### 6. Ordering
- Arrange items in correct sequence
- **Auto-gradable**: Yes
- **Use case**: Process steps, chronology

#### 7. Open Short Answer
- Brief text response (few words/sentence)
- **Auto-gradable**: No (manual grading)
- **Use case**: Short explanations

#### 8. Open Long Answer
- Extended text response (paragraph/essay)
- **Auto-gradable**: No (manual grading)
- **Use case**: Essays, detailed explanations

### Homework Creation Workflow

```
1. Teacher creates homework
   ├─> Select subject, grade, class
   ├─> Link to lesson (optional)
   ├─> Set title and instructions
   ├─> Choose format (mixed, qcm_only, open_only, etc.)
   └─> Choose type (homework, quiz, exam, project)

2. Configure settings
   ├─> Due date and time
   ├─> Estimated duration
   ├─> Time limit (for timed assignments)
   ├─> Total points
   ├─> Multiple attempts allowed
   ├─> Late submission policy
   └─> Show results immediately

3. Add questions
   ├─> Create questions inline
   ├─> Import from question bank
   └─> Set points per question

4. Configure auto-grading
   ├─> Enable for QCM questions
   └─> Set correct answers

5. Publish homework
   └─> Students can now view and submit
```

### Exercise Creation Workflow

**Exercises vs Homework**:
- **Homework**: Mandatory, graded, deadline-driven
- **Exercise**: Optional, practice-oriented, multiple attempts

```
1. Teacher creates exercise for lesson
   ├─> Link to specific lesson
   ├─> Set difficulty level
   ├─> Choose format
   └─> Set order in lesson

2. Add questions
   └─> Similar to homework

3. Configure availability
   ├─> Available from date
   ├─> Available until date
   ├─> Unlimited attempts (default)
   └─> Prerequisite exercise (optional)

4. Publish
   └─> Students can practice anytime
```

### Student Submission Workflow

**Homework Submission**:
```
1. Student views homework
   └─> Sees instructions, due date, questions

2. Start submission
   ├─> Status: DRAFT → IN_PROGRESS
   ├─> Timer starts (if timed)
   └─> Submission record created

3. Answer questions
   ├─> QCM: Select choices
   ├─> Fill blank: Type answer
   ├─> Open: Type text response
   └─> Upload files if required

4. Submit homework
   ├─> Status: IN_PROGRESS → SUBMITTED
   ├─> Submission timestamp recorded
   └─> Late check performed

5. Auto-grading (if enabled)
   ├─> QCM questions auto-scored
   ├─> Status: SUBMITTED → AUTO_GRADED
   └─> Partial score calculated

6. Teacher manual grading
   ├─> Review open-ended questions
   ├─> Assign points and feedback
   ├─> Status: AUTO_GRADED → MANUALLY_GRADED
   └─> Final score calculated

7. Rewards awarded
   └─> Points, coins, badges calculated
```

**Exercise Submission**:
```
1. Student attempts exercise
   ├─> Multiple attempts allowed
   └─> No deadline pressure

2. Submit attempt
   └─> Auto-graded immediately

3. View results
   ├─> See correct answers
   ├─> View explanations
   └─> Identify mistakes

4. Retry if needed
   └─> Improve score

5. Best score tracked
   └─> System tracks highest score
```

### Grading Workflow

**Auto-Grading**:
```
1. Student submits QCM/objective questions
2. System compares answers with correct answers
3. Points awarded automatically
4. Status updated to AUTO_GRADED
```

**Manual Grading**:
```
1. Teacher accesses submissions list
   └─> Filter by status (AUTO_GRADED, SUBMITTED)

2. Select student submission
   └─> View all answers

3. Review open-ended questions
   ├─> Read student response
   ├─> Refer to rubric/explanation
   └─> Assign points

4. Provide feedback
   └─> Write comments per question

5. Finalize grading
   ├─> Calculate total score
   ├─> Status → MANUALLY_GRADED
   └─> Student notified

6. Rewards calculated
   └─> Based on score and timeliness
```

---

## Gamification System

### Reward Currencies (5 Types)

1. **Points** - Primary currency for all activities
2. **Coins** - Converted from points, used for rewards
3. **Gems** - Premium currency for special achievements
4. **Stars** - Excellence markers for perfect scores
5. **XP (Experience Points)** - For level progression

### Reward Earning Workflow

```
1. Student completes activity
   ├─> Submits homework
   ├─> Completes exercise
   ├─> Achieves perfect score
   └─> Early submission

2. System calculates rewards
   ├─> Base completion points
   ├─> Performance multipliers
   ├─> Time-based bonuses
   └─> Special bonuses

3. RewardTransaction created
   ├─> Record amounts earned
   ├─> Link to homework/exercise
   └─> Store reason

4. StudentWallet updated
   ├─> Add to total_points
   ├─> Convert to coins (ratio)
   ├─> Update weekly/monthly points
   └─> Update XP for level

5. Check for badge requirements
   └─> Award badges if criteria met

6. Update leaderboards
   └─> Recalculate rankings
```

### Reward Calculation Examples

**Homework Completion**:
```
Base completion: 10 points
Perfect score (100%): +20 points
Early submission (>24h): +10 points
High score (≥90%): +10 points
On-time submission: +5 points
Weekend bonus (×1.5): ×1.5 multiplier

Total: (10 + 20 + 10 + 10 + 5) × 1.5 = 82.5 points
Coins: 82.5 × 0.10 = 8 coins
XP: 50 XP
```

**Exercise Completion**:
```
Exercise completion: 5 points per exercise
Difficulty multiplier:
  - Beginner: ×1.0
  - Intermediate: ×1.5
  - Advanced: ×2.0
  - Expert: ×3.0

Intermediate exercise (5 × 1.5): 7.5 points
First attempt perfect: +5 bonus points
Total: 12.5 points + 10 XP
```

### Badge System

**Badge Types**:
1. **Achievement** - One-time accomplishments
2. **Milestone** - Progress markers
3. **Streak** - Consistency rewards
4. **Performance** - Excellence recognition
5. **Participation** - Engagement rewards
6. **Special** - Unique/seasonal badges

**Badge Rarity**:
- **Common** - Easy to earn
- **Rare** - Moderate difficulty
- **Epic** - Challenging
- **Legendary** - Extremely rare

**Badge Awarding Workflow**:
```
1. Student performs action
   └─> Completes homework, achieves streak, etc.

2. System checks badge requirements (JSON)
   Example:
   {
     "type": "perfect_scores",
     "count": 5,
     "subject": "Mathematics"
   }

3. If criteria met:
   ├─> Create StudentBadge
   ├─> Award points/coins reward
   ├─> Create RewardTransaction
   └─> Notify student

4. Badge displayed on profile
   └─> Hidden badges revealed
```

**Badge Examples**:
- **First Steps** (Common): Complete first homework
- **Perfect Streak** (Rare): 5 perfect scores in a row
- **Math Master** (Epic): 100 math exercises completed
- **Legend** (Legendary): Top of leaderboard for semester

### Leaderboard System

**Leaderboard Types**:
- **Weekly** - Resets every Monday
- **Monthly** - Resets on 1st of month
- **Semester** - Per academic semester
- **Yearly** - Entire academic year

**Leaderboard Scopes**:
- **School** - All students
- **Grade** - Students in same grade
- **Class** - Students in same class
- **Subject** - Students in specific subject

**Ranking Workflow**:
```
1. Create leaderboard
   ├─> Type: Weekly
   ├─> Scope: Grade (1st Bac)
   ├─> Period: Week 1-7 Dec 2024
   └─> Max participants: 50

2. Students earn points
   └─> Tracked in StudentWallet

3. System creates LeaderboardEntry
   ├─> Student reference
   ├─> Total points
   ├─> Calculate rank
   └─> Track rank change

4. Daily/real-time updates
   ├─> Recalculate rankings
   ├─> Update current_rank
   ├─> Calculate rank_change
   └─> Store previous_rank

5. Period ends
   ├─> Snapshot taken (WeeklyLeaderboardSnapshot)
   ├─> Top performers recorded
   └─> New period begins
```

**Ranking Display**:
```
#1  Ahmed Ali        1,250 pts  (↑2)
#2  Fatima Hassan    1,180 pts  (↓1)
#3  Omar Mohamed     1,150 pts  (→)
...
#10 Sara Ahmed         890 pts  (↑5)
```

### Level System

**Level Progression**:
```
XP Required:
Level 1: 0-99 XP       (مبتدئ - Débutant)
Level 2: 100-499 XP    (متقدم - Avancé)
Level 3: 500-999 XP    (خبير - Expert)
Level 4: 1000-1999 XP  (بطل - Champion)
Level 5: 2000+ XP      (أسطورة - Légende)
```

### Streak Tracking

**Workflow**:
```
1. Student completes activity today
   └─> Check last_activity date

2. Calculate streak
   ├─> If yesterday: current_streak + 1
   ├─> If today already: no change
   └─> If gap > 1 day: current_streak = 1

3. Update longest_streak
   └─> If current_streak > longest_streak

4. Award streak badges
   └─> 7-day, 30-day, 100-day streaks
```

---

## Attendance Management

### Timetable Creation

```
1. Admin/Teacher creates timetable
   ├─> Select class
   ├─> Select academic year
   └─> Mark as active

2. Add timetable sessions
   For each session:
   ├─> Day of week (1-6)
   ├─> Start time (e.g., 08:00)
   ├─> End time (e.g., 08:55)
   ├─> Subject
   ├─> Teacher
   ├─> Room (optional)
   └─> Session order (1st, 2nd, etc.)

3. Validate:
   ├─> No teacher conflicts
   ├─> No room conflicts
   └─> Logical time ranges

4. Activate timetable
   └─> Ready for attendance tracking
```

**Example Timetable**:
```
Monday:
  08:00-08:55  Period 1  Mathematics    Mr. Ahmed    Room B101
  09:00-09:55  Period 2  Physics        Ms. Fatima   Lab 201
  10:00-10:55  Period 3  Arabic         Mr. Hassan   Room B102
  ...
```

### Attendance Taking Workflow

**Step 1: Start Attendance Session**
```
1. System auto-creates AttendanceSession
   └─> Based on timetable for today

2. Teacher opens session
   ├─> Views student list
   └─> Status: NOT_STARTED → IN_PROGRESS

3. System creates AttendanceRecord for each student
   └─> Default status: PRESENT
```

**Step 2: Mark Attendance**
```
1. Teacher marks each student:
   ├─> Present (default)
   ├─> Absent
   ├─> Late (+ arrival time)
   └─> Excused

2. Bulk operations available:
   ├─> Mark all present
   ├─> Mark selected absent
   └─> Mark selected late

3. Add notes if needed
   └─> Per-student notes
```

**Step 3: Complete Session**
```
1. Teacher completes session
   └─> Status: IN_PROGRESS → COMPLETED

2. System creates absence flags
   └─> For students marked ABSENT

3. Parent notifications sent
   ├─> SMS (optional)
   ├─> Email
   └─> In-app notification
```

### Absence Flag System

**Workflow**:
```
1. Student marked absent
   └─> StudentAbsenceFlag created

2. Flag status: PENDING
   └─> Requires clearance

3. Parent receives notification
   ├─> "Your child was absent from Math class"
   └─> "Please provide justification"

4. Parent/Staff clears flag:
   ├─> Select reason (medical, family, etc.)
   ├─> Upload document (medical certificate)
   └─> Add notes

5. Flag cleared
   ├─> is_cleared = True
   ├─> Attendance record → EXCUSED
   └─> Parent notified of clearance
```

**Clearance Reasons**:
- Medical Certificate
- Family Emergency
- Parent Permission
- School Activity
- Other

### Parent Notifications

**Notification Types**:
1. **Absence Alert** - Real-time when marked absent
2. **Late Alert** - When student arrives late
3. **Flag Created** - Absence needs clearance
4. **Flag Cleared** - Absence cleared
5. **Chronic Absence** - Pattern detected (e.g., 5+ absences)

**Notification Workflow**:
```
1. Trigger event occurs
   └─> Student marked absent

2. Find parent relations
   └─> StudentParentRelation (active, notify_absence=True)

3. Create AttendanceNotification
   ├─> recipient = parent
   ├─> notification_type = 'absence'
   ├─> message = "Ahmed was absent from Math class on Dec 25, 2024"
   └─> delivery_method = 'sms', 'email', 'in_app'

4. Send notification
   ├─> Via SMS provider
   ├─> Via email service
   └─> In-app notification

5. Track delivery
   └─> delivery_status: pending → sent → delivered

6. Parent reads notification
   └─> is_read = True, read_at = timestamp
```

### Attendance Reports

**Available Reports**:

1. **Daily Report**
   - Total students
   - Present/Absent/Late/Excused counts
   - Percentage breakdown
   - Per-class summaries

2. **Weekly Summary**
   - Attendance trends
   - Most absent students
   - Most absent days
   - Clearance statistics

3. **Monthly Analysis**
   - Monthly attendance rate
   - Student attendance patterns
   - Chronic absence detection
   - Parent engagement metrics

4. **Student History**
   - Individual student record
   - All attendance events
   - Flag clearance history
   - Absence reasons breakdown

---

## Virtual Laboratory

### Lab Tool Structure

**Categories**:
- Mathematics (Function grapher, geometry tools)
- Physics (Simulation tools, unit converters)
- Chemistry (Periodic table, equation balancer)
- Biology (Anatomy models, cell structures)
- Economics (Calculators, chart tools)
- Languages (Grammar checkers, conjugators)

### Using Lab Tools

**Student Workflow**:
```
1. Student accesses lab tool
   ├─> Browse by category
   ├─> Search by name
   └─> Filter by grade level

2. Open tool
   ├─> LabUsage session created
   ├─> Timer starts
   └─> Load tool interface

3. Use tool features
   ├─> Interact with tool
   ├─> Perform calculations/simulations
   └─> Interaction data tracked (JSON)

4. Close/Exit tool
   ├─> Duration calculated
   ├─> LabUsage updated
   └─> Analytics recorded

5. Statistics updated
   ├─> Tool total_uses incremented
   └─> Daily analytics created/updated
```

**3D Model Viewer** (Anatomy):
```
1. Load 3D model (Three.js)
   └─> GLB/GLTF format

2. Interactive features:
   ├─> Rotate/zoom/pan
   ├─> Toggle layers
   ├─> Highlight parts
   └─> View labels

3. Educational mode:
   └─> Show/hide part names
   └─> Quiz mode: identify parts
```

### Lab Assignments

**Teacher Workflow**:
```
1. Create lab assignment
   ├─> Select tool
   ├─> Define task
   ├─> Set target class
   └─> Configure grading

2. Specify task details (JSON)
   Example for Function Grapher:
   {
     "functions_to_plot": ["x^2", "sin(x)", "cos(x)"],
     "range": {"x": [-10, 10], "y": [-10, 10]},
     "requirements": "Plot all functions and identify intersections"
   }

3. Set submission requirements
   ├─> Screenshot
   ├─> File upload
   ├─> Text response
   └─> Automatic tracking

4. Publish assignment
   └─> Students receive notification
```

**Student Workflow**:
```
1. View lab assignment
   └─> Read instructions and task details

2. Access required tool
   ├─> Open from assignment
   └─> LabUsage linked to assignment

3. Complete task
   └─> Follow instructions

4. Submit work
   ├─> Upload screenshot
   ├─> Add text explanation
   └─> Submit file if required

5. Teacher grades
   └─> Review submission
   └─> Provide feedback
   └─> Assign score
```

### Lab Activities (Templates)

**Teacher Creates Activity**:
```
1. Select tool
2. Configure activity settings (JSON)
3. Set grade levels
4. Mark as template/public
5. Save activity

Other teachers can:
└─> Use template
└─> Customize for their class
└─> Create assignments from template
```

### Lab Analytics

**Daily Analytics**:
- Total sessions
- Unique users
- Average duration
- User breakdown (students/teachers)
- Device breakdown (desktop/tablet/mobile)

**Tool Performance**:
- Most used tools
- Peak usage times
- User engagement metrics
- Average session duration

---

## Progress Tracking

### Lesson Progress

**Tracked Metrics**:
```
LessonProgress per student:
├─> completion_percentage (0-100%)
├─> time_spent_minutes
├─> exercises_completed
├─> average_score
├─> last_accessed
└─> is_completed
```

**Calculation**:
```
Completion based on:
1. Resources viewed (weight: 30%)
2. Exercises completed (weight: 50%)
3. Time spent (weight: 20%)

Example:
- Viewed 8/10 resources: 80% × 30% = 24%
- Completed 4/5 exercises: 80% × 50% = 40%
- Spent 45/60 min: 75% × 20% = 15%
Total: 79% completion
```

### Exercise Progress

**Tracked Metrics**:
```
ExerciseSubmission:
├─> attempt_number
├─> score
├─> is_best_attempt
├─> improvement_percentage
└─> time_spent_seconds
```

**Best Score Tracking**:
```
Student attempts exercise 3 times:
Attempt 1: 60%
Attempt 2: 75% ← improvement: +15%
Attempt 3: 85% ← improvement: +10%, marked as best

System tracks:
└─> Best attempt flagged
└─> Shows improvement trend
```

### Homework Analytics

**For Teachers**:
```
Homework analytics:
├─> submission_rate (submitted/total students)
├─> average_score
├─> score_distribution (histogram)
├─> completion_time_average
├─> on_time_submissions
├─> late_submissions
└─> questions_performance (per question)
```

**Question-Level Analytics**:
```
For each question:
├─> correct_answers_count
├─> incorrect_answers_count
├─> average_points_earned
└─> most_common_wrong_answers

Teacher uses this to:
└─> Identify difficult concepts
└─> Plan remedial lessons
└─> Adjust future questions
```

### Student Dashboard

**Progress Overview**:
```
Dashboard displays:
├─> Current level and XP
├─> Total points/coins/gems/stars
├─> Current streak
├─> Completed assignments (this week)
├─> Pending homework
├─> Recent badges earned
├─> Leaderboard position
└─> Subject-wise progress
```

**Subject Progress**:
```
For each subject:
├─> Lessons completed (X/Y)
├─> Average score
├─> Exercises completed
├─> Time spent
└─> Next lesson to study
```

### Teacher Dashboard

**Class Overview**:
```
Dashboard displays:
├─> Active classes
├─> Pending submissions to grade
├─> Recent student activity
├─> Attendance summary
├─> Upcoming deadlines
└─> Class performance metrics
```

**Analytics**:
```
Per class:
├─> Average homework scores
├─> Submission rates
├─> Attendance rates
├─> Top performers
├─> Students needing attention
└─> Subject-wise breakdown
```

### Parent Dashboard

**Child Progress**:
```
Dashboard displays:
├─> Recent grades
├─> Attendance record
├─> Upcoming assignments
├─> Recent notifications
├─> Performance trends
└─> Teacher feedback
```

---

## Moroccan Education System Features

### Dual Cycle System

**First Cycle** (الدورة الأولى):
- September - January
- Mid-year evaluations

**Second Cycle** (الدورة الثانية):
- February - June
- Final evaluations

**Lesson Organization**:
```
Subject: Mathematics
Grade: 1st Bac
├─> First Cycle
│   ├─> Lesson 1: Functions (order: 1)
│   ├─> Lesson 2: Derivatives (order: 2)
│   └─> Lesson 3: Integrals (order: 3)
└─> Second Cycle
    ├─> Lesson 1: Sequences (order: 1)
    ├─> Lesson 2: Series (order: 2)
    └─> Lesson 3: Differential Equations (order: 3)
```

### Track System (مسالك)

**Common Tracks**:
- **Sciences Mathématiques A** (SMA)
- **Sciences Mathématiques B** (SMB)
- **Sciences Physiques** (SP)
- **Sciences de la Vie et de la Terre** (SVT)
- **Lettres** (Literature)
- **Sciences Économiques** (Economics)

**Track-Specific Content**:
```
Lesson: Advanced Calculus
├─> Tracks: SMA, SMB
└─> Not visible to: SP, SVT students

Lesson: Organic Chemistry
├─> Tracks: SP, SVT
└─> Not visible to: SMA, SMB students
```

---

**Last Updated**: December 2025
