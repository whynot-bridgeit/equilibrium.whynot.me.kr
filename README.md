# ShortForm Strategy AI (MVP)

Next.js + Supabase + OpenAI 기반 숏폼 계정 전략 SaaS MVP입니다.

## 핵심 기능
- 4단계 AI 인터뷰 (Self Discovery → Concept → Monetization → Execution)
- 단계별 답변 저장 (Supabase)
- 최종 리포트 자동 생성: **숏폼 계정 비즈니스 런칭 전략서**
- 마크다운 복사/내보내기 + PDF/Notion/Sheets 버튼 플레이스홀더

## 환경 변수
`.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

## 로컬 실행
```bash
npm install
npm run dev
```

## DB 설정
Supabase SQL Editor에서 아래 순서로 실행:
1. `supabase/schema.sql`
2. (선택) `supabase/seed.sql`

## API 엔드포인트
- `POST /api/createProject`
- `POST /api/saveInterviewAnswer`
- `POST /api/getProjectAnswers`
- `POST /api/generateStepOutput`
- `POST /api/generateFinalReport`
- `POST /api/exportMarkdown`

## 배포 (Vercel)
1. GitHub 저장소 연결
2. Environment Variables 등록
3. Build Command: `npm run build`
4. Output: Next.js default
5. 배포 후 Supabase CORS/URL 점검
