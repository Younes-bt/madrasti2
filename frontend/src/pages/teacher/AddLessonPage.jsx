import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { TeacherPageLayout } from '../../components/teacher/layout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import { 
  Save, 
  ArrowLeft, 
  Upload, 
  X, 
  Plus,
  BookOpen,
  Users,
  Clock,
  FileText,
  Video,
  Image,
  Link
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import { cn } from '../../lib/utils'

const AddLessonPage = () => {
  const { t, isRTL } = useLanguage()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    class: '',
    duration: '',
    type: '',
    status: 'draft',
    objectives: [''],
    materials: [],
    content: '',
    resources: []
  })
  
  const [formErrors, setFormErrors] = useState({})

  // Mock data for dropdowns
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology', 'History']
  const classes = ['Grade 10A', 'Grade 10B', 'Grade 11A', 'Grade 11B', 'Grade 12A', 'Grade 12B']
  const lessonTypes = [
    { value: 'lecture', label: 'Lecture' },
    { value: 'laboratory', label: 'Laboratory' },
    { value: 'discussion', label: 'Discussion' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'project', label: 'Project' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleObjectiveChange = (index, value) => {
    const newObjectives = [...formData.objectives]
    newObjectives[index] = value
    setFormData(prev => ({
      ...prev,
      objectives: newObjectives
    }))
  }

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }))
  }

  const removeObjective = (index) => {
    if (formData.objectives.length > 1) {
      const newObjectives = formData.objectives.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        objectives: newObjectives
      }))
    }
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const newMaterials = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }))
    
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, ...newMaterials]
    }))
  }

  const removeMaterial = (materialId) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter(material => material.id !== materialId)
    }))
  }

  const addResource = (type) => {
    const newResource = {
      id: Date.now() + Math.random(),
      type: type,
      title: '',
      url: '',
      description: ''
    }
    
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, newResource]
    }))
  }

  const updateResource = (resourceId, field, value) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.map(resource => 
        resource.id === resourceId ? { ...resource, [field]: value } : resource
      )
    }))
  }

  const removeResource = (resourceId) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter(resource => resource.id !== resourceId)
    }))
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.title.trim()) {
      errors.title = 'Lesson title is required'
    }
    
    if (!formData.subject) {
      errors.subject = 'Subject is required'
    }
    
    if (!formData.class) {
      errors.class = 'Class is required'
    }
    
    if (!formData.duration || formData.duration <= 0) {
      errors.duration = 'Duration must be greater than 0'
    }
    
    if (!formData.type) {
      errors.type = 'Lesson type is required'
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required'
    }
    
    return errors
  }

  const handleSubmit = async (status) => {
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const lessonData = {
        ...formData,
        status: status,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
      
      console.log('Creating lesson:', lessonData)
      
      // Navigate back to lessons list
      navigate('/teacher/content/lessons')
    } catch (error) {
      console.error('Error creating lesson:', error)
    } finally {
      setLoading(false)
    }
  }

  const getResourceIcon = (type) => {
    switch (type) {
      case 'video': return Video
      case 'image': return Image
      case 'link': return Link
      default: return FileText
    }
  }

  return (
    <TeacherPageLayout
      title="Create New Lesson"
      subtitle="Design and create engaging lesson content for your students"
      showBackButton={true}
      backButtonPath="/teacher/content/lessons"
      actions={[
        <Button 
          key="save-draft" 
          variant="outline" 
          onClick={() => handleSubmit('draft')}
          disabled={loading}
        >
          <Save className="h-4 w-4 mr-2" />
          Save as Draft
        </Button>,
        <Button 
          key="publish" 
          onClick={() => handleSubmit('published')}
          disabled={loading}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Publish Lesson
        </Button>
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Lesson Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter lesson title..."
                  className={formErrors.title ? 'border-red-500' : ''}
                />
                {formErrors.title && (
                  <p className="text-sm text-red-500">{formErrors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what students will learn in this lesson..."
                  rows={3}
                  className={formErrors.description ? 'border-red-500' : ''}
                />
                {formErrors.description && (
                  <p className="text-sm text-red-500">{formErrors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Select 
                    value={formData.subject} 
                    onValueChange={(value) => handleInputChange('subject', value)}
                  >
                    <SelectTrigger className={formErrors.subject ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.subject && (
                    <p className="text-sm text-red-500">{formErrors.subject}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Class *</Label>
                  <Select 
                    value={formData.class} 
                    onValueChange={(value) => handleInputChange('class', value)}
                  >
                    <SelectTrigger className={formErrors.class ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.class && (
                    <p className="text-sm text-red-500">{formErrors.class}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="45"
                    min="1"
                    className={formErrors.duration ? 'border-red-500' : ''}
                  />
                  {formErrors.duration && (
                    <p className="text-sm text-red-500">{formErrors.duration}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Lesson Type *</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => handleInputChange('type', value)}
                  >
                    <SelectTrigger className={formErrors.type ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {lessonTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.type && (
                    <p className="text-sm text-red-500">{formErrors.type}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={objective}
                      onChange={(e) => handleObjectiveChange(index, e.target.value)}
                      placeholder={`Learning objective ${index + 1}...`}
                      className="flex-1"
                    />
                    {formData.objectives.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeObjective(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addObjective}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Objective
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lesson Content */}
          <Card>
            <CardHeader>
              <CardTitle>Lesson Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Write your lesson content here..."
                  rows={8}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Materials Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Materials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload lesson materials
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                />
                <Button variant="outline" size="sm" onClick={() => document.getElementById('file-upload').click()}>
                  Choose Files
                </Button>
              </div>

              {formData.materials.length > 0 && (
                <div className="space-y-2">
                  {formData.materials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{material.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMaterial(material.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addResource('video')}
                  className="flex-1"
                >
                  <Video className="h-4 w-4 mr-1" />
                  Video
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addResource('link')}
                  className="flex-1"
                >
                  <Link className="h-4 w-4 mr-1" />
                  Link
                </Button>
              </div>

              {formData.resources.map((resource) => {
                const Icon = getResourceIcon(resource.type)
                return (
                  <div key={resource.id} className="border rounded p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <Badge variant="outline">{resource.type}</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeResource(resource.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Resource title"
                      value={resource.title}
                      onChange={(e) => updateResource(resource.id, 'title', e.target.value)}
                    />
                    <Input
                      placeholder="URL"
                      value={resource.url}
                      onChange={(e) => updateResource(resource.id, 'url', e.target.value)}
                    />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </TeacherPageLayout>
  )
}

export default AddLessonPage