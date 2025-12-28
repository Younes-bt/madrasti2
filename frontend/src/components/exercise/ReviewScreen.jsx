import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Alert, AlertDescription } from '../ui/alert'
import { CheckCircle, XCircle, Edit, Send, AlertTriangle } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'

export function ReviewScreen({
  questions,
  answers,
  onEditQuestion,
  onSubmit,
  onBack,
  allowMultipleAttempts = true
}) {
  const { t, currentLanguage } = useLanguage()

  const answeredCount = Object.keys(answers).length
  const totalQuestions = questions.length
  const allAnswered = answeredCount === totalQuestions

  const getQuestionTitle = (question) => {
    const text = currentLanguage === 'ar' && question.question_text_arabic
      ? question.question_text_arabic
      : question.question_text

    // Strip HTML and truncate
    const stripped = text.replace(/<[^>]*>/g, '')
    return stripped.length > 60 ? stripped.substring(0, 60) + '...' : stripped
  }

  const isQuestionAnswered = (question) => {
    const answer = answers[question.id]
    if (!answer) return false

    // Check based on question type
    if (['qcm_single', 'qcm_multiple', 'true_false'].includes(question.question_type)) {
      return answer.selectedChoices?.length > 0
    }
    if (['open_short', 'open_long'].includes(question.question_type)) {
      return Boolean(answer.textAnswer?.trim())
    }
    if (question.question_type === 'ordering') {
      return answer.orderingSequence?.length > 0
    }
    if (question.question_type === 'matching') {
      return answer.matchingAnswers?.length > 0
    }
    if (question.question_type === 'fill_blank') {
      return answer.blankAnswers?.length > 0
    }
    return Boolean(answer.textAnswer?.trim())
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Summary Card */}
      <Card className="mb-6 border-2">
        <CardHeader>
          <CardTitle className="text-2xl">{t('exercises.reviewAnswers', 'مراجعة الإجابات')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress Stats */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="text-lg font-semibold">{t('exercises.totalQuestions', 'إجمالي الأسئلة')}</span>
              <span className="text-2xl font-bold">{totalQuestions}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-success-50 border border-success-200 rounded-lg">
              <span className="text-lg font-semibold text-success-900">{t('exercises.questionsAnswered', 'الأسئلة المجابة')}</span>
              <span className="text-2xl font-bold text-success-700">{answeredCount}</span>
            </div>

            {!allAnswered && (
              <div className="flex items-center justify-between p-4 bg-warning-50 border border-warning-200 rounded-lg">
                <span className="text-lg font-semibold text-warning-900">{t('exercises.questionsRemaining', 'الأسئلة المتبقية')}</span>
                <span className="text-2xl font-bold text-warning-700">{totalQuestions - answeredCount}</span>
              </div>
            )}

            {/* Warning if incomplete */}
            {!allAnswered && (
              <Alert className="bg-warning-50 border-warning-200">
                <AlertTriangle className="h-4 w-4 text-warning-600" />
                <AlertDescription className="text-warning-900">
                  <strong>{t('common.warning', 'تحذير')}:</strong> {t('exercises.notAllAnswered', 'لم تجب على جميع الأسئلة. هل تريد المتابعة؟')}
                </AlertDescription>
              </Alert>
            )}

            {/* Single attempt warning */}
            {!allowMultipleAttempts && (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-900">
                  <strong>{t('exercises.important', 'مهم')}:</strong> {t('exercises.singleAttemptWarning', 'لا يمكنك الإرسال إلا مرة واحدة. تأكد من إجاباتك قبل الإرسال.')}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4 mb-6">
        {questions.map((question, index) => {
          const isAnswered = isQuestionAnswered(question)

          return (
            <Card
              key={question.id}
              className={`${isAnswered ? 'border-success-200 bg-success-50/50' : 'border-warning-200 bg-warning-50/50'}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {isAnswered ? (
                      <CheckCircle className="w-6 h-6 text-success-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-warning-600 flex-shrink-0 mt-1" />
                    )}

                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">
                        {t('exercises.question', 'سؤال')} {index + 1}: {getQuestionTitle(question)}
                      </h3>
                      <p className={`text-sm ${isAnswered ? 'text-success-700' : 'text-warning-700'}`}>
                        {isAnswered ? t('exercises.answered', 'تم الإجابة') : t('exercises.notAnswered', 'لم تتم الإجابة')}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditQuestion(index + 1)}
                    className="gap-2 flex-shrink-0"
                  >
                    <Edit className="w-4 h-4" />
                    {isAnswered ? t('exercises.edit', 'تعديل') : t('exercises.answer', 'إجابة')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" onClick={onBack} size="lg">
          {t('exercises.backToExercise', 'العودة للتمرين')}
        </Button>

        <Button
          onClick={onSubmit}
          size="lg"
          className="gap-2"
          disabled={!allAnswered}
        >
          <Send className="w-5 h-5" />
          {t('exercises.submitExercise', 'إرسال التمرين')}
        </Button>
      </div>
    </div>
  )
}
