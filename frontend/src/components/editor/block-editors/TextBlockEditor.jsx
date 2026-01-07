import React, { useRef, useEffect } from 'react'
import { useEditor } from '../EditorContext'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const TextBlockEditor = ({ block }) => {
  const { updateBlock, language } = useEditor()
  const textareaRef = useRef(null)

  const handleContentChange = (lang, value) => {
    const langKey = lang === 'default' ? 'text' : `text_${lang}`
    updateBlock(block.id, {
      content: {
        ...block.content,
        [langKey]: value
      }
    })
  }

  const handleLevelChange = (value) => {
    updateBlock(block.id, {
      level: parseInt(value)
    })
  }

  const handleTypeChange = (value) => {
    updateBlock(block.id, {
      type: value,
      level: value === 'heading' ? (block.level || 2) : undefined
    })
  }

  // Auto-focus when block is created
  useEffect(() => {
    if (textareaRef.current && !block.content?.text) {
      textareaRef.current.focus()
    }
  }, [])

  const getCurrentText = (lang) => {
    if (lang === 'default') return block.content?.text || ''
    return block.content?.[`text_${lang}`] || ''
  }

  return (
    <div className="space-y-4">
      {/* Block type and heading level selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label>Type:</Label>
          <Select value={block.type} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraph">Paragraph</SelectItem>
              <SelectItem value="heading">Heading</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {block.type === 'heading' && (
          <div className="flex items-center gap-2">
            <Label>Level:</Label>
            <Select value={String(block.level || 2)} onValueChange={handleLevelChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">H1</SelectItem>
                <SelectItem value="2">H2</SelectItem>
                <SelectItem value="3">H3</SelectItem>
                <SelectItem value="4">H4</SelectItem>
                <SelectItem value="5">H5</SelectItem>
                <SelectItem value="6">H6</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Multilingual text input */}
      <Tabs defaultValue="default" className="w-full">
        <TabsList>
          <TabsTrigger value="default">Default</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="ar">Arabic</TabsTrigger>
          <TabsTrigger value="fr">French</TabsTrigger>
        </TabsList>

        <TabsContent value="default" className="mt-4">
          <textarea
            ref={textareaRef}
            value={getCurrentText('default')}
            onChange={(e) => handleContentChange('default', e.target.value)}
            placeholder="Type your content here..."
            className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            style={{
              fontSize: block.type === 'heading' ? `${2.5 - (block.level || 2) * 0.2}rem` : '1rem',
              fontWeight: block.type === 'heading' ? 'bold' : 'normal'
            }}
          />
          <p className="text-xs text-gray-500 mt-1">
            Supports inline math with $...$ and HTML
          </p>
        </TabsContent>

        <TabsContent value="en" className="mt-4">
          <textarea
            value={getCurrentText('en')}
            onChange={(e) => handleContentChange('en', e.target.value)}
            placeholder="English content..."
            className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            style={{
              fontSize: block.type === 'heading' ? `${2.5 - (block.level || 2) * 0.2}rem` : '1rem',
              fontWeight: block.type === 'heading' ? 'bold' : 'normal'
            }}
          />
        </TabsContent>

        <TabsContent value="ar" className="mt-4">
          <textarea
            value={getCurrentText('ar')}
            onChange={(e) => handleContentChange('ar', e.target.value)}
            placeholder="محتوى عربي..."
            className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            dir="rtl"
            style={{
              fontSize: block.type === 'heading' ? `${2.5 - (block.level || 2) * 0.2}rem` : '1rem',
              fontWeight: block.type === 'heading' ? 'bold' : 'normal'
            }}
          />
        </TabsContent>

        <TabsContent value="fr" className="mt-4">
          <textarea
            value={getCurrentText('fr')}
            onChange={(e) => handleContentChange('fr', e.target.value)}
            placeholder="Contenu français..."
            className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            style={{
              fontSize: block.type === 'heading' ? `${2.5 - (block.level || 2) * 0.2}rem` : '1rem',
              fontWeight: block.type === 'heading' ? 'bold' : 'normal'
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
