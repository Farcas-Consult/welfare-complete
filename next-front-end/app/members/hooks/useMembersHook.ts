"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  membersService,
  type GetMembersParams,
  type CreateMemberDto,
} from "../services/membersService";
import type { WelfareMember } from "../types/member-types";

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

  const { data, isLoading, error, refetch } = useQuery({
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

export function useCreateMember() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateMemberDto) => membersService.create(data),
    onSuccess: (response) => {
      // Invalidate members query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Member created successfully!");
      router.push("/members");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as Error).message ||
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
        "Failed to create member. Please try again.";
      toast.error(errorMessage);
    },
  });
}
