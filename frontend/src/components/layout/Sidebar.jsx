import React, { useContext, useState } from 'react'
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
  X
} from 'lucide-react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { LanguageContext } from '../../contexts/LanguageContext'
import { USER_ROLES, ROUTES } from '../../utils/constants'
import { permissions } from '../../utils/permissions'
import { cn } from '../../lib/utils'

const Sidebar = ({
  isOpen = false,
  onClose = () => {},
  className,
  currentPath = '/',
  userRole = null,
  onNavigate = () => {},
}) => {
  const { language } = useContext(LanguageContext)
  const [expandedMenus, setExpandedMenus] = useState({})
  const isRTL = language === 'ar'

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }))
  }

  // Navigation items configuration based on user roles
  const getNavigationItems = () => {
    const baseItems = [
      {
        key: 'dashboard',
        icon: Home,
        label: {
          ar: 'لوحة التحكم',
          en: 'Dashboard',
          fr: 'Tableau de bord'
        },
        path: permissions.getUserRole() ? `/dashboard/${permissions.getUserRole().toLowerCase()}` : '/',
        roles: [USER_ROLES.ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT, USER_ROLES.PARENT, USER_ROLES.STAFF, USER_ROLES.DRIVER],
      }
    ]

    const roleSpecificItems = {
      [USER_ROLES.ADMIN]: [
        {
          key: 'users',
          icon: Users,
          label: { ar: 'إدارة المستخدمين', en: 'User Management', fr: 'Gestion des utilisateurs' },
          children: [
            { key: 'users-list', label: { ar: 'قائمة المستخدمين', en: 'Users List', fr: 'Liste des utilisateurs' }, path: ROUTES.ADMIN.USERS },
            { key: 'users-create', label: { ar: 'إضافة مستخدم', en: 'Add User', fr: 'Ajouter utilisateur' }, path: '/admin/users/create' },
          ]
        },
        {
          key: 'school',
          icon: GraduationCap,
          label: { ar: 'إدارة المدرسة', en: 'School Management', fr: 'Gestion de l\'école' },
          children: [
            { key: 'school-config', label: { ar: 'إعدادات المدرسة', en: 'School Settings', fr: 'Paramètres de l\'école' }, path: ROUTES.ADMIN.SCHOOLS },
            { key: 'classes', label: { ar: 'الفصول الدراسية', en: 'Classes', fr: 'Classes' }, path: '/admin/classes' },
            { key: 'subjects', label: { ar: 'المواد الدراسية', en: 'Subjects', fr: 'Matières' }, path: '/admin/subjects' },
          ]
        },
        {
          key: 'reports',
          icon: BarChart3,
          label: { ar: 'التقارير', en: 'Reports', fr: 'Rapports' },
          path: ROUTES.ADMIN.REPORTS,
        },
        {
          key: 'settings',
          icon: Settings,
          label: { ar: 'الإعدادات', en: 'Settings', fr: 'Paramètres' },
          path: ROUTES.ADMIN.SETTINGS,
        }
      ],

      [USER_ROLES.TEACHER]: [
        {
          key: 'lessons',
          icon: BookOpen,
          label: { ar: 'الدروس', en: 'Lessons', fr: 'Cours' },
          children: [
            { key: 'lessons-list', label: { ar: 'قائمة الدروس', en: 'My Lessons', fr: 'Mes cours' }, path: ROUTES.LESSONS.LIST },
            { key: 'lessons-create', label: { ar: 'إنشاء درس', en: 'Create Lesson', fr: 'Créer un cours' }, path: ROUTES.LESSONS.CREATE },
          ]
        },
        {
          key: 'homework',
          icon: ClipboardList,
          label: { ar: 'الواجبات', en: 'Assignments', fr: 'Devoirs' },
          children: [
            { key: 'homework-list', label: { ar: 'قائمة الواجبات', en: 'My Assignments', fr: 'Mes devoirs' }, path: ROUTES.HOMEWORK.LIST },
            { key: 'homework-create', label: { ar: 'إنشاء واجب', en: 'Create Assignment', fr: 'Créer un devoir' }, path: ROUTES.HOMEWORK.CREATE },
            { key: 'homework-grades', label: { ar: 'التصحيح', en: 'Grading', fr: 'Correction' }, path: ROUTES.HOMEWORK.GRADES },
          ]
        },
        {
          key: 'attendance',
          icon: UserCheck,
          label: { ar: 'الحضور والغياب', en: 'Attendance', fr: 'Présence' },
          children: [
            { key: 'attendance-today', label: { ar: 'حصص اليوم', en: 'Today\'s Sessions', fr: 'Séances d\'aujourd\'hui' }, path: ROUTES.ATTENDANCE.LIST },
            { key: 'attendance-reports', label: { ar: 'تقارير الحضور', en: 'Attendance Reports', fr: 'Rapports de présence' }, path: ROUTES.ATTENDANCE.REPORTS },
          ]
        },
        {
          key: 'students',
          icon: Users,
          label: { ar: 'الطلاب', en: 'Students', fr: 'Étudiants' },
          path: '/teacher/students',
        }
      ],

      [USER_ROLES.STUDENT]: [
        {
          key: 'lessons',
          icon: BookOpen,
          label: { ar: 'دروسي', en: 'My Lessons', fr: 'Mes cours' },
          path: ROUTES.LESSONS.LIST,
        },
        {
          key: 'homework',
          icon: ClipboardList,
          label: { ar: 'واجباتي', en: 'My Assignments', fr: 'Mes devoirs' },
          children: [
            { key: 'homework-pending', label: { ar: 'الواجبات المعلقة', en: 'Pending', fr: 'En attente' }, path: ROUTES.HOMEWORK.LIST, badge: 3 },
            { key: 'homework-completed', label: { ar: 'الواجبات المكتملة', en: 'Completed', fr: 'Terminé' }, path: '/homework/completed' },
            { key: 'homework-grades', label: { ar: 'الدرجات', en: 'Grades', fr: 'Notes' }, path: ROUTES.HOMEWORK.GRADES },
          ]
        },
        {
          key: 'attendance',
          icon: Calendar,
          label: { ar: 'حضوري', en: 'My Attendance', fr: 'Ma présence' },
          path: ROUTES.ATTENDANCE.LIST,
        },
        {
          key: 'rewards',
          icon: Award,
          label: { ar: 'إنجازاتي', en: 'My Achievements', fr: 'Mes réussites' },
          children: [
            { key: 'badges', label: { ar: 'الأوسمة', en: 'Badges', fr: 'Badges' }, path: '/rewards/badges' },
            { key: 'leaderboard', label: { ar: 'قائمة المتصدرين', en: 'Leaderboard', fr: 'Classement' }, path: ROUTES.HOMEWORK.LEADERBOARD },
            { key: 'points', label: { ar: 'النقاط', en: 'Points', fr: 'Points' }, path: '/rewards/points' },
          ]
        }
      ],

      [USER_ROLES.PARENT]: [
        {
          key: 'children',
          icon: Users,
          label: { ar: 'أطفالي', en: 'My Children', fr: 'Mes enfants' },
          path: '/parent/children',
        },
        {
          key: 'attendance',
          icon: UserCheck,
          label: { ar: 'الحضور والغياب', en: 'Attendance', fr: 'Présence' },
          children: [
            { key: 'attendance-overview', label: { ar: 'نظرة عامة', en: 'Overview', fr: 'Aperçu' }, path: ROUTES.ATTENDANCE.LIST },
            { key: 'absence-flags', label: { ar: 'علامات الغياب', en: 'Absence Flags', fr: 'Signalements d\'absence' }, path: ROUTES.ATTENDANCE.FLAGS, badge: 2 },
          ]
        },
        {
          key: 'homework',
          icon: ClipboardList,
          label: { ar: 'الواجبات', en: 'Assignments', fr: 'Devoirs' },
          path: ROUTES.HOMEWORK.LIST,
        },
        {
          key: 'notifications',
          icon: Bell,
          label: { ar: 'الإشعارات', en: 'Notifications', fr: 'Notifications' },
          path: '/parent/notifications',
          badge: 5
        }
      ],

      [USER_ROLES.STAFF]: [
        {
          key: 'attendance',
          icon: UserCheck,
          label: { ar: 'إدارة الحضور', en: 'Attendance Management', fr: 'Gestion de présence' },
          children: [
            { key: 'attendance-sessions', label: { ar: 'الجلسات', en: 'Sessions', fr: 'Séances' }, path: ROUTES.ATTENDANCE.LIST },
            { key: 'absence-flags', label: { ar: 'علامات الغياب', en: 'Absence Flags', fr: 'Signalements' }, path: ROUTES.ATTENDANCE.FLAGS },
            { key: 'attendance-reports', label: { ar: 'التقارير', en: 'Reports', fr: 'Rapports' }, path: ROUTES.ATTENDANCE.REPORTS },
          ]
        },
        {
          key: 'students',
          icon: GraduationCap,
          label: { ar: 'الطلاب', en: 'Students', fr: 'Étudiants' },
          path: '/staff/students',
        },
        {
          key: 'reports',
          icon: FileText,
          label: { ar: 'التقارير', en: 'Reports', fr: 'Rapports' },
          path: '/staff/reports',
        }
      ],

      [USER_ROLES.DRIVER]: [
        {
          key: 'routes',
          icon: Car,
          label: { ar: 'مساراتي', en: 'My Routes', fr: 'Mes itinéraires' },
          path: '/driver/routes',
        },
        {
          key: 'students',
          icon: Users,
          label: { ar: 'الطلاب', en: 'Students', fr: 'Étudiants' },
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

  const renderNavItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedMenus[item.key]
    const isActive = item.path === currentPath || 
                    (hasChildren && item.children.some(child => child.path === currentPath))
    
    const Icon = item.icon
    const label = item.label[language] || item.label.en
    const paddingLeft = level === 0 ? 'pl-3' : 'pl-8'
    const paddingRight = level === 0 ? 'pr-3' : 'pr-8'

    return (
      <div key={item.key}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            'w-full justify-between h-auto py-2',
            isRTL ? `${paddingRight} pl-3` : `${paddingLeft} pr-3`,
            isActive && 'bg-accent text-accent-foreground'
          )}
          onClick={() => {
            if (hasChildren) {
              toggleMenu(item.key)
            } else if (item.path) {
              onNavigate(item.path)
            }
          }}
        >
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
            <span className="text-sm font-medium truncate">{label}</span>
            {item.badge && (
              <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-xs">
                {item.badge > 9 ? '9+' : item.badge}
              </Badge>
            )}
          </div>
          {hasChildren && (
            <div className="flex items-center">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className={cn(
                  "h-4 w-4 transition-transform",
                  isRTL && "rotate-180"
                )} />
              )}
            </div>
          )}
        </Button>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children.map(child => (
              <Button
                key={child.key}
                variant={child.path === currentPath ? "secondary" : "ghost"}
                className={cn(
                  'w-full justify-start h-auto py-2',
                  isRTL ? 'pr-12 pl-3' : 'pl-12 pr-3',
                  child.path === currentPath && 'bg-accent text-accent-foreground'
                )}
                onClick={() => {
                  if (child.path) {
                    onNavigate(child.path)
                  }
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm truncate">
                    {child.label[language] || child.label.en}
                  </span>
                  {child.badge && (
                    <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                      {child.badge > 9 ? '9+' : child.badge}
                    </Badge>
                  )}
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed top-0 z-50 flex h-full w-72 flex-col bg-background border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        isRTL && 'right-0 border-l border-r-0',
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold">Madrasti 2.0</h2>
              <p className="text-xs text-muted-foreground">
                {permissions.getUserRole() && 
                  (() => {
                    const roleNames = {
                      [USER_ROLES.ADMIN]: { ar: 'مدير', en: 'Admin', fr: 'Admin' },
                      [USER_ROLES.TEACHER]: { ar: 'أستاذ', en: 'Teacher', fr: 'Professeur' },
                      [USER_ROLES.STUDENT]: { ar: 'طالب', en: 'Student', fr: 'Étudiant' },
                      [USER_ROLES.PARENT]: { ar: 'ولي أمر', en: 'Parent', fr: 'Parent' },
                      [USER_ROLES.STAFF]: { ar: 'موظف', en: 'Staff', fr: 'Personnel' },
                      [USER_ROLES.DRIVER]: { ar: 'سائق', en: 'Driver', fr: 'Chauffeur' },
                    }
                    return roleNames[permissions.getUserRole()]?.[language] || permissions.getUserRole()
                  })()
                }
              </p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden h-8 w-8 p-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {navigationItems.map(item => renderNavItem(item))}
          </nav>

          <Separator className="my-4" />

          {/* Bottom navigation */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => onNavigate(ROUTES.PROFILE)}
            >
              <Settings className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2" />
              <span className="text-sm">
                {language === 'ar' ? 'الإعدادات' :
                 language === 'fr' ? 'Paramètres' :
                 'Settings'}
              </span>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="text-center text-xs text-muted-foreground">
            <p>Madrasti 2.0 v2.0.0</p>
            <p>© 2025 OpiComTech</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar