import React, { useState } from 'react'
import { cn } from '../../../lib/utils'

/**
 * ImageBlock - Renders images with captions
 *
 * Block structure:
 * {
 *   id: "block_uuid",
 *   type: "image",
 *   content: {
 *     url: "https://example.com/image.jpg",
 *     alt: "Image description",
 *     alt_ar: "وصف الصورة",
 *     alt_en: "Image description",
 *     alt_fr: "Description de l'image"
 *   },
 *   properties: {
 *     caption: "Optional caption",
 *     caption_ar: "تسمية توضيحية",
 *     caption_en: "Caption",
 *     caption_fr: "Légende",
 *     width: "full" | "medium" | "small",
 *     alignment: "left" | "center" | "right"
 *   }
 * }
 */
const ImageBlock = ({ block, language }) => {
  const { content, properties = {} } = block
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const url = content?.url || ''

  // Get alt text based on language
  const getAlt = () => {
    if (language === 'ar' && content.alt_ar) return content.alt_ar
    if (language === 'fr' && content.alt_fr) return content.alt_fr
    if (language === 'en' && content.alt_en) return content.alt_en
    return content.alt || 'Image'
  }

  // Get caption based on language
  const getCaption = () => {
    if (language === 'ar' && properties.caption_ar) return properties.caption_ar
    if (language === 'fr' && properties.caption_fr) return properties.caption_fr
    if (language === 'en' && properties.caption_en) return properties.caption_en
    return properties.caption || ''
  }

  const alt = getAlt()
  const caption = getCaption()

  // Width mapping
  const widthClasses = {
    full: 'w-full',
    medium: 'max-w-2xl',
    small: 'max-w-md'
  }

  // Alignment mapping
  const alignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto'
  }

  const width = properties.width || 'full'
  const alignment = properties.alignment || 'center'

  // Handle raw SVG/HTML content (for diagrams/charts)
  if (content?.data || content?.html) {
    return (
      <figure
        className={cn(
          'my-6',
          widthClasses[width],
          alignmentClasses[alignment]
        )}
      >
        <div
          className="rounded-lg overflow-hidden semantic-content image-block-svg"
          dangerouslySetInnerHTML={{ __html: content.data || content.html }}
          style={{ display: 'flex', justifyContent: alignment === 'center' ? 'center' : (alignment === 'right' ? 'flex-end' : 'flex-start') }}
        />
        {caption && (
          <figcaption className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }

  if (!url) {
    return null
  }

  return (
    <figure
      className={cn(
        'my-6',
        widthClasses[width],
        alignmentClasses[alignment]
      )}
    >
      <div className="relative">
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error ? (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center text-gray-500">
            <p>Failed to load image</p>
          </div>
        ) : (
          <img
            src={url}
            alt={alt}
            className={cn(
              'rounded-lg w-full h-auto',
              loading && 'opacity-0',
              'transition-opacity duration-300'
            )}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false)
              setError(true)
            }}
          />
        )}
      </div>

      {caption && !error && (
        <figcaption className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export default ImageBlock
