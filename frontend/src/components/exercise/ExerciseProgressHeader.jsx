import React from 'react'
import { ArrowRight, Clock, Save } from 'lucide-react'
import { Progress } from '../ui/progress'
import { Button } from '../ui/button'
import { useLanguage } from '../../hooks/useLanguage'

export function ExerciseProgressHeader({
  exerciseTitle,
  currentQuestion,
  totalQuestions,
  timeRemaining, // in seconds, null if not timed
  onBack,
  onSaveDraft
}) {
  const { t } = useLanguage()
  const progressPercentage = (currentQuestion / totalQuestions) * 100

  const formatTime = (seconds) => {
    if (!seconds) return null
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-700 hover:text-primary-600 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="font-medium">{t('common.back', 'رجوع')}</span>
          </button>

          <h1 className="text-lg font-bold text-center flex-1 mx-4">
            {exerciseTitle}
          </h1>

          <div className="flex items-center gap-2">
            {timeRemaining && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-warning-600" />
                <span className="font-mono font-bold text-warning-600">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}

            <Button variant="ghost" size="sm" onClick={onSaveDraft} className="gap-2">
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">{t('common.save', 'حفظ')}</span>
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm text-neutral-600">
            <span>{t('exercises.progress', 'التقدم')}</span>
            <span className="font-medium">
              {t('exercises.questionOf', 'سؤال')} {currentQuestion} {t('exercises.of', 'من')} {totalQuestions} ({Math.round(progressPercentage)}%)
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>
    </header>
  )
}
