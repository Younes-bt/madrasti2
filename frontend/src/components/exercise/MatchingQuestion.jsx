import React, { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Button } from '../ui/button'

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
 * MatchingQuestion Component
 *
 * Displays two columns (left and right) with items to match.
 * Students click on left item, then right item to draw a connection.
 * Right column is shuffled on initial load.
 *
 * @param {Object} question - Question object with matching_pairs array
 * @param {Array} matches - Current matches [{left_pair: 801, selected_right_pair: 805}]
 * @param {Function} onChange - Callback when matches change
 * @param {string} currentLanguage - Current language (ar, en, fr)
 * @param {boolean} disabled - Whether the question is disabled (after submission)
 */
const MatchingQuestion = ({
  question,
  matches = [],
  onChange,
  currentLanguage = 'en',
  disabled = false
}) => {
  const [leftItems, setLeftItems] = useState([])
  const [rightItems, setRightItems] = useState([])
  const [currentMatches, setCurrentMatches] = useState([])
  const [selectedLeft, setSelectedLeft] = useState(null)
  const containerRef = useRef(null)

  // Initialize items and shuffle right column
  useEffect(() => {
    if (!question?.matching_pairs?.length) return

    const pairs = question.matching_pairs

    // Left items stay in original order
    setLeftItems(pairs)

    // Right items are shuffled
    if (rightItems.length === 0) {
      const shuffledRight = shuffleArray(pairs)
      setRightItems(shuffledRight)
    }

    // Initialize matches if provided
    if (matches && matches.length > 0) {
      setCurrentMatches(matches)
    }
  }, [question?.id])

  // Handle match creation/update
  const handleLeftClick = (leftPair) => {
    if (disabled) return

    // If clicking same left item, deselect
    if (selectedLeft?.id === leftPair.id) {
      setSelectedLeft(null)
      return
    }

    setSelectedLeft(leftPair)
  }

  const handleRightClick = (rightPair) => {
    if (disabled || !selectedLeft) return

    // Create or update match
    const newMatches = currentMatches.filter(m => m.left_pair !== selectedLeft.id)
    newMatches.push({
      left_pair: selectedLeft.id,
      selected_right_pair: rightPair.id
    })

    setCurrentMatches(newMatches)
    onChange(newMatches)
    setSelectedLeft(null)
  }

  // Remove a specific match
  const handleRemoveMatch = (leftPairId) => {
    if (disabled) return

    const newMatches = currentMatches.filter(m => m.left_pair !== leftPairId)
    setCurrentMatches(newMatches)
    onChange(newMatches)
  }

  // Get the right pair that is matched to a left pair
  const getMatchedRightPair = (leftPairId) => {
    const match = currentMatches.find(m => m.left_pair === leftPairId)
    if (!match) return null
    return rightItems.find(item => item.id === match.selected_right_pair)
  }

  // Check if a right pair is already matched
  const isRightPairMatched = (rightPairId) => {
    return currentMatches.some(m => m.selected_right_pair === rightPairId)
  }

  // Draw SVG lines between matched pairs
  const renderLines = () => {
    if (!containerRef.current) return null

    const lines = []
    currentMatches.forEach((match, index) => {
      const leftElement = containerRef.current.querySelector(`[data-left-id="${match.left_pair}"]`)
      const rightElement = containerRef.current.querySelector(`[data-right-id="${match.selected_right_pair}"]`)

      if (leftElement && rightElement) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const leftRect = leftElement.getBoundingClientRect()
        const rightRect = rightElement.getBoundingClientRect()

        const x1 = leftRect.right - containerRect.left
        const y1 = leftRect.top + leftRect.height / 2 - containerRect.top
        const x2 = rightRect.left - containerRect.left
        const y2 = rightRect.top + rightRect.height / 2 - containerRect.top

        lines.push(
          <line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )
      }
    })

    return (
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      >
        {lines}
      </svg>
    )
  }

  if (!question?.matching_pairs?.length) {
    return (
      <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
        No matching pairs configured for this question.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {currentLanguage === 'ar'
          ? 'انقر على عنصر من العمود الأيسر، ثم انقر على التطابق الصحيح من العمود الأيمن'
          : currentLanguage === 'fr'
          ? 'Cliquez sur un élément de la colonne de gauche, puis sur la correspondance correcte dans la colonne de droite'
          : 'Click on an item from the left column, then click on the correct match from the right column'}
      </p>

      <div ref={containerRef} className="relative grid grid-cols-2 gap-4 min-h-[300px]">
        {/* SVG Lines Layer */}
        {renderLines()}

        {/* Left Column */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            {currentLanguage === 'ar' ? 'العمود أ' : currentLanguage === 'fr' ? 'Colonne A' : 'Column A'}
          </p>
          {leftItems.map((pair) => {
            const matchedRight = getMatchedRightPair(pair.id)
            const isSelected = selectedLeft?.id === pair.id

            return (
              <div
                key={pair.id}
                data-left-id={pair.id}
                onClick={() => handleLeftClick(pair)}
                className={`relative rounded-md border p-3 text-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/10 ring-2 ring-primary'
                    : matchedRight
                    ? 'border-green-500 bg-green-50'
                    : 'border-muted hover:border-primary/50 hover:bg-muted/40'
                } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
                dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="flex-1">{pair.left_text}</span>
                  {matchedRight && !disabled && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveMatch(pair.id)
                      }}
                      className="h-5 w-5 p-0 hover:bg-destructive/10"
                    >
                      <X className="h-3 w-3 text-destructive" />
                    </Button>
                  )}
                </div>
                {matchedRight && (
                  <div className="mt-2 pt-2 border-t text-xs text-green-700">
                    {currentLanguage === 'ar' ? 'متطابق مع: ' : currentLanguage === 'fr' ? 'Correspond à : ' : 'Matched with: '}
                    <span className="font-medium">{matchedRight.right_text}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Right Column (Shuffled) */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            {currentLanguage === 'ar' ? 'العمود ب' : currentLanguage === 'fr' ? 'Colonne B' : 'Column B'}
          </p>
          {rightItems.map((pair) => {
            const isMatched = isRightPairMatched(pair.id)
            const canSelect = selectedLeft !== null

            return (
              <div
                key={pair.id}
                data-right-id={pair.id}
                onClick={() => handleRightClick(pair)}
                className={`rounded-md border p-3 text-sm transition-all ${
                  canSelect && !isMatched
                    ? 'cursor-pointer border-muted hover:border-primary/50 hover:bg-primary/5'
                    : isMatched
                    ? 'border-green-500 bg-green-50 cursor-default'
                    : 'border-muted/40 cursor-default opacity-60'
                } ${disabled ? 'cursor-not-allowed' : ''}`}
                dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
              >
                {pair.right_text}
              </div>
            )
          })}
        </div>
      </div>

      {/* Status Message */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {currentLanguage === 'ar'
            ? `تم المطابقة: ${currentMatches.length} / ${leftItems.length}`
            : currentLanguage === 'fr'
            ? `Correspondances : ${currentMatches.length} / ${leftItems.length}`
            : `Matched: ${currentMatches.length} / ${leftItems.length}`}
        </span>
        {selectedLeft && !disabled && (
          <span className="text-primary font-medium">
            {currentLanguage === 'ar'
              ? 'انقر على العنصر المطابق من العمود الأيمن'
              : currentLanguage === 'fr'
              ? 'Cliquez sur l\'élément correspondant dans la colonne de droite'
              : 'Click on the matching item from the right column'}
          </span>
        )}
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

export default MatchingQuestion
