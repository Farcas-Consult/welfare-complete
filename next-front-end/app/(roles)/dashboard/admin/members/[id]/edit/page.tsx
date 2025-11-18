"use client";

import { useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoleProtectedRoute } from "@/components/auth/role-protected-route";
import { useGetMemberById, useUpdateMember } from "../../hooks/useMembersHook";
import type { WelfareMember } from "../../types/member-types";
import {
  createMemberSchema,
  type CreateMemberFormData,
} from "../../schemas/member-schemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconArrowLeft, IconEdit } from "@tabler/icons-react";
import { DatePickerField } from "@/components/ui/date-picker-field";

export default function EditMemberPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { data: member, isLoading } = useGetMemberById(id);
  const { mutate: updateMember, isPending } = useUpdateMember(id || "");
  const typedMember = member as
    | (WelfareMember & { kycStatus?: boolean })
    | undefined;

  const form = useForm<CreateMemberFormData>({
    resolver: zodResolver(createMemberSchema),
    values: typedMember
      ? {
          firstName: typedMember.firstName ?? "",
          lastName: typedMember.lastName ?? "",
          middleName: typedMember.middleName ?? "",
          nationalId: typedMember.nationalId ?? "",
          phonePrimary: typedMember.phonePrimary ?? "",
          email: typedMember.email ?? "",
          dateOfBirth: typedMember.dateOfBirth ?? "",
          gender:
            (typedMember.gender as CreateMemberFormData["gender"]) ?? undefined,
          status: typedMember.status ?? "active",
          kycStatus: typedMember.kycStatus ?? false,
        }
      : {
          firstName: "",
          lastName: "",
          middleName: "",
          nationalId: "",
          phonePrimary: "",
          email: "",
          dateOfBirth: "",
          gender: undefined,
          status: "active",
          kycStatus: false,
        },
  });

  function onSubmit(data: CreateMemberFormData) {
    updateMember({
      ...data,
      middleName: data.middleName || undefined,
      nationalId: data.nationalId || undefined,
      email: data.email || undefined,
      dateOfBirth: data.dateOfBirth || undefined,
      gender: data.gender || undefined,
    });
  }

  return (
    <RoleProtectedRoute
      allowedRoles={["admin", "treasurer", "secretary", "committee"]}
    >
      <div className="flex w-full justify-center px-2 py-6">
        <Card className="w-full max-w-3xl shadow-sm">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/admin/members">
                  <IconArrowLeft className="size-4" />
                  <span className="sr-only">Back to members</span>
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <IconEdit className="size-5 text-primary" />
                <CardTitle>Edit Member</CardTitle>
              </div>
            </div>
            <CardDescription>
              Update profile info for member #{id?.slice(0, 8)}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              id="admin-edit-member-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FieldGroup>
                <div className="grid gap-6 md:grid-cols-2">
                  <Controller
                    name="firstName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="firstName">
                          First Name *
                        </FieldLabel>
                        <Input
                          {...field}
                          id="firstName"
                          disabled={isPending || isLoading}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="lastName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="lastName">Last Name *</FieldLabel>
                        <Input
                          {...field}
                          id="lastName"
                          disabled={isPending || isLoading}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="middleName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="middleName">
                          Middle Name
                        </FieldLabel>
                        <Input
                          {...field}
                          id="middleName"
                          placeholder="Optional"
                          disabled={isPending || isLoading}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="nationalId"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="nationalId">
                          National ID
                        </FieldLabel>
                        <Input
                          {...field}
                          id="nationalId"
                          placeholder="Optional"
                          disabled={isPending || isLoading}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="phonePrimary"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="phonePrimary">Phone *</FieldLabel>
                        <Input
                          {...field}
                          id="phonePrimary"
                          type="tel"
                          disabled={isPending || isLoading}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                          {...field}
                          id="email"
                          type="email"
                          placeholder="Optional"
                          disabled={isPending || isLoading}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="dateOfBirth"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="dateOfBirth">
                          Date of Birth
                        </FieldLabel>
                        <DatePickerField
                          value={field.value || undefined}
                          onChange={(value) => field.onChange(value ?? "")}
                          disabled={isPending || isLoading}
                          placeholder="Select birth date"
                          fromYear={1940}
                          toYear={new Date().getFullYear()}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="gender"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="gender">Gender</FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isPending || isLoading}
                        >
                          <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="status"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="status">Status</FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isPending || isLoading}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="deceased">Deceased</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="kycStatus"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="kycStatus"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isPending || isLoading}
                          />
                          <FieldLabel
                            htmlFor="kycStatus"
                            className="cursor-pointer"
                          >
                            KYC Verified
                          </FieldLabel>
                        </div>
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              asChild
              className="w-full sm:w-auto"
              disabled={isPending}
            >
              <Link href="/dashboard/admin/members">Cancel</Link>
            </Button>
            <Button
              type="submit"
              form="admin-edit-member-form"
              disabled={isPending || isLoading}
              className="w-full sm:w-auto"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </RoleProtectedRoute>
  );
}
