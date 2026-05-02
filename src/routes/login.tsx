import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { BookOpen, Eye, EyeOff, ArrowRight, Zap, CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSuccess(true)
    setTimeout(() => router.navigate({ to: '/dashboard' }), 800)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Ambient orbs */}
      <div className="orb orb-primary" style={{ width: 500, height: 500, top: -200, left: -200 }} />
      <div className="orb orb-secondary" style={{ width: 400, height: 400, bottom: -100, right: -100 }} />

      <div className="w-full max-w-md relative">
        {/* Back to home */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
          ← Back to home
        </Link>

        <div
          className="p-8 rounded-3xl"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(40px)',
            border: '1px solid var(--glass-border)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <BookOpen size={24} color="white" />
            </div>
            <div>
              <div className="font-black text-lg" style={{ color: 'var(--text-primary)' }}>StudyAI</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Smart Study Planner</div>
            </div>
          </div>

          {/* Mode toggle */}
          <div
            className="flex p-1 rounded-xl mb-6"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)' }}
          >
            {(['login', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize"
                style={{
                  background: mode === m ? 'var(--gradient-primary)' : 'transparent',
                  color: mode === m ? 'white' : 'var(--text-secondary)',
                  boxShadow: mode === m ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {success ? (
            <div className="text-center py-8">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(16,185,129,0.15)' }}
              >
                <CheckCircle size={32} style={{ color: '#34d399' }} />
              </div>
              <div className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                {mode === 'login' ? 'Welcome back!' : 'Account created!'}
              </div>
              <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Redirecting to your dashboard...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h2 className="text-2xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>
                  {mode === 'login' ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {mode === 'login'
                    ? 'Sign in to continue your study journey'
                    : 'Start your AI-powered study journey today'
                  }
                </p>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Alex Johnson"
                    className="input-glass"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="alex@university.edu"
                  className="input-glass"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="input-glass pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {mode === 'login' && (
                <div className="text-right">
                  <a href="#" className="text-xs" style={{ color: '#818cf8', textDecoration: 'none' }}>
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3"
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    {mode === 'login' ? 'Sign In' : 'Start Learning Free'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: 'var(--border-color)' }} />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 text-xs" style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
                    or continue with
                  </span>
                </div>
              </div>

              {/* Google auth button */}
              <button
                type="button"
                onClick={() => router.navigate({ to: '/dashboard' })}
                className="btn-secondary w-full justify-center py-3"
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              {mode === 'signup' && (
                <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                  By signing up, you agree to our{' '}
                  <a href="#" style={{ color: '#818cf8', textDecoration: 'none' }}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" style={{ color: '#818cf8', textDecoration: 'none' }}>Privacy Policy</a>
                </p>
              )}
            </form>
          )}
        </div>

        {/* Benefits */}
        {!success && (
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: '🆓', text: 'Free forever' },
              { icon: '🔒', text: 'Secure & private' },
              { icon: '🤖', text: 'AI-powered' },
            ].map(({ icon, text }) => (
              <div
                key={text}
                className="p-3 rounded-xl text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}
              >
                <div className="text-lg mb-1">{icon}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
