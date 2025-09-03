/**
 * Attendance Page - Main attendance interface for all user roles
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import AttendanceHeatmap from '../../components/charts/AttendanceHeatmap';
import SessionWorkflow from '../../components/attendance/SessionWorkflow';
import BulkAttendanceOperations from '../../components/attendance/BulkAttendanceOperations';
import AttendanceReporting from '../../components/attendance/AttendanceReporting';
import { 
  UserCheck, 
  Calendar, 
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Filter,
  Download,
  Plus,
  Play,
  Activity,
  FileBarChart
} from 'lucide-react';
import Layout from '../../components/layout/Layout';

const AttendancePage = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState('heatmap'); // 'heatmap', 'sessions', 'reports'

  // Mock attendance heatmap data
  const mockAttendanceData = [
    { date: '2025-09-01', total_sessions: 6, present: 6, absent: 0, late: 0, excused: 0, attendance_rate: 100 },
    { date: '2025-09-02', total_sessions: 5, present: 4, absent: 1, late: 0, excused: 0, attendance_rate: 80 },
    { date: '2025-09-03', total_sessions: 6, present: 5, absent: 0, late: 1, excused: 0, attendance_rate: 83.3 },
    { date: '2025-09-04', total_sessions: 6, present: 6, absent: 0, late: 0, excused: 0, attendance_rate: 100 },
    { date: '2025-09-05', total_sessions: 4, present: 3, absent: 1, late: 0, excused: 1, attendance_rate: 75 },
    // Add more mock data...
  ];

  // Mock session data
  const mockSessions = [
    {
      id: 1,
      subject: 'Mathematics',
      subject_arabic: 'الرياضيات',
      teacher: 'Mr. Ahmed Hassan',
      class: '9A',
      room: 'Room 101',
      start_time: '08:00',
      end_time: '08:45',
      date: '2025-09-03',
      status: user?.role === 'TEACHER' ? 'not_started' : 'scheduled',
      attendance_marked: user?.role === 'TEACHER' ? false : undefined,
      student_status: user?.role === 'STUDENT' ? 'present' : undefined,
      total_students: 25,
      present_count: 23,
      absent_count: 2,
      late_count: 0
    },
    {
      id: 2,
      subject: 'Biology',
      subject_arabic: 'الأحياء',
      teacher: 'Dr. Sarah Ahmed',
      class: '9A',
      room: 'Lab 201',
      start_time: '09:00',
      end_time: '09:45',
      date: '2025-09-03',
      status: user?.role === 'TEACHER' ? 'completed' : 'attended',
      attendance_marked: user?.role === 'TEACHER' ? true : undefined,
      student_status: user?.role === 'STUDENT' ? 'present' : undefined,
      total_students: 25,
      present_count: 24,
      absent_count: 1,
      late_count: 0
    },
    {
      id: 3,
      subject: 'French',
      subject_arabic: 'الفرنسية',
      teacher: 'Mme. Marie Dubois',
      class: '9A',
      room: 'Room 205',
      start_time: '10:15',
      end_time: '11:00',
      date: '2025-09-03',
      status: user?.role === 'TEACHER' ? 'in_progress' : 'current',
      attendance_marked: user?.role === 'TEACHER' ? false : undefined,
      student_status: user?.role === 'STUDENT' ? 'present' : undefined,
      total_students: 25,
      present_count: 22,
      absent_count: 2,
      late_count: 1
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAttendanceData(mockAttendanceData);
      setSessions(mockSessions);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      present: 'bg-green-100 text-green-700',
      absent: 'bg-red-100 text-red-700',
      late: 'bg-yellow-100 text-yellow-700',
      excused: 'bg-blue-100 text-blue-700',
      not_started: 'bg-gray-100 text-gray-700',
      in_progress: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      scheduled: 'bg-gray-100 text-gray-700',
      current: 'bg-blue-100 text-blue-700',
      attended: 'bg-green-100 text-green-700'
    };
    return colors[status] || colors.scheduled;
  };

  const getStatusIcon = (status) => {
    const icons = {
      present: CheckCircle,
      absent: XCircle,
      late: AlertCircle,
      excused: CheckCircle,
      not_started: Clock,
      in_progress: Play,
      completed: CheckCircle,
      scheduled: Calendar,
      current: Play,
      attended: CheckCircle
    };
    const Icon = icons[status] || Calendar;
    return <Icon className="w-4 h-4" />;
  };

  // Calculate attendance statistics
  const attendanceStats = attendanceData.length > 0 ? {
    totalSessions: attendanceData.reduce((sum, day) => sum + day.total_sessions, 0),
    totalPresent: attendanceData.reduce((sum, day) => sum + day.present, 0),
    totalAbsent: attendanceData.reduce((sum, day) => sum + day.absent, 0),
    totalLate: attendanceData.reduce((sum, day) => sum + day.late, 0),
    averageRate: attendanceData.reduce((sum, day) => sum + day.attendance_rate, 0) / attendanceData.length
  } : { totalSessions: 0, totalPresent: 0, totalAbsent: 0, totalLate: 0, averageRate: 0 };

  const isTeacher = user?.role === 'TEACHER';
  const isStudent = user?.role === 'STUDENT';
  const isParent = user?.role === 'PARENT';

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-blue-600" />
              {isTeacher && 'Class Attendance'}
              {isStudent && 'My Attendance'}
              {isParent && 'Children Attendance'}
              {!isTeacher && !isStudent && !isParent && 'Attendance Management'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isTeacher && 'Mark and track student attendance for your classes'}
              {isStudent && 'View your attendance records and schedule'}
              {isParent && 'Monitor your children\'s attendance'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-300">
              <Button
                variant={viewMode === 'heatmap' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('heatmap')}
                className="rounded-r-none"
              >
                Heatmap
              </Button>
              <Button
                variant={viewMode === 'sessions' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('sessions')}
                className="rounded-none"
              >
                Sessions
              </Button>
              <Button
                variant={viewMode === 'reports' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('reports')}
                className="rounded-l-none"
              >
                Reports
              </Button>
            </div>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{attendanceStats.totalSessions}</div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{attendanceStats.totalPresent}</div>
            <div className="text-sm text-gray-600">Present</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{attendanceStats.totalAbsent}</div>
            <div className="text-sm text-gray-600">Absent</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 flex items-center justify-center gap-1">
              <TrendingUp className="w-5 h-5" />
              {attendanceStats.averageRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Attendance Rate</div>
          </Card>
        </div>

        {/* Main Content Based on View Mode */}
        {viewMode === 'heatmap' && (
          <AttendanceHeatmap 
            attendanceData={attendanceData}
            onDateClick={(day) => console.log('Date clicked:', day)}
          />
        )}

        {viewMode === 'sessions' && (
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">
                  {isTeacher ? 'Today\'s Sessions' : isStudent ? 'My Schedule' : 'Sessions'}
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value="2025-09-03"
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                  />
                  {isTeacher && (
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Session
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="text-center min-w-[60px]">
                        <div className="text-sm font-medium">{session.start_time}</div>
                        <div className="text-xs text-gray-500">{session.end_time}</div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{session.subject}</h4>
                          <Badge className={getStatusColor(session.status)}>
                            {getStatusIcon(session.status)}
                            <span className="ml-1 capitalize">
                              {session.status.replace('_', ' ')}
                            </span>
                          </Badge>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 space-x-4">
                          <span>👨‍🏫 {session.teacher}</span>
                          <span>🏫 {session.class}</span>
                          <span>🚪 {session.room}</span>
                          {isTeacher && session.attendance_marked && (
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {session.present_count}/{session.total_students} present
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isTeacher && (
                        <>
                          {session.status === 'not_started' && (
                            <Button size="sm">
                              Start Session
                            </Button>
                          )}
                          {session.status === 'in_progress' && (
                            <Button size="sm" variant="outline">
                              Mark Attendance
                            </Button>
                          )}
                          {session.status === 'completed' && (
                            <Button size="sm" variant="outline">
                              View Report
                            </Button>
                          )}
                        </>
                      )}
                      
                      {isStudent && session.student_status && (
                        <Badge className={getStatusColor(session.student_status)}>
                          {getStatusIcon(session.student_status)}
                          <span className="ml-1 capitalize">{session.student_status}</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {viewMode === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Weekly Attendance Trend</h3>
              <div className="space-y-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm">{day}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${85 + index * 3}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{85 + index * 3}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Subject-wise Attendance</h3>
              <div className="space-y-3">
                {['Mathematics', 'Biology', 'French', 'Physics', 'Chemistry'].map((subject) => (
                  <div key={subject} className="flex items-center justify-between">
                    <span className="text-sm">{subject}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${Math.random() * 20 + 80}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {Math.floor(Math.random() * 20 + 80)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {isParent && (
              <Card className="p-6 col-span-full">
                <h3 className="font-semibold mb-4">Absence Flags</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <div className="font-medium text-red-900">Consecutive Absences</div>
                        <div className="text-sm text-red-700">Ahmad missed 3 consecutive Math classes</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Resolve
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <div>
                        <div className="font-medium text-yellow-900">Late Pattern</div>
                        <div className="text-sm text-yellow-700">Frequent late arrivals to first period</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Today's Quick Actions (for Teachers) */}
        {isTeacher && viewMode === 'sessions' && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">Quick Actions</h3>
                <p className="text-sm text-blue-700">Manage today's attendance sessions</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm">
                  Bulk Mark Present
                </Button>
                <Button size="sm" variant="outline">
                  Generate Report
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AttendancePage;