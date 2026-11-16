// The 10 award categories a vote must cover. Shared by the submit page
// (completeness check) and /api/submit (completeness + nominee check).
// Pure data: safe to import from client components.
//
// `key` is the sessionStorage key, the esn.submissions column, and the
// esn.awards column the step page stores; `slug`/`sportId` match the
// filter in that category's nominee API route.

export interface VoteCategory {
  key: string;
  label: string;          // as shown in the step page header
  slug: string;
  sportId: 1 | 2 | null;  // null = any sport
}

export const VOTE_CATEGORIES: readonly VoteCategory[] = [
  { key: 'pc_team_id',       label: 'PC Esports Team',     slug: 'teams',      sportId: 1 },
  { key: 'mobile_team_id',   label: 'Mobile Esports Team', slug: 'teams',      sportId: 2 },
  { key: 'pc_player_id',     label: 'PC Player',           slug: 'players',    sportId: 1 },
  { key: 'mobile_player_id', label: 'Mobile Player',       slug: 'players',    sportId: 2 },
  { key: 'coach_id',         label: 'Coach',               slug: 'coaches',    sportId: null },
  { key: 'igl_id',           label: 'IGL',                 slug: 'igls',       sportId: null },
  { key: 'talent_id',        label: 'Talent',              slug: 'talents',    sportId: null },
  { key: 'streamer_id',      label: 'Gaming Streamer',     slug: 'streamers',  sportId: null },
  { key: 'fav_player_id',    label: 'Fan Favorite Player', slug: 'favs',       sportId: null },
  { key: 'highlight_id',     label: 'Highlight',           slug: 'highlights', sportId: null },
];

// A valid vote id: a positive whole number.
export function toVoteId(value: unknown): number | null {
  const n = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  return typeof n === 'number' && Number.isSafeInteger(n) && n > 0 ? n : null;
}

// Categories in `source` without a valid id.
export function missingCategories(source: Record<string, unknown>): VoteCategory[] {
  return VOTE_CATEGORIES.filter((c) => toVoteId(source[c.key]) === null);
}
