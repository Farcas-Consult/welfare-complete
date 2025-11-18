"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function AdminChartCardSkeleton() {
  return (
    <div className="border-border/50 rounded-lg border p-4 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-3 w-64" />
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
  );
}
