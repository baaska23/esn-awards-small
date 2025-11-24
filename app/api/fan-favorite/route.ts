import { NextResponse } from "next/server";
import { getClient } from "@/lib/db";

export async function GET() {
    const client = getClient();
    await client.connect();
    
    const result = await client.query(`
        SELECT 
            team_id,
            fav_player_id,
            username,
            team_image_url,
            team_name
        FROM esn.awards
        WHERE slug = $1
        ORDER BY team_id, fav_player_id
    `, ['favs']);
    
    await client.end();
    return NextResponse.json(result.rows ?? []);
}