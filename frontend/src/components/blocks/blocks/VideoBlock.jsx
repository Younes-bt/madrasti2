import React from 'react'
import { cn } from '../../../lib/utils'

/**
 * VideoBlock - Renders video embeds (YouTube, Vimeo, or direct video)
 *
 * Block structure:
 * {
 *   id: "block_uuid",
 *   type: "video",
 *   content: {
 *     url: "https://www.youtube.com/watch?v=...",
 *     provider: "youtube" | "vimeo" | "direct"
 *   },
 *   properties: {
 *     caption: "Optional caption",
 *     caption_ar: "تسمية توضيحية",
 *     caption_en: "Caption",
 *     caption_fr: "Légende",
 *     aspectRatio: "16:9" | "4:3" | "1:1"
 *   }
 * }
 */
const VideoBlock = ({ block, language }) => {
  const { content, properties = {} } = block

  const url = content?.url || ''
  const provider = content?.provider || 'direct'

  // Get caption based on language
  const getCaption = () => {
    if (language === 'ar' && properties.caption_ar) return properties.caption_ar
    if (language === 'fr' && properties.caption_fr) return properties.caption_fr
    if (language === 'en' && properties.caption_en) return properties.caption_en
    return properties.caption || ''
  }

  const caption = getCaption()

  // Aspect ratio mapping
  const aspectRatios = {
    '16:9': 'aspect-video', // 16:9
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square'
  }

  const aspectRatio = properties.aspectRatio || '16:9'

  // Extract YouTube video ID
  const getYouTubeEmbedUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    const videoId = match && match[2].length === 11 ? match[2] : null
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null
  }

  // Extract Vimeo video ID
  const getVimeoEmbedUrl = (url) => {
    const regExp = /vimeo\.com\/(\d+)/
    const match = url.match(regExp)
    const videoId = match ? match[1] : null
    return videoId ? `https://player.vimeo.com/video/${videoId}` : null
  }

  let embedUrl = url

  if (provider === 'youtube') {
    embedUrl = getYouTubeEmbedUrl(url) || url
  } else if (provider === 'vimeo') {
    embedUrl = getVimeoEmbedUrl(url) || url
  }

  if (!url) {
    return null
  }

  return (
    <figure className="my-6">
      <div
        className={cn(
          'relative w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800',
          aspectRatios[aspectRatio]
        )}
      >
        {provider === 'direct' ? (
          <video
            src={url}
            controls
            className="absolute inset-0 w-full h-full"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video player"
          />
        )}
      </div>

      {caption && (
        <figcaption className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export default VideoBlock
