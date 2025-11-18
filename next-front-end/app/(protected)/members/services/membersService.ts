import { fetchData, postData, putData, deleteData } from "@/lib/api/httpClient";
import type { WelfareMember } from "@/components/tables/table-columns/welfare-member-table-columns";

export interface CreateMemberDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  nationalId?: string;
  phonePrimary: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  status?: "active" | "inactive" | "suspended" | "deceased";
  planId?: string;
  kycStatus?: boolean;
}

export interface UpdateMemberDto extends Partial<CreateMemberDto> {}

export interface MembersResponse {
  members: WelfareMember[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetMembersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const membersService = {
  getAll: (params?: GetMembersParams) =>
    fetchData<MembersResponse>("/members", params as Record<string, string>),
  getById: (id: string) => fetchData<WelfareMember>(`/members/${id}`),
  create: (data: CreateMemberDto) => postData<CreateMemberDto, WelfareMember>("/members", data),
  update: (id: string, data: UpdateMemberDto) =>
    putData<UpdateMemberDto, WelfareMember>(`/members/${id}`, data),
  delete: (id: string) => deleteData<void, void>(`/members/${id}`),
};

