import React from 'react'
import { useEditor } from '../EditorContext'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const QuoteBlockEditor = ({ block }) => {
  const { updateBlock } = useEditor()

  const handleContentChange = (lang, value) => {
    const langKey = lang === 'default' ? 'text' : `text_${lang}`
    updateBlock(block.id, {
      content: {
        ...block.content,
        [langKey]: value
      }
    })
  }

  const getCurrentText = (lang) => {
    if (lang === 'default') return block.content?.text || ''
    return block.content?.[`text_${lang}`] || ''
  }

  return (
    <div className="space-y-4">
      <Label>Quote Text</Label>

      <Tabs defaultValue="default" className="w-full">
        <TabsList>
          <TabsTrigger value="default">Default</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="ar">Arabic</TabsTrigger>
          <TabsTrigger value="fr">French</TabsTrigger>
        </TabsList>

        <TabsContent value="default" className="mt-4">
          <textarea
            value={getCurrentText('default')}
            onChange={(e) => handleContentChange('default', e.target.value)}
            placeholder="Enter quote text..."
            className="w-full min-h-[80px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y italic"
          />
        </TabsContent>

        <TabsContent value="en" className="mt-4">
          <textarea
            value={getCurrentText('en')}
            onChange={(e) => handleContentChange('en', e.target.value)}
            placeholder="English quote..."
            className="w-full min-h-[80px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y italic"
          />
        </TabsContent>

        <TabsContent value="ar" className="mt-4">
          <textarea
            value={getCurrentText('ar')}
            onChange={(e) => handleContentChange('ar', e.target.value)}
            placeholder="اقتباس عربي..."
            className="w-full min-h-[80px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y italic"
            dir="rtl"
          />
        </TabsContent>

        <TabsContent value="fr" className="mt-4">
          <textarea
            value={getCurrentText('fr')}
            onChange={(e) => handleContentChange('fr', e.target.value)}
            placeholder="Citation française..."
            className="w-full min-h-[80px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y italic"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
