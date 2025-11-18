"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { membersService, type GetMembersParams } from "../services/membersService";
import type { WelfareMember } from "@/components/tables/table-columns/welfare-member-table-columns";

export function useGetMembers(params?: GetMembersParams) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const queryParams: GetMembersParams = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...params,
  };

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["members", queryParams],
    queryFn: () => membersService.getAll(queryParams),
  });

  // Transform the response data
  const members: WelfareMember[] =
    data?.members || (Array.isArray(data) ? data : []);

  const pageCount = data?.pagination?.totalPages
    ? Math.ceil(data.pagination.totalPages)
    : -1;

  return {
    data: members,
    pagination,
    setPagination,
    isLoading,
    error,
    refetch,
    pageCount,
    total: data?.pagination?.total || members.length,
  };
}

