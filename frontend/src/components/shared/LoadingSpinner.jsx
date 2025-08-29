import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

/**
 * Versatile loading spinner component with multiple variants and sizes
 */
const LoadingSpinner = ({
  size = 'default',
  variant = 'default',
  className,
  text,
  textPosition = 'bottom',
  fullScreen = false,
  overlay = false,
  ...props
}) => {
  // Size configurations
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16',
  }

  // Variant configurations
  const variantClasses = {
    default: 'text-primary',
    muted: 'text-muted-foreground',
    destructive: 'text-destructive',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    white: 'text-white',
  }

  // Text size based on spinner size
  const textSizeClasses = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
    '2xl': 'text-xl',
  }

  const spinnerClasses = cn(
    'animate-spin',
    sizeClasses[size],
    variantClasses[variant],
    className
  )

  const textClasses = cn(
    'font-medium',
    textSizeClasses[size],
    variantClasses[variant]
  )

  const renderSpinner = () => (
    <Loader2 className={spinnerClasses} {...props} />
  )

  const renderContent = () => {
    if (!text) {
      return renderSpinner()
    }

    const flexDirection = textPosition === 'right' || textPosition === 'left' 
      ? 'flex-row' 
      : 'flex-col'
    
    const spacing = textPosition === 'top' || textPosition === 'bottom' 
      ? 'space-y-2' 
      : 'space-x-2 rtl:space-x-reverse'

    const order = textPosition === 'top' || textPosition === 'left' ? 'order-first' : ''

    return (
      <div className={cn('flex items-center justify-center', flexDirection, spacing)}>
        {renderSpinner()}
        <span className={cn(textClasses, order)}>{text}</span>
      </div>
    )
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <div className="text-center">
          {renderContent()}
        </div>
      </div>
    )
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-40">
        <div className="text-center">
          {renderContent()}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      {renderContent()}
    </div>
  )
}

// Specialized loading components
export const ButtonSpinner = ({ size = 'sm', className }) => (
  <LoadingSpinner 
    size={size} 
    variant="white"
    className={cn('mr-2 rtl:mr-0 rtl:ml-2', className)} 
  />
)

export const TableSpinner = ({ rows = 5, className }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="flex items-center justify-center py-8">
        <LoadingSpinner text="جاري التحميل... | Loading..." />
      </div>
    ))}
  </div>
)

export const CardSpinner = ({ className }) => (
  <div className={cn('flex items-center justify-center py-12', className)}>
    <LoadingSpinner size="lg" text="جاري التحميل... | Loading..." />
  </div>
)

export const PageSpinner = ({ text = 'جاري تحميل الصفحة... | Loading page...' }) => (
  <LoadingSpinner 
    size="xl" 
    text={text}
    fullScreen
  />
)

export const InlineSpinner = ({ text, size = 'sm', className }) => (
  <LoadingSpinner 
    size={size}
    text={text}
    textPosition="right"
    className={className}
  />
)

// Pulsing dots loader alternative
export const PulsingDots = ({ className, size = 'default' }) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    default: 'w-2 h-2',
    lg: 'w-3 h-3',
  }

  const dotSize = sizeClasses[size]

  return (
    <div className={cn('flex items-center justify-center space-x-1', className)}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            'bg-current rounded-full animate-pulse',
            dotSize
          )}
          style={{
            animationDelay: `${index * 150}ms`,
            animationDuration: '600ms',
          }}
        />
      ))}
    </div>
  )
}

// Skeleton loader component
export const Skeleton = ({ 
  className, 
  width = 'w-full', 
  height = 'h-4',
  rounded = 'rounded',
  ...props 
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-muted',
        width,
        height,
        rounded,
        className
      )}
      {...props}
    />
  )
}

// Common skeleton patterns
export const SkeletonText = ({ lines = 3, className }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton 
        key={index}
        width={index === lines - 1 ? 'w-3/4' : 'w-full'}
        className="h-3"
      />
    ))}
  </div>
)

export const SkeletonCard = ({ className }) => (
  <div className={cn('p-4 space-y-3', className)}>
    <div className="flex items-center space-x-3 rtl:space-x-reverse">
      <Skeleton width="w-10" height="h-10" rounded="rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton width="w-1/4" height="h-3" />
        <Skeleton width="w-1/3" height="h-2" />
      </div>
    </div>
    <SkeletonText lines={2} />
    <div className="flex justify-between">
      <Skeleton width="w-20" height="h-8" rounded="rounded-md" />
      <Skeleton width="w-16" height="h-8" rounded="rounded-md" />
    </div>
  </div>
)

export const SkeletonTable = ({ rows = 5, columns = 4, className }) => (
  <div className={cn('space-y-2', className)}>
    {/* Header */}
    <div className="flex space-x-4 rtl:space-x-reverse">
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} width="flex-1" height="h-8" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4 rtl:space-x-reverse">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} width="flex-1" height="h-6" />
        ))}
      </div>
    ))}
  </div>
)

export const SkeletonAvatar = ({ size = 'default', className }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    default: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  return (
    <Skeleton 
      width={sizeClasses[size]} 
      height={sizeClasses[size]} 
      rounded="rounded-full"
      className={className}
    />
  )
}

// Loading states for specific components
export const LoadingButton = ({ children, isLoading, ...props }) => (
  <button disabled={isLoading} {...props}>
    {isLoading && <ButtonSpinner />}
    {children}
  </button>
)

// Progress bar loader
export const ProgressBar = ({ progress = 0, className, showPercentage = false }) => (
  <div className={cn('w-full', className)}>
    <div className="flex justify-between items-center mb-1">
      {showPercentage && (
        <span className="text-sm text-muted-foreground">
          {Math.round(progress)}%
        </span>
      )}
    </div>
    <div className="w-full bg-muted rounded-full h-2">
      <div 
        className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
      />
    </div>
  </div>
)

export default LoadingSpinner