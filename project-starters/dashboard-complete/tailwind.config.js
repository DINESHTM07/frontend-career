/** @type {import('tailwindcss').Config} */
export default {
  // WHY 'class': We control dark mode by toggling the 'dark' class on <html>.
  // ThemeContext writes to localStorage and flips the class — user preference
  // overrides the OS setting, which is better UX for a dashboard app.
  darkMode: 'class',

  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        // Single brand color scale — change here to retheme the whole app.
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
      // Sidebar width used consistently across Layout and main content offset
      spacing: {
        'sidebar': '256px',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        fadeIn:  'fadeIn 0.2s ease-out',
        slideIn: 'slideIn 0.25s ease-out',
      },
    },
  },
  plugins: [],
}
