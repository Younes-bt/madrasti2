import React from 'react'
import { useEditor } from '../EditorContext'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Info, AlertTriangle, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react'

const CALLOUT_TYPES = [
  { value: 'info', label: 'Info', icon: Info, color: 'bg-blue-50 border-blue-200 text-blue-900' },
  { value: 'warning', label: 'Warning', icon: AlertTriangle, color: 'bg-yellow-50 border-yellow-200 text-yellow-900' },
  { value: 'error', label: 'Error', icon: AlertCircle, color: 'bg-red-50 border-red-200 text-red-900' },
  { value: 'success', label: 'Success', icon: CheckCircle, color: 'bg-green-50 border-green-200 text-green-900' },
  { value: 'tip', label: 'Tip', icon: Lightbulb, color: 'bg-purple-50 border-purple-200 text-purple-900' }
]

export const CalloutBlockEditor = ({ block }) => {
  const { updateBlock } = useEditor()

  const calloutType = block.content?.type || 'info'

  const handleTypeChange = (value) => {
    updateBlock(block.id, {
      content: {
        ...block.content,
        type: value
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

  const getCurrentText = (lang) => {
    if (lang === 'default') return block.content?.text || ''
    return block.content?.[`text_${lang}`] || ''
  }

  const currentType = CALLOUT_TYPES.find(t => t.value === calloutType) || CALLOUT_TYPES[0]
  const IconComponent = currentType.icon

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label>Callout Type:</Label>
        <Select value={calloutType} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CALLOUT_TYPES.map((type) => {
              const Icon = type.icon
              return (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {type.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Preview */}
      <div className={`border-l-4 rounded-lg p-4 ${currentType.color}`}>
        <div className="flex items-start gap-3">
          <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">{currentType.label}</p>
            <p className="text-sm mt-1">
              {getCurrentText('default') || 'Callout content will appear here...'}
            </p>
          </div>
        </div>
      </div>

      <div>
        <Label>Callout Content</Label>

        <Tabs defaultValue="default" className="w-full mt-2">
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
              placeholder="Enter callout content..."
              className="w-full min-h-[80px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          </TabsContent>

          <TabsContent value="en" className="mt-4">
            <textarea
              value={getCurrentText('en')}
              onChange={(e) => handleContentChange('en', e.target.value)}
              placeholder="English content..."
              className="w-full min-h-[80px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          </TabsContent>

          <TabsContent value="ar" className="mt-4">
            <textarea
              value={getCurrentText('ar')}
              onChange={(e) => handleContentChange('ar', e.target.value)}
              placeholder="محتوى عربي..."
              className="w-full min-h-[80px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
              dir="rtl"
            />
          </TabsContent>

          <TabsContent value="fr" className="mt-4">
            <textarea
              value={getCurrentText('fr')}
              onChange={(e) => handleContentChange('fr', e.target.value)}
              placeholder="Contenu français..."
              className="w-full min-h-[80px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
