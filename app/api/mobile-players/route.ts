import { NextResponse } from 'next/server';
import { getClient } from '@/lib/db';

export async function GET() {
  const client = getClient();
  await client.connect();
  const result = await client.query('SELECT * FROM esn.awards WHERE slug = $1 and sport_id =  $2', ['players', 2]);
  await client.end();
  return NextResponse.json(result.rows ?? []);
}