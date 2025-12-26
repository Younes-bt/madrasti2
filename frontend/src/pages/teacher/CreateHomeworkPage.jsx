import React, { useState, useEffect, useMemo } from 'react'
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

const extractTeacherSubject = (profileData) => {
  if (!profileData) return null
  return profileData.profile?.school_subject || profileData.school_subject || null
}


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
  
  // Question type options from backend
  const ALL_QUESTION_TYPES = [
    { id: 'qcm_single', label: 'QCM (Single Choice)' },
    { id: 'qcm_multiple', label: 'QCM (Multiple Choices)' },
    { id: 'true_false', label: 'True / False' },
    { id: 'open_short', label: 'Open (Short Answer)' },
    { id: 'open_long', label: 'Open (Long Answer)' },
    { id: 'fill_blank', label: 'Fill in the Blanks' },
    { id: 'matching', label: 'Matching' },
    { id: 'ordering', label: 'Ordering' }
  ]
  const AUTO_GRADABLE_TYPES = ['qcm_single', 'qcm_multiple', 'true_false', 'fill_blank', 'matching', 'ordering']

const getAllowedQuestionTypesForFormat = (format, autoGradeEnabled) => {
    switch (format) {
      case 'qcm_only':
        return ALL_QUESTION_TYPES.filter(t => t.id === 'qcm_single' || t.id === 'qcm_multiple')
      case 'open_only':
        return ALL_QUESTION_TYPES.filter(t => t.id === 'open_short' || t.id === 'open_long')
      case 'mixed':
        return autoGradeEnabled ? ALL_QUESTION_TYPES.filter(t => AUTO_GRADABLE_TYPES.includes(t.id)) : ALL_QUESTION_TYPES
      default:
        return autoGradeEnabled ? ALL_QUESTION_TYPES.filter(t => AUTO_GRADABLE_TYPES.includes(t.id)) : ALL_QUESTION_TYPES
    }
  }

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
    total_points: 0,
    auto_grade_qcm: true,
    is_timed: false,
    time_limit: null,
    allow_late_submissions: true,
    late_penalty_percentage: 0
  })

  // Questions for QCM and Open Questions
  const [questions, setQuestions] = useState([])

  // Book exercises
  const [bookExercises, setBookExercises] = useState([])

  const autoGradingAvailable = homeworkData.homework_format !== 'open_only' && homeworkData.homework_format !== 'book_exercises'
  const autoGradeSelected = autoGradingAvailable && homeworkData.auto_grade_qcm

  // Derived totals
  const totalQuestionPoints = useMemo(() => {
    const total = questions.reduce((sum, q) => {
      const points = Number(q.points)
      return sum + (Number.isFinite(points) ? points : 0)
    }, 0)
    return Math.round(total * 100) / 100
  }, [questions])
  const hasAutoGradableQuestions = useMemo(
    () => questions.some(q => AUTO_GRADABLE_TYPES.includes(q.question_type)),
    [questions]
  )
  const gradingIsAuto = homeworkData.auto_grade_qcm && autoGradingAvailable && hasAutoGradableQuestions

  useEffect(() => {
    setHomeworkData(prev => {
      if (prev.total_points === totalQuestionPoints) return prev
      return { ...prev, total_points: totalQuestionPoints }
    })
  }, [totalQuestionPoints])

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
  const teacherSubject = extractTeacherSubject(teacherProfile)

  const homeworkTypes = [
    {
      id: 'mixed',
      name: 'Mixed Questions',
      nameAr: 'صيغة مختلطة',
      description: 'Combine QCM, open, and other question types',
      descriptionAr: 'دمج أسئلة متعددة الاختيارات والمفتوحة وأنواع أخرى',
      icon: FileText,
      color: 'bg-orange-500'
    },
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
    if (!teacherSubject || id) return

    const subjectId = teacherSubject.id?.toString?.()
    if (subjectId && homeworkData.subject !== subjectId) {
      console.log('Auto-setting teacher subject:', teacherSubject)
      updateHomeworkData('subject', subjectId)
    }
  }, [teacherSubject, id, homeworkData.subject])

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
        total_points: homework.total_points || 0,
        auto_grade_qcm: homework.auto_grade_qcm !== false && !['open_only', 'book_exercises'].includes(homework.homework_format),
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
    setHomeworkData(prev => {
      const updated = { ...prev, [field]: value }

      if (field === 'homework_format') {
        if (value === 'qcm_only') {
          updated.auto_grade_qcm = true
        } else if (value === 'open_only' || value === 'book_exercises') {
          updated.auto_grade_qcm = false
        }
      }

      return updated
    })
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const addQuestion = () => {
    const allowedTypes = getAllowedQuestionTypesForFormat(homeworkData.homework_format, autoGradeSelected)
    const defaultType = allowedTypes[0]?.id || 'qcm_single'

    const now = Date.now()
    const base = {
      id: now,
      question_text: '',
      question_type: defaultType,
      points: 1,
      order: questions.length + 1
    }

    let choices = []
    if (defaultType === 'qcm_single' || defaultType === 'qcm_multiple') {
      choices = [
        { id: now + 1, choice_text: '', choice_text_arabic: '', is_correct: false, order: 1 },
        { id: now + 2, choice_text: '', choice_text_arabic: '', is_correct: false, order: 2 },
        { id: now + 3, choice_text: '', choice_text_arabic: '', is_correct: false, order: 3 },
        { id: now + 4, choice_text: '', choice_text_arabic: '', is_correct: false, order: 4 }
      ]
    } else if (defaultType === 'true_false') {
      choices = [
        { id: now + 1, choice_text: 'True', choice_text_arabic: 'صحيح', is_correct: true, order: 1 },
        { id: now + 2, choice_text: 'False', choice_text_arabic: 'خطأ', is_correct: false, order: 2 }
      ]
    }

    setQuestions(prev => [...prev, { ...base, choices }])
  }

  const updateQuestion = (questionId, field, value) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q

      // Handle question_type changes: initialize/reset choices appropriately
      if (field === 'question_type') {
        const now = Date.now()
        let choices = []
        let blanks
        let ordering_items
        let matching_pairs
        if (value === 'qcm_single' || value === 'qcm_multiple') {
          choices = [
            { id: now + 1, choice_text: '', choice_text_arabic: '', is_correct: false, order: 1 },
            { id: now + 2, choice_text: '', choice_text_arabic: '', is_correct: false, order: 2 },
            { id: now + 3, choice_text: '', choice_text_arabic: '', is_correct: false, order: 3 },
            { id: now + 4, choice_text: '', choice_text_arabic: '', is_correct: false, order: 4 }
          ]
        } else if (value === 'true_false') {
          choices = [
            { id: now + 1, choice_text: 'True', choice_text_arabic: 'صحيح', is_correct: true, order: 1 },
            { id: now + 2, choice_text: 'False', choice_text_arabic: 'خطأ', is_correct: false, order: 2 }
          ]
        } else if (value === 'fill_blank') {
          blanks = [{
            id: now + 10,
            order: 1,
            label: 'B1',
            options: [
              { id: now + 11, option_text: '', is_correct: true, order: 1 },
              { id: now + 12, option_text: '', is_correct: false, order: 2 },
              { id: now + 13, option_text: '', is_correct: false, order: 3 },
              { id: now + 14, option_text: '', is_correct: false, order: 4 }
            ]
          }]
        } else if (value === 'ordering') {
          ordering_items = [
            { id: now + 21, text: '', correct_position: 1 },
            { id: now + 22, text: '', correct_position: 2 }
          ]
        } else if (value === 'matching') {
          matching_pairs = [
            { id: now + 31, left_text: '', right_text: '', order: 1 },
            { id: now + 32, left_text: '', right_text: '', order: 2 }
          ]
        }
        return { ...q, question_type: value, choices, blanks, ordering_items, matching_pairs }
      }

      return { ...q, [field]: value }
    }))
  }

  const updateChoice = (questionId, choiceId, field, value) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q
      let choices = q.choices || []
      choices = choices.map(c => {
        if (c.id !== choiceId) {
          // Enforce single correct for qcm_single and true_false
          if (field === 'is_correct' && value === true && (q.question_type === 'qcm_single' || q.question_type === 'true_false')) {
            return { ...c, is_correct: false }
          }
          return c
        }
        return { ...c, [field]: value }
      })
      return { ...q, choices }
    }))
  }

  // Fill-in-the-blanks helpers
  const addBlank = (questionId) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q
      const blanks = q.blanks || []
      const newBlankId = Date.now()
      const newBlank = {
        id: newBlankId,
        order: blanks.length + 1,
        label: `B${blanks.length + 1}`,
        options: [
          { id: newBlankId + 1, option_text: '', is_correct: true, order: 1 },
          { id: newBlankId + 2, option_text: '', is_correct: false, order: 2 },
          { id: newBlankId + 3, option_text: '', is_correct: false, order: 3 },
          { id: newBlankId + 4, option_text: '', is_correct: false, order: 4 }
        ]
      }
      return { ...q, blanks: [...blanks, newBlank] }
    }))
  }

  const updateBlank = (questionId, blankId, field, value) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q
      const blanks = (q.blanks || []).map(b => b.id === blankId ? { ...b, [field]: value } : b)
      return { ...q, blanks }
    }))
  }

  const addBlankOption = (questionId, blankId) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q
      const blanks = (q.blanks || []).map(b => {
        if (b.id !== blankId) return b
        const options = b.options || []
        const newId = Date.now()
        const newOpt = { id: newId, option_text: '', is_correct: false, order: options.length + 1 }
        return { ...b, options: [...options, newOpt] }
      })
      return { ...q, blanks }
    }))
  }

  const updateBlankOption = (questionId, blankId, optionId, field, value) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q
      const blanks = (q.blanks || []).map(b => {
        if (b.id !== blankId) return b
        const options = (b.options || []).map(o => {
          if (o.id !== optionId) {
            if (field === 'is_correct' && value === true) {
              return { ...o, is_correct: false }
            }
            return o
          }
          return { ...o, [field]: value }
        })
        return { ...b, options }
      })
      return { ...q, blanks }
    }))
  }

  // Ordering helpers
  const addOrderingItem = (questionId) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q
      const items = q.ordering_items || []
      const newId = Date.now()
      const newItem = { id: newId, text: '', correct_position: items.length + 1 }
      return { ...q, ordering_items: [...items, newItem] }
    }))
  }

  const updateOrderingItem = (questionId, itemId, field, value) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q
      const items = (q.ordering_items || []).map(it => it.id === itemId ? { ...it, [field]: value } : it)
      return { ...q, ordering_items: items }
    }))
  }

  // Matching helpers
  const addMatchingPair = (questionId) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q
      const pairs = q.matching_pairs || []
      const newId = Date.now()
      const newPair = { id: newId, left_text: '', right_text: '', order: pairs.length + 1 }
      return { ...q, matching_pairs: [...pairs, newPair] }
    }))
  }

  const updateMatchingPair = (questionId, pairId, field, value) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q
      const pairs = (q.matching_pairs || []).map(p => p.id === pairId ? { ...p, [field]: value } : p)
      return { ...q, matching_pairs: pairs }
    }))
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
      // Ensure teacher's subject is set if available
      let subjectValue = homeworkData.subject
      const teacherSubjectId = teacherSubject?.id != null ? teacherSubject.id.toString() : ''

      if (!subjectValue && teacherSubjectId) {
        subjectValue = teacherSubjectId
        if (homeworkData.subject !== teacherSubjectId) {
          updateHomeworkData('subject', teacherSubjectId)
        }
      }

      if (!subjectValue) newErrors.subject = 'Teacher subject not found'
      if (!homeworkData.title.trim()) newErrors.title = 'Title is required'
      if (!homeworkData.description.trim()) newErrors.description = 'Description is required'
      if (!homeworkData.instructions.trim()) newErrors.instructions = 'Instructions are required'
      if (!homeworkData.grade) newErrors.grade = 'Grade is required'
      if (!homeworkData.school_class) newErrors.school_class = 'Class is required'
      if (!homeworkData.due_date) newErrors.due_date = 'Due date is required'
    }

      if (currentStep === 2) {
        // Validate content based on homework type
      if (homeworkData.homework_format === 'qcm_only' || homeworkData.homework_format === 'open_only' || homeworkData.homework_format === 'mixed') {
          if (questions.length === 0) {
            newErrors.questions = 'At least one question is required'
          } else {
            questions.forEach((q, index) => {
              if (!q.question_text.trim()) {
                newErrors[`question_${q.id}`] = `Question ${index + 1} text is required`
              }
              if ((q.question_type.startsWith('qcm_') || q.question_type === 'true_false') && q.choices) {
                const hasCorrect = q.choices.some(c => c.is_correct)
                const correctCount = q.choices.filter(c => c.is_correct).length
                if (!hasCorrect) {
                  newErrors[`question_${q.id}_choices`] = `Question ${index + 1} must have at least one correct answer`
                }
                if ((q.question_type === 'qcm_single' || q.question_type === 'true_false') && correctCount !== 1) {
                  newErrors[`question_${q.id}_choices`] = `Question ${index + 1} must have exactly one correct answer`
                }
              }
              if (q.question_type === 'fill_blank') {
                const blanks = q.blanks || []
                if (blanks.length === 0) {
                  newErrors[`question_${q.id}_blanks`] = `Question ${index + 1} must have at least one blank`
                }
                blanks.forEach((b, bi) => {
                  const opts = b.options || []
                  if (opts.length < 4) {
                    newErrors[`question_${q.id}_blank_${b.id}_options`] = `Blank ${bi + 1} must have at least 4 options`
                  }
                  const correct = opts.filter(o => o.is_correct)
                  if (correct.length !== 1) {
                    newErrors[`question_${q.id}_blank_${b.id}_correct`] = `Blank ${bi + 1} must have exactly one correct option`
                  }
                  opts.forEach((o, oi) => {
                    if (!o.option_text || !o.option_text.trim()) {
                      newErrors[`question_${q.id}_blank_${b.id}_opt_${o.id}`] = `Blank ${bi + 1} option ${oi + 1} text is required`
                    }
                  })
                })
              }
              if (q.question_type === 'ordering') {
                const items = q.ordering_items || []
                if (items.length < 2) {
                  newErrors[`question_${q.id}_ordering`] = `Question ${index + 1} must have at least 2 items to order`
                }
                items.forEach((it, ii) => {
                  if (!it.text || !it.text.trim()) {
                    newErrors[`question_${q.id}_ordering_${it.id}`] = `Item ${ii + 1} text is required`
                  }
                })
              }
              if (q.question_type === 'matching') {
                const pairs = q.matching_pairs || []
                if (pairs.length < 2) {
                  newErrors[`question_${q.id}_matching`] = `Question ${index + 1} must have at least 2 pairs`
                }
                pairs.forEach((p, pi) => {
                  if (!p.left_text || !p.left_text.trim() || !p.right_text || !p.right_text.trim()) {
                    newErrors[`question_${q.id}_matching_${p.id}`] = `Pair ${pi + 1} must have both left and right texts`
                  }
                })
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
      const computedTotalPoints = totalQuestionPoints
      const shouldAutoGrade = autoGradingAvailable && homeworkData.auto_grade_qcm

      // Step 1: Create the homework
      const homeworkPayload = {
        title: homeworkData.title,
        title_arabic: homeworkData.title_arabic || '',
        description: homeworkData.description,
        instructions: homeworkData.instructions || homeworkData.description,
        homework_type: homeworkData.homework_type,
        homework_format: homeworkData.homework_format,
        subject: parseInt(homeworkData.subject),
        grade: parseInt(homeworkData.grade),
        school_class: parseInt(homeworkData.school_class),
        teacher: user.id,
        due_date: homeworkData.due_date,
        estimated_duration: homeworkData.estimated_duration,
        total_points: computedTotalPoints,
        is_timed: homeworkData.is_timed,
        time_limit: homeworkData.time_limit,
        allow_late_submissions: homeworkData.allow_late_submissions,
        late_penalty_percentage: homeworkData.late_penalty_percentage,
        auto_grade_qcm: shouldAutoGrade,
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

          if ((question.question_type.startsWith('qcm_') || question.question_type === 'true_false') && question.choices) {
            questionPayload.choices = question.choices
              .filter(choice => choice.choice_text.trim())
              .map((choice, index) => ({
                choice_text: choice.choice_text,
                choice_text_arabic: choice.choice_text_arabic || '',
                is_correct: choice.is_correct,
                order: choice.order || index + 1
              }))
          }

          if (question.question_type === 'fill_blank' && question.blanks) {
            questionPayload.blanks = question.blanks.map((b, bi) => ({
              order: b.order || bi + 1,
              label: b.label || `B${bi + 1}`,
              options: (b.options || []).map((o, oi) => ({
                option_text: o.option_text,
                is_correct: !!o.is_correct,
                order: o.order || oi + 1
              }))
            }))
          }

          if (question.question_type === 'ordering' && question.ordering_items) {
            questionPayload.ordering_items = (question.ordering_items || []).map((it, ii) => ({
              text: it.text,
              correct_position: it.correct_position || ii + 1
            }))
          }

          if (question.question_type === 'matching' && question.matching_pairs) {
            questionPayload.matching_pairs = (question.matching_pairs || []).map((p, pi) => ({
              left_text: p.left_text,
              right_text: p.right_text,
              order: p.order || pi + 1
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

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Grading Mode</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose when students get their scores. Auto-grade is available for objective question types.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={!autoGradingAvailable}
                    onClick={() => updateHomeworkData('auto_grade_qcm', true)}
                    className={cn(
                      "w-full p-4 border rounded-lg text-left transition",
                      autoGradeSelected ? "border-blue-500 bg-blue-50" : "hover:border-blue-300",
                      !autoGradingAvailable && "cursor-not-allowed opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-5 w-5 text-blue-600" />
                      <div className="font-semibold">Auto Grade</div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Instant grading for QCM, True/False, Fill in the Blanks, Matching, and Ordering.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateHomeworkData('auto_grade_qcm', false)}
                    className={cn(
                      "w-full p-4 border rounded-lg text-left transition",
                      !autoGradeSelected ? "border-slate-500 bg-slate-50" : "hover:border-slate-400"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-slate-600" />
                      <div className="font-semibold">Manual Grade</div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Use for open-ended responses or when you prefer teacher review.
                    </p>
                  </button>
                </div>
                {!autoGradingAvailable && (
                  <p className="text-xs text-amber-600 mt-2">
                    Auto grading is not available for this homework type.
                  </p>
                )}
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
                            {teacherSubject?.name || 'Loading your assigned subject...'}
                          </span>
                          <p className="text-sm text-gray-600">
                            Homework will be created for your assigned subject
                          </p>
                        </div>
                      </div>
                    </div>
                    {errors.subject && <p className="text-red-500 text-sm mt-2">{errors.subject}</p>}
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
                    {errors.instructions && <p className="text-red-500 text-sm mt-1">{errors.instructions}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            {(homeworkData.homework_format === 'qcm_only' || homeworkData.homework_format === 'open_only' || homeworkData.homework_format === 'mixed') && (
              <Card>
                <CardHeader>
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
                            {/* Question type selector */}
                            <div>
                              <label className="text-sm font-medium mb-2 block">Question Type</label>
                              <Select
                                value={question.question_type}
                                onValueChange={(val) => updateQuestion(question.id, 'question_type', val)}
                              >
                                  <SelectTrigger className="text-base">
                                    <SelectValue placeholder="Select question type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getAllowedQuestionTypesForFormat(homeworkData.homework_format, autoGradeSelected).map((t) => (
                                      <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                            </div>
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

                            {question.question_type === 'fill_blank' && (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <label className="text-sm font-medium">Blanks</label>
                                    <p className="text-xs text-muted-foreground">Use markers like [B1], [B2] in the question text to indicate blanks.</p>
                                  </div>
                                  <Button size="sm" variant="secondary" onClick={() => addBlank(question.id)}>
                                    <Plus className="h-4 w-4 mr-1" /> Add Blank
                                  </Button>
                                </div>
                                {errors[`question_${question.id}_blanks`] && (
                                  <p className="text-red-500 text-sm">{errors[`question_${question.id}_blanks`]}</p>
                                )}
                                <div className="space-y-4">
                                  {(question.blanks || []).map((blank, bi) => (
                                    <div key={blank.id} className="border rounded-md p-3">
                                      <div className="flex items-center gap-4 mb-2">
                                        <label className="text-sm font-medium">Blank {blank.order}</label>
                                        <Input
                                          placeholder={`Label (e.g., B${bi + 1})`}
                                          value={blank.label || ''}
                                          onChange={(e) => updateBlank(question.id, blank.id, 'label', e.target.value)}
                                          className="text-sm max-w-[200px]"
                                        />
                                      </div>
                                      <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium">Options (one correct)</label>
                                        <Button size="sm" variant="outline" onClick={() => addBlankOption(question.id, blank.id)}>
                                          <Plus className="h-4 w-4 mr-1" /> Add Option
                                        </Button>
                                      </div>
                                      {errors[`question_${question.id}_blank_${blank.id}_options`] && (
                                        <p className="text-red-500 text-sm mb-2">{errors[`question_${question.id}_blank_${blank.id}_options`]}</p>
                                      )}
                                      {errors[`question_${question.id}_blank_${blank.id}_correct`] && (
                                        <p className="text-red-500 text-sm mb-2">{errors[`question_${question.id}_blank_${blank.id}_correct`]}</p>
                                      )}
                                      <div className="space-y-2">
                                        {(blank.options || []).map((opt, oi) => (
                                          <div key={opt.id} className="flex items-center gap-3">
                                            <Switch
                                              checked={!!opt.is_correct}
                                              onCheckedChange={(checked) => updateBlankOption(question.id, blank.id, opt.id, 'is_correct', checked)}
                                            />
                                            <Input
                                              placeholder={`Option ${oi + 1}`}
                                              value={opt.option_text}
                                              onChange={(e) => updateBlankOption(question.id, blank.id, opt.id, 'option_text', e.target.value)}
                                              className={cn("flex-1 text-base", errors[`question_${question.id}_blank_${blank.id}_opt_${opt.id}`] && 'border-red-500')}
                                            />
                                            <Badge variant={opt.is_correct ? 'default' : 'secondary'} className="min-w-16">
                                              {opt.is_correct ? 'Correct' : 'Wrong'}
                                            </Badge>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {question.question_type === 'ordering' && (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <label className="text-sm font-medium">Ordering Items (correct order)</label>
                                  <Button size="sm" variant="secondary" onClick={() => addOrderingItem(question.id)}>
                                    <Plus className="h-4 w-4 mr-1" /> Add Item
                                  </Button>
                                </div>
                                {errors[`question_${question.id}_ordering`] && (
                                  <p className="text-red-500 text-sm">{errors[`question_${question.id}_ordering`]}</p>
                                )}
                                <div className="space-y-2">
                                  {(question.ordering_items || []).map((it, ii) => (
                                    <div key={it.id} className="flex items-center gap-3">
                                      <Badge variant="secondary" className="min-w-8 justify-center">{ii + 1}</Badge>
                                      <Input
                                        placeholder={`Item ${ii + 1}`}
                                        value={it.text}
                                        onChange={(e) => updateOrderingItem(question.id, it.id, 'text', e.target.value)}
                                        className={cn("flex-1 text-base", errors[`question_${question.id}_ordering_${it.id}`] && 'border-red-500')}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {question.question_type === 'matching' && (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <label className="text-sm font-medium">Matching Pairs</label>
                                  <Button size="sm" variant="secondary" onClick={() => addMatchingPair(question.id)}>
                                    <Plus className="h-4 w-4 mr-1" /> Add Pair
                                  </Button>
                                </div>
                                {errors[`question_${question.id}_matching`] && (
                                  <p className="text-red-500 text-sm">{errors[`question_${question.id}_matching`]}</p>
                                )}
                                <div className="space-y-2">
                                  {(question.matching_pairs || []).map((p, pi) => (
                                    <div key={p.id} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <Input
                                        placeholder={`Left ${pi + 1}`}
                                        value={p.left_text}
                                        onChange={(e) => updateMatchingPair(question.id, p.id, 'left_text', e.target.value)}
                                        className={cn("text-base", errors[`question_${question.id}_matching_${p.id}`] && 'border-red-500')}
                                      />
                                      <Input
                                        placeholder={`Right ${pi + 1}`}
                                        value={p.right_text}
                                        onChange={(e) => updateMatchingPair(question.id, p.id, 'right_text', e.target.value)}
                                        className={cn("text-base", errors[`question_${question.id}_matching_${p.id}`] && 'border-red-500')}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

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

                            {(question.question_type?.startsWith('qcm_') || question.question_type === 'true_false') && (
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
                                      {question.question_type === 'true_false' ? (
                                        <Input value={choice.choice_text} disabled className="flex-1 text-base bg-gray-100" />
                                      ) : (
                                        <Input
                                          placeholder={`Choice ${choiceIndex + 1}`}
                                          value={choice.choice_text}
                                          onChange={(e) => updateChoice(question.id, choice.id, 'choice_text', e.target.value)}
                                          className="flex-1 text-base"
                                        />
                                      )}
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

                    <div className="pt-2">
                      <Button onClick={addQuestion} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Question
                      </Button>
                    </div>
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
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Grading Mode</label>
                      <p className="text-xs text-muted-foreground">
                        Choose automatic grading for supported question types or keep manual review.
                      </p>
                    </div>
                    {!autoGradingAvailable && (
                      <Badge variant="outline" className="text-xs font-normal">
                        Auto grading unavailable for this format
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={!autoGradingAvailable}
                      onClick={() => autoGradingAvailable && updateHomeworkData('auto_grade_qcm', true)}
                      className={cn(
                        "w-full p-4 border rounded-lg text-left transition",
                        homeworkData.auto_grade_qcm && autoGradingAvailable
                          ? "border-blue-500 bg-blue-50"
                          : "hover:border-blue-300",
                        !autoGradingAvailable && "cursor-not-allowed opacity-60"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <CheckSquare className="h-5 w-5 text-blue-600" />
                        <div className="font-semibold">Auto Grade</div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Instantly score QCM, True/False, Fill in the Blanks, Matching, and Ordering questions.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateHomeworkData('auto_grade_qcm', false)}
                      className={cn(
                        "w-full p-4 border rounded-lg text-left transition",
                        !homeworkData.auto_grade_qcm ? "border-slate-500 bg-slate-50" : "hover:border-slate-400"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-slate-600" />
                        <div className="font-semibold">Manual Grade</div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Keep submissions for teacher review before releasing scores.
                      </p>
                    </button>
                  </div>
                  {homeworkData.auto_grade_qcm && !hasAutoGradableQuestions && (
                    <p className="text-xs text-amber-600">
                      Add at least one auto-gradable question (QCM, True/False, Fill in the Blanks, Matching, Ordering) to enable instant scoring.
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Auto grading supports: QCM (single/multiple), True/False, Fill in the Blanks, Matching, Ordering. Other questions stay for manual grading.
                  </p>
                </div>

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
                      value={totalQuestionPoints}
                      readOnly
                      className="text-base bg-gray-50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Calculated from all question points. Update questions to change this total.
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
                      <p className="text-base">{teacherSubject?.name || 'Not assigned'}</p>
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
                        {totalQuestionPoints} points / {homeworkData.estimated_duration} minutes
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content Summary */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Content Summary</h3>
                  {(homeworkData.homework_format === 'qcm_only' || homeworkData.homework_format === 'open_only' || homeworkData.homework_format === 'mixed') && (
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
                    <div className="flex justify-between">
                      <span>Grading:</span>
                      <span className={gradingIsAuto ? "text-green-600" : "text-gray-700"}>
                        {gradingIsAuto ? 'Auto (instant for supported types)' : 'Manual review'}
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
