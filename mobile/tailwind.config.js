/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class', // Enable class-based dark mode for manual control
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#d9e2ff',
          200: '#bccaff',
          300: '#8fadff',
          400: '#5c83ff',
          500: '#3350f5', // Main Professional Indigo
          600: '#1d2ae7',
          700: '#151ec5',
          800: '#161d9f',
          900: '#181e7e',
          950: '#0e114a',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Moroccan Emerald Accent
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        inter: ["Inter"],
        outfit: ["Outfit-Regular"],
        "outfit-bold": ["Outfit-Bold"],
        "outfit-medium": ["Outfit-Medium"],
        cairo: ["Cairo-Regular"],
        "cairo-bold": ["Cairo-Bold"],
        "cairo-medium": ["Cairo-Medium"],
      },
    },
  },
  plugins: [],
}

