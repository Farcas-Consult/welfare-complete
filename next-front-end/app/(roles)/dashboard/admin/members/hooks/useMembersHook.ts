"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  membersService,
  type GetMembersParams,
  type CreateMemberDto,
  type UpdateMemberDto,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Member created successfully!");
      router.push("/dashboard/admin/members");
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

export function useUpdateMemberStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: WelfareMember["status"];
    }) => membersService.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Member status updated");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as Error).message ||
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
        "Failed to update status. Please try again.";
      toast.error(errorMessage);
    },
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => membersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Member deleted");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as Error).message ||
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
        "Failed to delete member. Please try again.";
      toast.error(errorMessage);
    },
  });
}

export function useGetMemberById(id?: string) {
  return useQuery({
    queryKey: ["member", id],
    queryFn: () => membersService.getById(id as string),
    enabled: !!id,
  });
}

export function useUpdateMember(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: UpdateMemberDto) => membersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["member", id] });
      toast.success("Member updated successfully!");
      router.push("/dashboard/admin/members");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as Error).message ||
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
        "Failed to update member. Please try again.";
      toast.error(errorMessage);
    },
  });
}
