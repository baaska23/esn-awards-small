import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/db";

export async function GET() {
    const { data, error } = await getServerClient
        .from('awards')  // or 'esn_awards' - check your actual table name
        .select('*')
        .eq('slug', 'talents');

    if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data ?? []);
}