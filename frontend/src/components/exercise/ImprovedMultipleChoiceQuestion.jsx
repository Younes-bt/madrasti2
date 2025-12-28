import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { useMathText } from './MathRenderer'
import 'katex/dist/katex.min.css'

export function ImprovedMultipleChoiceQuestion({
  choices,
  allowMultiple = false,
  selectedChoices = [],
  onAnswerChange,
  questionId
}) {
  const { t, currentLanguage } = useLanguage()

  if (!choices || choices.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
        {t('exercises.noChoices', 'الخيارات غير متوفرة لهذا السؤال.')}
      </div>
    )
  }

  const handleSelectionChange = (choiceId, checked) => {
    if (allowMultiple) {
      const newSelection = checked
        ? [...selectedChoices, choiceId]
        : selectedChoices.filter(id => id !== choiceId)
      onAnswerChange(newSelection)
    } else {
      onAnswerChange([choiceId])
    }
  }

  return (
    <div className="space-y-3">
      {/* Instruction */}
      <p className="text-sm text-muted-foreground mb-4">
        {allowMultiple
          ? t('exercises.selectAllCorrect', '(اختر جميع الإجابات الصحيحة)')
          : t('exercises.selectOneCorrect', '(اختر إجابة واحدة صحيحة)')
        }
      </p>

      {/* Choices */}
      {choices.map((choice, index) => {
        const choiceId = String(choice.id ?? choice.value ?? `${questionId}-${index}`)
        const isChecked = selectedChoices.includes(choiceId)
        const label = currentLanguage === 'ar' && choice.choice_text_arabic
          ? choice.choice_text_arabic
          : choice.choice_text || choice.label || choice.value

        // Process label to render math formulas
        const processedLabel = useMathText(label)

        return (
          <div
            key={choiceId}
            className={`
              flex items-center space-x-3 space-x-reverse p-4 rounded-lg border-2
              transition-all cursor-pointer
              ${isChecked
                ? 'border-primary-500 bg-primary-50'
                : 'border-neutral-200 hover:border-primary-300 hover:bg-primary-50/50'
              }
            `}
            onClick={() => handleSelectionChange(choiceId, !isChecked)}
          >
            <input
              type={allowMultiple ? 'checkbox' : 'radio'}
              id={`choice-${choiceId}`}
              name={`question-${questionId}`}
              value={choiceId}
              checked={isChecked}
              onChange={(e) => handleSelectionChange(choiceId, e.target.checked)}
              className="h-5 w-5 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
            <label
              htmlFor={`choice-${choiceId}`}
              className="flex-1 cursor-pointer text-base"
              dangerouslySetInnerHTML={{ __html: processedLabel }}
            />
          </div>
        )
      })}
    </div>
  )
}
