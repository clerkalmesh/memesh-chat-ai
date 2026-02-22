"use client";

import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function HealthCheck() {
  const { data, isLoading, error } = trpc.health.useQuery();

  if (isLoading) return <Skeleton className="h-6 w-24" />;
  if (error) return <Badge variant="destructive">Ooono kka API Error</Badge>;

  return (
    <Badge variant="secondary">
      API: {data?.status} - {new Date(data?.timestamp!).toLocaleString()} - Yeey🥳
    </Badge>
  );
}