import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../ui/button'
import { useLabContext } from '../../../contexts/LabContext'

const categories = [
  { id: 'all', translationKey: 'lab.categories.all', color: '#64748b' },
  { id: 'math', translationKey: 'lab.categories.math', color: '#3b82f6' },
  { id: 'physics', translationKey: 'lab.categories.physics', color: '#8b5cf6' },
  { id: 'chemistry', translationKey: 'lab.categories.chemistry', color: '#10b981' },
  { id: 'biology', translationKey: 'lab.categories.biology', color: '#059669' }
]

export default function LabCategoryFilter() {
  const { t } = useTranslation()
  const { labState, setCategory } = useLabContext()

  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={labState.selectedCategory === category.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCategory(category.id)}
          style={
            labState.selectedCategory === category.id
              ? { backgroundColor: category.color, borderColor: category.color }
              : {}
          }
        >
          {t(category.translationKey)}
        </Button>
      ))}
    </div>
  )
}
