import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || '';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

export interface JWTPayload {
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

export function generateToken(username: string, role: string): string {
  return jwt.sign(
    { username, role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.error('Admin credentials not configured in environment variables');
    return false;
  }
  
  const isValid = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
  console.log('Credentials valid:', isValid);
  
  return isValid;
}

export function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

export function isAdmin(payload: JWTPayload | null): boolean {
  return payload?.role === 'admin';
}