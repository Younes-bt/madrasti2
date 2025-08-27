import React from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import ThemeToggle from './components/shared/ThemeToggle'
import LanguageSwitcher from './components/shared/LanguageSwitcher'
import { Button } from './components/ui/button'
import { useLanguage } from './contexts/LanguageContext'
import { GraduationCap, BookOpen, Users, Calendar } from 'lucide-react'

const AppContent = () => {
  const { t, direction } = useLanguage()

  return (
    <div className={`min-h-screen bg-background transition-colors duration-300`} dir={direction}>
      {/* Header */}
      <header className='border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-primary rounded-lg'>
                <GraduationCap className='h-6 w-6 text-primary-foreground' />
              </div>
              <div>
                <h1 className='text-xl font-bold text-foreground'>Madrasti 2.0</h1>
                <p className='text-sm text-muted-foreground'>School Management System</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-foreground mb-4'>
            {t('welcome')} to Madrasti 2.0
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            A comprehensive school management system supporting students, teachers, parents, and
            administrators with multilingual support and modern UI.
          </p>
        </div>

        {/* Feature Cards */}
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
          <div className='p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow'>
            <div className='p-2 bg-primary/10 rounded-lg w-fit mb-4'>
              <BookOpen className='h-6 w-6 text-primary' />
            </div>
            <h3 className='font-semibold text-card-foreground mb-2'>{t('lessons')}</h3>
            <p className='text-sm text-muted-foreground'>
              Interactive lesson management with multimedia resources and progress tracking.
            </p>
          </div>

          <div className='p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow'>
            <div className='p-2 bg-secondary/10 rounded-lg w-fit mb-4'>
              <Calendar className='h-6 w-6 text-secondary' />
            </div>
            <h3 className='font-semibold text-card-foreground mb-2'>{t('attendance')}</h3>
            <p className='text-sm text-muted-foreground'>
              Real-time attendance tracking with parent notifications and reporting.
            </p>
          </div>

          <div className='p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow'>
            <div className='p-2 bg-accent/10 rounded-lg w-fit mb-4'>
              <BookOpen className='h-6 w-6 text-accent' />
            </div>
            <h3 className='font-semibold text-card-foreground mb-2'>{t('homework')}</h3>
            <p className='text-sm text-muted-foreground'>
              Gamified assignment system with auto-grading and achievement tracking.
            </p>
          </div>

          <div className='p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow'>
            <div className='p-2 bg-primary/10 rounded-lg w-fit mb-4'>
              <Users className='h-6 w-6 text-primary' />
            </div>
            <h3 className='font-semibold text-card-foreground mb-2'>Multi-Role Support</h3>
            <p className='text-sm text-muted-foreground'>
              Tailored experiences for students, teachers, parents, and administrators.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-wrap gap-4 justify-center'>
          <Button size='lg' className='animate-bounce-in'>
            Get Started
          </Button>
          <Button variant='outline' size='lg'>
            Learn More
          </Button>
          <Button variant='secondary' size='lg'>
            View Documentation
          </Button>
        </div>

        {/* Demo Stats */}
        <div className='mt-12 p-6 rounded-lg bg-muted/50'>
          <h3 className='text-lg font-semibold text-center mb-6'>Technology Stack</h3>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
            <div>
              <div className='text-2xl font-bold text-primary'>React 19</div>
              <div className='text-sm text-muted-foreground'>Frontend Framework</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-secondary'>Tailwind CSS</div>
              <div className='text-sm text-muted-foreground'>Utility-First CSS</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-accent'>ShadCN UI</div>
              <div className='text-sm text-muted-foreground'>Component Library</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-primary'>i18next</div>
              <div className='text-sm text-muted-foreground'>Internationalization</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='border-t bg-card/50 backdrop-blur mt-12'>
        <div className='container mx-auto px-4 py-6'>
          <div className='text-center text-muted-foreground'>
            <p>© 2025 Madrasti 2.0 - Built with modern web technologies</p>
            <div className='mt-2 text-sm'>
              Supports Arabic (RTL), French, and English • Dark/Light Mode • Responsive Design
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
