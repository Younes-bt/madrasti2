"use client"

import React, { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
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
    Menu,
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
    DollarSign,
    ScrollText,
    FlaskConical,
    CheckSquare,
    Briefcase,
    TrendingUp,
    X
} from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../contexts/AuthContext'
import { USER_ROLES, ROUTES } from '../../utils/constants'
import { apiMethods } from '../../services/api'
import { Button } from '../ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent
} from '../ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '../ui/sheet'
import { ScrollArea } from '../ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import LanguageSwitcher from '../shared/LanguageSwitcher'
import ThemeToggle from '../shared/ThemeToggle'
import NotificationBell from './NotificationBell'
import { AppDrawer } from './AppDrawer'
import { cn } from '../../lib/utils'

export function AppNavbar() {
    const { t, isRTL } = useLanguage()
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [isOpen, setIsOpen] = useState(false)
    const [studentWallet, setStudentWallet] = useState(null)

    // Load student wallet for STUDENT role (matching Sidebar logic)
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
                setStudentWallet(null)
            }
        }
        loadWallet()
    }, [user])

    // Navigation items configuration (copied and kept identical to AppSidebar)
    const navigationItems = useMemo(() => {
        const userRole = user?.role
        const isTeacher = userRole === USER_ROLES.TEACHER
        const dashboardLabel = isTeacher ? t('teacherHome.title', 'Home') : t('common.dashboard')
        const dashboardPath = isTeacher
            ? '/teacher'
            : (userRole === USER_ROLES.STAFF || userRole === USER_ROLES.DRIVER)
                ? '/staff'
                : userRole
                    ? `/dashboard/${userRole.toLowerCase()}`
                    : '/'

        const baseItems = [
            {
                key: 'dashboard',
                icon: Home,
                label: dashboardLabel,
                path: dashboardPath,
            }
        ]

        const roleSpecificItems = {
            [USER_ROLES.ADMIN]: [
                {
                    key: 'school-management',
                    icon: Building2,
                    label: t('adminSidebar.schoolManagement.title'),
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
                {
                    key: 'academic-management',
                    icon: GraduationCap,
                    label: t('adminSidebar.academicManagement.title'),
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
                {
                    key: 'education-management',
                    icon: BookOpen,
                    label: t('adminSidebar.educationManagement.title'),
                    items: [
                        { key: 'lessons-courses', label: t('adminSidebar.educationManagement.lessonsCourses'), path: '/admin/education-management/lessons' },
                        { key: 'exercises', label: t('adminSidebar.educationManagement.exercises'), path: '/admin/education-management/exercises' },
                        { key: 'assignments', label: t('adminSidebar.educationManagement.assignments'), path: '/admin/education-management/assignments' },
                        { key: 'homework', label: t('adminSidebar.educationManagement.homework'), path: '/admin/education-management/homework' },
                        { key: 'exams', label: t('adminSidebar.educationManagement.exams'), path: '/admin/education-management/exams' },
                        { key: 'grading-system', label: t('adminSidebar.educationManagement.gradingSystem'), path: '/admin/education-management/grading-system' },
                    ]
                },
                {
                    key: 'lab',
                    icon: FlaskConical,
                    label: t('adminSidebar.lab.title', 'Lab Tools'),
                    path: '/lab',
                },
                {
                    key: 'reports-analytics',
                    icon: BarChart3,
                    label: t('adminSidebar.reportsAnalytics.title'),
                    items: [
                        { key: 'attendance-reports', label: t('adminSidebar.reportsAnalytics.attendanceReports'), path: '/admin/reports/attendance' },
                        { key: 'academic-performance', label: t('adminSidebar.reportsAnalytics.academicPerformance'), path: '/admin/reports/academic-performance' },
                        { key: 'financial-reports', label: t('adminSidebar.reportsAnalytics.financialReports'), path: '/admin/reports/financial' },
                        { key: 'custom-report-builder', label: t('adminSidebar.reportsAnalytics.customReportBuilder'), path: '/admin/reports/custom-builder' },
                        { key: 'comparative-analysis', label: t('adminSidebar.reportsAnalytics.comparativeAnalysis'), path: '/admin/reports/comparative-analysis' },
                        { key: 'activity-logs', label: t('adminSidebar.reportsAnalytics.activityLogs', 'Activity Logs'), path: '/admin/logs', icon: ScrollText },
                    ]
                },
                {
                    key: 'finance',
                    icon: DollarSign,
                    label: 'Finance',
                    items: [
                        { key: 'finance-dashboard', label: 'Dashboard', path: '/admin/finance/dashboard' },
                        { key: 'contracts', label: 'Contracts', path: '/admin/finance/contracts' },
                        { key: 'payroll', label: 'Payroll', path: '/admin/finance/payroll' },
                        { key: 'expenses', label: 'Expenses', path: '/admin/finance/expenses' },
                        { key: 'budgets', label: 'Budgets', path: '/admin/finance/budgets' },
                        { key: 'transactions', label: 'General Ledger', path: '/admin/finance/transactions' },
                        { key: 'fuel', label: 'Fuel Analytics', path: '/admin/finance/fuel' },
                        { key: 'fee-setup', label: 'Fee Setup', path: '/admin/finance/setup' },
                        { key: 'invoices', label: 'Invoices', path: '/admin/finance/invoices' },
                        { key: 'payments', label: 'Payments', path: '/admin/finance/payments' },
                    ]
                },
                {
                    key: 'tasks-projects',
                    icon: CheckSquare,
                    label: t('adminSidebar.tasksProjects.title', 'Tasks & Projects'),
                    items: [
                        { key: 'daily-tasks', label: t('adminSidebar.tasksProjects.dailyTasks', 'Daily Tasks'), path: '/admin/tasks' },
                        { key: 'user-progress', label: t('adminSidebar.tasksProjects.userProgress', 'User Progress'), path: '/admin/tasks/progress' },
                        { key: 'projects', label: t('adminSidebar.tasksProjects.projects', 'Projects'), path: '/admin/projects' },
                    ]
                },
                {
                    key: 'communications',
                    icon: MessageSquare,
                    label: t('adminSidebar.communications.title'),
                    items: [
                        { key: 'messages', label: 'Messages', path: '/messages' },
                        { key: 'announcements', label: 'Announcements', path: '/announcements' },
                        { key: 'email-templates', label: t('adminSidebar.communications.emailTemplates'), path: '/admin/communications/email-templates' },
                        { key: 'parent-notifications', label: t('adminSidebar.communications.parentNotifications'), path: '/admin/communications/parent-notifications' },
                        { key: 'emergency-alerts', label: t('adminSidebar.communications.emergencyAlerts'), path: '/admin/communications/emergency-alerts' },
                    ]
                },
                {
                    key: 'system-settings',
                    icon: Settings,
                    label: t('adminSidebar.systemSettings.title'),
                    items: [
                        { key: 'general-settings', label: t('adminSidebar.systemSettings.generalSettings'), path: '/admin/settings/general' },
                        { key: 'user-permissions', label: t('adminSidebar.systemSettings.userPermissions'), path: '/admin/settings/permissions' },
                        { key: 'integration-settings', label: t('adminSidebar.systemSettings.integrationSettings'), path: '/admin/settings/integrations' },
                        { key: 'backup-restore', label: t('adminSidebar.systemSettings.backupRestore'), path: '/admin/settings/backup-restore' },
                    ]
                }
            ],
            [USER_ROLES.TEACHER]: [
                {
                    key: 'teacher-profile',
                    icon: UserCog,
                    label: t('teacherSidebar.profile.title'),
                    items: [
                        { key: 'profile-overview', label: t('teacherSidebar.profile.overview'), path: '/teacher/profile/overview' },
                        { key: 'my-classes', label: t('teacherSidebar.profile.myClasses'), path: '/teacher/profile/my-classes' },
                        { key: 'my-schedule', label: t('teacherSidebar.profile.mySchedule'), path: '/teacher/profile/my-schedule' },
                    ]
                },
                {
                    key: 'lessons-content',
                    icon: BookOpen,
                    label: t('teacherSidebar.lessonsContent.title'),
                    items: [
                        { key: 'lessons', label: t('teacherSidebar.lessonsContent.lessons'), path: '/teacher/content/lessons' },
                        { key: 'lesson-exercises', label: t('teacherSidebar.lessonsContent.lessonExercises'), path: '/teacher/content/lesson-exercises' },
                        { key: 'materials', label: t('teacherSidebar.lessonsContent.materials'), path: '/teacher/content/materials' },
                        { key: 'media-library', label: t('teacherSidebar.lessonsContent.mediaLibrary'), path: '/teacher/content/media-library' },
                        { key: 'templates', label: t('teacherSidebar.lessonsContent.templates'), path: '/teacher/content/templates' },
                    ]
                },
                {
                    key: 'assignments-assessment',
                    icon: ClipboardCheck,
                    label: t('teacherSidebar.assignments.title'),
                    items: [
                        { key: 'homework', label: t('teacherSidebar.assignments.homework'), path: '/teacher/assignments/homework' },
                        { key: 'exams', label: t('teacherSidebar.assignments.exams'), path: '/teacher/assignments/exams' },
                        { key: 'grading', label: t('teacherSidebar.assignments.grading'), path: '/teacher/assignments/grading' },
                        { key: 'assessment-tools', label: t('teacherSidebar.assignments.assessmentTools'), path: '/teacher/assignments/assessment-tools' },
                    ]
                },
                {
                    key: 'lab',
                    icon: FlaskConical,
                    label: t('teacherSidebar.lab.title', 'Lab Tools'),
                    path: '/lab',
                },
                {
                    key: 'tasks-projects',
                    icon: CheckSquare,
                    label: t('teacherSidebar.tasksProjects.title', 'Tasks & Projects'),
                    items: [
                        { key: 'my-tasks', label: t('teacherSidebar.tasksProjects.myTasks', 'My Tasks'), path: '/teacher/tasks' },
                        { key: 'my-progress', label: t('teacherSidebar.tasksProjects.myProgress', 'My Progress'), path: '/teacher/my-progress' },
                        { key: 'my-projects', label: t('teacherSidebar.tasksProjects.myProjects', 'My Projects'), path: '/teacher/projects' },
                    ]
                },
                {
                    key: 'student-management',
                    icon: Users,
                    label: t('teacherSidebar.students.title'),
                    items: [
                        { key: 'my-students', label: t('teacherSidebar.students.myStudents'), path: '/teacher/students/my-students' },
                        { key: 'attendance', label: t('teacherSidebar.students.attendance'), path: '/teacher/attendance' },
                        { key: 'attendance-history', label: t('teacherSidebar.students.attendanceHistory'), path: '/teacher/attendance/history' },
                        { key: 'progress', label: t('teacherSidebar.students.progress'), path: '/teacher/students/progress' },
                        { key: 'parent-communication', label: t('teacherSidebar.students.parentCommunication'), path: '/teacher/students/parent-communication' },
                    ]
                },
                {
                    key: 'teaching-analytics',
                    icon: BarChart3,
                    label: t('teacherSidebar.analytics.title'),
                    items: [
                        { key: 'class-performance', label: t('teacherSidebar.analytics.classPerformance'), path: '/teacher/analytics/class-performance' },
                        { key: 'student-analytics', label: t('teacherSidebar.analytics.studentAnalytics'), path: '/teacher/analytics/student-analytics' },
                        { key: 'assignment-stats', label: t('teacherSidebar.analytics.assignmentStats'), path: '/teacher/analytics/assignment-stats' },
                        { key: 'reports', label: t('teacherSidebar.analytics.reports'), path: '/teacher/analytics/reports' },
                        { key: 'academic-performance', label: t('teacherSidebar.analytics.academicPerformance', 'Academic Performance'), path: '/teacher/reports/academic-performance' },
                    ]
                },
                {
                    key: 'planning-organization',
                    icon: Calendar1,
                    label: t('teacherSidebar.planning.title'),
                    items: [
                        { key: 'lesson-planner', label: t('teacherSidebar.planning.lessonPlanner'), path: '/teacher/planning/lesson-planner' },
                        { key: 'calendar', label: t('teacherSidebar.planning.calendar'), path: '/teacher/planning/calendar' },
                        { key: 'tasks', label: t('teacherSidebar.planning.tasks'), path: '/teacher/planning/tasks' },
                        { key: 'resources', label: t('teacherSidebar.planning.resources'), path: '/teacher/planning/resources' },
                    ]
                },
                {
                    key: 'communication-hub',
                    icon: MessageSquare,
                    label: t('teacherSidebar.communication.title'),
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
                    key: 'home',
                    icon: Home,
                    label: t('common.home'),
                    path: '/student/home',
                },
                {
                    key: 'student-profile',
                    icon: UserCog,
                    label: t('studentSidebar.profile.title'),
                    items: [
                        { key: 'profile-overview', label: t('studentSidebar.profile.overview'), path: '/student/profile/overview' },
                        { key: 'profile-settings', label: t('studentSidebar.profile.settings'), path: '/student/profile/settings' },
                    ]
                },
                {
                    key: 'timetable',
                    icon: Calendar1,
                    label: t('studentSidebar.timetable.title'),
                    path: '/student/timetable',
                },
                {
                    key: 'attendance',
                    icon: UserCheck,
                    label: t('studentSidebar.attendance.title'),
                    items: [
                        { key: 'attendance-report', label: t('studentSidebar.attendance.myReport'), path: '/student/attendance/report' },
                        { key: 'attendance-history', label: t('studentSidebar.attendance.history'), path: '/student/attendance/history' },
                    ]
                },
                {
                    key: 'lessons',
                    icon: BookOpen,
                    label: t('studentSidebar.lessons.title'),
                    items: [
                        { key: 'all-lessons', label: t('studentSidebar.lessons.allLessons'), path: ROUTES.LESSONS.LIST },
                        { key: 'my-subjects', label: t('studentSidebar.lessons.mySubjects'), path: '/student/lessons/subjects' },
                        { key: 'favorites', label: t('studentSidebar.lessons.favorites'), path: '/student/lessons/favorites' },
                    ]
                },
                {
                    key: 'exercises',
                    icon: PenTool,
                    label: t('studentSidebar.exercises.title'),
                    items: [
                        { key: 'all-exercises', label: t('studentSidebar.exercises.allExercises'), path: ROUTES.STUDENT_EXERCISES.LIST },
                        { key: 'practice-mode', label: t('studentSidebar.exercises.practiceMode'), path: ROUTES.STUDENT_EXERCISES.PRACTICE },
                        { key: 'my-progress', label: t('studentSidebar.exercises.myProgress'), path: ROUTES.STUDENT_EXERCISES.PROGRESS },
                    ]
                },
                {
                    key: 'homework',
                    icon: ClipboardCheck,
                    label: t('studentSidebar.homework.title'),
                    items: [
                        { key: 'homework-overview', label: t('studentSidebar.homework.overview', 'Overview'), path: ROUTES.STUDENT_HOMEWORK.HOME },
                        { key: 'homework-pending', label: t('studentSidebar.homework.pending'), path: ROUTES.STUDENT_HOMEWORK.PENDING },
                        { key: 'homework-completed', label: t('studentSidebar.homework.completed'), path: ROUTES.STUDENT_HOMEWORK.COMPLETED },
                        { key: 'homework-grades', label: t('studentSidebar.homework.grades'), path: ROUTES.STUDENT_HOMEWORK.GRADES },
                        { key: 'homework-feedback', label: t('studentSidebar.homework.feedback'), path: ROUTES.STUDENT_HOMEWORK.FEEDBACK },
                    ]
                },
                {
                    key: 'lab',
                    icon: FlaskConical,
                    label: t('studentSidebar.lab.title', 'My Lab'),
                    path: '/lab',
                },
                {
                    key: 'achievements',
                    icon: Award,
                    label: t('studentSidebar.achievements.title'),
                    items: [
                        { key: 'my-badges', label: t('studentSidebar.achievements.myBadges'), path: '/student/achievements/badges' },
                        { key: 'leaderboard', label: t('studentSidebar.achievements.leaderboard'), path: ROUTES.HOMEWORK.LEADERBOARD },
                        { key: 'my-points', label: t('studentSidebar.achievements.myPoints'), path: ROUTES.STUDENT_ACHIEVEMENTS.MY_POINTS },
                        { key: 'my-rank', label: t('studentSidebar.achievements.myRank'), path: '/student/achievements/rank' },
                    ]
                },
                {
                    key: 'performance',
                    icon: BarChart3,
                    label: t('studentSidebar.performance.title'),
                    items: [
                        { key: 'performance-overview', label: t('studentSidebar.performance.overview'), path: '/student/performance/overview' },
                        { key: 'subject-performance', label: t('studentSidebar.performance.bySubject'), path: '/student/performance/subjects' },
                        { key: 'progress-report', label: t('studentSidebar.performance.progressReport'), path: '/student/performance/reports' },
                    ]
                }
            ],
            [USER_ROLES.PARENT]: [
                {
                    key: 'finance',
                    icon: DollarSign,
                    label: t('parentHome.financialStatus'),
                    path: '/parent/finance',
                }
            ],
            [USER_ROLES.STAFF]: (() => {
                const position = user?.position
                const items = []

                // Accountant gets Finance access
                if (position === 'ACCOUNTANT') {
                    items.push({
                        key: 'finance',
                        icon: DollarSign,
                        label: t('staff.finance.title', 'Finance'),
                        items: [
                            { key: 'finance-dashboard', label: t('staff.finance.dashboard', 'Dashboard'), path: '/admin/finance/dashboard' },
                            { key: 'invoices', label: t('staff.finance.invoices', 'Invoices'), path: '/admin/finance/invoices' },
                            { key: 'expenses', label: t('staff.finance.expenses', 'Expenses'), path: '/admin/finance/expenses' },
                            { key: 'payments', label: t('staff.finance.payments', 'Payments'), path: '/admin/finance/payments' },
                            { key: 'contracts', label: t('staff.finance.contracts', 'Contracts'), path: '/admin/finance/contracts' },
                            { key: 'payroll', label: t('staff.finance.payroll', 'Payroll'), path: '/admin/finance/payroll' },
                        ]
                    })
                }

                // Management Staff (Director, Assistant, General Supervisor) get these items
                const managementPositions = ['DIRECTOR', 'ASSISTANT', 'GENERAL_SUPERVISOR']
                if (managementPositions.includes(position)) {
                    // Attendance
                    items.push({
                        key: 'attendance',
                        icon: UserCheck,
                        label: t('staff.attendance.title', 'Attendance'),
                        items: [
                            { key: 'today', label: t('staff.attendance.today', 'Today'), path: '/staff/attendance/today' },
                            { key: 'history', label: t('staff.attendance.history', 'History'), path: '/staff/reports/attendance' },
                        ]
                    })

                    // School Management
                    items.push({
                        key: 'school-management',
                        icon: Building2,
                        label: t('staff.schoolManagement.title', 'School Management'),
                        items: [
                            { key: 'teachers', label: t('common.teachers', 'Teachers'), path: '/admin/school-management/teachers' },
                            { key: 'students', label: t('common.students', 'Students'), path: '/admin/school-management/students' },
                        ]
                    })

                    // Timetables
                    items.push({
                        key: 'timetables',
                        icon: Calendar,
                        label: t('staff.timetables.title', 'Timetables'),
                        path: '/admin/academic-management/timetables'
                    })

                    // Tasks - ONLY for Director and Assistant (NOT General Supervisor)
                    if (position === 'DIRECTOR' || position === 'ASSISTANT') {
                        items.push({
                            key: 'tasks',
                            icon: CheckSquare,
                            label: t('staff.tasks.title', 'Tasks & Projects'),
                            path: '/staff/tasks'
                        })
                    }
                }

                // Communication for all staff
                items.push({
                    key: 'communication',
                    icon: MessageSquare,
                    label: t('common.communication', 'Communication'),
                    items: [
                        { key: 'messages', label: t('common.messages', 'Messages'), path: '/messages' },
                        { key: 'announcements', label: t('common.announcements', 'Announcements'), path: '/announcements' },
                    ]
                })

                return items
            })(),
            [USER_ROLES.DRIVER]: [
                {
                    key: 'transport',
                    icon: Car,
                    label: t('staff.transport.title', 'Transport'),
                    items: [
                        { key: 'my-car', label: t('staff.transport.myCar', 'My Car'), path: '/staff/transport/my-car' },
                        { key: 'my-routes', label: t('staff.transport.myRoutes', 'My Routes'), path: '/staff/transport/routes' },
                    ]
                },
                {
                    key: 'communication',
                    icon: MessageSquare,
                    label: t('common.communication', 'Communication'),
                    items: [
                        { key: 'messages', label: t('common.messages', 'Messages'), path: '/messages' },
                    ]
                }
            ],
        }

        return [
            ...baseItems,
            ...(roleSpecificItems[userRole] || [])
        ]
    }, [user, t])

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login', { replace: true })
        } catch (error) {
            console.error('Logout error:', error)
            navigate('/login', { replace: true })
        }
    }

    const userDisplayName =
        user?.full_name ||
        [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
        user?.name ||
        user?.email ||
        "User"


    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-2 sm:px-4 h-16 flex items-center justify-between">
                {/* Logo & Platform Name */}
                <div className="flex items-center gap-4 lg:gap-8">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <School className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-lg hidden sm:inline-block">Madrasti 2.0</span>
                    </Link>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden sm:flex items-center gap-2">
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </div>

                    {studentWallet && (
                        <div className="hidden md:flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                            <Sparkles className="h-4 w-4" />
                            <span>{studentWallet.total_points || 0}</span>
                        </div>
                    )}

                    <NotificationBell />

                    <AppDrawer navigationItems={navigationItems} />

                    {/* User Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                <Avatar className="h-9 w-9 border">
                                    <AvatarImage src={user?.avatar} alt={userDisplayName} />
                                    <AvatarFallback>{userDisplayName.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount dir={isRTL ? "rtl" : "ltr"}>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{userDisplayName}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link to={`/profile`} className="flex items-center gap-2 cursor-pointer w-full">
                                    <UserCog className="h-4 w-4" />
                                    <span>{t('profile.title', 'Profile')}</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to={`/settings`} className="flex items-center gap-2 cursor-pointer w-full">
                                    <Settings className="h-4 w-4" />
                                    <span>{t('settings.title', 'Settings')}</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive cursor-pointer"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                                <span>{t('auth.logout', 'Logout')}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Mobile Menu Trigger */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="lg:hidden h-9 w-9">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side={isRTL ? "right" : "left"} className="p-0 w-80" dir={isRTL ? "rtl" : "ltr"}>
                            <SheetHeader className="p-4 border-b">
                                <SheetTitle className="text-left rtl:text-right flex items-center gap-2">
                                    <School className="h-5 w-5 text-primary" />
                                    Madrasti 2.0
                                </SheetTitle>
                            </SheetHeader>
                            <ScrollArea className="h-[calc(100vh-8rem)]">
                                <div className="p-4 space-y-4">
                                    {navigationItems.map(item => (
                                        <div key={item.key} className="space-y-2">
                                            {item.items ? (
                                                <>
                                                    <div className="flex items-center gap-2 px-2 py-1 text-sm font-semibold text-muted-foreground">
                                                        {item.icon && <item.icon className="h-4 w-4" />}
                                                        {item.label}
                                                    </div>
                                                    <div className="grid gap-1 pl-4 rtl:pl-0 rtl:pr-4">
                                                        {item.items.map(subItem => (
                                                            <Link
                                                                key={subItem.key}
                                                                to={subItem.path}
                                                                onClick={() => setIsOpen(false)}
                                                                className={cn(
                                                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent",
                                                                    location.pathname === subItem.path ? "bg-accent text-primary" : "text-muted-foreground"
                                                                )}
                                                            >
                                                                {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                                                {subItem.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </>
                                            ) : (
                                                <Link
                                                    to={item.path}
                                                    onClick={() => setIsOpen(false)}
                                                    className={cn(
                                                        "flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent",
                                                        location.pathname === item.path ? "bg-accent text-primary" : "text-muted-foreground"
                                                    )}
                                                >
                                                    {item.icon && <item.icon className="h-4 w-4" />}
                                                    {item.label}
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background flex items-center justify-between">
                                <div className="flex gap-2">
                                    <LanguageSwitcher />
                                    <ThemeToggle />
                                </div>
                                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive">
                                    <LogOut className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                                    {t('auth.logout')}
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}
