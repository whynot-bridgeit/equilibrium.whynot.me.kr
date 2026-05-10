import { NextResponse } from "next/server";
import { generateWithOpenAI } from "@/lib/openai";
import { agentPrompts } from "@/ai/agents";

type ExtractCommerceToolkitBody = {
  sourceText: string;
  context?: Record<string, unknown>;
};

export async function POST(request: Request) {
  try {
    const { sourceText, context } = (await request.json()) as ExtractCommerceToolkitBody;

    if (!sourceText || !sourceText.trim()) {
      return NextResponse.json({ error: "sourceText는 필수입니다." }, { status: 400 });
    }

    const userPayload = {
      sourceText,
      context: context ?? {},
    };

    const output = await generateWithOpenAI(
      agentPrompts.commerceExtractionAgent,
      JSON.stringify(userPayload),
    );

    return NextResponse.json({ output });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
