import React, { useEffect, useMemo, useState } from 'react'
import { DashboardLayout } from '../../components/layout/Layout'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import attendanceService from '../../services/attendance'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Calendar, Download, Filter, Loader2, RefreshCw, Search } from 'lucide-react'

const DATE_RANGES = [
  { key: 'all_time', label: 'All time' },
  { key: 'today', label: 'Today' },
  { key: 'this_week', label: 'This week' },
  { key: 'this_month', label: 'This month' },
]

const toISO = (d) => d.toISOString().split('T')[0]

const buildDateParams = (rangeKey) => {
  const params = {}
  const now = new Date()
  if (rangeKey === 'today') {
    const today = toISO(now)
    params.start_date = today
    params.end_date = today
  } else if (rangeKey === 'this_week') {
    const start = new Date(now)
    start.setDate(start.getDate() - start.getDay())
    params.start_date = toISO(start)
    params.end_date = toISO(now)
  } else if (rangeKey === 'this_month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    params.start_date = toISO(start)
    params.end_date = toISO(now)
  }
  return params
}

const statusTone = (status) => {
  switch (status) {
    case 'present':
      return 'bg-emerald-50 text-emerald-700'
    case 'late':
      return 'bg-amber-50 text-amber-700'
    case 'absent':
      return 'bg-red-50 text-red-700'
    case 'excused':
      return 'bg-blue-50 text-blue-700'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

const normalizeRecordsPayload = (payload) => {
  if (Array.isArray(payload)) return payload
  return payload?.results || payload?.records || []
}

const StudentAttendanceHistory = () => {
  const { t, currentLanguage } = useLanguage()
  const { user } = useAuth()

  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [dateRange, setDateRange] = useState('this_month')
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalCount, setTotalCount] = useState(0)

  const fetchRecords = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = { page, page_size: pageSize }
      Object.assign(params, buildDateParams(dateRange))
      if (status !== 'all') params.status = status
      if (search) params.search = search

      const res = await attendanceService.getAttendanceRecords(params)
      const items = normalizeRecordsPayload(res)
      const count = res?.count ?? items.length

      setRecords(items)
      setTotalCount(count)
    } catch (err) {
      console.error('Failed to fetch attendance history:', err)
      setError(err.userMessage || err.message || t('errors.unexpectedError', 'Unexpected error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, status, page, pageSize])

  const exportCSV = () => {
    const headers = ['Date','Subject','Status','Teacher','Notes']
    const rows = records.map(r => [
      r.marked_at ? new Date(r.marked_at).toISOString().slice(0,10) : '-',
      r.subject_name || '-',
      r.status_display || r.status,
      r.marked_by_name || '-',
      (r.notes || '').toString().replace(/\n/g, ' ')
    ])
    const csv = [headers.join(','), ...rows.map(row => row.map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance_history_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatDate = (value) => {
    if (!value) return '-'
    try {
      return new Date(value).toLocaleString(currentLanguage === 'ar' ? 'ar-MA' : 'en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    } catch { return value }
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('studentSidebar.attendance.history', 'Attendance History')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('attendance.historySubtitle', 'Review your attendance records by date and status')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportCSV} disabled={records.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              {t('common.export', 'Export')}
            </Button>
            <Button variant="outline" onClick={fetchRecords}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              {t('common.refresh', 'Refresh')}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="h-4 w-4" />
              {t('common.filters', 'Filters')}
            </CardTitle>
            <CardDescription>{t('attendance.historyFiltersHint', 'Adjust filters to narrow down results')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-4">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">{t('common.dateRange', 'Date range')}</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DATE_RANGES.map(r => (
                    <SelectItem key={r.key} value={r.key}>{t(`dateRanges.${r.key}`, r.label)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">{t('attendance.status', 'Status')}</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all', 'All')}</SelectItem>
                  <SelectItem value="present">{t('attendance.present', 'Present')}</SelectItem>
                  <SelectItem value="late">{t('attendance.late', 'Late')}</SelectItem>
                  <SelectItem value="absent">{t('attendance.absent', 'Absent')}</SelectItem>
                  <SelectItem value="excused">{t('attendance.excused', 'Excused')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs text-muted-foreground">{t('common.search', 'Search')}</label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-8" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder={t('attendance.searchPlaceholder','Subject, class, teacher...')} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t('attendance.history', 'History')}
            </CardTitle>
            <CardDescription>
              {t('attendance.totalRecords', 'Total records')}: {totalCount}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" /> {t('common.loading','Loading...')}
              </div>
            ) : error ? (
              <div className="text-red-600 text-sm">{error}</div>
            ) : records.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center">
                {t('attendance.noRecords', 'No attendance records found for the selected filters.')}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('common.date','Date')}</TableHead>
                      <TableHead>{t('attendance.subject','Subject')}</TableHead>
                      <TableHead>{t('attendance.status','Status')}</TableHead>
                      <TableHead>{t('attendance.markedBy','Marked by')}</TableHead>
                      <TableHead>{t('attendance.notes','Notes')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((r, idx) => (
                      <TableRow key={r.id || idx}>
                        <TableCell>{formatDate(r.marked_at)}</TableCell>
                        <TableCell>{r.subject_name || '-'}</TableCell>
                        <TableCell>
                          <Badge className={statusTone(r.status)}>
                            {t(`attendance.${r.status}`, r.status_display || r.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{r.marked_by_name || '-'}</TableCell>
                        <TableCell className="max-w-[360px] truncate" title={r.notes || ''}>{r.notes || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Simple pagination controls */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="text-muted-foreground">
                {t('common.page','Page')} {page}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={page<=1 || loading} onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</Button>
                <Button variant="outline" size="sm" disabled={records.length < pageSize || loading} onClick={()=>setPage(p=>p+1)}>Next</Button>
                <Select value={String(pageSize)} onValueChange={(v)=>{setPageSize(Number(v)); setPage(1)}}>
                  <SelectTrigger className="w-[90px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[10,20,50].map(n => (<SelectItem key={n} value={String(n)}>{n}/p</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default StudentAttendanceHistory
