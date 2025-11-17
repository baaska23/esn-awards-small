import { NextResponse } from "next/server";
import { getClient } from "@/lib/db";

export async function GET() {
    const client = getClient();
    await client.connect();
    const result = await client.query('SELECT * from esn.awards WHERE slug = $1 and sport_id = $2 and player_id != $3', ['players', 1, 13]);
    await client.end();
    return NextResponse.json(result.rows ?? []);
}