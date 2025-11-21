"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  LayoutDashboard,
  Building2,
  Users,
  Wallet,
  MessageSquare,
  Calendar,
  CalendarCheck,
  FileText,
  GraduationCap,
  School,
  ClipboardList,
  Bell
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "./ui/sidebar"
import { useAuth } from "../contexts/AuthContext"
import { useLanguage } from "../hooks/useLanguage"

export function AppSidebar({ ...props }) {
  const { user } = useAuth()
  const { t } = useLanguage()

  // Construct navigation data based on user role and translations
  const data = React.useMemo(() => {
    return {
      user: {
        name: user?.name || "Admin User",
        email: user?.email || "admin@madrasti.com",
        avatar: user?.avatar || "/avatars/shadcn.jpg",
      },
      teams: [
        {
          name: "Madrasti",
          logo: School,
          plan: "Admin",
        },
      ],
      navMain: [
        {
          title: t('sidebar.dashboard', 'Dashboard'),
          url: "/admin",
          icon: LayoutDashboard,
          isActive: true,
          items: [
            {
              title: t('sidebar.overview', 'Overview'),
              url: "/admin",
            },
            {
              title: t('sidebar.analytics', 'Analytics'),
              url: "/admin/analytics",
            },
          ],
        },
        {
          title: t('sidebar.schoolManagement', 'School Management'),
          url: "/admin/school-management",
          icon: Building2,
          items: [
            {
              title: t('sidebar.schools', 'Schools'),
              url: "/admin/school-management/schools",
            },
            {
              title: t('sidebar.centers', 'Centers'),
              url: "/admin/school-management/centers",
            },
            {
              title: t('sidebar.departments', 'Departments'),
              url: "/admin/school-management/departments",
            },
          ],
        },
        {
          title: t('sidebar.academic', 'Academic'),
          url: "/admin/academic",
          icon: GraduationCap,
          items: [
            {
              title: t('sidebar.programs', 'Programs'),
              url: "/admin/academic/programs",
            },
            {
              title: t('sidebar.courses', 'Courses'),
              url: "/admin/academic/courses",
            },
            {
              title: t('sidebar.sessions', 'Sessions'),
              url: "/admin/academic/sessions",
            },
          ],
        },
        {
          title: t('sidebar.people', 'People'),
          url: "/admin/users",
          icon: Users,
          items: [
            {
              title: t('sidebar.students', 'Students'),
              url: "/admin/users/students",
            },
            {
              title: t('sidebar.teachers', 'Teachers'),
              url: "/admin/users/teachers",
            },
            {
              title: t('sidebar.parents', 'Parents'),
              url: "/admin/users/parents",
            },
            {
              title: t('sidebar.staff', 'Staff'),
              url: "/admin/users/staff",
            },
          ],
        },
        {
          title: t('sidebar.finance', 'Finance'),
          url: "/admin/finance",
          icon: Wallet,
          items: [
            {
              title: t('sidebar.financeOverview', 'Overview'),
              url: "/admin/finance",
            },
            {
              title: t('sidebar.fees', 'Fees & Payments'),
              url: "/admin/finance/fees",
            },
            {
              title: t('sidebar.expenses', 'Expenses'),
              url: "/admin/finance/expenses",
            },
          ],
        },
        {
          title: t('sidebar.communication', 'Communication'),
          url: "/admin/communication",
          icon: MessageSquare,
          items: [
            {
              title: t('sidebar.messages', 'Messages'),
              url: "/admin/communication/messages",
            },
            {
              title: t('sidebar.announcements', 'Announcements'),
              url: "/admin/communication/announcements",
            },
          ],
        },
      ],
      projects: [
        {
          name: t('sidebar.attendance', 'Attendance'),
          url: "/admin/attendance",
          icon: ClipboardList,
        },
        {
          name: t('sidebar.schedule', 'Schedule'),
          url: "/admin/schedule",
          icon: Calendar,
        },
        {
          name: t('sidebar.reports', 'Reports'),
          url: "/admin/reports",
          icon: PieChart,
        },
      ],
    }
  }, [user, t])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
