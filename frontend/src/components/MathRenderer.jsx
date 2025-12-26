import React from 'react'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

/**
 * MathRenderer component that detects and renders LaTeX math formulas
 * Supports both inline math ($...$) and display math ($$...$$)
 */
const MathRenderer = ({ text, className = '' }) => {
  if (!text) return null

  // Helper function to split text by math delimiters
  const parseText = (input) => {
    const parts = []
    let currentPos = 0
    const str = String(input)

    // Regex to match $$...$$ (block math) or $...$ (inline math)
    // We need to match block math first to avoid confusion
    const mathRegex = /(\$\$[^$]+\$\$|\$[^$]+\$)/g
    let match

    while ((match = mathRegex.exec(str)) !== null) {
      // Add text before math
      if (match.index > currentPos) {
        parts.push({
          type: 'text',
          content: str.substring(currentPos, match.index)
        })
      }

      // Add math part
      const mathContent = match[0]
      if (mathContent.startsWith('$$') && mathContent.endsWith('$$')) {
        // Block math
        parts.push({
          type: 'block',
          content: mathContent.slice(2, -2)
        })
      } else if (mathContent.startsWith('$') && mathContent.endsWith('$')) {
        // Inline math
        parts.push({
          type: 'inline',
          content: mathContent.slice(1, -1)
        })
      }

      currentPos = match.index + mathContent.length
    }

    // Add remaining text
    if (currentPos < str.length) {
      parts.push({
        type: 'text',
        content: str.substring(currentPos)
      })
    }

    return parts
  }

  const parts = parseText(text)

  // If no math formulas found, return plain text
  if (parts.length === 0 || (parts.length === 1 && parts[0].type === 'text')) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return <span key={index}>{part.content}</span>
        } else if (part.type === 'inline') {
          try {
            return <InlineMath key={index} math={part.content} />
          } catch (error) {
            console.error('Error rendering inline math:', error)
            return <span key={index}>${part.content}$</span>
          }
        } else if (part.type === 'block') {
          try {
            return <BlockMath key={index} math={part.content} />
          } catch (error) {
            console.error('Error rendering block math:', error)
            return <span key={index}>$${part.content}$$</span>
          }
        }
        return null
      })}
    </span>
  )
}

export default MathRenderer
