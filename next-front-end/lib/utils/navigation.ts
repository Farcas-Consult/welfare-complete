import {
  IconDashboard,
  IconUsers,
  IconCurrencyDollar,
  IconFileText,
  IconBuildingBank,
  IconCalendar,
  IconReport,
  IconSettings,
  IconUserCheck,
  IconHistory,
  type Icon,
} from "@tabler/icons-react";
import { WelfareRole } from "@/components/tables/types";

export interface NavItem {
  title: string;
  url: string;
  icon: Icon;
  roles?: WelfareRole[]; // If undefined, accessible to all authenticated users
}

// Main navigation items - accessible based on role
export const getMainNavItems = (role?: WelfareRole): NavItem[] => {
  const allItems: NavItem[] = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Members",
      url: "/dashboard/admin/members",
      icon: IconUsers,
      roles: ["admin", "treasurer", "secretary", "committee"],
    },
    {
      title: "Contributions",
      url: "/contributions",
      icon: IconCurrencyDollar,
      roles: ["admin", "treasurer", "member", "secretary"],
    },
    {
      title: "Claims",
      url: "/claims",
      icon: IconFileText,
      roles: ["admin", "treasurer", "secretary", "committee", "member"],
    },
    {
      title: "Loans",
      url: "/loans",
      icon: IconBuildingBank,
      roles: ["admin", "treasurer", "secretary", "committee", "member"],
    },
    {
      title: "Meetings",
      url: "/meetings",
      icon: IconCalendar,
      roles: ["admin", "secretary", "committee", "member"],
    },
  ];

  // Filter items based on role
  if (!role) return [];

  return allItems.filter((item) => !item.roles || item.roles.includes(role));
};

// Admin/Management items - only for specific roles
export const getAdminNavItems = (role?: WelfareRole): NavItem[] => {
  const allItems: NavItem[] = [
    {
      title: "Reports",
      url: "/reports",
      icon: IconReport,
      roles: ["admin", "treasurer", "auditor", "secretary"],
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: IconSettings,
      roles: ["admin"],
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: IconUserCheck,
      roles: ["admin"],
    },
    {
      title: "Audit Logs",
      url: "/admin/audit-logs",
      icon: IconHistory,
      roles: ["admin", "auditor"],
    },
  ];

  if (!role) return [];

  return allItems.filter((item) => !item.roles || item.roles.includes(role));
};

// Get role-specific dashboard URL
export const getDashboardUrl = (role?: WelfareRole): string => {
  if (!role) return "/dashboard";

  const roleDashboards: Record<WelfareRole, string> = {
    member: "/dashboard/member",
    treasurer: "/dashboard/treasurer",
    secretary: "/dashboard/secretary",
    committee: "/dashboard/committee",
    admin: "/dashboard/admin",
    auditor: "/dashboard/auditor",
  };

  return roleDashboards[role] || "/dashboard";
};
