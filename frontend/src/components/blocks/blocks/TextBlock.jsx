import React from 'react'
import { InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { cn } from '../../../lib/utils'
import { BookOpen, Lightbulb, FlaskConical, BrainCircuit } from 'lucide-react'

/**
 * TextBlock - Renders headings (H1-H6) and paragraphs with inline math support and HTML/SVG content
 *
 * Block structure:
 * {
 *   id: "block_uuid",
 *   type: "heading" | "paragraph",
 *   level: 1-6 (for headings),
 *   content: {
 *     text: "Default text with $inline math$ or <svg>...</svg> or HTML",
 *     text_ar: "النص العربي",
 *     text_en: "English text",
 *     text_fr: "Texte français"
 *   },
 *   properties: {
 *     color: "default" | "gray" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "red",
 *     alignment: "left" | "center" | "right",
 *     semanticType: "introduction" | "definition" | "example" | "theorem" | "note"
 *   }
 * }
 */
const TextBlock = ({ block, language }) => {
  const { type, level, content, properties = {} } = block

  // Get text based on language
  const getText = () => {
    if (language === 'ar' && content.text_ar) return content.text_ar
    if (language === 'fr' && content.text_fr) return content.text_fr
    if (language === 'en' && content.text_en) return content.text_en
    return content.text || ''
  }

  const text = getText()

  /**
   * Check if text contains HTML/SVG tags
   */
  const containsHTML = (text) => {
    if (!text || typeof text !== 'string') return false
    const hasHTML = /<\/?[a-z][\s\S]*>/i.test(text)

    // Debug logging
    if (hasHTML) {
      console.log('🔍 TextBlock - HTML/SVG detected:', text.substring(0, 100))
    }

    return hasHTML
  }

  /**
   * Parse text to extract inline math formulas
   * Returns array of {type: 'text'|'math', content: string}
   */
  const parseInlineMath = (text) => {
    if (!text) return []

    const parts = []
    let current = ''
    let inMath = false
    let i = 0

    while (i < text.length) {
      if (text[i] === '$') {
        // Check if it's escaped
        if (i > 0 && text[i - 1] === '\\') {
          current += '$'
          i++
          continue
        }

        // Toggle math mode
        if (inMath) {
          // End of math
          if (current) {
            parts.push({ type: 'math', content: current })
            current = ''
          }
          inMath = false
        } else {
          // Start of math
          if (current) {
            parts.push({ type: 'text', content: current })
            current = ''
          }
          inMath = true
        }
        i++
      } else {
        current += text[i]
        i++
      }
    }

    // Add remaining content
    if (current) {
      parts.push({ type: inMath ? 'text' : 'text', content: current })
    }

    return parts
  }

  /**
   * Render text with inline math support
   */
  const renderTextWithMath = (text) => {
    const parts = parseInlineMath(text)

    return parts.map((part, index) => {
      if (part.type === 'math') {
        return (
          <InlineMath key={index} math={part.content} />
        )
      }
      return <span key={index}>{part.content}</span>
    })
  }

  // Semantic type configurations (Notion-style)
  const semanticTypes = {
    introduction: {
      icon: BookOpen,
      label: { en: 'Introduction', ar: 'مقدمة', fr: 'Introduction' },
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-l-4 border-blue-500',
      iconColor: 'text-blue-600 dark:text-blue-400',
      textColor: 'text-blue-900 dark:text-blue-100'
    },
    definition: {
      icon: BrainCircuit,
      label: { en: 'Definition', ar: 'تعريف', fr: 'Définition' },
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      border: 'border-l-4 border-purple-500',
      iconColor: 'text-purple-600 dark:text-purple-400',
      textColor: 'text-purple-900 dark:text-purple-100'
    },
    example: {
      icon: Lightbulb,
      label: { en: 'Example', ar: 'مثال', fr: 'Exemple' },
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-l-4 border-amber-500',
      iconColor: 'text-amber-600 dark:text-amber-400',
      textColor: 'text-amber-900 dark:text-amber-100'
    },
    theorem: {
      icon: FlaskConical,
      label: { en: 'Theorem', ar: 'نظرية', fr: 'Théorème' },
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-l-4 border-emerald-500',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      textColor: 'text-emerald-900 dark:text-emerald-100'
    },
    note: {
      icon: BookOpen,
      label: { en: 'Note', ar: 'ملاحظة', fr: 'Remarque' },
      bg: 'bg-gray-50 dark:bg-gray-900/30',
      border: 'border-l-4 border-gray-500',
      iconColor: 'text-gray-600 dark:text-gray-400',
      textColor: 'text-gray-900 dark:text-gray-100'
    }
  }

  // Color classes mapping
  const colorClasses = {
    default: 'text-gray-900 dark:text-gray-100',
    gray: 'text-gray-600 dark:text-gray-400',
    brown: 'text-amber-800 dark:text-amber-400',
    orange: 'text-orange-600 dark:text-orange-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    green: 'text-green-600 dark:text-green-400',
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    pink: 'text-pink-600 dark:text-pink-400',
    red: 'text-red-600 dark:text-red-400',
  }

  // Alignment classes
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  const color = properties.color || 'default'
  const alignment = properties.alignment || 'left'
  const semanticType = properties.semanticType

  const baseClasses = cn(
    colorClasses[color],
    alignmentClasses[alignment],
    'leading-relaxed'
  )

  // Render heading
  if (type === 'heading') {
    const headingLevel = level || 2

    const headingClasses = {
      1: 'text-4xl font-bold mt-8 mb-4 border-b pb-2',
      2: 'text-3xl font-bold mt-6 mb-3',
      3: 'text-2xl font-semibold mt-5 mb-2',
      4: 'text-xl font-semibold mt-4 mb-2',
      5: 'text-lg font-semibold mt-3 mb-1',
      6: 'text-base font-semibold mt-2 mb-1',
    }

    const HeadingTag = `h${headingLevel}`

    return React.createElement(
      HeadingTag,
      {
        className: cn(baseClasses, headingClasses[headingLevel]),
      },
      text
    )
  }

  // Render semantic block (Notion-style callout for educational content)
  if (semanticType && semanticTypes[semanticType]) {
    const semantic = semanticTypes[semanticType]
    const IconComponent = semantic.icon
    const label = semantic.label[language] || semantic.label.en

    // Check if content has HTML/SVG
    const hasHTML = containsHTML(text)

    return (
      <div
        className={cn(
          'my-6 p-5 rounded-xl',
          semantic.bg,
          semantic.border,
          'shadow-md hover:shadow-lg transition-shadow duration-200',
          'border border-opacity-20'
        )}
      >
        <div className="flex items-start gap-4">
          <div className={cn(
            'h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0',
            semantic.bg,
            'ring-2 ring-offset-2',
            semantic.iconColor.replace('text-', 'ring-')
          )}>
            <IconComponent className={cn('h-5 w-5', semantic.iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className={cn('font-bold text-base mb-3', semantic.iconColor)}>
              {label}
            </div>
            {hasHTML ? (
              <div
                className={cn('text-base leading-relaxed semantic-content', semantic.textColor)}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            ) : (
              <div className={cn('text-base leading-relaxed', semantic.textColor)}>
                {renderTextWithMath(text)}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Render regular paragraph with HTML/SVG support or inline math
  const hasHTML = containsHTML(text)

  if (hasHTML) {
    return (
      <div
        className={cn(baseClasses, 'my-3 text-base leading-relaxed paragraph-html-content')}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    )
  }

  // Render paragraph with inline math support
  return (
    <p className={cn(baseClasses, 'my-3 text-base leading-relaxed')}>
      {renderTextWithMath(text)}
    </p>
  )
}

export default TextBlock
