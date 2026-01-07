import React from 'react'
import { useEditor } from '../EditorContext'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const ToggleBlockEditor = ({ block }) => {
  const { updateBlock } = useEditor()

  const handleTitleChange = (lang, value) => {
    const langKey = lang === 'default' ? 'title' : `title_${lang}`
    updateBlock(block.id, {
      content: {
        ...block.content,
        [langKey]: value
      }
    })
  }

  const handleContentChange = (lang, value) => {
    const langKey = lang === 'default' ? 'text' : `text_${lang}`
    updateBlock(block.id, {
      content: {
        ...block.content,
        [langKey]: value
      }
    })
  }

  const getCurrentTitle = (lang) => {
    if (lang === 'default') return block.content?.title || ''
    return block.content?.[`title_${lang}`] || ''
  }

  const getCurrentText = (lang) => {
    if (lang === 'default') return block.content?.text || ''
    return block.content?.[`text_${lang}`] || ''
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Toggle Title (clickable header)</Label>
        <Tabs defaultValue="default" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="default">Default</TabsTrigger>
            <TabsTrigger value="en">EN</TabsTrigger>
            <TabsTrigger value="ar">AR</TabsTrigger>
            <TabsTrigger value="fr">FR</TabsTrigger>
          </TabsList>

          <TabsContent value="default" className="mt-2">
            <Input
              value={getCurrentTitle('default')}
              onChange={(e) => handleTitleChange('default', e.target.value)}
              placeholder="Toggle title..."
            />
          </TabsContent>

          <TabsContent value="en" className="mt-2">
            <Input
              value={getCurrentTitle('en')}
              onChange={(e) => handleTitleChange('en', e.target.value)}
              placeholder="English title..."
            />
          </TabsContent>

          <TabsContent value="ar" className="mt-2">
            <Input
              value={getCurrentTitle('ar')}
              onChange={(e) => handleTitleChange('ar', e.target.value)}
              placeholder="عنوان عربي..."
              dir="rtl"
            />
          </TabsContent>

          <TabsContent value="fr" className="mt-2">
            <Input
              value={getCurrentTitle('fr')}
              onChange={(e) => handleTitleChange('fr', e.target.value)}
              placeholder="Titre français..."
            />
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <Label>Hidden Content (revealed when clicked)</Label>
        <Tabs defaultValue="default" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="default">Default</TabsTrigger>
            <TabsTrigger value="en">EN</TabsTrigger>
            <TabsTrigger value="ar">AR</TabsTrigger>
            <TabsTrigger value="fr">FR</TabsTrigger>
          </TabsList>

          <TabsContent value="default" className="mt-2">
            <textarea
              value={getCurrentText('default')}
              onChange={(e) => handleContentChange('default', e.target.value)}
              placeholder="Content that will be hidden/revealed..."
              className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          </TabsContent>

          <TabsContent value="en" className="mt-2">
            <textarea
              value={getCurrentText('en')}
              onChange={(e) => handleContentChange('en', e.target.value)}
              placeholder="English content..."
              className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          </TabsContent>

          <TabsContent value="ar" className="mt-2">
            <textarea
              value={getCurrentText('ar')}
              onChange={(e) => handleContentChange('ar', e.target.value)}
              placeholder="محتوى عربي..."
              className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
              dir="rtl"
            />
          </TabsContent>

          <TabsContent value="fr" className="mt-2">
            <textarea
              value={getCurrentText('fr')}
              onChange={(e) => handleContentChange('fr', e.target.value)}
              placeholder="Contenu français..."
              className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
