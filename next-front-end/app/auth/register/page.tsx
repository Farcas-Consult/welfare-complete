"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  IconShield,
  IconCheck,
  IconX,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useRegister, useCheckUsername } from "../hooks/useAuthHook";
import { registerSchema, type RegisterFormData } from "../schemas/auth-schemas";
import { Button } from "@/components/ui/button";
import { singUpImage } from "@/app/assets";
import Image from "next/image";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { LoaderIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setError as setAuthError } from "@/store/slices/authSlice";

export default function RegisterPage() {
  const { mutate: register, isPending, error, reset } = useRegister();
  const authError = useAppSelector((state) => state.auth.error);
  const dispatch = useAppDispatch();
  const [usernameValue, setUsernameValue] = React.useState("");
  const [debouncedUsername, setDebouncedUsername] = React.useState("");

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      phonePrimary: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  // Debounce username for API check
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(usernameValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [usernameValue]);

  const { data: usernameCheck, isLoading: isCheckingUsername } =
    useCheckUsername(debouncedUsername, debouncedUsername.length >= 3);

  const isUsernameAvailable = usernameCheck?.available;
  const showUsernameStatus =
    debouncedUsername.length >= 3 && !isCheckingUsername;

  const hasError = Boolean((authError && authError.trim()) || error);
  const errorMessage =
    authError && authError.trim()
      ? authError
      : error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "Registration failed. Please try again.";

  function onSubmit(data: RegisterFormData) {
    if (authError) {
      dispatch(setAuthError(""));
    }
    if (error) {
      reset();
    }
    if (showUsernameStatus && !isUsernameAvailable) {
      return;
    }
    const { confirmPassword, ...registerData } = data;
    void confirmPassword;
    register(registerData);
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
                  <h1 className="text-2xl font-bold">Create your account</h1>
                </div>
                {hasError && (
                  <Alert variant="destructive">
                    <IconAlertCircle />
                    <AlertTitle>Registration Failed</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="firstName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                        <Input
                          {...field}
                          id="firstName"
                          type="text"
                          placeholder="John"
                          autoComplete="given-name"
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
                    name="lastName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                        <Input
                          {...field}
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          autoComplete="family-name"
                          disabled={isPending}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  name="username"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={
                        fieldState.invalid ||
                        (showUsernameStatus && !isUsernameAvailable)
                      }
                    >
                      <FieldLabel htmlFor="username">Username</FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          id="username"
                          type="text"
                          placeholder="johndoe"
                          autoComplete="username"
                          disabled={isPending}
                          aria-invalid={
                            fieldState.invalid ||
                            (showUsernameStatus && !isUsernameAvailable)
                          }
                          onChange={(e) => {
                            field.onChange(e);
                            setUsernameValue(e.target.value);
                          }}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {isCheckingUsername && usernameValue.length >= 3 && (
                            <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
                          )}
                          {showUsernameStatus && isUsernameAvailable && (
                            <IconCheck className="size-4 text-green-600" />
                          )}
                          {showUsernameStatus && !isUsernameAvailable && (
                            <IconX className="size-4 text-red-600" />
                          )}
                        </div>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      {showUsernameStatus &&
                        !isUsernameAvailable &&
                        !fieldState.invalid && (
                          <FieldError
                            errors={[{ message: "Username is already taken" }]}
                          />
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
                        placeholder="john@example.com"
                        autoComplete="email"
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
                  name="phonePrimary"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="phonePrimary">
                        Phone Number
                      </FieldLabel>
                      <Input
                        {...field}
                        id="phonePrimary"
                        type="tel"
                        placeholder="+254 712 345 678"
                        autoComplete="tel"
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
                        autoComplete="new-password"
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
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FieldLabel>
                      <PasswordInput
                        {...field}
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        disabled={isPending}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Field>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      isPending ||
                      !form.formState.isValid ||
                      (showUsernameStatus && !isUsernameAvailable)
                    }
                  >
                    {isPending ? "Creating account..." : "Create Account"}
                  </Button>
                </Field>
                <Field>
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="text-primary hover:underline"
                    >
                      Sign in
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
          src={singUpImage}
          alt="Welfare System"
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
          priority
        />
      </div>
    </div>
  );
}
