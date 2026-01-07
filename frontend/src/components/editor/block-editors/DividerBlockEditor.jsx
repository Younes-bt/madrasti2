import React from 'react'
import { Label } from '@/components/ui/label'

export const DividerBlockEditor = ({ block }) => {
  return (
    <div className="space-y-4">
      <Label className="text-sm text-gray-500">Horizontal divider (no configuration needed)</Label>
      <div className="border-t-2 border-gray-300 my-4" />
    </div>
  )
}
