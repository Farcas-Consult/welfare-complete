"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface ListCardSkeletonProps {
  items?: number;
}

export function AdminListCardSkeleton({ items = 4 }: ListCardSkeletonProps) {
  return (
    <div className="border-border/50 rounded-lg border p-4 space-y-3">
      <div className="space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-3 w-60" />
      </div>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="space-y-2 rounded-md border border-border/40 p-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

