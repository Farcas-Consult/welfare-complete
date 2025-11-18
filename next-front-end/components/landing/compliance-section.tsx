export function ComplianceSection() {
  return (
    <section
      aria-labelledby="compliance-heading"
      className="w-full space-y-4 border-t border-border px-6 pt-8 text-sm md:px-8 lg:px-12 xl:px-16"
    >
      <div className="mx-auto w-full max-w-7xl space-y-4">
        <h2
          id="compliance-heading"
          className="text-xl font-bold tracking-tight sm:text-2xl"
        >
          Compliance, privacy &amp; risk controls by design
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li>• Encryption in transit and at rest for PII.</li>
            <li>
              • Fine-grained roles, maker-checker on payouts &amp; config.
            </li>
            <li>• Data retention policies and right-to-erasure workflows.</li>
          </ul>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li>• Immutable audit trail with export for auditors.</li>
            <li>• Access and incident logs with anomaly monitoring.</li>
            <li>• Optional tokenization for sensitive identifiers.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
