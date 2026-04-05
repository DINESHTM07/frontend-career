// WHY PostCSS: Tailwind is a PostCSS plugin. PostCSS processes our CSS,
// running Tailwind to generate utility classes and Autoprefixer to add
// vendor prefixes (-webkit-, -moz-) for browser compatibility.
// This file is required for Tailwind to work with Vite.
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
