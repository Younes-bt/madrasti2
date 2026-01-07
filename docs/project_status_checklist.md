# Madrasti2 Project Verification Checklist

Use this document to audit the current state of your project. Mark items as you verify them to get a clear picture of what is **Done**, **In Progress**, or **Not Started**.

## 📊 Status Legend
- [x] **Done**: Feature is fully implemented, connected to the backend, and working.
- [/] **In Progress**: UI exists but API is failing, or logic is incomplete.
- [ ] **Not Started**: Feature is missing or only planned.

---

## 1. 🔐 Core System & Authentication
**Goal**: Verify secure access and role-based routing.

- [ ] **Login Flow**
    - [ ] User can login with Email/Password.
    - [ ] System correctly redirects to the specific dashboard based on role (`/admin`, `/teacher`, `/student`, etc.).
    - [ ] "Remember Me" functionality works.
- [ ] **Token Management**
    - [ ] Access tokens are stored securely.
    - [ ] Token refresh happens automatically (or user is redirected to login on expiry).
- [ ] **Profile Management**
    - [ ] User can view their own profile.
    - [ ] User can update basic info (Phone, Address).
    - [ ] User can change their password.
- [ ] **Localization**
    - [ ] Language switcher works (English <-> French <-> Arabic).
    - [ ] UI text updates immediately upon switch.
    - [ ] RTL layout applies correctly for Arabic.

---

## 2. 🏫 School Administration (Admin Dashboard)
**Goal**: Verify the setup of the school structure.

### Configuration
- [ ] **School Details**: Can view/edit school info (Name, Logo, Contact).
- [ ] **Academic Years**:
    - [ ] Can create a new year (e.g., "2025-2026").
    - [ ] Can mark a year as "Current".
    - [ ] System prevents multiple "Current" years.

### Academic Structure
- [ ] **Educational Levels**: Can CRUD levels (Preschool, Primary, etc.).
- [ ] **Grades**: Can CRUD grades and link them to Levels.
- [ ] **Tracks**: Can define tracks (e.g., "Science", "Arts") for relevant grades.
- [ ] **Subjects**: Can create subjects and assign them to Grades (defining coefficients/hours).
- [ ] **Classes**:
    - [ ] Can create a class (e.g., "2nd Grade - A").
    - [ ] Can assign a Main Teacher to the class.

### User Management
- [ ] **Staff**: Create/Edit/Delete administrative staff accounts.
- [ ] **Teachers**: Create accounts, assign to Subjects/Departments.
- [ ] **Students**:
    - [ ] Create student account.
    - [ ] **Enrollment**: Assign student to a specific Class for the current Year.
    - [ ] **Bulk Import**: Test uploading a CSV of students.
- [ ] **Parents**: Create accounts and link them to one or multiple Students.

---

## 3. 🚌 Fleet & Infrastructure Management
**Goal**: Verify logistics and asset tracking.

### Infrastructure
- [ ] **Rooms**: Create rooms with types (Classroom, Lab, Gym) and capacity.
- [ ] **Equipment**: Add equipment items and assign them to specific Rooms.

### Fleet (Vehicles)
- [ ] **Vehicle Registry**: Add a new vehicle (Bus, Van) with plate number and driver.
- [ ] **Maintenance**:
    - [ ] Add a maintenance record (Service date, Cost, Type).
    - [ ] Upload an attachment (invoice/photo) for the record.
- [ ] **Fuel/Gasoil**:
    - [ ] Add a refueling record (Liters, Cost, Station).
    - [ ] Verify calculations (if any).

---

## 4. 📚 Academic LMS (Teacher & Student)
**Goal**: Verify the teaching and learning loop. **(Critical Area)**

### Teacher Portal
- [ ] **My Classes**: Teacher can see the list of classes they teach.
- [ ] **Lessons**:
    - [ ] Create a new Lesson for a specific Class/Subject.
    - [ ] Upload lesson materials (PDFs, Images).
    - [ ] Publish the lesson.
- [ ] **Homework**:
    - [ ] Create a Homework assignment with a due date.
    - [ ] View list of student submissions.
    - [ ] Grade a submission and provide feedback.
- [ ] **Attendance**:
    - [ ] Mark attendance for a specific class session (Present/Absent/Late).
    - [ ] Save and update attendance records.

### Student Portal
- [ ] **Dashboard**: View upcoming homework and recent lessons.
- [ ] **My Lessons**: Access lessons uploaded by the teacher.
- [ ] **Homework**:
    - [ ] View pending homework.
    - [ ] Submit homework (Text entry or File upload).
    - [ ] View grades and feedback after teacher review.
- [ ] **Timetable**: View weekly class schedule.

---

## 5. 👨‍👩‍👧 Parent Portal
**Goal**: Verify parental oversight features.

- [ ] **Children View**: See list of linked children.
- [ ] **Progress Monitoring**:
    - [ ] View child's attendance history.
    - [ ] View child's grades/homework status.
- [ ] **Communication**: (If implemented) Send message to school/teacher.

---

## 6. 🛠 System & Technical
**Goal**: Verify robustness and performance.

- [ ] **Media Uploads**:
    - [ ] Verify images load correctly from Cloudinary.
    - [ ] Verify secure file downloads (homework attachments).
- [ ] **Real-time**:
    - [ ] Test if notifications appear without refreshing the page (e.g., when homework is graded).
- [ ] **Error Handling**:
    - [ ] Check 404 pages.
    - [ ] Check behavior when API is down (Graceful error messages?).
