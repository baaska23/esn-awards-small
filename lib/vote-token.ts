import jwt from 'jsonwebtoken';

// Short-lived proof that an identity passed OTP verification.
// /api/otp/verify issues it; /api/submit requires it, so a vote can't be
// posted for an email that never received and entered a code.

const PURPOSE = 'vote';
const TTL = '15m';

export function normalizeIdentity(value: unknown): string {
  return String(value ?? '').trim().toLowerCase();
}

function secret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET is not configured');
  return s;
}

export function signVoteToken(identity: string): string {
  return jwt.sign({ purpose: PURPOSE }, secret(), {
    subject: normalizeIdentity(identity),
    expiresIn: TTL,
    algorithm: 'HS256',
  });
}

// True only if the token is valid, unexpired, issued for voting, and for this identity.
export function verifyVoteToken(token: unknown, identity: string): boolean {
  if (typeof token !== 'string' || !token) return false;
  try {
    const payload = jwt.verify(token, secret(), { algorithms: ['HS256'] });
    return (
      typeof payload === 'object' &&
      payload.purpose === PURPOSE &&
      payload.sub === normalizeIdentity(identity)
    );
  } catch {
    return false;
  }
}
