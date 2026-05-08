"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  const submit = async () => {
    const res = await fetch("/api/createProject", { method: "POST", body: JSON.stringify({ title, goal, targetAudience }) });
    const data = await res.json();
    router.push(`/interview/${data.id}`);
  };

  return <main className="mx-auto max-w-xl p-8 space-y-3"><h1 className="text-2xl font-semibold">새 프로젝트</h1>
    <input className="w-full border p-2" placeholder="프로젝트명" value={title} onChange={(e)=>setTitle(e.target.value)} />
    <input className="w-full border p-2" placeholder="목표" value={goal} onChange={(e)=>setGoal(e.target.value)} />
    <input className="w-full border p-2" placeholder="타겟 오디언스" value={targetAudience} onChange={(e)=>setTargetAudience(e.target.value)} />
    <button onClick={submit} className="rounded bg-black px-4 py-2 text-white">인터뷰 시작</button></main>;
}
