import { createFileRoute } from '@tanstack/react-router'
import { chat, maxIterations, toServerSentEventsResponse } from '@tanstack/ai'
import { anthropicText } from '@tanstack/ai-anthropic'
import { openaiText } from '@tanstack/ai-openai'
import { geminiText } from '@tanstack/ai-gemini'
import { ollamaText } from '@tanstack/ai-ollama'

const SYSTEM_PROMPT = `You are StudyAI, an expert AI study assistant for students. You help with:

CAPABILITIES:
1. Creating personalized study schedules based on subjects, available time, and exam dates
2. Providing evidence-based study techniques (spaced repetition, active recall, Feynman technique, etc.)
3. Time management strategies and productivity advice
4. Exam preparation and revision strategies
5. Pomodoro technique and focus optimization
6. Subject-specific study tips for Mathematics, Physics, Chemistry, Biology, History, Computer Science, English, Economics
7. Mental health and well-being tips for students (sleep, nutrition, stress management)
8. Goal setting and habit formation for academic success

INSTRUCTIONS:
- Be encouraging, motivating, and positive while being practical and actionable
- Give specific, concrete advice rather than generic tips
- When creating study schedules, include specific time blocks, breaks, and subject priorities
- Reference the user's context if they mention specific subjects or exams
- Use emojis occasionally to make responses engaging but not excessive
- Keep responses concise but comprehensive — use bullet points and structure for clarity
- Always relate advice back to academic performance and student wellbeing
- If asked about specific topics, provide study strategies for that topic specifically`

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const requestSignal = request.signal

        if (requestSignal.aborted) {
          return new Response(null, { status: 499 })
        }

        const abortController = new AbortController()

        try {
          const body = await request.json()
          const { messages } = body
          const data = body.data || {}

          let provider: 'anthropic' | 'openai' | 'gemini' | 'ollama' = data.provider || 'ollama'
          let model: string = data.model || 'mistral:7b'

          if (process.env.ANTHROPIC_API_KEY) {
            provider = 'anthropic'
            model = 'claude-haiku-4-5'
          } else if (process.env.OPENAI_API_KEY) {
            provider = 'openai'
            model = 'gpt-4o'
          } else if (process.env.GEMINI_API_KEY) {
            provider = 'gemini'
            model = 'gemini-2.0-flash-exp'
          }

          const adapterConfig = {
            anthropic: () => anthropicText((model || 'claude-haiku-4-5') as any),
            openai: () => openaiText((model || 'gpt-4o') as any),
            gemini: () => geminiText((model || 'gemini-2.0-flash-exp') as any),
            ollama: () => ollamaText((model || 'mistral:7b') as any),
          }

          const adapter = adapterConfig[provider]()

          const stream = chat({
            adapter,
            tools: [],
            systemPrompts: [SYSTEM_PROMPT],
            agentLoopStrategy: maxIterations(3),
            messages,
            abortController,
          })

          return toServerSentEventsResponse(stream, { abortController })
        } catch (error: any) {
          console.error('Chat error:', error)
          if (error.name === 'AbortError' || abortController.signal.aborted) {
            return new Response(null, { status: 499 })
          }
          return new Response(
            JSON.stringify({ error: 'Failed to process chat request', message: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
          )
        }
      },
    },
  },
})
