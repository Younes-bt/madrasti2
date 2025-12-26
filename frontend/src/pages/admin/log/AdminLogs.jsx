import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Activity, Search, RefreshCcw, Filter } from 'lucide-react'
import AdminPageLayout from '../../../components/admin/layout/AdminPageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { toast } from 'sonner'
import logsService from '../../../services/logs'

const ACTION_OPTIONS = [
  { value: 'all', label: 'all' },
  { value: 'MESSAGE_SENT', label: 'Message sent' },
  { value: 'HOMEWORK_CREATED', label: 'Homework created' },
  { value: 'HOMEWORK_PUBLISHED', label: 'Homework published' },
  { value: 'PAYMENT_RECORDED', label: 'Payment recorded' },
  { value: 'USER_CREATED', label: 'User created' },
  { value: 'USER_UPDATED', label: 'User updated' },
  { value: 'SYSTEM', label: 'System' },
  { value: 'OTHER', label: 'Other' }
]

const ROLE_OPTIONS = [
  { value: 'all', label: 'all' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'STAFF', label: 'Staff' },
  { value: 'TEACHER', label: 'Teacher' },
  { value: 'STUDENT', label: 'Student' },
  { value: 'PARENT', label: 'Parent' },
]

const TARGET_OPTIONS = [
  { value: 'all', label: 'all' },
  { value: 'message', label: 'Message' },
  { value: 'payment', label: 'Payment' },
  { value: 'homework', label: 'Homework' },
  { value: 'invoice', label: 'Invoice' },
]

const AdminLogs = () => {
  const { t, i18n } = useTranslation()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null })
  const [filters, setFilters] = useState({
    search: '',
    action: 'all',
    actorRole: 'all',
    targetModel: 'all',
    start: '',
    end: ''
  })

  const formatDateTime = (value) => {
    if (!value) return '-'
    try {
      return new Date(value).toLocaleString(i18n.language || 'en', { dateStyle: 'medium', timeStyle: 'short' })
    } catch {
      return value
    }
  }

  const fetchLogs = async (pageNumber = 1) => {
    setLoading(true)
    try {
      const params = {
        page: pageNumber,
        search: filters.search,
        action: filters.action === 'all' ? undefined : filters.action,
        actor_role: filters.actorRole === 'all' ? undefined : filters.actorRole,
        target_model: filters.targetModel === 'all' ? undefined : filters.targetModel,
        start: filters.start,
        end: filters.end
      }

      const data = await logsService.list(params)
      const results = data.results || data || []
      setLogs(results)
      setPagination({
        count: data.count || results.length,
        next: data.next || null,
        previous: data.previous || null
      })
      setPage(pageNumber)
    } catch (error) {
      console.error('Failed to load activity logs', error)
      toast.error(t('adminLogs.error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleApplyFilters = () => {
    fetchLogs(1)
  }

  const handleResetFilters = () => {
    setFilters({
      search: '',
      action: '',
      actorRole: '',
      targetModel: '',
      start: '',
      end: ''
    })
    fetchLogs(1)
  }

  const renderMetadata = (metadata) => {
    if (!metadata || Object.keys(metadata).length === 0) return '-'
    const entries = Object.entries(metadata).slice(0, 3)
    return (
      <div className="space-y-1 text-xs text-muted-foreground">
        {entries.map(([key, value]) => (
          <div key={key} className="flex justify-between gap-2">
            <span className="font-medium">{key}</span>
            <span className="truncate">{String(value)}</span>
          </div>
        ))}
      </div>
    )
  }

  const totalPages = useMemo(() => {
    const pageSize = logs.length > 0 ? logs.length : 20
    return pagination.count ? Math.ceil(pagination.count / pageSize) : 1
  }, [logs.length, pagination.count])

  return (
    <AdminPageLayout
      title={t('adminLogs.title')}
      subtitle={t('adminLogs.subtitle')}
      actions={[
        <Button key="refresh" variant="outline" onClick={() => fetchLogs(page)} disabled={loading}>
          <RefreshCcw className="mr-2 h-4 w-4" /> {t('adminLogs.refresh')}
        </Button>
      ]}
      loading={loading && logs.length === 0}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {t('adminLogs.filters.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">{t('adminLogs.filters.search')}</label>
              <div className="flex gap-2">
                <Input
                  placeholder={t('adminLogs.filters.searchPlaceholder')}
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                />
                <Button variant="outline" onClick={() => fetchLogs(1)} disabled={loading}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">{t('adminLogs.filters.action')}</label>
              <Select
                value={filters.action}
                onValueChange={(value) => setFilters({ ...filters, action: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('adminLogs.filters.action')} />
                </SelectTrigger>
                <SelectContent>
                  {ACTION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{t(`adminLogs.actions.${opt.value || 'all'}`, { defaultValue: opt.label })}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">{t('adminLogs.filters.role')}</label>
              <Select
                value={filters.actorRole}
                onValueChange={(value) => setFilters({ ...filters, actorRole: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('adminLogs.filters.role')} />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{t(`roles.${opt.value || 'all'}`, { defaultValue: opt.label })}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">{t('adminLogs.filters.target')}</label>
              <Select
                value={filters.targetModel}
                onValueChange={(value) => setFilters({ ...filters, targetModel: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('adminLogs.filters.target')} />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{t(`adminLogs.targets.${opt.value || 'all'}`, { defaultValue: opt.label })}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">{t('adminLogs.filters.start')}</label>
              <Input
                type="date"
                value={filters.start}
                onChange={(e) => setFilters({ ...filters, start: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">{t('adminLogs.filters.end')}</label>
              <Input
                type="date"
                value={filters.end}
                onChange={(e) => setFilters({ ...filters, end: e.target.value })}
              />
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={handleApplyFilters} disabled={loading} className="w-full">
                {t('adminLogs.filters.apply')}
              </Button>
              <Button onClick={handleResetFilters} variant="outline" disabled={loading} className="w-full">
                {t('adminLogs.filters.reset')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {t('adminLogs.table.title')}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{t('adminLogs.table.subtitle')}</p>
            </div>
            <div className="text-sm text-muted-foreground">
              {t('adminLogs.table.total', { count: pagination.count || 0 })}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('adminLogs.table.time')}</TableHead>
                    <TableHead>{t('adminLogs.table.actor')}</TableHead>
                    <TableHead>{t('adminLogs.table.action')}</TableHead>
                    <TableHead>{t('adminLogs.table.target')}</TableHead>
                    <TableHead>{t('adminLogs.table.description')}</TableHead>
                    <TableHead>{t('adminLogs.table.metadata')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        {t('adminLogs.empty')}
                      </TableCell>
                    </TableRow>
                  )}
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">{formatDateTime(log.created_at)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{log.actor?.full_name || t('adminLogs.system')}</div>
                          {log.actor_role && <Badge variant="secondary">{log.actor_role}</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge>{t(`adminLogs.actions.${log.action}`, { defaultValue: log.action })}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{log.target_repr || t('adminLogs.table.unknownTarget')}</div>
                          <div className="text-xs text-muted-foreground">{log.target_model || '-'}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-muted-foreground line-clamp-3">{log.description || '-'}</p>
                      </TableCell>
                      <TableCell>{renderMetadata(log.metadata)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="text-muted-foreground">
                {t('adminLogs.table.pagination', { page, totalPages })}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.previous || loading}
                  onClick={() => fetchLogs(Math.max(page - 1, 1))}
                >
                  {t('adminLogs.table.prev')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.next || loading}
                  onClick={() => fetchLogs(page + 1)}
                >
                  {t('adminLogs.table.next')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  )
}

export default AdminLogs
