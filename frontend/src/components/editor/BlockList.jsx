import React, { useState } from 'react'
import { useEditor } from './EditorContext'
import { BlockItem } from './BlockItem'
import { BlockTypeSelector } from './BlockTypeSelector'
import { Plus } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

export const BlockList = () => {
  const { blocks, reorderBlocks } = useEditor()
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderBlocks(oldIndex, newIndex)
      }
    }
  }

  return (
    <div className="space-y-2 bg-white rounded-lg shadow-sm p-8">
      {/* Add block button at the top */}
      {blocks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Start by adding your first block</p>
          <BlockTypeSelector position={null} />
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block, index) => (
            <div
              key={block.id}
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Block item */}
              <BlockItem block={block} index={index} />

              {/* Add block button between blocks */}
              {hoveredIndex === index && (
                <div className="absolute -bottom-2 left-0 right-0 flex justify-center z-10">
                  <BlockTypeSelector position={index}>
                    <button
                      className="bg-white border rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors"
                      title="Add block below"
                    >
                      <Plus className="h-4 w-4 text-gray-600" />
                    </button>
                  </BlockTypeSelector>
                </div>
              )}
            </div>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}
