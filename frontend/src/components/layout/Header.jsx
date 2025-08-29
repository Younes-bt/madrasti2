import React, { useContext, useState } from 'react'
import { Menu, Bell, Search, User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '../ui/button'
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
      'sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      className
    )}>
      <div className="flex h-16 items-center px-4">
        {/* Menu button and logo */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className={cn(
              'mr-2 h-9 w-9 p-0',
              isRTL && 'mr-0 ml-2'
            )}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                {APP_CONFIG.NAME.charAt(0)}
              </span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold">{APP_CONFIG.NAME}</h1>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'نظام إدارة المدارس' : 
                 language === 'fr' ? 'Système de Gestion Scolaire' : 
                 'School Management System'}
              </p>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
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
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {/* Language switcher */}
          <LanguageSwitcher />

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Notifications */}
          {showNotifications && (
            <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
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
                <Button variant="ghost" className="relative h-9 px-2">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.profile_picture_url} alt={user.full_name} />
                      <AvatarFallback>
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
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
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