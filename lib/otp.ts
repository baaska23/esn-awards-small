import crypto from 'crypto';

interface OTPEntry{
    code: string;
    expiresAt: number;
    attempts: number
}

const otpStore = new Map<string, OTPEntry>();

export function generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    const randomBytes = crypto.randomBytes(length);

    for(let i = 0; i<length; i++) {
        otp += digits[randomBytes[i] % digits.length];
    }
    return otp;
}

export function storeOTP(identifier: string, code: string, expiryMinutes: number = 5): void {
    console.log("Storing OTP for:", identifier);
    const expiresAt = Date.now() + (expiryMinutes * 60 * 1000);
    otpStore.set(identifier, {
        code,
        expiresAt,
        attempts: 0
    });

    if(Math.random() < 0.1) {
        cleanupExpiredOTPs()
    }
}

export function verifyOTP(identifier: string, code: string): { 
  success: boolean; 
  error?: string;
  remaining?: number;
} {
    console.log("Verifying OTP for:", identifier);
    const entry = otpStore.get(identifier);

    if(!entry) {
        return {success: false, error: "OTP not found or expired"};
    }

    if(Date.now() > entry.expiresAt) {
        otpStore.delete(identifier);
        return {success: false, error: "OTP expired"}
    }

    if (entry.attempts >= 3) {
        otpStore.delete(identifier);
        return { success: false, error: 'Too many failed attempts' };
    }
  
    if (entry.code !== code) {
        entry.attempts += 1;
        otpStore.set(identifier, entry);
        return { 
        success: false, 
        error: 'Invalid OTP', 
        remaining: 3 - entry.attempts 
        };
    }

    otpStore.delete(identifier);
    return {success: true};
}

function cleanupExpiredOTPs(): void {
    const now = Date.now();
    for(const [key, value] of otpStore.entries()) {
        if(now > value.expiresAt) {
            otpStore.delete(key);
        }
    }
}

export function deleteOTP(identifier: string): void {
    otpStore.delete(identifier);
}