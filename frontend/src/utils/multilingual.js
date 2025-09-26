/**
 * Multilingual utility functions
 * Handles the selection of appropriate language fields based on current locale
 */

import { useTranslation } from 'react-i18next';

/**
 * Get the appropriate field name based on current language
 * @param {string} baseField - The base field name (e.g., 'name', 'title')
 * @param {string} language - Current language code ('en', 'ar', 'fr')
 * @returns {string} The field name with language suffix if needed
 */
export const getLocalizedField = (baseField, language) => {
  switch (language) {
    case 'ar':
      return `${baseField}_arabic`;
    case 'fr':
      return `${baseField}_french`;
    default:
      return baseField; // English is the base field
  }
};

/**
 * Get the localized value from an object with multilingual fields
 * @param {Object} obj - The object containing multilingual fields
 * @param {string} baseField - The base field name (e.g., 'name', 'title')
 * @param {string} language - Current language code ('en', 'ar', 'fr')
 * @param {string} fallback - Fallback value if all fields are empty
 * @returns {string} The localized value
 */
export const getLocalizedValue = (obj, baseField, language = 'en', fallback = '') => {
  if (!obj) return fallback;

  const localizedField = getLocalizedField(baseField, language);
  let value = obj[localizedField];

  // If localized value is empty, try fallbacks
  if (!value || value.trim() === '') {
    // Try English as primary fallback
    if (language !== 'en') {
      value = obj[baseField];
    }

    // Try Arabic as secondary fallback
    if ((!value || value.trim() === '') && language !== 'ar') {
      value = obj[`${baseField}_arabic`];
    }

    // Try French as tertiary fallback
    if ((!value || value.trim() === '') && language !== 'fr') {
      value = obj[`${baseField}_french`];
    }
  }

  return value || fallback;
};

/**
 * Hook to get localized values based on current i18n language
 * @returns {Object} Object with helper functions
 */
export const useMultilingual = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  return {
    /**
     * Get localized field name
     * @param {string} baseField - The base field name
     * @returns {string} Localized field name
     */
    getField: (baseField) => getLocalizedField(baseField, currentLanguage),

    /**
     * Get localized value from object
     * @param {Object} obj - Object with multilingual fields
     * @param {string} baseField - Base field name
     * @param {string} fallback - Fallback value
     * @returns {string} Localized value
     */
    getValue: (obj, baseField, fallback = '') =>
      getLocalizedValue(obj, baseField, currentLanguage, fallback),

    /**
     * Get localized name (shorthand for getName)
     * @param {Object} obj - Object with name fields
     * @param {string} fallback - Fallback value
     * @returns {string} Localized name
     */
    getName: (obj, fallback = '') =>
      getLocalizedValue(obj, 'name', currentLanguage, fallback),

    /**
     * Get localized title (shorthand for getTitle)
     * @param {Object} obj - Object with title fields
     * @param {string} fallback - Fallback value
     * @returns {string} Localized title
     */
    getTitle: (obj, fallback = '') =>
      getLocalizedValue(obj, 'title', currentLanguage, fallback),

    /**
     * Current language code
     */
    language: currentLanguage
  };
};

/**
 * Higher-order component to add multilingual support to objects
 * @param {Array} items - Array of objects with multilingual fields
 * @param {string} language - Current language
 * @returns {Array} Array with computed localized display names
 */
export const addLocalizedNames = (items, language = 'en') => {
  if (!Array.isArray(items)) return items;

  return items.map(item => ({
    ...item,
    displayName: getLocalizedValue(item, 'name', language),
    displayTitle: getLocalizedValue(item, 'title', language)
  }));
};