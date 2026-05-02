import { useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import {
  LayoutDashboard,
  BarChart2,
  Timer,
  CheckSquare,
  BookOpen,
  User,
  Settings,
  Menu,
  X,
  Zap,
  Sun,
  Moon,
  Brain,
} from 'lucide-react'
import { useTheme } from '@/routes/__root'
import { store } from '@/lib/store'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/focus', icon: Timer, label: 'Focus Mode' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/ai-assistant', icon: Brain, label: 'AI Assistant' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function Navigation({ currentPath }: { currentPath: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const user = store.getUser()

  const xpPct = Math.round((user.xp / user.xpToNext) * 100)

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6">
      {/* Logo */}
      <div className="px-4 mb-8">
        <Link to="/" className="flex items-center gap-3 group" style={{ textDecoration: 'none' }}>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <BookOpen size={20} color="white" />
          </div>
          <div>
            <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              StudyAI
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Smart Planner
            </div>
          </div>
        </Link>
      </div>

      {/* User level card */}
      <div
        className="mx-4 mb-6 p-3 rounded-xl"
        style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--gradient-primary)' }}
          >
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {user.name}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Level {user.level}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#fbbf24' }}>
            <Zap size={12} />
            {user.xp}
          </div>
        </div>
        <div className="xp-bar">
          <div className="xp-fill" style={{ width: `${xpPct}%` }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>XP {user.xp}</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.xpToNext}</span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`sidebar-link ${currentPath === to || currentPath.startsWith(to) ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom controls */}
      <div className="px-3 mt-6 space-y-2">
        <button
          onClick={toggleTheme}
          className="sidebar-link w-full"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          <span className="streak-fire">🔥</span>
          {user.streak} day streak
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar hidden md:block">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 glass"
        style={{ borderBottom: '1px solid var(--glass-border)' }}
      >
        <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <BookOpen size={16} color="white" />
          </div>
          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>StudyAI</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg"
          style={{ color: 'var(--text-primary)', background: 'var(--bg-card)' }}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="absolute left-0 top-0 bottom-0 w-72 glass"
            style={{ borderRight: '1px solid var(--glass-border)' }}
          >
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}

export function PageLayout({
  children,
  title,
  subtitle,
  currentPath,
}: {
  children: React.ReactNode
  title?: string
  subtitle?: string
  currentPath: string
}) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navigation currentPath={currentPath} />
      <div className="md:pl-[260px] pt-14 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {(title || subtitle) && (
            <div className="mb-6">
              {title && (
                <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {subtitle}
                </p>
              )}
            </div>
          )}
          <div className="page-content">{children}</div>
        </div>
      </div>
    </div>
  )
}
