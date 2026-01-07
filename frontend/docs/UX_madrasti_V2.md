# Madrasti 2.0 — UX Proposal (Markdown)

> A comprehensive, role-based UX plan for a Moroccan K-12 platform that’s dead simple to navigate, fast to use, and tightly aligned to the existing API. Built for web (React) and mobile (React Native), multilingual (AR/FR/EN/Berber), and designed around the real workflows of schools in Morocco.&#x20;

---

## 0) Product Principles (guide every screen)

* **Role-first navigation.** The interface adapts to **Teacher / Student / Parent / Staff / Admin / Driver** permissions and only shows what each role can do. (RBAC matrix covered in API docs.)&#x20;
* **Two-click rule.** Frequent actions are at most two clicks from the home dashboard (e.g., mark attendance, assign homework, upload submission).
* **Speed matters.** Page loads under 2s, API responses under 300ms, and 10k concurrent users targets guide decisions (skeletons, optimistic UI, background fetch).&#x20;
* **Multilingual by default.** Arabic first, French and English second, Berber available — with mirrored RTL layout where needed.&#x20;
* **Mobile-first.** Core flows are thumb-friendly, with offline cache for schedules, homework drafts, and receipts.&#x20;
* **Trust & compliance.** Granular permissions, audit trails, GDPR/local data privacy, and MASSAR alignment.&#x20;

---

## 1) Information Architecture

### 1.1 Global layout

* **App shell:** top app bar (brand, quick search, notifications, profile), left rail (role-scoped sections), content area, right pane (contextual help/secondary).
* **Primary nav (varies by role):** Dashboard → Classes/Children → Lessons/Homework → Attendance → Grades → Messages → Calendar → Payments (Parent/Admin) → School Admin (Admin/Staff) → Transport (Driver/Parent).&#x20;
* **Command search (⌘/Ctrl+K):** jump to student, class, assignment, timetable session, room.
* **Notifications center:** real-time, grouped and actionable; integrates with WebSocket events (e.g., grading completed, attendance alert).&#x20;

### 1.2 Home dashboards (by role)

* **Teacher:** Today’s sessions, quick “Start Attendance”, pending submissions to grade, upcoming deadlines, recent messages. (Today’s sessions API available.)&#x20;
* **Student:** Next class card, due-soon assignments, grades trend, badges/level, wallet snapshot, schedule. (Homework + wallet + badges + leaderboards APIs.)  &#x20;
* **Parent:** Children switcher, alerts (absence, low grade), homework status, upcoming payments, transport status.&#x20;
* **Staff/Admin:** School KPIs, tasks, announcements, events, quick links to user, room, timetable management. (Rooms & school entities in Schools module.)&#x20;
* **Driver:** Today’s route, student list with pickup/drop actions, incident/late report. (Role exists in RBAC.)&#x20;

---

## 2) Authentication & Session UX

* **Login (email/password)** → JWT acquisition → role-aware redirect to dashboard. Uses `/api/users/login/` with JWT refresh/verify support; auto refresh in front-end. Error states (invalid creds, locked account) explained inline.&#x20;
* **Session management:** silent refresh via `/api/token/refresh/`; retry once on 401; redirect to login with preserved return path.&#x20;
* **Profile & security:** Profile editing (`/api/users/profile/`), change password, and password reset flows with clear confirmation and toast feedback.&#x20;

---

## 3) Core User Journeys (by role)

> Each journey lists the **happy path**, **smart defaults**, **empty/error states**, and **API endpoints** used.

### 3.1 Teacher — “Run my day efficiently”

#### A) Take attendance for a session (in 2 taps)

**Flow**

1. **Dashboard → “Today’s Sessions”** (cards show class, room, time, subject).

   * Data: `GET /api/attendance/timetable-sessions/today_sessions/`.&#x20;
2. Tap **Start Attendance** on the current session → attendance sheet opens prefiltered by class/period.
3. Mark students **Present / Late / Absent** (list with quick toggles + bulk actions: “Mark all present”, then adjust).
4. **Save & Notify**: Save marks; parents of absentees auto-notified (background job).
5. Confirmation toast + option **“Open Class Gradebook”** next.

**UX details**

* **Sticky header** with timer (“class started 07:55”).
* **Keyboard-less marking:** single tap cycles status; long-press adds note.
* **Offline mode:** queue marks; show “Unsynced” chip; auto-sync when online.

**API**

* Sessions source: timetable sessions (above).
* Attendance create/update endpoints (Attendance module; records per session/student).
* Today/weekly schedule helpers: `.../today_sessions/`, `.../weekly_schedule/`.&#x20;

#### B) Assign homework to a class

**Flow**

1. **Classes → \[Class X] → Homework → “New Assignment”**.
2. Fill form (title, description, due date, attachments, type: quiz/file/text).
3. **Assign to**: whole class or selected students; set **points** & **badges** eligibility.
4. **Publish** → students & parents notified; appears in dashboards.

**API**

* Homework module CRUD & submissions; students later submit to `/api/homework/submissions/` and teachers can grade/update.&#x20;

#### C) Grade submissions fast

**Flow**

1. **Homework → \[Assignment] → Submissions tab** → filters (late, ungraded).
2. Open submission → **split view**: student answers left, rubric/marks right.
3. Auto-graded quizzes show score; teacher can override **manual\_score** and add **feedback** → **Save**.
4. Optional: **Reward adjustment** (bonus points/badge) posts a reward transaction.

**API**

* Submissions CRUD + `.../submit/` auto-grading response fields (score, time\_taken, rewards\_earned).&#x20;
* Reward transactions: `POST /api/homework/reward-transactions/`.&#x20;

---

### 3.2 Student — “Know what to do next”

#### A) See what’s next & stay on track

**Flow**

1. **Dashboard**: “Next Class” card, “Due Soon” list, **Wallet** & **Badges** chips, trend sparkline for grades.
2. **Open an assignment** → “Start now” (auto-save every 10s).
3. Submit; see instant score for auto-graded types; badges pop if earned.

**API**

* Submissions endpoints & auto-grading response (score, points, badges).&#x20;
* Wallet snapshot: `GET /api/homework/student-wallets/`.&#x20;
* Badges list: `GET /api/homework/badges/`.&#x20;

**Empty states**

* No assignments → show “Practice a lesson” CTA with recent lessons (Lessons module).&#x20;

#### B) Track progress & compete

* **My Grades**: per subject, per term; drill to assignment feedback.
* **Leaderboards**: weekly/monthly/class/subject with rank change indicators. `GET /api/homework/leaderboards/`.&#x20;

---

### 3.3 Parent — “Stay informed, act quickly”

#### A) Monitor each child

**Flow**

1. **Dashboard** with **child switcher** (chips).
2. For selected child: attendance incidents, grade deltas, homework status, **transport live status** (if enabled).&#x20;
3. Tap **Homework** → list with “Due / Done / Late”; open details.

**API**

* Read-only access to children’s assignments, submissions, attendance, and grades as per RBAC (children-only visibility).&#x20;

#### B) Payments (phase-aligned)

* **Fees** tab: upcoming invoices, history, receipt downloads, and local payment methods (design placeholder until gateway is wired).&#x20;

---

### 3.4 Staff — “Keep the school running”

#### A) Manage rooms & timetables

**Flow**

1. **School Admin → Rooms**: list, availability, capacity; create/edit room (room types localized AR/FR).
2. **Timetables**: by class and academic year; sessions (day/time/subject/teacher/room) CRUD.
3. Publish timetable; teachers & students see schedule instantly.

**API**

* Rooms CRUD: `/api/schools/rooms/…`.&#x20;
* Timetables & sessions: `/api/attendance/timetables/…` and `/api/attendance/timetable-sessions/…`.&#x20;

---

### 3.5 Admin — “Visibility & control”

#### A) User management

* **Users**: create, deactivate, set roles, reset passwords, view last login and activity.
* Follows Users module fields and registration/profile endpoints. &#x20;

#### B) Analytics dashboard

* KPIs: attendance rate, homework completion, grade distributions, active users; export CSV/PDF.
* Aligns to “Advanced Analytics Dashboard” objective. (Data sources from modules; export tool in roadmap.)&#x20;

---

### 3.6 Driver — “Just the route and the roster”

* **Today’s route** with stops; tap each student to mark **Picked up / Dropped**; quick incident note.
* Role scoped by RBAC (Driver role).&#x20;

---

## 4) Screen Blueprints (wireframe-level)

> Not pixel art—just structure you can build with Tailwind + shadcn/ui.

### 4.1 Teacher Dashboard

```
[Top Bar: Search | Notifications | Profile]
[Hero: Today Tue 10:30 — 3 sessions]
-----------------------------------------------------------
| [Session Card]       | [Pending Grading] | [Shortcuts]  |
| Class 3B · Math      | 12 to grade       | + New HW     |
| 11:00–12:00 · Rm 101 |                   | + Attendance |
| [Start Attendance]   | [Open Queue]      | + Message    |
-----------------------------------------------------------
[Due Dates Timeline] [Recent Messages]
```

* Data: today\_sessions, submissions (status=SUBMITTED), timetable. &#x20;

### 4.2 Student Assignment Details

```
[Assignment Title]  [Due in 2d]
[Teacher | Subject | Points | Attempts]
[Instructions + attachments]
[Start / Continue] [Submit]
[Score after submit] [Badges earned]
```

* Submissions auto-save draft; submit calls `.../submit/` and shows returned score/badges.&#x20;

### 4.3 Parent Home

```
[Child Switcher: Amine | Salma]
-----------------------------------------------------------
[Alerts] [Attendance this week] [Grades snapshot] [Transport]
[Homework Due Soon]
[Payments: Next invoice | History]
```

* Visibility restricted to **Children Only** per RBAC.&#x20;

### 4.4 Staff — Timetable Editor

```
[Select Class][Academic Year][Effective dates]
[Weekly Grid]
Mon 08:00  | + Add Session -> Subject, Teacher, Room, Type
...
[Publish] [Save draft]
```

* Uses Timetables + Timetable Sessions endpoints.&#x20;

---

## 5) Content Models & Forms (API-aligned)

* **Lessons**: include title (AR/FR/EN), content (HTML), subject, grade, objectives, difficulty, tags, publish toggle. Keep rich-text minimal and accessible.&#x20;
* **Rooms**: name, building, capacity, type (localized labels for classroom/lab/library/etc.).&#x20;
* **Assignments/Submissions**: clear status chips (Draft/Submitted/Graded), auto-graded indicators, manual override with audit log.&#x20;

---

## 6) Navigation & Wayfinding

* **Left rail groups** (role-scoped):

  * Teaching (Classes, Homework, Attendance, Grades)
  * Learning (Courses, Assignments, Leaderboards)
  * Family (Children, Messages, Payments, Transport)
  * Operations (Users, Rooms, Timetables, Calendar)
* **Breadcrumbs:** appear on entity drilldowns (e.g., Classes › 3B › Homework › Algebra).
* **Quick actions:** floating “+” button contextual to section (New Assignment, New Lesson, New Session).
* **Keyboard & a11y:** tab order verified, ARIA labels for toggles, full RTL mirroring.

---

## 7) States: Empty / Loading / Error

* **Empty** (Teacher Homework): “No assignments yet” with **Create assignment** button.
* **Loading**: skeletons for lists/cards; never spinner-only beyond 300ms.
* **Error**: human messages mapped from API error codes (e.g., `INVALID_CREDENTIALS`) with next action.&#x20;

---

## 8) Notifications & Real-Time

* **Push & in-app**: new grade posted, absence recorded, assignment due soon, badge earned.
* Notification payloads follow module events (e.g., badges leaderboards updates).&#x20;
* **Digest emails/SMS** configurable (daily/weekly) per role. (SMS/Email integration noted in architecture.)&#x20;

---

## 9) Security, Privacy, & Compliance (UX Implications)

* **RBAC UI checks**: hide actions the role can’t perform (e.g., students can’t see others’ grades).&#x20;
* **Audit cues**: show “Last updated by … at …” on sensitive records.
* **Sensitive actions**: confirm dialogs (delete timetable session, override grade), and two-step for bulk changes.
* **Data policies**: short inline policy references; link to full policy; MASSAR compatible exports.&#x20;

---

## 10) Performance & Offline UX

* **Prefetch**: on login, prefetch today’s sessions, due assignments, and child summaries.
* **Cache & queue**: store attendance marks and draft submissions offline, then sync (conflict UI if needed).&#x20;
* **Optimistic UI**: instant toggle for attendance and grade edits, reconcile on response.
* **Metrics surfaced**: mini perf HUD for admins (avg API latency, error rate) aligns with SLA goals.&#x20;

---

## 11) Internationalization & Localization

* **Languages:** Arabic (default), French, English, Berber. Language switcher persists per user.&#x20;
* **RTL mirroring:** navigation flips; icons that imply direction rotate.
* **Localized academic calendar**: Islamic holidays and national events in Calendar.&#x20;

---

## 12) Accessibility

* **WCAG AA:** color contrast, focus visible, keyboard operability.
* **Screen reader labels:** especially for attendance and grading controls.
* **Motion settings:** reduce animation option.
* **Voice input readiness** (later): pairs with “Voice Commands” ambitions.&#x20;

---

## 13) Design System Notes (shadcn + Tailwind)

* **Primitives:** Card, Badge, Tabs, Table, DataList (mobile fallback), Drawer (mobile sheets), Toast.
* **Patterns:**

  * **Entity header** with key actions (e.g., Assignment header: Publish, Grade, Edit).
  * **Inspector drawer** for quick edits (room change, due date bump).
  * **Multi-select toolbars** for bulk operations in lists.
* **Icons:** Lucide; keep labels visible for critical actions.
* **Charts:** tiny and legible (recharts), with textual alternatives.

---

## 14) Implementation Map (API ↔ UI)

| UX Area    | Primary Endpoints                                                | Notes                                   |
| ---------- | ---------------------------------------------------------------- | --------------------------------------- |
| Auth       | `/api/users/login/`, `/api/token/refresh/`, `/api/token/verify/` | JWT; silent refresh; 401 guard.         |
| Profiles   | `/api/users/profile/`                                            | View/edit; show last\_login & picture.  |
| RBAC       | Role matrix in docs                                              | Feature gating & conditional UI.        |
| Lessons    | Lessons module fields                                            | Rich text + publish flag.               |
| Homework   | Submissions CRUD + `.../submit/`                                 | Auto-grade & rewards UI.                |
| Rewards    | Wallets, Reward transactions, Badges, Leaderboards               | Surface points, badges, rankings.       |
| Attendance | Timetables & Sessions (+ today/weekly)                           | Teacher “Start Attendance” flow.        |
| Rooms      | `/api/schools/rooms/…`                                           | Staff/Admin room management.            |
| School Ops | Users/Schools modules                                            | Admin dashboards & exports.             |

---

## 15) Copy & Micro-interactions (tone)

* **Plain, encouraging language**: “Nice! You’re on time — keep it up.”
* **Contextual hints**: “Grading this will auto-notify the student and parent.”
* **Avoid jargon** for parents; use school vocabulary for staff (“timetable session”, not “period” if local copy prefers).
* **Toasts** for quick success; **banners** for persistent warnings; **dialogs** for destructive actions.

---

## 16) Analytics & Success Metrics (in-product surfacing)

* **Teacher efficiency**: avg time to take attendance; submissions graded per week.
* **Student outcomes**: homework completion rate; grade improvement trend.
* **Parent engagement**: views of reports; responses to alerts.
* Mirrors the program success metrics defined in the plan.&#x20;

---

## 17) Phasing & Risks (UX scope aligned to roadmap)

* **Phase 1 (Months 1–3)**: Auth, core users, basic courses/homework, simple attendance — deliver Teacher/Student MVP flows shown above.&#x20;
* **Phase 2 (4–6)**: Robust teacher tools, parent portal, payments UI, school calendar.&#x20;
* **Phase 3 (7–9)**: AI recommenders, advanced messaging, forums, full mobile parity, offline polish.&#x20;
* **Phase 4 (10–12)**: Analytics, custom reports, MASSAR export, quality hardening.&#x20;

---

## 18) Test Scenarios (what we’ll validate)

* **Teacher**: can start attendance within 5 seconds from dashboard; can grade 10 submissions in under 3 minutes with keyboard-only.
* **Student**: can find & submit any assignment in ≤2 taps from dashboard; sees immediate score for auto-graded types.&#x20;
* **Parent**: can switch children and find a missing-homework alert in ≤2 taps; can download last month’s receipt.&#x20;
* **Staff**: can add a session to a timetable in ≤30s; can resolve room conflicts quickly.&#x20;

---

## 19) Open Questions / Assumptions

* **Payments**: placeholder UI until gateway and fee schemas are finalized (local banks/mobile money planned).&#x20;
* **Transport**: driver mobile flows depend on route & GPS endpoints (to be defined); RBAC already accounts for `DRIVER`.&#x20;
* **MASSAR**: export formats and validation rules to be clarified during Phase 4.&#x20;

---

## 20) Summary

This UX plan turns Madrasti 2.0 into a **role-aware, two-click** platform: teachers run the day fast, students always know what’s next, parents stay in the loop, staff keep operations smooth, and admins see the full picture — all mapped tightly to the current API surface (auth, users, lessons, homework, rewards, attendance, rooms) and the Moroccan education context.     &#x20;

---

