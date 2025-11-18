"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { IconUserPlus, IconArrowLeft } from "@tabler/icons-react";
import { useCreateMember } from "../hooks/useMembersHook";
import {
  createMemberSchema,
  type CreateMemberFormData,
} from "../schemas/member-schemas";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DatePickerField } from "@/components/ui/date-picker-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RoleProtectedRoute } from "@/components/auth/role-protected-route";

export default function CreateMemberPage() {
  const router = useRouter();
  const { mutate: createMember, isPending } = useCreateMember();

  const form = useForm<CreateMemberFormData>({
    resolver: zodResolver(createMemberSchema),
    defaultValues: {
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
    const submitData = {
      ...data,
      email: data.email || undefined,
      middleName: data.middleName || undefined,
      nationalId: data.nationalId || undefined,
      dateOfBirth: data.dateOfBirth || undefined,
      gender: data.gender || undefined,
      planId: data.planId || undefined,
    };
    createMember(submitData);
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
                <IconUserPlus className="size-5 text-primary" />
                <CardTitle>Register New Member</CardTitle>
              </div>
            </div>
            <CardDescription>
              Capture the core profile information to onboard a new welfare
              member.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              id="admin-create-member-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FieldGroup>
          <div className="grid gap-6 md:grid-cols-2">
            {/* First Name */}
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="firstName">First Name *</FieldLabel>
                  <Input
                    {...field}
                    id="firstName"
                    placeholder="Enter first name"
                    disabled={isPending}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Last Name */}
            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="lastName">Last Name *</FieldLabel>
                  <Input
                    {...field}
                    id="lastName"
                    placeholder="Enter last name"
                    disabled={isPending}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Middle Name */}
            <Controller
              name="middleName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="middleName">Middle Name</FieldLabel>
                  <Input
                    {...field}
                    id="middleName"
                    placeholder="Enter middle name (optional)"
                    disabled={isPending}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* National ID */}
            <Controller
              name="nationalId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="nationalId">National ID</FieldLabel>
                  <Input
                    {...field}
                    id="nationalId"
                    placeholder="Enter national ID (optional)"
                    disabled={isPending}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Phone Primary */}
            <Controller
              name="phonePrimary"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="phonePrimary">Phone Number *</FieldLabel>
                  <Input
                    {...field}
                    id="phonePrimary"
                    type="tel"
                    placeholder="+254 700 000 000"
                    disabled={isPending}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Email */}
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
                    placeholder="member@example.com (optional)"
                    disabled={isPending}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Date of Birth */}
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
                          disabled={isPending}
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

            {/* Gender */}
            <Controller
              name="gender"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="gender">Gender</FieldLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
                    <SelectTrigger
                      id="gender"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select gender (optional)" />
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

            {/* Status */}
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
                    <SelectTrigger
                      id="status"
                      aria-invalid={fieldState.invalid}
                    >
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

            {/* KYC Status */}
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
                      disabled={isPending}
                    />
                    <FieldLabel htmlFor="kycStatus" className="cursor-pointer">
                      KYC Verified
                    </FieldLabel>
                  </div>
                  <FieldDescription>
                    Check if member has completed KYC verification
                  </FieldDescription>
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
              onClick={() => router.back()}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="admin-create-member-form"
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? "Creating..." : "Create Member"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </RoleProtectedRoute>
  );
}
