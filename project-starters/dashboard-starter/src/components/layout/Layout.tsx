import { useState, type ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

/*
  Layout — Shell that stitches Sidebar, Header, and scrollable main together.

  TODO (Day 1): Review this component to understand the layout structure,
  then build out Sidebar and Header (Layout itself is mostly complete).

  STRUCTURE:
  ┌──────────┬──────────────────────────────────┐
  │ Sidebar  │ Header (sticky)                  │
  │ (fixed   ├──────────────────────────────────┤
  │ on lg+)  │ <main> (only this area scrolls)  │
  │          │ {children}                       │
  └──────────┴──────────────────────────────────┘

  WHY `h-screen overflow-hidden` on the outer div:
  This fixes the viewport at full screen height. Only <main> gets its own
  scroll (overflow-y-auto). Without this, the entire page would scroll and
  the sidebar + header would disappear off screen on mobile.

  WHY sidebar state (sidebarOpen) lives here (not Dashboard or App):
  Only Layout and its children need this state. Dashboard doesn't care
  whether the sidebar is open — it just renders content. Keeping state at
  the lowest common ancestor avoids prop drilling.
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
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar
        isOpen={sidebarOpen}
        activeNav={activeNav}
        onNavChange={onNavChange}
        onClose={() => setSidebarOpen(false)}
      />
      {/* min-w-0: prevents wide children (large tables) from overflowing the flex container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
