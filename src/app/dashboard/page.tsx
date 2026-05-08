import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-2xl font-semibold">대시보드</h1>
      <p className="mt-2 text-gray-600">새 전략 프로젝트를 만들고 인터뷰를 진행하세요.</p>
      <Link href="/projects/new" className="mt-6 inline-block rounded bg-black px-4 py-2 text-white">새 프로젝트</Link>
    </main>
  );
}
