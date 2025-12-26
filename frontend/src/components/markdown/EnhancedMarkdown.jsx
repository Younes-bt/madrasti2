import React, { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Button } from '../ui/button'
import { Copy, Check, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

/**
 * Enhanced Markdown Component with Interactive Features
 * - Syntax highlighting with copy buttons
 * - Collapsible sections
 * - Better typography
 * - Math support (KaTeX)
 * - Tables, task lists (GFM)
 * - Mermaid diagram support (optional)
 */

const EnhancedMarkdown = ({
  content,
  className = '',
  language = 'en',
  showCopyButton = true,
  collapsibleHeadings = false
}) => {
  const [copiedCode, setCopiedCode] = useState(null)
  const [collapsedSections, setCollapsedSections] = useState(new Set())

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const toggleSection = (id) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const components = {
    // Enhanced Code Blocks with Copy Button
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      const codeString = String(children).replace(/\n$/, '')
      const language = match ? match[1] : ''

      if (!inline && language) {
        return (
          <div className="relative group my-4">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg">
              <span className="text-xs text-gray-300 font-mono">{language}</span>
              {showCopyButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyCode(codeString)}
                  className="h-8 px-2 text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  {copiedCode === codeString ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      <span className="text-xs">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      <span className="text-xs">Copy</span>
                    </>
                  )}
                </Button>
              )}
            </div>
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={language}
              PreTag="div"
              className="!mt-0 !rounded-t-none"
              showLineNumbers
              {...props}
            >
              {codeString}
            </SyntaxHighlighter>
          </div>
        )
      }

      return (
        <code className={cn("bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono", className)} {...props}>
          {children}
        </code>
      )
    },

    // Enhanced Tables
    table({ children, ...props }) {
      return (
        <div className="my-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props}>
            {children}
          </table>
        </div>
      )
    },

    thead({ children, ...props }) {
      return (
        <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
          {children}
        </thead>
      )
    },

    th({ children, ...props }) {
      return (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" {...props}>
          {children}
        </th>
      )
    },

    td({ children, ...props }) {
      return (
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100" {...props}>
          {children}
        </td>
      )
    },

    // Enhanced Blockquotes - Smart Callout Detection (Multilingual)
    blockquote({ children, ...props }) {
      // Extract text content from children to detect keywords
      const textContent = React.Children.toArray(children)
        .map(child => {
          if (typeof child === 'string') return child
          if (child?.props?.children) {
            return typeof child.props.children === 'string'
              ? child.props.children
              : ''
          }
          return ''
        })
        .join(' ')
        .toLowerCase()

      // Define keyword patterns for different callout types (Arabic, French, English)
      const calloutTypes = {
        definition: {
          keywords: ['تعريف', 'définition', 'definition'],
          style: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100',
          icon: '📘'
        },
        example: {
          keywords: ['مثال', 'exemple', 'example'],
          style: 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100',
          icon: '✅'
        },
        note: {
          keywords: ['ملاحظة', 'remarque', 'note', 'ملحوظة'],
          style: 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100',
          icon: '💡'
        },
        property: {
          keywords: ['خاصية', 'propriété', 'property', 'خصائص'],
          style: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-100',
          icon: '⚡'
        },
        warning: {
          keywords: ['تنبيه', 'انتباه', 'attention', 'warning', 'important', 'مهم'],
          style: 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100',
          icon: '⚠️'
        },
        tip: {
          keywords: ['نصيحة', 'conseil', 'tip', 'astuce'],
          style: 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-900 dark:text-teal-100',
          icon: '💭'
        }
      }

      // Detect callout type based on keywords
      let detectedType = null
      for (const [type, config] of Object.entries(calloutTypes)) {
        if (config.keywords.some(keyword => textContent.includes(keyword))) {
          detectedType = config
          break
        }
      }

      // Apply detected style or default
      const style = detectedType
        ? detectedType.style
        : 'border-gray-400 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300'

      const icon = detectedType?.icon

      return (
        <blockquote
          className={`border-l-4 ${style} pl-4 py-3 my-4 rounded-r-lg flex items-start gap-3`}
          {...props}
        >
          {icon && <span className="text-2xl flex-shrink-0 mt-1">{icon}</span>}
          <div className="flex-1">
            {children}
          </div>
        </blockquote>
      )
    },

    // Enhanced Lists with Better Styling
    ul({ children, ...props }) {
      return (
        <ul className="space-y-2 my-4 list-disc list-inside" {...props}>
          {children}
        </ul>
      )
    },

    ol({ children, ...props }) {
      return (
        <ol className="space-y-2 my-4 list-decimal list-inside" {...props}>
          {children}
        </ol>
      )
    },

    li({ children, ...props }) {
      return (
        <li className="text-gray-700 dark:text-gray-300 leading-relaxed" {...props}>
          {children}
        </li>
      )
    },

    // Enhanced Headings with Collapsible Sections (optional)
    h1({ children, ...props }) {
      return (
        <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100 border-b pb-2" {...props}>
          {children}
        </h1>
      )
    },

    h2({ children, ...props }) {
      const id = String(children).toLowerCase().replace(/\s+/g, '-')
      const isCollapsed = collapsedSections.has(id)

      if (collapsibleHeadings) {
        return (
          <div className="my-6">
            <button
              onClick={() => toggleSection(id)}
              className="flex items-center gap-2 w-full text-left group"
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400" {...props}>
                {children}
              </h2>
            </button>
          </div>
        )
      }

      return (
        <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100" {...props}>
          {children}
        </h2>
      )
    },

    h3({ children, ...props }) {
      return (
        <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100" {...props}>
          {children}
        </h3>
      )
    },

    // Enhanced Links
    a({ children, href, ...props }) {
      return (
        <a
          href={href}
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
        </a>
      )
    },

    // Enhanced Paragraphs - Better Typography
    p({ children, ...props }) {
      return (
        <p className="my-4 text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-normal" {...props}>
          {children}
        </p>
      )
    },

    // Task Lists (GFM)
    input({ type, checked, ...props }) {
      if (type === 'checkbox') {
        return (
          <input
            type="checkbox"
            checked={checked}
            className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            disabled
            {...props}
          />
        )
      }
      return <input type={type} {...props} />
    }
  }

  // Detect content language
  const contentIsArabic = React.useMemo(() => {
    return /[\u0600-\u06FF]/.test(content || '')
  }, [content])

  const contentDirection = contentIsArabic ? 'rtl' : (language === 'ar' ? 'rtl' : 'ltr')
  const contentAlignment = contentDirection === 'rtl' ? 'text-right' : 'text-left'
  const fontFamily = contentIsArabic || language === 'ar' ? "'Almarai', 'Cairo', sans-serif" : "inherit"

  return (
    <div
      className={cn(
        "prose prose-lg max-w-none dark:prose-invert",
        "px-2 sm:px-4",
        contentAlignment,
        className
      )}
      dir={contentDirection}
      style={{
        fontFamily
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default EnhancedMarkdown
