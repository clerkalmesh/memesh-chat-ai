MEMESH AI GITHUB CODE REVIEWS

🚀 Install Next.js, shadcn/ui, Prisma, tRPC, dan Better Auth dengan pnpm

Dokumentasi lengkap untuk membuat proyek Next.js 16 dengan TypeScript, Tailwind CSS, shadcn/ui, Prisma ORM, tRPC, dan Better Auth. Semua dikelola menggunakan pnpm.

---

📋 Prasyarat

· Node.js versi 18.17 atau lebih baru
· pnpm terinstal global (npm install -g pnpm)
· PostgreSQL (lokal atau remote) untuk database

---

🛠️ Langkah Instalasi

1. Buat Proyek Next.js

```bash
pnpm create next-app@latest memesh-code
```

Selama proses instalasi, jawab pertanyaan berikut:

Pertanyaan Jawaban
Apakah ingin menggunakan TypeScript? ✅ Ya
Apakah ingin menggunakan ESLint? ✅ Ya
Apakah ingin menggunakan React Compiler? ❌ Tidak
Apakah ingin menggunakan Tailwind CSS? ✅ Ya (shadcn/ui membutuhkan Tailwind)
Apakah ingin menggunakan src/ directory? ✅ Ya
Apakah ingin menggunakan App Router? ✅ Ya
Apakah ingin mengkustomisasi import alias? ❌ Tidak (gunakan default @/*)

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

Jalankan perintah berikut untuk menambahkan berbagai komponen yang umum digunakan (bisa ditambahkan bertahap atau sekaligus):

```bash
pnpm dlx shadcn@latest add button avatar input label accordion alert alert-dialog aspect-ratio badge breadcrumb button-group calendar card carousel chart checkbox collapsible command context-menu dialog drawer dropdown-menu empty field form hover-card input-group input-otp item menubar navigation-menu select sheet sidebar skeleton slider sonner spinner switch table tabs textarea toggle toggle-group tooltip kbd separator scroll-area
```

5. Instal Prisma dan Better Auth

```bash
# Prisma versi 6
pnpm add -D prisma@6
pnpm add @prisma/client@6

# Better Auth dan dependencies tambahan
pnpm add better-auth @better-auth/next-js axios next-themes

# Inisialisasi Prisma dengan PostgreSQL
pnpm prisma init --datasource-provider postgresql
```

6. Instal tRPC dan Dependencies

```bash
pnpm add @trpc/server @trpc/client @trpc/react-query @tanstack/react-query superjson zod
```

---

🔧 Konfigurasi File Penting

📁 prisma/schema.prisma

Buat model User, Session, Account, dan Verification untuk Better Auth.

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

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

Setelah itu, jalankan:

```bash
npx prisma db push
```

Catatan: Untuk production, gunakan prisma migrate dev agar migrasi tersimpan.

---

📁 src/server/db/index.ts – Koneksi Database (Prisma)

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

---

📁 src/server/api/trpc.ts – Inisialisasi tRPC

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

---

📁 src/server/api/root.ts – Router Utama tRPC

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

---

📁 src/app/api/trpc/[trpc]/route.ts – API Route Handler tRPC

```ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
    onError: (error) => console.error("Error in /api/trpc:", error),
  });

export { handler as GET, handler as POST };
```

---

📁 src/lib/trpc/client.ts – tRPC React Client

```ts
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/api/root";

export const trpc = createTRPCReact<AppRouter>();
```

---

📁 src/lib/trpc/provider.tsx – Provider tRPC + React Query

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import superjson from "superjson";
import React, { useState } from "react";
import { trpc } from "./client";
import { httpBatchLink } from "@trpc/client";

function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.PUBLIC_NEXT_BASE_URL) return `https://${process.env.PUBLIC_NEXT_BASE_URL}`;
  return `http://localhost:${process.env.NEXT_PUBLIC_PORT ?? 3000}`;
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
```

---

📁 src/lib/trpc/index.ts – Barrel Export

```ts
export { trpc } from "./client";
export { TRPCProvider } from "./provider";
```

---

📁 src/server/auth/index.ts – Konfigurasi Better Auth

```ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "../db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 hari
    updateAge: 60 * 60 * 24, // 24 jam
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 menit
    },
  },
  trustedOrigins: [process.env.NEXT_PUBLIC_BASE_URL!],
});

export type Session = typeof auth.$Infer.Session;
```

---

📁 src/app/api/auth/[...all]/route.ts – Route Handler Better Auth

```tsx
import { auth } from "@/server/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

---

📁 src/lib/auth-client.ts – Client Side Better Auth

```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!,
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
```

---

📁 src/components/health-check.tsx – Contoh Komponen dengan tRPC

```tsx
"use client";

import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function HealthCheck() {
  const { data, isLoading, error } = trpc.health.useQuery();

  if (isLoading) return <Skeleton className="h-6 w-24" />;
  if (error) return <Badge variant="destructive">API Error</Badge>;

  return (
    <Badge variant="secondary">
      API: {data?.status} - {new Date(data?.timestamp!).toLocaleString()} ✅
    </Badge>
  );
}
```

# src/app/(auth)/sign-in/page.tsx
```tsx
"use client";

import React, {useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardHeader,
    CardDescription,
    CardTile,
    CardContent
} from "@/components/ui/card";
import { Github } from "lucide-react";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            const result = await signIn.email({
                email, 
                password
            });
            
            if (result.error) {
                setError(result.error.message || "An error occurred");
                setLoading(false);
            } else {
                router.push("/repos");
            }
        } catch (err) {
            console.error("handler email login error: ", err);
            setError(err);
            setLoading(false);
        }
    };
    
    const handleGithubLogin = async () => {
        setError("");
        setLoading(true);
        
        try {
            await signIn.social({
                provider: "github",
                callbackURL: "/repos"
            });
            
            setLoading(false);
        } catch (err) {
            console.error("handle github login error: ", err);
            setError(err);
            setLoading(false);
        }
    };
     
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-600 font-orbitron ">BersiapLah untuk Login Yeey!</CardTitle>
                    <CardDescription className="font-orbitron text-muted-foreground" >Silakan kamu pilih login dengan email atau Dengan github account kamu yeey!</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                    <Button className="w-full" disabled={loading} onClick={handleGithubLogin}>
                        <Github className="text-white mr-2 size-4" />
                        Login dengan github aja aaa?
                    </Button>
                    
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full"/>
                        </div>
                        
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Atau login dengan email aja gituee</span>
                        </div>
                    </div>
                    
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Dot Com Yeey!</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Masukan email.dot.com nya gituee punya..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password Rahasia Yeey!</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="rahasia ruang bawah tanah gituee..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        
                        {error && <p className="text-red-500 ">{error}</p>}
                        
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? " Loading yeey" : "Gas Login"}
                        </Button>
                    </form>
                    
                    <p className="text-center text-sm ">
                        <span className=" text-yellow-500">Warning Yeey!</span>
                        Belum punya accounts? Yaelaa kasian abiess dee
                        langcung aja mendaftar gituee 
                        <Link className="text-blue-500" href="/sign-up">Daftar</Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

```

```tsx


```

```tsx


```

```tsx


```

```tsx


```

```tsx


```

---

📁 src/app/layout.tsx – Integrasi Provider

Pastikan layout membungkus aplikasi dengan TRPCProvider.

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Memesh Code",
  description: "Generated by MEMESH AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
```

---

📁 Struktur Folder Lengkap

Setelah semua langkah di atas, struktur folder proyek akan tampak seperti berikut:

```
📦 memesh-code
 ┣ 📂 prisma
 ┃ ┗ 📜 schema.prisma
 ┣ 📂 public
 ┃ ┣ 🖼️ next.svg
 ┃ ┗ 🖼️ vercel.svg
 ┣ 📂 src
 ┃ ┣ 📂 app
 ┃ ┃ ┣ 📂 api
 ┃ ┃ ┃ ┣ 📂 auth
 ┃ ┃ ┃ ┃ ┗ 📂 [...all]
 ┃ ┃ ┃ ┃ ┃ ┗ 📜 route.ts
 ┃ ┃ ┃ ┗ 📂 trpc
 ┃ ┃ ┃ ┃ ┗ 📂 [trpc]
 ┃ ┃ ┃ ┃ ┃ ┗ 📜 route.ts
 ┃ ┃ ┣ 📜 favicon.ico
 ┃ ┃ ┣ 📜 globals.css
 ┃ ┃ ┣ 📜 layout.tsx
 ┃ ┃ ┗ 📜 page.tsx
 ┃ ┣ 📂 components
 ┃ ┃ ┣ 📂 ui               # komponen shadcn/ui
 ┃ ┃ ┃ ┣ 📜 button.tsx
 ┃ ┃ ┃ ┣ 📜 ...
 ┃ ┃ ┃ ┗ 📜 ...
 ┃ ┃ ┗ 📜 health-check.tsx
 ┃ ┣ 📂 lib
 ┃ ┃ ┣ 📂 trpc
 ┃ ┃ ┃ ┣ 📜 client.ts
 ┃ ┃ ┃ ┣ 📜 index.ts
 ┃ ┃ ┃ ┗ 📜 provider.tsx
 ┃ ┃ ┣ 📜 auth-client.ts
 ┃ ┃ ┗ 📜 utils.ts          # dari shadcn
 ┃ ┗ 📂 server
 ┃ ┃ ┣ 📂 api
 ┃ ┃ ┃ ┣ 📜 root.ts
 ┃ ┃ ┃ ┗ 📜 trpc.ts
 ┃ ┃ ┣ 📂 auth
 ┃ ┃ ┃ ┗ 📜 index.ts
 ┃ ┃ ┗ 📂 db
 ┃ ┃ ┃ ┗ 📜 index.ts
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

---

🌐 Environment Variables

Buat file .env di root proyek dan isi dengan variabel berikut (sesuaikan dengan konfigurasi Anda):

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/memesh-code"

# Better Auth
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-min-32-chars"  # untuk session encryption (jika dipakai)

# OAuth (opsional)
NEXT_PUBLIC_GITHUB_CLIENT_ID="your-github-client-id"
NEXT_PUBLIC_GITHUB_CLIENT_SECRET="your-github-client-secret"

# Port (opsional, default 3000)
NEXT_PUBLIC_PORT=3000
```
