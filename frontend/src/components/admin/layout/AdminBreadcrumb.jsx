import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { useLanguage } from '../../../hooks/useLanguage'
import { cn } from '../../../lib/utils'

const AdminBreadcrumb = ({ items = [], className }) => {
  const { t, isRTL } = useLanguage()
  const navigate = useNavigate()

  const handleNavigate = (href) => {
    if (href) {
      navigate(href)
    }
  }

  // Default items if none provided
  const defaultItems = [
    {
      label: t('common.dashboard'),
      href: '/admin',
      icon: Home
    }
  ]

  const breadcrumbItems = items.length > 0 ? items : defaultItems

  if (breadcrumbItems.length <= 1) {
    return null // Don't show breadcrumb for single item
  }

  return (
    <nav className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}>
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1
        const IconComponent = item.icon

        return (
          <React.Fragment key={index}>
            <div className="flex items-center">
              {/* Icon (only for first item usually) */}
              {IconComponent && (
                <IconComponent className="h-4 w-4 mr-1" />
              )}
              
              {/* Breadcrumb Item */}
              {item.href && !isLast ? (
                <button
                  onClick={() => handleNavigate(item.href)}
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ) : (
                <span className={cn(isLast && 'text-foreground font-medium')}>
                  {item.label}
                </span>
              )}
            </div>

            {/* Separator */}
            {!isLast && (
              <ChevronRight className={cn(
                'h-4 w-4 flex-shrink-0',
                isRTL && 'rotate-180'
              )} />
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

export default AdminBreadcrumb