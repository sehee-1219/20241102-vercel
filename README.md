# Signal Board

Supabase Auth and Next.js power this community board. Reading stays public, but posts and comments are created only by signed-in members.

## Quick Start

1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000`

## Environment Variables

`.env.local` needs:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://vzolyyrkqejeyybymuja.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

This repo includes `.env.example`, and local development can continue with `.env.local`.

## Supabase Setup

1. Open the Supabase Dashboard
2. Open SQL Editor
3. Run `supabase/schema.sql`

This schema now:

- creates `posts`
- creates `comments`
- links new rows to authenticated users
- keeps reads public
- limits inserts to signed-in members

## Auth Flow

- `Sign up` creates a password-based account with `username + display name + password`
- `Sign in` uses `username + password`
- `Log out` clears the session
- The app uses an internal generated email behind the scenes because Supabase password auth supports email or phone identities, not username identities directly
- Usernames are restricted to 3-20 lowercase English letters
- Disable Email Confirmations in Supabase Auth settings so signup completes immediately without email verification

## GitHub / Vercel

- The repository name is `20241102-vercel`
- On Vercel, keep the same environment variables and redeploy after changing them
