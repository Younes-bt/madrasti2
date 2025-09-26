import React, { useContext, useState } from 'react'
import { Menu, Bell, Search, User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '../ui/button'
import { SidebarTrigger } from '../ui/sidebar'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '../ui/breadcrumb'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { LanguageContext } from '../../contexts/LanguageContext'
import { ThemeContext } from '../../contexts/ThemeContext'
import LanguageSwitcher from '../shared/LanguageSwitcher'
import ThemeToggle from '../shared/ThemeToggle'
import { APP_CONFIG, USER_ROLES } from '../../utils/constants'
import { cn } from '../../lib/utils'

const Header = ({
  onMenuClick,
  isSidebarOpen = false,
  showSearch = true,
  showNotifications = true,
  className,
  user = null,
  notifications = [],
  onNotificationClick = () => {},
  onProfileClick = () => {},
  onLogout = () => {},
}) => {
  const { language, t } = useContext(LanguageContext)
  const { theme } = useContext(ThemeContext)
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const isRTL = language === 'ar'
  const unreadNotifications = notifications.filter(n => !n.read).length

  const getRoleDisplayName = (role) => {
    const roleNames = {
      [USER_ROLES.ADMIN]: { ar: 'مدير', en: 'Admin', fr: 'Administrateur' },
      [USER_ROLES.TEACHER]: { ar: 'أستاذ', en: 'Teacher', fr: 'Professeur' },
      [USER_ROLES.STUDENT]: { ar: 'طالب', en: 'Student', fr: 'Étudiant' },
      [USER_ROLES.PARENT]: { ar: 'ولي أمر', en: 'Parent', fr: 'Parent' },
      [USER_ROLES.STAFF]: { ar: 'موظف', en: 'Staff', fr: 'Personnel' },
      [USER_ROLES.DRIVER]: { ar: 'سائق', en: 'Driver', fr: 'Chauffeur' },
    }
    return roleNames[role]?.[language] || role
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) {
      return language === 'ar' ? 'صباح الخير' : language === 'fr' ? 'Bonjour' : 'Good morning'
    } else if (hour < 18) {
      return language === 'ar' ? 'مساء الخير' : language === 'fr' ? 'Bon après-midi' : 'Good afternoon'
    } else {
      return language === 'ar' ? 'مساء الخير' : language === 'fr' ? 'Bonsoir' : 'Good evening'
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Search:', searchQuery)
  }

  const handleNotificationClick = (notification) => {
    onNotificationClick(notification)
    setIsNotificationsOpen(false)
  }

  return (
    <header className={cn(
      'sticky top-0 z-40 w-full border-b bg-background shadow-sm',
      className
    )}>
      <div className="flex h-16 items-center px-2 sm:px-4">
        {/* Sidebar trigger and breadcrumb */}
        <div className="flex items-center">
          <SidebarTrigger className={cn(
            'mr-2',
            isRTL && 'mr-0 ml-2'
          )} />
          
          <Separator orientation="vertical" className="mr-2 h-4" />
          
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden sm:block">
                <BreadcrumbLink href="#">
                  {APP_CONFIG.NAME}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden sm:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">
                  {user ? getRoleDisplayName(user.role) : (
                    language === 'ar' ? 'لوحة التحكم' :
                    language === 'fr' ? 'Tableau de bord' :
                    'Dashboard'
                  )}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="hidden sm:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className={cn(
                'absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground',
                isRTL ? 'right-3' : 'left-3'
              )} />
              <Input
                type="search"
                placeholder={
                  language === 'ar' ? 'البحث...' :
                  language === 'fr' ? 'Rechercher...' :
                  'Search...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'w-full',
                  isRTL ? 'pr-10' : 'pl-10'
                )}
              />
            </form>
          </div>
        )}

        <div className="flex-1" />

        {/* Right side controls */}
        <div className="flex items-center space-x-0.5 xs:space-x-1 sm:space-x-2 rtl:space-x-reverse">
          {showSearch && (
            <Button variant="ghost" size="sm" className="sm:hidden h-8 w-8 p-0">
              <Search className="h-4 w-4" />
            </Button>
          )}
          
          {/* Settings dropdown for mobile */}
          <Dialog className="xs:hidden">
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xs">
              <DialogHeader>
                <DialogTitle>
                  {language === 'ar' ? 'الإعدادات' : 
                   language === 'fr' ? 'Paramètres' : 
                   'Settings'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    {language === 'ar' ? 'اللغة' : 
                     language === 'fr' ? 'Langue' : 
                     'Language'}
                  </span>
                  <LanguageSwitcher />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    {language === 'ar' ? 'المظهر' : 
                     language === 'fr' ? 'Thème' : 
                     'Theme'}
                  </span>
                  <ThemeToggle />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Language switcher - hidden on xs screens */}
          <div className="hidden xs:block">
            <LanguageSwitcher />
          </div>

          {/* Theme toggle - hidden on xs screens */}
          <div className="hidden xs:block">
            <ThemeToggle />
          </div>

          {/* Notifications */}
          {showNotifications && (
            <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
                  <Bell className="h-4 w-4" />
                  {unreadNotifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 text-xs p-0 flex items-center justify-center min-w-4"
                    >
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </Badge>
                  )}
                  <span className="sr-only">
                    {language === 'ar' ? 'الإشعارات' : 
                     language === 'fr' ? 'Notifications' : 
                     'Notifications'}
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {language === 'ar' ? 'الإشعارات' : 
                     language === 'fr' ? 'Notifications' : 
                     'Notifications'}
                  </DialogTitle>
                  <DialogDescription>
                    {notifications.length === 0 
                      ? (language === 'ar' ? 'لا توجد إشعارات جديدة' :
                         language === 'fr' ? 'Aucune nouvelle notification' :
                         'No new notifications')
                      : `${notifications.length} ${
                          language === 'ar' ? 'إشعارات' :
                          language === 'fr' ? 'notifications' :
                          'notifications'
                        }`
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>
                        {language === 'ar' ? 'لا توجد إشعارات' :
                         language === 'fr' ? 'Aucune notification' :
                         'No notifications'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map((notification, index) => (
                        <div
                          key={notification.id || index}
                          onClick={() => handleNotificationClick(notification)}
                          className={cn(
                            'p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors',
                            !notification.read && 'bg-accent/50'
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.timestamp}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* User menu */}
          {user && (
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="relative h-8 px-1 sm:px-2">
                  <div className="flex items-center space-x-1 sm:space-x-2 rtl:space-x-reverse">
                    <Avatar className="h-6 w-6 sm:h-7 sm:w-7">
                      <AvatarImage src={user.profile_picture_url} alt={user.full_name} />
                      <AvatarFallback className="text-xs">
                        {user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left rtl:text-right">
                      <p className="text-sm font-medium leading-none">
                        {user.full_name || user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getRoleDisplayName(user.role)}
                      </p>
                    </div>
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground hidden sm:block" />
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.profile_picture_url} alt={user.full_name} />
                      <AvatarFallback>
                        {user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left rtl:text-right">
                      <DialogTitle className="text-base">
                        {user.full_name || user.email}
                      </DialogTitle>
                      <DialogDescription>
                        {getGreeting()}! {getRoleDisplayName(user.role)}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <Separator />
                
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      onProfileClick()
                      setIsProfileOpen(false)
                    }}
                  >
                    <User className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2" />
                    {language === 'ar' ? 'الملف الشخصي' :
                     language === 'fr' ? 'Profil' :
                     'Profile'}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <Settings className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2" />
                    {language === 'ar' ? 'الإعدادات' :
                     language === 'fr' ? 'Paramètres' :
                     'Settings'}
                  </Button>
                  
                  <Separator />
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      onLogout()
                      setIsProfileOpen(false)
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2" />
                    {language === 'ar' ? 'تسجيل الخروج' :
                     language === 'fr' ? 'Se déconnecter' :
                     'Sign out'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Login button if no user */}
          {!user && (
            <Button size="sm">
              {language === 'ar' ? 'تسجيل الدخول' :
               language === 'fr' ? 'Se connecter' :
               'Sign in'}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header