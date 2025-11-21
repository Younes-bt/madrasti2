"use client"

import React, { useEffect, useState, useMemo } from 'react'
import {
  Home,
  Users,
  BookOpen,
  Calendar,
  ClipboardList,
  Award,
  Settings,
  BarChart3,
  GraduationCap,
  UserCheck,
  FileText,
  Bell,
  Shield,
  Car,
  ChevronDown,
  ChevronRight,
  Building2,
  UserCog,
  School,
  Calendar1,
  BookText,
  PenTool,
  ClipboardCheck,
  MessageSquare,
  Mail,
  AlertTriangle,
  Cog,
  Key,
  HardDrive,
  Network,
  Layers,
  Users2,
  CarFront,
  Monitor,
  Target,
  Sparkles,
  LogOut,
  DollarSign
} from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../contexts/AuthContext'
import { USER_ROLES, ROUTES } from '../../utils/constants'
import { apiMethods } from '../../services/api'
import { NavMain } from '../../components/nav-main'
import { NavUser } from '../../components/nav-user'
import { TeamSwitcher } from '../../components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar"

export function AppSidebar({ onNavigate, currentPath, ...props }) {
  const { t, currentLanguage } = useLanguage()
  const { user } = useAuth()
  const [studentWallet, setStudentWallet] = useState(null)

  // Load student wallet for STUDENT role to show total points in header
  useEffect(() => {
    const loadWallet = async () => {
      try {
        if (user?.role === USER_ROLES.STUDENT) {
          const data = await apiMethods.get('homework/student-wallets/my_wallet/')
          setStudentWallet(data || null)
        } else {
          setStudentWallet(null)
        }
      } catch {
        // Non-blocking: silently ignore if wallet endpoint not available
        setStudentWallet(null)
      }
    }
    loadWallet()
  }, [user])

  // Navigation items configuration based on user roles
  const navigationItems = useMemo(() => {
    const userRole = user?.role
    const baseItems = [
      {
        key: 'dashboard',
        icon: Home,
        label: t('common.dashboard'),
        path: userRole ? `/dashboard/${userRole.toLowerCase()}` : '/',
        tooltip: t('common.dashboard')
      }
    ]

    const roleSpecificItems = {
      [USER_ROLES.ADMIN]: [
        // 🏫 My School Management
        {
          key: 'school-management',
          icon: Building2,
          label: t('adminSidebar.schoolManagement.title'),
          tooltip: t('adminSidebar.schoolManagement.tooltip'),
          items: [
            { key: 'school-details', label: t('adminSidebar.schoolManagement.schoolDetails'), path: '/admin/school-management/school-details' },
            { key: 'team-staff', label: t('adminSidebar.schoolManagement.teamStaff'), path: '/admin/school-management/staff' },
            { key: 'teachers', label: t('adminSidebar.schoolManagement.teachers'), path: '/admin/school-management/teachers' },
            { key: 'students', label: t('adminSidebar.schoolManagement.students'), path: '/admin/school-management/students' },
            { key: 'parents', label: t('adminSidebar.schoolManagement.parents'), path: '/admin/school-management/parents' },
            { key: 'rooms', label: t('adminSidebar.schoolManagement.rooms'), path: '/admin/school-management/rooms' },
            { key: 'vehicles', label: t('adminSidebar.schoolManagement.vehicles'), path: '/admin/school-management/vehicles' },
            { key: 'equipment', label: t('adminSidebar.schoolManagement.equipment'), path: '/admin/school-management/equipment' },
          ]
        },
        // 🎓 Academic Management
        {
          key: 'academic-management',
          icon: GraduationCap,
          label: t('adminSidebar.academicManagement.title'),
          tooltip: t('adminSidebar.academicManagement.tooltip'),
          items: [
            { key: 'academic-years', label: t('adminSidebar.academicManagement.academicYears'), path: '/admin/academic-management/academic-years' },
            { key: 'educational-levels', label: t('adminSidebar.academicManagement.educationalLevels'), path: '/admin/academic-management/educational-levels' },
            { key: 'grades', label: t('adminSidebar.academicManagement.grades'), path: '/admin/academic-management/grades' },
            { key: 'tracks', label: t('adminSidebar.academicManagement.tracks'), path: '/admin/academic-management/tracks' },
            { key: 'classes', label: t('adminSidebar.academicManagement.classes'), path: '/admin/academic-management/classes' },
            { key: 'subjects', label: t('adminSidebar.academicManagement.subjects'), path: '/admin/academic-management/subjects' },
            { key: 'timetables', label: t('adminSidebar.academicManagement.timetables'), path: '/admin/academic-management/timetables' },
          ]
        },
        // 📚 Education Management
        {
          key: 'education-management',
          icon: BookOpen,
          label: t('adminSidebar.educationManagement.title'),
          tooltip: t('adminSidebar.educationManagement.tooltip'),
          items: [
            { key: 'lessons-courses', label: t('adminSidebar.educationManagement.lessonsCourses'), path: '/admin/education-management/lessons' },
            { key: 'exercises', label: t('adminSidebar.educationManagement.exercises'), path: '/admin/education-management/exercises' },
            { key: 'assignments', label: t('adminSidebar.educationManagement.assignments'), path: '/admin/education-management/assignments' },
            { key: 'homework', label: t('adminSidebar.educationManagement.homework'), path: '/admin/education-management/homework' },
            { key: 'exams', label: t('adminSidebar.educationManagement.exams'), path: '/admin/education-management/exams' },
            { key: 'grading-system', label: t('adminSidebar.educationManagement.gradingSystem'), path: '/admin/education-management/grading-system' },
          ]
        },
        // 📊 Reports & Analytics
        {
          key: 'reports-analytics',
          icon: BarChart3,
          label: t('adminSidebar.reportsAnalytics.title'),
          tooltip: t('adminSidebar.reportsAnalytics.tooltip'),
          items: [
            { key: 'attendance-reports', label: t('adminSidebar.reportsAnalytics.attendanceReports'), path: '/admin/reports/attendance' },
            { key: 'academic-performance', label: t('adminSidebar.reportsAnalytics.academicPerformance'), path: '/admin/reports/academic-performance' },
            { key: 'financial-reports', label: t('adminSidebar.reportsAnalytics.financialReports'), path: '/admin/reports/financial' },
            { key: 'custom-report-builder', label: t('adminSidebar.reportsAnalytics.customReportBuilder'), path: '/admin/reports/custom-builder' },
            { key: 'comparative-analysis', label: t('adminSidebar.reportsAnalytics.comparativeAnalysis'), path: '/admin/reports/comparative-analysis' },
          ]
        },
        // 💰 Finance Management
        {
          key: 'finance',
          icon: DollarSign,
          label: 'Finance',
          tooltip: 'Manage fees, invoices, and payments',
          items: [
            { key: 'fee-setup', label: 'Fee Setup', path: '/admin/finance/setup' },
            { key: 'invoices', label: 'Invoices', path: '/admin/finance/invoices' },
            { key: 'payments', label: 'Payments', path: '/admin/finance/payments' },
          ]
        },
        // 📢 Communications & Notifications
        {
          key: 'communications',
          icon: MessageSquare,
          label: t('adminSidebar.communications.title'),
          tooltip: t('adminSidebar.communications.tooltip'),
          items: [
            { key: 'messages', label: 'Messages', path: '/messages' },
            { key: 'announcements', label: 'Announcements', path: '/announcements' },
            { key: 'email-templates', label: t('adminSidebar.communications.emailTemplates'), path: '/admin/communications/email-templates' },
            { key: 'parent-notifications', label: t('adminSidebar.communications.parentNotifications'), path: '/admin/communications/parent-notifications' },
            { key: 'emergency-alerts', label: t('adminSidebar.communications.emergencyAlerts'), path: '/admin/communications/emergency-alerts' },
          ]
        },
        // ⚙️ System Settings
        {
          key: 'system-settings',
          icon: Settings,
          label: t('adminSidebar.systemSettings.title'),
          tooltip: t('adminSidebar.systemSettings.tooltip'),
          items: [
            { key: 'general-settings', label: t('adminSidebar.systemSettings.generalSettings'), path: '/admin/settings/general' },
            { key: 'user-permissions', label: t('adminSidebar.systemSettings.userPermissions'), path: '/admin/settings/permissions' },
            { key: 'integration-settings', label: t('adminSidebar.systemSettings.integrationSettings'), path: '/admin/settings/integrations' },
            { key: 'backup-restore', label: t('adminSidebar.systemSettings.backupRestore'), path: '/admin/settings/backup-restore' },
          ]
        }
      ],

      [USER_ROLES.TEACHER]: [
        // 👨‍🏫 My Teaching Profile
        {
          key: 'teacher-profile',
          icon: UserCog,
          label: t('teacherSidebar.profile.title'),
          tooltip: t('teacherSidebar.profile.tooltip'),
          items: [
            { key: 'profile-overview', label: t('teacherSidebar.profile.overview'), path: '/teacher/profile/overview' },
            { key: 'my-classes', label: t('teacherSidebar.profile.myClasses'), path: '/teacher/profile/my-classes' },
            { key: 'my-schedule', label: t('teacherSidebar.profile.mySchedule'), path: '/teacher/profile/my-schedule' },
          ]
        },
        // 📚 Lessons & Content
        {
          key: 'lessons-content',
          icon: BookOpen,
          label: t('teacherSidebar.lessonsContent.title'),
          tooltip: t('teacherSidebar.lessonsContent.tooltip'),
          items: [
            { key: 'lessons', label: t('teacherSidebar.lessonsContent.lessons'), path: '/teacher/content/lessons' },
            { key: 'lesson-exercises', label: t('teacherSidebar.lessonsContent.lessonExercises'), path: '/teacher/content/lesson-exercises' },
            { key: 'materials', label: t('teacherSidebar.lessonsContent.materials'), path: '/teacher/content/materials' },
            { key: 'media-library', label: t('teacherSidebar.lessonsContent.mediaLibrary'), path: '/teacher/content/media-library' },
            { key: 'templates', label: t('teacherSidebar.lessonsContent.templates'), path: '/teacher/content/templates' },
          ]
        },
        // 📝 Assignments & Assessment (Mandatory)
        {
          key: 'assignments-assessment',
          icon: ClipboardCheck,
          label: t('teacherSidebar.assignments.title'),
          tooltip: t('teacherSidebar.assignments.tooltip'),
          items: [
            { key: 'homework', label: t('teacherSidebar.assignments.homework'), path: '/teacher/assignments/homework' },
            { key: 'exams', label: t('teacherSidebar.assignments.exams'), path: '/teacher/assignments/exams' },
            { key: 'grading', label: t('teacherSidebar.assignments.grading'), path: '/teacher/assignments/grading' },
            { key: 'assessment-tools', label: t('teacherSidebar.assignments.assessmentTools'), path: '/teacher/assignments/assessment-tools' },
          ]
        },
        // 👥 Student Management
        {
          key: 'student-management',
          icon: Users,
          label: t('teacherSidebar.students.title'),
          tooltip: t('teacherSidebar.students.tooltip'),
          items: [
            { key: 'my-students', label: t('teacherSidebar.students.myStudents'), path: '/teacher/students/my-students' },
            { key: 'attendance', label: t('teacherSidebar.students.attendance'), path: '/teacher/attendance' },
            { key: 'attendance-history', label: t('teacherSidebar.students.attendanceHistory'), path: '/teacher/attendance/history' },
            { key: 'progress', label: t('teacherSidebar.students.progress'), path: '/teacher/students/progress' },
            { key: 'parent-communication', label: t('teacherSidebar.students.parentCommunication'), path: '/teacher/students/parent-communication' },
          ]
        },
        // 📊 Teaching Analytics
        {
          key: 'teaching-analytics',
          icon: BarChart3,
          label: t('teacherSidebar.analytics.title'),
          tooltip: t('teacherSidebar.analytics.tooltip'),
          items: [
            { key: 'class-performance', label: t('teacherSidebar.analytics.classPerformance'), path: '/teacher/analytics/class-performance' },
            { key: 'student-analytics', label: t('teacherSidebar.analytics.studentAnalytics'), path: '/teacher/analytics/student-analytics' },
            { key: 'assignment-stats', label: t('teacherSidebar.analytics.assignmentStats'), path: '/teacher/analytics/assignment-stats' },
            { key: 'reports', label: t('teacherSidebar.analytics.reports'), path: '/teacher/analytics/reports' },
          ]
        },
        // 📅 Planning & Organization
        {
          key: 'planning-organization',
          icon: Calendar1,
          label: t('teacherSidebar.planning.title'),
          tooltip: t('teacherSidebar.planning.tooltip'),
          items: [
            { key: 'lesson-planner', label: t('teacherSidebar.planning.lessonPlanner'), path: '/teacher/planning/lesson-planner' },
            { key: 'calendar', label: t('teacherSidebar.planning.calendar'), path: '/teacher/planning/calendar' },
            { key: 'tasks', label: t('teacherSidebar.planning.tasks'), path: '/teacher/planning/tasks' },
            { key: 'resources', label: t('teacherSidebar.planning.resources'), path: '/teacher/planning/resources' },
          ]
        },
        // 💬 Communication Hub
        {
          key: 'communication-hub',
          icon: MessageSquare,
          label: t('teacherSidebar.communication.title'),
          tooltip: t('teacherSidebar.communication.tooltip'),
          items: [
            { key: 'announcements', label: t('teacherSidebar.communication.announcements'), path: '/teacher/communication/announcements' },
            { key: 'messages', label: t('teacherSidebar.communication.messages'), path: '/teacher/communication/messages' },
            { key: 'forums', label: t('teacherSidebar.communication.forums'), path: '/teacher/communication/forums' },
            { key: 'notifications', label: t('teacherSidebar.communication.notifications'), path: '/teacher/communication/notifications' },
          ]
        }
      ],

      [USER_ROLES.STUDENT]: [
        // 👤 My Profile
        {
          key: 'student-profile',
          icon: UserCog,
          label: t('studentSidebar.profile.title'),
          tooltip: t('studentSidebar.profile.tooltip'),
          items: [
            { key: 'profile-overview', label: t('studentSidebar.profile.overview'), path: '/student/profile/overview' },
            { key: 'profile-settings', label: t('studentSidebar.profile.settings'), path: '/student/profile/settings' },
          ]
        },
        // 📅 My Timetable
        {
          key: 'timetable',
          icon: Calendar1,
          label: t('studentSidebar.timetable.title'),
          tooltip: t('studentSidebar.timetable.tooltip'),
          path: '/student/timetable',
        },
        // 📊 My Attendance
        {
          key: 'attendance',
          icon: UserCheck,
          label: t('studentSidebar.attendance.title'),
          tooltip: t('studentSidebar.attendance.tooltip'),
          items: [
            { key: 'attendance-report', label: t('studentSidebar.attendance.myReport'), path: '/student/attendance/report' },
            { key: 'attendance-history', label: t('studentSidebar.attendance.history'), path: '/student/attendance/history' },
          ]
        },
        // 📚 My Lessons
        {
          key: 'lessons',
          icon: BookOpen,
          label: t('studentSidebar.lessons.title'),
          tooltip: t('studentSidebar.lessons.tooltip'),
          items: [
            { key: 'all-lessons', label: t('studentSidebar.lessons.allLessons'), path: ROUTES.LESSONS.LIST },
            { key: 'my-subjects', label: t('studentSidebar.lessons.mySubjects'), path: '/student/lessons/subjects' },
            { key: 'favorites', label: t('studentSidebar.lessons.favorites'), path: '/student/lessons/favorites' },
          ]
        },
        // ✏️ My Exercises & Practice
        {
          key: 'exercises',
          icon: PenTool,
          label: t('studentSidebar.exercises.title'),
          tooltip: t('studentSidebar.exercises.tooltip'),
          items: [
            { key: 'all-exercises', label: t('studentSidebar.exercises.allExercises'), path: ROUTES.STUDENT_EXERCISES.LIST },
            { key: 'practice-mode', label: t('studentSidebar.exercises.practiceMode'), path: ROUTES.STUDENT_EXERCISES.PRACTICE },
            { key: 'my-progress', label: t('studentSidebar.exercises.myProgress'), path: ROUTES.STUDENT_EXERCISES.PROGRESS },
          ]
        },
        // 📝 My Homework & Assignments
        {
          key: 'homework',
          icon: ClipboardCheck,
          label: t('studentSidebar.homework.title'),
          tooltip: t('studentSidebar.homework.tooltip'),
          items: [
            { key: 'homework-pending', label: t('studentSidebar.homework.pending'), path: ROUTES.STUDENT_HOMEWORK.PENDING },
            { key: 'homework-completed', label: t('studentSidebar.homework.completed'), path: ROUTES.STUDENT_HOMEWORK.COMPLETED },
            { key: 'homework-grades', label: t('studentSidebar.homework.grades'), path: ROUTES.STUDENT_HOMEWORK.GRADES },
            { key: 'homework-feedback', label: t('studentSidebar.homework.feedback'), path: ROUTES.STUDENT_HOMEWORK.FEEDBACK },
          ]
        },
        // 🏆 Achievements & Rewards
        {
          key: 'achievements',
          icon: Award,
          label: t('studentSidebar.achievements.title'),
          tooltip: t('studentSidebar.achievements.tooltip'),
          items: [
            { key: 'my-badges', label: t('studentSidebar.achievements.myBadges'), path: '/student/achievements/badges' },
            { key: 'leaderboard', label: t('studentSidebar.achievements.leaderboard'), path: ROUTES.HOMEWORK.LEADERBOARD },
            { key: 'my-points', label: t('studentSidebar.achievements.myPoints'), path: ROUTES.STUDENT_ACHIEVEMENTS.MY_POINTS },
            { key: 'my-rank', label: t('studentSidebar.achievements.myRank'), path: '/student/achievements/rank' },
          ]
        },
        // 📈 My Performance
        {
          key: 'performance',
          icon: BarChart3,
          label: t('studentSidebar.performance.title'),
          tooltip: t('studentSidebar.performance.tooltip'),
          items: [
            { key: 'performance-overview', label: t('studentSidebar.performance.overview'), path: '/student/performance/overview' },
            { key: 'subject-performance', label: t('studentSidebar.performance.bySubject'), path: '/student/performance/subjects' },
            { key: 'progress-report', label: t('studentSidebar.performance.progressReport'), path: '/student/performance/reports' },
          ]
        }
      ],

      [USER_ROLES.PARENT]: [
        {
          key: 'children',
          icon: Users,
          label: t('parent.children'),
          tooltip: t('parent.children'),
          path: '/parent/children',
        },
        {
          key: 'finance',
          icon: DollarSign,
          label: 'Financial Status',
          tooltip: 'View invoices and payments',
          path: '/parent/finance',
        },
        {
          key: 'attendance',
          icon: UserCheck,
          label: t('navigation.attendance'),
          tooltip: t('navigation.attendance'),
          items: [
            { key: 'attendance-overview', label: t('misc.todayOverview'), path: ROUTES.ATTENDANCE.LIST },
            { key: 'absence-flags', label: t('attendance.chronic'), path: ROUTES.ATTENDANCE.FLAGS, badge: 2 },
          ]
        },
        {
          key: 'homework',
          icon: ClipboardList,
          label: t('navigation.homework'),
          tooltip: t('navigation.homework'),
          path: ROUTES.HOMEWORK.LIST,
        },
        {
          key: 'communication',
          icon: MessageSquare,
          label: 'Communication',
          tooltip: 'Messages and announcements',
          items: [
            { key: 'messages', label: 'Messages', path: '/messages' },
            { key: 'announcements', label: 'Announcements', path: '/announcements' },
          ]
        },
        {
          key: 'notifications',
          icon: Bell,
          label: t('common.notifications'),
          tooltip: t('common.notifications'),
          path: '/parent/notifications',
          badge: 5
        }
      ],

      [USER_ROLES.STAFF]: [
        {
          key: 'attendance',
          icon: UserCheck,
          label: t('attendance.title'),
          tooltip: t('attendance.title'),
          items: [
            { key: 'attendance-sessions', label: t('misc.sessionsAttended'), path: ROUTES.ATTENDANCE.LIST },
            { key: 'absence-flags', label: t('attendance.chronic'), path: ROUTES.ATTENDANCE.FLAGS },
            { key: 'attendance-reports', label: t('navigation.reports'), path: ROUTES.ATTENDANCE.REPORTS },
          ]
        },
        {
          key: 'students',
          icon: GraduationCap,
          label: t('navigation.students'),
          tooltip: t('navigation.students'),
          path: '/staff/students',
        },
        {
          key: 'reports',
          icon: FileText,
          label: t('navigation.reports'),
          tooltip: t('navigation.reports'),
          path: '/staff/reports',
        }
      ],

      [USER_ROLES.DRIVER]: [
        {
          key: 'routes',
          icon: Car,
          label: t('navigation.routes'),
          tooltip: t('navigation.routes'),
          path: '/driver/routes',
        },
        {
          key: 'students',
          icon: Users,
          label: t('navigation.students'),
          tooltip: t('navigation.students'),
          path: '/driver/students',
        }
      ]
    }

    return [
      ...baseItems,
      ...(roleSpecificItems[userRole] || [])
    ]
  }, [user, t])

  // Transform items for NavMain
  const navMainItems = useMemo(() => {
    return navigationItems.map(item => ({
      title: item.label,
      url: item.path,
      icon: item.icon,
      isActive: item.key === 'dashboard',
      items: item.items?.map(sub => ({
        title: sub.label,
        url: sub.path
      }))
    }))
  }, [navigationItems])

  const teamData = [
    {
      name: user?.school_info?.name || "Madrasti",
      logo: School,
      plan: user?.role || "Admin"
    }
  ]

  const userData = {
    name: user?.name || "User",
    email: user?.email || "",
    avatar: user?.avatar || ""
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teamData} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} label={t('sidebar.menu', 'Menu')} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

