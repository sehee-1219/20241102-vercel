# Signal Board

Supabase와 Next.js로 만든 공개형 게시판입니다. 게시글 작성과 댓글 작성이 모두 가능하도록 구성했습니다.

## Quick Start

1. `npm install`
2. `npm run dev`
3. 브라우저에서 `http://localhost:3000` 열기

## Environment Variables

`.env.local` 에 아래 값이 필요합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://fppakfwjnflpraokzvqi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

현재 저장소에는 예시 템플릿으로 `.env.example` 을 포함했고, 로컬 실행용 `.env.local` 은 이미 구성했습니다.

## Supabase Setup

1. Supabase Dashboard로 이동
2. SQL Editor 열기
3. `supabase/schema.sql` 내용 실행

이 스키마는 아래 항목을 만듭니다.

- `posts` 테이블
- `comments` 테이블
- 공개 읽기/쓰기용 RLS 정책

## GitHub / Vercel

- 저장소명은 폴더명을 URL 친화적으로 바꾼 `20241102-vercel` 기준으로 맞췄습니다.
- Vercel 배포 시에도 같은 환경변수 두 개를 등록하면 됩니다.
