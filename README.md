MEMESH AI GITHUB CODE REVIEWS

🚀 Install Next.js dan shadcn/ui dengan pnpm

Dokumentasi MEMESH untuk membuat proyek Next.js 16 dengan TypeScript, Tailwind CSS, shadcn/ui, Prisma, dan tRPC menggunakan pnpm.

---

📋 Prasyarat

· Node.js versi 18.17 atau lebih baru
· pnpm terinstal (npm install -g pnpm)

---

🛠️ Langkah Instalasi

1. Buat Proyek Next.js

```bash
pnpm create next-app@latest memesh-code
```

Selama proses instalasi, jawab pertanyaan berikut:

Pertanyaan Jawaban
Apakah ingin menggunakan TypeScript? Ya
Apakah ingin menggunakan ESLint? Ya
Apakah ingin menggunakan React Compiler? Tidak
Apakah ingin menggunakan Tailwind CSS? Ya (shadcn/ui membutuhkan Tailwind)
Apakah ingin menggunakan src/ directory? Ya
Apakah ingin menggunakan App Router? Ya
Apakah ingin mengkustomisasi import alias? Tidak (gunakan default @/*)

2. Masuk ke Direktori Proyek

```bash
cd memesh-code
```

3. Instal dan Inisialisasi shadcn/ui

```bash
# Inisialisasi shadcn/ui
pnpm dlx shadcn@latest init
```

Pilih konfigurasi:

· Style: default
· Base color: slate (atau sesuai keinginan)
· CSS variables: Yes
· Tailwind CSS file: app/globals.css
· Components directory: @/components/ui

4. Tambahkan Komponen shadcn/ui

Jalankan perintah berikut untuk menambahkan berbagai komponen yang umum digunakan:

```bash
pnpm dlx shadcn@latest add button avatar input label accordion alert alert-dialog aspect-ratio badge breadcrumb button-group calendar card carousel chart checkbox collapsible command context-menu dialog drawer dropdown-menu empty field form hover-card input-group input-otp item menubar navigation-menu select sheet sidebar skeleton slider sonner spinner switch table tabs textarea toggle toggle-group tooltip kbd separator scroll-area
```

Catatan: Anda dapat menambahkan komponen secara bertahap sesuai kebutuhan. Perintah di atas akan menambahkan semua komponen sekaligus.

5. Instal Prisma

```bash
# Install Prisma versi 6
pnpm add -D prisma@6
pnpm add @prisma/client@6 next-themes axios better-auth

# Inisialisasi Prisma dengan database PostgreSQL
pnpm prisma init --datasource-provider postgresql
```

6. Instal tRPC dan Dependencies

```bash
pnpm add @trpc/server @trpc/client @trpc/react-query @tanstack/react-query superjson zod
```
---

🔧 Konfigurasi File Penting dan structure buat urutan

# src/server/db/index.ts – Koneksi Database (Prisma)

```ts
import { PrismaClient } from "@prisma/client";

const createPrismaClient = () => {
  return new PrismaClient();
};

const globalPrismaClient = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalPrismaClient.prisma ?? createPrismaClient();
```

# src/server/api/trpc.ts – Inisialisasi tRPC

```ts
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "../db";

export const createTRPCContext = async (options: { headers: Headers }) => {
  return {
    db,
    headers: options.headers,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
```

# src/server/api/root.ts – Router Utama

```ts
import { createCallerFactory, createTRPCRouter, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => {
    return { status: "ok", timestamp: Date.now() };
  }),
  // Tambahkan router lain di sini
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
```

# src/app/api/trpc/[trpc]/route.ts – API Route Handler

```ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

const handler = (req: Request) => fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
    onError: console.error(" error hanlder /api/trpc/route.ts")
});

export { handler as GET, handler as POST };

```

# src/lib/trpc/client.ts 
```ts
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/api/root";

export const trpc = createTRPCReact<AppRouter>();

```

# src/lib/trpc/provider.tsx 
```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import superjson from "superjson";
import React, { useState } from "react";
import { trpc } from "./client";
import { httpBatchLink } from "@trpc/client";

function getBaseUrl() {
    if (typeof window !== "undefined") return "";
    if (process.env.PUBLIC_NEXT_BASE_URL) return `https://${process.env.PUBLIC_NEXT_BASE_URL}`;
    return `http://localhost:${process.env.NEXT_PUBLIC_PORT ?? 3000}`;
};

export function TRPCProvider({ children } : { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 1000,
                refetchOnWindowFocus: false,
            },
        },
    }));
    
    const [trpcClient] = useState(() => trpc.createClient({
        links: [
            httpBatchLink({
                url: `${getBaseUrl()}/api/trpc`,
                transformer: superjson
            }),
        ],
    }));
    
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </trpc.Provider>
    );
};

```

# src/lib/trpc/index.ts
```ts
export { trpc } from "./client";
export { TRPCProvider } from "./provider";
```

# src/components/health-check.tsx 
```tsx
"use client";

import { trpc } from "@/lib/trpc";
import { Badge } from '@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function HealthCheck() {
    const { data, isLoading, error } = trpc.health.useQuery();
    
    if (isLoading) return <Skeleton className="h-6 w-24" />;
    
    if (error) return <Badge variant="destructive">Oono API Error</Badge>
    
    return <Badge variant="secondary">API: {data?.status} {data?.timestamps} - Yeey!</Badge>
    
};

```

# src/server/auth/index.ts
```ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "../db";

export const auth = betterAuth({
    database: prismaAdapater(db, {
        provider: "postgresql"
    }),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        github: {
            clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
            clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET!
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 hari/day expired session
        updateAge: 60 * 60 * 24, // 24 jam/hours
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5 // 5 menit/minutes
        }
    },
    trustedOrigins: [process.env.NEXT_PUBLIC_BASE_URL!]
});

export type Session = typeof auth.$Infer.Session;

```

# src/app/api/auth/[...all]/route.ts
```tsx
import { auth } from "@/server/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

# memesh-code/prisma/schema.prisma
```
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id
  name          String
  email         String
  emailVerified Boolean
  image         String?
  createdAt     DateTime
  updatedAt     DateTime
  sessions      Session[]
  accounts      Account[]

  @@unique([email])
  @@map("user")
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String
  createdAt DateTime
  updatedAt DateTime
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@map("session")
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime
  updatedAt             DateTime

  @@map("account")
}

model Verification {
  id         String    @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime?
  updatedAt  DateTime?

  @@map("verification")
}
``` 
# run : npx prisma db push

# src/lib/auth-client.ts
```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL!,
});

export const {
    signIn,
    signUp,
    signOut,
    useSession,
    getSession
} = authClient();

```
---

📁 Struktur Folder Proyek full 

Setelah semua langkah di atas, struktur folder proyek akan tampak seperti berikut:

```
📦 memesh-code
 ┣ 📂 src
 ┃ ┣ 📂 app
 ┃ ┃ ┣ 📂 api
 ┃ ┃ ┃ ┗ 📂 trpc
 ┃ ┃ ┃ ┃ ┗ 📂 [trpc]
 ┃ ┃ ┃ ┃ ┃ ┗ 📜 route.ts
 ┃ ┃ ┣ 📜 favicon.ico
 ┃ ┃ ┣ 📜 globals.css
 ┃ ┃ ┣ 📜 layout.tsx
 ┃ ┃ ┗ 📜 page.tsx
 ┃ ┣ 📂 components
 ┃ ┃ ┗ 📂 ui                # komponen shadcn/ui
 ┃ ┣ 📂 lib
 ┃ ┃ ┗ 📜 utils.ts          # utility functions (dari shadcn)
 ┃ ┗ 📂 server
 ┃ ┃ ┣ 📂 api
 ┃ ┃ ┃ ┣ 📜 root.ts
 ┃ ┃ ┃ ┗ 📜 trpc.ts
 ┃ ┃ ┗ 📂 db
 ┃ ┃ ┃ ┗ 📜 index.ts
 ┣ 📂 public
 ┃ ┣ 🖼️ next.svg
 ┃ ┗ 🖼️ vercel.svg
 ┣ 📜 .env
 ┣ 📜 .env.example
 ┣ 📜 .eslintrc.json
 ┣ 📜 .gitignore
 ┣ 📜 components.json        # konfigurasi shadcn/ui
 ┣ 📜 next-env.d.ts
 ┣ 📜 next.config.ts
 ┣ 📜 package.json
 ┣ 📜 pnpm-lock.yaml
 ┣ 📜 postcss.config.mjs
 ┣ 📜 README.md
 ┣ 📜 tailwind.config.ts
 ┗ 📜 tsconfig.json
```

