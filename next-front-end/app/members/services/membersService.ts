import { fetchData, postData, putData, deleteData } from "@/lib/api/httpClient";
import type { WelfareMember } from "../types/member-types";

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

const toQueryParams = (params?: GetMembersParams) => {
  if (!params) return undefined;
  return Object.entries(params).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (value === undefined || value === null) return acc;
      acc[key] = String(value);
      return acc;
    },
    {}
  );
};

export const membersService = {
  getAll: async (params?: GetMembersParams) => {
    const response = await fetchData<{ data: MembersResponse }>(
      "/members",
      toQueryParams(params)
    );
    return response.data;
  },
  getById: async (id: string) => {
    const response = await fetchData<{ data: WelfareMember }>(`/members/${id}`);
    return response.data;
  },
  create: async (data: CreateMemberDto) => {
    const response = await postData<CreateMemberDto, { data: WelfareMember }>(
      "/members",
      data
    );
    return response.data;
  },
  update: async (id: string, data: UpdateMemberDto) => {
    const response = await putData<UpdateMemberDto, { data: WelfareMember }>(
      `/members/${id}`,
      data
    );
    return response.data;
  },
  delete: (id: string) => deleteData<void, void>(`/members/${id}`),
};
