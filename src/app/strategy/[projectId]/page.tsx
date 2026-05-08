"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function StrategyPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [markdown, setMarkdown] = useState("리포트를 불러오는 중...");
  useEffect(() => {
    fetch("/api/exportMarkdown", { method: "POST", body: JSON.stringify({ projectId }) })
      .then((r) => r.json())
      .then((d) => setMarkdown(d.markdown || "리포트가 아직 없습니다."));
  }, [projectId]);

  return <main className="mx-auto max-w-4xl p-8"><h1 className="text-2xl font-semibold">전략 결과</h1>
    <pre className="mt-4 whitespace-pre-wrap rounded border p-4 text-sm">{markdown}</pre>
    <Link href={`/export/${projectId}`} className="mt-4 inline-block rounded bg-black px-4 py-2 text-white">내보내기</Link></main>;
}
