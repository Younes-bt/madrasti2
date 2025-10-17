export const STAFF_POSITION_OPTIONS = [
  { value: 'DIRECTOR', translationKey: 'staff.positions.DIRECTOR' },
  { value: 'ASSISTANT', translationKey: 'staff.positions.ASSISTANT' },
  { value: 'IT_SUPPORT', translationKey: 'staff.positions.IT_SUPPORT' },
  { value: 'ACCOUNTANT', translationKey: 'staff.positions.ACCOUNTANT' },
  { value: 'HR_COORDINATOR', translationKey: 'staff.positions.HR_COORDINATOR' },
  { value: 'COUNSELOR', translationKey: 'staff.positions.COUNSELOR' },
  { value: 'LIBRARIAN', translationKey: 'staff.positions.LIBRARIAN' },
  { value: 'NURSE', translationKey: 'staff.positions.NURSE' },
  { value: 'SECURITY', translationKey: 'staff.positions.SECURITY' },
  { value: 'MAINTENANCE', translationKey: 'staff.positions.MAINTENANCE' },
  { value: 'SUPPORT', translationKey: 'staff.positions.SUPPORT' },
  { value: 'DRIVER', translationKey: 'staff.positions.DRIVER' },
  { value: 'OTHER', translationKey: 'staff.positions.OTHER' }
]

const getLanguageCode = (language = 'en') => language.split('-')[0]

export const getStaffPositionLabel = (t, value, language = 'en') => {
  if (!value) {
    return fallbackLabel(t, 'UNKNOWN', language)
  }

  const translationKey = `staff.positions.${value}`
  const translated = t(translationKey, {
    defaultValue: translationKey
  })

  if (translated && translated !== translationKey) {
    return translated
  }

  return fallbackLabel(t, value, language)
}

const FALLBACK_LABELS = {
  en: {
    DIRECTOR: 'Director',
    ASSISTANT: 'Assistant',
    IT_SUPPORT: 'IT Support Specialist',
    ACCOUNTANT: 'Accountant',
    HR_COORDINATOR: 'HR Coordinator',
    COUNSELOR: 'School Counselor',
    LIBRARIAN: 'Librarian',
    NURSE: 'School Nurse',
    SECURITY: 'Security Officer',
    MAINTENANCE: 'Maintenance Staff',
    SUPPORT: 'Support Staff',
    DRIVER: 'Driver',
    OTHER: 'Other',
    UNKNOWN: 'Staff'
  },
  fr: {
    DIRECTOR: 'Directeur',
    ASSISTANT: 'Assistant',
    IT_SUPPORT: "Spécialiste support informatique",
    ACCOUNTANT: 'Comptable',
    HR_COORDINATOR: 'Coordinateur RH',
    COUNSELOR: 'Conseiller scolaire',
    LIBRARIAN: 'Bibliothécaire',
    NURSE: 'Infirmier scolaire',
    SECURITY: 'Agent de sécurité',
    MAINTENANCE: 'Équipe de maintenance',
    SUPPORT: 'Personnel de soutien',
    DRIVER: 'Chauffeur',
    OTHER: 'Autre',
    UNKNOWN: 'Personnel'
  },
  ar: {
    DIRECTOR: 'المدير',
    ASSISTANT: 'مساعد إداري',
    IT_SUPPORT: 'أخصائي دعم تقني',
    ACCOUNTANT: 'محاسب',
    HR_COORDINATOR: 'منسق الموارد البشرية',
    COUNSELOR: 'مستشار تربوي',
    LIBRARIAN: 'أمين المكتبة',
    NURSE: 'ممرضة المدرسة',
    SECURITY: 'مسؤول أمن',
    MAINTENANCE: 'فريق الصيانة',
    SUPPORT: 'طاقم الدعم',
    DRIVER: 'سائق',
    OTHER: 'أخرى',
    UNKNOWN: 'موظف'
  }
}

const fallbackLabel = (t, value, language) => {
  const lang = getLanguageCode(language)
  const fallback = FALLBACK_LABELS[lang]?.[value]
  if (fallback) {
    return fallback
  }
  return FALLBACK_LABELS.en[value] || t('staff.positions.UNKNOWN', { defaultValue: 'Staff' })
}
