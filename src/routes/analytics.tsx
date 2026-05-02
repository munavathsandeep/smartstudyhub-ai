import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { BarChart2, Clock, TrendingUp, Calendar, Award } from 'lucide-react'
import { PageLayout } from '@/components/Navigation'
import { store, SUBJECT_COLORS } from '@/lib/store'
import type { StudySession } from '@/lib/store'

export const Route = createFileRoute('/analytics')({
  component: Analytics,
})

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const WEEKLY_DATA = [
  { day: 'Mon', hours: 3.5, subjects: { Mathematics: 90, Physics: 60 } },
  { day: 'Tue', hours: 5.0, subjects: { Chemistry: 120, History: 60, 'Computer Science': 120 } },
  { day: 'Wed', hours: 2.5, subjects: { Mathematics: 90, Physics: 60 } },
  { day: 'Thu', hours: 6.0, subjects: { Mathematics: 120, Chemistry: 120, Biology: 120 } },
  { day: 'Fri', hours: 4.5, subjects: { Physics: 90, History: 90, English: 90 } },
  { day: 'Sat', hours: 7.0, subjects: { Mathematics: 180, Chemistry: 90, 'Computer Science': 150 } },
  { day: 'Sun', hours: 2.0, subjects: { History: 60, English: 60 } },
]

const SUBJECT_BREAKDOWN = [
  { subject: 'Mathematics', hours: 12.5, percentage: 30, trend: +15 },
  { subject: 'Physics', hours: 8.5, percentage: 20, trend: +5 },
  { subject: 'Chemistry', hours: 7.5, percentage: 18, trend: -3 },
  { subject: 'History', hours: 5.0, percentage: 12, trend: +8 },
  { subject: 'Computer Science', hours: 5.5, percentage: 13, trend: +20 },
  { subject: 'English', hours: 3.0, percentage: 7, trend: -5 },
]

const MONTHLY_HOURS = [28, 32, 25, 38, 42, 35, 45, 40, 38, 48, 42, 41]
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function BarChart({ data, max, color = '#6366f1' }: { data: number[]; max: number; color?: string }) {
  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex items-end">
          <div
            className="w-full rounded-t transition-all duration-700"
            style={{
              height: `${(v / max) * 100}%`,
              background: i === data.length - 1
                ? 'var(--gradient-primary)'
                : `${color}40`,
              minHeight: 4,
            }}
          />
        </div>
      ))}
    </div>
  )
}

function Analytics() {
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [activeTab, setActiveTab] = useState<'week' | 'month'>('week')

  useEffect(() => {
    setSessions(store.getSessions())
  }, [])

  const totalWeekHours = WEEKLY_DATA.reduce((s, d) => s + d.hours, 0).toFixed(1)
  const avgDailyHours = (parseFloat(totalWeekHours) / 7).toFixed(1)
  const maxDaily = Math.max(...WEEKLY_DATA.map(d => d.hours))
  const todayHours = WEEKLY_DATA[6].hours

  return (
    <PageLayout
      currentPath="/analytics"
      title="Productivity Analytics"
      subtitle="Track your study patterns and optimize your learning"
    >
      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'This Week', value: `${totalWeekHours}h`, icon: Clock, color: '#6366f1', sub: 'total study' },
          { label: 'Daily Average', value: `${avgDailyHours}h`, icon: TrendingUp, color: '#10b981', sub: 'per day' },
          { label: 'Best Day', value: `${maxDaily}h`, icon: Award, color: '#f59e0b', sub: 'Saturday' },
          { label: 'Today', value: `${todayHours}h`, icon: BarChart2, color: '#ec4899', sub: 'so far' },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div
            key={label}
            className="stat-card animate-fade-in-up"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</div>
              </div>
            </div>
            <div className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div
          className="lg:col-span-2 p-5 rounded-2xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>Study Hours Overview</h2>
            <div className="flex gap-2">
              {(['week', 'month'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: activeTab === tab ? 'rgba(99,102,241,0.2)' : 'transparent',
                    color: activeTab === tab ? '#818cf8' : 'var(--text-muted)',
                    border: `1px solid ${activeTab === tab ? 'rgba(99,102,241,0.3)' : 'transparent'}`,
                  }}
                >
                  {tab === 'week' ? 'Weekly' : 'Monthly'}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'week' ? (
            <>
              <div className="flex items-end gap-3 h-48 mb-3">
                {WEEKLY_DATA.map((d, i) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-xs font-medium" style={{ color: '#818cf8' }}>{d.hours}h</div>
                    <div
                      className="w-full rounded-t-lg transition-all duration-700"
                      style={{
                        height: `${(d.hours / 8) * 100}%`,
                        background: i === 6 ? 'var(--gradient-primary)' : 'rgba(99,102,241,0.25)',
                        minHeight: 8,
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                {WEEKLY_DATA.map((d, i) => (
                  <div key={d.day} className="flex-1 text-center text-xs" style={{ color: i === 6 ? '#818cf8' : 'var(--text-muted)' }}>
                    {d.day}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-end gap-2 h-48 mb-3">
                {MONTHLY_HOURS.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-lg transition-all duration-700"
                      style={{
                        height: `${(h / 50) * 100}%`,
                        background: i === new Date().getMonth() ? 'var(--gradient-primary)' : 'rgba(99,102,241,0.25)',
                        minHeight: 8,
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                {MONTHS.map((m, i) => (
                  <div
                    key={m}
                    className="flex-1 text-center"
                    style={{
                      fontSize: 10,
                      color: i === new Date().getMonth() ? '#818cf8' : 'var(--text-muted)',
                    }}
                  >
                    {m}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Productivity score */}
        <div
          className="p-5 rounded-2xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <h2 className="font-bold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>Weekly Score</h2>

          <div className="text-center mb-6">
            <div
              className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-3"
              style={{
                background: 'conic-gradient(#6366f1 0% 78%, rgba(255,255,255,0.06) 78%)',
              }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <div>
                  <div className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>78</div>
                  <div className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>/ 100</div>
                </div>
              </div>
            </div>
            <div className="badge badge-primary">Great Progress!</div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Consistency', value: 85, color: '#6366f1' },
              { label: 'Focus Quality', value: 72, color: '#8b5cf6' },
              { label: 'Goal Achievement', value: 68, color: '#06b6d4' },
              { label: 'Break Balance', value: 90, color: '#10b981' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{ color }}>{value}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${value}%`, background: color, transition: 'width 1s ease' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="p-5 rounded-2xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <h2 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Subject Breakdown</h2>
          <div className="space-y-3">
            {SUBJECT_BREAKDOWN.map(({ subject, hours, percentage, trend }) => {
              const color = SUBJECT_COLORS[subject] || '#6366f1'
              return (
                <div key={subject}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{subject}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs"
                        style={{ color: trend >= 0 ? '#34d399' : '#f87171' }}
                      >
                        {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
                      </span>
                      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {hours}h
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${percentage}%`, background: color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Session types */}
        <div
          className="p-5 rounded-2xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <h2 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Session Distribution</h2>

          {/* Donut chart simulation */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {(() => {
                  const segments = [
                    { pct: 45, color: '#6366f1', label: 'Deep Study' },
                    { pct: 35, color: '#8b5cf6', label: 'Pomodoro' },
                    { pct: 20, color: '#06b6d4', label: 'Review' },
                  ]
                  let cumulative = 0
                  const r = 38, cx = 50, cy = 50
                  const circumference = 2 * Math.PI * r
                  return segments.map(({ pct, color }) => {
                    const offset = circumference * (1 - pct / 100)
                    const rotation = (cumulative / 100) * 360
                    cumulative += pct
                    return (
                      <circle
                        key={color}
                        cx={cx} cy={cy} r={r}
                        fill="none"
                        stroke={color}
                        strokeWidth="14"
                        strokeDasharray={`${circumference * pct / 100} ${circumference * (1 - pct / 100)}`}
                        strokeDashoffset={circumference * (1 - cumulative / 100 + pct / 100)}
                        transform={`rotate(${rotation - 90} ${cx} ${cy})`}
                        style={{ transform: `rotate(${(cumulative - pct) * 3.6}deg)`, transformOrigin: '50% 50%' }}
                      />
                    )
                  })
                })()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>42h</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>total</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Deep Study', hours: 18.9, pct: 45, color: '#6366f1' },
              { label: 'Pomodoro Sessions', hours: 14.7, pct: 35, color: '#8b5cf6' },
              { label: 'Review Sessions', hours: 8.4, pct: 20, color: '#06b6d4' },
            ].map(({ label, hours, pct, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{hours}h</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{pct}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent sessions */}
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Recent Sessions</div>
            <div className="space-y-1.5">
              {sessions.slice(0, 3).map(session => {
                const color = SUBJECT_COLORS[session.subject] || '#6366f1'
                return (
                  <div key={session.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{session.subject}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ color: 'var(--text-muted)' }}>{session.minutes}min</span>
                      <span className="badge badge-primary">{session.type}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
