interface RateLimitEntity {
    count: number,
    resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntity>();

export function rateLimit(
    identifier: string,
    limit: number = 100,
    windowMs: number = 10 * 60 * 1000
): { success: boolean; remaining: number; reset: number } {
    const now = Date.now();
    const entry = rateLimitMap.get(identifier);

    if(Math.random() < 0.01) {
        for(const [key, value] of rateLimitMap.entries()) {
            if (now > value.resetTime) {
                rateLimitMap.delete(key);
            }
        }
    }

    if(!entry || now > entry.resetTime) {
        const resetTime = now + windowMs;
        rateLimitMap.set(identifier, {count: 1, resetTime});
        return { success: true, remaining: limit - 1, reset: resetTime }; 
    }

    if (entry.count >= limit) {
        return { success: false, remaining: 0, reset: entry.resetTime };
    }

    entry.count += 1;
    rateLimitMap.set(identifier, entry);
    return { success: true, remaining: limit - entry.count, reset: entry.resetTime };
}