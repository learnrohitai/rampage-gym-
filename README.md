# Mr. India 2026 — Rampage Gym

Registration site for the Mr. India 2026 bodybuilding championship: landing
page, 3-step registration with UPI QR payment, admin dashboard, and QR
check-in.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind · zod · react-hook-form ·
framer-motion · `jsqr`

## Local development

```bash
npm install
cp .env.example .env.local   # then edit the values
npm run dev
```

Useful scripts: `npm run build`, `npm run start`, `npm run typecheck`.

## Environment variables

Copy `.env.example` to `.env.local` locally, and add the same keys under
**Vercel → Project → Settings → Environment Variables**. They are *not* read
from `.env` in a deployment.

| Variable | Purpose | Required in production |
| --- | --- | --- |
| `ADMIN_USERNAME` | Admin dashboard login name | Yes |
| `ADMIN_PASSWORD` | Admin dashboard password | **Yes — change the default** |
| `ADMIN_SECRET` | Signs the admin session JWT | **Yes — must be a long random string** |
| `NEXT_PUBLIC_SITE_URL` | Base URL used in links | Recommended |

### Why `ADMIN_SECRET` matters

If it is missing the server silently falls back to the hardcoded dev string
`dev-secret-change-me`, so every deployment shares a guessable signing key —
anyone could forge an admin session. Set a long random value:

```bash
openssl rand -hex 32
```

`ADMIN_USERNAME` / `ADMIN_PASSWORD` fall back to `admin` / `MrIndia@2026`,
which is also what `.env.example` ships. Change both before going live.

## Roles and endpoints

**Public**

- `POST /api/register` — registration + receipt upload. Validates required
  category fields (weight class, height class, age) server-side.
- `GET /api/pass?regId=&phone=` — athlete pass lookup.
- `GET /api/pass/receipt?regId=&phone=` — athlete pass download.

`regId` is only `MIYY-` plus four digits (~9000 combinations), so both pass
endpoints require the registered mobile number as well. They return only the
fields the pass needs — never phone, email, or date of birth.

**Admin session required** (`mrindia_admin` cookie)

- `POST /api/admin/login`, `DELETE /api/admin/login`
- `GET /api/admin/registrations` — list, plus `?format=csv|json` export
- `PATCH /api/admin/registrations` — set `status` / `paymentStatus`
- `GET /api/admin/details/[regId]` — full registration record
- `GET /api/admin/receipt?file=` — receipt image (filename is basenameed)
- `GET /api/admin/qrcode?regId=` — receipt image for scanning

## Data storage

Registrations are a JSON file at `data/registrations.json` with uploaded
receipts in `data/uploads/`. Both are gitignored, and both are **ephemeral on
Vercel** — serverless filesystems reset between invocations and deployments,
so this is fine for a demo but not for real registrations. Move to a managed
database before taking live entries.

## Deployment

The Vercel production branch is `master`. Every push to `master` triggers a
build; build status is posted back to the GitHub commit.
