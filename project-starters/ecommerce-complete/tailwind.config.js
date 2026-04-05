/** @type {import('tailwindcss').Config} */
export default {
  // WHY darkMode: 'class': We control dark mode by toggling the 'dark' class on
  // the <html> element. The alternative is 'media' which follows the OS setting
  // automatically, but 'class' gives the USER control via a toggle button —
  // which is better UX for an e-commerce app (user preference overrides OS).
  darkMode: 'class',

  // WHY content array: Tailwind scans these files at build time to generate
  // only the CSS classes actually used. Without this, the CSS bundle would be
  // enormous (megabytes). With it, production CSS is typically <10KB.
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      // WHY custom colors: Our brand uses indigo as the primary accent.
      // Defining them here means we can use 'bg-brand' instead of 'bg-indigo-600'
      // everywhere — if the brand color changes, we update ONE place.
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
      // WHY custom animation: Tailwind has 'animate-pulse' but our skeleton
      // shimmer looks better with a horizontal sweep. Custom keyframes let us
      // define exactly that without adding an animation library.
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer:  'shimmer 1.5s infinite linear',
        slideIn:  'slideIn 0.3s ease-out',
        fadeIn:   'fadeIn 0.25s ease-out',
      },
    },
  },
  plugins: [],
}
