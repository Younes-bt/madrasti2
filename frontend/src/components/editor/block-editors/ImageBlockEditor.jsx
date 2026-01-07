import React from 'react'
import { useEditor } from '../EditorContext'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const ImageBlockEditor = ({ block }) => {
  const { updateBlock } = useEditor()

  const handleUrlChange = (value) => {
    updateBlock(block.id, {
      content: {
        ...block.content,
        url: value
      }
    })
  }

  const handleAltChange = (lang, value) => {
    const langKey = lang === 'default' ? 'alt' : `alt_${lang}`
    updateBlock(block.id, {
      content: {
        ...block.content,
        [langKey]: value
      }
    })
  }

  const handleCaptionChange = (lang, value) => {
    const langKey = lang === 'default' ? 'caption' : `caption_${lang}`
    updateBlock(block.id, {
      properties: {
        ...block.properties,
        [langKey]: value
      }
    })
  }

  const handleWidthChange = (value) => {
    updateBlock(block.id, {
      properties: {
        ...block.properties,
        width: value
      }
    })
  }

  const getCurrentAlt = (lang) => {
    if (lang === 'default') return block.content?.alt || ''
    return block.content?.[`alt_${lang}`] || ''
  }

  const getCurrentCaption = (lang) => {
    if (lang === 'default') return block.properties?.caption || ''
    return block.properties?.[`caption_${lang}`] || ''
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Image URL</Label>
        <Input
          type="url"
          value={block.content?.url || ''}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg or upload to Cloudinary"
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          Paste image URL or upload to your media library
        </p>
      </div>

      {block.content?.url && (
        <div>
          <Label>Preview</Label>
          <div className="border rounded-md p-4 bg-gray-50">
            <img
              src={block.content.url}
              alt={getCurrentAlt('default')}
              className="max-w-full h-auto rounded"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EInvalid URL%3C/text%3E%3C/svg%3E'
              }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Label>Width:</Label>
        <Select
          value={block.properties?.width || 'full'}
          onValueChange={handleWidthChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="full">Full Width</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Alt Text (for accessibility)</Label>
        <Tabs defaultValue="default" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="default">Default</TabsTrigger>
            <TabsTrigger value="en">EN</TabsTrigger>
            <TabsTrigger value="ar">AR</TabsTrigger>
            <TabsTrigger value="fr">FR</TabsTrigger>
          </TabsList>

          <TabsContent value="default" className="mt-2">
            <Input
              value={getCurrentAlt('default')}
              onChange={(e) => handleAltChange('default', e.target.value)}
              placeholder="Describe the image..."
            />
          </TabsContent>

          <TabsContent value="en" className="mt-2">
            <Input
              value={getCurrentAlt('en')}
              onChange={(e) => handleAltChange('en', e.target.value)}
              placeholder="English description..."
            />
          </TabsContent>

          <TabsContent value="ar" className="mt-2">
            <Input
              value={getCurrentAlt('ar')}
              onChange={(e) => handleAltChange('ar', e.target.value)}
              placeholder="وصف عربي..."
              dir="rtl"
            />
          </TabsContent>

          <TabsContent value="fr" className="mt-2">
            <Input
              value={getCurrentAlt('fr')}
              onChange={(e) => handleAltChange('fr', e.target.value)}
              placeholder="Description française..."
            />
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <Label>Caption (optional)</Label>
        <Tabs defaultValue="default" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="default">Default</TabsTrigger>
            <TabsTrigger value="en">EN</TabsTrigger>
            <TabsTrigger value="ar">AR</TabsTrigger>
            <TabsTrigger value="fr">FR</TabsTrigger>
          </TabsList>

          <TabsContent value="default" className="mt-2">
            <Input
              value={getCurrentCaption('default')}
              onChange={(e) => handleCaptionChange('default', e.target.value)}
              placeholder="Image caption..."
            />
          </TabsContent>

          <TabsContent value="en" className="mt-2">
            <Input
              value={getCurrentCaption('en')}
              onChange={(e) => handleCaptionChange('en', e.target.value)}
              placeholder="English caption..."
            />
          </TabsContent>

          <TabsContent value="ar" className="mt-2">
            <Input
              value={getCurrentCaption('ar')}
              onChange={(e) => handleCaptionChange('ar', e.target.value)}
              placeholder="تسمية توضيحية..."
              dir="rtl"
            />
          </TabsContent>

          <TabsContent value="fr" className="mt-2">
            <Input
              value={getCurrentCaption('fr')}
              onChange={(e) => handleCaptionChange('fr', e.target.value)}
              placeholder="Légende..."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
