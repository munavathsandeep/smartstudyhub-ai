# Smart Study Planner AI

A modern, AI-powered study planning platform for students — built with TanStack Start and deployed on Netlify.

## Overview

Smart Study Planner AI helps students organize their study schedules, track productivity, prepare for exams, and stay motivated using AI-generated recommendations and gamification.

## Key Features

- **AI Study Planner** — Personalized daily schedules with smart subject balancing
- **Productivity Dashboard** — Study hours tracking with visual analytics
- **Focus Mode** — Pomodoro timer with ambient sounds and motivational quotes
- **Task Manager** — Priority-labeled assignments with completion tracking
- **Exam Countdown** — Animated countdown timers for upcoming exams
- **AI Study Assistant** — Chat with an AI tutor powered by Anthropic/OpenAI/Gemini
- **Gamification** — XP points, achievement badges, and streak tracking
- **Dark/Light Mode** — Smooth toggle with glassmorphism design

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start (SSR React) |
| Frontend | React 19 |
| Routing | TanStack Router v1 (file-based) |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 + custom CSS |
| Animations | Framer Motion + CSS animations |
| AI | TanStack AI (Anthropic / OpenAI / Gemini / Ollama) |
| Language | TypeScript 5.7 (strict) |
| Deployment | Netlify |

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (runs on port 3000, Netlify CLI on 8888)
npm run dev

# Or use Netlify CLI for full emulation
netlify dev
```

## Environment Variables

At least one AI provider key is required for the AI assistant:

```
ANTHROPIC_API_KEY=...   # Preferred
OPENAI_API_KEY=...      # Fallback
GOOGLE_GENERATIVE_AI_API_KEY=...  # Fallback
OLLAMA_BASE_URL=...     # Local fallback
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, testimonials |
| `/dashboard` | Main study dashboard with AI schedule |
| `/analytics` | Productivity charts and subject breakdown |
| `/focus` | Pomodoro timer with ambient sounds |
| `/tasks` | Task manager with priority filtering |
| `/ai-assistant` | AI chat study assistant |
| `/profile` | User profile, badges, leaderboard |
| `/settings` | App settings and preferences |
| `/login` | Login / Sign up page |

## Project Structure

```
src/
  components/
    Navigation.tsx    # Sidebar + PageLayout wrapper
  lib/
    store.ts          # localStorage state management
    ai-hook.ts        # useAIChat hook
  routes/
    __root.tsx        # Root layout + ThemeContext
    index.tsx         # Landing page
    dashboard.tsx     # Main dashboard
    analytics.tsx     # Analytics page
    focus.tsx         # Focus/Pomodoro mode
    tasks.tsx         # Task manager
    ai-assistant.tsx  # AI chat assistant
    profile.tsx       # User profile
    settings.tsx      # Settings
    login.tsx         # Auth page
    api.chat.ts       # AI chat API endpoint
  styles.css          # Global styles + CSS variables
```
