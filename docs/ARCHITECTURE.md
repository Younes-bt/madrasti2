# System Architecture

## Overview

Madrasti 2.0 follows a modern **full-stack architecture** with clear separation between backend API and frontend application. The system is designed to be scalable, maintainable, and optimized for the Moroccan educational context.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │    Mobile    │  │   Desktop    │      │
│  │  (React App) │  │ (React Native)│  │   (Future)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway / CDN                         │
│              (Cloudinary for Media Assets)                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend API Layer                          │
│                 Django REST Framework                        │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Authentication (JWT) │ Authorization (RBAC)       │    │
│  └────────────────────────────────────────────────────┘    │
│  ┌─────────┬─────────┬─────────┬─────────┬──────────┐     │
│  │  Users  │ Schools │ Lessons │Homework │Attendance│ ... │
│  │   API   │   API   │   API   │   API   │   API    │     │
│  └─────────┴─────────┴─────────┴─────────┴──────────┘     │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Business Logic Layer                       │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Django Apps (11 modules)                          │    │
│  │  - Custom Business Logic                           │    │
│  │  - Validation & Processing                         │    │
│  │  - Signal Handlers                                 │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                               │
│  ┌──────────────┐    ┌──────────────┐    ┌────────────┐   │
│  │  PostgreSQL  │    │  Cloudinary  │    │   Redis    │   │
│  │  (Primary DB)│    │ (Media Files)│    │  (Cache)   │   │
│  └──────────────┘    └──────────────┘    └────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  External Services                           │
│  ┌──────────────┐    ┌──────────────┐                      │
│  │  Google AI   │    │    SMS/Email │                      │
│  │  (Gemini)    │    │   Providers  │                      │
│  └──────────────┘    └──────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

## Backend Architecture

### Django Application Structure

The backend consists of **11 Django apps**, each handling a specific domain:

#### 1. **Users App** (`backend/users/`)
- **Purpose**: Authentication and user management
- **Key Models**: User, Profile, StudentEnrollment, BulkImportJob
- **Features**:
  - Custom user model with email authentication
  - Role-based access control (6 roles)
  - Parent-child relationships
  - Multilingual profiles
  - Bulk import capability

#### 2. **Schools App** (`backend/schools/`)
- **Purpose**: School organizational structure
- **Key Models**: School, AcademicYear, EducationalLevel, Grade, Track, SchoolClass, Subject, Room, Vehicle
- **Features**:
  - Complete Moroccan education hierarchy
  - Infrastructure management
  - Vehicle fleet tracking
  - Singleton school configuration

#### 3. **Lessons App** (`backend/lessons/`)
- **Purpose**: Educational content management
- **Key Models**: Lesson, LessonResource, SubjectCategory, LessonTag, LessonAvailability
- **Features**:
  - Notion-style block editor
  - Moroccan cycle support (first/second cycle)
  - Class-specific publishing
  - Version control for content
  - Multiple resource types

#### 4. **Homework App** (`backend/homework/`)
- **Purpose**: Assignments and gamification
- **Key Models**:
  - **Assignments**: Homework, Exercise, Question (8 types)
  - **Submissions**: Submission, ExerciseSubmission, QuestionAnswer
  - **Gamification**: StudentWallet, Badge, Leaderboard, RewardTransaction
  - **Progress**: LessonProgress
- **Features**:
  - 8 question types with auto-grading
  - 5 reward currencies
  - Badge system with automatic awarding
  - Multi-scope leaderboards
  - Textbook exercise integration

#### 5. **Attendance App** (`backend/attendance/`)
- **Purpose**: Attendance tracking and notifications
- **Key Models**: SchoolTimetable, TimetableSession, AttendanceSession, AttendanceRecord, StudentAbsenceFlag, AttendanceNotification
- **Features**:
  - Smart timetable management
  - Bulk attendance marking
  - Absence flag system
  - Parent notifications
  - Pattern detection

#### 6. **Lab App** (`backend/lab/`)
- **Purpose**: Virtual laboratory tools
- **Key Models**: LabTool, LabToolCategory, LabUsage, LabAssignment, LabActivity, LabToolAnalytics
- **Features**:
  - Subject-specific tools
  - Usage tracking
  - Assignment integration
  - Analytics and reporting

#### 7. **Activity Log App** (`backend/activity_log/`)
- **Purpose**: System audit trail
- **Key Models**: ActivityLog
- **Features**:
  - Complete action logging
  - IP and user agent tracking
  - Searchable metadata

#### 8-10. **Communication, Finance, Reports** (In Development)
- Messaging system
- Fee management
- Analytics and reporting

### API Architecture

**Framework**: Django REST Framework 3.16.1

**Key Features**:
- RESTful API design
- Nested routing with drf-nested-routers
- JWT token authentication
- Role-based permissions
- Pagination and filtering
- Serializer validation

**API Base URL**: `/api/`

**Authentication**:
```
POST /api/token/              # Obtain JWT token pair
POST /api/token/refresh/      # Refresh access token
POST /api/token/verify/       # Verify token validity
```

### Database Design

**Development**: SQLite3
**Production**: PostgreSQL

**Design Principles**:
- Normalized schema with strategic denormalization
- Foreign key constraints
- Database-level uniqueness constraints
- Indexing on frequently queried fields
- JSON fields for flexible data structures
- Soft deletes where appropriate

**Total Models**: 80+ models across all apps

### Authentication & Authorization

**Authentication Method**: JWT (JSON Web Tokens)
- Access token expiry: 60 minutes
- Refresh token expiry: 7 days
- Token rotation on refresh

**Authorization Model**: Role-Based Access Control (RBAC)
- 6 User Roles: ADMIN, TEACHER, STUDENT, PARENT, STAFF, DRIVER
- Custom permission classes
- Object-level permissions
- Field-level access control

**Permission Hierarchy**:
```
ADMIN (Full Access)
  ├── TEACHER (Class & Subject Management)
  ├── STAFF (Administrative Tasks)
  ├── DRIVER (Vehicle Management)
  ├── PARENT (Children's Data)
  └── STUDENT (Own Data Only)
```

### File Storage

**Provider**: Cloudinary

**Storage Strategy**:
- Profile pictures → `profiles/`
- Lesson resources → `lesson_resources/`
- Textbook covers → `textbooks/`
- Badge images → `badges/`
- Attendance documents → `absence_documents/`
- Lab submissions → `lab_assignments/`

**Benefits**:
- Automatic image optimization
- CDN delivery
- Transformation on-the-fly
- Video/audio streaming
- Responsive images

## Frontend Architecture

### Technology Stack

**Core**:
- React 19.1.1
- Vite 7.1.2
- React Router DOM 7.8.2

**State Management**:
- TanStack Query (server state)
- React Context API (global state)
- Local component state

**UI & Styling**:
- TailwindCSS 3.4.17
- shadcn/ui components
- Radix UI primitives
- Lucide React icons
- Framer Motion (animations)

**Special Libraries**:
- Three.js + React Three Fiber (3D graphics)
- React Markdown (content rendering)
- KaTeX (math rendering)
- Recharts (data visualization)
- i18next (internationalization)

### Component Architecture

```
src/
├── components/
│   ├── ui/                  # shadcn/ui primitives (buttons, inputs, etc.)
│   ├── layout/              # Layout components (AppSidebar, AppNavbar, Layout)
│   ├── blocks/              # Notion-style content blocks
│   ├── editor/              # Content editors
│   ├── lesson/              # Lesson viewing components
│   ├── homework/            # Assignment components
│   ├── exercise/            # Exercise components
│   ├── attendance/          # Attendance UI
│   ├── lab/                 # Virtual lab tools
│   ├── gamification/        # Rewards, badges, leaderboards
│   └── shared/              # Shared utilities
├── pages/
│   ├── admin/               # Admin pages (40+ pages)
│   ├── teacher/             # Teacher pages (30+ pages)
│   ├── student/             # Student pages (20+ pages)
│   ├── parent/              # Parent pages
│   └── auth/                # Authentication pages
├── services/                # API service layer
├── contexts/                # React contexts
├── hooks/                   # Custom hooks
└── locales/                 # i18n translations
```

### Routing Architecture

**Total Routes**: 100+ routes

**Route Protection**:
```javascript
// Protected routes require authentication
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

// Role-based routing
<AdminRoute>      // Only accessible to admins
<TeacherRoute>    // Only accessible to teachers
<StudentRoute>    // Only accessible to students
```

**Dynamic Routing**:
- `/lessons/:lessonId` - Lesson detail
- `/homework/:homeworkId` - Assignment detail
- `/students/:studentId` - Student profile
- `/classes/:classId` - Class detail

### State Management Strategy

**Server State** (TanStack Query):
- API data fetching
- Caching and synchronization
- Optimistic updates
- Background refetching

```javascript
const { data, isLoading } = useQuery({
  queryKey: ['lessons', lessonId],
  queryFn: () => lessonsService.getLesson(lessonId),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

**Global State** (Context API):
- Authentication state
- User preferences
- Theme settings
- Language selection

**Local State**:
- Form inputs
- UI toggles
- Component-specific data

### Internationalization

**Languages Supported**: Arabic (ar), French (fr), English (en)

**Implementation**: i18next

**Features**:
- Dynamic language switching
- RTL support for Arabic
- Fallback to English
- Namespace-based organization
- Lazy loading translations

**Translation Files**:
- `locales/ar/ar.json` - Arabic translations
- `locales/fr/fr.json` - French translations
- `locales/en/en.json` - English translations

### Performance Optimizations

1. **Code Splitting**: Dynamic imports for routes
2. **Lazy Loading**: Components loaded on-demand
3. **Memoization**: React.memo for expensive components
4. **Virtual Scrolling**: For long lists
5. **Image Optimization**: Cloudinary transformations
6. **Caching**: TanStack Query with stale-while-revalidate
7. **Bundle Optimization**: Vite's built-in optimization

## Security Architecture

### Backend Security

1. **Authentication**:
   - JWT tokens with short expiry
   - Refresh token rotation
   - Password hashing (Django's PBKDF2)

2. **Authorization**:
   - Role-based access control
   - Object-level permissions
   - Field-level restrictions

3. **API Security**:
   - CORS configuration
   - CSRF protection
   - Rate limiting (planned)
   - SQL injection prevention (Django ORM)
   - XSS prevention (DRF sanitization)

4. **Data Security**:
   - Encrypted passwords
   - Sensitive data encryption (planned)
   - Secure file uploads
   - Input validation

### Frontend Security

1. **XSS Prevention**:
   - React's built-in escaping
   - DOMPurify for user HTML (planned)
   - Sanitized markdown rendering

2. **Authentication**:
   - Secure token storage (httpOnly cookies planned)
   - Automatic token refresh
   - Secure logout

3. **HTTPS**:
   - Enforced in production
   - Secure cookie flags

## Deployment Architecture

### Development Environment

```
Backend:  http://localhost:8000
Frontend: http://localhost:5173
Database: SQLite (local file)
Media:    Cloudinary (dev account)
```

### Production Environment (Planned)

```
┌─────────────────────────────────────┐
│         Load Balancer / CDN         │
│         (Cloudflare / Nginx)        │
└─────────────────────────────────────┘
          │                  │
          ▼                  ▼
┌──────────────────┐  ┌──────────────────┐
│   Frontend       │  │   Backend API    │
│   (Vercel/       │  │   (Django on     │
│    Netlify)      │  │    EC2/Heroku)   │
└──────────────────┘  └──────────────────┘
                              │
                              ▼
                   ┌──────────────────┐
                   │   PostgreSQL     │
                   │   (RDS/Managed)  │
                   └──────────────────┘
```

**Recommended Stack**:
- **Frontend**: Vercel or Netlify
- **Backend**: AWS EC2, Heroku, or DigitalOcean
- **Database**: AWS RDS PostgreSQL or Managed PostgreSQL
- **Media**: Cloudinary (already integrated)
- **Cache**: Redis (for sessions and caching)
- **Monitoring**: Sentry for error tracking

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- JWT-based authentication (no server sessions)
- CDN for static assets
- Database read replicas

### Vertical Scaling
- Database indexing
- Query optimization
- Caching strategies
- Asynchronous tasks (Celery planned)

### Data Growth
- Pagination on all list endpoints
- Archiving old academic years
- Media file management
- Database partitioning (future)

## Integration Points

### External Services

1. **Cloudinary**: Media storage and delivery
2. **Google Gemini AI**: Exercise generation
3. **SMS Providers**: Parent notifications (planned)
4. **Email Service**: Notifications (planned)
5. **Payment Gateway**: Fee collection (planned)

### API Integrations

- RESTful API for third-party integrations
- Webhook support (planned)
- OAuth2 for external authentication (planned)

## Development Tools

### Backend
- Django Debug Toolbar (development)
- Django Extensions
- pytest for testing (planned)
- Black for code formatting (planned)

### Frontend
- ESLint for linting
- Prettier for formatting
- Vite DevTools
- React DevTools
- TanStack Query DevTools

## Testing Strategy (Planned)

### Backend
- Unit tests (pytest)
- Integration tests
- API endpoint tests
- Model validation tests

### Frontend
- Component tests (Vitest)
- Integration tests
- E2E tests (Playwright)

## Monitoring & Logging

### Current
- Django logging to console
- Activity log system (custom)
- Basic error tracking

### Planned
- Sentry for error tracking
- Application performance monitoring
- User analytics
- System health dashboards

---

**Last Updated**: December 2025
