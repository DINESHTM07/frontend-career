import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import ErrorBoundary from './components/ErrorBoundary'
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'
import FavoritesPage from './pages/FavoritesPage'

// TODO (Day 1): Review this file to understand the app structure.
// App.jsx owns the layout and routing. Cart drawer open/close state lives here
// because it's pure UI state that doesn't need to be in the global store.
//
// Your tasks here:
//   - Understand why isCartOpen lives in useState (not Zustand)
//   - Understand why Navbar is outside <Routes> (it persists across all pages)
//   - Understand why each route is wrapped in <ErrorBoundary>

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar onCartOpen={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

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
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <div className="text-7xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Page not found
              </h2>
              <a href="/" className="btn-primary">Back to Shop</a>
            </div>
          }
        />
      </Routes>
    </div>
  )
}
