import { env } from "./env";

export async function generateWithOpenAI(system: string, user: string, model = "gpt-4.1-mini") {
  if (!env.openaiApiKey) throw new Error("OPENAI_API_KEY가 설정되지 않았습니다.");

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.output_text as string;
}
