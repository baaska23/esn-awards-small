import { NextResponse } from 'next/server';
import { getClient } from '@/lib/db';

export async function GET() {
  const client = getClient();
  try {
    await client.connect();
    const result = await client.query(
      'SELECT * FROM esn.awards WHERE slug = $1 and sport_id = $2',
      ['teams', 1]
    );
    await client.end();
    return NextResponse.json(result.rows ?? []);
  } catch (error) {
    await client.end();
    console.error('API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal Server Error', details: errorMessage },
      { status: 500 }
    );
  }
}