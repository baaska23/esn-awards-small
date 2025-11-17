import { NextResponse } from 'next/server';
import { getClient } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ exists: false, error: 'No email provided' }, { status: 400 });
  }

  const client = getClient();
  await client.connect();
  const result = await client.query('SELECT email FROM esn.submissions where email = $1', [email]);

  const exists = result.rows.length > 0;
  return NextResponse.json({ exists });
}