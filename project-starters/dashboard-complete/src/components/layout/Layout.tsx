import { useState, type ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

/*
  Layout.tsx — Shell that stitches Sidebar, Header, and main content together.

  STRUCTURE:
  ┌─────────────────────────────────────────┐
  │ Sidebar │ Header                        │
  │  (fixed)│─────────────────────────────  │
  │         │ Main content (scrollable)     │
  │         │                               │
  └─────────────────────────────────────────┘

  WHY sidebar state lives here (not in Dashboard or App):
  Only Layout and Sidebar need this state. Dashboard doesn't care whether
  the sidebar is open or closed — it just renders content. Keeping state
  at the lowest common ancestor avoids unnecessary prop drilling.

  WHY `h-screen overflow-hidden` on the outer div:
  We want ONLY the main content area to scroll, not the whole page.
  If the page scrolled, the sidebar and header would scroll away on mobile.
  `h-screen overflow-hidden` fixes the viewport; `overflow-y-auto` on
  <main> gives that one area its own independent scroll.
*/

interface LayoutProps {
  children: ReactNode
  activeNav: string
  onNavChange: (id: string) => void
  title: string
}

export default function Layout({ children, activeNav, onNavChange, title }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    // Full-viewport flex container — sidebar on left, everything else on right
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">

      <Sidebar
        isOpen={sidebarOpen}
        activeNav={activeNav}
        onNavChange={onNavChange}
        onClose={() => setSidebarOpen(false)}
      />

      {/*
        Right column: header stacked above the scrollable main area.
        `min-w-0` prevents flex children from overflowing their container
        when content is very wide (e.g., large tables).
      */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
