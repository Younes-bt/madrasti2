import React, { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

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
 * FillBlankQuestion Component
 *
 * Displays a sentence with inline dropdowns for fill-in-the-blank questions.
 * Options for each blank are shuffled on initial load.
 * Supports placeholders like {1}, {2}, ____, or blank positions.
 *
 * @param {Object} question - Question object with blanks array
 * @param {Array} blankAnswers - Current blank answers [{blank: 801, selected_option: 901}]
 * @param {Function} onChange - Callback when answers change
 * @param {string} currentLanguage - Current language (ar, en, fr)
 * @param {boolean} disabled - Whether the question is disabled (after submission)
 */
const FillBlankQuestion = ({
  question,
  blankAnswers = [],
  onChange,
  currentLanguage = 'en',
  disabled = false
}) => {
  const [shuffledOptions, setShuffledOptions] = useState({})
  const [selections, setSelections] = useState({})

  // Initialize shuffled options and selections
  useEffect(() => {
    if (!question?.blanks?.length) return

    // Shuffle options for each blank
    const newShuffledOptions = {}
    question.blanks.forEach(blank => {
      if (blank.options && blank.options.length > 0) {
        newShuffledOptions[blank.id] = shuffleArray(blank.options)
      }
    })
    setShuffledOptions(newShuffledOptions)

    // Initialize selections from blankAnswers
    if (blankAnswers && blankAnswers.length > 0) {
      const newSelections = {}
      blankAnswers.forEach(answer => {
        newSelections[answer.blank] = answer.selected_option
      })
      setSelections(newSelections)
    }
  }, [question?.id])

  const handleSelectionChange = (blankId, optionId) => {
    if (disabled) return

    const newSelections = {
      ...selections,
      [blankId]: optionId
    }
    setSelections(newSelections)

    // Convert to array format for parent
    const answersArray = Object.entries(newSelections).map(([blankId, optionId]) => ({
      blank: parseInt(blankId),
      selected_option: parseInt(optionId)
    }))

    onChange(answersArray)
  }

  /**
   * Parse question text and render with inline dropdowns
   * Supports placeholders: {1}, {2}, ____, [1], [2]
   */
  const renderQuestionWithBlanks = () => {
    if (!question?.blanks?.length) {
      return <p className="text-sm">{question?.question_text || ''}</p>
    }

    const sortedBlanks = [...question.blanks].sort((a, b) => a.order - b.order)
    let questionText = question.question_text || ''

    // Try to detect and replace placeholders
    const placeholderPatterns = [
      /\{(\d+)\}/g,     // {1}, {2}
      /\[(\d+)\]/g,     // [1], [2]
      /____+/g,         // Multiple underscores
      /_+/g,            // Single underscore
    ]

    let hasPlaceholders = false
    for (const pattern of placeholderPatterns) {
      if (pattern.test(questionText)) {
        hasPlaceholders = true
        break
      }
    }

    // If we have clear placeholders, replace them
    if (hasPlaceholders) {
      const parts = []
      let lastIndex = 0
      let blankIndex = 0

      // Try {n} pattern first
      const regex = /(\{(\d+)\}|\[(\d+)\]|____+|_+)/g
      let match

      while ((match = regex.exec(questionText)) !== null) {
        // Add text before the placeholder
        if (match.index > lastIndex) {
          parts.push(
            <span key={`text-${lastIndex}`}>
              {questionText.substring(lastIndex, match.index)}
            </span>
          )
        }

        // Get the corresponding blank
        const blank = sortedBlanks[blankIndex]
        if (blank) {
          parts.push(renderDropdown(blank, blankIndex))
          blankIndex++
        }

        lastIndex = match.index + match[0].length
      }

      // Add remaining text
      if (lastIndex < questionText.length) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {questionText.substring(lastIndex)}
          </span>
        )
      }

      return <div className="flex flex-wrap items-center gap-1">{parts}</div>
    }

    // Fallback: No clear placeholders, show text with dropdowns below
    return (
      <div className="space-y-3">
        <p className="text-sm" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
          {questionText}
        </p>
        <div className="space-y-2">
          {sortedBlanks.map((blank, index) => (
            <div key={blank.id} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground min-w-[60px]">
                {blank.label || `Blank ${index + 1}`}:
              </span>
              {renderDropdown(blank, index)}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderDropdown = (blank, index) => {
    const options = shuffledOptions[blank.id] || blank.options || []
    const selectedValue = selections[blank.id]

    return (
      <Select
        key={blank.id}
        value={selectedValue ? String(selectedValue) : undefined}
        onValueChange={(value) => handleSelectionChange(blank.id, parseInt(value))}
        disabled={disabled}
      >
        <SelectTrigger className="w-[200px] inline-flex">
          <SelectValue placeholder={
            currentLanguage === 'ar' ? 'اختر...' :
            currentLanguage === 'fr' ? 'Choisir...' :
            'Select...'
          } />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={String(option.id)}>
              {option.option_text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  if (!question?.blanks?.length) {
    return (
      <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
        No blanks configured for this question.
      </div>
    )
  }

  const totalBlanks = question.blanks.length
  const answeredBlanks = Object.keys(selections).length

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {currentLanguage === 'ar'
          ? 'اختر الإجابة الصحيحة لكل فراغ من القوائم المنسدلة'
          : currentLanguage === 'fr'
          ? 'Sélectionnez la bonne réponse pour chaque espace dans les listes déroulantes'
          : 'Select the correct answer for each blank from the dropdowns'}
      </p>

      {renderQuestionWithBlanks()}

      {/* Progress indicator */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {currentLanguage === 'ar'
            ? `تم الملء: ${answeredBlanks} / ${totalBlanks}`
            : currentLanguage === 'fr'
            ? `Remplis : ${answeredBlanks} / ${totalBlanks}`
            : `Filled: ${answeredBlanks} / ${totalBlanks}`}
        </span>
      </div>

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

export default FillBlankQuestion
