import { NextResponse } from 'next/server';
import { getClient, getPool } from '@/lib/db';

export async function GET() {
  const pool = getPool();
  const result = await pool.query('SELECT * FROM esn.awards WHERE slug = $1 and sport_id =  $2', ['players', 2]);
  return NextResponse.json(result.rows ?? []);
}