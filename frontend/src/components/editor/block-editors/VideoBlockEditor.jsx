import React from 'react'
import { useEditor } from '../EditorContext'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export const VideoBlockEditor = ({ block }) => {
  const { updateBlock } = useEditor()

  const handleUrlChange = (value) => {
    updateBlock(block.id, {
      content: {
        ...block.content,
        url: value
      }
    })
  }

  const handleCaptionChange = (value) => {
    updateBlock(block.id, {
      properties: {
        ...block.properties,
        caption: value
      }
    })
  }

  // Check if it's a YouTube or Vimeo URL
  const getVideoEmbedUrl = (url) => {
    if (!url) return null

    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }

    // Direct video URL
    return url
  }

  const embedUrl = getVideoEmbedUrl(block.content?.url)

  return (
    <div className="space-y-4">
      <div>
        <Label>Video URL</Label>
        <Input
          type="url"
          value={block.content?.url || ''}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          Supports YouTube, Vimeo, or direct video URLs
        </p>
      </div>

      {embedUrl && (
        <div>
          <Label>Preview</Label>
          <div className="border rounded-md p-4 bg-gray-50">
            {embedUrl.includes('youtube.com') || embedUrl.includes('vimeo.com') ? (
              <iframe
                src={embedUrl}
                className="w-full aspect-video rounded"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={embedUrl}
                controls
                className="w-full rounded"
              />
            )}
          </div>
        </div>
      )}

      <div>
        <Label>Caption (optional)</Label>
        <Input
          value={block.properties?.caption || ''}
          onChange={(e) => handleCaptionChange(e.target.value)}
          placeholder="Video caption..."
          className="mt-1"
        />
      </div>
    </div>
  )
}
