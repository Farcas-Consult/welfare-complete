"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { IconShield } from "@tabler/icons-react";
import { useLogin } from "../hooks/useAuthHook";
import { loginSchema, type LoginFormData } from "../schemas/auth-schemas";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconAlertCircle } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setError } from "@/store/slices/authSlice";
import { loginImage } from "@/app/assets";
import Image from "next/image";

export default function LoginPage() {
  const { mutate: login, isPending, error, reset } = useLogin();
  const authError = useAppSelector((state) => state.auth.error);
  const dispatch = useAppDispatch();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Check if there's an error to display
  const hasError = Boolean((authError && authError.trim()) || error);

  // Get error message
  const errorMessage =
    authError && authError.trim()
      ? authError
      : error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "Invalid username or password. Please try again.";

  function onSubmit(data: LoginFormData) {
    // Clear any previous errors when submitting again
    if (authError) {
      dispatch(setError(""));
    }
    if (error) {
      reset();
    }
    login(data);
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <IconShield className="size-4" />
            </div>
            Welfare System
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold">Welcome Back</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Sign in to your account to continue
                  </p>
                </div>
                {hasError && (
                  <Alert variant="destructive">
                    <IconAlertCircle />
                    <AlertTitle>Login Failed</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
                <Controller
                  name="username"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="username">Username</FieldLabel>
                      <Input
                        {...field}
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        autoComplete="username"
                        autoFocus
                        disabled={isPending}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <PasswordInput
                        {...field}
                        id="password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        disabled={isPending}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      <FieldDescription>
                        <Link
                          href="/auth/forgot-password"
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          Forgot password?
                        </Link>
                      </FieldDescription>
                    </Field>
                  )}
                />
                <Field>
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Signing in..." : "Sign In"}
                  </Button>
                </Field>
                <Field>
                  <p className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/auth/register"
                      className="text-primary hover:underline"
                    >
                      Sign up
                    </Link>
                  </p>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src={loginImage}
          alt="Welfare System"
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
          priority
        />
      </div>
    </div>
  );
}
