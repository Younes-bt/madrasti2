import React from 'react'
import { Edit, Plus, Globe, Eye, MoreVertical, Share2, Copy, Trash } from 'lucide-react'
import { Button } from '../../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'
import { cn } from '../../../lib/utils'

/**
 * StickyActionToolbar Component
 *
 * Sticky toolbar with primary teacher actions for lesson management.
 * Replaces duplicate action buttons from header and sidebar.
 *
 * @param {Object} props
 * @param {function} props.onEdit - Callback to edit lesson
 * @param {function} props.onAddExercise - Callback to add new exercise
 * @param {function} props.onManageAvailability - Callback to manage class availability
 * @param {function} [props.onPreview] - Callback to toggle student preview
 * @param {function} [props.onShare] - Callback to share lesson
 * @param {function} [props.onDuplicate] - Callback to duplicate lesson
 * @param {function} [props.onDelete] - Callback to delete lesson
 * @param {string} [props.className] - Optional additional CSS classes
 */
export function StickyActionToolbar({
  onEdit,
  onAddExercise,
  onManageAvailability,
  onPreview,
  onShare,
  onDuplicate,
  onDelete,
  className
}) {
  return (
    <div
      className={cn(
        'sticky top-0 z-40 bg-white border-b shadow-sm backdrop-blur-sm bg-white/95',
        className
      )}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          {/* Primary Actions */}
          {onEdit && (
            <Button
              onClick={onEdit}
              className="gap-2"
              size="default"
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">تعديل الدرس</span>
              <span className="sm:hidden">تعديل</span>
            </Button>
          )}

          {onAddExercise && (
            <Button
              onClick={onAddExercise}
              variant="outline"
              className="gap-2"
              size="default"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">إضافة تمرين</span>
              <span className="sm:hidden">تمرين</span>
            </Button>
          )}

          {onManageAvailability && (
            <Button
              onClick={onManageAvailability}
              variant="outline"
              className="gap-2"
              size="default"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden md:inline">إدارة الإتاحة</span>
              <span className="md:hidden">الإتاحة</span>
            </Button>
          )}

          {onPreview && (
            <Button
              onClick={onPreview}
              variant="outline"
              className="gap-2"
              size="default"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden lg:inline">معاينة</span>
            </Button>
          )}

          {/* Overflow Menu for Secondary Actions */}
          {(onShare || onDuplicate || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  aria-label="المزيد من الخيارات"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {onShare && (
                  <DropdownMenuItem onClick={onShare} className="gap-2 cursor-pointer">
                    <Share2 className="h-4 w-4" />
                    <span>مشاركة</span>
                  </DropdownMenuItem>
                )}
                {onDuplicate && (
                  <DropdownMenuItem onClick={onDuplicate} className="gap-2 cursor-pointer">
                    <Copy className="h-4 w-4" />
                    <span>تكرار</span>
                  </DropdownMenuItem>
                )}
                {(onShare || onDuplicate) && onDelete && <DropdownMenuSeparator />}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                  >
                    <Trash className="h-4 w-4" />
                    <span>حذف</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  )
}

export default StickyActionToolbar
