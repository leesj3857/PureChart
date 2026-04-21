# PureChart - Core Architecture & Guidelines

This file provides strict guidance for Claude Code when working on the PureChart repository. PureChart is a real-time Korean/US stock dashboard, chart pattern learning platform, and trading quiz application.

## 1. Tech Stack & Version Constraints
- **Next.js 16.2.4 (App Router):** Route `params` and `searchParams` are now `Promise` objects. You MUST `await` them in pages, layouts, and route handlers.
- **React 19:** Server Components are the default. Use `"use client"` strictly only when hooks or DOM manipulation are required.
- **Tailwind CSS v4:** Uses `@theme` in `app/globals.css` instead of `tailwind.config.ts`. Do not attempt to create or modify a tailwind config file.
- **lightweight-charts v5:** Used for all candlestick and technical charts (`components/chart/CandleChart.tsx`).
- **Prisma 7:** Database ORM for user stats and saved configurations.
- **State & Data:** TanStack Query (server state), Zustand (client global state), Axios (data fetching).

## 2. Business Logic & API Constraints
- **KIS API Rate Limiting (CRITICAL):** KIS (한국투자증권) API is strictly limited to 20 Transactions Per Second (TPS). All backend API routes `/api/kis/*` must implement a robust Rate Limiter or Queue to prevent exceeding this limit.
- **KIS API Authentication (Token Management):** The KIS API access token must be issued strictly **once per day**. You MUST implement a robust token caching mechanism (e.g., using Prisma/DB, Redis, or secure persistent storage) to store and reuse the valid token. Do not request a new token on every API call or Next.js serverless cold start.
- **Market Time Switching (KST):**
  - All time-based logic must strictly use Korean Standard Time (KST / UTC+9). Use `date-fns` for time manipulations.
  - Regular Market Hours: Display Korean Stocks as the main default.
  - After 17:00 KST (Pre-market open): Automatically switch to US Stocks as the main default.
- **Real-time Data (WebSocket):** Real-time prices and order books must be delivered via WebSockets. Implement automatic reconnection (Exponential Backoff) and strict cleanup logic on component unmount to prevent memory leaks.

## 3. Core Features Implementation Guide
- **Real-time Dashboard:** Display Top Gainers, Top Losers, and Top Trading Volume. Ensure UI does not flicker during rapid WebSocket updates.
- **Quiz Feature (Blind Charting):** - Fetch historical data via KIS API, but NEVER send future data payload to the client. The backend must slice the data at a random point.
  - Users predict Up/Down.
  - Provide a modal or sidebar with UI from `data/patterns.ts` to help users reference chart shapes.
- **Search & Details:** Enable technical indicator toggles (Moving Averages, RSI, MACD) inside the lightweight-chart instance on the detail page.

## 4. Design System & Styling Rules
- **CSS Variables:** All colors are CSS variables defined under `@theme` in `app/globals.css`.
- **Market Signals:** Use `--color-up` (Red in KR, Green in US) and `--color-down` (Blue in KR, Red in US). Use the `toneClass()` and `toneBg()` helpers from `lib/format.ts`.
- **Typography:** Always append the `.num` class to price/volume text to ensure tabular (monospaced) numerals.

## 5. Transition from Mock to Real Data
- Currently, `lib/mockSeries.ts` generates deterministic SSR mock candles. 
- When building features, slowly replace `mockSeries` with real fetching logic from `/api/kis/daily`, mapping the API response to the existing `Candle` and `StockSummary` types defined in `types/market.ts`.

## 6. Git Commit Guidelines
We strictly follow the Conventional Commits specification. When generating commit messages or writing code history, adhere to the following rules:

### Format
`<type>(<optional scope>): <subject>`

### Allowed Types
- `feat`: A new feature (e.g., KIS API integration, Quiz logic)
- `fix`: A bug fix (e.g., resolving WebSocket memory leaks, fixing Rate Limiter)
- `docs`: Documentation only changes (e.g., updating README.md)
- `style`: Changes that do not affect the meaning of the code (formatting, missing semi-colons, Tailwind class sorting)
- `refactor`: A code change that neither fixes a bug nor adds a feature (e.g., restructuring components)
- `perf`: A code change that improves performance (e.g., reducing React re-renders)
- `chore`: Changes to the build process, package.json, or auxiliary tools

### Rules
1. **Subject Line:** Use the imperative, present tense (e.g., "add KIS API route" instead of "added" or "adds").
2. **Capitalization:** Do NOT capitalize the first letter of the subject.
3. **Punctuation:** Do NOT add a period (`.`) at the end of the subject.
4. **Detailing:** For complex changes, leave an empty line after the subject and write a detailed description of *why* the change was made in the body.