# SehYaatri – Jharkhand Travel Assistant

Modern React + TypeScript + Vite app with Tailwind v4, dark mode, AI travel assistant (Gemini), destinations data for Jharkhand, interactive feedback form, floating chat widget, and a minimal backend for feedback + owner auth.

## Features

- Bilingual UI (English/Hindi), dark/light theme toggle with persistence
- Destinations, culture content, and category tabs (Culture/Food/Nature/Sports)
- AI assistant (Gemini API) with inline search fallback
- Feedback form (multi-step) – submits to backend
- Floating chat launcher that slides in from the right
- Owner auth (sign in / sign up) at `/auth`
- Backend API (Express) storing users/feedback into JSON files (no DB install)

## Prerequisites

- Node.js 18+ (22 works) and npm
- Windows/macOS/Linux

Optional (Windows): Git + GitHub CLI if you plan to publish

## Quick Start (dev)

1. Install deps
```bash
npm install
```

2. Run backend and frontend (two ways)
```bash
# Option A: one terminal (starts both)
npm run dev

# Option B: two terminals
npm run dev:server   # http://localhost:5175
npm run dev:client   # http://localhost:5174
```

3. Open the app
- Frontend: `http://localhost:5174/`
- Auth page (owner): `http://localhost:5174/auth`

4. Create owner and view feedback
- Go to `/auth`, Sign up (first owner)
- Submit feedback from the main page form
- View raw feedback JSON: `GET http://localhost:5175/api/feedback` (requires Bearer token if calling from a REST client; the link in the dashboard uses your stored token)

## Environment Variables

Create a `.env` file (optional):
```
JWT_SECRET=your_long_random_secret
PORT=5175
```

If not set, sensible defaults are used for local dev.

## Project Structure

```
src/
  App.tsx            # main UI + routes
  Auth.tsx           # modern sign in / sign up
  FeedbackForm.tsx   # multi-step feedback form (inline & modal)
  ai.ts              # Gemini helper + submitFeedback()
  data.json          # Jharkhand destinations/culture
server/
  index.js           # Express API (auth + feedback)
server_data/
  users.json         # created on first signup
  feedback.json      # created on first submission
```

## Scripts

```json
"dev": "concurrently \"vite\" \"node server/index.js\"",
"dev:client": "vite",
"dev:server": "node server/index.js",
"build": "tsc -b && vite build",
"preview": "vite preview"
```

## Gemini API (optional)

If you want the AI assistant online:
1. Get an API key from Google AI Studio.
2. Click the “Add API key” button in the navbar and paste your key.

## Deploy Notes

- Frontend can be deployed to Vercel/Netlify/Static hosting (build with `npm run build`).
- Backend requires a Node host (Render, Railway, Fly.io, or any VPS). Remember to set `JWT_SECRET`.

## Troubleshooting

- Port already in use: Vite auto-picks another port (e.g., 5174). The API runs on 5175 by default.
- Windows install errors: If you previously used native SQLite libs, this project now uses JSON storage to avoid build tools.
- Dark mode not toggling: ensure Tailwind v4 setup with `@variant dark (.dark &);` in `src/index.css` and that `<html>` gets the `dark` class (handled in `App.tsx`).

## License

MIT – use freely with attribution.
