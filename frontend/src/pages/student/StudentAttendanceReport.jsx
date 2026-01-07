import React from 'react'
import { DashboardLayout } from '../../components/layout/Layout'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import StudentAttendanceReportContent from '../../components/attendance/StudentAttendanceReportContent'

const StudentAttendanceReport = () => {
  const { t } = useLanguage()
  const { user } = useAuth()

  return (
    <DashboardLayout user={user}>
      <StudentAttendanceReportContent
        studentId={user?.id}
        title={t('studentSidebar.attendance.myReport', 'My Attendance Report')}
        subtitle={t(
          'studentAttendanceReport.subtitle',
          'Track your attendance, identify patterns, and stay on top of your commitments.'
        )}
      />
    </DashboardLayout>
  )
}

export default StudentAttendanceReport

