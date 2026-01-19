import api from './client';

export interface TimetableSession {
    id: number;
    day_of_week: number;
    session_order: number;
    start_time: string;
    end_time: string;
    subject_name: string;
    subject_name_arabic?: string;
    teacher_name?: string;
    class_name?: string;
    school_class_name?: string;
    room_name?: string;
    timetable?: {
        school_class_name?: string;
        school_class?: number;
    };
    subject?: number;
    room?: number;
}

export interface MyScheduleResponse {
    sessions: TimetableSession[];
    academic_year?: string;
    class?: {
        id: number;
        name: string;
    };
}

// Attendance Interfaces
export interface MonthlyStats {
    month: string;
    month_name: string;
    present: number;
    absent: number;
    late: number;
    excused: number;
    total_sessions: number;
    attendance_rate: number;
}

export interface SubjectStats {
    subject_id: number;
    subject_name: string;
    present: number;
    absent: number;
    late: number;
    excused: number;
    total_sessions: number;
    attendance_rate: number;
}

export interface RecentHistoryItem {
    date: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    status_display: string;
    subject_name: string;
    session_order: number;
}

export interface AttendanceStats {
    present_count: number;
    absent_count: number;
    late_count: number;
    excused_count: number;
    total_sessions: number;
    presence_rate: number;
    absence_rate: number;
    attendance_rate: number;
    monthly_breakdown: MonthlyStats[];
    subject_breakdown: SubjectStats[];
    recent_history: RecentHistoryItem[];
}

export interface AbsenceFlag {
    id: number;
    student: number;
    attendance_date: string;
    subject_name: string;
    created_at: string;
    status: string;
    session_order?: number;
}

export interface PendingFlagsResponse {
    pending_flags: AbsenceFlag[];
    count: number;
}

export const getTimetableSessions = async (params: { my_sessions?: boolean } = {}) => {
    try {
        const response = await api.get('/attendance/timetable-sessions/', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching timetable sessions:', error);
        throw error;
    }
};

export const getMySchedule = async (): Promise<MyScheduleResponse> => {
    try {
        const response = await api.get('/attendance/timetable-sessions/my_schedule/');
        return response.data;
    } catch (error) {
        console.error('Error fetching my schedule:', error);
        throw error;
    }
};

export const getStudentStatistics = async (studentId: number): Promise<AttendanceStats> => {
    try {
        // Correct endpoint matching web: attendance/records/student-statistics/${studentId}/
        const response = await api.get(`/attendance/records/student-statistics/${studentId}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching student statistics:', error);
        throw error;
    }
};

export const getPendingAbsenceFlags = async (params: { student_id: number }): Promise<PendingFlagsResponse> => {
    try {
        const response = await api.get('/attendance/absence-flags/pending/', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching pending flags:', error);
        throw error;
    }
};

export default {
    getTimetableSessions,
    getMySchedule,
    getStudentStatistics,
    getPendingAbsenceFlags,
};
