# DermaVision AI: front end

Next.js (App Router, TypeScript) and Tailwind CSS. It talks to the FastAPI backend in `../backend`.

## Run it

```bash
npm install
cp .env.local.example .env.local      # Windows: copy .env.local.example .env.local
npm run dev                            # http://localhost:3000
```

Start the backend first (`uvicorn app.main:app --reload --env-file .env` in `../backend`).
Open the site through `http://localhost:3000`. The backend only allows that origin by default
(`ALLOWED_ORIGINS` in the backend `.env`), so `127.0.0.1:3000` will be blocked.

## Test and build

```bash
npm test          # component tests with a mocked backend
npm run build     # type check and production build
```

## Deploy later

Set `NEXT_PUBLIC_API_URL` to the public https URL of the backend (for example on Vercel), and add the
site's address to `ALLOWED_ORIGINS` in the backend settings. An https site cannot call an http backend.
