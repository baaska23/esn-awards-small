import { NextResponse } from "next/server";
import { getClient } from "@/lib/db";

export async function GET() {
    const client = getClient();
    await client.connect();
    const result = await client.query('SELECT * from esn.awards WHERE slug = $1', ['streamers']);
    await client.end();
    return NextResponse.json(result.rows ?? []);
}