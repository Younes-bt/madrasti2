import React, { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * ToggleBlock - Renders collapsible sections
 *
 * Block structure:
 * {
 *   id: "block_uuid",
 *   type: "toggle",
 *   content: {
 *     title: "Toggle title",
 *     title_ar: "العنوان",
 *     title_en: "Title",
 *     title_fr: "Titre",
 *     content: "Toggle content",
 *     content_ar: "المحتوى",
 *     content_en: "Content",
 *     content_fr: "Contenu"
 *   },
 *   properties: {
 *     defaultOpen: false
 *   }
 * }
 */
const ToggleBlock = ({ block, language }) => {
  const { content, properties = {} } = block
  const [isOpen, setIsOpen] = useState(properties.defaultOpen || false)

  // Get title based on language
  const getTitle = () => {
    if (language === 'ar' && content.title_ar) return content.title_ar
    if (language === 'fr' && content.title_fr) return content.title_fr
    if (language === 'en' && content.title_en) return content.title_en
    return content.title || ''
  }

  // Get content based on language
  const getContent = () => {
    if (language === 'ar' && content.content_ar) return content.content_ar
    if (language === 'fr' && content.content_fr) return content.content_fr
    if (language === 'en' && content.content_en) return content.content_en
    return content.content || ''
  }

  const title = getTitle()
  const toggleContent = getContent()

  return (
    <div className="my-3 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center gap-2 p-3',
          'bg-gray-50 dark:bg-gray-800/50',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          'text-left transition-colors'
        )}
      >
        {isOpen ? (
          <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500 flex-shrink-0" />
        )}
        <span className="flex-1 font-medium text-gray-900 dark:text-gray-100">
          {title}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              {toggleContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ToggleBlock
