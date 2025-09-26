import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { TeacherPageLayout } from '../../components/teacher/layout'
import { apiMethods } from '../../services/api'
import homeworkService from '../../services/homework'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import { Switch } from '../../components/ui/switch'
import {
  BookOpen,
  HelpCircle,
  CheckSquare,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Trophy,
  Users,
  Target,
  FileText,
  AlertCircle,
  Info,
  Settings,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react'
import { cn } from '../../lib/utils'

const CreateHomeworkPage = () => {
  const { t, isRTL } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()

  // Step management
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  // Steps configuration
  const steps = [
    {
      number: 1,
      title: 'Type & Basic Info',
      description: 'Choose homework type and enter basic information',
      icon: FileText,
      fields: ['title', 'description', 'homework_format', 'grade', 'school_class', 'due_date']
    },
    {
      number: 2,
      title: 'Content Creation',
      description: 'Add questions or exercises based on your chosen type',
      icon: BookOpen,
      fields: []
    },
    {
      number: 3,
      title: 'Advanced Settings',
      description: 'Configure timing, penalties, and other options',
      icon: Settings,
      fields: ['is_timed', 'allow_late_submissions', 'estimated_duration', 'total_points']
    },
    {
      number: 4,
      title: 'Review & Publish',
      description: 'Review your homework and publish it for students',
      icon: CheckCircle,
      fields: []
    }
  ]

  // Homework basic info
  const [homeworkData, setHomeworkData] = useState({
    title: '',
    description: '',
    instructions: '',
    homework_type: 'homework',
    homework_format: 'qcm_only',
    subject: '',
    grade: '',
    school_class: '',
    due_date: '',
    estimated_duration: 30,
    total_points: 20,
    is_timed: false,
    time_limit: null,
    allow_late_submissions: true,
    late_penalty_percentage: 0
  })

  // Questions for QCM and Open Questions
  const [questions, setQuestions] = useState([])

  // Book exercises
  const [bookExercises, setBookExercises] = useState([])

  // Form validation
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Real data from API
  const [subjects, setSubjects] = useState([])
  const [grades, setGrades] = useState([])
  const [classes, setClasses] = useState([])
  const [filteredClasses, setFilteredClasses] = useState([])
  const [academicYears, setAcademicYears] = useState([])
  const [loading, setLoading] = useState(true)
  const [teacherProfile, setTeacherProfile] = useState(null)

  const homeworkTypes = [
    {
      id: 'qcm_only',
      name: 'QCM Only',
      nameAr: 'أسئلة اختيار متعدد فقط',
      description: 'Multiple choice questions with automatic grading',
      descriptionAr: 'أسئلة اختيار متعدد مع التصحيح التلقائي',
      icon: CheckSquare,
      color: 'bg-blue-500'
    },
    {
      id: 'open_only',
      name: 'Open Questions',
      nameAr: 'أسئلة مفتوحة',
      description: 'Essay questions requiring manual grading',
      descriptionAr: 'أسئلة مقالية تتطلب التصحيح اليدوي',
      icon: HelpCircle,
      color: 'bg-green-500'
    },
    {
      id: 'book_exercises',
      name: 'Book Exercises',
      nameAr: 'تمارين من الكتاب',
      description: 'Exercises from textbooks with photo submissions',
      descriptionAr: 'تمارين من الكتب المدرسية مع إرسال الصور',
      icon: BookOpen,
      color: 'bg-purple-500'
    }
  ]

  // Load reference data on component mount
  useEffect(() => {
    fetchReferenceData()
  }, [])

  // Load existing homework data for edit mode
  useEffect(() => {
    if (id) {
      loadHomeworkData(id)
    }
  }, [id])

  // Filter classes when grade changes
  useEffect(() => {
    const filterClassesByGrade = () => {
      if (homeworkData.grade && classes.length > 0) {
        const filtered = classes.filter(cls => cls.grade_id?.toString() === homeworkData.grade.toString())
        setFilteredClasses(filtered)

        if (homeworkData.school_class && !filtered.some(cls => cls.id.toString() === homeworkData.school_class.toString())) {
          updateHomeworkData('school_class', '')
        }
      } else {
        setFilteredClasses([])
        updateHomeworkData('school_class', '')
      }
    }

    filterClassesByGrade()
  }, [homeworkData.grade, classes])

  // Auto-set teacher's subject from profile data
  useEffect(() => {
    const setTeacherSubject = () => {
      if (teacherProfile && teacherProfile.profile && teacherProfile.profile.school_subject) {
        const subjectId = teacherProfile.profile.school_subject.id
        console.log('Auto-setting teacher subject:', teacherProfile.profile.school_subject)
        updateHomeworkData('subject', subjectId.toString())
      }
    }

    if (teacherProfile && !id) {
      setTeacherSubject()
    }
  }, [teacherProfile, id])

  const loadHomeworkData = async (homeworkId) => {
    try {
      setLoading(true)
      const homework = await homeworkService.getHomeworkById(homeworkId)
      console.log('Loaded homework for editing:', homework)

      setHomeworkData({
        title: homework.title || '',
        title_arabic: homework.title_arabic || '',
        description: homework.description || '',
        instructions: homework.instructions || '',
        homework_type: homework.homework_type || 'homework',
        homework_format: homework.homework_format || 'qcm_only',
        subject: homework.subject?.toString() || '',
        grade: homework.grade?.toString() || '',
        school_class: homework.school_class?.toString() || '',
        due_date: homework.due_date || '',
        estimated_duration: homework.estimated_duration || 30,
        total_points: homework.total_points || 20,
        is_timed: homework.is_timed || false,
        time_limit: homework.time_limit || null,
        allow_late_submissions: homework.allow_late_submissions !== false,
        late_penalty_percentage: homework.late_penalty_percentage || 0
      })

      if (homework.questions && homework.questions.length > 0) {
        setQuestions(homework.questions)
      }

      if (homework.book_exercises && homework.book_exercises.length > 0) {
        setBookExercises(homework.book_exercises)
      }

    } catch (error) {
      console.error('Error loading homework:', error)
      toast.error('Failed to load homework data')
    } finally {
      setLoading(false)
    }
  }

  const fetchTeacherProfile = async () => {
    try {
      const response = await apiMethods.get('users/profile/')
      const data = response.data || response
      setTeacherProfile(data)
      console.log('Teacher profile loaded:', data)
      return data
    } catch (error) {
      console.error('Failed to fetch teacher profile:', error)
      return null
    }
  }

  const fetchReferenceData = async () => {
    try {
      setLoading(true)
      const [teacherClassesResponse, academicYearsResponse, subjectsResponse, profileData] = await Promise.all([
        apiMethods.get('users/users/my_teachable_classes/'), // Get teacher's teachable classes
        apiMethods.get('schools/academic-years/'),
        apiMethods.get('schools/subjects/'),
        fetchTeacherProfile()
      ])

      // Extract classes from teacher's response
      const teacherClasses = teacherClassesResponse.classes || []
      let academicYearsData = academicYearsResponse.results || (Array.isArray(academicYearsResponse) ? academicYearsResponse : academicYearsResponse.data?.results || academicYearsResponse.data || [])
      let subjectsData = subjectsResponse.results || (Array.isArray(subjectsResponse) ? subjectsResponse : subjectsResponse.data?.results || subjectsResponse.data || [])

      setClasses(teacherClasses)
      setAcademicYears(academicYearsData)
      setSubjects(subjectsData)

      // Extract unique grades from teacher's classes for the grade dropdown
      const teacherGrades = [...new Map(teacherClasses.map(cls => [cls.grade_id, {
        id: cls.grade_id,
        name: cls.grade_name
      }])).values()]
      setGrades(teacherGrades)

      const currentYear = academicYearsData.find(y => y.is_current)
      if (currentYear) {
        setHomeworkData(prev => ({ ...prev, academic_year: currentYear.id.toString() }))
      }

      console.log('Teacher classes loaded:', teacherClasses)
      console.log('Teacher grades extracted:', teacherGrades)

    } catch (error) {
      console.error('Failed to fetch reference data:', error)
      toast.error('Failed to load form data. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const updateHomeworkData = (field, value) => {
    setHomeworkData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question_text: '',
      question_type: homeworkData.homework_format === 'qcm_only' ? 'qcm_single' : 'open_short',
      points: 1,
      order: questions.length + 1,
      choices: homeworkData.homework_format === 'qcm_only' ? [
        { id: Date.now() + 1, choice_text: '', choice_text_arabic: '', is_correct: false, order: 1 },
        { id: Date.now() + 2, choice_text: '', choice_text_arabic: '', is_correct: false, order: 2 },
        { id: Date.now() + 3, choice_text: '', choice_text_arabic: '', is_correct: false, order: 3 },
        { id: Date.now() + 4, choice_text: '', choice_text_arabic: '', is_correct: false, order: 4 }
      ] : []
    }
    setQuestions(prev => [...prev, newQuestion])
  }

  const updateQuestion = (questionId, field, value) => {
    setQuestions(prev => prev.map(q =>
      q.id === questionId ? { ...q, [field]: value } : q
    ))
  }

  const updateChoice = (questionId, choiceId, field, value) => {
    setQuestions(prev => prev.map(q =>
      q.id === questionId ? {
        ...q,
        choices: q.choices.map(c =>
          c.id === choiceId ? { ...c, [field]: value } : c
        )
      } : q
    ))
  }

  const removeQuestion = (questionId) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId))
  }

  const addBookExercise = () => {
    const newExercise = {
      id: Date.now(),
      book_title: '',
      chapter: '',
      page_number: '',
      exercise_number: '',
      specific_questions: '',
      additional_notes: '',
      points: 5
    }
    setBookExercises(prev => [...prev, newExercise])
  }

  const updateBookExercise = (exerciseId, field, value) => {
    setBookExercises(prev => prev.map(ex =>
      ex.id === exerciseId ? { ...ex, [field]: value } : ex
    ))
  }

  const removeBookExercise = (exerciseId) => {
    setBookExercises(prev => prev.filter(ex => ex.id !== exerciseId))
  }

  const validateCurrentStep = () => {
    const newErrors = {}
    const currentStepConfig = steps[currentStep - 1]

    if (currentStep === 1) {
      // Ensure teacher's subject is set
      if (!homeworkData.subject && teacherProfile?.profile?.school_subject) {
        updateHomeworkData('subject', teacherProfile.profile.school_subject.id.toString())
      }

      if (!homeworkData.title.trim()) newErrors.title = 'Title is required'
      if (!homeworkData.description.trim()) newErrors.description = 'Description is required'
      if (!homeworkData.subject) newErrors.subject = 'Teacher subject not found'
      if (!homeworkData.grade) newErrors.grade = 'Grade is required'
      if (!homeworkData.school_class) newErrors.school_class = 'Class is required'
      if (!homeworkData.due_date) newErrors.due_date = 'Due date is required'
    }

    if (currentStep === 2) {
      // Validate content based on homework type
      if (homeworkData.homework_format === 'qcm_only' || homeworkData.homework_format === 'open_only') {
        if (questions.length === 0) {
          newErrors.questions = 'At least one question is required'
        } else {
          questions.forEach((q, index) => {
            if (!q.question_text.trim()) {
              newErrors[`question_${q.id}`] = `Question ${index + 1} text is required`
            }
            if (q.question_type.startsWith('qcm_') && q.choices) {
              const hasCorrect = q.choices.some(c => c.is_correct)
              if (!hasCorrect) {
                newErrors[`question_${q.id}_choices`] = `Question ${index + 1} must have at least one correct answer`
              }
            }
          })
        }
      }

      if (homeworkData.homework_format === 'book_exercises') {
        if (bookExercises.length === 0) {
          newErrors.bookExercises = 'At least one book exercise is required'
        } else {
          bookExercises.forEach((ex, index) => {
            if (!ex.book_title.trim()) {
              newErrors[`exercise_${ex.id}_book`] = `Book title is required for exercise ${index + 1}`
            }
            if (!ex.exercise_number.trim()) {
              newErrors[`exercise_${ex.id}_number`] = `Exercise number is required for exercise ${index + 1}`
            }
          })
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const goToStep = (step) => {
    if (step <= currentStep || validateCurrentStep()) {
      setCurrentStep(step)
    }
  }

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return

    setIsSubmitting(true)
    try {
      // Step 1: Create the homework
      const homeworkPayload = {
        title: homeworkData.title,
        title_arabic: homeworkData.title_arabic || '',
        description: homeworkData.description,
        instructions: homeworkData.instructions,
        homework_type: homeworkData.homework_type,
        homework_format: homeworkData.homework_format,
        subject: parseInt(homeworkData.subject),
        grade: parseInt(homeworkData.grade),
        school_class: parseInt(homeworkData.school_class),
        teacher: user.id,
        due_date: homeworkData.due_date,
        estimated_duration: homeworkData.estimated_duration,
        total_points: homeworkData.total_points,
        is_timed: homeworkData.is_timed,
        time_limit: homeworkData.time_limit,
        allow_late_submissions: homeworkData.allow_late_submissions,
        late_penalty_percentage: homeworkData.late_penalty_percentage,
        auto_grade_qcm: homeworkData.homework_format === 'qcm_only',
        is_published: true
      }

      console.log(id ? 'Updating homework:' : 'Creating homework:', homeworkPayload)
      const homework = id
        ? await homeworkService.updateHomework(id, homeworkPayload)
        : await homeworkService.createHomework(homeworkPayload)
      console.log(id ? 'Homework updated:' : 'Homework created:', homework)

      // Step 2: Create questions if QCM or Open Questions
      if (homeworkData.homework_format !== 'book_exercises' && questions.length > 0) {
        console.log('Creating questions...')
        for (const question of questions) {
          const questionPayload = {
            homework: homework.id,
            question_type: question.question_type,
            question_text: question.question_text,
            question_text_arabic: question.question_text_arabic || '',
            points: question.points,
            order: question.order,
            is_required: true
          }

          if (question.question_type.startsWith('qcm_') && question.choices) {
            questionPayload.choices = question.choices
              .filter(choice => choice.choice_text.trim())
              .map((choice, index) => ({
                choice_text: choice.choice_text,
                choice_text_arabic: choice.choice_text_arabic || '',
                is_correct: choice.is_correct,
                order: choice.order || index + 1
              }))
          }

          const createdQuestion = await homeworkService.createQuestion(questionPayload)
          console.log('Question created:', createdQuestion)
        }
      }

      // Step 3: Create book exercises if needed
      if (homeworkData.homework_format === 'book_exercises' && bookExercises.length > 0) {
        console.log('Creating book exercises...')
        for (const exercise of bookExercises) {
          const exercisePayload = {
            homework: homework.id,
            book_title: exercise.book_title,
            book_title_arabic: exercise.book_title_arabic || '',
            chapter: exercise.chapter,
            chapter_arabic: exercise.chapter_arabic || '',
            page_number: exercise.page_number ? parseInt(exercise.page_number) : null,
            exercise_number: exercise.exercise_number,
            specific_questions: exercise.specific_questions,
            additional_notes: exercise.additional_notes,
            points: exercise.points
          }

          await homeworkService.createBookExercise(exercisePayload)
        }
      }

      toast.success(id ? 'Homework updated successfully!' : 'Homework created successfully!')
      setTimeout(() => {
        navigate('/teacher/homework')
      }, 1000)
    } catch (error) {
      console.error('Error creating homework:', error)

      let errorMessage = 'Failed to create homework. Please try again.'
      if (error.response?.data) {
        const apiError = error.response.data
        if (typeof apiError === 'string') {
          errorMessage = apiError
        } else if (apiError.detail) {
          errorMessage = apiError.detail
        } else if (apiError.non_field_errors) {
          errorMessage = Array.isArray(apiError.non_field_errors)
            ? apiError.non_field_errors[0]
            : apiError.non_field_errors
        } else {
          const firstError = Object.values(apiError)[0]
          if (firstError) {
            errorMessage = Array.isArray(firstError) ? firstError[0] : firstError
          }
        }
      }

      setErrors({ submit: errorMessage })
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    navigate('/teacher/homework')
  }

  const getSelectedHomeworkType = () => {
    return homeworkTypes.find(type => type.id === homeworkData.homework_format) || homeworkTypes[0]
  }

  const renderProgressBar = () => (
    <div className="w-full mb-8">
      {/* Mobile Progress Bar */}
      <div className="block md:hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{steps[currentStep - 1].title}</h2>
          <span className="text-sm text-muted-foreground">
            {currentStep} of {totalSteps}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {steps[currentStep - 1].description}
        </p>
      </div>

      {/* Desktop Progress Bar */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = currentStep === step.number
            const isCompleted = currentStep > step.number
            const isClickable = step.number <= currentStep

            return (
              <div key={step.number} className="flex-1">
                <div className="flex items-center">
                  <button
                    onClick={() => isClickable && goToStep(step.number)}
                    disabled={!isClickable}
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                      isCompleted && "bg-green-600 border-green-600 text-white",
                      isActive && !isCompleted && "bg-blue-600 border-blue-600 text-white",
                      !isActive && !isCompleted && "bg-white border-gray-300 text-gray-500",
                      isClickable && "cursor-pointer hover:scale-105"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 mx-4 transition-all duration-300",
                        isCompleted ? "bg-green-600" : "bg-gray-300"
                      )}
                    />
                  )}
                </div>
                <div className="mt-3 text-center">
                  <p className={cn(
                    "text-sm font-medium",
                    isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                  )}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-32">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Homework Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Homework Type</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose the type of homework you want to create
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {homeworkTypes.map((type) => {
                    const IconComponent = type.icon
                    const isSelected = homeworkData.homework_format === type.id

                    return (
                      <Card
                        key={type.id}
                        className={cn(
                          "cursor-pointer transition-all hover:shadow-md p-4",
                          isSelected && "ring-2 ring-blue-500 bg-blue-50"
                        )}
                        onClick={() => updateHomeworkData('homework_format', type.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn("p-3 rounded-lg text-white", type.color)}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base">
                              {isRTL ? type.nameAr : type.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {isRTL ? type.descriptionAr : type.description}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title *</label>
                    <Input
                      placeholder="Enter homework title"
                      value={homeworkData.title}
                      onChange={(e) => updateHomeworkData('title', e.target.value)}
                      className={cn("text-base", errors.title && 'border-red-500')}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <div>
                          <span className="text-base font-medium">
                            {teacherProfile?.profile?.school_subject?.name || 'Loading your assigned subject...'}
                          </span>
                          <p className="text-sm text-gray-600">
                            Homework will be created for your assigned subject
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Grade *</label>
                      <Select value={homeworkData.grade} onValueChange={(value) => updateHomeworkData('grade', value)}>
                        <SelectTrigger className={cn("text-base", errors.grade && 'border-red-500')}>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {grades.map((grade) => (
                            <SelectItem key={grade.id} value={grade.id.toString()}>
                              {grade.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.grade && <p className="text-red-500 text-sm mt-1">{errors.grade}</p>}
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Class *</label>
                      <Select
                        value={homeworkData.school_class}
                        onValueChange={(value) => updateHomeworkData('school_class', value)}
                        disabled={!homeworkData.grade}
                      >
                        <SelectTrigger className={cn("text-base", errors.school_class && 'border-red-500')}>
                          <SelectValue placeholder={!homeworkData.grade ? "Select grade first" : "Select class"} />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredClasses.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id.toString()}>
                              {cls.name}
                            </SelectItem>
                          ))}
                          {filteredClasses.length === 0 && homeworkData.grade && (
                            <SelectItem disabled value="no-classes">
                              No classes available for selected grade
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {errors.school_class && <p className="text-red-500 text-sm mt-1">{errors.school_class}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Due Date *</label>
                    <Input
                      type="datetime-local"
                      value={homeworkData.due_date}
                      onChange={(e) => updateHomeworkData('due_date', e.target.value)}
                      className={cn("text-base", errors.due_date && 'border-red-500')}
                    />
                    {errors.due_date && <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Description *</label>
                    <Textarea
                      placeholder="Describe the homework assignment"
                      value={homeworkData.description}
                      onChange={(e) => updateHomeworkData('description', e.target.value)}
                      className={cn("text-base resize-none", errors.description && 'border-red-500')}
                      rows={4}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Instructions</label>
                    <Textarea
                      placeholder="Special instructions for students"
                      value={homeworkData.instructions}
                      onChange={(e) => updateHomeworkData('instructions', e.target.value)}
                      className="text-base resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            {(homeworkData.homework_format === 'qcm_only' || homeworkData.homework_format === 'open_only') && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {homeworkData.homework_format === 'qcm_only' ? (
                          <CheckSquare className="h-5 w-5" />
                        ) : (
                          <HelpCircle className="h-5 w-5" />
                        )}
                        Questions
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add questions for your students to answer
                      </p>
                    </div>
                    <Button onClick={addQuestion} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {errors.questions && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <p className="text-red-600 text-sm">{errors.questions}</p>
                    </div>
                  )}

                  <div className="space-y-6">
                    {questions.map((question, index) => (
                      <Card key={question.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="font-semibold">Question {index + 1}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuestion(question.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">Question Text *</label>
                              <Textarea
                                placeholder="Enter your question"
                                value={question.question_text}
                                onChange={(e) => updateQuestion(question.id, 'question_text', e.target.value)}
                                className={cn("text-base resize-none", errors[`question_${question.id}`] && 'border-red-500')}
                                rows={3}
                              />
                              {errors[`question_${question.id}`] && (
                                <p className="text-red-500 text-sm mt-1">{errors[`question_${question.id}`]}</p>
                              )}
                            </div>

                            <div className="w-24">
                              <label className="text-sm font-medium mb-2 block">Points</label>
                              <Input
                                type="number"
                                placeholder="1"
                                value={question.points}
                                onChange={(e) => updateQuestion(question.id, 'points', parseFloat(e.target.value) || 0)}
                                className="text-base"
                              />
                            </div>

                            {homeworkData.homework_format === 'qcm_only' && (
                              <div>
                                <label className="text-sm font-medium mb-2 block">Answer Choices *</label>
                                {errors[`question_${question.id}_choices`] && (
                                  <p className="text-red-500 text-sm mb-2">{errors[`question_${question.id}_choices`]}</p>
                                )}
                                <div className="space-y-3">
                                  {question.choices?.map((choice, choiceIndex) => (
                                    <div key={choice.id} className="flex items-center gap-3">
                                      <Switch
                                        checked={choice.is_correct}
                                        onCheckedChange={(checked) => updateChoice(question.id, choice.id, 'is_correct', checked)}
                                      />
                                      <Input
                                        placeholder={`Choice ${choiceIndex + 1}`}
                                        value={choice.choice_text}
                                        onChange={(e) => updateChoice(question.id, choice.id, 'choice_text', e.target.value)}
                                        className="flex-1 text-base"
                                      />
                                      <Badge variant={choice.is_correct ? "default" : "secondary"} className="min-w-16">
                                        {choice.is_correct ? "Correct" : "Wrong"}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {questions.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">No questions added yet</p>
                        <p>Click "Add Question" to get started creating your homework</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {homeworkData.homework_format === 'book_exercises' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Book Exercises
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add exercises from textbooks for students to complete
                      </p>
                    </div>
                    <Button onClick={addBookExercise} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Exercise
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {errors.bookExercises && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <p className="text-red-600 text-sm">{errors.bookExercises}</p>
                    </div>
                  )}

                  <div className="space-y-6">
                    {bookExercises.map((exercise, index) => (
                      <Card key={exercise.id} className="border-l-4 border-l-purple-500">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="font-semibold">Exercise {index + 1}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBookExercise(exercise.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium mb-2 block">Book Title *</label>
                                <Input
                                  placeholder="Enter book title"
                                  value={exercise.book_title}
                                  onChange={(e) => updateBookExercise(exercise.id, 'book_title', e.target.value)}
                                  className={cn("text-base", errors[`exercise_${exercise.id}_book`] && 'border-red-500')}
                                />
                                {errors[`exercise_${exercise.id}_book`] && (
                                  <p className="text-red-500 text-sm mt-1">{errors[`exercise_${exercise.id}_book`]}</p>
                                )}
                              </div>

                              <div>
                                <label className="text-sm font-medium mb-2 block">Chapter</label>
                                <Input
                                  placeholder="Chapter name/number"
                                  value={exercise.chapter}
                                  onChange={(e) => updateBookExercise(exercise.id, 'chapter', e.target.value)}
                                  className="text-base"
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium mb-2 block">Page Number</label>
                                <Input
                                  type="number"
                                  placeholder="Page number"
                                  value={exercise.page_number}
                                  onChange={(e) => updateBookExercise(exercise.id, 'page_number', e.target.value)}
                                  className="text-base"
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium mb-2 block">Exercise Number *</label>
                                <Input
                                  placeholder="e.g., 45-46-48"
                                  value={exercise.exercise_number}
                                  onChange={(e) => updateBookExercise(exercise.id, 'exercise_number', e.target.value)}
                                  className={cn("text-base", errors[`exercise_${exercise.id}_number`] && 'border-red-500')}
                                />
                                {errors[`exercise_${exercise.id}_number`] && (
                                  <p className="text-red-500 text-sm mt-1">{errors[`exercise_${exercise.id}_number`]}</p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium mb-2 block">Specific Questions</label>
                                <Input
                                  placeholder="e.g., Questions 1, 3, 5-8"
                                  value={exercise.specific_questions}
                                  onChange={(e) => updateBookExercise(exercise.id, 'specific_questions', e.target.value)}
                                  className="text-base"
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium mb-2 block">Points</label>
                                <Input
                                  type="number"
                                  placeholder="5"
                                  value={exercise.points}
                                  onChange={(e) => updateBookExercise(exercise.id, 'points', parseFloat(e.target.value) || 0)}
                                  className="text-base"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-2 block">Additional Notes</label>
                              <Textarea
                                placeholder="Any additional instructions"
                                value={exercise.additional_notes}
                                onChange={(e) => updateBookExercise(exercise.id, 'additional_notes', e.target.value)}
                                className="text-base resize-none"
                                rows={2}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {bookExercises.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">No book exercises added yet</p>
                        <p>Click "Add Exercise" to get started creating your homework</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Advanced Settings</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure timing, penalties, and other homework options
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
                    <Input
                      type="number"
                      placeholder="30"
                      value={homeworkData.estimated_duration}
                      onChange={(e) => updateHomeworkData('estimated_duration', parseInt(e.target.value) || 0)}
                      className="text-base"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Estimated time for students to complete
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Total Points</label>
                    <Input
                      type="number"
                      placeholder="20"
                      value={homeworkData.total_points}
                      onChange={(e) => updateHomeworkData('total_points', parseFloat(e.target.value) || 0)}
                      className="text-base"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum points students can earn
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <label className="text-base font-medium">Timed Assignment</label>
                      <p className="text-sm text-muted-foreground">Set a time limit for completion</p>
                    </div>
                    <Switch
                      checked={homeworkData.is_timed}
                      onCheckedChange={(checked) => updateHomeworkData('is_timed', checked)}
                    />
                  </div>

                  {homeworkData.is_timed && (
                    <div className="pl-4 border-l-2 border-blue-500">
                      <label className="text-sm font-medium mb-2 block">Time Limit (minutes)</label>
                      <Input
                        type="number"
                        placeholder="60"
                        value={homeworkData.time_limit || ''}
                        onChange={(e) => updateHomeworkData('time_limit', parseInt(e.target.value) || null)}
                        className="text-base max-w-32"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <label className="text-base font-medium">Allow Late Submissions</label>
                      <p className="text-sm text-muted-foreground">Students can submit after due date</p>
                    </div>
                    <Switch
                      checked={homeworkData.allow_late_submissions}
                      onCheckedChange={(checked) => updateHomeworkData('allow_late_submissions', checked)}
                    />
                  </div>

                  {homeworkData.allow_late_submissions && (
                    <div className="pl-4 border-l-2 border-orange-500">
                      <label className="text-sm font-medium mb-2 block">Late Penalty (%)</label>
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        max="100"
                        value={homeworkData.late_penalty_percentage}
                        onChange={(e) => updateHomeworkData('late_penalty_percentage', parseFloat(e.target.value) || 0)}
                        className="text-base max-w-32"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Percentage to deduct from late submissions
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review & Publish</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Review your homework details before publishing it to students
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Title</label>
                      <p className="text-base font-semibold">{homeworkData.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Type</label>
                      <p className="text-base">{getSelectedHomeworkType().name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Subject</label>
                      <p className="text-base">{teacherProfile?.profile?.school_subject?.name}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Grade & Class</label>
                      <p className="text-base">
                        {grades.find(g => g.id.toString() === homeworkData.grade)?.name} - {' '}
                        {filteredClasses.find(c => c.id.toString() === homeworkData.school_class)?.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                      <p className="text-base">
                        {new Date(homeworkData.due_date).toLocaleDateString()} at {' '}
                        {new Date(homeworkData.due_date).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Points & Duration</label>
                      <p className="text-base">
                        {homeworkData.total_points} points • {homeworkData.estimated_duration} minutes
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content Summary */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Content Summary</h3>
                  {(homeworkData.homework_format === 'qcm_only' || homeworkData.homework_format === 'open_only') && (
                    <p className="text-sm">
                      <span className="font-medium">{questions.length}</span> questions added
                    </p>
                  )}
                  {homeworkData.homework_format === 'book_exercises' && (
                    <p className="text-sm">
                      <span className="font-medium">{bookExercises.length}</span> book exercises added
                    </p>
                  )}
                </div>

                {/* Settings Summary */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Settings</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Timed Assignment:</span>
                      <span className={homeworkData.is_timed ? "text-green-600" : "text-gray-500"}>
                        {homeworkData.is_timed ? `Yes (${homeworkData.time_limit} min)` : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Late Submissions:</span>
                      <span className={homeworkData.allow_late_submissions ? "text-green-600" : "text-red-600"}>
                        {homeworkData.allow_late_submissions ?
                          `Allowed (${homeworkData.late_penalty_percentage}% penalty)` :
                          'Not allowed'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {errors.submit && (
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-5 w-5" />
                        <p>{errors.submit}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <TeacherPageLayout
        title="Create Homework"
        subtitle="Create homework assignments for your students"
        showRefreshButton={false}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading form data...</p>
          </div>
        </div>
      </TeacherPageLayout>
    )
  }

  return (
    <TeacherPageLayout
      title={id ? "Edit Homework" : "Create Homework"}
      subtitle={id ? "Edit homework assignment" : "Create homework assignments for your students"}
      showRefreshButton={false}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Homework</span>
            <Home className="h-4 w-4 sm:hidden" />
          </Button>
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Step Content */}
        <div className="mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="sticky bottom-0 bg-white border-t p-4 -mx-4 sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {id ? "Update Homework" : "Create Homework"}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </TeacherPageLayout>
  )
}

export default CreateHomeworkPage