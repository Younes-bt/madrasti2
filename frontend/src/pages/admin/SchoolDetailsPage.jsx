import React, { useState, useEffect, useRef } from 'react'
import { Download, Edit, MapPin, Phone, Mail, Globe, Calendar, Building2, Sparkles } from 'lucide-react'
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion'
import { useLanguage } from '../../hooks/useLanguage'
import { AdminPageLayout } from '../../components/admin/layout'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
// Removed Progress-based KPI cards from this page
import api from '../../services/api'

const AnimatedCounter = ({ from = 0, to, duration = 2, className = "" }) => {
  const ref = useRef()
  const motionValue = useMotionValue(from)
  const springValue = useSpring(motionValue, { duration: duration * 1000 })
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [displayValue, setDisplayValue] = useState(from)

  useEffect(() => {
    if (isInView && to !== undefined) {
      animate(motionValue, to, { duration: duration })
    }
  }, [motionValue, isInView, to, duration])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest))
    })
    return unsubscribe
  }, [springValue])

  return (
    <span ref={ref} className={className}>
      {displayValue.toLocaleString()}
    </span>
  )
}

// Tailwind dynamic class mapping to avoid purge issues
const gradientMap = {
  blue: 'from-blue-500 to-purple-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  emerald: 'from-emerald-500 to-emerald-600',
  indigo: 'from-indigo-500 to-blue-600'
}


const GlowingCard = ({ children, className = "", glowColor = "blue" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className={`relative group ${className}`}
  >
    <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradientMap[glowColor] || gradientMap.blue} rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200`}></div>
    <div className="relative bg-background border rounded-lg backdrop-blur-sm">
      {children}
    </div>
  </motion.div>
)

// StatCard and KPI sections were removed from this page per request

const SchoolDetailsPage = () => {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [schoolConfig, setSchoolConfig] = useState(null)
  // KPIs removed from this page; no stats state needed

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
      
      // KPIs/statistics are shown on the dashboard, not here
      
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
      subtitle={t('school.details.subtitle', "Manage your school's basic information and settings")}
      showBackButton={true}
      showRefreshButton={true}
      onRefresh={handleRefresh}
      actions={pageActions}
      loading={loading}
      error={error}
    >
      {schoolConfig && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Hero Section with School Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 p-6 md:p-8 text-white shadow-2xl"
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-4 flex-1">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="flex items-center gap-3 md:gap-4"
                >
                  <Building2 className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0" />
                  <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">{schoolConfig.name}</h1>
                    {schoolConfig.name_arabic && (
                      <p className="text-sm md:text-lg opacity-90 truncate" dir="rtl">
                        {schoolConfig.name_arabic}
                      </p>
                    )}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs md:text-sm"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                    <span className="truncate">{schoolConfig.city}, {schoolConfig.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                    <span>{t('school.details.created', 'Created')} {formatDate(schoolConfig.created_at)}</span>
                  </div>
                </motion.div>
              </div>
              {schoolConfig.logo_url && (
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="relative flex-shrink-0"
                >
                  <div className="absolute inset-0 rounded-full bg-white/20 blur-xl"></div>
                  <img 
                    src={schoolConfig.logo_url} 
                    alt={schoolConfig.name}
                    className="relative h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full border-2 md:border-4 border-white/50 object-cover shadow-lg"
                  />
                </motion.div>
              )}
            </div>
            <div className="absolute top-0 right-0 opacity-10">
              <Sparkles className="h-24 w-24 md:h-32 md:w-32" />
            </div>
          </motion.div>

          {/* KPI cards removed; they will live on the dashboard */}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* School Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-2 space-y-4 lg:space-y-6"
            >
              <GlowingCard glowColor="blue">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Globe className="h-5 w-5" />
                    {t('school.details.info', 'School Information')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="group">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Phone className="h-4 w-4 group-hover:text-blue-500 transition-colors" />
                          {t('school.details.phone', 'Phone Number')}
                        </label>
                        <motion.p 
                          className="font-semibold text-lg group-hover:text-blue-600 transition-colors cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                        >
                          {schoolConfig.phone}
                        </motion.p>
                      </div>
                      
                      <div className="group">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Mail className="h-4 w-4 group-hover:text-green-500 transition-colors" />
                          {t('school.details.email', 'Email Address')}
                        </label>
                        <motion.p 
                          className="font-semibold text-lg group-hover:text-green-600 transition-colors cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                        >
                          {schoolConfig.email}
                        </motion.p>
                      </div>

                      {schoolConfig.website && (
                        <div className="group">
                          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Globe className="h-4 w-4 group-hover:text-purple-500 transition-colors" />
                            {t('school.details.website', 'Website')}
                          </label>
                          <motion.a 
                            href={schoolConfig.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-semibold text-lg text-purple-600 hover:text-purple-700 hover:underline transition-all cursor-pointer block"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {schoolConfig.website}
                          </motion.a>
                        </div>
                      )}
                    </motion.div>

                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      <div className="group">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-4 w-4 group-hover:text-red-500 transition-colors" />
                          {t('school.details.address', 'Address')}
                        </label>
                        <motion.p 
                          className="font-semibold text-lg group-hover:text-red-600 transition-colors"
                          whileHover={{ scale: 1.02 }}
                        >
                          {schoolConfig.address}
                        </motion.p>
                        <motion.div 
                          className="flex flex-wrap gap-2 mt-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 }}
                        >
                          <Badge 
                            variant="secondary" 
                            className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                          >
                            {schoolConfig.city}
                          </Badge>
                          <Badge 
                            variant="secondary"
                            className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                          >
                            {schoolConfig.region}
                          </Badge>
                          {schoolConfig.postal_code && (
                            <Badge 
                              variant="outline"
                              className="border-purple-300 text-purple-700 hover:bg-purple-50 transition-colors"
                            >
                              {schoolConfig.postal_code}
                            </Badge>
                          )}
                        </motion.div>
                      </div>

                      {schoolConfig.student_capacity && (
                        <div className="group">
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('school.details.capacity', 'Student Capacity')}
                          </label>
                          <motion.p 
                            className="font-semibold text-lg group-hover:text-indigo-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                          >
                            <AnimatedCounter to={schoolConfig.student_capacity} /> {t('school.details.students', 'Students')}
                          </motion.p>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Administration */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4 }}
                    className="pt-6 border-t border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          {t('school.details.director', 'School Director')}
                        </label>
                        <p className="text-sm text-gray-800">
                          {schoolConfig.director?.full_name || t('misc.notSet', 'Not Set')}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          {t('common.lastUpdated', 'Last Updated')}
                        </label>
                        <p className="text-sm text-gray-600">{formatDate(schoolConfig.updated_at)}</p>
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </GlowingCard>
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4 lg:space-y-6"
            >
              {/* Academic Year */}
              <GlowingCard glowColor="indigo">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {t('school.details.academicYear', 'Academic Year')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="text-center p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div 
                      className="text-3xl font-bold text-indigo-600 mb-2"
                      animate={{ 
                        textShadow: [
                          "0 0 0px #6366f1", 
                          "0 0 20px #6366f1", 
                          "0 0 0px #6366f1"
                        ]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3,
                        ease: "easeInOut"
                      }}
                    >
                      {schoolConfig.current_academic_year?.year || t('misc.notSet', 'Not Set')}
                    </motion.div>
                    <div className="text-sm text-indigo-700">{t('school.details.currentAcademicYear', 'Current Academic Year')}</div>
                  </motion.div>
                </CardContent>
              </GlowingCard>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AdminPageLayout>
  )
}

export default SchoolDetailsPage
