import { NextResponse } from 'next/server';
import { getClient, getPool } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const identity = searchParams.get('identity');
  const date = searchParams.get('date');

  if (!identity || !date) {
    return NextResponse.json({ error: 'Missing identity or date' }, { status: 400 });
  }

  try {
    const pool = getPool();

    const result = await pool.query(
      `SELECT COUNT(*) AS total FROM esn.voters WHERE identity = $1 AND last_updated::date = $2::date`,
      [identity, date]
    );

    console.log("result in check-register: ", result);

    return NextResponse.json({ total: parseInt(result.rows[0].total, 10) });
  } catch (error) {
    console.error('Error fetching registration count:', error);
    return NextResponse.json({ error: 'Failed to fetch registration count' }, { status: 500 });
  }
}