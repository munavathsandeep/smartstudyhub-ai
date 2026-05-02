// Lightweight localStorage-based state management

export interface Task {
  id: string
  title: string
  subject: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
  dueDate?: string
  estimatedMinutes: number
}

export interface Exam {
  id: string
  subject: string
  date: string
  difficulty: 'easy' | 'medium' | 'hard'
  color: string
}

export interface StudySession {
  id: string
  subject: string
  minutes: number
  date: string
  type: 'pomodoro' | 'deep' | 'review'
}

export interface UserProfile {
  name: string
  email: string
  avatar: string
  level: number
  xp: number
  xpToNext: number
  streak: number
  totalHours: number
  badges: string[]
}

const DEFAULTS = {
  tasks: [
    { id: '1', title: 'Complete Calculus Chapter 5', subject: 'Mathematics', priority: 'high' as const, completed: false, dueDate: '2026-05-05', estimatedMinutes: 90 },
    { id: '2', title: 'Read Physics textbook pages 120-140', subject: 'Physics', priority: 'medium' as const, completed: false, dueDate: '2026-05-06', estimatedMinutes: 45 },
    { id: '3', title: 'Write essay outline for History', subject: 'History', priority: 'medium' as const, completed: true, dueDate: '2026-05-03', estimatedMinutes: 60 },
    { id: '4', title: 'Practice 20 Chemistry problems', subject: 'Chemistry', priority: 'high' as const, completed: false, dueDate: '2026-05-04', estimatedMinutes: 120 },
    { id: '5', title: 'Review CS algorithms notes', subject: 'Computer Science', priority: 'low' as const, completed: false, dueDate: '2026-05-08', estimatedMinutes: 30 },
  ],
  exams: [
    { id: '1', subject: 'Mathematics', date: '2026-05-10', difficulty: 'hard' as const, color: '#6366f1' },
    { id: '2', subject: 'Physics', date: '2026-05-14', difficulty: 'hard' as const, color: '#8b5cf6' },
    { id: '3', subject: 'Chemistry', date: '2026-05-18', difficulty: 'medium' as const, color: '#06b6d4' },
    { id: '4', subject: 'History', date: '2026-05-22', difficulty: 'easy' as const, color: '#10b981' },
  ],
  sessions: [
    { id: '1', subject: 'Mathematics', minutes: 90, date: '2026-05-01', type: 'pomodoro' as const },
    { id: '2', subject: 'Physics', minutes: 60, date: '2026-05-01', type: 'deep' as const },
    { id: '3', subject: 'Chemistry', minutes: 45, date: '2026-04-30', type: 'review' as const },
    { id: '4', subject: 'Mathematics', minutes: 120, date: '2026-04-30', type: 'deep' as const },
    { id: '5', subject: 'Computer Science', minutes: 75, date: '2026-04-29', type: 'pomodoro' as const },
    { id: '6', subject: 'History', minutes: 30, date: '2026-04-29', type: 'review' as const },
    { id: '7', subject: 'Physics', minutes: 90, date: '2026-04-28', type: 'deep' as const },
  ],
  user: {
    name: 'Alex Johnson',
    email: 'alex@studyai.com',
    avatar: 'AJ',
    level: 12,
    xp: 2840,
    xpToNext: 3000,
    streak: 7,
    totalHours: 156,
    badges: ['🔥 7-Day Streak', '⭐ Early Bird', '📚 100-Hour Club', '🎯 Goal Crusher'],
  },
  settings: {
    pomodoroMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    autoStartBreaks: false,
    soundEnabled: true,
    notificationsEnabled: true,
    weeklyGoalHours: 20,
  },
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const v = localStorage.getItem(`ssp_${key}`)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

function save(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  localStorage.setItem(`ssp_${key}`, JSON.stringify(value))
}

export const store = {
  getTasks: () => load('tasks', DEFAULTS.tasks),
  setTasks: (tasks: Task[]) => save('tasks', tasks),
  getExams: () => load('exams', DEFAULTS.exams),
  setExams: (exams: Exam[]) => save('exams', exams),
  getSessions: () => load('sessions', DEFAULTS.sessions),
  setSessions: (sessions: StudySession[]) => save('sessions', sessions),
  getUser: () => load('user', DEFAULTS.user),
  setUser: (user: UserProfile) => save('user', user),
  getSettings: () => load('settings', DEFAULTS.settings),
  setSettings: (s: typeof DEFAULTS.settings) => save('settings', s),
}

export function getDaysUntil(dateStr: string): number {
  const now = new Date()
  const target = new Date(dateStr)
  const diff = target.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const MOTIVATIONAL_QUOTES = [
  "The secret of getting ahead is getting started. — Mark Twain",
  "It always seems impossible until it's done. — Nelson Mandela",
  "Success is the sum of small efforts repeated day in and day out. — Robert Collier",
  "Believe you can and you're halfway there. — Theodore Roosevelt",
  "The future belongs to those who believe in the beauty of their dreams. — Eleanor Roosevelt",
  "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
  "Education is the most powerful weapon you can use to change the world. — Nelson Mandela",
  "The more that you read, the more things you will know. — Dr. Seuss",
  "Learning never exhausts the mind. — Leonardo da Vinci",
  "An investment in knowledge pays the best interest. — Benjamin Franklin",
]

export const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#6366f1',
  Physics: '#8b5cf6',
  Chemistry: '#06b6d4',
  History: '#10b981',
  'Computer Science': '#f59e0b',
  Biology: '#ec4899',
  English: '#ef4444',
  Economics: '#14b8a6',
}
