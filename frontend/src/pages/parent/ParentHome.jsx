import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
    UserCog,
    GraduationCap,
    UserCheck,
    BookOpen,
    Award,
    Wallet,
    MessageSquare,
    Bell,
    ChevronRight,
    Sparkles
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/Layout'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const ParentHome = () => {
    const { t } = useTranslation()
    const { user } = useAuth()
    const navigate = useNavigate()

    const tiles = useMemo(() => ([
        {
            key: 'profile',
            title: t('parentHome.myProfile', 'My Profile'),
            icon: UserCog,
            accent: 'blue',
            color: 'text-blue-600',
            bgLight: 'bg-blue-50',
            border: 'border-blue-100',
            path: '/parent/profile',
            description: t('parentHome.profileDescription', 'Manage your personal information')
        },
        {
            key: 'kids',
            title: t('parentHome.kidProfile', 'Kid Profile'),
            icon: GraduationCap,
            accent: 'indigo',
            color: 'text-indigo-600',
            bgLight: 'bg-indigo-50',
            border: 'border-indigo-100',
            path: '/parent/kids',
            description: t('parentHome.kidProfileDescription', 'View your children\'s school information')
        },
        {
            key: 'attendance',
            title: t('parentHome.attendance', 'Attendance'),
            icon: UserCheck,
            accent: 'emerald',
            color: 'text-emerald-600',
            bgLight: 'bg-emerald-50',
            border: 'border-emerald-100',
            path: '/parent/attendance',
            description: t('parentHome.attendanceDescription', 'Track daily attendance and absences')
        },
        {
            key: 'homework',
            title: t('parentHome.homeWork', 'Homework'),
            icon: BookOpen,
            accent: 'amber',
            color: 'text-amber-600',
            bgLight: 'bg-amber-50',
            border: 'border-amber-100',
            path: '/parent/homework',
            description: t('parentHome.homeworkDescription', 'Monitor assignments and due dates')
        },
        {
            key: 'grades',
            title: t('parentHome.grades', 'Grades'),
            icon: Award,
            accent: 'purple',
            color: 'text-purple-600',
            bgLight: 'bg-purple-50',
            border: 'border-purple-100',
            path: '/parent/grades',
            description: t('parentHome.gradesDescription', 'Review academic performance and marks')
        },
        {
            key: 'finance',
            title: t('parentHome.finance', 'Finance'),
            icon: Wallet,
            accent: 'rose',
            color: 'text-rose-600',
            bgLight: 'bg-rose-50',
            border: 'border-rose-100',
            path: '/parent/finance/invoices',
            description: t('parentHome.financeDescription', 'View invoices and payment history')
        },
        {
            key: 'communications',
            title: t('parentHome.communications', 'Communications'),
            icon: MessageSquare,
            accent: 'cyan',
            color: 'text-cyan-600',
            bgLight: 'bg-cyan-50',
            border: 'border-cyan-100',
            path: '/parent/communications',
            description: t('parentHome.communicationsDescription', 'Connect with teachers and staff')
        },
        {
            key: 'news',
            title: t('parentHome.news', 'Events & News'),
            icon: Bell,
            accent: 'orange',
            color: 'text-orange-600',
            bgLight: 'bg-orange-50',
            border: 'border-orange-100',
            path: '/parent/news',
            description: t('parentHome.newsDescription', 'Stay updated with school activities')
        }
    ]), [t])

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
                                {t('parentHome.readyToManage', 'Ready to manage')}
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
                                    {t('parentHome.welcomeUser', { name: user?.full_name || t('parentHome.parentLabel', 'Parent') })}
                                </h1>
                                <p className="text-lg text-slate-500 max-w-2xl font-medium">
                                    {t('parentHome.helperDescription', 'Monitor your children\'s academic journey and stay connected with the school.')}
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
                                            {t('adminHome.status', 'Status')}
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
                            onClick={() => navigate(item.path)}
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
                                        <item.icon className={cn("h-5 w-5", item.color)} />
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
                                <span>{t('common.accessModule', 'Access module')}</span>
                                <ChevronRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}

export default ParentHome


