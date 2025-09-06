import React, { useState, useEffect } from 'react'
import { Plus, Download, Edit, MapPin, Phone, Mail, Globe } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
import { AdminPageLayout } from '../../components/admin/layout'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import api from '../../services/api'

const SchoolDetailsPage = () => {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [schoolConfig, setSchoolConfig] = useState(null)
  const [stats, setStats] = useState(null)

  // Fetch school configuration data
  const fetchSchoolConfig = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try different endpoints to get school configuration
      let configResponse;
      try {
        // First try: list endpoint (should return array with single school)
        configResponse = await api.get('/schools/config/')
        const data = configResponse.data
        
        // Handle different possible response structures
        let schoolData;
        if (data.results && Array.isArray(data.results)) {
          // DRF paginated response
          schoolData = data.results[0]
        } else if (Array.isArray(data)) {
          // Direct array response
          schoolData = data[0]
        } else {
          // Direct object response
          schoolData = data
        }
        
        console.log('✅ School config processed:', schoolData)
        setSchoolConfig(schoolData)
      } catch (listError) {
        // Second try: detail endpoint with ID 1
        try {
          configResponse = await api.get('/schools/config/1/')
          setSchoolConfig(configResponse.data)
        } catch (detailError) {
          console.error('Both config endpoints failed:', { listError, detailError })
          throw new Error('Unable to fetch school configuration')
        }
      }
      
      // Fetch school statistics (this might need different endpoint)
      // For now, we'll use mock data for statistics
      setStats({
        totalStudents: 1247,
        totalTeachers: 84,
        totalClasses: 12,
        attendanceRate: 95,
        assignmentCompletion: 87,
        assignmentsThisWeek: 156
      })
      
    } catch (err) {
      console.error('Error fetching school config:', err)
      setError(err.response?.data?.error || err.message || 'Failed to load school details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchoolConfig()
  }, [])

  const handleRefresh = () => {
    fetchSchoolConfig()
  }

  const handleEdit = () => {
    // TODO: Navigate to edit school details page or open modal
    console.log('Edit school details')
  }

  const handleExport = () => {
    // TODO: Export school details as PDF or Excel
    console.log('Export school details')
  }

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return t('misc.notSet', 'Not Set')
    return new Date(dateString).toLocaleDateString()
  }

  // Example actions for the page header
  const pageActions = [
    <Button key="export" variant="outline" size="sm" onClick={handleExport}>
      <Download className="h-4 w-4 mr-2" />
      {t('admin.export', 'Export')}
    </Button>,
    <Button key="edit" size="sm" onClick={handleEdit}>
      <Edit className="h-4 w-4 mr-2" />
      {t('common.edit', 'Edit')}
    </Button>
  ]

  return (
    <AdminPageLayout
      title={t('adminSidebar.schoolManagement.schoolDetails')}
      subtitle="Manage your school's basic information and settings"
      showBackButton={true}
      showRefreshButton={true}
      onRefresh={handleRefresh}
      actions={pageActions}
      loading={loading}
      error={error}
    >
      {schoolConfig && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* School Basic Information */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t('adminSidebar.schoolManagement.schoolDetails')}
              </CardTitle>
              {schoolConfig.logo_url && (
                <img 
                  src={schoolConfig.logo_url} 
                  alt={schoolConfig.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      School Name
                    </label>
                    <p className="text-lg font-medium">{schoolConfig.name}</p>
                    {schoolConfig.name_arabic && (
                      <p className="text-sm text-muted-foreground" dir="rtl">
                        {schoolConfig.name_arabic}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      Phone
                    </label>
                    <p className="font-medium">{schoolConfig.phone}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Email
                    </label>
                    <p className="font-medium">{schoolConfig.email}</p>
                  </div>

                  {schoolConfig.website && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        Website
                      </label>
                      <a 
                        href={schoolConfig.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        {schoolConfig.website}
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Address
                    </label>
                    <p className="font-medium">{schoolConfig.address}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary">{schoolConfig.city}</Badge>
                      <Badge variant="secondary">{schoolConfig.region}</Badge>
                      {schoolConfig.postal_code && (
                        <Badge variant="outline">{schoolConfig.postal_code}</Badge>
                      )}
                    </div>
                  </div>

                  {schoolConfig.founded_date && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Founded
                      </label>
                      <p className="font-medium">{formatDate(schoolConfig.founded_date)}</p>
                    </div>
                  )}

                  {schoolConfig.student_capacity && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Student Capacity
                      </label>
                      <p className="font-medium">{schoolConfig.student_capacity.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-6" />
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </label>
                <p className="text-sm">{formatDate(schoolConfig.updated_at)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Students</span>
                  <span className="text-2xl font-bold text-primary">{stats?.totalStudents?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Teachers</span>
                  <span className="text-2xl font-bold text-green-600">{stats?.totalTeachers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Classes</span>
                  <span className="text-2xl font-bold text-blue-600">{stats?.totalClasses}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Attendance Rate</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-green-600">{stats?.attendanceRate}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Assignment Completion</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-orange-600">{stats?.assignmentCompletion}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Year Information */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Academic Year Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">2024-2025</div>
                  <div className="text-sm text-muted-foreground">Current Academic Year</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats?.assignmentsThisWeek}</div>
                  <div className="text-sm text-muted-foreground">Assignments This Week</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {schoolConfig.director ? 'Assigned' : 'Not Set'}
                  </div>
                  <div className="text-sm text-muted-foreground">School Director</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminPageLayout>
  )
}

export default SchoolDetailsPage