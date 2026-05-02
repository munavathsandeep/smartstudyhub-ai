import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { Send, Square, Brain, Sparkles, BookOpen, Target, Clock } from 'lucide-react'
import { Streamdown } from 'streamdown'
import { PageLayout } from '@/components/Navigation'
import { useAIChat } from '@/lib/ai-hook'
import type { ChatMessages } from '@/lib/ai-hook'

export const Route = createFileRoute('/ai-assistant')({
  component: AIAssistant,
})

const QUICK_PROMPTS = [
  { icon: '📚', text: 'Create a study schedule for my math exam in 5 days' },
  { icon: '🧠', text: 'Give me tips to improve my focus and concentration' },
  { icon: '⏱️', text: 'How should I use the Pomodoro technique effectively?' },
  { icon: '📊', text: 'What are the best revision strategies for science subjects?' },
  { icon: '🎯', text: 'Help me prioritize which subjects to study first' },
  { icon: '💤', text: 'How much sleep do I need for optimal studying?' },
]

function Messages({ messages }: { messages: ChatMessages }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }, [messages])

  if (!messages.length) return null

  return (
    <div ref={ref} className="flex-1 overflow-y-auto min-h-0 pb-4">
      <div className="max-w-3xl mx-auto px-4 space-y-4 pt-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <Brain size={18} color="white" />
              </div>
            )}
            <div
              className="max-w-[80%] px-4 py-3 rounded-2xl"
              style={{
                background: message.role === 'user'
                  ? 'var(--gradient-primary)'
                  : 'var(--bg-card)',
                border: message.role === 'user' ? 'none' : '1px solid var(--border-color)',
                borderRadius: message.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              }}
            >
              {message.parts.map((part, i) => {
                if (part.type === 'text' && part.content) {
                  return (
                    <div key={i} className={message.role === 'user' ? 'text-white text-sm' : 'prose prose-sm max-w-none'}>
                      {message.role === 'user'
                        ? part.content
                        : <Streamdown>{part.content}</Streamdown>
                      }
                    </div>
                  )
                }
                return null
              })}
            </div>
            {message.role === 'user' && (
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-color)' }}
              >
                AJ
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function AIAssistant() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, isLoading, stop } = useAIChat()

  const send = (text: string) => {
    if (!text.trim()) return
    sendMessage(text)
    setInput('')
  }

  return (
    <PageLayout currentPath="/ai-assistant" title="AI Study Assistant" subtitle="Your personal AI tutor available 24/7">
      <div
        className="flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          height: 'calc(100vh - 200px)',
          minHeight: 500,
        }}
      >
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 float-animation"
              style={{ background: 'var(--gradient-primary)', boxShadow: '0 8px 25px rgba(99,102,241,0.3)' }}
            >
              <Brain size={32} color="white" />
            </div>
            <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
              Study Assistant
            </h2>
            <p className="text-sm text-center mb-8 max-w-md" style={{ color: 'var(--text-secondary)' }}>
              Ask me anything about studying, time management, exam prep, or get a personalized study schedule!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
              {QUICK_PROMPTS.map(({ icon, text }) => (
                <button
                  key={text}
                  onClick={() => send(text)}
                  className="flex items-center gap-3 p-4 rounded-xl text-left card-hover"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <span className="text-xl flex-shrink-0">{icon}</span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <Messages messages={messages} />
        )}

        {/* Input area */}
        <div
          className="p-4"
          style={{ borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}
        >
          {isLoading && (
            <div className="flex items-center justify-center mb-3">
              <button
                onClick={stop}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
              >
                <Square size={14} className="fill-current" />
                Stop generating
              </button>
            </div>
          )}
          <div className="max-w-3xl mx-auto">
            <div
              className="flex items-end gap-3 rounded-2xl p-3"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)' }}
            >
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send(input)
                  }
                }}
                placeholder="Ask about study strategies, exam prep, scheduling..."
                rows={1}
                className="flex-1 bg-transparent outline-none resize-none text-sm"
                style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}
                disabled={isLoading}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: input.trim() && !isLoading ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.06)',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                }}
              >
                <Send size={16} color={input.trim() && !isLoading ? 'white' : 'var(--text-muted)'} />
              </button>
            </div>
            <div className="flex justify-between items-center mt-2 px-1">
              <div className="flex gap-3">
                {[
                  { icon: BookOpen, text: 'Study Tips' },
                  { icon: Target, text: 'Goal Setting' },
                  { icon: Clock, text: 'Time Mgmt' },
                ].map(({ icon: Icon, text }) => (
                  <button
                    key={text}
                    onClick={() => send(`Give me advice on ${text.toLowerCase()}`)}
                    className="flex items-center gap-1.5 text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Icon size={12} />
                    {text}
                  </button>
                ))}
              </div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Press Enter to send
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
