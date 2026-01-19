import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Import translation files
import enTranslations from '../locales/en/translation.json';
import arTranslations from '../locales/ar/translation.json';
import frTranslations from '../locales/fr/translation.json';

// RTL languages
const rtlLanguages = ['ar'];

// Custom language detector for React Native
const languageDetector = {
    type: 'languageDetector' as const,
    async: true,
    detect: async (callback: (lang: string) => void) => {
        try {
            let savedLanguage: string | null;

            if (Platform.OS === 'web') {
                savedLanguage = localStorage.getItem('madrasti-language');
            } else {
                savedLanguage = await SecureStore.getItemAsync('madrasti-language');
            }

            if (savedLanguage) {
                callback(savedLanguage);
            } else {
                // Default to English
                callback('en');
            }
        } catch (error) {
            console.error('Error detecting language:', error);
            callback('en');
        }
    },
    init: () => { },
    cacheUserLanguage: async (language: string) => {
        try {
            if (Platform.OS === 'web') {
                localStorage.setItem('madrasti-language', language);
            } else {
                await SecureStore.setItemAsync('madrasti-language', language);
            }
        } catch (error) {
            console.error('Error caching language:', error);
        }
    },
};

i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        debug: false,

        resources: {
            en: {
                translation: enTranslations,
            },
            ar: {
                translation: arTranslations,
            },
            fr: {
                translation: frTranslations,
            },
        },

        interpolation: {
            escapeValue: false, // React already does escaping
        },

        react: {
            useSuspense: false,
        },
    });

// Helper functions
export const isRTL = (language: string): boolean => {
    return rtlLanguages.includes(language);
};

export const getDirection = (language: string): 'rtl' | 'ltr' => {
    return isRTL(language) ? 'rtl' : 'ltr';
};

export default i18n;
