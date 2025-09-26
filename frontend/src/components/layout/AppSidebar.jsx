"use client"

import React, { useState } from 'react'
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
  Target
} from 'lucide-react'
import { Badge } from '../ui/badge'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../contexts/AuthContext'
import { USER_ROLES, ROUTES } from '../../utils/constants'
import { permissions } from '../../utils/permissions'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuBadge,
  SidebarRail,
} from "../ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"

export function AppSidebar({ onNavigate, currentPath, ...props }) {
  const { t, currentLanguage, isRTL } = useLanguage()
  const { user } = useAuth()
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (key) => {
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Navigation items configuration based on user roles
  const getNavigationItems = () => {
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
        // 📢 Communications & Notifications
        {
          key: 'communications',
          icon: MessageSquare,
          label: t('adminSidebar.communications.title'),
          tooltip: t('adminSidebar.communications.tooltip'),
          items: [
            { key: 'announcements', label: t('adminSidebar.communications.announcements'), path: '/admin/communications/announcements' },
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
            { key: 'attendance', label: t('teacherSidebar.students.attendance'), path: '/teacher/students/attendance' },
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
        {
          key: 'lessons',
          icon: BookOpen,
          label: t('navigation.lessons'),
          tooltip: t('navigation.lessons'),
          path: ROUTES.LESSONS.LIST,
        },
        {
          key: 'exercises',
          icon: Target,
          label: t('navigation.exercises'),
          tooltip: t('navigation.practiceExercises'),
          path: '/exercises',
        },
        {
          key: 'homework',
          icon: ClipboardList,
          label: t('navigation.homework'),
          tooltip: t('navigation.homework'),
          items: [
            { key: 'homework-pending', label: t('status.pending'), path: ROUTES.HOMEWORK.LIST, badge: 3 },
            { key: 'homework-completed', label: t('status.completed'), path: '/homework/completed' },
            { key: 'homework-grades', label: t('assignments.score'), path: ROUTES.HOMEWORK.GRADES },
          ]
        },
        {
          key: 'attendance',
          icon: Calendar,
          label: t('navigation.attendance'),
          tooltip: t('navigation.attendance'),
          path: ROUTES.ATTENDANCE.LIST,
        },
        {
          key: 'rewards',
          icon: Award,
          label: t('gamification.achievements'),
          tooltip: t('gamification.achievements'),
          items: [
            { key: 'badges', label: t('gamification.badges'), path: '/rewards/badges' },
            { key: 'leaderboard', label: t('gamification.leaderboard'), path: ROUTES.HOMEWORK.LEADERBOARD },
            { key: 'points', label: t('gamification.points'), path: '/rewards/points' },
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

    console.log('teacherSidebar.profile.title:', t('teacherSidebar.profile.title'));
    return [
      ...baseItems,
      ...(roleSpecificItems[userRole] || [])
    ]
  }

  const navigationItems = getNavigationItems()

  const handleNavigation = (path) => {
    if (onNavigate) {
      onNavigate(path)
    }
  }

  const renderNavItem = (item) => {
    const hasChildren = item.items && item.items.length > 0
    const isOpen = openItems[item.key]
    const isActive = item.path === currentPath || 
                    (hasChildren && item.items?.some(child => child.path === currentPath))
    
    if (hasChildren) {
      return (
        <Collapsible
          key={item.key}
          open={isOpen}
          onOpenChange={() => toggleItem(item.key)}
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip={item.tooltip}
                isActive={isActive}
                className="cursor-pointer"
              >
                {item.icon && <item.icon />}
                <span>{item.label}</span>
                <ChevronDown className={`ml-auto transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            {item.badge && (
              <SidebarMenuBadge>
                {item.badge > 9 ? '9+' : item.badge}
              </SidebarMenuBadge>
            )}
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.key}>
                    <SidebarMenuSubButton
                      isActive={subItem.path === currentPath}
                      onClick={() => handleNavigation(subItem.path)}
                      className="cursor-pointer hover:bg-blue-100 hover:text-black"
                    >
                      <span>{subItem.label}</span>
                      {subItem.badge && (
                        <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                          {subItem.badge > 9 ? '9+' : subItem.badge}
                        </Badge>
                      )}
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      )
    }

    return (
      <SidebarMenuItem key={item.key}>
        <SidebarMenuButton
          tooltip={item.tooltip}
          isActive={isActive}
          onClick={() => item.path && handleNavigation(item.path)}
        >
          {item.icon && <item.icon />}
          <span>{item.label}</span>
        </SidebarMenuButton>
        {item.badge && (
          <SidebarMenuBadge>
            {item.badge > 9 ? '9+' : item.badge}
          </SidebarMenuBadge>
        )}
      </SidebarMenuItem>
    )
  }

  const getRoleDisplayName = (role) => {
    const roleNames = {
      [USER_ROLES.ADMIN]: t('roles.admin'),
      [USER_ROLES.TEACHER]: t('roles.teacher'),
      [USER_ROLES.STUDENT]: t('roles.student'),
      [USER_ROLES.PARENT]: t('roles.parent'),
      [USER_ROLES.STAFF]: t('roles.staff'),
      [USER_ROLES.DRIVER]: t('roles.driver'),
    }
    return roleNames[role] || role
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-lg font-bold">M</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Madrasti 2.0</span>
                <span className="truncate text-xs">
                  {user?.role && getRoleDisplayName(user.role)}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => handleNavigation('/profile')}
              tooltip={t('common.settings')}
            >
              <Settings />
              <span>{t('common.settings')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="mt-2 px-2">
          <div className="text-center text-xs text-sidebar-foreground/70">
            <p>Madrasti 2.0 v2.0.0</p>
            <p>© 2025 OpiComTech</p>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}