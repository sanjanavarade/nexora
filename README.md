# 🎥 Nexora — Live Streaming Platform (Ongoing)

Nexora is a modern **live streaming platform** built with **Next.js 14 (App Router)**. It features real-time streaming (RTMP/WHIP via OBS), auth, channel management, chat, webhooks, and a scalable Postgres + Prisma backend.

> **Status:** Active development • PRs welcome

---

## ✨ Features

- 🔴 **Live Broadcasting** via **RTMP** (and **WHIP** where supported) using OBS
- 🧑‍💻 **Auth** (email/OAuth) and creator **channel management**
- 💬 **Real-time chat** (WebSocket/SSE ready) and viewer interactions
- 🗄️ **PostgreSQL + Prisma** schema with migrations & seed
- 🔔 **Webhooks** for stream lifecycle & events
- 🌐 **Local tunnels** (ngrok) for webhook testing
- 📱 **Responsive UI** with Tailwind CSS & shadcn/ui
- 🚀 Deploy-ready for **Vercel** (frontend) & **Railway/Render/Fly.io** (RTMP server if used)

---

## 🧱 Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js Route Handlers (API), Node.js, Prisma, Zod
- **Database:** PostgreSQL
- **Auth:** NextAuth (Auth.js)
- **Streaming:** RTMP/WHIP (via OBS); optional Node media server or cloud RTMP service
- **Tunnels:** ngrok / Cloudflared
- **Deploy:** Vercel, Railway/Render (optional media server)

---

## 📦 Getting Started

### 1) Clone & Install
```bash
git clone https://github.com/your-username/nexora.git
cd nexora
pnpm install   # or npm i / yarn
```
2) Environment Variables

Create a .env in the project root:
```bash
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate_a_strong_secret"

# OAuth (optional)
GITHUB_ID=""
GITHUB_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Webhooks
WEBHOOK_SECRET="your_webhook_secret"

# Streaming (example for Node Media Server OR external RTMP service)
RTMP_INGEST_URL="rtmp://localhost/live"
WHIP_INGEST_URL="http://localhost:8080/whip"   # if using WHIP

# App
APP_URL="http://localhost:3000"
```
3) Database
```bash
pnpm prisma generate
pnpm prisma migrate dev --name init
# (optional) Seed
pnpm prisma db seed
```
📁 Project Structure
```bash
nexora/
├─ app/
│  ├─ (marketing)/           # landing / docs
│  ├─ (dashboard)/           # creator dashboard (protected)
│  ├─ api/
│  │  ├─ auth/[...nextauth]/route.ts   # Auth.js
│  │  ├─ webhooks/route.ts             # webhook handler
│  │  └─ stream/route.ts               # start/stop, tokens, etc.
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/                # UI components (shadcn/ui)
├─ lib/                       # utils (auth, db, validations)
├─ prisma/
│  └─ schema.prisma
├─ public/
├─ styles/
├─ .env
├─ package.json
└─ README.md
```

🗃️ Prisma Schema (snippet)
```bash
// prisma/schema.prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  accounts  Account[]
  sessions  Session[]
  channel   Channel?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Channel {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  title       String   @default("Untitled Channel")
  description String? 
  streamKey   String   @unique
  isLive      Boolean  @default(false)
  stream      Stream?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Stream {
  id          String   @id @default(cuid())
  channelId   String   @unique
  channel     Channel  @relation(fields: [channelId], references: [id])
  startedAt   DateTime?
  endedAt     DateTime?
  viewers     Int      @default(0)
}

model ChatMessage {
  id        String   @id @default(cuid())
  channelId String
  channel   Channel  @relation(fields: [channelId], references: [id])
  userId    String?
  content   String
  createdAt DateTime @default(now())
}

// Auth.js tables (if using Prisma adapter)
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id])

  @@unique([provider, providerAccountId])
}
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id])
}
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}
```
🔐 Authentication (Auth.js)

-Email/password or OAuth (GitHub/Google) via Auth.js (NextAuth)
-Protect dashboard routes with auth() in Server Components
-Use Prisma Adapter for Auth.js to persist users/sessions

🌊 Streaming Setup (OBS + RTMP/WHIP)

You can:
Run your own RTMP server (e.g., Node Media Server / NGINX RTMP), or
Use a cloud RTMP ingest provider.
A) OBS Settings (RTMP)
Settings → Stream
Service: Custom...
Server: rtmp://<your-ingest-host>/live
Stream Key: (creator’s streamKey from Nexora dashboard)

B) OBS Settings (WHIP) (if supported)
Use a WHIP plugin / output
WHIP URL: http://<your-whip-host>/whip
Auth headers/tokens if required

🌍 Webhooks & Local Tunnels

Use webhooks to mark stream start/stop, chat moderation events, etc.
Local testing with ngrok:
```bash
ngrok http 3000
# Update NEXTAUTH_URL / APP_URL to https URL given by ngrok if needed
```
Configure your webhook provider to call:
```bash
php-template
Copy code
POST https://<your-ngrok>.ngrok.io/api/webhooks
Header: X-Webhook-Secret: <WEBHOOK_SECRET>
```
✅ Development Checklist

 -Auth flows (register, login, OAuth)
 -Channel creation & stream key generation
 -Start/Stop stream (update isLive, startedAt/endedAt)
 -Real-time chat (WS/SSE)
-Webhooks (ingest start/stop)
 -Viewer counts & basic analytics
 -Creator dashboard (title, description, moderation)
 -Responsive UI (mobile-first)

📦 Deployment
-Frontend: Vercel (set env vars)
-Database: Railway / Render / Neon / Supabase (Postgres)
-RTMP/WHIP: Self-hosted (Railway/Render/Fly) or external provider
-Run pnpm build && pnpm start in production. Ensure DATABASE_URL, -NEXTAUTH_URL, and secrets are set.

🤝 Contributing
1.Fork the repo
2.Create a feature branch: feat/your-feature
3.Commit with clear messages
4.Open a PR

