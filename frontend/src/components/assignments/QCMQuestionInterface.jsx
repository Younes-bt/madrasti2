import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useLanguage } from '../../hooks/useLanguage'
import { 
  GripVertical,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Square,
  CheckSquare,
  Image as ImageIcon,
  Upload,
  Eye,
  EyeOff,
  Shuffle,
  Copy,
  Edit,
  Save,
  RotateCcw,
  AlertCircle,
  Lightbulb,
  Target,
  Zap,
  Settings,
  HelpCircle,
  Type
} from 'lucide-react'

const QCMQuestionInterface = ({ question, onUpdate, onDelete }) => {
  const { t } = useLanguage()
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverItem, setDragOverItem] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isEditing, setIsEditing] = useState(true)

  const questionData = question || {
    id: Date.now(),
    type: 'qcm_single',
    question_text: '',
    points: 2,
    difficulty: 'medium',
    category: '',
    options: [
      { id: 1, text: '', is_correct: false, explanation: '', order: 1 },
      { id: 2, text: '', is_correct: false, explanation: '', order: 2 },
      { id: 3, text: '', is_correct: false, explanation: '', order: 3 },
      { id: 4, text: '', is_correct: false, explanation: '', order: 4 }
    ],
    explanation: '',
    hints: [],
    time_limit: 0,
    randomize_options: false,
    allow_partial_credit: false,
    image: null,
    tags: []
  }

  const [localQuestion, setLocalQuestion] = useState(questionData)
  const dragItemRef = useRef(null)
  const dropZoneRef = useRef(null)

  // Auto-save changes
  useEffect(() => {
    if (onUpdate && JSON.stringify(localQuestion) !== JSON.stringify(questionData)) {
      onUpdate(localQuestion)
    }
  }, [localQuestion, onUpdate])

  const updateQuestion = (updates) => {
    setLocalQuestion(prev => ({ ...prev, ...updates }))
  }

  const updateOption = (optionId, updates) => {
    const newOptions = localQuestion.options.map(opt => 
      opt.id === optionId ? { ...opt, ...updates } : opt
    )
    updateQuestion({ options: newOptions })
  }

  const addOption = () => {
    const newOption = {
      id: Date.now(),
      text: '',
      is_correct: false,
      explanation: '',
      order: localQuestion.options.length + 1
    }
    updateQuestion({ 
      options: [...localQuestion.options, newOption] 
    })
  }

  const removeOption = (optionId) => {
    if (localQuestion.options.length <= 2) {
      alert(t('assignments.minimumOptions'))
      return
    }
    
    const newOptions = localQuestion.options
      .filter(opt => opt.id !== optionId)
      .map((opt, index) => ({ ...opt, order: index + 1 }))
    
    updateQuestion({ options: newOptions })
  }

  const duplicateOption = (optionId) => {
    const optionToDuplicate = localQuestion.options.find(opt => opt.id === optionId)
    const newOption = {
      ...optionToDuplicate,
      id: Date.now(),
      text: optionToDuplicate.text + ' (Copy)',
      is_correct: false,
      order: localQuestion.options.length + 1
    }
    updateQuestion({ 
      options: [...localQuestion.options, newOption] 
    })
  }

  const handleCorrectChange = (optionId, isCorrect) => {
    let newOptions = [...localQuestion.options]
    
    if (localQuestion.type === 'qcm_single') {
      // Single choice - only one can be correct
      newOptions = newOptions.map(opt => ({
        ...opt,
        is_correct: opt.id === optionId ? isCorrect : false
      }))
    } else {
      // Multiple choice - multiple can be correct
      newOptions = newOptions.map(opt => 
        opt.id === optionId ? { ...opt, is_correct: isCorrect } : opt
      )
    }
    
    updateQuestion({ options: newOptions })
  }

  const shuffleOptions = () => {
    const shuffledOptions = [...localQuestion.options]
      .sort(() => Math.random() - 0.5)
      .map((opt, index) => ({ ...opt, order: index + 1 }))
    
    updateQuestion({ options: shuffledOptions })
  }

  // Drag and Drop Functions
  const handleDragStart = (e, index) => {
    setDraggedItem(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target.outerHTML)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverItem(index)
  }

  const handleDragLeave = () => {
    setDragOverItem(null)
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    
    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null)
      setDragOverItem(null)
      return
    }

    const newOptions = [...localQuestion.options]
    const draggedOption = newOptions[draggedItem]
    
    // Remove the dragged item
    newOptions.splice(draggedItem, 1)
    
    // Insert at new position
    newOptions.splice(dropIndex, 0, draggedOption)
    
    // Update order numbers
    const reorderedOptions = newOptions.map((opt, index) => ({
      ...opt,
      order: index + 1
    }))

    updateQuestion({ options: reorderedOptions })
    setDraggedItem(null)
    setDragOverItem(null)
  }

  const getQuestionTypeIcon = () => {
    return localQuestion.type === 'qcm_single' ? Circle : Square
  }

  const getCorrectIcon = (isCorrect) => {
    if (localQuestion.type === 'qcm_single') {
      return isCorrect ? CheckCircle2 : Circle
    } else {
      return isCorrect ? CheckSquare : Square
    }
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    }
    return colors[difficulty] || colors.medium
  }

  const getCorrectAnswersCount = () => {
    return localQuestion.options.filter(opt => opt.is_correct).length
  }

  const validateQuestion = () => {
    const issues = []
    
    if (!localQuestion.question_text.trim()) {
      issues.push(t('assignments.questionTextRequired'))
    }
    
    if (localQuestion.options.some(opt => !opt.text.trim())) {
      issues.push(t('assignments.emptyOptionsFound'))
    }
    
    if (getCorrectAnswersCount() === 0) {
      issues.push(t('assignments.noCorrectAnswer'))
    }
    
    if (localQuestion.type === 'qcm_single' && getCorrectAnswersCount() > 1) {
      issues.push(t('assignments.singleChoiceMultipleCorrect'))
    }
    
    return issues
  }

  const validationIssues = validateQuestion()
  const isValid = validationIssues.length === 0

  return (
    <Card className={`transition-all ${isValid ? 'border-green-200' : 'border-red-200'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                {React.createElement(getQuestionTypeIcon(), { className: "h-4 w-4 text-blue-500" })}
                {localQuestion.type === 'qcm_single' 
                  ? t('assignments.singleChoice') 
                  : t('assignments.multipleChoice')
                }
              </CardTitle>
              <CardDescription className="text-xs">
                {t('assignments.qcmDescription')}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(localQuestion.difficulty)}>
              {t(`assignments.${localQuestion.difficulty}`)}
            </Badge>
            <Badge variant="outline">
              <Target className="h-3 w-3 mr-1" />
              {localQuestion.points}pts
            </Badge>
            {getCorrectAnswersCount() > 0 && (
              <Badge className="bg-green-100 text-green-800">
                <Zap className="h-3 w-3 mr-1" />
                {t('assignments.autoGradable')}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete && onDelete(localQuestion.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Question Settings */}
        <div className="grid grid-cols-4 gap-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              {t('assignments.questionType')}
            </label>
            <select
              value={localQuestion.type}
              onChange={(e) => updateQuestion({ type: e.target.value })}
              className="w-full mt-1 px-2 py-1 text-xs border rounded"
            >
              <option value="qcm_single">{t('assignments.singleChoice')}</option>
              <option value="qcm_multiple">{t('assignments.multipleChoice')}</option>
            </select>
          </div>
          
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              {t('assignments.points')}
            </label>
            <input
              type="number"
              value={localQuestion.points}
              onChange={(e) => updateQuestion({ points: parseInt(e.target.value) || 1 })}
              className="w-full mt-1 px-2 py-1 text-xs border rounded"
              min="1"
            />
          </div>
          
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              {t('assignments.difficulty')}
            </label>
            <select
              value={localQuestion.difficulty}
              onChange={(e) => updateQuestion({ difficulty: e.target.value })}
              className="w-full mt-1 px-2 py-1 text-xs border rounded"
            >
              <option value="easy">{t('assignments.easy')}</option>
              <option value="medium">{t('assignments.medium')}</option>
              <option value="hard">{t('assignments.hard')}</option>
            </select>
          </div>
          
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              {t('assignments.timeLimit')} (s)
            </label>
            <input
              type="number"
              value={localQuestion.time_limit}
              onChange={(e) => updateQuestion({ time_limit: parseInt(e.target.value) || 0 })}
              placeholder="0 = No limit"
              className="w-full mt-1 px-2 py-1 text-xs border rounded"
              min="0"
            />
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1">
            <Type className="h-4 w-4" />
            {t('assignments.questionText')}
          </label>
          <textarea
            value={localQuestion.question_text}
            onChange={(e) => updateQuestion({ question_text: e.target.value })}
            placeholder={t('assignments.questionTextPlaceholder')}
            className="w-full px-3 py-2 border rounded-md resize-none"
            rows={3}
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1">
            <ImageIcon className="h-4 w-4" />
            {t('assignments.questionImage')} ({t('common.optional')})
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {t('assignments.dragImageOrClick')}
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              {t('assignments.browseImage')}
            </Button>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-1">
              <HelpCircle className="h-4 w-4" />
              {t('assignments.answerOptions')}
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={shuffleOptions}
                title={t('assignments.shuffleOptions')}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={addOption}
                disabled={localQuestion.options.length >= 6}
              >
                <Plus className="h-4 w-4 mr-1" />
                {t('assignments.addOption')}
              </Button>
            </div>
          </div>

          {/* Options List */}
          <div className="space-y-2">
            {localQuestion.options.map((option, index) => {
              const CorrectIcon = getCorrectIcon(option.is_correct)
              
              return (
                <div
                  key={option.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`p-3 border rounded-lg transition-all cursor-move ${
                    dragOverItem === index ? 'border-blue-400 bg-blue-50' : ''
                  } ${
                    option.is_correct ? 'bg-green-50 border-green-200' : 'bg-card'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Drag Handle */}
                    <GripVertical className="h-4 w-4 text-muted-foreground mt-2 cursor-move" />
                    
                    {/* Option Letter */}
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium mt-1">
                      {String.fromCharCode(65 + index)}
                    </div>

                    {/* Correct Answer Toggle */}
                    <button
                      onClick={() => handleCorrectChange(option.id, !option.is_correct)}
                      className={`flex-shrink-0 mt-1 transition-colors ${
                        option.is_correct 
                          ? 'text-green-600 hover:text-green-700' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                      title={option.is_correct ? t('assignments.correctAnswer') : t('assignments.markAsCorrect')}
                    >
                      <CorrectIcon className="h-5 w-5" />
                    </button>

                    {/* Option Content */}
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => updateOption(option.id, { text: e.target.value })}
                        placeholder={`${t('assignments.option')} ${String.fromCharCode(65 + index)}`}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                      
                      {/* Option Explanation */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={option.explanation || ''}
                          onChange={(e) => updateOption(option.id, { explanation: e.target.value })}
                          placeholder={t('assignments.optionExplanation')}
                          className="flex-1 px-2 py-1 border rounded text-xs text-muted-foreground"
                        />
                      </div>
                    </div>

                    {/* Option Actions */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateOption(option.id)}
                        title={t('assignments.duplicateOption')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(option.id)}
                        disabled={localQuestion.options.length <= 2}
                        title={t('assignments.removeOption')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Question Explanation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              {t('assignments.explanation')} ({t('common.optional')})
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExplanation(!showExplanation)}
            >
              {showExplanation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          
          {showExplanation && (
            <textarea
              value={localQuestion.explanation || ''}
              onChange={(e) => updateQuestion({ explanation: e.target.value })}
              placeholder={t('assignments.explanationPlaceholder')}
              className="w-full px-3 py-2 border rounded-md resize-none"
              rows={2}
            />
          )}
        </div>

        {/* Advanced Settings */}
        <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{t('assignments.advancedSettings')}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`randomize_${localQuestion.id}`}
                checked={localQuestion.randomize_options}
                onChange={(e) => updateQuestion({ randomize_options: e.target.checked })}
                className="rounded"
              />
              <label htmlFor={`randomize_${localQuestion.id}`} className="text-sm">
                {t('assignments.randomizeOptions')}
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`partial_${localQuestion.id}`}
                checked={localQuestion.allow_partial_credit}
                onChange={(e) => updateQuestion({ allow_partial_credit: e.target.checked })}
                className="rounded"
                disabled={localQuestion.type === 'qcm_single'}
              />
              <label htmlFor={`partial_${localQuestion.id}`} className="text-sm">
                {t('assignments.allowPartialCredit')}
              </label>
            </div>
          </div>
        </div>

        {/* Validation Issues */}
        {!isValid && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">{t('assignments.validationIssues')}</span>
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              {validationIssues.map((issue, index) => (
                <li key={index}>• {issue}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Question Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
          <span>{t('assignments.correctAnswers')}: {getCorrectAnswersCount()}</span>
          <span>{t('assignments.totalOptions')}: {localQuestion.options.length}</span>
          {localQuestion.time_limit > 0 && (
            <span>{t('assignments.timeLimit')}: {localQuestion.time_limit}s</span>
          )}
          <span className={isValid ? 'text-green-600' : 'text-red-600'}>
            {isValid ? '✓ ' + t('assignments.valid') : '⚠ ' + t('assignments.needsAttention')}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default QCMQuestionInterface