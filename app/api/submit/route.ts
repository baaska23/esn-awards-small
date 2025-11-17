import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';
import { getClient } from '@/lib/db';

export async function POST(request: Request){
    try{
        const ip = request.headers.get('x-forwarded-for') ?? 
               request.headers.get('x-real-ip') ?? 
               'anonymous';

        const { success, remaining, reset } = rateLimit(ip, 5, 10 * 60 * 1000);

        if (!success) {
            return NextResponse.json(
                { 
                success: false, 
                error: 'Too many requests, please try again later',
                remaining: 0,
                resetAt: new Date(reset).toISOString()
                },
                { 
                status: 429,
                headers: {
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': reset.toString(),
                    'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
                }
                }
            );
        }
        const submission = await request.json();
        console.log("submission: ", submission)
        
        const client = getClient();
        await client.connect();
        await client.query(
            `INSERT INTO esn.submissions (
                timestamp, 
                email, 
                verified, 
                player_sport_id, 
                player_id, 
                team_sport_id, 
                team_id, 
                highlight_id, 
                phone_number, 
                talent_id, 
                igl_id, 
                streamer_id, 
                coach_id
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
            )`,
            [
                new Date().toISOString(),
                submission.email,
                submission.verified,
                submission.player_sport_id,
                submission.player_id,
                submission.team_sport_id,
                submission.team_id,
                submission.highlight_id,
                submission.phone_number,
                submission.talent_id,
                submission.igl_id,
                submission.streamer_id,
                submission.coach_id
            ]
        );

        await client.end();
        return NextResponse.json(
            { success: true, message: 'Submission saved' },
            {
                headers: {
                'X-RateLimit-Remaining': remaining.toString(),
                'X-RateLimit-Reset': reset.toString(),
                }
            }
        );
    } catch (error) {
        console.error('Error saving submission:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to save submission' },
            { status: 500 }
        );
    }
}