import React from 'react'
import { cn } from '../../../lib/utils'
import { Info, AlertCircle, AlertTriangle, Lightbulb, CheckCircle, XCircle } from 'lucide-react'

/**
 * CalloutBlock - Renders colored callouts with icons
 *
 * Block structure:
 * {
 *   id: "block_uuid",
 *   type: "callout",
 *   content: {
 *     text: "Callout text",
 *     text_ar: "النص العربي",
 *     text_en: "English text",
 *     text_fr: "Texte français"
 *   },
 *   properties: {
 *     calloutType: "info" | "warning" | "error" | "success" | "tip",
 *     icon: "info" | "warning" | "error" | "lightbulb" | "check" | "x"
 *   }
 * }
 */
const CalloutBlock = ({ block, language }) => {
  const { content, properties = {} } = block

  // Get text based on language
  const getText = () => {
    if (language === 'ar' && content.text_ar) return content.text_ar
    if (language === 'fr' && content.text_fr) return content.text_fr
    if (language === 'en' && content.text_en) return content.text_en
    return content.text || ''
  }

  const text = getText()

  // Icon mapping
  const icons = {
    info: Info,
    warning: AlertTriangle,
    error: XCircle,
    lightbulb: Lightbulb,
    check: CheckCircle,
    x: XCircle,
    alert: AlertCircle
  }

  // Color schemes for callouts
  const calloutSchemes = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      text: 'text-blue-900 dark:text-blue-100',
      defaultIcon: 'info'
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-600 dark:text-yellow-400',
      text: 'text-yellow-900 dark:text-yellow-100',
      defaultIcon: 'warning'
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      text: 'text-red-900 dark:text-red-100',
      defaultIcon: 'error'
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      text: 'text-green-900 dark:text-green-100',
      defaultIcon: 'check'
    },
    tip: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      icon: 'text-purple-600 dark:text-purple-400',
      text: 'text-purple-900 dark:text-purple-100',
      defaultIcon: 'lightbulb'
    },
    default: {
      bg: 'bg-gray-50 dark:bg-gray-800/50',
      border: 'border-gray-200 dark:border-gray-700',
      icon: 'text-gray-600 dark:text-gray-400',
      text: 'text-gray-900 dark:text-gray-100',
      defaultIcon: 'info'
    }
  }

  const calloutType = properties.calloutType || 'default'
  const scheme = calloutSchemes[calloutType] || calloutSchemes.default

  const iconType = properties.icon || scheme.defaultIcon
  const IconComponent = icons[iconType] || Info

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 my-4 rounded-lg border',
        scheme.bg,
        scheme.border
      )}
    >
      <IconComponent className={cn('h-5 w-5 mt-0.5 flex-shrink-0', scheme.icon)} />
      <div className={cn('flex-1', scheme.text)}>
        {text}
      </div>
    </div>
  )
}

export default CalloutBlock
