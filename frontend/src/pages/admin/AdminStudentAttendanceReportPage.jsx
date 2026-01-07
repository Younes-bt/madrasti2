import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout'
import StudentAttendanceReportContent from '../../components/attendance/StudentAttendanceReportContent'
import StudentInfoCard from '../../components/attendance/StudentInfoCard'
import usersService from '../../services/users'

const AdminStudentAttendanceReportPage = () => {
    const { t } = useLanguage()
    const { studentId } = useParams()
    const [student, setStudent] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStudentInfo = async () => {
            if (!studentId) return
            setLoading(true)
            try {
                const data = await usersService.getUserById(studentId)
                setStudent(data)
            } catch (error) {
                console.error('Failed to fetch student info:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStudentInfo()
    }, [studentId])

    return (
        <AdminPageLayout
            title={t('attendance.studentReport', 'Student Attendance Report')}
            subtitle={t('attendance.studentReportDescription', "Detailed view of the student's attendance record and statistics.")}
            showBackButton={true}
        >
            <StudentInfoCard student={student} loading={loading} />

            <StudentAttendanceReportContent
                studentId={studentId}
                showHistoryButton={false}
            />
        </AdminPageLayout>
    )
}

export default AdminStudentAttendanceReportPage
