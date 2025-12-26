import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { TeacherPageLayout } from '../../components/teacher/layout'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import {
  User,
  Users,
  GraduationCap,
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
import { cn } from '../../lib/utils'

const TeacherHome = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()

  const tiles = useMemo(() => ([
    { key: 'profile', title: t('teacherHome.myProfile'), icon: User, path: '/teacher/profile/overview', gradient: 'from-sky-500 via-sky-400 to-sky-600' },
    { key: 'students', title: t('teacherHome.myStudents'), icon: Users, path: '/teacher/students/my-students', gradient: 'from-amber-500 via-orange-400 to-amber-600' },
    { key: 'classes', title: t('teacherHome.myClasses'), icon: GraduationCap, path: '/teacher/profile/my-classes', gradient: 'from-emerald-500 via-emerald-400 to-green-600' },
    { key: 'lessons', title: t('teacherHome.myLessons'), icon: BookOpen, path: '/teacher/content/lessons', gradient: 'from-blue-500 via-blue-400 to-indigo-600' },
    { key: 'homework', title: t('teacherHome.myHomework'), icon: ClipboardCheck, path: '/teacher/assignments/homework', gradient: 'from-purple-500 via-violet-400 to-purple-600' },
    { key: 'exercises', title: t('teacherHome.myExercises'), icon: PenTool, path: '/teacher/content/lesson-exercises', gradient: 'from-pink-500 via-rose-400 to-rose-600' },
    { key: 'timetable', title: t('teacherHome.myTimetable'), icon: Calendar, path: '/teacher/profile/my-schedule', gradient: 'from-cyan-500 via-sky-400 to-blue-500' },
    { key: 'attendance', title: t('teacherHome.myAttendance'), icon: UserCheck, path: '/teacher/attendance/history', gradient: 'from-teal-500 via-emerald-400 to-teal-600' },
    { key: 'messages', title: t('teacherHome.myMessages'), icon: MessageSquare, path: '/teacher/communication/messages', gradient: 'from-indigo-500 via-indigo-400 to-blue-700' },
    { key: 'announcements', title: t('teacherHome.myAnnouncements'), icon: Megaphone, path: '/teacher/communication/announcements', gradient: 'from-yellow-500 via-amber-400 to-orange-600' },
  ]), [t])

  return (
    <TeacherPageLayout
      title={t('teacherHome.title')}
      subtitle={t('teacherHome.subtitle')}
      contentClassName="!space-y-0"
      headerClassName="!mb-4"
    >
      <div className="grid gap-4 md:grid-cols-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/10 shadow-lg md:col-span-6 lg:col-span-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_45%)]" />
          <div className="relative p-6 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary dark:text-primary-foreground/90">
              <Sparkles className="w-4 h-4" />
              {t('teacherHome.readyToTeach')}
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{t('teacherHome.greeting')}</p>
              <h2 className="text-3xl font-bold leading-tight">
                {user?.full_name || user?.name || t('teacherHome.teacherLabel')}
              </h2>
              <p className="text-muted-foreground">
                {t('teacherHome.helperText')}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/40 p-3 shadow-sm backdrop-blur dark:bg-black/30">
                <p className="text-xs text-muted-foreground">{t('teacherHome.today')}</p>
                <p className="text-lg font-semibold text-foreground">{t('teacherHome.schedulePreview')}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/40 p-3 shadow-sm backdrop-blur dark:bg-black/30">
                <p className="text-xs text-muted-foreground">{t('teacherHome.quickActions')}</p>
                <p className="text-lg font-semibold text-foreground">{t('teacherHome.touchAnyCard')}</p>
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
                      <Badge variant="secondary" className="bg-white/30 text-white border-white/30 backdrop-blur">
                        {t('teacherHome.open')}
                      </Badge>
                    </div>

                    <div className="space-y-2 pt-2">
                      <p className="text-base font-semibold text-white drop-shadow-sm">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-white/80">
                        <span>{t('teacherHome.tapToStart')}</span>
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
    </TeacherPageLayout>
  )
}

export default TeacherHome
