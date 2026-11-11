# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Public voting site for the Mongolian Esports Awards (ESN Awards). Next.js 15 App Router + React 19 + Tailwind v4, backed by PostgreSQL via `pg`. User-facing text is in Mongolian.

## Commands

- `npm run dev` — dev server (Turbopack) at http://localhost:3000/mea
- `npm run build` — production build (Turbopack, `output: "standalone"`)
- `npm run start` — serve the production build
- Docker: `Dockerfile` builds the standalone output and runs `node server.js` on port 3000.

There is no test suite and no `lint` script (`eslint.config.mjs` references `eslint-config-next`, which is not installed). Node 20.x.

## Architecture

### basePath
`next.config.ts` sets `basePath: "/mea"`. `router.push("/coach")` and `<Link>` get the prefix automatically, but **raw `fetch` URLs and CSS `url(...)` / `<Image src>` strings do not** — they are hardcoded as `/mea/api/...` and `/mea/BG_*.jpg`. Keep this prefix when adding fetches or assets.

### Voting flow (client-side wizard)
Every page under `app/` is a `"use client"` step. The order is fixed by each page's `router.push` / `CustomArrow to=`:

`/` → `pc-team` → `mobile-team` → `pc-player` → `mobile-player` → `coach` → `igl` → `talent` → `streamer` → `fan-favorite` → `highlight` → `submit`

Each step fetches its nominees from a matching `app/api/<category>/route.ts`, and stores the selection in **`sessionStorage`** under a key like `pc_team_id`, `coach_id`, `fav_player_id`, `highlight_id`. `app/submit/page.tsx` reads all sessionStorage keys into the submission payload, so key names must match the column names in `esn.submissions`. Adding/renaming a category means updating the page, its API route, the submit payload, and the `/api/submit` INSERT together.

### Submit + verification
`submit/page.tsx`:
1. Checks completeness (count of sessionStorage keys) and that input is an email (SMS is disabled both client-side and in `/api/otp/send`).
2. `GET /api/check-register?identity=&date=` — enforces **one vote per identity per day** by counting rows in `esn.voters`.
3. Shows `OTPVerification`, which calls `/api/otp/send|resend|verify`. These routes proxy to an internal OTP service at `http://10.21.68.21/otp/api/v1/...` (app_name `esnAwards`); it's only reachable from the deployment network.
4. On verify: `POST /api/submit` (insert into `esn.submissions`) then `POST /api/register` (insert into `esn.voters`).

### Data layer
- `lib/db.ts` — `getPool()` returns a lazily-created singleton `pg.Pool` (preferred); `getClient()` creates a one-off `Client` (still used by `check-email`/`check-phone`). Config from env: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`.
- All tables live in the `esn` schema. Nominees for every category come from a single `esn.awards` table filtered by `slug` (`teams`, `players`, `coaches`, `igls`, `talents`, `streamers`, `highlights`, …) and `sport_id` (PC vs mobile). Some routes hardcode exclusions (e.g. specific `player_id`s) in SQL.
- Image paths in `esn.awards` rows (`team_image_url`, `sport_image_url`, …) are relative filenames rendered from `public/`.

### Auth
`lib/auth.ts` + `/api/login` implement a JWT admin login against `ADMIN_USERNAME` / `ADMIN_PASSWORD` / `JWT_SECRET` env vars. No current page or route consumes the token.

### Poll deadline
`app/layout.tsx` has `POLL_DEADLINE`; after it passes, the root layout replaces the whole app with a "voting closed" screen. The home page (`app/page.tsx`) shows the closing date as separate hardcoded text — update both for a new awards season.

### Unused/legacy
`@supabase/supabase-js`, `express-rate-limit`, and `crypto` are dependencies but not imported anywhere. `/api/check-email` and `/api/check-phone` are no longer called (the code using them in `submit/page.tsx` is commented out).
