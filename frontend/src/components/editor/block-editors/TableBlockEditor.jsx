import React from 'react'
import { useEditor } from '../EditorContext'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

export const TableBlockEditor = ({ block }) => {
  const { updateBlock } = useEditor()

  const headers = block.content?.headers || ['Column 1', 'Column 2']
  const rows = block.content?.rows || [['', ''], ['', '']]

  const handleHeaderChange = (index, value) => {
    const newHeaders = [...headers]
    newHeaders[index] = value

    updateBlock(block.id, {
      content: {
        ...block.content,
        headers: newHeaders
      }
    })
  }

  const handleCellChange = (rowIndex, colIndex, value) => {
    const newRows = [...rows]
    newRows[rowIndex] = [...newRows[rowIndex]]
    newRows[rowIndex][colIndex] = value

    updateBlock(block.id, {
      content: {
        ...block.content,
        rows: newRows
      }
    })
  }

  const addColumn = () => {
    const newHeaders = [...headers, `Column ${headers.length + 1}`]
    const newRows = rows.map(row => [...row, ''])

    updateBlock(block.id, {
      content: {
        ...block.content,
        headers: newHeaders,
        rows: newRows
      }
    })
  }

  const removeColumn = (index) => {
    if (headers.length <= 1) return

    const newHeaders = headers.filter((_, i) => i !== index)
    const newRows = rows.map(row => row.filter((_, i) => i !== index))

    updateBlock(block.id, {
      content: {
        ...block.content,
        headers: newHeaders,
        rows: newRows
      }
    })
  }

  const addRow = () => {
    const newRow = headers.map(() => '')
    const newRows = [...rows, newRow]

    updateBlock(block.id, {
      content: {
        ...block.content,
        rows: newRows
      }
    })
  }

  const removeRow = (index) => {
    if (rows.length <= 1) return

    const newRows = rows.filter((_, i) => i !== index)

    updateBlock(block.id, {
      content: {
        ...block.content,
        rows: newRows
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Table Content</Label>
        <div className="flex gap-2">
          <Button onClick={addColumn} size="sm" variant="outline" className="gap-1">
            <Plus className="h-3 w-3" />
            Column
          </Button>
          <Button onClick={addRow} size="sm" variant="outline" className="gap-1">
            <Plus className="h-3 w-3" />
            Row
          </Button>
        </div>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="w-10 p-2"></th>
              {headers.map((header, index) => (
                <th key={index} className="p-2 border-b">
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={header}
                      onChange={(e) => handleHeaderChange(index, e.target.value)}
                      className="w-full p-1 border rounded text-sm font-semibold"
                      placeholder={`Column ${index + 1}`}
                    />
                    {headers.length > 1 && (
                      <button
                        onClick={() => removeColumn(index)}
                        className="text-red-600 hover:text-red-700 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="p-2 border-r border-b bg-gray-50">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-500">{rowIndex + 1}</span>
                    {rows.length > 1 && (
                      <button
                        onClick={() => removeRow(rowIndex)}
                        className="text-red-600 hover:text-red-700"
                        title="Remove row"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </td>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="p-2 border-b">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      className="w-full p-1 border rounded text-sm"
                      placeholder="Cell content..."
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500">
        Click headers to edit column names. Use buttons to add/remove rows and columns.
      </p>
    </div>
  )
}
