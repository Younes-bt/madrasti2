import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { useLanguage } from '../../../hooks/useLanguage'
import { cn } from '../../../lib/utils'

const TeacherBreadcrumb = ({ items = [], className, ...props }) => {
  const { t, isRTL } = useLanguage()

  if (!items || items.length === 0) {
    return null
  }

  return (
    <nav 
      className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}
      aria-label={t('navigation.breadcrumb', 'Breadcrumb')}
      {...props}
    >
      <ol className={cn('flex items-center', isRTL ? 'space-x-reverse' : 'space-x-1')}>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight 
                className={cn(
                  'h-4 w-4 mx-1',
                  isRTL && 'rotate-180'
                )} 
              />
            )}
            
            {item.href && index < items.length - 1 ? (
              <Link
                to={item.href}
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                {item.icon === 'Home' && index === 0 && (
                  <Home className="h-4 w-4" />
                )}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className={cn(
                'flex items-center gap-1',
                index === items.length - 1 && 'text-foreground font-medium'
              )}>
                {item.icon === 'Home' && index === 0 && (
                  <Home className="h-4 w-4" />
                )}
                <span>{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default TeacherBreadcrumb