import React, { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { questionService } from '../../services/questions'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Badge } from '../ui/badge'
import { Checkbox } from '../ui/checkbox'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import {
  X,
  Plus,
  CheckSquare,
  FileText,
  ToggleLeft,
  Type,
  Link,
  ArrowUpDown,
  Move,
  Trash2,
  GripVertical,
  Save,
  Eye,
  AlertCircle
} from 'lucide-react'
import { cn } from '../../lib/utils'

const QuestionCreator = ({ isOpen, onClose, questionType, onSave, initialData = null, assignmentId = null }) => {
  const { t, isRTL } = useLanguage()
  const [formData, setFormData] = useState({
    question: initialData?.question || '',
    subject: initialData?.subject || '',
    difficulty: initialData?.difficulty || 'medium',
    tags: initialData?.tags || [],
    points: initialData?.points || 1,
    timeLimit: initialData?.timeLimit || null,
    explanation: initialData?.explanation || '',
    options: initialData?.options || [],
    correctAnswers: initialData?.correctAnswers || [],
    caseSensitive: initialData?.caseSensitive || false,
    allowPartialCredit: initialData?.allowPartialCredit || false,
    ...initialData
  })

  const [newTag, setNewTag] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState(null)

  if (!isOpen) return null

  const questionTypes = {
    qcm_single: {
      name: 'QCM Single Choice',
      icon: CheckSquare,
      component: QCMSingleQuestion
    },
    qcm_multiple: {
      name: 'QCM Multiple Choice',
      icon: CheckSquare,
      component: QCMMultipleQuestion
    },
    open_short: {
      name: 'Short Answer',
      icon: FileText,
      component: OpenShortQuestion
    },
    open_long: {
      name: 'Long Answer',
      icon: FileText,
      component: OpenLongQuestion
    },
    true_false: {
      name: 'True/False',
      icon: ToggleLeft,
      component: TrueFalseQuestion
    },
    fill_blank: {
      name: 'Fill in the Blank',
      icon: Type,
      component: FillBlankQuestion
    },
    matching: {
      name: 'Matching',
      icon: Link,
      component: MatchingQuestion
    },
    ordering: {
      name: 'Ordering',
      icon: ArrowUpDown,
      component: OrderingQuestion
    }
  }

  const currentQuestionType = questionTypes[questionType] || questionTypes.qcm_single

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleFormChange('tags', [...formData.tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    handleFormChange('tags', formData.tags.filter(tag => tag !== tagToRemove))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.question.trim()) {
      newErrors.question = 'Question text is required'
    }

    if (!formData.subject) {
      newErrors.subject = 'Subject is required'
    }

    // Question-specific validation
    if (questionType.startsWith('qcm') || questionType === 'true_false') {
      if (!formData.options.length) {
        newErrors.options = 'At least one option is required'
      }
      if (!formData.correctAnswers.length) {
        newErrors.correctAnswers = 'At least one correct answer must be selected'
      }
    }

    if (questionType === 'fill_blank') {
      if (!formData.correctAnswers.length) {
        newErrors.correctAnswers = 'At least one correct answer is required'
      }
    }

    if (questionType === 'matching') {
      if (formData.leftColumn?.length < 2 || formData.rightColumn?.length < 2) {
        newErrors.matching = 'At least 2 items in each column are required'
      }
    }

    if (questionType === 'ordering') {
      if (formData.items?.length < 3) {
        newErrors.ordering = 'At least 3 items are required for ordering'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setSaving(true)
    setApiError(null)

    try {
      const questionData = {
        ...formData,
        type: questionType,
        assignmentId: assignmentId // This can be null for standalone questions
      }

      let result
      if (initialData?.id) {
        // Update existing question
        result = await questionService.updateQuestion(initialData.id, questionData)
      } else {
        // Create new question
        result = await questionService.createQuestion(questionData)
      }

      if (result.success) {
        // Call the parent callback with the saved question data
        onSave?.(result.data)
        onClose()
      } else {
        setApiError(result.error)
      }
    } catch (error) {
      console.error('Error saving question:', error)
      setApiError('Failed to save question. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const QuestionTypeComponent = currentQuestionType.component

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <currentQuestionType.icon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {initialData ? 'Edit' : 'Create'} {currentQuestionType.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {initialData ? 'Modify existing question' : 'Create a new question for your question bank'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* API Error Display */}
        {apiError && (
          <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-700">{apiError}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Question Text */}
                <div>
                  <Label htmlFor="question">Question *</Label>
                  <Textarea
                    id="question"
                    placeholder="Enter your question here..."
                    value={formData.question}
                    onChange={(e) => handleFormChange('question', e.target.value)}
                    className={cn(
                      'min-h-[100px]',
                      errors.question && 'border-red-500'
                    )}
                  />
                  {errors.question && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.question}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Subject */}
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Select value={formData.subject} onValueChange={(value) => handleFormChange('subject', value)}>
                      <SelectTrigger className={cn(errors.subject && 'border-red-500')}>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="Geography">Geography</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="History">History</SelectItem>
                        <SelectItem value="Literature">Literature</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.subject && (
                      <p className="text-sm text-red-600 mt-1">{errors.subject}</p>
                    )}
                  </div>

                  {/* Difficulty */}
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={formData.difficulty} onValueChange={(value) => handleFormChange('difficulty', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Points */}
                  <div>
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      type="number"
                      min="1"
                      value={formData.points}
                      onChange={(e) => handleFormChange('points', parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Question-Specific Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Question Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <QuestionTypeComponent
                  formData={formData}
                  onChange={handleFormChange}
                  errors={errors}
                />
              </CardContent>
            </Card>

            {/* Additional Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Time Limit */}
                <div>
                  <Label htmlFor="timeLimit">Time Limit (minutes) - Optional</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    min="1"
                    placeholder="No time limit"
                    value={formData.timeLimit || ''}
                    onChange={(e) => handleFormChange('timeLimit', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>

                {/* Explanation */}
                <div>
                  <Label htmlFor="explanation">Explanation (shown after answer) - Optional</Label>
                  <Textarea
                    id="explanation"
                    placeholder="Provide explanation for the correct answer..."
                    value={formData.explanation}
                    onChange={(e) => handleFormChange('explanation', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Case Sensitive (for text inputs) */}
                  {(questionType === 'open_short' || questionType === 'fill_blank') && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="caseSensitive"
                        checked={formData.caseSensitive}
                        onCheckedChange={(checked) => handleFormChange('caseSensitive', checked)}
                      />
                      <Label htmlFor="caseSensitive">Case sensitive answers</Label>
                    </div>
                  )}

                  {/* Partial Credit */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowPartialCredit"
                      checked={formData.allowPartialCredit}
                      onCheckedChange={(checked) => handleFormChange('allowPartialCredit', checked)}
                    />
                    <Label htmlFor="allowPartialCredit">Allow partial credit</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {initialData ? 'Update' : 'Save'} Question
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Question Type Components
const QCMSingleQuestion = ({ formData, onChange, errors }) => {
  const addOption = () => {
    onChange('options', [...(formData.options || []), { text: '', isCorrect: false }])
  }

  const updateOption = (index, field, value) => {
    const newOptions = [...(formData.options || [])]
    newOptions[index] = { ...newOptions[index], [field]: value }

    // For single choice, uncheck others when one is selected
    if (field === 'isCorrect' && value) {
      newOptions.forEach((option, i) => {
        if (i !== index) option.isCorrect = false
      })
    }

    onChange('options', newOptions)
    onChange('correctAnswers', newOptions.filter(opt => opt.isCorrect).map(opt => opt.text))
  }

  const removeOption = (index) => {
    const newOptions = formData.options.filter((_, i) => i !== index)
    onChange('options', newOptions)
    onChange('correctAnswers', newOptions.filter(opt => opt.isCorrect).map(opt => opt.text))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Answer Options *</Label>
        <Button type="button" variant="outline" size="sm" onClick={addOption}>
          <Plus className="h-4 w-4 mr-1" />
          Add Option
        </Button>
      </div>

      {errors.options && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {errors.options}
        </p>
      )}

      <div className="space-y-2">
        {(formData.options || []).map((option, index) => (
          <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
            <RadioGroup value={option.isCorrect ? 'correct' : 'incorrect'}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="correct"
                  id={`option-${index}`}
                  checked={option.isCorrect}
                  onClick={() => updateOption(index, 'isCorrect', !option.isCorrect)}
                />
              </div>
            </RadioGroup>
            <Input
              placeholder={`Option ${index + 1}`}
              value={option.text}
              onChange={(e) => updateOption(index, 'text', e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeOption(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {(!formData.options || formData.options.length === 0) && (
        <div className="text-center py-8 text-muted-foreground">
          <CheckSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No options added yet. Click "Add Option" to start.</p>
        </div>
      )}
    </div>
  )
}

const QCMMultipleQuestion = ({ formData, onChange, errors }) => {
  const addOption = () => {
    onChange('options', [...(formData.options || []), { text: '', isCorrect: false }])
  }

  const updateOption = (index, field, value) => {
    const newOptions = [...(formData.options || [])]
    newOptions[index] = { ...newOptions[index], [field]: value }
    onChange('options', newOptions)
    onChange('correctAnswers', newOptions.filter(opt => opt.isCorrect).map(opt => opt.text))
  }

  const removeOption = (index) => {
    const newOptions = formData.options.filter((_, i) => i !== index)
    onChange('options', newOptions)
    onChange('correctAnswers', newOptions.filter(opt => opt.isCorrect).map(opt => opt.text))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Answer Options * (Multiple correct answers allowed)</Label>
        <Button type="button" variant="outline" size="sm" onClick={addOption}>
          <Plus className="h-4 w-4 mr-1" />
          Add Option
        </Button>
      </div>

      <div className="space-y-2">
        {(formData.options || []).map((option, index) => (
          <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
            <Checkbox
              checked={option.isCorrect}
              onCheckedChange={(checked) => updateOption(index, 'isCorrect', checked)}
            />
            <Input
              placeholder={`Option ${index + 1}`}
              value={option.text}
              onChange={(e) => updateOption(index, 'text', e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeOption(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

const OpenShortQuestion = ({ formData, onChange, errors }) => {
  const addAnswer = () => {
    onChange('correctAnswers', [...(formData.correctAnswers || []), ''])
  }

  const updateAnswer = (index, value) => {
    const newAnswers = [...(formData.correctAnswers || [])]
    newAnswers[index] = value
    onChange('correctAnswers', newAnswers)
  }

  const removeAnswer = (index) => {
    onChange('correctAnswers', formData.correctAnswers.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Correct Answers * (Alternative answers)</Label>
        <Button type="button" variant="outline" size="sm" onClick={addAnswer}>
          <Plus className="h-4 w-4 mr-1" />
          Add Answer
        </Button>
      </div>

      <div className="space-y-2">
        {(formData.correctAnswers || ['']).map((answer, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              placeholder={`Correct answer ${index + 1}`}
              value={answer}
              onChange={(e) => updateAnswer(index, e.target.value)}
              className="flex-1"
            />
            {formData.correctAnswers?.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeAnswer(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Students' answers will be compared against all provided correct answers.
        Add multiple answers to accept variations in spelling or phrasing.
      </p>
    </div>
  )
}

const OpenLongQuestion = ({ formData, onChange, errors }) => {
  return (
    <div className="space-y-4">
      <Label>Grading Guidelines</Label>
      <Textarea
        placeholder="Provide guidelines for manually grading this question..."
        value={formData.gradingGuidelines || ''}
        onChange={(e) => onChange('gradingGuidelines', e.target.value)}
        className="min-h-[100px]"
      />
      <p className="text-sm text-muted-foreground">
        Long answer questions require manual grading. Provide clear guidelines
        for consistent evaluation of student responses.
      </p>
    </div>
  )
}

const TrueFalseQuestion = ({ formData, onChange, errors }) => {
  const handleAnswerChange = (value) => {
    onChange('options', [
      { text: 'True', isCorrect: value === 'true' },
      { text: 'False', isCorrect: value === 'false' }
    ])
    onChange('correctAnswers', [value === 'true' ? 'True' : 'False'])
  }

  const currentAnswer = formData.correctAnswers?.[0] === 'True' ? 'true' : 'false'

  return (
    <div className="space-y-4">
      <Label>Correct Answer *</Label>
      <RadioGroup value={currentAnswer} onValueChange={handleAnswerChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id="true" />
          <Label htmlFor="true">True</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="false" />
          <Label htmlFor="false">False</Label>
        </div>
      </RadioGroup>
    </div>
  )
}

const FillBlankQuestion = ({ formData, onChange, errors }) => {
  const addBlank = () => {
    onChange('blanks', [...(formData.blanks || []), { answers: [''] }])
  }

  const updateBlankAnswer = (blankIndex, answerIndex, value) => {
    const newBlanks = [...(formData.blanks || [])]
    newBlanks[blankIndex].answers[answerIndex] = value
    onChange('blanks', newBlanks)

    // Update correctAnswers
    const allAnswers = newBlanks.flatMap(blank => blank.answers.filter(a => a.trim()))
    onChange('correctAnswers', allAnswers)
  }

  return (
    <div className="space-y-4">
      <Label>Question with Blanks *</Label>
      <p className="text-sm text-muted-foreground">
        Use _____ (five underscores) to indicate blanks in your question text above.
        Then provide the correct answers for each blank below.
      </p>

      <div className="flex items-center justify-between">
        <Label>Correct Answers for Blanks</Label>
        <Button type="button" variant="outline" size="sm" onClick={addBlank}>
          <Plus className="h-4 w-4 mr-1" />
          Add Blank
        </Button>
      </div>

      <div className="space-y-4">
        {(formData.blanks || []).map((blank, blankIndex) => (
          <div key={blankIndex} className="p-4 border rounded-lg">
            <Label className="text-sm font-medium">Blank {blankIndex + 1}</Label>
            <div className="space-y-2 mt-2">
              {blank.answers.map((answer, answerIndex) => (
                <Input
                  key={answerIndex}
                  placeholder={`Answer ${answerIndex + 1}`}
                  value={answer}
                  onChange={(e) => updateBlankAnswer(blankIndex, answerIndex, e.target.value)}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newBlanks = [...(formData.blanks || [])]
                  newBlanks[blankIndex].answers.push('')
                  onChange('blanks', newBlanks)
                }}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Alternative Answer
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const MatchingQuestion = ({ formData, onChange, errors }) => {
  const addLeftItem = () => {
    onChange('leftColumn', [...(formData.leftColumn || []), ''])
  }

  const addRightItem = () => {
    onChange('rightColumn', [...(formData.rightColumn || []), ''])
  }

  const updateLeftItem = (index, value) => {
    const newItems = [...(formData.leftColumn || [])]
    newItems[index] = value
    onChange('leftColumn', newItems)
  }

  const updateRightItem = (index, value) => {
    const newItems = [...(formData.rightColumn || [])]
    newItems[index] = value
    onChange('rightColumn', newItems)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Left Column Items</Label>
            <Button type="button" variant="outline" size="sm" onClick={addLeftItem}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {(formData.leftColumn || []).map((item, index) => (
              <Input
                key={index}
                placeholder={`Item ${index + 1}`}
                value={item}
                onChange={(e) => updateLeftItem(index, e.target.value)}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Right Column Items</Label>
            <Button type="button" variant="outline" size="sm" onClick={addRightItem}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {(formData.rightColumn || []).map((item, index) => (
              <Input
                key={index}
                placeholder={`Match ${index + 1}`}
                value={item}
                onChange={(e) => updateRightItem(index, e.target.value)}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Items will be matched by their position (Item 1 matches with Match 1, etc.)
      </p>
    </div>
  )
}

const OrderingQuestion = ({ formData, onChange, errors }) => {
  const addItem = () => {
    onChange('items', [...(formData.items || []), ''])
  }

  const updateItem = (index, value) => {
    const newItems = [...(formData.items || [])]
    newItems[index] = value
    onChange('items', newItems)
  }

  const removeItem = (index) => {
    onChange('items', formData.items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Items to Order * (Enter in correct order)</Label>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="h-4 w-4 mr-1" />
          Add Item
        </Button>
      </div>

      <div className="space-y-2">
        {(formData.items || []).map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="p-2 text-sm font-medium text-muted-foreground">
              {index + 1}.
            </div>
            <Input
              placeholder={`Item ${index + 1}`}
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Students will see these items in random order and must arrange them correctly.
        Enter the items above in the correct sequence.
      </p>
    </div>
  )
}

export default QuestionCreator