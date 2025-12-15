import { NextResponse } from 'next/server';
import { getClient, getPool } from '@/lib/db';

export async function GET() {
  const pool = getPool();
  try {
    const result = await pool.query(
      'SELECT * FROM esn.awards WHERE slug = $1 and sport_id = $2',
      ['teams', 1]
    );
    return NextResponse.json(result.rows ?? []);
  } catch (error) {
    console.error('API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal Server Error', details: errorMessage },
      { status: 500 }
    );
  }
}