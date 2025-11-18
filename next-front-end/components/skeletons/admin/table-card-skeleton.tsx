"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface TableCardSkeletonProps {
  rows?: number;
}

export function AdminTableCardSkeleton({ rows = 5 }: TableCardSkeletonProps) {
  return (
    <div className="border-border/50 rounded-lg border p-4">
      <div className="mb-4 space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-56" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="border-border/40 flex items-center justify-between rounded-md border px-3 py-2"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

