import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

// Fixed-window rate limiting stored in esn.rate_limits (one row per key).
// Postgres instead of memory, so limits hold across restarts and instances.

export interface Limit {
  name: string;       // bucket name, part of the stored key
  max: number;        // requests allowed per window
  windowSec: number;  // window length in seconds
}

// Per-IP limits are generous on purpose: mobile carriers put many voters
// behind one shared (CGNAT) IP. Per-email limits are the tight ones.
export const LIMITS = {
  otpSendEmail:  { name: 'otp-send:email',  max: 5,   windowSec: 60 * 60 },
  otpSendIp:     { name: 'otp-send:ip',     max: 100, windowSec: 10 * 60 },
  otpVerifyEmail:{ name: 'otp-verify:email',max: 10,  windowSec: 15 * 60 },
  otpVerifyIp:   { name: 'otp-verify:ip',   max: 200, windowSec: 10 * 60 },
  checkIp:       { name: 'check:ip',        max: 200, windowSec: 10 * 60 },
  submitIp:      { name: 'submit:ip',       max: 100, windowSec: 10 * 60 },
} satisfies Record<string, Limit>;

const MESSAGE = 'Хэт олон оролдлого хийлээ. Түр хүлээгээд дахин оролдоно уу.';

// Client IP from the reverse proxy. The rightmost X-Forwarded-For entry is
// the one our own proxy appended; earlier entries are client-supplied and
// can be forged. Returns null when unknown, which skips per-IP limits
// rather than lumping every visitor into one bucket.
export function clientIp(request: Request): string | null {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const parts = xff.split(',').map((p) => p.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return request.headers.get('x-real-ip')?.trim() || null;
}

// Counts one hit against `limit` for `subject`. Returns seconds until the
// window resets if the limit is exceeded, otherwise null.
async function hit(limit: Limit, subject: string): Promise<number | null> {
  const key = `mea:${limit.name}:${subject}`;
  const { rows } = await getPool().query(
    `INSERT INTO esn.rate_limits (identifier, count, resets_at, created_at, updated_at)
     VALUES ($1, 1, now() + make_interval(secs => $2), now(), now())
     ON CONFLICT (identifier) DO UPDATE SET
       count      = CASE WHEN esn.rate_limits.resets_at <= now() THEN 1
                         ELSE esn.rate_limits.count + 1 END,
       resets_at  = CASE WHEN esn.rate_limits.resets_at <= now() THEN EXCLUDED.resets_at
                         ELSE esn.rate_limits.resets_at END,
       updated_at = now()
     RETURNING count,
               GREATEST(1, CEIL(EXTRACT(EPOCH FROM resets_at - now())))::int AS retry_after`,
    [key, limit.windowSec]
  );
  const { count, retry_after } = rows[0];
  return Number(count) > limit.max ? retry_after : null;
}

// Checks each [limit, subject] pair (null subjects are skipped). Returns a
// 429 response to send back, or null if the request may proceed. If the
// limiter itself fails it lets the request through and logs the error.
export async function rateLimit(
  checks: Array<[Limit, string | null | undefined]>
): Promise<NextResponse | null> {
  try {
    for (const [limit, subject] of checks) {
      if (!subject) continue;
      const retryAfter = await hit(limit, subject.trim().toLowerCase());
      if (retryAfter !== null) {
        return NextResponse.json(
          { success: false, error: MESSAGE },
          { status: 429, headers: { 'Retry-After': String(retryAfter) } }
        );
      }
    }
  } catch (error) {
    console.error('Rate limiter failed, allowing request:', error);
  }
  return null;
}
