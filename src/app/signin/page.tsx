import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-semibold">로그인 / 회원가입</h1>
      <p className="mt-2 text-sm text-gray-600">MVP에서는 익명으로 바로 프로젝트를 생성합니다.</p>
      <Link href="/projects/new" className="mt-6 inline-block rounded bg-black px-4 py-2 text-white">익명으로 계속</Link>
    </main>
  );
}
