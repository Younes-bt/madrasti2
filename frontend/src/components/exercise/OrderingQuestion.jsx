import React, { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Individual sortable item component
 */
const SortableItem = ({ id, text, index, currentLanguage }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-md border bg-background p-3 transition-all ${
        isDragging ? 'border-primary shadow-lg z-50' : 'border-muted'
      }`}
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex items-center gap-2 flex-1">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
          {index + 1}
        </span>
        <span className="flex-1 text-sm">{text}</span>
      </div>
    </div>
  )
}

/**
 * OrderingQuestion Component
 *
 * Displays a drag-and-drop sortable list for ordering questions.
 * Items are shuffled on initial load.
 *
 * @param {Object} question - Question object with ordering_items array
 * @param {Array} currentOrder - Current order of item IDs [702, 701, 703]
 * @param {Function} onChange - Callback when order changes: (newOrderArray) => void
 * @param {string} currentLanguage - Current language (ar, en, fr)
 * @param {boolean} disabled - Whether the question is disabled (after submission)
 */
const OrderingQuestion = ({
  question,
  currentOrder,
  onChange,
  currentLanguage = 'en',
  disabled = false
}) => {
  const [items, setItems] = useState([])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevents accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Initialize and shuffle items on mount or when question changes
  useEffect(() => {
    if (!question?.ordering_items?.length) return

    // If currentOrder exists (resuming), use it
    if (currentOrder && currentOrder.length > 0) {
      const orderedItems = currentOrder
        .map(itemId => question.ordering_items.find(item => item.id === itemId))
        .filter(Boolean)

      setItems(orderedItems)
    } else {
      // Shuffle items on first load
      const shuffled = shuffleArray(question.ordering_items)
      setItems(shuffled)

      // Notify parent of initial shuffled order
      onChange(shuffled.map(item => item.id))
    }
  }, [question?.id])

  const handleDragEnd = (event) => {
    if (disabled) return

    const { active, over } = event

    if (active.id !== over.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.id === active.id)
        const newIndex = prevItems.findIndex((item) => item.id === over.id)

        const newItems = arrayMove(prevItems, oldIndex, newIndex)

        // Notify parent of new order
        onChange(newItems.map(item => item.id))

        return newItems
      })
    }
  }

  if (!question?.ordering_items?.length) {
    return (
      <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
        No ordering items configured for this question.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {currentLanguage === 'ar'
          ? 'اسحب وأفلت العناصر لترتيبها بالترتيب الصحيح'
          : currentLanguage === 'fr'
          ? 'Glissez-déposez les éléments pour les placer dans le bon ordre'
          : 'Drag and drop the items to put them in the correct order'}
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map(item => item.id)}
          strategy={verticalListSortingStrategy}
          disabled={disabled}
        >
          <div className="space-y-2">
            {items.map((item, index) => (
              <SortableItem
                key={item.id}
                id={item.id}
                text={item.text}
                index={index}
                currentLanguage={currentLanguage}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {disabled && (
        <div className="mt-3 rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
          {currentLanguage === 'ar'
            ? 'تم تقديم إجابتك. لا يمكن إجراء المزيد من التغييرات.'
            : currentLanguage === 'fr'
            ? 'Votre réponse a été soumise. Aucune modification supplémentaire ne peut être effectuée.'
            : 'Your answer has been submitted. No further changes can be made.'}
        </div>
      )}
    </div>
  )
}

export default OrderingQuestion
