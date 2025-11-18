import { NextResponse } from 'next/server';
import { getClient } from '@/lib/db';

export async function POST(request: Request){
    try{
        const submission = await request.json();
        console.log("submission: ", submission);

        const client = getClient();
        await client.connect();
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
                highlight_id
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
            )`,
            [
                new Date().toISOString(),
                submission.email,
                submission.phone_number,
                submission.verified,
                submission.pc_team_id,
                submission.mobile_team_id,
                submission.pc_player_id,
                submission.mobile_player_id,
                submission.coach_id,
                submission.igl_id,
                submission.talent_id,
                submission.streamer_id,
                submission.highlight_id
            ]
        );

        await client.end();
        return NextResponse.json(
            { success: true, message: 'Submission saved' }
        );
    } catch (error) {
        console.error('Error saving submission:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to save submission' },
            { status: 500 }
        );
    }
}