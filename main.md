## MEMESH AI GITHUB CODE REVIEWS
## versi sendiri

# Install Next.js And shadcn ui dengan pnpm

```bash
# Buat project Next.js baru
pnpm create next-app@latest memesh-code

# Atau jika ingin menggunakan TypeScript (disarankan)
pnpm create next-app@latest nama-project --typescript
```

Selama proses instalasi, Anda akan ditanya beberapa opsi:
- next js 16
· Apakag ingin menggunakan typescript (ya)
· Apakah ingin menggunakan ESLint? (Ya)
· Apakah ingin menggunakan React Compiler (No)
· Apakah ingin menggunakan Tailwind CSS? (Ya, karena shadcn membutuhkan Tailwind)
· Apakah ingin menggunakan src/ directory? (Ya)
· Apakah ingin menggunakan App Router? (Ya, disarankan)
· Apakah ingin mengkustomisasi import alias? (No, Default: @/*)

# Install shadcn and Tambahkan komponen 
- pnpm dlx shadcn@latest init
- pnpm dlx shadcn@latest add button avatar input label accordion alert alert-dialog aspect-ratio badge breadcrumb button-group calendar card carousel chart checkbox collapsible command context-menu dialog drawer dropdown-menu empty field form hover-card input-group input-otp item menubar navigation-menu select sheet sidebar skeleton slider sonner spinner switch table tabs textarea toggle toggle-group tooltip kbd separator scroll-area

# install prisma and setup
- pnpm add -D prisma@6
- pnpm add @prisma/client@6
- pnpm prisma init --datasource-provider postgresql

# install tRPC and setup
- pnpm add @trpc/server @trpc/client @trpc/react-query @tanstack/react-query superjson zod

- add folder src/server/api/trpc.ts
```ts
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "../db";
    
export const createTRPCContext = async (options: {headers: Headers }) => {
    return {
        db,
        headers: options.headers
    };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({shape, error}) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
            }
        };
    },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

```
- add folder src/server/db/index.ts
```ts
import { PrismaClient } from "@prisma/client";

const createPrismaClient = () => {
    return new PrismaClient();
};

const globalPrismaClient = globalThis as unknown as {
    prisma: ReturnType<typeof createPrismaClient> | undefined
};

export const db = globalPrismaClient.prisma ?? createPrismaClient();

```
- add folder src/server/api/root.ts
```ts
import { createCallerFactory, createTRPCRouter, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
    health: publicProcedure.query(() => {
        return { status: "ok", timestamps: Date.now() };
    }),
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);

```
- add folder src/app/api/[trpc]/route.ts
```ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/api/root";

```
### ---- structure folder app ------
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
 ┃ ┃ ┗ 📂 ui
 ┃ ┣ 📂 lib
 ┃ ┃ ┗ 📜 utils.ts
 ┃ ┗ 📂 server
 ┃ ┃ ┣ 📂 api
 ┃ ┃ ┃ ┣ 📜 root.ts
 ┃ ┃ ┃ ┗ 📜 trpc.ts
 ┃ ┃ ┗ 📂 db
 ┃ ┃ ┃ ┗ 📜 index.ts
 ┣ 📂 public
 ┃ ┣ 🖼️ next.svg
 ┃ ┗ 🖼️ vercel.svg
 ┣ 📄 .env
 ┣ 📄 .env.example
 ┣ 📄 .eslintrc.json
 ┣ 📄 .gitignore
 ┣ 📄 components.json
 ┣ 📄 next-env.d.ts
 ┣ 📄 next.config.ts
 ┣ 📄 package.json
 ┣ 📄 pnpm-lock.yaml
 ┣ 📄 postcss.config.mjs
 ┣ 📄 README.md
 ┣ 📄 tailwind.config.ts
 ┗ 📄 tsconfig.json
```
