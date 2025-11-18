import { NextResponse } from 'next/server';
import { getClient } from '@/lib/db';

export async function POST(request: Request){
    try{
        const registration = await request.json();
        console.log("registration: ", registration);

        const client = getClient();
        await client.connect();
        await client.query(
            `INSERT INTO esn.voters (
                last_updated, 
                identity,
                total
            ) VALUES (
                $1, $2, $3
            )`,
            [
                new Date().toISOString(),
                registration.identity,
                registration.total,
            ]
        );

        await client.end();
        return NextResponse.json(
            { success: true, message: 'Registration saved' }
        );
    } catch (error) {
        console.error('Error saving registration:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to save registration' },
            { status: 500 }
        );
    }
}