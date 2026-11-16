# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Public voting site for the Mongolian Esports Awards (ESN Awards). Next.js 15 App Router + React 19 + Tailwind v4, backed by PostgreSQL via `pg`. User-facing text is in Mongolian.

## Commands

- `npm run dev` — dev server (Turbopack) at http://localhost:3000/mea
- `npm run build` — production build (Turbopack, `output: "standalone"`)
- `npm run start` — serve the production build
- Docker: `Dockerfile` builds the standalone output and runs `node server.js` on port 3000. `.env` is in `.dockerignore`; pass config at runtime with `docker run --env-file .env -p 3000:3000 <image>`.
- Env vars are listed in `.env.example`.

There is no test suite and no `lint` script (`eslint.config.mjs` references `eslint-config-next`, which is not installed). Node 20.x. `npm run build` type-checks every file under `app/`, including ones nothing imports.

### Branches
One branch per awards season: `v2` is the 2026 season. Commit season work there, not to `main` or feature branches.

## Architecture

### basePath
`next.config.ts` sets `basePath: "/mea"`. `router.push("/coach")` and `<Link>` get the prefix automatically, but **raw `fetch` URLs and CSS `url(...)` / `<Image src>` strings do not** — they are hardcoded as `/mea/api/...` and `/mea/...`. Keep this prefix when adding fetches or assets in `public/`. For images use `imageSrc()` (see Images) instead of building paths by hand.

### Voting flow (client-side wizard)
Every page under `app/` is a `"use client"` step. The order is fixed by each page's `router.push` / `CustomArrow to=`:

`/` → `pc-team` → `mobile-team` → `pc-player` → `mobile-player` → `coach` → `igl` → `talent` → `streamer` → `fan-favorite` → `highlight` → `submit`

Each step fetches its nominees from a matching `app/api/<category>/route.ts`, and stores the selection in **`sessionStorage`** under a key like `pc_team_id`, `coach_id`, `fav_player_id`, `highlight_id`. `app/submit/page.tsx` reads all sessionStorage keys into the submission payload, so key names must match the column names in `esn.submissions`. Adding/renaming a category means updating the page, its API route, `lib/vote-categories.ts`, the submit payload, and the `/api/submit` INSERT together.

`lib/vote-categories.ts` lists the 10 categories (key, header label, `esn.awards` slug + `sport_id`). Each key is also the `esn.awards` column the page stores. The submit page uses it to name the missing categories. `/api/submit` uses it to return 400 unless all 10 ids are positive integers and each one exists in `esn.awards` under that category's slug/sport (one `EXISTS` per category, checked before the transaction).

### Submit + verification
`submit/page.tsx`:
1. Checks completeness (all 10 keys from `lib/vote-categories.ts`) and that input is an email (SMS is disabled both client-side and in `/api/otp/send`).
2. `GET /api/check-register?identity=` — early check for **one vote per identity per day** (Ulaanbaatar day, computed server-side) against `esn.voters.vote_date`.
3. Shows `OTPVerification`, which calls `/api/otp/send|resend|verify`. These routes proxy to an internal OTP service at `http://10.21.68.21/otp/api/v1/...` (app_name `esnAwards`); it's only reachable from the deployment network.
4. On verify, `/api/otp/verify` returns a `voteToken` (15-minute JWT signed with `JWT_SECRET`, subject = normalized identity, `lib/vote-token.ts`). `POST /api/submit` rejects with 401 unless the token is valid for the submitted email, then inserts into `esn.voters` and `esn.submissions` in one transaction. `UNIQUE (identity, vote_date)` on `esn.voters` is the real once-per-day guard; a violation returns 409.

### Rate limiting
`lib/rate-limit.ts`: fixed-window counters in `esn.rate_limits` (keys prefixed `mea:`), upserted atomically. `check-register`, `otp/send`, `otp/resend` (shares the send buckets), `otp/verify` and `submit` call `rateLimit([[LIMITS.x, subject], ...])` and return its 429 (Mongolian message + `Retry-After`) if set. Per-email limits are tight; per-IP limits are loose because mobile carriers share IPs (CGNAT). The IP is the rightmost `X-Forwarded-For` entry (or `X-Real-IP`), so it assumes exactly one trusted reverse proxy in front of the app; with no header, per-IP limits are skipped. If the limiter's query fails, the request is allowed. Tune numbers in `LIMITS`.

### Data layer
- `lib/db.ts` — `getPool()` returns a lazily-created singleton `pg.Pool` (preferred); `getClient()` creates a one-off `Client` (still used by `check-email`/`check-phone`). Config from env: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`; SSL is on unless `DB_SSL=false` (Supabase requires it).
- `supabase/schema.sql` — full DDL for the Supabase database (sets DB time zone to Asia/Ulaanbaatar, enables RLS with no policies).
- All tables live in the `esn` schema. Nominees for every category come from a single `esn.awards` table filtered by `slug` (`teams`, `players`, `coaches`, `igls`, `talents`, `streamers`, `highlights`, …) and `sport_id` (PC vs mobile), with no per-player exclusions, so the lists match the nominee check in `/api/submit`.
- `sport_id`: `1` = PC (CS2), `2` = mobile (PUBG Mobile, MLBB); the game is told apart by `sport_image_url` (`cs.png`, `pubg_logo.png`, `mlbb_logo.png`). The fan-favorite slug is `favs`.
- Each category's vote id column (`pc_player_id`, `coach_id`, `igl_id`, `fav_player_id`, …) holds the person's `esn.players.id` (or the team id for team categories), so vote results join back to `esn.players`. Every person row in `esn.awards` also carries `player_id`.
- `esn.players` — one row per nominee/coach; ids are chosen explicitly (2026 seed: `1xx` CS2, `2xx` PUBG Mobile, `3xx` MLBB).
- `esn.tournaments` (`event_month` must be the 1st of a month) and `esn.achievements` (`achievement_type` is `tournament_place` with `placement > 0`, or `mvp` with `placement` NULL; at most one MVP per tournament).
- `supabase/seed_2026.sql` — 2026 nominees, tournaments and achievements (from Liquipedia). Talent, streamer and highlight rows are `SAMPLE` placeholders to replace.

### Images
All images live in the public Supabase Storage bucket `esn-awards-2026`, not in `public/` (which only keeps `fonts/` and `new-bg/`, the background photos/videos). `imageSrc()` in `lib/image.ts` resolves an image value: a full `https://` URL is used as-is, a plain filename (`cs.png`, `esn_logo.png`, or a value from `esn.awards`) becomes `IMAGE_BUCKET_URL/<file>`, and an empty value falls back to `placeholder.png` in the bucket. A leading `/` is tolerated, so pages can keep passing `` `/${row.player_image_url}` ``. To add an image, upload it to the bucket and store just the filename in the DB. The bucket has no storage policies: public read by URL only; uploads/deletes only via the dashboard or the service_role key.

### Nominee cards and notices
- `NomineeGrid` (`count` prop) + `.nominee-grid` in `globals.css` lay out nominee cards: 2 per row on phones, balanced rows on desktop (up to 5 in one row, more split evenly, e.g. 10 → 5 + 5). Designed for up to 10 nominees per award.
- `CustomPlayerCard`, `CustomTeamCard`, `CustomStreamerCard` share `NomineeCardShell` (single glass layer, selected state, click/Enter/Space). Inside a card only the medal is a button; team logos are plain images, and the game logo sits on a light label because `pubg_logo.png` is black on transparent.
- Never use `alert()`. Call `notify(message, "error" | "success" | "info")` from `lib/notify.ts`; `<Notifier />` in `app/layout.tsx` shows it as a glass toast. For messages inside a form use `<InlineNotice>` (exported from `Notifier.tsx`).

### Achievements pop-up
`CustomPlayerCard` (PC player, mobile player, coach, IGL pages) has a medal button that calls `onAchievementsClick`; it stops propagation so it never selects/votes. The page stores the row in `achievementsPlayer` state and renders `AchievementsModal`, which fetches `GET /api/achievements?player_id=` (newest first) and passes the list to `CustomAchievementCard` (summary + all rows + empty state). Pages must keep `player_id` in their row type for this.

### Auth
`lib/auth.ts` + `/api/login` implement a JWT admin login against `ADMIN_USERNAME` / `ADMIN_PASSWORD` / `JWT_SECRET` env vars. No current page or route consumes the admin token. `JWT_SECRET` is also required for voting (vote tokens).

### Poll deadline
`app/layout.tsx` has `POLL_DEADLINE`; after it passes, the root layout replaces the whole app with a "voting closed" screen. The home page (`app/page.tsx`) shows the closing date as separate hardcoded text — update both for a new awards season.

### Unused/legacy
`@supabase/supabase-js`, `express-rate-limit`, `crypto` and `class-variance-authority` are dependencies but not imported anywhere (the app talks to Supabase only through `pg`). `/api/check-email` and `/api/check-phone` are no longer called (the code using them in `submit/page.tsx` is commented out).
