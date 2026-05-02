import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX, Coffee, Brain, Zap } from 'lucide-react'
import { PageLayout } from '@/components/Navigation'
import { MOTIVATIONAL_QUOTES, store } from '@/lib/store'

export const Route = createFileRoute('/focus')({
  component: FocusMode,
})

type Mode = 'focus' | 'shortBreak' | 'longBreak'

const MODE_CONFIG = {
  focus: { label: 'Focus Session', color: '#6366f1', bg: 'rgba(99,102,241,0.1)', icon: Brain },
  shortBreak: { label: 'Short Break', color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: Coffee },
  longBreak: { label: 'Long Break', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', icon: Coffee },
}

const BREAK_TIPS = [
  "🧘 Take 5 deep breaths — inhale for 4 counts, hold for 4, exhale for 6.",
  "💧 Drink a glass of water and stay hydrated!",
  "👁️ Follow the 20-20-20 rule: look at something 20 feet away for 20 seconds.",
  "🚶 Walk around for a few minutes to refresh your mind.",
  "🤸 Do some light stretching to release tension in your neck and shoulders.",
  "🍎 Eat a healthy snack — nuts, fruit, or yogurt work great.",
  "😴 Close your eyes and rest them briefly.",
  "🎵 Listen to one calming song to reset your focus.",
]

const AMBIENT_SOUNDS = [
  { name: 'Rain', emoji: '🌧️', active: false },
  { name: 'Forest', emoji: '🌲', active: false },
  { name: 'Cafe', emoji: '☕', active: false },
  { name: 'Ocean', emoji: '🌊', active: false },
  { name: 'White Noise', emoji: '〰️', active: false },
  { name: 'Lo-Fi', emoji: '🎵', active: false },
]

function FocusMode() {
  const settings = store.getSettings()
  const [mode, setMode] = useState<Mode>('focus')
  const [timeLeft, setTimeLeft] = useState(settings.pomodoroMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsCompleted, setSessions] = useState(0)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [activeSounds, setActiveSounds] = useState<Set<string>>(new Set())
  const [totalFocusToday, setTotalFocusToday] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const totalTime = mode === 'focus'
    ? settings.pomodoroMinutes * 60
    : mode === 'shortBreak'
    ? settings.shortBreakMinutes * 60
    : settings.longBreakMinutes * 60

  const progress = ((totalTime - timeLeft) / totalTime) * 100
  const radius = 110
  const circumference = 2 * Math.PI * radius
  const strokeOffset = circumference * (1 - progress / 100)

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const tick = useCallback(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        setIsRunning(false)
        if (mode === 'focus') {
          setSessions(s => s + 1)
          setTotalFocusToday(t => t + settings.pomodoroMinutes)
          setQuoteIndex(i => (i + 1) % MOTIVATIONAL_QUOTES.length)
        }
        return 0
      }
      return prev - 1
    })
  }, [mode, settings.pomodoroMinutes])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, tick])

  const switchMode = (m: Mode) => {
    setMode(m)
    setIsRunning(false)
    setTimeLeft(
      m === 'focus' ? settings.pomodoroMinutes * 60
        : m === 'shortBreak' ? settings.shortBreakMinutes * 60
        : settings.longBreakMinutes * 60
    )
  }

  const reset = () => {
    setIsRunning(false)
    setTimeLeft(totalTime)
  }

  const toggleSound = (name: string) => {
    setActiveSounds(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const config = MODE_CONFIG[mode]
  const Icon = config.icon

  const randomBreakTip = BREAK_TIPS[sessionsCompleted % BREAK_TIPS.length]

  return (
    <PageLayout
      currentPath="/focus"
      title="Focus Mode"
      subtitle="Stay in the zone with Pomodoro technique"
    >
      <div className="max-w-4xl mx-auto">
        {/* Mode selector */}
        <div
          className="inline-flex p-1 rounded-xl mb-8 mx-auto flex"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          {(Object.entries(MODE_CONFIG) as [Mode, typeof MODE_CONFIG.focus][]).map(([key, conf]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: mode === key ? conf.bg : 'transparent',
                color: mode === key ? conf.color : 'var(--text-muted)',
                border: mode === key ? `1px solid ${conf.color}40` : '1px solid transparent',
              }}
            >
              <conf.icon size={16} />
              {conf.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Timer */}
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <svg width={280} height={280}>
                {/* Background ring */}
                <circle
                  cx={140} cy={140} r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={12}
                />
                {/* Progress ring */}
                <circle
                  cx={140} cy={140} r={radius}
                  fill="none"
                  stroke={config.color}
                  strokeWidth={12}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  transform="rotate(-90 140 140)"
                  className="timer-ring"
                  style={{
                    filter: `drop-shadow(0 0 8px ${config.color}80)`,
                    transition: 'stroke-dashoffset 1s linear',
                  }}
                />
                {/* Outer glow ring */}
                <circle
                  cx={140} cy={140} r={radius + 8}
                  fill="none"
                  stroke={config.color}
                  strokeWidth={1}
                  opacity={0.15}
                  strokeDasharray="4 8"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                  style={{ background: config.bg }}
                >
                  <Icon size={28} style={{ color: config.color }} />
                </div>
                <div
                  className="text-6xl font-black tabular-nums"
                  style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}
                >
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {config.label}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={reset}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
              >
                <RotateCcw size={18} />
              </button>

              <button
                onClick={() => setIsRunning(!isRunning)}
                className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all"
                style={{
                  background: isRunning ? 'rgba(239,68,68,0.15)' : 'var(--gradient-primary)',
                  border: `2px solid ${isRunning ? 'rgba(239,68,68,0.3)' : 'transparent'}`,
                  boxShadow: isRunning ? 'none' : `0 8px 25px ${config.color}40`,
                }}
              >
                {isRunning
                  ? <Pause size={28} style={{ color: '#f87171' }} />
                  : <Play size={28} color="white" />
                }
              </button>

              <button
                onClick={() => switchMode(mode === 'focus' ? 'shortBreak' : 'focus')}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
              >
                <SkipForward size={18} />
              </button>
            </div>

            {/* Sound toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
              }}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              {soundEnabled ? 'Notifications On' : 'Notifications Off'}
            </button>
          </div>

          {/* Right panel */}
          <div className="space-y-5">
            {/* Session stats */}
            <div
              className="p-5 rounded-2xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
                Today's Progress
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Sessions', value: sessionsCompleted, icon: '🍅' },
                  { label: 'Focus Time', value: `${totalFocusToday}m`, icon: '⏱️' },
                  { label: 'Goal', value: `${Math.round((totalFocusToday / (settings.weeklyGoalHours * 60 / 7)) * 100)}%`, icon: '🎯' },
                ].map(({ label, value, icon }) => (
                  <div
                    key={label}
                    className="p-3 rounded-xl text-center"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div className="text-xl mb-1">{icon}</div>
                    <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{value}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
                  </div>
                ))}
              </div>
              {/* Pomodoro dots */}
              <div className="flex gap-2 mt-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-2 rounded-full"
                    style={{
                      background: i < sessionsCompleted % 8
                        ? config.color
                        : 'rgba(255,255,255,0.06)',
                    }}
                  />
                ))}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {sessionsCompleted % 4} of 4 sessions before long break
              </div>
            </div>

            {/* Motivational quote */}
            <div
              className="p-5 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))',
                border: '1px solid rgba(99,102,241,0.15)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} style={{ color: '#fbbf24' }} />
                <span className="text-xs font-semibold" style={{ color: '#fbbf24' }}>Motivation</span>
              </div>
              <p className="text-sm italic leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                "{MOTIVATIONAL_QUOTES[quoteIndex % MOTIVATIONAL_QUOTES.length]}"
              </p>
              <button
                onClick={() => setQuoteIndex(i => (i + 1) % MOTIVATIONAL_QUOTES.length)}
                className="text-xs mt-3"
                style={{ color: '#818cf8' }}
              >
                Next quote →
              </button>
            </div>

            {/* Break tip (show during breaks) */}
            {mode !== 'focus' && (
              <div
                className="p-5 rounded-2xl"
                style={{
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.2)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Coffee size={16} style={{ color: '#34d399' }} />
                  <span className="text-xs font-semibold" style={{ color: '#34d399' }}>Break Tip</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {randomBreakTip}
                </p>
              </div>
            )}

            {/* Ambient sounds */}
            <div
              className="p-5 rounded-2xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Ambient Sounds</h3>
                {activeSounds.size > 0 && (
                  <div className="flex gap-0.5 items-end h-5">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="sound-bar" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {AMBIENT_SOUNDS.map(({ name, emoji }) => (
                  <button
                    key={name}
                    onClick={() => toggleSound(name)}
                    className="p-3 rounded-xl text-center transition-all"
                    style={{
                      background: activeSounds.has(name) ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${activeSounds.has(name) ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    <div className="text-xl mb-1">{emoji}</div>
                    <div className="text-xs" style={{ color: activeSounds.has(name) ? '#818cf8' : 'var(--text-muted)' }}>
                      {name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
