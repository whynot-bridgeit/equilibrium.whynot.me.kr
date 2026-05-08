import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-4xl font-bold">ShortForm Strategy AI</h1>
      <p className="mt-4 text-gray-600">4단계 AI 인터뷰로 수익화 가능한 숏폼 계정 전략을 만듭니다.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/signin" className="rounded bg-black px-4 py-2 text-white">시작하기</Link>
        <Link href="/dashboard" className="rounded border px-4 py-2">데모 대시보드</Link>
      </div>
    </main>
  );
}
