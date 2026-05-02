import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Brain, Clock, CheckSquare, Target, Zap, TrendingUp,
  Calendar, BookOpen, ArrowRight, Sparkles, AlertCircle, Plus
} from 'lucide-react'
import { PageLayout } from '@/components/Navigation'
import { store, getDaysUntil, formatDate, SUBJECT_COLORS } from '@/lib/store'
import type { Task, Exam } from '@/lib/store'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

const AI_SCHEDULE = [
  { time: '09:00', subject: 'Mathematics', duration: '90 min', type: 'Deep Study', color: '#6366f1', tip: 'Start with hardest topic' },
  { time: '10:45', subject: 'Short Break', duration: '15 min', type: 'Break', color: '#10b981', tip: 'Walk or stretch' },
  { time: '11:00', subject: 'Physics', duration: '60 min', type: 'Review', color: '#8b5cf6', tip: 'Focus on formulas' },
  { time: '12:30', subject: 'Lunch Break', duration: '45 min', type: 'Break', color: '#f59e0b', tip: 'Step away from screens' },
  { time: '13:30', subject: 'Chemistry', duration: '75 min', type: 'Practice', color: '#06b6d4', tip: 'Work through problem sets' },
  { time: '15:00', subject: 'History', duration: '45 min', type: 'Review', color: '#ec4899', tip: 'Re-read key chapters' },
]

const AI_SUGGESTIONS = [
  { icon: '⚠️', subject: 'Mathematics', message: 'You\'re falling behind on Calculus. Recommend 2 extra hours this week.', urgent: true },
  { icon: '💡', subject: 'Physics', message: 'Great progress! You\'re on track for your exam. Keep current pace.', urgent: false },
  { icon: '📚', subject: 'Chemistry', message: 'Focus on Organic Chemistry chapters 7-9. Common exam topics.', urgent: false },
  { icon: '🎯', subject: 'History', message: 'Review WWI causes and effects — likely to appear in upcoming exam.', urgent: false },
]

function CircularProgress({ value, size = 80, strokeWidth = 8, color = '#6366f1', label }: {
  value: number; size?: number; strokeWidth?: number; color?: string; label?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="progress-ring">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{value}%</div>
        {label && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>}
      </div>
    </div>
  )
}

function Dashboard() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const user = store.getUser()

  useEffect(() => {
    setTasks(store.getTasks())
    setExams(store.getExams())
  }, [])

  const completedTasks = tasks.filter(t => t.completed).length
  const taskCompletionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0
  const upcomingExams = exams.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 3)
  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 4)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <PageLayout
      currentPath="/dashboard"
    >
      {/* Welcome banner */}
      <div
        className="relative p-6 rounded-2xl mb-6 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))',
          border: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        <div className="orb orb-primary" style={{ width: 300, height: 300, right: -100, top: -100 }} />
        <div className="relative">
          <div className="text-sm font-medium mb-1" style={{ color: '#a5b4fc' }}>
            {greeting()}, {user.name.split(' ')[0]}! 👋
          </div>
          <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
            Ready to crush your goals today?
          </h1>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            You have <strong style={{ color: '#f59e0b' }}>{pendingTasks.length} tasks</strong> pending and your next exam is in{' '}
            <strong style={{ color: '#ec4899' }}>{upcomingExams[0] ? getDaysUntil(upcomingExams[0].date) : 0} days</strong>.
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => router.navigate({ to: '/focus' })}
              className="btn-primary text-sm px-4 py-2"
            >
              <Zap size={14} />
              Start Focus Session
            </button>
            <button
              onClick={() => router.navigate({ to: '/tasks' })}
              className="btn-secondary text-sm px-4 py-2"
            >
              View Tasks
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Study Hours Today', value: '3h 45m', icon: Clock, color: '#6366f1', bg: 'rgba(99,102,241,0.1)', change: '+12%' },
          { label: 'Tasks Completed', value: `${completedTasks}/${tasks.length}`, icon: CheckSquare, color: '#10b981', bg: 'rgba(16,185,129,0.1)', change: `${taskCompletionRate}%` },
          { label: 'Study Streak', value: `${user.streak} days`, icon: Zap, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', change: '🔥' },
          { label: 'Level', value: `Lvl ${user.level}`, icon: TrendingUp, color: '#ec4899', bg: 'rgba(236,72,153,0.1)', change: `${user.xp} XP` },
        ].map(({ label, value, icon: Icon, color, bg, change }) => (
          <div
            key={label}
            className="stat-card animate-fade-in-up"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                <Icon size={20} style={{ color }} />
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${color}20`, color }}>
                {change}
              </span>
            </div>
            <div className="text-2xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>{value}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* AI Schedule */}
        <div
          className="lg:col-span-2 p-5 rounded-2xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain size={18} style={{ color: '#818cf8' }} />
              <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>Today's AI Schedule</h2>
              <span className="badge badge-primary text-xs">AI Generated</span>
            </div>
            <button className="text-xs" style={{ color: '#818cf8' }}>Regenerate</button>
          </div>
          <div className="space-y-2">
            {AI_SCHEDULE.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                  background: item.type === 'Break' ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${item.type === 'Break' ? 'rgba(16,185,129,0.1)' : 'transparent'}`,
                }}
              >
                <div className="text-xs w-14 font-mono" style={{ color: 'var(--text-muted)' }}>{item.time}</div>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <div className="flex-1">
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.subject}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.tip}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium" style={{ color: item.color }}>{item.duration}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity circle */}
        <div className="space-y-4">
          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <h2 className="font-bold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>
              Today's Productivity
            </h2>
            <div className="flex items-center justify-center mb-4">
              <CircularProgress value={74} size={120} strokeWidth={10} color="#6366f1" label="Overall" />
            </div>
            <div className="space-y-3">
              {[
                { label: 'Focus Score', value: 82, color: '#6366f1' },
                { label: 'Task Rate', value: taskCompletionRate, color: '#10b981' },
                { label: 'Goals Met', value: 60, color: '#f59e0b' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ color }}>{value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full progress-animate"
                      style={{ width: `${value}%`, background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Streak card */}
          <div
            className="p-4 rounded-2xl text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.05))',
              border: '1px solid rgba(245,158,11,0.2)',
            }}
          >
            <div className="text-4xl mb-1"><span className="streak-fire">🔥</span></div>
            <div className="text-3xl font-black" style={{ color: '#fbbf24' }}>{user.streak}</div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Day Streak</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Keep it up! 3 more days for a badge</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Exam Countdowns */}
        <div
          className="p-5 rounded-2xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={18} style={{ color: '#ec4899' }} />
              <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>Exam Countdown</h2>
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Upcoming</span>
          </div>
          <div className="space-y-3">
            {upcomingExams.map((exam) => {
              const days = getDaysUntil(exam.date)
              const urgency = days <= 3 ? 'danger' : days <= 7 ? 'warning' : 'normal'
              return (
                <div
                  key={exam.id}
                  className="exam-card p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {exam.subject}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {formatDate(exam.date)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="text-2xl font-black"
                        style={{
                          color: urgency === 'danger' ? '#f87171' : urgency === 'warning' ? '#fbbf24' : exam.color,
                        }}
                      >
                        {days}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>days left</div>
                    </div>
                  </div>
                  <div className="mt-2 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(5, 100 - (days / 30) * 100)}%`,
                        background: urgency === 'danger' ? '#ef4444' : urgency === 'warning' ? '#f59e0b' : exam.color,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pending Tasks */}
        <div
          className="p-5 rounded-2xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckSquare size={18} style={{ color: '#10b981' }} />
              <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>Pending Tasks</h2>
            </div>
            <button
              onClick={() => router.navigate({ to: '/tasks' })}
              className="text-xs flex items-center gap-1"
              style={{ color: '#818cf8' }}
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-xl priority-${task.priority}`}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-4 h-4 rounded border mt-0.5 flex-shrink-0"
                    style={{ borderColor: 'var(--border-color)' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {task.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ background: `${SUBJECT_COLORS[task.subject] || '#6366f1'}20`, color: SUBJECT_COLORS[task.subject] || '#818cf8' }}
                      >
                        {task.subject}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {task.estimatedMinutes}m
                      </span>
                    </div>
                  </div>
                  <span className={`badge badge-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'success'} text-xs`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div
        className="p-5 rounded-2xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} style={{ color: '#f59e0b' }} />
          <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>AI Study Suggestions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AI_SUGGESTIONS.map((s, i) => (
            <div
              key={i}
              className="p-4 rounded-xl flex gap-3"
              style={{
                background: s.urgent ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${s.urgent ? 'rgba(239,68,68,0.2)' : 'var(--border-color)'}`,
              }}
            >
              <span className="text-lg flex-shrink-0">{s.icon}</span>
              <div>
                <div className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>
                  {s.subject}
                  {s.urgent && (
                    <AlertCircle size={12} className="inline ml-1" style={{ color: '#f87171' }} />
                  )}
                </div>
                <div className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {s.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
