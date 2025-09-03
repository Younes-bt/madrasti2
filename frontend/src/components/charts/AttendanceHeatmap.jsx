/**
 * Attendance Heatmap Component
 * Displays student attendance patterns over time with calendar-style visualization
 */

import React, { useState, useMemo } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Calendar, Download, TrendingUp } from 'lucide-react';

const AttendanceHeatmap = ({ 
  attendanceData = [],
  studentId = null,
  classId = null,
  startDate = null,
  endDate = null,
  onDateClick = null,
  showControls = true,
  showStats = true 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState('month'); // 'month', 'semester', 'year'

  // Generate calendar data with attendance information
  const calendarData = useMemo(() => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startOfCalendar = new Date(monthStart);
    startOfCalendar.setDate(startOfCalendar.getDate() - monthStart.getDay());
    
    const weeks = [];
    const currentDate = new Date(startOfCalendar);

    // Create 6 weeks of calendar data
    for (let week = 0; week < 6; week++) {
      const days = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const attendanceRecord = attendanceData.find(record => 
          record.date === dateStr
        );

        days.push({
          date: new Date(currentDate),
          dateStr,
          isCurrentMonth: currentDate.getMonth() === currentMonth.getMonth(),
          isToday: dateStr === new Date().toISOString().split('T')[0],
          attendance: attendanceRecord ? {
            total_sessions: attendanceRecord.total_sessions || 0,
            present: attendanceRecord.present || 0,
            absent: attendanceRecord.absent || 0,
            late: attendanceRecord.late || 0,
            excused: attendanceRecord.excused || 0,
            attendance_rate: attendanceRecord.attendance_rate || 0
          } : null
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(days);
    }

    return weeks;
  }, [currentMonth, attendanceData]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!attendanceData.length) return null;

    const totalSessions = attendanceData.reduce((sum, day) => sum + (day.total_sessions || 0), 0);
    const totalPresent = attendanceData.reduce((sum, day) => sum + (day.present || 0), 0);
    const totalAbsent = attendanceData.reduce((sum, day) => sum + (day.absent || 0), 0);
    const totalLate = attendanceData.reduce((sum, day) => sum + (day.late || 0), 0);
    const totalExcused = attendanceData.reduce((sum, day) => sum + (day.excused || 0), 0);

    const overallRate = totalSessions > 0 ? (totalPresent / totalSessions) * 100 : 0;
    const daysWithData = attendanceData.filter(day => day.total_sessions > 0).length;
    
    return {
      totalSessions,
      totalPresent,
      totalAbsent,
      totalLate,
      totalExcused,
      overallRate,
      daysWithData,
      averageDailySessions: daysWithData > 0 ? totalSessions / daysWithData : 0
    };
  }, [attendanceData]);

  // Get color intensity based on attendance rate
  const getIntensityColor = (attendance) => {
    if (!attendance || attendance.total_sessions === 0) {
      return 'bg-gray-100 border-gray-200';
    }

    const rate = attendance.attendance_rate;
    if (rate >= 95) return 'bg-green-500 border-green-600 text-white';
    if (rate >= 85) return 'bg-green-400 border-green-500 text-white';
    if (rate >= 75) return 'bg-yellow-400 border-yellow-500 text-white';
    if (rate >= 60) return 'bg-orange-400 border-orange-500 text-white';
    return 'bg-red-400 border-red-500 text-white';
  };

  // Get tooltip content
  const getTooltipContent = (day) => {
    if (!day.attendance) {
      return `${day.date.toLocaleDateString()} - No sessions`;
    }

    const { total_sessions, present, absent, late, excused, attendance_rate } = day.attendance;
    return (
      <div className="text-xs space-y-1">
        <div className="font-semibold">{day.date.toLocaleDateString()}</div>
        <div>Sessions: {total_sessions}</div>
        <div className="text-green-600">Present: {present}</div>
        <div className="text-red-600">Absent: {absent}</div>
        <div className="text-yellow-600">Late: {late}</div>
        {excused > 0 && <div className="text-blue-600">Excused: {excused}</div>}
        <div className="font-semibold">Rate: {attendance_rate.toFixed(1)}%</div>
      </div>
    );
  };

  // Navigation functions
  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const exportData = () => {
    // Create CSV export
    const csvData = attendanceData.map(day => ({
      Date: day.date,
      'Total Sessions': day.total_sessions || 0,
      Present: day.present || 0,
      Absent: day.absent || 0,
      Late: day.late || 0,
      Excused: day.excused || 0,
      'Attendance Rate': day.attendance_rate || 0
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_data_${currentMonth.toISOString().slice(0, 7)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Attendance Heatmap
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Visual representation of attendance patterns over time
          </p>
        </div>

        {showControls && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={exportData} className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth(-1)}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <h4 className="text-lg font-medium">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h4>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth(1)}
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar weeks */}
        {calendarData.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`
                  relative aspect-square border rounded-lg p-1 cursor-pointer transition-all duration-200 hover:scale-105
                  ${getIntensityColor(day.attendance)}
                  ${!day.isCurrentMonth ? 'opacity-40' : ''}
                  ${day.isToday ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                `}
                onClick={() => onDateClick?.(day)}
                title={getTooltipContent(day)}
              >
                {/* Date number */}
                <div className="text-xs font-medium">
                  {day.date.getDate()}
                </div>

                {/* Attendance indicator */}
                {day.attendance && day.attendance.total_sessions > 0 && (
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-current rounded-full opacity-60" />
                )}

                {/* Today indicator */}
                {day.isToday && (
                  <div className="absolute top-0 left-0 w-1 h-1 bg-blue-500 rounded-full" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
            <span className="text-xs text-gray-600">No sessions</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 border border-red-500 rounded"></div>
            <span className="text-xs text-gray-600">{"<60%"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-400 border border-orange-500 rounded"></div>
            <span className="text-xs text-gray-600">60-74%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 border border-yellow-500 rounded"></div>
            <span className="text-xs text-gray-600">75-84%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 border border-green-500 rounded"></div>
            <span className="text-xs text-gray-600">85-94%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 border border-green-600 rounded"></div>
            <span className="text-xs text-gray-600">{"≥95%"}</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {showStats && stats && (
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{stats.overallRate.toFixed(1)}%</div>
              <div className="text-xs text-gray-600">Overall Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-700">{stats.totalSessions}</div>
              <div className="text-xs text-gray-600">Total Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{stats.totalPresent}</div>
              <div className="text-xs text-gray-600">Present</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{stats.totalAbsent}</div>
              <div className="text-xs text-gray-600">Absent</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">{stats.totalLate}</div>
              <div className="text-xs text-gray-600">Late</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{stats.totalExcused}</div>
              <div className="text-xs text-gray-600">Excused</div>
            </div>
          </div>
        </div>
      )}

      {/* Trend indicator */}
      {stats && stats.overallRate > 0 && (
        <div className="mt-4 flex items-center justify-center">
          <Badge 
            variant={stats.overallRate >= 85 ? 'success' : stats.overallRate >= 75 ? 'warning' : 'destructive'}
            className="flex items-center gap-1"
          >
            <TrendingUp className="w-3 h-3" />
            {stats.overallRate >= 85 ? 'Excellent' : stats.overallRate >= 75 ? 'Good' : 'Needs Improvement'} Attendance
          </Badge>
        </div>
      )}
    </Card>
  );
};

export default AttendanceHeatmap;