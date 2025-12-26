import { useState } from 'react'
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useLesson } from '../../contexts/LessonContext'

export function InteractivePractice({
  type, // 'multiple-choice' | 'fill-blank' | 'true-false'
  question,
  options, // For multiple choice
  correctAnswer,
  hint,
  explanation,
  practiceId,
  currentLanguage,
  onComplete
}) {
  const { dispatch } = useLesson()
  const [userAnswer, setUserAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [startTime] = useState(Date.now())
  const isRTL = currentLanguage === 'ar'

  const checkAnswer = (user, correct, questionType) => {
    if (questionType === 'multiple-choice' || questionType === 'true-false') {
      return user === correct
    }
    if (questionType === 'fill-blank') {
      // Normalize answers (remove spaces, lowercase)
      return user.trim().toLowerCase() === correct.toLowerCase()
    }
    return false
  }

  const handleSubmit = () => {
    const correct = checkAnswer(userAnswer, correctAnswer, type)
    setIsCorrect(correct)
    setSubmitted(true)

    // Report to context for progress tracking
    if (correct && practiceId) {
      dispatch({
        type: 'COMPLETE_PRACTICE',
        payload: { practiceId }
      })
    }

    // Report to parent for additional handling
    onComplete?.({
      correct,
      attempts: 1,
      timeSpent: Date.now() - startTime
    })
  }

  const handleReset = () => {
    setUserAnswer('')
    setSubmitted(false)
    setIsCorrect(null)
    setShowHint(false)
  }

  const getQuestionIcon = () => {
    switch (type) {
      case 'multiple-choice':
        return '❓'
      case 'fill-blank':
        return '✏️'
      case 'true-false':
        return '✓✗'
      default:
        return '✍️'
    }
  }

  const getQuestionTitle = () => {
    if (type === 'multiple-choice') {
      return isRTL ? 'سؤال اختيار' : 'Multiple Choice'
    }
    if (type === 'fill-blank') {
      return isRTL ? 'أكمل الفراغ' : 'Fill in the Blank'
    }
    if (type === 'true-false') {
      return isRTL ? 'صح أم خطأ' : 'True or False'
    }
    return isRTL ? 'تمرين تطبيقي' : 'Practice Exercise'
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{getQuestionIcon()}</span>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            {getQuestionTitle()}
          </h3>
        </div>

        {/* Question */}
        <p className="text-neutral-800 dark:text-neutral-200 text-lg mb-6 leading-relaxed">
          {question}
        </p>

        {/* Answer Input (varies by type) */}
        {!submitted && (
          <div className="mb-4">
            {type === 'multiple-choice' && (
              <RadioGroup value={userAnswer} onValueChange={setUserAnswer}>
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 space-x-reverse mb-3">
                    <RadioGroupItem value={option.value} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="text-neutral-700 dark:text-neutral-300 cursor-pointer flex-1 py-2"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {type === 'fill-blank' && (
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={isRTL ? 'اكتب إجابتك هنا...' : 'Type your answer here...'}
                className="text-lg"
                onKeyPress={(e) => e.key === 'Enter' && userAnswer && handleSubmit()}
              />
            )}

            {type === 'true-false' && (
              <RadioGroup value={userAnswer} onValueChange={setUserAnswer}>
                <div className="flex items-center space-x-2 space-x-reverse mb-3">
                  <RadioGroupItem value="true" id="option-true" />
                  <Label
                    htmlFor="option-true"
                    className="text-neutral-700 dark:text-neutral-300 cursor-pointer flex-1 py-2"
                  >
                    {isRTL ? 'صح' : 'True'}
                  </Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse mb-3">
                  <RadioGroupItem value="false" id="option-false" />
                  <Label
                    htmlFor="option-false"
                    className="text-neutral-700 dark:text-neutral-300 cursor-pointer flex-1 py-2"
                  >
                    {isRTL ? 'خطأ' : 'False'}
                  </Label>
                </div>
              </RadioGroup>
            )}
          </div>
        )}

        {/* Feedback (after submission) */}
        {submitted && (
          <div className={`mb-4 p-4 rounded-lg border-2 ${
            isCorrect
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
              )}

              <div className="flex-1">
                <p className={`font-bold mb-2 ${isCorrect ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}>
                  {isCorrect
                    ? (isRTL ? '✓ إجابة صحيحة! أحسنت!' : '✓ Correct Answer! Well done!')
                    : (isRTL ? '✗ إجابة خاطئة' : '✗ Incorrect Answer')
                  }
                </p>

                {!isCorrect && explanation && (
                  <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-2">
                    {explanation}
                  </p>
                )}

                {!isCorrect && (
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    {isRTL ? 'الإجابة الصحيحة: ' : 'Correct answer: '}
                    <strong>{correctAnswer}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hint (optional) */}
        {hint && !submitted && (
          <div className="mb-4">
            {!showHint ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHint(true)}
                className="gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                {isRTL ? 'أحتاج إلى تلميح' : 'I need a hint'}
              </Button>
            ) : (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                <p className="text-sm text-yellow-900 dark:text-yellow-100">{hint}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!submitted ? (
            <Button
              onClick={handleSubmit}
              disabled={!userAnswer}
              className="gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {isRTL ? 'تحقق من الإجابة' : 'Check Answer'}
            </Button>
          ) : (
            <Button
              onClick={handleReset}
              variant="outline"
            >
              {isRTL ? 'حاول مرة أخرى' : 'Try Again'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
