import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase";
export async function POST(request: Request) {
  try { await supabaseRest.insert("interview_answers", await request.json()); return NextResponse.json({ ok: true }); }
  catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }); }
}
