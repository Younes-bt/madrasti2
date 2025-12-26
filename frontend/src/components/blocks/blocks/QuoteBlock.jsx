import React from 'react'
import { cn } from '../../../lib/utils'

/**
 * QuoteBlock - Renders blockquotes
 *
 * Block structure:
 * {
 *   id: "block_uuid",
 *   type: "quote",
 *   content: {
 *     text: "Quote text",
 *     text_ar: "النص العربي",
 *     text_en: "English text",
 *     text_fr: "Texte français"
 *   },
 *   properties: {
 *     color: "default" | "gray" | "blue" | "green" | "purple"
 *   }
 * }
 */
const QuoteBlock = ({ block, language }) => {
  const { content, properties = {} } = block

  // Get text based on language
  const getText = () => {
    if (language === 'ar' && content.text_ar) return content.text_ar
    if (language === 'fr' && content.text_fr) return content.text_fr
    if (language === 'en' && content.text_en) return content.text_en
    return content.text || ''
  }

  const text = getText()

  // Color schemes for quotes
  const colorSchemes = {
    default: {
      border: 'border-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-gray-700 dark:text-gray-300'
    },
    gray: {
      border: 'border-gray-500',
      bg: 'bg-gray-50 dark:bg-gray-800/50',
      text: 'text-gray-700 dark:text-gray-300'
    },
    blue: {
      border: 'border-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-900 dark:text-blue-200'
    },
    green: {
      border: 'border-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-900 dark:text-green-200'
    },
    purple: {
      border: 'border-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-900 dark:text-purple-200'
    }
  }

  const color = properties.color || 'default'
  const scheme = colorSchemes[color] || colorSchemes.default

  return (
    <blockquote
      className={cn(
        'border-l-4 pl-4 py-3 my-4 italic',
        scheme.border,
        scheme.bg,
        scheme.text
      )}
    >
      {text}
    </blockquote>
  )
}

export default QuoteBlock
