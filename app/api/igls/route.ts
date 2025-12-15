import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
    const pool = getPool();
    const result = await pool.query('SELECT * from esn.awards WHERE slug = $1', ['igls']);
    return NextResponse.json(result.rows ?? []);
}