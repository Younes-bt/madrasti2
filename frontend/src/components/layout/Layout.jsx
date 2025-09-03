import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LanguageContext } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { PageErrorBoundary } from '../shared/ErrorBoundary'
import LoadingSpinner from '../shared/LoadingSpinner'
import LanguageSwitcher from '../shared/LanguageSwitcher'
import ThemeToggle from '../shared/ThemeToggle'
import { cn } from '../../lib/utils'

const Layout = ({
  children,
  notifications = [],
  loading = false,
  error = null,
  onNotificationClick = () => {},
  onProfileClick = () => {},
  showSidebar = true,
  showHeader = true,
  showFooter = true,
  sidebarVariant = 'default', // default, compact, hidden
  footerVariant = 'compact', // default, compact, minimal
  className,
  contentClassName,
}) => {
  const { language } = useContext(LanguageContext)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  const isRTL = language === 'ar'
  const currentPath = location.pathname

  // Load sidebar collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('madrasti_sidebar_collapsed')
    if (savedState !== null) {
      setSidebarCollapsed(JSON.parse(savedState))
    }
  }, [])

  // Save sidebar collapsed state to localStorage
  const toggleSidebarCollapsed = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    localStorage.setItem('madrasti_sidebar_collapsed', JSON.stringify(newState))
  }

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  const handleNavigate = (path) => {
    navigate(path)
    handleSidebarClose() // Close sidebar on mobile after navigation
  }

  const handleLogout = async () => {
    try {
      await logout() // Call the logout function from AuthContext
      navigate('/login', { replace: true }) // Redirect to login page
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, still redirect to login
      navigate('/login', { replace: true })
    }
  }

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner 
          size="xl" 
          text={
            language === 'ar' ? 'جاري التحميل...' :
            language === 'fr' ? 'Chargement...' :
            'Loading...'
          }
        />
      </div>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">
            {language === 'ar' ? 'حدث خطأ' :
             language === 'fr' ? 'Une erreur s\'est produite' :
             'An error occurred'}
          </h1>
          <p className="text-muted-foreground">
            {error.message || 'Something went wrong'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            {language === 'ar' ? 'إعادة التحميل' :
             language === 'fr' ? 'Recharger' :
             'Reload'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      'min-h-screen bg-background flex flex-col',
      isRTL && 'rtl',
      className
    )}>
      {/* Header */}
      {showHeader && (
        <Header
          onMenuClick={handleSidebarToggle}
          isSidebarOpen={sidebarOpen}
          user={user}
          notifications={notifications}
          onNotificationClick={onNotificationClick}
          onProfileClick={onProfileClick}
          onLogout={handleLogout}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && sidebarVariant !== 'hidden' && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={handleSidebarClose}
            currentPath={currentPath}
            userRole={user?.role}
            onNavigate={handleNavigate}
            className={cn(
              sidebarVariant === 'compact' && 'w-16',
              sidebarCollapsed && 'w-16'
            )}
          />
        )}

        {/* Main Content */}
        <main className={cn(
          'flex-1 flex flex-col overflow-hidden',
          contentClassName
        )}>
          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            <PageErrorBoundary>
              <div className="container mx-auto px-4 py-6">
                {children}
              </div>
            </PageErrorBoundary>
          </div>

          {/* Footer */}
          {showFooter && (
            <Footer 
              variant={footerVariant}
              schoolInfo={user?.school_info}
            />
          )}
        </main>
      </div>
    </div>
  )
}

// Specialized layout variants
export const DashboardLayout = (props) => (
  <Layout 
    {...props}
    showSidebar={true}
    showHeader={true}
    showFooter={true}
    footerVariant="compact"
  />
)

export const AuthLayout = ({ children, className }) => {
  const { language } = useContext(LanguageContext)
  const isRTL = language === 'ar'

  return (
    <div className={cn(
      'min-h-screen bg-background',
      isRTL && 'rtl',
      className
    )}>
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
          <div className="relative z-10 flex flex-col justify-center px-12 text-primary-foreground">
            <div className="mb-8">
              <div className="h-12 w-12 rounded-lg bg-primary-foreground/20 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary-foreground">M</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Madrasti 2.0</h1>
              <p className="text-xl text-primary-foreground/80">
                {language === 'ar' 
                  ? 'نظام إدارة المدارس الحديث'
                  : language === 'fr'
                  ? 'Système moderne de gestion scolaire'
                  : 'Modern School Management System'
                }
              </p>
            </div>
            
            <div className="space-y-4 text-primary-foreground/80">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-2 h-2 rounded-full bg-primary-foreground/60" />
                <span>
                  {language === 'ar' 
                    ? 'إدارة شاملة للطلاب والمعلمين'
                    : language === 'fr'
                    ? 'Gestion complète des étudiants et enseignants'
                    : 'Comprehensive student and teacher management'
                  }
                </span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-2 h-2 rounded-full bg-primary-foreground/60" />
                <span>
                  {language === 'ar' 
                    ? 'نظام حضور وغياب متقدم'
                    : language === 'fr'
                    ? 'Système de présence avancé'
                    : 'Advanced attendance tracking system'
                  }
                </span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-2 h-2 rounded-full bg-primary-foreground/60" />
                <span>
                  {language === 'ar' 
                    ? 'واجبات وامتحانات تفاعلية'
                    : language === 'fr'
                    ? 'Devoirs et examens interactifs'
                    : 'Interactive assignments and exams'
                  }
                </span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-2 h-2 rounded-full bg-primary-foreground/60" />
                <span>
                  {language === 'ar' 
                    ? 'تقارير وإحصائيات مفصلة'
                    : language === 'fr'
                    ? 'Rapports et statistiques détaillés'
                    : 'Detailed reports and analytics'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="flex justify-center mb-8 lg:hidden">
              <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">M</span>
              </div>
            </div>
            <PageErrorBoundary>
              {children}
            </PageErrorBoundary>
          </div>
        </div>
      </div>

      <Footer variant="minimal" className="lg:hidden" />
    </div>
  )
}

export const PublicLayout = ({ children, className }) => {
  const { language } = useContext(LanguageContext)
  const isRTL = language === 'ar'

  return (
    <div className={cn(
      'min-h-screen bg-background flex flex-col',
      isRTL && 'rtl',
      className
    )}>
      {/* Simple header for public pages */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            <span className="font-semibold">Madrasti 2.0</span>
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <PageErrorBoundary>
          {children}
        </PageErrorBoundary>
      </main>

      {/* Footer */}
      <Footer variant="default" />
    </div>
  )
}

export default Layout