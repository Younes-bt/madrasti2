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
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { cn } from '../../lib/utils'
import { ROUTES } from '../../utils/constants'

const StudentHome = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { summary: homeworkSummary } = useStudentHomeworks({ status: 'pending' })
  const pendingHomeworkCount = homeworkSummary?.pending || 0

  const tiles = useMemo(() => ([
    { key: 'profile', title: t('studentHome.myProfile'), icon: User, path: '/student/profile/overview', gradient: 'from-sky-500 via-sky-400 to-sky-600' },
    { key: 'lessons', title: t('studentHome.myLessons'), icon: BookOpen, path: ROUTES.LESSONS.LIST || '/student/lessons', gradient: 'from-blue-500 via-blue-400 to-indigo-600' },
    { key: 'homework', title: t('studentHome.myHomework'), icon: ClipboardCheck, path: ROUTES.STUDENT_HOMEWORK.HOME || '/student/homework', gradient: 'from-purple-500 via-violet-400 to-purple-600' },
    { key: 'exercises', title: t('studentHome.myExercises'), icon: PenTool, path: ROUTES.STUDENT_EXERCISES.LIST || '/student/exercises', gradient: 'from-pink-500 via-rose-400 to-rose-600' },
    { key: 'timetable', title: t('studentHome.myTimetable'), icon: Calendar, path: '/student/timetable', gradient: 'from-cyan-500 via-sky-400 to-blue-500' },
    { key: 'attendance', title: t('studentHome.myAttendance'), icon: UserCheck, path: '/student/attendance/history', gradient: 'from-emerald-500 via-emerald-400 to-teal-600' },
    { key: 'messages', title: t('studentHome.myMessages'), icon: MessageSquare, path: '/student/communication/messages', gradient: 'from-indigo-500 via-indigo-400 to-blue-700' },
    { key: 'announcements', title: t('studentHome.myAnnouncements'), icon: Megaphone, path: '/student/communication/announcements', gradient: 'from-yellow-500 via-amber-400 to-orange-600' },
  ]), [t])

  return (
    <DashboardLayout user={user}>
      <div className="mx-auto max-w-7xl p-2 sm:p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
        <div className="grid gap-4 md:grid-cols-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/10 shadow-lg md:col-span-6 lg:col-span-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_45%)]" />
            <div className="relative p-6 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary dark:text-primary-foreground/90">
                <Sparkles className="w-4 h-4" />
                {t('studentHome.readyToLearn', 'Ready to learn')}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{t('studentHome.greeting', 'Welcome back,')}</p>
                <h2 className="text-3xl font-bold leading-tight">
                  {user?.full_name || user?.name || t('studentHome.studentLabel', 'Student')}
                </h2>
                <p className="text-muted-foreground">
                  {t('studentHome.helperText', 'Access lessons, homework, and messages in one place.')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/40 p-3 shadow-sm backdrop-blur dark:bg-black/30">
                  <p className="text-xs text-muted-foreground">{t('studentHome.today', 'Today')}</p>
                  <p className="text-lg font-semibold text-foreground">{t('studentHome.schedulePreview', 'Today’s schedule')}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/40 p-3 shadow-sm backdrop-blur dark:bg-black/30">
                  <p className="text-xs text-muted-foreground">{t('studentHome.quickActions', 'Quick actions')}</p>
                  <p className="text-lg font-semibold text-foreground">{t('studentHome.touchAnyCard', 'Tap a tile')}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="md:col-span-6 lg:col-span-6 bg-card/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur border border-border/60">
            <div className="p-3 md:p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 md:gap-4">
                {tiles.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      'group relative overflow-hidden rounded-2xl border border-border/60 bg-card text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      'min-h-[140px]'
                    )}
                  >
                    <div className={cn(
                      'absolute inset-0 opacity-70 transition-opacity duration-300 group-hover:opacity-90',
                      'bg-gradient-to-br',
                      item.gradient
                    )} />
                    <div className="absolute inset-0 bg-white/10 dark:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative z-10 flex h-full flex-col justify-between p-4">
                      <div className="flex items-center justify-between">
                        <div className="rounded-2xl bg-white/20 p-2 text-white shadow-inner backdrop-blur">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'border-white/30 backdrop-blur',
                            item.key === 'homework' && pendingHomeworkCount > 0
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-white/30 text-white'
                          )}
                        >
                          {item.key === 'homework' && pendingHomeworkCount > 0
                            ? `${pendingHomeworkCount} pending`
                            : t('studentHome.open', 'Open')}
                        </Badge>
                      </div>

                      <div className="space-y-2 pt-2">
                        <p className="text-base font-semibold text-white drop-shadow-sm">
                          {item.key === 'homework' && pendingHomeworkCount > 0
                            ? `${item.title} (${pendingHomeworkCount})`
                            : item.title}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-white/80">
                          <span>{t('studentHome.tapToStart', 'Tap to start')}</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentHome
