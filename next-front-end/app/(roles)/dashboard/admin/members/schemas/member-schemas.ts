import { z } from "zod";

export const createMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  middleName: z.string().max(100).optional(),
  nationalId: z.string().max(50).optional(),
  phonePrimary: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[+]?[\d\s-()]+$/, "Invalid phone number format"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  status: z.enum(["active", "inactive", "suspended", "deceased"]).optional(),
  planId: z.string().uuid().optional().or(z.literal("")),
  kycStatus: z.boolean().optional(),
});

export type CreateMemberFormData = z.infer<typeof createMemberSchema>;

