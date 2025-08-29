import React, { useContext } from 'react'
import { 
  AlertTriangle, 
  Home, 
  RefreshCw, 
  Search, 
  WifiOff, 
  ServerOff,
  FileX,
  Shield,
  Clock,
  ArrowLeft
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { LanguageContext } from '../../contexts/LanguageContext'
import { cn } from '../../lib/utils'

// Base Error Page Component
const BaseErrorPage = ({
  icon: Icon,
  title,
  description,
  errorCode,
  actions = [],
  suggestions = [],
  className,
  showBackButton = true,
  onBack = () => window.history.back(),
}) => {
  const { language } = useContext(LanguageContext)
  const isRTL = language === 'ar'

  return (
    <div className={cn(
      'min-h-screen flex items-center justify-center bg-background p-4',
      isRTL && 'rtl',
      className
    )}>
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error Icon and Code */}
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
            <Icon className="w-10 h-10 text-destructive" />
          </div>
          
          {errorCode && (
            <div className="text-6xl font-bold text-muted-foreground/30">
              {errorCode}
            </div>
          )}
        </div>

        {/* Title and Description */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {title}
          </h1>
          <p className="text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="space-y-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={index === 0 ? 'default' : 'outline'}
                className="w-full"
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.icon && (
                  <action.icon className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                )}
                {action.label}
              </Button>
            ))}
          </div>
        )}

        {/* Back Button */}
        {showBackButton && (
          <>
            <Separator />
            <Button variant="ghost" onClick={onBack} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
              {language === 'ar' ? 'العودة' :
               language === 'fr' ? 'Retour' :
               'Go Back'}
            </Button>
          </>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                {language === 'ar' ? 'اقتراحات' :
                 language === 'fr' ? 'Suggestions' :
                 'Suggestions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="text-sm text-muted-foreground text-left rtl:text-right">
                  • {suggestion}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Contact Support */}
        <div className="pt-4 text-xs text-muted-foreground">
          {language === 'ar' 
            ? 'إذا استمرت المشكلة، يرجى الاتصال بالدعم الفني'
            : language === 'fr'
            ? 'Si le problème persiste, veuillez contacter le support technique'
            : 'If the problem persists, please contact technical support'
          }
        </div>
      </div>
    </div>
  )
}

// 404 - Page Not Found
export const NotFoundPage = ({ 
  onGoHome = () => window.location.href = '/',
  onSearch = null,
  customMessage = null 
}) => {
  const { language } = useContext(LanguageContext)

  const title = language === 'ar' 
    ? 'الصفحة غير موجودة'
    : language === 'fr'
    ? 'Page non trouvée'
    : 'Page Not Found'

  const description = customMessage || (
    language === 'ar'
      ? 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى عنوان آخر.'
      : language === 'fr'
      ? 'Désolé, la page que vous recherchez n\'existe pas ou a été déplacée vers une autre adresse.'
      : 'Sorry, the page you are looking for doesn\'t exist or has been moved to another address.'
  )

  const actions = [
    {
      icon: Home,
      label: language === 'ar' ? 'العودة للرئيسية' :
             language === 'fr' ? 'Retour à l\'accueil' :
             'Go to Homepage',
      onClick: onGoHome,
    }
  ]

  if (onSearch) {
    actions.push({
      icon: Search,
      label: language === 'ar' ? 'البحث' :
             language === 'fr' ? 'Rechercher' :
             'Search',
      onClick: onSearch,
    })
  }

  const suggestions = [
    language === 'ar' 
      ? 'تحقق من صحة الرابط المكتوب'
      : language === 'fr'
      ? 'Vérifiez l\'exactitude du lien saisi'
      : 'Check if the URL is correct',
    
    language === 'ar'
      ? 'جرب البحث عن الصفحة المطلوبة'
      : language === 'fr'
      ? 'Essayez de rechercher la page souhaitée'
      : 'Try searching for the page you need',
      
    language === 'ar'
      ? 'تأكد من أن لديك الصلاحيات المطلوبة'
      : language === 'fr'
      ? 'Assurez-vous d\'avoir les autorisations requises'
      : 'Make sure you have the required permissions'
  ]

  return (
    <BaseErrorPage
      icon={FileX}
      title={title}
      description={description}
      errorCode="404"
      actions={actions}
      suggestions={suggestions}
    />
  )
}

// 500 - Internal Server Error
export const InternalErrorPage = ({ 
  onRetry = () => window.location.reload(),
  onGoHome = () => window.location.href = '/',
  errorDetails = null
}) => {
  const { language } = useContext(LanguageContext)

  const title = language === 'ar'
    ? 'خطأ في الخادم'
    : language === 'fr'
    ? 'Erreur du serveur'
    : 'Internal Server Error'

  const description = language === 'ar'
    ? 'حدث خطأ غير متوقع في الخادم. نحن نعمل على حل المشكلة.'
    : language === 'fr'
    ? 'Une erreur inattendue s\'est produite sur le serveur. Nous travaillons à résoudre le problème.'
    : 'An unexpected server error occurred. We are working to resolve the issue.'

  const actions = [
    {
      icon: RefreshCw,
      label: language === 'ar' ? 'إعادة المحاولة' :
             language === 'fr' ? 'Réessayer' :
             'Try Again',
      onClick: onRetry,
    },
    {
      icon: Home,
      label: language === 'ar' ? 'العودة للرئيسية' :
             language === 'fr' ? 'Retour à l\'accueil' :
             'Go to Homepage',
      onClick: onGoHome,
    }
  ]

  const suggestions = [
    language === 'ar'
      ? 'انتظر بضع دقائق ثم أعد المحاولة'
      : language === 'fr'
      ? 'Attendez quelques minutes puis réessayez'
      : 'Wait a few minutes and try again',
      
    language === 'ar'
      ? 'تحقق من اتصالك بالإنترنت'
      : language === 'fr'
      ? 'Vérifiez votre connexion Internet'
      : 'Check your internet connection',
      
    language === 'ar'
      ? 'امسح ذاكرة التخزين المؤقت للمتصفح'
      : language === 'fr'
      ? 'Effacez le cache de votre navigateur'
      : 'Clear your browser cache'
  ]

  return (
    <BaseErrorPage
      icon={ServerOff}
      title={title}
      description={description}
      errorCode="500"
      actions={actions}
      suggestions={suggestions}
    />
  )
}

// Network Error
export const NetworkErrorPage = ({ 
  onRetry = () => window.location.reload(),
  isOffline = !navigator.onLine 
}) => {
  const { language } = useContext(LanguageContext)

  const title = isOffline
    ? (language === 'ar' ? 'غير متصل بالإنترنت' :
       language === 'fr' ? 'Hors ligne' :
       'You\'re Offline')
    : (language === 'ar' ? 'مشكلة في الاتصال' :
       language === 'fr' ? 'Problème de connexion' :
       'Connection Problem')

  const description = isOffline
    ? (language === 'ar' 
        ? 'يبدو أنك غير متصل بالإنترنت. تحقق من اتصالك وأعد المحاولة.'
        : language === 'fr'
        ? 'Il semble que vous ne soyez pas connecté à Internet. Vérifiez votre connexion et réessayez.'
        : 'It looks like you\'re not connected to the internet. Check your connection and try again.')
    : (language === 'ar'
        ? 'تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت وأعد المحاولة.'
        : language === 'fr'
        ? 'Impossible de se connecter au serveur. Vérifiez votre connexion Internet et réessayez.'
        : 'Unable to connect to the server. Check your internet connection and try again.')

  const actions = [
    {
      icon: RefreshCw,
      label: language === 'ar' ? 'إعادة المحاولة' :
             language === 'fr' ? 'Réessayer' :
             'Try Again',
      onClick: onRetry,
    }
  ]

  const suggestions = [
    language === 'ar'
      ? 'تحقق من اتصال الواي فاي أو البيانات المحمولة'
      : language === 'fr'
      ? 'Vérifiez votre connexion Wi-Fi ou données mobiles'
      : 'Check your Wi-Fi or mobile data connection',
      
    language === 'ar'
      ? 'تأكد من عمل جدار الحماية أو مكافح الفيروسات بشكل صحيح'
      : language === 'fr'
      ? 'Assurez-vous que le pare-feu ou l\'antivirus fonctionne correctement'
      : 'Make sure firewall or antivirus is working properly',
      
    language === 'ar'
      ? 'جرب استخدام شبكة مختلفة'
      : language === 'fr'
      ? 'Essayez d\'utiliser un réseau différent'
      : 'Try using a different network'
  ]

  return (
    <BaseErrorPage
      icon={WifiOff}
      title={title}
      description={description}
      actions={actions}
      suggestions={suggestions}
      showBackButton={false}
    />
  )
}

// 403 - Forbidden/Access Denied
export const ForbiddenPage = ({ 
  onGoHome = () => window.location.href = '/',
  onLogin = () => window.location.href = '/login',
  userRole = null,
  requiredRole = null 
}) => {
  const { language } = useContext(LanguageContext)

  const title = language === 'ar'
    ? 'غير مسموح لك بالوصول'
    : language === 'fr'
    ? 'Accès non autorisé'
    : 'Access Denied'

  const description = language === 'ar'
    ? 'عذراً، ليس لديك الصلاحيات المطلوبة للوصول إلى هذه الصفحة.'
    : language === 'fr'
    ? 'Désolé, vous n\'avez pas les autorisations requises pour accéder à cette page.'
    : 'Sorry, you don\'t have the required permissions to access this page.'

  const actions = [
    {
      icon: Home,
      label: language === 'ar' ? 'العودة للرئيسية' :
             language === 'fr' ? 'Retour à l\'accueil' :
             'Go to Homepage',
      onClick: onGoHome,
    }
  ]

  if (!userRole) {
    actions.unshift({
      icon: Shield,
      label: language === 'ar' ? 'تسجيل الدخول' :
             language === 'fr' ? 'Se connecter' :
             'Sign In',
      onClick: onLogin,
    })
  }

  const suggestions = [
    language === 'ar'
      ? 'تأكد من تسجيل الدخول بالحساب الصحيح'
      : language === 'fr'
      ? 'Assurez-vous de vous connecter avec le bon compte'
      : 'Make sure you\'re signed in with the correct account',
      
    language === 'ar'
      ? 'تواصل مع المدير للحصول على الصلاحيات المطلوبة'
      : language === 'fr'
      ? 'Contactez l\'administrateur pour obtenir les autorisations requises'
      : 'Contact the administrator to get the required permissions',
      
    language === 'ar'
      ? 'تحقق من انتهاء صلاحية جلسة تسجيل الدخول'
      : language === 'fr'
      ? 'Vérifiez si votre session de connexion a expiré'
      : 'Check if your login session has expired'
  ]

  return (
    <BaseErrorPage
      icon={Shield}
      title={title}
      description={description}
      errorCode="403"
      actions={actions}
      suggestions={suggestions}
    />
  )
}

// Session Timeout
export const SessionTimeoutPage = ({ 
  onLogin = () => window.location.href = '/login',
  onRefresh = () => window.location.reload(),
  timeoutDuration = null 
}) => {
  const { language } = useContext(LanguageContext)

  const title = language === 'ar'
    ? 'انتهت صلاحية الجلسة'
    : language === 'fr'
    ? 'Session expirée'
    : 'Session Expired'

  const description = language === 'ar'
    ? 'انتهت صلاحية جلسة تسجيل الدخول الخاصة بك لأسباب أمنية. يرجى تسجيل الدخول مرة أخرى.'
    : language === 'fr'
    ? 'Votre session de connexion a expiré pour des raisons de sécurité. Veuillez vous reconnecter.'
    : 'Your login session has expired for security reasons. Please sign in again.'

  const actions = [
    {
      icon: Shield,
      label: language === 'ar' ? 'تسجيل الدخول مرة أخرى' :
             language === 'fr' ? 'Se reconnecter' :
             'Sign In Again',
      onClick: onLogin,
    },
    {
      icon: RefreshCw,
      label: language === 'ar' ? 'تحديث الصفحة' :
             language === 'fr' ? 'Actualiser la page' :
             'Refresh Page',
      onClick: onRefresh,
    }
  ]

  return (
    <BaseErrorPage
      icon={Clock}
      title={title}
      description={description}
      actions={actions}
      showBackButton={false}
    />
  )
}

// Maintenance Mode
export const MaintenancePage = ({ 
  estimatedTime = null,
  contactInfo = null 
}) => {
  const { language } = useContext(LanguageContext)

  const title = language === 'ar'
    ? 'النظام قيد الصيانة'
    : language === 'fr'
    ? 'Système en maintenance'
    : 'System Under Maintenance'

  const description = language === 'ar'
    ? 'نحن نعمل حالياً على تحسين النظام. سيعود الموقع للعمل قريباً.'
    : language === 'fr'
    ? 'Nous travaillons actuellement à l\'amélioration du système. Le site sera bientôt de retour.'
    : 'We are currently working on improving the system. The site will be back online soon.'

  const actions = [
    {
      icon: RefreshCw,
      label: language === 'ar' ? 'إعادة المحاولة' :
             language === 'fr' ? 'Réessayer' :
             'Try Again',
      onClick: () => window.location.reload(),
    }
  ]

  const suggestions = [
    language === 'ar'
      ? 'أعد المحاولة بعد بضع دقائق'
      : language === 'fr'
      ? 'Réessayez dans quelques minutes'
      : 'Try again in a few minutes',
      
    estimatedTime && (language === 'ar'
      ? `الوقت المقدر للانتهاء: ${estimatedTime}`
      : language === 'fr'
      ? `Temps estimé d'achèvement : ${estimatedTime}`
      : `Estimated completion time: ${estimatedTime}`),
      
    contactInfo && (language === 'ar'
      ? `للاستعلامات: ${contactInfo}`
      : language === 'fr'
      ? `Pour les questions : ${contactInfo}`
      : `For inquiries: ${contactInfo}`)
  ].filter(Boolean)

  return (
    <BaseErrorPage
      icon={ServerOff}
      title={title}
      description={description}
      actions={actions}
      suggestions={suggestions}
      showBackButton={false}
    />
  )
}

export default BaseErrorPage