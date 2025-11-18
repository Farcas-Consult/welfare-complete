// Welfare Member type based on backend structure
export interface WelfareMember {
  id: string;
  memberNo: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  phonePrimary: string;
  status: "active" | "inactive" | "suspended" | "deceased";
  createdAt?: string;
  dateOfBirth?: string;
  gender?: string;
  nationalId?: string;
  planId?: string;
}
