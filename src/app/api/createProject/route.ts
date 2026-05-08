import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await supabaseRest.insert("projects", {
      user_id: body.userId ?? null,
      title: body.title,
      goal: body.goal,
      target_audience: body.targetAudience,
      status: "draft",
    });
    return NextResponse.json({ id: data[0]?.id });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
