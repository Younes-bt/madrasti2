import React from 'react'
import { useEditor } from '../EditorContext'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export const AudioBlockEditor = ({ block }) => {
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

  return (
    <div className="space-y-4">
      <div>
        <Label>Audio URL</Label>
        <Input
          type="url"
          value={block.content?.url || ''}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com/audio.mp3"
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          Upload audio file to Cloudinary or paste URL
        </p>
      </div>

      {block.content?.url && (
        <div>
          <Label>Preview</Label>
          <div className="border rounded-md p-4 bg-gray-50">
            <audio
              src={block.content.url}
              controls
              className="w-full"
            />
          </div>
        </div>
      )}

      <div>
        <Label>Caption (optional)</Label>
        <Input
          value={block.properties?.caption || ''}
          onChange={(e) => handleCaptionChange(e.target.value)}
          placeholder="Audio caption..."
          className="mt-1"
        />
      </div>
    </div>
  )
}
