import { HeroSection } from "@/components/landing/hero-section";
import { RolesSection } from "@/components/landing/roles-section";
import { ModulesSection } from "@/components/landing/modules-section";
import { ComplianceSection } from "@/components/landing/compliance-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex min-h-screen flex-col gap-16">
        <HeroSection />
        <RolesSection />
        <ModulesSection />
        <ComplianceSection />
      </main>
    </div>
  );
}
