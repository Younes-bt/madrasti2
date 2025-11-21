import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { TeacherPageLayout } from '../../components/teacher/layout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Switch } from '../../components/ui/switch'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import { Checkbox } from '../../components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { exerciseService } from '../../services/exercises'
import lessonsService from '../../services/lessons'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  BookOpen,
  Target,
  Clock,
  Settings,
  Award,
  HelpCircle,
  CheckCircle,
  X,
  Brain,
  PlayCircle,
  FileText,
  Loader2,
  Image as ImageIcon
} from 'lucide-react'
import { cn } from '../../lib/utils'

const EditLessonExercisePage = () => {
  const { t, isRTL } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id: exerciseId } = useParams()

  const [exercise, setExercise] = useState(null)
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [questions, setQuestions] = useState([])
  const [removedQuestionIds, setRemovedQuestionIds] = useState([])

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    title_arabic: '',
    description: '',
    instructions: '',
    exercise_format: 'mixed',
    difficulty_level: 'beginner',
    estimated_duration: '',
    time_limit: '',
    is_timed: false,
    total_points: '0.00',
    auto_grade: true,
    randomize_questions: false,
    show_results_immediately: true,
    allow_multiple_attempts: true,
    max_attempts: '0',
    is_active: true,
    is_published: true,
    available_from: '',
    available_until: '',
    // Reward settings
    attempt_points: '2',
    completion_points: '5',
    completion_coins: '1',
    perfect_score_bonus: '10',
    high_score_bonus: '5',
    improvement_bonus: '3',
    base_xp: '5',
    bonus_xp: '10',
    difficulty_multiplier: '1.00'
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (exerciseId && user) {
      loadExerciseData()
    }
  }, [exerciseId, user])

  // Auto-calculate total points from questions
  useEffect(() => {
    const total = questions.reduce((sum, q) => sum + parseFloat(q.points || 0), 0)
    setFormData(prev => ({ ...prev, total_points: total.toFixed(2) }))
  }, [questions])

  const loadExerciseData = async () => {
    try {
      setDataLoading(true)
      console.log('Loading exercise with ID:', exerciseId)

      // Load exercise details
      const exerciseResult = await exerciseService.getExerciseById(exerciseId)
      console.log('Exercise result:', exerciseResult)

      if (exerciseResult.success || exerciseResult.id) {
        const exerciseData = exerciseResult.data || exerciseResult
        setExercise(exerciseData)

        // Populate form data
        setFormData({
          title: exerciseData.title || '',
          title_arabic: exerciseData.title_arabic || '',
          description: exerciseData.description || '',
          instructions: exerciseData.instructions || '',
          exercise_format: exerciseData.exercise_format || 'mixed',
          difficulty_level: exerciseData.difficulty_level || 'beginner',
          estimated_duration: exerciseData.estimated_duration?.toString() || '',
          time_limit: exerciseData.time_limit?.toString() || '',
          is_timed: exerciseData.is_timed || false,
          total_points: exerciseData.total_points?.toString() || '0.00',
          auto_grade: exerciseData.auto_grade !== false,
          randomize_questions: exerciseData.randomize_questions || false,
          show_results_immediately: exerciseData.show_results_immediately !== false,
          allow_multiple_attempts: exerciseData.allow_multiple_attempts !== false,
          max_attempts: exerciseData.max_attempts?.toString() || '0',
          is_active: exerciseData.is_active !== false,
          is_published: exerciseData.is_published !== false,
          available_from: exerciseData.available_from || '',
          available_until: exerciseData.available_until || '',
          // Reward settings
          attempt_points: exerciseData.reward_config?.attempt_points?.toString() || '2',
          completion_points: exerciseData.reward_config?.completion_points?.toString() || '5',
          completion_coins: exerciseData.reward_config?.completion_coins?.toString() || '1',
          perfect_score_bonus: exerciseData.reward_config?.perfect_score_bonus?.toString() || '10',
          high_score_bonus: exerciseData.reward_config?.high_score_bonus?.toString() || '5',
          improvement_bonus: exerciseData.reward_config?.improvement_bonus?.toString() || '3',
          base_xp: exerciseData.reward_config?.base_xp?.toString() || '5',
          bonus_xp: exerciseData.reward_config?.bonus_xp?.toString() || '10',
          difficulty_multiplier: exerciseData.reward_config?.difficulty_multiplier?.toString() || '1.00'
        })

        // Load lesson details
        if (exerciseData.lesson) {
          const lessonResult = await lessonsService.getLessonById(exerciseData.lesson)
          if (lessonResult.success || lessonResult.id) {
            setLesson(lessonResult.data || lessonResult)
          }
        }

        // Load exercise questions
        const questionsResult = await exerciseService.getExerciseQuestions(exerciseId)
        if (questionsResult.success) {
          const formattedQuestions = (questionsResult.data || []).map((q, index) => ({
            ...q,
            points: (q.points ?? '1.00').toString(),
            choices: q.choices || [],
            image_file: null,
            image_preview: null,
            existing_image_url: q.question_image || q.question_image_url || null,
            remove_image: false
          }))
          setQuestions(formattedQuestions)
          setRemovedQuestionIds([])
        }
      } else {
        console.error('Failed to load exercise:', exerciseResult)
        toast.error(exerciseResult.error || 'Failed to load exercise details')
        navigate('/teacher/content/lesson-exercises')
        return
      }
    } catch (error) {
      console.error('Error loading exercise data:', error)
      toast.error('Failed to load exercise')
      setDataLoading(false)
      navigate('/teacher/content/lesson-exercises')
      return
    }

    setDataLoading(false)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  // Question handlers
  const addQuestion = () => {
    setQuestions(prev => [...prev, {
      question_text: '',
      question_type: 'qcm_single',
      points: '1.00',
      order: prev.length,
      choices: [{ choice_text: '', is_correct: true }, { choice_text: '', is_correct: false }],
      image_file: null,
      image_preview: null,
      existing_image_url: null,
      remove_image: false
    }])
  }

  const removeQuestion = (index) => {
    setQuestions(prev => {
      const updated = [...prev]
      const removed = updated[index]
      if (removed?.image_preview) {
        URL.revokeObjectURL(removed.image_preview)
      }
      updated.splice(index, 1)
      if (removed?.id) {
        setRemovedQuestionIds(prevIds => [...prevIds, removed.id])
      }
      return updated
    })
  }

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions]
    newQuestions[index][field] = value
    // Reset choices if question type changes
    if (field === 'question_type') {
      if (value === 'open_long' || value === 'open_short') {
        newQuestions[index].choices = []
      } else if (!newQuestions[index].choices || newQuestions[index].choices.length === 0) {
        newQuestions[index].choices = [{ choice_text: '', is_correct: true }, { choice_text: '', is_correct: false }]
      }
    }
    setQuestions(newQuestions)
  }

  const handleQuestionImageChange = (index, file) => {
    if (!file) return
    setQuestions(prev => prev.map((question, idx) => {
      if (idx !== index) return question
      if (question.image_preview) {
        URL.revokeObjectURL(question.image_preview)
      }
      return {
        ...question,
        image_file: file,
        image_preview: URL.createObjectURL(file),
        remove_image: false
      }
    }))
  }

  const handleRemoveQuestionImage = (index) => {
    setQuestions(prev => prev.map((question, idx) => {
      if (idx !== index) return question
      if (question.image_preview) {
        URL.revokeObjectURL(question.image_preview)
      }
      return {
        ...question,
        image_file: null,
        image_preview: null,
        existing_image_url: null,
        remove_image: question.id ? true : false
      }
    }))
  }

  const addChoice = (qIndex) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].choices.push({ choice_text: '', is_correct: false })
    setQuestions(newQuestions)
  }

  const removeChoice = (qIndex, cIndex) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].choices = newQuestions[qIndex].choices.filter((_, i) => i !== cIndex)
    setQuestions(newQuestions)
  }

  const handleChoiceChange = (qIndex, cIndex, value) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].choices[cIndex].choice_text = value
    setQuestions(newQuestions)
  }

  const handleCorrectChoiceChange = (qIndex, cIndex, type) => {
    const newQuestions = [...questions]
    if (type === 'qcm_single' || type === 'true_false') {
      newQuestions[qIndex].choices.forEach((choice, i) => {
        choice.is_correct = i === cIndex
      })
    } else { // qcm_multiple
      newQuestions[qIndex].choices[cIndex].is_correct = !newQuestions[qIndex].choices[cIndex].is_correct
    }
    setQuestions(newQuestions)
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (questions.length === 0) newErrors.questions = 'At least one question is required'

    questions.forEach((q, i) => {
      if (!q.question_text.trim()) newErrors[`q_${i}_text`] = 'Question text is required'
      if (['qcm_single', 'qcm_multiple', 'true_false'].includes(q.question_type)) {
        if (!q.choices.some(c => c.is_correct)) newErrors[`q_${i}_choice`] = 'At least one correct choice is required'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix the form errors')
      return
    }
    setLoading(true)

    try {
      const exerciseData = {
        lesson: lesson?.id
          ? parseInt(lesson.id)
          : exercise?.lesson
            ? parseInt(exercise.lesson)
            : formData.lesson
              ? parseInt(formData.lesson)
              : undefined,
        title: formData.title.trim(),
        title_arabic: formData.title_arabic.trim() || null,
        description: formData.description.trim(),
        instructions: formData.instructions.trim() || '',
        exercise_format: formData.exercise_format,
        difficulty_level: formData.difficulty_level,
        estimated_duration: formData.estimated_duration ? parseInt(formData.estimated_duration) : null,
        time_limit: formData.is_timed && formData.time_limit ? parseInt(formData.time_limit) : null,
        is_timed: formData.is_timed,
        total_points: parseFloat(formData.total_points),
        auto_grade: formData.auto_grade,
        randomize_questions: formData.randomize_questions,
        show_results_immediately: formData.show_results_immediately,
        allow_multiple_attempts: formData.allow_multiple_attempts,
        max_attempts: formData.max_attempts ? parseInt(formData.max_attempts) : 0,
        is_active: formData.is_active,
        is_published: formData.is_published,
        available_from: formData.available_from || null,
        available_until: formData.available_until || null,
        reward_config: {
          attempt_points: parseInt(formData.attempt_points),
          completion_points: parseInt(formData.completion_points),
          completion_coins: parseInt(formData.completion_coins),
          perfect_score_bonus: parseInt(formData.perfect_score_bonus),
          high_score_bonus: parseInt(formData.high_score_bonus),
          improvement_bonus: parseInt(formData.improvement_bonus),
          base_xp: parseInt(formData.base_xp),
          bonus_xp: parseInt(formData.bonus_xp),
          difficulty_multiplier: parseFloat(formData.difficulty_multiplier)
        }
      }

      // Update exercise
      const exerciseResult = await exerciseService.updateExercise(exerciseId, exerciseData)

      if (exerciseResult.success) {
        const createPromises = []
        const updatePromises = []
        const exerciseIdentifier = exercise?.id ?? parseInt(exerciseId, 10)

        questions.forEach((q, index) => {
          const basePayload = {
            question_text: q.question_text,
            question_type: q.question_type,
            points: parseFloat(q.points || 0),
            order: index,
            choices: Array.isArray(q.choices)
              ? q.choices.map(choice => ({
                  choice_text: choice.choice_text,
                  is_correct: choice.is_correct
                }))
              : []
          }

          if (q.image_file) {
            basePayload.question_image = q.image_file
          }

          if (q.remove_image) {
            basePayload.remove_image = true
          }

          if (q.id) {
            // Include exercise field for validation (backend will ignore it during update)
            basePayload.exercise = exerciseIdentifier
            updatePromises.push(exerciseService.updateQuestion(q.id, basePayload))
          } else {
            basePayload.exercise = exerciseIdentifier
            createPromises.push(exerciseService.createQuestion(basePayload))
          }
        })

        const deletePromises = removedQuestionIds.map((questionId) =>
          exerciseService.deleteQuestion(questionId)
        )

        await Promise.all([...createPromises, ...updatePromises, ...deletePromises])
        toast.success('Exercise updated successfully!')

        // Navigate back to lesson exercises or exercise list
        if (lesson) {
          navigate(`/teacher/content/lessons/${lesson.id}/exercises`)
        } else {
          navigate('/teacher/content/lesson-exercises')
        }
      } else {
        toast.error(exerciseResult.error || 'Failed to update exercise')
      }
    } catch (error) {
      console.error('Error updating exercise:', error)
      toast.error('Failed to update exercise')
    } finally {
      setLoading(false)
    }
  }

  const getFormatIcon = (format) => {
    switch (format) {
      case 'qcm_only': return <Target className="h-4 w-4" />
      case 'open_only': return <FileText className="h-4 w-4" />
      case 'practical': return <Brain className="h-4 w-4" />
      case 'interactive': return <PlayCircle className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600'
      case 'intermediate': return 'text-yellow-600'
      case 'advanced': return 'text-orange-600'
      case 'expert': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  if (dataLoading) {
    return (
      <TeacherPageLayout
        title="Edit Exercise"
        subtitle="Loading exercise details..."
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" />
            <p className="text-muted-foreground">Loading exercise...</p>
          </div>
        </div>
      </TeacherPageLayout>
    )
  }

  if (!exercise) {
    return (
      <TeacherPageLayout
        title="Edit Exercise"
        subtitle="Exercise not found"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Exercise not found</p>
              <Button onClick={() => navigate('/teacher/content/lesson-exercises')} variant="outline">
                Back to Exercises
              </Button>
            </div>
          </CardContent>
        </Card>
      </TeacherPageLayout>
    )
  }

  return (
    <TeacherPageLayout
      title={`Edit Exercise: ${exercise.title}`}
      subtitle="Update exercise details and questions"
      actions={[
        <Button key="back" variant="outline" onClick={() => {
          if (lesson) {
            navigate(`/teacher/content/lessons/${lesson.id}/exercises`)
          } else {
            navigate('/teacher/content/lesson-exercises')
          }
        }}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lesson Info */}
            {lesson && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-800">Exercise for lesson:</p>
                      <p className="text-sm text-blue-700">{lesson.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Exercise Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter exercise title"
                      className={errors.title ? 'border-destructive' : ''}
                    />
                    {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
                  </div>
                  <div>
                    <Label htmlFor="title_arabic">Arabic Title</Label>
                    <Input
                      id="title_arabic"
                      value={formData.title_arabic}
                      onChange={(e) => handleInputChange('title_arabic', e.target.value)}
                      placeholder="عنوان التمرين"
                      dir="rtl"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what this exercise covers"
                    rows={3}
                    className={errors.description ? 'border-destructive' : ''}
                  />
                  {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
                </div>
                <div>
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={formData.instructions}
                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                    placeholder="Provide instructions for students"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Questions Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Questions
                  </div>
                  <Badge variant="secondary">Total: {formData.total_points} points</Badge>
                </CardTitle>
                {errors.questions && <p className="text-sm text-destructive mt-2">{errors.questions}</p>}
              </CardHeader>
              <CardContent className="space-y-4">
                {questions.map((q, qIndex) => (
                  <motion.div
                    key={qIndex}
                    layout
                    className="border p-4 rounded-lg space-y-4 bg-background/50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`q_text_${qIndex}`}>Question #{qIndex + 1}</Label>
                        <Textarea
                          id={`q_text_${qIndex}`}
                          value={q.question_text}
                          onChange={(e) => handleQuestionChange(qIndex, 'question_text', e.target.value)}
                          placeholder="Enter your question"
                          className={errors[`q_${qIndex}_text`] ? 'border-destructive' : ''}
                        />
                        {errors[`q_${qIndex}_text`] && (
                          <p className="text-sm text-destructive mt-1">{errors[`q_${qIndex}_text`]}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeQuestion(qIndex)}
                        className="ml-2 shrink-0"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`q_type_${qIndex}`}>Question Type</Label>
                        <Select
                          value={q.question_type}
                          onValueChange={(v) => handleQuestionChange(qIndex, 'question_type', v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="qcm_single">Single Choice</SelectItem>
                            <SelectItem value="qcm_multiple">Multiple Choice</SelectItem>
                            <SelectItem value="true_false">True/False</SelectItem>
                            <SelectItem value="open_short">Short Answer</SelectItem>
                            <SelectItem value="open_long">Long Answer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`q_points_${qIndex}`}>Points</Label>
                        <Input
                          id={`q_points_${qIndex}`}
                          type="number"
                          step="0.01"
                          value={q.points}
                          onChange={(e) => handleQuestionChange(qIndex, 'points', e.target.value)}
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 pt-2">
                      {(q.image_preview || q.existing_image_url) && (
                        <div className="max-w-xs rounded-md border overflow-hidden">
                          <img
                            src={q.image_preview || q.existing_image_url}
                            alt={t('lessons.imagePreviewAlt', 'Question image preview')}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}
                      <input
                        id={`question-image-${q.id ?? qIndex}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => handleQuestionImageChange(qIndex, event.target.files?.[0] || null)}
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById(`question-image-${q.id ?? qIndex}`)?.click()}
                          className="flex items-center gap-2"
                        >
                          <ImageIcon className="h-4 w-4" />
                          {q.image_preview || q.existing_image_url
                            ? (t('lessons.changeImage', 'Change image'))
                            : (t('lessons.addImage', 'Add image'))}
                        </Button>
                        {(q.image_preview || q.existing_image_url) && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveQuestionImage(qIndex)}
                            className="flex items-center gap-2 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            {t('lessons.removeImage', 'Remove image')}
                          </Button>
                        )}
                      </div>
                    </div>
                    {['qcm_single', 'qcm_multiple', 'true_false'].includes(q.question_type) && (
                      <div className="space-y-3 pt-2">
                        <Label>Choices</Label>
                        {errors[`q_${qIndex}_choice`] && (
                          <p className="text-sm text-destructive">{errors[`q_${qIndex}_choice`]}</p>
                        )}
                        <div className="space-y-2">
                          {q.choices?.map((c, cIndex) => (
                            <div key={cIndex} className="flex items-center gap-2">
                              <Checkbox
                                id={`q_${qIndex}_c_${cIndex}_correct`}
                                checked={c.is_correct}
                                onCheckedChange={() => handleCorrectChoiceChange(qIndex, cIndex, q.question_type)}
                              />
                              <Input
                                value={c.choice_text}
                                onChange={(e) => handleChoiceChange(qIndex, cIndex, e.target.value)}
                                placeholder={`Choice ${cIndex + 1}`}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeChoice(qIndex, cIndex)}
                                disabled={q.choices.length <= 2}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )) || []}
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={() => addChoice(qIndex)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Choice
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}
                <Button type="button" variant="secondary" onClick={addQuestion} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </CardContent>
            </Card>

            {/* Reward Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Reward Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="attempt_points">Attempt Points</Label>
                    <Input
                      id="attempt_points"
                      type="number"
                      value={formData.attempt_points}
                      onChange={(e) => handleInputChange('attempt_points', e.target.value)}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="completion_points">Completion Points</Label>
                    <Input
                      id="completion_points"
                      type="number"
                      value={formData.completion_points}
                      onChange={(e) => handleInputChange('completion_points', e.target.value)}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="completion_coins">Completion Coins</Label>
                    <Input
                      id="completion_coins"
                      type="number"
                      value={formData.completion_coins}
                      onChange={(e) => handleInputChange('completion_coins', e.target.value)}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="perfect_score_bonus">Perfect Score Bonus</Label>
                    <Input
                      id="perfect_score_bonus"
                      type="number"
                      value={formData.perfect_score_bonus}
                      onChange={(e) => handleInputChange('perfect_score_bonus', e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings - Right Column */}
          <div className="space-y-6">
            {/* Exercise Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exercise_format">Format</Label>
                    <Select
                      value={formData.exercise_format}
                      onValueChange={(v) => handleInputChange('exercise_format', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mixed">
                          <div className="flex items-center gap-2">
                            {getFormatIcon('mixed')}
                            Mixed Questions
                          </div>
                        </SelectItem>
                        <SelectItem value="qcm_only">
                          <div className="flex items-center gap-2">
                            {getFormatIcon('qcm_only')}
                            QCM Only
                          </div>
                        </SelectItem>
                        <SelectItem value="open_only">
                          <div className="flex items-center gap-2">
                            {getFormatIcon('open_only')}
                            Open Questions Only
                          </div>
                        </SelectItem>
                        <SelectItem value="practical">
                          <div className="flex items-center gap-2">
                            {getFormatIcon('practical')}
                            Practical
                          </div>
                        </SelectItem>
                        <SelectItem value="interactive">
                          <div className="flex items-center gap-2">
                            {getFormatIcon('interactive')}
                            Interactive
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="difficulty_level">Difficulty</Label>
                    <Select
                      value={formData.difficulty_level}
                      onValueChange={(v) => handleInputChange('difficulty_level', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">
                          <span className={getDifficultyColor('beginner')}>Beginner</span>
                        </SelectItem>
                        <SelectItem value="intermediate">
                          <span className={getDifficultyColor('intermediate')}>Intermediate</span>
                        </SelectItem>
                        <SelectItem value="advanced">
                          <span className={getDifficultyColor('advanced')}>Advanced</span>
                        </SelectItem>
                        <SelectItem value="expert">
                          <span className={getDifficultyColor('expert')}>Expert</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estimated_duration">Estimated Duration</Label>
                    <div className="relative">
                      <Input
                        id="estimated_duration"
                        type="number"
                        value={formData.estimated_duration}
                        onChange={(e) => handleInputChange('estimated_duration', e.target.value)}
                        placeholder="30"
                        min="1"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Minutes</p>
                  </div>
                  <div>
                    <Label htmlFor="max_attempts">Max Attempts</Label>
                    <Input
                      id="max_attempts"
                      type="number"
                      value={formData.max_attempts}
                      onChange={(e) => handleInputChange('max_attempts', e.target.value)}
                      placeholder="0"
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground mt-1">0 = unlimited</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_timed"
                      checked={formData.is_timed}
                      onCheckedChange={(c) => handleInputChange('is_timed', c)}
                    />
                    <Label htmlFor="is_timed">Timed Exercise</Label>
                  </div>
                  {formData.is_timed && (
                    <div className="ml-6">
                      <Label htmlFor="time_limit">Time Limit *</Label>
                      <div className="relative max-w-xs">
                        <Input
                          id="time_limit"
                          type="number"
                          value={formData.time_limit}
                          onChange={(e) => handleInputChange('time_limit', e.target.value)}
                          placeholder="60"
                          min="1"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Minutes</p>
                    </div>
                  )}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto_grade">Auto Grade</Label>
                    <p className="text-xs text-muted-foreground">Automatically grade QCM questions</p>
                  </div>
                  <Switch
                    id="auto_grade"
                    checked={formData.auto_grade}
                    onCheckedChange={(c) => handleInputChange('auto_grade', c)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="randomize_questions">Randomize Questions</Label>
                    <p className="text-xs text-muted-foreground">Show questions in random order</p>
                  </div>
                  <Switch
                    id="randomize_questions"
                    checked={formData.randomize_questions}
                    onCheckedChange={(c) => handleInputChange('randomize_questions', c)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show_results_immediately">Show Results Immediately</Label>
                    <p className="text-xs text-muted-foreground">Show correct answers after submission</p>
                  </div>
                  <Switch
                    id="show_results_immediately"
                    checked={formData.show_results_immediately}
                    onCheckedChange={(c) => handleInputChange('show_results_immediately', c)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allow_multiple_attempts">Allow Multiple Attempts</Label>
                    <p className="text-xs text-muted-foreground">Students can retry the exercise</p>
                  </div>
                  <Switch
                    id="allow_multiple_attempts"
                    checked={formData.allow_multiple_attempts}
                    onCheckedChange={(c) => handleInputChange('allow_multiple_attempts', c)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Availability Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_active">Active</Label>
                    <p className="text-xs text-muted-foreground">Exercise is active and available</p>
                  </div>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(c) => handleInputChange('is_active', c)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_published">Published</Label>
                    <p className="text-xs text-muted-foreground">Visible to students</p>
                  </div>
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(c) => handleInputChange('is_published', c)}
                  />
                </div>
                <Separator />
                <div>
                  <Label htmlFor="available_from">Available From</Label>
                  <Input
                    id="available_from"
                    type="datetime-local"
                    value={formData.available_from}
                    onChange={(e) => handleInputChange('available_from', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="available_until">Available Until</Label>
                  <Input
                    id="available_until"
                    type="datetime-local"
                    value={formData.available_until}
                    onChange={(e) => handleInputChange('available_until', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3">
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Exercise
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (lesson) {
                        navigate(`/teacher/content/lessons/${lesson.id}/exercises`)
                      } else {
                        navigate('/teacher/content/lesson-exercises')
                      }
                    }}
                    disabled={loading}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </TeacherPageLayout>
  )
}

export default EditLessonExercisePage
