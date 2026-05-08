"use client";
import { stepQuestions, interviewSteps } from "@/ai/agents";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function InterviewPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();
  const flat = useMemo(() => interviewSteps.flatMap((step) => stepQuestions[step].map((q) => ({ step, question: q }))), []);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const current = flat[index];

  const next = async () => {
    await fetch("/api/saveInterviewAnswer", {
      method: "POST",
      body: JSON.stringify({ project_id: projectId, step: current.step, question: current.question, answer, order_index: index + 1 }),
    });

    const nextIndex = index + 1;
    setAnswer("");
    if (nextIndex < flat.length) return setIndex(nextIndex);

    for (const step of interviewSteps) {
      const stepAnswers = flat
        .map((item, idx) => ({ item, idx }))
        .filter((x) => x.item.step === step)
        .map((x) => ({ question: x.item.question }));
      await fetch("/api/generateStepOutput", { method: "POST", body: JSON.stringify({ projectId, step, answers: stepAnswers }) });
    }
    await fetch("/api/generateFinalReport", { method: "POST", body: JSON.stringify({ projectId }) });
    router.push(`/strategy/${projectId}`);
  };

  return <main className="mx-auto max-w-2xl p-8"><h1 className="text-2xl font-semibold">AI 인터뷰</h1>
    <p className="mt-2 text-sm text-gray-500">진행률 {index + 1} / {flat.length}</p>
    <div className="mt-6 rounded border p-4">{current.question}</div>
    <textarea className="mt-4 w-full border p-2" rows={5} value={answer} onChange={(e)=>setAnswer(e.target.value)} />
    <button onClick={next} className="mt-4 rounded bg-black px-4 py-2 text-white">다음</button></main>;
}
