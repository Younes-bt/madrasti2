import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  Activity,
  Server,
  Database,
  HardDrive,
  Cpu,
  MemoryStick,
  Wifi,
  Shield,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Settings
} from 'lucide-react'

const SystemHealth = () => {
  const { t } = useLanguage()

  const [systemHealth, setSystemHealth] = useState({
    overall_status: 'healthy', // healthy, warning, critical
    last_updated: '2024-09-01T17:00:00Z',
    uptime: 99.8,
    server_metrics: {
      cpu_usage: 45.2,
      memory_usage: 68.5,
      disk_usage: 34.8,
      network_latency: 12, // ms
      active_connections: 1247
    },
    database_metrics: {
      connection_pool: 85, // percentage used
      query_performance: 95, // performance score
      storage_used: 2.4, // GB
      backup_status: 'success',
      last_backup: '2024-09-01T06:00:00Z'
    },
    security_metrics: {
      failed_login_attempts: 23,
      blocked_ips: 5,
      ssl_certificate_days: 89,
      firewall_status: 'active'
    },
    application_metrics: {
      error_rate: 0.02, // percentage
      response_time: 245, // ms
      api_calls_per_minute: 2850,
      cache_hit_rate: 94.2
    }
  })

  const getStatusColor = (status) => {
    switch(status) {
      case 'healthy': return 'text-green-700 bg-green-100'
      case 'warning': return 'text-yellow-700 bg-yellow-100'
      case 'critical': return 'text-red-700 bg-red-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getMetricColor = (value, thresholds) => {
    if (value <= thresholds.good) return 'text-green-600'
    if (value <= thresholds.warning) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getMetricStatus = (value, thresholds) => {
    if (value <= thresholds.good) return 'healthy'
    if (value <= thresholds.warning) return 'warning'
    return 'critical'
  }

  const formatUptime = (uptime) => {
    return `${uptime}%`
  }

  const formatLastUpdated = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return t('common.justNow')
    if (diffInMinutes < 60) return `${diffInMinutes}m ${t('common.ago')}`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    return `${diffInHours}h ${t('common.ago')}`
  }

  const handleRefreshMetrics = () => {
    console.log('Refresh system metrics')
    setSystemHealth(prev => ({
      ...prev,
      last_updated: new Date().toISOString()
    }))
  }

  const handleViewSystemSettings = () => {
    console.log('Navigate to system settings')
  }

  const handleViewLogs = () => {
    console.log('Navigate to system logs')
  }

  const metrics = [
    {
      name: t('admin.cpuUsage'),
      value: systemHealth.server_metrics.cpu_usage,
      unit: '%',
      icon: Cpu,
      thresholds: { good: 70, warning: 85 }
    },
    {
      name: t('admin.memoryUsage'),
      value: systemHealth.server_metrics.memory_usage,
      unit: '%',
      icon: MemoryStick,
      thresholds: { good: 70, warning: 85 }
    },
    {
      name: t('admin.diskUsage'),
      value: systemHealth.server_metrics.disk_usage,
      unit: '%',
      icon: HardDrive,
      thresholds: { good: 70, warning: 85 }
    },
    {
      name: t('admin.networkLatency'),
      value: systemHealth.server_metrics.network_latency,
      unit: 'ms',
      icon: Wifi,
      thresholds: { good: 50, warning: 100 }
    }
  ]

  return (
    <Card>
      <CardHeader className="card-content">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              {t('admin.systemHealth')}
            </CardTitle>
            <CardDescription>
              {t('admin.healthDescription')}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(systemHealth.overall_status)}>
            {t(`admin.${systemHealth.overall_status}`)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="card-content space-y-4">
        {/* System Status Overview */}
        <div className="p-3 bg-accent/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">{t('admin.systemUptime')}</span>
            <span className="text-sm font-bold text-green-600">
              {formatUptime(systemHealth.uptime)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {t('admin.lastUpdated')}: {formatLastUpdated(systemHealth.last_updated)}
          </div>
        </div>

        {/* Server Metrics */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Server className="h-4 w-4" />
            {t('admin.serverMetrics')}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric, index) => {
              const Icon = metric.icon
              const status = getMetricStatus(metric.value, metric.thresholds)
              return (
                <div key={index} className="p-2 border rounded text-center">
                  <Icon className="h-4 w-4 mx-auto mb-1 text-gray-600" />
                  <div className={`text-sm font-bold ${getMetricColor(metric.value, metric.thresholds)}`}>
                    {metric.value}{metric.unit}
                  </div>
                  <div className="text-xs text-muted-foreground">{metric.name}</div>
                  {status !== 'healthy' && (
                    <AlertTriangle className="h-3 w-3 mx-auto mt-1 text-yellow-600" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Database Health */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Database className="h-4 w-4" />
            {t('admin.databaseHealth')}
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-card border rounded">
              <span className="text-sm">{t('admin.connectionPool')}</span>
              <div className="flex items-center gap-2">
                <div className={`text-sm font-bold ${getMetricColor(systemHealth.database_metrics.connection_pool, { good: 70, warning: 85 })}`}>
                  {systemHealth.database_metrics.connection_pool}%
                </div>
                {systemHealth.database_metrics.connection_pool <= 85 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-card border rounded">
              <span className="text-sm">{t('admin.queryPerformance')}</span>
              <div className="flex items-center gap-2">
                <div className="text-sm font-bold text-green-600">
                  {systemHealth.database_metrics.query_performance}%
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-card border rounded">
              <span className="text-sm">{t('admin.lastBackup')}</span>
              <div className="flex items-center gap-2">
                <div className="text-sm font-bold text-green-600">
                  {formatLastUpdated(systemHealth.database_metrics.last_backup)}
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t('admin.securityStatus')}
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-card border rounded">
              <span className="text-sm">{t('admin.failedLogins')}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-red-600">
                  {systemHealth.security_metrics.failed_login_attempts}
                </Badge>
                {systemHealth.security_metrics.failed_login_attempts > 50 && (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-card border rounded">
              <span className="text-sm">{t('admin.sslCertificate')}</span>
              <div className="flex items-center gap-2">
                <div className={`text-sm font-bold ${systemHealth.security_metrics.ssl_certificate_days > 30 ? 'text-green-600' : 'text-red-600'}`}>
                  {systemHealth.security_metrics.ssl_certificate_days} {t('common.days')}
                </div>
                {systemHealth.security_metrics.ssl_certificate_days > 30 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Application Performance */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {t('admin.applicationMetrics')}
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-accent/20 rounded">
              <div className="font-bold text-green-600">{systemHealth.application_metrics.error_rate}%</div>
              <div className="text-muted-foreground">{t('admin.errorRate')}</div>
            </div>
            <div className="text-center p-2 bg-accent/20 rounded">
              <div className="font-bold text-blue-600">{systemHealth.application_metrics.response_time}ms</div>
              <div className="text-muted-foreground">{t('admin.responseTime')}</div>
            </div>
            <div className="text-center p-2 bg-accent/20 rounded">
              <div className="font-bold text-purple-600">{systemHealth.application_metrics.api_calls_per_minute.toLocaleString()}</div>
              <div className="text-muted-foreground">{t('admin.apiCalls')}</div>
            </div>
            <div className="text-center p-2 bg-accent/20 rounded">
              <div className="font-bold text-green-600">{systemHealth.application_metrics.cache_hit_rate}%</div>
              <div className="text-muted-foreground">{t('admin.cacheHitRate')}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefreshMetrics}
            className="flex-1"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            {t('admin.refresh')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleViewLogs}
            className="flex-1"
          >
            {t('admin.viewLogs')}
          </Button>
          <Button
            size="sm"
            onClick={handleViewSystemSettings}
            className="flex-1"
          >
            <Settings className="h-4 w-4 mr-1" />
            {t('admin.settings')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default SystemHealth