"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { RoleProtectedRoute } from "@/components/auth/role-protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MemberDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params?.id as string;

  useEffect(() => {
    if (searchParams.get("edit") === "true" && id) {
      router.replace(`/dashboard/admin/members/${id}/edit`);
    }
  }, [id, router, searchParams]);

  return (
    <RoleProtectedRoute
      allowedRoles={["admin", "treasurer", "secretary", "committee"]}
    >
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Member Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Member profile details for <span className="font-mono">{id}</span>{" "}
            will appear here.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link href={`/dashboard/admin/members/${id}/edit`}>
                Edit Member
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/admin/members">Back to list</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </RoleProtectedRoute>
  );
}

