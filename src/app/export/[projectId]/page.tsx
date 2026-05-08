"use client";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ExportPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [markdown, setMarkdown] = useState("");

  const load = async () => {
    const res = await fetch("/api/exportMarkdown", { method: "POST", body: JSON.stringify({ projectId }) });
    const data = await res.json();
    setMarkdown(data.markdown);
  };

  return <main className="mx-auto max-w-3xl p-8"><h1 className="text-2xl font-semibold">결과 내보내기</h1>
    <button onClick={load} className="mt-4 rounded bg-black px-4 py-2 text-white">마크다운 불러오기</button>
    <button onClick={()=>navigator.clipboard.writeText(markdown)} className="ml-2 rounded border px-4 py-2">복사</button>
    <button className="ml-2 rounded border px-4 py-2">PDF (준비중)</button>
    <button className="ml-2 rounded border px-4 py-2">Notion (준비중)</button>
    <button className="ml-2 rounded border px-4 py-2">Google Sheets (준비중)</button>
    <textarea className="mt-4 h-96 w-full border p-2" value={markdown} onChange={(e)=>setMarkdown(e.target.value)} />
  </main>;
}
