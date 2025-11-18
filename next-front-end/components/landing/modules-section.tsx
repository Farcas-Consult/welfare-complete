import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ModulesSection() {
  return (
    <section
      id="modules"
      aria-labelledby="modules-heading"
      className="w-full space-y-6 px-6 md:px-8 lg:px-12 xl:px-16"
    >
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="space-y-2">
          <h2
            id="modules-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            End-to-end modules for Welfare Operations
          </h2>
          <p className="max-w-3xl text-base text-muted-foreground">
            Each module is fully auditable, workflow-driven, and designed for
            maker-checker controls.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Member Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-xs text-muted-foreground">
              <p>Onboarding with KYC-lite and dependents.</p>
              <p>Plans, contribution bands, and membership status.</p>
              <p>Digital ID and secure document vault.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Contributions &amp; Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-xs text-muted-foreground">
              <p>Monthly billing, arrears aging, and holidays.</p>
              <p>Multiple payment channels with reconciliation.</p>
              <p>Auto-reconciliation with exception handling.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Claims &amp; Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-xs text-muted-foreground">
              <p>Bereavement and medical claim workflows.</p>
              <p>Eligibility rules, caps, and waiting periods.</p>
              <p>Documented approvals and payout tracking.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Interest-free Loans
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-xs text-muted-foreground">
              <p>Configurable products, fees, and tenures.</p>
              <p>Affordability checks and guarantors.</p>
              <p>Automated deductions and delinquency handling.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Meetings &amp; Governance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-xs text-muted-foreground">
              <p>Agenda builder, quorum rules, and role-based invites.</p>
              <p>Teleconference links, recording, and transcription.</p>
              <p>Minutes assistant with motions, resolutions, and actions.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Accounting, Audit &amp; Reporting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-xs text-muted-foreground">
              <p>Double-entry subledger and GL exports.</p>
              <p>Immutable audit logs and incident tracking.</p>
              <p>Dashboards for collections, arrears, claims, and loans.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
