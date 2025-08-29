import React, { useState } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'

// Import new page components
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'

// Import hooks
import { useAuth } from './hooks/useAuth'
import { useLanguage } from './hooks/useLanguage'
import { useTheme } from './hooks/useTheme'

// Import components
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'

// Demo component to showcase the new structure
const StructureDemo = () => {
  const { t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [currentView, setCurrentView] = useState('dashboard')
  
  const demoSections = [
    {
      title: 'Authentication Pages',
      description: 'Login and registration pages with proper structure',
      items: ['LoginPage', 'RegisterPage (planned)', 'ForgotPasswordPage (planned)']
    },
    {
      title: 'Dashboard Pages',
      description: 'Role-based dashboard pages',
      items: ['DashboardPage', 'ProfilePage (planned)', 'SettingsPage (planned)']
    },
    {
      title: 'Feature Modules',
      description: 'Organized by business domain',
      items: ['Attendance Module', 'Homework Module', 'Lessons Module', 'Admin Module']
    },
    {
      title: 'Custom Hooks',
      description: 'Reusable business logic',
      items: ['useAuth', 'useApi', 'useTheme', 'useLanguage', 'useRealtime']
    },
    {
      title: 'Service Layer',
      description: 'API integration and data management',
      items: ['auth.js', 'users.js', 'attendance.js', 'homework.js', 'lessons.js']
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Madrasti 2.0 - Restructured Architecture
          </h1>
          <p className="text-lg text-muted-foreground">
            Modern, scalable project structure following industry best practices
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button 
            variant={currentView === 'structure' ? 'default' : 'outline'}
            onClick={() => setCurrentView('structure')}
          >
            View Structure
          </Button>
          <Button 
            variant={currentView === 'dashboard' ? 'default' : 'outline'}
            onClick={() => setCurrentView('dashboard')}
          >
            Dashboard Demo
          </Button>
          <Button 
            variant={currentView === 'login' ? 'default' : 'outline'}
            onClick={() => setCurrentView('login')}
          >
            Login Demo
          </Button>
        </div>

        {currentView === 'structure' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {demoSections.map((section, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {currentView === 'dashboard' && <DashboardPage />}
        {currentView === 'login' && <LoginPage />}

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>🎉 Project Structure Benefits</CardTitle>
            </CardHeader>
            <CardContent className="text-left">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">✅ Scalability</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Domain-driven organization</li>
                    <li>• Clear separation of concerns</li>
                    <li>• Easy to add new features</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-600 mb-2">🔧 Maintainability</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Consistent folder structure</li>
                    <li>• Reusable components</li>
                    <li>• Centralized utilities</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-600 mb-2">⚡ Developer Experience</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Easy to find files</li>
                    <li>• Clear import paths</li>
                    <li>• Better IDE support</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-600 mb-2">🚀 Team Collaboration</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Standard conventions</li>
                    <li>• Reduced conflicts</li>
                    <li>• Faster onboarding</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <StructureDemo />
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App