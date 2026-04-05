import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'

/*
  App.tsx — Root component. Wraps everything in ThemeProvider and Layout.

  TODO (Day 1): Read this file to understand the app structure before building.

  WHY ThemeProvider wraps EVERYTHING (including Layout):
  DarkModeToggle (inside Header, inside Layout) calls useTheme().
  If ThemeProvider weren't an ancestor of Layout, the hook would throw.
  Rule: Context.Provider must be an ancestor of all Context.Consumer components.

  WHY activeNav state lives here (not in Dashboard):
  Layout renders the Sidebar, which needs to know the active item.
  Dashboard renders the page content, which doesn't care about nav state.
  App is the lowest common ancestor of both — the right place for this state.
*/

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  analytics: 'Analytics',
  orders:    'Orders',
  users:     'Users',
  products:  'Products',
  settings:  'Settings',
}

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard')

  return (
    <ThemeProvider>
      <Layout
        activeNav={activeNav}
        onNavChange={setActiveNav}
        title={PAGE_TITLES[activeNav] ?? 'Dashboard'}
      >
        <Dashboard />
      </Layout>
    </ThemeProvider>
  )
}
