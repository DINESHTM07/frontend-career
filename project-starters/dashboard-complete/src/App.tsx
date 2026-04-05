import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'

/*
  App.tsx — Root component. Wraps everything in ThemeProvider and Layout.

  WHY ThemeProvider wraps EVERYTHING (including Layout):
  DarkModeToggle (inside Header, inside Layout) calls useTheme().
  If ThemeProvider weren't an ancestor of Layout, the hook would throw.
  The rule: Context.Provider must be an ancestor of all Context.Consumer components.

  ACTIVE NAV STATE:
  In a real multi-page app, this would be React Router's useLocation().
  Here we use a simple useState — the nav items are cosmetic (they all
  show the Dashboard page) but demonstrate the selection highlight pattern.

  WHY App renders <Layout> (not Dashboard directly):
  Layout is the chrome (sidebar + header). Dashboard is the content.
  Keeping them separate means if you add more pages, each page just
  renders inside Layout without duplicating the chrome.
*/

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  analytics:  'Analytics',
  orders:     'Orders',
  users:      'Users',
  products:   'Products',
  settings:   'Settings',
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
        {/*
          In a real app, you'd render different page components based on activeNav.
          For this demo, Dashboard is the only page — but the pattern is here.
        */}
        <Dashboard />
      </Layout>
    </ThemeProvider>
  )
}
