// ============================================
// INTRO: Context API — Pub-Sub Pattern for React
// ============================================
// React's prop-drilling problem: when deeply nested components need
// data from a distant ancestor, you must pass props through every
// intermediate component — even ones that don't use it.
//
// Context solves this with a Pub-Sub pattern:
//   PUBLISHER: <ThemeContext.Provider value={theme}>
//   SUBSCRIBER: const theme = useContext(ThemeContext)
//
// Subscribers anywhere in the tree receive updates when the publisher's
// value changes — no intermediate components needed.
//
// This file builds THREE nested contexts:
//   1. ThemeContext    — dark/light mode, primary color
//   2. LanguageContext — locale, translation function
//   3. AuthContext     — user, login/logout, role-based access
//
// WHY it matters:
//   Context + useReducer = the React equivalent of Redux.
//   Almost every React app has at least one context (theme or auth).
//   Understanding context deeply is required for mid-senior React roles.
//   Interview: "How does Context work? When would you NOT use it?"
// ============================================

// ============================================
// MENTAL MODEL: How to think about Context
// ============================================
// Context is like an electrical power grid:
//   Provider = the power plant (generates and distributes value)
//   Consumer = any appliance that plugs in (uses the value)
//   The wire network (intermediate components) doesn't need to know
//   what's flowing through it — appliances connect directly.
//
// IMPORTANT: Context re-renders ALL consumers when the value changes.
//   If ThemeContext.Provider value changes → every useContext(ThemeContext)
//   subscriber re-renders, even if their part of the value didn't change.
//   This is why you split contexts (one per concern) and memoize values.
//
// Pub-Sub:
//   subscribe → useContext(SomeContext) inside a component
//   publish   → updating state in the Provider
//   notify    → React re-renders all subscribers with new value
// ============================================

import {
  createContext, useContext, useReducer, useState,
  useCallback, useMemo, memo
} from 'react'

// ============================================
// CONTEXT 1: THEME
// ============================================

const ThemeContext = createContext(null)

const THEMES = {
  light: {
    bg:      '#ffffff',
    surface: '#f9fafb',
    border:  '#e5e7eb',
    text:    '#111827',
    muted:   '#6b7280',
    primary: '#3b82f6',
    danger:  '#ef4444',
    success: '#22c55e',
  },
  dark: {
    bg:      '#111827',
    surface: '#1f2937',
    border:  '#374151',
    text:    '#f9fafb',
    muted:   '#9ca3af',
    primary: '#60a5fa',
    danger:  '#f87171',
    success: '#4ade80',
  },
}

function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light')   // 'light' | 'dark'
  const [accent, setAccent] = useState('#3b82f6')

  // Memoize context value: only change when mode or accent changes
  // Without useMemo: new object every render → all consumers re-render
  const value = useMemo(() => ({
    mode,
    theme: { ...THEMES[mode], primary: accent },
    accent,
    toggleMode: () => setMode(m => m === 'light' ? 'dark' : 'light'),
    setAccent,
  }), [mode, accent])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook: validates usage + provides default
function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}

// ============================================
// CONTEXT 2: LANGUAGE
// ============================================

const LanguageContext = createContext(null)

const TRANSLATIONS = {
  en: {
    welcome:    'Welcome',
    balance:    'Balance',
    settings:   'Settings',
    logout:     'Log out',
    login:      'Log in',
    darkMode:   'Dark mode',
    language:   'Language',
    role:       'Role',
    admin:      'Admin',
    user:       'User',
    guest:      'Guest',
    loading:    'Loading...',
    notFound:   'Page not found',
  },
  hi: {
    welcome:    'स्वागत',
    balance:    'शेष राशि',
    settings:   'सेटिंग्स',
    logout:     'लॉग आउट',
    login:      'लॉग इन',
    darkMode:   'डार्क मोड',
    language:   'भाषा',
    role:       'भूमिका',
    admin:      'व्यवस्थापक',
    user:       'उपयोगकर्ता',
    guest:      'अतिथि',
    loading:    'लोड हो रहा है...',
    notFound:   'पेज नहीं मिला',
  },
  te: {
    welcome:    'స్వాగతం',
    balance:    'నిల్వ',
    settings:   'సెట్టింగ్‌లు',
    logout:     'లాగ్ అవుట్',
    login:      'లాగిన్',
    darkMode:   'డార్క్ మోడ్',
    language:   'భాష',
    role:       'పాత్ర',
    admin:      'అడ్మిన్',
    user:       'వినియోగదారు',
    guest:      'అతిథి',
    loading:    'లోడ్ అవుతోంది...',
    notFound:   'పేజీ కనుగొనబడలేదు',
  },
}

function LanguageProvider({ children }) {
  const [locale, setLocale] = useState('en')

  const t = useCallback((key) => {
    return TRANSLATIONS[locale]?.[key] ?? TRANSLATIONS.en[key] ?? key
  }, [locale])

  const value = useMemo(() => ({
    locale,
    setLocale,
    t,
    availableLocales: [
      { code: 'en', label: 'English', flag: '🇬🇧' },
      { code: 'hi', label: 'हिन्दी',  flag: '🇮🇳' },
      { code: 'te', label: 'తెలుగు',  flag: '🇮🇳' },
    ],
  }), [locale, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}

// ============================================
// CONTEXT 3: AUTH
// ============================================

const AuthContext = createContext(null)

// Auth state machine using useReducer
const authInitial = { user: null, status: 'idle' }  // status: 'idle' | 'loading' | 'authenticated' | 'error'

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':   return { ...state, status: 'loading' }
    case 'LOGIN_SUCCESS': return { user: action.payload.user, status: 'authenticated' }
    case 'LOGIN_ERROR':   return { user: null, status: 'error' }
    case 'LOGOUT':        return authInitial
    case 'UPDATE_USER':   return { ...state, user: { ...state.user, ...action.payload } }
    default:              return state
  }
}

const DEMO_USERS = {
  admin:  { id: 1, name: 'Admin User', email: 'admin@app.com', role: 'admin',  avatar: '👨‍💼' },
  editor: { id: 2, name: 'Priya Sharma', email: 'priya@app.com', role: 'editor', avatar: '👩‍💻' },
  viewer: { id: 3, name: 'Rahul Kumar', email: 'rahul@app.com', role: 'viewer', avatar: '👤' },
}

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, authInitial)

  const login = useCallback(async (role = 'viewer') => {
    dispatch({ type: 'LOGIN_START' })
    // Simulate API call
    await new Promise(r => setTimeout(r, 800))
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user: DEMO_USERS[role] } })
  }, [])

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' })
  }, [])

  // Role-based access control helper
  const can = useCallback((permission) => {
    const role = state.user?.role
    const permissions = {
      admin:  ['view', 'edit', 'delete', 'manage'],
      editor: ['view', 'edit'],
      viewer: ['view'],
    }
    return permissions[role]?.includes(permission) ?? false
  }, [state.user])

  const value = useMemo(() => ({
    user: state.user,
    status: state.status,
    isAuthenticated: state.status === 'authenticated',
    isLoading: state.status === 'loading',
    login,
    logout,
    can,
  }), [state, login, logout, can])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

// ============================================
// ROLE-BASED ACCESS COMPONENT
// ============================================
// Declarative access control: wrap protected content
function Restricted({ permission, fallback = null, children }) {
  const { can, isAuthenticated } = useAuth()
  if (!isAuthenticated || !can(permission)) return fallback
  return children
}

// ============================================
// DEEP CONSUMER COMPONENTS
// ============================================
// These components are deep in the tree but access context directly
// without any props being passed through intermediate components.

// Deeply nested — no props needed from ancestors
const UserAvatar = memo(function UserAvatar() {
  const { user, isAuthenticated } = useAuth()
  const { theme } = useTheme()
  if (!isAuthenticated) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '1.5rem' }}>{user.avatar}</span>
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: theme.text }}>{user.name}</div>
        <div style={{ fontSize: '0.7rem', color: theme.muted }}>{user.email}</div>
      </div>
    </div>
  )
})

const ThemeToggle = memo(function ThemeToggle() {
  const { mode, toggleMode, theme } = useTheme()
  const { t } = useLanguage()
  return (
    <button onClick={toggleMode} style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '8px 14px', border: `1px solid ${theme.border}`,
      borderRadius: '8px', background: theme.surface, color: theme.text,
      cursor: 'pointer', fontSize: '0.85rem',
    }}>
      {mode === 'light' ? '🌙' : '☀️'} {t('darkMode')}
    </button>
  )
})

const LanguageSwitcher = memo(function LanguageSwitcher() {
  const { locale, setLocale, availableLocales, t } = useLanguage()
  const { theme } = useTheme()
  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      <span style={{ fontSize: '0.75rem', color: theme.muted }}>{t('language')}:</span>
      {availableLocales.map(l => (
        <button key={l.code} onClick={() => setLocale(l.code)} style={{
          padding: '4px 10px', borderRadius: '6px', border: `1px solid ${theme.border}`,
          background: locale === l.code ? theme.primary : theme.surface,
          color: locale === l.code ? '#fff' : theme.muted,
          cursor: 'pointer', fontSize: '0.75rem', fontWeight: locale === l.code ? 600 : 400,
        }}>
          {l.flag} {l.code.toUpperCase()}
        </button>
      ))}
    </div>
  )
})

const LoginPanel = memo(function LoginPanel() {
  const { login, isLoading } = useAuth()
  const { t } = useLanguage()
  const { theme } = useTheme()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', padding: '32px' }}>
      <div style={{ fontSize: '3rem' }}>🔐</div>
      <div style={{ fontWeight: 700, color: theme.text, fontSize: '1.1rem' }}>{t('login')}</div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {Object.entries(DEMO_USERS).map(([role, u]) => (
          <button key={role} onClick={() => login(role)} disabled={isLoading}
            style={{
              padding: '10px 16px', borderRadius: '10px', border: `1px solid ${theme.border}`,
              background: theme.surface, color: theme.text, cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: isLoading ? 0.6 : 1,
            }}>
            <span style={{ fontSize: '1.5rem' }}>{u.avatar}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{role}</span>
            <span style={{ fontSize: '0.65rem', color: theme.muted }}>{u.name}</span>
          </button>
        ))}
      </div>
      {isLoading && <span style={{ color: theme.muted, fontSize: '0.85rem' }}>{t('loading')}</span>}
    </div>
  )
})

const Dashboard = memo(function Dashboard() {
  const { user, logout, can } = useAuth()
  const { theme } = useTheme()
  const { t } = useLanguage()

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <UserAvatar />

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {/* Role badge */}
        <span style={{
          padding: '4px 12px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
          background: user.role === 'admin' ? '#fef3c7' : user.role === 'editor' ? '#ede9fe' : '#f3f4f6',
          color: user.role === 'admin' ? '#92400e' : user.role === 'editor' ? '#5b21b6' : '#374151',
        }}>
          {t(user.role)} — {user.role}
        </span>
      </div>

      {/* Content sections with role-based access */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <AccessCard title="📖 View" granted={can('view')} desc="Read access to all content" theme={theme} />
        <AccessCard title="✏️ Edit" granted={can('edit')} desc="Create and modify content" theme={theme} />
        <AccessCard title="🗑️ Delete" granted={can('delete')} desc="Remove content permanently" theme={theme} />
        <AccessCard title="⚙️ Manage" granted={can('manage')} desc="Admin settings and users" theme={theme} />
      </div>

      <Restricted permission="manage">
        <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '10px', border: '1px solid #fde68a' }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#92400e' }}>🔑 Admin Panel</div>
          <div style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '4px' }}>
            Only admins can see this section.
          </div>
        </div>
      </Restricted>

      <button onClick={logout} style={{
        padding: '9px', border: `1px solid ${theme.danger}`, borderRadius: '8px',
        background: 'transparent', color: theme.danger, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
      }}>
        {t('logout')}
      </button>
    </div>
  )
})

function AccessCard({ title, granted, desc, theme }) {
  return (
    <div style={{
      padding: '10px 12px', borderRadius: '8px', border: `1px solid ${theme.border}`,
      background: granted ? (theme.bg) : theme.surface,
      opacity: granted ? 1 : 0.5,
    }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: theme.text }}>{title}</div>
      <div style={{ fontSize: '0.7rem', color: theme.muted, marginTop: '2px' }}>{desc}</div>
      <div style={{ fontSize: '0.65rem', marginTop: '4px', color: granted ? '#22c55e' : '#ef4444', fontWeight: 700 }}>
        {granted ? '✓ Granted' : '✗ Denied'}
      </div>
    </div>
  )
}

// ============================================
// SETTINGS PANEL — uses all 3 contexts
// ============================================
const SettingsPanel = memo(function SettingsPanel() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  return (
    <div style={{
      padding: '16px', background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '14px',
    }}>
      <h3 style={{ fontSize: '0.85rem', color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
        ⚙️ {t('settings')}
      </h3>
      <ThemeToggle />
      <LanguageSwitcher />
    </div>
  )
})

// ============================================
// MAIN APP — Provider composition (the tower)
// ============================================
export default function ContextTower() {
  // Provider order: outermost providers are available to all inner providers
  // ThemeProvider → LanguageProvider → AuthProvider
  // Each provider can consume outer providers if needed
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

function AppShell() {
  const { theme, mode } = useTheme()
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      color: theme.text,
      fontFamily: 'system-ui, sans-serif',
      transition: 'background 0.2s, color 0.2s',
    }}>
      {/* Header */}
      <header style={{
        padding: '14px 24px',
        borderBottom: `1px solid ${theme.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: theme.surface,
      }}>
        <div style={{ fontWeight: 700, fontSize: '1rem' }}>🏗️ Context Tower</div>
        <div style={{ fontSize: '0.75rem', color: theme.muted }}>
          3 Nested Contexts | Mode: {mode}
        </div>
      </header>

      {/* Main content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', alignItems: 'start' }}>
        <div>
          <div style={{ padding: '16px', background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '0.85rem', color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
              {t('welcome')} — Auth Context
            </h2>
            {isAuthenticated ? <Dashboard /> : <LoginPanel />}
          </div>

          {/* Context diagram */}
          <div style={{ padding: '14px', background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '12px' }}>
            <div style={{ fontSize: '0.75rem', color: theme.muted, marginBottom: '10px', fontWeight: 600 }}>Context Provider Tree:</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: theme.text, lineHeight: '1.8' }}>
              <div style={{ color: '#22c55e' }}>{'<ThemeProvider>'}  ← outermost</div>
              <div style={{ color: '#3b82f6', marginLeft: '16px' }}>{'<LanguageProvider>'}</div>
              <div style={{ color: '#ef4444', marginLeft: '32px' }}>{'<AuthProvider>'}</div>
              <div style={{ color: theme.muted, marginLeft: '48px' }}>{'<AppShell />'}</div>
              <div style={{ color: theme.muted, marginLeft: '64px' }}>{'<Dashboard />'}</div>
              <div style={{ color: theme.muted, marginLeft: '80px' }}>{'<UserAvatar /> — uses ALL 3'}</div>
              <div style={{ color: '#ef4444', marginLeft: '32px' }}>{'</AuthProvider>'}</div>
              <div style={{ color: '#3b82f6', marginLeft: '16px' }}>{'</LanguageProvider>'}</div>
              <div style={{ color: '#22c55e' }}>{'</ThemeProvider>'}</div>
            </div>
          </div>
        </div>

        <div style={{ position: 'sticky', top: '20px' }}>
          <SettingsPanel />
        </div>
      </div>
    </div>
  )
}

// ============================================
// CHECKPOINT: Stop! Answer these before continuing
// ============================================
// 1. Why does every Context have a custom hook (useTheme, useAuth)?
//    Answer: (a) Throws a useful error if used outside its Provider —
//    without this, useContext returns null and breaks silently.
//    (b) Encapsulates the context dependency — consumers import useTheme,
//    not { useContext, ThemeContext } — cleaner imports.
//    (c) Allows adding validation or defaults in one place.
//
// 2. Why do Provider values use useMemo?
//    Answer: Without useMemo, a new object is created on every render.
//    React compares Provider values by reference (===). A new object
//    reference → all consumers re-render even if data didn't change.
//    useMemo: only create a new object when the actual data changes.
//
// 3. What does memo() do on Dashboard, UserAvatar, etc.?
//    Answer: React.memo wraps a component to skip re-rendering if its
//    PROPS haven't changed. Since these components get their data from
//    Context (not props), memo only helps if some other state change in
//    a parent component causes unnecessary re-renders.
//
// 4. Why should you NOT put everything in one giant context?
//    Answer: If AuthContext and ThemeContext are combined, every auth
//    change causes all theme consumers to re-render, and vice versa.
//    Splitting by concern: components subscribe only to the context they
//    actually need. Unrelated changes don't cause unnecessary re-renders.
// ============================================

// ============================================
// YOUR TURN: Add a Notification Context as 4th Layer
// ============================================
// Add a NotificationContext that sits inside AuthProvider.
// Notifications should be able to access the current user (from AuthContext).
//
// STATE:
//   { notifications: [{ id, type, message, read, timestamp }] }
//   types: 'info' | 'success' | 'warning' | 'error'
//
// ACTIONS (useReducer):
//   ADD_NOTIFICATION    { type, message }
//   MARK_READ           { id }
//   MARK_ALL_READ
//   DISMISS             { id }
//   CLEAR_ALL
//
// COMPONENTS to build:
//
//   NotificationBell
//   → Shows 🔔 with unread count badge
//   → Click to toggle notification dropdown
//   → Dropdown shows last 10 notifications
//
//   NotificationItem({ notification, onMarkRead, onDismiss })
//   → Shows type icon (ℹ️ ✅ ⚠️ ❌), message, timestamp
//   → Unread items have slightly different background
//
//   useNotification() custom hook
//   → Returns { notifications, unreadCount, add, markRead, markAllRead, dismiss }
//
// Trigger demo notifications:
//   When user logs in → add 'success' notification: "Welcome back, {name}!"
//   When user role changes → add 'info' notification: "Your role is now {role}"
//   Every 30 seconds → add 'info' notification: "System check OK"

// YOUR CODE HERE:
const NotificationContext = createContext(null)
export function NotificationProvider({ children }) {
  // YOUR CODE HERE
}
export function useNotification() {
  // YOUR CODE HERE
}
export function NotificationBell() {
  // YOUR CODE HERE
}

// ============================================
// BOSS CHALLENGE: Context + Performance optimization
// ============================================
// The current implementation re-renders ALL consumers of ThemeContext
// when ANYTHING in the theme object changes (even accent color while
// only 1 component uses it).
//
// Implement context splitting for maximum performance:
//
//   // Split ThemeContext into two:
//   ThemeValueContext   ← the theme colors/values (rarely changes)
//   ThemeActionsContext ← the toggle/setAccent functions (never changes)
//
//   // In consumers:
//   const theme  = useContext(ThemeValueContext)   // re-renders on theme change
//   const { toggleMode } = useContext(ThemeActionsContext) // NEVER re-renders
//
// Also implement Context with selector (unstable_observe pattern):
//   function useThemeSelector(selector) {
//     const ctx = useContext(ThemeContext)
//     return useMemo(() => selector(ctx), [ctx, selector])
//   }
//   // Usage: only re-renders when the selected value changes
//   const primaryColor = useThemeSelector(t => t.theme.primary)
//
// Measure the difference using React DevTools Profiler.

// ============================================
// PATTERN LEARNED: Pub-Sub (Context)
// ============================================
// PATTERN NAME: Context as Pub-Sub / Dependency Injection
// WHEN YOU SEE: Data needed by many components across the tree,
//               prop drilling through 3+ component levels
// USE THIS:
//
//   // 1. Create context
//   const MyContext = createContext(null)
//
//   // 2. Provider with memoized value
//   function MyProvider({ children }) {
//     const [state, setState] = useState(initial)
//     const value = useMemo(() => ({ state, setState }), [state])
//     return <MyContext.Provider value={value}>{children}</MyContext.Provider>
//   }
//
//   // 3. Custom hook (validates usage)
//   function useMyContext() {
//     const ctx = useContext(MyContext)
//     if (!ctx) throw new Error('useMyContext must be inside MyProvider')
//     return ctx
//   }
//
//   // 4. Wrap app (or subtree)
//   <MyProvider><App /></MyProvider>
//
//   // 5. Consume anywhere in the tree
//   function DeepComponent() {
//     const { state } = useMyContext()
//     return <div>{state.value}</div>
//   }
//
// WHEN NOT TO USE CONTEXT:
//   Data changes frequently (every keystroke) → causes many re-renders
//   Only 1-2 levels of nesting → just use props
//   Data is local to a small subtree → keep it local
//   Server state (API data) → use React Query instead
//
// REACT CONNECTION:
//   React Query: provides its own context internally
//   Redux: wraps with <Provider store={store}> — same concept, external lib
//   Zustand: no Provider needed — uses module scope + useSyncExternalStore
//   Jotai: atom-based — more granular than context
// ============================================
