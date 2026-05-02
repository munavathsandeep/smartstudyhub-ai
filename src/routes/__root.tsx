import {
  HeadContent,
  Scripts,
  createRootRoute,
  Outlet,
} from '@tanstack/react-router'
import { createContext, useContext, useEffect, useState } from 'react'

import '../styles.css'

// Theme context
export const ThemeContext = createContext<{
  theme: 'dark' | 'light'
  toggleTheme: () => void
}>({ theme: 'dark', toggleTheme: () => {} })

export const useTheme = () => useContext(ThemeContext)

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Smart Study Planner AI' },
      { name: 'description', content: 'AI-powered study planner for students' },
    ],
    links: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (saved) setTheme(saved)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
  }

  return (
    <html lang="en" className={theme === 'light' ? 'light-mode' : ''}>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          {children}
        </ThemeContext.Provider>
        <Scripts />
      </body>
    </html>
  )
}
