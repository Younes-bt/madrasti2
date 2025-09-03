import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useLanguage } from '../../hooks/useLanguage'
import { 
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Users,
  MapPin,
  BookOpen,
  User,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Upload,
  Save,
  RotateCcw
} from 'lucide-react'

const TimetableManagement = () => {
  const { t } = useLanguage()
  const [selectedWeek, setSelectedWeek] = useState(new Date())
  const [viewMode, setViewMode] = useState('week') // week, day, class
  const [selectedClass, setSelectedClass] = useState('1ere_c')
  const [isEditing, setIsEditing] = useState(false)

  const classes = [
    { id: '1ere_c', name: '1ère Année C', students: 24 },
    { id: '1ere_b', name: '1ère Année B', students: 26 },
    { id: '2eme_a', name: '2ème Année A', students: 22 },
    { id: '3eme_c', name: '3ème Année C', students: 20 }
  ]

  const timeSlots = [
    { id: 1, start: '08:00', end: '09:00', period: 1 },
    { id: 2, start: '09:00', end: '10:00', period: 2 },
    { id: 3, start: '10:00', end: '11:00', period: 3 },
    { id: 4, start: '11:20', end: '12:20', period: 4 }, // Break between 11:00-11:20
    { id: 5, start: '12:20', end: '13:20', period: 5 },
    { id: 6, start: '14:30', end: '15:30', period: 6 }, // Lunch break 13:20-14:30
    { id: 7, start: '15:30', end: '16:30', period: 7 }
  ]

  const weekDays = [
    { key: 'monday', name: t('calendar.monday'), date: '2024-09-02' },
    { key: 'tuesday', name: t('calendar.tuesday'), date: '2024-09-03' },
    { key: 'wednesday', name: t('calendar.wednesday'), date: '2024-09-04' },
    { key: 'thursday', name: t('calendar.thursday'), date: '2024-09-05' },
    { key: 'friday', name: t('calendar.friday'), date: '2024-09-06' }
  ]

  const timetableData = {
    '1ere_c': {
      monday: [
        { period: 1, subject: 'Mathematics', teacher: 'Mr. Alami', room: 'Salle 101', type: 'course' },
        { period: 2, subject: 'Physics', teacher: 'Mrs. Bennani', room: 'Lab 1', type: 'lab' },
        { period: 3, subject: 'Arabic', teacher: 'Mr. Tazi', room: 'Salle 203', type: 'course' },
        { period: 4, subject: 'Chemistry', teacher: 'Dr. Alaoui', room: 'Lab 2', type: 'lab' },
        { period: 5, subject: 'French', teacher: 'Mrs. Mansouri', room: 'Salle 105', type: 'course' },
        null, // Free period
        { period: 7, subject: 'Sports', teacher: 'Coach Hassan', room: 'Gymnasium', type: 'activity' }
      ],
      tuesday: [
        { period: 1, subject: 'Chemistry', teacher: 'Dr. Alaoui', room: 'Salle 102', type: 'course' },
        { period: 2, subject: 'Mathematics', teacher: 'Mr. Alami', room: 'Salle 101', type: 'course' },
        { period: 3, subject: 'French', teacher: 'Mrs. Mansouri', room: 'Salle 105', type: 'course' },
        { period: 4, subject: 'Physics', teacher: 'Mrs. Bennani', room: 'Salle 204', type: 'course' },
        { period: 5, subject: 'Arabic', teacher: 'Mr. Tazi', room: 'Salle 203', type: 'course' },
        { period: 6, subject: 'Computer Science', teacher: 'Mr. Benali', room: 'IT Lab', type: 'lab' },
        null // Free period
      ]
      // ... more days would be added
    }
  }

  const getSessionTypeColor = (type) => {
    const colors = {
      course: 'bg-blue-100 text-blue-800 border-blue-200',
      lab: 'bg-green-100 text-green-800 border-green-200',
      activity: 'bg-purple-100 text-purple-800 border-purple-200',
      exam: 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[type] || colors.course
  }

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedWeek)
    newDate.setDate(newDate.getDate() + (direction * 7))
    setSelectedWeek(newDate)
  }

  const addSession = (day, period) => {
    console.log('Add session:', day, period)
    // Open session creation modal
  }

  const editSession = (session) => {
    console.log('Edit session:', session)
    // Open session edit modal
  }

  const deleteSession = (session) => {
    console.log('Delete session:', session)
    // Confirm and delete session
  }

  const duplicateSession = (session) => {
    console.log('Duplicate session:', session)
    // Duplicate session to another time/day
  }

  const exportTimetable = () => {
    console.log('Export timetable for class:', selectedClass)
    // Export to PDF/Excel
  }

  const importTimetable = () => {
    console.log('Import timetable')
    // Import from file
  }

  const saveTimetable = () => {
    console.log('Save timetable changes')
    // Save to API
    setIsEditing(false)
  }

  const currentTimetable = timetableData[selectedClass] || {}

  return (
    <Card className="max-w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              {t('attendance.timetableManagement')}
            </CardTitle>
            <CardDescription>
              {t('attendance.timetableDescription')}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={importTimetable}>
              <Upload className="h-4 w-4 mr-1" />
              {t('common.import')}
            </Button>
            <Button variant="outline" size="sm" onClick={exportTimetable}>
              <Download className="h-4 w-4 mr-1" />
              {t('common.export')}
            </Button>
            {isEditing ? (
              <div className="flex gap-1">
                <Button size="sm" onClick={saveTimetable}>
                  <Save className="h-4 w-4 mr-1" />
                  {t('common.save')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  {t('common.cancel')}
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-1" />
                {t('common.edit')}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Class Selector */}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.students} {t('student.students')})
                </option>
              ))}
            </select>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateWeek(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-3">
              {selectedWeek.toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateWeek(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedWeek(new Date())}>
              {t('calendar.today')}
            </Button>
          </div>

          {/* View Mode */}
          <div className="flex gap-1">
            <Button 
              variant={viewMode === 'week' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('week')}
            >
              {t('calendar.week')}
            </Button>
            <Button 
              variant={viewMode === 'day' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('day')}
            >
              {t('calendar.day')}
            </Button>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="border rounded-lg overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-6 bg-muted/50">
            <div className="p-3 border-r border-border font-medium text-sm">
              {t('attendance.period')}
            </div>
            {weekDays.map((day) => (
              <div key={day.key} className="p-3 border-r border-border text-center">
                <div className="font-medium text-sm">{day.name}</div>
                <div className="text-xs text-muted-foreground">{day.date}</div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {timeSlots.map((slot) => (
            <div key={slot.id} className="grid grid-cols-6 border-t border-border">
              {/* Time Column */}
              <div className="p-3 border-r border-border bg-muted/30">
                <div className="text-sm font-medium">
                  {t('attendance.period')} {slot.period}
                </div>
                <div className="text-xs text-muted-foreground">
                  {slot.start} - {slot.end}
                </div>
              </div>

              {/* Days */}
              {weekDays.map((day) => {
                const session = currentTimetable[day.key]?.[slot.period - 1]
                
                return (
                  <div key={day.key} className="p-2 border-r border-border min-h-[80px]">
                    {session ? (
                      <div className={`p-2 rounded border ${getSessionTypeColor(session.type)} h-full`}>
                        <div className="flex items-start justify-between mb-1">
                          <div className="text-xs font-medium truncate">
                            {session.subject}
                          </div>
                          {isEditing && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => editSession(session)}
                                className="p-1 hover:bg-white/50 rounded"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => duplicateSession(session)}
                                className="p-1 hover:bg-white/50 rounded"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => deleteSession(session)}
                                className="p-1 hover:bg-white/50 rounded text-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span className="truncate">{session.teacher}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{session.room}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full border-2 border-dashed border-gray-200 rounded flex items-center justify-center">
                        {isEditing ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addSession(day.key, slot.period)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {t('attendance.freeTime')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
            <span>{t('attendance.course')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
            <span>{t('attendance.lab')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded"></div>
            <span>{t('attendance.activity')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
            <span>{t('attendance.exam')}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3 p-3 bg-accent/30 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">32</div>
            <div className="text-xs text-muted-foreground">{t('attendance.weeklyHours')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">7</div>
            <div className="text-xs text-muted-foreground">{t('attendance.subjects')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">5</div>
            <div className="text-xs text-muted-foreground">{t('attendance.teachers')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">8</div>
            <div className="text-xs text-muted-foreground">{t('attendance.rooms')}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => console.log('Generate attendance sessions')}>
            <Calendar className="h-4 w-4 mr-1" />
            {t('attendance.generateSessions')}
          </Button>
          <Button variant="outline" onClick={() => console.log('Check conflicts')}>
            <Eye className="h-4 w-4 mr-1" />
            {t('attendance.checkConflicts')}
          </Button>
          <Button variant="outline" onClick={() => console.log('Copy from template')}>
            <Copy className="h-4 w-4 mr-1" />
            {t('attendance.copyTemplate')}
          </Button>
          <Button variant="outline" onClick={() => console.log('Reset timetable')}>
            <RotateCcw className="h-4 w-4 mr-1" />
            {t('common.reset')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default TimetableManagement