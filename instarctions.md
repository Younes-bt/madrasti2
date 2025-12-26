# Lessons List Page - UX/UI Redesign Instructions

**Document Version:** 1.0  
**Date:** December 26, 2024  
**Project:** Madrasti 2.0 - Student Dashboard  
**Target:** Frontend Development Team  
**Author:** UX/UI Review & Redesign Specification

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Design Principles & Psychology](#design-principles--psychology)
4. [Complete Redesign Specification](#complete-redesign-specification)
5. [Component Library](#component-library)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Technical Guidelines](#technical-guidelines)
8. [Quality Assurance Checklist](#quality-assurance-checklist)
9. [Appendix: Reference Materials](#appendix-reference-materials)

---

## Executive Summary

### Current Rating: 4/10

The existing lessons list page is a **functional data table** that works for administrators but completely fails as a student-facing learning interface. It looks like a database export, not an engaging educational platform.

### Critical Problems Identified

| Problem | Severity | Impact |
|---------|----------|--------|
| Information overload without hierarchy | **Critical** | Students can't find what they need |
| Zero visual engagement | **Critical** | No motivation to learn |
| Poor scannability | **High** | High cognitive load |
| Confusing status system | **High** | Can't tell progress apart |
| No clear call-to-action | **High** | Students don't know next steps |
| Mobile experience catastrophic | **Critical** | Unusable on phones |
| No progress visualization | **High** | No sense of achievement |

### Success Metrics After Redesign

After implementation, we should see:
- ↑ 50% increase in lesson start rate (clearer CTAs)
- ↑ 35% increase in completion rate (better progress visualization)
- ↑ 60% increase in mobile usage (responsive card layout)
- ↓ 70% reduction in "back" button clicks (less confusion)
- ↑ 40% increase in time-on-platform (more engaging)

---

## Current State Analysis

### What We're Working With

![Current Design Screenshot](current_lessons_list.png)

#### Current Layout Structure
```
┌─────────────────────────────────────────────────────┐
│ Sidebar (Left)                                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ [جميع الدروس]                                   │ │
│ │ التقدم: 3/72  |  منشورة  |  3 من 47            │ │
│ │                                                  │ │
│ │ [Filter lessons ▼]                              │ │
│ │ 3 عامل تصفية                                    │ │
│ │                                                  │ │
│ │ TABLE:                                           │ │
│ │ ┌──┬────────┬──┬────────┬────────┬────────┬────┐│ │
│ │ │☐│ Date   │1 │ Knowit │Subject │ Title  │ ●  ││ │
│ │ ├──┼────────┼──┼────────┼────────┼────────┼────┤│ │
│ │ │☐│12/16/24│1 │ Knowit │كيمياء  │Ethylene│ ●  ││ │
│ │ │☐│12/16/24│1 │ Knowit │كيمياء  │Ethanol │ ●  ││ │
│ │ │☐│12/16/24│1 │ Knowit │كيمياء  │Benzene │ ●  ││ │
│ │ │  (Repeats 50+ times)                         ││ │
│ │ └──┴────────┴──┴────────┴────────┴────────┴────┘│ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

### Detailed Problem Analysis

#### Problem 1: Header Section Confusion

**Current State:**
```
جميع الدروس
التقدم: 3/72  |  منشورة  |  3 من 47
```

**Issues:**
- ❌ **"3/72"** - What does this mean? 3 lessons completed out of 72? Unclear.
- ❌ **"منشورة"** (Published) - Why does a student need admin metadata?
- ❌ **"3 من 47"** - Another confusing metric. What's the difference from 3/72?
- ❌ **No visual progress bar** - Just numbers, no quick visual scan
- ❌ **No context** - What subject? What level? Missing course info

**Psychology Fail:**
- Numbers alone don't motivate (need visual progress)
- Administrative language breaks immersion ("published"?)
- Cognitive load too high (which number matters?)

---

#### Problem 2: Filter System Hidden & Confusing

**Current State:**
```
Filter lessons  ▼
3 عامل تصفية
```

**Issues:**
- ❌ **Mixed languages** - "Filter lessons" in English, rest in Arabic
- ❌ **Hidden filters** - Can't see what's active without clicking
- ❌ **"3 عامل تصفية"** - Which 3 filters? Have to click to find out
- ❌ **No quick filter pills** - Common actions buried in dropdown

**User Experience:**
- Extra clicks required for basic filtering
- Can't see current filter state at a glance
- No visual feedback on active filters

---

#### Problem 3: Table Structure Fundamentally Wrong

**Current Columns (Right to Left):**
1. **Checkbox** - For what? Bulk actions students don't need
2. **Date** - 12/16/2024 - Irrelevant to students (they care about sequence, not dates)
3. **Number** - Always shows "1" - Completely redundant
4. **Status Badge** - All show "Knowit" in identical yellow - Meaningless differentiation
5. **Subject + Level** - "كيمياء عامة / المستوى 1" - Repetitive (same for all rows)
6. **Lesson Title** - Mixed Arabic/English, includes metadata
7. **Action Menu** - Three dots menu, unclear what actions available

**Critical Issues:**

| Column | Problem | Should Be |
|--------|---------|-----------|
| Checkbox | Students don't bulk-select lessons | Remove entirely |
| Date | Irrelevant metadata (admin-focused) | Remove or hide |
| Number "1" | Always same value, no information | Remove |
| Status | All identical, no differentiation | Color-coded: locked/in-progress/completed |
| Subject | Repeated in every row | Show once in header |
| Title | English mixed with Arabic, poor formatting | Clean Arabic with optional English subtitle |
| Action | Hidden in menu | Prominent "Start Lesson" button |

**Psychology Fail:**
- **Tables = Data Analysis** (not learning journeys)
- Students need **narrative flow**, not **database dump**
- Every row feels like a chore, not progress

---

#### Problem 4: Status System Broken

**Current Implementation:**
```
All rows show: [Knowit] in yellow badge
```

**What It Should Show:**
- 🔒 **Locked** (gray) - Prerequisites not met
- 📝 **Not Started** (blue) - Available but not begun
- ⏳ **In Progress** (yellow) - Partially completed (with %)
- ✅ **Completed** (green) - Finished with score

**Psychology:**
- Color coding reduces cognitive load
- Progress bars create Zeigarnik Effect (desire to complete)
- Clear status hierarchy guides students

---

#### Problem 5: Individual Row Analysis

**Current Row Example:**
```
☐ | 12/16/2024 | 1 | Knowit | كيمياء عامة / المستوى 1 | 
Ethylene glycol preparation - Ethylene glycol preparation 
[مشاهدة الدرس]
```

**What's Wrong:**
1. ❌ English title duplicated
2. ❌ No visual preview (icon, thumbnail, progress)
3. ❌ Status unclear (what does "Knowit" mean?)
4. ❌ Can't see duration, difficulty, completion %
5. ❌ Button small and lost in noise
6. ❌ No indication of locked/unlocked state
7. ❌ No points/rewards shown for completed lessons

**What It Should Be:**
```
┌──────────────────────────────┐
│ ⏳ قيد التقدم               │
│ ─────────────────────────    │
│ الدرس 5: تحضير الإيثيلين جليكول│
│                              │
│ ████████░░░░░░ 65%          │
│                              │
│ 📊 متوسط | ⏱️ 20 دقيقة     │
│                              │
│ [← استمر في التعلم]         │
└──────────────────────────────┘
```

---

#### Problem 6: Mobile Experience

**Current Issues:**
- ❌ Table requires horizontal scrolling on mobile
- ❌ Tiny text becomes unreadable
- ❌ Touch targets too small (buttons, checkboxes)
- ❌ Information hierarchy breaks completely
- ❌ Multi-column layout doesn't stack properly

**Impact:**
- **70% of students use mobile devices**
- Current design is essentially **unusable on phones**
- Students will abandon platform or use desktop only

---

#### Problem 7: No Gamification or Motivation

**Missing Elements:**
- ❌ No points/XP earned visible
- ❌ No badges or achievements
- ❌ No completion streaks
- ❌ No leaderboard hints
- ❌ No visual celebration of progress

**Psychology Principles Ignored:**
- **Operant Conditioning** - No positive reinforcement
- **Progress Visualization** - No sense of achievement
- **Goal Gradient Effect** - Can't see how close to completion
- **Social Proof** - No indication others are learning too

---

## Design Principles & Psychology

### Core UX Principles for Redesign

#### 1. Progressive Disclosure
**Principle:** Don't overwhelm students with all information at once.

**Implementation:**
- Hero section shows high-level progress
- Unit headers group related lessons
- Cards reveal details on hover/click
- Collapsible sections for advanced filters

**Psychology:** 
- Miller's Law: 7±2 chunks of information
- Reduces cognitive overload
- Allows focused attention on relevant content

---

#### 2. Visual Hierarchy
**Principle:** Most important information should be most prominent.

**Implementation:**
- **Primary:** Overall progress, next lesson CTA
- **Secondary:** Unit progress, filter tabs
- **Tertiary:** Individual lesson details

**F-Pattern Reading:**
```
┌─────────────────────────────┐
│ [HERO: Overall Progress]    │ ← Eye starts here
│ ════════════════════════    │
│ [Filter Tabs]               │ ← Scans left-to-right
│ ────────────────────────    │
│ [Unit Header]               │ ← Scans down
│ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │Card 1│ │Card 2│ │Card 3│ │ ← Cards scannable
│ └──────┘ └──────┘ └──────┘ │
└─────────────────────────────┘
```

---

#### 3. Clear Status Differentiation
**Principle:** Students should instantly know lesson state.

**Color Psychology:**
- 🔒 **Gray** (Locked) - Neutral, not threatening, clear barrier
- 📝 **Blue** (Not Started) - Calm, inviting, ready to begin
- ⏳ **Yellow/Orange** (In Progress) - Attention, urgency, "finish me"
- ✅ **Green** (Completed) - Success, achievement, dopamine hit

**Icon System:**
- Lock icon = Prerequisites required
- Play icon = Ready to start
- Clock icon = In progress
- Checkmark = Completed

---

#### 4. Gamification & Motivation
**Principle:** Learning should feel rewarding, not tedious.

**Psychological Mechanisms:**

**a) Progress Visualization (Zeigarnik Effect)**
- Incomplete tasks create mental tension
- Visual progress bars ("65% complete") create desire to finish
- More effective than abstract data

**b) Point System (Operant Conditioning)**
- Points awarded for completion = positive reinforcement
- Visible points balance creates extrinsic motivation
- Works especially well for young learners

**c) Achievement Badges**
- Unlocking achievements = dopamine release
- Creates collection mechanic ("gotta catch 'em all")
- Social proof when shared

**d) Streaks**
- Daily streaks create habit formation
- Fear of breaking streak = powerful motivator
- Used effectively by Duolingo, Snapchat

---

#### 5. Mobile-First Responsive Design
**Principle:** Design for smallest screen first, enhance for larger.

**Breakpoints:**
```javascript
const breakpoints = {
  mobile: '0-640px',    // 1 column
  tablet: '641-1024px', // 2 columns
  desktop: '1025px+'    // 3 columns
}
```

**Card-Based Layout Benefits:**
- Stacks vertically on mobile (natural scroll)
- Consistent touch targets (44x44px minimum)
- No horizontal scrolling
- Progressive enhancement (add features on larger screens)

---

#### 6. Chunking (Miller's Law)
**Principle:** Group lessons into digestible units.

**Implementation:**
- Lessons grouped by unit/chapter (5-8 lessons per unit)
- Collapsible unit headers
- "Continue from here" reduces decision paralysis

**Psychology:**
- Working memory can hold 7±2 items
- Grouping reduces cognitive load
- Makes large course (72 lessons) feel manageable

---

## Complete Redesign Specification

### Design System Foundation

#### Spacing Scale
```javascript
const spacing = {
  xs: '4px',    // Icon spacing
  sm: '8px',    // Tight spacing
  md: '16px',   // Default spacing
  lg: '24px',   // Section spacing
  xl: '32px',   // Large gaps
  '2xl': '48px',// Hero sections
  '3xl': '64px' // Page sections
}
```

#### Typography Scale (Arabic-Optimized)
```javascript
const typography = {
  // Display (Hero)
  display: {
    size: '36px',
    weight: 800,
    lineHeight: 1.3,
    letterSpacing: '-0.02em'
  },
  
  // Headlines
  h1: { size: '28px', weight: 700, lineHeight: 1.4 },
  h2: { size: '24px', weight: 700, lineHeight: 1.4 },
  h3: { size: '20px', weight: 600, lineHeight: 1.4 },
  h4: { size: '18px', weight: 600, lineHeight: 1.4 },
  
  // Body
  bodyLarge: { size: '18px', weight: 400, lineHeight: 1.7 },
  body: { size: '16px', weight: 400, lineHeight: 1.7 },
  bodySmall: { size: '14px', weight: 400, lineHeight: 1.6 },
  
  // UI Elements
  caption: { size: '12px', weight: 500, lineHeight: 1.4 },
  button: { size: '16px', weight: 600, lineHeight: 1 }
}

// Arabic-specific adjustments
const arabicSettings = {
  fontFamily: "'Cairo', 'Tajawal', 'IBM Plex Sans Arabic', sans-serif",
  // Increase line-height by 0.2 for Arabic readability
  lineHeightMultiplier: 1.2,
  // Better spacing for Arabic characters
  letterSpacing: '0.01em'
}
```

#### Color Palette (Semantic + Brand)
```javascript
const colors = {
  // Brand Primary (Blue)
  primary: {
    50: '#EBF5FF',
    100: '#D6EAFF',
    200: '#ADD6FF',
    300: '#85C1FF',
    400: '#5CADFF',
    500: '#2563EB',  // Main brand
    600: '#1D4ED8',
    700: '#1E40AF',
    800: '#1E3A8A',
    900: '#1E3A70'
  },
  
  // Status: Success (Green)
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',  // Completed lessons
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B'
  },
  
  // Status: Warning/In-Progress (Yellow/Orange)
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',  // In-progress lessons
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F'
  },
  
  // Status: Error/Locked (Red/Gray)
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626'
  },
  
  // Info/Not Started (Light Blue)
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    500: '#3B82F6',
    600: '#2563EB'
  },
  
  // Neutral (Gray scale)
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
}
```

#### Border Radius
```javascript
const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px'
}
```

#### Shadows (Elevation)
```javascript
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Colored shadows for cards
  primary: '0 10px 20px -5px rgba(37, 99, 235, 0.2)',
  success: '0 10px 20px -5px rgba(16, 185, 129, 0.2)',
  warning: '0 10px 20px -5px rgba(245, 158, 11, 0.2)'
}
```

---

### New Layout Architecture

#### Overall Page Structure
```
┌─────────────────────────────────────────────────────┐
│ HERO SECTION (Gradient Background)                  │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 📚 Course Title + Level                         │ │
│ │ Overall Progress Bar (21% complete)             │ │
│ │ Stats: [15 مكتمل] [8 ساعات] [320 نقطة]        │ │
│ │ [🔥 CTA: استمر من حيث توقفت]                   │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ FILTER SECTION (Tabs + Search)                      │
│ [● الكل] [○ قيد التقدم] [○ مكتملة] [○ مغلقة]      │
│ [🔍 Search...]                            [⚙️]     │
├─────────────────────────────────────────────────────┤
│ CONTENT AREA (Cards Grid)                           │
│ ┌─────────────────────────────────────────────────┐ │
│ │ الوحدة الأولى: أساسيات الكيمياء                │ │
│ │ Progress: ████████░░░░ 5/8 (63%)                │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│ │ Lesson   │  │ Lesson   │  │ Lesson   │          │
│ │ Card 1   │  │ Card 2   │  │ Card 3   │          │
│ │ (3-col)  │  │          │  │          │          │
│ └──────────┘  └──────────┘  └──────────┘          │
│                                                     │
│ [More units and lessons...]                         │
└─────────────────────────────────────────────────────┘
```

---

### Component Specifications

#### 1. Hero Section

**Purpose:** Motivate students with overall progress and clear next action

**Visual Design:**
```
┌────────────────────────────────────────────────┐
│ 📚 الكيمياء العامة                            │
│ المستوى الأول                                 │
│                                                │
│ التقدم الكلي                                  │
│ ███████░░░░░░░░░░░░ 15/72                     │
│ 21% مكتمل                                     │
│                                                │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│ │ 🎯 15    │  │ ⏱️ 8 سا  │  │ 🏆 320   │      │
│ │ مكتمل    │  │ وقت تعلم │  │ نقطة     │      │
│ └──────────┘  └──────────┘  └──────────┘      │
│                                                │
│ [🔥 استمر من حيث توقفت: الدرس 16]            │
└────────────────────────────────────────────────┘
```

**Component Code:**
```jsx
// components/Lessons/HeroSection.jsx

import { TrendingUp, Clock, Trophy, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export function HeroSection({ courseData }) {
  const {
    title,
    level,
    totalLessons,
    completedLessons,
    progressPercentage,
    totalPoints,
    studyTimeHours,
    nextLessonNumber
  } = courseData;
  
  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white p-8 rounded-b-2xl shadow-2xl">
      <div className="container mx-auto max-w-6xl">
        {/* Title & Level */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <span className="text-4xl">📚</span>
            {title}
          </h1>
          <p className="text-primary-100 text-lg">
            {level}
          </p>
        </div>
        
        {/* Overall Progress */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-semibold">التقدم الكلي</span>
            <span className="text-2xl font-bold">
              {completedLessons}/{totalLessons}
            </span>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="h-3 bg-white/20"
          />
          
          <p className="text-sm text-primary-100 mt-2">
            {progressPercentage}% مكتمل
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Completed Lessons */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 text-center border border-white/20 hover:bg-white/15 transition-all">
            <div className="text-4xl mb-3">🎯</div>
            <div className="text-3xl font-bold mb-1">
              {completedLessons}
            </div>
            <div className="text-sm text-primary-100">
              درس مكتمل
            </div>
          </div>
          
          {/* Study Time */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 text-center border border-white/20 hover:bg-white/15 transition-all">
            <div className="flex items-center justify-center text-4xl mb-3">
              ⏱️
            </div>
            <div className="text-3xl font-bold mb-1">
              {studyTimeHours}
            </div>
            <div className="text-sm text-primary-100">
              ساعات تعلم
            </div>
          </div>
          
          {/* Total Points */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 text-center border border-white/20 hover:bg-white/15 transition-all">
            <div className="text-4xl mb-3">🏆</div>
            <div className="text-3xl font-bold mb-1">
              {totalPoints}
            </div>
            <div className="text-sm text-primary-100">
              نقطة مكتسبة
            </div>
          </div>
        </div>
        
        {/* Primary CTA */}
        <Button 
          size="lg" 
          className="w-full bg-white text-primary-700 hover:bg-primary-50 hover:shadow-lg transition-all gap-3 text-lg py-6 rounded-xl font-bold"
          onClick={() => {/* Navigate to next lesson */}}
        >
          <Flame className="w-6 h-6 text-orange-500" />
          استمر من حيث توقفت: الدرس {nextLessonNumber}
        </Button>
      </div>
    </div>
  );
}
```

**Design Notes:**
- **Gradient background** creates visual interest
- **Glassmorphism** (backdrop-blur) for modern feel
- **Large numbers** are easy to scan
- **Emoji icons** add personality and clarity
- **Prominent CTA** reduces decision paralysis

---

#### 2. Filter Section

**Purpose:** Allow quick filtering without extra clicks

**Visual Design:**
```
┌────────────────────────────────────────────────┐
│ عرض:                                          │
│ [● الكل] [○ قيد التقدم] [○ مكتملة] [○ مغلقة] │
│                                                │
│ 🔍 [ابحث عن درس...]              [⚙️ خيارات]│
└────────────────────────────────────────────────┘
```

**Component Code:**
```jsx
// components/Lessons/FilterSection.jsx

import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function FilterSection({ 
  activeFilter, 
  onFilterChange, 
  searchQuery, 
  onSearchChange,
  onAdvancedFilters 
}) {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      {/* Status Filter Tabs */}
      <div className="mb-4">
        <label className="text-sm font-medium text-neutral-700 mb-2 block">
          عرض:
        </label>
        <Tabs value={activeFilter} onValueChange={onFilterChange}>
          <TabsList className="w-full justify-start bg-neutral-100 p-1">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              ● الكل
            </TabsTrigger>
            <TabsTrigger 
              value="in-progress"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              ⏳ قيد التقدم
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              ✅ مكتملة
            </TabsTrigger>
            <TabsTrigger 
              value="locked"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              🔒 مغلقة
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث عن درس باسمه أو رقمه..."
            className="pr-10 py-6 text-base border-neutral-200 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        
        <Button 
          variant="outline" 
          size="lg"
          onClick={onAdvancedFilters}
          className="gap-2 px-4"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline">خيارات متقدمة</span>
        </Button>
      </div>
    </div>
  );
}
```

**Accessibility:**
- Tab navigation between filters
- Clear focus states
- Aria labels on all interactive elements
- Screen reader announces active filter

---

#### 3. Unit Header Component

**Purpose:** Group lessons by unit with progress visualization

**Visual Design:**
```
┌─────────────────────────────────────────────────┐
│ الوحدة الأولى: أساسيات الكيمياء                │
│ ────────────────────────────────────────────     │
│ التقدم: ████████░░░░ 5/8 دروس (63%)            │
│                                          [▼]    │
└─────────────────────────────────────────────────┘
```

**Component Code:**
```jsx
// components/Lessons/UnitHeader.jsx

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export function UnitHeader({ unit, defaultCollapsed = false }) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  
  const {
    title,
    number,
    completedLessons,
    totalLessons,
    progressPercentage
  } = unit;
  
  return (
    <div className="mb-6">
      <div 
        className="flex items-center justify-between p-5 bg-gradient-to-r from-neutral-50 to-neutral-100/50 rounded-xl cursor-pointer hover:from-neutral-100 hover:to-neutral-100 transition-all border border-neutral-200"
        onClick={() => setIsCollapsed(!isCollapsed)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsCollapsed(!isCollapsed);
          }
        }}
        aria-expanded={!isCollapsed}
      >
        <div className="flex-1">
          {/* Unit Title */}
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">
              {number}
            </span>
            {title}
          </h2>
          
          {/* Progress Info */}
          <div className="flex items-center gap-6">
            {/* Progress Bar */}
            <div className="flex-1 max-w-md">
              <Progress 
                value={progressPercentage} 
                className="h-2.5"
              />
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-neutral-600">
              <span className="font-medium">
                {completedLessons} من {totalLessons} دروس
              </span>
              <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full font-bold">
                {progressPercentage}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Collapse Toggle */}
        <Button 
          variant="ghost" 
          size="sm"
          className="mr-4"
          aria-label={isCollapsed ? 'توسيع الوحدة' : 'طي الوحدة'}
        >
          {isCollapsed ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronUp className="w-5 h-5" />
          )}
        </Button>
      </div>
      
      {/* Visual Indicator */}
      {!isCollapsed && (
        <div className="mt-1 h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-transparent rounded-full" />
      )}
    </div>
  );
}
```

**Interaction:**
- Click/tap entire header to collapse/expand
- Keyboard accessible (Enter/Space)
- Smooth animation on state change
- Visual feedback on hover

---

#### 4. Lesson Card Component (Multiple States)

**Purpose:** Display lesson info with clear status and action

**State Variations:**

##### A. Locked State
```
┌──────────────────────────────┐
│ 🔒 مغلق                     │
│ ─────────────────────────    │
│                              │
│ الدرس 6: التفاعلات الكيميائية│
│                              │
│ 📊 متوسط | ⏱️ 20 دقيقة     │
│                              │
│ أكمل الدرس 5 أولاً          │
│                              │
│ [مغلق] (disabled)           │
└──────────────────────────────┘
```

##### B. Not Started
```
┌──────────────────────────────┐
│ 📝 لم يبدأ                  │
│ ─────────────────────────    │
│                              │
│ الدرس 4: الذرات والجزيئات   │
│                              │
│ 📊 سهل | ⏱️ 15 دقيقة        │
│                              │
│ [▶ ابدأ الدرس]              │
└──────────────────────────────┘
```

##### C. In Progress
```
┌──────────────────────────────┐
│ ⏳ قيد التقدم               │
│ ─────────────────────────    │
│                              │
│ الدرس 5: المعادلات الكيميائية│
│                              │
│ ████████░░░░░░ 65%          │
│                              │
│ 📊 متوسط | ⏱️ 20 دقيقة     │
│                              │
│ [← استمر في التعلم]         │
└──────────────────────────────┘
```

##### D. Completed
```
┌──────────────────────────────┐
│ ✅ مكتمل                     │
│ ─────────────────────────    │
│                              │
│ الدرس 3: المادة وخصائصها    │
│                              │
│ ██████████████████ 100%     │
│                              │
│ 🏆 +50 نقطة | ⭐ 95%        │
│                              │
│ 📊 متوسط | ⏱️ 20 دقيقة     │
│                              │
│ [📖 راجع الدرس]             │
└──────────────────────────────┘
```

**Full Component Code:**
```jsx
// components/Lessons/LessonCard.jsx

import { 
  Lock, 
  PlayCircle, 
  Clock, 
  CheckCircle, 
  BarChart3, 
  Trophy, 
  BookOpen 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export function LessonCard({ lesson, onLessonClick }) {
  const {
    id,
    title,
    number,
    duration,
    difficulty,
    status, // 'locked' | 'not-started' | 'in-progress' | 'completed'
    progress = 0,
    points = 0,
    score = 0,
    prerequisiteLesson = null
  } = lesson;
  
  // Configuration for different states
  const statusConfig = {
    locked: {
      icon: Lock,
      label: 'مغلق',
      bgColor: 'bg-neutral-100',
      textColor: 'text-neutral-600',
      borderColor: 'border-neutral-200',
      actionLabel: 'مغلق',
      actionDisabled: true,
      actionVariant: 'outline'
    },
    'not-started': {
      icon: PlayCircle,
      label: 'لم يبدأ',
      bgColor: 'bg-info-50',
      textColor: 'text-info-700',
      borderColor: 'border-info-200',
      actionLabel: 'ابدأ الدرس',
      actionDisabled: false,
      actionVariant: 'default'
    },
    'in-progress': {
      icon: Clock,
      label: 'قيد التقدم',
      bgColor: 'bg-warning-50',
      textColor: 'text-warning-700',
      borderColor: 'border-warning-300',
      actionLabel: 'استمر في التعلم',
      actionDisabled: false,
      actionVariant: 'default'
    },
    completed: {
      icon: CheckCircle,
      label: 'مكتمل',
      bgColor: 'bg-success-50',
      textColor: 'text-success-700',
      borderColor: 'border-success-200',
      actionLabel: 'راجع الدرس',
      actionDisabled: false,
      actionVariant: 'outline'
    }
  };
  
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  
  const difficultyConfig = {
    'سهل': { color: 'text-success-600', bg: 'bg-success-50' },
    'متوسط': { color: 'text-warning-600', bg: 'bg-warning-50' },
    'صعب': { color: 'text-error-600', bg: 'bg-error-50' }
  };
  
  const diffStyle = difficultyConfig[difficulty];
  
  return (
    <Card 
      className={`
        transition-all duration-300
        ${status === 'locked' ? 'opacity-70' : 'hover:shadow-xl hover:-translate-y-1'}
        ${status === 'in-progress' ? `border-2 ${config.borderColor}` : 'border'}
        ${status === 'completed' ? 'border-success-200' : ''}
      `}
    >
      <CardContent className="p-6">
        {/* Status Badge & Number */}
        <div className="flex items-center justify-between mb-4">
          <Badge 
            className={`gap-2 ${config.bgColor} ${config.textColor} border-0 px-3 py-1.5`}
          >
            <StatusIcon className="w-4 h-4" />
            <span className="font-semibold">{config.label}</span>
          </Badge>
          
          <span className="text-sm font-medium text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
            الدرس {number}
          </span>
        </div>
        
        {/* Lesson Title */}
        <h3 className="text-lg md:text-xl font-bold text-neutral-900 mb-4 leading-relaxed min-h-[3.5rem] line-clamp-2">
          {title}
        </h3>
        
        {/* Progress Bar (In-Progress Only) */}
        {status === 'in-progress' && (
          <div className="mb-4">
            <Progress 
              value={progress} 
              className="h-2.5"
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-neutral-600">
                التقدم
              </p>
              <p className="text-sm font-bold text-warning-700" dir="ltr">
                {progress}%
              </p>
            </div>
          </div>
        )}
        
        {/* Completion Stats (Completed Only) */}
        {status === 'completed' && (
          <div className="flex items-center gap-4 mb-4 p-3 bg-success-50 border border-success-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-warning-500" />
              <span className="text-sm font-bold text-neutral-900">
                +{points} نقطة
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <span className="text-sm font-bold text-neutral-900">
                {score}%
              </span>
            </div>
          </div>
        )}
        
        {/* Meta Information */}
        <div className="flex items-center gap-4 text-sm mb-4 pb-4 border-b border-neutral-100">
          {/* Difficulty */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${diffStyle.bg}`}>
            <BarChart3 className={`w-4 h-4 ${diffStyle.color}`} />
            <span className={`font-medium ${diffStyle.color}`}>
              {difficulty}
            </span>
          </div>
          
          {/* Duration */}
          <div className="flex items-center gap-1.5 text-neutral-600">
            <Clock className="w-4 h-4" />
            <span>~{duration} دقيقة</span>
          </div>
        </div>
        
        {/* Lock Message (Locked Only) */}
        {status === 'locked' && prerequisiteLesson && (
          <p className="text-sm text-neutral-600 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            أكمل الدرس {prerequisiteLesson} أولاً
          </p>
        )}
        
        {/* Action Button */}
        <Button
          onClick={() => onLessonClick(lesson)}
          disabled={config.actionDisabled}
          variant={config.actionVariant}
          className="w-full gap-2 py-6 text-base font-semibold"
        >
          {status === 'not-started' && <PlayCircle className="w-5 h-5" />}
          {status === 'in-progress' && <span className="text-xl">←</span>}
          {status === 'completed' && <BookOpen className="w-5 h-5" />}
          {config.actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
```

**Interaction Details:**
- **Hover effect:** Card lifts slightly (except locked)
- **Click:** Navigate to lesson (except locked)
- **Focus state:** Clear outline for keyboard navigation
- **Responsive:** Text scales down on mobile

---

#### 5. Main Page Container

**Purpose:** Orchestrate all components with proper state management

**Full Page Code:**
```jsx
// pages/LessonsListPage.jsx

import { useState, useEffect, useMemo } from 'react';
import { HeroSection } from '@/components/Lessons/HeroSection';
import { FilterSection } from '@/components/Lessons/FilterSection';
import { UnitHeader } from '@/components/Lessons/UnitHeader';
import { LessonCard } from '@/components/Lessons/LessonCard';
import { LoadingSkeleton } from '@/components/Lessons/LoadingSkeleton';
import { EmptyState } from '@/components/Lessons/EmptyState';
import { useRouter } from 'next/router';

export default function LessonsListPage() {
  const router = useRouter();
  const { courseId } = router.query;
  
  // State
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch course data
  useEffect(() => {
    async function fetchCourseData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/courses/${courseId}/lessons`);
        const data = await response.json();
        setCourseData(data);
      } catch (error) {
        console.error('Failed to fetch course data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);
  
  // Filter and search logic
  const filteredUnits = useMemo(() => {
    if (!courseData?.units) return [];
    
    return courseData.units.map(unit => ({
      ...unit,
      lessons: unit.lessons.filter(lesson => {
        // Status filter
        const matchesStatus = 
          filterStatus === 'all' || 
          lesson.status === filterStatus;
        
        // Search filter
        const matchesSearch = 
          !searchQuery || 
          lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lesson.number.toString().includes(searchQuery);
        
        return matchesStatus && matchesSearch;
      })
    })).filter(unit => unit.lessons.length > 0);
  }, [courseData, filterStatus, searchQuery]);
  
  // Handle lesson click
  const handleLessonClick = (lesson) => {
    if (lesson.status !== 'locked') {
      router.push(`/lessons/${lesson.id}`);
    }
  };
  
  // Handle advanced filters modal
  const handleAdvancedFilters = () => {
    // Open modal with difficulty, date, completion filters
    console.log('Open advanced filters');
  };
  
  // Loading state
  if (loading) {
    return <LoadingSkeleton />;
  }
  
  // Error state
  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            حدث خطأ
          </h2>
          <p className="text-neutral-600">
            تعذر تحميل بيانات الدورة
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <HeroSection courseData={courseData} />
      
      {/* Filters */}
      <FilterSection
        activeFilter={filterStatus}
        onFilterChange={setFilterStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAdvancedFilters={handleAdvancedFilters}
      />
      
      {/* Content */}
      <div className="container mx-auto max-w-6xl px-4 pb-12">
        {filteredUnits.length > 0 ? (
          filteredUnits.map(unit => (
            <div key={unit.id} className="mb-12">
              {/* Unit Header */}
              <UnitHeader unit={unit} />
              
              {/* Lessons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {unit.lessons.map(lesson => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onLessonClick={handleLessonClick}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            filterStatus={filterStatus}
            searchQuery={searchQuery}
            onClearFilters={() => {
              setFilterStatus('all');
              setSearchQuery('');
            }}
          />
        )}
      </div>
    </div>
  );
}
```

---

#### 6. Loading Skeleton Component

**Purpose:** Show placeholder content while data loads
```jsx
// components/Lessons/LoadingSkeleton.jsx

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50 animate-pulse">
      {/* Hero Skeleton */}
      <div className="bg-gradient-to-br from-neutral-300 to-neutral-400 h-96 rounded-b-2xl" />
      
      {/* Filters Skeleton */}
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="h-12 bg-neutral-200 rounded-lg mb-4" />
        <div className="h-12 bg-neutral-200 rounded-lg" />
      </div>
      
      {/* Cards Skeleton */}
      <div className="container mx-auto max-w-6xl px-4 pb-12">
        <div className="h-16 bg-neutral-200 rounded-xl mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-neutral-200 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

#### 7. Empty State Component

**Purpose:** Guide users when no results found
```jsx
// components/Lessons/EmptyState.jsx

import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyState({ filterStatus, searchQuery, onClearFilters }) {
  const messages = {
    all: {
      icon: '📚',
      title: 'لا توجد دروس متاحة',
      description: 'لم يتم إضافة أي دروس لهذه الدورة بعد'
    },
    'in-progress': {
      icon: '⏳',
      title: 'لا توجد دروس قيد التقدم',
      description: 'ابدأ درساً جديداً للبدء في التعلم'
    },
    completed: {
      icon: '✅',
      title: 'لم تكمل أي دروس بعد',
      description: 'أكمل أول درس لترى تقدمك هنا'
    },
    locked: {
      icon: '🔒',
      title: 'لا توجد دروس مغلقة',
      description: 'جميع الدروس المتاحة مفتوحة لك'
    }
  };
  
  const message = searchQuery 
    ? {
        icon: '🔍',
        title: 'لا توجد نتائج',
        description: `لم نجد دروساً تطابق "${searchQuery}"`
      }
    : messages[filterStatus];
  
  return (
    <div className="text-center py-16">
      <div className="text-8xl mb-6">{message.icon}</div>
      <h3 className="text-2xl font-bold text-neutral-900 mb-3">
        {message.title}
      </h3>
      <p className="text-neutral-600 mb-8 max-w-md mx-auto">
        {message.description}
      </p>
      
      {(searchQuery || filterStatus !== 'all') && (
        <Button 
          onClick={onClearFilters}
          variant="outline"
          className="gap-2"
        >
          <X className="w-4 h-4" />
          مسح الفلاتر
        </Button>
      )}
    </div>
  );
}
```

---

## Implementation Roadmap

### Phase 1: Foundation & Design System (Week 1)

**Goal:** Set up design tokens, layout structure, and basic components

**Tasks:**
- [ ] Configure Tailwind with RTL support
- [ ] Set up design tokens (colors, spacing, typography, shadows)
- [ ] Create base layout structure with responsive breakpoints
- [ ] Install required dependencies (ShadCN components, icons)
- [ ] Set up Arabic fonts (Cairo/Tajawal from Google Fonts)
- [ ] Create shared UI components (Button, Card, Badge, Progress)
- [ ] Test RTL rendering with sample Arabic content

**Deliverables:**
- `tailwind.config.js` with full design system
- Base component library in Storybook (optional)
- Typography and color documentation

**Success Criteria:**
- All design tokens accessible via Tailwind classes
- RTL layout working correctly
- Components render properly in Arabic

---

### Phase 2: Hero & Filter Sections (Week 2)

**Goal:** Build top-of-page components with full functionality

**Tasks:**
- [ ] Build HeroSection component
  - Overall progress visualization
  - Stats cards (completed, time, points)
  - Primary CTA button
  - Responsive layout (stack on mobile)
- [ ] Build FilterSection component
  - Tab-based status filters
  - Search input with debounce
  - Advanced filters button
- [ ] Connect to mock API data
- [ ] Add loading states
- [ ] Test on multiple screen sizes

**Deliverables:**
- Functional HeroSection component
- Functional FilterSection component
- Mock API integration
- Responsive behavior verified

**Success Criteria:**
- Hero displays correct progress data
- Filters update results in real-time
- Smooth transitions between filter states
- Works on 375px - 1920px screens

---

### Phase 3: Cards & Unit Headers (Week 3)

**Goal:** Build core content display components

**Tasks:**
- [ ] Build LessonCard component
  - All 4 status states (locked, not-started, in-progress, completed)
  - Progress bars for in-progress
  - Achievement display for completed
  - Hover/focus states
- [ ] Build UnitHeader component
  - Collapsible functionality
  - Unit progress bar
  - Smooth animations
- [ ] Build LoadingSkeleton component
- [ ] Build EmptyState component
- [ ] Implement responsive grid (1/2/3 columns)

**Deliverables:**
- Complete LessonCard with all states
- Collapsible UnitHeader
- Loading and empty states
- Responsive grid layout

**Success Criteria:**
- Cards accurately reflect lesson status
- Clicking cards navigates correctly (except locked)
- Unit headers collapse/expand smoothly
- Grid responds to screen size

---

### Phase 4: State Management & API Integration (Week 4)

**Goal:** Connect to real backend and manage application state

**Tasks:**
- [ ] Set up API endpoints
  - `GET /api/courses/:id/lessons`
  - `POST /api/lessons/:id/start`
  - `GET /api/lessons/:id/progress`
- [ ] Implement main page container
  - Fetch course data on mount
  - Handle loading/error states
  - Filter and search logic
- [ ] Add client-side caching (React Query or SWR)
- [ ] Implement optimistic updates
- [ ] Add error boundaries

**Deliverables:**
- LessonsListPage with full API integration
- Error handling and retry logic
- Optimistic UI updates
- Client-side data caching

**Success Criteria:**
- Data loads from real backend
- Filters work with actual data
- Errors display helpful messages
- Performance: <500ms to interactive

---

### Phase 5: Polish & Optimization (Week 5)

**Goal:** Refine UX, add animations, optimize performance

**Tasks:**
- [ ] Add micro-animations
  - Card hover lift
  - Progress bar fill animation
  - Filter transition
  - Unit expand/collapse
- [ ] Implement skeleton loading
- [ ] Add success animations (completing lesson)
- [ ] Optimize images (lazy load, WebP format)
- [ ] Performance audit
  - Lighthouse score >90
  - Reduce bundle size
  - Code splitting
- [ ] Accessibility audit
  - Keyboard navigation
  - Screen reader testing
  - Color contrast verification
- [ ] Cross-browser testing
- [ ] RTL edge case testing

**Deliverables:**
- Polished animations throughout
- Optimized performance
- Full accessibility compliance
- Cross-browser compatibility

**Success Criteria:**
- Lighthouse: Performance >90, Accessibility 100
- Animations feel smooth (60fps)
- Works on Safari, Chrome, Firefox, Edge
- Passes WCAG 2.1 AA standards

---

### Phase 6: Advanced Features (Week 6 - Optional)

**Goal:** Add nice-to-have features

**Tasks:**
- [ ] Advanced filters modal
  - Filter by difficulty
  - Filter by duration
  - Filter by completion date
  - Sort options
- [ ] Bulk actions (if needed)
- [ ] Lesson recommendations
- [ ] Share progress feature
- [ ] Download certificate (for completed courses)
- [ ] Offline support (PWA)

---

## Technical Guidelines

### File Structure
```
src/
├── components/
│   ├── Lessons/
│   │   ├── HeroSection.jsx
│   │   ├── FilterSection.jsx
│   │   ├── UnitHeader.jsx
│   │   ├── LessonCard.jsx
│   │   ├── LoadingSkeleton.jsx
│   │   └── EmptyState.jsx
│   └── ui/
│       ├── button.jsx
│       ├── card.jsx
│       ├── badge.jsx
│       ├── progress.jsx
│       ├── tabs.jsx
│       └── input.jsx
├── pages/
│   └── lessons/
│       └── [courseId].jsx
├── styles/
│   └── globals.css
├── lib/
│   ├── api.js
│   └── utils.js
└── hooks/
    ├── useCourseData.js
    └── useLessons.js
```

---

### API Contract
```javascript
// GET /api/courses/:courseId/lessons

{
  "course": {
    "id": "chem-101",
    "title": "الكيمياء العامة",
    "level": "المستوى الأول",
    "totalLessons": 72,
    "completedLessons": 15,
    "progressPercentage": 21,
    "totalPoints": 320,
    "studyTimeHours": 8.5,
    "nextLessonNumber": 16
  },
  "units": [
    {
      "id": "unit-1",
      "number": 1,
      "title": "الوحدة الأولى: أساسيات الكيمياء",
      "completedLessons": 5,
      "totalLessons": 8,
      "progressPercentage": 63,
      "lessons": [
        {
          "id": "lesson-1",
          "number": 1,
          "title": "مقدمة في الكيمياء",
          "duration": 15,
          "difficulty": "سهل",
          "status": "completed",
          "progress": 100,
          "points": 50,
          "score": 95,
          "completedAt": "2024-12-01T10:30:00Z"
        },
        {
          "id": "lesson-2",
          "number": 2,
          "title": "المادة وخصائصها",
          "duration": 20,
          "difficulty": "متوسط",
          "status": "in-progress",
          "progress": 65,
          "lastAccessedAt": "2024-12-15T14:20:00Z"
        },
        {
          "id": "lesson-3",
          "number": 3,
          "title": "الذرات والجزيئات",
          "duration": 25,
          "difficulty": "متوسط",
          "status": "not-started"
        },
        {
          "id": "lesson-4",
          "number": 4,
          "title": "التفاعلات الكيميائية",
          "duration": 20,
          "difficulty": "صعب",
          "status": "locked",
          "prerequisiteLesson": 3
        }
      ]
    }
  ]
}
```

---

### State Management

**Option 1: React Query (Recommended)**
```jsx
// hooks/useCourseData.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useCourseData(courseId) {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetch(`/api/courses/${courseId}/lessons`).then(r => r.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000  // 10 minutes
  });
}

export function useStartLesson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (lessonId) => 
      fetch(`/api/lessons/${lessonId}/start`, { method: 'POST' }),
    onSuccess: (data, lessonId) => {
      // Optimistically update the cache
      queryClient.setQueryData(['course', courseId], (old) => {
        // Update lesson status to 'in-progress'
        return updateLessonStatus(old, lessonId, 'in-progress');
      });
    }
  });
}
```

**Option 2: Context API (Simpler)**
```jsx
// contexts/LessonsContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';

const LessonsContext = createContext();

export function LessonsProvider({ children, courseId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/courses/${courseId}/lessons`);
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    load();
  }, [courseId]);
  
  return (
    <LessonsContext.Provider value={{ data, loading }}>
      {children}
    </LessonsContext.Provider>
  );
}

export const useLessons = () => useContext(LessonsContext);
```

---

### RTL Configuration

**Tailwind Config:**
```javascript
// tailwind.config.js

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EBF5FF',
          // ... (full palette from design system)
        },
        // ... other colors
      },
      fontFamily: {
        sans: ['Cairo', 'Tajawal', 'sans-serif'],
      }
    }
  },
  plugins: []
}
```

**Global CSS:**
```css
/* globals.css */

@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');

* {
  direction: rtl;
}

html {
  font-family: 'Cairo', sans-serif;
}

/* Override for numbers and English content */
[dir="ltr"] {
  direction: ltr;
}

/* Flip icons in RTL */
.flip-rtl {
  transform: scaleX(-1);
}
```

---

### Performance Optimization

**1. Code Splitting**
```jsx
import { lazy, Suspense } from 'react';

const LessonsListPage = lazy(() => import('./pages/LessonsListPage'));

<Suspense fallback={<LoadingSkeleton />}>
  <LessonsListPage />
</Suspense>
```

**2. Image Optimization**
```jsx
// Use Next.js Image component if using Next.js
import Image from 'next/image';

<Image
  src="/lesson-thumbnail.jpg"
  alt="Lesson thumbnail"
  width={300}
  height={200}
  loading="lazy"
  quality={85}
/>
```

**3. Memoization**
```jsx
import { memo, useMemo } from 'react';

// Memoize expensive filtering
const filteredUnits = useMemo(() => {
  return filterAndSearchUnits(units, filterStatus, searchQuery);
}, [units, filterStatus, searchQuery]);

// Memoize components that don't change often
export const LessonCard = memo(LessonCardComponent);
```

**4. Debounce Search**
```jsx
import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

// In component:
const [searchInput, setSearchInput] = useState('');
const debouncedSearch = useDebounce(searchInput, 300);

// Use debouncedSearch for filtering
```

---

### Accessibility Implementation

**Keyboard Navigation:**
```jsx
// Card component
<Card
  tabIndex={0}
  onKeyPress={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleLessonClick(lesson);
    }
  }}
  role="button"
  aria-label={`${lesson.title} - ${statusConfig[lesson.status].label}`}
>
  {/* Card content */}
</Card>
```

**Screen Reader Support:**
```jsx
// Progress bar
<div role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
  <Progress value={progress} />
</div>

// Status badge
<Badge aria-label={`حالة الدرس: ${config.label}`}>
  {config.label}
</Badge>

// Search input
<Input
  type="search"
  aria-label="البحث عن درس"
  placeholder="ابحث عن درس..."
/>
```

**Focus Management:**
```jsx
// When filter changes, announce to screen reader
const [filterStatus, setFilterStatus] = useState('all');
const announcerRef = useRef(null);

useEffect(() => {
  if (announcerRef.current) {
    announcerRef.current.textContent = `عرض ${filterLabels[filterStatus]}`;
  }
}, [filterStatus]);

return (
  <>
    <div 
      ref={announcerRef} 
      className="sr-only" 
      role="status" 
      aria-live="polite"
    />
    {/* Rest of component */}
  </>
);
```

---

## Quality Assurance Checklist

### Before Deployment

#### Functionality
- [ ] Hero section displays correct course data
- [ ] Progress bars update in real-time
- [ ] All filter tabs work correctly
- [ ] Search filters lessons accurately
- [ ] Lesson cards display correct status
- [ ] Clicking cards navigates (except locked)
- [ ] Unit headers collapse/expand
- [ ] Loading states show while fetching data
- [ ] Empty states display when no results
- [ ] Error states handle API failures gracefully

#### Visual Design
- [ ] Colors match design system exactly
- [ ] Typography is consistent and readable
- [ ] Spacing follows design tokens
- [ ] Icons are correctly sized and aligned
- [ ] Shadows and borders are subtle
- [ ] Hover states provide clear feedback
- [ ] Focus states are highly visible
- [ ] Arabic text renders with proper spacing

#### Responsiveness
- [ ] Test on 375px width (iPhone SE)
- [ ] Test on 768px width (iPad)
- [ ] Test on 1024px width (laptop)
- [ ] Test on 1920px width (desktop)
- [ ] Cards stack properly on mobile (1 column)
- [ ] Hero stats stack on mobile
- [ ] Search bar is full-width on mobile
- [ ] No horizontal overflow at any size
- [ ] Touch targets are 44x44px minimum

#### Browser Compatibility
- [ ] Chrome (latest version)
- [ ] Firefox (latest version)
- [ ] Safari (latest version)
- [ ] Edge (latest version)
- [ ] Mobile Safari (iOS 15+)
- [ ] Chrome Mobile (Android 11+)

#### RTL & Arabic
- [ ] All text flows right-to-left
- [ ] Icons flip correctly (arrows, chevrons)
- [ ] Numbers display left-to-right (with dir="ltr")
- [ ] Mixed content (Arabic + English) renders correctly
- [ ] Line breaks don't split words awkwardly
- [ ] Arabic typography has proper line-height

#### Performance
- [ ] Lighthouse Performance score >90
- [ ] First Contentful Paint <1.5s
- [ ] Time to Interactive <3s
- [ ] Total bundle size <300KB (gzipped)
- [ ] Images are optimized (WebP, lazy-loaded)
- [ ] No layout shift (CLS <0.1)
- [ ] Smooth animations (60fps)

#### Accessibility (WCAG 2.1 AA)
- [ ] All interactive elements keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators clearly visible
- [ ] Screen reader announces all content correctly
- [ ] Color contrast ratio ≥4.5:1 for text
- [ ] Color contrast ratio ≥3:1 for large text
- [ ] No reliance on color alone for meaning
- [ ] Alt text on all images
- [ ] Proper heading hierarchy (h1→h2→h3)
- [ ] Form inputs have associated labels
- [ ] ARIA labels where needed
- [ ] Live regions announce dynamic changes

#### Data & State
- [ ] API calls use correct endpoints
- [ ] Error handling covers all edge cases
- [ ] Loading states prevent user confusion
- [ ] Optimistic updates feel instant
- [ ] Data caching reduces redundant requests
- [ ] Filters persist in URL (optional)
- [ ] No console errors or warnings

---

## Appendix: Reference Materials

### Design Inspiration

**Similar Learning Platforms:**
- **Duolingo:** Gamification, progress visualization
- **Khan Academy:** Clean card-based lessons
- **Coursera:** Unit grouping, clear status indicators
- **Udemy:** Filter tabs, search functionality

**Design Systems:**
- [Material Design 3](https://m3.material.io/)
- [Tailwind UI](https://tailwindui.com/)
- [Radix UI](https://www.radix-ui.com/)

---

### Color Palette Quick Reference
```css
/* Primary (Brand Blue) */
--primary-50: #EBF5FF;
--primary-500: #2563EB;
--primary-700: #1E40AF;

/* Success (Green - Completed) */
--success-50: #ECFDF5;
--success-500: #10B981;

/* Warning (Yellow - In Progress) */
--warning-50: #FFFBEB;
--warning-500: #F59E0B;

/* Info (Blue - Not Started) */
--info-50: #EFF6FF;
--info-500: #3B82F6;

/* Error (Red - Locked/Error) */
--error-50: #FEF2F2;
--error-500: #EF4444;

/* Neutral (Grays) */
--neutral-50: #F9FAFB;
--neutral-900: #111827;
```

---

### Useful Commands
```bash
# Development
npm run dev

# Build for production
npm run build

# Type checking (if using TypeScript)
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Accessibility audit
npm run a11y

# Performance audit
npm run lighthouse

# Run all tests
npm test

# Storybook (if using)
npm run storybook
```

---

### Dependencies to Install
```bash
# Core UI Components
npm install @radix-ui/react-tabs @radix-ui/react-progress
npx shadcn-ui@latest add button card badge input tabs progress

# Icons
npm install lucide-react

# State Management (choose one)
npm install @tanstack/react-query  # Option 1: React Query
# OR
# Use Context API (no install needed)  # Option 2: Context

# Utilities
npm install clsx tailwind-merge
npm install date-fns  # If you need date formatting

# Animation (optional)
npm install framer-motion
```

---

### Team Contacts

**For Questions:**
- **Frontend Lead:** [Name] - [Email]
- **Backend API:** [Name] - [Email]
- **UX Designer:** [Name] - [Email]
- **QA Lead:** [Name] - [Email]

**Communication:**
- Daily standups: 10:00 AM (review progress)
- Weekly design reviews: Thursdays 2:00 PM
- Bi-weekly user testing: Every other Friday
- Slack channel: #madrasti-frontend

---

## Final Notes

### Key Takeaways

1. **We're not building a table, we're building a learning journey**
   - Cards > Rows
   - Visual progress > Raw numbers
   - Motivation > Information

2. **Mobile is not an afterthought**
   - 70% of students use phones
   - Design mobile-first, enhance for desktop
   - Test on real devices

3. **Status clarity is everything**
   - Color-coded (not all yellow)
   - Icons reinforce meaning
   - Clear next action

4. **Performance matters**
   - Students have limited data/slow connections
   - Optimize images, lazy load, code split
   - Target: <3s to interactive

5. **Accessibility is non-negotiable**
   - Keyboard navigation required
   - Screen reader support required
   - WCAG AA minimum

---

### Success Criteria Summary

After implementation, this page should:
- ✅ Load in <3 seconds
- ✅ Work perfectly on mobile (375px+)
- ✅ Clearly show lesson status at a glance
- ✅ Make "next step" obvious
- ✅ Feel engaging (not administrative)
- ✅ Pass WCAG 2.1 AA
- ✅ Increase lesson completion by 35%+

---

**Good luck, team! This redesign will transform how students experience learning. Every detail matters—let's make it great.** 🚀

---

**Document Version:** 1.0  
**Last Updated:** December 26, 2024  
**Next Review:** After Phase 3 completion