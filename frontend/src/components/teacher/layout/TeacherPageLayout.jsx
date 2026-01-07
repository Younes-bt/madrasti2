import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../../hooks/useLanguage'
import { useAuth } from '../../../hooks/useAuth'
import { DashboardLayout } from '../../layout/Layout'
import { Card, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'
import { RefreshCcw, ArrowLeft, AlertTriangle } from 'lucide-react'
import { cn } from '../../../lib/utils'

const TeacherPageLayout = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  backButtonPath = '/teacher',
  backButtonLabel,
  showRefreshButton = false,
  onRefresh,
  actions = [],
  loading = false,
  error = null,
  className,
  contentClassName,
  headerClassName,
  ...props
}) => {
  const { t, isRTL } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleBack = () => {
    if (backButtonPath) {
      navigate(backButtonPath)
    } else {
      navigate(-1)
    }
  }

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh()
    } else {
      window.location.reload()
    }
  }

  return (
    <DashboardLayout user={user} {...props}>
      <div className={cn('min-h-full', className)}>
        {/* Page Header */}
        <div className={cn(
          'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6',
          headerClassName
        )}>
          <div className="flex items-center gap-4">
            {/* Back Button */}
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className={cn(
                  'h-4 w-4',
                  isRTL && 'rotate-180'
                )} />
                {backButtonLabel || t('errors.goBack', 'Go Back')}
              </Button>
            )}

            <div>
              {/* Page Title */}
              {title && (
                <h1 className="text-3xl font-bold tracking-tight">
                  {title}
                </h1>
              )}

              {/* Page Subtitle */}
              {subtitle && (
                <p className="text-muted-foreground mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Refresh Button */}
            {showRefreshButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCcw className={cn(
                  'h-4 w-4',
                  loading && 'animate-spin'
                )} />
                {t('common.refresh', 'Refresh')}
              </Button>
            )}

            {/* Custom Actions */}
            {actions.map((action, index) => (
              <React.Fragment key={index}>
                {action}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/10 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <p className="font-medium">{t('common.error')}</p>
              </div>
              <p className="text-sm text-destructive/80 mt-1">
                {typeof error === 'string' ? error : error.message || t('errors.unexpectedError', 'An unexpected error occurred')}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className={cn(
          'space-y-6',
          contentClassName
        )}>
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-2">
                    <RefreshCcw className="h-4 w-4 animate-spin" />
                    <span>{t('common.loading')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            children
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default TeacherPageLayout