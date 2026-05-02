# AGENTS.md — Smart Study Planner AI

## Project Overview

An AI-powered study planning SaaS platform for students. Built with TanStack Start (SSR React), deployed on Netlify. The AI chat assistant uses multi-provider fallback (Anthropic → OpenAI → Gemini → Ollama).

## Architecture

### Routing
File-based routing via TanStack Router. Files in `src/routes/`:
- `__root.tsx` — Root HTML shell + ThemeContext (dark/light mode)
- `api.*.ts` — Server-side API handlers (e.g., `api.chat.ts` → POST `/api/chat`)
- All other `.tsx` files — Client-side pages

### State Management
`src/lib/store.ts` — Thin localStorage wrapper with typed getters/setters. No global state library. State keys are prefixed `ssp_`. Default seed data is included for first-run UX.

### Theme System
ThemeContext exported from `__root.tsx`. The `light-mode` CSS class is applied to `<html>`. All colors use CSS custom properties (`--bg-primary`, `--text-primary`, etc.) that change per theme.

### Navigation
`src/components/Navigation.tsx` exports:
- `Navigation` — Sidebar (desktop) + mobile drawer. Shows user XP bar and streak.
- `PageLayout` — Wrapper that includes `Navigation` + content area with standard padding.

All app pages should use `PageLayout` with `currentPath` prop for active link highlighting.

### AI Integration
`/api/chat` POST endpoint in `api.chat.ts`. Provider selection: ANTHROPIC_API_KEY → OPENAI_API_KEY → GOOGLE_GENERATIVE_AI_API_KEY → Ollama. System prompt is study-assistant focused. The `useAIChat` hook in `lib/ai-hook.ts` connects via SSE.

## Directory Structure

```
src/
  components/
    Navigation.tsx    # Sidebar + PageLayout wrapper
  lib/
    store.ts          # localStorage state management
    ai-hook.ts        # useAIChat hook (SSE to /api/chat)
    weather-tools.ts  # Legacy (unused, kept for reference)
  routes/
    __root.tsx        # Root layout + ThemeContext
    index.tsx         # Landing page (public)
    dashboard.tsx     # Main study dashboard
    analytics.tsx     # Productivity charts
    focus.tsx         # Pomodoro/focus mode
    tasks.tsx         # Task manager
    ai-assistant.tsx  # AI chat study assistant
    profile.tsx       # User profile + leaderboard
    settings.tsx      # App settings
    login.tsx         # Auth page (UI only)
    api.chat.ts       # AI chat API endpoint
  styles.css          # Design system: CSS vars, utilities
public/               # Static assets
netlify.toml          # Netlify build config
```

## Design System

CSS variables in `src/styles.css`:
- `--bg-primary`, `--bg-secondary`, `--bg-card` — backgrounds
- `--text-primary`, `--text-secondary`, `--text-muted` — text
- `--accent-primary` (#6366f1 indigo), `--accent-secondary` (#8b5cf6 purple) — brand colors
- `--gradient-primary` — indigo → purple gradient

Utility classes: `.glass`, `.gradient-text`, `.btn-primary`, `.btn-secondary`, `.input-glass`, `.badge`, `.stat-card`, `.card-hover`, `.sidebar-link`, `.animate-fade-in-up`

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Animations | CSS animations + framer-motion (available) |
| AI | TanStack AI (multi-provider) |
| Language | TypeScript 5.7 (strict mode) |
| Deployment | Netlify |

## Coding Conventions

- **TypeScript strict mode** — all files must type-check
- **`@/` import alias** maps to `src/`
- **CSS custom properties** for all theme-sensitive colors
- **No external component libraries** — UI is hand-built with Tailwind + CSS
- **`store.ts`** for all state — no direct `localStorage` calls in components
- **`PageLayout` wrapper** — all authenticated pages use this for nav + consistent layout

## Non-obvious Decisions

1. **ThemeContext exported from `__root.tsx`** to avoid circular imports.
2. **localStorage state** for a demo-quality platform without server persistence requirements.
3. **SVG charts in analytics.tsx** — avoids adding a chart library dependency.
4. **Seed data in `store.ts`** — DEFAULTS object fills data on first load for realistic UX.
5. **`framer-motion`** is in dependencies but most animations use CSS for React 19 compatibility.

## Environment Variables

```
ANTHROPIC_API_KEY=...   # Preferred AI provider
OPENAI_API_KEY=...      # Fallback
GOOGLE_GENERATIVE_AI_API_KEY=...  # Fallback
OLLAMA_BASE_URL=...     # Local fallback
```

## Development Commands

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
netlify dev      # Full Netlify emulation (port 8888)
```
