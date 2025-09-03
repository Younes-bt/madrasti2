import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useLanguage } from '../../hooks/useLanguage'
import { 
  Plus,
  BookOpen,
  FileText,
  HelpCircle,
  CheckCircle2,
  List,
  Type,
  Upload,
  Save,
  Eye,
  Settings,
  Copy,
  Trash2,
  Edit,
  GripVertical,
  Clock,
  Users,
  Target,
  Award,
  AlertCircle,
  Calendar,
  MapPin,
  Star,
  Zap
} from 'lucide-react'

const AssignmentBuilder = () => {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(1) // 1: Basic Info, 2: Questions, 3: Settings, 4: Review
  const [assignmentData, setAssignmentData] = useState({
    title: '',
    description: '',
    subject: '',
    class: '',
    type: 'QCM', // QCM, OPEN, MIXED, BOOK
    difficulty: 'medium', // easy, medium, hard
    duration_minutes: 60,
    total_points: 0,
    due_date: '',
    attempts_allowed: 1,
    randomize_questions: false,
    show_results_immediately: false,
    instructions: '',
    questions: []
  })

  const questionTypes = [
    {
      id: 'qcm_single',
      name: t('assignments.qcmSingle'),
      description: t('assignments.qcmSingleDesc'),
      icon: CheckCircle2,
      auto_gradable: true,
      points_default: 2
    },
    {
      id: 'qcm_multiple',
      name: t('assignments.qcmMultiple'),
      description: t('assignments.qcmMultipleDesc'),
      icon: List,
      auto_gradable: true,
      points_default: 3
    },
    {
      id: 'open_text',
      name: t('assignments.openText'),
      description: t('assignments.openTextDesc'),
      icon: Type,
      auto_gradable: false,
      points_default: 5
    },
    {
      id: 'file_upload',
      name: t('assignments.fileUpload'),
      description: t('assignments.fileUploadDesc'),
      icon: Upload,
      auto_gradable: false,
      points_default: 10
    },
    {
      id: 'true_false',
      name: t('assignments.trueFalse'),
      description: t('assignments.trueFalseDesc'),
      icon: HelpCircle,
      auto_gradable: true,
      points_default: 1
    }
  ]

  const subjects = [
    { id: 'math', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'arabic', name: 'Arabic' },
    { id: 'french', name: 'French' },
    { id: 'english', name: 'English' },
    { id: 'history', name: 'History' },
    { id: 'geography', name: 'Geography' }
  ]

  const classes = [
    { id: '1ere_c', name: '1ère Année C', students: 24 },
    { id: '1ere_b', name: '1ère Année B', students: 26 },
    { id: '2eme_a', name: '2ème Année A', students: 22 },
    { id: '3eme_c', name: '3ème Année C', students: 20 }
  ]

  const steps = [
    { id: 1, name: t('assignments.basicInfo'), completed: false },
    { id: 2, name: t('assignments.questions'), completed: false },
    { id: 3, name: t('assignments.settings'), completed: false },
    { id: 4, name: t('assignments.review'), completed: false }
  ]

  const addQuestion = (type) => {
    const questionType = questionTypes.find(qt => qt.id === type)
    const newQuestion = {
      id: Date.now(),
      type: type,
      question_text: '',
      points: questionType?.points_default || 1,
      required: true,
      order: assignmentData.questions.length + 1,
      // Type-specific properties
      ...(type === 'qcm_single' && {
        options: [
          { id: 1, text: '', is_correct: false },
          { id: 2, text: '', is_correct: false },
          { id: 3, text: '', is_correct: false },
          { id: 4, text: '', is_correct: false }
        ],
        explanation: ''
      }),
      ...(type === 'qcm_multiple' && {
        options: [
          { id: 1, text: '', is_correct: false },
          { id: 2, text: '', is_correct: false },
          { id: 3, text: '', is_correct: false },
          { id: 4, text: '', is_correct: false }
        ],
        min_correct: 1,
        explanation: ''
      }),
      ...(type === 'open_text' && {
        max_length: 500,
        sample_answer: '',
        grading_criteria: []
      }),
      ...(type === 'file_upload' && {
        allowed_formats: ['pdf', 'doc', 'docx', 'jpg', 'png'],
        max_file_size: 10, // MB
        instructions: ''
      }),
      ...(type === 'true_false' && {
        correct_answer: true,
        explanation: ''
      })
    }

    setAssignmentData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      total_points: prev.total_points + newQuestion.points
    }))
  }

  const removeQuestion = (questionId) => {
    const questionToRemove = assignmentData.questions.find(q => q.id === questionId)
    setAssignmentData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId),
      total_points: prev.total_points - (questionToRemove?.points || 0)
    }))
  }

  const updateQuestion = (questionId, updates) => {
    setAssignmentData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }))
  }

  const reorderQuestions = (dragIndex, dropIndex) => {
    const dragQuestion = assignmentData.questions[dragIndex]
    const newQuestions = [...assignmentData.questions]
    newQuestions.splice(dragIndex, 1)
    newQuestions.splice(dropIndex, 0, dragQuestion)
    
    // Update order numbers
    const reorderedQuestions = newQuestions.map((q, index) => ({
      ...q,
      order: index + 1
    }))

    setAssignmentData(prev => ({
      ...prev,
      questions: reorderedQuestions
    }))
  }

  const getAssignmentTypeConfig = (type) => {
    const configs = {
      QCM: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
      OPEN: { color: 'bg-green-100 text-green-800', icon: Type },
      MIXED: { color: 'bg-purple-100 text-purple-800', icon: List },
      BOOK: { color: 'bg-orange-100 text-orange-800', icon: BookOpen }
    }
    return configs[type] || configs.QCM
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    }
    return colors[difficulty] || colors.medium
  }

  const saveAssignment = (publish = false) => {
    const assignmentToSave = {
      ...assignmentData,
      status: publish ? 'published' : 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('Save assignment:', assignmentToSave)
    // API call to save assignment
  }

  const previewAssignment = () => {
    console.log('Preview assignment:', assignmentData)
    // Open preview modal
  }

  const duplicateAssignment = () => {
    console.log('Duplicate assignment')
    // Create copy of assignment
  }

  const getAutoGradableCount = () => {
    return assignmentData.questions.filter(q => {
      const questionType = questionTypes.find(qt => qt.id === q.type)
      return questionType?.auto_gradable
    }).length
  }

  const estimatedGradingTime = () => {
    const manualQuestions = assignmentData.questions.filter(q => {
      const questionType = questionTypes.find(qt => qt.id === q.type)
      return !questionType?.auto_gradable
    }).length
    return manualQuestions * 2 // 2 minutes per manual question
  }

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              {t('assignments.assignmentBuilder')}
            </CardTitle>
            <CardDescription>
              {t('assignments.builderDescription')}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={previewAssignment}>
              <Eye className="h-4 w-4 mr-1" />
              {t('common.preview')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => saveAssignment(false)}>
              <Save className="h-4 w-4 mr-1" />
              {t('assignments.saveDraft')}
            </Button>
            <Button size="sm" onClick={() => saveAssignment(true)}>
              <Zap className="h-4 w-4 mr-1" />
              {t('assignments.publish')}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <Button
                variant={currentStep === step.id ? 'default' : step.completed ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setCurrentStep(step.id)}
                className="flex items-center gap-2"
              >
                <span className="w-6 h-6 rounded-full bg-current flex items-center justify-center text-xs">
                  {step.completed ? <CheckCircle2 className="h-3 w-3" /> : step.id}
                </span>
                <span className="hidden sm:inline">{step.name}</span>
              </Button>
              {index < steps.length - 1 && (
                <div className="w-8 h-px bg-border mx-2"></div>
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">{t('assignments.basicInfo')}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('assignments.title')}</label>
                <input
                  type="text"
                  value={assignmentData.title}
                  onChange={(e) => setAssignmentData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={t('assignments.titlePlaceholder')}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('assignments.type')}</label>
                <select
                  value={assignmentData.type}
                  onChange={(e) => setAssignmentData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="QCM">{t('assignments.qcmType')}</option>
                  <option value="OPEN">{t('assignments.openType')}</option>
                  <option value="MIXED">{t('assignments.mixedType')}</option>
                  <option value="BOOK">{t('assignments.bookType')}</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('assignments.description')}</label>
              <textarea
                value={assignmentData.description}
                onChange={(e) => setAssignmentData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t('assignments.descriptionPlaceholder')}
                className="w-full px-3 py-2 border rounded-md resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('assignments.subject')}</label>
                <select
                  value={assignmentData.subject}
                  onChange={(e) => setAssignmentData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">{t('common.select')}</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('assignments.targetClass')}</label>
                <select
                  value={assignmentData.class}
                  onChange={(e) => setAssignmentData(prev => ({ ...prev, class: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">{t('common.select')}</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.students} {t('student.students')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('assignments.difficulty')}</label>
                <select
                  value={assignmentData.difficulty}
                  onChange={(e) => setAssignmentData(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="easy">{t('assignments.easy')}</option>
                  <option value="medium">{t('assignments.medium')}</option>
                  <option value="hard">{t('assignments.hard')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('assignments.duration')}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={assignmentData.duration_minutes}
                    onChange={(e) => setAssignmentData(prev => ({ 
                      ...prev, 
                      duration_minutes: parseInt(e.target.value) || 0 
                    }))}
                    className="flex-1 px-3 py-2 border rounded-md"
                    min="1"
                  />
                  <span className="text-sm text-muted-foreground">{t('assignments.minutes')}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('assignments.dueDate')}</label>
                <input
                  type="datetime-local"
                  value={assignmentData.due_date}
                  onChange={(e) => setAssignmentData(prev => ({ ...prev, due_date: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setCurrentStep(2)}>
                {t('common.next')} - {t('assignments.questions')}
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Questions */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">{t('assignments.questions')}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {assignmentData.questions.length} {t('assignments.questions')}
                </Badge>
                <Badge variant="outline">
                  {assignmentData.total_points} {t('assignments.points')}
                </Badge>
                {getAutoGradableCount() > 0 && (
                  <Badge className="bg-green-100 text-green-800">
                    <Zap className="h-3 w-3 mr-1" />
                    {getAutoGradableCount()} {t('assignments.autoGradable')}
                  </Badge>
                )}
              </div>
            </div>

            {/* Question Types */}
            <div className="grid grid-cols-5 gap-2">
              {questionTypes.map((type) => {
                const Icon = type.icon
                return (
                  <Button
                    key={type.id}
                    variant="outline"
                    size="sm"
                    onClick={() => addQuestion(type.id)}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{type.name}</span>
                    {type.auto_gradable && (
                      <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0">
                        <Zap className="h-2 w-2" />
                      </Badge>
                    )}
                  </Button>
                )
              })}
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              {assignmentData.questions.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <HelpCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">{t('assignments.noQuestionsYet')}</p>
                  <p className="text-sm text-muted-foreground">{t('assignments.addQuestionHint')}</p>
                </div>
              ) : (
                assignmentData.questions.map((question, index) => {
                  const questionType = questionTypes.find(qt => qt.id === question.type)
                  const Icon = questionType?.icon || HelpCircle

                  return (
                    <div key={question.id} className="border rounded-lg p-4 bg-card">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                          <Badge variant="outline">{index + 1}</Badge>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-blue-500" />
                              <span className="font-medium text-sm">{questionType?.name}</span>
                              {questionType?.auto_gradable && (
                                <Badge className="bg-green-100 text-green-800">
                                  <Zap className="h-3 w-3 mr-1" />
                                  {t('assignments.autoGrad')}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={question.points}
                                  onChange={(e) => updateQuestion(question.id, { 
                                    points: parseInt(e.target.value) || 1 
                                  })}
                                  className="w-12 px-1 py-1 text-xs border rounded"
                                  min="1"
                                />
                                <span className="text-xs text-muted-foreground">pts</span>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeQuestion(question.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={question.question_text}
                              onChange={(e) => updateQuestion(question.id, { 
                                question_text: e.target.value 
                              })}
                              placeholder={t('assignments.questionTextPlaceholder')}
                              className="w-full px-3 py-2 border rounded-md"
                            />
                            
                            {/* Question Type Specific Fields */}
                            {(question.type === 'qcm_single' || question.type === 'qcm_multiple') && (
                              <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                  {t('assignments.options')}
                                </label>
                                {question.options?.map((option, optionIndex) => (
                                  <div key={option.id} className="flex items-center gap-2">
                                    <input
                                      type={question.type === 'qcm_single' ? 'radio' : 'checkbox'}
                                      name={`question_${question.id}`}
                                      checked={option.is_correct}
                                      onChange={(e) => {
                                        const newOptions = [...question.options]
                                        if (question.type === 'qcm_single') {
                                          // Single choice - uncheck others
                                          newOptions.forEach((opt, idx) => {
                                            opt.is_correct = idx === optionIndex
                                          })
                                        } else {
                                          // Multiple choice
                                          newOptions[optionIndex].is_correct = e.target.checked
                                        }
                                        updateQuestion(question.id, { options: newOptions })
                                      }}
                                      className="rounded"
                                    />
                                    <input
                                      type="text"
                                      value={option.text}
                                      onChange={(e) => {
                                        const newOptions = [...question.options]
                                        newOptions[optionIndex].text = e.target.value
                                        updateQuestion(question.id, { options: newOptions })
                                      }}
                                      placeholder={t('assignments.optionText')}
                                      className="flex-1 px-2 py-1 text-sm border rounded"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {question.type === 'open_text' && (
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-xs font-medium text-muted-foreground">
                                    {t('assignments.maxLength')}
                                  </label>
                                  <input
                                    type="number"
                                    value={question.max_length}
                                    onChange={(e) => updateQuestion(question.id, { 
                                      max_length: parseInt(e.target.value) || 500 
                                    })}
                                    className="w-full px-2 py-1 text-sm border rounded"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-muted-foreground">
                                    {t('assignments.sampleAnswer')}
                                  </label>
                                  <input
                                    type="text"
                                    value={question.sample_answer}
                                    onChange={(e) => updateQuestion(question.id, { 
                                      sample_answer: e.target.value 
                                    })}
                                    placeholder={t('assignments.sampleAnswerPlaceholder')}
                                    className="w-full px-2 py-1 text-sm border rounded"
                                  />
                                </div>
                              </div>
                            )}
                            
                            {question.type === 'true_false' && (
                              <div className="flex items-center gap-4">
                                <label className="text-xs font-medium text-muted-foreground">
                                  {t('assignments.correctAnswer')}:
                                </label>
                                <div className="flex gap-2">
                                  <label className="flex items-center gap-1">
                                    <input
                                      type="radio"
                                      name={`tf_${question.id}`}
                                      checked={question.correct_answer === true}
                                      onChange={() => updateQuestion(question.id, { correct_answer: true })}
                                    />
                                    <span className="text-sm">{t('assignments.true')}</span>
                                  </label>
                                  <label className="flex items-center gap-1">
                                    <input
                                      type="radio"
                                      name={`tf_${question.id}`}
                                      checked={question.correct_answer === false}
                                      onChange={() => updateQuestion(question.id, { correct_answer: false })}
                                    />
                                    <span className="text-sm">{t('assignments.false')}</span>
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                {t('common.previous')}
              </Button>
              <Button onClick={() => setCurrentStep(3)} disabled={assignmentData.questions.length === 0}>
                {t('common.next')} - {t('assignments.settings')}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Settings */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">{t('assignments.settings')}</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">{t('assignments.attemptSettings')}</h4>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('assignments.attemptsAllowed')}</label>
                  <select
                    value={assignmentData.attempts_allowed}
                    onChange={(e) => setAssignmentData(prev => ({ 
                      ...prev, 
                      attempts_allowed: parseInt(e.target.value) 
                    }))}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value={1}>1 {t('assignments.attempt')}</option>
                    <option value={2}>2 {t('assignments.attempts')}</option>
                    <option value={3}>3 {t('assignments.attempts')}</option>
                    <option value={-1}>{t('assignments.unlimited')}</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="randomize"
                    checked={assignmentData.randomize_questions}
                    onChange={(e) => setAssignmentData(prev => ({ 
                      ...prev, 
                      randomize_questions: e.target.checked 
                    }))}
                    className="rounded"
                  />
                  <label htmlFor="randomize" className="text-sm">
                    {t('assignments.randomizeQuestions')}
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="show_results"
                    checked={assignmentData.show_results_immediately}
                    onChange={(e) => setAssignmentData(prev => ({ 
                      ...prev, 
                      show_results_immediately: e.target.checked 
                    }))}
                    className="rounded"
                  />
                  <label htmlFor="show_results" className="text-sm">
                    {t('assignments.showResultsImmediately')}
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm">{t('assignments.gradingInfo')}</h4>
                
                <div className="space-y-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('assignments.autoGradableQuestions')}</span>
                    <Badge className="bg-green-100 text-green-800">
                      <Zap className="h-3 w-3 mr-1" />
                      {getAutoGradableCount()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('assignments.manualGradingQuestions')}</span>
                    <Badge variant="outline">
                      {assignmentData.questions.length - getAutoGradableCount()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('assignments.estimatedGradingTime')}</span>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {estimatedGradingTime()}min
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('assignments.instructions')}</label>
              <textarea
                value={assignmentData.instructions}
                onChange={(e) => setAssignmentData(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder={t('assignments.instructionsPlaceholder')}
                className="w-full px-3 py-2 border rounded-md resize-none"
                rows={3}
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                {t('common.previous')}
              </Button>
              <Button onClick={() => setCurrentStep(4)}>
                {t('common.next')} - {t('assignments.review')}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">{t('assignments.review')}</h3>
            
            {/* Assignment Overview */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">{t('assignments.assignmentDetails')}</h4>
                  <div className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t('assignments.title')}</span>
                      <span className="text-sm font-medium">{assignmentData.title || t('assignments.untitled')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t('assignments.type')}</span>
                      <Badge className={getAssignmentTypeConfig(assignmentData.type).color}>
                        {assignmentData.type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t('assignments.difficulty')}</span>
                      <Badge className={getDifficultyColor(assignmentData.difficulty)}>
                        {t(`assignments.${assignmentData.difficulty}`)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t('assignments.duration')}</span>
                      <span className="text-sm font-medium">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {assignmentData.duration_minutes}min
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">{t('assignments.statistics')}</h4>
                  <div className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t('assignments.totalQuestions')}</span>
                      <span className="text-sm font-medium">{assignmentData.questions.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t('assignments.totalPoints')}</span>
                      <span className="text-sm font-medium">
                        <Target className="h-3 w-3 inline mr-1" />
                        {assignmentData.total_points}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t('assignments.autoGradable')}</span>
                      <Badge className="bg-green-100 text-green-800">
                        <Zap className="h-3 w-3 mr-1" />
                        {getAutoGradableCount()}/{assignmentData.questions.length}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions Summary */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">{t('assignments.questionsSummary')}</h4>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {assignmentData.questions.map((question, index) => {
                  const questionType = questionTypes.find(qt => qt.id === question.type)
                  const Icon = questionType?.icon || HelpCircle
                  
                  return (
                    <div key={question.id} className="flex items-center gap-3 p-2 border rounded text-sm">
                      <Badge variant="outline">{index + 1}</Badge>
                      <Icon className="h-4 w-4 text-blue-500" />
                      <span className="flex-1 truncate">
                        {question.question_text || t('assignments.questionNotSet')}
                      </span>
                      <Badge variant="outline">{question.points}pts</Badge>
                      {questionType?.auto_gradable && (
                        <Badge className="bg-green-100 text-green-800">
                          <Zap className="h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Validation Warnings */}
            {(!assignmentData.title || !assignmentData.subject || !assignmentData.class || assignmentData.questions.length === 0) && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">{t('assignments.validationWarnings')}</span>
                </div>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {!assignmentData.title && <li>• {t('assignments.titleRequired')}</li>}
                  {!assignmentData.subject && <li>• {t('assignments.subjectRequired')}</li>}
                  {!assignmentData.class && <li>• {t('assignments.classRequired')}</li>}
                  {assignmentData.questions.length === 0 && <li>• {t('assignments.questionsRequired')}</li>}
                </ul>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                {t('common.previous')}
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => saveAssignment(false)}>
                  <Save className="h-4 w-4 mr-1" />
                  {t('assignments.saveDraft')}
                </Button>
                <Button 
                  onClick={() => saveAssignment(true)}
                  disabled={!assignmentData.title || !assignmentData.subject || !assignmentData.class || assignmentData.questions.length === 0}
                >
                  <Zap className="h-4 w-4 mr-1" />
                  {t('assignments.publishAssignment')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AssignmentBuilder