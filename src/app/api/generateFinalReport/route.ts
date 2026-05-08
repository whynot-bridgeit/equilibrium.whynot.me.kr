import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase";
import { generateWithOpenAI } from "@/lib/openai";
import { agentPrompts } from "@/ai/agents";

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json();
    const outputs = await supabaseRest.select("generated_outputs", `project_id=eq.${projectId}`);
    const report = await generateWithOpenAI(agentPrompts.masterStrategyAgent, JSON.stringify(outputs), "gpt-4.1");
    await supabaseRest.insert("generated_outputs", { project_id: projectId, output_type: "final_report", content: { markdown: report } });
    await supabaseRest.update("projects", `id=eq.${projectId}`, { status: "completed" });
    return NextResponse.json({ report });
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }); }
}
