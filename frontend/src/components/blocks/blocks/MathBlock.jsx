import React from 'react'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { cn } from '../../../lib/utils'

/**
 * MathBlock - Renders mathematical formulas using KaTeX
 *
 * Block structure:
 * {
 *   id: "block_uuid",
 *   type: "math",
 *   content: {
 *     formula: "E = mc^2",
 *     displayMode: "inline" | "block"
 *   },
 *   properties: {
 *     caption: "Optional caption",
 *     caption_ar: "تسمية توضيحية",
 *     caption_en: "Caption",
 *     caption_fr: "Légende"
 *   }
 * }
 */
const MathBlock = ({ block, language }) => {
  const { content, properties = {} } = block

  const formula = content?.formula || ''
  const displayMode = content?.displayMode || 'block'

  // Get caption based on language
  const getCaption = () => {
    if (language === 'ar' && properties.caption_ar) return properties.caption_ar
    if (language === 'fr' && properties.caption_fr) return properties.caption_fr
    if (language === 'en' && properties.caption_en) return properties.caption_en
    return properties.caption || ''
  }

  const caption = getCaption()

  if (!formula) {
    return null
  }

  return (
    <div className="my-4">
      {displayMode === 'inline' ? (
        <div className="inline-block">
          <InlineMath math={formula} />
        </div>
      ) : (
        <div className={cn(
          'flex justify-center items-center py-4',
          'bg-gray-50 dark:bg-gray-800/50 rounded-lg'
        )}>
          <BlockMath math={formula} />
        </div>
      )}

      {/* Optional caption */}
      {caption && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
          {caption}
        </p>
      )}
    </div>
  )
}

export default MathBlock
