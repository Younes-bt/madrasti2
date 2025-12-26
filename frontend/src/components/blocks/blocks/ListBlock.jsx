import React from 'react'
import { cn } from '../../../lib/utils'
import { Check, Circle } from 'lucide-react'

/**
 * ListBlock - Renders bulleted, numbered, and todo lists
 *
 * Block structure:
 * {
 *   id: "block_uuid",
 *   type: "list",
 *   listType: "bulleted" | "numbered" | "todo",
 *   content: {
 *     items: [
 *       {
 *         text: "Item text",
 *         text_ar: "النص العربي",
 *         text_en: "English text",
 *         text_fr: "Texte français",
 *         checked: false (for todo lists)
 *       }
 *     ]
 *   }
 * }
 */
const ListBlock = ({ block, language }) => {
  // Handle different data structures for list type
  let listType = block.listType;

  // Fallback to style property if listType is missing (backend compatibility)
  if (!listType && block.style) {
    if (block.style === 'unordered') listType = 'bulleted';
    else if (block.style === 'ordered') listType = 'numbered';
    else if (block.style === 'checked') listType = 'todo'; // Assuming 'checked' or similar might be used
    else listType = block.style; // Fallback to raw style
  }

  // Default to bulleted
  listType = listType || 'bulleted';

  const { content } = block
  const items = content?.items || []

  // Get text based on language
  const getText = (item) => {
    // Handle simple string items (legacy/simple format)
    if (typeof item === 'string') return item;

    if (language === 'ar' && item.text_ar) return item.text_ar
    if (language === 'fr' && item.text_fr) return item.text_fr
    if (language === 'en' && item.text_en) return item.text_en
    return item.text || ''
  }

  if (items.length === 0) {
    return null
  }

  // Render bulleted list
  if (listType === 'bulleted') {
    return (
      <ul className="my-3 space-y-1.5">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
          >
            <Circle className="h-2 w-2 mt-2 flex-shrink-0 fill-current" />
            <span className="flex-1">{getText(item)}</span>
          </li>
        ))}
      </ul>
    )
  }

  // Render numbered list
  if (listType === 'numbered') {
    return (
      <ol className="my-3 space-y-1.5 list-decimal list-inside">
        {items.map((item, index) => (
          <li
            key={index}
            className="text-gray-700 dark:text-gray-300"
          >
            {getText(item)}
          </li>
        ))}
      </ol>
    )
  }

  // Render todo list
  if (listType === 'todo') {
    return (
      <div className="my-3 space-y-2">
        {items.map((item, index) => {
          const checked = item.checked || false
          return (
            <div
              key={index}
              className="flex items-start gap-2"
            >
              <div
                className={cn(
                  'w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0',
                  checked
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-300 dark:border-gray-600'
                )}
              >
                {checked && <Check className="h-3 w-3 text-white" />}
              </div>
              <span
                className={cn(
                  'flex-1',
                  checked
                    ? 'line-through text-gray-500 dark:text-gray-500'
                    : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {getText(item)}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  return null
}

export default ListBlock
