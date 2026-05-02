import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { User, TrendingUp, Award, Zap, Clock, Target, Edit2, Check, X } from 'lucide-react'
import { PageLayout } from '@/components/Navigation'
import { store } from '@/lib/store'
import type { UserProfile } from '@/lib/store'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

const BADGE_LIST = [
  { id: '🔥 7-Day Streak', name: '7-Day Streak', desc: 'Study for 7 days in a row', icon: '🔥', unlocked: true },
  { id: '⭐ Early Bird', name: 'Early Bird', desc: 'Start studying before 8 AM', icon: '⭐', unlocked: true },
  { id: '📚 100-Hour Club', name: '100-Hour Club', desc: 'Log 100 total study hours', icon: '📚', unlocked: true },
  { id: '🎯 Goal Crusher', name: 'Goal Crusher', desc: 'Complete weekly goal 4 weeks in a row', icon: '🎯', unlocked: true },
  { id: '🌙 Night Owl', name: 'Night Owl', desc: 'Study past midnight 3 times', icon: '🌙', unlocked: false },
  { id: '🏆 Perfect Week', name: 'Perfect Week', desc: 'Complete all tasks in a week', icon: '🏆', unlocked: false },
  { id: '💎 500-Hour Club', name: '500-Hour Club', desc: 'Log 500 total study hours', icon: '💎', unlocked: false },
  { id: '🚀 Speed Learner', name: 'Speed Learner', desc: 'Complete 10 tasks in one day', icon: '🚀', unlocked: false },
]

const LEADERBOARD = [
  { rank: 1, name: 'Emma Wilson', avatar: 'EW', xp: 8420, streak: 45, badge: '🏆' },
  { rank: 2, name: 'James Park', avatar: 'JP', xp: 7890, streak: 32, badge: '🥈' },
  { rank: 3, name: 'Sofia Martinez', avatar: 'SM', xp: 7350, streak: 28, badge: '🥉' },
  { rank: 4, name: 'Alex Johnson', avatar: 'AJ', xp: 2840, streak: 7, badge: null, isYou: true },
  { rank: 5, name: 'Ryan Chen', avatar: 'RC', xp: 2120, streak: 5, badge: null },
]

function ProfilePage() {
  const [user, setUser] = useState<UserProfile>(store.getUser())
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')

  useEffect(() => {
    setUser(store.getUser())
  }, [])

  const saveEdit = () => {
    if (editName.trim()) {
      const updated = { ...user, name: editName.trim() }
      setUser(updated)
      store.setUser(updated)
    }
    setEditing(false)
  }

  const xpPct = Math.round((user.xp / user.xpToNext) * 100)

  return (
    <PageLayout currentPath="/profile" title="Profile" subtitle="Your study journey and achievements">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-1 space-y-4">
          <div
            className="p-6 rounded-2xl text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
              border: '1px solid rgba(99,102,241,0.2)',
            }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4"
              style={{ background: 'var(--gradient-primary)', boxShadow: '0 8px 25px rgba(99,102,241,0.3)' }}
            >
              {user.avatar}
            </div>

            {editing ? (
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="input-glass text-center text-sm"
                  onKeyDown={e => e.key === 'Enter' && saveEdit()}
                  autoFocus
                />
                <button onClick={saveEdit} style={{ color: '#34d399' }}><Check size={16} /></button>
                <button onClick={() => setEditing(false)} style={{ color: '#f87171' }}><X size={16} /></button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{user.name}</h2>
                <button onClick={() => { setEditName(user.name); setEditing(true) }} style={{ color: 'var(--text-muted)' }}>
                  <Edit2 size={14} />
                </button>
              </div>
            )}

            <div className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{user.email}</div>

            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              <Zap size={14} style={{ color: '#fbbf24' }} />
              <span className="text-sm font-semibold" style={{ color: '#818cf8' }}>Level {user.level}</span>
            </div>

            {/* XP bar */}
            <div className="text-xs mb-1.5 flex justify-between" style={{ color: 'var(--text-muted)' }}>
              <span>{user.xp} XP</span>
              <span>Next: {user.xpToNext} XP</span>
            </div>
            <div className="xp-bar mb-4">
              <div className="xp-fill" style={{ width: `${xpPct}%` }} />
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🔥', label: 'Streak', value: `${user.streak} days` },
                { icon: '⏱️', label: 'Total Hours', value: `${user.totalHours}h` },
                { icon: '🏅', label: 'Badges', value: user.badges.length },
                { icon: '📈', label: 'Level', value: user.level },
              ].map(({ icon, label, value }) => (
                <div
                  key={label}
                  className="p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="text-lg mb-0.5">{icon}</div>
                  <div className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{value}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly goal */}
          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Target size={16} style={{ color: '#10b981' }} />
              <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Weekly Goal</span>
            </div>
            <div className="text-3xl font-black mb-1" style={{ color: '#10b981' }}>30.5h</div>
            <div className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>of 35h goal — 87% complete</div>
            <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full" style={{ width: '87%', background: '#10b981' }} />
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Achievements */}
          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Award size={18} style={{ color: '#f59e0b' }} />
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Achievements</h3>
              <span className="badge badge-warning">{user.badges.length}/{BADGE_LIST.length}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {BADGE_LIST.map(badge => (
                <div
                  key={badge.id}
                  className="p-3 rounded-xl text-center transition-all"
                  style={{
                    background: badge.unlocked ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${badge.unlocked ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)'}`,
                    opacity: badge.unlocked ? 1 : 0.5,
                    filter: badge.unlocked ? 'none' : 'grayscale(1)',
                  }}
                >
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <div className="text-xs font-semibold" style={{ color: badge.unlocked ? '#fbbf24' : 'var(--text-muted)' }}>
                    {badge.name}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontSize: 10 }}>
                    {badge.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div
            className="p-5 rounded-2xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} style={{ color: '#6366f1' }} />
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Leaderboard</h3>
              <span className="badge badge-primary">This Month</span>
            </div>
            <div className="space-y-2">
              {LEADERBOARD.map(({ rank, name, avatar, xp, streak, badge, isYou }) => (
                <div
                  key={rank}
                  className="flex items-center gap-4 p-3 rounded-xl"
                  style={{
                    background: isYou ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isYou ? 'rgba(99,102,241,0.3)' : 'transparent'}`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
                    style={{
                      background: rank <= 3 ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)',
                      color: rank === 1 ? '#fbbf24' : rank === 2 ? '#e5e7eb' : rank === 3 ? '#d97706' : 'var(--text-muted)',
                    }}
                  >
                    {badge || `#${rank}`}
                  </div>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold"
                    style={{ background: isYou ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.08)' }}
                  >
                    {avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                      {name}{isYou && <span className="ml-2 badge badge-primary text-xs py-0">You</span>}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      🔥 {streak} day streak
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-sm" style={{ color: '#fbbf24' }}>
                    <Zap size={14} />
                    {xp.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
