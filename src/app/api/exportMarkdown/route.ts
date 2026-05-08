import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase";
export async function POST(request: Request) {
  try {
    const { projectId } = await request.json();
    const rows = await supabaseRest.select("generated_outputs", `project_id=eq.${projectId}&output_type=eq.final_report&order=created_at.desc&limit=1&select=content`);
    return NextResponse.json({ markdown: rows?.[0]?.content?.markdown ?? "" });
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }); }
}
