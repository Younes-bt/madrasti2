import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { DashboardLayout } from '../../components/layout/Layout'
import {
    Car,
    Calculator,
    UserCheck,
    Users,
    GraduationCap,
    Calendar,
    MessageSquare,
    CheckSquare,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    Building2
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

const StaffHome = () => {
    const { t, isRTL } = useLanguage()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [selectedTile, setSelectedTile] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Get position-specific tiles based on user's position
    const tiles = useMemo(() => {
        const position = user?.position

        // Driver tiles
        if (position === 'DRIVER') {
            return [
                {
                    key: 'my-car',
                    title: t('staff.transport.myCar', 'My Car'),
                    description: t('staff.transport.myCarDesc', 'Manage your vehicle information'),
                    icon: Car,
                    path: '/staff/transport/my-car',
                    accent: 'blue',
                    color: 'bg-blue-500',
                    bgLight: 'bg-blue-50',
                    border: 'border-blue-100',
                },
                {
                    key: 'communication',
                    title: t('common.communication', 'Communication'),
                    description: t('staff.communication.desc', 'Messages and announcements'),
                    icon: MessageSquare,
                    accent: 'purple',
                    color: 'bg-purple-500',
                    bgLight: 'bg-purple-50',
                    border: 'border-purple-100',
                    items: [
                        { key: 'messages', label: t('common.messages', 'Messages'), path: '/messages' },
                    ]
                }
            ]
        }

        // Accountant tiles
        if (position === 'ACCOUNTANT') {
            return [
                {
                    key: 'finance-dashboard',
                    title: t('staff.finance.dashboard', 'Finance Dashboard'),
                    description: t('staff.finance.dashboardDesc', 'Financial overview and analytics'),
                    icon: Calculator,
                    path: '/admin/finance/dashboard',
                    accent: 'emerald',
                    color: 'bg-emerald-500',
                    bgLight: 'bg-emerald-50',
                    border: 'border-emerald-100',
                },
                {
                    key: 'finance',
                    title: t('staff.finance.title', 'Finance Management'),
                    description: t('staff.finance.desc', 'Manage finances and budgets'),
                    icon: Calculator,
                    accent: 'emerald',
                    color: 'bg-emerald-500',
                    bgLight: 'bg-emerald-50',
                    border: 'border-emerald-100',
                    items: [
                        { key: 'invoices', label: t('staff.finance.invoices', 'Invoices'), path: '/admin/finance/invoices' },
                        { key: 'expenses', label: t('staff.finance.expenses', 'Expenses'), path: '/admin/finance/expenses' },
                        { key: 'payments', label: t('staff.finance.payments', 'Payments'), path: '/admin/finance/payments' },
                        { key: 'contracts', label: t('staff.finance.contracts', 'Contracts'), path: '/admin/finance/contracts' },
                        { key: 'payroll', label: t('staff.finance.payroll', 'Payroll'), path: '/admin/finance/payroll' },
                    ]
                },
                {
                    key: 'communication',
                    title: t('common.communication', 'Communication'),
                    description: t('staff.communication.desc', 'Messages and announcements'),
                    icon: MessageSquare,
                    accent: 'purple',
                    color: 'bg-purple-500',
                    bgLight: 'bg-purple-50',
                    border: 'border-purple-100',
                    items: [
                        { key: 'messages', label: t('common.messages', 'Messages'), path: '/messages' },
                        { key: 'announcements', label: t('common.announcements', 'Announcements'), path: '/announcements' },
                    ]
                }
            ]
        }

        // Management Staff tiles (Director, Assistant, General Supervisor)
        const managementPositions = ['DIRECTOR', 'ASSISTANT', 'GENERAL_SUPERVISOR']
        if (managementPositions.includes(position)) {
            const baseTiles = [
                {
                    key: 'attendance',
                    title: t('staff.attendance.title', 'Attendance'),
                    description: t('staff.attendance.desc', 'Track and manage attendance'),
                    icon: UserCheck,
                    accent: 'blue',
                    color: 'bg-blue-500',
                    bgLight: 'bg-blue-50',
                    border: 'border-blue-100',
                    items: [
                        { key: 'today', label: t('staff.attendance.today', 'Today'), path: '/staff/attendance/today' },
                        { key: 'history', label: t('staff.attendance.history', 'History'), path: '/staff/reports/attendance' },
                    ]
                },
                {
                    key: 'school-management',
                    title: t('staff.schoolManagement.title', 'School Management'),
                    description: t('staff.schoolManagement.desc', 'Manage teachers and students'),
                    icon: Building2,
                    accent: 'indigo',
                    color: 'bg-indigo-500',
                    bgLight: 'bg-indigo-50',
                    border: 'border-indigo-100',
                    items: [
                        { key: 'teachers', label: t('common.teachers', 'Teachers'), path: '/admin/school-management/teachers' },
                        { key: 'students', label: t('common.students', 'Students'), path: '/admin/school-management/students' },
                    ]
                },
                {
                    key: 'timetables',
                    title: t('staff.timetables.title', 'Timetables'),
                    description: t('staff.timetables.desc', 'View and manage schedules'),
                    icon: Calendar,
                    path: '/admin/academic-management/timetables',
                    accent: 'cyan',
                    color: 'bg-cyan-500',
                    bgLight: 'bg-cyan-50',
                    border: 'border-cyan-100',
                },
                {
                    key: 'communication',
                    title: t('common.communication', 'Communication'),
                    description: t('staff.communication.desc', 'Messages and announcements'),
                    icon: MessageSquare,
                    accent: 'purple',
                    color: 'bg-purple-500',
                    bgLight: 'bg-purple-50',
                    border: 'border-purple-100',
                    items: [
                        { key: 'messages', label: t('common.messages', 'Messages'), path: '/messages' },
                        { key: 'announcements', label: t('common.announcements', 'Announcements'), path: '/announcements' },
                    ]
                }
            ]

            // Add Tasks tile only for Director and Assistant (NOT General Supervisor)
            if (position === 'DIRECTOR' || position === 'ASSISTANT') {
                baseTiles.splice(3, 0, {
                    key: 'tasks',
                    title: t('staff.tasks.title', 'Tasks & Projects'),
                    description: t('staff.tasks.desc', 'Manage team tasks'),
                    icon: CheckSquare,
                    path: '/staff/tasks',
                    accent: 'amber',
                    color: 'bg-amber-500',
                    bgLight: 'bg-amber-50',
                    border: 'border-amber-100',
                })
            }

            return baseTiles
        }

        // Fallback for unknown positions
        return []
    }, [user?.position, t])

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

    // Get position label for display
    const getPositionLabel = () => {
        if (!user?.position) return t('roles.staff', 'Staff')

        const labels = {
            'DRIVER': t('positions.driver', 'Driver'),
            'ACCOUNTANT': t('positions.accountant', 'Accountant'),
            'DIRECTOR': t('positions.director', 'Director'),
            'ASSISTANT': t('positions.assistant', 'Assistant'),
            'GENERAL_SUPERVISOR': t('positions.generalSupervisor', 'General Supervisor'),
        }
        return labels[user.position] || user.position
    }

    if (!tiles || tiles.length === 0) {
        return (
            <DashboardLayout user={user}>
                <div className="mx-auto max-w-7xl px-2 py-6 md:p-6 lg:p-8">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold text-slate-900">
                            {t('staff.noAccess', 'No modules available for your position')}
                        </h2>
                        <p className="text-slate-500 mt-2">
                            {t('staff.contactAdmin', 'Please contact your administrator for access.')}
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout user={user}>
            <div className="mx-auto max-w-7xl px-2 py-6 md:p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Hero section */}
                <div className="relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.03),_transparent_50%)]" />

                    <div className="relative px-6 py-8 md:px-8 md:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-4 max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-blue-600 border border-blue-100/50">
                                <Sparkles className="w-3.5 h-3.5" />
                                {t('staff.welcome', 'Staff Portal')}
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
                                    {t('common.welcome')}, {user?.full_name || t('staff.staffMember', 'Staff Member')}
                                </h1>
                                <p className="text-lg text-slate-500 max-w-2xl font-medium">
                                    {getPositionLabel()} • {t('staff.helperText', 'Access your work modules and manage daily tasks.')}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <div className="bg-white rounded-xl p-4 min-w-[160px] border border-slate-200 shadow-sm transition-all hover:shadow-md">
                                    <p className="text-sm font-medium text-slate-500 mb-1">{t('staff.position', 'Position')}</p>
                                    <p className="text-base font-semibold text-slate-900 truncate">
                                        {getPositionLabel()}
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl p-4 min-w-[160px] border border-slate-200 shadow-sm transition-all hover:shadow-md">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            {t('common.status', 'Status')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-base font-semibold text-slate-900">
                                            {t('common.online', 'Online')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
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
                                                                item.accent === 'amber' ? 'text-amber-600' : 'text-rose-600'
                                        )} />
                                    </div>
                                    <span className="text-xs font-medium text-slate-400 group-hover:text-blue-600 transition-colors px-2 py-1 rounded-lg bg-slate-50 group-hover:bg-blue-50 border border-slate-100 group-hover:border-blue-100">
                                        {t('common.open', 'Open')}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-lg font-medium tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-normal">
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between text-[13px] font-medium text-slate-400 group-hover:text-blue-600 transition-all">
                                <span>{t('common.clickToOpen', 'Click to open')}</span>
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

export default StaffHome
