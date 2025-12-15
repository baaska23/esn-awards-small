import { NextResponse } from "next/server";
import { getClient, getPool } from "@/lib/db";

export async function GET() {
    const pool = getPool();
    const result = await pool.query('SELECT * from esn.awards WHERE slug = $1', ['streamers']);
    return NextResponse.json(result.rows ?? []);
}