import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { useStudentHomeworks } from '../../hooks/useStudentHomeworks'
import {
  User,
  BookOpen,
  ClipboardCheck,
  PenTool,
  Calendar,
  UserCheck,
  MessageSquare,
  Megaphone,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { DashboardLayout } from '../../components/layout/Layout'
import { cn } from '../../lib/utils'
import { ROUTES } from '../../utils/constants'

const StudentHome = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { summary: homeworkSummary } = useStudentHomeworks({ status: 'pending' })
  const pendingHomeworkCount = homeworkSummary?.pending || 0

  const tiles = useMemo(() => ([
    {
      key: 'profile',
      title: t('studentHome.myProfile'),
      icon: User,
      path: '/student/profile/overview',
      accent: 'sky',
      bgLight: 'bg-sky-50',
      border: 'border-sky-100'
    },
    {
      key: 'lessons',
      title: t('studentHome.myLessons'),
      icon: BookOpen,
      path: ROUTES.LESSONS.LIST || '/student/lessons',
      accent: 'blue',
      bgLight: 'bg-blue-50',
      border: 'border-blue-100'
    },
    {
      key: 'homework',
      title: t('studentHome.myHomework'),
      icon: ClipboardCheck,
      path: ROUTES.STUDENT_HOMEWORK.HOME || '/student/homework',
      accent: 'purple',
      bgLight: 'bg-purple-50',
      border: 'border-purple-100'
    },
    {
      key: 'exercises',
      title: t('studentHome.myExercises'),
      icon: PenTool,
      path: ROUTES.STUDENT_EXERCISES.LIST || '/student/exercises',
      accent: 'rose',
      bgLight: 'bg-rose-50',
      border: 'border-rose-100'
    },
    {
      key: 'timetable',
      title: t('studentHome.myTimetable'),
      icon: Calendar,
      path: '/student/timetable',
      accent: 'sky',
      bgLight: 'bg-sky-50',
      border: 'border-sky-100'
    },
    {
      key: 'attendance',
      title: t('studentHome.myAttendance'),
      icon: UserCheck,
      path: '/student/attendance/history',
      accent: 'emerald',
      bgLight: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    {
      key: 'messages',
      title: t('studentHome.myMessages'),
      icon: MessageSquare,
      path: '/student/communication/messages',
      accent: 'indigo',
      bgLight: 'bg-indigo-50',
      border: 'border-indigo-100'
    },
    {
      key: 'announcements',
      title: t('studentHome.myAnnouncements'),
      icon: Megaphone,
      path: '/student/communication/announcements',
      accent: 'amber',
      bgLight: 'bg-amber-50',
      border: 'border-amber-100'
    },
  ]), [t])

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
                {t('studentHome.readyToLearn', 'Ready to learn')}
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
                  {t('adminHome.welcomeUser', { name: user?.full_name || t('studentHome.studentLabel', 'Student') })}
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl font-medium">
                  {t('studentHome.helperText', 'Access lessons, homework, and messages in one place.')}
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

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tiles.map((item) => (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={cn(
                "group relative flex flex-col justify-between p-6 rounded-2xl border border-slate-200 bg-white text-left transition-all duration-200",
                "hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5",
                "focus:outline-none focus:ring-2 focus:ring-blue-100",
                "overflow-hidden min-h-[160px]"
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
                  <div className={cn(
                    "text-xs font-medium transition-colors px-2 py-1 rounded-lg border",
                    item.key === 'homework' && pendingHomeworkCount > 0
                      ? "bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-100"
                      : "bg-slate-50 text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 border-slate-100 group-hover:border-blue-100"
                  )}>
                    {item.key === 'homework' && pendingHomeworkCount > 0
                      ? `${pendingHomeworkCount} ${t('studentHome.pending', 'pending')}`
                      : t('studentHome.open', 'Open')}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-[13px] font-medium text-slate-400 group-hover:text-blue-600 transition-all">
                <span>{t('studentHome.tapToStart', 'Access module')}</span>
                <ChevronRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentHome
