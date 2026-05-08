import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase";
export async function POST(request: Request) {
  try {
    const { projectId } = await request.json();
    const answers = await supabaseRest.select("interview_answers", `project_id=eq.${projectId}&order=order_index.asc`);
    return NextResponse.json({ answers });
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }); }
}
