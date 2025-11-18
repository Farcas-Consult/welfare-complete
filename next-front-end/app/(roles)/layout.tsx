"use client";

import { ReactNode, type CSSProperties } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { PageBreadcrumb } from "@/components/page-breadcrumb";

export default function RolesLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <PageBreadcrumb />
        <div className="flex flex-1 flex-col px-4 pb-6 pt-4 md:px-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
