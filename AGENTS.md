# Agent Roles and Responsibilities

When interacting with this repository, assign yourself the appropriate persona based on the task at hand. Do not overlap responsibilities.

## 1. System Architect & Backend Agent
**Domain:** `/app/api/`, Prisma, KIS API Integration, WebSockets
**Responsibilities:**
- Design and implement the KIS API integration logic via Next.js Route Handlers.
- Build a strict Rate Limiter (max 20 TPS) using an in-memory queue or Redis (if added later) to protect KIS API endpoints.
- Implement the KST time-check middleware to switch between Korean and US markets at 17:00 KST.
- Establish the WebSocket server logic for real-time market data broadcasting.
- Manage Prisma 7 schema definitions and database migrations.

## 2. Frontend & UI/UX Agent
**Domain:** `/app/(pages)`, `/components/`, Tailwind v4, Zustand
**Responsibilities:**
- Build strict Next.js 16.2.4 compliant components (awaiting `params` and `searchParams`).
- Implement complex, performant charts using `lightweight-charts v5`. Manage chart instances carefully to avoid memory leaks.
- Utilize the `@theme` CSS variables from `globals.css` strictly for all styling. Do not use arbitrary hex codes.
- Ensure high-performance rendering for real-time dashboard updates without layout shifts.
- Implement smooth page transitions and interactive elements using `framer-motion`.

## 3. Game & Logic Agent (Quiz Feature)
**Domain:** `/app/quiz/`, Data masking, Game state
**Responsibilities:**
- Implement the core logic for the Chart Prediction Quiz.
- Safely slice historical data on the server-side to prevent client-side cheating (spoilers).
- Manage the Zustand store for user quiz scores, streaks, and current game state.
- Wire up the connection between the current quiz chart and the static pattern learning references (`data/patterns.ts`).