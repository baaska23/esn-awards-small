import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { normalizeIdentity, verifyVoteToken } from '@/lib/vote-token';
import { LIMITS, clientIp, rateLimit } from '@/lib/rate-limit';

// Postgres error code for a unique-constraint violation.
const UNIQUE_VIOLATION = '23505';

export async function POST(request: Request){
    const limited = await rateLimit([[LIMITS.submitIp, clientIp(request)]]);
    if (limited) return limited;

    const pool = getPool();
    const client = await pool.connect();

    try{
        const submission = await request.json();
        const identity = normalizeIdentity(submission.email ?? submission.phone_number);
        if (!identity) {
            return NextResponse.json(
                { success: false, error: 'Missing email' },
                { status: 400 }
            );
        }

        // Only accept a vote backed by a fresh OTP verification for this identity.
        if (!verifyVoteToken(submission.voteToken, identity)) {
            return NextResponse.json(
                { success: false, error: 'OTP verification required' },
                { status: 401 }
            );
        }

        await client.query('BEGIN');

        // Record the voter first. esn.voters has UNIQUE (identity, vote_date),
        // so a second vote on the same Ulaanbaatar day fails here and the
        // submission below is never written.
        await client.query(
            `INSERT INTO esn.voters (identity, total, last_updated) VALUES ($1, 1, now())`,
            [identity]
        );

        await client.query(
            `INSERT INTO esn.submissions (
                timestamp,
                email,
                phone_number,
                verified,
                pc_team_id,
                mobile_team_id,
                pc_player_id,
                mobile_player_id,
                coach_id,
                igl_id,
                talent_id,
                streamer_id,
                fav_player_id,
                highlight_id
            ) VALUES (
                now(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
            )`,
            [
                submission.email,
                submission.phone_number,
                true, // verified: guaranteed by the vote token check above
                submission.pc_team_id,
                submission.mobile_team_id,
                submission.pc_player_id,
                submission.mobile_player_id,
                submission.coach_id,
                submission.igl_id,
                submission.talent_id,
                submission.streamer_id,
                submission.fav_player_id,
                submission.highlight_id
            ]
        );

        await client.query('COMMIT');

        return NextResponse.json(
            { success: true, message: 'Submission saved' }
        );
    } catch (error) {
        await client.query('ROLLBACK').catch(() => {});

        if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
            return NextResponse.json(
                { success: false, error: 'Already voted today' },
                { status: 409 }
            );
        }

        console.error('Error saving submission:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to save submission' },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}
