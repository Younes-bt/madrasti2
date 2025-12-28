import React from 'react'
import { Button } from '../ui/button'
import { ArrowRight, ArrowLeft, Save } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'

export function QuestionNavigation({
  currentQuestion,
  totalQuestions,
  answeredQuestions, // Set of question numbers that have answers
  onPrevious,
  onNext,
  onJumpTo,
  onSaveDraft,
  onReview
}) {
  const { t } = useLanguage()
  const isFirst = currentQuestion === 1
  const isLast = currentQuestion === totalQuestions

  return (
    <div className="sticky bottom-0 bg-white border-t shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Previous Button */}
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isFirst}
            className="gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            {t('exercises.previous', 'السابق')}
          </Button>

          {/* Question Dots */}
          <div className="flex items-center gap-2 flex-1 justify-center overflow-x-auto">
            {Array.from({ length: totalQuestions }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => onJumpTo(num)}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all
                  ${num === currentQuestion
                    ? 'bg-primary-600 text-white ring-2 ring-primary-300'
                    : answeredQuestions.has(num)
                    ? 'bg-success-100 text-success-700 hover:bg-success-200'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }
                `}
                aria-label={`${t('exercises.goToQuestion', 'الانتقال للسؤال')} ${num}`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Save Draft Button (hidden on mobile) */}
          <Button
            variant="ghost"
            onClick={onSaveDraft}
            className="gap-2 hidden md:flex"
          >
            <Save className="w-4 h-4" />
            {t('exercises.saveDraft', 'حفظ مسودة')}
          </Button>

          {/* Next/Review Button */}
          {isLast ? (
            <Button onClick={onReview} className="gap-2">
              {t('exercises.reviewAndSubmit', 'مراجعة وإرسال')}
              <ArrowLeft className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={onNext} className="gap-2">
              {t('exercises.next', 'التالي')}
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
