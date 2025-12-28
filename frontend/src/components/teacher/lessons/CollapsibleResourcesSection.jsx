import React, { useState, useMemo } from 'react'
import {
  FileText,
  FileVideo,
  FileAudio,
  Image as ImageIcon,
  Link,
  File,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  ExternalLink
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible'
import EnhancedMarkdown from '../../markdown/EnhancedMarkdown'
import BlockRenderer from '../../blocks/BlockRenderer'
import { cn } from '../../../lib/utils'

/**
 * Get appropriate icon for resource type
 */
const getResourceIcon = (resourceType) => {
  const icons = {
    pdf: File,
    video: FileVideo,
    audio: FileAudio,
    image: ImageIcon,
    link: Link,
    markdown: FileText,
    blocks: FileText,
    presentation: FileText
  }
  return icons[resourceType?.toLowerCase()] || File
}

/**
 * CollapsibleResourcesSection Component
 *
 * CRITICAL PERFORMANCE COMPONENT
 * Displays resources in a collapsible list with LAZY LOADING for markdown/blocks content.
 * This prevents the performance issue where all markdown/blocks resources were rendered inline.
 *
 * @param {Object} props
 * @param {Array} props.resources - Array of resource objects
 * @param {string} props.language - Current language (ar/fr/en)
 * @param {'teacher' | 'student'} [props.viewMode] - Current view mode (filters resources in student mode)
 * @param {string} [props.className] - Optional additional CSS classes
 */
export function CollapsibleResourcesSection({
  resources = [],
  language = 'ar',
  viewMode = 'teacher',
  className
}) {
  // Track which resources are expanded (for lazy loading)
  const [expandedResourceIds, setExpandedResourceIds] = useState(new Set())

  // Filter resources based on view mode
  const visibleResources = useMemo(() => {
    if (viewMode === 'student') {
      return resources.filter(r => r.is_visible_to_students !== false)
    }
    return resources
  }, [resources, viewMode])

  // Toggle resource expansion
  const toggleResource = (resourceId) => {
    setExpandedResourceIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId)
      } else {
        newSet.add(resourceId)
      }
      return newSet
    })
  }

  // Handle resource click (for external files)
  const handleResourceClick = (resource) => {
    if (resource.file_url || resource.external_url) {
      window.open(resource.file_url || resource.external_url, '_blank')
    }
  }

  // Handle resource download
  const handleDownloadResource = (resource) => {
    if (resource.file_url && resource.is_downloadable) {
      const link = document.createElement('a')
      link.href = resource.file_url
      link.download = resource.title
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Empty state
  if (visibleResources.length === 0) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            الموارد (0)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {viewMode === 'student'
                ? 'لا توجد موارد مرئية للطلاب'
                : 'لا توجد موارد لهذا الدرس'}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          الموارد ({visibleResources.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {visibleResources.map((resource) => {
            const isExpanded = expandedResourceIds.has(resource.id)
            const ResourceIcon = getResourceIcon(resource.resource_type)
            const isMarkdown = resource.resource_type?.toLowerCase() === 'markdown'
            const isBlocks = resource.resource_type?.toLowerCase() === 'blocks'
            const hasInlineContent = (isMarkdown && resource.markdown_content) ||
                                    (isBlocks && resource.blocks_content)

            return (
              <div
                key={resource.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Resource Header - Always Visible */}
                <div className="flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <ResourceIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{resource.title}</h4>
                      {resource.description && (
                        <p className="text-sm text-muted-foreground truncate">
                          {resource.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {resource.resource_type}
                        </Badge>
                        {resource.file_size && (
                          <span className="text-xs text-muted-foreground">
                            {Math.round(resource.file_size / 1024)} KB
                          </span>
                        )}
                        {resource.is_visible_to_students && viewMode === 'teacher' && (
                          <Badge variant="secondary" className="text-xs">
                            مرئي للطلاب
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* External file actions (if not inline content) */}
                    {!hasInlineContent && (
                      <>
                        {resource.is_visible_to_students && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResourceClick(resource)}
                            title="عرض"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {resource.is_downloadable && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadResource(resource)}
                            title="تحميل"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        {resource.external_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(resource.external_url, '_blank')}
                            title="فتح الرابط الخارجي"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}

                    {/* Expand/Collapse button (only for inline content) */}
                    {hasInlineContent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleResource(resource.id)}
                        aria-label={isExpanded ? 'إخفاء المحتوى' : 'عرض المحتوى'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Expandable Content - LAZY LOADED (only renders when expanded) */}
                {hasInlineContent && isExpanded && (
                  <div className="p-4 border-t bg-white">
                    {/* ⚡ CRITICAL PERFORMANCE FIX: Only render when expanded */}
                    {isBlocks && resource.blocks_content && (
                      <div className="prose prose-sm max-w-none">
                        <BlockRenderer
                          blocksContent={resource.blocks_content}
                          language={language}
                        />
                      </div>
                    )}

                    {isMarkdown && resource.markdown_content && (
                      <div className="prose prose-sm max-w-none">
                        <EnhancedMarkdown
                          content={resource.markdown_content}
                          language={language}
                          showCopyButton={true}
                          collapsibleHeadings={false}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Memoize component to prevent unnecessary re-renders
export default React.memo(CollapsibleResourcesSection, (prevProps, nextProps) => {
  return (
    prevProps.resources === nextProps.resources &&
    prevProps.viewMode === nextProps.viewMode &&
    prevProps.language === nextProps.language
  )
})
