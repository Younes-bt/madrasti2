import React from 'react'
import { useEditor } from './EditorContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Type,
  Heading,
  Code,
  Sigma,
  Image,
  Video,
  Music,
  List,
  Quote,
  AlertCircle,
  Table,
  ChevronDown,
  Minus,
  Plus
} from 'lucide-react'

const BLOCK_TYPES = [
  {
    group: 'Text',
    items: [
      { type: 'paragraph', label: 'Paragraph', icon: Type, description: 'Basic text block' },
      { type: 'heading', label: 'Heading', icon: Heading, description: 'Section heading (H1-H6)' }
    ]
  },
  {
    group: 'Lists',
    items: [
      { type: 'list', label: 'List', icon: List, description: 'Bulleted, numbered, or todo list' }
    ]
  },
  {
    group: 'Media',
    items: [
      { type: 'image', label: 'Image', icon: Image, description: 'Upload or embed image' },
      { type: 'video', label: 'Video', icon: Video, description: 'YouTube, Vimeo, or file' },
      { type: 'audio', label: 'Audio', icon: Music, description: 'Audio file' }
    ]
  },
  {
    group: 'Advanced',
    items: [
      { type: 'code', label: 'Code', icon: Code, description: 'Code block with syntax highlighting' },
      { type: 'math', label: 'Math', icon: Sigma, description: 'LaTeX math formula' },
      { type: 'table', label: 'Table', icon: Table, description: 'Simple table' }
    ]
  },
  {
    group: 'Formatting',
    items: [
      { type: 'quote', label: 'Quote', icon: Quote, description: 'Blockquote' },
      { type: 'callout', label: 'Callout', icon: AlertCircle, description: 'Info, warning, tip box' },
      { type: 'toggle', label: 'Toggle', icon: ChevronDown, description: 'Collapsible section' },
      { type: 'divider', label: 'Divider', icon: Minus, description: 'Horizontal line' }
    ]
  }
]

export const BlockTypeSelector = ({ position = null, children }) => {
  const { addBlock } = useEditor()

  const handleSelectType = (type) => {
    addBlock(type, position)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Block
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 max-h-[400px] overflow-y-auto">
        {BLOCK_TYPES.map((group, groupIndex) => (
          <React.Fragment key={group.group}>
            {groupIndex > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="text-xs text-gray-500">
              {group.group}
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <DropdownMenuItem
                    key={item.type}
                    onClick={() => handleSelectType(item.type)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-start gap-3 py-1">
                      <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuGroup>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
