import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[70vh] w-full flex-col justify-end overflow-hidden bg-gradient-to-br from-background via-background to-background">
      {/* Background media band */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[360px] w-[640px] rounded-3xl bg-primary/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-16 pt-10 md:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 xl:px-16">
        <div className="max-w-xl space-y-6">
          <Badge className="rounded-full px-3 py-1 text-xs font-medium">
            Welfare OS · For modern member communities
          </Badge>
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            A command center for{" "}
            <span className="text-primary">contributions, claims, loans</span>{" "}
            and meetings.
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            See your welfare fund in one view, from monthly contributions and
            arrears to open claims, loans, and upcoming meetings.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/dashboard">Open dashboard</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#modules">Browse modules</Link>
            </Button>
          </div>
        </div>

        {/* Visual tile strip */}
        <div className="flex w-full max-w-xl flex-row gap-4 lg:justify-end">
          <Card className="relative flex-1 overflow-hidden border-border/60 bg-background/80 backdrop-blur">
            <div className="relative h-40 w-full">
              <Image
                src="/globe.svg"
                alt="Members connected"
                fill
                className="object-contain p-4"
                priority
              />
            </div>
            <CardContent className="space-y-1 px-4 pb-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Live overview
              </p>
              <p className="text-sm">
                Members, contributions, claims, and loans in a single view.
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-1 flex-col gap-4">
            <Card className="flex-1 border-border/60 bg-background/90 backdrop-blur">
              <CardContent className="flex h-full flex-col justify-between p-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Approvals
                  </p>
                  <p className="text-sm">
                    Track claims and loan decisions with full history.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="flex-1 border-border/60 bg-background/90 backdrop-blur">
              <CardContent className="flex h-full flex-col justify-between p-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Meetings
                  </p>
                  <p className="text-sm">
                    Prepare, run, and document AGMs and committee sessions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
