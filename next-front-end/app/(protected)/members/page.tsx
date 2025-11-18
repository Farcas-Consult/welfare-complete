"use client";

import Link from "next/link";
import { IconUserPlus } from "@tabler/icons-react";
import { GenericTable } from "@/components/tables/generic-table";
import { useGetMembers } from "./hooks/useMembersHook";
import { useWelfareMemberColumns } from "@/components/tables/table-columns/welfare-member-table-columns";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";

export default function MembersPage() {
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role || "member";

  const columns = useWelfareMemberColumns();
  const {
    data,
    pagination,
    setPagination,
    isLoading,
    pageCount,
  } = useGetMembers();

  // Only show create button for roles that can create members
  const canCreateMember = ["admin", "treasurer", "secretary", "committee"].includes(role);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <h2 className="text-2xl font-bold">Members</h2>
        {canCreateMember && (
          <Link href="/members/create">
            <Button>
              <IconUserPlus className="mr-2 size-4" />
              Create Member
            </Button>
          </Link>
        )}
      </div>
      <GenericTable
        data={data}
        columns={columns}
        withFilters={true}
        withPagination={true}
        role={role}
        pending={isLoading}
        tableType="welfare_member"
        pagination={pagination}
        setPagination={setPagination}
        pageCount={pageCount}
      />
    </div>
  );
}

