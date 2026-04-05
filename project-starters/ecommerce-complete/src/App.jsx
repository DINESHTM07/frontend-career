import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import ErrorBoundary from './components/ErrorBoundary'
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'
import FavoritesPage from './pages/FavoritesPage'

/*
  App.jsx: Root component. Owns the app-level layout and routing.

  RESPONSIBILITIES:
  1. Define routes (React Router v6)
  2. Render the persistent layout (Navbar)
  3. Manage cart drawer open/close state
  4. Wrap each route in an ErrorBoundary

  WHY cart drawer state lives here (not in Zustand):
  isCartOpen is pure UI state — it doesn't affect data, doesn't need to be
  persisted, and is only read by Navbar (to open) and CartDrawer (to display).
  Putting trivial UI state in a global store adds unnecessary indirection.
  useState in the nearest common ancestor (App) is the right choice.

  WHY one ErrorBoundary per route:
  If ProductDetailPage crashes, the error should not kill the Navbar or the
  entire app. Wrapping each route separately means only the failing route
  shows the fallback — the rest of the app continues working.
*/
export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    // WHY min-h-screen: Ensures the background color extends to the bottom of
    // the viewport even on short pages with little content.
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Navbar is outside Routes so it persists on every page */}
      <Navbar onCartOpen={() => setIsCartOpen(true)} />

      {/* Cart Drawer — always mounted, visibility controlled by isCartOpen */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Page Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <ErrorBoundary>
              <HomePage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ErrorBoundary>
              <ProductDetailPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/favorites"
          element={
            <ErrorBoundary>
              <FavoritesPage />
            </ErrorBoundary>
          }
        />

        {/* 404 — catch-all for unknown routes */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <div className="text-7xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Page not found
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                The page you're looking for doesn't exist.
              </p>
              <a href="/" className="btn-primary">
                Back to Shop
              </a>
            </div>
          }
        />
      </Routes>
    </div>
  )
}
