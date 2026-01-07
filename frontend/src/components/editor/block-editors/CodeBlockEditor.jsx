import React from 'react'
import { useEditor } from '../EditorContext'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'sql', label: 'SQL' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'bash', label: 'Bash' },
  { value: 'shell', label: 'Shell' },
  { value: 'text', label: 'Plain Text' }
]

export const CodeBlockEditor = ({ block }) => {
  const { updateBlock } = useEditor()

  const handleCodeChange = (value) => {
    updateBlock(block.id, {
      content: {
        ...block.content,
        code: value
      }
    })
  }

  const handleLanguageChange = (value) => {
    updateBlock(block.id, {
      content: {
        ...block.content,
        language: value
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label>Language:</Label>
          <Select
            value={block.content?.language || 'javascript'}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Code</Label>
        <textarea
          value={block.content?.code || ''}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder="Enter your code here..."
          className="w-full min-h-[200px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y font-mono text-sm bg-gray-50"
          spellCheck={false}
        />
      </div>
    </div>
  )
}
