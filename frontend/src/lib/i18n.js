import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

// Language resources
const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      attendance: 'Attendance',
      homework: 'Homework',
      lessons: 'Lessons',
      profile: 'Profile',
      logout: 'Logout',

      // Common
      welcome: 'Welcome',
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      add: 'Add',
      search: 'Search',
      filter: 'Filter',

      // Authentication
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',

      // Dashboard
      todayOverview: "Today's Overview",
      recentActivity: 'Recent Activity',
      upcomingAssignments: 'Upcoming Assignments',

      // Student specific
      myPoints: 'My Points',
      myBadges: 'My Badges',
      leaderboard: 'Leaderboard',

      // Teacher specific
      myClasses: 'My Classes',
      pendingGrading: 'Pending Grading',

      // Time
      today: 'Today',
      yesterday: 'Yesterday',
      thisWeek: 'This Week',
      thisMonth: 'This Month',

      // Status
      present: 'Present',
      absent: 'Absent',
      late: 'Late',
      excused: 'Excused',

      // Roles
      student: 'Student',
      teacher: 'Teacher',
      parent: 'Parent',
      admin: 'Administrator',
      staff: 'Staff',
      driver: 'Driver',
    },
  },
  ar: {
    translation: {
      // Navigation
      dashboard: 'لوحة التحكم',
      attendance: 'الحضور',
      homework: 'الواجبات',
      lessons: 'الدروس',
      profile: 'الملف الشخصي',
      logout: 'تسجيل الخروج',

      // Common
      welcome: 'مرحباً',
      loading: 'جاري التحميل...',
      save: 'حفظ',
      cancel: 'إلغاء',
      edit: 'تعديل',
      delete: 'حذف',
      add: 'إضافة',
      search: 'بحث',
      filter: 'تصفية',

      // Authentication
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      forgotPassword: 'نسيت كلمة المرور؟',

      // Dashboard
      todayOverview: 'نظرة عامة على اليوم',
      recentActivity: 'النشاط الأخير',
      upcomingAssignments: 'الواجبات القادمة',

      // Student specific
      myPoints: 'نقاطي',
      myBadges: 'شاراتي',
      leaderboard: 'لوحة الصدارة',

      // Teacher specific
      myClasses: 'فصولي',
      pendingGrading: 'في انتظار التصحيح',

      // Time
      today: 'اليوم',
      yesterday: 'أمس',
      thisWeek: 'هذا الأسبوع',
      thisMonth: 'هذا الشهر',

      // Status
      present: 'حاضر',
      absent: 'غائب',
      late: 'متأخر',
      excused: 'غياب مبرر',

      // Roles
      student: 'طالب',
      teacher: 'معلم',
      parent: 'ولي أمر',
      admin: 'مدير النظام',
      staff: 'موظف',
      driver: 'سائق',
    },
  },
  fr: {
    translation: {
      // Navigation
      dashboard: 'Tableau de bord',
      attendance: 'Présence',
      homework: 'Devoirs',
      lessons: 'Leçons',
      profile: 'Profil',
      logout: 'Déconnexion',

      // Common
      welcome: 'Bienvenue',
      loading: 'Chargement...',
      save: 'Enregistrer',
      cancel: 'Annuler',
      edit: 'Modifier',
      delete: 'Supprimer',
      add: 'Ajouter',
      search: 'Recherche',
      filter: 'Filtrer',

      // Authentication
      login: 'Connexion',
      register: "S'inscrire",
      email: 'Email',
      password: 'Mot de passe',
      forgotPassword: 'Mot de passe oublié?',

      // Dashboard
      todayOverview: "Aperçu d'aujourd'hui",
      recentActivity: 'Activité récente',
      upcomingAssignments: 'Devoirs à venir',

      // Student specific
      myPoints: 'Mes points',
      myBadges: 'Mes badges',
      leaderboard: 'Classement',

      // Teacher specific
      myClasses: 'Mes classes',
      pendingGrading: 'En attente de notation',

      // Time
      today: "Aujourd'hui",
      yesterday: 'Hier',
      thisWeek: 'Cette semaine',
      thisMonth: 'Ce mois',

      // Status
      present: 'Présent',
      absent: 'Absent',
      late: 'En retard',
      excused: 'Absence justifiée',

      // Roles
      student: 'Étudiant',
      teacher: 'Enseignant',
      parent: 'Parent',
      admin: 'Administrateur',
      staff: 'Personnel',
      driver: 'Chauffeur',
    },
  },
}

// RTL languages
const rtlLanguages = ['ar']

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,

    backend: {
      loadPath: '/locales/{{lng}}.json',
    },

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'navigator'],
      caches: ['cookie', 'localStorage'],
    },

    react: {
      useSuspense: false,
    },
  })

// Function to check if language is RTL
export const isRTL = (language) => {
  return rtlLanguages.includes(language)
}

// Function to get text direction
export const getDirection = (language) => {
  return isRTL(language) ? 'rtl' : 'ltr'
}

// Function to update document direction
export const updateDocumentDirection = (language) => {
  document.documentElement.dir = getDirection(language)
  document.documentElement.lang = language
}

// Initialize direction on startup
updateDocumentDirection(i18n.language)

// Listen for language changes
i18n.on('languageChanged', (language) => {
  updateDocumentDirection(language)
})

export default i18n
