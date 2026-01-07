import React from 'react'
import { useEditor } from '../EditorContext'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const ListBlockEditor = ({ block }) => {
  const { updateBlock } = useEditor()

  const items = block.content?.items || []
  const listType = block.listType || 'bulleted'

  const handleListTypeChange = (value) => {
    updateBlock(block.id, {
      listType: value
    })
  }

  const handleItemChange = (index, lang, value) => {
    const newItems = [...items]
    const langKey = lang === 'default' ? 'text' : `text_${lang}`
    newItems[index] = {
      ...newItems[index],
      [langKey]: value
    }

    updateBlock(block.id, {
      content: {
        ...block.content,
        items: newItems
      }
    })
  }

  const handleCheckedChange = (index, checked) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      checked
    }

    updateBlock(block.id, {
      content: {
        ...block.content,
        items: newItems
      }
    })
  }

  const addItem = () => {
    const newItems = [
      ...items,
      { text: '', text_ar: '', text_en: '', text_fr: '', checked: false }
    ]

    updateBlock(block.id, {
      content: {
        ...block.content,
        items: newItems
      }
    })
  }

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index)

    updateBlock(block.id, {
      content: {
        ...block.content,
        items: newItems.length > 0 ? newItems : [{ text: '', text_ar: '', text_en: '', text_fr: '', checked: false }]
      }
    })
  }

  const getCurrentText = (item, lang) => {
    if (lang === 'default') return item?.text || ''
    return item?.[`text_${lang}`] || ''
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label>List Type:</Label>
        <Select value={listType} onValueChange={handleListTypeChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bulleted">Bulleted</SelectItem>
            <SelectItem value="numbered">Numbered</SelectItem>
            <SelectItem value="todo">Todo (Checkboxes)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>List Items</Label>

        {items.map((item, index) => (
          <div key={index} className="border rounded-lg p-3 space-y-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Item {index + 1}
              </span>
              <div className="flex items-center gap-2">
                {listType === 'todo' && (
                  <input
                    type="checkbox"
                    checked={item.checked || false}
                    onChange={(e) => handleCheckedChange(index, e.target.checked)}
                    className="w-4 h-4"
                  />
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeItem(index)}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="default" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="default">Default</TabsTrigger>
                <TabsTrigger value="en">EN</TabsTrigger>
                <TabsTrigger value="ar">AR</TabsTrigger>
                <TabsTrigger value="fr">FR</TabsTrigger>
              </TabsList>

              <TabsContent value="default" className="mt-2">
                <input
                  type="text"
                  value={getCurrentText(item, 'default')}
                  onChange={(e) => handleItemChange(index, 'default', e.target.value)}
                  placeholder="Item text..."
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </TabsContent>

              <TabsContent value="en" className="mt-2">
                <input
                  type="text"
                  value={getCurrentText(item, 'en')}
                  onChange={(e) => handleItemChange(index, 'en', e.target.value)}
                  placeholder="English..."
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </TabsContent>

              <TabsContent value="ar" className="mt-2">
                <input
                  type="text"
                  value={getCurrentText(item, 'ar')}
                  onChange={(e) => handleItemChange(index, 'ar', e.target.value)}
                  placeholder="عربي..."
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  dir="rtl"
                />
              </TabsContent>

              <TabsContent value="fr" className="mt-2">
                <input
                  type="text"
                  value={getCurrentText(item, 'fr')}
                  onChange={(e) => handleItemChange(index, 'fr', e.target.value)}
                  placeholder="Français..."
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </TabsContent>
            </Tabs>
          </div>
        ))}

        <Button onClick={addItem} variant="outline" size="sm" className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>
    </div>
  )
}
