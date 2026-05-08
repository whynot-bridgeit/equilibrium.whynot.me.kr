import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase";
import { generateWithOpenAI } from "@/lib/openai";
import { agentPrompts, InterviewStep } from "@/ai/agents";

export async function POST(request: Request) {
  try {
    const { projectId, step, answers } = (await request.json()) as { projectId: string; step: InterviewStep; answers: unknown[] };
    const map: Record<InterviewStep, keyof typeof agentPrompts> = { self_discovery: "selfDiscoveryAgent", concept: "conceptAgent", monetization: "monetizationAgent", execution: "executionAgent" };
    const output = await generateWithOpenAI(agentPrompts[map[step]], JSON.stringify(answers));
    await supabaseRest.insert("generated_outputs", { project_id: projectId, output_type: step, content: { text: output } });
    return NextResponse.json({ output });
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }); }
}
