import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Settings, Bell, Timer, Moon, Sun, Save, RefreshCw } from 'lucide-react'
import { PageLayout } from '@/components/Navigation'
import { store } from '@/lib/store'
import { useTheme } from '@/routes/__root'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const [settings, setSettings] = useState(store.getSettings())
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSettings(store.getSettings())
  }, [])

  const save = () => {
    store.setSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const reset = () => {
    const defaults = {
      pomodoroMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 15,
      autoStartBreaks: false,
      soundEnabled: true,
      notificationsEnabled: true,
      weeklyGoalHours: 20,
    }
    setSettings(defaults)
    store.setSettings(defaults)
  }

  const Section = ({ title, icon: Icon, children }: { title: string; icon: React.FC<any>; children: React.ReactNode }) => (
    <div
      className="p-5 rounded-2xl"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
    >
      <div className="flex items-center gap-2 mb-5">
        <Icon size={18} style={{ color: '#818cf8' }} />
        <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )

  const Toggle = ({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</div>
        {desc && <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className="relative w-12 h-6 rounded-full transition-all"
        style={{ background: value ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.1)' }}
      >
        <div
          className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
          style={{
            left: value ? '26px' : '2px',
            background: 'white',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
        />
      </button>
    </div>
  )

  const Slider = ({ label, value, min, max, unit, onChange }: {
    label: string; value: number; min: number; max: number; unit: string; onChange: (v: number) => void
  }) => (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span className="text-sm font-semibold" style={{ color: '#818cf8' }}>{value} {unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        className="w-full"
        style={{ accentColor: '#6366f1', cursor: 'pointer' }}
      />
      <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  )

  return (
    <PageLayout currentPath="/settings" title="Settings" subtitle="Customize your study experience">
      <div className="max-w-2xl space-y-5">
        {/* Appearance */}
        <Section title="Appearance" icon={theme === 'dark' ? Moon : Sun}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Color Theme</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Switch between dark and light mode</div>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.2)',
                color: '#818cf8',
              }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>
        </Section>

        {/* Pomodoro Timer */}
        <Section title="Pomodoro Timer" icon={Timer}>
          <Slider
            label="Focus Session Duration"
            value={settings.pomodoroMinutes}
            min={15}
            max={60}
            unit="min"
            onChange={v => setSettings({ ...settings, pomodoroMinutes: v })}
          />
          <Slider
            label="Short Break Duration"
            value={settings.shortBreakMinutes}
            min={3}
            max={15}
            unit="min"
            onChange={v => setSettings({ ...settings, shortBreakMinutes: v })}
          />
          <Slider
            label="Long Break Duration"
            value={settings.longBreakMinutes}
            min={10}
            max={30}
            unit="min"
            onChange={v => setSettings({ ...settings, longBreakMinutes: v })}
          />
          <Toggle
            label="Auto-start Breaks"
            desc="Automatically start break timer after focus session"
            value={settings.autoStartBreaks}
            onChange={v => setSettings({ ...settings, autoStartBreaks: v })}
          />
        </Section>

        {/* Notifications */}
        <Section title="Notifications & Sounds" icon={Bell}>
          <Toggle
            label="Sound Effects"
            desc="Play sounds when timer starts/ends"
            value={settings.soundEnabled}
            onChange={v => setSettings({ ...settings, soundEnabled: v })}
          />
          <Toggle
            label="Browser Notifications"
            desc="Get notified when sessions and breaks end"
            value={settings.notificationsEnabled}
            onChange={v => setSettings({ ...settings, notificationsEnabled: v })}
          />
        </Section>

        {/* Goals */}
        <Section title="Study Goals" icon={Settings}>
          <Slider
            label="Weekly Study Goal"
            value={settings.weeklyGoalHours}
            min={5}
            max={60}
            unit="hours"
            onChange={v => setSettings({ ...settings, weeklyGoalHours: v })}
          />
          <div
            className="p-3 rounded-xl text-sm"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', color: 'var(--text-secondary)' }}
          >
            💡 Recommended: 15-25 hours/week for most students. Top performers average 30+ hours.
          </div>
        </Section>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={save}
            className="btn-primary"
          >
            <Save size={16} />
            {saved ? '✓ Saved!' : 'Save Settings'}
          </button>
          <button onClick={reset} className="btn-secondary">
            <RefreshCw size={16} />
            Reset Defaults
          </button>
        </div>
      </div>
    </PageLayout>
  )
}
