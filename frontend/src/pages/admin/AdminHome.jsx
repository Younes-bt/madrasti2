import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { DashboardLayout } from '../../components/layout/Layout'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import {
    Building2,
    GraduationCap,
    BookOpen,
    BarChart3,
    Calculator,
    Megaphone,
    Settings,
    FlaskConical,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    X
} from 'lucide-react'
import { cn } from '../../lib/utils'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../../components/ui/dialog'
import { ScrollArea } from '../../components/ui/scroll-area'
import { Button } from '../../components/ui/button'

const AdminHome = () => {
    const { t, isRTL } = useLanguage()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [selectedTile, setSelectedTile] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const tiles = useMemo(() => ([
        {
            key: 'school-management',
            title: t('adminSidebar.schoolManagement.title'),
            icon: Building2,
            accent: 'blue',
            color: 'bg-blue-500',
            bgLight: 'bg-blue-50',
            border: 'border-blue-100',
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
            title: t('adminSidebar.academicManagement.title'),
            icon: GraduationCap,
            accent: 'emerald',
            color: 'bg-emerald-500',
            bgLight: 'bg-emerald-50',
            border: 'border-emerald-100',
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
            title: t('adminSidebar.educationManagement.title'),
            icon: BookOpen,
            accent: 'indigo',
            color: 'bg-indigo-500',
            bgLight: 'bg-indigo-50',
            border: 'border-indigo-100',
            items: [
                { key: 'lessons-courses', label: t('adminSidebar.educationManagement.lessonsCourses'), path: '/admin/education-management/lessons' },
                { key: 'exercises', label: t('adminSidebar.educationManagement.exercises', 'Exercises'), path: '/admin/education-management/exercises' },
                { key: 'assignments', label: t('adminSidebar.educationManagement.assignments', 'Assignments'), path: '/admin/education-management/assignments' },
                { key: 'homework', label: t('adminSidebar.educationManagement.homework', 'Homework'), path: '/admin/education-management/homework' },
                { key: 'exams', label: t('adminSidebar.educationManagement.exams', 'Exams'), path: '/admin/education-management/exams' },
                { key: 'grading-system', label: t('adminSidebar.educationManagement.gradingSystem', 'Grading System'), path: '/admin/education-management/grading-system' },
            ]
        },
        {
            key: 'lab',
            title: t('adminSidebar.lab.title', 'Lab Tools'),
            icon: FlaskConical,
            path: '/lab',
            accent: 'purple',
            color: 'bg-purple-500',
            bgLight: 'bg-purple-50',
            border: 'border-purple-100'
        },
        {
            key: 'reports-analytics',
            title: t('adminSidebar.reportsAnalytics.title'),
            icon: BarChart3,
            accent: 'cyan',
            color: 'bg-cyan-500',
            bgLight: 'bg-cyan-50',
            border: 'border-cyan-100',
            items: [
                { key: 'attendance-reports', label: t('adminSidebar.reportsAnalytics.attendanceReports'), path: '/admin/reports/attendance' },
                { key: 'academic-performance', label: t('adminSidebar.reportsAnalytics.academicPerformance'), path: '/admin/reports/academic-performance' },
                { key: 'financial-reports', label: t('adminSidebar.reportsAnalytics.financialReports', 'Financial Reports'), path: '/admin/reports/financial' },
                { key: 'custom-report-builder', label: t('adminSidebar.reportsAnalytics.customReportBuilder', 'Custom Report Builder'), path: '/admin/reports/custom-builder' },
                { key: 'comparative-analysis', label: t('adminSidebar.reportsAnalytics.comparativeAnalysis', 'Comparative Analysis'), path: '/admin/reports/comparative-analysis' },
                { key: 'activity-logs', label: t('adminSidebar.reportsAnalytics.activityLogs', 'Activity Logs'), path: '/admin/logs' },
            ]
        },
        {
            key: 'finance',
            title: t('adminSidebar.finance.title'),
            icon: Calculator,
            accent: 'emerald',
            color: 'text-emerald-600',
            bgLight: 'bg-emerald-50',
            border: 'border-emerald-100',
            items: [
                { key: 'finance-dashboard', label: t('adminSidebar.finance.dashboard'), path: '/admin/finance/dashboard' },
                { key: 'contracts', label: t('adminSidebar.finance.contracts'), path: '/admin/finance/contracts' },
                { key: 'payroll', label: t('adminSidebar.finance.payroll'), path: '/admin/finance/payroll' },
                { key: 'expenses', label: t('adminSidebar.finance.expenses'), path: '/admin/finance/expenses' },
                { key: 'budgets', label: t('adminSidebar.finance.budgets'), path: '/admin/finance/budgets' },
                { key: 'transactions', label: t('adminSidebar.finance.transactions'), path: '/admin/finance/transactions' },
                { key: 'fuel', label: t('adminSidebar.finance.fuel'), path: '/admin/finance/fuel' },
                { key: 'fee-setup', label: t('adminSidebar.finance.feeSetup'), path: '/admin/finance/fee-setup' },
                { key: 'invoices', label: t('adminSidebar.finance.invoices'), path: '/admin/finance/invoices' },
                { key: 'payments', label: t('adminSidebar.finance.payments'), path: '/admin/finance/payments' },
            ]
        },
        {
            key: 'communications',
            title: t('adminSidebar.communications.title'),
            icon: Megaphone,
            accent: 'purple',
            color: 'text-purple-600',
            bgLight: 'bg-purple-50',
            border: 'border-purple-100',
            items: [
                { key: 'messages', label: t('adminSidebar.communications.messages'), path: '/admin/communications/messages' },
                { key: 'announcements', label: t('adminSidebar.communications.announcements'), path: '/admin/communications/announcements' },
                { key: 'email-templates', label: t('adminSidebar.communications.emailTemplates', 'Email Templates'), path: '/admin/communications/email-templates' },
                { key: 'parent-notifications', label: t('adminSidebar.communications.parentNotifications', 'Parent Notifications'), path: '/admin/communications/parent-notifications' },
                { key: 'emergency-alerts', label: t('adminSidebar.communications.emergencyAlerts', 'Emergency Alerts'), path: '/admin/communications/emergency-alerts' },
            ]
        },
        {
            key: 'system-settings',
            title: t('adminSidebar.systemSettings.title'),
            icon: Settings,
            accent: 'rose',
            color: 'bg-rose-500',
            bgLight: 'bg-rose-50',
            border: 'border-rose-100',
            items: [
                { key: 'general-settings', label: t('adminSidebar.systemSettings.generalSettings', 'General Settings'), path: '/admin/settings/general' },
                { key: 'user-permissions', label: t('adminSidebar.systemSettings.userPermissions', 'User Permissions'), path: '/admin/settings/permissions' },
                { key: 'integration-settings', label: t('adminSidebar.systemSettings.integrationSettings', 'Integration Settings'), path: '/admin/settings/integrations' },
                { key: 'backup-restore', label: t('adminSidebar.systemSettings.backupRestore', 'Backup & Restore'), path: '/admin/settings/backup-restore' },
            ]
        },
    ]), [t])

    const handleTileClick = (tile) => {
        if (tile.items && tile.items.length > 0) {
            setSelectedTile(tile)
            setIsModalOpen(true)
        } else if (tile.path) {
            navigate(tile.path)
        }
    }

    const handleSubItemClick = (path) => {
        setIsModalOpen(false)
        navigate(path)
    }

    return (
        <DashboardLayout user={user}>
            <div className="mx-auto max-w-7xl px-2 py-6 md:p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Hero section: Higher content, less vertical space */}
                <div className="relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.03),_transparent_50%)]" />

                    <div className="relative px-6 py-8 md:px-8 md:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-4 max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-blue-600 border border-blue-100/50">
                                <Sparkles className="w-3.5 h-3.5" />
                                {t('adminHome.readyToManage', 'Ready to manage')}
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
                                    {t('adminHome.welcomeUser', { name: user?.full_name || t('adminHome.adminLabel', 'Administrator') })}
                                </h1>
                                <p className="text-lg text-slate-500 max-w-2xl font-medium">
                                    {t('adminHome.helperText', 'Manage your school and monitor system performance in one place.')}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <div className="bg-white rounded-xl p-4 min-w-[160px] border border-slate-200 shadow-sm transition-all hover:shadow-md">
                                    <p className="text-sm font-medium text-slate-500 mb-1">{t('adminHome.schoolName', 'School')}</p>
                                    <p className="text-base font-semibold text-slate-900 truncate">
                                        {user?.school_info?.name || 'Madrasti'}
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl p-4 min-w-[160px] border border-slate-200 shadow-sm transition-all hover:shadow-md">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            {t('adminHome.quickActions', 'Status')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-base font-semibold text-slate-900">
                                            {t('adminHome.online', 'Online')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid: 8pt grid (gap-6 = 24px) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tiles.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => handleTileClick(item)}
                            className={cn(
                                "group relative flex flex-col justify-between p-6 rounded-2xl border border-slate-200 bg-white text-left transition-all duration-200",
                                "hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5",
                                "focus:outline-none focus:ring-2 focus:ring-blue-100",
                                "overflow-hidden"
                            )}
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className={cn(
                                        "p-2.5 rounded-xl transition-colors duration-200",
                                        item.bgLight, "group-hover:bg-opacity-80",
                                        "border border-transparent group-hover:border-white/20"
                                    )}>
                                        <item.icon className={cn("h-5 w-5",
                                            item.accent === 'blue' ? 'text-blue-600' :
                                                item.accent === 'emerald' ? 'text-emerald-600' :
                                                    item.accent === 'indigo' ? 'text-indigo-600' :
                                                        item.accent === 'purple' ? 'text-purple-600' :
                                                            item.accent === 'cyan' ? 'text-cyan-600' :
                                                                item.accent === 'amber' ? 'text-amber-600' :
                                                                    item.accent === 'sky' ? 'text-sky-600' : 'text-rose-600'
                                        )} />
                                    </div>
                                    <span className="text-xs font-medium text-slate-400 group-hover:text-blue-600 transition-colors px-2 py-1 rounded-lg bg-slate-50 group-hover:bg-blue-50 border border-slate-100 group-hover:border-blue-100">
                                        {t('adminHome.open', 'Open')}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-lg font-medium tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-normal">
                                        {t('common.manage', 'Explore')} {item.title.split(' ')[0]}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between text-[13px] font-medium text-slate-400 group-hover:text-blue-600 transition-all">
                                <span>{t('adminHome.tapToStart', 'Access module')}</span>
                                <ChevronRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Sub-items Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-2xl border border-slate-200 shadow-xl">
                        <DialogHeader className="p-6 md:p-8 bg-slate-50 border-b border-slate-200">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setIsModalOpen(false)}
                                    className="h-9 w-9 rounded-xl border-slate-200 hover:bg-white hover:text-blue-600 transition-all"
                                >
                                    <ChevronLeft className={cn("h-4 w-4", isRTL && "rotate-180")} />
                                </Button>
                                <div>
                                    <DialogTitle className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900 flex items-center gap-3">
                                        <div className={cn("p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100/50")}>
                                            {selectedTile?.icon && <selectedTile.icon className="h-5 w-5" />}
                                        </div>
                                        {selectedTile?.title}
                                    </DialogTitle>
                                    <p className="text-sm text-slate-500 mt-1 font-normal">
                                        {t('common.selectAnOption', 'Choose a section to manage')}
                                    </p>
                                </div>
                            </div>
                        </DialogHeader>
                        <ScrollArea className="max-h-[60vh] p-6 md:p-8 bg-white">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {selectedTile?.items?.map((subItem) => (
                                    <button
                                        key={subItem.key}
                                        onClick={() => handleSubItemClick(subItem.path)}
                                        className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50 transition-all duration-200 hover:bg-blue-50 hover:border-blue-100 hover:shadow-sm hover:-translate-y-0.5 active:scale-95 text-center"
                                    >
                                        <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:border-blue-200 group-hover:shadow-sm transition-all duration-200">
                                            {selectedTile?.icon && <selectedTile.icon className="h-6 w-6" />}
                                        </div>
                                        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors line-clamp-2 w-full">
                                            {subItem.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    )
}

export default AdminHome
