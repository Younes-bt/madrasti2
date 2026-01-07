import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date, locale = 'en') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatTime(date, locale = 'en') {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getInitials(name) {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Returns the localized name of an item based on the current language.
 * Handles models with name_arabic and name_french fields.
 */
export function getLocalizedName(item, lang) {
  if (!item) return '';
  const currentLang = lang || (typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') : 'en');
  
  if (currentLang?.startsWith('ar')) return item.name_arabic || item.name;
  if (currentLang?.startsWith('fr')) return item.name_french || item.name;
  return item.name;
}

/**
 * Returns the localized title of an item based on the current language.
 * Handles models with title_arabic and title_french fields (like Lessons).
 */
export function getLocalizedTitle(item, lang) {
  if (!item) return '';
  const currentLang = lang || (typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') : 'en');
  
  if (currentLang?.startsWith('ar')) return item.title_arabic || item.title;
  if (currentLang?.startsWith('fr')) return item.title_french || item.title;
  return item.title;
}
