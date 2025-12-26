import React from 'react'
import { cn } from '../../../lib/utils'
import { InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'

/**
 * TableBlock - Renders tables with support for HTML/SVG content
 *
 * Block structure:
 * Option 1 - Array-based table:
 * {
 *   id: "block_uuid",
 *   type: "table",
 *   content: {
 *     headers: ["Column 1", "Column 2", "Column 3"],
 *     rows: [
 *       ["Cell 1", "Cell 2", "Cell 3"],
 *       ["Cell 4", "Cell 5", "Cell 6"]
 *     ]
 *   },
 *   properties: {
 *     hasHeader: true,
 *     striped: true
 *   }
 * }
 * 
 * Option 2 - HTML-based table:
 * {
 *   id: "block_uuid",
 *   type: "table",
 *   content: {
 *     html: "<table>...</table>",
 *     description: "Optional description"
 *   }
 * }
 */
const TableBlock = ({ block }) => {
  const { content, properties = {} } = block

  /**
   * Check if text contains HTML/SVG tags
   */
  const containsHTML = (text) => {
    if (typeof text !== 'string') return false
    return /<\/?[a-z][\s\S]*>/i.test(text)
  }

  /**
   * Parse text to extract inline math formulas
   */
  const parseInlineMath = (text) => {
    if (!text || typeof text !== 'string') return []

    const parts = []
    let current = ''
    let inMath = false
    let i = 0

    while (i < text.length) {
      if (text[i] === '$') {
        if (i > 0 && text[i - 1] === '\\') {
          current += '$'
          i++
          continue
        }

        if (inMath) {
          if (current) {
            parts.push({ type: 'math', content: current })
            current = ''
          }
          inMath = false
        } else {
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

    if (current) {
      parts.push({ type: inMath ? 'text' : 'text', content: current })
    }

    return parts
  }

  /**
   * Render cell content with support for HTML/SVG and inline math
   */
  const renderCellContent = (cell) => {
    if (cell === null || cell === undefined) return ''

    const cellText = String(cell)

    // If contains HTML/SVG, render with dangerouslySetInnerHTML
    if (containsHTML(cellText)) {
      return (
        <div
          className="table-cell-html"
          dangerouslySetInnerHTML={{ __html: cellText }}
        />
      )
    }

    // Check for inline math
    const parts = parseInlineMath(cellText)

    if (parts.some(p => p.type === 'math')) {
      return parts.map((part, index) => {
        if (part.type === 'math') {
          return <InlineMath key={index} math={part.content} />
        }
        return <span key={index}>{part.content}</span>
      })
    }

    // Plain text
    return cellText
  }

  // Check if this is an HTML table
  if (content?.html) {
    return (
      <div className="my-6">
        {content.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">
            {content.description}
          </p>
        )}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div
            className="lesson-table-html min-w-full"
            dangerouslySetInnerHTML={{ __html: content.html }}
          />
        </div>
      </div>
    )
  }

  // Array-based table
  const headers = content?.headers || []
  const rows = content?.rows || []
  const hasHeader = properties.hasHeader !== false // default true
  const striped = properties.striped !== false // default true

  if (rows.length === 0) {
    return null
  }

  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {hasHeader && headers.length > 0 && (
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {renderCellContent(header)}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody
          className={cn(
            striped && 'divide-y divide-gray-200 dark:divide-gray-700'
          )}
        >
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                striped && rowIndex % 2 === 0
                  ? 'bg-white dark:bg-gray-900'
                  : 'bg-gray-50 dark:bg-gray-800/50',
                'hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
              )}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
                >
                  {renderCellContent(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableBlock
