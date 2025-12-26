import { ChevronRight, MoreVertical, Download, Share2, Flag } from 'lucide-react'
import { Progress } from '../ui/progress'
import { Button } from '../ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { useLesson } from '../../contexts/LessonContext'
import { cn } from '../../lib/utils'

export function StickyHeader({
    subject,
    lessonNumber,
    onBack,
    currentLanguage,
    onDownload,
    onShare,
    onReportIssue,
}) {
    const { state } = useLesson()
    const progress = state.progress.overall || 0
    const isRTL = currentLanguage === 'ar'
    const BackIcon = ChevronRight

    return (
        <header className="sticky top-0 z-40 w-full mb-6">
            {/* Glossy Backdrop */}
            <div className="absolute inset-0 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b shadow-sm" />

            <div className={cn("relative py-3 px-4 sm:px-6 max-w-7xl", isRTL ? "!ml-auto !mr-0" : "mx-auto")}>
                {/* Top Row: Navigation */}
                <div
                    className="flex items-center justify-between gap-4"
                    dir={isRTL ? 'rtl' : 'ltr'}
                >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="group flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all rounded-full px-3"
                            aria-label={isRTL ? 'العودة إلى قائمة الدروس' : 'Back to lessons'}
                        >
                            <BackIcon className={cn(
                                "w-4 h-4 transition-transform group-hover:-translate-x-0.5",
                                isRTL && "rotate-180 group-hover:translate-x-0.5"
                            )} />
                            <span className="font-medium hidden sm:inline text-xs uppercase tracking-wider">
                                {isRTL ? 'رجوع' : 'Back'}
                            </span>
                        </Button>

                        <span className="h-4 w-[1px] bg-neutral-200 dark:bg-neutral-800 hidden sm:block mx-1" />

                        <h1 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 truncate">
                            {subject}
                            {lessonNumber && (
                                <span className="mx-2 text-neutral-400 dark:text-neutral-600 font-normal">
                                    |
                                </span>
                            )}
                            {lessonNumber && (
                                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded">
                                    {isRTL ? `الدرس ${lessonNumber}` : `Lesson ${lessonNumber}`}
                                </span>
                            )}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Quick Actions for Desktop */}
                        <div className="hidden md:flex items-center gap-1">
                            {onDownload && (
                                <Button variant="ghost" size="icon" onClick={onDownload} title={isRTL ? 'تحميل' : 'Download'}>
                                    <Download className="w-4 h-4" />
                                </Button>
                            )}
                            {onShare && (
                                <Button variant="ghost" size="icon" onClick={onShare} title={isRTL ? 'مشاركة' : 'Share'}>
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-8 h-8 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors flex items-center justify-center"
                                    aria-label={isRTL ? 'قائمة الخيارات' : 'Options menu'}
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-48">
                                <DropdownMenuItem onClick={onDownload} className="flex items-center gap-2 md:hidden">
                                    <Download className="w-4 h-4" />
                                    {isRTL ? 'تحميل الدرس' : 'Download Lesson'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onShare} className="flex items-center gap-2 md:hidden">
                                    <Share2 className="w-4 h-4" />
                                    {isRTL ? 'مشاركة الدرس' : 'Share Lesson'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onReportIssue} className="flex items-center gap-2 text-destructive focus:text-destructive">
                                    <Flag className="w-4 h-4" />
                                    {isRTL ? 'الإبلاغ عن مشكلة' : 'Report Issue'}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Progress Display */}
                <div className="mt-3 flex items-center gap-3" dir={isRTL ? 'rtl' : 'ltr'}>
                    <div className="flex-1">
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-1">
                            <span>{isRTL ? 'التقدم' : 'Progress'}</span>
                            <span className="font-bold text-primary-600 dark:text-primary-400">{Math.round(progress)}%</span>
                        </div>
                        <div className="relative">
                            <Progress value={progress} className="h-1.5 bg-neutral-100 dark:bg-neutral-800 shadow-inner overflow-hidden" />
                            {/* Subtle glow effect for progress */}
                            <div
                                className="absolute inset-y-0 translate-x-[var(--progress-offset)] w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none transition-all duration-500"
                                style={{ '--progress-offset': `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
