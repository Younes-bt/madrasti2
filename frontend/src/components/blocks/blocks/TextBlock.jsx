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

  // Semantic type configurations (Premium styles matching user requests)
  const semanticTypes = {
    introduction: {
      icon: BookOpen,
      label: { en: 'Introduction', ar: 'مقدمة', fr: 'Introduction' },
      bg: 'bg-white border-2 border-indigo-50 shadow-sm',
      border: '',
      iconColor: 'text-indigo-600',
      textColor: 'text-gray-700', // Specific containers keep specific text color
      badgeBg: 'bg-indigo-50',
      badgeText: 'text-indigo-700'
    },
    definition: {
      icon: BrainCircuit,
      label: { en: 'Definition', ar: 'تعريف', fr: 'Définition' },
      bg: 'bg-indigo-50', // Fixed: Use direct Tailwind class
      border: 'border-r-4 border-indigo-500',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      textColor: 'text-gray-800 dark:text-indigo-950',
      badgeBg: 'bg-white dark:bg-indigo-900',
      badgeText: 'text-indigo-700 dark:text-indigo-300'
    },
    example: {
      icon: Lightbulb,
      label: { en: 'Example', ar: 'مثال', fr: 'Exemple' },
      bg: 'bg-amber-50', // Fixed
      border: 'border-r-4 border-amber-500',
      iconColor: 'text-amber-600 dark:text-amber-400',
      textColor: 'text-gray-800 dark:text-amber-900',
      badgeBg: 'bg-white dark:bg-amber-900',
      badgeText: 'text-amber-700 dark:text-amber-300'
    },
    theorem: {
      icon: FlaskConical,
      label: { en: 'Theorem', ar: 'نظرية', fr: 'Théorème' },
      bg: 'bg-teal-50', // Fixed
      border: 'border-r-4 border-teal-500',
      iconColor: 'text-teal-600 dark:text-teal-400',
      textColor: 'text-gray-800 dark:text-teal-900',
      badgeBg: 'bg-white dark:bg-teal-900',
      badgeText: 'text-teal-700 dark:text-teal-300'
    },
    formula: {
      icon: FlaskConical,
      label: { en: 'Formula', ar: 'قاعدة', fr: 'Formule' },
      bg: 'bg-blue-50', // Fixed
      border: 'border-r-4 border-blue-500',
      iconColor: 'text-blue-600 dark:text-blue-400',
      textColor: 'text-gray-800 dark:text-blue-900',
      badgeBg: 'bg-white dark:bg-blue-900',
      badgeText: 'text-blue-700 dark:text-blue-300'
    },
    summary: { // For inner summary blocks if used
      icon: BookOpen,
      label: { en: 'Summary', ar: 'ملخص الدرس', fr: 'Résumé' },
      bg: 'bg-gradient-to-br from-indigo-900 to-purple-900',
      border: 'border-2 border-white/20',
      iconColor: 'text-white',
      textColor: 'text-white',
      badgeBg: 'bg-white/10 backdrop-blur-sm',
      badgeText: 'text-white'
    },
    note: {
      icon: BookOpen,
      label: { en: 'Note', ar: 'ملاحظة', fr: 'Remarque' },
      bg: 'bg-gray-50',
      border: 'border-r-4 border-gray-500',
      iconColor: 'text-gray-600 dark:text-gray-400',
      textColor: 'text-gray-900 dark:text-gray-100',
      badgeBg: 'bg-white dark:bg-gray-900',
      badgeText: 'text-gray-700 dark:text-gray-300'
    }
  }

  // Color classes mapping
  const colorClasses = {
    default: '', // Updated: Remove specific color to allow inheritance (e.g. from Summary parent)
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
  // Check both semanticType in properties and section_type in content
  // Prioritize semanticType if it exists
  const semanticType = properties.semanticType || content.section_type

  const baseClasses = cn(
    colorClasses[color],
    alignmentClasses[alignment],
    'leading-relaxed'
  )

  // Render heading
  if (type === 'heading') {
    const headingLevel = level || 2

    // If it's a semantic heading, render it with special styling
    if (semanticType && semanticTypes[semanticType]) {
      const semantic = semanticTypes[semanticType]
      const IconComponent = semantic.icon
      const label = semantic.label[language] || semantic.label.en
      const isRTL = language === 'ar'

      return (
        <div className={cn('my-10 mb-6', isRTL ? 'text-right' : 'text-left')}>
          <div className={cn(
            'flex items-center gap-4 p-1 rounded-2xl shadow-sm border border-opacity-20 w-fit min-w-[300px]',
            semantic.bg,
            isRTL ? 'flex-row-reverse pl-6' : 'flex-row pr-6'
          )}>
            <div className={cn('p-2 rounded-xl bg-white/50 dark:bg-black/20', semantic.iconColor)}>
              <IconComponent className="h-6 w-6" />
            </div>
            <div className={cn('flex flex-col', isRTL ? 'text-right' : 'text-left')}>
              <span className={cn('text-[10px] uppercase tracking-widest font-extrabold opacity-80', semantic.textColor)}>
                {label}
              </span>
              <h2 className={cn('text-2xl font-bold m-0 leading-tight', semantic.textColor)}>
                {text}
              </h2>
            </div>
          </div>
        </div>
      )
    }

    const headingClasses = {
      1: 'text-4xl font-bold mt-10 mb-6 border-b pb-3',
      2: 'text-3xl font-bold mt-8 mb-4',
      3: 'text-2xl font-semibold mt-6 mb-3',
      4: 'text-xl font-semibold mt-5 mb-2',
      5: 'text-lg font-semibold mt-4 mb-2',
      6: 'text-base font-semibold mt-3 mb-1',
    }

    const HeadingTag = `h${headingLevel}`

    return React.createElement(
      HeadingTag,
      {
        className: cn(baseClasses, headingClasses[headingLevel], 'tracking-tight'),
      },
      text
    )
  }

  // Render semantic block (Notion-style callout for educational content)
  if (semanticType && semanticTypes[semanticType]) {
    const semantic = semanticTypes[semanticType]
    const IconComponent = semantic.icon
    const label = semantic.label[language] || semantic.label.en
    const isRTL = language === 'ar'

    // Check if content has HTML/SVG
    const hasHTML = containsHTML(text)

    return (
      <div
        className={cn(
          'my-10 p-8 md:p-10 rounded-3xl relative',
          semantic.bg,
          semantic.border,
          'shadow-md border border-opacity-20 transition-all duration-300 hover:shadow-xl'
        )}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Badge positioned on the right for RTL, left for LTR - more modern floating style */}
        <div
          className={cn(
            'absolute -top-5',
            isRTL ? 'right-8' : 'left-8',
            'flex items-center gap-2.5 px-6 py-3 rounded-2xl',
            semantic.badgeBg,
            'shadow-lg z-10 border border-white/20'
          )}
        >
          <IconComponent className={cn('h-6 w-6', semantic.iconColor)} />
          <span className={cn('font-bold text-sm tracking-wider uppercase', semantic.badgeText)}>
            {label}
          </span>
        </div>

        {/* Content with proper spacing from badge */}
        <div className={cn('mt-8', isRTL ? 'text-right' : 'text-left')}>
          {hasHTML ? (
            <div
              className={cn('text-lg leading-relaxed md:text-xl semantic-content', semantic.textColor)}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          ) : (
            <div className={cn('text-lg leading-relaxed md:text-xl font-medium', semantic.textColor)}>
              {renderTextWithMath(text)}
            </div>
          )}
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
