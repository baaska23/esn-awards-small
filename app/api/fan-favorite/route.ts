import { NextResponse } from "next/server";
import { getClient, getPool } from "@/lib/db";

export async function GET() {
    const pool = getPool();
    
    const result = await pool.query(`
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
    
    return NextResponse.json(result.rows ?? []);
}