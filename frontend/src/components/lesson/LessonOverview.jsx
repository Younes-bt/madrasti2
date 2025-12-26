import { Clock, BarChart, Target, ChevronDown, Paperclip } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { useState } from 'react'

export function LessonOverview({
    duration,
    difficulty,
    learningObjectives,
    description,
    attachments,
    currentLanguage
}) {
    const [isExpanded, setIsExpanded] = useState(false)
    const isRTL = currentLanguage === 'ar'

    const difficultyColors = {
        'easy': 'text-success-600 bg-success-50 dark:text-success-400 dark:bg-success-900/20',
        'medium': 'text-warning-600 bg-warning-50 dark:text-warning-400 dark:bg-warning-900/20',
        'hard': 'text-error-600 bg-error-50 dark:text-error-400 dark:bg-error-900/20',
        'سهل': 'text-success-600 bg-success-50 dark:text-success-400 dark:bg-success-900/20',
        'متوسط': 'text-warning-600 bg-warning-50 dark:text-warning-400 dark:bg-warning-900/20',
        'صعب': 'text-error-600 bg-error-50 dark:text-error-400 dark:bg-error-900/20'
    }

    const difficultyText = {
        'easy': isRTL ? 'سهل' : 'Easy',
        'medium': isRTL ? 'متوسط' : 'Medium',
        'hard': isRTL ? 'صعب' : 'Hard'
    }

    return (
        <Card className="mb-6">
            <CardContent className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">📚</span>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        {isRTL ? 'نظرة عامة على الدرس' : 'Lesson Overview'}
                    </h2>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-6 mb-4 pb-4 border-b dark:border-neutral-700">
                    <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                        <Clock className="w-5 h-5" />
                        <span className="text-sm">
                            {isRTL ? 'المدة:' : 'Duration:'} ~{duration} {isRTL ? 'دقيقة' : 'min'}
                        </span>
                    </div>

                    {difficulty && (
                        <div className="flex items-center gap-2">
                            <BarChart className="w-5 h-5" />
                            <span className={`text-sm px-3 py-1 rounded-full font-medium ${difficultyColors[difficulty] || difficultyColors['medium']}`}>
                                {isRTL ? 'الصعوبة:' : 'Difficulty:'} {difficultyText[difficulty] || difficulty}
                            </span>
                        </div>
                    )}
                </div>

                {/* Learning Objectives */}
                {learningObjectives && learningObjectives.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100 font-semibold">
                            <Target className="w-5 h-5" />
                            <span>{isRTL ? 'سوف تتعلم:' : 'You will learn:'}</span>
                        </div>

                        <ul className={`space-y-2 ${isRTL ? 'mr-7' : 'ml-7'}`}>
                            {learningObjectives.map((objective, index) => (
                                <li key={index} className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300">
                                    <span className="text-primary-500 mt-1">•</span>
                                    <span>{objective}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Expandable Description */}
                {description && (
                    <div className={`mt-4 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            {description}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                    {description && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="gap-2"
                        >
                            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            {isExpanded ? (isRTL ? 'إخفاء التفاصيل' : 'Hide details') : (isRTL ? 'اقرأ المزيد' : 'Read more')}
                        </Button>
                    )}

                    {attachments?.length > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {/* Handle attachments view */ }}
                            className="gap-2"
                        >
                            <Paperclip className="w-4 h-4" />
                            {isRTL ? `المرفقات (${attachments.length})` : `Attachments (${attachments.length})`}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
