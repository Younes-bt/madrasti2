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
  ChevronRight
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
        {
          key: 'users',
          icon: Users,
          label: t('admin.userManagement'),
          tooltip: t('admin.userManagement'),
          items: [
            { key: 'users-list', label: t('admin.usersFound'), path: ROUTES.ADMIN.USERS },
            { key: 'users-create', label: t('admin.createUser'), path: '/admin/users/create' },
          ]
        },
        {
          key: 'school',
          icon: GraduationCap,
          label: t('admin.schoolStatistics'),
          tooltip: t('admin.schoolStatistics'),
          items: [
            { key: 'school-config', label: t('admin.settings'), path: ROUTES.ADMIN.SCHOOLS },
            { key: 'classes', label: t('admin.classes'), path: '/admin/classes' },
            { key: 'subjects', label: t('homework.subject'), path: '/admin/subjects' },
          ]
        },
        {
          key: 'reports',
          icon: BarChart3,
          label: t('admin.viewReports'),
          tooltip: t('admin.viewReports'),
          path: ROUTES.ADMIN.REPORTS,
        },
        {
          key: 'settings',
          icon: Settings,
          label: t('admin.systemSettings'),
          tooltip: t('admin.systemSettings'),
          path: ROUTES.ADMIN.SETTINGS,
        }
      ],

      [USER_ROLES.TEACHER]: [
        {
          key: 'lessons',
          icon: BookOpen,
          label: t('navigation.lessons'),
          tooltip: t('navigation.lessons'),
          items: [
            { key: 'lessons-list', label: t('teacher.myClasses'), path: ROUTES.LESSONS.LIST },
            { key: 'lessons-create', label: t('lessons.createLesson'), path: ROUTES.LESSONS.CREATE },
          ]
        },
        {
          key: 'homework',
          icon: ClipboardList,
          label: t('navigation.homework'),
          tooltip: t('navigation.homework'),
          items: [
            { key: 'homework-list', label: t('assignments.assignments'), path: ROUTES.HOMEWORK.LIST },
            { key: 'homework-create', label: t('homework.createAssignment'), path: ROUTES.HOMEWORK.CREATE },
            { key: 'homework-grades', label: t('teacher.pendingGrading'), path: ROUTES.HOMEWORK.GRADES },
          ]
        },
        {
          key: 'attendance',
          icon: UserCheck,
          label: t('navigation.attendance'),
          tooltip: t('navigation.attendance'),
          items: [
            { key: 'attendance-today', label: t('time.today'), path: ROUTES.ATTENDANCE.LIST },
            { key: 'attendance-reports', label: t('navigation.reports'), path: ROUTES.ATTENDANCE.REPORTS },
          ]
        },
        {
          key: 'students',
          icon: Users,
          label: t('navigation.students'),
          tooltip: t('navigation.students'),
          path: '/teacher/students',
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
          label: 'My Routes',
          tooltip: 'My Routes',
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