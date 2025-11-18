"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Loan } from "../types/admin-types";
import { Progress } from "@/components/ui/progress";

interface AdminLoansCardProps {
  loans?: Loan[];
}

export function AdminLoansCard({ loans }: AdminLoansCardProps) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base">Loan Portfolio</CardTitle>
        <CardDescription>Outstanding balances by application.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(loans ?? []).map((loan) => {
          const progress =
            loan.totalAmount > 0
              ? Math.min(
                  100,
                  ((loan.totalAmount - (loan.outstandingBalance ?? 0)) / loan.totalAmount) * 100
                )
              : 0;

          return (
            <div key={loan.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold">{loan.loanNo}</p>
                  <p className="text-muted-foreground text-xs">{loan.memberId}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    KES {loan.outstandingBalance?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-muted-foreground text-xs capitalize">{loan.status}</p>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          );
        })}
        {(!loans || loans.length === 0) && (
          <p className="text-center text-sm text-muted-foreground">No active loans found.</p>
        )}
      </CardContent>
    </Card>
  );
}

