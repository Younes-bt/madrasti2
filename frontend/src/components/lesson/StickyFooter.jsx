import { MessageCircle, Bookmark, ChevronLeft } from 'lucide-react'
import { Button } from '../ui/button'

export function StickyFooter({
    onAskQuestion,
    onBookmark,
    onNextLesson,
    isBookmarked,
    isLastLesson,
    canProceed,
    currentLanguage
}) {
    const isRTL = currentLanguage === 'ar'

    return (
        <footer className="sticky bottom-0 z-40 bg-white dark:bg-neutral-900 border-t shadow-lg mt-6">
            <div className="py-4 px-4">
                <div className="flex items-center justify-between gap-3" dir={isRTL ? 'rtl' : 'ltr'}>
                    {/* Ask Question */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onAskQuestion}
                        className="gap-2"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">{isRTL ? 'طرح سؤال' : 'Ask Question'}</span>
                    </Button>

                    {/* Bookmark */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onBookmark}
                        className={`gap-2 ${isBookmarked ? 'bg-warning-50 border-warning-300 dark:bg-warning-900/20 dark:border-warning-700' : ''}`}
                    >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-warning-600 dark:text-warning-400' : ''}`} />
                        <span className="hidden sm:inline">
                            {isBookmarked ? (isRTL ? 'محفوظ' : 'Saved') : (isRTL ? 'حفظ' : 'Save')}
                        </span>
                    </Button>

                    {/* Next Lesson */}
                    <Button
                        onClick={onNextLesson}
                        disabled={!canProceed}
                        className="gap-2 flex-1 sm:flex-initial"
                    >
                        {isLastLesson ? (isRTL ? 'إنهاء الوحدة' : 'Finish Unit') : (isRTL ? 'الدرس التالي' : 'Next Lesson')}
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </footer>
    )
}
