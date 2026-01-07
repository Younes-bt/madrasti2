import React, { useState } from 'react'
import { useEditor } from './EditorContext'
import { TextBlockEditor } from './block-editors/TextBlockEditor'
import { CodeBlockEditor } from './block-editors/CodeBlockEditor'
import { MathBlockEditor } from './block-editors/MathBlockEditor'
import { ImageBlockEditor } from './block-editors/ImageBlockEditor'
import { VideoBlockEditor } from './block-editors/VideoBlockEditor'
import { AudioBlockEditor } from './block-editors/AudioBlockEditor'
import { ListBlockEditor } from './block-editors/ListBlockEditor'
import { QuoteBlockEditor } from './block-editors/QuoteBlockEditor'
import { CalloutBlockEditor } from './block-editors/CalloutBlockEditor'
import { TableBlockEditor } from './block-editors/TableBlockEditor'
import { ToggleBlockEditor } from './block-editors/ToggleBlockEditor'
import { DividerBlockEditor } from './block-editors/DividerBlockEditor'
import { Trash2, MoreVertical, Copy, GripVertical, MoveUp, MoveDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export const BlockItem = ({ block, index }) => {
  const { deleteBlock, duplicateBlock, reorderBlocks, blocks, selectedBlockId, setSelectedBlockId } = useEditor()
  const [isHovered, setIsHovered] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isSelected = selectedBlockId === block.id

  const handleDelete = () => {
    if (confirm('Delete this block?')) {
      deleteBlock(block.id)
    }
  }

  const handleDuplicate = () => {
    duplicateBlock(block.id)
  }

  const handleMoveUp = () => {
    if (index > 0) {
      reorderBlocks(index, index - 1)
    }
  }

  const handleMoveDown = () => {
    if (index < blocks.length - 1) {
      reorderBlocks(index, index + 1)
    }
  }

  const renderBlockEditor = () => {
    switch (block.type) {
      case 'heading':
      case 'paragraph':
        return <TextBlockEditor block={block} />

      case 'code':
        return <CodeBlockEditor block={block} />

      case 'math':
        return <MathBlockEditor block={block} />

      case 'image':
        return <ImageBlockEditor block={block} />

      case 'video':
      case 'embed':
        return <VideoBlockEditor block={block} />

      case 'audio':
        return <AudioBlockEditor block={block} />

      case 'list':
        return <ListBlockEditor block={block} />

      case 'quote':
        return <QuoteBlockEditor block={block} />

      case 'callout':
        return <CalloutBlockEditor block={block} />

      case 'table':
        return <TableBlockEditor block={block} />

      case 'toggle':
        return <ToggleBlockEditor block={block} />

      case 'divider':
      case 'spacer':
        return <DividerBlockEditor block={block} />

      default:
        return (
          <div className="p-4 bg-gray-100 rounded text-gray-600">
            {block.type} block (unsupported type)
          </div>
        )
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-lg transition-all ${
        isSelected ? 'ring-2 ring-indigo-500' : ''
      } ${isHovered ? 'bg-gray-50' : ''} ${isDragging ? 'z-50' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setSelectedBlockId(block.id)}
    >
      {/* Drag handle and block actions */}
      {isHovered && (
        <div className="absolute left-0 top-2 flex items-center gap-1 z-20">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded transition-colors"
            title="Drag to reorder"
          >
            <GripVertical className="h-5 w-5 text-gray-400" />
          </button>

          {/* Actions menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={handleMoveUp} disabled={index === 0}>
                <MoveUp className="h-4 w-4 mr-2" />
                Move Up
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleMoveDown} disabled={index === blocks.length - 1}>
                <MoveDown className="h-4 w-4 mr-2" />
                Move Down
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Block editor */}
      <div className="p-4 pl-12">
        {renderBlockEditor()}
      </div>
    </div>
  )
}
