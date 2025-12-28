import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import { Lightbulb } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
import { useMathText } from './MathRenderer'
import 'katex/dist/katex.min.css'

export function QuestionContainer({
  questionNumber,
  totalQuestions,
  points,
  questionText,
  questionType,
  questionImage,
  hint,
  explanation,
  showExplanation = false,
  children // Answer component
}) {
  const { t, currentLanguage } = useLanguage()

  const questionTypeLabels = {
    'qcm_single': t('exercises.questionTypes.multipleChoice', 'اختيار من متعدد'),
    'qcm_multiple': t('exercises.questionTypes.multipleChoiceMultiple', 'اختيار متعدد'),
    'true_false': t('exercises.questionTypes.trueFalse', 'صح أو خطأ'),
    'open_short': t('exercises.questionTypes.shortAnswer', 'إجابة قصيرة'),
    'open_long': t('exercises.questionTypes.longAnswer', 'إجابة مطولة'),
    'ordering': t('exercises.questionTypes.ordering', 'ترتيب'),
    'matching': t('exercises.questionTypes.matching', 'مطابقة'),
    'fill_blank': t('exercises.questionTypes.fillBlank', 'إكمال الفراغ')
  }

  const isLastQuestion = questionNumber === totalQuestions

  // Process question text to render math formulas
  const processedQuestionText = useMathText(questionText)

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Card className="shadow-lg">
        <CardContent className="p-8">
          {/* Question Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-neutral-900">
                {t('exercises.question', 'سؤال')} {questionNumber}
              </h2>
              <span className="text-neutral-500">
                {t('exercises.of', 'من')} {totalQuestions}
              </span>
              {isLastQuestion && (
                <Badge variant="secondary" className="bg-primary-100 text-primary-700">
                  {t('exercises.lastQuestion', 'الأخير')}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                {questionTypeLabels[questionType] || questionType}
              </Badge>
              <Badge className="bg-primary-100 text-primary-700 text-sm font-bold">
                {points} {points === 1 ? t('exercises.point', 'نقطة') : t('exercises.points', 'نقاط')}
              </Badge>
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-8">
            <div
              className="text-lg leading-relaxed prose prose-lg max-w-none"
              dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
              dangerouslySetInnerHTML={{ __html: processedQuestionText }}
            />
          </div>

          {/* Question Image */}
          {questionImage && (
            <div className="mb-8 rounded-lg border border-muted/40 bg-muted/20 overflow-hidden">
              <img
                src={questionImage}
                alt={t('exercises.questionImage', 'صورة السؤال')}
                className="w-full h-auto max-h-80 object-contain bg-background"
              />
            </div>
          )}

          {/* Answer Component */}
          <div className="mb-6">
            {children}
          </div>

          {/* Hint (if available) */}
          {hint && (
            <Alert className="bg-info-50 border-info-200 mb-6">
              <Lightbulb className="w-4 h-4 text-info-600" />
              <AlertDescription className="text-info-900">
                <strong>{t('exercises.hint', 'تلميح')}:</strong> {hint}
              </AlertDescription>
            </Alert>
          )}

          {/* Explanation (shown after submission) */}
          {explanation && showExplanation && (
            <Alert className="bg-success-50 border-success-200">
              <AlertDescription className="text-success-900">
                <strong>{t('exercises.solution', 'الحل')}:</strong> {explanation}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
