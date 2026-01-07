import React, { useState } from 'react'
import { useEditor } from '../EditorContext'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

export const MathBlockEditor = ({ block }) => {
  const { updateBlock } = useEditor()
  const [error, setError] = useState(null)

  const handleFormulaChange = (value) => {
    updateBlock(block.id, {
      content: {
        ...block.content,
        formula: value
      }
    })
    setError(null)
  }

  const handleDisplayModeChange = (value) => {
    updateBlock(block.id, {
      content: {
        ...block.content,
        displayMode: value
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label>Display Mode:</Label>
          <Select
            value={block.content?.displayMode || 'block'}
            onValueChange={handleDisplayModeChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="block">Block (Display)</SelectItem>
              <SelectItem value="inline">Inline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>LaTeX Formula</Label>
        <textarea
          value={block.content?.formula || ''}
          onChange={(e) => handleFormulaChange(e.target.value)}
          placeholder="Enter LaTeX formula (e.g., E = mc^2, \frac{a}{b}, \sum_{i=1}^{n} x_i)"
          className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y font-mono text-sm"
          spellCheck={false}
        />
        <p className="text-xs text-gray-500 mt-1">
          Use LaTeX syntax: ^{} for superscript, _{} for subscript, \frac{}{} for fractions, etc.
        </p>
      </div>

      {/* Preview */}
      <div>
        <Label>Preview</Label>
        <div className="border rounded-md p-4 bg-gray-50 min-h-[80px] flex items-center justify-center">
          {block.content?.formula ? (
            <div onError={() => setError('Invalid LaTeX syntax')}>
              {error ? (
                <div className="text-red-600 text-sm">{error}</div>
              ) : (
                <BlockMath math={block.content.formula} errorColor="#dc2626" />
              )}
            </div>
          ) : (
            <span className="text-gray-400 text-sm">Formula preview will appear here</span>
          )}
        </div>
      </div>

      {/* Common symbols helper */}
      <div>
        <Label className="text-xs text-gray-600">Common Symbols:</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {[
            { label: 'Fraction', tex: '\\frac{a}{b}' },
            { label: 'Square root', tex: '\\sqrt{x}' },
            { label: 'Sum', tex: '\\sum_{i=1}^{n}' },
            { label: 'Integral', tex: '\\int_{a}^{b}' },
            { label: 'Greek α', tex: '\\alpha' },
            { label: 'Greek β', tex: '\\beta' },
            { label: 'Infinity', tex: '\\infty' },
          ].map((symbol) => (
            <button
              key={symbol.label}
              onClick={() => handleFormulaChange((block.content?.formula || '') + symbol.tex)}
              className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
            >
              {symbol.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
