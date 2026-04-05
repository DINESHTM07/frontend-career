import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// WHY this config: Vite is our build tool and dev server.
// @vitejs/plugin-react enables Fast Refresh (HMR) for React components,
// meaning changes appear instantly without losing state.
// No other config needed for a standard React+Tailwind project.
export default defineConfig({
  plugins: [react()],
})
