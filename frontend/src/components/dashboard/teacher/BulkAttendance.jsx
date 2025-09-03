import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  UserCheck,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Check,
  X,
  MoreHorizontal,
  Filter,
  Search,
  Download
} from 'lucide-react'

const BulkAttendance = () => {
  const { t } = useLanguage()
  const [selectedStudents, setSelectedStudents] = useState([])
  const [bulkAction, setBulkAction] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, not_marked, present, absent, late

  const [students] = useState([
    { id: 1, name: 'Ahmed Hassan', status: 'not_marked', class: '1ère C', notes: '' },
    { id: 2, name: 'Fatima Al-Zahra', status: 'present', class: '1ère C', notes: '' },
    { id: 3, name: 'Omar Benali', status: 'absent', class: '1ère C', notes: 'Medical' },
    { id: 4, name: 'Aisha Mansour', status: 'not_marked', class: '1ère C', notes: '' },
    { id: 5, name: 'Mohamed Cherif', status: 'late', class: '1ère C', notes: '' },
    { id: 6, name: 'Salma Alaoui', status: 'not_marked', class: '1ère C', notes: '' },
    { id: 7, name: 'Youssef Tazi', status: 'not_marked', class: '1ère C', notes: '' },
    { id: 8, name: 'Khadija Benjelloun', status: 'present', class: '1ère C', notes: '' },
    { id: 9, name: 'Hassan Alami', status: 'not_marked', class: '1ère C', notes: '' },
    { id: 10, name: 'Nadia Squalli', status: 'not_marked', class: '1ère C', notes: '' }
  ])

  const filteredStudents = students.filter(student => {
    if (filterStatus === 'all') return true
    return student.status === filterStatus
  })

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id))
    }
  }

  const handleBulkAction = (action) => {
    if (selectedStudents.length === 0) return
    
    console.log(`Bulk ${action} for students:`, selectedStudents)
    // API call to update attendance for selected students
    
    // Reset selections after action
    setSelectedStudents([])
    setBulkAction('')
  }

  const getStatusBadge = (status) => {
    const styles = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800', 
      late: 'bg-yellow-100 text-yellow-800',
      not_marked: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <Badge className={styles[status] || styles.not_marked}>
        {t(`attendance.${status}`)}
      </Badge>
    )
  }

  const getStatusCounts = () => {
    const counts = students.reduce((acc, student) => {
      acc[student.status] = (acc[student.status] || 0) + 1
      return acc
    }, {})
    
    return {
      total: students.length,
      present: counts.present || 0,
      absent: counts.absent || 0,
      late: counts.late || 0,
      not_marked: counts.not_marked || 0
    }
  }

  const counts = getStatusCounts()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-blue-500" />
              {t('teacher.bulkAttendance')}
            </CardTitle>
            <CardDescription>
              {t('teacher.bulkAttendanceDescription')}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              {t('common.export')}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-5 gap-3 p-3 bg-accent/30 rounded-lg">
          <div className="text-center">
            <div className="text-sm font-bold">{counts.total}</div>
            <div className="text-xs text-muted-foreground">{t('common.total')}</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-green-600">{counts.present}</div>
            <div className="text-xs text-muted-foreground">{t('attendance.present')}</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-red-600">{counts.absent}</div>
            <div className="text-xs text-muted-foreground">{t('attendance.absent')}</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-yellow-600">{counts.late}</div>
            <div className="text-xs text-muted-foreground">{t('attendance.late')}</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-gray-600">{counts.not_marked}</div>
            <div className="text-xs text-muted-foreground">{t('attendance.not_marked')}</div>
          </div>
        </div>

        {/* Filters and Bulk Actions */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="all">{t('common.all')}</option>
              <option value="not_marked">{t('attendance.not_marked')}</option>
              <option value="present">{t('attendance.present')}</option>
              <option value="absent">{t('attendance.absent')}</option>
              <option value="late">{t('attendance.late')}</option>
            </select>
          </div>

          {selectedStudents.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedStudents.length} {t('common.selected')}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('present')}
                className="text-green-700 hover:bg-green-50"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                {t('teacher.markPresent')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('absent')}
                className="text-red-700 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-1" />
                {t('teacher.markAbsent')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('late')}
                className="text-yellow-700 hover:bg-yellow-50"
              >
                <Clock className="h-4 w-4 mr-1" />
                {t('teacher.markLate')}
              </Button>
            </div>
          )}
        </div>

        {/* Student List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                onChange={handleSelectAll}
                className="rounded"
              />
              <span className="text-sm font-medium">{t('student.student')}</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span>{t('attendance.status')}</span>
              <span className="w-8"></span>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className={`flex items-center justify-between p-2 border rounded-lg hover:bg-accent/50 transition-colors ${
                  selectedStudents.includes(student.id) ? 'bg-blue-50 border-blue-200' : 'bg-card'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleSelectStudent(student.id)}
                    className="rounded"
                  />
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{student.name}</div>
                    <div className="text-xs text-muted-foreground">{student.class}</div>
                    {student.notes && (
                      <div className="text-xs text-muted-foreground italic">{student.notes}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusBadge(student.status)}
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <p>{t('common.noResults')}</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => handleBulkAction('present')}
            disabled={counts.not_marked === 0}
          >
            <Check className="h-4 w-4 mr-1" />
            {t('teacher.markAllPresent')}
          </Button>
          <Button
            variant="outline" 
            onClick={() => handleBulkAction('absent')}
            disabled={counts.not_marked === 0}
          >
            <X className="h-4 w-4 mr-1" />
            {t('teacher.markAllAbsent')}
          </Button>
          <Button
            onClick={() => console.log('Save bulk attendance')}
          >
            {t('common.save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default BulkAttendance