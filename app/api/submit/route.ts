import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { normalizeIdentity, verifyVoteToken } from '@/lib/vote-token';
import { LIMITS, clientIp, rateLimit } from '@/lib/rate-limit';
import { VOTE_CATEGORIES, missingCategories, toVoteId } from '@/lib/vote-categories';

// Postgres error code for a unique-constraint violation.
const UNIQUE_VIOLATION = '23505';

// One row of booleans: is each submitted id a nominee of its own category?
// $1..$10 follow VOTE_CATEGORIES order. Column names come from that fixed
// list, never from the request.
const NOMINEE_CHECK_SQL = `SELECT ${VOTE_CATEGORIES.map((c, i) =>
    `EXISTS (SELECT 1 FROM esn.awards WHERE slug = '${c.slug}'` +
    (c.sportId ? ` AND sport_id = ${c.sportId}` : '') +
    ` AND ${c.key} = $${i + 1}) AS ${c.key}`
).join(', ')}`;

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

        // Every category must have an answer...
        const missing = missingCategories(submission);
        if (missing.length) {
            return NextResponse.json(
                { success: false, error: 'Incomplete vote', missing: missing.map((c) => c.key) },
                { status: 400 }
            );
        }
        const ids = VOTE_CATEGORIES.map((c) => toVoteId(submission[c.key]) as number);

        // ...and each answer must be a nominee of that category.
        const check = await client.query(NOMINEE_CHECK_SQL, ids);
        const invalid = VOTE_CATEGORIES.filter((c) => !check.rows[0][c.key]).map((c) => c.key);
        if (invalid.length) {
            return NextResponse.json(
                { success: false, error: 'Invalid nominee', invalid },
                { status: 400 }
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
                ...ids // validated, in VOTE_CATEGORIES order = the column order above
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
