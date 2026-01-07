# Frontend Architecture & Components

This document provides detailed information about the frontend architecture, components, and implementation details.

## Technology Stack

### Core Framework
- **React 19.1.1** - UI library
- **Vite 7.1.2** - Build tool and dev server
- **React Router DOM 7.8.2** - Client-side routing

### State Management
- **TanStack Query 5.85.6** - Server state management
- **React Context API** - Global client state
- **Local State** - Component-specific state

### UI & Styling
- **TailwindCSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - Reusable component library
- **Radix UI** - Unstyled, accessible primitives
- **Lucide React 0.542.0** - Icon library
- **Framer Motion 12.23.12** - Animation library

### Data Visualization & 3D
- **Recharts 3.6.0** - Chart library
- **Three.js 0.182.0** - 3D graphics
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Helpers for React Three Fiber

### Content Rendering
- **React Markdown 10.1.0** - Markdown renderer
- **KaTeX 0.16.27** - Math rendering
- **React Syntax Highlighter** - Code highlighting

### Utilities
- **Axios 1.11.0** - HTTP client
- **i18next 25.4.2** - Internationalization
- **React Hot Toast 2.6.0** - Toast notifications
- **html2canvas** - Screenshot functionality
- **jsPDF** - PDF generation

---

## Project Structure

```
frontend/
├── public/
│   ├── models/              # 3D model files (GLB/GLTF)
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui primitives
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── input.jsx
│   │   │   └── ... (30+ components)
│   │   ├── layout/
│   │   │   ├── Layout.jsx          # Main layout wrapper
│   │   │   ├── AppSidebar.jsx      # Sidebar navigation
│   │   │   └── AppNavbar.jsx       # Top navbar
│   │   ├── blocks/          # Notion-style blocks
│   │   │   ├── BlockRenderer.jsx
│   │   │   ├── ParagraphBlock.jsx
│   │   │   ├── HeadingBlock.jsx
│   │   │   └── ... (10+ block types)
│   │   ├── editor/          # Content editors
│   │   │   ├── BlockEditor.jsx
│   │   │   └── MarkdownEditor.jsx
│   │   ├── lesson/          # Lesson components
│   │   ├── homework/        # Homework components
│   │   ├── exercise/        # Exercise components
│   │   ├── attendance/      # Attendance components
│   │   ├── lab/             # Virtual lab components
│   │   ├── gamification/    # Rewards/badges/leaderboards
│   │   ├── analytics/       # Charts and analytics
│   │   └── shared/          # Shared utilities
│   ├── pages/
│   │   ├── admin/           # Admin pages (40+)
│   │   ├── teacher/         # Teacher pages (30+)
│   │   ├── student/         # Student pages (20+)
│   │   ├── parent/          # Parent pages
│   │   ├── auth/            # Auth pages
│   │   └── dashboard/       # Role-specific dashboards
│   ├── services/            # API services
│   │   ├── api.js           # Axios instance config
│   │   ├── auth.js
│   │   ├── lessons.js
│   │   ├── homework.js
│   │   ├── attendance.js
│   │   ├── lab.js
│   │   └── ... (10+ services)
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── LanguageContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── LabContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useDebounce.js
│   │   └── ... (custom hooks)
│   ├── locales/
│   │   ├── ar/ar.json       # Arabic translations
│   │   ├── en/en.json       # English translations
│   │   └── fr/fr.json       # French translations
│   ├── constants/
│   │   └── anatomyModels.js # 3D model paths
│   ├── styles/
│   │   └── globals.css      # Global styles
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── eslint.config.js
```

---

## Routing System

### Route Structure

**Total Routes**: 100+ routes

### Public Routes
```javascript
// Authentication
/login
/register
/forgot-password
/reset-password/:token
```

### Protected Routes (Require Authentication)

#### Student Routes
```javascript
/student/dashboard
/student/lessons
/student/lessons/:lessonId
/student/homework
/student/homework/:homeworkId
/student/homework/:homeworkId/submit
/student/exercises
/student/exercises/:exerciseId
/student/grades
/student/attendance
/student/rewards
/student/badges
/student/leaderboard
/student/lab
/student/lab/:toolId
/student/profile
```

#### Teacher Routes
```javascript
/teacher/dashboard
/teacher/classes
/teacher/classes/:classId
/teacher/lessons
/teacher/lessons/create
/teacher/lessons/:lessonId
/teacher/lessons/:lessonId/edit
/teacher/homework
/teacher/homework/create
/teacher/homework/:homeworkId
/teacher/homework/:homeworkId/edit
/teacher/homework/:homeworkId/submissions
/teacher/attendance
/teacher/attendance/take
/teacher/students
/teacher/students/:studentId
/teacher/analytics
/teacher/lab/assignments
/teacher/lab/assignments/create
```

#### Admin Routes
```javascript
/admin/dashboard
/admin/users
/admin/users/create
/admin/users/import
/admin/students
/admin/teachers
/admin/parents
/admin/school-config
/admin/academic-years
/admin/grades
/admin/tracks
/admin/classes
/admin/classes/create
/admin/subjects
/admin/rooms
/admin/vehicles
/admin/reports
/admin/settings
... (40+ admin routes)
```

### Route Protection

```javascript
// Example: Protected Route Component
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// Usage
<Route
  path="/teacher/dashboard"
  element={
    <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
      <TeacherDashboard />
    </ProtectedRoute>
  }
/>
```

---

## State Management

### Server State (TanStack Query)

**Configuration**:
```javascript
// src/main.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

**Usage Example**:
```javascript
// Fetching data
import { useQuery } from '@tanstack/react-query';
import { lessonsService } from '@/services/lessons';

function LessonList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['lessons', { subject: 1, grade: 10 }],
    queryFn: () => lessonsService.getLessons({ subject: 1, grade: 10 }),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {data.results.map(lesson => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}
    </div>
  );
}
```

**Mutations**:
```javascript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateLessonForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newLesson) => lessonsService.createLesson(newLesson),
    onSuccess: () => {
      // Invalidate and refetch lessons
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Lesson created successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Lesson'}
      </button>
    </form>
  );
}
```

### Global State (Context API)

#### Auth Context
```javascript
// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { authService } from '@/services/auth';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token
    const token = localStorage.getItem('access_token');
    if (token) {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    localStorage.setItem('access_token', response.tokens.access);
    localStorage.setItem('refresh_token', response.tokens.refresh);
    setUser(response.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
```

#### Language Context
```javascript
// src/contexts/LanguageContext.jsx
import { createContext, useState, useEffect } from 'react';
import i18n from 'i18next';

export const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ar'); // Default: Arabic
  const [direction, setDirection] = useState('rtl');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    changeLanguage(savedLang);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setDirection(lang === 'ar' ? 'rtl' : 'ltr');
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{
      language,
      direction,
      changeLanguage,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}
```

---

## API Services

### Base API Configuration

```javascript
// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add language header
    const language = localStorage.getItem('language') || 'ar';
    config.headers['Accept-Language'] = language;

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### Service Example

```javascript
// src/services/lessons.js
import api from './api';

export const lessonsService = {
  // Get all lessons
  getLessons: async (params = {}) => {
    const response = await api.get('/lessons/lessons/', { params });
    return response.data;
  },

  // Get single lesson
  getLesson: async (lessonId) => {
    const response = await api.get(`/lessons/lessons/${lessonId}/`);
    return response.data;
  },

  // Create lesson
  createLesson: async (lessonData) => {
    const response = await api.post('/lessons/lessons/', lessonData);
    return response.data;
  },

  // Update lesson
  updateLesson: async (lessonId, lessonData) => {
    const response = await api.patch(`/lessons/lessons/${lessonId}/`, lessonData);
    return response.data;
  },

  // Delete lesson
  deleteLesson: async (lessonId) => {
    await api.delete(`/lessons/lessons/${lessonId}/`);
  },

  // Publish lesson
  publishLesson: async (lessonId, classIds) => {
    const response = await api.post(`/lessons/lessons/${lessonId}/publish/`, {
      class_ids: classIds,
    });
    return response.data;
  },

  // Get lesson resources
  getLessonResources: async (lessonId) => {
    const response = await api.get(`/lessons/lessons/${lessonId}/resources/`);
    return response.data;
  },

  // Upload resource
  uploadResource: async (lessonId, formData) => {
    const response = await api.post(
      `/lessons/lessons/${lessonId}/resources/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};
```

---

## Key Components

### Layout Components

#### Main Layout
```javascript
// src/components/layout/Layout.jsx
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import AppNavbar from './AppNavbar';

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppNavbar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

### Block Editor

#### Block Renderer
```javascript
// src/components/blocks/BlockRenderer.jsx
import ParagraphBlock from './ParagraphBlock';
import HeadingBlock from './HeadingBlock';
import CodeBlock from './CodeBlock';
// ... import other blocks

const blockComponents = {
  paragraph: ParagraphBlock,
  heading_1: HeadingBlock,
  heading_2: HeadingBlock,
  heading_3: HeadingBlock,
  code: CodeBlock,
  // ... other block types
};

export default function BlockRenderer({ block }) {
  const BlockComponent = blockComponents[block.type];

  if (!BlockComponent) {
    return <div>Unknown block type: {block.type}</div>;
  }

  return <BlockComponent block={block} />;
}
```

#### Paragraph Block
```javascript
// src/components/blocks/ParagraphBlock.jsx
export default function ParagraphBlock({ block }) {
  return (
    <p className="text-gray-700 dark:text-gray-300 leading-relaxed my-2">
      {block.content}
    </p>
  );
}
```

#### Code Block
```javascript
// src/components/blocks/CodeBlock.jsx
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ block }) {
  return (
    <div className="my-4">
      <SyntaxHighlighter
        language={block.language || 'javascript'}
        style={vscDarkPlus}
        customStyle={{
          borderRadius: '0.5rem',
          padding: '1rem',
        }}
      >
        {block.content}
      </SyntaxHighlighter>
    </div>
  );
}
```

### 3D Model Viewer

```javascript
// src/components/lab/Model3DViewer.jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function Model3DViewer({ modelUrl }) {
  return (
    <div className="h-96 w-full bg-gray-900 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} />
        <Suspense fallback={<LoadingCube />}>
          <Model url={modelUrl} />
        </Suspense>
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
        />
      </Canvas>
    </div>
  );
}

function LoadingCube() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
```

### Markdown Renderer

```javascript
// src/components/markdown/MarkdownRenderer.jsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        // Custom component for code blocks
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
```

### Chart Components

```javascript
// src/components/analytics/ScoreDistribution.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ScoreDistribution({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Usage
const scoreData = [
  { range: '0-5', count: 2 },
  { range: '6-10', count: 5 },
  { range: '11-15', count: 10 },
  { range: '16-20', count: 8 },
];

<ScoreDistribution data={scoreData} />
```

---

## Internationalization

### i18n Setup

```javascript
// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ar',
    supportedLngs: ['ar', 'en', 'fr'],
    ns: ['common', 'lessons', 'homework', 'attendance'],
    defaultNS: 'common',

    backend: {
      loadPath: '/locales/{{lng}}/{{lng}}.json',
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

### Usage in Components

```javascript
import { useTranslation } from 'react-i18next';

function LessonCard({ lesson }) {
  const { t, i18n } = useTranslation();

  return (
    <div className="card">
      <h3>{lesson[`title_${i18n.language}`] || lesson.title}</h3>
      <p>{t('lessons.difficulty')}: {lesson.difficulty_level}</p>
      <button>{t('common.view_details')}</button>
    </div>
  );
}
```

### Translation Files

```json
// locales/en/en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "view_details": "View Details"
  },
  "lessons": {
    "title": "Lessons",
    "create_lesson": "Create Lesson",
    "difficulty": "Difficulty",
    "objectives": "Learning Objectives"
  }
}
```

```json
// locales/ar/ar.json
{
  "common": {
    "save": "حفظ",
    "cancel": "إلغاء",
    "delete": "حذف",
    "view_details": "عرض التفاصيل"
  },
  "lessons": {
    "title": "الدروس",
    "create_lesson": "إنشاء درس",
    "difficulty": "الصعوبة",
    "objectives": "أهداف التعلم"
  }
}
```

---

## Performance Optimization

### Code Splitting

```javascript
// Lazy load pages
import { lazy, Suspense } from 'react';

const TeacherDashboard = lazy(() => import('@/pages/teacher/TeacherDashboard'));
const StudentDashboard = lazy(() => import('@/pages/student/StudentDashboard'));

// In routes
<Route
  path="/teacher/dashboard"
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <TeacherDashboard />
    </Suspense>
  }
/>
```

### Memoization

```javascript
import { memo, useMemo } from 'react';

// Memoize expensive component
const LessonCard = memo(function LessonCard({ lesson }) {
  return (
    <div className="card">
      <h3>{lesson.title}</h3>
      {/* ... */}
    </div>
  );
});

// Memoize expensive calculation
function HomeworkAnalytics({ submissions }) {
  const stats = useMemo(() => {
    return calculateStatistics(submissions);
  }, [submissions]);

  return <div>{/* Display stats */}</div>;
}
```

### Image Optimization

```javascript
// Use Cloudinary transformations
function OptimizedImage({ src, alt, width, height }) {
  // Cloudinary URL transformation
  const optimizedSrc = src.replace('/upload/', `/upload/w_${width},h_${height},c_fill/`);

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
    />
  );
}
```

---

## Build & Deployment

### Build Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          '3d': ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
});
```

### Environment Variables

```bash
# .env.development
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Madrasti 2.0
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name

# .env.production
VITE_API_URL=https://api.madrasti.com/api
VITE_APP_NAME=Madrasti 2.0
VITE_CLOUDINARY_CLOUD_NAME=production_cloud_name
```

### Build Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Format
npm run format
```

---

**Last Updated**: December 2025
