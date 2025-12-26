import React from 'react'
import { cn } from '../../../lib/utils'

/**
 * AudioBlock - Renders audio players
 *
 * Block structure:
 * {
 *   id: "block_uuid",
 *   type: "audio",
 *   content: {
 *     url: "https://example.com/audio.mp3"
 *   },
 *   properties: {
 *     caption: "Optional caption",
 *     caption_ar: "تسمية توضيحية",
 *     caption_en: "Caption",
 *     caption_fr: "Légende"
 *   }
 * }
 */
const AudioBlock = ({ block, language }) => {
  const { content, properties = {} } = block

  const url = content?.url || ''

  // Get caption based on language
  const getCaption = () => {
    if (language === 'ar' && properties.caption_ar) return properties.caption_ar
    if (language === 'fr' && properties.caption_fr) return properties.caption_fr
    if (language === 'en' && properties.caption_en) return properties.caption_en
    return properties.caption || ''
  }

  const caption = getCaption()

  if (!url) {
    return null
  }

  return (
    <figure className="my-6">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <audio
          src={url}
          controls
          className="w-full"
        >
          Your browser does not support the audio element.
        </audio>
      </div>

      {caption && (
        <figcaption className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export default AudioBlock
