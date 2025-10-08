import React, { useEffect, useMemo, useState, useRef } from 'react'
import { DashboardLayout } from '../../components/layout/Layout'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import attendanceService from '../../services/attendance'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Calendar, Clock, GraduationCap, MapPin, User, Printer, Download } from 'lucide-react'
import { Button } from '../../components/ui/button'
import jspdf from 'jspdf'
import html2canvas from 'html2canvas'
import api from '../../services/api'
import '../../styles/print.css'

// Week days and standard Morocco time slots (match admin/teacher pages)
const getWeekDays = (t) => ([
  { key: 'monday', name: t('calendar.monday'), value: 1 },
  { key: 'tuesday', name: t('calendar.tuesday'), value: 2 },
  { key: 'wednesday', name: t('calendar.wednesday'), value: 3 },
  { key: 'thursday', name: t('calendar.thursday'), value: 4 },
  { key: 'friday', name: t('calendar.friday'), value: 5 },
  { key: 'saturday', name: t('calendar.saturday'), value: 6 },
])

const timeSlots = [
  { period: 1, start: '08:00', end: '09:00' },
  { period: 2, start: '09:00', end: '10:00' },
  { period: 3, start: '10:00', end: '11:00' },
  { period: 4, start: '11:20', end: '12:20' }, // Break 11:00-11:20
  { period: 5, start: '12:20', end: '13:20' },
  { period: 6, start: '14:30', end: '15:30' }, // Lunch break 13:20-14:30
  { period: 7, start: '15:30', end: '16:30' },
  { period: 8, start: '16:30', end: '17:30' }
]

const StudentTimetablePage = () => {
  const { t, isRTL, currentLanguage } = useLanguage()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState({ sessions: [], academic_year: null, class: null })
  const [schoolConfig, setSchoolConfig] = useState(null)
  const scheduleRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await attendanceService.getMySchedule()
        setData(res || { sessions: [] })
      } catch (err) {
        console.error('Failed to load timetable:', err)
        setError(err.userMessage || err.message || t('errors.unexpectedError'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const fetchSchoolConfig = async () => {
      try {
        let configResponse
        try {
          configResponse = await api.get('/schools/config/')
          const payload = configResponse.data
          let schoolData
          if (payload?.results && Array.isArray(payload.results)) {
            schoolData = payload.results[0]
          } else if (Array.isArray(payload)) {
            schoolData = payload[0]
          } else {
            schoolData = payload
          }
          setSchoolConfig(schoolData)
        } catch (listError) {
          try {
            configResponse = await api.get('/schools/config/1/')
            setSchoolConfig(configResponse.data)
          } catch (detailError) {
            if (user?.school_info) setSchoolConfig(user.school_info)
          }
        }
      } catch (err) {
        if (user?.school_info) setSchoolConfig(user.school_info)
      }
    }
    fetchSchoolConfig()
  }, [user])

  const sessions = data.sessions || []

  const getSessionForSlot = (dayValue, period) => {
    return sessions.find(s => s.day_of_week === dayValue && s.session_order === period)
  }

  const getSessionTypeColor = (session) => {
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-green-100 text-green-800 border-green-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-orange-100 text-orange-800 border-orange-200',
      'bg-pink-100 text-pink-800 border-pink-200',
      'bg-yellow-100 text-yellow-800 border-yellow-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
    ]
    const name = session.subject_name || ''
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    return colors[Math.abs(hash) % colors.length]
  }

  const subjectName = (s) => {
    if (isRTL && s.subject_name_arabic) return s.subject_name_arabic
    return s.subject_name || s.subject
  }

  const handlePrint = () => {
    const weekDays = getWeekDays(t)
    const printWindow = window.open('', '_blank', 'width=1200,height=800')
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${t('timetables.weeklySchedule')}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; background: white; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
          .print-container { width: 100%; max-width: 1000px; margin: 0 auto; text-align: center; }
          .header { text-align: center; margin-bottom: 30px; }
          .school-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .class-info { font-size: 18px; margin-bottom: 5px; }
          .timetable-table { width: 100%; border-collapse: collapse; border: 2px solid #000; margin: 0 auto; }
          .timetable-table th, .timetable-table td { border: 1px solid #000; padding: 8px 4px; text-align: center; vertical-align: top; font-size: 12px; }
          .timetable-table th { background-color: #e0e0e0; font-weight: bold; }
          .day-header, .day-cell { background-color: #f5f5f5; font-weight: bold; width: 120px; }
          .time-header { font-size: 10px; width: 110px; }
          .session-cell { text-align: left; padding: 4px; font-size: 10px; width: 110px; height: 60px; }
          .subject { font-weight: bold; font-size: 11px; margin-bottom: 2px; }
          .teacher { font-size: 10px; margin-bottom: 1px; }
          .room { font-size: 9px; font-style: italic; }
          @page { size: A4 landscape; margin: 0.5in; }
          @media print { body { padding: 20px; } .print-container { margin: 0 auto; } }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="header">
            <div class="school-name">${schoolConfig?.name_arabic || ''} ${schoolConfig?.name ? ' - ' + schoolConfig.name : ''}</div>
            <div class="class-info">${t('studentSidebar.timetable.title')}</div>
            <div class="class-info">${data?.class?.name || ''} ${data?.academic_year ? ' - ' + data.academic_year : ''}</div>
          </div>
          <table class="timetable-table">
            <thead>
              <tr>
                <th class="day-header">${t('calendar.day')}</th>
                ${timeSlots.map(slot => `
                  <th class="time-header">
                    <div>${t('timetables.period')} ${slot.period}</div>
                    <div>${slot.start} - ${slot.end}</div>
                  </th>
                `).join('')}
              </tr>
            </thead>
            <tbody>__ROWS__</tbody>










          </table>
        </div>
      </body>
      </html>
    `

    // Build rows using local functions and data
    const rowsHtml = getWeekDays(t).slice(0,6).map(day => {
      const cells = timeSlots.map(slot => {
        const s = getSessionForSlot(day.value, slot.period)
        return `
          <td class="session-cell">
            ${s ? `
              <div class="subject">${subjectName(s) || ''}</div>
              ${s.teacher_name ? `<div class="teacher">${s.teacher_name}</div>` : ''}
              ${s.room_name ? `<div class="room">${s.room_name}</div>` : ''}
            ` : ''}
          </td>
        `
      }).join('')
      return `<tr><td class="day-cell">${day.name}</td>${cells}</tr>`
    }).join('')

    const finalHtml = printContent.replace('__ROWS__', rowsHtml)

    printWindow.document.write(finalHtml)
    printWindow.document.close()
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    }
  }

  const handleExport = () => {
    const weekDays = getWeekDays(t)
    const tempContainer = document.createElement('div')
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '-9999px'
    tempContainer.style.width = '1200px'
    tempContainer.style.backgroundColor = 'white'
    tempContainer.style.padding = '40px'
    tempContainer.style.fontFamily = 'Arial, sans-serif'
    tempContainer.style.textAlign = 'center'

    const header = document.createElement('div')
    header.style.textAlign = 'center'
    header.style.marginBottom = '30px'

    const schoolName = document.createElement('div')
    schoolName.style.fontSize = '24px'
    schoolName.style.fontWeight = 'bold'
    schoolName.style.marginBottom = '10px'
    schoolName.textContent = `${schoolConfig?.name_arabic || ''}${schoolConfig?.name ? ' - ' + schoolConfig.name : ''}`

    const classInfo1 = document.createElement('div')
    classInfo1.style.fontSize = '18px'
    classInfo1.style.marginBottom = '5px'
    classInfo1.textContent = t('studentSidebar.timetable.title')

    const classInfo2 = document.createElement('div')
    classInfo2.style.fontSize = '18px'
    classInfo2.style.marginBottom = '5px'
    classInfo2.textContent = `${data?.class?.name || ''}${data?.academic_year ? ' - ' + data.academic_year : ''}`

    header.appendChild(schoolName)
    header.appendChild(classInfo1)
    header.appendChild(classInfo2)

    const table = document.createElement('table')
    table.style.width = '100%'
    table.style.borderCollapse = 'collapse'
    table.style.border = '2px solid #000'
    table.style.margin = '0 auto'

    const thead = document.createElement('thead')
    const headerRow = document.createElement('tr')
    const dayTh = document.createElement('th')
    dayTh.textContent = t('calendar.day')
    dayTh.style.backgroundColor = '#e0e0e0'
    dayTh.style.border = '1px solid #000'
    dayTh.style.padding = '8px 4px'
    headerRow.appendChild(dayTh)

    timeSlots.forEach(slot => {
      const th = document.createElement('th')
      th.style.backgroundColor = '#e0e0e0'
      th.style.border = '1px solid #000'
      th.style.padding = '8px 4px'
      th.innerHTML = `<div>${t('timetables.period')} ${slot.period}</div><div>${slot.start} - ${slot.end}</div>`
      headerRow.appendChild(th)
    })
    thead.appendChild(headerRow)
    table.appendChild(thead)

    const tbody = document.createElement('tbody')
    weekDays.slice(0, 6).forEach(day => {
      const tr = document.createElement('tr')
      const dayCell = document.createElement('td')
      dayCell.textContent = day.name
      dayCell.style.backgroundColor = '#f5f5f5'
      dayCell.style.fontWeight = 'bold'
      dayCell.style.border = '1px solid #000'
      dayCell.style.padding = '8px 4px'
      tr.appendChild(dayCell)

      timeSlots.forEach(slot => {
        const td = document.createElement('td')
        td.style.border = '1px solid #000'
        td.style.padding = '8px 4px'
        td.style.textAlign = 'left'
        td.style.verticalAlign = 'top'
        td.style.height = '60px'

        const session = sessions.find(s => s.day_of_week === day.value && s.session_order === slot.period)
        if (session) {
          const subject = document.createElement('div')
          subject.textContent = session.subject_name
          subject.style.fontWeight = 'bold'
          subject.style.marginBottom = '2px'
          td.appendChild(subject)

          if (session.teacher_name) {
            const teacher = document.createElement('div')
            teacher.textContent = session.teacher_name
            teacher.style.fontSize = '12px'
            td.appendChild(teacher)
          }
          if (session.room_name) {
            const room = document.createElement('div')
            room.textContent = session.room_name
            room.style.fontSize = '11px'
            room.style.fontStyle = 'italic'
            td.appendChild(room)
          }
        }
        tr.appendChild(td)
      })

      tbody.appendChild(tr)
    })
    table.appendChild(tbody)

    tempContainer.appendChild(header)
    tempContainer.appendChild(table)
    document.body.appendChild(tempContainer)

    html2canvas(tempContainer, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jspdf('landscape', 'pt', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pageWidth - 80
      const imgHeight = canvas.height * (imgWidth / canvas.width)
      pdf.addImage(imgData, 'PNG', 40, 40, imgWidth, imgHeight)
      pdf.save('timetable.pdf')
      document.body.removeChild(tempContainer)
    }).catch(() => {
      document.body.removeChild(tempContainer)
    })
  }

  if (loading) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
          {t('common.loading')}
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout user={user}>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-destructive">{error}</div>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between gap-3 flex-wrap md:flex-nowrap">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold tracking-tight">{t('studentSidebar.timetable.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('studentSidebar.timetable.tooltip')}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {data.class?.name && (
              <Badge variant="secondary" className="gap-1">
                <GraduationCap className="h-4 w-4" /> {data.class.name}
              </Badge>
            )}
            {data.academic_year && (
              <Badge variant="outline" className="gap-1">
                <Calendar className="h-4 w-4" /> {data.academic_year}
              </Badge>
            )}
            <Button type="button" variant="outline" className="gap-2 shrink-0" onClick={handlePrint}>
              <Printer className="h-4 w-4" /> {t('common.print', 'Print')}
            </Button>
            <Button type="button" className="gap-2 shrink-0" onClick={handleExport}>
              <Download className="h-4 w-4" /> {t('common.saveAsPdf', 'Save as PDF')}
            </Button>
          </div>
        </div>

        {/* Timetable Grid - like admin/teacher (desktop) */}
        <Card className="card-print web-timetable-grid hidden md:block">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              {t('timetables.weeklySchedule')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {/* Keep a sensible min width so columns remain readable, but allow horizontal scroll */}
              <div className="min-w-[1100px] lg:min-w-[1200px]">
                {/* Header */}
                <div className="grid grid-cols-9 gap-2 mb-4">
                  <div className="p-3 bg-muted/50 rounded text-center font-medium text-sm flex items-center justify-center">
                    {t('calendar.day')}
                  </div>
                  {timeSlots.map((slot) => (
                    <div key={slot.period} className="p-3 bg-muted/50 rounded text-center">
                      <div className="font-medium text-sm">{t('timetables.period')} {slot.period}</div>
                      <div className="text-xs text-muted-foreground">{slot.start} - {slot.end}</div>
                    </div>
                  ))}
                </div>

                {/* Days Rows */}
                {getWeekDays(t).slice(0, 6).map((day) => (
                  <div key={day.key} className="grid grid-cols-9 gap-2 mb-2">
                    {/* Day Column */}
                    <div className="p-3 bg-muted/30 rounded text-center flex items-center justify-center">
                      <div className="text-sm font-medium">
                        {day.name}
                      </div>
                    </div>

                    {/* Periods */}
                    {timeSlots.map((slot) => {
                      const session = getSessionForSlot(day.value, slot.period)
                      return (
                        <div key={slot.period} className="min-h-[110px] p-1">
                          {session ? (
                            <div className={`p-2 rounded border h-full ${getSessionTypeColor(session)}`}>
                              <div className="text-xs font-bold mb-1 truncate">
                                {subjectName(session)}
                              </div>
                              <div className="space-y-1 text-[11px]">
                                {session.teacher_name && (
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">{session.teacher_name}</span>
                                  </div>
                                )}
                                {session.room_name && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">{session.room_name}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 flex-shrink-0" />
                                  <span>{session.start_time}-{session.end_time}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full w-full"></div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile-friendly stacked view */}
        {/* Mobile-friendly stacked view - improved spacing */}
        <Card className="md:hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              {t('timetables.weeklySchedule')}
            </CardTitle>
            <CardDescription>
              {t('timetables.mobileHint', 'Scroll days to view your sessions')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {getWeekDays(t).slice(0,6).map((day) => {
              const daySessions = timeSlots
                .map(slot => ({ slot, session: getSessionForSlot(day.value, slot.period) }))
                .filter(x => !!x.session)
              return (
                <div key={day.key} className="border rounded-lg">
                  <div className="px-3 py-2 bg-muted/40 rounded-t-lg text-sm font-medium">
                    {day.name}
                  </div>
                  <div className="divide-y">
                    {daySessions.length ? daySessions.map(({ slot, session }) => (
                      <div key={`${day.key}-${slot.period}`} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-sm">{subjectName(session)}</div>
                          <div className="text-xs text-muted-foreground">{slot.start} - {slot.end}</div>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
                          {session.teacher_name && (
                            <span className="inline-flex items-center gap-1"><User className="h-3 w-3" />{session.teacher_name}</span>
                          )}
                          {session.room_name && (
                            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{session.room_name}</span>
                          )}
                        </div>
                      </div>
                    )) : (
                      <div className="p-3 text-xs text-muted-foreground">{t('timetable.noSessions', 'No sessions')}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default StudentTimetablePage



