import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RolesSection() {
  return (
    <section
      aria-labelledby="roles-heading"
      className="w-full space-y-6 px-6 md:px-8 lg:px-12 xl:px-16"
    >
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="space-y-2">
          <h2
            id="roles-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Built for every role in the welfare lifecycle
          </h2>
          <p className="max-w-3xl text-base text-muted-foreground">
            Members, finance, committee, secretariat, admins, and auditors all
            work from the same source of truth with the right level of access.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Members &amp; Portal
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              View statements, apply for claims and loans, manage dependents,
              receive notices, and vote on resolutions from a mobile-friendly
              portal.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Finance &amp; Welfare Committee
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Automate contributions, handle payouts and reconciliations,
              approve claims/loans with maker-checker controls, and export
              ledgers to accounting.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Admins &amp; Auditors
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Configure products and limits, manage roles and permissions, and
              provide auditors with read-only access to immutable logs and
              reports.
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
