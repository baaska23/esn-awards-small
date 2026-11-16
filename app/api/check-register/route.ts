import { NextResponse } from 'next/server';
import { getClient, getPool } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const identity = searchParams.get('identity')?.trim().toLowerCase();

  if (!identity) {
    return NextResponse.json({ error: 'Missing identity' }, { status: 400 });
  }

  try {
    const pool = getPool();

    // "Today" is decided by the server in Ulaanbaatar time, matching the
    // generated esn.voters.vote_date column — not by the browser's clock.
    const result = await pool.query(
      `SELECT COUNT(*) AS total FROM esn.voters
       WHERE identity = $1
         AND vote_date = (now() AT TIME ZONE 'Asia/Ulaanbaatar')::date`,
      [identity]
    );

    console.log("result in check-register: ", result);

    return NextResponse.json({ total: parseInt(result.rows[0].total, 10) });
  } catch (error) {
    console.error('Error fetching registration count:', error);
    return NextResponse.json({ error: 'Failed to fetch registration count' }, { status: 500 });
  }
}