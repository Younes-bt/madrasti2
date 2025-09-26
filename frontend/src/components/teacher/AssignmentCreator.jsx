import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import assignmentService from '../../services/assignments'
console.log('assignmentService in AssignmentCreator:', assignmentService)
import { apiMethods } from '../../services/api'
import attendanceService from '../../services/attendance'
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
import {
  X,
  Plus,
  Clock,
  Calendar,
  Target,
  Settings,
  AlertCircle,
  Save,
  BookOpen,
  Users,
  FileText,
  Trophy,
  Wrench
} from 'lucide-react'
import { cn } from '../../lib/utils'

const AssignmentCreator = ({ isOpen, onClose, onSave, initialData = null }) => {
  const { t, isRTL } = useLanguage()

  // Error boundary state
  const [componentError, setComponentError] = useState(null)
  const [loadingTimeout, setLoadingTimeout] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    title_arabic: '',
    description: '',
    instructions: '',
    homework_type: 'homework',
    homework_format: 'mixed',
    subject: '',
    grade: '',
    school_class: '',
    lesson: '',
    due_date: '',
    total_points: 100,
    time_limit: '',
    max_attempts: 1,
    is_published: false,
    shuffle_questions: false,
    show_results_immediately: true,
    allow_late_submission: true,
    late_penalty_percentage: 0,
    availability_start: '',
    availability_end: ''
  })

  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Real data from API
  const [subjects, setSubjects] = useState([])
  const [grades, setGrades] = useState([])
  const [classes, setClasses] = useState([])
  const [academicYears, setAcademicYears] = useState([])

  // Fetch reference data
  const fetchReferenceData = async () => {
    try {
      setLoading(true)

      // Get teacher's actual classes from timetable sessions (same as My Classes page)
      console.log('Fetching teacher classes from timetable sessions for homework creation...')
      const teacherSessionsResponse = await attendanceService.getTimetableSessions({ my_sessions: 'true' })
      console.log('Teacher timetable sessions response:', teacherSessionsResponse)

      // Also fetch academic years and subjects
      const [academicYearsResponse, subjectsResponse] = await Promise.all([
        apiMethods.get('schools/academic-years/'),
        apiMethods.get('schools/subjects/')
      ])

      // Process teacher's classes from timetable sessions
      const sessionsData = teacherSessionsResponse.results || teacherSessionsResponse.data || teacherSessionsResponse || []
      console.log('Raw sessions data:', sessionsData)

      if (!Array.isArray(sessionsData) || sessionsData.length === 0) {
        console.warn('No timetable sessions found for teacher')
        setApiError('No teaching sessions found. Please contact admin to set up your timetable.')
        return
      }

      const classesMap = new Map()

      sessionsData.forEach((session, index) => {
        console.log(`Processing session ${index + 1}:`, session)

        if (session.class_name && session.school_class_id && session.grade_id) {
          const classId = session.school_class_id
          if (!classesMap.has(classId)) {
            // Create a class object compatible with homework creation
            const classData = {
              id: classId,
              name: session.class_name || 'Unknown Class',
              section: session.class_section || '',
              grade: {
                id: session.grade_id,
                name: session.grade_name || 'Unknown Grade',
                grade_number: session.grade_number || 0,
                educational_level: {
                  id: session.educational_level_id || 0,
                  name: session.educational_level_name || 'Unknown Level',
                  level: session.educational_level_code || 'UNKNOWN'
                }
              },
              academic_year: session.academic_year ? {
                id: 0,
                year: session.academic_year
              } : null
            }
            console.log('Adding class:', classData)
            classesMap.set(classId, classData)
          }
        } else {
          console.warn(`Session ${index + 1} missing required data:`, {
            class_name: session.class_name,
            school_class_id: session.school_class_id,
            grade_id: session.grade_id
          })
        }
      })

      const classesData = Array.from(classesMap.values())
      console.log('Teacher classes for homework creation:', classesData)

      let academicYearsData = academicYearsResponse.results || (Array.isArray(academicYearsResponse) ? academicYearsResponse : academicYearsResponse.data?.results || academicYearsResponse.data || [])
      let subjectsData = subjectsResponse.results || (Array.isArray(subjectsResponse) ? subjectsResponse : subjectsResponse.data?.results || subjectsResponse.data || [])

      setClasses(classesData)
      setAcademicYears(academicYearsData)
      setSubjects(subjectsData)

      // Extract unique grades from teacher's classes
      console.log('Classes data received:', classesData)
      const validClasses = classesData.filter(cls => cls && cls.grade && cls.grade.id != null)
      console.log('Valid classes with grades:', validClasses)

      const uniqueGrades = [...new Map(
        validClasses.map(cls => [cls.grade.id, cls.grade])
      ).values()]

      console.log('Unique grades extracted:', uniqueGrades)
      setGrades(uniqueGrades)

    } catch (error) {
      console.error('Failed to fetch reference data:', error)
      setApiError('Failed to load school data')
    } finally {
      setLoading(false)
    }
  }

  // Get assignment types and formats from service
  const assignmentTypesConfig = assignmentService.getAssignmentTypes() || []
  const assignmentFormats = assignmentService.getAssignmentFormats() || []

  // Icon mapping
  const iconMap = {
    BookOpen,
    Users,
    Clock: Clock,
    FileText,
    Trophy,
    Settings: Wrench,
    Wrench
  }

  // Safe assignment types with icon mapping
  const assignmentTypes = assignmentTypesConfig.map(type => ({
    ...type,
    icon: iconMap[type?.icon] || BookOpen
  }))

  // Fetch data when component mounts
  useEffect(() => {
    fetchReferenceData()

    // Set a timeout to handle cases where data doesn't load
    const timeout = setTimeout(() => {
      setLoadingTimeout(true)
    }, 10000) // 10 seconds timeout

    return () => clearTimeout(timeout)
  }, [])

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      // Clear any component errors
      setComponentError(null)
      setLoadingTimeout(false)

      if (initialData) {
        setFormData({
          ...initialData,
          due_date: initialData.due_date?.split('T')[0] || '',
          availability_start: initialData.availability_start?.split('T')[0] || '',
          availability_end: initialData.availability_end?.split('T')[0] || '',
        })
      } else {
        // Reset form for new assignment
        setFormData({
          title: '',
          title_arabic: '',
          description: '',
          instructions: '',
          homework_type: 'homework',
          homework_format: 'mixed',
          subject: '',
          grade: '',
          school_class: '',
          lesson: '',
          due_date: '',
          total_points: 100,
          time_limit: '',
          max_attempts: 1,
          is_published: false,
          shuffle_questions: false,
          show_results_immediately: true,
          allow_late_submission: true,
          late_penalty_percentage: 0,
          availability_start: '',
          availability_end: ''
        })
      }
      setErrors({})
      setApiError(null)
    }
  }, [isOpen, initialData])

  // Update time limit when assignment type changes
  useEffect(() => {
    const selectedType = assignmentTypes.find(type => type.id === formData.homework_type)
    if (selectedType?.defaultTimeLimit && !formData.time_limit) {
      setFormData(prev => ({
        ...prev,
        time_limit: selectedType.defaultTimeLimit
      }))
    }
  }, [formData.homework_type])

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Assignment title is required'
    }

    if (!formData.subject) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.grade) {
      newErrors.grade = 'Grade is required'
    }

    if (!formData.school_class) {
      newErrors.school_class = 'Class is required'
    }

    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required'
    }

    if (formData.total_points <= 0) {
      newErrors.total_points = 'Total points must be greater than 0'
    }

    if (formData.time_limit && formData.time_limit <= 0) {
      newErrors.time_limit = 'Time limit must be greater than 0'
    }

    if (formData.max_attempts <= 0) {
      newErrors.max_attempts = 'Max attempts must be greater than 0'
    }

    if (formData.late_penalty_percentage < 0 || formData.late_penalty_percentage > 100) {
      newErrors.late_penalty_percentage = 'Late penalty must be between 0 and 100'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setSaving(true)
    setApiError(null)

    try {
      let result
      if (initialData?.id) {
        // Update existing assignment
        result = await assignmentService.updateAssignment(initialData.id, formData)
      } else {
        // Create new assignment
        result = await assignmentService.createAssignment(formData)
      }

      if (result.success) {
        onSave?.(result.data)
        onClose()
      } else {
        setApiError(result.error)
      }
    } catch (error) {
      console.error('Error saving assignment:', error)
      setApiError('Failed to save assignment')
    } finally {
      setSaving(false)
    }
  }

  const getSelectedTypeInfo = () => {
    return assignmentTypes.find(type => type.id === formData.homework_type)
  }

  const getSelectedFormatInfo = () => {
    return assignmentFormats.find(format => format.id === formData.homework_format)
  }

  const filteredClasses = classes.filter(cls => {
    if (!formData.grade) return true
    if (!cls || !cls.grade || cls.grade.id == null) return false
    try {
      return cls.grade.id.toString() === formData.grade.toString()
    } catch (error) {
      console.error('Error filtering classes:', cls, error)
      return false
    }
  })

  if (!isOpen) return null

  // Error boundary fallback
  if (componentError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">Component Error</h3>
          <p className="text-sm text-gray-600 mb-4">Something went wrong with the assignment form.</p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => setComponentError(null)}>
              Try Again
            </Button>
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Prevent rendering if essential data is not loaded to avoid errors
  const isDataReady = subjects.length > 0 && assignmentTypes.length > 0 && assignmentFormats.length > 0

  if (!isDataReady && !loadingTimeout) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assignment form...</p>
          <p className="text-xs text-gray-500 mt-2">
            Loading: {subjects.length === 0 ? 'subjects' : ''}
            {assignmentTypes.length === 0 ? ' types' : ''}
            {assignmentFormats.length === 0 ? ' formats' : ''}
          </p>
        </div>
      </div>
    )
  }

  // If loading timed out, show error
  if (loadingTimeout && !isDataReady) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">Loading Failed</h3>
          <p className="text-sm text-gray-600 mb-4">
            Failed to load form data. Please check your connection and try again.
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => {
              setLoadingTimeout(false)
              fetchReferenceData()
            }}>
              Retry
            </Button>
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    )
  }

  try {
    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold">
              {initialData ? 'Edit Assignment' : 'Create New Assignment'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {initialData ? 'Update assignment details' : 'Create a new assignment for your students'}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* API Error Display */}
        {apiError && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <span className="text-red-700 text-sm">{apiError}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mx-6 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-blue-700 text-sm">Loading school data...</span>
          </div>
        )}

        {/* Form Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Assignment Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="Enter assignment title"
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <Label htmlFor="title_arabic">Title (Arabic)</Label>
                    <Input
                      id="title_arabic"
                      value={formData.title_arabic}
                      onChange={(e) => handleChange('title_arabic', e.target.value)}
                      placeholder="عنوان المهمة"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Describe the assignment objectives and content"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={formData.instructions}
                    onChange={(e) => handleChange('instructions', e.target.value)}
                    placeholder="Provide detailed instructions for students"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Assignment Type & Format */}
            <Card>
              <CardHeader>
                <CardTitle>Assignment Type & Format</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Assignment Type</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {assignmentTypes && assignmentTypes.length > 0 ? assignmentTypes.filter(type => type && type.id).map((type) => {
                      const Icon = iconMap[type.icon] || BookOpen
                      return (
                        <div
                          key={type.id}
                          className={cn(
                            'p-3 rounded-lg border cursor-pointer transition-all',
                            formData.homework_type === type.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          )}
                          onClick={() => handleChange('homework_type', type.id))
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={cn('p-1 rounded text-white text-xs', type.color || 'bg-gray-500')}>
                              <Icon className="h-3 w-3" />
                            </div>
                            <span className="font-medium text-sm">{type.name || 'Unknown'}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{type.description || 'No description'}</p>
                        </div>
                      )
                    }) : (
                      <div className="col-span-full p-4 text-center text-gray-500">
                        <p>Loading assignment types...</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="homework_format">Assignment Format</Label>
                  <Select value={formData.homework_format} onValueChange={(value) => handleChange('homework_format', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignmentFormats && assignmentFormats.length > 0 ? assignmentFormats.filter(format => format && format.id).map((format) => (
                        <SelectItem key={format.id} value={format.id}>
                          {format.name || 'Unknown'} - {format.description || 'No description'}
                        </SelectItem>
                      )) : (
                        <SelectItem value="" disabled>Loading formats...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Class Information */}
            <Card>
              <CardHeader>
                <CardTitle>Class Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Select value={formData.subject} onValueChange={(value) => handleChange('subject', value)}>
                      <SelectTrigger className={errors.subject ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects && subjects.length > 0 ? subjects
                          .filter(subject => subject && subject.id != null)
                          .map((subject) => {
                            try {
                              return (
                                <SelectItem key={subject.id} value={subject.id.toString()}>
                                  {subject.name || 'Unnamed Subject'}
                                </SelectItem>
                              )
                            } catch (error) {
                              console.error('Error rendering subject item:', subject, error)
                              return null
                            }
                          })
                          .filter(Boolean) : (
                          <SelectItem value="" disabled>Loading subjects...</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                  </div>

                  <div>
                    <Label htmlFor="grade">Grade *</Label>
                    <Select value={formData.grade} onValueChange={(value) => handleChange('grade', value)}>
                      <SelectTrigger className={errors.grade ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {grades && grades.length > 0 ? grades
                          .filter(grade => {
                            if (!grade) {
                              console.warn('Found null/undefined grade in grades array')
                              return false
                            }
                            if (grade.id == null || grade.id === undefined) {
                              console.warn('Found grade with null/undefined id:', grade)
                              return false
                            }
                            return true
                          })
                          .map((grade) => {
                            try {
                              return (
                                <SelectItem key={grade.id} value={grade.id.toString()}>
                                  {grade.name || 'Unnamed Grade'}
                                </SelectItem>
                              )
                            } catch (error) {
                              console.error('Error rendering grade item:', grade, error)
                              return null
                            }
                          })
                          .filter(Boolean) : (
                          <SelectItem value="" disabled>Loading grades...</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade}</p>}
                  </div>

                  <div>
                    <Label htmlFor="school_class">Class *</Label>
                    <Select value={formData.school_class} onValueChange={(value) => handleChange('school_class', value)}>
                      <SelectTrigger className={errors.school_class ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredClasses && filteredClasses.length > 0 ? filteredClasses
                          .filter(cls => cls && cls.id != null)
                          .map((cls) => {
                            try {
                              return (
                                <SelectItem key={cls.id} value={cls.id.toString()}>
                                  {cls.name || 'Unnamed Class'}
                                </SelectItem>
                              )
                            } catch (error) {
                              console.error('Error rendering class item:', cls, error)
                              return null
                            }
                          })
                          .filter(Boolean) : (
                          <SelectItem value="" disabled>
                            {formData.grade ? 'No classes available for selected grade' : 'Select grade first'}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.school_class && <p className="text-red-500 text-xs mt-1">{errors.school_class}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timing & Scoring */}
            <Card>
              <CardHeader>
                <CardTitle>Timing & Scoring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="due_date">Due Date *</Label>
                    <Input
                      id="due_date"
                      type="datetime-local"
                      value={formData.due_date}
                      onChange={(e) => handleChange('due_date', e.target.value)}
                      className={errors.due_date ? 'border-red-500' : ''}
                    />
                    {errors.due_date && <p className="text-red-500 text-xs mt-1">{errors.due_date}</p>}
                  </div>

                  <div>
                    <Label htmlFor="total_points">Total Points *</Label>
                    <Input
                      id="total_points"
                      type="number"
                      value={formData.total_points}
                      onChange={(e) => handleChange('total_points', parseInt(e.target.value) || 0)}
                      min="1"
                      className={errors.total_points ? 'border-red-500' : ''}
                    />
                    {errors.total_points && <p className="text-red-500 text-xs mt-1">{errors.total_points}</p>}
                  </div>

                  <div>
                    <Label htmlFor="time_limit">Time Limit (minutes)</Label>
                    <Input
                      id="time_limit"
                      type="number"
                      value={formData.time_limit}
                      onChange={(e) => handleChange('time_limit', e.target.value ? parseInt(e.target.value) : '')}
                      min="1"
                      placeholder="No limit"
                      className={errors.time_limit ? 'border-red-500' : ''}
                    />
                    {errors.time_limit && <p className="text-red-500 text-xs mt-1">{errors.time_limit}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="max_attempts">Max Attempts</Label>
                    <Input
                      id="max_attempts"
                      type="number"
                      value={formData.max_attempts}
                      onChange={(e) => handleChange('max_attempts', parseInt(e.target.value) || 1)}
                      min="1"
                      className={errors.max_attempts ? 'border-red-500' : ''}
                    />
                    {errors.max_attempts && <p className="text-red-500 text-xs mt-1">{errors.max_attempts}</p>}
                  </div>

                  <div>
                    <Label htmlFor="late_penalty_percentage">Late Penalty (%)</Label>
                    <Input
                      id="late_penalty_percentage"
                      type="number"
                      value={formData.late_penalty_percentage}
                      onChange={(e) => handleChange('late_penalty_percentage', parseInt(e.target.value) || 0)}
                      min="0"
                      max="100"
                      className={errors.late_penalty_percentage ? 'border-red-500' : ''}
                    />
                    {errors.late_penalty_percentage && <p className="text-red-500 text-xs mt-1">{errors.late_penalty_percentage}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Format-Specific Content */}
            {getSelectedFormatInfo()?.allowsQuestions && (
              <Card>
                <CardHeader>
                  <CardTitle>Questions & Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Plus className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Questions will be added after creating the assignment</span>
                    </div>
                    <p className="text-sm text-blue-600">
                      Once the assignment is created, you'll be able to add {
                        getSelectedFormatInfo()?.questionTypes && Array.isArray(getSelectedFormatInfo().questionTypes) ?
                          getSelectedFormatInfo().questionTypes.map(type => type.replace('_', ' ')).join(', ') :
                          'various types of'
                      } questions to this assignment.
                    </p>
                  </div>

                  {formData.homework_format === 'qcm_only' && (
                    <div className="space-y-2">
                      <Label>QCM Settings</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="auto_grade_qcm"
                            checked={true}
                            disabled
                          />
                          <Label htmlFor="auto_grade_qcm" className="text-sm">Auto-grade QCM questions</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="randomize_choices"
                            checked={formData.shuffle_questions}
                            onCheckedChange={(checked) => handleChange('shuffle_questions', checked)}
                          />
                          <Label htmlFor="randomize_choices" className="text-sm">Randomize answer choices</Label>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.homework_format === 'open_only' && (
                    <div className="space-y-2">
                      <Label>Open Questions Settings</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="manual_grading"
                            checked={true}
                            disabled
                          />
                          <Label htmlFor="manual_grading" className="text-sm">Requires manual grading</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="allow_file_upload"
                            checked={true}
                            disabled
                          />
                          <Label htmlFor="allow_file_upload" className="text-sm">Allow file uploads</Label>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {formData.homework_format === 'book_exercises' && (
              <Card>
                <CardHeader>
                  <CardTitle>Book Exercises</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Textbook exercises will be configured after creation</span>
                    </div>
                    <p className="text-sm text-green-600">
                      You'll be able to specify textbook references, page numbers, and exercise details after creating the assignment.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {formData.homework_format === 'project' && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-purple-800">Project-based assessment</span>
                    </div>
                    <p className="text-sm text-purple-600">
                      Students will submit project files. Consider extending the due date and allowing multiple submission attempts for project work.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Project Settings</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="allow_multiple_files"
                          checked={true}
                          disabled
                        />
                        <Label htmlFor="allow_multiple_files" className="text-sm">Allow multiple file uploads</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="peer_review"
                          checked={false}
                          disabled
                        />
                        <Label htmlFor="peer_review" className="text-sm">Enable peer review (coming soon)</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {formData.homework_format === 'practical' && (
              <Card>
                <CardHeader>
                  <CardTitle>Practical Work</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Wrench className="h-4 w-4 text-cyan-600" />
                      <span className="font-medium text-cyan-800">Laboratory or hands-on work</span>
                    </div>
                    <p className="text-sm text-cyan-600">
                      Practical assignments can include both question-based assessments and file submissions for lab reports or practical demonstrations.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Assignment Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => handleChange('is_published', checked)}
                    />
                    <Label htmlFor="is_published">Publish immediately</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="shuffle_questions"
                      checked={formData.shuffle_questions}
                      onCheckedChange={(checked) => handleChange('shuffle_questions', checked)}
                    />
                    <Label htmlFor="shuffle_questions">Shuffle questions order</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show_results_immediately"
                      checked={formData.show_results_immediately}
                      onCheckedChange={(checked) => handleChange('show_results_immediately', checked)}
                    />
                    <Label htmlFor="show_results_immediately">Show results immediately after submission</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow_late_submission"
                      checked={formData.allow_late_submission}
                      onCheckedChange={(checked) => handleChange('allow_late_submission', checked)}
                    />
                    <Label htmlFor="allow_late_submission">Allow late submissions</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t flex-shrink-0">
          <div className="text-sm text-muted-foreground">
            {getSelectedTypeInfo()?.name || 'Unknown Type'} • {getSelectedFormatInfo()?.name || 'Unknown Format'}
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
                  {initialData ? 'Update' : 'Create'} Assignment
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
    )
  } catch (error) {
    console.error('AssignmentCreator render error:', error)
    // Set error state to trigger error boundary fallback
    setComponentError(error.message)
    return null
  }
}

export default AssignmentCreator