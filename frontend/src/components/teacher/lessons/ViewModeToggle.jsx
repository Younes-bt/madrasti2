import React from 'react'
import { Edit, Eye } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs'
import { cn } from '../../../lib/utils'

/**
 * ViewModeToggle Component
 *
 * Toggle between Teacher View and Student Preview modes
 * in the lesson view page.
 *
 * @param {Object} props
 * @param {'teacher' | 'student'} props.mode - Current view mode
 * @param {function} props.onModeChange - Callback when mode changes
 * @param {string} [props.className] - Optional additional CSS classes
 */
export function ViewModeToggle({ mode, onModeChange, className }) {
  return (
    <Tabs
      value={mode}
      onValueChange={onModeChange}
      className={cn("w-auto", className)}
    >
      <TabsList className="h-10">
        <TabsTrigger
          value="teacher"
          className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Edit className="h-4 w-4" />
          <span>عرض المعلم</span>
        </TabsTrigger>
        <TabsTrigger
          value="student"
          className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Eye className="h-4 w-4" />
          <span>معاينة الطالب</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default ViewModeToggle
