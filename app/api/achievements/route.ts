import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

// GET /api/achievements?player_id=101
// Returns a player's achievements, newest tournament first.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('player_id') ?? '';

  if (!/^\d{1,18}$/.test(raw)) {
    return NextResponse.json({ error: 'Invalid player_id' }, { status: 400 });
  }

  try {
    const pool = getPool();
    const result = await pool.query(
      `SELECT a.id,
              a.achievement_type,
              a.placement,
              t.name AS tournament,
              to_char(t.event_month, 'YYYY.MM') AS month
       FROM esn.achievements a
       JOIN esn.tournaments t ON t.id = a.tournament_id
       WHERE a.player_id = $1
       ORDER BY t.event_month DESC, t.name, (a.achievement_type = 'mvp') DESC, a.placement
       LIMIT 100`,
      [raw]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}
