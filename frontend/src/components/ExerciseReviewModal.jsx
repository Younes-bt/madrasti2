import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from './ui/dialog'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react'
import { cn } from '../lib/utils'

const ExerciseReviewModal = ({ exercise, open, onClose }) => {
    if (!exercise || !exercise.submission) return null

    const { submission, questions = [], title, total_points } = exercise

    // Create answer lookup map
    const answerMap = new Map()
    submission.answers?.forEach((answer) => {
        answerMap.set(answer.question_id, answer)
    })

    const formatScore = (score) => {
        return score != null ? Number(score).toFixed(2) : '0.00'
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{title}</DialogTitle>
                    <DialogDescription>
                        Review your answers and see detailed feedback
                    </DialogDescription>
                </DialogHeader>

                {/* Summary Stats */}
                <div className="grid grid-cols-4 gap-4 my-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground">Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatScore(submission.total_score)} / {formatScore(total_points)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground">Percentage</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600">
                                {formatScore(submission.percentage_score)}%
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground">Correct</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {submission.questions_correct || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground">Answered</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {submission.questions_answered || 0}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Questions and Answers */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Questions & Answers</h3>

                    {questions.map((question, index) => {
                        const answer = answerMap.get(question.id)
                        const isCorrect = answer?.is_correct
                        const selectedChoiceIds = answer?.selected_choice_ids || []

                        return (
                            <Card key={question.id} className={cn(
                                "border-2",
                                isCorrect === true && "border-green-200 bg-green-50/50",
                                isCorrect === false && "border-red-200 bg-red-50/50",
                                isCorrect === null && "border-amber-200 bg-amber-50/50"
                            )}>
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-semibold">Question {index + 1}</span>
                                                <Badge variant="outline">{question.question_type}</Badge>
                                                {isCorrect === true && (
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                )}
                                                {isCorrect === false && (
                                                    <XCircle className="h-5 w-5 text-red-600" />
                                                )}
                                                {isCorrect === null && (
                                                    <MinusCircle className="h-5 w-5 text-amber-600" />
                                                )}
                                            </div>
                                            <p className="text-base">{question.question_text}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-muted-foreground">Points</div>
                                            <div className="font-semibold">
                                                {answer?.points_earned != null ? formatScore(answer.points_earned) : '0'} / {question.points}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Multiple Choice Questions */}
                                    {['qcm_single', 'qcm_multiple', 'true_false'].includes(question.question_type) && (
                                        <div className="space-y-2">
                                            {question.choices?.map((choice) => {
                                                const isSelected = selectedChoiceIds.includes(choice.id)
                                                const isCorrectChoice = choice.is_correct

                                                return (
                                                    <div
                                                        key={choice.id}
                                                        className={cn(
                                                            "p-3 rounded-lg border-2",
                                                            isSelected && isCorrectChoice && "bg-green-100 border-green-500",
                                                            isSelected && !isCorrectChoice && "bg-red-100 border-red-500",
                                                            !isSelected && isCorrectChoice && "bg-green-50 border-green-300",
                                                            !isSelected && !isCorrectChoice && "border-gray-200"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {isSelected && (
                                                                <CheckCircle className={cn(
                                                                    "h-4 w-4",
                                                                    isCorrectChoice ? "text-green-600" : "text-red-600"
                                                                )} />
                                                            )}
                                                            {!isSelected && isCorrectChoice && (
                                                                <span className="text-xs font-semibold text-green-700">✓ Correct</span>
                                                            )}
                                                            <span>{choice.choice_text}</span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}

                                    {/* Text Questions */}
                                    {['open_short', 'open_long'].includes(question.question_type) && answer?.text_answer && (
                                        <div className="space-y-2">
                                            <div className="text-sm font-medium text-muted-foreground">Your Answer:</div>
                                            <div className="p-3 bg-gray-50 rounded-lg border">
                                                {answer.text_answer}
                                            </div>
                                        </div>
                                    )}

                                    {/* Explanation */}
                                    {question.explanation && (
                                        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                                            <div className="text-sm font-semibold text-blue-900 mb-1">Explanation:</div>
                                            <div className="text-sm text-blue-800">{question.explanation}</div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ExerciseReviewModal
