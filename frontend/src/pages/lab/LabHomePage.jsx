import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import { useLabContext } from '../../contexts/LabContext'
import labService from '../../services/lab'
import { Button } from '../../components/ui/button'
import LabToolCard from '../../components/lab/shared/LabToolCard'
import LabSearch from '../../components/lab/shared/LabSearch'
import LabCategoryFilter from '../../components/lab/shared/LabCategoryFilter'
import { Loader2 } from 'lucide-react'
import { DashboardLayout } from '../../components/layout/Layout'

export default function LabHomePage() {
  const { t } = useTranslation()
  const { isTeacher, isAdmin } = useAuth()
  const { labState } = useLabContext()
  const navigate = useNavigate()

  const { data: toolsResponse, isLoading, refetch } = useQuery({
    queryKey: ['lab-tools'],
    queryFn: () => labService.getTools(),
    staleTime: 0, // Always refetch to avoid cache issues
    cacheTime: 0
  })

  const allTools = toolsResponse?.data || []

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    let filtered = allTools

    // Filter by category
    if (labState.selectedCategory !== 'all') {
      filtered = filtered.filter(tool =>
        tool.category?.name === labState.selectedCategory
      )
    }

    // Filter by search query
    if (labState.searchQuery) {
      const query = labState.searchQuery.toLowerCase()
      filtered = filtered.filter(tool =>
        tool.name_en.toLowerCase().includes(query) ||
        tool.name_ar?.toLowerCase().includes(query) ||
        tool.name_fr?.toLowerCase().includes(query) ||
        tool.description_en.toLowerCase().includes(query) ||
        tool.description_ar?.toLowerCase().includes(query) ||
        tool.description_fr?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [allTools, labState.selectedCategory, labState.searchQuery])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t('lab.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('lab.subtitle')}</p>
          </div>
          {(isTeacher || isAdmin) && (
            <Button onClick={() => navigate('/lab/analytics')}>{t('lab.viewAnalytics')}</Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <LabSearch />
          <LabCategoryFilter />
        </div>

        {/* Tools Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('lab.noToolsFound')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool) => (
              <LabToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
