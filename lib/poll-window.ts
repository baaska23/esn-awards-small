// Voting window, in Ulaanbaatar time. middleware.ts enforces it on every
// request: before POLL_START pages show /coming-soon, after POLL_DEADLINE they
// show /closed, and /api/* returns 403 outside the window.
// Update both dates (and the labels below) for a new awards season.
export const POLL_START = new Date("2026-12-07T00:00:00+08:00");
export const POLL_DEADLINE = new Date("2026-12-14T23:59:59+08:00");

export const POLL_START_LABEL = "2026.12.07 00:00";
export const POLL_DEADLINE_LABEL = "2026.12.14 23:59";

export type PollPhase = "upcoming" | "open" | "closed";

export function pollPhase(now: Date = new Date()): PollPhase {
  if (now < POLL_START) return "upcoming";
  if (now > POLL_DEADLINE) return "closed";
  return "open";
}
