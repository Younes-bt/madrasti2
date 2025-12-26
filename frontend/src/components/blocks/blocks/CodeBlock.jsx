import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Button } from '../../ui/button'
import { Copy, Check } from 'lucide-react'

/**
 * CodeBlock - Renders code with syntax highlighting and copy button
 *
 * Block structure:
 * {
 *   id: "block_uuid",
 *   type: "code",
 *   content: {
 *     code: "const x = 10;",
 *     language: "javascript" | "python" | "java" | etc.
 *   },
 *   properties: {
 *     showLineNumbers: true | false,
 *     caption: "Optional caption",
 *     caption_ar: "تسمية توضيحية",
 *     caption_en: "Caption",
 *     caption_fr: "Légende"
 *   }
 * }
 */
const CodeBlock = ({ block, language }) => {
  const { content, properties = {} } = block
  const [copied, setCopied] = useState(false)

  const code = content?.code || ''
  const codeLanguage = content?.language || 'text'
  const showLineNumbers = properties.showLineNumbers !== false // default true

  // Get caption based on language
  const getCaption = () => {
    if (language === 'ar' && properties.caption_ar) return properties.caption_ar
    if (language === 'fr' && properties.caption_fr) return properties.caption_fr
    if (language === 'en' && properties.caption_en) return properties.caption_en
    return properties.caption || ''
  }

  const caption = getCaption()

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-4">
      <div className="relative group">
        {/* Header with language label and copy button */}
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg">
          <span className="text-xs text-gray-300 font-mono">{codeLanguage}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 px-2 text-gray-300 hover:text-white hover:bg-gray-700"
          >
            {copied ? (
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
        </div>

        {/* Code content */}
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={codeLanguage}
          PreTag="div"
          className="!mt-0 !rounded-t-none !rounded-b-lg"
          showLineNumbers={showLineNumbers}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {/* Optional caption */}
      {caption && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
          {caption}
        </p>
      )}
    </div>
  )
}

export default CodeBlock
