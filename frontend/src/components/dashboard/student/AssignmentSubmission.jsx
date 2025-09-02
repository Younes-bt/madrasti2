import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Textarea } from '../../ui/textarea'
import { Progress } from '../../ui/progress'
import { useLanguage } from '../../../hooks/useLanguage'
import {
  Upload,
  File,
  X,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Send,
  Save,
  ArrowLeft,
  FileText,
  Image,
  Video,
  Music,
  Archive
} from 'lucide-react'

const AssignmentSubmission = ({ assignment, onBack, onSubmit }) => {
  const { t } = useLanguage()
  const fileInputRef = useRef(null)
  
  const [submission, setSubmission] = useState({
    text_response: '',
    files: [],
    notes: ''
  })
  
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  // File type configurations
  const allowedFileTypes = {
    document: {
      extensions: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
      maxSize: 10 * 1024 * 1024, // 10MB
      icon: FileText,
      color: 'text-blue-600'
    },
    image: {
      extensions: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'],
      maxSize: 5 * 1024 * 1024, // 5MB
      icon: Image,
      color: 'text-green-600'
    },
    video: {
      extensions: ['.mp4', '.avi', '.mov', '.wmv', '.flv'],
      maxSize: 50 * 1024 * 1024, // 50MB
      icon: Video,
      color: 'text-red-600'
    },
    audio: {
      extensions: ['.mp3', '.wav', '.ogg', '.m4a'],
      maxSize: 20 * 1024 * 1024, // 20MB
      icon: Music,
      color: 'text-purple-600'
    },
    archive: {
      extensions: ['.zip', '.rar', '.7z', '.tar'],
      maxSize: 25 * 1024 * 1024, // 25MB
      icon: Archive,
      color: 'text-orange-600'
    }
  }

  const getFileType = (fileName) => {
    const extension = '.' + fileName.split('.').pop().toLowerCase()
    for (const [type, config] of Object.entries(allowedFileTypes)) {
      if (config.extensions.includes(extension)) {
        return type
      }
    }
    return 'document' // Default
  }

  const getFileIcon = (fileName) => {
    const fileType = getFileType(fileName)
    const IconComponent = allowedFileTypes[fileType].icon
    return <IconComponent className={`h-4 w-4 ${allowedFileTypes[fileType].color}`} />
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file) => {
    const fileType = getFileType(file.name)
    const config = allowedFileTypes[fileType]
    
    if (file.size > config.maxSize) {
      return {
        valid: false,
        error: `${t('submission.fileTooLarge')} (${formatFileSize(config.maxSize)} max)`
      }
    }
    
    return { valid: true }
  }

  const handleFileSelect = (files) => {
    const validFiles = []
    const errors = []
    
    Array.from(files).forEach(file => {
      const validation = validateFile(file)
      if (validation.valid) {
        const fileData = {
          id: Date.now() + Math.random(),
          file: file,
          name: file.name,
          size: file.size,
          type: getFileType(file.name),
          uploaded: false
        }
        validFiles.push(fileData)
      } else {
        errors.push(`${file.name}: ${validation.error}`)
      }
    })
    
    if (errors.length > 0) {
      alert(errors.join('\n'))
    }
    
    setSubmission(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles]
    }))
  }

  const handleFileRemove = (fileId) => {
    setSubmission(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileId)
    }))
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const simulateUpload = (file) => {
    return new Promise((resolve) => {
      setIsUploading(true)
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        setUploadProgress(Math.min(progress, 100))
        
        if (progress >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadProgress(0)
          resolve()
        }
      }, 200)
    })
  }

  const handleSaveDraft = async () => {
    console.log('Saving draft:', submission)
    // API call to save draft
  }

  const handleSubmitAssignment = async () => {
    if (!submission.text_response.trim() && submission.files.length === 0) {
      alert(t('submission.pleaseProvideResponse'))
      return
    }

    // Upload files first
    for (const fileData of submission.files) {
      if (!fileData.uploaded) {
        await simulateUpload(fileData.file)
        fileData.uploaded = true
      }
    }

    const submissionData = {
      assignment_id: assignment.id,
      text_response: submission.text_response,
      files: submission.files.map(f => ({
        name: f.name,
        size: f.size,
        type: f.type
      })),
      notes: submission.notes,
      submitted_at: new Date().toISOString()
    }

    console.log('Submitting assignment:', submissionData)
    onSubmit?.(submissionData)
  }

  const getTimeRemaining = () => {
    const now = new Date()
    const due = new Date(assignment.due_date)
    const diff = due - now
    
    if (diff < 0) return { expired: true, text: t('submission.timeExpired') }
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return {
      expired: false,
      text: `${hours}h ${minutes}m ${t('common.remaining')}`,
      isUrgent: hours < 1
    }
  }

  const timeInfo = getTimeRemaining()
  const wordCount = submission.text_response.split(/\s+/).filter(word => word.length > 0).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t('common.back')}
            </Button>
            <Badge variant={timeInfo.expired ? 'destructive' : timeInfo.isUrgent ? 'secondary' : 'outline'}>
              <Clock className="h-4 w-4 mr-1" />
              {timeInfo.text}
            </Badge>
          </div>
          
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              {assignment.title}
            </CardTitle>
            <CardDescription className="mt-2">
              {assignment.description}
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
            <span>{t('submission.totalPoints')}: {assignment.total_points}</span>
            <span>{t('submission.maxAttempts')}: {assignment.max_attempts}</span>
            {assignment.time_limit && (
              <span>{t('submission.timeLimit')}: {assignment.time_limit} min</span>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Text Response */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('submission.textResponse')}</CardTitle>
          <CardDescription>
            {t('submission.textResponseDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder={t('submission.enterResponse')}
            value={submission.text_response}
            onChange={(e) => setSubmission(prev => ({ ...prev, text_response: e.target.value }))}
            className="min-h-[200px] resize-y"
          />
          <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
            <span>{t('submission.wordCount')}: {wordCount}</span>
            {wordCount > 0 && (
              <span className={wordCount < 100 ? 'text-orange-600' : 'text-green-600'}>
                {wordCount < 100 ? t('submission.considerExpanding') : t('submission.goodLength')}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('submission.attachments')}</CardTitle>
          <CardDescription>
            {t('submission.attachmentsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              {t('submission.dragAndDrop')}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              {t('submission.chooseFiles')}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">{t('submission.uploading')}</span>
                <span className="text-sm">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* File List */}
          {submission.files.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-sm">{t('submission.attachedFiles')}</h4>
              {submission.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-card"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.name)}
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {t(`submission.fileType.${file.type}`)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.uploaded && (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileRemove(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* File Type Guidelines */}
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <h4 className="font-medium text-sm mb-2">{t('submission.allowedFileTypes')}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {Object.entries(allowedFileTypes).map(([type, config]) => (
                <div key={type} className="flex items-center gap-1">
                  <config.icon className={`h-3 w-3 ${config.color}`} />
                  <span>{t(`submission.fileType.${type}`)}: {formatFileSize(config.maxSize)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('submission.additionalNotes')}</CardTitle>
          <CardDescription>
            {t('submission.notesDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder={t('submission.enterNotes')}
            value={submission.notes}
            onChange={(e) => setSubmission(prev => ({ ...prev, notes: e.target.value }))}
            className="min-h-[100px] resize-y"
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={handleSaveDraft}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {t('submission.saveDraft')}
        </Button>
        
        <Button
          onClick={handleSubmitAssignment}
          disabled={isUploading || timeInfo.expired}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          {t('submission.submitAssignment')}
        </Button>
      </div>

      {timeInfo.expired && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">{t('submission.submissionClosed')}</span>
        </div>
      )}
    </div>
  )
}

export default AssignmentSubmission