# CampusIQ 🎓

> Unified Campus Intelligence Dashboard powered by Google Gemini API + MCP (Model Context Protocol)

A full-stack campus assistant for IIT Roorkee students — ask any question about library availability, cafeteria menu, upcoming events, or academic deadlines in natural language.

---

## Architecture

```
┌────────────────────────────────────────────────────┐
│                  BROWSER CLIENT                    │
│  Next.js 14 App (Dashboard + Chat UI)              │
└──────────────────────┬─────────────────────────────┘
                       │ POST /api/chat (SSE)
                       ▼
┌────────────────────────────────────────────────────┐
│              NEXT.JS API ROUTE                     │
│  /app/api/chat/route.ts                            │
│  → Sends query to Gemini with 4 tool definitions   │
│  → Gemini decides which MCP server(s) to call     │
│  → Parallel fetch via Promise.all                  │
│  → Sends tool results back to Gemini               │
│  → Streams final response via SSE                  │
└──────┬──────────┬──────────┬──────────┬────────────┘
       │          │          │          │
       ▼          ▼          ▼          ▼
  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
  │Library │ │Cafeter.│ │Events  │ │Acad.   │
  │:4001   │ │:4002   │ │:4003   │ │:4004   │
  └────────┘ └────────┘ └────────┘ └────────┘
```

---

## Quick Start

### 1. Clone and install

```bash
git clone <repo>
cd campus-iq

# Install Next.js dependencies
npm install

# Install MCP server dependencies
cd mcp-servers
npm install
cd ..
```

### 2. Configure environment

Copy and fill in your API key:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
GEMINI_API_KEY=sk-...        # Required — get from aistudio.google.com
NEXTAUTH_SECRET=your-random-secret   # Any random string
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
MCP_LIBRARY_URL=http://localhost:4001
MCP_CAFETERIA_URL=http://localhost:4002
MCP_EVENTS_URL=http://localhost:4003
MCP_ACADEMICS_URL=http://localhost:4004
```

### 3. Run

```bash
npm run dev:all
```

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **AI**: Gemini 2.5 Flash with native function calling
- **MCP Servers**: Express.js
- **UI Components**: Shadcn UI + Lucide icons
