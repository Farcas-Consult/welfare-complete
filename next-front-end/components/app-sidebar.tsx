"use client";

import * as React from "react";
import { IconShield } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { useAppSelector } from "@/store/hooks";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  getMainNavItems,
  getAdminNavItems,
  getDashboardUrl,
} from "@/lib/utils/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role;

  // Get role-based navigation items
  const navMainItems = getMainNavItems(userRole);
  const adminItems = getAdminNavItems(userRole);
  const dashboardUrl = getDashboardUrl(userRole);

  const userData = {
    name: user ? `${user.firstName} ${user.lastName}` : "Guest",
    email: user?.email || "guest@welfare.com",
    avatar: "",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href={dashboardUrl}>
                <IconShield className="size-6!" />
                <span className="text-lg font-semibold">Welfare System</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} pathname={pathname} />
        {adminItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Management
                  </div>
                </SidebarMenuItem>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={
                        pathname === item.url ||
                        pathname?.startsWith(`${item.url}/`)
                      }
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
