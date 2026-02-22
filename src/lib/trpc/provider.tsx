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
