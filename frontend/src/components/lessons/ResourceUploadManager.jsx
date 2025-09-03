import React, { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useLanguage } from '../../hooks/useLanguage'
import { 
  Upload,
  File,
  FileText,
  Image as ImageIcon,
  Video,
  Mic,
  Archive,
  Link,
  Plus,
  X,
  Eye,
  Download,
  Share2,
  Edit,
  Trash2,
  Copy,
  Move,
  Folder,
  FolderPlus,
  Search,
  Filter,
  Grid3X3,
  List,
  Clock,
  User,
  Tag,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Settings,
  MoreHorizontal,
  ExternalLink,
  Cloud,
  HardDrive,
  Zap,
  Lock,
  Globe
} from 'lucide-react'

const ResourceUploadManager = () => {
  const { t } = useLanguage()
  const [viewMode, setViewMode] = useState('grid') // grid, list
  const [selectedFolder, setSelectedFolder] = useState('root')
  const [selectedResources, setSelectedResources] = useState([])
  const [uploadProgress, setUploadProgress] = useState({})
  const [dragOver, setDragOver] = useState(false)
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const fileInputRef = useRef(null)
  const folderInputRef = useRef(null)

  const folders = [
    { id: 'root', name: t('resources.rootFolder'), parent: null, path: '/', count: 15 },
    { id: 'videos', name: t('resources.videos'), parent: 'root', path: '/videos/', count: 8 },
    { id: 'images', name: t('resources.images'), parent: 'root', path: '/images/', count: 12 },
    { id: 'documents', name: t('resources.documents'), parent: 'root', path: '/documents/', count: 6 },
    { id: 'audio', name: t('resources.audio'), parent: 'root', path: '/audio/', count: 4 },
    { id: 'archives', name: t('resources.archives'), parent: 'root', path: '/archives/', count: 2 },
    { id: 'shared', name: t('resources.sharedWithMe'), parent: 'root', path: '/shared/', count: 7 }
  ]

  const resources = [
    {
      id: 1,
      name: 'Introduction_Video.mp4',
      type: 'video',
      size: 125000000, // bytes
      folder: 'videos',
      uploaded_at: '2024-09-01T10:30:00Z',
      uploaded_by: 'Mr. Alami',
      description: 'Introduction video for algebra lesson',
      tags: ['algebra', 'introduction', 'math'],
      status: 'uploaded', // uploading, uploaded, failed, processing
      thumbnail: null,
      duration: 1245, // seconds
      quality: '1080p',
      format: 'mp4',
      url: 'https://example.com/video.mp4',
      views: 234,
      downloads: 45,
      is_public: false,
      is_shared: true,
      access_level: 'class', // private, class, school, public
      metadata: {
        width: 1920,
        height: 1080,
        fps: 30,
        bitrate: 8000
      }
    },
    {
      id: 2,
      name: 'Algebra_Worksheet.pdf',
      type: 'document',
      size: 2300000,
      folder: 'documents',
      uploaded_at: '2024-09-02T14:15:00Z',
      uploaded_by: 'Mr. Alami',
      description: 'Practice worksheet with 20 algebra problems',
      tags: ['worksheet', 'practice', 'algebra'],
      status: 'uploaded',
      thumbnail: null,
      pages: 4,
      format: 'pdf',
      url: 'https://example.com/worksheet.pdf',
      views: 156,
      downloads: 89,
      is_public: true,
      is_shared: false,
      access_level: 'school',
      metadata: {
        author: 'Mr. Alami',
        created: '2024-09-02T14:00:00Z',
        modified: '2024-09-02T14:10:00Z'
      }
    },
    {
      id: 3,
      name: 'Chemical_Reactions.jpg',
      type: 'image',
      size: 5600000,
      folder: 'images',
      uploaded_at: '2024-08-28T09:45:00Z',
      uploaded_by: 'Dr. Alaoui',
      description: 'Diagram showing different types of chemical reactions',
      tags: ['chemistry', 'reactions', 'diagram'],
      status: 'uploaded',
      thumbnail: 'https://example.com/thumb.jpg',
      format: 'jpg',
      url: 'https://example.com/reactions.jpg',
      views: 298,
      downloads: 67,
      is_public: false,
      is_shared: true,
      access_level: 'class',
      metadata: {
        width: 2048,
        height: 1536,
        dpi: 300,
        color_space: 'RGB'
      }
    },
    {
      id: 4,
      name: 'Physics_Lecture.mp3',
      type: 'audio',
      size: 45000000,
      folder: 'audio',
      uploaded_at: '2024-08-25T16:20:00Z',
      uploaded_by: 'Mrs. Bennani',
      description: 'Audio recording of physics lecture on motion',
      tags: ['physics', 'lecture', 'motion'],
      status: 'processing',
      thumbnail: null,
      duration: 2700,
      format: 'mp3',
      url: 'https://example.com/lecture.mp3',
      views: 45,
      downloads: 12,
      is_public: false,
      is_shared: false,
      access_level: 'private',
      metadata: {
        bitrate: 128,
        sample_rate: 44100,
        channels: 2
      }
    },
    {
      id: 5,
      name: 'Lab_Equipment.zip',
      type: 'archive',
      size: 89000000,
      folder: 'archives',
      uploaded_at: '2024-08-30T11:10:00Z',
      uploaded_by: 'Dr. Alaoui',
      description: 'Collection of laboratory equipment images and manuals',
      tags: ['lab', 'equipment', 'manuals'],
      status: 'failed',
      thumbnail: null,
      format: 'zip',
      url: null,
      views: 0,
      downloads: 0,
      is_public: false,
      is_shared: false,
      access_level: 'private',
      metadata: {
        files_count: 45,
        compressed_size: 89000000,
        original_size: 156000000
      },
      error_message: 'Upload failed due to network timeout'
    }
  ]

  const getFileIcon = (type, status = 'uploaded') => {
    const iconMap = {
      video: Video,
      image: ImageIcon,
      document: FileText,
      audio: Mic,
      archive: Archive,
      link: Link
    }
    
    if (status === 'processing') return RefreshCw
    if (status === 'failed') return AlertCircle
    
    return iconMap[type] || File
  }

  const getFileTypeColor = (type) => {
    const colorMap = {
      video: 'bg-red-100 text-red-800',
      image: 'bg-green-100 text-green-800',
      document: 'bg-blue-100 text-blue-800',
      audio: 'bg-purple-100 text-purple-800',
      archive: 'bg-orange-100 text-orange-800',
      link: 'bg-gray-100 text-gray-800'
    }
    return colorMap[type] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status) => {
    const colorMap = {
      uploading: 'bg-blue-100 text-blue-800',
      uploaded: 'bg-green-100 text-green-800',
      processing: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  const getAccessLevelIcon = (level) => {
    const iconMap = {
      private: Lock,
      class: User,
      school: HardDrive,
      public: Globe
    }
    return iconMap[level] || Lock
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFolderSelect = () => {
    folderInputRef.current?.click()
  }

  const handleFileUpload = (files) => {
    Array.from(files).forEach(file => {
      const resourceId = Date.now() + Math.random()
      
      // Simulate upload progress
      setUploadProgress(prev => ({ ...prev, [resourceId]: 0 }))
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[resourceId] || 0
          const newProgress = Math.min(currentProgress + Math.random() * 20, 100)
          
          if (newProgress >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              setUploadProgress(prev => {
                const { [resourceId]: _, ...rest } = prev
                return rest
              })
            }, 1000)
            return { ...prev, [resourceId]: 100 }
          }
          
          return { ...prev, [resourceId]: newProgress }
        })
      }, 200)
    })
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const createFolder = () => {
    if (newFolderName.trim()) {
      console.log('Create folder:', newFolderName)
      setNewFolderName('')
      setShowCreateFolder(false)
    }
  }

  const handleSelectResource = (resourceId) => {
    setSelectedResources(prev => 
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    )
  }

  const handleSelectAll = () => {
    const currentFolderResources = resources.filter(r => r.folder === selectedFolder)
    if (selectedResources.length === currentFolderResources.length) {
      setSelectedResources([])
    } else {
      setSelectedResources(currentFolderResources.map(r => r.id))
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesFolder = resource.folder === selectedFolder
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = filterType === 'all' || resource.type === filterType
    
    return matchesFolder && matchesSearch && matchesType
  })

  const currentFolder = folders.find(f => f.id === selectedFolder)

  return (
    <Card className="max-w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-blue-500" />
              {t('resources.resourceManager')}
            </CardTitle>
            <CardDescription>
              {t('resources.managerDescription')}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleFolderSelect}>
              <FolderPlus className="h-4 w-4 mr-1" />
              {t('resources.uploadFolder')}
            </Button>
            <Button size="sm" onClick={handleFileSelect}>
              <Plus className="h-4 w-4 mr-1" />
              {t('resources.uploadFiles')}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
          accept="*/*"
        />
        <input
          ref={folderInputRef}
          type="file"
          webkitdirectory=""
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />

        {/* Breadcrumb and Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Folder className="h-4 w-4" />
              <span>{currentFolder?.path || '/'}</span>
              <span>({currentFolder?.count || 0} {t('resources.items')})</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('resources.searchResources')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 border rounded text-sm w-48"
              />
            </div>
            
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="all">{t('resources.allTypes')}</option>
              <option value="video">{t('resources.videos')}</option>
              <option value="image">{t('resources.images')}</option>
              <option value="document">{t('resources.documents')}</option>
              <option value="audio">{t('resources.audio')}</option>
              <option value="archive">{t('resources.archives')}</option>
            </select>

            <div className="flex border rounded">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar and Main Content */}
        <div className="flex gap-4">
          {/* Folder Sidebar */}
          <div className="w-64 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">{t('resources.folders')}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateFolder(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {showCreateFolder && (
              <div className="flex gap-1">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder={t('resources.folderName')}
                  className="flex-1 px-2 py-1 text-xs border rounded"
                  onKeyPress={(e) => e.key === 'Enter' && createFolder()}
                />
                <Button size="sm" onClick={createFolder}>
                  <CheckCircle className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowCreateFolder(false)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            <div className="space-y-1">
              {folders.map((folder) => (
                <Button
                  key={folder.id}
                  variant={selectedFolder === folder.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedFolder(folder.id)}
                  className="w-full justify-start"
                >
                  <Folder className="h-4 w-4 mr-2" />
                  <span className="truncate">{folder.name}</span>
                  <Badge variant="outline" className="ml-auto">
                    {folder.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-4">
            {/* Upload Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">{t('resources.dragAndDrop')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('resources.dragDescription')}
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleFileSelect}>
                  {t('resources.browseFiles')}
                </Button>
                <Button variant="outline" onClick={handleFolderSelect}>
                  {t('resources.browseFolder')}
                </Button>
              </div>
            </div>

            {/* Upload Progress */}
            {Object.entries(uploadProgress).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t('resources.uploading')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(uploadProgress).map(([id, progress]) => (
                      <div key={id} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Uploading file...</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bulk Actions */}
            {selectedResources.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-blue-800 font-medium">
                    {selectedResources.length} {t('resources.selected')}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      {t('resources.download')}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4 mr-1" />
                      {t('resources.share')}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Move className="h-4 w-4 mr-1" />
                      {t('resources.move')}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4 mr-1" />
                      {t('resources.delete')}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setSelectedResources([])}>
                      {t('common.clearSelection')}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>{filteredResources.length} {t('resources.resourcesFound')}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedResources.length === filteredResources.length && filteredResources.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                  <span>{t('common.selectAll')}</span>
                </div>
              </div>
            </div>

            {/* Resources Display */}
            {filteredResources.length === 0 ? (
              <div className="text-center py-12">
                <File className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">{t('resources.noResourcesFound')}</h3>
                <p className="text-muted-foreground mb-4">{t('resources.uploadFirstResource')}</p>
                <Button onClick={handleFileSelect}>
                  <Plus className="h-4 w-4 mr-1" />
                  {t('resources.uploadNow')}
                </Button>
              </div>
            ) : viewMode === 'grid' ? (
              // Grid View
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredResources.map((resource) => {
                  const FileIcon = getFileIcon(resource.type, resource.status)
                  const AccessIcon = getAccessLevelIcon(resource.access_level)
                  
                  return (
                    <Card key={resource.id} className={`transition-all hover:shadow-md ${
                      selectedResources.includes(resource.id) ? 'ring-2 ring-blue-400' : ''
                    } ${resource.status === 'failed' ? 'border-red-200 bg-red-50' : ''}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between mb-2">
                          <input
                            type="checkbox"
                            checked={selectedResources.includes(resource.id)}
                            onChange={() => handleSelectResource(resource.id)}
                            className="rounded"
                          />
                          <div className="flex items-center gap-1">
                            <AccessIcon className="h-3 w-3 text-muted-foreground" />
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* File Preview */}
                        <div className="w-full h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center mb-3">
                          {resource.thumbnail ? (
                            <img 
                              src={resource.thumbnail} 
                              alt={resource.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <FileIcon className={`h-8 w-8 ${
                              resource.status === 'processing' ? 'animate-spin text-blue-500' :
                              resource.status === 'failed' ? 'text-red-500' :
                              'text-gray-500'
                            }`} />
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getFileTypeColor(resource.type)}>
                              {t(`resources.${resource.type}`)}
                            </Badge>
                            <Badge className={getStatusColor(resource.status)}>
                              {t(`resources.${resource.status}`)}
                            </Badge>
                          </div>
                          
                          <CardTitle className="text-sm line-clamp-2">{resource.name}</CardTitle>
                          <CardDescription className="text-xs line-clamp-2">
                            {resource.description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground">
                            <div className="flex justify-between">
                              <span>{formatFileSize(resource.size)}</span>
                              {resource.duration && (
                                <span>{formatDuration(resource.duration)}</span>
                              )}
                            </div>
                            <div className="flex justify-between">
                              <span>{resource.uploaded_by}</span>
                              <span>{formatDate(resource.uploaded_at)}</span>
                            </div>
                          </div>
                          
                          {resource.status === 'uploaded' && (
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                <span>{resource.views}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                <span>{resource.downloads}</span>
                              </div>
                            </div>
                          )}
                          
                          {resource.status === 'failed' && (
                            <div className="text-xs text-red-600">
                              {resource.error_message}
                            </div>
                          )}
                          
                          {resource.tags && resource.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {resource.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-1 mt-3">
                          <Button size="sm" className="flex-1" disabled={resource.status !== 'uploaded'}>
                            <Eye className="h-3 w-3 mr-1" />
                            {t('resources.preview')}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-3 w-3" />
                          </Button>
                          {resource.status === 'failed' && (
                            <Button variant="outline" size="sm">
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              // List View
              <div className="space-y-2">
                {filteredResources.map((resource) => {
                  const FileIcon = getFileIcon(resource.type, resource.status)
                  const AccessIcon = getAccessLevelIcon(resource.access_level)
                  
                  return (
                    <Card key={resource.id} className={`p-3 transition-all hover:shadow-sm ${
                      selectedResources.includes(resource.id) ? 'ring-2 ring-blue-400' : ''
                    } ${resource.status === 'failed' ? 'border-red-200 bg-red-50' : ''}`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedResources.includes(resource.id)}
                          onChange={() => handleSelectResource(resource.id)}
                          className="rounded"
                        />
                        
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center flex-shrink-0">
                          <FileIcon className={`h-5 w-5 ${
                            resource.status === 'processing' ? 'animate-spin text-blue-500' :
                            resource.status === 'failed' ? 'text-red-500' :
                            'text-gray-500'
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm truncate">{resource.name}</h3>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Badge className={getFileTypeColor(resource.type)}>
                                {t(`resources.${resource.type}`)}
                              </Badge>
                              <Badge className={getStatusColor(resource.status)}>
                                {t(`resources.${resource.status}`)}
                              </Badge>
                              <AccessIcon className="h-3 w-3 text-muted-foreground" />
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground truncate mb-1">
                            {resource.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{formatFileSize(resource.size)}</span>
                            {resource.duration && <span>{formatDuration(resource.duration)}</span>}
                            <span>{resource.uploaded_by}</span>
                            <span>{formatDate(resource.uploaded_at)}</span>
                            {resource.status === 'uploaded' && (
                              <>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  <span>{resource.views}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Download className="h-3 w-3" />
                                  <span>{resource.downloads}</span>
                                </div>
                              </>
                            )}
                          </div>
                          
                          {resource.status === 'failed' && (
                            <div className="text-xs text-red-600 mt-1">
                              {resource.error_message}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button size="sm" disabled={resource.status !== 'uploaded'}>
                            <Eye className="h-4 w-4 mr-1" />
                            {t('resources.preview')}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          {resource.status === 'failed' && (
                            <Button variant="outline" size="sm">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ResourceUploadManager