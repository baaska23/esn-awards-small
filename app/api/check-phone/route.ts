import { NextResponse } from "next/server";
import { getClient } from "@/lib/db";

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const phoneNumber = searchParams.get('phoneNumber');
    if(!phoneNumber) {
        return NextResponse.json({ exists: false, error: 'No phone number provided'}, {status: 400 });
    }

    const client = getClient();
    await client.connect();
    const result = await client.query('SELECT phone_number FROM esn.submissions where phone_number = $1', [phoneNumber]);

    const exists = result.rows.length > 0;
    return NextResponse.json({ exists });
}