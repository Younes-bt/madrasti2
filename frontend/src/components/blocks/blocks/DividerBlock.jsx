import React from 'react'
import { cn } from '../../../lib/utils'

/**
 * DividerBlock - Renders horizontal dividers
 *
 * Block structure:
 * {
 *   id: "block_uuid",
 *   type: "divider",
 *   properties: {
 *     style: "solid" | "dashed" | "dotted"
 *   }
 * }
 */
const DividerBlock = ({ block }) => {
  const { properties = {} } = block

  const style = properties.style || 'solid'

  const styleClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted'
  }

  return (
    <hr
      className={cn(
        'my-6 border-gray-300 dark:border-gray-700',
        styleClasses[style]
      )}
    />
  )
}

export default DividerBlock
